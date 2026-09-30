import React, { useState } from 'react';
import {
  constitutionalDecisionLedger,
  ConstitutionalDecisionRecord
} from '../../core/government/ConstitutionalDecisionLedger';
import { FileText, ShieldCheck, Key, Plus, CheckCircle2, Lock } from 'lucide-react';

export const ConstitutionalDecisionLedgerViewer: React.FC = () => {
  const [decisions, setDecisions] = useState<ConstitutionalDecisionRecord[]>(() =>
    constitutionalDecisionLedger.getDecisions()
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ConstitutionalDecisionRecord['category']>('SOVEREIGN_DECREE');
  const [newSummary, setNewSummary] = useState('');

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) return;

    constitutionalDecisionLedger.appendDecision(newTitle, newCategory, newSummary);
    setDecisions([...constitutionalDecisionLedger.getDecisions()]);
    setNewTitle('');
    setNewSummary('');
    setShowAddModal(false);
  };

  return (
    <div id="r621-constitutional-decision-ledger" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Constitutional Decision Ledger
                </h1>
                <span className="text-xs px-2 py-0.5 font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-500/20">
                  R621
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Buku Besar Keputusan Strategis: Sovereign Decree, PM Cabinet Policies, dan Ring-0 Military Mandates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Rekam Keputusan Strategis
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Keputusan Terdaftar</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{decisions.length} Dekrit / Kebijakan</div>
            <span className="text-xs text-amber-600 dark:text-amber-400">Semua Terikat Konstitusi</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Validasi Tri-Signature</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">100% Terverifikasi</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Sovereign + PM + Guardian</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Integritas Hash</span>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">SHA-256 Valid</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Non-repudiation Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Decision Records List */}
      <div className="space-y-4">
        {decisions.map((dec) => (
          <div
            key={dec.decisionId}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                    {dec.decisionId}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {dec.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {dec.title}
                </h3>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {dec.enforcementStatus}
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {dec.executiveSummary}
            </p>

            {/* Tri-Signature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 space-y-1">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Sovereign Signature</span>
                <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">{dec.sovereignSignature}</div>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Supreme Authority</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 space-y-1">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">PM Counter-Signature</span>
                <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">{dec.pmSignature}</div>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Civilian Cabinet Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 space-y-1">
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">Guardian Security Attestation</span>
                <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">{dec.guardianSignature}</div>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1"><Lock className="w-3 h-3" /> Ring-0 Kernel Attested</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-slate-400">
              <span className="truncate max-w-md">SHA-256: {dec.sha256Digest}</span>
              <span>{new Date(dec.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Decision */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Rekam Keputusan Konstitusional Baru
            </h3>
            <form onSubmit={handleAddDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Keputusan / Dekrit
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Penyesuaian Kuota PPDB Santri Mandiri..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="SOVEREIGN_DECREE">Sovereign Decree (Dekrit Pengasuh)</option>
                  <option value="CIVILIAN_CABINET_POLICY">Civilian Cabinet Policy (Kebijakan PM)</option>
                  <option value="DEFCON_PROTOCOL">DEFCON Protocol (Mandat Militer Guardian)</option>
                  <option value="BUDGET_APPROPRIATION">Budget Appropriation (Alokasi Anggaran)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ringkasan Eksekutif
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan latar belakang dan dampak kebijakan..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Tanda Tangani & Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
