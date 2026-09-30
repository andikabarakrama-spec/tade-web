/**
 * TADE RC98 — R803: Smart Edge Sitting Engine
 * Memungkinkan Asy duduk di tepi card/panel aktif tanpa menutupi konten
 * Otomatis kembali ke dock saat pengguna scroll atau setelah durasi selesai
 */

export interface EdgeSittingState {
  isSitting: boolean;
  targetCardTitle: string;
  edgePosition: 'TOP_RIGHT' | 'TOP_LEFT' | 'CARD_HEADER' | 'NONE';
  sittingOffsetX: number;
  sittingOffsetY: number;
  remainingSeconds: number;
}

export class SmartEdgeSittingEngine {
  private static instance: SmartEdgeSittingEngine;
  private state: EdgeSittingState;
  private listeners: Set<(state: EdgeSittingState) => void> = new Set();
  private sitTimer: any = null;
  private countdownInterval: any = null;

  private constructor() {
    this.state = {
      isSitting: false,
      targetCardTitle: '',
      edgePosition: 'NONE',
      sittingOffsetX: 0,
      sittingOffsetY: 0,
      remainingSeconds: 0
    };

    if (typeof window !== 'undefined') {
      this.initScrollListener();
    }
  }

  public static getInstance(): SmartEdgeSittingEngine {
    if (!SmartEdgeSittingEngine.instance) {
      SmartEdgeSittingEngine.instance = new SmartEdgeSittingEngine();
    }
    return SmartEdgeSittingEngine.instance;
  }

  public getState(): EdgeSittingState {
    return { ...this.state };
  }

  public subscribe(listener: (state: EdgeSittingState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  /**
   * Mengirim Asy untuk duduk di tepi card tertentu
   */
  public sitOnCard(
    cardTitle: string,
    position: 'TOP_RIGHT' | 'TOP_LEFT' | 'CARD_HEADER' = 'TOP_RIGHT',
    durationSeconds = 6
  ): void {
    this.clearTimers();

    let offsetX = 0;
    let offsetY = 0;

    switch (position) {
      case 'TOP_RIGHT':
        offsetX = 36;
        offsetY = 48;
        break;
      case 'TOP_LEFT':
        offsetX = 80;
        offsetY = 48;
        break;
      case 'CARD_HEADER':
        offsetX = 50;
        offsetY = 65;
        break;
    }

    this.state = {
      isSitting: true,
      targetCardTitle: cardTitle,
      edgePosition: position,
      sittingOffsetX: offsetX,
      sittingOffsetY: offsetY,
      remainingSeconds: durationSeconds
    };
    this.notify();

    // Countdown interval
    this.countdownInterval = setInterval(() => {
      if (this.state.remainingSeconds > 1) {
        this.state.remainingSeconds -= 1;
        this.notify();
      } else {
        this.returnToDock();
      }
    }, 1000);

    // Auto return after duration
    this.sitTimer = setTimeout(() => {
      this.returnToDock();
    }, durationSeconds * 1000);
  }

  /**
   * Kembali dengan cepat dan santun ke dock
   */
  public returnToDock(): void {
    this.clearTimers();
    if (this.state.isSitting) {
      this.state = {
        isSitting: false,
        targetCardTitle: '',
        edgePosition: 'NONE',
        sittingOffsetX: 0,
        sittingOffsetY: 0,
        remainingSeconds: 0
      };
      this.notify();
    }
  }

  private clearTimers(): void {
    if (this.sitTimer) clearTimeout(this.sitTimer);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.sitTimer = null;
    this.countdownInterval = null;
  }

  private initScrollListener(): void {
    // Segera kembali ke dock saat pengguna scroll agar pandangan formulir 100% bersih
    window.addEventListener('scroll', () => {
      if (this.state.isSitting) {
        this.returnToDock();
      }
    }, { passive: true });
  }

  private notify(): void {
    const s = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(s);
      } catch (err) {
        console.error('[SmartEdgeSittingEngine] Notification error:', err);
      }
    });
  }
}
