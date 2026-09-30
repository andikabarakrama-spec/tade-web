import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Play,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Layers,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  ListOrdered
} from 'lucide-react';
import { recoveryReplayEngine } from '../../core/offline/recoveryReplayEngine';
import { safeSyncQueue } from '../../core/offline/safeSyncQueue';
import { ReplayExecutionResult, ReplayPhase } from '../../core/offline/offlineTypes';

interface Props {
  onNavigate?: (module: string) => void;
}

export const RecoveryReplayViewer: React.FC<Props> = ({ onNavigate }) => {
  const [execution, setExecution] = useState<ReplayExecutionResult | null>(
    recoveryReplayEngine.getCurrentExecution()
  );
  const [history, setHistory] = useState<ReplayExecutionResult[]>(recoveryReplayEngine.getHistory());
  const [isBusy, setIsBusy] = useState<boolean>(recoveryReplayEngine.isBusy());
  const [queuedCount, setQueuedCount] = useState<number>(safeSyncQueue.getQueuedCount());

  useEffect(() => {
    const unsubReplay = recoveryReplayEngine.subscribe((res) => {
      setExecution(res);
      setHistory(recoveryReplayEngine.getHistory());
      setIsBusy(recoveryReplayEngine.isBusy());
    });

    const unsubQueue = safeSyncQueue.subscribe(() => {
      setQueuedCount(safeSyncQueue.getQueuedCount());
    });

    return () => {
      unsubReplay();
      unsubQueue();
    };
  }, []);

  const handleRunReplay = async () => {
    await recoveryReplayEngine.executeRecoveryReplay();
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'RUNNING':
        return <RotateCcw className="w-5 h-5 text-indigo-500 animate-spin" />;
      case 'FAILED':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-300 dark:text-slate-700" />;
    }
  };

  const phasesList: Array<{ phase: ReplayPhase; title: string; desc: string }> = [
    { phase: 'RELOAD', title: '1. RELOAD', desc: 'Muat ulang baseline SSoT aktual dari src/services/db.ts' },
    { phase: 'PRE_VERIFY', title: '2. PRE-VERIFY', desc: 'Validasi integritas fingerprint & deteksi tabrakan' },
    { phase: 'REPLAY', title: '3. REPLAY', desc: 'Aplikasi mutasi sekuensial dengan jaminan idempoten' },
    { phase: 'POST_VERIFY', title: '4. POST-VERIFY', desc: 'Verifikasi konsistensi relasi data pasca-replay' },
    { phase: 'COMPLETE', title: '5. COMPLETE', desc: 'Ratifikasi sinkronisasi & pembersihan antrean aman' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              R736 &bull; RECOVERY REPLAY ENGINE
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ZERO DUPLICATE EXECUTION
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Mesin Replay Pemulihan 5-Fase Terotomasi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Siklus sinkronisasi deterministik: RELOAD &rarr; PRE-VERIFY &rarr; REPLAY &rarr; POST-VERIFY &rarr; COMPLETE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunReplay}
            disabled={isBusy}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            {isBusy ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isBusy ? 'Menjalankan Replay...' : `Eksekusi Replay (${queuedCount} Antrean)`}
          </button>
        </div>
      </div>

      {/* 5-Phase Step Visualizer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs font-mono">
            STATUS 5-PHASE REPLAY PIPELINE
          </h3>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {execution ? `Execution ID: ${execution.executionId}` : 'IDLE'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {phasesList.map((item) => {
            const phaseDetail = execution?.phases.find((p) => p.phase === item.phase);
            const status = phaseDetail?.status || 'PENDING';

            return (
              <div
                key={item.phase}
                className={`p-4 rounded-2xl border transition-all ${
                  status === 'RUNNING'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                    : status === 'SUCCESS'
                    ? 'border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-800/40'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                  {getPhaseIcon(status)}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {phaseDetail?.details || item.desc}
                </p>
                <div className="mt-2 text-[9px] font-mono font-bold uppercase text-slate-400">
                  {status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Summary Stats */}
      {execution && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-500">TOTAL QUEUED</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {execution.totalQueued}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-500">REPLAYED TO SSoT</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {execution.totalReplayed}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-500">CONFLICTS ISOLATED</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {execution.totalConflicts}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-500">ZERO DUPLICATE</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              GUARANTEED
            </div>
          </div>
        </div>
      )}

      {/* Replay History */}
      {history.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-500">
            RIWAYAT EKSEKUSI REPLAY SEBELUMNYA
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.slice(0, 5).map((h) => (
              <div key={h.executionId} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{h.executionId}</span>
                  <span className="text-[10px] text-slate-400 ml-2">
                    {new Date(h.startedAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {h.totalReplayed} Replayed
                  </span>
                  <span className="text-amber-600 dark:text-amber-400">
                    {h.totalConflicts} Conflicts
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
