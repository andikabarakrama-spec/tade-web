import React, { useState, useEffect } from 'react';
import {
  Users,
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  Send,
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  BellRing
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface AssignmentStep {
  id: string;
  role: UserRole;
  roleTitle: string;
  assigneeName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'ESCALATED';
  deadline: string;
  actionRequired: string;
  completedAt?: string;
  notes?: string;
}

export interface WorkflowRoutingItem {
  id: string;
  title: string;
  category: 'GOVERNANCE' | 'ACADEMIC' | 'FINANCE' | 'EVENT' | 'FACILITY' | 'LEGAL';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  initiatedBy: {
    name: string;
    role: UserRole;
    timestamp: string;
  };
  currentHolderRole: UserRole;
  currentHolderName: string;
  overallStatus: 'DRAFT' | 'IN_ROUTING' | 'COMPLETED' | 'OVERDUE' | 'ESCALATED';
  targetDueDate: string;
  escalationLevel: 'NONE' | 'H_MINUS_7' | 'H_MINUS_3' | 'H_MINUS_1' | 'DAY_H_ESCALATED';
  steps: AssignmentStep[];
  autoRemindersSent: number;
}

const INITIAL_ROUTING_ITEMS: WorkflowRoutingItem[] = [
  {
    id: 'WR-2026-081',
    title: 'Pembaruan Dokumen Perizinan & Verifikasi KTP Pengurus Yayasan 2026/2027',
    category: 'LEGAL',
    priority: 'HIGH',
    initiatedBy: {
      name: 'KH. Achmad Shodiq (Ketua Yayasan)',
      role: 'KETUA_YAYASAN',
      timestamp: '14 Agu 2026, 07:15 WIB'
    },
    currentHolderRole: 'KEPALA_SEKOLAH',
    currentHolderName: 'Hj. Siti Aminah, S.Pd.I',
    overallStatus: 'IN_ROUTING',
    targetDueDate: '2026-08-25',
    escalationLevel: 'H_MINUS_7',
    autoRemindersSent: 2,
    steps: [
      {
        id: 's1',
        role: 'KETUA_YAYASAN',
        roleTitle: 'Ketua Yayasan',
        assigneeName: 'KH. Achmad Shodiq',
        status: 'COMPLETED',
        deadline: '2026-08-14',
        actionRequired: 'Inisiasi Misi & Penandatanganan Surat Pengantar Yayasan',
        completedAt: '14 Agu 2026, 07:30 WIB',
        notes: 'Disposisi langsung ke Kepala Sekolah untuk pengumpulan berkas fisik & digital.'
      },
      {
        id: 's2',
        role: 'KEPALA_SEKOLAH',
        roleTitle: 'Kepala Sekolah',
        assigneeName: 'Hj. Siti Aminah, S.Pd.I',
        status: 'IN_PROGRESS',
        deadline: '2026-08-18',
        actionRequired: 'Review kelengkapan KTP/KK Pengurus & Koordinasi dengan Notaris',
        notes: 'Sedang menunggu pengiriman scan KTP dari Bendahara Yayasan.'
      },
      {
        id: 's3',
        role: 'ADMIN',
        roleTitle: 'Admin Tata Usaha',
        assigneeName: 'Fatimah Az-Zahra, S.Kom',
        status: 'PENDING',
        deadline: '2026-08-21',
        actionRequired: 'Arsip digital di Smart Vault & Pengunggahan ke Portal Kemenkumham/Kemdikbud'
      },
      {
        id: 's4',
        role: 'GURU',
        roleTitle: 'Koordinator Administrasi',
        assigneeName: 'Ustadzah Nurul',
        status: 'PENDING',
        deadline: '2026-08-23',
        actionRequired: 'Pengecekan silang keselarasan data Dapodik dengan Berkas Yayasan'
      },
      {
        id: 's5',
        role: 'SUPER_ADMIN',
        roleTitle: 'Super Admin',
        assigneeName: 'Super Admin Security',
        status: 'PENDING',
        deadline: '2026-08-25',
        actionRequired: 'Final Verifikasi, Segel Kriptografi QR & Penguncian Status Selesai'
      }
    ]
  },
  {
    id: 'WR-2026-082',
    title: 'Pelaksanaan Program Manasik Haji Cilik & Study Tour Edukatif 2026',
    category: 'EVENT',
    priority: 'URGENT',
    initiatedBy: {
      name: 'KH. Achmad Shodiq (Ketua Yayasan)',
      role: 'KETUA_YAYASAN',
      timestamp: '13 Agu 2026, 09:00 WIB'
    },
    currentHolderRole: 'ADMIN',
    currentHolderName: 'Fatimah Az-Zahra, S.Kom',
    overallStatus: 'IN_ROUTING',
    targetDueDate: '2026-08-20',
    escalationLevel: 'H_MINUS_3',
    autoRemindersSent: 4,
    steps: [
      {
        id: 's1',
        role: 'KETUA_YAYASAN',
        roleTitle: 'Ketua Yayasan',
        assigneeName: 'KH. Achmad Shodiq',
        status: 'COMPLETED',
        deadline: '2026-08-13',
        actionRequired: 'Persetujuan Anggaran Pokok & Jadwal Kegiatan Manasik',
        completedAt: '13 Agu 2026, 09:45 WIB'
      },
      {
        id: 's2',
        role: 'KEPALA_SEKOLAH',
        roleTitle: 'Kepala Sekolah',
        assigneeName: 'Hj. Siti Aminah, S.Pd.I',
        status: 'COMPLETED',
        deadline: '2026-08-14',
        actionRequired: 'Penerbitan SK Kepanitiaan & Alokasi Guru Pembimbing',
        completedAt: '14 Agu 2026, 08:20 WIB'
      },
      {
        id: 's3',
        role: 'ADMIN',
        roleTitle: 'Admin Tata Usaha',
        assigneeName: 'Fatimah Az-Zahra, S.Kom',
        status: 'IN_PROGRESS',
        deadline: '2026-08-16',
        actionRequired: 'Cetak Lembar Konfirmasi Wali Murid & Surat Izin Dinas Perhubungan'
      },
      {
        id: 's4',
        role: 'GURU',
        roleTitle: 'Guru & Wali Kelas',
        assigneeName: 'Dewan Guru Kelompok A & B',
        status: 'PENDING',
        deadline: '2026-08-18',
        actionRequired: 'Rekap kehadiran peserta & persiapan seragam ihram santri'
      },
      {
        id: 's5',
        role: 'KEUANGAN',
        roleTitle: 'Staf Keuangan',
        assigneeName: 'Ahmad Fauzi, S.E',
        status: 'PENDING',
        deadline: '2026-08-20',
        actionRequired: 'Rekonsiliasi pembayaran paket manasik & pelunasan sewa lokasi'
      }
    ]
  },
  {
    id: 'WR-2026-083',
    title: 'Sinkronisasi Data Siswa Penerima Dana BOS PAUD Tahap II',
    category: 'FINANCE',
    priority: 'NORMAL',
    initiatedBy: {
      name: 'Hj. Siti Aminah, S.Pd.I',
      role: 'KEPALA_SEKOLAH',
      timestamp: '12 Agu 2026, 11:20 WIB'
    },
    currentHolderRole: 'GURU',
    currentHolderName: 'Ustadzah Nurul',
    overallStatus: 'IN_ROUTING',
    targetDueDate: '2026-08-30',
    escalationLevel: 'H_MINUS_7',
    autoRemindersSent: 1,
    steps: [
      {
        id: 's1',
        role: 'KEPALA_SEKOLAH',
        roleTitle: 'Kepala Sekolah',
        assigneeName: 'Hj. Siti Aminah, S.Pd.I',
        status: 'COMPLETED',
        deadline: '2026-08-12',
        actionRequired: 'Verifikasi pagu anggaran BOS dari Dinas Pendidikan',
        completedAt: '12 Agu 2026, 14:10 WIB'
      },
      {
        id: 's2',
        role: 'GURU',
        roleTitle: 'Wali Kelas & Operator Dapodik',
        assigneeName: 'Ustadzah Nurul',
        status: 'IN_PROGRESS',
        deadline: '2026-08-22',
        actionRequired: 'Update NISN aktif dan data mutabaah kehadiran presensi 100%'
      },
      {
        id: 's3',
        role: 'KEUANGAN',
        roleTitle: 'Bendahara Sekolah',
        assigneeName: 'Ahmad Fauzi, S.E',
        status: 'PENDING',
        deadline: '2026-08-26',
        actionRequired: 'Penyusunan Rencana Kerja Anggaran Sekolah (RKAS) BOS Tahap II'
      },
      {
        id: 's4',
        role: 'KETUA_YAYASAN',
        roleTitle: 'Ketua Yayasan',
        assigneeName: 'KH. Achmad Shodiq',
        status: 'PENDING',
        deadline: '2026-08-30',
        actionRequired: 'Pengesahan dan Tanda Tangan Laporan Realisasi BOS'
      }
    ]
  }
];

export const SmartAssignmentEngine: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [routings, setRoutings] = useState<WorkflowRoutingItem[]>(INITIAL_ROUTING_ITEMS);
  const [selectedRoutingId, setSelectedRoutingId] = useState<string>('WR-2026-081');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isEscalating, setIsEscalating] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const selectedItem = routings.find(r => r.id === selectedRoutingId) || routings[0];

  const handleAdvanceStep = (routingId: string, stepId: string) => {
    setRoutings(prev =>
      prev.map(item => {
        if (item.id !== routingId) return item;
        const updatedSteps = item.steps.map((s, idx) => {
          if (s.id === stepId) {
            return { ...s, status: 'COMPLETED' as const, completedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' };
          }
          return s;
        });

        // Find next pending step
        const nextPendingIdx = updatedSteps.findIndex(s => s.status === 'PENDING');
        if (nextPendingIdx !== -1) {
          updatedSteps[nextPendingIdx].status = 'IN_PROGRESS';
          const nextStep = updatedSteps[nextPendingIdx];
          return {
            ...item,
            steps: updatedSteps,
            currentHolderRole: nextStep.role,
            currentHolderName: nextStep.assigneeName
          };
        } else {
          return {
            ...item,
            steps: updatedSteps,
            overallStatus: 'COMPLETED' as const
          };
        }
      })
    );

    setActionSuccessMsg('Tahapan alur penugasan berhasil diselesaikan dan didelegasikan ke level berikutnya.');
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleTriggerAutoEscalation = () => {
    setIsEscalating(true);
    setTimeout(() => {
      setRoutings(prev =>
        prev.map(item => {
          if (item.overallStatus === 'IN_ROUTING') {
            return {
              ...item,
              autoRemindersSent: item.autoRemindersSent + 1,
              escalationLevel: item.escalationLevel === 'H_MINUS_7' ? 'H_MINUS_3' : 'H_MINUS_1'
            };
          }
          return item;
        })
      );
      setIsEscalating(false);
      setActionSuccessMsg('Sistem Pengingat Mandiri (Auto Follow-Up H-7 / H-3 / H-1) telah mengirimkan notifikasi eskalasi sesuai hierarki.');
      setTimeout(() => setActionSuccessMsg(null), 5000);
    }, 800);
  };

  const filteredRoutings = routings.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Smart Assignment Engine & Hierarchical Routing</h2>
              <p className="text-sm font-medium text-stone-500">
                Pendelegasian Tugas Otomatis Bertingkat: Ketua Yayasan → Kepala Sekolah → Admin → Guru → Wali Murid
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerAutoEscalation}
            disabled={isEscalating}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-2 transition disabled:opacity-50 cursor-pointer min-h-[44px]"
          >
            <BellRing className={`w-4 h-4 ${isEscalating ? 'animate-spin' : ''}`} />
            {isEscalating ? 'Mengirim Pengingat...' : 'Jalankan Auto Follow-Up (H-7 s/d Day H)'}
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Grid: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Routing Tasks List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Alur Tugas Aktif ({filteredRoutings.length})
              </h3>
              <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-bold">
                TADE RBAC Safe
              </span>
            </div>

            {/* Search & Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari ID atau judul penugasan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {['ALL', 'LEGAL', 'EVENT', 'FINANCE'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                      categoryFilter === cat ? 'bg-teal-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Cards */}
            <div className="space-y-3">
              {filteredRoutings.map(item => {
                const isSelected = item.id === selectedRoutingId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRoutingId(item.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {item.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800'
                            : item.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2">{item.title}</h4>

                    <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span className="truncate max-w-[130px]">{item.currentHolderName}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-stone-400">Target: {item.targetDueDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Routing Detail & Hierarchical Progress */}
        <div className="lg:col-span-7 space-y-4">
          {selectedItem && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="space-y-2 pb-4 border-b border-stone-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900">
                      {selectedItem.id}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                      Kategori: {selectedItem.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Eskalasi: {selectedItem.escalationLevel}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900">{selectedItem.title}</h3>

                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <span>Diinisiasi oleh: <strong>{selectedItem.initiatedBy.name}</strong></span>
                  <span>•</span>
                  <span>{selectedItem.initiatedBy.timestamp}</span>
                </div>
              </div>

              {/* Hierarchy Pipeline Steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-black tracking-wider uppercase text-stone-500">
                  Tahapan Rantai Komando & Eksekusi ({selectedItem.steps.filter(s => s.status === 'COMPLETED').length}/{selectedItem.steps.length} Selesai)
                </h4>

                <div className="space-y-3">
                  {selectedItem.steps.map((step, idx) => {
                    const isDone = step.status === 'COMPLETED';
                    const isCurrent = step.status === 'IN_PROGRESS';
                    const isPending = step.status === 'PENDING';

                    return (
                      <div
                        key={step.id}
                        className={`p-4 rounded-2xl border transition ${
                          isDone
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : isCurrent
                            ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-200/50 shadow-xs'
                            : 'bg-stone-50/60 border-stone-200 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-amber-600 text-white animate-pulse'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-black text-slate-900">{step.roleTitle}</span>
                                <span className="text-xs font-bold text-stone-500">({step.assigneeName})</span>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    isDone
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : isCurrent
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-stone-100 text-stone-600'
                                  }`}
                                >
                                  {step.status}
                                </span>
                              </div>

                              <p className="text-xs font-semibold text-slate-700">{step.actionRequired}</p>

                              {step.notes && (
                                <p className="text-[11px] font-medium text-stone-500 italic">
                                  Catatan: "{step.notes}"
                                </p>
                              )}

                              {step.completedAt && (
                                <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Selesai pada: {step.completedAt}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Button for Current Step */}
                          {isCurrent && (
                            <button
                              onClick={() => handleAdvanceStep(selectedItem.id, step.id)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Tandai Selesai
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TADE Governance SLA Box */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-600 font-medium">
                  <Shield className="w-4 h-4 text-teal-600" />
                  <span>Jaminan SLA & Notifikasi: Otomatis eskalasi H-7, H-3, H-1 ke level manajerial di atasnya jika belum ditandatangani.</span>
                </div>
                <span className="font-bold text-stone-900 shrink-0">TADE Constitution v3.2</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
