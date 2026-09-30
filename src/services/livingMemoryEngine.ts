/**
 * TADE LIVING MEMORY ENGINE — SPRINT G7 (P7)
 * Unified Digital Heritage & Memory Capsule Foundation.
 * Integrates: Growing Tree, Wish Tree, Sentra Moments, Creative Studio Certificates,
 * and Time-Locked Graduation Memory Capsules.
 */

import { growingTreeService } from './growingTreeService';
import { wishTreeService } from './wishTreeService';

export type MemoryItemType = 'BOTANICAL_GROWTH' | 'WISH_PRAYER' | 'SENTRA_MOMENT' | 'CERTIFICATE_BADGE' | 'AUDIO_REMEMBRANCE';

export interface LivingMemoryItem {
  id: string;
  studentId: string;
  studentName: string;
  type: MemoryItemType;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  icon: string;
  badgeLabel?: string;
  imageUrl?: string;
  audioDuration?: number;
  blessingCount?: number;
  growthLevel?: number;
}

export interface MemoryCapsule {
  id: string;
  studentId: string;
  title: string;
  unlockDate: string; // e.g. Wisuda 2027
  isUnlocked: boolean;
  itemCount: number;
  founderSeal: string;
}

const SAMPLE_SENTRA_MOMENTS: LivingMemoryItem[] = [
  {
    id: 'mem-sentra-1',
    studentId: 'std-farhan-01',
    studentName: 'Muhammad Farhan Al-Fatih',
    type: 'SENTRA_MOMENT',
    title: 'Karya Arsitektur Menara Masjid Agung Tanggul',
    subtitle: 'Sentra Balok & Rancang Bangun',
    description: 'Ananda berhasil menyusun 45 balok kayu membentuk kubah masjid dan menara tinggi dengan keseimbangan sempurna.',
    date: '19 Agustus 2026',
    icon: '🏰',
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?w=400&auto=format&fit=crop&q=60',
    badgeLabel: 'Sentra Balok'
  },
  {
    id: 'mem-cert-1',
    studentId: 'std-farhan-01',
    studentName: 'Muhammad Farhan Al-Fatih',
    type: 'CERTIFICATE_BADGE',
    title: 'Sertifikat Mutqin Surah An-Naba Ayat 1-15',
    subtitle: 'Tahfidz Juz 30 Quranic Champion',
    description: 'Diberikan langsung oleh Ustadzah Fatimah atas kelancaran makharijul huruf dan tajwid.',
    date: '15 Agustus 2026',
    icon: '📜',
    imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&auto=format&fit=crop&q=60',
    badgeLabel: 'Tahfidz Mutqin'
  }
];

class LivingMemoryEngine {
  private static instance: LivingMemoryEngine | null = null;

  public static getInstance(): LivingMemoryEngine {
    if (!LivingMemoryEngine.instance) {
      LivingMemoryEngine.instance = new LivingMemoryEngine();
    }
    return LivingMemoryEngine.instance;
  }

  public getUnifiedTimeline(studentId = 'std-farhan-01'): LivingMemoryItem[] {
    const timeline: LivingMemoryItem[] = [...SAMPLE_SENTRA_MOMENTS];

    // Connect Growing Tree Milestones
    try {
      const tree = growingTreeService.getSampleStudentTree(studentId, 'Muhammad Farhan Al-Fatih');
      if (tree) {
        tree.leaves.forEach((m, idx) => {
          timeline.push({
            id: `mem-botanical-${idx}`,
            studentId,
            studentName: tree.studentName,
            type: 'BOTANICAL_GROWTH',
            title: `Pertumbuhan Karakter: ${m.title}`,
            subtitle: `Pohon Karakter (${tree.stageLabel})`,
            description: `Tercapai pada tahap ${tree.stage}. Pilar: ${m.pillar} (${m.surahOrHabit}). Nilai nutrisi cinta: +${m.xpPoints} XP.`,
            date: m.achievedDate || 'Agustus 2026',
            icon: '🌱',
            growthLevel: tree.leaves.length,
            badgeLabel: 'Pohon Karakter'
          });
        });
      }
    } catch {
      // safe fallback
    }

    // Connect Wish Tree Blessings
    try {
      const wishes = wishTreeService.getLeaves();
      wishes.forEach(w => {
        timeline.push({
          id: `mem-wish-${w.id}`,
          studentId,
          studentName: 'Muhammad Farhan Al-Fatih',
          type: 'WISH_PRAYER',
          title: `Munajat Kasih: ${w.senderName}`,
          subtitle: `Doa & Harapan (${w.prayerCategory})`,
          description: `"${w.wishText}"`,
          date: w.createdAt.split('T')[0] || 'Agustus 2026',
          icon: '🤲',
          blessingCount: w.blessingCount,
          badgeLabel: 'Wish Tree'
        });
      });
    } catch {
      // safe fallback
    }

    return timeline.sort((a, b) => b.date.localeCompare(a.date));
  }

  public getCapsules(studentId = 'std-farhan-01'): MemoryCapsule[] {
    return [
      {
        id: `capsule-${studentId}-grad`,
        studentId,
        title: 'Kapsul Waktu Wisuda Akbar 2027 (Jejak Emas Ananda)',
        unlockDate: '20 Juni 2027',
        isUnlocked: false,
        itemCount: 18,
        founderSeal: 'TERKUNCI_AMAN_SOVEREIGN_VAULT'
      }
    ];
  }
}

export const livingMemoryEngine = LivingMemoryEngine.getInstance();
