/**
 * TADE RC98 — R802: Thumb Awareness Engine
 * Memahami Zona Ibu Jari Pengguna Mobile (360px, 390px, 412px, 430px)
 * Menghindari area sentuh jempol, bergeser saat FAB/keyboard aktif, dan menjamin kenyamanan 1 tangan
 */

export interface ThumbZoneConfig {
  screenWidth: number;
  screenHeight: number;
  isKeyboardVisible: boolean;
  isFABActive: boolean;
  isUserTouchingBottomRight: boolean;
  thumbDodgeOffsetX: number; // Offset geser horizontal (px)
  thumbDodgeOffsetY: number; // Offset geser vertikal (px)
  reason: string;
}

export class ThumbAwarenessEngine {
  private static instance: ThumbAwarenessEngine;
  private config: ThumbZoneConfig;
  private listeners: Set<(config: ThumbZoneConfig) => void> = new Set();
  private touchResetTimeout: any = null;

  private constructor() {
    const width = typeof window !== 'undefined' ? window.innerWidth : 390;
    const height = typeof window !== 'undefined' ? window.innerHeight : 844;

    this.config = {
      screenWidth: width,
      screenHeight: height,
      isKeyboardVisible: false,
      isFABActive: false,
      isUserTouchingBottomRight: false,
      thumbDodgeOffsetX: 0,
      thumbDodgeOffsetY: 0,
      reason: 'Posisi Nyaman Standar'
    };

    if (typeof window !== 'undefined') {
      this.initEventListeners();
    }
  }

  public static getInstance(): ThumbAwarenessEngine {
    if (!ThumbAwarenessEngine.instance) {
      ThumbAwarenessEngine.instance = new ThumbAwarenessEngine();
    }
    return ThumbAwarenessEngine.instance;
  }

  public getConfig(): ThumbZoneConfig {
    return { ...this.config };
  }

  public subscribe(listener: (config: ThumbZoneConfig) => void): () => void {
    this.listeners.add(listener);
    listener(this.getConfig());
    return () => this.listeners.delete(listener);
  }

  /**
   * Set status FAB (misal: tombol WhatsApp atau Tombol Aksi Cepat)
   */
  public setFABPresence(active: boolean): void {
    this.config.isFABActive = active;
    this.recalculateOffsets();
  }

  /**
   * Set status keyboard virtual mobile
   */
  public setKeyboardPresence(visible: boolean): void {
    this.config.isKeyboardVisible = visible;
    this.recalculateOffsets();
  }

  /**
   * Simulasi ukuran layar mobile untuk One-Hand UX Validator (360, 390, 412, 430 px)
   */
  public simulateScreen(width: number, height = 800): void {
    this.config.screenWidth = width;
    this.config.screenHeight = height;
    this.recalculateOffsets();
  }

  /**
   * Memicu penghindaran sentuhan jempol di pojok kanan bawah
   */
  public handleThumbZoneTouch(touchX: number, touchY: number): void {
    const isBottomRight = touchX > this.config.screenWidth * 0.65 && touchY > this.config.screenHeight * 0.70;

    if (isBottomRight) {
      this.config.isUserTouchingBottomRight = true;
      this.recalculateOffsets();

      if (this.touchResetTimeout) clearTimeout(this.touchResetTimeout);
      this.touchResetTimeout = setTimeout(() => {
        this.config.isUserTouchingBottomRight = false;
        this.recalculateOffsets();
      }, 3500);
    }
  }

  private recalculateOffsets(): void {
    let offsetX = 0;
    let offsetY = 0;
    const reasons: string[] = [];

    // 1. Virtual Keyboard avoidance (Lift up)
    if (this.config.isKeyboardVisible) {
      offsetY += 120;
      offsetX += 10;
      reasons.push('Menghindari Keyboard Virtual');
    }

    // 2. FAB Collision avoidance (Shift slightly left / up)
    if (this.config.isFABActive) {
      offsetY += 56;
      reasons.push('Memberi Ruang Tombol FAB');
    }

    // 3. User Touching Bottom Right thumb zone (Hop out of thumb path)
    if (this.config.isUserTouchingBottomRight) {
      offsetX += 24;
      offsetY += 32;
      reasons.push('Menghindari Sentuhan Jempol');
    }

    // 4. Narrow Screen Adaptations (360px micro screens)
    if (this.config.screenWidth <= 375 && !this.config.isKeyboardVisible && !this.config.isFABActive) {
      // Keep closer to bezel
      offsetX = Math.max(0, offsetX - 4);
    }

    this.config.thumbDodgeOffsetX = offsetX;
    this.config.thumbDodgeOffsetY = offsetY;
    this.config.reason = reasons.length > 0 ? reasons.join(' • ') : 'Posisi Nyaman Standar';

    this.notify();
  }

  private initEventListeners(): void {
    // Window resize
    window.addEventListener('resize', () => {
      this.config.screenWidth = window.innerWidth;
      this.config.screenHeight = window.innerHeight;
      this.recalculateOffsets();
    }, { passive: true });

    // Focus on inputs to anticipate virtual keyboard on mobile
    window.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        this.setKeyboardPresence(true);
      }
    });

    window.addEventListener('focusout', (e) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        this.setKeyboardPresence(false);
      }
    });

    // Touch listener for thumb zone detection
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleThumbZoneTouch(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  private notify(): void {
    const c = this.getConfig();
    this.listeners.forEach(fn => {
      try {
        fn(c);
      } catch (err) {
        console.error('[ThumbAwarenessEngine] Notification error:', err);
      }
    });
  }
}
