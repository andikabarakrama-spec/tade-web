/**
 * ADMIN COMPANION SERVICE — SPRINT G8 & G9
 * "Admin Never Alone Mode": Proactive Smart Operations Companion Asy for SIM Admin.
 * Scans pending queues, uncompleted archives, unsent broadcasts, and unselected photos.
 * P6: Quick Verify, Batch Approve, Draft Broadcast, Smart Reminder, Pending Counter.
 * Pure Brand: Asy Syifa Living Companion Engine.
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { founderCommandRecorder } from './founderCommandRecorder';

export interface AdminProactiveSuggestion {
  id: string;
  category: 'PPDB' | 'BROADCAST' | 'ARCHIVE' | 'RAPOR_PHOTO' | 'FINANCE';
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  affectedCount: number;
  actionLabel: string;
  actionPayload: string;
  dismissed: boolean;
}

export interface AdminProductivityMetrics {
  pendingPPDBCount: number;
  pendingBroadcastDrafts: number;
  incompleteArchivesCount: number;
  pendingRaporPhotos: number;
  totalPendingTasks: number;
}

export class AdminCompanionService {
  private static instance: AdminCompanionService | null = null;
  private suggestions: AdminProactiveSuggestion[] = [];
  private metrics: AdminProductivityMetrics = {
    pendingPPDBCount: 2,
    pendingBroadcastDrafts: 1,
    incompleteArchivesCount: 3,
    pendingRaporPhotos: 1,
    totalPendingTasks: 7
  };

  public static getInstance(): AdminCompanionService {
    if (!AdminCompanionService.instance) {
      AdminCompanionService.instance = new AdminCompanionService();
    }
    return AdminCompanionService.instance;
  }

  constructor() {
    this.refreshSuggestions();
  }

  public refreshSuggestions(): AdminProactiveSuggestion[] {
    this.suggestions = [
      {
        id: 'SUGG-PPDB-01',
        category: 'PPDB',
        urgency: 'HIGH',
        title: 'Berkas PPDB Menunggu Verifikasi',
        description: 'Terdapat 2 calon santri gelombang reguler dengan berkas lengkap yang belum divalidasi.',
        affectedCount: this.metrics.pendingPPDBCount,
        actionLabel: 'Quick Verify Berkas PPDB',
        actionPayload: 'QUICK_VERIFY_PPDB',
        dismissed: false
      },
      {
        id: 'SUGG-BC-02',
        category: 'BROADCAST',
        urgency: 'MEDIUM',
        title: 'Draft Maklumat Maulid Belum Dikirim',
        description: 'Maklumat persiapan Pawai Hijriyah & Hari Santri siap dibroadcast ke 124 wali murid.',
        affectedCount: 124,
        actionLabel: 'Kirim Draft Maklumat WA',
        actionPayload: 'SEND_DRAFT_BROADCAST',
        dismissed: false
      },
      {
        id: 'SUGG-ARCH-03',
        category: 'ARCHIVE',
        urgency: 'MEDIUM',
        title: 'Arsip Dokumen Santri Belum Lengkap',
        description: '3 santri Kelompok Bermain belum mengunggah salinan Kartu Menuju Sehat (KMS).',
        affectedCount: this.metrics.incompleteArchivesCount,
        actionLabel: 'Kirim Smart Reminder WA',
        actionPayload: 'SEND_SMART_REMINDER',
        dismissed: false
      },
      {
        id: 'SUGG-PHOTO-04',
        category: 'RAPOR_PHOTO',
        urgency: 'LOW',
        title: 'Foto Sampul E-Rapor Sentra Belum Dipilih',
        description: 'Dokumentasi unjuk karya sentra seni siap dipilih untuk sampul buku kenangan semester ini.',
        affectedCount: 1,
        actionLabel: 'Pilih Foto Portofolio',
        actionPayload: 'OPEN_PHOTO_CURATOR',
        dismissed: false
      }
    ];

    return [...this.suggestions];
  }

  public getActiveSuggestions(): AdminProactiveSuggestion[] {
    return this.suggestions.filter(s => !s.dismissed);
  }

  public getMetrics(): AdminProductivityMetrics {
    return { ...this.metrics };
  }

  public dismissSuggestion(id: string): void {
    const s = this.suggestions.find(item => item.id === id);
    if (s) {
      s.dismissed = true;
    }
  }

  /**
   * P6: Quick Verify Execution
   */
  public executeQuickVerifyPPDB(): { success: boolean; message: string } {
    this.metrics.pendingPPDBCount = Math.max(0, this.metrics.pendingPPDBCount - 1);
    this.metrics.totalPendingTasks = Object.values(this.metrics).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0) - this.metrics.totalPendingTasks;
    this.refreshSuggestions();

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'R13-PPDB',
      role: 'ADMIN',
      category: 'PPDB_APPROVAL',
      eventType: 'ACTION',
      details: 'Admin mengeksekusi Quick Verify: Dokumen persyaratan PPDB diverifikasi valid.',
      severity: 'INFO'
    });

    return {
      success: true,
      message: 'Quick Verify berhasil: Berkas pendaftar disetujui & dialihkan ke tahap penetapan SPP.'
    };
  }

  /**
   * P6: Batch Approve Execution
   */
  public executeBatchApprove(): { success: boolean; count: number; message: string } {
    const count = this.metrics.pendingPPDBCount;
    this.metrics.pendingPPDBCount = 0;
    this.metrics.totalPendingTasks = Math.max(0, this.metrics.totalPendingTasks - count);
    this.refreshSuggestions();

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'R13-PPDB',
      role: 'ADMIN',
      category: 'PPDB_APPROVAL',
      eventType: 'ACTION',
      details: `Admin mengeksekusi Batch Approve Aman untuk ${count} berkas PPDB terverifikasi.`,
      severity: 'INFO'
    });

    return {
      success: true,
      count,
      message: `Batch Approve selesai: ${count} pendaftar berstatus Lengkap telah disetujui secara aman.`
    };
  }

  /**
   * P6: Draft Broadcast Execution
   */
  public executeSendDraftBroadcast(): { success: boolean; recipientCount: number; message: string } {
    this.metrics.pendingBroadcastDrafts = 0;
    this.metrics.totalPendingTasks = Math.max(0, this.metrics.totalPendingTasks - 1);
    this.refreshSuggestions();

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'LIVING-MESSENGER',
      role: 'ADMIN',
      category: 'BROADCAST_SEND',
      eventType: 'ACTION',
      details: 'Draft Maklumat Maulid & Pawai Hijriyah disiarkan ke 124 wali murid.',
      severity: 'INFO'
    });

    return {
      success: true,
      recipientCount: 124,
      message: 'Draft Maklumat berhasil disiarkan ke 124 Wali Murid melalui antrean resmi Asy Syifa.'
    };
  }

  /**
   * P6: Smart Reminder WA Execution
   */
  public executeSendSmartReminder(): { success: boolean; count: number; message: string } {
    const count = this.metrics.incompleteArchivesCount;
    this.metrics.incompleteArchivesCount = 0;
    this.metrics.totalPendingTasks = Math.max(0, this.metrics.totalPendingTasks - 1);
    this.refreshSuggestions();

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'ARCHIVE-COMPANION',
      role: 'ADMIN',
      category: 'BROADCAST_SEND',
      eventType: 'ACTION',
      details: `Smart Reminder pengunggahan KMS terkirim ke ${count} orang tua santri.`,
      severity: 'INFO'
    });

    return {
      success: true,
      count,
      message: `Smart Reminder santun terkirim ke ${count} wali murid via antrean WA resmi.`
    };
  }
}

export const adminCompanionService = AdminCompanionService.getInstance();

