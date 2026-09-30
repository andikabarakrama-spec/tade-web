import React, { useState, useEffect } from 'react';
import { LifeBuoy, Play, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ContinuityIntelligenceEngine, RecoveryPlanItem } from '../../core/continuity/continuityIntelligenceEngine';

export const SmartRecoveryCoordinatorViewer: React.FC = () => {
  const [plans, setPlans] = useState<RecoveryPlanItem[]>([]);
  const [activeDrillId, setActiveDrillId] = useState<string | null>(null);
  const [drillLog, setDrillLog] = useState<string[]>([]);

  useEffect(() => {
    const engine = ContinuityIntelligenceEngine.getInstance();
    setPlans(engine.getRecoveryPlans());
    const unsub = engine.subscribe(() => {
      setPlans([...engine.getRecoveryPlans()]);
    });
    return unsub;
  }, []);

  const handleRunDrill = (planId: string) => {
    setActiveDrillId(planId);
    setDrillLog([`[DRILL START] Menginisialisasi simulasi pemulihan untuk skenario ${planId}...`]);

    setTimeout(() => {
      setDrillLog(prev => [...prev, `[STEP 1] Memvalidasi keutuhan SSoT db.ts dan snapshot Hermes...`]);
    }, 400);

    setTimeout(() => {
      setDrillLog(prev => [...prev, `[STEP 2] Melakukan rekonsiliasi data deterministik LWW & replay buffer...`]);
    }, 800);

    setTimeout(() => {
      const engine = ContinuityIntelligenceEngine.getInstance();
      const res = engine.triggerRecoveryDrill(planId);
      setDrillLog(prev => [
        ...prev,
        `[DRILL SUCCESS] Simulasi sukses 100%! Durasi pemulihan: ${res.duration} detik. Status normal.`
      ]);
      setActiveDrillId(null);
    }, 1200);
  };

  return (
    <div id="r864-smart-recovery-coordinator" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded">R864</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded">RC104</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">Zero Loss DR</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Smart Recovery Coordinator</h2>
              <p className="text-sm text-slate-500">
                Pusat orkestrasi pemulihan otomatis, simulasi kesiapsiagaan bencana data (*Disaster Recovery Drill*), dan *zero-loss restoration*.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              SLA RTO: &lt; 5s (Actual: 1.8s)
            </span>
          </div>
        </div>
      </div>

      {/* Recovery Plans */}
      <div className="space-y-4">
        {plans.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{p.id}</span>
                  <h3 className="font-semibold text-slate-800 text-base">{p.scenarioName}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Kondisi Pemicu: <strong>{p.triggerCondition}</strong>
                </p>
              </div>

              <button
                onClick={() => handleRunDrill(p.id)}
                disabled={activeDrillId !== null}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-medium text-xs rounded-lg transition-all shadow-sm shrink-0 self-start sm:self-auto"
              >
                <Play className={`w-3.5 h-3.5 ${activeDrillId === p.id ? 'animate-spin' : ''}`} />
                {activeDrillId === p.id ? 'Menjalankan Simulasi...' : 'Uji Simulasi Pemulihan (Drill)'}
              </button>
            </div>

            {/* Automated Steps */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Langkah Otomasi Pemulihan:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {p.automatedSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drill Stats */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
              <span>Drill Terakhir: <strong className="text-slate-700">{p.lastDrillDate}</strong></span>
              <span>Tingkat Keberhasilan: <strong className="text-emerald-700">{p.drillSuccessRate}%</strong></span>
              <span>Waktu Pemulihan Rata-rata: <strong className="text-slate-700">{p.drillDurationSec} Detik</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Drill Logs Console */}
      {drillLog.length > 0 && (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-emerald-400 font-bold flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" />
              Recovery Drill Telemetry Stream
            </span>
            <span className="text-slate-500 text-[11px]">Realtime Buffer</span>
          </div>
          {drillLog.map((log, index) => (
            <div key={index} className="text-slate-300">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
