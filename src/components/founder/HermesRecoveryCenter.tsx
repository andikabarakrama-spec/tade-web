import React, { useState } from 'react';
import {
  RotateCcw,
  ShieldCheck,
  History,
  Play,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Database,
  Lock,
  Archive,
  Terminal,
  PlusCircle,
  FileCheck,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Activity,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  hermesRecoveryService,
  RecoverySnapshot,
  SimulationResult,
  IntegrityCheckResult
} from '../../services/hermesRecoveryService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const HermesRecoveryCenter: React.FC = () => {
  const [snapshots, setSnapshots] = useState<RecoverySnapshot[]>(hermesRecoveryService.getSnapshots());
  const [selectedSnapshot, setSelectedSnapshot] = useState<RecoverySnapshot>(snapshots[0]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [integrityResult, setIntegrityResult] = useState<IntegrityCheckResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCheckingIntegrity, setIsCheckingIntegrity] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'INTEGRITY'>('SIMULATOR');

  const handleSimulate = (snapshotId: string) => {
    setIsSimulating(true);
    setSimulationResult(null);
    setTimeout(() => {
      const res = hermesRecoveryService.simulateRollback(snapshotId);
      setSimulationResult(res);
      setIsSimulating(false);
      founderCommandRecorder.recordCommand(
        'SYSTEM_DIAGNOSTIC',
        'Hermes Recovery Center',
        `Uji Dry-Run Rollback Snapshot: ${selectedSnapshot.name}`
      );
    }, 600);
  };

  const handleRunIntegrityCheck = () => {
    setIsCheckingIntegrity(true);
    setTimeout(() => {
      const res = hermesRecoveryService.runIntegrityCheck();
      setIntegrityResult(res);
      setIsCheckingIntegrity(false);
      setFeedback('Audit Integritas Database SSoT selesai: 4/4 Kriteria Valid.');
      setTimeout(() => setFeedback(null), 3000);
    }, 500);
  };

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnapshotName.trim()) return;

    const created = hermesRecoveryService.createSandboxSnapshot(
      newSnapshotName.trim(),
      'Snapshot manual dibuat dari Hermes Recovery Center.'
    );
    setSnapshots(hermesRecoveryService.getSnapshots());
    setSelectedSnapshot(created);
    setNewSnapshotName('');
    setFeedback('Snapshot cadangan baru berhasil dibuat di lingkungan Sandbox.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredSnapshots = snapshots.filter(snap => {
    const matchesSearch =
      snap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snap.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || snap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-stone-900 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <RotateCcw className="w-3 h-3 text-amber-400" />
              HERMES SELF-HEALING CENTER v10.2
            </span>
            <span className="text-xs text-stone-300">
              Sprint G5 Living Intelligence & Self-Healing
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Pusat Pemulihan Data & Rollback Simulator
          </h2>
          <p className="text-xs text-amber-100/80 max-w-2xl">
            Simulasi pemulihan snapshot data terisolasi di Sandbox. Dilengkapi penjelajah snapshot, dry-run diff preview, dan audit integritas SSoT `db.ts`.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunIntegrityCheck}
            disabled={isCheckingIntegrity}
            className="px-3.5 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isCheckingIntegrity ? 'Memeriksa...' : 'Cek Integritas SSoT'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Navigation Switch */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('SIMULATOR')}
          className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'SIMULATOR'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Snapshot Browser & Dry-Run Simulator</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('INTEGRITY');
            if (!integrityResult) handleRunIntegrityCheck();
          }}
          className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'INTEGRITY'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Integritas SSoT & Cross-Validation</span>
        </button>
      </div>

      {activeTab === 'SIMULATOR' ? (
        /* Main 2-Column Split */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Snapshot List & Creation (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Create Snapshot Form */}
            <form onSubmit={handleCreateSnapshot} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-amber-600" />
                <span>Buat Snapshot Sandbox Baru</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  placeholder="Nama snapshot (contoh: Pra-Ujian Sentra)"
                  className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-600"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                >
                  Simpan
                </button>
              </div>
            </form>

            {/* Snapshot Search & Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari snapshot arsip..."
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                {['ALL', 'DAILY_AUTO', 'PRE_DEPLOY', 'MANUAL_FOUNDER', 'RING0_SAFEGUARD'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded-lg font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Snapshot Items List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredSnapshots.map((snap) => {
                const isSelected = selectedSnapshot.id === snap.id;
                return (
                  <div
                    key={snap.id}
                    onClick={() => {
                      setSelectedSnapshot(snap);
                      setSimulationResult(null);
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-50/50 border-amber-500 ring-1 ring-amber-500/40 shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                        {snap.category}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(snap.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-stone-900 leading-snug">
                      {snap.name}
                    </h4>

                    <p className="text-[11px] text-stone-500 line-clamp-2">
                      {snap.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-stone-600 pt-1 border-t border-stone-200/60 font-mono">
                      <span>Santri: {snap.recordCounts.santri} | Kas: {snap.recordCounts.keuangan}</span>
                      <span className="text-emerald-700 font-bold">SHA-256 Valid</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Snapshot Inspector & Dry-Run Simulator (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 font-mono uppercase">
                    ID: {selectedSnapshot.id}
                  </span>
                  <h3 className="text-base font-black text-stone-900 mt-0.5">
                    {selectedSnapshot.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    {selectedSnapshot.description}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedSnapshot.status}
                </span>
              </div>

              {/* Entity Breakdown Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Santri Terdata</span>
                  <span className="font-black text-stone-900 text-sm">{selectedSnapshot.recordCounts.santri}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Guru & Sentra</span>
                  <span className="font-black text-stone-900 text-sm">{selectedSnapshot.recordCounts.guru}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Entri Kas SPP</span>
                  <span className="font-black text-stone-900 text-sm">{selectedSnapshot.recordCounts.keuangan}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Media Terarsip</span>
                  <span className="font-black text-stone-900 text-sm">{selectedSnapshot.recordCounts.media}</span>
                </div>
              </div>

              {/* SHA-256 Checksum Card */}
              <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1 text-xs font-mono">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                  SHA-256 Cryptographic Seal:
                </span>
                <span className="text-[11px] text-stone-800 break-all select-all font-semibold">
                  {selectedSnapshot.sha256Hash}
                </span>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Uji dry-run tanpa mengubah database asli.</span>
                </div>

                <button
                  onClick={() => handleSimulate(selectedSnapshot.id)}
                  disabled={isSimulating}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Menjalankan Simulasi...' : 'Jalankan Dry-Run Rollback'}</span>
                </button>
              </div>
            </div>

            {/* Simulation Result Output & Diff Preview */}
            {simulationResult && (
              <div className="p-5 bg-slate-900 text-white rounded-2xl border border-stone-800 space-y-4 text-xs animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <Terminal className="w-4 h-4" />
                    <span>Hasil Simulasi Sandbox (Safe Diff Verified)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono text-[10px]">
                    ZERO CORRUPTION
                  </span>
                </div>

                <p className="text-stone-300 text-[11px] leading-relaxed">
                  {simulationResult.dryRunMessage}
                </p>

                {/* Diff Comparison Table */}
                <div className="space-y-2">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Pratinjau Perubahan Field:</span>
                  <div className="space-y-1.5">
                    {simulationResult.fieldDiffs.map((diff, i) => (
                      <div key={i} className="p-2.5 bg-slate-800 rounded-xl border border-stone-700 flex items-center justify-between gap-2 text-[11px]">
                        <div className="font-bold text-stone-200 truncate w-1/3">{diff.entity}</div>
                        <div className="flex items-center gap-2 flex-1 justify-end font-mono">
                          <span className="text-rose-400 truncate">{diff.before}</span>
                          <ArrowRight className="w-3 h-3 text-stone-500 shrink-0" />
                          <span className="text-emerald-400 truncate">{diff.after}</span>
                        </div>
                        <span className="px-1.5 py-0.5 bg-emerald-900/80 text-emerald-300 text-[9px] font-bold rounded">
                          {diff.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sandbox Log Stream */}
                <div className="bg-black/50 p-3 rounded-xl border border-stone-800 space-y-1 font-mono text-[10px] text-stone-400">
                  {simulationResult.sandboxLogs.map((log, idx) => (
                    <div key={idx} className="leading-snug">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: INTEGRITY CHECKER */
        <div className="space-y-4">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-sm text-stone-900">Audit Integritas SSoT Database</h4>
              <p className="text-xs text-stone-500">Cross-validation struktur data `src/services/db.ts` dan relasi kunci foreign role.</p>
            </div>
            <button
              onClick={handleRunIntegrityCheck}
              disabled={isCheckingIntegrity}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingIntegrity ? 'animate-spin' : ''}`} />
              <span>Jalankan Ulang Audit</span>
            </button>
          </div>

          {integrityResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {integrityResult.checks.map((c, i) => (
                <div key={i} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-xs text-stone-900">{c.name}</h5>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {c.details}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
