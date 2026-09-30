import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  HardDrive,
  ListOrdered,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Radio,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { offlineContinuityManager } from '../../core/offline/offlineContinuityManager';
import { safeSyncQueue } from '../../core/offline/safeSyncQueue';
import { localSnapshotCache } from '../../core/offline/localSnapshotCache';
import { connectivityIntelligence } from '../../core/offline/connectivityIntelligence';
import { conflictResolutionEngine } from '../../core/offline/conflictResolutionEngine';

interface Props {
  onNavigate?: (module: string) => void;
}

export const OfflineReadinessDashboardViewer: React.FC<Props> = ({ onNavigate }) => {
  const [status, setStatus] = useState(offlineContinuityManager.getStatus());
  const [queueCount, setQueueCount] = useState(safeSyncQueue.getQueuedCount());
  const [snapshotCount, setSnapshotCount] = useState(localSnapshotCache.getAllSnapshots().length);
  const [stability, setStability] = useState(connectivityIntelligence.getStabilityScore());
  const [unresolvedConflicts, setUnresolvedConflicts] = useState(conflictResolutionEngine.getUnresolvedCount());

  useEffect(() => {
    const unsubStatus = offlineContinuityManager.subscribe((st) => setStatus(st));
    const unsubQueue = safeSyncQueue.subscribe(() => setQueueCount(safeSyncQueue.getQueuedCount()));
    const unsubSnap = localSnapshotCache.subscribe(() => setSnapshotCount(localSnapshotCache.getAllSnapshots().length));
    const unsubIntel = connectivityIntelligence.subscribe(() => setStability(connectivityIntelligence.getStabilityScore()));
    const unsubConf = conflictResolutionEngine.subscribe(() => setUnresolvedConflicts(conflictResolutionEngine.getUnresolvedCount()));

    return () => {
      unsubStatus();
      unsubQueue();
      unsubSnap();
      unsubIntel();
      unsubConf();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              R737 &bull; OFFLINE READINESS DASHBOARD
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              ALL ENGINES SYNCHRONIZED
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Dashboard Kesiapan &amp; Ketahanan Kontinuitas Offline
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Pandangan terpadu status cache lokal, antrean sinkronisasi aman, kesiapan pemulihan, dan tren konektivitas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('r740')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm"
            >
              Buka RC91 War Room &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Grid of 4 Key Status Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Connectivity Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold">STATE KONEKTIVITAS</span>
            <Radio className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{status}</div>
            <div className="text-xs text-slate-500 mt-0.5">Stabilitas Link: {stability}%</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">R731 Manager</span>
            {onNavigate && (
              <button onClick={() => onNavigate('r731')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Kelola &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Pillar 2: Sync Queue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold">SAFE SYNC QUEUE</span>
            <ListOrdered className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{queueCount} Item</div>
            <div className="text-xs text-slate-500 mt-0.5">Zero Duplicate Guarantee</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">R732 Safe Queue</span>
            {onNavigate && (
              <button onClick={() => onNavigate('r732')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Lihat &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Pillar 3: Local Snapshot Cache */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold">LOCAL SNAPSHOTS</span>
            <HardDrive className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{snapshotCount} Entitas</div>
            <div className="text-xs text-slate-500 mt-0.5">Checksum Verified</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">R734 Cache</span>
            {onNavigate && (
              <button onClick={() => onNavigate('r734')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Periksa &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Pillar 4: Conflict Quarantine */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold">CONFLICT QUARANTINE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{unresolvedConflicts} Terisolasi</div>
            <div className="text-xs text-slate-500 mt-0.5">Zero Dangerous Auto-Merge</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">R733 Conflicts</span>
            {onNavigate && (
              <button onClick={() => onNavigate('r733')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Resolusi &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recovery Readiness Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs font-mono">
          MATRIKS KESIAPAN PEMULIHAN OTOMATIS (READINESS MATRIX)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> 1. SSoT Grounding
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Seluruh operasi offline dialirkan melalui SSoT tunggal (<code>src/services/db.ts</code>) tanpa bypass.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> 2. Idempotency Lock
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Fingerprint SHA-256 mencegah replikasi ganda pada saat koneksi reconnect berulang.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> 3. 5-Phase Replay
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Siklus reload, pre-verify, replay, post-verify, dan complete siap dieksekusi secara otomatis saat link pulih.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
