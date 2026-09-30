import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PresensiGuruRecord, Teacher, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  CheckCheck,
  RefreshCw,
  Printer,
  Briefcase,
  HeartPulse,
  Clock,
  Edit3,
  X,
  ShieldCheck,
  Calendar,
  Lock
} from 'lucide-react';

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

const getSchoolLocalDate = (): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  } catch {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
};

const getSchoolLocalMonth = (): string => {
  return getSchoolLocalDate().substring(0, 7);
};

export const R7PresensiGuru: React.FC = () => {
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

  // Access Boundary: Only Management and Educators have legitimate access to PTK attendance
  const canAccessR7 = useMemo(() => {
    return isManagementRole || isGuruRole;
  }, [isManagementRole, isGuruRole]);

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

  // Data States loaded from DataService
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [presensiGuruList, setPresensiGuruList] = useState<PresensiGuruRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // View Mode: 'HARIAN' | 'BULANAN'
  const [viewMode, setViewMode] = useState<'HARIAN' | 'BULANAN'>('HARIAN');

  // Filter & Form States (Synchronized to school-local date)
  const [selectedDate, setSelectedDate] = useState<string>(() => getSchoolLocalDate());
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getSchoolLocalMonth());
  const [selectedPosition, setSelectedPosition] = useState<string>('Semua');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // In-memory working draft for the active selectedDate: map of teacherId -> PresensiGuruRecord
  const [dailyDraft, setDailyDraft] = useState<
    Record<
      string,
      {
        id?: string;
        status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' | 'Dinas';
        notes: string;
        activitySummary: string;
      }
    >
  >({});

  // Editing Modal State
  const [modalTargetTeacher, setModalTargetTeacher] = useState<Teacher | null>(null);
  const [modalFormData, setModalFormData] = useState<{
    status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' | 'Dinas';
    notes: string;
    activitySummary: string;
  }>({
    status: 'Hadir',
    notes: '',
    activitySummary: ''
  });

  // UI Feedback States (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Confirmation Modal State (Zero Native Dialogs)
  const [confirmMassModal, setConfirmMassModal] = useState<boolean>(false);

  // Authoritative Teacher Resolution strictly from current teacher list
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

  // Target-level authorization gate (Security boundary)
  // GURU: Self-only. Management: Full PTK. Unauthorized: False.
  const isTeacherAuthorizedFor = useCallback(
    (targetTeacherId: string): boolean => {
      if (!currentUser?.uid || !verifiedActiveRole || !canAccessR7) return false;
      if (isManagementRole) return true;
      if (isGuruRole && matchedTeacher && matchedTeacher.id === targetTeacherId) return true;
      return false;
    },
    [currentUser?.uid, verifiedActiveRole, canAccessR7, isManagementRole, isGuruRole, matchedTeacher]
  );

  // Auto-dismiss feedback banner after 4 seconds
  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Pre-query Authorization & Scoped Data Ingestion from DataService
  const loadData = useCallback(async () => {
    // 1. Pre-query authorization gate: Zero queries for unauthorized sessions
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR7) {
      setTeachers([]);
      setPresensiGuruList([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (isGuruRole) {
        // Educator self-service access:
        // Load teachers directory temporarily to map self identity
        const allTeachers = await DataService.getTeachers();
        const selfTeacher = (allTeachers || []).find(t =>
          (currentUser.uid && t.id === currentUser.uid) ||
          (currentUser.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (userProfile?.email && t.email && t.email.toLowerCase() === userProfile.email.toLowerCase()) ||
          (userProfile?.nama && t.name && t.name.toLowerCase() === userProfile.nama.toLowerCase()) ||
          (userProfile?.name && t.name && t.name.toLowerCase() === userProfile.name.toLowerCase())
        );

        if (!selfTeacher) {
          setTeachers([]);
          setPresensiGuruList([]);
          showFeedback('info', 'Profil Guru Anda belum terpetakan di sistem. Hubungi Administrator sekolah.');
          return;
        }

        // STRICT PRIVACY: Store ONLY the logged-in teacher in state. Zero peer teachers.
        setTeachers([selfTeacher]);

        // Load presensi and IMMEDIATELY scope to selfTeacher. Zero peer presensi records enter state.
        const allPresensi = await DataService.getPresensiGuru();
        const scopedPresensi = (allPresensi || []).filter(p => p.teacherId === selfTeacher.id);
        setPresensiGuruList(scopedPresensi);
      } else if (isManagementRole) {
        // Institutional Leadership access: load full PTK directory and presensi
        const [fetchedTeachers, fetchedPresensi] = await Promise.all([
          DataService.getTeachers(),
          DataService.getPresensiGuru()
        ]);

        setTeachers(fetchedTeachers || []);
        setPresensiGuruList(fetchedPresensi || []);
      }
    } catch (err) {
      console.error('Error loading teachers / presensi data from DataService:', err);
      showFeedback('error', 'Gagal memuat data guru dan riwayat presensi dari DataService.');
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
    canAccessR7,
    isGuruRole,
    isManagementRole
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Synchronize dailyDraft whenever teachers, presensiGuruList, or selectedDate changes
  useEffect(() => {
    const draft: Record<
      string,
      {
        id?: string;
        status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' | 'Dinas';
        notes: string;
        activitySummary: string;
      }
    > = {};

    teachers.forEach(t => {
      const existing = presensiGuruList.find(p => p.teacherId === t.id && p.date === selectedDate);
      if (existing) {
        draft[t.id] = {
          id: existing.id,
          status: existing.status,
          notes: existing.notes || '',
          activitySummary: existing.activitySummary || ''
        };
      } else {
        draft[t.id] = {
          status: 'Hadir',
          notes: '',
          activitySummary: ''
        };
      }
    });

    setDailyDraft(draft);
  }, [selectedDate, presensiGuruList, teachers]);

  // Unique Positions list from actual teacher data
  const availablePositions = useMemo(() => {
    const set = new Set(teachers.map(t => t.position).filter(Boolean));
    return ['Semua', ...Array.from(set).sort()];
  }, [teachers]);

  // Filtered teachers list based on search and position
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.nip && t.nip.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.position && t.position.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPosition =
        selectedPosition === 'Semua' || t.position === selectedPosition;

      const currentStatus = dailyDraft[t.id]?.status || 'Hadir';
      const matchesStatus =
        selectedStatusFilter === 'Semua' || currentStatus === selectedStatusFilter;

      return matchesSearch && matchesPosition && matchesStatus;
    });
  }, [teachers, searchQuery, selectedPosition, selectedStatusFilter, dailyDraft]);

  // Daily Statistics Calculation (Strictly from real active data)
  const dailyStats = useMemo(() => {
    const total = teachers.length;
    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let dinas = 0;
    let alpha = 0;

    teachers.forEach(t => {
      const status = dailyDraft[t.id]?.status || 'Hadir';
      if (status === 'Hadir') hadir++;
      else if (status === 'Izin') izin++;
      else if (status === 'Sakit') sakit++;
      else if (status === 'Dinas') dinas++;
      else if (status === 'Alpha') alpha++;
    });

    const percentage = total > 0 ? Math.round(((hadir + dinas) / total) * 100) : 0;

    return { total, hadir, izin, sakit, dinas, alpha, percentage };
  }, [teachers, dailyDraft]);

  // Monthly Matrix Data Calculation
  // PRIVACY ENFORCEMENT: For GURU role, strictly restricted to self-only
  const monthlyRecapData = useMemo(() => {
    if (!selectedMonth) return [];

    const baseTeachers = isGuruRole
      ? (matchedTeacher ? teachers.filter(t => t.id === matchedTeacher.id) : [])
      : teachers;

    return baseTeachers.map(t => {
      const recordsThisMonth = presensiGuruList.filter(
        p => p.teacherId === t.id && p.date.startsWith(selectedMonth)
      );

      let hadirCount = 0;
      let izinCount = 0;
      let sakitCount = 0;
      let dinasCount = 0;
      let alphaCount = 0;

      recordsThisMonth.forEach(r => {
        if (r.status === 'Hadir') hadirCount++;
        else if (r.status === 'Izin') izinCount++;
        else if (r.status === 'Sakit') sakitCount++;
        else if (r.status === 'Dinas') dinasCount++;
        else if (r.status === 'Alpha') alphaCount++;
      });

      const totalRecordedDays = recordsThisMonth.length;
      const attendanceScore =
        totalRecordedDays > 0
          ? Math.round(((hadirCount + dinasCount) / totalRecordedDays) * 100)
          : 100;

      let disciplineCategory = 'Sangat Baik';
      if (attendanceScore < 75 || alphaCount >= 3) {
        disciplineCategory = 'Perlu Pembinaan';
      } else if (attendanceScore < 90 || alphaCount >= 1) {
        disciplineCategory = 'Cukup Baik';
      }

      return {
        teacher: t,
        totalRecordedDays,
        hadirCount,
        izinCount,
        sakitCount,
        dinasCount,
        alphaCount,
        attendanceScore,
        disciplineCategory
      };
    });
  }, [teachers, presensiGuruList, selectedMonth, isGuruRole, matchedTeacher]);

  // Quick Inline Status Update for a Teacher via DataService.savePresensiGuru
  const handleQuickStatusChange = async (
    teacher: Teacher,
    newStatus: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' | 'Dinas'
  ) => {
    // 1. Immediate re-entry / double-submit guard
    if (isSaving) return;

    // 2. Fail-closed security boundary
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR7) {
      showFeedback('error', 'Akses ditolak: Sesi autentikasi tidak valid atau belum terverifikasi.');
      return;
    }

    if (!isTeacherAuthorizedFor(teacher.id)) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin memodifikasi presensi PTK ini.');
      return;
    }

    setIsSaving(true);
    const currentData = dailyDraft[teacher.id] || {
      status: 'Hadir',
      notes: '',
      activitySummary: ''
    };

    const recordToSave: PresensiGuruRecord = {
      id: currentData.id || `pg_${teacher.id}_${selectedDate}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      date: selectedDate,
      status: newStatus,
      notes: currentData.notes || '',
      activitySummary: currentData.activitySummary || ''
    };

    try {
      // 1. Save via Canonical DataService
      await DataService.savePresensiGuru(recordToSave);

      // 2. Refresh from DataService with strict role scoping
      const freshList = await DataService.getPresensiGuru();
      if (isGuruRole) {
        setPresensiGuruList((freshList || []).filter(p => p.teacherId === teacher.id));
      } else {
        setPresensiGuruList(freshList || []);
      }

      // 3. Log Audit Trail (Canonical logAction, strictly authentic session actor)
      if (verifiedActiveRole && actorName) {
        DataService.logAction(
          actorName,
          verifiedActiveRole,
          'UPDATE_PRESENSI_GURU',
          `R7 Presensi Guru - ${teacher.name} (${selectedDate}: ${newStatus})`
        ).catch(() => {});
      }

      showFeedback(
        'success',
        `Presensi ${teacher.name} berhasil diperbarui menjadi ${newStatus}.`
      );
    } catch (err) {
      console.error('Error saving quick status via DataService:', err);
      showFeedback('error', 'Gagal menyimpan perubahan presensi guru.');
    } finally {
      setIsSaving(false);
    }
  };

  // Mass Action: Set All Active Teachers to 'Hadir' via DataService.savePresensiGuru
  const handleSetAllHadir = async () => {
    // 1. Immediate re-entry / double-submit guard
    if (isSaving) return;

    // 2. Fail-closed authorization check: Strictly Management Roles
    if (!currentUser?.uid || !isManagementRole || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Hanya pimpinan/administrasi yang berwenang menetapkan presensi massal.');
      setConfirmMassModal(false);
      return;
    }

    setIsSaving(true);
    setConfirmMassModal(false);

    try {
      const recordsToSave: PresensiGuruRecord[] = teachers.map(t => {
        const current = dailyDraft[t.id];
        return {
          id: current?.id || `pg_${t.id}_${selectedDate}`,
          teacherId: t.id,
          teacherName: t.name,
          date: selectedDate,
          status: 'Hadir',
          notes: current?.notes || '',
          activitySummary: current?.activitySummary || 'Hadir dan bertugas aktif di sekolah.'
        };
      });

      // Sequential persistence to prevent local storage race conditions
      let successCount = 0;
      let failCount = 0;

      for (const record of recordsToSave) {
        try {
          await DataService.savePresensiGuru(record);
          successCount++;
        } catch (itemErr) {
          console.error(`Gagal menyimpan presensi massal untuk ${record.teacherName}:`, itemErr);
          failCount++;
        }
      }

      // Reload fresh canonical records for management
      const freshList = await DataService.getPresensiGuru();
      setPresensiGuruList(freshList || []);

      // Canonical Audit Log if at least one succeeded
      if (successCount > 0 && verifiedActiveRole && actorName) {
        DataService.logAction(
          actorName,
          verifiedActiveRole,
          'BULK_SET_HADIR_GURU',
          `R7 Presensi Guru - Massal ${selectedDate} (${successCount} PTK Hadir${failCount > 0 ? `, ${failCount} Gagal` : ''})`
        ).catch(() => {});
      }

      if (failCount === 0) {
        showFeedback(
          'success',
          `Berhasil menandai seluruh (${successCount}) Guru & PTK hadir pada ${selectedDate}.`
        );
      } else if (successCount > 0) {
        showFeedback(
          'info',
          `Presensi massal parsial: ${successCount} berhasil disimpan, ${failCount} gagal.`
        );
      } else {
        showFeedback('error', `Gagal menyimpan presensi massal guru (${failCount} gagal).`);
      }
    } catch (err) {
      console.error('Error saving bulk attendance via DataService:', err);
      showFeedback('error', 'Terjadi kesalahan saat memproses presensi massal guru.');
    } finally {
      setIsSaving(false);
    }
  };

  // Open Detail / Journal Editing Modal
  const handleOpenDetailModal = (teacher: Teacher) => {
    if (!isTeacherAuthorizedFor(teacher.id)) {
      showFeedback('error', 'Akses ditolak: Anda hanya dapat mengisi jurnal presensi Anda sendiri.');
      return;
    }

    const current = dailyDraft[teacher.id] || {
      status: 'Hadir',
      notes: '',
      activitySummary: ''
    };
    setModalTargetTeacher(teacher);
    setModalFormData({
      status: current.status,
      notes: current.notes || '',
      activitySummary: current.activitySummary || ''
    });
  };

  // Save Modal Changes via DataService.savePresensiGuru
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Immediate double-submit guard
    if (isSaving) return;
    if (!modalTargetTeacher) return;

    // 2. Fail-closed authorization check
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR7) {
      showFeedback('error', 'Akses ditolak: Sesi autentikasi tidak valid atau belum terverifikasi.');
      return;
    }

    if (!isTeacherAuthorizedFor(modalTargetTeacher.id)) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mengubah jurnal presensi PTK ini.');
      return;
    }

    setIsSaving(true);
    try {
      const current = dailyDraft[modalTargetTeacher.id];
      const recordToSave: PresensiGuruRecord = {
        id: current?.id || `pg_${modalTargetTeacher.id}_${selectedDate}`,
        teacherId: modalTargetTeacher.id,
        teacherName: modalTargetTeacher.name,
        date: selectedDate,
        status: modalFormData.status,
        notes: modalFormData.notes.trim(),
        activitySummary: modalFormData.activitySummary.trim()
      };

      // Save via DataService
      await DataService.savePresensiGuru(recordToSave);

      // Refresh DataService with strict role scoping
      const freshList = await DataService.getPresensiGuru();
      if (isGuruRole) {
        setPresensiGuruList((freshList || []).filter(p => p.teacherId === modalTargetTeacher.id));
      } else {
        setPresensiGuruList(freshList || []);
      }

      // Audit Log (strictly authentic actor parameters)
      if (verifiedActiveRole && actorName) {
        DataService.logAction(
          actorName,
          verifiedActiveRole,
          'SAVE_JURNAL_GURU',
          `R7 Presensi Guru - Jurnal ${modalTargetTeacher.name} (${selectedDate}: ${modalFormData.status})`
        ).catch(() => {});
      }

      setModalTargetTeacher(null);
      showFeedback(
        'success',
        `Catatan jurnal dan presensi untuk ${modalTargetTeacher.name} berhasil disimpan.`
      );
    } catch (err) {
      console.error('Error saving modal detail via DataService:', err);
      showFeedback('error', 'Gagal menyimpan catatan presensi guru.');
    } finally {
      setIsSaving(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // ==========================================
  // FAIL-CLOSED ACCESS DENIED CONTAINER
  // ==========================================
  // Unauthorized users (e.g. WALI_MURID, CALON_WALI_MURID, ALUMNI_FAMILY, KEUANGAN, unauthenticated)
  // NEVER render the PTK attendance table, medical excuses, or disciplinary evaluations.
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessR7) {
    return (
      <div
        id="r7-access-denied-container"
        className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-5"
      >
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-rose-700" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            PRIVASI & KEAMANAN PRESENSI PTK
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Akses Data Presensi Guru Dibatasi
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            {!currentUser?.uid
              ? 'Sesi Anda belum terautentikasi. Silakan masuk terlebih dahulu untuk mengakses data presensi dan jurnal mengajar PTK.'
              : !verifiedActiveRole
              ? 'Peran akun tidak terverifikasi secara sah dalam sistem kanonikal TK Asy Syifa.'
              : `Peran Anda (${verifiedActiveRole}) tidak memiliki wewenang untuk mengakses arsip presensi, jurnal mengajar, atau catatan kedisiplinan PTK.`}
          </p>
        </div>
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/sim"
            id="btn-r7-back-sim"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Kembali ke Beranda SIM
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="r7-presensi-container" className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Module R7 - Presensi & Jurnal PTK
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
                ? `Mode Guru Mandiri (${matchedTeacher.name})`
                : 'Mode Guru (Identitas Terbatas)'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Presensi Guru & Tenaga Kependidikan
          </h1>
          <p className="text-stone-500 text-xs">
            Monitoring kedisiplinan kehadiran harian, surat izin dinas/sakit, dan ringkasan jurnal
            pembelajaran guru TK Asy Syifa.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => setViewMode('HARIAN')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'HARIAN'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
            >
              Presensi Harian
            </button>
            <button
              onClick={() => setViewMode('BULANAN')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'BULANAN'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
            >
              Rekap Bulanan PTK
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all border border-stone-300 cursor-pointer"
            title="Cetak Laporan Presensi"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          id="r7-feedback-banner"
          className={`p-4 rounded-2xl text-xs font-medium border flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SMART DATA CARDS (Calculated strictly from real active data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total PTK
            </span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{dailyStats.total}</h3>
          <span className="text-[10px] text-stone-400">Guru & Tenaga Staf</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs bg-gradient-to-b from-white to-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Hadir
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">{dailyStats.hadir}</h3>
          <span className="text-[10px] text-emerald-600 font-medium">Tepat Waktu / Hadir</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs bg-gradient-to-b from-white to-indigo-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Tugas Dinas
            </span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-indigo-700 mt-1">{dailyStats.dinas}</h3>
          <span className="text-[10px] text-indigo-600 font-medium">Luar Sekolah / Diklat</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs bg-gradient-to-b from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Izin
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-amber-700 mt-1">{dailyStats.izin}</h3>
          <span className="text-[10px] text-amber-600 font-medium">Ada Keterangan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs bg-gradient-to-b from-white to-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Sakit
            </span>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <h3 className="text-2xl font-black text-rose-700 mt-1">{dailyStats.sakit}</h3>
          <span className="text-[10px] text-rose-600 font-medium">Kondisi Medis</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs bg-gradient-to-b from-white to-stone-50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
              Persentase
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{dailyStats.percentage}%</h3>
          <span className="text-[10px] text-stone-400">Tingkat Kehadiran</span>
        </div>
      </div>

      {/* VIEW 1: PRESENSI HARIAN */}
      {viewMode === 'HARIAN' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          {/* Controls Bar: Date Picker, Search, Position Filter, Status Filter & Quick Action */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Picker */}
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-2 rounded-2xl">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-stone-700">Tanggal:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                />
              </div>

              {/* Search Bar (Only relevant for Management viewing multiple teachers) */}
              {isManagementRole && (
                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama atau jabatan..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>
              )}

              {/* Position Filter (Management only) */}
              {isManagementRole && availablePositions.length > 2 && (
                <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-2 rounded-2xl">
                  <Filter className="w-3.5 h-3.5 text-stone-500" />
                  <select
                    value={selectedPosition}
                    onChange={e => setSelectedPosition(e.target.value)}
                    className="bg-transparent text-xs font-medium text-stone-700 focus:outline-none cursor-pointer"
                  >
                    {availablePositions.map(pos => (
                      <option key={pos} value={pos}>
                        {pos === 'Semua' ? 'Semua Jabatan' : pos}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-2 rounded-2xl">
                <select
                  value={selectedStatusFilter}
                  onChange={e => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-medium text-stone-700 focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Hadir">Hadir</option>
                  <option value="Dinas">Tugas Dinas</option>
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpha">Alpha</option>
                </select>
              </div>
            </div>

            {/* Quick Bulk Action (Strictly Management Roles) */}
            {isManagementRole && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSaving || teachers.length === 0}
                  onClick={() => setConfirmMassModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Tandai Semua Hadir</span>
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500">Memuat data guru dan riwayat presensi dari DataService...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredTeachers.length === 0 && (
            <div className="py-16 text-center space-y-3 border-2 border-dashed border-stone-200 rounded-2xl">
              <UserX className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Tidak Ada Data Guru Ditemukan</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {isGuruRole
                  ? 'Profil PTK Anda belum terdaftar dalam sistem. Hubungi administrator sekolah.'
                  : 'Tidak ada data guru yang sesuai dengan kriteria pencarian atau filter yang dipilih.'}
              </p>
            </div>
          )}

          {/* Table View */}
          {!isLoading && filteredTeachers.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Nama Guru & PTK</th>
                    <th className="p-3.5">Jabatan / Penugasan</th>
                    <th className="p-3.5 text-center">Status Kehadiran ({selectedDate})</th>
                    <th className="p-3.5">Catatan Jurnal / Keterangan</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredTeachers.map(t => {
                    const currentDraft = dailyDraft[t.id] || {
                      status: 'Hadir',
                      notes: '',
                      activitySummary: ''
                    };
                    const status = currentDraft.status;
                    const isSelfOrManagement = isTeacherAuthorizedFor(t.id);

                    return (
                      <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                        {/* Nama & NIP */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs flex-shrink-0">
                              {t.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                {t.name}
                              </span>
                              <span className="text-[10px] text-stone-500 font-mono">
                                NIP: {t.nip || 'PTK Asy Syifa'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Jabatan & Kelas */}
                        <td className="p-3.5">
                          <span className="font-medium text-slate-800 block">{t.position}</span>
                          {t.assignedClass && (
                            <span className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold mt-0.5">
                              {t.assignedClass}
                            </span>
                          )}
                        </td>

                        {/* Status Kehadiran: Interactive Buttons for Authorized Users */}
                        <td className="p-3.5">
                          {isSelfOrManagement ? (
                            <div className="flex items-center justify-center gap-1">
                              {/* HADIR */}
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleQuickStatusChange(t, 'Hadir')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'Hadir'
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : 'bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700'
                                }`}
                              >
                                Hadir
                              </button>

                              {/* DINAS */}
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleQuickStatusChange(t, 'Dinas')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'Dinas'
                                    ? 'bg-indigo-700 text-white shadow-xs'
                                    : 'bg-stone-100 text-stone-600 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                              >
                                Dinas
                              </button>

                              {/* IZIN */}
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleQuickStatusChange(t, 'Izin')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'Izin'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                                }`}
                              >
                                Izin
                              </button>

                              {/* SAKIT */}
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleQuickStatusChange(t, 'Sakit')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'Sakit'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-700'
                                }`}
                              >
                                Sakit
                              </button>

                              {/* ALPHA */}
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleQuickStatusChange(t, 'Alpha')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  status === 'Alpha'
                                    ? 'bg-slate-800 text-white shadow-xs'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-slate-900'
                                }`}
                              >
                                Alpha
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-lg font-bold text-[11px] ${
                                  status === 'Hadir'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : status === 'Dinas'
                                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                    : status === 'Izin'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : status === 'Sakit'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                                }`}
                              >
                                {status}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Catatan Jurnal Mengajar / Keterangan */}
                        <td className="p-3.5 max-w-xs">
                          {isSelfOrManagement ? (
                            currentDraft.activitySummary ? (
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
                                  Jurnal Mengajar:
                                </span>
                                <p className="text-slate-800 line-clamp-2 italic">
                                  "{currentDraft.activitySummary}"
                                </p>
                              </div>
                            ) : currentDraft.notes ? (
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">
                                  Keterangan:
                                </span>
                                <p className="text-stone-600 line-clamp-2 italic">
                                  "{currentDraft.notes}"
                                </p>
                              </div>
                            ) : (
                              <span className="text-stone-400 italic text-[11px]">
                                Belum ada catatan jurnal.
                              </span>
                            )
                          ) : (
                            <span className="text-stone-400 italic text-[11px] block">
                              Catatan internal PTK bersangkutan (Privat)
                            </span>
                          )}
                        </td>

                        {/* Aksi Edit Jurnal */}
                        <td className="p-3.5 text-right">
                          {isSelfOrManagement ? (
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => handleOpenDetailModal(t)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                              <span>Jurnal / Catatan</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-stone-400 font-medium italic">
                              Hanya Baca
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: REKAP BULANAN PTK */}
      {viewMode === 'BULANAN' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Rekapitulasi Kehadiran Guru & PTK Bulanan
              </h2>
              <p className="text-xs text-stone-500">
                Akumulasi kehadiran, perizinan, dan kedisiplinan guru TK Asy Syifa.
              </p>
            </div>

            {/* Month Picker */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-2 rounded-2xl">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-stone-700">Pilih Bulan:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3.5">Nama Guru & PTK</th>
                  <th className="p-3.5">Jabatan</th>
                  <th className="p-3.5 text-center text-emerald-800">Hadir (H)</th>
                  <th className="p-3.5 text-center text-indigo-800">Dinas (D)</th>
                  <th className="p-3.5 text-center text-amber-800">Izin (I)</th>
                  <th className="p-3.5 text-center text-rose-800">Sakit (S)</th>
                  <th className="p-3.5 text-center text-slate-800">Alpha (A)</th>
                  <th className="p-3.5 text-center">Persentase Kehadiran</th>
                  <th className="p-3.5 text-center">Evaluasi Kedisiplinan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {monthlyRecapData.map(item => (
                  <tr key={item.teacher.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{item.teacher.name}</td>
                    <td className="p-3.5 text-stone-600">{item.teacher.position}</td>
                    <td className="p-3.5 text-center font-bold text-emerald-700">
                      {item.hadirCount}
                    </td>
                    <td className="p-3.5 text-center font-bold text-indigo-700">
                      {item.dinasCount}
                    </td>
                    <td className="p-3.5 text-center font-bold text-amber-700">{item.izinCount}</td>
                    <td className="p-3.5 text-center font-bold text-rose-700">{item.sakitCount}</td>
                    <td className="p-3.5 text-center font-bold text-slate-700">{item.alphaCount}</td>
                    <td className="p-3.5 text-center font-bold text-slate-900">
                      {item.attendanceScore}%
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.disciplineCategory === 'Sangat Baik'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.disciplineCategory === 'Cukup Baik'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.disciplineCategory}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: FORM INPUT JURNAL & KETERANGAN (Zero Native Dialogs) */}
      {modalTargetTeacher && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm">
                  {modalTargetTeacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{modalTargetTeacher.name}</h3>
                  <p className="text-[11px] text-stone-500">
                    {modalTargetTeacher.position} • Presensi {selectedDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalTargetTeacher(null)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              {/* Status Selector */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  Status Kehadiran <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['Hadir', 'Dinas', 'Izin', 'Sakit', 'Alpha'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setModalFormData(prev => ({ ...prev, status: st }))}
                      className={`py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        modalFormData.status === st
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jurnal Mengajar / Aktivitas Guru */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Ringkasan Jurnal Mengajar / Aktivitas Guru
                </label>
                <textarea
                  rows={3}
                  value={modalFormData.activitySummary}
                  onChange={e =>
                    setModalFormData(prev => ({ ...prev, activitySummary: e.target.value }))
                  }
                  placeholder="Contoh: Mengajar tema Tanaman Obat di Sentra Bahan Alam, membimbing wudhu dan sholat dhuha..."
                  className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs"
                />
              </div>

              {/* Catatan / Keterangan Khusus */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Keterangan Tambahan / Surat Izin / Alasan Sakit
                </label>
                <textarea
                  rows={2}
                  value={modalFormData.notes}
                  onChange={e =>
                    setModalFormData(prev => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Contoh: Izin mendampingi dinas pelatihan Kurikulum Merdeka di Dinas Pendidikan..."
                  className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalTargetTeacher(null)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Presensi PTK'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMATION BULK SET HADIR (Zero Native Dialogs) */}
      {isManagementRole && confirmMassModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Tandai Semua Hadir ({selectedDate})?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Tindakan ini akan menetapkan status seluruh ({teachers.length}) Guru dan Tenaga
                Kependidikan menjadi <strong>Hadir</strong> pada tanggal {selectedDate}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmMassModal(false)}
                className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSetAllHadir}
                className="px-5 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Memproses...' : 'Ya, Tetapkan Semua Hadir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default R7PresensiGuru;
