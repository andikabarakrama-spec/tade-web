import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Plus,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  Square,
  Sparkles,
  Crown
} from 'lucide-react';
import {
  cabinetResolutionService,
  CabinetResolution,
  ResolutionCategory,
  ResolutionStatus,
  ResolutionPriority
} from '../../services/cabinetResolutionService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const CabinetResolutionTracker: React.FC = () => {
  const [resolutions, setResolutions] = useState<CabinetResolution[]>(
    cabinetResolutionService.getResolutions()
  );
  const [filterStatus, setFilterStatus] = useState<'ALL' | ResolutionStatus>('ALL');
  const [filterCategory, setFilterCategory] = useState<'ALL' | ResolutionCategory>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResolutionCategory>('TATA_KELOLA');
  const [newPriority, setNewPriority] = useState<ResolutionPriority>('HIGH');
  const [newLead, setNewLead] = useState('Kepala Sekolah & Guru');
  const [newDesc, setNewDesc] = useState('');
  const [newActionText, setNewActionText] = useState('');

  const refreshData = () => {
    setResolutions(cabinetResolutionService.getResolutions());
  };

  const handleToggleAction = (resId: string, actionId: string) => {
    cabinetResolutionService.toggleActionItem(resId, actionId);
    refreshData();
  };

  const handleAdvanceStatus = (id: string, nextStatus: ResolutionStatus) => {
    cabinetResolutionService.updateStatus(id, nextStatus, 'Founder Andika');
    founderCommandRecorder.recordCommand(
      'CABINET_RESOLUTION',
      'Dewan Yayasan',
      `Founder memutakhirkan status Resolusi ke: ${nextStatus}`,
      { resolutionId: id, status: nextStatus }
    );
    refreshData();
  };

  const handleAddResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const actionItems = newActionText
      .split('\n')
      .filter(t => t.trim().length > 0)
      .map((t, idx) => ({
        id: `act-${Date.now()}-${idx}`,
        task: t.trim(),
        completed: false,
        assignedRole: newLead
      }));

    cabinetResolutionService.addResolution({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Resolusi strategis pimpinan Yayasan TK Islam Asy Syifa.',
      category: newCategory,
      status: 'In Progress',
      priority: newPriority,
      leadResponsible: newLead,
      targetDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      progressPercentage: 0,
      actionItems: actionItems.length > 0 ? actionItems : [
        { id: `act-${Date.now()}`, task: 'Sosialisasi & pelaksanaan awal kebijakan', completed: false, assignedRole: newLead }
      ]
    });

    founderCommandRecorder.recordCommand(
      'CABINET_RESOLUTION',
      'Dewan Yayasan',
      `Founder menerbitkan Resolusi Baru: "${newTitle}"`
    );

    setNewTitle('');
    setNewDesc('');
    setNewActionText('');
    setShowAddModal(false);
    refreshData();
  };

  const filtered = resolutions.filter(r => {
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchCategory = filterCategory === 'ALL' || r.category === filterCategory;
    return matchStatus && matchCategory;
  });

  const stats = cabinetResolutionService.getStats();

  const getCategoryLabel = (cat: ResolutionCategory) => {
    switch (cat) {
      case 'TATA_KELOLA': return 'Tata Kelola';
      case 'KURIKULUM_TAHFIDZ': return 'Kurikulum & Tahfidz';
      case 'INFRASTRUKTUR_SARPRAS': return 'Sarpras & UKS';
      case 'KEUANGAN_INFAQ': return 'Keuangan & Infaq';
      case 'KEMITRAAN_WALI': return 'Kemitraan Wali';
      default: return cat;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-base font-extrabold text-stone-900">
              Cabinet Resolution Tracker
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {stats.completed + stats.verified}/{stats.total} Terverifikasi ({stats.averageProgress}%)
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Pelacak resolusi strategis dan ketetapan resmi dewan pembina yayasan & pimpinan sekolah.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Terbitkan Resolusi
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['ALL', 'Pending', 'In Progress', 'Verified', 'Completed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                filterStatus === st
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'ALL' ? 'Semua Status' : st}
            </button>
          ))}
        </div>

        <select
          value={filterCategory}
          onChange={(e: any) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-stone-100 border-none text-xs font-bold text-stone-700 focus:outline-none"
        >
          <option value="ALL">Semua Kategori Bidang</option>
          <option value="TATA_KELOLA">Tata Kelola</option>
          <option value="KURIKULUM_TAHFIDZ">Kurikulum & Tahfidz</option>
          <option value="INFRASTRUKTUR_SARPRAS">Sarpras & UKS</option>
          <option value="KEUANGAN_INFAQ">Keuangan & Infaq</option>
          <option value="KEMITRAAN_WALI">Kemitraan Wali</option>
        </select>
      </div>

      {/* Resolutions Grid */}
      <div className="space-y-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-stone-300 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-stone-500">
                    {res.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                    {getCategoryLabel(res.category)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      res.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : res.status === 'Verified'
                        ? 'bg-blue-100 text-blue-800'
                        : res.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-stone-900">
                  {res.title}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {res.description}
                </p>
              </div>

              {/* Progress Circle & Status Trigger */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-stone-500 font-medium">Progres</div>
                  <div className="text-base font-black text-stone-900">{res.progressPercentage}%</div>
                </div>

                {res.status !== 'Completed' && (
                  <button
                    onClick={() => handleAdvanceStatus(res.id, res.status === 'In Progress' ? 'Verified' : 'Completed')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {res.status === 'In Progress' ? 'Verifikasi' : 'Selesaikan'}
                  </button>
                )}
              </div>
            </div>

            {/* Action Items List */}
            <div className="pt-3 border-t border-stone-200/70 space-y-2">
              <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                Daftar Tugas Eksekusi:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {res.actionItems.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleToggleAction(res.id, act.id)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-left transition cursor-pointer text-xs"
                  >
                    {act.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                    <span className={act.completed ? 'line-through text-stone-400' : 'text-stone-700 font-medium'}>
                      {act.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/60 text-[11px] text-stone-400">
              <span>Penanggung Jawab: <strong className="text-stone-700">{res.leadResponsible}</strong></span>
              <span>Target: <strong className="text-stone-700">{res.targetDate}</strong></span>
              {res.verifiedBy && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Diverifikasi oleh {res.verifiedBy}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Resolution */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900">Terbitkan Resolusi Yayasan Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddResolution} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Judul Resolusi</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Pengadaan Alat Peraga Sentra Bermain 2026/2027"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Bidang Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="TATA_KELOLA">Tata Kelola & Kebijakan</option>
                    <option value="KURIKULUM_TAHFIDZ">Kurikulum & Tahfidz</option>
                    <option value="INFRASTRUKTUR_SARPRAS">Infrastruktur & Sarpras</option>
                    <option value="KEUANGAN_INFAQ">Keuangan & Infaq</option>
                    <option value="KEMITRAAN_WALI">Kemitraan Wali Murid</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={newLead}
                    onChange={(e) => setNewLead(e.target.value)}
                    placeholder="Kepala Sekolah / Bendahara"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Rincian Deskripsi</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Latar belakang dan target penetapan kebijakan..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Daftar Tugas (1 baris = 1 tugas)</label>
                <textarea
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  placeholder="Inventarisasi kebutuhan sentra&#10;Koordinasi bendahara & yayasan&#10;Implementasi di kelas"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Sahkan Resolusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
