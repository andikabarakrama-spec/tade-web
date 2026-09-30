/**
 * TADE PROACTIVE EXECUTIVE SUGGESTIONS WIDGET — SPRINT G12 (P4)
 * Asy & Syifa Smart Executive Recommendation Engine
 * 
 * Aggregates live intelligence from:
 * 1. Dr. Pulse Health & Memory
 * 2. Living Event Engine & School Calendar
 * 3. Cabinet Resolution Task Force
 * 4. PPDB Admission & Family Registration
 * 5. Guardian Ring-0 Access Matrix
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Check,
  X,
  Layers,
  Award,
  Activity,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import {
  smartExecutiveSuggestionEngine,
  ExecutiveSuggestion
} from '../../services/smartExecutiveSuggestionEngine';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface Props {
  onNavigateTab?: (tabId: string) => void;
  onOpenCabinetMeeting?: () => void;
}

export const ProactiveSuggestionsWidget: React.FC<Props> = ({
  onNavigateTab,
  onOpenCabinetMeeting
}) => {
  const [suggestions, setSuggestions] = useState<ExecutiveSuggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const data = smartExecutiveSuggestionEngine.getProactiveSuggestions();
    setSuggestions(data);
  }, []);

  const handleDismiss = (id: string) => {
    smartExecutiveSuggestionEngine.dismissSuggestion(id);
    setSuggestions(smartExecutiveSuggestionEngine.getProactiveSuggestions());
  };

  const handleExecute = (sug: ExecutiveSuggestion) => {
    smartExecutiveSuggestionEngine.markCompleted(sug.id);
    setSuggestions(smartExecutiveSuggestionEngine.getProactiveSuggestions());

    blackBoxRecorder.record({
      ring: 'RING_0',
      moduleCode: 'FOUNDER-SUGGESTION',
      role: 'SUPER_ADMIN',
      actorName: 'Founder Andika',
      category: 'FOUNDER_COMMAND',
      eventType: 'ACTION',
      details: `Rekomendasi proaktif dieksekusi: "${sug.title}" -> ${sug.targetModuleTab}`,
      severity: 'INFO',
      route: sug.targetModuleTab
    });

    if (sug.targetModuleTab === 'CABINET_MEETING_TRIGGER') {
      if (onOpenCabinetMeeting) onOpenCabinetMeeting();
    } else if (onNavigateTab) {
      onNavigateTab(sug.targetModuleTab);
    }
  };

  const filtered = selectedCategory === 'ALL'
    ? suggestions
    : suggestions.filter(s => s.category === selectedCategory);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'DrPulse': return Activity;
      case 'LivingEvents': return Calendar;
      case 'CabinetResolutions': return Award;
      case 'GuardianShield': return ShieldCheck;
      default: return Sparkles;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-stone-100 text-stone-900 border-stone-300';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              SMART SUGGESTIONS (P4)
            </span>
            <span className="text-xs text-stone-400 font-medium">
              {suggestions.length} Rekomendasi Siap Tindak
            </span>
          </div>
          <h3 className="text-lg font-black text-stone-900">
            Rekomendasi Proaktif Asy & Syifa
          </h3>
          <p className="text-xs text-stone-500">
            Analisis otonom terhadap kondisi operasional, agenda kalender, dan stabilitas server.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1">
          {['ALL', 'OPERASIONAL', 'PPDB', 'KEAMANAN', 'KESEHATAN_SISTEM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat === 'ALL' ? 'Semua' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-black text-stone-900">Semua Rekomendasi Terlaksana!</p>
            <p className="text-[11px] text-stone-500">
              Asy & Syifa tidak mendeteksi antrian mendesak saat ini. Sistem dalam kondisi prima.
            </p>
          </div>
        ) : (
          filtered.map((sug) => {
            const SourceIcon = getSourceIcon(sug.sourceEngine);
            return (
              <div
                key={sug.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition-all duration-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-emerald-700 flex items-center justify-center shadow-2xs shrink-0">
                      <SourceIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-900">
                        {sug.title}
                      </h4>
                      <span className="text-[10px] text-stone-500 font-medium">
                        Sumber: {sug.sourceEngine} • Estimasi: {sug.estimatedImpact}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${getPriorityBadge(sug.priority)}`}>
                      {sug.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-stone-200/80 text-stone-700">
                      {sug.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {sug.description}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                  <button
                    onClick={() => handleDismiss(sug.id)}
                    className="text-[11px] font-semibold text-stone-400 hover:text-stone-700 transition cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Abaikan</span>
                  </button>

                  <button
                    onClick={() => handleExecute(sug)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>{sug.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
