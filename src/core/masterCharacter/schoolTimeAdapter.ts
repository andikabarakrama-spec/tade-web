/**
 * TADE v9.4.0-MCA4 — R942
 * SCHOOL TIME ADAPTER
 * 
 * Adapts Islamic school daily schedule and prayer/activity periods
 * into live mascot behavioral tendencies.
 * 
 * Dynamic Periods:
 * - SUBOH_PREP (04:30 - 06:30): Greet & morning spirit
 * - TAHFIDZ_MORNING (06:30 - 08:30): Read Iqro & tilawah
 * - CLASS_ACTIVITY (08:30 - 10:00): Observe & focused learning
 * - CREATIVE_PLAY (10:00 - 11:30): Play & butterfly chasing
 * - DHUHR_REST (11:30 - 13:00): Rest & Dhuhur prayers
 * - AFTERNOON_DISMISSAL (13:00 - 15:00): Salam & dismissal wave
 * - TPA_AFTERNOON (15:00 - 18:00): Mengaji sore & muroja'ah
 * - EVENING_FAMILY (18:00 - 04:30): Calm evening & night rest
 */

import { CharacterId } from './masterCharacterRegistry';

export type SchoolPeriodKey = 
  | 'SUBOH_PREP'
  | 'TAHFIDZ_MORNING'
  | 'CLASS_ACTIVITY'
  | 'CREATIVE_PLAY'
  | 'DHUHR_REST'
  | 'AFTERNOON_DISMISSAL'
  | 'TPA_AFTERNOON'
  | 'EVENING_FAMILY';

export interface SchoolPeriodDefinition {
  key: SchoolPeriodKey;
  label: string;
  timeRange: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  preferredState: string;
  preferredEmotion: 'calm' | 'happy' | 'focused' | 'curious';
  asyQuote: string;
  syifaQuote: string;
  islamicAdabNote: string;
}

export const SCHOOL_PERIOD_DEFINITIONS: Record<SchoolPeriodKey, SchoolPeriodDefinition> = {
  SUBOH_PREP: {
    key: 'SUBOH_PREP',
    label: 'Subuh & Sambut Pagi',
    timeRange: '04:30 - 06:30',
    startHour: 4,
    startMinute: 30,
    endHour: 6,
    endMinute: 30,
    preferredState: 'greet',
    preferredEmotion: 'happy',
    asyQuote: 'Bismillah! Pagi yang cerah untuk menuntut ilmu di taman santri.',
    syifaQuote: 'Assalamu\'alaikum! Awali hari dengan sholat subuh dan senyum tulus.',
    islamicAdabNote: 'Adab menyambut fajar dengan doa dan senyum hangat.'
  },
  TAHFIDZ_MORNING: {
    key: 'TAHFIDZ_MORNING',
    label: 'Sentra Tahfidz Pagi',
    timeRange: '06:30 - 08:30',
    startHour: 6,
    startMinute: 30,
    endHour: 8,
    endMinute: 30,
    preferredState: 'read_iqro',
    preferredEmotion: 'focused',
    asyQuote: 'Mari muroja\'ah surah hafalan bersama ustadz dan ustadzah.',
    syifaQuote: 'Maa syaa Allah, tilawah Qur\'an menyejukkan hati dan menerangi langkah.',
    islamicAdabNote: 'Adab memegang mushaf suci dengan thaharah dan khusyuk.'
  },
  CLASS_ACTIVITY: {
    key: 'CLASS_ACTIVITY',
    label: 'Sentra Belajar & Eksplorasi',
    timeRange: '08:30 - 10:00',
    startHour: 8,
    startMinute: 30,
    endHour: 10,
    endMinute: 0,
    preferredState: 'observe',
    preferredEmotion: 'curious',
    asyQuote: 'Asy siap menyimak pelajaran seru hari ini dengan fokus!',
    syifaQuote: 'Belajar adab, berhitung, dan mengenal ciptaan Allah yang indah.',
    islamicAdabNote: 'Adab menuntut ilmu dengan mendengar penuh seksama.'
  },
  CREATIVE_PLAY: {
    key: 'CREATIVE_PLAY',
    label: 'Bermain Ceria & Motorik',
    timeRange: '10:00 - 11:30',
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    preferredState: 'butterfly',
    preferredEmotion: 'happy',
    asyQuote: 'Wah, lihat kupu-kupu di taman! Serunya bermain sambil belajar.',
    syifaQuote: 'Alhamdulillah, bermain bersama teman santri dengan rukun dan santun.',
    islamicAdabNote: 'Adab bermain dengan berbagi mainan dan menjaga keselamatan.'
  },
  DHUHR_REST: {
    key: 'DHUHR_REST',
    label: 'Sholat Dhuhur & Istirahat',
    timeRange: '11:30 - 13:00',
    startHour: 11,
    startMinute: 30,
    endHour: 13,
    endMinute: 0,
    preferredState: 'sit_rest',
    preferredEmotion: 'calm',
    asyQuote: 'Waktunya istirahat sejenak dan menunaikan sholat Dhuhur berjamaah.',
    syifaQuote: 'Rehat sejenak sambil berdzikir, memulihkan tenaga santri.',
    islamicAdabNote: 'Adab istirahat dan makan siang dengan tangan kanan serta doa.'
  },
  AFTERNOON_DISMISSAL: {
    key: 'AFTERNOON_DISMISSAL',
    label: 'Pulang & Salam Santri',
    timeRange: '13:00 - 15:00',
    startHour: 13,
    startMinute: 0,
    endHour: 15,
    endMinute: 0,
    preferredState: 'greet',
    preferredEmotion: 'happy',
    asyQuote: 'Sampai jumpa besok teman-teman! Hati-hati di jalan ya.',
    syifaQuote: 'Fi amanillah! Jangan lupa bersalaman dengan ustadz dan ustadzah.',
    islamicAdabNote: 'Adab berpamitan dengan mencium tangan guru dan mengucap salam.'
  },
  TPA_AFTERNOON: {
    key: 'TPA_AFTERNOON',
    label: 'TPA & Mengaji Sore',
    timeRange: '15:00 - 18:00',
    startHour: 15,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    preferredState: 'read_iqro',
    preferredEmotion: 'focused',
    asyQuote: 'Sore hari waktu yang berkah untuk mengaji Iqro dan doa harian.',
    syifaQuote: 'Huruf hijaiyah dibaca tartil, insya Allah berkah dunia akhirat.',
    islamicAdabNote: 'Adab belajar tajwid dan menyimak bacaan dengan sabar.'
  },
  EVENING_FAMILY: {
    key: 'EVENING_FAMILY',
    label: 'Malam & Bersama Keluarga',
    timeRange: '18:00 - 04:30',
    startHour: 18,
    startMinute: 0,
    endHour: 4,
    endMinute: 30,
    preferredState: 'sit_rest',
    preferredEmotion: 'calm',
    asyQuote: 'Malam yang tenang. Selamat beristirahat bersama keluarga tercinta.',
    syifaQuote: 'Bismika Allahumma ahya wa bismika amut. Semoga mimpi indah dalam lindungan Allah.',
    islamicAdabNote: 'Adab sebelum tidur dengan berwudhu dan membaca doa perlindungan.'
  }
};

export class SchoolTimeAdapter {
  private simulatedTime: Date | null = null;

  /**
   * Set simulated clock for testing & interactive demo
   */
  public setSimulatedTime(time: Date | null): void {
    this.simulatedTime = time;
  }

  public getEffectiveTime(): Date {
    return this.simulatedTime || new Date();
  }

  public getCurrentPeriod(): SchoolPeriodDefinition {
    const now = this.getEffectiveTime();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const period of Object.values(SCHOOL_PERIOD_DEFINITIONS)) {
      const startM = period.startHour * 60 + period.startMinute;
      const endM = period.endHour * 60 + period.endMinute;

      if (startM < endM) {
        if (currentMinutes >= startM && currentMinutes < endM) {
          return period;
        }
      } else {
        // Spans over midnight (e.g. 18:00 to 04:30)
        if (currentMinutes >= startM || currentMinutes < endM) {
          return period;
        }
      }
    }

    return SCHOOL_PERIOD_DEFINITIONS.CLASS_ACTIVITY;
  }

  public getPeriodQuote(characterId: CharacterId = 'ASY'): {
    period: SchoolPeriodDefinition;
    quote: string;
  } {
    const period = this.getCurrentPeriod();
    return {
      period,
      quote: characterId === 'ASY' ? period.asyQuote : period.syifaQuote
    };
  }
}

export const defaultSchoolTimeAdapter = new SchoolTimeAdapter();
