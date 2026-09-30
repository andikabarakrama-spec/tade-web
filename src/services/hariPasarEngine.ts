/**
 * TADE SPRINT G39 — HARI PASAR CERIA & KOPERASI MINI ENGINE
 * Market Day & Cooperative Learning Simulator for Early Childhood (PAUD/TK Asy Syifa)
 * 
 * Features:
 * - P1: Gerbang Pasar Ceria (Gapura warna-warni terbuka, balon melayang, sapaan Asy "Selamat datang di Hari Pasar Ceria.")
 * - P2: Stan Pasar Hidup (6 Stan Kartun: Buah Segar, Sayur Organik, Buku Dongeng, Mainan Kayu, Roti Berkah, Bunga Melati - semua tersenyum)
 * - P3: Koperasi Mini (Kasir ramah, belajar antre teratur, pembiasaan kata santun: "Tolong", "Terima kasih", "Alhamdulillah")
 * - P4: Keranjang Ceria (Keranjang kecil beroda berjalan pelan, buah melambai, sayur tersenyum riang)
 * - P5: Cerita Pasar 20 Detik (Simulasi Asy membeli buah, Syifa membeli buku, teman-teman saling membantu dengan jujur & ceria)
 * - P6: Kartu Belanja Kenangan (Cap kenangan stempel kebaikan tanpa poin & ranking)
 * - P7: Founder Pasar Control (Uji suara pasar, uji antre, simulasi otomatis P1–P6, audit Black Box Ring-0)
 * - Bonus: Burung pipit, kupu-kupu ceria, balon hati mengapung, kereta belanja mini
 * 
 * Marker: G39_PASAR_CERIA_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type PasarPhase =
  | 'GATE_PASAR'       // P1: Gerbang warna-warni & balon
  | 'LIVING_STALLS'    // P2: 6 stan kartun hidup & tersenyum
  | 'KOPERASI_MINI'    // P3: Kasir ramah, antre & kata santun
  | 'KERANJANG_CERIA'  // P4: Keranjang berjalan, buah melambai
  | 'MARKET_STORY'     // P5: Cerita pasar 20s
  | 'SHOPPING_CARD';   // P6: Kartu belanja cap kenangan

export type StallId = 'BUAH' | 'SAYUR' | 'BUKU' | 'MAINAN' | 'ROTI' | 'BUNGA';
export type PoliteWordId = 'TOLONG' | 'TERIMA_KASIH' | 'ALHAMDULILLAH' | 'MAAF' | 'PERMISI';

export interface MarketStall {
  id: StallId;
  name: string;
  category: string;
  emoji: string;
  sellerCharacter: string;
  greeting: string;
  items: Array<{ name: string; icon: string; benefit: string }>;
  accentColor: string;
}

export interface PoliteWord {
  id: PoliteWordId;
  label: string;
  arabicMeaning: string;
  usageContext: string;
  icon: string;
}

export interface PasarSnapshot {
  currentPhase: PasarPhase;
  activeStall: StallId;
  queuePosition: number;
  totalInQueue: number;
  isStoryPlaying: boolean;
  storyProgressSeconds: number;
  basketItems: Array<{ id: string; name: string; icon: string }>;
  stampedBadges: string[];
  activePoliteWord: PoliteWordId | null;
  isAutoPlayingPasar: boolean;
}

class HariPasarEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: PasarPhase = 'GATE_PASAR';
  private activeStall: StallId = 'BUAH';
  private queuePosition: number = 2;
  private totalInQueue: number = 5;
  private isStoryPlaying: boolean = false;
  private storyProgressSeconds: number = 0;
  private storyTimer: any = null;
  private basketItems: Array<{ id: string; name: string; icon: string }> = [
    { id: '1', name: 'Apel Manis Berkah', icon: '🍎' },
    { id: '2', name: 'Buku Doa Ceria', icon: '📚' }
  ];
  private stampedBadges: string[] = ['Sahabat Jujur', 'Budaya Antre Rapi', 'Ucapan Santun'];
  private activePoliteWord: PoliteWordId | null = 'TERIMA_KASIH';
  private isAutoPlayingPasar: boolean = false;
  private autoPlayTimer: any = null;

  private listeners: Set<() => void> = new Set();

  public readonly stalls: Record<StallId, MarketStall> = {
    BUAH: {
      id: 'BUAH',
      name: 'Stan Buah Segar Berkah',
      category: 'Buah-buahan Alami',
      emoji: '🍎',
      sellerCharacter: 'Kak Budi Ramah 👦🏽',
      greeting: '“Mari adik-adik, buah segar manis kaya vitamin untuk kesehatan tubuh kita!”',
      items: [
        { name: 'Apel Merah Renyah', icon: '🍎', benefit: 'Kaya serat & menyegarkan tubuh' },
        { name: 'Pisang Emas Manis', icon: '🍌', benefit: 'Memberikan energi untuk belajar ceria' },
        { name: 'Jeruk Manis Alami', icon: '🍊', benefit: 'Vitamin C penambah daya tahan' }
      ],
      accentColor: 'from-amber-500 to-red-500'
    },
    SAYUR: {
      id: 'SAYUR',
      name: 'Stan Sayur Hijau Ceria',
      category: 'Sayuran Segar Bersih',
      emoji: '🥦',
      sellerCharacter: 'Kak Siti Ceria 👧🏼',
      greeting: '“Sayur hijau segar baru dipetik dari kebun organik TK Asy Syifa, halal dan menyehatkan!”',
      items: [
        { name: 'Bayam Hijau', icon: '🥬', benefit: 'Zat besi untuk tulang kuat' },
        { name: 'Wortel Oranye', icon: '🥕', benefit: 'Vitamin A untuk mata bening' },
        { name: 'Jagung Manis', icon: '🌽', benefit: 'Serat alami pembawa senyum' }
      ],
      accentColor: 'from-emerald-500 to-teal-600'
    },
    BUKU: {
      id: 'BUKU',
      name: 'Stan Buku & Dongeng Hikmah',
      category: 'Buku Anak Edukatif',
      emoji: '📚',
      sellerCharacter: 'Ustadzah Fatimah 🧕🏻',
      greeting: '“Buku adalah jendela kebaikan, mari membaca doa dan kisah teladan bersama!”',
      items: [
        { name: 'Buku Doa Harian', icon: '📖', benefit: 'Meneladani akhlak mulia setiap hari' },
        { name: 'Kisah Sahabat Ceria', icon: '📕', benefit: 'Belajar berbagi dan saling tolong' },
        { name: 'Huruf Hijaiyah Hidup', icon: '📗', benefit: 'Mengenal Al-Qur’an sejak dini' }
      ],
      accentColor: 'from-blue-500 to-indigo-600'
    },
    MAINAN: {
      id: 'MAINAN',
      name: 'Stan Mainan Kayu Edukatif',
      category: 'Mainan Tradisional & Kayu',
      emoji: '🪵',
      sellerCharacter: 'Pak Joko Pengrajin 👴🏼',
      greeting: '“Mainan kayu halus tanpa baterai, melatih kreativitas dan kesabaran anak saleh!”',
      items: [
        { name: 'Balok Kayu Bangunan', icon: '🧱', benefit: 'Melatih motorik & konsentrasi' },
        { name: 'Mobil Kayu Halus', icon: '🚗', benefit: 'Bahan alami aman ramah lingkungan' },
        { name: 'Puzzle Bentuk Hewan', icon: '🧩', benefit: 'Mengenal ciptaan Allah dengan ceria' }
      ],
      accentColor: 'from-amber-600 to-orange-700'
    },
    ROTI: {
      id: 'ROTI',
      name: 'Stan Roti Berkah Kasih',
      category: 'Roti & Kue Sehat',
      emoji: '🍞',
      sellerCharacter: 'Bunda Aisyah 👩🏻',
      greeting: '“Roti gandum lembut hangat wangi pandan, dibuat dengan bahan sehat tanpa pengawet!”',
      items: [
        { name: 'Roti Gandum Madu', icon: '🍞', benefit: 'Kenyang dan penuh berkah kebaikan' },
        { name: 'Bolu Kukus Pelangi', icon: '🧁', benefit: 'Manis alami lembut di lidah' },
        { name: 'Kue Lapis Pandan', icon: '🥞', benefit: 'Aroma wangi daun pandan alami' }
      ],
      accentColor: 'from-yellow-500 to-amber-600'
    },
    BUNGA: {
      id: 'BUNGA',
      name: 'Stan Bunga Melati Harum',
      category: 'Bunga Segar Berseri',
      emoji: '🌸',
      sellerCharacter: 'Kak Meimei Ramah 👧🏻',
      greeting: '“Bunga melati dan mawar mekar semerbak, mengharumkan ruang kelas dan rumah kita!”',
      items: [
        { name: 'Melati Putih Suci', icon: '🌼', benefit: 'Aroma tenang dan menyejukkan hati' },
        { name: 'Mawar Merah Cantik', icon: '🌹', benefit: 'Ungkapan kasih sayang kepada Bunda' },
        { name: 'Bunga Matahari Ceria', icon: '🌻', benefit: 'Menebar senyuman hangat' }
      ],
      accentColor: 'from-rose-400 to-pink-600'
    }
  };

  public readonly politeWords: Record<PoliteWordId, PoliteWord> = {
    TOLONG: {
      id: 'TOLONG',
      label: '“Tolong...”',
      arabicMeaning: 'Ta’awun (Saling Membantu)',
      usageContext: 'Diucapkan dengan santun saat meminta bantuan kasir atau teman.',
      icon: '🤲'
    },
    TERIMA_KASIH: {
      id: 'TERIMA_KASIH',
      label: '“Terima Kasih / Jazakallahu Khair”',
      arabicMeaning: 'Syukur & Apresiasi',
      usageContext: 'Diucapkan dengan tulus saat menerima barang belanjaan atau kebaikan.',
      icon: '🙏'
    },
    ALHAMDULILLAH: {
      id: 'ALHAMDULILLAH',
      label: '“Alhamdulillah”',
      arabicMeaning: 'Segala Puji Bagi Allah',
      usageContext: 'Diucapkan atas rezeki nikmat berbelanja halal dan berkah.',
      icon: '✨'
    },
    MAAF: {
      id: 'MAAF',
      label: '“Maaf...”',
      arabicMeaning: 'Afwan & Kerendahan Hati',
      usageContext: 'Diucapkan jika tidak sengaja bersenggolan atau ingin bertanya pelan.',
      icon: '🤝'
    },
    PERMISI: {
      id: 'PERMISI',
      label: '“Permisi...”',
      arabicMeaning: 'Adab Kesantunan',
      usageContext: 'Diucapkan saat berjalan tertib di lorong pasar atau saat antre.',
      icon: '🚶'
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
        console.error('Error in HariPasarEngine subscriber', err);
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
   * Sound: Market Bell Welcome (P1)
   */
  public playMarketBell() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Bright double market chime
      [659.25, 880.0, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.5);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Cashier Register & Polite Chime (P3)
   */
  public playCashierChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Cash register bell + gentle affirmation
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.exponentialRampToValueAtTime(600, now + 0.08);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.1);

      // Sweet affirmative chime (C6 - G6)
      [1046.5, 1567.98].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + 0.08 + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + 0.08 + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.08 + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + i * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.08 + i * 0.08);
        osc.stop(now + 0.08 + i * 0.08 + 0.4);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Item Placed in Basket (P4)
   */
  public playBasketDropSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
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

      // Soft wooden stamp thud
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(50, now + 0.08);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Star sparkle
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.05); // B5

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

  public setPhase(phase: PasarPhase) {
    this.currentPhase = phase;
    if (phase === 'GATE_PASAR') {
      this.playMarketBell();
    } else if (phase === 'KOPERASI_MINI') {
      this.playCashierChime();
    } else if (phase === 'KERANJANG_CERIA') {
      this.playBasketDropSound();
    } else if (phase === 'MARKET_STORY') {
      this.startMarketStory(20);
    } else if (phase === 'SHOPPING_CARD') {
      this.playStampSound();
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G39-PHASE-NAV',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Hari Pasar Ceria navigated to: ${phase}`
    });
  }

  public selectStall(stallId: StallId) {
    this.activeStall = stallId;
    this.playMarketBell();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G39-SELECT-STALL',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Visited market stall: ${this.stalls[stallId].name}`
    });
  }

  public selectPoliteWord(wordId: PoliteWordId) {
    this.activePoliteWord = wordId;
    this.playCashierChime();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G39-POLITE-WORD',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Practiced polite expression: ${this.politeWords[wordId].label}`
    });
  }

  public advanceQueue() {
    if (this.queuePosition > 1) {
      this.queuePosition -= 1;
    } else {
      this.queuePosition = this.totalInQueue;
    }
    this.playCashierChime();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G39-QUEUE-ADVANCE',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Queue advanced to position: ${this.queuePosition} of ${this.totalInQueue}`
    });
  }

  public addItemToBasket(name: string, icon: string) {
    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      icon
    };
    this.basketItems = [...this.basketItems, newItem];
    this.playBasketDropSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G39-ADD-BASKET',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Item added to basket: ${name}`
    });
  }

  public removeItemFromBasket(id: string) {
    this.basketItems = this.basketItems.filter((item) => item.id !== id);
    this.notify();
  }

  public startMarketStory(durationSeconds: number = 20) {
    if (this.storyTimer) {
      clearInterval(this.storyTimer);
    }
    this.isStoryPlaying = true;
    this.storyProgressSeconds = 0;
    this.playMarketBell();
    this.notify();

    this.storyTimer = setInterval(() => {
      this.storyProgressSeconds += 1;
      if (this.storyProgressSeconds >= durationSeconds) {
        clearInterval(this.storyTimer);
        this.isStoryPlaying = false;
        this.storyProgressSeconds = durationSeconds;
        this.playCashierChime();
        this.notify();
      } else {
        if (this.storyProgressSeconds === 5 || this.storyProgressSeconds === 12) {
          this.playBasketDropSound();
        }
        this.notify();
      }
    }, 1000);
  }

  public stopMarketStory() {
    if (this.storyTimer) {
      clearInterval(this.storyTimer);
    }
    this.isStoryPlaying = false;
    this.notify();
  }

  public addStampBadge(badgeName: string) {
    if (!this.stampedBadges.includes(badgeName)) {
      this.stampedBadges = [...this.stampedBadges, badgeName];
      this.playStampSound();
      this.notify();

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G39-ADD-BADGE',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Earned souvenir stamp: ${badgeName}`
      });
    }
  }

  /**
   * P7: Full Market Simulation
   */
  public startFullPasarSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingPasar = true;
    const phases: PasarPhase[] = [
      'GATE_PASAR',
      'LIVING_STALLS',
      'KOPERASI_MINI',
      'KERANJANG_CERIA',
      'MARKET_STORY',
      'SHOPPING_CARD'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingPasar = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5000);
  }

  public stopFullPasarSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingPasar = false;
    this.notify();
  }

  public getSnapshot(): PasarSnapshot {
    return {
      currentPhase: this.currentPhase,
      activeStall: this.activeStall,
      queuePosition: this.queuePosition,
      totalInQueue: this.totalInQueue,
      isStoryPlaying: this.isStoryPlaying,
      storyProgressSeconds: this.storyProgressSeconds,
      basketItems: [...this.basketItems],
      stampedBadges: [...this.stampedBadges],
      activePoliteWord: this.activePoliteWord,
      isAutoPlayingPasar: this.isAutoPlayingPasar
    };
  }
}

export const hariPasarEngine = new HariPasarEngine();
export default hariPasarEngine;
