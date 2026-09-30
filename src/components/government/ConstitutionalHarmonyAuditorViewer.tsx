import React, { useState } from 'react';
import {
  constitutionalHarmonyAuditor,
  HarmonyAuditReport
} from '../../core/government/ConstitutionalHarmonyAuditor';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Scale, Sparkles, Lock } from 'lucide-react';

export const ConstitutionalHarmonyAuditorViewer: React.FC = () => {
  const [report, setReport] = useState<HarmonyAuditReport>(() =>
    constitutionalHarmonyAuditor.runAudit()
  );

  const handleReAudit = () => {
    setReport(constitutionalHarmonyAuditor.runAudit());
  };

  return (
    <div id="r624-constitutional-harmony-auditor" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Constitutional Harmony Auditor
                </h1>
                <span className="text-xs px-2 py-0.5 font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20">
                  R624
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Auditor Otonom: Menjamin Sovereign Tetap Satu, PM Tetap Sipil, Guardian Tetap Militer, dan Rantai Komando Tidak Dilanggar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReAudit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Jalankan Audit Ulang Konstitusi
            </button>
          </div>
        </div>

        {/* Audit Status Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Status Harmoni Konstitusi</span>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              {report.overallHealth}
            </div>
            <span className="text-[11px] text-emerald-600">Zero Breach Detected</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tingkat Kepatuhan Doktrin</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {report.complianceRate}% COMPLIANT
            </div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Semua Doktrin Terpenuhi</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Jumlah Aturan yang Diaudit</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {report.checks.length} Doktrin Pokok
            </div>
            <span className="text-[11px] text-slate-500">Continuous Enforcement</span>
          </div>
        </div>
      </div>

      {/* Audit Checklist */}
      <div className="space-y-4">
        {report.checks.map((c) => (
          <div
            key={c.checkId}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {c.checkId}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {c.doctrine}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {c.verdict}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Target Entitas:</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{c.targetEntity}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Kondisi yang Diharapkan:</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{c.expectedState}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{c.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
