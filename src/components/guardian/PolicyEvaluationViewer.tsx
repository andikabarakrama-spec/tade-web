import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Play, 
  ShieldCheck, 
  RotateCcw,
  Sliders,
  FileCode,
  Layers
} from 'lucide-react';
import { policyEvaluationEngine } from '../../core/guardian/policyEvaluationEngine';
import { PolicyEvaluationResult } from '../../core/guardian/guardianTypes';

export const PolicyEvaluationViewer: React.FC = () => {
  const [testContext, setTestContext] = useState({
    ringLevel: 0,
    role: 'SUPER_ADMIN',
    hermesState: 'DORMANT_SAFE',
    isOfflineSync: true,
    operationFingerprint: '0x8f2d5e3a9c1b4e7f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    phaseCount: 5,
    hasClientSecretLeak: false,
    bypassingDbService: false
  });

  const [evaluation, setEvaluation] = useState(() => policyEvaluationEngine.evaluateAllPolicies(testContext));

  const runEvaluation = () => {
    const res = policyEvaluationEngine.evaluateAllPolicies(testContext);
    setEvaluation(res);
  };

  const setPreset = (type: 'PERFECT' | 'BREACH_RING0' | 'LEAK_SECRET' | 'HERMES_ACTIVE') => {
    let nextCtx = { ...testContext };
    if (type === 'PERFECT') {
      nextCtx = {
        ringLevel: 0,
        role: 'SUPER_ADMIN',
        hermesState: 'DORMANT_SAFE',
        isOfflineSync: true,
        operationFingerprint: '0x8f2d5e3a9c1b4e7f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
        phaseCount: 5,
        hasClientSecretLeak: false,
        bypassingDbService: false
      };
    } else if (type === 'BREACH_RING0') {
      nextCtx = { ...nextCtx, ringLevel: 2, modifyingRing0: true, role: 'OPERATOR' } as any;
    } else if (type === 'LEAK_SECRET') {
      nextCtx = { ...nextCtx, hasClientSecretLeak: true };
    } else if (type === 'HERMES_ACTIVE') {
      nextCtx = { ...nextCtx, hermesState: 'ACTIVE_AUTONOMOUS', founderAuthorized: false } as any;
    }
    setTestContext(nextCtx);
    const res = policyEvaluationEngine.evaluateAllPolicies(nextCtx);
    setEvaluation(res);
  };

  return (
    <div id="policy-evaluation-viewer" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">R742 Deterministic Evaluator</span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-mono rounded-full border border-blue-500/30 font-bold">ZERO FALSE POSITIVES</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Policy Evaluation Engine</h1>
            <p className="text-sm text-slate-400">Evaluasi deterministik seluruh kebijakan dengan output PASS, WARNING, dan BLOCKED.</p>
          </div>
        </div>

        <button
          onClick={runEvaluation}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shadow-blue-600/30"
        >
          <Play className="w-4 h-4" />
          <span>Execute Evaluation</span>
        </button>
      </div>

      {/* Evaluation Status Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        evaluation.status === 'SYSTEM_CLEAN'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
          : evaluation.status === 'WARNINGS_DETECTED'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-black/20">
            {evaluation.status === 'SYSTEM_CLEAN' && <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
            {evaluation.status === 'WARNINGS_DETECTED' && <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />}
            {evaluation.status === 'CRITICAL_BLOCK' && <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />}
          </div>
          <div>
            <div className="text-xs font-mono uppercase font-bold tracking-wider">Evaluation Verdict</div>
            <div className="text-xl font-bold font-sans">
              {evaluation.status === 'SYSTEM_CLEAN' && 'System Clean — 100% Policy Compliance'}
              {evaluation.status === 'WARNINGS_DETECTED' && 'Warnings Detected — Non-Blocking Observability Alerts'}
              {evaluation.status === 'CRITICAL_BLOCK' && 'Critical Block — Guardian Interception Active'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-center">
          <div>
            <div className="text-xs text-slate-500">Overall Score</div>
            <div className="text-2xl font-bold">{evaluation.overallScore}%</div>
          </div>
          <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
          <div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Passed</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{evaluation.passedCount}</div>
          </div>
          <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
          <div>
            <div className="text-xs text-amber-600 dark:text-amber-400">Warning</div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{evaluation.warningCount}</div>
          </div>
          <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
          <div>
            <div className="text-xs text-rose-600 dark:text-rose-400">Blocked</div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{evaluation.blockedCount}</div>
          </div>
        </div>
      </div>

      {/* Preset Injection Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Sliders className="w-4 h-4 text-slate-400" />
          <span>Inject Test Vectors:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPreset('PERFECT')}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-mono border border-emerald-200 dark:border-emerald-800 transition"
          >
            Clean Golden State
          </button>
          <button
            onClick={() => setPreset('BREACH_RING0')}
            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-mono border border-rose-200 dark:border-rose-800 transition"
          >
            Ring-0 Violation Vector
          </button>
          <button
            onClick={() => setPreset('LEAK_SECRET')}
            className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-mono border border-amber-200 dark:border-amber-800 transition"
          >
            Client Secret Leak Vector
          </button>
          <button
            onClick={() => setPreset('HERMES_ACTIVE')}
            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-mono border border-purple-200 dark:border-purple-800 transition"
          >
            Hermes Active Non-Founder Vector
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {evaluation.results.map((res) => (
          <div
            key={res.policyId}
            className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              res.outcome === 'PASS'
                ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                : res.outcome === 'WARNING'
                ? 'border-amber-400/50 bg-amber-50/20 dark:bg-amber-950/10'
                : 'border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {res.outcome === 'PASS' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {res.outcome === 'WARNING' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {res.outcome === 'BLOCKED' && <XCircle className="w-5 h-5 text-rose-500" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {res.policyId}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                    {res.policyName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {res.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                  {res.details}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 self-end md:self-center font-mono">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase">Score</div>
                <div className={`text-sm font-bold ${
                  res.score === 100 ? 'text-emerald-600 dark:text-emerald-400' : res.score > 0 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {res.score}/100
                </div>
              </div>

              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                res.outcome === 'PASS'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : res.outcome === 'WARNING'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {res.outcome}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
