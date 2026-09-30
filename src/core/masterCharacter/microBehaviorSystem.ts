/**
 * TADE v9.4.0-MCA4 — R944
 * MICRO BEHAVIOR SYSTEM
 * 
 * Generates probabilistic organic micro-actions for Asy & Syifa:
 * - Randomized natural eye blinking with 18% double-blink chance
 * - Eye saccades (random gaze wandering every 1.5 - 3.5s)
 * - Micro head tilt oscillations (-2.5° to +2.5°) with organic damping
 * - Subtle harmonic chest breathing & body sway
 * - Action anticipation (120-250ms) and follow-through settle (150-300ms)
 * - Natural pause intervals between major state switches
 */

export interface MicroBehaviorSnapshot {
  isBlinking: boolean;
  blinkProgress: number; // 0.0 (open) to 1.0 (closed)
  doubleBlinkPending: boolean;
  eyeGaze: { x: number; y: number }; // -1.0 to 1.0
  headTiltDeg: number; // -2.5° to +2.5°
  breathingScaleY: number; // 0.985 to 1.015
  bodySwayX: number; // -1.2px to +1.2px
  isSettling: boolean;
  anticipationOffset: number; // 0.0 to 1.0
  microJitter: number; // organic noise
  lastBlinkTime: number;
  lastSaccadeTime: number;
}

export type MicroBehaviorListener = (snapshot: MicroBehaviorSnapshot) => void;

export class MicroBehaviorSystem {
  private isRunning: boolean = false;
  private timeAccumulator: number = 0;

  // Blinking state
  private isBlinking: boolean = false;
  private blinkProgress: number = 0;
  private blinkTimer: number = 0;
  private blinkDuration: number = 0.16; // 160ms
  private nextBlinkInterval: number = 2.8;
  private doubleBlinkPending: boolean = false;
  private lastBlinkTimestamp: number = Date.now();

  // Eye Gaze / Saccade
  private currentGaze: { x: number; y: number } = { x: 0, y: 0 };
  private targetGaze: { x: number; y: number } = { x: 0, y: 0 };
  private nextSaccadeInterval: number = 2.2;
  private saccadeTimer: number = 0;
  private lastSaccadeTimestamp: number = Date.now();

  // Head tilt & breathing
  private headTiltAngle: number = 0;
  private breathingAngle: number = 0;
  private bodySwayAngle: number = 0;

  // Action settle & anticipation
  private isSettling: boolean = false;
  private settleTimer: number = 0;
  private anticipationOffset: number = 0;

  private listeners: Set<MicroBehaviorListener> = new Set();

  constructor() {
    this.scheduleNextBlink();
    this.scheduleNextSaccade();
  }

  public start(): void {
    this.isRunning = true;
  }

  public stop(): void {
    this.isRunning = false;
  }

  public subscribe(listener: MicroBehaviorListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private scheduleNextBlink(): void {
    // Normal interval between 2.2s and 4.8s
    this.nextBlinkInterval = 2.2 + Math.random() * 2.6;
    this.blinkTimer = 0;
  }

  private scheduleNextSaccade(): void {
    // Random saccadic shift interval between 1.8s and 3.6s
    this.nextSaccadeInterval = 1.8 + Math.random() * 1.8;
    this.saccadeTimer = 0;
    
    // Slight target gaze wander (-0.35 to +0.35 on X, -0.2 to +0.2 on Y)
    this.targetGaze = {
      x: (Math.random() - 0.5) * 0.7,
      y: (Math.random() - 0.5) * 0.4
    };
  }

  /**
   * Trigger organic anticipation before major state transition
   */
  public triggerAnticipation(): void {
    this.anticipationOffset = 1.0;
    this.isSettling = true;
    this.settleTimer = 0.25; // 250ms
  }

  /**
   * Per-frame physics/probability tick
   * @param deltaSeconds delta time in seconds
   */
  public update(deltaSeconds: number): MicroBehaviorSnapshot {
    if (!this.isRunning) {
      return this.getSnapshot();
    }

    const dt = Math.min(deltaSeconds, 0.1); // clamp for stability
    this.timeAccumulator += dt;

    // 1. Blink Cycle Update
    this.blinkTimer += dt;
    if (!this.isBlinking && this.blinkTimer >= this.nextBlinkInterval) {
      this.isBlinking = true;
      this.blinkProgress = 0;
      this.blinkTimer = 0;
      this.lastBlinkTimestamp = Date.now();
      
      // 18% chance of double-blink for lively toddler feel
      if (!this.doubleBlinkPending && Math.random() < 0.18) {
        this.doubleBlinkPending = true;
      }
    }

    if (this.isBlinking) {
      this.blinkTimer += dt;
      const progress = this.blinkTimer / this.blinkDuration;
      
      if (progress < 0.5) {
        this.blinkProgress = progress * 2; // closing
      } else if (progress < 1.0) {
        this.blinkProgress = (1.0 - progress) * 2; // opening
      } else {
        this.isBlinking = false;
        this.blinkProgress = 0;
        
        if (this.doubleBlinkPending) {
          this.doubleBlinkPending = false;
          this.nextBlinkInterval = 0.12; // quick secondary blink in 120ms
          this.blinkTimer = 0;
        } else {
          this.scheduleNextBlink();
        }
      }
    }

    // 2. Eye Gaze / Saccade Interpolation
    this.saccadeTimer += dt;
    if (this.saccadeTimer >= this.nextSaccadeInterval) {
      this.scheduleNextSaccade();
      this.lastSaccadeTimestamp = Date.now();
    }
    
    // Smooth damp towards target gaze
    this.currentGaze.x += (this.targetGaze.x - this.currentGaze.x) * (dt * 8.0);
    this.currentGaze.y += (this.targetGaze.y - this.currentGaze.y) * (dt * 8.0);

    // 3. Head Tilt Organic Harmonic Oscillation
    this.headTiltAngle += dt * 0.9;
    const baseTilt = Math.sin(this.headTiltAngle) * 2.2;
    const microTiltNoise = Math.sin(this.headTiltAngle * 2.7) * 0.3;
    const headTiltDeg = Math.max(-2.5, Math.min(2.5, baseTilt + microTiltNoise));

    // 4. Breathing Harmonic Cycle
    this.breathingAngle += dt * (Math.PI * 2 / 3.2); // 3.2s cycle
    const breathPhase = (Math.sin(this.breathingAngle) + 1) / 2;
    const breathingScaleY = 1.0 + (breathPhase - 0.5) * 0.024; // 0.988 - 1.012

    // 5. Body Sway & Weight Shift
    this.bodySwayAngle += dt * (Math.PI * 2 / 5.0); // 5s gentle shift
    const bodySwayX = Math.sin(this.bodySwayAngle) * 1.1; // ±1.1px

    // 6. Settle & Anticipation Decay
    if (this.isSettling) {
      this.settleTimer -= dt;
      this.anticipationOffset = Math.max(0, this.anticipationOffset - dt * 4.0);
      if (this.settleTimer <= 0) {
        this.isSettling = false;
      }
    }

    const snapshot = this.getSnapshot(headTiltDeg, breathingScaleY, bodySwayX);
    this.notifyListeners(snapshot);
    return snapshot;
  }

  public getSnapshot(
    headTiltDeg: number = 0,
    breathingScaleY: number = 1.0,
    bodySwayX: number = 0
  ): MicroBehaviorSnapshot {
    return {
      isBlinking: this.isBlinking,
      blinkProgress: this.blinkProgress,
      doubleBlinkPending: this.doubleBlinkPending,
      eyeGaze: { ...this.currentGaze },
      headTiltDeg,
      breathingScaleY,
      bodySwayX,
      isSettling: this.isSettling,
      anticipationOffset: this.anticipationOffset,
      microJitter: Math.sin(this.timeAccumulator * 12) * 0.1,
      lastBlinkTime: this.lastBlinkTimestamp,
      lastSaccadeTime: this.lastSaccadeTimestamp
    };
  }

  private notifyListeners(snapshot: MicroBehaviorSnapshot): void {
    this.listeners.forEach(listener => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('MicroBehaviorListener error:', err);
      }
    });
  }
}

export const defaultMicroBehaviorSystem = new MicroBehaviorSystem();
