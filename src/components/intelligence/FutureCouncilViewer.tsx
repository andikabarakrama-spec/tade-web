import React, { useState } from 'react';
import { FutureCouncilGovernance, CouncilProposal } from '../../core/intelligence/FutureCouncilGovernance';
import { Award, CheckCircle2, XCircle, Clock, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export const FutureCouncilViewer: React.FC = () => {
  const council = FutureCouncilGovernance.getInstance();
  const [proposals, setProposals] = useState<CouncilProposal[]>(council.getProposals());
  const [selectedProposal, setSelectedProposal] = useState<CouncilProposal | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [summary, setSummary] = useState(council.getSummary());

  const handleDecision = (id: string, decision: CouncilProposal['superAdminDecision']) => {
    council.submitSuperAdminDecision(id, decision, decisionNotes || 'Diputuskan melalui panel Future Council Governance.');
    setProposals([...council.getProposals()]);
    setSummary(council.getSummary());
    setSelectedProposal(null);
    setDecisionNotes('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Governance Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase block">
                R676 &bull; SOVEREIGN DECISION MATRIX
              </span>
              <h3 className="text-lg font-bold text-white">Future Council Governance</h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-mono font-bold">
            Auto-Promote: STRICTLY BLOCKED &bull; Super Admin Decides
          </span>
        </div>

        {/* Classification Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-1 font-mono">
            <span className="text-[10px] text-emerald-300">Core Approved</span>
            <div className="text-xl font-black text-emerald-400">{summary.core}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-1 font-mono">
            <span className="text-[10px] text-blue-300">Reserved Pool</span>
            <div className="text-xl font-black text-blue-400">{summary.reserved}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-1 font-mono">
            <span className="text-[10px] text-amber-300">Experimental</span>
            <div className="text-xl font-black text-amber-400">{summary.experimental}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-1 font-mono">
            <span className="text-[10px] text-rose-300">Rejected</span>
            <div className="text-xl font-black text-rose-400">{summary.rejected}</div>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4 font-mono text-xs">
        {proposals.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {p.id} &bull; Diusulkan: {p.proposedBy.replace(/_/g, ' ')}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{p.title}</h4>
              </div>

              <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                p.classification === 'CORE' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                p.classification === 'RESERVED' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                p.classification === 'EXPERIMENTAL' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}>
                KLASIFIKASI: {p.classification}
              </span>
            </div>

            {/* AI Asy Search & Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 font-bold block">1. Bukti &amp; Pencarian AI:</span>
                <p className="text-slate-700 dark:text-slate-300">{p.aiSearchEvidence}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 font-bold block">2. Analisis Kedaulatan AI:</span>
                <p className="text-slate-700 dark:text-slate-300">{p.aiAnalysis}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200">
              <strong className="block mb-0.5 text-indigo-700 dark:text-indigo-400">Rekomendasi AI Asy:</strong>
              <span>{p.aiRecommendation}</span>
            </div>

            {/* Current Decision Status */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div>
                <span className="text-slate-400">Keputusan Super Admin: </span>
                <strong className="text-slate-900 dark:text-white">{p.superAdminDecision}</strong>
                {p.decisionDate && <span className="text-slate-400"> ({p.decisionDate})</span>}
                {p.decisionNotes && <p className="text-slate-500 mt-1 italic">&ldquo;{p.decisionNotes}&rdquo;</p>}
              </div>

              {/* Action Buttons for Super Admin */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleDecision(p.id, 'APPROVED_FOR_CORE')}
                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all"
                >
                  Setujui Core
                </button>
                <button
                  onClick={() => handleDecision(p.id, 'PLACED_IN_RESERVED')}
                  className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
                >
                  Cadangkan
                </button>
                <button
                  onClick={() => handleDecision(p.id, 'ALLOWED_EXPERIMENTAL')}
                  className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all"
                >
                  Eksperimen
                </button>
                <button
                  onClick={() => handleDecision(p.id, 'REJECTED')}
                  className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all"
                >
                  Tolak
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
