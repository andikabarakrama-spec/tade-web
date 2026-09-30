/**
 * TADE RC97 — R796: Gentle Guidance Engine
 * Mesin Panduan Santun & Non-Intrusif untuk Membantu Pengguna
 * Memberikan isyarat ramah tanpa memaksa, tanpa mengunci layar, dan mudah ditutup
 */

import { EmotionalStateEngine } from './emotionalStateEngine';
import { BubbleDialogueSystem } from './bubbleDialogueSystem';
import { ContextMovementEngine } from './contextMovementEngine';

export interface GuidanceTip {
  id: string;
  targetFeature: string;
  title: string;
  message: string;
  actionText?: string;
  actionCallbackId?: string;
  icon: string;
}

export class GentleGuidanceEngine {
  private static instance: GentleGuidanceEngine;
  private activeTip: GuidanceTip | null = null;
  private listeners: Set<(tip: GuidanceTip | null) => void> = new Set();
  private dismissalHistory: Set<string> = new Set();

  private defaultTips: GuidanceTip[] = [
    {
      id: 'GUIDE-CTRL-K',
      targetFeature: 'NAV_GLOBAL',
      title: 'Pencarian Cepat Modul',
      message: 'Bunda / Ustadzah bisa menekan tombol CTRL + K kapan saja untuk membuka Founder Command Palette & pencarian instan.',
      actionText: 'Buka Palette',
      icon: 'Command'
    },
    {
      id: 'GUIDE-SAVE-CONFIRM',
      targetFeature: 'FORM_INPUT',
      title: 'Simpan Data dengan Tenang',
      message: 'Pastikan nama dan tanggal lahir santri telah sesuai sebelum menekan tombol Simpan Hijau.',
      icon: 'CheckCircle'
    },
    {
      id: 'GUIDE-OFFLINE-READY',
      targetFeature: 'NETWORK_OFFLINE',
      title: 'Bekerja Offline Aman',
      message: 'SIM TK Asy Syifa mendukung penyimpanan lokal otomatis. Anda tetap dapat mencatat presensi saat internet terputus.',
      icon: 'Wifi'
    },
    {
      id: 'GUIDE-SENIOR-MODE',
      targetFeature: 'SENIOR_MODE',
      title: 'Mode Guru Senior',
      message: 'Ingin tampilan menu yang lebih ringkas dan tulisan lebih besar? Aktifkan Mode Guru Senior di bilah samping.',
      icon: 'Sparkles'
    }
  ];

  private constructor() {}

  public static getInstance(): GentleGuidanceEngine {
    if (!GentleGuidanceEngine.instance) {
      GentleGuidanceEngine.instance = new GentleGuidanceEngine();
    }
    return GentleGuidanceEngine.instance;
  }

  public subscribe(listener: (tip: GuidanceTip | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.activeTip);
    return () => this.listeners.delete(listener);
  }

  public triggerGuidance(tipIdOrCustom: string | GuidanceTip): void {
    let tip: GuidanceTip | undefined;

    if (typeof tipIdOrCustom === 'string') {
      tip = this.defaultTips.find(t => t.id === tipIdOrCustom);
    } else {
      tip = tipIdOrCustom;
    }

    if (!tip) return;

    this.activeTip = tip;

    // Orchestrate with Mascot
    EmotionalStateEngine.getInstance().setEmotion('CURIOUS', 'GENTLE_GUIDANCE', {
      durationMs: 8000,
      decayTo: 'HAPPY'
    });

    ContextMovementEngine.getInstance().triggerMovement('POINTER_GUIDE', {
      durationMs: 7000,
      targetDescription: tip.title
    });

    BubbleDialogueSystem.getInstance().speak(tip.message, {
      durationMs: 7000,
      priority: 'NORMAL',
      category: 'HELP'
    });

    this.notify();
  }

  public dismissTip(): void {
    if (this.activeTip) {
      this.dismissalHistory.add(this.activeTip.id);
    }
    this.activeTip = null;
    this.notify();
  }

  public getAllPresetTips(): GuidanceTip[] {
    return [...this.defaultTips];
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn(this.activeTip);
      } catch (err) {
        console.error('[GentleGuidanceEngine] Notification error:', err);
      }
    });
  }
}
