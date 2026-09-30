import { CompanionMemoryPreference, CompanionRole } from './companionTypes';

/**
 * R754 — Companion Memory
 * Local preference cache for UI layout, display filters, and companion greeting styles.
 * Strictly forbidden from storing credentials, raw database tokens, or sensitive student records.
 */
class CompanionMemory {
  private static instance: CompanionMemory;
  private readonly STORAGE_KEY = 'TADE_COMPANION_MEMORY_V7';
  private preferences: Record<string, CompanionMemoryPreference> = {};

  private constructor() {
    this.loadMemory();
  }

  public static getInstance(): CompanionMemory {
    if (!CompanionMemory.instance) {
      CompanionMemory.instance = new CompanionMemory();
    }
    return CompanionMemory.instance;
  }

  private loadMemory() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.preferences = JSON.parse(stored);
      } else {
        this.seedInitialPreferences();
      }
    } catch {
      this.preferences = {};
      this.seedInitialPreferences();
    }
  }

  private seedInitialPreferences() {
    this.setPreference('parent_view_mode', 'PARENT', 'COMPACT_TIMELINE');
    this.setPreference('teacher_quick_filter', 'TEACHER', 'TODAY_ACTIVE_CLASSES');
    this.setPreference('executive_sitrep_dense', 'EXECUTIVE', true);
    this.setPreference('companion_greeting_tone', 'UNIVERSAL', 'ISLAMIC_WARM');
  }

  private saveMemory() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (e) {
      console.warn('[CompanionMemory] Failed to persist preferences', e);
    }
  }

  /**
   * Set a safe preference. Sanitizes any potential sensitive data keys.
   */
  public setPreference(key: string, role: CompanionRole, value: any): boolean {
    // Privacy Guard Sanitization: check key against sensitive keyword blacklists
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('token') ||
      lowerKey.includes('apikey') ||
      lowerKey.includes('nik') ||
      lowerKey.includes('gaji')
    ) {
      console.error(`[CompanionMemory] BLOCKED: Key "${key}" violates zero-sensitive-cache policy.`);
      return false;
    }

    this.preferences[key] = {
      key,
      role,
      preferenceValue: value,
      updatedAt: new Date().toISOString(),
      isSafe: true
    };
    this.saveMemory();
    return true;
  }

  public getPreference<T>(key: string, defaultValue: T): T {
    return this.preferences[key] ? (this.preferences[key].preferenceValue as T) : defaultValue;
  }

  public getAllPreferences(): CompanionMemoryPreference[] {
    return Object.values(this.preferences);
  }

  public clearRolePreferences(role: CompanionRole) {
    for (const key of Object.keys(this.preferences)) {
      if (this.preferences[key].role === role) {
        delete this.preferences[key];
      }
    }
    this.saveMemory();
  }
}

export const companionMemory = CompanionMemory.getInstance();
