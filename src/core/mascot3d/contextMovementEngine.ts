/**
 * TADE RC97 — R793: Context Movement Engine
 * Mesin Gerak Kontekstual Aman Maskot Asy di Ruang Layar UI
 * Memungkinkan Asy mengintip (peek), duduk di card, menghampiri lonceng, dan memandu tombol penting
 */

export type MascotMovementMode =
  | 'DOCK_NORMAL'
  | 'PEEK'
  | 'CARD_SIT'
  | 'BELL_RUN'
  | 'POINTER_GUIDE';

export interface MascotPositionOffset {
  mode: MascotMovementMode;
  offsetX: number; // in pixels relative to base dock
  offsetY: number; // in pixels relative to base dock
  scaleMultiplier: number;
  rotationDeg: number;
  label: string;
  durationMs: number;
  targetDescription: string;
  autoReturn: boolean;
}

type MovementListener = (pos: MascotPositionOffset) => void;

export class ContextMovementEngine {
  private static instance: ContextMovementEngine;
  private currentMovement: MascotPositionOffset;
  private listeners: Set<MovementListener> = new Set();
  private autoReturnTimeout: any = null;

  private constructor() {
    this.currentMovement = {
      mode: 'DOCK_NORMAL',
      offsetX: 0,
      offsetY: 0,
      scaleMultiplier: 1.0,
      rotationDeg: 0,
      label: 'Posisi Dock Normal',
      durationMs: 0,
      targetDescription: 'Sudut Kanan Bawah',
      autoReturn: false
    };
  }

  public static getInstance(): ContextMovementEngine {
    if (!ContextMovementEngine.instance) {
      ContextMovementEngine.instance = new ContextMovementEngine();
    }
    return ContextMovementEngine.instance;
  }

  public getMovement(): MascotPositionOffset {
    return { ...this.currentMovement };
  }

  public subscribe(listener: MovementListener): () => void {
    this.listeners.add(listener);
    listener(this.getMovement());
    return () => this.listeners.delete(listener);
  }

  public triggerMovement(
    mode: MascotMovementMode,
    options?: {
      durationMs?: number;
      targetDescription?: string;
      customOffsetX?: number;
      customOffsetY?: number;
    }
  ): void {
    if (this.autoReturnTimeout) {
      clearTimeout(this.autoReturnTimeout);
      this.autoReturnTimeout = null;
    }

    const durationMs = options?.durationMs ?? 6000;
    const targetDescription = options?.targetDescription ?? 'Area Kontekstual';

    let offsetX = options?.customOffsetX ?? 0;
    let offsetY = options?.customOffsetY ?? 0;
    let scaleMultiplier = 1.0;
    let rotationDeg = 0;
    let label = 'Posisi Dock Normal';

    switch (mode) {
      case 'DOCK_NORMAL':
        offsetX = 0;
        offsetY = 0;
        scaleMultiplier = 1.0;
        rotationDeg = 0;
        label = 'Posisi Dock Normal';
        break;

      case 'PEEK':
        // Ngintip dari tepi kanan
        offsetX = 35;
        offsetY = -20;
        scaleMultiplier = 0.95;
        rotationDeg = -12;
        label = 'Mengintip Ramah (Peek)';
        break;

      case 'CARD_SIT':
        // Duduk di atas tepi card/panel
        offsetX = -25;
        offsetY = -45;
        scaleMultiplier = 1.05;
        rotationDeg = 4;
        label = 'Duduk di Tepi Card';
        break;

      case 'BELL_RUN':
        // Melangkah mendekati icon lonceng
        offsetX = -15;
        offsetY = -70;
        scaleMultiplier = 0.92;
        rotationDeg = -6;
        label = 'Menghampiri Lonceng Notifikasi';
        break;

      case 'POINTER_GUIDE':
        // Mengarahkan tangan ke tombol aksi
        offsetX = -40;
        offsetY = -30;
        scaleMultiplier = 1.08;
        rotationDeg = 8;
        label = 'Memandu Aksi Tombol Penting';
        break;
    }

    this.currentMovement = {
      mode,
      offsetX,
      offsetY,
      scaleMultiplier,
      rotationDeg,
      label,
      durationMs,
      targetDescription,
      autoReturn: mode !== 'DOCK_NORMAL'
    };

    this.notify();

    // Auto-return to dock if not permanent
    if (mode !== 'DOCK_NORMAL' && durationMs > 0) {
      this.autoReturnTimeout = setTimeout(() => {
        this.triggerMovement('DOCK_NORMAL', { durationMs: 0 });
      }, durationMs);
    }
  }

  public resetToDock(): void {
    this.triggerMovement('DOCK_NORMAL', { durationMs: 0 });
  }

  private notify(): void {
    const pos = this.getMovement();
    this.listeners.forEach(fn => {
      try {
        fn(pos);
      } catch (err) {
        console.error('[ContextMovementEngine] Notification error:', err);
      }
    });
  }
}
