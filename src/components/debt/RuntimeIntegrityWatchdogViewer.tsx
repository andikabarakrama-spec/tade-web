import React, { useState } from 'react';
import { runtimeIntegrityWatchdog, WatchdogSnapshot, MonitoredChannel, ChannelTelemetry } from '../../core/debt/RuntimeIntegrityWatchdog';
import { Activity, ShieldCheck, Zap, RefreshCw, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RuntimeIntegrityWatchdogViewer: React.FC = () => {
  const [snapshot, setSnapshot] = useState<WatchdogSnapshot>(() => runtimeIntegrityWatchdog.getSnapshot());
  const [selectedChannel, setSelectedChannel] = useState<MonitoredChannel>('EVENT_QUEUE');

  const handleSimulateJam = (channel: MonitoredChannel) => {
    const res = runtimeIntegrityWatchdog.simulateChannelJam(channel);
    setSnapshot({ ...res });
  };

  const handleExecuteHealing = (channel: MonitoredChannel) => {
    const res = runtimeIntegrityWatchdog.executeMicroHealing(channel);
    setSnapshot({ ...res });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                R647 &bull; RUNTIME INTEGRITY WATCHDOG
              </span>
              <span className="text-xs text-slate-400">Micro-Healing Sentinel (No Reload)</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-400" />
              Runtime Integrity Watchdog &amp; Subsystem Sentinel
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Memantau kesehatan 6 kanal kritis (Runtime Bus, Event Queue, AI Asy Channel, Guardian Channel, Recovery Queue, Journal Queue). Jika macet, melakukan pemulihan mikro 6 tahap (DETECT &rarr; CONTAIN &rarr; RESTART COMPONENT &rarr; VERIFY &rarr; REJOIN &rarr; REINFORCE) tanpa me-reload aplikasi.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateJam(selectedChannel)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" /> Uji Kemacetan
            </button>
            <button
              onClick={() => handleExecuteHealing(selectedChannel)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Jalankan Micro-Healing
            </button>
          </div>
        </div>
      </div>

      {/* 6-Stage Healing Flow Infographic */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">Protokol Pemulihan Mikro 6 Tahap</span>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-mono">
          {[
            { step: '1. DETECT', desc: 'Isolasi Anomali' },
            { step: '2. CONTAIN', desc: 'Lock Worker Buffer' },
            { step: '3. RESTART', desc: 'Micro Recycle Heap' },
            { step: '4. VERIFY', desc: 'Loopback Ping Check' },
            { step: '5. REJOIN', desc: 'Sync Active Bus' },
            { step: '6. REINFORCE', desc: 'Scale Backoff Shield' }
          ].map((s, idx) => (
            <div key={s.step} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
              <strong className="text-xs text-indigo-600 dark:text-indigo-400 block">{s.step}</strong>
              <span className="text-[10px] text-slate-500">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.values(snapshot.channels) as ChannelTelemetry[]).map(ch => {
          const isJammed = ch.status === 'JAMMED';
          return (
            <div
              key={ch.channel}
              onClick={() => setSelectedChannel(ch.channel)}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-800 border cursor-pointer transition-all ${selectedChannel === ch.channel ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md' : 'border-slate-200 dark:border-slate-700'} space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                  {ch.name}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${ch.status === 'OPTIMAL' || ch.status === 'REINFORCED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'}`}>
                  {ch.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                  <span className="text-[10px] text-slate-500 block">Queue Backlog:</span>
                  <strong className={isJammed ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                    {ch.backlogCount} msg
                  </strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                  <span className="text-[10px] text-slate-500 block">Avg Latency:</span>
                  <strong className={isJammed ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                    {ch.avgLatencyMs}ms
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Stage: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{ch.healingStage}</strong></span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecuteHealing(ch.channel);
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline"
                >
                  Micro-Heal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Remediation Audit Logs */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Eksekusi Watchdog &amp; Remediasi Mikro</h3>
            <p className="text-xs text-slate-500">Riwayat deteksi, isolasi, dan reinforment otomatis.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Ring-0 Sentinel Stream</span>
        </div>

        <div className="space-y-2 font-mono text-xs max-h-60 overflow-y-auto pr-1">
          {snapshot.remediationLogs.map((log, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {log.stage}
              </span>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 dark:text-white text-[11px]">{log.channel}</strong>
                  <span className="text-[10px] text-slate-400">{log.timestamp.split('T')[1].substring(0, 8)}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">{log.action}</p>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{log.result}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
