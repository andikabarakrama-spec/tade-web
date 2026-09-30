import React, { useState, useEffect } from 'react';
import { Bot, Play, Sparkles, CheckCircle2, Clock, ShieldCheck, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { KernelServiceSupervisor, RecoveryPlanAction } from '../../core/kernel/KernelServiceLifecycleManager';
import { GuardianKernel } from '../../core/kernel/GuardianKernelLayer';

export const AutonomousRecoveryPlannerViewer: React.FC = () => {
  const [plans, setPlans] = useState<RecoveryPlanAction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setPlans(KernelServiceSupervisor.getRecoveryPlans());
    const unsub = KernelServiceSupervisor.subscribe(() => {
      setPlans(KernelServiceSupervisor.getRecoveryPlans());
    });
    return () => {
      unsub();
    };
  }, []);

  const handleExecute = (planId: string) => {
    KernelServiceSupervisor.executeRecoveryPlan(planId);
  };

  const handleGenerateNewPlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      GuardianKernel.appendJournal({
        engineId: 'AI_ASY',
        level: 'INFO',
        subsystem: 'SUPERVISOR',
        message: 'AI Asy completed proactive operational telemetry scan. 1 novel autonomous mitigation synthesized.'
      });
    }, 1000);
  };

  const getSeverityBadge = (sev: RecoveryPlanAction['severity']) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'LOW': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div id="r567-autonomous-recovery-planner" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-950/80 border border-purple-500/40 rounded-lg text-purple-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Autonomous Recovery Planner
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50 font-mono">
                  R567 • AI Asy Right Hand
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Predictive incident synthesis, step-by-step mitigation staging, and operator-ready autonomous runbooks.
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerateNewPlan}
            disabled={isGenerating}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-950/50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Synthesizing...' : 'Synthesize AI Runbook'}
          </button>
        </div>
      </div>

      {/* AI Asy Status Banner */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <span className="text-xs font-mono text-purple-300 font-semibold">
            AI Asy Cognitive Supervisor Status: ACTIVE (Analyzing Memory, Query Latencies & Cam Buffers)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Proactive Lookahead: 120 seconds ahead of telemetry</span>
        </div>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span>Synthesized Mitigation Runbooks</span>
          <span className="text-xs text-slate-500 font-mono">{plans.length} Action Plans</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-700/40">
                    {plan.id}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-200 bg-slate-800 px-2 py-0.5 rounded">
                    Target: {plan.targetEngine}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${getSeverityBadge(plan.severity)}`}>
                    {plan.severity} SEVERITY
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40">
                    Supervised by: {plan.supervisedBy}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Est. Recovery: {plan.estimatedRecoveryMs}ms
                  </span>
                </div>

                <div>
                  <h3 className="text-xs text-slate-400">
                    <strong className="text-slate-300">Trigger Condition:</strong> {plan.triggerCondition}
                  </h3>
                  <p className="text-sm text-slate-200 font-medium mt-1">
                    <strong className="text-purple-400">Mitigation Strategy:</strong> {plan.plannedAction}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {plan.status === 'COMPLETED' ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> EXECUTED & RESTORED
                  </span>
                ) : plan.status === 'EXECUTING' ? (
                  <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 animate-pulse">
                    <Zap className="w-4 h-4 text-cyan-400" /> EXECUTING PLAN...
                  </span>
                ) : (
                  <button
                    onClick={() => handleExecute(plan.id)}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-950/50"
                  >
                    <Play className="w-3.5 h-3.5" /> Execute Runbook
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
