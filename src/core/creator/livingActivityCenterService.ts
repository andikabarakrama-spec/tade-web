/**
 * TADE RC99 — R812: Living Activity Center Service
 * Mengelola alur terpadu kegiatan santri: Feed, Timeline, Galeri, Video, Arsip.
 * Single-upload flow untuk guru dengan auto-sync ke website publik & arsip sekolah.
 */

export interface ActivityMediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isCover: boolean;
  qualityScore: number;
  enhanced: boolean;
  width?: number;
  height?: number;
  sizeBytes?: number;
}

export type ActivityCategory = 
  | 'SENAM'
  | 'TAHFIDZ'
  | 'MEWARNAI'
  | 'MANASIK'
  | 'WISUDA'
  | 'RAMADHAN'
  | 'HARI_GURU'
  | 'OUTBOUND'
  | 'PENTAS_SENI';

export interface ActivityRecord {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  date: string;
  timestamp: string;
  location: string;
  uploaderName: string;
  uploaderRole: string;
  classGroup: string; // e.g. "Kelompok A1", "Kelompok B2", "Semua Kelas"
  mediaList: ActivityMediaItem[];
  coverMediaId: string;
  videoUrl?: string;
  publishedToWebsite: boolean;
  isArchived: boolean;
  likesCount: number;
  viewsCount: number;
  tags: string[];
  smartCoverScore?: number;
}

export class LivingActivityCenterService {
  private static instance: LivingActivityCenterService | null = null;
  private listeners: Set<(activities: ActivityRecord[]) => void> = new Set();

  private activities: ActivityRecord[] = [
    {
      id: 'act-001',
      title: 'Pentas Seni & Kreasi Santri Ceria 2026',
      description: 'Penampilan tari islami, hafalan surat pendek, dan pameran karya mewarnai anak kelompok B.',
      category: 'PENTAS_SENI',
      date: '2026-08-18',
      timestamp: '2026-08-18T09:00:00Z',
      location: 'Aula Utama TK Asy Syifa',
      uploaderName: 'Ustadzah Nurul',
      uploaderRole: 'GURU',
      classGroup: 'Kelompok B (Semua)',
      coverMediaId: 'm-001-1',
      mediaList: [
        {
          id: 'm-001-1',
          url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
          caption: 'Santri menampilkan busana muslim kreasi',
          isCover: true,
          qualityScore: 96,
          enhanced: true
        },
        {
          id: 'm-001-2',
          url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
          caption: 'Suasana riang bersama bunda guru',
          isCover: false,
          qualityScore: 92,
          enhanced: true
        },
        {
          id: 'm-001-3',
          url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
          caption: 'Doa bersama penutup acara',
          isCover: false,
          qualityScore: 94,
          enhanced: true
        }
      ],
      publishedToWebsite: true,
      isArchived: false,
      likesCount: 38,
      viewsCount: 154,
      tags: ['PentasSeni', 'KelompokB', 'Kreativitas', 'Prestasi'],
      smartCoverScore: 96
    },
    {
      id: 'act-002',
      title: 'Senam Pagi & Pembiasaan Hidup Sehat',
      description: 'Gerak irama ceria di halaman sekolah sebelum memulai pembelajaran tema lingkungan.',
      category: 'SENAM',
      date: '2026-08-17',
      timestamp: '2026-08-17T07:30:00Z',
      location: 'Halaman Olahraga TK Asy Syifa',
      uploaderName: 'Ustadzah Siti',
      uploaderRole: 'GURU',
      classGroup: 'Kelompok A & B',
      coverMediaId: 'm-002-1',
      mediaList: [
        {
          id: 'm-002-1',
          url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
          caption: 'Semangat senam pagi bersama maskot Asy',
          isCover: true,
          qualityScore: 94,
          enhanced: true
        }
      ],
      publishedToWebsite: true,
      isArchived: false,
      likesCount: 45,
      viewsCount: 182,
      tags: ['SenamPagi', 'Kebugaran', 'Ceria'],
      smartCoverScore: 94
    },
    {
      id: 'act-003',
      title: 'Khatmil Quran & Wisuda Juz 30 Cilik',
      description: 'Munaqasyah hafalan surat An-Naba sampai An-Nas bersama wali santri dan asatidz.',
      category: 'TAHFIDZ',
      date: '2026-08-15',
      timestamp: '2026-08-15T08:00:00Z',
      location: 'Masjid Asy Syifa Tanggul',
      uploaderName: 'Ustadz Ahmad',
      uploaderRole: 'GURU',
      classGroup: 'Kelas Tahfidz Unggulan',
      coverMediaId: 'm-003-1',
      mediaList: [
        {
          id: 'm-003-1',
          url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
          caption: 'Santri cilik melafalkan Al-Quran dengan tartil',
          isCover: true,
          qualityScore: 98,
          enhanced: true
        }
      ],
      publishedToWebsite: true,
      isArchived: false,
      likesCount: 62,
      viewsCount: 290,
      tags: ['Tahfidz', 'Juz30', 'Khataman', 'SyiarIslam'],
      smartCoverScore: 98
    },
    {
      id: 'act-004',
      title: 'Simulasi Manasik Haji Santri Cilik',
      description: 'Praktik tawaf mengelilingi miniatur Ka\'bah, sai, dan wukuf dalam pakaian ihram.',
      category: 'MANASIK',
      date: '2026-08-10',
      timestamp: '2026-08-10T08:30:00Z',
      location: 'Area Terbuka Islamic Center Jember',
      uploaderName: 'Ustadzah Nurul',
      uploaderRole: 'GURU',
      classGroup: 'Semua Santri',
      coverMediaId: 'm-004-1',
      mediaList: [
        {
          id: 'm-004-1',
          url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&auto=format&fit=crop&q=80',
          caption: 'Santri khusyuk bertalbiyah mengelilingi Ka\'bah',
          isCover: true,
          qualityScore: 97,
          enhanced: true
        }
      ],
      publishedToWebsite: true,
      isArchived: false,
      likesCount: 78,
      viewsCount: 340,
      tags: ['ManasikHaji', 'Ihram', 'EdukasiIslami'],
      smartCoverScore: 97
    }
  ];

  private constructor() {
    // Load from localStorage if available
    try {
      const saved = localStorage.getItem('tade_living_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.activities = parsed;
        }
      }
    } catch {
      // fallback to initial
    }
  }

  public static getInstance(): LivingActivityCenterService {
    if (!LivingActivityCenterService.instance) {
      LivingActivityCenterService.instance = new LivingActivityCenterService();
    }
    return LivingActivityCenterService.instance;
  }

  public getActivities(): ActivityRecord[] {
    return [...this.activities];
  }

  public subscribe(listener: (activities: ActivityRecord[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getActivities());
    return () => this.listeners.delete(listener);
  }

  public createActivity(activity: Omit<ActivityRecord, 'id' | 'timestamp' | 'likesCount' | 'viewsCount'>): ActivityRecord {
    const newAct: ActivityRecord = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      likesCount: 0,
      viewsCount: 1
    };

    this.activities = [newAct, ...this.activities];
    this.save();
    this.notify();
    return newAct;
  }

  public updateActivity(id: string, updates: Partial<ActivityRecord>): void {
    this.activities = this.activities.map(act => act.id === id ? { ...act, ...updates } : act);
    this.save();
    this.notify();
  }

  public deleteActivity(id: string): void {
    this.activities = this.activities.filter(act => act.id !== id);
    this.save();
    this.notify();
  }

  public toggleLike(id: string): void {
    this.activities = this.activities.map(act => {
      if (act.id === id) {
        return { ...act, likesCount: act.likesCount + 1 };
      }
      return act;
    });
    this.save();
    this.notify();
  }

  public togglePublish(id: string): void {
    this.activities = this.activities.map(act => {
      if (act.id === id) {
        return { ...act, publishedToWebsite: !act.publishedToWebsite };
      }
      return act;
    });
    this.save();
    this.notify();
  }

  public toggleArchive(id: string): void {
    this.activities = this.activities.map(act => {
      if (act.id === id) {
        return { ...act, isArchived: !act.isArchived };
      }
      return act;
    });
    this.save();
    this.notify();
  }

  private save(): void {
    try {
      localStorage.setItem('tade_living_activities', JSON.stringify(this.activities));
    } catch {
      // ignore
    }
  }

  private notify(): void {
    const data = this.getActivities();
    this.listeners.forEach(l => l(data));
  }
}
