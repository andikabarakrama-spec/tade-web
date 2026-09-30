import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PieChart,
  Users,
  Award,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  RefreshCw,
  Search,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  DollarSign,
  UserCheck,
  BookOpen,
  Sparkles,
  Layers,
  Activity,
  FileCheck,
  Info,
  SlidersHorizontal,
  Compass,
  Lock,
  ShieldAlert
} from 'lucide-react';
import {
  SchoolProfile,
  Student,
  Teacher,
  PresensiRecord,
  PresensiGuruRecord,
  SPPBill,
  PPDBRecord,
  EraporRecord,
  AnecdotRecord,
  UserRole
} from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';

const CANONICAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KETUA_YAYASAN',
  'KEPALA_SEKOLAH',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
] as const;

const EXECUTIVE_PORTAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KETUA_YAYASAN'
] as const;

interface Props {
  onSelectModule: (mod: string) => void;
}

export const R31PortalKepsek: React.FC<Props> = ({ onSelectModule }) => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates to null
  const canonicalRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Executive Access Boundary: strictly limited to leadership/governance roles
  const canAccessPortal = useMemo<boolean>(() => {
    return Boolean(
      currentUser?.uid &&
      canonicalRole &&
      EXECUTIVE_PORTAL_ROLES.includes(canonicalRole)
    );
  }, [currentUser?.uid, canonicalRole]);

  // Authentic Identity Resolution (No synthetic fallbacks)
  const actorDisplayName = useMemo(() => {
    return (
      userProfile?.nama ||
      userProfile?.name ||
      currentUser?.displayName ||
      currentUser?.email ||
      (currentUser?.uid ? `User (${currentUser.uid.slice(0, 8)})` : '')
    );
  }, [userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email, currentUser?.uid]);

  // SSOT State
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [presensiStudents, setPresensiStudents] = useState<PresensiRecord[]>([]);
  const [presensiTeachers, setPresensiTeachers] = useState<PresensiGuruRecord[]>([]);
  const [sppBills, setSppBills] = useState<SPPBill[]>([]);
  const [ppdbRecords, setPpdbRecords] = useState<PPDBRecord[]>([]);
  const [eraporRecords, setEraporRecords] = useState<EraporRecord[]>([]);
  const [anecdotRecords, setAnecdotRecords] = useState<AnecdotRecord[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'rombel' | 'erapor' | 'kepegawaian' | 'keuangan'>('rombel');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  // Today Date Helper (ISO format YYYY-MM-DD)
  const todayISO = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  // Fetch all canonical SSOT data in parallel with strict pre-query authorization
  const loadData = useCallback(async (showRefreshing = false) => {
    // HARD DATA ISOLATION: Unauthenticated or non-executive sessions must NEVER execute sensitive queries
    if (!canAccessPortal) {
      setIsLoading(false);
      setIsRefreshing(false);
      setSchoolProfile(null);
      setStudents([]);
      setTeachers([]);
      setPresensiStudents([]);
      setPresensiTeachers([]);
      setSppBills([]);
      setPpdbRecords([]);
      setEraporRecords([]);
      setAnecdotRecords([]);
      return;
    }

    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [
        profileData,
        studentsData,
        teachersData,
        presensiData,
        presensiGuruData,
        sppData,
        ppdbData,
        eraporData,
        anecdotData
      ] = await Promise.all([
        DataService.getSchoolProfile(),
        DataService.getStudents(),
        DataService.getTeachers(),
        DataService.getPresensi(),
        DataService.getPresensiGuru(),
        DataService.getSPP(),
        DataService.getPPDBRecords(),
        DataService.getErapor(),
        DataService.getAnecdot(),
      ]);

      setSchoolProfile(profileData || null);
      setStudents(studentsData || []);
      setTeachers(teachersData || []);
      setPresensiStudents(presensiData || []);
      setPresensiTeachers(presensiGuruData || []);
      setSppBills(sppData || []);
      setPpdbRecords(ppdbData || []);
      setEraporRecords(eraporData || []);
      setAnecdotRecords(anecdotData || []);
    } catch (err) {
      console.error('Error loading SSOT data for R31PortalKepsek:', err);
      setFeedbackBanner({
        type: 'error',
        message: 'Gagal memuat sebagian data eksekutif SSOT. Silakan periksa koneksi atau segarkan.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [canAccessPortal]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Aggregate Metrics Calculations
  const metrics = useMemo(() => {
    // 1. Students & Rombel Breakdown
    const activeStudents = students.filter((s) => s.status !== 'Alumni');
    const totalStudents = activeStudents.length;
    const boysCount = activeStudents.filter((s) => s.gender === 'L').length;
    const girlsCount = activeStudents.filter((s) => s.gender === 'P').length;

    const rombelMap: Record<string, { name: string; total: number; hadir: number; izin: number; sakit: number; alpa: number; unrecorded: number }> = {};

    // Get today student attendance map
    const studentAttendanceMap = new Map<string, PresensiRecord>();
    presensiStudents.forEach((p) => {
      if (p.date === todayISO) {
        studentAttendanceMap.set(p.studentId, p);
      }
    });

    let schoolStudentHadir = 0;
    let schoolStudentIzin = 0;
    let schoolStudentSakit = 0;
    let schoolStudentAlpa = 0;

    activeStudents.forEach((s) => {
      const rombelKey = s.classGroup || s.kelompok || 'Belum Ditentukan';
      if (!rombelMap[rombelKey]) {
        rombelMap[rombelKey] = {
          name: rombelKey,
          total: 0,
          hadir: 0,
          izin: 0,
          sakit: 0,
          alpa: 0,
          unrecorded: 0
        };
      }
      rombelMap[rombelKey].total++;

      const pRecord = studentAttendanceMap.get(s.id);
      if (pRecord) {
        if (pRecord.status === 'Hadir') {
          rombelMap[rombelKey].hadir++;
          schoolStudentHadir++;
        } else if (pRecord.status === 'Izin') {
          rombelMap[rombelKey].izin++;
          schoolStudentIzin++;
        } else if (pRecord.status === 'Sakit') {
          rombelMap[rombelKey].sakit++;
          schoolStudentSakit++;
        } else if (pRecord.status === 'Alpha') {
          rombelMap[rombelKey].alpa++;
          schoolStudentAlpa++;
        } else {
          rombelMap[rombelKey].unrecorded++;
        }
      } else {
        rombelMap[rombelKey].unrecorded++;
      }
    });

    const studentPresentRate = totalStudents > 0 ? Math.round((schoolStudentHadir / totalStudents) * 100) : 0;

    // 2. Teachers & Staff Attendance
    const totalTeachers = teachers.length;
    const teacherAttendanceMap = new Map<string, PresensiGuruRecord>();
    presensiTeachers.forEach((pg) => {
      if (pg.date === todayISO) {
        teacherAttendanceMap.set(pg.teacherId, pg);
      }
    });

    let teacherHadir = 0;
    let teacherIzin = 0;
    let teacherSakit = 0;
    let teacherAlpa = 0;
    let teacherUnrecorded = 0;

    teachers.forEach((t) => {
      const rec = teacherAttendanceMap.get(t.id);
      if (rec) {
        if (rec.status === 'Hadir') teacherHadir++;
        else if (rec.status === 'Izin') teacherIzin++;
        else if (rec.status === 'Sakit') teacherSakit++;
        else if (rec.status === 'Alpha') teacherAlpa++;
        else teacherUnrecorded++;
      } else {
        teacherUnrecorded++;
      }
    });

    const teacherPresentRate = totalTeachers > 0 ? Math.round((teacherHadir / totalTeachers) * 100) : 0;

    // 3. SPP Financials
    const totalSppBilled = sppBills.reduce((acc, b) => acc + (b.sppAmount || 0), 0);
    const paidSppBills = sppBills.filter((b) => b.status === 'Lunas');
    const totalSppCollected = paidSppBills.reduce((acc, b) => acc + (b.sppAmount || 0), 0);
    const totalSppPending = totalSppBilled - totalSppCollected;
    const sppCollectionRate = totalSppBilled > 0 ? Math.round((totalSppCollected / totalSppBilled) * 100) : 0;

    // 4. PPDB 2026 Progress
    const totalPpdbApplicants = ppdbRecords.length;
    const verifiedPpdb = ppdbRecords.filter((p) => p.status === 'Diterima' || p.status === 'Verifikasi').length;
    const pendingPpdb = ppdbRecords.filter((p) => p.status === 'Menunggu').length;
    const targetPpdbQuota = 50; // Target standar rombel baru A1, A2, B
    const ppdbFulfillmentRate = Math.min(100, Math.round((verifiedPpdb / targetPpdbQuota) * 100));

    // 5. E-Rapor Readiness
    const eraporMap = new Map<string, EraporRecord>();
    eraporRecords.forEach((e) => {
      eraporMap.set(e.studentId, e);
    });
    const studentsWithEraporCount = activeStudents.filter((s) => eraporMap.has(s.id)).length;
    const eraporReadinessRate = totalStudents > 0 ? Math.round((studentsWithEraporCount / totalStudents) * 100) : 0;

    return {
      totalStudents,
      boysCount,
      girlsCount,
      rombelList: Object.values(rombelMap).sort((a, b) => a.name.localeCompare(b.name)),
      schoolStudentHadir,
      schoolStudentIzin,
      schoolStudentSakit,
      schoolStudentAlpa,
      studentPresentRate,
      totalTeachers,
      teacherHadir,
      teacherIzin,
      teacherSakit,
      teacherAlpa,
      teacherUnrecorded,
      teacherPresentRate,
      totalSppBilled,
      totalSppCollected,
      totalSppPending,
      sppCollectionRate,
      totalPpdbApplicants,
      verifiedPpdb,
      pendingPpdb,
      targetPpdbQuota,
      ppdbFulfillmentRate,
      studentsWithEraporCount,
      eraporReadinessRate,
      totalAnecdotCount: anecdotRecords.length,
    };
  }, [students, teachers, presensiStudents, presensiTeachers, sppBills, ppdbRecords, eraporRecords, anecdotRecords, todayISO]);

  // Handle Print Executive Summary with strict authorization and re-entry lock
  const handlePrintSummary = async () => {
    if (isPrinting) return;
    if (!canAccessPortal || !currentUser?.uid || !canonicalRole) {
      setFeedbackBanner({
        type: 'error',
        message: 'Akses Ditolak: Anda tidak memiliki otoritas eksekutif untuk mencetak ringkasan ini.',
      });
      return;
    }

    setIsPrinting(true);
    try {
      await DataService.logAction(
        actorDisplayName || `User (${currentUser.uid.slice(0, 8)})`,
        canonicalRole,
        'PRINT_EXECUTIVE_SUMMARY',
        'R31_PORTAL_KEPSEK'
      );
      window.print();
    } catch (e) {
      console.warn('Audit logging failed for print:', e);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  // Filtered Rombel for Tab 1 Search
  const filteredRombelList = useMemo(() => {
    if (!searchQuery.trim()) return metrics.rombelList;
    const q = searchQuery.toLowerCase();
    return metrics.rombelList.filter((r) => r.name.toLowerCase().includes(q));
  }, [metrics.rombelList, searchQuery]);

  // Filtered Teachers for Tab 3 Search
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return teachers;
    const q = searchQuery.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.assignedClass && t.assignedClass.toLowerCase().includes(q)) ||
        (t.nip && t.nip.includes(q))
    );
  }, [teachers, searchQuery]);

  // Currency Formatter
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Dignified Access Denied State for Non-Executive Roles (Fail-Closed)
  if (!canAccessPortal) {
    return (
      <div id="r31-access-denied-container" className="space-y-6 max-w-4xl mx-auto py-8 px-4">
        {feedbackBanner && (
          <div
            id="r31-feedback-banner"
            role="alert"
            className="p-4 rounded-2xl flex items-center justify-between border shadow-xs bg-rose-50 border-rose-200 text-rose-800"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-sm font-medium">{feedbackBanner.message}</span>
            </div>
            <button
              onClick={() => setFeedbackBanner(null)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-black/5"
              aria-label="Tutup notifikasi"
            >
              Tutup
            </button>
          </div>
        )}

        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              Akses Terbatas • Portal Eksekutif
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Otoritas Eksekutif Diperlukan
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Modul R31 Portal Eksekutif Kepala Sekolah dirancang khusus untuk pimpinan lembaga (Kepala Sekolah, Ketua Yayasan, Super Admin, dan Admin). Peran aktif akun Anda saat ini tidak memiliki kewenangan untuk mengakses ringkasan eksekutif dan keuangan ini.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-md mx-auto text-left space-y-2">
            <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">Status Identitas Akun:</div>
            <div className="text-xs text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span>Nama Pengguna:</span>
                <span className="font-semibold text-slate-800">{actorDisplayName || 'Tidak Terautentikasi'}</span>
              </div>
              <div className="flex justify-between">
                <span>Peran Terdeteksi:</span>
                <span className="font-mono font-semibold text-slate-800">{canonicalRole || 'UNAUTHENTICATED / GUEST'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status Akses Eksekutif:</span>
                <span className="font-bold text-rose-600">Ditolak (Fail-Closed)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onSelectModule('r1')}
              className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition"
            >
              Kembali ke Beranda Utama
            </button>
            {canonicalRole === 'GURU' && (
              <button
                onClick={() => onSelectModule('r30')}
                className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition"
              >
                Buka Portal Guru (R30)
              </button>
            )}
            {(canonicalRole === 'WALI_MURID' || canonicalRole === 'CALON_WALI_MURID') && (
              <button
                onClick={() => onSelectModule('r29')}
                className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition"
              >
                Buka Portal Wali Murid (R29)
              </button>
            )}
            {canonicalRole === 'KEUANGAN' && (
              <button
                onClick={() => onSelectModule('r10')}
                className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition"
              >
                Buka Manajemen SPP (R10)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0 print:space-y-4">
      {/* Feedback Banner */}
      {feedbackBanner && (
        <div
          id="r31-feedback-banner"
          role="alert"
          className={`p-4 rounded-2xl flex items-center justify-between border shadow-xs ${
            feedbackBanner.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : feedbackBanner.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-sky-50 border-sky-200 text-sky-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedbackBanner.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : feedbackBanner.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-sky-600 shrink-0" />
            )}
            <span className="text-sm font-medium">{feedbackBanner.message}</span>
          </div>
          <button
            onClick={() => setFeedbackBanner(null)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-black/5"
            aria-label="Tutup notifikasi"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header Executive Cockpit */}
      <div
        id="r31-executive-cockpit-header"
        className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-700/60 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                R31 • Portal Eksekutif Kepala Sekolah
              </span>
              <span className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                {schoolProfile?.name || 'TK ASY SYIFA TANGGUL'}
              </span>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => loadData(true)}
                disabled={isRefreshing || isLoading}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
                aria-label="Segarkan data eksekutif"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isRefreshing ? 'Memuat...' : 'Segarkan'}</span>
              </button>

              <button
                onClick={handlePrintSummary}
                disabled={isPrinting || isLoading}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold border border-emerald-500 flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
                aria-label="Cetak Ringkasan Eksekutif"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isPrinting ? 'Mencetak...' : 'Cetak Ringkasan Eksekutif'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Ahlan wa Sahlan,</span>
                <span className="text-amber-300">
                  {actorDisplayName}
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Cockpit pimpinan dan supervisi kelembagaan. Pantau kehadiran siswa dan pendidik, kepatuhan pembayaran SPP, progres verifikasi PPDB 2026, serta mutu evaluasi E-Rapor PAUD dalam satu panel terintegrasi.
              </p>
            </div>

            {/* School Official Metadata Badge */}
            <div className="bg-slate-800/85 backdrop-blur-xs border border-slate-700 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-slate-400">NPSN / Status:</span>
                <span className="font-bold text-amber-300 font-mono">
                  {schoolProfile?.npsn || '69900000'} • Akreditasi A
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-slate-400">Hari & Tanggal:</span>
                <span className="font-medium text-slate-200">{todayFormatted}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-slate-400">Tahun Ajaran:</span>
                <span className="font-medium text-slate-200">2026/2027 • Semester Genap</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* School-Wide Health Pulse */}
      <div
        id="r31-school-wide-pulse"
        className="bg-emerald-50/75 border border-emerald-200/90 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs"
      >
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm">
              <Activity className="w-5 h-5 animate-pulse text-emerald-100" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm">School-Wide Health Pulse</h2>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                Real-time Agregasi
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Total Populasi: <strong className="text-slate-900">{metrics.totalStudents} Siswa</strong> •{' '}
              <strong className="text-slate-900">{metrics.totalTeachers} Pendidik/Staf</strong>
            </p>
          </div>
        </div>

        {/* Executive Ticker Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-start md:justify-end text-xs">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-semibold text-slate-700">Kehadiran Guru:</span>
            <strong className="text-emerald-700 font-bold">
              {metrics.teacherHadir}/{metrics.totalTeachers} ({metrics.teacherPresentRate}%)
            </strong>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span className="font-semibold text-slate-700">Kehadiran Murid:</span>
            <strong className="text-sky-700 font-bold">
              {metrics.schoolStudentHadir}/{metrics.totalStudents} ({metrics.studentPresentRate}%)
            </strong>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-700">Kolektivitas SPP:</span>
            <strong className="text-amber-700 font-bold">{metrics.sppCollectionRate}%</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="font-semibold text-slate-700">PPDB 2026:</span>
            <strong className="text-indigo-700 font-bold">{metrics.verifiedPpdb} Terverifikasi</strong>
          </div>
        </div>
      </div>

      {/* AI Asy Executive Companion for Principal */}
      <AIAsyCharacterScene pageContext="dashboardKepsek" />

      {/* 4 Smart Executive Data Cards */}
      <div id="r31-smart-executive-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* CARD 1: Total Murid & Rasio Rombel */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Siswa & Rasio
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? '...' : metrics.totalStudents}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                👦 L: <strong>{metrics.boysCount}</strong>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                👧 P: <strong>{metrics.girlsCount}</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">
                {metrics.rombelList.length} Rombel
              </span>
            </p>
          </div>
        </div>

        {/* CARD 2: Kehadiran Guru & Staf */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-teal-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Kehadiran Dewan Guru
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{isLoading ? '...' : `${metrics.teacherHadir}/${metrics.totalTeachers}`}</span>
              <span className="text-xs font-bold text-teal-700">
                ({metrics.teacherPresentRate}%)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {metrics.teacherUnrecorded === 0
                ? '✅ Seluruh dewan guru telah terabsen'
                : `⚠️ ${metrics.teacherUnrecorded} guru belum absensi hari ini`}
            </p>
          </div>
        </div>

        {/* CARD 3: Keuangan SPP Institusi */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-amber-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Keuangan SPP Siswa
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? '...' : formatIDR(metrics.totalSppCollected)}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center justify-between">
              <span>Tertunggak: <strong>{formatIDR(metrics.totalSppPending)}</strong></span>
              <span className="font-bold text-amber-700">({metrics.sppCollectionRate}%)</span>
            </p>
          </div>
        </div>

        {/* CARD 4: PPDB 2026 & E-Rapor Readiness */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-sky-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              PPDB 2026 & E-Rapor
            </span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{isLoading ? '...' : `${metrics.verifiedPpdb}/${metrics.targetPpdbQuota}`}</span>
              <span className="text-xs font-bold text-sky-700">
                ({metrics.ppdbFulfillmentRate}%)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Kesiapan E-Rapor: <strong className="text-slate-900">{metrics.eraporReadinessRate}%</strong> ({metrics.studentsWithEraporCount} siswa)
            </p>
          </div>
        </div>
      </div>

      {/* Executive Quick Action Dock */}
      <div id="r31-quick-action-dock" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Pusat Aksi & Navigasi Supervisi
          </h2>
          <span className="text-xs text-stone-500">Akses langsung modul pengelolaan inti</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onSelectModule('r12')}
            className="group bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md text-left transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition">
                <PieChart className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                Laporan Keuangan & SPP (R12)
              </h3>
              <p className="text-xs text-stone-500">Ringkasan arus kas, efisiensi & buku kas umum</p>
            </div>
          </button>

          <button
            onClick={() => onSelectModule('r13')}
            className="group bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-amber-500 hover:shadow-md text-left transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition">
                <Users className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition">
                Verifikasi PPDB 2026 (R13)
              </h3>
              <p className="text-xs text-stone-500">Validasi berkas & penetapan kuota peserta didik</p>
            </div>
          </button>

          <button
            onClick={() => onSelectModule('r8')}
            className="group bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-sky-500 hover:shadow-md text-left transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center transition">
                <Award className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-sky-600 transition" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-700 transition">
                Pengesahan E-Rapor (R8)
              </h3>
              <p className="text-xs text-stone-500">Supervisi capaian kurikulum Merdeka PAUD</p>
            </div>
          </button>

          <button
            onClick={() => onSelectModule('r24')}
            className="group bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-indigo-500 hover:shadow-md text-left transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-indigo-600 transition" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition">
                Audit Trail & Log Keamanan (R24)
              </h3>
              <p className="text-xs text-stone-500">Riwayat aktivitas mutasi dan tata kelola akun</p>
            </div>
          </button>
        </div>
      </div>

      {/* Executive Supervisory Matrix (Tabbed Workspace) */}
      <div id="r31-supervisory-matrix" className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        {/* Header Tab Navigation & Filter */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-2xl text-xs">
            <button
              onClick={() => setActiveTab('rombel')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'rombel'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
            >
              Supervisi Rombel & Kehadiran ({metrics.rombelList.length})
            </button>
            <button
              onClick={() => setActiveTab('kepegawaian')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'kepegawaian'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
            >
              Dewan Guru & PTK ({teachers.length})
            </button>
            <button
              onClick={() => setActiveTab('erapor')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'erapor'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
            >
              Kesiapan E-Rapor ({metrics.studentsWithEraporCount}/{metrics.totalStudents})
            </button>
            <button
              onClick={() => setActiveTab('keuangan')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'keuangan'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
            >
              Rekap SPP
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter data pimpinan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:outline-hidden focus:border-emerald-500 shadow-2xs"
            />
          </div>
        </div>

        {/* TAB 1: Supervisi Rombel & Kehadiran Murid */}
        {activeTab === 'rombel' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/70 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Rombel / Kelompok</th>
                  <th className="py-3.5 px-4 text-center">Total Siswa</th>
                  <th className="py-3.5 px-4 text-center">Hadir</th>
                  <th className="py-3.5 px-4 text-center">Izin</th>
                  <th className="py-3.5 px-4 text-center">Sakit</th>
                  <th className="py-3.5 px-4 text-center">Alpa</th>
                  <th className="py-3.5 px-4 text-center">Belum Absen</th>
                  <th className="py-3.5 px-4 text-center">% Kehadiran</th>
                  <th className="py-3.5 px-4 text-right print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-stone-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                      Memuat matriks kehadiran rombel...
                    </td>
                  </tr>
                ) : filteredRombelList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-stone-500">
                      <Layers className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                      <p className="font-semibold text-slate-700">Data rombel belum tersedia</p>
                      <p className="text-xs text-stone-400">Pastikan data siswa telah dimasukkan di modul R1/R4.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRombelList.map((r, idx) => {
                    const presentRate = r.total > 0 ? Math.round((r.hadir / r.total) * 100) : 0;
                    return (
                      <tr key={r.name} className="hover:bg-emerald-50/30 transition">
                        <td className="py-3 px-4 text-center font-medium text-stone-400">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            {r.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-900">{r.total}</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/50">
                          {r.hadir}
                        </td>
                        <td className="py-3 px-4 text-center text-sky-700 font-semibold">{r.izin}</td>
                        <td className="py-3 px-4 text-center text-amber-700 font-semibold">{r.sakit}</td>
                        <td className="py-3 px-4 text-center text-rose-700 font-semibold">{r.alpa}</td>
                        <td className="py-3 px-4 text-center text-stone-400">{r.unrecorded}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              presentRate >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : presentRate >= 50
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {presentRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right print:hidden">
                          <button
                            onClick={() => onSelectModule('r6')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] transition"
                          >
                            Detail Presensi
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Supervisi Kepegawaian & Guru */}
        {activeTab === 'kepegawaian' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/70 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Pendidik / Tenaga Kependidikan</th>
                  <th className="py-3.5 px-4">NIP / NUPTK</th>
                  <th className="py-3.5 px-4">Penugasan Rombel</th>
                  <th className="py-3.5 px-4">Presensi Hari Ini</th>
                  <th className="py-3.5 px-4">Jam Masuk</th>
                  <th className="py-3.5 px-4 text-right print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600 mb-2" />
                      Memuat daftar dewan guru...
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      <Users className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                      <p className="font-semibold text-slate-700">Tidak ada guru ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((t, idx) => {
                    const presensiToday = presensiTeachers.find(
                      (p) => p.teacherId === t.id && p.date === todayISO
                    );
                    return (
                      <tr key={t.id} className="hover:bg-teal-50/30 transition">
                        <td className="py-3 px-4 text-center font-medium text-stone-400">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0">
                              {t.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{t.name}</div>
                              <div className="text-[10px] text-stone-500">{t.position || t.title || 'Pendidik PAUD'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">{t.nip || '-'}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-700 bg-stone-100 px-2.5 py-0.5 rounded-md">
                            {t.assignedClass || 'Umum / Sentra'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {presensiToday ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                                presensiToday.status === 'Hadir'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : presensiToday.status === 'Izin'
                                  ? 'bg-sky-100 text-sky-800'
                                  : presensiToday.status === 'Sakit'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  presensiToday.status === 'Hadir'
                                    ? 'bg-emerald-600'
                                    : presensiToday.status === 'Izin'
                                    ? 'bg-sky-600'
                                    : presensiToday.status === 'Sakit'
                                    ? 'bg-amber-600'
                                    : 'bg-rose-600'
                                }`}
                              />
                              {presensiToday.status}
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Belum Presensi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                          {presensiToday?.notes || presensiToday?.activitySummary || '-'}
                        </td>
                        <td className="py-3 px-4 text-right print:hidden">
                          <button
                            onClick={() => onSelectModule('r7')}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-[11px] transition"
                          >
                            Presensi GTK
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Kesiapan E-Rapor Seluruh Kelas */}
        {activeTab === 'erapor' && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                <span className="text-xs font-bold text-sky-700 uppercase">Siswa Terdaftar E-Rapor</span>
                <div className="text-2xl font-extrabold text-sky-950">
                  {metrics.studentsWithEraporCount} / {metrics.totalStudents}
                </div>
                <p className="text-xs text-sky-600">Siswa yang memiliki entri narasi capaian</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase">Jurnal Anekdot Pendukung</span>
                <div className="text-2xl font-extrabold text-emerald-950">{metrics.totalAnecdotCount} Catatan</div>
                <p className="text-xs text-emerald-600">Bukti observasi asesmen autentik</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase">Tingkat Kesiapan Pengesahan</span>
                <div className="text-2xl font-extrabold text-amber-950">{metrics.eraporReadinessRate}%</div>
                <p className="text-xs text-amber-600">Kesiapan cetak rapor semester</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-stone-600">
                Pimpinan dapat melakukan verifikasi narasi perkembangan anak dan memberikan tanda tangan digital / persetujuan di modul R8.
              </p>
              <button
                onClick={() => onSelectModule('r8')}
                className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs inline-flex items-center gap-1.5 transition"
              >
                <Award className="w-4 h-4" />
                Buka Pengesahan E-Rapor (R8)
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Rekap SPP & Kolektibilitas */}
        {activeTab === 'keuangan' && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase">Total SPP Diterima</span>
                <div className="text-2xl font-extrabold text-emerald-950">{formatIDR(metrics.totalSppCollected)}</div>
                <p className="text-xs text-emerald-600">{metrics.sppCollectionRate}% dari total target tagihan</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                <span className="text-xs font-bold text-rose-700 uppercase">Total Tunggakan SPP</span>
                <div className="text-2xl font-extrabold text-rose-950">{formatIDR(metrics.totalSppPending)}</div>
                <p className="text-xs text-rose-600">Tunggakan yang perlu ditindaklanjuti</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-700 uppercase">Total Tagihan Billed</span>
                <div className="text-2xl font-extrabold text-slate-900">{formatIDR(metrics.totalSppBilled)}</div>
                <p className="text-xs text-slate-500">Agregasi seluruh tagihan siswa aktif</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-stone-600">
                Detail rekap kwitansi, kas masuk-keluar, dan laporan neraca institusi tersedia lengkap di modul Keuangan R12.
              </p>
              <button
                onClick={() => onSelectModule('r12')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5 transition"
              >
                <PieChart className="w-4 h-4" />
                Buka Laporan Keuangan (R12)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leadership Wisdom Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-300">
          <Compass className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm">Pedoman Kepemimpinan & Tata Kelola PAUD Islami</h3>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
          Kepala Sekolah berperan sebagai pemegang amanah mutu pendidikan (<em>Quality Assurance</em>) dan teladan keislaman. Pastikan lingkungan belajar selalu aman, asri, dan mendukung fitrah tumbuh kembang anak didik sesuai nilai-nilai luhur Al-Qur'an dan Sunnah.
        </p>
      </div>
    </div>
  );
};

