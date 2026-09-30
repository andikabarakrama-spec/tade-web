import React, { useMemo, useState } from 'react';
import { 
  HardDrive, 
  FileText, 
  GitMerge, 
  PlayCircle, 
  Smartphone, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  Lock, 
  Activity,
  Sparkles
} from 'lucide-react';
import { DigitalGovernmentCore, DigitalMinistry } from '../../core/living/digitalGovernmentCore';

export const HermesCabinetViewer: React.FC = () => {
  const govCore = useMemo(() => DigitalGovernmentCore.getInstance(), []);
  const hermesGov = useMemo(() => govCore.getGovernment('HERMES_PEMULIHAN'), [govCore]);
  const [selectedMinistry, setSelectedMinistry] = useState<DigitalMinistry>(() => hermesGov.ministries[0]);

  const getMinistryIcon = (code: string) => {
    switch (code) {
      case 'KEMEN-KONTINUITAS': return FileText;
      case 'KEMEN-REKONSILIASI': return GitMerge;
      case 'KEMEN-SNAPSHOT': return HardDrive;
      case 'KEMEN-DRYRUN': return PlayCircle;
      case 'KEMEN-ADAPTASI': return Smartphone;
      case 'KEMEN-PULIH': return RotateCcw;
      default: return HardDrive;
    }
  };

  return (
    <div className="space-y-6" id="hermes-cabinet-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                Kabinet Pemulihan Hermes (RC87 Bridge)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R825 &bull; RC100
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              6 Kementerian Kesinambungan & Rekonsiliasi SSoT
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memastikan tugas pengisian data guru tetap tersimpan aman saat sinyal drop atau tab browser tertutup. Berjalan dalam mode DORMANT_SAFE non-destruktif.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Status Engine Hermes</span>
            <span className="text-lg font-black text-sky-400">DORMANT_SAFE (RC87 LINKED)</span>
          </div>
        </div>
      </div>

      {/* Grid: Ministry Selector & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ministry List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" />
            Kementerian Pemulihan ({hermesGov.ministries.length})
          </h3>

          <div className="space-y-2">
            {hermesGov.ministries.map((min) => {
              const Icon = getMinistryIcon(min.code);
              const isSelected = selectedMinistry.id === min.id;
              return (
                <div
                  key={min.id}
                  onClick={() => setSelectedMinistry(min)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500/60 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-sky-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate">{min.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{min.ministerName}</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded-md text-sky-400 border border-slate-800 shrink-0">
                    {min.civilServants.length} Petugas
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Ministry Inspector */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-sky-400 block">{selectedMinistry.code}</span>
                <h2 className="text-lg font-bold text-white">{selectedMinistry.name}</h2>
                <span className="text-xs text-slate-400">Pimpinan: {selectedMinistry.ministerName}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {selectedMinistry.healthScore}% DORMANT_SAFE
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Mandat Pemulihan & Kontinuitas:</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {selectedMinistry.mandateDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Status SSoT Alignment</span>
                <span className="font-bold text-sky-400 mt-0.5 block">{selectedMinistry.statusText}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Direktorat Teknis</span>
                <span className="font-bold text-white mt-0.5 block">{selectedMinistry.directoratesCount} Direktorat</span>
              </div>
            </div>

            {/* Petugas Pemulihan Digital */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-400" />
                Petugas Rekonsiliasi & Snapshot ({selectedMinistry.civilServants.length} Petugas)
              </h4>

              <div className="space-y-2">
                {selectedMinistry.civilServants.map((cs) => (
                  <div
                    key={cs.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{cs.name}</span>
                      <span className="text-[10px] text-slate-400">{cs.roleTitle} &bull; {cs.specialization}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 block">
                        {cs.status}
                      </span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{cs.activeTasks} Antrean</span>
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
