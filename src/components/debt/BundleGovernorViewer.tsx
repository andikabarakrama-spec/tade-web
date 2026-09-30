import React, { useState } from 'react';
import { bundleGovernor, BundleGovernorReport } from '../../core/debt/BundleGovernor';
import { Layers, ShieldCheck, RefreshCw, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';

export const BundleGovernorViewer: React.FC = () => {
  const [report, setReport] = useState<BundleGovernorReport>(() => bundleGovernor.getReport());
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const res = bundleGovernor.auditBundle();
      setReport({ ...res });
      setIsAuditing(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                R648 &bull; BUNDLE GOVERNOR
              </span>
              <span className="text-xs text-slate-400">Deterministic Build Budget Auditor</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-400" />
              Bundle Budget Governor &amp; Code Splitting Advisor
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Memantau ukuran aset produksi (JS &amp; CSS), chunk terbesar, dan rute lazy-loaded. Memberikan rekomendasi splitting tanpa melakukan split otomatis. Output tersimpan di <code>reports/bundle-governor.json</code>.
            </p>
          </div>
          <button
            onClick={handleAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Mengaudit Bundle...' : 'Audit Ukuran Bundle'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Total JS Footprint</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {report.totalJsSizeKb} KB
          </span>
          <span className="text-[10px] text-slate-500 block">Batas Anggaran: {report.budgetThresholdJsKb} KB</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Total CSS Stylesheet</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {report.totalCssSizeKb} KB
          </span>
          <span className="text-[10px] text-slate-500 block">Batas Anggaran: {report.budgetThresholdCssKb} KB</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Chunk Terbesar</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white truncate block">
            {report.largestChunkSizeKb} KB
          </span>
          <span className="text-[10px] text-slate-500 block truncate">{report.largestChunkName}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Kepatuhan Anggaran</span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            {report.budgetCompliance}
          </span>
          <span className="text-[10px] text-slate-500 block">{report.lazyLoadedRoutesCount} Lazy Routes</span>
        </div>
      </div>

      {/* Production Chunks Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Daftar Komponen Chunk Produksi</h3>
            <p className="text-xs text-slate-500">Hasil kompilasi Vite dan esbuild.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">reports/bundle-governor.json</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="pb-3 font-bold">Chunk Name</th>
                <th className="pb-3 font-bold">Tipe</th>
                <th className="pb-3 font-bold">Ukuran Mentah</th>
                <th className="pb-3 font-bold">Estimasi Gzip</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {report.chunks.map(chk => (
                <tr key={chk.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {chk.name}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                      {chk.type}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {chk.sizeKb} KB
                  </td>
                  <td className="py-3 text-slate-500">
                    {chk.compressionGzipKb} KB
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {chk.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Splitting Recommendations */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-500" />
          Rekomendasi Code-Splitting Non-Destruktif
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {report.recommendations.map(rec => (
            <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-[11px]">{rec.id}: {rec.targetChunk}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Hemat ~{rec.estimatedSavingKb} KB
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">{rec.suggestedAction}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
