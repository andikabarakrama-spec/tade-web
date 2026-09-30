/**
 * TADE SPRINT G33 — KELAS HIDUP & SENTRA CERIA TK ASY SYIFA ENGINE
 * Living PAUD Learning Centers & Classroom Routine Simulator
 * 
 * Features:
 * - P1: Masuk Kelas Ceria (Pintu kelas terbuka pelan, Dek Asy ucap "Bismillah", Mbak Syifa menyambut hangat)
 * - P2: Sentra Balok Hidup (Balok kayu tersenyum, rumah mini terbentuk bertingkat, Farhan membantu menyusun presisi)
 * - P3: Sentra Seni Hidup (Krayon hidup warna-warni, cat air menari lembut, kertas gambar melambai ceria)
 * - P4: Sentra Bahan Alam (Daun, batu kerikil halus, kelopak bunga, biji-bijian jadi media eksplorasi tekstur & sains)
 * - P5: Sentra Bermain Peran (Klinik kecil peduli, Pasar mini jujur, Masjid mini khusyuk, Kantor Pos silaturahmi)
 * - P6: Lingkaran Pagi (Circle Time: Duduk melingkar di karpet pelangi, Doa Belajar, Hafalan pendek, Tepuk Semangat)
 * - P7: Founder Sentra Control (Preview 5 sentra, uji sintesis audio doa & tepukan, simulasi otomatis, audit Black Box)
 * - Bonus: Pensil melompat riang, buku cerita tersenyum, balok bergoyang, kupu-kupu hinggap di kusen jendela
 * 
 * Marker: G33_KELAS_HIDUP_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type SentraPhase =
  | 'ENTRANCE'     // P1: Masuk Kelas Ceria
  | 'BALOK'        // P2: Sentra Balok Hidup
  | 'SENI'         // P3: Sentra Seni Hidup
  | 'BAHAN_ALAM'   // P4: Sentra Bahan Alam
  | 'MAIN_PERAN'   // P5: Sentra Bermain Peran
  | 'CIRCLE_TIME'; // P6: Lingkaran Pagi & Doa Belajar

export interface SentraProfile {
  id: string;
  name: string;
  icon: string;
  color: string;
  guideCharacter: string;
  focusSkill: string;
  description: string;
  learningItems: string[];
}

export type PeranZone = 'KLINIK' | 'PASAR' | 'MASJID' | 'KANTOR_POS';

class KelasHidupEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: SentraPhase = 'ENTRANCE';
  private activePeranZone: PeranZone = 'KLINIK';
  private isAutoPlayingClass: boolean = false;
  private autoPlayTimer: any = null;
  private listeners: Set<() => void> = new Set();

  private sentraProfiles: Record<string, SentraProfile> = {
    BALOK: {
      id: 'BALOK',
      name: 'Sentra Balok & Konstruksi',
      icon: '🧱',
      color: 'from-amber-600 to-amber-800',
      guideCharacter: 'Farhan & Dek Asy',
      focusSkill: 'Spasial, Geometri, Keseimbangan & Kerjasama',
      description: 'Menyusun balok kayu ramah anak menjadi bentuk rumah, jembatan, dan menara kokoh.',
      learningItems: ['Balok Silinder', 'Balok Segitiga Atap', 'Papan Jembatan', 'Karakter Mini Kayu']
    },
    SENI: {
      id: 'SENI',
      name: 'Sentra Seni & Kreativitas',
      icon: '🎨',
      color: 'from-rose-500 to-pink-700',
      guideCharacter: 'Mbak Syifa & Aisyah',
      focusSkill: 'Motorik Halus, Eksplorasi Warna & Daya Cipta',
      description: 'Berekspresi lewat krayon lembut, kuas cat air menari, dan kolase kertas warna bersinar.',
      learningItems: ['Krayon Pastel 12 Warna', 'Kuas Cat Air Menari', 'Kertas Tekstur Daun', 'Palet Warna']
    },
    BAHAN_ALAM: {
      id: 'BAHAN_ALAM',
      name: 'Sentra Bahan Alam & Sains',
      icon: '🌿',
      color: 'from-emerald-600 to-teal-800',
      guideCharacter: 'Dek Asy & Sahabat Dodo',
      focusSkill: 'Sensorik Taktil, Pengenalan Ciptaan Allah & Sains Dasar',
      description: 'Mengeksplorasi ragam daun, batu kerikil halus, kelopak bunga wangi, dan aneka biji-bijian.',
      learningItems: ['Kaca Pembesar Kayu', 'Daun Aneka Bentuk', 'Batu Kerikil Licin', 'Biji Jagung & Kacang']
    },
    MAIN_PERAN: {
      id: 'MAIN_PERAN',
      name: 'Sentra Bermain Peran Makro-Mikro',
      icon: '🎭',
      color: 'from-purple-600 to-indigo-800',
      guideCharacter: 'Dek Asy, Mbak Syifa & Sahabat',
      focusSkill: 'Komunikasi, Empati, Adab Sosial & Kepemimpinan',
      description: 'Simulasi kehidupan nyata di Klinik Ramah, Pasar Sehat, Masjid Khusyuk, dan Kantor Pos Ceria.',
      learningItems: ['Stetoskop Kartun', 'Keranjang Buah Mini', 'Sajadah Kecil', 'Kotak Surat Pos']
    },
    CIRCLE_TIME: {
      id: 'CIRCLE_TIME',
      name: 'Sentra Lingkaran Pagi (Circle Time)',
      icon: '⭕',
      color: 'from-sky-600 to-blue-800',
      guideCharacter: 'Ustadzah Nurul & Semua Santri',
      focusSkill: 'Doa Belajar, Hafalan Al-Qur’an, Nilai Karakter & Tepuk Semangat',
      description: 'Duduk bersama di karpet bundar pelangi, menyatukan niat menuntut ilmu dengan gembira.',
      learningItems: ['Buku Doa Belajar', 'Kartu Hafalan Pendek', 'Rebana Kecil Bernada', 'Bintang Prestasi']
    }
  };

  constructor() {
    // Initialization
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
        console.error('Error in KelasHidupEngine subscriber', err);
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
   * Sound synthesizer for Doa Belajar (Rabbi Zidni 'Ilma)
   */
  public playDoaBelajarChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Gentle peaceful arpeggio: F4, A4, C5, E5, F5
      const notes = [349.23, 440.0, 523.25, 659.25, 698.46];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.5);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G33-DOA-BELAJAR',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Doa Belajar audio chime triggered: Rabbi zidni ilma'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for Tepuk Semangat (Clap rhythm)
   */
  public playTepukSemangatSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // 3 Claps rhythm: prok prok prok - SE! prok prok prok - MA! prok prok prok - NGAT!
      const clapTimes = [0.0, 0.18, 0.36, 0.65, 0.83, 1.01, 1.3, 1.48, 1.66, 1.95];
      clapTimes.forEach((t, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + (i % 3) * 60, now + t);
        osc.frequency.exponentialRampToValueAtTime(150, now + t + 0.05);

        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.linearRampToValueAtTime(0.15, now + t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.08);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G33-TEPUK-SEMANGAT',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Tepuk Semangat rhythm sounded: Se-ma-ngat!'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sentra transition sound
   */
  public playSentraChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.09);

        gain.gain.setValueAtTime(0.001, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.1, now + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.3);
      });
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: SentraPhase) {
    this.currentPhase = phase;
    if (phase === 'CIRCLE_TIME') {
      this.playDoaBelajarChime();
    } else {
      this.playSentraChime();
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G33-SENTRA-PHASE',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Kelas Hidup navigated to Sentra: ${phase}`
    });
  }

  public setPeranZone(zone: PeranZone) {
    this.activePeranZone = zone;
    this.playSentraChime();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G33-PERAN-ZONE',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Sentra Peran selected zone: ${zone}`
    });
  }

  /**
   * P7: Full Sentra Simulator
   */
  public startFullSentraSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.isAutoPlayingClass = true;
    const phases: SentraPhase[] = [
      'ENTRANCE',
      'CIRCLE_TIME',
      'BALOK',
      'SENI',
      'BAHAN_ALAM',
      'MAIN_PERAN'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingClass = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5500);
  }

  public stopFullSentraSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingClass = false;
    this.notify();
  }

  public getSnapshot() {
    return {
      currentPhase: this.currentPhase,
      activePeranZone: this.activePeranZone,
      isAutoPlayingClass: this.isAutoPlayingClass,
      sentraProfiles: { ...this.sentraProfiles }
    };
  }
}

export const kelasHidupEngine = new KelasHidupEngine();
export default kelasHidupEngine;
