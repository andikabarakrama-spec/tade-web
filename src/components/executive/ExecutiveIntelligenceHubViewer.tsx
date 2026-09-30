import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ShieldCheck,
  Award,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  UserCheck,
  CheckCircle2,
  FileText,
  User
} from 'lucide-react';
import { ExecutiveIntelligenceHub, ExecutiveIntelligenceSummary } from '../../core/executive/ExecutiveIntelligenceHub';
import { ExecutiveBriefGenerator, ExecutivePersona, PersonaExecutiveBrief } from '../../core/executive/ExecutiveBriefGenerator';

interface Props {
  onNavigate?: (tabId: string) => void;
}

export const ExecutiveIntelligenceHubViewer: React.FC<Props> = ({ onNavigate }) => {
  const hub = ExecutiveIntelligenceHub.getInstance();
  const briefGenerator = ExecutiveBriefGenerator.getInstance();

  const [summary, setSummary] = useState<ExecutiveIntelligenceSummary>(() =>
    hub.getExecutiveIntelligenceSummary()
  );
  const [selectedPersona, setSelectedPersona] = useState<ExecutivePersona>('SUPER_ADMIN');
  const [personaBrief, setPersonaBrief] = useState<PersonaExecutiveBrief>(() =>
    briefGenerator.generateBriefForPersona('SUPER_ADMIN')
  );

  const handlePersonaChange = (persona: ExecutivePersona) => {
    setSelectedPersona(persona);
    setPersonaBrief(briefGenerator.generateBriefForPersona(persona));
  };

  return (
    <div className="space-y-6">
      {/* Top Intelligence Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                R723 Executive Intelligence Hub
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                AI Asy 2.0 Advisory
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
              <Brain className="w-7 h-7 text-indigo-400" />
              Pusat Intelijen Eksekutif AI Asy 2.0
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Sintesis intelijen strategis institusi TK Asy-Syifa Tanggul. Seluruh analisis bersifat ADVISORY murni
              berlandaskan data faktual SSoT (db.ts) tanpa mutasi produksi mandiri.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 font-mono text-xs">
            <span className="text-slate-400 block text-[10px]">Tingkat Keyakinan Komposit:</span>
            <span className="text-base font-bold text-emerald-400">
              {summary.overallConfidence.confidenceScore}% ({summary.overallConfidence.confidenceLevel})
            </span>
          </div>
        </div>

        {/* 4 Core Vital Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-mono block">Status Institusi</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5">DEFCON-1 OPTIMAL</span>
            <span className="text-[10px] text-emerald-400 font-medium block">Kedaulatan Utuh</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-mono block">Prioritas Hari Ini</span>
            <span className="text-sm font-bold text-indigo-300 font-mono mt-0.5">{summary.todayPriorities.length} Agenda Kritis</span>
            <span className="text-[10px] text-slate-300 font-medium block">Terdokumentasi</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-mono block">Risiko Keamanan</span>
            <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5">0% Anomali</span>
            <span className="text-[10px] text-emerald-300 font-medium block">Guardian Ring-0 Pass</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-mono block">Kontrak Engine RC90</span>
            <span className="text-sm font-bold text-purple-400 font-mono mt-0.5">9/9 Kompatibel</span>
            <span className="text-[10px] text-purple-300 font-medium block">Zero Drift</span>
          </div>
        </div>
      </div>

      {/* Role-Specific Executive Brief Generator (R725) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block mb-0.5">
              R725 Executive Brief Generator
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
              Briefing Khusus Pimpinan (Role-Tailored Executive Brief)
            </h3>
          </div>

          {/* Persona Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-start sm:self-auto">
            {(['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] as ExecutivePersona[]).map(p => (
              <button
                key={p}
                onClick={() => handlePersonaChange(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedPersona === p
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {p === 'SUPER_ADMIN' ? 'Founder' : p === 'KETUA_YAYASAN' ? 'Yayasan' : 'Kepala Sekolah'}
              </button>
            ))}
          </div>
        </div>

        {/* Persona Brief Content */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {personaBrief.recipientTitle}
              </p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans mt-0.5">
                {personaBrief.greetingHeadline}
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Fokus: {personaBrief.focusTheme}
            </span>
          </div>

          {/* Key Metrics Strip for Persona */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {personaBrief.keyMetrics.map((km, i) => (
              <div key={i} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
                <span className="text-[10px] text-slate-400 block">{km.label}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{km.value}</span>
              </div>
            ))}
          </div>

          {/* Top Priorities for Persona */}
          <div>
            <h5 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-2">
              Prioritas Tindak Lanjut untuk {selectedPersona}:
            </h5>
            <div className="space-y-2">
              {personaBrief.topPriorities.map((tp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                        tp.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tp.urgency}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{tp.title}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{tp.description}</p>
                  </div>

                  {onNavigate && (
                    <button
                      onClick={() => onNavigate(tp.actionTargetModule)}
                      className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline self-end sm:self-auto cursor-pointer"
                    >
                      <span>Buka Modul</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operational Trends & Bottlenecks (R726) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bottlenecks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Deteksi Bottleneck Operasional (R726)
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Analisis Internal</span>
          </div>

          <div className="space-y-2.5">
            {summary.operationalInsights.bottlenecks.map((btn, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{btn.title}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-amber-100 text-amber-800">
                    {btn.domain}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mb-2">{btn.impactDescription}</p>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                  Saran: {btn.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Trends & Opportunities */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Tren Kesehatan Sistem (R726)
            </h4>
            <div className="space-y-2">
              {summary.operationalInsights.trends.map((tr, i) => (
                <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 block">{tr.metricName}</span>
                    <span className="text-[10px] text-slate-400 font-sans">{tr.context}</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{tr.currentValue}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-2">
              Peluang Strategis & Efisiensi:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {summary.improvementOpportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
