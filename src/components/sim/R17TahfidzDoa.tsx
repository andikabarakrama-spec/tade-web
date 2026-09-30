import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Printer,
  Sparkles,
  Calendar,
  User,
  Award,
  RefreshCw,
  Edit3,
  BookmarkCheck,
  Check,
  X,
  ShieldAlert,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { TahfidzProgress, Student, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';

// Canonical roles whitelist per TADE security contract
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

const SURAH_PRESETS = [
  'Surah Al-Fatihah',
  'Surah An-Nas',
  'Surah Al-Falaq',
  'Surah Al-Ikhlas',
  'Surah Al-Lahab',
  'Surah An-Nasr',
  'Surah Al-Kafirun',
  'Surah Al-Kautsar',
  'Surah Al-Ma’un',
  'Surah Quraisy',
  'Surah Al-Fil',
  'Surah Al-Humazah',
  'Surah Al-‘Ashr',
  'Surah At-Takatsur',
  'Surah Al-Qari’ah',
  'Surah Al-‘Adiyat',
  'Surah Az-Zalzalah',
  'Surah Al-Bayyinah',
  'Surah Al-Qadr',
  'Surah Al-‘Alaq',
  'Surah At-Tin',
  'Surah Al-Insyirah',
  'Surah Ad-Duha'
];

const DOA_PRESETS = [
  'Doa Sebelum Makan & Minum',
  'Doa Sesudah Makan & Minum',
  'Doa Sebelum Tidur',
  'Doa Bangun Tidur',
  'Doa Masuk Masjid',
  'Doa Keluar Masjid',
  'Doa Masuk Kamar Mandi',
  'Doa Keluar Kamar Mandi',
  'Doa Untuk Kedua Orang Tua',
  'Doa Kebaikan Dunia & Akhirat',
  'Doa Naik Kendaraan',
  'Doa Memakai Pakaian',
  'Doa Masuk Rumah',
  'Doa Keluar Rumah (Bismillahi Tawakkaltu)'
];

export const R17TahfidzDoa: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. CANONICAL ROLE & AUTHENTICATION RESOLUTION (FAIL-CLOSED)
  // Authoritative session role: activeRole must match canonical roles list.
  // Zero fallback to userProfile.role. Zero privileged defaults.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Authentic actor identity derived strictly from authenticated session
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    const cleanProfileName = (userProfile?.nama || userProfile?.name)?.trim();
    if (cleanProfileName) return cleanProfileName;
    const cleanDisplayName = currentUser?.displayName?.trim();
    if (cleanDisplayName) return cleanDisplayName;
    const cleanEmail = currentUser?.email?.trim();
    if (cleanEmail) return cleanEmail;
    return `User (${currentUser.uid.slice(0, 8)})`;
  }, [currentUser?.uid, currentUser?.displayName, currentUser?.email, userProfile?.nama, userProfile?.name]);

  // Operational Authority Gates:
  // - SUPER_ADMIN, ADMIN, KEPALA_SEKOLAH, and GURU can record and evaluate Tahfidz setoran.
  // - WALI_MURID has strictly read-only access to their own linked children.
  const canEdit = Boolean(
    currentUser?.uid &&
      verifiedActiveRole &&
      ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'].includes(verifiedActiveRole)
  );

  const isWali = Boolean(currentUser?.uid && verifiedActiveRole === 'WALI_MURID');

  const canAccessR17 = Boolean(
    currentUser?.uid &&
      verifiedActiveRole &&
      ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'].includes(verifiedActiveRole)
  );

  const [tahfidzList, setTahfidzList] = useState<TahfidzProgress[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [quickUpdatingId, setQuickUpdatingId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Lancar' | 'Mengulang' | 'Belum Bimbingan'>('ALL');
  const [categoryTab, setCategoryTab] = useState<'ALL' | 'SURAH' | 'DOA'>('ALL');
  const [activeView, setActiveView] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<TahfidzProgress | null>(null);

  // Form State
  const [formStudentId, setFormStudentId] = useState<string>('');
  const [formCategoryType, setFormCategoryType] = useState<'SURAH' | 'DOA' | 'CUSTOM'>('SURAH');
  const [formSurahName, setFormSurahName] = useState<string>(SURAH_PRESETS[0]);
  const [formCustomName, setFormCustomName] = useState<string>('');
  const [formAyatProgress, setFormAyatProgress] = useState<string>('Ayat 1 - 5 (Lengkap)');
  const [formStatus, setFormStatus] = useState<'Lancar' | 'Mengulang' | 'Belum Bimbingan'>('Lancar');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState<string>('');

  // Internal Feedback Banner State (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  // 2. PRE-QUERY AUTHORIZATION GATE & CHILD DATA PRIVACY ISOLATION
  // No sensitive queries execute before authenticated session and canonical role are validated.
  // For WALI_MURID: DataService.getTahfidz() is un-scoped at the backend level;
  // therefore, to prevent cross-child data leakage, global records are NEVER downloaded into a parent's browser.
  const loadData = useCallback(async () => {
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR17) {
      setLoading(false);
      setTahfidzList([]);
      setStudents([]);
      return;
    }

    try {
      setLoading(true);

      if (isWali) {
        // Authenticated parent: strictly query linked children only
        const linkedStudents = await DataService.getStudents(
          verifiedActiveRole,
          currentUser.uid,
          currentUser.email || undefined
        );
        setStudents(linkedStudents || []);
        // Fail-closed for global tahfidz dataset: do not load un-scoped school-wide database into parent state
        setTahfidzList([]);
      } else {
        // Institutional Staff / Leadership access:
        const [thfData, stdData] = await Promise.all([
          DataService.getTahfidz(),
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            userProfile?.email || undefined
          )
        ]);
        setTahfidzList(thfData || []);
        setStudents(stdData || []);
      }
    } catch (err: any) {
      console.error('Error loading tahfidz data:', err);
      showFeedback('error', 'Gagal memuat data Mutaba’ah Tahfidz.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser?.uid, currentUser?.email, verifiedActiveRole, canAccessR17, isWali, userProfile?.email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await loadData();
    showFeedback('info', 'Data Mutaba’ah Tahfidz berhasil diperbarui.');
  };

  // Open Create Modal (Staff only)
  const handleOpenCreateModal = () => {
    if (!canEdit) {
      showFeedback('error', 'Akses ditolak: Hanya Ustadzah/Guru dan Admin yang dapat mencatat setoran hafalan.');
      return;
    }
    setEditingItem(null);
    setFormStudentId(students.length > 0 ? students[0].id : '');
    setFormCategoryType('SURAH');
    setFormSurahName(SURAH_PRESETS[0]);
    setFormCustomName('');
    setFormAyatProgress('Ayat 1 - 5 (Lengkap)');
    setFormStatus('Lancar');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('Tajwid & makhraj huruf sangat baik.');
    setShowModal(true);
  };

  // Open Edit Modal (Staff only)
  const handleOpenEditModal = (item: TahfidzProgress) => {
    if (!canEdit) {
      showFeedback('error', 'Akses ditolak: Hanya Ustadzah/Guru dan Admin yang dapat mengubah data mutaba’ah.');
      return;
    }
    setEditingItem(item);
    setFormStudentId(item.studentId);

    // Determine if it matches preset
    if (SURAH_PRESETS.includes(item.surahName)) {
      setFormCategoryType('SURAH');
      setFormSurahName(item.surahName);
      setFormCustomName('');
    } else if (DOA_PRESETS.includes(item.surahName)) {
      setFormCategoryType('DOA');
      setFormSurahName(item.surahName);
      setFormCustomName('');
    } else {
      setFormCategoryType('CUSTOM');
      setFormCustomName(item.surahName);
    }

    setFormAyatProgress(item.ayatProgress);
    setFormStatus(item.status);
    setFormDate(item.date || new Date().toISOString().split('T')[0]);
    setFormNotes(item.notes || '');
    setShowModal(true);
  };

  // 3. HANDLER-LEVEL AUTHORIZATION & ANTI-DOUBLE-SUBMIT: SAVE TAHFIDZ
  const handleSaveTahfidz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!currentUser?.uid || !verifiedActiveRole || !canEdit || !actorName) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk menyimpan data bimbingan tahfidz.');
      return;
    }

    if (!formStudentId) {
      showFeedback('error', 'Pilih siswa terlebih dahulu.');
      return;
    }

    const effectiveTargetName =
      formCategoryType === 'CUSTOM'
        ? formCustomName.trim()
        : formSurahName;

    if (!effectiveTargetName) {
      showFeedback('error', 'Nama Surah / Doa Harian tidak boleh kosong.');
      return;
    }

    const targetStudent = students.find(s => s.id === formStudentId);
    if (!targetStudent) {
      showFeedback('error', 'Siswa yang dipilih tidak terdaftar.');
      return;
    }

    const studentName = targetStudent.name || targetStudent.namaLengkap || 'Siswa Asy Syifa';

    // Duplicate Check: Same student, same surah, same date (unless editing the same record)
    const isDuplicate = tahfidzList.some(
      t =>
        t.id !== editingItem?.id &&
        t.studentId === formStudentId &&
        t.surahName.toLowerCase() === effectiveTargetName.toLowerCase() &&
        t.date === formDate
    );

    if (isDuplicate) {
      showFeedback(
        'error',
        `Duplikasi: ${studentName} sudah memiliki catatan setoran "${effectiveTargetName}" pada tanggal ${formDate}.`
      );
      return;
    }

    setSubmitting(true);
    try {
      // Deterministic semantic record ID (no synthetic Date.now() / Math.random() / fake actor IDs)
      const sanitizedSurah = effectiveTargetName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const sanitizedDate = formDate.replace(/-/g, '');
      const recordId = editingItem?.id || `thf_${formStudentId}_${sanitizedDate}_${sanitizedSurah}`;

      const recordToSave: TahfidzProgress = {
        id: recordId,
        studentId: formStudentId,
        studentName: studentName,
        surahName: effectiveTargetName,
        ayatProgress: formAyatProgress.trim() || 'Lengkap',
        status: formStatus,
        date: formDate,
        notes: formNotes.trim()
      };

      await DataService.saveTahfidz(recordToSave);

      // Audit Trail with verified authentic session actor
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        editingItem ? 'UPDATE_TAHFIDZ' : 'CREATE_TAHFIDZ',
        `${editingItem ? 'Memperbarui' : 'Menambahkan'} catatan setoran ${studentName} materi ${effectiveTargetName} (${formStatus})`
      ).catch(() => {});

      setShowModal(false);
      showFeedback(
        'success',
        `Catatan mutaba’ah ${studentName} untuk ${effectiveTargetName} berhasil disimpan.`
      );
      await loadData();
    } catch (err: any) {
      console.error('Error saving tahfidz:', err);
      showFeedback('error', 'Gagal menyimpan catatan mutaba’ah.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. HANDLER-LEVEL AUTHORIZATION & ANTI-DOUBLE-SUBMIT: QUICK STATUS TOGGLE
  const handleQuickStatusChange = async (
    item: TahfidzProgress,
    newStatus: 'Lancar' | 'Mengulang' | 'Belum Bimbingan'
  ) => {
    if (quickUpdatingId) return;

    if (!currentUser?.uid || !verifiedActiveRole || !canEdit || !actorName) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk mengubah status mutaba’ah.');
      return;
    }

    setQuickUpdatingId(item.id);
    try {
      const oldStatus = item.status;
      const updatedItem: TahfidzProgress = {
        ...item,
        status: newStatus
      };
      await DataService.saveTahfidz(updatedItem);

      // Audit Trail with verified authentic session actor
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        'QUICK_STATUS_TAHFIDZ',
        `Mengubah status mutaba'ah ${item.studentName} materi ${item.surahName} dari "${oldStatus}" menjadi "${newStatus}"`
      ).catch(() => {});

      setTahfidzList(prev => prev.map(p => (p.id === item.id ? updatedItem : p)));
      showFeedback('info', `Status mutaba’ah ${item.studentName} diubah menjadi "${newStatus}".`);
    } catch (err: any) {
      console.error('Error updating quick status tahfidz:', err);
      showFeedback('error', 'Gagal memperbarui status mutaba’ah.');
    } finally {
      setQuickUpdatingId(null);
    }
  };

  // Filtered List (for staff members)
  const filteredList = useMemo(() => {
    if (isWali) return [];

    return tahfidzList.filter(item => {
      // Search query (Student Name, Surah Name, Notes)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.studentName.toLowerCase().includes(q);
        const matchesSurah = item.surahName.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesSurah && !matchesNotes) return false;
      }

      // Class Group filter
      if (selectedClass !== 'ALL') {
        const student = students.find(s => s.id === item.studentId);
        if (student && student.classGroup !== selectedClass) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // Category tab (Surah vs Doa vs All)
      if (categoryTab === 'SURAH') {
        const isSurah = item.surahName.toLowerCase().includes('surah') || SURAH_PRESETS.includes(item.surahName);
        if (!isSurah) return false;
      } else if (categoryTab === 'DOA') {
        const isDoa = item.surahName.toLowerCase().includes('doa') || DOA_PRESETS.includes(item.surahName);
        if (!isDoa) return false;
      }

      return true;
    });
  }, [tahfidzList, students, searchQuery, selectedClass, statusFilter, categoryTab, isWali]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredList.length;
    const lancar = filteredList.filter(t => t.status === 'Lancar').length;
    const mengulang = filteredList.filter(t => t.status === 'Mengulang').length;
    const belum = filteredList.filter(t => t.status === 'Belum Bimbingan').length;
    const percentageLancar = total > 0 ? Math.round((lancar / total) * 100) : 0;

    return { total, lancar, mengulang, belum, percentageLancar };
  }, [filteredList]);

  // Unique Class Groups
  const classGroups = useMemo(() => {
    const setGroups = new Set<string>();
    students.forEach(s => {
      if (s.classGroup) setGroups.add(s.classGroup);
    });
    return Array.from(setGroups);
  }, [students]);

  // 5. UI / DOM ISOLATION: UNAUTHORIZED ACCESS STATE (FAIL-CLOSED)
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessR17) {
    return (
      <div id="r17-access-denied-container" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full inline-block">
              Akses Dibatasi — Evaluasi Tahfidz
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Otoritas Tidak Memadai
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Modul <strong>R17 (Mutaba’ah Tahfidz & Doa Harian)</strong> memuat catatan evaluasi hafalan dan perkembangan spiritual santri. Akses bimbingan dibatasi hanya untuk peran Pendidik, Kepala Sekolah, dan Manajemen Sekolah terotorisasi.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-200 max-w-sm mx-auto flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Peran Sesi Anda: <strong>{verifiedActiveRole || 'Tidak Terautentikasi'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="r17-tahfidz-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Module R17 — Mutaba’ah Tahfidz & Doa Harian
            </span>
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
              Kurikulum Karakter Islami Asy Syifa
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Monitoring Setoran Hafalan Qur’an Juz 30 & Doa Harian
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Pencatatan perkembangan harian, penguatan makhraj tajwid, bimbingan adab doa, dan evaluasi mutqin siswa.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {!isWali && (
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap</span>
            </button>
          )}

          {canEdit && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Setoran Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Global In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-2 shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-indigo-50 border-indigo-300 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {feedback.type === 'error' && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {feedback.type === 'info' && <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[10px] font-bold opacity-70 hover:opacity-100 cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* WALI MURID PRIVACY VIEW */}
      {isWali ? (
        <div id="r17-wali-privacy-boundary" className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-emerald-950 text-sm">
                  Portal Mutaba’ah Mandiri — Perlindungan Privasi Santri
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-2xl">
                  Sesuai Konstitusi Keamanan TADE dan Kebijakan Privasi Anak, catatan capaian hafalan dan evaluasi bimbingan santri dilindungi secara ketat. Basis data hafalan seluruh santri tidak diunduh ke peramban orang tua guna menjamin kerahasiaan data setiap keluarga.
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
                  <div key={std.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block">
                      {std.classGroup || 'Kelompok Santri'}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">{std.name || std.namaLengkap}</h5>
                    <p className="text-[11px] text-stone-500">NISN / ID: {std.nisn || std.id}</p>
                    <div className="pt-2 text-[11px] text-stone-600 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Bimbingan Tahfidz: Rutin Harian</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STAFF / LEADERSHIP OPERATIONAL WORKSPACE */
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Setoran Tercatat</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total}</h3>
                <span className="text-[10px] text-stone-400">Database Mutaba'ah Realtime</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Mumtaz / Lancar</span>
                <h3 className="text-2xl font-black text-emerald-800 mt-1">{stats.lancar}</h3>
                <span className="text-[10px] font-semibold text-emerald-600">
                  {stats.percentageLancar}% Mutqin dari total
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Perlu Muroja’ah</span>
                <h3 className="text-2xl font-black text-amber-800 mt-1">{stats.mengulang}</h3>
                <span className="text-[10px] text-amber-600">Tahap Pengulangan Bimbingan</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <BookmarkCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Siswa Terbina</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{students.length}</h3>
                <span className="text-[10px] text-slate-400">Siswa Aktif TK Asy Syifa</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Curriculum Reference Quick Navigator */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" />
                <h3 className="text-xs font-bold tracking-wide uppercase text-amber-200">
                  Target Capaian Tahfidz & Karakter Islami TK Islam Asy Syifa
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-950/60 px-2.5 py-0.5 rounded-full text-emerald-200 border border-emerald-700/50">
                Juz 30 & 14 Doa Harian
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-[11px]">
              <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/40">
                <span className="text-emerald-300 font-bold block text-[10px]">Level 1: PAUD/TPA</span>
                <span className="font-semibold text-white">Al-Fatihah, An-Nas, Falaq, Ikhlas</span>
              </div>
              <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/40">
                <span className="text-emerald-300 font-bold block text-[10px]">Level 2: Kelompok A</span>
                <span className="font-semibold text-white">Al-Lahab s.d. Al-Kautsar</span>
              </div>
              <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/40">
                <span className="text-emerald-300 font-bold block text-[10px]">Level 3: Kelompok B</span>
                <span className="font-semibold text-white">Al-Ma’un s.d. Ad-Duha</span>
              </div>
              <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/40">
                <span className="text-emerald-300 font-bold block text-[10px]">Doa Makanan</span>
                <span className="font-semibold text-white">Sebelum & Sesudah Makan</span>
              </div>
              <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/40">
                <span className="text-emerald-300 font-bold block text-[10px]">Doa Ibadah & Adab</span>
                <span className="font-semibold text-white">Masuk Masjid & Kamar Mandi</span>
              </div>
              <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/40">
                <span className="text-emerald-300 font-bold block text-[10px]">Birrul Walidain</span>
                <span className="font-semibold text-white">Doa Orang Tua & Dunia Akhirat</span>
              </div>
            </div>
          </div>

          {/* Filters and Control Bar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl w-fit">
                <button
                  onClick={() => setCategoryTab('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    categoryTab === 'ALL'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  Semua Mutaba’ah ({tahfidzList.length})
                </button>
                <button
                  onClick={() => setCategoryTab('SURAH')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    categoryTab === 'SURAH'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  Surah Pendek Juz 30
                </button>
                <button
                  onClick={() => setCategoryTab('DOA')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    categoryTab === 'DOA'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  Doa Harian & Hadits
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl w-fit self-end lg:self-auto">
                <button
                  onClick={() => setActiveView('CARDS')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeView === 'CARDS' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Grid Kartu
                </button>
                <button
                  onClick={() => setActiveView('TABLE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeView === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Tabel Rinci
                </button>
              </div>
            </div>

            {/* Search and Secondary Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari siswa, surah, atau catatan..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-400 shrink-0" />
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                >
                  <option value="ALL">Semua Kelompok / Sentra</option>
                  {classGroups.map(grp => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                >
                  <option value="ALL">Semua Status Mutaba’ah</option>
                  <option value="Lancar">Hanya Lancar / Mumtaz</option>
                  <option value="Mengulang">Hanya Perlu Mengulang</option>
                  <option value="Belum Bimbingan">Belum Bimbingan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin" />
              <p className="text-xs font-semibold text-stone-600">Memuat data Mutaba’ah Tahfidz & Doa Harian...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Tidak ada catatan mutaba’ah ditemukan</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                {searchQuery || selectedClass !== 'ALL' || statusFilter !== 'ALL'
                  ? 'Silakan sesuaikan kata kunci pencarian atau filter yang Anda gunakan.'
                  : 'Belum ada catatan hafalan. Klik "Catat Setoran Baru" untuk mencatat capaian siswa.'}
              </p>
              {canEdit && (
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4" /> Catat Setoran Pertama
                </button>
              )}
            </div>
          ) : activeView === 'CARDS' ? (
            /* Card Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredList.map(item => {
                const student = students.find(s => s.id === item.studentId);
                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 block">
                            {student?.classGroup || 'Kelompok Siswa'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{item.studentName}</h4>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-xl font-bold text-[10px] shrink-0 ${
                            item.status === 'Lancar'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.status === 'Mengulang'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {item.status === 'Lancar' ? 'Mumtaz (Lancar)' : item.status === 'Mengulang' ? 'Perlu Muroja’ah' : 'Belum Bimbingan'}
                        </span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                            {item.surahName}
                          </span>
                          <span className="text-[11px] font-semibold text-stone-600 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                            {item.ayatProgress}
                          </span>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-stone-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 italic">
                          “{item.notes}”
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-semibold text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.date}
                      </span>

                      {canEdit && (
                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={quickUpdatingId === item.id || submitting}
                            onClick={() =>
                              handleQuickStatusChange(
                                item,
                                item.status === 'Lancar' ? 'Mengulang' : 'Lancar'
                              )
                            }
                            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                            title="Ubah Status Cepat"
                          >
                            {quickUpdatingId === item.id ? (
                              <>
                                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                <span>Menyimpan...</span>
                              </>
                            ) : (
                              item.status === 'Lancar' ? 'Set Mengulang' : 'Set Lancar'
                            )}
                          </button>
                          <button
                            disabled={quickUpdatingId === item.id || submitting}
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit Rincian"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Detailed Table View */
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Nama Siswa</th>
                      <th className="p-4">Kelompok</th>
                      <th className="p-4">Materi (Surah / Doa)</th>
                      <th className="p-4">Capaian Ayat</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Catatan Tajwid / Evaluasi</th>
                      {canEdit && <th className="p-4 text-center">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredList.map(item => {
                      const student = students.find(s => s.id === item.studentId);
                      return (
                        <tr key={item.id} className="hover:bg-stone-50 transition">
                          <td className="p-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">{item.date}</td>
                          <td className="p-4 font-bold text-slate-900 whitespace-nowrap">{item.studentName}</td>
                          <td className="p-4 text-stone-600 whitespace-nowrap">{student?.classGroup || '-'}</td>
                          <td className="p-4 font-semibold text-emerald-900 whitespace-nowrap">{item.surahName}</td>
                          <td className="p-4 text-stone-700 whitespace-nowrap">{item.ayatProgress}</td>
                          <td className="p-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                                item.status === 'Lancar'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'Mengulang'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-stone-600 italic max-w-xs truncate">{item.notes || '-'}</td>
                          {canEdit && (
                            <td className="p-4 text-center whitespace-nowrap">
                              <button
                                disabled={quickUpdatingId === item.id || submitting}
                                onClick={() => handleOpenEditModal(item)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-[10px] transition cursor-pointer inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Form Tambah / Edit Mutaba'ah (Staff only) */}
      {showModal && canEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? 'Edit Catatan Mutaba’ah' : 'Catat Setoran Baru'}
                </h3>
                <p className="text-stone-500 text-xs">
                  {editingItem ? 'Perbarui capaian hafalan dan evaluasi tajwid.' : 'Input bimbingan tahfidz dan doa harian siswa.'}
                </p>
              </div>
              <button
                disabled={submitting}
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTahfidz} className="space-y-3.5 text-xs">
              {/* Siswa Selector */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Pilih Siswa <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formStudentId}
                  onChange={e => setFormStudentId(e.target.value)}
                  required
                  disabled={Boolean(editingItem) || submitting}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-medium disabled:opacity-50"
                >
                  <option value="">-- Pilih Siswa TK Asy Syifa --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name || s.namaLengkap} ({s.classGroup || 'Kelompok'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Picker */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Kategori Materi</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setFormCategoryType('SURAH');
                      setFormSurahName(SURAH_PRESETS[0]);
                    }}
                    className={`py-2 rounded-xl font-bold text-[11px] transition cursor-pointer border ${
                      formCategoryType === 'SURAH'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Surah Juz 30
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setFormCategoryType('DOA');
                      setFormSurahName(DOA_PRESETS[0]);
                    }}
                    className={`py-2 rounded-xl font-bold text-[11px] transition cursor-pointer border ${
                      formCategoryType === 'DOA'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Doa Harian
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setFormCategoryType('CUSTOM')}
                    className={`py-2 rounded-xl font-bold text-[11px] transition cursor-pointer border ${
                      formCategoryType === 'CUSTOM'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Lainnya / Hadits
                  </button>
                </div>
              </div>

              {/* Surah / Doa Selector or Custom Input */}
              {formCategoryType === 'SURAH' ? (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pilih Surah</label>
                  <select
                    value={formSurahName}
                    disabled={submitting}
                    onChange={e => setFormSurahName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-50"
                  >
                    {SURAH_PRESETS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              ) : formCategoryType === 'DOA' ? (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pilih Doa Harian</label>
                  <select
                    value={formSurahName}
                    disabled={submitting}
                    onChange={e => setFormSurahName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-50"
                  >
                    {DOA_PRESETS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nama Materi / Hadits / Surah Khusus</label>
                  <input
                    type="text"
                    value={formCustomName}
                    disabled={submitting}
                    onChange={e => setFormCustomName(e.target.value)}
                    placeholder="Contoh: Hadits Menuntut Ilmu / Surah Al-Balad"
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-50"
                  />
                </div>
              )}

              {/* Ayat Progress & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Capaian Ayat / Keterangan</label>
                  <input
                    type="text"
                    value={formAyatProgress}
                    disabled={submitting}
                    onChange={e => setFormAyatProgress(e.target.value)}
                    placeholder="Contoh: Ayat 1 - 6 (Lengkap)"
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status Kelancaran</label>
                  <select
                    value={formStatus}
                    disabled={submitting}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-bold disabled:opacity-50"
                  >
                    <option value="Lancar">Mumtaz (Lancar)</option>
                    <option value="Mengulang">Jayyid (Perlu Mengulang)</option>
                    <option value="Belum Bimbingan">Belum Bimbingan</option>
                  </select>
                </div>
              </div>

              {/* Tanggal Setoran */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tanggal Bimbingan / Setoran</label>
                <input
                  type="date"
                  value={formDate}
                  disabled={submitting}
                  onChange={e => setFormDate(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-50"
                />
              </div>

              {/* Notes / Evaluasi Guru */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Catatan Evaluasi Guru / Ustadzah</label>
                <textarea
                  value={formNotes}
                  disabled={submitting}
                  onChange={e => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="Catatan tajwid, makhraj huruf, kelancaran adab..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:opacity-50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold transition cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Mutaba’ah'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
