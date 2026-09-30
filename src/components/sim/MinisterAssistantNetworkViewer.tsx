import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Bot, Sparkles, Filter, Search, ArrowUpRight, Cpu
} from 'lucide-react';
import { primeMinisterCabinet, MinistryCabinet } from '../../core/government/PrimeMinisterCabinetEngine';

export const MinisterAssistantNetworkViewer: React.FC = () => {
  const [ministries] = useState<MinistryCabinet[]>(() => primeMinisterCabinet.getMinistries());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMinistryFilter, setSelectedMinistryFilter] = useState('ALL');

  const allAssistants = ministries.flatMap(m => m.assistants.map(a => ({ ...a, ministryName: m.ministryName, ministryCode: m.code })));

  const filteredAssistants = allAssistants.filter(ast => {
    const matchSearch = ast.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        ast.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ast.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMinistry = selectedMinistryFilter === 'ALL' || ast.ministryCode === selectedMinistryFilter;
    return matchSearch && matchMinistry;
  });

  return (
    <div id="minister-assistant-network" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-cyan-950 p-6 rounded-3xl text-white border border-teal-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="w-48 h-48 text-teal-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4" /> R607 &bull; Minister Assistant Network &bull; Autonomous Hierarchy
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Jaringan Asisten Menteri Terdistribusi
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Hierarki asisten menteri yang mengeksekusi tugas operasional harian madrasah secara otonom tanpa membebani intervensi manusia.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              {allAssistants.length} Asisten Aktif Beroperasi
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
            placeholder="Cari asisten menteri, spesialisasi, atau ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedMinistryFilter}
            onChange={(e) => setSelectedMinistryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
          >
            <option value="ALL">Semua Kementerian (10)</option>
            {ministries.map(m => (
              <option key={m.id} value={m.code}>{m.ministryName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Assistants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssistants.map((ast) => (
          <div key={ast.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 hover:border-teal-500/50 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 mr-2">
                  {ast.id}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {ast.ministryCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {ast.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {ast.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {ast.role}
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between font-mono">
              <span className="text-slate-500">Tugas 24 Jam:</span>
              <strong className="text-teal-600 dark:text-teal-400">{ast.tasksCompletedToday} eksekusi</strong>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
              <div className="text-[9px] font-mono text-slate-400 uppercase">Agen Mikro Binaan:</div>
              <div className="flex flex-wrap gap-1">
                {ast.activeMicroAgents.map((mag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-mono flex items-center gap-1">
                    <Cpu className="w-2.5 h-2.5 text-teal-500" /> {mag}
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
