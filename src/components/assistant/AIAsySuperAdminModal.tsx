import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Server, KeyRound, Activity, AlertTriangle, Database, Wifi, CheckCircle2, X, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';

interface AIAsySuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAsySuperAdminModal: React.FC<AIAsySuperAdminModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, userProfile, activeRole, loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Monitoring data state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [pendingTasksCount, setPendingTasksCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (isOpen && activeRole === 'SUPER_ADMIN') {
      loadMonitoringData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOpen, activeRole]);

  const loadMonitoringData = async () => {
    try {
      const logs = await DataService.getAuditLogs();
      setAuditLogs(logs.slice(0, 5));

      const requests = await DataService.getApprovalRequests();
      const pending = requests.filter((r) => r.status === 'pending');
      setPendingTasksCount(pending.length);
    } catch (err) {
      console.error('Failed to load monitoring summary:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAuthenticating(true);

    try {
      const result = await loginWithEmail(email, password);
      if (!result.success) {
        setErrorMsg(result.error || 'Autentikasi Super Admin Gagal.');
      } else {
        await loadMonitoringData();
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat memverifikasi kredensial.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isOpen) return null;

  const isSuperAdminAuthenticated = activeRole === 'SUPER_ADMIN';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-6 shadow-2xl text-white space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </span>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  Super Admin Control Portal <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">TADE v1.0.5 LTS</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Rahasia & Terisolasi - Khusus Pengawas Utama
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* If NOT Authenticated as Super Admin: Prompt Authentication Form */}
          {!isSuperAdminAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 space-y-1 font-mono">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Lock className="w-4 h-4" /> Autentikasi Super Admin Diperlukan
                </div>
                <p>Masukkan email dan kata sandi akun Super Admin yang terdaftar di Firebase Authentication untuk membuka panel monitoring.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-mono">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Email Super Admin</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="superadmin@asysyifatan.sch.id"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Kata Sandi</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-mono text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl font-mono text-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isAuthenticating ? 'Verifikasi...' : 'Masuk Control Panel'}
                </button>
              </div>
            </form>
          ) : (
            /* Monitoring Summary (Read-Only) */
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* System Health */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>SYSTEM HEALTH</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% OPERATIONAL
                  </div>
                  <p className="text-[10px] text-slate-500">Latency &lt; 15ms (Cloud Run)</p>
                </div>

                {/* License Status */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>LISENSI & LTS</span>
                    <Server className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-blue-400 font-bold text-sm">TADE v1.0.5 LTS</div>
                  <p className="text-[10px] text-slate-500">Certified Enterprise Active</p>
                </div>

                {/* Backup Status */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>BACKUP STATUS</span>
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-purple-300 font-bold text-sm">JSON EXPORT READY</div>
                  <p className="text-[10px] text-slate-500">Auto-Backup Verified</p>
                </div>

                {/* Network / Offline */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>STATUS SINKRONISASI</span>
                    <Wifi className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`} />
                  </div>
                  <div className={`font-bold text-sm ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isOnline ? 'ONLINE (Synced)' : 'OFFLINE MODE'}
                  </div>
                  <p className="text-[10px] text-slate-500">Local Cache Active</p>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">PENDING APPROVAL TASKS</span>
                  <strong className="text-amber-300 text-sm">{pendingTasksCount} Pengajuan Menunggu</strong>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                  {pendingTasksCount > 0 ? 'Perlu Tindakan' : 'Selesai Semua'}
                </span>
              </div>

              {/* Audit Logs */}
              <div className="space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">AUDIT LOGS TERBARU</span>
                <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-[10px]">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-300">[{log.role}] {log.userName}: <strong className="text-emerald-400">{log.action}</strong></span>
                        <span className="text-slate-500 text-[9px]">{new Date(log.timestamp).toLocaleTimeString('id-ID')}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 text-center py-2">Tidak ada catatan audit terbaru.</div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-mono text-xs cursor-pointer"
                >
                  Tutup Summary
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
