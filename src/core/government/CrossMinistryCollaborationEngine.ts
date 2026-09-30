/**
 * TADE RC79 — R617: CROSS-MINISTRY COLLABORATION ENGINE
 * Coordinates multi-ministry autonomous business flows without duplicate inputs:
 * Example: PPDB (Student Verification) -> Keuangan (VA & Invoicing) -> Administrasi (Student ID & Letter) -> Knowledge Vault (Digital Locker)
 */

export interface CollaborationPipelineStep {
  stepOrder: number;
  ministryCode: string;
  ministryName: string;
  executorNip: string;
  executorName: string;
  actionTaken: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  outputDataKeys: string[];
  completedAt?: string;
}

export interface CrossMinistryTransaction {
  transactionId: string;
  title: string;
  category: 'STUDENT_ONBOARDING' | 'DISBURSEMENT_SETTLEMENT' | 'EXAM_PREPARATION' | 'ASSET_PROCUREMENT';
  originatingEntity: string;
  sharedPayloadHash: string;
  overallStatus: 'ACTIVE_FLOW' | 'COMPLETED' | 'BLOCKED';
  initiatedAt: string;
  steps: CollaborationPipelineStep[];
}

class CrossMinistryCollaborationCore {
  private static instance: CrossMinistryCollaborationCore | null = null;
  private transactions: CrossMinistryTransaction[] = [];

  private constructor() {
    this.bootstrapTransactions();
  }

  public static getInstance(): CrossMinistryCollaborationCore {
    if (!CrossMinistryCollaborationCore.instance) {
      CrossMinistryCollaborationCore.instance = new CrossMinistryCollaborationCore();
    }
    return CrossMinistryCollaborationCore.instance;
  }

  private bootstrapTransactions(): void {
    const now = Date.now();
    this.transactions = [
      {
        transactionId: 'XMIN-PPDB-2026-001',
        title: 'Alur Penerimaan & Registrasi Santri Baru (Ahmad Fauzi — No. Reg PPDB-8841)',
        category: 'STUDENT_ONBOARDING',
        originatingEntity: 'Kementerian PPDB',
        sharedPayloadHash: 'SHA256-ONBOARD-AHMADFAUZI-884199',
        overallStatus: 'ACTIVE_FLOW',
        initiatedAt: new Date(now - 3600000 * 3).toISOString(),
        steps: [
          {
            stepOrder: 1,
            ministryCode: 'MIN_PPDB',
            ministryName: 'Kementerian PPDB & Seleksi',
            executorNip: 'NIP-MIN04-001',
            executorName: 'Pegawai Verifikasi Berkas Calon Santri',
            actionTaken: 'Verifikasi KK & Ijazah lolos uji berkas',
            status: 'COMPLETED',
            outputDataKeys: ['student_id: 20260801', 'nisn: 0098765432', 'jalur: TAHFIDZ'],
            completedAt: new Date(now - 3600000 * 2.8).toISOString()
          },
          {
            stepOrder: 2,
            ministryCode: 'MIN_KEUANGAN',
            ministryName: 'Kementerian Keuangan & Perbendaharaan',
            executorNip: 'NIP-MIN03-001',
            executorName: 'Pegawai Tagihan & Virtual Account SPP',
            actionTaken: 'Penerbitan VA BSI & Rekonsiliasi Infaq Awal Rp 3.500.000 (Lunas)',
            status: 'COMPLETED',
            outputDataKeys: ['va_bsi: 9882026080100', 'payment_status: PAID', 'receipt_no: REC-AUG-9912'],
            completedAt: new Date(now - 3600000 * 1.5).toISOString()
          },
          {
            stepOrder: 3,
            ministryCode: 'MIN_ADMINISTRASI',
            ministryName: 'Kementerian Administrasi & Tata Usaha',
            executorNip: 'NIP-MIN02-002',
            executorName: 'Pegawai Legalisir Digital & Stempel QR',
            actionTaken: 'Penerbitan Surat Keputusan Santri Aktif & Pembuatan Smart Card QR',
            status: 'IN_PROGRESS',
            outputDataKeys: ['sk_number: 421.1/SK-DIR/08/2026', 'qr_token: HMAC-STAMP-421'],
            completedAt: undefined
          },
          {
            stepOrder: 4,
            ministryCode: 'MIN_KNOWLEDGE_VAULT',
            ministryName: 'Kementerian Knowledge Vault & Khazanah Kitab',
            executorNip: 'AST-KV-01',
            executorName: 'Asisten Katalog Kitab & Locker Santri',
            actionTaken: 'Alokasi Locker Buku Digital & Paket Silabus Kitab Jurumiyah',
            status: 'PENDING',
            outputDataKeys: ['digital_locker_id: LCKR-20260801', 'syllabus_pack: JURUMIYAH_AQIDAH_V1'],
            completedAt: undefined
          }
        ]
      },
      {
        transactionId: 'XMIN-PROC-2026-002',
        title: 'Pengadaan Perangkat Laboratorium Bahasa & Komputer Madrasah',
        category: 'ASSET_PROCUREMENT',
        originatingEntity: 'Kementerian Smart Office',
        sharedPayloadHash: 'SHA256-PROC-LAB-BAHASA-7741',
        overallStatus: 'COMPLETED',
        initiatedAt: new Date(now - 86400000 * 2).toISOString(),
        steps: [
          {
            stepOrder: 1,
            ministryCode: 'MIN_SMART_OFFICE',
            ministryName: 'Kementerian Smart Office & Aset',
            executorNip: 'AST-SO-01',
            executorName: 'Asisten Inventaris & Aset',
            actionTaken: 'Spesifikasi teknis 30 Unit PC & Barcode Asset Tagging',
            status: 'COMPLETED',
            outputDataKeys: ['asset_count: 30', 'spec: CORE_I5_16GB', 'location: LAB_B'],
            completedAt: new Date(now - 86400000 * 1.8).toISOString()
          },
          {
            stepOrder: 2,
            ministryCode: 'MIN_KEUANGAN',
            ministryName: 'Kementerian Keuangan & Perbendaharaan',
            executorNip: 'NIP-MIN03-002',
            executorName: 'Pegawai Buku Kas & Jurnal Pengeluaran',
            actionTaken: 'Pencairan DIPA Anggaran Sarpras Rp 45.000.000 dengan persetujuan Sovereign',
            status: 'COMPLETED',
            outputDataKeys: ['voucher_id: VCH-SARPRAS-08', 'sovereign_approval: YES'],
            completedAt: new Date(now - 86400000 * 1.2).toISOString()
          },
          {
            stepOrder: 3,
            ministryCode: 'MIN_PENDIDIKAN',
            ministryName: 'Kementerian Pendidikan & Kurikulum Pesantren',
            executorNip: 'NIP-MIN01-001',
            executorName: 'Pegawai Jadwal Pelajaran & Roster',
            actionTaken: 'Integrasi jadwal praktikum bahasa arab & inggris ke kalender KBM',
            status: 'COMPLETED',
            outputDataKeys: ['roster_slot: SENIN_KAMIS_1400', 'status: ACTIVE'],
            completedAt: new Date(now - 86400000 * 0.5).toISOString()
          }
        ]
      }
    ];
  }

  public getTransactions(): CrossMinistryTransaction[] {
    return this.transactions;
  }

  public advancePipelineStep(transactionId: string): boolean {
    const tx = this.transactions.find(t => t.transactionId === transactionId);
    if (!tx) return false;

    const inProgStep = tx.steps.find(s => s.status === 'IN_PROGRESS');
    if (inProgStep) {
      inProgStep.status = 'COMPLETED';
      inProgStep.completedAt = new Date().toISOString();
      const nextStep = tx.steps.find(s => s.stepOrder === inProgStep.stepOrder + 1);
      if (nextStep) {
        nextStep.status = 'IN_PROGRESS';
      } else {
        tx.overallStatus = 'COMPLETED';
      }
      return true;
    } else {
      const pendingStep = tx.steps.find(s => s.status === 'PENDING');
      if (pendingStep) {
        pendingStep.status = 'IN_PROGRESS';
        return true;
      }
    }
    return false;
  }
}

export const crossMinistryCollaboration = CrossMinistryCollaborationCore.getInstance();
