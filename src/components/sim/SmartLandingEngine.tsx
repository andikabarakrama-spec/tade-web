import React, { useState, useEffect } from 'react';
import {
  LogIn,
  Users,
  Shield,
  UserCheck,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Clock,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface SmartLandingEngineProps {
  onSelectRole?: (role: UserRole) => void;
  onSelectModule?: (module: string) => void;
}

export const SmartLandingEngine: React.FC<SmartLandingEngineProps> = ({ onSelectRole, onSelectModule }) => {
  const { userProfile, currentUser, activeRole } = useAuth();
  const [rememberedRole, setRememberedRole] = useState<UserRole>(activeRole || 'ADMIN');
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tade_last_active_role') as UserRole | null;
    if (saved) {
      setRememberedRole(saved);
    } else if (activeRole) {
      setRememberedRole(activeRole);
    }
  }, [activeRole]);

  const handleRoleQuickSwitch = (targetRole: UserRole) => {
    localStorage.setItem('tade_last_active_role', targetRole);
    setRememberedRole(targetRole);

    if (targetRole === activeRole) {
      setNotice({
        message: `Peran ${targetRole} sedang aktif. Menavigasi ke dashboard operasional...`,
        type: 'success'
      });
      if (onSelectRole) onSelectRole(targetRole);
      if (onSelectModule) onSelectModule('r1');
    } else {
      setNotice({
        message: `Akun Anda saat ini terdaftar dengan hak akses resmi sebagai ${activeRole}. Untuk beralih wewenang ke ${targetRole}, silakan masuk menggunakan akun resmi yang memiliki peran ${targetRole}.`,
        type: 'warning'
      });
    }
  };

  const displayName = userProfile?.nama || userProfile?.name || currentUser?.displayName || 'Sesi Aktif';
  const displayEmail = userProfile?.email || currentUser?.email || '-';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
              MODULE R142
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              SMART MULTI-ROLE LANDING
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">
            Smart Landing & Multi-Role Navigation
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl">
            Sistem cerdas menampilkan peran resmi pengguna aktif dan memandu navigasi peran terotorisasi. Hak akses modul sepenuhnya divalidasi melalui RBAC Firebase Authentication.
          </p>
        </div>
      </div>

      {notice && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-start gap-3 transition-all ${
            notice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : notice.type === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{notice.message}</div>
        </div>
      )}

      {/* Current Active User Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {displayName}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {activeRole || 'WALI_MURID'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Email / ID: {displayEmail} • Status: {userProfile?.status === 'active' ? 'Aktif' : 'Terverifikasi'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Preferensi Peran:</span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {rememberedRole}
          </span>
        </div>
      </div>

      {/* Seamless Role Switcher Cards (Public Roles Only, Super Admin Hidden) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Pilih / Navigasi Peran Terdaftar:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Admin Role Card */}
          <div
            onClick={() => handleRoleQuickSwitch('ADMIN')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative group ${
              activeRole === 'ADMIN'
                ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/30 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Shield className="w-5 h-5" />
              </div>
              {activeRole === 'ADMIN' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-600 text-white font-mono">
                  AKTIF
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Administrator</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Kelola data santri, SPP, absensi, dan pengaturan sekolah harian.
              </p>
            </div>
          </div>

          {/* Guru Role Card */}
          <div
            onClick={() => handleRoleQuickSwitch('GURU')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative group ${
              activeRole === 'GURU'
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              {activeRole === 'GURU' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white font-mono">
                  AKTIF
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Guru Kelas</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Isi absensi harian, portofolio foto kegiatan, dan input rapor anak.
              </p>
            </div>
          </div>

          {/* Wali Murid Role Card */}
          <div
            onClick={() => handleRoleQuickSwitch('WALI_MURID')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative group ${
              activeRole === 'WALI_MURID'
                ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              {activeRole === 'WALI_MURID' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white font-mono">
                  AKTIF
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Wali Murid (Parent Lite)</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Tampilan ringan untuk cek SPP, notifikasi WhatsApp, dan presensi anak.
              </p>
            </div>
          </div>

          {/* Kepala Sekolah / Yayasan Role Card */}
          <div
            onClick={() => handleRoleQuickSwitch('KEPALA_SEKOLAH')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative group ${
              activeRole === 'KEPALA_SEKOLAH' || activeRole === 'KETUA_YAYASAN'
                ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <UserCheck className="w-5 h-5" />
              </div>
              {(activeRole === 'KEPALA_SEKOLAH' || activeRole === 'KETUA_YAYASAN') && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white font-mono">
                  AKTIF
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Kepala Sekolah (Executive)</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Ringkasan eksekutif keuangan, kehadiran guru, dan evaluasi kurikulum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
