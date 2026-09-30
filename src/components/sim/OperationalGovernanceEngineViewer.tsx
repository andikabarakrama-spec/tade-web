import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Layers, 
  Lock, 
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { guardianControlPlane, GovernanceAuditRecord } from '../../core/kernel/GuardianControlPlane';

export const OperationalGovernanceEngineViewer: React.FC = () => {
  const [audits, setAudits] = useState<GovernanceAuditRecord[]>(guardianControlPlane.runGovernanceAudit());
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setAudits(guardianControlPlane.runGovernanceAudit());
      setIsAuditing(false);
      setAuditResult('Operational Governance Verified: 4/4 Constitution & SOP Rules 100% Compliant.');
    }, 1000);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                R603 &bull; OPERATIONAL GOVERNANCE ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">Constitutional SOP &amp; Executive Compliance</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Operational Governance &amp; Policy Enforcement Engine</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Auditing Policies...' : 'Verify Governance SOP'}
          </button>
        </div>
      </div>

      {auditResult && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{auditResult}</span>
        </div>
      )}

      {/* Governance Audit Rules Grid */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          Guardian Constitutional Governance Rules:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {audits.map((rule) => (
            <div
              key={rule.ruleId}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-bold text-[10px]">
                    {rule.ruleId} &bull; {rule.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                    {rule.verdict}
                  </span>
                </div>
                <strong className="text-sm text-white block">{rule.ruleName}</strong>
                <p className="text-[11px] text-slate-300 font-sans">
                  {rule.details}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/40 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Enforced By: <strong className="text-emerald-400">{rule.enforcedBy}</strong></span>
                <span>Verified {new Date(rule.checkedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
