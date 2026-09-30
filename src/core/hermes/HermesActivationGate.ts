export type HermesState = 
  | 'DORMANT' 
  | 'READY' 
  | 'ARMED' 
  | 'ACTIVE' 
  | 'PAUSED' 
  | 'MANUAL_ADMIN' 
  | 'SUSPENDED' 
  | 'RECOVERY';

export interface HermesGateChecklist {
  superAdminAuthorization: boolean;
  productionStabilityVerified: boolean;
  guardianRing0HealthScore: number; // 0-100
  constitutionHealthScore: number;  // 0-100
  recoveryHealthScore: number;      // 0-100
  environmentReadiness: boolean;
  zeroExternalDependencyEnforced: boolean;
  dormantSafetyLockEngaged: boolean;
}

export class HermesActivationGate {
  private static instance: HermesActivationGate;
  private currentState: HermesState = 'DORMANT';
  private checklist: HermesGateChecklist = {
    superAdminAuthorization: false, // Default: Unauthorized
    productionStabilityVerified: true,
    guardianRing0HealthScore: 100,
    constitutionHealthScore: 100,
    recoveryHealthScore: 100,
    environmentReadiness: false,
    zeroExternalDependencyEnforced: true,
    dormantSafetyLockEngaged: true
  };

  public static getInstance(): HermesActivationGate {
    if (!HermesActivationGate.instance) {
      HermesActivationGate.instance = new HermesActivationGate();
    }
    return HermesActivationGate.instance;
  }

  public getState(): HermesState {
    return this.currentState;
  }

  public getChecklist(): HermesGateChecklist {
    return { ...this.checklist };
  }

  public evaluateGateReadiness(): { canActivate: boolean; blockers: string[] } {
    const blockers: string[] = [];

    if (!this.checklist.superAdminAuthorization) {
      blockers.push('Otorisasi Super Admin eksplisit belum diberikan.');
    }
    if (this.checklist.guardianRing0HealthScore < 95) {
      blockers.push('Kesehatan Guardian Ring-0 di bawah ambang batas minimum (95%).');
    }
    if (this.checklist.constitutionHealthScore < 100) {
      blockers.push('Pelanggaran Invarian Konstitusi terdeteksi.');
    }
    if (this.checklist.dormantSafetyLockEngaged) {
      blockers.push('Dormant Safety Lock aktif untuk menjaga kestabilan Enterprise LTS.');
    }
    if (!this.checklist.zeroExternalDependencyEnforced) {
      blockers.push('Dependensi eksternal dilarang keras.');
    }

    return {
      canActivate: blockers.length === 0,
      blockers
    };
  }

  public setState(newState: HermesState): { success: boolean; message: string } {
    if (newState === 'ACTIVE' || newState === 'ARMED') {
      const evaluation = this.evaluateGateReadiness();
      if (!evaluation.canActivate) {
        return {
          success: false,
          message: `Aktivasi DITOLAK (BLOCKED): ${evaluation.blockers.join(', ')}`
        };
      }
    }

    this.currentState = newState;
    return {
      success: true,
      message: `Status Hermes berhasil diubah menjadi: ${newState}`
    };
  }
}
