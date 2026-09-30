/**
 * TADE RC98 — R801: Peek Intelligence Engine
 * Mengatur kemunculan bertahap Asy di HP: Mata muncul dulu -> Kepala keluar -> Naik sedikit
 * Durasi animasi optimal 300–500 ms dengan pembatasan area aman layar (safe viewport bounding)
 */

export type PeekStage = 'HIDDEN' | 'EYES_ONLY' | 'HEAD_OUT' | 'PARTIAL_BODY' | 'FULL_DOCK';

export interface PeekState {
  stage: PeekStage;
  peekOffsetY: number; // Offset Y dalam pixel (misal: -40px saat hanya mata)
  peekOffsetX: number;
  rotationDeg: number;
  opacity: number;
  scale: number;
  isPeeking: boolean;
  activeSide: 'RIGHT_BOTTOM' | 'LEFT_BOTTOM' | 'CARD_EDGE';
}

export class PeekIntelligenceEngine {
  private static instance: PeekIntelligenceEngine;
  private state: PeekState;
  private listeners: Set<(state: PeekState) => void> = new Set();
  private peekTimeout: any = null;

  private constructor() {
    this.state = {
      stage: 'FULL_DOCK',
      peekOffsetY: 0,
      peekOffsetX: 0,
      rotationDeg: 0,
      opacity: 1,
      scale: 1,
      isPeeking: false,
      activeSide: 'RIGHT_BOTTOM'
    };
  }

  public static getInstance(): PeekIntelligenceEngine {
    if (!PeekIntelligenceEngine.instance) {
      PeekIntelligenceEngine.instance = new PeekIntelligenceEngine();
    }
    return PeekIntelligenceEngine.instance;
  }

  public getState(): PeekState {
    return { ...this.state };
  }

  public subscribe(listener: (state: PeekState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  /**
   * Menjalankan urutan kemunculan bertahap ramah mobile:
   * 1. EYES_ONLY (0–120ms): Mengintip dari balik tepi layar
   * 2. HEAD_OUT (120–280ms): Kepala dan peci menyembul
   * 3. PARTIAL_BODY (280–420ms): Naik sedikit dengan senyuman
   * 4. FULL_DOCK (420–500ms): Posisi dock penuh nyaman
   */
  public triggerStagedEntrance(side: 'RIGHT_BOTTOM' | 'LEFT_BOTTOM' | 'CARD_EDGE' = 'RIGHT_BOTTOM'): void {
    if (this.peekTimeout) clearTimeout(this.peekTimeout);

    // Stage 1: Eyes Only
    this.state = {
      stage: 'EYES_ONLY',
      peekOffsetY: -35,
      peekOffsetX: side === 'RIGHT_BOTTOM' ? -10 : 10,
      rotationDeg: side === 'RIGHT_BOTTOM' ? -8 : 8,
      opacity: 0.85,
      scale: 0.85,
      isPeeking: true,
      activeSide: side
    };
    this.notify();

    // Stage 2: Head Out
    this.peekTimeout = setTimeout(() => {
      this.state = {
        ...this.state,
        stage: 'HEAD_OUT',
        peekOffsetY: -20,
        peekOffsetX: side === 'RIGHT_BOTTOM' ? -5 : 5,
        rotationDeg: side === 'RIGHT_BOTTOM' ? -4 : 4,
        opacity: 0.95,
        scale: 0.92
      };
      this.notify();

      // Stage 3: Partial Body
      this.peekTimeout = setTimeout(() => {
        this.state = {
          ...this.state,
          stage: 'PARTIAL_BODY',
          peekOffsetY: -8,
          peekOffsetX: 0,
          rotationDeg: 0,
          opacity: 1,
          scale: 0.98
        };
        this.notify();

        // Stage 4: Full Dock Comfort
        this.peekTimeout = setTimeout(() => {
          this.state = {
            stage: 'FULL_DOCK',
            peekOffsetY: 0,
            peekOffsetX: 0,
            rotationDeg: 0,
            opacity: 1,
            scale: 1,
            isPeeking: false,
            activeSide: side
          };
          this.notify();
        }, 120);
      }, 140);
    }, 130);
  }

  /**
   * Mode sembunyi setengah badan saat pengguna fokus mengetik
   */
  public hideToPeek(): void {
    this.state = {
      stage: 'EYES_ONLY',
      peekOffsetY: -32,
      peekOffsetX: -8,
      rotationDeg: -6,
      opacity: 0.75,
      scale: 0.85,
      isPeeking: true,
      activeSide: 'RIGHT_BOTTOM'
    };
    this.notify();
  }

  public resetToFullDock(): void {
    if (this.peekTimeout) clearTimeout(this.peekTimeout);
    this.state = {
      stage: 'FULL_DOCK',
      peekOffsetY: 0,
      peekOffsetX: 0,
      rotationDeg: 0,
      opacity: 1,
      scale: 1,
      isPeeking: false,
      activeSide: 'RIGHT_BOTTOM'
    };
    this.notify();
  }

  private notify(): void {
    const s = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(s);
      } catch (err) {
        console.error('[PeekIntelligenceEngine] Notification error:', err);
      }
    });
  }
}
