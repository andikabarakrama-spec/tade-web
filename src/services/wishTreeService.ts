/**
 * TADE WISH TREE FOUNDATION SERVICE — SPRINT G6
 * Digital Wish & Community Hope Tree Engine
 * 
 * Collects, preserves, and renders prayers, milestones, and blessings
 * from Parents, Teachers, and Yayasan as digital golden leaves:
 * - Doa Orang Tua untuk Ananda
 * - Pesan Cinta Ustadzah
 * - Harapan Milad Yayasan
 * - Doa Kelulusan & Wisuda
 * 
 * Integrated with Living Event Engine • Zero Public Cloud Leakage
 */

export interface WishTreeLeaf {
  id: string;
  senderName: string;
  senderRole: 'WALI_MURID' | 'GURU' | 'YAYASAN' | 'FOUNDER' | 'ALUMNI';
  targetStudentOrSchool: string;
  wishText: string;
  prayerCategory: 'DOA_HARIAN' | 'TAHFIDZ' | 'AKHLAK' | 'KESEHATAN' | 'CITA_CITA' | 'EVENT_KHUSUS';
  leafColor: string;
  eventName?: string;
  createdAt: string;
  isPinned: boolean;
  blessingCount: number;
}

export interface WishTreeSummary {
  totalWishes: number;
  activeEventName: string;
  categories: Record<string, number>;
  leaves: WishTreeLeaf[];
}

const STORAGE_KEY = 'tade_wish_tree_sandbox_leaves_v1';

export class WishTreeService {
  private static instance: WishTreeService | null = null;

  public static getInstance(): WishTreeService {
    if (!WishTreeService.instance) {
      WishTreeService.instance = new WishTreeService();
    }
    return WishTreeService.instance;
  }

  private defaultLeaves: WishTreeLeaf[] = [
    {
      id: 'wish-1',
      senderName: 'Bunda Aisyah',
      senderRole: 'WALI_MURID',
      targetStudentOrSchool: 'Ananda Aisyah Putri (Kelompok B)',
      wishText: 'Semoga menjadi anak yang sholehah, berbakti kepada orang tua, cinta Al-Quran, dan selalu ceria di sekolah.',
      prayerCategory: 'AKHLAK',
      leafColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      eventName: 'Masa Taaruf Santri Baru',
      createdAt: '2026-08-18T08:30:00Z',
      isPinned: true,
      blessingCount: 14
    },
    {
      id: 'wish-2',
      senderName: 'Ustadzah Fatimah, S.Pd.',
      senderRole: 'GURU',
      targetStudentOrSchool: 'Seluruh Santri TK Asy Syifa',
      wishText: 'Semoga setiap tetes keringat belajar anak-anak kelak menjadi pohon kebaikan yang menaungi keluarga di surga.',
      prayerCategory: 'TAHFIDZ',
      leafColor: 'bg-teal-100 text-teal-950 border-teal-300',
      eventName: 'Pekan Berkah Asy Syifa',
      createdAt: '2026-08-19T09:15:00Z',
      isPinned: true,
      blessingCount: 22
    },
    {
      id: 'wish-3',
      senderName: 'Ayah Rayhan',
      senderRole: 'WALI_MURID',
      targetStudentOrSchool: 'Ananda Rayhan Al-Fatih',
      wishText: 'Jadilah pemuda yang kuat fisiknya, bersih hatinya, cerdas akalnya, dan bermanfaat bagi semesta.',
      prayerCategory: 'CITA_CITA',
      leafColor: 'bg-amber-100 text-amber-950 border-amber-300',
      eventName: 'Semarak Kemerdekaan RI',
      createdAt: '2026-08-20T10:00:00Z',
      isPinned: false,
      blessingCount: 9
    },
    {
      id: 'wish-4',
      senderName: 'Founder Andika',
      senderRole: 'FOUNDER',
      targetStudentOrSchool: 'Keluarga Besar TK Asy Syifa Tanggul',
      wishText: 'Semoga TK Asy Syifa senantiasa menjadi mercusuar pendidikan adab dan teknologi mandiri yang berdaulat.',
      prayerCategory: 'EVENT_KHUSUS',
      leafColor: 'bg-emerald-200 text-emerald-950 border-amber-400',
      eventName: 'Living School Universe Launch',
      createdAt: '2026-08-21T12:00:00Z',
      isPinned: true,
      blessingCount: 35
    }
  ];

  public getLeaves(): WishTreeLeaf[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return this.defaultLeaves;
  }

  public addWish(
    senderName: string,
    senderRole: WishTreeLeaf['senderRole'],
    targetStudentOrSchool: string,
    wishText: string,
    prayerCategory: WishTreeLeaf['prayerCategory'],
    eventName: string = 'Harian Aktif'
  ): WishTreeLeaf {
    const current = this.getLeaves();
    const newLeaf: WishTreeLeaf = {
      id: `wish-${Date.now()}`,
      senderName,
      senderRole,
      targetStudentOrSchool,
      wishText,
      prayerCategory,
      leafColor: senderRole === 'FOUNDER' 
        ? 'bg-emerald-200 text-emerald-950 border-amber-400' 
        : (senderRole === 'GURU' ? 'bg-teal-100 text-teal-950 border-teal-300' : 'bg-emerald-100 text-emerald-950 border-emerald-300'),
      eventName,
      createdAt: new Date().toISOString(),
      isPinned: senderRole === 'FOUNDER',
      blessingCount: 1
    };

    const updated = [newLeaf, ...current];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save wish leaf to storage', e);
    }
    return newLeaf;
  }

  public blessLeaf(leafId: string): number {
    const current = this.getLeaves();
    let newCount = 0;
    const updated = current.map(leaf => {
      if (leaf.id === leafId) {
        newCount = leaf.blessingCount + 1;
        return { ...leaf, blessingCount: newCount };
      }
      return leaf;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update blessings', e);
    }
    return newCount;
  }

  public getSummary(activeEventName: string = 'Harian Ceria'): WishTreeSummary {
    const leaves = this.getLeaves();
    const categories: Record<string, number> = {};
    leaves.forEach(l => {
      categories[l.prayerCategory] = (categories[l.prayerCategory] || 0) + 1;
    });

    return {
      totalWishes: leaves.length,
      activeEventName,
      categories,
      leaves
    };
  }
}

export const wishTreeService = WishTreeService.getInstance();
