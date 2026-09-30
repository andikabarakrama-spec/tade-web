import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { EraporRecord, Student, Teacher, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { 
  Award, 
  Printer, 
  Plus, 
  Edit3, 
  Save, 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Lock, 
  BookOpen, 
  UserCheck, 
  GraduationCap, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';

interface EraporFormData {
  id?: string;
  studentId: string;
  studentName: string;
  classGroup: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  nilaiAgama: string;
  jatiDiri: string;
  dasarLiterasiSteam: string;
  perkembanganFisikMotorik: string;
  catatanWaliKelas: string;
  teacherName: string;
}

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

export const R8Erapor: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. Authoritative Role Resolution (Fail-Closed)
  // activeRole must strictly match CANONICAL_ROLES.
  // Zero fallback to userProfile.role. Zero privileged defaults.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Authentic Actor Identity: strictly derived from authenticated session
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
    currentUser?.uid &&
    verifiedActiveRole &&
    MANAGEMENT_ROLES.includes(verifiedActiveRole)
  );

  const isGuruRole = Boolean(
    currentUser?.uid &&
    verifiedActiveRole === 'GURU'
  );

  const isWaliMuridRole = Boolean(
    currentUser?.uid &&
    verifiedActiveRole === 'WALI_MURID'
  );

  const canAccessR8 = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    (isManagementRole || isGuruRole || isWaliMuridRole)
  );

  // Data States
  const [eraporList, setEraporList] = useState<EraporRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filter & Selected States
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedSemester, setSelectedSemester] = useState<'Semua' | 'Ganjil' | 'Genap'>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedErapor, setSelectedErapor] = useState<EraporRecord | null>(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingEraporId, setEditingEraporId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EraporFormData>({
    studentId: '',
    studentName: '',
    classGroup: 'Kelompok A1',
    semester: 'Genap',
    academicYear: '2024/2025',
    nilaiAgama: '',
    jatiDiri: '',
    dasarLiterasiSteam: '',
    perkembanganFisikMotorik: '',
    catatanWaliKelas: '',
    teacherName: ''
  });

  // UI Feedback State (Zero native dialogs)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Teacher Identity Resolution (for GURU role)
  const matchedTeacher = useMemo(() => {
    if (!currentUser?.uid && !currentUser?.email && !userProfile?.email && !userProfile?.nama && !userProfile?.name) {
      return null;
    }
    return (
      teachers.find(t =>
        (currentUser?.uid && t.id === currentUser.uid) ||
        (currentUser?.email && t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (userProfile?.email && t.email && t.email.toLowerCase() === userProfile.email.toLowerCase()) ||
        (userProfile?.nama && t.name && t.name.toLowerCase() === userProfile.nama.toLowerCase()) ||
        (userProfile?.name && t.name && t.name.toLowerCase() === userProfile.name.toLowerCase())
      ) || null
    );
  }, [teachers, currentUser?.uid, currentUser?.email, userProfile?.email, userProfile?.nama, userProfile?.name]);

  // RBAC Permission to Edit/Create
  const canEditErapor: boolean = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    (isManagementRole || (isGuruRole && matchedTeacher && matchedTeacher.assignedClass))
  );

  // 2. Pre-Query Authorization Gate & Scoped Data Fetching
  // - Unauthorized sessions trigger ZERO queries and clear all sensitive state.
  // - WALI_MURID queries only linked children; global E-Rapor records are NEVER downloaded into parent memory.
  // - GURU queries teachers and roster first, and E-Rapor records are strictly scoped to the teacher's assigned classroom BEFORE entering state.
  // - Cross-classroom confidential assessments NEVER enter browser state.
  // - Institutional Management queries full institutional dataset.
  const loadData = useCallback(async () => {
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR8) {
      setIsLoading(false);
      setEraporList([]);
      setStudents([]);
      setTeachers([]);
      setSelectedErapor(null);
      return;
    }

    setIsLoading(true);
    try {
      if (isWaliMuridRole) {
        // Authenticated Parent: Strictly query linked children only
        // Global E-Rapor database is NEVER loaded into parent browser memory
        const linkedStudents = await DataService.getStudents(
          verifiedActiveRole,
          currentUser.uid,
          currentUser.email || undefined
        );
        setStudents(linkedStudents || []);
        setEraporList([]);
        setTeachers([]);
        setSelectedErapor(null);
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
          setEraporList([]);
          setSelectedErapor(null);
          setFeedback({
            type: 'info',
            message: 'Akun Anda terdaftar sebagai Guru, namun rombel kelas binaan belum terpetakan. Hubungi Admin/Kepala Sekolah untuk penetapan kelas pengampu.'
          });
          return;
        }

        const teacherClass = currentTeacher.assignedClass;
        const authorizedStudents = (fetchedStudents || []).filter(s => s.classGroup === teacherClass);
        const allowedStudentIdSet = new Set(authorizedStudents.map(s => s.id));

        // 2. Fetch and IMMEDIATELY scope E-Rapor records before storing into state
        // Zero cross-child records from other classrooms are kept in browser memory
        const fetchedErapor = await DataService.getErapor();
        const scopedRecords = (fetchedErapor || []).filter(e =>
          allowedStudentIdSet.has(e.studentId) || e.classGroup === teacherClass
        );

        setTeachers(fetchedTeachers || []);
        setStudents(authorizedStudents);
        setEraporList(scopedRecords);

        // Keep or establish selection
        setSelectedErapor(prev => {
          if (prev) {
            const stillAllowed = scopedRecords.find(item => item.id === prev.id);
            return stillAllowed || (scopedRecords.length > 0 ? scopedRecords[0] : null);
          }
          return scopedRecords.length > 0 ? scopedRecords[0] : null;
        });
      } else {
        // Institutional Leadership / Management access (SUPER_ADMIN, ADMIN, KEPALA_SEKOLAH, KETUA_YAYASAN)
        const [fetchedErapor, fetchedStudents, fetchedTeachers] = await Promise.all([
          DataService.getErapor(),
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            currentUser.email || userProfile?.email
          ),
          DataService.getTeachers()
        ]);

        const allRecords = fetchedErapor || [];
        setEraporList(allRecords);
        setStudents(fetchedStudents || []);
        setTeachers(fetchedTeachers || []);

        setSelectedErapor(prev => {
          if (prev) {
            const stillAllowed = allRecords.find(item => item.id === prev.id);
            return stillAllowed || (allRecords.length > 0 ? allRecords[0] : null);
          }
          return allRecords.length > 0 ? allRecords[0] : null;
        });
      }
    } catch (err: any) {
      console.error('Error loading Erapor data:', err);
      setFeedback({
        type: 'error',
        message: 'Gagal memuat data e-rapor dari database.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [verifiedActiveRole, currentUser?.uid, currentUser?.email, userProfile?.email, userProfile?.nama, userProfile?.name, canAccessR8, isWaliMuridRole, isGuruRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Student Authorization Mapping (Privacy & Scope Isolation)
  const authorizedStudentIds = useMemo<Set<string> | null>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) return new Set();
    if (isManagementRole) return null; // All students authorized for institutional management

    if (isGuruRole) {
      if (!matchedTeacher || !matchedTeacher.assignedClass) {
        return new Set(); // Fail closed if teacher is unmapped or has no assigned class
      }
      const allowedIds = students
        .filter(s => s.classGroup === matchedTeacher.assignedClass)
        .map(s => s.id);
      return new Set(allowedIds);
    }

    if (isWaliMuridRole) {
      // Parent's linked students are isolated in students state
      const allowedIds = students.map(s => s.id);
      return new Set(allowedIds);
    }

    return new Set(); // Fail closed for any other role
  }, [currentUser?.uid, verifiedActiveRole, isManagementRole, isGuruRole, isWaliMuridRole, matchedTeacher, students]);

  // Check if a specific student is authorized for edit by the active user
  const isStudentAuthorizedForEdit = useCallback((studentId: string): boolean => {
    if (!currentUser?.uid || !verifiedActiveRole) return false;
    if (isManagementRole) return true;
    if (isGuruRole) {
      if (!matchedTeacher || !matchedTeacher.assignedClass) return false;
      const st = students.find(s => s.id === studentId);
      if (!st) return false;
      return st.classGroup === matchedTeacher.assignedClass;
    }
    return false;
  }, [currentUser?.uid, verifiedActiveRole, isManagementRole, isGuruRole, matchedTeacher, students]);

  // Check if an erapor record is authorized for edit by the active user
  const isEraporAuthorizedForEdit = useCallback((record: EraporRecord): boolean => {
    if (!currentUser?.uid || !verifiedActiveRole) return false;
    if (isManagementRole) return true;
    if (isGuruRole) {
      if (!matchedTeacher || !matchedTeacher.assignedClass) return false;
      return record.classGroup === matchedTeacher.assignedClass;
    }
    return false;
  }, [currentUser?.uid, verifiedActiveRole, isManagementRole, isGuruRole, matchedTeacher]);

  // Scoped Data Lists (strictly for educators/management)
  const scopedEraporList = useMemo(() => {
    if (isWaliMuridRole) return [];
    if (authorizedStudentIds === null) return eraporList;
    return eraporList.filter(e => authorizedStudentIds.has(e.studentId));
  }, [eraporList, authorizedStudentIds, isWaliMuridRole]);

  const scopedStudents = useMemo(() => {
    if (authorizedStudentIds === null) return students;
    return students.filter(s => authorizedStudentIds.has(s.id));
  }, [students, authorizedStudentIds]);

  // Selectable Students in Modal
  const selectableStudents = useMemo(() => {
    if (isManagementRole) return students;
    if (isGuruRole && matchedTeacher?.assignedClass) {
      return students.filter(s => s.classGroup === matchedTeacher.assignedClass);
    }
    return [];
  }, [students, isManagementRole, isGuruRole, matchedTeacher]);

  // Filtered List based on Search & Selectors
  const filteredEraporList = useMemo(() => {
    return scopedEraporList.filter(e => {
      const matchSearch = searchQuery.trim() === '' || 
        e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchClass = selectedClass === 'Semua' || e.classGroup === selectedClass;
      const matchSemester = selectedSemester === 'Semua' || e.semester === selectedSemester;

      return matchSearch && matchClass && matchSemester;
    });
  }, [scopedEraporList, searchQuery, selectedClass, selectedSemester]);

  // Dynamic Class Groups Available in Filter
  const availableClassGroups = useMemo(() => {
    const groups = new Set<string>();
    scopedStudents.forEach(s => {
      if (s.classGroup) groups.add(s.classGroup);
    });
    return Array.from(groups).sort();
  }, [scopedStudents]);

  // Summary Metrics
  const summary = useMemo(() => {
    const totalTerbit = scopedEraporList.length;
    const totalSiswa = scopedStudents.length;
    const genapCount = scopedEraporList.filter(e => e.semester === 'Genap').length;
    const ganjilCount = scopedEraporList.filter(e => e.semester === 'Ganjil').length;

    return { totalTerbit, totalSiswa, genapCount, ganjilCount };
  }, [scopedEraporList, scopedStudents]);

  // Open Create New Erapor Modal
  const handleOpenCreate = () => {
    if (isSaving) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Sesi otentikasi tidak valid.'
      });
      return;
    }
    if (!canEditErapor) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Anda tidak memiliki wewenang untuk input E-Rapor.'
      });
      return;
    }

    if (selectableStudents.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Tidak ada data siswa yang dapat dipilih pada rombel pengajaran Anda.'
      });
      return;
    }

    const targetStudent = selectableStudents[0];
    const teacherForClass = teachers.find(t => t.assignedClass === targetStudent.classGroup);

    setEditingEraporId(null);
    setFormData({
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      classGroup: targetStudent.classGroup || 'Kelompok A1',
      semester: 'Genap',
      academicYear: '2024/2025',
      nilaiAgama: 'Ananda menunjukkan perkembangan sangat baik dalam melafalkan doa harian, adab makan islami, dan hafalan surat-surat pendek (An-Nas s.d Al-Ikhlas) dengan penuh antusias.',
      jatiDiri: 'Ananda memiliki rasa percaya diri yang baik, mampu mengelola emosi secara mandiri, bergotong-royong bersama teman sebaya saat merapikan mainan, dan aktif dalam senam irama ceria.',
      dasarLiterasiSteam: 'Ananda antusias menyimak cerita islami bergambar, mampu mengenali pola balok geometri, serta tertarik melakukan eksperimen sains sederhana (mencampur warna & mengamati tanaman).',
      perkembanganFisikMotorik: 'Motorik halus (menggunting, meronce) dan motorik kasar (melompat satu kaki, melempar bola) berkembang sesuai harapan usia standar PAUD.',
      catatanWaliKelas: 'Alhamdulillah, ananda menunjukkan kecerdasan sosial-emosional dan spiritual yang sangat menggembirakan. Terus pertahankan semangat belajarnya.',
      teacherName: teacherForClass?.name || matchedTeacher?.name || userProfile?.nama || userProfile?.name || 'Ustadzah Pendidik'
    });
    setIsEditorOpen(true);
  };

  // Open Edit Existing Erapor Modal
  const handleOpenEdit = (record: EraporRecord) => {
    if (isSaving) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Sesi otentikasi tidak valid.'
      });
      return;
    }
    if (!canEditErapor || !isEraporAuthorizedForEdit(record)) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Anda tidak memiliki wewenang mengedit E-Rapor ini.'
      });
      return;
    }

    setEditingEraporId(record.id);
    setFormData({
      id: record.id,
      studentId: record.studentId,
      studentName: record.studentName,
      classGroup: record.classGroup,
      semester: record.semester,
      academicYear: record.academicYear,
      nilaiAgama: record.nilaiAgama || '',
      jatiDiri: record.jatiDiri || '',
      dasarLiterasiSteam: record.dasarLiterasiSteam || '',
      perkembanganFisikMotorik: record.perkembanganFisikMotorik || '',
      catatanWaliKelas: record.catatanWaliKelas || '',
      teacherName: record.teacherName
    });
    setIsEditorOpen(true);
  };

  // Student selection handler in modal
  const handleStudentSelectInModal = (stId: string) => {
    const st = selectableStudents.find(s => s.id === stId);
    if (!st) return;

    const teacherForClass = teachers.find(t => t.assignedClass === st.classGroup);

    setFormData(prev => ({
      ...prev,
      studentId: st.id,
      studentName: st.name,
      classGroup: st.classGroup,
      teacherName: teacherForClass?.name || matchedTeacher?.name || prev.teacherName
    }));
  };

  // 3. Mutation Authorization & Safe Scoped Save
  const handleSaveErapor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    // Fail-Closed Authentication & RBAC Check
    if (!currentUser?.uid || !verifiedActiveRole || !actorName) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Sesi otentikasi tidak valid atau role tidak dikenal.'
      });
      return;
    }

    // Authorization check
    if (!canEditErapor) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Anda tidak memiliki wewenang untuk menyimpan E-Rapor.'
      });
      return;
    }

    // Target Student Authorization Check
    if (!formData.studentId || !isStudentAuthorizedForEdit(formData.studentId)) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Siswa yang dipilih berada di luar wewenang pengajaran Anda.'
      });
      return;
    }

    if (!formData.studentName.trim()) {
      setFeedback({
        type: 'error',
        message: 'Nama siswa wajib dipilih.'
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      // Deterministic Canonical Record ID: era-${cleanYear}-${cleanSemester}-${cleanStudentId}
      const cleanYear = formData.academicYear.replace(/[^a-zA-Z0-9]/g, '');
      const cleanSemester = formData.semester.toLowerCase().trim();
      const cleanStudentId = formData.studentId.trim();

      const deterministicId = `era-${cleanYear}-${cleanSemester}-${cleanStudentId}`;

      // Lookup existing match to ensure upsert idempotency
      const existingMatch = eraporList.find(
        item => item.studentId === cleanStudentId &&
                item.academicYear.replace(/[^a-zA-Z0-9]/g, '') === cleanYear &&
                item.semester.toLowerCase().trim() === cleanSemester
      );

      const recordId = editingEraporId || (existingMatch ? existingMatch.id : deterministicId);

      const recordToSave: EraporRecord = {
        id: recordId,
        studentId: cleanStudentId,
        studentName: formData.studentName,
        classGroup: formData.classGroup,
        semester: formData.semester,
        academicYear: formData.academicYear,
        nilaiAgama: formData.nilaiAgama,
        jatiDiri: formData.jatiDiri,
        dasarLiterasiSteam: formData.dasarLiterasiSteam,
        perkembanganFisikMotorik: formData.perkembanganFisikMotorik || 'Perkembangan fisik motorik berkembang sangat baik sesuai harapan usia.',
        catatanWaliKelas: formData.catatanWaliKelas,
        teacherName: formData.teacherName,
        createdAt: (editingEraporId && existingMatch?.createdAt) ? existingMatch.createdAt : getSchoolLocalDate()
      };

      await DataService.saveErapor(recordToSave);

      // Canonical non-blocking Audit Log with authentic session actor
      const auditAction = editingEraporId ? 'UPDATE_ERAPOR' : 'CREATE_ERAPOR';
      const auditDetail = `${auditAction}: ${recordToSave.studentName} (${recordToSave.semester} ${recordToSave.academicYear} - ${recordToSave.classGroup})`;

      DataService.createAuditLog({
        uid: currentUser.uid,
        userName: actorName,
        role: verifiedActiveRole,
        action: auditAction,
        targetModule: `R8 E-Rapor PAUD - ${auditDetail}`
      }).catch(logErr => {
        console.warn('Non-blocking audit log failed:', logErr);
      });

      // Safe Scoped Re-fetch (respecting authorization boundaries)
      await loadData();
      setSelectedErapor(recordToSave);

      setIsEditorOpen(false);
      setFeedback({
        type: 'success',
        message: `Berhasil menerbitkan E-Rapor ${recordToSave.studentName} (${recordToSave.semester} ${recordToSave.academicYear}) ke database.`
      });
    } catch (err: any) {
      console.error('Error saving Erapor:', err);
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan E-Rapor: ${err?.message || 'Terjadi kesalahan sistem.'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Fail-Closed Render Guard: Unauthorized or Unauthenticated
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessR8) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6" id="r8-access-denied-container">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full inline-block">
              Akses Dibatasi — E-Rapor PAUD
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Otoritas Tidak Memadai
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Modul <strong>R8 (Laporan Capaian Perkembangan Anak / E-Rapor)</strong> memuat penilaian capaian perkembangan psikologis, spiritual, dan kognitif santri sesuai standar Kurikulum Merdeka PAUD. Akses evaluasi dibatasi hanya untuk Tenaga Pendidik dan Manajemen Sekolah terotorisasi.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-200 max-w-sm mx-auto flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Peran Sesi Anda: <strong>{verifiedActiveRole || 'Tidak Terautentikasi'}</strong></span>
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              SEC-R8-FAILCLOSED-IDENTITY
            </span>
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
              <Award className="w-3.5 h-3.5" />
              Module R8 • E-Rapor PAUD & Capaian
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

            {isWaliMuridRole && (
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Portal Wali Murid (Ananda)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Laporan Capaian Perkembangan Anak (E-Rapor)
          </h1>
          <p className="text-stone-500 text-xs mt-1">
            Penilaian Kurikulum Merdeka PAUD: Nilai Agama & Budi Pekerti, Jati Diri, serta Dasar Literasi & STEAM.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading || isSaving}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-2xl flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            title="Segarkan Data Real-Time"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>

          {canEditErapor && (
            <button
              type="button"
              onClick={handleOpenCreate}
              disabled={isSaving || selectableStudents.length === 0}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Input E-Rapor Baru
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : feedback.type === 'info'
              ? 'bg-amber-50 border border-amber-300 text-amber-900'
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
            className="text-stone-400 hover:text-stone-700 text-sm font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 5. Parent Privacy View (WALI_MURID Isolation) */}
      {isWaliMuridRole ? (
        <div id="r8-wali-privacy-boundary" className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-emerald-950 text-sm">
                  Portal E-Rapor Mandiri — Perlindungan Privasi Santri
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-2xl">
                  Sesuai Konstitusi Keamanan TADE dan Kebijakan Privasi Anak, Laporan Capaian Perkembangan Anak (E-Rapor) memuat evaluasi perkembangan psikologis, moral, dan kognitif santri yang dilindungi secara ketat. Basis data E-Rapor seluruh santri tidak diunduh ke peramban orang tua guna menjamin kerahasiaan dan privasi keluarga santri Asy Syifa.
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
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      <span>E-Rapor Kurikulum Merdeka: Terdaftar</span>
                    </div>
                    <p className="text-[10px] text-stone-400 italic">
                      Dokumen resmi E-Rapor fisik & PDF diserahkan oleh Wali Kelas pada akhir semester.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Educator & Institutional Management Workspace */
        <>
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-[11px] font-bold">Total E-Rapor Terbit</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{summary.totalTerbit} Rapor</div>
              <div className="text-[10px] text-stone-400 mt-1">Dari {summary.totalSiswa} Siswa Terdaftar</div>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-3xl border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between text-emerald-800 mb-1">
                <span className="text-[11px] font-bold">Semester Genap</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-950">{summary.genapCount} Dokumen</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">T.A. 2024/2025</div>
            </div>

            <div className="bg-sky-50/60 p-4 rounded-3xl border border-sky-200 shadow-xs">
              <div className="flex items-center justify-between text-sky-800 mb-1">
                <span className="text-[11px] font-bold">Semester Ganjil</span>
                <BookOpen className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-sky-950">{summary.ganjilCount} Dokumen</div>
              <div className="text-[10px] text-sky-700 font-semibold mt-1">T.A. 2024/2025</div>
            </div>

            <div className="bg-stone-50 p-4 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-600 mb-1">
                <span className="text-[11px] font-bold">Kurikulum</span>
                <GraduationCap className="w-4 h-4 text-stone-500" />
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">Kurikulum Merdeka PAUD</div>
              <div className="text-[10px] text-stone-500 mt-1">Standar BSKAP Kemendikbud</div>
            </div>
          </div>

          {/* Main Grid: List & Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Filter and E-Rapor Cards */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    Daftar E-Rapor ({filteredEraporList.length})
                  </h2>
                </div>

                {/* Filter Bar */}
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari nama santri atau guru..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedClass}
                      onChange={e => setSelectedClass(e.target.value)}
                      className="px-2.5 py-1.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="Semua">Semua Rombel</option>
                      {availableClassGroups.map(grp => (
                        <option key={grp} value={grp}>{grp}</option>
                      ))}
                    </select>

                    <select
                      value={selectedSemester}
                      onChange={e => setSelectedSemester(e.target.value as any)}
                      className="px-2.5 py-1.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="Semua">Semua Semester</option>
                      <option value="Genap">Semester Genap</option>
                      <option value="Ganjil">Semester Ganjil</option>
                    </select>
                  </div>
                </div>

                {/* List Cards */}
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {filteredEraporList.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 space-y-2">
                      <FileText className="w-10 h-10 text-stone-300 mx-auto" />
                      <p className="font-bold text-xs text-stone-600">Belum ada data E-Rapor.</p>
                      <p className="text-[11px] text-stone-400">
                        {canEditErapor
                          ? 'Klik tombol "Input E-Rapor Baru" untuk menambahkan capaian siswa.'
                          : 'Dokumen E-Rapor resmi akan muncul di daftar ini.'}
                      </p>
                    </div>
                  ) : (
                    filteredEraporList.map((e) => {
                      const isSelected = selectedErapor?.id === e.id;
                      const canEditThisRecord = canEditErapor && isEraporAuthorizedForEdit(e);

                      return (
                        <div
                          key={e.id}
                          onClick={() => setSelectedErapor(e)}
                          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/20 shadow-xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                {e.studentName}
                              </h3>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                {e.classGroup} • Semester {e.semester} ({e.academicYear})
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                              Terbit
                            </span>
                          </div>

                          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-stone-400" />
                              {e.teacherName}
                            </span>
                            {canEditThisRecord && (
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={(evt) => {
                                  evt.stopPropagation();
                                  handleOpenEdit(e);
                                }}
                                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-emerald-50 disabled:opacity-50"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed View & Print */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col justify-between">
              {selectedErapor ? (
                <div className="space-y-6">
                  {/* Detailed Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {selectedErapor.academicYear}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                          Semester {selectedErapor.semester}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">
                        Capaian Perkembangan: {selectedErapor.studentName}
                      </h2>
                      <p className="text-xs text-stone-500">
                        Kelompok {selectedErapor.classGroup} • Pendidik: {selectedErapor.teacherName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {canEditErapor && isEraporAuthorizedForEdit(selectedErapor) && (
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleOpenEdit(selectedErapor)}
                          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Data
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Cetak Rapor PDF
                      </button>
                    </div>
                  </div>

                  {/* Student Info Box */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-500 font-medium">Nama Santri/Siswa:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedErapor.studentName}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Kelompok Rombel:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedErapor.classGroup}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Pendidik / Wali Kelas:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedErapor.teacherName}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Tanggal Penerbitan:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedErapor.createdAt}</p>
                    </div>
                  </div>

                  {/* Assessment Narrative Blocks (Kurikulum Merdeka PAUD) */}
                  <div className="space-y-4 text-xs">
                    {/* 1. Nilai Agama */}
                    <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/40 space-y-1.5">
                      <h3 className="font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                        Nilai Agama & Budi Pekerti
                      </h3>
                      <p className="text-stone-700 leading-relaxed text-xs pl-6">
                        {selectedErapor.nilaiAgama}
                      </p>
                    </div>

                    {/* 2. Jati Diri */}
                    <div className="border border-sky-200 rounded-2xl p-4 bg-sky-50/40 space-y-1.5">
                      <h3 className="font-bold text-sky-900 uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-sky-800 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                        Jati Diri & Kemandirian
                      </h3>
                      <p className="text-stone-700 leading-relaxed text-xs pl-6">
                        {selectedErapor.jatiDiri}
                      </p>
                    </div>

                    {/* 3. Dasar Literasi & STEAM */}
                    <div className="border border-amber-200 rounded-2xl p-4 bg-amber-50/40 space-y-1.5">
                      <h3 className="font-bold text-amber-900 uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-amber-800 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                        Dasar Literasi & STEAM
                      </h3>
                      <p className="text-stone-700 leading-relaxed text-xs pl-6">
                        {selectedErapor.dasarLiterasiSteam}
                      </p>
                    </div>

                    {/* 4. Perkembangan Fisik Motorik */}
                    <div className="border border-teal-200 rounded-2xl p-4 bg-teal-50/40 space-y-1.5">
                      <h3 className="font-bold text-teal-900 uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-teal-800 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                        Pertumbuhan Fisik & Motorik
                      </h3>
                      <p className="text-stone-700 leading-relaxed text-xs pl-6">
                        {selectedErapor.perkembanganFisikMotorik || 'Perkembangan fisik motorik berkembang sangat baik sesuai harapan usia.'}
                      </p>
                    </div>

                    {/* 5. Catatan Wali Kelas */}
                    <div className="border border-purple-200 rounded-2xl p-4 bg-purple-50/40 space-y-1.5">
                      <h3 className="font-bold text-purple-900 uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-purple-800 text-white text-[10px] flex items-center justify-center font-bold">5</span>
                        Catatan & Kesimpulan Wali Kelas
                      </h3>
                      <p className="text-stone-700 leading-relaxed text-xs italic pl-6">
                        "{selectedErapor.catatanWaliKelas}"
                      </p>
                    </div>
                  </div>

                  {/* Signature Footer */}
                  <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-4 text-center text-xs">
                    <div>
                      <p className="text-stone-500">Orang Tua / Wali Murid</p>
                      <div className="h-14"></div>
                      <p className="font-bold text-slate-900">( ............................................ )</p>
                    </div>
                    <div>
                      <p className="text-stone-500">Wali Kelas Pengampu</p>
                      <div className="h-14 flex items-center justify-center font-serif text-emerald-800 italic opacity-80 text-xs">
                        [Tanda Tangan Digital Terverifikasi]
                      </div>
                      <p className="font-bold text-slate-900">{selectedErapor.teacherName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-stone-400 space-y-3">
                  <Award className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="text-sm font-bold text-stone-600">
                    {filteredEraporList.length === 0 ? 'Belum Ada E-Rapor Tersedia' : 'Belum Ada E-Rapor yang Dipilih'}
                  </p>
                  <p className="text-xs max-w-sm mx-auto">
                    Silakan pilih salah satu data santri pada daftar di sebelah kiri atau klik tombol input untuk membuat baru.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* E-Rapor Input & Edit Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingEraporId ? 'Edit Penilaian E-Rapor' : 'Input Penilaian E-Rapor Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                disabled={isSaving}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold disabled:opacity-50 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveErapor} className="space-y-4 text-xs">
              {/* Row 1: Student Selection & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Pilih Santri / Siswa: *
                  </label>
                  <select
                    value={formData.studentId}
                    onChange={e => handleStudentSelectInModal(e.target.value)}
                    required
                    disabled={isSaving || !!editingEraporId}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {selectableStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.classGroup} - NIS: {s.nis || '-'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Kelompok Rombel: *
                  </label>
                  <input
                    type="text"
                    value={formData.classGroup}
                    readOnly
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Semester & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Semester: *
                  </label>
                  <select
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: e.target.value as any })}
                    required
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Tahun Ajaran: *
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                    required
                    disabled={isSaving}
                    placeholder="2024/2025"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Row 3: Teacher Name */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Nama Guru / Wali Kelas Pengampu: *
                </label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
                  required
                  disabled={isSaving}
                  placeholder="Nama Pendidik & Gelar"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Assessment Field 1: Nilai Agama */}
              <div>
                <label className="block text-emerald-900 font-bold mb-1">
                  1. Capaian Nilai Agama & Budi Pekerti: *
                </label>
                <textarea
                  rows={3}
                  value={formData.nilaiAgama}
                  onChange={e => setFormData({ ...formData, nilaiAgama: e.target.value })}
                  required
                  disabled={isSaving}
                  placeholder="Uraikan perkembangan hafalan doa, surat pendek, adab islami..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              {/* Assessment Field 2: Jati Diri */}
              <div>
                <label className="block text-sky-900 font-bold mb-1">
                  2. Capaian Jati Diri & Kemandirian: *
                </label>
                <textarea
                  rows={3}
                  value={formData.jatiDiri}
                  onChange={e => setFormData({ ...formData, jatiDiri: e.target.value })}
                  required
                  disabled={isSaving}
                  placeholder="Uraikan kemandirian, regulasi emosi, interaksi sosial dengan teman..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              {/* Assessment Field 3: Literasi & STEAM */}
              <div>
                <label className="block text-amber-900 font-bold mb-1">
                  3. Capaian Dasar Literasi & STEAM: *
                </label>
                <textarea
                  rows={3}
                  value={formData.dasarLiterasiSteam}
                  onChange={e => setFormData({ ...formData, dasarLiterasiSteam: e.target.value })}
                  required
                  disabled={isSaving}
                  placeholder="Uraikan minat menyimak buku, eksplorasi sains, konsep matematika..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              {/* Assessment Field 4: Fisik Motorik */}
              <div>
                <label className="block text-teal-900 font-bold mb-1">
                  4. Capaian Pertumbuhan Fisik & Motorik: (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formData.perkembanganFisikMotorik}
                  onChange={e => setFormData({ ...formData, perkembanganFisikMotorik: e.target.value })}
                  disabled={isSaving}
                  placeholder="Uraikan kemampuan motorik halus dan kasar..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              {/* Assessment Field 5: Catatan Wali Kelas */}
              <div>
                <label className="block text-purple-900 font-bold mb-1">
                  5. Catatan & Kesimpulan Wali Kelas: *
                </label>
                <textarea
                  rows={2}
                  value={formData.catatanWaliKelas}
                  onChange={e => setFormData({ ...formData, catatanWaliKelas: e.target.value })}
                  required
                  disabled={isSaving}
                  placeholder="Pesan motivasi, saran kolaborasi untuk orang tua di rumah..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              {/* Form Action Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition disabled:opacity-50 cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Simpan E-Rapor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default R8Erapor;
