/**
 * TADE v9.6.0-MCA6 — R964 & R966
 * EDUCATIONAL ATTENTION & STORY LEARNING SYSTEM
 * 
 * Manages cognitive attention states for characters during classroom sessions:
 * - DEEP_FOCUS: Subdues idle jitter/blinks by 60%, locks gaze onto target (Iqro/buku)
 * - LISTENING_TURN: Attentive posture waiting for teacher or peer's turn
 * - PLAY_ACTIVE: High dynamism, responsive to butterfly and props
 * - Story Learning Moments: Observing hijaiyah strokes, inspecting nature, tidying gear
 */

export type AttentionState = 'DEEP_FOCUS' | 'LISTENING_TURN' | 'PLAY_ACTIVE' | 'APPRECIATIVE';

export interface StoryLearningVignette {
  id: string;
  title: string;
  topic: string;
  actionSummary: string;
  hijaiyahChar?: string;
  moralLesson: string;
  targetAttention: AttentionState;
}

export const STORY_LEARNING_VIGNETTES: StoryLearningVignette[] = [
  {
    id: 'HIJAIYAH_ALIF_BA',
    title: 'Menyimak Huruf Alif & Ba',
    topic: 'Tahfidz & Makharijul Huruf',
    actionSummary: 'Asy & Syifa menunjuk huruf Alif dan Ba dengan fokus mendalam.',
    hijaiyahChar: 'أ ب',
    moralLesson: 'Mengenal huruf Al-Qur\'an sejak usia dini adalah bekal cahaya hidup.',
    targetAttention: 'DEEP_FOCUS'
  },
  {
    id: 'BOTANY_GARDEN_FLOWER',
    title: 'Mengamati Mahkota Bunga Mawar',
    topic: 'Sains Anak Sholeh & Lingkungan',
    actionSummary: 'Syifa mengamati kelopak bunga dan warna indahnya sambil bertasbih.',
    moralLesson: 'Merenungi penciptaan tanaman sebagai tanda kebesaran Allah SWT.',
    targetAttention: 'LISTENING_TURN'
  },
  {
    id: 'TIDY_SCHOOL_GEAR',
    title: 'Merapikan Meja & Alat Tulis',
    topic: 'Kemandirian & Adab Santri',
    actionSummary: 'Asy menyusun krayon dan buku Iqro kembali ke dalam laci dengan rapi.',
    moralLesson: 'Kebersihan dan kerapian adalah perhiasan penuntut ilmu.',
    targetAttention: 'APPRECIATIVE'
  }
];

export interface EducationalAttentionSnapshot {
  attentionState: AttentionState;
  focusTarget: string;
  jitterDampeningFactor: number; // 0.2 (very still) to 1.0 (normal)
  eyeContactGazeAngle: number;
  activeStoryVignette: StoryLearningVignette | null;
}

export class EducationalAttentionSystem {
  private currentAttention: AttentionState = 'DEEP_FOCUS';
  private focusTarget: string = 'Mushaf Iqro & Huruf Hijaiyah';
  private activeVignette: StoryLearningVignette | null = null;
  private vignetteStartedAt: number = 0;

  public setAttentionState(state: AttentionState, target: string): void {
    this.currentAttention = state;
    this.focusTarget = target;
  }

  public triggerStoryVignette(id: string): StoryLearningVignette | null {
    const v = STORY_LEARNING_VIGNETTES.find(item => item.id === id);
    if (v) {
      this.activeVignette = v;
      this.currentAttention = v.targetAttention;
      this.focusTarget = v.title;
      this.vignetteStartedAt = Date.now();
      return v;
    }
    return null;
  }

  public getSnapshot(): EducationalAttentionSnapshot {
    if (this.activeVignette && (Date.now() - this.vignetteStartedAt) > 6000) {
      this.activeVignette = null;
    }

    const dampening = this.currentAttention === 'DEEP_FOCUS' 
      ? 0.35 
      : this.currentAttention === 'LISTENING_TURN' 
      ? 0.65 
      : 1.0;

    return {
      attentionState: this.currentAttention,
      focusTarget: this.focusTarget,
      jitterDampeningFactor: dampening,
      eyeContactGazeAngle: this.currentAttention === 'DEEP_FOCUS' ? -10 : 0,
      activeStoryVignette: this.activeVignette
    };
  }
}

export const defaultEducationalAttentionSystem = new EducationalAttentionSystem();
