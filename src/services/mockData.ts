import {
  SchoolProfile,
  ArticleCMS,
  MediaItem,
  PPDBRecord,
  Student,
  Teacher,
  PresensiRecord,
  PresensiGuruRecord,
  EraporRecord,
  AnecdotRecord,
  SPPBill,
  BookConnection,
  TahfidzProgress,
  KMSHealthRecord,
  ScheduleEvent,
  InventoryItem,
  CateringMenu,
  TransportRoute,
  AuditLog
} from '../types';

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  name: 'TK ASY SYIFA TANGGUL',
  npsn: '20567812',
  akreditasi: 'A (UNGGUL)',
  address: 'Jl. Raya Tanggul No. 88, Desa Tanggul Barat',
  village: 'Tanggul Barat',
  district: 'Tanggul',
  city: 'Jember',
  province: 'Jawa Timur',
  postalCode: '68155',
  phone: '(0336) 441-239',
  email: 'info@tkasysyifa-tanggul.sch.id',
  whatsapp: '081234567890',
  kepalaSekolah: 'Hj. Nurul Aini, S.Pd.AUD',
  mapsUrl: 'https://maps.google.com/?q=TK+Asy+Syifa+Tanggul+Jember',
  vision: 'Mewujudkan Generasi Muslim PAUD/TK yang Berkarakter Islami, Cerdas, Kreatif, Berakhlak Mulia, dan Siap Memimpin Masa Depan.',
  missions: [
    'Menyelenggarakan Pendidikan Anak Dini Berbasis Karakter & Nilai-Nilai Islam',
    'Mengembangkan Potensi Unik Anak Melalui Kurikulum Merdeka PAUD',
    'Membiasakan Hafalan Surah Pendek, Doa Harian, dan Adab Sehari-hari',
    'Menjalin Kemitraan Harmonis dengan Orang Tua dan Masyarakat'
  ],
  coreValues: [
    'Islami & Qurani',
    'Cerdas & Kreatif',
    'Mandiri & Santun',
    'Cinta Lingkungan'
  ],
  stats: {
    totalStudents: 142,
    totalTeachers: 14,
    totalClasses: 6,
    accreditationScore: 96,
    alumniCount: 1850
  }
};

export const INITIAL_ARTICLES: ArticleCMS[] = [
  {
    id: 'art-1',
    title: 'Peringatan Hari Kartini & Pagi Ceria dengan Pakaian Adat Nusantara',
    slug: 'peringatan-hari-kartini-2026',
    body: 'Kegiatan spesial Pagi Ceria TK Asy Syifa Tanggul diisi dengan pawai pakaian adat nusantara oleh para siswa Kelompok A dan Kelompok B. Anak-anak tampil penuh rasa percaya diri dan antusias.',
    category: 'Kegiatan',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    author: 'Siti Maimunah, S.Pd',
    date: '2026-04-21',
    isPublished: true,
    tags: ['Kegiatan', 'Kartini', 'Pendidikan Karakter']
  },
  {
    id: 'art-2',
    title: 'Pendaftaran PPDB TK Asy Syifa Tanggul Tahun Ajaran 2026/2027 Resmi Dibuka',
    slug: 'ppdb-2026-2027-dibuka',
    body: 'TK Asy Syifa Tanggul kembali membuka penerimaan siswa baru untuk Kelompok A, Kelompok B, dan Kelas PAUD. Dapatkan potongan infaq gedung khusus pendaftaran Gelombang 1.',
    category: 'Pengumuman',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    author: 'Panitia PPDB',
    date: '2026-05-01',
    isPublished: true,
    tags: ['PPDB', 'Pendaftaran', 'Gelombang 1']
  },
  {
    id: 'art-3',
    title: 'Market Day Cilik: Melatih Jiwa Kewirausahaan & Kemandirian Sejak Dini',
    slug: 'market-day-cilik-2026',
    body: 'Anak-anak belajar bertransaksi, menghitung uang koin edukasi, dan menjual makanan sehat hasil karya bersama orang tua di halaman sekolah.',
    category: 'Edukasi',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    author: 'Dewi Rahmawati, S.Pd',
    date: '2026-05-15',
    isPublished: true,
    tags: ['Market Day', 'Kreativitas', 'STEAM']
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    title: 'Kegiatan Latihan Manasik Haji Anak Sholeh',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    type: 'gallery',
    category: 'Manasik',
    description: 'Dokumentasi simulasi ibadah haji anak di Mini Kaaba Tanggul.',
    isPublished: true,
    dateAdded: '2026-05-10'
  },
  {
    id: 'med-2',
    title: 'Profil & Video Virtual Tour TK Asy Syifa Tanggul',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    category: 'Virtual Tour',
    description: 'Video tur lengkap lingkungan sekolah, ruang indoor APE, dan kebun sekolah.',
    isPublished: true,
    dateAdded: '2026-04-12'
  },
  {
    id: 'med-3',
    title: 'Brosur Informasi & Panduan PPDB 2026/2027 (PDF)',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'document',
    category: 'Brosur',
    description: 'Dokumen panduan lengkap persyarataan dan biaya sekolah.',
    isPublished: true,
    dateAdded: '2026-05-02'
  }
];

export const INITIAL_PPDB: PPDBRecord[] = [
  {
    id: 'ppdb-101',
    registrationNo: 'PPDB-2026-001',
    studentName: 'Muhammad Rayyan Al-Fatih',
    nik: '3509120405210001',
    nickname: 'Rayyan',
    birthPlace: 'Jember',
    birthDate: '2021-05-12',
    gender: 'Laki-laki',
    religion: 'Islam',
    address: 'Jl. Merdeka No. 12, Tanggul Barat',
    distanceKm: 0.8,
    groupChoice: 'Kelompok A',
    fatherName: 'Ahmad Faisal',
    fatherJob: 'Wiraswasta',
    motherName: 'Siti Aminah',
    motherJob: 'Ibu Rumah Tangga',
    phone: '081234567891',
    status: 'Diterima',
    registeredAt: '2026-05-02',
    wave: 'Gelombang 1',
    isPaidFee: true,
    notes: 'Sudah melunasi seragam dan formulir.'
  },
  {
    id: 'ppdb-102',
    registrationNo: 'PPDB-2026-002',
    studentName: 'Aisyah Humaira Azzahra',
    nik: '3509121108210002',
    nickname: 'Aisyah',
    birthPlace: 'Jember',
    birthDate: '2021-08-15',
    gender: 'Perempuan',
    religion: 'Islam',
    address: 'Dusun Krajan RT 02 RW 05, Tanggul Timur',
    distanceKm: 1.5,
    groupChoice: 'Kelompok A',
    fatherName: 'Budi Santoso',
    fatherJob: 'PNS',
    motherName: 'Dewi Lestari',
    motherJob: 'Guru',
    phone: '082345678902',
    status: 'Verifikasi',
    registeredAt: '2026-05-05',
    wave: 'Gelombang 1',
    isPaidFee: false,
    notes: 'Menunggu penyerahan akta kelahiran.'
  },
  {
    id: 'ppdb-103',
    registrationNo: 'PPDB-2026-003',
    studentName: 'Kenzo Omar Abdullah',
    nik: '3509120303220003',
    nickname: 'Kenzo',
    birthPlace: 'Jember',
    birthDate: '2022-03-03',
    gender: 'Laki-laki',
    religion: 'Islam',
    address: 'Jl. Mawar No. 45, Tanggul',
    distanceKm: 2.1,
    groupChoice: 'PAUD/TPA',
    fatherName: 'Rian Pratama',
    fatherJob: 'Karyawan Swasta',
    motherName: 'Nadia Putri',
    motherJob: 'Apoteker',
    phone: '085678901234',
    status: 'Menunggu',
    registeredAt: '2026-05-18',
    wave: 'Gelombang 2',
    isPaidFee: false
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-01',
    nis: '2025001',
    nisn: '0182736411',
    name: 'Ahmad Hafizh Zaidan',
    nickname: 'Zaidan',
    gender: 'L',
    classGroup: 'Kelompok B1',
    birthDate: '2020-04-10',
    parentName: 'H. Lukman Hakim',
    parentPhone: '081299887766',
    parentEmail: 'lukman@gmail.com',
    address: 'Jl. KH. Agus Salim No. 10, Tanggul Barat',
    status: 'Aktif',
    joinedYear: 2024
  },
  {
    id: 'std-02',
    nis: '2025002',
    nisn: '0182736412',
    name: 'Anisa Kirana Putri',
    nickname: 'Kirana',
    gender: 'P',
    classGroup: 'Kelompok B1',
    birthDate: '2020-06-18',
    parentName: 'Rahmat Hidayat',
    parentPhone: '081388776655',
    parentEmail: 'rahmat@gmail.com',
    address: 'Jl. Kenanga No. 05, Tanggul',
    status: 'Aktif',
    joinedYear: 2024
  },
  {
    id: 'std-03',
    nis: '2025003',
    nisn: '0192837413',
    name: 'Bilal Ibrahim Ar-Rasyid',
    nickname: 'Bilal',
    gender: 'L',
    classGroup: 'Kelompok A1',
    birthDate: '2021-02-22',
    parentName: 'Ust. Mustafa',
    parentPhone: '085211223344',
    parentEmail: 'mustafa@gmail.com',
    address: 'Dusun Patemon RT 01 RW 02, Tanggul',
    status: 'Aktif',
    joinedYear: 2025
  },
  {
    id: 'std-04',
    nis: '2025004',
    nisn: '0192837414',
    name: 'Cinta Naura Hasna',
    nickname: 'Naura',
    gender: 'P',
    classGroup: 'Kelompok A2',
    birthDate: '2021-09-09',
    parentName: 'Dra. Endang Lestari',
    parentPhone: '087811223344',
    parentEmail: 'endang@gmail.com',
    address: 'Jl. Stasiun No. 14, Tanggul',
    status: 'Aktif',
    joinedYear: 2025
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-01',
    nip: '198503122010012005',
    nuptk: '453276328710002',
    name: 'Hj. Nurul Aini, S.Pd.AUD',
    title: 'Kepala Sekolah',
    gender: 'P',
    position: 'Kepala Sekolah / Supervisor Curriculum',
    phone: '081234567001',
    email: 'nurul.aini@tkasysyifa.sch.id',
    isWaliKelas: false
  },
  {
    id: 'tch-02',
    nip: '199008202015022008',
    nuptk: '876543210980001',
    name: 'Siti Maimunah, S.Pd',
    title: 'Wali Kelas B1',
    gender: 'P',
    position: 'Guru Kelas / Koordinator STEAM',
    assignedClass: 'Kelompok B1',
    phone: '081234567002',
    email: 'siti.maimunah@tkasysyifa.sch.id',
    isWaliKelas: true
  },
  {
    id: 'tch-03',
    nip: '-',
    nuptk: '981273645012003',
    name: 'Dewi Rahmawati, S.Pd',
    title: 'Wali Kelas A1',
    gender: 'P',
    position: 'Guru Kelas / Pendamping Tahfidz',
    assignedClass: 'Kelompok A1',
    phone: '081234567003',
    email: 'dewi.rahmawati@tkasysyifa.sch.id',
    isWaliKelas: true
  },
  {
    id: 'tch-04',
    nip: '-',
    nuptk: '128736450912004',
    name: 'M. Rizky Saputra, S.E',
    title: 'Staf Keuangan & TU',
    gender: 'L',
    position: 'Bendahara Sekolah / Staff Keuangan',
    phone: '081234567004',
    email: 'rizky.tu@tkasysyifa.sch.id',
    isWaliKelas: false
  }
];

export const INITIAL_PRESENSI: PresensiRecord[] = [
  {
    id: 'prs-001',
    studentId: 'std-01',
    studentName: 'Ahmad Hafizh Zaidan',
    classGroup: 'Kelompok B1',
    date: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    checkInTime: '07:15',
    notes: 'Anak ceria dan aktif berkegiatan'
  },
  {
    id: 'prs-002',
    studentId: 'std-02',
    studentName: 'Anisa Kirana Putri',
    classGroup: 'Kelompok B1',
    date: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    checkInTime: '07:20',
    notes: 'Datang tepat waktu'
  },
  {
    id: 'prs-003',
    studentId: 'std-03',
    studentName: 'Bilal Ibrahim Ar-Rasyid',
    classGroup: 'Kelompok A1',
    date: new Date().toISOString().split('T')[0],
    status: 'Izin',
    notes: 'Acara keluarga ke Surabaya'
  },
  {
    id: 'prs-004',
    studentId: 'std-04',
    studentName: 'Cinta Naura Hasna',
    classGroup: 'Kelompok A2',
    date: new Date().toISOString().split('T')[0],
    status: 'Sakit',
    notes: 'Demam ringan, istirahat di rumah'
  }
];

export const INITIAL_PRESENSI_GURU: PresensiGuruRecord[] = [
  {
    id: 'prsg-1',
    teacherId: 'tch-01',
    teacherName: 'Hj. Nurul Aini, S.Pd.AUD',
    date: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    notes: 'Supervisi Pembelajaran Pagi',
    activitySummary: 'Membuka apel pagi dan menyambut kedatangan anak.'
  },
  {
    id: 'prsg-2',
    teacherId: 'tch-02',
    teacherName: 'Siti Maimunah, S.Pd',
    date: new Date().toISOString().split('T')[0],
    status: 'Hadir',
    notes: 'Mengajar Kelompok B1',
    activitySummary: 'Pembelajaran tema Tanaman Obat & Praktik Membuat Jamu Kunyit.'
  }
];

export const INITIAL_ERAPOR: EraporRecord[] = [
  {
    id: 'erp-01',
    studentId: 'std-01',
    studentName: 'Ahmad Hafizh Zaidan',
    classGroup: 'Kelompok B1',
    semester: 'Genap',
    academicYear: '2025/2026',
    nilaiAgama: 'BSB (Berkembang Sangat Baik) - Hafal Surah An-Nas s.d Al-Fiil, mampu memimpin doa sebelum belajar.',
    jatiDiri: 'BSH (Berkembang Sesuai Harapan) - Menunjukkan sikap mandiri saat memakai sepatu dan menjaga kebersihan.',
    dasarLiterasiSteam: 'BSB (Berkembang Sangat Baik) - Sangat tertarik bereksperimen mencampur warna dan menyusun balok geometri.',
    perkembanganFisikMotorik: 'BSB - Mampu melompat dengan satu kaki dan menyeimbangkan badan dengan sangat baik.',
    catatanWaliKelas: 'Ananda Zaidan adalah anak yang penuh rasa ingin tahu dan santun kepada guru serta teman.',
    teacherName: 'Siti Maimunah, S.Pd',
    createdAt: '2026-06-15'
  }
];

export const INITIAL_ANECDOT: AnecdotRecord[] = [
  {
    id: 'anc-01',
    studentId: 'std-01',
    studentName: 'Ahmad Hafizh Zaidan',
    classGroup: 'Kelompok B1',
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    location: 'Area APE Luar (Taman)',
    observedBehavior: 'Zaidan merangkul rekannya yang menangis saat terjatuh lalu membantunya mengambilkan mainan.',
    teacherAnalysis: 'Menunjukkan kepekaan empati dan kepemimpinan sosial yang luar biasa.',
    followUp: 'Diberikan apresiasi bintang kebaikan saat lingkaran penutup.'
  }
];

export const INITIAL_SPP: SPPBill[] = [
  {
    id: 'spp-2026-05-01',
    studentId: 'std-01',
    studentName: 'Ahmad Hafizh Zaidan',
    classGroup: 'Kelompok B1',
    month: 'Mei',
    year: 2026,
    sppAmount: 180000,
    gedungAmount: 0,
    status: 'Lunas',
    paidAt: '2026-05-04',
    paymentMethod: 'Transfer QRIS/Bank',
    receiptNo: 'KW-202605-001'
  },
  {
    id: 'spp-2026-05-02',
    studentId: 'std-02',
    studentName: 'Anisa Kirana Putri',
    classGroup: 'Kelompok B1',
    month: 'Mei',
    year: 2026,
    sppAmount: 180000,
    status: 'Lunas',
    paidAt: '2026-05-02',
    paymentMethod: 'Tunai di Kasir TU',
    receiptNo: 'KW-202605-002'
  },
  {
    id: 'spp-2026-05-03',
    studentId: 'std-03',
    studentName: 'Bilal Ibrahim Ar-Rasyid',
    classGroup: 'Kelompok A1',
    month: 'Mei',
    year: 2026,
    sppAmount: 180000,
    status: 'Belum Bayar'
  }
];

export const INITIAL_BOOK_CONNECTION: BookConnection[] = [
  {
    id: 'bk-01',
    studentId: 'std-01',
    studentName: 'Ahmad Hafizh Zaidan',
    date: new Date().toISOString().split('T')[0],
    mealNote: 'Makan siang habis 1 porsi (Lauk Ayam Goreng & Sayur Sop)',
    sleepNote: 'Tidur siang tenang 45 menit (12.30 - 13.15)',
    mood: 'Sangat Ceria & Kooperatif',
    teacherMessage: 'Ananda hari ini hebat memimpin doa makan di depan kelas!',
    parentReply: 'Alhamdulillah, terima kasih Bu Guru. Di rumah Zaidan juga rajin mengulang doa.',
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
];

export const INITIAL_TAHFIDZ: TahfidzProgress[] = [
  {
    id: 'thf-01',
    studentId: 'std-01',
    studentName: 'Ahmad Hafizh Zaidan',
    surahName: 'Al-Kautsar',
    ayatProgress: 'Ayat 1 - 3 (Lengkap)',
    status: 'Lancar',
    date: new Date().toISOString().split('T')[0],
    notes: 'Tajwid & makhraj huruf sangat jelas.'
  },
  {
    id: 'thf-02',
    studentId: 'std-02',
    studentName: 'Anisa Kirana Putri',
    surahName: 'Al-Ma’un',
    ayatProgress: 'Ayat 1 - 4',
    status: 'Mengulang',
    date: new Date().toISOString().split('T')[0],
    notes: 'Perlu pengulangan kelancaran di ayat ke-3.'
  }
];

export const INITIAL_KMS: KMSHealthRecord[] = [
  {
    id: 'kms-01',
    studentId: 'std-01',
    studentName: 'Ahmad Hafizh Zaidan',
    checkDate: '2026-05-10',
    heightCm: 108,
    weightKg: 18.2,
    headCircumferenceCm: 51,
    dentalHealth: 'Gigi Bersih, Bebas Karies',
    immunizationStatus: 'Lengkap Sesuai Usia',
    doctorNotes: 'Pertumbuhan optimal di grafik hijau tua KMS.'
  }
];

export const INITIAL_EVENTS: ScheduleEvent[] = [
  {
    id: 'evt-01',
    title: 'Pemeriksaan Kesehatan Berkala Puskesmas Tanggul',
    date: '2026-08-15',
    category: 'Kegiatan',
    description: 'Pemeriksaan mata, gigi, dan pemberian vitamin A untuk seluruh siswa.',
    location: 'Aula TK Asy Syifa'
  },
  {
    id: 'evt-02',
    title: 'Market Day & Pameran Karya Kreatif Anak',
    date: '2026-08-28',
    category: 'Market Day',
    description: 'Bazar makanan sehat dan hasil kreasi seni STEAM anak bersama orang tua.',
    location: 'Halaman Utama Sekolah'
  },
  {
    id: 'evt-03',
    title: 'Puncak Tema: Simulasi Manasik Haji',
    date: '2026-09-10',
    category: 'Manasik',
    description: 'Latihan manasik haji berseragam ihram untuk menanamkan rukun Islam ke-5.',
    location: 'Mini Kaaba Tanggul'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    code: 'APE-OUT-001',
    name: 'Perosotan Fiber Ganda + Panjat Tali',
    category: 'APE Luar',
    quantity: 2,
    condition: 'Baik',
    location: 'Taman Bermain Depan'
  },
  {
    id: 'inv-02',
    code: 'APE-IN-012',
    name: 'Set Balok Kayu Geometri Karakter (100 pcs)',
    category: 'APE Dalam',
    quantity: 5,
    condition: 'Baik',
    location: 'Sentra Balok & STEAM'
  }
];

export const INITIAL_CATERING: CateringMenu[] = [
  {
    id: 'cat-01',
    dayName: 'Senin',
    date: '2026-08-10',
    mainCourse: 'Nasi Kuning Organik + Telur Dadar Iris + Sup Sayur Bakso',
    snack: 'Puding Buah Naga',
    drink: 'Susu UHT / Air Putih',
    nutritionalInfo: 'Karbohidrat, Protein Hewani, Vitamin C'
  },
  {
    id: 'cat-02',
    dayName: 'Selasa',
    date: '2026-08-11',
    mainCourse: 'Nasi Putih + Ayam Fillet Crispy Honey + Tumis Buncis Wortel',
    snack: 'Pisang Barangan Manis',
    drink: 'Jus Jeruk Segar',
    nutritionalInfo: 'Protein Tinggi, Serat Serat Pangan'
  }
];

export const INITIAL_TRANSPORT: TransportRoute[] = [
  {
    id: 'trsp-01',
    routeName: 'Rute A - Tanggul Barat & Stasiun',
    driverName: 'Pak Slamet',
    driverPhone: '081390887766',
    vehicleNo: 'P 1234 WX (Suzuki APV)',
    assignedStudentsCount: 8
  },
  {
    id: 'trsp-02',
    routeName: 'Rute B - Tanggul Timur & Patemon',
    driverName: 'Pak Bambang',
    driverPhone: '082155667788',
    vehicleNo: 'P 5678 YZ (Toyota Hiace)',
    assignedStudentsCount: 12
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    userId: 'usr-admin-1',
    userName: 'Super Admin System',
    role: 'SUPER_ADMIN',
    action: 'LOGIN_SUCCESS',
    targetModule: 'System Security',
    timestamp: '2026-08-04 08:00:12'
  },
  {
    id: 'log-02',
    userId: 'usr-guru-1',
    userName: 'Siti Maimunah, S.Pd',
    role: 'GURU',
    action: 'UPDATE_PRESENSI',
    targetModule: 'R6 Presensi Siswa',
    timestamp: '2026-08-04 08:15:40'
  }
];

export const INITIAL_HOMEPAGE_CONFIG = {
  headline: 'TK Asy Syifa Tanggul - Kampus Ceria Berkarakter Qurani',
  subtitle: 'Membentuk Generasi Cerdas, Kreatif, Berakhlak Mulia & Mencintai Al-Qur\'an Sejak Dini di Kecamatan Tanggul, Jember.',
  heroImage: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=1200',
  youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ctaText: '🎒 Daftar PPDB Online 2026/2027',
  ctaLink: '/ppdb',
  runningText: '✨ Selamat Datang di Website Resmi TK Asy Syifa Tanggul • Pendaftaran Siswa Baru Gelombang 1 Sedang Dibuka! Kuota Terbatas 60 Santri Cilik •',
  highlights: [
    'Amanah & Terakreditasi A (Unggul)',
    'Hafalan Surah Pendek & Doa Harian',
    'Fasilitas Ramah Anak & Armada Antar Jemput',
    'Pemeriksaan Kesehatan Bulanan (KMS)'
  ],
  sectionOrder: ['hero', 'program', 'guru', 'galeri', 'prestasi', 'ppdb', 'footer']
};

export const INITIAL_WEBSITE_PROGRAMS = [
  {
    id: 'prog-01',
    title: 'Sentra Agama & Tahfidz Cilik',
    category: 'Sentra Belajar',
    description: 'Pembiasaan hafalan Surah Pendek, Doa Harian, Wudhu, Sholat Berjamaah, & Adab Islami.',
    icon: '📖',
    ageGroup: '4 - 6 Tahun',
    schedule: 'Senin - Jumat',
    isFeatured: true
  },
  {
    id: 'prog-02',
    title: 'Sentra Seni & Kreativitas',
    category: 'Seni PAUD',
    description: 'Eksplorasi menggambar, mewarnai, melipat origami, membatik cilik, dan musik angklung.',
    icon: '🎨',
    ageGroup: '4 - 6 Tahun',
    schedule: 'Setiap Rabu',
    isFeatured: true
  },
  {
    id: 'prog-03',
    title: 'Sentra Bahan Alam & Sains Cilik',
    category: 'Eksperimen',
    description: 'Pengenalan alam sekitar, bercocok tanam di taman sekolah, eksperimen air, pasir, dan warna.',
    icon: '🌱',
    ageGroup: '4 - 6 Tahun',
    schedule: 'Setiap Kamis',
    isFeatured: true
  },
  {
    id: 'prog-04',
    title: 'Sentra Olah Tubuh & Motorik',
    category: 'Fisik Motorik',
    description: 'Senam Ceria Anak Sholeh, permainan tradisional, renang ceria, dan ketangkasan luar ruangan.',
    icon: '⚽',
    ageGroup: '4 - 6 Tahun',
    schedule: 'Setiap Jumat',
    isFeatured: true
  }
];

export const INITIAL_WEBSITE_TEACHERS = [
  {
    id: 'tch-pub-1',
    name: 'Hj. Nurul Aini, S.Pd.AUD',
    title: 'Kepala Sekolah & Pendidik Teladan',
    position: 'Kepala TK Asy Syifa',
    quote: 'Mendidik dengan hati, menanamkan akhlak mulia sejak langkah pertama anak.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    experienceYears: 15
  },
  {
    id: 'tch-pub-2',
    name: 'Siti Maimunah, S.Pd',
    title: 'Guru Sentra Agama & Tahfidz',
    position: 'Wali Kelas Kelompok B1',
    quote: 'Al-Qur\'an adalah pelita hati anak. Hafalan ringan dibawakan secara gembira.',
    photoUrl: 'https://images.unsplash.com/photo-1580894732413-a70d10d65ff3?auto=format&fit=crop&q=80&w=400',
    experienceYears: 10
  },
  {
    id: 'tch-pub-3',
    name: 'Dewi Rahmawati, A.Md.PAUD',
    title: 'Guru Sentra Seni & Kreativitas',
    position: 'Wali Kelas Kelompok A1',
    quote: 'Setiap goresan warna anak adalah imajinasi indah yang harus dihargai.',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    experienceYears: 8
  }
];

export const INITIAL_WEBSITE_ACHIEVEMENTS = [
  {
    id: 'ach-01',
    title: 'Juara 1 Lomba Tahfidz Cilik PAUD Tingkat Kabupaten Jember',
    winnerName: 'Ananda Ahmad Fauzi',
    category: 'Tahfidz Al-Qur\'an',
    year: '2026',
    level: 'Kabupaten',
    badgeIcon: '🏆'
  },
  {
    id: 'ach-02',
    title: 'Juara Umum Lomba Mewarnai Ceria TK Se-Kecamatan Tanggul',
    winnerName: 'Ananda Aisha Az-Zahra',
    category: 'Seni Rupa PAUD',
    year: '2025',
    level: 'Kecamatan',
    badgeIcon: '🥇'
  },
  {
    id: 'ach-03',
    title: 'Sekolah PAUD Unggulan Ramah Anak & Sekolah Hijau Sehat',
    winnerName: 'TK Asy Syifa Tanggul',
    category: 'Kelembagaan',
    year: '2025',
    level: 'Provinsi Jawa Timur',
    badgeIcon: '🌟'
  }
];

export const INITIAL_WEBSITE_ANNOUNCEMENTS = [
  {
    id: 'ann-01',
    title: 'Pembukaan PPDB Online Gelombang 1 Tahun Ajaran 2026/2027',
    content: 'Pendaftaran Murid Baru TK A & B telah dibuka. Kuota terbatas 60 siswa. Dapatkan potongan biaya seragam khusus pendaftar awal!',
    date: '2026-08-01',
    urgency: 'Penting' as const,
    isPublished: true
  },
  {
    id: 'ann-02',
    title: 'Pelaksanaan Pemeriksaan Kesehatan & Gizi Bulanan (KMS)',
    content: 'Diberitahukan kepada orang tua murid, pemeriksaan antropometri (BB/TB) & pemeriksaan gigi akan dilaksanakan Hari Jumat ini bersama Puskesmas Tanggul.',
    date: '2026-08-05',
    urgency: 'Info' as const,
    isPublished: true
  }
];

export const INITIAL_WEBSITE_FAQS = [
  {
    id: 'faq-01',
    question: 'Berapa usia minimal pendaftaran siswa di TK Asy Syifa Tanggul?',
    answer: 'Usia minimal Kelompok A adalah 4 - 5 tahun, sedangkan Kelompok B adalah 5 - 6 tahun per bulan Juli tahun ajaran berjalan.',
    category: 'Pendaftaran / PPDB'
  },
  {
    id: 'faq-02',
    question: 'Apakah sekolah menyediakan layanan Antar Jemput & Catering?',
    answer: 'Ya, kami memiliki armada Suzuki APV & Toyota Hiace khusus sekolah serta katering bergizi sehat tanpa MSG untuk makan siang anak.',
    category: 'Fasilitas & Layanan'
  },
  {
    id: 'faq-03',
    question: 'Bagaimana jam kegiatan belajar di TK Asy Syifa?',
    answer: 'Kegiatan belajar berlangsung Senin - Jumat pukul 07.30 - 11.00 WIB, diawali Sholat Dhuha Berjamaah & Senam Ceria.',
    category: 'Kurikulum & KBM'
  }
];

export const INITIAL_WEBSITE_EVENTS = [
  {
    id: 'evt-01',
    title: 'Market Day Ceria - Pesta Entrepreneur Cilik',
    date: '2026-08-20',
    time: '08:00 - 11:00 WIB',
    location: 'Halaman Utama TK Asy Syifa',
    category: 'Market Day' as const,
    description: 'Anak-anak belajar berwirausaha menjual produk kreasi & jajanan sehat bersama teman dan wali murid.',
    isPast: false
  },
  {
    id: 'evt-02',
    title: 'Praktik Manasik Haji Cilik Santri Asy Syifa',
    date: '2026-09-12',
    time: '07:00 - 10:30 WIB',
    location: 'Lap. Alun-alun Tanggul',
    category: 'Manasik' as const,
    description: 'Pengenalan rukun haji sejak dini lengkap dengan pakaian ihram dan miniatur Ka\'bah.',
    isPast: false
  },
  {
    id: 'evt-03',
    title: 'Lomba Senam & Mewarnai Menyambut Hari Kemerdekaan',
    date: '2026-08-15',
    time: '08:00 - 11:00 WIB',
    location: 'Aula Ceria Sekolah',
    category: 'Hari Nasional' as const,
    description: 'Semarak HUT RI ke-81 bersama santri, ibu guru, dan komite sekolah.',
    isPast: false
  }
];

export const INITIAL_SMART_QUOTES = [
  {
    id: 'q-01',
    text: 'Setiap anak dilahirkan di atas fitrah. Orang tuanyalah yang membentuk akhlak & perilakunya.',
    source: 'HR. Bukhari & Muslim',
    category: 'Hadits' as const,
    isFeatured: true
  },
  {
    id: 'q-02',
    text: 'Doa Utama Orang Tua: Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyenang hati (kami).',
    source: 'QS. Al-Furqan: 74',
    category: 'Doa' as const,
    isFeatured: true
  },
  {
    id: 'q-03',
    text: 'Mendidik anak bukan dengan kepalan tangan, melainkan dengan keteladanan, kehangatan, dan cinta kasih yang tulus.',
    source: 'Pesan Pendidikan Islam',
    category: 'Quote Parenting' as const,
    isFeatured: true
  },
  {
    id: 'q-04',
    text: 'Anak yang bahagia adalah anak yang merasa didengar dan dicintai dalam setiap langkah pertumbuhannya.',
    source: 'Pesan Kepala TK Asy Syifa',
    category: 'Inspirasi' as const,
    isFeatured: true
  }
];

export const INITIAL_PRODUCTION_LOCK = {
  isLocked: true,
  protectedSections: ['hero', 'program', 'guru', 'galeri', 'prestasi', 'ppdb', 'footer'],
  updatedBy: 'Super Admin TADE System',
  updatedAt: '2026-08-05'
};


