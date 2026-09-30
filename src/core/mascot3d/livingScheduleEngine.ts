/**
 * TADE RC97 — R792: Living Schedule Engine
 * Jadwal Alami dan Rutinitas Harian Maskot Asy (Santri Cilik TK Asy Syifa)
 * Sinkron dengan jam lokal perangkat, non-repetitif, berbasis adab islami
 */

import { EmotionalStateEngine } from './emotionalStateEngine';

export type TimePeriod = 'MORNING' | 'MIDDAY' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export interface ScheduleActivity {
  id: string;
  period: TimePeriod;
  title: string;
  description: string;
  suggestedEmotion: 'HAPPY' | 'CURIOUS' | 'THINKING' | 'PROUD' | 'SHY' | 'SLEEPY' | 'PRAYING';
  dialogueSnippet: string;
  doaTitle?: string;
  iconName: string;
}

export interface CurrentScheduleStatus {
  period: TimePeriod;
  periodName: string;
  currentHour: number;
  currentMinute: number;
  activeActivity: ScheduleActivity;
  nextPeriodName: string;
  timeRemainingMinutes: number;
  isSimulated: boolean;
}

export class LivingScheduleEngine {
  private static instance: LivingScheduleEngine;
  private simulatedHour: number | null = null;
  private scheduleBank: Record<TimePeriod, ScheduleActivity[]> = {
    MORNING: [
      {
        id: 'ACT-M1',
        period: 'MORNING',
        title: 'Semangat Pagi & Doa Belajar',
        description: 'Menyambut hari dengan senyum, berwudhu, dan membaca doa sebelum belajar.',
        suggestedEmotion: 'HAPPY',
        dialogueSnippet: 'Assalamu’alaikum! Selamat pagi bunda dan ustadzah. Bismillah, mari mulai hari dengan ceria!',
        doaTitle: 'Doa Sebelum Belajar',
        iconName: 'Sun'
      },
      {
        id: 'ACT-M2',
        period: 'MORNING',
        title: 'Muroja’ah Surat Pendek',
        description: 'Mengingat kembali hafalan surat An-Nas dan Al-Falaq dengan riang.',
        suggestedEmotion: 'PRAYING',
        dialogueSnippet: 'Pagi yang berkah! Jangan lupa basahi lisan kita dengan shalawat dan muroja’ah ya.',
        doaTitle: 'Doa Pembuka Hati',
        iconName: 'BookOpen'
      },
      {
        id: 'ACT-M3',
        period: 'MORNING',
        title: 'Senam Pagi Santri Sehat',
        description: 'Latihan gerak ceria agar raga kuat beribadah dan menuntut ilmu.',
        suggestedEmotion: 'HAPPY',
        dialogueSnippet: 'Badan sehat, hati gembira! Asy siap menemani administrasi sekolah hari ini.',
        iconName: 'Activity'
      }
    ],
    MIDDAY: [
      {
        id: 'ACT-D1',
        period: 'MIDDAY',
        title: 'Istirahat Siang & Makan Sehat',
        description: 'Membaca doa sebelum makan, duduk dengan tertib, dan makan dengan tangan kanan.',
        suggestedEmotion: 'HAPPY',
        dialogueSnippet: 'Waktunya istirahat sejenak! Jangan lupa baca Bismillah dan gunakan tangan kanan ya.',
        doaTitle: 'Doa Sebelum Makan',
        iconName: 'Utensils'
      },
      {
        id: 'ACT-D2',
        period: 'MIDDAY',
        title: 'Persiapan Sholat Dzuhur Berjamaah',
        description: 'Berwudhu dengan hemat air dan merapikan shaf sholat di musholla.',
        suggestedEmotion: 'PRAYING',
        dialogueSnippet: 'Alhamdulillah sudah masuk waktu Dzuhur. Mari istirahatkan jemari sejenak untuk sholat.',
        doaTitle: 'Niat Wudhu & Doa Setelah Wudhu',
        iconName: 'Sparkles'
      }
    ],
    AFTERNOON: [
      {
        id: 'ACT-A1',
        period: 'AFTERNOON',
        title: 'Evaluasi & Doa Kafaratul Majlis',
        description: 'Menutup kelas dengan bersyukur dan merapikan alat belajar ke tempatnya.',
        suggestedEmotion: 'PROUD',
        dialogueSnippet: 'Hebat sekali kerja keras hari ini! Semoga ilmu yang dipelajari membawa keberkahan.',
        doaTitle: 'Doa Kafaratul Majlis',
        iconName: 'HeartHandshake'
      },
      {
        id: 'ACT-A2',
        period: 'AFTERNOON',
        title: 'Merapikan Meja & Dokumen',
        description: 'Menjaga kebersihan dan kerapian ruang kerja TK Asy Syifa.',
        suggestedEmotion: 'CURIOUS',
        dialogueSnippet: 'Kebersihan adalah sebagian dari iman. Ruang kerja rapi membuat hati tenteram.',
        iconName: 'FolderCheck'
      }
    ],
    EVENING: [
      {
        id: 'ACT-E1',
        period: 'EVENING',
        title: 'Waktu Maghrib & Tadarus Keluarga',
        description: 'Berkumpul bersama keluarga dan menyimak ayat suci Al-Qur’an.',
        suggestedEmotion: 'PRAYING',
        dialogueSnippet: 'Selamat petang! Waktu berkah menjelang malam, mari perbanyak istighfar.',
        doaTitle: 'Doa Memohon Ampunan',
        iconName: 'Moon'
      }
    ],
    NIGHT: [
      {
        id: 'ACT-N1',
        period: 'NIGHT',
        title: 'Istirahat Malam & Doa Tidur',
        description: 'Mengantuk santun, memaafkan sesama sebelum tidur, dan membaca doa tidur.',
        suggestedEmotion: 'SLEEPY',
        dialogueSnippet: 'Hoam... Asy mulai mengantuk. Jangan lupa istirahat yang cukup ya sahabat TADE.',
        doaTitle: 'Doa Sebelum Tidur',
        iconName: 'Bed'
      },
      {
        id: 'ACT-N2',
        period: 'NIGHT',
        title: 'Penjagaan Malam Hening',
        description: 'Sistem tenang, menjaga ketenangan malam tanpa gangguan notifikasi.',
        suggestedEmotion: 'SLEEPY',
        dialogueSnippet: 'Selamat malam... Semoga tidur nyenyak dalam lindungan Allah SWT.',
        doaTitle: 'Ayat Kursi & Tiga Qul',
        iconName: 'Shield'
      }
    ]
  };

  private constructor() {}

  public static getInstance(): LivingScheduleEngine {
    if (!LivingScheduleEngine.instance) {
      LivingScheduleEngine.instance = new LivingScheduleEngine();
    }
    return LivingScheduleEngine.instance;
  }

  public setSimulatedHour(hour: number | null): void {
    this.simulatedHour = hour;
    this.syncRoutineWithEmotion();
  }

  public getEffectiveTime(): { hour: number; minute: number } {
    if (this.simulatedHour !== null) {
      return { hour: this.simulatedHour, minute: 0 };
    }
    const now = new Date();
    return { hour: now.getHours(), minute: now.getMinutes() };
  }

  public getTimePeriod(hour: number): TimePeriod {
    if (hour >= 5 && hour < 10) return 'MORNING';
    if (hour >= 10 && hour < 14) return 'MIDDAY';
    if (hour >= 14 && hour < 18) return 'AFTERNOON';
    if (hour >= 18 && hour < 21) return 'EVENING';
    return 'NIGHT';
  }

  public getCurrentStatus(): CurrentScheduleStatus {
    const { hour, minute } = this.getEffectiveTime();
    const period = this.getTimePeriod(hour);

    const periodNames: Record<TimePeriod, string> = {
      MORNING: 'Pagi Ceria (05:00 - 10:00)',
      MIDDAY: 'Siang Aktif & Istirahat (10:00 - 14:00)',
      AFTERNOON: 'Sore Berkah & Pulang (14:00 - 18:00)',
      EVENING: 'Petang Khusyuk (18:00 - 21:00)',
      NIGHT: 'Malam Hening & Rehat (21:00 - 05:00)'
    };

    const nextPeriods: Record<TimePeriod, { name: string; endHour: number }> = {
      MORNING: { name: 'Siang Aktif', endHour: 10 },
      MIDDAY: { name: 'Sore Berkah', endHour: 14 },
      AFTERNOON: { name: 'Petang Khusyuk', endHour: 18 },
      EVENING: { name: 'Malam Rehat', endHour: 21 },
      NIGHT: { name: 'Pagi Ceria', endHour: 5 }
    };

    const nextInfo = nextPeriods[period];
    let remainingMins = 0;
    if (nextInfo.endHour > hour) {
      remainingMins = (nextInfo.endHour - hour) * 60 - minute;
    } else {
      remainingMins = (24 - hour + nextInfo.endHour) * 60 - minute;
    }
    if (remainingMins < 0) remainingMins = 0;

    const list = this.scheduleBank[period];
    // Seed selection based on day & hour to ensure non-repetitive but deterministic feeling
    const index = (new Date().getDate() + hour) % list.length;
    const activeActivity = list[index];

    return {
      period,
      periodName: periodNames[period],
      currentHour: hour,
      currentMinute: minute,
      activeActivity,
      nextPeriodName: nextInfo.name,
      timeRemainingMinutes: remainingMins,
      isSimulated: this.simulatedHour !== null
    };
  }

  public syncRoutineWithEmotion(): void {
    const status = this.getCurrentStatus();
    EmotionalStateEngine.getInstance().setEmotion(
      status.activeActivity.suggestedEmotion,
      `SCHEDULE_${status.period}`,
      { durationMs: 12000, decayTo: status.period === 'NIGHT' ? 'SLEEPY' : 'HAPPY' }
    );
  }

  public getAllActivitiesForPeriod(period: TimePeriod): ScheduleActivity[] {
    return this.scheduleBank[period] || [];
  }
}
