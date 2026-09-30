/**
 * TADE v9.5.0-MCA5 — R954
 * SOFT CROWD AWARENESS SYSTEM
 * 
 * Provides interpersonal distance & social coordination between Asy & Syifa:
 * - Natural spatial padding (prevents character overlap/clipping)
 * - Mutual gaze coordination (characters look towards each other during dialogue)
 * - Synchronized adab & salam gestures
 * - Conversational turn-taking in living scenes
 */

import { CharacterId } from './masterCharacterRegistry';

export interface CharacterPlacement {
  id: CharacterId;
  normalizedPositionX: number; // 0 to 100% of stage
  facingDirection: 'LEFT' | 'RIGHT' | 'FRONT';
  mutualGazeAngleDeg: number; // head turn towards companion
  isListeningToCompanion: boolean;
  socialDistancePx: number;
}

export interface CrowdAwarenessSnapshot {
  isDualPresent: boolean;
  asyPlacement: CharacterPlacement;
  syifaPlacement: CharacterPlacement;
  coordinationMode: 'SOLO_ASY' | 'SOLO_SYIFA' | 'DUAL_PARALLEL' | 'DUAL_CONVERSATION' | 'DUAL_GREETING';
  safetyPaddingPx: number;
}

export class CrowdAwarenessSystem {
  private isDual: boolean = false;
  private mode: 'SOLO_ASY' | 'SOLO_SYIFA' | 'DUAL_PARALLEL' | 'DUAL_CONVERSATION' | 'DUAL_GREETING' = 'SOLO_ASY';
  private minSafeDistancePx: number = 80;

  public setPresenceMode(mode: 'SOLO_ASY' | 'SOLO_SYIFA' | 'DUAL_PARALLEL' | 'DUAL_CONVERSATION' | 'DUAL_GREETING'): void {
    this.mode = mode;
    this.isDual = mode.startsWith('DUAL');
  }

  public getSnapshot(): CrowdAwarenessSnapshot {
    const isDual = this.isDual;

    return {
      isDualPresent: isDual,
      coordinationMode: this.mode,
      safetyPaddingPx: this.minSafeDistancePx,
      asyPlacement: {
        id: 'ASY',
        normalizedPositionX: isDual ? 32 : 50,
        facingDirection: this.mode === 'DUAL_CONVERSATION' ? 'RIGHT' : 'FRONT',
        mutualGazeAngleDeg: this.mode === 'DUAL_CONVERSATION' ? 6.0 : 0.0,
        isListeningToCompanion: this.mode === 'DUAL_CONVERSATION',
        socialDistancePx: isDual ? 120 : 0
      },
      syifaPlacement: {
        id: 'SYIFA',
        normalizedPositionX: isDual ? 68 : 50,
        facingDirection: this.mode === 'DUAL_CONVERSATION' ? 'LEFT' : 'FRONT',
        mutualGazeAngleDeg: this.mode === 'DUAL_CONVERSATION' ? -6.0 : 0.0,
        isListeningToCompanion: false,
        socialDistancePx: isDual ? 120 : 0
      }
    };
  }
}

export const defaultCrowdAwarenessSystem = new CrowdAwarenessSystem();
