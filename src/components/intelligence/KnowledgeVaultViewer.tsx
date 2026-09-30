import React, { useState } from 'react';
import { KnowledgeVaultEvolution, VaultHistoricalRecord } from '../../core/intelligence/KnowledgeVaultEvolution';
import { Database, Search, HelpCircle, CheckCircle2, History, BookOpen } from 'lucide-react';

export const KnowledgeVaultViewer: React.FC = () => {
  const vault = KnowledgeVaultEvolution.getInstance();
  const [records, setRecords] = useState<VaultHistoricalRecord[]>(vault.getAllRecords());
  const [searchQuery, setSearchQuery] = useState('');
  const [historicalExplanation, setHistoricalExplanation] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setRecords(vault.getAllRecords());
      setHistoricalExplanation(null);
      return;
    }

    const filtered = vault.searchVault(searchQuery);
    setRecords(filtered);

    const explanation = vault.queryHistoricalReason(searchQuery);
    setHistoricalExplanation(explanation.explanation);
  };

  const sampleQuestions = [
    'Mengapa SQL relasional ditolak?',
    'Kenapa Hermes berstatus DORMANT?',
    '22 Invarian Konstitusi TADE',
    'Merkle Tree laporan harian'
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Search and Query Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              R675 &bull; INSTITUTIONAL MEMORY &amp; EVOLUTION
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Knowledge Vault Evolution: Histori Keputusan &amp; Integritas TADE
            </h3>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari histori keputusan (cth: 'Mengapa dulu ditolak?', 'Hermes DORMANT')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0"
          >
            <span>Cari Histori</span>
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 py-1 mr-1">Pertanyaan Umum:</span>
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchQuery(q);
                const filtered = vault.searchVault(q);
                setRecords(filtered);
                const exp = vault.queryHistoricalReason(q);
                setHistoricalExplanation(exp.explanation);
              }}
              className="px-2.5 py-1 rounded-xl text-[11px] font-mono bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* AI Asy Historical Answer Banner */}
        {historicalExplanation && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-mono text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
            <History className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{historicalExplanation}</p>
          </div>
        )}
      </div>

      {/* Record Cards */}
      <div className="space-y-4 font-mono text-xs">
        {records.map(rec => (
          <div key={rec.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400">{rec.id} &bull; {rec.date} &bull; {rec.authorOrDecider}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{rec.topic}</h4>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                rec.category === 'FOUNDER_DECISION' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                rec.category === 'ACCEPTED_TECH' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                rec.category === 'REJECTED_TECH' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                rec.category === 'TADE_HISTORY' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' :
                'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {rec.category.replace('_', ' ')}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              <strong>Ringkasan:</strong> {rec.summary}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">Rasionalisasi Keputusan Founder:</strong>
              <span>{rec.decisionReason}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {rec.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500 dark:text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
