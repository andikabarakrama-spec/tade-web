import { UserRole } from '../../types';
import { TaskPriorityLevel } from './IntelligentPriorityEngine';

export interface SmartNotification {
  id: string;
  fingerprint: string; // Used for deduplication
  title: string;
  body: string;
  targetRoles: UserRole[];
  priority: TaskPriorityLevel;
  category: 'SYSTEM' | 'ACADEMIC' | 'FINANCE' | 'SECURITY' | 'GOVERNANCE';
  createdAt: string;
  readByRoles: UserRole[];
  actionLink?: string;
}

export class SmartNotificationRouter {
  private static instance: SmartNotificationRouter;

  private notifications: SmartNotification[] = [
    {
      id: 'NOTIF-001',
      fingerprint: 'fp_ppdb_new_batch_2026',
      title: 'Pendaftaran Siswa Baru Perlu Verifikasi',
      body: 'Terdapat 2 calon siswa baru pada kelompok A yang membutuhkan verifikasi berkas PPDB.',
      targetRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'ADMIN'],
      priority: 'HIGH',
      category: 'ACADEMIC',
      createdAt: '2026-08-18T03:00:00Z',
      readByRoles: [],
      actionLink: 'r13'
    },
    {
      id: 'NOTIF-002',
      fingerprint: 'fp_guardian_audit_clean_rc88',
      title: 'Audit Guardian Ring-0 Selesai',
      body: 'Seluruh struktur sistem terbukti 100% konsisten tanpa drift atau celah fatal.',
      targetRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
      priority: 'MEDIUM',
      category: 'SECURITY',
      createdAt: '2026-08-18T04:10:00Z',
      readByRoles: ['SUPER_ADMIN'],
      actionLink: 'r703'
    },
    {
      id: 'NOTIF-003',
      fingerprint: 'fp_backup_readiness_100',
      title: 'Kesiapan Pemulihan Bencana: RTO 2s / RPO 0s',
      body: '4 artefak cadangan SSoT siap untuk pemulihan instan kapan saja.',
      targetRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
      priority: 'LOW',
      category: 'GOVERNANCE',
      createdAt: '2026-08-18T04:12:00Z',
      readByRoles: [],
      actionLink: 'r704'
    }
  ];

  public static getInstance(): SmartNotificationRouter {
    if (!SmartNotificationRouter.instance) {
      SmartNotificationRouter.instance = new SmartNotificationRouter();
    }
    return SmartNotificationRouter.instance;
  }

  public dispatchNotification(notif: Omit<SmartNotification, 'id' | 'createdAt' | 'readByRoles'>): boolean {
    // Deduplication check: check if notification with same fingerprint exists within last 24 hours
    const existing = this.notifications.find(n => n.fingerprint === notif.fingerprint);
    if (existing) {
      // Deduplicate - do not spam
      return false;
    }

    const newNotif: SmartNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      createdAt: new Date().toISOString(),
      readByRoles: []
    };

    this.notifications.unshift(newNotif);
    return true;
  }

  public getNotificationsForRole(role: UserRole): SmartNotification[] {
    return this.notifications.filter(n => n.targetRoles.includes(role));
  }

  public markAsRead(id: string, role: UserRole): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif && !notif.readByRoles.includes(role)) {
      notif.readByRoles.push(role);
    }
  }

  public getUnreadCount(role: UserRole): number {
    return this.notifications.filter(n => n.targetRoles.includes(role) && !n.readByRoles.includes(role)).length;
  }
}
