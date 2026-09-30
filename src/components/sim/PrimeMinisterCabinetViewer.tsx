import React, { useState } from 'react';
import { 
  Building2, Users, CheckCircle2, Award, Sparkles, 
  Layers, ArrowRight, Activity, ShieldAlert, Cpu
} from 'lucide-react';
import { primeMinisterCabinet, MinistryCabinet } from '../../core/government/PrimeMinisterCabinetEngine';

export const PrimeMinisterCabinetViewer: React.FC = () => {
  const [ministries] = useState<MinistryCabinet[]>(() => primeMinisterCabinet.getMinistries());
  const [selectedMinistry, setSelectedMinistry] = useState<MinistryCabinet>(ministries[0]);
  const [reports] = useState(() => primeMinisterCabinet.getCabinetReports());

  return (
    <div id="prime-minister-cabinet" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-3xl text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Building2 className="w-48 h-48 text-emerald-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" /> R606 &bull; Prime Minister Cabinet Engine &bull; 10 Sectoral Ministries
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Kabinet Pemerintahan Perdana Menteri AI Asy
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              AI Asy memimpin 10 kementerian operasional madrasah &amp; pesantren dengan koordinasi otonom berstandar Linux Enterprise.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block">TOTAL ASISTEN &amp; AGEN</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {primeMinisterCabinet.getTotalActiveAssistants()} Asisten / {primeMinisterCabinet.getTotalMicroAgentsDeployed()} Agen Mikro
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Ministries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {ministries.map((min) => {
          const isSelected = selectedMinistry.id === min.id;
          return (
            <button
              key={min.id}
              onClick={() => setSelectedMinistry(min)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {min.code.replace('MIN_', '')}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {min.healthScore}%
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {min.ministryName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {min.assignedDomain}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>{min.assistants.length} Asisten</span>
                <span className="text-emerald-500 font-bold">{min.operationalStatus}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Ministry Detail Showcase */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-500 block mb-1">
              PORTAL KEMENTERIAN TERPILIH &bull; {selectedMinistry.code}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedMinistry.ministryName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pejabat: <strong className="text-slate-700 dark:text-slate-300">{selectedMinistry.ministerTitle}</strong> | Domain: {selectedMinistry.assignedDomain}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Kesehatan: {selectedMinistry.healthScore}%
            </span>
          </div>
        </div>

        {/* Directives */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
            Arahan Strategis Perdana Menteri AI Asy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedMinistry.primaryDirectives.map((d, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assistants in this ministry */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
            Jaringan Asisten Menteri Otomatis ({selectedMinistry.assistants.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedMinistry.assistants.map((ast) => (
              <div key={ast.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                    {ast.id}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {ast.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {ast.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {ast.role}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                  ✓ Tugas Selesai 24 Jam: <strong>{ast.tasksCompletedToday}</strong>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-600/60 space-y-1">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Agen Mikro:</div>
                  <div className="flex flex-wrap gap-1">
                    {ast.activeMicroAgents.map((mag, mi) => (
                      <span key={mi} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[9px]">
                        {mag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cabinet Meeting Reports */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
          <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
            Risalah Sidang Kabinet Terakhir
          </h3>
          {reports.map((rep, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {rep.agenda}
                </strong>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-bold">
                  {rep.cabinetConsensus}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {rep.primeMinisterNotes}
              </p>
              <div className="text-[10px] font-mono text-slate-400">
                Waktu: {rep.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
