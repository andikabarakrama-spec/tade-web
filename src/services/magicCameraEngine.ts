/**
 * MAGIC CAMERA ENGINE — SPRINT G21 (STUDIO KAMERA AJAIB ASY & SYIFA)
 * 
 * Penanda: G21_STUDIO_KAMERA_VERIFIED
 * 
 * Provides:
 * - P1: Camera motions (Mendekat, Menjauh, Geser Pelan, Naik-Turun, Fokus Karakter)
 * - P2: Scene entrance transitions (Daun Membuka, Awan Bergeser, Tirai Terbuka, Pelangi Muncul)
 * - P3: Scene exit effects (Bintang Kecil, Confetti Lembut, Lambaian Asy-Syifa)
 * - P4: Character speaker spotlight & speech bubble dynamic tracking
 * - P5: Automated Story Photo Memory (Buku Cerita & Kotak Kenangan)
 * - P6: Festival Cinematic Openers (Festival, Wisuda, Milad, Ramadhan)
 * - P7: Centralized Single Source of Truth for Camera Styles
 * 
 * 60 FPS GPU-accelerated, lightweight (max 5 active animations via tadeAnimationGovernor),
 * and audited via BlackBoxRecorder.
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';
import { tadeSoundEngine } from './tadeSoundEngine';
import { asySyifaDnaEngine, DnaSignatureSound } from './asySyifaDnaEngine';

export type CameraMotion = 
  | 'DIAM'
  | 'MENDEKAT'     // Slow push / Zoom In (1.05x)
  | 'MENJAUH'      // Pull back / Zoom Out (0.97x)
  | 'GESER_PELAN'  // Slow horizontal pan left-right (±3%)
  | 'NAIK_TURUN'   // Gentle vertical tilt/bob (±2%)
  | 'FOKUS_ASY'    // Pan & zoom toward Asy
  | 'FOKUS_SYIFA'  // Pan & zoom toward Syifa
  | 'FOKUS_TENGAH';// Center spotlight zoom

export type SceneEntrance = 
  | 'DAUN_MEMBUKA'   // Leaves sweeping outward
  | 'AWAN_BERGESER'  // Fluffy clouds parting left & right
  | 'TIRAI_TERBUKA'  // Theater curtains sliding open
  | 'PELANGI_MUNCUL' // Rainbow arc expanding from center
  | 'FADE_LEMBUT';   // Soft clean fade

export type SceneExit = 
  | 'BINTANG_KECIL'       // Twinkling stars sparkle
  | 'CONFETTI_LEMBUT'     // Gentle falling pastel confetti
  | 'LAMBAIAN_ASY_SYIFA'  // Asy & Syifa waving farewell
  | 'LINGKARAN_FADE';     // Iris circle close

export type FestivalCinematicType = 
  | 'FESTIVAL_CERIA' // Carnival tents, balloons, flags
  | 'WISUDA_AKBAR'   // Toga caps, golden sparkles, certificate
  | 'MILAD_YAYASAN'  // Cake, celebratory lanterns, mild fireworks
  | 'RAMADHAN_BERKAH';// Crescent moon, bedug, green ketupat & lanterns

export interface StoryPhotoMemory {
  id: string;
  title: string;
  subtitle: string;
  dateStr: string;
  timestamp: number;
  sourceModule: 'TV_ASY' | 'EPISODE_INTERAKTIF' | 'RUMAH_ASY' | 'KAMPUNG_CERIA' | 'FESTIVAL' | 'CREATIVE_STUDIO';
  characterRole: 'ASY' | 'SYIFA' | 'DUO' | 'KAMPUNG_FRIENDS';
  moralLesson: string;
  duaPhrase: string;
  badgeEmoji: string;
  snapshotSvgToken: string;
  cameraMotionUsed: CameraMotion;
  entranceUsed: SceneEntrance;
  exitUsed: SceneExit;
  goldenStamp: boolean;
}

export interface CameraConfig {
  defaultMotion: CameraMotion;
  defaultEntrance: SceneEntrance;
  defaultExit: SceneExit;
  autoCapturePhoto: boolean;
  spotlightEnabled: boolean;
  speechBubbleAnimation: boolean;
  cinematicSpeed: 'LEMBUT' | 'STANDAR' | 'RINGKAS';
  performanceMode: boolean; // Low-power / lightweight fallback
}

const STORAGE_KEY_CONFIG = 'tade_studio_kamera_config_v1';
const STORAGE_KEY_PHOTOS = 'tade_studio_kamera_photos_v1';

export const CAMERA_MOTION_PRESETS: Array<{
  id: CameraMotion;
  name: string;
  subtitle: string;
  description: string;
  cssTransform: string;
  icon: string;
}> = [
  {
    id: 'DIAM',
    name: 'Diam Tenang (Static)',
    subtitle: 'Sudut Pandang Netral',
    description: 'Kamera stabil tanpa pergeseran. Sangat nyaman untuk membaca teks panjang.',
    cssTransform: 'scale(1) translate3d(0, 0, 0)',
    icon: '⏹️'
  },
  {
    id: 'MENDEKAT',
    name: 'Mendekat Lembut (Slow Push)',
    subtitle: 'Zoom In 1.06x',
    description: 'Kamera perlahan mendekat ke pusat adegan memberikan kesan intim layaknya serial kartun TV.',
    cssTransform: 'scale(1.06) translate3d(0, -1%, 0)',
    icon: '🔍'
  },
  {
    id: 'MENJAUH',
    name: 'Menjauh Anggun (Pull Back)',
    subtitle: 'Zoom Out 0.98x',
    description: 'Kamera perlahan melebar membuka pemandangan latar belakang yang asri dan ceria.',
    cssTransform: 'scale(0.98) translate3d(0, 1%, 0)',
    icon: '🔭'
  },
  {
    id: 'GESER_PELAN',
    name: 'Geser Pelan (Slow Pan)',
    subtitle: 'Pan Kiri ke Kanan ±3%',
    description: 'Kamera bergerak perlahan ke samping, menciptakan kedalaman panorama yang hidup tanpa pusing.',
    cssTransform: 'scale(1.03) translate3d(-2.5%, 0, 0)',
    icon: '↔️'
  },
  {
    id: 'NAIK_TURUN',
    name: 'Naik Turun Lembut (Gentle Tilt)',
    subtitle: 'Tilt Vertikal Lembut ±2%',
    description: 'Kamera berayun naik turun pelan mengikuti ritme percakapan yang ramah.',
    cssTransform: 'scale(1.02) translate3d(0, -2%, 0)',
    icon: '↕️'
  },
  {
    id: 'FOKUS_ASY',
    name: 'Fokus Dek Asy (Speaker Zoom)',
    subtitle: 'Sorot Karakter Asy',
    description: 'Kamera bergeser ke sisi Dek Asy saat ia sedang berbicara atau menjelaskan sesuatu.',
    cssTransform: 'scale(1.07) translate3d(-3%, -2%, 0)',
    icon: '👦'
  },
  {
    id: 'FOKUS_SYIFA',
    name: 'Fokus Mbak Syifa (Speaker Zoom)',
    subtitle: 'Sorot Karakter Syifa',
    description: 'Kamera bergeser ke sisi Mbak Syifa saat membacakan hikmah atau nasihat santun.',
    cssTransform: 'scale(1.07) translate3d(3%, -2%, 0)',
    icon: '🧕'
  }
];

export const SCENE_ENTRANCE_PRESETS: Array<{
  id: SceneEntrance;
  name: string;
  subtitle: string;
  description: string;
  durationMs: number;
  soundFx: DnaSignatureSound;
}> = [
  {
    id: 'DAUN_MEMBUKA',
    name: 'Daun Membuka (Leaf Sweep)',
    subtitle: 'Sentuhan Alam Asri',
    description: 'Daun-daun hijau segar membuka ke kiri dan kanan menyambut anak masuk ke dunia cerita.',
    durationMs: 1100,
    soundFx: 'FLIP_BUKU'
  },
  {
    id: 'AWAN_BERGESER',
    name: 'Awan Bergeser (Cloud Parting)',
    subtitle: 'Langit Biru Ceria',
    description: 'Awan putih lembut tersibak memperlihatkan pemandangan sekolah dan kampung Asy.',
    durationMs: 1200,
    soundFx: 'PLING_BINTANG'
  },
  {
    id: 'TIRAI_TERBUKA',
    name: 'Tirai Terbuka (Curtain Reveal)',
    subtitle: 'Panggung Teater Santun',
    description: 'Tirai kain beludru emas membuka ke sisi kiri dan kanan dengan anggun.',
    durationMs: 1000,
    soundFx: 'FLIP_BUKU'
  },
  {
    id: 'PELANGI_MUNCUL',
    name: 'Pelangi Muncul (Rainbow Arc)',
    subtitle: 'Khas Sprint G20 & G21',
    description: 'Busur pelangi 7 warna muncul memancar dari tengah lalu memudar lembut.',
    durationMs: 1300,
    soundFx: 'PLING_BINTANG'
  },
  {
    id: 'FADE_LEMBUT',
    name: 'Fade Lembut (Soft Blend)',
    subtitle: 'Transisi Klasik Halus',
    description: 'Transisi pemudaran warna lembut yang sangat ramah mata.',
    durationMs: 800,
    soundFx: 'POP_BALON'
  }
];

export const SCENE_EXIT_PRESETS: Array<{
  id: SceneExit;
  name: string;
  subtitle: string;
  description: string;
  soundFx: DnaSignatureSound;
}> = [
  {
    id: 'BINTANG_KECIL',
    name: 'Bintang Kecil (Star Sparkle)',
    subtitle: 'Bintang Emas Berkelap-kelip',
    description: 'Partikel bintang-bintang kecil berkilauan lembut saat akhir cerita.',
    soundFx: 'PLING_BINTANG'
  },
  {
    id: 'CONFETTI_LEMBUT',
    name: 'Confetti Lembut (Soft Shower)',
    subtitle: 'Hujan Pita Pastel Halus',
    description: 'Kertas confetti warna pastel jatuh melayang tanpa efek menyilaukan.',
    soundFx: 'TEPUK_TANGAN_KECIL'
  },
  {
    id: 'LAMBAIAN_ASY_SYIFA',
    name: 'Lambaian Asy & Syifa',
    subtitle: 'Sapaan Pamit Santun',
    description: 'Asy mengangguk dan Syifa melambaikan tangan dengan senyuman hangat.',
    soundFx: 'TEPUK_TANGAN_KECIL'
  },
  {
    id: 'LINGKARAN_FADE',
    name: 'Lingkaran Kartun (Iris Close)',
    subtitle: 'Tutup Lingkaran Klasik',
    description: 'Lingkaran menyempit ke wajah karakter sebelum berpindah ke menu.',
    soundFx: 'POP_BALON'
  }
];

export const FESTIVAL_CINEMATIC_PRESETS: Record<FestivalCinematicType, {
  title: string;
  subtitle: string;
  bannerColor: string;
  decorations: string[];
  greeting: string;
  duaOrQuote: string;
  themeSound: DnaSignatureSound;
}> = {
  FESTIVAL_CERIA: {
    title: 'Festival & Karnaval Asy Syifa',
    subtitle: 'Panggung Gembira Anak Sholeh & Sholehah',
    bannerColor: 'from-amber-500 via-rose-500 to-emerald-600',
    decorations: ['🎪', '🎈', '🍭', '🎡', '🎨', '🥁'],
    greeting: 'Selamat Datang di Festival Ceria Asy Syifa!',
    duaOrQuote: '“Bergembira bersama dalam ketaatan dan persaudaraan.”',
    themeSound: 'TEPUK_TANGAN_KECIL'
  },
  WISUDA_AKBAR: {
    title: 'Pelepasan & Wisuda Sahabat Asy Syifa',
    subtitle: 'Langkah Awal Menuju Masa Depan Gemilang',
    bannerColor: 'from-emerald-800 via-teal-700 to-amber-600',
    decorations: ['🎓', '📜', '💐', '⭐', '🏆', '✨'],
    greeting: 'Mabruk! Selamat atas kelulusan Ananda Tercinta.',
    duaOrQuote: '“Ya Allah, tambahkanlah ilmuku dan berilah aku kefahaman.” (QS. Thaha: 114)',
    themeSound: 'PLING_BINTANG'
  },
  MILAD_YAYASAN: {
    title: 'Milad Yayasan & Sekolah Asy Syifa',
    subtitle: 'Mengabdi untuk Generasi Qurani Berkarakter',
    bannerColor: 'from-cyan-800 via-blue-700 to-indigo-900',
    decorations: ['🎂', '🏮', '🎊', '🎁', '🌟', '🕊️'],
    greeting: 'Barakallahu Fii Umrik Yayasan Asy Syifa Tercinta.',
    duaOrQuote: '“Menabur benih kebaikan, memanen generasi berakhlak mulia.”',
    themeSound: 'TEPUK_TANGAN_KECIL'
  },
  RAMADHAN_BERKAH: {
    title: 'Marhaban Ya Ramadhan & Gembira Idul Fitri',
    subtitle: 'Bulan Penuh Ampunan, Kasih Sayang & Kebaikan',
    bannerColor: 'from-emerald-900 via-green-800 to-amber-700',
    decorations: ['🌙', '🕌', '🥁', '✨', '🫓', '🤲'],
    greeting: 'Taqabbalallahu Minna Wa Minkum, Sahabat Ceria!',
    duaOrQuote: '“Puasa adalah perisai, dan sedekah menghapus kesalahan.” (HR. Tirmidzi)',
    themeSound: 'PLING_BINTANG'
  }
};

class MagicCameraEngine {
  private config: CameraConfig = {
    defaultMotion: 'MENDEKAT',
    defaultEntrance: 'PELANGI_MUNCUL',
    defaultExit: 'LAMBAIAN_ASY_SYIFA',
    autoCapturePhoto: true,
    spotlightEnabled: true,
    speechBubbleAnimation: true,
    cinematicSpeed: 'STANDAR',
    performanceMode: false
  };

  private photoMemories: StoryPhotoMemory[] = [];
  private listeners: Array<(config: CameraConfig) => void> = [];
  private photoListeners: Array<(photos: StoryPhotoMemory[]) => void> = [];

  constructor() {
    this.loadFromStorage();
    this.seedDefaultPhotosIfEmpty();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedCfg = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (savedCfg) {
          this.config = { ...this.config, ...JSON.parse(savedCfg) };
        }

        const savedPhotos = localStorage.getItem(STORAGE_KEY_PHOTOS);
        if (savedPhotos) {
          this.photoMemories = JSON.parse(savedPhotos);
        }
      }
    } catch {
      // Fallback
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));
        localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(this.photoMemories.slice(0, 30)));
      }
    } catch {
      // safe fallback
    }
  }

  private seedDefaultPhotosIfEmpty() {
    if (this.photoMemories.length === 0) {
      const now = new Date();
      this.photoMemories = [
        {
          id: 'photo-g21-001',
          title: 'Kisah Sahabat Berbagi Bekal',
          subtitle: 'Episode Pagi di Kebun Asy',
          dateStr: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          timestamp: Date.now() - 3600000 * 4,
          sourceModule: 'EPISODE_INTERAKTIF',
          characterRole: 'DUO',
          moralLesson: 'Berbagi makanan mempererat ukhuwah dan mendatangkan keberkahan.',
          duaPhrase: 'Bismillahi awwalahu wa akhirahu',
          badgeEmoji: '🍱',
          snapshotSvgToken: 'BEKAL_CERIA',
          cameraMotionUsed: 'MENDEKAT',
          entranceUsed: 'DAUN_MEMBUKA',
          exitUsed: 'LAMBAIAN_ASY_SYIFA',
          goldenStamp: true
        },
        {
          id: 'photo-g21-002',
          title: 'Petualangan Menanam Bibit Semangka',
          subtitle: 'Taman Bermain Kampung Ceria',
          dateStr: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          timestamp: Date.now() - 3600000 * 24,
          sourceModule: 'KAMPUNG_CERIA',
          characterRole: 'ASY',
          moralLesson: 'Menyayangi tanaman adalah bagian dari syukur atas ciptaan Allah.',
          duaPhrase: 'Subhanallah wa bihamdihi',
          badgeEmoji: '🌱',
          snapshotSvgToken: 'KEBUN_SEMANGKA',
          cameraMotionUsed: 'GESER_PELAN',
          entranceUsed: 'AWAN_BERGESER',
          exitUsed: 'BINTANG_KECIL',
          goldenStamp: true
        },
        {
          id: 'photo-g21-003',
          title: 'Festival Bintang Sholawat Ceria',
          subtitle: 'Panggung Seni Anak Asy Syifa',
          dateStr: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          timestamp: Date.now() - 3600000 * 48,
          sourceModule: 'FESTIVAL',
          characterRole: 'SYIFA',
          moralLesson: 'Menebar sholawat menyejukkan hati dan menumbuhkan rasa cinta Nabi.',
          duaPhrase: 'Allahumma sholli ala Muhammad',
          badgeEmoji: '⭐',
          snapshotSvgToken: 'PANGGUNG_SHOLAWAT',
          cameraMotionUsed: 'FOKUS_SYIFA',
          entranceUsed: 'PELANGI_MUNCUL',
          exitUsed: 'CONFETTI_LEMBUT',
          goldenStamp: true
        }
      ];
      this.saveToStorage();
    }
  }

  public getConfig(): CameraConfig {
    return { ...this.config };
  }

  public updateConfig(partial: Partial<CameraConfig>) {
    this.config = { ...this.config, ...partial };
    this.saveToStorage();
    this.notifyListeners();

    blackBoxRecorder.record({
      moduleCode: 'STUDIO_KAMERA',
      role: 'FOUNDER',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G21_STUDIO_KAMERA_VERIFIED] Camera Config Updated: ${JSON.stringify(partial)}`,
      route: '/founder/camera-studio',
      severity: 'INFO'
    });
  }

  public setMotion(m: CameraMotion) {
    this.updateConfig({ defaultMotion: m });
  }

  public setEntrance(e: SceneEntrance) {
    this.updateConfig({ defaultEntrance: e });
  }

  public setExit(x: SceneExit) {
    this.updateConfig({ defaultExit: x });
  }

  /**
   * P4: Record scene started with BlackBoxRecorder & Telemetry
   */
  public recordSceneStarted(sceneName: string, moduleSource: string, motion: CameraMotion, entrance: SceneEntrance) {
    tadeAnimationGovernor.startAnimation(`CAMERA_SCENE_${moduleSource}`);
    
    // Play sound FX for entrance
    const entrancePreset = SCENE_ENTRANCE_PRESETS.find(p => p.id === entrance);
    if (entrancePreset) {
      asySyifaDnaEngine.playSignatureSound(entrancePreset.soundFx);
    }

    blackBoxRecorder.record({
      moduleCode: 'CAMERA_STUDIO',
      role: 'SUPER_ADMIN',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G21_STUDIO_KAMERA_VERIFIED] SCENE_STARTED: "${sceneName}" in ${moduleSource} | Motion: ${motion} | Entrance: ${entrance}`,
      route: `/${moduleSource.toLowerCase()}`,
      severity: 'INFO'
    });
  }

  /**
   * P4: Record scene completed with BlackBoxRecorder & Telemetry
   */
  public recordSceneCompleted(sceneName: string, moduleSource: string, exitEffect: SceneExit) {
    tadeAnimationGovernor.stopAnimation(`CAMERA_SCENE_${moduleSource}`);

    // Play exit sound FX
    const exitPreset = SCENE_EXIT_PRESETS.find(p => p.id === exitEffect);
    if (exitPreset) {
      asySyifaDnaEngine.playSignatureSound(exitPreset.soundFx);
    }

    blackBoxRecorder.record({
      moduleCode: 'CAMERA_STUDIO',
      role: 'SUPER_ADMIN',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G21_STUDIO_KAMERA_VERIFIED] SCENE_COMPLETED: "${sceneName}" in ${moduleSource} | Exit: ${exitEffect}`,
      route: `/${moduleSource.toLowerCase()}`,
      severity: 'INFO'
    });
  }

  /**
   * P5: Capture Story Memory Photo automatically (Polaroid / Memory Card)
   */
  public captureStoryPhoto(params: {
    title: string;
    subtitle: string;
    sourceModule: 'TV_ASY' | 'EPISODE_INTERAKTIF' | 'RUMAH_ASY' | 'KAMPUNG_CERIA' | 'FESTIVAL' | 'CREATIVE_STUDIO';
    characterRole?: 'ASY' | 'SYIFA' | 'DUO' | 'KAMPUNG_FRIENDS';
    moralLesson?: string;
    duaPhrase?: string;
    badgeEmoji?: string;
    snapshotSvgToken?: string;
  }): StoryPhotoMemory {
    const now = new Date();
    const newPhoto: StoryPhotoMemory = {
      id: `photo-g21-${Date.now().toString(36)}`,
      title: params.title,
      subtitle: params.subtitle,
      dateStr: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: Date.now(),
      sourceModule: params.sourceModule,
      characterRole: params.characterRole || 'DUO',
      moralLesson: params.moralLesson || 'Belajar dengan riang dan berakhlak mulia.',
      duaPhrase: params.duaPhrase || 'Alhamdulillahilladzi bini\'matihi tatimmus shaalihaat',
      badgeEmoji: params.badgeEmoji || '✨',
      snapshotSvgToken: params.snapshotSvgToken || 'STORY_SNAPSHOT',
      cameraMotionUsed: this.config.defaultMotion,
      entranceUsed: this.config.defaultEntrance,
      exitUsed: this.config.defaultExit,
      goldenStamp: true
    };

    this.photoMemories = [newPhoto, ...this.photoMemories.slice(0, 29)];
    this.saveToStorage();
    this.notifyPhotoListeners();

    // BlackBox Telemetry
    blackBoxRecorder.record({
      moduleCode: 'CAMERA_PHOTO_AUTO',
      role: 'SUPER_ADMIN',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G21_STUDIO_KAMERA_VERIFIED] STORY_PHOTO_CAPTURED: "${newPhoto.title}" (${newPhoto.id}) saved to Buku Cerita & Kotak Kenangan.`,
      route: '/kotak-kenangan',
      severity: 'INFO'
    });

    return newPhoto;
  }

  public getPhotos(): StoryPhotoMemory[] {
    return [...this.photoMemories];
  }

  public deletePhoto(id: string) {
    this.photoMemories = this.photoMemories.filter(p => p.id !== id);
    this.saveToStorage();
    this.notifyPhotoListeners();
  }

  public subscribe(cb: (config: CameraConfig) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public subscribePhotos(cb: (photos: StoryPhotoMemory[]) => void): () => void {
    this.photoListeners.push(cb);
    return () => {
      this.photoListeners = this.photoListeners.filter(l => l !== cb);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb({ ...this.config }));
  }

  private notifyPhotoListeners() {
    this.photoListeners.forEach(cb => cb([...this.photoMemories]));
  }
}

export const magicCameraEngine = new MagicCameraEngine();
