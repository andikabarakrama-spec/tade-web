/**
 * TADE v9.2.0-MCA2 — R926
 * MASTER CHARACTER INTERACTION LAYER
 * 
 * Manages user interactions with Asy & Syifa:
 * 1. Tap Reaction (cheerful jump, celebrate state, playful voice hint)
 * 2. Gentle Hover (micro-scale 1.05x, responsive gaze alignment)
 * 3. Pointer Follow (constrained gaze tracking within safe eye socket limits)
 * 4. Typing Distraction Guard (pauses rapid idle movement when user is typing in forms)
 */

import { CharacterId, MasterExpressionKey } from './masterCharacterRegistry';
import { CharacterStateMachine, defaultStateMachine } from './stateMachine';
import { ExpressionEngine, defaultExpressionEngine } from './expressionEngine';
import { IdleController, defaultIdleController } from './idleController';

export interface InteractionConfig {
  enablePointerFollow: boolean;
  enableTypingPause: boolean;
  enableTapCelebration: boolean;
  maxHeadTiltDeg: number;
}

export interface InteractionState {
  isHovered: boolean;
  isPointerTracking: boolean;
  isTypingActive: boolean;
  lastTapTimestamp: number;
  pointerRelativePos: { x: number; y: number }; // -1.0 to 1.0
}

export class CharacterInteractionLayer {
  private stateMachine: CharacterStateMachine;
  private expressionEngine: ExpressionEngine;
  private idleController: IdleController;

  private config: InteractionConfig = {
    enablePointerFollow: true,
    enableTypingPause: true,
    enableTapCelebration: true,
    maxHeadTiltDeg: 5.0
  };

  private state: InteractionState = {
    isHovered: false,
    isPointerTracking: false,
    isTypingActive: false,
    lastTapTimestamp: 0,
    pointerRelativePos: { x: 0, y: 0 }
  };

  private cleanupListeners: Array<() => void> = [];

  constructor(
    stateMachine: CharacterStateMachine = defaultStateMachine,
    expressionEngine: ExpressionEngine = defaultExpressionEngine,
    idleController: IdleController = defaultIdleController
  ) {
    this.stateMachine = stateMachine;
    this.expressionEngine = expressionEngine;
    this.idleController = idleController;

    this.setupGlobalTypingListener();
  }

  /**
   * Handle user tap on character
   */
  public handleTap(characterId: CharacterId = 'ASY'): { expression: MasterExpressionKey; dialogue: string } {
    this.state.lastTapTimestamp = Date.now();

    if (this.config.enableTapCelebration) {
      // Randomize cheerful reaction
      const reactions: Array<{ expr: MasterExpressionKey; dialogueAsy: string; dialogueSyifa: string }> = [
        {
          expr: 'laugh',
          dialogueAsy: 'Hehe, geli! Semangat ya belajarnya hari ini!',
          dialogueSyifa: 'Alhamdulillah, senang sekali bisa menyapa teman-teman!'
        },
        {
          expr: 'happy',
          dialogueAsy: 'Siap membantu! Mau cek info apa nih?',
          dialogueSyifa: 'Bismillah, semoga harimu berkah dan menyenangkan!'
        },
        {
          expr: 'shy',
          dialogueAsy: 'Jazakallahu khairan sudah menyapa Asy!',
          dialogueSyifa: 'Jazakillahu khairan, Syifa siap menemani belajar!'
        }
      ];

      const pick = reactions[Math.floor(Math.random() * reactions.length)];
      
      this.stateMachine.transitionTo('celebrate');
      this.expressionEngine.setExpression(pick.expr, 3000);

      const dialogue = characterId === 'ASY' ? pick.dialogueAsy : pick.dialogueSyifa;
      return { expression: pick.expr, dialogue };
    }

    return {
      expression: 'happy',
      dialogue: 'Assalamu\'alaikum sahabat santri!'
    };
  }

  /**
   * Handle hover state change
   */
  public handleHover(isHovering: boolean): void {
    this.state.isHovered = isHovering;
    if (isHovering && !this.state.isTypingActive) {
      this.expressionEngine.setExpression('happy', 2000);
    }
  }

  /**
   * Pointer tracking relative to character bounds (e.g. from bounding box)
   */
  public handlePointerMove(relX: number, relY: number): void {
    if (!this.config.enablePointerFollow || this.state.isTypingActive) return;

    // Clamp within -1.0 to 1.0
    const clampedX = Math.max(-1, Math.min(1, relX));
    const clampedY = Math.max(-1, Math.min(1, relY));

    this.state.pointerRelativePos = { x: clampedX, y: clampedY };
    this.idleController.setLookAt(clampedX * 0.75, clampedY * 0.5);
    this.expressionEngine.setGaze(clampedX * 0.75, clampedY * 0.5);
  }

  /**
   * Detect focus in inputs/textareas to pause idle distraction
   */
  private setupGlobalTypingListener(): void {
    if (typeof window === 'undefined') return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        this.state.isTypingActive = true;
        this.idleController.pause();
      }
    };

    const handleFocusOut = () => {
      this.state.isTypingActive = false;
      this.idleController.resume();
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    this.cleanupListeners.push(() => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    });
  }

  public getState(): InteractionState {
    return { ...this.state };
  }

  public destroy(): void {
    this.cleanupListeners.forEach(cleanup => cleanup());
    this.cleanupListeners = [];
  }
}

export const defaultInteractionLayer = new CharacterInteractionLayer();
