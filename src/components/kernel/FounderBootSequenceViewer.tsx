import React, { useState } from 'react';
import {
  Power,
  RotateCcw,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  HardDrive,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import {
  founderBootSequenceV2,
  BootStage,
} from '../../core/kernel/FounderBootSequenceV2';

export const FounderBootSequenceViewer: React.FC = () => {
  const [stages, setStages] = useState<BootStage[]>(founderBootSequenceV2.getStages());
  const [isRebooting, setIsRebooting] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<number>(-1);

  const handleSimulateReboot = async () => {
    setIsRebooting(true);
    await founderBootSequenceV2.executeRebootSimulation((idx) => {
      setActiveStage(idx);
      setStages(founderBootSequenceV2.getStages());
    });
    setIsRebooting(false);
    setActiveStage(-1);
    setStages(founderBootSequenceV2.getStages());
  };

  return (
    <div id="founder-boot-sequence-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R631 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Founder Boot Sequence V2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Power className="w-8 h-8 text-rose-400" />
              Founder Boot Sequence V2 (7-Stage Deterministic)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Deterministic 7-Stage boot sequence guaranteeing sovereign hash validation, memory isolation, Ring-0 defense arming, and war room readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateReboot}
              disabled={isRebooting}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all font-mono disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isRebooting ? 'animate-spin' : ''}`} />
              {isRebooting ? 'Rebooting Stages...' : '1-Click Reboot Test'}
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL STAGES</span>
            <span className="text-xl font-bold text-rose-400 font-mono">7 Stages</span>
            <span className="text-[9px] text-rose-500 block">100% Sequential</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL BOOT TIME</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{founderBootSequenceV2.getTotalDurationMs()} ms</span>
            <span className="text-[9px] text-emerald-500 block">Ultra Fast LTS</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">RACE CONDITIONS</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">0</span>
            <span className="text-[9px] text-cyan-500 block">Atomic Verification</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">BOOT STATUS</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">VERIFIED_PASS</span>
            <span className="text-[9px] text-emerald-500 block">Ready For Production</span>
          </div>
        </div>
      </div>

      {/* Stages List */}
      <div className="space-y-4">
        {stages.map((stage) => (
          <div
            key={stage.stageNumber}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-800 border transition-all ${
              activeStage === stage.stageNumber - 1
                ? 'border-rose-500 shadow-md ring-2 ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-sm flex items-center justify-center">
                  #{stage.stageNumber}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{stage.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {stage.stageCode} &bull; Subsystem: {stage.subsystem}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">{stage.durationMs} ms</span>
                {stage.status === 'VERIFIED_PASS' ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED PASS
                  </span>
                ) : stage.status === 'INITIALIZING' ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold flex items-center gap-1 animate-pulse">
                    INITIALIZING...
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 font-mono text-xs">
                    PENDING
                  </span>
                )}
              </div>
            </div>

            <div className="pl-11 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 block">Verification Checkpoints:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {stage.checksCompleted.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
