/**
 * TADE v9.4.0-MCA4 — R943
 * BEHAVIOR CONTEXT ADAPTER
 * 
 * Bridges external app environment (active route/tab, user idle time,
 * tab visibility, and interaction events) to the Living Character Behavior Engine.
 */

import { CharacterId } from './masterCharacterRegistry';

export type UserInteractionEvent = 'CLICK' | 'HOVER' | 'TOUCH' | 'TAB_FOCUS' | 'TAB_BLUR' | 'SCROLL' | 'IDLE_TIMEOUT';

export interface ContextBehaviorSignal {
  source: 'ROUTE' | 'TIME' | 'INTERACTION' | 'IDLE' | 'VISIBILITY';
  suggestedState: string;
  suggestedEmotion: 'calm' | 'happy' | 'focused' | 'curious';
  priority: number; // 0 to 10
  reason: string;
  timestamp: number;
}

export class BehaviorContextAdapter {
  private activeTab: string = 'dashboard';
  private lastInteractionTime: number = Date.now();
  private isTabVisible: boolean = true;
  private idleThresholdSec: number = 15; // 15s triggers curiosity / idle wandering
  private deepIdleThresholdSec: number = 60; // 60s triggers sit_rest / sleepy

  constructor() {
    this.setupBrowserListeners();
  }

  private setupBrowserListeners(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isTabVisible = !document.hidden;
      });
    }
  }

  public recordInteraction(event: UserInteractionEvent = 'CLICK'): ContextBehaviorSignal {
    this.lastInteractionTime = Date.now();

    switch (event) {
      case 'TAB_FOCUS':
        return {
          source: 'VISIBILITY',
          suggestedState: 'greet',
          suggestedEmotion: 'happy',
          priority: 8,
          reason: 'Pengguna kembali membuka tab aplikasi (Tab Focus)',
          timestamp: Date.now()
        };
      case 'CLICK':
      case 'TOUCH':
        return {
          source: 'INTERACTION',
          suggestedState: 'observe',
          suggestedEmotion: 'curious',
          priority: 6,
          reason: 'Interaksi aktif sentuhan pengguna',
          timestamp: Date.now()
        };
      case 'HOVER':
        return {
          source: 'INTERACTION',
          suggestedState: 'observe',
          suggestedEmotion: 'happy',
          priority: 4,
          reason: 'Kursor mendekat ke karakter santri',
          timestamp: Date.now()
        };
      default:
        return {
          source: 'INTERACTION',
          suggestedState: 'idle',
          suggestedEmotion: 'calm',
          priority: 2,
          reason: 'Aktivitas rutin pengguna',
          timestamp: Date.now()
        };
    }
  }

  public setRoute(tab: string): ContextBehaviorSignal {
    this.activeTab = tab;
    this.lastInteractionTime = Date.now();
    const t = (tab || '').toLowerCase();

    if (t.includes('tahfidz') || t.includes('mutabaah') || t.includes('r11') || t.includes('w4')) {
      return {
        source: 'ROUTE',
        suggestedState: 'read_iqro',
        suggestedEmotion: 'focused',
        priority: 7,
        reason: 'Pengguna membuka Sentra Tahfidz & Al-Qur\'an',
        timestamp: Date.now()
      };
    }

    if (t.includes('galeri') || t.includes('gallery') || t.includes('karya') || t.includes('w7')) {
      return {
        source: 'ROUTE',
        suggestedState: 'butterfly',
        suggestedEmotion: 'happy',
        priority: 7,
        reason: 'Pengguna menjelajahi Galeri & Dokumentasi Kegiatan',
        timestamp: Date.now()
      };
    }

    if (t.includes('ppdb') || t.includes('daftar') || t.includes('r20') || t.includes('w5')) {
      return {
        source: 'ROUTE',
        suggestedState: 'greet',
        suggestedEmotion: 'happy',
        priority: 7,
        reason: 'Pengguna mengakses Layanan PPDB Santri Baru',
        timestamp: Date.now()
      };
    }

    if (t.includes('keuangan') || t.includes('spp') || t.includes('pos')) {
      return {
        source: 'ROUTE',
        suggestedState: 'celebrate',
        suggestedEmotion: 'happy',
        priority: 7,
        reason: 'Pengguna melihat Kasir SPP & Infaq Amanah',
        timestamp: Date.now()
      };
    }

    return {
      source: 'ROUTE',
      suggestedState: 'idle',
      suggestedEmotion: 'calm',
      priority: 3,
      reason: `Modul aktif: ${tab}`,
      timestamp: Date.now()
    };
  }

  public checkIdleSignal(): ContextBehaviorSignal | null {
    const elapsedSec = (Date.now() - this.lastInteractionTime) / 1000;

    if (elapsedSec >= this.deepIdleThresholdSec) {
      return {
        source: 'IDLE',
        suggestedState: 'sit_rest',
        suggestedEmotion: 'calm',
        priority: 5,
        reason: `Pengguna tidak aktif selama ${Math.floor(elapsedSec)} detik (Deep Idle)`,
        timestamp: Date.now()
      };
    }

    if (elapsedSec >= this.idleThresholdSec) {
      return {
        source: 'IDLE',
        suggestedState: 'observe',
        suggestedEmotion: 'curious',
        priority: 4,
        reason: `Pengguna hening selama ${Math.floor(elapsedSec)} detik (Soft Idle)`,
        timestamp: Date.now()
      };
    }

    return null;
  }

  public getActiveTab(): string {
    return this.activeTab;
  }

  public isVisible(): boolean {
    return this.isTabVisible;
  }

  public getIdleTimeSec(): number {
    return Math.floor((Date.now() - this.lastInteractionTime) / 1000);
  }
}

export const defaultBehaviorContextAdapter = new BehaviorContextAdapter();
