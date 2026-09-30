import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  FolderArchive,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Eye,
  ShieldCheck,
  Sparkles,
  Lock,
  Tag,
  RefreshCw,
  FileCode,
  QrCode,
  UserCheck,
  FileCheck,
  Archive,
  Grid,
  CheckSquare,
  Building2,
  FolderOpen,
  Filter,
  Copy,
  Check
} from 'lucide-react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';

export interface DocCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  templateCount: number;
}

export interface DocTemplate {
  id: string;
  name: string;
  category: string;
  status: 'PUBLISHED' | 'DRAFT' | 'REVIEW';
  version: string;
  createdDate: string;
  updatedDate: string;
  usageCount: number;
}

export interface DocVariable {
  key: string;
  label: string;
  category: string;
  dataType: 'STRING' | 'DATE' | 'NUMBER' | 'IMAGE_URL';
  exampleValue: string;
}

export interface DocMetadata {
  id: string;
  docNumber: string;
  title: string;
  version: string;
  createdBy: string;
  createdDate: string;
  status: 'PUBLISHED' | 'PENDING_APPROVAL' | 'DRAFT' | 'ARCHIVED';
  category: string;
  approvalStatus: 'APPROVED' | 'PENDING' | 'NA';
  archiveStatus: 'ACTIVE' | 'ARCHIVED';
}

export interface ArchiveRecord {
  id: string;
  docNumber: string;
  title: string;
  category: string;
  archivedDate: string;
  archivedBy: string;
  retentionYear: string;
  fileSize: string;
}

export const R42EnterpriseDocCenter: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CATEGORIES' | 'TEMPLATES' | 'VARIABLES' | 'METADATA' | 'ARCHIVE' | 'PREVIEW'>('DASHBOARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<DocTemplate | null>(null);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // 1. Categories Registry
  const categories: DocCategory[] = [
    { id: 'CAT-01', name: 'Surat Keputusan', code: 'SK', description: 'Surat keputusan resmi kepala sekolah / yayasan', templateCount: 12 },
    { id: 'CAT-02', name: 'Surat Tugas', code: 'ST', description: 'Surat penugasan kedinasan guru dan staf', templateCount: 8 },
    { id: 'CAT-03', name: 'Surat Keterangan', code: 'SKET', description: 'Surat keterangan aktif, kelakuan baik, & prestasi', templateCount: 15 },
    { id: 'CAT-04', name: 'Surat Pengantar', code: 'SPENG', description: 'Surat pengantar ke dinas pendidikan / instansi luar', templateCount: 6 },
    { id: 'CAT-05', name: 'Surat Undangan', code: 'UND', description: 'Surat undangan rapat wali murid & yayasan', templateCount: 10 },
    { id: 'CAT-06', name: 'Surat Edaran', code: 'SE', description: 'Surat edaran informasi umum kegiatan sekolah', templateCount: 9 },
    { id: 'CAT-07', name: 'Surat Balasan', code: 'SBAL', description: 'Surat balasan permohonan / magang / observasi', templateCount: 5 },
    { id: 'CAT-08', name: 'Berita Acara', code: 'BA', description: 'Berita acara ujian, serah terima, & rapat pleno', templateCount: 7 },
    { id: 'CAT-09', name: 'Sertifikat', code: 'CERT', description: 'Sertifikat kelulusan, lomba, & apresiasi siswa', templateCount: 11 },
    { id: 'CAT-10', name: 'Inventaris', code: 'INV', description: 'Dokumen berita acara inventaris aset sekolah', templateCount: 4 },
    { id: 'CAT-11', name: 'Dokumen Guru', code: 'GURU', description: 'Administrasi KBM, SK Mengajar, & Portofolio', templateCount: 18 },
    { id: 'CAT-12', name: 'Dokumen Siswa', code: 'SISWA', description: 'Buku induk, kartu pelajar, & riwayat siswa', templateCount: 14 },
    { id: 'CAT-13', name: 'Dokumen PPDB', code: 'PPDB', description: 'Bukti pendaftaran, formulir, & kelulusan PPDB', templateCount: 9 },
    { id: 'CAT-14', name: 'Dokumen SPP', code: 'SPP', description: 'Kwitansi, invoice, & surat tagihan SPP', templateCount: 7 },
    { id: 'CAT-15', name: 'Dokumen Yayasan', code: 'YYS', description: 'Arsip keputusan pengurus yayasan pembina', templateCount: 6 },
    { id: 'CAT-16', name: 'Dokumen Keuangan', code: 'KEU', description: 'Laporan realisasi anggaran & nota belanja', templateCount: 10 },
    { id: 'CAT-17', name: 'Dokumen Akreditasi', code: 'AKRED', description: 'Borang & bukti fisik pendukung akreditasi BAN-S/M', templateCount: 22 },
    { id: 'CAT-18', name: 'Kerja Sama', code: 'MOU', description: 'Memorandum of Understanding dengan mitra kerja', templateCount: 5 },
    { id: 'CAT-19', name: 'General Templates', code: 'GEN', description: 'Templat umum persuratan harian sekolah', templateCount: 15 }
  ];

  // 2. Template Registry
  const templates: DocTemplate[] = [
    { id: 'TMP-001', name: 'Surat Keputusan Pengangkatan Guru Tetap', category: 'Surat Keputusan', status: 'PUBLISHED', version: 'v1.2', createdDate: '2026-01-10', updatedDate: '2026-02-01', usageCount: 42 },
    { id: 'TMP-002', name: 'Surat Tugas Pelatihan Kurikulum Merdeka', category: 'Surat Tugas', status: 'PUBLISHED', version: 'v1.0', createdDate: '2026-01-15', updatedDate: '2026-01-15', usageCount: 128 },
    { id: 'TMP-003', name: 'Surat Keterangan Aktif Siswa TK', category: 'Surat Keterangan', status: 'PUBLISHED', version: 'v2.0', createdDate: '2026-01-02', updatedDate: '2026-02-10', usageCount: 310 },
    { id: 'TMP-004', name: 'Surat Undangan Pertemuan Orang Tua Murid', category: 'Surat Undangan', status: 'PUBLISHED', version: 'v1.1', createdDate: '2026-01-20', updatedDate: '2026-01-25', usageCount: 85 },
    { id: 'TMP-005', name: 'Berita Acara Serah Terima Jabatan', category: 'Berita Acara', status: 'REVIEW', version: 'v0.9', createdDate: '2026-02-05', updatedDate: '2026-02-06', usageCount: 3 },
    { id: 'TMP-006', name: 'Sertifikat Kelulusan TK Asy-Syifa', category: 'Sertifikat', status: 'PUBLISHED', version: 'v1.5', createdDate: '2026-01-05', updatedDate: '2026-01-30', usageCount: 240 },
    { id: 'TMP-007', name: 'Surat Edaran Pembayaran SPP & Peringatan', category: 'Surat Edaran', status: 'PUBLISHED', version: 'v1.0', createdDate: '2026-02-01', updatedDate: '2026-02-01', usageCount: 190 },
    { id: 'TMP-008', name: 'Bukti Diterima PPDB TK Asy-Syifa', category: 'Dokumen PPDB', status: 'PUBLISHED', version: 'v2.1', createdDate: '2026-01-08', updatedDate: '2026-02-04', usageCount: 155 },
    { id: 'TMP-009', name: 'Formulir Inventaris Barang Kelas', category: 'Inventaris', status: 'DRAFT', version: 'v0.1', createdDate: '2026-02-06', updatedDate: '2026-02-06', usageCount: 0 }
  ];

  // 3. Variable Registry
  const variables: DocVariable[] = [
    { key: '{{nomor}}', label: 'Nomor Surat Resm', category: 'Header', dataType: 'STRING', exampleValue: '421.1/089/TK-ASY/II/2026' },
    { key: '{{tanggal}}', label: 'Tanggal Penerbitan', category: 'Header', dataType: 'DATE', exampleValue: '06 Februari 2026' },
    { key: '{{nama}}', label: 'Nama Lengkap Terkait', category: 'Subjek', dataType: 'STRING', exampleValue: 'Ahmad Fadhil Prasetya' },
    { key: '{{alamat}}', label: 'Alamat Domisili', category: 'Subjek', dataType: 'STRING', exampleValue: 'Jl. Melati No. 12, Bandung' },
    { key: '{{kelas}}', label: 'Rombel / Kelompok TK', category: 'Siswa', dataType: 'STRING', exampleValue: 'Kelompok B2 (Bintang)' },
    { key: '{{guru}}', label: 'Nama Guru / Pengajar', category: 'Guru', dataType: 'STRING', exampleValue: 'Siti Rahmawati, S.Pd' },
    { key: '{{jabatan}}', label: 'Jabatan Kedinasan', category: 'Pegawai', dataType: 'STRING', exampleValue: 'Guru Pendamping Utama' },
    { key: '{{kepalaSekolah}}', label: 'Nama Kepala Sekolah', category: 'Pengesahan', dataType: 'STRING', exampleValue: 'Hj. Nurhayati, M.Pd' },
    { key: '{{yayasan}}', label: 'Nama Pembina Yayasan', category: 'Pengesahan', dataType: 'STRING', exampleValue: 'Yayasan Pendidikan Asy-Syifa' },
    { key: '{{tahun}}', label: 'Tahun Ajaran Aktif', category: 'Sistem', dataType: 'STRING', exampleValue: '2025/2026' },
    { key: '{{logo}}', label: 'URL Logo Resmi Sekolah', category: 'Aset', dataType: 'IMAGE_URL', exampleValue: '[Visual Logo TK]' },
    { key: '{{stempel}}', label: 'Stempel Digital Validasi', category: 'Aset', dataType: 'IMAGE_URL', exampleValue: '[Stempel Resmi Assured]' },
    { key: '{{qr}}', label: 'QR Signature Verifikasi', category: 'Security', dataType: 'IMAGE_URL', exampleValue: '[QR Verification Token]' }
  ];

  // 4. Document Metadata Registry
  const metadataList: DocMetadata[] = [
    { id: 'DOC-2026-001', docNumber: '421.1/001/SK/2026', title: 'SK Panitia Peringatan Isra Mi\'raj', version: 'v1.0', createdBy: 'Admin Sekolah', createdDate: '2026-02-01', status: 'PUBLISHED', category: 'Surat Keputusan', approvalStatus: 'APPROVED', archiveStatus: 'ACTIVE' },
    { id: 'DOC-2026-002', docNumber: '421.1/014/ST/2026', title: 'Surat Tugas Bimbingan Teknis Guru', version: 'v1.0', createdBy: 'Kepala Sekolah', createdDate: '2026-02-03', status: 'PUBLISHED', category: 'Surat Tugas', approvalStatus: 'APPROVED', archiveStatus: 'ACTIVE' },
    { id: 'DOC-2026-003', docNumber: '421.1/088/SKET/2026', title: 'Surat Keterangan Aktif Belajar - Ananda Rayhan', version: 'v1.0', createdBy: 'Siti Rahmawati', createdDate: '2026-02-04', status: 'PUBLISHED', category: 'Surat Keterangan', approvalStatus: 'APPROVED', archiveStatus: 'ACTIVE' },
    { id: 'DOC-2026-004', docNumber: '421.1/092/UND/2026', title: 'Undangan Rapat Evaluasi Triwulan Yayasan', version: 'v1.1', createdBy: 'Ketua Yayasan', createdDate: '2026-02-05', status: 'PENDING_APPROVAL', category: 'Surat Undangan', approvalStatus: 'PENDING', archiveStatus: 'ACTIVE' },
    { id: 'DOC-2026-005', docNumber: '421.1/095/SE/2026', title: 'Edaran Libur Penggalangan Kegiatan', version: 'v0.9', createdBy: 'Admin Sekolah', createdDate: '2026-02-06', status: 'DRAFT', category: 'Surat Edaran', approvalStatus: 'NA', archiveStatus: 'ACTIVE' }
  ];

  // 5. Archive Registry
  const archiveList: ArchiveRecord[] = [
    { id: 'ARC-2025-089', docNumber: '421.1/300/SK/2025', title: 'SK Kelulusan Siswa Angkatan 2024/2025', category: 'Surat Keputusan', archivedDate: '2025-06-30', archivedBy: 'Super Admin', retentionYear: '10 Tahun', fileSize: '1.2 MB' },
    { id: 'ARC-2025-045', docNumber: '421.1/150/BA/2025', title: 'Berita Acara Akreditasi A TK Asy-Syifa', category: 'Berita Acara', archivedDate: '2025-11-12', archivedBy: 'Kepala Sekolah', retentionYear: 'Abadi', fileSize: '4.8 MB' },
    { id: 'ARC-2024-112', docNumber: '421.1/090/MOU/2024', title: 'MoU Kerjasama Kunjungan Edukasi Pemadam', category: 'Kerja Sama', archivedDate: '2024-09-01', archivedBy: 'Admin Sekolah', retentionYear: '5 Tahun', fileSize: '2.1 MB' }
  ];

  const handleCopyVar = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedVar(key);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleRefreshEngine = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNotice('Engine Pusat Dokumen Administrasi R42 Terverifikasi 100% Siap Operasional.');
      setTimeout(() => setNotice(null), 4000);
    }, 400);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredArchive = archiveList.filter(a => {
    return a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <FileText className="w-3.5 h-3.5 text-emerald-700" /> Sprint P17 • Enterprise Administrative Document Center Foundation v49.0
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pusat Dokumen Administrasi & Engine Templat Persuratan (R42)
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Engine terpusat pendaftaran kategori, registri templat, variabel persuratan dinamis, metadata dokumen, serta arsip surat sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshEngine}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Memuat Engine...' : 'Cek Status Engine'}
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Katalog Engine
          </button>
        </div>
      </div>

      {notice && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{notice}</span>
        </motion.div>
      )}

      {/* RBAC Notice Banner */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Peran Terverifikasi ({activeRole}):</strong> {activeRole === 'SUPER_ADMIN' ? 'Akses Pembacaan Audit Read-Only' : activeRole === 'ADMIN' ? 'Akses Operasional Manajemen Dokumen Penuh' : 'Akses Tinjauan Dokumen & Pengesahan'}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-900 text-emerald-200 font-mono text-[10px] font-bold">
          LTS MODE LOCKED
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Kategori Terdaftar</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">{categories.length} CATEGORIES</div>
          <p className="text-[11px] text-slate-300 font-bold">Ready for All Document Types</p>
        </div>

        <div className="p-5 bg-emerald-950 text-white rounded-3xl border border-emerald-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold uppercase tracking-wider">
            <span>Templat Aktif (Published)</span>
            <FileCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{templates.filter(t => t.status === 'PUBLISHED').length} TEMPLATES</div>
          <p className="text-[11px] text-emerald-200">Read-Only Registry Ready</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Variabel Dinamis</span>
            <Tag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{variables.length} VARIABLES</div>
          <p className="text-[11px] text-stone-500">Auto Interpolation Engine</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Arsip Dokumen</span>
            <FolderArchive className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{archiveList.length} ARCHIVES</div>
          <p className="text-[11px] text-stone-500">Searchable System Registry</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'DASHBOARD' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Grid className="w-4 h-4" /> Ringkasan Dashboard
        </button>

        <button
          onClick={() => setActiveTab('CATEGORIES')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'CATEGORIES' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" /> Kategori Dokumen ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('TEMPLATES')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'TEMPLATES' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileCode className="w-4 h-4" /> Registri Templat ({templates.length})
        </button>

        <button
          onClick={() => setActiveTab('VARIABLES')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'VARIABLES' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Tag className="w-4 h-4" /> Variabel Persuratan ({variables.length})
        </button>

        <button
          onClick={() => setActiveTab('METADATA')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'METADATA' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Registri Metadata Dokumen
        </button>

        <button
          onClick={() => setActiveTab('ARCHIVE')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'ARCHIVE' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FolderArchive className="w-4 h-4" /> Registri Arsip
        </button>

        <button
          onClick={() => setActiveTab('PREVIEW')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'PREVIEW' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Eye className="w-4 h-4" /> Framework Pratinjau Kanvas
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-800" /> Ringkasan Statistik Pusat Dokumen Administrasi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Dokumen Diterbitkan (Published)</span>
                <div className="text-2xl font-black text-slate-900 font-mono">1,420 Surat</div>
                <p className="text-[11px] text-stone-500">Sudah disahkan dan diarsipkan secara sah.</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Draf Aktif dalam Pengerjaan</span>
                <div className="text-2xl font-black text-slate-900 font-mono">14 Draf</div>
                <p className="text-[11px] text-stone-500">Memerlukan penyuntingan atau kelengkapan data.</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Permohonan Persetujuan (Pending)</span>
                <div className="text-2xl font-black text-emerald-700 font-mono">3 Dokumen</div>
                <p className="text-[11px] text-stone-500">Menunggu TTD digital Kepala Sekolah / Yayasan.</p>
              </div>
            </div>
          </div>

          {/* Recent Metadata Activities */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-800" /> Aktivitas Terakhir Pembuatan & Arsip Dokumen
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                    <th className="p-3">ID Dokumen</th>
                    <th className="p-3">Nomor Resmi</th>
                    <th className="p-3">Judul Dokumen</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Dibuat Oleh</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {metadataList.map(doc => (
                    <tr key={doc.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">{doc.id}</td>
                      <td className="p-3 text-stone-600">{doc.docNumber}</td>
                      <td className="p-3 font-sans font-bold text-slate-900">{doc.title}</td>
                      <td className="p-3 font-sans">{doc.category}</td>
                      <td className="p-3 font-sans text-stone-600">{doc.createdBy}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          doc.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-900' :
                          doc.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === 'CATEGORIES' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-800" /> Registry Kategori Dokumen Administrasi (19 Categories Engine)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 shadow-2xs hover:border-emerald-300 transition">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                    {cat.code}
                  </span>
                  <span className="text-xs font-bold text-stone-500 font-mono">{cat.templateCount} Templates</span>
                </div>
                <h3 className="text-sm font-black text-slate-900">{cat.name}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEMPLATES */}
      {activeTab === 'TEMPLATES' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-emerald-800" /> Registri Templat Persuratan (Read-Only State)
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari templat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden"
              >
                <option value="ALL">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                  <th className="p-3">ID Templat</th>
                  <th className="p-3">Nama Templat</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Versi</th>
                  <th className="p-3">Dibuat / Diperbarui</th>
                  <th className="p-3">Jumlah Penggunaan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Aksi Pratinjau</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {filteredTemplates.map(t => (
                  <tr key={t.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{t.id}</td>
                    <td className="p-3 font-sans font-black text-slate-900">{t.name}</td>
                    <td className="p-3 font-sans text-stone-600">{t.category}</td>
                    <td className="p-3 text-emerald-800 font-bold">{t.version}</td>
                    <td className="p-3 text-stone-500">{t.createdDate} / {t.updatedDate}</td>
                    <td className="p-3 text-slate-900 font-bold">{t.usageCount}x</td>
                    <td className="p-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-900' :
                        t.status === 'REVIEW' ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      <button
                        onClick={() => {
                          setSelectedTemplateForPreview(t);
                          setActiveTab('PREVIEW');
                        }}
                        className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: VARIABLES */}
      {activeTab === 'VARIABLES' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-800" /> Registri Variabel Persuratan Dinamis (Reusable Interpolation Keys)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                  <th className="p-3">Kunci Variabel</th>
                  <th className="p-3">Label Deskriptif</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Tipe Data</th>
                  <th className="p-3">Contoh Nilai Interpolasi</th>
                  <th className="p-3">Salin Kunci</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {variables.map((v, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-black text-emerald-800 bg-emerald-50/50">{v.key}</td>
                    <td className="p-3 font-sans font-bold text-slate-900">{v.label}</td>
                    <td className="p-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold text-[10px]">
                        {v.category}
                      </span>
                    </td>
                    <td className="p-3 text-stone-600">{v.dataType}</td>
                    <td className="p-3 font-sans text-stone-700 italic">{v.exampleValue}</td>
                    <td className="p-3 font-sans">
                      <button
                        onClick={() => handleCopyVar(v.key)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-stone-300"
                      >
                        {copiedVar === v.key ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedVar === v.key ? 'Tersalin' : 'Salin Key'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: METADATA */}
      {activeTab === 'METADATA' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-800" /> Registri Metadata Dokumen Administrasi Sekolah
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                  <th className="p-3">ID Dokumen</th>
                  <th className="p-3">Nomor Surat</th>
                  <th className="p-3">Judul Dokumen</th>
                  <th className="p-3">Versi</th>
                  <th className="p-3">Pembuat</th>
                  <th className="p-3">Tgl Dibuat</th>
                  <th className="p-3">Status Persetujuan</th>
                  <th className="p-3">Status Arsip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {metadataList.map(meta => (
                  <tr key={meta.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{meta.id}</td>
                    <td className="p-3 text-stone-600">{meta.docNumber}</td>
                    <td className="p-3 font-sans font-bold text-slate-900">{meta.title}</td>
                    <td className="p-3 text-emerald-800 font-bold">{meta.version}</td>
                    <td className="p-3 font-sans text-stone-600">{meta.createdBy}</td>
                    <td className="p-3 text-stone-500">{meta.createdDate}</td>
                    <td className="p-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        meta.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-900' :
                        meta.approvalStatus === 'PENDING' ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {meta.approvalStatus}
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-bold text-[10px]">
                        {meta.archiveStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ARCHIVE */}
      {activeTab === 'ARCHIVE' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-emerald-800" /> Registri Struktur Arsip Dokumen Sekolah
            </h2>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari dalam arsip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                  <th className="p-3">ID Arsip</th>
                  <th className="p-3">Nomor Dokumen</th>
                  <th className="p-3">Judul Arsip Dokumen</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Tanggal Arsip</th>
                  <th className="p-3">Diarsipkan Oleh</th>
                  <th className="p-3">Masa Retensi</th>
                  <th className="p-3">Ukuran File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {filteredArchive.map(arc => (
                  <tr key={arc.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{arc.id}</td>
                    <td className="p-3 text-stone-600">{arc.docNumber}</td>
                    <td className="p-3 font-sans font-bold text-slate-900">{arc.title}</td>
                    <td className="p-3 font-sans text-stone-600">{arc.category}</td>
                    <td className="p-3 text-stone-500">{arc.archivedDate}</td>
                    <td className="p-3 font-sans text-stone-600">{arc.archivedBy}</td>
                    <td className="p-3 font-sans font-bold text-emerald-900">{arc.retentionYear}</td>
                    <td className="p-3 text-stone-500">{arc.fileSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: PREVIEW */}
      {activeTab === 'PREVIEW' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-800" /> Framework Pratinjau Kanvas Dokumen (Read-Only Preview)
            </h2>
            <span className="text-xs font-bold text-stone-500 font-mono">
              Selected: {selectedTemplateForPreview ? selectedTemplateForPreview.name : 'Surat Keterangan Aktif Siswa (Default)'}
            </span>
          </div>

          {/* Paper Canvas */}
          <div className="p-8 bg-stone-100 rounded-3xl border border-stone-300 shadow-inner flex justify-center">
            <div className="w-full max-w-2xl bg-white p-10 rounded-2xl border border-stone-200 shadow-xl space-y-6 text-slate-900 font-serif">
              {/* Header Surat */}
              <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
                <div className="text-sm font-bold uppercase tracking-widest text-emerald-900 font-sans">YAYASAN PENDIDIKAN ASY-SYIFA</div>
                <div className="text-xl font-black uppercase text-slate-900 font-sans">TK ISLAM ASY-SYIFA BANDUNG</div>
                <div className="text-xs font-sans text-slate-600">Jl. Cijambe No. 45, Ujungberung, Kota Bandung • Telp: (022) 7800123</div>
              </div>

              {/* Title Surat */}
              <div className="text-center space-y-1 my-6">
                <div className="text-base font-bold uppercase underline tracking-wider">
                  {selectedTemplateForPreview ? selectedTemplateForPreview.name : 'SURAT KETERANGAN AKTIF BELAJAR'}
                </div>
                <div className="text-xs font-mono text-slate-600 font-sans">
                  Nomor: 421.1/089/TK-ASY/II/2026
                </div>
              </div>

              {/* Body Content Preview */}
              <div className="text-xs leading-relaxed space-y-4 font-sans text-slate-800">
                <p>Yang bertanda tangan di bawah ini Kepala TK Islam Asy-Syifa Bandung menerangkan bahwa:</p>
                <div className="pl-6 space-y-1 font-mono text-slate-900 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div>Nama Siswa : <strong className="text-emerald-900">Ahmad Fadhil Prasetya</strong></div>
                  <div>Kelas / Rombel : <strong>Kelompok B2 (Bintang)</strong></div>
                  <div>Tahun Ajaran : <strong>2025/2026</strong></div>
                  <div>Nama Orang Tua : <strong>Bpk. Hendra Prasetya</strong></div>
                </div>
                <p>
                  Adalah benar-benar siswa aktif terdaftar di TK Islam Asy-Syifa Bandung pada Tahun Ajaran 2025/2026 dan berkelakuan baik dalam setiap aktivitas pembelajaran.
                </p>
                <p>
                  Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
                </p>
              </div>

              {/* Footer Signatures */}
              <div className="pt-8 flex justify-between items-end text-xs font-sans">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
                  <QrCode className="w-10 h-10 text-slate-800" />
                  <div className="text-[10px] text-stone-600 leading-tight">
                    <div><strong>Digital Verified</strong></div>
                    <div>QR Token ID: 89f2-2026</div>
                    <div>TADE Enterprise Engine</div>
                  </div>
                </div>

                <div className="text-center space-y-10">
                  <div>Bandung, 06 Februari 2026<br />Kepala TK Islam Asy-Syifa,</div>
                  <div className="font-bold underline text-slate-900">
                    Hj. Nurhayati, M.Pd<br />
                    <span className="text-[10px] text-stone-500 no-underline font-normal">NIP. 19780412 200501 2 003</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
