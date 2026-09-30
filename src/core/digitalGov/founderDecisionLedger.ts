import { UserRole } from '../../types';

export type DecisionStatus = 'DRAFT' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

export type DecisionCategory = 
  | 'STRATEGIC_DIRECTION' 
  | 'SECURITY_POLICY' 
  | 'CURRICULUM_CHARTER' 
  | 'BUDGET_ALLOCATION' 
  | 'INFRASTRUCTURE_EXPANSION' 
  | 'DISASTER_RECOVERY';

export interface FounderDecision {
  decisionId: string;
  code: string;
  category: DecisionCategory;
  title: string;
  reason: string;
  impactAssessment: string;
  decisionDate: string;
  status: DecisionStatus;
  authorRole: UserRole;
  authorName: string;
  approvedBy?: string;
  approvedAt?: string;
  founderNotes: string;
  cryptographicSeal: string;
}

export class FounderDecisionLedger {
  private static instance: FounderDecisionLedger;
  private decisions: Map<string, FounderDecision> = new Map();

  private constructor() {
    this.seedDecisions();
  }

  public static getInstance(): FounderDecisionLedger {
    if (!FounderDecisionLedger.instance) {
      FounderDecisionLedger.instance = new FounderDecisionLedger();
    }
    return FounderDecisionLedger.instance;
  }

  private seedDecisions() {
    const d1: FounderDecision = {
      decisionId: 'FDL-2026-001',
      code: 'DEC-RC95-01',
      category: 'STRATEGIC_DIRECTION',
      title: 'Kemandirian Infrastruktur Digital & Zero Vendor Lock-in',
      reason: 'Melindungi privasi santri dan wali murid serta menjamin kedaulatan data jangka panjang tanpa ketergantungan API berbayar eksternal.',
      impactAssessment: 'Sistem SIM dan Website beroperasi secara independen; biaya operasional tetap nol rupiah (Free-First).',
      decisionDate: new Date(Date.now() - 3600000 * 72).toISOString(),
      status: 'APPROVED',
      authorRole: 'KETUA_YAYASAN',
      authorName: 'H. Andika Barakrama',
      approvedBy: 'Super Administrator & Ketua Yayasan',
      approvedAt: new Date(Date.now() - 3600000 * 70).toISOString(),
      founderNotes: 'Wajib dipatuhi pada seluruh siklus hidup modul TADE.',
      cryptographicSeal: 'SEAL-FDL-990184A1'
    };

    const d2: FounderDecision = {
      decisionId: 'FDL-2026-002',
      code: 'DEC-RC95-02',
      category: 'CURRICULUM_CHARTER',
      title: 'Integrasi Kurikulum Merdeka Berbasis Adab & Tahfidz Al-Qur\'an',
      reason: 'Menyeimbangkan capaian literasi numerasi modern dengan pembentukan karakter Islami sejak usia dini.',
      impactAssessment: 'Format rapor PAUD terintegrasi dengan rubrik capaian adab dan hafalan surat pendek.',
      decisionDate: new Date(Date.now() - 3600000 * 36).toISOString(),
      status: 'APPROVED',
      authorRole: 'KEPALA_SEKOLAH',
      authorName: 'Ustadzah Nurul Hidayah, S.Pd',
      approvedBy: 'Ketua Yayasan',
      approvedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      founderNotes: 'Diterapkan mulai Semester Ganjil TA 2026/2027.',
      cryptographicSeal: 'SEAL-FDL-771249C3'
    };

    const d3: FounderDecision = {
      decisionId: 'FDL-2026-003',
      code: 'DEC-RC95-03',
      category: 'BUDGET_ALLOCATION',
      title: 'Draf Alokasi Pengadaan Tablet Digital Guru Kelas',
      reason: 'Meningkatkan efisiensi pencatatan kehadiran dan pengisian jurnal pendamping digital di kelas.',
      impactAssessment: 'Estimasi anggaran Rp 6.000.000,- untuk 4 unit device lokal.',
      decisionDate: new Date().toISOString(),
      status: 'DRAFT',
      authorRole: 'ADMIN',
      authorName: 'Staff Administrasi SIM',
      founderNotes: 'Menunggu review kesiapan cashflow dari Bendahara.',
      cryptographicSeal: 'SEAL-FDL-DRAFT-003'
    };

    this.decisions.set(d1.decisionId, d1);
    this.decisions.set(d2.decisionId, d2);
    this.decisions.set(d3.decisionId, d3);
  }

  public getAllDecisions(): FounderDecision[] {
    return Array.from(this.decisions.values()).sort((a, b) => 
      new Date(b.decisionDate).getTime() - new Date(a.decisionDate).getTime()
    );
  }

  public getDecisionById(id: string): FounderDecision | undefined {
    return this.decisions.get(id);
  }

  public createDecision(params: {
    category: DecisionCategory;
    title: string;
    reason: string;
    impactAssessment: string;
    authorRole: UserRole;
    authorName: string;
    founderNotes?: string;
  }): FounderDecision {
    const id = `FDL-2026-${String(this.decisions.size + 1).padStart(3, '0')}`;
    const code = `DEC-RC95-${String(this.decisions.size + 1).padStart(2, '0')}`;
    const newDecision: FounderDecision = {
      decisionId: id,
      code,
      category: params.category,
      title: params.title,
      reason: params.reason,
      impactAssessment: params.impactAssessment,
      decisionDate: new Date().toISOString(),
      status: 'DRAFT',
      authorRole: params.authorRole,
      authorName: params.authorName,
      founderNotes: params.founderNotes || '',
      cryptographicSeal: `SEAL-FDL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    this.decisions.set(id, newDecision);
    return newDecision;
  }

  public updateStatus(
    decisionId: string, 
    newStatus: DecisionStatus, 
    actorName: string, 
    actorRole: UserRole
  ): { success: boolean; message: string } {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      return { success: false, message: 'Keputusan tidak ditemukan.' };
    }

    if (actorRole !== 'SUPER_ADMIN' && actorRole !== 'KETUA_YAYASAN') {
      return { success: false, message: 'Hanya Super Admin atau Ketua Yayasan yang berhak mengubah status keputusan.' };
    }

    decision.status = newStatus;
    if (newStatus === 'APPROVED') {
      decision.approvedBy = `${actorName} (${actorRole})`;
      decision.approvedAt = new Date().toISOString();
    }
    this.decisions.set(decisionId, { ...decision });
    return { success: true, message: `Status keputusan berhasil diperbarui menjadi ${newStatus}.` };
  }
}
