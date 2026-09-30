import React, { useState } from 'react';
import { sovereignChangeLedger, ChangeLedgerState } from '../../core/debt/SovereignChangeLedger';
import { FileText, ShieldCheck, PlusCircle, CheckCircle2, History } from 'lucide-react';

export const SovereignChangeLedgerViewer: React.FC = () => {
  const [ledger, setLedger] = useState<ChangeLedgerState>(() => sovereignChangeLedger.getLedger());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModule, setNewModule] = useState('R650');
  const [newReason, setNewReason] = useState('Constitutional Health Matrix Expansion');
  const [newImpact, setNewImpact] = useState('Added 22 immutable architectural invariant checks.');
  const [newRollback, setNewRollback] = useState('Revert manifest entry and switch to baseline validator.');

  const handleAddChange = (e: React.FormEvent) => {
    e.preventDefault();
    sovereignChangeLedger.recordChange(
      newModule,
      'GOVERNANCE_EXPANSION',
      newReason,
      newImpact,
      newRollback
    );
    setLedger({ ...sovereignChangeLedger.getLedger() });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                R649 &bull; SOVEREIGN CHANGE LEDGER
              </span>
              <span className="text-xs text-slate-400">Append-Only Architectural Delta Ledger</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-400" />
              Sovereign Change Ledger &amp; Rollback Registry
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Mencatat seluruh perubahan kernel dalam format standar (<code>CHANGE-0001</code>) beserta timestamp, modul, alasan, dampak, jalur rollback, dan verifikasi kriptografis Ring-0 Guardian. Bersifat append-only.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            {showAddForm ? 'Tutup Formulir' : 'Catat Perubahan Baru'}
          </button>
        </div>
      </div>

      {/* Form Add Record */}
      {showAddForm && (
        <form onSubmit={handleAddChange} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-indigo-500/30 shadow-md space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Entri Perubahan Baru (Append-Only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Kode Modul:</label>
              <input
                type="text"
                value={newModule}
                onChange={e => setNewModule(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Alasan Perubahan:</label>
              <input
                type="text"
                value={newReason}
                onChange={e => setNewReason(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Dampak Arsitektural:</label>
              <input
                type="text"
                value={newImpact}
                onChange={e => setNewImpact(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Jalur Rollback:</label>
              <input
                type="text"
                value={newRollback}
                onChange={e => setNewRollback(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition-all"
          >
            Simpan ke Sovereign Ledger
          </button>
        </form>
      )}

      {/* Ledger Records Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Riwayat Perubahan Tersegel (Append-Only)</h3>
            <p className="text-xs text-slate-500">Integritas Hash: {ledger.integrityHash.substring(0, 32)}...</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
            {ledger.totalChanges} Total Catatan
          </span>
        </div>

        <div className="space-y-3">
          {ledger.records.map(record => (
            <div key={record.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded font-bold bg-indigo-600 text-white text-xs">
                    {record.id}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{record.moduleCode}</span>
                  <span className="text-[11px] text-slate-500">[{record.changeType}]</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">
                    {record.timestamp.replace('T', ' ').substring(0, 19)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {record.guardianVerification.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1 font-sans text-xs text-slate-700 dark:text-slate-300">
                <p><strong>Alasan:</strong> {record.reason}</p>
                <p><strong>Dampak:</strong> {record.impact}</p>
                <p className="text-slate-500"><strong>Jalur Rollback:</strong> {record.rollbackPath}</p>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-600/50 flex flex-wrap items-center justify-between gap-1">
                <span>Diverifikasi: <strong>{record.guardianVerification.verifiedBy}</strong></span>
                <span className="truncate max-w-[240px]">Sig: {record.guardianVerification.signatureDigest}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
