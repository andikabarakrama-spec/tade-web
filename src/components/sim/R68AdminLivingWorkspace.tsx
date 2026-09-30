import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  UserCheck,
  Archive,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Sparkles,
  Command,
  CheckSquare,
  Square,
  Printer,
  QrCode,
  Download,
  AlertTriangle,
  RefreshCw,
  Send,
  Eye,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { AdminNeverAloneAssistant } from '../admin/AdminNeverAloneAssistant';

export interface AdminOperationalTask {
  id: string;
  category: 'PPDB' | 'PAYMENT' | 'DOCUMENT' | 'ARCHIVE' | 'STUDENT_DATA';
  title: string;
  requester: string;
  submittedAt: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  status: 'PENDING' | 'PROCESSED' | 'REJECTED';
  detail: string;
}

const INITIAL_ADMIN_TASKS: AdminOperationalTask[] = [
  {
    id: 'TSK-ADM-01',
    category: 'PPDB',
    title: 'Verifikasi Berkas Calon Santri: Muhammad Fatih (Kelompok A)',
    requester: 'Bpk. Hendra Gunawan (Wali Murid)',
    submittedAt: '14 Agu 2026, 08:30 WIB',
    priority: 'URGENT',
    status: 'PENDING',
    detail: 'Scan Akta Kelahiran & Kartu Keluarga (KK) telah diunggah. NIK valid, menunggu validasi administratif.'
  },
  {
    id: 'TSK-ADM-02',
    category: 'PAYMENT',
    title: 'Konfirmasi Bukti Transfer SPP Bulan Agustus: Aisyah Nur (Kelompok B)',
    requester: 'Ibu Ratna Dewi (Wali Murid)',
    submittedAt: '14 Agu 2026, 08:45 WIB',
    priority: 'HIGH',
    status: 'PENDING',
    detail: 'Transfer Bank Jatim Rp 250.000,- terdeteksi di mutasi. Siap diterbitkan kuitansi berstempel digital.'
  },
  {
    id: 'TSK-ADM-03',
    category: 'DOCUMENT',
    title: 'Penerbitan Surat Keterangan Aktif Belajar: Danial Rasyid',
    requester: 'Ustadzah Fatimah (Wali Kelas A1)',
    submittedAt: '14 Agu 2026, 09:10 WIB',
    priority: 'NORMAL',
    status: 'PENDING',
    detail: 'Permohonan untuk kelengkapan berkas mutasi dinas orang tua ke Surabaya.'
  },
  {
    id: 'TSK-ADM-04',
    category: 'ARCHIVE',
    title: 'OCR & Klasifikasi Smart Vault: Surat Edaran Dinas Pendidikan Jember No. 420/88',
    requester: 'Kepala Sekolah Hj. Siti Aminah',
    submittedAt: '14 Agu 2026, 09:25 WIB',
    priority: 'HIGH',
    status: 'PENDING',
    detail: 'Scan PDF surat edaran kalender libur hari besar keagamaan nasional.'
  },
  {
    id: 'TSK-ADM-05',
    category: 'PPDB',
    title: 'Verifikasi Berkas Calon Santri: Khadijah Azzahra (Kelompok B)',
    requester: 'Ibu Maryam (Wali Murid)',
    submittedAt: '14 Agu 2026, 09:40 WIB',
    priority: 'HIGH',
    status: 'PENDING',
    detail: 'Formulir online dan foto 3x4 santri telah lengkap.'
  }
];

export const R68AdminLivingWorkspace: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [tasks, setTasks] = useState<AdminOperationalTask[]>(INITIAL_ADMIN_TASKS);
  const [activeTab, setActiveTab] = useState<'INBOX' | 'PPDB_QUEUE' | 'DOC_CENTER' | 'BULK_PROCESSING'>('INBOX');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickActionAlert, setQuickActionAlert] = useState<string | null>(null);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Keyboard Shortcuts for Admin velocity
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1') setActiveTab('INBOX');
      if (e.key === '2') setActiveTab('PPDB_QUEUE');
      if (e.key === '3') setActiveTab('DOC_CENTER');
      if (e.key === '4') setActiveTab('BULK_PROCESSING');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProcessTask = (taskId: string, action: 'PROCESSED' | 'REJECTED') => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: action } : t))
    );
    const task = tasks.find(t => t.id === taskId);
    setQuickActionAlert(`Tugas "${task?.title}" berhasil ${action === 'PROCESSED' ? 'disetujui & diproses' : 'ditolak'}.`);
    setTimeout(() => setQuickActionAlert(null), 4000);
  };

  const handleToggleSelectTask = (taskId: string) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAllTasks = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    }
  };

  const handleExecuteBulkApproval = () => {
    if (selectedTaskIds.length === 0) return;
    setIsProcessingBulk(true);

    setTimeout(() => {
      setTasks(prev =>
        prev.map(t => (selectedTaskIds.includes(t.id) ? { ...t, status: 'PROCESSED' } : t))
      );
      setQuickActionAlert(`Berhasil memproses massal ${selectedTaskIds.length} berkas dalam 1-klik!`);
      setSelectedTaskIds([]);
      setIsProcessingBulk(false);
      setTimeout(() => setQuickActionAlert(null), 5000);
    }, 1000);
  };

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.requester.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'PPDB_QUEUE') return matchSearch && t.category === 'PPDB';
    if (activeTab === 'DOC_CENTER') return matchSearch && (t.category === 'DOCUMENT' || t.category === 'ARCHIVE');
    return matchSearch;
  });

  const pendingCount = tasks.filter(t => t.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Card with High-Velocity Admin Tone */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
              <Zap className="w-8 h-8 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-400/20 text-indigo-300 border border-indigo-400/30">
                  Phase 4 Admin Living Workspace
                </span>
                <span className="text-xs text-indigo-200/80 font-bold">• High-Velocity Operational Hub</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">Admin Living Operations Workspace</h2>
              <p className="text-sm text-indigo-100/80 font-medium">
                Pusat Eksekusi Operasional Cepat: Inbox Prioritas, Antrean PPDB, Pemrosesan Massal (Bulk), & Smart Document Center.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-xs font-semibold text-slate-300">
            <Command className="w-4 h-4 text-indigo-400" />
            <span>Shortcuts: Tekan <strong>1-4</strong> untuk navigasi cepat tab</span>
          </div>
        </div>
      </div>

      {/* Admin Never Alone Assistant (Sprint G8 P4) */}
      <AdminNeverAloneAssistant />

      {quickActionAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{quickActionAlert}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-black text-lg">
            {pendingCount}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500">Antrean Menunggu</div>
            <div className="text-base font-extrabold text-slate-900">Tugas Pending</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-black text-lg">
            {tasks.filter(t => t.status === 'PROCESSED').length}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500">Selesai Diproses</div>
            <div className="text-base font-extrabold text-slate-900">Hari Ini</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-black text-lg">
            {tasks.filter(t => t.category === 'PPDB').length}
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500">PPDB Gel. Khusus</div>
            <div className="text-base font-extrabold text-slate-900">Berkas Masuk</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 font-black text-lg">
            100%
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500">SLA Integritas</div>
            <div className="text-base font-extrabold text-slate-900">Tepat Waktu</div>
          </div>
        </div>
      </div>

      {/* Interactive Main Board */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
        {/* Navigation Tabs + Search + Bulk Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl overflow-x-auto text-xs w-full md:w-auto">
            {[
              { key: 'INBOX', label: '1. Task Inbox (Semua)', icon: Inbox },
              { key: 'PPDB_QUEUE', label: '2. Antrean PPDB', icon: UserCheck },
              { key: 'DOC_CENTER', label: '3. Dokumen & Arsip', icon: FileText },
              { key: 'BULK_PROCESSING', label: '4. Pemrosesan Massal', icon: CheckSquare }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari tugas / pemohon..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {selectedTaskIds.length > 0 && (
              <button
                onClick={handleExecuteBulkApproval}
                disabled={isProcessingBulk}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isProcessingBulk ? 'Memproses...' : `Proses Massal (${selectedTaskIds.length})`}
              </button>
            )}
          </div>
        </div>

        {/* Task Table / Cards List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 px-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAllTasks}
                className="font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Square className="w-4 h-4 text-stone-400" />
                )}
                Pilih Semua ({filteredTasks.length})
              </button>
            </div>
            <span>Menampilkan {filteredTasks.length} tugas operasional</span>
          </div>

          <div className="space-y-3">
            {filteredTasks.map(task => {
              const isSelected = selectedTaskIds.includes(task.id);
              const isDone = task.status === 'PROCESSED';
              const isRejected = task.status === 'REJECTED';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isRejected
                      ? 'bg-rose-50/40 border-rose-200'
                      : isSelected
                      ? 'bg-indigo-50/40 border-indigo-400 ring-2 ring-indigo-200'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleSelectTask(task.id)}
                      className="mt-1 cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-stone-100 text-stone-700 uppercase">
                          {task.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.priority === 'URGENT'
                              ? 'bg-rose-100 text-rose-800'
                              : task.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[11px] font-medium text-stone-400">• {task.submittedAt}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                      <p className="text-xs text-stone-600 font-medium">{task.detail}</p>
                      <div className="text-[11px] font-semibold text-stone-500">
                        Diajukan oleh: <strong>{task.requester}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {task.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleProcessTask(task.id, 'PROCESSED')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer min-h-[38px]"
                        >
                          <Check className="w-3.5 h-3.5" /> Setujui & Terbitkan
                        </button>
                        <button
                          onClick={() => handleProcessTask(task.id, 'REJECTED')}
                          className="px-3 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-xl text-xs font-bold transition cursor-pointer min-h-[38px]"
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                          isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isDone ? 'Selesai Diproses' : 'Ditolak'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
