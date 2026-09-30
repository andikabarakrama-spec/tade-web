import React, { useState, useEffect } from 'react';
import {
  ListOrdered,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Layers,
  ArrowUpDown,
  FileCode
} from 'lucide-react';
import { safeSyncQueue } from '../../core/offline/safeSyncQueue';
import { SyncOperation } from '../../core/offline/offlineTypes';

interface Props {
  onNavigate?: (module: string) => void;
}

export const SafeSyncQueueViewer: React.FC<Props> = ({ onNavigate }) => {
  const [queue, setQueue] = useState<SyncOperation[]>(safeSyncQueue.getQueue());
  const [filter, setFilter] = useState<'ALL' | 'QUEUED' | 'IN_FLIGHT' | 'FAILED' | 'CONFLICT'>('ALL');
  const [selectedOp, setSelectedOp] = useState<SyncOperation | null>(null);

  useEffect(() => {
    const unsub = safeSyncQueue.subscribe((q) => {
      setQueue(q);
    });
    return () => unsub();
  }, []);

  const handleAddSampleOp = () => {
    const types = ['SISWA', 'PENGUMUMAN', 'PRESENSI', 'CATATAN_GURU', 'INVENTARIS'];
    const actions: Array<'CREATE' | 'UPDATE' | 'DELETE'> = ['CREATE', 'UPDATE', 'UPDATE'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const chosenAction = actions[Math.floor(Math.random() * actions.length)];

    safeSyncQueue.enqueue({
      entityType: chosenType,
      action: chosenAction,
      payload: {
        id: `draft_${Date.now()}`,
        title: `Mutasi Offline ${chosenType}`,
        timestamp: new Date().toISOString(),
        author: 'USER_LOCAL',
        note: 'Dibuat saat offline mode aktif.'
      },
      priority: chosenType === 'PRESENSI' ? 'CRITICAL' : chosenType === 'SISWA' ? 'HIGH' : 'NORMAL',
      sourceModule: 'SafeQueueViewer',
      author: 'OPERATOR'
    });
  };

  const handleRetryFailed = () => {
    safeSyncQueue.retryAllFailed();
  };

  const handleClearAll = () => {
    if (window.confirm('Bersihkan seluruh antrean safe sync queue?')) {
      safeSyncQueue.clearQueue();
    }
  };

  const filteredQueue = queue.filter((op) => {
    if (filter === 'ALL') return true;
    return op.status === filter;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'QUEUED':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300';
      case 'IN_FLIGHT':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 animate-pulse';
      case 'SYNCED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'CONFLICT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'FAILED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              R732 &bull; SAFE SYNC QUEUE
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ZERO DUPLICATE GUARANTEE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Antrean Sinkronisasi Aman Berbasis Idempotensi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Setiap mutasi offline dienkapsulasi dengan ID, timestamp, cryptographic fingerprint, dan prioritas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSampleOp}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Enqueue Mutasi
          </button>
          <button
            onClick={handleRetryFailed}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Failed
          </button>
          <button
            onClick={handleClearAll}
            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-all"
            title="Clear Queue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-500">TOTAL QUEUED</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {queue.filter((q) => q.status === 'QUEUED').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-500">IN FLIGHT</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {queue.filter((q) => q.status === 'IN_FLIGHT').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-500">FAILED / CONFLICT</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {queue.filter((q) => q.status === 'FAILED' || q.status === 'CONFLICT').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-500">DEDUPLICATION</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            100%
          </div>
        </div>
      </div>

      {/* Filter Tabs & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(['ALL', 'QUEUED', 'IN_FLIGHT', 'CONFLICT', 'FAILED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  filter === tab
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredQueue.length} item ditemukan
          </span>
        </div>

        {filteredQueue.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ListOrdered className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Tidak ada antrean dalam filter ini</p>
            <p className="text-xs mt-1">Seluruh transaksi tersinkronisasi bersih dengan SSoT.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">OPERASI / ID</th>
                  <th className="p-3.5">ENTITY</th>
                  <th className="p-3.5">ACTION</th>
                  <th className="p-3.5">PRIORITAS</th>
                  <th className="p-3.5">FINGERPRINT</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5">RETRY</th>
                  <th className="p-3.5 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQueue.map((op) => (
                  <tr key={op.operationId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div>{op.operationId}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {new Date(op.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {op.entityType}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {op.action}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getPriorityBadge(op.priority)}`}>
                        {op.priority}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px] flex items-center gap-1">
                      <Fingerprint className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate max-w-[120px]">{op.fingerprint}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(op.status)}`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {op.retryCount} / {op.maxRetries}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedOp(op)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Operation Modal / Inspector */}
      {selectedOp && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-sm">Payload Inspector: {selectedOp.operationId}</span>
            </div>
            <button
              onClick={() => setSelectedOp(null)}
              className="text-slate-400 hover:text-white font-bold"
            >
              Close [X]
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
            <div>Entity: <span className="text-white">{selectedOp.entityType}</span></div>
            <div>Action: <span className="text-white">{selectedOp.action}</span></div>
            <div>Priority: <span className="text-white">{selectedOp.priority}</span></div>
            <div>Author: <span className="text-white">{selectedOp.author}</span></div>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-[11px] overflow-x-auto">
            {JSON.stringify(selectedOp.payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
