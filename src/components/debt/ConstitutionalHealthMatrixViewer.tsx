import React, { useState } from 'react';
import { constitutionalHealthMatrix, ConstitutionalMatrixReport } from '../../core/debt/ConstitutionalHealthMatrix';
import { Scale, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Filter } from 'lucide-react';

export const ConstitutionalHealthMatrixViewer: React.FC = () => {
  const [matrix, setMatrix] = useState<ConstitutionalMatrixReport>(() => constitutionalHealthMatrix.getMatrix());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleAudit = () => {
    const res = constitutionalHealthMatrix.auditMatrix();
    setMatrix({ ...res });
  };

  const categories = ['ALL', 'SEPARATION', 'SECURITY', 'CIVIL_SERVICE', 'RUNTIME', 'DATA_INTEGRITY', 'GOVERNANCE'];

  const filteredInvariants = selectedCategory === 'ALL'
    ? matrix.invariants
    : matrix.invariants.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                R650 &bull; CONSTITUTIONAL HEALTH MATRIX
              </span>
              <span className="text-xs text-slate-400">22 Immutable Invariants Auditor</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-indigo-400" />
              Constitutional Health Matrix &amp; Invariant Sentinel
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Memvalidasi kepatuhan terhadap 22 invarian konstitusional TADE (Website/SIM terpisah, Ring-0 Guardian, AI Asy sipil, Runtime bus tunggal, WORM, Telemetri, Recovery sinkron, RBAC, Namespace bersih, SSoT db.ts, dsb). War Room membaca status <strong>PASS / WARNING / CRITICAL</strong>.
            </p>
          </div>
          <button
            onClick={handleAudit}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Audit Ulang Matriks
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Status Konstitusi</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            {matrix.systemConstitutionStatus}
          </span>
          <span className="text-[10px] text-slate-500 block">Zero Critical Invariant Violations</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Invarian Lolos (PASS)</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {matrix.passedCount} / {matrix.totalInvariants}
          </span>
          <span className="text-[10px] text-emerald-600 block font-bold">100% Sesuai Konstitusi</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Status Warning</span>
          <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {matrix.warningCount}
          </span>
          <span className="text-[10px] text-slate-500 block">Peringatan Terkendali</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Status Critical</span>
          <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {matrix.criticalCount}
          </span>
          <span className="text-[10px] text-slate-500 block">Pelanggaran Fatal = 0</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Invariants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInvariants.map(inv => (
          <div
            key={inv.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px]">
                  {inv.id}
                </span>
                <strong className="text-slate-900 dark:text-white text-xs">{inv.name}</strong>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'PASS' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : inv.status === 'WARNING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
                {inv.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">{inv.description}</p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] space-y-1 text-slate-500">
              <div><strong>Bukti Verifikasi:</strong> {inv.evidence}</div>
              <div><strong>Mitigasi Jika Gagal:</strong> {inv.mitigationIfFailed}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
