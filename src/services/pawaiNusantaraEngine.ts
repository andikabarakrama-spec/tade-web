/**
 * TADE SPRINT G38 — PAWAI NUSANTARA & KAMPUNG INDONESIA ENGINE
 * Nusantara Cultural Parade & Indonesian Heritage Simulator for Early Childhood (PAUD/TK)
 * 
 * Features:
 * - P1: Gerbang Nusantara (Gapura batik megah, bendera merah putih, balon merah putih, Asy menyapa "Selamat datang di Kampung Indonesia.")
 * - P2: Pawai Nusantara (20 Detik) (Pawai keliling: Asy, Syifa, 6 Sahabat, Bus MBG, Kereta Cerita)
 * - P3: Rumah Adat Mini (Rumah Joglo, Rumah Gadang, Rumah Honai, Rumah Tongkonan, Rumah Limas - salam ramah berkarakter)
 * - P4: Pakaian Daerah Ceria (Asy & Syifa berganti pakaian adat nusantara yang sopan, elegan, tanpa stereotip berlebihan)
 * - P5: Alat Musik Hidup (Angklung, Gamelan, Kolintang, Tifa, Sasando - hidup, tersenyum, dan berbunyi merdu)
 * - P6: Paspor Nusantara (Cap kenangan stempel kepulauan nusantara tanpa skor & ranking)
 * - P7: Founder Nusantara Control (Uji pawai, uji musik tradisional, simulasi daerah, audit Black Box Ring-0)
 * - Bonus: Layang-layang batik, kupu-kupu merah putih, awan motif batik, pohon kelapa bergoyang
 * 
 * Marker: G38_PAWAI_NUSANTARA_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type NusantaraPhase =
  | 'GATE_NUSANTARA'  // P1: Gerbang batik & bendera merah putih
  | 'PARADE_WALK'    // P2: Pawai nusantara 20s
  | 'TRADITIONAL_HOUSES' // P3: Rumah adat mini bersuara
  | 'CULTURAL_COSTUMES'  // P4: Pakaian daerah ceria
  | 'LIVING_INSTRUMENTS' // P5: Alat musik tradisional hidup
  | 'PASSPORT_STAMPS';   // P6: Paspor nusantara & cap apresiasi

export type TraditionalHouseId = 'JOGLO' | 'GADANG' | 'HONAI' | 'TONGKONAN' | 'LIMAS';
export type InstrumentId = 'ANGKLUNG' | 'GAMELAN' | 'KOLINTANG' | 'TIFA' | 'SASANDO';
export type RegionCostumeId = 'JAWA' | 'MINANG' | 'PAPUA' | 'TORAJASULAWESI' | 'SUMATERA_SELATAN' | 'BALI';

export interface TraditionalHouse {
  id: TraditionalHouseId;
  name: string;
  region: string;
  emoji: string;
  greeting: string;
  characteristic: string;
  ornament: string;
}

export interface TraditionalInstrument {
  id: InstrumentId;
  name: string;
  origin: string;
  icon: string;
  soundDescription: string;
  notes: number[]; // Frequencies for web audio synthesis
}

export interface CostumeProfile {
  id: RegionCostumeId;
  regionName: string;
  asyOutfit: string;
  syifaOutfit: string;
  headdress: string;
  clothPattern: string;
  colorTone: string;
}

export interface NusantaraSnapshot {
  currentPhase: NusantaraPhase;
  isParadeMoving: boolean;
  paradeProgressSeconds: number;
  activeHouse: TraditionalHouseId;
  activeCostume: RegionCostumeId;
  activeInstrument: InstrumentId;
  unlockedStamps: string[];
  isAutoPlayingNusantara: boolean;
}

class PawaiNusantaraEngine {
  private audioCtx: AudioContext | null = null;
  private currentPhase: NusantaraPhase = 'GATE_NUSANTARA';
  private isParadeMoving: boolean = false;
  private paradeProgressSeconds: number = 0;
  private paradeTimer: any = null;
  private activeHouse: TraditionalHouseId = 'JOGLO';
  private activeCostume: RegionCostumeId = 'JAWA';
  private activeInstrument: InstrumentId = 'ANGKLUNG';
  private unlockedStamps: string[] = ['Jawa (Joglo)', 'Sumatera Barat (Gadang)', 'Papua (Honai)'];
  private isAutoPlayingNusantara: boolean = false;
  private autoPlayTimer: any = null;

  private listeners: Set<() => void> = new Set();

  public readonly traditionalHouses: Record<TraditionalHouseId, TraditionalHouse> = {
    JOGLO: {
      id: 'JOGLO',
      name: 'Rumah Joglo',
      region: 'Jawa Tengah & DI Yogyakarta',
      emoji: '🏛️',
      greeting: '“Sugeng Rawuh! Selamat datang di pendopo keramahan dan kesantunan budi pekerti.”',
      characteristic: 'Memiliki atap tajug megah dengan soko guru kayu jati yang kokoh dan penuh ketenangan.',
      ornament: 'Ukiran Lung-Lungan Bunga Melati'
    },
    GADANG: {
      id: 'GADANG',
      name: 'Rumah Gadang',
      region: 'Sumatera Barat (Minangkabau)',
      emoji: '🏯',
      greeting: '“Salamaik Datang! Rumah bagonjong elok lambang musyawarah dan kebersamaan kaum keluarga.”',
      characteristic: 'Atap melengkung runcing menyerupai tanduk kerbau (Gonjong) yang menjulang anggun ke langit.',
      ornament: 'Ukir Pucuk Rebung & Itik Pulang Petang'
    },
    HONAI: {
      id: 'HONAI',
      name: 'Rumah Honai',
      region: 'Papua Pegunungan',
      emoji: '🛖',
      greeting: '“Koya-Koya! Selamat datang di rumah lingkaran kami yang hangat dan penuh persaudaraan tulus.”',
      characteristic: 'Berbentuk bulat kubah beratap jerami tebal yang menjaga kehangatan keluarga di daerah pegunungan sejuk.',
      ornament: 'Anyaman Alami Rotan & Kayu Hutan Lestari'
    },
    TONGKONAN: {
      id: 'TONGKONAN',
      name: 'Rumah Tongkonan',
      region: 'Sulawesi Selatan (Toraja)',
      emoji: '⛩️',
      greeting: '“Salama’ki! Selamat datang di tongkonan pemersatu ikatan kekeluargaan lintas generasi.”',
      characteristic: 'Atap melengkung menyerupai perahu leluhur dengan deretan ornamen ukir khas bernuansa merah dan emas.',
      ornament: 'Ukir Pa’ssura & Tanduk Kerbau Kemuliaan'
    },
    LIMAS: {
      id: 'LIMAS',
      name: 'Rumah Limas',
      region: 'Sumatera Selatan (Palembang)',
      emoji: '🏡',
      greeting: '“Kelebuan ati! Selamat datang di rumah bertingkat kekeluargaan nan ramah bersahaja.”',
      characteristic: 'Memiliki lantai bertingkat-tingkat (Kekijing) yang melambangkan penghormatan kepada orang tua dan tamu.',
      ornament: 'Ukiran Daun Simpur Bersepuh Emas'
    }
  };

  public readonly traditionalInstruments: Record<InstrumentId, TraditionalInstrument> = {
    ANGKLUNG: {
      id: 'ANGKLUNG',
      name: 'Angklung Bambu',
      origin: 'Jawa Barat (Sunda)',
      icon: '🎋',
      soundDescription: 'Getaran bambu yang berpadu menghasilkan nada diatonis ceria dan harmonis.',
      notes: [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5] // C5, D5, E5, G5, A5, C6 (Pelog/Diad)
    },
    GAMELAN: {
      id: 'GAMELAN',
      name: 'Gamelan Saron & Gong',
      origin: 'Jawa & Bali',
      icon: '🔔',
      soundDescription: 'Dentingan perunggu keemasan yang menentramkan jiwa dan mengalunkan kedamaian.',
      notes: [261.63, 293.66, 329.63, 392.0, 440.0] // Slendro Pentatonic
    },
    KOLINTANG: {
      id: 'KOLINTANG',
      name: 'Kolintang Kayu',
      origin: 'Sulawesi Utara (Minahasa)',
      icon: '🪵',
      soundDescription: 'Ketukan bilah kayu cempaka yang berdentang riang mengiringi tarian kegembiraan.',
      notes: [440.0, 493.88, 554.37, 659.25, 739.99] // Bright major
    },
    TIFA: {
      id: 'TIFA',
      name: 'Tifa Berirama',
      origin: 'Maluku & Papua',
      icon: '🪘',
      soundDescription: 'Dentuman tabung kayu berbalut kulit yang menyemangati langkah pawai persatuan.',
      notes: [130.81, 164.81, 196.0] // Deep resonant pulse
    },
    SASANDO: {
      id: 'SASANDO',
      name: 'Sasando Daun Lontar',
      origin: 'Nusa Tenggara Timur (Rote)',
      icon: '🪕',
      soundDescription: 'Petikan senar harpa melingkar dalam wadah daun lontar yang mengalun bagai gemericik air jernih.',
      notes: [523.25, 659.25, 783.99, 987.77, 1046.5] // Gentle arpeggio
    }
  };

  public readonly costumes: Record<RegionCostumeId, CostumeProfile> = {
    JAWA: {
      id: 'JAWA',
      regionName: 'Jawa (Beskap & Kebaya Kartun Santun)',
      asyOutfit: 'Beskap Cokelat Keemasan dengan Blangkon Rapi & Kain Batik Parang',
      syifaOutfit: 'Kebaya Pastel Cantik dengan Kerudung Ceria & Jarik Batik Lereng',
      headdress: 'Blangkon Halus & Bros Bunga Melati',
      clothPattern: 'Batik Parang Barong Santun',
      colorTone: 'from-amber-600 to-amber-900'
    },
    MINANG: {
      id: 'MINANG',
      regionName: 'Sumatera Barat (Minangkabau)',
      asyOutfit: 'Baju Teluk Belanga Merah Maroon dengan Salempang Songket Emas',
      syifaOutfit: 'Baju Kurung Basiba Biru Safir dengan Tikuluak Tanduk Rusa Mini Lucu',
      headdress: 'Deta Saluak & Tikuluak Cantik',
      clothPattern: 'Songket Pandai Sikek Tenun Emas',
      colorTone: 'from-red-600 to-rose-900'
    },
    PAPUA: {
      id: 'PAPUA',
      regionName: 'Papua (Busana Kain Ceria Cendrawasih)',
      asyOutfit: 'Kemeja Katun Etnik Papua dengan Rompi Lukis & Hiasan Kepala Bulu Sintetis Ramah',
      syifaOutfit: 'Gaun Katun Ornamen Asmat Ceria dengan Noken Mini Menggemaskan',
      headdress: 'Mahkota Bulu Sintetis Lembut & Noken Rajut',
      clothPattern: 'Motif Ukir Asmat & Flora Hutan Papua',
      colorTone: 'from-emerald-600 to-teal-900'
    },
    TORAJASULAWESI: {
      id: 'TORAJASULAWESI',
      regionName: 'Sulawesi Selatan (Toraja & Bugis)',
      asyOutfit: 'Baju Seppa Tallu Ungu Emas dengan Passapu Ikat Kepala Gagah',
      syifaOutfit: 'Baju Bodo Sutera Oranye Cerah dengan Hiasan Manik Manis',
      headdress: 'Passapu Songkok Recca & Kembang Goyang Mini',
      clothPattern: 'Sutera Lagosi & Pa’ssura Toraja',
      colorTone: 'from-purple-600 to-indigo-900'
    },
    SUMATERA_SELATAN: {
      id: 'SUMATERA_SELATAN',
      regionName: 'Sumatera Selatan (Aesan Gede Ceria)',
      asyOutfit: 'Jubah Beludru Merah Emas dengan Tanjak Palembang Bersahaja',
      syifaOutfit: 'Baju Gandik Beludru dengan Selendang Songket Limar Keemasan',
      headdress: 'Tanjak Melayu & Mahkota Bunga Rampai',
      clothPattern: 'Songket Limar Palembang',
      colorTone: 'from-yellow-600 to-red-800'
    },
    BALI: {
      id: 'BALI',
      regionName: 'Bali (Payas Agung Versi PAUD)',
      asyOutfit: 'Safari Putih Bersih dengan Udeng Emas & Kampuh Poleng Ceria',
      syifaOutfit: 'Kebaya Kuning Kunyit dengan Selendang Pinggang & Bunga Kamboja',
      headdress: 'Udeng Ikat Kepala & Bunga Jepun Kamboja',
      clothPattern: 'Kain Endek & Songket Bali Cantik',
      colorTone: 'from-sky-600 to-blue-900'
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
        console.error('Error in PawaiNusantaraEngine subscriber', err);
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
   * Sound synthesizer for Traditional Instruments (P5)
   */
  public playInstrumentSound(instId: InstrumentId) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const instrument = this.traditionalInstruments[instId];

      if (instId === 'ANGKLUNG') {
        // Bamboo marimba chime
        instrument.notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);

          gain.gain.setValueAtTime(0.001, now + idx * 0.1);
          gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.1 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.45);
        });
      } else if (instId === 'GAMELAN') {
        // Metallic gong resonance
        instrument.notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);

          gain.gain.setValueAtTime(0.001, now + idx * 0.15);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.15 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.8);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 0.8);
        });
      } else if (instId === 'TIFA') {
        // Deep drum pulse
        instrument.notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.2);
          osc.frequency.exponentialRampToValueAtTime(50, now + idx * 0.2 + 0.25);

          gain.gain.setValueAtTime(0.001, now + idx * 0.2);
          gain.gain.linearRampToValueAtTime(0.16, now + idx * 0.2 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.2);
          osc.stop(now + idx * 0.2 + 0.35);
        });
      } else if (instId === 'SASANDO') {
        // Harp strumming
        instrument.notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);

          gain.gain.setValueAtTime(0.001, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.07 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.6);
        });
      } else {
        // Kolintang wood strike
        instrument.notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);

          gain.gain.setValueAtTime(0.001, now + idx * 0.09);
          gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.09 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.3);
        });
      }

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G38-MUSIC-PLAY',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Played traditional instrument: ${instrument.name} (${instrument.origin})`
      });
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for Passport Stamp (P6)
   */
  public playPassportStampSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Soft wooden thud + sparkling chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.05); // A5

      gain2.gain.setValueAtTime(0.001, now + 0.05);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.4);
    } catch {
      // Failsafe
    }
  }

  /**
   * Sound synthesizer for Gate Welcome Fanfare (P1)
   */
  public playGateFanfare() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Gamelan & trumpet harmonic intro
      const notes = [392.0, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.09, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.6);
      });
    } catch {
      // Failsafe
    }
  }

  public setPhase(phase: NusantaraPhase) {
    this.currentPhase = phase;
    if (phase === 'GATE_NUSANTARA') {
      this.playGateFanfare();
    } else if (phase === 'PARADE_WALK') {
      this.startParade(20);
    } else if (phase === 'LIVING_INSTRUMENTS') {
      this.playInstrumentSound(this.activeInstrument);
    } else if (phase === 'PASSPORT_STAMPS') {
      this.playPassportStampSound();
    }
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G38-PHASE-NAV',
      category: 'NAVIGATE',
      eventType: 'NAVIGATE',
      details: `Pawai Nusantara navigated to: ${phase}`
    });
  }

  public startParade(durationSeconds: number = 20) {
    if (this.paradeTimer) {
      clearInterval(this.paradeTimer);
    }

    this.isParadeMoving = true;
    this.paradeProgressSeconds = 0;
    this.playGateFanfare();
    this.notify();

    this.paradeTimer = setInterval(() => {
      this.paradeProgressSeconds += 1;
      if (this.paradeProgressSeconds >= durationSeconds) {
        clearInterval(this.paradeTimer);
        this.isParadeMoving = false;
        this.paradeProgressSeconds = durationSeconds;
        this.notify();
      } else {
        if (this.paradeProgressSeconds % 4 === 0) {
          this.playInstrumentSound('ANGKLUNG');
        }
        this.notify();
      }
    }, 1000);
  }

  public stopParade() {
    if (this.paradeTimer) {
      clearInterval(this.paradeTimer);
    }
    this.isParadeMoving = false;
    this.notify();
  }

  public selectHouse(houseId: TraditionalHouseId) {
    this.activeHouse = houseId;
    this.playInstrumentSound('GAMELAN');
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G38-SELECT-HOUSE',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Explored traditional house: ${this.traditionalHouses[houseId].name}`
    });
  }

  public selectCostume(costumeId: RegionCostumeId) {
    this.activeCostume = costumeId;
    this.playInstrumentSound('SASANDO');
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G38-SELECT-COSTUME',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Changed to traditional costume: ${this.costumes[costumeId].regionName}`
    });
  }

  public selectInstrument(instId: InstrumentId) {
    this.activeInstrument = instId;
    this.playInstrumentSound(instId);
    this.notify();
  }

  public addPassportStamp(stampName: string) {
    if (!this.unlockedStamps.includes(stampName)) {
      this.unlockedStamps.push(stampName);
      this.playPassportStampSound();
      this.notify();

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G38-ADD-STAMP',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Nusantara passport stamped with region: ${stampName}`
      });
    }
  }

  /**
   * P7: Full Nusantara Simulation
   */
  public startFullNusantaraSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    this.isAutoPlayingNusantara = true;
    const phases: NusantaraPhase[] = [
      'GATE_NUSANTARA',
      'PARADE_WALK',
      'TRADITIONAL_HOUSES',
      'CULTURAL_COSTUMES',
      'LIVING_INSTRUMENTS',
      'PASSPORT_STAMPS'
    ];

    let currentIdx = 0;
    this.setPhase(phases[currentIdx]);

    this.autoPlayTimer = setInterval(() => {
      currentIdx += 1;
      if (currentIdx >= phases.length) {
        clearInterval(this.autoPlayTimer);
        this.isAutoPlayingNusantara = false;
        this.notify();
      } else {
        this.setPhase(phases[currentIdx]);
      }
    }, 5000);
  }

  public stopFullNusantaraSimulation() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    this.isAutoPlayingNusantara = false;
    this.notify();
  }

  public getSnapshot(): NusantaraSnapshot {
    return {
      currentPhase: this.currentPhase,
      isParadeMoving: this.isParadeMoving,
      paradeProgressSeconds: this.paradeProgressSeconds,
      activeHouse: this.activeHouse,
      activeCostume: this.activeCostume,
      activeInstrument: this.activeInstrument,
      unlockedStamps: [...this.unlockedStamps],
      isAutoPlayingNusantara: this.isAutoPlayingNusantara
    };
  }
}

export const pawaiNusantaraEngine = new PawaiNusantaraEngine();
export default pawaiNusantaraEngine;
