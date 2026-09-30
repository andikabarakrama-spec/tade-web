/**
 * TADE Living Character Engine v1
 * 
 * Manages character state machine transitions, performance modes,
 * prefers-reduced-motion accessibility, and lazy asset loading for Asy and Syifa.
 */

import { AIAsyCharacterState } from './AIAsyCharacterAssetRegistry';
import { SecurityMiddleware } from '../../services/securityMiddleware';

export type CharacterGender = 'ASY' | 'ASYAH';

export type CharacterActionState =
  | 'IDLE'
  | 'WAVE'
  | 'SPEAKING'
  | 'POINT_UP'
  | 'POINT_LEFT'
  | 'POINT_RIGHT'
  | 'WALK'
  | 'THINKING'
  | 'HAPPY'
  | 'SURPRISED'
  | 'RAISE_HAND';

export class LivingCharacterEngine {
  private currentState: AIAsyCharacterState = 'idle';
  private currentGender: CharacterGender = 'ASY';
  private listeners: Array<(state: AIAsyCharacterState) => void> = [];

  constructor(gender: CharacterGender = 'ASY') {
    this.currentGender = gender;
  }

  /**
   * Sets the character gender variant (ASY = boy, ASYAH = Syifa / girl).
   */
  public setGender(gender: CharacterGender) {
    this.currentGender = gender;
  }

  public getGender(): CharacterGender {
    return this.currentGender;
  }

  /**
   * Safe state machine transition with fallback to 'idle'.
   */
  public transitionTo(action: CharacterActionState | AIAsyCharacterState): AIAsyCharacterState {
    if (!SecurityMiddleware.isFeatureEnabled('livingCharacterEngine')) {
      return 'idle';
    }

    const stateMap: Record<string, AIAsyCharacterState> = {
      IDLE: 'idle',
      WAVE: 'wave',
      SPEAKING: 'speaking',
      POINT_UP: 'point_up',
      POINT_LEFT: 'point_left',
      POINT_RIGHT: 'point_right',
      WALK: 'walk',
      THINKING: 'thinking',
      HAPPY: 'happy',
      SURPRISED: 'surprised',
      RAISE_HAND: 'raise_hand',
    };

    const targetState = stateMap[action] || (action as AIAsyCharacterState) || 'idle';
    this.currentState = targetState;
    this.notifyListeners();
    return this.currentState;
  }

  public getCurrentState(): AIAsyCharacterState {
    return this.currentState;
  }

  public subscribe(listener: (state: AIAsyCharacterState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  /**
   * Accessibility check: detects system prefers-reduced-motion preference.
   */
  public static prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
