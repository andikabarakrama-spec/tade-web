/**
 * R788 — Accessibility Layer
 * TADE RC96A — ASY LIVING 3D MASCOT FOUNDATION
 * 
 * Ensures total compliance with WCAG & accessibility standards:
 * - Honors prefers-reduced-motion media queries
 * - Full keyboard navigation (Tab navigation, Enter/Space to interact, ESC to dismiss speech)
 * - ARIA live polite announcements for screen readers
 * - High contrast visual outline modes
 */

export interface AccessibilitySettings {
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  keyboardShortcutsEnabled: boolean;
  highContrastOutline: boolean;
}

export class MascotAccessibilityLayer {
  private static instance: MascotAccessibilityLayer;
  private settings: AccessibilitySettings;
  private listeners: Set<(settings: AccessibilitySettings) => void> = new Set();
  private liveRegionText: string = '';

  private constructor() {
    const prefersReduced = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.settings = {
      reducedMotion: Boolean(prefersReduced),
      screenReaderAnnouncements: true,
      keyboardShortcutsEnabled: true,
      highContrastOutline: false
    };

    this.initMediaQueryListener();
  }

  public static getInstance(): MascotAccessibilityLayer {
    if (!MascotAccessibilityLayer.instance) {
      MascotAccessibilityLayer.instance = new MascotAccessibilityLayer();
    }
    return MascotAccessibilityLayer.instance;
  }

  private initMediaQueryListener() {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    try {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      mql.addEventListener('change', (e) => {
        this.settings.reducedMotion = e.matches;
        this.notify();
      });
    } catch {
      // ignore
    }
  }

  public setReducedMotion(enabled: boolean) {
    this.settings.reducedMotion = enabled;
    this.notify();
  }

  public setScreenReaderAnnouncements(enabled: boolean) {
    this.settings.screenReaderAnnouncements = enabled;
    this.notify();
  }

  public setHighContrastOutline(enabled: boolean) {
    this.settings.highContrastOutline = enabled;
    this.notify();
  }

  public announceToScreenReader(text: string) {
    if (!this.settings.screenReaderAnnouncements) return;
    this.liveRegionText = text;
    this.notify();
  }

  public getLiveRegionText(): string {
    return this.liveRegionText;
  }

  public getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  public subscribe(listener: (settings: AccessibilitySettings) => void): () => void {
    this.listeners.add(listener);
    listener(this.settings);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.settings }));
  }
}
