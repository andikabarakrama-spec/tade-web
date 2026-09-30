import React, { useState, useEffect } from 'react';
import { Clock, Cpu, Play, CheckCircle2, Shield, Sparkles, Layers, ListOrdered } from 'lucide-react';
import { GuardianKernel, ScheduledTask, EngineId } from '../../core/kernel/GuardianKernelLayer';

export const KernelSchedulerGovernor: React.FC = () => {
  const [taskQueue, setTaskQueue] = useState<ScheduledTask[]>([]);
  const [taskName, setTaskName] = useState<string>('Periodic WORM Ledger Checksum');
  const [selectedEngine, setSelectedEngine] = useState<EngineId>('GUARDIAN');
  const [recentCompleted, setRecentCompleted] = useState<string[]>([]);

  useEffect(() => {
    setTaskQueue(GuardianKernel.getTaskQueue());
    const unsub = GuardianKernel.subscribe(() => {
      setTaskQueue(GuardianKernel.getTaskQueue());
    });
    return unsub;
  }, []);

  const handleQueueTask = () => {
    const id = GuardianKernel.scheduleTask(selectedEngine, taskName);
    setRecentCompleted(prev => [
      `[${new Date().toLocaleTimeString()}] DISPATCHED: "${taskName}" (${selectedEngine}) -> ID: ${id}`,
      ...prev.slice(0, 8)
    ]);
  };

  const priorityTiers = [
    { tier: 1, name: 'Guardian Security Core', role: 'Real-time Threat Mitigation & Tamper Defense', budget: '35% CPU' },
    { tier: 2, name: 'AI Asy Cognition', role: 'Dual-AI Intelligence & Conversational Guidance', budget: '25% CPU' },
    { tier: 3, name: 'Session & Auth', role: 'Token Verification & WORM Integrity', budget: '15% CPU' },
    { tier: 4, name: 'Firestore Synchronizer', role: 'Local Cache to Cloud Mutation Dispatcher', budget: '10% CPU' },
    { tier: 5, name: 'PPDB Admissions', role: 'Student Intake Validation & Form Ingestion', budget: '5% CPU' },
    { tier: 6, name: 'Raport Akademik', role: 'Grade Computation & PDF Compilation', budget: '4% CPU' },
    { tier: 7, name: 'Keuangan & SPP', role: 'Payment Gateway & Reconciliation Ledger', budget: '3% CPU' },
    { tier: 8, name: 'CCTV Stream', role: 'Stream Buffer & Milestone Checkpointing', budget: '2% CPU' },
    { tier: 9, name: 'UI & Animation FX', role: 'Non-blocking Visual Transitions & Particles', budget: '1% CPU' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              R547 &bull; KERNEL SCHEDULER GOVERNOR
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              STRICT 9-TIER PRIORITY PREEMPTION
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Resource Governor &amp; Priority Task Dispatcher
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Terinspirasi oleh Linux CFS Scheduler. Memastikan background task (seperti render animasi atau CCTV) tidak pernah merebut kuota eksekusi Guardian dan AI Asy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">CURRENT QUEUE</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {taskQueue.length} PENDING TASKS
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Priority Hierarchy vs Dispatch Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Hierarchy Table */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-amber-500" />
            9-Tier Kernel Priority Ladder (Top-Down Preemption)
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <tr>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Subsystem Name</th>
                    <th className="p-3.5">Kernel Role</th>
                    <th className="p-3.5">CPU Allotment</th>
                    <th className="p-3.5">Preemption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {priorityTiers.map(tier => (
                    <tr key={tier.tier} className={tier.tier <= 2 ? 'bg-amber-50/50 dark:bg-amber-950/20 font-bold' : ''}>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          tier.tier === 1 ? 'bg-rose-600 text-white' :
                          tier.tier === 2 ? 'bg-indigo-600 text-white' :
                          tier.tier <= 4 ? 'bg-amber-500 text-white' :
                          'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {tier.tier}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-800 dark:text-slate-200">{tier.name}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">{tier.role}</td>
                      <td className="p-3.5 text-emerald-600 dark:text-emerald-400">{tier.budget}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {tier.tier <= 3 ? 'REAL-TIME IRQ' : 'NORMAL CFS'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Task Dispatcher */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
            Kernel Task Dispatch Lab
          </h3>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-500 block mb-1">Select Engine</label>
              <select
                aria-label="Select Engine"
                value={selectedEngine}
                onChange={e => setSelectedEngine(e.target.value as EngineId)}
                className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="GUARDIAN">Tier 1 — GUARDIAN</option>
                <option value="AI_ASY">Tier 2 — AI_ASY</option>
                <option value="SESSION">Tier 3 — SESSION</option>
                <option value="FIRESTORE">Tier 4 — FIRESTORE</option>
                <option value="PPDB">Tier 5 — PPDB</option>
                <option value="RAPORT">Tier 6 — RAPORT</option>
                <option value="KEUANGAN">Tier 7 — KEUANGAN</option>
                <option value="CCTV">Tier 8 — CCTV</option>
                <option value="ANIMATION">Tier 9 — ANIMATION</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-500 block mb-1">Task Definition</label>
              <input
                type="text"
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={handleQueueTask}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow transition"
            >
              <Play className="w-4 h-4" /> Enqueue &amp; Preempt Execution
            </button>

            {/* Verification Proof */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 block">
                Governor Law:
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
                Task Tier 1 (Guardian) akan memotong antrian task Tier 9 (Animation) secara instan. Tidak ada starving pada critical process.
              </p>
            </div>

            {/* Task Stream */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Scheduler Dispatch Log</span>
              <div className="h-32 overflow-y-auto p-2.5 rounded-xl bg-slate-900 text-amber-400 font-mono text-[10px] space-y-1">
                {recentCompleted.length === 0 ? (
                  <span className="text-slate-500 italic">No tasks queued recently.</span>
                ) : (
                  recentCompleted.map((log, idx) => (
                    <div key={idx} className="leading-tight">{log}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
