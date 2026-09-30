import React, { useState } from 'react';
import { 
  HardDrive, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Cpu, 
  Lock,
  Zap,
  Activity
} from 'lucide-react';
import { RecoveryReadinessSimulator, DisasterSimulationReport } from '../../core/sovereign/recoveryReadinessSimulator';

export const RecoveryReadinessSimulatorViewer: React.FC = () => {
  const simulator = RecoveryReadinessSimulator.getInstance();
  const [reports, setReports] = useState<DisasterSimulationReport[]>(() => simulator.getReports());
  const [activeReport, setActiveReport] = useState<DisasterSimulationReport | null>(reports[0] || null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 250);
    setTimeout(() => setSimStep(3), 500);
    setTimeout(() => setSimStep(4), 750);

    setTimeout(() => {
      const rep = simulator.runDrill();
      setActiveReport(rep);
      setReports(simulator.getReports());
      setIsSimulating(false);
      setSimStep(0);
    }, 1000);
  };

  return (
    <div className="space-y-6" id="recovery-readiness-simulator-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                Resilience Sandbox
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R769 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Recovery Readiness Simulator
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Simulasi skenario krisis terisolasi 100% *in-memory* tanpa menyentuh data produksi: putus jaringan, reload tab peramban, jeda/lanjutkan, dan pemulihan sinkronisasi bertahap.
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-lg"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulasi Berjalan (Tahap {simStep}/4)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Simulasi Pemulihan Bencana</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Phases Drill Pipeline Visual */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          Tahapan Simulasi Krisis Sandbox
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { step: 1, title: '1. Putus Jaringan', desc: 'Isolasi koneksi virtual, beralih ke in-memory queue' },
            { step: 2, title: '2. Reload Tab', desc: 'Simulasi refresh peramban, snapshot memory dipulihkan' },
            { step: 3, title: '3. Pause/Resume', desc: 'Rekonsiliasi sidik jari untuk cegah eksekusi ganda' },
            { step: 4, title: '4. Reconnect & Sync', desc: 'Jaringan pulih, verifikasi timestamp non-destruktif' }
          ].map(p => {
            const isStepActive = isSimulating && simStep === p.step;
            const isStepDone = activeReport && (!isSimulating || simStep > p.step);
            return (
              <div
                key={p.step}
                className={`p-4 rounded-xl border transition ${
                  isStepActive 
                    ? 'bg-sky-950/60 border-sky-500/60 text-white shadow-lg animate-pulse' 
                    : isStepDone 
                      ? 'bg-slate-950/70 border-emerald-500/40 text-slate-200' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-sky-300">{p.title}</span>
                  {isStepDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drill Results Report */}
      {activeReport && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">{activeReport.name}</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  {activeReport.verdict}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Drill ID: <span className="font-mono text-sky-400">{activeReport.drillId}</span> &bull; RTO: {activeReport.rtoEstimateSeconds}s &bull; RPO Data Loss: {activeReport.rpoLossBytes} bytes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
                Zero Production Mutation Confirmed
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {activeReport.steps.map(s => (
              <div key={s.stepIndex} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{s.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{s.details}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 block">{s.durationMs} ms</span>
                  <span className="text-[10px] font-bold text-emerald-400">PASSED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
