/**
 * TADE RC100 — R826
 * Studio Suara Asy (Global Voice Identity Studio)
 * 
 * Pengaturan Identitas Suara Global Khusus Super Admin:
 * - Karakter: Asy (Peci) / Syifa (Hijab)
 * - Umur Suara: 4 tahun, 6 tahun, 8 tahun, 10 tahun, 12 tahun
 * - Gaya Suara: Imut, Ceria, Manja, Lembut, Pendamping
 */

export type VoiceCharacter = 'ASY' | 'SYIFA';
export type VoiceAgeGroup = '4_TAHUN' | '6_TAHUN' | '8_TAHUN' | '10_TAHUN' | '12_TAHUN';
export type VoiceStyle = 'IMUT' | 'CERIA' | 'MANJA' | 'LEMBUT' | 'PENDAMPING';

export interface VoiceIdentityConfig {
  character: VoiceCharacter;
  age: VoiceAgeGroup;
  style: VoiceStyle;
  pitchMultiplier: number;
  rateMultiplier: number;
  volume: number;
  samplePhrases: string[];
  lastUpdated: string;
  updatedBy: string;
}

const STORAGE_KEY = 'tade_global_voice_identity_rc100';

export const DEFAULT_VOICE_CONFIG: VoiceIdentityConfig = {
  character: 'ASY',
  age: '6_TAHUN',
  style: 'CERIA',
  pitchMultiplier: 1.35,
  rateMultiplier: 1.05,
  volume: 1.0,
  samplePhrases: [
    'Assalamu’alaikum teman-teman santri TK Asy Syifa!',
    'Hari ini Asy siap menemani belajar dan menghafal surat pendek!',
    'Wah, foto kegiatannya bagus sekali! Ayo simpan ke album kelas ya!',
    'Bismillah, jangan lupa baca doa sebelum mulai berkegiatan ya!'
  ],
  lastUpdated: '2026-08-19T06:40:00Z',
  updatedBy: 'SUPER_ADMIN'
};

export class AsyVoiceIdentityStudio {
  private static instance: AsyVoiceIdentityStudio;
  private config: VoiceIdentityConfig;
  private listeners: Array<(config: VoiceIdentityConfig) => void> = [];

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): AsyVoiceIdentityStudio {
    if (!AsyVoiceIdentityStudio.instance) {
      AsyVoiceIdentityStudio.instance = new AsyVoiceIdentityStudio();
    }
    return AsyVoiceIdentityStudio.instance;
  }

  private loadConfig(): VoiceIdentityConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_VOICE_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Voice Identity: failed to parse local storage, using default', e);
    }
    return { ...DEFAULT_VOICE_CONFIG };
  }

  public getConfig(): VoiceIdentityConfig {
    return { ...this.config };
  }

  public updateGlobalIdentity(
    character: VoiceCharacter,
    age: VoiceAgeGroup,
    style: VoiceStyle,
    updatedBy: string = 'SUPER_ADMIN'
  ): VoiceIdentityConfig {
    const { pitch, rate } = this.calculatePitchAndRate(character, age, style);

    const newConfig: VoiceIdentityConfig = {
      ...this.config,
      character,
      age,
      style,
      pitchMultiplier: pitch,
      rateMultiplier: rate,
      lastUpdated: new Date().toISOString(),
      updatedBy
    };

    this.config = newConfig;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save voice config', e);
    }

    this.notifyListeners();
    return newConfig;
  }

  private calculatePitchAndRate(
    character: VoiceCharacter,
    age: VoiceAgeGroup,
    style: VoiceStyle
  ): { pitch: number; rate: number } {
    let basePitch = 1.0;
    let baseRate = 1.0;

    // Age calculation
    switch (age) {
      case '4_TAHUN':
        basePitch = 1.5;
        baseRate = 0.95;
        break;
      case '6_TAHUN':
        basePitch = 1.35;
        baseRate = 1.02;
        break;
      case '8_TAHUN':
        basePitch = 1.25;
        baseRate = 1.05;
        break;
      case '10_TAHUN':
        basePitch = 1.15;
        baseRate = 1.08;
        break;
      case '12_TAHUN':
        basePitch = 1.05;
        baseRate = 1.1;
        break;
    }

    // Character variance
    if (character === 'SYIFA') {
      basePitch += 0.08;
    }

    // Style adjustments
    switch (style) {
      case 'IMUT':
        basePitch += 0.12;
        baseRate *= 0.98;
        break;
      case 'CERIA':
        basePitch += 0.08;
        baseRate *= 1.08;
        break;
      case 'MANJA':
        basePitch += 0.15;
        baseRate *= 0.92;
        break;
      case 'LEMBUT':
        basePitch -= 0.05;
        baseRate *= 0.95;
        break;
      case 'PENDAMPING':
        basePitch -= 0.02;
        baseRate *= 1.0;
        break;
    }

    return {
      pitch: Math.min(2.0, Math.max(0.6, parseFloat(basePitch.toFixed(2)))),
      rate: Math.min(1.8, Math.max(0.7, parseFloat(baseRate.toFixed(2))))
    };
  }

  public previewVoice(phraseIndex: number = 0): Promise<boolean> {
    return new Promise((resolve) => {
      const phrase = this.config.samplePhrases[phraseIndex] || this.config.samplePhrases[0];

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any pending speech

        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'id-ID';
        utterance.pitch = this.config.pitchMultiplier;
        utterance.rate = this.config.rateMultiplier;
        utterance.volume = this.config.volume;

        // Try to pick an Indonesian voice if available
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
        if (idVoice) {
          utterance.voice = idVoice;
        }

        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(false);

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback for environments without speech synthesis
        console.log(`[Voice Preview Mock] ${phrase} (Pitch: ${this.config.pitchMultiplier}, Rate: ${this.config.rateMultiplier})`);
        resolve(true);
      }
    });
  }

  public subscribe(listener: (config: VoiceIdentityConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn(this.config));
  }
}
