/**
 * TADE v9.4.0-MCA4 — R945
 * EMOTION CONTROLLER
 * 
 * Manages emotional state transitions, valence/arousal vectors,
 * and mood modulation for Asy & Syifa.
 * 
 * Core Emotions:
 * - CALM: Peaceful, gentle, relaxed breathing
 * - HAPPY: Cheerful, glowing cheeks, bouncy gestures
 * - FOCUSED: Attentive, studious, steady gaze
 * - CURIOUS: Head tilted, wide observant eyes, exploratory
 */

import { CharacterId, MasterExpressionKey } from './masterCharacterRegistry';

export type MasterEmotionType = 'calm' | 'happy' | 'focused' | 'curious';

export interface EmotionProfile {
  type: MasterEmotionType;
  label: string;
  valence: number; // -1.0 (unpleasant) to +1.0 (pleasant)
  arousal: number; // 0.0 (sleepy/calm) to +1.0 (energetic/excited)
  gestureSpeedMultiplier: number;
  smileFactor: number; // 0.0 to 1.0
  sparkleIntensity: number; // 0.0 to 1.0
  defaultExpression: MasterExpressionKey;
  description: string;
}

export const EMOTION_PROFILES: Record<MasterEmotionType, EmotionProfile> = {
  calm: {
    type: 'calm',
    label: 'Tenang & Khusyuk',
    valence: 0.6,
    arousal: 0.25,
    gestureSpeedMultiplier: 0.85,
    smileFactor: 0.4,
    sparkleIntensity: 0.1,
    defaultExpression: 'idle',
    description: 'Suasana santun menenangkan, cocok untuk dzikir dan istirahat santri.'
  },
  happy: {
    type: 'happy',
    label: 'Ceria & Bersyukur',
    valence: 0.95,
    arousal: 0.8,
    gestureSpeedMultiplier: 1.15,
    smileFactor: 1.0,
    sparkleIntensity: 0.85,
    defaultExpression: 'happy',
    description: 'Penuh tawa dan kegembiraan, menyemangati aktivitas belajar.'
  },
  focused: {
    type: 'focused',
    label: 'Fokus & Khidmat',
    valence: 0.5,
    arousal: 0.45,
    gestureSpeedMultiplier: 0.95,
    smileFactor: 0.3,
    sparkleIntensity: 0.3,
    defaultExpression: 'reading',
    description: 'Konsentrasi penuh menyimak muroja\'ah dan hafalan Al-Qur\'an.'
  },
  curious: {
    type: 'curious',
    label: 'Ingin Tahu & Antusias',
    valence: 0.75,
    arousal: 0.65,
    gestureSpeedMultiplier: 1.05,
    smileFactor: 0.6,
    sparkleIntensity: 0.6,
    defaultExpression: 'happy',
    description: 'Mata berbinar mengeksplorasi ilmu baru dan keajaiban ciptaan Allah.'
  }
};

export interface EmotionSnapshot {
  currentEmotion: MasterEmotionType;
  profile: EmotionProfile;
  currentValence: number;
  currentArousal: number;
  gestureSpeed: number;
  smileFactor: number;
  sparkleIntensity: number;
  isTransitioning: boolean;
  updatedAt: number;
}

export type EmotionListener = (snapshot: EmotionSnapshot) => void;

export class EmotionController {
  private currentEmotion: MasterEmotionType = 'calm';
  private targetEmotion: MasterEmotionType = 'calm';
  private transitionTimer: number = 0;
  private transitionDuration: number = 0.4; // 400ms blend
  private isTransitioning: boolean = false;

  // Blended values
  private blendedValence: number = 0.6;
  private blendedArousal: number = 0.25;
  private blendedSmileFactor: number = 0.4;
  private blendedSparkle: number = 0.1;

  private listeners: Set<EmotionListener> = new Set();

  constructor(initialEmotion: MasterEmotionType = 'calm') {
    this.setEmotion(initialEmotion, true);
  }

  public setEmotion(emotion: MasterEmotionType, instant: boolean = false): void {
    if (this.currentEmotion === emotion && !this.isTransitioning) return;

    this.targetEmotion = emotion;

    if (instant) {
      this.currentEmotion = emotion;
      const profile = EMOTION_PROFILES[emotion];
      this.blendedValence = profile.valence;
      this.blendedArousal = profile.arousal;
      this.blendedSmileFactor = profile.smileFactor;
      this.blendedSparkle = profile.sparkleIntensity;
      this.isTransitioning = false;
      this.notifyListeners();
      return;
    }

    this.isTransitioning = true;
    this.transitionTimer = 0;
  }

  public getEmotion(): MasterEmotionType {
    return this.currentEmotion;
  }

  public getProfile(): EmotionProfile {
    return EMOTION_PROFILES[this.currentEmotion];
  }

  public update(deltaSeconds: number): void {
    if (!this.isTransitioning) return;

    this.transitionTimer += deltaSeconds;
    const progress = Math.min(1.0, this.transitionTimer / this.transitionDuration);
    const targetProfile = EMOTION_PROFILES[this.targetEmotion];
    const fromProfile = EMOTION_PROFILES[this.currentEmotion];

    // Smooth ease-out lerp
    const ease = 1 - Math.pow(1 - progress, 2);

    this.blendedValence = fromProfile.valence + (targetProfile.valence - fromProfile.valence) * ease;
    this.blendedArousal = fromProfile.arousal + (targetProfile.arousal - fromProfile.arousal) * ease;
    this.blendedSmileFactor = fromProfile.smileFactor + (targetProfile.smileFactor - fromProfile.smileFactor) * ease;
    this.blendedSparkle = fromProfile.sparkleIntensity + (targetProfile.sparkleIntensity - fromProfile.sparkleIntensity) * ease;

    if (progress >= 1.0) {
      this.currentEmotion = this.targetEmotion;
      this.isTransitioning = false;
    }

    this.notifyListeners();
  }

  public getSnapshot(): EmotionSnapshot {
    return {
      currentEmotion: this.currentEmotion,
      profile: EMOTION_PROFILES[this.currentEmotion],
      currentValence: this.blendedValence,
      currentArousal: this.blendedArousal,
      gestureSpeed: EMOTION_PROFILES[this.currentEmotion].gestureSpeedMultiplier,
      smileFactor: this.blendedSmileFactor,
      sparkleIntensity: this.blendedSparkle,
      isTransitioning: this.isTransitioning,
      updatedAt: Date.now()
    };
  }

  public subscribe(listener: EmotionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach(l => {
      try { l(snapshot); } catch (e) { console.error('EmotionListener error:', e); }
    });
  }
}

export const defaultEmotionController = new EmotionController();
