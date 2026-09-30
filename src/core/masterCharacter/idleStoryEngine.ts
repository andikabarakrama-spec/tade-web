/**
 * TADE v9.5.0-MCA5 — R955
 * IDLE STORY ENGINE
 * 
 * Micro storytelling vignettes that enrich the living school atmosphere:
 * - Asy: Tidying peci after running, deep inhale, gazing at school garden
 * - Syifa: Smoothing hijab veil, admiring garden flower, wonder at butterfly
 * - Shared: Sitting on card ledge, swinging legs, greeting returning user
 * - Uses existing canon clips without introducing new render assets.
 */

import { CharacterId } from './masterCharacterRegistry';
import { MasterClipName } from './animationClipRegistry';

export interface StoryVignette {
  id: string;
  title: string;
  character: CharacterId | 'BOTH';
  primaryClip: MasterClipName;
  durationSec: number;
  narrativeText: string;
  islamicLesson: string;
}

export const STORY_VIGNETTES: StoryVignette[] = [
  {
    id: 'STORY_ASY_PECI',
    title: 'Merapikan Peci Hitam',
    character: 'ASY',
    primaryClip: 'adjustPeci',
    durationSec: 3.5,
    narrativeText: 'Asy merapikan peci hitamnya dengan tangan kanan sebelum memulai hafalan surat pendek.',
    islamicLesson: 'Menjaga kerapian dan kebersihan pakaian adalah bagian dari keimanan.'
  },
  {
    id: 'STORY_SYIFA_HIJAB',
    title: 'Merapikan Hijab Ceria',
    character: 'SYIFA',
    primaryClip: 'holdHijab',
    durationSec: 3.5,
    narrativeText: 'Syifa memegang lembut ujung hijab oranye cerianya sambil tersenyum ramah.',
    islamicLesson: 'Kecintaan anak sholihah pada busana muslimah yang menutup aurat sejak dini.'
  },
  {
    id: 'STORY_SYIFA_FLOWER',
    title: 'Menikmati Bunga Mawar Taman',
    character: 'SYIFA',
    primaryClip: 'flowerLook',
    durationSec: 4.0,
    narrativeText: 'Syifa menatap bunga yang mekar di pekarangan sekolah sambil berdzikir mengagumi ciptaan-Nya.',
    islamicLesson: 'Mentadabburi keindahan alam ciptaan Allah SWT: "Subhanallah wa bihamdih".'
  },
  {
    id: 'STORY_BUTTERFLY_CHASE',
    title: 'Kupu-Kupu Taman Syurga',
    character: 'BOTH',
    primaryClip: 'butterfly',
    durationSec: 4.5,
    narrativeText: 'Kupu-kupu kuning melintas, memikat pandangan Asy & Syifa yang menyambutnya penuh suka cita.',
    islamicLesson: 'Menyayangi makhluk hidup ciptaan Allah dengan lemah lembut.'
  },
  {
    id: 'STORY_SIT_REST',
    title: 'Rehat Sejenak Ayun Kaki',
    character: 'BOTH',
    primaryClip: 'sitSwing',
    durationSec: 5.0,
    narrativeText: 'Duduk santai di atas serambi sekolah, mengayunkan kaki kecil sambil membaca doa istirahat.',
    islamicLesson: 'Menghargai waktu istirahat yang cukup untuk mengembalikan stamina belajar.'
  }
];

export class IdleStoryEngine {
  private activeVignette: StoryVignette | null = null;
  private vignetteStartedAt: number = 0;

  public triggerVignette(id: string): StoryVignette | null {
    const v = STORY_VIGNETTES.find(item => item.id === id);
    if (v) {
      this.activeVignette = v;
      this.vignetteStartedAt = Date.now();
      return v;
    }
    return null;
  }

  public getActiveVignette(): StoryVignette | null {
    if (!this.activeVignette) return null;
    const elapsed = (Date.now() - this.vignetteStartedAt) / 1000;
    if (elapsed > this.activeVignette.durationSec) {
      this.activeVignette = null;
      return null;
    }
    return this.activeVignette;
  }

  public getAllVignettes(): StoryVignette[] {
    return STORY_VIGNETTES;
  }
}

export const defaultIdleStoryEngine = new IdleStoryEngine();
