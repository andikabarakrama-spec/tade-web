/**
 * TADE SPRINT G34 — JAM BERMAIN CERIA & TAMAN PETUALANGAN TK ASY SYIFA ENGINE
 * Living Courtyard Recess & Adventure Playground Simulator
 * 
 * Features:
 * - P1: Bel Istirahat Ceria (Bel berbunyi lembut, pintu kelas terbuka, santri keluar tersenyum riang)
 * - P2: Taman Bermain Hidup (Ayunan Awan, Perosotan Pelangi, Jungkat-Jungkit Sahabat, Jembatan Tali Mini, Rumah Pohon Kecil)
 * - P3: Permainan Bersama (Tanpa menang/kalah: saling dorong ayunan santun, bergandengan tangan, antre perosotan sabar)
 * - P4: Sahabat Ikut Bermain (6 Sahabat setia: Bubu, Gogo, Mimi, Dodo, Titi, Rara turut meramaikan)
 * - P5: Kejutan Taman (Kupu-kupu emas bersinar, balon hati melayang, gelembung sabun warna-warni, pelangi kecil)
 * - P6: Transisi MBG (Bel lembut berbunyi saat waktu makan tiba, santri mencuci tangan & merapikan mainan)
 * - P7: Founder Taman Control (Uji ayunan, uji suara taman, simulasi istirahat otomatis, audit Black Box Ring-0)
 * - Bonus: Tupai berlari di dahan, ikan koi melompat di kolam mini, capung beterbangan, dedaunan berputar
 * 
 * Marker: G34_TAMAN_BERMAIN_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type PlaygroundPhase =
  | 'RECESS_BELL'     // P1: Bel istirahat berbunyi lembut
  | 'PARK_EXPLORE'    // P2: Eksplorasi 5 wahana taman aman
  | 'COOP_PLAY'       // P3: Permainan bersama tanpa menang-kalah
  | 'COMPANIONS_JOIN' // P4: 6 Sahabat setia ikut bermain
  | 'SURPRISE_PARK'   // P5: Kejutan gelembung, balon, kupu emas & pelangi
  | 'MBG_TRANSITION'; // P6: Transisi makan siang MBG

export interface PlaygroundAttraction {
  id: string;
  name: string;
  emoji: string;
  color: string;
  safetyFeature: string;
  description: string;
  activeCompanion: string;
}

export interface SurpriseItem {
  id: string;
  name: string;
  icon: string;
  effect: string;
}

class TamanPetualanganEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: PlaygroundPhase = 'RECESS_BELL';
  private selectedAttractionId: string = 'ayunan';
  private isAutoPlayingPlayground: boolean = false;
  private autoPlayTimer: any = null;
  private activeSurprise: SurpriseItem | null = null;
  private listeners: Set<() => void> = new Set();

  private attractions: PlaygroundAttraction[] = [
    {
      id: 'ayunan',
      name: 'Ayunan Awan Lembut',
      emoji: '🪑',
      color: 'from-sky-500 to-blue-700',
      safetyFeature: 'Rantai bersalut busa lembut & dudukan ergonomis dengan pengaman dada.',
      description: 'Berayun perlahan seperti terbang menyentuh awan putih yang sejuk.',
      activeCompanion: 'Bubu & Dek Asy'
    },
    {
      id: 'perosotan',
      name: 'Perosotan Pelangi Ceria',
      emoji: '🌈',
      color: 'from-rose-500 to-amber-600',
      safetyFeature: 'Bantalan pendaratan rumput sintetis empuk dan tangga bertangan ganda.',
      description: 'Meluncur riang melewati warna merah, kuning, hijau dengan tawa gembira.',
      activeCompanion: 'Mimi & Mbak Syifa'
    },
    {
      id: 'jungkat_jungkit',
      name: 'Jungkat-Jungkit Sahabat',
      emoji: '⚖️',
      color: 'from-emerald-500 to-teal-700',
      safetyFeature: 'Peredam kejut karet tebal di bawah dudukan untuk mencegah benturan keras.',
      description: 'Naik dan turun berirama, melatih keseimbangan dan komunikasi saling percaya.',
      activeCompanion: 'Gogo & Farhan'
    },
    {
      id: 'jembatan_tali',
      name: 'Jembatan Tali Mini',
      emoji: '🪜',
      color: 'from-amber-600 to-yellow-700',
      safetyFeature: 'Jaring pengaman samping ganda dan pijakan kayu anti-selip.',
      description: 'Menyeberang perlahan melatih keberanian dan koordinasi langkah kaki.',
      activeCompanion: 'Dodo & Titi'
    },
    {
      id: 'rumah_pohon',
      name: 'Rumah Pohon Hikmah',
      emoji: '🏡',
      color: 'from-indigo-600 to-purple-800',
      safetyFeature: 'Pagar pembatas kayu tinggi yang kokoh dan tangga landai bertingkat.',
      description: 'Tempat berteduh membaca buku cerita dan mengamati pemandangan taman.',
      activeCompanion: 'Rara & Aisyah'
    }
  ];

  private surprises: SurpriseItem[] = [
    { id: 'surp-kupu', name: 'Kupu-kupu Emas Berkilau', icon: '🦋', effect: 'Terbang menari mengitari bunga melati' },
    { id: 'surp-balon', name: 'Balon Hati Merah Jambu', icon: '🎈', effect: 'Melayang lembut ke angkasa biru' },
    { id: 'surp-gelembung', name: 'Gelembung Sabun Pelangi', icon: '🫧', effect: 'Pecah mengeluarkan aroma wangi jeruk' },
    { id: 'surp-pelangi', name: 'Pelangi Mini Berpendar', icon: '🌈', effect: 'Membentang indah di atas pancuran air taman' }
  ];

  constructor() {
    this.activeSurprise = this.surprises[0];
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
        console.error('Error in TamanPetualanganEngine subscriber', err);
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
   * Sound synthesizer for Recess Bell (Gentle chime melody)
   */
  public playRecessBellSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Gentle joyful arpeggio: G4, B4, D5, G5
      const notes = [392.0, 493.88, 587.33, 783.99];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.22);

        gain.gain.setValueAtTime(0.001, now + i * 0.22);
        gain.gain.linearRampToValueAtTime(0.14, now + i * 0.22 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.22);
        osc.stop(now + i * 0.22 + 0.7);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G34-RECESS-BELL',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Recess bell chimed: Teng tong teng tong...'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for playground bubble pop & surprise
   */
  public playBubblePopSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G34-BUBBLE-POP',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Playground bubble pop sound triggered'
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for gentle swing glide
   */
  public playSwingGlideSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.6);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: PlaygroundPhase) {
    this.currentPhase = phase;
    if (phase === 'RECESS_BELL' || phase === 'MBG_TRANSITION') {
      this.playRecessBellSound();
    } else if (phase === 'SURPRISE_PARK') {
      this.triggerRandomSurprise();
    } else {
      this.playSwingGlideSound();
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G34-PLAY-PHASE',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Taman Petualangan navigated to phase: ${phase}`
    });
  }

  public setSelectedAttraction(attractionId: string) {
    this.selectedAttractionId = attractionId;
    this.playSwingGlideSound();
    this.notify();
  }

  public triggerRandomSurprise() {
    const randomIndex = Math.floor(Math.random() * this.surprises.length);
    this.activeSurprise = this.surprises[randomIndex];
    this.playBubblePopSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G34-SURPRISE',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Playground surprise triggered: ${this.activeSurprise.name}`
    });
  }

  /**
   * P7: Full Playground Simulation
   */
  public startFullPlaygroundSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.isAutoPlayingPlayground = true;
    const phases: PlaygroundPhase[] = [
      'RECESS_BELL',
      'PARK_EXPLORE',
      'COOP_PLAY',
      'COMPANIONS_JOIN',
      'SURPRISE_PARK',
      'MBG_TRANSITION'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingPlayground = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5000);
  }

  public stopFullPlaygroundSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingPlayground = false;
    this.notify();
  }

  public getSnapshot() {
    return {
      currentPhase: this.currentPhase,
      selectedAttractionId: this.selectedAttractionId,
      activeSurprise: this.activeSurprise,
      isAutoPlayingPlayground: this.isAutoPlayingPlayground,
      attractions: [...this.attractions],
      surprises: [...this.surprises],
      currentAttraction:
        this.attractions.find((a) => a.id === this.selectedAttractionId) || this.attractions[0]
    };
  }
}

export const tamanPetualanganEngine = new TamanPetualanganEngine();
export default tamanPetualanganEngine;
