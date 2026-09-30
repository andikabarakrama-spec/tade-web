import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  CheckCheck, 
  Code2, 
  BookOpen, 
  Hash, 
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { constitutionCompiler } from '../../core/guardian/constitutionCompiler';
import { CompiledValidationRule } from '../../core/guardian/guardianTypes';

export const ConstitutionCompilerViewer: React.FC = () => {
  const [compilation, setCompilation] = useState(() => constitutionCompiler.compileConstitution());
  const [activeTab, setActiveTab] = useState<'RULES' | 'ARTICLES'>('RULES');
  const [selectedRule, setSelectedRule] = useState<CompiledValidationRule | null>(compilation.compiledRules[0] || null);

  const recompile = () => {
    const res = constitutionCompiler.compileConstitution();
    setCompilation(res);
    setSelectedRule(res.compiledRules[0] || null);
  };

  const articles = constitutionCompiler.getArticles();

  return (
    <div id="constitution-compiler-viewer" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">R743 Constitution Compiler</span>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono rounded-full border border-indigo-500/30 font-bold">BYTECODE GENERATION</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Constitution Compiler</h1>
            <p className="text-sm text-slate-400">Mengubah pasal hukum Constitution menjadi aturan validasi deterministik yang dapat dieksekusi mesin.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={recompile}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Zap className="w-4 h-4" />
            <span>Recompile Pipeline</span>
          </button>
        </div>
      </div>

      {/* Compiler Metadata Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Input Articles</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{compilation.totalArticles}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Ratified Legal Clauses</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Compiled Validation Rules</div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">{compilation.compiledRules.length}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">100% Target Active</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Compilation Hash</div>
          <div className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300 mt-2 truncate">{compilation.compilationHash}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Deterministic Binary Signature</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Compiler Engine</div>
          <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">{compilation.compilerVersion}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">TADE SSoT Native</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('RULES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
            activeTab === 'RULES'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Compiled Bytecode Rules ({compilation.compiledRules.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ARTICLES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
            activeTab === 'ARTICLES'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Source Legal Articles ({articles.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'RULES' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            {compilation.compiledRules.map(rule => (
              <div
                key={rule.ruleId}
                onClick={() => setSelectedRule(rule)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedRule?.ruleId === rule.ruleId
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {rule.ruleId}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Target: <span className="text-slate-700 dark:text-slate-300 font-bold">{rule.targetTarget}</span>
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      From: {rule.sourcePolicyId} ({rule.category})
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {rule.checksum}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-6">
            {selectedRule ? (
              <div className="p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4 sticky top-6 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs text-indigo-400 font-bold">{selectedRule.ruleId}</span>
                    <div className="text-sm font-bold text-white mt-0.5">Target: {selectedRule.targetTarget}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Compiled Execution Bytecode</div>
                  <div className="mt-2 p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-emerald-400 leading-relaxed overflow-x-auto">
                    <code>{selectedRule.validatorCode}</code>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">SOURCE POLICY</div>
                    <div className="text-slate-200 mt-0.5 font-bold">{selectedRule.sourcePolicyId}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">CATEGORY</div>
                    <div className="text-slate-200 mt-0.5 font-bold">{selectedRule.category}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">CHECKSUM</div>
                    <div className="text-slate-200 mt-0.5 font-bold">{selectedRule.checksum}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">COMPILED AT</div>
                    <div className="text-slate-200 mt-0.5 text-[10px] truncate">{new Date(selectedRule.compiledAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map(art => (
            <div key={art.articleId} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-800">
                    Article {art.clauseNumber}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">{art.title}</h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  {art.status} ({art.version})
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                "{art.clauseText}"
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-sans italic pt-1">
                Rationale: {art.rationale}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
