export type DailyRoutineTime = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export type EventCategory =
  | 'COMPETITION'
  | 'FIELD_TRIP'
  | 'LUNCH_TOGETHER'
  | 'BIRTHDAY'
  | 'SCHOOL_ANNIVERSARY'
  | 'TEACHER_DAY'
  | 'GRADUATION'
  | 'SPORTS'
  | 'READING'
  | 'WRITING'
  | 'DRAWING'
  | 'GARDENING'
  | 'CLEANING'
  | 'RAMADAN'
  | 'KARTINI'
  | 'INDEPENDENCE'
  | 'ACADEMIC_GENERAL';

export interface LivingSchoolState {
  routine: DailyRoutineTime;
  eventCategory: EventCategory;
  activeSpeech: string;
  greeting: string;
  routineLabel: string;
  themeColor: string;
  bgGradient: string;
}

/**
 * Detect daily routine based on current time (0-23)
 */
export const getDailyRoutine = (date: Date = new Date()): DailyRoutineTime => {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'MORNING';
  if (hour >= 12 && hour < 17) return 'AFTERNOON';
  if (hour >= 17 && hour < 21) return 'EVENING';
  return 'NIGHT';
};

/**
 * Category-based Auto Detection for School Events
 * Supports both predefined event types and dynamic custom admin events
 */
export const detectEventCategory = (
  eventTypeStr: string = '',
  eventTitleStr: string = '',
  activeTabCode: string = ''
): EventCategory => {
  const type = eventTypeStr.toUpperCase();
  const title = eventTitleStr.toLowerCase();
  const tab = activeTabCode.toLowerCase();

  // 1. Direct EventType String Matching
  if (type === 'COLORING_COMPETITION' || type === 'ART_PERFORMANCE') return 'DRAWING';
  if (type === 'SCHOOL_TRIP') return 'FIELD_TRIP';
  if (type === 'GRADUATION') return 'GRADUATION';
  if (type === 'RAMADAN' || type === 'EID_FITR' || type === 'MANASIK') return 'RAMADAN';
  if (type === 'INDEPENDENCE_DAY') return 'INDEPENDENCE';
  if (type === 'TEACHERS_DAY' || type === 'TEACHER_BIRTHDAY') return 'TEACHER_DAY';
  if (type === 'SCHOOL_BIRTHDAY' || type === 'STUDENT_BIRTHDAY' || type === 'FOUNDATION_ANNIVERSARY') return 'BIRTHDAY';

  // 2. Keyword Auto-Categorization for Admin Custom Created Events
  if (title.includes('lomba') || title.includes('tanding') || title.includes('juara')) return 'COMPETITION';
  if (title.includes('trip') || title.includes('rihlah') || title.includes('wisata') || title.includes('kunjung')) return 'FIELD_TRIP';
  if (title.includes('makan') || title.includes('masak') || title.includes('bento') || title.includes('gizi')) return 'LUNCH_TOGETHER';
  if (title.includes('ultah') || title.includes('ulang tahun') || title.includes('milad') || title.includes('birthday')) return 'BIRTHDAY';
  if (title.includes('guru') || title.includes('ustadz')) return 'TEACHER_DAY';
  if (title.includes('wisuda') || title.includes('lulus') || title.includes('haflah')) return 'GRADUATION';
  if (title.includes('olahraga') || title.includes('senam') || title.includes('sehat') || title.includes('lari')) return 'SPORTS';
  if (title.includes('baca') || title.includes('literasi') || title.includes('perpustakaan')) return 'READING';
  if (title.includes('tulis') || title.includes('dikte') || title.includes('abjad')) return 'WRITING';
  if (title.includes('lukis') || title.includes('gambar') || title.includes('warna') || title.includes('prakarya')) return 'DRAWING';
  if (title.includes('kebun') || title.includes('tanam') || title.includes('pohon') || title.includes('bunga')) return 'GARDENING';
  if (title.includes('bersih') || title.includes('gotong royong') || title.includes('kerja bakti')) return 'CLEANING';
  if (title.includes('kartini') || title.includes('batik') || title.includes('adat')) return 'KARTINI';
  if (title.includes('merdeka') || title.includes('17 agustus') || title.includes('indonesia')) return 'INDEPENDENCE';
  if (title.includes('ramadan') || title.includes('puasa') || title.includes('muda') || title.includes('ngabuburit')) return 'RAMADAN';

  // 3. Tab Fallback
  if (tab === 'w18' || tab === 'r18') return 'DRAWING';
  if (tab === 'r28') return 'FIELD_TRIP';
  if (tab === 'r17') return 'RAMADAN';
  if (tab === 'r21') return 'COMPETITION';

  return 'ACADEMIC_GENERAL';
};

/**
 * Islamic & Child-Friendly Indonesian Speech Dictionary
 */
export const LIVING_SCHOOL_SPEECH: Record<DailyRoutineTime, Record<string, string[]>> = {
  MORNING: {
    ASY: [
      "Assalamu'alaikum Ayah, Bunda & Guru! Semangat pagi ceria di TK ASY SYIFA!",
      "Bismillah, Asy sudah siap belajar dan bermain bersama teman-teman hari ini!",
      "Selamat pagi! Mari kita awali hari dengan membaca doa dan senyum hangat."
    ],
    ASYAH: [
      "Assalamu'alaikum Ayah & Bunda tersayang! Asyah siap mendampingi pagi ini.",
      "Selamat pagi penuh berkah! Semoga hari ini dilimpahi kesehatan dan keceriaan.",
      "Bismillahirahmanirrahim, mari bersama membimbing ananda tercinta."
    ]
  },
  AFTERNOON: {
    ASY: [
      "Alhamdulillah, jam belajar siang berjalan lancar! Asy sedang istirahat sejenak.",
      "Jangan lupa makan siang bergizi dan cuci tangan sebelum makan ya!",
      "Siang cerah di sekolah! Asy siap membantu merekap data aktivitas ananda."
    ],
    ASYAH: [
      "Alhamdulillahirobbil 'alamin! Waktu siang yang tenang dan penuh kesyukuran.",
      "Mari periksa kembali catatan harian santri cilik kita ya Ayah/Bunda.",
      "Asyah siap membantu memeriksa laporan perkembangannya."
    ]
  },
  EVENING: {
    ASY: [
      "Selamat sore Ayah, Bunda & Ustadzah! Waktu yang baik untuk membaca Al-Qur'an.",
      "Selamat beristirahat sore bersama keluarga di rumah ya.",
      "Masya Allah, hari yang produktif! Asy rapikan buku catatan sekolah dulu."
    ],
    ASYAH: [
      "Selamat sore penuh kedamaian. Jangan lupa muraja'ah hafalan ananda ya.",
      "Terima kasih atas segala bimbingan kasih sayang hari ini.",
      "Alhamdulillah, Asyah membantu menyiapkan jadwal untuk esok hari."
    ]
  },
  NIGHT: {
    ASY: [
      "Assalamu'alaikum, sudah malam nih! Saatnya istirahat tidur nyenyak ya.",
      "Jangan lupa membaca doa sebelum tidur dan berwudhu dulu.",
      "Selamat beristirahat nyenyak, sampai jumpa esok pagi insya Allah!"
    ],
    ASYAH: [
      "Selamat malam Ayah & Bunda. Semoga mimpi indah dan selalu dalam lindungan Allah SWT.",
      "Istirahat yang cukup agar esok hari kembali segar dan bersemangat.",
      "Subhanallah, sampai bertemu di esok pagi ceria ya!"
    ]
  }
};

export const CATEGORY_SPEECH_VARIATIONS: Record<EventCategory, string[]> = {
  COMPETITION: [
    "Semangat berlomba teman-teman! Jujur, berani, dan tampilkan kreasi terbaikmu!",
    "Barakallah! Asy dukung penuh dari pinggir lapangan! Kalian luar biasa!",
    "Bismillah, kalah menang yang penting belajar berani dan gembira!"
  ],
  FIELD_TRIP: [
    "Horeee! Rihlah Edukatif ke luar sekolah! Bawa topi, minum, dan selalu tertib ya!",
    "Masya Allah, indahnya alam ciptaan Allah SWT! Ayo amati bersama Asy!",
    "Tetap bergandengan tangan dan dengarkan arahan Ustadz/Ustadzah ya!"
  ],
  LUNCH_TOGETHER: [
    "Allahumma baarik lanaa fii maa razaqtanaa wa qinaa 'adzaaban naar. Mari makan bersama!",
    "Makan makanan sehat dan halal bersama teman-teman terasa nikmat sekali!",
    "Alhamdulillahilladzii ath'amanaa wa saqaanaa wa ja'alanaa minal muslimiin."
  ],
  BIRTHDAY: [
    "Barakallahu fii umrik! Semoga berkah umur, sehat selalu, dan jadi anak sholeh/sholehah!",
    "Selamat ulang tahun! Tambah rajin shalat, mengaji, dan makin sayang keluarga!",
    "Milad Said! Semoga selalu dalam naungan kasih sayang Allah SWT."
  ],
  SCHOOL_ANNIVERSARY: [
    "Milad Mabruk TK ASY SYIFA! Semoga semakin jaya dan penuh keberkahan!",
    "Bangga menjadi bagian dari keluarga besar sekolah tercinta!",
    "Terus mencetak generasi penghafal Al-Qur'an dan berakhlaq mulia."
  ],
  TEACHER_DAY: [
    "Jazakumullahu khairan Ibu/Bapak Guru pahlawan tanpa tanda jasa!",
    "Terima kasih atas keikhlasan dan kesabaran membimbing kami setiap hari.",
    "Semoga Allah SWT membalas seluruh kebaikan dan perjuangan Guru sekalian."
  ],
  GRADUATION: [
    "Selamat Wisuda Kakak Santri Cilik! Semoga sukses di jenjang sekolah berikutnya!",
    "Masya Allah, bangga sekali melihat Kakak memakai toga wisuda hari ini!",
    "Teruslah rajin belajar dan junjung tinggi akhlaqul karimah!"
  ],
  SPORTS: [
    "Ayo berolahraga agar tubuh sehat dan kuat! Badan kuat dicintai Allah!",
    "Senam ceria pagi bersama Asy! Satu, dua, tiga, empat!",
    "Olahraga bersama teman-teman sangat mengasyikkan!"
  ],
  READING: [
    "Iqra'! Bacalah dengan menyebut nama Tuhanmu! Asy suka sekali membaca buku storybook.",
    "Buku adalah jendela dunia! Mari budayakan membaca sejak dini.",
    "Asy sedang membaca cerita para Nabi yang penuh keteladanan."
  ],
  WRITING: [
    "Mari latihan menulis huruf dan angka dengan rapi ya!",
    "Pegang pensil dengan benar, kita tulis bismillah dulu sebelum mulai.",
    "Menulis rapi melatih ketelitian dan kesabaran anak pintar!"
  ],
  DRAWING: [
    "Mewarnai dan menggambar dengan warna-warni ceria pilihanmu!",
    "Masya Allah, kreasimu indah sekali! Bakat seni yang luar biasa!",
    "Asy pegang kuas dan cat air, yuk melukis pemandangan indah!"
  ],
  GARDENING: [
    "Menanam bunga dan menyiram tanaman sekolah! Merawat alam ciptaan Allah.",
    "Pohon dan tanaman memberikan udara segar untuk kita semua.",
    "Lihat! Bunga di taman sekolah mulai bermekaran indah sekali!"
  ],
  CLEANING: [
    "An-nazhafatu minal iiman! Kebersihan itu adalah sebagian dari iman.",
    "Gotong royong membersihkan kelas agar belajar jadi nyaman dan sehat!",
    "Sapu dan buang sampah pada tempatnya ya teman-teman."
  ],
  RAMADAN: [
    "Marhaban Ya Ramadan! Selamat menunaikan ibadah puasa dengan penuh sukacita.",
    "Yuk latihan puasa setengah hari dan semangat tadarus Al-Qur'an!",
    "Bulan penuh ampunan dan keberkahan untuk kita semua."
  ],
  KARTINI: [
    "Selamat Hari Kartini & Hari Adat Busana Nusantara!",
    "Bangga dengan kebudayaan Indonesia yang santun dan berakhlaq.",
    "Menjadi anak Indonesia yang cerdas, sholeh, dan berprestasi!"
  ],
  INDEPENDENCE: [
    "Dirgahayu Republik Indonesia! Merdeka! Semangat mencintai Tanah Air!",
    "Merah Putih berkibar bangga di lapangan sekolah kita!",
    "Mari kita isi kemerdekaan dengan belajar dan berbuat kebaikan!"
  ],
  ACADEMIC_GENERAL: [
    "Asy siap mendampingi penggunaan SIM TK ASY SYIFA!",
    "Semoga seluruh proses administrasi dan pembelajaran berjalan lancar.",
    "Ada yang bisa Asy bantu untuk pengerjaan tugas modul hari ini?"
  ]
};

/**
 * Generate Dynamic Living School Speech Phrase
 */
export const getLivingSchoolSpeech = (
  variant: 'ASY' | 'ASYAH',
  routine: DailyRoutineTime,
  eventCategory: EventCategory
): string => {
  if (eventCategory !== 'ACADEMIC_GENERAL') {
    const categoryList = CATEGORY_SPEECH_VARIATIONS[eventCategory] || CATEGORY_SPEECH_VARIATIONS.ACADEMIC_GENERAL;
    return categoryList[Math.floor(Math.random() * categoryList.length)];
  }

  const routineList = LIVING_SCHOOL_SPEECH[routine][variant] || LIVING_SCHOOL_SPEECH[routine].ASY;
  return routineList[Math.floor(Math.random() * routineList.length)];
};
