import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Student, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ShieldAlert,
  Lock,
  ArrowLeft,
  ShieldCheck,
  UserCheck
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

// R3 Authority Matrix: Staff & Management have access to Master Student Directory.
// Parents, prospective parents, alumni, and unauthenticated sessions are strictly DENIED.
const R3_AUTHORIZED_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KETUA_YAYASAN',
  'GURU',
  'KEUANGAN'
];

export const R3DataSiswa: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Canonical Identity & RBAC Resolution (Fail-Closed)
  // activeRole is the authoritative session role; no fallback to userProfile.role or privileged defaults.
  const canonicalRole: UserRole | null = useMemo(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole)
      ? (activeRole as UserRole)
      : null;
  }, [currentUser?.uid, activeRole]);

  // Authorization Decision
  const canAccessR3 = Boolean(
    currentUser?.uid &&
    canonicalRole &&
    R3_AUTHORIZED_ROLES.includes(canonicalRole)
  );

  // FAIL CLOSED: Only authenticated users with verified canonical role of SUPER_ADMIN, ADMIN, or KEPALA_SEKOLAH can create or edit students.
  const canEdit = Boolean(
    canAccessR3 &&
    currentUser?.uid &&
    canonicalRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(canonicalRole)
  );

  // Privacy Control: Sensitive parent contact info viewable by educators and administrators
  const canViewSensitiveInfo = Boolean(
    canAccessR3 &&
    currentUser?.uid &&
    canonicalRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'].includes(canonicalRole)
  );

  // Authentic Actor Identity for audit logging (Zero synthetic fallbacks)
  const actorDisplayName = useMemo(() => {
    return (
      userProfile?.nama?.trim() ||
      userProfile?.name?.trim() ||
      currentUser?.displayName?.trim() ||
      currentUser?.email?.trim() ||
      (currentUser?.uid ? `User (${currentUser.uid.slice(0, 8)})` : 'Sesi Autentikasi')
    );
  }, [userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email, currentUser?.uid]);

  const [newStudent, setNewStudent] = useState<{
    name: string;
    nickname: string;
    nis: string;
    nisn: string;
    gender: 'L' | 'P';
    classGroup: 'Kelompok A1' | 'Kelompok A2' | 'Kelompok B1' | 'Kelompok B2' | 'PAUD TPA';
    birthDate: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    address: string;
    status: 'Aktif' | 'Alumni' | 'Cuti';
    bloodType: string;
    joinedYear: number;
  }>({
    name: '',
    nickname: '',
    nis: '',
    nisn: '',
    gender: 'L',
    classGroup: 'Kelompok A1',
    birthDate: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    status: 'Aktif',
    bloodType: '',
    joinedYear: new Date().getFullYear()
  });

  const [editForm, setEditForm] = useState<Partial<Student>>({
    name: '',
    nickname: '',
    nis: '',
    nisn: '',
    gender: 'L',
    classGroup: 'Kelompok A1',
    birthDate: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    status: 'Aktif',
    bloodType: ''
  });

  // HARD PRE-QUERY AUTHORIZATION GATE
  // Unauthorized sessions must NEVER trigger DataService.getStudents()
  const loadStudents = useCallback(async () => {
    if (!canAccessR3 || !currentUser?.uid || !canonicalRole) {
      setStudents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await DataService.getStudents(
        canonicalRole,
        currentUser.uid,
        currentUser.email || undefined
      );
      setStudents(data || []);
    } catch (err: unknown) {
      console.error('Error fetching students:', err);
      setFeedback({
        type: 'error',
        message: 'Gagal memuat data master siswa dari database.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [canAccessR3, currentUser?.uid, currentUser?.email, canonicalRole]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!canAccessR3 || !canEdit || !currentUser?.uid || !canonicalRole) {
      setFeedback({
        type: 'error',
        message: 'Akses Ditolak: Hanya Super Admin, Admin, dan Kepala Sekolah yang memiliki izin menambah data siswa.'
      });
      return;
    }

    const cleanName = newStudent.name.trim();
    if (!cleanName) {
      setFeedback({
        type: 'error',
        message: 'Validasi Gagal: Nama lengkap siswa wajib diisi.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const added: Student = {
        id: `std-${Date.now()}`,
        nis: newStudent.nis?.trim() || '',
        nisn: newStudent.nisn?.trim() || '',
        name: cleanName,
        nickname: newStudent.nickname?.trim() || cleanName.split(' ')[0] || cleanName,
        gender: newStudent.gender || 'L',
        classGroup: newStudent.classGroup || 'Kelompok A1',
        birthDate: newStudent.birthDate?.trim() || '',
        parentName: newStudent.parentName?.trim() || '',
        parentPhone: newStudent.parentPhone?.trim() || '',
        parentEmail: newStudent.parentEmail?.trim() || '',
        address: newStudent.address?.trim() || '',
        status: newStudent.status || 'Aktif',
        bloodType: newStudent.bloodType?.trim() || undefined,
        joinedYear: Number(newStudent.joinedYear) || new Date().getFullYear()
      };

      await DataService.saveStudent(added);

      // Audit Trail with Authentic Actor & Canonical Role
      await DataService.logAction(
        actorDisplayName,
        canonicalRole,
        'CREATE_STUDENT',
        `Menambahkan siswa baru: ${added.name} (NIS: ${added.nis || '-'}, Kelompok: ${added.classGroup})`
      ).catch(() => {});

      // Anti Stale-Closure State Update
      setStudents(prev => [added, ...prev]);
      setShowAddModal(false);
      setNewStudent({
        name: '',
        nickname: '',
        nis: '',
        nisn: '',
        gender: 'L',
        classGroup: 'Kelompok A1',
        birthDate: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        status: 'Aktif',
        bloodType: '',
        joinedYear: new Date().getFullYear()
      });

      setFeedback({
        type: 'success',
        message: `Siswa "${added.name}" berhasil ditambahkan ke master registry.`
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      console.error('Error adding student:', err);
      const errMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setFeedback({
        type: 'error',
        message: `Gagal menambahkan data siswa: ${errMsg}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (student: Student) => {
    if (!canAccessR3 || !canEdit || !currentUser?.uid || !canonicalRole) {
      setFeedback({
        type: 'error',
        message: 'Akses Ditolak: Anda tidak memiliki izin untuk mengedit data siswa.'
      });
      return;
    }

    setSelectedStudentForEdit(student);
    setEditForm({
      name: student.name || '',
      nickname: student.nickname || '',
      nis: student.nis || '',
      nisn: student.nisn || '',
      gender: student.gender || 'L',
      classGroup: student.classGroup || 'Kelompok A1',
      birthDate: student.birthDate || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      parentEmail: student.parentEmail || '',
      address: student.address || '',
      status: student.status || 'Aktif',
      bloodType: student.bloodType || ''
    });
  };

  const handleCloseEdit = () => {
    setSelectedStudentForEdit(null);
    setEditForm({});
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!canAccessR3 || !canEdit || !currentUser?.uid || !canonicalRole) {
      setFeedback({
        type: 'error',
        message: 'Akses Ditolak: Anda tidak memiliki izin untuk mengubah data siswa.'
      });
      return;
    }

    if (!selectedStudentForEdit) return;

    const cleanName = editForm.name?.trim();
    if (!cleanName) {
      setFeedback({ type: 'error', message: 'Validasi Gagal: Nama lengkap siswa wajib diisi.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedStudent: Student = {
        ...selectedStudentForEdit,
        name: cleanName,
        nickname: editForm.nickname?.trim() || cleanName.split(' ')[0] || cleanName,
        nis: editForm.nis?.trim() ?? selectedStudentForEdit.nis ?? '',
        nisn: editForm.nisn?.trim() ?? selectedStudentForEdit.nisn ?? '',
        gender: (editForm.gender as 'L' | 'P') || selectedStudentForEdit.gender || 'L',
        classGroup: (editForm.classGroup as Student['classGroup']) || selectedStudentForEdit.classGroup || 'Kelompok A1',
        birthDate: editForm.birthDate?.trim() ?? selectedStudentForEdit.birthDate ?? '',
        parentName: editForm.parentName?.trim() ?? selectedStudentForEdit.parentName ?? '',
        parentPhone: editForm.parentPhone?.trim() ?? selectedStudentForEdit.parentPhone ?? '',
        parentEmail: editForm.parentEmail?.trim() ?? selectedStudentForEdit.parentEmail ?? '',
        address: editForm.address?.trim() ?? selectedStudentForEdit.address ?? '',
        status: (editForm.status as Student['status']) || selectedStudentForEdit.status || 'Aktif',
        bloodType: editForm.bloodType?.trim() || undefined
      };

      await DataService.saveStudent(updatedStudent);

      // Audit Trail with Authentic Actor & Canonical Role
      await DataService.logAction(
        actorDisplayName,
        canonicalRole,
        'UPDATE_STUDENT',
        `Memperbarui data siswa: ${updatedStudent.name} (NIS: ${updatedStudent.nis || '-'}, Status: ${updatedStudent.status})`
      ).catch(() => {});

      // Anti Stale-Closure State Update
      setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
      handleCloseEdit();
      setFeedback({
        type: 'success',
        message: `Perubahan data siswa "${updatedStudent.name}" berhasil disimpan.`
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      console.error('Error saving student edit:', err);
      const errMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setFeedback({
        type: 'error',
        message: `Gagal memperbarui data siswa: ${errMsg}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchesClass = classFilter === 'Semua' || s.classGroup === classFilter;
      const sName = s.name || '';
      const sNis = s.nis || '';
      const sParent = s.parentName || '';
      const term = search.toLowerCase().trim();

      const matchesSearch =
        !term ||
        sName.toLowerCase().includes(term) ||
        sNis.toLowerCase().includes(term) ||
        sParent.toLowerCase().includes(term);

      return matchesClass && matchesSearch;
    });
  }, [students, classFilter, search]);

  // SENSITIVE DOM ISOLATION: FAIL-CLOSED ACCESS DENIED
  // Unauthorized sessions must NEVER render the student directory, table, names, NIS, or parent contacts.
  if (!canAccessR3) {
    return (
      <div id="r3-access-denied-container" className="space-y-6 max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 border border-rose-200 rounded-3xl flex items-center justify-center mx-auto text-rose-700 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full inline-block">
              Akses Ditolak — Modul R3 Terlindungi
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Master Data Siswa Terproteksi
            </h1>
            <p className="text-stone-600 text-xs leading-relaxed">
              Direktori Master Data Siswa TK Asy Syifa memuat informasi kependudukan, NIS/NISN resmi Dapodik,
              kontak wali murid, dan catatan siswa yang dilindungi undang-undang perlindungan data pribadi anak.
              Sesi Anda saat ini tidak memiliki otorisasi untuk mengakses direktori ini.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500 font-medium">Status Autentikasi:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                {currentUser?.uid ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Terautentikasi ({currentUser.uid.slice(0, 8)})
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    Tidak Terautentikasi
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500 font-medium">Role Sesi Terdeteksi:</span>
              <span className="font-bold text-slate-800 font-mono">
                {canonicalRole || (activeRole ? `${activeRole} (Tidak Sah)` : 'None / Ditolak')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">Kebijakan Otorisasi:</span>
              <span className="font-semibold text-rose-700">Staff / Manajemen Only</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => { window.location.href = '/sim'; }}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard SIM
            </button>
            {activeRole === 'WALI_MURID' && (
              <button
                onClick={() => { window.location.href = '/sim?tab=r29'; }}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl border border-stone-300 transition-colors flex items-center gap-2 cursor-pointer"
              >
                Buka Portal Wali Murid
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // AUTHORIZED VIEW (Staff & Educators)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Module R3 - Master Data Siswa
            </span>
            <span className="text-xs font-medium text-stone-500">
              TK ASY SYIFA TANGGUL
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Data Siswa Master TK Asy Syifa
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Kelola biodata, NIS, NISN, kelompok belajar, dan info orang tua siswa secara terpusat.
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Siswa Baru
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-[11px] font-medium text-stone-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mode Lihat Terverifikasi ({canonicalRole})</span>
          </div>
        )}
      </div>

      {/* Role notice for view-only staff */}
      {!canEdit && (
        <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-2.5 text-xs text-stone-700">
          <ShieldAlert className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>
            Hak Akses: Anda terhubung dengan role <strong>{canonicalRole}</strong>. Penambahan dan pengeditan data siswa master dibatasi untuk Super Admin, Admin, dan Kepala Sekolah.
          </span>
        </div>
      )}

      {/* Inline Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between gap-3 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
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
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama, NIS, orang tua..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-stone-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="Semua">Semua Kelompok</option>
              <option value="Kelompok A1">Kelompok A1</option>
              <option value="Kelompok A2">Kelompok A2</option>
              <option value="Kelompok B1">Kelompok B1</option>
              <option value="Kelompok B2">Kelompok B2</option>
              <option value="PAUD TPA">PAUD TPA</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-500">
              Total {filtered.length} Siswa Terdaftar
            </span>
          </div>
        </div>

        {/* Privacy Note */}
        {!canViewSensitiveInfo && (
          <p className="text-[11px] text-stone-400 italic">
            * Kontak telepon orang tua disamarkan secara otomatis untuk perlindungan privasi anak.
          </p>
        )}

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="p-3">NIS / NISN</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">L/P</th>
                <th className="p-3">Kelompok</th>
                <th className="p-3">Nama Orang Tua</th>
                <th className="p-3">No. Telp Ortu</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
                      <span className="text-xs font-medium text-stone-600">
                        Memuat data siswa master TK Asy Syifa...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <GraduationCap className="w-9 h-9 text-stone-300" />
                      <p className="font-semibold text-slate-700">Tidak ada data siswa yang cocok dengan filter.</p>
                      <p className="text-[11px] text-stone-400">Silakan sesuaikan kata kunci pencarian atau filter kelompok belajar.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 font-mono text-stone-600">
                      {s.nis || '-'}{s.nisn ? ` / ${s.nisn}` : ''}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {s.name} {s.nickname ? `(${s.nickname})` : ''}
                    </td>
                    <td className="p-3 font-medium">{s.gender}</td>
                    <td className="p-3 font-semibold text-emerald-800">{s.classGroup}</td>
                    <td className="p-3 text-stone-700">{s.parentName || '-'}</td>
                    <td className="p-3 font-mono text-stone-600">
                      {s.parentPhone ? (
                        canViewSensitiveInfo ? (
                          s.parentPhone
                        ) : (
                          <span title="Disamarkan untuk privasi anak" className="text-stone-400">
                            {s.parentPhone.length > 6
                              ? `${s.parentPhone.slice(0, 4)}••••${s.parentPhone.slice(-2)}`
                              : '••••••••'}
                          </span>
                        )
                      ) : (
                        <span className="text-stone-300 italic text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          s.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'Alumni'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {canEdit ? (
                        <button
                          onClick={() => handleOpenEdit(s)}
                          title={`Edit data ${s.name}`}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-stone-400 text-[10px]">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Siswa */}
      {selectedStudentForEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Edit Data Siswa
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Perbarui Biodata: {selectedStudentForEdit.name}
                </h2>
              </div>
              <button
                onClick={handleCloseEdit}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Contoh: Muhammad Rayyan Al-Fatih"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editForm.nickname || ''}
                    onChange={e => setEditForm({ ...editForm, nickname: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Contoh: Rayyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS (Nomor Induk Siswa)</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editForm.nis || ''}
                    onChange={e => setEditForm({ ...editForm, nis: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Contoh: 2025001"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN Resmi (Dapodik)</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editForm.nisn || ''}
                    onChange={e => setEditForm({ ...editForm, nisn: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Contoh: 0191234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelompok Belajar</label>
                  <select
                    disabled={isSubmitting}
                    value={editForm.classGroup || 'Kelompok A1'}
                    onChange={e => setEditForm({ ...editForm, classGroup: e.target.value as Student['classGroup'] })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium disabled:bg-stone-100"
                  >
                    <option value="Kelompok A1">Kelompok A1</option>
                    <option value="Kelompok A2">Kelompok A2</option>
                    <option value="Kelompok B1">Kelompok B1</option>
                    <option value="Kelompok B2">Kelompok B2</option>
                    <option value="PAUD TPA">PAUD TPA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    disabled={isSubmitting}
                    value={editForm.gender || 'L'}
                    onChange={e => setEditForm({ ...editForm, gender: e.target.value as 'L' | 'P' })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Siswa</label>
                  <select
                    disabled={isSubmitting}
                    value={editForm.status || 'Aktif'}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value as Student['status'] })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Cuti">Cuti</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    disabled={isSubmitting}
                    value={editForm.birthDate || ''}
                    onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Golongan Darah</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editForm.bloodType || ''}
                    onChange={e => setEditForm({ ...editForm, bloodType: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Contoh: A, B, AB, O"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editForm.parentName || ''}
                    onChange={e => setEditForm({ ...editForm, parentName: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Nama orang tua/wali"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No WhatsApp Ortu</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editForm.parentPhone || ''}
                    onChange={e => setEditForm({ ...editForm, parentPhone: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Ortu</label>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={editForm.parentEmail || ''}
                    onChange={e => setEditForm({ ...editForm, parentEmail: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Email orang tua"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={editForm.address || ''}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  placeholder="Alamat lengkap tempat tinggal"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCloseEdit}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Input Siswa Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Registrasi Master
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">Input Data Siswa Baru</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-slate-800 cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={newStudent.name}
                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Nama lengkap anak"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newStudent.nickname}
                    onChange={e => setNewStudent({ ...newStudent, nickname: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Nama panggilan sehari-hari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS (Jika sudah ada)</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newStudent.nis}
                    onChange={e => setNewStudent({ ...newStudent, nis: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Nomor Induk Siswa lokal"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN (Jika sudah ada)</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newStudent.nisn}
                    onChange={e => setNewStudent({ ...newStudent, nisn: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Nomor Induk Siswa Nasional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelompok Belajar</label>
                  <select
                    disabled={isSubmitting}
                    value={newStudent.classGroup}
                    onChange={e => setNewStudent({ ...newStudent, classGroup: e.target.value as Student['classGroup'] })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium disabled:bg-stone-100"
                  >
                    <option value="Kelompok A1">Kelompok A1</option>
                    <option value="Kelompok A2">Kelompok A2</option>
                    <option value="Kelompok B1">Kelompok B1</option>
                    <option value="Kelompok B2">Kelompok B2</option>
                    <option value="PAUD TPA">PAUD TPA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    disabled={isSubmitting}
                    value={newStudent.gender}
                    onChange={e => setNewStudent({ ...newStudent, gender: e.target.value as 'L' | 'P' })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Masuk</label>
                  <input
                    type="number"
                    disabled={isSubmitting}
                    value={newStudent.joinedYear}
                    onChange={e => setNewStudent({ ...newStudent, joinedYear: Number(e.target.value) || new Date().getFullYear() })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    disabled={isSubmitting}
                    value={newStudent.birthDate}
                    onChange={e => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Golongan Darah</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newStudent.bloodType}
                    onChange={e => setNewStudent({ ...newStudent, bloodType: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Contoh: A, B, AB, O"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newStudent.parentName}
                    onChange={e => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Nama orang tua/wali"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No WhatsApp Ortu</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newStudent.parentPhone}
                    onChange={e => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Ortu</label>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={newStudent.parentEmail}
                    onChange={e => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                    placeholder="Email orang tua"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={newStudent.address}
                  onChange={e => setNewStudent({ ...newStudent, address: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-100"
                  placeholder="Alamat lengkap tempat tinggal"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Simpan Siswa'
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
