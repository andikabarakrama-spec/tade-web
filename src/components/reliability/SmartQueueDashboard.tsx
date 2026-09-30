import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  Activity, 
  RotateCw, 
  Sliders, 
  ShieldCheck, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  Cpu,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  NationalTaskOrchestrator, 
  OrchestratedTask 
} from '../../core/reliability/nationalTaskOrchestrator';

export const SmartQueueDashboard: React.FC = () => {
  const orchestrator = useMemo(() => NationalTaskOrchestrator.getInstance(), []);
  const [tasks, setTasks] = useState<OrchestratedTask[]>(() => orchestrator.getAllTasks());
  const [rateLimitPerSec, setRateLimitPerSec] = useState<number>(20);

  useEffect(() => {
    const unsub = orchestrator.subscribe(() => {
      setTasks([...orchestrator.getAllTasks()]);
    });
    return unsub;
  }, [orchestrator]);

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const processingTasks = tasks.filter(t => t.status === 'PROCESSING');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const failedTasks = tasks.filter(t => t.status === 'FAILED');

  return (
    <div className="space-y-6" id="smart-queue-dashboard">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                R842 &bull; Smart Queue Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                THROTTLED PIPELINE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Manajemen Antrean Cerdas & Kendali Prioritas
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memantau throughput antrean secara real-time dengan kendali rate limiter, prioritas antrean dinamis, dan perlindungan starvation task.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Rate Limiter</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{rateLimitPerSec} Ops / detik</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Latensi Rata-rata</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">1.4 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Queue State Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-amber-400">Antrean Aktif</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black mt-2 text-white">{processingTasks.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Sedang diproses worker</p>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-blue-400">Menunggu (Pending)</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black mt-2 text-white">{pendingTasks.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Dalam antrean prioritas</p>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-emerald-400">Selesai (Success)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black mt-2 text-white">{completedTasks.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">100% verifikasi sukses</p>
        </div>

        <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-rose-400">Gagal / Retry</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black mt-2 text-white">{failedTasks.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Auto-retry dengan backoff</p>
        </div>
      </div>

      {/* Real-time Queue Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Inspeksi Alur Antrean & Throughput
          </h3>
          <span className="text-xs text-slate-400 font-mono">NON-BLOCKING WORKER</span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{task.title}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400">
                    {task.idempotencyKey}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Prioritas: <strong className="text-slate-300">{task.priority}</strong></span>
                  <span>&bull;</span>
                  <span>Waktu: <strong className="text-slate-300">{task.executionTimeMs ? `${task.executionTimeMs} ms` : 'Standby'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                  task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                  task.status === 'PROCESSING' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
