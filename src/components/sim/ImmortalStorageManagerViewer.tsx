import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  ShieldCheck, 
  HardDrive, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Search,
  Filter,
  FileCode,
  ArrowDownToLine
} from 'lucide-react';
import { immortalStorage, StorageNamespace } from '../../core/kernel/ImmortalStorageManager';

export const ImmortalStorageManagerViewer: React.FC = () => {
  const [selectedNamespace, setSelectedNamespace] = useState<StorageNamespace>('SIM');
  const [activeCollection, setActiveCollection] = useState<string>('STUDENT_DATA');
  const [keyInput, setKeyInput] = useState<string>('STD-001');
  const [valueInput, setValueInput] = useState<string>('{"name": "Ahmad Fauzi", "grade": "X-A", "status": "ACTIVE"}');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastAction, setLastAction] = useState<string>('Storage Initialized & WAL Bound');

  const stats = immortalStorage.getStats();

  const handleSave = () => {
    try {
      const parsed = JSON.parse(valueInput);
      immortalStorage.setItem(selectedNamespace, activeCollection, keyInput, parsed);
      setLastAction(`Saved [${selectedNamespace}:${activeCollection}:${keyInput}] with atomic WAL log.`);
    } catch {
      setLastAction('Error: Nilai harus berupa JSON valid.');
    }
  };

  const handleHeal = () => {
    immortalStorage.healStorage();
    setLastAction('Storage healed and uncommitted WAL replayed.');
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                R585 &bull; IMMORTAL STORAGE MANAGER
              </span>
              <span className="text-xs text-slate-400 font-mono">Unified VFS &bull; Multi-Tier Cache Layer</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Immortal Unified Storage &amp; Namespace Isolator</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleHeal}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
          >
            <RefreshCw className="w-4 h-4" /> Replay WAL &amp; Heal
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
          <span className="text-slate-400 text-[10px] block">MEMORY CACHE ENTRIES</span>
          <span className="text-lg font-bold text-cyan-300">{stats.memoryEntries} Keys Active</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
          <span className="text-slate-400 text-[10px] block">WAL JOURNAL DEPTH</span>
          <span className="text-lg font-bold text-emerald-300">{stats.walCount} Records</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
          <span className="text-slate-400 text-[10px] block">ACTIVE SNAPSHOTS</span>
          <span className="text-lg font-bold text-purple-300">{stats.snapshotCount} Snapshots</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
          <span className="text-slate-400 text-[10px] block">STORAGE HEALTH</span>
          <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% IMMORTAL
          </span>
        </div>
      </div>

      {/* Storage Namespace Selector & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Namespace & Collection Selection */}
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-4">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            1. Namespace &amp; Collection
          </span>

          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 block">Namespace Isolation:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['SIM', 'WEBSITE', 'SYSTEM_KERNEL'] as StorageNamespace[]).map((ns) => (
                <button
                  key={ns}
                  onClick={() => setSelectedNamespace(ns)}
                  className={`py-2 px-1 text-center rounded-xl font-bold transition text-[10px] ${
                    selectedNamespace === ns
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {ns}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 block">Collection / Table Target:</label>
            <select
              value={activeCollection}
              onChange={(e) => setActiveCollection(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
            >
              <option value="STUDENT_DATA">STUDENT_DATA (Santri &amp; Siswa)</option>
              <option value="FINANCE_LEDGER">FINANCE_LEDGER (SPP &amp; Infaq)</option>
              <option value="ACADEMIC_RAPOR">ACADEMIC_RAPOR (Kurikulum Merdeka)</option>
              <option value="PPDB_REGISTRATION">PPDB_REGISTRATION (Pendaftar)</option>
              <option value="SYSTEM_METRICS">SYSTEM_METRICS (Kernel Telemetry)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
            <strong>Namespace Sandboxing:</strong> Data namespace <code>WEBSITE</code> tidak dapat diakses langsung oleh <code>SIM</code> tanpa perantara Guardian Ring 0.
          </div>
        </div>

        {/* Unified Record Editor */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-4">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            2. Record Writer with Atomic WAL Integration
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Record Key / Primary ID:</label>
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Storage Target Key URI:</label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 truncate text-xs">
                TADE_{selectedNamespace}_{activeCollection}_{keyInput}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Payload JSON (Memory &amp; LocalStorage Sync):</label>
            <textarea
              rows={3}
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 italic">Status: {lastAction}</span>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <ArrowDownToLine className="w-4 h-4" /> Atomic Write (WAL + Commit)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
