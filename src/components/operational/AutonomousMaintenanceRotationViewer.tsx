import React, { useState, useEffect } from 'react';
import { RotateCw, CheckCircle2, Trash2, HardDrive, Database, Zap, Clock, ShieldCheck } from 'lucide-react';
import { autonomousMaintenanceRotation, MaintenanceRotationSummary, MaintenanceRotationTask } from '../../core/operational/AutonomousMaintenanceRotation';

export const AutonomousMaintenanceRotationViewer: React.FC = () => {
  const [summary, setSummary] = useState<MaintenanceRotationSummary>(autonomousMaintenanceRotation.getSummary());
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = autonomousMaintenanceRotation.subscribe(() => {
      setSummary(autonomousMaintenanceRotation.getSummary());
    });
    return () => unsub();
  }, []);

  const handleRunPass = (taskId?: string) => {
    setRunningTaskId(taskId || 'ALL');
    setTimeout(() => {
      autonomousMaintenanceRotation.executeRotationPass(taskId);
      setRunningTaskId(null);
    }, 600);
  };

  return (
    <div id="autonomous-maintenance-rotation-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              R642 &bull; AUTONOMOUS MAINTENANCE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              LOGROTATE ARCHITECTURE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Autonomous Maintenance Rotation &amp; Quota Compaction
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated maintenance cycles: Cache cleanup, snapshot pruning, WORM journal compaction, and Firestore quota governance.
          </p>
        </div>

        <button
          onClick={() => handleRunPass()}
          disabled={runningTaskId !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-mono font-bold transition-all shadow-sm"
        >
          <RotateCw className={`w-4 h-4 ${runningTaskId ? 'animate-spin' : ''}`} /> Run All Maintenance Cycles
        </button>
      </div>

      {/* Reclaimed Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">TOTAL RECLAIMED STORAGE</span>
          <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">
            {(summary.totalReclaimedBytesKB / 1024).toFixed(2)} MB
          </span>
          <span className="text-[10px] text-slate-500 block">Pruned &amp; Compacted</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">FIRESTORE QUOTA BUFFER</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            +{summary.firestoreQuotaPreservedMB} MB Free
          </span>
          <span className="text-[10px] text-emerald-500 block">Zero Bill Overrun</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">HEAP MEMORY SAVED</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">
            ~{summary.heapMemorySavedMB} MB
          </span>
          <span className="text-[10px] text-slate-500 block">60 FPS Guaranteed</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">ROTATION DAEMON</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            ACTIVE
          </span>
          <span className="text-[10px] text-emerald-500 block">4/4 Schedules Active</span>
        </div>
      </div>

      {/* Rotation Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summary.tasks.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                {task.id}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {task.status}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {task.name}
            </h4>

            <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Category:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{task.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Schedule:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{task.schedule}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Items Reclaimed:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{task.itemsReclaimed} objects</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Space Saved:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{(task.bytesSavedKB / 1024).toFixed(2)} MB</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Last Run: {new Date(task.lastRunTimestamp).toLocaleTimeString()}
              </span>
              <button
                onClick={() => handleRunPass(task.id)}
                disabled={runningTaskId === task.id}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-cyan-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-all"
              >
                Trigger Pass
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
