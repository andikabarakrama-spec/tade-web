import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  CalendarCheck,
  Award,
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Printer,
  Heart,
  ChevronRight,
  RefreshCw,
  FileText,
  Layers,
  GraduationCap,
  Info,
  Calendar,
  UserCheck,
  ShieldCheck,
  MessageSquare,
  Activity,
  Smile,
  Lock,
  ShieldAlert
} from 'lucide-react';
import {
  Student,
  Teacher,
  PresensiRecord,
  AnecdotRecord,
  EraporRecord,
  SchoolProfile,
  UserRole
} from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';

const CANONICAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KETUA_YAYASAN',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
] as const;

const EDUCATOR_PORTAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KETUA_YAYASAN',
  'GURU'
] as const;

interface Props {
  onSelectModule: (mod: string) => void;
}

export const R30PortalGuru: React.FC<Props> = ({ onSelectModule }) => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. Authoritative Canonical Role Resolution (Fail-Closed, Default Deny)
  // Rejects unauthenticated sessions, missing roles, or non-canonical roles
  const canonicalRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Authorization check for Portal Guru
  const canAccessPortalGuru = useMemo<boolean>(() => {
    return Boolean(canonicalRole && EDUCATOR_PORTAL_ROLES.includes(canonicalRole));
  }, [canonicalRole]);

  // Elevated roles can supervise all rombels and switch active views
  const isElevatedRole = useMemo(() => {
    const elevated: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN'];
    return Boolean(canonicalRole && elevated.includes(canonicalRole));
  }, [canonicalRole]);

  const isGuru = useMemo(() => {
    return canonicalRole === 'GURU';
  }, [canonicalRole]);

  // Authentic actor identity (Strictly authentic, no synthetic fallbacks)
  const actorDisplayName = useMemo(() => {
    if (userProfile?.nama?.trim()) return userProfile.nama.trim();
    if (userProfile?.name?.trim()) return userProfile.name.trim();
    if (currentUser?.displayName?.trim()) return currentUser.displayName.trim();
    if (currentUser?.email?.trim()) return currentUser.email.trim();
    if (currentUser?.uid) return `User (${currentUser.uid.slice(0, 8)})`;
    return 'Pengguna Terautentikasi';
  }, [userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email, currentUser?.uid]);

  // SSOT State
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [presensiRecords, setPresensiRecords] = useState<PresensiRecord[]>([]);
  const [anecdotRecords, setAnecdotRecords] = useState<AnecdotRecord[]>([]);
  const [eraporRecords, setEraporRecords] = useState<EraporRecord[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Filters & Workspace State
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'roster' | 'presensi' | 'anecdot' | 'erapor'>('roster');
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

  // Fetch all SSOT data with hard pre-query authorization gate & anti-double-submit
  const loadData = useCallback(async (showRefreshingState = false) => {
    // HARD PRE-QUERY AUTHORIZATION GATE: Zero sensitive queries for unauthorized sessions
    if (!canAccessPortalGuru || !currentUser?.uid || !canonicalRole) {
      setStudents([]);
      setTeachers([]);
      setPresensiRecords([]);
      setAnecdotRecords([]);
      setEraporRecords([]);
      setSchoolProfile(null);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    // Anti-double-submit execution lock
    if (showRefreshingState) {
      if (isRefreshing) return;
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [
        studentsData,
        teachersData,
        presensiData,
        anecdotData,
        eraporData,
        profileData
      ] = await Promise.all([
        DataService.getStudents(canonicalRole, currentUser?.uid, userProfile?.email),
        DataService.getTeachers(),
        DataService.getPresensi(),
        DataService.getAnecdot(),
        DataService.getErapor(),
        DataService.getSchoolProfile(),
      ]);

      setStudents(studentsData || []);
      setTeachers(teachersData || []);
      setPresensiRecords(presensiData || []);
      setAnecdotRecords(anecdotData || []);
      setEraporRecords(eraporData || []);
      setSchoolProfile(profileData || null);

      if (showRefreshingState) {
        try {
          await DataService.logAction(
            actorDisplayName,
            canonicalRole,
            'REFRESH_WORKSPACE',
            `R30_PORTAL_GURU - Segarkan ruang kerja pendidik oleh ${actorDisplayName} (${canonicalRole})`
          );
        } catch (auditErr) {
          console.warn('Audit log refresh failed:', auditErr);
        }
      }
    } catch (err) {
      console.error('Error loading SSOT data in R30PortalGuru:', err);
      setFeedbackBanner({
        type: 'error',
        message: 'Gagal memuat sebagian data SSOT. Silakan periksa koneksi atau segarkan halaman.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [canAccessPortalGuru, currentUser?.uid, canonicalRole, userProfile?.email, isRefreshing, actorDisplayName]);

  useEffect(() => {
    if (canAccessPortalGuru && currentUser?.uid) {
      loadData();
    } else {
      // Clear sensitive data immediately for unauthorized sessions
      setStudents([]);
      setTeachers([]);
      setPresensiRecords([]);
      setAnecdotRecords([]);
      setEraporRecords([]);
      setSchoolProfile(null);
      setIsLoading(false);
    }
  }, [canAccessPortalGuru, currentUser?.uid, loadData]);

  // Identify Current Teacher Profile
  const currentTeacher = useMemo<Teacher | null>(() => {
    if (!userProfile && !currentUser) return null;
    // Match by email first
    const userEmail = userProfile?.email || currentUser?.email;
    if (userEmail) {
      const byEmail = teachers.find(
        (t) => t.email && t.email.toLowerCase() === userEmail.toLowerCase()
      );
      if (byEmail) return byEmail;
    }

    // Match by name
    const userName = userProfile?.nama || userProfile?.name || currentUser?.displayName;
    if (userName) {
      const byName = teachers.find(
        (t) => t.name && t.name.toLowerCase().includes(userName.toLowerCase())
      );
      if (byName) return byName;
    }

    return null;
  }, [teachers, userProfile, currentUser]);

  // Available Rombel List
  const availableClasses = useMemo(() => {
    const classSet = new Set<string>();
    students.forEach((s) => {
      if (s.classGroup) classSet.add(s.classGroup);
      if (s.kelompok) classSet.add(s.kelompok);
    });
    teachers.forEach((t) => {
      if (t.assignedClass) classSet.add(t.assignedClass);
    });

    const list = Array.from(classSet).filter(Boolean);
    if (list.length === 0) {
      return ['Kelompok A1', 'Kelompok A2', 'Kelompok B1', 'Kelompok B2', 'PAUD TPA'];
    }
    return list.sort();
  }, [students, teachers]);

  // Set default selectedClass based on teacher assignment or first available
  useEffect(() => {
    if (!canAccessPortalGuru) return;

    if (isGuru) {
      // Hard teacher isolation: lock to assigned class
      const teacherAssigned = userProfile?.assignedClass || currentTeacher?.assignedClass;
      if (teacherAssigned && availableClasses.includes(teacherAssigned)) {
        setSelectedClass(teacherAssigned);
        return;
      }
    }

    if (selectedClass) return; // already set

    if (userProfile?.assignedClass && availableClasses.includes(userProfile.assignedClass)) {
      setSelectedClass(userProfile.assignedClass);
    } else if (currentTeacher?.assignedClass && availableClasses.includes(currentTeacher.assignedClass)) {
      setSelectedClass(currentTeacher.assignedClass);
    } else if (availableClasses.length > 0) {
      // Default to Kelompok B1 if available, otherwise first class
      const preferred = availableClasses.find((c) => c.includes('B1')) || availableClasses[0];
      setSelectedClass(preferred);
    }
  }, [canAccessPortalGuru, isGuru, userProfile, currentTeacher, availableClasses, selectedClass]);

  // Effective Active Rombel with hard boundary enforcement for GURU
  const effectiveClass = useMemo(() => {
    if (isGuru) {
      const assigned = userProfile?.assignedClass || currentTeacher?.assignedClass;
      if (assigned && availableClasses.includes(assigned)) {
        return assigned;
      }
    }
    return selectedClass;
  }, [isGuru, userProfile?.assignedClass, currentTeacher?.assignedClass, availableClasses, selectedClass]);

  // Active Class Students (Rombel Isolation)
  const classStudents = useMemo(() => {
    if (!effectiveClass) return [];
    return students.filter(
      (s) => (s.classGroup === effectiveClass || s.kelompok === effectiveClass) && s.status !== 'Alumni'
    );
  }, [students, effectiveClass]);

  // Filtered Class Students by Search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return classStudents;
    const q = searchQuery.toLowerCase();
    return classStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.namaLengkap && s.namaLengkap.toLowerCase().includes(q)) ||
        (s.nickname && s.nickname.toLowerCase().includes(q)) ||
        (s.nis && s.nis.toLowerCase().includes(q)) ||
        (s.nisn && s.nisn.toLowerCase().includes(q))
    );
  }, [classStudents, searchQuery]);

  // Today Attendance for Active Class
  const todayAttendanceMap = useMemo(() => {
    const map = new Map<string, PresensiRecord>();
    presensiRecords.forEach((p) => {
      if (p.date === todayISO) {
        map.set(p.studentId, p);
      }
    });
    return map;
  }, [presensiRecords, todayISO]);

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalRombel = classStudents.length;
    const boysCount = classStudents.filter((s) => s.gender === 'L').length;
    const girlsCount = classStudents.filter((s) => s.gender === 'P').length;

    let hadirCount = 0;
    let sakitCount = 0;
    let izinCount = 0;
    let alpaCount = 0;
    let unrecordedCount = 0;

    classStudents.forEach((s) => {
      const record = todayAttendanceMap.get(s.id);
      if (!record) {
        unrecordedCount++;
      } else if (record.status === 'Hadir') {
        hadirCount++;
      } else if (record.status === 'Sakit') {
        sakitCount++;
      } else if (record.status === 'Izin') {
        izinCount++;
      } else if (record.status === 'Alpha') {
        alpaCount++;
      } else {
        unrecordedCount++;
      }
    });

    const presentPercentage = totalRombel > 0 ? Math.round((hadirCount / totalRombel) * 100) : 0;

    // Anecdot records in the last 7 days for students in this class
    const studentIdSet = new Set(classStudents.map((s) => s.id));
    const nowMs = new Date().getTime();
    const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;

    const recentAnecdot = anecdotRecords.filter((a) => {
      if (!studentIdSet.has(a.studentId) && a.classGroup !== effectiveClass) return false;
      const recordDate = new Date(a.date).getTime();
      return !isNaN(recordDate) && recordDate >= sevenDaysAgoMs;
    });

    // Erapor readiness for this class
    const eraporMap = new Map<string, EraporRecord>();
    eraporRecords.forEach((e) => {
      if (studentIdSet.has(e.studentId) || e.classGroup === effectiveClass) {
        eraporMap.set(e.studentId, e);
      }
    });
    const studentsWithEraporCount = classStudents.filter((s) => eraporMap.has(s.id)).length;
    const eraporPercentage = totalRombel > 0 ? Math.round((studentsWithEraporCount / totalRombel) * 100) : 0;

    return {
      totalRombel,
      boysCount,
      girlsCount,
      hadirCount,
      sakitCount,
      izinCount,
      alpaCount,
      unrecordedCount,
      presentPercentage,
      recentAnecdotCount: recentAnecdot.length,
      studentsWithEraporCount,
      eraporPercentage,
    };
  }, [classStudents, todayAttendanceMap, anecdotRecords, eraporRecords, effectiveClass]);

  // Recent Anecdot Records for Class
  const classAnecdotRecords = useMemo(() => {
    const studentIdSet = new Set(classStudents.map((s) => s.id));
    return anecdotRecords
      .filter((a) => studentIdSet.has(a.studentId) || a.classGroup === effectiveClass)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [anecdotRecords, classStudents, effectiveClass]);

  // Handler-Level Authorization & Anti-Double-Submit for Print Roster
  const handlePrintRoster = async () => {
    if (!canAccessPortalGuru || !currentUser?.uid || !canonicalRole) {
      setFeedbackBanner({
        type: 'error',
        message: 'Akses Ditolak: Otoritas tidak mencukupi untuk mencetak roster rombel.'
      });
      return;
    }

    if (isPrinting || isRefreshing) return;

    setIsPrinting(true);
    try {
      await DataService.logAction(
        actorDisplayName,
        canonicalRole,
        'PRINT_ROSTER',
        `R30_PORTAL_GURU - Cetak roster rombel ${effectiveClass || 'Semua'} oleh ${actorDisplayName} (${canonicalRole})`
      );
      window.print();
    } catch (e) {
      console.warn('Audit logging failed for print roster:', e);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  // FAIL-CLOSED ACCESS DENIED ISOLATION (ZERO SENSITIVE DATA IN DOM)
  if (!canAccessPortalGuru) {
    return (
      <div id="r30-access-denied-container" className="space-y-6 max-w-4xl mx-auto py-8 px-4">
        {feedbackBanner && (
          <div
            role="alert"
            className="p-4 rounded-2xl flex items-center justify-between border shadow-xs bg-amber-50 border-amber-200 text-amber-800"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-sm font-medium">{feedbackBanner.message}</span>
            </div>
            <button
              onClick={() => setFeedbackBanner(null)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-black/5 cursor-pointer"
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
              Akses Terbatas • Ruang Kerja Pendidik
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Otoritas Pendidik Diperlukan
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Modul R30 Portal Guru memuat data sensitif peserta didik, observasi catatan anekdot, dan E-Rapor. Akses dibatasi khusus bagi dewan guru dan pimpinan sekolah (<strong>GURU</strong>, <strong>KEPALA_SEKOLAH</strong>, <strong>KETUA_YAYASAN</strong>, <strong>ADMIN</strong>, <strong>SUPER_ADMIN</strong>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-stone-600">
              <span>Status Autentikasi:</span>
              <span className="font-bold text-slate-900">
                {currentUser?.uid ? 'Terautentikasi' : 'Belum Masuk'}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Identitas Sesi:</span>
              <span className="font-mono font-medium text-slate-900 truncate max-w-[200px]">
                {actorDisplayName || 'Tamu / Anonim'}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Peran Terdeteksi:</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                {canonicalRole || 'TIDAK TERIDENTIFIKASI'}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Kebijakan Keamanan:</span>
              <span className="font-bold text-rose-600">FAIL-CLOSED (DENY)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/sim"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
            >
              <span>Kembali ke Beranda Utama</span>
            </a>
            {onSelectModule && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectModule('r29')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs border border-stone-300 transition cursor-pointer"
                >
                  <span>Portal Wali Murid</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectModule('r31')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs border border-stone-300 transition cursor-pointer"
                >
                  <span>Portal Kepala Sekolah</span>
                </button>
              </>
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
          id="r30-feedback-banner"
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

      {/* Header Workspace */}
      <div
        id="r30-header-workspace"
        className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden"
      >
        {/* Background Subtle Pattern */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 border border-emerald-700/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                R30 • Ruang Kerja Pendidik
              </span>
              <span className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                {schoolProfile?.name || 'TK ASY SYIFA TANGGUL'}
              </span>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => loadData(true)}
                disabled={isRefreshing || isLoading || isPrinting}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                aria-label="Segarkan data kelas"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isRefreshing ? 'Memuat...' : 'Segarkan'}</span>
              </button>

              <button
                onClick={handlePrintRoster}
                disabled={isPrinting || isRefreshing}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium border border-emerald-600 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                aria-label="Cetak lembar kerja kelas"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isPrinting ? 'Menyiapkan...' : 'Cetak Roster'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Ahlan wa Sahlan,</span>
                <span className="text-emerald-300">
                  {actorDisplayName}
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Pusat kendali dan administrasi harian wali kelas. Pantau kehadiran murid, observasi perkembangan karakter Islami, dan kelola kelulusan E-Rapor dalam satu ruang kerja terpadu.
              </p>
            </div>

            {/* Class Assignment Badge & Date */}
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-slate-400">Rombel Aktif:</span>
                <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800">
                  {effectiveClass || 'Memuat...'}
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

          {/* Rombel Switcher (For Elevated Roles or Multi-Class Teachers) */}
          {isElevatedRole && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Mode Supervisi Rombel:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableClasses.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      effectiveClass === cls
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Living Classroom Pulse */}
      <div
        id="r30-living-classroom-pulse"
        className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs"
      >
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Activity className="w-5 h-5 animate-pulse text-emerald-100" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm">Living Classroom Pulse</h2>
              <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                Real-time SSOT
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Rombel <strong className="text-slate-900">{effectiveClass}</strong> • Total{' '}
              <strong className="text-slate-900">{metrics.totalRombel} Siswa</strong>
            </p>
          </div>
        </div>

        {/* Live Attendance Ticker */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-start md:justify-end text-xs">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Hadir:</span>
            <strong className="text-emerald-700 font-bold">{metrics.hadirCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="font-semibold text-slate-700">Izin:</span>
            <strong className="text-sky-700 font-bold">{metrics.izinCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-700">Sakit:</span>
            <strong className="text-amber-700 font-bold">{metrics.sakitCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="font-semibold text-slate-700">Alpa:</span>
            <strong className="text-rose-700 font-bold">{metrics.alpaCount}</strong>
          </div>
          {metrics.unrecordedCount > 0 && (
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs text-stone-600">
              <span className="w-2 h-2 rounded-full bg-stone-400" />
              <span>Belum Absen:</span>
              <strong className="font-bold">{metrics.unrecordedCount}</strong>
            </div>
          )}
        </div>
      </div>

      {/* AI Asy Companion Integration */}
      <AIAsyCharacterScene pageContext="dashboardGuru" />

      {/* 4 Smart Data Cards */}
      <div id="r30-smart-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Siswa Rombel */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Siswa Rombel
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? '...' : metrics.totalRombel}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                👦 L: <strong>{metrics.boysCount}</strong>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                👧 P: <strong>{metrics.girlsCount}</strong>
              </span>
            </p>
          </div>
        </div>

        {/* Card 2: Kehadiran Hari Ini */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Kehadiran Hari Ini
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{isLoading ? '...' : `${metrics.hadirCount}/${metrics.totalRombel}`}</span>
              <span className="text-xs font-bold text-emerald-600">
                ({metrics.presentPercentage}%)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {metrics.unrecordedCount === 0
                ? '✅ Presensi hari ini telah lengkap'
                : `⚠️ ${metrics.unrecordedCount} siswa belum tercatat`}
            </p>
          </div>
        </div>

        {/* Card 3: Jurnal Anekdot Minggu Ini */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-amber-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Anekdot (7 Hari)
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? '...' : metrics.recentAnecdotCount}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Catatan observasi peristiwa unik anak
            </p>
          </div>
        </div>

        {/* Card 4: Kesiapan E-Rapor */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-sky-300 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Kesiapan E-Rapor
            </span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{isLoading ? '...' : `${metrics.studentsWithEraporCount}/${metrics.totalRombel}`}</span>
              <span className="text-xs font-bold text-sky-600">
                ({metrics.eraporPercentage}%)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Siswa yang sudah memiliki capaian rapor
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div id="r30-quick-action-dock" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Pusat Aksi Cepat Pendidik
          </h2>
          <span className="text-xs text-stone-500">Navigasi langsung ke modul SIM terkait</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onSelectModule('r6')}
            className="group bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md text-left transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                Input Presensi Harian (R6)
              </h3>
              <p className="text-xs text-stone-500">Absensi kehadiran murid rombel hari ini</p>
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
                E-Rapor Kurikulum PAUD (R8)
              </h3>
              <p className="text-xs text-stone-500">Narasi capaian, agama, jati diri & STEAM</p>
            </div>
          </button>

          <button
            onClick={() => onSelectModule('r9')}
            className="group bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-amber-500 hover:shadow-md text-left transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition">
                Jurnal Catatan Anekdot (R9)
              </h3>
              <p className="text-xs text-stone-500">Catat peristiwa unik & analisis perkembangan</p>
            </div>
          </button>

          <button
            onClick={() => onSelectModule('r16')}
            className="group bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-indigo-500 hover:shadow-md text-left transition flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
                <MessageSquare className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-indigo-600 transition" />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition">
                Buku Penghubung Wali (R16)
              </h3>
              <p className="text-xs text-stone-500">Komunikasi harian & catatan orang tua</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Workspace Tabs & Roster */}
      <div id="r30-class-roster" className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        {/* Tab Navigation & Search Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Sub Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-2xl text-xs">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'roster'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
            >
              Daftar Siswa Rombel ({classStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('anecdot')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'anecdot'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
            >
              Anekdot Terbaru ({classAnecdotRecords.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau NIS siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:outline-hidden focus:border-emerald-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Tab 1: Class Roster */}
        {activeTab === 'roster' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/70 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">NIS / NISN</th>
                  <th className="py-3.5 px-4 text-center">L/P</th>
                  <th className="py-3.5 px-4">Presensi Hari Ini</th>
                  <th className="py-3.5 px-4">Anekdot</th>
                  <th className="py-3.5 px-4">E-Rapor</th>
                  <th className="py-3.5 px-4 text-right print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                      Memuat daftar siswa rombel...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-500">
                      <Users className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                      <p className="font-semibold text-slate-700">Tidak ada siswa ditemukan</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {searchQuery
                          ? `Tidak ada siswa yang cocok dengan pencarian "${searchQuery}"`
                          : `Belum ada data siswa di rombel ${effectiveClass}`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const presensiToday = todayAttendanceMap.get(student.id);
                    const studentAnecdotCount = anecdotRecords.filter((a) => a.studentId === student.id).length;
                    const hasErapor = eraporRecords.some((e) => e.studentId === student.id);

                    return (
                      <tr key={student.id} className="hover:bg-emerald-50/40 transition">
                        <td className="py-3 px-4 text-center font-medium text-stone-400">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                              {student.nickname
                                ? student.nickname.charAt(0).toUpperCase()
                                : student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{student.name}</div>
                              {student.nickname && (
                                <div className="text-[10px] text-stone-500">
                                  Panggilan: &quot;{student.nickname}&quot;
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                          {student.nis || student.nisn || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              student.gender === 'L'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
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
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 italic">
                              <Clock className="w-3 h-3" />
                              Belum Diinput
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {studentAnecdotCount > 0 ? (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                              <BookOpen className="w-3 h-3" />
                              {studentAnecdotCount} Catatan
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-400">Belum ada</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {hasErapor ? (
                            <span className="inline-flex items-center gap-1 font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Tersedia
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-400">Draf Kosong</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right print:hidden">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onSelectModule('r9')}
                              title="Tambah / Lihat Catatan Anekdot"
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSelectModule('r8')}
                              title="Buka Lembar E-Rapor"
                              className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 transition"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Recent Anecdot Records */}
        {activeTab === 'anecdot' && (
          <div className="p-5 space-y-4">
            {classAnecdotRecords.length === 0 ? (
              <div className="text-center py-12 text-stone-500 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
                <p className="font-semibold text-slate-700">Belum ada catatan anekdot untuk rombel ini</p>
                <p className="text-xs text-stone-400">
                  Gunakan modul R9 untuk mencatat peristiwa perkembangan unik anak didik.
                </p>
                <button
                  onClick={() => onSelectModule('r9')}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  Buka Modul Anekdot (R9)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classAnecdotRecords.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{item.studentName}</span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {item.date} {item.time && `• ${item.time}`}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 space-y-1">
                      <p>
                        <strong className="text-stone-500">Peristiwa: </strong>
                        {item.observedBehavior}
                      </p>
                      {item.teacherAnalysis && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
                          <strong>Analisis Guru: </strong>
                          {item.teacherAnalysis}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PAUD Merdeka Pedagogical Tip Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-900">
          <Smile className="w-5 h-5 text-amber-700" />
          <h3 className="font-bold text-sm">Pedoman Asesmen Karakter Islami PAUD Merdeka</h3>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed max-w-3xl">
          Fokuskan observasi harian pada tiga pilar capaian pembelajaran: <strong>Nilai Agama & Budi Pekerti</strong> (adab berdoa, hafalan juz amma, kejujuran), <strong>Jati Diri</strong> (regulasi emosi, kemandirian motorik), serta <strong>Dasar-dasar Literasi & STEAM</strong> (eksplorasi saintifik alam sekitar). Catat setiap progres positif dalam jurnal anekdot untuk memperkaya narasi E-Rapor semester.
        </p>
      </div>
    </div>
  );
};

