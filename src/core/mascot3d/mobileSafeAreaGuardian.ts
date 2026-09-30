/**
 * TADE RC98 — R807: Mobile Safe Area Guardian
 * Menghormati env(safe-area-inset-bottom) & env(safe-area-inset-right)
 * Mencegah tabrakan dengan gesture bar Android, iOS Home Bar, dan Dynamic Island
 */

import type { CSSProperties } from 'react';

export interface MobileSafeAreaMetrics {
  insetBottomPx: number;
  insetRightPx: number;
  insetTopPx: number;
  isIOS: boolean;
  isAndroid: boolean;
  hasHardwareNotch: boolean;
  recommendedDockMarginBottom: number;
  recommendedDockMarginRight: number;
}

export class MobileSafeAreaGuardian {
  private static instance: MobileSafeAreaGuardian;
  private metrics: MobileSafeAreaMetrics;
  private listeners: Set<(metrics: MobileSafeAreaMetrics) => void> = new Set();

  private constructor() {
    this.metrics = this.detectSafeAreas();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.metrics = this.detectSafeAreas();
        this.notify();
      }, { passive: true });
    }
  }

  public static getInstance(): MobileSafeAreaGuardian {
    if (!MobileSafeAreaGuardian.instance) {
      MobileSafeAreaGuardian.instance = new MobileSafeAreaGuardian();
    }
    return MobileSafeAreaGuardian.instance;
  }

  public getMetrics(): MobileSafeAreaMetrics {
    return { ...this.metrics };
  }

  public subscribe(listener: (metrics: MobileSafeAreaMetrics) => void): () => void {
    this.listeners.add(listener);
    listener(this.getMetrics());
    return () => this.listeners.delete(listener);
  }

  /**
   * Menghasilkan CSS safe styling untuk posisi dock Asy
   */
  public getDockSafeAreaStyle(): CSSProperties {
    return {
      bottom: `max(${this.metrics.recommendedDockMarginBottom}px, calc(env(safe-area-inset-bottom, 16px) + 8px))`,
      right: `max(${this.metrics.recommendedDockMarginRight}px, calc(env(safe-area-inset-right, 16px) + 8px))`
    };
  }

  private detectSafeAreas(): MobileSafeAreaMetrics {
    if (typeof window === 'undefined') {
      return {
        insetBottomPx: 16,
        insetRightPx: 16,
        insetTopPx: 0,
        isIOS: false,
        isAndroid: false,
        hasHardwareNotch: false,
        recommendedDockMarginBottom: 16,
        recommendedDockMarginRight: 16
      };
    }

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isMobile = window.innerWidth <= 480;

    // Default safe bottom margin based on mobile device profile
    let bottomMargin = 16;
    let rightMargin = 16;

    if (isIOS) {
      bottomMargin = 24; // iPhone gesture home bar
    } else if (isAndroid) {
      bottomMargin = 20; // Android gesture / 3-button bar
    }

    if (isMobile && window.innerWidth <= 375) {
      rightMargin = 10;
    }

    return {
      insetBottomPx: isIOS ? 34 : (isAndroid ? 24 : 0),
      insetRightPx: 16,
      insetTopPx: isIOS ? 47 : (isAndroid ? 24 : 0),
      isIOS,
      isAndroid,
      hasHardwareNotch: isIOS || (isAndroid && window.innerHeight > 800),
      recommendedDockMarginBottom: bottomMargin,
      recommendedDockMarginRight: rightMargin
    };
  }

  private notify(): void {
    const m = this.getMetrics();
    this.listeners.forEach(fn => {
      try {
        fn(m);
      } catch (err) {
        console.error('[MobileSafeAreaGuardian] Notification error:', err);
      }
    });
  }
}
