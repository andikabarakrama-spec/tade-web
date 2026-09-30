import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Briefcase,
  Users,
  HardDrive,
  RefreshCw,
  Zap,
  Gauge,
} from 'lucide-react';
import {
  unifiedTelemetryMatrix,
  UnifiedTelemetrySnapshot,
} from '../../core/kernel/UnifiedTelemetryMatrix';

export const UnifiedTelemetryMatrixViewer: React.FC = () => {
  const [snapshot, setSnapshot] = useState<UnifiedTelemetrySnapshot>(unifiedTelemetryMatrix.getSnapshot());

  useEffect(() => {
    const unsub = unifiedTelemetryMatrix.subscribe((newSnap) => {
      setSnapshot(newSnap);
    });
    const interval = setInterval(() => {
      unifiedTelemetryMatrix.refresh();
    }, 2500);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleManualRefresh = () => {
    setSnapshot(unifiedTelemetryMatrix.refresh());
  };

  return (
    <div id="unified-telemetry-matrix-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R628 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Unified Telemetry Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Gauge className="w-8 h-8 text-emerald-400" />
              Unified Telemetry Matrix
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Single Source of Truth aggregating Guardian, AI Asy, Civil Service, Recovery Swarm, Storage, and Virtual Runtime metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Pulse Snapshot
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">OVERALL HEALTH SCORE</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{snapshot.overallHealthScore}/100</span>
            <span className="text-[9px] text-emerald-500 block">{snapshot.overallStatus}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">VIRTUAL FPS</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{snapshot.runtime.virtualFps.toFixed(1)} FPS</span>
            <span className="text-[9px] text-cyan-500 block">V-Sync Locked</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">NETLINK EVENTS</span>
            <span className="text-xl font-bold text-purple-400 font-mono">{snapshot.runtime.netlinkEventsPerSec}/s</span>
            <span className="text-[9px] text-purple-500 block">Zero Dropped</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">SNAPSHOT INTEGRITY</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{snapshot.storage.snapshotIntegrityScore}%</span>
            <span className="text-[9px] text-emerald-500 block">SHA-256 Validated</span>
          </div>
        </div>
      </div>

      {/* 6 Subsystem Matrices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Guardian Military Subsystem */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              Guardian Military (Ring-0)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              DEFCON {snapshot.guardian.defconLevel}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Ring-0 Integrity:</span>
              <span className="font-bold text-emerald-500">{snapshot.guardian.ring0IntegrityPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Threat Posture:</span>
              <span className="text-emerald-500">{snapshot.guardian.threatPosture}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Memory Reserve:</span>
              <span>{snapshot.guardian.memoryReserveMB} MB Pre-allocated</span>
            </div>
          </div>
        </div>

        {/* 2. AI Asy Prime Minister Subsystem */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
              AI Asy (Civil Cabinet)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
              {snapshot.aiAsy.ministerAssistantsOnline} Ministries
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Cabinet Load:</span>
              <span className="font-bold text-cyan-500">{snapshot.aiAsy.cabinetLoadPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Workflows:</span>
              <span>{snapshot.aiAsy.activeWorkflowsCount} Tasks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Response Latency:</span>
              <span className="text-emerald-500">{snapshot.aiAsy.responseLatencyMs} ms</span>
            </div>
          </div>
        </div>

        {/* 3. Civil Service Subsystem */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-500" />
              Civil Service Digital Staff
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
              {snapshot.civilService.totalEmployeesCount} NIP
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Active Staff:</span>
              <span className="font-bold text-purple-500">{snapshot.civilService.activeEmployeesCount} Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pending Queue:</span>
              <span>{snapshot.civilService.pendingTasksQueueDepth} Items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Pipelines:</span>
              <span>{snapshot.civilService.crossMinistryPipelinesActive} Ministries</span>
            </div>
          </div>
        </div>

        {/* 4. Recovery Swarm Subsystem */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Autonomous Recovery Swarm
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              {snapshot.recoverySwarm.activeSwarmNodes} Nodes
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Buffer Pool Health:</span>
              <span className="font-bold text-emerald-500">{snapshot.recoverySwarm.bufferPoolHealthPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Healing Speed:</span>
              <span>{snapshot.recoverySwarm.selfHealingRatePerSec} ops/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Lending Pool:</span>
              <span>{snapshot.recoverySwarm.peerLendingPoolMB} MB Buffer</span>
            </div>
          </div>
        </div>

        {/* 5. Storage Subsystem */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
              Immortal Storage & WAL
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              IMMORTAL VFS
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">IndexedDB Used:</span>
              <span className="font-bold text-emerald-500">{snapshot.storage.indexedDbUsedMB} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">WAL Buffer:</span>
              <span>{snapshot.storage.walBufferUsedMB} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Snapshot Integrity:</span>
              <span className="text-emerald-500">{snapshot.storage.snapshotIntegrityScore}%</span>
            </div>
          </div>
        </div>

        {/* 6. Virtual Runtime Subsystem */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Virtual Runtime Engine
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              CFS 99.5%
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Heap Allocated:</span>
              <span className="font-bold text-emerald-500">{snapshot.runtime.heapAllocatedMB} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Virtual Processes:</span>
              <span>{snapshot.runtime.virtualProcessesCount} VPIDs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Netlink Stream:</span>
              <span className="text-emerald-500">{snapshot.runtime.netlinkEventsPerSec} events/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
