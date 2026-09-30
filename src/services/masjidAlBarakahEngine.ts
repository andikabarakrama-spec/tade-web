/**
 * TADE SPRINT G41 — MASJID AL-BARAKAH HIDUP & KAMPUNG SHALIH ENGINE
 * Main Spiritual Landmark, Living Pathway, Wudhu Ceria, Shaf Kasih, Menara Cahaya, Halaman Bernapas, & Friday Parade
 * 
 * Features:
 * - P1: Masjid Al-Barakah Hidup (Kubah emas berkilau, bulan sabit tersenyum, lentera bergoyang, jendela berkedip, pintu membuka pelan, cahaya hangat masuk)
 * - P2: Jalan Menuju Masjid (Bunga melambai, kupu-kupu emas, burung pipit, lampu taman, paving batu berkilau, Trem Mini Barakah, Sepeda Ceria, Skuter Hijau, Gerobak Buku)
 * - P3: Air Wudhu Ceria (Tetesan air tersenyum, kran ramah, ikan kecil, gelembung pelangi, percikan air lembut, urutan wudhu edukasi ringan)
 * - P4: Shaf Kecil Ceria (DNA G20: langkah kecil, anggukan, senyum, lambaian, sajadah hidup, rak sandal rapi, rak Al-Qur'an kecil, cahaya lembut)
 * - P5: Menara Cahaya (Burung mengitari menara, cahaya sore, bintang muncul, bulan tersenyum, awan lewat, lentera malam otomatis)
 * - P6: Halaman Masjid Bernapas (Pohon kurma, pohon melati, kolam koi, merpati putih, tupai kecil, capung, kupu-kupu, Ayunan Lentera, Bangku Hikmah, Karpet Cerita, Pohon Doa)
 * - P7: Founder Masjid Control Cockpit (Simulasi pagi-siang-sore-malam, uji suara air wudhu, uji burung, uji lentera, uji transportasi, monitor governor, audit Ring-0)
 * - Bonus 1: Parade Jumat Ceria 20 Detik (Dek Asy, Mbak Syifa, Bubu, Gogo, Mimi, Dodo, Titi, Rara, Trem Mini, Gerobak Buku, Balon hijau putih)
 * - Bonus 2: MBG Menuju Masjid (Bus MBG -> Makan bersama -> Dodo ingat kebersihan -> Alhamdulillah -> Berjalan ke Masjid)
 * - Bonus 3: Kejutan Rahasia (Bintang Doa, Kupu-kupu Barakah, Merpati Putih, Bulan Tersenyum, Lentera Emas ke Paspor Petualang tanpa poin)
 * 
 * Marker: G41_MASJID_AL_BARAKAH_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type MasjidPhase =
  | 'LANDMARK'     // P1: Masjid Al-Barakah Hidup (Kubah emas, lentera, pintu buka)
  | 'PATHWAY'      // P2: Jalan Menuju Masjid & Transportasi Ramah
  | 'WUDHU'        // P3: Air Wudhu Ceria & Kran Ramah
  | 'SHAF'         // P4: Shaf Kecil Ceria & Sajadah Hidup
  | 'MINARET'      // P5: Menara Cahaya & Bintang Langit
  | 'COURTYARD'    // P6: Halaman Masjid Bernapas & Pohon Doa
  | 'FRIDAY_PARADE'// Bonus 1: Parade Jumat Ceria 20 Detik
  | 'MBG_FLOW';    // Bonus 2: MBG Menuju Masjid

export type TimeOfDay = 'DAWN' | 'NOON' | 'AFTERNOON' | 'DUSK' | 'NIGHT';
export type TransportId = 'TREM' | 'SEPEDA' | 'SKUTER' | 'GEROBAK';

export interface TransportVehicle {
  id: TransportId;
  name: string;
  icon: string;
  driver: string;
  speedText: string;
  description: string;
}

export interface WudhuStep {
  stepNumber: number;
  name: string;
  arabicPhrase: string;
  emoji: string;
  educationTip: string;
  waterHumor: string;
}

export interface CourtyardSpot {
  id: string;
  name: string;
  icon: string;
  feature: string;
  characterPresent: string;
  blessingText: string;
}

export interface MasjidSnapshot {
  currentPhase: MasjidPhase;
  timeOfDay: TimeOfDay;
  isLanternLit: boolean;
  isDoorOpen: boolean;
  isFridayParadeActive: boolean;
  fridayParadeSeconds: number;
  activeTransport: TransportId;
  activeWudhuStep: number;
  collectedSecretSurprises: string[];
  isAutoSimulating: boolean;
}

class MasjidAlBarakahEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: MasjidPhase = 'LANDMARK';
  private timeOfDay: TimeOfDay = 'DUSK';
  private isLanternLit: boolean = true;
  private isDoorOpen: boolean = true;
  private isFridayParadeActive: boolean = false;
  private fridayParadeSeconds: number = 0;
  private paradeTimer: any = null;
  private activeTransport: TransportId = 'TREM';
  private activeWudhuStep: number = 1;
  private collectedSecretSurprises: string[] = ['Bintang Doa', 'Kupu-kupu Barakah', 'Merpati Putih', 'Lentera Emas'];
  private isAutoSimulating: boolean = false;
  private simulationTimer: any = null;

  private listeners: Set<() => void> = new Set();

  public readonly transports: Record<TransportId, TransportVehicle> = {
    TREM: {
      id: 'TREM',
      name: 'Trem Mini Barakah',
      icon: '🚋',
      driver: 'Pak Haji Ramah 👳🏽‍♂️',
      speedText: 'Berjalan santun & tenang',
      description: 'Trem listrik mini bertenaga surya dengan lonceng berbunyi ting-ting lembut.'
    },
    SEPEDA: {
      id: 'SEPEDA',
      name: 'Sepeda Ceria Asy & Syifa',
      icon: '🚲',
      driver: 'Dek Asy & Syifa 👧🏻👦🏻',
      speedText: 'Kayuhan santai penuh senyum',
      description: 'Sepeda tandem mini dengan keranjang berisi sajadah dan Al-Qur\'an kecil.'
    },
    SKUTER: {
      id: 'SKUTER',
      name: 'Skuter Hijau Daun',
      icon: '🛴',
      driver: 'Mimi si Kelinci 🐰',
      speedText: 'Meluncur pelan di atas paving batu',
      description: 'Skuter dorong ramah lingkungan menyusuri jalan berbunga melati.'
    },
    GEROBAK: {
      id: 'GEROBAK',
      name: 'Gerobak Buku & Doa Masjid',
      icon: '🛒📚',
      driver: 'Gogo si Beruang Mini 🐻',
      speedText: 'Didorong perlahan dengan doa',
      description: 'Membawa buku cerita islami, tasbih warna-warni, dan mukena harum untuk jamaah cilik.'
    }
  };

  public readonly wudhuSteps: WudhuStep[] = [
    {
      stepNumber: 1,
      name: 'Niat & Membasuh Telapak Tangan',
      arabicPhrase: 'Bismillahir Rahmanir Rahim',
      emoji: '🤲💧',
      educationTip: 'Membasuh sela-sela jari tangan dengan air bersih mengalir pelan.',
      waterHumor: 'Tetesan air tersenyum: “Segarnya tangan bersih siap beribadah!”'
    },
    {
      stepNumber: 2,
      name: 'Berkumur-kumur Lembut',
      arabicPhrase: 'Madhmadhah',
      emoji: '👄🫧',
      educationTip: 'Berkumur dengan lembut untuk membersihkan mulut agar selalu berkata santun.',
      waterHumor: 'Gelembung pelangi: “Bicara yang baik atau diam ya sahabat!”'
    },
    {
      stepNumber: 3,
      name: 'Membasuh Hidung',
      arabicPhrase: 'Istinsyaq',
      emoji: '👃✨',
      educationTip: 'Menghirup air sedikit lalu mengeluarkannya agar pernapasan segar.',
      waterHumor: 'Percikan air sejuk: “Napas jadi lega dan harum wangi melati!”'
    },
    {
      stepNumber: 4,
      name: 'Membasuh Wajah Bercahaya',
      arabicPhrase: 'Ghaslul Wajh',
      emoji: '😊💧',
      educationTip: 'Membasuh seluruh wajah dari batas rambut hingga dagu dengan wajah berseri-seri.',
      waterHumor: 'Tetesan air tersenyum: “Wajah cilik bersinar bagai bulan purnama!”'
    },
    {
      stepNumber: 5,
      name: 'Membasuh Tangan Sampai Siku',
      arabicPhrase: 'Ghaslul Yadaain',
      emoji: '💪🌱',
      educationTip: 'Mendahulukan tangan kanan hingga siku lalu tangan kiri, siap menolong sesama.',
      waterHumor: 'Kran ramah: “Tangan yang rajin berbuat kebaikan dan sedekah!”'
    },
    {
      stepNumber: 6,
      name: 'Mengusap Sebagian Kepala & Telinga',
      arabicPhrase: 'Mashur Ra\'si wal Udunain',
      emoji: '👂🌿',
      educationTip: 'Mengusap kepala dan membersihkan telinga agar selalu mendengar nasihat baik.',
      waterHumor: 'Gelembung pelangi: “Telinga yang gemar mendengar lantunan ayat suci!”'
    },
    {
      stepNumber: 7,
      name: 'Membasuh Kaki Sampai Mata Kaki',
      arabicPhrase: 'Ghaslur Rijlain',
      emoji: '🦶🚿',
      educationTip: 'Membasuh kaki hingga mata kaki, melangkah mantap menuju kebaikan dan masjid.',
      waterHumor: 'Ikan kecil kolam: “Kaki mungil yang rajin melangkah ke masjid barakah!”'
    },
    {
      stepNumber: 8,
      name: 'Doa Sesudah Wudhu',
      arabicPhrase: 'Asyhadu alla ilaha illallah...',
      emoji: '🤲🌟',
      educationTip: 'Menghadap kiblat dan berdoa memohon dijadikan hamba yang suci dan bertobat.',
      waterHumor: 'Seluruh air wudhu berkilau: “Alhamdulillah, badan bersih dan hati tenang!”'
    }
  ];

  public readonly courtyardSpots: CourtyardSpot[] = [
    {
      id: 'AYUNAN',
      name: 'Ayunan Lentera Ceria',
      icon: '🏮🎡',
      feature: 'Ayunan kayu berukir islami dengan lentera lembut yang bergoyang pelan.',
      characterPresent: 'Dek Asy & Mimi 👦🏻🐰',
      blessingText: '“Bermain bersama sambil bertasbih Subhanallah!”'
    },
    {
      id: 'BANGKU',
      name: 'Bangku Hikmah Sahabat',
      icon: '🪑📖',
      feature: 'Bangku taman di bawah pohon melati rindang tempat membaca buku cerita nabi.',
      characterPresent: 'Mbak Syifa & Titi 👧🏻🐦',
      blessingText: '“Mendengarkan kisah teladan nabi yang penuh kasih sayang.”'
    },
    {
      id: 'KOLAM',
      name: 'Kolam Ikan Koi Barakah',
      icon: '🐟🫧',
      feature: 'Air gemericik jernih dengan ikan koi warna oranye, putih, dan emas berenang santai.',
      characterPresent: 'Dodo si Kura-Kura 🐢',
      blessingText: '“Dodo menjaga kebersihan air kolam agar selalu jernih dan asri.”'
    },
    {
      id: 'POHON_DOA',
      name: 'Pohon Doa & Kurma Teduh',
      icon: '🌴🕊️',
      feature: 'Pohon kurma rindang di mana merpati putih hinggap dan kartu doa tergantung rapi.',
      characterPresent: 'Bubu si Burung & Rara 🐦🐿️',
      blessingText: '“Setiap doa anak shalih terbang tinggi ke langit penuh berkah.”'
    }
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
        console.error('Error in MasjidAlBarakahEngine subscriber', err);
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
   * Sound: Masjid Adhan/Chime Harpa Barakah (P1)
   */
  public playMasjidChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Spiritual Pentatonic Chime (D4, F#4, A4, B4, D5)
      const freqs = [293.66, 369.99, 440.0, 493.88, 587.33, 739.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.2);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Flowing Wudhu Water & Bubbles (P3)
   */
  public playWudhuWaterSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Water trickle cascade
      [600, 750, 900, 1100, 850, 1300, 950].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + idx * 0.08 + 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Trem / Transport Bell Ting-Ting (P2)
   */
  public playTremBellSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      [1318.51, 1567.98, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0.001, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.14 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.35);
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound: Lantern Glow & Star Sparkle (P5)
   */
  public playLanternSparkle() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      [1046.5, 1318.51, 1567.98, 2093.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.6);
      });
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: MasjidPhase) {
    this.currentPhase = phase;
    if (phase === 'LANDMARK') {
      this.playMasjidChime();
    } else if (phase === 'PATHWAY') {
      this.playTremBellSound();
    } else if (phase === 'WUDHU') {
      this.playWudhuWaterSound();
    } else if (phase === 'MINARET') {
      this.playLanternSparkle();
    } else if (phase === 'FRIDAY_PARADE') {
      this.startFridayParade(20);
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G41-PHASE-NAV',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Masjid Al-Barakah navigated to phase: ${phase}`
    });
  }

  public setTimeOfDay(time: TimeOfDay) {
    this.timeOfDay = time;
    this.isLanternLit = time === 'DUSK' || time === 'NIGHT' || time === 'DAWN';
    this.playLanternSparkle();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G41-TIME-CHANGE',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Masjid Al-Barakah time of day changed to: ${time}`
    });
  }

  public toggleDoor() {
    this.isDoorOpen = !this.isDoorOpen;
    this.playMasjidChime();
    this.notify();
  }

  public toggleLanterns() {
    this.isLanternLit = !this.isLanternLit;
    this.playLanternSparkle();
    this.notify();
  }

  public selectTransport(transportId: TransportId) {
    this.activeTransport = transportId;
    this.playTremBellSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G41-SELECT-TRANSPORT',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Selected transport: ${this.transports[transportId].name}`
    });
  }

  public selectWudhuStep(stepNumber: number) {
    this.activeWudhuStep = stepNumber;
    this.playWudhuWaterSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G41-SELECT-WUDHU',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Explored wudhu step: ${stepNumber}`
    });
  }

  public startFridayParade(durationSeconds: number = 20) {
    if (this.paradeTimer) {
      clearInterval(this.paradeTimer);
    }
    this.isFridayParadeActive = true;
    this.fridayParadeSeconds = 0;
    this.playTremBellSound();
    this.notify();

    this.paradeTimer = setInterval(() => {
      this.fridayParadeSeconds += 1;
      if (this.fridayParadeSeconds >= durationSeconds) {
        clearInterval(this.paradeTimer);
        this.isFridayParadeActive = false;
        this.fridayParadeSeconds = durationSeconds;
        this.playMasjidChime();
        this.notify();
      } else {
        if (this.fridayParadeSeconds % 4 === 0) {
          this.playTremBellSound();
        }
        this.notify();
      }
    }, 1000);

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G41-FRIDAY-PARADE',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Started Friday Barakah Parade (20s duration)`
    });
  }

  public stopFridayParade() {
    if (this.paradeTimer) {
      clearInterval(this.paradeTimer);
    }
    this.isFridayParadeActive = false;
    this.notify();
  }

  public collectSecretSurprise(name: string) {
    if (!this.collectedSecretSurprises.includes(name)) {
      this.collectedSecretSurprises = [...this.collectedSecretSurprises, name];
      this.playLanternSparkle();
      this.notify();

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G41-SECRET-SURPRISE',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Discovered secret barakah surprise: ${name}`
      });
    }
  }

  public startFullMasjidSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
    }
    this.isAutoSimulating = true;
    const times: TimeOfDay[] = ['DAWN', 'NOON', 'AFTERNOON', 'DUSK', 'NIGHT'];
    const phases: MasjidPhase[] = ['LANDMARK', 'PATHWAY', 'WUDHU', 'SHAF', 'MINARET', 'COURTYARD', 'FRIDAY_PARADE'];
    let idx = 0;

    this.simulationTimer = setInterval(() => {
      idx += 1;
      if (idx >= phases.length) {
        clearInterval(this.simulationTimer);
        this.isAutoSimulating = false;
        this.notify();
      } else {
        this.setTimeOfDay(times[idx % times.length]);
        this.setPhase(phases[idx]);
      }
    }, 4500);
  }

  public stopFullMasjidSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
    }
    this.isAutoSimulating = false;
    this.notify();
  }

  public getSnapshot(): MasjidSnapshot {
    return {
      currentPhase: this.currentPhase,
      timeOfDay: this.timeOfDay,
      isLanternLit: this.isLanternLit,
      isDoorOpen: this.isDoorOpen,
      isFridayParadeActive: this.isFridayParadeActive,
      fridayParadeSeconds: this.fridayParadeSeconds,
      activeTransport: this.activeTransport,
      activeWudhuStep: this.activeWudhuStep,
      collectedSecretSurprises: [...this.collectedSecretSurprises],
      isAutoSimulating: this.isAutoSimulating
    };
  }
}

export const masjidAlBarakahEngine = new MasjidAlBarakahEngine();
export default masjidAlBarakahEngine;
