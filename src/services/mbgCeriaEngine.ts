/**
 * TADE SPRINT G31 — MBG CERIA ASY & SYIFA ENGINE
 * Living Routine of Makan Bergizi Gratis (MBG) for TK Islam Asy-Syifa.
 * 
 * Features:
 * - P1: Bus MBG Ceria Datang (Bus putih-hijau tersenyum tiba di gerbang, klakson "Tuut... Tuut...", Asy melambai, Syifa bersyukur)
 * - P2: Petugas MBG Ramah (Seragam hijau-putih rapi khas TADE, salam "Assalamu'alaikum", mengantarkan kotak makan higienis)
 * - P3: Antri Ceria (Barisan rapi beradab, Asy & Dodo memandu ketertiban antre tanpa berebut)
 * - P4: Doa Sebelum Makan (Duduk bersila bersama, doa makan Arab, Latin, Terjemahan, buku doa kecil membuka)
 * - P5: Makan Bersama (Animasi santun ditemani Bubu, Gogo, Mimi, Dodo, Titi, Rara; pesan gizi: jangan mubazir, makan sayur, minum air)
 * - P6: Selesai Makan (Doa sesudah makan, kotak ditutup rapi, pilah buang sampah, apresiasi kebersihan Dodo)
 * - P7: Founder MBG Control (Simulasi kedatangan bus, uji klakson Web Audio, uji doa makan, monitor performa Dr. Pulse 60 FPS, audit Black Box)
 * - Bonus: Kupu-kupu mengantar bus, balon hijau-putih, burung kecil di pagar gerbang, dedaunan bergoyang
 * 
 * Integrations:
 * - Sekolah Bernapas G29, Living Time Engine, Living Event Engine, DNA G20, Kamera G21, Animation Governor, Black Box
 * - Marker: G31_MBG_CERIA_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type MbgPhase = 
  | 'BUS_ARRIVING'     // P1: Bus datang ke gerbang
  | 'STAFF_GREETING'   // P2: Petugas menyapa dan menyerahkan kotak
  | 'QUEUE_ORDERLY'    // P3: Santri antri dengan sabar
  | 'PRAYER_BEFORE'    // P4: Doa sebelum makan
  | 'EATING_TOGETHER'  // P5: Makan bersama & pesan gizi sahabat
  | 'PRAYER_AFTER';    // P6: Doa sesudah makan & buang sampah rapi

export interface NutritionMenu {
  id: string;
  dayName: string;
  mainDish: string;
  vegetable: string;
  fruit: string;
  drink: string;
  caloricKcal: number;
  nutritionTag: string;
  halalCertified: boolean;
}

export interface SahabatCompanionTip {
  companion: 'BUBU' | 'GOGO' | 'MIMI' | 'DODO' | 'TITI' | 'RARA';
  name: string;
  emoji: string;
  tip: string;
}

class MbgCeriaEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: MbgPhase = 'BUS_ARRIVING';
  private busHornActive: boolean = false;
  private isAutoPlayingRoutine: boolean = false;
  private autoPlayTimer: any = null;
  private selectedDay: string = 'SENIN';
  private listeners: Set<() => void> = new Set();

  // Menu Harian Bergizi Seimbang
  private weeklyMenu: Record<string, NutritionMenu> = {
    SENIN: {
      id: 'mbg-mon',
      dayName: 'Senin Berkah',
      mainDish: 'Nasi Pulen & Ayam Panggang Madu Suwir',
      vegetable: 'Sup Jagung Wortel Manis',
      fruit: 'Potongan Pepaya California Segar',
      drink: 'Air Mineral Alami & Susu UHT Rendah Gula',
      caloricKcal: 480,
      nutritionTag: 'Tinggi Protein & Vitamin A',
      halalCertified: true
    },
    SELASA: {
      id: 'mbg-tue',
      dayName: 'Selasa Ceria',
      mainDish: 'Nasi Kuning Kunyit & Telur Puyuh Semur',
      vegetable: 'Tumis Buncis & Wortel Dadu',
      fruit: 'Pisang Barangan Manis',
      drink: 'Air Mineral Pegunungan',
      caloricKcal: 460,
      nutritionTag: 'Zat Besi & Serat Alami',
      halalCertified: true
    },
    RABU: {
      id: 'mbg-wed',
      dayName: 'Rabu Sehat',
      mainDish: 'Nasi Merah Organik & Ikan Tenggiri Kukus',
      vegetable: 'Sayur Bening Bayam Labu Siam',
      fruit: 'Semangka Merah Tanpa Biji',
      drink: 'Air Mineral & Jus Jeruk Alami',
      caloricKcal: 490,
      nutritionTag: 'Omega 3 & Kalsium',
      halalCertified: true
    },
    KAMIS: {
      id: 'mbg-thu',
      dayName: 'Kamis Gemilang',
      mainDish: 'Nasi Uduk Gurih & Tahu Tempe Bacem Gurih',
      vegetable: 'Capcay Sayur Warna-Warni',
      fruit: 'Melon Hijau Manis',
      drink: 'Air Mineral Dingin Alami',
      caloricKcal: 450,
      nutritionTag: 'Protein Nabati Seimbang',
      halalCertified: true
    },
    JUMAT: {
      id: 'mbg-fri',
      dayName: 'Jumat Berbagi',
      mainDish: 'Nasi Wangi Pandan & Rolade Daging Sapi Halal',
      vegetable: 'Sup Brokoli & Kembang Kol',
      fruit: 'Apel Malang Renyah',
      drink: 'Air Mineral & Madu Alami',
      caloricKcal: 510,
      nutritionTag: 'Energi & Daya Tahan Tubuh',
      halalCertified: true
    }
  };

  // Pesan Gizi dari Sahabat Asy-Syifa
  private companionTips: SahabatCompanionTip[] = [
    { companion: 'BUBU', name: 'Bubu si Pipit', emoji: '🐥', tip: '“Cuit cuit! Habiskan nasinya ya, jangan ada butir yang mubazir!”' },
    { companion: 'GOGO', name: 'Gogo si Kelinci', emoji: '🐰', tip: '“Makan sayur wortel dan bayam bikin mata bening dan tubuh lincah!”' },
    { companion: 'MIMI', name: 'Mimi si Kucing', emoji: '🐱', tip: '“Minum air putih dengan tangan kanan dan posisi duduk santun.”' },
    { companion: 'DODO', name: 'Dodo si Beruang', emoji: '🐻', tip: '“Hebat, antre rapi dan buang sampah kotak makan pada tempatnya!”' },
    { companion: 'TITI', name: 'Titi si Kura-kura', emoji: '🐢', tip: '“Kunyah makanan perlahan-lahan ya, supaya perut nyaman dan bersyukur.”' },
    { companion: 'RARA', name: 'Rara si Rusa', emoji: '🦌', tip: '“Berbagi senyum dan doa bersama teman-teman membuat makanan makin berkah.”' }
  ];

  constructor() {
    // Initial setup
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error in MbgCeriaEngine subscriber', err);
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
   * P1: Friendly Bus Horn "Tuut... Tuut..."
   */
  public playBusHornSound() {
    this.busHornActive = true;
    this.notify();

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Two warm harmonious cartoon horn honks
      [0, 0.28].forEach((offset) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';

        // F and A (warm major third chord horn sound)
        osc1.frequency.setValueAtTime(349.23, now + offset); // F4
        osc2.frequency.setValueAtTime(440.0, now + offset);  // A4

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.18, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + offset);
        osc2.start(now + offset);
        osc1.stop(now + offset + 0.22);
        osc2.stop(now + offset + 0.22);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G31-MBG-HORN',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Bus MBG Ceria horn sounded: Tuut... Tuut...'
      });

      setTimeout(() => {
        this.busHornActive = false;
        this.notify();
      }, 1000);
    } catch {
      this.busHornActive = false;
    }
  }

  /**
   * Chime for Meal Prayers (P4 & P6)
   */
  public playPrayerChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);

        gain.gain.setValueAtTime(0.001, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.14, now + i * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.4);
      });
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: MbgPhase) {
    this.currentPhase = phase;
    if (phase === 'BUS_ARRIVING') {
      this.playBusHornSound();
    } else if (phase === 'PRAYER_BEFORE' || phase === 'PRAYER_AFTER') {
      this.playPrayerChime();
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G31-MBG-PHASE',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `MBG Ceria transitioned to phase: ${phase}`
    });
  }

  public setSelectedDay(day: string) {
    this.selectedDay = day;
    this.notify();
  }

  /**
   * P7: Automated MBG Full Story Routine Simulation
   */
  public startFullRoutineSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.isAutoPlayingRoutine = true;
    const phases: MbgPhase[] = [
      'BUS_ARRIVING',
      'STAFF_GREETING',
      'QUEUE_ORDERLY',
      'PRAYER_BEFORE',
      'EATING_TOGETHER',
      'PRAYER_AFTER'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingRoutine = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 4500);
  }

  public stopFullRoutineSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingRoutine = false;
    this.notify();
  }

  public getSnapshot() {
    return {
      currentPhase: this.currentPhase,
      busHornActive: this.busHornActive,
      isAutoPlayingRoutine: this.isAutoPlayingRoutine,
      selectedDay: this.selectedDay,
      currentMenu: this.weeklyMenu[this.selectedDay] || this.weeklyMenu.SENIN,
      weeklyMenu: { ...this.weeklyMenu },
      companionTips: [...this.companionTips]
    };
  }
}

export const mbgCeriaEngine = new MbgCeriaEngine();
export default mbgCeriaEngine;
