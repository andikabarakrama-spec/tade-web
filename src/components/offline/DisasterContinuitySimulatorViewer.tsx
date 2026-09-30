import React, { useState, useEffect } from 'react';
import {
  Flame,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  WifiOff,
  Activity,
  Zap,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import {
  disasterContinuitySimulator,
  CONTINUITY_SCENARIOS,
  SimulationScenario
} from '../../core/offline/disasterContinuitySimulator';

interface Props {
  onNavigate?: (module: string) => void;
}

export const DisasterContinuitySimulatorViewer: React.FC<Props> = ({ onNavigate }) => {
  const [isRunning, setIsRunning] = useState<boolean>(disasterContinuitySimulator.isRunning());
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario | null>(
    disasterContinuitySimulator.getCurrentScenario()
  );
  const [logs, setLogs] = useState(disasterContinuitySimulator.getLogs());

  useEffect(() => {
    const unsub = disasterContinuitySimulator.subscribe(() => {
      setIsRunning(disasterContinuitySimulator.isRunning());
      setCurrentScenario(disasterContinuitySimulator.getCurrentScenario());
      setLogs(disasterContinuitySimulator.getLogs());
    });
    return () => unsub();
  }, []);

  const handleRunScenario = async (id: string) => {
    await disasterContinuitySimulator.runScenario(id);
  };

  const handleReset = () => {
    disasterContinuitySimulator.resetSimulation();
  };

  const getLogBadge = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return 'text-emerald-400';
      case 'WARN':
        return 'text-amber-400';
      case 'ERROR':
        return 'text-rose-400';
      default:
        return 'text-sky-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              R738 &bull; DISASTER CONTINUITY SIMULATOR
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              AIR-GAPPED SANDBOX
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Simulator Bencana &amp; Ketahanan Jaringan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Sandbox pengujian skenario ekstrem: internet putus mendadak, reconnect berulang, tabrakan data, dan pemulihan otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Sandbox
          </button>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTINUITY_SCENARIOS.map((sc) => {
          const isThisActive = currentScenario?.id === sc.id;

          return (
            <div
              key={sc.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isThisActive
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {sc.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {sc.durationSeconds}s
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {sc.description}
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Hasil: </span>
                  {sc.expectedOutcome}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {isThisActive ? 'SEDANG BERJALAN...' : 'Siap Diuji'}
                </span>
                <button
                  onClick={() => handleRunScenario(sc.id)}
                  disabled={isRunning}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    isThisActive
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                  } disabled:opacity-50`}
                >
                  <Play className="w-3.5 h-3.5" />
                  {isThisActive ? 'Menjalankan...' : 'Jalankan Skenario'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Log Console */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm">Simulator Live Console Log</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {logs.length} entri terekam
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 space-y-1.5 max-h-56 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">Belum ada aktivitas simulasi.</div>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <span className="text-slate-500 shrink-0">
                  [{new Date(l.timestamp).toLocaleTimeString()}]
                </span>
                <span className={`font-bold ${getLogBadge(l.level)}`}>[{l.level}]</span>
                <span className="text-slate-300">{l.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
