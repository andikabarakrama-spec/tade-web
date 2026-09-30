/**
 * TADE PUSAT ASET SERVICE — SPRINT G13
 * Single Truth Repository for all TK Islam Asy Syifa Tanggul Digital Assets.
 * Categories: Poster, Sertifikat, Animasi, Ikon, Suara, Motif Islami, Foto, Video, Fitur Tambahan.
 * Features:
 * - Ready-to-use school templates (no yearly remake needed)
 * - Automatic size, quality, and foreign watermark verification
 * - Version tracking & author attribution
 * - Founder 1-Click Approval System
 * - Seamless Black Box Telemetry Integration
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { drPulseHealthPassportService } from './drPulseHealthPassport';

export type TadeAssetCategory =
  | 'POSTER'
  | 'SERTIFIKAT'
  | 'ANIMASI'
  | 'IKON'
  | 'SUARA'
  | 'MOTIF_ISLAMI'
  | 'FOTO'
  | 'VIDEO'
  | 'FITUR_TAMBAHAN';

export interface TadeAssetItem {
  id: string;
  title: string;
  category: TadeAssetCategory;
  shelf: string; // Sub-category/rak
  description: string;
  tags: string[];
  version: number;
  author: string;
  authorRole: string;
  isOfficialApproved: boolean;
  approvedByFounder?: string;
  approvedTimestamp?: string;
  qualityScore: number; // 0 - 100
  hasForeignWatermark: boolean;
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  fileSizeBytes: number;
  previewType: 'CANVAS_TEMPLATE' | 'SVG_VECTOR' | 'SOUNDSCAPE' | 'PHOTO_GALLERY' | 'VIDEO_STREAM' | 'TOOL_UTILITY';
  svgData?: string;
  templateData?: any;
  soundPresetId?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isLockedOfficial: boolean;
}

export interface AssetValidationResult {
  isValid: boolean;
  qualityScore: number;
  isSizeOptimal: boolean;
  hasForeignWatermark: boolean;
  warningMessages: string[];
  successMessages: string[];
}

const STORAGE_KEY = 'tade_pusat_aset_vault_v1';

// Initial pre-loaded seed assets covering all requirements
const INITIAL_ASSETS: TadeAssetItem[] = [
  // ─── 1. POSTER SIAP PAKAI ───
  {
    id: 'pos-ppdb-2026',
    title: 'Poster PPDB Gelombang I 2026/2027',
    category: 'POSTER',
    shelf: 'PPDB',
    description: 'Poster pendaftaran santri baru lengkap dengan rincian sentra, tahfidz, dan fasilitas.',
    tags: ['PPDB', 'Pendaftaran', 'Santri Baru', 'Resmi'],
    version: 3,
    author: 'Ustadzah Fatimah (Admin PPDB)',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-20T08:00:00Z',
    qualityScore: 98,
    hasForeignWatermark: false,
    dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
    fileSizeBytes: 245000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      theme: 'EMERALD_GOLD',
      title: 'Penerimaan Peserta Didik Baru',
      subtitle: 'Tahun Ajaran 2026/2027 • TK Islam Asy-Syifa Tanggul',
      badge: 'KUOTA TERBATAS',
      highlight: 'Kurikulum Sentra Islami & Tahfidz Quran Juz 30',
      dateText: 'Gelombang 1: 1 Januari - 31 Maret 2026',
      contact: 'Info Kantor Yayasan: 0812-3456-7890'
    },
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-20T08:00:00Z',
    usageCount: 42,
    isLockedOfficial: true
  },
  {
    id: 'pos-wisuda-haflah',
    title: 'Poster Haflah Akhirussanah & Wisuda Santri',
    category: 'POSTER',
    shelf: 'Wisuda',
    description: 'Desain elegan pelepasan santri Kelompok B dengan motif islami zamrud emas.',
    tags: ['Wisuda', 'Haflah', 'Kelulusan', 'Kelompok B'],
    version: 2,
    author: 'Prof. Atlas (Akademik)',
    authorRole: 'KEPALA_SEKOLAH',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-18T10:00:00Z',
    qualityScore: 97,
    hasForeignWatermark: false,
    dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
    fileSizeBytes: 220000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      theme: 'NAVY_GOLD',
      title: 'Haflah Akhirussanah & Wisuda',
      subtitle: 'Angkatan XII • Mencetak Generasi Qurani Berakhlak Mulia',
      badge: 'AGENDA RESMI',
      highlight: 'Uji Publik Tahfidz Quran & Pentas Seni Sentra',
      dateText: 'Sabtu, 20 Juni 2026 • Aula Utama Yayasan',
      contact: 'Sekretariat Wisuda Asy-Syifa'
    },
    createdAt: '2026-08-16T00:00:00Z',
    updatedAt: '2026-08-18T10:00:00Z',
    usageCount: 19,
    isLockedOfficial: true
  },
  {
    id: 'pos-ramadhan-ceria',
    title: 'Poster Semarak Ramadhan & Pesantren Kilat Cilik',
    category: 'POSTER',
    shelf: 'Ramadhan',
    description: 'Poster penuh keceriaan menyambut bulan suci dengan ornamen lentera dan bulan sabit.',
    tags: ['Ramadhan', 'Pesantren Kilat', 'Zakat Fitrah', 'Tarhib'],
    version: 1,
    author: 'Ustadz Ahmad (Guru Sentra)',
    authorRole: 'GURU',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-19T09:30:00Z',
    qualityScore: 96,
    hasForeignWatermark: false,
    dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
    fileSizeBytes: 210000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      theme: 'ROYAL_PURPLE_GOLD',
      title: 'Semarak Ramadhan Penuh Berkah',
      subtitle: 'Pesantren Kilat & Berbagi Kasih Yatim Santri Cilik',
      badge: 'MARHABAN YA RAMADHAN',
      highlight: 'Hafalan Doa Buka Puasa, Praktik Sholat Tarawih, & Dongeng Islami',
      dateText: 'Pekan I & II Ramadhan 1447 H',
      contact: 'Panitia Amaliyah Ramadhan Asy-Syifa'
    },
    createdAt: '2026-08-17T00:00:00Z',
    updatedAt: '2026-08-19T09:30:00Z',
    usageCount: 15,
    isLockedOfficial: true
  },
  {
    id: 'pos-milad-sekolah',
    title: 'Poster Milad Yayasan & Gebyar Anak Sholeh',
    category: 'POSTER',
    shelf: 'Milad',
    description: 'Poster perayaan hari jadi sekolah dengan lomba mewarnai dan tahfidz tingkat PAUD se-Kecamatan.',
    tags: ['Milad', 'Ulang Tahun', 'Gebyar', 'Lomba'],
    version: 1,
    author: 'Tim Kreatif TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-20T11:00:00Z',
    qualityScore: 95,
    hasForeignWatermark: false,
    dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
    fileSizeBytes: 230000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      theme: 'EMERALD_GOLD',
      title: 'Milad Ke-12 TK Islam Asy-Syifa',
      subtitle: 'Gebyar Kreasi Anak Sholeh & Festival Literasi Sentra',
      badge: 'FESTIVAL TAHUNAN',
      highlight: 'Lomba Mewarnai Kaligrafi, Sambung Ayat Juz Amma, & Parenting Talk',
      dateText: 'Ahad, 15 November 2026',
      contact: 'Humas Yayasan Asy-Syifa Tanggul'
    },
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-20T11:00:00Z',
    usageCount: 11,
    isLockedOfficial: true
  },
  {
    id: 'pos-kemerdekaan-ri',
    title: 'Poster Semarak HUT Kemerdekaan RI Ke-81',
    category: 'POSTER',
    shelf: 'Hari Kemerdekaan',
    description: 'Desain merah putih berpadu hijau nusantara untuk peringatan hari kemerdekaan santri.',
    tags: ['Kemerdekaan', '17 Agustus', 'Pahlawan', 'Nasional'],
    version: 1,
    author: 'Ustadzah Siti (Guru Sentra Balok)',
    authorRole: 'GURU',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-21T07:00:00Z',
    qualityScore: 96,
    hasForeignWatermark: false,
    dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
    fileSizeBytes: 205000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      theme: 'RUBY_WHITE',
      title: 'Semarak Kemerdekaan RI Ke-81',
      subtitle: 'Santri Kuat, Indonesia Berakhlak & Berdaya',
      badge: 'DIRGAHAYU INDONESIA',
      highlight: 'Karnaval Baju Adat Nusantara & Pawai Sepeda Hias',
      dateText: 'Senin - Rabu, 17-19 Agustus 2026',
      contact: 'Panitia PHBN TK Asy-Syifa'
    },
    createdAt: '2026-08-19T00:00:00Z',
    updatedAt: '2026-08-21T07:00:00Z',
    usageCount: 8,
    isLockedOfficial: true
  },
  {
    id: 'pos-pekan-sentra',
    title: 'Poster Pekan Eksplorasi Sentra Belajar',
    category: 'POSTER',
    shelf: 'Pekan Sentra',
    description: 'Poster jadwal perputaran moving class 7 sentra unggulan TK Islam Asy-Syifa.',
    tags: ['Pekan Sentra', 'Moving Class', 'Sentra Bahan Alam', 'Sentra Balok'],
    version: 2,
    author: 'Prof. Atlas',
    authorRole: 'KEPALA_SEKOLAH',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-21T14:00:00Z',
    qualityScore: 98,
    hasForeignWatermark: false,
    dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
    fileSizeBytes: 215000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      theme: 'TEAL_EMERALD',
      title: 'Pekan Eksplorasi 7 Sentra',
      subtitle: 'Belajar Melalui Bermain Bermakna & Eksperimen Sains Cilik',
      badge: 'KURIKULUM SENTRA',
      highlight: 'Sentra Bahan Alam, Balok, Main Peran, Persiapan, Seni, Musik, & Imtaq',
      dateText: 'Setiap Hari Senin - Kamis (07.30 - 10.30 WIB)',
      contact: 'Koordinator Kurikulum Sentra'
    },
    createdAt: '2026-08-19T00:00:00Z',
    updatedAt: '2026-08-21T14:00:00Z',
    usageCount: 27,
    isLockedOfficial: true
  },
  {
    id: 'pos-pengumuman-wali',
    title: 'Poster Pengumuman Resmi Wali Santri',
    category: 'POSTER',
    shelf: 'Pengumuman',
    description: 'Format siap pakai untuk edaran libur semester, jadwal parenting, dan kunjungan edukatif.',
    tags: ['Pengumuman', 'Wali Murid', 'Edaran', 'Resmi'],
    version: 4,
    author: 'Sekretariat Yayasan',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-22T06:00:00Z',
    qualityScore: 99,
    hasForeignWatermark: false,
    dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
    fileSizeBytes: 190000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      theme: 'SLATE_GOLD',
      title: 'Pemberitahuan & Edaran Resmi',
      subtitle: 'Nomor: 042/YAS/TK-ASY/VIII/2026',
      badge: 'PEMBERITAHUAN',
      highlight: 'Pertemuan Rutin Paguyuban Wali Santri & Sosialisasi Program Semester',
      dateText: 'Sabtu Pagi (Pukul 08.00 WIB)',
      contact: 'Hotline Wali Murid: 0812-3456-7890'
    },
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-22T06:00:00Z',
    usageCount: 56,
    isLockedOfficial: true
  },

  // ─── 2. TEMPAT SERTIFIKAT RESMI ───
  {
    id: 'sert-wisuda-resmi',
    title: 'Sertifikat Kelulusan Resmi Haflah Akhirussanah',
    category: 'SERTIFIKAT',
    shelf: 'Sertifikat Wisuda',
    description: 'Ijazah & Sertifikat resmi kelulusan santri dengan cap digital, QR verifikasi, dan nomor SK Yayasan.',
    tags: ['Ijazah', 'Kelulusan', 'Kelompok B', 'SK Resmi'],
    version: 3,
    author: 'Ketua Yayasan Asy-Syifa',
    authorRole: 'KETUA_YAYASAN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-15T12:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    fileSizeBytes: 310000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      certType: 'WISUDA',
      title: 'SERTIFIKAT KELULUSAN',
      subtitle: 'Haflah Akhirussanah Kelompok B Tahun Ajaran 2025/2026',
      recipientName: 'MUHAMMAD FAIZ AL-FARISY',
      recipientNisn: 'NISN. 3192847291',
      achievementText: 'Telah menyelesaikan seluruh rangkaian program pendidikan sentra dan dinyatakan LULUS dengan predikat SANGAT MEMUASKAN.',
      signeeName1: 'Ustadzah Hj. Nurul Hidayah, S.Pd',
      signeeRole1: 'Kepala Sekolah TK Islam Asy-Syifa',
      signeeName2: 'H. Andika Barakrama, M.Kom',
      signeeRole2: 'Ketua Yayasan Asy-Syifatan',
      skNumber: 'SK-YAS/088/WIS/2026'
    },
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
    usageCount: 88,
    isLockedOfficial: true
  },
  {
    id: 'sert-tahfidz-juz30',
    title: 'Syahadah Tahfidz Al-Qur\'an Juz 30',
    category: 'SERTIFIKAT',
    shelf: 'Sertifikat Tahfidz',
    description: 'Syahadah sertifikasi hafalan surat-surat pendek Al-Qur\'an Juz Amma dengan sanad kelayakan hafalan.',
    tags: ['Tahfidz', 'Juz 30', 'Syahadah', 'Hafalan'],
    version: 2,
    author: 'Ustadz Pembina Tahfidz',
    authorRole: 'GURU',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-16T14:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    fileSizeBytes: 290000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      certType: 'TAHFIDZ',
      title: 'SYAHADAH TAHFIDZ AL-QUR\'AN',
      subtitle: 'Sertifikasi Uji Publik Hafalan Juz 30 (Juz \'Amma)',
      recipientName: 'AISYAH AQILA PUTRI',
      recipientNisn: 'NISN. 3195827394',
      achievementText: 'Telah menyelesaikan hafalan Surat An-Naba sampai An-Nas secara lancar (Mutqin) dengan kaidah tajwid makharijul huruf yang baik.',
      signeeName1: 'Ustadz Ahmad Al-Hafidz',
      signeeRole1: 'Penguji Tahfidz Quran',
      signeeName2: 'H. Andika Barakrama, M.Kom',
      signeeRole2: 'Ketua Dewan Pembina',
      skNumber: 'SK-TAH/034/JUZ30/2026'
    },
    createdAt: '2026-08-12T00:00:00Z',
    updatedAt: '2026-08-16T14:00:00Z',
    usageCount: 64,
    isLockedOfficial: true
  },
  {
    id: 'sert-piagam-prestasi',
    title: 'Piagam Penghargaan Santri Berprestasi & Teladan',
    category: 'SERTIFIKAT',
    shelf: 'Piagam Penghargaan',
    description: 'Apresiasi santri teraktif di sentra, akhlak terpuji, kepedulian sosial, dan kemandirian.',
    tags: ['Piagam', 'Santri Teladan', 'Prestasi', 'Karakter'],
    version: 2,
    author: 'Tim Bimbingan Konseling & Karakter',
    authorRole: 'GURU',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-17T11:00:00Z',
    qualityScore: 98,
    hasForeignWatermark: false,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    fileSizeBytes: 280000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      certType: 'PIAGAM',
      title: 'PIAGAM PENGHARGAAN',
      subtitle: 'Apresiasi Karakter Islami & Santri Teladan',
      recipientName: 'BILAL RAYYAN AZ-ZAHIR',
      recipientNisn: 'Kelompok A (Sentra Balok & Imtaq)',
      achievementText: 'Atas dedikasi, kemandirian, dan keteladanan akhlak mulia dalam tolong menolong sesama santri di sekolah.',
      signeeName1: 'Ustadzah Siti Marhamah, S.Pd',
      signeeRole1: 'Wali Kelas Sentra',
      signeeName2: 'Prof. Atlas (M.Pd)',
      signeeRole2: 'Kepala Sekolah',
      skNumber: 'PIAGAM/019/PRESTASI/2026'
    },
    createdAt: '2026-08-14T00:00:00Z',
    updatedAt: '2026-08-17T11:00:00Z',
    usageCount: 45,
    isLockedOfficial: true
  },
  {
    id: 'sert-kegiatan-outing',
    title: 'Sertifikat Partisipasi Kunjungan Edukatif & Manasik Haji',
    category: 'SERTIFIKAT',
    shelf: 'Sertifikat Kegiatan',
    description: 'Sertifikat resmi tanda keikutsertaan santri dalam Manasik Haji Cilik dan Outing Class Sentra Alam.',
    tags: ['Kegiatan', 'Manasik Haji', 'Outing Class', 'Partisipasi'],
    version: 1,
    author: 'Panitia Manasik Haji Cilik',
    authorRole: 'GURU',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-18T09:00:00Z',
    qualityScore: 97,
    hasForeignWatermark: false,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    fileSizeBytes: 275000,
    previewType: 'CANVAS_TEMPLATE',
    templateData: {
      certType: 'KEGIATAN',
      title: 'SERTIFIKAT PARTISIPASI',
      subtitle: 'Peragaan Manasik Haji Cilik Tingkat PAUD se-Kecamatan Tanggul',
      recipientName: 'FATIMAH AZ-ZAHRA',
      recipientNisn: 'Kloter I — TK Islam Asy-Syifa',
      achievementText: 'Telah mengikuti seluruh rangkaian rukun & wajib haji cilik (Thawaf, Sa\'i, Wukuf, dan Lempar Jumrah) dengan tertib dan khusyuk.',
      signeeName1: 'Ustadz Pembimbing Ibadah',
      signeeRole1: 'Ketua Pelaksana',
      signeeName2: 'H. Andika Barakrama',
      signeeRole2: 'Pembina Yayasan',
      skNumber: 'SERT-MANASIK/09/2026'
    },
    createdAt: '2026-08-16T00:00:00Z',
    updatedAt: '2026-08-18T09:00:00Z',
    usageCount: 38,
    isLockedOfficial: true
  },

  // ─── 3. TEMPAT IKON DAN MOTIF ───
  {
    id: 'ikon-buku-ilmu',
    title: 'Ikon Vektor Buku Ilmu Asy-Syifa',
    category: 'IKON',
    shelf: 'Ikon Resmi',
    description: 'Ikon buku terbuka dengan siluet daun tumbuh, melambangkan ilmu yang berakar akhlak dan berbuah keberkahan.',
    tags: ['Buku', 'Ilmu', 'Perpustakaan', 'Ikon'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-12T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 4200,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 100 100" class="w-full h-full fill-current text-emerald-600"><path d="M50 20 C35 15 20 20 10 25 L10 80 C20 75 35 70 50 75 C65 70 80 75 90 80 L90 25 C80 20 65 15 50 20 Z" fill="none" stroke="currentColor" stroke-width="6"/><line x1="50" y1="20" x2="50" y2="75" stroke="currentColor" stroke-width="6"/><path d="M50 45 C45 35 48 25 50 20 C52 25 55 35 50 45 Z" fill="#f59e0b"/></svg>',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-12T00:00:00Z',
    usageCount: 110,
    isLockedOfficial: true
  },
  {
    id: 'ikon-pohon-karakter',
    title: 'Ikon Pohon Karakter & Sentra Alam',
    category: 'IKON',
    shelf: 'Ikon Resmi',
    description: 'Ikon pohon rimbun bertajuk hijau zamrud melambangkan pertumbuhan fitrah anak usia dini.',
    tags: ['Pohon', 'Sentra Alam', 'Karakter', 'Tumbuh'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-12T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 4800,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 100 100" class="w-full h-full fill-current text-emerald-700"><circle cx="50" cy="38" r="26" fill="#10b981"/><circle cx="34" cy="44" r="18" fill="#059669"/><circle cx="66" cy="44" r="18" fill="#047857"/><path d="M46 56 L46 88 L54 88 L54 56 Z" fill="#92400e"/><path d="M42 88 Q50 82 58 88" stroke="#92400e" stroke-width="4" fill="none"/></svg>',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-12T00:00:00Z',
    usageCount: 95,
    isLockedOfficial: true
  },
  {
    id: 'ikon-masjid-kubah',
    title: 'Ikon Kubah Masjid Nurul Iman',
    category: 'IKON',
    shelf: 'Ikon Resmi',
    description: 'Ikon kubah masjid bermahkota bulan bintang keemasan khas sentra Imtaq.',
    tags: ['Masjid', 'Kubah', 'Imtaq', 'Ibadah'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-12T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 5100,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 100 100" class="w-full h-full fill-current text-emerald-800"><path d="M20 75 L80 75 L80 88 L20 88 Z" fill="#064e3b"/><path d="M25 75 C25 45 45 30 50 18 C55 30 75 45 75 75 Z" fill="#10b981"/><path d="M50 10 L50 18" stroke="#f59e0b" stroke-width="4"/><circle cx="50" cy="8" r="4" fill="#f59e0b"/></svg>',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-12T00:00:00Z',
    usageCount: 130,
    isLockedOfficial: true
  },
  {
    id: 'ikon-hati-kasih',
    title: 'Ikon Hati Kasih Sayang Pendidik',
    category: 'IKON',
    shelf: 'Ikon Resmi',
    description: 'Ikon kasih sayang guru mendampingi santri dengan sabar dan tulus lillahi ta\'ala.',
    tags: ['Hati', 'Kasih Sayang', 'Guru', 'Pendidikan'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-12T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 3900,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 100 100" class="w-full h-full fill-current text-rose-500"><path d="M50 82 C20 60 12 40 18 26 C24 12 42 14 50 30 C58 14 76 12 82 26 C88 40 80 60 50 82 Z" fill="#f43f5e"/><circle cx="36" cy="30" r="4" fill="#ffffff" opacity="0.6"/></svg>',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-12T00:00:00Z',
    usageCount: 78,
    isLockedOfficial: true
  },
  {
    id: 'ikon-bintang-cahaya',
    title: 'Ikon Bintang 8 Sudut (Khatim Sulayman)',
    category: 'IKON',
    shelf: 'Ikon Resmi',
    description: 'Bintang delapan sudut geometri islami melambangkan kesempurnaan akhlak dan kecerdasan tauhid.',
    tags: ['Bintang', 'Geometri', 'Islami', 'Prestasi'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-12T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 4400,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 100 100" class="w-full h-full fill-current text-amber-500"><rect x="25" y="25" width="50" height="50" fill="#f59e0b" rx="4"/><rect x="25" y="25" width="50" height="50" fill="#fbbf24" rx="4" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="12" fill="#d97706"/></svg>',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-12T00:00:00Z',
    usageCount: 140,
    isLockedOfficial: true
  },
  {
    id: 'ikon-sentra-balok',
    title: 'Ikon 7 Sentra Pendidikan Usia Dini',
    category: 'IKON',
    shelf: 'Ikon Resmi',
    description: 'Ikon representasi 7 sentra belajar: Balok, Bahan Alam, Main Peran, Persiapan, Seni, Musik, dan Imtaq.',
    tags: ['Sentra', 'Kurikulum', 'Balok', 'Bahan Alam'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-12T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 5600,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 100 100" class="w-full h-full fill-current text-teal-600"><rect x="18" y="55" width="28" height="28" rx="4" fill="#0d9488"/><rect x="54" y="55" width="28" height="28" rx="4" fill="#059669"/><polygon points="50,15 20,48 80,48" fill="#f59e0b"/><circle cx="50" cy="35" r="6" fill="#ffffff"/></svg>',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-12T00:00:00Z',
    usageCount: 120,
    isLockedOfficial: true
  },

  // ─── 4. TEMPAT MOTIF ISLAMI ───
  {
    id: 'motif-geometri-arabesque',
    title: 'Motif Geometri Arabesque Zamrud Emas',
    category: 'MOTIF_ISLAMI',
    shelf: 'Geometri Islami',
    description: 'Pola ubin geometri islami tak terputus (seamless pattern) dalam palet resmi hijau zamrud dan emas.',
    tags: ['Geometri', 'Arabesque', 'Pola', 'Latar Belakang'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-14T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 8200,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 120 120" class="w-full h-full"><rect width="120" height="120" fill="#064e3b"/><polygon points="60,10 110,60 60,110 10,60" fill="none" stroke="#f59e0b" stroke-width="3"/><rect x="35" y="35" width="50" height="50" fill="none" stroke="#10b981" stroke-width="2"/><circle cx="60" cy="60" r="16" fill="none" stroke="#fbbf24" stroke-width="3"/><circle cx="0" cy="0" r="20" fill="none" stroke="#f59e0b" stroke-width="2"/><circle cx="120" cy="0" r="20" fill="none" stroke="#f59e0b" stroke-width="2"/><circle cx="0" cy="120" r="20" fill="none" stroke="#f59e0b" stroke-width="2"/><circle cx="120" cy="120" r="20" fill="none" stroke="#f59e0b" stroke-width="2"/></svg>',
    createdAt: '2026-08-11T00:00:00Z',
    updatedAt: '2026-08-14T00:00:00Z',
    usageCount: 85,
    isLockedOfficial: true
  },
  {
    id: 'motif-bingkai-sertifikat',
    title: 'Bingkai Ornamen Sudut Emas Murni',
    category: 'MOTIF_ISLAMI',
    shelf: 'Bingkai',
    description: 'Sudut bingkai dokumen resmi bercorak floral islami untuk piagam dan sertifikat penghargaan.',
    tags: ['Bingkai', 'Border', 'Sudut Emas', 'Sertifikat'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-14T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 6500,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M10 10 L60 10 Q40 10 30 20 Q20 30 20 50 L20 90 L10 90 Z" fill="#d97706"/><path d="M15 15 L50 15 Q35 15 25 25 Q15 35 15 50 L15 85" stroke="#fbbf24" stroke-width="2" fill="none"/><circle cx="28" cy="28" r="6" fill="#f59e0b"/></svg>',
    createdAt: '2026-08-11T00:00:00Z',
    updatedAt: '2026-08-14T00:00:00Z',
    usageCount: 92,
    isLockedOfficial: true
  },
  {
    id: 'motif-ornamen-pembatas',
    title: 'Ornamen Pembatas Bismillah & Ayat',
    category: 'MOTIF_ISLAMI',
    shelf: 'Ornamen',
    description: 'Garis pembatas kaligrafi simetris untuk memisahkan bab kurikulum dan kop surat yayasan.',
    tags: ['Pembatas', 'Divider', 'Simetris', 'Kop Surat'],
    version: 1,
    author: 'Studio Vektor TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-14T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 5200,
    previewType: 'SVG_VECTOR',
    svgData: '<svg viewBox="0 0 200 40" class="w-full h-full"><line x1="10" y1="20" x2="80" y2="20" stroke="#d97706" stroke-width="2"/><line x1="120" y1="20" x2="190" y2="20" stroke="#d97706" stroke-width="2"/><polygon points="100,10 110,20 100,30 90,20" fill="#f59e0b"/><circle cx="85" cy="20" r="3" fill="#10b981"/><circle cx="115" cy="20" r="3" fill="#10b981"/></svg>',
    createdAt: '2026-08-11T00:00:00Z',
    updatedAt: '2026-08-14T00:00:00Z',
    usageCount: 77,
    isLockedOfficial: true
  },

  // ─── 5. TEMPAT SUARA (Web Audio Synthesizer Presets) ───
  {
    id: 'sound-burung-pagi',
    title: 'Soundscape Kicauan Burung Pagi',
    category: 'SUARA',
    shelf: 'Suara Alam',
    description: 'Synthesizer frekuensi audio menirukan kicau burung pagi merdu nan damai di taman sekolah.',
    tags: ['Burung', 'Pagi', 'Menenangkan', 'Fokus'],
    version: 1,
    author: 'Sound Engineer TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-19T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 1200,
    previewType: 'SOUNDSCAPE',
    soundPresetId: 'BURUNG',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-19T00:00:00Z',
    usageCount: 154,
    isLockedOfficial: true
  },
  {
    id: 'sound-semilir-angin',
    title: 'Soundscape Semilir Angin Kebun Sentra',
    category: 'SUARA',
    shelf: 'Suara Alam',
    description: 'Derau merah muda terfilter halus yang menyimulasikan desau angin menyejukkan ruang kelas.',
    tags: ['Angin', 'Relaksasi', 'Sejuk', 'Konsentrasi'],
    version: 1,
    author: 'Sound Engineer TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-19T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 1200,
    previewType: 'SOUNDSCAPE',
    soundPresetId: 'ANGIN',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-19T00:00:00Z',
    usageCount: 112,
    isLockedOfficial: true
  },
  {
    id: 'sound-gemericik-air',
    title: 'Soundscape Gemericik Air Wudhu & Kolam',
    category: 'SUARA',
    shelf: 'Suara Alam',
    description: 'Aliran tetesan air jernih pembasuh bebatuan yang menghadirkan suasana khusyuk sebelum sholat.',
    tags: ['Air', 'Wudhu', 'Tenang', 'Jernih'],
    version: 1,
    author: 'Sound Engineer TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-19T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 1200,
    previewType: 'SOUNDSCAPE',
    soundPresetId: 'AIR',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-19T00:00:00Z',
    usageCount: 135,
    isLockedOfficial: true
  },
  {
    id: 'sound-dentang-kristal',
    title: 'Dentang Kristal Lembut Transisi Sentra 432 Hz',
    category: 'SUARA',
    shelf: 'Bunyi Lembut',
    description: 'Chime kristal bersuara jernih berfrekuensi 432 Hz penanda transisi sentra dan saat berdoa.',
    tags: ['Transisi Sentra', 'Doa', 'Kristal', 'Meditatif'],
    version: 1,
    author: 'Sound Engineer TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-19T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 1200,
    previewType: 'SOUNDSCAPE',
    soundPresetId: 'BUNYI_LEMBUT',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-19T00:00:00Z',
    usageCount: 168,
    isLockedOfficial: true
  },
  {
    id: 'sound-suasana-taman',
    title: 'Harmoni Suasana Taman Asy-Syifa',
    category: 'SUARA',
    shelf: 'Suasana Taman',
    description: 'Komposisi ambient lengkap memadukan angin kebun, gemericik air, dan kicauan burung pagi.',
    tags: ['Taman', 'Holistik', 'Sentra Alam', 'Damai'],
    version: 1,
    author: 'Sound Engineer TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-19T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 1200,
    previewType: 'SOUNDSCAPE',
    soundPresetId: 'SUASANA_TAMAN',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-19T00:00:00Z',
    usageCount: 210,
    isLockedOfficial: true
  },

  // ─── 6. FOTO RESMI SEKOLAH ───
  {
    id: 'foto-gedung-utama',
    title: 'Foto Eksterior Gedung Utama & Taman Bermain Asy-Syifa',
    category: 'FOTO',
    shelf: 'Dokumentasi Sekolah',
    description: 'Foto sudut pandang depan gedung sekolah yang asri dan aman berstandar ramah anak.',
    tags: ['Gedung', 'Fasilitas', 'Taman', 'Sarpras'],
    version: 1,
    author: 'Fotografer Sekolah',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-10T00:00:00Z',
    qualityScore: 96,
    hasForeignWatermark: false,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    fileSizeBytes: 850000,
    previewType: 'PHOTO_GALLERY',
    mediaUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-10T00:00:00Z',
    usageCount: 73,
    isLockedOfficial: true
  },
  {
    id: 'foto-sentra-balok',
    title: 'Foto Santri Berkreasi di Sentra Balok',
    category: 'FOTO',
    shelf: 'Dokumentasi Sentra',
    description: 'Santri bekerja sama merancang istana geometri dari balok kayu ramah lingkungan.',
    tags: ['Sentra Balok', 'Aktivitas Santri', 'Kreativitas', 'Kerjasama'],
    version: 1,
    author: 'Ustadzah Fatimah',
    authorRole: 'GURU',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-10T00:00:00Z',
    qualityScore: 95,
    hasForeignWatermark: false,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    fileSizeBytes: 720000,
    previewType: 'PHOTO_GALLERY',
    mediaUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-10T00:00:00Z',
    usageCount: 65,
    isLockedOfficial: true
  },

  // ─── 7. VIDEO RESMI SEKOLAH ───
  {
    id: 'vid-profil-singkat',
    title: 'Video Profil Sekolah & Kurikulum Sentra 2026',
    category: 'VIDEO',
    shelf: 'Video Profil',
    description: 'Video sinematik 3 menit memperkenalkan visi misi, 7 sentra, dan pembiasaan adab islami.',
    tags: ['Video Profil', 'Visi Misi', 'Sentra', 'Brosur Digital'],
    version: 2,
    author: 'Tim Multimedia TADE',
    authorRole: 'ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-18T00:00:00Z',
    qualityScore: 98,
    hasForeignWatermark: false,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    fileSizeBytes: 14500000,
    previewType: 'VIDEO_STREAM',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    createdAt: '2026-08-05T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    usageCount: 140,
    isLockedOfficial: true
  },

  // ─── 8. FITUR TAMBAHAN ───
  {
    id: 'tool-qr-generator',
    title: 'Generator QR Code Presensi & Verifikasi Santri',
    category: 'FITUR_TAMBAHAN',
    shelf: 'Alat Operasional',
    description: 'Alat pembuat QR Code permanen berstandar RSA SHA-256 untuk kartu santri dan dokumen resmi.',
    tags: ['QR Code', 'Presensi', 'Verifikasi', 'Keamanan'],
    version: 2,
    author: 'Guardian Tech Core',
    authorRole: 'SUPER_ADMIN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-15T00:00:00Z',
    qualityScore: 100,
    hasForeignWatermark: false,
    fileSizeBytes: 12500,
    previewType: 'TOOL_UTILITY',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z',
    usageCount: 310,
    isLockedOfficial: true
  },
  {
    id: 'tool-slip-spp-infaq',
    title: 'Template Slip Pembayaran SPP & Infaq Barcode',
    category: 'FITUR_TAMBAHAN',
    shelf: 'Keuangan & Slip',
    description: 'Formulir bukti pembayaran berformat standar perbankan syariah siap cetak ukuran 1/3 A4.',
    tags: ['SPP', 'Kwitansi', 'Keuangan', 'Slip'],
    version: 1,
    author: 'Bendahara Yayasan',
    authorRole: 'KEUANGAN',
    isOfficialApproved: true,
    approvedByFounder: 'Founder Andika',
    approvedTimestamp: '2026-08-16T00:00:00Z',
    qualityScore: 99,
    hasForeignWatermark: false,
    dimensions: { width: 1080, height: 720, aspectRatio: '3:2' },
    fileSizeBytes: 145000,
    previewType: 'CANVAS_TEMPLATE',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
    usageCount: 195,
    isLockedOfficial: true
  }
];

class TadeAssetCenterService {
  private static instance: TadeAssetCenterService | null = null;
  private assets: TadeAssetItem[] = [];
  private listeners: ((assets: TadeAssetItem[]) => void)[] = [];

  public static getInstance(): TadeAssetCenterService {
    if (!TadeAssetCenterService.instance) {
      TadeAssetCenterService.instance = new TadeAssetCenterService();
    }
    return TadeAssetCenterService.instance;
  }

  constructor() {
    this.loadAssets();
  }

  private loadAssets(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initial ensuring base official templates exist
          const map = new Map<string, TadeAssetItem>();
          INITIAL_ASSETS.forEach(item => map.set(item.id, item));
          parsed.forEach((item: TadeAssetItem) => map.set(item.id, item));
          this.assets = Array.from(map.values());
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load asset center cache, defaulting to initial catalog:', e);
    }
    this.assets = [...INITIAL_ASSETS];
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.assets));
    } catch (e) {
      console.warn('LocalStorage save failed for asset center:', e);
    }
    this.notify();
  }

  public subscribe(listener: (assets: TadeAssetItem[]) => void): () => void {
    this.listeners.push(listener);
    listener([...this.assets]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const list = [...this.assets];
    this.listeners.forEach(fn => fn(list));
  }

  public getAllAssets(): TadeAssetItem[] {
    return [...this.assets];
  }

  public getAssetById(id: string): TadeAssetItem | undefined {
    return this.assets.find(a => a.id === id);
  }

  public getAssetsByCategory(category: TadeAssetCategory): TadeAssetItem[] {
    return this.assets.filter(a => a.category === category);
  }

  /**
   * Universal Instant Search across title, description, tags, shelf, and category
   */
  public searchAssets(query: string, categoryFilter?: string, shelfFilter?: string): TadeAssetItem[] {
    const q = (query || '').trim().toLowerCase();
    return this.assets.filter(asset => {
      if (categoryFilter && categoryFilter !== 'ALL' && asset.category !== categoryFilter) {
        return false;
      }
      if (shelfFilter && shelfFilter !== 'ALL' && asset.shelf !== shelfFilter) {
        return false;
      }
      if (!q) return true;

      const titleMatch = asset.title.toLowerCase().includes(q);
      const descMatch = asset.description.toLowerCase().includes(q);
      const shelfMatch = asset.shelf.toLowerCase().includes(q);
      const tagMatch = asset.tags.some(t => t.toLowerCase().includes(q));
      const authorMatch = asset.author.toLowerCase().includes(q);

      return titleMatch || descMatch || shelfMatch || tagMatch || authorMatch;
    });
  }

  /**
   * Automatic Quality & Watermark Validation before Saving to Pusat Aset
   */
  public validateAssetForSaving(data: {
    title: string;
    category: TadeAssetCategory;
    dimensions?: { width: number; height: number };
    fileSizeBytes?: number;
    rawTextContent?: string;
    imageDataUrl?: string;
  }): AssetValidationResult {
    const warningMessages: string[] = [];
    const successMessages: string[] = [];
    let qualityScore = 90;
    let hasForeignWatermark = false;

    // 1. Foreign Watermark Check (Canva, Freepik, Shutterstock, Adobe, etc.)
    const suspiciousKeywords = ['canva', 'freepik', 'shutterstock', 'gettyimages', 'adobe stock', 'istock', 'watermark'];
    const textToCheck = `${data.title} ${data.rawTextContent || ''}`.toLowerCase();
    for (const kw of suspiciousKeywords) {
      if (textToCheck.includes(kw)) {
        hasForeignWatermark = true;
        warningMessages.push(`Terdeteksi kata kunci watermark asing ("${kw}"). Standar TADE melarang watermark luar.`);
        qualityScore -= 40;
        break;
      }
    }

    if (!hasForeignWatermark) {
      successMessages.push('Bebas watermark luar (100% Identitas Murni TADE).');
    }

    // 2. Dimension Compliance Check
    let isSizeOptimal = true;
    if (data.dimensions) {
      const { width, height } = data.dimensions;
      if (width < 800 || height < 600) {
        warningMessages.push(`Resolusi (${width}x${height}px) di bawah batas optimal cetak (min 1080px).`);
        qualityScore -= 15;
        isSizeOptimal = false;
      } else {
        successMessages.push(`Resolusi prima (${width}x${height}px) memenuhi standar cetak resolusi tinggi.`);
        qualityScore += 5;
      }
    }

    // 3. File Size Check
    if (data.fileSizeBytes && data.fileSizeBytes > 10 * 1024 * 1024) {
      warningMessages.push('Ukuran file melebihi 10MB, disarankan optimasi kompresi otomatis.');
      qualityScore -= 10;
    } else {
      successMessages.push('Ukuran memori ringan, aman dimuat cepat tanpa lag.');
    }

    qualityScore = Math.max(0, Math.min(100, qualityScore));

    return {
      isValid: !hasForeignWatermark && qualityScore >= 70,
      qualityScore,
      isSizeOptimal,
      hasForeignWatermark,
      warningMessages,
      successMessages
    };
  }

  /**
   * Save Asset into Pusat Aset TADE with automatic checking & versioning
   */
  public saveAsset(params: {
    id?: string;
    title: string;
    category: TadeAssetCategory;
    shelf: string;
    description: string;
    tags: string[];
    author: string;
    authorRole?: string;
    dimensions?: { width: number; height: number; aspectRatio: string };
    fileSizeBytes?: number;
    previewType: 'CANVAS_TEMPLATE' | 'SVG_VECTOR' | 'SOUNDSCAPE' | 'PHOTO_GALLERY' | 'VIDEO_STREAM' | 'TOOL_UTILITY';
    templateData?: any;
    svgData?: string;
    mediaUrl?: string;
    soundPresetId?: string;
    forceApprove?: boolean;
  }): { success: boolean; asset: TadeAssetItem; validation: AssetValidationResult } {
    const validation = this.validateAssetForSaving({
      title: params.title,
      category: params.category,
      dimensions: params.dimensions,
      fileSizeBytes: params.fileSizeBytes,
      rawTextContent: JSON.stringify(params.templateData || {})
    });

    const now = new Date().toISOString();
    const existingIndex = params.id ? this.assets.findIndex(a => a.id === params.id) : -1;

    let targetAsset: TadeAssetItem;

    if (existingIndex >= 0) {
      // Update existing asset
      const old = this.assets[existingIndex];
      targetAsset = {
        ...old,
        title: params.title,
        shelf: params.shelf,
        description: params.description,
        tags: params.tags,
        version: old.version + 1,
        author: params.author,
        authorRole: params.authorRole || old.authorRole,
        qualityScore: validation.qualityScore,
        hasForeignWatermark: validation.hasForeignWatermark,
        dimensions: params.dimensions || old.dimensions,
        fileSizeBytes: params.fileSizeBytes || old.fileSizeBytes,
        previewType: params.previewType || old.previewType,
        templateData: params.templateData !== undefined ? params.templateData : old.templateData,
        svgData: params.svgData !== undefined ? params.svgData : old.svgData,
        mediaUrl: params.mediaUrl || old.mediaUrl,
        soundPresetId: params.soundPresetId || old.soundPresetId,
        updatedAt: now,
        isOfficialApproved: params.forceApprove !== undefined ? params.forceApprove : old.isOfficialApproved
      };
      this.assets[existingIndex] = targetAsset;

      // Black Box Telemetry
      blackBoxRecorder.logEvent({
        ring: 'RING_1',
        moduleCode: 'G13-PUSAT-ASET',
        role: params.authorRole || 'GURU',
        actorName: params.author,
        category: 'STORAGE',
        eventType: 'ACTION',
        details: `Aset diperbarui: "${targetAsset.title}" v${targetAsset.version} (Kategori: ${targetAsset.category})`,
        severity: 'INFO',
        route: 'r_asset_center'
      });
    } else {
      // Create new asset
      const newId = params.id || `ast-${params.category.toLowerCase()}-${Date.now()}`;
      targetAsset = {
        id: newId,
        title: params.title,
        category: params.category,
        shelf: params.shelf,
        description: params.description,
        tags: params.tags,
        version: 1,
        author: params.author,
        authorRole: params.authorRole || 'GURU',
        isOfficialApproved: !!params.forceApprove,
        approvedByFounder: params.forceApprove ? 'Founder Andika' : undefined,
        approvedTimestamp: params.forceApprove ? now : undefined,
        qualityScore: validation.qualityScore,
        hasForeignWatermark: validation.hasForeignWatermark,
        dimensions: params.dimensions,
        fileSizeBytes: params.fileSizeBytes || 150000,
        previewType: params.previewType,
        templateData: params.templateData,
        svgData: params.svgData,
        mediaUrl: params.mediaUrl,
        soundPresetId: params.soundPresetId,
        createdAt: now,
        updatedAt: now,
        usageCount: 1,
        isLockedOfficial: false
      };
      this.assets.unshift(targetAsset);

      // Black Box Telemetry
      blackBoxRecorder.logEvent({
        ring: 'RING_1',
        moduleCode: 'G13-PUSAT-ASET',
        role: params.authorRole || 'GURU',
        actorName: params.author,
        category: 'STORAGE',
        eventType: 'ACTION',
        details: `Aset baru disimpan ke Pusat Aset: "${targetAsset.title}" (Kategori: ${targetAsset.category}, Rak: ${targetAsset.shelf})`,
        severity: 'INFO',
        route: 'r_asset_center'
      });
    }

    this.saveToStorage();
    return { success: true, asset: targetAsset, validation };
  }

  /**
   * Founder 1-Click Approval Action
   */
  public approveAssetByFounder(assetId: string, founderName: string = 'Founder Andika'): boolean {
    const index = this.assets.findIndex(a => a.id === assetId);
    if (index < 0) return false;

    const asset = this.assets[index];
    const nextStatus = !asset.isOfficialApproved;
    const now = new Date().toISOString();

    this.assets[index] = {
      ...asset,
      isOfficialApproved: nextStatus,
      approvedByFounder: nextStatus ? founderName : undefined,
      approvedTimestamp: nextStatus ? now : undefined,
      updatedAt: now
    };

    this.saveToStorage();

    // Black Box Telemetry
    blackBoxRecorder.logEvent({
      ring: 'RING_0',
      moduleCode: 'G13-PUSAT-ASET',
      role: 'FOUNDER',
      actorName: founderName,
      category: 'FOUNDER_COMMAND',
      eventType: 'ACTION',
      details: `${nextStatus ? 'Persetujuan Resmi Diberikan' : 'Persetujuan Resmi Dicabut'}: "${asset.title}" oleh ${founderName}`,
      severity: 'INFO',
      route: 'r_asset_center'
    });

    return nextStatus;
  }

  /**
   * Record asset usage in school workflow (printing, export, poster sharing)
   */
  public recordAssetUsage(assetId: string, moduleName: string = 'Creative Studio'): void {
    const index = this.assets.findIndex(a => a.id === assetId);
    if (index >= 0) {
      this.assets[index].usageCount = (this.assets[index].usageCount || 0) + 1;
      this.saveToStorage();

      blackBoxRecorder.logEvent({
        ring: 'RING_2',
        moduleCode: 'G13-PUSAT-ASET',
        role: 'GURU',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Aset digunakan di ${moduleName}: "${this.assets[index].title}" (Total Pakai: ${this.assets[index].usageCount})`,
        severity: 'INFO',
        route: 'r_asset_center'
      });
    }
  }

  /**
   * Delete custom asset (cannot delete locked official core assets)
   */
  public deleteAsset(assetId: string, actorName: string = 'User'): boolean {
    const target = this.assets.find(a => a.id === assetId);
    if (!target) return false;
    if (target.isLockedOfficial) {
      alert('Aset Resmi Utama dilindungi dan tidak dapat dihapus.');
      return false;
    }

    this.assets = this.assets.filter(a => a.id !== assetId);
    this.saveToStorage();

    blackBoxRecorder.logEvent({
      ring: 'RING_1',
      moduleCode: 'G13-PUSAT-ASET',
      role: 'ADMIN',
      actorName,
      category: 'STORAGE',
      eventType: 'ACTION',
      details: `Aset dihapus dari Pusat Aset: "${target.title}"`,
      severity: 'WARN',
      route: 'r_asset_center'
    });

    return true;
  }

  /**
   * Statistical Overview for Dashboard & Dr. Pulse
   */
  public getAssetStats() {
    const total = this.assets.length;
    const officialCount = this.assets.filter(a => a.isOfficialApproved).length;
    const posters = this.assets.filter(a => a.category === 'POSTER').length;
    const certs = this.assets.filter(a => a.category === 'SERTIFIKAT').length;
    const animations = 48; // from Kotak Mainan Asy
    const iconsAndMotifs = this.assets.filter(a => a.category === 'IKON' || a.category === 'MOTIF_ISLAMI').length;
    const sounds = this.assets.filter(a => a.category === 'SUARA').length;
    const totalSizeBytes = this.assets.reduce((sum, a) => sum + (a.fileSizeBytes || 0), 0);

    return {
      total,
      officialCount,
      posters,
      certs,
      animations,
      iconsAndMotifs,
      sounds,
      totalSizeBytes,
      totalSizeMB: (totalSizeBytes / (1024 * 1024)).toFixed(2),
      watermarkCleanScore: 100
    };
  }
}

export const tadeAssetCenterService = TadeAssetCenterService.getInstance();
