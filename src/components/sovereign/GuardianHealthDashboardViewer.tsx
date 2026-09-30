import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  HardDrive, 
  GitMerge, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Layers
} from 'lucide-react';
import { GuardianHealthDashboard, GuardianHealthSnapshot, HealthPillar } from '../../core/sovereign/guardianHealthDashboard';

export const GuardianHealthDashboardViewer: React.FC = () => {
  const healthService = GuardianHealthDashboard.getInstance();
  const [snapshot, setSnapshot] = useState<GuardianHealthSnapshot>(() => healthService.getSnapshot());
  const [selectedPillar, setSelectedPillar] = useState<HealthPillar | null>(snapshot.pillars[0] || null);

  const handleRefresh = () => {
    setSnapshot(healthService.getSnapshot());
  };

  return (
    <div className="space-y-6" id="guardian-health-dashboard-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Health Telemetry
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R767 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Guardian Health Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Observabilitas kesehatan terintegrasi mengukur 6 pilar kedaulatan: Keamanan Ring-0, Kesiapan Recovery, Kesehatan Sinkronisasi, Integritas RBAC, Keamanan Companion, dan Antrean Offline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Composite Health</span>
              <span className="text-xl font-black text-emerald-400">{snapshot.overallScore}%</span>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Metrik</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Health Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snapshot.pillars.map(p => {
          const isSelected = selectedPillar?.pillarId === p.pillarId;
          return (
            <div
              key={p.pillarId}
              onClick={() => setSelectedPillar(p)}
              className={`p-5 rounded-2xl border transition shadow-lg cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/30' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-slate-400">{p.pillarId}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                  {p.score}% &bull; {p.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                {p.metrics.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="font-mono font-bold text-white">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
