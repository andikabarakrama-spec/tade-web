/**
 * TADE v9.5.0-MCA5 — R951
 * ENVIRONMENTAL CONTEXT ADAPTER
 * 
 * Bridges natural school environment factors (time of day, sunlight tone,
 * sky ambiance, weather mood) into character cinematic presentation.
 * 
 * Does NOT create an external weather engine. Uses local time & context signals.
 */

import { CharacterId } from './masterCharacterRegistry';

export type AmbientLightingMode = 'DAWN_GOLD' | 'DAY_BRIGHT' | 'AFTERNOON_WARM' | 'DUSK_PEACEFUL' | 'NIGHT_CALM' | 'SOFT_RAIN';

export interface EnvironmentalAtmosphere {
  mode: AmbientLightingMode;
  label: string;
  sunlightAngleDeg: number;
  colorTemperatureK: number;
  ambientLightHex: string;
  shadowIntensity: number; // 0.0 to 1.0
  skyGradient: [string, string];
  islamicNuance: string;
  recommendedScene: string;
}

export const ATMOSPHERE_PROFILES: Record<AmbientLightingMode, EnvironmentalAtmosphere> = {
  DAWN_GOLD: {
    mode: 'DAWN_GOLD',
    label: 'Fajar Emas (Subuh - Pagi)',
    sunlightAngleDeg: 15,
    colorTemperatureK: 3500,
    ambientLightHex: '#FEF3C7',
    shadowIntensity: 0.35,
    skyGradient: ['#FDE68A', '#F59E0B'],
    islamicNuance: 'Keberkahan awal hari saat malaikat turun membawa rahmat.',
    recommendedScene: 'Gerbang Sambut Santri'
  },
  DAY_BRIGHT: {
    mode: 'DAY_BRIGHT',
    label: 'Cerah Berlimpah (Pagi - Siang)',
    sunlightAngleDeg: 65,
    colorTemperatureK: 5500,
    ambientLightHex: '#F0FDF4',
    shadowIntensity: 0.5,
    skyGradient: ['#BAE6FD', '#38BDF8'],
    islamicNuance: 'Semangat menuntut ilmu dan beramal sholeh di siang hari.',
    recommendedScene: 'Taman Bermain Santri'
  },
  AFTERNOON_WARM: {
    mode: 'AFTERNOON_WARM',
    label: 'Asar Hangat (Sore)',
    sunlightAngleDeg: 35,
    colorTemperatureK: 4000,
    ambientLightHex: '#FFEDD5',
    shadowIntensity: 0.45,
    skyGradient: ['#FDBA74', '#EA580C'],
    islamicNuance: 'Suasana syahdu mengaji Iqro dan muroja\'ah sore hari.',
    recommendedScene: 'Sentra Tahfidz'
  },
  DUSK_PEACEFUL: {
    mode: 'DUSK_PEACEFUL',
    label: 'Senja Maghrib (Maghrib - Isya)',
    sunlightAngleDeg: 8,
    colorTemperatureK: 2800,
    ambientLightHex: '#FCE7F3',
    shadowIntensity: 0.25,
    skyGradient: ['#C084FC', '#6B21A8'],
    islamicNuance: 'Panggilan adzan Maghrib dan ketenangan hati berdzikir.',
    recommendedScene: 'Musholla Santri'
  },
  NIGHT_CALM: {
    mode: 'NIGHT_CALM',
    label: 'Malam Teduh (Isya - Malam)',
    sunlightAngleDeg: 0,
    colorTemperatureK: 6500,
    ambientLightHex: '#E0E7FF',
    shadowIntensity: 0.15,
    skyGradient: ['#1E1B4B', '#0F172A'],
    islamicNuance: 'Istirahat malam dalam perlindungan dan penjagaan Allah SWT.',
    recommendedScene: 'Keluarga Santri'
  },
  SOFT_RAIN: {
    mode: 'SOFT_RAIN',
    label: 'Hujan Rahmat (Sejuk)',
    sunlightAngleDeg: 45,
    colorTemperatureK: 4800,
    ambientLightHex: '#E2E8F0',
    shadowIntensity: 0.2,
    skyGradient: ['#94A3B8', '#475569'],
    islamicNuance: 'Doa mustajab saat turunnya hujan berkah pembawa kesuburan.',
    recommendedScene: 'Serambi Belajar'
  }
};

export class EnvironmentalContextAdapter {
  private manualOverride: AmbientLightingMode | null = null;

  public setManualOverride(mode: AmbientLightingMode | null): void {
    this.manualOverride = mode;
  }

  public getAtmosphere(): EnvironmentalAtmosphere {
    if (this.manualOverride) {
      return ATMOSPHERE_PROFILES[this.manualOverride];
    }

    const hour = new Date().getHours();
    if (hour >= 4 && hour < 7) return ATMOSPHERE_PROFILES.DAWN_GOLD;
    if (hour >= 7 && hour < 14) return ATMOSPHERE_PROFILES.DAY_BRIGHT;
    if (hour >= 14 && hour < 17) return ATMOSPHERE_PROFILES.AFTERNOON_WARM;
    if (hour >= 17 && hour < 19) return ATMOSPHERE_PROFILES.DUSK_PEACEFUL;
    return ATMOSPHERE_PROFILES.NIGHT_CALM;
  }
}

export const defaultEnvironmentalAdapter = new EnvironmentalContextAdapter();
