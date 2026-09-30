import { TaskRole, AdministrativeTask } from './AdministrativeTaskOrchestrator';

export type SensitiveCategory = 
  | 'DATA_DELETION' 
  | 'PERMISSION_MUTATION' 
  | 'TRANSACTION_MODIFICATION' 
  | 'CONFIG_CHANGE' 
  | 'CONSTITUTION_STATE' 
  | 'HIGH_RISK_PRODUCTION';

export interface SafetyCheckResult {
  isSensitive: boolean;
  requiresApproval: boolean;
  sensitiveCategory?: SensitiveCategory;
  authorizedRoles: TaskRole[];
  guardianVerdict: 'PASS' | 'HELD_FOR_APPROVAL' | 'REJECT_UNAUTHORIZED';
  rationale: string;
}

export class AdministrativeSafetyGate {
  private static instance: AdministrativeSafetyGate;

  public static getInstance(): AdministrativeSafetyGate {
    if (!AdministrativeSafetyGate.instance) {
      AdministrativeSafetyGate.instance = new AdministrativeSafetyGate();
    }
    return AdministrativeSafetyGate.instance;
  }

  public evaluateAction(
    actionName: string,
    requesterRole: TaskRole,
    payload?: Record<string, any>
  ): SafetyCheckResult {
    const act = actionName.toUpperCase();

    // 1. Data Deletion
    if (act.includes('DELETE') || act.includes('HAPUS') || act.includes('PURGE') || act.includes('TRUNCATE')) {
      return {
        isSensitive: true,
        requiresApproval: true,
        sensitiveCategory: 'DATA_DELETION',
        authorizedRoles: ['SUPER_ADMIN'],
        guardianVerdict: requesterRole === 'SUPER_ADMIN' ? 'HELD_FOR_APPROVAL' : 'REJECT_UNAUTHORIZED',
        rationale: 'Penghapusan data permanen melanggar Zero Data Overwrite Invariant #3 tanpa otorisasi langsung Super Admin.'
      };
    }

    // 2. Permission Mutation
    if (act.includes('PERMISSION') || act.includes('ROLE_CHANGE') || act.includes('HAK_AKSES')) {
      return {
        isSensitive: true,
        requiresApproval: true,
        sensitiveCategory: 'PERMISSION_MUTATION',
        authorizedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN'],
        guardianVerdict: 'HELD_FOR_APPROVAL',
        rationale: 'Eskalasi atau modifikasi hak akses wajib disetujui melalui Multi-Signature Super Admin.'
      };
    }

    // 3. Transaction Modification / Large Cash Flow
    if (act.includes('TRANSACTION') || act.includes('REFUND') || act.includes('PENCAIRAN_BESAR') || act.includes('MUTASI_KAS')) {
      return {
        isSensitive: true,
        requiresApproval: true,
        sensitiveCategory: 'TRANSACTION_MODIFICATION',
        authorizedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'],
        guardianVerdict: 'HELD_FOR_APPROVAL',
        rationale: 'Mutasi atau revisi transaksi keuangan memerlukan tanda tangan digital pimpinan sebelum pembukuan final.'
      };
    }

    // 4. Config or Constitution State Change
    if (act.includes('CONFIG') || act.includes('CONSTITUTION') || act.includes('INVARIANT')) {
      return {
        isSensitive: true,
        requiresApproval: true,
        sensitiveCategory: 'CONSTITUTION_STATE',
        authorizedRoles: ['SUPER_ADMIN'],
        guardianVerdict: requesterRole === 'SUPER_ADMIN' ? 'HELD_FOR_APPROVAL' : 'REJECT_UNAUTHORIZED',
        rationale: 'Perubahan konstitusi digital TADE dilindungi oleh 22 Immutable Invariants.'
      };
    }

    // Standard Non-sensitive Action (Read / Format / Draft)
    return {
      isSensitive: false,
      requiresApproval: false,
      authorizedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN_TU'],
      guardianVerdict: 'PASS',
      rationale: 'Operasi pembacaan/penyusunan draf aman dan berada di dalam batas capability role.'
    };
  }
}
