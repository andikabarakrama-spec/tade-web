import React, { useEffect, useState, useMemo } from 'react';
import { Teacher, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Search, Edit2, CheckCircle2, AlertCircle, X, Loader2, Lock } from 'lucide-react';

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

export const R4DataGuru: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Canonical Identity & RBAC Resolution
  // FAIL CLOSED: activeRole is the strict PRIMARY session authority.
  // NO VALID ACTIVE ROLE = DEFAULT DENY.
  // Stale userProfile.role must NEVER grant write privileges if activeRole is missing, null, undefined, or unverified.
  const verifiedActiveRole: UserRole | null =
    activeRole && CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;

  // Canonical fallback role for display/audit identity only when activeRole is absent
  const fallbackProfileRole: UserRole | null =
    userProfile?.role && CANONICAL_ROLES.includes(userProfile.role as UserRole) ? (userProfile.role as UserRole) : null;

  const currentRoleForAudit: UserRole | null = verifiedActiveRole || fallbackProfileRole;

  // FAIL CLOSED: Only authenticated users with a verified ACTIVE ROLE of SUPER_ADMIN, ADMIN, or KEPALA_SEKOLAH can create or edit teacher records.
  const canEdit = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(verifiedActiveRole)
  );

  // Privacy Control: Sensitive teacher contact info viewable only by authorized leadership roles with verified active role
  const canViewSensitiveInfo = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(verifiedActiveRole)
  );

  const actorName =
    userProfile?.nama ||
    userProfile?.name ||
    currentUser?.displayName ||
    currentUser?.email ||
    (currentUser?.uid ? `User (${currentUser.uid.slice(0, 8)})` : '');

  const [newTeacherForm, setNewTeacherForm] = useState<Partial<Teacher>>({
    name: '',
    title: '',
    gender: 'P',
    position: '',
    nip: '',
    nuptk: '',
    phone: '',
    email: '',
    isWaliKelas: false,
    assignedClass: 'Kelompok A1'
  });

  const [editTeacherForm, setEditTeacherForm] = useState<Partial<Teacher>>({
    name: '',
    title: '',
    gender: 'P',
    position: '',
    nip: '',
    nuptk: '',
    phone: '',
    email: '',
    isWaliKelas: false,
    assignedClass: 'Kelompok A1'
  });

  const loadTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.getTeachers();
      setTeachers(data || []);
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setFeedback({
        type: 'error',
        message: 'Gagal memuat data master guru & PTK dari database.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!canEdit) {
      setFeedback({
        type: 'error',
        message: 'Akses Ditolak: Hanya Super Admin, Admin, dan Kepala Sekolah yang berwenang menambah data PTK.'
      });
      return;
    }

    const cleanName = newTeacherForm.name?.trim();
    if (!cleanName) {
      setFeedback({ type: 'error', message: 'Validasi Gagal: Nama lengkap Guru / PTK wajib diisi.' });
      return;
    }

    const cleanPosition = newTeacherForm.position?.trim();
    if (!cleanPosition) {
      setFeedback({ type: 'error', message: 'Validasi Gagal: Jabatan / tugas utama wajib diisi.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const added: Teacher = {
        id: 'tch-' + Date.now(),
        name: cleanName,
        title: newTeacherForm.title?.trim() || (newTeacherForm.isWaliKelas ? `Wali Kelas ${newTeacherForm.assignedClass}` : 'Guru / Staf'),
        gender: (newTeacherForm.gender as 'L' | 'P') || 'P',
        position: cleanPosition,
        nip: newTeacherForm.nip?.trim() || '',
        nuptk: newTeacherForm.nuptk?.trim() || '',
        phone: newTeacherForm.phone?.trim() || '',
        email: newTeacherForm.email?.trim() || '',
        isWaliKelas: !!newTeacherForm.isWaliKelas,
        assignedClass: newTeacherForm.isWaliKelas ? newTeacherForm.assignedClass : undefined
      };

      await DataService.saveTeacher(added);

      // Audit Trail
      if (actorName) {
        await DataService.logAction(
          actorName,
          currentRoleForAudit,
          'CREATE_TEACHER',
          `Menambahkan PTK baru: ${added.name} (${added.position}, NUPTK: ${added.nuptk || '-'})`
        ).catch(() => {});
      }

      setTeachers(prev => [added, ...prev]);
      setShowAddModal(false);
      setNewTeacherForm({
        name: '',
        title: '',
        gender: 'P',
        position: '',
        nip: '',
        nuptk: '',
        phone: '',
        email: '',
        isWaliKelas: false,
        assignedClass: 'Kelompok A1'
      });
      setFeedback({ type: 'success', message: `Data PTK "${added.name}" berhasil ditambahkan ke master registry.` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      console.error('Error saving new teacher:', err);
      setFeedback({ type: 'error', message: `Gagal menambahkan PTK: ${err.message || 'Terjadi kesalahan sistem'}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (teacher: Teacher) => {
    if (!canEdit) {
      setFeedback({
        type: 'error',
        message: 'Akses Ditolak: Anda tidak memiliki izin untuk mengedit data PTK.'
      });
      return;
    }

    setSelectedTeacherForEdit(teacher);
    setEditTeacherForm({
      name: teacher.name || '',
      title: teacher.title || '',
      gender: teacher.gender || 'P',
      position: teacher.position || '',
      nip: teacher.nip || '',
      nuptk: teacher.nuptk || '',
      phone: teacher.phone || '',
      email: teacher.email || '',
      isWaliKelas: teacher.isWaliKelas || false,
      assignedClass: teacher.assignedClass || 'Kelompok A1'
    });
  };

  const handleCloseEdit = () => {
    setSelectedTeacherForEdit(null);
    setEditTeacherForm({});
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!canEdit) {
      setFeedback({
        type: 'error',
        message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk memperbarui data PTK.'
      });
      return;
    }

    if (!selectedTeacherForEdit) return;

    const cleanName = editTeacherForm.name?.trim();
    if (!cleanName) {
      setFeedback({ type: 'error', message: 'Validasi Gagal: Nama lengkap Guru / PTK wajib diisi.' });
      return;
    }

    const cleanPosition = editTeacherForm.position?.trim();
    if (!cleanPosition) {
      setFeedback({ type: 'error', message: 'Validasi Gagal: Jabatan / tugas utama wajib diisi.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedTeacher: Teacher = {
        ...selectedTeacherForEdit,
        name: cleanName,
        title: editTeacherForm.title?.trim() ?? selectedTeacherForEdit.title ?? 'Guru / Staf',
        gender: (editTeacherForm.gender as 'L' | 'P') || selectedTeacherForEdit.gender || 'P',
        position: cleanPosition,
        nip: editTeacherForm.nip?.trim() ?? selectedTeacherForEdit.nip ?? '',
        nuptk: editTeacherForm.nuptk?.trim() ?? selectedTeacherForEdit.nuptk ?? '',
        phone: editTeacherForm.phone?.trim() ?? selectedTeacherForEdit.phone ?? '',
        email: editTeacherForm.email?.trim() ?? selectedTeacherForEdit.email ?? '',
        isWaliKelas: editTeacherForm.isWaliKelas !== undefined ? editTeacherForm.isWaliKelas : selectedTeacherForEdit.isWaliKelas,
        assignedClass: editTeacherForm.isWaliKelas ? (editTeacherForm.assignedClass || selectedTeacherForEdit.assignedClass || 'Kelompok A1') : undefined
      };

      await DataService.saveTeacher(updatedTeacher);

      // Audit Trail
      if (actorName) {
        await DataService.logAction(
          actorName,
          currentRoleForAudit,
          'UPDATE_TEACHER',
          `Memperbarui data PTK: ${updatedTeacher.name} (${updatedTeacher.position}, Status Wali: ${updatedTeacher.isWaliKelas ? (updatedTeacher.assignedClass || 'Wali Kelas') : 'Bukan Wali'})`
        ).catch(() => {});
      }

      setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
      handleCloseEdit();
      setFeedback({ type: 'success', message: `Perubahan data PTK "${updatedTeacher.name}" berhasil disimpan.` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      console.error('Error updating teacher:', err);
      setFeedback({ type: 'error', message: `Gagal memperbarui data PTK: ${err.message || 'Terjadi kesalahan sistem'}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return teachers;
    return teachers.filter(t => {
      const name = t.name || '';
      const position = t.position || '';
      const nuptk = t.nuptk || '';
      const nip = t.nip || '';
      return (
        name.toLowerCase().includes(term) ||
        position.toLowerCase().includes(term) ||
        nuptk.toLowerCase().includes(term) ||
        nip.toLowerCase().includes(term)
      );
    });
  }, [teachers, search]);

  const maskPhone = (phone?: string) => {
    if (!phone || phone === '-') return '-';
    const clean = phone.trim();
    if (clean.length <= 6) return '••••••••';
    return `${clean.slice(0, 4)}••••${clean.slice(-2)}`;
  };

  const maskEmail = (email?: string) => {
    if (!email || email === '-') return '-';
    const parts = email.split('@');
    if (parts.length !== 2) return '••••@••••';
    const [local, domain] = parts;
    const maskedLocal = local.length > 2 ? `${local.slice(0, 2)}•••` : '••';
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Module R4 - Data Guru & PTK
            </span>
            <span className="text-xs font-medium text-stone-500">
              TK ASY SYIFA TANGGUL
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Master Data Guru & Tenaga Kependidikan
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Kelola data PTK, NUPTK, NIP, jabatan, dan penugasan wali kelas secara terpadu.
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Guru / PTK
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-[11px] font-medium text-stone-600">
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            <span>Mode Baca (Otoritas Terbatas)</span>
          </div>
        )}
      </div>

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
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama guru, jabatan, NIP, NUPTK..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <span className="text-xs font-medium text-stone-500">Total {filtered.length} PTK Terdaftar</span>
        </div>

        {/* Staff Privacy Notice */}
        {!canViewSensitiveInfo && (
          <p className="text-[11px] text-stone-400 italic">
            * Kontak telepon dan email PTK disamarkan secara otomatis untuk perlindungan privasi data pegawai.
          </p>
        )}

        {/* Teachers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="p-3">Nama PTK</th>
                <th className="p-3">NUPTK / NIP</th>
                <th className="p-3">Jabatan / Tugas</th>
                <th className="p-3">Wali Kelas</th>
                <th className="p-3">No. Telp</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
                      <span className="text-xs font-medium text-stone-600">
                        Memuat data master guru & PTK...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <Users className="w-8 h-8 text-stone-300" />
                      <p className="font-semibold text-slate-700">Tidak ada data Guru atau PTK yang cocok dengan pencarian.</p>
                      <p className="text-[11px] text-stone-400">Silakan sesuaikan kata kunci pencarian nama, jabatan, NIP, atau NUPTK.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{t.name}</div>
                      {t.title && <div className="text-[10px] text-stone-500">{t.title}</div>}
                    </td>
                    <td className="p-3 font-mono text-stone-600">
                      <div>{t.nuptk || '-'}</div>
                      <div className="text-[10px] text-stone-400">NIP: {t.nip || '-'}</div>
                    </td>
                    <td className="p-3 text-stone-700 font-semibold">{t.position}</td>
                    <td className="p-3">
                      {t.isWaliKelas ? (
                        <span className="px-2 py-0.5 rounded-md font-bold text-emerald-800 bg-emerald-100 text-[10px]">
                          {t.assignedClass || 'Wali Kelas'}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="p-3 text-stone-600 font-mono">
                      {canViewSensitiveInfo ? (
                        t.phone || '-'
                      ) : (
                        <span title="Disamarkan untuk privasi data pegawai" className="text-stone-400">
                          {maskPhone(t.phone)}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-stone-600 font-mono">
                      {canViewSensitiveInfo ? (
                        t.email || '-'
                      ) : (
                        <span title="Disamarkan untuk privasi data pegawai" className="text-stone-400">
                          {maskEmail(t.email)}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {canEdit ? (
                        <button
                          onClick={() => handleOpenEdit(t)}
                          title={`Edit data ${t.name}`}
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

      {/* Modal Add Teacher */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Tambah PTK Baru
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Registrasi Guru & Tenaga Kependidikan
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={newTeacherForm.name || ''}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: Siti Maimunah, S.Pd"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Panggilan / Deskripsi Gelar</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newTeacherForm.title || ''}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, title: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: Wali Kelas B1 / Guru Sentra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan / Tugas Utama *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={newTeacherForm.position || ''}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, position: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: Guru Kelas / Koordinator STEAM"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    disabled={isSubmitting}
                    value={newTeacherForm.gender || 'P'}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, gender: e.target.value as 'L' | 'P' })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                  >
                    <option value="P">Perempuan (P)</option>
                    <option value="L">Laki-laki (L)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newTeacherForm.nuptk || ''}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, nuptk: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: 876543210980001"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP (Jika Ada)</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newTeacherForm.nip || ''}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, nip: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: 199008202015022008"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="addIsWaliKelas"
                    disabled={isSubmitting}
                    checked={!!newTeacherForm.isWaliKelas}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, isWaliKelas: e.target.checked })}
                    className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-600 disabled:opacity-50"
                  />
                  <label htmlFor="addIsWaliKelas" className="font-bold text-slate-800 cursor-pointer">
                    Ditugaskan Sebagai Wali Kelas
                  </label>
                </div>

                {newTeacherForm.isWaliKelas && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kelompok Belajar yang Diampu</label>
                    <select
                      disabled={isSubmitting}
                      value={newTeacherForm.assignedClass || 'Kelompok A1'}
                      onChange={e => setNewTeacherForm({ ...newTeacherForm, assignedClass: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium disabled:bg-stone-50"
                    >
                      <option value="Kelompok A1">Kelompok A1</option>
                      <option value="Kelompok A2">Kelompok A2</option>
                      <option value="Kelompok B1">Kelompok B1</option>
                      <option value="Kelompok B2">Kelompok B2</option>
                      <option value="PAUD TPA">PAUD TPA</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / Telp</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={newTeacherForm.phone || ''}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: 081234567002"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={newTeacherForm.email || ''}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: nama.guru@tkasysyifa.sch.id"
                  />
                </div>
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
                    'Simpan Guru / PTK'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Teacher */}
      {selectedTeacherForEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Edit Data PTK
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Perbarui Data: {selectedTeacherForEdit.name}
                </h2>
              </div>
              <button
                onClick={handleCloseEdit}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={editTeacherForm.name || ''}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, name: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: Siti Maimunah, S.Pd"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Panggilan / Deskripsi Gelar</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editTeacherForm.title || ''}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, title: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: Wali Kelas B1 / Guru Sentra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan / Tugas Utama *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={editTeacherForm.position || ''}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, position: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: Guru Kelas / Koordinator STEAM"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    disabled={isSubmitting}
                    value={editTeacherForm.gender || 'P'}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, gender: e.target.value as 'L' | 'P' })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                  >
                    <option value="P">Perempuan (P)</option>
                    <option value="L">Laki-laki (L)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editTeacherForm.nuptk || ''}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, nuptk: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: 876543210980001"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP (Jika Ada)</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editTeacherForm.nip || ''}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, nip: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: 199008202015022008"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsWaliKelas"
                    disabled={isSubmitting}
                    checked={!!editTeacherForm.isWaliKelas}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, isWaliKelas: e.target.checked })}
                    className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-600 disabled:opacity-50"
                  />
                  <label htmlFor="editIsWaliKelas" className="font-bold text-slate-800 cursor-pointer">
                    Ditugaskan Sebagai Wali Kelas
                  </label>
                </div>

                {editTeacherForm.isWaliKelas && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kelompok Belajar yang Diampu</label>
                    <select
                      disabled={isSubmitting}
                      value={editTeacherForm.assignedClass || 'Kelompok A1'}
                      onChange={e => setEditTeacherForm({ ...editTeacherForm, assignedClass: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium disabled:bg-stone-50"
                    >
                      <option value="Kelompok A1">Kelompok A1</option>
                      <option value="Kelompok A2">Kelompok A2</option>
                      <option value="Kelompok B1">Kelompok B1</option>
                      <option value="Kelompok B2">Kelompok B2</option>
                      <option value="PAUD TPA">PAUD TPA</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / Telp</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editTeacherForm.phone || ''}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: 081234567002"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={editTeacherForm.email || ''}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, email: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:bg-stone-50"
                    placeholder="Contoh: nama.guru@tkasysyifa.sch.id"
                  />
                </div>
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
    </div>
  );
};
