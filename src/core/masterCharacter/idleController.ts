/**
 * TADE v9.2.0-MCA2 — R924
 * MASTER CHARACTER IDLE CONTROLLER
 * 
 * Generates natural, organic living dynamics for Asy & Syifa:
 * - Sinusoidal breathing cycles (2.8s - 3.4s)
 * - Randomized natural eye blinking with double-blink probability
 * - Saccadic eye glances & gaze wandering
 * - Gentle harmonic head tilt micro-oscillations (-3° to +3°)
 * - Organic weight shifting & body bobbing
 * 
 * Optimized for low idle CPU overhead and zero memory leaks.
 */

export interface IdleStateSnapshot {
  breathingPhase: number; // 0.0 to 1.0 (sine curve)
  chestScaleY: number; // 0.985 to 1.015
  bodyBobY: number; // -1.5px to +1.5px
  bodySwayX: number; // -1.0px to +1.0px
  isBlinking: boolean;
  blinkProgress: number; // 0.0 (open) to 1.0 (closed)
  gaze: { x: number; y: number }; // -1.0 to 1.0
  headTiltDeg: number; // -3.0° to +3.0°
  peciMicroAdjust: number; // 0.0 to 1.0
  hijabMicroSway: number; // -2.0° to +2.0°
  isActive: boolean;
  updatedAt: number;
}

export type IdleListener = (snapshot: IdleStateSnapshot) => void;

export class IdleController {
  private isRunning: boolean = false;
  private isPaused: boolean = false;

  // Breathing parameters
  private breathingTime: number = 0;
  private breathingCycleDuration: number = 3.2; // seconds

  // Blinking parameters
  private nextBlinkTimer: number = 2.5;
  private isBlinking: boolean = false;
  private blinkProgress: number = 0;
  private blinkTimer: number = 0;
  private blinkDuration: number = 0.16; // 160ms

  // Eye Gaze parameters
  private currentGaze: { x: number; y: number } = { x: 0, y: 0 };
  private targetGaze: { x: number; y: number } = { x: 0, y: 0 };
  private gazeShiftTimer: number = 2.0;

  // Head tilt harmonic oscillation
  private headTiltTime: number = 0;
  private currentHeadTilt: number = 0;

  // Body weight shift
  private weightShiftTime: number = 0;

  // Callbacks
  private listeners: Set<IdleListener> = new Set();

  constructor() {
    this.scheduleNextBlink();
    this.scheduleNextGaze();
  }

  public start(): void {
    this.isRunning = true;
    this.isPaused = false;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public stop(): void {
    this.isRunning = false;
  }

  /**
   * Main per-frame physics tick driven by CharacterRuntime loop
   */
  public update(deltaSeconds: number): void {
    if (!this.isRunning || this.isPaused) return;

    // 1. Breathing Cycle Update
    this.breathingTime += deltaSeconds;
    const breathAngle = (this.breathingTime / this.breathingCycleDuration) * Math.PI * 2;
    const breathingPhase = (Math.sin(breathAngle) + 1) / 2; // 0.0 to 1.0
    const chestScaleY = 1.0 + (breathingPhase - 0.5) * 0.025; // 0.9875 to 1.0125
    const bodyBobY = (breathingPhase - 0.5) * 2.0; // -1.0px to +1.0px

    // 2. Weight Shift & Lateral Sway
    this.weightShiftTime += deltaSeconds * 0.5;
    const bodySwayX = Math.sin(this.weightShiftTime * 1.5) * 0.8;

    // 3. Head Tilt Micro-Oscillations
    this.headTiltTime += deltaSeconds * 0.8;
    this.currentHeadTilt = Math.sin(this.headTiltTime) * 2.2; // -2.2° to +2.2°

    // 4. Natural Blinking Loop
    this.nextBlinkTimer -= deltaSeconds;
    if (this.nextBlinkTimer <= 0 && !this.isBlinking) {
      this.triggerBlink();
    }

    if (this.isBlinking) {
      this.blinkTimer += deltaSeconds;
      const progress = this.blinkTimer / this.blinkDuration;
      if (progress >= 1.0) {
        this.isBlinking = false;
        this.blinkProgress = 0;
        this.scheduleNextBlink();
      } else {
        // Bell-curve for blink closure: 0 -> 1 -> 0
        this.blinkProgress = Math.sin(progress * Math.PI);
      }
    }

    // 5. Saccadic Gaze Wandering
    this.gazeShiftTimer -= deltaSeconds;
    if (this.gazeShiftTimer <= 0) {
      this.scheduleNextGaze();
    }

    // Smooth lerp gaze towards target gaze
    const gazeLerpSpeed = 8.0 * deltaSeconds;
    this.currentGaze.x += (this.targetGaze.x - this.currentGaze.x) * Math.min(1.0, gazeLerpSpeed);
    this.currentGaze.y += (this.targetGaze.y - this.currentGaze.y) * Math.min(1.0, gazeLerpSpeed);

    // 6. Micro accessory physics (Peci adjust & Hijab sway)
    const peciMicroAdjust = Math.abs(Math.sin(this.weightShiftTime * 0.3)) * 0.5;
    const hijabMicroSway = Math.sin(this.breathingTime * 1.8) * 1.5;

    // Dispatch snapshot
    const snapshot: IdleStateSnapshot = {
      breathingPhase,
      chestScaleY,
      bodyBobY,
      bodySwayX,
      isBlinking: this.isBlinking,
      blinkProgress: this.blinkProgress,
      gaze: { ...this.currentGaze },
      headTiltDeg: this.currentHeadTilt,
      peciMicroAdjust,
      hijabMicroSway,
      isActive: true,
      updatedAt: Date.now()
    };

    this.notifyListeners(snapshot);
  }

  public triggerBlink(): void {
    this.isBlinking = true;
    this.blinkTimer = 0;
    this.blinkDuration = 0.14 + Math.random() * 0.05; // 140ms - 190ms
  }

  public setLookAt(targetX: number, targetY: number): void {
    this.targetGaze = {
      x: Math.max(-1, Math.min(1, targetX)),
      y: Math.max(-1, Math.min(1, targetY))
    };
    this.gazeShiftTimer = 3.5; // lock look at target for a while
  }

  private scheduleNextBlink(): void {
    // Human average blink frequency: 2.8 to 5.5 seconds
    this.nextBlinkTimer = 2.8 + Math.random() * 2.7;
    // 15% chance of rapid double-blink
    if (Math.random() < 0.15) {
      this.nextBlinkTimer = 0.35;
    }
  }

  private scheduleNextGaze(): void {
    // Pick random natural gaze target near center
    this.targetGaze = {
      x: (Math.random() - 0.5) * 1.1, // -0.55 to +0.55
      y: (Math.random() - 0.5) * 0.6  // -0.3 to +0.3
    };
    this.gazeShiftTimer = 1.8 + Math.random() * 2.4; // 1.8s - 4.2s dwell time
  }

  public getSnapshot(): IdleStateSnapshot {
    return {
      breathingPhase: 0.5,
      chestScaleY: 1.0,
      bodyBobY: 0,
      bodySwayX: 0,
      isBlinking: this.isBlinking,
      blinkProgress: this.blinkProgress,
      gaze: { ...this.currentGaze },
      headTiltDeg: this.currentHeadTilt,
      peciMicroAdjust: 0,
      hijabMicroSway: 0,
      isActive: this.isRunning,
      updatedAt: Date.now()
    };
  }

  public subscribe(listener: IdleListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(snapshot: IdleStateSnapshot): void {
    this.listeners.forEach(listener => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('[IdleController] Listener error:', err);
      }
    });
  }

  public destroy(): void {
    this.stop();
    this.listeners.clear();
  }
}

export const defaultIdleController = new IdleController();
