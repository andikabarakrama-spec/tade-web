import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Filter, Search, Download, CheckCircle2, Lock } from 'lucide-react';
import { GuardianKernel, JournalEntry } from '../../core/kernel/GuardianKernelLayer';

export const KernelJournalService: React.FC = () => {
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setJournal(GuardianKernel.getJournal(100));
    const unsub = GuardianKernel.subscribe(() => {
      setJournal(GuardianKernel.getJournal(100));
    });
    return unsub;
  }, []);

  const filteredEntries = journal.filter(entry => {
    if (selectedSubsystem !== 'ALL' && entry.subsystem !== selectedSubsystem) return false;
    if (selectedLevel !== 'ALL' && entry.level !== selectedLevel) return false;
    if (searchTerm && !entry.message.toLowerCase().includes(searchTerm.toLowerCase()) && !entry.engineId.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getLevelBadge = (level: JournalEntry['level']) => {
    switch (level) {
      case 'EMERGENCY':
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'ERROR':
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'NOTICE':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  const handleExportJournal = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(journal, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tade_kernel_journal_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200">
              R549 &bull; KERNEL JOURNAL SERVICE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              SYSTEMD UNIFIED WORM LOG
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Centralized Operating System Journal
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Terinspirasi oleh systemd Journal &amp; PostgreSQL WAL. Mengonsolidasi log Guardian, Operasional, Crisis Timeline, dan Recovery ke dalam satu kanal audit tamper-evident.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJournal}
            className="py-2.5 px-4 rounded-2xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition"
          >
            <Download className="w-4 h-4" /> Export WORM Journal
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3 font-mono text-xs">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search kernel journal entries..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Subsystem:</span>
          <select
            aria-label="Subsystem filter"
            value={selectedSubsystem}
            onChange={e => setSelectedSubsystem(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">ALL SUBSYSTEMS</option>
            <option value="SUPERVISOR">SUPERVISOR</option>
            <option value="SCHEDULER">SCHEDULER</option>
            <option value="MEMORY">MEMORY</option>
            <option value="PERMISSION">PERMISSION</option>
            <option value="SWARM">SWARM</option>
            <option value="CONSTITUTION">CONSTITUTION</option>
            <option value="INTEGRITY">INTEGRITY</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Level:</span>
          <select
            aria-label="Severity level filter"
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">ALL LEVELS</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="WARNING">WARNING</option>
            <option value="NOTICE">NOTICE</option>
            <option value="INFO">INFO</option>
          </select>
        </div>
      </div>

      {/* Terminal View */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-4 font-mono shadow-2xl space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>journalctl -u tade-kernel.service --follow</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>SHA-256 Chained WORM Ledger</span>
          </div>
        </div>

        <div className="h-[420px] overflow-y-auto space-y-2 text-[11px] pr-2">
          {filteredEntries.length === 0 ? (
            <div className="text-slate-500 py-12 text-center">No journal logs matching current filters.</div>
          ) : (
            filteredEntries.map(entry => (
              <div key={entry.id} className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 flex flex-col md:flex-row md:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getLevelBadge(entry.level)}`}>
                      {entry.level}
                    </span>
                    <span className="text-slate-400 text-[10px]">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className="text-indigo-400 font-bold">[{entry.engineId}]</span>
                    <span className="text-teal-400 text-[10px]">&lt;{entry.subsystem}&gt;</span>
                  </div>
                  <div className="text-slate-200 pl-1">{entry.message}</div>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono flex-shrink-0">
                  <span className="text-slate-400 block">{entry.hash}</span>
                  <span>{entry.id}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
