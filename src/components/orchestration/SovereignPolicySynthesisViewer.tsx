import React, { useState } from 'react';
import { SovereignPolicySynthesisEngine, PolicySynthesisRule, FounderAdvisoryBrief } from '../../core/orchestration/SovereignPolicySynthesisEngine';
import { Compass, Sparkles, ShieldCheck, CheckCircle2, Award, FileText, Download } from 'lucide-react';

export const SovereignPolicySynthesisViewer: React.FC = () => {
  const engine = SovereignPolicySynthesisEngine.getInstance();
  const [policies] = useState<PolicySynthesisRule[]>(engine.getPolicies());
  const [brief] = useState<FounderAdvisoryBrief>(engine.generateFounderAdvisoryBrief());
  const [copiedBrief, setCopiedBrief] = useState(false);

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(JSON.stringify(brief, null, 2));
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Founder Brief */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                R665 &bull; AI ASY PRIME MINISTER CO-PILOT
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Asy Sovereign Policy Synthesis &amp; Governance Co-Pilot
              </h3>
            </div>
          </div>

          <button
            onClick={handleCopyBrief}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{copiedBrief ? 'Tersalin!' : 'Ekspor Advisory Brief'}</span>
          </button>
        </div>

        {/* Founder Brief Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border border-indigo-500/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <strong className="text-slate-900 dark:text-white text-sm">
                Founder Advisory Brief &bull; {brief.briefId}
              </strong>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500 text-white">
              HEALTH SCORE {brief.operationalHealthScore}%
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
            {brief.executiveSummary}
          </p>

          <div className="pt-2 border-t border-indigo-500/20 text-xs font-mono space-y-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-bold block">Rekomendasi Strategis AI Asy Prime Minister:</span>
            <ul className="space-y-1">
              {brief.strategicRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
            <span>Kabinet Persetujuan: <strong>Unanimous 100%</strong></span>
            <span>Signature: <strong>{brief.signature}</strong></span>
          </div>
        </div>
      </div>

      {/* Constitutional Invariant Cross-Check Policy Grid */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Constitutional Invariant Policy Assessment Matrix</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">{policies.length} Policies</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                  {p.id} &bull; INVARIANT #{p.constitutionalInvariantIndex}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {p.complianceStatus}
                </span>
              </div>

              <h5 className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</h5>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{p.description}</p>

              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-[11px] text-indigo-900 dark:text-indigo-200 space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">Penilaian AI Asy:</span>
                <div>{p.asyPrimeMinisterAssessment}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
