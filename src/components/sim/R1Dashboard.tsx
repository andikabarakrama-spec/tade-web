import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { Student, Teacher, PresensiRecord, SPPBill, PPDBRecord, AuditLog, UserRole, PPDBLifecycleConfig } from '../../types';
import { AsyDashboardCompanion } from './AsyDashboardCompanion';
import { SmartQuickActions } from './SmartQuickActions';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import { PPDBLifecycleModal } from './PPDBLifecycleModal';
import {
  Users,
  CalendarCheck,
  DollarSign,
  UserPlus,
  ArrowRight,
  Sparkles,
  Award,
  Bell,
  Activity,
  Database,
  Globe,
  HardDrive,
  Sun,
  Moon,
  Sunset,
  CheckCircle2,
  AlertCircle,
  FileText,
  PieChart,
  LineChart as LineChartIcon,
  Shield,
  Clock,
  Briefcase,
  BookOpen,
  Filter,
  Heart,
  CheckSquare,
  Wifi,
  Calendar,
  Layers,
  GraduationCap,
  Star,
  Smile,
  Gift,
  Bus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowUp,
  X
} from 'lucide-react';
import {
  DoodleSun,
  DoodleCloud,
  DoodleRainbow,
  DoodlePencil,
  DoodlePaperAirplane,
  DoodleHandprint,
  InteractiveKindergartenPlayground
} from '../garden/ChildDoodleDecorations';
import { LivingGardenElements } from '../garden/LivingGardenElements';
import { useLivingGarden } from '../../context/LivingGardenContext';

interface Props {
  onSelectModule: (mod: string) => void;
}

export const R1Dashboard: React.FC<Props> = ({ onSelectModule }) => {
  const { currentUser, activeRole, userProfile } = useAuth();
  const { getHijriDate } = useLivingGarden();

  const CANONICAL_ROLES: UserRole[] = [
    'SUPER_ADMIN',
    'ADMIN',
    'KETUA_YAYASAN',
    'KEPALA_SEKOLAH',
    'GURU',
    'KEUANGAN',
    'WALI_MURID',
    'CALON_WALI_MURID',
    'ALUMNI_FAMILY'
  ];

  const rawRole = (activeRole || userProfile?.role || null) as UserRole | null;
  const canonicalRole: UserRole | null =
    rawRole && CANONICAL_ROLES.includes(rawRole) ? rawRole : null;

  // Authorization Guards for Sensitive Datasets & Operations
  const canViewSPP = Boolean(
    canonicalRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN', 'KEUANGAN'].includes(canonicalRole)
  );

  const canViewPPDB = Boolean(
    canonicalRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN'].includes(canonicalRole)
  );

  const canViewAudit = Boolean(
    canonicalRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(canonicalRole)
  );

  const canManagePPDB = Boolean(
    currentUser?.uid &&
    canonicalRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(canonicalRole)
  );

  // Perspective Security: Only authorized presentation views allowed per role
  const allowedPerspectives = useMemo<UserRole[]>(() => {
    if (!canonicalRole) return ['WALI_MURID'];
    switch (canonicalRole) {
      case 'SUPER_ADMIN':
        return ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN', 'GURU', 'KEUANGAN', 'WALI_MURID'];
      case 'ADMIN':
        return ['ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN', 'GURU', 'KEUANGAN', 'WALI_MURID'];
      case 'KEPALA_SEKOLAH':
        return ['KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'];
      case 'KETUA_YAYASAN':
        return ['KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'];
      case 'KEUANGAN':
        return ['KEUANGAN', 'WALI_MURID'];
      case 'GURU':
        return ['GURU', 'WALI_MURID'];
      case 'WALI_MURID':
      case 'CALON_WALI_MURID':
      case 'ALUMNI_FAMILY':
      default:
        return ['WALI_MURID'];
    }
  }, [canonicalRole]);

  // Initial presentation perspective fails closed to verified role or WALI_MURID (safest default)
  const [selectedPerspective, setSelectedPerspective] = useState<UserRole>(() => {
    if (canonicalRole && allowedPerspectives.includes(canonicalRole)) {
      return canonicalRole;
    }
    return allowedPerspectives[0] || 'WALI_MURID';
  });

  const [showPlayground, setShowPlayground] = useState<boolean>(true);
  const [isTogglingPPDB, setIsTogglingPPDB] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto dismiss feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const hijriDateStr = useMemo(() => {
    try {
      return getHijriDate ? getHijriDate() : '';
    } catch {
      return '';
    }
  }, [getHijriDate]);

  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [presensi, setPresensi] = useState<PresensiRecord[]>([]);
  const [spp, setSpp] = useState<SPPBill[]>([]);
  const [ppdb, setPpdb] = useState<PPDBRecord[]>([]);
  const [ppdbConfig, setPpdbConfig] = useState<PPDBLifecycleConfig | null>(null);
  const [isPPDBModalOpen, setIsPPDBModalOpen] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Monitor window viewport scroll for Back To Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  // Synchronize perspective with activeRole if activeRole changes, strictly within allowed boundaries
  useEffect(() => {
    if (canonicalRole && allowedPerspectives.includes(canonicalRole)) {
      setSelectedPerspective(canonicalRole);
    } else if (!allowedPerspectives.includes(selectedPerspective)) {
      setSelectedPerspective(allowedPerspectives[0] || 'WALI_MURID');
    }
  }, [canonicalRole, allowedPerspectives, selectedPerspective]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [stRes, tcRes, prRes, spRes, ppRes, lgRes, ppCfg] = await Promise.all([
          DataService.getStudents(canonicalRole || undefined, currentUser?.uid, userProfile?.email),
          DataService.getTeachers(),
          DataService.getPresensi(),
          canViewSPP ? DataService.getSPP() : Promise.resolve([]),
          canViewPPDB ? DataService.getPPDBRecords() : Promise.resolve([]),
          canViewAudit ? DataService.getAuditLogs() : Promise.resolve([]),
          canViewPPDB ? DataService.getPPDBLifecycleConfig() : Promise.resolve(null)
        ]);
        if (isMounted) {
          setStudents(stRes || []);
          setTeachers(tcRes || []);
          setPresensi(prRes || []);
          setSpp(spRes || []);
          setPpdb(ppRes || []);
          setAuditLogs(lgRes || []);
          setPpdbConfig(ppCfg || null);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [canonicalRole, currentUser?.uid, userProfile?.email, canViewSPP, canViewPPDB, canViewAudit]);

  const handleTogglePPDB = async () => {
    if (isTogglingPPDB) return;
    if (!ppdbConfig) return;

    if (!canManagePPDB || !canonicalRole) {
      setFeedback({
        type: 'error',
        message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah status siklus PPDB.'
      });
      return;
    }

    const activeUserUid = currentUser?.uid;
    const activeUserName = userProfile?.nama || userProfile?.name || currentUser?.displayName || currentUser?.email;

    if (!activeUserUid || !activeUserName) {
      setFeedback({
        type: 'error',
        message: 'Autentikasi Diperlukan: Identitas pengguna terautentikasi tidak valid.'
      });
      return;
    }

    setIsTogglingPPDB(true);
    try {
      const nextActiveState = !ppdbConfig.isActive;
      const updated = await DataService.updatePPDBLifecycleConfig(
        { isActive: nextActiveState },
        canonicalRole,
        activeUserName,
        activeUserUid
      );
      setPpdbConfig(updated);
      setFeedback({
        type: 'success',
        message: `Status siklus PPDB berhasil diubah menjadi: ${nextActiveState ? 'AKTIF (DIBUKA)' : 'NONAKTIF (DITUTUP)'}.`
      });
    } catch (err: any) {
      console.error('Failed to toggle PPDB lifecycle:', err);
      setFeedback({
        type: 'error',
        message: `Gagal memperbarui status PPDB: ${err?.message || 'Terjadi kesalahan sistem'}.`
      });
    } finally {
      setIsTogglingPPDB(false);
    }
  };

  const ppdbStatus = useMemo(() => {
    return DataService.checkPPDBStatus(ppdbConfig || undefined);
  }, [ppdbConfig]);

  // Kindergarten Time-based Greeting
  const welcomeData = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) {
      return {
        greeting: "Selamat Pagi",
        tagline: "Semoga ananda ceria menyambut sentra belajar hari ini",
        icon: Sun,
        color: "text-amber-500",
        bg: "bg-amber-100",
        border: "border-amber-200"
      };
    } else if (hour >= 11 && hour < 15) {
      return {
        greeting: "Selamat Siang",
        tagline: "Waktu makan siang sehat dan istirahat sentra ananda",
        icon: Sun,
        color: "text-amber-600",
        bg: "bg-amber-100",
        border: "border-amber-200"
      };
    } else if (hour >= 15 && hour < 18) {
      return {
        greeting: "Selamat Sore",
        tagline: "Penjemputan ananda dan evaluasi harian guru",
        icon: Sunset,
        color: "text-orange-500",
        bg: "bg-orange-100",
        border: "border-orange-200"
      };
    } else {
      return {
        greeting: "Selamat Malam",
        tagline: "Istirahat berkah untuk persiapan pembelajaran esok hari",
        icon: Moon,
        color: "text-indigo-500",
        bg: "bg-indigo-100",
        border: "border-indigo-200"
      };
    }
  }, []);

  // Real Attendance Calculations
  const hadirCount = useMemo(() => presensi.filter(p => p.status === 'Hadir').length, [presensi]);
  const izinCount = useMemo(() => presensi.filter(p => p.status === 'Izin').length, [presensi]);
  const sakitCount = useMemo(() => presensi.filter(p => p.status === 'Sakit').length, [presensi]);
  const alpaCount = useMemo(() => presensi.filter(p => p.status === 'Alpha').length, [presensi]);

  const totalPresensi = presensi.length;
  const hadirPercent = totalPresensi > 0 ? Math.round((hadirCount / totalPresensi) * 100) : 0;

  // Real SPP Calculations
  const sppLunasCount = useMemo(() => spp.filter(s => s.status === 'Lunas').length, [spp]);
  const sppTotalCount = spp.length;
  const sppPercent = sppTotalCount > 0 ? Math.round((sppLunasCount / sppTotalCount) * 100) : 0;

  const totalSppAmountPaid = useMemo(() => {
    return spp.filter(s => s.status === 'Lunas').reduce((acc, curr) => acc + (curr.sppAmount || 0), 0);
  }, [spp]);

  const totalSppAmountUnpaid = useMemo(() => {
    return spp.filter(s => s.status !== 'Lunas').reduce((acc, curr) => acc + (curr.sppAmount || 0), 0);
  }, [spp]);

  // Real PPDB Calculations
  const pendingPPDB = useMemo(() => {
    return ppdb.filter(p => p.status === 'Menunggu' || p.status === 'Verifikasi' || !p.status).length;
  }, [ppdb]);

  const approvedPPDB = useMemo(() => {
    return ppdb.filter(p => p.status === 'Diterima').length;
  }, [ppdb]);

  const activeTeachersCount = teachers.length;

  // Perspective Flags
  const isParent = selectedPerspective === 'WALI_MURID' || selectedPerspective === 'CALON_WALI_MURID' || selectedPerspective === 'ALUMNI_FAMILY';
  const isTeacher = selectedPerspective === 'GURU';
  const isHeadmaster = selectedPerspective === 'KEPALA_SEKOLAH';
  const isFoundation = selectedPerspective === 'KETUA_YAYASAN';
  const isExecutive = isHeadmaster || isFoundation;
  const isSuperAdmin = selectedPerspective === 'SUPER_ADMIN';
  const isAdmin = selectedPerspective === 'ADMIN';
  const isFinance = selectedPerspective === 'KEUANGAN' || (selectedPerspective as any) === 'BENDAHARA';

  // Role-Specific Welcome Text & Tagline
  const roleGreeting = useMemo(() => {
    if (isParent) {
      return {
        greeting: `Assalamu'alaikum Bunda & Ayah Ananda`,
        badge: "Ruang Keluarga & Sentra Belajar",
        tagline: "Mari pantau kehangatan belajar, presensi harian, dan capaian karakter ananda tercinta di TK ASY SYIFA."
      };
    }
    if (isTeacher) {
      return {
        greeting: `Ahlan wa Sahlan Ustadzah ${userProfile?.nama || ''}`,
        badge: "Sentra Pembelajaran & Karakter",
        tagline: "Dampingi siswa cilik dengan penuh kasih sayang, pantau presensi kelas, e-rapor PAUD, dan capaian hafalan Al-Qur'an."
      };
    }
    if (isHeadmaster) {
      return {
        greeting: `Assalamu'alaikum Kepala Sekolah`,
        badge: "Pengawasan Mutu PAUD & Kepemimpinan",
        tagline: "Pantau rasio pendidik, kedisiplinan kehadiran siswa, dan keunggulan kurikulum terpadu TK ASY SYIFA."
      };
    }
    if (isFoundation) {
      return {
        greeting: `Assalamu'alaikum Ketua Yayasan`,
        badge: "Ikhtisar Eksekutif & Amanah Sekolah",
        tagline: "Pantau keberlanjutan operasional, amanah PPDB, dan kemandirian ekosistem pendidikan Islam terpadu."
      };
    }
    if (isSuperAdmin) {
      return {
        greeting: `Assalamu'alaikum Super Administrator`,
        badge: "Tata Kelola & Keamanan Sistem",
        tagline: "Pusat tata kelola platform sekolah, verifikasi hak akses (RBAC), catatan audit, dan sinkronisasi database riil."
      };
    }
    return {
      greeting: `Assalamu'alaikum ${userProfile?.nama || 'Administrator'}`,
      badge: "Tata Usaha & Layanan Sekolah",
      tagline: "Kelola pendaftaran PPDB, data pokok siswa, presensi harian, dan administrasi sekolah secara terpadu."
    };
  }, [isParent, isTeacher, isHeadmaster, isFoundation, isSuperAdmin, userProfile?.nama]);

  // Real System Health Assessment (Honest states without fabricated 100/99)
  const systemHealthAssessment = useMemo(() => {
    const checks = [
      {
        name: 'Database Firestore',
        status: isOnline ? 'Tersinkron' : 'Mode Offline',
        healthy: isOnline,
        detail: 'Penyimpanan terpusat'
      },
      {
        name: 'Keamanan Akses (RBAC)',
        status: activeRole ? 'Terproteksi' : 'Sesi Tamu',
        healthy: Boolean(activeRole),
        detail: `Role: ${activeRole || 'Tamu'}`
      },
      {
        name: 'Data Induk Siswa',
        status: students.length > 0 ? `${students.length} Terdata` : 'Menunggu Input',
        healthy: true,
        detail: 'Rombel A, B & TPA'
      },
      {
        name: 'Rekam Jejak Audit',
        status: `${auditLogs.length} Catatan`,
        healthy: true,
        detail: 'Log perubahan terverifikasi'
      },
      {
        name: 'Konektivitas Jaringan',
        status: isOnline ? 'Online Realtime' : 'Terputus',
        healthy: isOnline,
        detail: isOnline ? 'Stabil' : 'Cek WiFi'
      }
    ];

    return checks;
  }, [isOnline, activeRole, students.length, auditLogs.length]);

  // Real Data Status Highlights
  const realDataHighlights = useMemo(() => {
    const list: { title: string; desc: string; icon: any; color: string; bg: string }[] = [];

    // Siswa & Rombel
    if (students.length > 0) {
      list.push({
        title: `${students.length} Siswa Terdaftar`,
        desc: `Data induk siswa aktif terbagi dalam kelas Kelompok A, Kelompok B, dan TPA.`,
        icon: Users,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50'
      });
    } else {
      list.push({
        title: 'Belum Ada Siswa Terdaftar',
        desc: 'Silakan tambahkan data murid baru pada modul Data Siswa (R3).',
        icon: Users,
        color: 'text-amber-700',
        bg: 'bg-amber-50'
      });
    }

    // Presensi Hari Ini
    if (totalPresensi > 0) {
      list.push({
        title: `Kehadiran: ${hadirCount} dari ${totalPresensi} Siswa`,
        desc: `${hadirPercent}% siswa hadir. ${sakitCount} sakit, ${izinCount} izin, ${alpaCount} tanpa keterangan.`,
        icon: CalendarCheck,
        color: 'text-sky-700',
        bg: 'bg-sky-50'
      });
    } else {
      list.push({
        title: 'Presensi Hari Ini Belum Diisi',
        desc: 'Guru kelas dapat mencatat absensi pagi melalui modul Presensi Siswa (R6).',
        icon: CalendarCheck,
        color: 'text-amber-700',
        bg: 'bg-amber-50'
      });
    }

    // Keuangan SPP
    if (sppTotalCount > 0) {
      list.push({
        title: `SPP: ${sppPercent}% Terkumpul`,
        desc: `Total Rp ${totalSppAmountPaid.toLocaleString('id-ID')} lunas dari ${sppTotalCount} tagihan bulan ini.`,
        icon: DollarSign,
        color: 'text-amber-800',
        bg: 'bg-amber-50'
      });
    } else {
      list.push({
        title: 'Belum Ada Tagihan SPP',
        desc: 'Penerbitan tagihan bulanan dapat dikelola melalui modul Tagihan SPP (R10).',
        icon: DollarSign,
        color: 'text-stone-700',
        bg: 'bg-stone-50'
      });
    }

    // PPDB
    list.push({
      title: `PPDB: ${ppdb.length} Calon Siswa Baru`,
      desc: `${approvedPPDB} diterima/lulus, ${pendingPPDB} berkas sedang dalam proses verifikasi berkas.`,
      icon: UserPlus,
      color: 'text-purple-700',
      bg: 'bg-purple-50'
    });

    return list;
  }, [
    students.length,
    totalPresensi,
    hadirCount,
    hadirPercent,
    sakitCount,
    izinCount,
    alpaCount,
    sppTotalCount,
    sppPercent,
    totalSppAmountPaid,
    ppdb.length,
    approvedPPDB,
    pendingPPDB
  ]);

  const WelcomeIcon = welcomeData.icon;

  if (loading) {
    return <SIMSkeletonLoader type="dashboard" />;
  }

  return (
    <motion.div
      id="r1-dashboard-root"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 select-text relative"
    >
      {/* Subtle Living Atmosphere Decorator */}
      <div className="relative overflow-hidden pointer-events-none rounded-3xl">
        <LivingGardenElements type="page-decor" />
      </div>

      {/* 1. Header: Warm Kindergarten Welcome */}
      <motion.div
        id="r1-header-welcome"
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b from-sky-100/80 via-amber-50/40 to-white/95 backdrop-blur-xs rounded-3xl p-6 sm:p-7 border-2 border-emerald-200/90 shadow-2xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        {/* Living Sky Atmospheric Decorators */}
        <div className="absolute top-2 right-10 opacity-80 pointer-events-none hidden sm:block">
          <DoodleSun className="w-18 h-18 text-amber-400" />
        </div>
        <div className="absolute -bottom-3 right-1/4 opacity-40 pointer-events-none hidden md:block">
          <DoodleCloud className="w-24 h-12 text-sky-200" />
        </div>
        <div className="absolute top-2 left-1/3 opacity-30 pointer-events-none hidden lg:block">
          <DoodleRainbow className="w-24 h-12" />
        </div>
        <div className="absolute bottom-2 left-1/4 opacity-35 pointer-events-none hidden xl:block">
          <DoodlePaperAirplane className="w-10 h-10 text-emerald-500" />
        </div>
        {/* Soft living grass ribbon at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 opacity-70 pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          <div className={`p-4 rounded-2xl ${welcomeData.bg} ${welcomeData.color} border ${welcomeData.border} shrink-0 shadow-2xs`}>
            <WelcomeIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold tracking-wide border border-emerald-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>TK ASY SYIFA • {roleGreeting.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 tracking-tight">
              {roleGreeting.greeting}
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl font-medium leading-relaxed">
              {roleGreeting.tagline}
            </p>
          </div>
        </div>

        {/* Perspective Switcher & Honest Status Badge */}
        <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0 relative z-10">
          <div id="r1-perspective-container" className="flex items-center gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-200 text-xs shadow-2xs">
            <label htmlFor="r1-perspective-select" className="text-[11px] font-bold text-stone-600 pl-1.5 flex items-center gap-1.5 cursor-pointer">
              <Filter className="w-3.5 h-3.5 text-emerald-700" /> Perspektif Peran:
            </label>
            <select
              id="r1-perspective-select"
              value={selectedPerspective}
              onChange={(e) => {
                const nextRole = e.target.value as UserRole;
                if (allowedPerspectives.includes(nextRole)) {
                  setSelectedPerspective(nextRole);
                }
              }}
              aria-label="Pilih Perspektif Peran SIM"
              className="bg-white border border-emerald-300 font-extrabold text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer min-h-[44px]"
            >
              {allowedPerspectives.includes('SUPER_ADMIN') && <option value="SUPER_ADMIN">Super Admin Sistem</option>}
              {allowedPerspectives.includes('ADMIN') && <option value="ADMIN">Tata Usaha / Admin</option>}
              {allowedPerspectives.includes('KEPALA_SEKOLAH') && <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>}
              {allowedPerspectives.includes('KETUA_YAYASAN') && <option value="KETUA_YAYASAN">Ketua Yayasan</option>}
              {allowedPerspectives.includes('GURU') && <option value="GURU">Guru Sentra / Kelas</option>}
              {allowedPerspectives.includes('KEUANGAN') && <option value="KEUANGAN">Staf Keuangan</option>}
              {allowedPerspectives.includes('WALI_MURID') && <option value="WALI_MURID">Wali Murid</option>}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hijriDateStr && (
              <span id="r1-badge-hijri" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 bg-emerald-100/90 px-3 py-1.5 rounded-full border border-emerald-300 shadow-2xs">
                🌿 {hijriDateStr}
              </span>
            )}
            <span id="r1-badge-sync" className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-full border shadow-2xs ${
              isOnline ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              {isOnline ? 'TERHUBUNG (ONLINE)' : 'TIDAK TERHUBUNG (OFFLINE)'}
            </span>
            <span id="r1-badge-semester" className="text-[11px] font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
              Semester Genap 2025/2026
            </span>
          </div>
        </div>
      </motion.div>

      {/* Honest Offline Notice Banner */}
      {!isOnline && (
        <div id="r1-banner-offline" className="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl text-amber-900 text-xs flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-extrabold text-amber-950">Mode Offline Aktif (Penyimpanan Lokal Peramban)</strong>
            <p className="text-amber-800">
              Perangkat sedang tidak terhubung ke jaringan internet. Perubahan data disimpan secara aman di perangkat lokal Anda dan akan disinkronkan ke server Firestore begitu koneksi kembali pulih.
            </p>
          </div>
        </div>
      )}

      {/* In-App Operational Feedback Banner */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`p-4 rounded-3xl border text-xs flex items-center justify-between gap-3 shadow-2xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1.5 rounded-xl hover:bg-black/5 text-stone-500 cursor-pointer"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* 2. School Condition Summary & Orientation Strip */}
      <div id="r1-school-summary-strip" className="bg-white/95 rounded-3xl p-5 sm:p-6 border-2 border-emerald-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Ringkasan Kondisi Sekolah Hari Ini
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Ikhtisar cepat operasional siswa, presensi siswa, SPP, dan pendaftaran calon siswa baru
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Data Riil
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
              isOnline ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <Shield className="w-3 h-3" />
              {isOnline ? 'Terhubung Firestore' : 'Mode Offline'}
            </span>
          </div>
        </div>

        {/* 4 Quick-Glance Orientation Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Siswa */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectModule('r3')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r3'); } }}
            className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:bg-emerald-100/50 transition cursor-pointer group"
          >
            <span className="text-[11px] font-bold text-emerald-900 block">Total Siswa Aktif</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {students.length} <span className="text-xs font-semibold text-stone-500">Siswa</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-700 flex items-center gap-1 mt-1 group-hover:underline">
              Kelompok A, B, & TPA <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Kehadiran */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectModule('r6')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r6'); } }}
            className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/80 hover:bg-sky-100/50 transition cursor-pointer group"
          >
            <span className="text-[11px] font-bold text-sky-900 block">Kehadiran Hari Ini</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {totalPresensi > 0 ? `${hadirPercent}%` : '0%'}
              <span className="text-xs font-semibold text-stone-500 ml-1">
                {totalPresensi > 0 ? `(${hadirCount}/${totalPresensi})` : '(Belum diisi)'}
              </span>
            </div>
            <span className="text-[10px] font-medium text-sky-700 flex items-center gap-1 mt-1 group-hover:underline">
              {totalPresensi > 0 ? `${hadirCount} anak hadir hari ini` : 'Buka presensi kelas'} <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Card 3: Tagihan SPP or Pendidik */}
          {canViewSPP ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectModule('r10')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r10'); } }}
              className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-100/50 transition cursor-pointer group"
            >
              <span className="text-[11px] font-bold text-amber-900 block">Pelunasan SPP</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {sppTotalCount > 0 ? `${sppPercent}%` : '0%'}
                <span className="text-xs font-semibold text-stone-500 ml-1">
                  {sppTotalCount > 0 ? `(${sppLunasCount}/${sppTotalCount})` : '(Belum ada tagihan)'}
                </span>
              </div>
              <span className="text-[10px] font-medium text-amber-800 flex items-center gap-1 mt-1 group-hover:underline">
                {sppTotalCount > 0 ? `Rp ${totalSppAmountPaid.toLocaleString('id-ID')} terkumpul` : 'Kelola tagihan'} <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectModule('r4')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r4'); } }}
              className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-100/50 transition cursor-pointer group"
            >
              <span className="text-[11px] font-bold text-amber-900 block">Ustadzah & Pendidik</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {teachers.length} <span className="text-xs font-semibold text-stone-500">Guru</span>
              </div>
              <span className="text-[10px] font-medium text-amber-800 flex items-center gap-1 mt-1 group-hover:underline">
                Pendidik PAUD Asy Syifa <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          )}

          {/* Card 4: PPDB or Sentra Kelompok */}
          {canViewPPDB ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectModule('r13')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r13'); } }}
              className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 hover:bg-purple-100/50 transition cursor-pointer group"
            >
              <span className="text-[11px] font-bold text-purple-900 block">Pendaftaran PPDB</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {ppdb.length} <span className="text-xs font-semibold text-stone-500">Pendaftar</span>
              </div>
              <span className="text-[10px] font-medium text-purple-800 flex items-center gap-1 mt-1 group-hover:underline">
                {approvedPPDB} diterima • {pendingPPDB} proses <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectModule('r5')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r5'); } }}
              className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 hover:bg-purple-100/50 transition cursor-pointer group"
            >
              <span className="text-[11px] font-bold text-purple-900 block">Kelompok Kelas Sentra</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Aktif <span className="text-xs font-semibold text-stone-500">Sentra Belajar</span>
              </div>
              <span className="text-[10px] font-medium text-purple-700 flex items-center gap-1 mt-1 group-hover:underline">
                Kelompok A, B, & Bermain <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          )}
        </div>

        {/* Actionable Attention Notice if Any */}
        {((canViewPPDB && pendingPPDB > 0) || totalPresensi === 0) && (
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-950 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong className="font-extrabold text-amber-950">Perlu Perhatian Hari Ini: </strong>
                {canViewPPDB && pendingPPDB > 0 && `Ada ${pendingPPDB} berkas calon siswa PPDB yang memerlukan verifikasi berkas. `}
                {totalPresensi === 0 && `Presensi kelas siswa untuk hari ini belum dicatat oleh ustadzah.`}
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {canViewPPDB && pendingPPDB > 0 && (
                <button
                  onClick={() => onSelectModule('r13')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shadow-2xs cursor-pointer"
                >
                  Verifikasi PPDB
                </button>
              )}
              {totalPresensi === 0 && (
                <button
                  onClick={() => onSelectModule('r6')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs cursor-pointer"
                >
                  Buka Presensi
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Canonical Mascot Companion (Asy / Syifa) with Real Text Engine */}
      <AsyDashboardCompanion
        stats={{
          studentsCount: students.length,
          teachersCount: teachers.length,
          hadirCount,
          totalPresensi,
          sppPercent: canViewSPP ? sppPercent : 0,
          sppLunasCount: canViewSPP ? sppLunasCount : 0,
          sppTotalCount: canViewSPP ? sppTotalCount : 0,
          ppdbCount: canViewPPDB ? ppdb.length : 0,
          pendingPPDB: canViewPPDB ? pendingPPDB : 0,
          approvedPPDB: canViewPPDB ? approvedPPDB : 0
        }}
        selectedPerspective={selectedPerspective}
        onSelectModule={onSelectModule}
      />

      {/* 4. Role-Aware Quick Actions */}
      <SmartQuickActions role={selectedPerspective} onNavigate={onSelectModule} />

      {/* Living Kindergarten Micro-Playground Widget */}
      <div id="r1-playground-container" className="bg-white/95 rounded-3xl border-2 border-emerald-100 shadow-2xs overflow-hidden transition">
        <div
          id="r1-playground-header"
          role="button"
          tabIndex={0}
          onClick={() => setShowPlayground(prev => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowPlayground(prev => !prev);
            }
          }}
          className="p-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-amber-50/80 border-b border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100/40 transition select-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          aria-label={showPlayground ? 'Tutup Taman Sentra Belajar' : 'Buka Taman Sentra Belajar'}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌸</span>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
                <span>Taman Sentra Belajar & Bermain Dek Asy & Dek Syifa</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300 hidden sm:inline-block">
                  Living Kindergarten
                </span>
              </h2>
              <p className="text-[11px] text-emerald-800 font-medium">
                Sentuh objek taman untuk mendengarkan klakson bus sekolah, memetik apel belajar, dan membaca kisah kebaikan
              </p>
            </div>
          </div>
          <button
            id="r1-btn-toggle-playground"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPlayground(prev => !prev);
            }}
            className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={showPlayground ? 'Sembunyikan Taman' : 'Buka Taman'}
          >
            {showPlayground ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showPlayground && (
          <div id="r1-playground-body" className="p-4 sm:p-5">
            <InteractiveKindergartenPlayground />
          </div>
        )}
      </div>

      {/* 4. Honest KPI Cards with Kindergarten Visual Harmony */}
      {isParent ? (
        /* Parent View Smart Data Cards */
        <div id="r1-kpi-grid-parent" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Kehadiran Ananda */}
          <motion.div
            id="r1-kpi-parent-kehadiran"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r29')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r29'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-2xs space-y-2 hover:border-emerald-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                Kehadiran Ananda
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalPresensi > 0 ? (hadirCount > 0 ? 'Hadir di Sekolah' : 'Izin / Sakit') : 'Belum Absen'}
            </div>
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{totalPresensi > 0 ? `${hadirCount} siswa hadir hari ini` : 'Presensi sentra sedang berlangsung'}</span>
            </div>
          </motion.div>

          {/* KPI 2: Perkembangan & Capaian Belajar */}
          <motion.div
            id="r1-kpi-parent-rapor"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r29')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r29'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-2xs space-y-2 hover:border-sky-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-900 uppercase tracking-wide">
                Perkembangan Anak
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              E-Rapor PAUD
            </div>
            <div className="text-xs font-semibold text-sky-800 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Jurnal observasi & capaian ananda (R29)</span>
            </div>
          </motion.div>

          {/* KPI 3: Administrasi SPP Ananda */}
          <motion.div
            id="r1-kpi-parent-spp"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r11')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r11'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-2xs space-y-2 hover:border-amber-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                Administrasi SPP
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {sppTotalCount > 0 && sppLunasCount === sppTotalCount ? 'Lunas' : 'Tertib SPP'}
            </div>
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Kwitansi & riwayat pembayaran digital (R11)</span>
            </div>
          </motion.div>

          {/* KPI 4: Agenda & Sentra Sekolah */}
          <motion.div
            id="r1-kpi-parent-agenda"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r15')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r15'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-2xs space-y-2 hover:border-purple-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                Agenda & Kegiatan
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              Sentra Ceria
            </div>
            <div className="text-xs font-semibold text-purple-800 flex items-center gap-1.5 pt-1">
              <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Pengumuman resmi TK Asy Syifa (R15)</span>
            </div>
          </motion.div>
        </div>
      ) : isTeacher ? (
        /* Teacher View Smart Data Cards */
        <div id="r1-kpi-grid-teacher" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Presensi Kelas Hari Ini */}
          <motion.div
            id="r1-kpi-teacher-presensi"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r6')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r6'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-2xs space-y-2 hover:border-emerald-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                Presensi Kelas Hari Ini
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalPresensi > 0 ? `${hadirPercent}%` : '0%'}{' '}
              <span className="text-sm font-bold text-stone-500">Hadir</span>
            </div>
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{hadirCount} dari {totalPresensi > 0 ? totalPresensi : students.length} siswa hadir (R6)</span>
            </div>
          </motion.div>

          {/* KPI 2: E-Rapor PAUD & Capaian */}
          <motion.div
            id="r1-kpi-teacher-rapor"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r8')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r8'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-2xs space-y-2 hover:border-sky-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-900 uppercase tracking-wide">
                E-Rapor Kurikulum Merdeka
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {students.length} <span className="text-sm font-bold text-stone-500">Siswa</span>
            </div>
            <div className="text-xs font-semibold text-sky-800 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Input narasi & capaian belajar (R8)</span>
            </div>
          </motion.div>

          {/* KPI 3: Tahfidz & Doa Siswa */}
          <motion.div
            id="r1-kpi-teacher-tahfidz"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r17')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r17'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-teal-100 shadow-2xs space-y-2 hover:border-teal-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-teal-900 uppercase tracking-wide">
                Tahfidz & Doa Harian
              </span>
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              Juz 'Amma
            </div>
            <div className="text-xs font-semibold text-teal-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Surah pendek, doa & hadits adab (R17)</span>
            </div>
          </motion.div>

          {/* KPI 4: Catatan Observasi & Anekdot */}
          <motion.div
            id="r1-kpi-teacher-observasi"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r9')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r9'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-2xs space-y-2 hover:border-amber-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                Catatan Anekdot & Karakter
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              Observasi
            </div>
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 pt-1">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Catat momen unik sentra harian (R9)</span>
            </div>
          </motion.div>
        </div>
      ) : isExecutive ? (
        /* Executive View Smart Data Cards */
        <div id="r1-kpi-grid-executive" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Siswa Terdaftar */}
          <motion.div
            id="r1-kpi-exec-siswa"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r3')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r3'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-2xs space-y-2 hover:border-emerald-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                {isFoundation ? 'Siswa TK ASY SYIFA' : 'Data Induk Siswa'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {students.length} <span className="text-sm font-bold text-stone-500">Siswa</span>
            </div>
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Rombel Kelompok A, B & TPA</span>
            </div>
          </motion.div>

          {/* KPI 2: Kehadiran / Guru */}
          <motion.div
            id="r1-kpi-exec-kehadiran"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule(isHeadmaster ? 'r7' : 'r6')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule(isHeadmaster ? 'r7' : 'r6'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-2xs space-y-2 hover:border-sky-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-900 uppercase tracking-wide">
                {isHeadmaster ? 'Pendidik & Tenaga Kerja' : 'Kedisiplinan Kehadiran'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                {isHeadmaster ? <Briefcase className="w-5 h-5" /> : <CalendarCheck className="w-5 h-5" />}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {isHeadmaster ? `${activeTeachersCount} Guru` : `${hadirPercent}% Hadir`}
            </div>
            <div className="text-xs font-semibold text-sky-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{isHeadmaster ? 'Guru Sentra & Pembina Aktif (R7)' : `${hadirCount} siswa hadir hari ini (R6)`}</span>
            </div>
          </motion.div>

          {/* KPI 3: SPP Collection Rate */}
          <motion.div
            id="r1-kpi-exec-spp"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r12')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r12'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-2xs space-y-2 hover:border-amber-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                Realisasi SPP
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {sppTotalCount > 0 ? `${sppPercent}%` : '0%'}{' '}
              <span className="text-sm font-bold text-stone-500">Lunas</span>
            </div>
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Rp {totalSppAmountPaid.toLocaleString('id-ID')} terkumpul (R12)</span>
            </div>
          </motion.div>

          {/* KPI 4: PPDB Intake */}
          <motion.div
            id="r1-kpi-exec-ppdb"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r13')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r13'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-2xs space-y-2 hover:border-purple-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                Peminatan PPDB
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {ppdb.length}{' '}
              <span className="text-sm font-bold text-stone-500">
                {ppdbConfig?.targetQuota ? `/ ${ppdbConfig.targetQuota}` : 'Calon'}
              </span>
            </div>
            <div className="text-xs font-semibold text-purple-800 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{approvedPPDB} diterima • {pendingPPDB} verifikasi (R13)</span>
            </div>
          </motion.div>
        </div>
      ) : isSuperAdmin ? (
        /* Super Admin Smart Data Cards with Visual Hierarchy */
        <div id="r1-kpi-grid-superadmin" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Keamanan Akses (RBAC) - Highlighted Primary Card */}
          <motion.div
            id="r1-kpi-admin-rbac"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r131')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r131'); } }}
            className="bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 sm:p-6 rounded-3xl border-2 border-emerald-300 shadow-2xs space-y-2 hover:border-emerald-400 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Keamanan Hak Akses (RBAC)
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition shadow-2xs">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              Aman Terproteksi
            </div>
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Role: {canonicalRole || 'GUEST'} • FIDO2 & RBAC Siap</span>
            </div>
          </motion.div>

          {/* KPI 2: Database Firestore */}
          <motion.div
            id="r1-kpi-admin-database"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r111')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r111'); } }}
            className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-sky-100 shadow-2xs space-y-2 hover:border-sky-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-900 uppercase tracking-wide">
                Database Firestore
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold group-hover:scale-105 transition shadow-2xs">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {isOnline ? 'Tersinkron' : 'Mode Offline'}
            </div>
            <div className="text-xs font-semibold text-sky-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Multi-koleksi realtime engine (R111)</span>
            </div>
          </motion.div>

          {/* KPI 3: Audit Trail */}
          <motion.div
            id="r1-kpi-admin-audit"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r24')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r24'); } }}
            className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-amber-100 shadow-2xs space-y-2 hover:border-amber-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                Rekam Jejak Audit
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {auditLogs.length} <span className="text-sm font-bold text-stone-500">Catatan</span>
            </div>
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Log mutasi terverifikasi (R24)</span>
            </div>
          </motion.div>

          {/* KPI 4: Jaringan & Layanan */}
          <motion.div
            id="r1-kpi-admin-network"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r119')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r119'); } }}
            className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-purple-100 shadow-2xs space-y-2 hover:border-purple-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                Konektivitas & Server
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition shadow-2xs">
                <Wifi className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              Port 3000 Normal
            </div>
            <div className="text-xs font-semibold text-purple-800 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Reverse proxy Cloud Run lancar (R119)</span>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Default Admin & Operations Smart Data Cards */
        <div id="r1-kpi-grid-default" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Total Students */}
          <motion.div
            id="r1-kpi-default-siswa"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r3')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r3'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-2xs space-y-2 hover:border-emerald-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                Siswa Terdaftar
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {students.length} <span className="text-sm font-bold text-stone-500">Siswa</span>
            </div>
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 pt-1">
              {students.length > 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Data Induk Terverifikasi</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-amber-700">Belum ada siswa diinput</span>
                </>
              )}
            </div>
          </motion.div>

          {/* KPI 2: Today Presensi */}
          <motion.div
            id="r1-kpi-default-presensi"
            role="button"
            tabIndex={0}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectModule('r6')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r6'); } }}
            className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-2xs space-y-2 hover:border-sky-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-900 uppercase tracking-wide">
                Kehadiran Hari Ini
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalPresensi > 0 ? `${hadirPercent}%` : '0%'}{' '}
              <span className="text-sm font-bold text-stone-500">Hadir</span>
            </div>
            <div className="text-xs font-semibold text-sky-800 flex items-center gap-1.5 pt-1">
              {totalPresensi > 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{hadirCount} dari {totalPresensi} siswa hadir</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-amber-700">Belum ada absensi hari ini</span>
                </>
              )}
            </div>
          </motion.div>

          {/* KPI 3: SPP Collection Rate or Teachers */}
          {canViewSPP ? (
            <motion.div
              id="r1-kpi-default-spp"
              role="button"
              tabIndex={0}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectModule(isFinance ? 'r12' : 'r10')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule(isFinance ? 'r12' : 'r10'); } }}
              className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-2xs space-y-2 hover:border-amber-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                  Pelunasan SPP
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {sppTotalCount > 0 ? `${sppPercent}%` : '0%'}{' '}
                <span className="text-sm font-bold text-stone-500">Lunas</span>
              </div>
              <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 pt-1">
                {sppTotalCount > 0 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{sppLunasCount} dari {sppTotalCount} tagihan lunas</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="text-stone-500">Belum ada tagihan aktif</span>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              id="r1-kpi-default-teachers"
              role="button"
              tabIndex={0}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectModule('r4')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r4'); } }}
              className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-2xs space-y-2 hover:border-amber-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                  Ustadzah & Guru
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {teachers.length}{' '}
                <span className="text-sm font-bold text-stone-500">Pendidik</span>
              </div>
              <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pendidik Sentra PAUD Aktif</span>
              </div>
            </motion.div>
          )}

          {/* KPI 4: PPDB Progress or Sentra */}
          {canViewPPDB ? (
            <motion.div
              id="r1-kpi-default-ppdb"
              role="button"
              tabIndex={0}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectModule('r13')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r13'); } }}
              className={`p-5 rounded-3xl border-2 shadow-2xs space-y-2 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
                ppdbStatus.isOpen
                  ? 'bg-white border-purple-100 hover:border-purple-300'
                  : 'bg-stone-50/90 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                    Pendaftaran PPDB
                  </span>
                  {ppdbConfig && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      ppdbStatus.isOpen
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}>
                      {ppdbStatus.isOpen ? ppdbConfig.currentWave : 'Ditutup'}
                    </span>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold group-hover:scale-105 transition ${
                  ppdbStatus.isOpen ? 'bg-purple-100 text-purple-800' : 'bg-stone-200 text-stone-600'
                }`}>
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {ppdb.length}{' '}
                <span className="text-sm font-bold text-stone-500">
                  {ppdbConfig?.targetQuota ? `/ ${ppdbConfig.targetQuota} Calon Siswa` : 'Calon Siswa'}
                </span>
              </div>
              <div className="text-xs font-semibold text-purple-800 flex items-center gap-1.5 pt-1">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                {ppdbStatus.isOpen ? (
                  <span>{approvedPPDB} diterima • {pendingPPDB} proses</span>
                ) : (
                  <span className="text-stone-500 font-medium">{ppdbStatus.message}</span>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              id="r1-kpi-default-sentra"
              role="button"
              tabIndex={0}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectModule('r5')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule('r5'); } }}
              className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-2xs space-y-2 hover:border-purple-300 transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                  Sentra Belajar
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                Sentra Bermain
              </div>
              <div className="text-xs font-semibold text-purple-800 flex items-center gap-1.5 pt-1">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Kelompok A, B, & Bermain Terpadu</span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Admin PPDB Lifecycle Controller Card */}
      {canManagePPDB && ppdbConfig && (
        <div id="r1-ppdb-lifecycle-card" className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    Manajemen Siklus & Kontrol PPDB
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    ppdbStatus.isOpen
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {ppdbStatus.isOpen ? 'PPDB AKTIF (DIBUKA)' : 'PPDB NONAKTIF (DITUTUP)'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Kontrol operasional mandiri oleh Admin: atur periode pendaftaran, kuota calon siswa, dan visibilitas di SIM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="r1-btn-ppdb-toggle"
                type="button"
                disabled={isTogglingPPDB || !canManagePPDB}
                onClick={handleTogglePPDB}
                className={`px-3.5 py-2 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs min-h-[44px] focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  ppdbConfig.isActive
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isTogglingPPDB ? 'Memproses...' : ppdbConfig.isActive ? 'Tutup Pendaftaran' : 'Buka Pendaftaran PPDB'}
              </button>
              <button
                id="r1-btn-ppdb-configure"
                type="button"
                onClick={() => setIsPPDBModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs min-h-[44px] focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Atur Siklus & Kuota</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-500">Tahun Ajaran & Gelombang</span>
              <div className="font-extrabold text-slate-900 text-xs">
                TA {ppdbConfig.academicYear} • {ppdbConfig.currentWave}
              </div>
              <p className="text-[10px] text-stone-500">
                Target Kuota: {ppdbConfig.targetQuota ? `${ppdbConfig.targetQuota} Calon Siswa` : 'Belum ditentukan'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-500">Jadwal Periode Pendaftaran</span>
              <div className="font-extrabold text-slate-900 text-xs">
                {ppdbConfig.startDate ? new Date(ppdbConfig.startDate).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'} s/d{' '}
                {ppdbConfig.endDate ? new Date(ppdbConfig.endDate).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
              </div>
              <p className="text-[10px] text-purple-700 font-semibold">
                Status: {ppdbStatus.isOpen ? 'Sedang Berjalan' : 'Pendaftaran Tutup'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-500">Progres Berkas Calon Siswa</span>
              <div className="font-extrabold text-slate-900 text-xs">
                {ppdb.length} Terdaftar ({approvedPPDB} Diterima)
              </div>
              <p className="text-[10px] text-stone-500">
                {pendingPPDB} berkas menunggu verifikasi
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
              <span className="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                Integritas Single Registration
              </span>
              <div className="font-extrabold text-purple-950 text-xs">
                1 Calon Siswa = 1 Berkas
              </div>
              <p className="text-[10px] text-purple-800">
                Pencegahan duplikasi data aktif di tingkat DataService
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Non-intrusive banner for Guru & Wali Murid if PPDB active and showBanner enabled */}
      {!canManagePPDB && ppdbStatus.isOpen && ppdbConfig?.showBannerInSIM && (
        <div id="r1-banner-ppdb-public" className="p-4 rounded-3xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-4 h-4 text-purple-700 shrink-0" />
            <span>
              <strong>Penerimaan Siswa Baru:</strong> PPDB Online TA {ppdbConfig.academicYear} ({ppdbConfig.currentWave}) sedang dibuka untuk calon siswa baru.
            </span>
          </div>
          <button
            id="r1-btn-ppdb-public-info"
            type="button"
            onClick={() => onSelectModule('r13')}
            className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] shrink-0 cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            Lihat Info PPDB
          </button>
        </div>
      )}

      {/* 5. Catatan Ringkas Operasional Sekolah (Friendly Kindergarten Card) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Catatan Terpadu Operasional TK ASY SYIFA
              </h2>
              <p className="text-[11px] text-stone-500">
                Informasi penting disajikan secara transparan sesuai data riil sekolah
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Real Data
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
              <Shield className="w-3 h-3 text-sky-600" />
              RBAC Aktif
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {realDataHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border border-stone-200/90 ${item.bg} space-y-1.5 transition`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <h3 className="font-extrabold text-xs text-slate-900 truncate">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Honest Data Visualizers (Presensi Realtime & SPP Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Presensi Composition */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-extrabold text-slate-900">
                Komposisi Kehadiran Siswa Hari Ini
              </h2>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Total {totalPresensi} Murid
            </span>
          </div>

          {totalPresensi > 0 ? (
            <div className="space-y-4 pt-2">
              {/* Stacked Visual Bar */}
              <div className="h-6 w-full rounded-xl bg-stone-100 overflow-hidden flex shadow-inner">
                {hadirCount > 0 && (
                  <div
                    style={{ width: `${(hadirCount / totalPresensi) * 100}%` }}
                    className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    title={`Hadir: ${hadirCount}`}
                  >
                    {hadirPercent > 10 ? `${hadirPercent}%` : ''}
                  </div>
                )}
                {izinCount > 0 && (
                  <div
                    style={{ width: `${(izinCount / totalPresensi) * 100}%` }}
                    className="bg-amber-400 h-full flex items-center justify-center text-[10px] font-bold text-amber-950 transition-all"
                    title={`Izin: ${izinCount}`}
                  />
                )}
                {sakitCount > 0 && (
                  <div
                    style={{ width: `${(sakitCount / totalPresensi) * 100}%` }}
                    className="bg-sky-400 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    title={`Sakit: ${sakitCount}`}
                  />
                )}
                {alpaCount > 0 && (
                  <div
                    style={{ width: `${(alpaCount / totalPresensi) * 100}%` }}
                    className="bg-rose-400 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    title={`Alpa: ${alpaCount}`}
                  />
                )}
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <div className="text-[11px] font-bold text-emerald-800">Hadir</div>
                  <div className="text-lg font-black text-emerald-950 mt-0.5">{hadirCount}</div>
                  <div className="text-[10px] text-emerald-700">{hadirPercent}%</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <div className="text-[11px] font-bold text-amber-800">Izin</div>
                  <div className="text-lg font-black text-amber-950 mt-0.5">{izinCount}</div>
                  <div className="text-[10px] text-amber-700">
                    {Math.round((izinCount / totalPresensi) * 100)}%
                  </div>
                </div>
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-center">
                  <div className="text-[11px] font-bold text-sky-800">Sakit</div>
                  <div className="text-lg font-black text-sky-950 mt-0.5">{sakitCount}</div>
                  <div className="text-[10px] text-sky-700">
                    {Math.round((sakitCount / totalPresensi) * 100)}%
                  </div>
                </div>
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                  <div className="text-[11px] font-bold text-rose-800">Alpa</div>
                  <div className="text-lg font-black text-rose-950 mt-0.5">{alpaCount}</div>
                  <div className="text-[10px] text-rose-700">
                    {Math.round((alpaCount / totalPresensi) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-stone-500 bg-stone-50/80 rounded-2xl border border-dashed border-stone-300 space-y-2">
              <CalendarCheck className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-bold text-slate-800 text-xs">Belum Ada Presensi Diinput Hari Ini</p>
              <p className="text-[11px] max-w-sm mx-auto">
                Bunda/Ustadzah dapat melakukan presensi kelas secara cepat melalui menu Presensi Siswa.
              </p>
              <button
                id="r1-btn-open-presensi-empty"
                type="button"
                onClick={() => onSelectModule('r6')}
                className="mt-2 px-4 py-2 min-h-[44px] rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Buka Presensi Siswa (R6)
              </button>
            </div>
          )}
        </div>

        {/* SPP Distribution */}
        <div id="r1-section-spp-distribution" className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm font-extrabold text-slate-900">
                Status Pembayaran SPP Bulan Ini
              </h2>
            </div>
            <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {sppPercent}% Lunas
            </span>
          </div>

          {sppTotalCount > 0 ? (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-amber-900">Dana Masuk Terverifikasi</span>
                  <span className="text-emerald-700 font-extrabold">
                    Rp {totalSppAmountPaid.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="h-3 w-full bg-amber-200/80 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${sppPercent}%` }}
                    className="h-full bg-emerald-600 rounded-full transition-all"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-600">
                  <span>{sppLunasCount} Tagihan Lunas</span>
                  <span>{sppTotalCount - sppLunasCount} Menunggu Pembayaran</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="text-[11px] font-bold text-emerald-800">Lunas</div>
                  <div className="text-lg font-black text-emerald-950 mt-0.5">{sppLunasCount}</div>
                </div>
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                  <div className="text-[11px] font-bold text-rose-800">Belum Bayar</div>
                  <div className="text-lg font-black text-rose-950 mt-0.5">
                    {sppTotalCount - sppLunasCount}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-stone-500 bg-stone-50/80 rounded-2xl border border-dashed border-stone-300 space-y-2">
              <DollarSign className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-bold text-slate-800 text-xs">Belum Ada Tagihan SPP Periode Ini</p>
              <p className="text-[11px]">
                Kelola jadwal dan penerbitan tagihan uang sekolah bulanan melalui Modul SPP.
              </p>
              <button
                id="r1-btn-open-spp-empty"
                type="button"
                onClick={() => onSelectModule('r10')}
                className="mt-2 px-4 py-2 min-h-[44px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Buka Tagihan SPP (R10)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 7. Honest System Status & Governance (Visible to Admin, Super Admin, Executive, Keuangan) */}
      {(isSuperAdmin || isAdmin || isExecutive || isFinance) && (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-extrabold text-slate-900">
                Status Operasional & Keandalan Sistem Sekolah
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-500">
              Pemeriksaan Otomatis Terhubung
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {systemHealthAssessment.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-1 text-center"
              >
                <div className="text-[10px] font-bold text-stone-600 truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="font-extrabold text-slate-900 text-xs truncate">
                  {item.status}
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/80 rounded-md py-0.5 px-1 inline-block">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Quick Module Navigation Grid (Role-Aware & Senior Teacher Friendly - min 52px targets) */}
      <div id="r1-section-quick-navigation" className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-extrabold text-slate-900">
              {isParent ? 'Akses Cepat Layanan Wali Murid' : isTeacher ? 'Akses Cepat Guru Sentra' : 'Akses Cepat Modul Utama TK'}
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            {isParent ? 'Sentuhan mudah untuk Ayah/Bunda' : isTeacher ? 'Mudah & cepat digunakan Ustadzah' : 'Pintasan navigasi operasional'}
          </span>
        </div>

        {isParent ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              id="r1-quicknav-parent-pantau"
              type="button"
              onClick={() => onSelectModule('r29')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-left transition border border-emerald-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            >
              <Users className="w-5 h-5 text-emerald-700" />
              <div className="font-bold text-xs">Pantau Ananda</div>
              <p className="text-[10px] text-emerald-800">Portofolio & Presensi</p>
            </button>

            <button
              id="r1-quicknav-parent-spp"
              type="button"
              onClick={() => onSelectModule('r11')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-left transition border border-amber-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
            >
              <DollarSign className="w-5 h-5 text-amber-700" />
              <div className="font-bold text-xs">Riwayat SPP</div>
              <p className="text-[10px] text-amber-800">Bukti & Kwitansi Digital</p>
            </button>

            <button
              id="r1-quicknav-parent-pengumuman"
              type="button"
              onClick={() => onSelectModule('r15')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 text-left transition border border-purple-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 cursor-pointer"
            >
              <Bell className="w-5 h-5 text-purple-700" />
              <div className="font-bold text-xs">Pengumuman TK</div>
              <p className="text-[10px] text-purple-800">Surat & Wara-Wara</p>
            </button>

            <button
              id="r1-quicknav-parent-tahfidz"
              type="button"
              onClick={() => onSelectModule('r17')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-950 text-left transition border border-teal-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-teal-700" />
              <div className="font-bold text-xs">Murojaah Tahfidz</div>
              <p className="text-[10px] text-teal-800">Doa & Hadits Ananda</p>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              id="r1-quicknav-presensi"
              type="button"
              onClick={() => onSelectModule('r6')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-left transition border border-emerald-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            >
              <CalendarCheck className="w-5 h-5 text-emerald-700" />
              <div className="font-bold text-xs">Presensi Siswa</div>
              <p className="text-[10px] text-emerald-800">Absensi Harian</p>
            </button>

            <button
              id="r1-quicknav-erapor"
              type="button"
              onClick={() => onSelectModule('r8')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-950 text-left transition border border-sky-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer"
            >
              <Award className="w-5 h-5 text-sky-700" />
              <div className="font-bold text-xs">E-Rapor PAUD</div>
              <p className="text-[10px] text-sky-800">Capaian Anak</p>
            </button>

            <button
              id="r1-quicknav-keuangan"
              type="button"
              onClick={() => onSelectModule(isFinance ? 'r12' : 'r10')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-left transition border border-amber-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
            >
              <DollarSign className="w-5 h-5 text-amber-700" />
              <div className="font-bold text-xs">{isFinance ? 'Keuangan Kas' : 'Tagihan SPP'}</div>
              <p className="text-[10px] text-amber-800">{isFinance ? 'Buku Kas (R12)' : 'Iuran Siswa'}</p>
            </button>

            <button
              id="r1-quicknav-ppdb"
              type="button"
              onClick={() => onSelectModule('r13')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 text-left transition border border-purple-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 cursor-pointer"
            >
              <UserPlus className="w-5 h-5 text-purple-700" />
              <div className="font-bold text-xs">PPDB Online</div>
              <p className="text-[10px] text-purple-800">Calon Murid</p>
            </button>

            <button
              id="r1-quicknav-smartdoc"
              type="button"
              onClick={() => onSelectModule('r16')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 text-left transition border border-indigo-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-indigo-700" />
              <div className="font-bold text-xs">Smart Document</div>
              <p className="text-[10px] text-indigo-800">Surat & Cetak</p>
            </button>

            <button
              id="r1-quicknav-tahfidz"
              type="button"
              onClick={() => onSelectModule('r17')}
              className="min-h-[52px] p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-950 text-left transition border border-teal-200 space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-teal-700" />
              <div className="font-bold text-xs">Tahfidz & Doa</div>
              <p className="text-[10px] text-teal-800">Hafalan Siswa</p>
            </button>
          </div>
        )}
      </div>

      {/* 9. Live Audit Trail & Agenda Sekolah (or Parent/Teacher Nurturing Section) */}
      <div id="r1-section-audit-agenda" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {isParent || isTeacher ? (
          /* Nurturing Islamic Kindergarten Note */
          <div id="r1-section-adab-note" className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Nasihat Kasih Sayang & Adab Dek Asy & Dek Syifa</span>
              </h2>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Karakter Islami
              </span>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <p className="text-xs font-bold text-emerald-950">
                  "Menuntut ilmu itu wajib atas setiap muslim." (HR. Ibnu Majah)
                </p>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Di TK ASY SYIFA, kami mendampingi ananda tidak hanya agar cerdas kognitif, namun berhati lembut, gemar berbagi senyuman, dan mencintai Al-Qur'an sejak dini.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-semibold text-emerald-900">
                <span className="px-2 py-0.5 bg-white rounded-md border border-emerald-200">✨ Senyum itu Shadaqah</span>
                <span className="px-2 py-0.5 bg-white rounded-md border border-emerald-200">📖 Hafidz Cilik</span>
                <span className="px-2 py-0.5 bg-white rounded-md border border-emerald-200">🤝 Sayang Teman</span>
              </div>
            </div>
          </div>
        ) : (
          /* Live Audit Trail for Admins */
          <div id="r1-section-audit-log" className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Aktivitas & Log Terbaru</span>
              </h2>
              <button
                id="r1-btn-auditlog-view"
                type="button"
                onClick={() => onSelectModule('r24')}
                className="text-emerald-800 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-2 py-1 min-h-[44px]"
              >
                <span>Buka Audit Log (R24)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.length > 0 ? (
                auditLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-2"
                  >
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 truncate">{log.action}</p>
                      <p className="text-[10px] text-stone-500">
                        Oleh: {log.userName} ({log.role}) •{' '}
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('id-ID') : 'Baru saja'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg font-bold text-[10px] bg-emerald-100 text-emerald-900 shrink-0">
                      {log.targetModule}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  <FileText className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
                  <p className="font-bold text-slate-800 text-xs">Belum Ada Catatan Log Baru</p>
                  <p className="text-[11px]">Setiap aktivitas pengubahan data akan dicatat secara otomatis.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Agenda Dekat TK</span>
            </h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              Sentra PAUD
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                Kegiatan Rutin
              </span>
              <h3 className="font-bold text-slate-900 text-xs">Pemeriksaan Kesehatan & Tumbuh Kembang</h3>
              <p className="text-[11px] text-stone-600">Jumat Pagi • Aula Sentra TK ASY SYIFA</p>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                Karya Kreatif
              </span>
              <h3 className="font-bold text-slate-900 text-xs">Market Day & Kreasi STEAM Anak</h3>
              <p className="text-[11px] text-stone-600">Kamis Pekan Depan • Halaman Bermain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin PPDB Lifecycle Modal */}
      {canManagePPDB && (
        <PPDBLifecycleModal
          isOpen={isPPDBModalOpen}
          onClose={() => setIsPPDBModalOpen(false)}
          onSaved={(updated) => setPpdbConfig(updated)}
        />
      )}

      {/* 5. Accessible Back to Top (Kembali ke Atas) Button */}
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-40 print:hidden">
          <button
            id="r1-btn-back-to-top"
            type="button"
            onClick={handleScrollToTop}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-900/90 text-white shadow-lg hover:bg-emerald-800 hover:shadow-xl active:scale-95 border-2 border-amber-300 backdrop-blur-xs transition cursor-pointer min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
            aria-label="Kembali ke bagian atas dasbor"
            title="Kembali ke Atas"
          >
            <ArrowUp className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="text-xs font-black tracking-wide hidden sm:inline-block">Kembali ke Atas</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};
