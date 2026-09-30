/**
 * TADE FEATURE ROLLOUT SERVICE — SPRINT G7 (P2)
 * Dynamic, zero-redeploy gradual feature deployment manager.
 * Stages: Alpha (Internal), Beta (Pilot), Preview (Selected), Limited (Cohort), Public (100% GA).
 */

export type RolloutStage = 'ALPHA' | 'BETA' | 'PREVIEW' | 'LIMITED' | 'PUBLIC';

export interface RolloutFeature {
  id: string;
  name: string;
  category: 'LIVING_ECOSYSTEM' | 'COMMUNICATION' | 'ACADEMIC' | 'MEDIA' | 'SECURITY';
  stage: RolloutStage;
  rolloutPercentage: number; // 0 - 100
  allowedRoles: string[]; // ['WALI_MURID', 'GURU', 'KEPSEK', 'YAYASAN', 'ADMIN']
  targetCohorts: string[]; // ['TK_A1', 'TK_A2', 'TK_B1', 'TK_B2', 'PLAYGROUP', 'DEWAN_GURU']
  enabled: boolean;
  description: string;
  lastUpdated: string;
  updatedBy: string;
}

const STORAGE_KEY = 'tade_feature_rollout_registry_v10_4';

export const DEFAULT_ROLLOUT_FEATURES: RolloutFeature[] = [
  {
    id: 'feat-living-messenger-v2',
    name: 'Living Messenger Enterprise & Butterfly Delivery',
    category: 'COMMUNICATION',
    stage: 'PUBLIC',
    rolloutPercentage: 100,
    allowedRoles: ['WALI_MURID', 'GURU', 'KEPSEK', 'YAYASAN', 'ADMIN'],
    targetCohorts: ['TK_A1', 'TK_A2', 'TK_B1', 'TK_B2', 'PLAYGROUP', 'DEWAN_GURU'],
    enabled: true,
    description: 'Pesan interaktif dengan animasi kupu-kupu berkah, voice bubble visualizer, dan Islamic reactions.',
    lastUpdated: '2026-08-21T22:40:00+07:00',
    updatedBy: 'Founder Andika'
  },
  {
    id: 'feat-parent-community-hub',
    name: 'Parent Community Hub & Paguyuban Kelas',
    category: 'COMMUNICATION',
    stage: 'PUBLIC',
    rolloutPercentage: 100,
    allowedRoles: ['WALI_MURID', 'GURU', 'KEPSEK', 'YAYASAN'],
    targetCohorts: ['TK_A1', 'TK_A2', 'TK_B1', 'TK_B2', 'PLAYGROUP'],
    enabled: true,
    description: 'Ruang interaksi wali murid per kelas, Bangku Wali, dan koordinasi kegiatan beradab tanpa kebocoran nomor HP.',
    lastUpdated: '2026-08-21T22:40:00+07:00',
    updatedBy: 'Founder Andika'
  },
  {
    id: 'feat-living-memory-capsule',
    name: 'Living Memory Engine & Jejak Langkah Ananda',
    category: 'LIVING_ECOSYSTEM',
    stage: 'PUBLIC',
    rolloutPercentage: 100,
    allowedRoles: ['WALI_MURID', 'GURU', 'KEPSEK', 'YAYASAN'],
    targetCohorts: ['TK_A1', 'TK_A2', 'TK_B1', 'TK_B2', 'PLAYGROUP'],
    enabled: true,
    description: 'Sintesis linimasa kenangan indah: pohon karakter, munajat doa orang tua, dan momen harian sentra.',
    lastUpdated: '2026-08-21T22:40:00+07:00',
    updatedBy: 'Founder Andika'
  },
  {
    id: 'feat-school-clone-kit',
    name: 'Multi-School Sovereign Clone Kit Wizard',
    category: 'SECURITY',
    stage: 'PUBLIC',
    rolloutPercentage: 100,
    allowedRoles: ['KEPSEK', 'YAYASAN', 'ADMIN'],
    targetCohorts: ['DEWAN_GURU'],
    enabled: true,
    description: 'Wizard replikasi sistem institusi mandiri untuk cabang sekolah baru dengan Brand DNA & isolasi database bersih.',
    lastUpdated: '2026-08-21T22:40:00+07:00',
    updatedBy: 'Founder Andika'
  },
  {
    id: 'feat-micro-interactions',
    name: 'Living Micro Interaction Engine (60 FPS)',
    category: 'LIVING_ECOSYSTEM',
    stage: 'PUBLIC',
    rolloutPercentage: 100,
    allowedRoles: ['WALI_MURID', 'GURU', 'KEPSEK', 'YAYASAN', 'ADMIN'],
    targetCohorts: ['TK_A1', 'TK_A2', 'TK_B1', 'TK_B2', 'PLAYGROUP', 'DEWAN_GURU'],
    enabled: true,
    description: 'Sentuhan mikro responsif: ripple emerald, magnetic buttons, card lift physics, dan achievement confetti.',
    lastUpdated: '2026-08-21T22:40:00+07:00',
    updatedBy: 'Founder Andika'
  },
  {
    id: 'feat-dual-photo-avatar',
    name: 'Dual Photo Mode Avatar Studio',
    category: 'MEDIA',
    stage: 'PUBLIC',
    rolloutPercentage: 100,
    allowedRoles: ['WALI_MURID', 'GURU', 'KEPSEK', 'YAYASAN', 'ADMIN'],
    targetCohorts: ['TK_A1', 'TK_A2', 'TK_B1', 'TK_B2', 'PLAYGROUP', 'DEWAN_GURU'],
    enabled: true,
    description: 'Mode ganda: foto resmi arsip kependidikan SIM vs avatar animasi lembut dengan kompresi WebP.',
    lastUpdated: '2026-08-21T22:40:00+07:00',
    updatedBy: 'Founder Andika'
  },
  {
    id: 'feat-ai-sentra-transcription',
    name: 'Auto-Transcription Voice Anekdot Sentra',
    category: 'ACADEMIC',
    stage: 'BETA',
    rolloutPercentage: 50,
    allowedRoles: ['GURU', 'KEPSEK'],
    targetCohorts: ['TK_B1', 'TK_B2', 'DEWAN_GURU'],
    enabled: true,
    description: 'Transkripsi audio rekaman observasi ustadzah menjadi format narasi Kurikulum Merdeka PAUD.',
    lastUpdated: '2026-08-21T22:40:00+07:00',
    updatedBy: 'Academic Council'
  }
];

class FeatureRolloutService {
  private static instance: FeatureRolloutService | null = null;
  private features: RolloutFeature[];
  private listeners: Array<(features: RolloutFeature[]) => void> = [];

  private constructor() {
    this.features = this.loadFromStorage();
  }

  public static getInstance(): FeatureRolloutService {
    if (!FeatureRolloutService.instance) {
      FeatureRolloutService.instance = new FeatureRolloutService();
    }
    return FeatureRolloutService.instance;
  }

  private loadFromStorage(): RolloutFeature[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [...DEFAULT_ROLLOUT_FEATURES];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [...DEFAULT_ROLLOUT_FEATURES];
    } catch {
      return [...DEFAULT_ROLLOUT_FEATURES];
    }
  }

  public getFeatures(): RolloutFeature[] {
    return [...this.features];
  }

  public getFeature(featureId: string): RolloutFeature | undefined {
    return this.features.find(f => f.id === featureId);
  }

  public isFeatureEnabledFor(featureId: string, role = 'WALI_MURID', cohort = 'TK_B1'): boolean {
    const feature = this.getFeature(featureId);
    if (!feature || !feature.enabled) return false;
    if (feature.stage === 'PUBLIC') return true;

    const roleMatch = feature.allowedRoles.includes(role);
    const cohortMatch = feature.targetCohorts.includes(cohort);

    if (feature.stage === 'ALPHA') {
      return role === 'ADMIN' || role === 'YAYASAN';
    }

    if (feature.stage === 'BETA' || feature.stage === 'PREVIEW') {
      return roleMatch && (feature.rolloutPercentage > 0);
    }

    if (feature.stage === 'LIMITED') {
      return roleMatch && cohortMatch;
    }

    return true;
  }

  public updateFeature(
    featureId: string,
    updates: Partial<Omit<RolloutFeature, 'id'>>,
    updatedBy = 'Founder'
  ): void {
    this.features = this.features.map(f => {
      if (f.id === featureId) {
        return {
          ...f,
          ...updates,
          lastUpdated: new Date().toISOString(),
          updatedBy
        };
      }
      return f;
    });
    this.persist();
  }

  public toggleFeature(featureId: string, enabled: boolean, updatedBy = 'Founder'): void {
    this.updateFeature(featureId, { enabled }, updatedBy);
  }

  public setStage(featureId: string, stage: RolloutStage, updatedBy = 'Founder'): void {
    let percentage = 100;
    if (stage === 'ALPHA') percentage = 10;
    if (stage === 'BETA') percentage = 25;
    if (stage === 'PREVIEW') percentage = 50;
    if (stage === 'LIMITED') percentage = 75;
    if (stage === 'PUBLIC') percentage = 100;

    this.updateFeature(featureId, { stage, rolloutPercentage: percentage }, updatedBy);
  }

  public setPercentage(featureId: string, percentage: number, updatedBy = 'Founder'): void {
    this.updateFeature(featureId, { rolloutPercentage: Math.max(0, Math.min(100, percentage)) }, updatedBy);
  }

  public subscribe(fn: (features: RolloutFeature[]) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.features));
      this.notify();
    } catch (e) {
      console.warn('Failed to persist Feature Rollout:', e);
    }
  }

  private notify(): void {
    const list = this.getFeatures();
    this.listeners.forEach(fn => {
      try {
        fn(list);
      } catch (e) {
        console.error('Rollout listener error:', e);
      }
    });
  }
}

export const featureRolloutService = FeatureRolloutService.getInstance();
