/**
 * TADE TV ASY SYIFA & SERIAL HARIAN SERVICE (SPRINT G15)
 * Controls daily episode scheduling, characters, story sequencer,
 * Kereta Cerita wagons, Living Objects micro-states, and Secret Surprises.
 * 
 * Complies with:
 * - 60 FPS lightweight animations (via tadeAnimationGovernor)
 * - Dr. Pulse Health Passport Telemetry
 * - BlackBoxRecorder (Ring 1 & Ring 2)
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeSoundEngine } from './tadeSoundEngine';

export interface StoryScene {
  sceneNumber: number;
  durationMs: number;
  title: string;
  narration: string;
  dialogue?: {
    speaker: string;
    speakerRole: 'ASY' | 'SYIFA' | 'BUBU' | 'GOGO' | 'MIMI' | 'DODO' | 'TITI' | 'RARA' | 'NARRATOR';
    text: string;
    actionDescription: string;
  };
  bgTheme: 'ROOM' | 'GARDEN' | 'TRAIN_TRACK' | 'POND' | 'MASJID' | 'FESTIVAL' | 'PICNIC';
  bgGradient: string;
  activeCharacterIds: string[];
  propEmoji: string;
  soundFx?: 'TV_CLICK' | 'TRAIN_CHIME' | 'MAGIC_SPARKLE' | 'POP_WAGON' | 'CELEBRATION';
}

export interface DailyEpisode {
  id: string;
  dayOfWeek: number; // 0: Ahad/Minggu, 1: Senin, ..., 6: Sabtu
  dayName: string;
  title: string;
  subtitle: string;
  theme: string;
  moralValue: string;
  moralLesson?: string;
  hadithOrDua?: string;
  totalDurationSec: number;
  featuredCharacters: string[];
  scenes: StoryScene[];
  coverColor: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  speciesOrRole: string;
  nickname: string;
  bio: string;
  trait: string;
  favoriteFoodOrColor: string;
  avatarBg: string;
  iconType: 'ASY' | 'SYIFA' | 'BUBU' | 'GOGO' | 'MIMI' | 'DODO' | 'TITI' | 'RARA';
}

export interface TrainWagon {
  id: string;
  wagonNumber: number;
  themeTitle: string;
  themeCategory: 'HURUF' | 'ANGKA' | 'DOA' | 'HEWAN' | 'PROFESI' | 'BUNGA' | 'AKHLAK';
  color: string;
  iconEmoji: string;
  highlightText: string;
  detailContent: {
    heading: string;
    subheading: string;
    funFact: string;
    actionPrompt: string;
    quoteOrDua: string;
  };
}

export interface LivingObject {
  id: string;
  name: string;
  room: 'RUANG_TAMU' | 'GUDANG_MAINAN' | 'HALAMAN_DEPAN';
  initialState: string;
  reactionMessage: string;
  iconEmoji: string;
  soundFx: 'TV_CLICK' | 'TRAIN_CHIME' | 'MAGIC_SPARKLE' | 'POP_WAGON' | 'CELEBRATION';
}

export interface SecretSurprise {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'LANGKA' | 'SANGAT_LANGKA' | 'SPESIAL_HARIAN';
  color: string;
  bonusBlessing: string;
}

export const ASY_SYIFA_FRIENDS: CharacterProfile[] = [
  {
    id: 'char_asy',
    name: 'Asy',
    speciesOrRole: 'Anak Laki-laki Cilik Berpeci Hijau',
    nickname: 'Masinis Cilik yang Ramah',
    bio: 'Pemberani, suka naik kereta cerita, rajin mengaji dan memimpin petualangan bersama teman.',
    trait: 'Kepemimpinan & Kejujuran',
    favoriteFoodOrColor: 'Hijau Zamrud & Buah Kurma',
    avatarBg: 'from-emerald-500 to-teal-700',
    iconType: 'ASY'
  },
  {
    id: 'char_syifa',
    name: 'Syifa',
    speciesOrRole: 'Anak Perempuan Berjilbab Kuning',
    nickname: 'Bintang Kasih Sayang',
    bio: 'Santun, senang merawat bunga kamboja, gemar membaca kisah islami dan menyayangi sesama.',
    trait: 'Kasih Sayang & Kesantunan',
    favoriteFoodOrColor: 'Kuning Emas & Madu Manis',
    avatarBg: 'from-amber-400 to-yellow-600',
    iconType: 'SYIFA'
  },
  {
    id: 'char_bubu',
    name: 'Bubu Kelinci',
    speciesOrRole: 'Kelinci Putih Ceria',
    nickname: 'Bubu sang Pelompat Cepat',
    bio: 'Suka wortel segar dari kebun sekolah, selalu bersemangat dan gemar bermain petak umpet.',
    trait: 'Kelincahan & Keriangan',
    favoriteFoodOrColor: 'Wortel Kebun & Jingga',
    avatarBg: 'from-orange-400 to-pink-500',
    iconType: 'BUBU'
  },
  {
    id: 'char_gogo',
    name: 'Gogo Gajah',
    speciesOrRole: 'Gajah Cilik Ramah',
    nickname: 'Gogo sang Penyiram Bunga',
    bio: 'Memiliki belalai lembut yang suka menyiram bunga matahari dan membantu teman membawakan buku.',
    trait: 'Suka Menolong & Lemah Lembut',
    favoriteFoodOrColor: 'Air Jernih & Biru Langit',
    avatarBg: 'from-sky-400 to-indigo-600',
    iconType: 'GOGO'
  },
  {
    id: 'char_mimi',
    name: 'Mimi Lebah',
    speciesOrRole: 'Lebah Belang Rajin',
    nickname: 'Mimi sang Pekerja Keras',
    bio: 'Selalu rajin membuat madu, terbang dari satu bunga ke bunga lain dengan senyuman ceria.',
    trait: 'Gotong Royong & Kerajinan',
    favoriteFoodOrColor: 'Nektar Bunga & Kuning Cerah',
    avatarBg: 'from-yellow-400 to-amber-600',
    iconType: 'MIMI'
  },
  {
    id: 'char_dodo',
    name: 'Dodo Bebek',
    speciesOrRole: 'Bebek Kuning periang',
    nickname: 'Dodo sang Penerbang Layang-layang',
    bio: 'Suka berenang di kolam jernih dan bermain layang-layang warna-warni saat angin sore berhembus.',
    trait: 'Pantang Menyerah & Ceria',
    favoriteFoodOrColor: 'Biji Jagung & Kuning Muda',
    avatarBg: 'from-amber-300 to-orange-500',
    iconType: 'DODO'
  },
  {
    id: 'char_titi',
    name: 'Titi Kura-kura',
    speciesOrRole: 'Kura-kura Hijau Bijak',
    nickname: 'Titi yang Sabar',
    bio: 'Berjalan tenang, selalu berpikir sebelum bertindak, dan senang mendengarkan dongeng sebelum tidur.',
    trait: 'Kesabaran & Kebijaksanaan',
    favoriteFoodOrColor: 'Selada Segar & Hijau Daun',
    avatarBg: 'from-emerald-400 to-green-700',
    iconType: 'TITI'
  },
  {
    id: 'char_rara',
    name: 'Rara Burung',
    speciesOrRole: 'Burung Pipit Biru Merdu',
    nickname: 'Rara sang Penyanyi Pagi',
    bio: 'Kicauannya merdu menyapa anak-anak di pagi hari, gemar menghafal doa-doa pendek bersama Asy.',
    trait: 'Keceriaan Pagi & Semangat Belajar',
    favoriteFoodOrColor: 'Biji Bunga Matahari & Biru Laut',
    avatarBg: 'from-cyan-400 to-blue-600',
    iconType: 'RARA'
  }
];

export const DAILY_EPISODES: DailyEpisode[] = [
  {
    id: 'ep_senin',
    dayOfWeek: 1,
    dayName: 'Senin',
    title: 'Asy Naik Kereta Cerita',
    subtitle: 'Petualangan masinis cilik mengelilingi perbukitan Tanggul',
    theme: 'Semangat Hari Senin & Petualangan Bersama',
    moralValue: 'Memulai pekan dengan basmalah, senyuman, dan semangat menuntut ilmu.',
    totalDurationSec: 20,
    featuredCharacters: ['char_asy', 'char_bubu', 'char_gogo'],
    coverColor: 'from-emerald-600 via-teal-700 to-cyan-800',
    scenes: [
      {
        sceneNumber: 1,
        durationMs: 6000,
        title: 'Peluit Kereta Berbunyi',
        narration: 'Matahari terbit cerah di atas Tanggul. Asy mengenakan topi masinis hijau kesayangannya.',
        dialogue: {
          speaker: 'Asy',
          speakerRole: 'ASY',
          text: 'Tut tut gujes gujes! Kereta Cerita Asy-Syifa siap berangkat! Bismillah!',
          actionDescription: 'Asy membunyikan peluit kereta emas sambil tersenyum lebar.'
        },
        bgTheme: 'TRAIN_TRACK',
        bgGradient: 'from-sky-300 via-emerald-200 to-green-300',
        activeCharacterIds: ['char_asy'],
        propEmoji: '🚂',
        soundFx: 'TRAIN_CHIME'
      },
      {
        sceneNumber: 2,
        durationMs: 7000,
        title: 'Bubu & Gogo Naik di Stasiun Kebun',
        narration: 'Di halte kebun bunga, Bubu Kelinci dan Gogo Gajah melambaikan tangan gembira.',
        dialogue: {
          speaker: 'Bubu Kelinci',
          speakerRole: 'BUBU',
          text: 'Tunggu kami, Masinis Asy! Bubu bawa wortel dan Gogo bawa air segar!',
          actionDescription: 'Bubu melompat riang ke gerbong huruf, Gogo tersenyum ramah.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-emerald-300 via-yellow-200 to-teal-300',
        activeCharacterIds: ['char_asy', 'char_bubu', 'char_gogo'],
        propEmoji: '🥕',
        soundFx: 'POP_WAGON'
      },
      {
        sceneNumber: 3,
        durationMs: 7000,
        title: 'Sampai di Gerbang Sekolah Asy-Syifa',
        narration: 'Kereta berhenti anggun di depan gerbang sekolah. Sahabat-sahabat siap belajar dengan bahagia.',
        dialogue: {
          speaker: 'Asy & Sahabat',
          speakerRole: 'ASY',
          text: 'Alhamdulillah sampai! Hari ini kita belajar dengan hati senang!',
          actionDescription: 'Semua melambaikan tangan bersama ke layar.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-amber-200 via-emerald-300 to-green-400',
        activeCharacterIds: ['char_asy', 'char_bubu', 'char_gogo'],
        propEmoji: '🏫',
        soundFx: 'CELEBRATION'
      }
    ]
  },
  {
    id: 'ep_selasa',
    dayOfWeek: 2,
    dayName: 'Selasa',
    title: 'Syifa Bertemu Bubu Kelinci',
    subtitle: 'Menyiram kebun bunga dan berbagi wortel renyah',
    theme: 'Menyayangi Makhluk Hidup & Berbagi',
    moralValue: 'Berbagi makanan dan menyiram tanaman dengan penuh kasih mendatangkan berkah.',
    totalDurationSec: 20,
    featuredCharacters: ['char_syifa', 'char_bubu'],
    coverColor: 'from-amber-500 via-orange-600 to-rose-600',
    scenes: [
      {
        sceneNumber: 1,
        durationMs: 6500,
        title: 'Kebun Bunga Kamboja yang Harum',
        narration: 'Syifa berjalan santun membawa gembor penyiram kecil di kebun sentra alam.',
        dialogue: {
          speaker: 'Syifa',
          speakerRole: 'SYIFA',
          text: 'Bismillah, bunga kamboja yang cantik, minumlah air sejuk ini ya!',
          actionDescription: 'Syifa menyiram bunga dengan senyum lembut berseri.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-rose-200 via-amber-100 to-emerald-200',
        activeCharacterIds: ['char_syifa'],
        propEmoji: '🌸',
        soundFx: 'MAGIC_SPARKLE'
      },
      {
        sceneNumber: 2,
        durationMs: 7000,
        title: 'Kresek-kresek di Balik Semak',
        narration: 'Tiba-tiba telinga panjang berbulu putih muncul dari balik semak hijau!',
        dialogue: {
          speaker: 'Bubu Kelinci',
          speakerRole: 'BUBU',
          text: 'Halo Kak Syifa! Bubu mencium aroma bunga yang sangat wangi!',
          actionDescription: 'Bubu melompat dua kali sambil mengendus kelopak bunga.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-amber-200 via-green-200 to-emerald-300',
        activeCharacterIds: ['char_syifa', 'char_bubu'],
        propEmoji: '🐰',
        soundFx: 'POP_WAGON'
      },
      {
        sceneNumber: 3,
        durationMs: 6500,
        title: 'Berbagi Wortel Madu Bersama',
        narration: 'Syifa memberikan wortel manis untuk Bubu, dan Bubu mengucapkan terima kasih dengan sopan.',
        dialogue: {
          speaker: 'Syifa & Bubu',
          speakerRole: 'SYIFA',
          text: 'Ini untuk Bubu. Senang sekali berteman denganmu yang manis!',
          actionDescription: 'Bubu memeluk wortel sambil berkedip ceria.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-yellow-100 via-rose-200 to-amber-300',
        activeCharacterIds: ['char_syifa', 'char_bubu'],
        propEmoji: '🥕',
        soundFx: 'CELEBRATION'
      }
    ]
  },
  {
    id: 'ep_rabu',
    dayOfWeek: 3,
    dayName: 'Rabu',
    title: 'Gogo Gajah Menyiram Bunga',
    subtitle: 'Belalai ramah Gogo menyelamatkan bunga matahari yang haus',
    theme: 'Suka Menolong & Ketelitian',
    moralValue: 'Kekuatan yang besar digunakan untuk menolong dan memberi manfaat.',
    totalDurationSec: 20,
    featuredCharacters: ['char_gogo', 'char_mimi', 'char_asy'],
    coverColor: 'from-sky-500 via-indigo-600 to-teal-700',
    scenes: [
      {
        sceneNumber: 1,
        durationMs: 6000,
        title: 'Mimi Lebah Meminta Tolong',
        narration: 'Mimi Lebah terbang mendengung karena bunga matahari di pojok kebun terlihat layu.',
        dialogue: {
          speaker: 'Mimi Lebah',
          speakerRole: 'MIMI',
          text: 'Gogo! Bunga matahari kita butuh air segar! Bisakah belalaimu membantu?',
          actionDescription: 'Mimi terbang berputar-putar dengan sayap bergetar halus.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-sky-200 via-yellow-100 to-emerald-200',
        activeCharacterIds: ['char_mimi'],
        propEmoji: '🐝',
        soundFx: 'TV_CLICK'
      },
      {
        sceneNumber: 2,
        durationMs: 7500,
        title: 'Air Pelangi dari Belalai Gogo',
        narration: 'Gogo Gajah mengambil air dari kolam batu, lalu memancarkannya seperti gerimis pelangi.',
        dialogue: {
          speaker: 'Gogo Gajah',
          speakerRole: 'GOGO',
          text: 'Fuuusshh! Bismillah, segarlah kembali wahai bunga matahari!',
          actionDescription: 'Pancaran air berkilau menetes lembut ke daun-daun.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-cyan-300 via-sky-200 to-teal-300',
        activeCharacterIds: ['char_gogo', 'char_mimi'],
        propEmoji: '🐘',
        soundFx: 'MAGIC_SPARKLE'
      },
      {
        sceneNumber: 3,
        durationMs: 6500,
        title: 'Bunga Tersenyum Lebar',
        narration: 'Bunga matahari kembali mekar tegak bersinar diiringi tepuk tangan Asy dan kawan-kawan.',
        dialogue: {
          speaker: 'Asy',
          speakerRole: 'ASY',
          text: 'Hebat sekali Gogo! Menolong sesama membuat hati kita jadi sejuk!',
          actionDescription: 'Gogo mengibaskan telinga besarnya dengan bangga.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-amber-200 via-emerald-200 to-sky-300',
        activeCharacterIds: ['char_asy', 'char_gogo', 'char_mimi'],
        propEmoji: '🌻',
        soundFx: 'CELEBRATION'
      }
    ]
  },
  {
    id: 'ep_kamis',
    dayOfWeek: 4,
    dayName: 'Kamis',
    title: 'Dodo Bebek Menemukan Layang-layang',
    subtitle: 'Angin sejuk sore hari membawa layang-layang bintang ke tepi danau',
    theme: 'Ketekunan & Kejujuran',
    moralValue: 'Barang temuan dikembalikan kepada pemiliknya dengan tulus.',
    totalDurationSec: 22,
    featuredCharacters: ['char_dodo', 'char_titi', 'char_syifa'],
    coverColor: 'from-cyan-500 via-teal-600 to-blue-700',
    scenes: [
      {
        sceneNumber: 1,
        durationMs: 7000,
        title: 'Dodo Berenang di Kolam Asy-Syifa',
        narration: 'Dodo Bebek sedang berenang santai melihat refleksi awan putih di air jernih.',
        dialogue: {
          speaker: 'Dodo Bebek',
          speakerRole: 'DODO',
          text: 'Kwek kwek! Lihat ada layang-layang berbentuk bintang tersangkut di dahan!',
          actionDescription: 'Dodo menunjuk dahan pohon dengan sayapnya.'
        },
        bgTheme: 'POND',
        bgGradient: 'from-blue-200 via-cyan-100 to-emerald-200',
        activeCharacterIds: ['char_dodo'],
        propEmoji: '🪁',
        soundFx: 'POP_WAGON'
      },
      {
        sceneNumber: 2,
        durationMs: 7500,
        title: 'Nasihat Titi Kura-kura',
        narration: 'Titi Kura-kura berjalan perlahan mendekat dan memberi saran bijak.',
        dialogue: {
          speaker: 'Titi Kura-kura',
          speakerRole: 'TITI',
          text: 'Itu pasti milik teman kita yang tertiup angin kemarin. Mari kita bawa ke Syifa.',
          actionDescription: 'Titi mengangguk pelan dengan senyuman hangat.'
        },
        bgTheme: 'POND',
        bgGradient: 'from-teal-200 via-emerald-100 to-cyan-200',
        activeCharacterIds: ['char_dodo', 'char_titi'],
        propEmoji: '🐢',
        soundFx: 'TV_CLICK'
      },
      {
        sceneNumber: 3,
        durationMs: 7500,
        title: 'Layang-layang Kembali Terbang',
        narration: 'Syifa senang sekali karena layang-layang sekolah ditemukan dan diterbangkan bersama.',
        dialogue: {
          speaker: 'Syifa & Dodo',
          speakerRole: 'SYIFA',
          text: 'Terima kasih Dodo dan Titi yang jujur! Mari kita terbangkan bersama ke langit biru!',
          actionDescription: 'Layang-layang bintang menari-nari ditiup angin segar.'
        },
        bgTheme: 'GARDEN',
        bgGradient: 'from-sky-300 via-amber-100 to-teal-300',
        activeCharacterIds: ['char_syifa', 'char_dodo', 'char_titi'],
        propEmoji: '⭐',
        soundFx: 'CELEBRATION'
      }
    ]
  },
  {
    id: 'ep_jumat',
    dayOfWeek: 5,
    dayName: 'Jumat',
    title: 'Asy dan Syifa ke Masjid',
    subtitle: 'Langkah suci berwudhu, mengenakan baju bersih, dan sedekah jumat berkah',
    theme: 'Jumat Berkah & Adab Beribadah',
    moralValue: 'Memperbanyak shalawat, bersedekah, dan melangkah rapi menuju rumah Allah.',
    totalDurationSec: 22,
    featuredCharacters: ['char_asy', 'char_syifa', 'char_rara'],
    coverColor: 'from-emerald-700 via-teal-800 to-green-950',
    scenes: [
      {
        sceneNumber: 1,
        durationMs: 7000,
        title: 'Rara Burung Berkicau Shalawat',
        narration: 'Pagi Jumat yang sejuk diiringi kicauan merdu Rara Burung di atas kubah masjid.',
        dialogue: {
          speaker: 'Rara Burung',
          speakerRole: 'RARA',
          text: 'Cit cit cuit! Hari Jumat telah tiba! Hari penuh berkah untuk kita semua!',
          actionDescription: 'Rara mengepakkan sayap birunya dengan ceria.'
        },
        bgTheme: 'MASJID',
        bgGradient: 'from-emerald-200 via-teal-100 to-amber-100',
        activeCharacterIds: ['char_rara'],
        propEmoji: '🕌',
        soundFx: 'MAGIC_SPARKLE'
      },
      {
        sceneNumber: 2,
        durationMs: 7500,
        title: 'Berwudhu & Baju Bersih Wangi',
        narration: 'Asy mengenakan peci hijaunya dan Syifa membawa kotak infaq jumat cilik.',
        dialogue: {
          speaker: 'Asy & Syifa',
          speakerRole: 'ASY',
          text: 'Bismillah! Masuk masjid langkahkan kaki kanan: Allahummaf-tahlii abwaaba rahmatik!',
          actionDescription: 'Keduanya melangkah sopan dan tersenyum tenang.'
        },
        bgTheme: 'MASJID',
        bgGradient: 'from-teal-300 via-emerald-200 to-amber-200',
        activeCharacterIds: ['char_asy', 'char_syifa'],
        propEmoji: '🤲',
        soundFx: 'TV_CLICK'
      },
      {
        sceneNumber: 3,
        durationMs: 7500,
        title: 'Senyum Bahagia Sedekah Jumat',
        narration: 'Memasukkan koin infaq ke kotak masjid membuat hati terasa sangat damai dan terang.',
        dialogue: {
          speaker: 'Syifa',
          speakerRole: 'SYIFA',
          text: 'Alhamdulillah, semoga sedekah kecil kita membawa berkah untuk semua kawan.',
          actionDescription: 'Cahaya keemasan lembut berpendar di atas kubah masjid.'
        },
        bgTheme: 'MASJID',
        bgGradient: 'from-amber-200 via-emerald-300 to-teal-400',
        activeCharacterIds: ['char_asy', 'char_syifa', 'char_rara'],
        propEmoji: '✨',
        soundFx: 'CELEBRATION'
      }
    ]
  },
  {
    id: 'ep_sabtu',
    dayOfWeek: 6,
    dayName: 'Sabtu',
    title: 'Festival Mainan Asy-Syifa',
    subtitle: 'Kotak Mainan Asy dibuka, balok dan kereta meluncur gembira',
    theme: 'Kreativitas & Kerja Sama Sentra',
    moralValue: 'Bermain tertib, bergantian, dan merapikan mainan kembali ke tempatnya.',
    totalDurationSec: 20,
    featuredCharacters: ['char_asy', 'char_bubu', 'char_gogo', 'char_dodo'],
    coverColor: 'from-purple-600 via-pink-600 to-amber-600',
    scenes: [
      {
        sceneNumber: 1,
        durationMs: 6500,
        title: 'Gudang Mainan Dibuka!',
        narration: 'Hari Sabtu adalah hari festival! Asy memutar kunci emas Kotak Mainan Asy.',
        dialogue: {
          speaker: 'Asy',
          speakerRole: 'ASY',
          text: 'Bismillah! Kotak Mainan Asy terbuka! Wah ada 48 mainan lucu di dalamnya!',
          actionDescription: 'Pintu kotak mainan berkedip dengan pendar bintang warna-warni.'
        },
        bgTheme: 'FESTIVAL',
        bgGradient: 'from-purple-200 via-pink-100 to-amber-200',
        activeCharacterIds: ['char_asy'],
        propEmoji: '🎁',
        soundFx: 'MAGIC_SPARKLE'
      },
      {
        sceneNumber: 2,
        durationMs: 7000,
        title: 'Membangun Menara Balok Warna-warni',
        narration: 'Gogo menyusun balok tertinggi, Bubu mengendarai mobil kayu, Dodo meniup gelembung.',
        dialogue: {
          speaker: 'Gogo & Bubu',
          speakerRole: 'GOGO',
          text: 'Lihat menara kita kokoh sekali! Terima kasih sudah saling membantu ya!',
          actionDescription: 'Balok tersenyum dan gelembung melayang pelan.'
        },
        bgTheme: 'FESTIVAL',
        bgGradient: 'from-pink-200 via-yellow-100 to-teal-200',
        activeCharacterIds: ['char_gogo', 'char_bubu', 'char_dodo'],
        propEmoji: '🏰',
        soundFx: 'POP_WAGON'
      },
      {
        sceneNumber: 3,
        durationMs: 6500,
        title: 'Merapikan Mainan Bersama-sama',
        narration: 'Setelah selesai bermain, semua sahabat dengan cekatan merapikan mainan ke rak.',
        dialogue: {
          speaker: 'Asy & Sahabat',
          speakerRole: 'ASY',
          text: 'Rapikan mainan, hati senang, ruangan bersih! Alhamdulillah!',
          actionDescription: 'Semua sahabat bertepuk tangan berirama.'
        },
        bgTheme: 'FESTIVAL',
        bgGradient: 'from-amber-200 via-emerald-200 to-purple-300',
        activeCharacterIds: ['char_asy', 'char_bubu', 'char_gogo', 'char_dodo'],
        propEmoji: '⭐',
        soundFx: 'CELEBRATION'
      }
    ]
  },
  {
    id: 'ep_ahad',
    dayOfWeek: 0,
    dayName: 'Ahad',
    title: 'Piknik Ceria Bersama Teman',
    subtitle: 'Duduk di tikar rumput hijau menikmati buah segar dan semilir angin',
    theme: 'Keluarga & Rasa Syukur',
    moralValue: 'Menikmati hari libur bersama keluarga dan sahabat dengan penuh syukur.',
    totalDurationSec: 20,
    featuredCharacters: ['char_asy', 'char_syifa', 'char_mimi', 'char_titi'],
    coverColor: 'from-teal-600 via-emerald-600 to-yellow-600',
    scenes: [
      {
        sceneNumber: 1,
        durationMs: 6500,
        title: 'Membentang Tikar di Bawah Pohon Rindang',
        narration: 'Matahari Ahad bersinar hangat, tikar pandan dibentangkan di taman sekolah.',
        dialogue: {
          speaker: 'Syifa',
          speakerRole: 'SYIFA',
          text: 'Mari duduk bersama, Bunda membuatkan roti madu dan pisang manis!',
          actionDescription: 'Syifa menata piring buah dengan rapi di atas tikar.'
        },
        bgTheme: 'PICNIC',
        bgGradient: 'from-emerald-200 via-lime-100 to-amber-200',
        activeCharacterIds: ['char_syifa', 'char_titi'],
        propEmoji: '🧺',
        soundFx: 'TV_CLICK'
      },
      {
        sceneNumber: 2,
        durationMs: 7000,
        title: 'Mimi Membawa Madu Hutan',
        narration: 'Mimi Lebah terbang membawa cangkir madu kecil untuk dibagikan.',
        dialogue: {
          speaker: 'Mimi Lebah',
          speakerRole: 'MIMI',
          text: 'Madu segar untuk kawan-kawan terbaikku di TK Asy Syifa!',
          actionDescription: 'Semua tersenyum gembira menyantap hidangan sehat.'
        },
        bgTheme: 'PICNIC',
        bgGradient: 'from-amber-200 via-yellow-100 to-teal-200',
        activeCharacterIds: ['char_mimi', 'char_syifa', 'char_asy'],
        propEmoji: '🍯',
        soundFx: 'MAGIC_SPARKLE'
      },
      {
        sceneNumber: 3,
        durationMs: 6500,
        title: 'Menatap Langit Cerah Bersama',
        narration: 'Angin sejuk berhembus lembut. Sahabat Asy & Syifa siap menyambut esok hari.',
        dialogue: {
          speaker: 'Asy',
          speakerRole: 'ASY',
          text: 'Sampai jumpa besok di Kereta Cerita Senin! Assalamu\'alaikum sahabat cilik!',
          actionDescription: 'Semua melambaikan tangan dengan penuh kehangatan.'
        },
        bgTheme: 'PICNIC',
        bgGradient: 'from-sky-200 via-emerald-200 to-amber-300',
        activeCharacterIds: ['char_asy', 'char_syifa', 'char_mimi', 'char_titi'],
        propEmoji: '🌈',
        soundFx: 'CELEBRATION'
      }
    ]
  }
];

export const TRAIN_WAGONS: TrainWagon[] = [
  {
    id: 'wagon_huruf',
    wagonNumber: 1,
    themeTitle: 'Gerbong Huruf',
    themeCategory: 'HURUF',
    color: 'from-emerald-500 to-teal-700',
    iconEmoji: '🔤',
    highlightText: 'Huruf Hari Ini: B',
    detailContent: {
      heading: 'Huruf "B" — Bismillah & Berbagi',
      subheading: 'Karakter: Ba (ب) dalam Huruf Hijaiyah',
      funFact: 'Kata ajaib berawalan B: Bismillah, Bubu Kelinci, Balon Ceria, Buku Pintar, Berbagi Kebaikan.',
      actionPrompt: 'Ayo ucapkan bersama: "Bismillahir-Rahmaanir-Rahiim"!',
      quoteOrDua: 'Ucapkan Bismillah sebelum makan dan sebelum belajar agar berkah.'
    }
  },
  {
    id: 'wagon_angka',
    wagonNumber: 2,
    themeTitle: 'Gerbong Angka',
    themeCategory: 'ANGKA',
    color: 'from-amber-500 to-orange-700',
    iconEmoji: '🔢',
    highlightText: 'Angka Hari Ini: 3 (Tiga)',
    detailContent: {
      heading: 'Angka 3 — Tiga Kebiasaan Baik',
      subheading: '1, 2, 3... Senyum, Salam, Sapa!',
      funFact: 'Nabi mengajarkan kita bernafas 3 kali saat minum air dan mencuci anggota wudhu 3 kali.',
      actionPrompt: 'Angkat 3 jarimu dan sebutkan 3 teman yang kamu sayangi!',
      quoteOrDua: 'Tiga amalan tak putus: Sedekah jariyah, ilmu bermanfaat, anak sholeh mendoakan.'
    }
  },
  {
    id: 'wagon_doa',
    wagonNumber: 3,
    themeTitle: 'Gerbong Doa Harian',
    themeCategory: 'DOA',
    color: 'from-sky-500 to-blue-700',
    iconEmoji: '🤲',
    highlightText: 'Doa Sebelum Belajar',
    detailContent: {
      heading: 'Doa Menuntut Ilmu & Kebaikan',
      subheading: 'Rabbi Zidnii \'Ilmaa, Warzuqnii Fahmaa',
      funFact: 'Membaca doa sebelum belajar membuka pintu kecerdasan dan melapangkan dada.',
      actionPrompt: 'Angkat kedua tanganmu seperti mangkuk bunga dan baca doa ini bersama Syifa!',
      quoteOrDua: '“Ya Allah, tambahkanlah ilmuku dan karuniakanlah pemahaman yang luas.”'
    }
  },
  {
    id: 'wagon_hewan',
    wagonNumber: 4,
    themeTitle: 'Gerbong Hewan Sahabat',
    themeCategory: 'HEWAN',
    color: 'from-purple-500 to-indigo-700',
    iconEmoji: '🐾',
    highlightText: 'Gogo sang Gajah Lembut',
    detailContent: {
      heading: 'Hewan Sahabat: Gajah Cilik',
      subheading: 'Karakter: Suka Menolong & Penyayang',
      funFact: 'Gajah memiliki ingatan yang luar biasa dan sangat menyayangi keluarganya.',
      actionPrompt: 'Rentangkan kedua tanganmu seperti telinga gajah yang lebar dan ramah!',
      quoteOrDua: 'Menyayangi binatang adalah bagian dari akhlak mulia anak sholeh.'
    }
  },
  {
    id: 'wagon_profesi',
    wagonNumber: 5,
    themeTitle: 'Gerbong Cita-cita Cilik',
    themeCategory: 'PROFESI',
    color: 'from-rose-500 to-pink-700',
    iconEmoji: '🚀',
    highlightText: 'Masinis & Dokter Cilik',
    detailContent: {
      heading: 'Profesi Masinis Kereta Api',
      subheading: 'Mengantarkan Penumpang dengan Aman & Tepat Waktu',
      funFact: 'Masinis adalah nakhoda darat yang memastikan semua orang sampai di tujuan dengan selamat.',
      actionPrompt: 'Tirukan suara peluit kereta: "Tuuuut tuuuut gujes gujes!"',
      quoteOrDua: 'Belajarlah tekun sejak dini, raih cita-cita muliamu demi membahagiakan orang tua.'
    }
  },
  {
    id: 'wagon_bunga',
    wagonNumber: 6,
    themeTitle: 'Gerbong Sentra Alam',
    themeCategory: 'BUNGA',
    color: 'from-teal-500 to-emerald-700',
    iconEmoji: '🌻',
    highlightText: 'Bunga Kamboja & Melati',
    detailContent: {
      heading: 'Bunga Kamboja Tanggul yang Harum',
      subheading: 'Tanaman Asri Sentra Alam TK Asy Syifa',
      funFact: 'Bunga menghasilkan oksigen segar yang membuat udara sekolah kita sejuk setiap pagi.',
      actionPrompt: 'Hirup nafas panjang... Segarkan tubuhmu dengan udara pagi!',
      quoteOrDua: 'Menjaga kebersihan taman adalah bukti cinta kita kepada bumi ciptaan Allah.'
    }
  },
  {
    id: 'wagon_akhlak',
    wagonNumber: 7,
    themeTitle: 'Gerbong Akhlak & Sedekah',
    themeCategory: 'AKHLAK',
    color: 'from-amber-600 to-yellow-700',
    iconEmoji: '💖',
    highlightText: 'Senyum itu Sedekah',
    detailContent: {
      heading: 'Akhlak Mulia: Tabassumuka Fii Wajhi Akhika',
      subheading: 'Senyum Tulus Menghangatkan Hati Teman',
      funFact: 'Ketika kita tersenyum, otak memproduksi hormon bahagia yang menyehatkan tubuh.',
      actionPrompt: 'Berikan senyum termanismu kepada orang di sebelahmu sekarang!',
      quoteOrDua: '“Senyummu di depan saudaramu adalah sedekah bagimu.” (HR. Tirmidzi)'
    }
  }
];

export const LIVING_OBJECTS: LivingObject[] = [
  {
    id: 'living_train',
    name: 'Kereta Tersenyum',
    room: 'HALAMAN_DEPAN',
    initialState: 'Tersenyum dan mengedipkan lampu lokomotif',
    reactionMessage: 'Tuuuut! Kereta tersenyum senang karena kamu mengetuknya!',
    iconEmoji: '🚂',
    soundFx: 'TRAIN_CHIME'
  },
  {
    id: 'living_bag',
    name: 'Tas Sekolah Berkedip',
    room: 'RUANG_TAMU',
    initialState: 'Berkedip ramah di gantungan dinding',
    reactionMessage: 'Klipp! Tas sekolah siap membawa buku-buku penuh ilmu!',
    iconEmoji: '🎒',
    soundFx: 'TV_CLICK'
  },
  {
    id: 'living_pencil',
    name: 'Pensil Melambai',
    room: 'RUANG_TAMU',
    initialState: 'Melambai lembut di tempat pensil kayu',
    reactionMessage: 'Hai! Ayo menggambar pelangi dan huruf hijaiyah bersama!',
    iconEmoji: '✏️',
    soundFx: 'MAGIC_SPARKLE'
  },
  {
    id: 'living_balloon',
    name: 'Balon Malu-Malu',
    room: 'GUDANG_MAINAN',
    initialState: 'Pipi merah merona melayang pelan',
    reactionMessage: 'Hihi! Balon tersipu malu dan menari di udara!',
    iconEmoji: '🎈',
    soundFx: 'POP_WAGON'
  },
  {
    id: 'living_book',
    name: 'Buku Buka Sendiri',
    room: 'RUANG_TAMU',
    initialState: 'Halaman berkerlip memancarkan bintang',
    reactionMessage: 'Ssshh... Lembaran buku terbuka menampilkan kisah para nabi!',
    iconEmoji: '📖',
    soundFx: 'MAGIC_SPARKLE'
  }
];

export const SECRET_SURPRISES: SecretSurprise[] = [
  {
    id: 'surprise_rainbow',
    name: 'Pelangi Ajaib Tujuh Warna',
    description: 'Pelangi indah membentang di atas atap sekolah Asy-Syifa!',
    emoji: '🌈',
    rarity: 'LANGKA',
    color: 'from-pink-500 via-amber-400 to-teal-400',
    bonusBlessing: '+10 Poin Kebahagiaan & Senyuman Ceria'
  },
  {
    id: 'surprise_butterfly',
    name: 'Kupu-kupu Emas Kebun',
    description: 'Kupu-kupu berkilau hinggap di pundak Syifa!',
    emoji: '🦋',
    rarity: 'SANGAT_LANGKA',
    color: 'from-amber-400 via-yellow-300 to-amber-500',
    bonusBlessing: '+15 Poin Kelembutan Kasih Sayang'
  },
  {
    id: 'surprise_balloon',
    name: 'Balon Kejutan Konfeti',
    description: 'Balon istimewa meletupkan taburan bintang keberkahan!',
    emoji: '🎈',
    rarity: 'SPESIAL_HARIAN',
    color: 'from-rose-500 via-purple-500 to-sky-400',
    bonusBlessing: '+10 Poin Semangat Belajar'
  },
  {
    id: 'surprise_seed',
    name: 'Benih Ajaib Kebaikan',
    description: 'Benih pohon kebaikan tumbuh menjadi tanaman berbunga harum!',
    emoji: '🌱',
    rarity: 'LANGKA',
    color: 'from-emerald-400 via-green-500 to-teal-600',
    bonusBlessing: '+20 Poin Cinta Alam Asy-Syifa'
  },
  {
    id: 'surprise_dino',
    name: 'Dino Cilik Sahabat Asy',
    description: 'Mini Dino lucu memakai peci hijau melompat riang!',
    emoji: '🦖',
    rarity: 'SANGAT_LANGKA',
    color: 'from-teal-400 via-emerald-500 to-cyan-600',
    bonusBlessing: '+25 Poin Kawan Sejati'
  }
];

class TVAsySyifaService {
  private static instance: TVAsySyifaService;
  private currentRoom: 'RUANG_TAMU' | 'GUDANG_MAINAN' | 'HALAMAN_DEPAN' = 'RUANG_TAMU';
  private tvPowerOn: boolean = true;
  private activeEpisodeId: string;
  private currentSceneIndex: number = 0;
  private isPlayingStory: boolean = false;
  private volume: number = 80;
  private unlockedSurprises: string[] = [];
  private totalWatchedEpisodes: number = 0;

  private constructor() {
    const todayDay = new Date().getDay(); // 0-6
    const todayEpisode = DAILY_EPISODES.find(e => e.dayOfWeek === todayDay) || DAILY_EPISODES[1];
    this.activeEpisodeId = todayEpisode.id;
    this.loadFromStorage();
  }

  public static getInstance(): TVAsySyifaService {
    if (!TVAsySyifaService.instance) {
      TVAsySyifaService.instance = new TVAsySyifaService();
    }
    return TVAsySyifaService.instance;
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('tade_tv_asy_syifa_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedSurprises) this.unlockedSurprises = parsed.unlockedSurprises;
        if (typeof parsed.totalWatchedEpisodes === 'number') this.totalWatchedEpisodes = parsed.totalWatchedEpisodes;
      }
    } catch {
      // safe fallback
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('tade_tv_asy_syifa_state', JSON.stringify({
        unlockedSurprises: this.unlockedSurprises,
        totalWatchedEpisodes: this.totalWatchedEpisodes,
        lastSaved: new Date().toISOString()
      }));
    } catch {
      // safe fallback
    }
  }

  // --- Getters ---
  public getTodayEpisode(): DailyEpisode {
    const todayDay = new Date().getDay();
    return DAILY_EPISODES.find(e => e.dayOfWeek === todayDay) || DAILY_EPISODES[1];
  }

  public getAllEpisodes(): DailyEpisode[] {
    return DAILY_EPISODES;
  }

  public getActiveEpisode(): DailyEpisode {
    return DAILY_EPISODES.find(e => e.id === this.activeEpisodeId) || this.getTodayEpisode();
  }

  public setActiveEpisode(episodeId: string): void {
    const ep = DAILY_EPISODES.find(e => e.id === episodeId);
    if (ep) {
      this.activeEpisodeId = episodeId;
      this.currentSceneIndex = 0;
      this.isPlayingStory = false;
      tadeSoundEngine.playFx('TV_CLICK');
      
      blackBoxRecorder.record({
        ring: 'RING_2',
        moduleCode: 'G15-TV-ASY-SYIFA',
        role: 'SANTRI',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Episode TV Asy Syifa diganti ke: "${ep.title}" (${ep.dayName})`
      });
    }
  }

  public getFriends(): CharacterProfile[] {
    return ASY_SYIFA_FRIENDS;
  }

  public getTrainWagons(): TrainWagon[] {
    return TRAIN_WAGONS;
  }

  public getLivingObjects(room?: 'RUANG_TAMU' | 'GUDANG_MAINAN' | 'HALAMAN_DEPAN'): LivingObject[] {
    if (room) {
      return LIVING_OBJECTS.filter(o => o.room === room);
    }
    return LIVING_OBJECTS;
  }

  public getSecretSurprises(): SecretSurprise[] {
    return SECRET_SURPRISES;
  }

  public getUnlockedSurprises(): string[] {
    return this.unlockedSurprises;
  }

  public unlockSurprise(surpriseId: string): SecretSurprise | null {
    const surprise = SECRET_SURPRISES.find(s => s.id === surpriseId);
    if (surprise) {
      if (!this.unlockedSurprises.includes(surpriseId)) {
        this.unlockedSurprises.push(surpriseId);
        this.saveToStorage();
        tadeSoundEngine.playFx('MAGIC_SPARKLE');

        blackBoxRecorder.record({
          ring: 'RING_1',
          moduleCode: 'G15-TV-ASY-SYIFA',
          role: 'SANTRI',
          category: 'ACTION',
          eventType: 'ACTION',
          details: `Kejutan Rahasia Ditemukan: ${surprise.emoji} "${surprise.name}" (${surprise.rarity})`
        });
      }
      return surprise;
    }
    return null;
  }

  public recordEpisodeWatched(episodeId: string): void {
    this.totalWatchedEpisodes += 1;
    this.saveToStorage();
    tadeSoundEngine.playFx('CELEBRATION');

    const ep = DAILY_EPISODES.find(e => e.id === episodeId);
    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G15-TV-ASY-SYIFA',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Serial Harian TV Asy Syifa selesai ditonton: "${ep?.title}" (Total ditonton: ${this.totalWatchedEpisodes})`
    });
  }

  public getCurrentRoom(): 'RUANG_TAMU' | 'GUDANG_MAINAN' | 'HALAMAN_DEPAN' {
    return this.currentRoom;
  }

  public setCurrentRoom(room: 'RUANG_TAMU' | 'GUDANG_MAINAN' | 'HALAMAN_DEPAN'): void {
    this.currentRoom = room;
    tadeSoundEngine.playFx('TV_CLICK');
  }

  public isTvPowerOn(): boolean {
    return this.tvPowerOn;
  }

  public toggleTvPower(): boolean {
    this.tvPowerOn = !this.tvPowerOn;
    tadeSoundEngine.playFx('TV_CLICK');
    return this.tvPowerOn;
  }
}

export const tvAsySyifaService = TVAsySyifaService.getInstance();
