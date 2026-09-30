import React, { useState } from 'react';
import { 
  GitCompare, 
  PlusCircle, 
  Edit3, 
  MinusCircle, 
  Check, 
  History, 
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { constitutionCompiler } from '../../core/guardian/constitutionCompiler';
import { ConstitutionDiffItem } from '../../core/guardian/guardianTypes';

export const ConstitutionDiffViewer: React.FC = () => {
  const [diffs] = useState<ConstitutionDiffItem[]>(() => constitutionCompiler.computeDiff());
  const [filter, setFilter] = useState<'ALL' | 'ADDED' | 'CHANGED' | 'UNCHANGED'>('ALL');

  const addedCount = diffs.filter(d => d.type === 'ADDED').length;
  const changedCount = diffs.filter(d => d.type === 'CHANGED').length;
  const unchangedCount = diffs.filter(d => d.type === 'UNCHANGED').length;

  const filtered = diffs.filter(d => filter === 'ALL' || d.type === filter);

  return (
    <div id="constitution-diff-viewer" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30">
            <GitCompare className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">R748 Constitution Revision Comparator</span>
              <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] font-mono rounded-full border border-teal-500/30 font-bold">V7.0.0 vs V6.9.0</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Constitution Diff Viewer</h1>
            <p className="text-sm text-slate-400">Komparasi audit evolusi pasal-pasal konstitusi digital TADE across sprint releases.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 font-mono text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'ALL' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({diffs.length})
          </button>
          <button
            onClick={() => setFilter('ADDED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'ADDED' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Added ({addedCount})
          </button>
          <button
            onClick={() => setFilter('CHANGED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'CHANGED' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Changed ({changedCount})
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase">Newly Ratified Articles</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">+{addedCount} Articles</div>
          </div>
          <PlusCircle className="w-8 h-8 text-emerald-500/30" />
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase">Amended Clauses</div>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">~{changedCount} Articles</div>
          </div>
          <Edit3 className="w-8 h-8 text-amber-500/30" />
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase">Unchanged Baseline</div>
            <div className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300 mt-1">{unchangedCount} Articles</div>
          </div>
          <Check className="w-8 h-8 text-slate-400/30" />
        </div>
      </div>

      {/* Diffs List */}
      <div className="space-y-4">
        {filtered.map(diff => (
          <div
            key={diff.articleId}
            className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm space-y-4 ${
              diff.type === 'ADDED'
                ? 'border-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/10'
                : diff.type === 'CHANGED'
                ? 'border-amber-500/40 bg-amber-50/10 dark:bg-amber-950/10'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {diff.articleId}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  diff.type === 'ADDED'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : diff.type === 'CHANGED'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {diff.type}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">{diff.diffSummary}</span>
              </div>
            </div>

            {diff.type === 'CHANGED' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-1">
                  <div className="font-mono text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">Previous Revision (v6.9.0)</div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{diff.oldText}"
                  </p>
                </div>
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                  <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Ratified Revision (v7.0.0-RC92)</div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "{diff.newText}"
                  </p>
                </div>
              </div>
            )}

            {diff.type === 'ADDED' && (
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 space-y-1 font-sans text-xs">
                <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">New Enactment Clause (v7.0.0)</div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  "{diff.newText}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
