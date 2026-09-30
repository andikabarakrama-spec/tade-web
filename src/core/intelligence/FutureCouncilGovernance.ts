export interface CouncilProposal {
  id: string;
  title: string;
  proposedBy: 'AI_ASY_PRIME_MINISTER' | 'FOUNDER' | 'SUPER_ADMIN' | 'COMMUNITY_CONSENSUS';
  classification: 'CORE' | 'RESERVED' | 'EXPERIMENTAL' | 'REJECTED';
  aiSearchEvidence: string;
  aiAnalysis: string;
  aiRecommendation: string;
  superAdminDecision: 'PENDING_DECISION' | 'APPROVED_FOR_CORE' | 'PLACED_IN_RESERVED' | 'ALLOWED_EXPERIMENTAL' | 'REJECTED';
  decisionDate?: string;
  decisionNotes?: string;
}

export class FutureCouncilGovernance {
  private static instance: FutureCouncilGovernance;
  private proposals: CouncilProposal[] = [
    {
      id: 'CNCL-2026-001',
      title: 'Adopsi Standar Ijazah Digital Verifiable Credentials (W3C DID)',
      proposedBy: 'AI_ASY_PRIME_MINISTER',
      classification: 'RESERVED',
      aiSearchEvidence: 'Standar W3C DID telah difinalisasi dan didukung oleh konsorsium pendidikan global.',
      aiAnalysis: 'Memungkinkan santri membuktikan keaslian ijazah secara kriptografis offline tanpa server verifikasi.',
      aiRecommendation: 'Rekomendasi AI Asy: Simpan sebagai RESERVED hingga ada instruksi resmi Kemendikbudristek.',
      superAdminDecision: 'PLACED_IN_RESERVED',
      decisionDate: '2026-08-16',
      decisionNotes: 'Disetujui untuk dicadangkan dalam roadmap masa depan tanpa mengubah skema basis data saat ini.'
    },
    {
      id: 'CNCL-2026-002',
      title: 'Transkripsi Suara Rapat Notulensi On-Device Offline (Whisper Web)',
      proposedBy: 'AI_ASY_PRIME_MINISTER',
      classification: 'EXPERIMENTAL',
      aiSearchEvidence: 'Model transkripsi suara lokal terkuantisasi 38MB berjalan di peramban tanpa koneksi internet.',
      aiAnalysis: 'Menjamin 100% kerahasiaan rapat internal madrasah dan kepatuhan UU PDP 2022.',
      aiRecommendation: 'Rekomendasi AI Asy: Uji dalam sandbox eksperimental di War Room sebelum dimasukkan ke modul TU.',
      superAdminDecision: 'ALLOWED_EXPERIMENTAL',
      decisionDate: '2026-08-15',
      decisionNotes: 'Hanya boleh diuji di lingkungan simulasi/lab, dilarang mengakses mikrofon di produksi secara default.'
    },
    {
      id: 'CNCL-2026-003',
      title: 'Integrasi Cloud Webhook Pihak Ketiga Berbayar untuk Ekspor Raport',
      proposedBy: 'COMMUNITY_CONSENSUS',
      classification: 'REJECTED',
      aiSearchEvidence: 'Layanan SaaS eksternal menawarkan render PDF cloud dengan tarif per dokumen.',
      aiAnalysis: 'Melanggar prinsip kedaulatan data dan menimbulkan biaya operasional berulang tak terbatas.',
      aiRecommendation: 'Rekomendasi AI Asy: TOLAK MUTLAK (REJECT). Gunakan generator PDF murni TypeScript yang sudah ada di TADE (R16 & R45).',
      superAdminDecision: 'REJECTED',
      decisionDate: '2026-08-14',
      decisionNotes: 'Ditolak demi menjaga efisiensi biaya nol rupiah dan kedaulatan data santri.'
    }
  ];

  public static getInstance(): FutureCouncilGovernance {
    if (!FutureCouncilGovernance.instance) {
      FutureCouncilGovernance.instance = new FutureCouncilGovernance();
    }
    return FutureCouncilGovernance.instance;
  }

  public getProposals(): CouncilProposal[] {
    return [...this.proposals];
  }

  public submitSuperAdminDecision(
    id: string, 
    decision: CouncilProposal['superAdminDecision'], 
    notes: string
  ): void {
    const p = this.proposals.find(item => item.id === id);
    if (p) {
      p.superAdminDecision = decision;
      p.decisionNotes = notes;
      p.decisionDate = new Date().toISOString().split('T')[0];
      
      // Update classification based on Super Admin explicit decision
      if (decision === 'APPROVED_FOR_CORE') p.classification = 'CORE';
      if (decision === 'PLACED_IN_RESERVED') p.classification = 'RESERVED';
      if (decision === 'ALLOWED_EXPERIMENTAL') p.classification = 'EXPERIMENTAL';
      if (decision === 'REJECTED') p.classification = 'REJECTED';
    }
  }

  public getSummary() {
    return {
      totalProposals: this.proposals.length,
      core: this.proposals.filter(p => p.classification === 'CORE').length,
      reserved: this.proposals.filter(p => p.classification === 'RESERVED').length,
      experimental: this.proposals.filter(p => p.classification === 'EXPERIMENTAL').length,
      rejected: this.proposals.filter(p => p.classification === 'REJECTED').length,
      autoPromoteBlocked: true,
      superAdminAuthority: 'SOVEREIGN_DECIDER'
    };
  }
}
