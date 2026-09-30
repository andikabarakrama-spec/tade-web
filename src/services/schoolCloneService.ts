/**
 * TADE SCHOOL CLONE KIT SERVICE — SPRINT G7 (P6)
 * Multi-School Sovereign Replicator & Clone Kit.
 * Generates isolated instances with dedicated Brand DNA, zero private student data leak,
 * and exportable sovereign manifest.
 */

export interface SchoolCloneManifest {
  schoolId: string;
  npsn: string;
  name: string;
  shortName: string;
  yayasanName: string;
  level: 'PAUD' | 'TK' | 'KB' | 'RA' | 'SD';
  tagline: string;
  city: string;
  address: string;
  brandDna: {
    primaryColor: string;
    primaryLight: string;
    accentGold: string;
    darkBase: string;
    emblemIcon: string;
    fontFamily: string;
  };
  enabledModules: {
    simAkademik: boolean;
    livingUniverse: boolean;
    parentCommunity: boolean;
    eRaporSentra: boolean;
    financeLedger: boolean;
    livingMessenger: boolean;
    cctvBridge: boolean;
    creativeStudio: boolean;
  };
  databaseIsolation: {
    schemaNamespace: string;
    storageBucketPrefix: string;
    initialStudentsCount: number;
    initialTeachersCount: number;
    isIsolated: boolean;
    seedCleanTemplate: boolean;
  };
  createdAt: string;
  createdBy: string;
}

export const PRESET_BRAND_PALETTES = [
  {
    name: 'Sovereign Emerald (Original Asy Syifa)',
    primary: '#064e3b',
    primaryLight: '#10b981',
    accentGold: '#f59e0b',
    darkBase: '#020617',
    icon: '🌿'
  },
  {
    name: 'Royal Sapphire (Madani Academy)',
    primary: '#1e3a8a',
    primaryLight: '#3b82f6',
    accentGold: '#fbbf24',
    darkBase: '#0b1120',
    icon: '💎'
  },
  {
    name: 'Noble Teal (Al-Falah Cerdas)',
    primary: '#134e4a',
    primaryLight: '#14b8a6',
    accentGold: '#f59e0b',
    darkBase: '#042f2e',
    icon: '🌸'
  },
  {
    name: 'Burgundy Maron (Insan Cendekia)',
    primary: '#831843',
    primaryLight: '#ec4899',
    accentGold: '#fcd34d',
    darkBase: '#18020c',
    icon: '🏛️'
  }
];

const STORAGE_KEY = 'tade_school_clone_registry_v10_4';

export const INITIAL_CLONED_SCHOOLS: SchoolCloneManifest[] = [
  {
    schoolId: 'sch-asy-syifa-tanggul',
    npsn: '69921045',
    name: 'TK Islam Asy Syifa Tanggul (Induk Kedaulatan)',
    shortName: 'TK Asy Syifa Tanggul',
    yayasanName: 'Yayasan Asy Syifa Tanggul',
    level: 'TK',
    tagline: 'Membina Generasi Qur\'ani yang Cerdas, Mandiri & Berakhlak Mulia',
    city: 'Jember, Jawa Timur',
    address: 'Jl. Melati No. 12, Tanggul Wetan, Tanggul, Jember',
    brandDna: {
      primaryColor: '#064e3b',
      primaryLight: '#10b981',
      accentGold: '#f59e0b',
      darkBase: '#020617',
      emblemIcon: '🕌',
      fontFamily: 'Plus Jakarta Sans'
    },
    enabledModules: {
      simAkademik: true,
      livingUniverse: true,
      parentCommunity: true,
      eRaporSentra: true,
      financeLedger: true,
      livingMessenger: true,
      cctvBridge: true,
      creativeStudio: true
    },
    databaseIsolation: {
      schemaNamespace: 'tenant_tanggul_primary',
      storageBucketPrefix: 'storage_tanggul',
      initialStudentsCount: 64,
      initialTeachersCount: 8,
      isIsolated: true,
      seedCleanTemplate: false
    },
    createdAt: '2026-08-01T00:00:00+07:00',
    createdBy: 'Founder Andika'
  },
  {
    schoolId: 'sch-asy-syifa-kencong',
    npsn: '69984920',
    name: 'TK Islam Asy Syifa Cabang Kencong',
    shortName: 'TK Asy Syifa Kencong',
    yayasanName: 'Yayasan Asy Syifa Tanggul',
    level: 'TK',
    tagline: 'Generasi Emas Berbudi Luhur & Berkarakter Islami',
    city: 'Jember, Jawa Timur',
    address: 'Jl. Raya Kencong No. 45, Kencong, Jember',
    brandDna: {
      primaryColor: '#134e4a',
      primaryLight: '#14b8a6',
      accentGold: '#f59e0b',
      darkBase: '#042f2e',
      emblemIcon: '🌸',
      fontFamily: 'Plus Jakarta Sans'
    },
    enabledModules: {
      simAkademik: true,
      livingUniverse: true,
      parentCommunity: true,
      eRaporSentra: true,
      financeLedger: true,
      livingMessenger: true,
      cctvBridge: false,
      creativeStudio: true
    },
    databaseIsolation: {
      schemaNamespace: 'tenant_kencong_isolated',
      storageBucketPrefix: 'storage_kencong',
      initialStudentsCount: 32,
      initialTeachersCount: 4,
      isIsolated: true,
      seedCleanTemplate: true
    },
    createdAt: '2026-08-15T10:00:00+07:00',
    createdBy: 'Founder Andika'
  }
];

class SchoolCloneService {
  private static instance: SchoolCloneService | null = null;
  private schools: SchoolCloneManifest[];
  private listeners: Array<() => void> = [];

  private constructor() {
    this.schools = this.loadFromStorage();
  }

  public static getInstance(): SchoolCloneService {
    if (!SchoolCloneService.instance) {
      SchoolCloneService.instance = new SchoolCloneService();
    }
    return SchoolCloneService.instance;
  }

  private loadFromStorage(): SchoolCloneManifest[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [...INITIAL_CLONED_SCHOOLS];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_CLONED_SCHOOLS];
    } catch {
      return [...INITIAL_CLONED_SCHOOLS];
    }
  }

  public getSchools(): SchoolCloneManifest[] {
    return [...this.schools];
  }

  public createClone(payload: Omit<SchoolCloneManifest, 'schoolId' | 'createdAt' | 'createdBy'>): SchoolCloneManifest {
    const slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 24);

    const newSchool: SchoolCloneManifest = {
      ...payload,
      schoolId: `sch-${slug}-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      createdBy: 'Founder Andika (Clone Wizard)'
    };

    this.schools = [newSchool, ...this.schools];
    this.persist();
    return newSchool;
  }

  public exportManifestJSON(schoolId: string): string {
    const school = this.schools.find(s => s.schoolId === schoolId);
    if (!school) throw new Error('School not found');
    return JSON.stringify(school, null, 2);
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.schools));
      this.notify();
    } catch (e) {
      console.warn('Failed to persist School Clone Registry:', e);
    }
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('School clone listener error:', e);
      }
    });
  }
}

export const schoolCloneService = SchoolCloneService.getInstance();
