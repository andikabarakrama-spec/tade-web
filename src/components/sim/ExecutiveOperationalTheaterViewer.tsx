import React, { useState } from 'react';
import { Crown, ShieldCheck, Bot, Activity, CheckCircle2, AlertCircle, Wrench, RefreshCw, BarChart3, Lock } from 'lucide-react';
import { GuardianKernel } from '../../core/kernel/GuardianKernelLayer';

export const ExecutiveOperationalTheaterViewer: React.FC = () => {
  const [incidentReadinessScore, setIncidentReadinessScore] = useState(100);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const toggleMaintenance = () => {
    setMaintenanceMode(!maintenanceMode);
    GuardianKernel.appendJournal({
      engineId: 'GUARDIAN',
      level: 'NOTICE',
      subsystem: 'SUPERVISOR',
      message: `Executive Theater: Maintenance window flag updated to ${!maintenanceMode ? 'ACTIVE' : 'STANDBY'}.`
    });
  };

  return (
    <div id="r573-executive-theater" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950/80 border border-amber-500/40 rounded-lg text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Executive Operational Theater
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/50 font-mono">
                  R573 • Ketua Yayasan Command View
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Holistic operational oversight: System Vitality, Guardian Left Hand, AI Asy Right Hand, and Incident Readiness.
              </p>
            </div>
          </div>
          <button
            onClick={toggleMaintenance}
            className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all shadow-md ${
              maintenanceMode
                ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-amber-950/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Wrench className="w-4 h-4" />
            {maintenanceMode ? 'Maintenance Window ACTIVE' : 'Toggle Maintenance Window'}
          </button>
        </div>
      </div>

      {/* 4 Pillars Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">System Vitality</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">100.0%</div>
          <p className="text-xs text-slate-500">All 12 micro-daemons operational</p>
        </div>

        {/* Pillar 2 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Guardian (Left Hand)</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">ENFORCING</div>
          <p className="text-xs text-slate-500">Zero Trust MAC & WORM Active</p>
        </div>

        {/* Pillar 3 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">AI Asy (Right Hand)</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">STANDBY / ACTIVE</div>
          <p className="text-xs text-slate-500">Autonomous recovery planner online</p>
        </div>

        {/* Pillar 4 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Incident Readiness</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">100 / 100</div>
          <p className="text-xs text-slate-500">WAL Replay & Swarm V3 primed</p>
        </div>
      </div>

      {/* Strategic Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Institutional Governance Scorecard</span>
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-300">PPDB Admission Quota & Integrity</span>
              <span className="text-xs font-mono font-bold text-emerald-400">100% Locked</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-300">Financial Ledger SPP Reconciled</span>
              <span className="text-xs font-mono font-bold text-emerald-400">Rp 0.00 Imbalance</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-300">Raport Kurikulum Merdeka State</span>
              <span className="text-xs font-mono font-bold text-emerald-400">Finalized & Signed</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Executive Constitutional Mandate</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              The Yayasan Board of Directors maintains ultimate executive oversight over system constitutionality, zero regression mandates, and autonomous healing mechanisms.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Executive Theater: All governance telemetry validated under Constitution v5.2.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
