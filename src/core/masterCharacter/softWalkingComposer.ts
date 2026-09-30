/**
 * TADE v9.7.0-MCA7 — R973, R975
 * SOFT WALKING COMPOSER & COMPANION PRESENCE LAYER
 * 
 * Manages organic character locomotion & mutual coordination:
 * - Anticipation -> Lean forward -> Step cycle -> Settle deceleration
 * - Companion synchronizer (Mutual gaze, safe distance enforcement >= 80px, paced walking)
 */

import { AreaAnchorPosition } from './schoolWorldAdapter';

export interface WalkingTrajectory {
  isMoving: boolean;
  sourceX: number;
  targetX: number;
  currentX: number;
  progress: number; // 0.0 to 1.0
  walkingSpeed: number; // units per second
  weightShiftAngleDeg: number;
  stepPhase: number; // 0 to 2PI for leg oscillation simulation
  startedAt: number;
  durationMs: number;
}

export class SoftWalkingComposer {
  private asyTrajectory: WalkingTrajectory = {
    isMoving: false,
    sourceX: 30,
    targetX: 30,
    currentX: 30,
    progress: 1.0,
    walkingSpeed: 18,
    weightShiftAngleDeg: 0,
    stepPhase: 0,
    startedAt: 0,
    durationMs: 0
  };

  private syifaTrajectory: WalkingTrajectory = {
    isMoving: false,
    sourceX: 70,
    targetX: 70,
    currentX: 70,
    progress: 1.0,
    walkingSpeed: 18,
    weightShiftAngleDeg: 0,
    stepPhase: 0,
    startedAt: 0,
    durationMs: 0
  };

  public moveTo(character: 'ASY' | 'SYIFA', targetX: number, durationMs: number = 1800): void {
    const traj = character === 'ASY' ? this.asyTrajectory : this.syifaTrajectory;
    traj.sourceX = traj.currentX;
    traj.targetX = targetX;
    traj.isMoving = true;
    traj.progress = 0;
    traj.startedAt = Date.now();
    traj.durationMs = durationMs;
  }

  public update(deltaSec: number): { asy: WalkingTrajectory; syifa: WalkingTrajectory; isCompanionSynced: boolean } {
    this.updateSingle(this.asyTrajectory, deltaSec);
    this.updateSingle(this.syifaTrajectory, deltaSec);

    // Companion Distance Protection (Minimum 25% screen width distance to avoid overlap)
    const minSeparation = 24;
    const distance = Math.abs(this.syifaTrajectory.currentX - this.asyTrajectory.currentX);
    
    if (distance < minSeparation) {
      if (this.asyTrajectory.currentX <= this.syifaTrajectory.currentX) {
        this.asyTrajectory.currentX = Math.max(10, this.asyTrajectory.currentX - 0.2);
        this.syifaTrajectory.currentX = Math.min(90, this.syifaTrajectory.currentX + 0.2);
      }
    }

    const isCompanionSynced = Math.abs(this.asyTrajectory.progress - this.syifaTrajectory.progress) < 0.15;

    return {
      asy: { ...this.asyTrajectory },
      syifa: { ...this.syifaTrajectory },
      isCompanionSynced
    };
  }

  private updateSingle(traj: WalkingTrajectory, deltaSec: number): void {
    if (!traj.isMoving) {
      traj.weightShiftAngleDeg *= 0.9;
      return;
    }

    const elapsed = Date.now() - traj.startedAt;
    const rawProgress = Math.min(1.0, elapsed / traj.durationMs);

    // Smooth Quintic / Hermite Easing (Anticipation 15% -> Cruise -> Settle 15%)
    traj.progress = this.smoothStep(rawProgress);
    traj.currentX = traj.sourceX + (traj.targetX - traj.sourceX) * traj.progress;

    // Weight shift oscillation based on step phase
    traj.stepPhase += deltaSec * 8; // step frequency
    const direction = traj.targetX >= traj.sourceX ? 1 : -1;
    traj.weightShiftAngleDeg = Math.sin(traj.stepPhase) * 3.5 * direction;

    if (rawProgress >= 1.0) {
      traj.isMoving = false;
      traj.currentX = traj.targetX;
      traj.weightShiftAngleDeg = 0;
    }
  }

  private smoothStep(t: number): number {
    // Hermite curve for gentle acceleration and deceleration
    return t * t * (3 - 2 * t);
  }

  public getTrajectories(): { asy: WalkingTrajectory; syifa: WalkingTrajectory } {
    return {
      asy: { ...this.asyTrajectory },
      syifa: { ...this.syifaTrajectory }
    };
  }
}

export const defaultSoftWalkingComposer = new SoftWalkingComposer();
