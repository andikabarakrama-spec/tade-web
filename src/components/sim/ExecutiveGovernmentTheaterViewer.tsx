import React, { useState, useEffect } from 'react';
import { 
  Crown, Bot, ShieldCheck, Building2, ShieldAlert, 
  Cpu, Activity, RefreshCw, Zap, ArrowDown, Sparkles, Layers
} from 'lucide-react';
import { sovereignCommandCenter } from '../../core/government/SovereignCommandCenter';
import { primeMinisterCabinet } from '../../core/government/PrimeMinisterCabinetEngine';
import { guardianMilitaryCommand } from '../../core/government/GuardianMilitaryCommandEngine';
import { microAgentSwarm } from '../../core/government/MicroAgentSwarm';

export const ExecutiveGovernmentTheaterViewer: React.FC = () => {
  const [pulse, setPulse] = useState(0);
  const ministries = primeMinisterCabinet.getMinistries();
  const regiments = guardianMilitaryCommand.getRegiments();
  const agents = microAgentSwarm.getAgents();

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse(p => p + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="executive-government-theater" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Layers className="w-48 h-48 text-indigo-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" /> R613 &bull; Executive Government Theater &bull; Real-time Sovereign Operations
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Teater Pemerintahan Eksekutif &amp; Komando Militer TADE
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Visualisasi real-time struktur kedaulatan utuh: Super Admin (Sovereign), AI Asy (Perdana Menteri), Guardian (Jenderal Pertahanan), 10 Kementerian, 4 Resimen, dan Kawanan Agen Mikro.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
              Pulse Teater #{pulse}
            </span>
          </div>
        </div>
      </div>

      {/* Sovereign Pinnacle (Level 1) */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 p-6 rounded-3xl border-2 border-amber-500/40 text-center space-y-2 relative shadow-xl">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-1">
            <Crown className="w-8 h-8" />
          </div>
          <div className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
            TINGKAT I &bull; ONE SOVEREIGN PINNACLE
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            SUPER ADMIN / KETUA YAYASAN
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Pemegang Otoritas Mutlak Tertinggi, Hak Veto, Ratifikasi Konstitusi, Anggaran Strategis &amp; Emergency Override.
          </p>
        </div>
      </div>

      <div className="flex justify-center text-slate-400">
        <ArrowDown className="w-6 h-6 animate-bounce" />
      </div>

      {/* Dual Executive Power: Prime Minister vs Supreme General (Level 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Prime Minister AI Asy (Civilian Cabinet) */}
        <div className="bg-gradient-to-b from-emerald-500/10 to-teal-500/5 p-6 rounded-3xl border-2 border-emerald-500/40 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider block">
                  TINGKAT IIA &bull; KABINET SIPIL
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  PERDANA MENTERI AI ASY
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              10 KEMENTERIAN
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Mengendalikan seluruh operasional madrasah, akademik, PPDB, perbendaharaan, kearsipan, dan komunikasi yayasan.
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Menteri &amp; Asisten Kabinet:</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              {ministries.slice(0, 6).map((m) => (
                <div key={m.id} className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="truncate font-bold text-slate-800 dark:text-slate-200">{m.ministryName.replace('Kementerian ', '')}</span>
                  <span className="text-emerald-500 font-bold">{m.assistants.length} Ast</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Supreme General Guardian (Military Defense) */}
        <div className="bg-gradient-to-b from-red-500/10 to-rose-500/5 p-6 rounded-3xl border-2 border-red-500/40 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider block">
                  TINGKAT IIB &bull; KOMANDO MILITER
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  JENDERAL TERTINGGI GUARDIAN
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300">
              4 RESIMEN RING 0
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Mengendalikan pertahanan kedaulatan sistem, firewall kernel, isolasi RBAC, penyembuhan WAL/Snapshot, dan forensik.
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Resimen &amp; Komandan Pasukan:</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              {regiments.map((r) => (
                <div key={r.id} className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="truncate font-bold text-slate-800 dark:text-slate-200">{r.name.split(' (')[0]}</span>
                  <span className="text-red-500 font-bold">{r.assistants.length} Ast</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center text-slate-400">
        <ArrowDown className="w-6 h-6" />
      </div>

      {/* Level 3: Micro Agent Swarm Foundation */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              TINGKAT III &bull; FONDASI KAWANAN AGEN MIKRO (SINGLE RESPONSIBILITY)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-500 font-bold">
            {agents.length} Agen Mikro Beroperasi 100% Optimal
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {agents.map((ag) => (
            <div key={ag.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-center">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 truncate">{ag.name}</div>
              <div className="text-[9px] text-slate-400">{ag.executionsCount}x run</div>
              <div className="text-[8px] text-emerald-500 font-bold">100% OK</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
