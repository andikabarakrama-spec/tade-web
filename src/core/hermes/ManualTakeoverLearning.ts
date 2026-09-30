export type CandidateStatus = 'CANDIDATE' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

export interface WorkflowDelta {
  originalPlannedSteps: string[];
  actualHumanActionSteps: string[];
  addedSteps: string[];
  omittedSteps: string[];
  modifiedParameters: Record<string, any>;
  observedAdvantage: string;
}

export interface LearningCandidate {
  candidateId: string;
  sourceTaskId: string;
  category: string;
  takeoverByRole: string;
  takeoverReason: string;
  delta: WorkflowDelta;
  suggestedWorkflowRevision: {
    proposedTitle: string;
    proposedSteps: string[];
    riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
    invariantCheckPassed: boolean;
  };
  status: CandidateStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
  dryRunLabPassed?: boolean;
}

export class ManualTakeoverLearning {
  private static instance: ManualTakeoverLearning;
  private candidates: LearningCandidate[] = [];

  private constructor() {
    this.seedSampleCandidates();
  }

  public static getInstance(): ManualTakeoverLearning {
    if (!ManualTakeoverLearning.instance) {
      ManualTakeoverLearning.instance = new ManualTakeoverLearning();
    }
    return ManualTakeoverLearning.instance;
  }

  private seedSampleCandidates(): void {
    this.candidates = [
      {
        candidateId: 'CAND-2026-001',
        sourceTaskId: 'TASK-2026-0804',
        category: 'TABUNGAN',
        takeoverByRole: 'KEPALA_SEKOLAH',
        takeoverReason: 'Penarikan kas tabungan santri > Rp 1.000.000 tertahan di Safety Gate butuh otorisasi pimpinan',
        delta: {
          originalPlannedSteps: [
            '1. Aggregate Debit & Credit',
            '2. Direct Balance Mutation in Ledger'
          ],
          actualHumanActionSteps: [
            '1. Aggregate Debit & Credit',
            '2. Multi-Signature Verification Check',
            '3. Digital Signature Authorization by Kepala Madrasah',
            '4. Post-Authorization Ledger Mutation'
          ],
          addedSteps: [
            'Multi-Signature Verification Check',
            'Digital Signature Authorization by Kepala Madrasah'
          ],
          omittedSteps: [],
          modifiedParameters: { multiSigThreshold: 1000000 },
          observedAdvantage: 'Menyematkan pra-verifikasi digital signature pimpinan sebelum menyentuh SSoT Ledger, mencegah status BLOCKED mendadak.'
        },
        suggestedWorkflowRevision: {
          proposedTitle: 'WF-TAB-03-REV: Rekonsiliasi Tabungan Terintegrasi Multi-Sig Approval Gate',
          proposedSteps: [
            'Fetch & Aggregate Records',
            'Pre-Flight Multi-Signature Requirement Evaluation',
            'Queue Digital Signature Request to Kepala Madrasah',
            'Execute Sealed Ledger Post-Authorization Mutation'
          ],
          riskAssessment: 'LOW',
          invariantCheckPassed: true
        },
        status: 'CANDIDATE',
        createdAt: '2026-08-17T09:10:00Z',
        dryRunLabPassed: true
      },
      {
        candidateId: 'CAND-2026-002',
        sourceTaskId: 'TASK-2026-0802',
        category: 'SPP_PEMBAYARAN',
        takeoverByRole: 'ADMIN_TU',
        takeoverReason: 'Wali santri meminta pemisahan tagihan SPP bulanan dengan iuran seragam',
        delta: {
          originalPlannedSteps: [
            '1. Calculate Global Single Invoice'
          ],
          actualHumanActionSteps: [
            '1. Segregate Invoice: SPP Rutin vs Perlengkapan Santri',
            '2. Generate Dual Receipt Records'
          ],
          addedSteps: ['Itemized Invoice Segregation'],
          omittedSteps: ['Lump-Sum Single Invoice'],
          modifiedParameters: { separateUniformFees: true },
          observedAdvantage: 'Transparansi pelaporan kas yayasan meningkat dan memudahkan pembukuan pos seragam.'
        },
        suggestedWorkflowRevision: {
          proposedTitle: 'WF-SPP-02-REV: Rekapitulasi Terpisah SPP Rutin & Pos Biaya Sarpras',
          proposedSteps: [
            'Scan Active Accounts',
            'Segregate Operational SPP from Material Fees',
            'Generate Dual Verified Vouchers'
          ],
          riskAssessment: 'LOW',
          invariantCheckPassed: true
        },
        status: 'REVIEWING',
        createdAt: '2026-08-17T09:30:00Z',
        dryRunLabPassed: true
      }
    ];
  }

  public getAllCandidates(): LearningCandidate[] {
    return [...this.candidates];
  }

  public getCandidateById(candidateId: string): LearningCandidate | undefined {
    return this.candidates.find(c => c.candidateId === candidateId);
  }

  public recordTakeover(
    taskId: string,
    category: string,
    role: string,
    reason: string,
    originalSteps: string[],
    humanSteps: string[],
    addedSteps: string[],
    omittedSteps: string[],
    advantage: string,
    proposedTitle: string,
    proposedSteps: string[]
  ): LearningCandidate {
    const id = `CAND-2026-${String(this.candidates.length + 1).padStart(3, '0')}`;
    const newCandidate: LearningCandidate = {
      candidateId: id,
      sourceTaskId: taskId,
      category,
      takeoverByRole: role,
      takeoverReason: reason,
      delta: {
        originalPlannedSteps: originalSteps,
        actualHumanActionSteps: humanSteps,
        addedSteps,
        omittedSteps,
        modifiedParameters: {},
        observedAdvantage: advantage
      },
      suggestedWorkflowRevision: {
        proposedTitle,
        proposedSteps,
        riskAssessment: 'LOW',
        invariantCheckPassed: true
      },
      status: 'CANDIDATE',
      createdAt: new Date().toISOString(),
      dryRunLabPassed: false
    };

    this.candidates.unshift(newCandidate);
    return newCandidate;
  }

  public updateCandidateStatus(
    candidateId: string,
    newStatus: CandidateStatus,
    reviewerRole: string = 'SUPER_ADMIN',
    notes: string = ''
  ): { success: boolean; message: string } {
    const candidate = this.candidates.find(c => c.candidateId === candidateId);
    if (!candidate) return { success: false, message: 'Candidate tidak ditemukan.' };

    candidate.status = newStatus;
    candidate.reviewedBy = reviewerRole;
    candidate.reviewNotes = notes;
    candidate.reviewedAt = new Date().toISOString();

    return {
      success: true,
      message: `Status kandidat ${candidateId} diubah menjadi ${newStatus}. (Catatan: Tidak ada mutasi otomatis ke workflow produksi).`
    };
  }
}
