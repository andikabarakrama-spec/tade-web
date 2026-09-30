import React, { useState } from 'react';
import { Users, Activity, CheckCircle2, ArrowRight, Shield, Zap, Sparkles, RefreshCw } from 'lucide-react';
import { GuardianKernel, EngineId } from '../../core/kernel/GuardianKernelLayer';

export const KernelRecoverySwarmV2: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isSwarmRunning, setIsSwarmRunning] = useState<boolean>(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('PPDB ↔ Firestore Disconnect Fallback');

  const stages = [
    {
      num: 1,
      name: 'DETECT',
      desc: 'Supervision watchdog mendeteksi kegagalan state dalam interval 50ms.',
      subsystem: 'Kernel Supervisor Watchdog',
      color: 'border-rose-500 text-rose-500 bg-rose-50 dark:bg-rose-950/40'
    },
    {
      num: 2,
      name: 'CONTAIN',
      desc: 'Sandbox mengisolasi blast radius dan menahan queue agar transaksi tidak hilang.',
      subsystem: 'Process Isolation Cgroup',
      color: 'border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/40'
    },
    {
      num: 3,
      name: 'HEAL',
      desc: 'Recovery Swarm menyuntikkan clean state snapshot dari WORM backup.',
      subsystem: 'Autonomous Healing Core',
      color: 'border-sky-500 text-sky-500 bg-sky-50 dark:bg-sky-950/40'
    },
    {
      num: 4,
      name: 'REJOIN',
      desc: 'Engine kembali tersambung ke cluster dan menuntaskan antrian transaksi yang tertahan.',
      subsystem: 'Cluster Consensus Protocol',
      color: 'border-indigo-500 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
    },
    {
      num: 5,
      name: 'REINFORCE',
      desc: 'Modul yang pulih langsung membantu node tetangga dan memperkuat guardrail.',
      subsystem: 'Swarm Mutual Aid Mesh',
      color: 'border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
    }
  ];

  const handleSimulateSwarm = () => {
    setIsSwarmRunning(true);
    setActiveStage(1);

    setTimeout(() => setActiveStage(2), 900);
    setTimeout(() => setActiveStage(3), 1800);
    setTimeout(() => setActiveStage(4), 2700);
    setTimeout(() => {
      setActiveStage(5);
      setIsSwarmRunning(false);
      GuardianKernel.appendJournal({
        engineId: 'GUARDIAN',
        level: 'NOTICE',
        subsystem: 'SWARM',
        message: `Recovery Swarm V2 completed 5-phase self-healing for scenario: "${selectedScenario}". All nodes reinforced.`
      });
    }, 3600);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
              R551 &bull; KERNEL RECOVERY SWARM V2
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              MUTUAL AID HEALING MESH
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            5-Stage Collaborative Self-Healing &amp; Swarm Protocol
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Penyempurnaan Recovery Swarm. Saat satu engine pulih, engine tersebut segera memvalidasi dan memperkuat kondisi engine di sekitarnya.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateSwarm}
            disabled={isSwarmRunning}
            className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition"
          >
            {isSwarmRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Execute Swarm Simulation
          </button>
        </div>
      </div>

      {/* Interactive 5-Stage Stepper */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
          5-Stage Swarm Lifecycle (Detect &rarr; Contain &rarr; Heal &rarr; Rejoin &rarr; Reinforce)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono">
          {stages.map((stage) => {
            const isPassed = activeStage >= stage.num;
            const isCurrent = activeStage === stage.num;
            return (
              <div
                key={stage.num}
                className={`p-4 rounded-3xl border-2 transition-all space-y-2 ${
                  isCurrent
                    ? `${stage.color} shadow-lg scale-105`
                    : isPassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                    STAGE {stage.num}
                  </span>
                  {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <h4 className="text-sm font-bold">{stage.name}</h4>
                <p className="text-[11px] leading-relaxed opacity-90">{stage.desc}</p>
                <div className="text-[10px] pt-1 text-slate-500 dark:text-slate-400">
                  Subsystem: <strong className="text-slate-700 dark:text-slate-200">{stage.subsystem}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Swarm Gotong-Royong Matrix */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              Mutual Aid Dependency Mesh (Inter-Engine Help Matrix)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Setiap node memiliki partner redundansi untuk memulihkan cache sekunder saat restart.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
            MESH TOPOLOGY: FULLY CONNECTED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block">FIRESTORE &harr; LOCAL QUEUE</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Jika koneksi cloud terputus, Local Queue menampung mutasi dan memutarnya otomatis saat sinkron.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-teal-600 dark:text-teal-400 block">SESSION &harr; ROUTE MEMORY</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Jika session refresh gagal, Route Memory mempertahankan formulir aktif tanpa reload halaman.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">CCTV &harr; CRISIS TIMELINE</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Jika feed CCTV drop, snapshot frame terakhir disimpan otomatis ke Crisis Timeline ISO 8601.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
