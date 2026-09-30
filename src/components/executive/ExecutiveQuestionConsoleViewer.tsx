import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity
} from 'lucide-react';
import { ExecutiveQuestionEngine, QuestionAnswerResult, PredefinedQuestion } from '../../core/executive/ExecutiveQuestionEngine';

interface Props {
  onNavigate?: (tabId: string) => void;
}

export const ExecutiveQuestionConsoleViewer: React.FC<Props> = ({ onNavigate }) => {
  const questionEngine = ExecutiveQuestionEngine.getInstance();
  const predefined = questionEngine.getPredefinedQuestions();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [activeResult, setActiveResult] = useState<QuestionAnswerResult>(() =>
    questionEngine.answerQuestion(predefined[0].questionText)
  );
  const [isAnswering, setIsAnswering] = useState(false);

  const handleAskQuestion = (qText: string) => {
    if (!qText.trim()) return;
    setIsAnswering(true);
    setInputQuery(qText);
    setTimeout(() => {
      setActiveResult(questionEngine.answerQuestion(qText));
      setIsAnswering(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            R727 Executive Question Console
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
            Internal Data Grounding
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
          <MessageSquare className="w-7 h-7 text-indigo-400" />
          Konsol Tanya-Jawab Eksekutif AI Asy
        </h2>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          Tanyakan status operasional, risiko kritis, antrean mendesak, atau kontrak arsitektur.
          Seluruh jawaban digenerasi secara deterministik 100% dari basis data SSoT dan audit internal institusi.
        </p>

        {/* Input Box */}
        <div className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ketik pertanyaan untuk AI Asy (contoh: Apa risiko terbesar hari ini?)"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(inputQuery)}
              className="w-full pl-4 pr-10 py-3 text-xs md:text-sm bg-slate-800/90 border border-slate-600 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <button
            onClick={() => handleAskQuestion(inputQuery)}
            disabled={isAnswering || !inputQuery.trim()}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-2xl text-xs md:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Tanyakan</span>
          </button>
        </div>

        {/* Quick Query Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/60">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 self-center">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Contoh Pertanyaan:
          </span>
          {predefined.map((p) => (
            <button
              key={p.id}
              onClick={() => handleAskQuestion(p.questionText)}
              className="px-3 py-1 bg-slate-800/70 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl text-xs text-slate-200 transition-all font-mono cursor-pointer"
            >
              {p.badge}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Output Card */}
      {activeResult && (
        <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 p-6 rounded-3xl shadow-lg space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                Hasil Analisis Pertanyaan
              </span>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-mono">
                "{activeResult.query}"
              </h3>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Keyakinan: {activeResult.confidence.confidenceScore}% ({activeResult.confidence.confidenceLevel})
              </span>
            </div>
          </div>

          {/* Headline Banner */}
          <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200 font-mono">
              {activeResult.answerHeadline}
            </p>
          </div>

          {/* Key Data Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeResult.keyDataPoints.map((dp, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 font-mono">
                <span className="text-[10px] text-slate-400 block">{dp.label}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{dp.value}</span>
              </div>
            ))}
          </div>

          {/* Detailed Bullet Points */}
          <div>
            <h4 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-2">
              Rincian Analisis Internal:
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {activeResult.detailedAnalysis.map((da, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{da}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Recommendation & Action Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Rekomendasi Tindakan
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {activeResult.actionRecommendation}
              </p>
            </div>

            {activeResult.directActionTarget && onNavigate && (
              <button
                onClick={() => onNavigate(activeResult.directActionTarget!)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-all shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
              >
                <span>Buka Modul</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
