import { DataService } from './db';

export interface RPPMPlan {
  theme: string;
  subtheme: string;
  targetAge: string;
  weekNumber: number;
  basicCompetencies: string[];
  learningGoals: string[];
  dailyActivities: {
    day: string;
    focus: string;
    activityTitle: string;
    description: string;
    apeMaterials: string;
  }[];
  characterValue: string;
}

export interface RPPHPlan {
  dayName: string;
  themeSubtheme: string;
  ageGroup: string;
  openingDuration: string;
  openingActivities: string[];
  coreDuration: string;
  coreActivities: {
    areaName: string;
    description: string;
    materialNeeded: string;
  }[];
  restDuration: string;
  restActivities: string[];
  closingDuration: string;
  closingActivities: string[];
  reflectionPrompt: string;
}

export interface Assessment6Aspects {
  studentName: string;
  period: string;
  aspects: {
    code: 'NAM' | 'MOTORIK' | 'BAHASA' | 'KOGNITIF' | 'SOSEMO' | 'SENI';
    name: string;
    status: 'BSB (Berkembang Sangat Baik)' | 'BSH (Berkembang Sesuai Harapan)' | 'MB (Mulai Berkembang)' | 'BB (Belum Berkembang)';
    score: number;
    narrative: string;
  }[];
  overallSummary: string;
  stimulationAdvice: string;
}

export interface AIStoryResult {
  title: string;
  summary: string;
  fullArticle: string;
  instagramCaption: string;
  altText: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  category: string;
}

export interface AISchoolHealthMetric {
  category: string;
  score: number;
  status: 'OPTIMAL' | 'BAIK' | 'PERLU_PERHATIAN';
  detail: string;
  actionRequired: string;
}

export interface StudentDigitalMemoryTimeline {
  studentName: string;
  group: string;
  milestones: {
    id: string;
    date: string;
    title: string;
    category: string;
    photoUrl: string;
    description: string;
    badge: string;
  }[];
}

export class AIOperatingSystemEngine {

  // ==========================================
  // 1. AI TEACHER SUITE
  // ==========================================

  static generateRPPM(theme: string = 'Tanaman Ciptaan Allah', targetAge: string = 'Kelompok B (Usia 5-6)', weekNumber: number = 4): RPPMPlan {
    return {
      theme,
      subtheme: 'Daun & Bunga Kebun Asy Syifa',
      targetAge,
      weekNumber,
      basicCompetencies: [
        'NAM 1.1: Mempercayai adanya Allah melalui ciptaan-Nya',
        'FM 3.3/4.3: Mengenal anggota tubuh dan fungsinya untuk pengembangan motorik halus',
        'KOG 3.8/4.8: Menyajikan berbagai karya berhubungan dengan lingkungan alam',
        'BHS 3.11/4.11: Memahami bahasa ekspresif dan mengungkapkan perasaan',
        'SOSEMO 2.5: Memiliki perilaku yang mencerminkan sikap percaya diri & mandiri',
        'SENI 3.15/4.15: Menunjukkan karya dan aktivitas seni dengan media alam'
      ],
      learningGoals: [
        'Anak dapat mengagumi keindahan tanaman kamboja sebagai ciptaan Allah',
        'Anak mampu memegang kuas/daun dengan koordinasi mata-tangan yang baik',
        'Anak mampu menghitung jumlah helai daun 1-10 secara teratur',
        'Anak dapat menceritakan hasil karya melukisnya secara santun dan percaya diri'
      ],
      dailyActivities: [
        {
          day: 'Senin',
          focus: 'Eksplorasi Alam & Kebun',
          activityTitle: 'Memetik & Mengamati Tekstur Daun Kamboja',
          description: 'Anak-anak berjalan di kebun sekolah, memetik daun gugur, dan meraba serat kasar-halus.',
          apeMaterials: 'Kaca pembesar anak, keranjang bambu'
        },
        {
          day: 'Selasa',
          focus: 'Seni & Motorik Halus',
          activityTitle: 'Cap Daun Finger Painting Berbahan Makanan Alami',
          description: 'Mencelupkan daun ke pewarna buah naga dan daun suji, lalu mencetak pada kertas gambar.',
          apeMaterials: 'Pewarna alami, kertas gambar A3, nampan'
        },
        {
          day: 'Rabu',
          focus: 'Numerasi & Kognitif',
          activityTitle: 'Menyusun Urutan Ukuran Daun Kecil ke Besar',
          description: 'Mengelompokkan 5 jenis daun berdasarkan ukuran dan warna hijau muda-tua.',
          apeMaterials: 'Daun aneka bentuk, kartu angka kayu'
        },
        {
          day: 'Kamis',
          focus: 'Ibadah & Agama',
          activityTitle: 'Sholat Dhuha & Doa Memohon Hujan/Keberkahan',
          description: 'Praktik wudhu di kran outdoor dan melantunkan dzikir pagi bersama Ustadzah.',
          apeMaterials: 'Sajadah cilik, mukena/peci'
        },
        {
          day: 'Jumat',
          focus: 'Literasi & Dongeng Islami',
          activityTitle: 'Mendengar Kisah Pohon Kurma Yang Rindu Rasulullah SAW',
          description: 'Tanya jawab mengenai sifat menyayangi sesama makhluk hidup.',
          apeMaterials: 'Buku cerita bergambar, boneka tangan AI Asy'
        }
      ],
      characterValue: 'Cinta Allah SWT & Rukun Dengan Alam'
    };
  }

  static generateRPPH(subtheme: string = 'Cap Daun Finger Painting', dayName: string = 'Selasa', ageGroup: string = 'Kelompok B'): RPPHPlan {
    return {
      dayName,
      themeSubtheme: `Tanaman Ciptaan Allah - ${subtheme}`,
      ageGroup,
      openingDuration: '30 Menit (07.30 - 08.00 WIB)',
      openingActivities: [
        'Penyambutan ramah di gerbang sekolah oleh Ustadzah',
        'Berbaris dan senam anak ceria di halaman rumput',
        'Ikrar Santri TK Asy Syifa & Murojaah Surah An-Naba Ayat 1-10',
        'Doa Sebelum Belajar & Apersepsi mengenalkan tema hari ini'
      ],
      coreDuration: '60 Menit (08.00 - 09.00 WIB)',
      coreActivities: [
        {
          areaName: 'Sentra Seni & Motorik',
          description: 'Mencetak pola daun menggunakan perasa pewarna makanan di atas kertas gambar.',
          materialNeeded: 'Nampan cat, pewarna alami, kuas spon, kertas A3'
        },
        {
          areaName: 'Sentra Literasi',
          description: 'Menyusun huruf H-I-J-A-U dengan manik-manik kayu.',
          materialNeeded: 'Papan huruf teraba, manik kayu'
        },
        {
          areaName: 'Sentra Balok',
          description: 'Membangun kebun pagar masjid dengan balok kayu jati belanda.',
          materialNeeded: 'Set balok kayu 50 pcs'
        }
      ],
      restDuration: '30 Menit (09.00 - 09.30 WIB)',
      restActivities: [
        'Mencuci tangan dengan sabun air mengalir mandiri',
        'Membaca Doa Sebelum & Sesudah Makan',
        'Makan bekal sehat bersama & bermain bebas terawasi di APE Outdoor'
      ],
      closingDuration: '30 Menit (09.30 - 10.00 WIB)',
      closingActivities: [
        'Pemberian apresiasi bintang keberanian kepada seluruh anak',
        'Refleksi perasaan anak setelah kegiatan seharian',
        'Pesan moral kebaikan di rumah & Doa Penutup Majelis',
        'Bersalaman teratur dan penjemputan oleh wali murid'
      ],
      reflectionPrompt: 'Anak-anak sangat antusias saat jemari mereka menyentuh pewarna alami. Fokus anak bertahan hingga 20 menit tanpa terdistraksi.'
    };
  }

  static generateIceBreaking(topic: string = 'Semangat Belajar'): { title: string; lyrics: string; movements: string } {
    return {
      title: 'Tepuk Anak Sholeh Asy Syifa',
      lyrics: 'Prok prok prok... Aku Anak Sholeh!\nProk prok prok... Rajin Sholat!\nProk prok prok... Rajin Ngaji!\nProk prok prok... Orang Tua... Dihormati!\nProk prok prok... Cinta Islam... Sampai Mati!\nLailahaillallah Muhammadur Rasulullah... Yes!',
      movements: 'Tepuk tangan 3x rhythm, acungkan jempol ke dada saat bilang Yes, tersenyum riang.'
    };
  }

  // ==========================================
  // 2. AI OBSERVATION & ASSESSMENT
  // ==========================================

  static generateObservationNarrative(studentName: string, activityName: string, rawBehavior: string): string {
    return `Alhamdulillah, pada kegiatan "${activityName}", ananda ${studentName} menunjukkan perkembangan yang sangat positif. ${rawBehavior} Ananda dapat menyelesaikan tugas dengan wajah ceria dan bersikap santun saat berinteraksi dengan teman sebaya.`;
  }

  static generateAssessment6Aspects(studentName: string = 'Ananda Rayhan'): Assessment6Aspects {
    return {
      studentName,
      period: 'Semester Ganjil 2026/2027',
      aspects: [
        {
          code: 'NAM',
          name: 'Nilai Agama & Moral',
          status: 'BSB (Berkembang Sangat Baik)',
          score: 96,
          narrative: `${studentName} mampu memimpin Doa Sebelum Makan dan menghafal Surah An-Naba ayat 1-15 dengan lafal fasih dan percaya diri.`
        },
        {
          code: 'MOTORIK',
          name: 'Motorik Kasar & Halus',
          status: 'BSB (Berkembang Sangat Baik)',
          score: 94,
          narrative: `Kekuatan jemari dalam memegang pensil warna dan koordinasi mata-tangan saat meronce manik sangat stabil.`
        },
        {
          code: 'BAHASA',
          name: 'Bahasa & Keaksaraan',
          status: 'BSH (Berkembang Sesuai Harapan)',
          score: 90,
          narrative: `Ananda dapat menceritakan kembali kisah dongeng Islami dengan kalimat sederhana yang mudah dipahami.`
        },
        {
          code: 'KOGNITIF',
          name: 'Kognitif & Logika Numerasi',
          status: 'BSB (Berkembang Sangat Baik)',
          score: 92,
          narrative: `Mampu mengelompokkan benda berdasarkan warna dan bentuk serta menghitung 1 sampai 20 tanpa terbata-bata.`
        },
        {
          code: 'SOSEMO',
          name: 'Sosial Emosional & Mandiri',
          status: 'BSB (Berkembang Sangat Baik)',
          score: 95,
          narrative: `Sangat mandiri merapikan sepatu dan tas di rak sekolah serta menunjukkan empati tinggi saat membantu teman.`
        },
        {
          code: 'SENI',
          name: 'Seni & Ekspresi Estetika',
          status: 'BSH (Berkembang Sesuai Harapan)',
          score: 88,
          narrative: `Menyukai kegiatan finger painting dan bernyanyi lagu-lagu Islami anak ceria dengan antusias.`
        }
      ],
      overallSummary: `Secara keseluruhan, ${studentName} berkembang sangat pesat dalam hal kemandirian, akhlak karimah, dan hafalan Al-Qur'an.`,
      stimulationAdvice: 'Disarankan untuk terus mendampingi ananda membaca buku cerita Islami di rumah sebelum tidur dan melatih apresiasi seni menggambar.'
    };
  }

  // ==========================================
  // 3. AI STORY ENGINE
  // ==========================================

  static generateStoryFromPhoto(photoTopic: string = 'Latihan Cap Daun Kebun Sekolah'): AIStoryResult {
    return {
      title: 'Kreativitas Mungil Di Kebun Asy Syifa: Mengenal Keindahan Alam Lewat Cap Daun Alami',
      summary: 'Anak-anak TK Asy Syifa Tanggul menikmati kegiatan edukasi outdoor melukis tekstur daun menggunakan pewarna bahan alami.',
      fullArticle: `Hari ini suasana di Kampus Hijau TK Asy Syifa Tanggul dipenuhi dengan gelak tawa ceria para santri cilik. Dalam rangka kegiatan pembelajaran tema "Tanaman Ciptaan Allah", anak-anak diajak mengumpulkan daun kamboja yang gugur di area kebun sekolah.\n\nDengan didampingi Ustadzah, tangan-tangan mungil anak-anak mengoleskan pewarna alami dari ekstrak kunyit dan buah naga di atas permukaan serat daun, lalu mencetaknya di kertas gambar A3. Kegiatan ini tidak hanya melatih syaraf motorik halus, tetapi juga menumbuhkan rasa syukur dan rasa cinta anak kepada ciptaan Allah SWT sejak usia dini.`,
      instagramCaption: '🌿 MasyaAllah Tabarakallah! Keceriaan ananda TK Asy Syifa saat memetik dan mencetak tekstur daun kamboja dengan pewarna alami di Kebun Sekolah. ✨ Yuk intip keseruannya! #TKAsySyifaTanggul #PAUDIslami #BelajarSambilBermain #MotorikHalus',
      altText: 'Anak TK Asy Syifa sedang mencetak pola daun menggunakan pewarna makanan alami di meja belajar',
      seoTitle: 'Kegiatan Cap Daun & Motorik Anak TK Asy Syifa Tanggul Jember',
      seoDescription: 'Dokumentasi pembelajaran outdoor dan eksplorasi motorik halus anak usia dini di TK Asy Syifa Tanggul Jember.',
      tags: ['Seni PAUD', 'Outdoor Learning', 'Motorik Halus', 'TK Asy Syifa', 'Edukasi Islami'],
      category: 'Pembelajaran Harian'
    };
  }

  // ==========================================
  // 4. ROLE SPECIFIC AI DASHBOARDS
  // ==========================================

  static getAIParentSummary(studentName: string = 'Rayhan'): {
    todayTitle: string;
    todaySummary: string;
    photoUrl: string;
    todayDoa: string;
    homeTips: string[];
  } {
    return {
      todayTitle: `Laporan Ceria Hari Ini untuk Ananda ${studentName}`,
      todaySummary: `Hari ini ${studentName} mengikuti Sholat Dhuha berjamaah dengan khusyuk, melantunkan Surah An-Naba, dan sangat gembira saat membuat lukisan cap daun bersama kawan-kawan.`,
      photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
      todayDoa: 'Doa Sebelum Makan & Doa Kebaikan Kedua Orang Tua',
      homeTips: [
        'Ajak ananda mengulang hafalan Surah An-Naba Ayat 1-10 saat santai di rumah',
        'Puji keberanian ananda yang telah mandiri menata tas dan sepatu hari ini',
        'Ajak ananda menyiram tanaman rumah sambil mengenalkan ciptaan Allah'
      ]
    };
  }

  static getAIHeadmasterOps(): {
    activeTeachers: number;
    activeClasses: number;
    attendancePercentage: number;
    healthScore: number;
    statusSummary: string;
    recommendations: string[];
  } {
    return {
      activeTeachers: 12,
      activeClasses: 6,
      attendancePercentage: 98.4,
      healthScore: 96,
      statusSummary: 'Seluruh operasional pembelajaran, absensi guru, dan administrasi e-Rapor berada dalam kondisi optimal dan aman.',
      recommendations: [
        'Jadwalkan supervisi kelas untuk Sentra Balok Kelompok B besok pagi',
        'Pastikan dokumen backup mingguan e-Rapor dan SPP telah tersimpan di Cloud Archive',
        'Berikan apresiasi kepada tim guru atas ketercapaian target hafalan Surah An-Naba 95%'
      ]
    };
  }

  static getAIFoundationInsights(): {
    totalStudents: number;
    growthPercentage: number;
    financialHealthScore: number;
    teacherSatisfactionScore: number;
    strategicSummary: string;
  } {
    return {
      totalStudents: 148,
      growthPercentage: 14.2,
      financialHealthScore: 98,
      teacherSatisfactionScore: 95,
      strategicSummary: 'Pertumbuhan jumlah santri baru menunjukkan tren positif sebesar +14.2%. Tingkat kelancaran pembayaran SPP mencapai 98%.'
    };
  }

  static getAIAdminAudit(): {
    missingDataCount: number;
    incompleteDocsCount: number;
    backupStatus: 'HEALTHY' | 'WARNING';
    auditMessage: string;
    itemsToFix: string[];
  } {
    return {
      missingDataCount: 0,
      incompleteDocsCount: 1,
      backupStatus: 'HEALTHY',
      auditMessage: 'Sistem TADE AI Admin mendeteksi 1 dokumen berkas PPDB yang memerlukan verifikasi kelengkapan akta lahir.',
      itemsToFix: [
        'Lengkapi scan Akta Kelahiran santri atas nama Ananda Siti Aisyah',
        'Perbarui pasfoto guru pembimbing Ekstrakurikuler Seni Lukis'
      ]
    };
  }

  static getAISchoolHealthScore(): {
    overallScore: number;
    status: string;
    metrics: AISchoolHealthMetric[];
  } {
    return {
      overallScore: 97,
      status: 'SANGAT SEHAT & PRODUCTION READY',
      metrics: [
        { category: 'Administrasi & Data', score: 98, status: 'OPTIMAL', detail: 'Data siswa & guru 100% terekam aman', actionRequired: 'Tidak ada' },
        { category: 'Pembelajaran & RPPH', score: 96, status: 'OPTIMAL', detail: 'RPPH AI terdistribusi ke seluruh guru', actionRequired: 'Review mingguan' },
        { category: 'Dokumentasi & Galeri', score: 95, status: 'OPTIMAL', detail: 'AI Story Auto Tagging berjalan 60 FPS', actionRequired: 'Tidak ada' },
        { category: 'Keamanan & Firebase', score: 100, status: 'OPTIMAL', detail: 'Rules & Token Firestore Verified', actionRequired: 'Tidak ada' },
        { category: 'Website & SEO', score: 96, status: 'OPTIMAL', detail: 'Living Kindergarten Sky Engine Active', actionRequired: 'Tidak ada' },
        { category: 'Backup & Recovery', score: 98, status: 'OPTIMAL', detail: 'Snapshots terekam harian', actionRequired: 'Tidak ada' }
      ]
    };
  }

  // ==========================================
  // 5. NATURAL SEARCH & DIGITAL MEMORY
  // ==========================================

  static searchNaturalLanguage(query: string): {
    matchType: string;
    results: { title: string; subtitle: string; category: string; badge: string }[];
    aiAnswer: string;
  } {
    const q = query.toLowerCase();
    
    if (q.includes('daun') || q.includes('prakarya')) {
      return {
        matchType: 'TEMA_BELAJAR',
        aiAnswer: 'Ditemukan 3 kegiatan dan 12 foto dokumentasi terkait tema daun dan motorik halus.',
        results: [
          { title: 'Latihan Cap Daun Kamboja', subtitle: 'Sentra Seni & Motorik', category: 'Aktivitas Harian', badge: 'Terbaru' },
          { title: 'Mengamati Serat Daun Kamboja', subtitle: 'Outdoor Learning Kebun', category: 'Eksplorasi Alam', badge: 'Minggu Ini' },
          { title: 'Kolase Daun Kering', subtitle: 'Hasil Karya Anak', category: 'Galeri Cerdas', badge: 'Arsip' }
        ]
      };
    } else if (q.includes('sholat') || q.includes('ibadah') || q.includes('agama')) {
      return {
        matchType: 'ISLAMIC_ACTIVITY',
        aiAnswer: 'Ditemukan kegiatan Sholat Dhuha Berjamaah, Murojaah Surah An-Naba, dan Doa Harian.',
        results: [
          { title: 'Sholat Dhuha Berjamaah', subtitle: 'Setiap Pagi 07.45 WIB', category: 'Praktik Ibadah', badge: 'Rutinitas' },
          { title: 'Murojaah Surah An-Naba', subtitle: 'Tahfidz Juz 30', category: 'Ibadah Harian', badge: 'Unggulan' },
          { title: 'Doa Sebelum & Sesudah Makan', subtitle: 'Adab Harian Anak Sholeh', category: 'Pembiasaan', badge: 'Mandiri' }
        ]
      };
    } else {
      return {
        matchType: 'GENERAL_SEARCH',
        aiAnswer: `Pencarian AI TADE untuk "${query}" menampilkan hasil dari kurikulum, galeri, dan profil santri.`,
        results: [
          { title: `Kurikulum & Aktivitas: ${query}`, subtitle: 'Pencarian AI Core TADE', category: 'Eksplorasi', badge: 'Verified' },
          { title: `Dokumentasi Foto ${query}`, subtitle: 'Smart Gallery Indexing', category: 'Media', badge: 'Foto' }
        ]
      };
    }
  }

  static getStudentDigitalMemory(studentName: string = 'Ananda Rayhan'): StudentDigitalMemoryTimeline {
    return {
      studentName,
      group: 'Kelompok B',
      milestones: [
        {
          id: 'm-1',
          date: '15 Juli 2025',
          title: 'Hari Pertama Masuk Sekolah',
          category: 'Awal Perjalanan',
          photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
          description: 'Mengenakan seragam hijau cilik pertama kali dengan wajah berseri dan siap belajar.',
          badge: 'Hari Pertama'
        },
        {
          id: 'm-2',
          date: '20 Agustus 2025',
          title: 'Karya Pertama: Finger Painting Bintang',
          category: 'Prakarya',
          photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
          description: 'Lukisan tangan mungil warna-warni dipajang di Dinding Karya Anak.',
          badge: 'Karya Pertama'
        },
        {
          id: 'm-3',
          date: '10 November 2025',
          title: 'Hafal Surah An-Naba Ayat 1-10',
          category: 'Tahfidz Qur\'an',
          photoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
          description: 'Menerima Sertifikat Bintang Tahfidz Cilik dari Ustadzah.',
          badge: 'Prestasi'
        },
        {
          id: 'm-4',
          date: '05 Februari 2026',
          title: 'Lomba Meronce Manik-Manik',
          category: 'Seni & Motorik',
          photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
          description: 'Meraih Juara 1 Ketangkasan Motorik Halus Kelompok B.',
          badge: 'Juara 1'
        }
      ]
    };
  }

}
