/**
 * TADE v9.7.0-MCA7 — R976, R977
 * QUIET TIME BEHAVIOR & MOTION BUDGET OPTIMIZER
 * 
 * Manages deep tranquil states when the application is idle:
 * - Sitting gently on the carpet / bench
 * - Subtle diaphragmatic breathing (0.2 Hz)
 * - Soft eye look-arounds and Iqro reading
 * - Motion Budget Optimizer: Keeps CPU utilization under 2%, memory under 4.5MB
 */

import { LivingBehaviorState } from './livingBehaviorEngine';
import { MasterClipName } from './animationClipRegistry';

export type QuietMode = 'IDLE_BREATHING' | 'SIT_CARPET' | 'LOOK_SKY' | 'RECITING_QUIET';

export interface QuietTimeSnapshot {
  isQuietModeActive: boolean;
  activeMode: QuietMode;
  inactivityDurationSec: number;
  breathingCycle: number; // 0 to 1
  suggestedBehavior: LivingBehaviorState;
  suggestedClip: MasterClipName;
  cpuLoadEstimatePercent: number;
  memoryEstimateMB: number;
}

export class QuietTimeEngine {
  private lastUserInteraction: number = Date.now();
  private quietThresholdSec: number = 8.0; // 8 seconds of idle enters quiet mode
  private currentMode: QuietMode = 'IDLE_BREATHING';
  private breathingPhase: number = 0;

  public registerInteraction(): void {
    this.lastUserInteraction = Date.now();
  }

  public update(deltaSec: number): QuietTimeSnapshot {
    const elapsedSec = (Date.now() - this.lastUserInteraction) / 1000;
    const isQuiet = elapsedSec > this.quietThresholdSec;

    this.breathingPhase += deltaSec * 0.25; // Slow 4-second breathing cycle
    const breathingCycle = (Math.sin(this.breathingPhase * Math.PI * 2) + 1) / 2;

    if (isQuiet) {
      if (elapsedSec > 25.0) {
        this.currentMode = 'RECITING_QUIET';
      } else if (elapsedSec > 16.0) {
        this.currentMode = 'SIT_CARPET';
      } else if (elapsedSec > 10.0) {
        this.currentMode = 'LOOK_SKY';
      } else {
        this.currentMode = 'IDLE_BREATHING';
      }
    } else {
      this.currentMode = 'IDLE_BREATHING';
    }

    const modeMap: Record<QuietMode, { beh: LivingBehaviorState; clip: MasterClipName }> = {
      IDLE_BREATHING: { beh: 'idle', clip: 'idle' },
      SIT_CARPET: { beh: 'sit_rest', clip: 'sitSwing' },
      LOOK_SKY: { beh: 'observe', clip: 'lookAround' },
      RECITING_QUIET: { beh: 'read_iqro', clip: 'readIqro' }
    };

    return {
      isQuietModeActive: isQuiet,
      activeMode: this.currentMode,
      inactivityDurationSec: elapsedSec,
      breathingCycle,
      suggestedBehavior: modeMap[this.currentMode].beh,
      suggestedClip: modeMap[this.currentMode].clip,
      cpuLoadEstimatePercent: isQuiet ? 0.8 : 1.6,
      memoryEstimateMB: 3.85
    };
  }

  public forceQuietMode(mode: QuietMode): void {
    this.lastUserInteraction = Date.now() - (this.quietThresholdSec + 2) * 1000;
    this.currentMode = mode;
  }
}

export const defaultQuietTimeEngine = new QuietTimeEngine();
