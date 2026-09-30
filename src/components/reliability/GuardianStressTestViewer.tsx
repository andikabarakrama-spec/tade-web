import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  WifiOff, 
  Lock, 
  Terminal,
  Activity
} from 'lucide-react';
import { 
  GuardianStressSimulator, 
  StressScenario 
} from '../../core/reliability/guardianStressSimulator';

export const GuardianStressTestViewer: React.FC = () => {
  const simulator = useMemo(() => GuardianStressSimulator.getInstance(), []);
  const [scenarios, setScenarios] = useState<StressScenario[]>(() => simulator.getScenarios());
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const handleRunAllTests = () => {
    setIsTesting(true);
    simulator.runAllStressTests(() => {
      setScenarios([...simulator.getScenarios()]);
      setIsTesting(false);
    });
  };

  return (
    <div className="space-y-6" id="guardian-stress-test-viewer">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                R849 &bull; Guardian Stress & Chaos Lab
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                CHAOS RESILIENT
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Uji Ketahanan & Pertahanan Ring-0
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Mensimulasikan lonjakan beban transaksi tinggi, pemutusan jaringan, eskalasi izin ilegal, dan lonjakan memori secara non-destruktif untuk membuktikan integritas Guardian Ring-0.
            </p>
          </div>

          <button
            onClick={handleRunAllTests}
            disabled={isTesting}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50"
          >
            <Flame className={`w-4 h-4 ${isTesting ? 'animate-bounce' : ''}`} />
            <span>{isTesting ? 'Menjalankan Stress Test...' : 'Jalankan Chaos Simulator'}</span>
          </button>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-rose-300">
                    {sc.id} &bull; {sc.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">{sc.name}</h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                  sc.actualStatus === 'PASSED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  sc.actualStatus === 'TESTING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {sc.actualStatus === 'PASSED' ? `LULUS (${sc.resilienceScore}%)` : sc.actualStatus}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{sc.description}</p>

              {/* Logs */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 font-mono text-[10px]">
                <div className="text-slate-500 flex items-center gap-1 mb-1">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>Guardian Audit Defense Logs:</span>
                </div>
                {sc.guardianActionLogs.map((log, idx) => (
                  <div key={idx} className="text-emerald-400/90 pl-2 border-l border-emerald-500/30">
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Beban Operasi: <strong className="text-slate-300">{sc.simulatedOps} Ops</strong></span>
              <span>Durasi: <strong className="text-cyan-400">{sc.durationMs} ms</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
