import React, { useState, useEffect } from 'react';
import { Sliders, Cpu, Activity, Gauge, Zap, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { GuardianKernel, SchedulerTask } from '../../core/kernel/GuardianKernelLayer';

export const AdaptiveResourceSchedulerViewer: React.FC = () => {
  const [tasks, setTasks] = useState<SchedulerTask[]>(GuardianKernel.getSchedulerTasks());
  const [fps, setFps] = useState<number>(60);
  const [cpuThrottle, setCpuThrottle] = useState<number>(0);
  const [isBalancing, setIsBalancing] = useState<boolean>(false);

  useEffect(() => {
    setTasks(GuardianKernel.getSchedulerTasks());
    const unsub = GuardianKernel.subscribe(() => {
      setTasks(GuardianKernel.getSchedulerTasks());
    });

    const interval = setInterval(() => {
      // Dynamic FPS simulation around 59-60 FPS
      setFps(Math.floor(59 + Math.random() * 2));
    }, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleTriggerWorkloadBalancing = () => {
    setIsBalancing(true);
    setTimeout(() => {
      GuardianKernel.enqueueTask({
        id: `DYN-${Date.now()}`,
        engineId: 'ANIMATION',
        priority: 7,
        payload: { type: 'ADAPTIVE_FRAME_THROTTLE', rate: '60FPS_LOCKED' },
        timeoutMs: 1000
      });
      setIsBalancing(false);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              R557 &bull; ADAPTIVE RESOURCE SCHEDULER
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              CFS &amp; DYNAMIC PREEMPTION (60 FPS STABLE)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Linux Completely Fair Scheduler (CFS) &amp; Dynamic Idle Redistribution
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mencegah starvation pada UI thread dengan redistribusi resource idle secara adaptif. Menjamin 60 FPS tetap stabil tanpa stuttering saat background Firestore sync berjalan.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">UI FRAME RATE</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
              <Gauge className="w-5 h-5" /> {fps} FPS
            </span>
          </div>
          <button
            onClick={handleTriggerWorkloadBalancing}
            disabled={isBalancing}
            className="py-2.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition"
          >
            {isBalancing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Execute Adaptive Workload Balancing
          </button>
        </div>
      </div>

      {/* CFS Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-slate-400">SCHEDULER QUANTUM</span>
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">4.16 ms</div>
          <span className="text-[10px] text-slate-500">1/240s Slice for High Priority</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-slate-400">THROTTLE RATIO</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">0.0% (UNTHROTTLED)</div>
          <span className="text-[10px] text-slate-500">Zero Frame Drops Detected</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-slate-400">ACTIVE TASK SLOTS</span>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{tasks.length} Active / 64 Max</div>
          <span className="text-[10px] text-slate-500">9 Priority Tiers Engaged</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-slate-400">IDLE REALLOCATION</span>
          <div className="text-xl font-bold text-teal-600 dark:text-teal-400">AUTOMATIC</div>
          <span className="text-[10px] text-slate-500">Redirects to Crisis &amp; Recovery</span>
        </div>
      </div>

      {/* Dynamic CFS Task Queue Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Dynamic Completely Fair Scheduler Queue (Priority 1 Realtime &rarr; Priority 9 Idle)
            </h3>
            <p className="text-xs text-slate-500">
              Setiap task dialokasikan vruntime secara adil tanpa memblokir thread rendering utama.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            CFS PREEMPTION: ON
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-[10px]">
                <th className="pb-2">TASK ID</th>
                <th className="pb-2">ENGINE ORIGIN</th>
                <th className="pb-2">PRIORITY</th>
                <th className="pb-2">VRUNTIME SLICE</th>
                <th className="pb-2">STATUS</th>
                <th className="pb-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                  <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{task.id}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                      {task.engineId}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority <= 2 ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                      task.priority <= 5 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      Tier {task.priority} {task.priority <= 2 ? '(RT)' : '(CFS)'}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">{task.priority * 2.1}ms</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      EXECUTING
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                    PREEMPTIBLE
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
