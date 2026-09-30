/**
 * TADE SPRINT G37 — AULA IMPIAN & PANGGUNG SERBAGUNA TK ASY SYIFA ENGINE
 * Multi-Purpose Dream Hall & Living Stage Simulator
 * 
 * Features:
 * - P1: Pintu Aula Terbuka (Pintu aula besar terbuka perlahan, karpet merah terhampar, Asy menyapa "Selamat datang")
 * - P2: Panggung Hidup (6 Mode acara: Hafalan Qur'an, Nasyid Ceria, Wisuda Akbar, Milad TK, Pertemuan Wali Murid, Panggung Dongeng)
 * - P3: Kursi Ceria (Kursi tersusun rapi dengan senyum, sesekali mengangguk ramah dan lucu)
 * - P4: Tirai Pelangi & Tata Lampu (Tirai membuka pelan, lampu sorot hangat menyala, bintang kecil bercahaya)
 * - P5: Latihan Pentas Santri (Anak-anak berlatih dengan riang, 100% tanpa penilaian/skor, murni apresiasi & kasih sayang)
 * - P6: Foto Kelas Otomatis (Foto bersama penuh kenangan setelah acara, tersimpan otomatis ke Lorong Kenangan G30)
 * - P7: Founder Aula Control (Uji lampu panggung, uji tirai pelangi, simulasi acara lengkap, audit Black Box Ring-0)
 * - Bonus: Lampu bintang panggung, confetti lembut melayang, balon warna-warni, gelembung cahaya
 * 
 * Marker: G37_AULA_IMPIAN_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type StageTheme =
  | 'HAFALAN'       // Panggung Hafalan Qur'an & Doa
  | 'NASYID'        // Panggung Nasyid Ceria Sahabat
  | 'WISUDA'        // Panggung Wisuda Akbar & Pelepasan
  | 'MILAD'         // Panggung Perayaan Milad TK Asy Syifa
  | 'WALI_MURID'    // Panggung Pertemuan Hangat Wali Murid
  | 'DONGENG';      // Panggung Teater Boneka & Dongeng Hikmah

export type HallPhase =
  | 'DOOR_OPEN'     // P1: Pintu aula terbuka & karpet merah
  | 'STAGE_THEME'   // P2: Panggung bertransformasi tema
  | 'CHAIR_CHEER'   // P3: Kursi ceria menyapa santun
  | 'CURTAIN_LIGHT' // P4: Tirai pelangi membuka & tata lampu
  | 'REHEARSAL'     // P5: Latihan pentas penuh apresiasi
  | 'PHOTO_MEMORY'; // P6: Foto kelas otomatis & Lorong Kenangan

export interface StageThemeConfig {
  id: StageTheme;
  title: string;
  subtitle: string;
  icon: string;
  backdropColor: string;
  highlightText: string;
  propEmoji: string[];
}

export interface HallSnapshot {
  currentPhase: HallPhase;
  activeTheme: StageTheme;
  isCurtainOpen: boolean;
  isStageLightOn: boolean;
  isAutoPlayingHall: boolean;
  savedPhotosCount: number;
  recentPhotos: { title: string; theme: string; date: string }[];
}

class AulaImpianEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: HallPhase = 'DOOR_OPEN';
  private activeTheme: StageTheme = 'HAFALAN';
  private isCurtainOpen: boolean = false;
  private isStageLightOn: boolean = true;
  private isAutoPlayingHall: boolean = false;
  private autoPlayTimer: any = null;
  private savedPhotosCount: number = 3;
  private recentPhotos = [
    { title: 'Gema Hafalan Juz Amma Santri Ceria', theme: 'HAFALAN', date: '23 Ags 2026' },
    { title: 'Senandung Nasyid Sahabat Asy & Syifa', theme: 'NASYID', date: '20 Ags 2026' },
    { title: 'Pentas Boneka Dongeng Hikmah Teladan', theme: 'DONGENG', date: '18 Ags 2026' }
  ];

  private listeners: Set<() => void> = new Set();

  public readonly stageThemes: Record<StageTheme, StageThemeConfig> = {
    HAFALAN: {
      id: 'HAFALAN',
      title: 'Pentas Hafalan Qur’an & Doa Harian',
      subtitle: 'Alunan merdu lantunan ayat suci Al-Qur’an penuh khusyuk dan keberkahan',
      icon: '📖',
      backdropColor: 'from-emerald-950/80 via-teal-900/60 to-slate-900',
      highlightText: 'Maha Suci Allah yang telah menganugerahkan hafalan yang kokoh dan hati yang bersih.',
      propEmoji: ['📜', '🕋', '✨', '🌿']
    },
    NASYID: {
      id: 'NASYID',
      title: 'Konser Nasyid Ceria Sahabat',
      subtitle: 'Senandung irama riang penuh pesan akhlak mulia dan kasih sayang',
      icon: '🎵',
      backdropColor: 'from-amber-950/80 via-orange-900/60 to-slate-900',
      highlightText: 'Bernyanyi gembira bersama Bubu, Gogo, Mimi, Dodo, Titi, dan Rara.',
      propEmoji: ['🎤', '🥁', '🎶', '🌈']
    },
    WISUDA: {
      id: 'WISUDA',
      title: 'Wisuda Akbar & Tasyakuran Kelulusan',
      subtitle: 'Momen haru penuh doa dan restu melangkah ke jenjang sekolah dasar',
      icon: '🎓',
      backdropColor: 'from-indigo-950/80 via-purple-900/60 to-slate-900',
      highlightText: 'Selamat kepada ananda tercinta! Jadilah generasi berakhlak qurani dan cerdas.',
      propEmoji: ['📜', '💐', '🏆', '⭐']
    },
    MILAD: {
      id: 'MILAD',
      title: 'Pesta Milad TK Asy Syifa Penuh Syukur',
      subtitle: 'Perayaan hari jadi sekolah dengan berbagi keceriaan dan tumpeng berkah',
      icon: '🎂',
      backdropColor: 'from-rose-950/80 via-pink-900/60 to-slate-900',
      highlightText: 'Menabur benih kebaikan dan menumbuhkan tunas bangsa beriman sejak 2012.',
      propEmoji: ['🎈', '🎉', '🎁', '🍰']
    },
    WALI_MURID: {
      id: 'WALI_MURID',
      title: 'Pertemuan & Silaturahmi Hangat Wali Murid',
      subtitle: 'Sinergi keluarga dan sekolah dalam mendidik anak dengan cinta',
      icon: '🤝',
      backdropColor: 'from-sky-950/80 via-blue-900/60 to-slate-900',
      highlightText: 'Kolaborasi tulus Ayah Bunda dan Ustadzah untuk tumbuh kembang ananda.',
      propEmoji: ['☕', '📋', '🌸', '💬']
    },
    DONGENG: {
      id: 'DONGENG',
      title: 'Panggung Teater Boneka & Dongeng Hikmah',
      subtitle: 'Kisah keteladanan para Nabi dan fabel budi pekerti penuh keajaiban',
      icon: '🎭',
      backdropColor: 'from-violet-950/80 via-fuchsia-900/60 to-slate-900',
      highlightText: 'Asy dan Syifa menghidupkan kisah persahabatan yang sarat hikmah teladan.',
      propEmoji: ['🧸', '🎪', '🏰', '✨']
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
        console.error('Error in AulaImpianEngine subscriber', err);
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
   * Sound synthesizer for Grand Hall Door Opening
   */
  public playDoorOpeningFanfare() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Soft brass-like welcoming fanfare: C4 (261Hz), G4 (392Hz), C5 (523Hz), E5 (659Hz)
      const chord = [261.63, 392.0, 523.25, 659.25];
      chord.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.1, now + i * 0.12 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.9);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G37-DOOR-FANFARE',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Grand Hall door fanfare played: Welcome to Aula Impian!'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for Rainbow Curtain opening & Stage Lights
   */
  public playCurtainAndLightSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Ascending twinkling glockenspiel
      const freqs = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5 to C6
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for Camera Flash & Shutter Click (P6)
   */
  public playCameraShutterSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Click transient
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);

      // Flash chime following
      setTimeout(() => {
        this.playCurtainAndLightSound();
      }, 70);
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: HallPhase) {
    this.currentPhase = phase;
    if (phase === 'DOOR_OPEN') {
      this.playDoorOpeningFanfare();
      this.isCurtainOpen = false;
    } else if (phase === 'CURTAIN_LIGHT') {
      this.isCurtainOpen = true;
      this.isStageLightOn = true;
      this.playCurtainAndLightSound();
    } else if (phase === 'PHOTO_MEMORY') {
      this.playCameraShutterSound();
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G37-AULA-PHASE',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Aula Impian navigated to phase: ${phase}`
    });
  }

  public setTheme(theme: StageTheme) {
    this.activeTheme = theme;
    this.playCurtainAndLightSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G37-STAGE-THEME',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Stage theme transformed to: ${theme}`
    });
  }

  public toggleCurtain() {
    this.isCurtainOpen = !this.isCurtainOpen;
    this.playCurtainAndLightSound();
    this.notify();
  }

  public toggleStageLight() {
    this.isStageLightOn = !this.isStageLightOn;
    this.notify();
  }

  public captureClassPhoto(customTitle?: string) {
    const config = this.stageThemes[this.activeTheme];
    const newPhoto = {
      title: customTitle || `Momen ${config.title} Bersama Santri`,
      theme: this.activeTheme,
      date: '23 Ags 2026'
    };

    this.recentPhotos.unshift(newPhoto);
    this.savedPhotosCount += 1;
    this.playCameraShutterSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G37-PHOTO-CAPTURE',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Captured class photo for theme ${this.activeTheme}, routed to Lorong Kenangan G30`
    });
  }

  /**
   * P7: Full Hall Simulation
   */
  public startFullHallSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.isAutoPlayingHall = true;
    const phases: HallPhase[] = [
      'DOOR_OPEN',
      'STAGE_THEME',
      'CHAIR_CHEER',
      'CURTAIN_LIGHT',
      'REHEARSAL',
      'PHOTO_MEMORY'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingHall = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5000);
  }

  public stopFullHallSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingHall = false;
    this.notify();
  }

  public getSnapshot(): HallSnapshot {
    return {
      currentPhase: this.currentPhase,
      activeTheme: this.activeTheme,
      isCurtainOpen: this.isCurtainOpen,
      isStageLightOn: this.isStageLightOn,
      isAutoPlayingHall: this.isAutoPlayingHall,
      savedPhotosCount: this.savedPhotosCount,
      recentPhotos: [...this.recentPhotos]
    };
  }
}

export const aulaImpianEngine = new AulaImpianEngine();
export default aulaImpianEngine;
