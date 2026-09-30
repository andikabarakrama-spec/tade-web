import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  FileText,
  Filter,
  Eye,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Tag,
  UserCheck,
  Sparkles,
  RefreshCw,
  Printer,
  Building2,
  Users,
  Award,
  Briefcase,
  Calendar,
  DollarSign,
  Layers,
  Lock,
  X,
  Info,
  ChevronRight,
  FileCheck,
  FolderTree,
  SlidersHorizontal,
  GraduationCap,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface DocTemplateItem {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  allowedRoles: string[];
  allowedRolesLabels: string[];
  status: 'Aktif' | 'Draf' | 'Siap Pakai';
  version: string;
  paperSize: string;
  orientation: string;
  approvalChain: string;
  numberingFormat: string;
  requiredFields: string[];
}

export const R44EnterpriseTemplateLibrary: React.FC = () => {
  const { activeRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('SEMUA');
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplateItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // 19 Mandatory Template Categories
  const categories = [
    'SEMUA',
    'Surat Tugas',
    'Surat Keputusan (SK)',
    'Surat Keterangan',
    'Surat Undangan',
    'Surat Edaran',
    'Surat Pengantar',
    'Berita Acara',
    'Sertifikat',
    'Surat Izin',
    'Surat Mutasi',
    'Surat Rekomendasi',
    'Surat Pernyataan',
    'Surat Peminjaman',
    'Surat Pengembalian Inventaris',
    'Dokumen PPDB',
    'Dokumen Keuangan',
    'Dokumen Yayasan',
    'Dokumen Guru',
    'Dokumen Siswa'
  ];

  // Template Master List (Covering all 19 mandatory categories)
  const templateLibrary: DocTemplateItem[] = [
    {
      id: 'TPL-001',
      code: 'ST-01',
      name: 'Surat Tugas Pelatihan & Bintek Guru',
      category: 'Surat Tugas',
      description: 'Penugasan resmi untuk guru atau staf mengikuti kegiatan workshop, seminar, atau bimbingan teknis kedinasan.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
      allowedRolesLabels: ['Admin Sekolah', 'Kepala Sekolah', 'Guru & Staf'],
      status: 'Siap Pakai',
      version: 'v1.2',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Penyusunan Admin ➔ Pengesahan Kepala Sekolah',
      numberingFormat: '421.2/{SEQ}/ST-ASY/2026',
      requiredFields: ['Nama Pelaksana', 'NIP/NPT', 'Nama Kegiatan', 'Tempat & Waktu Kegiatan', 'Penyelenggara']
    },
    {
      id: 'TPL-002',
      code: 'SK-01',
      name: 'Surat Keputusan Pengangkatan Guru & Staf',
      category: 'Surat Keputusan (SK)',
      description: 'SK penetapan status kepegawaian, pengangkatan guru tetap/tidak tetap, dan pembagian tugas mengajar.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Ketua Yayasan'],
      status: 'Aktif',
      version: 'v2.0',
      paperSize: 'F4 (Folio)',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Admin ➔ Kepala Sekolah ➔ Pengesahan Ketua Yayasan',
      numberingFormat: '421.1/{SEQ}/SK/II/2026',
      requiredFields: ['Nama Lengkap Guru', 'NPT/NIP', 'Jabatan Baru', 'TMT Terhitung Mulai Tanggal', 'Beban Jam Mengajar']
    },
    {
      id: 'TPL-003',
      code: 'SKET-01',
      name: 'Surat Keterangan Siswa Aktif Belajar',
      category: 'Surat Keterangan',
      description: 'Surat keterangan resmi bahwa anak terdaftar aktif sebagai peserta didik di TK Asy-Syifa.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Guru', 'Wali Murid'],
      status: 'Siap Pakai',
      version: 'v1.5',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Penyusunan Admin ➔ Pengesahan Kepala Sekolah',
      numberingFormat: '421.3/{SEQ}/SKET-SISWA/02/2026',
      requiredFields: ['Nama Anak', 'NISN / NIS', 'Kelompok Belajar', 'Nama Orang Tua', 'Keperluan Surat']
    },
    {
      id: 'TPL-004',
      code: 'UND-01',
      name: 'Surat Undangan Rapat Orang Tua / Wali Murid',
      category: 'Surat Undangan',
      description: 'Undangan resmi pertemuan wali murid untuk sosialisasi program semester, konsultasi, atau rapat komite.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Guru', 'Wali Murid'],
      status: 'Siap Pakai',
      version: 'v1.0',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Penyusunan Admin ➔ Tinjauan Kepala Sekolah',
      numberingFormat: '421.4/{SEQ}/UND-ASY/II/2026',
      requiredFields: ['Hari & Tanggal Rapat', 'Waktu & Tempat', 'Agenda Rapat', 'Penerima Undangan']
    },
    {
      id: 'TPL-005',
      code: 'EDR-01',
      name: 'Surat Edaran Libur & Kegiatan Sekolah',
      category: 'Surat Edaran',
      description: 'Informasi resmi sekolah mengenai kalender akademik, jadwal libur nasional, dan pengumuman kegiatan.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Guru', 'Wali Murid'],
      status: 'Siap Pakai',
      version: 'v1.1',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Admin ➔ Pengesahan Kepala Sekolah',
      numberingFormat: '421.4/{SEQ}/EDR-ASY/2026',
      requiredFields: ['Judul Edaran', 'Periode Tanggal Libur', 'Catatan Untuk Orang Tua', 'Tanggal Masuk Kembali']
    },
    {
      id: 'TPL-006',
      code: 'SP-01',
      name: 'Surat Pengantar Dinas / Pengajuan Dokumen',
      category: 'Surat Pengantar',
      description: 'Surat pengantar dinas untuk pengurusan dokumen ke Dinas Pendidikan, Bank, atau Instansi Terkait.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'],
      allowedRolesLabels: ['Admin Sekolah', 'Kepala Sekolah'],
      status: 'Siap Pakai',
      version: 'v1.0',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Penyusunan Admin ➔ Pengesahan Kepala Sekolah',
      numberingFormat: '421.5/{SEQ}/SP-ASY/2026',
      requiredFields: ['Tujuan Pengantar', 'Daftar Lampiran', 'Perihal Pengajuan', 'Nama Petugas Pengantar']
    },
    {
      id: 'TPL-007',
      code: 'BA-01',
      name: 'Berita Acara Serah Terima Inventaris & Sarpras',
      category: 'Berita Acara',
      description: 'Dokumen pencatatan resmi penyerahan barang, peralatan, atau inventaris fasilitas TK Asy-Syifa.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Guru / Sarpras'],
      status: 'Siap Pakai',
      version: 'v1.3',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Pihak Pertama ➔ Pihak Kedua ➔ Pengesahan Kepsek',
      numberingFormat: '421.6/{SEQ}/BA-SARPRAS/2026',
      requiredFields: ['Nama Pihak 1 (Penyerah)', 'Nama Pihak 2 (Penerima)', 'Rincian Barang & Jumlah', 'Kondisi Barang']
    },
    {
      id: 'TPL-008',
      code: 'SERT-01',
      name: 'Sertifikat Kelulusan & Apresiasi Peserta Didik',
      category: 'Sertifikat',
      description: 'Piagam penghargaan & sertifikat tanda kelulusan pendidikan anak usia dini TK Asy-Syifa.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Guru', 'Wali Murid'],
      status: 'Aktif',
      version: 'v2.1',
      paperSize: 'A4',
      orientation: 'Mendatar (Landscape)',
      approvalChain: 'Verifikasi Wali Kelas ➔ TTD Kepala Sekolah & Yayasan',
      numberingFormat: 'CERT-ASY/{YEAR}/{SEQ}',
      requiredFields: ['Nama Lengkap Siswa', 'Tahun Ajaran', 'Predikat / Pencapaian', 'Tanggal Terbit']
    },
    {
      id: 'TPL-009',
      code: 'IZN-01',
      name: 'Surat Izin Permohonan Keringanan / Ketidakhadiran',
      category: 'Surat Izin',
      description: 'Formulir permohonan izin tidak masuk sekolah atau permohonan dispensasi kegiatan khusus.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'GURU', 'WALI_MURID'],
      allowedRolesLabels: ['Admin', 'Guru Kelas', 'Wali Murid'],
      status: 'Siap Pakai',
      version: 'v1.0',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Pengajuan Wali Murid ➔ Persetujuan Guru Kelas',
      numberingFormat: 'FORM-IZN/{MONTH}/{SEQ}',
      requiredFields: ['Nama Siswa', 'Kelompok Belajar', 'Alasan Izin', 'Jumlah Hari', 'Kontak Orang Tua']
    },
    {
      id: 'TPL-010',
      code: 'MUT-01',
      name: 'Surat Keterangan Mutasi / Pindah Sekolah',
      category: 'Surat Mutasi',
      description: 'Dokumen mutasi peserta didik yang akan berpindah ke sekolah lain atau permohonan masuk mutasi.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'WALI_MURID'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Wali Murid'],
      status: 'Siap Pakai',
      version: 'v1.2',
      paperSize: 'F4 (Folio)',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Verifikasi Admin ➔ Pengesahan Kepala Sekolah',
      numberingFormat: '421.7/{SEQ}/MUTASI-ASY/2026',
      requiredFields: ['Nama Siswa', 'NISN', 'Sekolah Tujuan', 'Alasan Pindah', 'Pernyataan Bebas Tanggungan']
    },
    {
      id: 'TPL-011',
      code: 'REK-01',
      name: 'Surat Rekomendasi Beasiswa / Kejuaraan',
      category: 'Surat Rekomendasi',
      description: 'Surat rekomendasi dari sekolah untuk pendataan siswa berprestasi atau permohonan beasiswa.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Guru'],
      status: 'Siap Pakai',
      version: 'v1.0',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Rekomendasi Guru ➔ Pengesahan Kepala Sekolah',
      numberingFormat: '421.8/{SEQ}/REK-ASY/2026',
      requiredFields: ['Nama Siswa / Guru', 'Kualifikasi Prestasi', 'Lembaga Tujuan Rekomendasi', 'Catatan Kinerja']
    },
    {
      id: 'TPL-012',
      code: 'PRN-01',
      name: 'Surat Pernyataan Orang Tua / Wali Murid',
      category: 'Surat Pernyataan',
      description: 'Surat pernyataan kesanggupan mematuhi tata tertib sekolah dan dukungan kegiatan anak.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'GURU', 'WALI_MURID'],
      allowedRolesLabels: ['Admin', 'Guru', 'Wali Murid'],
      status: 'Siap Pakai',
      version: 'v1.1',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Persetujuan & TTD Wali Murid ➔ Diketahui Wali Kelas',
      numberingFormat: 'PRN-WALI/{SEQ}/2026',
      requiredFields: ['Nama Wali Murid', 'Alamat & No Telp', 'Nama Anak', 'Pernyataan Kesanggupan']
    },
    {
      id: 'TPL-013',
      code: 'PIN-01',
      name: 'Surat Peminjaman Sarana & Fasilitas Sekolah',
      category: 'Surat Peminjaman',
      description: 'Formulir izin peminjaman ruangan, proyektor, atau perlengkapan acara sekolah.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
      allowedRolesLabels: ['Admin', 'Kepala Sekolah', 'Guru & Staf'],
      status: 'Siap Pakai',
      version: 'v1.0',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Pengajuan Peminjam ➔ Persetujuan Sarpras / Kepsek',
      numberingFormat: 'PIN-SARPRAS/{SEQ}/2026',
      requiredFields: ['Nama Peminjam', 'Nama Barang / Ruangan', 'Tanggal Pakai', 'Tanggal Pengembalian']
    },
    {
      id: 'TPL-014',
      code: 'KEM-01',
      name: 'Surat Pengembalian Inventaris Sekolah',
      category: 'Surat Pengembalian Inventaris',
      description: 'Bukti pengembalian aset sekolah yang telah selesai dipinjam dalam kondisi lengkap.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'GURU'],
      allowedRolesLabels: ['Admin Sarpras', 'Guru'],
      status: 'Siap Pakai',
      version: 'v1.0',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Pemeriksaan Barang ➔ TTD Petugas Sarpras',
      numberingFormat: 'KEM-SARPRAS/{SEQ}/2026',
      requiredFields: ['No Peminjaman', 'Nama Barang', 'Kondisi Saat Kembali', 'Tanggal Diterima Selesai']
    },
    {
      id: 'TPL-015',
      code: 'PPDB-01',
      name: 'Formulir Pendaftaran & Biodata PPDB',
      category: 'Dokumen PPDB',
      description: 'Berkas resmi formulir penerimaan peserta didik baru tahun ajaran 2026/2027.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'WALI_MURID'],
      allowedRolesLabels: ['Admin PPDB', 'Kepala Sekolah', 'Orang Tua Calon Siswa'],
      status: 'Aktif',
      version: 'v3.0',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Input Orang Tua ➔ Verifikasi Tim PPDB',
      numberingFormat: 'PPDB-ASY/2026/{SEQ}',
      requiredFields: ['Nama Lengkap Calon Siswa', 'NIK / No KK', 'Tempat Tanggal Lahir', 'Nama Ayah & Ibu', 'Alamat Lengkap']
    },
    {
      id: 'TPL-016',
      code: 'KEU-01',
      name: 'Kwitansi Resmi Pembayaran SPP & Uang Pangkal',
      category: 'Dokumen Keuangan',
      description: 'Bukti pembayaran resmi uang sekolah, dana kegiatan, dan iuran sarana edukasi.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEUANGAN', 'WALI_MURID'],
      allowedRolesLabels: ['Bendahara Keuangan', 'Admin', 'Wali Murid'],
      status: 'Siap Pakai',
      version: 'v2.0',
      paperSize: 'A5',
      orientation: 'Mendatar (Landscape)',
      approvalChain: 'Verifikasi Kasir / Keuangan ➔ Cetak Otomatis',
      numberingFormat: 'KW-SPP/{YEAR}/{MONTH}/{SEQ}',
      requiredFields: ['Nama Siswa', 'Bulan Pembayaran', 'Jumlah Nominal (Rp)', 'Keterangan Uang', 'Nama Kasir']
    },
    {
      id: 'TPL-017',
      code: 'YYS-01',
      name: 'Surat Edaran Kebijakan Yayasan Asy-Syifa',
      category: 'Dokumen Yayasan',
      description: 'Dokumen arahan dan ketetapan manajemen pembina Yayasan untuk seluruh unit sekolah.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'],
      allowedRolesLabels: ['Ketua Yayasan', 'Admin', 'Kepala Sekolah'],
      status: 'Aktif',
      version: 'v1.0',
      paperSize: 'F4 (Folio)',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Drafting Sekretaris ➔ Pengesahan Ketua Yayasan',
      numberingFormat: 'YYS-ASY/2026/EDR/{SEQ}',
      requiredFields: ['Perihal Kebijakan', 'Unit Sasaran', 'Tanggal Berlaku', 'Instruksi Utama']
    },
    {
      id: 'TPL-018',
      code: 'GRU-01',
      name: 'Berkas Portofolio & Jurnal Kinerja Guru',
      category: 'Dokumen Guru',
      description: 'Lembar pencatatan administrasi modul ajar, presensi tatap muka, dan evaluasi harian guru.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
      allowedRolesLabels: ['Guru Pembimbing', 'Kepala Sekolah', 'Admin'],
      status: 'Siap Pakai',
      version: 'v1.2',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Input Guru ➔ Penilaian Supervisi Kepala Sekolah',
      numberingFormat: 'ADM-GURU/{MONTH}/{SEQ}',
      requiredFields: ['Nama Guru', 'Mata Pelajaran / Kelompok', 'Target Capaian Pembelajaran', 'Evaluasi Harian']
    },
    {
      id: 'TPL-019',
      code: 'SIS-01',
      name: 'Buku Catatan Perkembangan & Raport Perkembangan Siswa',
      category: 'Dokumen Siswa',
      description: 'Laporan ringkasan pencapaian tumbuh kembang fisik, emosional, dan karakter anak didik.',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
      allowedRolesLabels: ['Guru Kelas', 'Kepala Sekolah', 'Wali Murid'],
      status: 'Aktif',
      version: 'v2.5',
      paperSize: 'A4',
      orientation: 'Tegak (Portrait)',
      approvalChain: 'Input Guru Kelas ➔ TTD Kepala Sekolah ➔ Diterima Orang Tua',
      numberingFormat: 'RAPORT-ASY/{YEAR}/{SEQ}',
      requiredFields: ['Nama Anak', 'Kelompok Usia', 'Capaian Agama & Moral', 'Capaian Motorik & Kognitif', 'Catatan Guru']
    }
  ];

  // RBAC Access Filter Function
  const isRoleAllowed = (allowedRoles: string[]) => {
    if (activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN') return true;
    return allowedRoles.includes(activeRole);
  };

  // Filtered Templates
  const filteredTemplates = templateLibrary.filter((tpl) => {
    // Search query
    const matchSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.code.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchCat = selectedCategory === 'SEMUA' || tpl.category === selectedCategory;

    // Role filter
    const matchRole =
      selectedRoleFilter === 'SEMUA' || tpl.allowedRoles.includes(selectedRoleFilter);

    return matchSearch && matchCat && matchRole;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNotice('Pustaka Templat v51.0 Berhasil Diterapkan. 19 Kategori Templat Siap Digunakan.');
      setTimeout(() => setNotice(null), 4000);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Header Card - Simple Indonesian for Elderly & Parents */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> Sprint P19 • Enterprise Template Library (Phase 1)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pustaka Templat Surat & Dokumen Resmi Sekolah (R44)
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Pilihan templat surat dan dokumen siap pakai untuk Administrasi Sekolah, Guru, Kepala Sekolah, Yayasan, dan Wali Murid.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Memuat...' : 'Perbarui Pustaka'}
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Katalog Templat
          </button>
        </div>
      </div>

      {notice && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{notice}</span>
        </motion.div>
      )}

      {/* Role Banner Notification */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Peran Anda Saat Ini:</strong> {activeRole} • Menampilkan templat dokumen yang relevan sesuai tingkat akses perizinan Anda.
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800">
          TEMPLATE REGISTRY LOCKED (PHASE 1)
        </span>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Total Templat Dokumen</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{templateLibrary.length} TEMPLAT</div>
          <p className="text-[11px] text-slate-300 font-bold">Terdaftar dalam Sistem LTS</p>
        </div>

        <div className="p-5 bg-emerald-950 text-white rounded-3xl border border-emerald-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold uppercase tracking-wider">
            <span>Kategori Dokumen</span>
            <FolderTree className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{categories.length - 1} KATEGORI</div>
          <p className="text-[11px] text-emerald-200">Terstruktur Lengkap</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Templat Siap Pakai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {templateLibrary.filter((t) => t.status === 'Siap Pakai' || t.status === 'Aktif').length} STANDAR
          </div>
          <p className="text-[11px] text-stone-500">Tervalidasi Format & Kebijakan</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Akses Untuk Peran Anda</span>
            <UserCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {templateLibrary.filter((t) => isRoleAllowed(t.allowedRoles)).length} DOKUMEN
          </div>
          <p className="text-[11px] text-stone-500">Dapat Diakses Akun Anda</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama templat, kode, atau keterangan surat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
            />
          </div>

          {/* Filter by Role */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0" />
            <span className="text-xs font-bold text-stone-600">Peran Akses:</span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden"
            >
              <option value="SEMUA">Semua Peran</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin Sekolah</option>
              <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
              <option value="KETUA_YAYASAN">Ketua Yayasan</option>
              <option value="GURU">Guru & Staf</option>
              <option value="WALI_MURID">Wali Murid</option>
            </select>
          </div>
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => {
          const allowed = isRoleAllowed(tpl.allowedRoles);

          return (
            <div
              key={tpl.id}
              className={`bg-white rounded-3xl p-5 border transition flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md ${
                allowed ? 'border-stone-200' : 'border-stone-200 opacity-75 bg-stone-50/50'
              }`}
            >
              <div className="space-y-3">
                {/* Category & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-bold text-[10px] border border-stone-200">
                    {tpl.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-stone-400">{tpl.version}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                        tpl.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-blue-100 text-blue-900 border-blue-300'
                      }`}
                    >
                      {tpl.status}
                    </span>
                  </div>
                </div>

                {/* Template Name & Code */}
                <div>
                  <div className="text-[10px] font-mono font-bold text-emerald-800">{tpl.code} • {tpl.id}</div>
                  <h3 className="text-base font-black text-slate-900 mt-0.5 leading-snug">{tpl.name}</h3>
                </div>

                {/* Brief Description */}
                <p className="text-stone-600 text-xs leading-relaxed font-normal">{tpl.description}</p>

                {/* Roles Allowed Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Dapat Digunakan Oleh:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tpl.allowedRolesLabels.map((roleLbl) => (
                      <span
                        key={roleLbl}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-medium text-[10px]"
                      >
                        {roleLbl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: "Lihat" */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-stone-400 font-bold">Format: {tpl.paperSize}</span>

                <button
                  onClick={() => setSelectedTemplate(tpl)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" /> Lihat Templat
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <Info className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-black text-slate-900">Tidak ada templat yang cocok</h3>
          <p className="text-stone-500 text-xs">Coba ubah kata kunci pencarian atau pilih kategori dokumen yang lain.</p>
        </div>
      )}

      {/* Detail View Modal ("Lihat Templat") */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px]">
                      {selectedTemplate.code}
                    </span>
                    <span className="text-xs font-bold text-stone-500">{selectedTemplate.category}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{selectedTemplate.name}</h2>
                </div>

                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 text-xs">
                {/* Overview Box */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-500 block uppercase tracking-wider text-[10px]">Deskripsi Dokumen:</span>
                  <p className="text-slate-800 text-sm font-medium leading-relaxed">{selectedTemplate.description}</p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 block">Status & Versi:</span>
                    <span className="font-bold text-slate-900">{selectedTemplate.status} ({selectedTemplate.version})</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 block">Ukuran Kertas & Layout:</span>
                    <span className="font-bold text-slate-900">{selectedTemplate.paperSize} • {selectedTemplate.orientation}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-bold text-stone-400 block">Formulasi Penomoran Otomatis:</span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded block">{selectedTemplate.numberingFormat}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-bold text-stone-400 block">Alur Persetujuan (Approval Matrix):</span>
                    <span className="font-bold text-slate-900">{selectedTemplate.approvalChain}</span>
                  </div>
                </div>

                {/* Required Fields List */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 block">Variabel / Data Wajib Diisi (Form Fields):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTemplate.requiredFields.map((field, idx) => (
                      <div key={idx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2 font-medium text-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{field}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notice for Sprint P19 */}
                <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200 text-[11px] font-medium flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Catatan Sprint P19:</strong> Pustaka templat telah siap. Fitur pengisian formulir dan pembuatan berkas fisik/PDF akan diaktifkan pada Sprint P20 mendatang.
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
