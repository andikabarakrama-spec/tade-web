import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ShieldCheck, 
  RotateCcw, 
  Clock, 
  HardDrive, 
  CheckCircle2, 
  Plus, 
  Hash, 
  FileCheck2,
  Lock,
  Layers
} from 'lucide-react';
import { immortalStorage, StorageSnapshot } from '../../core/kernel/ImmortalStorageManager';

export const SmartSnapshotSchedulerViewer: React.FC = () => {
  const [snapshots, setSnapshots] = useState<StorageSnapshot[]>([]);
  const [selectedReason, setSelectedReason] = useState<StorageSnapshot['reason']>('PRE_MIGRATION');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const refreshSnapshots = () => {
    setSnapshots(immortalStorage.getSnapshots());
  };

  useEffect(() => {
    refreshSnapshots();
  }, []);

  const handleCreateSnapshot = () => {
    const snap = immortalStorage.createSnapshot('SIM', selectedReason, {
      studentsCount: 384,
      teachersCount: 36,
      curriculum: 'Kurikulum Merdeka 2026',
      financeBalance: 'Rp 428.500.000',
      timestamp: new Date().toISOString()
    });
    refreshSnapshots();
    setStatusMessage(`Created immutable snapshot ${snap.snapshotId} (${snap.sha256Hash}).`);
  };

  const handleRestore = (id: string) => {
    const ok = immortalStorage.restoreSnapshot(id);
    if (ok) {
      setStatusMessage(`Snapshot ${id} restored to memory cache successfully.`);
    } else {
      setStatusMessage(`Failed to restore snapshot ${id}.`);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30 text-purple-400">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
                R587 &bull; SMART SNAPSHOT SCHEDULER
              </span>
              <span className="text-xs text-slate-400 font-mono">Redis-Grade Point-In-Time Recovery</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Smart Snapshot Engine &amp; SHA-256 Checkpoints</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value as StorageSnapshot['reason'])}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
          >
            <option value="PRE_MIGRATION">Pre-Migration Checkpoint</option>
            <option value="PRE_IMPORT">Pre-Excel Import Checkpoint</option>
            <option value="DISASTER_BACKUP">Disaster Backup Snapshot</option>
            <option value="SCHEDULED">Automated Cron Snapshot</option>
            <option value="MANUAL">Manual Trigger</option>
          </select>
          <button
            onClick={handleCreateSnapshot}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" /> Create Snapshot
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 font-mono text-xs text-purple-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Trigger Reasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
          <span className="text-purple-400 font-bold block">1. Pre-Update Besar</span>
          <p className="text-slate-400 text-[11px] font-sans">Sebelum kenaikan kelas massal atau perubahan KKM.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
          <span className="text-cyan-400 font-bold block">2. Pre-Import Excel</span>
          <p className="text-slate-400 text-[11px] font-sans">Sebelum import ratusan santri PPDB dari spreadsheet.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
          <span className="text-emerald-400 font-bold block">3. Pre-Backup Cloud</span>
          <p className="text-slate-400 text-[11px] font-sans">Snapshot state konsisten sebelum sinkronisasi cloud.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
          <span className="text-amber-400 font-bold block">4. Pre-Recovery War Room</span>
          <p className="text-slate-400 text-[11px] font-sans">Snapshot darurat sebelum trigger healing otomatis.</p>
        </div>
      </div>

      {/* Snapshot Ledger List */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-purple-400" />
          Point-In-Time Snapshots (/var/backups/tade_snapshots/):
        </span>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {snapshots.map((snap) => (
            <div
              key={snap.snapshotId}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800 text-[10px]">
                    {snap.snapshotId}
                  </span>
                  <span className="text-white font-bold">{snap.reason}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                    {snap.namespace}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Records: {snap.totalRecords}</span>
                  <span className="text-emerald-400 font-mono">Hash: {snap.sha256Hash}</span>
                  <span>{new Date(snap.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(snap.snapshotId)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-bold border border-purple-500/40 transition flex items-center gap-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore Checkpoint
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
