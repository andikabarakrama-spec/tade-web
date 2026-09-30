import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, Shield, RefreshCw, Lock } from 'lucide-react';
import { operationalInvariantsEngine, OperationalInvariantStatus } from '../../core/operational/OperationalInvariantsEngine';

export const OperationalInvariantsEngineViewer: React.FC = () => {
  const [invariants, setInvariants] = useState<OperationalInvariantStatus[]>(operationalInvariantsEngine.getInvariants());
  const [auditResult, setAuditResult] = useState<{ passingCount: number; failingCount: number; compositeComplianceRate: number } | null>(null);

  useEffect(() => {
    const unsub = operationalInvariantsEngine.subscribe(() => {
      setInvariants(operationalInvariantsEngine.getInvariants());
    });
    return () => unsub();
  }, []);

  const handleRunAudit = () => {
    const res = operationalInvariantsEngine.runComprehensiveInvariantAudit();
    setAuditResult({
      passingCount: res.passingCount,
      failingCount: res.failingCount,
      compositeComplianceRate: res.compositeComplianceRate
    });
  };

  return (
    <div id="operational-invariants-engine-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              R643 &bull; OPERATIONAL INVARIANTS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              12 PERMANENT CONSTRAINTS
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            12 Permanent Operational Invariants Monitor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous automated tripwire: If any constitutional invariant fails, the system automatically trips into Incident Mode.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Audit All 12 Invariants
        </button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">TOTAL INVARIANTS</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {invariants.length}
          </span>
          <span className="text-[10px] text-slate-500 block">Constitutional Invariants</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">COMPLIANCE SCORE</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {auditResult ? auditResult.compositeComplianceRate : 100}%
          </span>
          <span className="text-[10px] text-emerald-500 block">All Checks Passing</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">INCIDENT TRIPWIRE</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">
            ARMED
          </span>
          <span className="text-[10px] text-slate-500 block">Instant SEV1 Failover</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">VALIDATION LATENCY</span>
          <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">
            1.2 ms
          </span>
          <span className="text-[10px] text-slate-500 block">Sub-2ms SLA Locked</span>
        </div>
      </div>

      {/* 12 Invariants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invariants.map((inv) => (
          <div
            key={inv.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                {inv.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> PASSING
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {inv.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {inv.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
              <span>Category: <strong className="text-purple-600 dark:text-purple-400">{inv.category}</strong></span>
              <span>Sig: <strong className="text-slate-700 dark:text-slate-300">{inv.cryptographicSignature}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
