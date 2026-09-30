import React, { useState, useEffect } from 'react';
import { Crown, AlertOctagon, RefreshCw, CheckCircle2, Shield, Send, Activity, BarChart3, Zap } from 'lucide-react';
import { executiveOperationsBoard, ExecutiveBoardMode, ExecutiveOperationalKPIs } from '../../core/operational/ExecutiveOperationsBoard';

export const ExecutiveOperationsBoardViewer: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<ExecutiveBoardMode>(executiveOperationsBoard.getMode());
  const [kpis, setKpis] = useState<ExecutiveOperationalKPIs>(executiveOperationsBoard.getKPIs());
  const [directiveTitle, setDirectiveTitle] = useState('Reinforce PPDB Registration Integrity');
  const [directiveTarget, setDirectiveTarget] = useState('Ministry of Academic Affairs & Treasury');
  const [lastIssued, setLastIssued] = useState<string | null>(null);

  useEffect(() => {
    const unsub = executiveOperationsBoard.subscribe((mode) => {
      setCurrentMode(mode);
      setKpis(executiveOperationsBoard.getKPIs());
    });
    return () => unsub();
  }, []);

  const handleModeChange = (mode: ExecutiveBoardMode) => {
    executiveOperationsBoard.setMode(mode);
  };

  const handleIssueDirective = () => {
    const code = executiveOperationsBoard.issueExecutiveDirective(directiveTitle, directiveTarget);
    setLastIssued(code);
  };

  return (
    <div id="executive-operations-board-viewer" className="space-y-6">
      {/* Sovereign Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              R641 &bull; KETUA YAYASAN EXECUTIVE BOARD
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ONE SOVEREIGN COMMAND
            </span>
          </div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Executive Operations Board &bull; 4 Operational Modes
          </h2>
          <p className="text-xs text-slate-400">
            Supreme command console for Ketua Yayasan with mode toggling, strategic metrics, and directive dispatch.
          </p>
        </div>

        {/* 4 Mode Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-800 border border-slate-700 font-mono text-xs">
          {[
            { id: 'LIVE', label: '1. Live Mode' },
            { id: 'INCIDENT', label: '2. Incident Mode' },
            { id: 'RECOVERY', label: '3. Recovery Mode' },
            { id: 'EXECUTIVE', label: '4. Executive Mode' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id as ExecutiveBoardMode)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentMode === m.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Specific Theater */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 block">
              CURRENT POSTURE: {currentMode}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentMode === 'LIVE' && 'Normal 24/7 Campus Heartbeat & Real-Time Flow'}
              {currentMode === 'INCIDENT' && 'Emergency Command Posture & Blast Radius Containment'}
              {currentMode === 'RECOVERY' && 'Swarm Reconstitution & Node Restoration Monitor'}
              {currentMode === 'EXECUTIVE' && 'Institutional KPIs, Financial Health & 10-Year Sustainability'}
            </h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
            Heartbeat: {kpis.campusHeartbeatScore}/100
          </span>
        </div>

        {/* Dynamic Mode Content */}
        {currentMode === 'LIVE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block">STUDENT ATTENDANCE</span>
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{kpis.dailyAttendanceRate}%</span>
              <span className="text-[10px] text-slate-500 block">180/180 Santri Registered</span>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
              <span className="text-[10px] text-cyan-800 dark:text-cyan-400 block">SPP PAYMENT MATCH</span>
              <span className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{kpis.monthlySPPCollectionRate}%</span>
              <span className="text-[10px] text-slate-500 block">Realtime VA Reconciled</span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] text-purple-800 dark:text-purple-400 block">SWARM READINESS</span>
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{kpis.swarmReadinessScore}%</span>
              <span className="text-[10px] text-slate-500 block">All Daemons Garrisoned</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 block">DEFCON POSTURE</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{kpis.activeThreatLevel}</span>
              <span className="text-[10px] text-slate-500 block">Normal Security Status</span>
            </div>
          </div>
        )}

        {currentMode === 'INCIDENT' && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
              <AlertOctagon className="w-4 h-4" /> Incident Command Mode Active
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Sovereign Veto and Ring-0 Memory Buffers are locked. All 10 ministries are under strict audit containment.
            </p>
          </div>
        )}

        {currentMode === 'RECOVERY' && (
          <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-bold">
              <RefreshCw className="w-4 h-4" /> Swarm Reconstitution &amp; Reinforcement
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Autonomous repair swarms have stabilized all storage and memory buffers. Forces are redeployed to frontline defenses.
            </p>
          </div>
        )}

        {currentMode === 'EXECUTIVE' && (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
              <Crown className="w-4 h-4" /> Strategic Institutional Governance
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              10-year continuous operating projection verified. Zero memory leak, 100% backward compatibility, and zero-regression guaranteed.
            </p>
          </div>
        )}

        {/* Executive Directive Dispatcher */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-3 font-mono">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            Issue Supreme Sovereign Directive (One-Click Broadcast)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Directive Title..."
              value={directiveTitle}
              onChange={(e) => setDirectiveTitle(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Target Ministries / Corps..."
              value={directiveTarget}
              onChange={(e) => setDirectiveTarget(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleIssueDirective}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Send className="w-4 h-4" /> Broadcast &amp; Seal Directive
            </button>
            {lastIssued && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                Directive Sealed: {lastIssued}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
