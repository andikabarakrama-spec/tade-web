import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { UserRole, UserProfile } from '../types';
import { DataService } from '../services/db';

interface RegisterData {
  nama: string;
  email: string;
  password: string;
  nomorHP: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  activeRole: UserRole;
  registerWithEmail: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; isPending?: boolean }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; isPending?: boolean }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; isPending?: boolean }>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // In-flight profile loader deduplication to prevent promise contention between onAuthStateChanged and loginWithEmail
  const inFlightLoaders = useRef<Map<string, Promise<UserProfile | null>>>(new Map());

  // Load & sync profile from Firestore on Auth change
  const loadProfile = async (user: FirebaseUser): Promise<UserProfile | null> => {
    const t0 = performance.now();
    console.log(`[LOGIN-04] [${t0.toFixed(2)}ms] loadProfile START (uid: ${user.uid})`);

    const existingPromise = inFlightLoaders.current.get(user.uid);
    if (existingPromise) {
      console.log(`[LOGIN-04] [${performance.now().toFixed(2)}ms] loadProfile returning existing in-flight promise for ${user.uid}`);
      return existingPromise;
    }

    const loaderPromise = (async () => {
      try {
        const t1 = performance.now();
        console.log(`[LOGIN-05] [${t1.toFixed(2)}ms] getUserProfile START (uid: ${user.uid})`);
        let profile = await DataService.getUserProfile(user.uid);
        const t2 = performance.now();
        console.log(`[LOGIN-06] [${t2.toFixed(2)}ms] getUserProfile RESOLVED (found: ${!!profile})`);

        if (!profile) {
          const hasSuperAdminAlready = await DataService.hasSuperAdmin();
          const isFirstSetup = !hasSuperAdminAlready;

          const defaultRole: UserRole = isFirstSetup ? 'SUPER_ADMIN' : 'CALON_WALI_MURID';
          const defaultStatus: 'active' | 'pending' = (defaultRole === 'SUPER_ADMIN') ? 'active' : 'pending';

          const newProfile: UserProfile = {
            uid: user.uid,
            id: user.uid,
            nama: user.displayName || user.email?.split('@')[0] || 'Pengguna Asy Syifa',
            name: user.displayName || user.email?.split('@')[0] || 'Pengguna Asy Syifa',
            email: user.email || '',
            nomorHP: user.phoneNumber || '',
            phone: user.phoneNumber || '',
            role: defaultRole,
            status: defaultStatus,
            avatar: user.photoURL || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          await DataService.setUserProfile(newProfile);
          profile = newProfile;
          setUserProfile(profile);

          // Secondary operations run in background (non-blocking)
          DataService.createApprovalRequest({
            id: `REQ_USER_${user.uid}`,
            type: 'USER_REGISTRATION',
            module: 'R2 - User & RBAC',
            requesterId: user.uid,
            requesterName: newProfile.nama,
            targetId: user.uid,
            title: `Pendaftaran User Baru: ${newProfile.nama}`,
            description: `Pengajuan akun ${newProfile.role} oleh ${newProfile.nama} (${newProfile.email})`,
            payload: { uid: user.uid, nama: newProfile.nama, email: newProfile.email, nomorHP: newProfile.nomorHP, role: newProfile.role },
            status: newProfile.status === 'active' ? 'approved' : newProfile.status === 'suspended' ? 'suspended' : 'pending',
            approverRole: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'],
            createdAt: newProfile.createdAt,
            updatedAt: newProfile.createdAt,
            uid: user.uid,
            nama: newProfile.nama,
            email: newProfile.email,
            nomorHP: newProfile.nomorHP,
            role: newProfile.role,
            requestedAt: newProfile.createdAt
          }).catch((err) => {
            console.warn('[Approval Request Secondary Async Note]:', err);
          });
        } else {
          setUserProfile(profile);
        }

        const t3 = performance.now();
        console.log(`[LOGIN-07] [${t3.toFixed(2)}ms] profile status/result: role=${profile?.role}, status=${profile?.status}`);
        console.log(`[LOGIN-08] [${t3.toFixed(2)}ms] loadProfile RESOLVED`);
        return profile;
      } catch (err) {
        console.error('[LOGIN-08] Error loading user profile from Firestore:', err);
        return null;
      } finally {
        inFlightLoaders.current.delete(user.uid);
      }
    })();

    inFlightLoaders.current.set(user.uid, loaderPromise);
    return loaderPromise;
  };

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const tAuth0 = performance.now();
      console.log(`[AUTH-LISTENER-01] [${tAuth0.toFixed(2)}ms] START onAuthStateChanged (user: ${user?.uid ? 'present' : 'null'})`);
      setCurrentUser(user);
      if (user) {
        console.log(`[AUTH-LISTENER-02] [${performance.now().toFixed(2)}ms] loadProfile START`);
        await loadProfile(user);
        console.log(`[AUTH-LISTENER-03] [${performance.now().toFixed(2)}ms] loadProfile RESOLVED`);

        // Realtime Firestore listener for profile status and role updates
        try {
          // Sync device FCM token to Firestore if cached or available
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            const cachedToken = localStorage.getItem('tade_fcm_token');
            if (cachedToken) {
              DataService.registerFCMToken(user.uid, cachedToken).catch((err) => {
                console.warn('[TADE FCM] Background token sync note:', err);
              });
            }
          }

          unsubSnapshot = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const updatedProf: UserProfile = {
                uid: docSnap.id,
                id: docSnap.id,
                nama: data.nama || data.name || 'Pengguna',
                name: data.nama || data.name || 'Pengguna',
                email: data.email || '',
                nomorHP: data.nomorHP || data.phone || '',
                phone: data.nomorHP || data.phone || '',
                role: (data.role || 'CALON_WALI_MURID') as UserRole,
                status: (data.status || 'pending') as 'active' | 'pending' | 'rejected' | 'suspended',
                avatar: data.avatar || '',
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString()
              };
              setUserProfile(updatedProf);
            }
          }, (err) => {
            console.warn('Firestore snapshot listener connection status:', err?.message || err);
          });
        } catch (e) {
          console.error('Snapshot listener error:', e);
        }
      } else {
        if (unsubSnapshot) unsubSnapshot();
        setUserProfile(null);
      }
      console.log(`[AUTH-LISTENER-04] [${performance.now().toFixed(2)}ms] setIsLoading(false)`);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  const refreshUserProfile = async () => {
    if (currentUser) {
      await loadProfile(currentUser);
    }
  };

  const registerWithEmail = async ({ nama, email, password, nomorHP, role }: RegisterData) => {
    try {
      const hasSuperAdminAlready = await DataService.hasSuperAdmin();

      // Bootstrap Safeguard: Only allow SUPER_ADMIN registration if NO Super Admin exists
      if (role === 'SUPER_ADMIN' && hasSuperAdminAlready) {
        return {
          success: false,
          error: 'Super Admin sudah terdaftar di sistem. Pembuatan Super Admin kedua tidak diizinkan.'
        };
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const isSuperAdminActive = (role === 'SUPER_ADMIN') && !hasSuperAdminAlready;
      const initialStatus: 'active' | 'pending' = isSuperAdminActive ? 'active' : 'pending';

      const newProfile: UserProfile = {
        uid: user.uid,
        id: user.uid,
        nama,
        name: nama,
        email: user.email || email,
        nomorHP,
        phone: nomorHP,
        role,
        status: initialStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await DataService.setUserProfile(newProfile);
      await DataService.createApprovalRequest({
        id: `REQ_USER_${user.uid}`,
        type: 'USER_REGISTRATION',
        module: 'R2 - User & RBAC',
        requesterId: user.uid,
        requesterName: nama,
        targetId: user.uid,
        title: `Pendaftaran User Baru: ${nama}`,
        description: `Pengajuan peran ${role} oleh ${nama} (${email})`,
        payload: { uid: user.uid, nama, email, nomorHP, role },
        status: initialStatus === 'active' ? 'approved' : 'pending',
        approverRole: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'],
        createdAt: newProfile.createdAt,
        updatedAt: newProfile.createdAt,
        uid: user.uid,
        nama,
        email,
        nomorHP,
        role,
        requestedAt: newProfile.createdAt
      });

      // Audit Log
      await DataService.createAuditLog({
        uid: user.uid,
        userName: nama,
        role,
        action: 'Register',
        targetModule: 'Auth & Registration'
      });

      setUserProfile(newProfile);
      return { success: true };
    } catch (err: any) {
      console.error('Registration Error:', err);
      let error = 'Gagal mendaftar. Silakan coba lagi.';
      if (err.code === 'auth/email-already-in-use') {
        error = 'Email sudah terdaftar. Silakan login.';
      } else if (err.code === 'auth/weak-password') {
        error = 'Password terlalu lemah (minimal 6 karakter).';
      } else if (err.code === 'auth/invalid-email') {
        error = 'Format email tidak valid.';
      }
      return { success: false, error };
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    const t0 = performance.now();
    console.log(`[LOGIN-02] [${t0.toFixed(2)}ms] signInWithEmailAndPassword START`);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const t1 = performance.now();
      console.log(`[LOGIN-03] [${t1.toFixed(2)}ms] Firebase Auth RESOLVED (uid: ${user.uid})`);

      // Ensure official Firestore user profile & RBAC is loaded
      const profile = await loadProfile(user);

      // Non-critical asynchronous audit log & security notification (fire-and-forget)
      const userDisplayName = profile?.nama || profile?.name || user.displayName || user.email?.split('@')[0] || email;
      const userRole = profile?.role || 'CALON_WALI_MURID';

      DataService.createAuditLog({
        uid: user.uid,
        userName: userDisplayName,
        role: userRole,
        action: 'Login',
        targetModule: 'Auth & Login'
      }).catch((err) => console.warn('[Audit Log Async Error]:', err));

      DataService.logSecurityNotification(
        user.uid,
        userDisplayName,
        userRole,
        'LOGIN_SUCCESS'
      ).catch((err) => console.warn('[Security Notification Async Error]:', err));

      if (profile && profile.status !== 'active') {
        console.log(`[LOGIN-09] [${performance.now().toFixed(2)}ms] loginWithEmail PENDING APPROVAL RETURN`);
        return {
          success: false,
          isPending: true,
          error: 'Akun sedang menunggu persetujuan Administrator.'
        };
      }

      console.log(`[LOGIN-09] [${performance.now().toFixed(2)}ms] loginWithEmail SUCCESS RETURN`);
      return { success: true };
    } catch (err: any) {
      console.error('[LOGIN-09] Login Error:', err);
      let error = 'Email atau password yang Anda masukkan salah.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        error = 'Email atau password yang Anda masukkan salah.';
      } else if (err.code === 'auth/too-many-requests') {
        error = 'Terlalu banyak percobaan login. Coba lagi nanti.';
      } else if (err.code === 'auth/network-request-failed') {
        error = 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
      } else if (err.code === 'auth/user-disabled') {
        error = 'Akun ini telah dinonaktifkan oleh Administrator.';
      } else if (err.message && !err.code) {
        error = err.message;
      }

      // Non-critical asynchronous security notification for failed login
      DataService.logSecurityNotification(
        'UNKNOWN_UID',
        email,
        'CALON_WALI_MURID',
        'LOGIN_FAILED'
      ).catch((err) => console.warn('[Security Notification Async Error]:', err));

      return { success: false, error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const profile = await loadProfile(res.user);
        const userDisplayName = profile?.nama || profile?.name || res.user.displayName || res.user.email || 'Google User';
        const userRole = profile?.role || 'CALON_WALI_MURID';

        DataService.createAuditLog({
          uid: res.user.uid,
          userName: userDisplayName,
          role: userRole,
          action: 'Login Google',
          targetModule: 'Auth & Google'
        }).catch((err) => console.warn('[Audit Log Google Async Error]:', err));

        DataService.logSecurityNotification(
          res.user.uid,
          userDisplayName,
          userRole,
          'LOGIN_SUCCESS'
        ).catch((err) => console.warn('[Security Notification Google Async Error]:', err));

        if (profile && profile.status !== 'active') {
          return {
            success: false,
            isPending: true,
            error: 'Akun sedang menunggu persetujuan Administrator.'
          };
        }
      }
      return { success: true };
    } catch (e: any) {
      console.error('Google login error:', e);
      return { success: false, error: e.message || 'Gagal login dengan Google.' };
    }
  };

  const logout = async () => {
    try {
      if (currentUser && userProfile) {
        // Disable this device's token in Firestore on logout (preserves other devices)
        const cachedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('tade_fcm_token') : null;
        if (cachedToken) {
          try {
            await DataService.disableFCMToken(currentUser.uid, cachedToken);
          } catch (tokErr) {
            console.warn('[TADE FCM] Note disabling token on logout:', tokErr);
          }
        }

        await DataService.createAuditLog({
          uid: currentUser.uid,
          userName: userProfile.nama || userProfile.name || 'Pengguna',
          role: userProfile.role,
          action: 'Logout',
          targetModule: 'Auth'
        });

        await DataService.logSecurityNotification(
          currentUser.uid,
          userProfile.nama || userProfile.name || 'Pengguna',
          userProfile.role,
          'LOGOUT'
        );
      }
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const activeRole: UserRole = userProfile?.role || 'CALON_WALI_MURID';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        userProfile,
        isLoading,
        activeRole,
        registerWithEmail,
        loginWithEmail,
        login: loginWithEmail,
        loginWithGoogle,
        logout,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
