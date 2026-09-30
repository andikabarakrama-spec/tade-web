/**
 * TADE PUSAT ASET — SOUNDSCAPE ENGINE (SPRINT G13)
 * Pure Web Audio API Synthesizer & Harmonic Soundscapes.
 * 100% Offline-Ready • Zero External File Dependencies • Peaceful & Focused.
 * Provides: Burung, Angin, Air, Bunyi Lembut, Suasana Taman.
 */

export type TadeSoundType = 'BURUNG' | 'ANGIN' | 'AIR' | 'BUNYI_LEMBUT' | 'SUASANA_TAMAN';

export interface SoundPreset {
  id: TadeSoundType;
  title: string;
  subtitle: string;
  description: string;
  durationLabel: string;
  tags: string[];
  iconName: string;
  color: string;
}

export const TADE_SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'BURUNG',
    title: 'Kicauan Burung Pagi',
    subtitle: 'Kicau merdu alami di dahan pohon sekolah',
    description: 'Sintesis frekuensi harmonik menyerupai kicauan burung pagi yang ceria dan menyejukkan hati.',
    durationLabel: 'Loop Tak Terbatas',
    tags: ['Alam', 'Fokus', 'Pagi', 'Menenangkan'],
    iconName: 'Bird',
    color: 'emerald'
  },
  {
    id: 'ANGIN',
    title: 'Semilir Angin Kebun',
    subtitle: 'Hembusan angin sejuk melewati dedaunan',
    description: 'Derau merah muda terfilter dengan sapuan resonansi halus menyerupai angin pegunungan Tanggul.',
    durationLabel: 'Loop Tak Terbatas',
    tags: ['Relaksasi', 'Alam', 'Sejuk', 'Konsentrasi'],
    iconName: 'Wind',
    color: 'teal'
  },
  {
    id: 'AIR',
    title: 'Gemericik Air Kolam',
    subtitle: 'Aliran air jernih membasuh bebatuan',
    description: 'Generator tetesan dan gelembung air harmonik berfrekuensi dinamis yang memberi rasa tentram.',
    durationLabel: 'Loop Tak Terbatas',
    tags: ['Air', 'Wudhu', 'Tenang', 'Jernih'],
    iconName: 'Droplets',
    color: 'cyan'
  },
  {
    id: 'BUNYI_LEMBUT',
    title: 'Dentang Kristal Lembut',
    subtitle: 'Nada kristal resonansi 432 Hz',
    description: 'Chime kristal lembut bernada 432 Hz dengan peluruhan harmonik hangat, ideal saat transisi sentra.',
    durationLabel: 'Melodi Berulang (10s)',
    tags: ['Transisi Sentra', 'Doa', 'Kristal', 'Meditatif'],
    iconName: 'Bell',
    color: 'amber'
  },
  {
    id: 'SUASANA_TAMAN',
    title: 'Harmoni Taman Asy-Syifa',
    subtitle: 'Perpaduan angin semilir, gemericik air, dan burung',
    description: 'Komposisi ambient holistik menggabungkan semilir angin, air mengalir, dan kicauan burung lembut.',
    durationLabel: 'Komposisi Multi-Layer',
    tags: ['Holistik', 'Sentra Alam', 'Taman Belajar', 'Utama'],
    iconName: 'Trees',
    color: 'emerald'
  }
];

class TadeSoundEngine {
  private static instance: TadeSoundEngine | null = null;
  private audioCtx: AudioContext | null = null;
  private activeSound: TadeSoundType | null = null;
  private masterGain: GainNode | null = null;
  private currentVolume: number = 0.5; // 0.0 to 1.0
  private intervalIds: number[] = [];
  private audioNodes: (AudioNode | AudioScheduledSourceNode)[] = [];
  private isMuted: boolean = false;
  private listeners: ((activeSound: TadeSoundType | null, isPlaying: boolean, volume: number) => void)[] = [];
  private sleepTimerTimeoutId: number | null = null;

  public static getInstance(): TadeSoundEngine {
    if (!TadeSoundEngine.instance) {
      TadeSoundEngine.instance = new TadeSoundEngine();
    }
    return TadeSoundEngine.instance;
  }

  private initContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public subscribe(listener: (activeSound: TadeSoundType | null, isPlaying: boolean, volume: number) => void): () => void {
    this.listeners.push(listener);
    listener(this.activeSound, this.activeSound !== null, this.currentVolume);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const isPlaying = this.activeSound !== null;
    this.listeners.forEach(fn => fn(this.activeSound, isPlaying, this.currentVolume));
  }

  public getActiveSound(): TadeSoundType | null {
    return this.activeSound;
  }

  public isPlaying(): boolean {
    return this.activeSound !== null;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public setVolume(vol: number): void {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.currentVolume, this.audioCtx.currentTime, 0.05);
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.currentVolume, this.audioCtx.currentTime, 0.05);
    }
    this.notify();
    return this.isMuted;
  }

  public stop(): void {
    this.intervalIds.forEach(id => window.clearInterval(id));
    this.intervalIds = [];

    this.audioNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Ignored
      }
    });
    this.audioNodes = [];

    if (this.sleepTimerTimeoutId) {
      window.clearTimeout(this.sleepTimerTimeoutId);
      this.sleepTimerTimeoutId = null;
    }

    this.activeSound = null;
    this.notify();
  }

  public setSleepTimer(minutes: number): void {
    if (this.sleepTimerTimeoutId) {
      window.clearTimeout(this.sleepTimerTimeoutId);
      this.sleepTimerTimeoutId = null;
    }
    if (minutes > 0) {
      this.sleepTimerTimeoutId = window.setTimeout(() => {
        this.stop();
      }, minutes * 60 * 1000);
    }
  }

  public play(type: TadeSoundType): void {
    if (this.activeSound === type) {
      this.stop();
      return;
    }

    this.stop();
    const ctx = this.initContext();
    this.activeSound = type;

    switch (type) {
      case 'BURUNG':
        this.synthesizeBirds(ctx);
        break;
      case 'ANGIN':
        this.synthesizeWind(ctx);
        break;
      case 'AIR':
        this.synthesizeWater(ctx);
        break;
      case 'BUNYI_LEMBUT':
        this.synthesizeChimes(ctx);
        break;
      case 'SUASANA_TAMAN':
        this.synthesizeGarden(ctx);
        break;
    }

    this.notify();
  }

  // --- 1. Synthesize Birds (Kicauan Burung) ---
  private synthesizeBirds(ctx: AudioContext): void {
    const playChirp = () => {
      if (this.activeSound !== 'BURUNG' && this.activeSound !== 'SUASANA_TAMAN') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = 3;

      osc.type = 'sine';
      const baseFreq = 1800 + Math.random() * 800;
      const now = ctx.currentTime;
      const duration = 0.08 + Math.random() * 0.15;

      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);

      // Random double chirp
      if (Math.random() > 0.4) {
        setTimeout(() => {
          if (this.activeSound !== 'BURUNG' && this.activeSound !== 'SUASANA_TAMAN') return;
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          const now2 = ctx.currentTime;
          const dur2 = 0.06 + Math.random() * 0.08;

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(baseFreq * 1.2, now2);
          osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now2 + dur2);

          gain2.gain.setValueAtTime(0.001, now2);
          gain2.gain.linearRampToValueAtTime(0.08, now2 + 0.015);
          gain2.gain.exponentialRampToValueAtTime(0.001, now2 + dur2);

          osc2.connect(filter);
          osc2.start(now2);
          osc2.stop(now2 + dur2 + 0.05);
        }, 120);
      }
    };

    // First initial chirp
    playChirp();
    const interval = window.setInterval(() => {
      if (Math.random() > 0.3) {
        playChirp();
      }
    }, 1400);

    this.intervalIds.push(interval);
  }

  // --- 2. Synthesize Wind (Semilir Angin) ---
  private synthesizeWind(ctx: AudioContext): void {
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    // Pink noise approximation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.04;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;
    filter.Q.value = 2.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);

    // LFO for slow atmospheric wind sweep
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12; // slow breath
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 220;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    whiteNoise.connect(filter);
    filter.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.audioNodes.push(whiteNoise, filter, gain, lfo, lfoGain);
  }

  // --- 3. Synthesize Water (Gemericik Air) ---
  private synthesizeWater(ctx: AudioContext): void {
    const playBubble = () => {
      if (this.activeSound !== 'AIR' && this.activeSound !== 'SUASANA_TAMAN') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      const duration = 0.04 + Math.random() * 0.06;
      const freq = 400 + Math.random() * 600;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    };

    // Constant background trickle stream
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.02;
    }

    const stream = ctx.createBufferSource();
    stream.buffer = noiseBuffer;
    stream.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 650;
    filter.Q.value = 1.2;

    const streamGain = ctx.createGain();
    streamGain.gain.setValueAtTime(0.12, ctx.currentTime);

    stream.connect(filter);
    filter.connect(streamGain);
    if (this.masterGain) streamGain.connect(this.masterGain);
    stream.start();

    this.audioNodes.push(stream, filter, streamGain);

    // Fast droplet triggers
    const interval = window.setInterval(() => {
      playBubble();
      if (Math.random() > 0.4) playBubble();
    }, 180);

    this.intervalIds.push(interval);
  }

  // --- 4. Synthesize Chimes (Dentang Kristal Lembut 432 Hz) ---
  private synthesizeChimes(ctx: AudioContext): void {
    const playBell = (freq: number, delayMs: number = 0) => {
      setTimeout(() => {
        if (this.activeSound !== 'BUNYI_LEMBUT') return;
        const now = ctx.currentTime;
        const duration = 4.5;

        // Fundamental
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        // Harmonic Overtone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2.76, now); // Metallic chime ratio

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        gain2.gain.setValueAtTime(0.001, now);
        gain2.gain.linearRampToValueAtTime(0.04, now + 0.015);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

        osc1.connect(gain1);
        osc2.connect(gain2);
        if (this.masterGain) {
          gain1.connect(this.masterGain);
          gain2.connect(this.masterGain);
        }

        osc1.start(now);
        osc1.stop(now + duration + 0.1);
        osc2.start(now);
        osc2.stop(now + duration + 0.1);
      }, delayMs);
    };

    // Initial sequence
    playBell(432, 0);
    playBell(540, 800);
    playBell(648, 1600);

    const interval = window.setInterval(() => {
      const notes = [432, 540, 648, 864, 576];
      const selected = notes[Math.floor(Math.random() * notes.length)];
      playBell(selected, 0);
      if (Math.random() > 0.5) {
        const selected2 = notes[Math.floor(Math.random() * notes.length)];
        playBell(selected2, 700);
      }
    }, 6000);

    this.intervalIds.push(interval);
  }

  // --- 5. Synthesize Garden (Suasana Taman Asy-Syifa) ---
  private synthesizeGarden(ctx: AudioContext): void {
    this.synthesizeWind(ctx);
    this.synthesizeWater(ctx);
    this.synthesizeBirds(ctx);
  }

  // --- 6. Quick Sound FX for TV Asy Syifa, Kereta Cerita, Dunia Hidup, Kampung Ceria & DNA Asy Syifa (Sprint G15–G20) ---
  public playFx(type: 'TV_CLICK' | 'TRAIN_CHIME' | 'MAGIC_SPARKLE' | 'POP_WAGON' | 'CELEBRATION' | 'CLOCK_CHIME' | 'GENTLE_WATER' | 'GOLDEN_DISCOVERY' | 'WEATHER_BREEZE' | 'PARADE_MARCH' | 'PLAYGROUND_SWING' | 'STICKER_UNLOCK' | 'MASJID_BELL_DOA' | 'TUT_TUT_KERETA' | 'PLING_BINTANG' | 'POP_BALON' | 'FLIP_BUKU' | 'TEPUK_TANGAN_KECIL'): void {
    try {
      const ctx = this.initContext();
      if (!ctx || this.isMuted) return;

      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.currentVolume * 0.4, now);
      gain.connect(ctx.destination);

      if (type === 'TUT_TUT_KERETA') {
        // P3: "Tut tut" Kereta Asy Syifa (2-burst cheerful train whistle)
        [0, 0.22].forEach((offset) => {
          [587.33, 739.99].forEach((freq) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'sine';
            const t = now + offset;
            osc.frequency.setValueAtTime(freq, t);
            oscGain.gain.setValueAtTime(0.001, t);
            oscGain.gain.linearRampToValueAtTime(0.2, t + 0.04);
            oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
            osc.connect(oscGain);
            oscGain.connect(gain);
            osc.start(t);
            osc.stop(t + 0.2);
          });
        });
      } else if (type === 'PLING_BINTANG') {
        // P3: "Pling" Bintang (High harmonic crystalline chime)
        [1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.05;
          osc.frequency.setValueAtTime(freq, t);
          oscGain.gain.setValueAtTime(0.001, t);
          oscGain.gain.linearRampToValueAtTime(0.25, t + 0.02);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.65);
        });
      } else if (type === 'POP_BALON') {
        // P3: "Pop" Balon (Soft, friendly balloon burst)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);
        oscGain.gain.setValueAtTime(0.35, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(oscGain);
        oscGain.connect(gain);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'FLIP_BUKU') {
        // P3: "Flip" Buku (Soft paper flutter sweep)
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.linearRampToValueAtTime(600, now + 0.15);
        filter.Q.setValueAtTime(2.0, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(gain);
        noise.start(now);
        noise.stop(now + 0.16);
      } else if (type === 'TEPUK_TANGAN_KECIL') {
        // P3: Tepuk tangan kecil (Sequence of 3 gentle claps)
        [0, 0.12, 0.24].forEach((offset) => {
          const t = now + offset;
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, t);
          osc.frequency.exponentialRampToValueAtTime(180, t + 0.06);
          oscGain.gain.setValueAtTime(0.2, t);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.08);
        });
      } else if (type === 'TV_CLICK') {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'TRAIN_CHIME') {
        // Double gentle whistle chord (F5 + A5)
        [698.46, 880].forEach(freq => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          oscGain.gain.setValueAtTime(0.001, now);
          oscGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(now);
          osc.stop(now + 0.65);
        });
      } else if (type === 'MAGIC_SPARKLE') {
        // Ascending sparkle arpeggio
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.08;
          osc.frequency.setValueAtTime(freq, t);
          oscGain.gain.setValueAtTime(0.001, t);
          oscGain.gain.linearRampToValueAtTime(0.25, t + 0.02);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.45);
        });
      } else if (type === 'POP_WAGON') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'CELEBRATION') {
        // Pentatonic celebration fanfare
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'triangle';
          const t = now + i * 0.1;
          osc.frequency.setValueAtTime(freq, t);
          oscGain.gain.setValueAtTime(0.01, t);
          oscGain.gain.linearRampToValueAtTime(0.2, t + 0.03);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.55);
        });
      } else if (type === 'CLOCK_CHIME') {
        // Double sweet grandfather clock chime (C5 -> G4)
        [523.25, 392.00].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.35;
          osc.frequency.setValueAtTime(freq, t);
          oscGain.gain.setValueAtTime(0.001, t);
          oscGain.gain.linearRampToValueAtTime(0.3, t + 0.03);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.85);
        });
      } else if (type === 'GENTLE_WATER') {
        // Soft bubble ripple
        [440, 587.33, 659.25].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.09;
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.3, t + 0.15);
          oscGain.gain.setValueAtTime(0.001, t);
          oscGain.gain.linearRampToValueAtTime(0.18, t + 0.02);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.22);
        });
      } else if (type === 'GOLDEN_DISCOVERY') {
        // Majestic harmonic shimmering gold arpeggio
        [440.00, 554.37, 659.25, 880.00, 1108.73, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.07;
          osc.frequency.setValueAtTime(freq, t);
          oscGain.gain.setValueAtTime(0.001, t);
          oscGain.gain.linearRampToValueAtTime(0.3, t + 0.02);
          oscGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.7);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.75);
        });
      } else if (type === 'WEATHER_BREEZE') {
        // Soft gentle wind frequency sweep
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(330, now + 0.4);
        osc.frequency.linearRampToValueAtTime(220, now + 0.8);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.85);
      } else if (type === 'PARADE_MARCH') {
        // Joyful march rhythm: C5 - E5 - G5 - C6
        [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'triangle';
          const t = now + i * 0.12;
          osc.frequency.setValueAtTime(freq, t);
          oscGain.gain.setValueAtTime(0.01, t);
          oscGain.gain.linearRampToValueAtTime(0.22, t + 0.02);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.25);
        });
      } else if (type === 'PLAYGROUND_SWING') {
        // Upward friendly glissando
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
        oscGain.gain.setValueAtTime(0.01, now);
        oscGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(oscGain);
        oscGain.connect(gain);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'STICKER_UNLOCK') {
        // Sparkling badge pop with high shimmer
        [659.25, 830.61, 987.77, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.06;
          osc.frequency.setValueAtTime(freq, t);
          oscGain.gain.setValueAtTime(0.001, t);
          oscGain.gain.linearRampToValueAtTime(0.25, t + 0.02);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 0.4);
        });
      } else if (type === 'MASJID_BELL_DOA') {
        // Serene deep resonant bell chime (D4 -> A4)
        [293.66, 440.00].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.4;
          osc.frequency.setValueAtTime(freq, t);
          oscGain.gain.setValueAtTime(0.001, t);
          oscGain.gain.linearRampToValueAtTime(0.3, t + 0.04);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
          osc.connect(oscGain);
          oscGain.connect(gain);
          osc.start(t);
          osc.stop(t + 1.25);
        });
      }
    } catch {
      // AudioContext autostart guarded
    }
  }
}

export const tadeSoundEngine = TadeSoundEngine.getInstance();
