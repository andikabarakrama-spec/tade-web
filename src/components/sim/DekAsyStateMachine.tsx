export type MascotState =
  | 'IDLE'
  | 'BREATHING'
  | 'GREETING'
  | 'POINTING'
  | 'APPLAUDING'
  | 'NODDING'
  | 'PRAYING'
  | 'CELEBRATING'
  | 'STUDYING'
  | 'LISTENING'
  | 'SLEEPING';

export type MascotEmotion =
  | 'CERIA'
  | 'ANTUSIAS'
  | 'KHUSYUK'
  | 'BANGGA'
  | 'PEDULI'
  | 'HORMAT'
  | 'FOKUS';

export type MascotCostume =
  | 'SERAGAM_BATIK_SENTRA'
  | 'BAJU_KOKO_IMTAQ'
  | 'GAMIS_SYARI'
  | 'KOSTUM_WISUDA_HAFLAH'
  | 'SERAGAM_OLAHRAGA'
  | 'JAS_EKSEKUTIF_CILIK';

export interface StateTransitionEvent {
  from: MascotState;
  to: MascotState;
  trigger: string;
  timestamp: number;
}

export class MascotStateMachine {
  private currentState: MascotState = 'IDLE';
  private currentEmotion: MascotEmotion = 'CERIA';
  private currentCostume: MascotCostume = 'SERAGAM_BATIK_SENTRA';
  private characterGender: 'boy' | 'girl' = 'boy'; // 'boy' = Dek Asy, 'girl' = Dek Asyah
  private listeners: ((state: MascotState, emotion: MascotEmotion) => void)[] = [];
  private history: StateTransitionEvent[] = [];

  constructor(initialState: MascotState = 'IDLE', initialEmotion: MascotEmotion = 'CERIA') {
    this.currentState = initialState;
    this.currentEmotion = initialEmotion;
  }

  public getState(): MascotState {
    return this.currentState;
  }

  public getEmotion(): MascotEmotion {
    return this.currentEmotion;
  }

  public getCostume(): MascotCostume {
    return this.currentCostume;
  }

  public getGender(): 'boy' | 'girl' {
    return this.characterGender;
  }

  public setGender(gender: 'boy' | 'girl'): void {
    this.characterGender = gender;
    if (gender === 'girl' && this.currentCostume === 'BAJU_KOKO_IMTAQ') {
      this.currentCostume = 'GAMIS_SYARI';
    } else if (gender === 'boy' && this.currentCostume === 'GAMIS_SYARI') {
      this.currentCostume = 'BAJU_KOKO_IMTAQ';
    }
    this.notify();
  }

  public setCostume(costume: MascotCostume): void {
    this.currentCostume = costume;
    this.notify();
  }

  public transitionTo(nextState: MascotState, trigger: string = 'USER_INTERACTION', emotion?: MascotEmotion): void {
    if (this.currentState === nextState && (!emotion || this.currentEmotion === emotion)) {
      return;
    }

    const event: StateTransitionEvent = {
      from: this.currentState,
      to: nextState,
      trigger,
      timestamp: Date.now()
    };

    this.history.unshift(event);
    if (this.history.length > 20) {
      this.history.pop();
    }

    this.currentState = nextState;
    if (emotion) {
      this.currentEmotion = emotion;
    }
    this.notify();
  }

  public subscribe(listener: (state: MascotState, emotion: MascotEmotion) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.currentState, this.currentEmotion));
  }

  public getHistory(): StateTransitionEvent[] {
    return [...this.history];
  }
}
