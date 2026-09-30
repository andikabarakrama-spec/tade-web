/**
 * TADE v9.1.0-MCA1 — R912
 * MASTER CHARACTER REGISTRY
 * 
 * Central SSoT Registry for Asy & Syifa
 * Mapping canonical assets, expressions, poses, and metadata.
 */

import { ASY_CANON, SYIFA_CANON, CanonicalCharacterDefinition } from './characterBible';

export type CharacterId = 'ASY' | 'SYIFA';

export type MasterExpressionKey = 
  | 'idle'
  | 'happy'
  | 'laugh'
  | 'confused'
  | 'shy'
  | 'sleepy'
  | 'reading'
  | 'surprised';

export type MasterPoseKey = 
  | 'idle-stand' | 'berdiri'
  | 'wave' | 'melambai'
  | 'sit' | 'duduk'
  | 'peek' | 'ngintip'
  | 'read-iqro' | 'membaca-iqro'
  | 'butterfly' | 'mengejar-kupu-kupu'
  | 'peci-adjust' | 'merapikan-peci'
  | 'hijab-hold' | 'memegang-ujung-hijab'
  | 'swing-feet' | 'menggoyang-kaki'
  | 'point'
  | 'pray'
  | 'thumbs-up';

export interface CharacterAssetMapping {
  masterSvg: string;
  idleWebp: string;
  expressionsWebp: string;
  posesWebp: string;
  spriteWebp: string;
  svgMaster: string;
  png4k: string;
  webpOptimized: string;
  spriteSheet: string;
  fallbackSvgPath: string;
}

export interface CharacterExpressionConfig {
  key: MasterExpressionKey;
  label: string;
  eyeState: 'OPEN' | 'SPARKLING' | 'CLOSED_HAPPY' | 'WINK' | 'DROWSY' | 'WIDE';
  mouthState: 'SMILE_GENTLE' | 'BIG_GRIN' | 'LAUGH_OPEN' | 'SLIGHT_CURVE' | 'O_SHAPE' | 'CLOSED';
  blushLevel: number; // 0.0 to 1.0
  soundCue?: string;
  durationMs: number;
}

export interface CharacterPoseConfig {
  key: MasterPoseKey;
  label: string;
  description: string;
  armLeftAngle: number; // degrees
  armRightAngle: number;
  headTiltAngle: number;
  bodyBobOffset: number;
  footSwingAngle?: number;
}

export interface RegisteredMasterCharacter {
  definition: CanonicalCharacterDefinition;
  assets: CharacterAssetMapping;
  expressions: Record<MasterExpressionKey, CharacterExpressionConfig>;
  poses: Record<MasterPoseKey, CharacterPoseConfig>;
}

export const ASY_EXPRESSIONS: Record<MasterExpressionKey, CharacterExpressionConfig> = {
  idle: {
    key: 'idle',
    label: 'Tenang Beradab',
    eyeState: 'OPEN',
    mouthState: 'SMILE_GENTLE',
    blushLevel: 0.4,
    durationMs: 4000
  },
  happy: {
    key: 'happy',
    label: 'Ceria Bersyukur',
    eyeState: 'SPARKLING',
    mouthState: 'BIG_GRIN',
    blushLevel: 0.7,
    durationMs: 3000
  },
  laugh: {
    key: 'laugh',
    label: 'Tertawa Riang',
    eyeState: 'CLOSED_HAPPY',
    mouthState: 'LAUGH_OPEN',
    blushLevel: 0.8,
    durationMs: 2500
  },
  confused: {
    key: 'confused',
    label: 'Tanya Pikir',
    eyeState: 'WIDE',
    mouthState: 'SLIGHT_CURVE',
    blushLevel: 0.3,
    durationMs: 3500
  },
  shy: {
    key: 'shy',
    label: 'Malu Santun',
    eyeState: 'DROWSY',
    mouthState: 'SMILE_GENTLE',
    blushLevel: 0.95,
    durationMs: 3000
  },
  sleepy: {
    key: 'sleepy',
    label: 'Mengantuk Tenang',
    eyeState: 'DROWSY',
    mouthState: 'CLOSED',
    blushLevel: 0.3,
    durationMs: 5000
  },
  reading: {
    key: 'reading',
    label: 'Kusyuk Mengaji',
    eyeState: 'OPEN',
    mouthState: 'SLIGHT_CURVE',
    blushLevel: 0.5,
    durationMs: 4500
  },
  surprised: {
    key: 'surprised',
    label: 'Takjub MasyaAllah',
    eyeState: 'WIDE',
    mouthState: 'O_SHAPE',
    blushLevel: 0.6,
    durationMs: 2000
  }
};

export const SYIFA_EXPRESSIONS: Record<MasterExpressionKey, CharacterExpressionConfig> = {
  idle: {
    key: 'idle',
    label: 'Santun Anggun',
    eyeState: 'OPEN',
    mouthState: 'SMILE_GENTLE',
    blushLevel: 0.5,
    durationMs: 4000
  },
  happy: {
    key: 'happy',
    label: 'Senyum Ceria',
    eyeState: 'SPARKLING',
    mouthState: 'BIG_GRIN',
    blushLevel: 0.8,
    durationMs: 3000
  },
  laugh: {
    key: 'laugh',
    label: 'Gembira Halus',
    eyeState: 'CLOSED_HAPPY',
    mouthState: 'LAUGH_OPEN',
    blushLevel: 0.85,
    durationMs: 2500
  },
  confused: {
    key: 'confused',
    label: 'Bertanya Lembut',
    eyeState: 'WIDE',
    mouthState: 'SLIGHT_CURVE',
    blushLevel: 0.4,
    durationMs: 3500
  },
  shy: {
    key: 'shy',
    label: 'Malu Anggun',
    eyeState: 'DROWSY',
    mouthState: 'SMILE_GENTLE',
    blushLevel: 0.9,
    durationMs: 3000
  },
  sleepy: {
    key: 'sleepy',
    label: 'Istirahat Berkah',
    eyeState: 'DROWSY',
    mouthState: 'CLOSED',
    blushLevel: 0.35,
    durationMs: 5000
  },
  reading: {
    key: 'reading',
    label: 'Tadarus Al-Qur\'an',
    eyeState: 'OPEN',
    mouthState: 'SLIGHT_CURVE',
    blushLevel: 0.6,
    durationMs: 4500
  },
  surprised: {
    key: 'surprised',
    label: 'Kagum Tabarakallah',
    eyeState: 'WIDE',
    mouthState: 'O_SHAPE',
    blushLevel: 0.65,
    durationMs: 2000
  }
};

export const CANONICAL_POSES: Record<MasterPoseKey, CharacterPoseConfig> = {
  'idle-stand': {
    key: 'idle-stand',
    label: 'Berdiri Rapi',
    description: 'Pose dasar bersahabat siap mendampingi proses belajar santri.',
    armLeftAngle: 0,
    armRightAngle: 0,
    headTiltAngle: 0,
    bodyBobOffset: 0
  },
  'berdiri': {
    key: 'berdiri',
    label: 'Berdiri Rapi',
    description: 'Pose dasar bersahabat santri siap mendampingi proses belajar.',
    armLeftAngle: 0,
    armRightAngle: 0,
    headTiltAngle: 0,
    bodyBobOffset: 0
  },
  'wave': {
    key: 'wave',
    label: 'Melambai Ramah',
    description: 'Tangan kanan terangkat melambaikan salam hangat kepada pengunjung.',
    armLeftAngle: 0,
    armRightAngle: 35,
    headTiltAngle: 4,
    bodyBobOffset: -2
  },
  'melambai': {
    key: 'melambai',
    label: 'Melambai Ramah',
    description: 'Tangan terangkat melambaikan salam hangat islami kepada santri dan wali murid.',
    armLeftAngle: 0,
    armRightAngle: 35,
    headTiltAngle: 4,
    bodyBobOffset: -2
  },
  'sit': {
    key: 'sit',
    label: 'Duduk Santun',
    description: 'Duduk bersila rapi menyimak penjelasan guru di kelas.',
    armLeftAngle: 15,
    armRightAngle: 15,
    headTiltAngle: 2,
    bodyBobOffset: 3
  },
  'duduk': {
    key: 'duduk',
    label: 'Duduk Santun',
    description: 'Duduk bersila rapi mendengarkan tausiyah dan hafalan Al-Qur\'an.',
    armLeftAngle: 15,
    armRightAngle: 15,
    headTiltAngle: 2,
    bodyBobOffset: 3
  },
  'peek': {
    key: 'peek',
    label: 'Ngintip Penasaran',
    description: 'Mengintip ramah dari sudut layar/kartu modul.',
    armLeftAngle: -10,
    armRightAngle: 25,
    headTiltAngle: 8,
    bodyBobOffset: -1
  },
  'ngintip': {
    key: 'ngintip',
    label: 'Ngintip Ceria',
    description: 'Mengintip dengan riang dari pojok navigasi aplikasi.',
    armLeftAngle: -10,
    armRightAngle: 25,
    headTiltAngle: 8,
    bodyBobOffset: -1
  },
  'read-iqro': {
    key: 'read-iqro',
    label: 'Membaca Iqro / Al-Qur\'an',
    description: 'Kedua tangan memegang mushaf suci dengan penuh khusyuk.',
    armLeftAngle: 25,
    armRightAngle: -25,
    headTiltAngle: 6,
    bodyBobOffset: 1
  },
  'membaca-iqro': {
    key: 'membaca-iqro',
    label: 'Membaca Iqro & Al-Qur\'an',
    description: 'Kedua tangan memegang mushaf suci mengaji tartil di pojok tahfidz.',
    armLeftAngle: 25,
    armRightAngle: -25,
    headTiltAngle: 6,
    bodyBobOffset: 1
  },
  'butterfly': {
    key: 'butterfly',
    label: 'Mengejar Kupu-kupu',
    description: 'Mata berbinar memandang kupu-kupu indah di taman galeri sekolah.',
    armLeftAngle: 20,
    armRightAngle: 45,
    headTiltAngle: -6,
    bodyBobOffset: -4
  },
  'mengejar-kupu-kupu': {
    key: 'mengejar-kupu-kupu',
    label: 'Mengejar Kupu-kupu Ceria',
    description: 'Bermain dengan kupu-kupu warna-warni di taman kreasi galeri santri.',
    armLeftAngle: 20,
    armRightAngle: 45,
    headTiltAngle: -6,
    bodyBobOffset: -4
  },
  'peci-adjust': {
    key: 'peci-adjust',
    label: 'Merapikan Peci',
    description: 'Tangan memegang peci hitam zamrud membetulkan letak songkok adab.',
    armLeftAngle: 0,
    armRightAngle: 60,
    headTiltAngle: -2,
    bodyBobOffset: -1
  },
  'merapikan-peci': {
    key: 'merapikan-peci',
    label: 'Merapikan Peci Hitam Zamrud',
    description: 'Merapikan songkok santri penuntut ilmu dengan teliti sebelum shalat.',
    armLeftAngle: 0,
    armRightAngle: 60,
    headTiltAngle: -2,
    bodyBobOffset: -1
  },
  'hijab-hold': {
    key: 'hijab-hold',
    label: 'Memegang Ujung Hijab',
    description: 'Tangan santun memegang ujung hijab syar\'i dengan rasa takzim.',
    armLeftAngle: 20,
    armRightAngle: 20,
    headTiltAngle: 3,
    bodyBobOffset: 1
  },
  'memegang-ujung-hijab': {
    key: 'memegang-ujung-hijab',
    label: 'Memegang Ujung Hijab Syar\'i',
    description: 'Santun merapikan jilbab menutup dada dengan akhlak terpuji.',
    armLeftAngle: 20,
    armRightAngle: 20,
    headTiltAngle: 3,
    bodyBobOffset: 1
  },
  'swing-feet': {
    key: 'swing-feet',
    label: 'Menggoyang Kaki Ceria',
    description: 'Duduk santai di atas dock mengayunkan kaki dengan riang saat loading/idle.',
    armLeftAngle: 10,
    armRightAngle: 10,
    headTiltAngle: 2,
    bodyBobOffset: 2,
    footSwingAngle: 18
  },
  'menggoyang-kaki': {
    key: 'menggoyang-kaki',
    label: 'Menggoyang Kaki Santai',
    description: 'Mengayunkan kaki ceria di tepi dock sembari menunggu data selesai dimuat.',
    armLeftAngle: 10,
    armRightAngle: 10,
    headTiltAngle: 2,
    bodyBobOffset: 2,
    footSwingAngle: 18
  },
  'point': {
    key: 'point',
    label: 'Menunjuk Antusias',
    description: 'Menunjuk form registrasi PPDB atau modul penting.',
    armLeftAngle: 0,
    armRightAngle: 55,
    headTiltAngle: -3,
    bodyBobOffset: -3
  },
  'pray': {
    key: 'pray',
    label: 'Berdoa Khusyuk',
    description: 'Menengadahkan kedua telapak tangan mengharap ridha Allah SWT.',
    armLeftAngle: 30,
    armRightAngle: -30,
    headTiltAngle: 4,
    bodyBobOffset: 0
  },
  'thumbs-up': {
    key: 'thumbs-up',
    label: 'Apresiasi Santri Hebat',
    description: 'Mengacungkan jempol bangga atas pencapaian hafalan santri.',
    armLeftAngle: 0,
    armRightAngle: 45,
    headTiltAngle: 3,
    bodyBobOffset: -2
  }
};

export const MASTER_CHARACTER_REGISTRY: Record<CharacterId, RegisteredMasterCharacter> = {
  ASY: {
    definition: ASY_CANON,
    assets: {
      masterSvg: '/src/assets/master-characters/asy/master.svg',
      idleWebp: '/src/assets/master-characters/asy/idle.webp',
      expressionsWebp: '/src/assets/master-characters/asy/expressions.webp',
      posesWebp: '/src/assets/master-characters/asy/poses.webp',
      spriteWebp: '/src/assets/master-characters/asy/sprite.webp',
      svgMaster: '/src/assets/master-characters/asy/master.svg',
      png4k: '/src/assets/master-characters/asy/asy-4k.png',
      webpOptimized: '/src/assets/master-characters/asy/idle.webp',
      spriteSheet: '/src/assets/master-characters/asy/sprite.webp',
      fallbackSvgPath: 'ASY_VECTOR_CANON'
    },
    expressions: ASY_EXPRESSIONS,
    poses: CANONICAL_POSES
  },
  SYIFA: {
    definition: SYIFA_CANON,
    assets: {
      masterSvg: '/src/assets/master-characters/syifa/master.svg',
      idleWebp: '/src/assets/master-characters/syifa/idle.webp',
      expressionsWebp: '/src/assets/master-characters/syifa/expressions.webp',
      posesWebp: '/src/assets/master-characters/syifa/poses.webp',
      spriteWebp: '/src/assets/master-characters/syifa/sprite.webp',
      svgMaster: '/src/assets/master-characters/syifa/master.svg',
      png4k: '/src/assets/master-characters/syifa/syifa-4k.png',
      webpOptimized: '/src/assets/master-characters/syifa/idle.webp',
      spriteSheet: '/src/assets/master-characters/syifa/sprite.webp',
      fallbackSvgPath: 'SYIFA_VECTOR_CANON'
    },
    expressions: SYIFA_EXPRESSIONS,
    poses: CANONICAL_POSES
  }
};

export function getMasterCharacter(id: CharacterId): RegisteredMasterCharacter {
  return MASTER_CHARACTER_REGISTRY[id];
}

export function getAllMasterCharacters(): RegisteredMasterCharacter[] {
  return Object.values(MASTER_CHARACTER_REGISTRY);
}

export function isCanonicalCharacter(id: string): id is CharacterId {
  return id === 'ASY' || id === 'SYIFA';
}
