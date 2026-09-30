import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Archive, 
  FileText,
  Lock,
  Layers,
  Crown,
  AlertCircle
} from 'lucide-react';
import { 
  FounderDecisionLedger, 
  FounderDecision, 
  DecisionCategory, 
  DecisionStatus 
} from '../../core/digitalGov/founderDecisionLedger';
import { useAuth } from '../../context/AuthContext';

export const FounderDecisionLedgerViewer: React.FC = () => {
  const ledger = useMemo(() => FounderDecisionLedger.getInstance(), []);
  const { activeRole, userProfile } = useAuth();
  const [decisions, setDecisions] = useState<FounderDecision[]>(() => ledger.getAllDecisions());
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<DecisionStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Decision Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState<DecisionCategory>('STRATEGIC_DIRECTION');
  const [newTitle, setNewTitle] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredDecisions = useMemo(() => {
    return decisions.filter(d => {
      const matchStatus = selectedStatusFilter === 'ALL' || d.status === selectedStatusFilter;
      const matchQuery = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [decisions, selectedStatusFilter, searchQuery]);

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newReason.trim()) return;

    ledger.createDecision({
      category: newCategory,
      title: newTitle,
      reason: newReason,
      impactAssessment: newImpact,
      authorRole: activeRole,
      authorName: userProfile?.displayName || activeRole,
      founderNotes: newNotes
    });

    setDecisions(ledger.getAllDecisions());
    setNewTitle('');
    setNewReason('');
    setNewImpact('');
    setNewNotes('');
    setShowAddModal(false);
    setFeedback({ type: 'success', message: 'Draf keputusan baru berhasil dicatat di buku besar.' });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateStatus = (decisionId: string, status: DecisionStatus) => {
    const actorName = userProfile?.displayName || activeRole;
    const res = ledger.updateStatus(decisionId, status, actorName, activeRole);
    if (res.success) {
      setDecisions(ledger.getAllDecisions());
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const getStatusBadge = (status: DecisionStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-stone-100 text-stone-700 border border-stone-200"><Clock className="w-3 h-3" /> DRAFT</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> APPROVED</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" /> REJECTED</span>;
      case 'ARCHIVED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-purple-50 text-purple-700 border border-purple-200"><Archive className="w-3 h-3" /> ARCHIVED</span>;
    }
  };

  return (
    <div id="r775-founder-decision-ledger" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold font-mono border border-amber-500/30">
              <Crown className="w-3.5 h-3.5" /> R775 • FOUNDER DECISION LEDGER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sovereign Strategic Decision Ledger
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Buku besar keputusan puncak institusi di bawah prinsip One Sovereign Principle untuk mendokumentasikan arah strategis, kurikulum, dan otorisasi anggaran berdaulat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Decisions</p>
              <p className="text-2xl font-black text-amber-400 font-mono">{decisions.length}</p>
            </div>
            {(activeRole === 'SUPER_ADMIN' || activeRole === 'KETUA_YAYASAN' || activeRole === 'ADMIN') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Buat Keputusan Baru
              </button>
            )}
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          {feedback.message}
        </div>
      )}

      {/* Filter and Decisions List */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['ALL', 'DRAFT', 'APPROVED', 'REJECTED', 'ARCHIVED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                  selectedStatusFilter === st
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
              placeholder="Cari keputusan institusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Decision Cards */}
        <div className="space-y-4 pt-2">
          {filteredDecisions.map((dec) => (
            <div 
              key={dec.decisionId}
              className="p-5 bg-stone-50/70 rounded-2xl border border-stone-200 hover:border-amber-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {dec.code}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      {dec.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{dec.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(dec.status)}
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(dec.decisionDate).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <p className="text-[10px] font-bold text-stone-400 uppercase font-mono">Latar Belakang / Alasan:</p>
                  <p className="text-stone-700 leading-relaxed">{dec.reason}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <p className="text-[10px] font-bold text-stone-400 uppercase font-mono">Dampak Institusional:</p>
                  <p className="text-stone-700 leading-relaxed">{dec.impactAssessment}</p>
                </div>
              </div>

              {dec.founderNotes && (
                <p className="text-xs text-amber-900 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 italic">
                  <strong>Catatan Founder:</strong> {dec.founderNotes}
                </p>
              )}

              <div className="pt-2 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-stone-500">
                <div className="font-mono text-[10px] text-stone-400">
                  Diajukan oleh: <strong className="text-stone-700 font-sans">{dec.authorName}</strong> ({dec.authorRole})
                  {dec.approvedBy && <span> • Disahkan oleh: <strong className="text-emerald-700">{dec.approvedBy}</strong></span>}
                </div>

                {/* Actions for SUPER_ADMIN or KETUA_YAYASAN */}
                {(activeRole === 'SUPER_ADMIN' || activeRole === 'KETUA_YAYASAN') && (
                  <div className="flex items-center gap-2">
                    {dec.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(dec.decisionId, 'APPROVED')}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Sahkan Keputusan
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(dec.decisionId, 'REJECTED')}
                          className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" /> Tolak
                        </button>
                      </>
                    )}
                    {dec.status === 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(dec.decisionId, 'ARCHIVED')}
                        className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                      >
                        <Archive className="w-3 h-3" /> Arsipkan
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredDecisions.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-xs">
              Tidak ada keputusan institusi yang cocok dengan kriteria.
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-600" /> Buat Draf Keputusan Founder Baru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDecision} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kategori Keputusan:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DecisionCategory)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                >
                  <option value="STRATEGIC_DIRECTION">STRATEGIC_DIRECTION</option>
                  <option value="CURRICULUM_CHARTER">CURRICULUM_CHARTER</option>
                  <option value="SECURITY_POLICY">SECURITY_POLICY</option>
                  <option value="BUDGET_ALLOCATION">BUDGET_ALLOCATION</option>
                  <option value="INFRASTRUCTURE_EXPANSION">INFRASTRUCTURE_EXPANSION</option>
                  <option value="DISASTER_RECOVERY">DISASTER_RECOVERY</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Keputusan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Ketetapan Jam Operasional Mandiri SIM"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Latar Belakang / Alasan:</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan alasan strategis keputusan ini dibuat..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Dampak Institusional:</label>
                <textarea
                  rows={2}
                  placeholder="Dampak terhadap operasional, akademik, atau finansial..."
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Khusus Founder (Opsional):</label>
                <input
                  type="text"
                  placeholder="Petunjuk implementasi atau syarat khusus..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs"
                />
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan Draf Keputusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
