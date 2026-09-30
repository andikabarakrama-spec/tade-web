export interface CompanionCachedItem {
  key: string;
  category: 'PREFERENCE' | 'FILTER' | 'LAYOUT' | 'GREETING' | 'LAST_SAFE_VIEW';
  value: any;
  cachedAt: string;
  expiresAt: string;
  sizeBytes: number;
}

export interface CacheSanitizationIncident {
  incidentId: string;
  attemptedKey: string;
  matchedBlacklistTerm: string;
  timestamp: string;
  rejectionReason: string;
}

export class OfflineCompanionCache {
  private static instance: OfflineCompanionCache;
  private cache: Map<string, CompanionCachedItem> = new Map();
  private sanitizationIncidents: CacheSanitizationIncident[] = [];

  private readonly SENSITIVE_BLACKLIST = [
    'password',
    'passwd',
    'token',
    'secret',
    'nik',
    'payroll',
    'gaji',
    'api_key',
    'apikey',
    'credential',
    'auth',
    'pin',
    'rek_bank'
  ];

  private constructor() {
    this.seedSafeCache();
  }

  public static getInstance(): OfflineCompanionCache {
    if (!OfflineCompanionCache.instance) {
      OfflineCompanionCache.instance = new OfflineCompanionCache();
    }
    return OfflineCompanionCache.instance;
  }

  private seedSafeCache(): void {
    const now = new Date().toISOString();
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

    this.cache.set('pref_theme', {
      key: 'pref_theme',
      category: 'PREFERENCE',
      value: { mode: 'dark', contrast: 'high', accent: 'emerald' },
      cachedAt: now,
      expiresAt: expiry,
      sizeBytes: 64
    });

    this.cache.set('layout_companion_cards', {
      key: 'layout_companion_cards',
      category: 'LAYOUT',
      value: { expandedSections: ['hafalan', 'kehadiran', 'sitrep'], density: 'comfortable' },
      cachedAt: now,
      expiresAt: expiry,
      sizeBytes: 128
    });

    this.cache.set('greeting_wali_murid', {
      key: 'greeting_wali_murid',
      category: 'GREETING',
      value: { greetingText: 'Assalamu’alaikum Ayah/Bunda! Selamat mendampingi ananda hari ini.', islamicCalendarDate: '19 Safar 1448 H' },
      cachedAt: now,
      expiresAt: expiry,
      sizeBytes: 180
    });

    this.cache.set('filter_santri_sentra', {
      key: 'filter_santri_sentra',
      category: 'FILTER',
      value: { selectedSentra: 'SENTRA_BAHAN_ALAM', sort: 'nama_asc' },
      cachedAt: now,
      expiresAt: expiry,
      sizeBytes: 72
    });

    this.cache.set('last_safe_view_guru', {
      key: 'last_safe_view_guru',
      category: 'LAST_SAFE_VIEW',
      value: { activeSubTab: 'sentra_today', route: '/sim/r752' },
      cachedAt: now,
      expiresAt: expiry,
      sizeBytes: 90
    });
  }

  public isBlacklisted(key: string, value: any): { blacklisted: boolean; matchedTerm?: string } {
    const lowerKey = key.toLowerCase();
    for (const term of this.SENSITIVE_BLACKLIST) {
      if (lowerKey.includes(term)) {
        return { blacklisted: true, matchedTerm: term };
      }
    }

    const valueStr = JSON.stringify(value).toLowerCase();
    for (const term of this.SENSITIVE_BLACKLIST) {
      if (valueStr.includes(term)) {
        return { blacklisted: true, matchedTerm: term };
      }
    }

    return { blacklisted: false };
  }

  public setItem(
    key: string,
    category: CompanionCachedItem['category'],
    value: any,
    ttlMinutes: number = 1440
  ): { success: boolean; message: string } {
    const check = this.isBlacklisted(key, value);
    if (check.blacklisted) {
      const incident: CacheSanitizationIncident = {
        incidentId: `INC-CACHE-${Date.now().toString(16).toUpperCase()}`,
        attemptedKey: key,
        matchedBlacklistTerm: check.matchedTerm || 'sensitive_pattern',
        timestamp: new Date().toISOString(),
        rejectionReason: `Penolakan Otomatis Guardian Ring-0: Kunci '${key}' atau nilainya mengandung pola sensitif terlarang '${check.matchedTerm}'.`
      };
      this.sanitizationIncidents.unshift(incident);
      return {
        success: false,
        message: incident.rejectionReason
      };
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000).toISOString();
    const sizeBytes = new Blob([JSON.stringify(value)]).size;

    this.cache.set(key, {
      key,
      category,
      value,
      cachedAt: now.toISOString(),
      expiresAt,
      sizeBytes
    });

    return {
      success: true,
      message: `Item safe cache '${key}' berhasil disimpan dalam kategori ${category}.`
    };
  }

  public getItem(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (new Date(item.expiresAt) < new Date()) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  public getAllItems(): CompanionCachedItem[] {
    return Array.from(this.cache.values());
  }

  public getSanitizationIncidents(): CacheSanitizationIncident[] {
    return [...this.sanitizationIncidents];
  }

  public removeItem(key: string): boolean {
    return this.cache.delete(key);
  }

  public clearAll(): void {
    this.cache.clear();
  }
}
