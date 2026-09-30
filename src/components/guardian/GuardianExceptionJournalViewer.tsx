import React, { useState } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Link, 
  CheckCircle2, 
  XCircle, 
  Hash, 
  User, 
  Clock, 
  RotateCw,
  Trash2,
  Lock
} from 'lucide-react';
import { guardianExceptionJournal } from '../../core/guardian/guardianExceptionJournal';
import { GuardianExceptionEntry } from '../../core/guardian/guardianTypes';

export const GuardianExceptionJournalViewer: React.FC = () => {
  const [entries, setEntries] = useState<GuardianExceptionEntry[]>(() => guardianExceptionJournal.getJournalEntries());
  const [integrityStatus, setIntegrityStatus] = useState(() => guardianExceptionJournal.verifyChainIntegrity());

  const refreshJournal = () => {
    setEntries(guardianExceptionJournal.getJournalEntries());
    setIntegrityStatus(guardianExceptionJournal.verifyChainIntegrity());
  };

  const handleClearNonCritical = () => {
    guardianExceptionJournal.clearNonCritical();
    refreshJournal();
  };

  return (
    <div id="guardian-exception-journal-viewer" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">R746 Guardian Exception Journal</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono rounded-full border border-amber-500/30 font-bold">IMMUTABLE LEDGER</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Guardian Exception Journal</h1>
            <p className="text-sm text-slate-400">Jurnal permanen seluruh pelanggaran kebijakan dengan verifikasi integritas hash kriptografis bertingkat.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshJournal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono border border-slate-700 transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Verify Chain</span>
          </button>
          <button
            onClick={handleClearNonCritical}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-mono border border-slate-700 hover:border-rose-700/50 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Prune Non-Critical</span>
          </button>
        </div>
      </div>

      {/* Cryptographic Chain Integrity Verification Bar */}
      <div className={`p-5 rounded-3xl border flex items-center justify-between gap-4 ${
        integrityStatus.isValid
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
      }`}>
        <div className="flex items-center gap-3">
          {integrityStatus.isValid ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
          )}
          <div>
            <div className="text-xs font-mono uppercase font-bold">
              {integrityStatus.isValid ? 'Cryptographic Hash Chain Verified' : 'Cryptographic Hash Chain Broken!'}
            </div>
            <div className="text-sm font-sans font-bold mt-0.5">
              {integrityStatus.isValid
                ? `All ${integrityStatus.checkedCount} block records chained with valid zero-collision SHA-256 signatures.`
                : `Tampering detected at ledger block index #${integrityStatus.errorIndex}!`}
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-white/40 dark:bg-black/20 font-mono text-xs font-bold shrink-0">
          LEDGER HEIGHT: {entries.length}
        </div>
      </div>

      {/* Exceptions List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            Tidak ada rekaman pelanggaran dalam journal aktif.
          </div>
        ) : (
          entries.map((entry, idx) => (
            <div
              key={entry.exceptionId}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    #{entries.length - idx} {entry.exceptionId}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    entry.blocked 
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {entry.blocked ? 'BLOCKED' : 'LOGGED'}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                    {entry.policyName}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(entry.timestamp).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                {entry.details}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px] pt-1">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Actor: <strong className="text-slate-800 dark:text-slate-200">{entry.actor}</strong> ({entry.role})</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Hash: <strong className="text-indigo-600 dark:text-indigo-400">{entry.hash.substring(0, 16)}...</strong></span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Link className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Prev: <span className="text-slate-500">{entry.previousHash.substring(0, 14)}...</span></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
