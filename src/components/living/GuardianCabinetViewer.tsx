import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  FileCheck2, 
  Crosshair, 
  Activity, 
  AlertTriangle, 
  Layers, 
  Users, 
  EyeOff, 
  Cpu, 
  CheckCircle2,
  Shield
} from 'lucide-react';
import { DigitalGovernmentCore, DigitalMinistry } from '../../core/living/digitalGovernmentCore';

export const GuardianCabinetViewer: React.FC = () => {
  const govCore = useMemo(() => DigitalGovernmentCore.getInstance(), []);
  const guardianGov = useMemo(() => govCore.getGovernment('GUARDIAN_KEAMANAN'), [govCore]);
  const troops = useMemo(() => govCore.getGuardianTroops(), [govCore]);
  const [selectedMinistry, setSelectedMinistry] = useState<DigitalMinistry>(() => guardianGov.ministries[0]);

  const getMinistryIcon = (code: string) => {
    switch (code) {
      case 'KEMEN-RING0': return Shield;
      case 'KEMEN-RBAC': return Lock;
      case 'KEMEN-AUDIT': return FileCheck2;
      case 'KEMEN-ANCAMAN': return Crosshair;
      case 'KEMEN-PANTAU': return Activity;
      case 'KEMEN-DARURAT': return AlertTriangle;
      case 'KEMEN-FIREWALL': return ShieldAlert;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="space-y-6" id="guardian-cabinet-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Kabinet Pertahanan Guardian Ring-0
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R824 &bull; RC100
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              7 Kementerian Kedaulatan & Keamanan Data
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Benteng otoritas tertinggi yang menjaga konstitusi platform, otentikasi RBAC 6-role, jurnal audit permanen SHA-256, firewall perimeter, dan pasukan sentinel di balik layar.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Integritas Keamanan</span>
            <span className="text-lg font-black text-amber-400">100.0% RING-0 LOCKED</span>
          </div>
        </div>
      </div>

      {/* Grid: Ministry Selector & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ministry List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            Kementerian Keamanan ({guardianGov.ministries.length})
          </h3>

          <div className="space-y-2">
            {guardianGov.ministries.map((min) => {
              const Icon = getMinistryIcon(min.code);
              const isSelected = selectedMinistry.id === min.id;
              return (
                <div
                  key={min.id}
                  onClick={() => setSelectedMinistry(min)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate">{min.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{min.ministerName}</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded-md text-amber-400 border border-slate-800 shrink-0">
                    {min.civilServants.length} Sentinel
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Ministry Inspector & Troops View */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-amber-400 block">{selectedMinistry.code}</span>
                <h2 className="text-lg font-bold text-white">{selectedMinistry.name}</h2>
                <span className="text-xs text-slate-400">Pimpinan: {selectedMinistry.ministerName}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {selectedMinistry.healthScore}% ENFORCED
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Mandat Keamanan & Konstitusi:</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {selectedMinistry.mandateDescription}
              </p>
            </div>

            {/* Pasukan Guardian Sentinel (Bekerja di Belakang Layar) */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  Pasukan Guardian Sentinel (Operasi Senyap di Belakang Layar)
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono">STEALTH AKTIF</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {troops.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{unit.unitName}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {unit.readinessLevel}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">{unit.battalion}</span>
                    <p className="text-[11px] text-slate-300 leading-snug">{unit.mandate}</p>
                    <div className="pt-2 border-t border-slate-900 flex justify-between text-[9px] text-slate-400">
                      <span>Perisai: <strong className="text-emerald-400">{unit.shieldIntegrityPercent}%</strong></span>
                      <span>Mode: Senyap</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
