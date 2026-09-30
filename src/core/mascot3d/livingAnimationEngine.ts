/**
 * R783 — Living Animation Engine (LOCAL PROCEDURAL IDLE LOOP)
 * TADE RC96A — ASY LIVING 3D MASCOT FOUNDATION
 * 
 * ARCHITECTURAL SCOPE:
 * - Computes micro-transform oscillations (breathing, blink, foot swing, head tilt)
 *   for local preview widgets.
 * - Global character behavior and macro state transitions are arbitrated by `CharacterBehaviorOrchestrator`.
 * 
 * Manages organic idle cycles: breathing, blinking, looking around, foot-swinging, peeking, and happy waving.
 * Features randomized scheduling to feel alive without repeating robotic loops.
 */

export type MascotAnimationPose = 
  | 'IDLE_BREATHING' 
  | 'BLINK' 
  | 'LOOK_AROUND' 
  | 'FOOT_SWING' 
  | 'PEEK' 
  | 'WAVE' 
  | 'SMALL_JUMP' 
  | 'CELEBRATE' 
  | 'READING_DOA' 
  | 'RESTING_NAP';

export interface LivingAnimationState {
  currentPose: MascotAnimationPose;
  poseProgress: number; // 0.0 to 1.0
  lookDirection: { x: number; y: number }; // -1 to 1
  isBlinking: boolean;
  eyeOpening: number; // 0.0 (closed) to 1.0 (fully open)
  breathingScale: number; // 0.98 to 1.03
  footSwingAngle: number; // -15 deg to +15 deg
  headTiltAngle: number; // -10 deg to +10 deg
  isHappy: boolean;
  lastPoseChangedAt: number;
}

export class LivingAnimationEngine {
  private static instance: LivingAnimationEngine;
  private state: LivingAnimationState;
  private speedMultiplier: number = 1.0;
  private isSuspended: boolean = false;
  private listeners: Set<(state: LivingAnimationState) => void> = new Set();
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private nextIdleActionAt: number = Date.now() + 4000;
  private nextBlinkAt: number = Date.now() + 2500;

  private constructor() {
    this.state = {
      currentPose: 'IDLE_BREATHING',
      poseProgress: 0,
      lookDirection: { x: 0, y: 0 },
      isBlinking: false,
      eyeOpening: 1.0,
      breathingScale: 1.0,
      footSwingAngle: 0,
      headTiltAngle: 0,
      isHappy: true,
      lastPoseChangedAt: Date.now()
    };

    this.startLoop();
  }

  public static getInstance(): LivingAnimationEngine {
    if (!LivingAnimationEngine.instance) {
      LivingAnimationEngine.instance = new LivingAnimationEngine();
    }
    return LivingAnimationEngine.instance;
  }

  private startLoop() {
    if (typeof window === 'undefined') return;

    const tick = (now: number) => {
      if (!this.lastTimestamp) this.lastTimestamp = now;
      const delta = (now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;

      if (!this.isSuspended) {
        this.updateState(delta, Date.now());
        this.notify();
      }

      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private updateState(delta: number, now: number) {
    // 1. Natural Breathing Loop (Sine Wave ~3.5 seconds cycle)
    const breathFreq = 1.8 * this.speedMultiplier;
    this.state.breathingScale = 1.0 + Math.sin(now * 0.002 * breathFreq) * 0.035;

    // 2. Automatic Natural Blink (Every 2.5 - 5 seconds, lasts 150ms)
    if (now >= this.nextBlinkAt && !this.state.isBlinking) {
      this.state.isBlinking = true;
      this.state.eyeOpening = 0.0;
      setTimeout(() => {
        this.state.isBlinking = false;
        this.state.eyeOpening = 1.0;
        this.nextBlinkAt = Date.now() + 2500 + Math.random() * 3500;
      }, 140);
    }

    // 3. Foot Swing Sub-animation (Gentle rocking)
    if (this.state.currentPose === 'FOOT_SWING' || this.state.currentPose === 'IDLE_BREATHING') {
      this.state.footSwingAngle = Math.sin(now * 0.003 * this.speedMultiplier) * 8;
    }

    // 4. Random Idle Routine Scheduler
    if (now >= this.nextIdleActionAt && this.state.currentPose === 'IDLE_BREATHING') {
      const actions: MascotAnimationPose[] = ['LOOK_AROUND', 'FOOT_SWING', 'PEEK', 'WAVE', 'IDLE_BREATHING'];
      const randomPose = actions[Math.floor(Math.random() * actions.length)];
      this.triggerPose(randomPose, 3000 + Math.random() * 3000);
      this.nextIdleActionAt = Date.now() + 7000 + Math.random() * 6000;
    }

    // Return to IDLE_BREATHING when pose duration expires
    if (
      this.state.currentPose !== 'IDLE_BREATHING' && 
      this.state.currentPose !== 'READING_DOA' &&
      now - this.state.lastPoseChangedAt > 4000
    ) {
      this.state.currentPose = 'IDLE_BREATHING';
      this.state.headTiltAngle = 0;
      this.state.lookDirection = { x: 0, y: 0 };
    }
  }

  public triggerPose(pose: MascotAnimationPose, durationMs = 3500) {
    this.state.currentPose = pose;
    this.state.lastPoseChangedAt = Date.now();

    switch (pose) {
      case 'LOOK_AROUND':
        this.state.lookDirection = {
          x: (Math.random() - 0.5) * 1.6,
          y: (Math.random() - 0.5) * 0.8
        };
        this.state.headTiltAngle = (Math.random() - 0.5) * 12;
        break;
      case 'PEEK':
        this.state.headTiltAngle = 14;
        this.state.lookDirection = { x: 0.8, y: -0.4 };
        break;
      case 'WAVE':
      case 'CELEBRATE':
      case 'SMALL_JUMP':
        this.state.lookDirection = { x: 0, y: 0 };
        this.state.headTiltAngle = -6;
        break;
      default:
        this.state.lookDirection = { x: 0, y: 0 };
        this.state.headTiltAngle = 0;
        break;
    }

    this.notify();

    if (pose !== 'IDLE_BREATHING') {
      setTimeout(() => {
        if (this.state.currentPose === pose) {
          this.state.currentPose = 'IDLE_BREATHING';
          this.state.headTiltAngle = 0;
          this.state.lookDirection = { x: 0, y: 0 };
          this.notify();
        }
      }, durationMs);
    }
  }

  public setSpeedMultiplier(multiplier: number) {
    this.speedMultiplier = Math.max(0.2, Math.min(2.5, multiplier));
  }

  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  public setSuspended(suspended: boolean) {
    this.isSuspended = suspended;
  }

  public isAnimationSuspended(): boolean {
    return this.isSuspended;
  }

  public subscribe(listener: (state: LivingAnimationState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  public getCurrentState(): LivingAnimationState {
    return { ...this.state };
  }
}
