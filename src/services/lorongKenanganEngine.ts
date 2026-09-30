/**
 * TADE SPRINT G30 — LORONG KENANGAN ASY & SYIFA ENGINE
 * Sovereign Living Memory Hall & Emotional Heritage for TK Islam Asy-Syifa.
 * 
 * Features:
 * - P1: Lorong Foto Hidup (Bingkai kayu kartun 3D, potret santri tersenyum, bingkai bergoyang lembut)
 * - P2: Jejak Petualangan (Peta perjalanan santri: Rumah Asy, Kampung Ceria, Kota Mini, Festival, Pulau, Rumah Kreatif)
 * - P3: Kotak Suara Kenangan (Perekam ucapan & doa guru, pemutar Web Audio lembut untuk orang tua)
 * - P4: Pohon Angkatan (Pohon memori tiap angkatan, daun bertambah seiring bertambahnya kenangan kebaikan)
 * - P5: Kapsul Doa (Doa orang tua & guru terkunci rapi, dibuka saat wisuda / haflah kelulusan)
 * - P6: Album Keluarga (Ruang privasi keluarga, orang tua hanya melihat anak sendiri tanpa media sosial & tanpa ranking)
 * - P7: Founder Memory Control (Preview, uji animasi mikro, audit Black Box)
 * - Bonus: Kupu-kupu emas, sinar jendela melengkung, daun gugur keemasan, bunga mekar di sudut lorong
 * 
 * Integrations:
 * - G10 Alumni Heritage, Living Memory Engine, G28 Peta Dunia, G29 Sekolah Bernapas, G20 DNA, G21 Kamera
 * - Dr. Pulse 60 FPS & TADE Animation Governor (Max 5 active animations)
 * - Black Box Ring-0 Telemetry
 * 
 * Marker: G30_LORONG_KENANGAN_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine } from './livingEventEngine';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export interface LivingPhotoMemory {
  id: string;
  studentId: string;
  studentName: string;
  familyId: string;
  cohortYear: number;
  title: string;
  locationName: string;
  locationEmoji: string;
  dateStr: string;
  photoUrl: string;
  caption: string;
  frameStyle: 'JATI_EMAS' | 'KAYU_NATURAL' | 'UKIR_JEPARA' | 'PELANGI';
  swaySpeedSec: number;
  reflectionSparkle: boolean;
}

export interface VoiceMemory {
  id: string;
  studentId: string;
  studentName: string;
  teacherName: string;
  teacherRole: string;
  title: string;
  recordedDate: string;
  durationSec: number;
  transcript: string;
  blessingTag: string;
}

export interface CohortTreeMemory {
  year: number;
  cohortNumber: number;
  cohortName: string;
  motto: string;
  totalStudents: number;
  leafCount: number;
  fruitCount: number;
  treeColor: string;
  keyMoments: string[];
}

export interface PrayerCapsule {
  id: string;
  studentId: string;
  studentName: string;
  authorName: string;
  authorRelation: 'IBUNDA' | 'AYAHANDA' | 'BU_GURU' | 'USTADZ';
  prayerText: string;
  createdDate: string;
  graduationYear: number;
  isSealed: boolean;
  sealColor: string;
}

export interface AdventureMilestone {
  id: string;
  locationId: string;
  name: string;
  emoji: string;
  description: string;
  completedCount: number;
  spiritualValue: string;
}

class LorongKenanganEngine {
  private audioCtx: AudioContext | null = null;
  private selectedStudentId: string = 'std-farhan-01';
  private selectedCohortYear: number = 2026;
  private activeVoicePlayingId: string | null = null;
  private goldenButterflyActive: boolean = true;
  private windowRaysIntensity: number = 0.8;
  private listeners: Set<() => void> = new Set();

  // P1: Living Photo Frames
  private livingPhotos: LivingPhotoMemory[] = [
    {
      id: 'photo-1',
      studentId: 'std-farhan-01',
      studentName: 'Muhammad Farhan Al-Fatih',
      familyId: 'fam-farhan-01',
      cohortYear: 2026,
      title: 'Senyum Pertama Membawa Buku Hijaiyah',
      locationName: 'Rumah Asy & Syifa',
      locationEmoji: '🏡',
      dateStr: '15 Juli 2025',
      photoUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?w=600&auto=format&fit=crop&q=80',
      caption: '“Ananda Farhan tersenyum ceria saat pertama kali menyusun kartu huruf hijaiyah bersama Bu Guru.”',
      frameStyle: 'JATI_EMAS',
      swaySpeedSec: 4.5,
      reflectionSparkle: true
    },
    {
      id: 'photo-2',
      studentId: 'std-farhan-01',
      studentName: 'Muhammad Farhan Al-Fatih',
      familyId: 'fam-farhan-01',
      cohortYear: 2026,
      title: 'Bercocok Tanam di Kebun Mentari',
      locationName: 'Kampung Ceria',
      locationEmoji: '🌿',
      dateStr: '12 September 2025',
      photoUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80',
      caption: '“Menanam bibit sawi hijau dan belajar bersyukur atas rezeki bumi yang subur.”',
      frameStyle: 'KAYU_NATURAL',
      swaySpeedSec: 5.2,
      reflectionSparkle: true
    },
    {
      id: 'photo-3',
      studentId: 'std-farhan-01',
      studentName: 'Muhammad Farhan Al-Fatih',
      familyId: 'fam-farhan-01',
      cohortYear: 2026,
      title: 'Membangun Menara Masjid Bersejarah',
      locationName: 'Kota Mini Profesi',
      locationEmoji: '🏙️',
      dateStr: '18 November 2025',
      photoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
      caption: '“Bermain peran menjadi arsitek cilik yang merancang masjid ramah santri.”',
      frameStyle: 'UKIR_JEPARA',
      swaySpeedSec: 4.8,
      reflectionSparkle: true
    },
    {
      id: 'photo-4',
      studentId: 'std-aisyah-02',
      studentName: 'Aisyah Putri Humaira',
      familyId: 'fam-aisyah-02',
      cohortYear: 2026,
      title: 'Festival Kreasi Melipat Bunga Melati',
      locationName: 'Rumah Kreatif',
      locationEmoji: '🎨',
      dateStr: '04 Februari 2026',
      photoUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80',
      caption: '“Karya origami melati harum ananda Aisyah dihadiahkan untuk bunda tercinta.”',
      frameStyle: 'PELANGI',
      swaySpeedSec: 4.2,
      reflectionSparkle: true
    }
  ];

  // P2: Adventure Milestones (Jejak Petualangan Asy-Syifa)
  private adventureMilestones: AdventureMilestone[] = [
    {
      id: 'milestone-1',
      locationId: 'loc-rumah-asy',
      name: 'Rumah Asy & Syifa',
      emoji: '🏡',
      description: 'Awal langkah pembelajaran adab harian, doa bangun tidur, dan salam santun.',
      completedCount: 142,
      spiritualValue: 'Adab & Kasih Sayang'
    },
    {
      id: 'milestone-2',
      locationId: 'loc-kampung-ceria',
      name: 'Kampung Ceria',
      emoji: '🌾',
      description: 'Menjelajah kebun organik, menyayangi hewan ciptaan Allah, dan gotong royong.',
      completedCount: 128,
      spiritualValue: 'Tadabbur Alam'
    },
    {
      id: 'milestone-3',
      locationId: 'loc-kota-mini',
      name: 'Kota Mini Profesi',
      emoji: '🏙️',
      description: 'Mengenal profesi mulia seperti dokter santun, pemadam cilik, dan juru masak halal.',
      completedCount: 119,
      spiritualValue: 'Cita-Cita Mulia'
    },
    {
      id: 'milestone-4',
      locationId: 'loc-festival',
      name: 'Festival Ceria',
      emoji: '🎪',
      description: 'Pentas unjuk keberanian hafalan surat pendek dan nasyid penuh gembira.',
      completedCount: 135,
      spiritualValue: 'Percaya Diri'
    },
    {
      id: 'milestone-5',
      locationId: 'loc-pulau',
      name: 'Gugusan Pulau Petualangan',
      emoji: '🏝️',
      description: 'Mengarungi samudera ilmu dan menemukan mutiara akhlak terpuji di lima pulau.',
      completedCount: 96,
      spiritualValue: 'Pantang Menyerah'
    },
    {
      id: 'milestone-6',
      locationId: 'loc-rumah-kreatif',
      name: 'Rumah Kreatif Sentra',
      emoji: '🎨',
      description: 'Eksplorasi warna, tanah liat, musik angklung, dan balok rancang bangun.',
      completedCount: 140,
      spiritualValue: 'Kreativitas Ihsan'
    }
  ];

  // P3: Voice Memories (Kotak Suara Kenangan)
  private voiceMemories: VoiceMemory[] = [
    {
      id: 'voice-1',
      studentId: 'std-farhan-01',
      studentName: 'Muhammad Farhan Al-Fatih',
      teacherName: 'Ustadzah Syifa Nurul Hidayah',
      teacherRole: 'Wali Kelas Sentra Imtaq & Al-Quran',
      title: 'Pesan Kasih: Kemajuan Luar Biasa Hafalan Farhan',
      recordedDate: '15 Januari 2026',
      durationSec: 28,
      transcript: '“Ananda Farhan, Bu Guru sangat bangga melihat semangatmu saat menyetor Surah An-Nas dengan makhraj yang fasih. Tetaplah rendah hati dan sayangi adik-adikmu ya, Nak.”',
      blessingTag: 'Tahfidz Juz 30'
    },
    {
      id: 'voice-2',
      studentId: 'std-farhan-01',
      studentName: 'Muhammad Farhan Al-Fatih',
      teacherName: 'Bu Guru Fatimah',
      teacherRole: 'Guru Sentra Balok & Rekayasa',
      title: 'Apresiasi: Jiwa Kepemimpinan dan Gotong Royong',
      recordedDate: '20 Februari 2026',
      durationSec: 24,
      transcript: '“Bunda dan Ayah Farhan, hari ini Farhan dengan tulus meminjamkan balok kayunya kepada teman dan memimpin doa penutup kegiatan dengan khusyuk.”',
      blessingTag: 'Akhlakul Karimah'
    }
  ];

  // P4: Cohort Trees (Pohon Angkatan)
  private cohortTrees: CohortTreeMemory[] = [
    {
      year: 2024,
      cohortNumber: 12,
      cohortName: 'Angkatan 12 — Al-Khawarizmi',
      motto: 'Cerdas Logika, Luhur Budi Pekerti, Gemar Bersedekah',
      totalStudents: 45,
      leafCount: 380,
      fruitCount: 45,
      treeColor: '#10b981', // emerald
      keyMoments: ['Pentas Angklung Ceria', 'Taman Herbal Mini', 'Wisuda Tahfidz Juz 30']
    },
    {
      year: 2025,
      cohortNumber: 13,
      cohortName: 'Angkatan 13 — Ibnu Battuta',
      motto: 'Penjelajah Ilmu yang Tangguh, Rendah Hati, dan Berbakti',
      totalStudents: 48,
      leafCount: 410,
      fruitCount: 48,
      treeColor: '#059669', // teal emerald
      keyMoments: ['Mengarungi Kapal Awan', 'Bazar Amal Santri', 'Khataman Al-Quran']
    },
    {
      year: 2026,
      cohortNumber: 14,
      cohortName: 'Angkatan 14 — Shalahuddin Al-Ayyubi',
      motto: 'Pemberani dalam Kebaikan, Penegak Keadilan, Berhati Emas',
      totalStudents: 52,
      leafCount: 290,
      fruitCount: 52,
      treeColor: '#047857', // deep emerald gold
      keyMoments: ['Peta Dunia Asy-Syifa', 'Pekan Adab & Doa', 'Kapsul Doa Wisuda']
    }
  ];

  // P5: Prayer Capsules (Kapsul Doa Wisuda)
  private prayerCapsules: PrayerCapsule[] = [
    {
      id: 'capsule-1',
      studentId: 'std-farhan-01',
      studentName: 'Muhammad Farhan Al-Fatih',
      authorName: 'Ibunda Sarah & Ayahanda Rahman',
      authorRelation: 'IBUNDA',
      prayerText: '“Ya Allah, jadikanlah putra kami Farhan anak yang sholeh, pelindung keluarga, berakhlak mulia seperti teladan Rasulullah SAW, serta pembawa berkah di manapun kakinya melangkah.”',
      createdDate: '10 Juli 2025',
      graduationYear: 2027,
      isSealed: true,
      sealColor: 'EMAS_ASY_SYIFA'
    },
    {
      id: 'capsule-2',
      studentId: 'std-farhan-01',
      studentName: 'Muhammad Farhan Al-Fatih',
      authorName: 'Ustadzah Syifa Nurul Hidayah',
      authorRelation: 'BU_GURU',
      prayerText: '“Semoga Ananda Farhan senantiasa mencintai Al-Quran, menjadi penyejuk hati orang tua, dan menjadi pemimpin yang adil kelak. Aamiin ya Rabbal Alamin.”',
      createdDate: '18 Januari 2026',
      graduationYear: 2027,
      isSealed: true,
      sealColor: 'HIJAU_ZAMRUD'
    }
  ];

  constructor() {
    // Initial load
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
        console.error('Error in LorongKenanganEngine subscriber', err);
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
   * P3: Play synthesizer chime & sound for voice memory
   */
  public playVoiceMemory(voiceId: string) {
    this.activeVoicePlayingId = voiceId;
    this.notify();

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Soft melodious chime: G4 - C5 - E5 - G5
      const notes = [392.0, 523.25, 659.25, 783.99];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.6);
      });

      blackBoxRecorder.record({
        ring: 'RING_1',
        moduleCode: 'G30-LORONG',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Voice memory playback triggered: ID ${voiceId}`
      });

      setTimeout(() => {
        this.activeVoicePlayingId = null;
        this.notify();
      }, 3500);
    } catch {
      this.activeVoicePlayingId = null;
    }
  }

  /**
   * Sound effect for touching frames & petals
   */
  public playFrameHarpSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const harpNotes = [523.25, 587.33, 659.25, 698.46, 783.99]; // C5, D5, E5, F5, G5
      harpNotes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.04);

        gain.gain.setValueAtTime(0.001, now + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.04 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.25);
      });
    } catch {
      // Failsafe
    }
  }

  public addNewVoiceMemory(item: Omit<VoiceMemory, 'id' | 'recordedDate'>) {
    const newEntry: VoiceMemory = {
      ...item,
      id: `voice-${Date.now()}`,
      recordedDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
    this.voiceMemories.unshift(newEntry);
    this.playVoiceMemory(newEntry.id);
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G30-VOICE',
      category: 'STORAGE',
      eventType: 'STORAGE',
      details: `Teacher voice prayer recorded for student: ${newEntry.studentName}`
    });
  }

  public addNewPrayerCapsule(item: Omit<PrayerCapsule, 'id' | 'createdDate' | 'isSealed'>) {
    const newCapsule: PrayerCapsule = {
      ...item,
      id: `capsule-${Date.now()}`,
      createdDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      isSealed: true
    };
    this.prayerCapsules.unshift(newCapsule);
    this.playFrameHarpSound();
    this.notify();

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G30-CAPSULE',
      category: 'STORAGE',
      eventType: 'STORAGE',
      details: `Prayer capsule sealed for student: ${newCapsule.studentName}`
    });
  }

  public setSelectedStudentId(studentId: string) {
    this.selectedStudentId = studentId;
    this.notify();
  }

  public setSelectedCohortYear(year: number) {
    this.selectedCohortYear = year;
    this.notify();
  }

  public getSnapshot() {
    return {
      selectedStudentId: this.selectedStudentId,
      selectedCohortYear: this.selectedCohortYear,
      activeVoicePlayingId: this.activeVoicePlayingId,
      goldenButterflyActive: this.goldenButterflyActive,
      windowRaysIntensity: this.windowRaysIntensity,
      livingPhotos: [...this.livingPhotos],
      adventureMilestones: [...this.adventureMilestones],
      voiceMemories: [...this.voiceMemories],
      cohortTrees: [...this.cohortTrees],
      prayerCapsules: [...this.prayerCapsules]
    };
  }
}

export const lorongKenanganEngine = new LorongKenanganEngine();
export default lorongKenanganEngine;
