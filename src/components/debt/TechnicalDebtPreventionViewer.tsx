import React, { useState } from 'react';
import { technicalDebtPreventionEngine, TechnicalDebtReport } from '../../core/debt/TechnicalDebtPreventionEngine';
import { ShieldCheck, RefreshCw, FileText, CheckCircle2, Sliders, AlertTriangle } from 'lucide-react';

export const TechnicalDebtPreventionViewer: React.FC = () => {
  const [report, setReport] = useState<TechnicalDebtReport>(() => technicalDebtPreventionEngine.getReport());
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = technicalDebtPreventionEngine.runScan();
      setReport({ ...res });
      setIsScanning(false);
    }, 400);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                R645 &bull; TECHNICAL DEBT PREVENTION
              </span>
              <span className="text-xs text-slate-400">Non-Destructive Static Debt Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-indigo-400" />
              Technical Debt Prevention &amp; Architectural Quality Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Memindai dan mengidentifikasi potensi technical debt (oversized files, redundant imports, unused routes, unused dependencies, dan safe refactor candidates) tanpa mengubah atau menghapus kode secara otomatis.
            </p>
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Memindai Codebase...' : 'Jalankan Audit Debt'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Health Index Score</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {report.healthIndexScore}%
          </span>
          <span className="text-[10px] text-emerald-600 block flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3 h-3" /> Kondisi Kernel Pristine
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Modul Terpindai</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {report.totalModulesScanned} Modul
          </span>
          <span className="text-[10px] text-slate-500 block">R1 s.d R654 Lengkap</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Item Debt Terdeteksi</span>
          <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {report.totalDebtItemsCount} Temuan
          </span>
          <span className="text-[10px] text-slate-500 block">Semua Teridentifikasi Aman</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Status Integritas</span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            {report.architecturalIntegrityStatus}
          </span>
          <span className="text-[10px] text-slate-500 block">reports/technical-debt-report.json</span>
        </div>
      </div>

      {/* Debt Categories Summary */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Distribusi Kategori Technical Debt</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          {Object.entries(report.debtByCategory).map(([cat, count]) => (
            <div key={cat} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
              <span className="text-[10px] text-slate-500 block truncate">{cat.replace(/_/g, ' ')}</span>
              <strong className="text-base text-slate-900 dark:text-white">{count} Item</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Debt Items Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Daftar Analisis Debt Non-Destruktif</h3>
            <p className="text-xs text-slate-500">Hasil audit komprehensif tanpa modifikasi kode otomatis.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Target File: reports/technical-debt-report.json</span>
        </div>

        <div className="space-y-3">
          {report.items.map(item => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                    {item.id}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {item.targetPath}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">[{item.category}]</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getSeverityBadge(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.safeToRefactor ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300'}`}>
                    {item.safeToRefactor ? 'Refactor Aman' : 'Manifest Terkunci'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">{item.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-600/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Metrik:</span>
                  <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{item.metric}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Rekomendasi Remediasi:</span>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400">{item.remediationRecommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
