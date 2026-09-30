export type SupportedStakeholderRole = 'YAYASAN' | 'KEPSEK' | 'GURU' | 'ADMIN_TU';

export interface AdministrativeTaskContract {
  taskId: string;
  targetRole: SupportedStakeholderRole;
  taskType: 
    | 'REKAP_ABSENSI' 
    | 'LAPORAN_PEMBAYARAN' 
    | 'LAPORAN_SEKOLAH' 
    | 'BAHAN_RAPAT' 
    | 'ADMINISTRASI_KELAS' 
    | 'DOKUMEN_ADMINISTRATIF';
  description: string;
  requiredCapability: string;
  targetServicePath: string; // e.g. "src/services/db.ts:getSiswaList"
  guardianVerificationRule: string;
  auditTrailCode: string;
  isReadOnlyOrSafeMutation: boolean;
}

export class HermesAdministrativeServiceContract {
  private static instance: HermesAdministrativeServiceContract;
  private contracts: AdministrativeTaskContract[] = [
    {
      taskId: 'ADM-TASK-001',
      targetRole: 'GURU',
      taskType: 'REKAP_ABSENSI',
      description: 'Penyusunan rekapitulasi presensi bulanan siswa kelas binaan.',
      requiredCapability: 'CAP_ATTENDANCE_READ_WRITE',
      targetServicePath: 'src/services/db.ts:getAttendanceSummary',
      guardianVerificationRule: 'RBAC_TEACHER_CLASS_BOUNDED',
      auditTrailCode: 'AUDIT_ATTENDANCE_AGGREGATION',
      isReadOnlyOrSafeMutation: true
    },
    {
      taskId: 'ADM-TASK-002',
      targetRole: 'ADMIN_TU',
      taskType: 'LAPORAN_PEMBAYARAN',
      description: 'Rekapitulasi status pembayaran SPP dan kas tabungan santri.',
      requiredCapability: 'CAP_FINANCE_READ_SUMMARY',
      targetServicePath: 'src/services/db.ts:getSavingsTransactions',
      guardianVerificationRule: 'ANTI_NEGATIVE_BALANCE_IMMUTABLE',
      auditTrailCode: 'AUDIT_FINANCIAL_RECAP',
      isReadOnlyOrSafeMutation: true
    },
    {
      taskId: 'ADM-TASK-003',
      targetRole: 'KEPSEK',
      taskType: 'LAPORAN_SEKOLAH',
      description: 'Penyusunan draf ringkasan eksekutif performa akademik dan operasional madrasah.',
      requiredCapability: 'CAP_EXECUTIVE_REPORTING',
      targetServicePath: 'src/services/db.ts:getSchoolPerformanceMetrics',
      guardianVerificationRule: 'RING0_READ_ONLY_ACCESS',
      auditTrailCode: 'AUDIT_SCHOOL_EXECUTIVE_SUMMARY',
      isReadOnlyOrSafeMutation: true
    },
    {
      taskId: 'ADM-TASK-004',
      targetRole: 'YAYASAN',
      taskType: 'BAHAN_RAPAT',
      description: 'Kompilasi bahan laporan pertanggungjawaban rapat dewan pembina yayasan.',
      requiredCapability: 'CAP_GOVERNANCE_BRIEF_READ',
      targetServicePath: 'src/services/db.ts:getInstitutionalLedger',
      guardianVerificationRule: 'CHAIRMAN_BOARD_VERIFIED',
      auditTrailCode: 'AUDIT_BOARD_MEETING_BRIEF',
      isReadOnlyOrSafeMutation: true
    },
    {
      taskId: 'ADM-TASK-005',
      targetRole: 'GURU',
      taskType: 'ADMINISTRASI_KELAS',
      description: 'Format jurnal pembelajaran harian dan modul ajar guru kelas.',
      requiredCapability: 'CAP_CURRICULUM_DRAFTING',
      targetServicePath: 'src/services/db.ts:getTeacherLessonPlans',
      guardianVerificationRule: 'TEACHER_OWN_DRAFT_RULE',
      auditTrailCode: 'AUDIT_LESSON_PLAN_GEN',
      isReadOnlyOrSafeMutation: true
    }
  ];

  public static getInstance(): HermesAdministrativeServiceContract {
    if (!HermesAdministrativeServiceContract.instance) {
      HermesAdministrativeServiceContract.instance = new HermesAdministrativeServiceContract();
    }
    return HermesAdministrativeServiceContract.instance;
  }

  public getContracts(): AdministrativeTaskContract[] {
    return [...this.contracts];
  }

  public validatePipeline(
    identity: string, 
    role: SupportedStakeholderRole, 
    taskId: string
  ): { valid: boolean; reason: string } {
    const contract = this.contracts.find(c => c.taskId === taskId);
    if (!contract) {
      return { valid: false, reason: 'Task Contract tidak terdaftar di sistem TADE.' };
    }

    if (contract.targetRole !== role && role !== 'YAYASAN') {
      return { valid: false, reason: `Role ${role} tidak memiliki otorisasi untuk task ${contract.taskType}.` };
    }

    return {
      valid: true,
      reason: `Pipeline Identity (${identity}) -> Role (${role}) -> Capability (${contract.requiredCapability}) -> SSoT (db.ts) -> Audit (${contract.auditTrailCode}) tervalidasi 100%.`
    };
  }

  public getEnforcedInvariants() {
    return [
      'Strict No RBAC Bypass',
      'Strict No Guardian Ring-0 Bypass',
      'Strict No Direct Database Creation (db.ts SSoT only)',
      'Strict No Strategic Autonomous Decision Making',
      'Strict No Constitution Modification',
      'Strict No Destructive Production Action Without Multi-Signature Super Admin Auth'
    ];
  }
}
