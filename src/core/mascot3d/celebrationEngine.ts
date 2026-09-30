/**
 * TADE RC97 — R795: Celebration Engine
 * Mesin Perayaan Ringan Berbasis Pencapaian (Tahfidz, Simpan Data, Absensi, PPDB)
 * Efek bintang lembut, konfeti minimal zamrud & emas, tepuk tangan ceria tanpa lag
 */

import { EmotionalStateEngine } from './emotionalStateEngine';
import { LivingAnimationEngine } from './livingAnimationEngine';
import { BubbleDialogueSystem } from './bubbleDialogueSystem';
import { ContextMovementEngine } from './contextMovementEngine';

export type CelebrationEventType =
  | 'SAVE_SUCCESS'
  | 'TAHFIDZ_MILESTONE'
  | 'ATTENDANCE_COMPLETE'
  | 'PPDB_COMPLETE'
  | 'EXCELLENCE_MILESTONE';

export interface ActiveCelebration {
  id: string;
  type: CelebrationEventType;
  title: string;
  subtitle: string;
  icon: string;
  timestamp: number;
  particles: Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    velocity: { x: number; y: number };
    alpha: number;
  }>;
}

type CelebrationListener = (celebration: ActiveCelebration | null) => void;

export class CelebrationEngine {
  private static instance: CelebrationEngine;
  private currentCelebration: ActiveCelebration | null = null;
  private listeners: Set<CelebrationListener> = new Set();
  private celebrationTimeout: any = null;

  private constructor() {}

  public static getInstance(): CelebrationEngine {
    if (!CelebrationEngine.instance) {
      CelebrationEngine.instance = new CelebrationEngine();
    }
    return CelebrationEngine.instance;
  }

  public subscribe(listener: CelebrationListener): () => void {
    this.listeners.add(listener);
    listener(this.currentCelebration);
    return () => this.listeners.delete(listener);
  }

  public triggerCelebration(type: CelebrationEventType, details?: { title?: string; subtitle?: string; customMessage?: string }): void {
    if (this.celebrationTimeout) {
      clearTimeout(this.celebrationTimeout);
      this.celebrationTimeout = null;
    }

    let title = details?.title || 'Alhamdulillah!';
    let subtitle = details?.subtitle || 'Operasi berhasil diselesaikan dengan baik.';
    let bubbleMessage = details?.customMessage || 'Barakallah fikum! Data tersimpan dengan rapi dan aman.';
    let icon = '✨';

    switch (type) {
      case 'SAVE_SUCCESS':
        title = 'Data Tersimpan Aman!';
        subtitle = 'Integritas data tersinkronisasi ke Single Source of Truth.';
        bubbleMessage = 'Alhamdulillah! Berkas telah tersimpan rapi tanpa celah.';
        icon = '💾';
        break;

      case 'TAHFIDZ_MILESTONE':
        title = 'Mubarak! Capaian Tahfidz Santri';
        subtitle = 'Hafalan surat santri tercatat dalam buku prestasi.';
        bubbleMessage = 'Subhanallah! Semoga menjadi mahkota kemuliaan bagi kedua orang tua.';
        icon = '👑';
        break;

      case 'ATTENDANCE_COMPLETE':
        title = 'Presensi Harian Lengkap!';
        subtitle = 'Seluruh kehadiran santri dan ustadzah telah diverifikasi.';
        bubbleMessage = 'Alhamdulillah, presensi hari ini lengkap dan tertib.';
        icon = '📋';
        break;

      case 'PPDB_COMPLETE':
        title = 'Santri Baru Terdaftar!';
        subtitle = 'Pemberkasan PPDB santri baru tersimpan dalam registri.';
        bubbleMessage = 'Ahlan wa sahlan! Selamat bergabung di keluarga besar TK Asy Syifa Tanggul.';
        icon = '🎓';
        break;

      case 'EXCELLENCE_MILESTONE':
        title = 'Pencapaian Istimewa!';
        subtitle = 'Laporan tata kelola madrasah telah tervalidasi.';
        bubbleMessage = 'MasyaAllah tabarakallah! Prestasi kerja yang sangat amanah.';
        icon = '⭐';
        break;
    }

    // Generate lightweight star and emerald particles (20 items max)
    const emeraldGoldColors = ['#10b981', '#059669', '#f59e0b', '#fbbf24', '#34d399', '#fef08a'];
    const particles = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 - 40,
      y: Math.random() * -60 - 20,
      size: Math.random() * 8 + 4,
      color: emeraldGoldColors[i % emeraldGoldColors.length],
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: -Math.random() * 4 - 2
      },
      alpha: 1.0
    }));

    this.currentCelebration = {
      id: `CEL-${Date.now()}`,
      type,
      title,
      subtitle,
      icon,
      timestamp: Date.now(),
      particles
    };

    // Orchestrate with other engines
    EmotionalStateEngine.getInstance().setEmotion('PROUD', `CELEBRATION_${type}`, {
      durationMs: 7000,
      decayTo: 'HAPPY'
    });

    LivingAnimationEngine.getInstance().triggerPose('CELEBRATE', 5000);
    ContextMovementEngine.getInstance().triggerMovement('POINTER_GUIDE', { durationMs: 4000 });

    BubbleDialogueSystem.getInstance().speak(bubbleMessage, {
      durationMs: 5000,
      priority: 'HIGH',
      category: 'CELEBRATION'
    });

    this.notify();

    // Auto cleanup after 4 seconds
    this.celebrationTimeout = setTimeout(() => {
      this.currentCelebration = null;
      this.notify();
    }, 4500);
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn(this.currentCelebration);
      } catch (err) {
        console.error('[CelebrationEngine] Notification error:', err);
      }
    });
  }
}
