import { ManualTakeoverLearning, LearningCandidate } from './ManualTakeoverLearning';
import { AdministrativeWorkflowLibrary } from './AdministrativeWorkflowLibrary';

export interface WorkflowRecommendation {
  recommendationId: string;
  targetWorkflowId: string;
  targetWorkflowTitle: string;
  category: string;
  recommendedChangeTitle: string;
  changeType: 'ADD_PRE_VALIDATION' | 'OPTIMIZE_AGGREGATION' | 'SPLIT_SUB_STEPS' | 'INTEGRATE_APPROVAL_GATE';
  rationale: string;
  evidenceSource: string;
  confidenceScore: number; // 0 - 100
  estimatedLatencyImpactPct: number; // e.g. -25%
  riskLevel: 'VERY_LOW' | 'LOW' | 'MEDIUM';
  proposedStepModifications: string[];
  founderApprovalStatus: 'PENDING_FOUNDER_REVIEW' | 'ACCEPTED_FOR_LAB_TESTING' | 'REJECTED';
  generatedAt: string;
}

export class WorkflowAdaptationEngine {
  private static instance: WorkflowAdaptationEngine;
  private recommendations: WorkflowRecommendation[] = [];

  private constructor() {
    this.seedRecommendations();
  }

  public static getInstance(): WorkflowAdaptationEngine {
    if (!WorkflowAdaptationEngine.instance) {
      WorkflowAdaptationEngine.instance = new WorkflowAdaptationEngine();
    }
    return WorkflowAdaptationEngine.instance;
  }

  private seedRecommendations(): void {
    this.recommendations = [
      {
        recommendationId: 'REC-2026-01',
        targetWorkflowId: 'WF-TAB-03',
        targetWorkflowTitle: 'Rekonsiliasi Kas Tabungan Santri',
        category: 'TABUNGAN',
        recommendedChangeTitle: 'Pra-Verifikasi Multi-Signature Otomatis Sebelum Pembukuan Saldo',
        changeType: 'INTEGRATE_APPROVAL_GATE',
        rationale: 'Berdasarkan telaah kandidat CAND-2026-001: Memeriksa kebutuhan multi-signature di tahap awal mengurangi status BLOCKED tiba-tiba sebesar 100%.',
        evidenceSource: 'Manual Takeover CAND-2026-001 (Kepala Madrasah Intervention)',
        confidenceScore: 98,
        estimatedLatencyImpactPct: -15,
        riskLevel: 'VERY_LOW',
        proposedStepModifications: [
          'Sisipkan langkah pre-flight signature check di Step 1',
          'Sajikan draf tanda tangan digital sebelum memanggil mutasi SSoT db.ts'
        ],
        founderApprovalStatus: 'PENDING_FOUNDER_REVIEW',
        generatedAt: '2026-08-17T10:00:00Z'
      },
      {
        recommendationId: 'REC-2026-02',
        targetWorkflowId: 'WF-ABS-01',
        targetWorkflowTitle: 'Rekapitulasi Presensi Santri Bulanan',
        category: 'ABSENSI',
        recommendedChangeTitle: 'Batch Querying Log Presensi Kelas Paralel',
        changeType: 'OPTIMIZE_AGGREGATION',
        rationale: 'Menggabungkan pemanggilan presensi multi-kelas menjadi satu transaksi baca IndexedDB mempercepat waktu sintesis draf.',
        evidenceSource: 'Analytics Metric Batch Synthesizer (Zero Mutation)',
        confidenceScore: 94,
        estimatedLatencyImpactPct: -30,
        riskLevel: 'LOW',
        proposedStepModifications: [
          'Gunakan getBatchAttendanceStream() alih-alih per-santri loop',
          'Terapkan caching in-memory hash untuk santri dengan 100% hadir'
        ],
        founderApprovalStatus: 'ACCEPTED_FOR_LAB_TESTING',
        generatedAt: '2026-08-17T10:30:00Z'
      }
    ];
  }

  public getAllRecommendations(): WorkflowRecommendation[] {
    return [...this.recommendations];
  }

  public generateRecommendationsFromCandidates(): WorkflowRecommendation[] {
    const candidates = ManualTakeoverLearning.getInstance().getAllCandidates();
    const approvedOrReviewing = candidates.filter(c => c.status === 'CANDIDATE' || c.status === 'REVIEWING');

    approvedOrReviewing.forEach(cand => {
      if (!this.recommendations.some(r => r.evidenceSource.includes(cand.candidateId))) {
        const newRec: WorkflowRecommendation = {
          recommendationId: `REC-2026-${String(this.recommendations.length + 1).padStart(2, '0')}`,
          targetWorkflowId: cand.category === 'TABUNGAN' ? 'WF-TAB-03' : 'WF-SPP-02',
          targetWorkflowTitle: cand.suggestedWorkflowRevision.proposedTitle,
          category: cand.category,
          recommendedChangeTitle: `Adaptasi Terstruktur: ${cand.delta.observedAdvantage.slice(0, 60)}...`,
          changeType: 'ADD_PRE_VALIDATION',
          rationale: cand.delta.observedAdvantage,
          evidenceSource: `Learning Candidate ${cand.candidateId} (${cand.takeoverByRole})`,
          confidenceScore: 92,
          estimatedLatencyImpactPct: -10,
          riskLevel: cand.suggestedWorkflowRevision.riskAssessment === 'HIGH' ? 'MEDIUM' : 'LOW',
          proposedStepModifications: cand.suggestedWorkflowRevision.proposedSteps,
          founderApprovalStatus: 'PENDING_FOUNDER_REVIEW',
          generatedAt: new Date().toISOString()
        };
        this.recommendations.unshift(newRec);
      }
    });

    return [...this.recommendations];
  }
}
