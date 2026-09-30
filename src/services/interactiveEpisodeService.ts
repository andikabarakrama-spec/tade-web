/**
 * TADE EPISODE INTERAKTIF ASY & SYIFA SERVICE — SPRINT G19
 * Interactive Story Engine with Morning Episodes, 2 Wholesome Branching Choices,
 * Companion Interactions, Animated Story Objects, "Buku Cerita Asy" Album,
 * Special School Event Episodes (LivingEventEngine), and Farewell Rituals.
 * 
 * Complies with:
 * - 60 FPS lightweight animations (via tadeAnimationGovernor)
 * - Dr. Pulse Health Passport Telemetry (Max 5 active animations)
 * - BlackBoxRecorder Telemetry Logging
 * - Single Source of Truth persistence
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeSoundEngine } from './tadeSoundEngine';
import { livingEventEngine, SchoolEventType, SchoolEventTheme } from './livingEventEngine';

export type CompanionId = 'BUBU' | 'GOGO' | 'MIMI' | 'DODO' | 'TITI' | 'RARA';

export interface LivingStoryObject {
  id: string;
  name: string;
  emoji: string;
  dialogueOrSound: string;
  action: 'SPEAK' | 'BLINK' | 'JUMP' | 'LAUGH' | 'SPARKLE';
}

export interface InteractiveChoice {
  id: string;
  label: string;
  emoji: string;
  description: string;
  outcomeScene: {
    title: string;
    narration: string;
    dialogue: {
      speaker: string;
      text: string;
      role: 'ASY' | 'SYIFA' | 'COMPANION' | 'LIVING_OBJECT';
    };
    propEmoji: string;
    moralValue: string;
    duaOrHadith: string;
    soundFx: 'MAGIC_SPARKLE' | 'CELEBRATION' | 'POP_WAGON' | 'TV_CLICK';
  };
}

export interface InteractiveEpisode {
  id: string;
  dayOfWeek: number; // 0: Ahad/Minggu, ..., 6: Sabtu
  dayName: string;
  title: string;
  subtitle: string;
  theme: string;
  category: 'HARIAN_PAGI' | 'EVENT_SPESIAL' | 'AKHLAK_CERIA';
  targetDurationSec: number; // 15-30s
  coverBg: string;
  featuredCompanion: CompanionId;
  livingObject: LivingStoryObject;
  introScene: {
    title: string;
    narration: string;
    dialogue: {
      speaker: string;
      text: string;
      role: 'ASY' | 'SYIFA' | 'COMPANION' | 'LIVING_OBJECT';
    };
    propEmoji: string;
  };
  climaxPrompt: {
    question: string;
    companionTip: string;
  };
  choices: [InteractiveChoice, InteractiveChoice];
  linkedSchoolEvent?: SchoolEventType;
}

export interface StoryCardRecord {
  id: string;
  episodeId: string;
  title: string;
  date: string;
  timestamp: string;
  chosenOptionId: string;
  chosenOptionLabel: string;
  chosenOptionEmoji: string;
  moralValue: string;
  duaOrHadith: string;
  companionName: string;
  companionEmoji: string;
  livingObjectName: string;
  livingObjectEmoji: string;
  badge: string;
}

const STORAGE_KEY_STORIES = 'tade_buku_cerita_asy_v1';
const STORAGE_KEY_LAST_PLAYED = 'tade_interactive_last_played_v1';

export const COMPANION_DATA: Record<CompanionId, { name: string; emoji: string; title: string; color: string; advicePhrase: string }> = {
  BUBU: { name: 'Bubu', emoji: '🐰', title: 'Kelinci Ceria Bersahabat', color: 'from-amber-400 to-orange-400', advicePhrase: '“Aku punya ide seru! Apapun pilihanmu, ayo lakukan dengan riang!”' },
  GOGO: { name: 'Gogo', emoji: '🐻', title: 'Beruang Penyabar & Hangat', color: 'from-amber-600 to-amber-700', advicePhrase: '“Tenang saja, teman-teman. Keduanya pilihan yang penuh kebaikan!”' },
  MIMI: { name: 'Mimi', emoji: '🐝', title: 'Lebah Rajin & Gemar Menolong', color: 'from-yellow-400 to-amber-500', advicePhrase: '“Bzz bzz! Bekerja bersama selalu menghasilkan senyuman manis!”' },
  DODO: { name: 'Dodo', emoji: '🦆', title: 'Bebek Ceria Suka Belajar', color: 'from-teal-400 to-emerald-500', advicePhrase: '“Kwek! Mari kita coba langkah baru dengan bismillah!”' },
  TITI: { name: 'Titi', emoji: '🐢', title: 'Kura-kura Bijak & Hati-hati', color: 'from-emerald-500 to-teal-600', advicePhrase: '“Pelan tapi pasti, niat baik selalu diridhoi Allah SWT.”' },
  RARA: { name: 'Rara', emoji: '🦜', title: 'Burung Ceria Suka Menyanyi', color: 'from-sky-400 to-blue-500', advicePhrase: '“Cuit cuit! Hari indah dimulai dengan hati yang gembira!”' }
};

export const DAILY_INTERACTIVE_EPISODES: InteractiveEpisode[] = [
  {
    id: 'ep_senin_bunga',
    dayOfWeek: 1,
    dayName: 'Senin Pagi',
    title: 'Asy & Syifa Mencari Bunga Indah',
    subtitle: 'Mengenal keindahan ciptaan Allah di halaman sekolah',
    theme: 'Mencintai Alam & Bersyukur',
    category: 'HARIAN_PAGI',
    targetDurationSec: 20,
    coverBg: 'from-emerald-400 via-teal-300 to-sky-400',
    featuredCompanion: 'BUBU',
    livingObject: {
      id: 'obj_tas',
      name: 'Tas Sekolah Asy',
      emoji: '🎒',
      dialogueOrSound: '“Klip klop! Tasku berkedip siap menampung bunga harum!”',
      action: 'BLINK'
    },
    introScene: {
      title: 'Pagi yang Sejuk di Halaman',
      narration: 'Matahari pagi bersinar hangat. Asy dan Syifa berjalan ke taman sekolah ditemani Bubu si Kelinci.',
      dialogue: {
        speaker: 'Asy',
        text: '“Lihat Syifa, ada kelopak bunga bermekaran di dekat pagar!”',
        role: 'ASY'
      },
      propEmoji: '🌸'
    },
    climaxPrompt: {
      question: 'Bunga mana yang ingin Asy & Syifa sapa terlebih dahulu?',
      companionTip: 'Bubu melompat riang: “Dua-duanya harum dan cantik sekali!”'
    },
    choices: [
      {
        id: 'opt_bunga_merah',
        label: 'Petik Bunga Merah',
        emoji: '🌺',
        description: 'Bunga mawar merah berseri yang harum semerbak.',
        outcomeScene: {
          title: 'Harum Mawar Merah',
          narration: 'Asy mengagumi bunga mawar merah yang mekar indah dan merawatnya dengan hati-hati.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Subhanallah! Warnanya cerah sekali, mari kita rawat bersama!”',
            role: 'SYIFA'
          },
          propEmoji: '🌺',
          moralValue: 'Menghargai keindahan alam dengan menjaga dan tidak merusaknya.',
          duaOrHadith: '“Sesungguhnya Allah itu Maha Indah dan mencintai keindahan.” (HR. Muslim)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_bunga_kuning',
        label: 'Sapa Bunga Matahari Kuning',
        emoji: '🌻',
        description: 'Bunga matahari kuning cerah yang tersenyum menghadap fajar.',
        outcomeScene: {
          title: 'Senyuman Bunga Matahari',
          narration: 'Syifa tersenyum lebar melihat bunga matahari kuning yang tinggi menjulang.',
          dialogue: {
            speaker: 'Asy',
            text: '“Bunga kuning ini tersenyum seperti mentari pagi kita!”',
            role: 'ASY'
          },
          propEmoji: '🌻',
          moralValue: 'Senantiasa tersenyum dan menebarkan keceriaan kepada sesama.',
          duaOrHadith: '“Senyummu di hadapan saudaramu adalah sedekah bagimu.” (HR. Tirmidzi)',
          soundFx: 'CELEBRATION'
        }
      }
    ]
  },
  {
    id: 'ep_selasa_berangkat',
    dayOfWeek: 2,
    dayName: 'Selasa Pagi',
    title: 'Perjalanan Pagi ke Sekolah',
    subtitle: 'Memilih cara berangkat dengan riang gembira',
    theme: 'Semangat Menuntut Ilmu',
    category: 'HARIAN_PAGI',
    targetDurationSec: 22,
    coverBg: 'from-amber-400 via-orange-300 to-rose-400',
    featuredCompanion: 'GOGO',
    livingObject: {
      id: 'obj_kereta',
      name: 'Kereta Cerita',
      emoji: '🚂',
      dialogueOrSound: '“Tut tuuut! Kereta Cerita bersiul menyapa teman-teman!”',
      action: 'SPEAK'
    },
    introScene: {
      title: 'Pemberangkatan Santri Ceria',
      narration: 'Lonceng sekolah berdentang lembut. Asy, Syifa, dan Gogo si Beruang siap berangkat.',
      dialogue: {
        speaker: 'Gogo',
        text: '“Udaranya segar sekali! Bagaimana kita menuju kelas hari ini?”',
        role: 'COMPANION'
      },
      propEmoji: '🏫'
    },
    climaxPrompt: {
      question: 'Bagaimana Asy & Syifa menuju ke gerbang sekolah?',
      companionTip: 'Gogo tersenyum: “Keduanya sangat asyik dan sehat!”'
    },
    choices: [
      {
        id: 'opt_naik_kereta',
        label: 'Naik Kereta Cerita',
        emoji: '🚂',
        description: 'Menaiki gerbong warna-warni sambil bernyanyi riang.',
        outcomeScene: {
          title: 'Petualangan di Kereta Cerita',
          narration: 'Kereta melaju perlahan membawa tawa riang santri melintasi jembatan pelangi.',
          dialogue: {
            speaker: 'Asy & Syifa',
            text: '“Tut tuuut! Bersama-sama naik kereta, hatipun jadi gembira!”',
            role: 'ASY'
          },
          propEmoji: '🚂',
          moralValue: 'Kebersamaan dan saling berbagi tempat duduk dengan santun.',
          duaOrHadith: '“Bismillahi majreha wa mursaha, inna Rabbi laghafurur rahim.” (Doa Naik Kendaraan)',
          soundFx: 'POP_WAGON'
        }
      },
      {
        id: 'opt_jalan_kaki',
        label: 'Jalan Kaki Menikmati Pagi',
        emoji: '🚶‍♂️',
        description: 'Berjalan langkah demi langkah sambil menyapa pepohonan.',
        outcomeScene: {
          title: 'Langkah Sehat & Bugar',
          narration: 'Asy dan Syifa melangkah dengan langkah tegap, menghirup udara bersih embun pagi.',
          dialogue: {
            speaker: 'Gogo',
            text: '“Setiap langkah kita ke majelis ilmu bernilai pahala berlipat!”',
            role: 'COMPANION'
          },
          propEmoji: '👟',
          moralValue: 'Menjaga kesehatan tubuh dan kebugaran jasmani.',
          duaOrHadith: '“Mukmin yang kuat lebih dicintai Allah daripada mukmin yang lemah.” (HR. Muslim)',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ]
  },
  {
    id: 'ep_rabu_bantu',
    dayOfWeek: 3,
    dayName: 'Rabu Pagi',
    title: 'Menolong Sahabat di Kebun Buah',
    subtitle: 'Belajar tolong-menolong tanpa pamrih',
    theme: 'Tolong Menolong & Kasih Sayang',
    category: 'HARIAN_PAGI',
    targetDurationSec: 20,
    coverBg: 'from-teal-400 via-emerald-300 to-lime-400',
    featuredCompanion: 'MIMI',
    livingObject: {
      id: 'obj_keranjang',
      name: 'Keranjang Bambu Ajaib',
      emoji: '🧺',
      dialogueOrSound: '“Syuut! Keranjang bergoyang siap memuat buah manis!”',
      action: 'JUMP'
    },
    introScene: {
      title: 'Pohon Buah Berbuah Lebat',
      narration: 'Di kebun buah sekolah, Mimi si Lebah dan teman-teman sedang memanen hasil kebun.',
      dialogue: {
        speaker: 'Mimi',
        text: '“Bzz bzz! Banyak buah ranum yang siap dipetik hari ini!”',
        role: 'COMPANION'
      },
      propEmoji: '🍎'
    },
    climaxPrompt: {
      question: 'Siapa sahabat yang ingin Asy & Syifa bantu terlebih dahulu?',
      companionTip: 'Mimi terbang berputar: “Membantu siapa saja selalu membawa berkah!”'
    },
    choices: [
      {
        id: 'opt_bantu_bubu',
        label: 'Bantu Bubu Memetik Apel',
        emoji: '🍎',
        description: 'Mengambil buah apel merah manis di dahan bawah.',
        outcomeScene: {
          title: 'Panen Apel Berkah',
          narration: 'Asy membantu Bubu memetik 3 buah apel merah yang berkilau ranum.',
          dialogue: {
            speaker: 'Bubu',
            text: '“Alhamdulillah! Terima kasih Asy, apelnya manis dan segar sekali!”',
            role: 'COMPANION'
          },
          propEmoji: '🍎',
          moralValue: 'Suka menolong teman yang sedang membutuhkan bantuan.',
          duaOrHadith: '“Dan tolong-menolonglah kamu dalam mengerjakan kebajikan dan takwa.” (QS. Al-Maidah: 2)',
          soundFx: 'CELEBRATION'
        }
      },
      {
        id: 'opt_bantu_dodo',
        label: 'Bantu Dodo Mengumpulkan Jeruk',
        emoji: '🍊',
        description: 'Menyusun buah jeruk manis ke dalam keranjang kayu.',
        outcomeScene: {
          title: 'Jeruk Manis Kebersamaan',
          narration: 'Syifa bersama Dodo menyusun jeruk dengan rapi dan teratur.',
          dialogue: {
            speaker: 'Dodo',
            text: '“Kwek! Keranjang kita penuh dengan buah jeruk yang kaya vitamin!”',
            role: 'COMPANION'
          },
          propEmoji: '🍊',
          moralValue: 'Ketelitian, kerapian, dan rasa syukur atas rezeki makanan sehat.',
          duaOrHadith: '“Makanlah dari rezeki yang baik yang telah Kami berikan kepadamu.” (QS. Al-Baqarah: 172)',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ]
  },
  {
    id: 'ep_kamis_buku',
    dayOfWeek: 4,
    dayName: 'Kamis Pagi',
    title: 'Membaca Kisah di Pojok Baca',
    subtitle: 'Membuka lembaran hikmah dan keteladanan',
    theme: 'Gemar Membaca & Menuntut Ilmu',
    category: 'HARIAN_PAGI',
    targetDurationSec: 22,
    coverBg: 'from-sky-400 via-indigo-300 to-purple-400',
    featuredCompanion: 'TITI',
    livingObject: {
      id: 'obj_pensil',
      name: 'Pensil Ajaib Pelangi',
      emoji: '✏️',
      dialogueOrSound: '“Ting! Pensil melompat gembira menggarisbawahi huruf bijak!”',
      action: 'JUMP'
    },
    introScene: {
      title: 'Pojok Baca Bersinar',
      narration: 'Titi si Kura-kura duduk dengan tenang membuka buku cerita tebal bergambar.',
      dialogue: {
        speaker: 'Titi',
        text: '“Ada dua kisah teladan yang sangat bagus untuk kita baca hari ini!”',
        role: 'COMPANION'
      },
      propEmoji: '📖'
    },
    climaxPrompt: {
      question: 'Kisah apa yang ingin Asy & Syifa buka lembarannya?',
      companionTip: 'Titi berkedip bijak: “Keduanya penuh dengan hikmah kebaikan!”'
    },
    choices: [
      {
        id: 'opt_kisah_sahabat',
        label: 'Kisah Sahabat Nabi yang Dermawan',
        emoji: '🌟',
        description: 'Membaca keteladanan berbagi dan kebaikan hati para sahabat.',
        outcomeScene: {
          title: 'Keteladanan Hati Emas',
          narration: 'Asy dan Syifa mendengarkan kisah kedermawanan para sahabat dengan takzim.',
          dialogue: {
            speaker: 'Asy',
            text: '“Aku ingin meniru sifat rajin bersedekah dan menyayangi sesama!”',
            role: 'ASY'
          },
          propEmoji: '🌟',
          moralValue: 'Kedermawanan dan keikhlasan dalam bersedekah.',
          duaOrHadith: '“Tangan di atas lebih baik daripada tangan di bawah.” (HR. Bukhari)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_kisah_hewan',
        label: 'Kisah Semut & Burung Pipit',
        emoji: '🐜',
        description: 'Dongeng tentang gotong royong dan kesetiaan sahabat.',
        outcomeScene: {
          title: 'Kekuatan Gotong Royong',
          narration: 'Syifa tersenyum melihat bagaimana semut kecil saling menopang membawa rezeki.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Walau bertubuh kecil, bila bersatu kita bisa melakukan hal besar!”',
            role: 'SYIFA'
          },
          propEmoji: '🐜',
          moralValue: 'Pentingnya kerja sama, persatuan, dan kerukunan.',
          duaOrHadith: '“Orang beriman dengan orang beriman lainnya bagaikan satu bangunan yang saling menguatkan.” (HR. Bukhari)',
          soundFx: 'CELEBRATION'
        }
      }
    ]
  },
  {
    id: 'ep_jumat_masjid',
    dayOfWeek: 5,
    dayName: 'Jumat Pagi',
    title: 'Hari Jumat Berkah di Masjid',
    subtitle: 'Mempersiapkan amalan terbaik di sayyidul ayyam',
    theme: 'Kebersihan, Sholat & Infaq',
    category: 'HARIAN_PAGI',
    targetDurationSec: 24,
    coverBg: 'from-emerald-500 via-teal-400 to-green-600',
    featuredCompanion: 'RARA',
    livingObject: {
      id: 'obj_peci',
      name: 'Peci Hijau Berkah',
      emoji: '🕌',
      dialogueOrSound: '“Kilau! Peci Asy terpasang rapi menyambut Jumat barakah!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Menyambut Sayyidul Ayyam',
      narration: 'Udara Jumat pagi terasa sangat tenang. Rara si Burung berkicau merdu di atap masjid.',
      dialogue: {
        speaker: 'Rara',
        text: '“Cuit cuit! Hari Jumat adalah hari yang penuh dengan keberkahan!”',
        role: 'COMPANION'
      },
      propEmoji: '🕌'
    },
    climaxPrompt: {
      question: 'Kebaikan Jumat mana yang ingin Asy & Syifa utamakan?',
      companionTip: 'Rara mengepakkan sayap: “Amalan sunnah Jumat membawa cahaya!”'
    },
    choices: [
      {
        id: 'opt_infaq_jumat',
        label: 'Mengisi Kotak Infaq Berkah',
        emoji: '🪙',
        description: 'Memasukkan koin tabungan ke dalam kotak infaq masjid dengan ikhlas.',
        outcomeScene: {
          title: 'Koin Senyuman Surga',
          narration: 'Kling! Koin infaq masuk ke kotak dengan niat tulus karena Allah Ta’ala.',
          dialogue: {
            speaker: 'Asy',
            text: '“Semoga infaq kecil ini bermanfaat bagi santri yang membutuhkan!”',
            role: 'ASY'
          },
          propEmoji: '🪙',
          moralValue: 'Rajin berinfaq dan melatih kepekaan sosial sejak dini.',
          duaOrHadith: '“Sedekah tidak akan mengurangi harta.” (HR. Muslim)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_rapikan_sajadah',
        label: 'Merapikan Sajadah & Sandal Masjid',
        emoji: '🌿',
        description: 'Menata sandal jamaah dan membentangkan sajadah yang wangi.',
        outcomeScene: {
          title: 'Masjid yang Bersih & Wangi',
          narration: 'Syifa menata barisan sandal dengan rapi menghadap ke luar.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Masjid kita sekarang bersih dan siap menyambut jamaah!”',
            role: 'SYIFA'
          },
          propEmoji: '🌿',
          moralValue: 'Menjaga kebersihan dan ketertiban rumah ibadah.',
          duaOrHadith: '“Kebersihan itu sebagian dari iman.” (HR. Muslim)',
          soundFx: 'CELEBRATION'
        }
      }
    ]
  },
  {
    id: 'ep_sabtu_kreatif',
    dayOfWeek: 6,
    dayName: 'Sabtu Pagi',
    title: 'Kreasi Seni Bahan Alam',
    subtitle: 'Membuat karya indah dari daun dan ranting kering',
    theme: 'Kreativitas & Sentra Seni',
    category: 'HARIAN_PAGI',
    targetDurationSec: 20,
    coverBg: 'from-rose-400 via-pink-300 to-amber-400',
    featuredCompanion: 'DODO',
    livingObject: {
      id: 'obj_balon',
      name: 'Balon Ceria',
      emoji: '🎈',
      dialogueOrSound: '“Haha! Balon tertawa riang melihat kuas cat menari!”',
      action: 'LAUGH'
    },
    introScene: {
      title: 'Meja Seni Sentra Alam',
      narration: 'Di ruang kelas sentra alam, Dodo si Bebek menyiapkan cat warna-warni dan daun kering.',
      dialogue: {
        speaker: 'Dodo',
        text: '“Mari kita lukis karya kreasi terbaik kita untuk pameran kelas!”',
        role: 'COMPANION'
      },
      propEmoji: '🎨'
    },
    climaxPrompt: {
      question: 'Karya seni apa yang ingin Asy & Syifa buat bersama Dodo?',
      companionTip: 'Dodo mengibas sayap: “Bebaskan imajinasimu yang ceria!”'
    },
    choices: [
      {
        id: 'opt_lukis_pelangi',
        label: 'Melukis Pelangi 7 Warna',
        emoji: '🌈',
        description: 'Mencampur warna merah, kuning, hijau, dan biru membentuk lengkungan pelangi.',
        outcomeScene: {
          title: 'Lengkungan Pelangi Cerah',
          narration: 'Warna pelangi berkilau indah di atas kertas lukis Asy dan Syifa.',
          dialogue: {
            speaker: 'Asy & Syifa',
            text: '“Lihat, pelanginya membentang indah seperti persahabatan kita!”',
            role: 'ASY'
          },
          propEmoji: '🌈',
          moralValue: 'Mengembangkan daya cipta, warna, dan imajinasi positif.',
          duaOrHadith: '“Sesungguhnya Allah menyukai apabila seseorang di antaramu melakukan suatu pekerjaan secara tekun dan rapi.” (HR. Baihaqi)',
          soundFx: 'CELEBRATION'
        }
      },
      {
        id: 'opt_kolase_daun',
        label: 'Membuat Kolase Kupu-kupu Daun',
        emoji: '🦋',
        description: 'Menempel daun-daun kering berbentuk sayap kupu-kupu yang menawan.',
        outcomeScene: {
          title: 'Kupu-kupu Sayap Daun',
          narration: 'Syifa menempelkan dua helai daun mangga menjadi sayap kupu-kupu yang unik.',
          dialogue: {
            speaker: 'Dodo',
            text: '“Kwek kwek! Kupu-kupu daunku tampak seolah siap terbang ke taman!”',
            role: 'COMPANION'
          },
          propEmoji: '🦋',
          moralValue: 'Memanfaatkan benda sekitar menjadi karya seni yang bernilai.',
          duaOrHadith: '“Allah menciptakan segala sesuatu dengan sebaik-baik bentuk.” (QS. As-Sajdah: 7)',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ]
  },
  {
    id: 'ep_ahad_keluarga',
    dayOfWeek: 0,
    dayName: 'Ahad Pagi',
    title: 'Piknik Ceria Bersama Keluarga',
    subtitle: 'Menikmati hari libur dengan kasih sayang dan doa',
    theme: 'Birrul Walidain & Silaturahmi',
    category: 'HARIAN_PAGI',
    targetDurationSec: 22,
    coverBg: 'from-amber-300 via-orange-200 to-rose-300',
    featuredCompanion: 'BUBU',
    livingObject: {
      id: 'obj_tikar',
      name: 'Tikar Piknik Motif Kotak',
      emoji: '⛺',
      dialogueOrSound: '“Wush! Tikar terbentang rapi di bawah bayang pohon rindang!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Hari Ahad di Taman Kampung',
      narration: 'Hari Ahad yang cerah! Asy, Syifa, dan semua sahabat berkumpul membawa bekal kue sehat.',
      dialogue: {
        speaker: 'Bubu',
        text: '“Wah, ada bekal kue bolu pisang dan jus jeruk dingin dari Ibu!”',
        role: 'COMPANION'
      },
      propEmoji: '🧺'
    },
    climaxPrompt: {
      question: 'Aktivitas apa yang ingin Asy & Syifa lakukan pertama kali?',
      companionTip: 'Bubu melompat: “Liburan bersama selalu terasa hangat dan membahagiakan!”'
    },
    choices: [
      {
        id: 'opt_baca_doa_makan',
        label: 'Berbagi Kue & Doa Makan',
        emoji: '🍰',
        description: 'Membaca doa makan bersama dan menyuapi teman dengan tangan kanan.',
        outcomeScene: {
          title: 'Santap Bekal Berkah',
          narration: 'Semua sahabat mengucapkan doa sebelum makan dengan serempak dan tertib.',
          dialogue: {
            speaker: 'Asy & Syifa',
            text: '“Allahumma baarik lana fima razaqtana waqina adzaban naar!”',
            role: 'ASY'
          },
          propEmoji: '🍰',
          moralValue: 'Adab makan yang baik, bersyukur atas nikmat rezeki, dan berbagi.',
          duaOrHadith: '“Wahai anak muda, sebutlah nama Allah, makanlah dengan tangan kananmu dan makanlah yang ada di dekatmu.” (HR. Bukhari)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_main_layangan',
        label: 'Menerbangkan Layangan Hati',
        emoji: '🪁',
        description: 'Menerbangkan layang-layang ke langit biru dengan senyuman ceria.',
        outcomeScene: {
          title: 'Layang-layang Menari di Awan',
          narration: 'Layang-layang meliuk anggun dihembus angin sepoi-sepoi, disambut tepuk tangan ceria.',
          dialogue: {
            speaker: 'Bubu & Gogo',
            text: '“Lihat, layangannya terbang tinggi membawa impian kita!”',
            role: 'COMPANION'
          },
          propEmoji: '🪁',
          moralValue: 'Semangat meraih cita-cita setinggi langit dengan kerja keras dan doa.',
          duaOrHadith: '“Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.” (QS. Thaha: 114)',
          soundFx: 'CELEBRATION'
        }
      }
    ]
  }
];

// Special School Event Interactive Episodes
export const SPECIAL_EVENT_EPISODES: Record<SchoolEventType, InteractiveEpisode> = {
  MAULID_NABI: {
    id: 'ep_event_maulid',
    dayOfWeek: 0,
    dayName: 'Maulid Nabi ﷺ',
    title: 'Lantunan Sholawat & Teladan Kasih Sayang Rasulullah ﷺ',
    subtitle: 'Meneladani akhlak mulia dan kelembutan tutur kata Nabi Muhammad ﷺ',
    theme: 'Cinta Rasulullah & Akhlak Mulia',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 25,
    coverBg: 'from-emerald-700 via-teal-600 to-amber-500',
    featuredCompanion: 'BUBU',
    livingObject: {
      id: 'obj_lentera_maulid',
      name: 'Lentera Sholawat Kasih',
      emoji: '🏮',
      dialogueOrSound: '“Bling! Cahaya sholawat menyejukkan hati yang rindu Rasulullah!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Peringatan Maulid Nabi di Masjid Al-Barakah',
      narration: 'Masjid dan sekolah dihiasi lentera zamrud dan wewangian melati menyambut hari kelahiran Rasulullah ﷺ.',
      dialogue: {
        speaker: 'Asy',
        text: '“Mari kita bersholawat bersama dan meneladani kemuliaan budi pekerti Rasulullah ﷺ!”',
        role: 'ASY'
      },
      propEmoji: '🕌'
    },
    climaxPrompt: {
      question: 'Kebaikan akhlak apa yang ingin Asy & Syifa amalkan hari ini?',
      companionTip: 'Bubu tersenyum lembut: “Semua akhlak terpuji membawa keberkahan dan syafaat!”'
    },
    choices: [
      {
        id: 'opt_lantunan_sholawat',
        label: 'Melantunkan Sholawat & Hadits Kasih Sayang',
        emoji: '📿',
        description: 'Membaca sholawat bersama diiringi tabuhan rebana yang lembut dan syahdu.',
        outcomeScene: {
          title: 'Gema Sholawat Penuh Kedamaian',
          narration: 'Lantunan sholawat menenangkan hati semua santri dan guru di madrasah.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Shallallahu \'ala Muhammad, semoga kita selalu istiqomah meneladani akhlak beliau.”',
            role: 'SYIFA'
          },
          propEmoji: '📿',
          moralValue: 'Mencintai Rasulullah SAW dan memperbanyak sholawat.',
          duaOrHadith: '“Orang yang paling dekat denganku pada hari kiamat adalah yang paling banyak bersholawat kepadaku.” (HR. Tirmidzi)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_berbagi_makanan_santun',
        label: 'Berbagi Makanan Manis & Senyuman Santun',
        emoji: '🍯',
        description: 'Membagikan kurma dan kue madu kepada teman dan tetangga dengan senyuman ramah.',
        outcomeScene: {
          title: 'Manisnya Berbagi dan Saling Mendoakan',
          narration: 'Semua sahabat menerima hidangan dengan ucapan terima kasih dan doa kebaikan.',
          dialogue: {
            speaker: 'Asy',
            text: '“Senyum dan sedekah adalah sunnah Rasulullah yang membahagiakan semua orang!”',
            role: 'ASY'
          },
          propEmoji: '🍯',
          moralValue: 'Kedermawanan, kelembutan tutur kata, dan menebarkan kedamaian.',
          duaOrHadith: '“Tebarkanlah salam dan berikanlah makanan.” (HR. Ahmad)',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'MAULID_NABI'
  },
  MILAD_TK: {
    id: 'ep_event_milad',
    dayOfWeek: 0,
    dayName: 'Milad Spesial',
    title: 'Kue Kejutan & Kartu Doa Milad TK',
    subtitle: 'Perayaan ulang tahun sekolah TK Asy Syifa yang penuh berkah',
    theme: 'Syukur Milad Sekolah',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 25,
    coverBg: 'from-amber-500 via-orange-400 to-rose-500',
    featuredCompanion: 'BUBU',
    livingObject: {
      id: 'obj_lilin',
      name: 'Lilin Bintang Ceria',
      emoji: '🎂',
      dialogueOrSound: '“Bling! Cahaya lilin milad berkilau menyinari doa barakah!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Peringatan Milad TK Asy Syifa',
      narration: 'Seluruh sekolah dihias pita emas dan bunga mawar merayakan Milad TK Asy Syifa.',
      dialogue: {
        speaker: 'Asy',
        text: '“Selamat Milad sekolah kita tercinta, semoga semakin berkah dan jaya!”',
        role: 'ASY'
      },
      propEmoji: '🎂'
    },
    climaxPrompt: {
      question: 'Kado persembahan apa yang ingin Asy & Syifa berikan untuk sekolah?',
      companionTip: 'Bubu & Ustadzah tersenyum: “Keduanya adalah hadiah terindah!”'
    },
    choices: [
      {
        id: 'opt_potong_kue',
        label: 'Membagikan Potongan Kue Barakah',
        emoji: '🍰',
        description: 'Membagikan kue madu kepada adik-adik kelas dan para guru.',
        outcomeScene: {
          title: 'Manisnya Kebersamaan Milad',
          narration: 'Kue milad dipotong dan dibagikan dengan penuh senyuman dan doa kebaikan.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Silakan dinikmati ustadzah, terima kasih telah mendidik kami dengan sabar!”',
            role: 'SYIFA'
          },
          propEmoji: '🍰',
          moralValue: 'Menghormati guru dan menyayangi adik kelas.',
          duaOrHadith: '“Bukan termasuk golongan kami orang yang tidak menyayangi yang muda dan tidak menghormati yang tua.” (HR. Tirmidzi)',
          soundFx: 'CELEBRATION'
        }
      },
      {
        id: 'opt_kartu_doa',
        label: 'Membacakan Surat Doa Kasih Sayang',
        emoji: '💌',
        description: 'Membacakan kartu ucapan dan doa keselamatan untuk seluruh keluarga sekolah.',
        outcomeScene: {
          title: 'Gema Doa Mustajab',
          narration: 'Doa tulus Asy dan Syifa disambut ucapan amin serentak dari seluruh hadirin.',
          dialogue: {
            speaker: 'Asy',
            text: '“Rabbana aatina fid dunya hasanah wa fil aakhirati hasanah...”',
            role: 'ASY'
          },
          propEmoji: '💌',
          moralValue: 'Berbakti dan mendoakan para pendidik dengan tulus ikhlas.',
          duaOrHadith: '“Doa seorang muslim untuk saudaranya tanpa sepengetahuannya adalah doa yang mustajab.” (HR. Muslim)',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ],
    linkedSchoolEvent: 'MILAD_TK'
  },
  WISUDA: {
    id: 'ep_event_wisuda',
    dayOfWeek: 0,
    dayName: 'Wisuda Santri',
    title: 'Topi Toga & Bintang Prestasi Santri',
    subtitle: 'Pelepasan santri teladan menuju jenjang madrasah berikutnya',
    theme: 'Wisuda & Apresiasi Prestasi',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 25,
    coverBg: 'from-sky-500 via-indigo-400 to-purple-600',
    featuredCompanion: 'GOGO',
    livingObject: {
      id: 'obj_toga',
      name: 'Topi Toga Berbintang',
      emoji: '🎓',
      dialogueOrSound: '“Cling! Kuncir topi toga bergoyang tanda kelulusan gemilang!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Panggung Pelepasan Santri',
      narration: 'Panggung megah berhias kain sutra siap menggelar upacara wisuda santri.',
      dialogue: {
        speaker: 'Gogo',
        text: '“Hari ini santri-santri berprestasi melangkah maju menerima syahadah!”',
        role: 'COMPANION'
      },
      propEmoji: '🎓'
    },
    climaxPrompt: {
      question: 'Bagian wisuda mana yang ingin Asy & Syifa tampilkan?',
      companionTip: 'Gogo bertepuk tangan: “Semua penampilan mengharukan hati!”'
    },
    choices: [
      {
        id: 'opt_tasmi_hafalan',
        label: 'Tasmi’ Hafalan Juz Amma Bersama',
        emoji: '📖',
        description: 'Melantunkan Surat An-Naba dan Ad-Duha dengan tartil merdu.',
        outcomeScene: {
          title: 'Lantunan Tartil Juz Amma',
          narration: 'Suara tartil menggema indah membuat para orang tua terharu dan bangga.',
          dialogue: {
            speaker: 'Asy & Syifa',
            text: '“Alhamdulillah, hafalan Al-Qur’an adalah mahkota terindah untuk ayah dan bunda!”',
            role: 'ASY'
          },
          propEmoji: '📖',
          moralValue: 'Menjaga dan mencintai hafalan Al-Qur’an sepanjang hayat.',
          duaOrHadith: '“Sebaik-baik kalian adalah yang mempelajari Al-Qur’an dan mengajarkannya.” (HR. Bukhari)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_sembah_sungkem',
        label: 'Sungkem & Memeluk Ayah Bunda',
        emoji: '💐',
        description: 'Menyerahkan buket bunga melati tanda bakti kepada orang tua tercinta.',
        outcomeScene: {
          title: 'Pelukan Hangat Ayah Bunda',
          narration: 'Air mata bahagia orang tua mengalir saat memeluk Asy dan Syifa di atas panggung.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Terima kasih Ayah, terima kasih Bunda, kami berjanji terus berakhlak mulia!”',
            role: 'SYIFA'
          },
          propEmoji: '💐',
          moralValue: 'Birrul walidain dan memuliakan kedua orang tua.',
          duaOrHadith: '“Ridha Allah tergantung pada ridha kedua orang tua.” (HR. Tirmidzi)',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'WISUDA'
  },
  PPDB: {
    id: 'ep_event_ppdb',
    dayOfWeek: 0,
    dayName: 'PPDB Emas',
    title: 'Menyambut Sahabat Baru di Gerbang Sekolah',
    subtitle: 'Senyuman hangat menyambut santri baru tahun ajaran baru',
    theme: 'Ramah Tamah & Ukhuwah',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 22,
    coverBg: 'from-amber-400 via-yellow-300 to-emerald-400',
    featuredCompanion: 'MIMI',
    livingObject: {
      id: 'obj_spanduk',
      name: 'Spanduk Selamat Datang',
      emoji: '🌟',
      dialogueOrSound: '“Kibar! Spanduk emas berkibar riang menyambut teman baru!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Pintu Gerbang Terbuka Lebar',
      narration: 'Banyak calon santri baru datang bersama orang tua mendaftar di TK Asy Syifa.',
      dialogue: {
        speaker: 'Mimi',
        text: '“Bzz! Lihat, ada teman-teman baru yang ingin belajar bersama kita!”',
        role: 'COMPANION'
      },
      propEmoji: '🌟'
    },
    climaxPrompt: {
      question: 'Bagaimana Asy & Syifa menyambut sahabat baru?',
      companionTip: 'Mimi tersenyum: “Sapaan ramah membuat teman baru merasa nyaman!”'
    },
    choices: [
      {
        id: 'opt_ajak_bermain',
        label: 'Ajak Bermain di Taman Ceria',
        emoji: '🎠',
        description: 'Mengajak teman baru menaiki ayunan dan jungkat-jungkit bersama.',
        outcomeScene: {
          title: 'Tawa Riang di Taman Sekolah',
          narration: 'Sahabat baru tidak malu-malu lagi dan tertawa gembira bermain ayunan.',
          dialogue: {
            speaker: 'Asy',
            text: '“Ayo naik ayunan ini bersama, di sini belajarnya sangat seru dan menyenangkan!”',
            role: 'ASY'
          },
          propEmoji: '🎠',
          moralValue: 'Sikap ramah, terbuka, dan cepat beradaptasi dengan teman baru.',
          duaOrHadith: '“Tebarkanlah salam dan berikanlah senyuman di antaramu.” (HR. Muslim)',
          soundFx: 'CELEBRATION'
        }
      },
      {
        id: 'opt_beri_buku_panduan',
        label: 'Berikan Buku Cerita Sambutan',
        emoji: '📚',
        description: 'Menyerahkan buku bergambar tentang kegiatan seru di TK Asy Syifa.',
        outcomeScene: {
          title: 'Buku Kisah Sekolah Ceria',
          narration: 'Teman baru antusias membolak-balik halaman buku bergambar dengan mata berbinar.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Ini bukunya, ada cerita tentang kereta, kebun, dan sentra mewarnai!”',
            role: 'SYIFA'
          },
          propEmoji: '📚',
          moralValue: 'Gemar berbagi informasi dan menyambut tamu dengan ikhlas.',
          duaOrHadith: '“Barangsiapa beriman kepada Allah dan hari akhir, hendaklah memuliakan tamunya.” (HR. Bukhari)',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ],
    linkedSchoolEvent: 'PPDB'
  },
  RAMADHAN: {
    id: 'ep_event_ramadhan',
    dayOfWeek: 0,
    dayName: 'Bulan Ramadhan',
    title: 'Lentera Sahur & Kotak Kurma Manis',
    subtitle: 'Menjalankan ibadah puasa dan tarawih dengan penuh keikhlasan',
    theme: 'Puasaku Penuh Pahala',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 25,
    coverBg: 'from-indigo-600 via-purple-600 to-amber-500',
    featuredCompanion: 'RARA',
    livingObject: {
      id: 'obj_lentera',
      name: 'Lentera Fanous Ramadhan',
      emoji: '🏮',
      dialogueOrSound: '“Kelap-kelip! Lentera Ramadhan menyinari malam penuh berkah!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Malam Ramadhan Berbintang',
      narration: 'Bulan sabit bersinar terang di angkasa. Suara tadarus Al-Qur’an terdengar merdu.',
      dialogue: {
        speaker: 'Rara',
        text: '“Marhaban Ya Ramadhan! Bulan pengampunan dan berlipatnya kebaikan!”',
        role: 'COMPANION'
      },
      propEmoji: '🌙'
    },
    climaxPrompt: {
      question: 'Kebaikan Ramadhan apa yang ingin Asy & Syifa lakukan?',
      companionTip: 'Rara bernyanyi lembut: “Setiap amalan puasa bernilai surga!”'
    },
    choices: [
      {
        id: 'opt_bagi_takjil',
        label: 'Membagikan Kotak Kurma Takjil',
        emoji: '🌴',
        description: 'Membagikan kurma dan air minum kepada warga yang sedang berpuasa.',
        outcomeScene: {
          title: 'Manisnya Kurma Berbuka',
          narration: 'Warga yang berpuasa menerima takjil kurma dengan ucapan terima kasih yang tulus.',
          dialogue: {
            speaker: 'Asy & Syifa',
            text: '“Bismillah, ini kurma manis untuk berbuka puasa, semoga berkah!”',
            role: 'ASY'
          },
          propEmoji: '🌴',
          moralValue: 'Memberi makan orang yang berbuka puasa pahalanya berlimpah.',
          duaOrHadith: '“Siapa memberi makan orang yang berpuasa, maka baginya pahala seperti orang yang berpuasa tersebut.” (HR. Tirmidzi)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_tadarus_quran',
        label: 'Tadarus Al-Qur’an di Bawah Lentera',
        emoji: '📖',
        description: 'Membaca Surat Al-Qadr bersama para sahabat cilik.',
        outcomeScene: {
          title: 'Cahaya Malam Lailatul Qadr',
          narration: 'Ayat-ayat suci dilantunkan dengan tartil dan hati yang khusyuk.',
          dialogue: {
            speaker: 'Asy',
            text: '“Inna anzalnahu fii lailatil qadr... malam yang lebih baik dari seribu bulan!”',
            role: 'ASY'
          },
          propEmoji: '📖',
          moralValue: 'Mendekatkan diri kepada Al-Qur’an di bulan mulia.',
          duaOrHadith: '“Bacalah Al-Qur’an, karena sesungguhnya ia akan datang pada hari kiamat sebagai pemberi syafaat.” (HR. Muslim)',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'RAMADHAN'
  },
  IDUL_FITRI: {
    id: 'ep_event_idulfitri',
    dayOfWeek: 0,
    dayName: 'Idul Fitri',
    title: 'Gema Takbir, Ketupat & Maaf-memaafkan',
    subtitle: 'Merayakan hari kemenangan dengan hati yang suci dan penuh silaturahmi',
    theme: 'Fitrah & Silaturahmi Hangat',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 25,
    coverBg: 'from-emerald-600 via-teal-500 to-amber-400',
    featuredCompanion: 'BUBU',
    livingObject: {
      id: 'obj_ketupat',
      name: 'Ketupat Hijau Emas',
      emoji: '✨',
      dialogueOrSound: '“Aroma wangi ketupat menyambut hari raya kemenangan!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Pagi Hari Raya yang Fitri',
      narration: 'Gema takbir berkumandang dari Masjid Al-Ikhlas. Semua santri memakai baju rapi.',
      dialogue: {
        speaker: 'Bubu',
        text: '“Taqabbalallahu minna wa minkum! Selamat Hari Raya Idul Fitri, sahabat semua!”',
        role: 'COMPANION'
      },
      propEmoji: '🕌'
    },
    climaxPrompt: {
      question: 'Kebaikan lebaran apa yang ingin Asy & Syifa dahulukan?',
      companionTip: 'Bubu tersenyum: “Silaturahmi menyambung kasih sayang antar sesama!”'
    },
    choices: [
      {
        id: 'opt_sungkem_maaf',
        label: 'Saling Memaafkan & Bersalaman',
        emoji: '🤝',
        description: 'Memohon maaf lahir dan batin kepada ustadzah dan kawan-kawan.',
        outcomeScene: {
          title: 'Hati yang Suci dan Lapang',
          narration: 'Semua saling berpelukan dan tersenyum tulus menghapus segala prasangka.',
          dialogue: {
            speaker: 'Asy & Syifa',
            text: '“Minal aidin wal faizin, mohon maaf lahir dan batin semuanya!”',
            role: 'ASY'
          },
          propEmoji: '🤝',
          moralValue: 'Memaafkan kesalahan sesama dan menjaga kebersihan hati.',
          duaOrHadith: '“Tidak halal bagi seorang muslim mendiamkan saudaranya lebih dari tiga hari.” (HR. Bukhari)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_berbagi_kue',
        label: 'Membagikan Kue Nastar & Ketupat',
        emoji: '🥮',
        description: 'Membagikan toples kue kering lezat kepada tetangga di sekitar sekolah.',
        outcomeScene: {
          title: 'Manisnya Berbagi di Hari Raya',
          narration: 'Tetangga menerima hantaran kue dengan senyum sumringah dan doa keberkahan.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Silakan dinikmati kuenya, semoga silaturahmi kita semakin erat!”',
            role: 'SYIFA'
          },
          propEmoji: '🥮',
          moralValue: 'Memuliakan tetangga dan menyebarkan kegembiraan hari raya.',
          duaOrHadith: '“Saling memberi hadiahlah kalian, niscaya kalian akan saling mencintai.” (HR. Bukhari)',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'IDUL_FITRI'
  },
  KEMERDEKAAN: {
    id: 'ep_event_kemerdekaan',
    dayOfWeek: 0,
    dayName: '17 Agustus',
    title: 'Pawai Bendera Merah Putih di Kampung',
    subtitle: 'Memperingati hari kemerdekaan dengan semangat patriotik dan persatuan',
    theme: 'Cinta Tanah Air Sebagian dari Iman',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 24,
    coverBg: 'from-red-600 via-rose-500 to-slate-100',
    featuredCompanion: 'GOGO',
    livingObject: {
      id: 'obj_bendera',
      name: 'Bendera Merah Putih Cilik',
      emoji: '🇮🇩',
      dialogueOrSound: '“Berkibar megah! Merah Putih lambang keberanian dan kesucian!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Pagi Merdeka di Lapangan',
      narration: 'Semua santri mengenakan pita merah putih di kepala, siap mengikuti pawai ceria.',
      dialogue: {
        speaker: 'Gogo',
        text: '“Merdeka! Mari kita jaga persatuan bangsa dengan saling menyayangi!”',
        role: 'COMPANION'
      },
      propEmoji: '🇮🇩'
    },
    climaxPrompt: {
      question: 'Lomba ceria apa yang ingin Asy & Syifa ikuti?',
      companionTip: 'Gogo tersenyum: “Menang atau kalah, kita tetap bersahabat!”'
    },
    choices: [
      {
        id: 'opt_lomba_kelereng',
        label: 'Lomba Kelereng Sendok Keseimbangan',
        emoji: '🥄',
        description: 'Berjalan perlahan menjaga keseimbangan kelereng di atas sendok.',
        outcomeScene: {
          title: 'Keseimbangan Langkah Pantang Menyerah',
          narration: 'Asy melangkah mantap hingga garis akhir dengan tepuk tangan riuh.',
          dialogue: {
            speaker: 'Asy',
            text: '“Kuncinya adalah sabar, fokus, dan tidak terburu-buru!”',
            role: 'ASY'
          },
          propEmoji: '🥄',
          moralValue: 'Ketekunan, kesabaran, dan konsentrasi.',
          duaOrHadith: '“Kesabaran adalah separuh dari keimanan.” (HR. Baihaqi)',
          soundFx: 'CELEBRATION'
        }
      },
      {
        id: 'opt_pawai_sepeda',
        label: 'Pawai Sepeda Hias Bunga',
        emoji: '🚲',
        description: 'Mengayuh sepeda berhias kertas krep merah putih mengelilingi kampung.',
        outcomeScene: {
          title: 'Sepeda Merdeka Warna-warni',
          narration: 'Rombongan sepeda hias melaju rapi disambut lambaian tangan warga kampung.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Sepedaku indah berhias bunga merah putih, Indonesia tanah airku!”',
            role: 'SYIFA'
          },
          propEmoji: '🚲',
          moralValue: 'Cinta tanah air dan semangat kebersamaan.',
          duaOrHadith: '“Hubbul wathan minal iman (Cinta tanah air sebagian dari iman).”',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ],
    linkedSchoolEvent: 'KEMERDEKAAN'
  },
  HARI_SANTRI: {
    id: 'ep_event_santri',
    dayOfWeek: 0,
    dayName: 'Hari Santri',
    title: 'Peci Putih & Pawai Obor Santri Berkah',
    subtitle: 'Meneladani resolusi jihad para ulama dan santri pejuang',
    theme: 'Santri Berakhlak Mulia & Berprestasi',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 22,
    coverBg: 'from-emerald-600 via-teal-500 to-amber-400',
    featuredCompanion: 'TITI',
    livingObject: {
      id: 'obj_obor',
      name: 'Obor Cahaya Kebaikan',
      emoji: '🕯️',
      dialogueOrSound: '“Terang! Api obor menyalakan semangat menuntut ilmu!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Peringatan Hari Santri Nasional',
      narration: 'Semua santri mengenakan busana muslim serba putih, berbaris rapi di depan madrasah.',
      dialogue: {
        speaker: 'Titi',
        text: '“Santri hebat adalah santri yang rajin mengaji, berbakti, dan cinta tanah air!”',
        role: 'COMPANION'
      },
      propEmoji: '🕌'
    },
    climaxPrompt: {
      question: 'Aksi santri mana yang ingin Asy & Syifa lakukan?',
      companionTip: 'Titi berkedip: “Keduanya memperkuat ukhuwah islamiyah!”'
    },
    choices: [
      {
        id: 'opt_sholawat_bersama',
        label: 'Melantunkan Sholawat Nariyah',
        emoji: '📿',
        description: 'Membaca sholawat bersama diiringi tabuhan rebana yang syahdu.',
        outcomeScene: {
          title: 'Gema Sholawat Nabi',
          narration: 'Hati menjadi tenang saat bait-bait sholawat menggema di seluruh kampung.',
          dialogue: {
            speaker: 'Asy & Syifa',
            text: '“Allahumma shalli shalaatan kaamilatan wa sallim salaaman taamman...”',
            role: 'ASY'
          },
          propEmoji: '📿',
          moralValue: 'Mencintai Rasulullah SAW dengan memperbanyak sholawat.',
          duaOrHadith: '“Barangsiapa bersholawat kepadaku satu kali, maka Allah akan bersholawat kepadanya sepuluh kali.” (HR. Muslim)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_bersih_madrasah',
        label: 'Gotong Royong Membersihkan Madrasah',
        emoji: '🧹',
        description: 'Menyapu halaman dan menata kitab-kitab doa di rak kelas.',
        outcomeScene: {
          title: 'Madrasah Bersih & Berkah',
          narration: 'Halaman madrasah kini bersih berkilau dan nyaman untuk mengaji.',
          dialogue: {
            speaker: 'Titi',
            text: '“Alhamdulillah, kelas yang bersih membuat malaikat rahmat betah menaungi kita!”',
            role: 'COMPANION'
          },
          propEmoji: '🧹',
          moralValue: 'Disiplin, khidmah kepada tempat belajar, dan menjaga kesucian.',
          duaOrHadith: '“Kebersihan adalah kunci kenyamanan ibadah.”',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'HARI_SANTRI'
  },
  HARI_GURU: {
    id: 'ep_event_guru',
    dayOfWeek: 0,
    dayName: 'Hari Guru',
    title: 'Buket Melati Tanda Sayang untuk Ustadzah',
    subtitle: 'Mendedikasikan rasa terima kasih kepada guru pendidik mulia',
    theme: 'Menghormati Guru & Asatidz',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 24,
    coverBg: 'from-pink-500 via-rose-400 to-amber-400',
    featuredCompanion: 'BUBU',
    livingObject: {
      id: 'obj_buket',
      name: 'Buket Melati Cinta',
      emoji: '💐',
      dialogueOrSound: '“Harum semerbak! Melati putih lambang ketulusan hati guru!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Hari Apresiasi Guru & Asatidz',
      narration: 'Pagi ini para santri berkumpul diam-diam menyiapkan kejutan manis untuk para guru.',
      dialogue: {
        speaker: 'Bubu',
        text: '“Ustadzah selalu sabar mengajari kita huruf hijaiyah dan doa harian!”',
        role: 'COMPANION'
      },
      propEmoji: '💐'
    },
    climaxPrompt: {
      question: 'Tanda sayang apa yang ingin Asy & Syifa sampaikan kepada Ustadzah?',
      companionTip: 'Bubu tersenyum: “Guru adalah pelita penerang dalam kegelapan!”'
    },
    choices: [
      {
        id: 'opt_persembahan_puisi',
        label: 'Membacakan Puisi Terima Kasih Guru',
        emoji: '📜',
        description: 'Membacakan sajak indah tentang kesabaran dan cinta kasih guru.',
        outcomeScene: {
          title: 'Puisi Kasih Guru Tercinta',
          narration: 'Ustadzah tersenyum haru mendengarkan untaian puisi tulus dari Asy dan Syifa.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Terima kasih guruku, bimbinganmu akan selalu kami kenang dalam setiap langkah!”',
            role: 'SYIFA'
          },
          propEmoji: '📜',
          moralValue: 'Menghargai jasa pendidik yang membimbing akhlak mulia.',
          duaOrHadith: '“Pelajarilah ilmu dan pelajarilah ketenangan serta kehormatan untuk ilmu, dan rendahkanlah hatimu kepada orang yang kamu belajar darinya.” (HR. Thabrani)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_berikan_bunga_melati',
        label: 'Menyerahkan Buket Melati Putih',
        emoji: '🌸',
        description: 'Memberikan rangkaian bunga melati segar dengan membungkukkan badan penuh santun.',
        outcomeScene: {
          title: 'Semerbak Bunga Melati',
          narration: 'Ustadzah memeluk Asy dan Syifa dan mendoakan keberkahan ilmu untuk mereka.',
          dialogue: {
            speaker: 'Asy',
            text: '“Jazakillahu khairan katsiran Ustadzah tercinta!”',
            role: 'ASY'
          },
          propEmoji: '🌸',
          moralValue: 'Berakhlak santun dan mengekspresikan rasa terima kasih dengan ikhlas.',
          duaOrHadith: '“Barangsiapa tidak berterima kasih kepada manusia, maka dia tidak bersyukur kepada Allah.” (HR. Tirmidzi)',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'HARI_GURU'
  },
  TAHUN_BARU_HIJRIAH: {
    id: 'ep_event_hijriah',
    dayOfWeek: 0,
    dayName: 'Tahun Baru Islam',
    title: 'Pelita Hijrah & Niat Kebaikan 1 Muharram',
    subtitle: 'Meneladani peristiwa hijrah Rasulullah SAW dengan semangat awal yang baru',
    theme: 'Hijrah Menuju Kebaikan',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 24,
    coverBg: 'from-slate-900 via-teal-900 to-indigo-900',
    featuredCompanion: 'BUBU',
    livingObject: {
      id: 'obj_bulan_hijriah',
      name: 'Bulan Sabit Muharram',
      emoji: '🌙',
      dialogueOrSound: '“Cahaya 1 Muharram menyinari langkah santri menuju cita-cita mulia!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Menyambut 1 Muharram 1448 H',
      narration: 'Malam 1 Muharram tiba. Seluruh keluarga besar TK Asy Syifa berkumpul memanjatkan doa awal tahun.',
      dialogue: {
        speaker: 'Bubu',
        text: '“Selamat Tahun Baru Hijriah! Mari kita buat resolusi kebaikan baru!”',
        role: 'COMPANION'
      },
      propEmoji: '🌙'
    },
    climaxPrompt: {
      question: 'Kebaikan apa yang ingin Asy & Syifa mulai di tahun baru ini?',
      companionTip: 'Bubu tersenyum: “Setiap langkah kecil menuju kebaikan bernilai pahala besar!”'
    },
    choices: [
      {
        id: 'opt_tambah_hafalan',
        label: 'Menambah Hafalan Surat Pendek Baru',
        emoji: '📖',
        description: 'Bertekad murojaah setiap ba\'da maghrib bersama orang tua.',
        outcomeScene: {
          title: 'Semangat Murojaah Quran',
          narration: 'Asy & Syifa membaca surat baru dengan penuh ketekunan dan senyum ceria.',
          dialogue: {
            speaker: 'Asy',
            text: '“Bismillah, tahun baru ini hafalanku bertambah semakin lancar!”',
            role: 'ASY'
          },
          propEmoji: '📖',
          moralValue: 'Istiqomah dalam menuntut ilmu dan menghafal Al-Quran.',
          duaOrHadith: '“Sebaik-baik amalan adalah yang istiqomah walau sedikit.”',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_bantu_teman',
        label: 'Membantu Sahabat dan Berbagi Senyuman',
        emoji: '🤝',
        description: 'Membiasakan 5S (Senyum, Salam, Sapa, Sopan, Santun) setiap hari di sekolah.',
        outcomeScene: {
          title: 'Menebar Kasih Sayang & Ukhuwah',
          narration: 'Semua teman di TK Asy Syifa merasa gembira dan saling merangkul penuh kasih.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Menjadi anak yang sholihah dan menyayangi sesama adalah impianku!”',
            role: 'SYIFA'
          },
          propEmoji: '🌸',
          moralValue: 'Menebarkan perdamaian dan akhlak terpuji.',
          duaOrHadith: '“Orang beriman itu bersaudara, tebarkanlah kedamaian.”',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'TAHUN_BARU_HIJRIAH'
  },
  HARI_KARTINI: {
    id: 'ep_event_kartini',
    dayOfWeek: 0,
    dayName: 'Hari Kartini',
    title: 'Pena Emas & Buku Cerita Kartini Santun',
    subtitle: 'Meneladani semangat literasi dan kelembutan akhlak Ibu Kartini',
    theme: 'Semangat Belajar Santriwati',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 24,
    coverBg: 'from-amber-600 via-rose-500 to-indigo-600',
    featuredCompanion: 'MIMI',
    livingObject: {
      id: 'obj_buku_kartini',
      name: 'Buku Kisah Kartini Cilik',
      emoji: '📖',
      dialogueOrSound: '“Klip klip! Lembaran buku terbuka membawa ilmu dan cahaya kebaikan!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Peringatan Hari Kartini Ceria',
      narration: 'Mbak Syifa dan Dek Asy memakai busana adat santun, berkumpul di Sentra Literasi menyambut Hari Kartini.',
      dialogue: {
        speaker: 'Syifa',
        text: '“Selamat Hari Kartini! Dengan rajin membaca, kita bisa menjadi santriwati cerdas dan sholihah!”',
        role: 'SYIFA'
      },
      propEmoji: '🌸'
    },
    climaxPrompt: {
      question: 'Karya kebaikan apa yang ingin dibuat untuk merayakan Hari Kartini?',
      companionTip: 'Mimi mendengung lembut: “Keduanya melatih kreativitas dan cinta literasi!”'
    },
    choices: [
      {
        id: 'opt_kartu_ucapan_bunda',
        label: 'Menulis Kartu Kasih Sayang untuk Ibu Guru & Bunda',
        emoji: '💌',
        description: 'Menghias kartu doa dengan warna pastel dan ucapan terima kasih tulus.',
        outcomeScene: {
          title: 'Kartu Kasih Sayang Berbunga',
          narration: 'Ibu Guru tersenyum haru menerima kartu doa indah buatan tangan ananda.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Terima kasih Bunda dan Guru atas bimbingan penuh kasih sayang!”',
            role: 'SYIFA'
          },
          propEmoji: '💌',
          moralValue: 'Berbakti kepada orang tua dan menghormati guru.',
          duaOrHadith: '“Ridha Allah bergantung pada ridha kedua orang tua.” (HR. Tirmidzi)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_membaca_nyaring',
        label: 'Membaca Kisah Teladan di Depan Kelas',
        emoji: '📖',
        description: 'Membacakan dongeng singkat penuh teladan untuk sahabat di sentra.',
        outcomeScene: {
          title: 'Gema Literasi Kartini Cilik',
          narration: 'Semua teman mendengarkan dengan khusyuk lalu bertepuk tangan riang.',
          dialogue: {
            speaker: 'Asy',
            text: '“Membaca itu seru! Kita belajar adab, ilmu, dan kebaikan baru!”',
            role: 'ASY'
          },
          propEmoji: '📖',
          moralValue: 'Percaya diri dan gemar menyebarkan ilmu yang bermanfaat.',
          duaOrHadith: '“Iqra\' bismi rabbikallazi khalaq (Bacalah dengan menyebut nama Tuhanmu).”',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'HARI_KARTINI'
  },
  HARI_BATIK: {
    id: 'ep_event_batik',
    dayOfWeek: 0,
    dayName: 'Hari Batik',
    title: 'Goresan Canting & Corak Nusantara Ceria',
    subtitle: 'Mengenal dan melestarikan mahakarya warisan budaya Indonesia',
    theme: 'Cinta Budaya & Kreativitas',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 22,
    coverBg: 'from-amber-800 via-yellow-700 to-stone-900',
    featuredCompanion: 'GOGO',
    livingObject: {
      id: 'obj_canting_mini',
      name: 'Canting Lukis Cilik',
      emoji: '🎨',
      dialogueOrSound: '“Sret sret! Goresan motif batik nusantara menghiasi kain putih!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Hari Batik Nasional di Sentra Seni',
      narration: 'Sentra Seni dipenuhi kain batik beraneka motif: kawung, parang, dan megamendung.',
      dialogue: {
        speaker: 'Gogo',
        text: '“Wah, indah sekali corak batik nusantara! Ayo kita berkreasi membatik cap daun!”',
        role: 'COMPANION'
      },
      propEmoji: '🎨'
    },
    climaxPrompt: {
      question: 'Motif batik ramah anak apa yang ingin kita buat?',
      companionTip: 'Gogo mengibaskan belalai ramah: “Setiap motif memiliki filosofi doa kebaikan!”'
    },
    choices: [
      {
        id: 'opt_batik_kawung',
        label: 'Pola Motif Kawung Daun Teratai',
        emoji: '🌸',
        description: 'Mencap pola geometris teratai yang melambangkan hati yang suci dan bersih.',
        outcomeScene: {
          title: 'Kain Batik Kawung nan Anggun',
          narration: 'Kain batik cap kering dengan motif teratur yang rapi dan mempesona.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Alhamdulillah, kain batik kawung ini melambangkan ketulusan dan hati yang bersih!”',
            role: 'SYIFA'
          },
          propEmoji: '🌸',
          moralValue: 'Menjaga kebersihan hati dan kesopanan dalam bersikap.',
          duaOrHadith: '“Sesungguhnya Allah itu indah dan menyukai keindahan.” (HR. Muslim)',
          soundFx: 'MAGIC_SPARKLE'
        }
      },
      {
        id: 'opt_batik_daun_kelor',
        label: 'Pola Daun Asy Syifa Hijau Segar',
        emoji: '🌿',
        description: 'Menggunakan pelepah daun asli untuk mencap motif herbal berkah.',
        outcomeScene: {
          title: 'Karya Batik Hijau Kebun Berkah',
          narration: 'Karya batik khas Asy Syifa terpajang indah di dinding sentra seni sekolah.',
          dialogue: {
            speaker: 'Asy',
            text: '“Batik khas Asy Syifa mengingatkan kita untuk selalu menyayangi tanaman ciptaan Allah!”',
            role: 'ASY'
          },
          propEmoji: '🌿',
          moralValue: 'Kreativitas bahan alam dan mencintai kearifan lokal.',
          duaOrHadith: '“Tidak ada seorang muslim yang menanam tanaman kecuali menjadi sedekah baginya.” (HR. Muslim)',
          soundFx: 'CELEBRATION'
        }
      }
    ],
    linkedSchoolEvent: 'HARI_BATIK'
  },
  HARI_ANAK: {
    id: 'ep_event_anak',
    dayOfWeek: 0,
    dayName: 'Hari Anak',
    title: 'Kincir Pelangi & Senyum Sahabat Santri',
    subtitle: 'Merayakan hari anak dengan rasa syukur, perlindungan, dan keceriaan bermain',
    theme: 'Anak Terlindungi, Indonesia Maju',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 25,
    coverBg: 'from-sky-500 via-teal-400 to-indigo-600',
    featuredCompanion: 'BUBU',
    livingObject: {
      id: 'obj_kincir_pelangi',
      name: 'Kincir Angin Pelangi',
      emoji: '🪁',
      dialogueOrSound: '“Wush wush! Kincir berputar kencang meniupkan doa sukacita bagi seluruh anak!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Pesta Hari Anak Nasional',
      narration: 'Halaman sekolah berhiaskan balon warna-warni dan kincir angin pelangi.',
      dialogue: {
        speaker: 'Bubu',
        text: '“Selamat Hari Anak Nasional! Semua anak berhak tersenyum dan bermain dengan riang gembira!”',
        role: 'COMPANION'
      },
      propEmoji: '🎈'
    },
    climaxPrompt: {
      question: 'Kegiatan persahabatan apa yang ingin Asy & Syifa pimpin bersama teman-teman?',
      companionTip: 'Bubu melompat gembira: “Bermain bersama mempererat kasih sayang antar sesama!”'
    },
    choices: [
      {
        id: 'opt_senam_kincir',
        label: 'Senam Irama Kincir Pelangi',
        emoji: '🤸',
        description: 'Menggerakkan badan mengikuti lagu riang Asy Syifa dengan tangan memegang kincir.',
        outcomeScene: {
          title: 'Senam Gembira Sehat & Bugar',
          narration: 'Seluruh santri melompat dan tertawa ceria dengan gerakan tubuh yang kompak.',
          dialogue: {
            speaker: 'Asy',
            text: '“Tubuh kita sehat, hati kita gembira, terima kasih ya Allah atas nikmat sehat ini!”',
            role: 'ASY'
          },
          propEmoji: '🤸',
          moralValue: 'Menjaga kesehatan jasmani dan bersyukur atas nikmat kebugaran.',
          duaOrHadith: '“Mukmin yang kuat lebih dicintai Allah daripada mukmin yang lemah.” (HR. Muslim)',
          soundFx: 'CELEBRATION'
        }
      },
      {
        id: 'opt_lingkaran_sahabat',
        label: 'Permainan Lingkaran Berbagi Cerita & Senyum',
        emoji: '🤝',
        description: 'Duduk melingkar dan bergantian mendoakan kebaikan bagi sahabat di sebelah kita.',
        outcomeScene: {
          title: 'Lingkaran Kasih Sayang Santri',
          narration: 'Setiap anak saling melempar senyuman hangat dan berjabat tangan dengan santun.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Kita semua bersaudara, tidak ada yang bersedih karena kita saling menyayangi!”',
            role: 'SYIFA'
          },
          propEmoji: '🤝',
          moralValue: 'Empati, kasih sayang, dan menjauhi perundungan.',
          duaOrHadith: '“Senyummu di hadapan saudaramu adalah sedekah.” (HR. Tirmidzi)',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ],
    linkedSchoolEvent: 'HARI_ANAK'
  },
  HARI_PENDIDIKAN: {
    id: 'ep_event_hardiknas',
    dayOfWeek: 0,
    dayName: 'Hardiknas',
    title: 'Pelita Ilmu & Obor Tut Wuri Handayani',
    subtitle: 'Meneladani pahlawan pendidikan dan bertekad menuntut ilmu setinggi bintang',
    theme: 'Tut Wuri Handayani',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 23,
    coverBg: 'from-blue-700 via-indigo-800 to-teal-700',
    featuredCompanion: 'TITI',
    livingObject: {
      id: 'obj_buku_hardiknas',
      name: 'Ensiklopedia Emas Pelajar',
      emoji: '📚',
      dialogueOrSound: '“Bling! Cahaya ilmu membuka rahasia keagungan ciptaan langit dan bumi!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Hari Pendidikan Nasional (Hardiknas)',
      narration: 'Bendera merah putih berkibar tegak diiringi lagu Mars Asy Syifa yang menggema di lapangan.',
      dialogue: {
        speaker: 'Titi',
        text: '“Menuntut ilmu adalah kewajiban setiap muslim, dari buaian hingga akhir hayat!”',
        role: 'COMPANION'
      },
      propEmoji: '🏛️'
    },
    climaxPrompt: {
      question: 'Tantangan ceria ilmu apa yang ingin Asy & Syifa selesaikan?',
      companionTip: 'Titi tersenyum bijak: “Belajar dengan tekun membawa kita meraih cita-cita mulia!”'
    },
    choices: [
      {
        id: 'opt_susun_balok_sekolah',
        label: 'Merancang Miniatur Sekolah Masa Depan',
        emoji: '🏰',
        description: 'Menyusun balok kayu dan geometri membentuk sekolah impian yang ramah anak.',
        outcomeScene: {
          title: 'Istana Balok Sekolah Ceria',
          narration: 'Karya rancang bangun miniatur sekolah berdiri kokoh lengkap dengan taman dan masjid kubah hijau.',
          dialogue: {
            speaker: 'Asy',
            text: '“Sekolah impian kita memiliki masjid yang megah, kebun hijau, dan perpustakaan luas!”',
            role: 'ASY'
          },
          propEmoji: '🏰',
          moralValue: 'Kreativitas, kerja sama rancang bangun, dan visualisasi cita-cita.',
          duaOrHadith: '“Allah akan meninggikan derajat orang-orang yang berilmu.” (QS. Al-Mujadilah: 11)',
          soundFx: 'CELEBRATION'
        }
      },
      {
        id: 'opt_kuis_adab_santun',
        label: 'Tebak Gambar Adab & Sains Cilik',
        emoji: '💡',
        description: 'Mencocokkan kartu bergambar adab makan, belajar, dan doa harian.',
        outcomeScene: {
          title: 'Bintang Pelajar Sholih & Cerdas',
          narration: 'Asy & Syifa berhasil menjawab seluruh tebakan dengan santun dan tepat.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Ilmu yang berkah adalah ilmu yang diamalkan dalam perbuatan sehari-hari!”',
            role: 'SYIFA'
          },
          propEmoji: '💡',
          moralValue: 'Mengintegrasikan ilmu pengetahuan umum dengan adab islami.',
          duaOrHadith: '“Pelajarilah adab sebelum engkau mempelajari ilmu.” (Imam Malik)',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ],
    linkedSchoolEvent: 'HARI_PENDIDIKAN'
  },
  HARI_LINGKUNGAN_HIDUP: {
    id: 'ep_event_lingkungan',
    dayOfWeek: 0,
    dayName: 'Hari Lingkungan Hidup',
    title: 'Benih Kebaikan & Tunas Bumi Asy Syifa',
    subtitle: 'Menjaga kelestarian bumi ciptaan Allah dengan menanam pohon dan memilah sampah',
    theme: 'Sayangi Bumi Rumah Kita',
    category: 'EVENT_SPESIAL',
    targetDurationSec: 25,
    coverBg: 'from-green-700 via-emerald-700 to-teal-800',
    featuredCompanion: 'GOGO',
    livingObject: {
      id: 'obj_gembor_air',
      name: 'Gembor Air Sahabat Bumi',
      emoji: '🌱',
      dialogueOrSound: '“Kucur kucur! Tetesan air menyegarkan tunas hijau yang sedang tumbuh!”',
      action: 'SPARKLE'
    },
    introScene: {
      title: 'Hari Lingkungan Hidup Sedunia',
      narration: 'Kebun Berkah Asy Syifa riuh oleh santri yang memakai celemek kebun dan membawa sekop mini.',
      dialogue: {
        speaker: 'Asy',
        text: '“Bumi ini adalah amanah dari Allah, mari kita rawat bersama agar selalu hijau dan asri!”',
        role: 'ASY'
      },
      propEmoji: '🌍'
    },
    climaxPrompt: {
      question: 'Aksi hijau apa yang ingin Asy & Syifa lakukan di Kebun Berkah?',
      companionTip: 'Gogo tersenyum hangat: “Setiap tanaman yang kita rawat mendoakan kebaikan bagi kita!”'
    },
    choices: [
      {
        id: 'opt_tanam_pohon_buah',
        label: 'Menanam Bibit Pohon Mangga & Jeruk',
        emoji: '🌳',
        description: 'Menggali tanah gembur, memasukkan bibit pohon, dan menyiramnya dengan doa.',
        outcomeScene: {
          title: 'Tunas Pohon Berkah Bertumbuh',
          narration: 'Bibit pohon berdiri tegak disiram air sejuk di bawah hangatnya sinar matahari pagi.',
          dialogue: {
            speaker: 'Asy',
            text: '“Tumbuhlah yang subur ya pohon manis, kelak buahmu akan bermanfaat bagi semua orang!”',
            role: 'ASY'
          },
          propEmoji: '🌳',
          moralValue: 'Kepedulian terhadap kelestarian alam dan sedekah hijau.',
          duaOrHadith: '“Bila kiamat tiba dan di tanganmu ada bibit kurma, maka tanamlah.” (HR. Ahmad)',
          soundFx: 'CELEBRATION'
        }
      },
      {
        id: 'opt_pilah_sampah_organik',
        label: 'Gerakan Pilah Sampah Ceria 3 Tempat',
        emoji: '♻️',
        description: 'Memilah dedaunan untuk kompos dan botol plastik untuk daur ulang kreasi seni.',
        outcomeScene: {
          title: 'Halaman Bersih Asri Bebas Sampah',
          narration: 'Halaman sekolah menjadi rapi dan bersih berkilau tanpa ada satu pun sampah berserakan.',
          dialogue: {
            speaker: 'Syifa',
            text: '“Kebersihan adalah sebagian dari iman, membuang sampah pada tempatnya adalah bukti cinta kita!”',
            role: 'SYIFA'
          },
          propEmoji: '♻️',
          moralValue: 'Kebersihan lingkungan, hidup tertib, dan daur ulang mandiri.',
          duaOrHadith: '“At-thuhuru syathrul iman (Kebersihan itu sebagian dari iman).” (HR. Muslim)',
          soundFx: 'MAGIC_SPARKLE'
        }
      }
    ],
    linkedSchoolEvent: 'HARI_LINGKUNGAN_HIDUP'
  },
  REGULAR_DAY: {
    ...DAILY_INTERACTIVE_EPISODES[1] // fallback to standard episode
  }
};

class InteractiveEpisodeService {
  private static instance: InteractiveEpisodeService | null = null;
  private storyCards: StoryCardRecord[] = [];
  private listeners: (() => void)[] = [];
  private overrideEvent: SchoolEventType | null = null;

  private constructor() {
    this.loadCards();
  }

  public static getInstance(): InteractiveEpisodeService {
    if (!InteractiveEpisodeService.instance) {
      InteractiveEpisodeService.instance = new InteractiveEpisodeService();
    }
    return InteractiveEpisodeService.instance;
  }

  private loadCards() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STORIES);
      if (raw) {
        this.storyCards = JSON.parse(raw);
      } else {
        // Seed with 2 initial wholesome cards if empty
        this.storyCards = [
          {
            id: 'card_initial_1',
            episodeId: 'ep_senin_bunga',
            title: 'Asy & Syifa Mencari Bunga Indah',
            date: '2026-08-17',
            timestamp: new Date(Date.now() - 86400000 * 2).toLocaleDateString('id-ID'),
            chosenOptionId: 'opt_bunga_merah',
            chosenOptionLabel: 'Petik Bunga Merah',
            chosenOptionEmoji: '🌺',
            moralValue: 'Menghargai keindahan alam dengan menjaga dan tidak merusaknya.',
            duaOrHadith: '“Sesungguhnya Allah itu Maha Indah dan mencintai keindahan.” (HR. Muslim)',
            companionName: 'Bubu si Kelinci',
            companionEmoji: '🐰',
            livingObjectName: 'Tas Sekolah Asy',
            livingObjectEmoji: '🎒',
            badge: 'Pecinta Alam Ceria'
          },
          {
            id: 'card_initial_2',
            episodeId: 'ep_selasa_berangkat',
            title: 'Perjalanan Pagi ke Sekolah',
            date: '2026-08-18',
            timestamp: new Date(Date.now() - 86400000).toLocaleDateString('id-ID'),
            chosenOptionId: 'opt_naik_kereta',
            chosenOptionLabel: 'Naik Kereta Cerita',
            chosenOptionEmoji: '🚂',
            moralValue: 'Kebersamaan dan saling berbagi tempat duduk dengan santun.',
            duaOrHadith: '“Bismillahi majreha wa mursaha, inna Rabbi laghafurur rahim.”',
            companionName: 'Gogo si Beruang',
            companionEmoji: '🐻',
            livingObjectName: 'Kereta Cerita',
            livingObjectEmoji: '🚂',
            badge: 'Santri Disiplin Pagi'
          }
        ];
        this.saveCards();
      }
    } catch {
      this.storyCards = [];
    }
  }

  private saveCards() {
    try {
      localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(this.storyCards));
    } catch (e) {
      console.warn('Failed to save story cards', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- Episode Resolution & Active Event Handling ---

  public getActiveEpisode(): InteractiveEpisode {
    // 1. Check if special school event is active
    const activeSchoolTheme = livingEventEngine.getActiveEvent();
    const eventType = this.overrideEvent || (activeSchoolTheme && activeSchoolTheme.eventId !== 'REGULAR_DAY' ? activeSchoolTheme.eventId : null);

    if (eventType && SPECIAL_EVENT_EPISODES[eventType]) {
      return SPECIAL_EVENT_EPISODES[eventType];
    }

    // 2. Otherwise pick based on day of week (0-6)
    const todayDay = new Date().getDay();
    const found = DAILY_INTERACTIVE_EPISODES.find(e => e.dayOfWeek === todayDay);
    return found || DAILY_INTERACTIVE_EPISODES[0];
  }

  public setEventOverride(event: SchoolEventType | null) {
    this.overrideEvent = event;
    this.notify();
  }

  public getAvailableEpisodes(): InteractiveEpisode[] {
    return [...DAILY_INTERACTIVE_EPISODES, ...Object.values(SPECIAL_EVENT_EPISODES)];
  }

  public recordEpisodeCompleted(episode: InteractiveEpisode, choice: InteractiveChoice): StoryCardRecord {
    const companion = COMPANION_DATA[episode.featuredCompanion];
    
    const newCard: StoryCardRecord = {
      id: `card_${Date.now()}`,
      episodeId: episode.id,
      title: episode.title,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      chosenOptionId: choice.id,
      chosenOptionLabel: choice.label,
      chosenOptionEmoji: choice.emoji,
      moralValue: choice.outcomeScene.moralValue,
      duaOrHadith: choice.outcomeScene.duaOrHadith,
      companionName: `${companion.name} (${companion.title})`,
      companionEmoji: companion.emoji,
      livingObjectName: episode.livingObject.name,
      livingObjectEmoji: episode.livingObject.emoji,
      badge: `Bintang ${choice.label}`
    };

    // Prepend to top of book
    this.storyCards = [newCard, ...this.storyCards.filter(c => c.episodeId !== episode.id)];
    this.saveCards();

    // Black box recording
    blackBoxRecorder.record({
      moduleCode: 'EPISODE-INTERAKTIF',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Episode interaktif "${episode.title}" selesai dengan pilihan: "${choice.label}"`,
      severity: 'INFO',
      route: '/garden/interactive-episode'
    });

    try {
      localStorage.setItem(STORAGE_KEY_LAST_PLAYED, JSON.stringify({
        episodeId: episode.id,
        choiceId: choice.id,
        timestamp: Date.now()
      }));
    } catch {}

    tadeSoundEngine.playFx(choice.outcomeScene.soundFx);
    this.notify();
    return newCard;
  }

  public getStoryCards(): StoryCardRecord[] {
    return this.storyCards;
  }

  public clearStoryCards() {
    this.storyCards = [];
    this.saveCards();
    this.notify();
  }
}

export const interactiveEpisodeService = InteractiveEpisodeService.getInstance();
