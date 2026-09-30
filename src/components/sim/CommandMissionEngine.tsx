import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Layers, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  DollarSign, 
  QrCode, 
  Palette, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Radio, 
  ChevronDown, 
  ChevronUp, 
  CornerDownRight, 
  CheckSquare, 
  Square,
  Bot,
  Laptop,
  HelpCircle,
  Eye,
  Filter,
  UserCheck
} from 'lucide-react';
import { CommandTimeline, MissionLifecycleStage } from './CommandTimeline';

export type HierarchyRole = 
  | 'SUPER_ADMIN' 
  | 'AI_ASY' 
  | 'KETUA_YAYASAN' 
  | 'KEPALA_SEKOLAH' 
  | 'ADMIN' 
  | 'GURU';

export type TaskStatus = 
  | 'MENUNGGU' 
  | 'BERJALAN' 
  | 'TERLAMBAT' 
  | 'SELESAI' 
  | 'DIVERIFIKASI';

export interface MissionSubtask {
  id: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  assignedRole: HierarchyRole;
  picName: string;
  status: TaskStatus;
  deadline: string;
  checklist: { id: string; label: string; done: boolean }[];
  deliverables: string[];
  escalationCount: number;
  aiRecommendation?: string;
}

export interface OperationalPackage {
  committee: string[];
  rundown: string[];
  rabBudget: { item: string; amount: number; notes: string }[];
  qrPayload: string;
  bannerTheme: string;
  lpjTemplate: string;
}

export interface ActiveMission {
  id: string;
  code: string;
  title: string;
  directive: string;
  category: 'OPERATIONS' | 'ACCREDITATION' | 'EVENT' | 'ACADEMIC' | 'GOVERNANCE';
  stage: MissionLifecycleStage;
  progressPct: number;
  createdAt: string;
  targetDate: string;
  executiveSummary: string;
  tasks: MissionSubtask[];
  opPackage: OperationalPackage;
}

const PRESET_DIRECTIVES = [
  {
    label: '📋 Perbarui Seluruh KTP Guru',
    text: 'Perbarui seluruh KTP Guru dan sinkronkan dengan database Dapodik & Arsip Smart Vault Yayasan.',
    category: 'GOVERNANCE'
  },
  {
    label: '🎓 Siapkan Haflah Akhirussanah Bulan Depan',
    text: 'Siapkan Haflah Akhirussanah & Wisuda Santri Tahfidz bulan depan: Panitia, RAB, panggung 3D, QR presensi wali, dan draf LPJ.',
    category: 'EVENT'
  },
  {
    label: '🛡️ Persiapan Visitasi Akreditasi BAN-PAUD',
    text: 'Audit kesiapan 8 Standar Nasional Pendidikan BAN-PAUD, verifikasi instrumen sarpras, dan arsipkan bukti fisik.',
    category: 'ACCREDITATION'
  },
  {
    label: '🎒 PPDB Gelombang 2 Intake Campaign',
    text: 'Buka pendaftaran PPDB Gelombang 2: Terbitkan QR brosur, spanduk 3D, formulir online, dan kuota 40 santri baru.',
    category: 'OPERATIONS'
  }
];

const INITIAL_MISSIONS: ActiveMission[] = [
  {
    id: 'msn-001',
    code: 'MSN-2026-081',
    title: 'Pembaruan Menyeluruh Berkas KTP & NIK Guru TK',
    directive: 'Perbarui seluruh KTP Guru dan sinkronkan dengan database Dapodik & Arsip Smart Vault Yayasan.',
    category: 'GOVERNANCE',
    stage: 'SEDANG_DIKERJAKAN',
    progressPct: 62,
    createdAt: '14 Agustus 2026, 07:30 WIB',
    targetDate: '18 Agustus 2026',
    executiveSummary: 'AI Asy telah mendistribusikan 6 subtugas berjenjang kepada Ketua Yayasan, Kepala Sekolah, Admin TU, dan Dewan Guru. 14 dari 18 guru telah mengunggah scan KTP terbaru.',
    tasks: [
      {
        id: 't-1',
        title: 'Pengesahan Mandat Pembaruan Dokumen Pendidik',
        description: 'Pemberian mandat resmi yayasan untuk validasi arsip KTP/KK dewan guru untuk kebutuhan BAN-PAUD.',
        tier: 3,
        assignedRole: 'KETUA_YAYASAN',
        picName: 'KH. Abdullah Syifa (Ketua Yayasan)',
        status: 'DIVERIFIKASI',
        deadline: '14 Agustus 2026, 12:00 WIB',
        checklist: [
          { id: 'c1', label: 'Tandatangan digital SK Mandat Verifikasi', done: true },
          { id: 'c2', label: 'Persetujuan enkripsi Smart Vault level 2', done: true }
        ],
        deliverables: ['SK_Mandat_KTP_2026.pdf'],
        escalationCount: 0
      },
      {
        id: 't-2',
        title: 'Instruksi Teknis & Sosialisasi ke Dewan Guru',
        description: 'Penyampaian format scan KTP beresolusi tinggi (min 300 DPI) dan batas pengumpulan berkas.',
        tier: 4,
        assignedRole: 'KEPALA_SEKOLAH',
        picName: 'Hj. Siti Rahmah, S.Pd (Kepala Sekolah)',
        status: 'SELESAI',
        deadline: '15 Agustus 2026, 10:00 WIB',
        checklist: [
          { id: 'c3', label: 'Broadcast arahan via Living Messenger Enterprise', done: true },
          { id: 'c4', label: 'Verifikasi kesiapan form unggah mandiri', done: true }
        ],
        deliverables: ['Edaran_Pembaruan_KTP.pdf'],
        escalationCount: 0
      },
      {
        id: 't-3',
        title: 'Verifikasi NIK & Pencocokan NUPTK Dapodik',
        description: 'Pemeriksaan kesesuaian NIK pada KTP dengan data kepegawaian dan sinkronisasi ke database.',
        tier: 5,
        assignedRole: 'ADMIN',
        picName: 'Ahmad Fauzi (Tata Usaha)',
        status: 'BERJALAN',
        deadline: '16 Agustus 2026, 16:00 WIB',
        checklist: [
          { id: 'c5', label: 'Validasi OCR 16 digit NIK', done: true },
          { id: 'c6', label: 'Pencocokan tanggal lahir dan alamat domisili', done: false },
          { id: 'c7', label: 'Upload ke Smart Vault TADE', done: false }
        ],
        deliverables: ['Rekap_Validasi_KTP_Guru.xlsx'],
        escalationCount: 0
      },
      {
        id: 't-4',
        title: 'Unggah Scan KTP Asli Dewan Guru (Sentra B1 & B2)',
        description: 'Guru Sentra Balok dan Sentra Bahan Alam mengunggah foto/scan KTP resmi.',
        tier: 6,
        assignedRole: 'GURU',
        picName: 'Ustadzah Sarah & Ustadzah Nurul',
        status: 'TERLAMBAT',
        deadline: '14 Agustus 2026, 15:00 WIB',
        checklist: [
          { id: 'c8', label: 'Foto KTP jelas tanpa pantulan cahaya', done: true },
          { id: 'c9', label: 'Konfirmasi pemutakhiran status pernikahan & KK', done: false }
        ],
        deliverables: ['KTP_Sarah_Sentra.jpg', 'KTP_Nurul_Sentra.jpg'],
        escalationCount: 2,
        aiRecommendation: 'Kirim notifikasi WhatsApp pemicu otomatis langsung ke nomor HP guru bersangkutan dengan batas 24 jam.'
      }
    ],
    opPackage: {
      committee: ['Penanggung Jawab: Ketua Yayasan', 'Koordinator Teknis: Kepala Sekolah', 'Operator Input: Admin TU'],
      rundown: ['H-4: Edaran Resmi', 'H-2: Verifikasi NIK', 'H-1: Sync Dapodik', 'H-0: Audit Final'],
      rabBudget: [
        { item: 'Biaya Materai & Verifikasi Notaris', amount: 150000, notes: 'Pengesahan legalitas yayasan' },
        { item: 'Kertas & Laminasi Arsip Fisik', amount: 85000, notes: 'Print Center Guardian' }
      ],
      qrPayload: 'https://asy-syifa.sch.id/vault/ktp-sync?msn=MSN-2026-081',
      bannerTheme: 'Verifikasi Berkas Pendidik Unggul Asy Syifa',
      lpjTemplate: 'LPJ Pemutakhiran Dokumen Kepegawaian Semester Ganjil 2026/2027.'
    }
  }
];

export const CommandMissionEngine: React.FC<{
  onSelectModule?: (mod: string) => void;
  userRoleContext?: HierarchyRole;
}> = ({ onSelectModule, userRoleContext = 'SUPER_ADMIN' }) => {
  const [missions, setMissions] = useState<ActiveMission[]>(INITIAL_MISSIONS);
  const [activeMissionId, setActiveMissionId] = useState<string>('msn-001');
  const [commandInput, setCommandInput] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<HierarchyRole | 'ALL'>('ALL');
  const [showPackageModal, setShowPackageModal] = useState<boolean>(false);

  const activeMission = missions.find(m => m.id === activeMissionId) || missions[0];

  // NLP Command Parser & Autonomous Mission Builder
  const handleExecuteCommand = (customDirective?: string) => {
    const text = customDirective || commandInput;
    if (!text.trim()) return;

    setIsSynthesizing(true);

    setTimeout(() => {
      const isHaflah = text.toLowerCase().includes('haflah') || text.toLowerCase().includes('wisuda');
      const isBanPaud = text.toLowerCase().includes('akreditasi') || text.toLowerCase().includes('ban-paud');
      const isPPDB = text.toLowerCase().includes('ppdb') || text.toLowerCase().includes('santri');

      const missionCode = `MSN-2026-${Math.floor(100 + Math.random() * 900)}`;

      const newMission: ActiveMission = {
        id: `msn-${Date.now()}`,
        code: missionCode,
        title: isHaflah 
          ? 'Penyelenggaraan Haflah Akhirussanah & Wisuda Santri Tahfidz 2026'
          : isBanPaud 
          ? 'Persiapan & Sinkronisasi Instrumen 8 Standar BAN-PAUD'
          : isPPDB 
          ? 'Penerimaan Santri Baru (PPDB) Gelombang 2 TA 2026/2027'
          : `Misi Khusus: ${text.slice(0, 50)}...`,
        directive: text,
        category: isHaflah ? 'EVENT' : isBanPaud ? 'ACCREDITATION' : isPPDB ? 'OPERATIONS' : 'GOVERNANCE',
        stage: 'DIBAGIKAN',
        progressPct: 15,
        createdAt: 'Hari ini, Baru Saja',
        targetDate: isHaflah ? '28 Agustus 2026' : isBanPaud ? '22 Agustus 2026' : '31 Agustus 2026',
        executiveSummary: `AI Asy telah mendekomposisi direktif "${text}" menjadi 5 subtugas hierarkis. Tim panitia dibentuk, anggaran dihitung otomatis, dan tugas telah diteruskan ke rantai komando.`,
        tasks: [
          {
            id: `t-gen-1-${Date.now()}`,
            title: isHaflah ? 'Pengesahan Anggaran & Alokasi Panggung Wisuda' : 'Pengesahan Mandat & Kebijakan Misi',
            description: 'Persetujuan kebijakan tertinggi dan pencairan dana infaq/operasional kegiatan.',
            tier: 3,
            assignedRole: 'KETUA_YAYASAN',
            picName: 'KH. Abdullah Syifa (Ketua Yayasan)',
            status: 'BERJALAN',
            deadline: 'Besok, 12:00 WIB',
            checklist: [
              { id: 'cg1', label: 'Verifikasi rincian RAB pengeluaran', done: true },
              { id: 'cg2', label: 'Tandatangan persetujuan surat tugas panitia', done: false }
            ],
            deliverables: ['SK_Persetujuan_RAB.pdf'],
            escalationCount: 0
          },
          {
            id: `t-gen-2-${Date.now()}`,
            title: isHaflah ? 'Penyusunan Rundown Haflah & Gladi Bersih Santri' : 'Supervisi & Pembagian Beban Kerja Guru',
            description: 'Instruksi pelaksanaan teknis lapangan, pembagian jadwal sentra, dan koordinasi dewan guru.',
            tier: 4,
            assignedRole: 'KEPALA_SEKOLAH',
            picName: 'Hj. Siti Rahmah, S.Pd (Kepala Sekolah)',
            status: 'BERJALAN',
            deadline: '2 Hari Kedepan',
            checklist: [
              { id: 'cg3', label: 'Rapat pleno dewan guru', done: false },
              { id: 'cg4', label: 'Penerbitan surat edaran wali murid', done: false }
            ],
            deliverables: ['Rundown_Haflah_2026.pdf'],
            escalationCount: 0
          },
          {
            id: `t-gen-3-${Date.now()}`,
            title: isHaflah ? 'Cetak Massal Banner Panggung 3D, ID Card & Sertifikat' : 'Persiapan Dokumen, Scan & Persuratan',
            description: 'Eksekusi fisik melalui Guardian Print Center & Living Banner Nusantara 3D Studio.',
            tier: 5,
            assignedRole: 'ADMIN',
            picName: 'Ahmad Fauzi (Tata Usaha)',
            status: 'MENUNGGU',
            deadline: '3 Hari Kedepan',
            checklist: [
              { id: 'cg5', label: 'Render Living Banner Nusantara 3D', done: false },
              { id: 'cg6', label: 'Cetak 85 lembar Sertifikat Tahfidz Santri', done: false },
              { id: 'cg7', label: 'Terbitkan QR Presensi Rapat R106', done: false }
            ],
            deliverables: ['Banner_Haflah_3D.png', 'Sertifikat_Tahfidz.pdf'],
            escalationCount: 0
          },
          {
            id: `t-gen-4-${Date.now()}`,
            title: isHaflah ? 'Latihan Penampilan Santri (Murojaah & Puisi Islami)' : 'Pengisian Instrumen Rapor & Catatan Anekdot',
            description: 'Guru kelompok bermain dan TK A/B membimbing santri untuk persiapan haflah.',
            tier: 6,
            assignedRole: 'GURU',
            picName: 'Ustadzah Sarah, Nurul & Fatimah',
            status: 'MENUNGGU',
            deadline: '4 Hari Kedepan',
            checklist: [
              { id: 'cg8', label: 'Latihan murojaah Surah An-Naba & Al-Balad', done: false },
              { id: 'cg9', label: 'Konfirmasi kehadiran wali murid', done: false }
            ],
            deliverables: ['Daftar_Peserta_Wisuda.xlsx'],
            escalationCount: 0
          }
        ],
        opPackage: {
          committee: [
            'Ketua Pelaksana: Hj. Siti Rahmah, S.Pd',
            'Sekretaris: Ahmad Fauzi',
            'Bendahara: Ustadzah Sarah, S.Pd.I',
            'Sie Acara: Ustadzah Nurul',
            'Sie Perlengkapan: Tim Sarpras Asy Syifa'
          ],
          rundown: [
            '07.30 - 08.00: Registrasi Wali Murid via QR R106',
            '08.00 - 08.30: Pembukaan & Pembacaan Kalam Ilahi',
            '08.30 - 09.00: Sambutan Ketua Yayasan & Kepala Sekolah',
            '09.00 - 10.30: Prosesi Wisuda Santri Tahfidz Mumtaz',
            '10.30 - 11.00: Doa Penutup & Foto Bersama'
          ],
          rabBudget: [
            { item: 'Sewa Tenda & Panggung Haflah', amount: 2500000, notes: 'Area Lapangan TK Asy Syifa' },
            { item: 'Konsumsi Santri & Wali Murid (150 Pax)', amount: 3750000, notes: 'Katering Sehat Islami' },
            { item: 'Cetak Banner 3D & Sertifikat Emas', amount: 850000, notes: 'Print Center Guardian' },
            { item: 'Plakat Penghargaan Santri Mumtaz', amount: 650000, notes: '15 Santri Teladan' }
          ],
          qrPayload: `https://asy-syifa.sch.id/qr/haflah?msn=${missionCode}&auth=HMAC256`,
          bannerTheme: isHaflah ? 'Haflah Nusantara 3D Gold Islamic' : 'Generasi Rabbani Berakhlak Mulia',
          lpjTemplate: `Laporan Pertanggungjawaban Pelaksanaan ${missionCode} disusun secara akuntabel untuk Yayasan Asy Syifa.`
        }
      };

      setMissions([newMission, ...missions]);
      setActiveMissionId(newMission.id);
      setCommandInput('');
      setIsSynthesizing(false);
    }, 1800);
  };

  // Toggle Checklist
  const handleToggleChecklist = (taskId: string, checkId: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== activeMissionId) return m;
      const updatedTasks = m.tasks.map(t => {
        if (t.id !== taskId) return t;
        const updatedChecks = t.checklist.map(c => c.id === checkId ? { ...c, done: !c.done } : c);
        const allDone = updatedChecks.every(c => c.done);
        return {
          ...t,
          checklist: updatedChecks,
          status: allDone ? ('SELESAI' as TaskStatus) : ('BERJALAN' as TaskStatus)
        };
      });

      const totalChecks = updatedTasks.flatMap(t => t.checklist).length;
      const completedChecks = updatedTasks.flatMap(t => t.checklist).filter(c => c.done).length;
      const progress = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

      return {
        ...m,
        tasks: updatedTasks,
        progressPct: progress,
        stage: progress === 100 ? 'SELESAI' : progress > 70 ? 'MENUNGGU_VERIFIKASI' : 'SEDANG_DIKERJAKAN'
      };
    }));
  };

  // 1-Click Fast Escalation Action
  const handleResolveEscalation = (taskId: string, actionType: 'WA_REMIND' | 'REASSIGN' | 'EXTEND') => {
    alert(`[Autonomous AI Asy Action] Berhasil mengeksekusi tindakan ${actionType} untuk subtugas: ${taskId}`);
    setMissions(prev => prev.map(m => {
      if (m.id !== activeMissionId) return m;
      return {
        ...m,
        tasks: m.tasks.map(t => t.id === taskId ? { ...t, status: 'BERJALAN', escalationCount: 0 } : t)
      };
    }));
  };

  // Filter tasks based on role visibility
  const displayedTasks = activeMission.tasks.filter(t => {
    if (roleFilter === 'ALL') return true;
    return t.assignedRole === roleFilter;
  });

  const overdueTasks = activeMission.tasks.filter(t => t.status === 'TERLAMBAT');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  R112 • Command Mission Engine
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  R113 Autonomous Chain of Command
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 text-white">AI Asy Autonomous Executive Commander</h1>
              <p className="text-sm text-slate-300">
                Super Admin memberi satu direktif umum dalam Bahasa Indonesia. AI Asy otomatis menyusun RAB, rundown, panitia, membagi tugas ke 6 tier rantai komando, dan memantau deadline secara otonom.
              </p>
            </div>
          </div>
        </div>

        {/* NLP Direktif Input Box */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pusat Direktif Tunggal Super Admin:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteCommand()}
                placeholder="Ketik perintah direktif (Contoh: 'Siapkan Haflah bulan depan' atau 'Perbarui KTP seluruh dewan guru')..."
                className="w-full pl-4 pr-10 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
              />
              {commandInput && (
                <button
                  onClick={() => setCommandInput('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => handleExecuteCommand()}
              disabled={isSynthesizing || !commandInput.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 shrink-0"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mendekomposisi Misi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Perintah ke Rantai Komando</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Directives */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 shrink-0 font-medium">Contoh Cepat:</span>
            {PRESET_DIRECTIVES.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setCommandInput(p.text);
                  handleExecuteCommand(p.text);
                }}
                className="px-3 py-1 bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700/60 hover:border-indigo-500 rounded-lg text-slate-300 whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Mission Timeline */}
      <CommandTimeline
        currentStage={activeMission.stage}
        progressPct={activeMission.progressPct}
        missionCode={activeMission.code}
        createdAt={activeMission.createdAt}
        targetDate={activeMission.targetDate}
        onAdvanceStage={(newStage) => {
          setMissions(prev => prev.map(m => m.id === activeMissionId ? { ...m, stage: newStage } : m));
        }}
      />

      {/* Smart Escalation Matrix Alert (Phase 6) */}
      {overdueTasks.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-500/50 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 animate-pulse text-rose-600" />
              <span>R116 • Smart Escalation Matrix (Deteksi Kendala Rantai Komando)</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
              {overdueTasks.length} Tugas Terlambat
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {overdueTasks.map(t => (
              <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{t.title}</h4>
                    <span className="text-[11px] text-rose-600 font-semibold">PIC: {t.picName} ({t.assignedRole})</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    Eskalasi Lvl {t.escalationCount}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>Rekomendasi AI Asy:</strong> {t.aiRecommendation || 'Kirim pengingat mendesak atau limpahkan ke personil cadangan.'}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleResolveEscalation(t.id, 'WA_REMIND')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <span>Kirim WA Otomatis</span>
                  </button>
                  <button
                    onClick={() => handleResolveEscalation(t.id, 'EXTEND')}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <span>Beri Dispensasi 24 Jam</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Mission Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mission Tasks & Chain of Command Hierarchy (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>Subtugas 6-Tier Rantai Komando</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Super Admin (Komando) &rarr; AI Asy (Orkestrasi) &rarr; Yayasan &rarr; Kepsek &rarr; Admin &rarr; Guru
                </p>
              </div>

              {/* Cross-Role Visibility Filter (Phase 9) */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                <span className="text-[10px] text-slate-500 font-bold px-1.5">Role View:</span>
                {[
                  { id: 'ALL', label: 'Semua (Super Admin)' },
                  { id: 'KETUA_YAYASAN', label: 'Yayasan' },
                  { id: 'KEPALA_SEKOLAH', label: 'Kepsek' },
                  { id: 'ADMIN', label: 'Admin TU' },
                  { id: 'GURU', label: 'Guru' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRoleFilter(r.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      roleFilter === r.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks List */}
            <div className="space-y-3">
              {displayedTasks.map((task) => {
                const isOverdue = task.status === 'TERLAMBAT';
                const isDone = task.status === 'SELESAI' || task.status === 'DIVERIFIKASI';

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isOverdue
                        ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                        : isDone
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          task.tier === 1 || task.tier === 2 
                            ? 'bg-purple-600 text-white' 
                            : task.tier === 3 
                            ? 'bg-indigo-600 text-white' 
                            : task.tier === 4 
                            ? 'bg-blue-600 text-white' 
                            : task.tier === 5 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-emerald-600 text-white'
                        }`}>
                          T{task.tier}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {task.assignedRole}
                            </span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              PIC: {task.picName}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {task.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          task.status === 'DIVERIFIKASI'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : task.status === 'SELESAI'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : task.status === 'TERLAMBAT'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : task.status === 'BERJALAN'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {task.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Batas: {task.deadline}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Checklist */}
                    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Checklist Eksekusi:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {task.checklist.map((chk) => (
                          <div
                            key={chk.id}
                            onClick={() => handleToggleChecklist(task.id, chk.id)}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-400 transition-all text-xs"
                          >
                            {chk.done ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className={chk.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200 font-medium'}>
                              {chk.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverable Badges */}
                    {task.deliverables.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                        <span className="text-slate-400 text-[10px] font-bold">Output Dokumen:</span>
                        {task.deliverables.map((doc, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded font-mono text-[10px] border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>{doc}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: AI Asy Executive Package & Instant Generator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Package Overview Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Paket Dokumen Otonom</span>
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                AI Auto-Generated
              </span>
            </div>

            {/* Committee Structure */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Struktur Panitia Pelaksana</span>
              </div>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {activeMission.opPackage.committee.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RAB Budget Estimation */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Estimasi RAB Anggaran</span>
                </span>
                <span className="text-emerald-600">
                  Rp {activeMission.opPackage.rabBudget.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                {activeMission.opPackage.rabBudget.map((b, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{b.item}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Rp {b.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons to other sub-studios */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelectModule && onSelectModule('r98')}
                className="w-full p-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Buka Studio 3D Living Banner (R98)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectModule && onSelectModule('r106')}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-indigo-600" />
                  <span>Terbitkan QR Rapat R106</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
