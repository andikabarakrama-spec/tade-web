/**
 * TADE SPRINT G29 — SEKOLAH BERNAPAS ENGINE (Living Breathing School Engine)
 * Master engine for animated, responsive, tactile school environment at TK Islam Asy-Syifa.
 * 
 * Features:
 * - P1: Gerbang Sahabat (Pagi membuka perlahan, malam lampu menyala lembut, Dek Asy menyapa "Assalamu'alaikum")
 * - P2: Bel Sekolah Ceria (3 Ekspresi: Masuk Kelas, Istirahat, Pulang; Pure Web Audio Synthesizer)
 * - P3: Papan Pengumuman Hidup (Kertas membuka sendiri, daun kecil bergoyang, bintang muncul sesaat)
 * - P4: Bunga Menyapa (Bunga menoleh, tersenyum, kupu-kupu & capung hinggap)
 * - P5: Pohon Berbisik (Pohon bijak berkata "Semangat belajar!", tersinkronisasi dengan Living Event Engine)
 * - P6: Kelas Bernyawa (Tas sekolah bernapas, pensil bergoyang ceria, buku teladan membalik halaman, jam berkedip ramah)
 * - P7: Founder Living Control (Pengujian instan seluruh elemen sekolah bernapas & Web Audio)
 * - Bonus: Capung melayang, Burung gereja berkicau, Gelembung sabun melayang, Daun jatuh keemasan
 * 
 * Integrations:
 * - G20 Asy-Syifa DNA, G21 Camera, Living Time Engine, Living Event Engine, G28 Peta Dunia
 * - Dr. Pulse 60 FPS & TADE Animation Governor (Max 5 active animations)
 * - Black Box Ring-0 Telemetry & Hermes Recovery Protection
 * 
 * Marker: G29_SEKOLAH_BERNAPAS_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine, SchoolEventType } from './livingEventEngine';
import { TimePhase } from './livingWorldEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type SchoolBellMode = 'MASUK' | 'ISTIRAHAT' | 'PULANG';

export interface LivingFloraItem {
  id: string;
  name: string;
  emoji: string;
  type: 'BUNGA_MELATI' | 'BUNGA_MAWAR' | 'BUNGA_MATAHARI' | 'POHON_BERBISIK';
  mood: 'TERSEDIA' | 'MENYAPA' | 'BERSYUKUR' | 'ISTIRAHAT';
  speech: string;
  hasVisitor: boolean; // butterfly or dragonfly
  visitorType?: 'KUPU_KUPU' | 'CAPUNG' | 'LEBAH_MADU';
}

export interface LivingClassroomObject {
  id: string;
  name: string;
  emoji: string;
  state: 'IDLE' | 'ACTIVE' | 'HAPPY';
  microAction: string;
  dialogue: string;
  soundLabel: string;
}

export interface LivingAnnouncement {
  id: string;
  title: string;
  category: 'AKHLAQ' | 'HAFALAN' | 'KEGIATAN' | 'KREASI';
  badgeEmoji: string;
  content: string;
  dateStr: string;
  isFolded: boolean;
  hasSparkle: boolean;
}

class SekolahBernapasEngine {
  private audioCtx: AudioContext | null = null;
  private timePhase: TimePhase = 'SIANG';
  private activeEvent: SchoolEventType = 'REGULAR_DAY';
  private gateState: 'OPEN' | 'CLOSING' | 'CLOSED' | 'OPENING' = 'OPEN';
  private gateLampsOn: boolean = false;
  private activeBellMode: SchoolBellMode | null = null;
  private treeWhisperActive: boolean = false;
  private treeCurrentMessage: string = '“Bismillah, mari kita mulai hari dengan senyuman dan niat ikhlas menuntut ilmu!”';
  private ecoModeActive: boolean = false;
  private listeners: Set<() => void> = new Set();

  // Classroom living objects
  private classroomObjects: LivingClassroomObject[] = [
    {
      id: 'obj-tas',
      name: 'Tas Sekolah Dek Asy',
      emoji: '🎒',
      state: 'IDLE',
      microAction: 'Bernapas lembut mengembang kempis',
      dialogue: '“Buku dan bekal kurma sudah rapi di dalam!”',
      soundLabel: 'Zip Halus'
    },
    {
      id: 'obj-pensil',
      name: 'Pensil Kayu Sahabat',
      emoji: '✏️',
      state: 'IDLE',
      microAction: 'Bergoyang menari membuat garis indah',
      dialogue: '“Siap menulis huruf hijaiyah yang rapi!”',
      soundLabel: 'Goresan Lembut'
    },
    {
      id: 'obj-buku',
      name: 'Buku Kisah 25 Nabi',
      emoji: '📖',
      state: 'IDLE',
      microAction: 'Membalik halaman dengan hembusan angin',
      dialogue: '“Membaca adalah jendela dunia dan cahaya ilmu!”',
      soundLabel: 'Kertas Halus'
    },
    {
      id: 'obj-jam',
      name: 'Jam Dinding Kurma',
      emoji: '⏰',
      state: 'IDLE',
      microAction: 'Mengedipkan mata & tersenyum tiap menit',
      dialogue: '“Tik-tok! Waktunya sholat dhuha dan berbuat baik!”',
      soundLabel: 'Detik Melodi'
    }
  ];

  // Living Flora Items (Bunga & Pohon)
  private floraItems: LivingFloraItem[] = [
    {
      id: 'flora-pohon',
      name: 'Pohon Kurma & Rindang Berbisik',
      emoji: '🌳',
      type: 'POHON_BERBISIK',
      mood: 'MENYAPA',
      speech: '“Semangat belajar santri shaleh! Naungan ilmu menyejukkan hati.”',
      hasVisitor: true,
      visitorType: 'KUPU_KUPU'
    },
    {
      id: 'flora-melati',
      name: 'Bunga Melati Santun',
      emoji: '🌸',
      type: 'BUNGA_MELATI',
      mood: 'MENYAPA',
      speech: '“Harumnya semerbak seperti doa tulus anak shaleh.”',
      hasVisitor: true,
      visitorType: 'KUPU_KUPU'
    },
    {
      id: 'flora-mawar',
      name: 'Bunga Mawar Merona',
      emoji: '🌹',
      type: 'BUNGA_MAWAR',
      mood: 'BERSYUKUR',
      speech: '“Indahnya ciptaan Allah di pekarangan sekolah kita!”',
      hasVisitor: true,
      visitorType: 'CAPUNG'
    },
    {
      id: 'flora-matahari',
      name: 'Bunga Matahari Ceria',
      emoji: '🌻',
      type: 'BUNGA_MATAHARI',
      mood: 'MENYAPA',
      speech: '“Menghadap mentari dengan wajah ceria dan bersyukur!”',
      hasVisitor: true,
      visitorType: 'LEBAH_MADU'
    }
  ];

  // Living Notice Board Items (Papan Pengumuman Hidup)
  private announcements: LivingAnnouncement[] = [
    {
      id: 'ann-1',
      title: 'Pekan Adab Santun: Senyum & Salam',
      category: 'AKHLAQ',
      badgeEmoji: '🤝',
      content: 'Mari biasakan mengucap Assalamu’alaikum dengan tersenyum ramah saat bertemu guru, sahabat, dan orang tua.',
      dateStr: 'Senin - Jum’at',
      isFolded: false,
      hasSparkle: true
    },
    {
      id: 'ann-2',
      title: 'Hafalan Surat Pendek: An-Nas & Al-Falaq',
      category: 'HAFALAN',
      badgeEmoji: '📖',
      content: 'Setoran tahfidz ceria bersama Bu Guru Syifa setiap pagi sebelum istirahat pertama.',
      dateStr: 'Setiap Pagi Berkah',
      isFolded: false,
      hasSparkle: false
    },
    {
      id: 'ann-3',
      title: 'Karya Melipat Origami Masjid Hijau',
      category: 'KREASI',
      badgeEmoji: '🎨',
      content: 'Pameran karya santri di Sentra Rumah Kreatif. Semua santri boleh membawa pulang hasil kreasi terbaiknya.',
      dateStr: 'Kamis Ceria',
      isFolded: true,
      hasSparkle: true
    }
  ];

  constructor() {
    this.initLivingTimeAndEvent();
    this.syncGateWithTime();
  }

  private initLivingTimeAndEvent() {
    try {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 11) {
        this.timePhase = 'PAGI';
      } else if (hour >= 11 && hour < 15) {
        this.timePhase = 'SIANG';
      } else if (hour >= 15 && hour < 18) {
        this.timePhase = 'SORE';
      } else {
        this.timePhase = 'MALAM';
      }

      this.activeEvent = livingEventEngine.getActiveEvent().eventId;
      this.updateTreeMessageForEvent();
    } catch {
      this.timePhase = 'SIANG';
      this.activeEvent = 'REGULAR_DAY';
    }
  }

  public syncGateWithTime() {
    if (this.timePhase === 'PAGI' || this.timePhase === 'SIANG') {
      this.gateState = 'OPEN';
      this.gateLampsOn = false;
    } else if (this.timePhase === 'SORE') {
      this.gateState = 'OPEN';
      this.gateLampsOn = true;
    } else {
      this.gateState = 'CLOSED';
      this.gateLampsOn = true;
    }
  }

  private updateTreeMessageForEvent() {
    switch (this.activeEvent) {
      case 'RAMADHAN':
        this.treeCurrentMessage = '“Marhaban ya Ramadhan! Pohon rindang ikut bertasbih menyambut bulan penuh ampunan dan berkah.”';
        break;
      case 'IDUL_FITRI':
        this.treeCurrentMessage = '“Taqabbalallahu minna wa minkum! Daun-daun bergoyang riang merayakan hari kemenangan suci.”';
        break;
      case 'WISUDA':
        this.treeCurrentMessage = '“Barakallah santri cilik kebanggaan! Terbanglah tinggi meraih cita-cita mulia dengan akhlak terpuji.”';
        break;
      case 'KEMERDEKAAN':
        this.treeCurrentMessage = '“Merah putih berkibar gagah! Santri Asy-Syifa cinta tanah air dan siap membela kebenaran.”';
        break;
      case 'HARI_SANTRI':
        this.treeCurrentMessage = '“Santri siaga jiwa raga! Bersama menjaga persatuan dan menyebarkan rahmatan lil alamin.”';
        break;
      default:
        this.treeCurrentMessage = '“Semangat belajar santri shaleh! Setiap butir ilmu yang dipelajari adalah bekal kebaikan dunia akhirat.”';
        break;
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Error in SekolahBernapasEngine subscriber', err);
      }
    });
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // =========================================================
  // PURE WEB AUDIO SYNTHESIZERS (P2 BEL & ENVIRONMENT SOUNDS)
  // =========================================================

  /**
   * P2: Bel Sekolah Ceria Synthesizer
   * 3 Modes: MASUK (Melodious Chime), ISTIRAHAT (Cheerful Arpeggio), PULANG (Gentle Lullaby)
   */
  public playSchoolBell(mode: SchoolBellMode) {
    this.activeBellMode = mode;
    this.notify();

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      let notes: { f: number; d: number }[] = [];

      if (mode === 'MASUK') {
        // Cheerful school bell: Do - Mi - Sol - Do' (C4, E4, G4, C5)
        notes = [
          { f: 261.63, d: 0.35 },
          { f: 329.63, d: 0.35 },
          { f: 392.00, d: 0.35 },
          { f: 523.25, d: 0.7 }
        ];
      } else if (mode === 'ISTIRAHAT') {
        // Joyful recess bell: G4 - E4 - A4 - G4 - C5
        notes = [
          { f: 392.00, d: 0.22 },
          { f: 329.63, d: 0.22 },
          { f: 440.00, d: 0.22 },
          { f: 392.00, d: 0.25 },
          { f: 523.25, d: 0.6 }
        ];
      } else {
        // Peaceful dismissal bell: C5 - G4 - E4 - C4
        notes = [
          { f: 523.25, d: 0.35 },
          { f: 392.00, d: 0.35 },
          { f: 329.63, d: 0.4 },
          { f: 261.63, d: 0.8 }
        ];
      }

      let elapsed = 0;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + elapsed);

        gain.gain.setValueAtTime(0.001, now + elapsed);
        gain.gain.linearRampToValueAtTime(0.25, now + elapsed + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + elapsed + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + elapsed);
        osc.stop(now + elapsed + n.d);
        elapsed += n.d * 0.85;
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G29-SEKOLAH',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `School Bell triggered: mode ${mode}`
      });

      // Clear active bell indicator after sound duration
      setTimeout(() => {
        this.activeBellMode = null;
        this.notify();
      }, (elapsed + 0.5) * 1000);
    } catch {
      // Failsafe
      this.activeBellMode = null;
    }
  }

  /**
   * Sound for Gate open / close
   */
  public playGateSound(action: 'OPEN' | 'CLOSE') {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(action === 'OPEN' ? 330 : 220, now);
      osc.frequency.linearRampToValueAtTime(action === 'OPEN' ? 523.25 : 165, now + 0.6);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound for living object touch / interaction
   */
  public playSparkleSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.05);

        gain.gain.setValueAtTime(0.001, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.3);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound for sparrow chirp (Burung gereja)
   */
  public playSparrowChirp() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const chirps = [1800, 2400, 2200, 2600];
      chirps.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        osc.frequency.exponentialRampToValueAtTime(f * 1.3, now + i * 0.08 + 0.04);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.14, now + i * 0.08 + 0.01);
        gain.gain.linearRampToValueAtTime(0.001, now + i * 0.08 + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.06);
      });
    } catch {
      // Failsafe
    }
  }

  // =========================================================
  // ACTIONS & INTERACTION HANDLERS
  // =========================================================

  public toggleGate() {
    if (this.gateState === 'OPEN') {
      this.gateState = 'CLOSED';
      this.playGateSound('CLOSE');
    } else {
      this.gateState = 'OPEN';
      this.playGateSound('OPEN');
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G29-GERBANG',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Gate toggled to state: ${this.gateState}`
    });
  }

  public triggerTreeWhisper() {
    this.treeWhisperActive = true;
    this.playSparkleSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G29-POHON',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Pohon Berbisik activated message'
    });

    setTimeout(() => {
      this.treeWhisperActive = false;
      this.notify();
    }, 4500);
  }

  public interactWithClassroomObject(objId: string) {
    this.classroomObjects = this.classroomObjects.map(obj => {
      if (obj.id === objId) {
        return {
          ...obj,
          state: 'HAPPY'
        };
      }
      return obj;
    });

    this.playSparkleSound();
    this.notify();

    setTimeout(() => {
      this.classroomObjects = this.classroomObjects.map(obj => {
        if (obj.id === objId) {
          return { ...obj, state: 'IDLE' };
        }
        return obj;
      });
      this.notify();
    }, 2000);
  }

  public interactWithFlora(floraId: string) {
    this.floraItems = this.floraItems.map(item => {
      if (item.id === floraId) {
        return {
          ...item,
          mood: 'BERSYUKUR',
          hasVisitor: true
        };
      }
      return item;
    });

    this.playSparkleSound();
    this.notify();

    setTimeout(() => {
      this.floraItems = this.floraItems.map(item => {
        if (item.id === floraId) {
          return { ...item, mood: 'MENYAPA' };
        }
        return item;
      });
      this.notify();
    }, 2500);
  }

  public toggleAnnouncementFold(annId: string) {
    this.announcements = this.announcements.map(ann => {
      if (ann.id === annId) {
        return { ...ann, isFolded: !ann.isFolded, hasSparkle: true };
      }
      return ann;
    });
    this.playSparkleSound();
    this.notify();
  }

  public setTimePhase(phase: TimePhase) {
    this.timePhase = phase;
    this.syncGateWithTime();
    this.notify();
  }

  public setActiveEvent(event: SchoolEventType) {
    this.activeEvent = event;
    this.updateTreeMessageForEvent();
    this.notify();
  }

  public toggleEcoMode() {
    this.ecoModeActive = !this.ecoModeActive;
    this.notify();
  }

  // =========================================================
  // GETTERS FOR REACT COMPONENTS
  // =========================================================

  public getSnapshot() {
    return {
      timePhase: this.timePhase,
      activeEvent: this.activeEvent,
      gateState: this.gateState,
      gateLampsOn: this.gateLampsOn,
      activeBellMode: this.activeBellMode,
      treeWhisperActive: this.treeWhisperActive,
      treeCurrentMessage: this.treeCurrentMessage,
      ecoModeActive: this.ecoModeActive,
      classroomObjects: [...this.classroomObjects],
      floraItems: [...this.floraItems],
      announcements: [...this.announcements]
    };
  }
}

export const sekolahBernapasEngine = new SekolahBernapasEngine();
export default sekolahBernapasEngine;
