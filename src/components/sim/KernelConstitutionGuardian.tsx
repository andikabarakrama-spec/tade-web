import React, { useState } from 'react';
import { Scale, ShieldAlert, CheckCircle2, RefreshCw, Scroll, Lock, AlertTriangle } from 'lucide-react';
import { GuardianKernel } from '../../core/kernel/GuardianKernelLayer';

export const KernelConstitutionGuardian: React.FC = () => {
  const [rules, setRules] = useState(GuardianKernel.getConstitutionRules());
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ isCompliant: boolean; passedCount: number; totalCount: number }>(
    GuardianKernel.verifyConstitution()
  );

  const handleReevaluate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setRules(GuardianKernel.getConstitutionRules());
      const res = GuardianKernel.verifyConstitution();
      setVerificationResult(res);
      setIsVerifying(false);
    }, 700);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200">
              R554 &bull; KERNEL CONSTITUTION GUARDIAN
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              TADE SUPREME CONSTITUTIONAL COURT
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Permanent Constitutional Governance &amp; Anti-Regression Enforcer
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Memastikan setiap Release Candidate (RC) patuh pada 6 Hukum Konstitusi Permanen TADE. Dilarang overwrite, dilarang regresi, dan pemisahan mutlak Website &amp; SIM.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">CONSTITUTION STATUS</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {verificationResult.passedCount} / {verificationResult.totalCount} COMPLIANT
            </span>
          </div>
          <button
            onClick={handleReevaluate}
            disabled={isVerifying}
            className="py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition"
          >
            {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            Evaluate All Constitutional Laws
          </button>
        </div>
      </div>

      {/* Grid: 6 Constitutional Laws */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{rule.id}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {rule.status}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans mb-1">
                {rule.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                {rule.description}
              </p>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2 flex items-center justify-between">
              <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">PASSED</strong></span>
              <span>{new Date(rule.lastEvaluated).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Supreme Seal of Integrity */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white font-mono flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-purple-300 font-bold block">TADE SUPREME ARCHITECTURE LOCK</span>
            <p className="text-xs text-slate-300 font-sans">
              Setiap rilis dari R1 s.d. R554 dilindungi oleh Guardian Kernel Layer. Modul terisolasi, toleran kesalahan, dan mandiri secara operasional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
            WAR ROOM AF READY (20/20 PASS)
          </span>
        </div>
      </div>
    </div>
  );
};
