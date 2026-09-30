import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Smartphone, Bell, CheckCircle2, 
  X, ArrowRight, ShieldCheck, UserCheck, Star 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { requestFCMToken } from '../../firebase/messaging';
import { adoptionAnalyticsService } from '../../services/adoptionAnalyticsService';
import { Student } from '../../types';
import { DataService } from '../../services/db';

interface SmartParentWelcomeModalProps {
  onSelectTab?: (tab: string) => void;
}

const WELCOME_SEEN_KEY = 'tade_parent_welcome_seen_v1';

export const SmartParentWelcomeModal: React.FC<SmartParentWelcomeModalProps> = ({
  onSelectTab
}) => {
  const { currentUser, userProfile } = useAuth();
  const { isInstallable, installPWA, isInstalled } = usePWAInstall();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [notifGranted, setNotifGranted] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is parent role or visiting parent portal, and hasn't seen welcome yet
    try {
      const hasSeenWelcome = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(WELCOME_SEEN_KEY) : null;
      if (!hasSeenWelcome) {
        // Small delay for gentle entrance after splash/intro
        const timer = setTimeout(() => {
          setIsOpen(true);
          adoptionAnalyticsService.checkDailyActiveParent();
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  useEffect(() => {
    // Check initial notification status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }

    // Fetch authorized student info if user is logged in
    let isMounted = true;
    const fetchStudent = async () => {
      try {
        const students = await DataService.getStudents(
          userProfile?.role || 'WALI_MURID',
          currentUser?.uid,
          userProfile?.email
        );
        if (isMounted && students.length > 0) {
          setStudent(students[0]);
        }
      } catch {
        // Fallback
      }
    };
    fetchStudent();
    return () => { isMounted = false; };
  }, [currentUser?.uid, userProfile?.role, userProfile?.email]);

  const handleDismiss = () => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(WELCOME_SEEN_KEY, 'true');
      }
    } catch {
      // Safe fallback
    }
    setIsOpen(false);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await installPWA();
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        adoptionAnalyticsService.trackPWAInstall();
      }
    } else {
      // If already installed or browser manual
      handleDismiss();
      if (onSelectTab) onSelectTab('r29');
    }
  };

  const handleEnableNotifClick = async () => {
    try {
      const res = await requestFCMToken();
      if (res && res.success) {
        setNotifGranted(true);
        adoptionAnalyticsService.trackNotificationPermission(true);
      }
    } catch {
      // Ignored
    }
  };

  const handleOpenPortal = () => {
    handleDismiss();
    if (onSelectTab) {
      onSelectTab('r29');
    }
  };

  const childName = student?.nickname || student?.namaLengkap || 'Ananda';
  const childClass = student?.classGroup || student?.kelompok || 'Siswa TK Asy Syifa';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-emerald-500/30 max-w-lg w-full overflow-hidden relative"
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[11px] shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Selamat Datang di TADE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Assalamu'alaikum Ayah & Bunda 🌸
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  Aplikasi TADE hadir untuk menemani tumbuh kembang, presensi harian, dan mutabaah hafalan ananda tercinta.
                </p>
              </div>
            </div>

            {/* Body Info */}
            <div className="p-6 sm:p-7 space-y-5">
              {/* Child & Class Card */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {childName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                      {childName}
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                      {childClass} • TK Asy Syifa Tanggul
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                  Aktif
                </span>
              </div>

              {/* Adoption Setup Actions */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Rekomendasi Kenyamanan Wali Murid:
                </p>

                {/* 1. Install PWA Button */}
                {!isInstalled && !installSuccess && (
                  <button
                    onClick={handleInstallClick}
                    className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition text-left flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                          Pasang Aplikasi TADE di Layar HP
                        </h5>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          Akses instan tanpa perlu ketik alamat website lagi
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900 px-3 py-1 rounded-xl whitespace-nowrap">
                      Pasang
                    </span>
                  </button>
                )}

                {/* 2. Notification Button */}
                {!notifGranted ? (
                  <button
                    onClick={handleEnableNotifClick}
                    className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 transition text-left flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300">
                          Aktifkan Notifikasi Sekolah
                        </h5>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          Info presensi jam 07.00 & update hafalan santri
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-600 bg-teal-100 dark:bg-teal-900 px-3 py-1 rounded-xl whitespace-nowrap">
                      Aktifkan
                    </span>
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 flex items-center gap-2.5 text-xs text-teal-800 dark:text-teal-200 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Notifikasi Sekolah Sudah Aktif
                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleOpenPortal}
                  className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-98 cursor-pointer"
                >
                  <span>Buka Portal Wali Murid</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="py-3 px-4 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 font-bold text-xs transition cursor-pointer"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
