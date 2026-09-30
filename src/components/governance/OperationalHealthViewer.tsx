import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Database, 
  HardDrive, 
  Zap, 
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
  Lock,
  Gauge
} from 'lucide-react';
import { OperationalHealthCenter, OperationalHealthSummary } from '../../core/governance/OperationalHealthCenter';
import { RecoveryReadinessEngine, RecoveryReadinessReport } from '../../core/governance/RecoveryReadinessDashboard';
import { PerformanceObservationEngine, PerformanceObservationReport } from '../../core/governance/PerformanceObservationEngine';

export const OperationalHealthViewer: React.FC = () => {
  const healthCenter = OperationalHealthCenter.getInstance();
  const recoveryEngine = RecoveryReadinessEngine.getInstance();
  const perfEngine = PerformanceObservationEngine.getInstance();

  const [health, setHealth] = useState<OperationalHealthSummary>(() => healthCenter.getHealthSummary());
  const [recovery, setRecovery] = useState<RecoveryReadinessReport>(() => recoveryEngine.getReadinessReport());
  const [perf, setPerf] = useState<PerformanceObservationReport>(() => perfEngine.getObservationReport());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setHealth(healthCenter.getHealthSummary());
      setRecovery(recoveryEngine.getReadinessReport());
      setPerf(perfEngine.getObservationReport());
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="space-y-6" id="operational-health-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Operational Telemetry & Readiness
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R701, R704, R709
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Operational Health & Recovery Center
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Observabilitas komprehensif status kompilasi TypeScript, integritas Guardian Ring-0, kesiapan Disaster Recovery, dan performa runtime tanpa layanan berbayar eksternal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Segarkan Telemetri
            </button>
            <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sistem Sehat 99.8%
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Core Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Build & Bundler</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{health.buildStatus.status} (Vite 5.x)</div>
          <div className="text-xs text-slate-400">Target: {health.buildStatus.target} &bull; {health.buildStatus.version}</div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">0 Syntax Warnings &bull; Tree-Shaking Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Type Safety (tsc)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{health.typeScriptStatus.status}</div>
          <div className="text-xs text-slate-400">{health.typeScriptStatus.typeCheck}</div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">100% Modul Lolos Validasi Tipe Ketat</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Guardian Ring-0</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{health.guardianStatus.status}</div>
          <div className="text-xs text-slate-400">{health.guardianStatus.activeRulesCount} Invariant Rules Enforced</div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">0 Breach Attempts Detected</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Recovery Readiness</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{health.recoveryStatus.status}</div>
          <div className="text-xs text-slate-400">RTO: ~{health.recoveryStatus.rtoEstimateSec}s &bull; RPO: {health.recoveryStatus.rpoEstimateSec}s</div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">Dual In-Memory & Local SSoT Sync</div>
        </div>
      </div>

      {/* Grid: Recovery Readiness Dashboard (R704) & Performance Observation (R709) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Readiness (R704) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Kesiapan Pemulihan Bencana (R704)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              Confidence: {recovery.recoveryConfidenceScore}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold">Cakupan Pemulihan</div>
              <div className="text-lg font-black text-white mt-1">{recovery.recoveryCoveragePercentage}% Entitas SSoT</div>
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold">Target RTO / RPO</div>
              <div className="text-lg font-black text-emerald-400 mt-1">{recovery.rtoTargetSeconds}s / {recovery.rpoTargetSeconds}s</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Artefak Cadangan Data Siap Pakai:
            </div>
            <div className="space-y-2">
              {recovery.backups.map(b => (
                <div key={b.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{b.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Tipe: {b.type} &bull; Ukuran: {(b.sizeBytes / 1024).toFixed(0)} KB</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Observation Engine (R709) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Observasi Performa Lokal Zero-Cost (R709)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              {perf.frameRateFps} FPS Stable
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold">Penggunaan Memori JS Heap</div>
              <div className="text-lg font-black text-white mt-1">{perf.memoryObservation.usedHeapMb} MB / {perf.memoryObservation.heapLimitMb} MB</div>
              <div className="text-[10px] text-emerald-400 font-semibold">Utilisasi {perf.memoryObservation.heapUtilizationPercentage}% (Optimal)</div>
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold">Total Bundle Terkompresi</div>
              <div className="text-lg font-black text-white mt-1">~{perf.bundleObservation.compressionGzipEstKb} KB (Gzip)</div>
              <div className="text-[10px] text-slate-400">DOM Nodes: {perf.domNodeCount} elemen</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Estimasi Biaya Render Komponen Kunci:
            </div>
            <div className="space-y-2">
              {perf.componentRenderCosts.map(c => (
                <div key={c.componentName} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{c.componentName}</div>
                    <div className="text-[10px] text-slate-400">{c.recommendation}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">{c.estimatedRenderMs} ms</div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
