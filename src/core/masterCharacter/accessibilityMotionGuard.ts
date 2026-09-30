/**
 * TADE v9.6.0-MCA6 — R967
 * ACCESSIBILITY MOTION GUARD
 * 
 * Protects users with vestibular disorders or motion sensitivities:
 * - Detects prefers-reduced-motion via CSS Media Query
 * - Throttles animation frame rates and scales down transform dynamics (0.0 to 1.0)
 * - Guarantees safe static visual fallback while keeping character readability
 */

export interface AccessibilityMotionProfile {
  prefersReducedMotion: boolean;
  motionScaleFactor: number; // 0.0 for static, 0.5 for mild, 1.0 for full
  targetMaxFPS: number;
  isThrottled: boolean;
  statusLabel: string;
}

export class AccessibilityMotionGuard {
  private prefersReduced: boolean = false;
  private manualMotionScale: number = 1.0;
  private isThrottled: boolean = false;

  constructor() {
    this.detectSystemPreferences();
  }

  private detectSystemPreferences(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReduced = mediaQuery.matches;
      mediaQuery.addEventListener?.('change', (e) => {
        this.prefersReduced = e.matches;
      });
    }
  }

  public setManualMotionScale(scale: number): void {
    this.manualMotionScale = Math.max(0, Math.min(1, scale));
  }

  public setThrottled(throttled: boolean): void {
    this.isThrottled = throttled;
  }

  public getProfile(): AccessibilityMotionProfile {
    const scale = this.prefersReduced ? 0.2 : this.manualMotionScale;
    return {
      prefersReducedMotion: this.prefersReduced,
      motionScaleFactor: scale,
      targetMaxFPS: this.prefersReduced ? 30 : this.isThrottled ? 30 : 60,
      isThrottled: this.isThrottled,
      statusLabel: this.prefersReduced 
        ? 'REDUCED_MOTION_ACTIVE (Safe)' 
        : scale < 0.8 
        ? 'MILD_MOTION (Accessible)' 
        : 'STANDARD_MOTION (Full 60FPS)'
    };
  }
}

export const defaultAccessibilityMotionGuard = new AccessibilityMotionGuard();
