import React, { useState } from 'react';
import {
  Compass,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Archive,
  Bell,
  Sparkles,
  TrendingUp,
  FolderOpen,
  ArrowRight,
  Shield,
  Layers,
  FileText,
  Users,
  Check,
  Zap,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface ExecutiveMission {
  id: string;
  code: string;
  title: string;
  category: 'LEGAL' | 'PPDB' | 'EVENT' | 'ACADEMIC' | 'FINANCE';
  status: 'ACTIVE' | 'COMPLETED' | 'IN_PREPARATION';
  progressPercent: number;
  startDate: string;
  targetDate: string;
  autoTriggeredAssets: {
    checklistCount: number;
    calendarEvent: string;
    remindersScheduled: string[];
    vaultFolder: string;
    notificationsDispatched: number;
    gklKnowledgeLinked: boolean;
  };
  checklists: {
    id: string;
    task: string;
    role: UserRole;
    done: boolean;
  }[];
}

const PRESET_MISSIONS: Omit<ExecutiveMission, 'id' | 'progressPercent' | 'status'>[] = [
  {
    code: 'MIS-KTP',
    title: 'Pembaruan Dokumen KTP & Legalitas Pengurus Yayasan 2026/2027',
    category: 'LEGAL',
    startDate: '14 Agu 2026',
    targetDate: '25 Agu 2026',
    autoTriggeredAssets: {
      checklistCount: 5,
      calendarEvent: 'Rapat Pleno Yayasan & Notaris (22 Agu 2026)',
      remindersScheduled: ['H-7 (18 Agu)', 'H-3 (22 Agu)', 'H-1 (24 Agu)', 'Day-H (25 Agu)'],
      vaultFolder: 'Smart Vault / Legal & Perizinan / KTP_Pengurus_2026',
      notificationsDispatched: 4,
      gklKnowledgeLinked: true
    },
    checklists: [
      { id: 'c1', task: 'Upload KTP & KK Seluruh Pembina & Pengurus Yayasan', role: 'ADMIN', done: true },
      { id: 'c2', task: 'Draf Surat Pengantar Notaris Penerbitan Akta', role: 'KEPALA_SEKOLAH', done: true },
      { id: 'c3', task: 'Konfirmasi Surat Keterangan Bank Jatim Rekening Yayasan', role: 'KEUANGAN', done: false },
      { id: 'c4', task: 'Tanda Tangan Digital SPTJM oleh Ketua Yayasan', role: 'KETUA_YAYASAN', done: false },
      { id: 'c5', task: 'Arsip Kriptografis Segel QR Code di Vault', role: 'SUPER_ADMIN', done: false }
    ]
  },
  {
    code: 'MIS-PPDB',
    title: 'Persiapan & Pembukaan Gelombang Khusus PPDB 2026',
    category: 'PPDB',
    startDate: '14 Agu 2026',
    targetDate: '30 Agu 2026',
    autoTriggeredAssets: {
      checklistCount: 4,
      calendarEvent: 'Pembukaan Live Formulir PPDB Online (1 Sep 2026)',
      remindersScheduled: ['H-7 (24 Agu)', 'H-3 (28 Agu)', 'Day-H (30 Agu)'],
      vaultFolder: 'Smart Vault / PPDB_2026 / Dokumen_Pendaftaran',
      notificationsDispatched: 8,
      gklKnowledgeLinked: true
    },
    checklists: [
      { id: 'c1', task: 'Penerbitan Brosur & Jadwal Observasi Santri Baru', role: 'ADMIN', done: true },
      { id: 'c2', task: 'Pengesahan Kuota 60 Santri oleh Kepala Sekolah', role: 'KEPALA_SEKOLAH', done: true },
      { id: 'c3', task: 'Penyusunan Format Rekening Pembayaran Infaq Masuk', role: 'KEUANGAN', done: false },
      { id: 'c4', task: 'Persetujuan Deklarasi Pembukaan oleh Ketua Yayasan', role: 'KETUA_YAYASAN', done: false }
    ]
  },
  {
    code: 'MIS-MANASIK',
    title: 'Penyelenggaraan Manasik Haji Cilik & Praktik Ibadah Santri',
    category: 'EVENT',
    startDate: '14 Agu 2026',
    targetDate: '10 Sep 2026',
    autoTriggeredAssets: {
      checklistCount: 5,
      calendarEvent: 'Simulasi Manasik Haji Cilik di Lapangan Tanggul (10 Sep 2026)',
      remindersScheduled: ['H-7 (3 Sep)', 'H-3 (7 Sep)', 'H-1 (9 Sep)', 'Day-H (10 Sep)'],
      vaultFolder: 'Smart Vault / Events / Manasik_Haji_2026',
      notificationsDispatched: 6,
      gklKnowledgeLinked: true
    },
    checklists: [
      { id: 'c1', task: 'Penyusunan Anggaran & Penyewaan Replika Kabah', role: 'KEUANGAN', done: true },
      { id: 'c2', task: 'Penerbitan Surat Pemberitahuan ke Wali Murid', role: 'ADMIN', done: false },
      { id: 'c3', task: 'Distribusi Seragam Ihram & Miniatur Paspor Santri', role: 'GURU', done: false },
      { id: 'c4', task: 'Pengesahan Sambutan Pembukaan Ketua Yayasan', role: 'KETUA_YAYASAN', done: false }
    ]
  },
  {
    code: 'MIS-STUDYTOUR',
    title: 'Study Tour Edukatif: Kebun Raya & Sentra Kerajinan Santri',
    category: 'EVENT',
    startDate: '14 Agu 2026',
    targetDate: '28 Sep 2026',
    autoTriggeredAssets: {
      checklistCount: 4,
      calendarEvent: 'Keberangkatan Bus Wisata Edukasi (28 Sep 2026)',
      remindersScheduled: ['H-7 (21 Sep)', 'H-3 (25 Sep)', 'H-1 (27 Sep)'],
      vaultFolder: 'Smart Vault / Events / Study_Tour_2026',
      notificationsDispatched: 5,
      gklKnowledgeLinked: true
    },
    checklists: [
      { id: 'c1', task: 'Booking Armada Transportasi & Asuransi Perjalanan', role: 'KEUANGAN', done: false },
      { id: 'c2', task: 'Surat Izin Orang Tua & Pembagian Regu Santri', role: 'ADMIN', done: false },
      { id: 'c3', task: 'Penyusunan Lembar Observasi Sains Santri', role: 'GURU', done: false },
      { id: 'c4', task: 'Persetujuan Final Rute oleh Ketua Yayasan', role: 'KETUA_YAYASAN', done: false }
    ]
  },
  {
    code: 'MIS-PARENTING',
    title: 'Parenting Akbar: Sinergi Pendidikan Karakter Islami di Era Digital',
    category: 'ACADEMIC',
    startDate: '14 Agu 2026',
    targetDate: '15 Okt 2026',
    autoTriggeredAssets: {
      checklistCount: 4,
      calendarEvent: 'Seminar Parenting Yayasan Asy-Syifatan (15 Okt 2026)',
      remindersScheduled: ['H-7 (8 Okt)', 'H-3 (12 Okt)', 'H-1 (14 Okt)'],
      vaultFolder: 'Smart Vault / Academic / Parenting_Akbar_2026',
      notificationsDispatched: 10,
      gklKnowledgeLinked: true
    },
    checklists: [
      { id: 'c1', task: 'Konfirmasi Narasumber Psikolog Anak & Ulama', role: 'KEPALA_SEKOLAH', done: true },
      { id: 'c2', task: 'Pembuatan Undangan Digital & Broadcast WhatsApp', role: 'ADMIN', done: false },
      { id: 'c3', task: 'Konsumsi & Doorprize Buku Islami Santri', role: 'KEUANGAN', done: false },
      { id: 'c4', task: 'Tanda Tangan Piagam Kehadiran Wali Murid', role: 'KETUA_YAYASAN', done: false }
    ]
  },
  {
    code: 'MIS-BOS',
    title: 'Pelaporan & Realisasi Dana Bantuan Operasional Satuan PAUD (BOS)',
    category: 'FINANCE',
    startDate: '14 Agu 2026',
    targetDate: '30 Sep 2026',
    autoTriggeredAssets: {
      checklistCount: 5,
      calendarEvent: 'Batas Akhir Sinkronisasi LPJ BOS Tahap II (30 Sep 2026)',
      remindersScheduled: ['H-7 (23 Sep)', 'H-3 (27 Sep)', 'H-1 (29 Sep)', 'Day-H (30 Sep)'],
      vaultFolder: 'Smart Vault / Finance / LPJ_BOS_PAUD_2026',
      notificationsDispatched: 4,
      gklKnowledgeLinked: true
    },
    checklists: [
      { id: 'c1', task: 'Rekapitulasi Kuitansi Pembelian APE & Perlengkapan Belajar', role: 'KEUANGAN', done: true },
      { id: 'c2', task: 'Pengecekan Buku Kas Umum (BKU) oleh Kepala Sekolah', role: 'KEPALA_SEKOLAH', done: true },
      { id: 'c3', task: 'Sinkronisasi dengan Portal Resmi Kemdikbudristek', role: 'ADMIN', done: false },
      { id: 'c4', task: 'Penandatanganan Berita Acara Pemeriksaan Kas', role: 'KETUA_YAYASAN', done: false },
      { id: 'c5', task: 'Penyimpanan Arsip Digital Kriptografi Permanen', role: 'SUPER_ADMIN', done: false }
    ]
  }
];

export const R70ExecutiveMissionControl: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [missions, setMissions] = useState<ExecutiveMission[]>([
    {
      id: 'em-1',
      code: PRESET_MISSIONS[0].code,
      title: PRESET_MISSIONS[0].title,
      category: PRESET_MISSIONS[0].category,
      status: 'ACTIVE',
      progressPercent: 40,
      startDate: PRESET_MISSIONS[0].startDate,
      targetDate: PRESET_MISSIONS[0].targetDate,
      autoTriggeredAssets: PRESET_MISSIONS[0].autoTriggeredAssets,
      checklists: PRESET_MISSIONS[0].checklists
    },
    {
      id: 'em-2',
      code: PRESET_MISSIONS[1].code,
      title: PRESET_MISSIONS[1].title,
      category: PRESET_MISSIONS[1].category,
      status: 'ACTIVE',
      progressPercent: 50,
      startDate: PRESET_MISSIONS[1].startDate,
      targetDate: PRESET_MISSIONS[1].targetDate,
      autoTriggeredAssets: PRESET_MISSIONS[1].autoTriggeredAssets,
      checklists: PRESET_MISSIONS[1].checklists
    }
  ]);

  const [selectedMissionId, setSelectedMissionId] = useState<string>('em-1');
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [launchSuccessAlert, setLaunchSuccessAlert] = useState<string | null>(null);

  const activeMission = missions.find(m => m.id === selectedMissionId) || missions[0];

  const handleLaunchPresetMission = (preset: typeof PRESET_MISSIONS[0]) => {
    const newMission: ExecutiveMission = {
      id: `em-${Date.now()}`,
      code: preset.code,
      title: preset.title,
      category: preset.category,
      status: 'ACTIVE',
      progressPercent: Math.round(
        (preset.checklists.filter(c => c.done).length / preset.checklists.length) * 100
      ),
      startDate: preset.startDate,
      targetDate: preset.targetDate,
      autoTriggeredAssets: preset.autoTriggeredAssets,
      checklists: preset.checklists
    };

    setMissions(prev => [newMission, ...prev]);
    setSelectedMissionId(newMission.id);
    setShowPresetModal(false);
    setLaunchSuccessAlert(
      `Misi "${preset.title}" Berhasil Diluncurkan! AI Asy otomatis menyusun checklist, mengagendakan kalender, membuat folder vault, dan menjadwalkan notifikasi.`
    );
    setTimeout(() => setLaunchSuccessAlert(null), 6000);
  };

  const handleToggleChecklist = (missionId: string, checklistId: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id !== missionId) return m;
        const updatedChecklists = m.checklists.map(c =>
          c.id === checklistId ? { ...c, done: !c.done } : c
        );
        const doneCount = updatedChecklists.filter(c => c.done).length;
        const progress = Math.round((doneCount / updatedChecklists.length) * 100);
        return {
          ...m,
          checklists: updatedChecklists,
          progressPercent: progress,
          status: progress === 100 ? 'COMPLETED' : 'ACTIVE'
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-6 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <Compass className="w-8 h-8 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Phase 2 Executive Command
                </span>
                <span className="text-xs text-emerald-200/80 font-bold">• 1-Click Autonomous Trigger</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">Executive Mission Control</h2>
              <p className="text-sm text-emerald-100/80 font-medium">
                Buat Satu Misi Strategis — Sistem Otomatis Memicu Checklist AI, Kalender, Pengingat H-7 s/d Day H, & Folder Vault Digital.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPresetModal(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center gap-2 transition cursor-pointer min-h-[48px] shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            Luncurkan Misi Baru (1-Click)
          </button>
        </div>
      </div>

      {launchSuccessAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in shadow-xs">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{launchSuccessAlert}</span>
        </div>
      )}

      {/* Main Grid: Mission List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Missions Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Misi Aktif Yayasan ({missions.length})
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                Auto Synchronized
              </span>
            </div>

            <div className="space-y-3">
              {missions.map(m => {
                const isSelected = m.id === selectedMissionId;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMissionId(m.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-left space-y-2.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-200/50 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {m.code}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          m.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.status === 'COMPLETED' ? 'SELESAI 100%' : `${m.progressPercent}% PROGRESS`}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{m.title}</h4>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${m.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                        <span>Mulai: {m.startDate}</span>
                        <span className="text-emerald-700 font-bold">Target: {m.targetDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Mission Detail & Auto-Triggered Assets */}
        <div className="lg:col-span-7 space-y-4">
          {activeMission && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
              {/* Mission Header */}
              <div className="space-y-3 pb-4 border-b border-stone-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900">
                      {activeMission.code}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                      Kategori: {activeMission.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Batas Waktu: {activeMission.targetDate}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900">{activeMission.title}</h3>
              </div>

              {/* Auto-Triggered Ecosystem Matrix (Phase 2 Requirement) */}
              <div className="space-y-3">
                <h4 className="text-xs font-black tracking-wider uppercase text-stone-500 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Aset & Alur yang Terpicu Otomatis (Zero Manual Effort)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <div className="flex items-center gap-2 text-stone-500 font-bold">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>Agenda Kalender Sekolah</span>
                    </div>
                    <div className="font-bold text-slate-900">{activeMission.autoTriggeredAssets.calendarEvent}</div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <div className="flex items-center gap-2 text-stone-500 font-bold">
                      <FolderOpen className="w-4 h-4 text-indigo-600" />
                      <span>Smart Vault Folder</span>
                    </div>
                    <div className="font-bold text-slate-900 truncate">{activeMission.autoTriggeredAssets.vaultFolder}</div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <div className="flex items-center gap-2 text-stone-500 font-bold">
                      <Bell className="w-4 h-4 text-amber-600" />
                      <span>Pengingat Bertingkat</span>
                    </div>
                    <div className="font-bold text-slate-900">
                      {activeMission.autoTriggeredAssets.remindersScheduled.join(' • ')}
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <div className="flex items-center gap-2 text-stone-500 font-bold">
                      <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      <span>GKL Knowledge History</span>
                    </div>
                    <div className="font-bold text-slate-900">Tersambung ke Basis Pengetahuan Yayasan</div>
                  </div>
                </div>
              </div>

              {/* Checklist Tasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black tracking-wider uppercase text-stone-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Checklist Eksekusi Misi ({activeMission.checklists.filter(c => c.done).length}/{activeMission.checklists.length})
                  </h4>
                  <span className="text-xs font-bold text-stone-500">Klik item untuk update progres</span>
                </div>

                <div className="space-y-2">
                  {activeMission.checklists.map(chk => (
                    <div
                      key={chk.id}
                      onClick={() => handleToggleChecklist(activeMission.id, chk.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        chk.done
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                            chk.done ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-300'
                          }`}
                        >
                          {chk.done && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            chk.done ? 'text-stone-500 line-through' : 'text-slate-900'
                          }`}
                        >
                          {chk.task}
                        </span>
                      </div>

                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 shrink-0">
                        {chk.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preset Modal Launcher */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Pilih Preset Misi Eksekutif</h3>
                  <p className="text-xs text-stone-500 font-medium">
                    1-Click inisiasi otomatis checklist, kalender, notifikasi, dan vault folder
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPresetModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRESET_MISSIONS.map(preset => (
                <div
                  key={preset.code}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/40 hover:border-emerald-300 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-stone-200 text-stone-700 uppercase">
                      {preset.category}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 mt-1">{preset.title}</h4>
                    <p className="text-[11px] text-stone-500">
                      {preset.checklists.length} Checklist • Agenda: {preset.targetDate}
                    </p>
                  </div>

                  <button
                    onClick={() => handleLaunchPresetMission(preset)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[40px]"
                  >
                    <Zap className="w-3.5 h-3.5" /> Luncurkan Misi Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
