/**
 * TADE v9.6.0-MCA6 — R962 & R963 & R965
 * LEARNING GESTURE & POSITIVE REINFORCEMENT CONTROLLER
 * 
 * Orchestrates pedagogical body language & positive reinforcement:
 * - Learning Gestures: POINT_BOOK, OPEN_IQRO, CLAP_APPRECIATE, RAISE_HAND, LOOK_TEACHER, RHYTHMIC_BODY
 * - Group Participation Coordination: Salam bareng, tepuk bersama, duduk santun
 * - Positive Reinforcement: Senyum apresiasi, anggukan berkah ("Mumtaz!", "Barakallah")
 */

import { MasterClipName } from './animationClipRegistry';
import { CharacterId } from './masterCharacterRegistry';

export type LearningGestureType = 
  | 'POINT_BOOK'
  | 'OPEN_IQRO'
  | 'CLAP_APPRECIATE'
  | 'RAISE_HAND'
  | 'LOOK_TEACHER'
  | 'RHYTHMIC_BODY';

export interface LearningGesture {
  id: LearningGestureType;
  label: string;
  mappedClip: MasterClipName;
  durationSec: number;
  reinforcementPhrase: string;
  headTiltDeg: number;
  armAngleDeg: number;
}

export const LEARNING_GESTURES: Record<LearningGestureType, LearningGesture> = {
  POINT_BOOK: {
    id: 'POINT_BOOK',
    label: 'Menunjuk Huruf/Buku',
    mappedClip: 'readIqro',
    durationSec: 3.0,
    reinforcementPhrase: 'Mari tunjuk huruf hijaiyah dengan jari telunjuk kanan yang bersih.',
    headTiltDeg: 8,
    armAngleDeg: 25
  },
  OPEN_IQRO: {
    id: 'OPEN_IQRO',
    label: 'Membuka Halaman Iqro',
    mappedClip: 'readIqro',
    durationSec: 3.5,
    reinforcementPhrase: 'Buka lembar demi lembar dengan hati-hati dan adab mulia.',
    headTiltDeg: 12,
    armAngleDeg: 15
  },
  CLAP_APPRECIATE: {
    id: 'CLAP_APPRECIATE',
    label: 'Tepuk Apresiasi Santun',
    mappedClip: 'celebrate',
    durationSec: 2.5,
    reinforcementPhrase: 'Mumtaz! MasyaAllah hebat sekali teman-teman!',
    headTiltDeg: 0,
    armAngleDeg: 45
  },
  RAISE_HAND: {
    id: 'RAISE_HAND',
    label: 'Angkat Tangan Tertib',
    mappedClip: 'wave',
    durationSec: 3.0,
    reinforcementPhrase: 'Angkat tangan kanan dengan tenang saat ingin bertanya atau menjawab.',
    headTiltDeg: -5,
    armAngleDeg: 75
  },
  LOOK_TEACHER: {
    id: 'LOOK_TEACHER',
    label: 'Menyimak Penjelasan Guru',
    mappedClip: 'lookAround',
    durationSec: 4.0,
    reinforcementPhrase: 'Pandangan lurus menyimak nasehat Ustadz & Ustadzah dengan khusyuk.',
    headTiltDeg: 3,
    armAngleDeg: 0
  },
  RHYTHMIC_BODY: {
    id: 'RHYTHMIC_BODY',
    label: 'Gerakan Irama Senam',
    mappedClip: 'wave',
    durationSec: 4.5,
    reinforcementPhrase: 'Satu dua tiga empat, sehat raga cerdas akal!',
    headTiltDeg: 6,
    armAngleDeg: 60
  }
};

export interface GroupParticipationState {
  groupMode: 'SOLO' | 'SYNCHRONIZED_SALAM' | 'SYNCHRONIZED_CLAP' | 'SYNCHRONIZED_SIT';
  syncProgress: number; // 0.0 to 1.0
  activeGesture: LearningGestureType | null;
  lastReinforcementTime: number;
  reinforcementCount: number;
}

export class LearningGestureController {
  private activeGesture: LearningGesture | null = null;
  private gestureStartedAt: number = 0;
  private groupMode: 'SOLO' | 'SYNCHRONIZED_SALAM' | 'SYNCHRONIZED_CLAP' | 'SYNCHRONIZED_SIT' = 'SOLO';
  private reinforcementCount: number = 0;
  private lastReinforcementTime: number = Date.now();

  public triggerGesture(gestureType: LearningGestureType): LearningGesture {
    const g = LEARNING_GESTURES[gestureType];
    this.activeGesture = g;
    this.gestureStartedAt = Date.now();
    this.reinforcementCount++;
    this.lastReinforcementTime = Date.now();
    return g;
  }

  public setGroupMode(mode: 'SOLO' | 'SYNCHRONIZED_SALAM' | 'SYNCHRONIZED_CLAP' | 'SYNCHRONIZED_SIT'): void {
    this.groupMode = mode;
    if (mode === 'SYNCHRONIZED_SALAM') {
      this.triggerGesture('RAISE_HAND');
    } else if (mode === 'SYNCHRONIZED_CLAP') {
      this.triggerGesture('CLAP_APPRECIATE');
    } else if (mode === 'SYNCHRONIZED_SIT') {
      this.triggerGesture('LOOK_TEACHER');
    }
  }

  public getActiveGesture(): LearningGesture | null {
    if (!this.activeGesture) return null;
    const elapsed = (Date.now() - this.gestureStartedAt) / 1000;
    if (elapsed > this.activeGesture.durationSec) {
      this.activeGesture = null;
      return null;
    }
    return this.activeGesture;
  }

  public getState(): GroupParticipationState {
    const g = this.getActiveGesture();
    return {
      groupMode: this.groupMode,
      syncProgress: g ? Math.min(1, (Date.now() - this.gestureStartedAt) / (g.durationSec * 1000)) : 0,
      activeGesture: g ? g.id : null,
      lastReinforcementTime: this.lastReinforcementTime,
      reinforcementCount: this.reinforcementCount
    };
  }
}

export const defaultLearningGestureController = new LearningGestureController();
