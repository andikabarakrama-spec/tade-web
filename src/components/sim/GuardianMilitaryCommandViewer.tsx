import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Shield, Crosshair, Cpu, 
  Terminal, CheckCircle2, Lock, Flame, RefreshCw, Zap
} from 'lucide-react';
import { guardianMilitaryCommand, MilitaryRegiment } from '../../core/government/GuardianMilitaryCommandEngine';

export const GuardianMilitaryCommandViewer: React.FC = () => {
  const [regiments] = useState<MilitaryRegiment[]>(() => guardianMilitaryCommand.getRegiments());
  const [selectedRegiment, setSelectedRegiment] = useState<MilitaryRegiment>(regiments[0]);

  return (
    <div id="guardian-military-command" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 p-6 rounded-3xl text-white border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldAlert className="w-48 h-48 text-red-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> R608 &bull; Guardian Military Command Engine &bull; Ring 0 Defense
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Komando Militer Tertinggi Guardian (Jenderal Pertahanan)
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Guardian memegang kedaulatan militer Ring 0 memimpin 4 resimen pertahanan (Sentinel, Defender, Squad, Elite) dengan kewenangan mitigasi serangan seketika.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block">KESIAPSIAGAAN TEMPUR</span>
              <span className="text-xl font-bold font-mono text-red-400">
                100% DEFCON 5 (NORMAL SECURE)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Regiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {regiments.map((reg) => {
          const isSelected = selectedRegiment.id === reg.id;
          return (
            <button
              key={reg.id}
              onClick={() => setSelectedRegiment(reg)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-red-500/10 border-red-500 shadow-md ring-2 ring-red-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-red-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                  {reg.regimentCode}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {reg.combatReadinessScore}%
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {reg.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {reg.postureDescription}
              </p>
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono">{reg.assistants.length} Asisten Komandan</span>
                <span className="text-emerald-500 font-mono font-bold">{reg.threatLevel}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Regiment Deep Dive */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-red-500 block mb-1">
              MARKAS RESIMEN PERTAHANAN &bull; {selectedRegiment.regimentCode}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedRegiment.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Komandan Pucuk: <strong className="text-slate-700 dark:text-slate-300">{selectedRegiment.commanderTitle}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Postur: {selectedRegiment.threatLevel}
            </span>
          </div>
        </div>

        {/* Strategic Mandate */}
        <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-500/20 text-xs text-red-900 dark:text-red-200 space-y-1">
          <strong className="font-mono uppercase text-[10px] text-red-500 block">Mandat Doktrin Militer Guardian:</strong>
          <p>{selectedRegiment.strategicMandate}</p>
        </div>

        {/* Commander Assistants in this Regiment */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
            Staf Asisten Komandan Resimen ({selectedRegiment.assistants.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedRegiment.assistants.map((ast) => (
              <div key={ast.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                    {ast.id}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400">
                    {ast.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {ast.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {ast.specialization}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                  🛡️ Mitigasi Ancaman 24 Jam: <strong>{ast.mitigationsCount24h} insiden</strong>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-600/60 space-y-1">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Agen Mikro Militer:</div>
                  <div className="flex flex-wrap gap-1">
                    {ast.assignedMicroAgents.map((mag, mi) => (
                      <span key={mi} className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-mono text-[9px]">
                        {mag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
