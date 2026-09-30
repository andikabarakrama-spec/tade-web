import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Crosshair, Cpu, Search, Filter, Lock, Terminal
} from 'lucide-react';
import { guardianMilitaryCommand, MilitaryRegiment } from '../../core/government/GuardianMilitaryCommandEngine';

export const CommanderAssistantNetworkViewer: React.FC = () => {
  const [regiments] = useState<MilitaryRegiment[]>(() => guardianMilitaryCommand.getRegiments());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegimentFilter, setSelectedRegimentFilter] = useState('ALL');

  const allAssistants = regiments.flatMap(r => r.assistants.map(a => ({ ...a, regimentName: r.name, regimentCode: r.regimentCode })));

  const filteredAssistants = allAssistants.filter(ast => {
    const matchSearch = ast.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        ast.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ast.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRegiment = selectedRegimentFilter === 'ALL' || ast.regimentCode === selectedRegimentFilter;
    return matchSearch && matchRegiment;
  });

  return (
    <div id="commander-assistant-network" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-zinc-900 to-rose-950 p-6 rounded-3xl text-white border border-rose-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crosshair className="w-48 h-48 text-rose-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Crosshair className="w-4 h-4" /> R609 &bull; Commander Assistant Network &bull; Ring 0 Specialists
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Jaringan Asisten Komandan Militer Guardian
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Staf asisten taktis komandan yang bersiaga 24/7 mengawasi sesi, sanitasi memori, isolasi cache, pemulihan data (WAL/Snapshot), dan penyegelan forensik digital.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {allAssistants.length} Asisten Komandan Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari asisten komandan, spesialisasi, atau ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedRegimentFilter}
            onChange={(e) => setSelectedRegimentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
          >
            <option value="ALL">Semua Resimen (4)</option>
            {regiments.map(r => (
              <option key={r.id} value={r.regimentCode}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Assistants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssistants.map((ast) => (
          <div key={ast.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 hover:border-rose-500/50 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 mr-2">
                  {ast.id}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Resimen {ast.regimentCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {ast.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                {ast.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {ast.specialization}
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between font-mono">
              <span className="text-slate-500">Mitigasi Ancaman:</span>
              <strong className="text-rose-600 dark:text-rose-400">{ast.mitigationsCount24h} insiden disterilkan</strong>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
              <div className="text-[9px] font-mono text-slate-400 uppercase">Agen Mikro Taktis:</div>
              <div className="flex flex-wrap gap-1">
                {ast.assignedMicroAgents.map((mag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-mono flex items-center gap-1">
                    <Cpu className="w-2.5 h-2.5 text-rose-500" /> {mag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
