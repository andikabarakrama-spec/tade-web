/**
 * TADE RC97 — R797: Seasonal Environment Sync
 * Sinkronisasi Suasana Lingkungan Waktu & Momen Tematik Islami / Nasional
 * Menyesuaikan aura visual, aksen busana Asy, dan sapaan tematik
 */

export type SeasonTheme =
  | 'NORMAL'
  | 'RAMADAN'
  | 'IDUL_FITRI'
  | 'HARI_GURU'
  | 'KEMERDEKAAN_RI'
  | 'TAHUN_BARU_HIJRIYAH';

export interface SeasonalState {
  currentTheme: SeasonTheme;
  themeName: string;
  badgeText: string;
  auraGradient: string;
  hatDecoration: string;
  themeGreeting: string;
  themeDescription: string;
  accentColor: string;
}

export class SeasonalEnvironmentSync {
  private static instance: SeasonalEnvironmentSync;
  private currentTheme: SeasonTheme = 'NORMAL';
  private listeners: Set<(state: SeasonalState) => void> = new Set();

  private themesConfig: Record<SeasonTheme, SeasonalState> = {
    NORMAL: {
      currentTheme: 'NORMAL',
      themeName: 'Zamrud Klasik Asy Syifa',
      badgeText: 'Harian Santri',
      auraGradient: 'from-emerald-500/20 to-teal-500/10',
      hatDecoration: 'Bintang Emas',
      themeGreeting: 'Assalamu’alaikum! Semangat belajar dan beramal sholeh.',
      themeDescription: 'Suasana harian standar dengan dominasi hijau zamrud segar.',
      accentColor: '#10b981'
    },
    RAMADAN: {
      currentTheme: 'RAMADAN',
      themeName: 'Semarak Berkah Ramadhan',
      badgeText: 'Bulan Suci',
      auraGradient: 'from-amber-500/25 to-emerald-600/15',
      hatDecoration: 'Bulan Sabit & Lentera',
      themeGreeting: 'Marhaban ya Ramadhan! Selamat menjalankan ibadah puasa.',
      themeDescription: 'Suasana syahdu bulan suci dengan aksen lentera fanous dan ornamen keemasan.',
      accentColor: '#f59e0b'
    },
    IDUL_FITRI: {
      currentTheme: 'IDUL_FITRI',
      themeName: 'Hari Raya Idul Fitri',
      badgeText: '1 Syawwal',
      auraGradient: 'from-emerald-400/30 to-amber-300/20',
      hatDecoration: 'Ornamen Ketupat Hijau',
      themeGreeting: 'Taqabbalallahu minna wa minkum! Minal \'aidin wal faizin.',
      themeDescription: 'Suasana kemenangan dan silaturrahim saling memaafkan dengan busana putih zamrud.',
      accentColor: '#059669'
    },
    HARI_GURU: {
      currentTheme: 'HARI_GURU',
      themeName: 'Apresiasi Hari Guru Nasional',
      badgeText: 'Pahlawan Tanpa Tanda Jasa',
      auraGradient: 'from-rose-500/20 to-emerald-500/15',
      hatDecoration: 'Pita Bunga Mawar Merah',
      themeGreeting: 'Terima kasih Ustadz & Ustadzah! Jasamu membimbing kami abadi.',
      themeDescription: 'Penuh rasa hormat dan terima kasih tak terhingga kepada seluruh guru pendidik.',
      accentColor: '#f43f5e'
    },
    KEMERDEKAAN_RI: {
      currentTheme: 'KEMERDEKAAN_RI',
      themeName: 'Semangat Kemerdekaan RI (17 Agustus)',
      badgeText: 'Dirgahayu RI',
      auraGradient: 'from-red-500/25 to-white/20',
      hatDecoration: 'Pita Merah Putih',
      themeGreeting: 'Merdeka! Santri berkarakter, cinta tanah air Indonesia.',
      themeDescription: 'Semangat nasionalisme dan cinta tanah air berpadu dengan akhlak islami.',
      accentColor: '#ef4444'
    },
    TAHUN_BARU_HIJRIYAH: {
      currentTheme: 'TAHUN_BARU_HIJRIYAH',
      themeName: 'Tahun Baru 1 Muharram',
      badgeText: 'Tahun Baru Hijriyah',
      auraGradient: 'from-indigo-500/25 to-emerald-500/15',
      hatDecoration: 'Bintang Terang',
      themeGreeting: 'Kullu \'am wa antum bikhair! Semangat hijrah menuju pribadi yang lebih baik.',
      themeDescription: 'Momentum refleksi diri, muhasabah, dan perbaikan amal shaleh.',
      accentColor: '#6366f1'
    }
  };

  private constructor() {}

  public static getInstance(): SeasonalEnvironmentSync {
    if (!SeasonalEnvironmentSync.instance) {
      SeasonalEnvironmentSync.instance = new SeasonalEnvironmentSync();
    }
    return SeasonalEnvironmentSync.instance;
  }

  public getSeasonalState(): SeasonalState {
    return this.themesConfig[this.currentTheme];
  }

  public subscribe(listener: (state: SeasonalState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSeasonalState());
    return () => this.listeners.delete(listener);
  }

  public setTheme(theme: SeasonTheme): void {
    this.currentTheme = theme;
    this.notify();
  }

  public getAllThemes(): SeasonalState[] {
    return Object.values(this.themesConfig);
  }

  private notify(): void {
    const state = this.getSeasonalState();
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('[SeasonalEnvironmentSync] Notification error:', err);
      }
    });
  }
}
