/**
 * TADE RC97 — R791: Emotional State Engine (WIDGET / PREVIEW SCOPED)
 * Mesin emosi deterministik berbasis konteks UI untuk Maskot Asy
 * Bebas AI generatif - 100% aman, deterministik, dan kontekstual
 * 
 * ARCHITECTURAL BOUNDARY:
 * - Scoped to Asy Dock Widget & RC97 preview suites.
 * - Global character behavior and macro state transitions are arbitrated by `CharacterBehaviorOrchestrator`.
 */

export type AsyEmotionType =
  | 'HAPPY'
  | 'CURIOUS'
  | 'THINKING'
  | 'PROUD'
  | 'SHY'
  | 'SLEEPY'
  | 'PRAYING';

export interface EmotionState {
  currentEmotion: AsyEmotionType;
  intensity: number; // 0.0 to 1.0
  sourceTrigger: string;
  timestamp: number;
  durationMs: number;
  decayTo: AsyEmotionType;
  expressionName: string;
  eyeState: 'OPEN_CHEERFUL' | 'WINK' | 'CLOSED_HAPPY' | 'THINKING_UP' | 'SHY_DOWN' | 'SLEEPY_HALF' | 'CLOSED_PRAYING';
  blushLevel: number; // 0 (none) to 1 (full blush)
}

export interface EmotionHistoryEntry {
  id: string;
  emotion: AsyEmotionType;
  trigger: string;
  timestamp: string;
  intensity: number;
}

type EmotionListener = (state: EmotionState) => void;

export class EmotionalStateEngine {
  private static instance: EmotionalStateEngine;
  private currentState: EmotionState;
  private listeners: Set<EmotionListener> = new Set();
  private history: EmotionHistoryEntry[] = [];
  private decayTimeout: any = null;

  private constructor() {
    this.currentState = {
      currentEmotion: 'HAPPY',
      intensity: 0.8,
      sourceTrigger: 'INITIAL_BOOT',
      timestamp: Date.now(),
      durationMs: 15000,
      decayTo: 'HAPPY',
      expressionName: 'Senyum Ceria',
      eyeState: 'OPEN_CHEERFUL',
      blushLevel: 0.2
    };
  }

  public static getInstance(): EmotionalStateEngine {
    if (!EmotionalStateEngine.instance) {
      EmotionalStateEngine.instance = new EmotionalStateEngine();
    }
    return EmotionalStateEngine.instance;
  }

  public getState(): EmotionState {
    return { ...this.currentState };
  }

  public getHistory(): EmotionHistoryEntry[] {
    return [...this.history];
  }

  public subscribe(listener: EmotionListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  public setEmotion(
    emotion: AsyEmotionType,
    triggerSource: string,
    options?: {
      intensity?: number;
      durationMs?: number;
      decayTo?: AsyEmotionType;
    }
  ): void {
    if (this.decayTimeout) {
      clearTimeout(this.decayTimeout);
      this.decayTimeout = null;
    }

    const intensity = options?.intensity ?? 0.85;
    const durationMs = options?.durationMs ?? 8000;
    const decayTo = options?.decayTo ?? 'HAPPY';

    let eyeState: EmotionState['eyeState'] = 'OPEN_CHEERFUL';
    let blushLevel = 0.2;
    let expressionName = 'Senyum Ceria';

    switch (emotion) {
      case 'HAPPY':
        eyeState = 'OPEN_CHEERFUL';
        blushLevel = 0.3;
        expressionName = 'Bahagia & Ceria';
        break;
      case 'CURIOUS':
        eyeState = 'THINKING_UP';
        blushLevel = 0.1;
        expressionName = 'Penasaran & Tertarik';
        break;
      case 'THINKING':
        eyeState = 'THINKING_UP';
        blushLevel = 0.1;
        expressionName = 'Sedang Memikirkan';
        break;
      case 'PROUD':
        eyeState = 'CLOSED_HAPPY';
        blushLevel = 0.4;
        expressionName = 'Bangga & Bersemangat';
        break;
      case 'SHY':
        eyeState = 'SHY_DOWN';
        blushLevel = 0.8;
        expressionName = 'Malu-Malu Manis';
        break;
      case 'SLEEPY':
        eyeState = 'SLEEPY_HALF';
        blushLevel = 0.1;
        expressionName = 'Mengantuk Tenang';
        break;
      case 'PRAYING':
        eyeState = 'CLOSED_PRAYING';
        blushLevel = 0.2;
        expressionName = 'Khusyuk Berdoa';
        break;
    }

    this.currentState = {
      currentEmotion: emotion,
      intensity,
      sourceTrigger: triggerSource,
      timestamp: Date.now(),
      durationMs,
      decayTo,
      expressionName,
      eyeState,
      blushLevel
    };

    // Record history (max 30 entries)
    this.history.unshift({
      id: `EMO-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      emotion,
      trigger: triggerSource,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      intensity
    });
    if (this.history.length > 30) this.history.pop();

    this.notify();

    // Auto-decay if duration specified
    if (durationMs > 0 && emotion !== decayTo) {
      this.decayTimeout = setTimeout(() => {
        this.setEmotion(decayTo, 'AUTO_DECAY', { durationMs: 0 });
      }, durationMs);
    }
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('[EmotionalStateEngine] Listener notification error:', err);
      }
    });
  }
}
