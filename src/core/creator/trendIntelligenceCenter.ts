/**
 * TADE RC99 — R817: Trend Intelligence Center
 * Pusat kurasi tren konten edukasi anak & PAUD Islami.
 * Tanpa scraping otomatis eksternal, berbasis kurasi terjadwal/manual aman.
 */

export type TrendCategory = 'FORMAT' | 'AUDIO_THEME' | 'TYPOGRAPHY' | 'COLOR_PALETTE' | 'STORYTELLING';
export type TrendStatus = 'RISING' | 'PEAK' | 'EVERGREEN' | 'COOLING';

export interface TrendItem {
  id: string;
  name: string;
  category: TrendCategory;
  confidencePercent: number; // 0 - 100
  status: TrendStatus;
  recommendation: string;
  bestUseFor: string;
  exampleHook: string;
  lastCuratedDate: string;
  tags: string[];
}

export class TrendIntelligenceCenter {
  private static instance: TrendIntelligenceCenter | null = null;
  private listeners: Set<(trends: TrendItem[]) => void> = new Set();

  private trends: TrendItem[] = [
    {
      id: 'tr-001',
      name: 'Bercerita Cepat 15-Detik (Micro-Story Santri)',
      category: 'FORMAT',
      confidencePercent: 94,
      status: 'RISING',
      recommendation: 'Gunakan potongan video 3 detik hafalan santri diikuti reaksi senyum bunda guru.',
      bestUseFor: 'Reels, Instagram Story, Status WhatsApp Wali Murid',
      exampleHook: '"Lihat betapa lancarnya Dek Fathir melafalkan Surat Al-Fajr hari ini..."',
      lastCuratedDate: '2026-08-18',
      tags: ['MicroStory', 'Reels', 'ShortVideo', 'PAUD']
    },
    {
      id: 'tr-002',
      name: 'Emerald Minimalist Framing (Zamrud Bersih)',
      category: 'COLOR_PALETTE',
      confidencePercent: 98,
      status: 'PEAK',
      recommendation: 'Padukan latar belakang foto asli dengan border zamrud 2px dan badge putih kontras tinggi.',
      bestUseFor: 'Poster Pengumuman, Cover Kegiatan, Banner Website',
      exampleHook: '"Akreditasi Unggul BAN-PAUD & Prestasi Generasi Qurani"',
      lastCuratedDate: '2026-08-17',
      tags: ['Emerald', 'IslamicBranding', 'Minimalist']
    },
    {
      id: 'tr-003',
      name: 'Nasyid Ceria Akustik Anak (Audio Trend)',
      category: 'AUDIO_THEME',
      confidencePercent: 88,
      status: 'EVERGREEN',
      recommendation: 'Pilih instrumen perkusi lembut / rebana ceria tanpa suara bising.',
      bestUseFor: 'Video Senam, Pentas Seni, Dokumentasi Outbound',
      exampleHook: '"Senandung Asmaul Husna Ceria Santri Cilik"',
      lastCuratedDate: '2026-08-16',
      tags: ['Nasyid', 'Instrumental', 'RamahAnak']
    },
    {
      id: 'tr-004',
      name: 'Before-After Belajar Mewarnai & Motorik',
      category: 'STORYTELLING',
      confidencePercent: 91,
      status: 'RISING',
      recommendation: 'Tampilkan perbandingan hari pertama santri memegang krayon vs hasil karya minggu ke-4.',
      bestUseFor: 'Laporan Perkembangan Santri, Portofolio Guru',
      exampleHook: '"Dari ragu memegang krayon, kini mewarnai penuh percaya diri!"',
      lastCuratedDate: '2026-08-15',
      tags: ['ProgressReport', 'Portofolio', 'Motorik']
    },
    {
      id: 'tr-005',
      name: 'Doa Sehari-hari Typo Kinetic',
      category: 'TYPOGRAPHY',
      confidencePercent: 85,
      status: 'EVERGREEN',
      recommendation: 'Tampilkan teks doa Arab dengan terjemahan latin timbul kata demi kata.',
      bestUseFor: 'Edukasi Wali Santri, Story Harian',
      exampleHook: '"Doa Masuk Rumah & Menuntut Ilmu"',
      lastCuratedDate: '2026-08-14',
      tags: ['DoaHarian', 'Tipografi', 'Hafalan']
    }
  ];

  public static getInstance(): TrendIntelligenceCenter {
    if (!TrendIntelligenceCenter.instance) {
      TrendIntelligenceCenter.instance = new TrendIntelligenceCenter();
    }
    return TrendIntelligenceCenter.instance;
  }

  public getTrends(): TrendItem[] {
    return [...this.trends];
  }

  public subscribe(listener: (trends: TrendItem[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getTrends());
    return () => this.listeners.delete(listener);
  }

  public addCuratedTrend(trend: Omit<TrendItem, 'id' | 'lastCuratedDate'>): TrendItem {
    const newItem: TrendItem = {
      ...trend,
      id: `tr-${Date.now()}`,
      lastCuratedDate: new Date().toISOString().split('T')[0]
    };
    this.trends = [newItem, ...this.trends];
    this.notify();
    return newItem;
  }

  private notify(): void {
    const data = this.getTrends();
    this.listeners.forEach(l => l(data));
  }
}
