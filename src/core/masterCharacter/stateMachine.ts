/**
 * TADE v9.2.0-MCA2 — R923
 * MASTER CHARACTER STATE MACHINE
 * 
 * Manages character animation states, transitions, blend weights,
 * and auto-reset mechanisms for Asy & Syifa.
 * 
 * Mandatory States:
 * - idle
 * - wave
 * - point
 * - readIqro
 * - butterfly
 * - confused
 * - shy
 * - sleepy
 * - celebrate
 */

import { CharacterId, MasterExpressionKey, MasterPoseKey } from './masterCharacterRegistry';

export type CharacterState = 
  | 'idle'
  | 'wave'
  | 'point'
  | 'readIqro'
  | 'butterfly'
  | 'confused'
  | 'shy'
  | 'sleepy'
  | 'celebrate';

export interface StateConfig {
  state: CharacterState;
  label: string;
  description: string;
  defaultPose: MasterPoseKey;
  defaultExpression: MasterExpressionKey;
  autoResetDurationMs?: number; // auto return to idle if set
  transitionDurationMs: number;
  priority: number; // higher priority interrupts lower
}

export interface StateMachineSnapshot {
  characterId: CharacterId;
  currentState: CharacterState;
  previousState: CharacterState;
  transitionProgress: number; // 0.0 to 1.0 blend weight
  isTransitioning: boolean;
  pose: MasterPoseKey;
  expression: MasterExpressionKey;
  stateStartedAt: number;
  updatedAt: number;
}

export const CHARACTER_STATE_CONFIGS: Record<CharacterState, StateConfig> = {
  idle: {
    state: 'idle',
    label: 'Tenang & Siaga',
    description: 'Pose santun bersahabat siap mendampingi aktivitas santri & guru.',
    defaultPose: 'idle-stand',
    defaultExpression: 'idle',
    transitionDurationMs: 250,
    priority: 0
  },
  wave: {
    state: 'wave',
    label: 'Melambaikan Salam',
    description: 'Menyapa hangat dengan senyum ramah islami (Assalamu\'alaikum).',
    defaultPose: 'wave',
    defaultExpression: 'happy',
    autoResetDurationMs: 3200,
    transitionDurationMs: 200,
    priority: 1
  },
  point: {
    state: 'point',
    label: 'Menunjuk Panduan',
    description: 'Mengarahkan pandangan pengguna ke tombol penting atau formulir PPDB.',
    defaultPose: 'point',
    defaultExpression: 'happy',
    autoResetDurationMs: 3800,
    transitionDurationMs: 200,
    priority: 1
  },
  readIqro: {
    state: 'readIqro',
    label: 'Membaca Iqro/Al-Qur\'an',
    description: 'Kedua tangan memegang mushaf suci, khusyuk menyimak tilawah.',
    defaultPose: 'read-iqro',
    defaultExpression: 'reading',
    autoResetDurationMs: 5000,
    transitionDurationMs: 300,
    priority: 2
  },
  butterfly: {
    state: 'butterfly',
    label: 'Bermain Kupu-kupu',
    description: 'Ceria memandang kupu-kupu warna-warni di taman galeri sekolah.',
    defaultPose: 'butterfly',
    defaultExpression: 'laugh',
    autoResetDurationMs: 4500,
    transitionDurationMs: 250,
    priority: 1
  },
  confused: {
    state: 'confused',
    label: 'Bingung & Menganalisis',
    description: 'Kepala miring sedikit, berusaha memahami kendala teknis atau pertanyaan.',
    defaultPose: 'idle-stand',
    defaultExpression: 'confused',
    autoResetDurationMs: 3500,
    transitionDurationMs: 200,
    priority: 2
  },
  shy: {
    state: 'shy',
    label: 'Malu-Malu Santun',
    description: 'Pipi merona merah muda saat dipuji atau diajak berfoto.',
    defaultPose: 'hijab-hold',
    defaultExpression: 'shy',
    autoResetDurationMs: 3000,
    transitionDurationMs: 200,
    priority: 1
  },
  sleepy: {
    state: 'sleepy',
    label: 'Mengantuk Tenang',
    description: 'Mata sayu perlahan saat sistem sedang standby lama atau malam hari.',
    defaultPose: 'swing-feet',
    defaultExpression: 'sleepy',
    autoResetDurationMs: 6000,
    transitionDurationMs: 400,
    priority: 1
  },
  celebrate: {
    state: 'celebrate',
    label: 'Merayakan Prestasi',
    description: 'Melompat riang bersyukur atas capaian hafalan santri atau target tercapai.',
    defaultPose: 'thumbs-up',
    defaultExpression: 'laugh',
    autoResetDurationMs: 3500,
    transitionDurationMs: 180,
    priority: 3
  }
};

export type StateListener = (snapshot: StateMachineSnapshot) => void;

export class CharacterStateMachine {
  private characterId: CharacterId;
  private currentState: CharacterState = 'idle';
  private previousState: CharacterState = 'idle';
  private transitionProgress: number = 1.0;
  private isTransitioning: boolean = false;
  private stateStartedAt: number = Date.now();
  private autoResetTimer: any = null;
  private transitionRafId: number | null = null;
  private listeners: Set<StateListener> = new Set();

  constructor(initialCharacter: CharacterId = 'ASY') {
    this.characterId = initialCharacter;
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

  public getCurrentState(): CharacterState {
    return this.currentState;
  }

  public getStateConfig(state: CharacterState = this.currentState): StateConfig {
    return CHARACTER_STATE_CONFIGS[state] || CHARACTER_STATE_CONFIGS.idle;
  }

  public transitionTo(
    nextState: CharacterState,
    customDurationMs?: number,
    force: boolean = false
  ): boolean {
    if (this.currentState === nextState && !force) {
      return false;
    }

    const currentConfig = this.getStateConfig(this.currentState);
    const nextConfig = this.getStateConfig(nextState);

    // Prevent lower priority interrupting higher unless forced or target is idle
    if (!force && nextState !== 'idle' && nextConfig.priority < currentConfig.priority) {
      return false;
    }

    // Clear active timers
    if (this.autoResetTimer) {
      clearTimeout(this.autoResetTimer);
      this.autoResetTimer = null;
    }

    this.previousState = this.currentState;
    this.currentState = nextState;
    this.stateStartedAt = Date.now();
    this.isTransitioning = true;
    this.transitionProgress = 0;

    const duration = customDurationMs ?? nextConfig.transitionDurationMs;
    this.animateTransition(duration);

    // Setup auto-reset if configured and not idle
    const autoReset = nextConfig.autoResetDurationMs;
    if (autoReset && nextState !== 'idle') {
      this.autoResetTimer = setTimeout(() => {
        this.transitionTo('idle');
      }, autoReset);
    }

    this.notifyListeners();
    return true;
  }

  public resetToIdle(): void {
    this.transitionTo('idle', 250, true);
  }

  public trigger(event: string, payload?: any): boolean {
    switch (event) {
      case 'TRIGGER_TAP':
      case 'TAP':
        return this.transitionTo('celebrate');
      case 'TRIGGER_WAVE':
      case 'WAVE':
        return this.transitionTo('wave');
      case 'TRIGGER_POINT':
      case 'POINT':
        return this.transitionTo('point');
      case 'TRIGGER_READ_IQRO':
      case 'READ_IQRO':
        return this.transitionTo('readIqro');
      case 'TRIGGER_BUTTERFLY':
      case 'BUTTERFLY':
        return this.transitionTo('butterfly');
      case 'TRIGGER_CONFUSED':
      case 'CONFUSED':
        return this.transitionTo('confused');
      case 'TRIGGER_SHY':
      case 'SHY':
        return this.transitionTo('shy');
      case 'TRIGGER_SLEEPY':
      case 'SLEEPY':
        return this.transitionTo('sleepy');
      case 'TRIGGER_CELEBRATE':
      case 'CELEBRATE':
        return this.transitionTo('celebrate');
      case 'TRIGGER_IDLE':
      case 'IDLE':
        return this.transitionTo('idle');
      default:
        return false;
    }
  }

  private animateTransition(durationMs: number): void {
    if (durationMs <= 0) {
      this.transitionProgress = 1.0;
      this.isTransitioning = false;
      this.notifyListeners();
      return;
    }

    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1.0, elapsed / durationMs);
      
      // Smooth cubic ease out
      this.transitionProgress = 1 - Math.pow(1 - progress, 3);

      if (progress < 1.0) {
        this.transitionRafId = requestAnimationFrame(step);
      } else {
        this.transitionProgress = 1.0;
        this.isTransitioning = false;
        this.transitionRafId = null;
      }

      this.notifyListeners();
    };

    this.transitionRafId = requestAnimationFrame(step);
  }

  public getSnapshot(): StateMachineSnapshot {
    const config = this.getStateConfig(this.currentState);
    return {
      characterId: this.characterId,
      currentState: this.currentState,
      previousState: this.previousState,
      transitionProgress: this.transitionProgress,
      isTransitioning: this.isTransitioning,
      pose: config.defaultPose,
      expression: config.defaultExpression,
      stateStartedAt: this.stateStartedAt,
      updatedAt: Date.now()
    };
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach(listener => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('[CharacterStateMachine] Listener error:', err);
      }
    });
  }

  public destroy(): void {
    if (this.autoResetTimer) {
      clearTimeout(this.autoResetTimer);
      this.autoResetTimer = null;
    }
    if (this.transitionRafId !== null) {
      cancelAnimationFrame(this.transitionRafId);
      this.transitionRafId = null;
    }
    this.listeners.clear();
  }
}

export const defaultStateMachine = new CharacterStateMachine();
