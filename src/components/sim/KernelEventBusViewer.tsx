import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Radio, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  Filter, 
  Trash2, 
  Cpu, 
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';
import { kernelEventBus, KernelEventPayload, KernelEventType } from '../../core/kernel/KernelEventBus';
import { EngineId } from '../../core/kernel/GuardianKernelLayer';

export const KernelEventBusViewer: React.FC = () => {
  const [events, setEvents] = useState<KernelEventPayload[]>(() => kernelEventBus.getRingBuffer(50));
  const [stats, setStats] = useState(() => kernelEventBus.getStats());
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedEngine, setSelectedEngine] = useState<string>('ALL');
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);

  // Custom event trigger form
  const [customType, setCustomType] = useState<KernelEventType>('engine.running');
  const [customEngine, setCustomEngine] = useState<EngineId>('SESSION');
  const [customSeverity, setCustomSeverity] = useState<'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL'>('INFO');
  const [customMsg, setCustomMsg] = useState<string>('Heartbeat checkpoint verified OK');

  useEffect(() => {
    // Subscribe to all events on the bus
    const unsubscribe = kernelEventBus.subscribe('*', (newEvent) => {
      if (liveStreamActive) {
        setEvents((prev) => [newEvent, ...prev.slice(0, 99)]);
        setStats(kernelEventBus.getStats());
      }
    });

    // Periodic interval to refresh buffer if needed
    const interval = setInterval(() => {
      if (liveStreamActive) {
        setEvents(kernelEventBus.getRingBuffer(50));
        setStats(kernelEventBus.getStats());
      }
    }, 1500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [liveStreamActive]);

  const handleEmitTestEvent = (e: React.FormEvent) => {
    e.preventDefault();
    kernelEventBus.publish({
      type: customType,
      sourceEngine: customEngine,
      severity: customSeverity,
      data: { message: customMsg, author: 'ConsoleOperator' },
      traceId: `TRC-MANUAL-${Math.floor(Math.random() * 9000 + 1000)}`
    });
    setEvents(kernelEventBus.getRingBuffer(50));
    setStats(kernelEventBus.getStats());
  };

  const handleQuickTrigger = (type: KernelEventType, engine: EngineId, severity: 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL', msg: string) => {
    kernelEventBus.publish({
      type,
      sourceEngine: engine,
      severity,
      data: { message: msg, triggerMode: 'QuickSim' },
      traceId: `TRC-QCK-${Date.now().toString().slice(-4)}`
    });
    setEvents(kernelEventBus.getRingBuffer(50));
    setStats(kernelEventBus.getStats());
  };

  const filteredEvents = events.filter((ev) => {
    if (selectedType !== 'ALL' && ev.type !== selectedType) return false;
    if (selectedEngine !== 'ALL' && ev.sourceEngine !== selectedEngine) return false;
    return true;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'NOTICE':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                R575 &bull; KERNEL EVENT BUS
              </span>
              <span className="text-xs text-slate-400 font-mono">Linux Netlink + Dispatcher Model</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Kernel Async Event Bus &amp; Netlink Stream</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiveStreamActive(!liveStreamActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border transition ${
              liveStreamActive
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-amber-600/20 text-amber-300 border-amber-500/40 hover:bg-amber-600/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {liveStreamActive ? 'LIVE STREAM ACTIVE' : 'STREAM PAUSED'}
          </button>
          <button
            onClick={() => {
              kernelEventBus.clearBuffer();
              setEvents([]);
              setStats(kernelEventBus.getStats());
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block uppercase">Total Dispatched</span>
          <span className="text-xl font-bold text-indigo-300">{stats.totalDispatched}</span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Events since boot</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block uppercase">Ring Buffer Size</span>
          <span className="text-xl font-bold text-cyan-300">{stats.bufferedCount} <span className="text-xs text-slate-500">/ 500</span></span>
          <span className="text-[9px] text-slate-500 block mt-0.5">/dev/kmsg mirror</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block uppercase">Active Subscribers</span>
          <span className="text-xl font-bold text-emerald-400">{stats.activeSubscribers}</span>
          <span className="text-[9px] text-slate-500 block mt-0.5">12 Daemons &amp; Sentinels</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block uppercase">Warning / Critical</span>
          <span className="text-xl font-bold text-amber-300">{stats.warningEvents} <span className="text-rose-400">/ {stats.criticalEvents}</span></span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Telemetry anomalies</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block uppercase">Bus Reliability</span>
          <span className="text-xl font-bold text-emerald-300">{stats.healthyRate}%</span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Zero dropped packets</span>
        </div>
      </div>

      {/* Quick Test Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Quick Event Dispatch Simulation
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Simulate daemon telemetry</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickTrigger('engine.running', 'FIRESTORE', 'INFO', 'Snapshot query batch synchronized')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-xs text-slate-200 font-mono"
          >
            + Firestore Healthy Sync
          </button>
          <button
            onClick={() => handleQuickTrigger('permission.denied', 'SESSION', 'WARNING', 'Unauthorized access attempt intercepted at MAC')}
            className="px-2.5 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-700/50 text-xs text-amber-300 font-mono"
          >
            + Permission Denied
          </button>
          <button
            onClick={() => handleQuickTrigger('heartbeat.timeout', 'ANIMATION', 'WARNING', 'Engine animation loop jitter > 25ms')}
            className="px-2.5 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-700/50 text-xs text-amber-300 font-mono"
          >
            + Heartbeat Jitter
          </button>
          <button
            onClick={() => handleQuickTrigger('watchdog.triggered', 'PPDB', 'CRITICAL', 'PPDB daemon hung on stale lock; auto-isolate triggered')}
            className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-700/50 text-xs text-rose-300 font-mono"
          >
            + Watchdog Trigger
          </button>
          <button
            onClick={() => handleQuickTrigger('recovery.completed', 'GUARDIAN', 'NOTICE', 'Swarm self-healing completed state reconstitution')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-700/50 text-xs text-emerald-300 font-mono"
          >
            + Recovery Completed
          </button>
        </div>
      </div>

      {/* Main Grid: Live Events Stream & Custom Injector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stream List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none"
              >
                <option value="ALL">All Event Types</option>
                <option value="engine.started">engine.started</option>
                <option value="engine.running">engine.running</option>
                <option value="engine.degraded">engine.degraded</option>
                <option value="engine.recovering">engine.recovering</option>
                <option value="recovery.completed">recovery.completed</option>
                <option value="permission.denied">permission.denied</option>
                <option value="heartbeat.timeout">heartbeat.timeout</option>
                <option value="watchdog.triggered">watchdog.triggered</option>
              </select>

              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none"
              >
                <option value="ALL">All Engines (12)</option>
                <option value="GUARDIAN">GUARDIAN</option>
                <option value="AI_ASY">AI_ASY</option>
                <option value="SESSION">SESSION</option>
                <option value="FIRESTORE">FIRESTORE</option>
                <option value="PPDB">PPDB</option>
                <option value="RAPORT">RAPORT</option>
                <option value="KEUANGAN">KEUANGAN</option>
                <option value="CCTV">CCTV</option>
                <option value="ANIMATION">ANIMATION</option>
                <option value="DISCOVERY">DISCOVERY</option>
                <option value="WAR_ROOM">WAR_ROOM</option>
                <option value="WEBSITE">WEBSITE</option>
              </select>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Showing {filteredEvents.length} events
            </span>
          </div>

          <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/30 rounded-2xl border border-slate-800 text-slate-500 font-mono text-xs">
                No events match the selected criteria in the active ring buffer.
              </div>
            ) : (
              filteredEvents.map((ev) => (
                <div
                  key={ev.eventId}
                  className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition space-y-1.5 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(ev.severity)}`}>
                        {ev.severity}
                      </span>
                      <span className="font-bold text-slate-200">{ev.type}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300">
                        {ev.sourceEngine}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(ev.epochMs).toLocaleTimeString()}
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {String(ev.data.message || JSON.stringify(ev.data))}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-700/40">
                    <span>ID: {ev.eventId}</span>
                    <span className="text-indigo-400">Trace: {ev.traceId}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Manual Injection Terminal */}
        <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono border-b border-slate-700 pb-3">
            <Send className="w-4 h-4 text-cyan-400" />
            Custom Kernel Dispatcher
          </div>

          <form onSubmit={handleEmitTestEvent} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Event Type</label>
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value as KernelEventType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="engine.started">engine.started</option>
                <option value="engine.running">engine.running</option>
                <option value="engine.degraded">engine.degraded</option>
                <option value="engine.recovering">engine.recovering</option>
                <option value="recovery.completed">recovery.completed</option>
                <option value="permission.denied">permission.denied</option>
                <option value="heartbeat.timeout">heartbeat.timeout</option>
                <option value="watchdog.triggered">watchdog.triggered</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Source Engine</label>
              <select
                value={customEngine}
                onChange={(e) => setCustomEngine(e.target.value as EngineId)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="GUARDIAN">GUARDIAN</option>
                <option value="AI_ASY">AI_ASY</option>
                <option value="SESSION">SESSION</option>
                <option value="FIRESTORE">FIRESTORE</option>
                <option value="PPDB">PPDB</option>
                <option value="RAPORT">RAPORT</option>
                <option value="KEUANGAN">KEUANGAN</option>
                <option value="CCTV">CCTV</option>
                <option value="ANIMATION">ANIMATION</option>
                <option value="DISCOVERY">DISCOVERY</option>
                <option value="WAR_ROOM">WAR_ROOM</option>
                <option value="WEBSITE">WEBSITE</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Severity Level</label>
              <select
                value={customSeverity}
                onChange={(e) => setCustomSeverity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="INFO">INFO (Normal Operation)</option>
                <option value="NOTICE">NOTICE (State Transition)</option>
                <option value="WARNING">WARNING (Transient Jitter)</option>
                <option value="CRITICAL">CRITICAL (Requires Kernel Intervention)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Event Payload Message</label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Enter event details..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
              Dispatch Event to Bus
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 space-y-1 font-mono">
            <span className="font-bold text-slate-300 block">Linux Netlink Standard:</span>
            <p>Dispatched events are broadcast atomically to all registered daemon listeners with zero heap fragmentation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
