import { UserRole } from '../../types';
import { ImmutableGovernanceJournal } from './immutableGovernanceJournal';

export type ApprovalStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type ApprovalPriority = 'ROUTINE' | 'ELEVATED' | 'URGENT' | 'CONSTITUTIONAL';
export type ApprovalCategory = 'FINANCIAL_DISBURSEMENT' | 'POLICY_AMENDMENT' | 'STAFF_APPOINTMENT' | 'CURRICULUM_CHANGE' | 'INFRASTRUCTURE';

export interface ApprovalRequest {
  requestId: string;
  code: string;
  title: string;
  category: ApprovalCategory;
  priority: ApprovalPriority;
  submittedByName: string;
  submittedByRole: UserRole;
  submittedAt: string;
  status: ApprovalStatus;
  currentAssigneeRole: 'KEPALA_SEKOLAH' | 'KETUA_YAYASAN' | 'SUPER_ADMIN';
  requiredRole: UserRole[];
  amount?: number;
  justification: string;
  decisionNotes?: string;
  reviewedByName?: string;
  reviewedByRole?: UserRole;
  reviewedAt?: string;
}

export class InstitutionalApprovalWorkflow {
  private static instance: InstitutionalApprovalWorkflow;
  private requests: Map<string, ApprovalRequest> = new Map();

  private constructor() {
    this.seedRequests();
  }

  public static getInstance(): InstitutionalApprovalWorkflow {
    if (!InstitutionalApprovalWorkflow.instance) {
      InstitutionalApprovalWorkflow.instance = new InstitutionalApprovalWorkflow();
    }
    return InstitutionalApprovalWorkflow.instance;
  }

  private seedRequests() {
    const r1: ApprovalRequest = {
      requestId: 'APR-2026-001',
      code: 'REQ-GOV-01',
      title: 'Pengadaan Perlengkapan Belajar Sentra Balok & Bahan Alam',
      category: 'FINANCIAL_DISBURSEMENT',
      priority: 'ROUTINE',
      submittedByName: 'Ustadzah Fatimah, S.Pd',
      submittedByRole: 'GURU',
      submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      status: 'APPROVED',
      currentAssigneeRole: 'KEPALA_SEKOLAH',
      requiredRole: ['KEPALA_SEKOLAH'],
      amount: 1750000,
      justification: 'Menunjang kegiatan praktik montessori dan pembelajaran berbasis alam pada semester ganjil.',
      decisionNotes: 'Disetujui untuk dibelanjakan via kas operasional sekolah.',
      reviewedByName: 'Ustadzah Nurul Hidayah, S.Pd',
      reviewedByRole: 'KEPALA_SEKOLAH',
      reviewedAt: new Date(Date.now() - 3600000 * 24).toISOString()
    };

    const r2: ApprovalRequest = {
      requestId: 'APR-2026-002',
      code: 'REQ-GOV-02',
      title: 'Penetapan Draf Pedoman Tata Kelola Digital RC95',
      category: 'POLICY_AMENDMENT',
      priority: 'CONSTITUTIONAL',
      submittedByName: 'Ustadzah Nurul Hidayah, S.Pd',
      submittedByRole: 'KEPALA_SEKOLAH',
      submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'UNDER_REVIEW',
      currentAssigneeRole: 'KETUA_YAYASAN',
      requiredRole: ['KETUA_YAYASAN', 'SUPER_ADMIN'],
      justification: 'Ratifikasi konstitusi sistem pemerintahan digital mandiri TADE.'
    };

    const r3: ApprovalRequest = {
      requestId: 'APR-2026-003',
      code: 'REQ-GOV-03',
      title: 'Penggantian Router Gateway & UPS Ruang Server SIM',
      category: 'INFRASTRUCTURE',
      priority: 'ELEVATED',
      submittedByName: 'Staff IT & Administrasi',
      submittedByRole: 'ADMIN',
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
      currentAssigneeRole: 'KETUA_YAYASAN',
      requiredRole: ['KETUA_YAYASAN', 'SUPER_ADMIN'],
      amount: 3200000,
      justification: 'Mencegah pemadaman tiba-tiba saat proses sync database offline local continuity.'
    };

    this.requests.set(r1.requestId, r1);
    this.requests.set(r2.requestId, r2);
    this.requests.set(r3.requestId, r3);
  }

  public getAllRequests(): ApprovalRequest[] {
    return Array.from(this.requests.values()).sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  public getPendingForRole(role: UserRole): ApprovalRequest[] {
    if (role === 'SUPER_ADMIN') {
      return this.getAllRequests().filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW');
    }
    return this.getAllRequests().filter(r => 
      (r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW') && 
      (r.currentAssigneeRole === role || r.requiredRole.includes(role))
    );
  }

  public processDecision(
    requestId: string,
    action: 'APPROVE' | 'REJECT',
    reviewerName: string,
    reviewerRole: UserRole,
    notes: string
  ): { success: boolean; message: string } {
    const req = this.requests.get(requestId);
    if (!req) {
      return { success: false, message: 'Permohonan persetujuan tidak ditemukan.' };
    }

    if (
      reviewerRole !== 'SUPER_ADMIN' && 
      reviewerRole !== 'KETUA_YAYASAN' && 
      reviewerRole !== req.currentAssigneeRole
    ) {
      return { success: false, message: `Peran ${reviewerRole} tidak memiliki otoritas menyetujui permohonan ini.` };
    }

    req.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    req.decisionNotes = notes || (action === 'APPROVE' ? 'Disetujui secara institusional.' : 'Ditolak.');
    req.reviewedByName = reviewerName;
    req.reviewedByRole = reviewerRole;
    req.reviewedAt = new Date().toISOString();

    this.requests.set(requestId, { ...req });

    // Append to immutable journal
    ImmutableGovernanceJournal.getInstance().appendEntry({
      eventType: action === 'APPROVE' ? 'APPROVAL_GRANTED' : 'APPROVAL_REJECTED',
      title: `${action === 'APPROVE' ? 'Persetujuan' : 'Penolakan'} ${req.code} - ${req.title}`,
      summary: `Diproses oleh ${reviewerName} (${reviewerRole}). Catatan: ${req.decisionNotes}`,
      performedByRole: reviewerRole,
      performedByName: reviewerName,
      metadata: { requestId, category: req.category, amount: req.amount }
    });

    return { 
      success: true, 
      message: `Permohonan ${req.code} berhasil di-${action === 'APPROVE' ? 'setujui' : 'tolak'}.` 
    };
  }

  public submitRequest(params: {
    title: string;
    category: ApprovalCategory;
    priority?: ApprovalPriority;
    submittedByName: string;
    submittedByRole: UserRole;
    currentAssigneeRole: 'KEPALA_SEKOLAH' | 'KETUA_YAYASAN' | 'SUPER_ADMIN';
    justification: string;
    amount?: number;
  }): { success: boolean; message: string; requestId: string } {
    const idNum = this.requests.size + 1;
    const requestId = `APR-2026-${String(idNum).padStart(3, '0')}`;
    const code = `REQ-GOV-${String(idNum).padStart(2, '0')}`;

    const newReq: ApprovalRequest = {
      requestId,
      code,
      title: params.title,
      category: params.category,
      priority: params.priority || 'ROUTINE',
      submittedByName: params.submittedByName,
      submittedByRole: params.submittedByRole,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
      currentAssigneeRole: params.currentAssigneeRole,
      requiredRole: [params.currentAssigneeRole, 'SUPER_ADMIN'],
      amount: params.amount,
      justification: params.justification
    };

    this.requests.set(requestId, newReq);

    // Record in journal
    ImmutableGovernanceJournal.getInstance().appendEntry({
      eventType: 'WORKFLOW_SUBMISSION',
      title: `Pengajuan Permohonan ${code}: ${params.title}`,
      summary: `Diajukan oleh ${params.submittedByName} (${params.submittedByRole}) kepada ${params.currentAssigneeRole}`,
      performedByRole: params.submittedByRole,
      performedByName: params.submittedByName,
      metadata: { requestId, category: params.category, amount: params.amount }
    });

    return {
      success: true,
      message: `Permohonan ${code} berhasil diajukan untuk ditinjau oleh ${params.currentAssigneeRole}.`,
      requestId
    };
  }
}
