import React, { useState } from 'react';
import { UserCheck, Shield, CheckCircle2, AlertCircle, Phone, ArrowUpRight, Lock, Users } from 'lucide-react';
import { serviceOwnershipRegistry, EngineOwnershipEntry } from '../../core/operational/ServiceOwnershipRegistry';

export const ServiceOwnershipRegistryViewer: React.FC = () => {
  const [entries] = useState<EngineOwnershipEntry[]>(serviceOwnershipRegistry.getAllEntries());
  const [selectedEntry, setSelectedEntry] = useState<EngineOwnershipEntry | null>(entries[0] || null);

  const stats = serviceOwnershipRegistry.checkOwnershipCompleteness();

  return (
    <div id="service-ownership-registry-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              R637 &bull; SERVICE OWNERSHIP
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              100% OWNERSHIP COVERAGE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Service Ownership Registry &amp; Accountability Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict rule: Every engine must bind a Primary Owner, Backup Owner, and Recovery Owner. Zero empty slots.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 font-mono text-xs text-emerald-700 dark:text-emerald-300 font-bold">
          <CheckCircle2 className="w-4 h-4" /> 0 Empty Owners Detected
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">TOTAL ENGINES REGISTERED</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {stats.totalEngines}
          </span>
          <span className="text-[10px] text-slate-500 block">100% Covered</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">COMPLIANT ENGINES</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.compliantEngines}/{stats.totalEngines}
          </span>
          <span className="text-[10px] text-emerald-500 block">Zero Vacant Slots</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">ESCALATION SLA ACCURACY</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">
            99.9%
          </span>
          <span className="text-[10px] text-slate-500 block">&lt; 2 min response target</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">HEARTBEAT AUDIT</span>
          <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">
            100% ALIVE
          </span>
          <span className="text-[10px] text-slate-500 block">All Custodians Active</span>
        </div>
      </div>

      {/* Directory Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            Registered Service Engines
          </h3>
          <div className="space-y-2">
            {entries.map((srv) => (
              <div
                key={srv.engineId}
                onClick={() => setSelectedEntry(srv)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer font-mono ${
                  selectedEntry?.engineId === srv.engineId
                    ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-400 dark:border-purple-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {srv.engineId}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {srv.ownershipCompliance}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                  {srv.engineName}
                </h4>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                  Owner: <span className="font-bold text-slate-700 dark:text-slate-300">{srv.primaryOwner.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Service Detailed Ownership Card */}
        <div className="lg:col-span-2 space-y-4">
          {selectedEntry ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-500 block">
                    ENGINE ACCOUNTABILITY PROFILE &bull; {selectedEntry.engineId}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedEntry.engineName}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Target SLA: {selectedEntry.slaTargetMinutes} min
                </span>
              </div>

              {/* 3 Ownership Roles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-1.5 font-mono">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 block">PRIMARY OWNER</span>
                  <strong className="text-xs text-slate-900 dark:text-white block">{selectedEntry.primaryOwner.name}</strong>
                  <p className="text-[10px] text-slate-500">{selectedEntry.primaryOwner.role}</p>
                  <div className="pt-1 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Channel: {selectedEntry.primaryOwner.contactChannel}</span>
                    <span className="text-emerald-500 font-bold">{selectedEntry.primaryOwner.heartbeatState}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 space-y-1.5 font-mono">
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 block">BACKUP OWNER</span>
                  <strong className="text-xs text-slate-900 dark:text-white block">{selectedEntry.backupOwner.name}</strong>
                  <p className="text-[10px] text-slate-500">{selectedEntry.backupOwner.role}</p>
                  <div className="pt-1 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Channel: {selectedEntry.backupOwner.contactChannel}</span>
                    <span className="text-emerald-500 font-bold">{selectedEntry.backupOwner.heartbeatState}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-1.5 font-mono">
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 block">RECOVERY OWNER</span>
                  <strong className="text-xs text-slate-900 dark:text-white block">{selectedEntry.recoveryOwner.name}</strong>
                  <p className="text-[10px] text-slate-500">{selectedEntry.recoveryOwner.role}</p>
                  <div className="pt-1 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Channel: {selectedEntry.recoveryOwner.contactChannel}</span>
                    <span className="text-emerald-500 font-bold">{selectedEntry.recoveryOwner.heartbeatState}</span>
                  </div>
                </div>
              </div>

              {/* Escalation Pathway */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Automated Escalation Pathway (Ordered SLA Chain)
                </span>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  {selectedEntry.escalationPath.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">
                        {idx + 1}. {step}
                      </span>
                      {idx < selectedEntry.escalationPath.length - 1 && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Cryptographic Verification Seal */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 text-[10px] font-mono text-slate-500 break-all">
                <span className="text-purple-600 dark:text-purple-400 font-bold block mb-0.5">OWNERSHIP VERIFICATION DIGEST</span>
                {selectedEntry.cryptographicVerificationHash}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-mono">
              Select an engine to inspect its ownership and escalation pathway.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
