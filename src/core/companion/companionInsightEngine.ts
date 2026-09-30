import { CompanionInsightCard, CompanionRole } from './companionTypes';

export const DEFAULT_COMPANION_INSIGHTS: CompanionInsightCard[] = [
  {
    insightId: 'INS-REC-001',
    targetRole: 'EXECUTIVE',
    category: 'SYSTEM_HEALTH',
    title: 'Snapshot Recovery Sehat & Terverifikasi',
    summary: 'RTO tercatat 1.8 detik dan RPO 0 transaksi hilang pada siklus sinkronisasi lokal terakhir.',
    metricValue: '100% HEALTHY',
    recommendation: 'Pertahankan kebijakan auto-backup offline ring-0. Tidak diperlukan intervensi manual.',
    confidenceScore: 98,
    isActionable: false,
    generatedAt: '2026-08-18T06:00:00Z',
    status: 'ACTIVE',
    rationale: 'Kompilasi log SSoT menunjukkan zero partition fault dan zero cryptographic checksum drift.'
  },
  {
    insightId: 'INS-REC-002',
    targetRole: 'EXECUTIVE',
    category: 'OPERATIONS',
    title: 'Peningkatan Antrean Validasi Dokumen PPDB',
    summary: 'Volume berkas pendaftaran santri baru meningkat 34% dalam 48 jam terakhir.',
    metricValue: '18 Berkas Pending',
    recommendation: 'Sarankan pendelegasian verifikasi berkas tahap 1 kepada tim tata usaha untuk mencegah bottleneck.',
    confidenceScore: 92,
    isActionable: true,
    generatedAt: '2026-08-18T06:20:00Z',
    status: 'ACTIVE',
    rationale: 'Waktu rata-rata tunggu persetujuan berkas meningkat dari 2 jam menjadi 5.4 jam.'
  },
  {
    insightId: 'INS-REC-003',
    targetRole: 'TEACHER',
    category: 'STUDENT_DEVELOPMENT',
    title: 'Akselerasi Capaian Hafalan Al-Qur\'an (Juz 30)',
    summary: '85% santri Kelompok B telah menyelesaikan target Surat An-Naba s.d Al-Muthaffifin lebih cepat dari kurikulum.',
    metricValue: '85% On Target',
    recommendation: 'Siapkan pengayaan tilawah metode Ummi level lanjutan untuk kelompok santri akseleratif.',
    confidenceScore: 95,
    isActionable: true,
    generatedAt: '2026-08-18T06:40:00Z',
    status: 'ACTIVE',
    rationale: 'Data rekapitulasi penilaian harian sentra tahfidz menunjukkan konsistensi kelancaran makharijul huruf.'
  },
  {
    insightId: 'INS-REC-004',
    targetRole: 'PARENT',
    category: 'STUDENT_DEVELOPMENT',
    title: 'Peningkatan Keterampilan Motorik Halus Santri',
    summary: 'Ananda menunjukkan antusiasme tinggi pada kegiatan kolase dan menggunting pola di Sentra Bahan Alam.',
    metricValue: 'Sangat Baik (BSB)',
    recommendation: 'Lanjutkan stimulasi motorik di rumah dengan kegiatan meronce atau melipat origami sederhana.',
    confidenceScore: 94,
    isActionable: false,
    generatedAt: '2026-08-18T07:00:00Z',
    status: 'ACTIVE',
    rationale: 'Evaluasi mingguan guru pendamping kelas TK A mencatat kemandirian pemakaian alat tulis yang stabil.'
  },
  {
    insightId: 'INS-REC-005',
    targetRole: 'EXECUTIVE',
    category: 'FINANCE',
    title: 'Kolektibilitas SPP Infaq Bulan Berjalan Mencapai 91%',
    summary: 'Penerimaan pembayaran digital via VA & QRIS real-time mencatat arus kas operasional yang sangat prima.',
    metricValue: 'Rp 48.500.000 / Rp 53.000.000',
    recommendation: 'Kirimkan notifikasi apresiasi santun kepada wali murid yang telah menyelesaikan infaq tepat waktu.',
    confidenceScore: 97,
    isActionable: true,
    generatedAt: '2026-08-18T07:10:00Z',
    status: 'ACTIVE',
    rationale: 'Buku kas SSoT terhubung tanpa rekonsiliasi yang tertunda.'
  }
];

/**
 * R757 — Companion Insight Engine
 * Generates and filters proactive analytical cards for companions.
 */
class CompanionInsightEngine {
  private static instance: CompanionInsightEngine;
  private insights: CompanionInsightCard[] = [];

  private constructor() {
    this.insights = [...DEFAULT_COMPANION_INSIGHTS];
  }

  public static getInstance(): CompanionInsightEngine {
    if (!CompanionInsightEngine.instance) {
      CompanionInsightEngine.instance = new CompanionInsightEngine();
    }
    return CompanionInsightEngine.instance;
  }

  public getInsightsForRole(role: CompanionRole): CompanionInsightCard[] {
    return this.insights.filter(i => (i.targetRole === role || i.targetRole === 'UNIVERSAL') && i.status === 'ACTIVE');
  }

  public getAllInsights(): CompanionInsightCard[] {
    return [...this.insights];
  }

  public markActioned(insightId: string): void {
    const card = this.insights.find(c => c.insightId === insightId);
    if (card) {
      card.status = 'ACTIONED';
    }
  }

  public archiveInsight(insightId: string): void {
    const card = this.insights.find(c => c.insightId === insightId);
    if (card) {
      card.status = 'ARCHIVED';
    }
  }
}

export const companionInsightEngine = CompanionInsightEngine.getInstance();
