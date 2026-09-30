/**
 * TADE RC98 — R806: Gesture Polish Engine
 * Menghaluskan detail mikro gerak Asy:
 * 1. Shoulder sway (ayunan bahu halus)
 * 2. Subtle breathing micro-variation (variasi ritme nafas alami)
 * 3. Head follow (pelacakan santun kursor/sentuhan pengguna)
 * 4. Tiny blink variations (variasi kedipan mikro ganda/tunggal)
 */

export interface PolishedGestureState {
  shoulderSwayAngle: number; // -3 deg to +3 deg
  breathingCurve: number; // 0.985 to 1.025
  headFollowAngle: { x: number; y: number };
  isDoubleBlinking: boolean;
  microPoseHint: string;
}

export class GesturePolishEngine {
  private static instance: GesturePolishEngine;
  private state: PolishedGestureState;
  private listeners: Set<(state: PolishedGestureState) => void> = new Set();
  private targetCursor: { x: number; y: number } = { x: 0, y: 0 };
  private rafId: number | null = null;
  private lastUpdate: number = 0;
  private isSuspended: boolean = false;

  private constructor() {
    this.state = {
      shoulderSwayAngle: 0,
      breathingCurve: 1.0,
      headFollowAngle: { x: 0, y: 0 },
      isDoubleBlinking: false,
      microPoseHint: 'Nafas Santai & Beradab'
    };

    if (typeof window !== 'undefined') {
      this.initPointerTracking();
      this.startLoop();
    }
  }

  public static getInstance(): GesturePolishEngine {
    if (!GesturePolishEngine.instance) {
      GesturePolishEngine.instance = new GesturePolishEngine();
    }
    return GesturePolishEngine.instance;
  }

  public getState(): PolishedGestureState {
    return { ...this.state };
  }

  public subscribe(listener: (state: PolishedGestureState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  public setSuspended(suspended: boolean): void {
    this.isSuspended = suspended;
  }

  private startLoop(): void {
    const loop = (timestamp: number) => {
      if (!this.isSuspended && timestamp - this.lastUpdate > 33) { // ~30 FPS mobile-friendly throttle
        this.lastUpdate = timestamp;
        this.updateMotion(timestamp);
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private updateMotion(timestamp: number): void {
    const sec = timestamp / 1000;

    // 1. Shoulder sway (smooth sine wave)
    const sway = Math.sin(sec * 1.5) * 1.8;

    // 2. Breathing micro-curve
    const breath = 1.0 + Math.sin(sec * 2.2) * 0.02;

    // 3. Head follow with soft spring damping
    const targetX = (this.targetCursor.x / (typeof window !== 'undefined' ? window.innerWidth : 400) - 0.5) * 8;
    const targetY = (this.targetCursor.y / (typeof window !== 'undefined' ? window.innerHeight : 800) - 0.5) * 6;

    const currentX = this.state.headFollowAngle.x + (targetX - this.state.headFollowAngle.x) * 0.08;
    const currentY = this.state.headFollowAngle.y + (targetY - this.state.headFollowAngle.y) * 0.08;

    // 4. Double blink chance every ~8 seconds
    const isDoubleBlink = Math.sin(sec * 0.4) > 0.985;

    this.state = {
      shoulderSwayAngle: Number(sway.toFixed(2)),
      breathingCurve: Number(breath.toFixed(3)),
      headFollowAngle: {
        x: Number(currentX.toFixed(2)),
        y: Number(currentY.toFixed(2))
      },
      isDoubleBlinking: isDoubleBlink,
      microPoseHint: isDoubleBlink ? 'Kedipan Ganda Ceria' : 'Ayunan Bahu Santun'
    };

    this.notify();
  }

  private initPointerTracking(): void {
    window.addEventListener('mousemove', (e) => {
      this.targetCursor = { x: e.clientX, y: e.clientY };
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.targetCursor = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });
  }

  private notify(): void {
    const s = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(s);
      } catch (err) {
        console.error('[GesturePolishEngine] Notification error:', err);
      }
    });
  }
}
