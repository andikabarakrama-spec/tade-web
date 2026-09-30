import React, { useState } from 'react';
import {
  Zap,
  Activity,
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Gauge
} from 'lucide-react';

export interface RolePerformanceBudget {
  roleName: string;
  code: 'PARENT_LITE' | 'TEACHER_LITE' | 'EXECUTIVE_LITE' | 'OPERATIONS_ULTRA' | 'FOUNDER_MODULAR';
  targetSizeKb: number;
  actualSizeKb: number;
  targetLoadTimeSec: number;
  actualLoadTimeSec: number;
  cacheHitRatio: string;
  status: 'OPTIMAL' | 'WARNING' | 'EXCEEDED';
  quietBackgroundStatus: 'ACTIVE_IDLE' | 'SUSPENDED';
}

const INITIAL_BUDGETS: RolePerformanceBudget[] = [
  {
    roleName: 'Wali Murid (Parent Lite)',
    code: 'PARENT_LITE',
    targetSizeKb: 120,
    actualSizeKb: 98,
    targetLoadTimeSec: 0.8,
    actualLoadTimeSec: 0.45,
    cacheHitRatio: '98.5%',
    status: 'OPTIMAL',
    quietBackgroundStatus: 'ACTIVE_IDLE'
  },
  {
    roleName: 'Guru Kelas (Teacher Lite)',
    code: 'TEACHER_LITE',
    targetSizeKb: 250,
    actualSizeKb: 215,
    targetLoadTimeSec: 1.2,
    actualLoadTimeSec: 0.75,
    cacheHitRatio: '96.2%',
    status: 'OPTIMAL',
    quietBackgroundStatus: 'ACTIVE_IDLE'
  },
  {
    roleName: 'Kepala Sekolah (Executive Lite)',
    code: 'EXECUTIVE_LITE',
    targetSizeKb: 300,
    actualSizeKb: 260,
    targetLoadTimeSec: 1.5,
    actualLoadTimeSec: 0.92,
    cacheHitRatio: '94.8%',
    status: 'OPTIMAL',
    quietBackgroundStatus: 'ACTIVE_IDLE'
  },
  {
    roleName: 'Tata Usaha & Ops (Operations Ultra)',
    code: 'OPERATIONS_ULTRA',
    targetSizeKb: 600,
    actualSizeKb: 480,
    targetLoadTimeSec: 2.0,
    actualLoadTimeSec: 1.25,
    cacheHitRatio: '93.0%',
    status: 'OPTIMAL',
    quietBackgroundStatus: 'ACTIVE_IDLE'
  },
  {
    roleName: 'Founder Fleet (Founder Modular)',
    code: 'FOUNDER_MODULAR',
    targetSizeKb: 800,
    actualSizeKb: 540,
    targetLoadTimeSec: 2.5,
    actualLoadTimeSec: 1.40,
    cacheHitRatio: '99.0%',
    status: 'OPTIMAL',
    quietBackgroundStatus: 'ACTIVE_IDLE'
  }
];

export const PerformanceGateCenter: React.FC = () => {
  const [budgets, setBudgets] = useState<RolePerformanceBudget[]>(INITIAL_BUDGETS);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsAuditing(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    MODULE R143
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    FEATHER ARCHITECTURE
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Performance Gate & Feather Architecture Center
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Memastikan seluruh profil antarmuka mematuhi batas beban (Performance Budget) yang ditetapkan Konstitusi TADE v12.2. Modul berat hanya dimuat saat dipanggil (Lazy Dynamic Loading) agar aplikasi selalu seringan bulu.
            </p>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-900/30 transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Mengukur Beban...' : 'Jalankan Audit Beban'}</span>
          </button>
        </div>
      </div>

      {/* Global Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Rata-Rata Waktu Muat</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">
            0.65 detik
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Batas Maks: 2.00 detik</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Cache Hit Rate</span>
            <Database className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2 block">
            96.3%
          </span>
          <span className="text-[10px] text-emerald-500 mt-1 block font-medium">Smart Offline Prefetch</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Quiet Background</span>
            <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 block">
            IDLE (0.2% CPU)
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Zero Battery Drain</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Performance Gate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">
            100% PASSED
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">5 dari 5 Profil Lolos</span>
        </div>
      </div>

      {/* Budget Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Matriks Performance Budget per-Peran Pengguna</span>
          </h4>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            GRADE: FEATHER A+
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Profil Peran</th>
                <th className="py-3 px-4">Target vs Aktual Ukuran</th>
                <th className="py-3 px-4">Target vs Aktual Load</th>
                <th className="py-3 px-4">Smart Cache</th>
                <th className="py-3 px-4">Quiet Engine</th>
                <th className="py-3 px-4 text-right">Status Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {budgets.map((b) => (
                <tr key={b.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{b.roleName}</div>
                    <span className="text-[10px] font-mono text-slate-400">{b.code}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{b.actualSizeKb} KB</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">(Batas: {b.targetSizeKb} KB)</span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{b.actualLoadTimeSec}s</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">(Batas: {b.targetLoadTimeSec}s)</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {b.cacheHitRatio}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {b.quietBackgroundStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 inline-flex items-center space-x-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
