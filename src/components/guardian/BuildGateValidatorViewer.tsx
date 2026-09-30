import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCw, 
  Lock, 
  Unlock,
  Hammer,
  FileCheck2,
  ServerCrash
} from 'lucide-react';
import { buildGateValidator } from '../../core/guardian/buildGateValidator';
import { BuildGateReport } from '../../core/guardian/guardianTypes';

export const BuildGateValidatorViewer: React.FC = () => {
  const [report, setReport] = useState<BuildGateReport>(() => buildGateValidator.runBuildGateCheck());
  const [injectedFailureDomain, setInjectedFailureDomain] = useState<string>('NONE');

  const runCheck = (forceFailDomain?: string) => {
    const res = buildGateValidator.runBuildGateCheck({
      forceFailDomain: forceFailDomain === 'NONE' ? undefined : forceFailDomain
    });
    setReport(res);
  };

  const handleDomainSelect = (domain: string) => {
    setInjectedFailureDomain(domain);
    runCheck(domain);
  };

  return (
    <div id="build-gate-validator-viewer" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
            <Hammer className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">R744 Build Gate Validator</span>
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-mono rounded-full border border-rose-500/30 font-bold">PRE-DEPLOY GATEWAY</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Build Gate Validator</h1>
            <p className="text-sm text-slate-400">Pemeriksaan pra-kompilasi: RBAC, Guardian, SSoT, Contract, dan Recovery. Blokir build jika ditemukan pelanggaran kritis.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runCheck(injectedFailureDomain)}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shadow-rose-600/30"
          >
            <RotateCw className="w-4 h-4" />
            <span>Rerun Build Gate</span>
          </button>
        </div>
      </div>

      {/* Main Gate Verdict Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
        report.canDeploy
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
          : 'bg-rose-500/15 border-rose-500/40 text-rose-950 dark:text-rose-200 shadow-lg ring-1 ring-rose-500/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-black/30">
            {report.canDeploy ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ServerCrash className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            )}
          </div>
          <div>
            <div className="text-xs font-mono uppercase font-bold tracking-wider">
              {report.canDeploy ? 'BUILD GATE APPROVED' : 'BUILD GATE BLOCKED — DEPLOYMENT HALTED'}
            </div>
            <h2 className="text-2xl font-bold font-sans mt-0.5">
              {report.canDeploy 
                ? 'All 5 Core Integrity Domains Verified' 
                : 'Critical Violation Detected: Build Gate Interception Active'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-1">
              Target Release: <span className="font-mono font-bold">{report.targetVersion}</span> | Execution ID: <span className="font-mono">{report.gateExecutionId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-center">
          <div>
            <div className="text-xs text-slate-500">Integrity Score</div>
            <div className="text-3xl font-bold">{report.overallScore}%</div>
          </div>
          <div className="h-10 w-px bg-slate-300 dark:bg-slate-700" />
          <div>
            <div className="text-xs text-slate-500">Verdict</div>
            <div className={`text-xl font-bold px-3 py-1 rounded-xl mt-1 ${
              report.canDeploy
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
            }`}>
              {report.canDeploy ? 'PASSED' : 'BLOCKED'}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Breach Injection Switcher */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Simulate Gate Breach Domain:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'NONE', label: 'All Normal (Green)' },
            { id: 'RBAC', label: 'Breach RBAC' },
            { id: 'GUARDIAN', label: 'Breach Guardian Ring-0' },
            { id: 'SSOT', label: 'Breach SSoT db.ts' },
            { id: 'CONTRACT', label: 'Breach Contract Registry' },
            { id: 'RECOVERY', label: 'Breach Recovery 5-Phase' }
          ].map(b => (
            <button
              key={b.id}
              onClick={() => handleDomainSelect(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                injectedFailureDomain === b.id
                  ? 'bg-slate-900 text-white font-bold dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5-Domain Check List */}
      <div className="space-y-4">
        {report.checks.map(chk => (
          <div
            key={chk.gateId}
            className={`p-5 bg-white dark:bg-slate-900 rounded-3xl border transition-all ${
              chk.status === 'PASSED'
                ? 'border-slate-200 dark:border-slate-800'
                : 'border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10 shadow-sm ring-1 ring-rose-500/20'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {chk.status === 'PASSED' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {chk.gateId}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      DOMAIN: {chk.domain}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                      {chk.name}
                    </h2>
                  </div>
                  <p className={`text-xs font-sans ${
                    chk.status === 'PASSED' ? 'text-slate-600 dark:text-slate-400' : 'text-rose-700 dark:text-rose-300 font-semibold'
                  }`}>
                    {chk.message}
                  </p>
                  {chk.technicalDetails && (
                    <div className="text-[11px] font-mono text-slate-400 pt-0.5">
                      Scope: {chk.technicalDetails}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center font-mono">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Score</div>
                  <div className={`text-sm font-bold ${chk.score === 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {chk.score}%
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  chk.status === 'PASSED'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                }`}>
                  {chk.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
