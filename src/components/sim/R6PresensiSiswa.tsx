import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PresensiRecord, Student, Teacher, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { 
  CalendarCheck, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Search, 
  CheckCheck,
  RefreshCw,
  Lock,
  ShieldAlert
} from 'lucide-react';

// Canonical System Roles supported by the institution
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

// Operational management roles with institution-wide presensi authority
const MANAGEMENT_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH'
];

// Roles authorized to access module R6 Presensi Siswa (view or manage)
const PRESENSI_AUTHORIZED_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KETUA_YAYASAN',
  'GURU',
  'WALI_MURID'
];

// Operational mutation roles for attendance records
const PRESENSI_MUTATION_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'GURU'
];

export const R6PresensiSiswa: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  
  // 1. Authoritative Fail-Closed Active Role Determination
  // activeRole from useAuth() is the sole runtime authority.
  // NO VALID ACTIVE ROLE = DEFAULT DENY. Zero fallback to userProfile.role as authority.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Module access boundary: only authorized institutional roles may view attendance
  const canAccessModule = useMemo<boolean>(() => {
    return Boolean(
      currentUser?.uid &&
      verifiedActiveRole &&
      PRESENSI_AUTHORIZED_ROLES.includes(verifiedActiveRole)
    );
  }, [currentUser?.uid, verifiedActiveRole]);

  // Management roles retain institution-wide attendance management scope
  const isManagementRole = useMemo(() => {
    return Boolean(
      currentUser?.uid &&
      verifiedActiveRole &&
      MANAGEMENT_ROLES.includes(verifiedActiveRole)
    );
  }, [currentUser?.uid, verifiedActiveRole]);

  // Guru role is subject to homeroom class-boundary enforcement
  const isGuruRole = useMemo(() => {
    return Boolean(
      currentUser?.uid &&
      verifiedActiveRole === 'GURU'
    );
  }, [currentUser?.uid, verifiedActiveRole]);

  // Wali Murid is restricted to read-only view of their linked children
  const isParent = useMemo(() => {
    return Boolean(
      currentUser?.uid &&
      verifiedActiveRole === 'WALI_MURID'
    );
  }, [currentUser?.uid, verifiedActiveRole]);

  // Authentic Identity Resolution: strictly use authenticated identity contracts without synthetic fallbacks
  const authenticActor = useMemo(() => {
    return (
      userProfile?.nama?.trim() ||
      userProfile?.name?.trim() ||
      currentUser?.displayName?.trim() ||
      currentUser?.email?.trim() ||
      null
    );
  }, [userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email]);

  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [presensiList, setPresensiList] = useState<PresensiRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Filter & Form States
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // In-memory working draft for the selected date: map of studentId -> { status, notes, checkInTime }
  const [dailyDraft, setDailyDraft] = useState<Record<string, {
    id?: string;
    status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
    notes: string;
    checkInTime?: string;
  }>>({});

  // UI Feedback States
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Authoritative Teacher Resolution from R4/R5 Master Teachers List
  const matchedTeacher = useMemo<Teacher | null>(() => {
    if (!currentUser?.uid && !currentUser?.email && !userProfile?.email && !userProfile?.nama && !userProfile?.name) return null;
    return teachers.find(t => 
      (currentUser?.uid && t.id === currentUser.uid) ||
      (currentUser?.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (userProfile?.email && t.email && t.email.toLowerCase() === userProfile.email.toLowerCase()) ||
      (userProfile?.nama && t.name && t.name.toLowerCase() === userProfile.nama.toLowerCase()) ||
      (userProfile?.name && t.name && t.name.toLowerCase() === userProfile.name.toLowerCase())
    ) || null;
  }, [teachers, currentUser?.uid, currentUser?.email, userProfile?.email, userProfile?.nama, userProfile?.name]);

  // Authoritative Assigned Class for Teacher: R4/R5 Teacher record has priority, fallback to userProfile.assignedClass
  const teacherAssignedClass: string | null = useMemo(() => {
    const rawClass = matchedTeacher?.assignedClass || userProfile?.assignedClass || null;
    return rawClass && rawClass.trim() !== '' ? rawClass.trim() : null;
  }, [matchedTeacher, userProfile?.assignedClass]);

  const hasValidTeacherClass = Boolean(teacherAssignedClass);

  // Effective mutation authority:
  // - Management (SUPER_ADMIN, ADMIN, KEPALA_SEKOLAH): authorized institution-wide
  // - Guru: authorized ONLY if they possess a valid assignedClass established in R5
  // - Other / unauthenticated / unassigned roles / parents: strictly DENIED
  const canEditPresensi: boolean = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    PRESENSI_MUTATION_ROLES.includes(verifiedActiveRole) &&
    (isManagementRole || (isGuruRole && hasValidTeacherClass))
  );

  // Load Real Data from DataService with Hard Pre-Query Gate
  const loadData = useCallback(async () => {
    // Hard Pre-Query Gate: fail-closed if unauthenticated, invalid active role, or unauthorized module access
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) {
      setIsLoading(false);
      setStudents([]);
      setPresensiList([]);
      setTeachers([]);
      return;
    }

    setIsLoading(true);
    try {
      if (isParent) {
        // PRE-QUERY ISOLATION FOR WALI MURID:
        // Load only the parent's linked students via DataService.getStudents (scoped by parentUid)
        const parentStudents = await DataService.getStudents(
          verifiedActiveRole,
          currentUser.uid,
          currentUser.email || userProfile?.email
        );
        const authorizedStudentIds = new Set((parentStudents || []).map(s => s.id));

        // Load attendance and filter strictly to parent's authorized student records
        const allPresensi = await DataService.getPresensi();
        const scopedPresensi = (allPresensi || []).filter(p => authorizedStudentIds.has(p.studentId));

        setStudents(parentStudents || []);
        setPresensiList(scopedPresensi);
        setTeachers([]);
      } else {
        // Academic & Management Scope:
        const [fetchedStudents, fetchedPresensi, fetchedTeachers] = await Promise.all([
          DataService.getStudents(verifiedActiveRole, currentUser.uid, currentUser.email || userProfile?.email),
          DataService.getPresensi(),
          (isManagementRole || isGuruRole) ? DataService.getTeachers() : Promise.resolve([])
        ]);

        setStudents(fetchedStudents || []);
        setPresensiList(fetchedPresensi || []);
        setTeachers(fetchedTeachers || []);
      }
    } catch (err: any) {
      console.error('Error loading presensi data:', err);
      setFeedback({
        type: 'error',
        message: 'Gagal memuat data presensi dan siswa dari database.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [canAccessModule, currentUser?.email, currentUser?.uid, isGuruRole, isManagementRole, isParent, userProfile?.email, verifiedActiveRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-enforce teacher class selection on load or role resolution
  useEffect(() => {
    if (isGuruRole && teacherAssignedClass) {
      setSelectedClass(teacherAssignedClass);
    }
  }, [isGuruRole, teacherAssignedClass]);

  // Sync working daily draft whenever selectedDate or presensiList or students change
  useEffect(() => {
    const draft: Record<string, { id?: string; status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha'; notes: string; checkInTime?: string }> = {};
    
    // Default all active students to their existing record for selectedDate, or 'Hadir' as standard default
    students.forEach(st => {
      const existing = presensiList.find(p => p.studentId === st.id && p.date === selectedDate);
      if (existing) {
        draft[st.id] = {
          id: existing.id,
          status: existing.status,
          notes: existing.notes || '',
          checkInTime: existing.checkInTime || '07:30'
        };
      } else {
        draft[st.id] = {
          status: 'Hadir',
          notes: '',
          checkInTime: '07:30'
        };
      }
    });
    
    setDailyDraft(draft);
  }, [selectedDate, presensiList, students]);

  // Dynamic class groups from actual student data
  const availableClassGroups = useMemo(() => {
    if (isGuruRole) {
      return teacherAssignedClass ? [teacherAssignedClass] : [];
    }
    const groups = Array.from(new Set(students.map(s => s.classGroup).filter(Boolean)));
    return groups.sort();
  }, [students, isGuruRole, teacherAssignedClass]);

  // Filtered student list respecting strict teacher boundary & active filters
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Status filter: only active students
      if (s.status && s.status !== 'Aktif') return false;

      // Class group filter:
      // If GURU, strictly restrict to their assignedClass established in R5
      if (isGuruRole) {
        if (!teacherAssignedClass) return false;
        if (s.classGroup !== teacherAssignedClass) return false;
      } else if (selectedClass !== 'Semua' && s.classGroup !== selectedClass) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchNis = s.nis.toLowerCase().includes(q);
        const matchNick = s.nickname ? s.nickname.toLowerCase().includes(q) : false;
        if (!matchName && !matchNis && !matchNick) return false;
      }

      return true;
    });
  }, [students, isGuruRole, teacherAssignedClass, selectedClass, searchQuery]);

  // Attendance metrics summary calculated purely from actual data for the selected date & filter
  const summary = useMemo(() => {
    const total = filteredStudents.length;
    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpha = 0;

    filteredStudents.forEach(st => {
      const current = dailyDraft[st.id];
      const stStatus = current ? current.status : 'Hadir';
      if (stStatus === 'Hadir') hadir++;
      else if (stStatus === 'Izin') izin++;
      else if (stStatus === 'Sakit') sakit++;
      else if (stStatus === 'Alpha') alpha++;
    });

    const percentHadir = total > 0 ? Math.round((hadir / total) * 100) : 0;

    return { total, hadir, izin, sakit, alpha, percentHadir };
  }, [filteredStudents, dailyDraft]);

  // Handle individual status change in draft
  const handleStatusChange = (studentId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => {
    if (isSaving) return;
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) return;
    if (!canEditPresensi || !PRESENSI_MUTATION_ROLES.includes(verifiedActiveRole)) return;

    // Enforce class boundary for Guru
    if (isGuruRole) {
      if (!hasValidTeacherClass || !teacherAssignedClass) return;
      const targetStudent = students.find(s => s.id === studentId);
      if (!targetStudent || targetStudent.classGroup !== teacherAssignedClass) {
        return;
      }
    }

    setDailyDraft(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        checkInTime: prev[studentId]?.checkInTime || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    }));
  };

  // Handle individual notes change in draft
  const handleNotesChange = (studentId: string, notes: string) => {
    if (isSaving) return;
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) return;
    if (!canEditPresensi || !PRESENSI_MUTATION_ROLES.includes(verifiedActiveRole)) return;

    // Enforce class boundary for Guru
    if (isGuruRole) {
      if (!hasValidTeacherClass || !teacherAssignedClass) return;
      const targetStudent = students.find(s => s.id === studentId);
      if (!targetStudent || targetStudent.classGroup !== teacherAssignedClass) {
        return;
      }
    }

    setDailyDraft(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes
      }
    }));
  };

  // Quick Action: Mark all filtered students as 'Hadir'
  const handleMarkAllHadir = () => {
    if (isSaving) return;
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) return;
    if (!canEditPresensi || !PRESENSI_MUTATION_ROLES.includes(verifiedActiveRole)) return;

    if (isGuruRole && (!hasValidTeacherClass || !teacherAssignedClass || selectedClass !== teacherAssignedClass)) {
      return;
    }

    setDailyDraft(prev => {
      const updated = { ...prev };
      filteredStudents.forEach(st => {
        if (isGuruRole && st.classGroup !== teacherAssignedClass) return;
        updated[st.id] = {
          ...updated[st.id],
          status: 'Hadir'
        };
      });
      return updated;
    });

    setFeedback({
      type: 'success',
      message: `Semua ${filteredStudents.length} siswa dalam tampilan ditandai 'Hadir' dalam draft. Silakan klik 'Simpan Presensi Harian' untuk commit.`
    });
  };

  // Real Save Daily Attendance to DataService with Strict Integrity, Sequential Execution & Canonical Audit
  const handleSaveAll = async () => {
    // 1. Anti double-submit guard
    if (isSaving) return;

    // 2. Authoritative Fail-Closed Session & RBAC Guard
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Sesi otentikasi tidak valid atau belum terverifikasi.'
      });
      return;
    }

    if (!canEditPresensi || !PRESENSI_MUTATION_ROLES.includes(verifiedActiveRole)) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Anda tidak memiliki izin untuk menyimpan data presensi.'
      });
      return;
    }

    // 3. Authentic Actor Identity Check (No Synthetic Identity)
    if (!authenticActor) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Identitas sesi autentik tidak valid untuk audit.'
      });
      return;
    }

    // 4. Teacher Class-Boundary Enforcement
    if (isGuruRole) {
      if (!hasValidTeacherClass || !teacherAssignedClass) {
        setFeedback({
          type: 'error',
          message: 'Akses ditolak: Anda belum memiliki penugasan Wali Kelas di Modul R5.'
        });
        return;
      }

      if (selectedClass !== teacherAssignedClass || selectedClass === 'Semua') {
        setFeedback({
          type: 'error',
          message: `Pelanggaran Otorisasi: Guru hanya berwenang mencatat presensi untuk kelas binaan (${teacherAssignedClass}).`
        });
        return;
      }
    }

    // 5. Validate filtered roster
    if (filteredStudents.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Tidak ada siswa yang dipilih untuk disimpan.'
      });
      return;
    }

    // 6. Build and validate records to save
    const recordsToSave: PresensiRecord[] = [];

    for (const st of filteredStudents) {
      // Integrity check: student class must match teacher's assigned class for GURU
      if (isGuruRole && st.classGroup !== teacherAssignedClass) {
        setFeedback({
          type: 'error',
          message: `Pelanggaran Integritas: Siswa ${st.name} bukan merupakan anggota ${teacherAssignedClass}.`
        });
        return;
      }

      const draft = dailyDraft[st.id];
      const status = draft?.status || 'Hadir';
      const notes = draft?.notes || '';
      const checkInTime = draft?.checkInTime || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      // Deterministic ID preventing duplicates: use existing ID or standardized canonical format (prs-YYYY-MM-DD-studentId)
      const existingRecord = presensiList.find(p => p.studentId === st.id && p.date === selectedDate);
      const recordId = existingRecord?.id || `prs-${selectedDate}-${st.id}`;

      const record: PresensiRecord = {
        id: recordId,
        studentId: st.id,
        studentName: st.name,
        classGroup: st.classGroup,
        date: selectedDate,
        status,
        notes: notes.trim() ? notes.trim() : undefined,
        checkInTime
      };

      recordsToSave.push(record);
    }

    setIsSaving(true);
    setFeedback(null);

    let savedCount = 0;

    try {
      // 7. Sequential bulk persistence (preventing concurrent local read-modify-write cache clobbering)
      for (const record of recordsToSave) {
        await DataService.savePresensi(record);
        savedCount++;
      }

      // 8. Reload fresh presensi data from DataService
      const freshPresensi = await DataService.getPresensi();
      if (isParent) {
        const authorizedStudentIds = new Set(students.map(s => s.id));
        setPresensiList((freshPresensi || []).filter(p => authorizedStudentIds.has(p.studentId)));
      } else {
        setPresensiList(freshPresensi || []);
      }

      // 9. Canonical Audit Logging (Non-blocking to UX, logged only on verified complete success)
      const effectiveClassName = isGuruRole ? teacherAssignedClass : selectedClass;
      const auditDetail = `Mencatat presensi ${recordsToSave.length} siswa kelas ${effectiveClassName} tanggal ${selectedDate}`;

      await DataService.logAction(
        authenticActor,
        verifiedActiveRole,
        'SAVE_PRESENSI_BATCH',
        auditDetail
      ).catch(auditErr => {
        console.warn('Non-blocking audit log warning:', auditErr);
      });

      setFeedback({
        type: 'success',
        message: `Berhasil menyimpan presensi ${recordsToSave.length} siswa untuk tanggal ${selectedDate} ke database.`
      });
    } catch (err: any) {
      console.error('Error saving presensi batch:', err);

      // Attempt reloading to capture whatever was partially persisted
      try {
        const partialFresh = await DataService.getPresensi();
        if (isParent) {
          const authorizedStudentIds = new Set(students.map(s => s.id));
          setPresensiList((partialFresh || []).filter(p => authorizedStudentIds.has(p.studentId)));
        } else {
          setPresensiList(partialFresh || []);
        }
      } catch (_) {
        // Ignore secondary fetch failure
      }

      if (savedCount > 0) {
        setFeedback({
          type: 'error',
          message: `Presensi tersimpan sebagian (${savedCount} dari ${recordsToSave.length} siswa). Terjadi kegagalan pada proses berikutnya: ${err?.message || 'Gangguan koneksi database.'}`
        });
      } else {
        setFeedback({
          type: 'error',
          message: `Gagal menyimpan presensi: ${err?.message || 'Terjadi kesalahan pada database.'}`
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // FAIL-CLOSED ACCESS DENIED SCREEN
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) {
    return (
      <div id="r6-access-denied" className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-200 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              Akses Dibatasi • Fail-Closed Security Gate
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Akses Modul Presensi Siswa Dibatasi
            </h2>
            <p className="text-sm text-stone-600 max-w-lg mx-auto">
              Modul R6 Presensi Siswa hanya dapat diakses oleh Manajemen Sekolah, Dewan Guru, dan Wali Murid terdaftar. Peran aktif Anda saat ini tidak memiliki otorisasi untuk mengakses data kehadiran siswa.
            </p>
          </div>
          <div className="text-xs text-stone-500 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-center gap-4">
            <span>Actor: <strong>{authenticActor || currentUser?.email || 'Anonim'}</strong></span>
            <span>•</span>
            <span>UID: <strong className="font-mono">{currentUser?.uid ? currentUser.uid.substring(0, 8) + '...' : 'None'}</strong></span>
            <span>•</span>
            <span>Active Role: <strong>{verifiedActiveRole || 'None'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5" />
              Module R6 • Presensi Siswa
            </span>
            {isGuruRole && hasValidTeacherClass && (
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Wali Kelas: {teacherAssignedClass}
              </span>
            )}
            {!canEditPresensi && (
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Mode Baca Saja
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Pencatatan Presensi Harian Siswa
          </h1>
          <p className="text-stone-500 text-xs mt-1">
            Input status kehadiran santri/siswa harian secara terstruktur terhubung ke Firestore & Portal Orang Tua.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading || isSaving}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-2xl flex items-center gap-2 transition disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>

          {canEditPresensi && (
            <>
              <button
                type="button"
                onClick={handleMarkAllHadir}
                disabled={isSaving || filteredStudents.length === 0}
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-2xl flex items-center gap-2 transition disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4 text-emerald-700" /> Set Semua Hadir
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving || filteredStudents.length === 0}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan ke Database...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Simpan Presensi Harian
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Unassigned Teacher Warning Banner */}
      {isGuruRole && !hasValidTeacherClass && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2.5 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <p className="font-bold">Penugasan Wali Kelas Belum Ditetapkan</p>
            <p className="text-[11px] font-normal text-amber-800 mt-0.5">
              Akun Guru Anda belum memiliki rombel binaan di Master Data R5. Silakan hubungi Kepala Sekolah atau Admin untuk penetapan Wali Kelas sebelum mencatat presensi.
            </p>
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 text-sm font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Real Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-bold">Total Siswa</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.total}</div>
          <div className="text-[10px] text-stone-400 mt-1">Siswa Aktif</div>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-3xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[11px] font-bold">Hadir</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-950">{summary.hadir}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
            {summary.percentHadir}% Kehadiran
          </div>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-3xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-[11px] font-bold">Izin</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-950">{summary.izin}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-1">Dengan Keterangan</div>
        </div>

        <div className="bg-sky-50/60 p-4 rounded-3xl border border-sky-200 shadow-xs">
          <div className="flex items-center justify-between text-sky-800 mb-1">
            <span className="text-[11px] font-bold">Sakit</span>
            <AlertCircle className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-950">{summary.sakit}</div>
          <div className="text-[10px] text-sky-700 font-semibold mt-1">Kondisi Medis</div>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-3xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-[11px] font-bold">Alpha</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-950">{summary.alpha}</div>
          <div className="text-[10px] text-rose-700 font-semibold mt-1">Tanpa Keterangan</div>
        </div>

        <div className="bg-stone-50 p-4 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-[11px] font-bold">Tanggal</span>
            <CalendarCheck className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-sm font-bold text-stone-800 truncate">{selectedDate}</div>
          <div className="text-[10px] text-stone-500 mt-1 truncate">
            {isGuruRole ? (teacherAssignedClass || 'Belum ada kelas') : selectedClass}
          </div>
        </div>
      </div>

      {/* Filter & Table Container */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs font-bold">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-stone-600 mb-1">Pilih Tanggal Presensi:</label>
              <input
                type="date"
                value={selectedDate}
                disabled={isSaving}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Kelompok Rombel:</label>
              {isGuruRole ? (
                <div className="inline-flex items-center gap-2">
                  <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{teacherAssignedClass ? `${teacherAssignedClass} (Kelas Binaan)` : 'Belum Ditugaskan Kelas'}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-normal italic">
                    (Akses guru terisolasi ke rombel binaan)
                  </span>
                </div>
              ) : isParent ? (
                <div className="inline-flex items-center gap-2">
                  <div className="px-3.5 py-2 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    <span>Data Ananda Terdaftar ({students.length} Siswa)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-normal italic">
                    (Akses wali murid dibatasi untuk ananda sendiri)
                  </span>
                </div>
              ) : (
                <select
                  value={selectedClass}
                  disabled={isSaving}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="px-3 py-2 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                >
                  <option value="Semua">Semua Kelompok ({students.length} Siswa)</option>
                  {availableClassGroups.map(grp => {
                    const count = students.filter(s => s.classGroup === grp).length;
                    return (
                      <option key={grp} value={grp}>
                        {grp} ({count} Siswa)
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-64">
            <label className="block text-stone-600 mb-1">Pencarian Siswa:</label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau NIS..."
                value={searchQuery}
                disabled={isSaving}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
              />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3">NIS</th>
                <th className="p-3">Nama Lengkap & Panggilan</th>
                <th className="p-3">Kelompok</th>
                <th className="p-3 text-center">Status Kehadiran</th>
                <th className="p-3">Catatan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-stone-300" />
                      <p className="font-bold">Tidak ada data siswa yang sesuai filter.</p>
                      <p className="text-[11px] text-stone-400">
                        {isGuruRole && !hasValidTeacherClass
                          ? 'Anda belum memiliki rombel binaan. Silakan hubungi Kepala Sekolah atau Admin.'
                          : isParent
                          ? 'Belum ada data siswa terdaftar yang terhubung dengan akun Wali Murid Anda.'
                          : 'Pastikan kelompok rombel memiliki siswa aktif di Master Data Siswa (R3).'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, index) => {
                  const draft = dailyDraft[s.id];
                  const currentStatus = draft?.status || 'Hadir';
                  const currentNotes = draft?.notes || '';

                  return (
                    <tr key={s.id} className="hover:bg-stone-50 transition">
                      <td className="p-3 text-center text-stone-400 font-mono">{index + 1}</td>
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
                      <td className="p-3 text-center">
                        {!canEditPresensi ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border ${
                            currentStatus === 'Hadir' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            currentStatus === 'Izin' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            currentStatus === 'Sakit' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                            'bg-rose-50 text-rose-800 border-rose-300'
                          }`}>
                            {currentStatus}
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                            {(['Hadir', 'Izin', 'Sakit', 'Alpha'] as const).map(st => (
                              <button
                                key={st}
                                type="button"
                                disabled={!canEditPresensi || isSaving}
                                onClick={() => handleStatusChange(s.id, st)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition disabled:cursor-not-allowed ${
                                  currentStatus === st
                                    ? st === 'Hadir'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'Izin'
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : st === 'Sakit'
                                      ? 'bg-sky-600 text-white shadow-xs'
                                      : 'bg-rose-600 text-white shadow-xs'
                                    : 'text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {!canEditPresensi ? (
                          <span className="text-stone-600 italic">
                            {currentNotes || '-'}
                          </span>
                        ) : (
                          <input
                            type="text"
                            placeholder={currentStatus === 'Hadir' ? 'Opsional...' : 'Alasan sakit/izin...'}
                            value={currentNotes}
                            disabled={!canEditPresensi || isSaving}
                            onChange={e => handleNotesChange(s.id, e.target.value)}
                            className="w-full px-3 py-1.5 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 disabled:bg-stone-100"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Status Bar */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <span>
            Menampilkan <strong>{filteredStudents.length}</strong> siswa untuk tanggal <strong>{selectedDate}</strong>
          </span>
          {canEditPresensi && (
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving || filteredStudents.length === 0}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition disabled:opacity-50 self-end sm:self-auto shadow-xs"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Simpan Presensi Harian
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default R6PresensiSiswa;
