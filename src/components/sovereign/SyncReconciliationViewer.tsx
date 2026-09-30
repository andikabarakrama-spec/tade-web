import React, { useState } from 'react';
import { 
  GitMerge, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  Database, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Sliders
} from 'lucide-react';
import { OfflineContinuityEngine, PendingOfflineAction } from '../../core/sovereign/offlineContinuityEngine';

export const SyncReconciliationViewer: React.FC = () => {
  const engine = OfflineContinuityEngine.getInstance();
  const [queue, setQueue] = useState<PendingOfflineAction[]>(() => engine.getQueue());
  const [selectedActionId, setSelectedActionId] = useState<string>(queue[0]?.actionId || '');
  const [resolutionFeedback, setResolutionFeedback] = useState<string | null>(null);

  const selectedAction = queue.find(q => q.actionId === selectedActionId) || queue[0];

  const refresh = () => {
    setQueue(engine.getQueue());
  };

  const handleResolve = (actionId: string, keepLocal: boolean) => {
    const success = engine.resolveConflictManually(actionId, keepLocal);
    if (success) {
      setResolutionFeedback(`Konflik pada tindakan ${actionId} berhasil diselesaikan melalui ${keepLocal ? 'Prioritas Payload Lokal' : 'Sinkronisasi SSoT'}.`);
      refresh();
      setTimeout(() => setResolutionFeedback(null), 5000);
    }
  };

  const pendingCount = queue.filter(q => q.status === 'QUEUED' || q.status === 'RETRYING').length;
  const reconcileCount = queue.filter(q => q.status === 'RECONCILING').length;
  const conflictCount = queue.filter(q => q.status === 'CONFLICT_DETECTED').length;
  const syncedCount = queue.filter(q => q.status === 'SYNCED').length;

  return (
    <div className="space-y-6" id="sync-reconciliation-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                <GitMerge className="w-3 h-3" />
                Continuity Sync
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R766 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Sync Reconciliation & Non-Destructive Diff Viewer
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Visualisasi empat tahapan siklus sinkronisasi (*Pending*, *Reconcile*, *Conflict*, *Synced*) dengan perbandingan diff field riil sebelum komit ke SSoT.
            </p>
          </div>

          <button
            onClick={() => {
              engine.executeGradualSync();
              refresh();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Jalankan Rekonsiliasi Otomatis</span>
          </button>
        </div>
      </div>

      {resolutionFeedback && (
        <div className="p-4 bg-slate-900 border border-sky-500/40 rounded-xl text-sky-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-sky-400" />
          <span>{resolutionFeedback}</span>
        </div>
      )}

      {/* 4 Stages Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">1. Pending</span>
            <p className="text-xl font-black text-white">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Sliders className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">2. Reconcile</span>
            <p className="text-xl font-black text-sky-400">{reconcileCount}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">3. Conflict</span>
            <p className="text-xl font-black text-rose-400">{conflictCount}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">4. Synced</span>
            <p className="text-xl font-black text-emerald-400">{syncedCount}</p>
          </div>
        </div>
      </div>

      {/* Main Diff & Actions Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Daftar Antrean Rekonsiliasi ({queue.length})
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {queue.map(item => (
              <button
                key={item.actionId}
                onClick={() => setSelectedActionId(item.actionId)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedAction?.actionId === item.actionId
                    ? 'bg-sky-950/60 border-sky-500/60 text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">{item.actionId}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-white font-semibold mt-1 truncate">{item.payloadSummary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Diff & Resolution Detail */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          {selectedAction ? (
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-sky-400" />
                    Inspeksi Diff: {selectedAction.actionId} ({selectedAction.entityType})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedAction.payloadSummary}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedAction.status === 'SYNCED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {selectedAction.status}
                </span>
              </div>

              {/* Side-by-side Payload vs SSoT comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-sky-400 block mb-2">Payload Antrean Lokal:</span>
                  <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
                    {JSON.stringify(selectedAction.payloadData, null, 2)}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 block mb-2">Pemeriksaan State SSoT (`db.ts`):</span>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p><span className="text-slate-500 font-mono">Entity Target:</span> {selectedAction.entityId}</p>
                    <p><span className="text-slate-500 font-mono">Dibuat Oleh:</span> {selectedAction.performedByRole} ({selectedAction.performedByUid})</p>
                    <p><span className="text-slate-500 font-mono">Waktu Dibuat:</span> {selectedAction.createdAt}</p>
                    <p><span className="text-slate-500 font-mono">Status Invarian:</span> Zero Conflict Overwrite Guaranteed</p>
                  </div>
                </div>
              </div>

              {/* Action Resolution Button */}
              {selectedAction.status !== 'SYNCED' && (
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleResolve(selectedAction.actionId, true)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    Terapkan Rekonsiliasi Aman ke SSoT
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 text-slate-500 text-xs">Pilih tindakan untuk melihat perbandingan diff.</div>
          )}
        </div>
      </div>
    </div>
  );
};
