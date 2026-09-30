/**
 * TADE v9.1.0-MCA1 — R914
 * EXPRESSION ENGINE
 * 
 * Manages emotional state transitions, blinking loops, gaze variations,
 * and natural expressions for Asy & Syifa.
 * 
 * Minimal States Required:
 * - idle
 * - happy
 * - laugh
 * - confused
 * - shy
 * - sleepy
 * - reading
 * - surprised
 */

import { CharacterId, MasterExpressionKey, ASY_EXPRESSIONS, SYIFA_EXPRESSIONS, CharacterExpressionConfig } from './masterCharacterRegistry';

export interface ExpressionStateSnapshot {
  characterId: CharacterId;
  currentExpression: MasterExpressionKey;
  previousExpression: MasterExpressionKey;
  config: CharacterExpressionConfig;
  isBlinking: boolean;
  eyeGaze: { x: number; y: number }; // -1.0 to 1.0
  blushIntensity: number;
  breathingPhase: number; // 0 to 1
  isSpeaking: boolean;
  speechText?: string;
  updatedAt: number;
}

export type ExpressionListener = (snapshot: ExpressionStateSnapshot) => void;

export class ExpressionEngine {
  private characterId: CharacterId;
  private currentExpression: MasterExpressionKey = 'idle';
  private previousExpression: MasterExpressionKey = 'idle';
  private isBlinking: boolean = false;
  private eyeGaze: { x: number; y: number } = { x: 0, y: 0 };
  private isSpeaking: boolean = false;
  private speechText?: string;
  private returnToIdleTimer: any = null;
  private blinkTimer: any = null;
  private gazeTimer: any = null;
  private listeners: Set<ExpressionListener> = new Set();

  constructor(initialCharacter: CharacterId = 'ASY') {
    this.characterId = initialCharacter;
    this.startBlinkLoop();
    this.startGazeWanderLoop();
  }

  public setCharacter(id: CharacterId): void {
    if (this.characterId !== id) {
      this.characterId = id;
      this.notifyListeners();
    }
  }

  public getCharacter(): CharacterId {
    return this.characterId;
  }

  public getCurrentExpression(): MasterExpressionKey {
    return this.currentExpression;
  }

  public setExpression(key: MasterExpressionKey, autoResetMs?: number): void {
    if (this.currentExpression === key && !autoResetMs) {
      return;
    }

    if (this.returnToIdleTimer) {
      clearTimeout(this.returnToIdleTimer);
      this.returnToIdleTimer = null;
    }

    this.previousExpression = this.currentExpression;
    this.currentExpression = key;

    const config = this.getExpressionConfig(key);
    const duration = autoResetMs ?? (key !== 'idle' ? config.durationMs : undefined);

    if (duration && key !== 'idle') {
      this.returnToIdleTimer = setTimeout(() => {
        this.resetToIdle();
      }, duration);
    }

    this.notifyListeners();
  }

  public resetToIdle(): void {
    if (this.currentExpression !== 'idle') {
      this.previousExpression = this.currentExpression;
      this.currentExpression = 'idle';
      this.notifyListeners();
    }
  }

  public triggerSpeech(text: string, durationMs: number = 4000, emotionalTone?: MasterExpressionKey): void {
    this.speechText = text;
    this.isSpeaking = true;
    if (emotionalTone) {
      this.setExpression(emotionalTone, durationMs);
    }

    setTimeout(() => {
      this.isSpeaking = false;
      this.speechText = undefined;
      this.notifyListeners();
    }, durationMs);

    this.notifyListeners();
  }

  public setGaze(x: number, y: number): void {
    const nextX = Math.max(-1, Math.min(1, x));
    const nextY = Math.max(-1, Math.min(1, y));
    if (this.eyeGaze.x === nextX && this.eyeGaze.y === nextY) return;
    this.eyeGaze = { x: nextX, y: nextY };
    this.notifyListeners();
  }

  public triggerBlink(): void {
    this.isBlinking = true;
    this.notifyListeners();

    setTimeout(() => {
      this.isBlinking = false;
      this.notifyListeners();
    }, 180);
  }

  public subscribe(listener: ExpressionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getSnapshot(): ExpressionStateSnapshot {
    const config = this.getExpressionConfig(this.currentExpression);
    return {
      characterId: this.characterId,
      currentExpression: this.currentExpression,
      previousExpression: this.previousExpression,
      config,
      isBlinking: this.isBlinking,
      eyeGaze: { ...this.eyeGaze },
      blushIntensity: config.blushLevel,
      breathingPhase: (Date.now() % 3500) / 3500,
      isSpeaking: this.isSpeaking,
      speechText: this.speechText,
      updatedAt: Date.now()
    };
  }

  public destroy(): void {
    if (this.returnToIdleTimer) clearTimeout(this.returnToIdleTimer);
    if (this.blinkTimer) clearTimeout(this.blinkTimer);
    if (this.gazeTimer) clearTimeout(this.gazeTimer);
    this.listeners.clear();
  }

  private getExpressionConfig(key: MasterExpressionKey): CharacterExpressionConfig {
    return this.characterId === 'ASY' 
      ? ASY_EXPRESSIONS[key] || ASY_EXPRESSIONS.idle
      : SYIFA_EXPRESSIONS[key] || SYIFA_EXPRESSIONS.idle;
  }

  private startBlinkLoop(): void {
    const nextBlinkInterval = 2500 + Math.random() * 4000;
    this.blinkTimer = setTimeout(() => {
      this.triggerBlink();
      this.startBlinkLoop();
    }, nextBlinkInterval);
  }

  private startGazeWanderLoop(): void {
    const nextGazeInterval = 3000 + Math.random() * 5000;
    this.gazeTimer = setTimeout(() => {
      if (this.currentExpression === 'idle' || this.currentExpression === 'happy') {
        const rx = (Math.random() - 0.5) * 0.6;
        const ry = (Math.random() - 0.5) * 0.4;
        this.setGaze(rx, ry);
      }
      this.startGazeWanderLoop();
    }, nextGazeInterval);
  }

  private notifyListeners(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach(fn => fn(snapshot));
  }
}

// Global Singleton Instance for shared app state
export const defaultExpressionEngine = new ExpressionEngine('ASY');
