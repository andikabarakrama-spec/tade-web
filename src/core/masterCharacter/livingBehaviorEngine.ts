/**
 * TADE v9.4.0-MCA4 — R941
 * LIVING CHARACTER BEHAVIOR ENGINE
 * 
 * Central data-driven behavior runtime and state orchestrator for Asy & Syifa.
 * 
 * Core Behavior States:
 * - idle: Calm, santun, observant standing
 * - greet: Warm Islamic greeting & salam wave
 * - observe: Curious head tilt, attentive gaze wandering
 * - read_iqro: Reverent reading of holy Iqro / Al-Qur'an
 * - butterfly: Joyful playfulness and garden wonder
 * - celebrate: Cheerful achievement celebration & thumbs-up
 * - sit_rest: Peaceful sitting, swinging feet, resting
 * - transition: Smooth intermediate action blending
 */

import { CharacterId, MasterPoseKey, MasterExpressionKey } from './masterCharacterRegistry';
import { defaultClipRegistry, MasterClipName } from './animationClipRegistry';
import { SchoolTimeAdapter, defaultSchoolTimeAdapter, SchoolPeriodDefinition } from './schoolTimeAdapter';
import { BehaviorContextAdapter, defaultBehaviorContextAdapter, ContextBehaviorSignal } from './behaviorContextAdapter';
import { EmotionController, defaultEmotionController, MasterEmotionType, EmotionSnapshot } from './emotionController';
import { MicroBehaviorSystem, defaultMicroBehaviorSystem, MicroBehaviorSnapshot } from './microBehaviorSystem';

export type LivingBehaviorState = 
  | 'idle'
  | 'greet'
  | 'observe'
  | 'read_iqro'
  | 'butterfly'
  | 'celebrate'
  | 'sit_rest'
  | 'transition';

export interface BehaviorStateConfig {
  state: LivingBehaviorState;
  label: string;
  mappedClip: MasterClipName;
  defaultPose: MasterPoseKey;
  defaultExpression: MasterExpressionKey;
  defaultEmotion: MasterEmotionType;
  minDurationSec: number;
  maxDurationSec: number;
  autoReturnToIdle: boolean;
  priority: number;
  description: string;
}

export const BEHAVIOR_STATE_CONFIGS: Record<LivingBehaviorState, BehaviorStateConfig> = {
  idle: {
    state: 'idle',
    label: 'Tenang & Siaga',
    mappedClip: 'idle',
    defaultPose: 'idle-stand',
    defaultExpression: 'idle',
    defaultEmotion: 'calm',
    minDurationSec: 4.0,
    maxDurationSec: 12.0,
    autoReturnToIdle: false,
    priority: 1,
    description: 'Pose santun berdiri tenang siap mendampingi proses belajar santri.'
  },
  greet: {
    state: 'greet',
    label: 'Salam & Sapa Santun',
    mappedClip: 'wave',
    defaultPose: 'wave',
    defaultExpression: 'happy',
    defaultEmotion: 'happy',
    minDurationSec: 3.0,
    maxDurationSec: 4.5,
    autoReturnToIdle: true,
    priority: 8,
    description: 'Melambaikan tangan dengan senyum tulus mengucap Assalamu\'alaikum.'
  },
  observe: {
    state: 'observe',
    label: 'Menyimak & Eksplorasi',
    mappedClip: 'lookAround',
    defaultPose: 'idle-stand',
    defaultExpression: 'happy',
    defaultEmotion: 'curious',
    minDurationSec: 3.5,
    maxDurationSec: 6.0,
    autoReturnToIdle: true,
    priority: 4,
    description: 'Memperhatikan aktivitas pengguna dengan kepala miring sedikit dan pandangan mata ingin tahu.'
  },
  read_iqro: {
    state: 'read_iqro',
    label: 'Membaca Iqro / Qur\'an',
    mappedClip: 'readIqro',
    defaultPose: 'read-iqro',
    defaultExpression: 'reading',
    defaultEmotion: 'focused',
    minDurationSec: 5.0,
    maxDurationSec: 10.0,
    autoReturnToIdle: true,
    priority: 6,
    description: 'Kedua tangan memegang mushaf suci, khusyuk dan khidmat menyimak tilawah.'
  },
  butterfly: {
    state: 'butterfly',
    label: 'Bermain Kupu-Kupu',
    mappedClip: 'butterfly',
    defaultPose: 'butterfly',
    defaultExpression: 'laugh',
    defaultEmotion: 'happy',
    minDurationSec: 4.0,
    maxDurationSec: 7.0,
    autoReturnToIdle: true,
    priority: 5,
    description: 'Ceria memandang kupu-kupu warna-warni yang terbang di taman sekolah.'
  },
  celebrate: {
    state: 'celebrate',
    label: 'Apresiasi & Prestasi',
    mappedClip: 'celebrate',
    defaultPose: 'thumbs-up',
    defaultExpression: 'happy',
    defaultEmotion: 'happy',
    minDurationSec: 3.5,
    maxDurationSec: 5.0,
    autoReturnToIdle: true,
    priority: 7,
    description: 'Mengangkat jempol mungil memberikan apresiasi keberhasilan santri.'
  },
  sit_rest: {
    state: 'sit_rest',
    label: 'Duduk & Rehat Santai',
    mappedClip: 'sitSwing',
    defaultPose: 'swing-feet',
    defaultExpression: 'idle',
    defaultEmotion: 'calm',
    minDurationSec: 6.0,
    maxDurationSec: 15.0,
    autoReturnToIdle: true,
    priority: 3,
    description: 'Duduk santai di atas kartu sambil mengayunkan kaki dengan riang.'
  },
  transition: {
    state: 'transition',
    label: 'Transisi Aksi',
    mappedClip: 'idle',
    defaultPose: 'idle-stand',
    defaultExpression: 'idle',
    defaultEmotion: 'calm',
    minDurationSec: 0.2,
    maxDurationSec: 0.4,
    autoReturnToIdle: false,
    priority: 0,
    description: 'Jeda halus antaraksi dengan anticipatory settle.'
  }
};

export interface BehaviorTelemetry {
  characterId: CharacterId;
  currentState: LivingBehaviorState;
  previousState: LivingBehaviorState;
  nextCandidate: LivingBehaviorState;
  candidateScores: Record<LivingBehaviorState, number>;
  transitionReason: string;
  stateDurationSec: number;
  currentEmotion: MasterEmotionType;
  currentSchoolPeriod: SchoolPeriodDefinition;
  microBehavior: MicroBehaviorSnapshot;
  emotionSnapshot: EmotionSnapshot;
  behaviorFPS: number;
  uptimeSec: number;
  totalTransitions: number;
  isAutomatic: boolean;
  updatedAt: number;
}

export type BehaviorListener = (telemetry: BehaviorTelemetry) => void;

export class LivingBehaviorEngine {
  private characterId: CharacterId = 'ASY';
  private currentState: LivingBehaviorState = 'idle';
  private previousState: LivingBehaviorState = 'idle';
  private targetState: LivingBehaviorState = 'idle';
  private stateStartedAt: number = Date.now();
  private stateDurationSec: number = 0;
  private transitionReason: string = 'Inisialisasi sistem (Cold Boot)';
  private totalTransitions: number = 0;
  private isAutomatic: boolean = true;
  private startTime: number = Date.now();

  // Engine adapters
  private schoolAdapter: SchoolTimeAdapter;
  private contextAdapter: BehaviorContextAdapter;
  private emotionController: EmotionController;
  private microSystem: MicroBehaviorSystem;

  // Performance tracking
  private lastFrameTimestamp: number = Date.now();
  private frameCount: number = 0;
  private fpsAccumulator: number = 0;
  private currentFPS: number = 60;
  private animFrameId: number | null = null;
  private listeners: Set<BehaviorListener> = new Set();

  constructor(
    schoolAdapter?: SchoolTimeAdapter,
    contextAdapter?: BehaviorContextAdapter,
    emotionController?: EmotionController,
    microSystem?: MicroBehaviorSystem
  ) {
    this.schoolAdapter = schoolAdapter || defaultSchoolTimeAdapter;
    this.contextAdapter = contextAdapter || defaultBehaviorContextAdapter;
    this.emotionController = emotionController || defaultEmotionController;
    this.microSystem = microSystem || defaultMicroBehaviorSystem;

    this.startEngine();
  }

  public setCharacter(char: CharacterId): void {
    this.characterId = char;
  }

  public getCharacter(): CharacterId {
    return this.characterId;
  }

  public setAutomatic(enabled: boolean): void {
    this.isAutomatic = enabled;
  }

  public getIsAutomatic(): boolean {
    return this.isAutomatic;
  }

  public triggerState(
    newState: LivingBehaviorState,
    reason: string = 'Manual trigger',
    forcedEmotion?: MasterEmotionType
  ): void {
    if (this.currentState === newState && newState !== 'transition') return;

    this.microSystem.triggerAnticipation();
    this.previousState = this.currentState;
    this.currentState = newState;
    this.stateStartedAt = Date.now();
    this.stateDurationSec = 0;
    this.transitionReason = reason;
    this.totalTransitions++;

    const config = BEHAVIOR_STATE_CONFIGS[newState];
    const targetEmotion = forcedEmotion || config.defaultEmotion;
    this.emotionController.setEmotion(targetEmotion);

    this.notifyListeners();
  }

  /**
   * Evaluate next behavioral candidate based on probabilistic score matrix
   */
  public evaluateCandidates(): {
    bestCandidate: LivingBehaviorState;
    scores: Record<LivingBehaviorState, number>;
  } {
    const scores: Record<LivingBehaviorState, number> = {
      idle: 10,
      greet: 0,
      observe: 0,
      read_iqro: 0,
      butterfly: 0,
      celebrate: 0,
      sit_rest: 0,
      transition: 0
    };

    // 1. School Schedule Influence
    const currentPeriod = this.schoolAdapter.getCurrentPeriod();
    if (currentPeriod.preferredState in scores) {
      scores[currentPeriod.preferredState as LivingBehaviorState] += 25;
    }

    // 2. Route Context Influence
    const activeRouteSignal = this.contextAdapter.setRoute(this.contextAdapter.getActiveTab());
    if (activeRouteSignal.suggestedState in scores) {
      scores[activeRouteSignal.suggestedState as LivingBehaviorState] += activeRouteSignal.priority * 3;
    }

    // 3. User Idle Signal Influence
    const idleSignal = this.contextAdapter.checkIdleSignal();
    if (idleSignal && idleSignal.suggestedState in scores) {
      scores[idleSignal.suggestedState as LivingBehaviorState] += idleSignal.priority * 4;
    }

    // 4. Variety bias (reduce score for current state to encourage dynamic life)
    scores[this.currentState] -= 15;

    // Pick candidate with highest score
    let bestCandidate: LivingBehaviorState = 'idle';
    let maxScore = -999;

    (Object.keys(scores) as LivingBehaviorState[]).forEach(state => {
      if (state === 'transition') return;
      if (scores[state] > maxScore) {
        maxScore = scores[state];
        bestCandidate = state;
      }
    });

    return { bestCandidate, scores };
  }

  private startEngine(): void {
    this.microSystem.start();

    const loop = () => {
      const now = Date.now();
      const delta = (now - this.lastFrameTimestamp) / 1000;
      this.lastFrameTimestamp = now;

      // Update FPS calculation
      this.frameCount++;
      this.fpsAccumulator += delta;
      if (this.fpsAccumulator >= 0.5) {
        this.currentFPS = Math.round(this.frameCount / this.fpsAccumulator);
        this.frameCount = 0;
        this.fpsAccumulator = 0;
      }

      // Update Sub-systems
      this.microSystem.update(delta);
      this.emotionController.update(delta);

      // Manage auto state decay & transitions
      this.stateDurationSec = (now - this.stateStartedAt) / 1000;
      const currentConfig = BEHAVIOR_STATE_CONFIGS[this.currentState];

      if (this.isAutomatic && this.currentState !== 'transition') {
        if (currentConfig.autoReturnToIdle && this.stateDurationSec >= currentConfig.maxDurationSec) {
          const { bestCandidate } = this.evaluateCandidates();
          this.triggerState(bestCandidate, `Selesai siklus aksi (${currentConfig.label})`);
        } else if (this.currentState === 'idle' && this.stateDurationSec >= currentConfig.maxDurationSec) {
          const { bestCandidate } = this.evaluateCandidates();
          if (bestCandidate !== 'idle') {
            this.triggerState(bestCandidate, `Inisiatif spontan santri (${BEHAVIOR_STATE_CONFIGS[bestCandidate].label})`);
          } else {
            // Reset idle timer with small observe exploration
            this.triggerState('observe', 'Melihat sekeliling ruangan belajar santri');
          }
        }
      }

      this.notifyListeners();

      if (typeof window !== 'undefined') {
        this.animFrameId = requestAnimationFrame(loop);
      }
    };

    if (typeof window !== 'undefined') {
      this.animFrameId = requestAnimationFrame(loop);
    }
  }

  public stopEngine(): void {
    if (this.animFrameId !== null && typeof window !== 'undefined') {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.microSystem.stop();
  }

  public getTelemetry(): BehaviorTelemetry {
    const { bestCandidate, scores } = this.evaluateCandidates();
    const period = this.schoolAdapter.getCurrentPeriod();

    return {
      characterId: this.characterId,
      currentState: this.currentState,
      previousState: this.previousState,
      nextCandidate: bestCandidate,
      candidateScores: scores,
      transitionReason: this.transitionReason,
      stateDurationSec: Math.round(this.stateDurationSec * 10) / 10,
      currentEmotion: this.emotionController.getEmotion(),
      currentSchoolPeriod: period,
      microBehavior: this.microSystem.getSnapshot(),
      emotionSnapshot: this.emotionController.getSnapshot(),
      behaviorFPS: this.currentFPS,
      uptimeSec: Math.round((Date.now() - this.startTime) / 1000),
      totalTransitions: this.totalTransitions,
      isAutomatic: this.isAutomatic,
      updatedAt: Date.now()
    };
  }

  public subscribe(listener: BehaviorListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const telemetry = this.getTelemetry();
    this.listeners.forEach(l => {
      try { l(telemetry); } catch (e) { console.error('BehaviorListener error:', e); }
    });
  }
}

export const defaultLivingBehaviorEngine = new LivingBehaviorEngine();
