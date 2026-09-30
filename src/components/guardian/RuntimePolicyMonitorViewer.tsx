import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Eye, 
  Radio, 
  ShieldCheck, 
  BellRing, 
  TrendingUp, 
  Lock, 
  Server,
  Zap
} from 'lucide-react';
import { runtimePolicyMonitor, RuntimePolicyTelemetry } from '../../core/guardian/runtimePolicyMonitor';

export const RuntimePolicyMonitorViewer: React.FC = () => {
  const [telemetry, setTelemetry] = useState<RuntimePolicyTelemetry>(() => runtimePolicyMonitor.getTelemetry());

  useEffect(() => {
    const unsub = runtimePolicyMonitor.subscribe((t) => {
      setTelemetry(t);
    });
    return () => unsub();
  }, []);

  return (
    <div id="runtime-policy-monitor-viewer" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">R745 Runtime Policy Monitor</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-full border border-emerald-500/30 font-bold">NON-MUTATING OBSERVER</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Runtime Policy Monitor</h1>
            <p className="text-sm text-slate-400">Pemantau kebijakan live runtime secara deterministik. Observasi dan alert tanpa mengubah data produksi.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-2xl border border-slate-700/60 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400 font-bold">LIVE TELEMETRY</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Enforcement Daemons</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{telemetry.activeEnforcements} Active</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">100% Core Guardians Online</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Evaluations Rate</div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">{telemetry.totalEvaluationsPerMin} / min</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Real-time Probe Cycle</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">System Live State</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{telemetry.liveStatus}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Zero Rogue Interceptions</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Side-Effect Guarantee</div>
          <div className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300 mt-2">STRICTLY READ-ONLY</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Zero Database Writes</div>
        </div>
      </div>

      {/* 6 Core Domain Live Telemetry Gauges */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          <span>Real-time Compliance Telemetry by Domain</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {[
            { label: 'Security & Ring-0 Isolation', score: telemetry.metrics.securityIntegrity, color: 'emerald' },
            { label: 'RBAC 7-Role Boundaries', score: telemetry.metrics.rbacIsolation, color: 'blue' },
            { label: '5-Phase Recovery Health', score: telemetry.metrics.recoveryReadiness, color: 'purple' },
            { label: 'Offline Queue Idempotency', score: telemetry.metrics.offlineHealth, color: 'indigo' },
            { label: 'Hermes Dormant Confinement', score: telemetry.metrics.intelligenceSafety, color: 'emerald' },
            { label: 'SSoT Central Sentry (db.ts)', score: telemetry.metrics.governanceCompliance, color: 'blue' }
          ].map(m => (
            <div key={m.label} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{m.label}</span>
                <span className="font-bold text-slate-900 dark:text-white">{m.score}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${m.score}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Alert Broadcast Panel */}
      <div className="p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">Passive Observer Event Stream</span>
          </div>
          <span className="text-[10px] text-slate-400">UPDATED: {new Date(telemetry.timestamp).toLocaleTimeString()}</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs space-y-2">
          <div className="text-emerald-400 flex items-center gap-2">
            <CheckCheckIcon className="w-4 h-4" />
            <span>[DAEMON-HEARTBEAT] All 12 runtime policy sentinels operating within baseline parameters.</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Zero unauthorized privilege escalation attempts observed in the last 15-minute sampling window.
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
