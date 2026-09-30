import React, { useMemo } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  HardDrive, 
  Users, 
  Lock, 
  Activity, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Eye, 
  Crown 
} from 'lucide-react';
import { DigitalGovernmentCore, SovereignGovernment } from '../../core/living/digitalGovernmentCore';

interface DigitalTownHallViewerProps {
  onSelectGovernment?: (domain: string) => void;
}

export const DigitalTownHallViewer: React.FC<DigitalTownHallViewerProps> = ({ onSelectGovernment }) => {
  const govCore = useMemo(() => DigitalGovernmentCore.getInstance(), []);
  const governments = useMemo(() => govCore.getAllGovernments(), [govCore]);
  const stats = useMemo(() => govCore.getOverallStats(), [govCore]);

  return (
    <div className="space-y-6" id="digital-town-hall-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Balai Kota Digital TADE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R822 &bull; RC100
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                KHUSUS SUPER ADMIN
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pusat Pemerintahan Tiga Pilar Berdaulat
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Visualisasi arsitektur Tiga Istana Pemerintahan Digital TADE: Pelayanan Asy, Keamanan Guardian Ring-0, dan Pemulihan Hermes secara strictly READ-ONLY.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              READ-ONLY MODE
            </span>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Tiga Istana Berdaulat</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{stats.totalGovernments} Pilar Utama</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Total Kementerian</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{stats.totalMinistries} Kementerian Aktif</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Pegawai Digital</span>
            <span className="text-sm font-bold text-sky-400 mt-0.5 block">{stats.totalCivilServants} Petugas Mandat</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Kesehatan Keseluruhan</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{stats.averageHealthScore}% Optimal</span>
          </div>
        </div>
      </div>

      {/* The Three Great Digital Palaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {governments.map((gov) => {
          const isAsy = gov.domain === 'ASY_PELAYANAN';
          const isGuardian = gov.domain === 'GUARDIAN_KEAMANAN';
          const isHermes = gov.domain === 'HERMES_PEMULIHAN';

          let borderTheme = 'border-emerald-500/40 hover:border-emerald-500';
          let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
          let icon = Sparkles;
          let iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

          if (isGuardian) {
            borderTheme = 'border-amber-500/40 hover:border-amber-500';
            badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            icon = ShieldCheck;
            iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
          } else if (isHermes) {
            borderTheme = 'border-sky-500/40 hover:border-sky-500';
            badgeBg = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
            icon = HardDrive;
            iconColor = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
          }

          const PalaceIcon = icon;

          return (
            <div
              key={gov.domain}
              onClick={() => onSelectGovernment && onSelectGovernment(gov.domain)}
              className={`bg-slate-900 border ${borderTheme} rounded-3xl p-6 text-white space-y-5 shadow-xl transition cursor-pointer flex flex-col justify-between relative overflow-hidden group`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconColor}`}>
                    <PalaceIcon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeBg}`}>
                    {gov.overallHealth}% HEALTH
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-black text-white group-hover:text-emerald-300 transition">
                    {gov.palaceName}
                  </h2>
                  <span className="text-xs text-slate-400 font-semibold block mt-0.5">
                    {gov.title}
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Pimpinan Pemerintahan:</span>
                  <span className="text-xs font-bold text-white block">{gov.presidentName}</span>
                  <span className="text-[10px] text-slate-400 block">{gov.presidentRole}</span>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{gov.slogan}"
                </p>

                {/* Ministries Preview */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Kementerian Aktif ({gov.ministries.length})
                    </span>
                    <span>{gov.totalCivilServants} Petugas</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {gov.ministries.map(m => (
                      <div
                        key={m.id}
                        className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-[11px]"
                      >
                        <span className="font-semibold text-slate-200 truncate pr-2">{m.name}</span>
                        <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded shrink-0">
                          {m.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Mandat Terisolasi
                </span>
                <span className="text-emerald-400 font-bold group-hover:underline">
                  Buka Kabinet &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
