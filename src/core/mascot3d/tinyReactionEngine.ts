/**
 * TADE RC98 — R804: Tiny Reaction Engine
 * Reaksi mikro instan (<500ms trigger) untuk aksi pengguna:
 * Save sukses (👍), Upload selesai (✨), QR berhasil (😊), Toggle aktif (🙏), Milestone (🎉)
 * Ringan, tanpa popup besar pemblokir layar.
 */

import { EmotionalStateEngine } from './emotionalStateEngine';
import { LivingAnimationEngine } from './livingAnimationEngine';

export type TinyReactionType = 'SAVE_SUCCESS' | 'UPLOAD_COMPLETE' | 'QR_SUCCESS' | 'TOGGLE_ACTIVE' | 'MILESTONE';

export interface TinyReactionItem {
  id: string;
  type: TinyReactionType;
  emoji: string;
  badgeText: string;
  accentColor: string;
  createdAt: number;
  durationMs: number;
}

export class TinyReactionEngine {
  private static instance: TinyReactionEngine;
  private currentReaction: TinyReactionItem | null = null;
  private listeners: Set<(reaction: TinyReactionItem | null) => void> = new Set();
  private decayTimeout: any = null;

  private constructor() {}

  public static getInstance(): TinyReactionEngine {
    if (!TinyReactionEngine.instance) {
      TinyReactionEngine.instance = new TinyReactionEngine();
    }
    return TinyReactionEngine.instance;
  }

  public getCurrentReaction(): TinyReactionItem | null {
    return this.currentReaction;
  }

  public subscribe(listener: (reaction: TinyReactionItem | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.getCurrentReaction());
    return () => this.listeners.delete(listener);
  }

  /**
   * Memicu reaksi mikro cepat dan hangat
   */
  public trigger(type: TinyReactionType, customText?: string): void {
    if (this.decayTimeout) clearTimeout(this.decayTimeout);

    let emoji = '👍';
    let defaultText = 'Tersimpan!';
    let accent = '#10B981';

    switch (type) {
      case 'SAVE_SUCCESS':
        emoji = '👍';
        defaultText = 'Alhamdulillah!';
        accent = '#10B981';
        EmotionalStateEngine.getInstance().setEmotion('HAPPY', 'TINY_REACTION_SAVE', { durationMs: 2500 });
        LivingAnimationEngine.getInstance().triggerPose('WAVE', 1200);
        break;

      case 'UPLOAD_COMPLETE':
        emoji = '✨';
        defaultText = 'Berkas Siap!';
        accent = '#3B82F6';
        EmotionalStateEngine.getInstance().setEmotion('PROUD', 'TINY_REACTION_UPLOAD', { durationMs: 2500 });
        LivingAnimationEngine.getInstance().triggerPose('SMALL_JUMP', 1200);
        break;

      case 'QR_SUCCESS':
        emoji = '😊';
        defaultText = 'QR Terverifikasi!';
        accent = '#8B5CF6';
        EmotionalStateEngine.getInstance().setEmotion('HAPPY', 'TINY_REACTION_QR', { durationMs: 2500 });
        LivingAnimationEngine.getInstance().triggerPose('LOOK_AROUND', 1200);
        break;

      case 'TOGGLE_ACTIVE':
        emoji = '🙏';
        defaultText = 'Bismillah!';
        accent = '#F59E0B';
        EmotionalStateEngine.getInstance().setEmotion('PRAYING', 'TINY_REACTION_TOGGLE', { durationMs: 2200 });
        LivingAnimationEngine.getInstance().triggerPose('READING_DOA', 1500);
        break;

      case 'MILESTONE':
        emoji = '🎉';
        defaultText = 'Masya Allah!';
        accent = '#EC4899';
        EmotionalStateEngine.getInstance().setEmotion('PROUD', 'TINY_REACTION_MILESTONE', { durationMs: 3000 });
        LivingAnimationEngine.getInstance().triggerPose('CELEBRATE', 1800);
        break;
    }

    this.currentReaction = {
      id: `TR-${Date.now()}`,
      type,
      emoji,
      badgeText: customText || defaultText,
      accentColor: accent,
      createdAt: Date.now(),
      durationMs: 2200
    };
    this.notify();

    // Auto dismiss after duration
    this.decayTimeout = setTimeout(() => {
      this.currentReaction = null;
      this.notify();
    }, 2200);
  }

  public dismiss(): void {
    if (this.decayTimeout) clearTimeout(this.decayTimeout);
    this.currentReaction = null;
    this.notify();
  }

  private notify(): void {
    const r = this.getCurrentReaction();
    this.listeners.forEach(fn => {
      try {
        fn(r);
      } catch (err) {
        console.error('[TinyReactionEngine] Notification error:', err);
      }
    });
  }
}
