import React, { useState } from 'react';
import { AdaptiveBandwidthEdgeSync, NetworkProfile, SyncPriorityQueueItem } from '../../core/orchestration/AdaptiveBandwidthEdgeSync';
import { Wifi, WifiOff, Zap, ShieldCheck, CheckCircle2, RefreshCw, ArrowRight, Activity } from 'lucide-react';

export const AdaptiveBandwidthEdgeSyncViewer: React.FC = () => {
  const sync = AdaptiveBandwidthEdgeSync.getInstance();
  const [metrics, setMetrics] = useState(sync.getMetrics());
  const [queue, setQueue] = useState<SyncPriorityQueueItem[]>(sync.getQueue());
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushResult, setFlushResult] = useState<string | null>(null);

  const handleProfileChange = (profile: NetworkProfile) => {
    sync.setNetworkProfile(profile);
    setMetrics(sync.getMetrics());
  };

  const handleFlushQueue = () => {
    setIsFlushing(true);
    setTimeout(() => {
      const res = sync.flushPriorityQueue();
      setQueue(sync.getQueue());
      setMetrics(sync.getMetrics());
      setIsFlushing(false);
      setFlushResult(`Berhasil mensinkronkan ${res.syncedCount} item prioritas. Hemat ${res.bytesSaved.toLocaleString()} bytes bandwidth!`);
      setTimeout(() => setFlushResult(null), 4000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Network Selector */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                R664 &bull; ADAPTIVE EDGE COMPRESSION
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Smart Bandwidth Throttling &amp; Adaptive Edge Synchronizer
              </h3>
            </div>
          </div>

          <button
            onClick={handleFlushQueue}
            disabled={isFlushing}
            className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-mono text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFlushing ? 'animate-spin' : ''}`} />
            <span>{isFlushing ? 'Menyinkronkan...' : 'Flush Priority Queue'}</span>
          </button>
        </div>

        {flushResult && (
          <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-700 text-xs text-cyan-800 dark:text-cyan-200 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>{flushResult}</span>
          </div>
        )}

        {/* Network Profile Simulator Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
            Simulasi Profil Kecepatan Jaringan Madrasah:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'OFFLINE_AIR_GAP', label: 'Air-Gap Offline (0 Mbps)', icon: WifiOff },
              { id: 'EDGE_2G', label: 'Edge / 2G (150 Kbps)', icon: Wifi },
              { id: 'SLOW_3G', label: 'Slow 3G (800 Kbps)', icon: Wifi },
              { id: '4G_LTE', label: '4G LTE (18 Mbps)', icon: Wifi },
              { id: 'FIBER_HIGH_SPEED', label: 'Fiber High Speed (100 Mbps)', icon: Wifi }
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => handleProfileChange(p.id as NetworkProfile)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                    metrics.currentProfile === p.id
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Data Compression</span>
            <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">{metrics.dataSavedRatioPercent}%</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Delta Patch Saved</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Est. Downlink</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{metrics.downlinkSpeedMbps} Mbps</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">RTT ~{metrics.roundTripTimeMs}ms</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Bytes Saved</span>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {(metrics.totalBytesSavedByDelta / 1024).toFixed(1)} KB
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Bandwidth Optimized</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Low-Bandwidth Mode</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {metrics.lowBandwidthModeActive ? 'ACTIVE' : 'STANDBY'}
            </div>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">Auto Tier-1 Fastpass</span>
          </div>
        </div>
      </div>

      {/* Priority Queue Registry */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tier-Prioritized Payload Synchronization Queue</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">{queue.length} Queue Items</span>
        </div>

        <div className="space-y-3">
          {queue.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    item.tier === 1
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : item.tier === 2
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    TIER {item.tier}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.payloadSummary}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  item.status === 'SYNCED'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {item.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700">
                <span><strong>Kategori:</strong> {item.category}</span>
                <span><strong>Payload:</strong> {item.originalSizeBytes}B &rarr; {item.compressedSizeBytes}B (-{Math.round((1 - item.compressedSizeBytes / item.originalSizeBytes) * 100)}%)</span>
                <span><strong>Queued:</strong> {item.queuedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
