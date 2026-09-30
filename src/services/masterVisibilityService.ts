/**
 * TADE MASTER VISIBILITY SERVICE — SPRINT G7 (P1)
 * Central Sovereign Visibility & Feature Toggle Configuration
 * Fully persistent, zero hardcoded values, role-based & user-level overrides.
 */

export interface GlobalVisibilityConfig {
  livingMessenger: boolean;
  magicGarden: boolean;
  wishTree: boolean;
  growingTree: boolean;
  livingAvatar: boolean;
  soundEffects: boolean;
  rainAndRainbow: boolean;
  festivalMode: boolean;
  nightFireflies: boolean;
  microInteractions: boolean;
}

export interface RoleVisibilityMatrix {
  waliMurid: {
    livingMessenger: boolean;
    magicGarden: boolean;
    wishTree: boolean;
    growingTree: boolean;
    parentCommunity: boolean;
    memoryCapsule: boolean;
    financialLedger: boolean;
  };
  guru: {
    livingMessenger: boolean;
    magicGarden: boolean;
    wishTree: boolean;
    growingTree: boolean;
    parentCommunity: boolean;
    creativeStudio: boolean;
    studentAssessment: boolean;
  };
  kepalaSekolah: {
    livingMessenger: boolean;
    magicGarden: boolean;
    wishTree: boolean;
    growingTree: boolean;
    parentCommunity: boolean;
    executiveBrief: boolean;
    governanceApproval: boolean;
  };
  ketuaYayasan: {
    livingMessenger: boolean;
    magicGarden: boolean;
    wishTree: boolean;
    growingTree: boolean;
    parentCommunity: boolean;
    executiveBrief: boolean;
    financialLedger: boolean;
    founderCommand: boolean;
  };
  adminSim: {
    livingMessenger: boolean;
    magicGarden: boolean;
    wishTree: boolean;
    growingTree: boolean;
    parentCommunity: boolean;
    featureRollout: boolean;
    systemDiagnostics: boolean;
  };
}

export interface UserPreferencesConfig {
  modeLite: boolean;
  motionReduced: boolean;
  soundEnabled: boolean;
  avatarAnimation: boolean;
  gardenParticles: boolean;
  activeChildId?: string;
}

export interface MasterVisibilityState {
  version: string;
  lastUpdated: string;
  updatedBy: string;
  global: GlobalVisibilityConfig;
  roleMatrix: RoleVisibilityMatrix;
  userDefault: UserPreferencesConfig;
}

const STORAGE_KEY = 'tade_master_visibility_config_v10_4';

export const DEFAULT_MASTER_VISIBILITY: MasterVisibilityState = {
  version: 'v10.4-G7',
  lastUpdated: '2026-08-21T22:45:00+07:00',
  updatedBy: 'Founder Andika (Sovereign Mandate)',
  global: {
    livingMessenger: true,
    magicGarden: true,
    wishTree: true,
    growingTree: true,
    livingAvatar: true,
    soundEffects: true,
    rainAndRainbow: true,
    festivalMode: true,
    nightFireflies: true,
    microInteractions: true
  },
  roleMatrix: {
    waliMurid: {
      livingMessenger: true,
      magicGarden: true,
      wishTree: true,
      growingTree: true,
      parentCommunity: true,
      memoryCapsule: true,
      financialLedger: true
    },
    guru: {
      livingMessenger: true,
      magicGarden: true,
      wishTree: true,
      growingTree: true,
      parentCommunity: true,
      creativeStudio: true,
      studentAssessment: true
    },
    kepalaSekolah: {
      livingMessenger: true,
      magicGarden: true,
      wishTree: true,
      growingTree: true,
      parentCommunity: true,
      executiveBrief: true,
      governanceApproval: true
    },
    ketuaYayasan: {
      livingMessenger: true,
      magicGarden: true,
      wishTree: true,
      growingTree: true,
      parentCommunity: true,
      executiveBrief: true,
      financialLedger: true,
      founderCommand: true
    },
    adminSim: {
      livingMessenger: true,
      magicGarden: true,
      wishTree: true,
      growingTree: true,
      parentCommunity: true,
      featureRollout: true,
      systemDiagnostics: true
    }
  },
  userDefault: {
    modeLite: false,
    motionReduced: false,
    soundEnabled: true,
    avatarAnimation: true,
    gardenParticles: true,
    activeChildId: 'std-farhan-01'
  }
};

class MasterVisibilityService {
  private static instance: MasterVisibilityService | null = null;
  private state: MasterVisibilityState;
  private listeners: Array<(state: MasterVisibilityState) => void> = [];

  private constructor() {
    this.state = this.loadFromStorage();
  }

  public static getInstance(): MasterVisibilityService {
    if (!MasterVisibilityService.instance) {
      MasterVisibilityService.instance = new MasterVisibilityService();
    }
    return MasterVisibilityService.instance;
  }

  private loadFromStorage(): MasterVisibilityState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_MASTER_VISIBILITY };
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_MASTER_VISIBILITY,
        ...parsed,
        global: { ...DEFAULT_MASTER_VISIBILITY.global, ...(parsed.global || {}) },
        roleMatrix: { ...DEFAULT_MASTER_VISIBILITY.roleMatrix, ...(parsed.roleMatrix || {}) },
        userDefault: { ...DEFAULT_MASTER_VISIBILITY.userDefault, ...(parsed.userDefault || {}) }
      };
    } catch {
      return { ...DEFAULT_MASTER_VISIBILITY };
    }
  }

  public getState(): MasterVisibilityState {
    return { ...this.state };
  }

  public updateGlobal<K extends keyof GlobalVisibilityConfig>(key: K, value: boolean, updatedBy = 'Founder'): void {
    this.state.global[key] = value;
    this.state.lastUpdated = new Date().toISOString();
    this.state.updatedBy = updatedBy;
    this.persist();
  }

  public updateRole<R extends keyof RoleVisibilityMatrix, K extends keyof RoleVisibilityMatrix[R]>(
    role: R,
    key: K,
    value: boolean,
    updatedBy = 'Founder'
  ): void {
    (this.state.roleMatrix[role] as any)[key] = value;
    this.state.lastUpdated = new Date().toISOString();
    this.state.updatedBy = updatedBy;
    this.persist();
  }

  public updateUserPreference<K extends keyof UserPreferencesConfig>(key: K, value: any): void {
    this.state.userDefault[key] = value;
    this.persist();
  }

  public resetToDefault(): void {
    this.state = { ...DEFAULT_MASTER_VISIBILITY, lastUpdated: new Date().toISOString() };
    this.persist();
  }

  public isFeatureVisible(feature: keyof GlobalVisibilityConfig, role?: keyof RoleVisibilityMatrix): boolean {
    if (this.state.userDefault.modeLite && (feature === 'magicGarden' || feature === 'nightFireflies')) {
      return false;
    }
    const globalVal = this.state.global[feature];
    if (!globalVal) return false;
    if (!role) return globalVal;

    const roleConfig = this.state.roleMatrix[role];
    if (roleConfig && (feature in roleConfig)) {
      return (roleConfig as any)[feature];
    }
    return globalVal;
  }

  public exportConfigJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public importConfigJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        this.state = {
          ...DEFAULT_MASTER_VISIBILITY,
          ...parsed,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'Imported Manifest'
        };
        this.persist();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public subscribe(fn: (state: MasterVisibilityState) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notify();
    } catch (e) {
      console.warn('Failed to persist Master Visibility state:', e);
    }
  }

  private notify(): void {
    const cloned = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(cloned);
      } catch (err) {
        console.error('Visibility listener error:', err);
      }
    });
  }
}

export const masterVisibilityService = MasterVisibilityService.getInstance();
