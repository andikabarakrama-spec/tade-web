/**
 * TADE RC97 — R798: Quiet Presence Mode
 * Mode Penjagaan Hening Produktif Saat Pengguna Bekerja Fokus / Lama
 * Mengurangi intensitas animasi, menghentikan bubble spontan, dan menjaga fokus pengguna 100%
 */

export interface QuietModeState {
  isActive: boolean;
  isAutoDetected: boolean;
  continuousFocusMinutes: number;
  lastUserActivityTimestamp: number;
  suppressSpontaneousBubbles: boolean;
  minimalAnimationMode: boolean;
  reason: string;
}

type QuietModeListener = (state: QuietModeState) => void;

export class QuietPresenceMode {
  private static instance: QuietPresenceMode;
  private state: QuietModeState;
  private listeners: Set<QuietModeListener> = new Set();
  private focusInterval: any = null;
  private focusStartTime: number = Date.now();

  private constructor() {
    this.state = {
      isActive: false,
      isAutoDetected: false,
      continuousFocusMinutes: 0,
      lastUserActivityTimestamp: Date.now(),
      suppressSpontaneousBubbles: false,
      minimalAnimationMode: false,
      reason: 'Sistem Standar'
    };

    if (typeof window !== 'undefined') {
      this.initActivityListeners();
    }
  }

  public static getInstance(): QuietPresenceMode {
    if (!QuietPresenceMode.instance) {
      QuietPresenceMode.instance = new QuietPresenceMode();
    }
    return QuietPresenceMode.instance;
  }

  public getState(): QuietModeState {
    return { ...this.state };
  }

  public subscribe(listener: QuietModeListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  public setManualQuietMode(active: boolean): void {
    this.state = {
      ...this.state,
      isActive: active,
      isAutoDetected: false,
      suppressSpontaneousBubbles: active,
      minimalAnimationMode: active,
      reason: active ? 'Diaktifkan Manual oleh Pengguna' : 'Mode Standar Aktif'
    };
    this.notify();
  }

  public recordUserActivity(): void {
    this.state.lastUserActivityTimestamp = Date.now();
    // If not manual locked and in quiet mode due to long inactivity, check
  }

  private initActivityListeners(): void {
    const onActivity = () => {
      this.recordUserActivity();
    };

    window.addEventListener('keydown', onActivity, { passive: true });
    window.addEventListener('mousemove', onActivity, { passive: true });
    window.addEventListener('touchstart', onActivity, { passive: true });

    // Focus monitor every 30 seconds
    this.focusInterval = setInterval(() => {
      const now = Date.now();
      const diffMinutes = Math.floor((now - this.focusStartTime) / 60000);
      this.state.continuousFocusMinutes = diffMinutes;

      // Auto-engage quiet mode if working for > 4 minutes to avoid distractions
      if (!this.state.isActive && diffMinutes >= 4) {
        this.state.isActive = true;
        this.state.isAutoDetected = true;
        this.state.suppressSpontaneousBubbles = true;
        this.state.minimalAnimationMode = true;
        this.state.reason = 'Terdeteksi Fokus Kerja Berkelanjutan (>4 menit)';
        this.notify();
      }
    }, 30000);
  }

  private notify(): void {
    const s = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(s);
      } catch (err) {
        console.error('[QuietPresenceMode] Notification error:', err);
      }
    });
  }
}
