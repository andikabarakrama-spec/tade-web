export interface LearnedPatternTemplate {
  templateId: string;
  domainCategory: 'ABSENSI' | 'SPP_PEMBAYARAN' | 'YAYASAN_GOVERNANCE' | 'ADMINISTRASI_GURU' | 'ADMINISTRASI_SISWA';
  patternName: string;
  description: string;
  observedFrequency: number;
  successRate: number; // 0 - 100
  inputPattern: string[];
  executionSequencePattern: string[];
  invariantsEnforced: string[];
  securityPrivilegeCheck: 'STRICTLY_ISOLATED' | 'ESCALATION_BLOCKED';
  isSafeForGeneralization: boolean;
  learnedAt: string;
}

export class AdministrativePatternLearning {
  private static instance: AdministrativePatternLearning;
  private learnedTemplates: LearnedPatternTemplate[] = [];

  private constructor() {
    this.seedLearnedTemplates();
  }

  public static getInstance(): AdministrativePatternLearning {
    if (!AdministrativePatternLearning.instance) {
      AdministrativePatternLearning.instance = new AdministrativePatternLearning();
    }
    return AdministrativePatternLearning.instance;
  }

  private seedLearnedTemplates(): void {
    this.learnedTemplates = [
      {
        templateId: 'PTN-ABS-01',
        domainCategory: 'ABSENSI',
        patternName: 'Zero-Discrepancy Monthly Attendance Consolidation',
        description: 'Pola verifikasi presensi yang mengonsolidasikan data harian dengan kalender akademik resmi.',
        observedFrequency: 14,
        successRate: 100.0,
        inputPattern: ['ID Rombel', 'Rentang Tanggal', 'Kalender Efektif'],
        executionSequencePattern: [
          'Filter out non-effective school days',
          'Map santri presence bits',
          'Calculate aggregate percentage',
          'Cross-check total with active enrollment'
        ],
        invariantsEnforced: ['Enrollment headcount match invariant', 'Immutable attendance history'],
        securityPrivilegeCheck: 'STRICTLY_ISOLATED',
        isSafeForGeneralization: true,
        learnedAt: '2026-08-17T08:30:00Z'
      },
      {
        templateId: 'PTN-SPP-02',
        domainCategory: 'SPP_PEMBAYARAN',
        patternName: 'Dual-Voucher Fee Segregation Pattern',
        description: 'Pola pembukuan yang memisahkan transaksi kas operasional SPP dari dana sarana/tabungan.',
        observedFrequency: 22,
        successRate: 100.0,
        inputPattern: ['Student Ledger ID', 'Payment Category Enum', 'Cash Drawer Buffer'],
        executionSequencePattern: [
          'Inspect transaction category tag',
          'Allocate credit into sub-ledger branch',
          'Issue tamper-evident receipt voucher with SHA-256 hash',
          'Reconcile daily drawer balance'
        ],
        invariantsEnforced: ['Anti-Negative Balance Invariant #2', 'Single Source of Truth db.ts'],
        securityPrivilegeCheck: 'STRICTLY_ISOLATED',
        isSafeForGeneralization: true,
        learnedAt: '2026-08-17T09:00:00Z'
      },
      {
        templateId: 'PTN-GOV-03',
        domainCategory: 'YAYASAN_GOVERNANCE',
        patternName: 'Executive 5-Pillar Synthesis Pattern',
        description: 'Pola penyusunan ringkasan eksekutif bahan rapat pembina yang mengagregasikan 5 pilar kelembagaan.',
        observedFrequency: 8,
        successRate: 100.0,
        inputPattern: ['Quarterly Date Range', 'Institutional Ledger Snapshot', 'Academic Audit Trail'],
        executionSequencePattern: [
          'Aggregate Financial Cashflow Health',
          'Extract Academic Curriculum Milestone Percentage',
          'Audit Facility & Infrastructure Assets',
          'Summarize Human Resources Readiness',
          'Compile Regulatory & Legal Compliance Status'
        ],
        invariantsEnforced: ['No speculative forecasting', 'Verifiable SSoT citations'],
        securityPrivilegeCheck: 'STRICTLY_ISOLATED',
        isSafeForGeneralization: true,
        learnedAt: '2026-08-17T09:30:00Z'
      },
      {
        templateId: 'PTN-GURU-04',
        domainCategory: 'ADMINISTRASI_GURU',
        patternName: 'Standardized Lesson Plan & CP Tracking Pattern',
        description: 'Pola kompilasi modul ajar dan jurnal harian guru yang secara otomatis menghitung ketuntasan kurikulum.',
        observedFrequency: 18,
        successRate: 100.0,
        inputPattern: ['Teacher Assignment ID', 'Weekly Journal Entries', 'Target Capaian Pembelajaran'],
        executionSequencePattern: [
          'Map class sessions to curriculum syllabus',
          'Calculate completed CP percentage',
          'Format official dossier for school principal review'
        ],
        invariantsEnforced: ['Teacher subject authorization boundary'],
        securityPrivilegeCheck: 'STRICTLY_ISOLATED',
        isSafeForGeneralization: true,
        learnedAt: '2026-08-17T10:00:00Z'
      }
    ];
  }

  public getAllLearnedTemplates(): LearnedPatternTemplate[] {
    return [...this.learnedTemplates];
  }

  public learnFromSuccessfulTask(
    category: LearnedPatternTemplate['domainCategory'],
    name: string,
    description: string,
    inputs: string[],
    steps: string[],
    invariants: string[],
    isPrivilegeEscalationAttempt: boolean
  ): { success: boolean; template?: LearnedPatternTemplate; message: string } {
    // Security Invariant Check: DO NOT learn privilege escalation patterns
    if (isPrivilegeEscalationAttempt) {
      return {
        success: false,
        message: 'Ditolak oleh Guardian Ring-0: Pola yang melibatkan eskalasi wewenang atau bypass RBAC DILARANG untuk dipelajari sistem.'
      };
    }

    const newTemplate: LearnedPatternTemplate = {
      templateId: `PTN-${category.slice(0, 3)}-${String(this.learnedTemplates.length + 1).padStart(2, '0')}`,
      domainCategory: category,
      patternName: name,
      description,
      observedFrequency: 1,
      successRate: 100.0,
      inputPattern: inputs,
      executionSequencePattern: steps,
      invariantsEnforced: invariants,
      securityPrivilegeCheck: 'STRICTLY_ISOLATED',
      isSafeForGeneralization: true,
      learnedAt: new Date().toISOString()
    };

    this.learnedTemplates.unshift(newTemplate);
    return {
      success: true,
      template: newTemplate,
      message: `Pola administratif "${name}" berhasil dipelajari dan diisolasi dalam pustaka aman.`
    };
  }
}
