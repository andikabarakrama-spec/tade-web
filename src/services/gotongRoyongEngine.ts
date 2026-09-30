/**
 * TADE SPRINT G42 — KAMPUNG GOTONG ROYONG & HARI BAKTI CERIA ENGINE
 * Community Collaboration, School Cleaning, Joint Gardening, Shared Harvest Delivery, Sharing Market, & Living Tree of Unity
 * 
 * Features:
 * - P1: Pagi Gotong Royong Ceria (Dek Asy, Mbak Syifa, Bubu, Gogo, Mimi, Dodo, Titi, Rara dengan peralatan kerja bakti)
 * - P2: Membersihkan Halaman Sekolah (Gerbang, Taman, Jalur Masjid, Halaman Kelas, Area MBG)
 * - P3: Gotong Royong di Kebun Berkah (Gemburkan tanah, siram bersama, pupuk organik, panen mini, bawa ke MBG)
 * - P4: Kerja Sama Membawa Hasil Panen (Keranjang dipikul bersama rute Kebun -> MBG -> Masjid -> Halaman Sekolah)
 * - P5: Pasar Berbagi Ceria (Meja berbagi buah, sayur, buku, bunga + adab: Tolong, Terima Kasih, Alhamdulillah)
 * - P6: Pohon Gotong Royong (Pohon hidup bertambah daun, pita, bunga + pesan "Kerja sama membuat hati bahagia")
 * - P7: Founder Gotong Royong Cockpit (Simulasi pagi, bersih sekolah, panen, berbagi, sore, Dr. Pulse, Governor, Ring-0)
 * - Bonus 1: Kereta Gotong Royong (Klakson Tuut... Tuut... Web Audio Synthesizer)
 * - Bonus 2: Parade Kerja Sama 20 Detik (Dek Asy -> Mbak Syifa -> Bubu -> Gogo -> Mimi -> Dodo -> Titi -> Rara -> Kereta, Bus MBG, Trem)
 * - Bonus 3: Langit Gotong Royong (Pagi: burung balon, Siang: awan putih, Sore: sinar emas, Malam: bintang bentuk hati)
 * 
 * Marker: G42_KAMPUNG_GOTONG_ROYONG_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';

export type GotongRoyongPhase =
  | 'PAGI_CERIA'    // P1: Pagi Gotong Royong Ceria
  | 'BERSIH_SEKOLAH'// P2: Membersihkan Halaman Sekolah
  | 'KEBUN_BERSAMA' // P3: Gotong Royong di Kebun Berkah
  | 'PIKUL_PANEN'   // P4: Kerja Sama Membawa Hasil Panen
  | 'PASAR_BERBAGI' // P5: Pasar Berbagi Ceria
  | 'POHON_PERSATUAN'// P6: Pohon Gotong Royong
  | 'PARADE_KERJASAMA'; // Bonus 2: Parade Kerja Sama 20 Detik

export type SkyMode = 'PAGI' | 'SIANG' | 'SORE' | 'MALAM_HATI';

export interface CharacterTask {
  id: string;
  name: string;
  avatar: string;
  tool: string;
  taskDescription: string;
  dialog: string;
  actionAudioKey: 'sweep' | 'water' | 'basket' | 'flower' | 'pond' | 'shovel' | 'leaf';
}

export interface CleanZone {
  id: string;
  name: string;
  icon: string;
  action: string;
  progressPercent: number;
  statusText: string;
}

export interface SharingTable {
  id: string;
  category: string;
  icon: string;
  itemNames: string[];
  virtuePhrase: string;
  etiquette: string;
}

export interface GotongRoyongSnapshot {
  currentPhase: GotongRoyongPhase;
  skyMode: SkyMode;
  treeLeavesCount: number;
  treeRibbonsCount: number;
  treeFlowersCount: number;
  isParadeActive: boolean;
  paradeSeconds: number;
  cleanZones: CleanZone[];
  activeCharacterId: string;
  isTrainMoving: boolean;
  lastAdabSpoken: string;
  isAutoSimulating: boolean;
}

class GotongRoyongEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: GotongRoyongPhase = 'PAGI_CERIA';
  private skyMode: SkyMode = 'PAGI';
  private treeLeavesCount: number = 24;
  private treeRibbonsCount: number = 8;
  private treeFlowersCount: number = 12;
  private isParadeActive: boolean = false;
  private paradeSeconds: number = 0;
  private paradeTimer: any = null;
  private activeCharacterId: string = 'asy';
  private isTrainMoving: boolean = true;
  private lastAdabSpoken: string = '“Assalamu’alaikum, ayo kita menjaga sekolah bersama.”';
  private isAutoSimulating: boolean = false;
  private simulationTimer: any = null;

  private cleanZones: CleanZone[] = [
    { id: 'GERBANG', name: 'Gerbang Utama Sekolah', icon: '⛩️🌿', action: 'Menyapu daun & merapikan pot bunga', progressPercent: 100, statusText: 'Bersih & Wangi' },
    { id: 'TAMAN', name: 'Taman Bunga Asy & Syifa', icon: '🌸🦋', action: 'Menyiram bunga & memungut ranting kering', progressPercent: 100, statusText: 'Segar & Berseri' },
    { id: 'JALUR_MASJID', name: 'Jalur Menuju Masjid Al-Barakah', icon: '🛣️🕌', action: 'Membersihkan paving & lampu taman', progressPercent: 100, statusText: 'Berkilau Indah' },
    { id: 'HALAMAN_KELAS', name: 'Halaman Kelas Ceria', icon: '🏫🪑', action: 'Membersihkan bangku & merapikan rak sandal', progressPercent: 100, statusText: 'Tertib & Rapi' },
    { id: 'AREA_MBG', name: 'Area Dapur MBG Sehat', icon: '🍱💧', action: 'Mengelap meja makan & cuci tempat makan', progressPercent: 100, statusText: 'Higienis 100%' }
  ];

  public readonly characters: Record<string, CharacterTask> = {
    asy: {
      id: 'asy',
      name: 'Dek Asy 👦🏻',
      avatar: '👦🏻',
      tool: '🧹 Sapu Lidi Ceria',
      taskDescription: 'Menyapu halaman sekolah dengan penuh semangat dan senyuman ramah.',
      dialog: '“Assalamu’alaikum, bismillah halaman sekolah jadi bersih dan nyaman!”',
      actionAudioKey: 'sweep'
    },
    syifa: {
      id: 'syifa',
      name: 'Mbak Syifa 👧🏻',
      avatar: '👧🏻',
      tool: '🚿 Gembor Penyiram Air',
      taskDescription: 'Menyiram tanaman melati dan bunga matahari agar mekar indah berseri.',
      dialog: '“Segarnya bunga-bunga disiram air bersih, Subhanallah!”',
      actionAudioKey: 'water'
    },
    bubu: {
      id: 'bubu',
      name: 'Bubu si Burung 🐦',
      avatar: '🐦',
      tool: '🍃 Daun Penghias',
      taskDescription: 'Membantu mengambil ranting kecil dan menebar benih bunga di taman.',
      dialog: '“Cuit cuit! Halaman bersih membuat semua burung bersuka ria!”',
      actionAudioKey: 'leaf'
    },
    gogo: {
      id: 'gogo',
      name: 'Gogo si Beruang Mini 🐻',
      avatar: '🐻',
      tool: '🧺 Keranjang Panen Besar',
      taskDescription: 'Mengangkat keranjang sayur bayam dan wortel untuk dibawa ke Dapur MBG.',
      dialog: '“Gogo kuat bantu angkat keranjang sayur segar, Alhamdulillah!”',
      actionAudioKey: 'basket'
    },
    mimi: {
      id: 'mimi',
      name: 'Mimi si Kelinci 🐰',
      avatar: '🐰',
      tool: '🌷 Bunga Melati Wangi',
      taskDescription: 'Menata pot-pot bunga di sepanjang jalan dan merapikan rerumputan.',
      dialog: '“Lompat ceria sambil menata bunga warna-warni!”',
      actionAudioKey: 'flower'
    },
    dodo: {
      id: 'dodo',
      name: 'Dodo si Kura-kura 🐢',
      avatar: '🐢',
      tool: '💧 Pengawas Kolam Bersih',
      taskDescription: 'Mengawasi kolam ikan koi dan memastikan tidak ada sampah di saluran air.',
      dialog: '“Air jernih, ikan senang, semua sahabat hidup tenang.”',
      actionAudioKey: 'pond'
    },
    titi: {
      id: 'titi',
      name: 'Titi si Burung Pipit 🐤',
      avatar: '🐤',
      tool: '⛏️ Sekop Mini Tanah',
      taskDescription: 'Membantu menggemburkan tanah di Kebun Berkah agar tanaman makin subur.',
      dialog: '“Tanah gembur siap tumbuh sayuran kaya vitamin!”',
      actionAudioKey: 'shovel'
    },
    rara: {
      id: 'rara',
      name: 'Rara si Tupai Cerdas 🐿️',
      avatar: '🐿️',
      tool: '🍂 Pengumpul Daun',
      taskDescription: 'Mengumpulkan dedaunan kering untuk diolah menjadi pupuk kompos organik.',
      dialog: '“Daun kering kita kumpulkan jadi pupuk alami yang ramah lingkungan!”',
      actionAudioKey: 'leaf'
    }
  };

  public readonly sharingTables: SharingTable[] = [
    {
      id: 'BUAH',
      category: 'Meja Berbagi Buah Segar',
      icon: '🍎🍌🍇',
      itemNames: ['Pisang Manis', 'Apel Merah', 'Jeruk Segar', 'Pepaya Madu'],
      virtuePhrase: '“Berbagi buah kaya serat membuat tubuh teman sehat dan bugar.”',
      etiquette: 'Mengucapkan “Bismillah, silakan dicicipi ya teman!”'
    },
    {
      id: 'SAYUR',
      category: 'Meja Berbagi Sayuran Berkah',
      icon: '🥬🥕🍅',
      itemNames: ['Bayam Hijau', 'Wortel Renyah', 'Tomat Segar', 'Kangkung Kebun'],
      virtuePhrase: '“Hasil panen Kebun Berkah dinikmati bersama seluruh warga sekolah.”',
      etiquette: 'Mengucapkan “Alhamdulillah atas rezeki sayuran halal & sehat!”'
    },
    {
      id: 'BUKU',
      category: 'Meja Berbagi Buku Cerita & Doa',
      icon: '📚✨',
      itemNames: ['Kisah Nabi & Sahabat', 'Adab Anak Shalih', 'Doa Harian', 'Buku Mewarnai'],
      virtuePhrase: '“Membaca bersama membuka jendela ilmu dan kebaikan dunia akhirat.”',
      etiquette: 'Mengucapkan “Tolong dipinjamkan ya, dan terima kasih sudah berbagi!”'
    },
    {
      id: 'BUNGA',
      category: 'Meja Berbagi Bunga & Sedekah Senyum',
      icon: '💐🌻',
      itemNames: ['Melati Putih', 'Bunga Matahari', 'Mawar Harum', 'Kartu Doa Sahabat'],
      virtuePhrase: '“Senyum manis dan bunga harum menebar kebahagiaan di hati sahabat.”',
      etiquette: 'Tersenyum ramah dan menyapa dengan salam santun.'
    }
  ];

  private listeners: Set<() => void> = new Set();

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
        console.error('Error in GotongRoyongEngine subscriber', err);
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
   * Sound: Train Whistle "Tuut... Tuut..." (Bonus 1)
   */
  public playTrainWhistle() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Two-tone cheerful whistle (F5 & A5 harmonized)
      [0, 0.35].forEach((offset) => {
        [698.46, 880.0].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + offset);

          gain.gain.setValueAtTime(0.001, now + offset);
          gain.gain.linearRampToValueAtTime(0.12, now + offset + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.28);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.28);
        });
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Sweeping / Broom Soft Swish (P2)
   */
  public playSweepSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      [350, 480, 290].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + idx * 0.09 + 0.15);

        gain.gain.setValueAtTime(0.001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.18);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Tree Leaf & Blossom Bloom Bell (P6)
   */
  public playTreeBloomSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Pentatonic sparkle (C5, E5, G5, A5, C6)
      [523.25, 659.25, 783.99, 880.0, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Cheerful Share Chime (P5)
   */
  public playShareChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      [587.33, 739.99, 880.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.6);
      });
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: GotongRoyongPhase) {
    this.currentPhase = phase;
    if (phase === 'PAGI_CERIA') {
      this.playSweepSound();
      this.setSkyMode('PAGI');
    } else if (phase === 'BERSIH_SEKOLAH') {
      this.playSweepSound();
      this.setSkyMode('SIANG');
    } else if (phase === 'KEBUN_BERSAMA' || phase === 'PIKUL_PANEN') {
      this.playShareChime();
      this.setSkyMode('SIANG');
    } else if (phase === 'PASAR_BERBAGI') {
      this.playShareChime();
      this.setSkyMode('SORE');
    } else if (phase === 'POHON_PERSATUAN') {
      this.playTreeBloomSound();
      this.setSkyMode('MALAM_HATI');
    } else if (phase === 'PARADE_KERJASAMA') {
      this.startParade(20);
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G42-PHASE-NAV',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Kampung Gotong Royong navigated to phase: ${phase}`
    });
  }

  public setSkyMode(mode: SkyMode) {
    this.skyMode = mode;
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G42-SKY-MODE',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Living Sky changed to: ${mode}`
    });
  }

  public selectCharacter(charId: string) {
    if (this.characters[charId]) {
      this.activeCharacterId = charId;
      const char = this.characters[charId];
      this.lastAdabSpoken = char.dialog;
      if (char.actionAudioKey === 'sweep') this.playSweepSound();
      else if (char.actionAudioKey === 'water' || char.actionAudioKey === 'pond') this.playTreeBloomSound();
      else this.playShareChime();
      this.notify();

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G42-CHAR-SELECT',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Selected active gotong royong character: ${char.name}`
      });
    }
  }

  public touchGotongRoyongTree() {
    this.treeLeavesCount += 2;
    this.treeRibbonsCount += 1;
    this.treeFlowersCount += 1;
    this.lastAdabSpoken = '“Kerja sama membuat hati bahagia! Pohon Gotong Royong makin lebat penuh berkah.”';
    this.playTreeBloomSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G42-TREE-TOUCH',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Pohon Gotong Royong touched, leaves count now: ${this.treeLeavesCount}`
    });
  }

  public speakAdab(phraseType: 'TOLONG' | 'TERIMA_KASIH' | 'ALHAMDULILLAH') {
    if (phraseType === 'TOLONG') {
      this.lastAdabSpoken = '“Tolong bantu saya ya sahabat, agar pekerjaan cepat selesai dengan gembira.”';
    } else if (phraseType === 'TERIMA_KASIH') {
      this.lastAdabSpoken = '“Jazakallahu khair / Terima kasih banyak atas bantuan dan kebaikan hatimu!”';
    } else {
      this.lastAdabSpoken = '“Alhamdulillah, sekolah kita bersih, asri, dan penuh kerukunan sahabat.”';
    }
    this.playShareChime();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G42-SPEAK-ADAB',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Adab phrase spoken: ${phraseType}`
    });
  }

  public toggleTrainMoving() {
    this.isTrainMoving = !this.isTrainMoving;
    this.playTrainWhistle();
    this.notify();
  }

  public startParade(durationSeconds: number = 20) {
    if (this.paradeTimer) {
      clearInterval(this.paradeTimer);
    }
    this.isParadeActive = true;
    this.paradeSeconds = 0;
    this.playTrainWhistle();
    this.notify();

    this.paradeTimer = setInterval(() => {
      this.paradeSeconds += 1;
      if (this.paradeSeconds >= durationSeconds) {
        clearInterval(this.paradeTimer);
        this.isParadeActive = false;
        this.paradeSeconds = durationSeconds;
        this.playShareChime();
        this.notify();
      } else {
        if (this.paradeSeconds % 5 === 0) {
          this.playTrainWhistle();
        }
        this.notify();
      }
    }, 1000);

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G42-PARADE-START',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Parade Kerja Sama 20s started`
    });
  }

  public stopParade() {
    if (this.paradeTimer) {
      clearInterval(this.paradeTimer);
    }
    this.isParadeActive = false;
    this.notify();
  }

  public startAutoSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
    }
    this.isAutoSimulating = true;
    const phases: GotongRoyongPhase[] = [
      'PAGI_CERIA',
      'BERSIH_SEKOLAH',
      'KEBUN_BERSAMA',
      'PIKUL_PANEN',
      'PASAR_BERBAGI',
      'POHON_PERSATUAN',
      'PARADE_KERJASAMA'
    ];
    let idx = 0;

    this.simulationTimer = setInterval(() => {
      idx += 1;
      if (idx >= phases.length) {
        clearInterval(this.simulationTimer);
        this.isAutoSimulating = false;
        this.notify();
      } else {
        this.setPhase(phases[idx]);
      }
    }, 4500);
  }

  public stopAutoSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
    }
    this.isAutoSimulating = false;
    this.notify();
  }

  public getSnapshot(): GotongRoyongSnapshot {
    return {
      currentPhase: this.currentPhase,
      skyMode: this.skyMode,
      treeLeavesCount: this.treeLeavesCount,
      treeRibbonsCount: this.treeRibbonsCount,
      treeFlowersCount: this.treeFlowersCount,
      isParadeActive: this.isParadeActive,
      paradeSeconds: this.paradeSeconds,
      cleanZones: [...this.cleanZones],
      activeCharacterId: this.activeCharacterId,
      isTrainMoving: this.isTrainMoving,
      lastAdabSpoken: this.lastAdabSpoken,
      isAutoSimulating: this.isAutoSimulating
    };
  }
}

export const gotongRoyongEngine = new GotongRoyongEngine();
export default gotongRoyongEngine;
