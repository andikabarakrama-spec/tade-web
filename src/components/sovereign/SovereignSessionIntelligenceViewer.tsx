import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Fingerprint, 
  Eye, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  UserCheck,
  Zap,
  Activity
} from 'lucide-react';
import { SovereignSessionIntelligence, SessionIntelligenceState } from '../../core/sovereign/sovereignSessionIntelligence';
import { UserRole } from '../../types';

export const SovereignSessionIntelligenceViewer: React.FC = () => {
  const sessionIntel = SovereignSessionIntelligence.getInstance();
  const [state, setState] = useState<SessionIntelligenceState>(() => sessionIntel.getState());
  const [activeRole, setActiveRole] = useState<UserRole>(state.role);
  const [simulatedIdle, setSimulatedIdle] = useState<number>(state.idleDurationSeconds);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = sessionIntel.updateIdleTime(1);
      setState(updated);
      setSimulatedIdle(updated.idleDurationSeconds);
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionIntel]);

  const handleRecordActivity = () => {
    sessionIntel.recordActivity();
    setState(sessionIntel.getState());
    setNotification('Aktivitas pengguna tercatat: Timer idle di-reset ke 0 detik.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSimulateRoleChange = (role: UserRole) => {
    setActiveRole(role);
    const ok = sessionIntel.verifyRoleConsistency(role);
    setState(sessionIntel.getState());
    if (!ok) {
      setNotification(`Peringatan Guardian: Perubahan peran terdeteksi (${role} != ${state.role}). Konsistensi sesi terganggu!`);
    } else {
      setNotification(`Peran konsisten dengan token sesi (${role}).`);
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-6" id="sovereign-session-intelligence-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Sovereign Security
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R764 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Sovereign Session Intelligence
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pengelolaan sesi aman berdaulat dengan deteksi waktu idle, tab awareness, konsistensi peran, dan sidik jari sesi tanpa mengumpulkan data privasi pengguna.
            </p>
          </div>

          <button
            onClick={handleRecordActivity}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
          >
            <Activity className="w-4 h-4" />
            <span>Kirim Heartbeat Aktivitas</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Session Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Idle Timer</span>
            <p className="text-xl font-black text-white">{formatSeconds(simulatedIdle)}</p>
            <span className={`text-[10px] font-bold ${
              state.idleStatus === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              Status: {state.idleStatus}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Fingerprint className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Session Fingerprint</span>
            <p className="text-sm font-mono font-bold text-purple-300 truncate max-w-[140px]">{state.sessionFingerprint}</p>
            <span className="text-[10px] text-slate-500">Zero PII Collected</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Role Consistency</span>
            <p className="text-sm font-black text-emerald-400">
              {state.roleConsistencyVerified ? 'VERIFIED_MATCH' : 'DRIFT_DETECTED'}
            </p>
            <span className="text-[10px] text-slate-500">Active Role: {state.role}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300">
            <Eye className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Tab Concurrency</span>
            <p className="text-xl font-black text-white">{state.concurrencyCount} Tab Aktif</p>
            <span className="text-[10px] text-emerald-400">Focus: {state.isTabFocused ? 'YES' : 'BACKGROUND'}</span>
          </div>
        </div>
      </div>

      {/* Simulator and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          Simulasi Uji Integritas Sesi & Konsistensi RBAC
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-400 block">
              Simulasi Uji Coba Perubahan Peran (Drift Check):
            </label>
            <div className="flex flex-wrap gap-2">
              {(['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => handleSimulateRoleChange(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    activeRole === r 
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' 
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Jika peran berubah tanpa re-autentikasi resmi, Guardian Session Guard akan menandai status *DRIFT_DETECTED*.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-400 block">
              Kebijakan Keamanan Sesi Berdaulat:
            </label>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Peringatan Idle: 15 menit tanpa aktivitas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Kunci Otomatis (Auto-Lock): 30 menit tanpa aktivitas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Tracking PII: Sidik jari murni matematis terenkripsi lokal</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
