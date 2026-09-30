import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle,
  XCircle,
  FileCheck2,
  Cpu,
  RefreshCw,
  Search,
  Scale
} from 'lucide-react';
import { companionPrivacyGuard } from '../../core/companion/companionPrivacyGuard';
import { CompanionPrivacyAudit } from '../../core/companion/companionTypes';

export const CompanionPrivacyGuardViewer: React.FC = () => {
  const [audits, setAudits] = useState<CompanionPrivacyAudit[]>(
    companionPrivacyGuard.getAuditLog()
  );

  // Simulator state
  const [simActor, setSimActor] = useState('PARENT');
  const [simDomain, setSimDomain] = useState('STUDENT_DEVELOPMENT');
  const [simAction, setSimAction] = useState('READ_CHILD_ASSESSMENT');
  const [simResult, setSimResult] = useState<{
    permitted: boolean;
    verdict: string;
    policy: string;
    message: string;
  } | null>(null);

  const refreshAudits = () => {
    setAudits(companionPrivacyGuard.getAuditLog());
  };

  const handleRunEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const result = companionPrivacyGuard.evaluateAccess(simActor, simDomain, simAction);
    setSimResult(result);
    refreshAudits();
  };

  return (
    <div className="space-y-6" id="companion-privacy-guard-view">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 rounded-2xl border border-rose-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R759 Multi-Layer Governance Validator
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                RBAC • Guardian Ring-0 • Constitution
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Lock className="w-7 h-7 text-rose-400" />
              Companion Privacy Guard
            </h1>
            <p className="text-sm text-rose-200/80 mt-1 max-w-2xl">
              Gerbang keamanan & privasi digital: memvalidasi izin akses data, memblokir kebocoran lintas peran (cross-tenant), dan menggagalkan seluruh upaya mutasi mandiri AI.
            </p>
          </div>

          <button
            onClick={refreshAudits}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Audit Trail
          </button>
        </div>
      </div>

      {/* Simulator Test Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Scale className="w-5 h-5 text-rose-400" /> Uji Validasi Akses Digital Companion
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live Policy Enforcement</span>
        </div>

        <form onSubmit={handleRunEvaluation} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Actor Role</label>
            <select
              value={simActor}
              onChange={e => setSimActor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="PARENT">ROLE: PARENT</option>
              <option value="TEACHER">ROLE: TEACHER</option>
              <option value="EXECUTIVE">ROLE: EXECUTIVE</option>
              <option value="AI_ASY_COMPANION">ROLE: AI_ASY_COMPANION</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Target Data Domain</label>
            <select
              value={simDomain}
              onChange={e => setSimDomain(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="STUDENT_DEVELOPMENT">STUDENT_DEVELOPMENT</option>
              <option value="FINANCE_GENERAL_LEDGER">FINANCE_GENERAL_LEDGER</option>
              <option value="TEACHER_PAYROLL">TEACHER_PAYROLL</option>
              <option value="CLASSROOM_MANAGEMENT">CLASSROOM_MANAGEMENT</option>
              <option value="GUARDIAN_RING0">GUARDIAN_RING0</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Requested Action</label>
            <select
              value={simAction}
              onChange={e => setSimAction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="READ_CHILD_ASSESSMENT">READ_CHILD_ASSESSMENT</option>
              <option value="READ_INSTITUTIONAL_PAYROLL">READ_INSTITUTIONAL_PAYROLL</option>
              <option value="READ_DAILY_AGENDA">READ_DAILY_AGENDA</option>
              <option value="AUTONOMOUS_DB_MUTATION">AUTONOMOUS_DB_MUTATION (Forbidden)</option>
              <option value="OVERRIDE_SECURITY_RULE">OVERRIDE_SECURITY_RULE (Forbidden)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30"
            >
              <ShieldAlert className="w-4 h-4" /> Evaluasi Akses
            </button>
          </div>
        </form>

        {simResult && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 mt-4 ${
              simResult.permitted
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
            }`}
          >
            {simResult.permitted ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm mb-1">
                Verdict: {simResult.verdict} (Enforcing Policy: {simResult.policy})
              </div>
              <div>{simResult.message}</div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Log Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-rose-400" />
          Log Audit Akses Privasi Companion ({audits.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor Role</th>
                <th className="py-3 px-4">Target Domain</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Policy Enforced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {audits.map((a, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-300 font-bold">{a.auditId}</td>
                  <td className="py-3 px-4 text-slate-400">
                    {a.timestamp.split('T')[0]} {a.timestamp.split('T')[1]?.substring(0, 8)}
                  </td>
                  <td className="py-3 px-4 text-slate-200">{a.actorRole}</td>
                  <td className="py-3 px-4 text-slate-300">{a.targetDomain}</td>
                  <td className="py-3 px-4 text-slate-400">{a.actionRequested}</td>
                  <td className="py-3 px-4 font-sans">
                    {a.verdict === 'PERMITTED' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                        PERMITTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[11px]">
                        {a.verdict}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{a.enforcingPolicy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
