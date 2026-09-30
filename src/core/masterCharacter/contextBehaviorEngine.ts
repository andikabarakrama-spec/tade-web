/**
 * TADE v9.2.0-MCA2 — R915 & R925
 * CONTEXT BEHAVIOR ENGINE
 * 
 * Maps active user module/route and contextual events to character states,
 * poses, expressions, and cheerful islamic dialogues.
 * 
 * Mandatory Context Mapping (R925):
 * - Dashboard → wave
 * - PPDB → point
 * - Tahfidz → readIqro
 * - Gallery → butterfly
 * - Loading → sleepy
 * - Error → confused
 */

import { CharacterId, MasterExpressionKey, MasterPoseKey } from './masterCharacterRegistry';
import { ExpressionEngine, defaultExpressionEngine } from './expressionEngine';
import { CharacterState, CharacterStateMachine, defaultStateMachine } from './stateMachine';

export interface ContextBehaviorPlan {
  contextId: string;
  contextName: string;
  state: CharacterState;
  pose: MasterPoseKey;
  expression: MasterExpressionKey;
  asyDialogue: string;
  syifaDialogue: string;
  soundEffect?: string;
  actionHint?: string;
}

export const CONTEXT_BEHAVIOR_MAP: Record<string, ContextBehaviorPlan> = {
  // 1. Dashboard Context
  dashboard: {
    contextId: 'dashboard',
    contextName: 'Dashboard Utama SIM Sekolah',
    state: 'wave',
    pose: 'wave',
    expression: 'happy',
    asyDialogue: 'Assalamu\'alaikum! Selamat datang di SIM Sekolah Tunas Adab Mulia. Yuk lihat ringkasan hari ini!',
    syifaDialogue: 'Ahlan wa Sahlan! Semoga hari ini penuh berkah dan semangat menuntut ilmu.',
    actionHint: 'Menyapa hangat pengguna'
  },
  // 2. PPDB Context
  ppdb: {
    contextId: 'ppdb',
    contextName: 'Penerimaan Peserta Didik Baru (PPDB)',
    state: 'point',
    pose: 'point',
    expression: 'happy',
    asyDialogue: 'Mau daftar santri baru? Klik di sini untuk mengisi formulir pendaftaran ya!',
    syifaDialogue: 'Selamat datang calon santri teladan! Lengkapi berkas pendaftaran dengan mudah di sini.',
    actionHint: 'Menunjuk formulir pendaftaran santri'
  },
  // 3. Tahfidz Context
  tahfidz: {
    contextId: 'tahfidz',
    contextName: 'Sentra Tahfidz & Mutabaah Qur\'an',
    state: 'readIqro',
    pose: 'read-iqro',
    expression: 'reading',
    asyDialogue: 'Bismillah, mari kita muroja\'ah dan setoran hafalan surah hari ini. Semangat!',
    syifaDialogue: 'Maa syaa Allah, setiap ayat yang dihafal akan menjadi mahkota kemuliaan di surga.',
    actionHint: 'Khusyuk membaca dan menyimak Al-Qur\'an'
  },
  // 4. Gallery Context
  gallery: {
    contextId: 'gallery',
    contextName: 'Galeri & Dokumentasi Kegiatan',
    state: 'butterfly',
    pose: 'butterfly',
    expression: 'laugh',
    asyDialogue: 'Lihat karya dan foto seru santri-santri hebat di galeri ini! Indah sekali ya!',
    syifaDialogue: 'Alhamdulillah, taman kreativitas dan karya penuh warna santri Tunas Adab.',
    actionHint: 'Menikmati keindahan karya santri'
  },
  // 5. Loading Context
  loading: {
    contextId: 'loading',
    contextName: 'Memuat Data Sistem',
    state: 'sleepy',
    pose: 'swing-feet',
    expression: 'idle',
    asyDialogue: 'Tunggu sebentar ya teman-teman, datanya sedang disiapkan dengan teliti...',
    syifaDialogue: 'Bismillah, data sedang disinkronkan. Sambil menunggu, jangan lupa berdzikir.',
    actionHint: 'Duduk santai mengayunkan kaki'
  },
  // 6. Error Context
  error: {
    contextId: 'error',
    contextName: 'Terjadi Kendala Teknis',
    state: 'confused',
    pose: 'idle-stand',
    expression: 'confused',
    asyDialogue: 'Wah, sepertinya ada sedikit kendala. Tenang ya, mari kita coba periksa kembali!',
    syifaDialogue: 'Astaghfirullah, ada yang kurang pas. Jangan khawatir, kita coba segarkan kembali ya.',
    actionHint: 'Menganalisis kendala dengan tenang'
  },
  // 7. Finance / SPP Context
  finance: {
    contextId: 'finance',
    contextName: 'Pembayaran SPP & Kasir Digital',
    state: 'celebrate',
    pose: 'thumbs-up',
    expression: 'happy',
    asyDialogue: 'Catatan infaq dan SPP aman terdata dengan transparan & amanah!',
    syifaDialogue: 'Jazakumullah khairan katsiran atas kontribusi infaq pendidikan santri.',
    actionHint: 'Memberikan apresiasi amanah'
  },
  // 8. Offline Context
  offline: {
    contextId: 'offline',
    contextName: 'Moda Pelosok Tanpa Sinyal',
    state: 'point',
    pose: 'point',
    expression: 'surprised',
    asyDialogue: 'Tenang, aplikasi tetap jalan lancar tanpa internet! Data otomatis tersimpan.',
    syifaDialogue: 'Sistem offline siap menemani di manapun berada tanpa hambatan.',
    actionHint: 'Memberi rasa aman saat offline'
  }
};

export class ContextBehaviorEngine {
  private activeContext: string = 'dashboard';
  private expressionEngine: ExpressionEngine;
  private stateMachine: CharacterStateMachine;

  constructor(
    expressionEngine?: ExpressionEngine,
    stateMachine?: CharacterStateMachine
  ) {
    this.expressionEngine = expressionEngine || defaultExpressionEngine;
    this.stateMachine = stateMachine || defaultStateMachine;
  }

  public resolveContextKey(tab: string): string {
    const t = (tab || '').toLowerCase();
    
    if (t.includes('ppdb') || t.includes('r20') || t.includes('r21') || t.includes('w5')) {
      return 'ppdb';
    }
    if (t.includes('tahfidz') || t.includes('mutabaah') || t.includes('r11') || t.includes('r12') || t.includes('w4')) {
      return 'tahfidz';
    }
    if (t.includes('gallery') || t.includes('galeri') || t.includes('r25') || t.includes('r77') || t.includes('w7')) {
      return 'gallery';
    }
    if (t.includes('keuangan') || t.includes('spp') || t.includes('pos') || t.includes('r13') || t.includes('r26')) {
      return 'finance';
    }
    if (t.includes('offline') || t.includes('pelosok') || t.includes('r868') || t.includes('g904')) {
      return 'offline';
    }
    if (t.includes('error') || t.includes('glitch') || t.includes('recovery') || t.includes('g905')) {
      return 'error';
    }
    if (t.includes('loading') || t.includes('syncing')) {
      return 'loading';
    }

    return 'dashboard';
  }

  /**
   * Mengatur konteks aktif berdasarkan modul yang dibuka pengguna
   */
  public resolveContextFromTab(tab: string): ContextBehaviorPlan {
    const key = this.resolveContextKey(tab);
    this.activeContext = key;
    return CONTEXT_BEHAVIOR_MAP[key] || CONTEXT_BEHAVIOR_MAP.dashboard;
  }

  public applyBehavior(contextKey: string): ContextBehaviorPlan {
    const plan = CONTEXT_BEHAVIOR_MAP[contextKey] || CONTEXT_BEHAVIOR_MAP.dashboard;
    this.activeContext = contextKey;

    // Trigger state machine & expression engine safely
    this.stateMachine.transitionTo(plan.state);
    this.expressionEngine.setExpression(plan.expression);

    return plan;
  }

  public getActivePlan(characterId: CharacterId = 'ASY'): {
    plan: ContextBehaviorPlan;
    dialogue: string;
    pose: MasterPoseKey;
    expression: MasterExpressionKey;
    state: CharacterState;
  } {
    const plan = CONTEXT_BEHAVIOR_MAP[this.activeContext] || CONTEXT_BEHAVIOR_MAP.dashboard;
    const dialogue = characterId === 'ASY' ? plan.asyDialogue : plan.syifaDialogue;

    return {
      plan,
      dialogue,
      pose: plan.pose,
      expression: plan.expression,
      state: plan.state
    };
  }
}

export const defaultContextBehaviorEngine = new ContextBehaviorEngine();
