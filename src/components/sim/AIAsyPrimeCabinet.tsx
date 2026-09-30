import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  Sparkles,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  BrainCircuit,
  Wrench,
  FileText,
  Archive,
  DollarSign,
  GraduationCap,
  BookOpen,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Check,
  RefreshCw,
  Sun,
  Moon,
  ChevronRight,
  Lock,
  Radio,
  Vote,
  Sparkle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface AIMinisterProfile {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  icon: React.ElementType;
  status: 'OPTIMAL' | 'ACTIVE' | 'BUSY' | 'COOLDOWN';
  healthScore: number; // 0 - 100
  lastActivity: string;
  assignedTasks: string[];
  recommendations: string[];
  metricLabel: string;
  metricValue: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
  };
}

export interface PendingDecisionItem {
  id: string;
  title: string;
  minister: string;
  submittedAt: string;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  guardianVerification: string;
  proposedAction: string;
  requiresSuperAdminApproval: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const AIAsyPrimeCabinet: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const currentRole: UserRole = activeRole || userProfile?.role || 'CALON_WALI_MURID';
  const isSuperAdmin = currentRole === 'SUPER_ADMIN';

  // Active View Tab: Briefing, Ministers, Presidential Meeting, Pending Decisions
  const [activeTab, setActiveTab] = useState<'BRIEFING' | 'MINISTRIES' | 'CABINET_MEETING' | 'DECISIONS'>('BRIEFING');
  const [meetingRunning, setMeetingRunning] = useState<boolean>(false);
  const [meetingStep, setMeetingStep] = useState<number>(0);
  const [meetingCompleted, setMeetingCompleted] = useState<boolean>(false);

  // Time-of-day contextual briefing
  const [briefingType, setBriefingType] = useState<'MORNING' | 'NIGHT'>('MORNING');

  // The 8 AI Ministries
  const [ministers, setMinisters] = useState<AIMinisterProfile[]>([
    {
      id: 'intel',
      name: 'Dr. Asy-Intelligence',
      roleTitle: 'Menteri Intelijen & Analitik Strategis',
      department: 'Intelligence Ministry',
      icon: BrainCircuit,
      status: 'OPTIMAL',
      healthScore: 99,
      lastActivity: '2 menit lalu',
      assignedTasks: [
        'Prediksi tren pendaftaran PPDB gelombang 2',
        'Analisis retensi kehadiran santri mingguan',
        'Deteksi anomali akses perangkat baru'
      ],
      recommendations: [
        'Optimalisasi alokasi kelas B3 berdasarkan minat tahfidz awal',
        'Jadwalkan reminder konfirmasi ulang calon wali murid 48 jam sebelum batas SPP'
      ],
      metricLabel: 'Analytic Precision',
      metricValue: '99.8%',
      colorScheme: {
        bg: 'bg-indigo-50/50',
        border: 'border-indigo-200',
        text: 'text-indigo-900',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-800'
      }
    },
    {
      id: 'maintenance',
      name: 'Eng. Asy-Maintenance',
      roleTitle: 'Menteri Pemeliharaan & Self-Healing',
      department: 'Maintenance Ministry',
      icon: Wrench,
      status: 'ACTIVE',
      healthScore: 100,
      lastActivity: '30 detik lalu',
      assignedTasks: [
        'Pembersihan memori cache GPS presensi usang',
        'Pemeriksaan antrean IndexedDB offline sync',
        'Rotasi token heartbeat real-time Firestore'
      ],
      recommendations: [
        'Pertahankan limit auto-compact IndexedDB pada interval 6 jam',
        'Pertahankan non-destructive auto-repair MTTR < 4s'
      ],
      metricLabel: 'Non-Destructive MTTR',
      metricValue: '3.2s',
      colorScheme: {
        bg: 'bg-emerald-50/50',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800'
      }
    },
    {
      id: 'document',
      name: 'Ust. Asy-Document',
      roleTitle: 'Menteri Dokumen & Pengesahan Rapor',
      department: 'Document Ministry',
      icon: FileText,
      status: 'OPTIMAL',
      healthScore: 98,
      lastActivity: '5 menit lalu',
      assignedTasks: [
        'Standarisasi template Rapor Kurikulum Merdeka PAUD',
        'Generasi batch surat kelulusan & kartu SPP santri',
        'Kompresi otomatis berkas akta kelahiran calon santri'
      ],
      recommendations: [
        'Aktifkan mode jsPDF Worker RAM capping < 60MB untuk cetak massal',
        'Sertakan QR-Code verifikasi hash SHA-256 pada seluruh lembar ijazah'
      ],
      metricLabel: 'Doc Processing SLA',
      metricValue: '1.1s/doc',
      colorScheme: {
        bg: 'bg-blue-50/50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-800'
      }
    },
    {
      id: 'archive',
      name: 'Ars. Asy-Archive',
      roleTitle: 'Menteri Arsip & Kerapian Cold Storage',
      department: 'Archive Ministry',
      icon: Archive,
      status: 'OPTIMAL',
      healthScore: 100,
      lastActivity: '12 menit lalu',
      assignedTasks: [
        'Audit cold backup snapshot SHA-256 semester ganjil',
        'Strukturisasi folder dokumen PPDB per tahun ajaran',
        'Verifikasi anti-tampering arsip nilai tahfidz'
      ],
      recommendations: [
        'Lakukan zero-data-loss snapshot restore verification berkala',
        'Arsipkan log notifikasi WhatsApp yang berusia > 180 hari'
      ],
      metricLabel: 'Snapshot Integrity',
      metricValue: '100% Verified',
      colorScheme: {
        bg: 'bg-amber-50/50',
        border: 'border-amber-200',
        text: 'text-amber-900',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800'
      }
    },
    {
      id: 'finance',
      name: 'Akunt. Asy-Finance',
      roleTitle: 'Menteri Keuangan AI & Audit SPP',
      department: 'Finance Ministry',
      icon: DollarSign,
      status: 'OPTIMAL',
      healthScore: 100,
      lastActivity: '1 menit lalu',
      assignedTasks: [
        'Rekonsiliasi transaksi kasir SPP harian',
        'Pemantauan lock anti-double-spend FIND-08-R3',
        'Proyeksi arus kas operasional yayasan bulan berjalan'
      ],
      recommendations: [
        'Kunci nomor urut invoice serial (H0-01) agar terhindar dari gap angka',
        'Kirimkan notifikasi ramah via WhatsApp bagi invoice jatuh tempo H-2'
      ],
      metricLabel: 'Zero Discrepancy Rate',
      metricValue: '100.0%',
      colorScheme: {
        bg: 'bg-emerald-50/50',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800'
      }
    },
    {
      id: 'education',
      name: 'Ustdzh. Asy-Education',
      roleTitle: 'Menteri Kurikulum & Tahfidz Intelligence',
      department: 'Education Ministry',
      icon: GraduationCap,
      status: 'ACTIVE',
      healthScore: 97,
      lastActivity: '4 menit lalu',
      assignedTasks: [
        'Rekomendasi materi adab harian tematik PAUD Islam',
        'Pelacakan mutabaah hafalan surat pendek santri',
        'Penyusunan format buku penghubung digital terpersonalisasi'
      ],
      recommendations: [
        'Integrasikan narasi penyemangat Dek Syifa pada modul tahfidz santri',
        'Sediakan opsi feedback audio singkat untuk guru pengampu kelas TK-A'
      ],
      metricLabel: 'Tahfidz Progress Rate',
      metricValue: '94.2%',
      colorScheme: {
        bg: 'bg-teal-50/50',
        border: 'border-teal-200',
        text: 'text-teal-900',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-800'
      }
    },
    {
      id: 'knowledge',
      name: 'Pust. Asy-Knowledge',
      roleTitle: 'Menteri Pengetahuan & Guardian Library (GKL)',
      department: 'Knowledge Ministry',
      icon: BookOpen,
      status: 'OPTIMAL',
      healthScore: 100,
      lastActivity: '15 menit lalu',
      assignedTasks: [
        'Sinkronisasi kartu pengetahuan insiden Chaos Lab ke GKL',
        'Penyusunan FAQ interaktif wali murid PPDB',
        'Audit glosarium syariah dan tata tertib madrasah'
      ],
      recommendations: [
        'Perbarui SOP penanganan internet putus di lingkungan sekolah',
        'Pertahankan indexing semantik panduan guru pada waktu tanggap < 200ms'
      ],
      metricLabel: 'GKL Coverage',
      metricValue: '142 Rules',
      colorScheme: {
        bg: 'bg-purple-50/50',
        border: 'border-purple-200',
        text: 'text-purple-900',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-800'
      }
    },
    {
      id: 'monitoring',
      name: 'Insp. Asy-Monitoring',
      roleTitle: 'Menteri Pengawasan & Observabilitas 24/7',
      department: 'Monitoring Ministry',
      icon: Activity,
      status: 'OPTIMAL',
      healthScore: 100,
      lastActivity: 'Realtime',
      assignedTasks: [
        'Pemantauan ingress Layer-7 DDoS Shield',
        'Audit tingkat kepatuhan Zero Trust Security Rules',
        'Pengawasan batas kuota operasional Firestore Free Tier'
      ],
      recommendations: [
        'Pertahankan status App Check attestation pada tingkat 100%',
        'Kirim alert langsung ke Super Admin jika write rate melonjak > 50 ops/s'
      ],
      metricLabel: 'Uptime Federation',
      metricValue: '99.99%',
      colorScheme: {
        bg: 'bg-rose-50/50',
        border: 'border-rose-200',
        text: 'text-rose-900',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800'
      }
    }
  ]);

  // Pending Strategic Decisions (Triple Verification: AI Asy Proposes -> Guardian Core Verifies -> Super Admin Approves)
  const [decisions, setDecisions] = useState<PendingDecisionItem[]>([
    {
      id: 'DEC-01',
      title: 'Optimalisasi Pembagian Kelas Paralel TK-B (B1, B2, B3)',
      minister: 'Dr. Asy-Intelligence (Intelligence Ministry)',
      submittedAt: 'Hari ini, 07:15 WIB',
      riskTier: 'LOW',
      description: 'Menyeimbangkan rasio guru-santri 1:12 berdasarkan usia perkembangan dan capaian kemandirian motorik kasar/halus.',
      guardianVerification: 'PASS: Tidak ada modifikasi data finansial ataupun struktur database inti. Mematuhi invariant H0-02.',
      proposedAction: 'Terapkan saran pembagian kelas pada draft penugasan wali kelas tahun ajaran baru.',
      requiresSuperAdminApproval: true,
      status: 'PENDING'
    },
    {
      id: 'DEC-02',
      title: 'Penerbitan Pengingat SPP Ramah Otomatis via WhatsApp Gateway',
      minister: 'Akunt. Asy-Finance (Finance Ministry)',
      submittedAt: 'Hari ini, 06:45 WIB',
      riskTier: 'MEDIUM',
      description: 'Kirim pesan pengingat tagihan SPP jatuh tempo 3 hari mendatang dengan template doa & keberkahan keluarga.',
      guardianVerification: 'PASS: Tidak ada perubahan status invoice. Nomor kontak disanitasi dan mematuhi WhatsApp Guardian rate limiter.',
      proposedAction: 'Jadwalkan pengiriman antrean WA Gateway batch sore hari (16:30 WIB).',
      requiresSuperAdminApproval: true,
      status: 'PENDING'
    },
    {
      id: 'DEC-03',
      title: 'Kompensasi Arsip Dokumen PPDB Calon Santri Tidak Lolos Verifikasi',
      minister: 'Ars. Asy-Archive (Archive Ministry)',
      submittedAt: 'Kemarin, 21:00 WIB',
      riskTier: 'LOW',
      description: 'Pindahkan berkas pendaftaran gelombang 1 yang tidak dikonfirmasi selama > 14 hari ke folder Cold Archive terisolasi.',
      guardianVerification: 'PASS: Tindakan non-destruktif. Data tidak dihapus, hanya diberi status flag ARCHIVED sesuai SOP Zero-Data-Loss.',
      proposedAction: 'Pindahkan 4 berkas pasif ke Cold Storage Sandbox Archive.',
      requiresSuperAdminApproval: true,
      status: 'PENDING'
    }
  ]);

  const handleDecisionAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setDecisions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : d))
    );
  };

  // Presidential Cabinet Meeting Steps
  const meetingSteps = [
    {
      speaker: 'AI Asy Prime (Digital Prime Minister)',
      role: 'Koordinator Kabinet AI Asy',
      icon: Crown,
      color: 'text-amber-400 bg-slate-900',
      text: 'Bismillah. Yang Mulia Super Admin, seluruh 8 Kementerian AI Asy telah hadir lengkap. Sidang Kabinet Presidensial Harian siap dimulai untuk memberikan laporan menyeluruh.'
    },
    {
      speaker: 'Guardian Core (President System)',
      role: 'Pengawal Kedaulatan Sistem',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-950',
      text: 'Status Konstitusi: 7 Invariants terkunci 100%. Anti-double-spend cashier aktif, audit trail tak terhapus, App Check attestation valid, dan Zero Trust beroperasi sempurna.'
    },
    {
      speaker: 'Ars. Asy-Archive & Eng. Asy-Maintenance',
      role: 'Kementerian Arsip & Pemeliharaan',
      icon: Archive,
      color: 'text-blue-400 bg-blue-950',
      text: 'Laporan Infrastruktur: Backup harian snapshot SHA-256 selesai pukul 02:00 WIB (Zero Data Loss). Seluruh antrean self-healing non-destruktif tuntas dengan MTTR 3.2 detik.'
    },
    {
      speaker: 'Akunt. Asy-Finance & Dr. Asy-Intelligence',
      role: 'Kementerian Keuangan & Intelijen',
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-950',
      text: 'Laporan Finansial & PPDB: 100% transaksi SPP terekonsiliasi tanpa selisih (Rp 0 discrepancy). PPDB gelombang 2 mencatat 48 pendaftar baru dengan tingkat konfirmasi 91.5%.'
    },
    {
      speaker: 'Insp. Asy-Monitoring (Monitoring Ministry)',
      role: 'Kementerian Pengawasan & DDoS Shield',
      icon: Activity,
      color: 'text-indigo-400 bg-indigo-950',
      text: 'Laporan Pertahanan: 7-Layer DDoS Shield dalam status Hijau. Nol insiden injeksi atau pelanggaran otorisasi. Seluruh 58 modul SIM beroperasi dengan performa optimal.'
    },
    {
      speaker: 'AI Asy Prime (Digital Prime Minister)',
      role: 'Koordinator Kabinet AI Asy',
      icon: Crown,
      color: 'text-amber-400 bg-slate-900',
      text: 'Kesimpulan Sidang: Sistem TK ASY SYIFA dalam kondisi prima, aman, dan siap melayani seluruh siswa, dewan guru, dan wali murid hari ini. Menunggu instruksi Yang Mulia Super Admin.'
    }
  ];

  const startCabinetMeeting = () => {
    setMeetingRunning(true);
    setMeetingStep(0);
    setMeetingCompleted(false);
  };

  useEffect(() => {
    let timer: any;
    if (meetingRunning && meetingStep < meetingSteps.length - 1) {
      timer = setTimeout(() => {
        setMeetingStep((prev) => prev + 1);
      }, 4200);
    } else if (meetingRunning && meetingStep === meetingSteps.length - 1) {
      timer = setTimeout(() => {
        setMeetingRunning(false);
        setMeetingCompleted(true);
      }, 4500);
    }
    return () => clearTimeout(timer);
  }, [meetingRunning, meetingStep, meetingSteps.length]);

  return (
    <div className="space-y-6">
      {/* RBAC Notice if not Super Admin */}
      {!isSuperAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Mode Observasi Terbatas (Role: {currentRole}):</strong> Dashboard Kabinet Presidensial AI Asy Prime hanya mengizinkan persetujuan aksi strategis oleh <strong>Super Admin</strong>.
          </div>
        </div>
      )}

      {/* Presidential Cabinet Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown className="w-64 h-64 text-amber-300" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> AI Asy Prime • Digital Prime Minister & 8 Ministries
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Kabinet Pemerintahan AI Asy Prime (RC6)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Dewan kecerdasan terpadu di bawah Konstitusi TADE v3.0. AI Asy Prime mengoordinasikan 8 Menteri AI untuk menyajikan analisis, pemeliharaan otonom, dan rekomendasi strategis dengan prinsip <strong>Triple Verification Protocol</strong> tanpa wewenang destruktif mandiri.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={startCabinetMeeting}
              disabled={meetingRunning}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {meetingRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> Sidang Kabinet Berlangsung...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-slate-950 fill-current" /> Sidang Kabinet Presidensial
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Cabinet Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">KOORDINATOR:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1 mt-0.5">
              <Crown className="w-3.5 h-3.5" /> AI Asy Prime
            </span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">TOTAL KEMENTERIAN:</span>
            <span className="text-white font-bold flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-blue-400" /> 8 Menteri AI Aktif
            </span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">GUARDIAN ALIGNMENT:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Invariants OK
            </span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">OTORITAS AKHIR:</span>
            <span className="text-amber-300 font-bold flex items-center gap-1 mt-0.5">
              <Vote className="w-3.5 h-3.5 text-amber-400" /> Super Admin Only
            </span>
          </div>
        </div>
      </div>

      {/* Animated Presidential Cabinet Meeting Modal/Card */}
      <AnimatePresence>
        {(meetingRunning || meetingCompleted) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    Sidang Kabinet Presidensial Harian • TK ASY SYIFA
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Protokol Pelaporan Berurutan 8 Menteri AI kepada Super Admin
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-mono font-bold rounded-full border border-amber-500/30">
                  Step {meetingStep + 1} of {meetingSteps.length}
                </span>
                {meetingCompleted && (
                  <button
                    onClick={() => setMeetingCompleted(false)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                  >
                    Tutup
                  </button>
                )}
              </div>
            </div>

            {/* Current Speaker Display */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  {React.createElement(meetingSteps[meetingStep].icon, { className: 'w-8 h-8' })}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{meetingSteps[meetingStep].speaker}</h3>
                  <p className="text-[11px] text-amber-300/80 font-mono">{meetingSteps[meetingStep].role}</p>
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  <Radio className="w-3 h-3 animate-pulse" /> Live Briefing
                </div>
              </div>

              <div className="md:col-span-3 space-y-4">
                <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 min-h-[140px] flex items-center">
                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans italic">
                    "{meetingSteps[meetingStep].text}"
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2">
                  {meetingSteps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        idx === meetingStep
                          ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                          : idx < meetingStep
                          ? 'bg-emerald-500'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 flex flex-wrap gap-2 print:hidden shadow-xs">
        <button
          onClick={() => setActiveTab('BRIEFING')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer min-h-[44px] ${
            activeTab === 'BRIEFING' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Briefing Pagi & Laporan Malam
        </button>

        <button
          onClick={() => setActiveTab('MINISTRIES')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer min-h-[44px] ${
            activeTab === 'MINISTRIES' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" /> Dewan 8 Menteri AI
        </button>

        <button
          onClick={() => setActiveTab('DECISIONS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer min-h-[44px] ${
            activeTab === 'DECISIONS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Vote className="w-4 h-4 text-emerald-400" /> Persetujuan Keputusan Strategis ({decisions.filter((d) => d.status === 'PENDING').length})
        </button>
      </div>

      {/* TAB 1: EXECUTIVE BRIEFING (MORNING / NIGHT) */}
      {activeTab === 'BRIEFING' && (
        <div className="space-y-6">
          {/* Briefing Toggle */}
          <div className="flex items-center justify-between bg-stone-100 p-2 rounded-2xl">
            <div className="text-xs font-bold text-stone-700 px-3">Mode Laporan AI Asy Prime:</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBriefingType('MORNING')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  briefingType === 'MORNING' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-stone-600 hover:bg-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-900" /> Briefing Pagi Hari (06:00 - 12:00 WIB)
              </button>
              <button
                onClick={() => setBriefingType('NIGHT')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  briefingType === 'NIGHT' ? 'bg-indigo-900 text-white shadow-xs' : 'text-stone-600 hover:bg-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-300" /> Laporan Penutupan Malam (18:00 - 23:00 WIB)
              </button>
            </div>
          </div>

          {briefingType === 'MORNING' ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Morning Executive Briefing — Bismillah, Selamat Pagi Yang Mulia
                  </h2>
                  <p className="text-xs text-stone-500">
                    Disusun oleh AI Asy Prime (Chief of Staff & Digital Prime Minister) • {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Kesiapan Guru & Santri</h3>
                  <div className="text-2xl font-black text-stone-900">100% Siap</div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Seluruh jadwal mengajar, modul tahfidz, dan daftar presensi pagi telah disinkronisasi ke perangkat dewan guru.
                  </p>
                </div>

                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Status Keuangan & Kasir</h3>
                  <div className="text-2xl font-black text-emerald-900">Rp 0 Selisih</div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Anti-double-spend locks (FIND-08-R3) memvalidasi integritas kasir SPP. Tidak ada tagihan gantung atau invoice tak tercatat.
                  </p>
                </div>

                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-indigo-700 tracking-wider">Integritas Guardian Core</h3>
                  <div className="text-2xl font-black text-indigo-900">7 Invariants OK</div>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    App Check attestation valid, RBAC 7 peran terisolasi, dan Layer-7 DDoS Shield dalam status siaga hijau.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                <h3 className="text-xs font-bold uppercase text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Agenda Prioritas Hari Ini dari AI Asy Prime
                </h3>
                <ul className="space-y-2 text-xs text-amber-950">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>07:30 - 08:30 WIB:</strong> Pemantauan presensi kedatangan santri & doa bersama dipandu Dek Syifa Audio.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>10:00 - 11:30 WIB:</strong> Pembagian berkas calon santri PPDB gelombang 2 untuk verifikasi dokumen fisik oleh panitia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>14:00 WIB:</strong> Penutupan kasir SPP harian dan sinkronisasi otomatis jurnal buku besar madrasah.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-indigo-900 text-indigo-300 rounded-2xl border border-indigo-700">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Night Closing Report — Alhamdulillah, Rekapitulasi Operasional Harian
                  </h2>
                  <p className="text-xs text-slate-400">
                    Disusun oleh AI Asy Prime & Seluruh 8 Kementerian AI • Waktu Penutupan Harian
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tingkat Kehadiran Harian</h3>
                  <div className="text-2xl font-black text-white">98.4% Hadir</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    2 santri izin sakit telah dicatat oleh wali kelas bersama resep doa kesembuhan otomatis via Buku Penghubung.
                  </p>
                </div>

                <div className="p-5 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Capaian Tahfidz & Akademik</h3>
                  <div className="text-2xl font-black text-emerald-400">42 Setoran Hafalan</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    100% catatan mutabaah hafalan surat An-Nas s/d Al-Fil telah disahkan guru pengampu dan tersinkronisasi ke wali murid.
                  </p>
                </div>

                <div className="p-5 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Jadwal Backup Malam</h3>
                  <div className="text-2xl font-black text-indigo-400">02:00 WIB (Siaga)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cold Snapshot SHA-256 terenkripsi dijadwalkan otomatis dengan retensi zero-data-loss dan verifikasi checksum.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: THE EIGHT AI MINISTRIES */}
      {activeTab === 'MINISTRIES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Daftar Dewan 8 Kementerian AI Asy
              </h2>
              <p className="text-xs text-stone-500">
                Setiap menteri memiliki tugas fungsional terarah, indikator kesehatan, dan batas wewenang ketat tanpa eksekusi kritis mandiri.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
              8/8 Kementerian Optimal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ministers.map((m) => {
              const IconComp = m.icon;
              return (
                <div
                  key={m.id}
                  className={`p-6 rounded-3xl border ${m.colorScheme.border} ${m.colorScheme.bg} shadow-xs space-y-5 transition hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-slate-900">
                        <IconComp className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-stone-900">{m.name}</h3>
                        <p className="text-xs font-medium text-stone-600">{m.roleTitle}</p>
                        <span className="text-[10px] font-mono text-stone-500">{m.department}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${m.colorScheme.badgeBg} ${m.colorScheme.badgeText}`}>
                        {m.status} • {m.healthScore}%
                      </span>
                      <div className="text-[10px] text-stone-400 font-mono mt-1">Aktif: {m.lastActivity}</div>
                    </div>
                  </div>

                  {/* Assigned Tasks */}
                  <div className="space-y-1.5 bg-white/80 p-3.5 rounded-2xl border border-stone-200/60">
                    <h4 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                      Fokus Tugas Berjalan:
                    </h4>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {m.assignedTasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-1.5 bg-white/80 p-3.5 rounded-2xl border border-stone-200/60">
                    <h4 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <Sparkle className="w-3 h-3 text-amber-500" /> Rekomendasi Strategis:
                    </h4>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {m.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Minister Metric */}
                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-stone-200/40">
                    <span className="text-stone-500">{m.metricLabel}:</span>
                    <span className="font-bold text-stone-900">{m.metricValue}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PENDING STRATEGIC DECISIONS (TRIPLE VERIFICATION PROTOCOL) */}
      {activeTab === 'DECISIONS' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-950 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong>Protokol Verifikasi Tiga Lapis (Triple Verification Protocol):</strong> (1) AI Asy menganalisis $\rightarrow$ (2) Guardian Core memverifikasi kepatuhan invariant $\rightarrow$ (3) Super Admin memberikan persetujuan akhir. Tidak ada aksi yang dapat dieksekusi secara otonom tanpa tanda tangan digital Super Admin.
            </div>
          </div>

          <div className="space-y-4">
            {decisions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-xs font-bold">
                      {item.id}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      item.riskTier === 'LOW' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Risk: {item.riskTier}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">{item.submittedAt}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <div className="font-medium text-stone-800">Diajukan oleh: <span className="font-normal text-stone-600">{item.minister}</span></div>
                  <p className="leading-relaxed">{item.description}</p>
                </div>

                <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-xs space-y-1.5 font-mono">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Hasil Verifikasi Guardian Core:
                  </div>
                  <p className="text-slate-300 font-sans">{item.guardianVerification}</p>
                  <div className="text-[11px] text-amber-300">
                    Aksi yang diusulkan: {item.proposedAction}
                  </div>
                </div>

                {/* Super Admin Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-mono">
                    Status:{' '}
                    <span
                      className={`font-bold ${
                        item.status === 'APPROVED'
                          ? 'text-emerald-600'
                          : item.status === 'REJECTED'
                          ? 'text-rose-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.status === 'PENDING' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecisionAction(item.id, 'REJECT')}
                        disabled={!isSuperAdmin}
                        className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold cursor-pointer disabled:opacity-50 min-h-[44px]"
                      >
                        Tolak Usulan
                      </button>
                      <button
                        onClick={() => handleDecisionAction(item.id, 'APPROVE')}
                        disabled={!isSuperAdmin}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 min-h-[44px]"
                      >
                        <Check className="w-4 h-4" /> Setujui & Terapkan (Super Admin)
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Keputusan Telah Ditetapkan
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
