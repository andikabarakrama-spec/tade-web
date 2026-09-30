import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  AlertCircle,
  FileText,
  DollarSign,
  AlertOctagon
} from 'lucide-react';
import { 
  InstitutionalApprovalWorkflow, 
  ApprovalRequest, 
  ApprovalCategory, 
  ApprovalStatus 
} from '../../core/digitalGov/institutionalApprovalWorkflow';
import { useAuth } from '../../context/AuthContext';

export const InstitutionalApprovalWorkflowViewer: React.FC = () => {
  const workflow = useMemo(() => InstitutionalApprovalWorkflow.getInstance(), []);
  const { activeRole, userProfile } = useAuth();
  const [requests, setRequests] = useState<ApprovalRequest[]>(() => workflow.getAllRequests());
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Request Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState<ApprovalCategory>('FINANCIAL_DISBURSEMENT');
  const [newTitle, setNewTitle] = useState('');
  const [newJustification, setNewJustification] = useState('');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newTargetRole, setNewTargetRole] = useState<'SUPER_ADMIN' | 'KETUA_YAYASAN' | 'KEPALA_SEKOLAH'>('SUPER_ADMIN');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Decision Remarks
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
      const matchQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.justification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.submittedByName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [requests, selectedStatus, searchQuery]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newJustification.trim()) return;

    const res = workflow.submitRequest({
      category: newCategory,
      title: newTitle.trim(),
      justification: newJustification.trim(),
      submittedByRole: activeRole,
      submittedByName: userProfile?.displayName || activeRole,
      currentAssigneeRole: newTargetRole,
      amount: newAmount ? parseFloat(newAmount) : undefined
    });

    if (res.success) {
      setRequests(workflow.getAllRequests());
      setNewTitle('');
      setNewJustification('');
      setNewAmount('');
      setShowAddModal(false);
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleProcessDecision = (requestId: string, action: 'APPROVE' | 'REJECT') => {
    const actorName = userProfile?.displayName || activeRole;
    const notes = decisionNotes[requestId] || (action === 'APPROVE' ? 'Disetujui secara resmi.' : 'Ditolak.');
    const res = workflow.processDecision(requestId, action, actorName, activeRole, notes);

    if (res.success) {
      setRequests(workflow.getAllRequests());
      setFeedback({ type: 'success', message: res.message });
      setDecisionNotes(prev => {
        const copy = { ...prev };
        delete copy[requestId];
        return copy;
      });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const getStatusBadge = (st: ApprovalStatus) => {
    switch (st) {
      case 'SUBMITTED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-blue-50 text-blue-700 border border-blue-200"><Clock className="w-3 h-3" /> DIAJUKAN</span>;
      case 'UNDER_REVIEW':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> PENINJAUAN</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> DISETUJUI</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" /> DITOLAK</span>;
    }
  };

  return (
    <div id="r778-institutional-approval-workflow" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold font-mono border border-indigo-500/30">
              <CheckSquare className="w-3.5 h-3.5" /> R778 • INSTITUTIONAL APPROVAL WORKFLOW
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hierarchical Institutional Approval Gateway
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Alur persetujuan terstruktur berjenjang untuk Super Admin, Ketua Yayasan, dan Kepala Sekolah dengan pencatatan otomatis ke Jurnal Konstitusi permanen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Pending Approvals</p>
              <p className="text-2xl font-black text-amber-400 font-mono">
                {requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Ajukan Permohonan
            </button>
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

      {/* Filter & Requests List */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                  selectedStatus === st
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
              placeholder="Cari permohonan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4 pt-2">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'SUBMITTED' || req.status === 'UNDER_REVIEW';
            const canApprove = (req.currentAssigneeRole === activeRole || req.requiredRole.includes(activeRole) || activeRole === 'SUPER_ADMIN') && isPending;

            return (
              <div 
                key={req.requestId}
                className="p-5 bg-stone-50/70 rounded-2xl border border-stone-200 hover:border-indigo-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {req.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {req.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                        {req.priority}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{req.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(req.status)}
                    <span className="text-[11px] text-stone-400 font-mono">
                      {new Date(req.submittedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                  {req.justification}
                </p>

                {req.amount !== undefined && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold font-mono">
                    <DollarSign className="w-3.5 h-3.5" />
                    Nominal Anggaran: Rp {req.amount.toLocaleString('id-ID')}
                  </div>
                )}

                {req.decisionNotes && (
                  <div className="p-3 bg-stone-100/70 rounded-xl border border-stone-200 text-xs space-y-1">
                    <p className="text-[10px] font-bold text-stone-500 uppercase font-mono">Catatan Pengambil Keputusan:</p>
                    <p className="text-stone-700 italic">&quot;{req.decisionNotes}&quot;</p>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-stone-500">
                  <div className="font-mono text-[10px] text-stone-400 space-y-0.5">
                    <div>
                      Pemohon: <strong className="text-stone-700 font-sans">{req.submittedByName}</strong> ({req.submittedByRole})
                    </div>
                    <div>
                      Otoritas Persetujuan: <strong className="text-indigo-700 font-mono">{req.currentAssigneeRole}</strong>
                      {req.reviewedByName && <span> • Diproses oleh: <strong className="text-emerald-700 font-sans">{req.reviewedByName}</strong> ({req.reviewedByRole})</span>}
                    </div>
                  </div>

                  {canApprove && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder="Catatan pengesahan..."
                        value={decisionNotes[req.requestId] || ''}
                        onChange={(e) => setDecisionNotes({ ...decisionNotes, [req.requestId]: e.target.value })}
                        className="text-xs p-1.5 bg-white border border-stone-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleProcessDecision(req.requestId, 'APPROVE')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                        </button>
                        <button
                          onClick={() => handleProcessDecision(req.requestId, 'REJECT')}
                          className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" /> Ajukan Permohonan Persetujuan Institusional
            </h2>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                  Kategori Permohonan
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ApprovalCategory)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-sans"
                >
                  <option value="FINANCIAL_DISBURSEMENT">FINANCIAL_DISBURSEMENT (Pencairan Kas / Anggaran)</option>
                  <option value="POLICY_AMENDMENT">POLICY_AMENDMENT (Perubahan Kebijakan Konstitusi)</option>
                  <option value="STAFF_APPOINTMENT">STAFF_APPOINTMENT (Pengangkatan / Perubahan Peran Staff)</option>
                  <option value="CURRICULUM_CHANGE">CURRICULUM_CHANGE (Kurikulum / Modul Belajar)</option>
                  <option value="INFRASTRUCTURE">INFRASTRUCTURE (Perangkat / Server / Sarpras)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                  Judul Permohonan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengadaan Alat Peraga Edukatif Sentra Balok"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {newCategory === 'FINANCIAL_DISBURSEMENT' && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                    Nominal Anggaran (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 1500000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                  Justifikasi & Dasar Pertimbangan
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan kebutuhan, urgensi, dan keterkaitan dengan pedoman PAUD..."
                  value={newJustification}
                  onChange={(e) => setNewJustification(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                  Target Pejabat Penyetuju
                </label>
                <select
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                >
                  <option value="KEPALA_SEKOLAH">KEPALA_SEKOLAH (Kepala Sekolah)</option>
                  <option value="KETUA_YAYASAN">KETUA_YAYASAN (Ketua Yayasan)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Super Admin)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer"
                >
                  Ajukan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
