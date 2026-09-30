/**
 * TADE SPRINT G36 — PERPUSTAKAAN AJAIB & KERETA BUKU TK ASY SYIFA ENGINE
 * Magic Living Library & Story Train Simulator
 * 
 * Features:
 * - P1: Pintu Perpustakaan Hidup (Pintu kayu terbuka pelan, buku tersenyum berkata "Selamat datang")
 * - P2: Kereta Buku Keliling (Kereta kayu mini membawa buku keliling sekolah, klakson lembut "Tuut... Tuut...")
 * - P3: Rak Buku Hidup (Buku-buku tersenyum ramah, sesekali membuka halaman menampilkan ilustrasi indah)
 * - P4: Pojok Dongeng (Asy & Syifa membacakan cerita 20 detik penuh hikmah dan keteladanan)
 * - P5: Buku Doa & Kisah (Doa harian, huruf hijaiyah ceria, dan kisah keteladanan para Nabi)
 * - P6: Paspor Membaca Ceria (Cap stempel kenangan membaca tanpa skor & tanpa ranking)
 * - P7: Founder Library Control (Uji kereta buku, uji suara instrumen baca, simulasi dongeng, audit Black Box Ring-0)
 * - Bonus: Burung hantu kecil lucu (Hedwig cilik), lampu baca berpendar hangat, bintang buku, pembatas buku hidup
 * 
 * Marker: G36_PERPUSTAKAAN_AJAIB_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type LibraryPhase =
  | 'MAGIC_DOOR'     // P1: Pintu kayu terbuka pelan & buku menyapa
  | 'BOOK_TRAIN'     // P2: Kereta buku keliling sekolah
  | 'LIVING_SHELVES' // P3: Rak buku hidup & membuka halaman
  | 'STORY_CORNER'   // P4: Pojok dongeng Asy & Syifa (20s)
  | 'PRAYER_BOOKS'   // P5: Doa harian, hijaiyah, kisah Nabi
  | 'READING_PASSPORT'; // P6: Paspor membaca & stempel kenangan

export interface StoryItem {
  id: string;
  title: string;
  narrator: string;
  category: 'KISAH_NABI' | 'DOA_HARIAN' | 'HIJAIYAH' | 'ADAB_SAHABAT';
  synopsis: string;
  icon: string;
  arabic?: string;
}

export interface LibrarySnapshot {
  currentPhase: LibraryPhase;
  isAutoPlayingLibrary: boolean;
  isTrainMoving: boolean;
  activeStory: StoryItem;
  readingStampsCount: number;
  unlockedStamps: string[];
}

class PerpustakaanAjaibEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: LibraryPhase = 'MAGIC_DOOR';
  private isAutoPlayingLibrary: boolean = false;
  private autoPlayTimer: any = null;
  private isTrainMoving: boolean = false;
  private readingStampsCount: number = 4;
  private unlockedStamps: string[] = ['Bintang Ceria', 'Buku Sahabat', 'Kelinci Membaca', 'Pohon Ilmu'];
  private listeners: Set<() => void> = new Set();

  private stories: StoryItem[] = [
    {
      id: 'story-1',
      title: 'Kisah Nabi Nuh & Bahtera Kasih Sayang',
      narrator: 'Dek Asy & Mbak Syifa',
      category: 'KISAH_NABI',
      synopsis: 'Mengenal ketabahan Nabi Nuh AS saat membangun bahtera besar dan merawat seluruh satwa dengan penuh cinta.',
      icon: '🚢'
    },
    {
      id: 'story-2',
      title: 'Doa Masuk Rumah & Berkah Silaturahmi',
      narrator: 'Mbak Syifa & Ustadzah',
      category: 'DOA_HARIAN',
      synopsis: 'Mengucapkan salam dan doa saat melangkah masuk rumah agar dinaungi malaikat rahmat.',
      icon: '🏡',
      arabic: 'بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا'
    },
    {
      id: 'story-3',
      title: 'Petualangan Huruf Hijaiyah Ceria (Alif-Ba-Ta)',
      narrator: 'Dek Asy & Farhan',
      category: 'HIJAIYAH',
      synopsis: 'Alif berdiri tegak laksana pohon pinus, Ba tersenyum membawa satu mutiara di bawah perahu.',
      icon: '🔤'
    },
    {
      id: 'story-4',
      title: 'Adab Berbagi Buku Bersama Sahabat',
      narrator: 'Bubu & Dek Asy',
      category: 'ADAB_SAHABAT',
      synopsis: 'Memegang buku dengan kedua tangan bersih, membalik halaman perlahan, dan mengembalikan ke raknya.',
      icon: '📖'
    }
  ];

  private activeStory: StoryItem;

  constructor() {
    this.activeStory = this.stories[0];
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
        console.error('Error in PerpustakaanAjaibEngine subscriber', err);
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
   * Sound synthesizer for Story Train "Tuut... Tuut..."
   */
  public playTrainWhistleSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Dual-tone train horn: F4 (349Hz) and A4 (440Hz)
      const freqs = [349.23, 440.0];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.08);
        gain.gain.setValueAtTime(0.1, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      });

      // Second blast
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + 0.55);

        gain.gain.setValueAtTime(0.001, now + 0.55);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.62);
        gain.gain.setValueAtTime(0.12, now + 1.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.55);
        osc.stop(now + 1.4);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G36-TRAIN-WHISTLE',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Story Train whistle chimed: Tuut... Tuut...'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for Magic Book page turning & chime
   */
  public playPageTurnChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Soft sparkling arpeggio
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);

        gain.gain.setValueAtTime(0.001, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.09, now + i * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.45);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for Passport Stamp stamping sound
   */
  public playStampSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      this.playPageTurnChime();
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: LibraryPhase) {
    this.currentPhase = phase;
    if (phase === 'BOOK_TRAIN') {
      this.isTrainMoving = true;
      this.playTrainWhistleSound();
    } else if (phase === 'LIVING_SHELVES' || phase === 'MAGIC_DOOR') {
      this.isTrainMoving = false;
      this.playPageTurnChime();
    } else if (phase === 'READING_PASSPORT') {
      this.isTrainMoving = false;
      this.playStampSound();
    } else {
      this.isTrainMoving = false;
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G36-LIBRARY-PHASE',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Perpustakaan Ajaib navigated to phase: ${phase}`
    });
  }

  public selectStory(storyId: string) {
    const found = this.stories.find((s) => s.id === storyId);
    if (found) {
      this.activeStory = found;
      this.playPageTurnChime();
      this.notify();
    }
  }

  public addReadingStamp(stampName: string) {
    if (!this.unlockedStamps.includes(stampName)) {
      this.unlockedStamps.push(stampName);
      this.readingStampsCount += 1;
    }
    this.playStampSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G36-PASSPORT-STAMP',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Added reading stamp: ${stampName}`
    });
  }

  /**
   * P7: Full Library Simulation
   */
  public startFullLibrarySimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.isAutoPlayingLibrary = true;
    const phases: LibraryPhase[] = [
      'MAGIC_DOOR',
      'BOOK_TRAIN',
      'LIVING_SHELVES',
      'STORY_CORNER',
      'PRAYER_BOOKS',
      'READING_PASSPORT'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingLibrary = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5000);
  }

  public stopFullLibrarySimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingLibrary = false;
    this.notify();
  }

  public getSnapshot(): LibrarySnapshot {
    return {
      currentPhase: this.currentPhase,
      isAutoPlayingLibrary: this.isAutoPlayingLibrary,
      isTrainMoving: this.isTrainMoving,
      activeStory: this.activeStory,
      readingStampsCount: this.readingStampsCount,
      unlockedStamps: [...this.unlockedStamps]
    };
  }

  public getStories(): StoryItem[] {
    return [...this.stories];
  }
}

export const perpustakaanAjaibEngine = new PerpustakaanAjaibEngine();
export default perpustakaanAjaibEngine;
