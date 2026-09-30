export type EmotionType =
  | 'HAPPY'
  | 'EXCITED'
  | 'CALM'
  | 'FOCUSED'
  | 'CURIOUS'
  | 'CONFUSED'
  | 'THINKING'
  | 'PROUD'
  | 'THANKFUL'
  | 'SURPRISED'
  | 'SLEEPY'
  | 'PLAYFUL'
  | 'SHY'
  | 'CHEERING'
  | 'PRAYING'
  | 'READING'
  | 'WAITING';

export interface EmotionFacialConfig {
  eyeType: 'NORMAL' | 'WIDE' | 'CLOSED_HAPPY' | 'CONFUSED' | 'SLEEPY' | 'SHINE' | 'PRAYING';
  mouthType: 'SMILE' | 'WIDE_SMILE' | 'O_SHAPE' | 'CONFUSED' | 'SMALL_SMILE' | 'OPEN_HAPPY';
  eyebrowAngle: number; // degrees
  headTilt: number; // degrees
  cheeksOpacity: number;
}

export const EMOTION_CONFIGS: Record<EmotionType, EmotionFacialConfig> = {
  HAPPY: {
    eyeType: 'SHINE',
    mouthType: 'SMILE',
    eyebrowAngle: 0,
    headTilt: 2,
    cheeksOpacity: 0.6
  },
  EXCITED: {
    eyeType: 'WIDE',
    mouthType: 'WIDE_SMILE',
    eyebrowAngle: -5,
    headTilt: -4,
    cheeksOpacity: 0.8
  },
  CALM: {
    eyeType: 'NORMAL',
    mouthType: 'SMALL_SMILE',
    eyebrowAngle: 0,
    headTilt: 0,
    cheeksOpacity: 0.4
  },
  FOCUSED: {
    eyeType: 'NORMAL',
    mouthType: 'SMALL_SMILE',
    eyebrowAngle: 5,
    headTilt: 3,
    cheeksOpacity: 0.3
  },
  CURIOUS: {
    eyeType: 'WIDE',
    mouthType: 'O_SHAPE',
    eyebrowAngle: -10,
    headTilt: 8,
    cheeksOpacity: 0.5
  },
  CONFUSED: {
    eyeType: 'CONFUSED',
    mouthType: 'CONFUSED',
    eyebrowAngle: 12,
    headTilt: -10,
    cheeksOpacity: 0.5
  },
  THINKING: {
    eyeType: 'NORMAL',
    mouthType: 'SMALL_SMILE',
    eyebrowAngle: -8,
    headTilt: 6,
    cheeksOpacity: 0.4
  },
  PROUD: {
    eyeType: 'SHINE',
    mouthType: 'WIDE_SMILE',
    eyebrowAngle: -4,
    headTilt: -3,
    cheeksOpacity: 0.7
  },
  THANKFUL: {
    eyeType: 'CLOSED_HAPPY',
    mouthType: 'SMILE',
    eyebrowAngle: 0,
    headTilt: 4,
    cheeksOpacity: 0.8
  },
  SURPRISED: {
    eyeType: 'WIDE',
    mouthType: 'O_SHAPE',
    eyebrowAngle: -12,
    headTilt: -2,
    cheeksOpacity: 0.6
  },
  SLEEPY: {
    eyeType: 'SLEEPY',
    mouthType: 'SMALL_SMILE',
    eyebrowAngle: 0,
    headTilt: 5,
    cheeksOpacity: 0.3
  },
  PLAYFUL: {
    eyeType: 'SHINE',
    mouthType: 'WIDE_SMILE',
    eyebrowAngle: -6,
    headTilt: 10,
    cheeksOpacity: 0.8
  },
  SHY: {
    eyeType: 'CLOSED_HAPPY',
    mouthType: 'SMALL_SMILE',
    eyebrowAngle: 4,
    headTilt: -6,
    cheeksOpacity: 0.9
  },
  CHEERING: {
    eyeType: 'WIDE',
    mouthType: 'OPEN_HAPPY',
    eyebrowAngle: -8,
    headTilt: 0,
    cheeksOpacity: 0.8
  },
  PRAYING: {
    eyeType: 'PRAYING',
    mouthType: 'SMALL_SMILE',
    eyebrowAngle: 0,
    headTilt: 2,
    cheeksOpacity: 0.5
  },
  READING: {
    eyeType: 'NORMAL',
    mouthType: 'SMALL_SMILE',
    eyebrowAngle: 0,
    headTilt: 4,
    cheeksOpacity: 0.4
  },
  WAITING: {
    eyeType: 'NORMAL',
    mouthType: 'SMALL_SMILE',
    eyebrowAngle: 0,
    headTilt: 0,
    cheeksOpacity: 0.4
  }
};

/**
 * Story & Experience Memory Dictionary (Max 2 sentences, child-friendly, Islamic manners)
 */
export const ASY_STORIES: Record<string, string[]> = {
  MEMORY_EVENTS: [
    "Asy masih ingat keseruan acara sekolah kemarin. Semuanya tampak gembira!",
    "Masya Allah, pengalaman kegiatan lalu membuat Asy makin bersemangat.",
    "Kemarin Asy senang sekali melihat teman-teman belajar bersama dengan tertib."
  ],
  KINDERGARTEN_MANNERS: [
    "Sebelum makan atau mulai pengerjaan, jangan lupa membaca Bismillah ya.",
    "Selesai pengerjaan, ucapkan Alhamdulillah atas kemudahan dari Allah SWT.",
    "Jika diberi bantuan, ucapkan Jazakallahu Khairan dengan senyum ramah."
  ],
  DAILY_STORIES: [
    "Asy tadi membaca buku cerita di perpustakaan sekolah. Ceritanya bagus sekali!",
    "Asy senang sekali melihat suasana kelas yang bersih dan rapi hari ini.",
    "Tadi Asy belajar merapikan alat tulis sendiri di dalam tas sekolah."
  ]
};

/**
 * Derive appropriate emotion from activity and event category
 */
export const deriveEmotionFromActivity = (
  activity: string,
  eventCategory: string,
  isIdle: boolean
): EmotionType => {
  if (activity === 'ERROR') return 'CONFUSED';
  if (activity === 'SUCCESS') return 'PROUD';
  if (activity === 'SEARCHING' || activity === 'RESTORE') return 'CURIOUS';
  if (activity === 'TYPING' || activity === 'DOCUMENT') return 'FOCUSED';
  if (activity === 'APPROVAL' || activity === 'BACKUP') return 'THINKING';
  if (activity === 'PRINTING' || activity === 'UPLOADING') return 'WAITING';

  if (eventCategory === 'COMPETITION') return 'CHEERING';
  if (eventCategory === 'BIRTHDAY' || eventCategory === 'SCHOOL_ANNIVERSARY') return 'EXCITED';
  if (eventCategory === 'RAMADAN') return 'PRAYING';
  if (eventCategory === 'GRADUATION') return 'PROUD';
  if (eventCategory === 'FIELD_TRIP') return 'PLAYFUL';

  if (isIdle) return 'CALM';

  return 'HAPPY';
};
