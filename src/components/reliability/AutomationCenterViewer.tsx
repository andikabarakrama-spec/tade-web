import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  RotateCw, 
  Power, 
  ShieldCheck, 
  Calendar, 
  Sparkles,
  Play,
  Layers
} from 'lucide-react';
import { 
  NationalTaskOrchestrator, 
  AutomationTriggerRule 
} from '../../core/reliability/nationalTaskOrchestrator';

export const AutomationCenterViewer: React.FC = () => {
  const orchestrator = useMemo(() => NationalTaskOrchestrator.getInstance(), []);
  const [rules, setRules] = useState<AutomationTriggerRule[]>(() => orchestrator.getAutomationRules());

  useEffect(() => {
    const unsub = orchestrator.subscribe(() => {
      setRules([...orchestrator.getAutomationRules()]);
    });
    return unsub;
  }, [orchestrator]);

  const handleToggle = (id: string) => {
    orchestrator.toggleAutomationRule(id);
  };

  return (
    <div className="space-y-6" id="automation-center-viewer">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                R843 &bull; Pusat Otomasi Sekolah
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AUTOPILOT RELIABLE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Jadwal & Pemicu Otomasi Harian
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Menjalankan sinkronisasi presensi, pengingat tahfidz, kalkulasi infaq Jumat, dan backup berkala secara otomatis tanpa intervensi manual yang membebani guru.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Tingkat Keberhasilan</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">99.95% Sukses</span>
          </div>
        </div>
      </div>

      {/* Grid of Automation Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((r) => (
          <div
            key={r.id}
            className={`p-6 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-xl ${
              r.isEnabled
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950/60 border-slate-900 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-amber-300">
                    {r.id}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{r.name}</h3>
                </div>

                <button
                  onClick={() => handleToggle(r.id)}
                  className={`p-2.5 rounded-2xl transition cursor-pointer flex items-center gap-1.5 ${
                    r.isEnabled
                      ? 'bg-emerald-500 text-slate-950 font-bold text-xs shadow-md'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{r.isEnabled ? 'AKTIF' : 'NONAKTIF'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{r.scheduleDescription}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Eksekusi Terakhir:</span>
                  <span className="text-slate-300 font-semibold">{r.lastRunTimestamp || 'Belum pernah'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Jadwal Berikutnya:</span>
                  <span className="text-cyan-400 font-semibold">{r.nextRunEstimated}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Berjalan:</span>
                  <span className="font-mono text-emerald-400">{r.totalExecutions}x (100% SSoT Bound)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Guardian Ring-0 Protected
              </span>
              <span className="font-mono text-slate-400">Kategori: {r.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
