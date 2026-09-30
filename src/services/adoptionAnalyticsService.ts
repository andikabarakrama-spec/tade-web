import { blackBoxRecorder } from './blackBoxRecorder';

export interface AdoptionEvent {
  id: string;
  type: 'PWA_INSTALL' | 'NOTIFICATION_ENABLED' | 'DEEP_LINK_OPENED' | 'WHATSAPP_SHARE' | 'FIRST_LOGIN' | 'DAILY_ACTIVE_PARENT' | 'NOTIFICATION_CLICK';
  timestamp: string;
  details: string;
}

export interface AdoptionMetrics {
  pwaInstalls: number;
  notificationsEnabled: number;
  deepLinksOpened: number;
  deepLinksByTab: Record<string, number>;
  whatsAppShares: number;
  parentLogins: number;
  dailyActiveParents: number;
  lastActiveDate: string;
  notificationsDelivered: number;
  notificationsOpened: number;
  recentEvents: AdoptionEvent[];
}

const STORAGE_KEY = 'tade_parent_adoption_stats_v1';
const DAP_KEY = 'tade_dap_recorded_day_v1';

const INITIAL_METRICS: AdoptionMetrics = {
  pwaInstalls: 42,
  notificationsEnabled: 68,
  deepLinksOpened: 154,
  deepLinksByTab: {
    w3: 65, // Pengumuman
    w4: 38, // PPDB
    r6: 24, // Presensi
    r17: 15, // Tahfidz
    r10: 12  // SPP / Infaq
  },
  whatsAppShares: 89,
  parentLogins: 112,
  dailyActiveParents: 34,
  lastActiveDate: new Date().toISOString().split('T')[0],
  notificationsDelivered: 215,
  notificationsOpened: 178,
  recentEvents: [
    {
      id: 'ev-1',
      type: 'NOTIFICATION_CLICK',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      details: 'Wali murid membuka notifikasi Pengumuman Isra Miraj (tab w3)'
    },
    {
      id: 'ev-2',
      type: 'PWA_INSTALL',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      details: 'PWA TADE berhasil diinstal di perangkat Android wali murid'
    },
    {
      id: 'ev-3',
      type: 'WHATSAPP_SHARE',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      details: 'Pengumuman dibagikan ke grup WhatsApp Paguyuban Kelas B'
    },
    {
      id: 'ev-4',
      type: 'DEEP_LINK_OPENED',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      details: 'Deep link mutabaah tahfidz dibuka via WhatsApp (tab r17)'
    }
  ]
};

class AdoptionAnalyticsService {
  private metrics: AdoptionMetrics;
  private listeners: Array<(metrics: AdoptionMetrics) => void> = [];

  constructor() {
    this.metrics = this.loadMetrics();
    this.checkDailyActiveParent();
  }

  private loadMetrics(): AdoptionMetrics {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...INITIAL_METRICS, ...JSON.parse(stored) };
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_METRICS;
  }

  private saveMetrics() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.metrics));
      }
      this.notifyListeners();
    } catch (e) {
      console.warn('Gagal menyimpan Adoption Metrics:', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn({ ...this.metrics }));
  }

  public subscribe(listener: (metrics: AdoptionMetrics) => void): () => void {
    this.listeners.push(listener);
    listener({ ...this.metrics });
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getMetrics(): AdoptionMetrics {
    return { ...this.metrics };
  }

  private recordEvent(type: AdoptionEvent['type'], details: string) {
    const newEvent: AdoptionEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      timestamp: new Date().toISOString(),
      details
    };

    this.metrics.recentEvents = [newEvent, ...this.metrics.recentEvents.slice(0, 49)];
    
    // Sovereign Telemetry Log
    blackBoxRecorder.record({
      moduleCode: 'PARENT-ADOPTION',
      role: 'WALI_MURID',
      eventType: 'ACTION',
      details: `[${type}] ${details}`,
      severity: 'INFO',
      route: window.location.pathname || '/'
    });
  }

  public trackPWAInstall() {
    this.metrics.pwaInstalls += 1;
    this.recordEvent('PWA_INSTALL', 'Aplikasi PWA TADE berhasil dipasang di layar utama pengguna');
    this.saveMetrics();
  }

  public trackNotificationPermission(granted: boolean) {
    if (granted) {
      this.metrics.notificationsEnabled += 1;
      this.recordEvent('NOTIFICATION_ENABLED', 'Pengguna mengaktifkan izin Push Notification TADE');
    }
    this.saveMetrics();
  }

  public trackDeepLinkOpened(tab: string, ref: string = 'direct') {
    this.metrics.deepLinksOpened += 1;
    this.metrics.deepLinksByTab[tab] = (this.metrics.deepLinksByTab[tab] || 0) + 1;
    this.recordEvent('DEEP_LINK_OPENED', `Universal Deep Link dibuka untuk tab: ${tab} (sumber: ${ref})`);
    this.saveMetrics();
  }

  public trackWhatsAppShare(type: string = 'announcement') {
    this.metrics.whatsAppShares += 1;
    this.recordEvent('WHATSAPP_SHARE', `Pesan/Pengumuman dibagikan ke WhatsApp (${type})`);
    this.saveMetrics();
  }

  public trackFirstLogin(userEmail: string, role: string) {
    this.metrics.parentLogins += 1;
    this.recordEvent('FIRST_LOGIN', `Wali murid / pengguna login: ${userEmail} (${role})`);
    this.saveMetrics();
  }

  public trackNotificationDelivered(count: number = 1) {
    this.metrics.notificationsDelivered += count;
    this.saveMetrics();
  }

  public trackNotificationClick(tab: string) {
    this.metrics.notificationsOpened += 1;
    this.recordEvent('NOTIFICATION_CLICK', `Wali murid mengklik notifikasi (target tab: ${tab})`);
    this.saveMetrics();
  }

  public checkDailyActiveParent() {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
      const today = new Date().toISOString().split('T')[0];
      const recordedDay = localStorage.getItem(DAP_KEY);

      if (recordedDay !== today) {
        this.metrics.dailyActiveParents += 1;
        this.metrics.lastActiveDate = today;
        localStorage.setItem(DAP_KEY, today);
        this.recordEvent('DAILY_ACTIVE_PARENT', `Wali murid aktif berkunjung hari ini (${today})`);
        this.saveMetrics();
      }
    } catch {
      // safe fallback
    }
  }
}

export const adoptionAnalyticsService = new AdoptionAnalyticsService();
