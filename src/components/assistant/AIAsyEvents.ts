export type EventType =
  | 'NORMAL_DAY'
  | 'SCHOOL_BIRTHDAY'
  | 'STUDENT_BIRTHDAY'
  | 'TEACHER_BIRTHDAY'
  | 'FOUNDATION_ANNIVERSARY'
  | 'GRADUATION'
  | 'PPDB_PERIOD'
  | 'SCHOOL_TRIP'
  | 'COLORING_COMPETITION'
  | 'ART_PERFORMANCE'
  | 'MANASIK'
  | 'RAMADAN'
  | 'EID_FITR'
  | 'INDEPENDENCE_DAY'
  | 'NATIONAL_EDUCATION_DAY'
  | 'TEACHERS_DAY'
  | 'NEW_ACADEMIC_YEAR'
  | 'SEMESTER_REPORT_DAY'
  | 'PARENT_MEETING'
  | 'SCHOOL_HOLIDAY';

export interface EventConfig {
  type: EventType;
  title: string;
  badge: string;
  speechText: string;
  accessoryName: string;
  particleType: 'CONFETTI' | 'STARS' | 'PETALS' | 'BALLOONS' | 'HEARTS' | 'STREAMERS';
  primaryColor: string;
}

export const EVENT_CONFIGS: Record<EventType, EventConfig> = {
  NORMAL_DAY: {
    type: 'NORMAL_DAY',
    title: 'Hari Efektif Sekolah',
    badge: 'TADE Companion Active',
    speechText: 'Semangat belajar dan mengajar hari ini! Asy selalu siap mendampingi Ayah, Bunda, dan Guru-guru sekalian.',
    accessoryName: 'Peci Standar TK ASY SYIFA',
    particleType: 'STARS',
    primaryColor: '#059669'
  },
  SCHOOL_BIRTHDAY: {
    type: 'SCHOOL_BIRTHDAY',
    title: 'Milad TK ASY SYIFA',
    badge: 'Milad Spesial Sekolah 🎉',
    speechText: 'Barakallah! Selamat Ulang Tahun TK ASY SYIFA! Semoga semakin maju, berkah, dan melahirkan generasi Qur\'ani yang cemerlang.',
    accessoryName: 'Topi Ulang Tahun & Pita Emas',
    particleType: 'CONFETTI',
    primaryColor: '#fbbf24'
  },
  STUDENT_BIRTHDAY: {
    type: 'STUDENT_BIRTHDAY',
    title: 'Hari Ulang Tahun Siswa',
    badge: 'Selamat Ulang Tahun 🎂',
    speechText: 'Selamat Ulang Tahun! Semoga panjang umur, selalu sehat, tambah ceria, rajin belajar, dan menjadi anak yang sholeh & sholehah.',
    accessoryName: 'Topi Pesta & Konfeti Ceria',
    particleType: 'CONFETTI',
    primaryColor: '#f43f5e'
  },
  TEACHER_BIRTHDAY: {
    type: 'TEACHER_BIRTHDAY',
    title: 'Milad Guru / Pendidik',
    badge: 'Milad Guru Tersayang 💐',
    speechText: 'Barakallah fii umrik Ibu/Bapak Guru! Terima kasih atas segala keikhlasan dan kasih sayang dalam mendidik anak-anak.',
    accessoryName: 'Buket Bunga & Mahkota Apresiasi',
    particleType: 'PETALS',
    primaryColor: '#ec4899'
  },
  FOUNDATION_ANNIVERSARY: {
    type: 'FOUNDATION_ANNIVERSARY',
    title: 'Milad Yayasan Asy Syifa',
    badge: 'HUT Yayasan Asy Syifa 🏛️',
    speechText: 'Selamat Milad Yayasan Asy Syifa! Semoga senantiasa amanah dan terus menebar kebaikan untuk pendidikan anak usia dini.',
    accessoryName: 'Emblem Emas Yayasan',
    particleType: 'STARS',
    primaryColor: '#d97706'
  },
  GRADUATION: {
    type: 'GRADUATION',
    title: 'Hari Wisuda & Haflah Akhirussanah',
    badge: 'Wisuda Siswa 🎓',
    speechText: 'Selamat Atas Wisuda Kakak-Kakak Siswa! Semoga ilmu yang didapat bermanfaat dan sukses di jenjang sekolah berikutnya!',
    accessoryName: 'Toga Wisuda & Tassel Emas',
    particleType: 'STREAMERS',
    primaryColor: '#4f46e5'
  },
  PPDB_PERIOD: {
    type: 'PPDB_PERIOD',
    title: 'Masa Penerimaan Murid Baru (PPDB)',
    badge: 'Pendaftaran PPDB Buka 📝',
    speechText: 'Selamat datang Adik-Adik Calon Siswa Baru! Yuk bergabung dan bermain bersama Asy di TK ASY SYIFA!',
    accessoryName: 'Kacamata Cerdas & Pin PPDB',
    particleType: 'BALLOONS',
    primaryColor: '#0284c7'
  },
  SCHOOL_TRIP: {
    type: 'SCHOOL_TRIP',
    title: 'Kegiatan Rihlah / School Trip',
    badge: 'School Trip Ceria 🚌',
    speechText: 'Horeee! Hari ini kita jalan-jalan Rihlah Edukatif! Tetap kompak, pakai topi, bawa botol minum, dan selalu hati-hati ya!',
    accessoryName: 'Topi Rimba, Ransel, & Botol Minum',
    particleType: 'BALLOONS',
    primaryColor: '#16a34a'
  },
  COLORING_COMPETITION: {
    type: 'COLORING_COMPETITION',
    title: 'Lomba Mewarnai & Kreasi Seni',
    badge: 'Lomba Mewarnai 🎨',
    speechText: 'Selamat berlomba dan berkreasi! Tunjukkan warna-warni terindah dan keberanianmu ya teman-teman!',
    accessoryName: 'Topi Baret Pelukis & Kuas Warna',
    particleType: 'CONFETTI',
    primaryColor: '#8b5cf6'
  },
  ART_PERFORMANCE: {
    type: 'ART_PERFORMANCE',
    title: 'Pentas Seni & Kreasi Siswa',
    badge: 'Pentas Seni Siswa 🎭',
    speechText: 'Tunjukkan bakat hebatmu di panggung Pentas Seni! Asy bangga melihat kreativitas anak-anak TK ASY SYIFA!',
    accessoryName: 'Pita Ceria & Pita Pentas',
    particleType: 'STREAMERS',
    primaryColor: '#e11d48'
  },
  MANASIK: {
    type: 'MANASIK',
    title: 'Peragaan Manasik Haji Cilik',
    badge: 'Manasik Haji Cilik 🕋',
    speechText: 'Labbaikallahumma Labbaik! Selamat mengikuti Peragaan Manasik Haji Cilik. Semoga menjadi anak sholeh yang mencintai Ka\'bah.',
    accessoryName: 'Peci Putih & Selendang Ihram Cilik',
    particleType: 'STARS',
    primaryColor: '#0d9488'
  },
  RAMADAN: {
    type: 'RAMADAN',
    title: 'Bulan Suci Ramadan & Tarhib',
    badge: 'Marhaban Ya Ramadan 🌙',
    speechText: 'Marhaban Ya Ramadan! Selamat menunaikan ibadah puasa dan membaca Al-Qur\'an untuk seluruh keluarga besar sekolah.',
    accessoryName: 'Peci Bulan Sabit & Motif Ketupat',
    particleType: 'STARS',
    primaryColor: '#059669'
  },
  EID_FITR: {
    type: 'EID_FITR',
    title: 'Hari Raya Idul Fitri',
    badge: 'Selamat Idul Fitri 🌙✨',
    speechText: 'Taqabbalallahu minna wa minkum! Selamat Hari Raya Idul Fitri. Mohon maaf lahir dan batin dari Asy untuk semuanya!',
    accessoryName: 'Busana Koko Cilik & Hiasan Ketupat',
    particleType: 'HEARTS',
    primaryColor: '#10b981'
  },
  INDEPENDENCE_DAY: {
    type: 'INDEPENDENCE_DAY',
    title: 'HUT Kemerdekaan RI (17 Agustus)',
    badge: 'DIRGAHAYU REPUBLIK INDONESIA 🇮🇩',
    speechText: 'Merdeka! Dirgahayu Republik Indonesia! Mari kita isi kemerdekaan dengan semangat belajar dan mencintai Tanah Air!',
    accessoryName: 'Ikat Kepala Merah Putih 17 Agustus',
    particleType: 'CONFETTI',
    primaryColor: '#dc2626'
  },
  NATIONAL_EDUCATION_DAY: {
    type: 'NATIONAL_EDUCATION_DAY',
    title: 'Hari Pendidikan Nasional (2 Mei)',
    badge: 'Hari Pendidikan Nasional 📚',
    speechText: 'Selamat Hari Pendidikan Nasional! Tut Wuri Handayani. Mari terus bersemangat menuntut ilmu sejak usia dini.',
    accessoryName: 'Lencana Ki Hajar Dewantara & Buku',
    particleType: 'STARS',
    primaryColor: '#2563eb'
  },
  TEACHERS_DAY: {
    type: 'TEACHERS_DAY',
    title: 'Hari Guru Nasional (25 November)',
    badge: 'Selamat Hari Guru 💐',
    speechText: 'Selamat Hari Guru Nasional! Terima kasih pahlawan tanpa tanda jasa yang selalu membimbing kami dengan sabar dan penuh rasa kasih.',
    accessoryName: 'Buket Bunga Merah & Selendang Pahlawan',
    particleType: 'PETALS',
    primaryColor: '#db2777'
  },
  NEW_ACADEMIC_YEAR: {
    type: 'NEW_ACADEMIC_YEAR',
    title: 'Tahun Ajaran Baru (MPLS)',
    badge: 'Tahun Ajaran Baru 🎒',
    speechText: 'Selamat Datang di Tahun Ajaran Baru 2026/2027! Mari kita sambut hari-hari belajar yang penuh ceria dan teman baru!',
    accessoryName: 'Tas Sekolah Baru & Name Tag Ceria',
    particleType: 'BALLOONS',
    primaryColor: '#0d9488'
  },
  SEMESTER_REPORT_DAY: {
    type: 'SEMESTER_REPORT_DAY',
    title: 'Hari Penyerahan e-Rapor Semester',
    badge: 'Penyerahan e-Rapor 📄',
    speechText: 'Hore! Hari ini pembagian e-Rapor Semester. Selamat atas capaian perkembangan belajar anak-anak yang luar biasa!',
    accessoryName: 'Map Rapor Berpita Emas',
    particleType: 'STARS',
    primaryColor: '#6366f1'
  },
  PARENT_MEETING: {
    type: 'PARENT_MEETING',
    title: 'Pertemuan Orang Tua & Guru (POMG)',
    badge: 'Silaturahmi Orang Tua 🤝',
    speechText: 'Selamat datang Ayah & Bunda di Pertemuan Silaturahmi Orang Tua Murid. Sinergi bersama untuk tumbuh kembang ananda!',
    accessoryName: 'Pin Kemitraan Keluarga',
    particleType: 'HEARTS',
    primaryColor: '#84cc16'
  },
  SCHOOL_HOLIDAY: {
    type: 'SCHOOL_HOLIDAY',
    title: 'Masa Libur Semester Sekolah',
    badge: 'Selamat Berlibur 🌴',
    speechText: 'Selamat berlibur bersama keluarga tercinta! Tetap rajin shalat, mengaji, dan jaga kesehatan ya teman-teman!',
    accessoryName: 'Kacamata Hitam Ceria & Koper Kecil',
    particleType: 'BALLOONS',
    primaryColor: '#f97316'
  }
};

/**
 * Detect active event based on current Date and active module tab
 */
export const detectCurrentEvent = (activeTabCode: string): EventConfig => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const date = now.getDate(); // 1-31

  // 1. Exact Date Matched Events
  if (month === 8 && date === 17) return EVENT_CONFIGS.INDEPENDENCE_DAY;
  if (month === 11 && date === 25) return EVENT_CONFIGS.TEACHERS_DAY;
  if (month === 5 && date === 2) return EVENT_CONFIGS.NATIONAL_EDUCATION_DAY;
  if (month === 3 && date === 15) return EVENT_CONFIGS.SCHOOL_BIRTHDAY;
  if (month === 5 && date === 10) return EVENT_CONFIGS.FOUNDATION_ANNIVERSARY;

  // 2. Tab Context Matched Events
  const tab = activeTabCode.toLowerCase();
  if (tab === 'w4' || tab === 'r13') return EVENT_CONFIGS.PPDB_PERIOD;
  if (tab === 'r8') return EVENT_CONFIGS.SEMESTER_REPORT_DAY;
  if (tab === 'r17') return EVENT_CONFIGS.RAMADAN;
  if (tab === 'r21') return EVENT_CONFIGS.COLORING_COMPETITION;
  if (tab === 'r28') return EVENT_CONFIGS.SCHOOL_TRIP;
  if (tab === 'r29' || tab === 'r15') return EVENT_CONFIGS.PARENT_MEETING;

  // 3. Seasonal Months Fallback
  if (month === 8) return EVENT_CONFIGS.INDEPENDENCE_DAY; // August = Independence Month
  if (month === 6) return EVENT_CONFIGS.GRADUATION; // June = Graduation season
  if (month === 7 && date <= 20) return EVENT_CONFIGS.NEW_ACADEMIC_YEAR; // July = New School Year
  if (month === 4) return EVENT_CONFIGS.RAMADAN; // April Ramadan
  if (month === 11) return EVENT_CONFIGS.TEACHERS_DAY; // November Teacher Month

  return EVENT_CONFIGS.NORMAL_DAY;
};
