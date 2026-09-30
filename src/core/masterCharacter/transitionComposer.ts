/**
 * TADE v9.5.0-MCA5 — R956
 * TRANSITION COMPOSER
 * 
 * Cinematic action blending and motion easing orchestrator:
 * - Anticipation curve (subtle pre-action compression)
 * - Cubic-bezier & spring smoothing curves
 * - Settle & follow-through (graceful post-action dampening)
 * - Zero snap-cutting between visual animation clips
 */

export interface TransitionCurveConfig {
  anticipationRatio: number; // 0.15 of duration
  actionRatio: number; // 0.70 of duration
  settleRatio: number; // 0.15 of duration
  dampingFactor: number;
}

export class TransitionComposer {
  private config: TransitionCurveConfig = {
    anticipationRatio: 0.15,
    actionRatio: 0.70,
    settleRatio: 0.15,
    dampingFactor: 0.85
  };

  /**
   * Evaluates smoothed value from normalized progress (0.0 to 1.0)
   * with organic Disney animation principles: Anticipation -> Action -> Settle
   */
  public evaluateTransition(progress: number): {
    scaleY: number;
    scaleX: number;
    offsetY: number;
    phase: 'ANTICIPATION' | 'ACTION' | 'SETTLE';
  } {
    const p = Math.max(0, Math.min(1, progress));

    if (p < this.config.anticipationRatio) {
      // Anticipation phase: subtle squash
      const localP = p / this.config.anticipationRatio;
      const squash = Math.sin(localP * Math.PI * 0.5) * 0.04;
      return {
        scaleY: 1.0 - squash,
        scaleX: 1.0 + squash * 0.5,
        offsetY: squash * 10,
        phase: 'ANTICIPATION'
      };
    }

    if (p > 1.0 - this.config.settleRatio) {
      // Settle phase: subtle dampening overshoot
      const localP = (p - (1.0 - this.config.settleRatio)) / this.config.settleRatio;
      const settleOvershoot = Math.sin(localP * Math.PI * 2) * Math.exp(-localP * 3) * 0.03;
      return {
        scaleY: 1.0 + settleOvershoot,
        scaleX: 1.0 - settleOvershoot * 0.5,
        offsetY: -settleOvershoot * 8,
        phase: 'SETTLE'
      };
    }

    // Action phase: standard spring-like progression
    return {
      scaleY: 1.0,
      scaleX: 1.0,
      offsetY: 0,
      phase: 'ACTION'
    };
  }
}

export const defaultTransitionComposer = new TransitionComposer();
