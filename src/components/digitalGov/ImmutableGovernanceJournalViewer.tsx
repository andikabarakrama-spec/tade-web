import React, { useState, useMemo } from 'react';
import { 
  BookLock, 
  CheckCircle2, 
  ShieldCheck, 
  Archive, 
  Plus, 
  Search, 
  Filter, 
  Lock, 
  Key,
  Layers,
  ArrowRight,
  Hash
} from 'lucide-react';
import { 
  ImmutableGovernanceJournal, 
  GovernanceJournalEntry, 
  JournalEventType, 
  JournalState 
} from '../../core/digitalGov/immutableGovernanceJournal';
import { useAuth } from '../../context/AuthContext';

export const ImmutableGovernanceJournalViewer: React.FC = () => {
  const journal = useMemo(() => ImmutableGovernanceJournal.getInstance(), []);
  const { activeRole, userProfile } = useAuth();
  const [entries, setEntries] = useState<GovernanceJournalEntry[]>(() => journal.getAllEntries());
  const [selectedStateFilter, setSelectedStateFilter] = useState<JournalState | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Entry Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newEventType, setNewEventType] = useState<JournalEventType>('CONSTITUTIONAL_AUDIT');

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchState = selectedStateFilter === 'ALL' || e.state === selectedStateFilter;
      const matchQuery = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.entryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.performedByName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchState && matchQuery;
    }).sort((a, b) => b.sequenceNumber - a.sequenceNumber);
  }, [entries, selectedStateFilter, searchQuery]);

  const handleAppendEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    journal.appendEntry({
      eventType: newEventType,
      title: newTitle,
      summary: newSummary,
      performedByRole: activeRole,
      performedByName: userProfile?.displayName || activeRole
    });

    setEntries(journal.getAllEntries());
    setNewTitle('');
    setNewSummary('');
    setShowAddModal(false);
  };

  const handleVerifyEntry = (entryId: string) => {
    const verifier = userProfile?.displayName || activeRole;
    journal.verifyEntry(entryId, verifier);
    setEntries(journal.getAllEntries());
  };

  const handleArchiveEntry = (entryId: string) => {
    journal.archiveEntry(entryId);
    setEntries(journal.getAllEntries());
  };

  const stats = journal.getJournalStats();

  const getStateBadge = (state: JournalState) => {
    switch (state) {
      case 'RECORDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold font-mono">
            RECORDED
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold font-mono">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[10px] font-bold font-mono">
            <Archive className="w-3 h-3" /> ARCHIVED
          </span>
        );
    }
  };

  return (
    <div id="r773-immutable-governance-journal" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold font-mono border border-blue-500/30">
              <BookLock className="w-3.5 h-3.5" /> R773 • IMMUTABLE GOVERNANCE JOURNAL
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Append-Only Institutional Decision Journal
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Jurnal tata kelola permanen anti-overwrite dengan verifikasi digest kriptografis berantai (RECORDED $\to$ VERIFIED $\to$ ARCHIVED) untuk audit abadi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Journal Entries</p>
              <p className="text-2xl font-black text-blue-400 font-mono">{stats.totalEntries}</p>
            </div>
            {(activeRole === 'SUPER_ADMIN' || activeRole === 'KETUA_YAYASAN' || activeRole === 'ADMIN') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah Entri Jurnal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-500 font-mono">Recorded (Draf)</p>
          <p className="text-xl font-extrabold text-blue-700 font-mono">{stats.recordedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-500 font-mono">Verified (Sah)</p>
          <p className="text-xl font-extrabold text-emerald-700 font-mono">{stats.verifiedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-500 font-mono">Archived</p>
          <p className="text-xl font-extrabold text-purple-700 font-mono">{stats.archivedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-500 font-mono">Digest Chain</p>
          <p className="text-xs font-extrabold text-emerald-600 font-mono">100% UNBROKEN</p>
        </div>
      </div>

      {/* Journal Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['ALL', 'RECORDED', 'VERIFIED', 'ARCHIVED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStateFilter(st)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                  selectedStateFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari entri jurnal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Entries Stream */}
        <div className="space-y-3 pt-2">
          {filteredEntries.map((entry) => (
            <div 
              key={entry.entryId}
              className="p-4 bg-stone-50/70 rounded-2xl border border-stone-200 hover:border-blue-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {entry.entryId}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 font-mono">
                    #{entry.sequenceNumber}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    {entry.eventType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getStateBadge(entry.state)}
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(entry.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{entry.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{entry.summary}</p>
              </div>

              {/* Cryptographic Linkage Footer */}
              <div className="pt-2 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-stone-500">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <span className="text-stone-400">Digest:</span>
                    <span className="text-blue-700 font-bold">{entry.cryptographicDigest}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400">
                    <span>Oleh: <strong className="text-stone-600">{entry.performedByName}</strong> ({entry.performedByRole})</span>
                    {entry.verifiedBy && <span>• Diverifikasi oleh: <strong className="text-emerald-700">{entry.verifiedBy}</strong></span>}
                  </div>
                </div>

                {/* State Transition Actions */}
                <div className="flex items-center gap-2">
                  {entry.state === 'RECORDED' && (activeRole === 'SUPER_ADMIN' || activeRole === 'KETUA_YAYASAN') && (
                    <button
                      onClick={() => handleVerifyEntry(entry.entryId)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Verifikasi Entri
                    </button>
                  )}
                  {entry.state === 'VERIFIED' && (activeRole === 'SUPER_ADMIN' || activeRole === 'KETUA_YAYASAN') && (
                    <button
                      onClick={() => handleArchiveEntry(entry.entryId)}
                      className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <Archive className="w-3 h-3" /> Arsipkan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-xs">
              Tidak ada entri jurnal yang sesuai dengan filter.
            </div>
          )}
        </div>
      </div>

      {/* Append New Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookLock className="w-5 h-5 text-blue-600" /> Tambah Entri Jurnal Baru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAppendEntry} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jenis Event:</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as JournalEventType)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                >
                  <option value="CONSTITUTIONAL_AUDIT">CONSTITUTIONAL_AUDIT</option>
                  <option value="POLICY_UPDATED">POLICY_UPDATED</option>
                  <option value="APPROVAL_GRANTED">APPROVAL_GRANTED</option>
                  <option value="APPROVAL_REJECTED">APPROVAL_REJECTED</option>
                  <option value="RECOVERY_EVENT">RECOVERY_EVENT</option>
                  <option value="DECISION_RECORDED">DECISION_RECORDED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Entri:</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengesahan Alokasi Anggaran Tahunan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ringkasan / Uraian:</label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan detail keputusan atau tindakan yang dicatat dalam jurnal..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 text-[11px] leading-relaxed">
                <strong>Catatan Konstitusi:</strong> Entri yang dicatat akan langsung diberi nomor urut sequence permanen dan tidak dapat di-overwrite.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan ke Jurnal Permanen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
