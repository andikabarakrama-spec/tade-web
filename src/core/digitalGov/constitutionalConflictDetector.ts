import { ConstitutionalPolicyEngine } from './constitutionalPolicyEngine';
import { DigitalSignatureReadiness } from './digitalSignatureReadiness';
import { UserRole } from '../../types';

export type ConflictSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface ConstitutionalConflictItem {
  conflictId: string;
  code: string;
  category: 'POLICY_CONTRADICTION' | 'RBAC_CLASH' | 'DUPLICATE_AUTHORITY' | 'INVALID_APPROVAL_CHAIN';
  severity: ConflictSeverity;
  affectedEntities: string[];
  description: string;
  remediationRecommendation: string;
  detectedAt: string;
  isResolved: boolean;
}

export class ConstitutionalConflictDetector {
  private static instance: ConstitutionalConflictDetector;

  private constructor() {}

  public static getInstance(): ConstitutionalConflictDetector {
    if (!ConstitutionalConflictDetector.instance) {
      ConstitutionalConflictDetector.instance = new ConstitutionalConflictDetector();
    }
    return ConstitutionalConflictDetector.instance;
  }

  public runDiagnosticScan(): {
    scanTimestamp: string;
    totalConflictsFound: number;
    conflicts: ConstitutionalConflictItem[];
    verdict: 'NO_CONFLICTS' | 'POTENTIAL_FRICTION' | 'CRITICAL_CONSTITUTIONAL_CONFLICT';
  } {
    const conflicts: ConstitutionalConflictItem[] = [];

    // Scan 1: Check approval chains for valid role hierarchy in official docs
    const docs = DigitalSignatureReadiness.getInstance().getAllDocuments();
    docs.forEach(doc => {
      const roles = doc.approvalChain.map(s => s.role);
      const uniqueRoles = new Set(roles);
      if (uniqueRoles.size !== roles.length) {
        conflicts.push({
          conflictId: `CONF-DOC-${doc.documentId}`,
          code: 'CONF-DUPLICATE-SIGNER-ROLE',
          category: 'DUPLICATE_AUTHORITY',
          severity: 'WARNING',
          affectedEntities: [doc.documentId, doc.documentNumber],
          description: `Dokumen ${doc.documentNumber} mendefinisikan peran penandatangan ganda pada rantai persetujuannya.`,
          remediationRecommendation: 'Konsolidasi tahapan penandatangan agar tiap peran hanya menandatangani 1 kali.',
          detectedAt: new Date().toISOString(),
          isResolved: false
        });
      }
    });

    // Scan 2: Check RBAC vs Financial Threshold authority
    // Ensure that only SUPER_ADMIN or KETUA_YAYASAN can sign high-tier financial items
    const policies = ConstitutionalPolicyEngine.getInstance().getAllPolicies();
    const finPolicy = policies.find(p => p.category === 'FINANCIAL');
    if (finPolicy && !finPolicy.targetRoles.includes('KETUA_YAYASAN')) {
      conflicts.push({
        conflictId: 'CONF-FIN-01',
        code: 'CONF-FINANCIAL-AUTHORITY-GAP',
        category: 'RBAC_CLASH',
        severity: 'CRITICAL',
        affectedEntities: ['POL-FIN-01', 'KETUA_YAYASAN'],
        description: 'Kebijakan keuangan tidak mencantumkan KETUA_YAYASAN sebagai target verifikator transaksi bernilai tinggi.',
        remediationRecommendation: 'Tambahkan KETUA_YAYASAN pada targetRoles kebijakan POL-FIN-01.',
        detectedAt: new Date().toISOString(),
        isResolved: false
      });
    }

    // Determine overall verdict
    let verdict: 'NO_CONFLICTS' | 'POTENTIAL_FRICTION' | 'CRITICAL_CONSTITUTIONAL_CONFLICT' = 'NO_CONFLICTS';
    if (conflicts.some(c => c.severity === 'CRITICAL')) {
      verdict = 'CRITICAL_CONSTITUTIONAL_CONFLICT';
    } else if (conflicts.length > 0) {
      verdict = 'POTENTIAL_FRICTION';
    }

    return {
      scanTimestamp: new Date().toISOString(),
      totalConflictsFound: conflicts.length,
      conflicts,
      verdict
    };
  }
}
