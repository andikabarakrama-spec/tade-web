import React, { useState } from 'react';
import { TwoWayIntelligenceEngine, DialogueResponse } from '../../core/intelligence/TwoWayIntelligenceEngine';
import { Sparkles, Send, CheckCircle2, FileText, Compass, AlertCircle } from 'lucide-react';

export const TwoWayDialogueViewer: React.FC = () => {
  const engine = TwoWayIntelligenceEngine.getInstance();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<DialogueResponse[]>([
    engine.answerQuery('Asy, apa perkembangan AI minggu ini?')
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    const userQ = query;
    setQuery('');

    setTimeout(() => {
      const response = engine.answerQuery(userQ);
      setHistory(prev => [response, ...prev]);
      setIsProcessing(false);
    }, 400);
  };

  const samplePrompts = [
    'Asy, apa perkembangan AI minggu ini?',
    'Asy, cari teknologi gratis untuk administrasi sekolah.',
    'Asy, carikan alternatif Hermes gratis.',
    'Asy, jelaskan regulasi UU PDP untuk TADE.'
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Query Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Dialog Dua Arah AI Asy (Fact &bull; Analysis &bull; Recommendation)
          </h4>
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tanyakan analisis, teknologi gratis, atau regulasi (cth: 'Asy, cari teknologi gratis...')"
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
          <button
            type="submit"
            disabled={isProcessing || !query.trim()}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{isProcessing ? 'Menganalisis...' : 'Tanya Asy'}</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-slate-400 py-1 mr-1">Saran Dialog:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(p);
              }}
              className="px-2.5 py-1 rounded-xl text-[11px] font-mono bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* History Dialogue Logs */}
      <div className="space-y-4">
        {history.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            {/* User Query */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  SUPER ADMIN QUERY
                </span>
                <strong className="text-xs text-slate-900 dark:text-white">&ldquo;{item.query}&rdquo;</strong>
              </div>
              <span className="text-[10px] text-slate-400">{item.timestamp.split('T')[1]?.slice(0, 8)}</span>
            </div>

            {/* Structured Breakdown: FAKTA, ANALISIS, REKOMENDASI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              {/* FAKTA */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>1. FAKTA TERVERIFIKASI</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.fakta.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ANALISIS */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>2. ANALISIS ARSITEKTUR</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.analisis.map((a, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">&bull;</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* REKOMENDASI */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>3. REKOMENDASI STRATEGIS</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.rekomendasi.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {item.insufficientDataNote && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-[11px] font-mono text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{item.insufficientDataNote}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
