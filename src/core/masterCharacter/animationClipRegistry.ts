/**
 * TADE v9.3.0-MCA3 — R932
 * MASTER CHARACTER ANIMATION CLIP REGISTRY
 * 
 * Central registry of official animation clips for Asy & Syifa.
 * Defines timing, loop modes, frame rates, keyframe hints, and descriptions.
 * 
 * Canon Clip Sets:
 * - Asy: idle, wave, readIqro, butterfly, adjustPeci, sitSwing, celebrate, lookAround
 * - Syifa: idle, wave, readIqro, butterfly, holdHijab, sitSwing, celebrate, flowerLook
 */

import { CharacterId, MasterExpressionKey, MasterPoseKey } from './masterCharacterRegistry';

export type AsyClipName = 
  | 'idle'
  | 'wave'
  | 'readIqro'
  | 'butterfly'
  | 'adjustPeci'
  | 'sitSwing'
  | 'celebrate'
  | 'lookAround';

export type SyifaClipName = 
  | 'idle'
  | 'wave'
  | 'readIqro'
  | 'butterfly'
  | 'holdHijab'
  | 'sitSwing'
  | 'celebrate'
  | 'flowerLook';

export type MasterClipName = AsyClipName | SyifaClipName;

export type LoopMode = 'LOOP' | 'ONCE' | 'PING_PONG';

export interface KeyframeHint {
  timeSec: number;
  label: string;
  headTiltDeg?: number;
  armLeftDeg?: number;
  armRightDeg?: number;
  expression: MasterExpressionKey;
}

export interface AnimationClipDefinition {
  id: string;
  clipName: MasterClipName;
  characterId: CharacterId;
  label: string;
  description: string;
  durationSec: number;
  fps: number;
  totalFrames: number;
  loopMode: LoopMode;
  defaultPose: MasterPoseKey;
  defaultExpression: MasterExpressionKey;
  islamicNuance: string;
  soundCue?: string;
  keyframes: KeyframeHint[];
}

// ---------------------------------------------------------------------------
// ASY ANIMATION CLIPS (8 Canon Clips)
// ---------------------------------------------------------------------------
export const ASY_ANIMATION_CLIPS: Record<AsyClipName, AnimationClipDefinition> = {
  idle: {
    id: 'ASY_CLIP_IDLE',
    clipName: 'idle',
    characterId: 'ASY',
    label: 'Tenang Beradab (Idle Loop)',
    description: 'Pose berdiri santun dengan ritme napas tenang, siap melayani kebutuhan santri.',
    durationSec: 3.2,
    fps: 60,
    totalFrames: 192,
    loopMode: 'LOOP',
    defaultPose: 'idle-stand',
    defaultExpression: 'idle',
    islamicNuance: 'Sikap tawadhu dan siap siaga dalam kebaikan.',
    keyframes: [
      { timeSec: 0.0, label: 'Inhale Start', headTiltDeg: 0, expression: 'idle' },
      { timeSec: 1.6, label: 'Exhale Peak', headTiltDeg: 1.5, expression: 'idle' },
      { timeSec: 3.2, label: 'Loop End', headTiltDeg: 0, expression: 'idle' }
    ]
  },
  wave: {
    id: 'ASY_CLIP_WAVE',
    clipName: 'wave',
    characterId: 'ASY',
    label: 'Melambaikan Salam (Wave)',
    description: 'Tangan kanan terangkat melambai ramah mengucapkan Assalamu\'alaikum.',
    durationSec: 2.4,
    fps: 60,
    totalFrames: 144,
    loopMode: 'ONCE',
    defaultPose: 'wave',
    defaultExpression: 'happy',
    islamicNuance: 'Menebarkan salam dan senyuman sebagai sedekah.',
    soundCue: 'greeting_salam.mp3',
    keyframes: [
      { timeSec: 0.0, label: 'Raise Hand', armRightDeg: 45, expression: 'happy' },
      { timeSec: 0.6, label: 'Wave Left', armRightDeg: 75, headTiltDeg: -2, expression: 'laugh' },
      { timeSec: 1.2, label: 'Wave Right', armRightDeg: 50, headTiltDeg: 2, expression: 'happy' },
      { timeSec: 2.4, label: 'Return to Stand', armRightDeg: 0, headTiltDeg: 0, expression: 'idle' }
    ]
  },
  readIqro: {
    id: 'ASY_CLIP_READ_IQRO',
    clipName: 'readIqro',
    characterId: 'ASY',
    label: 'Membaca Iqro / Al-Qur\'an',
    description: 'Kedua tangan memegang mushaf suci secara khusyuk, tatapan menunduk menghormati kalamullah.',
    durationSec: 4.5,
    fps: 60,
    totalFrames: 270,
    loopMode: 'LOOP',
    defaultPose: 'read-iqro',
    defaultExpression: 'reading',
    islamicNuance: 'Membaca Al-Qur\'an dengan tartil dan adab santri.',
    keyframes: [
      { timeSec: 0.0, label: 'Hold Mushaf', headTiltDeg: 3.5, expression: 'reading' },
      { timeSec: 2.2, label: 'Tilawah Nod', headTiltDeg: 5.0, expression: 'reading' },
      { timeSec: 4.5, label: 'Loop Tilawah', headTiltDeg: 3.5, expression: 'reading' }
    ]
  },
  butterfly: {
    id: 'ASY_CLIP_BUTTERFLY',
    clipName: 'butterfly',
    characterId: 'ASY',
    label: 'Bermain Kupu-kupu',
    description: 'Pandangan mata berbinar mengikuti gerak kupu-kupu terbang di taman sekolah.',
    durationSec: 3.8,
    fps: 60,
    totalFrames: 228,
    loopMode: 'LOOP',
    defaultPose: 'butterfly',
    defaultExpression: 'laugh',
    islamicNuance: 'Mensyukuri dan mengagumi keindahan ciptaan Allah SWT.',
    keyframes: [
      { timeSec: 0.0, label: 'Gaze Left Up', headTiltDeg: -4, expression: 'happy' },
      { timeSec: 1.8, label: 'Point to Butterfly', armRightDeg: 60, headTiltDeg: 4, expression: 'laugh' },
      { timeSec: 3.8, label: 'Follow Flight', armRightDeg: 20, headTiltDeg: 0, expression: 'happy' }
    ]
  },
  adjustPeci: {
    id: 'ASY_CLIP_ADJUST_PECI',
    clipName: 'adjustPeci',
    characterId: 'ASY',
    label: 'Merapikan Peci Hitam',
    description: 'Tangan kanan menyentuh dan meluruskan peci hitam beludru agar rapi sebelum sholat/belajar.',
    durationSec: 2.8,
    fps: 60,
    totalFrames: 168,
    loopMode: 'ONCE',
    defaultPose: 'peci-adjust',
    defaultExpression: 'shy',
    islamicNuance: 'Menjaga kebersihan dan kerapian busana muslim.',
    keyframes: [
      { timeSec: 0.0, label: 'Reach Peci', armRightDeg: 120, headTiltDeg: 2, expression: 'idle' },
      { timeSec: 1.4, label: 'Align Peci', armRightDeg: 130, headTiltDeg: -1, expression: 'shy' },
      { timeSec: 2.8, label: 'Neat & Ready', armRightDeg: 0, headTiltDeg: 0, expression: 'happy' }
    ]
  },
  sitSwing: {
    id: 'ASY_CLIP_SIT_SWING',
    clipName: 'sitSwing',
    characterId: 'ASY',
    label: 'Duduk Santai Ayun Kaki',
    description: 'Duduk di bangku kayu sekolah dengan kedua kaki mengayun riang menikmati waktu istirahat.',
    durationSec: 3.0,
    fps: 60,
    totalFrames: 180,
    loopMode: 'LOOP',
    defaultPose: 'swing-feet',
    defaultExpression: 'happy',
    islamicNuance: 'Istirahat sejenak dengan hati tenang dan bersyukur.',
    keyframes: [
      { timeSec: 0.0, label: 'Swing Forward', headTiltDeg: 1, expression: 'happy' },
      { timeSec: 1.5, label: 'Swing Backward', headTiltDeg: -1, expression: 'happy' },
      { timeSec: 3.0, label: 'Cycle Repeat', headTiltDeg: 1, expression: 'happy' }
    ]
  },
  celebrate: {
    id: 'ASY_CLIP_CELEBRATE',
    clipName: 'celebrate',
    characterId: 'ASY',
    label: 'Merayakan Prestasi (Celebrate)',
    description: 'Melompat ceria dengan jempol terangkat atas keberhasilan hafalan dan tugas santri.',
    durationSec: 2.5,
    fps: 60,
    totalFrames: 150,
    loopMode: 'ONCE',
    defaultPose: 'thumbs-up',
    defaultExpression: 'laugh',
    islamicNuance: 'Bersyukur dengan ucapan Alhamdulillah atas prestasi yang diraih.',
    soundCue: 'celebration_chime.mp3',
    keyframes: [
      { timeSec: 0.0, label: 'Anticipation', headTiltDeg: -2, expression: 'happy' },
      { timeSec: 0.8, label: 'Jump & Thumbs Up', armRightDeg: 90, headTiltDeg: 4, expression: 'laugh' },
      { timeSec: 2.5, label: 'Land Steadily', armRightDeg: 0, headTiltDeg: 0, expression: 'happy' }
    ]
  },
  lookAround: {
    id: 'ASY_CLIP_LOOK_AROUND',
    clipName: 'lookAround',
    characterId: 'ASY',
    label: 'Memandang Sekitar (Look Around)',
    description: 'Menoleh ke kiri dan kanan dengan pandangan hangat, mengamati suasana santri di kelas.',
    durationSec: 3.6,
    fps: 60,
    totalFrames: 216,
    loopMode: 'LOOP',
    defaultPose: 'idle-stand',
    defaultExpression: 'happy',
    islamicNuance: 'Peduli dan menyayangi sesama teman santri.',
    keyframes: [
      { timeSec: 0.0, label: 'Look Center', headTiltDeg: 0, expression: 'idle' },
      { timeSec: 1.2, label: 'Glance Left', headTiltDeg: -3.5, expression: 'happy' },
      { timeSec: 2.4, label: 'Glance Right', headTiltDeg: 3.5, expression: 'happy' },
      { timeSec: 3.6, label: 'Return Center', headTiltDeg: 0, expression: 'idle' }
    ]
  }
};

// ---------------------------------------------------------------------------
// SYIFA ANIMATION CLIPS (8 Canon Clips)
// ---------------------------------------------------------------------------
export const SYIFA_ANIMATION_CLIPS: Record<SyifaClipName, AnimationClipDefinition> = {
  idle: {
    id: 'SYIFA_CLIP_IDLE',
    clipName: 'idle',
    characterId: 'SYIFA',
    label: 'Tenang Syar\'i (Idle Loop)',
    description: 'Pose berdiri anggun berbalut gamis pink dan hijab mint syar\'i yang bergoyang lembut.',
    durationSec: 3.2,
    fps: 60,
    totalFrames: 192,
    loopMode: 'LOOP',
    defaultPose: 'idle-stand',
    defaultExpression: 'idle',
    islamicNuance: 'Menjaga kehormatan dan adab muslimah yang santun.',
    keyframes: [
      { timeSec: 0.0, label: 'Inhale Breath', headTiltDeg: 0, expression: 'idle' },
      { timeSec: 1.6, label: 'Exhale Gentle', headTiltDeg: -1.5, expression: 'idle' },
      { timeSec: 3.2, label: 'Cycle Repeat', headTiltDeg: 0, expression: 'idle' }
    ]
  },
  wave: {
    id: 'SYIFA_CLIP_WAVE',
    clipName: 'wave',
    characterId: 'SYIFA',
    label: 'Menyapa Hangat (Wave)',
    description: 'Mengangkat tangan kanan tersenyum ramah menyapa teman-teman santriwati.',
    durationSec: 2.4,
    fps: 60,
    totalFrames: 144,
    loopMode: 'ONCE',
    defaultPose: 'wave',
    defaultExpression: 'happy',
    islamicNuance: 'Ukhuwah islamiyah dan kehangatan salam.',
    soundCue: 'greeting_syifa.mp3',
    keyframes: [
      { timeSec: 0.0, label: 'Raise Hand', armRightDeg: 40, expression: 'happy' },
      { timeSec: 0.7, label: 'Gentle Wave', armRightDeg: 65, headTiltDeg: -3, expression: 'laugh' },
      { timeSec: 1.4, label: 'Smile Wave', armRightDeg: 45, headTiltDeg: 2, expression: 'happy' },
      { timeSec: 2.4, label: 'Lower Hand', armRightDeg: 0, headTiltDeg: 0, expression: 'idle' }
    ]
  },
  readIqro: {
    id: 'SYIFA_CLIP_READ_IQRO',
    clipName: 'readIqro',
    characterId: 'SYIFA',
    label: 'Tilawah Qur\'an & Iqro',
    description: 'Kedua tangan mendekap mushaf dengan takzim, menyimak bacaan tajwid dengan merdu.',
    durationSec: 4.5,
    fps: 60,
    totalFrames: 270,
    loopMode: 'LOOP',
    defaultPose: 'read-iqro',
    defaultExpression: 'reading',
    islamicNuance: 'Kecintaan mendalam terhadap Al-Qur\'an sejak usia dini.',
    keyframes: [
      { timeSec: 0.0, label: 'Begin Tilawah', headTiltDeg: 3.0, expression: 'reading' },
      { timeSec: 2.2, label: 'Subtle Rhythm', headTiltDeg: 4.5, expression: 'reading' },
      { timeSec: 4.5, label: 'Complete Ayah', headTiltDeg: 3.0, expression: 'reading' }
    ]
  },
  butterfly: {
    id: 'SYIFA_CLIP_BUTTERFLY',
    clipName: 'butterfly',
    characterId: 'SYIFA',
    label: 'Ceria Bersama Kupu-kupu',
    description: 'Tersenyum manis menyambut kupu-kupu yang hinggap di dekat bunga taman sekolah.',
    durationSec: 3.8,
    fps: 60,
    totalFrames: 228,
    loopMode: 'LOOP',
    defaultPose: 'butterfly',
    defaultExpression: 'laugh',
    islamicNuance: 'Mencintai alam semesta dan flora fauna.',
    keyframes: [
      { timeSec: 0.0, label: 'Look Down Right', headTiltDeg: 3, expression: 'happy' },
      { timeSec: 1.8, label: 'Hands Up Joy', armLeftDeg: 30, armRightDeg: 45, headTiltDeg: -3, expression: 'laugh' },
      { timeSec: 3.8, label: 'Gentle Watch', armLeftDeg: 0, armRightDeg: 0, headTiltDeg: 0, expression: 'happy' }
    ]
  },
  holdHijab: {
    id: 'SYIFA_CLIP_HOLD_HIJAB',
    clipName: 'holdHijab',
    characterId: 'SYIFA',
    label: 'Memegang Ujung Hijab (Malu Santun)',
    description: 'Jari jemari lentik memegang lembut tepi kain hijab hijau mint dengan senyum malu-malu.',
    durationSec: 2.8,
    fps: 60,
    totalFrames: 168,
    loopMode: 'ONCE',
    defaultPose: 'hijab-hold',
    defaultExpression: 'shy',
    islamicNuance: 'Rasa malu (Haya\') yang merupakan cabang dari keimanan.',
    keyframes: [
      { timeSec: 0.0, label: 'Reach Hijab Edge', armLeftDeg: 45, headTiltDeg: 2, expression: 'shy' },
      { timeSec: 1.4, label: 'Hold & Blush', armLeftDeg: 55, headTiltDeg: 4, expression: 'shy' },
      { timeSec: 2.8, label: 'Release Softly', armLeftDeg: 0, headTiltDeg: 0, expression: 'happy' }
    ]
  },
  sitSwing: {
    id: 'SYIFA_CLIP_SIT_SWING',
    clipName: 'sitSwing',
    characterId: 'SYIFA',
    label: 'Duduk Mengayun Kaki',
    description: 'Duduk anggun dengan gamis menutupi aurat rapi sembari mengayunkan kaki berirama.',
    durationSec: 3.0,
    fps: 60,
    totalFrames: 180,
    loopMode: 'LOOP',
    defaultPose: 'swing-feet',
    defaultExpression: 'happy',
    islamicNuance: 'Keceriaan anak muslimah yang santun dan gembira.',
    keyframes: [
      { timeSec: 0.0, label: 'Swing Forward', headTiltDeg: -1.5, expression: 'happy' },
      { timeSec: 1.5, label: 'Swing Backward', headTiltDeg: 1.5, expression: 'happy' },
      { timeSec: 3.0, label: 'Loop Rhythm', headTiltDeg: -1.5, expression: 'happy' }
    ]
  },
  celebrate: {
    id: 'SYIFA_CLIP_CELEBRATE',
    clipName: 'celebrate',
    characterId: 'SYIFA',
    label: 'Tepuk Tangan Ceria (Celebrate)',
    description: 'Bertepuk tangan riang memuji prestasi teman dengan senyuman ceria berbinar-binar.',
    durationSec: 2.5,
    fps: 60,
    totalFrames: 150,
    loopMode: 'ONCE',
    defaultPose: 'thumbs-up',
    defaultExpression: 'laugh',
    islamicNuance: 'Turut bergembira atas nikmat yang didapat saudara seiman (Ghibtah).',
    soundCue: 'celebration_claps.mp3',
    keyframes: [
      { timeSec: 0.0, label: 'Hands Meet', armLeftDeg: 30, armRightDeg: 30, expression: 'happy' },
      { timeSec: 0.8, label: 'Clap Cycle', armLeftDeg: 45, armRightDeg: 45, headTiltDeg: 3, expression: 'laugh' },
      { timeSec: 2.5, label: 'Cheerful End', armLeftDeg: 0, armRightDeg: 0, headTiltDeg: 0, expression: 'happy' }
    ]
  },
  flowerLook: {
    id: 'SYIFA_CLIP_FLOWER_LOOK',
    clipName: 'flowerLook',
    characterId: 'SYIFA',
    label: 'Memandang Bunga Indah',
    description: 'Menunduk sedikit memandang kuntum bunga mekar dengan senyuman penuh kasih sayang.',
    durationSec: 3.6,
    fps: 60,
    totalFrames: 216,
    loopMode: 'LOOP',
    defaultPose: 'idle-stand',
    defaultExpression: 'happy',
    islamicNuance: 'Tadabbur alam ciptaan Sang Maha Pencipta.',
    keyframes: [
      { timeSec: 0.0, label: 'Look Downward', headTiltDeg: 4, expression: 'happy' },
      { timeSec: 1.8, label: 'Admire Bloom', headTiltDeg: 5.5, expression: 'laugh' },
      { timeSec: 3.6, label: 'Lift Gaze', headTiltDeg: 2, expression: 'happy' }
    ]
  }
};

export class AnimationClipRegistry {
  public getClipsForCharacter(characterId: CharacterId): Record<string, AnimationClipDefinition> {
    return characterId === 'ASY' ? ASY_ANIMATION_CLIPS : SYIFA_ANIMATION_CLIPS;
  }

  public getClip(characterId: CharacterId, clipName: MasterClipName): AnimationClipDefinition | undefined {
    if (characterId === 'ASY') {
      return (ASY_ANIMATION_CLIPS as any)[clipName];
    } else {
      return (SYIFA_ANIMATION_CLIPS as any)[clipName];
    }
  }

  public getAllClips(): AnimationClipDefinition[] {
    return [
      ...Object.values(ASY_ANIMATION_CLIPS),
      ...Object.values(SYIFA_ANIMATION_CLIPS)
    ];
  }

  public getClipNames(characterId: CharacterId): string[] {
    return Object.keys(this.getClipsForCharacter(characterId));
  }
}

export const defaultClipRegistry = new AnimationClipRegistry();
