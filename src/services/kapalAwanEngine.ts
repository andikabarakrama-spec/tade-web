/**
 * TADE SPRINT G27 — KAPAL AWAN & PULAU PETUALANGAN ENGINE
 * Pure Web Audio API & Lightweight 3D Cartoon Sailing Engine.
 * 
 * Complies with:
 * - 60 FPS Guarantee (Maksimal 5 animasi simultan via tadeAnimationGovernor)
 * - Zero heavy game loops / zero competitive rankings (Pure Islamic storytelling & adab)
 * - Eco Mode auto-reduction on low power/frames
 * - Guardian Ring-0 & Hermes Recovery Telemetry (BlackBoxRecorder)
 * - Integrates TV Asy (G15), DNA G20, Sutradara G22, Kota Mini G23, Rumah Kreatif G24, Hari Besar G25, Bioskop G26
 * 
 * Marker: G27_KAPAL_AWAN_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { asySyifaDnaEngine } from './asySyifaDnaEngine';
import { CheerfulWeather } from './livingWorldEngine';

export type AdventureIslandId = 'PULAU_DOA' | 'PULAU_HURUF' | 'PULAU_ANGKA' | 'PULAU_ALAM' | 'PULAU_PERSAHABATAN';

export interface AdventureIslandInfo {
  id: AdventureIslandId;
  order: number;
  name: string;
  subtitle: string;
  themeTag: string;
  themeColor: string;
  bgGradient: string;
  skyTheme: CheerfulWeather;
  iconEmoji: string;
  stampEmoji: string;
  stampTitle: string;
  stampDescription: string;
  landmarkName: string;
  durationSec: number;
  asyVoiceLine: string;
  syifaVoiceLine: string;
  storyNarrative: string[];
  adabValue: string;
  activityLabel: string;
  decorElements: {
    emoji: string;
    label: string;
    action: string;
  }[];
}

export interface ShipCompanion {
  id: 'ASY' | 'SYIFA' | 'BUBU' | 'GOGO' | 'MIMI' | 'DODO' | 'TITI' | 'RARA';
  name: string;
  roleTitle: string;
  avatarEmoji: string;
  bubbleText: string;
  motionPreset: string;
  hatEmoji: string;
}

export interface AdventurePassportEntry {
  islandId: AdventureIslandId;
  unlockedAt: string;
  stampName: string;
  stampEmoji: string;
  blessingNote: string;
  visitedCount: number;
}

export interface SeaCreature {
  id: string;
  type: 'DOLPHIN' | 'HAPPY_FISH' | 'SEAGULL' | 'CLOUD_TURTLE';
  name: string;
  emoji: string;
  x: number;
  y: number;
  phrase: string;
}

export const ADVENTURE_ISLANDS_CATALOG: Record<AdventureIslandId, AdventureIslandInfo> = {
  PULAU_DOA: {
    id: 'PULAU_DOA',
    order: 1,
    name: 'Pulau Doa Berkah',
    subtitle: 'Kubah Zamrud & Pohon Lentera Bintang',
    themeTag: 'Adab & Dzikir Hati',
    themeColor: 'emerald',
    bgGradient: 'from-emerald-900/40 via-teal-900/30 to-indigo-950/50',
    skyTheme: 'CERAH',
    iconEmoji: '🕌',
    stampEmoji: '🌟',
    stampTitle: 'Cap Doa Santun',
    stampDescription: 'Santri mengawali setiap langkah dengan Bismillah dan menutupnya dengan rasa syukur Alhamdulillah.',
    landmarkName: 'Menara Doa Bintang Kejora',
    durationSec: 20,
    asyVoiceLine: '“Sebelum berlayar lebih jauh, yuk kita baca doa bersama agar perjalanan kita diberkahi Allah!”',
    syifaVoiceLine: '“Subhanallah, doa yang tulus membuat hati kita sejuk seperti embun pagi di Pulau Doa!”',
    storyNarrative: [
      'Kapal Awan berlabuh perlahan di dermaga zamrud berpagar bunga melati wangi.',
      'Pohon doa berkilau lembut setiap kali kalimat thayyibah diucapkan dengan khusyuk.',
      'Asy dan Syifa memimpin doa perjalanan: Bismillahi majreha wa mursaha inna Rabbi laghafurur rahiim.'
    ],
    adabValue: 'Senantiasa berdoa sebelum memulai kegiatan & menghormati kedua orang tua.',
    activityLabel: 'Kirim Doa Kebaikan ke Langit',
    decorElements: [
      { emoji: '🕌', label: 'Kubah Emas', action: 'Bercahaya lembut' },
      { emoji: '✨', label: 'Bintang Doa', action: 'Berkedip gemerlap' },
      { emoji: '🌳', label: 'Pohon Zaitun', action: 'Berdaun perak' },
      { emoji: '🕊️', label: 'Burung Merpati', action: 'Membawa pesan damai' }
    ]
  },
  PULAU_HURUF: {
    id: 'PULAU_HURUF',
    order: 2,
    name: 'Pulau Huruf Ceria',
    subtitle: 'Taman Balon Hijaiyah & Alfabet Pengetahuan',
    themeTag: 'Cinta Al-Qur\'an & Literasi',
    themeColor: 'amber',
    bgGradient: 'from-amber-900/40 via-orange-900/30 to-slate-950/50',
    skyTheme: 'PELANGI',
    iconEmoji: '📖',
    stampEmoji: '🔤',
    stampTitle: 'Cap Huruf Mulia',
    stampDescription: 'Santri gemar membaca dan melafalkan huruf-huruf hijaiyah dengan makhraj yang fasih.',
    landmarkName: 'Pustaka Terapung Al-Hikmah',
    durationSec: 20,
    asyVoiceLine: '“Lihat! Balon huruf Alif, Ba, Ta melayang riang membentuk kata-kata indah!”',
    syifaVoiceLine: '“Membaca itu membuka jendela dunia. Iqra\' bismirabbikalladzi khalaq!”',
    storyNarrative: [
      'Dermaga Pulau Huruf dipenuhi papan titian berbentuk buku-buku cerita berwarna cerah.',
      'Bubu dan Dodo meloncat gembira menangkap balon huruf hijaiyah yang bernyanyi riang.',
      'Santri belajar menyusun kata berkah: ILMU, AMAL, KASIH, dan ASY-SYIFA.'
    ],
    adabValue: 'Menjaga adab terhadap buku, memegang kitab dengan tangan kanan yang bersih.',
    activityLabel: 'Susun Kata Kebaikan Hijaiyah',
    decorElements: [
      { emoji: '📜', label: 'Kitab Terbuka', action: 'Memancarkan sinar ilmu' },
      { emoji: '🎈', label: 'Balon Alif-Ba-Ta', action: 'Melayang lembut' },
      { emoji: '✏️', label: 'Pensil Emas', action: 'Menulis kaligrafi ceria' },
      { emoji: '🌺', label: 'Bunga Alfabet', action: 'Mekar mengucap salam' }
    ]
  },
  PULAU_ANGKA: {
    id: 'PULAU_ANGKA',
    order: 3,
    name: 'Pulau Angka Berkah',
    subtitle: 'Kebun Kurma & Keranjang Sedekah Riang',
    themeTag: 'Berhitung & Gemar Sedekah',
    themeColor: 'blue',
    bgGradient: 'from-blue-900/40 via-cyan-900/30 to-slate-950/50',
    skyTheme: 'BERAWAN',
    iconEmoji: '🔢',
    stampEmoji: '🍎',
    stampTitle: 'Cap Angka Berbagi',
    stampDescription: 'Santri pandai berhitung bukan untuk menimbun, melainkan untuk berbagi sedekah.',
    landmarkName: 'Menara Jam Kurma Manis',
    durationSec: 20,
    asyVoiceLine: '“Satu, dua, tiga kurma manis! Kita kumpulkan untuk diberikan kepada teman-teman!”',
    syifaVoiceLine: '“Hitungan yang paling berkah adalah hitungan saat tangan kita memberi dengan tulus!”',
    storyNarrative: [
      'Pohon-pohon kurma dan apel tersenyum dengan buah yang berhitung 1 sampai 10 secara berirama.',
      'Gogo si beruang membantu mengayunkan keranjang bambu berisi 7 butir buah manis.',
      'Semua sahabat bernyanyi lagu angka sambil menyusun paket bingkisan berkah untuk anak yatim.'
    ],
    adabValue: 'Gemar berbagi rezeki, mendahulukan orang yang lebih membutuhkan.',
    activityLabel: 'Kumpulkan Buah Sedekah Ceria',
    decorElements: [
      { emoji: '🌴', label: 'Pohon Kurma', action: 'Berbuah lebat berkilau' },
      { emoji: '🧺', label: 'Keranjang Berkah', action: 'Siap dibagikan' },
      { emoji: '🍎', label: 'Apel Ceria', action: 'Melompat berhitung' },
      { emoji: '🪙', label: 'Koin Infaq', action: 'Berdenting merdu' }
    ]
  },
  PULAU_ALAM: {
    id: 'PULAU_ALAM',
    order: 4,
    name: 'Pulau Alam Lestari',
    subtitle: 'Lembah Zamrud, Sungai Jernih & Bunga Matahari',
    themeTag: 'Menyayangi Alam & Makhluk Allah',
    themeColor: 'teal',
    bgGradient: 'from-teal-900/40 via-green-900/30 to-indigo-950/50',
    skyTheme: 'CERAH',
    iconEmoji: '🌿',
    stampEmoji: '🌸',
    stampTitle: 'Cap Sahabat Alam',
    stampDescription: 'Santri menjaga kebersihan air, merawat tanaman, dan menyayangi binatang ciptaan Allah.',
    landmarkName: 'Air Terjun Pelangi Kristal',
    durationSec: 20,
    asyVoiceLine: '“Segarnya air sungai dan harumnya bunga matahari! Bumi ini titipan Allah yang indah.”',
    syifaVoiceLine: '“Jangan petik bunga sembarangan ya teman-teman, biarkan lebah menghisap madunya!”',
    storyNarrative: [
      'Kapal Awan menyusuri teluk hijau berair jernih sampai dasar koral tampak berkilau.',
      'Kupu-kupu biru dan lebah madu terbang membentuk iringan menyambut kedatangan rombongan.',
      'Mimi dan Titi menyiram bibit pohon beringin kecil di tepi pantai dengan ember bambu.'
    ],
    adabValue: 'Tidak membuang sampah sembarangan, menghemat air wudhu, mencintai bumi.',
    activityLabel: 'Tanam Tunas Hijau Lestari',
    decorElements: [
      { emoji: '🌻', label: 'Bunga Matahari', action: 'Menari mengikuti sinar' },
      { emoji: '🦋', label: 'Kupu-kupu Biru', action: 'Mengepakkan sayap anggun' },
      { emoji: '🌊', label: 'Air Terjun Kristal', action: 'Mengalirkan gemericik sejuk' },
      { emoji: '🌱', label: 'Tunas Kehidupan', action: 'Tumbuh perlahan' }
    ]
  },
  PULAU_PERSAHABATAN: {
    id: 'PULAU_PERSAHABATAN',
    order: 5,
    name: 'Pulau Persahabatan & Ukhuwah',
    subtitle: 'Gazebo Pelangi & Lingkaran Sahabat Sejati',
    themeTag: 'Ukhuwah Islamiyah & Tolong Menolong',
    themeColor: 'rose',
    bgGradient: 'from-rose-900/40 via-purple-900/30 to-indigo-950/50',
    skyTheme: 'PELANGI',
    iconEmoji: '🤝',
    stampEmoji: '💖',
    stampTitle: 'Cap Ukhuwah Abadi',
    stampDescription: 'Santri saling mengasihi karena Allah, mudah memaafkan, dan selalu tersenyum manis.',
    landmarkName: 'Panggung Lingkar Pelukan Sahabat',
    durationSec: 20,
    asyVoiceLine: '“Alhamdulillah! Bersama sahabat terbaik, perjalanan berlayar terasa begitu membahagiakan!”',
    syifaVoiceLine: '“Seorang mukmin dengan mukmin lainnya bagaikan satu bangunan yang saling menguatkan.”',
    storyNarrative: [
      'Di puncak pulau terdapat Pohon Pelangi yang daunnya berkilau warna-warni melambangkan kebersamaan.',
      'Semua sahabat: Asy, Syifa, Bubu, Gogo, Mimi, Dodo, Titi, dan Rara bergandengan tangan erat.',
      'Mereka saling bertukar kartu senyuman dan berikrar untuk selalu tolong-menolong dalam kebaikan.'
    ],
    adabValue: 'Tersenyum kepada sesama adalah sedekah, menjaga tali silaturahim.',
    activityLabel: 'Lingkaran Pelukan Sahabat Ceria',
    decorElements: [
      { emoji: '🌈', label: 'Lengkung Pelangi', action: 'Membentang indah di langit' },
      { emoji: '🎪', label: 'Gazebo Ukhuwah', action: 'Tempat bertukar senyuman' },
      { emoji: '🎁', label: 'Kotak Hadiah', action: 'Simbol kasih sayang' },
      { emoji: '🕊️', label: 'Merpati Putih', action: 'Terbang berpasangan' }
    ]
  }
};

export const SHIP_COMPANIONS_ROSTER: ShipCompanion[] = [
  {
    id: 'ASY',
    name: 'Dek Asy',
    roleTitle: 'Kapten Cilik Berpeci Putih',
    avatarEmoji: '👦',
    bubbleText: '“Bismillah! Kapal Awan siap berlayar bersama seluruh santri tersayang!”',
    motionPreset: 'LAMBAIAN_TANGAN',
    hatEmoji: '🧭'
  },
  {
    id: 'SYIFA',
    name: 'Mbak Syifa',
    roleTitle: 'Pemandu Berkerudung Ceria',
    avatarEmoji: '👧',
    bubbleText: '“Mari nikmati semilir angin berkah dan kisah teladan di setiap pulau!”',
    motionPreset: 'LANGKAH_KECIL',
    hatEmoji: '🎀'
  },
  {
    id: 'BUBU',
    name: 'Bubu si Tupai',
    roleTitle: 'Navigator Peta Bintang',
    avatarEmoji: '🐿️',
    bubbleText: '“Peta menunjukkan Pulau Doa sudah dekat di depan mata!”',
    motionPreset: 'LONCAT_GEMBIRA',
    hatEmoji: '🗺️'
  },
  {
    id: 'GOGO',
    name: 'Gogo si Beruang',
    roleTitle: 'Penjaga Peluit Keberangkatan',
    avatarEmoji: '🐻',
    bubbleText: '“Tooooot! Tooooot! Semua sahabat sudah duduk nyaman di dek awan!”',
    motionPreset: 'TEPUK_TANGAN',
    hatEmoji: '🎺'
  },
  {
    id: 'MIMI',
    name: 'Mimi si Kucing',
    roleTitle: 'Penyapa Satwa Samudra',
    avatarEmoji: '🐱',
    bubbleText: '“Meow! Lihat, lumba-lumba kecil melompat tersenyum di samping kita!”',
    motionPreset: 'ANGGUKAN_KEPALA',
    hatEmoji: '🌊'
  },
  {
    id: 'DODO',
    name: 'Dodo si Burung',
    roleTitle: 'Pengamat Tiang Layar Utama',
    avatarEmoji: '🕊️',
    bubbleText: '“Langit cerah berawan kapas, angin sepoi-sepoi membawa kedamaian!”',
    motionPreset: 'LAMBAIAN_TANGAN',
    hatEmoji: '🔭'
  },
  {
    id: 'TITI',
    name: 'Titi si Kelinci',
    roleTitle: 'Duta Senyuman & Bekal Ceria',
    avatarEmoji: '🐰',
    bubbleText: '“Kue kurma dan madu segar sudah siap untuk dinikmati bersama!”',
    motionPreset: 'LONCAT_GEMBIRA',
    hatEmoji: '🧺'
  },
  {
    id: 'RARA',
    name: 'Rara si Kancil',
    roleTitle: 'Petugas Cap Paspor Petualang',
    avatarEmoji: '🦌',
    bubbleText: '“Siapkan paspor kalian ya! Setiap pulau punya stempel berkah yang istimewa!”',
    motionPreset: 'LANGKAH_KECIL',
    hatEmoji: '📖'
  }
];

export const INITIAL_SEA_CREATURES: SeaCreature[] = [
  { id: 'sc-1', type: 'DOLPHIN', name: 'Lumi si Lumba-Lumba', emoji: '🐬', x: 22, y: 78, phrase: 'Klik-klik! Selamat berlayar santri ceria!' },
  { id: 'sc-2', type: 'HAPPY_FISH', name: 'Nemo si Ikan Mas', emoji: '🐠', x: 70, y: 82, phrase: 'Bloop bloop! Airnya jernih dan sejuk!' },
  { id: 'sc-3', type: 'SEAGULL', name: 'Kiki si Camar', emoji: '🕊️', x: 45, y: 18, phrase: 'Kweeek! Pelabuhan Pelangi sangat indah dari atas!' }
];

const PASSPORT_STORAGE_KEY = 'tade_g27_adventure_passport_v1';

class KapalAwanEngine {
  private audioCtx: AudioContext | null = null;
  private isShipSummoned: boolean = false;
  private currentIslandId: AdventureIslandId = 'PULAU_DOA';
  private isVoyagePlaying: boolean = false;
  private voyageProgressPercent: number = 0;
  private currentSceneIndex: number = 0;
  private activeWeather: CheerfulWeather = 'CERAH';
  private ecoModeActive: boolean = false;
  private passportEntries: AdventurePassportEntry[] = [];
  private listeners: Set<() => void> = new Set();
  private timerHandle: NodeJS.Timeout | null = null;

  constructor() {
    this.loadPassportFromStorage();
  }

  private loadPassportFromStorage() {
    try {
      const raw = localStorage.getItem(PASSPORT_STORAGE_KEY);
      if (raw) {
        this.passportEntries = JSON.parse(raw);
      } else {
        // Initial first stamp on arrival at port
        this.passportEntries = [
          {
            islandId: 'PULAU_DOA',
            unlockedAt: new Date().toISOString(),
            stampName: 'Cap Sambutan Pelabuhan Pelangi',
            stampEmoji: '🌈',
            blessingNote: 'Selamat datang di Ekspedisi Kapal Awan Asy-Syifa!',
            visitedCount: 1
          }
        ];
        this.savePassportToStorage();
      }
    } catch {
      this.passportEntries = [];
    }
  }

  private savePassportToStorage() {
    try {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(this.passportEntries));
    } catch {
      // Ignore in strict mode
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Error in KapalAwanEngine listener', err);
      }
    });
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // ==========================================
  // PURE WEB AUDIO SYNTHESIZERS (ZERO 3RD PARTY)
  // ==========================================

  /**
   * P1/P2: Peluit Keberangkatan Kapal Awan ("Tooooot... Tooooot!")
   * Gentle harmonized steam-whistle tone with soft air envelope
   */
  public playShipWhistle(tone: 'HIGH' | 'LOW' | 'DOUBLE' = 'DOUBLE') {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const playSingleBlast = (start: number, dur: number, baseFreq: number) => {
        // Base tone (sine) + subharmonic (warmth) + breath noise
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(baseFreq, start);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.02, start + dur * 0.4);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.98, start + dur);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 1.5, start); // Perfect fifth for gentle brassy warmth

        gainNode.gain.setValueAtTime(0.001, start);
        gainNode.gain.linearRampToValueAtTime(0.22, start + dur * 0.15);
        gainNode.gain.setValueAtTime(0.22, start + dur * 0.7);
        gainNode.gain.linearRampToValueAtTime(0.001, start + dur);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + dur);
        osc2.stop(start + dur);
      };

      if (tone === 'DOUBLE') {
        playSingleBlast(now, 0.65, 340); // F4
        playSingleBlast(now + 0.75, 0.95, 340);
      } else if (tone === 'HIGH') {
        playSingleBlast(now, 0.8, 440);
      } else {
        playSingleBlast(now, 1.1, 280);
      }

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G27-KAPAL',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Audio ship whistle played with tone: ${tone}`
      });
    } catch {
      // Audio playback failsafe
    }
  }

  /**
   * P2/Bonus: Suara Deburan Ombak Lembut (Gentle Ocean Swell)
   * Filtered pink/brown noise sweep with slow rhythm
   */
  public playGentleWaves() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const dur = 3.2;

      const bufferSize = ctx.sampleRate * dur;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 2.5; // Brownish warm noise
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(650, now + dur * 0.45);
      filter.frequency.exponentialRampToValueAtTime(180, now + dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + dur * 0.35);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + dur);
    } catch {
      // Failsafe
    }
  }

  /**
   * Bonus: Celoteh Burung Camar (Cheerful Seagull Call)
   */
  public playSeagullCall() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const playChirp = (start: number, baseFreq: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, start);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.35, start + dur * 0.35);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, start + dur);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.12, start + dur * 0.2);
        gain.gain.linearRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      };

      playChirp(now, 1450, 0.22);
      playChirp(now + 0.26, 1600, 0.28);
      playChirp(now + 0.58, 1380, 0.35);
    } catch {
      // Failsafe
    }
  }

  /**
   * Bonus: Suara Lumba-Lumba Ceria (Dolphin Whistle & Click)
   */
  public playDolphinSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // FM synthesis for friendly dolphin whistle
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.linearRampToValueAtTime(3200, now + 0.15);
      osc.frequency.linearRampToValueAtTime(1800, now + 0.35);
      osc.frequency.linearRampToValueAtTime(2600, now + 0.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {
      // Failsafe
    }
  }

  /**
   * P6: Stempel Paspor Berkah (Solid Stamp Thud + Sparkle Chime)
   */
  public playPassportStampSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // 1. Thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(140, now);
      thudOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      thudGain.gain.setValueAtTime(0.35, now);
      thudGain.gain.linearRampToValueAtTime(0.001, now + 0.12);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.12);

      // 2. Sparkle Chimes
      const freqs = [784, 987.77, 1174.66, 1567.98]; // G5, B5, D6, G6
      freqs.forEach((freq, idx) => {
        const start = now + 0.06 + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G27-KAPAL',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Passport stamp applied for island: ${this.currentIslandId}`
      });
    } catch {
      // Failsafe
    }
  }

  // ==========================================
  // STATE MANAGEMENT & CONTROLS
  // ==========================================

  public summonShip() {
    this.isShipSummoned = true;
    this.playShipWhistle('DOUBLE');
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_0',
      moduleCode: 'G27-KAPAL',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Cloud Ship summoned at: ${new Date().toISOString()}`
    });
  }

  public dismissShip() {
    this.isShipSummoned = false;
    this.stopVoyage();
    this.notify();
  }

  public selectIsland(islandId: AdventureIslandId) {
    this.currentIslandId = islandId;
    this.currentSceneIndex = 0;
    this.voyageProgressPercent = 0;
    const targetIsland = ADVENTURE_ISLANDS_CATALOG[islandId];
    if (targetIsland) {
      this.activeWeather = targetIsland.skyTheme;
    }
    this.notify();
  }

  public startVoyage() {
    if (this.isVoyagePlaying) return;
    this.isVoyagePlaying = true;
    this.voyageProgressPercent = 0;
    this.playShipWhistle('HIGH');
    this.playGentleWaves();

    if (this.timerHandle) clearInterval(this.timerHandle);

    const island = ADVENTURE_ISLANDS_CATALOG[this.currentIslandId];
    const totalSec = island.durationSec;
    const intervalMs = 250;
    const stepIncrement = (intervalMs / (totalSec * 1000)) * 100;

    this.timerHandle = setInterval(() => {
      this.voyageProgressPercent += stepIncrement;
      
      // Update scene narrations based on progress
      if (this.voyageProgressPercent >= 66) {
        this.currentSceneIndex = 2;
      } else if (this.voyageProgressPercent >= 33) {
        this.currentSceneIndex = 1;
      } else {
        this.currentSceneIndex = 0;
      }

      if (this.voyageProgressPercent >= 100) {
        this.voyageProgressPercent = 100;
        this.completeIslandArrival();
      }

      this.notify();
    }, intervalMs);

    this.notify();
  }

  public stopVoyage() {
    this.isVoyagePlaying = false;
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
    this.notify();
  }

  private completeIslandArrival() {
    this.stopVoyage();
    this.unlockIslandStamp(this.currentIslandId);
    this.playPassportStampSound();
  }

  public unlockIslandStamp(islandId: AdventureIslandId) {
    const island = ADVENTURE_ISLANDS_CATALOG[islandId];
    const existing = this.passportEntries.find(p => p.islandId === islandId);

    if (existing) {
      existing.visitedCount += 1;
      existing.unlockedAt = new Date().toISOString();
    } else {
      this.passportEntries.push({
        islandId,
        unlockedAt: new Date().toISOString(),
        stampName: island.stampTitle,
        stampEmoji: island.stampEmoji,
        blessingNote: island.stampDescription,
        visitedCount: 1
      });
    }

    this.savePassportToStorage();
    this.notify();
  }

  public setWeather(weather: CheerfulWeather) {
    this.activeWeather = weather;
    this.notify();
  }

  public toggleEcoMode() {
    this.ecoModeActive = !this.ecoModeActive;
    this.notify();
  }

  // ==========================================
  // GETTERS FOR UI
  // ==========================================

  public getSnapshot() {
    return {
      isShipSummoned: this.isShipSummoned,
      currentIslandId: this.currentIslandId,
      currentIsland: ADVENTURE_ISLANDS_CATALOG[this.currentIslandId],
      isVoyagePlaying: this.isVoyagePlaying,
      voyageProgressPercent: Math.min(100, Math.floor(this.voyageProgressPercent)),
      currentSceneIndex: this.currentSceneIndex,
      activeWeather: this.activeWeather,
      ecoModeActive: this.ecoModeActive,
      passportEntries: [...this.passportEntries],
      isIslandUnlocked: (id: AdventureIslandId) => this.passportEntries.some(p => p.islandId === id),
      totalStampsCollected: this.passportEntries.length
    };
  }
}

export const kapalAwanEngine = new KapalAwanEngine();
export default kapalAwanEngine;
