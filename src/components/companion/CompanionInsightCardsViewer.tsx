import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Award,
  Archive,
  BarChart3,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { companionInsightEngine } from '../../core/companion/companionInsightEngine';
import { CompanionInsightCard, CompanionRole } from '../../core/companion/companionTypes';

export const CompanionInsightCardsViewer: React.FC = () => {
  const [insights, setInsights] = useState<CompanionInsightCard[]>(
    companionInsightEngine.getAllInsights()
  );
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const refreshList = () => {
    setInsights(companionInsightEngine.getAllInsights());
  };

  const handleAction = (id: string) => {
    companionInsightEngine.markActioned(id);
    refreshList();
  };

  const filtered = selectedRole === 'ALL'
    ? insights
    : insights.filter(i => i.targetRole === selectedRole || i.targetRole === 'UNIVERSAL');

  return (
    <div className="space-y-6" id="companion-insight-cards-view">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl border border-teal-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R757 Proactive Recommendation Cards
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Non-Destructive Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Lightbulb className="w-7 h-7 text-teal-400" />
              Companion Insight Cards
            </h1>
            <p className="text-sm text-teal-200/80 mt-1 max-w-2xl">
              Kartu analisis & wawasan proaktif: mendeteksi anomali operasional, peluang percepatan hafalan santri, serta optimasi kelancaran kas lembaga secara otomatis.
            </p>
          </div>

          <div className="flex gap-2">
            {['ALL', 'EXECUTIVE', 'TEACHER', 'PARENT'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedRole === role
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(card => (
          <div
            key={card.insightId}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              card.status === 'ACTIONED'
                ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                : 'bg-slate-900/90 border-slate-800 hover:border-teal-500/40 shadow-xl'
            }`}
          >
            <div>
              {/* Header metadata */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                  {card.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" /> {card.confidenceScore}% Keyakinan
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base mb-1.5">{card.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{card.summary}</p>

              {/* Metric Callout */}
              {card.metricValue && (
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl mb-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Metrik SSoT:</span>
                  <span className="font-bold font-mono text-teal-300">{card.metricValue}</span>
                </div>
              )}

              {/* Recommendation Quote */}
              <div className="p-3.5 bg-teal-950/30 border border-teal-500/20 rounded-xl mb-4 text-xs text-teal-200 leading-relaxed">
                <span className="font-bold text-teal-300 block mb-1">Rekomendasi Advisory:</span>
                {card.recommendation}
              </div>

              {/* Rationale */}
              <div className="text-[11px] text-slate-500 leading-normal italic mb-4">
                <span className="not-italic font-semibold text-slate-400">Rasional: </span>
                {card.rationale}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">Role: {card.targetRole}</span>
              {card.status !== 'ACTIONED' && card.isActionable && (
                <button
                  onClick={() => handleAction(card.insightId)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tindak Lanjuti
                </button>
              )}
              {card.status === 'ACTIONED' && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Ditindaklanjuti
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
