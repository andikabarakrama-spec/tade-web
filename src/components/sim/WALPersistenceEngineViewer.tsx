import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Activity, 
  ArrowRight,
  Clock,
  Layers
} from 'lucide-react';
import { immortalStorage, WalEntry } from '../../core/kernel/ImmortalStorageManager';

export const WALPersistenceEngineViewer: React.FC = () => {
  const [walLogs, setWalLogs] = useState<WalEntry[]>([]);
  const [isSimulatingCrash, setIsSimulatingCrash] = useState<boolean>(false);
  const [replayMessage, setReplayMessage] = useState<string | null>(null);

  const refreshLogs = () => {
    setWalLogs(immortalStorage.getWalLog(20));
  };

  useEffect(() => {
    refreshLogs();
    const interval = setInterval(refreshLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateUncommittedWrite = () => {
    // Generate an uncommitted WAL entry
    immortalStorage.writeAheadLog(
      'SIM',
      'STUDENT_DATA',
      'UPDATE',
      `STD-${Math.floor(Math.random() * 900 + 100)}`,
      { status: 'PENDING_APPROVAL' },
      { status: 'VERIFIED_BY_HEADMASTER', timestamp: new Date().toISOString() }
    );
    refreshLogs();
    setReplayMessage('Uncommitted transaction written to WAL. Browser crash simulation ready.');
  };

  const handleCrashAndReplay = () => {
    setIsSimulatingCrash(true);
    setTimeout(() => {
      const recoveredCount = immortalStorage.replayUncommittedWal();
      setIsSimulatingCrash(false);
      refreshLogs();
      setReplayMessage(`Crash Recovery Successful: ${recoveredCount} uncommitted transactions replayed from WAL.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                R586 &bull; WAL PERSISTENCE ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">PostgreSQL-Grade Write Ahead Log</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Write Ahead Log (WAL) Journal &amp; Replay Engine</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateUncommittedWrite}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" /> Inject Pre-Commit
          </button>
          <button
            onClick={handleCrashAndReplay}
            disabled={isSimulatingCrash}
            className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-600/30 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isSimulatingCrash ? 'animate-spin' : ''}`} />
            {isSimulatingCrash ? 'Replaying WAL...' : 'Simulate Crash & Replay'}
          </button>
        </div>
      </div>

      {/* Replay Notification */}
      {replayMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{replayMessage}</span>
        </div>
      )}

      {/* WAL Concept Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
            Stage 1: Pre-Commit Log
          </span>
          <p className="text-slate-300 font-sans text-[11px]">
            Setiap mutasi data wajib ditulis ke file journal WAL sebelum memodifikasi memory buffer atau database primer.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">2</span>
            Stage 2: Storage Commit
          </span>
          <p className="text-slate-300 font-sans text-[11px]">
            Setelah data aman di storage, status WAL ditandai <code>isCommitted: true</code>.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">3</span>
            Stage 3: Crash Recovery
          </span>
          <p className="text-slate-300 font-sans text-[11px]">
            Jika browser mati sebelum commit, kernel secara otomatis membaca dan me-replay seluruh log yang belum committed.
          </p>
        </div>
      </div>

      {/* Live WAL Journal Stream */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Live WAL Stream (/var/log/tade_wal.log):
          </span>
          <span className="text-slate-500 text-[10px]">Auto-Refresh Active</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {walLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-800">
              Belum ada mutasi log WAL. Lakukan penulisan di Immortal Storage Manager.
            </div>
          ) : (
            walLogs.map((entry) => (
              <div
                key={entry.walId}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start md:items-center gap-3">
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold text-[10px]">
                    #{entry.sequence}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-white">{entry.walId}</strong>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px]">
                        {entry.namespace} &bull; {entry.collection}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px]">
                        {entry.operation}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Target Record: <code>{entry.recordId}</code> &bull; Checksum: <code>{entry.checksum}</code>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 ${
                      entry.isCommitted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                    }`}
                  >
                    {entry.isCommitted ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> COMMITTED
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" /> UNCOMMITTED
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
