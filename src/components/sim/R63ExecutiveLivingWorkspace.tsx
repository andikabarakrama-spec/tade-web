import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Sun,
  Moon,
  CloudSun,
  Sunset,
  Shield,
  CheckCircle2,
  Clock,
  Calendar,
  Mic,
  MicOff,
  FolderOpen,
  Inbox,
  Compass,
  FileText,
  Upload,
  Layers,
  ArrowRight,
  UserCheck,
  Building2,
  BookOpen,
  DollarSign,
  AlertCircle,
  Eye,
  Check,
  X,
  Volume2,
  Radio,
  Lock,
  FileCheck,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { R70ExecutiveMissionControl } from './R70ExecutiveMissionControl';
import { R71AIAsyWorkflowOrchestrator } from './R71AIAsyWorkflowOrchestrator';
import { R65SchoolActivityCenter } from './R65SchoolActivityCenter';
import { SmartAssignmentEngine } from './SmartAssignmentEngine';

export interface GovernanceInboxItem {
  id: string;
  sourceType: 'WHATSAPP_SCREENSHOT' | 'CHAT_EXPORT' | 'PDF' | 'WORD' | 'IMAGE' | 'VOICE_NOTE';
  sourceTitle: string;
  sender: string;
  timestamp: string;
  aiSummary: string;
  classification: 'LEGAL' | 'PARENT_FEEDBACK' | 'GOVERNMENT_NOTICE' | 'FINANCIAL_REPORT';
  proposedAction: string;
  status: 'ANALYZED' | 'DISPATCHED' | 'ARCHIVED';
}

export interface ArchiveVaultDocument {
  id: string;
  title: string;
  folder: 'Incoming Letters' | 'Outgoing Letters' | 'SOP' | 'Curriculum' | 'BOS' | 'Events' | 'PPDB' | 'Finance' | 'Photos' | 'Videos';
  version: string;
  checksum: string;
  editor: string;
  timestamp: string;
  fileSize: string;
}

const SAMPLE_INBOX_ITEMS: GovernanceInboxItem[] = [
  {
    id: 'INB-01',
    sourceType: 'WHATSAPP_SCREENSHOT',
    sourceTitle: 'Screenshot Diskusi Wali Murid Kelompok B terkait Jadwal Manasik',
    sender: 'Ibu Ratna (Koordinator Kelas B2)',
    timestamp: '14 Agu 2026, 06:45 WIB',
    aiSummary: 'Wali murid mengusulkan agar keberangkatan manasik dimajukan 30 menit demi menghindari cuaca terik siang hari.',
    classification: 'PARENT_FEEDBACK',
    proposedAction: 'Teruskan usulan ke Kepala Sekolah & Panitia Manasik untuk penyesuaian rundown.',
    status: 'ANALYZED'
  },
  {
    id: 'INB-02',
    sourceType: 'PDF',
    sourceTitle: 'Surat Edaran Dinas Pendidikan Kab. Jember No. 421/2026 - Jadwal Asesmen PAUD',
    sender: 'Dinas Pendidikan Bidang PAUD-PNFI',
    timestamp: '13 Agu 2026, 16:30 WIB',
    aiSummary: 'Penyelenggaraan Asesmen Nasional PAUD dijadwalkan pada minggu ke-3 September 2026 dengan pengisian instrumen survei lingkungan belajar.',
    classification: 'GOVERNMENT_NOTICE',
    proposedAction: 'Jadwalkan rapat koordinasi guru untuk pengisian instrumen dan verifikasi Dapodik.',
    status: 'ANALYZED'
  },
  {
    id: 'INB-03',
    sourceType: 'VOICE_NOTE',
    sourceTitle: 'Pesan Suara Catatan Khusus Bendahara terkait LPJ BOS Tahap I',
    sender: 'Ahmad Fauzi, S.E (Bendahara)',
    timestamp: '14 Agu 2026, 07:10 WIB',
    aiSummary: 'Seluruh SPJ belanja APE dan buku ajar telah lengkap 100%, siap untuk pengesahan tanda tangan Ketua Yayasan.',
    classification: 'FINANCIAL_REPORT',
    proposedAction: 'Buka draft dokumen BOS di Smart Vault untuk tanda tangan digital.',
    status: 'ANALYZED'
  }
];

const SAMPLE_ARCHIVE_VAULT: ArchiveVaultDocument[] = [
  {
    id: 'VLT-DOC-001',
    title: 'Akta Notaris Pendirian & Perubahan Yayasan Asy-Syifatan 2026',
    folder: 'SOP',
    version: 'v3.2',
    checksum: 'sha256:e8b2f91a...d44c',
    editor: 'KH. Achmad Shodiq',
    timestamp: '10 Agu 2026, 14:00 WIB',
    fileSize: '4.8 MB'
  },
  {
    id: 'VLT-DOC-002',
    title: 'Surat Masuk Dinas Pendidikan: Validasi Akreditasi A PAUD 2026-2031',
    folder: 'Incoming Letters',
    version: 'v1.0',
    checksum: 'sha256:a77c34b1...881f',
    editor: 'Fatimah Az-Zahra (Admin)',
    timestamp: '12 Agu 2026, 09:15 WIB',
    fileSize: '2.1 MB'
  },
  {
    id: 'VLT-DOC-003',
    title: 'Laporan Pertanggungjawaban (LPJ) Realisasi Dana BOS PAUD Tahap I 2026',
    folder: 'BOS',
    version: 'v2.1',
    checksum: 'sha256:69cc9810...e10a',
    editor: 'Ahmad Fauzi (Keuangan)',
    timestamp: '13 Agu 2026, 11:30 WIB',
    fileSize: '8.4 MB'
  },
  {
    id: 'VLT-DOC-004',
    title: 'Kurikulum Merdeka PAUD Islami & Silabus Tahfidz Juz 30',
    folder: 'Curriculum',
    version: 'v4.0',
    checksum: 'sha256:bb4012fe...712d',
    editor: 'Hj. Siti Aminah (Kepsek)',
    timestamp: '08 Agu 2026, 10:00 WIB',
    fileSize: '12.5 MB'
  }
];

export const R63ExecutiveLivingWorkspace: React.FC = () => {
  const { userProfile, activeRole } = useAuth();

  // Active Subview
  const [activeSubView, setActiveSubView] = useState<
    'OVERVIEW' | 'MISSIONS' | 'ORCHESTRATOR' | 'ACTIVITIES' | 'ASSIGNMENT_ROUTING' | 'INBOX' | 'VAULT'
  >('OVERVIEW');

  // Device adaptive preview mode
  const [deviceMode, setDeviceMode] = useState<'PC' | 'LAPTOP' | 'TABLET' | 'PHONE'>('PC');

  // Time of Day Ambiance Engine (Phase 14)
  const [timeOfDay, setTimeOfDay] = useState<'MORNING' | 'NOON' | 'AFTERNOON' | 'NIGHT'>('MORNING');

  // Voice Interaction State (Phase 11)
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>(
    'Assalamu’alaikum Kyai. AI Asy siap membantu memandu persetujuan, agenda pengajian pagi, dan misi strategis yayasan hari ini.'
  );

  // Inbox & Vault Data
  const [inboxItems, setInboxItems] = useState<GovernanceInboxItem[]>(SAMPLE_INBOX_ITEMS);
  const [vaultDocs, setVaultDocs] = useState<ArchiveVaultDocument[]>(SAMPLE_ARCHIVE_VAULT);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState<string | null>(null);

  // Approval items
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'APP-01',
      title: 'Persetujuan Anggaran Praktik Manasik Haji Cilik (Rp 6.500.000,-)',
      proposer: 'Hj. Siti Aminah (Kepala Sekolah)',
      type: 'KEUANGAN'
    },
    {
      id: 'APP-02',
      title: 'Pengesahan Draf SPTJM Legalitas Pengurus Yayasan 2026/2027',
      proposer: 'Fatimah Az-Zahra (Admin TU)',
      type: 'LEGAL'
    }
  ]);

  // Determine current real hour for natural school engine ambiance
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setTimeOfDay('MORNING');
    else if (hour >= 11 && hour < 15) setTimeOfDay('NOON');
    else if (hour >= 15 && hour < 18) setTimeOfDay('AFTERNOON');
    else setTimeOfDay('NIGHT');
  }, []);

  const handleToggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setVoiceTranscript('Mendengarkan instruksi suara Kyai... (Voice Security Shield Aktif)');
      setTimeout(() => {
        setVoiceTranscript('AI Asy: "Draf SPTJM Yayasan dan Anggaran Manasik Haji siap untuk ditandatangani. Apakah Kyai ingin menyetujui keduanya sekarang?"');
      }, 2500);
    } else {
      setIsVoiceActive(false);
      setVoiceTranscript('Voice Assistant dalam mode siaga.');
    }
  };

  const handleSimulateFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newItem: GovernanceInboxItem = {
        id: `INB-${Math.floor(10 + Math.random() * 90)}`,
        sourceType: 'WHATSAPP_SCREENSHOT',
        sourceTitle: 'Screenshot Hasil Diskusi Komite Terkait Seragam Santri',
        sender: 'Wali Kelas Kelompok A',
        timestamp: 'Baru saja',
        aiSummary: 'Komite mengonfirmasi pengadaan 60 stel seragam batik dan kaos olahraga telah rampung diproduksi.',
        classification: 'LEGAL',
        proposedAction: 'Arsipkan ke berkas Sarpras & konfirmasi ke bagian Keuangan.',
        status: 'ANALYZED'
      };

      setInboxItems(prev => [newItem, ...prev]);
      setIsUploading(false);
      setUploadSuccessAlert('Berkas berhasil dipindai OCR dan dirangkum secara otomatis oleh AI Asy!');
      setTimeout(() => setUploadSuccessAlert(null), 5000);
    }, 1500);
  };

  const handleApproveItem = (id: string) => {
    setPendingApprovals(prev => prev.filter(a => a.id !== id));
    setUploadSuccessAlert('Persetujuan berhasil ditandatangani secara digital dengan segel TADE Cryptographic QR!');
    setTimeout(() => setUploadSuccessAlert(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Device Adaptive & Ambiance Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Time of Day Ambiance Indicator (Phase 14) */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
              timeOfDay === 'MORNING'
                ? 'bg-gradient-to-tr from-amber-400 to-orange-500'
                : timeOfDay === 'NOON'
                ? 'bg-gradient-to-tr from-sky-400 to-blue-600'
                : timeOfDay === 'AFTERNOON'
                ? 'bg-gradient-to-tr from-orange-500 to-rose-600'
                : 'bg-gradient-to-tr from-slate-800 to-indigo-950'
            }`}
          >
            {timeOfDay === 'MORNING' && <Sun className="w-6 h-6 animate-spin-slow" />}
            {timeOfDay === 'NOON' && <CloudSun className="w-6 h-6" />}
            {timeOfDay === 'AFTERNOON' && <Sunset className="w-6 h-6" />}
            {timeOfDay === 'NIGHT' && <Moon className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-stone-500">
              Living School Engine • Suasana {timeOfDay === 'MORNING' ? 'Pagi (Fajar & Mengajar)' : timeOfDay === 'NOON' ? 'Siang (Aktif & Ceria)' : timeOfDay === 'AFTERNOON' ? 'Sore (Evaluasi Santai)' : 'Malam (Tenang & Patroli Guardian)'}
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              Lingkungan Eksekutif Ramah Senior (Ketua Yayasan)
            </div>
          </div>
        </div>

        {/* Device Mode Switcher (Phase 9: Living Adaptive Experience 2.0) */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl text-xs">
          <span className="text-[11px] font-bold text-stone-500 px-2">Mode Tampilan:</span>
          {[
            { mode: 'PC', label: 'PC Executive', icon: Monitor },
            { mode: 'LAPTOP', label: 'Laptop', icon: Laptop },
            { mode: 'TABLET', label: 'Tablet', icon: Tablet },
            { mode: 'PHONE', label: 'HP / Mobile', icon: Smartphone }
          ].map(item => {
            const Icon = item.icon;
            const isSelected = deviceMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setDeviceMode(item.mode as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {uploadSuccessAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-4 rounded-3xl flex items-center gap-3 text-base font-bold animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>{uploadSuccessAlert}</span>
        </div>
      )}

      {/* Senior Executive Banner: Large Typography (18-20px) & Large Buttons (min 48px) */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 rounded-3xl p-8 text-white border border-teal-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-3xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0">
              <Bot className="w-10 h-10 text-teal-300 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Ruang Kerja Eksekutif Ketua Yayasan
                </span>
                <span className="text-xs text-teal-200/80 font-bold">• Desain Khusus Usia 50+</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white">
                Ahlan wa Sahlan, KH. Achmad Shodiq
              </h1>
              <p className="text-base text-teal-100 font-medium leading-relaxed max-w-3xl">
                Setelah mengajar pagi santri, nikmati kemudahan pengambilan keputusan strategis satu pintu dengan ukuran huruf besar, tombol mantap, dan asisten suara AI Asy yang selalu mendampingi.
              </p>
            </div>
          </div>

          {/* Voice Assistant Button (Phase 11) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleToggleVoice}
              className={`px-6 py-4 rounded-3xl text-sm font-black flex items-center justify-center gap-3 transition shadow-lg cursor-pointer min-h-[52px] ${
                isVoiceActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-slate-950'
              }`}
            >
              {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isVoiceActive ? 'Hentikan Asisten Suara' : 'Bicara dengan AI Asy (Voice)'}
            </button>
          </div>
        </div>

        {/* Live Voice Audio Stream Box */}
        {isVoiceActive && (
          <div className="mt-6 pt-4 border-t border-teal-800/60 flex items-center gap-3 text-sm text-teal-200 font-bold bg-teal-950/60 p-4 rounded-2xl border border-teal-700/40 animate-in fade-in">
            <Volume2 className="w-5 h-5 text-teal-300 shrink-0 animate-bounce" />
            <span>{voiceTranscript}</span>
          </div>
        )}
      </div>

      {/* Subview Navigation Cards: Large Touch Targets (Min 48px) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { key: 'OVERVIEW', label: 'Ringkasan Utama', icon: Layers },
          { key: 'MISSIONS', label: 'Mission Control', icon: Compass },
          { key: 'ORCHESTRATOR', label: 'AI Secretary', icon: Bot },
          { key: 'ACTIVITIES', label: 'Agenda & Event', icon: Calendar },
          { key: 'ASSIGNMENT_ROUTING', label: 'Alur Penugasan', icon: UserCheck },
          { key: 'INBOX', label: 'Governance Inbox', icon: Inbox },
          { key: 'VAULT', label: 'Arsip Smart Vault', icon: FolderOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubView === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubView(tab.key as any)}
              className={`p-4 rounded-3xl font-extrabold text-sm transition flex flex-col items-center justify-center gap-2 min-h-[64px] cursor-pointer text-center ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md ring-2 ring-teal-400'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:border-stone-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-stone-500'}`} />
              <span className="leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: EXECUTIVE OVERVIEW */}
      {activeSubView === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Top 3 High-Priority Cards for Senior Executive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Morning Briefing (Phase 12) */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Briefing Pagi Kyai</h3>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">
                  14 Agu 2026
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-800 font-semibold leading-relaxed">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Kelas Mengajar Pagi:</div>
                    <div className="text-xs text-stone-600 mt-0.5">Kelompok B1 (Tahfidz Surat An-Naba' & Doa Harian) pukul 07:30 - 08:30 WIB.</div>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Kehadiran Santri Hari Ini:</div>
                    <div className="text-xs text-stone-600 mt-0.5">58 dari 60 santri hadir (96.7% presensi awal).</div>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Agenda Strategis Siang:</div>
                    <div className="text-xs text-stone-600 mt-0.5">Rapat Koordinasi Persiapan Manasik Haji pukul 10:00 WIB.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Pending Approvals (Central Approvals) */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-rose-50 text-rose-700 rounded-2xl">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    Persetujuan Tertunda ({pendingApprovals.length})
                  </h3>
                </div>
                <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full">
                  Butuh Tanda Tangan
                </span>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 font-bold text-sm">
                  Alhamdulillah, semua berkas persetujuan telah ditandatangani.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map(app => (
                    <div
                      key={app.id}
                      className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3"
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                          {app.type}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-1">{app.title}</h4>
                        <div className="text-xs text-stone-500 mt-0.5">Diajukan: {app.proposer}</div>
                      </div>

                      <button
                        onClick={() => handleApproveItem(app.id)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px]"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> Setujui & Tanda Tangan Digital (1-Klik)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Card 3: Quick Executive Mission Launch */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Misi Cepat Yayasan</h3>
                </div>
                <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-1 rounded-full">
                  Autonomous
                </span>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setActiveSubView('MISSIONS')}
                  className="w-full p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-teal-50 hover:border-teal-300 transition text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-black text-teal-800 uppercase">Preset Legal</div>
                    <div className="text-sm font-bold text-slate-900">Pembaruan Dokumen KTP Pengurus</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-teal-600" />
                </button>

                <button
                  onClick={() => setActiveSubView('ACTIVITIES')}
                  className="w-full p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-teal-50 hover:border-teal-300 transition text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-black text-indigo-800 uppercase">Preset Event</div>
                    <div className="text-sm font-bold text-slate-900">Persiapan Manasik Haji Cilik</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-600" />
                </button>

                <button
                  onClick={() => setActiveSubView('ORCHESTRATOR')}
                  className="w-full p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-teal-50 hover:border-teal-300 transition text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-black text-amber-800 uppercase">AI Asy Assistant</div>
                    <div className="text-sm font-bold text-slate-900">Buka AI Secretary Orchestrator</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-amber-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MISSIONS */}
      {activeSubView === 'MISSIONS' && <R70ExecutiveMissionControl />}

      {/* VIEW 3: ORCHESTRATOR */}
      {activeSubView === 'ORCHESTRATOR' && <R71AIAsyWorkflowOrchestrator />}

      {/* VIEW 4: ACTIVITIES */}
      {activeSubView === 'ACTIVITIES' && <R65SchoolActivityCenter />}

      {/* VIEW 5: SMART ASSIGNMENT & HIERARCHICAL ROUTING */}
      {activeSubView === 'ASSIGNMENT_ROUTING' && <SmartAssignmentEngine />}

      {/* VIEW 6: GOVERNANCE INBOX (PHASE 6) */}
      {activeSubView === 'INBOX' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
                  Phase 6 Governance Inbox
                </span>
                <span className="text-xs text-stone-500 font-bold">• Upload-Only (WhatsApp Screenshots, PDF, Audio)</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">Pusat Asimilasi Berkas & Pesan Masuk</h3>
              <p className="text-xs text-stone-500 font-medium">
                AI Asy otomatis melakukan OCR, merangkum, mengklasifikasi, dan mengusulkan tindak lanjut.
              </p>
            </div>

            <button
              onClick={handleSimulateFileUpload}
              disabled={isUploading}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black shadow-sm flex items-center gap-2 transition cursor-pointer min-h-[44px] shrink-0 disabled:opacity-50"
            >
              <Upload className={`w-4 h-4 ${isUploading ? 'animate-spin' : ''}`} />
              {isUploading ? 'Memindai Berkas...' : 'Unggah Tangkapan Layar / Dokumen'}
            </button>
          </div>

          <div className="space-y-3">
            {inboxItems.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-teal-300 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                        {item.sourceType}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                        {item.classification}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">• {item.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{item.sourceTitle}</h4>
                    <div className="text-xs text-stone-500">Pengirim: {item.sender}</div>
                  </div>

                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                    {item.status}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs text-slate-800 font-medium space-y-1">
                  <div className="font-bold text-teal-800">Ringkasan AI Asy:</div>
                  <p>{item.aiSummary}</p>
                </div>

                <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-100 text-xs text-teal-950 font-semibold flex items-center justify-between gap-2">
                  <span>Usulan Tindak Lanjut: <strong>{item.proposedAction}</strong></span>
                  <button
                    onClick={() => {
                      setUploadSuccessAlert(`Usulan tindak lanjut "${item.proposedAction}" berhasil didelegasikan ke alur penugasan.`);
                      setTimeout(() => setUploadSuccessAlert(null), 4000);
                    }}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer"
                  >
                    Eksekusi Usulan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 7: GOVERNANCE ARCHIVE VAULT (PHASE 8) */}
      {activeSubView === 'VAULT' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase">
                  Phase 8 Governance Archive Vault
                </span>
                <span className="text-xs text-stone-500 font-bold">• 3-Level Authority (Super Admin, Ketua Yayasan, Admin)</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">Brankas Digital Arsip & Surat Resmi Yayasan</h3>
              <p className="text-xs text-stone-500 font-medium">
                Setiap dokumen tersimpan dengan versi, sha256 checksum, riwayat editor, dan timestamp permanen.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-stone-100 px-3 py-2 rounded-xl font-bold text-stone-700 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                Kriptografi SHA-256 Tersegel
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaultDocs.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-indigo-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 uppercase">
                    Folder: {doc.folder}
                  </span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {doc.version}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>

                <div className="space-y-1 text-xs text-stone-500 font-medium pt-2 border-t border-stone-100">
                  <div className="truncate">Checksum: <code className="text-stone-700">{doc.checksum}</code></div>
                  <div>Penyunting: <strong>{doc.editor}</strong> ({doc.timestamp})</div>
                  <div>Ukuran Berkas: {doc.fileSize}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
