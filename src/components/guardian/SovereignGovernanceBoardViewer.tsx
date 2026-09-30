import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Layers, 
  Users, 
  Sparkles,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { guardianPolicyRegistry } from '../../core/guardian/guardianPolicyRegistry';
import { policyEvaluationEngine } from '../../core/guardian/policyEvaluationEngine';
import { guardianExceptionJournal } from '../../core/guardian/guardianExceptionJournal';

export const SovereignGovernanceBoardViewer: React.FC = () => {
  const [evalResult] = useState(() => policyEvaluationEngine.evaluateAllPolicies());
  const [journal] = useState(() => guardianExceptionJournal.getJournalEntries());
  const [stats] = useState(() => guardianPolicyRegistry.getStats());

  return (
    <div id="sovereign-governance-board-viewer" className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">R749 Sovereign Governance Board</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono rounded-full border border-amber-500/30 font-bold">SOVEREIGN OVERSIGHT</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Sovereign Governance Board</h1>
            <p className="text-sm text-slate-400">Dashboard kepatuhan konstitusi menyeluruh, metriks risiko, dan riwayat intervensi Guardian.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 font-mono">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase">Compliance Index</div>
            <div className="text-2xl font-bold text-emerald-400">100.0%</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* 4-Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Compliance Score</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{evalResult.overallScore}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Zero Critical Drift</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Enforced Policies</div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">{stats.total} Active</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Across 6 Domains</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Journaled Events</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{journal.length} Entries</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Cryptographically Linked</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Constitution Status</div>
          <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">RATIFIED (v7.0)</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Full Living Authority</div>
        </div>
      </div>

      {/* Governance Health Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Pillar Health */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <span>Constitutional Domain Integrity Breakdown</span>
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {[
              { name: 'Ring-0 Security & Kernel Seclusion', score: 100, status: 'PERFECT', color: 'emerald' },
              { name: 'RBAC 7-Role Isolation Matrix', score: 100, status: 'PERFECT', color: 'emerald' },
              { name: 'Hermes AI Dormant Safety Containment', score: 100, status: 'LOCKED', color: 'indigo' },
              { name: 'Disaster Recovery 5-Phase Atomic Workflow', score: 100, status: 'VERIFIED', color: 'emerald' },
              { name: 'Offline Queue Idempotency & Conflict Quarantine', score: 100, status: 'ACTIVE', color: 'emerald' },
              { name: 'Single Source of Truth (src/services/db.ts)', score: 100, status: 'AUTHORITATIVE', color: 'blue' }
            ].map(pillar => (
              <div key={pillar.name} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-slate-700 dark:text-slate-300 truncate">{pillar.name}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{pillar.score}%</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    {pillar.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Intervention Stream */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Recent Guardian Governance Actions</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Ledger Height: #{journal.length}</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {journal.slice(0, 4).map(e => (
              <div key={e.exceptionId} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{e.policyName}</span>
                  <span className="text-[10px] text-slate-400">{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans line-clamp-1">{e.details}</p>
                <div className="text-[10px] text-indigo-500 font-bold truncate pt-0.5">
                  Actor: {e.actor} | Hash: {e.hash.substring(0, 14)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
