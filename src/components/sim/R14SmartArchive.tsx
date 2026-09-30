import React, { useState, useEffect, useMemo } from 'react';
import { DigitalArchive, ArchiveCategory, ArchiveVersion, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Folder,
  FileText,
  Upload,
  Search,
  Download,
  History,
  Edit,
  Trash2,
  X,
  ShieldCheck,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  Sparkles
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
];

const DEFAULT_FOLDERS = [
  'Administrasi Sekolah',
  'Data Peserta Didik',
  'Guru & Pegawai',
  'Keuangan',
  'Akademik',
  'Surat Masuk',
  'Surat Keluar',
  'Legalitas',
  'Dokumentasi Kegiatan',
  'Backup Historis'
];

const CATEGORIES: { key: ArchiveCategory; label: string }[] = [
  { key: 'ADMINISTRASI', label: 'Administrasi' },
  { key: 'AKADEMIK', label: 'Akademik' },
  { key: 'KEUANGAN', label: 'Keuangan' },
  { key: 'LEGALITAS', label: 'Legalitas' },
  { key: 'KEPEGAWAIAN', label: 'Kepegawaian' },
  { key: 'PPDB', label: 'PPDB' },
  { key: 'KEGIATAN', label: 'Kegiatan' },
  { key: 'LAINNYA', label: 'Lainnya' }
];

interface FeedbackState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const R14SmartArchive: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [archives, setArchives] = useState<DigitalArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedArchiveForHistory, setSelectedArchiveForHistory] = useState<DigitalArchive | null>(null);
  const [archiveVersions, setArchiveVersions] = useState<ArchiveVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedArchiveForEdit, setSelectedArchiveForEdit] = useState<DigitalArchive | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Confirmation Modals (Replacing native confirm/prompt)
  const [confirmDeleteArchive, setConfirmDeleteArchive] = useState<DigitalArchive | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmRestoreVersion, setConfirmRestoreVersion] = useState<{ versionNumber: number; archive: DigitalArchive } | null>(null);
  const [restoring, setRestoring] = useState(false);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragOverUpload, setIsDragOverUpload] = useState(false);
  const [uploadData, setUploadData] = useState<{
    title: string;
    category: ArchiveCategory;
    folder: string;
    module: string;
    description: string;
    tags: string;
  }>({
    title: '',
    category: 'ADMINISTRASI',
    folder: 'Administrasi Sekolah',
    module: 'R14 - Smart Archive',
    description: '',
    tags: 'arsip, resmi, tk'
  });
  const [uploading, setUploading] = useState(false);

  // Edit/New Version Form State
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editChangeNote, setEditChangeNote] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates to null
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  const userName = userProfile?.nama || userProfile?.name || currentUser?.displayName || currentUser?.email || 'User';

  const canUpload = Boolean(verifiedActiveRole && DataService.canUploadArchive(verifiedActiveRole));
  const canRestore = Boolean(verifiedActiveRole && DataService.canRestoreArchiveVersion(verifiedActiveRole));
  const canDeletePermanently = Boolean(verifiedActiveRole && DataService.canDeleteArchivePermanently(verifiedActiveRole));

  useEffect(() => {
    if (!currentUser?.uid || !verifiedActiveRole) {
      setArchives([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = DataService.subscribeArchives(verifiedActiveRole, currentUser.uid, (list) => {
      setArchives(list);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser?.uid, verifiedActiveRole]);

  // Auto-dismiss feedback message after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi otentikasi tidak valid atau wewenang peran belum terverifikasi. Aksi dibatalkan.'
      });
      return;
    }

    if (!canUpload) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Wewenang peran Anda tidak diizinkan untuk mengunggah dokumen arsip.'
      });
      return;
    }

    if (!uploadFile) {
      setFeedback({ type: 'error', message: 'Silakan pilih berkas atau dokumen yang akan diunggah.' });
      return;
    }

    setUploading(true);
    try {
      const tagList = uploadData.tags.split(',').map(t => t.trim()).filter(Boolean);
      await DataService.uploadArchive(uploadFile, {
        category: uploadData.category,
        folder: uploadData.folder,
        module: uploadData.module,
        title: uploadData.title || uploadFile.name,
        description: uploadData.description,
        ownerId: currentUser.uid,
        ownerRole: verifiedActiveRole,
        tags: tagList,
        createdBy: userName
      });

      setShowUploadModal(false);
      setUploadFile(null);
      setUploadData({
        title: '',
        category: 'ADMINISTRASI',
        folder: 'Administrasi Sekolah',
        module: 'R14 - Smart Archive',
        description: '',
        tags: 'arsip, resmi, tk'
      });
      setFeedback({ type: 'success', message: 'Dokumen berhasil diunggah ke Smart Archive Digital.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Gagal mengunggah dokumen: ${err.message || err}` });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (archive: DigitalArchive) => {
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi otentikasi tidak valid atau wewenang peran belum terverifikasi. Aksi dibatalkan.'
      });
      return;
    }

    try {
      const url = await DataService.downloadArchive(
        archive.id,
        currentUser.uid,
        userName,
        verifiedActiveRole
      );
      if (url) {
        window.open(url, '_blank');
        setFeedback({ type: 'info', message: `Membuka dokumen '${archive.title}'...` });
      } else {
        setFeedback({ type: 'error', message: 'Tautan dokumen tidak ditemukan atau berkas belum diunggah.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal mengunduh berkas.' });
    }
  };

  const handleOpenVersions = async (archive: DigitalArchive) => {
    setSelectedArchiveForHistory(archive);
    setShowVersionModal(true);
    if (!currentUser?.uid || !verifiedActiveRole) {
      setArchiveVersions([]);
      return;
    }

    setLoadingVersions(true);
    try {
      const versions = await DataService.getArchiveVersions(archive.id, currentUser.uid, verifiedActiveRole);
      setArchiveVersions(versions);
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Gagal memuat histori versi: ${err.message}` });
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleConfirmRestoreVersion = async () => {
    if (!confirmRestoreVersion) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi otentikasi tidak valid atau wewenang peran belum terverifikasi. Aksi dibatalkan.'
      });
      return;
    }

    if (!canRestore) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Wewenang peran Anda tidak diizinkan untuk memulihkan versi arsip.'
      });
      return;
    }

    const { versionNumber, archive } = confirmRestoreVersion;

    setRestoring(true);
    try {
      await DataService.restoreArchive(
        archive.id,
        versionNumber,
        currentUser.uid,
        userName,
        verifiedActiveRole
      );
      setFeedback({ type: 'success', message: `Dokumen '${archive.title}' berhasil dipulihkan ke versi v${versionNumber}.` });
      setConfirmRestoreVersion(null);
      setShowVersionModal(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Gagal memulihkan versi: ${err.message}` });
    } finally {
      setRestoring(false);
    }
  };

  const handleOpenEdit = (archive: DigitalArchive) => {
    if (!currentUser?.uid || !verifiedActiveRole || !DataService.canEditArchiveMetadata(archive, verifiedActiveRole, currentUser.uid)) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Anda tidak memiliki wewenang untuk mengedit arsip ini.'
      });
      return;
    }
    setSelectedArchiveForEdit(archive);
    setEditTitle(archive.title);
    setEditDescription(archive.description);
    setEditChangeNote('');
    setEditFile(null);
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArchiveForEdit) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi otentikasi tidak valid atau wewenang peran belum terverifikasi. Aksi dibatalkan.'
      });
      return;
    }

    if (!DataService.canEditArchiveMetadata(selectedArchiveForEdit, verifiedActiveRole, currentUser.uid)) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Wewenang peran Anda tidak diizinkan untuk mengubah arsip ini.'
      });
      return;
    }

    setUpdating(true);
    try {
      await DataService.updateArchiveMetadata(
        selectedArchiveForEdit.id,
        {
          title: editTitle,
          description: editDescription
        },
        editFile || undefined,
        editChangeNote || (editFile ? 'Pembaruan Berkas Baru' : 'Pembaruan Metadata'),
        currentUser.uid,
        userName,
        verifiedActiveRole
      );

      setShowEditModal(false);
      setSelectedArchiveForEdit(null);
      setFeedback({ type: 'success', message: 'Metadata dan versi arsip berhasil diperbarui!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Gagal memperbarui arsip: ${err.message}` });
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteArchive) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi otentikasi tidak valid atau wewenang peran belum terverifikasi. Aksi dibatalkan.'
      });
      return;
    }

    if (!canDeletePermanently) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Wewenang peran Anda tidak diizinkan untuk menghapus arsip secara permanen.'
      });
      return;
    }

    setDeleting(true);
    try {
      await DataService.deleteArchive(
        confirmDeleteArchive.id,
        currentUser.uid,
        userName,
        verifiedActiveRole
      );
      setFeedback({ type: 'success', message: `Arsip '${confirmDeleteArchive.title}' berhasil dihapus.` });
      setConfirmDeleteArchive(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Gagal menghapus arsip: ${err.message}` });
    } finally {
      setDeleting(false);
    }
  };

  const filteredArchives = archives.filter(a => {
    if (selectedFolder !== 'ALL' && a.folder !== selectedFolder) return false;
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;

    if (!searchQuery.trim()) return true;

    const term = searchQuery.toLowerCase();
    const tMatch = (a.title || '').toLowerCase().includes(term);
    const fMatch = (a.fileName || '').toLowerCase().includes(term);
    const dMatch = (a.description || '').toLowerCase().includes(term);
    const tagMatch = (a.tags || []).some(t => t.toLowerCase().includes(term));
    const creatorMatch = (a.createdBy || '').toLowerCase().includes(term);

    return tMatch || fMatch || dMatch || tagMatch || creatorMatch;
  });

  const getFileIcon = (fileType: string) => {
    const type = (fileType || '').toLowerCase();
    if (type.includes('pdf') || type.includes('html')) return <FileText className="w-5 h-5 text-rose-600" />;
    if (type.includes('sheet') || type.includes('excel') || type.includes('csv'))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg'))
      return <FileImage className="w-5 h-5 text-sky-600" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchive className="w-5 h-5 text-amber-600" />;
    return <FileCode className="w-5 h-5 text-slate-600" />;
  };

  if (!currentUser?.uid || !verifiedActiveRole) {
    return (
      <div id="r14-unauthorized-guard" className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          TADE RBAC v25.2A POLICY
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Sesi Tidak Terotentikasi / Peran Tidak Valid
        </h2>
        <p className="text-stone-600 text-xs leading-relaxed max-w-lg mx-auto">
          Akses ke Smart Archive diblokir secara fail-closed karena identitas sesi tidak valid atau wewenang peran belum terverifikasi secara sah. Silakan masuk kembali dengan akun resmi.
        </p>
      </div>
    );
  }

  if (verifiedActiveRole === 'WALI_MURID' || verifiedActiveRole === 'CALON_WALI_MURID') {
    return (
      <div id="r14-access-restricted" className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          TADE RBAC v25.2A POLICY
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Akses Smart Archive Dibatasi
        </h2>
        <p className="text-stone-600 text-xs leading-relaxed max-w-lg mx-auto">
          Peran <strong>{verifiedActiveRole}</strong> tidak memiliki hak akses ke Pusat Pengarsipan Digital Smart Archive Sekolah.
          Dokumen resmi yang secara khusus ditujukan untuk siswa/wali murid dapat diakses melalui Portal Resmi Wali Murid.
        </p>
      </div>
    );
  }

  const allowedCategories = DataService.getAllowedCategoriesForRole(verifiedActiveRole);
  const visibleCategories = CATEGORIES.filter(c => allowedCategories.includes(c.key));

  return (
    <div id="r14-smart-archive-root" className="space-y-6">
      {/* Inline Feedback Banner */}
      {feedback && (
        <div
          id="r14-feedback-banner"
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-sky-50 text-sky-900 border-sky-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {feedback.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            {feedback.type === 'info' && <Info className="w-4 h-4 text-sky-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button
            id="btn-dismiss-feedback"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div id="r14-header-banner" className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Smart Archive Digital Hub
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            Pusat Pengarsipan Digital Terpusat
          </h1>
          <p className="text-stone-500 text-xs">
            Single Source of Truth repositori digital terintegrasi otomatis dengan R16 Smart Document Factory, Master Data, Versi Dokumen, dan Audit Trail.
          </p>
        </div>

        {canUpload && (
          <button
            id="btn-open-upload-modal"
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition cursor-pointer shrink-0"
          >
            <Upload className="w-4 h-4" /> Unggah Dokumen Baru
          </button>
        )}
      </div>

      {/* Main Folder & Archive Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Digital Folder Panel */}
        <div id="r14-folders-panel" className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <Folder className="w-4 h-4 text-emerald-700" /> Folder Digital
            </h2>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full">
              {DEFAULT_FOLDERS.length} Folder
            </span>
          </div>

          <div className="space-y-1">
            <button
              id="folder-btn-all"
              onClick={() => setSelectedFolder('ALL')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                selectedFolder === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>Semua Dokumen</span>
              <span className="text-[10px] opacity-80">{archives.length}</span>
            </button>

            {DEFAULT_FOLDERS.map((f, i) => {
              const count = archives.filter(a => a.folder === f).length;
              return (
                <button
                  key={i}
                  id={`folder-btn-${i}`}
                  onClick={() => setSelectedFolder(f)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                    selectedFolder === f
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate">{f}</span>
                  <span className={`text-[10px] font-mono ${selectedFolder === f ? 'text-emerald-100' : 'text-stone-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Document Archive Table Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search & Filter Controls */}
          <div id="r14-filter-controls" className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  id="input-archive-search"
                  type="text"
                  placeholder="Cari berdasarkan nama dokumen, tag, deskripsi, atau pembuat..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <select
                id="select-archive-category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 border border-stone-300 rounded-2xl text-xs font-bold bg-stone-50 cursor-pointer"
              >
                <option value="ALL">Semua Kategori ({visibleCategories.length})</option>
                {visibleCategories.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 font-medium pt-1">
              <span>Menampilkan <strong>{filteredArchives.length}</strong> dari <strong>{archives.length}</strong> berkas arsip.</span>
              {selectedFolder !== 'ALL' && (
                <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                  Folder: {selectedFolder}
                </span>
              )}
            </div>
          </div>

          {/* Document Archive List */}
          <div id="r14-archives-table" className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-stone-500 text-xs font-medium space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>Memuat repositori dokumen dari Smart Archive Digital...</p>
              </div>
            ) : filteredArchives.length === 0 ? (
              <div id="r14-empty-state" className="p-12 text-center text-stone-400 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-stone-300" />
                <h3 className="text-sm font-bold text-slate-800">Tidak Ada Dokumen Arsip</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {searchQuery || selectedFolder !== 'ALL' || selectedCategory !== 'ALL'
                    ? 'Tidak ditemukan arsip dokumen yang sesuai dengan kriteria pencarian atau filter yang dipilih.'
                    : 'Belum ada dokumen yang diarsipkan. Dokumen yang disetujui di R16 Smart Document Factory atau diunggah manual akan tampil di sini.'}
                </p>
                {canUpload && !searchQuery && selectedFolder === 'ALL' && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition cursor-pointer"
                  >
                    Unggah Dokumen Pertama
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {filteredArchives.map((a) => {
                  const canEditThis = DataService.canEditArchiveMetadata(a, verifiedActiveRole, currentUser.uid);
                  const isR16AutoArchive = (a.module || '').includes('R16') || (a.tags || []).includes('document_factory');

                  return (
                    <div key={a.id} id={`archive-card-${a.id}`} className="p-4 hover:bg-stone-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0 mt-0.5">
                          {getFileIcon(a.fileType)}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-xs truncate max-w-md">{a.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                              {a.category}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              v{a.version}
                            </span>
                            {isR16AutoArchive && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> R16 Document Factory
                              </span>
                            )}
                          </div>

                          <p className="text-stone-500 text-xs truncate">{a.description || a.fileName}</p>

                          <div className="flex items-center gap-3 text-[11px] text-stone-400 flex-wrap">
                            <span>Folder: <strong className="text-stone-600">{a.folder}</strong></span>
                            <span>• Pembuat: <strong className="text-stone-600">{a.createdBy}</strong></span>
                            <span>• {new Date(a.updatedAt).toLocaleDateString('id-ID')}</span>
                            <span>• {(a.fileSize / 1024).toFixed(1)} KB</span>
                          </div>

                          {a.tags && a.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {a.tags.map((t, idx) => (
                                <span key={idx} className="text-[9px] font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          id={`btn-download-${a.id}`}
                          onClick={() => handleDownload(a)}
                          title="Lihat / Unduh Dokumen"
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Unduh
                        </button>

                        <button
                          id={`btn-version-${a.id}`}
                          onClick={() => handleOpenVersions(a)}
                          title="Histori Versi"
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5" /> Versi
                        </button>

                        {canEditThis && (
                          <button
                            id={`btn-edit-${a.id}`}
                            onClick={() => handleOpenEdit(a)}
                            title="Edit Metadata / Versi Baru"
                            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {canDeletePermanently && (
                          <button
                            id={`btn-delete-${a.id}`}
                            onClick={() => setConfirmDeleteArchive(a)}
                            title="Hapus Dokumen"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Document Modal with Drag-and-Drop */}
      {showUploadModal && (
        <div id="modal-upload-archive" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-800" /> Unggah Dokumen Digital Baru
              </h2>
              <button
                type="button"
                id="btn-close-upload-modal"
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Drag and Drop File Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pilih Berkas / File</label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOverUpload(true);
                  }}
                  onDragLeave={() => setIsDragOverUpload(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOverUpload(false);
                    if (e.dataTransfer.files?.[0]) {
                      setUploadFile(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                    isDragOverUpload
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : uploadFile
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-stone-300 bg-stone-50 hover:bg-stone-100'
                  }`}
                  onClick={() => document.getElementById('archive-file-picker')?.click()}
                >
                  <input
                    id="archive-file-picker"
                    type="file"
                    className="hidden"
                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  />
                  {uploadFile ? (
                    <div className="space-y-1">
                      <FileText className="w-8 h-8 mx-auto text-emerald-700" />
                      <p className="text-xs font-bold text-slate-900">{uploadFile.name}</p>
                      <p className="text-[10px] text-stone-500 font-mono">{(uploadFile.size / 1024).toFixed(1)} KB • Klik untuk ganti berkas</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-8 h-8 mx-auto text-stone-400" />
                      <p className="text-xs font-bold text-stone-700">Tarik & Letakkan berkas ke sini, atau klik untuk memilih</p>
                      <p className="text-[10px] text-stone-400">PDF, Excel, Word, Gambar, atau Arsip ZIP (Maks 15 MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Judul Dokumen</label>
                <input
                  id="input-upload-title"
                  type="text"
                  placeholder="Contoh: SK Pengangkatan Guru 2026"
                  value={uploadData.title}
                  onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kategori</label>
                  <select
                    id="select-upload-category"
                    value={uploadData.category}
                    onChange={e => setUploadData({ ...uploadData, category: e.target.value as ArchiveCategory })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs bg-stone-50 cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Folder Digital</label>
                  <select
                    id="select-upload-folder"
                    value={uploadData.folder}
                    onChange={e => setUploadData({ ...uploadData, folder: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs bg-stone-50 cursor-pointer"
                  >
                    {DEFAULT_FOLDERS.map((f, i) => (
                      <option key={i} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi Dokumen</label>
                <textarea
                  id="input-upload-description"
                  rows={3}
                  placeholder="Tambahkan uraian singkat isi berkas..."
                  value={uploadData.description}
                  onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tag (Dipisahkan koma)</label>
                <input
                  id="input-upload-tags"
                  type="text"
                  placeholder="sk, guru, 2026, resmi"
                  value={uploadData.tags}
                  onChange={e => setUploadData({ ...uploadData, tags: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-upload"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-stone-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-300 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                id="btn-submit-upload"
                disabled={uploading}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition disabled:opacity-50"
              >
                {uploading ? 'Mengunggah...' : 'Simpan ke Smart Archive'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionModal && selectedArchiveForHistory && (
        <div id="modal-version-history" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-800" /> Histori Versi Dokumen
                </h2>
                <p className="text-stone-500 text-xs font-medium truncate max-w-sm">{selectedArchiveForHistory.title}</p>
              </div>
              <button
                type="button"
                id="btn-close-version-modal"
                onClick={() => setShowVersionModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {loadingVersions ? (
                <div className="p-8 text-center text-stone-400 text-xs">Memuat catatan versi...</div>
              ) : archiveVersions.length === 0 ? (
                <div className="p-6 text-center text-stone-400 text-xs">Belum ada catatan histori versi terdahulu. Versi aktif saat ini adalah v{selectedArchiveForHistory.version}.</div>
              ) : (
                archiveVersions.map((v) => (
                  <div key={v.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Versi v{v.version}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {new Date(v.changedAt).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 font-medium">{v.changeNote}</p>
                    <div className="text-[11px] text-stone-400">Oleh: {v.changedByName || v.changedBy}</div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <a
                        href={v.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Unduh File v{v.version}
                      </a>

                      {canRestore && v.version !== selectedArchiveForHistory.version && (
                        <button
                          onClick={() => setConfirmRestoreVersion({ versionNumber: v.version, archive: selectedArchiveForHistory })}
                          className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-slate-800 font-bold text-[10px] rounded-lg cursor-pointer transition flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Pulihkan Versi Ini
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                id="btn-close-version-history"
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / New Version Modal */}
      {showEditModal && selectedArchiveForEdit && (
        <div id="modal-edit-archive" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUpdateSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-800" /> Edit Metadata & Versi Baru Dokumen
              </h2>
              <button
                type="button"
                id="btn-close-edit-modal"
                onClick={() => setShowEditModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Judul Dokumen</label>
                <input
                  id="input-edit-title"
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi Dokumen</label>
                <textarea
                  id="input-edit-description"
                  rows={3}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                ></textarea>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  Unggah Berkas Baru (Akan menaikkan versi v{selectedArchiveForEdit.version} → v{selectedArchiveForEdit.version + 1})
                </label>
                <input
                  id="input-edit-file"
                  type="file"
                  onChange={e => setEditFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-stone-300 rounded-xl text-xs bg-white"
                />
                <input
                  id="input-edit-changenote"
                  type="text"
                  placeholder="Catatan perubahan versi baru..."
                  value={editChangeNote}
                  onChange={e => setEditChangeNote(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-xl text-xs bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-edit"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-stone-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-300 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                id="btn-submit-edit"
                disabled={updating}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition disabled:opacity-50"
              >
                {updating ? 'Menyimpan...' : 'Simpan Pembaruan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Internal Custom Confirmation Modal for Delete */}
      {confirmDeleteArchive && (
        <div id="modal-confirm-delete" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Dokumen</h3>
              <p className="text-xs text-stone-500">
                Apakah Anda yakin ingin menghapus arsip <strong>'{confirmDeleteArchive.title}'</strong>? Tindakan ini akan dicatat ke jejak audit sistem.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-delete"
                onClick={() => setConfirmDeleteArchive(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-execute-delete"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs disabled:opacity-50"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus Dokumen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal Custom Confirmation Modal for Version Restore */}
      {confirmRestoreVersion && (
        <div id="modal-confirm-restore" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Pemulihan Versi</h3>
              <p className="text-xs text-stone-500">
                Pulihkan arsip <strong>'{confirmRestoreVersion.archive.title}'</strong> ke <strong>Versi v{confirmRestoreVersion.versionNumber}</strong>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-restore"
                onClick={() => setConfirmRestoreVersion(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-execute-restore"
                disabled={restoring}
                onClick={handleConfirmRestoreVersion}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs disabled:opacity-50"
              >
                {restoring ? 'Memulihkan...' : 'Ya, Pulihkan Versi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
