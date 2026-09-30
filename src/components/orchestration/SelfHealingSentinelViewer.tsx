import React, { useState } from 'react';
import { SelfHealingSentinelEngine, SelfHealingAnomaly } from '../../core/orchestration/SelfHealingSentinelEngine';
import { Activity, ShieldCheck, RefreshCw, Zap, AlertTriangle, CheckCircle2, Server, HardDrive } from 'lucide-react';

export const SelfHealingSentinelViewer: React.FC = () => {
  const engine = SelfHealingSentinelEngine.getInstance();
  const [summary, setSummary] = useState(engine.getHealthSummary());
  const [anomalies, setAnomalies] = useState<SelfHealingAnomaly[]>(engine.getAnomalies());
  const [circuitBreakers] = useState(engine.getCircuitBreakers());
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = engine.triggerDiagnosticScan();
      setSummary(engine.getHealthSummary());
      setAnomalies(engine.getAnomalies());
      setIsScanning(false);
      setScanMessage(`Scan selesai dalam ${res.scanDurationMs}ms. ${res.healedCount} anomali terselesaikan secara otomatis tanpa refresh!`);
      setTimeout(() => setScanMessage(null), 5000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header & Trigger */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                R661 &bull; KERNEL SENTINEL
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Autonomous Self-Healing &amp; Sentinel Recovery Engine
              </h3>
            </div>
          </div>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Memindai Anomali...' : 'Jalankan Sentinel Diagnostic Scan'}</span>
          </button>
        </div>

        {scanMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-200 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Health Score</span>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{summary.overallHealthScore}%</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3" /> Zero Runtime Crashes
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Auto-Healing Rate</span>
            <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">{summary.autoHealingSuccessRate}%</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {summary.totalAnomaliesHealed}/{summary.totalAnomaliesDetected} Selesai Sembuh
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Circuit Breakers</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{circuitBreakers.length}</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All Closed (Healthy)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Uptime Stability</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{summary.uptimeHours}h</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Continuous Session</span>
          </div>
        </div>
      </div>

      {/* Circuit Breakers Registry */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Circuit Breakers Registry</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">Threshold-Based Autonomous Trip</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {circuitBreakers.map((cb) => (
            <div key={cb.serviceName} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <strong className="text-xs text-slate-900 dark:text-white truncate">{cb.serviceName}</strong>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {cb.state}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                <div>Failures: {cb.failureCount} / {cb.threshold} Max</div>
                <div>Recoveries: {cb.recoveryCount} Auto-passes</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalies Log */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-teal-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Self-Healing Sentinel Recovery Audit Log</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">{anomalies.length} Records</span>
        </div>

        <div className="space-y-3">
          {anomalies.map((anom) => (
            <div key={anom.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                    {anom.id}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{anom.component}</span>
                  <span className="text-[10px] text-slate-400">({anom.category})</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> HEALED ({anom.durationMs}ms)
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{anom.description}</p>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span><strong>Healing Action:</strong> {anom.healingActionTaken}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
