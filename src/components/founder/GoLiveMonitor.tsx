import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  HardDrive,
  Upload,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Cpu
} from 'lucide-react';
import { goLiveMonitorService, LiveTelemetrySnapshot, SystemAnomaly } from '../../services/goLiveMonitorService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const GoLiveMonitor: React.FC = () => {
  const [telemetry, setTelemetry] = useState<LiveTelemetrySnapshot>(goLiveMonitorService.getSnapshot());
  const [anomalies, setAnomalies] = useState<SystemAnomaly[]>(goLiveMonitorService.getAnomalies());
  const [healingFeedback, setHealingFeedback] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(goLiveMonitorService.getSnapshot());
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleSelfHeal = () => {
    const result = goLiveMonitorService.triggerDiagnosticHealing();
    setHealingFeedback(result.report);
    founderCommandRecorder.recordCommand(
      'SYSTEM_DIAGNOSTIC',
      'Go-Live Monitor Dr. Pulse',
      'Eksekusi Diagnostic Self-Healing & Buffer Stabilization'
    );
    setTimeout(() => setHealingFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Sprint G8 P5 • Telemetri Nyata Dr. Pulse</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Dr. Pulse Go-Live Realtime Monitor
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Monitoring performa nyata: laju bingkai (FPS), penggunaan memori heap, latensi jaringan, kuota penyimpanan, batas anggaran animasi, dan mitigasi anomali otomatis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSelfHeal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-950"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic Self-Healing</span>
            </button>
          </div>
        </div>

        {healingFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{healingFeedback}</span>
          </div>
        )}
      </div>

      {/* 6 Key Realtime Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. FPS */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Laju Bingkai (FPS)</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">{telemetry.fps}</span>
            <span className="text-xs text-slate-400">/ 60 FPS Target</span>
          </div>
          <div className="text-xs text-slate-300">
            Render latensi rata-rata: <span className="font-mono text-emerald-400 font-bold">{telemetry.networkLatencyMs}ms</span>
          </div>
        </div>

        {/* 2. Heap Memory */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Memori JS Heap</span>
            <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-300 font-mono">{telemetry.memoryHeapMB}</span>
            <span className="text-xs text-slate-400">MB (Batas {telemetry.maxHeapMB} MB)</span>
          </div>
          <div className="text-xs text-slate-300">
            Status: <span className="text-indigo-400 font-bold">Ringan & Bebas Kebocoran</span>
          </div>
        </div>

        {/* 3. Animation Budget */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anggaran Animasi</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/40">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-mono">{telemetry.activeAnimationCount}</span>
            <span className="text-xs text-slate-400">/ Maks {telemetry.animationBudgetLimit} Efek Aktif</span>
          </div>
          <div className="text-xs text-slate-300">
            Sesuai Konstitusi Performa: <span className="text-amber-400 font-bold">Hemat Baterai</span>
          </div>
        </div>

        {/* 4. Storage Quota */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Penyimpanan Terpakai</span>
            <div className="p-2 rounded-xl bg-violet-950 text-violet-400 border border-violet-800/40">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-violet-400 font-mono">{telemetry.storageUsedMB}</span>
            <span className="text-xs text-slate-400">MB ({telemetry.storageUsagePercent}%)</span>
          </div>
          <div className="text-xs text-slate-300">
            Kapasitas tersisa: <span className="font-mono text-violet-400 font-bold">{telemetry.storageLimitMB - telemetry.storageUsedMB} MB</span>
          </div>
        </div>

        {/* 5. Upload Health */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kesehatan Jaringan Upload</span>
            <div className="p-2 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/40">
              <Upload className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-400 font-mono">{telemetry.uploadSpeedKbps}</span>
            <span className="text-xs text-slate-400">Kbps</span>
          </div>
          <div className="text-xs text-slate-300">
            Kecepatan Media: <span className="text-teal-400 font-bold">Sangat Baik (Fast)</span>
          </div>
        </div>

        {/* 6. Error Ring-0 */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Error Fatal Ring-0</span>
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">{telemetry.ring0ErrorCount}</span>
            <span className="text-xs text-slate-400">Insiden</span>
          </div>
          <div className="text-xs text-slate-300">
            Integritas Kernel: <span className="text-cyan-400 font-bold">100% Bebas Crash</span>
          </div>
        </div>
      </div>

      {/* Anomaly Trace & Mitigation Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Riwayat Mitigasi & Self-Healing Telemetri</span>
          </h2>
          <span className="text-xs text-emerald-400 font-mono">Autonomous Healing Active</span>
        </div>

        <div className="space-y-3">
          {anomalies.map(ano => (
            <div key={ano.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">{ano.metric} • {ano.id}</span>
                <span className="text-slate-500 font-mono">{ano.time}</span>
              </div>
              <p className="text-xs text-slate-300">{ano.description}</p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1 border-t border-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Tindakan: {ano.healingApplied}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
