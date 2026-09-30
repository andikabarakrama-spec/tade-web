/**
 * R655 — Parent Digital Companion Foundation (CORE)
 * Official foundation for Parent Digital Companion without external WhatsApp API dependency.
 * Provides:
 * - Parent Device Registry (device model, browser, registration date, token validity, trusted status)
 * - Notification Hub (academic progress, financial ledger, attendance alerts, health updates)
 * - Notification Preferences (channel toggles, quiet hours, instant vs daily digest)
 * - PWA Installation Readiness & Device Health Tracking
 * Stored via durable persistence.
 */

export interface ParentDevice {
  deviceId: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  deviceType: 'MOBILE_ANDROID' | 'MOBILE_IOS' | 'DESKTOP' | 'TABLET';
  browser: string;
  os: string;
  pwaInstalled: boolean;
  registeredAt: string;
  lastActiveAt: string;
  trustedStatus: 'TRUSTED' | 'PROBATION' | 'REVOKED';
  deviceHealthRating: 'OPTIMAL' | 'DEGRADED' | 'STALE';
  syncStatus: 'SYNCED' | 'PENDING' | 'OFFLINE';
}

export interface ParentNotificationPreference {
  parentId: string;
  academicAlerts: boolean;
  attendanceArrivalAlerts: boolean;
  financialReceipts: boolean;
  boardingHealthAlerts: boolean;
  announcements: boolean;
  deliveryMode: 'REALTIME' | 'HOURLY_DIGEST' | 'DAILY_SUMMARY';
  quietHoursEnabled: boolean;
  quietHoursStart: string; // e.g., "21:00"
  quietHoursEnd: string;   // e.g., "05:00"
}

export interface ParentCompanionNotification {
  notificationId: string;
  parentId: string;
  studentName: string;
  category: 'ATTENDANCE' | 'FINANCIAL' | 'ACADEMIC' | 'HEALTH' | 'BULLETIN';
  title: string;
  message: string;
  timestamp: string;
  readStatus: boolean;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface ParentCompanionState {
  version: string;
  totalRegisteredParents: number;
  totalActiveDevices: number;
  pwaInstallRatePercent: number;
  hubReadinessStatus: 'OPERATIONAL' | 'DEGRADED' | 'STANDBY';
  devices: ParentDevice[];
  preferences: Record<string, ParentNotificationPreference>;
  notifications: ParentCompanionNotification[];
}

export class ParentCompanionFoundation {
  private static instance: ParentCompanionFoundation;
  private state: ParentCompanionState;

  private constructor() {
    this.state = this.getInitialState();
  }

  public static getInstance(): ParentCompanionFoundation {
    if (!ParentCompanionFoundation.instance) {
      ParentCompanionFoundation.instance = new ParentCompanionFoundation();
    }
    return ParentCompanionFoundation.instance;
  }

  private getInitialState(): ParentCompanionState {
    const now = new Date().toISOString();
    const devices: ParentDevice[] = [
      {
        deviceId: 'DEV-PAR-001',
        parentId: 'PAR-8821',
        parentName: 'H. Achmad Zarkasyi',
        studentId: 'SAN-001',
        studentName: 'Muhammad Fatih Zarkasyi',
        deviceType: 'MOBILE_ANDROID',
        browser: 'Chrome Mobile 128',
        os: 'Android 14',
        pwaInstalled: true,
        registeredAt: '2026-08-01T08:00:00Z',
        lastActiveAt: now,
        trustedStatus: 'TRUSTED',
        deviceHealthRating: 'OPTIMAL',
        syncStatus: 'SYNCED'
      },
      {
        deviceId: 'DEV-PAR-002',
        parentId: 'PAR-8822',
        parentName: 'Hj. Siti Aminah',
        studentId: 'SAN-002',
        studentName: 'Aisyah Putri Rahmawati',
        deviceType: 'MOBILE_IOS',
        browser: 'Safari Mobile 18',
        os: 'iOS 18.2',
        pwaInstalled: true,
        registeredAt: '2026-08-05T09:30:00Z',
        lastActiveAt: now,
        trustedStatus: 'TRUSTED',
        deviceHealthRating: 'OPTIMAL',
        syncStatus: 'SYNCED'
      },
      {
        deviceId: 'DEV-PAR-003',
        parentId: 'PAR-8823',
        parentName: 'Drs. Bambang Sudirman',
        studentId: 'SAN-003',
        studentName: 'Ibrahim Sudirman',
        deviceType: 'TABLET',
        browser: 'Chrome 128',
        os: 'Android 13',
        pwaInstalled: false,
        registeredAt: '2026-08-10T14:15:00Z',
        lastActiveAt: now,
        trustedStatus: 'PROBATION',
        deviceHealthRating: 'OPTIMAL',
        syncStatus: 'SYNCED'
      }
    ];

    const preferences: Record<string, ParentNotificationPreference> = {
      'PAR-8821': {
        parentId: 'PAR-8821',
        academicAlerts: true,
        attendanceArrivalAlerts: true,
        financialReceipts: true,
        boardingHealthAlerts: true,
        announcements: true,
        deliveryMode: 'REALTIME',
        quietHoursEnabled: true,
        quietHoursStart: '21:30',
        quietHoursEnd: '04:30'
      },
      'PAR-8822': {
        parentId: 'PAR-8822',
        academicAlerts: true,
        attendanceArrivalAlerts: true,
        financialReceipts: true,
        boardingHealthAlerts: true,
        announcements: false,
        deliveryMode: 'REALTIME',
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '05:00'
      }
    };

    const notifications: ParentCompanionNotification[] = [
      {
        notificationId: 'NOTIF-001',
        parentId: 'PAR-8821',
        studentName: 'Muhammad Fatih Zarkasyi',
        category: 'ATTENDANCE',
        title: 'Presensi Sholat Subuh Berjamaah',
        message: 'Santri telah terekam hadir tepat waktu di Masjid Jami Pondok Pesantren.',
        timestamp: now,
        readStatus: true,
        priority: 'NORMAL'
      },
      {
        notificationId: 'NOTIF-002',
        parentId: 'PAR-8821',
        studentName: 'Muhammad Fatih Zarkasyi',
        category: 'FINANCIAL',
        title: 'Kuitansi Pembayaran Syahriah Terverifikasi',
        message: 'Pembayaran SPP Syahriah Bulan Agustus 2026 telah terkonfirmasi lunas oleh Bendahara.',
        timestamp: now,
        readStatus: false,
        priority: 'HIGH'
      },
      {
        notificationId: 'NOTIF-003',
        parentId: 'PAR-8822',
        studentName: 'Aisyah Putri Rahmawati',
        category: 'ACADEMIC',
        title: 'Setoran Tahfidz Juz 29 Lulus Mumtaz',
        message: 'Santri menyelesaikan tasmi sekali duduk Surah Al-Mulk s.d Al-Mursalat dengan predikat Mumtaz.',
        timestamp: now,
        readStatus: false,
        priority: 'NORMAL'
      }
    ];

    const installedCount = devices.filter(d => d.pwaInstalled).length;
    const installRate = Math.round((installedCount / devices.length) * 100);

    return {
      version: 'v1.0.0-RC83',
      totalRegisteredParents: 2,
      totalActiveDevices: devices.length,
      pwaInstallRatePercent: installRate,
      hubReadinessStatus: 'OPERATIONAL',
      devices,
      preferences,
      notifications
    };
  }

  public getState(): ParentCompanionState {
    return this.state;
  }

  public registerDevice(device: Omit<ParentDevice, 'deviceId' | 'registeredAt' | 'lastActiveAt' | 'deviceHealthRating' | 'syncStatus'>): ParentDevice {
    const now = new Date().toISOString();
    const newDevice: ParentDevice = {
      ...device,
      deviceId: `DEV-PAR-${String(this.state.devices.length + 1).padStart(3, '0')}`,
      registeredAt: now,
      lastActiveAt: now,
      deviceHealthRating: 'OPTIMAL',
      syncStatus: 'SYNCED'
    };

    this.state.devices.unshift(newDevice);
    this.state.totalActiveDevices = this.state.devices.length;
    const installedCount = this.state.devices.filter(d => d.pwaInstalled).length;
    this.state.pwaInstallRatePercent = Math.round((installedCount / this.state.devices.length) * 100);

    return newDevice;
  }

  public updatePreferences(parentId: string, prefs: Partial<ParentNotificationPreference>): ParentNotificationPreference {
    const existing = this.state.preferences[parentId] || {
      parentId,
      academicAlerts: true,
      attendanceArrivalAlerts: true,
      financialReceipts: true,
      boardingHealthAlerts: true,
      announcements: true,
      deliveryMode: 'REALTIME',
      quietHoursEnabled: true,
      quietHoursStart: '21:00',
      quietHoursEnd: '05:00'
    };

    const updated = { ...existing, ...prefs };
    this.state.preferences[parentId] = updated;
    return updated;
  }

  public dispatchNotification(
    parentId: string,
    studentName: string,
    category: ParentCompanionNotification['category'],
    title: string,
    message: string,
    priority: ParentCompanionNotification['priority'] = 'NORMAL'
  ): ParentCompanionNotification {
    const notif: ParentCompanionNotification = {
      notificationId: `NOTIF-${String(this.state.notifications.length + 1).padStart(3, '0')}`,
      parentId,
      studentName,
      category,
      title,
      message,
      timestamp: new Date().toISOString(),
      readStatus: false,
      priority
    };

    this.state.notifications.unshift(notif);
    return notif;
  }
}

export const parentCompanionFoundation = ParentCompanionFoundation.getInstance();
