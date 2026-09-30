/**
 * R782 — Asy Dock Assistant
 * TADE RC96A — ASY LIVING 3D MASCOT FOUNDATION
 * 
 * Manages floating dock assistant state, viewport positioning (bottom-right 80px default),
 * minimize/expand modes, and zero-interference boundary checks.
 */

export type DockPositionCorner = 'BOTTOM_RIGHT' | 'BOTTOM_LEFT' | 'TOP_RIGHT' | 'CUSTOM';
export type DockDisplayMode = 'COMPACT_DOCK' | 'EXPANDED_COMPANION' | 'MINIMIZED_BADGE' | 'HIDDEN';

export interface DockStateConfig {
  corner: DockPositionCorner;
  displayMode: DockDisplayMode;
  baseSizePx: number; // 60 - 120px, default 80px
  offsetX: number;
  offsetY: number;
  isFloatingUnlocked: boolean;
  isVisible: boolean;
  dockOpacity: number; // 0.5 - 1.0
  autoHideOnInputFocus: boolean;
}

export class AsyDockAssistant {
  private static instance: AsyDockAssistant;
  private config: DockStateConfig;
  private listeners: Set<(cfg: DockStateConfig) => void> = new Set();

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): AsyDockAssistant {
    if (!AsyDockAssistant.instance) {
      AsyDockAssistant.instance = new AsyDockAssistant();
    }
    return AsyDockAssistant.instance;
  }

  private loadConfig(): DockStateConfig {
    if (typeof localStorage === 'undefined') {
      return this.getDefaults();
    }
    try {
      const stored = localStorage.getItem('tade_asy_dock_config');
      if (stored) {
        return { ...this.getDefaults(), ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return this.getDefaults();
  }

  private getDefaults(): DockStateConfig {
    return {
      corner: 'BOTTOM_RIGHT',
      displayMode: 'COMPACT_DOCK',
      baseSizePx: 80,
      offsetX: 24,
      offsetY: 24,
      isFloatingUnlocked: false,
      isVisible: true,
      dockOpacity: 1.0,
      autoHideOnInputFocus: true
    };
  }

  private persist() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('tade_asy_dock_config', JSON.stringify(this.config));
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public subscribe(listener: (cfg: DockStateConfig) => void): () => void {
    this.listeners.add(listener);
    listener(this.config);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.config }));
  }

  public getConfig(): DockStateConfig {
    return { ...this.config };
  }

  public setDisplayMode(mode: DockDisplayMode) {
    this.config.displayMode = mode;
    this.persist();
  }

  public toggleVisibility(): boolean {
    this.config.isVisible = !this.config.isVisible;
    this.persist();
    return this.config.isVisible;
  }

  public setCorner(corner: DockPositionCorner) {
    this.config.corner = corner;
    this.persist();
  }

  public setBaseSize(size: number) {
    this.config.baseSizePx = Math.max(60, Math.min(140, size));
    this.persist();
  }

  public updateOffsets(x: number, y: number) {
    this.config.offsetX = x;
    this.config.offsetY = y;
    this.config.isFloatingUnlocked = true;
    this.persist();
  }

  public resetToDefaultCorner() {
    this.config.corner = 'BOTTOM_RIGHT';
    this.config.offsetX = 24;
    this.config.offsetY = 24;
    this.config.isFloatingUnlocked = false;
    this.persist();
  }
}
