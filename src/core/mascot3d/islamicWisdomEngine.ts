/**
 * TADE RC97 — R794: Islamic Wisdom Engine
 * Bank Konten Lokal Doa Harian Anak PAUD, Adab Santri, dan Mutiara Hikmah Islami
 * 100% lokal terkurasi dari kurikulum TK Islam terpercaya - tanpa koneksi luar
 */

export interface DailyDoaItem {
  id: string;
  title: string;
  category: 'DOA_HARIAN' | 'ADAB_SANTRI' | 'MOTIVASI_ISLAMI' | 'MUTIARA_HIKMAH';
  arabic: string;
  latin: string;
  translation: string;
  adabTips: string;
  contextUsage: string;
}

export class IslamicWisdomEngine {
  private static instance: IslamicWisdomEngine;

  private wisdomBank: DailyDoaItem[] = [
    {
      id: 'DOA-01',
      title: 'Doa Sebelum Belajar (Thalabul Ilmi)',
      category: 'DOA_HARIAN',
      arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
      latin: 'Robbi zidnii \'ilman warzuqnii fahman.',
      translation: 'Ya Allah, tambahkanlah ilmuku dan karuniakanlah kepadaku kepahaman yang luas.',
      adabTips: 'Duduk dengan tenang dan menengadahkan kedua tangan dengan penuh harap.',
      contextUsage: 'Dibaca sebelum memulai proses pembelajaran dan penginputan data kurikulum.'
    },
    {
      id: 'DOA-02',
      title: 'Doa untuk Kedua Orang Tua',
      category: 'DOA_HARIAN',
      arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      latin: 'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
      translation: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, sayangilah mereka sebagaimana mereka menyayangiku di waktu kecil.',
      adabTips: 'Mendoakan orang tua di setiap akhir sholat dan saat teringat kasih sayang mereka.',
      contextUsage: 'Pengingat bakti anak (Birrul Walidain) di modul Santri & Wali Murid.'
    },
    {
      id: 'DOA-03',
      title: 'Doa Sebelum Makan',
      category: 'DOA_HARIAN',
      arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
      latin: 'Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa \'adzaaban naar.',
      translation: 'Ya Allah, berkahilah rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa neraka.',
      adabTips: 'Mencuci tangan sebelum makan, duduk tegak, dan menggunakan tangan kanan.',
      contextUsage: 'Istirahat makan siang santri dan snack pagi.'
    },
    {
      id: 'DOA-04',
      title: 'Doa Sesudah Makan',
      category: 'DOA_HARIAN',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      latin: 'Alhamdulillahilladzii ath\'amanaa wa saqaanaa wa ja\'alanaa muslimiin.',
      translation: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang muslim.',
      adabTips: 'Membersihkan sisa makanan dan merapikan piring ke tempat cucian.',
      contextUsage: 'Selesai makan bersama di kelas PAUD.'
    },
    {
      id: 'DOA-05',
      title: 'Doa Kafaratul Majlis (Penutup Pertemuan)',
      category: 'DOA_HARIAN',
      arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
      latin: 'Subhaanaka Allahumma wa bihamdika asyhadu an laa ilaaha illaa anta astaghfiruka wa atuubu ilaik.',
      translation: 'Maha Suci Engkau ya Allah dan dengan memuji-Mu, aku bersaksi bahwa tiada Tuhan selain Engkau, aku memohon ampun dan bertaubat kepada-Mu.',
      adabTips: 'Dibaca di akhir setiap majlis, musyawarah rapat guru, atau jam kepulangan santri.',
      contextUsage: 'Penutup sesi SIM atau akhir hari kerja.'
    },
    {
      id: 'DOA-06',
      title: 'Doa Masuk Kelas / Ruangan',
      category: 'DOA_HARIAN',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ',
      latin: 'Allahumma innii as-aluka khoiral mawliji wa khoiral makhroji.',
      translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu sebaik-baik tempat masuk dan sebaik-baik tempat keluar.',
      adabTips: 'Melangkah dengan kaki kanan dan mengucapkan salam kepada ustadzah.',
      contextUsage: 'Awal masuk gerbang sekolah dan kelas.'
    },
    {
      id: 'ADAB-01',
      title: 'Adab Senyum & Menebar Salam',
      category: 'ADAB_SANTRI',
      arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
      latin: 'Tabassumuka fii wajhi akhiika laka shadaqah.',
      translation: 'Senyummu di hadapan saudaramu adalah (bernilai) sedekah bagimu (HR. Tirmidzi).',
      adabTips: 'Menyapa ustadzah, kawan santri, dan wali murid dengan senyum ramah dan salam santun.',
      contextUsage: 'Interaksi harian dan penyambutan santri pagi hari.'
    },
    {
      id: 'ADAB-02',
      title: 'Adab Menjaga Kebersihan & Kerapian',
      category: 'ADAB_SANTRI',
      arabic: 'النَّظَافَةُ مِنَ الْإِيمَانِ',
      latin: 'An-nadhaafatu minal iimaan.',
      translation: 'Kebersihan itu adalah sebagian dari iman.',
      adabTips: 'Merapikan kembali buku, balok mainan, dan krayon ke tempat semula setelah dipakai.',
      contextUsage: 'Budaya tertib kelas dan kebersihan sekolah.'
    },
    {
      id: 'ADAB-03',
      title: 'Adab Berbicara Lembut & Sopan',
      category: 'ADAB_SANTRI',
      arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
      latin: 'Man kaana yu\'minu billaahi wal yaumil aakhiri falyaqul khairan au liyashmut.',
      translation: 'Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam (HR. Bukhari).',
      adabTips: 'Menggunakan kata tolong, maaf, dan terima kasih saat berkomunikasi.',
      contextUsage: 'Pendidikan karakter akhlaqul karimah santri.'
    },
    {
      id: 'MOT-01',
      title: 'Man Jadda Wajada (Kesungguhan Belajar)',
      category: 'MOTIVASI_ISLAMI',
      arabic: 'مَنْ جَدَّ وَجَدَ',
      latin: 'Man jadda wajada.',
      translation: 'Barangsiapa yang bersungguh-sungguh, maka ia pasti akan berhasil.',
      adabTips: 'Tekun berlatih membaca Iqro dan menghafal surat pendek sedikit demi sedikit.',
      contextUsage: 'Apresiasi keberhasilan hafalan tahfidz dan tugas kelas.'
    },
    {
      id: 'MOT-02',
      title: 'Keberkahan Menuntut Ilmu',
      category: 'MUTIARA_HIKMAH',
      arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
      latin: 'Thalabul \'ilmi fariidhatun \'alaa kulli muslim.',
      translation: 'Menuntut ilmu itu wajib bagi setiap muslim (HR. Ibnu Majah).',
      adabTips: 'Belajar dengan niat ikhlas lillahi ta\'ala demi meraih ridha Allah.',
      contextUsage: 'Motivasi para pendidik guru PAUD dan santri cilik.'
    }
  ];

  private constructor() {}

  public static getInstance(): IslamicWisdomEngine {
    if (!IslamicWisdomEngine.instance) {
      IslamicWisdomEngine.instance = new IslamicWisdomEngine();
    }
    return IslamicWisdomEngine.instance;
  }

  public getAllWisdom(): DailyDoaItem[] {
    return [...this.wisdomBank];
  }

  public getByCategory(category: DailyDoaItem['category']): DailyDoaItem[] {
    return this.wisdomBank.filter(item => item.category === category);
  }

  public getRandomWisdom(category?: DailyDoaItem['category']): DailyDoaItem {
    const pool = category ? this.getByCategory(category) : this.wisdomBank;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  public searchWisdom(query: string): DailyDoaItem[] {
    if (!query || !query.trim()) return this.getAllWisdom();
    const q = query.toLowerCase().trim();
    return this.wisdomBank.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.latin.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.adabTips.toLowerCase().includes(q)
    );
  }
}
