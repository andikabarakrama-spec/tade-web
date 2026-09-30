import React, { useState } from 'react';
import { 
  BookOpen, 
  History, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  Layers, 
  CheckCircle2, 
  Clock, 
  FileText,
  Lock,
  Tag
} from 'lucide-react';
import { ExecutiveDecisionJournal, ExecutiveDecisionEntry } from '../../core/governance/ExecutiveDecisionJournal';
import { KnowledgeEvolutionTracker, KnowledgeLifecycleItem } from '../../core/governance/KnowledgeEvolutionTracker';
import { FounderCommandHistory, FounderCommandRecord } from '../../core/governance/FounderCommandHistory';

export const ExecutiveGovernanceJournalViewer: React.FC = () => {
  const decisionJournal = ExecutiveDecisionJournal.getInstance();
  const knowledgeTracker = KnowledgeEvolutionTracker.getInstance();
  const commandHistory = FounderCommandHistory.getInstance();

  const [activeTab, setActiveTab] = useState<'DECISIONS' | 'KNOWLEDGE' | 'COMMANDS'>('DECISIONS');
  
  // Decisions State
  const [decisions, setDecisions] = useState<ExecutiveDecisionEntry[]>(() => decisionJournal.getAllEntries());
  const [showNewDecisionModal, setShowNewDecisionModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newReason, setNewReason] = useState<string>('');
  const [newImpact, setNewImpact] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ExecutiveDecisionEntry['category']>('GOVERNANCE');

  // Knowledge State
  const [knowledgeFilter, setKnowledgeFilter] = useState<'ALL' | 'CORE' | 'RESERVED' | 'EXPERIMENTAL' | 'REJECTED'>('ALL');
  const knowledgeItems = knowledgeTracker.getKnowledgeItems(knowledgeFilter === 'ALL' ? undefined : knowledgeFilter);
  const knowledgeStats = knowledgeTracker.getLifecycleDistribution();

  // Command History State
  const [commandSearch, setCommandSearch] = useState<string>('');
  const [commandTypeFilter, setCommandTypeFilter] = useState<string>('ALL');
  const [commands, setCommands] = useState<FounderCommandRecord[]>(() => commandHistory.getCommands());

  const handleRecordDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newReason) return;

    decisionJournal.recordDecision({
      actor: 'Founder & Super Admin',
      category: newCategory,
      title: newTitle,
      reason: newReason,
      impact: newImpact || 'Penerapan doktrin kepatuhan pada ekosistem TADE.',
      status: 'RATIFIED',
      references: ['RC88-GOVERNANCE']
    });

    setDecisions(decisionJournal.getAllEntries());
    setNewTitle('');
    setNewReason('');
    setNewImpact('');
    setShowNewDecisionModal(false);
  };

  const handleSearchCommands = (search: string, type: string) => {
    setCommandSearch(search);
    setCommandTypeFilter(type);
    setCommands(commandHistory.getCommands(type, search));
  };

  return (
    <div className="space-y-6" id="executive-governance-journal-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Strategic Ledger & Knowledge Evolution
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R706, R707, R708
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Executive Decision Journal & Knowledge Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Jurnal keputusan strategis append-only, pelacakan siklus hidup evolusi ide Knowledge Vault (CORE, RESERVED, EXPERIMENTAL, REJECTED), dan jejak audit Founder Command.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Buku Kasus: Immutable Append-Only
            </span>
          </div>
        </div>
      </div>

      {/* 3-Tab Sub Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('DECISIONS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'DECISIONS' 
              ? 'bg-slate-800 text-white shadow-md border border-slate-700 text-emerald-400' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Executive Decision Journal (R706)
        </button>
        <button
          onClick={() => setActiveTab('KNOWLEDGE')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'KNOWLEDGE' 
              ? 'bg-slate-800 text-white shadow-md border border-slate-700 text-emerald-400' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Knowledge Evolution Tracker (R707)
        </button>
        <button
          onClick={() => setActiveTab('COMMANDS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'COMMANDS' 
              ? 'bg-slate-800 text-white shadow-md border border-slate-700 text-emerald-400' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Founder Command History (R708)
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'DECISIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Daftar Keputusan Strategis Yayasan & Pimpinan
            </h3>
            <button
              onClick={() => setShowNewDecisionModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow"
            >
              <Plus className="w-4 h-4" />
              Catat Keputusan Baru
            </button>
          </div>

          <div className="space-y-3">
            {decisions.map(dec => (
              <div key={dec.decisionId} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-400 font-mono">{dec.decisionId}</span>
                    <span className="text-xs font-bold text-white">&bull; {dec.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">
                      {dec.category}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-black">
                      {dec.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 font-bold block mb-1">Rasional & Alasan:</span>
                    <p className="text-slate-200">{dec.reason}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 font-bold block mb-1">Dampak Operasional:</span>
                    <p className="text-slate-200">{dec.impact}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Aktor: <strong className="text-slate-300">{dec.actor}</strong> ({new Date(dec.timestamp).toLocaleDateString('id-ID')})</span>
                  <span className="font-mono text-slate-400">{dec.cryptographicSignature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'KNOWLEDGE' && (
        <div className="space-y-4">
          {/* Lifecycle Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'CORE', count: knowledgeStats.CORE, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
              { label: 'RESERVED', count: knowledgeStats.RESERVED, color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
              { label: 'EXPERIMENTAL', count: knowledgeStats.EXPERIMENTAL, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
              { label: 'REJECTED', count: knowledgeStats.REJECTED, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
            ].map(s => (
              <button
                key={s.label}
                onClick={() => setKnowledgeFilter(s.label as any)}
                className={`p-3.5 rounded-xl border text-left transition ${s.color} ${knowledgeFilter === s.label ? 'ring-2 ring-white/20' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider">{s.label}</div>
                <div className="text-2xl font-black mt-0.5">{s.count} Entitas</div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Histori Perkembangan Ide & Doktrin ({knowledgeItems.length} Entri)
            </h3>
            {knowledgeFilter !== 'ALL' && (
              <button 
                onClick={() => setKnowledgeFilter('ALL')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="space-y-3">
            {knowledgeItems.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{item.code}</span>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    </div>
                    <div className="text-[10px] text-slate-400">Asal Sprint: {item.originSprint} ({item.originDate})</div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${
                    item.lifecycleStatus === 'CORE' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    item.lifecycleStatus === 'RESERVED' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' :
                    item.lifecycleStatus === 'EXPERIMENTAL' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {item.lifecycleStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{item.summary}</p>

                {/* Evolution Timeline */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Histori Evolusi:</div>
                  <div className="space-y-1.5">
                    {item.evolutionHistory.map((evo, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] border-b border-slate-900 pb-1 last:border-0 last:pb-0">
                        <span className="text-slate-400">{evo.date} &bull; <strong className="text-slate-200">{evo.phase}</strong>: {evo.description}</span>
                        <span className="text-[10px] font-bold text-emerald-400">{evo.authorizedBy}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Justifikasi Doktrin: <strong className="text-slate-300">{item.doctrineJustification}</strong></span>
                  <div className="flex gap-1">
                    {item.associatedModules.map(m => (
                      <span key={m} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[9px] font-mono">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'COMMANDS' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Cari histori perintah (Module, Executor, Payload, ID)..."
                value={commandSearch}
                onChange={(e) => handleSearchCommands(e.target.value, commandTypeFilter)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={commandTypeFilter}
              onChange={(e) => handleSearchCommands(commandSearch, e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">Semua Tipe Perintah</option>
              <option value="EMERGENCY_LOCKDOWN">EMERGENCY_LOCKDOWN</option>
              <option value="DRYRUN_TRIGGER">DRYRUN_TRIGGER</option>
              <option value="DRIFT_SCAN">DRIFT_SCAN</option>
              <option value="AUDIT_SEAL">AUDIT_SEAL</option>
            </select>
          </div>

          <div className="space-y-2">
            {commands.map(cmd => (
              <div key={cmd.commandId} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">{cmd.commandId}</span>
                    <span className="text-xs font-bold text-white">{cmd.commandType}</span>
                    <span className="text-xs text-slate-400">&bull; Target: {cmd.targetModule}</span>
                  </div>
                  <p className="text-xs text-slate-300">{cmd.payloadSummary}</p>
                </div>

                <div className="md:text-right space-y-0.5">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-black">
                    {cmd.executionStatus}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">{cmd.auditHash}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record New Decision Modal */}
      {showNewDecisionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleRecordDecision} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <Plus className="w-5 h-5" />
              <span>Catat Keputusan Strategis Baru</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Judul Keputusan:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Penegakan Doktrin Keamanan Zero-Loss"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
                >
                  <option value="GOVERNANCE">GOVERNANCE</option>
                  <option value="ARCHITECTURE">ARCHITECTURE</option>
                  <option value="SECURITY">SECURITY</option>
                  <option value="POLICY">POLICY</option>
                  <option value="RESILIENCE">RESILIENCE</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Rasional & Alasan:</label>
                <textarea
                  required
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Alasan strategis mengapa keputusan ini diambil..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Dampak Operasional:</label>
                <textarea
                  rows={2}
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  placeholder="Dampak pada sistem, aturan, atau alur kerja..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewDecisionModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Simpan ke Buku Kasus
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
