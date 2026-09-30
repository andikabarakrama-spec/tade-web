import React, { useState } from 'react';
import { governmentWorkflowOrchestrator, OrchestratedTask, TaskPriority, TaskState } from '../../core/government/GovernmentWorkflowOrchestrator';
import { Activity, Play, CheckCircle, Clock, AlertCircle, Cpu, BarChart2, Zap } from 'lucide-react';

export const GovernmentWorkflowOrchestratorViewer: React.FC = () => {
  const [tasks, setTasks] = useState<OrchestratedTask[]>(() => governmentWorkflowOrchestrator.getQueue());
  const [metrics] = useState(() => governmentWorkflowOrchestrator.getWorkloadMetrics());

  const handleStep = () => {
    governmentWorkflowOrchestrator.processNextQueuedTask();
    setTasks([...governmentWorkflowOrchestrator.getQueue()]);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'P0_CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">P0 CRITICAL</span>;
      case 'P1_HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">P1 HIGH</span>;
      case 'P2_NORMAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">P2 NORMAL</span>;
      case 'P3_BACKGROUND':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-600 border border-slate-500/20">P3 BACKGROUND</span>;
    }
  };

  const getStateBadge = (state: TaskState) => {
    switch (state) {
      case 'PROCESSING':
        return <span className="flex items-center gap-1 text-xs font-bold text-amber-500 animate-pulse"><Clock className="w-3.5 h-3.5" /> Processing</span>;
      case 'QUEUED':
        return <span className="text-xs font-semibold text-slate-400">Queued</span>;
      case 'COMPLETED':
        return <span className="flex items-center gap-1 text-xs font-bold text-emerald-500"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>;
      default:
        return <span className="text-xs text-slate-400">{state}</span>;
    }
  };

  return (
    <div id="r618-government-workflow-orchestrator" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Government Workflow Orchestrator
                </h1>
                <span className="text-xs px-2 py-0.5 font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded border border-purple-500/20">
                  R618
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                AI Asy Prime Minister Dispatcher: Pengaturan antrean prioritas, beban kerja, dan optimasi tugas kementerian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStep}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Zap className="w-4 h-4" />
              Dispatch / Process Next Task
            </button>
          </div>
        </div>

        {/* Workload Distribution Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {metrics.map((m) => (
            <div
              key={m.ministryCode}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{m.ministryName}</span>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 font-bold">
                  {m.averageLoadPercent}% Load
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${m.averageLoadPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{m.totalActiveEmployees} Pegawai Aktif</span>
                <span>{m.completedTasks24h} Tasks (24h)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Queue Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-500" />
            Antrean Tugas Otonom Terorkestrasi (AI Asy Queue)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {tasks.filter(t => t.state === 'PROCESSING' || t.state === 'QUEUED').length} Tasks Pending / Active
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.map((t) => (
            <div key={t.taskId} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">{t.taskId}</span>
                  {getPriorityBadge(t.priority)}
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {t.ministryTarget}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.title}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Ditugaskan ke: <strong className="text-slate-700 dark:text-slate-300">{t.assignedName}</strong> ({t.assignedNip})</span>
                  <span>•</span>
                  <span>Estimasi: {t.estimatedEffortMs}ms</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {getStateBadge(t.state)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
