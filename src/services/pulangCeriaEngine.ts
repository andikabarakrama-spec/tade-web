/**
 * TADE SPRINT G35 — PULANG CERIA & GERBANG PERPISAHAN TK ASY SYIFA ENGINE
 * Daily School Dismissal & Twilight Episode Farewell Simulator
 * 
 * Features:
 * - P1: Bel Pulang Ceria (Bel berbunyi lembut, pintu kelas terbuka, Ustadzah: "Alhamdulillah, sampai jumpa besok")
 * - P2: Jemput Ayah Bunda (Ayah & Bunda tiba menjemput, anak melangkah pelan, pelukan hangat penuh kasih)
 * - P3: Salim Perpisahan (Santri salim kepada ustadzah, mengucapkan "Assalamu'alaikum", "Sampai besok")
 * - P4: Gerbang Senja (Langit berubah menjadi jingga keemasan, burung terbang pulang ke sarang)
 * - P5: Bintang Pertama (Bintang pertama berpendar di langit senja, Dek Asy berbisik "Alhamdulillah")
 * - P6: Penutup Episode (Semua sahabat melambaikan tangan, kartu penutup "Sampai Jumpa Besok")
 * - P7: Founder Pulang Control (Uji bel pulang, simulasi kepulangan lengkap, uji suasana senja, audit Black Box Ring-0)
 * - Bonus: Mobil jemput melaju pelan, sepeda kecil pulang, layang-layang turun, kunang-kunang bercahaya
 * 
 * Marker: G35_PULANG_CERIA_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type DismissalPhase =
  | 'DISMISSAL_BELL' // P1: Bel pulang berbunyi lembut
  | 'PARENTS_PICKUP' // P2: Ayah & Bunda menjemput & pelukan hangat
  | 'SALIM_FAREWELL' // P3: Salim ustadzah & ucap salam
  | 'TWILIGHT_GATE'  // P4: Gerbang suasana senja & langit jingga
  | 'FIRST_STAR'     // P5: Bintang pertama muncul & ucapan syukur
  | 'EPISODE_OUTRO';  // P6: Lambaian tangan & kartu penutup episode

export interface DismissalSnapshot {
  currentPhase: DismissalPhase;
  isAutoPlayingDismissal: boolean;
  twilightIntensity: number; // 0 (sore cerah) to 100 (senja maghrib)
  starCount: number;
  activeQuote: string;
}

class PulangCeriaEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: DismissalPhase = 'DISMISSAL_BELL';
  private isAutoPlayingDismissal: boolean = false;
  private autoPlayTimer: any = null;
  private twilightIntensity: number = 35;
  private starCount: number = 1;
  private listeners: Set<() => void> = new Set();

  private farewellQuotes: string[] = [
    '“Alhamdulillah atas ilmu dan kebersamaan yang indah hari ini.”',
    '“Sampai jumpa besok pagi dengan senyum dan semangat baru!”',
    '“Hati-hati di jalan ya sayang, sampaikan salam untuk keluarga di rumah.”',
    '“Terima kasih Ustadzah, terima kasih teman-teman!”'
  ];

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
        console.error('Error in PulangCeriaEngine subscriber', err);
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
   * Sound synthesizer for Dismissal Bell (Warm calming chord progression)
   */
  public playDismissalBellSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Soothing pentatonic arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.28);

        gain.gain.setValueAtTime(0.001, now + i * 0.28);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.28 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.28 + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.28);
        osc.stop(now + i * 0.28 + 0.85);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G35-DISMISSAL-BELL',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'School dismissal bell chimed: Teng tong teng tong...'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for twilight calming ambient chime & star twinkle
   */
  public playStarTwinkleSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [1318.51, 1567.98, 2093.0]; // E6, G6, C7
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.5);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for warm closing melody
   */
  public playFarewellMelody() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.3 }, // C5
        { f: 587.33, d: 0.3 }, // D5
        { f: 659.25, d: 0.4 }, // E5
        { f: 783.99, d: 0.6 }  // G5
      ];

      let t = now;
      melody.forEach((m) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(m.f, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + m.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + m.d);
        t += m.d * 0.85;
      });
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: DismissalPhase) {
    this.currentPhase = phase;
    if (phase === 'DISMISSAL_BELL') {
      this.playDismissalBellSound();
      this.twilightIntensity = 25;
    } else if (phase === 'PARENTS_PICKUP' || phase === 'SALIM_FAREWELL') {
      this.twilightIntensity = 45;
    } else if (phase === 'TWILIGHT_GATE') {
      this.twilightIntensity = 70;
      this.playFarewellMelody();
    } else if (phase === 'FIRST_STAR') {
      this.twilightIntensity = 90;
      this.playStarTwinkleSound();
      this.starCount = 3;
    } else if (phase === 'EPISODE_OUTRO') {
      this.twilightIntensity = 95;
      this.playFarewellMelody();
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G35-PULANG-PHASE',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Pulang Ceria navigated to phase: ${phase}`
    });
  }

  public setTwilightIntensity(val: number) {
    this.twilightIntensity = Math.min(100, Math.max(0, val));
    this.notify();
  }

  /**
   * P7: Full Dismissal Simulation
   */
  public startFullDismissalSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.isAutoPlayingDismissal = true;
    const phases: DismissalPhase[] = [
      'DISMISSAL_BELL',
      'PARENTS_PICKUP',
      'SALIM_FAREWELL',
      'TWILIGHT_GATE',
      'FIRST_STAR',
      'EPISODE_OUTRO'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingDismissal = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5000);
  }

  public stopFullDismissalSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingDismissal = false;
    this.notify();
  }

  public getSnapshot(): DismissalSnapshot {
    return {
      currentPhase: this.currentPhase,
      isAutoPlayingDismissal: this.isAutoPlayingDismissal,
      twilightIntensity: this.twilightIntensity,
      starCount: this.starCount,
      activeQuote: this.farewellQuotes[Math.floor(Math.random() * this.farewellQuotes.length)]
    };
  }
}

export const pulangCeriaEngine = new PulangCeriaEngine();
export default pulangCeriaEngine;
