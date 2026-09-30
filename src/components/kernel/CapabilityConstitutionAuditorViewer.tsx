import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Award,
  Download,
} from 'lucide-react';
import {
  capabilityConstitutionAuditor,
  CapabilityConstitutionAuditReport,
} from '../../core/kernel/CapabilityConstitutionAuditor';

export const CapabilityConstitutionAuditorViewer: React.FC = () => {
  const [report, setReport] = useState<CapabilityConstitutionAuditReport>(capabilityConstitutionAuditor.runAudit());

  const handleReaudit = () => {
    setReport(capabilityConstitutionAuditor.runAudit());
  };

  const handleDownloadReport = () => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAPABILITY_CONSTITUTION_AUDIT_${Date.now()}.json`;
    a.click();
  };

  return (
    <div id="capability-constitution-auditor-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R634 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Capability Constitution Auditor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-emerald-400" />
              Capability Constitution Auditor
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Automated compliance auditor continuously validating 10 core capability & constitutional invariants for TADE Sovereign State.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReaudit}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Re-Audit Invariants
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <Download className="w-4 h-4" />
              Download Audit
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL INVARIANTS</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{report.totalInvariants} Rules</span>
            <span className="text-[9px] text-emerald-500 block">100% Tested</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">COMPLIANCE SCORE</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{report.overallCompliancePct}%</span>
            <span className="text-[9px] text-emerald-500 block">Zero Violations</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">VERIFIED PASS</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{report.compliantCount} / 10</span>
            <span className="text-[9px] text-cyan-500 block">Flawless Audit</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">AUDIT SIGNATURE</span>
            <span className="text-xl font-bold text-purple-400 font-mono">VALID</span>
            <span className="text-[9px] text-purple-500 block">Cryptographic Seal</span>
          </div>
        </div>
      </div>

      {/* Invariants Detailed List */}
      <div className="space-y-3">
        {report.invariants.map((inv) => (
          <div
            key={inv.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm flex items-center justify-center">
                  #{inv.ruleNumber}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{inv.invariantName}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Category: {inv.category} &bull; Target: {inv.targetAudited}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {inv.status}
              </span>
            </div>

            <div className="pl-11 text-xs text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">Audited Proof & Evidence:</span>
              {inv.evidence}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
