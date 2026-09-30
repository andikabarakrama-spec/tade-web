/**
 * TADE RC91 — R734 Local Snapshot Cache
 * High-performance, read-only offline snapshot cache with explicit TTL.
 * Strictly read-only for client rendering during degraded/offline states.
 * Never replaces or overrides SSoT (src/services/db.ts).
 */

import { LocalSnapshot } from './offlineTypes';
import { DataService } from '../../services/db';

const SNAPSHOT_PREFIX = 'tade_local_snapshot_';
const SNAPSHOT_INDEX_KEY = 'tade_snapshot_index_v1';

export class LocalSnapshotCache {
  private static instance: LocalSnapshotCache;
  private memoryCache: Map<string, LocalSnapshot> = new Map();
  private listeners: Set<(keys: string[]) => void> = new Set();

  private constructor() {
    this.loadIndexFromStorage();
    this.ensureBaselineSnapshots();
  }

  public static getInstance(): LocalSnapshotCache {
    if (!LocalSnapshotCache.instance) {
      LocalSnapshotCache.instance = new LocalSnapshotCache();
    }
    return LocalSnapshotCache.instance;
  }

  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `chk_${Math.abs(hash).toString(16).padStart(8, '0')}`;
  }

  private loadIndexFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(SNAPSHOT_INDEX_KEY);
      if (raw) {
        const keys: string[] = JSON.parse(raw);
        keys.forEach((key) => {
          const itemRaw = localStorage.getItem(SNAPSHOT_PREFIX + key);
          if (itemRaw) {
            const parsed: LocalSnapshot = JSON.parse(itemRaw);
            // Verify checksum
            const calculated = this.generateChecksum(parsed.data);
            if (calculated === parsed.checksum) {
              this.memoryCache.set(key, parsed);
            }
          }
        });
      }
    } catch (e) {
      console.warn('[LocalSnapshotCache] Index load fallback', e);
    }
  }

  private saveIndexToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const keys = Array.from(this.memoryCache.keys());
      localStorage.setItem(SNAPSHOT_INDEX_KEY, JSON.stringify(keys));
    } catch (e) {
      console.warn('[LocalSnapshotCache] Index save failed', e);
    }
  }

  /**
   * Seed baseline snapshots from SSoT if empty or on startup.
   */
  public async ensureBaselineSnapshots(): Promise<void> {
    try {
      // 1. Students Snapshot
      if (!this.hasValidSnapshot('students')) {
        const students = await DataService.getStudents();
        this.setSnapshot('students', 'SISWA', students, 60 * 60 * 1000); // 1 hour TTL
      }

      // 2. Teachers Snapshot
      if (!this.hasValidSnapshot('teachers')) {
        const teachers = await DataService.getTeachers();
        this.setSnapshot('teachers', 'GURU', teachers, 60 * 60 * 1000);
      }

      // 3. Classes Snapshot
      if (!this.hasValidSnapshot('classes')) {
        const classes = [
          { id: 'TK-A-1', name: 'TK A - Al-Fatihah', capacity: 20, active: 18 },
          { id: 'TK-B-1', name: 'TK B - An-Nas', capacity: 22, active: 20 }
        ];
        this.setSnapshot('classes', 'KELOMPOK_KELAS', classes, 60 * 60 * 1000);
      }

      // 4. Announcements Snapshot
      if (!this.hasValidSnapshot('announcements')) {
        const notifs = await DataService.getWebsiteAnnouncements();
        this.setSnapshot('announcements', 'PENGUMUMAN', notifs, 30 * 60 * 1000); // 30 min TTL
      }

      // 5. School Profile Snapshot
      if (!this.hasValidSnapshot('school_profile')) {
        const profile = await DataService.getSchoolProfile();
        this.setSnapshot('school_profile', 'IDENTITAS_SEKOLAH', profile, 24 * 60 * 60 * 1000); // 24 hours TTL
      }
    } catch (err) {
      console.warn('[LocalSnapshotCache] Seed error', err);
    }
  }

  /**
   * Set a snapshot in cache with explicit TTL.
   */
  public setSnapshot<T = any>(
    key: string,
    entityType: string,
    data: T,
    ttlMs: number = 60 * 60 * 1000 // default 1 hour
  ): LocalSnapshot<T> {
    const now = Date.now();
    const checksum = this.generateChecksum(data);
    const itemCount = Array.isArray(data) ? data.length : 1;

    const snapshot: LocalSnapshot<T> = {
      key,
      entityType,
      data,
      timestamp: new Date(now).toISOString(),
      ttlMs,
      expiresAt: new Date(now + ttlMs).toISOString(),
      checksum,
      itemCount
    };

    this.memoryCache.set(key, snapshot);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(SNAPSHOT_PREFIX + key, JSON.stringify(snapshot));
        this.saveIndexToStorage();
      } catch (e) {
        console.warn(`[LocalSnapshotCache] Write error for key ${key}`, e);
      }
    }

    this.notifyListeners();
    return snapshot;
  }

  /**
   * Get a snapshot by key. Returns null if expired or missing.
   */
  public getSnapshot<T = any>(key: string): LocalSnapshot<T> | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    // Check expiry
    const expires = new Date(item.expiresAt).getTime();
    if (Date.now() > expires) {
      return null;
    }

    return item as LocalSnapshot<T>;
  }

  public hasValidSnapshot(key: string): boolean {
    return this.getSnapshot(key) !== null;
  }

  public getAllSnapshots(): LocalSnapshot[] {
    const valid: LocalSnapshot[] = [];
    const now = Date.now();

    this.memoryCache.forEach((snap) => {
      const expires = new Date(snap.expiresAt).getTime();
      if (now <= expires) {
        valid.push(snap);
      }
    });

    return valid;
  }

  public purgeExpired(): number {
    const now = Date.now();
    let purged = 0;

    this.memoryCache.forEach((snap, key) => {
      const expires = new Date(snap.expiresAt).getTime();
      if (now > expires) {
        this.memoryCache.delete(key);
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(SNAPSHOT_PREFIX + key);
        }
        purged++;
      }
    });

    if (purged > 0) {
      this.saveIndexToStorage();
      this.notifyListeners();
    }

    return purged;
  }

  public refreshAllFromSSoT(): Promise<void> {
    this.memoryCache.clear();
    return this.ensureBaselineSnapshots();
  }

  public subscribe(listener: (keys: string[]) => void): () => void {
    this.listeners.add(listener);
    listener(Array.from(this.memoryCache.keys()));
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const keys = Array.from(this.memoryCache.keys());
    this.listeners.forEach((listener) => {
      try {
        listener(keys);
      } catch (err) {
        console.error('[LocalSnapshotCache] Listener error:', err);
      }
    });
  }
}

export const localSnapshotCache = LocalSnapshotCache.getInstance();
