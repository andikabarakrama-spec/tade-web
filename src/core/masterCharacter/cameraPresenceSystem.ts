/**
 * TADE v9.5.0-MCA5 — R952
 * CAMERA PRESENCE SYSTEM
 * 
 * Implements camera-aware perception for Asy & Syifa:
 * - Probabilistic fourth-wall glances (12-18% chance of gentle direct eye contact)
 * - Space-yielding on page scroll (evades blocking forms / inputs / buttons)
 * - Natural return to internal school focus (reading Iqro, watching butterflies)
 * - Safe, non-invasive UX that respects user concentration
 */

export interface CameraPresenceState {
  isGlancingAtCamera: boolean;
  cameraGazeWeight: number; // 0.0 (internal activity) to 1.0 (direct user glance)
  isYieldingSpace: boolean;
  scrollEvasionOffsetY: number; // in pixels
  userProximityScore: number; // 0.0 to 1.0
  lastGlanceTimestamp: number;
}

export type CameraPresenceListener = (state: CameraPresenceState) => void;

export class CameraPresenceSystem {
  private isGlancing: boolean = false;
  private glanceTimer: number = 0;
  private glanceDuration: number = 2.0; // 2 seconds glance
  private nextGlanceInterval: number = 6.0;
  private timerAccumulator: number = 0;

  private isYielding: boolean = false;
  private scrollOffsetY: number = 0;
  private userProximity: number = 0.5;
  private lastGlanceTime: number = Date.now();

  private listeners: Set<CameraPresenceListener> = new Set();

  constructor() {
    this.scheduleNextGlance();
    this.setupScrollListener();
  }

  private scheduleNextGlance(): void {
    this.nextGlanceInterval = 5.0 + Math.random() * 7.0; // between 5s and 12s
    this.glanceTimer = 0;
  }

  private setupScrollListener(): void {
    if (typeof window !== 'undefined') {
      let scrollTimeout: NodeJS.Timeout;
      window.addEventListener('scroll', () => {
        this.isYielding = true;
        this.scrollOffsetY = -8; // slight duck/shrink by 8px
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.isYielding = false;
          this.scrollOffsetY = 0;
          this.notify();
        }, 800);
        this.notify();
      }, { passive: true });
    }
  }

  public update(deltaSeconds: number): CameraPresenceState {
    this.timerAccumulator += deltaSeconds;

    if (!this.isGlancing) {
      this.glanceTimer += deltaSeconds;
      if (this.glanceTimer >= this.nextGlanceInterval) {
        // 16% probability check
        if (Math.random() < 0.35) {
          this.isGlancing = true;
          this.glanceTimer = 0;
          this.lastGlanceTime = Date.now();
        } else {
          this.scheduleNextGlance();
        }
      }
    } else {
      this.glanceTimer += deltaSeconds;
      if (this.glanceTimer >= this.glanceDuration) {
        this.isGlancing = false;
        this.scheduleNextGlance();
      }
    }

    const state = this.getState();
    this.notify();
    return state;
  }

  public triggerDirectGlance(durationSec: number = 3.0): void {
    this.isGlancing = true;
    this.glanceDuration = durationSec;
    this.glanceTimer = 0;
    this.lastGlanceTime = Date.now();
    this.notify();
  }

  public getState(): CameraPresenceState {
    const glanceWeight = this.isGlancing 
      ? Math.sin((this.glanceTimer / this.glanceDuration) * Math.PI)
      : 0.0;

    return {
      isGlancingAtCamera: this.isGlancing,
      cameraGazeWeight: Math.max(0, Math.min(1, glanceWeight)),
      isYieldingSpace: this.isYielding,
      scrollEvasionOffsetY: this.scrollOffsetY,
      userProximityScore: this.userProximity,
      lastGlanceTimestamp: this.lastGlanceTime
    };
  }

  public subscribe(listener: CameraPresenceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const s = this.getState();
    this.listeners.forEach(l => {
      try { l(s); } catch (e) { console.error('CameraPresenceListener error:', e); }
    });
  }
}

export const defaultCameraPresenceSystem = new CameraPresenceSystem();
