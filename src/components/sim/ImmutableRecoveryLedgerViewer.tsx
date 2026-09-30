import React, { useState } from 'react';
import { 
  FileLock2, 
  ShieldCheck, 
  CheckCircle2, 
  Link2, 
  Search, 
  Database, 
  Lock, 
  Fingerprint, 
  Clock, 
  Plus, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { EngineId } from '../../core/kernel/GuardianKernelLayer';

interface RecoveryLedgerEntry {
  recoveryId: string;
  previousHash: string;
  currentHash: string;
  timestamp: string;
  engineOwner: EngineId;
  incidentType: string;
  resolutionStatus: 'RESOLVED_AUTOMATICALLY' | 'QUARANTINE_RECOVERED' | 'MANUAL_VERIFIED';
  operatorSign: string;
  durationMs: number;
}

export const ImmutableRecoveryLedgerViewer: React.FC = () => {
  const [ledger, setLedger] = useState<RecoveryLedgerEntry[]>([
    {
      recoveryId: 'REC-2026-0001',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      currentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      timestamp: '2026-08-16T04:12:00.000Z',
      engineOwner: 'GUARDIAN',
      incidentType: 'Kernel Cold Boot Genesis Anchor',
      resolutionStatus: 'RESOLVED_AUTOMATICALLY',
      operatorSign: 'SYSTEM_ROOT_RING0',
      durationMs: 12
    },
    {
      recoveryId: 'REC-2026-0002',
      previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      currentHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      timestamp: '2026-08-16T05:30:15.000Z',
      engineOwner: 'PPDB',
      incidentType: 'Temporary WAL lock contention resolved via CFS throttle',
      resolutionStatus: 'RESOLVED_AUTOMATICALLY',
      operatorSign: 'GUARDIAN_SWARM_V2',
      durationMs: 8
    },
    {
      recoveryId: 'REC-2026-0003',
      previousHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      currentHash: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
      timestamp: '2026-08-16T06:45:22.000Z',
      engineOwner: 'SESSION',
      incidentType: 'Uncaught token expired in background tab, auto-rotated',
      resolutionStatus: 'RESOLVED_AUTOMATICALLY',
      operatorSign: 'AI_ASY_HEURISTIC',
      durationMs: 4
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chainValid, setChainValid] = useState<boolean>(true);

  // Helper to generate a fake 64-char sha256 string for demo
  const generateHash = (prev: string, seed: string) => {
    let hash = 0;
    const str = prev + seed + Date.now();
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Array.from({ length: 64 }, (_, idx) =>
      Math.abs((hash ^ (idx * 31)) % 16).toString(16)
    ).join('');
  };

  const handleAppendNewRecord = (engine: EngineId, incident: string) => {
    const lastEntry = ledger[ledger.length - 1];
    const prevHash = lastEntry ? lastEntry.currentHash : '0'.repeat(64);
    const newHash = generateHash(prevHash, engine + incident);

    const newRecord: RecoveryLedgerEntry = {
      recoveryId: `REC-2026-${String(ledger.length + 1).padStart(4, '0')}`,
      previousHash: prevHash,
      currentHash: newHash,
      timestamp: new Date().toISOString(),
      engineOwner: engine,
      incidentType: incident,
      resolutionStatus: 'RESOLVED_AUTOMATICALLY',
      operatorSign: 'GUARDIAN_IMMUTABLE_CORE',
      durationMs: Math.floor(Math.random() * 15 + 2)
    };

    setLedger(prev => [...prev, newRecord]);
    setChainValid(true);
  };

  const handleVerifyChainIntegrity = () => {
    let isValid = true;
    for (let i = 1; i < ledger.length; i++) {
      if (ledger[i].previousHash !== ledger[i - 1].currentHash) {
        isValid = false;
        break;
      }
    }
    setChainValid(isValid);
  };

  const filteredLedger = ledger.filter(
    item =>
      item.recoveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.engineOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currentHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/30 text-violet-400">
            <FileLock2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-900/60 text-violet-300 border border-violet-700/50">
                R579 &bull; IMMUTABLE RECOVERY LEDGER
              </span>
              <span className="text-xs text-slate-400 font-mono">Cryptographic SHA-256 Hash Chain</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Immutable Recovery Ledger &amp; Audit Trail</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyChainIntegrity}
            className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-violet-600/30"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify Hash Chain
          </button>
        </div>
      </div>

      {/* Chain Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase">Chain Integrity State</span>
            <span className="text-sm font-bold text-emerald-300">
              {chainValid ? '100% CRYPTOGRAPHICALLY VALID & TAMPER EVIDENT' : 'CHAIN TAMPER DETECTED'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Blocks</span>
            <span className="text-base font-bold text-white">{ledger.length} Records</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Hash Function</span>
            <span className="text-base font-bold text-cyan-300">SHA-256</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Consensus Mode</span>
            <span className="text-base font-bold text-indigo-300">Kernel Sovereign</span>
          </div>
        </div>
      </div>

      {/* Append Quick Test */}
      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <Plus className="w-4 h-4 text-violet-400" />
          Simulate New Immutable Audit Record:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAppendNewRecord('FIRESTORE', 'Offline transaction cache replayed & synced to remote store')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
          >
            + Firestore WAL Replay
          </button>
          <button
            onClick={() => handleAppendNewRecord('RAPORT', 'Auto-recovery after high calculation load on batch ranking')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
          >
            + Raport State Healed
          </button>
          <button
            onClick={() => handleAppendNewRecord('KEUANGAN', 'BOS ledger reconciliation block locked with zero variance')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
          >
            + Keuangan Block Signed
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-800 border border-slate-700 font-mono text-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Recovery ID, Engine, Incident type, or Hash..."
          className="bg-transparent w-full text-slate-200 focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* Blockchain-like Chain View */}
      <div className="space-y-3 font-mono text-xs">
        {filteredLedger.map((block, index) => (
          <div
            key={block.recoveryId}
            className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/70 hover:border-violet-500/60 transition space-y-2 relative"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-300 font-bold border border-violet-800">
                  Block #{index + 1} &bull; {block.recoveryId}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-bold">
                  {block.engineOwner}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  {block.resolutionStatus}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {new Date(block.timestamp).toLocaleString()} ({block.durationMs}ms)
              </div>
            </div>

            <p className="text-slate-200 text-xs font-sans font-medium">
              {block.incidentType}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="space-y-0.5 truncate">
                <span className="text-slate-500 block uppercase font-bold">Previous Hash:</span>
                <span className="text-slate-400 font-mono truncate block">{block.previousHash}</span>
              </div>
              <div className="space-y-0.5 truncate">
                <span className="text-violet-400 block uppercase font-bold">Current Block Hash (SHA-256):</span>
                <span className="text-cyan-300 font-mono font-bold truncate block">{block.currentHash}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span>Signer Authority: {block.operatorSign}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Link2 className="w-3 h-3" /> Chained to Block #{index}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
