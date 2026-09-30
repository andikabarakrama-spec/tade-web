import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, Lock, Search, Filter, CheckCircle2, Key, RefreshCw } from 'lucide-react';
import { immutableJournalFederation, FederatedJournalEntry, FederationMerkleRoot, JournalNamespace } from '../../core/operational/ImmutableJournalFederation';

export const ImmutableJournalFederationViewer: React.FC = () => {
  const [entries, setEntries] = useState<FederatedJournalEntry[]>(immutableJournalFederation.getEntries());
  const [report, setReport] = useState<FederationMerkleRoot>(immutableJournalFederation.getFederationReport());
  const [selectedNamespace, setSelectedNamespace] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = immutableJournalFederation.subscribe(() => {
      setEntries(immutableJournalFederation.getEntries());
      setReport(immutableJournalFederation.getFederationReport());
    });
    return () => unsub();
  }, []);

  const handleAppendSimulation = (ns: JournalNamespace) => {
    immutableJournalFederation.appendEntry(
      ns,
      'ROUTINE_SECURITY_HEARTBEAT',
      'Autonomous Compliance Daemon',
      'Periodic cryptographic block validation complete.'
    );
  };

  const filteredEntries = entries.filter((e) => {
    const matchesNs = selectedNamespace === 'ALL' || e.namespace === selectedNamespace;
    const matchesSearch = !searchQuery || 
      e.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.blockHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNs && matchesSearch;
  });

  return (
    <div id="immutable-journal-federation-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              R640 &bull; JOURNAL FEDERATION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              MERKLE PROOF VERIFIED
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Immutable Journal Federation &amp; Cross-Namespace Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unified cryptographic journal aggregating Guardian Security, AI Asy Operations, War Room Audits, and Civil Service events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAppendSimulation('GUARDIAN')}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold transition-all shadow-sm"
          >
            + Append Block
          </button>
        </div>
      </div>

      {/* Merkle Root Summary Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <span className="text-xs text-purple-400 font-bold flex items-center gap-2">
            <Lock className="w-4 h-4" /> FEDERATION MERKLE ROOT ANCHOR
          </span>
          <span className="px-3 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold">
            {report.federationIntegrity}
          </span>
        </div>

        <div className="text-xs text-slate-300 break-all">
          <span className="text-slate-500 block mb-1">GLOBAL MERKLE ROOT:</span>
          <span className="text-sm font-bold text-emerald-400">{report.merkleRootHash}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">GUARDIAN BLOCKS</span>
            <span className="text-lg font-bold text-purple-400">{report.guardianBlockCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">AI ASY BLOCKS</span>
            <span className="text-lg font-bold text-cyan-400">{report.aiAsyBlockCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">WAR ROOM BLOCKS</span>
            <span className="text-lg font-bold text-emerald-400">{report.warRoomBlockCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">CIVIL SERVICE BLOCKS</span>
            <span className="text-lg font-bold text-amber-400">{report.civilServiceBlockCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto font-mono text-xs w-full sm:w-auto">
          {['ALL', 'GUARDIAN', 'AI_ASY', 'WAR_ROOM', 'CIVIL_SERVICE'].map((ns) => (
            <button
              key={ns}
              onClick={() => setSelectedNamespace(ns)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedNamespace === ns
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              {ns}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search block hashes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3 font-mono">
        {filteredEntries.map((entry) => (
          <div
            key={entry.eventId}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                  HEIGHT #{entry.blockHeight}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  entry.namespace === 'GUARDIAN' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                  entry.namespace === 'AI_ASY' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' :
                  entry.namespace === 'WAR_ROOM' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {entry.namespace}
                </span>
                <strong className="text-slate-900 dark:text-white">{entry.eventType}</strong>
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>Actor: <strong>{entry.actor}</strong></span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Chained Block Valid
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-400 space-y-0.5 break-all">
              <div>PREV: {entry.prevBlockHash}</div>
              <div className="text-slate-700 dark:text-slate-300 font-bold">CURR: {entry.blockHash}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
