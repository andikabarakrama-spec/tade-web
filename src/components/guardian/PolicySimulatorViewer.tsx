import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Layers, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { policySimulator } from '../../core/guardian/policySimulator';
import { PolicySimulationRequest, PolicySimulationResult } from '../../core/guardian/guardianTypes';

export const PolicySimulatorViewer: React.FC = () => {
  const scenarios = policySimulator.getAvailableScenarios();
  const [selectedScenario, setSelectedScenario] = useState<PolicySimulationRequest>(scenarios[0]);
  const [result, setResult] = useState<PolicySimulationResult | null>(() => policySimulator.runSimulation(scenarios[0]));

  const handleRunSimulation = (sc: PolicySimulationRequest) => {
    setSelectedScenario(sc);
    const res = policySimulator.runSimulation(sc);
    setResult(res);
  };

  return (
    <div id="policy-simulator-viewer" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">R747 Policy Simulator</span>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-mono rounded-full border border-purple-500/30 font-bold">AIR-GAPPED SANDBOX</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Policy Simulator</h1>
            <p className="text-sm text-slate-400">Sandbox pengujian perubahan kebijakan dan skenario serangan hipotetis tanpa menyentuh data produksi.</p>
          </div>
        </div>

        <button
          onClick={() => handleRunSimulation(selectedScenario)}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shadow-purple-600/30"
        >
          <Play className="w-4 h-4" />
          <span>Execute Simulation</span>
        </button>
      </div>

      {/* Scenario Selector Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenarios.map(sc => (
          <div
            key={sc.scenarioId}
            onClick={() => handleRunSimulation(sc)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedScenario.scenarioId === sc.scenarioId
                ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500/50 shadow-md ring-1 ring-purple-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {sc.scenarioId}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {sc.targetPolicies.length} Policy Target
              </span>
            </div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white font-sans mt-2">{sc.name}</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-1 line-clamp-2">{sc.description}</p>
          </div>
        ))}
      </div>

      {/* Simulation Result Output */}
      {result && (
        <div className="space-y-4">
          {/* Verdict Banner */}
          <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
            result.blocks > 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
              : result.warnings > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/40 dark:bg-black/20">
                {result.blocks > 0 ? (
                  <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-mono uppercase font-bold tracking-wider">Simulation Blast Radius Analysis</div>
                <h2 className="text-lg font-bold font-sans mt-0.5">{result.predictedImpact}</h2>
                <div className="text-xs text-slate-500 mt-1 font-mono">Executed in sandbox at: {new Date(result.executedAt).toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-center shrink-0">
              <div>
                <div className="text-xs text-slate-500">Evaluated</div>
                <div className="text-2xl font-bold">{result.totalEvaluated}</div>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
              <div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">Pass</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.passes}</div>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
              <div>
                <div className="text-xs text-rose-600 dark:text-rose-400">Blocked</div>
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{result.blocks}</div>
              </div>
            </div>
          </div>

          {/* Detailed Policy Interceptions */}
          <div className="space-y-3">
            {result.evaluations.map(ev => (
              <div
                key={ev.policyId}
                className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  ev.outcome === 'PASS' 
                    ? 'border-slate-200 dark:border-slate-800' 
                    : 'border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {ev.outcome === 'PASS' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ev.policyId}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">{ev.policyName}</span>
                    </div>
                    <p className={`text-xs font-sans ${ev.outcome === 'PASS' ? 'text-slate-500 dark:text-slate-400' : 'text-rose-700 dark:text-rose-300 font-semibold'}`}>
                      {ev.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center font-mono">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    ev.outcome === 'PASS'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  }`}>
                    {ev.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
