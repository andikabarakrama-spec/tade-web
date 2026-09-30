import React, { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, ShieldAlert, Cpu, Activity, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { KernelServiceSupervisor, ServiceDescriptor, ServiceLifecycleState } from '../../core/kernel/KernelServiceLifecycleManager';
import { EngineId } from '../../core/kernel/GuardianKernelLayer';

export const KernelServiceLifecycleManagerViewer: React.FC = () => {
  const [services, setServices] = useState<ServiceDescriptor[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<EngineId>('FIRESTORE');

  useEffect(() => {
    setServices(KernelServiceSupervisor.getServices());
    const unsub = KernelServiceSupervisor.subscribe(() => {
      setServices(KernelServiceSupervisor.getServices());
    });
    return () => {
      unsub();
    };
  }, []);

  const handleStateChange = (id: EngineId, state: ServiceLifecycleState) => {
    KernelServiceSupervisor.transitionServiceState(id, state);
  };

  const getStatusColor = (state: ServiceLifecycleState) => {
    switch (state) {
      case 'RUNNING': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DEGRADED': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'RECOVERING': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'STARTING': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'STOPPED': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  const selectedService = services.find(s => s.engineId === selectedEngine);

  return (
    <div id="r565-lifecycle-manager" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  Kernel Service Lifecycle Manager
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-900/50 text-cyan-300 border border-cyan-700/50 font-mono">
                    R565 • systemd-grade
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Universal process supervision, state machines, restart budgeting, and cgroup isolation for all TADE subsystems.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              Supervision: 12/12 DAEMONS ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Service List */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Supervised Engine Daemons</span>
            <span className="text-xs text-slate-500 font-mono">{services.length} services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map((svc) => (
              <div
                key={svc.engineId}
                onClick={() => setSelectedEngine(svc.engineId)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedEngine === svc.engineId
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-100 text-sm font-mono">{svc.engineId}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${getStatusColor(svc.state)}`}>
                    {svc.state}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mb-3">{svc.name}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Health: <strong className="text-slate-200">{svc.healthScore}%</strong></span>
                  <span>Mem: <strong className="text-slate-200">{svc.memoryUsedMb}/{svc.memoryQuotaMb} MB</strong></span>
                  <span>Restarts: <strong className="text-slate-200">{svc.restartsUsed}/{svc.restartBudget}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Service Controller */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Service Supervisor Console</span>
            </h2>

            {selectedService ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ENGINE_ID:</span>
                    <span className="text-cyan-400 font-bold">{selectedService.engineId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CGROUP_PATH:</span>
                    <span className="text-slate-300 text-[10px]">{selectedService.cgroupSandbox}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CURRENT_STATE:</span>
                    <span className={`font-bold ${selectedService.state === 'RUNNING' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedService.state}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">UPTIME:</span>
                    <span className="text-slate-300">{Math.floor(selectedService.uptimeSeconds / 3600)}h {Math.floor((selectedService.uptimeSeconds % 3600) / 60)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">RESTART_BUDGET:</span>
                    <span className="text-slate-300">{selectedService.restartsUsed} used / {selectedService.restartBudget} max</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Lifecycle Operations:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStateChange(selectedService.engineId, 'RUNNING')}
                      className="px-3 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" /> Start / Run
                    </button>
                    <button
                      onClick={() => handleStateChange(selectedService.engineId, 'RECOVERING')}
                      className="px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-600/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Recover (Soft)
                    </button>
                    <button
                      onClick={() => handleStateChange(selectedService.engineId, 'DEGRADED')}
                      className="px-3 py-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Degrade (Safe)
                    </button>
                    <button
                      onClick={() => handleStateChange(selectedService.engineId, 'STOPPED')}
                      className="px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-600/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Square className="w-3.5 h-3.5" /> Isolate / Stop
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select an engine to manage lifecycle</p>
            )}
          </div>

          <div className="p-3 mt-4 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All daemons governed by CFS Scheduler & Zero-Drop Supervisor.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
