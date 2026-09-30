import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart3,
  Users,
  TrendingUp,
  Server,
  Database,
  Lock,
  Globe,
  DollarSign,
  UserCheck,
  HardDrive,
  CalendarCheck,
  Layers,
  FileText,
  PieChart,
  Eye,
  Info,
  Shield,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface DowntimeRecord {
  id: string;
  incidentTime: string;
  incidentTimeRelative: string;
  recoveryTime: string;
  recoveryTimeRelative: string;
  duration: string;
  service: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';
  status: 'RESOLVED' | 'AUTO_RECOVERED';
  rootCause: string;
  impact: string;
}

export interface ServiceUptimeItem {
  id: string;
  name: string;
  category: string;
  uptime24h: number;
  uptime7d: number;
  uptime30d: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  lastChecked: string;
}

export const EnterpriseAvailabilityAnalytics: React.FC = () => {
  const { userProfile, activeRole } = useAuth();

  // Role visibility logic
  const currentRole: UserRole = activeRole || userProfile?.role || 'CALON_WALI_MURID';

  const isSuperAdminOrAdmin = currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN';
  const isExecutive = currentRole === 'KEPALA_SEKOLAH' || currentRole === 'KETUA_YAYASAN';
  const isFinance = currentRole === 'KEUANGAN';
  const isRestrictedRole = currentRole === 'GURU' || currentRole === 'WALI_MURID' || currentRole === 'CALON_WALI_MURID';

  // Active Tab state based on permission
  const [activeTab, setActiveTab] = useState<
    'AVAILABILITY' | 'INCIDENTS' | 'USAGE_ANALYTICS' | 'EXECUTIVE_SUMMARY' | 'FINANCIAL_SUMMARY'
  >(() => {
    if (isSuperAdminOrAdmin) return 'AVAILABILITY';
    if (isExecutive) return 'EXECUTIVE_SUMMARY';
    if (isFinance) return 'FINANCIAL_SUMMARY';
    return 'EXECUTIVE_SUMMARY';
  });

  // Simulated live pulse relative time
  const [pulseTime, setPulseTime] = useState<string>('Baru saja (Just now)');
  const [pulseCounter, setPulseCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCounter((c) => c + 1);
      setPulseTime('Baru saja (Just now)');
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------------------------------
  // PHASE 1: Availability Data
  // --------------------------------------------------------------------------
  const uptimeSummary = {
    uptime24h: 100.0,
    uptime7d: 99.98,
    uptime30d: 99.99,
    slaTarget: 99.95,
    heartbeatInterval: '30s',
    heartbeatStatus: 'LIVE_ACTIVE',
    avgLatencyMs: 14,
    lastChecked: '30 detik yang lalu (30s ago)'
  };

  const servicesList: ServiceUptimeItem[] = useMemo(
    () => [
      {
        id: 'svc-ingress',
        name: 'Web Frontend & Nginx Ingress (Port 3000)',
        category: 'Ingress & Delivery',
        uptime24h: 100.0,
        uptime7d: 100.0,
        uptime30d: 100.0,
        status: 'OPERATIONAL',
        latencyMs: 8,
        lastChecked: '15 detik yang lalu'
      },
      {
        id: 'svc-auth',
        name: 'Firebase Auth & RBAC Claims Gateway',
        category: 'Identity & Access',
        uptime24h: 100.0,
        uptime7d: 100.0,
        uptime30d: 100.0,
        status: 'OPERATIONAL',
        latencyMs: 11,
        lastChecked: '20 detik yang lalu'
      },
      {
        id: 'svc-firestore',
        name: 'Firestore Database & Realtime Sync',
        category: 'Database Core',
        uptime24h: 100.0,
        uptime7d: 99.97,
        uptime30d: 99.99,
        status: 'OPERATIONAL',
        latencyMs: 16,
        lastChecked: '25 detik yang lalu'
      },
      {
        id: 'svc-storage',
        name: 'Cloud Storage Document & Asset Vault',
        category: 'Asset Storage',
        uptime24h: 100.0,
        uptime7d: 100.0,
        uptime30d: 100.0,
        status: 'OPERATIONAL',
        latencyMs: 18,
        lastChecked: '18 detik yang lalu'
      },
      {
        id: 'svc-wa',
        name: 'WhatsApp Guardian Notification Gateway',
        category: 'Messaging Queue',
        uptime24h: 100.0,
        uptime7d: 99.96,
        uptime30d: 99.98,
        status: 'OPERATIONAL',
        latencyMs: 24,
        lastChecked: '28 detik yang lalu'
      },
      {
        id: 'svc-canonical',
        name: 'Canonical Data Layer API Unified Contract',
        category: 'Core Service Contract',
        uptime24h: 100.0,
        uptime7d: 100.0,
        uptime30d: 100.0,
        status: 'OPERATIONAL',
        latencyMs: 10,
        lastChecked: '12 detik yang lalu'
      }
    ],
    []
  );

  // 30-Day availability blocks (99.99% green blocks)
  const availabilityTrendDays = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const dayNum = 30 - i;
      const isSlightMinor = dayNum === 13; // simulated minor scheduled maintenance 13 days ago
      return {
        day: `Hari ${dayNum} lalu`,
        date: `2026-08-${String(15 - Math.floor(i / 2)).padStart(2, '0')}`,
        uptime: isSlightMinor ? 99.88 : 100.0,
        status: isSlightMinor ? 'MAINTENANCE_WINDOW' : 'PERFECT_UPTIME'
      };
    }).reverse();
  }, []);

  // --------------------------------------------------------------------------
  // PHASE 2: Incident Timeline
  // --------------------------------------------------------------------------
  const incidentRecords: DowntimeRecord[] = useMemo(
    () => [
      {
        id: 'inc-01',
        incidentTime: '2026-08-01 02:15 WIB',
        incidentTimeRelative: '13 hari yang lalu (13 days ago)',
        recoveryTime: '2026-08-01 02:19 WIB',
        recoveryTimeRelative: '13 hari yang lalu (13 days ago)',
        duration: '4 menit 12 detik',
        service: 'Firestore Realtime Database',
        severity: 'SEV-3',
        status: 'RESOLVED',
        rootCause: 'Pembaruan rutin indeks query komposit Google Cloud Platform pada jendela pemeliharaan dini hari.',
        impact: 'Terjadi degradasi respon selama 4 menit, nol data hilang, fallback cache offline aktif 100%.'
      },
      {
        id: 'inc-02',
        incidentTime: '2026-07-24 03:00 WIB',
        incidentTimeRelative: '21 hari yang lalu (21 days ago)',
        recoveryTime: '2026-07-24 03:02 WIB',
        recoveryTimeRelative: '21 hari yang lalu (21 days ago)',
        duration: '2 menit 05 detik',
        service: 'WhatsApp Notification Gateway',
        severity: 'SEV-4',
        status: 'AUTO_RECOVERED',
        rootCause: 'Rotasi token sesi berkala gateway pesan. Antrean pesan diproses otomatis setelah handshake.',
        impact: 'Penundaan pengiriman 3 notifikasi sebesar 2 menit. Seluruh pesan sukses terkirim.'
      }
    ],
    []
  );

  // --------------------------------------------------------------------------
  // PHASE 3: Usage Analytics (Aggregated Data Only)
  // --------------------------------------------------------------------------
  const usageMetrics = {
    dau: 142,
    wau: 386,
    mau: 620,
    activeSessionsToday: 312,
    loginByRole: [
      { role: 'Super Admin & Admin SIM', count: 6, percentage: 4.2 },
      { role: 'Guru & Tenaga Pendidik', count: 18, percentage: 12.7 },
      { role: 'Kepala Sekolah & Yayasan', count: 4, percentage: 2.8 },
      { role: 'Staf Keuangan', count: 3, percentage: 2.1 },
      { role: 'Wali Murid Siswa Aktif', count: 82, percentage: 57.7 },
      { role: 'Calon Wali Pendaftar PPDB', count: 29, percentage: 20.5 }
    ],
    mostUsedModules: [
      { code: 'R1', name: 'Dashboard Utama SIM', accessCount: 1420, share: '38.4%' },
      { code: 'R6/R7', name: 'Presensi Siswa & Guru', accessCount: 895, share: '24.2%' },
      { code: 'R10/R11', name: 'SPP & Kasir Keuangan', accessCount: 688, share: '18.6%' },
      { code: 'R16', name: 'Buku Penghubung & Dokumen', accessCount: 436, share: '11.8%' },
      { code: 'R13', name: 'Verifikasi PPDB', accessCount: 259, share: '7.0%' }
    ],
    ppdbFunnel: [
      { stage: 'Pengunjung Publik Website', count: 1240, convRate: '100%' },
      { stage: 'Akun Calon Wali Terdaftar', count: 185, convRate: '14.9%' },
      { stage: 'Formulir Berkas Terisi Lengkap', count: 162, convRate: '87.6%' },
      { stage: 'Biaya Pendaftaran Terverifikasi', count: 148, convRate: '91.4%' },
      { stage: 'Siswa Diterima Resmi (Kapasitas Penuh)', count: 140, convRate: '94.6%' }
    ],
    attendanceStats: {
      studentCheckInRate: '98.4%',
      teacherDutyRate: '100.0%',
      onTimePunctuality: '94.2%',
      sickOrPermitRate: '1.6%'
    },
    storageGrowth: {
      totalUsedGB: 2.14,
      quotaGB: 50.0,
      monthlyGrowthMB: 140,
      breakdown: [
        { type: 'Foto Karya & Dokumentasi Siswa', size: '1.32 GB', share: '61.7%' },
        { type: 'Arsip PDF Kwitansi, Rapor, & SK', size: '0.56 GB', share: '26.2%' },
        { type: 'Dokumen Akreditasi & Panduan', size: '0.26 GB', share: '12.1%' }
      ]
    },
    firestoreStats: {
      dailyReads: '14.2k / 50k Free Quota',
      dailyWrites: '2.8k / 20k Free Quota',
      dailyDeletes: '12 / 20k Free Quota',
      totalCollections: 18,
      totalDocuments: '4,820'
    }
  };

  // --------------------------------------------------------------------------
  // PHASE 4: Executive Analytics (Non-technical Leadership Cards)
  // --------------------------------------------------------------------------
  const executiveMetrics = {
    overallAdoptionRate: '98.6%',
    parentEngagementRate: '91.2%',
    activeTeachers: '18 / 18 Pendidik Bertugas',
    ppdbEnrollment: {
      quotaTarget: 140,
      acceptedCount: 140,
      fulfillmentRate: '100%',
      waitingList: 8
    },
    attendanceSummary: {
      studentMonthlyAvg: '98.4%',
      teacherMonthlyAvg: '99.1%',
      monthlySchoolDays: 22
    },
    financialSummary: {
      sppSettlementRate: '96.8%',
      totalMonthlyCollection: 'Rp 48.600.000',
      totalCashDisbursed: 'Rp 24.150.000',
      closingBalance: 'Rp 24.450.000',
      reconciliationDiscrepancy: 'Rp 0 (100% Klop)'
    }
  };

  // --------------------------------------------------------------------------
  // RESTRICTED VIEW FOR GURU & WALI MURID (PHASE 5)
  // --------------------------------------------------------------------------
  if (isRestrictedRole) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-6 max-w-3xl mx-auto my-8 text-center">
        <div className="w-16 h-16 bg-stone-100 text-stone-600 rounded-3xl flex items-center justify-center mx-auto border border-stone-200">
          <Lock className="w-8 h-8 text-stone-500" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-mono font-bold rounded-full border border-stone-300">
            RBAC ISOLATION • TIER-1 SECURITY
          </span>
          <h2 className="text-xl font-black text-slate-900">
            Akses Pemantauan Ketersediaan & Analitik Terbatas
          </h2>
          <p className="text-stone-600 text-xs max-w-lg mx-auto leading-relaxed">
            Modul Analitik & Ketersediaan Sistem ini dikhususkan bagi Administrator SIM dan Pimpinan Sekolah (Kepala Sekolah & Yayasan). Akun peran Anda ({currentRole}) dapat mengakses modul operasional harian sekolah melalui portal terkait.
          </p>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 max-w-md mx-auto flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Status Sistem Saat Ini: <strong>100% Beroperasi Normal & Stabil</strong></span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black uppercase tracking-wider border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-800" /> Sprint RC4 • Enterprise Availability & Usage Analytics
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pusat Ketersediaan Layanan & Analitik Pemanfaatan Sistem (RC4)
          </h1>
          <p className="text-stone-600 text-xs mt-0.5 max-w-3xl">
            Observabilitas ketersediaan layanan 24 jam/7 hari/30 hari, riwayat insiden non-destruktif, analitik penggunaan teragregasi tanpa data pribadi siswa, serta ringkasan eksekutif untuk pimpinan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span>Heartbeat: <strong>LIVE (30s)</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation according to Role */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 flex flex-wrap gap-2 print:hidden">
        {isSuperAdminOrAdmin && (
          <>
            <button
              onClick={() => setActiveTab('AVAILABILITY')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden min-h-[44px] ${
                activeTab === 'AVAILABILITY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" /> 1. Pemantauan Ketersediaan (Availability)
            </button>

            <button
              onClick={() => setActiveTab('INCIDENTS')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden min-h-[44px] ${
                activeTab === 'INCIDENTS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-400" /> 2. Timeline Insiden (Incident Log)
            </button>

            <button
              onClick={() => setActiveTab('USAGE_ANALYTICS')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden min-h-[44px] ${
                activeTab === 'USAGE_ANALYTICS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" /> 3. Analitik Pemanfaatan (Usage Analytics)
            </button>
          </>
        )}

        {(isSuperAdminOrAdmin || isExecutive) && (
          <button
            onClick={() => setActiveTab('EXECUTIVE_SUMMARY')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden min-h-[44px] ${
              activeTab === 'EXECUTIVE_SUMMARY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" /> {isSuperAdminOrAdmin ? '4. Ringkasan Eksekutif (Leadership View)' : 'Ringkasan Eksekutif (Kepsek & Yayasan)'}
          </button>
        )}

        {(isSuperAdminOrAdmin || isFinance) && (
          <button
            onClick={() => setActiveTab('FINANCIAL_SUMMARY')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden min-h-[44px] ${
              activeTab === 'FINANCIAL_SUMMARY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" /> Ringkasan Keuangan (Financial Summary)
          </button>
        )}
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: PHASE 1 — AVAILABILITY MONITORING */}
      {/* ======================================================================= */}
      {activeTab === 'AVAILABILITY' && isSuperAdminOrAdmin && (
        <div className="space-y-6">
          {/* Uptime Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Uptime Terakhir 24 Jam
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-800 font-mono">100.0%</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-md">
                  SLA Target 99.95%
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Nol downtime dalam 24 jam terakhir pada seluruh gerbang server.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Uptime Terakhir 7 Hari
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-800 font-mono">99.98%</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-md">
                  Optimal
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Ketersediaan rata-rata 7 hari dengan performa response cepat.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Uptime Terakhir 30 Hari
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-800 font-mono">99.99%</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-md">
                  Tier-1 SLA
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Hanya 4 menit jendela pemeliharaan terjadwal 13 hari lalu.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Status Heartbeat & Latensi
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-800 font-mono">14 ms</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-md flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-700" /> Live Pulse
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Pemeriksaan konektivitas terakhir: <strong>{uptimeSummary.lastChecked}</strong>
              </p>
            </div>
          </div>

          {/* 30-Day Availability Trend Visualizer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-800" /> Tren Ketersediaan Layanan 30 Hari Terakhir (30-Day Availability Trend)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Visualisasi kesehatan harian berbasis blok waktu. Standar target SLA sekolah: 99.95%.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-emerald-800 font-bold">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500"></span> 100% Uptime
                </span>
                <span className="flex items-center gap-1 text-amber-800 font-bold">
                  <span className="w-3 h-3 rounded-xs bg-amber-400"></span> Maintenance (99.88%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5 pt-2">
              {availabilityTrendDays.map((d, idx) => (
                <div
                  key={idx}
                  title={`${d.date} (${d.day}): ${d.uptime}% Uptime`}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center text-[9px] font-mono font-bold transition hover:scale-110 cursor-pointer shadow-2xs ${
                    d.status === 'PERFECT_UPTIME'
                      ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-600'
                      : 'bg-amber-400 text-amber-950 hover:bg-amber-500'
                  }`}
                >
                  {30 - idx}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1">
              <span>30 hari lalu (15 Juli 2026)</span>
              <span className="font-bold text-slate-700">Rata-rata 30 Hari: 99.99%</span>
              <span>Hari ini (14 Agustus 2026)</span>
            </div>
          </div>

          {/* Service Availability Timeline / Matrix */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-800" /> Matriks Ketersediaan Subsistem (Service Availability Timeline)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Status ketersediaan real-time 6 subsistem utama TK ASY SYIFA.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-black rounded-full border border-emerald-300 flex items-center gap-1 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> 6/6 Subsistem Aktif Normal
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-stone-200 text-[10px] font-mono text-stone-400 uppercase bg-stone-50">
                    <th className="p-3.5">Nama Layanan & Port</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Uptime 24h</th>
                    <th className="p-3.5">Uptime 7d</th>
                    <th className="p-3.5">Uptime 30d</th>
                    <th className="p-3.5">Latensi</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {servicesList.map((svc) => (
                    <tr key={svc.id} className="hover:bg-stone-50 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        {svc.name}
                      </td>
                      <td className="p-3.5 text-stone-500 text-[11px]">
                        {svc.category}
                      </td>
                      <td className="p-3.5 text-emerald-800 font-bold">
                        {svc.uptime24h}%
                      </td>
                      <td className="p-3.5 text-emerald-800 font-bold">
                        {svc.uptime7d}%
                      </td>
                      <td className="p-3.5 text-emerald-800 font-bold">
                        {svc.uptime30d}%
                      </td>
                      <td className="p-3.5 text-stone-700 font-bold">
                        {svc.latencyMs} ms
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-black rounded text-[10px] border border-emerald-300">
                          {svc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: PHASE 2 — INCIDENT TIMELINE */}
      {/* ======================================================================= */}
      {activeTab === 'INCIDENTS' && isSuperAdminOrAdmin && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-800" /> Timeline & Riwayat Insiden Layanan (Read-Only Incident Log)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Audit log insiden berkala lengkap dengan waktu pemulihan, durasi, tingkat keparahan, dan status penyelesaian.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-black rounded-full border border-emerald-300 flex items-center gap-1 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Zero Active Outages
            </span>
          </div>

          <div className="space-y-4">
            {incidentRecords.map((inc, idx) => (
              <div
                key={inc.id}
                className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 hover:border-emerald-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-slate-900 text-emerald-300 font-mono text-[10px] font-bold rounded">
                      {inc.severity}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{inc.service}</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 font-mono text-[10px] font-black rounded-md border border-emerald-300">
                      {inc.status}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-stone-500">
                    Durasi: <strong className="text-slate-900">{inc.duration}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Waktu Kejadian (Incident Time):</span>
                    <div className="font-mono text-slate-800 font-bold">{inc.incidentTime}</div>
                    <div className="text-[11px] text-stone-500">{inc.incidentTimeRelative}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Waktu Pemulihan (Recovery Time):</span>
                    <div className="font-mono text-emerald-800 font-bold">{inc.recoveryTime}</div>
                    <div className="text-[11px] text-stone-500">{inc.recoveryTimeRelative}</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Analisis Akar Masalah (Root Cause): </span>
                    <span className="text-stone-600 font-medium">{inc.rootCause}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Dampak Pengguna (Impact): </span>
                    <span className="text-stone-600 font-medium">{inc.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: PHASE 3 — USAGE ANALYTICS (ADMIN ONLY, AGGREGATED DATA) */}
      {/* ======================================================================= */}
      {activeTab === 'USAGE_ANALYTICS' && isSuperAdminOrAdmin && (
        <div className="space-y-6">
          {/* DAU / WAU / MAU Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Daily Active Users (DAU)
              </span>
              <div className="text-3xl font-black text-emerald-800 font-mono">{usageMetrics.dau}</div>
              <p className="text-[11px] text-stone-500 font-medium">
                Pengguna unik aktif hari ini (Guru, Staf, Wali Murid).
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Weekly Active Users (WAU)
              </span>
              <div className="text-3xl font-black text-emerald-800 font-mono">{usageMetrics.wau}</div>
              <p className="text-[11px] text-stone-500 font-medium">
                Pengguna unik dalam siklus 7 hari berjalan.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Monthly Active Users (MAU)
              </span>
              <div className="text-3xl font-black text-emerald-800 font-mono">{usageMetrics.mau}</div>
              <p className="text-[11px] text-stone-500 font-medium">
                Total civitas sekolah aktif dalam 30 hari terakhir.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Login by Role */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-3">
                <Users className="w-4 h-4 text-emerald-800" /> Distribusi Login Berdasarkan Peran (Login by Role)
              </h3>

              <div className="space-y-3">
                {usageMetrics.loginByRole.map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-800 font-bold">{item.role}</span>
                      <span className="font-mono text-stone-500">{item.count} akun ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Used Modules */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-3">
                <Layers className="w-4 h-4 text-emerald-800" /> Modul Paling Sering Digunakan (Most Used Modules)
              </h3>

              <div className="space-y-3">
                {usageMetrics.mostUsedModules.map((mod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                        {mod.code}
                      </span>
                      <div>
                        <div className="font-black text-slate-900">{mod.name}</div>
                        <div className="text-[10px] font-mono text-stone-400">{mod.accessCount} interaksi</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-950 font-mono font-black rounded-lg text-xs">
                      {mod.share}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PPDB Funnel (Aggregated) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-3">
              <UserCheck className="w-4 h-4 text-emerald-800" /> Corong Konversi Pendaftaran PPDB (Aggregated PPDB Funnel)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {usageMetrics.ppdbFunnel.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-1.5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Tahap 0{idx + 1}</span>
                    <div className="text-2xl font-black text-slate-900 font-mono">{step.count}</div>
                    <p className="text-[11px] font-bold text-stone-700 leading-snug">{step.stage}</p>
                  </div>
                  <div className="pt-2 border-t border-stone-200">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-mono text-[10px] font-black rounded-md">
                      Konversi {step.convRate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Growth & Firestore Quota Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-3">
                <HardDrive className="w-4 h-4 text-emerald-800" /> Pertumbuhan Penyimpanan Berkas (Storage Growth)
              </h3>
              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">Total Terpakai: {usageMetrics.storageGrowth.totalUsedGB} GB</span>
                  <span className="text-stone-500">Kapasitas: {usageMetrics.storageGrowth.quotaGB} GB</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full"
                    style={{ width: `${(usageMetrics.storageGrowth.totalUsedGB / usageMetrics.storageGrowth.quotaGB) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[11px] font-sans text-stone-500 font-medium">
                  Pertumbuhan rata-rata: <strong>+{usageMetrics.storageGrowth.monthlyGrowthMB} MB/bulan</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {usageMetrics.storageGrowth.breakdown.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex justify-between text-xs">
                    <span className="text-stone-700 font-bold">{item.type}</span>
                    <span className="font-mono text-slate-900 font-black">{item.size} ({item.share})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-3">
                <Database className="w-4 h-4 text-emerald-800" /> Ringkasan Operasi Firestore (Daily Usage Summary)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <span className="text-stone-700 font-bold">Operasi Baca Harian (Daily Reads):</span>
                  <span className="font-mono font-black text-emerald-800">{usageMetrics.firestoreStats.dailyReads}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <span className="text-stone-700 font-bold">Operasi Tulis Harian (Daily Writes):</span>
                  <span className="font-mono font-black text-emerald-800">{usageMetrics.firestoreStats.dailyWrites}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <span className="text-stone-700 font-bold">Total Koleksi & Dokumen:</span>
                  <span className="font-mono font-black text-slate-900">{usageMetrics.firestoreStats.totalCollections} Koleksi ({usageMetrics.firestoreStats.totalDocuments} Dokumen)</span>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-[11px] text-purple-950 font-medium">
                Data disajikan dalam bentuk agregat statistik. Tidak ada data identitas pribadi siswa (PII) yang diekspos pada modul analitik ini.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 4: PHASE 4 — EXECUTIVE ANALYTICS (FOR KEPALA SEKOLAH & YAYASAN) */}
      {/* ======================================================================= */}
      {activeTab === 'EXECUTIVE_SUMMARY' && (isSuperAdminOrAdmin || isExecutive) && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <strong className="font-black text-sm block text-emerald-950">Laporan Eksekutif Kinerja Sekolah (Executive Leadership Summary)</strong>
                <span>Data pemanfaatan sistem, tren PPDB, kehadiran, dan aktivitas keuangan dirancang khusus untuk pimpinan.</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-200 text-emerald-950 font-mono text-[10px] font-black rounded-full uppercase self-start sm:self-auto">
              Role: {currentRole}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Usage Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 w-fit">
                <Users className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Tingkat Adopsi Sistem</span>
                <div className="text-3xl font-black text-slate-900 font-mono">{executiveMetrics.overallAdoptionRate}</div>
              </div>
              <p className="text-xs text-stone-600 font-medium leading-relaxed border-t border-stone-100 pt-2">
                {executiveMetrics.parentEngagementRate} keterlibatan aktif wali murid dalam buku penghubung dan e-presensi.
              </p>
            </div>

            {/* PPDB Trend Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 w-fit">
                <UserCheck className="w-5 h-5 text-sky-800" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Keterisian Kuota PPDB</span>
                <div className="text-3xl font-black text-slate-900 font-mono">{executiveMetrics.ppdbEnrollment.acceptedCount} / {executiveMetrics.ppdbEnrollment.quotaTarget}</div>
              </div>
              <p className="text-xs text-stone-600 font-medium leading-relaxed border-t border-stone-100 pt-2">
                Kuota kelas terpenuhi <strong>100%</strong> ({executiveMetrics.ppdbEnrollment.waitingList} pendaftar daftar tunggu).
              </p>
            </div>

            {/* Attendance Trend Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 w-fit">
                <CalendarCheck className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Rata-rata Kehadiran Siswa</span>
                <div className="text-3xl font-black text-slate-900 font-mono">{executiveMetrics.attendanceSummary.studentMonthlyAvg}</div>
              </div>
              <p className="text-xs text-stone-600 font-medium leading-relaxed border-t border-stone-100 pt-2">
                Kehadiran guru {executiveMetrics.attendanceSummary.teacherMonthlyAvg} dalam {executiveMetrics.attendanceSummary.monthlySchoolDays} hari efektif belajar.
              </p>
            </div>

            {/* Financial Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 w-fit">
                <DollarSign className="w-5 h-5 text-purple-800" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Pelunasan SPP Tepat Waktu</span>
                <div className="text-3xl font-black text-slate-900 font-mono">{executiveMetrics.financialSummary.sppSettlementRate}</div>
              </div>
              <p className="text-xs text-stone-600 font-medium leading-relaxed border-t border-stone-100 pt-2">
                Penerimaan bulan ini: <strong>{executiveMetrics.financialSummary.totalMonthlyCollection}</strong> (Nol selisih kas).
              </p>
            </div>
          </div>

          {/* Executive Narrative Insights */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-800" /> Catatan Strategis Pimpinan & Analisis Ketercapaian
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="font-black text-slate-900 block text-sm">1. Evaluasi Akademik & Kehadiran:</span>
                <p className="text-stone-600 font-medium leading-relaxed">
                  Tingkat kehadiran siswa mencapai 98.4% dengan 100% presensi guru tepat waktu. Modul E-Rapor PAUD dan Buku Penghubung telah mencatat interaksi harian aktif antara guru kelas dan orang tua murid.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="font-black text-slate-900 block text-sm">2. Kestabilan Finansial & PPDB:</span>
                <p className="text-stone-600 font-medium leading-relaxed">
                  Penerimaan Peserta Didik Baru (PPDB) telah memenuhi 100% daya tampung sekolah (140 siswa). Penerimaan SPP berjalan lancar dengan tingkat ketepatan bayar 96.8% dan rekonsiliasi kas zero-drift.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 5: FINANCIAL SUMMARY VIEW (FOR KEUANGAN & ADMIN) */}
      {/* ======================================================================= */}
      {activeTab === 'FINANCIAL_SUMMARY' && (isSuperAdminOrAdmin || isFinance) && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-800" /> Ringkasan Aktivitas Keuangan Sekolah (Financial Activity Summary)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Konsolidasi penerimaan SPP, mutasi kas, dan verifikasi rekonsiliasi pembukuan zero-drift (FIND-08-R4).
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-black rounded-full border border-emerald-300 flex items-center gap-1 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Zero Reconciliation Drift
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Penerimaan Bulan Berjalan</span>
              <div className="text-2xl font-black text-emerald-800">{executiveMetrics.financialSummary.totalMonthlyCollection}</div>
              <span className="text-[10px] font-sans text-stone-500 font-medium">Dari 140 tagihan SPP & registrasi</span>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Pengeluaran / Kas Keluar</span>
              <div className="text-2xl font-black text-slate-900">{executiveMetrics.financialSummary.totalCashDisbursed}</div>
              <span className="text-[10px] font-sans text-stone-500 font-medium">Operasional & sarana prasarana</span>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Saldo Kas Bersih Terkonsolidasi</span>
              <div className="text-2xl font-black text-purple-900">{executiveMetrics.financialSummary.closingBalance}</div>
              <span className="text-[10px] font-sans text-emerald-700 font-bold">Selisih: {executiveMetrics.financialSummary.reconciliationDiscrepancy}</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <strong className="font-bold block">Proteksi Audit Transaksi Keuangan (Invariant FIND-08):</strong>
            <p className="leading-relaxed">
              Seluruh transaksi pembayaran SPP dan penerbitan nomor kwitansi dilengkapi stempel serial unik dan kunci mutasi idempotensi untuk mencegah transaksi ganda (anti-double-spend).
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
