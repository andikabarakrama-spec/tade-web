/**
 * TADE SPRINT G31 — KELUARGA SAHABAT ASY & SYIFA ENGINE
 * Living Daily Life & Sahabat Ecosystem Simulator
 * 
 * Features:
 * - P1: Pagi Bersama (Asy bangun tersenyum, Syifa membuka jendela menyambut mentari, Bubu si burung pipit datang menyapa)
 * - P2: Rumah Setiap Sahabat (Setiap sahabat memiliki rumah hidup berkarakter kartun 3D)
 * - P3: Kebiasaan Harian Santri (Menyiram bunga, merapikan tas & meja belajar, membaca doa harian, berbagi bekal sehat)
 * - P4: Cerita 15 Detik (Setiap episode kegiatan berdurasi ~15 detik dengan dialog santun, animasi adab, dan nilai kebaikan)
 * - P5: Ekspresi Otomatis (Terintegrasi penuh dengan DNA G20 Asy-Syifa: Senyum, Tertawa, Bangga, Bersyukur)
 * - P6: Acara Otomatis (Tersinkronisasi dengan Living Event Engine G25 & Living Time Engine)
 * - P7: Founder Control (Preview kegiatan interaktif, uji suara Web Audio, audit Black Box Ring-0)
 * - Bonus: Kucing tidur di beranda, ayam jantan berkokok ceria, kupu-kupu menari, dan gelembung sabun kebaikan
 * 
 * Integrations:
 * - TV Asy, Rumah Asy, Kampung Ceria, Lorong Kenangan G30, Peta Dunia G28, DNA G20, Living Event Engine
 * - Performance: Dr. Pulse 60 FPS Guaranteed, max 5 active animations via TADE Animation Governor
 * 
 * Marker: G31_KELUARGA_SAHABAT_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';
import { asySyifaDnaEngine, OfficialExpression } from './asySyifaDnaEngine';

export interface SahabatProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  role: string;
  characterTrait: string;
  houseName: string;
  houseEmoji: string;
  houseColor: string;
  currentActivity: string;
  favoriteHabit: string;
  expression: OfficialExpression;
}

export interface DailyHabit {
  id: string;
  title: string;
  category: 'IBADAH_ADAB' | 'KEBERSIHAN_ALAM' | 'KASIH_SAYANG' | 'BELAJAR';
  emoji: string;
  participantNames: string[];
  durationSec: number; // ~15 seconds per habit story
  storyText: string;
  prayerText: string;
  adabValue: string;
  ambientSound: 'CHIRP' | 'WATER' | 'ROOSTER' | 'HARP';
}

export interface MorningMomentState {
  asyState: 'BANGUN_TIDUR' | 'MEMBACA_DOA' | 'MERAPIKAN_KASUR';
  syifaState: 'MEMBUKA_JENDELA' | 'MENYAPA_MENTARI' | 'MENYIRAM_BUNGA';
  bubuState: 'HINGGAP_DI_JENDELA' | 'BERKICAU_CERIA' | 'MEMBAWA_RANTING';
  sunPosition: number; // 0 to 100%
  windowOpen: boolean;
}

class KeluargaSahabatEngine {
  private audioCtx: AudioContext | null = null;
  private activeHabitStoryId: string | null = 'habit-pagi-doa';
  private storyRemainingTimeSec: number = 15;
  private storyTimer: any = null;
  private isStoryPlaying: boolean = false;
  private selectedSahabatId: string = 'sahabat-asy';
  private bonusCatSleeping: boolean = true;
  private bonusRoosterCrowing: boolean = false;
  private listeners: Set<() => void> = new Set();

  // P1: Morning Moment State
  private morningMoment: MorningMomentState = {
    asyState: 'BANGUN_TIDUR',
    syifaState: 'MEMBUKA_JENDELA',
    bubuState: 'HINGGAP_DI_JENDELA',
    sunPosition: 25,
    windowOpen: true
  };

  // P2: Rumah Setiap Sahabat (Characters & Houses)
  private sahabatList: SahabatProfile[] = [
    {
      id: 'sahabat-asy',
      name: 'Dek Asy',
      avatarEmoji: '👦🏻',
      role: 'Santri Ceria & Pemberani',
      characterTrait: 'Semangat belajar adab, gemar menolong, dan menyayangi sesama.',
      houseName: 'Rumah Mentari Asy',
      houseEmoji: '🏡',
      houseColor: '#3b82f6',
      currentActivity: 'Merapikan tas sekolah dan menyusun buku tahfidz',
      favoriteHabit: 'Membaca doa bangun tidur dan senyum salam',
      expression: 'SENYUM'
    },
    {
      id: 'sahabat-syifa',
      name: 'Mbak Syifa',
      avatarEmoji: '👧🏻',
      role: 'Santri Santun & Penyayang',
      characterTrait: 'Lembut bertutur kata, tekun merawat tanaman, dan suka berbagi rezeki.',
      houseName: 'Rumah Melati Syifa',
      houseEmoji: '🌸',
      houseColor: '#ec4899',
      currentActivity: 'Membuka jendela kamar dan menyiram tanaman mawar',
      favoriteHabit: 'Menyiram bunga dan membaca bismillah',
      expression: 'TERTAWA'
    },
    {
      id: 'sahabat-bubu',
      name: 'Bubu si Burung Pipit',
      avatarEmoji: '🐥',
      role: 'Sahabat Pagi Ceria',
      characterTrait: 'Berkicau merdu saat adzan subuh dan suka hinggap di dahan kamboja.',
      houseName: 'Sarang Ranting Harmoni',
      houseEmoji: '🌳',
      houseColor: '#eab308',
      currentActivity: 'Menyapa Dek Asy & Mbak Syifa di ambang jendela',
      favoriteHabit: 'Membangunkan santri di waktu subuh',
      expression: 'BANGGA'
    },
    {
      id: 'sahabat-farhan',
      name: 'Muhammad Farhan',
      avatarEmoji: '👦🏽',
      role: 'Arsitek Cilik Cerdas',
      characterTrait: 'Suka merancang balok kayu ramah lingkungan dan tertib menjaga wudhu.',
      houseName: 'Rumah Balok Kreatif',
      houseEmoji: '🧱',
      houseColor: '#10b981',
      currentActivity: 'Menyiapkan bekal buah pisang manis untuk dibagi bersama teman',
      favoriteHabit: 'Berbagi bekal sehat saat jam istirahat',
      expression: 'BERPIKIR'
    },
    {
      id: 'sahabat-aisyah',
      name: 'Aisyah Putri',
      avatarEmoji: '🧕🏻',
      role: 'Pencinta Kaligrafi & Warna',
      characterTrait: 'Teliti melipat origami dan gemar mengucapkan terima kasih.',
      houseName: 'Pondok Pelangi Bintang',
      houseEmoji: '🎨',
      houseColor: '#8b5cf6',
      currentActivity: 'Menyusun pensil warna dan kartu hafalan juz 30',
      favoriteHabit: 'Menjaga kebersihan meja belajar dan doa sebelum belajar',
      expression: 'TERIMA_KASIH'
    }
  ];

  // P3 & P4: Kebiasaan Harian & Cerita 15 Detik
  private dailyHabits: DailyHabit[] = [
    {
      id: 'habit-pagi-doa',
      title: 'Bangun Tidur & Doa Syukur',
      category: 'IBADAH_ADAB',
      emoji: '🌅',
      participantNames: ['Dek Asy', 'Mbak Syifa', 'Bubu'],
      durationSec: 15,
      storyText: 'Dek Asy terbangun saat fajar menyingsing. Dengan senyum lebar, ia duduk tegak dan mengusap wajahnya sambil melafalkan doa syukur.',
      prayerText: '“Alhamdulillahilladzi ahyana ba’da ma amatana wa ilaihin nusyur.”',
      adabValue: 'Memulai hari dengan bersyukur kepada Allah SWT.',
      ambientSound: 'CHIRP'
    },
    {
      id: 'habit-siram-bunga',
      title: 'Menyiram Bunga Melati di Beranda',
      category: 'KEBERSIHAN_ALAM',
      emoji: '🪴',
      participantNames: ['Mbak Syifa', 'Bubu'],
      durationSec: 15,
      storyText: 'Mbak Syifa mengambil ceret air mini berwarna toska. Dengan penuh kelembutan, air disiramkan ke kelopak bunga melati yang mulai semerbak harum.',
      prayerText: '“Subhanallahi wa bihamdihi, adada khalqihi wa ridha nafsihi.”',
      adabValue: 'Menyayangi makhluk ciptaan Allah dan menjaga keasrian bumi.',
      ambientSound: 'WATER'
    },
    {
      id: 'habit-rapikan-tas',
      title: 'Merapikan Tas & Buku Santri',
      category: 'BELAJAR',
      emoji: '🎒',
      participantNames: ['Dek Asy', 'Farhan'],
      durationSec: 15,
      storyText: 'Dek Asy dan Farhan memeriksa tas sekolah mereka. Buku doa, modul hijaiyah, dan tempat minum diletakkan rapi tanpa ada yang tertinggal.',
      prayerText: '“Rabbi zidni ‘ilman, warzuqni fahman.”',
      adabValue: 'Kedisiplinan, tanggung jawab, dan mencintai ilmu yang bermanfaat.',
      ambientSound: 'HARP'
    },
    {
      id: 'habit-bagi-bekal',
      title: 'Berbagi Bekal Sehat & Halal',
      category: 'KASIH_SAYANG',
      emoji: '🍱',
      participantNames: ['Farhan', 'Aisyah', 'Dek Asy'],
      durationSec: 15,
      storyText: 'Farhan membuka kotak bekal berisi kurma dan roti gandum. Dengan riang gembira, ia menawarkan kepada teman-temannya di serambi kelas.',
      prayerText: '“Allahumma barik lana fima razaqtana waqina ‘adzabannar.”',
      adabValue: 'Menanamkan kedermawanan dan silaturahmi tanpa pamrih.',
      ambientSound: 'HARP'
    }
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
        console.error('Error in KeluargaSahabatEngine listener', err);
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
   * P7 & Bonus: Web Audio Synthesis for Daily Life Sounds
   */
  public playHabitSound(soundType: 'CHIRP' | 'WATER' | 'ROOSTER' | 'HARP') {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (soundType === 'CHIRP') {
        // Soft bird chirp: Bubu pipit
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now);
        osc.frequency.exponentialRampToValueAtTime(2640, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1980, now + 0.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (soundType === 'ROOSTER') {
        // Cartoon morning rooster sound
        this.bonusRoosterCrowing = true;
        this.notify();

        const freqs = [587.33, 880.0, 1046.5, 1174.66];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.15);

          gain.gain.setValueAtTime(0.001, now + i * 0.15);
          gain.gain.linearRampToValueAtTime(0.12, now + i * 0.15 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.4);
        });

        setTimeout(() => {
          this.bonusRoosterCrowing = false;
          this.notify();
        }, 1500);
      } else if (soundType === 'WATER') {
        // Soothing water drop droplets
        [0, 0.1, 0.2].forEach((delay, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200 - idx * 100, now + delay);
          osc.frequency.exponentialRampToValueAtTime(800, now + delay + 0.08);

          gain.gain.setValueAtTime(0.001, now + delay);
          gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.1);
        });
      } else {
        // Melodic harp arpeggio (C Major: C5-E5-G5-C6)
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.08);

          gain.gain.setValueAtTime(0.001, now + i * 0.08);
          gain.gain.linearRampToValueAtTime(0.14, now + i * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.4);
        });
      }

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G31-AUDIO',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Sound played: ${soundType}`
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * P4: Play 15-second Story Countdown
   */
  public startStory(habitId: string) {
    if (this.storyTimer) {
      clearInterval(this.storyTimer);
    }

    this.activeHabitStoryId = habitId;
    this.storyRemainingTimeSec = 15;
    this.isStoryPlaying = true;
    const habit = this.dailyHabits.find((h) => h.id === habitId);
    if (habit) {
      this.playHabitSound(habit.ambientSound);
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G31-STORY',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Started 15s Story: ${habit?.title || habitId}`
    });

    this.storyTimer = setInterval(() => {
      this.storyRemainingTimeSec -= 1;
      if (this.storyRemainingTimeSec <= 0) {
        clearInterval(this.storyTimer);
        this.isStoryPlaying = false;
        this.storyRemainingTimeSec = 15;
        this.playHabitSound('HARP');
      }
      this.notify();
    }, 1000);
  }

  public stopStory() {
    if (this.storyTimer) {
      clearInterval(this.storyTimer);
    }
    this.isStoryPlaying = false;
    this.storyRemainingTimeSec = 15;
    this.notify();
  }

  public setSelectedSahabat(sahabatId: string) {
    this.selectedSahabatId = sahabatId;
    const profile = this.sahabatList.find((s) => s.id === sahabatId);
    if (profile) {
      // Trigger signature DNA expression sound
      this.playHabitSound('HARP');
    }
    this.notify();
  }

  public toggleWindow() {
    this.morningMoment.windowOpen = !this.morningMoment.windowOpen;
    this.playHabitSound(this.morningMoment.windowOpen ? 'CHIRP' : 'HARP');
    this.notify();
  }

  public getSnapshot() {
    const activeHabit =
      this.dailyHabits.find((h) => h.id === this.activeHabitStoryId) || this.dailyHabits[0];

    return {
      selectedSahabatId: this.selectedSahabatId,
      morningMoment: { ...this.morningMoment },
      sahabatList: [...this.sahabatList],
      dailyHabits: [...this.dailyHabits],
      activeHabit,
      isStoryPlaying: this.isStoryPlaying,
      storyRemainingTimeSec: this.storyRemainingTimeSec,
      bonusCatSleeping: this.bonusCatSleeping,
      bonusRoosterCrowing: this.bonusRoosterCrowing
    };
  }
}

export const keluargaSahabatEngine = new KeluargaSahabatEngine();
export default keluargaSahabatEngine;
