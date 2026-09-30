import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { requestFCMToken } from '../../firebase/messaging';
import { useAuth } from '../../context/AuthContext';

interface NotificationPermissionDialogProps {
  onPermissionGranted?: () => void;
  onSelectTab?: (tab: string) => void;
}

export const NotificationPermissionDialog: React.FC<NotificationPermissionDialogProps> = ({
  onPermissionGranted,
  onSelectTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grantedSuccess, setGrantedSuccess] = useState(false);
  const { userProfile } = useAuth();

  useEffect(() => {
    // Check if permission already granted or dismissed
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      return;
    }

    const dismissedUntil = localStorage.getItem('tade_notif_dialog_dismissed_until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // Trigger dialog after user is logged in or after 2.5s on home page
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [userProfile]);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const result = await requestFCMToken();
      if (result.success) {
        setGrantedSuccess(true);
        if (onPermissionGranted) onPermissionGranted();
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      } else {
        // If denied or error
        setIsOpen(false);
      }
    } catch {
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    // Dismiss for 2 days
    const nextTime = Date.now() + 2 * 24 * 60 * 60 * 1000;
    localStorage.setItem('tade_notif_dialog_dismissed_until', nextTime.toString());
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="tade-notification-permission-modal"
        className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden text-slate-800"
        >
          {/* Top Decorative Gradient */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="Tutup"
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-7 text-center flex flex-col items-center">
            {/* Animated Bell Icon */}
            <motion.div
              initial={{ rotate: -15 }}
              animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 mb-4"
            >
              <Bell className="w-8 h-8" />
            </motion.div>

            {/* Dialog Heading */}
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight mb-2 flex items-center gap-2">
              <span>🔔 Aktifkan Notifikasi TADE</span>
            </h2>

            {/* Subtext */}
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-5 max-w-xs">
              "Agar tidak ketinggalan informasi penting sekolah."
            </p>

            {/* Notification Types Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full mb-6 text-[11px] font-semibold text-slate-600">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                📢 Pengumuman
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                📋 PPDB
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                ✅ Absensi
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                💳 Infaq/SPP
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                💰 Tabungan
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                💬 Pesan Guru
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                📅 Agenda Besok
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
                📖 Tahfidz
              </span>
            </div>

            {/* Success state if just granted */}
            {grantedSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Notifikasi Berhasil Diaktifkan!</span>
              </motion.div>
            ) : (
              /* Action Buttons */
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  id="btn-activate-notification"
                  onClick={handleActivate}
                  disabled={loading}
                  className="w-full sm:flex-1 py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition transform active:scale-98 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{loading ? 'Mengaktifkan...' : 'Aktifkan Notifikasi'}</span>
                </button>
                <button
                  id="btn-dismiss-notification"
                  onClick={handleDismiss}
                  disabled={loading}
                  className="w-full sm:w-auto py-3.5 px-5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-sm rounded-2xl transition cursor-pointer"
                >
                  Nanti Saja
                </button>
              </div>
            )}

            {/* Security note */}
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Didukung FCM · Android & iPhone Safari Standalone</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
