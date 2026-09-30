import React, { useState } from 'react';
import { 
  Hourglass, RefreshCw, HardDrive, Cpu, CheckCircle2, 
  Trash2, Database, Activity, Sparkles, Server, Zap
} from 'lucide-react';
import { longLifeOperations, SystemLongevityMetric, HousekeepingTask } from '../../core/government/LongLifeOperationsEngine';

export const LongLifeOperationsViewer: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemLongevityMetric>(() => longLifeOperations.getMetrics());
  const [tasks, setTasks] = useState<HousekeepingTask[]>(() => longLifeOperations.getTasks());
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleHousekeeping = () => {
    const res = longLifeOperations.triggerManualHousekeeping();
    setMetrics({ ...longLifeOperations.getMetrics() });
    setTasks([...longLifeOperations.getTasks()]);
    setFeedback(`Housekeeping berhasil: ${res.reclaimedKb} KB memori & log berhasil dirampingkan.`);
  };

  return (
    <div id="long-life-operations" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 p-6 rounded-3xl text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Hourglass className="w-48 h-48 text-emerald-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Hourglass className="w-4 h-4" /> R612 &bull; Long-Life Operations Engine &bull; Linux LTS Longevity
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Operasi Jangka Panjang &amp; Pemeliharaan Nir-Henti (LTS)
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Terinspirasi dari Linux Long-Term Support (LTS): rotasi log otomatis, sanitasi buffer memori, pemeliharaan prediktif, dan defragmentasi storage untuk kontinuitas operasional 10+ tahun.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleHousekeeping}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Jalankan Housekeeping
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Uptime Operasional</span>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {Math.floor(metrics.uptimeSeconds / 86400)} Hari {Math.floor((metrics.uptimeSeconds % 86400) / 3600)} Jam
          </div>
          <div className="text-[10px] text-emerald-500 font-bold">Status: {metrics.agingStatus}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Rotasi Log &amp; Arsip</span>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalLogRotations} Siklus
          </div>
          <div className="text-[10px] text-slate-500">Terkompresi: {metrics.archivedLogsKb} KB</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Fragmentasi Storage</span>
          <div className="text-xl font-extrabold text-emerald-500">
            {metrics.storageFragmentationPercent}% (Rendah)
          </div>
          <div className="text-[10px] text-slate-500">Kesehatan: {metrics.longevityHealthScore}%</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Prediksi Pemeliharaan</span>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {metrics.predictedDaysUntilMaintenance} Hari ke Depan
          </div>
          <div className="text-[10px] text-emerald-500 font-bold">MTBF: Zero Degradation</div>
        </div>
      </div>

      {/* Housekeeping Tasks Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-500" /> Tugas Pemeliharaan &amp; Kebersihan Rutin (Housekeeping)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {tasks.map((t) => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {t.id} &bull; {t.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-500">
                  ✓ {t.status}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {t.name}
              </h3>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Frekuensi: {t.frequency}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Reclaimed: {t.bytesReclaimedKb} KB</span>
              </div>
              <div className="text-[9px] text-slate-400">
                Terakhir: {t.lastExecuted}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
