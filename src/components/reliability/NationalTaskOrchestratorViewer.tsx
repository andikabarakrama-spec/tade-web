import React, { useState, useEffect, useMemo } from 'react';
import { 
  Server, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Play, 
  RotateCw, 
  ShieldCheck, 
  Cpu, 
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import { 
  NationalTaskOrchestrator, 
  OrchestratedTask, 
  TaskPriority, 
  TaskCategory 
} from '../../core/reliability/nationalTaskOrchestrator';

export const NationalTaskOrchestratorViewer: React.FC = () => {
  const orchestrator = useMemo(() => NationalTaskOrchestrator.getInstance(), []);
  const [tasks, setTasks] = useState<OrchestratedTask[]>(() => orchestrator.getAllTasks());
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  useEffect(() => {
    const unsub = orchestrator.subscribe(() => {
      setTasks([...orchestrator.getAllTasks()]);
    });
    return unsub;
  }, [orchestrator]);

  const handleCreateSampleTask = () => {
    orchestrator.enqueueTask({
      idempotencyKey: `IDEMP_MANUAL_${Date.now()}`,
      title: 'Verifikasi Integritas Data & Indeks Pencarian',
      category: 'INDEXING_SEARCH',
      priority: 'HIGH',
      maxRetries: 3,
      payloadSummary: 'Pengindeksan 140 berkas santri & jurnal guru'
    });
  };

  const handleRetry = (id: string) => {
    orchestrator.retryTask(id);
  };

  const handlePurge = () => {
    orchestrator.purgeCompletedTasks();
  };

  const filteredTasks = selectedFilter === 'ALL'
    ? tasks
    : tasks.filter(t => t.status === selectedFilter);

  return (
    <div className="space-y-6" id="national-task-orchestrator-viewer">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                R841 &bull; Task Orchestrator Nasional
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ZERO DUPLICATE EXECUTION
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Orkestrasi Latar Belakang & Pipeline Sekolah
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memproses sinkronisasi database, hashing snapshot, kompresi foto, dan audit secara idempoten dengan konsumsi CPU mendekati 0% saat diam.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateSampleTask}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Tambah Task Baru
            </button>
            <button
              onClick={handlePurge}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              title="Bersihkan antrean selesai"
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
              Bersihkan
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Antrean</span>
          <div className="text-2xl font-black mt-1 text-white">{tasks.length}</div>
          <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">Semua Status</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sedang Berjalan</span>
          <div className="text-2xl font-black mt-1 text-amber-400">
            {tasks.filter(t => t.status === 'PROCESSING').length}
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono mt-0.5 block">Concurrent Non-Blocking</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Selesai Sukses</span>
          <div className="text-2xl font-black mt-1 text-emerald-400">
            {tasks.filter(t => t.status === 'COMPLETED').length}
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5 block">100% Idempotent</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Beban CPU Idle</span>
          <div className="text-2xl font-black mt-1 text-cyan-400">&lt; 0.02%</div>
          <span className="text-[10px] text-cyan-400/80 font-mono mt-0.5 block">Event-Driven Queue</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['ALL', 'PROCESSING', 'PENDING', 'COMPLETED', 'FAILED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedFilter(st)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              selectedFilter === st
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {st === 'ALL' ? 'Semua Antrean' : st}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {t.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  t.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  t.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {t.priority}
                </span>
                <span className="text-xs font-semibold text-slate-400">{t.category.replace('_', ' ')}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{t.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.payloadSummary}</p>
              </div>

              {/* Progress bar if processing */}
              {t.status === 'PROCESSING' && (
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${t.progressPercent}%` }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black block ${
                  t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  t.status === 'PROCESSING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                  t.status === 'FAILED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {t.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {t.completedAt || t.startedAt || t.createdAt}
                </span>
              </div>

              {t.status === 'FAILED' && (
                <button
                  onClick={() => handleRetry(t.id)}
                  className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                  title="Coba Ulang"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
