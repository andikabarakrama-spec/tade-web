import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, UserCheck, Play, FileText, Lock, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { operationalDoctrineEngine, IncidentRecord, IncidentSeverity } from '../../core/operational/OperationalDoctrineEngine';

export const OperationalDoctrineViewer: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [history, setHistory] = useState<IncidentRecord[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);

  const [drillTitle, setDrillTitle] = useState('Controlled Ring-0 Failover Simulation Drill');
  const [drillSeverity, setDrillSeverity] = useState<IncidentSeverity>('SEV1_CRITICAL');

  useEffect(() => {
    const unsub = operationalDoctrineEngine.subscribe((active) => {
      setIncidents(active);
      setHistory(operationalDoctrineEngine.getIncidentHistory());
      if (active.length > 0) {
        setSelectedIncident(active[0]);
      } else {
        const hist = operationalDoctrineEngine.getIncidentHistory();
        if (hist.length > 0) setSelectedIncident(hist[0]);
      }
    });
    return () => unsub();
  }, []);

  const handleTriggerDrill = () => {
    const newInc = operationalDoctrineEngine.declareIncident({
      title: drillTitle,
      severity: drillSeverity,
      blastRadius: ['RING0_CORE', 'STORAGE_VFS', 'CIVIL_SERVICE'],
      playbookName: 'PLAYBOOK-01-DISASTER-STANDBY-FAILOVER'
    });
    setSelectedIncident(newInc);
  };

  const handleNextStep = () => {
    if (!selectedIncident) return;
    if (selectedIncident.state === 'DECLARED') {
      operationalDoctrineEngine.stepIncident(selectedIncident.id, 'TRIAGED', 'Commander assigned roles & verified blast radius containment', 'Ketua Yayasan');
    } else if (selectedIncident.state === 'TRIAGED') {
      operationalDoctrineEngine.stepIncident(selectedIncident.id, 'MITIGATING', 'Recovery Owner dispatched automated repair swarm to reinforce node', 'Guardian Supreme General');
    } else if (selectedIncident.state === 'MITIGATING') {
      operationalDoctrineEngine.stepIncident(selectedIncident.id, 'RECOVERED', 'Node health fully restored to 100/100 and verified by Evidence Custodian', 'AI Asy Prime Minister');
    } else if (selectedIncident.state === 'RECOVERED') {
      operationalDoctrineEngine.stepIncident(selectedIncident.id, 'POST_MORTEM_LOCKED', 'Cryptographic post-mortem generated and ratified by Sovereign', 'Ketua Yayasan');
    }
  };

  return (
    <div id="operational-doctrine-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              R635 &bull; OPERATIONAL DOCTRINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              4-ROLE COMMAND CHAIN
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Operational Doctrine &amp; Incident Command Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict protocol: Every incident binds a Commander, Deputy, Recovery Owner, and Evidence Custodian.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerDrill}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold transition-all shadow-sm"
          >
            <Play className="w-4 h-4" /> Declare Operational Drill
          </button>
        </div>
      </div>

      {/* Incident Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">ACTIVE INCIDENTS</span>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono">
            {incidents.length}
          </span>
          <span className="text-[10px] text-slate-500 block">Under Active Mitigation</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">RESOLVED INCIDENTS</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {history.length}
          </span>
          <span className="text-[10px] text-slate-500 block">Locked Post-Mortems</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">SOVEREIGN VETO READY</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">
            100%
          </span>
          <span className="text-[10px] text-slate-500 block">Ketua Yayasan Supremacy</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">EVIDENCE RETENTION</span>
          <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">
            WORM SHA-256
          </span>
          <span className="text-[10px] text-slate-500 block">Tamper-Evident Seal</span>
        </div>
      </div>

      {/* Main Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Incident Stream &amp; Historical Drills
          </h3>

          <div className="space-y-2">
            {[...incidents, ...history].map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedIncident?.id === inc.id
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400 dark:border-rose-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {inc.code}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    inc.severity === 'SEV0_CATASTROPHIC' ? 'bg-rose-600 text-white' :
                    inc.severity === 'SEV1_CRITICAL' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {inc.severity.replace('SEV', 'SEV-')}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                  {inc.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                  <span>State: {inc.state}</span>
                  <span>{new Date(inc.declaredAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Incident Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedIncident ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-500 block">
                    INCIDENT ACTIVE DOSSIER &bull; {selectedIncident.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedIncident.title}
                  </h3>
                </div>
                {selectedIncident.state !== 'POST_MORTEM_LOCKED' && (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all shadow-sm"
                  >
                    Advance Step <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 4 Mandatory Roles */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Mandatory Operational Command Hierarchy (Zero Empty Roles)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 block">1. COMMANDER</span>
                    <strong className="text-xs text-slate-900 dark:text-white block">{selectedIncident.roles.commander.name}</strong>
                    <span className="text-[10px] font-mono text-slate-500">{selectedIncident.roles.commander.role} &bull; {selectedIncident.roles.commander.signature}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 block">2. DEPUTY</span>
                    <strong className="text-xs text-slate-900 dark:text-white block">{selectedIncident.roles.deputy.name}</strong>
                    <span className="text-[10px] font-mono text-slate-500">{selectedIncident.roles.deputy.role} &bull; {selectedIncident.roles.deputy.signature}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 block">3. RECOVERY OWNER</span>
                    <strong className="text-xs text-slate-900 dark:text-white block">{selectedIncident.roles.recoveryOwner.name}</strong>
                    <span className="text-[10px] font-mono text-slate-500">{selectedIncident.roles.recoveryOwner.role} &bull; {selectedIncident.roles.recoveryOwner.signature}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block">4. EVIDENCE OWNER</span>
                    <strong className="text-xs text-slate-900 dark:text-white block">{selectedIncident.roles.evidenceOwner.name}</strong>
                    <span className="text-[10px] font-mono text-slate-500">{selectedIncident.roles.evidenceOwner.role} &bull; {selectedIncident.roles.evidenceOwner.signature}</span>
                  </div>
                </div>
              </div>

              {/* Action Log */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Action Audit Trail (Immutable)
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {selectedIncident.actionLog.map((log, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 dark:text-white">{log.actor}: </strong>
                        <span className="text-slate-600 dark:text-slate-300">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post-Mortem if Locked */}
              {selectedIncident.postMortem && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Cryptographic Post-Mortem Locked &amp; Ratified
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Root Cause:</strong> {selectedIncident.postMortem.rootCause}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Mitigation:</strong> {selectedIncident.postMortem.mitigationSummary}
                  </p>
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold pt-1 break-all">
                    SEAL: {selectedIncident.postMortem.cryptographicSeal}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-mono">
              No incident selected. Select one from the stream or declare a new drill.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
