/**
 * R785 — Bubble Dialogue System
 * TADE RC96A — ASY LIVING 3D MASCOT FOUNDATION
 * 
 * Lightweight speech and thought bubble system.
 * Designed to be zero-intrusive, auto-dismissing, clickable to close, with sound-ready hooks.
 */

export interface SpeechBubbleItem {
  id: string;
  message: string;
  category: string;
  type?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CONSTITUTIONAL';
  durationMs: number;
  createdAt: number;
  expiresAt: number;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export class BubbleDialogueSystem {
  private static instance: BubbleDialogueSystem;
  private currentBubble: SpeechBubbleItem | null = null;
  private queue: SpeechBubbleItem[] = [];
  private listeners: Set<(bubble: SpeechBubbleItem | null) => void> = new Set();
  private dismissTimer: any = null;
  private isMuted: boolean = false;

  private constructor() {}

  public static getInstance(): BubbleDialogueSystem {
    if (!BubbleDialogueSystem.instance) {
      BubbleDialogueSystem.instance = new BubbleDialogueSystem();
    }
    return BubbleDialogueSystem.instance;
  }

  public speak(
    message: string, 
    options?: { 
      durationMs?: number; 
      priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CONSTITUTIONAL';
      category?: string;
      actionButton?: { label: string; onClick: () => void };
    }
  ) {
    const duration = options?.durationMs || 4500;
    const priority = options?.priority || 'NORMAL';
    const now = Date.now();

    const bubble: SpeechBubbleItem = {
      id: `BUBBLE-${now}-${Math.floor(Math.random() * 1000)}`,
      message,
      category: options?.category || 'GENERAL',
      priority,
      durationMs: duration,
      createdAt: now,
      expiresAt: now + duration,
      actionButton: options?.actionButton
    };

    if (!this.currentBubble) {
      this.displayBubble(bubble);
    } else if (priority === 'CONSTITUTIONAL' || priority === 'HIGH') {
      this.displayBubble(bubble);
    } else {
      this.queue.push(bubble);
    }
  }

  private displayBubble(bubble: SpeechBubbleItem) {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }

    this.currentBubble = bubble;
    this.notify();

    this.dismissTimer = setTimeout(() => {
      this.dismissCurrent();
    }, bubble.durationMs);
  }

  public dismissCurrent() {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }

    this.currentBubble = null;

    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next && Date.now() < next.expiresAt) {
        this.displayBubble(next);
        return;
      }
    }

    this.notify();
  }

  public getCurrentBubble(): SpeechBubbleItem | null {
    return this.currentBubble;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public subscribe(listener: (bubble: SpeechBubbleItem | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentBubble);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentBubble));
  }
}
