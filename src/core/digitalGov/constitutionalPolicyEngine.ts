import { UserRole } from '../../types';

export type PolicyCategory = 
  | 'SECURITY' 
  | 'RBAC' 
  | 'ACADEMIC' 
  | 'FINANCIAL' 
  | 'GOVERNANCE' 
  | 'RECOVERY';

export type PolicyVerdict = 'PASS' | 'WARNING' | 'BLOCK';

export interface InstitutionalPolicy {
  policyId: string;
  code: string;
  title: string;
  category: PolicyCategory;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  targetRoles: UserRole[];
  enforceRule: (context: Record<string, any>) => { verdict: PolicyVerdict; reason: string };
  invariantReference: string;
  isActive: boolean;
}

export interface PolicyEvaluationResult {
  evaluationId: string;
  policyId: string;
  policyCode: string;
  category: PolicyCategory;
  verdict: PolicyVerdict;
  reason: string;
  evaluatedAt: string;
  contextSnapshot: Record<string, any>;
}

export class ConstitutionalPolicyEngine {
  private static instance: ConstitutionalPolicyEngine;
  private policies: InstitutionalPolicy[] = [];
  private evaluationHistory: PolicyEvaluationResult[] = [];

  private constructor() {
    this.seedDefaultPolicies();
  }

  public static getInstance(): ConstitutionalPolicyEngine {
    if (!ConstitutionalPolicyEngine.instance) {
      ConstitutionalPolicyEngine.instance = new ConstitutionalPolicyEngine();
    }
    return ConstitutionalPolicyEngine.instance;
  }

  private seedDefaultPolicies() {
    this.policies = [
      {
        policyId: 'POL-SEC-01',
        code: 'R771-SEC-01',
        title: 'Zero Autonomous Mutation Invariant',
        category: 'SECURITY',
        description: 'Melarang modifikasi state atau database SSoT secara otonom tanpa otorisasi manual manusia / Super Admin.',
        severity: 'CRITICAL',
        targetRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        invariantReference: 'CONSTITUTION_ART_1_ZERO_MUTATION',
        isActive: true,
        enforceRule: (ctx) => {
          if (ctx.isAutomatedScript && ctx.hasStateMutation && !ctx.humanApproved) {
            return { verdict: 'BLOCK', reason: 'Pelanggaran Invarian: Eksekusi script otomatis mencoba mutasi SSoT tanpa persetujuan manusia.' };
          }
          return { verdict: 'PASS', reason: 'Mutasi diverifikasi memiliki pengesahan manusia atau bersifat read-only.' };
        }
      },
      {
        policyId: 'POL-RBAC-01',
        code: 'R771-RBAC-01',
        title: 'One Sovereign Principle Authority Guard',
        category: 'RBAC',
        description: 'Memastikan hak veto dan wewenang keputusan puncak institusi dipegang oleh Super Admin & Pimpinan Yayasan.',
        severity: 'CRITICAL',
        targetRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN'],
        invariantReference: 'CONSTITUTION_ART_2_SOVEREIGNTY',
        isActive: true,
        enforceRule: (ctx) => {
          if (ctx.actionType === 'GOVERNANCE_OVERRIDE' && ctx.role !== 'SUPER_ADMIN' && ctx.role !== 'KETUA_YAYASAN') {
            return { verdict: 'BLOCK', reason: 'Hanya SUPER_ADMIN atau KETUA_YAYASAN yang berhak melakukan Override Tata Kelola.' };
          }
          return { verdict: 'PASS', reason: 'Kewenangan peran sesuai dengan batas matriks RBAC.' };
        }
      },
      {
        policyId: 'POL-ACAD-01',
        code: 'R771-ACAD-01',
        title: 'Islamic PAUD Holistic Growth Integrity',
        category: 'ACADEMIC',
        description: 'Memastikan seluruh penilaian tahfidz, adab, dan kurikulum merdeka tidak mengalami duplikasi atau diskontinuitas.',
        severity: 'HIGH',
        targetRoles: ['GURU', 'KEPALA_SEKOLAH'],
        invariantReference: 'ACADEMIC_INTEGRITY_PAUD_8_STANDAR',
        isActive: true,
        enforceRule: (ctx) => {
          if (ctx.tahfidzSurahEmpty && ctx.isFinalReport) {
            return { verdict: 'WARNING', reason: 'Catatan hafalan tahfidz belum terisi lengkap pada draf rapor santri.' };
          }
          return { verdict: 'PASS', reason: 'Parameter akademik dan adab santri valid.' };
        }
      },
      {
        policyId: 'POL-FIN-01',
        code: 'R771-FIN-01',
        title: 'Financial Dual-Authorization Integrity',
        category: 'FINANCIAL',
        description: 'Pengeluaran kas di atas ambang batas wewenang wajib mendapatkan persetujuan Ketua Yayasan atau Kepala Sekolah.',
        severity: 'HIGH',
        targetRoles: ['KEUANGAN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'],
        invariantReference: 'FINANCIAL_COMPLIANCE_DUAL_AUTH',
        isActive: true,
        enforceRule: (ctx) => {
          if (ctx.amount && ctx.amount > 5000000 && !ctx.foundationSigned) {
            return { verdict: 'BLOCK', reason: 'Transaksi melebihi Rp 5.000.000,- wajib ditandatangani Ketua Yayasan.' };
          }
          if (ctx.amount && ctx.amount > 1000000 && !ctx.principalSigned) {
            return { verdict: 'WARNING', reason: 'Transaksi di atas Rp 1.000.000,- memerlukan verifikasi Kepala Sekolah.' };
          }
          return { verdict: 'PASS', reason: 'Otorisasi keuangan valid dan sesuai limit.' };
        }
      },
      {
        policyId: 'POL-GOV-01',
        code: 'R771-GOV-01',
        title: 'Append-Only Governance Journal Enforcement',
        category: 'GOVERNANCE',
        description: 'Seluruh riwayat persetujuan dan keputusan tata kelola wajib bersifat append-first dan dilarang di-overwrite.',
        severity: 'CRITICAL',
        targetRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        invariantReference: 'GOVERNANCE_IMMUTABLE_AUDIT_TRAIL',
        isActive: true,
        enforceRule: (ctx) => {
          if (ctx.isOverwriteAttempt) {
            return { verdict: 'BLOCK', reason: 'Penolakan Ring-0: Operasi overwrite pada entri jurnal tata kelola dilarang keras.' };
          }
          return { verdict: 'PASS', reason: 'Integritas append-only jurnal terpenuhi.' };
        }
      },
      {
        policyId: 'POL-REC-01',
        code: 'R771-REC-01',
        title: 'Zero Production Mutation Disaster Drill',
        category: 'RECOVERY',
        description: 'Simulasi dan pemulihan bencana wajib berjalan di sandbox terisolasi dan tidak boleh mengubah database produksi.',
        severity: 'CRITICAL',
        targetRoles: ['SUPER_ADMIN', 'ADMIN'],
        invariantReference: 'RECOVERY_ISOLATION_INVARIANT',
        isActive: true,
        enforceRule: (ctx) => {
          if (ctx.isDrillMode && ctx.targetsProductionDB) {
            return { verdict: 'BLOCK', reason: 'Latihan pemulihan bencana dilarang terhubung langsung ke database produksi.' };
          }
          return { verdict: 'PASS', reason: 'Isolasi sandbox pemulihan bencana diverifikasi 100% aman.' };
        }
      }
    ];
  }

  public getAllPolicies(): InstitutionalPolicy[] {
    return [...this.policies];
  }

  public getPoliciesByCategory(category: PolicyCategory): InstitutionalPolicy[] {
    return this.policies.filter(p => p.category === category);
  }

  public evaluateContext(context: Record<string, any>, category?: PolicyCategory): PolicyEvaluationResult[] {
    const targets = category 
      ? this.policies.filter(p => p.category === category && p.isActive)
      : this.policies.filter(p => p.isActive);

    const results: PolicyEvaluationResult[] = targets.map(pol => {
      const { verdict, reason } = pol.enforceRule(context);
      const res: PolicyEvaluationResult = {
        evaluationId: `EVAL-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        policyId: pol.policyId,
        policyCode: pol.code,
        category: pol.category,
        verdict,
        reason,
        evaluatedAt: new Date().toISOString(),
        contextSnapshot: { ...context }
      };
      return res;
    });

    // Save evaluation history
    this.evaluationHistory.push(...results);
    return results;
  }

  public getEvaluationHistory(): PolicyEvaluationResult[] {
    return [...this.evaluationHistory];
  }
}
