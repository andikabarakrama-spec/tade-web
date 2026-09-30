/**
 * TADE 3D RUNTIME INTEGRATION — SEMANTIC ANIMATION BRIDGE
 * 
 * Architectural Contract:
 * - Pure & Declarative Registry
 * - Zero Side Effects, Zero Business Logic, Zero Firebase Dependencies
 * - Maps TADE High-Level Semantic Animation Triggers to Master GLB Skeletal Clips
 * 
 * Master Asset Contract (READ-ONLY):
 * - SYIFA: /assets/mascot/syifa/SYIFA_TADE_MASTER.glb (222 bones, Rigify Humanoid)
 * - ASY:   /assets/mascot/asy/ASY_TADE_MASTER.glb   (41 bones, Humanoid)
 */

export type MascotAnimation = 'idle' | 'happy' | 'nod' | 'wave';

export type Mascot3DCharacterId = 'SYIFA' | 'ASY';

export interface Mascot3DAssetSpec {
  characterId: Mascot3DCharacterId;
  assetPath: string;
  defaultClip: string;
  clipMap: Record<MascotAnimation, string>;
  totalBones: number;
  rigType: 'RIGIFY_HUMANOID' | 'CUSTOM_HUMANOID';
}

export const MASCOT_3D_ASSET_SPECS: Record<Mascot3DCharacterId, Mascot3DAssetSpec> = {
  SYIFA: {
    characterId: 'SYIFA',
    assetPath: '/assets/mascot/syifa/SYIFA_TADE_MASTER.glb',
    defaultClip: 'SYIFA_IDLE',
    clipMap: {
      idle: 'SYIFA_IDLE',
      happy: 'SYIFA_HAPPY',
      nod: 'SYIFA_NOD',
      wave: 'SYIFA_WAVE'
    },
    totalBones: 222,
    rigType: 'RIGIFY_HUMANOID'
  },
  ASY: {
    characterId: 'ASY',
    assetPath: '/assets/mascot/asy/ASY_TADE_MASTER.glb',
    defaultClip: 'ASY_IDLE',
    clipMap: {
      idle: 'ASY_IDLE',
      happy: 'ASY_HAPPY',
      nod: 'ASY_NOD',
      wave: 'ASY_WAVE'
    },
    totalBones: 41,
    rigType: 'CUSTOM_HUMANOID'
  }
};

/**
 * Resolves a semantic animation name to the exact skeletal clip name of the target GLB.
 * Guarantees graceful fallback to the character's default IDLE clip if missing or unrecognized.
 */
export function resolveMascot3DClip(
  characterId: Mascot3DCharacterId,
  semanticAnimation: MascotAnimation | string
): string {
  const spec = MASCOT_3D_ASSET_SPECS[characterId];
  if (!spec) {
    return 'SYIFA_IDLE';
  }

  const validKey = semanticAnimation as MascotAnimation;
  if (validKey in spec.clipMap) {
    return spec.clipMap[validKey];
  }

  // Graceful degradation fallback
  return spec.defaultClip;
}

/**
 * Checks if an animation clip name belongs to a character's registered clip set.
 */
export function isValidMascot3DClip(characterId: Mascot3DCharacterId, clipName: string): boolean {
  const spec = MASCOT_3D_ASSET_SPECS[characterId];
  if (!spec) return false;
  return Object.values(spec.clipMap).includes(clipName);
}

/**
 * Returns the public URL/path for the character's production master GLB asset.
 */
export function getMascot3DAssetPath(characterId: Mascot3DCharacterId): string {
  const spec = MASCOT_3D_ASSET_SPECS[characterId];
  return spec ? spec.assetPath : '';
}

/**
 * Deterministically maps TADE G20/G43/G45 behavior types, movement styles, or expressions
 * to the canonical semantic 3D animation vocabulary ('idle' | 'happy' | 'nod' | 'wave').
 */
export function mapBehaviorToMascotAnimation(
  behavior?: string,
  movement?: string,
  expression?: string
): MascotAnimation {
  const b = (behavior || '').toUpperCase();
  const m = (movement || '').toUpperCase();
  const e = (expression || '').toUpperCase();

  // Wave family
  if (
    b === 'WAVE' ||
    b === 'WAVE_FRIEND' ||
    b === 'GREET_FRIEND' ||
    b === 'FAREWELL' ||
    m === 'LAMBAIAN_TANGAN'
  ) {
    return 'wave';
  }

  // Nod / Focus / Read / Think family
  if (
    b === 'NOD' ||
    b === 'READ' ||
    b === 'WRITE' ||
    b === 'THINKING' ||
    b === 'BOW' ||
    b === 'CIRCLE_SIT' ||
    m === 'ANGGUKAN_KEPALA' ||
    m === 'ANGGUK_SANTUN' ||
    e === 'BERPIKIR' ||
    e === 'FOKUS'
  ) {
    return 'nod';
  }

  // Happy / Joy / Jump / Celebrate family
  if (
    b === 'JUMP' ||
    b === 'CLAP' ||
    b === 'TWIRL' ||
    b === 'LAUGH' ||
    b === 'LAUGH_TOGETHER' ||
    b === 'HIGH_FIVE' ||
    b === 'DANCE' ||
    b === 'RUN' ||
    m === 'LONCAT_GEMBIRA' ||
    m === 'PUTAR_CERIA' ||
    e === 'TERTAWA' ||
    e === 'ANTUSIAS'
  ) {
    return 'happy';
  }

  // Default / Idle family (IDLE, BLINK, MICRO_EMOTION, DIAM, LANGKAH_KECIL, etc.)
  return 'idle';
}
