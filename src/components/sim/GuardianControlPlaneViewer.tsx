import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Send, 
  RefreshCw, 
  Cpu, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Radio,
  Sliders
} from 'lucide-react';
import { guardianControlPlane, RegisteredService, ControlPlaneCommand } from '../../core/kernel/GuardianControlPlane';
import { EngineId } from '../../core/kernel/GuardianKernelLayer';

export const GuardianControlPlaneViewer: React.FC = () => {
  const [services, setServices] = useState<RegisteredService[]>([]);
  const [commands, setCommands] = useState<ControlPlaneCommand[]>([]);
  const [targetEngine, setTargetEngine] = useState<EngineId>('GUARDIAN');
  const [actionInput, setActionInput] = useState<string>('HEARTBEAT_PROBE');
  const [priorityInput, setPriorityInput] = useState<'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'>('HIGH');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const refreshState = () => {
    setServices(guardianControlPlane.getServices());
    setCommands(guardianControlPlane.getCommandQueue());
  };

  useEffect(() => {
    refreshState();
    const interval = setInterval(refreshState, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = () => {
    const cmd = guardianControlPlane.dispatchCommand(
      targetEngine,
      actionInput,
      priorityInput,
      { triggeredBy: 'FOUNDER_CONSOLE', timestamp: new Date().toISOString() },
      'KETUA_YAYASAN_CONSOLE'
    );
    refreshState();
    setDispatchStatus(`Dispatched command ${cmd.commandId} to [${targetEngine}] with priority [${priorityInput}].`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                R595 &bull; GUARDIAN CONTROL PLANE
              </span>
              <span className="text-xs text-slate-400 font-mono">Linux &amp; Kubernetes Inspired Service Registry</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Enterprise Control Plane &amp; Command Router</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-800 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            Control Plane: 100% ROUTING
          </span>
        </div>
      </div>

      {/* Dispatch Feedback */}
      {dispatchStatus && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 font-mono text-xs text-cyan-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{dispatchStatus}</span>
        </div>
      )}

      {/* Control Plane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Command Dispatcher Panel */}
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-4">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            1. Priority Command Dispatcher
          </span>

          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 block">Target Engine:</label>
            <select
              value={targetEngine}
              onChange={(e) => setTargetEngine(e.target.value as EngineId)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
            >
              <option value="GUARDIAN">GUARDIAN (Ring 0 Supervisor)</option>
              <option value="AI_ASY">AI_ASY (Executive Intelligence)</option>
              <option value="FIRESTORE">FIRESTORE (Enterprise Sync)</option>
              <option value="SESSION">SESSION (Multi-Role RBAC)</option>
              <option value="WAR_ROOM">WAR_ROOM (Immortal Storage)</option>
              <option value="PPDB">PPDB (Admission Mesh)</option>
              <option value="RAPORT">RAPORT (Kurikulum Merdeka)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 block">Action / Signal:</label>
            <select
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
            >
              <option value="HEARTBEAT_PROBE">HEARTBEAT_PROBE (Ping Relay)</option>
              <option value="FLUSH_LRU_CACHE">FLUSH_LRU_CACHE (Memory Trim)</option>
              <option value="FORCE_WAL_REPLAY">FORCE_WAL_REPLAY (Post-Crash Sync)</option>
              <option value="DISASTER_HEAL_TRIGGER">DISASTER_HEAL_TRIGGER (Universal Healing)</option>
              <option value="ROTATE_SECURITY_KEYS">ROTATE_SECURITY_KEYS (Zero-Trust Key Rotate)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 block">Command Priority:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['CRITICAL', 'HIGH', 'NORMAL', 'LOW'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityInput(p)}
                  className={`py-1.5 text-center rounded-xl font-bold transition text-[10px] ${
                    priorityInput === p
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDispatch}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
          >
            <Send className="w-4 h-4" /> Dispatch Command
          </button>
        </div>

        {/* Live Service Registry */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              2. Live Service Registry &amp; Engine Discovery
            </span>
            <span className="text-slate-500 text-[10px]">{services.length} Services Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {services.map((svc) => (
              <div
                key={svc.serviceId}
                className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-cyan-400 block font-bold">{svc.serviceId}</span>
                    <strong className="text-xs text-white block mt-0.5">{svc.name}</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                    {svc.status}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Latency: <strong className="text-emerald-400">{svc.latencyMs}ms</strong></span>
                  <span>Load Factor: <strong className="text-cyan-300">{Math.round(svc.loadFactor * 100)}%</strong></span>
                  <span>Ver: {svc.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
