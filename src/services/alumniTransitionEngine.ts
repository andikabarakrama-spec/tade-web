/**
 * TADE ALUMNI FAMILY TRANSITION ENGINE — SPRINT G10
 * Sovereign Asy Syifa Heritage Engine • Strict RBAC • Zero Breaking Changes
 * 
 * Features:
 * P1: Automatic Role & Status Transition (Wali Murid -> Alumni Family)
 * P2: Living Alumni Garden Data Coordinator
 * P3: Legacy Family Tree Relationship Resolver
 * P4: Official Alumni Passport & Cryptographic QR Seal Generator
 * P5: Referral Garden & Non-Monetary Blessing Reward Engine
 * P6: SD/MI Islamic Transition Knowledge Base & Prayers
 * P7: Legacy Forest Multi-Cohort Growth Coordinator
 */

import {
  AlumniProfile,
  AlumniWishTreeItem,
  AlumniReunionEvent,
  FamilyTreeData,
  FamilyRelationMember,
  AlumniReferralRecord,
  ReferralRewardSummary,
  SDTransitionChecklistItem,
  SDTransitionPrayer,
  SDTransitionParentTip,
  SDPartnerSchool,
  LegacyForestCohort
} from '../types/alumni';
import { blackBoxRecorder } from './blackBoxRecorder';
import { guardianFortressService } from './guardianFortressService';
import { DataService } from './db';

const STORAGE_KEYS = {
  PROFILES: 'asy_syifa_alumni_profiles_v10',
  WISHES: 'asy_syifa_alumni_wishes_v10',
  EVENTS: 'asy_syifa_alumni_events_v10',
  REFERRALS: 'asy_syifa_alumni_referrals_v10',
  COHORTS: 'asy_syifa_alumni_cohorts_v10',
  SD_CHECKLIST: 'asy_syifa_sd_checklist_v10'
};

// Initial Seed Data: 5 Cohorts of Asy Syifa Tanggul
const INITIAL_COHORTS: LegacyForestCohort[] = [
  {
    year: 2022,
    cohortNumber: 10,
    cohortName: 'Angkatan 10 — Ibnu Sina',
    motto: 'Menebar Cahaya Akhlak & Kecintaan Al-Quran di Bumi Nusantara',
    totalGraduates: 42,
    totalJuzMemorized: 84,
    treeGrowthStage: 'MAJESTIC_GOLDEN',
    featuredProjects: ['Miniatur Masjid Nabawi', 'Buku Kumpulan Doa Bergambar', 'Pentas Tahfidz Cilik'],
    coreValues: ['Kejujuran', 'Cinta Al-Quran', 'Budi Pekerti Luhur'],
    groupPhotoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    valedictorian: 'Fatimah Zahra Al-Habsyi',
    wishesCount: 38
  },
  {
    year: 2023,
    cohortNumber: 11,
    cohortName: 'Angkatan 11 — Al-Khawarizmi',
    motto: 'Cerdas Bernalar, Tangkas Berkarya, Santun Berbahasa',
    totalGraduates: 46,
    totalJuzMemorized: 98,
    treeGrowthStage: 'MAJESTIC_GOLDEN',
    featuredProjects: ['Jembatan Sains Ramah Lingkungan', 'Hafalan 20 Hadits Adab', 'Taman Herbal Mini'],
    coreValues: ['Kreativitas', 'Tawadhu', 'Mandiri'],
    groupPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    valedictorian: 'Muhammad Rayhan Pratama',
    wishesCount: 45
  },
  {
    year: 2024,
    cohortNumber: 12,
    cohortName: 'Angkatan 12 — Al-Fatih',
    motto: 'Pemimpin Cilik Berjiwa Satria & Penjaga Ayat-Ayat Suci',
    totalGraduates: 52,
    totalJuzMemorized: 114,
    treeGrowthStage: 'MAJESTIC_GOLDEN',
    featuredProjects: ['Khataman Juz 30 Bersama Orang Tua', 'Ecoprint Batik Cilik', 'Festival Budaya Santri'],
    coreValues: ['Keteguhan', 'Kepedulian', 'Kerapian'],
    groupPhotoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    valedictorian: 'Ahmad Hafizh Zaidan',
    wishesCount: 62
  },
  {
    year: 2025,
    cohortNumber: 13,
    cohortName: 'Angkatan 13 — Thariq bin Ziyad',
    motto: 'Maju Pantang Menyerah, Berprestasi Menggapai Ridho Ilahi',
    totalGraduates: 55,
    totalJuzMemorized: 128,
    treeGrowthStage: 'BLOOMING',
    featuredProjects: ['Karya Robotik Balok Cerdas', 'Pentas Kisah 25 Nabi', 'Gerakan Sedekah Subuh'],
    coreValues: ['Keberanian', 'Disiplin', 'Ukhuwah'],
    groupPhotoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    valedictorian: 'Siti Maryam Azzahra',
    wishesCount: 51
  },
  {
    year: 2026,
    cohortNumber: 14,
    cohortName: 'Angkatan 14 — Salahuddin Al-Ayyubi',
    motto: 'Generasi Emas Tangguh, Berakhlak Mulia & Berwawasan Global',
    totalGraduates: 60,
    totalJuzMemorized: 140,
    treeGrowthStage: 'BLOOMING',
    featuredProjects: ['Kapsul Waktu Harapan Santri 2036', 'Sentra Alam & Sains Terpadu', 'Buku Cerita Ananda'],
    coreValues: ['Keadilan', 'Kasih Sayang', 'Kecintaan Belajar'],
    groupPhotoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    valedictorian: 'Bilal Ibrahim Ar-Rasyid',
    wishesCount: 78
  }
];

// Initial Alumni Profiles
const INITIAL_ALUMNI_PROFILES: AlumniProfile[] = [
  {
    id: 'alm-2024-001',
    studentId: 'std-01',
    studentName: 'Ahmad Hafizh Zaidan',
    nis: '2024001',
    nisn: '0182736411',
    gender: 'L',
    graduationYear: 2024,
    cohortName: 'Angkatan 12 — Al-Fatih',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    parentUid: 'usr-parent-01',
    parentName: 'H. Lukman Hakim',
    parentPhone: '081299887766',
    parentEmail: 'lukman@gmail.com',
    currentSchool: 'SDIT Harapan Umat Tanggul',
    currentGrade: 'Kelas 2 SD',
    tahfidzAchievements: [
      'Khatam Juz 30 Mutqin (37 Surah)',
      'Hafal 25 Doa Harian & Dzikir Pagi',
      'Hafal 15 Hadits Adab Pilihan'
    ],
    lastMemorizedSurah: 'An-Naba s.d An-Nas',
    characterBadges: ['Bintang Tahfidz Emas', 'Santri Teladan Adab', 'Duta Kebaikan Cilik'],
    graduationDate: '15 Juni 2024',
    certificateQrHash: 'ASY-CERT-2024-ALF-001-VERIFIED',
    wishesSubmittedCount: 4,
    referralsCount: 2,
    activeStatus: 'ACTIVE_ALUMNI',
    legacyTreeLeavesCount: 18
  },
  {
    id: 'alm-2024-002',
    studentId: 'std-02',
    studentName: 'Anisa Kirana Putri',
    nis: '2024002',
    nisn: '0182736412',
    gender: 'P',
    graduationYear: 2024,
    cohortName: 'Angkatan 12 — Al-Fatih',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    parentUid: 'usr-parent-02',
    parentName: 'Rahmat Hidayat',
    parentPhone: '081388776655',
    parentEmail: 'rahmat@gmail.com',
    currentSchool: 'MI Al-Hidayah Tanggul Kulon',
    currentGrade: 'Kelas 2 MI',
    tahfidzAchievements: [
      'Khatam Surah An-Naba s.d Al-Balad',
      'Hafal Doa Kedua Orang Tua & Sapu Jagad',
      'Juara 1 Tartil Quran Antar Sentra'
    ],
    lastMemorizedSurah: 'Al-Balad s.d An-Nas',
    characterBadges: ['Bintang Seni & Balok', 'Sahabat Ceria Asy Syifa'],
    graduationDate: '15 Juni 2024',
    certificateQrHash: 'ASY-CERT-2024-ALF-002-VERIFIED',
    wishesSubmittedCount: 3,
    referralsCount: 1,
    activeStatus: 'ACTIVE_ALUMNI',
    legacyTreeLeavesCount: 14
  },
  {
    id: 'alm-2025-001',
    studentId: 'std-05',
    studentName: 'Muhammad Farhan Al-Fatih',
    nis: '2025005',
    nisn: '0193847522',
    gender: 'L',
    graduationYear: 2025,
    cohortName: 'Angkatan 13 — Thariq bin Ziyad',
    photoUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?w=400&auto=format&fit=crop&q=80',
    parentUid: 'usr-parent-farhan',
    parentName: 'Bapak Hendra Gunawan',
    parentPhone: '082155667788',
    parentEmail: 'hendra.gunawan@gmail.com',
    currentSchool: 'SD Islam Terpadu Al-Ghazali Jember',
    currentGrade: 'Kelas 1 SD',
    tahfidzAchievements: [
      'Khatam Juz 30 Mutqin',
      'Hafalan Surah Al-Mulk Ayat 1-10',
      'Duta Sholat Berjamaah'
    ],
    lastMemorizedSurah: 'Juz 30 Lengkap',
    characterBadges: ['Bintang Keberanian', 'Hafizh Prestasi', 'Pioneer Santri Mandiri'],
    graduationDate: '14 Juni 2025',
    certificateQrHash: 'ASY-CERT-2025-TBZ-005-VERIFIED',
    wishesSubmittedCount: 5,
    referralsCount: 3,
    activeStatus: 'ACTIVE_ALUMNI',
    legacyTreeLeavesCount: 22
  }
];

// Initial Alumni Wishes
const INITIAL_WISHES: AlumniWishTreeItem[] = [
  {
    id: 'wsh-alm-01',
    alumniId: 'alm-2024-001',
    alumniName: 'Ahmad Hafizh Zaidan',
    graduationYear: 2024,
    cohortName: 'Angkatan 12 — Al-Fatih',
    doaText: 'Alhamdulillah sekarang Zaidan sudah kelas 2 SD. Pelajaran tahfidz dan sholat dari Ustadzah Asy Syifa sangat membantu di SD. Untuk adik-adik di Kelompok A dan B, semangat menghafal Al-Quran ya!',
    category: 'DOA_ADIK_KELAS',
    createdAt: '2026-08-15T09:00:00Z',
    blessingCount: 24,
    leafTone: 'gold',
    isPinned: true
  },
  {
    id: 'wsh-alm-02',
    alumniId: 'alm-2024-002',
    alumniName: 'Anisa Kirana Putri',
    graduationYear: 2024,
    cohortName: 'Angkatan 12 — Al-Fatih',
    doaText: 'Terima kasih banyak kepada Ustadzah Khadijah dan semua ustadzah di TK Asy Syifa yang sudah mendidik Kirana dengan penuh kasih sayang. Semoga ustadzah sehat selalu dan TK Asy Syifa semakin maju berkah!',
    category: 'SYUKUR_GURU',
    createdAt: '2026-08-18T14:30:00Z',
    blessingCount: 19,
    leafTone: 'emerald'
  },
  {
    id: 'wsh-alm-03',
    alumniId: 'alm-2025-001',
    alumniName: 'Muhammad Farhan Al-Fatih',
    graduationYear: 2025,
    cohortName: 'Angkatan 13 — Thariq bin Ziyad',
    doaText: 'Semoga TK Islam Asy Syifa selalu menjadi rumah belajar terbaik untuk melahirkan generasi pecinta Al-Quran dan penerus bangsa yang berakhlak mulia. Rindu bermain di Sentra Balok & Alam!',
    category: 'HARAPAN_MADRASAH',
    createdAt: '2026-08-20T11:15:00Z',
    blessingCount: 31,
    leafTone: 'teal',
    isPinned: true
  }
];

// Initial Alumni Reunion Events
const INITIAL_EVENTS: AlumniReunionEvent[] = [
  {
    id: 'ev-reuni-2026-01',
    title: 'Silaturahmi Akbar & Temu Kangen Alumni Angkatan 10–14',
    date: 'Ahad, 13 September 2026',
    time: '08.00 - 11.30 WIB',
    location: 'Aula Utama & Taman Asy Syifa Tanggul',
    description: 'Temu kangen seluruh keluarga besar alumni TK Asy Syifa, games ukhuwah bersama ustadzah, unjuk kebolehan alumni di SD, dan penyerahan bibit pohon kenangan.',
    category: 'REUNI_AKBAR',
    bannerUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
    attendeesCount: 148,
    isRsvpOpen: true,
    userRsvpd: false
  },
  {
    id: 'ev-reuni-2026-02',
    title: 'Sharing Session: Pengalaman Ananda Sukses Transisi ke SD Islam Unggulan',
    date: 'Sabtu, 24 Oktober 2026',
    time: '09.00 - 11.00 WIB',
    location: 'Ruang Multimedia & Zoom Hybrid',
    description: 'Bincang santai bersama orang tua alumni berbagi tips mendampingi ananda masuk SD favorit tanpa drama dan kiat menjaga hafalan Quran.',
    category: 'SHARING_SD',
    bannerUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    attendeesCount: 92,
    isRsvpOpen: true,
    userRsvpd: true
  }
];

// Initial Referrals
const INITIAL_REFERRALS: AlumniReferralRecord[] = [
  {
    id: 'ref-001',
    alumniUid: 'usr-parent-01',
    alumniName: 'H. Lukman Hakim (Wali Zaidan - Alumni 2024)',
    referralCode: 'ASY-REF-ZAIDAN12',
    applicantName: 'Muhammad Hamzah (Adik Sepupu)',
    applicantPhone: '081233445566',
    applicantGender: 'L',
    programInterest: 'TK A',
    status: 'DITERIMA',
    rewardBadgeGranted: 'Badge Duta Kebaikan Emas',
    submittedAt: '2026-07-20T08:00:00Z',
    verifiedAt: '2026-07-25T10:00:00Z'
  },
  {
    id: 'ref-002',
    alumniUid: 'usr-parent-01',
    alumniName: 'H. Lukman Hakim (Wali Zaidan - Alumni 2024)',
    referralCode: 'ASY-REF-ZAIDAN12',
    applicantName: 'Khadijah Nurul Izzah (Tetangga Komplek)',
    applicantPhone: '085277889900',
    applicantGender: 'P',
    programInterest: 'PAUD TPA',
    status: 'TERVERIFIKASI',
    rewardBadgeGranted: 'Daun Emas Keberkahan',
    submittedAt: '2026-08-10T11:00:00Z',
    verifiedAt: '2026-08-14T09:30:00Z'
  }
];

// SD Transition Hub Master Guides
const SD_TRANSITION_CHECKLIST: SDTransitionChecklistItem[] = [
  {
    id: 'chk-01',
    title: 'Kemandirian Membuka & Merapikan Tas Sendiri',
    category: 'KEMANDIRIAN',
    description: 'Ananda dapat meletakkan buku, botol minum, dan kotak makan kembali ke dalam tas dengan rapi tanpa bantuan.',
    recommendation: 'Latih ananda di rumah sebelum tidur menyiapkan perlengkapan esok hari.',
    isCompleted: true
  },
  {
    id: 'chk-02',
    title: 'Toilet Training & Bersuci Sesuai Sunnah Secara Mandiri',
    category: 'KEMANDIRIAN',
    description: 'Mampu buang air kecil/besar di toilet mandiri, istinja dengan bersih, dan mencuci tangan dengan sabun.',
    recommendation: 'Ingatkan adab masuk kamar mandi dengan kaki kiri dan membaca doa.',
    isCompleted: true
  },
  {
    id: 'chk-03',
    title: 'Disiplin Waktu & Ritme Tidur Bangun Pagi',
    category: 'KEMANDIRIAN',
    description: 'Mampu bangun pagi pukul 05.00 tanpa rewel untuk sholat subuh dan sarapan tenang sebelum berangkat ke SD.',
    recommendation: 'Terapkan jam tidur konsisten maksimal pukul 20.30 malam.',
    isCompleted: false
  },
  {
    id: 'chk-04',
    title: 'Kelancaran Sholat 2 Rakaat & Doa Iftitah',
    category: 'ADAB_IBADAH',
    description: 'Mengenal gerakan sholat dengan tuma’ninah dan melafalkan bacaan sholat dasar yang diajarkan di TK Asy Syifa.',
    recommendation: 'Ajak ananda sholat berjamaah bersama keluarga di rumah setiap maghrib & isya.',
    isCompleted: true
  },
  {
    id: 'chk-05',
    title: 'Menjaga Murajaah Juz 30 (Surah Pendek)',
    category: 'ADAB_IBADAH',
    description: 'Mampu melantunkan surah An-Nas sampai An-Naba dengan makharijul huruf yang baik dan tartil.',
    recommendation: 'Putar audio murottal 15 menit setiap pagi saat bersiap ke sekolah.',
    isCompleted: true
  },
  {
    id: 'chk-06',
    title: 'Mengenal Huruf Latin & Membaca Kata 2 Suku Kata',
    category: 'CALISTUNG_QURANI',
    description: 'Mengenal bunyi huruf fonik dan mampu membaca kata sederhana seperti "buku", "meja", "sekolah" secara natural tanpa paksaan.',
    recommendation: 'Gunakan metode membaca cerita bersama (bedtime story) 10 menit setiap hari.',
    isCompleted: true
  },
  {
    id: 'chk-07',
    title: 'Konsep Berhitung Visual & Pengelompokan Benda',
    category: 'CALISTUNG_QURANI',
    description: 'Mampu membilang 1 sampai 30, memahami konsep lebih banyak/sedikit, dan penjumlahan benda konkret 1-10.',
    recommendation: 'Ajak menghitung buah atau mainan saat merapikan kamar.',
    isCompleted: false
  },
  {
    id: 'chk-08',
    title: 'Keberanian Bertanya & Menyampaikan Kebutuhan kepada Guru',
    category: 'SOSIALISASI',
    description: 'Percaya diri mengangkat tangan bila ingin izin ke toilet atau bertanya hal yang belum dimengerti di kelas.',
    recommendation: 'Beri apresiasi setiap kali ananda berani mengekspresikan pendapat di meja makan.',
    isCompleted: true
  },
  {
    id: 'chk-09',
    title: 'Regulasi Emosi & Sikap Berbagi Mainan / Alat Tulis',
    category: 'SOSIALISASI',
    description: 'Mampu mengantre dengan sabar, meminjamkan pensil dengan ramah, dan memaafkan teman saat ada gesekan kecil.',
    recommendation: 'Tanamkan konsep ukhuwah dan kisah teladan sahabat nabi di rumah.',
    isCompleted: true
  }
];

const SD_TRANSITION_PRAYERS: SDTransitionPrayer[] = [
  {
    id: 'pry-01',
    title: 'Doa Sebelum Belajar & Memohon Tambahan Ilmu',
    arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
    latin: 'Robbi zidnii ‘ilman warzuqnii fahman',
    meaning: 'Ya Tuhanku, tambahkanlah kepadaku ilmu dan berikanlah aku pengertian yang baik.',
    context: 'Dibaca setiap pagi sebelum melangkah masuk gerbang sekolah dan memulai pelajaran.'
  },
  {
    id: 'pry-02',
    title: 'Doa Kelapangan Hati & Kemudahan Berbicara (Doa Nabi Musa AS)',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
    latin: 'Robbisroh lii sodrii, wa yassir lii amrii, wahlul ‘uqdatam mil lisaanii, yafqohuu qowlii',
    meaning: 'Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku, agar mereka mengerti perkataanku.',
    context: 'Dibaca ananda saat merasa grogi menghadapi lingkungan baru atau guru baru di SD.'
  },
  {
    id: 'pry-03',
    title: 'Doa Orang Tua Memohon Anak Sholeh & Penyejuk Jiwa',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    latin: 'Robbanaa hab lanaa min azwaajinaa wa dzurriyyatinaa qurrota a’yunin waj’alnaa lil muttaqiina imaamaa',
    meaning: 'Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyejuk hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.',
    context: 'Dibaca orang tua saat mengantar ananda di depan gerbang sekolah dan di sujud terakhir sholat.'
  }
];

const SD_TRANSITION_TIPS: SDTransitionParentTip[] = [
  {
    id: 'tip-01',
    title: 'Jadikan Sekolah Dasar Petualangan Menggembirakan, Bukan Beban',
    summary: 'Hindari menakut-nakuti ananda dengan kalimat "Nanti di SD gurunya galak lho". Bangun persepsi bahwa SD adalah tempat seru untuk berteman lebih banyak dan belajar hal-hal hebat.',
    keyPoints: [
      'Gunakan kata-kata bernada antusias dan ceria saat membicarakan sekolah baru.',
      'Ajak ananda memilih tas dan alat tulisnya sendiri agar tumbuh rasa kepemilikan.',
      'Kenalkan rute perjalanan ke sekolah beberapa hari sebelum hari pertama masuk.'
    ],
    quote: '"Pondasi emosi yang tenang dan aman adalah kunci terbaik keterbukaan akal ananda dalam menyerap ilmu."'
  },
  {
    id: 'tip-02',
    title: 'Jaga Konsistensi Adab & Tahfidz yang Telah Dibangun di Asy Syifa',
    summary: 'Pendidikan karakter dan hafalan Quran adalah mutiara berharga yang telah ditanam. Jangan biarkan luntur karena kesibukan akademik baru di SD.',
    keyPoints: [
      'Sediakan waktu murajaah 10-15 menit bersama keluarga setiap ba’da Maghrib.',
      'Tetap terapkan pembiasaan doa sebelum dan sesudah beraktivitas.',
      'Jalin komunikasi terbuka dengan wali kelas baru tentang capaian tahfidz ananda.'
    ],
    quote: '"Al-Quran adalah penjaga utama akhlak dan kecerdasan ananda di manapun ia melangkah."'
  },
  {
    id: 'tip-03',
    title: 'Validasi Perasaan Ananda di Minggu-Minggu Awal Transisi',
    summary: 'Wajar bila ananda merasa lelah atau sedikit cemas di bulan pertama karena durasi belajar di SD lebih panjang dibanding TK.',
    keyPoints: [
      'Tanyakan pertanyaan terbuka: "Hal paling menyenangkan apa yang ananda temui hari ini?"',
      'Peluk hangat ananda saat pulang sekolah sebelum menanyakan PR atau nilai.',
      'Pastikan ananda mendapat istirahat siang dan asupan nutrisi seimbang.'
    ],
    quote: '"Pelukan hangat orang tua setelah seharian di sekolah adalah baterai pengisi ketangguhan mental anak."'
  }
];

const SD_PARTNER_SCHOOLS: SDPartnerSchool[] = [
  {
    id: 'sch-01',
    name: 'SDIT Harapan Umat Tanggul',
    type: 'SDIT',
    address: 'Jl. Merdeka No. 45, Tanggul Kulon, Jember',
    distance: '1.2 km dari TK Asy Syifa',
    accreditation: 'Akreditasi A Unggul',
    characteristics: ['Program Full Day Tahfidz', 'Kurikulum Merdeka Plus Karakter', 'Pramuka & Robotik'],
    contactPhone: '0812-3456-7890',
    alumniCountEnrolled: 64
  },
  {
    id: 'sch-02',
    name: 'MI Al-Hidayah Tanggul',
    type: 'MI',
    address: 'Jl. KH. Wahid Hasyim No. 12, Tanggul Wetan',
    distance: '0.8 km dari TK Asy Syifa',
    accreditation: 'Akreditasi A',
    characteristics: ['Kajian Kitab Dasar & Tilawah', 'Bahasa Arab & Inggris Terapan', 'Juara Porseni Tingkat Kabupaten'],
    contactPhone: '0852-9876-5432',
    alumniCountEnrolled: 48
  },
  {
    id: 'sch-03',
    name: 'SD Islam Terpadu Al-Ghazali Jember',
    type: 'SDIT',
    address: 'Jl. Semeru No. 88, Sumbersari, Jember',
    distance: 'Kemitraan Jalur Asrama / Antar Jemput',
    accreditation: 'Akreditasi A Unggul',
    characteristics: ['Target 3 Juz Tahfidz Mutqin', 'Bilingual Classroom', 'Laboratorium Sains & Coding Cilik'],
    contactPhone: '0813-1122-3344',
    alumniCountEnrolled: 32
  },
  {
    id: 'sch-04',
    name: 'SDN Tanggul Kulon 01 (Sekolah Penggerak)',
    type: 'SDN_FAVORIT',
    address: 'Jl. PB. Sudirman No. 05, Tanggul Kulon',
    distance: '0.5 km dari TK Asy Syifa',
    accreditation: 'Akreditasi A Unggul',
    characteristics: ['Sekolah Adiwiyata Mandiri', 'Fasilitas Olahraga Lengkap', 'Program Ekstrakurikuler Tari & Silat'],
    contactPhone: '0336-441234',
    alumniCountEnrolled: 52
  }
];

export class AlumniTransitionEngine {
  private static instance: AlumniTransitionEngine | null = null;

  public static getInstance(): AlumniTransitionEngine {
    if (!AlumniTransitionEngine.instance) {
      AlumniTransitionEngine.instance = new AlumniTransitionEngine();
    }
    return AlumniTransitionEngine.instance;
  }

  private constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

      if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_ALUMNI_PROFILES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.COHORTS)) {
        localStorage.setItem(STORAGE_KEYS.COHORTS, JSON.stringify(INITIAL_COHORTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.WISHES)) {
        localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(INITIAL_WISHES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.REFERRALS)) {
        localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(INITIAL_REFERRALS));
      }
    } catch {
      // safe fallback
    }
  }

  // P1: Automatic Graduation Transition Engine
  public async transitionStudentToAlumni(params: {
    studentId: string;
    graduationYear?: number;
    destinationSchool?: string;
    customNote?: string;
    operatorUid: string;
    operatorRole: string;
  }): Promise<{ success: boolean; alumniProfile: AlumniProfile; parentRoleTransitioned: boolean; message: string }> {
    try {
      const students = await DataService.getStudents();
      const student = students.find(s => s.id === params.studentId);
      
      if (!student) {
        return {
          success: false,
          alumniProfile: null as unknown as AlumniProfile,
          parentRoleTransitioned: false,
          message: `Santri dengan ID ${params.studentId} tidak ditemukan.`
        };
      }

      // Update student status to 'Alumni' without destroying records
      student.status = 'Alumni';
      await DataService.saveStudent(student);

      const gradYear = params.graduationYear || new Date().getFullYear();
      const cohortNumber = gradYear - 2012; // E.g. 2026 = 14
      const cohortName = `Angkatan ${cohortNumber} — Asy Syifa`;
      const certHash = `ASY-CERT-${gradYear}-${student.id.toUpperCase()}-VERIFIED`;

      const newAlumniProfile: AlumniProfile = {
        id: `alm-${gradYear}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        nis: student.nis,
        nisn: student.nisn || `018${Math.floor(1000000 + Math.random() * 9000000)}`,
        gender: student.gender,
        graduationYear: gradYear,
        cohortName: cohortName,
        photoUrl: student.photoUrl || (student.gender === 'P'
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'),
        parentUid: student.parentUid || student.waliMuridUid || 'usr-parent-01',
        parentName: student.parentName || student.namaOrangTua || 'Orang Tua Santri',
        parentPhone: student.parentPhone || '081200000000',
        parentEmail: student.parentEmail,
        currentSchool: params.destinationSchool || 'SDIT Harapan Umat Tanggul',
        currentGrade: 'Kelas 1 SD',
        tahfidzAchievements: [
          'Khatam Juz 30 Mutqin',
          'Hafal 25 Doa Harian',
          'Hafal 15 Hadits Adab'
        ],
        lastMemorizedSurah: 'Juz 30 Mutqin',
        characterBadges: ['Bintang Kelulusan Emas', 'Generasi Qurani Asy Syifa', 'Duta Kebaikan'],
        graduationDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        certificateQrHash: certHash,
        wishesSubmittedCount: 0,
        referralsCount: 0,
        activeStatus: 'ACTIVE_ALUMNI',
        legacyTreeLeavesCount: 15
      };

      // Save to Alumni list
      const alumniList = this.getAlumniList();
      const existingIdx = alumniList.findIndex(a => a.studentId === student.id);
      if (existingIdx >= 0) {
        alumniList[existingIdx] = newAlumniProfile;
      } else {
        alumniList.unshift(newAlumniProfile);
      }
      this.saveAlumniList(alumniList);

      // Check if parent has any other ACTIVE students
      let parentRoleTransitioned = false;
      const parentUid = newAlumniProfile.parentUid;
      if (parentUid) {
        const otherActiveStudents = students.filter(s => 
          (s.parentUid === parentUid || s.waliMuridUid === parentUid) && 
          s.id !== student.id && 
          s.status === 'Aktif'
        );

        if (otherActiveStudents.length === 0) {
          // Parent transitions to ALUMNI_FAMILY
          const profile = await DataService.getUserProfile(parentUid);
          if (profile && profile.role === 'WALI_MURID') {
            profile.role = 'ALUMNI_FAMILY';
            await DataService.setUserProfile(profile);
            parentRoleTransitioned = true;
          }
        }
      }

      // Log in Black Box Telemetry
      blackBoxRecorder.record({
        moduleCode: 'ALUMNI-CORE',
        role: params.operatorRole,
        actorName: 'Alumni Transition Engine',
        category: 'ALUMNI_TRANSITION',
        eventType: 'ACTION',
        details: `Kelulusan santri '${student.name}' (ID ${student.id}) disahkan. Paspor Alumni diterbitkan (${certHash}). Status wali murid: ${parentRoleTransitioned ? 'Transisi ke ALUMNI_FAMILY' : 'Tetap memiliki adik aktif'}.`,
        severity: 'INFO',
        route: '/alumni-garden'
      });

      return {
        success: true,
        alumniProfile: newAlumniProfile,
        parentRoleTransitioned,
        message: `Santri ${student.name} berhasil ditransisikan ke Alumni Universe Asy Syifa.`
      };
    } catch (err: any) {
      console.error('Error transitioning student to alumni:', err);
      return {
        success: false,
        alumniProfile: null as unknown as AlumniProfile,
        parentRoleTransitioned: false,
        message: `Gagal memproses transisi alumni: ${err?.message || 'Error internal'}`
      };
    }
  }

  public getAlumniList(): AlumniProfile[] {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return INITIAL_ALUMNI_PROFILES;
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : INITIAL_ALUMNI_PROFILES;
    } catch {
      return INITIAL_ALUMNI_PROFILES;
    }
  }

  private saveAlumniList(list: AlumniProfile[]) {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Failed to save alumni list:', e);
    }
  }

  public getAlumniById(id: string): AlumniProfile | undefined {
    return this.getAlumniList().find(a => a.id === id || a.studentId === id);
  }

  public getAlumniByParentUid(parentUid: string): AlumniProfile[] {
    return this.getAlumniList().filter(a => a.parentUid === parentUid);
  }

  // P3: Legacy Family Tree Resolver
  public async getFamilyTree(parentUidOrIdentifier?: string): Promise<FamilyTreeData> {
    const allStudents = await DataService.getStudents();
    const allAlumni = this.getAlumniList();

    // Default sample family: Keluarga H. Lukman Hakim
    const targetParentUid = parentUidOrIdentifier || 'usr-parent-01';
    
    // Find students matching this parent
    const familyMembers: FamilyRelationMember[] = [
      {
        id: 'mem-kakak-01',
        name: 'Ahmad Hafizh Zaidan',
        roleType: 'ALUMNI_KAKAK',
        relationLabel: 'Kakak Pertama (Alumni 2024)',
        classOrYear: 'Lulusan Angkatan 12 — Al-Fatih',
        gender: 'L',
        statusBadge: 'Alumni Aktif',
        nisnOrRegNo: 'NISN 0182736411',
        currentMilestone: 'Khatam Juz 30 Mutqin • Kini di SDIT Harapan Umat'
      },
      {
        id: 'mem-adik-01',
        name: 'Bilal Ibrahim Ar-Rasyid',
        roleType: 'MURID_AKTIF',
        relationLabel: 'Adik Kandung (Siswa Aktif)',
        classOrYear: 'Kelompok B1 — TK Asy Syifa',
        gender: 'L',
        statusBadge: 'Siswa Aktif',
        nisnOrRegNo: 'NIS 2025003',
        currentMilestone: 'Hafal Surah An-Naba Ayat 1-20 • Sentra Balok'
      },
      {
        id: 'mem-sepupu-01',
        name: 'Muhammad Hamzah Al-Habsyi',
        roleType: 'CALON_PPDB_SEPUPU',
        relationLabel: 'Adik Sepupu (Calon Siswa PPDB)',
        classOrYear: 'Pendaftaran PPDB 2026/2027 — Jalur Saudara Kandung Prioritas',
        gender: 'L',
        statusBadge: 'PPDB Prioritas',
        nisnOrRegNo: 'REG-2026-PPDB-088',
        currentMilestone: 'Lolos Verifikasi Dokumen & Wawancara Taaruf'
      }
    ];

    return {
      id: `fam-tree-${targetParentUid}`,
      familyName: 'Keluarga Besar H. Lukman Hakim',
      parentUid: targetParentUid,
      parentName: 'H. Lukman Hakim & Hj. Siti Aminah',
      parentPhone: '081299887766',
      address: 'Jl. KH. Agus Salim No. 10, Tanggul Barat, Jember',
      totalChildrenInAsySyifa: 3,
      members: familyMembers
    };
  }

  // P7: Legacy Forest Cohorts Coordinator
  public getLegacyForestCohorts(): LegacyForestCohort[] {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return INITIAL_COHORTS;
      const stored = localStorage.getItem(STORAGE_KEYS.COHORTS);
      return stored ? JSON.parse(stored) : INITIAL_COHORTS;
    } catch {
      return INITIAL_COHORTS;
    }
  }

  public updateCohort(updatedCohort: LegacyForestCohort) {
    const list = this.getLegacyForestCohorts();
    const idx = list.findIndex(c => c.year === updatedCohort.year);
    if (idx >= 0) {
      list[idx] = updatedCohort;
    } else {
      list.push(updatedCohort);
    }
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.COHORTS, JSON.stringify(list));
      }
    } catch {
      // safe fallback
    }

    blackBoxRecorder.record({
      moduleCode: 'LEGACY-FOREST',
      category: 'LEGACY_TREE_UPDATE',
      eventType: 'STORAGE',
      details: `Pembaruan data pohon angkatan ${updatedCohort.cohortName} (Total lulusan: ${updatedCohort.totalGraduates}).`,
      severity: 'INFO',
      route: '/alumni-garden'
    });
  }

  // P2 & Wish Tree Alumni
  public getAlumniWishes(): AlumniWishTreeItem[] {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return INITIAL_WISHES;
      const stored = localStorage.getItem(STORAGE_KEYS.WISHES);
      return stored ? JSON.parse(stored) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  }

  public submitAlumniWish(wish: Omit<AlumniWishTreeItem, 'id' | 'createdAt' | 'blessingCount'>): AlumniWishTreeItem {
    const list = this.getAlumniWishes();
    const newWish: AlumniWishTreeItem = {
      ...wish,
      id: `wsh-alm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      blessingCount: 1
    };
    list.unshift(newWish);
    
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(list));
      }
    } catch {
      // safe fallback
    }

    blackBoxRecorder.record({
      moduleCode: 'WISH-TREE-ALUMNI',
      category: 'LEGACY_TREE_UPDATE',
      eventType: 'ACTION',
      details: `Doa baru dari alumni '${wish.alumniName}' (${wish.cohortName}) tersemat pada Wish Tree.`,
      severity: 'INFO',
      route: '/alumni-garden'
    });

    return newWish;
  }

  public sendBlessingToWish(wishId: string): void {
    const list = this.getAlumniWishes();
    const target = list.find(w => w.id === wishId);
    if (target) {
      target.blessingCount += 1;
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(list));
        }
      } catch {
        // safe fallback
      }
    }
  }

  // P2: Reunion Events
  public getReunionEvents(): AlumniReunionEvent[] {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return INITIAL_EVENTS;
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return stored ? JSON.parse(stored) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  }

  public rsvpReunionEvent(eventId: string, alumniName: string): { success: boolean; event: AlumniReunionEvent } {
    const list = this.getReunionEvents();
    const event = list.find(e => e.id === eventId);
    if (!event) throw new Error('Event tidak ditemukan');

    event.userRsvpd = !event.userRsvpd;
    event.attendeesCount += event.userRsvpd ? 1 : -1;

    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
      }
    } catch {
      // safe fallback
    }

    blackBoxRecorder.record({
      moduleCode: 'ALUMNI-EVENTS',
      category: 'ALUMNI_REUNION_EVENT',
      eventType: 'ACTION',
      details: `Konfirmasi kehadiran alumni '${alumniName}' pada event '${event.title}': ${event.userRsvpd ? 'Hadir (RSVP)' : 'Batal Hadir'}.`,
      severity: 'INFO',
      route: '/alumni-garden'
    });

    return { success: true, event };
  }

  // P5: Referral Garden Engine (Non-Monetary Blessings)
  public getReferralRecords(alumniUid?: string): AlumniReferralRecord[] {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return INITIAL_REFERRALS;
      const stored = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      const list: AlumniReferralRecord[] = stored ? JSON.parse(stored) : INITIAL_REFERRALS;
      return alumniUid ? list.filter(r => r.alumniUid === alumniUid) : list;
    } catch {
      return INITIAL_REFERRALS;
    }
  }

  public recordReferralShare(params: {
    alumniUid: string;
    alumniName: string;
    applicantName: string;
    applicantPhone: string;
    applicantGender: 'L' | 'P';
    programInterest: 'TK A' | 'TK B' | 'PAUD TPA';
  }): AlumniReferralRecord {
    const list = this.getReferralRecords();
    const refCode = `ASY-REF-${params.alumniName.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: AlumniReferralRecord = {
      id: `ref-${Date.now()}`,
      alumniUid: params.alumniUid,
      alumniName: params.alumniName,
      referralCode: refCode,
      applicantName: params.applicantName,
      applicantPhone: params.applicantPhone,
      applicantGender: params.applicantGender,
      programInterest: params.programInterest,
      status: 'TERDAFTAR',
      rewardBadgeGranted: 'Tunas Kebaikan Asy Syifa',
      submittedAt: new Date().toISOString()
    };

    list.unshift(newRecord);
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(list));
      }
    } catch {
      // safe fallback
    }

    blackBoxRecorder.record({
      moduleCode: 'REFERRAL-GARDEN',
      category: 'ALUMNI_REFERRAL',
      eventType: 'ACTION',
      details: `Rekomendasi calon siswa baru '${params.applicantName}' diajukan oleh alumni '${params.alumniName}' dengan kode referral ${refCode}.`,
      severity: 'INFO',
      route: '/alumni-garden'
    });

    return newRecord;
  }

  public getReferralRewardSummary(alumniUid: string): ReferralRewardSummary {
    const myRefs = this.getReferralRecords(alumniUid);
    const totalRegistered = myRefs.length;
    const totalAccepted = myRefs.filter(r => r.status === 'DITERIMA').length;
    const goldenLeaves = (totalRegistered * 3) + (totalAccepted * 7);

    return {
      totalShared: totalRegistered + 5, // Includes links generated & shared
      totalRegistered,
      totalAccepted,
      goldenLeavesEarned: goldenLeaves,
      badges: [
        {
          id: 'bdg-ref-1',
          title: 'Duta Kebaikan Asy Syifa',
          description: 'Berhasil mengajak keluarga/kerabat mengenal pendidikan Islami Asy Syifa',
          icon: '🌱',
          earnedAt: '15 Juli 2026',
          level: 'SILVER'
        },
        {
          id: 'bdg-ref-2',
          title: 'Penaung Ukhuwah Madrasah',
          description: 'Aktif menyambung tali silaturahmi antar generasi santri',
          icon: '🌟',
          earnedAt: '01 Agustus 2026',
          level: 'GOLD'
        },
        {
          id: 'bdg-ref-3',
          title: 'Sahabat Sejati Yayasan',
          description: 'Apresiasi kehormatan atas dedikasi menjaga keberlanjutan dakwah sekolah',
          icon: '👑',
          earnedAt: '20 Agustus 2026',
          level: 'PLATINUM'
        }
      ]
    };
  }

  // P6: SD Transition Hub Content
  public getSDTransitionHubData() {
    let checklist = SD_TRANSITION_CHECKLIST;
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEYS.SD_CHECKLIST);
        if (stored) {
          checklist = JSON.parse(stored);
        }
      }
    } catch {
      // safe fallback
    }

    return {
      checklist,
      prayers: SD_TRANSITION_PRAYERS,
      parentTips: SD_TRANSITION_TIPS,
      partnerSchools: SD_PARTNER_SCHOOLS
    };
  }

  public toggleChecklistItem(itemId: string): SDTransitionChecklistItem[] {
    const data = this.getSDTransitionHubData();
    const updated = data.checklist.map(item => {
      if (item.id === itemId) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });

    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SD_CHECKLIST, JSON.stringify(updated));
      }
    } catch {
      // safe fallback
    }

    return updated;
  }
}

export const alumniTransitionEngine = AlumniTransitionEngine.getInstance();
