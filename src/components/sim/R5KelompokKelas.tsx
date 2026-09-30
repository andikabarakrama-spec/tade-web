import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Student, Teacher, SchoolProfile, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  UserCheck, 
  Layers, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Lock, 
  Building, 
  Phone,
  Edit3
} from 'lucide-react';

// Canonical System Roles supported by the institution
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

const MANAGEMENT_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KETUA_YAYASAN',
  'KEPALA_SEKOLAH'
] as const;

interface RombelGroup {
  name: string;
  code: string;
  ageCategory: string;
  totalStudents: number;
  activeStudents: number;
  students: Student[];
  homeroomTeacher?: Teacher;
  genderRatio: { L: number; P: number };
}

export const R5KelompokKelas: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // Canonical Identity & RBAC Resolution (Strictly Fail-Closed)
  // activeRole from useAuth() validated against CANONICAL_ROLES is the authoritative source of truth.
  // NO VALID ACTIVE ROLE / NO VALID AUTHENTICATED UID = DEFAULT DENY.
  const verifiedActiveRole: UserRole | null = useMemo(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  const isManagementRole = useMemo(() => {
    return Boolean(verifiedActiveRole && MANAGEMENT_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  const isGuruRole = useMemo(() => {
    return Boolean(verifiedActiveRole === 'GURU');
  }, [verifiedActiveRole]);

  // Access Boundary: Only Management and Educators have legitimate access to R5 Rombel Management
  const canAccessR5 = useMemo(() => {
    return isManagementRole || isGuruRole;
  }, [isManagementRole, isGuruRole]);

  // FAIL CLOSED: Only authenticated users with verified management roles can manage rombel & homeroom assignments.
  const canManageRombel = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN'].includes(verifiedActiveRole)
  );

  // Authentic actor name strictly derived from session; zero synthetic/hardcoded actors
  const actorName = useMemo<string>(() => {
    const cleanProfileName = (userProfile?.nama || userProfile?.name)?.trim();
    if (cleanProfileName) return cleanProfileName;
    const cleanDisplayName = currentUser?.displayName?.trim();
    if (cleanDisplayName) return cleanDisplayName;
    const cleanEmail = currentUser?.email?.trim();
    if (cleanEmail) return cleanEmail;
    return currentUser?.uid ? `User (${currentUser.uid.slice(0, 8)})` : '';
  }, [currentUser?.uid, currentUser?.displayName, currentUser?.email, userProfile?.nama, userProfile?.name]);

  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Active Selected View
  const [selectedRombelCode, setSelectedRombelCode] = useState<string>('ALL');
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>('');

  // Modal / Form State for Assigning Homeroom Teacher
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [targetRombelName, setTargetRombelName] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  // UI Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Authoritative Teacher Resolution for Logged-In User
  const matchedTeacher = useMemo<Teacher | null>(() => {
    if (!currentUser?.uid) return null;
    return (
      teachers.find(t =>
        (currentUser.uid && t.id === currentUser.uid) ||
        (currentUser.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (userProfile?.email && t.email && t.email.toLowerCase() === userProfile.email.toLowerCase()) ||
        (userProfile?.nama && t.name && t.name.toLowerCase() === userProfile.nama.toLowerCase()) ||
        (userProfile?.name && t.name && t.name.toLowerCase() === userProfile.name.toLowerCase())
      ) || null
    );
  }, [teachers, currentUser?.uid, currentUser?.email, userProfile?.email, userProfile?.nama, userProfile?.name]);

  // Load Real Data from DataService with Pre-Query Authorization
  const loadRealData = useCallback(async () => {
    // 1. Pre-query authorization gate: Fail closed for unauthorized sessions
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR5) {
      setStudents([]);
      setTeachers([]);
      setSchoolProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (isGuruRole) {
        // Educator access:
        // 1. Resolve teacher identity to determine assignedClass
        const allTeachers = await DataService.getTeachers();
        const selfTeacher = (allTeachers || []).find(t =>
          (currentUser.uid && t.id === currentUser.uid) ||
          (currentUser.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (userProfile?.email && t.email && t.email.toLowerCase() === userProfile.email.toLowerCase()) ||
          (userProfile?.nama && t.name && t.name.toLowerCase() === userProfile.nama.toLowerCase()) ||
          (userProfile?.name && t.name && t.name.toLowerCase() === userProfile.name.toLowerCase())
        );

        if (!selfTeacher || !selfTeacher.assignedClass) {
          setStudents([]);
          setTeachers(selfTeacher ? [selfTeacher] : []);
          setSchoolProfile(null);
          setFeedback({
            type: 'error',
            message: 'Akun Anda terdaftar sebagai Guru, namun kelas binaan belum terpetakan. Hubungi Administrator untuk penugasan rombel.'
          });
          return;
        }

        // 2. Fetch scoped students and school profile
        const [fetchedStudents, fetchedProfile] = await Promise.all([
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            currentUser.email || userProfile?.email
          ),
          DataService.getSchoolProfile()
        ]);

        // STRICT SCOPING: Only students belonging to the teacher's assignedClass enter state
        const scopedStudents = (fetchedStudents || []).filter(
          s => s.classGroup === selfTeacher.assignedClass
        );

        setStudents(scopedStudents);
        setTeachers([selfTeacher]);
        setSchoolProfile(fetchedProfile || null);
      } else if (isManagementRole) {
        // Institutional Leadership access: load full institutional dataset
        const [fetchedStudents, fetchedTeachers, fetchedProfile] = await Promise.all([
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            currentUser.email || userProfile?.email
          ),
          DataService.getTeachers(),
          DataService.getSchoolProfile()
        ]);

        setStudents(fetchedStudents || []);
        setTeachers(fetchedTeachers || []);
        setSchoolProfile(fetchedProfile || null);
      }
    } catch (err: any) {
      console.error('Error loading R5 data:', err);
      setFeedback({
        type: 'error',
        message: 'Gagal memuat data rombel dan tenaga pendidik dari database.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    currentUser?.uid,
    currentUser?.email,
    userProfile?.email,
    userProfile?.nama,
    userProfile?.name,
    verifiedActiveRole,
    canAccessR5,
    isGuruRole,
    isManagementRole
  ]);

  useEffect(() => {
    loadRealData();
  }, [loadRealData]);

  // Aggregate Rombels dynamically from Student records + Standard PAUD curriculum structure
  const rombelGroups: RombelGroup[] = useMemo(() => {
    if (isGuruRole && matchedTeacher?.assignedClass) {
      // For Guru, strictly aggregate their assigned class only
      const groupName = matchedTeacher.assignedClass;
      const groupStudents = students.filter(s => s.classGroup === groupName);
      const activeStudents = groupStudents.filter(s => !s.status || s.status === 'Aktif');

      let code = groupName.replace('Kelompok ', '').trim();
      if (groupName.toLowerCase().includes('tpa')) code = 'TPA';

      let ageCategory = 'Usia 4 - 5 Tahun (TK-A)';
      if (groupName.includes('B1') || groupName.includes('B2') || groupName.includes('B')) {
        ageCategory = 'Usia 5 - 6 Tahun (TK-B)';
      } else if (groupName.toLowerCase().includes('tpa') || groupName.toLowerCase().includes('kb')) {
        ageCategory = 'Usia 2.5 - 4 Tahun (PAUD/KB/TPA)';
      }

      const maleCount = groupStudents.filter(s => s.gender === 'L').length;
      const femaleCount = groupStudents.filter(s => s.gender === 'P').length;

      return [
        {
          name: groupName,
          code,
          ageCategory,
          totalStudents: groupStudents.length,
          activeStudents: activeStudents.length,
          students: groupStudents,
          homeroomTeacher: matchedTeacher,
          genderRatio: { L: maleCount, P: femaleCount }
        }
      ];
    }

    // For Management roles: aggregate all institutional rombels
    const dynamicClassNames = Array.from(
      new Set(students.map(s => s.classGroup).filter(Boolean))
    );

    const standardGroups = ['Kelompok A1', 'Kelompok A2', 'Kelompok B1', 'Kelompok B2', 'PAUD TPA'];
    const allGroupNames = Array.from(new Set([...standardGroups, ...dynamicClassNames])).sort();

    return allGroupNames.map(groupName => {
      const groupStudents = students.filter(s => s.classGroup === groupName);
      const activeStudents = groupStudents.filter(s => !s.status || s.status === 'Aktif');

      let code = groupName.replace('Kelompok ', '').trim();
      if (groupName.toLowerCase().includes('tpa')) code = 'TPA';

      let ageCategory = 'Usia 4 - 5 Tahun (TK-A)';
      if (groupName.includes('B1') || groupName.includes('B2') || groupName.includes('B')) {
        ageCategory = 'Usia 5 - 6 Tahun (TK-B)';
      } else if (groupName.toLowerCase().includes('tpa') || groupName.toLowerCase().includes('kb')) {
        ageCategory = 'Usia 2.5 - 4 Tahun (PAUD/KB/TPA)';
      }

      const homeroomTeacher = teachers.find(
        t => (t.isWaliKelas || t.assignedClass) && t.assignedClass === groupName
      );

      const maleCount = groupStudents.filter(s => s.gender === 'L').length;
      const femaleCount = groupStudents.filter(s => s.gender === 'P').length;

      return {
        name: groupName,
        code,
        ageCategory,
        totalStudents: groupStudents.length,
        activeStudents: activeStudents.length,
        students: groupStudents,
        homeroomTeacher,
        genderRatio: { L: maleCount, P: femaleCount }
      };
    });
  }, [students, teachers, isGuruRole, matchedTeacher]);

  // Overall Statistics from actual aggregation
  const stats = useMemo(() => {
    const totalRombels = rombelGroups.length;
    const totalStudentsInRombels = students.length;
    const totalActiveStudents = students.filter(s => !s.status || s.status === 'Aktif').length;
    const assignedWaliCount = rombelGroups.filter(r => !!r.homeroomTeacher).length;

    return {
      totalRombels,
      totalStudentsInRombels,
      totalActiveStudents,
      assignedWaliCount,
      unassignedWaliCount: Math.max(0, totalRombels - assignedWaliCount)
    };
  }, [rombelGroups, students]);

  // Active rombel details
  const activeRombelDetail = useMemo(() => {
    if (selectedRombelCode === 'ALL') return null;
    return rombelGroups.find(r => r.code === selectedRombelCode || r.name === selectedRombelCode) || null;
  }, [selectedRombelCode, rombelGroups]);

  // Filtered students for active rombel view or global search
  const displayedStudents = useMemo(() => {
    let list: Student[] = [];
    if (activeRombelDetail) {
      list = activeRombelDetail.students;
    } else {
      list = students;
    }

    if (searchStudentQuery.trim()) {
      const q = searchStudentQuery.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.nis?.toLowerCase().includes(q) || 
        (s.nickname && s.nickname.toLowerCase().includes(q)) ||
        s.parentName?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeRombelDetail, students, searchStudentQuery]);

  // Open modal to assign homeroom teacher
  const handleOpenAssignModal = (rombelName: string) => {
    if (!canManageRombel || isSaving) return;
    const currentRombel = rombelGroups.find(r => r.name === rombelName);
    if (!currentRombel) {
      setFeedback({
        type: 'error',
        message: 'Kelompok belajar tidak ditemukan.'
      });
      return;
    }
    setTargetRombelName(rombelName);
    setSelectedTeacherId(currentRombel?.homeroomTeacher?.id || '');
    setAssignModalOpen(true);
  };

  // Commit Homeroom Teacher Assignment to DataService with Strict Integrity & Fail-Closed RBAC
  const handleSaveHomeroomAssignment = async () => {
    // 1. Double-submit guard
    if (isSaving) return;

    // 2. Strict Fail-Closed Authorization Guard
    if (!currentUser?.uid || !verifiedActiveRole || !canManageRombel) {
      setFeedback({
        type: 'error',
        message: 'Akses Ditolak: Hanya Super Admin, Admin, dan Kepala Sekolah yang berwenang menetapkan Wali Kelas.'
      });
      return;
    }

    // 3. Target Rombel validation
    if (!targetRombelName || !targetRombelName.trim()) {
      setFeedback({
        type: 'error',
        message: 'Validasi Gagal: Kelompok belajar target belum dipilih.'
      });
      return;
    }

    // 4. Teacher integrity validation from R4 SSOT
    let targetTeacher: Teacher | undefined;
    if (selectedTeacherId) {
      targetTeacher = teachers.find(t => t.id === selectedTeacherId);
      if (!targetTeacher) {
        setFeedback({
          type: 'error',
          message: 'Validasi Gagal: Tenaga pendidik yang dipilih tidak ditemukan dalam Master Data Guru (R4).'
        });
        return;
      }
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      // 1. If any teacher was previously assigned to this targetRombelName, unassign them first if changed
      for (const t of teachers) {
        if (t.assignedClass === targetRombelName && t.id !== selectedTeacherId) {
          const unassignedTeacher: Teacher = {
            ...t,
            isWaliKelas: false,
            assignedClass: undefined
          };
          await DataService.saveTeacher(unassignedTeacher);
        }
      }

      // 2. If a new teacher is selected, assign them to targetRombelName
      if (selectedTeacherId && targetTeacher) {
        const assignedTeacher: Teacher = {
          ...targetTeacher,
          isWaliKelas: true,
          assignedClass: targetRombelName,
          title: targetTeacher.title && targetTeacher.title.includes('Wali Kelas') 
            ? `Wali Kelas ${targetRombelName}` 
            : (targetTeacher.title || `Wali Kelas ${targetRombelName}`)
        };
        await DataService.saveTeacher(assignedTeacher);
      }

      // 3. Reload teachers from DataService to guarantee fresh sync
      const freshTeachers = await DataService.getTeachers();
      setTeachers(freshTeachers || []);

      // 4. Canonical Audit Logging (Authentic actor identity only)
      const actionDetail = selectedTeacherId && targetTeacher
        ? `Menetapkan ${targetTeacher.name} sebagai Wali Kelas ${targetRombelName}`
        : `Mengosongkan penugasan Wali Kelas untuk ${targetRombelName}`;

      if (actorName && verifiedActiveRole) {
        await DataService.logAction(
          actorName,
          verifiedActiveRole,
          'ASSIGN_HOMEROOM',
          actionDetail
        ).catch((auditErr) => {
          console.warn('Non-blocking audit log warning:', auditErr);
        });
      }

      setAssignModalOpen(false);
      setFeedback({
        type: 'success',
        message: `Penugasan Wali Kelas untuk ${targetRombelName} berhasil diperbarui di database.`
      });
    } catch (err: any) {
      console.error('Error saving homeroom assignment:', err);
      setFeedback({
        type: 'error',
        message: `Gagal memperbarui penugasan wali kelas: ${err?.message || 'Terjadi kesalahan sistem.'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // FAIL-CLOSED ACCESS DENIED CONTAINER
  // ==========================================
  // Unauthorized users (e.g. WALI_MURID, CALON_WALI_MURID, ALUMNI_FAMILY, KEUANGAN, unauthenticated)
  // NEVER render the rombel cards, pupil rosters, or parent phone numbers.
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessR5) {
    return (
      <div
        id="r5-access-denied-container"
        className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-5"
      >
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-rose-700" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            KEAMANAN DATA KELAS & ROMBEL
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Akses Data Kelompok Belajar Dibatasi
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            {!currentUser?.uid
              ? 'Sesi Anda belum terautentikasi. Silakan masuk terlebih dahulu untuk mengakses data rombel dan kelompok belajar.'
              : !verifiedActiveRole
              ? 'Peran akun tidak terverifikasi secara sah dalam sistem kanonikal TK Asy Syifa.'
              : `Peran Anda (${verifiedActiveRole}) tidak memiliki wewenang untuk mengakses data struktural kelompok belajar atau daftar siswa sekolah.`}
          </p>
        </div>
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/sim"
            id="btn-r5-back-sim"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Kembali ke Beranda SIM
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="r5-rombel-container" className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Module R5 • Kelompok & Rombel Belajar
            </span>
            <span
              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                isManagementRole
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : isGuruRole && matchedTeacher
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {isManagementRole
                ? 'Mode Manajemen (Akses Penuh)'
                : isGuruRole && matchedTeacher
                ? `Mode Wali Kelas (${matchedTeacher.assignedClass || matchedTeacher.name})`
                : 'Mode Guru (Identitas Terbatas)'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Manajemen Kelas & Rombongan Belajar (Rombel)
          </h1>
          <p className="text-stone-500 text-xs mt-1">
            Pengorganisasian kelompok belajar siswa aktif, penugasan resmi Wali Kelas, dan pemantauan rasio santri PAUD/TK.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadRealData}
            disabled={isLoading || isSaving}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-2xl flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            title="Segarkan Data Real-Time"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          id="r5-feedback-banner"
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold">Total Rombel Aktif</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalRombels} Kelompok</div>
          <div className="text-[11px] text-stone-400 mt-1">TK-A, TK-B & PAUD TPA</div>
        </div>

        <div className="bg-emerald-50/60 p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-bold">Total Siswa Terdaftar</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-950">{stats.totalStudentsInRombels} Anak</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {stats.totalActiveStudents} Berstatus Aktif
          </div>
        </div>

        <div className="bg-sky-50/60 p-5 rounded-3xl border border-sky-200 shadow-xs">
          <div className="flex items-center justify-between text-sky-800 mb-1">
            <span className="text-xs font-bold">Wali Kelas Ditetapkan</span>
            <UserCheck className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl font-bold text-sky-950">{stats.assignedWaliCount} Guru</div>
          <div className="text-[11px] text-sky-700 font-semibold mt-1">
            {stats.unassignedWaliCount === 0 ? 'Semua rombel terpenuhi' : `${stats.unassignedWaliCount} rombel belum ada wali`}
          </div>
        </div>

        <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-xs font-bold">Lembaga</span>
            <Building className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {schoolProfile?.name || 'TK Islam Terpadu Asy-Syifa'}
          </div>
          <div className="text-[10px] text-stone-500 mt-1">
            NPSN: {schoolProfile?.npsn || '69900123'} • Akreditasi: {schoolProfile?.akreditasi || 'A'}
          </div>
        </div>
      </div>

      {/* Rombel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-stone-200">
            <RefreshCw className="w-7 h-7 text-emerald-800 animate-spin" />
            <p className="text-xs font-bold text-stone-600">Memuat kelompok belajar & data wali kelas...</p>
          </div>
        ) : rombelGroups.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-stone-200 text-stone-500">
            <Layers className="w-8 h-8 text-stone-300" />
            <p className="font-bold text-xs">Belum ada kelompok rombel terdaftar.</p>
          </div>
        ) : (
          rombelGroups.map((rombel) => {
            const isSelected = selectedRombelCode === rombel.code;
            return (
              <div 
                key={rombel.name} 
                className={`bg-white p-6 rounded-3xl border transition shadow-xs flex flex-col justify-between ${
                  isSelected 
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Header Badge */}
                  <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center shadow-xs">
                        {rombel.code}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{rombel.name}</h3>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {rombel.ageCategory}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info List */}
                  <div className="space-y-2.5 text-xs text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Wali Kelas:
                      </span>
                      <span className="font-bold text-slate-900 text-right">
                        {rombel.homeroomTeacher ? (
                          <span className="text-emerald-900">{rombel.homeroomTeacher.name}</span>
                        ) : (
                          <span className="text-amber-600 italic">Belum Ditentukan</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                        <Users className="w-3.5 h-3.5 text-sky-600" /> Jumlah Siswa:
                      </span>
                      <span className="font-bold text-slate-900">
                        {rombel.totalStudents} Siswa ({rombel.activeStudents} Aktif)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Rasio Gender:
                      </span>
                      <span className="font-bold text-stone-700">
                        {rombel.genderRatio.L} Laki-laki / {rombel.genderRatio.P} Perempuan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRombelCode(isSelected ? 'ALL' : rombel.code)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    {isSelected ? 'Tutup Daftar' : 'Lihat Siswa'}
                  </button>

                  {canManageRombel && (
                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(rombel.name)}
                      disabled={isSaving}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Atur Wali
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Student List Section under selected Rombel */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              {activeRombelDetail 
                ? `Daftar Siswa — ${activeRombelDetail.name}` 
                : isGuruRole 
                ? `Daftar Siswa — Rombel Pengampu (${matchedTeacher?.assignedClass || 'Kelas Guru'})`
                : 'Daftar Seluruh Siswa Berdasarkan Rombel'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {activeRombelDetail 
                ? `Menampilkan ${displayedStudents.length} siswa pada kelompok ${activeRombelDetail.name}.`
                : isGuruRole
                ? `Menampilkan ${displayedStudents.length} siswa pada rombel binaan Anda.`
                : `Menampilkan total ${displayedStudents.length} siswa terdaftar di semua rombel.`
              }
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, NIS, orang tua..."
                value={searchStudentQuery}
                onChange={e => setSearchStudentQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {selectedRombelCode !== 'ALL' && isManagementRole && (
              <button
                type="button"
                onClick={() => setSelectedRombelCode('ALL')}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tampilkan Semua Rombel
              </button>
            )}
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3">NIS</th>
                <th className="p-3">Nama Lengkap & Panggilan</th>
                <th className="p-3">Kelompok Rombel</th>
                <th className="p-3">L/P</th>
                <th className="p-3">Nama Orang Tua</th>
                <th className="p-3">Kontak Wali</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-800" />
                      <span className="text-xs font-medium text-stone-600">Memuat data rombel dan siswa...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-stone-300" />
                      <p className="font-bold">Tidak ada data siswa ditemukan.</p>
                      <p className="text-[11px] text-stone-400">
                        {searchStudentQuery 
                          ? 'Coba ubah kata kunci pencarian Anda.' 
                          : 'Belum ada siswa yang ditugaskan pada rombel ini di Master Data Siswa.'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-stone-50 transition">
                    <td className="p-3 text-center text-stone-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-mono text-stone-600">{s.nis || '-'}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      {s.nickname && (
                        <div className="text-[10px] text-stone-500">Panggilan: {s.nickname}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {s.classGroup}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-stone-600">{s.gender}</td>
                    <td className="p-3 font-medium text-stone-800">{s.parentName || '-'}</td>
                    <td className="p-3 text-stone-600 font-mono text-[11px]">
                      {s.parentPhone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" /> {s.parentPhone}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'Aktif' || !s.status
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {s.status || 'Aktif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Homeroom Assignment Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Penetapan Wali Kelas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                disabled={isSaving}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold disabled:opacity-50 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-bold mb-1">
                  Kelompok Rombel:
                </label>
                <div className="px-3.5 py-2.5 bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-emerald-200">
                  {targetRombelName}
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">
                  Pilih Guru / PTK sebagai Wali Kelas:
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Kosongkan / Belum Ditetapkan --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.position || 'Guru'}{t.assignedClass ? ` • Saat ini di ${t.assignedClass}` : ''})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-400 mt-1">
                  *Perubahan akan otomatis memperbarui metadata guru pada Master Data Guru (R4).
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveHomeroomAssignment}
                disabled={isSaving}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  'Simpan Penugasan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default R5KelompokKelas;
