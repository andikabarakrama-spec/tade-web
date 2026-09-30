import React, { useState, useEffect } from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
  Radio,
  Clock,
  RefreshCw,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { connectivityIntelligence } from '../../core/offline/connectivityIntelligence';
import { ConnectivityTelemetry } from '../../core/offline/offlineTypes';

interface Props {
  onNavigate?: (module: string) => void;
}

export const ConnectivityIntelligenceViewer: React.FC<Props> = ({ onNavigate }) => {
  const [telemetry, setTelemetry] = useState<ConnectivityTelemetry>(connectivityIntelligence.getTelemetry());
  const [stabilityScore, setStabilityScore] = useState<number>(connectivityIntelligence.getStabilityScore());

  useEffect(() => {
    const unsub = connectivityIntelligence.subscribe((t) => {
      setTelemetry(t);
      setStabilityScore(connectivityIntelligence.getStabilityScore());
    });
    return () => unsub();
  }, []);

  const getQualityColor = (q: string) => {
    switch (q) {
      case 'EXCELLENT':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'GOOD':
        return 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800';
      case 'FAIR':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
      case 'POOR':
        return 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
      case 'OFFLINE':
        return 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700';
      default:
        return 'text-slate-500 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              R735 &bull; CONNECTIVITY INTELLIGENCE
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <Zap className="w-3 h-3" /> REAL-TIME TELEMETRY
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Intelijensi Jaringan &amp; Profiling Latensi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Pemantauan berkala latensi, durasi offline, waktu pemulihan (recovery time), dan stabilitas link madrasah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-500">STABILITY SCORE:</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {stabilityScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Latency */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold">LATENCY</span>
            <Radio className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {telemetry.status === 'OFFLINE' ? 'OFFLINE' : `${telemetry.latencyMs} ms`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Waktu respon probe lokal
          </div>
        </div>

        {/* Quality */}
        <div className={`p-5 rounded-2xl border ${getQualityColor(telemetry.connectionQuality)}`}>
          <div className="flex items-center justify-between mb-2 opacity-80">
            <span className="text-xs font-mono font-bold">CONNECTION QUALITY</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{telemetry.connectionQuality}</div>
          <div className="text-[11px] opacity-90 mt-1">
            Packet Loss: {telemetry.packetLossRate}%
          </div>
        </div>

        {/* Recovery Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold">LAST RECOVERY</span>
            <RefreshCw className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {telemetry.recoveryTimeMs > 0 ? `${telemetry.recoveryTimeMs} ms` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Durasi handshake reconnect
          </div>
        </div>

        {/* Reconnect Count */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono font-bold">RECONNECTS</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {telemetry.reconnectCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Siklus pemulihan sesi
          </div>
        </div>
      </div>

      {/* Latency History Visualizer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white font-mono text-xs flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            TIMELINE RIWAYAT LATENSI JARINGAN (SAMPLE BUFFER)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Pembaruan tiap 15 detik
          </span>
        </div>

        {/* Sparkline / Bar Graph representation */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="h-32 flex items-end gap-1.5 pt-4">
            {telemetry.history.map((item, idx) => {
              const heightPercent = item.status === 'OFFLINE' ? 4 : Math.min(100, Math.max(10, (item.latencyMs / 200) * 100));
              const barColor =
                item.status === 'OFFLINE'
                  ? 'bg-rose-500'
                  : item.latencyMs > 250
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all ${barColor} hover:opacity-80`}
                  />
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-full mb-2 z-10 px-2 py-1 bg-slate-900 text-white text-[10px] rounded font-mono whitespace-nowrap shadow-lg">
                    {item.status === 'OFFLINE' ? 'OFFLINE' : `${item.latencyMs}ms`} &bull; {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-400">
            <span>Sampel Terdahulu (-15m)</span>
            <span>Waktu Sekarang (Live)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
