/**
 * TADE v9.7.0-MCA7 — R971, R972, R974
 * SCHOOL WORLD MAP & PRESENCE POSITION ADAPTER
 * 
 * Maps school campus zones into semantic anchor positions without creating an external map engine:
 * - GERBANG (Pintu gerbang sekolah, sambutan pagi santun)
 * - HALAMAN (Lapangan upacara & senam bugar santri)
 * - TAMAN (Taman bunga, kolam & kupu-kupu)
 * - KELAS (Ruang sentra belajar ceria & seni mewarnai)
 * - TAHFIDZ_CORNER (Pojok tilawah & muroja'ah Iqro)
 * - GALERI (Papan pameran karya santri & dokumentasi)
 * - PPDB_CORNER (Meja informasi santri baru & pendaftaran)
 */

import { MasterClipName } from './animationClipRegistry';
import { LivingBehaviorState } from './livingBehaviorEngine';
import { MasterEmotionType } from './emotionController';

export type SchoolAreaType = 
  | 'GERBANG'
  | 'HALAMAN'
  | 'TAMAN'
  | 'KELAS'
  | 'TAHFIDZ_CORNER'
  | 'GALERI'
  | 'PPDB_CORNER';

export interface AreaAnchorPosition {
  xPercent: number; // 0 to 100 on screen horizontal coordinate
  yPercent: number; // 0 to 100 on screen vertical baseline
  safeMarginPx: number;
  facingDirection: 'left' | 'right' | 'front';
}

export interface SchoolAreaProfile {
  id: SchoolAreaType;
  name: string;
  subTitle: string;
  primaryBehavior: LivingBehaviorState;
  suggestedClip: MasterClipName;
  emotion: MasterEmotionType;
  defaultAnchorAsy: AreaAnchorPosition;
  defaultAnchorSyifa: AreaAnchorPosition;
  interactiveProps: string[];
  bannerGreeting: {
    asy: string;
    syifa: string;
  };
}

export const SCHOOL_AREA_PROFILES: Record<SchoolAreaType, SchoolAreaProfile> = {
  GERBANG: {
    id: 'GERBANG',
    name: 'Gerbang Utama & Pos Sambut Santri',
    subTitle: 'Menyambut kehadiran santri & wali dengan senyum dan salam',
    primaryBehavior: 'celebrate',
    suggestedClip: 'wave',
    emotion: 'happy',
    defaultAnchorAsy: { xPercent: 28, yPercent: 78, safeMarginPx: 60, facingDirection: 'right' },
    defaultAnchorSyifa: { xPercent: 72, yPercent: 78, safeMarginPx: 60, facingDirection: 'left' },
    interactiveProps: ['Papan Selamat Datang', 'Bel Sekolah', 'Gerbang Hijau'],
    bannerGreeting: {
      asy: 'Assalamu\'alaikum! Selamat datang di Sekolah Impian TADE.',
      syifa: 'Ahlan wa sahlan! Senang sekali bisa belajar bersama hari ini.'
    }
  },
  HALAMAN: {
    id: 'HALAMAN',
    name: 'Halaman Utama & Lapangan Senam',
    subTitle: 'Tempat berbaris rapi, senam ceria, dan kegiatan terbuka',
    primaryBehavior: 'celebrate',
    suggestedClip: 'wave',
    emotion: 'happy',
    defaultAnchorAsy: { xPercent: 35, yPercent: 75, safeMarginPx: 50, facingDirection: 'right' },
    defaultAnchorSyifa: { xPercent: 65, yPercent: 75, safeMarginPx: 50, facingDirection: 'left' },
    interactiveProps: ['Tiang Bendera', 'Garis Barisan', 'Pohon Peneduh'],
    bannerGreeting: {
      asy: 'Badan sehat, hati riang, siap menyambut ilmu bermanfaat!',
      syifa: 'Berbaris rapi dan saling menghormati sesama teman.'
    }
  },
  TAMAN: {
    id: 'TAMAN',
    name: 'Taman Asri & Kolam Sains',
    subTitle: 'Eksplorasi alam semesta, bunga mawar mekar, dan kupu-kupu',
    primaryBehavior: 'butterfly',
    suggestedClip: 'butterfly',
    emotion: 'curious',
    defaultAnchorAsy: { xPercent: 25, yPercent: 76, safeMarginPx: 60, facingDirection: 'right' },
    defaultAnchorSyifa: { xPercent: 70, yPercent: 76, safeMarginPx: 60, facingDirection: 'left' },
    interactiveProps: ['Kupu-Kupu Sutra', 'Bunga Mawar Merah', 'Bebatuan Kolam'],
    bannerGreeting: {
      asy: 'Subhanallah, indahnya ciptaan Allah di taman sekolah kita.',
      syifa: 'Kupu-kupu terbang riang di antara kelopak bunga yang harum.'
    }
  },
  KELAS: {
    id: 'KELAS',
    name: 'Sentra Kelas & Meja Kreativitas',
    subTitle: 'Ruang pembelajaran aktif, sentra balok, seni, dan bermain terarah',
    primaryBehavior: 'idle',
    suggestedClip: 'lookAround',
    emotion: 'focused',
    defaultAnchorAsy: { xPercent: 32, yPercent: 80, safeMarginPx: 70, facingDirection: 'right' },
    defaultAnchorSyifa: { xPercent: 68, yPercent: 80, safeMarginPx: 70, facingDirection: 'left' },
    interactiveProps: ['Meja Belajar Kayu', 'Kotak Krayon Warna', 'Papan Tulis Sentra'],
    bannerGreeting: {
      asy: 'Mari siapkan alat tulis dan dengarkan nasehat Ustadzah.',
      syifa: 'Belajar dengan gembira, berbagi warna dengan teman sholihah.'
    }
  },
  TAHFIDZ_CORNER: {
    id: 'TAHFIDZ_CORNER',
    name: 'Halaqah Tahfidz & Pojok Muroja\'ah',
    subTitle: 'Tempat duduk bersila, tilawah Iqro, dan hafalan surat pendek',
    primaryBehavior: 'read_iqro',
    suggestedClip: 'readIqro',
    emotion: 'focused',
    defaultAnchorAsy: { xPercent: 30, yPercent: 82, safeMarginPx: 80, facingDirection: 'right' },
    defaultAnchorSyifa: { xPercent: 70, yPercent: 82, safeMarginPx: 80, facingDirection: 'left' },
    interactiveProps: ['Meja Rehal Al-Qur\'an', 'Mushaf & Iqro', 'Karpet Sajadah Lembut'],
    bannerGreeting: {
      asy: 'Tartilkan makhraj huruf, sematkan ayat Al-Qur\'an di dalam dada.',
      syifa: 'Muroja\'ah bersama membuat ingatan hafalan semakin kuat dan berkah.'
    }
  },
  GALERI: {
    id: 'GALERI',
    name: 'Pameran Karya & Galeri Santri',
    subTitle: 'Showcase karya seni, kaligrafi santri, dan foto dokumentasi',
    primaryBehavior: 'observe',
    suggestedClip: 'lookAround',
    emotion: 'curious',
    defaultAnchorAsy: { xPercent: 26, yPercent: 77, safeMarginPx: 55, facingDirection: 'right' },
    defaultAnchorSyifa: { xPercent: 74, yPercent: 77, safeMarginPx: 55, facingDirection: 'left' },
    interactiveProps: ['Papan Display Karya', 'Bingkai Kaligrafi', 'Lampu Sorot Mini'],
    bannerGreeting: {
      asy: 'Setiap goresan warna santri memancarkan keindahan akhlak.',
      syifa: 'Apresiasi karya sahabat dengan ucapan "MasyaAllah Barakallah".'
    }
  },
  PPDB_CORNER: {
    id: 'PPDB_CORNER',
    name: 'Pojok Informasi & Pendaftaran Santri (PPDB)',
    subTitle: 'Pusat layanan informasi calon wali santri & konsultasi ramah',
    primaryBehavior: 'celebrate',
    suggestedClip: 'wave',
    emotion: 'happy',
    defaultAnchorAsy: { xPercent: 30, yPercent: 79, safeMarginPx: 65, facingDirection: 'right' },
    defaultAnchorSyifa: { xPercent: 70, yPercent: 79, safeMarginPx: 65, facingDirection: 'left' },
    interactiveProps: ['Brosur Kurikulum TADE', 'Formulir Digital', 'Cinderamata'],
    bannerGreeting: {
      asy: 'Selamat datang calon santri teladan generasi Qur\'ani!',
      syifa: 'Kami siap menemani masa emas tumbuh kembang ananda tercinta.'
    }
  }
};

export class SchoolWorldAdapter {
  private currentArea: SchoolAreaType = 'GERBANG';

  public setArea(area: SchoolAreaType): SchoolAreaProfile {
    this.currentArea = area;
    return SCHOOL_AREA_PROFILES[area];
  }

  public getCurrentArea(): SchoolAreaType {
    return this.currentArea;
  }

  public getAreaProfile(area?: SchoolAreaType): SchoolAreaProfile {
    return SCHOOL_AREA_PROFILES[area || this.currentArea];
  }
}

export const defaultSchoolWorldAdapter = new SchoolWorldAdapter();
