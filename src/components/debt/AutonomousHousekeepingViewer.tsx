import React, { useState } from 'react';
import { autonomousHousekeepingEngine, HousekeepingReport } from '../../core/debt/AutonomousHousekeepingEngine';
import { Trash2, ShieldCheck, RefreshCw, CheckCircle2, Lock } from 'lucide-react';

export const AutonomousHousekeepingViewer: React.FC = () => {
  const [report, setReport] = useState<HousekeepingReport>(() => autonomousHousekeepingEngine.getState());
  const [isSweeping, setIsSweeping] = useState(false);

  const handleSweep = () => {
    setIsSweeping(true);
    setTimeout(() => {
      const res = autonomousHousekeepingEngine.runHousekeepingSweep();
      setReport({ ...res });
      setIsSweeping(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                R653 &bull; AUTONOMOUS HOUSEKEEPING
              </span>
              <span className="text-xs text-slate-400">Non-Destructive Hygiene Governor</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-indigo-400" />
              Autonomous Housekeeping &amp; Memory Hygiene Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Melakukan pembersihan berkala yang aman (verifikasi cache kedaluwarsa, pembersihan draft formulir yatim, pemadatan registri sementara, dan audit konsistensi snapshot). <strong>Strictly dilindungi safety lock: zero touch data produksi</strong>.
            </p>
          </div>
          <button
            onClick={handleSweep}
            disabled={isSweeping}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSweeping ? 'animate-spin' : ''}`} />
            {isSweeping ? 'Membersihkan Cache Ephemeral...' : 'Jalankan Housekeeping'}
          </button>
        </div>
      </div>

      {/* Safety Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 shadow-sm">
        <Lock className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        <div className="text-xs">
          <strong className="block font-bold font-mono">PRODUCTION DATA IMMUNITY ACTIVE</strong>
          <span>Housekeeping hanya beroperasi pada ephemeral cache, snapshot index, dan abandoned local drafts. Database produksi SSoT terlindungi secara permanen.</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Total Memori Direklamasi</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {(report.totalMemoryFreedKb / 1024).toFixed(2)} MB
          </span>
          <span className="text-[10px] text-slate-500 block">{report.totalMemoryFreedKb} KB Ephemeral Heap</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Item Di-Sanitasi</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {report.totalItemsSanitized} Objek
          </span>
          <span className="text-[10px] text-slate-500 block">Orphan drafts &amp; stale entries</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Pipeline Housekeeping</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {report.tasks.length} / 4 Aktif
          </span>
          <span className="text-[10px] text-emerald-600 block font-bold">100% Berjalan Mandiri</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Safety Lock Guard</span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            LOCKED &amp; SAFE
          </span>
          <span className="text-[10px] text-slate-500 block">Zero Mutation on SSoT</span>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.tasks.map(task => (
          <div key={task.taskId} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px]">
                  {task.taskId}
                </span>
                <strong className="text-slate-900 dark:text-white text-xs">{task.name}</strong>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {task.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-slate-500 block">Scanned</span>
                <strong className="text-slate-900 dark:text-white">{task.itemsScanned}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-slate-500 block">Reclaimed</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{task.itemsReclaimed}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="text-slate-500 block">Saved</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{task.memorySavedKb} KB</strong>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700">
              <span>Jadwal: {task.schedule}</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Data Produksi Aman
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Housekeeping Logs */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Riwayat Eksekusi Hygiene Governor</h3>
        <div className="space-y-1 font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl max-h-40 overflow-y-auto">
          {report.recentLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-indigo-500">&bull;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
