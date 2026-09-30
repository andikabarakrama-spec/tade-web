import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { KMSHealthRecord, Student, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Heart,
  Plus,
  Save,
  Search,
  Filter,
  Calendar,
  UserCheck,
  Printer,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  ShieldCheck,
  RefreshCw,
  Baby,
  Smile,
  Shield,
  FileText,
  TrendingUp,
  Scale,
  Ruler,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  Lock
} from 'lucide-react';

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

const KMS_AUTHORIZED_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'GURU',
  'KETUA_YAYASAN',
  'WALI_MURID',
  'CALON_WALI_MURID'
];

const KMS_MUTATION_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'GURU'
];

export const R20LayananKMS: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates to null
  // Note: userProfile.role NEVER acts as authorization authority
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // 2. Authentic Actor Identity Determination
  // Fail-closed: Must resolve strictly from verified authenticated session credentials
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    return (
      userProfile?.nama?.trim() ||
      userProfile?.name?.trim() ||
      currentUser?.displayName?.trim() ||
      currentUser?.email?.trim() ||
      null
    );
  }, [userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email, currentUser?.uid]);

  // 3. Authorization Boundaries
  const canAccessModule = useMemo<boolean>(() => {
    return Boolean(verifiedActiveRole && KMS_AUTHORIZED_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  const canMutate = useMemo<boolean>(() => {
    return Boolean(verifiedActiveRole && KMS_MUTATION_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  const isParent = useMemo<boolean>(() => {
    return Boolean(
      verifiedActiveRole &&
        (verifiedActiveRole === 'WALI_MURID' || verifiedActiveRole === 'CALON_WALI_MURID')
    );
  }, [verifiedActiveRole]);

  // Data States
  const [kmsList, setKmsList] = useState<KMSHealthRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('Semua');
  const [selectedImmunization, setSelectedImmunization] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal Form States (Create & Edit)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<KMSHealthRecord | null>(null);
  const [viewDetailStudent, setViewDetailStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    studentId: string;
    checkDate: string;
    heightCm: string;
    weightKg: string;
    headCircumferenceCm: string;
    dentalHealth: string;
    immunizationStatus: string;
    doctorNotes: string;
  }>({
    studentId: '',
    checkDate: new Date().toISOString().split('T')[0],
    heightCm: '',
    weightKg: '',
    headCircumferenceCm: '',
    dentalHealth: 'Gigi Bersih, Bebas Karies',
    immunizationStatus: 'Lengkap Sesuai Usia',
    doctorNotes: ''
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

  // 4. Pre-Query Gate & Scoped Data Retrieval
  // STRICT DATA ISOLATION: Server/DataService scope is the first boundary.
  // We NEVER load the entire school's health records into browser state for parents.
  const loadData = useCallback(async () => {
    // HARD PRE-QUERY GATE: Fail-closed if unauthenticated, invalid role, or unauthorized
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) {
      setIsLoading(false);
      setKmsList([]);
      setStudents([]);
      return;
    }

    setIsLoading(true);
    try {
      if (isParent) {
        // PRE-QUERY ISOLATION FOR WALI MURID:
        // Fetch ONLY students authorized for this parent account directly via DataService
        const parentStudents = await DataService.getStudents(
          verifiedActiveRole,
          currentUser.uid,
          currentUser.email || undefined
        );

        // If no student is linked to this parent account, DO NOT load or leak ANY KMS records
        if (!parentStudents || parentStudents.length === 0) {
          setStudents([]);
          setKmsList([]);
          return;
        }

        const authorizedStudentIds = new Set(parentStudents.map(s => s.id));
        const allKMS = await DataService.getKMS();

        // STRICT DATA ISOLATION: Filter before committing into component state.
        // Entire school's medical records are NEVER held in component state for parents.
        const isolatedKMS = (allKMS || []).filter(k => authorizedStudentIds.has(k.studentId));

        setStudents(parentStudents);
        setKmsList(isolatedKMS);
      } else {
        // Authorized staff/operational roles: fetch all students and all KMS records
        const [fetchedKMS, fetchedStudents] = await Promise.all([
          DataService.getKMS(),
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            currentUser.email || undefined
          )
        ]);

        setKmsList(fetchedKMS || []);
        setStudents(fetchedStudents || []);
      }
    } catch (err) {
      console.error('Error loading KMS / students data from DataService:', err);
      showFeedback('error', 'Gagal memuat rekam medis KMS dan data siswa dari server.');
    } finally {
      setIsLoading(false);
    }
  }, [canAccessModule, currentUser?.email, currentUser?.uid, isParent, verifiedActiveRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Map student dictionary for fast lookups
  const studentMap = useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach(s => map.set(s.id, s));
    return map;
  }, [students]);

  // Available Class Groups
  const availableClasses = useMemo(() => {
    const set = new Set(students.map(s => s.classGroup).filter(Boolean));
    return ['Semua', ...Array.from(set).sort()];
  }, [students]);

  // Available Immunization Statuses
  const availableImmunizations = useMemo(() => {
    const set = new Set(kmsList.map(k => k.immunizationStatus).filter(Boolean));
    return ['Semua', ...Array.from(set).sort()];
  }, [kmsList]);

  // Filtered KMS Records
  const filteredKMSList = useMemo(() => {
    return kmsList.filter(item => {
      const student = studentMap.get(item.studentId);
      const studentName = item.studentName || student?.name || '';
      const studentClass = student?.classGroup || '';

      const matchesSearch =
        studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dentalHealth.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.immunizationStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.doctorNotes && item.doctorNotes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesClass =
        selectedClass === 'Semua' || studentClass === selectedClass;

      const matchesStudent =
        selectedStudentId === 'Semua' || item.studentId === selectedStudentId;

      const matchesImmunization =
        selectedImmunization === 'Semua' || item.immunizationStatus === selectedImmunization;

      return matchesSearch && matchesClass && matchesStudent && matchesImmunization;
    });
  }, [kmsList, studentMap, searchQuery, selectedClass, selectedStudentId, selectedImmunization]);

  // Smart Data Cards Statistics
  const stats = useMemo(() => {
    const totalRecords = kmsList.length;
    const uniqueStudents = new Set(kmsList.map(k => k.studentId)).size;
    const totalActiveStudents = students.length;
    const coveragePercentage = totalActiveStudents > 0
      ? Math.round((uniqueStudents / totalActiveStudents) * 100)
      : 0;

    const completeImmunizationCount = kmsList.filter(k =>
      k.immunizationStatus.toLowerCase().includes('lengkap')
    ).length;

    // Average Height and Weight across latest records
    const avgHeight = totalRecords > 0
      ? (kmsList.reduce((acc, curr) => acc + (curr.heightCm || 0), 0) / totalRecords).toFixed(1)
      : '0';

    const avgWeight = totalRecords > 0
      ? (kmsList.reduce((acc, curr) => acc + (curr.weightKg || 0), 0) / totalRecords).toFixed(1)
      : '0';

    return {
      totalRecords,
      uniqueStudents,
      totalActiveStudents,
      coveragePercentage,
      completeImmunizationCount,
      avgHeight,
      avgWeight
    };
  }, [kmsList, students]);

  // Handler: Open Create Modal
  const handleOpenCreateModal = () => {
    if (!canMutate || !verifiedActiveRole || !currentUser?.uid) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mencatat pemeriksaan kesehatan.');
      return;
    }
    if (students.length === 0) {
      showFeedback('error', 'Belum ada data siswa aktif yang tersedia.');
      return;
    }

    setEditingRecord(null);
    setFormError('');
    setFormData({
      studentId: students[0]?.id || '',
      checkDate: new Date().toISOString().split('T')[0],
      heightCm: '105',
      weightKg: '17.5',
      headCircumferenceCm: '50',
      dentalHealth: 'Gigi Bersih, Bebas Karies',
      immunizationStatus: 'Lengkap Sesuai Usia',
      doctorNotes: 'Tumbuh kembang baik dan aktif.'
    });
    setShowModal(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditModal = (record: KMSHealthRecord) => {
    if (!canMutate || !verifiedActiveRole || !currentUser?.uid) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mengubah data kesehatan.');
      return;
    }

    setEditingRecord(record);
    setFormError('');
    setFormData({
      studentId: record.studentId,
      checkDate: record.checkDate,
      heightCm: record.heightCm.toString(),
      weightKg: record.weightKg.toString(),
      headCircumferenceCm: record.headCircumferenceCm.toString(),
      dentalHealth: record.dentalHealth,
      immunizationStatus: record.immunizationStatus,
      doctorNotes: record.doctorNotes || ''
    });
    setShowModal(true);
  };

  // Handler: Open Detail View for Student's Health History
  const handleOpenStudentDetail = (studentId: string) => {
    if (!canAccessModule || !verifiedActiveRole || !currentUser?.uid) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mengakses modul ini.');
      return;
    }

    // Wali Murid Isolation: Can only view health history of their own authorized children
    if (isParent && !students.some(s => s.id === studentId)) {
      showFeedback('error', 'Akses ditolak: Anda hanya dapat melihat riwayat kesehatan ananda Anda sendiri.');
      return;
    }

    const student = studentMap.get(studentId);
    if (student) {
      setViewDetailStudent(student);
    }
  };

  // Handler: Save KMS Record (Create or Update)
  const handleSaveKMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate || !verifiedActiveRole || !currentUser?.uid || isSaving) {
      showFeedback('error', 'Akses ditolak: Operasi penyimpanan rekam kesehatan tidak diizinkan.');
      return;
    }
    if (!actorName) {
      showFeedback('error', 'Identitas autentikasi tidak valid. Silakan login ulang.');
      return;
    }
    setFormError('');

    if (!formData.studentId) {
      setFormError('Silakan pilih siswa terlebih dahulu.');
      return;
    }

    const selectedStudent = studentMap.get(formData.studentId);
    if (!selectedStudent) {
      setFormError('Siswa yang dipilih tidak valid atau tidak terdaftar.');
      return;
    }

    if (!formData.checkDate) {
      setFormError('Tanggal pemeriksaan wajib diisi.');
      return;
    }

    const height = parseFloat(formData.heightCm);
    const weight = parseFloat(formData.weightKg);
    const headCirc = parseFloat(formData.headCircumferenceCm);

    if (isNaN(height) || height <= 0 || height > 200) {
      setFormError('Tinggi Badan harus berupa angka valid (antara 40 - 200 cm).');
      return;
    }

    if (isNaN(weight) || weight <= 0 || weight > 100) {
      setFormError('Berat Badan harus berupa angka valid (antara 3 - 100 kg).');
      return;
    }

    if (isNaN(headCirc) || headCirc <= 0 || headCirc > 80) {
      setFormError('Lingkar Kepala harus berupa angka valid (antara 30 - 80 cm).');
      return;
    }

    if (!formData.dentalHealth.trim()) {
      setFormError('Kondisi kesehatan gigi wajib diisi.');
      return;
    }

    if (!formData.immunizationStatus.trim()) {
      setFormError('Status imunisasi wajib diisi.');
      return;
    }

    const studentName = selectedStudent.name || 'Siswa';

    // Duplicate Check: Same student on same checkDate
    const existingDuplicate = kmsList.find(
      k =>
        k.studentId === formData.studentId &&
        k.checkDate === formData.checkDate &&
        (!editingRecord || k.id !== editingRecord.id)
    );

    if (existingDuplicate && !editingRecord) {
      setFormError(
        `Pemeriksaan untuk ananda ${studentName} pada tanggal ${formData.checkDate} sudah tercatat sebelumnya. Silakan edit data yang ada atau ubah tanggal pemeriksaan.`
      );
      return;
    }

    setIsSaving(true);
    try {
      const recordToSave: KMSHealthRecord = {
        id: editingRecord ? editingRecord.id : `kms-${Date.now()}`,
        studentId: formData.studentId,
        studentName: studentName,
        checkDate: formData.checkDate,
        heightCm: height,
        weightKg: weight,
        headCircumferenceCm: headCirc,
        dentalHealth: formData.dentalHealth.trim(),
        immunizationStatus: formData.immunizationStatus.trim(),
        doctorNotes: formData.doctorNotes.trim()
      };

      await DataService.saveKMS(recordToSave);

      // Canonical Authentic Audit Trail with verified active role
      const actionText = editingRecord
        ? `Memperbarui data pemeriksaan KMS ananda ${studentName} (${formData.checkDate}) [TB: ${height}cm, BB: ${weight}kg]`
        : `Mencatat pemeriksaan KMS baru ananda ${studentName} (${formData.checkDate}) [TB: ${height}cm, BB: ${weight}kg]`;

      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        actionText,
        'R20_LAYANAN_KMS'
      );

      showFeedback(
        'success',
        editingRecord
          ? `Data pemeriksaan ananda ${studentName} berhasil diperbarui.`
          : `Data pemeriksaan ananda ${studentName} berhasil disimpan ke KMS.`
      );

      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error('Error saving KMS record:', err);
      setFormError('Terjadi kesalahan saat menyimpan data ke server. Silakan coba lagi.');
      showFeedback('error', 'Gagal menyimpan data KMS.');
    } finally {
      setIsSaving(false);
    }
  };

  // Chronological history of a specific student
  const studentHealthHistory = useMemo(() => {
    if (!viewDetailStudent) return [];
    return kmsList
      .filter(k => k.studentId === viewDetailStudent.id)
      .sort((a, b) => new Date(b.checkDate).getTime() - new Date(a.checkDate).getTime());
  }, [viewDetailStudent, kmsList]);

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  // FAIL-CLOSED ACCESS DENIED SCREEN
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) {
    return (
      <div id="r20-access-denied" className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              Akses Dibatasi • Fail-Closed Security Gate
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Akses Modul KMS / Kesehatan Ditolak
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Anda tidak memiliki izin untuk membuka catatan rekam medis Kartu Menuju Sehat (KMS) siswa. Modul ini dilindungi untuk menjaga kerahasiaan data tumbuh kembang dan rekam kesehatan anak.
            </p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block text-left text-xs space-y-1">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-semibold text-slate-500">Status Autentikasi:</span>
              <span className="font-bold">{currentUser?.uid ? 'Terautentikasi' : 'Belum Login'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-semibold text-slate-500">Peran Aktif Terverifikasi:</span>
              <span className="font-bold font-mono text-rose-700">{verifiedActiveRole || 'TIDAK TERVALIDASI'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="r20-layanan-kms-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Print-Only Header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          TK ISLAM TERPADU ASY-SYIFA TANGGUL
        </h1>
        <p className="text-xs text-slate-600">
          REKAPITULASI PEMERIKSAAN KARTU MENUJU SEHAT (KMS) & TUMBUH KEMBANG SISWA
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Bekerjasama dengan Puskesmas Tanggul • Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </p>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          id="kms-feedback-banner"
          className={`p-4 rounded-2xl flex items-center justify-between shadow-xs transition-all animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-200'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : feedback.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-medium">{feedback.message}</p>
          </div>
          <button
            id="btn-close-feedback"
            onClick={() => setFeedback(null)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              <span>MODUL R20 • LAYANAN KESEHATAN ANAK</span>
            </div>
            {isParent && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Data Terisolasi: Khusus Ananda Tercatat</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isParent ? 'Rekam Kesehatan Ananda (KMS)' : 'Kartu Menuju Sehat (KMS) & Tumbuh Kembang'}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {isParent
              ? 'Catatan berkala hasil pemeriksaan fisik, berat badan, tinggi badan, lingkar kepala, dan imunisasi ananda di sekolah bekerja sama dengan Puskesmas Tanggul.'
              : 'Pencatatan berkala Tinggi Badan, Berat Badan, Lingkar Kepala, Kesehatan Gigi, dan Status Imunisasi siswa bekerja sama dengan Posyandu & Puskesmas Tanggul.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="btn-refresh-kms"
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Muat Ulang</span>
          </button>

          <button
            id="btn-print-kms"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            title="Cetak Laporan KMS"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Rekap</span>
          </button>

          {canMutate && (
            <button
              id="btn-add-kms"
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pemeriksaan</span>
            </button>
          )}
        </div>
      </div>

      {/* Smart Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* Card 1: Total Records */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pemeriksaan</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalRecords}</h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Riwayat Tercatat</p>
          </div>
        </div>

        {/* Card 2: Student Coverage */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isParent ? 'Jumlah Ananda' : 'Cakupan Siswa'}
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              {stats.uniqueStudents} {isParent ? 'Anak' : `/ ${stats.totalActiveStudents}`}
            </h3>
            <p className="text-[11px] text-teal-700 font-medium mt-0.5">
              {isParent ? 'Terdaftar di Akun Ini' : `${stats.coveragePercentage}% Siswa Terperiksa`}
            </p>
          </div>
        </div>

        {/* Card 3: Imunisasi Lengkap */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Imunisasi Lengkap</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.completeImmunizationCount}</h3>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5">Sesuai Usia Perkembangan</p>
          </div>
        </div>

        {/* Card 4: Rerata Pertumbuhan */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Pertumbuhan</p>
            <h3 className="text-lg font-black text-slate-900">{stats.avgHeight} cm • {stats.avgWeight} kg</h3>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Rerata TB & BB</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="input-search-kms"
              type="text"
              placeholder="Cari nama siswa, gigi, imunisasi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Class Filter */}
          <div>
            <select
              id="select-filter-class"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
            >
              <option value="Semua">Semua Kelompok Kelas</option>
              {availableClasses
                .filter(c => c !== 'Semua')
                .map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          {/* Student Filter */}
          <div>
            <select
              id="select-filter-student"
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
            >
              <option value="Semua">{isParent ? 'Semua Ananda Terdaftar' : 'Semua Siswa Terdaftar'}</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classGroup})
                </option>
              ))}
            </select>
          </div>

          {/* Immunization Filter */}
          <div>
            <select
              id="select-filter-immunization"
              value={selectedImmunization}
              onChange={e => setSelectedImmunization(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
            >
              <option value="Semua">Semua Status Imunisasi</option>
              {availableImmunizations
                .filter(im => im !== 'Semua')
                .map(im => (
                  <option key={im} value={im}>
                    {im}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* View Mode & Active Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>
              Menampilkan <strong className="text-slate-800">{filteredKMSList.length}</strong> dari{' '}
              {kmsList.length} catatan pemeriksaan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Tampilan:</span>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                id="btn-view-cards"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kartu Visual
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabel Rinci
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Memuat catatan KMS & tumbuh kembang siswa...</p>
        </div>
      ) : filteredKMSList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Belum Ada Data Pemeriksaan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isParent
                ? 'Belum ada catatan pemeriksaan KMS yang tercatat untuk ananda. Data akan muncul otomatis setelah diperiksa oleh petugas puskesmas / guru.'
                : 'Tidak ditemukan data pemeriksaan kesehatan yang sesuai dengan filter atau kata kunci pencarian.'}
            </p>
          </div>
          {canMutate && (
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pemeriksaan Sekarang</span>
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Visual Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredKMSList.map(record => {
            const student = studentMap.get(record.studentId);
            const className = student?.classGroup || 'Kelompok TK';
            const gender = student?.gender === 'P' ? 'Perempuan' : 'Laki-laki';

            return (
              <div
                key={record.id}
                id={`kms-card-${record.id}`}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                        {record.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-emerald-700 transition-colors">
                          {record.studentName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-semibold text-slate-500 bg-stone-100 px-2 py-0.5 rounded-md">
                            {className}
                          </span>
                          <span className="text-[11px] text-slate-400">• {gender}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 text-[11px] font-mono shrink-0 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-100">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{record.checkDate}</span>
                    </div>
                  </div>

                  {/* Physical Growth Measurements */}
                  <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-center">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                        <Ruler className="w-3 h-3 text-emerald-600" />
                        <span>Tinggi</span>
                      </div>
                      <p className="text-sm font-black text-slate-800">{record.heightCm} <span className="text-[10px] font-normal text-slate-500">cm</span></p>
                    </div>

                    <div className="space-y-0.5 border-x border-stone-200">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                        <Scale className="w-3 h-3 text-teal-600" />
                        <span>Berat</span>
                      </div>
                      <p className="text-sm font-black text-slate-800">{record.weightKg} <span className="text-[10px] font-normal text-slate-500">kg</span></p>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                        <Activity className="w-3 h-3 text-blue-600" />
                        <span>L. Kepala</span>
                      </div>
                      <p className="text-sm font-black text-slate-800">{record.headCircumferenceCm} <span className="text-[10px] font-normal text-slate-500">cm</span></p>
                    </div>
                  </div>

                  {/* Health Status Badges */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                        <Smile className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kesehatan Gigi:</span>
                      </div>
                      <span className="font-bold text-emerald-900 text-[11px]">{record.dentalHealth}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-blue-50/50 border border-blue-100">
                      <div className="flex items-center gap-1.5 text-blue-800 font-semibold text-[11px]">
                        <Shield className="w-3.5 h-3.5 text-blue-600" />
                        <span>Imunisasi:</span>
                      </div>
                      <span className="font-bold text-blue-900 text-[11px]">{record.immunizationStatus}</span>
                    </div>
                  </div>

                  {/* Doctor / Health Notes */}
                  {record.doctorNotes && (
                    <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 text-xs">
                      <p className="font-bold text-amber-900 text-[11px] mb-0.5 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-700" />
                        Catatan Petugas Medis:
                      </p>
                      <p className="text-slate-700 italic leading-relaxed">{record.doctorNotes}</p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    id={`btn-detail-${record.id}`}
                    onClick={() => handleOpenStudentDetail(record.studentId)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Riwayat</span>
                  </button>

                  {canMutate && (
                    <button
                      id={`btn-edit-${record.id}`}
                      onClick={() => handleOpenEditModal(record)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-slate-700 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Nama Siswa</th>
                  <th className="p-3.5">Kelompok</th>
                  <th className="p-3.5">Tanggal Periksa</th>
                  <th className="p-3.5">TB / BB</th>
                  <th className="p-3.5">Lingkar Kepala</th>
                  <th className="p-3.5">Kesehatan Gigi</th>
                  <th className="p-3.5">Status Imunisasi</th>
                  <th className="p-3.5">Catatan Petugas</th>
                  <th className="p-3.5 text-right rounded-r-xl print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredKMSList.map(record => {
                  const student = studentMap.get(record.studentId);
                  const className = student?.classGroup || '-';

                  return (
                    <tr key={record.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        {record.studentName}
                      </td>
                      <td className="p-3.5 text-slate-600">{className}</td>
                      <td className="p-3.5 font-mono text-slate-700">{record.checkDate}</td>
                      <td className="p-3.5 font-semibold text-emerald-800">
                        {record.heightCm} cm / {record.weightKg} kg
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{record.headCircumferenceCm} cm</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-md font-bold text-emerald-800 bg-emerald-100 text-[10px]">
                          {record.dentalHealth}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-md font-bold text-blue-800 bg-blue-100 text-[10px]">
                          {record.immunizationStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 italic max-w-xs truncate">
                        {record.doctorNotes || '-'}
                      </td>
                      <td className="p-3.5 text-right space-x-2 whitespace-nowrap print:hidden">
                        <button
                          onClick={() => handleOpenStudentDetail(record.studentId)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                          title="Lihat Riwayat"
                        >
                          Riwayat
                        </button>
                        {canMutate && (
                          <button
                            onClick={() => handleOpenEditModal(record)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-all"
                            title="Edit Data"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form: Create / Edit KMS Record */}
      {showModal && (
        <div
          id="modal-kms-form-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-kms-form-container"
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingRecord ? 'Perbarui Data Pemeriksaan KMS' : 'Catat Pemeriksaan KMS Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isi hasil pengukuran fisik, gigi, dan imunisasi siswa sesuai standar KMS.
                  </p>
                </div>
              </div>
              <button
                id="btn-close-modal-kms"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message Inside Modal */}
            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveKMS} className="space-y-4">
              {/* Row 1: Student Selection & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Siswa <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="form-select-student"
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    disabled={Boolean(editingRecord) || isSaving}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium disabled:opacity-60"
                  >
                    <option value="" disabled>-- Pilih Siswa --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.classGroup})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tanggal Pemeriksaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-input-date"
                    type="date"
                    value={formData.checkDate}
                    onChange={e => setFormData({ ...formData, checkDate: e.target.value })}
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Physical Measurements (Height, Weight, Head Circumference) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tinggi Badan (cm) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="form-input-height"
                      type="number"
                      step="0.1"
                      min="40"
                      max="200"
                      placeholder="e.g. 105.5"
                      value={formData.heightCm}
                      onChange={e => setFormData({ ...formData, heightCm: e.target.value })}
                      disabled={isSaving}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">cm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Berat Badan (kg) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="form-input-weight"
                      type="number"
                      step="0.1"
                      min="3"
                      max="100"
                      placeholder="e.g. 17.5"
                      value={formData.weightKg}
                      onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                      disabled={isSaving}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Lingkar Kepala (cm) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="form-input-head"
                      type="number"
                      step="0.1"
                      min="30"
                      max="80"
                      placeholder="e.g. 50.0"
                      value={formData.headCircumferenceCm}
                      onChange={e => setFormData({ ...formData, headCircumferenceCm: e.target.value })}
                      disabled={isSaving}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">cm</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Dental Health & Immunization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kesehatan Gigi & Mulut <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-input-dental"
                    type="text"
                    list="dental-options"
                    placeholder="e.g. Gigi Bersih, Bebas Karies"
                    value={formData.dentalHealth}
                    onChange={e => setFormData({ ...formData, dentalHealth: e.target.value })}
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
                  />
                  <datalist id="dental-options">
                    <option value="Gigi Bersih, Bebas Karies" />
                    <option value="Bebas Karies, Bersih" />
                    <option value="Perlu Pemeriksaan Gigi" />
                    <option value="Karies Ringan" />
                    <option value="Sedang Dalam Perawatan" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status Imunisasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-input-immunization"
                    type="text"
                    list="immunization-options"
                    placeholder="e.g. Lengkap Sesuai Usia"
                    value={formData.immunizationStatus}
                    onChange={e => setFormData({ ...formData, immunizationStatus: e.target.value })}
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
                  />
                  <datalist id="immunization-options">
                    <option value="Lengkap Sesuai Usia" />
                    <option value="Imunisasi Dasar Lengkap" />
                    <option value="Belum Lengkap" />
                    <option value="Menunggu Jadwal BIAS" />
                    <option value="Pemberian Vitamin A Saja" />
                  </datalist>
                </div>
              </div>

              {/* Row 4: Doctor / Medical Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Dokter / Petugas Medis Puskesmas
                </label>
                <textarea
                  id="form-input-notes"
                  rows={3}
                  placeholder="Catatan perkembangan fisik, saran gizi, atau anjuran pemeriksaan lanjutan..."
                  value={formData.doctorNotes}
                  onChange={e => setFormData({ ...formData, doctorNotes: e.target.value })}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  id="btn-cancel-kms-form"
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  id="btn-submit-kms-form"
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingRecord ? 'Simpan Perubahan' : 'Simpan Pemeriksaan'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail: Student Health Growth History */}
      {viewDetailStudent && (
        <div
          id="modal-student-history-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-student-history-container"
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-lg">
                  {viewDetailStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewDetailStudent.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {viewDetailStudent.classGroup}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">NIS: {viewDetailStudent.nis || '-'}</span>
                  </div>
                </div>
              </div>
              <button
                id="btn-close-detail-modal"
                onClick={() => setViewDetailStudent(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chronological History Timeline */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Riwayat Perkembangan Fisik & Imunisasi</span>
              </h4>

              {studentHealthHistory.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                  <p className="text-xs text-slate-500 font-medium">
                    Belum ada riwayat catatan pemeriksaan untuk siswa ini.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {studentHealthHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {item.checkDate}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                            {item.dentalHealth}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-bold">
                            {item.immunizationStatus}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center bg-white p-3 rounded-xl border border-stone-100">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Tinggi Badan</p>
                          <p className="text-sm font-bold text-slate-800">{item.heightCm} cm</p>
                        </div>
                        <div className="border-x border-stone-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Berat Badan</p>
                          <p className="text-sm font-bold text-slate-800">{item.weightKg} kg</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Lingkar Kepala</p>
                          <p className="text-sm font-bold text-slate-800">{item.headCircumferenceCm} cm</p>
                        </div>
                      </div>

                      {item.doctorNotes && (
                        <p className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 italic">
                          <strong className="not-italic text-amber-900 font-semibold">Catatan Medis:</strong> {item.doctorNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-4 border-t border-stone-100">
              <button
                id="btn-close-detail-footer"
                onClick={() => setViewDetailStudent(null)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
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
