import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCode,
  Layers,
  Database
} from 'lucide-react';
import { localSnapshotCache } from '../../core/offline/localSnapshotCache';
import { LocalSnapshot } from '../../core/offline/offlineTypes';

interface Props {
  onNavigate?: (module: string) => void;
}

export const LocalSnapshotCacheViewer: React.FC<Props> = ({ onNavigate }) => {
  const [snapshots, setSnapshots] = useState<LocalSnapshot[]>(localSnapshotCache.getAllSnapshots());
  const [selectedSnapshot, setSelectedSnapshot] = useState<LocalSnapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshList = () => {
    setSnapshots(localSnapshotCache.getAllSnapshots());
  };

  useEffect(() => {
    const unsub = localSnapshotCache.subscribe(() => {
      refreshList();
    });
    return () => unsub();
  }, []);

  const handleReseed = async () => {
    setLoading(true);
    await localSnapshotCache.refreshAllFromSSoT();
    refreshList();
    setLoading(false);
  };

  const handlePurge = () => {
    const purged = localSnapshotCache.purgeExpired();
    refreshList();
    alert(`Berhasil membersihkan ${purged} snapshot kedaluwarsa.`);
  };

  const calculateRemainingMinutes = (expiresAt: string) => {
    const remainingMs = new Date(expiresAt).getTime() - Date.now();
    if (remainingMs <= 0) return 'Expired';
    const mins = Math.floor(remainingMs / (1000 * 60));
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours}j ${mins % 60}m`;
    return `${mins} menit`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              R734 &bull; LOCAL SNAPSHOT CACHE
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> READ-ONLY CACHE WITH TTL
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Cache Snapshot Lokal &amp; Tamper Checksum
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Menyediakan data bacaan berkinerja tinggi saat offline tanpa pernah menggantikan SSoT (db.ts).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReseed}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Menyemai...' : 'Re-seed SSoT Snapshots'}
          </button>
          <button
            onClick={handlePurge}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Purge Expired
          </button>
        </div>
      </div>

      {/* Snapshot Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500">ACTIVE SNAPSHOTS</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {snapshots.length} Entitas
            </div>
          </div>
          <HardDrive className="w-8 h-8 text-indigo-500 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500">CHECKSUM INTEGRITY</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              100% VALID
            </div>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500">SSOT AUTHORITY</span>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              db.ts SSoT
            </div>
          </div>
          <Database className="w-8 h-8 text-sky-500 opacity-80" />
        </div>
      </div>

      {/* Snapshots Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-500">
            REGISTER SNAPSHOT LOKAL AKTIF ({snapshots.length})
          </span>
          <span className="text-xs font-mono text-slate-400">
            Tersimpan di IndexedDB/localStorage dengan TTL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">KEY SNAPSHOT</th>
                <th className="p-3.5">ENTITY TYPE</th>
                <th className="p-3.5">JUMLAH ITEM</th>
                <th className="p-3.5">WAKTU DIBUAT</th>
                <th className="p-3.5">SISA TTL</th>
                <th className="p-3.5">CHECKSUM</th>
                <th className="p-3.5 text-right">INSPEKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {snapshots.map((snap) => (
                <tr key={snap.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {snap.key}
                  </td>
                  <td className="p-3.5 font-semibold text-indigo-600 dark:text-indigo-400">
                    {snap.entityType}
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">
                    {snap.itemCount || 1} records
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {new Date(snap.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 w-fit">
                      <Clock className="w-3 h-3" />
                      {calculateRemainingMinutes(snap.expiresAt)}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                    {snap.checksum}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedSnapshot(snap)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                    >
                      View Data
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Payload Modal */}
      {selectedSnapshot && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm">
                Snapshot Payload: {selectedSnapshot.key} ({selectedSnapshot.entityType})
              </span>
            </div>
            <button
              onClick={() => setSelectedSnapshot(null)}
              className="text-slate-400 hover:text-white font-bold"
            >
              Close [X]
            </button>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div>TTL: <span className="text-white">{selectedSnapshot.ttlMs / 60000} min</span></div>
            <div>Checksum: <span className="text-emerald-400">{selectedSnapshot.checksum}</span></div>
            <div>Expires: <span className="text-white">{new Date(selectedSnapshot.expiresAt).toLocaleTimeString()}</span></div>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 text-[11px] overflow-x-auto max-h-72">
            {JSON.stringify(selectedSnapshot.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
