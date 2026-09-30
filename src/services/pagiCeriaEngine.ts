/**
 * TADE SPRINT G32 — PAGI CERIA DI TK ASY SYIFA ENGINE
 * Living Morning Courtyard Routine Simulator
 * 
 * Features:
 * - P1: Kedatangan Santri (Santri bergandengan tangan dengan Ayah/Bunda, Dek Asy melambai, Mbak Syifa menyambut, Gerbang terbuka lebar)
 * - P2: Salam Pagi (Guru menyapa "Assalamu'alaikum", anak menjawab "Wa'alaikumussalam", animasi salim takzim pada guru)
 * - P3: Parkir Ceria (Motor orang tua melaju pelan, sepeda kecil anak terparkir rapi di rak kayu, Pak Satpam tersenyum ramah)
 * - P4: Senam Pagi Ceria (Gerakan ringan 20 detik: tepuk tangan, lompat kecil ceria, putar badan lentur, diiringi ritme ceria)
 * - P5: Baris Masuk Kelas (Anak berbaris rapi di selasar, sahabat Dodo memandu ketertiban, bel sekolah bernada merdu berbunyi)
 * - P6: MBG Terhubung (Jadwal MBG aktif, bus MBG datang otomatis setelah rutinitas pagi)
 * - P7: Founder Pagi Control (Uji salam, uji senam 20s, simulasi kedatangan santri, pemantau Dr. Pulse 60 FPS, audit Black Box)
 * - Bonus: Burung beterbangan, layang-layang warna-warni, balon kecil, daun pepohonan bergoyang, kucing lewat santai
 * 
 * Marker: G32_PAGI_CERIA_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type PagiPhase =
  | 'ARRIVAL'       // P1: Kedatangan santri bergandengan
  | 'GREETING_SALIM'// P2: Salam dan salim takzim kepada guru
  | 'PARKING_AREA'  // P3: Parkir ceria sepeda & motor, Pak Satpam ramah
  | 'MORNING_GYM'   // P4: Senam pagi 20 detik (tepuk, lompat, putar)
  | 'LINE_UP'       // P5: Baris masuk kelas & bel sekolah
  | 'MBG_CONNECT';  // P6: MBG Bus terhubung

export interface GymMove {
  id: string;
  name: string;
  emoji: string;
  durationSec: number;
  description: string;
  beneficialEffect: string;
}

class PagiCeriaEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: PagiPhase = 'ARRIVAL';
  private gymTimer: any = null;
  private gymRemainingSec: number = 20;
  private isGymActive: boolean = false;
  private activeMoveIndex: number = 0;
  private isAutoPlayingMorning: boolean = false;
  private autoPlayTimer: any = null;
  private listeners: Set<() => void> = new Set();

  private gymMoves: GymMove[] = [
    {
      id: 'move-tepuk',
      name: 'Tepuk Tangan Ceria',
      emoji: '👏',
      durationSec: 6,
      description: 'Menepuk tangan berirama 1-2-3 sambil tersenyum menyapa mentari.',
      beneficialEffect: 'Melatih motorik halus dan stimulasi fokus otak anak.'
    },
    {
      id: 'move-lompat',
      name: 'Lompat Kecil Semangat',
      emoji: '🦘',
      durationSec: 7,
      description: 'Melompat kecil di tempat dengan kedua tangan di pinggang.',
      beneficialEffect: 'Memperkuat otot kaki, keseimbangan, dan sirkulasi darah segar.'
    },
    {
      id: 'move-putar',
      name: 'Putar Badan Lentur',
      emoji: '🤸🏻',
      durationSec: 7,
      description: 'Memutar pinggang ke kanan dan ke kiri perlahan dengan riang.',
      beneficialEffect: 'Meregangkan otot punggung dan menumbuhkan kelenturan tubuh.'
    }
  ];

  constructor() {
    // Initial state
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
        console.error('Error in PagiCeriaEngine subscriber', err);
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
   * Sound synthesizer for morning school bell (P5)
   */
  public playSchoolBellSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Westminster style 4-tone chime: E5 - G#4 - F#4 - B4
      const notes = [659.25, 415.3, 369.99, 493.88];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.35);

        gain.gain.setValueAtTime(0.001, now + i * 0.35);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.35 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.35 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.35);
        osc.stop(now + i * 0.35 + 0.6);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G32-PAGI-BELL',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'School morning bell sounded: Teng tong teng...'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Greeting / Salim acoustic harp chime (P2)
   */
  public playSalimChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G32-SALIM',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Salim pagi performed: Assalamu’alaikum - Wa’alaikumussalam'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Rhythmic Gym Metronome Sound (P4)
   */
  public playGymBeat() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: PagiPhase) {
    this.currentPhase = phase;
    if (phase === 'GREETING_SALIM') {
      this.playSalimChime();
    } else if (phase === 'LINE_UP') {
      this.playSchoolBellSound();
    } else if (phase === 'MORNING_GYM') {
      this.startGymRoutine();
    } else {
      if (this.gymTimer) {
        clearInterval(this.gymTimer);
        this.isGymActive = false;
      }
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G32-PAGI-PHASE',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Pagi Ceria transitioned to phase: ${phase}`
    });
  }

  /**
   * P4: Start 20-Second Morning Gym Routine
   */
  public startGymRoutine() {
    if (this.gymTimer) {
      clearInterval(this.gymTimer);
    }

    this.gymRemainingSec = 20;
    this.isGymActive = true;
    this.activeMoveIndex = 0;
    this.playGymBeat();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G32-GYM',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Started 20s Morning Gym routine (Tepuk, Lompat, Putar)'
    });

    this.gymTimer = setInterval(() => {
      this.gymRemainingSec -= 1;
      this.playGymBeat();

      if (this.gymRemainingSec > 13) {
        this.activeMoveIndex = 0; // Tepuk
      } else if (this.gymRemainingSec > 6) {
        this.activeMoveIndex = 1; // Lompat
      } else if (this.gymRemainingSec > 0) {
        this.activeMoveIndex = 2; // Putar
      } else {
        clearInterval(this.gymTimer);
        this.isGymActive = false;
        this.gymRemainingSec = 20;
        this.playSalimChime();
      }
      this.notify();
    }, 1000);
  }

  public stopGymRoutine() {
    if (this.gymTimer) {
      clearInterval(this.gymTimer);
    }
    this.isGymActive = false;
    this.gymRemainingSec = 20;
    this.notify();
  }

  /**
   * P7: Full Morning Simulator
   */
  public startFullMorningSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.isAutoPlayingMorning = true;
    const phases: PagiPhase[] = [
      'ARRIVAL',
      'GREETING_SALIM',
      'PARKING_AREA',
      'MORNING_GYM',
      'LINE_UP',
      'MBG_CONNECT'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingMorning = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5000);
  }

  public stopFullMorningSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingMorning = false;
    this.notify();
  }

  public getSnapshot() {
    return {
      currentPhase: this.currentPhase,
      isGymActive: this.isGymActive,
      gymRemainingSec: this.gymRemainingSec,
      activeMoveIndex: this.activeMoveIndex,
      currentGymMove: this.gymMoves[this.activeMoveIndex] || this.gymMoves[0],
      gymMoves: [...this.gymMoves],
      isAutoPlayingMorning: this.isAutoPlayingMorning
    };
  }
}

export const pagiCeriaEngine = new PagiCeriaEngine();
export default pagiCeriaEngine;
