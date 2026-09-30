import { SmartReminder, CompanionRole, ReminderPriority, ReminderStatus } from './companionTypes';

function computeDedupHash(targetRole: CompanionRole, category: string, title: string): string {
  const raw = `${targetRole}:${category}:${title.trim().toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash = hash & hash;
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export const DEFAULT_SMART_REMINDERS: SmartReminder[] = [
  // 1. CRITICAL
  {
    reminderId: 'REM-CRIT-001',
    targetRole: 'EXECUTIVE',
    priority: 'CRITICAL',
    status: 'PENDING',
    title: 'Verifikasi Snapshot Disaster Recovery Mingguan',
    message: 'Snapshot database belum diverifikasi untuk siklus minggu ke-3 Agustus. Jalankan uji verifikasi di R737.',
    category: 'RECOVERY',
    dedupHash: computeDedupHash('EXECUTIVE', 'RECOVERY', 'Verifikasi Snapshot Disaster Recovery Mingguan'),
    createdAt: '2026-08-18T06:00:00Z',
    sourceModule: 'R737 Offline Readiness',
    actionUri: 'r737'
  },
  {
    reminderId: 'REM-CRIT-002',
    targetRole: 'PARENT',
    priority: 'HIGH',
    status: 'PENDING',
    title: 'Konfirmasi Surat Izin Kegiatan Outing Class',
    message: 'Batas akhir persetujuan digital untuk kunjungan edukatif Taman Satwa adalah besok pukul 15:00 WIB.',
    category: 'ACADEMIC',
    dedupHash: computeDedupHash('PARENT', 'ACADEMIC', 'Konfirmasi Surat Izin Kegiatan Outing Class'),
    createdAt: '2026-08-18T06:15:00Z',
    sourceModule: 'Portal Wali Murid',
    actionUri: 'r751'
  },
  // 2. TEACHER
  {
    reminderId: 'REM-TEACH-001',
    targetRole: 'TEACHER',
    priority: 'HIGH',
    status: 'PENDING',
    title: 'Input Penilaian Harian Anak Sentra Seni (Kelompok A)',
    message: '3 santriwati belum terisi data observasi motorik halus hari ini.',
    category: 'ACADEMIC',
    dedupHash: computeDedupHash('TEACHER', 'ACADEMIC', 'Input Penilaian Harian Anak Sentra Seni (Kelompok A)'),
    createdAt: '2026-08-18T06:30:00Z',
    sourceModule: 'Smart Office Guru',
    actionUri: 'r752'
  },
  {
    reminderId: 'REM-TEACH-002',
    targetRole: 'TEACHER',
    priority: 'MEDIUM',
    status: 'PENDING',
    title: 'Persiapan RPP Pekan Depan: Tema Alam Semesta',
    message: 'Draf silabus pekanan dapat ditinjau bersama Asy AI Assistant.',
    category: 'ADMINISTRATION',
    dedupHash: computeDedupHash('TEACHER', 'ADMINISTRATION', 'Persiapan RPP Pekan Depan: Tema Alam Semesta'),
    createdAt: '2026-08-18T06:45:00Z',
    sourceModule: 'Smart Office Guru',
    actionUri: 'r752'
  },
  // 3. FINANCE & UNIVERSAL
  {
    reminderId: 'REM-FIN-001',
    targetRole: 'PARENT',
    priority: 'MEDIUM',
    status: 'PENDING',
    title: 'Pembayaran SPP Infaq Bulan Agustus 2026',
    message: 'Tagihan SPP dan Program Makan Sehat telah diterbitkan dengan metode transfer instan terverifikasi.',
    category: 'FINANCE',
    dedupHash: computeDedupHash('PARENT', 'FINANCE', 'Pembayaran SPP Infaq Bulan Agustus 2026'),
    createdAt: '2026-08-18T07:00:00Z',
    sourceModule: 'Portal Wali Murid',
    actionUri: 'r751'
  },
  {
    reminderId: 'REM-EXEC-002',
    targetRole: 'EXECUTIVE',
    priority: 'MEDIUM',
    status: 'PENDING',
    title: 'Tinjauan Kenaikan Pendaftar PPDB Online Gelombang 2',
    message: 'Pendaftar telah mencapai 92% dari total kuota rombel TK A & TK B.',
    category: 'ADMINISTRATION',
    dedupHash: computeDedupHash('EXECUTIVE', 'ADMINISTRATION', 'Tinjauan Kenaikan Pendaftar PPDB Online Gelombang 2'),
    createdAt: '2026-08-18T07:15:00Z',
    sourceModule: 'Executive SITREP',
    actionUri: 'r753'
  }
];

/**
 * R756 — Smart Reminder Engine
 * Deduplicated, role-targeted notification and reminder dispatcher.
 */
class SmartReminderEngine {
  private static instance: SmartReminderEngine;
  private reminders: SmartReminder[] = [];
  private readonly STORAGE_KEY = 'TADE_SMART_REMINDERS_V7';

  private constructor() {
    this.loadReminders();
  }

  public static getInstance(): SmartReminderEngine {
    if (!SmartReminderEngine.instance) {
      SmartReminderEngine.instance = new SmartReminderEngine();
    }
    return SmartReminderEngine.instance;
  }

  private loadReminders() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.reminders = JSON.parse(stored);
      } else {
        this.reminders = [...DEFAULT_SMART_REMINDERS];
        this.saveReminders();
      }
    } catch {
      this.reminders = [...DEFAULT_SMART_REMINDERS];
    }
  }

  private saveReminders() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reminders));
    } catch (e) {
      console.warn('[SmartReminderEngine] Failed to save reminders', e);
    }
  }

  public getRemindersForRole(role: CompanionRole): SmartReminder[] {
    return this.reminders.filter(r => r.targetRole === role || r.targetRole === 'UNIVERSAL');
  }

  public getAllReminders(): SmartReminder[] {
    return [...this.reminders];
  }

  /**
   * Dispatches a new reminder with strict deduplication check.
   */
  public dispatchReminder(param: {
    targetRole: CompanionRole;
    priority: ReminderPriority;
    title: string;
    message: string;
    category: 'SECURITY' | 'ACADEMIC' | 'FINANCE' | 'RECOVERY' | 'ADMINISTRATION';
    sourceModule: string;
    actionUri?: string;
  }): { success: boolean; reminder?: SmartReminder; reason?: string } {
    const dedupHash = computeDedupHash(param.targetRole, param.category, param.title);

    // Deduplication check: if active reminder with same hash already exists, skip
    const existing = this.reminders.find(r => r.dedupHash === dedupHash && r.status === 'PENDING');
    if (existing) {
      return { success: false, reason: `Duplicate reminder suppressed (DedupHash: ${dedupHash})` };
    }

    const newReminder: SmartReminder = {
      reminderId: `REM-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      targetRole: param.targetRole,
      priority: param.priority,
      status: 'PENDING',
      title: param.title,
      message: param.message,
      category: param.category,
      dedupHash,
      createdAt: new Date().toISOString(),
      sourceModule: param.sourceModule,
      actionUri: param.actionUri
    };

    this.reminders.unshift(newReminder);
    this.saveReminders();
    return { success: true, reminder: newReminder };
  }

  public updateStatus(reminderId: string, status: ReminderStatus): void {
    const r = this.reminders.find(rem => rem.reminderId === reminderId);
    if (r) {
      r.status = status;
      this.saveReminders();
    }
  }

  public resetToDefaults(): void {
    this.reminders = [...DEFAULT_SMART_REMINDERS];
    this.saveReminders();
  }
}

export const smartReminderEngine = SmartReminderEngine.getInstance();
