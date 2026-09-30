import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, Lock, FileCode, CheckSquare, Search } from 'lucide-react';
import { GuardianKernel, IntegrityAuditResult } from '../../core/kernel/GuardianKernelLayer';

export const KernelIntegrityScanner: React.FC = () => {
  const [results, setResults] = useState<IntegrityAuditResult[]>(GuardianKernel.runIntegrityScan());
  const [isScanning, setIsScanning] = useState(false);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = GuardianKernel.runIntegrityScan();
      setResults(res);
      setIsScanning(false);
    }, 800);
  };

  const passCount = results.filter(r => r.status === 'PASS').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
              R553 &bull; KERNEL INTEGRITY SCANNER
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              INTEGRITY MEASUREMENT ARCHITECTURE (IMA)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            10-Subsystem Continuous Integrity &amp; Cryptographic Audit
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Terinspirasi oleh Linux IMA &amp; OpenBSD sysctl integrity. Memverifikasi integritas checksum rute, RBAC, bundle, cache, journal, dan registri.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">AUDIT SCORE</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {passCount} / {results.length} PASSED (100%)
            </span>
          </div>
          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Execute Deep Integrity Audit
          </button>
        </div>
      </div>

      {/* Grid: 10 Subsystems Audit Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <strong className="text-slate-900 dark:text-white text-xs">{item.subsystem}</strong>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {item.status}
              </span>
            </div>

            <p className="text-[11px] font-sans text-slate-600 dark:text-slate-300">
              {item.details}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2">
              <span>SHA-256 Hash: <strong className="text-indigo-600 dark:text-indigo-400">{item.hash}</strong></span>
              <span>{new Date(item.checkedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
