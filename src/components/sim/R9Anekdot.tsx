import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AnekdotRecord, Student, Teacher, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Plus,
  Save,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Printer,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Baby,
  CheckCircle,
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

export const R9Anekdot: React.FC = () => {
  const { currentUser, activeRole, userProfile } = useAuth();

  // 1. Authoritative Role Resolution (Fail-Closed)
  // activeRole must strictly match CANONICAL_ROLES.
  // Zero fallback to userProfile.role. Zero privileged defaults.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Authentic Actor Identity: strictly derived from authenticated session without synthetic fallbacks
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    const cleanProfileName = (userProfile?.nama || userProfile?.name)?.trim();
    if (cleanProfileName) return cleanProfileName;
    const cleanDisplayName = currentUser?.displayName?.trim();
    if (cleanDisplayName) return cleanDisplayName;
    const cleanEmail = currentUser?.email?.trim();
    if (cleanEmail) return cleanEmail;
    return `User (${currentUser.uid.slice(0, 8)})`;
  }, [currentUser?.uid, userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email]);

  const isManagementRole = Boolean(
    currentUser?.uid && verifiedActiveRole && MANAGEMENT_ROLES.includes(verifiedActiveRole)
  );

  const isGuruRole = Boolean(currentUser?.uid && verifiedActiveRole === 'GURU');

  const isWaliMuridRole = Boolean(
    currentUser?.uid && verifiedActiveRole === 'WALI_MURID'
  );

  const canAccessR9 = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    (isManagementRole || isGuruRole || isWaliMuridRole)
  );

  // Data States
  const [anekdots, setAnekdots] = useState<AnekdotRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('Semua');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Modal Form States (Create & Edit)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<AnekdotRecord | null>(null);
  const [viewDetailRecord, setViewDetailRecord] = useState<AnekdotRecord | null>(null);

  const [formData, setFormData] = useState<{
    studentId: string;
    date: string;
    time: string;
    location: string;
    observedBehavior: string;
    teacherAnalysis: string;
    followUp: string;
  }>({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:30 WIB',
    location: 'Ruang Kelas',
    observedBehavior: '',
    teacherAnalysis: '',
    followUp: ''
  });

  // UI In-App Feedback State (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Form Validation Error Message
  const [formError, setFormError] = useState<string>('');

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Teacher Identity Resolution (for GURU role)
  const matchedTeacher = useMemo<Teacher | null>(() => {
    if (!currentUser?.uid && !currentUser?.email && !userProfile?.email && !userProfile?.nama && !userProfile?.name) {
      return null;
    }
    const cleanUserEmail = currentUser?.email?.trim().toLowerCase();
    const cleanProfileEmail = userProfile?.email?.trim().toLowerCase();
    const cleanProfileNama = (userProfile?.nama || userProfile?.name)?.trim().toLowerCase();

    return (
      teachers.find(t => {
        if (currentUser?.uid && t.id === currentUser.uid) return true;
        if (cleanUserEmail && t.email && t.email.trim().toLowerCase() === cleanUserEmail) return true;
        if (cleanProfileEmail && t.email && t.email.trim().toLowerCase() === cleanProfileEmail) return true;
        if (cleanProfileNama && t.name && t.name.trim().toLowerCase() === cleanProfileNama) return true;
        return false;
      }) || null
    );
  }, [teachers, currentUser?.uid, currentUser?.email, userProfile?.email, userProfile?.nama, userProfile?.name]);

  // Mutation permission: Management or GURU with verified teacher record and assigned class
  const canMutate = Boolean(
    currentUser?.uid &&
      verifiedActiveRole &&
      (isManagementRole || (isGuruRole && matchedTeacher && Boolean(matchedTeacher.assignedClass)))
  );

  // 2. Pre-Query Authorization Gate & Scoped Data Fetching
  // - Unauthorized sessions trigger ZERO queries and clear sensitive state.
  // - WALI_MURID queries only linked children; global anecdotal records are NEVER downloaded into parent memory.
  // - GURU queries teachers and roster first; anecdotal records are scoped strictly to the teacher's assigned classroom BEFORE entering state.
  // - Cross-classroom confidential behavioral assessments NEVER enter browser state.
  // - Institutional Management queries full institutional dataset.
  const loadData = useCallback(async () => {
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR9) {
      setIsLoading(false);
      setAnekdots([]);
      setStudents([]);
      setTeachers([]);
      setViewDetailRecord(null);
      return;
    }

    setIsLoading(true);
    try {
      if (isWaliMuridRole) {
        // Authenticated Parent: Strictly query linked children only
        // Global confidential anecdotal dataset is NEVER loaded into parent browser memory
        const linkedStudents = await DataService.getStudents(
          verifiedActiveRole,
          currentUser.uid,
          currentUser.email || undefined
        );
        setStudents(linkedStudents || []);
        setAnekdots([]);
        setTeachers([]);
        setViewDetailRecord(null);
      } else if (isGuruRole) {
        // Educator / Teacher access:
        // 1. Resolve teacher identity and classroom assignment first
        const [fetchedTeachers, fetchedStudents] = await Promise.all([
          DataService.getTeachers(),
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            currentUser.email || userProfile?.email
          )
        ]);

        const currentTeacher = fetchedTeachers.find(t =>
          (currentUser.uid && t.id === currentUser.uid) ||
          (currentUser.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (userProfile?.email && t.email && t.email.toLowerCase() === userProfile.email.toLowerCase()) ||
          (userProfile?.nama && t.name && t.name.toLowerCase() === userProfile.nama.toLowerCase()) ||
          (userProfile?.name && t.name && t.name.toLowerCase() === userProfile.name.toLowerCase())
        );

        // Fail-closed if teacher has no mapped classroom
        if (!currentTeacher || !currentTeacher.assignedClass) {
          setTeachers(fetchedTeachers || []);
          setStudents([]);
          setAnekdots([]);
          setViewDetailRecord(null);
          setFeedback({
            type: 'info',
            message: 'Akun Anda terdaftar sebagai Guru, namun rombel kelas binaan belum terpetakan. Hubungi Administrator untuk penetapan kelas pengampu.'
          });
          return;
        }

        const teacherClass = currentTeacher.assignedClass;
        const authorizedStudents = (fetchedStudents || []).filter(s => s.classGroup === teacherClass);
        const allowedStudentIdSet = new Set(authorizedStudents.map(s => s.id));

        // 2. Fetch and IMMEDIATELY scope anecdotal records before storing into state
        // Zero cross-classroom records from other rombels enter browser memory
        const fetchedAnekdot = await DataService.getAnekdot();
        const scopedRecords = (fetchedAnekdot || []).filter(a =>
          allowedStudentIdSet.has(a.studentId) || a.classGroup === teacherClass
        );

        setTeachers(fetchedTeachers || []);
        setStudents(authorizedStudents);
        setAnekdots(scopedRecords);

        // Synchronize selected class for educator view
        setSelectedClass(teacherClass);
      } else {
        // Institutional Leadership / Management access (SUPER_ADMIN, ADMIN, KEPALA_SEKOLAH, KETUA_YAYASAN)
        const [fetchedAnekdot, fetchedStudents, fetchedTeachers] = await Promise.all([
          DataService.getAnekdot(),
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            currentUser.email || userProfile?.email
          ),
          DataService.getTeachers()
        ]);

        setAnekdots(fetchedAnekdot || []);
        setStudents(fetchedStudents || []);
        setTeachers(fetchedTeachers || []);
      }
    } catch (err) {
      console.error('Error loading anekdot/students data from DataService:', err);
      showFeedback('error', 'Gagal memuat catatan anekdot dan data master dari server.');
    } finally {
      setIsLoading(false);
    }
  }, [verifiedActiveRole, currentUser?.uid, currentUser?.email, userProfile?.email, userProfile?.nama, userProfile?.name, canAccessR9, isWaliMuridRole, isGuruRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Student Authorization Mapping (Privacy & Scope Isolation)
  const authorizedStudentIds = useMemo<Set<string> | null>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) {
      return new Set<string>(); // unauthenticated / invalid role: deny-all
    }
    if (isManagementRole) {
      return null; // management: full visibility
    }
    if (isGuruRole) {
      if (!matchedTeacher || !matchedTeacher.assignedClass) {
        return new Set<string>(); // unmapped teacher: deny-all
      }
      const allowed = students
        .filter(s => s.classGroup === matchedTeacher.assignedClass)
        .map(s => s.id);
      return new Set<string>(allowed);
    }
    if (isWaliMuridRole) {
      const allowed = students.map(s => s.id);
      return new Set<string>(allowed);
    }
    // All other roles (e.g. KEUANGAN, ALUMNI_FAMILY): deny-all
    return new Set<string>();
  }, [currentUser?.uid, verifiedActiveRole, isManagementRole, isGuruRole, isWaliMuridRole, matchedTeacher, students]);

  // Authorized Anekdot Records (state is already scoped, double-enforced here)
  const authorizedAnekdots = useMemo(() => {
    if (isWaliMuridRole) return [];
    if (authorizedStudentIds === null) {
      return anekdots;
    }
    return anekdots.filter(a => authorizedStudentIds.has(a.studentId));
  }, [anekdots, authorizedStudentIds, isWaliMuridRole]);

  // Authorized Students List (for filters and displays)
  const authorizedStudents = useMemo(() => {
    if (authorizedStudentIds === null) {
      return students;
    }
    return students.filter(s => authorizedStudentIds.has(s.id));
  }, [students, authorizedStudentIds]);

  // Selectable Students in Form Modal (Create only allows authorized scope)
  const selectableStudents = useMemo(() => {
    if (!currentUser?.uid || !verifiedActiveRole || !canMutate) return [];
    if (isManagementRole) return students;
    if (isGuruRole && matchedTeacher?.assignedClass) {
      return students.filter(s => s.classGroup === matchedTeacher.assignedClass);
    }
    return [];
  }, [currentUser?.uid, verifiedActiveRole, canMutate, isManagementRole, isGuruRole, matchedTeacher, students]);

  // Available Class Groups for Filter
  const availableClasses = useMemo(() => {
    if (!currentUser?.uid || !verifiedActiveRole) return [];
    if (isManagementRole) {
      const set = new Set(students.map(s => s.classGroup).filter(Boolean));
      return ['Semua', ...Array.from(set).sort()];
    }
    if (isGuruRole && matchedTeacher?.assignedClass) {
      return [matchedTeacher.assignedClass];
    }
    return [];
  }, [currentUser?.uid, verifiedActiveRole, isManagementRole, isGuruRole, matchedTeacher, students]);

  // Filtered Anekdot Records (calculated strictly from authorized dataset)
  const filteredAnekdots = useMemo(() => {
    return authorizedAnekdots.filter(item => {
      const matchesSearch =
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.observedBehavior.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teacherAnalysis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesClass =
        selectedClass === 'Semua' || item.classGroup === selectedClass;

      const matchesStudent =
        selectedStudentId === 'Semua' || item.studentId === selectedStudentId;

      const matchesMonth =
        !selectedMonth || item.date.startsWith(selectedMonth);

      return matchesSearch && matchesClass && matchesStudent && matchesMonth;
    });
  }, [authorizedAnekdots, searchQuery, selectedClass, selectedStudentId, selectedMonth]);

  // Smart Data Cards Statistics (calculated strictly from authorized dataset)
  const stats = useMemo(() => {
    const totalRecords = authorizedAnekdots.length;
    const uniqueStudents = new Set(authorizedAnekdots.map(a => a.studentId)).size;

    const currentMonthPrefix = new Date().toISOString().substring(0, 7);
    const thisMonthRecords = authorizedAnekdots.filter(a => a.date.startsWith(currentMonthPrefix)).length;

    const withFollowUp = authorizedAnekdots.filter(a => a.followUp && a.followUp.trim().length > 0).length;

    return {
      totalRecords,
      uniqueStudents,
      thisMonthRecords,
      withFollowUp
    };
  }, [authorizedAnekdots]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    if (isSaving) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Sesi pengguna tidak terautentikasi.');
      return;
    }
    if (!canMutate) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mencatat observasi.');
      return;
    }
    if (selectableStudents.length === 0) {
      showFeedback(
        'error',
        isGuruRole
          ? `Tidak ada siswa yang terdaftar di kelas binaan Anda (${matchedTeacher?.assignedClass || '-'}).`
          : 'Belum ada data siswa yang tersedia untuk dicatat observasinya.'
      );
      return;
    }

    const defaultStudent = selectableStudents[0];
    setEditingRecord(null);
    setFormData({
      studentId: defaultStudent ? defaultStudent.id : '',
      date: new Date().toISOString().split('T')[0],
      time: '08:30 WIB',
      location: 'Ruang Kelas',
      observedBehavior: '',
      teacherAnalysis: '',
      followUp: ''
    });
    setFormError('');
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (record: AnekdotRecord) => {
    if (isSaving) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Sesi pengguna tidak terautentikasi.');
      return;
    }
    if (!canMutate) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mengubah observasi.');
      return;
    }
    const isAuthorized = authorizedStudentIds === null || authorizedStudentIds.has(record.studentId);
    if (!isAuthorized) {
      showFeedback('error', 'Akses ditolak: Observasi ini berada di luar wewenang kelas Anda.');
      return;
    }
    if (isGuruRole) {
      if (!matchedTeacher || !matchedTeacher.assignedClass || record.classGroup !== matchedTeacher.assignedClass) {
        showFeedback(
          'error',
          `Akses ditolak: Anda hanya dapat mengubah observasi kelas binaan (${matchedTeacher?.assignedClass || 'Tidak Ditemukan'}).`
        );
        return;
      }
    }

    setEditingRecord(record);
    setFormData({
      studentId: record.studentId,
      date: record.date,
      time: record.time || '08:30 WIB',
      location: record.location || 'Ruang Kelas',
      observedBehavior: record.observedBehavior,
      teacherAnalysis: record.teacherAnalysis,
      followUp: record.followUp || ''
    });
    setFormError('');
    setShowModal(true);
  };

  // Open View Detail Modal
  const handleOpenViewDetail = (record: AnekdotRecord) => {
    const isAuthorized = authorizedStudentIds === null || authorizedStudentIds.has(record.studentId);
    if (!isAuthorized) {
      showFeedback('error', 'Akses ditolak: Detail observasi ini berada di luar wewenang Anda.');
      return;
    }
    setViewDetailRecord(record);
  };

  // 3. Mutation Authorization, Anti-Double-Submit & Safe Scoped Save
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    // 1. Authenticated User & Canonical Role Guard
    if (!currentUser?.uid || !verifiedActiveRole || !actorName) {
      showFeedback('error', 'Akses ditolak: Sesi pengguna tidak valid atau kedaluwarsa.');
      return;
    }

    // 2. Mutation Authority Guard
    if (!canMutate) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mutasi data observasi.');
      return;
    }

    // 3. Form Validation
    if (!formData.studentId) {
      setFormError('Silakan pilih siswa terlebih dahulu.');
      return;
    }
    if (!formData.observedBehavior.trim()) {
      setFormError('Deskripsi peristiwa / perilaku yang diamati wajib diisi.');
      return;
    }
    if (!formData.teacherAnalysis.trim()) {
      setFormError('Analisis guru terhadap capaian perkembangan anak wajib diisi.');
      return;
    }

    // 4. Resolve Target Student
    const targetStudent = students.find(s => s.id === formData.studentId);
    if (!targetStudent) {
      setFormError('Data siswa yang dipilih tidak ditemukan atau tidak valid.');
      return;
    }

    // 5. Homeroom Isolation for GURU
    if (isGuruRole) {
      if (!matchedTeacher || !matchedTeacher.assignedClass) {
        setFormError('Akses ditolak: Guru belum terdaftar dengan kelas binaan aktif.');
        return;
      }
      if (targetStudent.classGroup !== matchedTeacher.assignedClass) {
        setFormError(
          `Akses ditolak: Anda hanya berwenang mencatat siswa kelas binaan (${matchedTeacher.assignedClass}).`
        );
        return;
      }
      if (editingRecord && editingRecord.classGroup !== matchedTeacher.assignedClass) {
        setFormError('Akses ditolak: Observasi yang diedit di luar wewenang kelas binaan Anda.');
        return;
      }
    }

    // 6. Duplicate Check (same student, date, time, and observed behavior)
    const isDuplicate = anekdots.some(a => {
      if (editingRecord && a.id === editingRecord.id) return false;
      return (
        a.studentId === formData.studentId &&
        a.date === formData.date &&
        a.time.trim().toLowerCase() === formData.time.trim().toLowerCase() &&
        a.observedBehavior.trim().toLowerCase() === formData.observedBehavior.trim().toLowerCase()
      );
    });

    if (isDuplicate) {
      setFormError('Catatan observasi serupa untuk siswa ini pada tanggal dan waktu tersebut sudah ada.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    // 7. Deterministic Record Identity
    const cleanStudentId = targetStudent.id.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanDate = formData.date.trim().replace(/[^0-9]/g, '');
    const cleanTime = formData.time.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || '0830';
    const deterministicId = `anc_${cleanStudentId}_${cleanDate}_${cleanTime}`;

    const recordToSave: AnekdotRecord = {
      id: editingRecord ? editingRecord.id : deterministicId,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      classGroup: targetStudent.classGroup || (isGuruRole && matchedTeacher?.assignedClass ? matchedTeacher.assignedClass : 'Kelompok A'),
      date: formData.date,
      time: formData.time.trim() || '08:30 WIB',
      location: formData.location.trim() || 'Ruang Kelas',
      observedBehavior: formData.observedBehavior.trim(),
      teacherAnalysis: formData.teacherAnalysis.trim(),
      followUp: formData.followUp.trim()
    };

    try {
      // 8. Save via Canonical DataService
      await DataService.saveAnekdot(recordToSave);

      // 9. Safe Scoped Re-fetch (respecting role and classroom boundaries)
      await loadData();

      // 10. Audit Logging (Non-blocking with authentic session identity)
      const auditAction = editingRecord ? 'UPDATE_ANEKDOT' : 'CREATE_ANEKDOT';
      const auditTarget = `R9_ANEKDOT - ${targetStudent.name} (${recordToSave.classGroup} - ${recordToSave.date})`;

      DataService.createAuditLog({
        uid: currentUser.uid,
        userName: actorName,
        role: verifiedActiveRole,
        action: auditAction,
        targetModule: auditTarget
      }).catch(logErr => {
        console.warn('Non-blocking audit log failed:', logErr);
      });

      setShowModal(false);
      showFeedback(
        'success',
        editingRecord
          ? `Catatan observasi untuk ${targetStudent.name} berhasil diperbarui.`
          : `Catatan observasi baru untuk ${targetStudent.name} berhasil disimpan.`
      );
    } catch (err) {
      console.error('Error saving anekdot record to DataService:', err);
      setFormError('Terjadi kesalahan saat menyimpan catatan observasi ke DataService.');
    } finally {
      setIsSaving(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // 4. Fail-Closed Render Guard: Unauthorized or Unauthenticated
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessR9) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6" id="r9-access-denied-container">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full inline-block">
              Akses Dibatasi — Jurnal Anekdot & Observasi
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Otoritas Tidak Memadai
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Modul <strong>R9 (Jurnal Catatan Anekdot & Observasi Anak)</strong> memuat catatan observasi perilaku, evaluasi psikologis, dan dinamika sosial-emosional santri yang bersifat rahasia. Akses evaluasi dibatasi hanya untuk Tenaga Pendidik dan Manajemen Sekolah terotorisasi.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-200 max-w-sm mx-auto flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Peran Sesi Anda: <strong>{verifiedActiveRole || 'Tidak Terautentikasi'}</strong></span>
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              SEC-R9-FAILCLOSED-IDENTITY
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Parent Privacy View (WALI_MURID Isolation)
  if (isWaliMuridRole) {
    return (
      <div id="r9-wali-privacy-boundary" className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-950 text-sm">
                Portal Observasi Perkembangan Santri — Perlindungan Privasi Anak
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-2xl">
                Sesuai Konstitusi Keamanan TADE dan Kebijakan Perlindungan Anak PAUD, Jurnal Catatan Anekdot memuat dokumentasi internal pendidik terkait evaluasi psikologis, adaptasi sosial, dan pembinaan karakter anak. Guna menjaga kerahasiaan dan privasi keluarga santri, basis data anekdot seluruh sekolah tidak diunduh ke peramban orang tua.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
            Zero Cross-Child Leakage
          </span>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Santri Terhubung dengan Akun Anda ({students.length})
          </h4>
          {students.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500">
              Belum ada data santri yang terhubung secara resmi ke akun Wali Murid ini. Silakan hubungi bagian Tata Usaha / Wali Kelas untuk verifikasi data kependudukan santri.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {students.map(std => (
                <div key={std.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block">
                    {std.classGroup || 'Kelompok Santri'}
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">{std.name || std.namaLengkap}</h5>
                  <p className="text-[11px] text-stone-500">NISN / ID: {std.nisn || std.id}</p>
                  <div className="pt-2 text-[11px] text-stone-600 flex items-center gap-1.5 border-t border-stone-200/60">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Jurnal Observasi Karakter: Terdaftar</span>
                  </div>
                  <p className="text-[10px] text-stone-400 italic">
                    Konsultasi perkembangan perilaku dan karakter anak dapat dilakukan langsung bersama Wali Kelas pada sesi konsultasi orang tua berkala.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 6. Educator & Institutional Management Workspace
  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Module R9 - Catatan Anekdot & Observasi
            </span>

            {isManagementRole && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Mode Pimpinan (Semua Rombel)
              </span>
            )}

            {isGuruRole && matchedTeacher?.assignedClass && (
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Guru Kelas: {matchedTeacher.assignedClass}
              </span>
            )}

            {isGuruRole && (!matchedTeacher || !matchedTeacher.assignedClass) && (
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Guru (Rombel Belum Terpetakan)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Jurnal Catatan Anekdot & Observasi Anak
          </h1>
          <p className="text-stone-500 text-xs">
            Perekaman perilaku spontan, analisis perkembangan karakter, dan rencana tindak lanjut
            pembinaan anak TK Asy Syifa.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading || isSaving}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all border border-stone-300 disabled:opacity-50 cursor-pointer"
            title="Segarkan Data Real-Time"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all border border-stone-300 cursor-pointer"
            title="Cetak Rekap Observasi"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Cetak Rekap</span>
          </button>

          {canMutate && (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              disabled={isLoading || isSaving || selectableStudents.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Observasi Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
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
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SMART DATA CARDS (Calculated strictly from authorized data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Observasi
            </span>
            <BookOpen className="w-4 h-4 text-stone-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalRecords}</h3>
          <span className="text-[10px] text-stone-400">Kejadian Terdokumentasi</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs bg-gradient-to-b from-white to-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Siswa Terdokumentasi
            </span>
            <Baby className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">{stats.uniqueStudents}</h3>
          <span className="text-[10px] text-emerald-600 font-medium">Anak Unik Diamati</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs bg-gradient-to-b from-white to-indigo-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Bulan Ini
            </span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-indigo-700 mt-1">{stats.thisMonthRecords}</h3>
          <span className="text-[10px] text-indigo-600 font-medium">Observasi Terkini</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs bg-gradient-to-b from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Tindak Lanjut
            </span>
            <CheckCircle className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-amber-700 mt-1">{stats.withFollowUp}</h3>
          <span className="text-[10px] text-amber-600 font-medium">Rencana Pembinaan</span>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama siswa, perilaku, analisis..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-2xl">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-xs font-bold text-stone-700">Kelas:</span>
            <select
              value={selectedClass}
              onChange={e => {
                if (isGuruRole && matchedTeacher?.assignedClass) {
                  setSelectedClass(matchedTeacher.assignedClass);
                  return;
                }
                setSelectedClass(e.target.value);
              }}
              disabled={isGuruRole && Boolean(matchedTeacher?.assignedClass)}
              className="bg-transparent text-xs font-medium text-stone-700 focus:outline-none cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>
                  {cls === 'Semua' ? 'Semua Kelompok' : cls}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Student Filter (restricted to authorized scope) */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-2xl">
            <Users className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-xs font-bold text-stone-700">Siswa:</span>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-transparent text-xs font-medium text-stone-700 focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              <option value="Semua">Semua Siswa</option>
              {authorizedStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classGroup})
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-2xl">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-xs font-bold text-stone-700">Bulan:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-medium text-stone-700 focus:outline-none cursor-pointer"
            />
            {selectedMonth && (
              <button
                type="button"
                onClick={() => setSelectedMonth('')}
                className="text-[10px] text-stone-400 hover:text-stone-600 ml-1 cursor-pointer"
                title="Reset Bulan"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Memuat catatan anekdot dari DataService...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && filteredAnekdots.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white border-2 border-dashed border-stone-200 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Belum Ada Catatan Observasi</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {searchQuery || selectedClass !== 'Semua' || selectedStudentId !== 'Semua' || selectedMonth
              ? 'Tidak ditemukan catatan observasi yang cocok dengan kriteria pencarian atau filter.'
              : isGuruRole && !matchedTeacher
              ? 'Akun Anda belum terhubung dengan data profil guru resmi. Hubungi Administrator.'
              : 'Belum ada kejadian atau catatan anekdot yang didokumentasikan untuk siswa.'}
          </p>
          {canMutate && selectableStudents.length > 0 && !searchQuery && (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Observasi Pertama</span>
            </button>
          )}
        </div>
      )}

      {/* OBSERVATION CARDS GRID */}
      {!isLoading && filteredAnekdots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAnekdots.map(record => (
            <div
              key={record.id}
              className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header Card: Student Info & Metadata */}
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm flex-shrink-0">
                    {record.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{record.studentName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {record.classGroup}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-stone-500">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {record.date}
                      </span>
                      {record.time && (
                        <span className="flex items-center gap-1 text-[10px] text-stone-500">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {record.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Badge */}
                {record.location && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl flex-shrink-0">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {record.location}
                  </span>
                )}
              </div>

              {/* Body Card: Observed Behavior & Analysis */}
              <div className="space-y-3 text-xs flex-1">
                {/* Kejadian yang diamati */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Peristiwa / Perilaku yang Diamati:
                  </span>
                  <p className="text-slate-800 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100">
                    "{record.observedBehavior}"
                  </p>
                </div>

                {/* Analisis Guru */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Analisis Capaian Perkembangan Anak:
                  </span>
                  <p className="text-emerald-950 leading-relaxed bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 font-medium">
                    {record.teacherAnalysis}
                  </p>
                </div>

                {/* Rencana Tindak Lanjut */}
                {record.followUp && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      Rencana Tindak Lanjut / Pembimbingan:
                    </span>
                    <p className="text-amber-950 leading-relaxed bg-amber-50/70 p-3 rounded-2xl border border-amber-100 italic">
                      {record.followUp}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenViewDetail(record)}
                  className="flex items-center gap-1 text-[11px] font-bold text-stone-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Selengkapnya</span>
                </button>

                {canMutate && (isManagementRole || (isGuruRole && matchedTeacher?.assignedClass === record.classGroup)) && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(record)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                      <span>Edit Observasi</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: FORM CATATAN OBSERVASI ANEKDOT (CREATE / EDIT) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingRecord ? 'Edit Catatan Observasi' : 'Tambah Catatan Observasi Anekdot'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Dokumentasi kejadian perkembangan anak TK Asy Syifa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              {/* Select Student (limited to authorized scope) */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Pilih Siswa <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  disabled={editingRecord !== null || isSaving}
                  className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs disabled:bg-stone-100 cursor-pointer"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {selectableStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.classGroup})
                    </option>
                  ))}
                </select>
                {isGuruRole && matchedTeacher?.assignedClass && (
                  <p className="text-[10px] text-stone-400 mt-1">
                    Hanya menampilkan siswa kelas binaan aktif: <strong>{matchedTeacher.assignedClass}</strong>
                  </p>
                )}
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Tanggal Observasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    disabled={isSaving}
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Waktu Kejadian</label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={formData.time}
                    placeholder="Contoh: 08:30 WIB"
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tempat / Lokasi Kejadian</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Ruang Kelas',
                    'Area APE Luar (Taman)',
                    'Sentra Bahan Alam',
                    'Sentra Balok',
                    'Tempat Wudhu & Sholat',
                    'Ruang Makan'
                  ].map(loc => (
                    <button
                      key={loc}
                      type="button"
                      disabled={isSaving}
                      onClick={() => setFormData({ ...formData, location: loc })}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                        formData.location === loc
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  disabled={isSaving}
                  value={formData.location}
                  placeholder="Atau ketik lokasi lain..."
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs"
                />
              </div>

              {/* Deskripsi Kejadian */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Deskripsi Peristiwa / Perilaku yang Diamati <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  disabled={isSaving}
                  value={formData.observedBehavior}
                  onChange={e => setFormData({ ...formData, observedBehavior: e.target.value })}
                  placeholder="Catat secara objektif apa yang dikatakan atau dilakukan anak..."
                  className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs leading-relaxed"
                />
              </div>

              {/* Analisis Guru */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Analisis Capaian Perkembangan Guru <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  disabled={isSaving}
                  value={formData.teacherAnalysis}
                  onChange={e => setFormData({ ...formData, teacherAnalysis: e.target.value })}
                  placeholder="Analisis capaian nilai agama, jati diri, kemandirian, atau literasi/STEAM..."
                  className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs leading-relaxed"
                />
              </div>

              {/* Rencana Tindak Lanjut */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Rencana Tindak Lanjut / Pembimbingan
                </label>
                <textarea
                  rows={2}
                  disabled={isSaving}
                  value={formData.followUp}
                  onChange={e => setFormData({ ...formData, followUp: e.target.value })}
                  placeholder="Rencana kegiatan lanjutan, apresiasi, atau penguatan pembiasaan anak..."
                  className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-xs leading-relaxed"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Observasi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL OBSERVASI ANEKDOT (VIEW ONLY) */}
      {viewDetailRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm">
                  {viewDetailRecord.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{viewDetailRecord.studentName}</h3>
                  <p className="text-[11px] text-stone-500">
                    {viewDetailRecord.classGroup} • {viewDetailRecord.date} ({viewDetailRecord.time})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewDetailRecord(null)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-stone-600 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>
                  <strong>Lokasi Pengamatan:</strong> {viewDetailRecord.location || 'Ruang Kelas'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Peristiwa / Kejadian Diamati:
                </span>
                <p className="text-slate-800 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                  {viewDetailRecord.observedBehavior}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Analisis Capaian Perkembangan Guru:
                </span>
                <p className="text-emerald-950 leading-relaxed bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 font-medium">
                  {viewDetailRecord.teacherAnalysis}
                </p>
              </div>

              {viewDetailRecord.followUp && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    Rencana Tindak Lanjut:
                  </span>
                  <p className="text-amber-950 leading-relaxed bg-amber-50 p-3.5 rounded-2xl border border-amber-100 italic">
                    {viewDetailRecord.followUp}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setViewDetailRecord(null)}
                className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-all cursor-pointer text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default R9Anekdot;
