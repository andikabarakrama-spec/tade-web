import { DataService } from '../../services/db';
import { UserRole } from '../../types/index';

export interface SmartOfficeShortcut {
  id: string;
  label: string;
  description: string;
  targetModuleId: string;
  category: 'AKADEMIK' | 'KEUANGAN' | 'LEGAL' | 'SARPRAS' | 'GOVERNANCE';
  icon: string;
  allowedRoles: UserRole[];
}

export interface SmartOfficeAgendaItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'RAPAT_YAYASAN' | 'SUPERVISI_GURU' | 'PARENTING' | 'AUDIT_INTERNAL' | 'KEGIATAN_SISWA';
  targetRoles: UserRole[];
}

export interface SmartOfficeSystemSnapshot {
  timestamp: string;
  buildStatus: 'CLEAN' | 'DEGRADED';
  activeRoleCount: number;
  unresolvedQueueCount: number;
  criticalAlertCount: number;
  guardianIntegrityScore: number;
  recoveryReadinessScore: number;
  pendingExecutiveDecisions: number;
  lastBackupAgeMinutes: number;
  hermesState: 'DORMANT_SAFE';
}

export class SmartOfficeWorkspaceEngine {
  private static instance: SmartOfficeWorkspaceEngine;

  private shortcuts: SmartOfficeShortcut[] = [
    {
      id: 'SC-01',
      label: 'Verifikasi Calon Siswa PPDB',
      description: 'Review berkas & status kelayakan pendaftaran siswa baru',
      targetModuleId: 'r13',
      category: 'AKADEMIK',
      icon: 'UserCheck',
      allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN']
    },
    {
      id: 'SC-02',
      label: 'Entri Presensi & Anekdot Harian',
      description: 'Pencatatan kehadiran dan observasi tumbuh kembang santri',
      targetModuleId: 'r6',
      category: 'AKADEMIK',
      icon: 'CalendarCheck',
      allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU']
    },
    {
      id: 'SC-03',
      label: 'Kwitansi & Rekonsiliasi SPP',
      description: 'Penerbitan kwitansi dan verifikasi pelunasan syahriah',
      targetModuleId: 'r11',
      category: 'KEUANGAN',
      icon: 'Receipt',
      allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN']
    },
    {
      id: 'SC-04',
      label: 'Penerbitan Surat Resmi & Ijazah',
      description: 'Smart Document Factory dengan segel dan verifikasi QR',
      targetModuleId: 'r16',
      category: 'LEGAL',
      icon: 'FileText',
      allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN']
    },
    {
      id: 'SC-05',
      label: 'Pusat Tata Kelola & Audit RC88',
      description: 'Observabilitas, drift detection, dan buku keputusan eksekutif',
      targetModuleId: 'r710',
      category: 'GOVERNANCE',
      icon: 'ShieldCheck',
      allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN']
    },
    {
      id: 'SC-06',
      label: 'Inventaris & Sarana Prasarana',
      description: 'Pemeriksaan kelayakan aset, APE, dan fasilitas sekolah',
      targetModuleId: 'r18',
      category: 'SARPRAS',
      icon: 'Package',
      allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'ADMIN']
    }
  ];

  private agendas: SmartOfficeAgendaItem[] = [
    {
      id: 'AGD-2026-001',
      title: 'Rapat Paripurna Evaluasi Kurikulum & Akreditasi',
      date: '2026-08-20',
      time: '08:30 - 11:30 WIB',
      location: 'Ruang Rapat Utama & Virtual SIM Room',
      organizer: 'Kepala Sekolah & Yayasan',
      priority: 'HIGH',
      category: 'RAPAT_YAYASAN',
      targetRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU']
    },
    {
      id: 'AGD-2026-002',
      title: 'Supervisi Pembelajaran Sentra & Tahfidz Pekanan',
      date: '2026-08-21',
      time: '07:30 - 10:00 WIB',
      location: 'Kelas Kelompok A & B',
      organizer: 'Tim Kurikulum Asy-Syifa',
      priority: 'MEDIUM',
      category: 'SUPERVISI_GURU',
      targetRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU']
    },
    {
      id: 'AGD-2026-003',
      title: 'Audit Integritas Data & Verifikasi Cadangan Sistem',
      date: '2026-08-22',
      time: '13:00 - 15:00 WIB',
      location: 'War Room Kedaulatan Digital',
      organizer: 'Guardian Directorate',
      priority: 'CRITICAL',
      category: 'AUDIT_INTERNAL',
      targetRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN']
    },
    {
      id: 'AGD-2026-004',
      title: 'Parenting & Konsultasi Perkembangan Santri',
      date: '2026-08-23',
      time: '09:00 - 11:00 WIB',
      location: 'Aula TK Asy-Syifa Tanggul',
      organizer: 'Humas & Komite Sekolah',
      priority: 'MEDIUM',
      category: 'PARENTING',
      targetRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID']
    }
  ];

  public static getInstance(): SmartOfficeWorkspaceEngine {
    if (!SmartOfficeWorkspaceEngine.instance) {
      SmartOfficeWorkspaceEngine.instance = new SmartOfficeWorkspaceEngine();
    }
    return SmartOfficeWorkspaceEngine.instance;
  }

  public getShortcuts(role: UserRole): SmartOfficeShortcut[] {
    return this.shortcuts.filter(s => s.allowedRoles.includes(role));
  }

  public getAgendas(role: UserRole): SmartOfficeAgendaItem[] {
    return this.agendas.filter(a => a.targetRoles.includes(role));
  }

  public getSystemSnapshot(): SmartOfficeSystemSnapshot {
    return {
      timestamp: new Date().toISOString(),
      buildStatus: 'CLEAN',
      activeRoleCount: 5,
      unresolvedQueueCount: 4, // Aggregated pending queue items
      criticalAlertCount: 0,
      guardianIntegrityScore: 100,
      recoveryReadinessScore: 100,
      pendingExecutiveDecisions: 1,
      lastBackupAgeMinutes: 2,
      hermesState: 'DORMANT_SAFE'
    };
  }
}
