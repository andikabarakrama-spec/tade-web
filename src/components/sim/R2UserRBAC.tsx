import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserRole, UserProfile, CentralApprovalRequest } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import { SIMEmptyState } from './SIMEmptyState';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Ban, 
  FileCheck, 
  AlertTriangle, 
  Sparkles,
  Info,
  UserCheck,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface FeedbackState {
  type: 'success' | 'error' | 'info';
  message: string;
}

const CANONICAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KETUA_YAYASAN',
  'KEPALA_SEKOLAH',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
] as const;

export const R2UserRBAC: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'approvals' | 'users'>('approvals');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [approvals, setApprovals] = useState<CentralApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [rejectReasonModal, setRejectReasonModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Async concurrency & anti-double-submit guards
  const [processingApprovalId, setProcessingApprovalId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [updatingRoleUid, setUpdatingRoleUid] = useState<string | null>(null);

  // In-app Feedback State (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const [newUser, setNewUser] = useState<{
    uid: string;
    nama: string;
    email: string;
    nomorHP: string;
    role: UserRole;
    status: 'active' | 'pending';
  }>({
    uid: '',
    nama: '',
    email: '',
    nomorHP: '',
    role: 'GURU',
    status: 'pending'
  });

  // 1. CANONICAL ROLE & AUTHENTICATION RESOLUTION (FAIL-CLOSED)
  // Authoritative session role: activeRole must match canonical roles list.
  // Zero fallback to userProfile.role. Zero privileged defaults.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Authentic actor identity derived strictly from authenticated session
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    const cleanProfileName = (userProfile?.nama || userProfile?.name)?.trim();
    if (cleanProfileName) return cleanProfileName;
    const cleanDisplayName = currentUser?.displayName?.trim();
    if (cleanDisplayName) return cleanDisplayName;
    const cleanEmail = currentUser?.email?.trim();
    if (cleanEmail) return cleanEmail;
    return `User (${currentUser.uid.slice(0, 8)})`;
  }, [currentUser?.uid, currentUser?.displayName, currentUser?.email, userProfile?.nama, userProfile?.name]);

  const actorUid = currentUser?.uid || '';

  // Operational Authority Gates:
  // - SUPER_ADMIN and ADMIN have full user & role management authority.
  // - KEPALA_SEKOLAH has central approval authority alongside SUPER_ADMIN and ADMIN.
  const isSuperAdmin = Boolean(currentUser?.uid && verifiedActiveRole === 'SUPER_ADMIN');
  const canManageRoles = Boolean(
    currentUser?.uid &&
      verifiedActiveRole &&
      (verifiedActiveRole === 'SUPER_ADMIN' || verifiedActiveRole === 'ADMIN')
  );
  const canApprove = Boolean(
    currentUser?.uid &&
      verifiedActiveRole &&
      (verifiedActiveRole === 'SUPER_ADMIN' ||
        verifiedActiveRole === 'ADMIN' ||
        verifiedActiveRole === 'KEPALA_SEKOLAH')
  );
  const canAccessR2 = canApprove || canManageRoles;

  // 2. PRE-QUERY AUTHORIZATION GATE
  // Sensitive queries are strictly forbidden before authorization is verified.
  const loadData = useCallback(async () => {
    // FAIL CLOSED: No sensitive queries may execute before authorization.
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR2) {
      setLoading(false);
      setUsers([]);
      setApprovals([]);
      return;
    }

    setLoading(true);
    try {
      const [uList, aList] = await Promise.all([
        canManageRoles ? DataService.getAllUsers() : Promise.resolve([]),
        DataService.getApprovalRequests()
      ]);
      if (canManageRoles) setUsers(uList || []);
      setApprovals(aList || []);
    } catch (err: any) {
      console.error('Failed loading RBAC data', err);
      setFeedback({
        type: 'error',
        message: `STATUS: GAGAL → Gagal memuat data pengguna/persetujuan: ${err?.message || err}. Silakan coba kembali.`
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, verifiedActiveRole, canAccessR2, canManageRoles]);

  useEffect(() => {
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR2) {
      setLoading(false);
      setUsers([]);
      setApprovals([]);
      return;
    }

    loadData();

    // Establish real-time Firestore subscription ONLY for authorized authenticated sessions
    const unsub = DataService.subscribeApprovalRequests(newList => {
      setApprovals(newList || []);
    });

    return () => {
      if (typeof unsub === 'function') {
        unsub();
      }
    };
  }, [currentUser?.uid, verifiedActiveRole, canAccessR2, loadData]);

  // Auto-dismiss feedback banner
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // 3. HANDLER-LEVEL AUTHORIZATION & ANTI-DOUBLE-SUBMIT: ADD USER PROFILE
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingUser) return;

    if (!currentUser?.uid || !verifiedActiveRole || !canManageRoles || !actorName) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Anda tidak memiliki wewenang untuk menambah user manual.'
      });
      return;
    }

    const cleanUid = newUser.uid.trim();
    const cleanNama = newUser.nama.trim();
    const cleanEmail = newUser.email.trim();

    // Strict validation: Require authentic Firebase UID to prevent synthetic UIDs
    if (!cleanUid || cleanUid.startsWith('usr-') || cleanUid.startsWith('USR-') || cleanUid.toLowerCase() === 'system' || cleanUid.length < 6) {
      setFeedback({
        type: 'error',
        message: 'STATUS: VALIDASI GAGAL → UID Firebase Auth autentik wajib diisi (minimal 6 karakter, bukan ID sintetis).'
      });
      return;
    }

    if (!cleanNama || !cleanEmail) {
      setFeedback({
        type: 'error',
        message: 'STATUS: VALIDASI GAGAL → Nama lengkap dan email pengguna wajib diisi.'
      });
      return;
    }

    if (!CANONICAL_ROLES.includes(newUser.role)) {
      setFeedback({
        type: 'error',
        message: 'STATUS: VALIDASI GAGAL → Role yang dipilih tidak valid.'
      });
      return;
    }

    // Escalation check: Only SUPER_ADMIN can create a SUPER_ADMIN account
    if (newUser.role === 'SUPER_ADMIN' && !isSuperAdmin) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Proteksi Eskalasi: Hanya SUPER_ADMIN yang memiliki kewenangan membuat akun SUPER_ADMIN.'
      });
      return;
    }

    setIsSubmittingUser(true);
    try {
      const created: UserProfile = {
        uid: cleanUid,
        id: cleanUid,
        nama: cleanNama,
        name: cleanNama,
        email: cleanEmail,
        nomorHP: newUser.nomorHP.trim() || '-',
        phone: newUser.nomorHP.trim() || '-',
        role: newUser.role,
        status: newUser.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await DataService.setUserProfile(created);
      await DataService.createApprovalRequest({
        id: `REQ_USER_${cleanUid}`,
        type: 'USER_REGISTRATION',
        module: 'R2 - User & RBAC',
        requesterId: actorUid,
        requesterName: actorName,
        targetId: cleanUid,
        title: `Pendaftaran Profil User: ${cleanNama}`,
        description: `Penambahan profil pengguna resmi oleh ${actorName} (${verifiedActiveRole})`,
        payload: created,
        status: newUser.status === 'active' ? 'approved' : 'pending',
        approverRole: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'],
        createdAt: created.createdAt,
        updatedAt: created.createdAt,
        uid: cleanUid,
        nama: cleanNama,
        email: cleanEmail,
        nomorHP: created.nomorHP,
        role: newUser.role,
        requestedAt: created.createdAt
      });

      // Canonical Audit Log without synthetic identities
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        'CREATE_USER',
        `Menambahkan profil pengguna ${cleanNama} (${cleanEmail}) dengan role ${newUser.role} (UID: ${cleanUid}, Status: ${newUser.status})`
      ).catch(() => {});

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Profil pengguna ${cleanNama} (${newUser.role}) berhasil disimpan ke Firestore.`
      });
      setShowModal(false);
      setNewUser({ uid: '', nama: '', email: '', nomorHP: '', role: 'GURU', status: 'pending' });
      await loadData();
    } catch (err: any) {
      console.error('Failed adding user', err);
      setFeedback({
        type: 'error',
        message: `STATUS: GAGAL → Gagal menambahkan user baru: ${err?.message || err}. Data tidak tersimpan.`
      });
    } finally {
      setIsSubmittingUser(false);
    }
  };

  // 4. HANDLER-LEVEL AUTHORIZATION: CENTRAL APPROVAL
  const handleApproveCentral = async (reqId: string) => {
    if (processingApprovalId) return;

    if (!currentUser?.uid || !verifiedActiveRole || !canApprove || !actorName) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Hanya Super Admin, Admin, dan Kepala Sekolah yang dapat melakukan approval.'
      });
      return;
    }

    const targetReq = approvals.find(a => a.id === reqId);
    if (!targetReq) {
      setFeedback({
        type: 'error',
        message: 'STATUS: GAGAL → Permohonan persetujuan tidak ditemukan.'
      });
      return;
    }

    setProcessingApprovalId(reqId);
    try {
      await DataService.approveRequest(reqId, actorUid, actorName, verifiedActiveRole);

      // Canonical Audit Log
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        'APPROVE_CENTRAL_REQUEST',
        `Menyetujui permohonan ${targetReq?.title || reqId} (Tipe: ${targetReq?.type || 'GENERAL'}, Target: ${targetReq?.targetId || targetReq?.requesterName || '-'})`
      ).catch(() => {});

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Permohonan ${targetReq?.title || reqId} berhasil disetujui (APPROVED).`
      });
      await loadData();
    } catch (err: any) {
      console.error('Failed approving request', err);
      setFeedback({
        type: 'error',
        message: `STATUS: GAGAL → Gagal memproses persetujuan: ${err?.message || err}. Status belum diubah.`
      });
    } finally {
      setProcessingApprovalId(null);
    }
  };

  // 5. HANDLER-LEVEL AUTHORIZATION: CENTRAL REJECTION
  const handleRejectCentral = async () => {
    if (isRejecting || !rejectReasonModal) return;

    if (!currentUser?.uid || !verifiedActiveRole || !canApprove || !actorName) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Hanya Super Admin, Admin, dan Kepala Sekolah yang dapat menolak approval.'
      });
      return;
    }

    const targetReqId = rejectReasonModal;
    const targetReq = approvals.find(a => a.id === targetReqId);
    const cleanReason = rejectReason.trim() || 'Tidak memenuhi syarat verifikasi administrasi';

    setIsRejecting(true);
    try {
      await DataService.rejectRequest(targetReqId, actorUid, actorName, verifiedActiveRole, cleanReason);

      // Canonical Audit Log
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        'REJECT_CENTRAL_REQUEST',
        `Menolak permohonan ${targetReq?.title || targetReqId} dengan alasan: ${cleanReason}`
      ).catch(() => {});

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Permohonan ${targetReq?.title || targetReqId} berhasil ditolak (REJECTED).`
      });
      setRejectReasonModal(null);
      setRejectReason('');
      await loadData();
    } catch (err: any) {
      console.error('Failed rejecting request', err);
      setFeedback({
        type: 'error',
        message: `STATUS: GAGAL → Gagal menolak permohonan: ${err?.message || err}. Status belum diubah.`
      });
    } finally {
      setIsRejecting(false);
    }
  };

  // 6. HANDLER-LEVEL AUTHORIZATION & ANTI-DOUBLE-SUBMIT: ROLE MUTATION
  const handleUpdateRole = async (targetUid: string, targetName: string, newRole: UserRole, currentRole: UserRole) => {
    if (updatingRoleUid) return;

    if (!currentUser?.uid || !verifiedActiveRole || !canManageRoles || !actorName) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Hanya Super Admin & Admin yang berhak mengubah role pengguna.'
      });
      return;
    }

    if (!targetUid || targetUid.startsWith('usr-') || targetUid.startsWith('USR-')) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Target UID tidak valid atau merupakan akun sintetis yang tidak sah.'
      });
      return;
    }

    if (!CANONICAL_ROLES.includes(newRole)) {
      setFeedback({
        type: 'error',
        message: `STATUS: DITOLAK → Role ${newRole} tidak valid dalam daftar canonical roles institusi.`
      });
      return;
    }

    if (newRole === currentRole) return;

    // Escalation Protection: Only SUPER_ADMIN can promote to SUPER_ADMIN
    if (newRole === 'SUPER_ADMIN' && !isSuperAdmin) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Proteksi Eskalasi: Hanya SUPER_ADMIN yang memiliki kewenangan menetapkan role SUPER_ADMIN.'
      });
      return;
    }

    // Demotion Protection: Only SUPER_ADMIN can alter an existing SUPER_ADMIN
    if (currentRole === 'SUPER_ADMIN' && !isSuperAdmin) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Proteksi Otoritas: Hanya SUPER_ADMIN yang berhak mengubah role akun SUPER_ADMIN.'
      });
      return;
    }

    // Self-escalation / self-role change protection
    if (targetUid === currentUser.uid && newRole !== currentRole && !isSuperAdmin) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Proteksi Integritas: Anda tidak dapat mengubah role akun sesi Anda sendiri.'
      });
      return;
    }

    setUpdatingRoleUid(targetUid);
    try {
      await DataService.updateUserRole(targetUid, newRole);

      // Canonical Audit Log
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        'UPDATE_USER_ROLE',
        `Mengubah role pengguna ${targetName} (${targetUid}) dari ${currentRole} menjadi ${newRole}`
      ).catch(() => {});

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Role pengguna ${targetName} berhasil diperbarui dari ${currentRole} ke ${newRole}.`
      });
      await loadData();
    } catch (err: any) {
      console.error('Failed updating role', err);
      setFeedback({
        type: 'error',
        message: `STATUS: GAGAL → Gagal mengubah role pengguna: ${err?.message || err}. Role tidak berubah.`
      });
    } finally {
      setUpdatingRoleUid(null);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  const filteredApprovals = approvals.filter(a => {
    const matchSearch = 
      (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.requesterName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === 'ALL' ? true : a.status === statusFilter;
    const matchType = typeFilter === 'ALL' ? true : a.type === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  const filteredUsers = users.filter(u =>
    (u.nama || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 7. UI / DOM ISOLATION: UNAUTHORIZED ACCESS STATE (FAIL-CLOSED)
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessR2) {
    return (
      <div id="r2-access-denied-container" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full inline-block">
              Akses Dibatasi — Central Approval & RBAC
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Otoritas Tidak Memadai
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Modul <strong>R2 (Pusat Persetujuan Sistem & Manajemen RBAC)</strong> mengelola hak akses institusi dan permohonan persetujuan bertingkat. Akses dibatasi ketat hanya untuk peran <strong>SUPER_ADMIN</strong>, <strong>ADMIN</strong>, dan <strong>KEPALA_SEKOLAH</strong> (khusus persetujuan).
            </p>
          </div>
          <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-200 max-w-sm mx-auto flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Peran Sesi Anda: <strong>{verifiedActiveRole || 'Tidak Terautentikasi'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Module R2 - Central Approval Engine v25.2
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            Pusat Persetujuan System & Management RBAC
          </h1>
          <p className="text-stone-500 text-xs">
            Pusat pengelolaan persetujuan berjenjang (<code className="text-emerald-800 bg-stone-100 px-1 py-0.5 rounded">approval_requests</code>) dan kontrol hak akses terintegrasi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-refresh-rbac"
            disabled={loading}
            onClick={loadData}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-2xl shadow-xs transition cursor-pointer disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {activeTab === 'users' && canManageRoles && (
            <button
              id="btn-add-user-modal"
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Plus className="w-4 h-4" /> Tambah User Manual
            </button>
          )}
        </div>
      </div>

      {/* Asy Contextual Advisory Banner */}
      <div id="r2-asy-advisory" className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-emerald-900">
        <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
          Asy
        </div>
        <div className="space-y-0.5">
          <div className="font-bold flex items-center gap-1.5 text-emerald-950">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Asistensi Tata Kelola & Otorisasi RBAC Asy Syifa
          </div>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            {pendingCount > 0 
              ? `Terdapat ${pendingCount} permohonan persetujuan menunggu verifikasi. Otoritas aktif: ${verifiedActiveRole || 'TIDAK TERIDENTIFIKASI'}. Proteksi eskalasi role mencegah penetapan hak akses administratif tanpa wewenang SUPER_ADMIN.`
              : `Semua permohonan persetujuan terverifikasi. Terdaftar ${users.length} pengguna aktif dengan perlindungan Zero Trust dan batasan eskalasi role.`}
          </p>
        </div>
      </div>

      {/* Feedback State Banner */}
      {feedback && (
        <div 
          id="r2-feedback-banner"
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between border shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : feedback.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs Header */}
      <div id="r2-nav-tabs" className="flex items-center gap-3 border-b border-stone-200 pb-2">
        <button
          id="tab-approvals"
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Central Approval Engine
          {pendingCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-mono animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        {canManageRoles && (
          <button
            id="tab-users"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'users'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Manajemen User & Role RBAC
            <span className="bg-stone-200 text-stone-700 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {users.length}
            </span>
          </button>
        )}
      </div>

      {/* TAB 1: CENTRAL APPROVAL ENGINE */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                id="search-approvals"
                type="text"
                placeholder="Cari pengajuan..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                id="filter-approval-status"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-stone-50 cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="pending">Pending (Menunggu)</option>
                <option value="approved">Approved (Disetujui)</option>
                <option value="rejected">Rejected (Ditolak)</option>
                <option value="cancelled">Cancelled (Batal)</option>
              </select>

              <select
                id="filter-approval-type"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-stone-50 cursor-pointer"
              >
                <option value="ALL">Semua Modul</option>
                <option value="USER_REGISTRATION">User Registration</option>
                <option value="PPDB_VERIFICATION">PPDB Verification</option>
                <option value="PAYMENT_VERIFICATION">Payment Verification</option>
                <option value="DOCUMENT_APPROVAL">Document Approval</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
          </div>

          {loading ? (
            <SIMSkeletonLoader type="table" />
          ) : filteredApprovals.length === 0 ? (
            <SIMEmptyState 
              type="generic"
              title="Tidak Ada Pengajuan Persetujuan"
              description="Seluruh permohonan persetujuan akun baru, verifikasi PPDB, pembayaran, dan dokumen resmi akan dipusatkan di sini."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Judul & Deskripsi Request</th>
                    <th className="p-3">Modul & Tipe</th>
                    <th className="p-3">Pemohon</th>
                    <th className="p-3">Waktu Pengajuan</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredApprovals.map(a => {
                    const isProcessing = processingApprovalId === a.id;
                    return (
                      <tr key={a.id} className="hover:bg-stone-50 transition">
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{a.title || 'Pengajuan Persetujuan'}</p>
                          <p className="text-[11px] text-stone-500">{a.description}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-300">
                            {a.type || 'GENERAL'}
                          </span>
                          <p className="text-[10px] text-stone-500 mt-0.5">{a.module}</p>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {a.requesterName || a.nama || '-'}
                          {a.role && <span className="block text-[10px] text-stone-500">{a.role}</span>}
                        </td>
                        <td className="p-3 text-stone-500 font-mono text-[11px]">
                          {new Date(a.createdAt || a.requestedAt || Date.now()).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          {a.status === 'approved' && (
                            <span className="px-2.5 py-1 rounded-md font-bold text-emerald-800 bg-emerald-100 text-[10px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> APPROVED
                            </span>
                          )}
                          {a.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-md font-bold text-amber-800 bg-amber-100 text-[10px] inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> PENDING
                            </span>
                          )}
                          {a.status === 'rejected' && (
                            <span className="px-2.5 py-1 rounded-md font-bold text-rose-800 bg-rose-100 text-[10px] inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-600" /> REJECTED
                            </span>
                          )}
                          {a.status === 'cancelled' && (
                            <span className="px-2.5 py-1 rounded-md font-bold text-slate-800 bg-slate-200 text-[10px] inline-flex items-center gap-1">
                              <Ban className="w-3 h-3 text-slate-700" /> CANCELLED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {a.status === 'pending' && canApprove ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                disabled={!!processingApprovalId}
                                onClick={() => handleApproveCentral(a.id)}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                {isProcessing && <RefreshCw className="w-3 h-3 animate-spin" />}
                                {isProcessing ? 'Memproses...' : 'Approve'}
                              </button>
                              <button
                                disabled={!!processingApprovalId}
                                onClick={() => setRejectReasonModal(a.id)}
                                className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-mono italic">
                              {a.approvedBy ? `Disetujui: ${a.approvedBy}` : a.rejectedBy ? `Ditolak: ${a.rejectedBy}` : 'Selesai'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER & RBAC MANAGEMENT */}
      {activeTab === 'users' && canManageRoles && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                id="search-users"
                type="text"
                placeholder="Cari nama, email, role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
            <span className="text-xs font-semibold text-stone-500">Total {filteredUsers.length} Pengguna Terdaftar</span>
          </div>

          {loading ? (
            <SIMSkeletonLoader type="table" />
          ) : filteredUsers.length === 0 ? (
            <SIMEmptyState 
              type="generic"
              title="Belum Ada Pengguna Ditemukan"
              description="Daftar profil akun dan penugasan role pengguna SIM akan ditampilkan di sini."
              actionLabel={canManageRoles ? "Tambah User Manual" : undefined}
              onAction={canManageRoles ? () => setShowModal(true) : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Nama Pengguna</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">No. WhatsApp</th>
                    <th className="p-3">Role RBAC</th>
                    <th className="p-3">Status Firestore</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredUsers.map(u => {
                    const uid = u.uid || u.id || '';
                    const uName = u.nama || u.name || 'Pengguna';
                    const isUpdatingThis = updatingRoleUid === uid;

                    return (
                      <tr key={uid} className="hover:bg-stone-50 transition">
                        <td className="p-3 font-bold text-slate-900">
                          {uName}
                        </td>
                        <td className="p-3 text-stone-600">{u.email}</td>
                        <td className="p-3 text-stone-600">{u.nomorHP || u.phone || '-'}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <select
                              value={u.role}
                              disabled={!canManageRoles || isUpdatingThis}
                              onChange={(e) => handleUpdateRole(uid, uName, e.target.value as UserRole, u.role)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-[10px] border border-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {CANONICAL_ROLES.map(r => {
                                // Escalation guard: Only SUPER_ADMIN can assign SUPER_ADMIN
                                const isSuperAdminOption = r === 'SUPER_ADMIN';
                                const isDisabledOption = isSuperAdminOption && !isSuperAdmin && u.role !== 'SUPER_ADMIN';
                                return (
                                  <option key={r} value={r} disabled={isDisabledOption}>
                                    {r} {isDisabledOption ? '(Khusus Super Admin)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                            {isUpdatingThis && <RefreshCw className="w-3 h-3 text-slate-600 animate-spin" />}
                          </div>
                        </td>
                        <td className="p-3">
                          {u.status === 'active' && (
                            <span className="px-2.5 py-1 rounded-md font-bold text-emerald-800 bg-emerald-100 text-[10px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> AKTIF
                            </span>
                          )}
                          {u.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-md font-bold text-amber-800 bg-amber-100 text-[10px] inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> PENDING
                            </span>
                          )}
                          {u.status === 'rejected' && (
                            <span className="px-2.5 py-1 rounded-md font-bold text-rose-800 bg-rose-100 text-[10px] inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-600" /> DITOLAK
                            </span>
                          )}
                          {u.status === 'suspended' && (
                            <span className="px-2.5 py-1 rounded-md font-bold text-slate-800 bg-slate-200 text-[10px] inline-flex items-center gap-1">
                              <Ban className="w-3 h-3 text-slate-700" /> SUSPENDED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectReasonModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900">Alasan Penolakan Pengajuan</h2>
            <textarea
              rows={3}
              placeholder="Masukkan uraian alasan penolakan..."
              value={rejectReason}
              disabled={isRejecting}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl text-xs disabled:opacity-50"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                id="btn-cancel-reject-modal"
                disabled={isRejecting}
                onClick={() => { setRejectReasonModal(null); setRejectReason(''); }}
                className="px-4 py-2 bg-stone-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-stone-300 transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-confirm-reject-modal"
                disabled={isRejecting}
                onClick={handleRejectCentral}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isRejecting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {isRejecting ? 'Memproses Penolakan...' : 'Konfirmasi Penolakan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {showModal && canManageRoles && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-700" />
                Tambah Profil User di Firestore
              </h2>
              <button
                disabled={isSubmittingUser}
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">UID Akun Firebase Auth (Wajib)</label>
                <input
                  type="text"
                  required
                  disabled={isSubmittingUser}
                  placeholder="Salin UID dari Firebase Auth Console (contoh: 28 karakter)"
                  value={newUser.uid}
                  onChange={e => setNewUser({ ...newUser, uid: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-mono text-xs disabled:opacity-50"
                />
                <p className="text-[10px] text-stone-500 mt-0.5">UID autentik pengguna dari Firebase Authentication untuk mencegah pembuatan identitas sintetis/palsu.</p>
              </div>
              <div>
                <label className="block font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  disabled={isSubmittingUser}
                  placeholder="Contoh: Ustadzah Maryam S.Pd."
                  value={newUser.nama}
                  onChange={e => setNewUser({ ...newUser, nama: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email Resmi</label>
                <input
                  type="email"
                  required
                  disabled={isSubmittingUser}
                  placeholder="nama@asysyifa.sch.id"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">No. WhatsApp / HP</label>
                <input
                  type="tel"
                  disabled={isSubmittingUser}
                  placeholder="08xxxxxxxxxx"
                  value={newUser.nomorHP}
                  onChange={e => setNewUser({ ...newUser, nomorHP: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Role RBAC</label>
                <select
                  value={newUser.role}
                  disabled={isSubmittingUser}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-bold disabled:opacity-50 cursor-pointer"
                >
                  {CANONICAL_ROLES.map(r => {
                    const isSuperAdminOption = r === 'SUPER_ADMIN';
                    const isDisabledOption = isSuperAdminOption && !isSuperAdmin;
                    return (
                      <option key={r} value={r} disabled={isDisabledOption}>
                        {r} {isDisabledOption ? '(Khusus Super Admin)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  id="btn-cancel-add-user"
                  disabled={isSubmittingUser}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-stone-200 text-slate-800 rounded-xl font-bold hover:bg-stone-300 transition cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-submit-add-user"
                  disabled={isSubmittingUser}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isSubmittingUser && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {isSubmittingUser ? 'Menyimpan ke Firestore...' : 'Simpan ke Firestore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
