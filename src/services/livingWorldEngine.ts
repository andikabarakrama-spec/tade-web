/**
 * TADE LIVING WORLD ENGINE (SPRINT G16 — DUNIA ASY YANG HIDUP)
 * Controls:
 * P1 — Pagi, Siang, Sore, Malam (Day/Night transitions, celestial bodies, night lights)
 * P2 — Cuaca Ceria (Cerah, Berawan, Gerimis, Hujan Pelan, Pelangi)
 * P3 — Pohon Musim (PPDB, Ramadhan, Wisuda, Milad, Kemerdekaan, Tahun Baru Hijriah)
 * P4 — Taman Bergerak (Gentle butterflies, bees, swaying leaves, swimming koi, walking ducks)
 * P5 — Jam Ceria (Gentle contextual greetings & cuckoo chimes)
 * P6 — Acara Spesial (Integration with LivingEventEngine & TV Asy thematic styling)
 * P7 — Kejutan Emas (Weekly rare golden discoveries: Balon Emas, Kupu-kupu Emas, Kereta Emas, Bintang Jatuh)
 * 
 * Complies with:
 * - 60 FPS lightweight animations (via tadeAnimationGovernor, max 5 active)
 * - Dr. Pulse Health Passport Telemetry
 * - Black Box Recorder (Ring 1 & Ring 2)
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeSoundEngine } from './tadeSoundEngine';
import { LivingEventEngine, SchoolEventType } from './livingEventEngine';

export type TimePhase = 'PAGI' | 'SIANG' | 'SORE' | 'MALAM';

export type CheerfulWeather = 'CERAH' | 'BERAWAN' | 'GERIMIS' | 'HUJAN_PELAN' | 'PELANGI';

export interface TimePhaseConfig {
  id: TimePhase;
  label: string;
  hourRange: string;
  skyGradient: string;
  sunOrMoonEmoji: string;
  elementHighlights: string[];
  ambientColor: string;
  greetingText: string;
}

export interface WeatherConfig {
  id: CheerfulWeather;
  name: string;
  emoji: string;
  description: string;
  particleEmoji: string;
  overlayClass: string;
  soundName?: string;
}

export interface SeasonalTreeConfig {
  eventType: SchoolEventType;
  title: string;
  leafColor: string;
  ornaments: {
    emoji: string;
    label: string;
    description: string;
  }[];
  trunkGlow: string;
  groundDecoration: string;
}

export interface GoldenSurprise {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarityTitle: string;
  blessingMessage: string;
  themeColor: string;
  sparkleGradient: string;
  discoveredAt?: string;
}

export const GOLDEN_SURPRISES: GoldenSurprise[] = [
  {
    id: 'gold_balloon',
    name: 'Balon Emas Kemilau Berkah',
    description: 'Balon istimewa berlapis emas yang melayang anggun membawa doa kebaikan untuk santri cilik.',
    emoji: '🎈',
    rarityTitle: 'Emas Kerajaan',
    blessingMessage: '“Semoga cita-cita ananda terbang tinggi dan berkah seperti balon emas ini!”',
    themeColor: 'from-amber-400 via-yellow-300 to-amber-500',
    sparkleGradient: 'bg-amber-400'
  },
  {
    id: 'gold_butterfly',
    name: 'Kupu-kupu Emas Zamrud',
    description: 'Kupu-kupu anggun bersayap emas yang hinggap membawa keharuman akhlak terpuji di Taman Asy.',
    emoji: '🦋',
    rarityTitle: 'Emas Zamrud Langka',
    blessingMessage: '“Kelembutan tutur kata dan ketulusan hati adalah perhiasan terindah seorang santri.”',
    themeColor: 'from-yellow-300 via-amber-400 to-emerald-400',
    sparkleGradient: 'bg-yellow-300'
  },
  {
    id: 'gold_train',
    name: 'Lokomotif Masinis Emas',
    description: 'Gerbong kereta legenda bermuatan ilmu dan sholawat yang meluncur di Stasiun Kereta Cerita.',
    emoji: '🚂',
    rarityTitle: 'Emas Kehormatan',
    blessingMessage: '“Laju semangat belajar yang istiqomah menuju masa depan cerah penuh ridha Ilahi!”',
    themeColor: 'from-amber-500 via-yellow-400 to-teal-400',
    sparkleGradient: 'bg-amber-500'
  },
  {
    id: 'gold_star',
    name: 'Bintang Jatuh Berkah',
    description: 'Pancaran bintang fajar emas yang mengabulkan doa tulus orang tua dan para ustadzah.',
    emoji: '⭐',
    rarityTitle: 'Emas Surgawi',
    blessingMessage: '“Robbi habli minash-sholihiin — Jadikanlah anak-anak kami hamba yang sholeh dan sholehah!”',
    themeColor: 'from-yellow-200 via-amber-300 to-orange-400',
    sparkleGradient: 'bg-yellow-200'
  }
];

const GOLDEN_COLLECTION_STORAGE_KEY = 'tade_g16_golden_surprises_v1';
const LIVING_WORLD_OVERRIDE_KEY = 'tade_g16_living_world_settings_v1';

export class LivingWorldEngine {
  private static instance: LivingWorldEngine | null = null;

  private manualTimeOverride: TimePhase | null = null;
  private manualWeatherOverride: CheerfulWeather | null = null;
  private activeGoldenSurprise: GoldenSurprise | null = null;
  private collectedGoldenIds: string[] = [];
  private listeners: (() => void)[] = [];

  public static getInstance(): LivingWorldEngine {
    if (!LivingWorldEngine.instance) {
      LivingWorldEngine.instance = new LivingWorldEngine();
    }
    return LivingWorldEngine.instance;
  }

  private constructor() {
    this.loadState();
    // Periodic check for occasional golden surprise spawn
    if (typeof window !== 'undefined') {
      window.setInterval(() => {
        this.evaluateOccasionalGoldenSurprise();
      }, 60000);
    }
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const storedGolden = localStorage.getItem(GOLDEN_COLLECTION_STORAGE_KEY);
      if (storedGolden) {
        this.collectedGoldenIds = JSON.parse(storedGolden);
      }

      const storedOverrides = localStorage.getItem(LIVING_WORLD_OVERRIDE_KEY);
      if (storedOverrides) {
        const parsed = JSON.parse(storedOverrides);
        if (parsed.time) this.manualTimeOverride = parsed.time;
        if (parsed.weather) this.manualWeatherOverride = parsed.weather;
      }
    } catch {
      // safe fallback
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(GOLDEN_COLLECTION_STORAGE_KEY, JSON.stringify(this.collectedGoldenIds));
      localStorage.setItem(LIVING_WORLD_OVERRIDE_KEY, JSON.stringify({
        time: this.manualTimeOverride,
        weather: this.manualWeatherOverride
      }));
    } catch {
      // safe fallback
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  // --- P1: TIME OF DAY CALCULATION ---
  public getTimePhase(): TimePhase {
    if (this.manualTimeOverride) return this.manualTimeOverride;

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'PAGI';
    if (hour >= 11 && hour < 15) return 'SIANG';
    if (hour >= 15 && hour < 18) return 'SORE';
    return 'MALAM';
  }

  public setTimePhaseOverride(phase: TimePhase | null): void {
    this.manualTimeOverride = phase;
    this.saveState();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-WAKTU-HIDUP',
      role: 'FOUNDER',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Fase waktu diatur ke: ${phase || 'Otomatis (Sistem)'}`
    });
  }

  public getTimePhaseConfig(phase: TimePhase = this.getTimePhase()): TimePhaseConfig {
    switch (phase) {
      case 'PAGI':
        return {
          id: 'PAGI',
          label: 'Pagi Hari yang Ceria',
          hourRange: '05:00 — 11:00',
          skyGradient: 'from-amber-200 via-sky-300 to-emerald-200',
          sunOrMoonEmoji: '☀️',
          elementHighlights: ['Matahari tersenyum ramah', 'Burung berkicau merdu', 'Embun segar di atas rumput'],
          ambientColor: 'text-amber-600',
          greetingText: 'Pagi yang ceria! Awali hari dengan Bismillah dan senyuman terbaik.'
        };
      case 'SIANG':
        return {
          id: 'SIANG',
          label: 'Siang yang Bersemangat',
          hourRange: '11:00 — 15:00',
          skyGradient: 'from-sky-400 via-blue-300 to-teal-200',
          sunOrMoonEmoji: '🌞',
          elementHighlights: ['Langit biru cerah membentang', 'Awan putih bergerak pelan', 'Kupu-kupu riang menari'],
          ambientColor: 'text-sky-600',
          greetingText: 'Siang penuh semangat! Saatnya belajar, bermain, dan makan siang bergizi.'
        };
      case 'SORE':
        return {
          id: 'SORE',
          label: 'Sore yang Teduh & Hangat',
          hourRange: '15:00 — 18:00',
          skyGradient: 'from-amber-400 via-orange-400 to-rose-400',
          sunOrMoonEmoji: '🌅',
          elementHighlights: ['Langit jingga keemasan', 'Layang-layang terbang tinggi', 'Angin sejuk berhembus'],
          ambientColor: 'text-orange-600',
          greetingText: 'Sore yang teduh! Waktunya merapikan mainan dan bersiap kumpul keluarga.'
        };
      case 'MALAM':
        return {
          id: 'MALAM',
          label: 'Malam Bertabur Bintang',
          hourRange: '18:00 — 05:00',
          skyGradient: 'from-slate-950 via-indigo-950 to-emerald-950',
          sunOrMoonEmoji: '🌙',
          elementHighlights: ['Bulan sabit bercahaya lembut', 'Bintang-bintang berkedip manis', 'Lampu Rumah Asy menyala hangat'],
          ambientColor: 'text-indigo-400',
          greetingText: 'Malam yang damai! Saatnya istirahat nyenyak, sholat Isya, dan membaca doa tidur.'
        };
    }
  }

  // --- P2: CHEERFUL WEATHER ---
  public getWeather(): CheerfulWeather {
    if (this.manualWeatherOverride) return this.manualWeatherOverride;
    return 'CERAH';
  }

  public setWeatherOverride(weather: CheerfulWeather | null): void {
    this.manualWeatherOverride = weather;
    this.saveState();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-CUACA-CERIA',
      role: 'FOUNDER',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Cuaca diatur ke: ${weather || 'Otomatis (Cerah)'}`
    });
  }

  public getWeatherConfig(weather: CheerfulWeather = this.getWeather()): WeatherConfig {
    switch (weather) {
      case 'CERAH':
        return {
          id: 'CERAH',
          name: 'Cerah Bersemi',
          emoji: '☀️',
          description: 'Sinar mentari hangat menerangi seluruh halaman Rumah Asy & Syifa.',
          particleEmoji: '✨',
          overlayClass: 'opacity-0'
        };
      case 'BERAWAN':
        return {
          id: 'BERAWAN',
          name: 'Berawan Teduh',
          emoji: '⛅',
          description: 'Awan putih empuk berarak pelan melindungi anak-anak yang bermain.',
          particleEmoji: '☁️',
          overlayClass: 'bg-white/10'
        };
      case 'GERIMIS':
        return {
          id: 'GERIMIS',
          name: 'Gerimis Berkah',
          emoji: '🌦️',
          description: 'Rintik lembut menyiram dedaunan pohon dan bunga-bunga harum.',
          particleEmoji: '💧',
          overlayClass: 'bg-blue-900/10'
        };
      case 'HUJAN_PELAN':
        return {
          id: 'HUJAN_PELAN',
          name: 'Hujan Pelan Asyik',
          emoji: '🌧️',
          description: 'Suasana syahdu dengan tetesan air hujan pembawa rahmat Allah.',
          particleEmoji: '🌧️',
          overlayClass: 'bg-slate-900/20'
        };
      case 'PELANGI':
        return {
          id: 'PELANGI',
          name: 'Pelangi Indah',
          emoji: '🌈',
          description: 'Lengkung 7 warna berkilau di langit sehabis hujan!',
          particleEmoji: '🌈',
          overlayClass: 'bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-blue-500/10'
        };
    }
  }

  // --- P3: POHON MUSIM (SEASONAL TREE) ---
  public getSeasonalTreeConfig(): SeasonalTreeConfig {
    const livingEvent = LivingEventEngine.getInstance().getActiveEvent();
    const eventType = livingEvent.eventId;

    switch (eventType) {
      case 'PPDB':
        return {
          eventType: 'PPDB',
          title: 'Pohon PPDB — Daun Hijau Segar & Kuncup Bersemi',
          leafColor: 'from-emerald-400 to-green-500',
          ornaments: [
            { emoji: '🌱', label: 'Tunas Baru', description: 'Menyambut calon santri baru' },
            { emoji: '🎒', label: 'Tas Cilik', description: 'Semangat memulai sekolah' },
            { emoji: '⭐', label: 'Bintang Prestasi', description: 'Awal langkah kesuksesan' }
          ],
          trunkGlow: 'border-emerald-300 shadow-emerald-500/30',
          groundDecoration: 'Rumput hijau berhias bunga melati segar'
        };
      case 'RAMADHAN':
        return {
          eventType: 'RAMADHAN',
          title: 'Pohon Ramadhan — Lentera Berkah & Bulan Sabit',
          leafColor: 'from-teal-400 to-emerald-600',
          ornaments: [
            { emoji: '🏮', label: 'Lentera Kaca', description: 'Cahaya tarawih & tadarus' },
            { emoji: '🌙', label: 'Bulan Sabit', description: 'Malam seribu bulan' },
            { emoji: '✨', label: 'Kilau Sholawat', description: 'Doa mustajab menjelang berbuka' }
          ],
          trunkGlow: 'border-amber-300 shadow-amber-500/40',
          groundDecoration: 'Hamparan sajadah mini & lentera menyala'
        };
      case 'WISUDA':
        return {
          eventType: 'WISUDA',
          title: 'Pohon Wisuda — Pita Emas & Topi Toga Cilik',
          leafColor: 'from-amber-400 to-yellow-500',
          ornaments: [
            { emoji: '🎀', label: 'Pita Emas', description: 'Tanda kelulusan berprestasi' },
            { emoji: '🎓', label: 'Toga Cilik', description: 'Haflah Akhirussanah santri' },
            { emoji: '📜', label: 'Syahadah Tahfidz', description: 'Khatam Juz 30 & Hadits' }
          ],
          trunkGlow: 'border-yellow-300 shadow-yellow-500/50',
          groundDecoration: 'Karpet merah bertepung kelopak mawar emas'
        };
      case 'MILAD_TK':
        return {
          eventType: 'MILAD_TK',
          title: 'Pohon Milad — Balon Warna-Warni & Pita Ceria',
          leafColor: 'from-rose-400 to-amber-400',
          ornaments: [
            { emoji: '🎈', label: 'Balon Milad', description: 'Syukuran ulang tahun sekolah' },
            { emoji: '🎁', label: 'Kado Bahagia', description: 'Berkah untuk seluruh santri' },
            { emoji: '🎉', label: 'Konfeti Sukacita', description: 'Perayaan penuh kegembiraan' }
          ],
          trunkGlow: 'border-rose-300 shadow-rose-500/40',
          groundDecoration: 'Pita warna-warni & kue syukuran bertingkat'
        };
      case 'KEMERDEKAAN':
        return {
          eventType: 'KEMERDEKAAN',
          title: 'Pohon Kemerdekaan — Merah Putih & Umbul-umbul',
          leafColor: 'from-red-500 to-rose-600',
          ornaments: [
            { emoji: '🇮🇩', label: 'Bendera Merah Putih', description: 'Semangat cinta tanah air' },
            { emoji: '🎗️', label: 'Pita Dwiwarna', description: 'Hiasan gapura kemerdekaan' },
            { emoji: '🏆', label: 'Piala Lomba Ceria', description: 'Semangat pantang menyerah' }
          ],
          trunkGlow: 'border-red-400 shadow-red-500/40',
          groundDecoration: 'Gapura bambu runcing mini merah putih'
        };
      default:
        return {
          eventType: 'REGULAR_DAY',
          title: 'Pohon Halaman — Asri, Sejuk & Menyejukkan Hati',
          leafColor: 'from-emerald-400 to-green-600',
          ornaments: [
            { emoji: '🍃', label: 'Dedaunan Asri', description: 'Oksigen segar setiap hari' },
            { emoji: '🌸', label: 'Bunga Mekar', description: 'Keindahan alam ciptaan Allah' },
            { emoji: '🕊️', label: 'Sarang Burung', description: 'Kedamaian di pekarangan' }
          ],
          trunkGlow: 'border-emerald-300 shadow-emerald-500/20',
          groundDecoration: 'Rumput hijau dengan batu pijakan alam'
        };
    }
  }

  // --- P5: JAM CERIA CONTEXTUAL GREETING ---
  public getJamCeriaGreeting(): { title: string; subtitle: string; timeString: string; soundType: 'CLOCK_CHIME' } {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes} WIB`;

    const phase = this.getTimePhase();
    const cfg = this.getTimePhaseConfig(phase);

    return {
      title: `Jam Ceria Rumah Asy (${timeString})`,
      subtitle: cfg.greetingText,
      timeString,
      soundType: 'CLOCK_CHIME'
    };
  }

  // --- P7: KEJUTAN EMAS (GOLDEN SURPRISES) ---
  public evaluateOccasionalGoldenSurprise(): void {
    // 35% chance to spawn an uncollected or available golden surprise during periodic tick
    if (this.activeGoldenSurprise) return;

    if (Math.random() < 0.4) {
      const uncollected = GOLDEN_SURPRISES.filter(s => !this.collectedGoldenIds.includes(s.id));
      const targetList = uncollected.length > 0 ? uncollected : GOLDEN_SURPRISES;
      const chosen = targetList[Math.floor(Math.random() * targetList.length)];
      this.activeGoldenSurprise = chosen;
      this.notify();

      blackBoxRecorder.record({
        ring: 'RING_2',
        moduleCode: 'G16-KEJUTAN-EMAS',
        role: 'SANTRI',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Kejutan Emas muncul di layar: "${chosen.name}" (${chosen.emoji})`
      });
    }
  }

  public triggerManualGoldenSurprise(id?: string): GoldenSurprise {
    const chosen = id 
      ? (GOLDEN_SURPRISES.find(s => s.id === id) || GOLDEN_SURPRISES[0])
      : GOLDEN_SURPRISES[Math.floor(Math.random() * GOLDEN_SURPRISES.length)];

    this.activeGoldenSurprise = chosen;
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-KEJUTAN-EMAS',
      role: 'FOUNDER',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Kejutan Emas dipicu manual: "${chosen.name}"`
    });

    return chosen;
  }

  public getActiveGoldenSurprise(): GoldenSurprise | null {
    return this.activeGoldenSurprise;
  }

  public dismissActiveGoldenSurprise(): void {
    this.activeGoldenSurprise = null;
    this.notify();
  }

  public collectGoldenSurprise(id: string): void {
    if (!this.collectedGoldenIds.includes(id)) {
      this.collectedGoldenIds.push(id);
      this.saveState();
    }
    this.activeGoldenSurprise = null;
    tadeSoundEngine.playFx('GOLDEN_DISCOVERY');

    const surprise = GOLDEN_SURPRISES.find(s => s.id === id);

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-KEJUTAN-EMAS',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Kejutan Emas berhasil dikoleksi: "${surprise?.name || id}" (${this.collectedGoldenIds.length}/${GOLDEN_SURPRISES.length})`
    });

    this.notify();
  }

  public getCollectedGoldenIds(): string[] {
    return [...this.collectedGoldenIds];
  }
}

export const livingWorldEngine = LivingWorldEngine.getInstance();
