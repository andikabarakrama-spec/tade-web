/**
 * TADE SPRINT G40 — KEBUN AJAIB & PANEN BERKAH ENGINE
 * Kindergarten Gardening, Nurturing Nature, Healthy Food Origins, & Gratitude Simulator
 * 
 * Features:
 * - P1: Gerbang Kebun Berkah (Gerbang bambu terbuka perlahan, burung pipit berkicau, sapaan Dek Asy "Selamat datang di Kebun Berkah.")
 * - P2: Menanam Bersama (6 Tanaman: Wortel, Bayam, Kangkung, Tomat, Cabai, Bunga Matahari - tanah tersenyum, bibit melambai)
 * - P3: Menyiram Tanaman (Gembor kecil lucu, air mengalir pelan dengan suara tetesan segar, daun bergoyang riang)
 * - P4: Panen Berkah 20 Detik (Tanaman tumbuh subur, anak-anak memanen dengan penuh syukur, hasil panen disalurkan ke MBG)
 * - P5: Sahabat Kebun (Mimi si Kelinci, Bubu si Burung, Dodo penjaga kolam, Gogo pembawa keranjang)
 * - P6: Buku Panen Kenangan (Cap kenangan stempel: Daun Hijau, Wortel Ceria, Matahari Berkah, Gembor Sahabat - tanpa skor & ranking)
 * - P7: Founder Kebun Control (Uji suara kebun & burung, uji hujan rintik segar, simulasi panen otomatis P1–P6, audit Black Box Ring-0)
 * - Bonus: Lebah madu dengung manis, kupu-kupu warna-warni, capung lincah, pelangi kecil setelah menyiram, orang-orangan sawah tersenyum
 * 
 * Marker: G40_KEBUN_AJAIB_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type KebunPhase =
  | 'GATE_KEBUN'     // P1: Gerbang bambu & burung berkicau
  | 'PLANTING'       // P2: Menanam 6 tanaman di tanah tersenyum
  | 'WATERING'       // P3: Menyiram dengan gembor lucu & daun bergoyang
  | 'HARVEST_20S'    // P4: Panen berkah 20s terhubung ke MBG
  | 'GARDEN_FRIENDS' // P5: Sahabat kebun (Mimi, Bubu, Dodo, Gogo)
  | 'HARVEST_BOOK';  // P6: Buku panen kenangan & cap kebaikan

export type PlantId = 'WORTEL' | 'BAYAM' | 'KANGKUNG' | 'TOMAT' | 'CABAI' | 'MATAHARI';
export type GardenFriendId = 'MIMI' | 'BUBU' | 'DODO' | 'GOGO';

export interface PlantInfo {
  id: PlantId;
  name: string;
  category: string;
  emoji: string;
  seedEmoji: string;
  growthTime: string;
  mbgNutrient: string;
  careTip: string;
  soilHumor: string;
}

export interface GardenFriend {
  id: GardenFriendId;
  name: string;
  species: string;
  icon: string;
  role: string;
  greeting: string;
  specialAction: string;
}

export interface KebunSnapshot {
  currentPhase: KebunPhase;
  activePlant: PlantId;
  waterLevel: number; // 0 to 100%
  hasRainbow: boolean;
  isHarvesting: boolean;
  harvestProgressSeconds: number;
  harvestedBaskets: Array<{ id: string; name: string; icon: string; count: number }>;
  stampedBadges: string[];
  activeFriend: GardenFriendId;
  isAutoPlayingKebun: boolean;
}

class KebunAjaibEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: KebunPhase = 'GATE_KEBUN';
  private activePlant: PlantId = 'WORTEL';
  private waterLevel: number = 65;
  private hasRainbow: boolean = false;
  private isHarvesting: boolean = false;
  private harvestProgressSeconds: number = 0;
  private harvestTimer: any = null;
  private harvestedBaskets: Array<{ id: string; name: string; icon: string; count: number }> = [
    { id: '1', name: 'Wortel Segar Manis', icon: '🥕', count: 12 },
    { id: '2', name: 'Bayam Hijau Subur', icon: '🥬', count: 8 },
    { id: '3', name: 'Tomat Merah Segar', icon: '🍅', count: 15 }
  ];
  private stampedBadges: string[] = ['Daun Hijau', 'Wortel Ceria', 'Matahari Berkah', 'Gembor Sahabat'];
  private activeFriend: GardenFriendId = 'MIMI';
  private isAutoPlayingKebun: boolean = false;
  private autoPlayTimer: any = null;

  private listeners: Set<() => void> = new Set();

  public readonly plants: Record<PlantId, PlantInfo> = {
    WORTEL: {
      id: 'WORTEL',
      name: 'Wortel Manis Berkah',
      category: 'Sayuran Umbi Kaya Vitamin A',
      emoji: '🥕',
      seedEmoji: '🌱',
      growthTime: 'Tumbuh subur di dalam tanah gembur',
      mbgNutrient: 'Vitamin A untuk kesehatan mata bening & daya tahan tubuh',
      careTip: 'Disiram lembut pagi dan sore agar tanah tetap sejuk dan gembur.',
      soilHumor: 'Tanah tersenyum: “Wah, akarnya menggelitik perut tanah dengan riang!”'
    },
    BAYAM: {
      id: 'BAYAM',
      name: 'Bayam Hijau Ceria',
      category: 'Sayuran Daun Penambah Energi',
      emoji: '🥬',
      seedEmoji: '🌿',
      growthTime: 'Tumbuh cepat dengan daun hijau segar berkilau',
      mbgNutrient: 'Zat besi alami untuk tulang kuat dan tubuh bertenaga',
      careTip: 'Suka sinar matahari pagi yang hangat dan siraman air sejuk.',
      soilHumor: 'Tanah tersenyum: “Daunnya melambai menyapa matahari pagi!”'
    },
    KANGKUNG: {
      id: 'KANGKUNG',
      name: 'Kangkung Air Segar',
      category: 'Sayuran Daun Hijau Renyah',
      emoji: '🌱',
      seedEmoji: '🍃',
      growthTime: 'Tumbuh lebat dengan batang berongga yang renyah',
      mbgNutrient: 'Serat alami untuk pencernaan sehat dan kenyang berkah',
      careTip: 'Membutuhkan air yang cukup agar batangnya tetap renyah dan segar.',
      soilHumor: 'Tanah tersenyum: “Batangnya bergoyang santai ditiup angin sepoi!”'
    },
    TOMAT: {
      id: 'TOMAT',
      name: 'Tomat Merah Ranum',
      category: 'Buah Sayur Kaya Antioksidan',
      emoji: '🍅',
      seedEmoji: '🪴',
      growthTime: 'Berbunga kuning mungil sebelum menjadi buah merah bulat',
      mbgNutrient: 'Vitamin C & Lycopene untuk kesehatan kulit dan jantung',
      careTip: 'Diberi ajir bambu kecil agar batangnya berdiri tegak dan kokoh.',
      soilHumor: 'Tanah tersenyum: “Buahnya bulat merah merona bagai pipi anak tersenyum!”'
    },
    CABAI: {
      id: 'CABAI',
      name: 'Cabai Manis Hias',
      category: 'Bumbu Dapur Alami Ramah Anak',
      emoji: '🌶️',
      seedEmoji: '🌱',
      growthTime: 'Berbuah merah dan hijau cerah penghias kebun berkah',
      mbgNutrient: 'Vitamin C alami dan penambah selera makan bergizi',
      careTip: 'Dijaga dari ulat kecil dengan semprotan air rebusan daun serai alami.',
      soilHumor: 'Tanah tersenyum: “Warnanya cerah bersemangat di antara daun hijau!”'
    },
    MATAHARI: {
      id: 'MATAHARI',
      name: 'Bunga Matahari Ceria',
      category: 'Bunga Sahabat Lebah & Penyerbuk',
      emoji: '🌻',
      seedEmoji: '🌾',
      growthTime: 'Mekar besar menghadap ke arah datangnya sinar matahari',
      mbgNutrient: 'Biji bunga matahari penghasil minyak nabati alami & sahabat lebah',
      careTip: 'Menghadirkan lebah madu dan kupu-kupu yang membantu penyerbukan kebun.',
      soilHumor: 'Tanah tersenyum: “Wajah bunganya selalu tersenyum mengikuti cahaya mentari!”'
    }
  };

  public readonly gardenFriends: Record<GardenFriendId, GardenFriend> = {
    MIMI: {
      id: 'MIMI',
      name: 'Mimi si Kelinci Putih',
      species: 'Kelinci Ramah 🐰',
      icon: '🐰',
      role: 'Sahabat Wortel & Penggembur Tanah',
      greeting: '“Lompat... lompat! Mimi bantu bersihkan rumput liar di sekitar wortel ya!”',
      specialAction: 'Membantu menepuk-nepuk tanah agar tetap gembur dan sejuk.'
    },
    BUBU: {
      id: 'BUBU',
      name: 'Bubu si Burung Pipit',
      species: 'Burung Pipit Kuning 🐦',
      icon: '🐦',
      role: 'Penyebar Benih & Pengingat Pagi',
      greeting: '“Cit-cit-cuit! Bubu membawa bibit bunga matahari dari pohon sebelah!”',
      specialAction: 'Berkicau merdu menyambut terbitnya fajar dan menyebarkan benih baik.'
    },
    DODO: {
      id: 'DODO',
      name: 'Dodo si Kura-Kura',
      species: 'Kura-kura Bijak 🐢',
      icon: '🐢',
      role: 'Penjaga Kolam & Sumber Air Bersih',
      greeting: '“Jalan perlahan dan sabar, seperti merawat tanaman yang tumbuh dengan kasih sayang.”',
      specialAction: 'Menjaga kejernihan kolam air alami untuk menyiram kebun.'
    },
    GOGO: {
      id: 'GOGO',
      name: 'Gogo si Beruang Mini',
      species: 'Beruang Madu Lucu 🐻',
      icon: '🐻',
      role: 'Pengangkat Keranjang Panen ke MBG',
      greeting: '“Hup! Keranjang sayur bayam dan tomat siap kita antarkan ke Dapur MBG!”',
      specialAction: 'Membantu membawakan keranjang hasil panen ke dapur makan bergizi.'
    }
  };

  constructor() {}

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error in KebunAjaibEngine subscriber', err);
      }
    });
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Sound: Bamboo Gate & Bird Chirping (P1)
   */
  public playGateAndBirdChirp() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Bamboo creak + opening
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.linearRampToValueAtTime(330, now + 0.3);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Sparrow chirp (high pleasant pitch)
      [1760, 2093, 2349, 1975].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.2 + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + 0.2 + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.2 + idx * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.2 + idx * 0.08);
        osc.stop(now + 0.2 + idx * 0.08 + 0.15);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Watering Drops & Little Rain (P3)
   */
  public playWateringDrops() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Bubble drop cascade
      [800, 950, 1100, 750, 1200, 900].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.07 + 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.07 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.15);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Plant Growth Sparkle & Harvest Chime (P4)
   */
  public playHarvestChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Pentatonic bright chime (F5, A5, C6, E6, G6)
      [698.46, 880.0, 1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.6);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Stamp of Good Deed (P6)
   */
  public playStampSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(150, now);
      osc1.frequency.exponentialRampToValueAtTime(50, now + 0.08);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, now + 0.05); // C6

      gain2.gain.setValueAtTime(0.001, now + 0.05);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.4);
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: KebunPhase) {
    this.currentPhase = phase;
    if (phase === 'GATE_KEBUN') {
      this.playGateAndBirdChirp();
    } else if (phase === 'WATERING') {
      this.playWateringDrops();
      this.hasRainbow = true;
    } else if (phase === 'HARVEST_20S') {
      this.startHarvestStory(20);
    } else if (phase === 'HARVEST_BOOK') {
      this.playStampSound();
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G40-PHASE-NAV',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Kebun Ajaib navigated to phase: ${phase}`
    });
  }

  public selectPlant(plantId: PlantId) {
    this.activePlant = plantId;
    this.playHarvestChime();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G40-SELECT-PLANT',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Selected plant: ${this.plants[plantId].name}`
    });
  }

  public selectGardenFriend(friendId: GardenFriendId) {
    this.activeFriend = friendId;
    this.playGateAndBirdChirp();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G40-SELECT-FRIEND',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Interacted with garden friend: ${this.gardenFriends[friendId].name}`
    });
  }

  public waterGarden() {
    this.waterLevel = Math.min(100, this.waterLevel + 20);
    this.hasRainbow = true;
    this.playWateringDrops();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G40-WATER-PLANTS',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Watered plants with gembor, moisture level: ${this.waterLevel}%`
    });
  }

  public startHarvestStory(durationSeconds: number = 20) {
    if (this.harvestTimer) {
      clearInterval(this.harvestTimer);
    }
    this.isHarvesting = true;
    this.harvestProgressSeconds = 0;
    this.playGateAndBirdChirp();
    this.notify();

    this.harvestTimer = setInterval(() => {
      this.harvestProgressSeconds += 1;
      if (this.harvestProgressSeconds >= durationSeconds) {
        clearInterval(this.harvestTimer);
        this.isHarvesting = false;
        this.harvestProgressSeconds = durationSeconds;
        this.playHarvestChime();
        this.notify();
      } else {
        if (this.harvestProgressSeconds % 5 === 0) {
          this.playWateringDrops();
        }
        this.notify();
      }
    }, 1000);
  }

  public stopHarvestStory() {
    if (this.harvestTimer) {
      clearInterval(this.harvestTimer);
    }
    this.isHarvesting = false;
    this.notify();
  }

  public addHarvestItem(name: string, icon: string) {
    const existing = this.harvestedBaskets.find((b) => b.name.includes(name.split(' ')[0]));
    if (existing) {
      existing.count += 5;
    } else {
      this.harvestedBaskets.push({
        id: `${Date.now()}`,
        name,
        icon,
        count: 5
      });
    }
    this.playHarvestChime();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G40-ADD-HARVEST',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Harvested: ${name} to MBG basket`
    });
  }

  public addStampBadge(badgeName: string) {
    if (!this.stampedBadges.includes(badgeName)) {
      this.stampedBadges = [...this.stampedBadges, badgeName];
      this.playStampSound();
      this.notify();

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G40-ADD-BADGE',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Earned garden harvest badge: ${badgeName}`
      });
    }
  }

  /**
   * P7: Full Garden Simulation
   */
  public startFullKebunSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingKebun = true;
    const phases: KebunPhase[] = [
      'GATE_KEBUN',
      'PLANTING',
      'WATERING',
      'HARVEST_20S',
      'GARDEN_FRIENDS',
      'HARVEST_BOOK'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingKebun = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5000);
  }

  public stopFullKebunSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingKebun = false;
    this.notify();
  }

  public getSnapshot(): KebunSnapshot {
    return {
      currentPhase: this.currentPhase,
      activePlant: this.activePlant,
      waterLevel: this.waterLevel,
      hasRainbow: this.hasRainbow,
      isHarvesting: this.isHarvesting,
      harvestProgressSeconds: this.harvestProgressSeconds,
      harvestedBaskets: [...this.harvestedBaskets],
      stampedBadges: [...this.stampedBadges],
      activeFriend: this.activeFriend,
      isAutoPlayingKebun: this.isAutoPlayingKebun
    };
  }
}

export const kebunAjaibEngine = new KebunAjaibEngine();
export default kebunAjaibEngine;
