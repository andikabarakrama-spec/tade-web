/**
 * TADE v9.5.0-MCA5 — R959
 * SCHOOL EVENT HOOKS
 * 
 * Event adapter allowing Asy & Syifa to respond gracefully to institutional events:
 * - PPDB New Registrant Welcome
 * - Tahfidz Morning Halaqah Start
 * - Gallery Event Photo Exhibition
 * - Infaq & SPP Amanah Completion
 * - School Audio Announcement / Adzan
 */

import { CharacterId } from './masterCharacterRegistry';
import { LivingBehaviorState } from './livingBehaviorEngine';
import { MasterEmotionType } from './emotionController';

export type SchoolEventType = 
  | 'PPDB_REGISTRATION_OPEN'
  | 'TAHFIDZ_HALAQAH_START'
  | 'GALLERY_PHOTO_PUBLISHED'
  | 'SPP_PAYMENT_CONFIRMED'
  | 'SCHOOL_ANNOUNCEMENT_BROADCAST';

export interface SchoolEventReaction {
  eventType: SchoolEventType;
  title: string;
  targetBehavior: LivingBehaviorState;
  targetEmotion: MasterEmotionType;
  bannerQuote: {
    asy: string;
    syifa: string;
  };
  durationSec: number;
}

export const SCHOOL_EVENT_REACTIONS: Record<SchoolEventType, SchoolEventReaction> = {
  PPDB_REGISTRATION_OPEN: {
    eventType: 'PPDB_REGISTRATION_OPEN',
    title: 'Penerimaan Santri Baru (PPDB) Aktif',
    targetBehavior: 'greet',
    targetEmotion: 'happy',
    bannerQuote: {
      asy: 'Ahlan wa sahlan calon santri sholih! Mari menuntut ilmu bersama kami.',
      syifa: 'Selamat datang adik-adik calon santriwati ceria! Semoga berkah.'
    },
    durationSec: 6.0
  },
  TAHFIDZ_HALAQAH_START: {
    eventType: 'TAHFIDZ_HALAQAH_START',
    title: 'Halaqah Tahfidz & Tilawah Dimulai',
    targetBehavior: 'read_iqro',
    targetEmotion: 'focused',
    bannerQuote: {
      asy: 'Bismillah, mari kita luruskan niat dan mulai tilawah hafalan.',
      syifa: 'Buka Iqro dan mushaf suci, mari menyimak ayat-ayat Allah.'
    },
    durationSec: 8.0
  },
  GALLERY_PHOTO_PUBLISHED: {
    eventType: 'GALLERY_PHOTO_PUBLISHED',
    title: 'Dokumentasi Galeri Karya Terbaru',
    targetBehavior: 'butterfly',
    targetEmotion: 'happy',
    bannerQuote: {
      asy: 'MasyaAllah, karya dan keceriaan santri terabadikan dengan indah!',
      syifa: 'Lihatlah hasil kreasi sholih-sholihah yang penuh warna kebaikan.'
    },
    durationSec: 5.0
  },
  SPP_PAYMENT_CONFIRMED: {
    eventType: 'SPP_PAYMENT_CONFIRMED',
    title: 'Amanah Infaq & SPP Diterima',
    targetBehavior: 'celebrate',
    targetEmotion: 'happy',
    bannerQuote: {
      asy: 'Alhamdulillah, jazakumullahu khairan katsiran atas amanah infaq ini.',
      syifa: 'Semoga menjadi amal jariyah dan membawa keberkahan keluarga.'
    },
    durationSec: 5.0
  },
  SCHOOL_ANNOUNCEMENT_BROADCAST: {
    eventType: 'SCHOOL_ANNOUNCEMENT_BROADCAST',
    title: 'Pengumuman Resmi Sekolah',
    targetBehavior: 'observe',
    targetEmotion: 'curious',
    bannerQuote: {
      asy: 'Mari sejenak menyimak maklumat penting dari Ustadz dan Ustadzah.',
      syifa: 'Dengarkan pengumuman sekolah dengan tertib dan seksama ya.'
    },
    durationSec: 6.0
  }
};

export class SchoolEventHooks {
  private activeReaction: SchoolEventReaction | null = null;
  private triggeredAt: number = 0;

  public triggerEvent(eventType: SchoolEventType): SchoolEventReaction {
    const r = SCHOOL_EVENT_REACTIONS[eventType];
    this.activeReaction = r;
    this.triggeredAt = Date.now();
    return r;
  }

  public getActiveReaction(): SchoolEventReaction | null {
    if (!this.activeReaction) return null;
    const elapsed = (Date.now() - this.triggeredAt) / 1000;
    if (elapsed > this.activeReaction.durationSec) {
      this.activeReaction = null;
      return null;
    }
    return this.activeReaction;
  }
}

export const defaultSchoolEventHooks = new SchoolEventHooks();
