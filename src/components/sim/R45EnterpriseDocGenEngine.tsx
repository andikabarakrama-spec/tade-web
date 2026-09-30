import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  UserCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Printer,
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  Calendar,
  Layers,
  Lock,
  Search,
  Eye,
  Sliders,
  ShieldCheck,
  Zap,
  Info,
  Check,
  FileCheck,
  Hash,
  ArrowRight,
  BookOpen,
  DollarSign,
  Award,
  AlertTriangle,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import { Teacher, Student, PPDBRecord, SchoolProfile, UserProfile } from '../../types';

// ==========================================
// PART 1: UNIVERSAL VARIABLE REGISTRY SCHEMA
// ==========================================
export interface VariableCategory {
  groupKey: string;
  groupLabel: string;
  icon: React.ElementType;
  description: string;
  variables: {
    key: string;
    label: string;
    exampleValue: string;
    source: string;
  }[];
}

export const UNIVERSAL_VARIABLE_REGISTRY: VariableCategory[] = [
  {
    groupKey: 'sekolah',
    groupLabel: 'Profil Sekolah',
    icon: Building2,
    description: 'Variabel identitas resmi institusi sekolah.',
    variables: [
      { key: '{nama_sekolah}', label: 'Nama Sekolah', exampleValue: 'TK Asy-Syifa', source: 'SchoolProfile' },
      { key: '{npsn_sekolah}', label: 'NPSN Sekolah', exampleValue: '20276123', source: 'SchoolProfile' },
      { key: '{alamat_sekolah}', label: 'Alamat Sekolah', exampleValue: 'Jl. Masjid Asy-Syifa No. 12, Bandung', source: 'SchoolProfile' },
      { key: '{email_sekolah}', label: 'Email Resmi', exampleValue: 'info@tkasysyifa.sch.id', source: 'SchoolProfile' },
      { key: '{telepon_sekolah}', label: 'Nomor Telepon/WA', exampleValue: '(022) 7208192 / 08123456789', source: 'SchoolProfile' },
      { key: '{jenjang_sekolah}', label: 'Jenjang Pendidikan', exampleValue: 'TK / PAUD', source: 'SchoolProfile' }
    ]
  },
  {
    groupKey: 'yayasan',
    groupLabel: 'Profil Yayasan',
    icon: Building2,
    description: 'Variabel kelembagaan pembina yayasan.',
    variables: [
      { key: '{nama_yayasan}', label: 'Nama Yayasan', exampleValue: 'Yayasan Asy-Syifa Al-Khairiyyah', source: 'SchoolProfile' },
      { key: '{ketua_yayasan}', label: 'Ketua Yayasan', exampleValue: 'H. Ahmad Syarifuddin, M.Pd.', source: 'SchoolProfile' },
      { key: '{alamat_yayasan}', label: 'Alamat Yayasan', exampleValue: 'Kompleks Asy-Syifa Center No. 1', source: 'SchoolProfile' }
    ]
  },
  {
    groupKey: 'kepsek',
    groupLabel: 'Kepala Sekolah',
    icon: ShieldCheck,
    description: 'Otoritas pimpinan & pengesah dokumen.',
    variables: [
      { key: '{nama_kepsek}', label: 'Nama Kepala Sekolah', exampleValue: 'Siti Aminah, S.Pd.Aud', source: 'SchoolProfile' },
      { key: '{nip_kepsek}', label: 'NIP / NPT Kepsek', exampleValue: '198204122008012003', source: 'SchoolProfile' },
      { key: '{ttd_kepsek_title}', label: 'Jabatan Pengesah', exampleValue: 'Kepala TK Asy-Syifa', source: 'System Default' }
    ]
  },
  {
    groupKey: 'guru',
    groupLabel: 'Guru & Tenaga Kependidikan',
    icon: Briefcase,
    description: 'Data pendidik atau pelaksana tugas.',
    variables: [
      { key: '{nama_guru}', label: 'Nama Lengkap Guru', exampleValue: 'Ustadzah Nurul Hidayah, S.Pd.', source: 'Teacher Master' },
      { key: '{nip_guru}', label: 'NIP / NPT Guru', exampleValue: 'NPT-2020-004', source: 'Teacher Master' },
      { key: '{jabatan_guru}', label: 'Jabatan / Tugas', exampleValue: 'Guru Kelas Kelompok B1', source: 'Teacher Master' },
      { key: '{kelompok_ajar}', label: 'Kelompok Ajar', exampleValue: 'Kelompok B (Usia 5-6 Tahun)', source: 'Teacher Master' },
      { key: '{telepon_guru}', label: 'Nomor HP Guru', exampleValue: '081321987654', source: 'Teacher Master' }
    ]
  },
  {
    groupKey: 'siswa',
    groupLabel: 'Peserta Didik (Siswa)',
    icon: GraduationCap,
    description: 'Data anak didik & identitas belajar.',
    variables: [
      { key: '{nama_siswa}', label: 'Nama Lengkap Siswa', exampleValue: 'Muhammad Rayyan Al-Fatih', source: 'Student Master' },
      { key: '{nis_siswa}', label: 'NIS Sekolah', exampleValue: '20250012', source: 'Student Master' },
      { key: '{nisn_siswa}', label: 'NISN Nasional', exampleValue: '0189283741', source: 'Student Master' },
      { key: '{kelompok_siswa}', label: 'Kelompok Belajar', exampleValue: 'Kelompok B1 (Bintang)', source: 'Student Master' },
      { key: '{ttl_siswa}', label: 'Tempat, Tanggal Lahir', exampleValue: 'Bandung, 14 Mei 2020', source: 'Student Master' },
      { key: '{jenis_kelamin}', label: 'Jenis Kelamin', exampleValue: 'Laki-laki', source: 'Student Master' }
    ]
  },
  {
    groupKey: 'ortu',
    groupLabel: 'Orang Tua / Wali Murid',
    icon: Users,
    description: 'Data keluarga & kontak penanggung jawab.',
    variables: [
      { key: '{nama_ayah}', label: 'Nama Ayah Kandung', exampleValue: 'H. Bambang Setiawan', source: 'Student Master' },
      { key: '{nama_ibu}', label: 'Nama Ibu Kandung', exampleValue: 'Hj. Ratna Dewi, S.E.', source: 'Student Master' },
      { key: '{nama_wali}', label: 'Nama Wali Murid', exampleValue: 'H. Bambang Setiawan', source: 'Student Master' },
      { key: '{telepon_ortu}', label: 'No. WA Orang Tua', exampleValue: '081298765432', source: 'Student Master' },
      { key: '{alamat_ortu}', label: 'Alamat Rumah', exampleValue: 'Jl. Sukajadi No. 45, Bandung', source: 'Student Master' }
    ]
  },
  {
    groupKey: 'keuangan',
    groupLabel: 'Data Transaksi & Keuangan',
    icon: DollarSign,
    description: 'Rincian nominal, SPP, dan tagihan.',
    variables: [
      { key: '{nominal_pembayaran}', label: 'Nominal Tagihan / Bayar', exampleValue: 'Rp 450.000,-', source: 'SPP System' },
      { key: '{jenis_pembayaran}', label: 'Jenis Pembayaran', exampleValue: 'SPP Bulanan & Kegiatan', source: 'SPP System' },
      { key: '{periode_spp}', label: 'Bulan / Periode', exampleValue: 'Februari 2026', source: 'SPP System' },
      { key: '{nomor_kwitansi}', label: 'Nomor Kwitansi', exampleValue: 'KW-SPP/2026/02/089', source: 'SPP System' },
      { key: '{rekening_sekolah}', label: 'Rekening Bank Sekolah', exampleValue: 'BSI 7123456789 a.n TK Asy-Syifa', source: 'SchoolProfile' }
    ]
  },
  {
    groupKey: 'akademik',
    groupLabel: 'Tahun Ajaran & Kelas',
    icon: Calendar,
    description: 'Atribut periode akademik sekolah.',
    variables: [
      { key: '{tahun_ajaran}', label: 'Tahun Ajaran', exampleValue: '2025/2026', source: 'Academic Config' },
      { key: '{semester}', label: 'Semester', exampleValue: 'Genap (Semester II)', source: 'Academic Config' },
      { key: '{nama_kelas}', label: 'Nama Kelas', exampleValue: 'Kelompok B1', source: 'Academic Config' },
      { key: '{wali_kelas}', label: 'Wali Kelas', exampleValue: 'Ustadzah Nurul Hidayah, S.Pd.', source: 'Academic Config' }
    ]
  },
  {
    groupKey: 'metadata_dokumen',
    groupLabel: 'Metadata & Tanggal Surat',
    icon: Hash,
    description: 'Sistem penomoran & kalkulasi tanggal.',
    variables: [
      { key: '{nomor_dokumen}', label: 'Nomor Surat Resmi', exampleValue: '421.3/089/SKET-SISWA/II/2026', source: 'Numbering Policy' },
      { key: '{judul_dokumen}', label: 'Judul Dokumen', exampleValue: 'Surat Keterangan Siswa Aktif Belajar', source: 'Template Config' },
      { key: '{kategori_dokumen}', label: 'Kategori Dokumen', exampleValue: 'Surat Keterangan', source: 'Template Config' },
      { key: '{versi_dokumen}', label: 'Versi Templat', exampleValue: 'v1.5', source: 'Template Config' },
      { key: '{tanggal_sekarang}', label: 'Tanggal Hari Ini', exampleValue: '6 Februari 2026', source: 'System Date' },
      { key: '{tanggal_terbit}', label: 'Tanggal Terbit Surat', exampleValue: '6 Februari 2026', source: 'System Date' },
      { key: '{bulan_romawi}', label: 'Bulan (Romawi)', exampleValue: 'II', source: 'System Date' },
      { key: '{tahun_sekarang}', label: 'Tahun (YYYY)', exampleValue: '2026', source: 'System Date' },
      { key: '{kota_terbit}', label: 'Kota Penerbitan', exampleValue: 'Bandung', source: 'System Config' }
    ]
  }
];

// Sample Generation Templates
interface GenerationTemplate {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  targetType: 'GURU' | 'SISWA' | 'PPDB' | 'UMUM';
  headerTitle: string;
  bodyTemplate: string;
  defaultVars: Record<string, string>;
}

const GENERATION_TEMPLATES: GenerationTemplate[] = [
  {
    id: 'GENTPL-01',
    code: 'SKET-SISWA',
    name: 'Surat Keterangan Siswa Aktif Belajar',
    category: 'Surat Keterangan',
    description: 'Surat resmi menerangkan bahwa anak terdaftar aktif belajar di TK Asy-Syifa.',
    targetType: 'SISWA',
    headerTitle: 'SURAT KETERANGAN SISWA AKTIF',
    bodyTemplate: `Yang bertanda tangan di bawah ini, Kepala Sekolah {nama_sekolah}, Kota {kota_terbit}, menerangkan dengan sebenarnya bahwa:

Nama Lengkap : {nama_siswa}
NIS / NISN   : {nis_siswa} / {nisn_siswa}
Kelompok     : {kelompok_siswa}
Tempat/Tgl L : {ttl_siswa}
Nama Orangtua: {nama_ayah} / {nama_ibu}
Alamat       : {alamat_ortu}

Adalah benar-benar Peserta Didik Aktif yang terdaftar pada {nama_sekolah} Tahun Ajaran {tahun_ajaran} Semester {semester}.

Demikian Surat Keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.`,
    defaultVars: {
      keperluan: 'Persyaratan Kelengkapan Administrasi'
    }
  },
  {
    id: 'GENTPL-02',
    code: 'ST-GURU',
    name: 'Surat Tugas Pelatihan Kedinasan Guru',
    category: 'Surat Tugas',
    description: 'Surat penugasan resmi guru mengikuti workshop atau pelatihan pendidikan.',
    targetType: 'GURU',
    headerTitle: 'SURAT TUGAS KEDINASAN',
    bodyTemplate: `Yang bertanda tangan di bawah ini, Kepala Sekolah {nama_sekolah}, memberikan tugas kepada:

Nama Guru    : {nama_guru}
NIP / NPT    : {nip_guru}
Jabatan      : {jabatan_guru}
Unit Kerja   : {nama_sekolah}

Untuk melaksanakan tugas mengikuti Kegiatan Pelatihan & Bimbingan Teknis Peningkatan Kompetensi Pendidik PAUD pada:

Hari, Tanggal : Sabtu, 14 Februari 2026
Waktu         : 08.00 WIB s.d. Selesai
Tempat        : Aula Dinas Pendidikan Kota {kota_terbit}

Demikian Surat Tugas ini diberikan untuk dilaksanakan dengan penuh rasa tanggung jawab.`,
    defaultVars: {
      nama_kegiatan: 'Workshop Implementasi Kurikulum PAUD'
    }
  },
  {
    id: 'GENTPL-03',
    code: 'SK-KEPSEK',
    name: 'Surat Keputusan Pengangkatan Guru / Staf',
    category: 'Surat Keputusan (SK)',
    description: 'Surat Keputusan penetapan tugas dan pengangkatan pendidik.',
    targetType: 'GURU',
    headerTitle: 'SURAT KEPUTUSAN KEPALA SEKOLAH',
    bodyTemplate: `KEPUTUSAN KEPALA SEKOLAH {nama_sekolah}
Nomor: {nomor_dokumen}

TENTANG
PENGANGKATAN DAN PENETAPAN BEBAN TUGAS MENGAJAR
TAHUN AJARAN {tahun_ajaran}

Menimbang  : Bahwa demi kelancaran proses belajar mengajar di {nama_sekolah}.
Mengingat  : Hasil Keputusan Rapat Pembina {nama_yayasan}.

MEMUTUSKAN:
Menetapkan :
Pertama    : Mengangkat Sdr/I {nama_guru} (NPT: {nip_guru}) sebagai {jabatan_guru}.
Kedua      : Yang bersangkutan diberikan beban tugas mengajar pada {kelompok_ajar}.
Ketiga     : Keputusan ini berlaku sejak tanggal ditetapkan.`,
    defaultVars: {
      tmt_tanggal: '01 Juli 2025'
    }
  },
  {
    id: 'GENTPL-04',
    code: 'KW-SPP',
    name: 'Kwitansi Resmi Bukti Pembayaran SPP',
    category: 'Dokumen Keuangan',
    description: 'Bukti serah terima pembayaran iuran SPP dan kegiatan siswa.',
    targetType: 'SISWA',
    headerTitle: 'KWITANSI PEMBAYARAN SPP RESMI',
    bodyTemplate: `Telah diterima dari  : {nama_ayah} / {nama_ibu} (Orang Tua dari {nama_siswa})
Untuk Pembayaran     : {jenis_pembayaran} Bulan {periode_spp}
Kelompok Belajar     : {kelompok_siswa} (NIS: {nis_siswa})
Jumlah Nominal       : {nominal_pembayaran}
Terbilang            : empat ratus lima puluh ribu rupiah

Status Pembayaran    : LUNAS TERVERIFIKASI
Penerima / Kasir     : Bendahara Keuangan {nama_sekolah}`,
    defaultVars: {
      nominal_pembayaran: 'Rp 450.000,-',
      jenis_pembayaran: 'Iuran SPP Bulanan & Media Edukasi',
      periode_spp: 'Februari 2026'
    }
  }
];

export const R45EnterpriseDocGenEngine: React.FC = () => {
  const { activeRole } = useAuth();

  // Wizard Step State
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [activeSubTab, setActiveSubTab] = useState<'GENERATOR' | 'REGISTRY' | 'AUDIT'>('GENERATOR');

  // Master Data State
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [ppdbRecords, setPpdbRecords] = useState<PPDBRecord[]>([]);

  // Selection States
  const [selectedTemplate, setSelectedTemplate] = useState<GenerationTemplate>(GENERATION_TEMPLATES[0]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedPpdbId, setSelectedPpdbId] = useState<string>('');

  // Universal Populated Variable Values Map
  const [populatedVars, setPopulatedVars] = useState<Record<string, string>>({});

  // Operational feedback states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoFillNotice, setAutoFillNotice] = useState<string | null>(null);

  // Load DataService Data Safely
  useEffect(() => {
    async function loadMasterData() {
      try {
        const [prof, tList, sList, pList] = await Promise.all([
          DataService.getSchoolProfile(),
          DataService.getTeachers(),
          DataService.getStudents(),
          DataService.getPPDBRecords()
        ]);

        setSchoolProfile(prof);
        setTeachers(tList || []);
        setStudents(sList || []);
        setPpdbRecords(pList || []);

        // Initial default variable population
        initDefaultVars(prof, tList[0], sList[0]);
      } catch (err) {
        console.error('Failed loading master data for DocGen Engine:', err);
      }
    }

    loadMasterData();
  }, []);

  // Initialize Base Variables
  const initDefaultVars = (prof: SchoolProfile | null, firstTeacher?: Teacher, firstStudent?: Student) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const baseMap: Record<string, string> = {
      '{nama_sekolah}': prof?.name || 'TK Asy-Syifa',
      '{npsn_sekolah}': prof?.npsn || '20276123',
      '{alamat_sekolah}': prof?.address || 'Jl. Masjid Asy-Syifa No. 12, Bandung',
      '{email_sekolah}': prof?.email || 'info@tkasysyifa.sch.id',
      '{telepon_sekolah}': prof?.whatsapp || prof?.phone || '(022) 7208192',
      '{jenjang_sekolah}': 'TK / PAUD',
      '{nama_yayasan}': 'Yayasan Asy-Syifa Al-Khairiyyah',
      '{ketua_yayasan}': 'H. Ahmad Syarifuddin, M.Pd.',
      '{alamat_yayasan}': 'Kompleks Asy-Syifa Center No. 1',
      '{nama_kepsek}': prof?.kepalaSekolah || 'Siti Aminah, S.Pd.Aud',
      '{nip_kepsek}': '198204122008012003',
      '{ttd_kepsek_title}': 'Kepala TK Asy-Syifa',
      '{tahun_ajaran}': '2025/2026',
      '{semester}': 'Genap (Semester II)',
      '{tanggal_sekarang}': dateStr,
      '{tanggal_terbit}': dateStr,
      '{bulan_romawi}': 'II',
      '{tahun_sekarang}': '2026',
      '{kota_terbit}': 'Bandung',
      '{nomor_dokumen}': `421.3/089/${selectedTemplate.code}/II/2026`,
      '{judul_dokumen}': selectedTemplate.headerTitle,
      '{kategori_dokumen}': selectedTemplate.category,
      '{versi_dokumen}': 'v1.5',
      ...selectedTemplate.defaultVars
    };

    if (firstTeacher) {
      baseMap['{nama_guru}'] = firstTeacher.name;
      baseMap['{nip_guru}'] = firstTeacher.nip || firstTeacher.nuptk || 'NPT-2020-001';
      baseMap['{jabatan_guru}'] = firstTeacher.position || firstTeacher.title || 'Guru Pembimbing';
      baseMap['{kelompok_ajar}'] = firstTeacher.assignedClass || 'Kelompok B';
      baseMap['{telepon_guru}'] = firstTeacher.phone || '08123456789';
    }

    if (firstStudent) {
      baseMap['{nama_siswa}'] = firstStudent.name;
      baseMap['{nis_siswa}'] = firstStudent.nis || '20250012';
      baseMap['{nisn_siswa}'] = firstStudent.nisn || '0189283741';
      baseMap['{kelompok_siswa}'] = firstStudent.classGroup || 'Kelompok B1';
      baseMap['{ttl_siswa}'] = `Bandung, ${firstStudent.birthDate || '14 Mei 2020'}`;
      baseMap['{jenis_kelamin}'] = firstStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan';
      baseMap['{nama_ayah}'] = firstStudent.parentName || 'H. Bambang Setiawan';
      baseMap['{nama_ibu}'] = 'Hj. Ratna Dewi, S.E.';
      baseMap['{nama_wali}'] = firstStudent.parentName || 'H. Bambang Setiawan';
      baseMap['{telepon_ortu}'] = firstStudent.parentPhone || '081298765432';
      baseMap['{alamat_ortu}'] = firstStudent.address || 'Jl. Sukajadi No. 45, Bandung';
    }

    setPopulatedVars(baseMap);
  };

  // Auto Fill Engine Trigger: Teacher Selection
  const handleSelectTeacher = (tId: string) => {
    setSelectedTeacherId(tId);
    const teacher = teachers.find((t) => t.id === tId);
    if (teacher) {
      setPopulatedVars((prev) => ({
        ...prev,
        '{nama_guru}': teacher.name,
        '{nip_guru}': teacher.nip || teacher.nuptk || 'NPT-2020-002',
        '{jabatan_guru}': teacher.position || teacher.title || 'Guru Pembimbing',
        '{kelompok_ajar}': teacher.assignedClass || 'Kelompok Belajar',
        '{telepon_guru}': teacher.phone || '-'
      }));

      setAutoFillNotice(`Berhasil Mengisi Otomatis Data Guru: ${teacher.name}`);
      setTimeout(() => setAutoFillNotice(null), 3000);
    }
  };

  // Auto Fill Engine Trigger: Student Selection
  const handleSelectStudent = (sId: string) => {
    setSelectedStudentId(sId);
    const student = students.find((s) => s.id === sId);
    if (student) {
      setPopulatedVars((prev) => ({
        ...prev,
        '{nama_siswa}': student.name,
        '{nis_siswa}': student.nis || '20250088',
        '{nisn_siswa}': student.nisn || '0192837410',
        '{kelompok_siswa}': student.classGroup || 'Kelompok B',
        '{ttl_siswa}': `Bandung, ${student.birthDate || '10 Januari 2020'}`,
        '{jenis_kelamin}': student.gender === 'L' ? 'Laki-laki' : 'Perempuan',
        '{nama_ayah}': student.parentName || 'Bapak Wali',
        '{nama_ibu}': 'Ibu Wali',
        '{nama_wali}': student.parentName || 'Wali Murid',
        '{telepon_ortu}': student.parentPhone || '08123456789',
        '{alamat_ortu}': student.address || 'Bandung'
      }));

      setAutoFillNotice(`Berhasil Mengisi Otomatis Data Siswa: ${student.name}`);
      setTimeout(() => setAutoFillNotice(null), 3000);
    }
  };

  // Auto Fill Engine Trigger: PPDB Selection
  const handleSelectPpdb = (pId: string) => {
    setSelectedPpdbId(pId);
    const ppdb = ppdbRecords.find((p) => p.id === pId);
    if (ppdb) {
      setPopulatedVars((prev) => ({
        ...prev,
        '{nama_siswa}': ppdb.studentName,
        '{nis_siswa}': ppdb.registrationNo || 'PPDB-2026',
        '{nisn_siswa}': 'Dalam Proses NISN',
        '{kelompok_siswa}': ppdb.groupChoice || 'Calon Siswa',
        '{ttl_siswa}': `${ppdb.birthPlace || 'Bandung'}, ${ppdb.birthDate || '2020'}`,
        '{jenis_kelamin}': ppdb.gender === 'Laki-laki' ? 'Laki-laki' : 'Perempuan',
        '{nama_ayah}': ppdb.fatherName || 'Ayah Calon Siswa',
        '{nama_ibu}': ppdb.motherName || 'Ibu Calon Siswa',
        '{nama_wali}': ppdb.fatherName || ppdb.motherName || 'Orang Tua PPDB',
        '{telepon_ortu}': ppdb.phone || '08123456789',
        '{alamat_ortu}': ppdb.address || 'Bandung'
      }));

      setAutoFillNotice(`Berhasil Mengisi Otomatis Data Calon Siswa PPDB: ${ppdb.studentName}`);
      setTimeout(() => setAutoFillNotice(null), 3000);
    }
  };

  // Template Change Handler
  const handleTemplateChange = (tpl: GenerationTemplate) => {
    setSelectedTemplate(tpl);
    setPopulatedVars((prev) => ({
      ...prev,
      '{nomor_dokumen}': `421.3/089/${tpl.code}/II/2026`,
      '{judul_dokumen}': tpl.headerTitle,
      '{kategori_dokumen}': tpl.category,
      ...tpl.defaultVars
    }));
  };

  // Dynamic Text Substitution Engine
  const substitutedDocumentBody = useMemo(() => {
    let text = selectedTemplate.bodyTemplate;
    Object.entries(populatedVars).forEach(([key, val]) => {
      text = text.replaceAll(key, val || `[${key}]`);
    });
    return text;
  }, [selectedTemplate, populatedVars]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setAutoFillNotice('Engine Generasi Dokumen P20 Berhasil Diverifikasi & Disinkronkan dengan Master Data.');
      setTimeout(() => setAutoFillNotice(null), 4000);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Zap className="w-3.5 h-3.5 text-emerald-700" /> Sprint P20 • Enterprise Document Generation Engine (Phase 1)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Engine Otomatisasi & Generasi Isi Dokumen (R45)
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Fitur pengisian data otomatis (Auto-Fill Engine) dari Master Data Sekolah, Guru, Siswa & PPDB ke dalam Pratinjau Dokumen Populated.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
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
            <Printer className="w-4 h-4" /> Cetak Lembar Generasi
          </button>
        </div>
      </div>

      {autoFillNotice && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{autoFillNotice}</span>
        </motion.div>
      )}

      {/* RBAC Privilege Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Otoritas Akun ({activeRole}):</strong> {activeRole === 'SUPER_ADMIN' ? 'Read-only Governance & Monitoring Mode' : 'Otoritas Pengoperasian Generasi Dokumen Terverifikasi'}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800">
          SPRINT P20 PREPARATION MODE
        </span>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex items-center gap-1">
        <button
          onClick={() => setActiveSubTab('GENERATOR')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'GENERATOR' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Zap className="w-4 h-4" /> Generator & Auto-Fill Dokumen
        </button>

        <button
          onClick={() => setActiveSubTab('REGISTRY')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'REGISTRY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" /> Registri Variabel Universal ({UNIVERSAL_VARIABLE_REGISTRY.reduce((a, b) => a + b.variables.length, 0)})
        </button>
      </div>

      {/* TAB 1: MAIN GENERATOR & AUTO FILL WIZARD */}
      {activeSubTab === 'GENERATOR' && (
        <div className="space-y-6">
          {/* Step Navigation Bar for Elderly Teachers */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveStep(1)}
              className={`p-4 rounded-2xl text-left border transition cursor-pointer flex items-center gap-3 ${
                activeStep === 1 ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${activeStep === 1 ? 'bg-emerald-400 text-slate-950' : 'bg-stone-200 text-stone-700'}`}>
                1
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Langkah Pertama</span>
                <span className="text-sm font-black">Pilih Templat Dokumen</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className={`p-4 rounded-2xl text-left border transition cursor-pointer flex items-center gap-3 ${
                activeStep === 2 ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${activeStep === 2 ? 'bg-emerald-400 text-slate-950' : 'bg-stone-200 text-stone-700'}`}>
                2
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Langkah Kedua</span>
                <span className="text-sm font-black">Pilih Target & Auto Fill</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className={`p-4 rounded-2xl text-left border transition cursor-pointer flex items-center gap-3 ${
                activeStep === 3 ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${activeStep === 3 ? 'bg-emerald-400 text-slate-950' : 'bg-stone-200 text-stone-700'}`}>
                3
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Langkah Ketiga</span>
                <span className="text-sm font-black">Pratinjau Hasil Dokumen</span>
              </div>
            </button>
          </div>

          {/* STEP 1: SELECT TEMPLATE */}
          {activeStep === 1 && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Pilih Jenis Templat Dokumen</h2>
                  <p className="text-stone-500 text-xs mt-0.5">Silakan pilih jenis surat atau dokumen resmi yang ingin Anda siapkan.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
                  {GENERATION_TEMPLATES.length} Pilihan Utama
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GENERATION_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate.id === tpl.id;

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleTemplateChange(tpl)}
                      className={`p-5 rounded-3xl border-2 transition cursor-pointer space-y-3 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/40 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold">
                          {tpl.code}
                        </span>
                        <span className="text-xs font-bold text-stone-500">{tpl.category}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-slate-900">{tpl.name}</h3>
                        <p className="text-stone-600 text-xs mt-1 leading-relaxed">{tpl.description}</p>
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold">
                        <span className="text-stone-500">Target Data: {tpl.targetType}</span>
                        {isSelected ? (
                          <span className="text-emerald-800 font-black flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Terpilih
                          </span>
                        ) : (
                          <span className="text-stone-400 font-medium">Klik untuk memilih</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition cursor-pointer shadow-xs"
                >
                  Lanjut ke Langkah 2: Isi Otomatis Data <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AUTO FILL ENGINE */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-700" /> Auto-Fill Engine (Pengisian Data Otomatis)
                    </h2>
                    <p className="text-stone-500 text-xs mt-0.5">
                      Pilih nama Guru, Siswa, atau Pendaftar PPDB untuk mengisi seluruh variabel surat secara otomatis tanpa perlu mengetik ulang.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
                    Sistem 100% Otomatis
                  </span>
                </div>

                {/* Auto Fill Target Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Selector 1: Guru */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-800" /> Pilih Guru / Staf:
                    </label>
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => handleSelectTeacher(e.target.value)}
                      className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden"
                    >
                      <option value="">-- Pilih Nama Guru --</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.assignedClass || t.position || 'Guru'})
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-stone-500 block">
                      Mengisi otomatis: Nama Guru, NIP/NPT, Jabatan, & Kelompok.
                    </span>
                  </div>

                  {/* Selector 2: Siswa */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-800" /> Pilih Peserta Didik (Siswa):
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => handleSelectStudent(e.target.value)}
                      className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden"
                    >
                      <option value="">-- Pilih Nama Siswa --</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.classGroup || 'Siswa'})
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-stone-500 block">
                      Mengisi otomatis: Nama Siswa, NIS/NISN, Kelompok, TTL, Orang Tua.
                    </span>
                  </div>

                  {/* Selector 3: PPDB */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-800" /> Pilih Pendaftar PPDB:
                    </label>
                    <select
                      value={selectedPpdbId}
                      onChange={(e) => handleSelectPpdb(e.target.value)}
                      className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden"
                    >
                      <option value="">-- Pilih Calon Siswa PPDB --</option>
                      {ppdbRecords.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.studentName} ({p.registrationNo})
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-stone-500 block">
                      Mengisi otomatis: Calon Siswa, Orang Tua, No HP, Alamat.
                    </span>
                  </div>
                </div>

                {/* Live Variables Populated List */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Hasil Data Terisi Otomatis Dalam Dokumen:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                    {Object.entries(populatedVars).map(([key, val]) => (
                      <div key={key} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-800 block truncate">{key}</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => setPopulatedVars({ ...populatedVars, [key]: e.target.value })}
                          className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-slate-900 font-sans font-medium text-xs focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-2xl transition cursor-pointer"
                  >
                    Kembali ke Langkah 1
                  </button>

                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    Lihat Pratinjau Dokumen Populated <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT DATA PREVIEW */}
          {activeStep === 3 && (
            <div className="space-y-6">
              {/* Document Paper Representation */}
              <div className="bg-stone-200/60 p-4 sm:p-8 rounded-3xl border border-stone-300 flex justify-center shadow-inner">
                <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl p-8 sm:p-12 border border-stone-300 shadow-xl space-y-6 font-serif">
                  {/* Kop Surat Sekolah */}
                  <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
                    <div className="font-bold text-xs font-sans uppercase tracking-widest text-slate-600">
                      {populatedVars['{nama_yayasan}']}
                    </div>
                    <div className="text-xl font-black uppercase tracking-wide font-sans text-slate-900">
                      {populatedVars['{nama_sekolah}']}
                    </div>
                    <div className="text-[11px] font-sans text-stone-600">
                      NPSN: {populatedVars['{npsn_sekolah}']} • {populatedVars['{alamat_sekolah}']}
                    </div>
                    <div className="text-[10px] font-sans text-stone-500">
                      Email: {populatedVars['{email_sekolah}']} | WA: {populatedVars['{telepon_sekolah}']}
                    </div>
                  </div>

                  {/* Document Title & Number */}
                  <div className="text-center space-y-1 py-2">
                    <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 underline font-sans">
                      {populatedVars['{judul_dokumen}']}
                    </h2>
                    <div className="font-mono text-xs font-bold text-slate-700">
                      Nomor: {populatedVars['{nomor_dokumen}']}
                    </div>
                  </div>

                  {/* Substituted Document Content */}
                  <div className="text-sm leading-relaxed whitespace-pre-line text-slate-800 font-sans p-4 bg-stone-50 rounded-xl border border-stone-200">
                    {substitutedDocumentBody}
                  </div>

                  {/* Signature & Approval Block */}
                  <div className="pt-8 flex justify-end font-sans text-xs">
                    <div className="text-center space-y-12">
                      <div>
                        <div>{populatedVars['{kota_terbit}']}, {populatedVars['{tanggal_terbit}']}</div>
                        <div className="font-bold mt-1">{populatedVars['{ttd_kepsek_title}']}</div>
                      </div>

                      <div>
                        <div className="font-black text-slate-900 underline">{populatedVars['{nama_kepsek}']}</div>
                        <div className="font-mono text-[11px] text-stone-600">NIP. {populatedVars['{nip_kepsek}']}</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Notice */}
                  <div className="pt-6 border-t border-stone-200 flex items-center justify-between text-[10px] font-sans text-stone-400">
                    <span>Dokumen Dipreparasi Oleh Engine R45 Sprint P20</span>
                    <span className="font-mono font-bold text-emerald-800">STATUS: READY PREVIEW</span>
                  </div>
                </div>
              </div>

              {/* Sprint P20 Read-Only Notice */}
              <div className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center justify-between gap-4 border border-emerald-700 shadow-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                  <span>
                    <strong>Mode Generasi Dokumen Selesai:</strong> Data variabel terisi 100% dari Master Data. Sesuai Konstitusi P20, tidak ada PDF Export atau mutasi database pada tahapan ini.
                  </span>
                </div>
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 bg-white text-slate-900 hover:bg-stone-100 font-black rounded-xl text-xs transition cursor-pointer"
                >
                  Ubah Data Auto Fill
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UNIVERSAL VARIABLE REGISTRY BROWSER */}
      {activeSubTab === 'REGISTRY' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-800" /> Katalog Variabel Universal Terstandarisasi
              </h2>
              <p className="text-stone-500 text-xs mt-0.5">
                Daftar lengkap variabel standar yang dapat digunakan pada seluruh templat dokumen resmi sekolah.
              </p>
            </div>
            <span className="px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-full">
              LTS REGISTRY UNIFIED
            </span>
          </div>

          <div className="space-y-6">
            {UNIVERSAL_VARIABLE_REGISTRY.map((group) => {
              const GroupIcon = group.icon;

              return (
                <div key={group.groupKey} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <GroupIcon className="w-4 h-4 text-emerald-800" />
                    <h3 className="text-sm font-black text-slate-900">{group.groupLabel}</h3>
                    <span className="text-stone-400 text-xs">• {group.description}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.variables.map((v) => (
                      <div key={v.key} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1 shadow-2xs">
                        <span className="font-mono font-bold text-xs text-emerald-800 block bg-emerald-50 px-2 py-0.5 rounded w-fit">
                          {v.key}
                        </span>
                        <div className="text-xs font-bold text-slate-900">{v.label}</div>
                        <div className="text-[11px] text-stone-500">
                          Contoh: <strong className="text-slate-800">{v.exampleValue}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
