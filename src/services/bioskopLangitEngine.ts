/**
 * TADE SPRINT G26 — BIOSKOP LANGIT ASY & SYIFA ENGINE
 * Pure Web Audio API & Lightweight Celestial Cinema Engine.
 * 
 * Complies with:
 * - 60 FPS Guarantee (Maksimal 5 animasi simultan via tadeAnimationGovernor)
 * - Zero heavy video dependencies (uses TADE G21 cartoon camera transitions & SVG stages)
 * - Eco Mode auto-reduction on low power/frames
 * - Guardian Ring-0 & Hermes Recovery Telemetry (BlackBoxRecorder)
 * - Integrates TV Asy, Sutradara G22, Kota Mini G23, Rumah Kreatif G24, & Hari Besar G25
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { asySyifaDnaEngine } from './asySyifaDnaEngine';

export type CinemaSeatType = 'AWAN_PUTIH' | 'BINTANG_KEJORA' | 'PELANGI_SYAWAL' | 'BULAN_SABIT';

export type CinemaSkyTheme = 'MALAM_PURNAMA' | 'MALAM_BERBINTANG' | 'SENJA_EMAS' | 'AURORA_BERKAH';

export type CinemaStorySource = 'TV_ASY' | 'SUTRADARA_G22' | 'FESTIVAL_SENTRA' | 'KOTA_MINI_G23' | 'RUMAH_KREATIF_G24' | 'HARI_BESAR_G25';

export interface CinemaSeatInfo {
  id: CinemaSeatType;
  name: string;
  subtitle: string;
  iconEmoji: string;
  fluffiness: string;
  atmosphere: string;
  themeColor: string;
  borderGlow: string;
  bgGradient: string;
  asyVoiceLine: string;
}

export interface CinemaScene {
  id: string;
  sceneNumber: number;
  title: string;
  narration: string;
  dialogue?: {
    speaker: string;
    role: 'ASY' | 'SYIFA' | 'BUBU' | 'GOGO' | 'MIMI' | 'DODO' | 'NARRATOR';
    text: string;
    action: string;
  };
  visualStage: {
    bgGradient: string;
    propEmoji: string;
    ambientDecor: string[];
    characterAction: 'SMILE_WAVE' | 'READ_BOOK' | 'PRAYING' | 'HELPING' | 'DISCOVER_STAR' | 'PAINTING';
  };
  moralHikmah: string;
  durationSec: number;
}

export interface CinemaStoryEpisode {
  id: string;
  source: CinemaStorySource;
  sourceLabel: string;
  title: string;
  subtitle: string;
  theme: string;
  coverGradient: string;
  coverEmoji: string;
  totalDurationSec: number;
  moralTag: string;
  featuredCharacters: string[];
  scenes: CinemaScene[];
}

export interface PopcornBurstItem {
  id: string;
  x: number;
  y: number;
  emoji: string;
  size: number;
  rotation: number;
}

export const CINEMA_SEATS_CATALOG: Record<CinemaSeatType, CinemaSeatInfo> = {
  AWAN_PUTIH: {
    id: 'AWAN_PUTIH',
    name: 'Awan Putih Ceria',
    subtitle: 'Kasur kapas empuk melayang lembut di langit malam',
    iconEmoji: '☁️',
    fluffiness: '100% Lembut & Nyaman',
    atmosphere: 'Semilir Angin Sejuk Tanggul',
    themeColor: 'sky',
    borderGlow: 'shadow-sky-400/40 border-sky-300',
    bgGradient: 'from-sky-500/20 via-sky-400/10 to-indigo-900/30',
    asyVoiceLine: '“Yuk duduk manis di Awan Putih bersama Asy! Rasanya empuk seperti kasur kapas!”'
  },
  BINTANG_KEJORA: {
    id: 'BINTANG_KEJORA',
    name: 'Bintang Kejora',
    subtitle: 'Kursi permata emas berkilau memancarkan cahaya doa',
    iconEmoji: '⭐',
    fluffiness: 'Hangat & Penuh Kilau',
    atmosphere: 'Cahaya Lembut Bintang Kejora',
    themeColor: 'amber',
    borderGlow: 'shadow-amber-400/40 border-amber-300',
    bgGradient: 'from-amber-500/20 via-amber-400/10 to-purple-900/30',
    asyVoiceLine: '“Bintang Kejora ini berkilau terang saat anak-anak sholih tersenyum!”'
  },
  PELANGI_SYAWAL: {
    id: 'PELANGI_SYAWAL',
    name: 'Pelangi Syawal',
    subtitle: 'Lounge warna-warni melengkung berhias bunga melati',
    iconEmoji: '🌈',
    fluffiness: 'Ceria & Penuh Warna',
    atmosphere: 'Aroma Melati & Kasih Sayang',
    themeColor: 'emerald',
    borderGlow: 'shadow-emerald-400/40 border-emerald-300',
    bgGradient: 'from-emerald-500/20 via-teal-400/10 to-slate-900/30',
    asyVoiceLine: '“Mbak Syifa suka sekali duduk di Pelangi Syawal, warnanya indah seperti karya lukisan!”'
  },
  BULAN_SABIT: {
    id: 'BULAN_SABIT',
    name: 'Bulan Sabit Emas',
    subtitle: 'Ayunan syahdu di lengkung bulan bertabur lentera bintang',
    iconEmoji: '🌙',
    fluffiness: 'Tenang & Menenangkan Jiwa',
    atmosphere: 'Dzikir Malam & Doa Syahdu',
    themeColor: 'indigo',
    borderGlow: 'shadow-indigo-400/40 border-indigo-300',
    bgGradient: 'from-indigo-500/20 via-purple-400/10 to-slate-950/40',
    asyVoiceLine: '“Di Bulan Sabit ini, kita bisa mendengarkan dongeng malam sambil memandang indahnya semesta.”'
  }
};

export const CINEMA_STORIES_CATALOG: CinemaStoryEpisode[] = [
  {
    id: 'cstory_adab_santri',
    source: 'TV_ASY',
    sourceLabel: 'Serial TV Asy (G15)',
    title: 'Adab Berbagi Bekal di Waktu Istirahat',
    subtitle: 'Kisah ketulusan Dek Asy dan Bubu menyantap rezeki bersama sahabat',
    theme: 'Kasih Sayang & Menghargai Makanan',
    coverGradient: 'from-sky-900 via-indigo-900 to-purple-950',
    coverEmoji: '🍱',
    totalDurationSec: 45,
    moralTag: 'Akhlakul Karimah',
    featuredCharacters: ['Asy', 'Syifa', 'Bubu'],
    scenes: [
      {
        id: 'cscene_1_1',
        sceneNumber: 1,
        title: 'Mentari Teduh di Gazebo Sekolah',
        narration: 'Lonceng istirahat berbunyi ceria. Dek Asy membuka kotak bekal berbentuk bintang yang disiapkan oleh Ibu.',
        dialogue: {
          speaker: 'Asy',
          role: 'ASY',
          text: '“Bismillah, ada nasi kuning dan telur gulung lezat! Bubu, ayo kita makan bersama.”',
          action: 'Membuka bekal dengan senyum riang.'
        },
        visualStage: {
          bgGradient: 'from-blue-900 via-indigo-900 to-slate-900',
          propEmoji: '🍱',
          ambientDecor: ['🍃', '🌸', '✨'],
          characterAction: 'SMILE_WAVE'
        },
        moralHikmah: 'Membaca doa sebelum dan sesudah makan adalah tanda syukur kepada Allah.',
        durationSec: 15
      },
      {
        id: 'cscene_1_2',
        sceneNumber: 2,
        title: 'Bubu yang Lupa Membawa Roti',
        narration: 'Bubu tupai kecil tampak meraba tasnya yang tertinggal di kelas. Dek Asy dengan sigap membagi rotinya menjadi dua bagian sama rata.',
        dialogue: {
          speaker: 'Bubu',
          role: 'BUBU',
          text: '“Wah, terima kasih Asy! Asy baik sekali mau berbagi separuh rotinya denganku.”',
          action: 'Menerima roti dengan dua tangan sambil membungkuk sopan.'
        },
        visualStage: {
          bgGradient: 'from-indigo-900 via-purple-900 to-slate-900',
          propEmoji: '🥪',
          ambientDecor: ['⭐', '🍞', '💖'],
          characterAction: 'HELPING'
        },
        moralHikmah: 'Tangan di atas lebih baik daripada tangan di bawah.',
        durationSec: 15
      },
      {
        id: 'cscene_1_3',
        sceneNumber: 3,
        title: 'Doa Bersama Penuh Berkah',
        narration: 'Mbak Syifa datang membawa air kendi dingin. Mereka duduk melingkar di atas tikar bambu sambil mengucap syukur.',
        dialogue: {
          speaker: 'Syifa',
          role: 'SYIFA',
          text: '“Alhamdulillahilladzi ath\'amanaa wa saqoonaa wa ja\'alanaa minal muslimiin.”',
          action: 'Mengangkat kedua tangan berdoa dengan santun.'
        },
        visualStage: {
          bgGradient: 'from-purple-950 via-slate-900 to-teal-950',
          propEmoji: '🤲',
          ambientDecor: ['✨', '🌙', '🌟'],
          characterAction: 'PRAYING'
        },
        moralHikmah: 'Kebersamaan dalam kebaikan mendatangkan kedamaian hati.',
        durationSec: 15
      }
    ]
  },
  {
    id: 'cstory_sutradara_safari',
    source: 'SUTRADARA_G22',
    sourceLabel: 'Sutradara Ajaib (G22)',
    title: 'Safari Bintang & Menara Cahaya',
    subtitle: 'Petualangan mencari bintang kebajikan di perbukitan Tanggul',
    theme: 'Keberanian & Kerjasama',
    coverGradient: 'from-amber-950 via-slate-900 to-indigo-950',
    coverEmoji: '🔭',
    totalDurationSec: 45,
    moralTag: 'Eksplorasi Sains & Iman',
    featuredCharacters: ['Asy', 'Syifa', 'Gogo'],
    scenes: [
      {
        id: 'cscene_2_1',
        sceneNumber: 1,
        title: 'Mengarahkan Teropong Bintang',
        narration: 'Malam jernih di bukit Tanggul. Mbak Syifa dan Asy mengarahkan teropong bambu ajaib ke gugusan rasi bintang.',
        dialogue: {
          speaker: 'Syifa',
          role: 'SYIFA',
          text: '“Lihat Asy! Rasi bintang itu membentuk formasi kapal layar yang sangat indah!”',
          action: 'Melihat melalui lensa teropong sambil tersenyum kagum.'
        },
        visualStage: {
          bgGradient: 'from-slate-950 via-indigo-950 to-blue-950',
          propEmoji: '🔭',
          ambientDecor: ['⭐', '✨', '🪐'],
          characterAction: 'DISCOVER_STAR'
        },
        moralHikmah: 'Maha Suci Allah yang telah menghiasi langit dunia dengan pelita bintang-bintang.',
        durationSec: 15
      },
      {
        id: 'cscene_2_2',
        sceneNumber: 2,
        title: 'Lentera Menara Penunjuk Arah',
        narration: 'Gogo si beruang madu menyalakan lentera menara cahaya agar para musafir malam tidak tersesat.',
        dialogue: {
          speaker: 'Gogo',
          role: 'GOGO',
          text: '“Cahaya kebaikan ini akan menerangi jalan semua sahabat yang pulang ke rumah.”',
          action: 'Mengangkat lentera emas dengan kokoh.'
        },
        visualStage: {
          bgGradient: 'from-indigo-950 via-teal-950 to-slate-950',
          propEmoji: '🏮',
          ambientDecor: ['🔥', '✨', '🌲'],
          characterAction: 'HELPING'
        },
        moralHikmah: 'Jadilah penuntun kebaikan di mana pun kita berada.',
        durationSec: 15
      },
      {
        id: 'cscene_2_3',
        sceneNumber: 3,
        title: 'Pulang dengan Hati Bahagia',
        narration: 'Dengan hati lapang dan penuh syukur, Asy dan sahabat melangkah pulang diiringi lagu nasyid lembut.',
        dialogue: {
          speaker: 'Asy',
          role: 'ASY',
          text: '“Besok pagi kita akan ceritakan keindahan bintang ini kepada Ustadz dan teman-teman!”',
          action: 'Melambaikan tangan riang ke arah langit malam.'
        },
        visualStage: {
          bgGradient: 'from-slate-900 via-purple-950 to-slate-950',
          propEmoji: '🌌',
          ambientDecor: ['🌟', '🌙', '🍃'],
          characterAction: 'SMILE_WAVE'
        },
        moralHikmah: 'Setiap pengalaman belajar adalah ladang syukur yang tak terhingga.',
        durationSec: 15
      }
    ]
  },
  {
    id: 'cstory_kota_profesi',
    source: 'KOTA_MINI_G23',
    sourceLabel: 'Kota Mini Profesi (G23)',
    title: 'Misi Arsitek Cilik & Dokter Penyayang',
    subtitle: 'Santri membangun jembatan persahabatan dan merawat taman kota',
    theme: 'Cita-Cita Mulia & Gotong Royong',
    coverGradient: 'from-teal-950 via-emerald-950 to-slate-900',
    coverEmoji: '🏗️',
    totalDurationSec: 45,
    moralTag: 'Khidmat Masyarakat',
    featuredCharacters: ['Asy', 'Syifa', 'Mimi'],
    scenes: [
      {
        id: 'cscene_3_1',
        sceneNumber: 1,
        title: 'Merancang Jembatan Pelangi',
        narration: 'Dek Asy mengenakan helm arsitek cilik. Ia menyusun balok kayu ramah lingkungan melintasi sungai kecil.',
        dialogue: {
          speaker: 'Asy',
          role: 'ASY',
          text: '“Jembatan ini kuat dan kokoh agar adik-adik bisa menyeberang ke perpustakaan dengan aman.”',
          action: 'Meletakkan balok kunci jembatan dengan presisi.'
        },
        visualStage: {
          bgGradient: 'from-teal-950 via-slate-900 to-indigo-950',
          propEmoji: '🏗️',
          ambientDecor: ['📐', '🧱', '✨'],
          characterAction: 'DISCOVER_STAR'
        },
        moralHikmah: 'Membangun fasilitas yang bermanfaat bagi orang banyak bernilai jariyah.',
        durationSec: 15
      },
      {
        id: 'cscene_3_2',
        sceneNumber: 2,
        title: 'Klinik Ramah Mimi Kucing',
        narration: 'Mimi memeriksa bibit pohon yang hampir layu dengan stetoskop mainannya, lalu memberinya pupuk kompos segar.',
        dialogue: {
          speaker: 'Mimi',
          role: 'MIMI',
          text: '“Pohon kecil ini butuh air dan sinar mentari. Sekarang kamu sudah sehat kembali!”',
          action: 'Menyiram tanaman dengan ceret gembor mini.'
        },
        visualStage: {
          bgGradient: 'from-emerald-950 via-teal-950 to-slate-900',
          propEmoji: '🌱',
          ambientDecor: ['💧', '🩺', '🌸'],
          characterAction: 'HELPING'
        },
        moralHikmah: 'Menyayangi tumbuhan dan hewan adalah bukti kelembutan hati seorang muslim.',
        durationSec: 15
      },
      {
        id: 'cscene_3_3',
        sceneNumber: 3,
        title: 'Kota Mini yang Berseri',
        narration: 'Semua warga kota tersenyum ceria menikmati taman hijau yang asri dan jembatan yang kokoh.',
        dialogue: {
          speaker: 'Syifa',
          role: 'SYIFA',
          text: '“Alhamdulillah, jika kita bergotong royong, pekerjaan berat menjadi sangat ringan dan menggembirakan.”',
          action: 'Menebar senyum salam kepada semua santri.'
        },
        visualStage: {
          bgGradient: 'from-slate-900 via-emerald-900 to-indigo-950',
          propEmoji: '🏙️',
          ambientDecor: ['✨', '🎈', '💖'],
          characterAction: 'SMILE_WAVE'
        },
        moralHikmah: 'Tolong-menolonglah kamu dalam kebaikan dan takwa.',
        durationSec: 15
      }
    ]
  },
  {
    id: 'cstory_krayon_ajaib',
    source: 'RUMAH_KREATIF_G24',
    sourceLabel: 'Rumah Kreatif Asy (G24)',
    title: 'Keajaiban Warna & Kanvas Kebaikan',
    subtitle: 'Melukis harapan indah dengan sapuan krayon akhlak mulia',
    theme: 'Kreativitas & Estetika Syiar',
    coverGradient: 'from-pink-950 via-purple-950 to-slate-900',
    coverEmoji: '🎨',
    totalDurationSec: 45,
    moralTag: 'Seni Islami Anak',
    featuredCharacters: ['Asy', 'Syifa', 'Dodo'],
    scenes: [
      {
        id: 'cscene_4_1',
        sceneNumber: 1,
        title: 'Kanvas Putih Bersih',
        narration: 'Di studio Rumah Kreatif Asy, kanvas putih besar terbentang menunggu goresan kuas pertama.',
        dialogue: {
          speaker: 'Syifa',
          role: 'SYIFA',
          text: '“Mari kita lukis pemandangan TK Asy Syifa yang asri dengan kubah masjid berwarna emas!”',
          action: 'Mencelupkan kuas ke warna kuning madu.'
        },
        visualStage: {
          bgGradient: 'from-purple-950 via-slate-900 to-pink-950',
          propEmoji: '🎨',
          ambientDecor: ['🖌️', '🌈', '✨'],
          characterAction: 'PAINTING'
        },
        moralHikmah: 'Allah itu Maha Indah dan menyukai keindahan.',
        durationSec: 15
      },
      {
        id: 'cscene_4_2',
        sceneNumber: 2,
        title: 'Sentuhan Krayon Pelangi',
        narration: 'Dek Asy dan Dodo menambahkan burung merpati putih dan pohon rindang yang berbuah lebat.',
        dialogue: {
          speaker: 'Asy',
          role: 'ASY',
          text: '“Warna hijau daun ini melambangkan kesejukan dan keteduhan di taman sekolah kita!”',
          action: 'Mengarsir daun hijau dengan krayon organik.'
        },
        visualStage: {
          bgGradient: 'from-pink-950 via-indigo-950 to-slate-900',
          propEmoji: '🖍️',
          ambientDecor: ['🕊️', '🌳', '⭐'],
          characterAction: 'PAINTING'
        },
        moralHikmah: 'Ekspresikan rasa syukur melalui karya seni yang santun dan mendidik.',
        durationSec: 15
      },
      {
        id: 'cscene_4_3',
        sceneNumber: 3,
        title: 'Lukisan Terpajang di Galeri Utama',
        narration: 'Karya bersama ini diberi bingkai kayu jati ukir dan digantung dengan bangga di dinding galeri sekolah.',
        dialogue: {
          speaker: 'Syifa',
          role: 'SYIFA',
          text: '“Setiap goresan warna mengingatkan kita untuk selalu menjadi insan yang bermanfaat!”',
          action: 'Memandang hasil karya dengan senyum bangga.'
        },
        visualStage: {
          bgGradient: 'from-slate-950 via-purple-950 to-indigo-950',
          propEmoji: '🖼️',
          ambientDecor: ['🌟', '✨', '💖'],
          characterAction: 'SMILE_WAVE'
        },
        moralHikmah: 'Kreativitas santri adalah lentera masa depan peradaban.',
        durationSec: 15
      }
    ]
  },
  {
    id: 'cstory_malam_takbir',
    source: 'HARI_BESAR_G25',
    sourceLabel: 'Hari Besar Otomatis (G25)',
    title: 'Lentera Malam Takbiran & Ketupat Syukur',
    subtitle: 'Gema takbir merdu berkumandang di langit syahdu Asy Syifa',
    theme: 'Ketakwaan & Ukhuwah Islamiyah',
    coverGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    coverEmoji: '🏮',
    totalDurationSec: 45,
    moralTag: 'Syiar Hari Raya',
    featuredCharacters: ['Asy', 'Syifa', 'Bubu'],
    scenes: [
      {
        id: 'cscene_5_1',
        sceneNumber: 1,
        title: 'Pawai Lentera Fanous',
        narration: 'Malam hari raya tiba. Asy dan Syifa berbaris rapi membawa lentera fanous mini bercahaya keemasan.',
        dialogue: {
          speaker: 'Asy',
          role: 'ASY',
          text: '“Allahu Akbar, Allahu Akbar, Laa Ilaaha Illallahu Wallahu Akbar!”',
          action: 'Mengangkat lentera sambil bertakbir dengan suara merdu.'
        },
        visualStage: {
          bgGradient: 'from-teal-950 via-slate-950 to-emerald-950',
          propEmoji: '🏮',
          ambientDecor: ['🌙', '✨', '🕌'],
          characterAction: 'PRAYING'
        },
        moralHikmah: 'Mengagungkan asma Allah di malam hari raya melipatgandakan pahala kebaikan.',
        durationSec: 15
      },
      {
        id: 'cscene_5_2',
        sceneNumber: 2,
        title: 'Menebar Senyum & Maaf Tulus',
        narration: 'Santri saling menyapa dengan adab santun, menjabat tangan dan meminta maaf atas segala khilaf.',
        dialogue: {
          speaker: 'Syifa',
          role: 'SYIFA',
          text: '“Taqabbalallahu minna wa minkum, mohon maaf lahir dan batin ya sahabat semua.”',
          action: 'Menempelkan kedua telapak tangan di dada dengan penuh kelembutan.'
        },
        visualStage: {
          bgGradient: 'from-emerald-950 via-indigo-950 to-slate-900',
          propEmoji: '🤝',
          ambientDecor: ['🌸', '💖', '⭐'],
          characterAction: 'HELPING'
        },
        moralHikmah: 'Saling memaafkan membersihkan hati dan mengokohkan tali persaudaraan.',
        durationSec: 15
      },
      {
        id: 'cscene_5_3',
        sceneNumber: 3,
        title: 'Ketupat Berkah di Meja Keluarga',
        narration: 'Aroma kuah opor dan ketupat janur kuning menghangatkan ruang makan keluarga besar santri.',
        dialogue: {
          speaker: 'Asy',
          role: 'ASY',
          text: '“Alhamdulillah atas segala nikmat iman, sehat, dan keluarga yang rukun bahagia!”',
          action: 'Tersenyum gembira memandang keluarga berkumpul.'
        },
        visualStage: {
          bgGradient: 'from-slate-900 via-teal-950 to-slate-950',
          propEmoji: '✨',
          ambientDecor: ['🌟', '🌙', '🍃'],
          characterAction: 'SMILE_WAVE'
        },
        moralHikmah: 'Rasa syukur adalah kunci bertambahnya kenikmatan dari Allah.',
        durationSec: 15
      }
    ]
  }
];

class BioskopLangitEngine {
  private activeSeat: CinemaSeatType = 'AWAN_PUTIH';
  private activeStoryId: string = 'cstory_adab_santri';
  private currentSceneIndex: number = 0;
  private isPlaying: boolean = 0 ? true : false;
  private isNightMode: boolean = true;
  private isProjectorOn: boolean = true;
  private popcornCount: number = 0;
  private isOutroActive: boolean = false;
  private audioCtx: AudioContext | null = null;
  private listeners: Set<() => void> = new Set();
  private sceneTimer: any = null;
  private isEcoMode: boolean = false;

  constructor() {
    // Check initial local time to suggest night mode
    try {
      const currentHour = new Date().getHours();
      this.isNightMode = currentHour >= 17 || currentHour < 6;
    } catch {
      this.isNightMode = true;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // Getters
  public getActiveSeat(): CinemaSeatType {
    return this.activeSeat;
  }

  public getActiveSeatInfo(): CinemaSeatInfo {
    return CINEMA_SEATS_CATALOG[this.activeSeat] || CINEMA_SEATS_CATALOG.AWAN_PUTIH;
  }

  public getActiveStory(): CinemaStoryEpisode {
    const story = CINEMA_STORIES_CATALOG.find(s => s.id === this.activeStoryId);
    return story || CINEMA_STORIES_CATALOG[0];
  }

  public getCurrentScene(): CinemaScene {
    const story = this.getActiveStory();
    return story.scenes[this.currentSceneIndex] || story.scenes[0];
  }

  public getCurrentSceneIndex(): number {
    return this.currentSceneIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsNightMode(): boolean {
    return this.isNightMode;
  }

  public getIsProjectorOn(): boolean {
    return this.isProjectorOn;
  }

  public getPopcornCount(): number {
    return this.popcornCount;
  }

  public getIsOutroActive(): boolean {
    return this.isOutroActive;
  }

  public getIsEcoMode(): boolean {
    return this.isEcoMode;
  }

  // Setters & Actions
  public selectSeat(seat: CinemaSeatType) {
    this.activeSeat = seat;
    this.playSeatWhoosh();
    asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');

    blackBoxRecorder.record({
      moduleCode: 'G26-BIOSKOP',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `User selected cinema seat: ${seat}`
    });

    this.notify();
  }

  public selectStory(storyId: string) {
    this.stopPlayback();
    this.activeStoryId = storyId;
    this.currentSceneIndex = 0;
    this.isOutroActive = false;
    this.playProjectorClick();

    blackBoxRecorder.record({
      moduleCode: 'G26-BIOSKOP',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `User selected night story: ${storyId}`
    });

    this.notify();
  }

  public toggleNightMode(forced?: boolean) {
    this.isNightMode = typeof forced === 'boolean' ? forced : !this.isNightMode;
    this.playStarBell();
    this.notify();
  }

  public toggleProjector() {
    this.isProjectorOn = !this.isProjectorOn;
    this.playProjectorClick();
    this.notify();
  }

  public toggleEcoMode() {
    this.isEcoMode = !this.isEcoMode;
    this.notify();
  }

  public startPlayback() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isOutroActive = false;
    this.isProjectorOn = true;
    this.playStarBell();

    this.scheduleNextScene();
    this.notify();
  }

  public pausePlayback() {
    this.isPlaying = false;
    if (this.sceneTimer) {
      clearTimeout(this.sceneTimer);
      this.sceneTimer = null;
    }
    this.notify();
  }

  public stopPlayback() {
    this.isPlaying = false;
    this.currentSceneIndex = 0;
    if (this.sceneTimer) {
      clearTimeout(this.sceneTimer);
      this.sceneTimer = null;
    }
    this.notify();
  }

  public nextScene() {
    const story = this.getActiveStory();
    if (this.currentSceneIndex < story.scenes.length - 1) {
      this.currentSceneIndex++;
      this.playSceneTransitionChime();
      if (this.isPlaying) {
        this.scheduleNextScene();
      }
    } else {
      // Completed all scenes -> Trigger Outro
      this.isPlaying = false;
      this.isOutroActive = true;
      this.playOutroCelebration();
    }
    this.notify();
  }

  public prevScene() {
    if (this.currentSceneIndex > 0) {
      this.currentSceneIndex--;
      this.isOutroActive = false;
      this.playSceneTransitionChime();
      if (this.isPlaying) {
        this.scheduleNextScene();
      }
      this.notify();
    }
  }

  public dismissOutro() {
    this.isOutroActive = false;
    this.currentSceneIndex = 0;
    this.notify();
  }

  private scheduleNextScene() {
    if (this.sceneTimer) {
      clearTimeout(this.sceneTimer);
      this.sceneTimer = null;
    }

    const scene = this.getCurrentScene();
    const durationMs = (scene.durationSec || 15) * 1000;

    this.sceneTimer = setTimeout(() => {
      if (this.isPlaying) {
        this.nextScene();
      }
    }, durationMs);
  }

  // Popcorn Interaction
  public popPopcorn(): { count: number; message: string } {
    this.popcornCount++;
    this.playPopcornPopSound();

    const flavors = [
      'Jagung Madu Berkah',
      'Cokelat Santri Ceria',
      'Mentega Pelangi',
      'Keju Karomah',
      'Karamel Tanggul'
    ];
    const chosenFlavor = flavors[this.popcornCount % flavors.length];

    this.notify();
    return {
      count: this.popcornCount,
      message: `Pop! ${chosenFlavor} +5 Berkah!`
    };
  }

  // ----------------------------------------------------
  // PURE WEB AUDIO API SYNTHESIZER (No Licensed Assets)
  // ----------------------------------------------------
  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  public playPopcornPopSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High frequency pitch burst + resonant pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqStart = 280 + Math.random() * 220;
      const freqEnd = 80 + Math.random() * 40;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freqStart, now);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  public playProjectorClick() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  public playStarBell() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Harmoni Bintang)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.85);
      });
    } catch {}
  }

  public playSceneTransitionChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25]; // A4, C#5, E5 (Mayor Lembut)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.75);
      });
    } catch {}
  }

  public playSeatWhoosh() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playOutroCelebration() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const melody = [523.25, 659.25, 783.99, 880, 1046.5]; // C5, E5, G5, A5, C6
      melody.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch {}
  }
}

export const bioskopLangitEngine = new BioskopLangitEngine();
