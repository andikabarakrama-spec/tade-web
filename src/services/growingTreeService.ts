/**
 * TADE GROWING TREE FOUNDATION SERVICE — SPRINT G6
 * Visual Character & Milestone Growth Tree Engine
 * 
 * Maps student development (Tahfidz, Adab, Motorik, Kemandirian, Ibadah)
 * into living interactive botanical progress:
 * 1. BENIH (Seedling - Level 1)
 * 2. TUNAS (Sprout - Level 2)
 * 3. BATANG MUDA (Sapling - Level 3)
 * 4. POHON BERBUNGA (Blooming - Level 4)
 * 5. POHON BERBUAH BERKAH (Fruitful - Level 5)
 * 
 * Pure Brand Compliant • Connected directly to existing Student Assessment records.
 */

export type TreeGrowthStage = 'BENIH' | 'TUNAS' | 'BATANG_MUDA' | 'BERBUNGA' | 'BERBUAH';

export type CharacterPillar = 'TAHFIDZ' | 'ADAB' | 'SHOLAT' | 'MOTORIK' | 'KEMANDIRIAN';

export interface TreeLeafMilestone {
  id: string;
  pillar: CharacterPillar;
  title: string;
  surahOrHabit: string;
  achievedDate: string;
  colorTone: string;
  xpPoints: number;
}

export interface TreeFlowerAppreciation {
  id: string;
  title: string;
  senderUstadzah: string;
  date: string;
  badgeLabel: string;
  flowerType: 'MELATI' | 'KAMBOJA' | 'MAWAR_ZAMRUD' | 'ANGGREK_EMAS';
}

export interface StudentTreeProfile {
  studentId: string;
  studentName: string;
  className: string;
  stage: TreeGrowthStage;
  stageLabel: string;
  currentXp: number;
  nextLevelXp: number;
  totalLeaves: number;
  totalFlowers: number;
  treeHealth: number; // 0 to 100%
  leaves: TreeLeafMilestone[];
  flowers: TreeFlowerAppreciation[];
  eventBonusActive: string;
}

export class GrowingTreeService {
  private static instance: GrowingTreeService | null = null;

  public static getInstance(): GrowingTreeService {
    if (!GrowingTreeService.instance) {
      GrowingTreeService.instance = new GrowingTreeService();
    }
    return GrowingTreeService.instance;
  }

  public getTreeStageInfo(stage: TreeGrowthStage): { label: string; icon: string; minXp: number; description: string } {
    switch (stage) {
      case 'BENIH':
        return {
          label: 'Benih Cerdas',
          icon: '🌱',
          minXp: 0,
          description: 'Awal langkah menanam akhlak mulia dan kecintaan pada Al-Quran.'
        };
      case 'TUNAS':
        return {
          label: 'Tunas Bersemi',
          icon: '🌿',
          minXp: 100,
          description: 'Mulai menghafal doa harian dan pembiasaan sholat berjamaah.'
        };
      case 'BATANG_MUDA':
        return {
          label: 'Batang Karakter',
          icon: '🪴',
          minXp: 250,
          description: 'Kemandirian sentra dan kolaborasi bermain tumbuh kokoh.'
        };
      case 'BERBUNGA':
        return {
          label: 'Pohon Berbunga Indah',
          icon: '🌸',
          minXp: 500,
          description: 'Karya kreatif dan hafalan surat pendek menghiasi taman karakter.'
        };
      case 'BERBUAH':
        return {
          label: 'Pohon Berbuah Berkah',
          icon: '🌳',
          minXp: 800,
          description: 'Santri teladan siap melangkah percaya diri menuju jenjang SD.'
        };
    }
  }

  public getSampleStudentTree(studentId: string = 'std-sample', studentName: string = 'Aisyah Putri'): StudentTreeProfile {
    const leaves: TreeLeafMilestone[] = [
      {
        id: 'leaf-1',
        pillar: 'TAHFIDZ',
        title: 'Hafal Surah An-Nasr',
        surahOrHabit: 'Juz 30 — Makhraj Jelas',
        achievedDate: '2026-08-15',
        colorTone: 'text-emerald-600 bg-emerald-100',
        xpPoints: 30
      },
      {
        id: 'leaf-2',
        pillar: 'ADAB',
        title: 'Doa Sebelum & Sesudah Makan',
        surahOrHabit: 'Membaca dengan khusyuk',
        achievedDate: '2026-08-18',
        colorTone: 'text-amber-600 bg-amber-100',
        xpPoints: 25
      },
      {
        id: 'leaf-3',
        pillar: 'SHOLAT',
        title: 'Gerakan Sholat Dhuha Mandiri',
        surahOrHabit: 'Tertib & Thuma\'ninah',
        achievedDate: '2026-08-20',
        colorTone: 'text-teal-600 bg-teal-100',
        xpPoints: 35
      },
      {
        id: 'leaf-4',
        pillar: 'KEMANDIRIAN',
        title: 'Merapikan Kotak Makan Sendiri',
        surahOrHabit: 'Tanggung Jawab Kebersihan',
        achievedDate: '2026-08-21',
        colorTone: 'text-blue-600 bg-blue-100',
        xpPoints: 20
      }
    ];

    const flowers: TreeFlowerAppreciation[] = [
      {
        id: 'flow-1',
        title: 'Bintang Adab & Kesopanan Pekanan',
        senderUstadzah: 'Ustadzah Fatimah, S.Pd.',
        date: '2026-08-19',
        badgeLabel: 'Akhlak Mulia',
        flowerType: 'MELATI'
      },
      {
        id: 'flow-2',
        title: 'Kreativitas Sentra Bahan Alam',
        senderUstadzah: 'Ustadzah Nurul, S.Pd.',
        date: '2026-08-21',
        badgeLabel: 'Karya Terbaik',
        flowerType: 'ANGGREK_EMAS'
      }
    ];

    const totalXp = leaves.reduce((sum, l) => sum + l.xpPoints, 0) + (flowers.length * 50);

    return {
      studentId,
      studentName,
      className: 'Kelompok B1 — Sentra Balok & Alam',
      stage: 'BATANG_MUDA',
      stageLabel: 'Batang Karakter (Level 3)',
      currentXp: totalXp,
      nextLevelXp: 500,
      totalLeaves: leaves.length,
      totalFlowers: flowers.length,
      treeHealth: 98,
      leaves,
      flowers,
      eventBonusActive: 'Semarak Kemerdekaan (+25 Bonus XP)'
    };
  }
}

export const growingTreeService = GrowingTreeService.getInstance();
