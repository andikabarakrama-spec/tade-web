export type AIAsyCharacterState =
  | 'idle'
  | 'wave'
  | 'greeting'
  | 'reading'
  | 'drawing'
  | 'watering'
  | 'watching_butterfly'
  | 'watching_bird'
  | 'ready_school'
  | 'sleepy'
  | 'excited'
  | 'thank_you'
  | 'camera'
  | 'guide'
  | 'goodbye'
  | 'thinking'
  | 'happy'
  | 'sad'
  | 'pray'
  | 'celebrate'
  | 'point'
  | 'sleep'
  | 'walking'
  | 'smile'
  | 'look_left'
  | 'look_right'
  | 'sitting'
  | 'standing'
  | 'head_turn'
  | 'speaking'
  | 'point_up'
  | 'point_left'
  | 'point_right'
  | 'walk'
  | 'surprised'
  | 'raise_hand';

export interface AIAsyAssetMeta {
  state: AIAsyCharacterState;
  label: string;
  assetPath: string;
  fallbackAspect: string;
  description: string;
  emoji: string;
}

export interface MasterMascotDefinition {
  characterId: 'ASY' | 'ASYAH';
  displayName: string;
  name: string;
  gender: 'boy' | 'girl';
  identity: string;
  uniformIdentity: string;
  headwear: string;
  masterAsset: string;
  approvedStates: AIAsyCharacterState[];
  description: string;
  masterComponent: string;
  animationCapabilities: string[];
  renderTargets: string[];
  accessibilitySettings: {
    ariaLabel: string;
    role: string;
  };
  reducedMotionFallback: {
    staticPose: AIAsyCharacterState;
    disableParallax: boolean;
  };
}

export const MASTER_MASCOT_REGISTRY: Record<'ASY' | 'SYIFA', MasterMascotDefinition> = {
  ASY: {
    characterId: 'ASY',
    displayName: 'Asy',
    name: 'Asy',
    gender: 'boy',
    identity: 'Santri Cilik TK Asy Syifa Tanggul Wetan, Jember',
    uniformIdentity: 'Seragam Krem & Orange TK Asy Syifa, celana cokelat, sepatu kets krem/orange',
    headwear: 'Peci Hitam Nasional khas Indonesia dengan emblem Bintang Asy Syifa',
    masterAsset: '/assets/mascot/asy/ASY_MASTER.png',
    approvedStates: [
      'idle', 'wave', 'speaking', 'thinking', 'happy', 'surprised',
      'raise_hand', 'point_up', 'point_left', 'point_right', 'walk', 'sleepy',
      'greeting', 'reading', 'drawing', 'watering', 'ready_school',
      'thank_you', 'camera', 'guide', 'goodbye', 'pray', 'celebrate',
      'point', 'sleep', 'walking', 'smile', 'look_left', 'look_right', 'sitting', 'standing'
    ],
    description: 'Master Mascot ASY: Anak laki-laki TK Asy Syifa Tanggul Wetan (Peci Hitam, Seragam Krem/Orange).',
    masterComponent: 'MasterMascotRenderer',
    animationCapabilities: ['idle_breathing', 'weight_shift', 'eye_blink', 'hand_wave', 'gentle_bounce', 'speak_gesture'],
    renderTargets: ['opening_experience', 'hero_section', 'interactive_cards', 'mascot_assistant', 'storytelling'],
    accessibilitySettings: {
      ariaLabel: 'Asy — Maskot TK Asy Syifa',
      role: 'img'
    },
    reducedMotionFallback: {
      staticPose: 'idle',
      disableParallax: true
    }
  },
  SYIFA: {
    characterId: 'ASYAH',
    displayName: 'Syifa',
    name: 'Syifa / Asyah',
    gender: 'girl',
    identity: 'Santriwati Cilik TK Asy Syifa Tanggul Wetan, Jember',
    uniformIdentity: 'Seragam Krem & Orange TK Asy Syifa, rok orange, sepatu kets krem/orange',
    headwear: 'Hijab Orange TK Asy Syifa dengan jepit bunga 3-petal pink & emblem emas',
    masterAsset: '/assets/mascot/syifa/SYIFA_MASTER.png',
    approvedStates: [
      'idle', 'wave', 'speaking', 'thinking', 'happy', 'surprised',
      'raise_hand', 'point_up', 'point_left', 'point_right', 'walk', 'sleepy',
      'greeting', 'reading', 'drawing', 'watering', 'ready_school',
      'thank_you', 'camera', 'guide', 'goodbye', 'pray', 'celebrate',
      'point', 'sleep', 'walking', 'smile', 'look_left', 'look_right', 'sitting', 'standing'
    ],
    description: 'Master Mascot SYIFA: Anak perempuan TK Asy Syifa Tanggul Wetan (Hijab Orange, Seragam Krem/Orange).',
    masterComponent: 'MasterMascotRenderer',
    animationCapabilities: ['idle_breathing', 'weight_shift', 'eye_blink', 'hand_wave', 'gentle_bounce', 'speak_gesture'],
    renderTargets: ['opening_experience', 'hero_section', 'interactive_cards', 'mascot_assistant', 'storytelling'],
    accessibilitySettings: {
      ariaLabel: 'Syifa — Maskot TK Asy Syifa',
      role: 'img'
    },
    reducedMotionFallback: {
      staticPose: 'idle',
      disableParallax: true
    }
  }
};

export const AI_ASY_ASSET_REGISTRY: Record<AIAsyCharacterState, AIAsyAssetMeta> = {
  idle: {
    state: 'idle',
    label: 'Idle / Berdiri Anggun',
    assetPath: '/assets/ai-asy/idle.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose berdiri tenang dan ramah menyapa pengunjung.',
    emoji: '😊'
  },
  wave: {
    state: 'wave',
    label: 'Melambaikan Tangan',
    assetPath: '/assets/ai-asy/wave.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose melambaikan tangan dengan penuh kehangatan.',
    emoji: '👋'
  },
  greeting: {
    state: 'greeting',
    label: 'Salam Assalamu\'alaikum',
    assetPath: '/assets/ai-asy/greeting.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menangkupkan tangan di dada memberi salam santun.',
    emoji: '🤲'
  },
  reading: {
    state: 'reading',
    label: 'Membaca Buku Sentra',
    assetPath: '/assets/ai-asy/reading.webp',
    fallbackAspect: 'aspect-[4/3]',
    description: 'Pose memegang buku cerita islami dan membaca.',
    emoji: '📖'
  },
  drawing: {
    state: 'drawing',
    label: 'Menggambar & Mewarnai',
    assetPath: '/assets/ai-asy/drawing.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose memegang kuas melukis keindahan alam.',
    emoji: '🖍'
  },
  watering: {
    state: 'watering',
    label: 'Menyiram Tanaman Taman',
    assetPath: '/assets/ai-asy/watering.webp',
    fallbackAspect: 'aspect-[4/3]',
    description: 'Pose memegang gembor air menyiram bunga taman.',
    emoji: '🌱'
  },
  watching_butterfly: {
    state: 'watching_butterfly',
    label: 'Mengamati Kupu-Kupu',
    assetPath: '/assets/ai-asy/butterfly.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose lembut memperhatikan kupu-kupu hinggap.',
    emoji: '🦋'
  },
  watching_bird: {
    state: 'watching_bird',
    label: 'Mendengar Burung Bernyanyi',
    assetPath: '/assets/ai-asy/bird.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose mendongak mendengar kicauan burung taman.',
    emoji: '🐦'
  },
  ready_school: {
    state: 'ready_school',
    label: 'Siap Berangkat Sekolah',
    assetPath: '/assets/ai-asy/ready_school.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose mengenakan ransel sekolah cilik siap belajar.',
    emoji: '🎒'
  },
  sleepy: {
    state: 'sleepy',
    label: 'Mengantuk / Senja Tenang',
    assetPath: '/assets/ai-asy/sleepy.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose mengusap mata pelan di bawah sinar bulan.',
    emoji: '🌙'
  },
  excited: {
    state: 'excited',
    label: 'Semangat & Antusias',
    assetPath: '/assets/ai-asy/excited.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose tangan ke atas dengan binar mata gembira.',
    emoji: '✨'
  },
  thank_you: {
    state: 'thank_you',
    label: 'Terima Kasih / Syukron',
    assetPath: '/assets/ai-asy/thank_you.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menyentuh dada menyatakan rasa syukur.',
    emoji: '❤️'
  },
  camera: {
    state: 'camera',
    label: 'Membawa Kamera Fotografi',
    assetPath: '/assets/ai-asy/camera.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose membawa kamera memotret kegiatan santri.',
    emoji: '📸'
  },
  guide: {
    state: 'guide',
    label: 'Pemandu & Menyambut (Welcome)',
    assetPath: '/assets/ai-asy/welcome.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menyambut di gerbang dengan gestur terbuka.',
    emoji: '🧭'
  },
  goodbye: {
    state: 'goodbye',
    label: 'Salam Perpisahan (Goodbye)',
    assetPath: '/assets/ai-asy/goodbye.webp',
    fallbackAspect: 'asset-[3/4]',
    description: 'Pose melambaikan tangan di bawah sinar bulan/senja.',
    emoji: '👋'
  },
  thinking: {
    state: 'thinking',
    label: 'Berpikir & Analisis',
    assetPath: '/assets/ai-asy/thinking.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menyentuh dagu merencanakan modul pembelajaran.',
    emoji: '🤔'
  },
  happy: {
    state: 'happy',
    label: 'Gembira & Ceria',
    assetPath: '/assets/ai-asy/happy.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose melompat kecil dengan senyum berseri-seri.',
    emoji: '😊'
  },
  sad: {
    state: 'sad',
    label: 'Empati & Lembut',
    assetPath: '/assets/ai-asy/sad.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose lembut mendengarkan curahan hati santri.',
    emoji: '🥺'
  },
  pray: {
    state: 'pray',
    label: 'Berdoa & Tawadhu',
    assetPath: '/assets/ai-asy/pray.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menengadahkan kedua tangan berdoa khusyuk.',
    emoji: '🤲'
  },
  celebrate: {
    state: 'celebrate',
    label: 'Perayaan & Prestasi',
    assetPath: '/assets/ai-asy/celebrate.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose mengangkat piala atau bunga kelulusan.',
    emoji: '🎉'
  },
  point: {
    state: 'point',
    label: 'Menunjuk Lokasi / Data',
    assetPath: '/assets/ai-asy/point.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menunjuk papan peta/grafik operasional.',
    emoji: '👉'
  },
  sleep: {
    state: 'sleep',
    label: 'Istirahat / Malam Tenang',
    assetPath: '/assets/ai-asy/sleep.webp',
    fallbackAspect: 'aspect-[4/3]',
    description: 'Pose tertidur lelap dengan selimut bintang.',
    emoji: '💤'
  },
  walking: {
    state: 'walking',
    label: 'Berjalan Ceria di Taman',
    assetPath: '/assets/ai-asy/walking.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose berjalan melangkah dengan langkah riang di taman.',
    emoji: '🚶'
  },
  smile: {
    state: 'smile',
    label: 'Tersenyum Ramah & Hangat',
    assetPath: '/assets/ai-asy/smile.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose tersenyum manis dengan tatapan ramah.',
    emoji: '🙂'
  },
  look_left: {
    state: 'look_left',
    label: 'Melihat Ke Kiri Taman',
    assetPath: '/assets/ai-asy/look_left.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose melirik lembut memperhatikan area kiri taman.',
    emoji: '👈'
  },
  look_right: {
    state: 'look_right',
    label: 'Melihat Ke Kanan Taman',
    assetPath: '/assets/ai-asy/look_right.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose melirik lembut memperhatikan area kanan taman.',
    emoji: '👉'
  },
  sitting: {
    state: 'sitting',
    label: 'Duduk Santai Di Bangku Taman',
    assetPath: '/assets/ai-asy/sitting.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose duduk manis di bangku kayu rumah mungil taman.',
    emoji: '🪑'
  },
  standing: {
    state: 'standing',
    label: 'Berdiri Tegak & Anggun',
    assetPath: '/assets/ai-asy/standing.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose berdiri tegap dengan gestur menyambut hangat.',
    emoji: '🧍'
  },
  head_turn: {
    state: 'head_turn',
    label: 'Menoleh Ramah Ke Pengunjung',
    assetPath: '/assets/ai-asy/head_turn.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menoleh lembut menyapa saat dihampiri.',
    emoji: '👀'
  },
  speaking: {
    state: 'speaking',
    label: 'Berbicara & Mengedukasi',
    assetPath: '/assets/ai-asy/idle.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose berbicara ramah dengan gerakan mulut dan tangan.',
    emoji: '🗣️'
  },
  point_up: {
    state: 'point_up',
    label: 'Menunjuk Ke Atas / Langit',
    assetPath: '/assets/ai-asy/point.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menunjuk ke atas dengan antusias.',
    emoji: '☝️'
  },
  point_left: {
    state: 'point_left',
    label: 'Menunjuk Ke Kiri',
    assetPath: '/assets/ai-asy/look_left.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menunjuk ke arah kiri.',
    emoji: '👈'
  },
  point_right: {
    state: 'point_right',
    label: 'Menunjuk Ke Kanan',
    assetPath: '/assets/ai-asy/look_right.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose menunjuk ke arah kanan.',
    emoji: '👉'
  },
  walk: {
    state: 'walk',
    label: 'Berjalan Santai',
    assetPath: '/assets/ai-asy/walking.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose berjalan santai mengelilingi taman.',
    emoji: '🚶'
  },
  surprised: {
    state: 'surprised',
    label: 'Terkejut Bahagia',
    assetPath: '/assets/ai-asy/excited.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose terkejut gembira saat ada hal menarik.',
    emoji: '😲'
  },
  raise_hand: {
    state: 'raise_hand',
    label: 'Mengangkat Tangan Bertanya',
    assetPath: '/assets/ai-asy/wave.webp',
    fallbackAspect: 'aspect-[3/4]',
    description: 'Pose mengangkat tangan dengan santun.',
    emoji: '🙋'
  },
};
