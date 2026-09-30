/**
 * TADE RC100 — R828
 * Mesin Kesadaran Situasi (Situational Awareness Engine)
 * 
 * Maskot membaca dan beradaptasi terhadap konteks aplikasi:
 * - login (Sambutan hangat)
 * - unggah_foto (Apresiasi dokumentasi kegiatan)
 * - video_selesai (Notifikasi ekspor berhasil)
 * - keyboard_muncul (Dodge agar tidak menutupi input text)
 * - mode_fokus (Sikap hening/minimalist)
 * - malam_hari (Salam istirahat malam)
 * - ramadhan (Nuansa ibadah & puasa)
 * - wisuda (Suasana kelulusan santri)
 * - hari_guru (Ungkapan terima kasih pada ustadz/ustadzah)
 */

export type AppSituationContext = 
  | 'LOGIN_SUCCESS'
  | 'PHOTO_UPLOADED'
  | 'VIDEO_RENDER_COMPLETE'
  | 'KEYBOARD_ACTIVE'
  | 'FOCUS_MODE_ON'
  | 'NIGHT_HOURS'
  | 'SEASON_RAMADHAN'
  | 'SEASON_WISUDA'
  | 'SEASON_HARI_GURU'
  | 'DEFAULT_IDLE';

export interface SituationReaction {
  context: AppSituationContext;
  title: string;
  badgeLabel: string;
  mascotReactionText: string;
  visualAdaptation: string;
  suggestedBehavior: string;
  isDisruptive: boolean; // Must always be false to protect user workflows
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const SITUATION_DEFINITIONS: Record<AppSituationContext, SituationReaction> = {
  LOGIN_SUCCESS: {
    context: 'LOGIN_SUCCESS',
    title: 'Pengguna Berhasil Masuk',
    badgeLabel: 'Sesi Aktif',
    mascotReactionText: 'Ahlan wa Sahlan! Senang melihat Ustadz/Ustadzah kembali aktif hari ini.',
    visualAdaptation: 'Melambaikan tangan ceria dengan senyum hangat.',
    suggestedBehavior: 'MELAMBAIKAN_TANGAN',
    isDisruptive: false,
    priority: 'MEDIUM'
  },
  PHOTO_UPLOADED: {
    context: 'PHOTO_UPLOADED',
    title: 'Foto Kegiatan Berhasil Diunggah',
    badgeLabel: 'Media Masuk',
    mascotReactionText: 'Alhamdulillah, foto kegiatan santri tersimpan rapi dan dioptimasi!',
    visualAdaptation: 'Memegang jempol kecil tanda apresiasi.',
    suggestedBehavior: 'MERAPIKAN_PECI',
    isDisruptive: false,
    priority: 'MEDIUM'
  },
  VIDEO_RENDER_COMPLETE: {
    context: 'VIDEO_RENDER_COMPLETE',
    title: 'Story / Video Selesai Dibuat',
    badgeLabel: 'Ekspor Siap',
    mascotReactionText: 'Hore! Story santri siap diunduh dan dibagikan ke wali murid.',
    visualAdaptation: 'Bintang berkilau kecil di sekitar Asy.',
    suggestedBehavior: 'MENGEJAR_KUPU_KUPU',
    isDisruptive: false,
    priority: 'HIGH'
  },
  KEYBOARD_ACTIVE: {
    context: 'KEYBOARD_ACTIVE',
    title: 'Keyboard HP Sedang Terbuka',
    badgeLabel: 'One-Hand Safe',
    mascotReactionText: 'Asy bergeser ke atas ya, biar ketikan formulir Ustadzah terlihat jelas.',
    visualAdaptation: 'Menyusut 20% dan bergeser ke sudut atas (Keyboard Dodge).',
    suggestedBehavior: 'NGINTIP',
    isDisruptive: false,
    priority: 'HIGH'
  },
  FOCUS_MODE_ON: {
    context: 'FOCUS_MODE_ON',
    title: 'Mode Fokus Penilaian / Rapor Aktif',
    badgeLabel: 'Hening & Tenang',
    mascotReactionText: 'Fokus mode aktif. Asy menjaga ketenangan di sudut layar.',
    visualAdaptation: 'Transparansi 60% dan gerakan statis hening.',
    suggestedBehavior: 'IDLE_BREATHING',
    isDisruptive: false,
    priority: 'LOW'
  },
  NIGHT_HOURS: {
    context: 'NIGHT_HOURS',
    title: 'Waktu Malam Hari (19.00 - 05.00 WIB)',
    badgeLabel: 'Istirahat Malam',
    mascotReactionText: 'Sudah malam, jangan lupa istirahat yang cukup agar esok bugar mengajar santri.',
    visualAdaptation: 'Lampu tidur temaram dan pose memeluk boneka.',
    suggestedBehavior: 'MEMELUK_BONEKA_KECIL',
    isDisruptive: false,
    priority: 'LOW'
  },
  SEASON_RAMADHAN: {
    context: 'SEASON_RAMADHAN',
    title: 'Semarak Bulan Suci Ramadhan',
    badgeLabel: 'Ramadhan Mubarak',
    mascotReactionText: 'Marhaban ya Ramadhan! Semoga amal ibadah puasa dan tadarus kita diterima Allah SWT.',
    visualAdaptation: 'Lentera sabit zamrud bercahaya lembut di samping Asy.',
    suggestedBehavior: 'MEMBACA_IQRA',
    isDisruptive: false,
    priority: 'MEDIUM'
  },
  SEASON_WISUDA: {
    context: 'SEASON_WISUDA',
    title: 'Musim Wisuda & Pelepasan Santri',
    badgeLabel: 'Wisuda Ceria',
    mascotReactionText: 'Barakallahu fiikum santri sholeh & sholehah yang telah menuntaskan masa TK!',
    visualAdaptation: 'Toga kecil dan pita emas prestasi.',
    suggestedBehavior: 'MELAMBAIKAN_TANGAN',
    isDisruptive: false,
    priority: 'HIGH'
  },
  SEASON_HARI_GURU: {
    context: 'SEASON_HARI_GURU',
    title: 'Peringatan Hari Guru Nasional',
    badgeLabel: 'Terima Kasih Guru',
    mascotReactionText: 'Jazakumullah khairan katsiran para pejuang ilmu TK Asy Syifa!',
    visualAdaptation: 'Bunga mawar zamrud di tangan Asy.',
    suggestedBehavior: 'DUDUK_DI_KARTU',
    isDisruptive: false,
    priority: 'HIGH'
  },
  DEFAULT_IDLE: {
    context: 'DEFAULT_IDLE',
    title: 'Aktivitas Normal Harian',
    badgeLabel: 'Standby Normal',
    mascotReactionText: 'Asy siap membantu kapan pun dibutuhkan.',
    visualAdaptation: 'Pose ceria standar.',
    suggestedBehavior: 'IDLE_BREATHING',
    isDisruptive: false,
    priority: 'LOW'
  }
};

export class SituationalAwarenessEngine {
  private static instance: SituationalAwarenessEngine;
  private currentContext: AppSituationContext = 'DEFAULT_IDLE';
  private listeners: Array<(context: AppSituationContext, reaction: SituationReaction) => void> = [];

  private constructor() {
    this.detectInitialContext();
  }

  public static getInstance(): SituationalAwarenessEngine {
    if (!SituationalAwarenessEngine.instance) {
      SituationalAwarenessEngine.instance = new SituationalAwarenessEngine();
    }
    return SituationalAwarenessEngine.instance;
  }

  private detectInitialContext() {
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 5) {
      this.currentContext = 'NIGHT_HOURS';
    } else {
      this.currentContext = 'DEFAULT_IDLE';
    }
  }

  public getContext(): AppSituationContext {
    return this.currentContext;
  }

  public getReaction(): SituationReaction {
    return SITUATION_DEFINITIONS[this.currentContext] || SITUATION_DEFINITIONS.DEFAULT_IDLE;
  }

  public setContext(context: AppSituationContext): SituationReaction {
    this.currentContext = context;
    const reaction = this.getReaction();
    this.notify();
    return reaction;
  }

  public getAllSituations(): SituationReaction[] {
    return Object.values(SITUATION_DEFINITIONS);
  }

  public subscribe(listener: (context: AppSituationContext, reaction: SituationReaction) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const reaction = this.getReaction();
    this.listeners.forEach(fn => fn(this.currentContext, reaction));
  }
}
