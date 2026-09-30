/**
 * R638 — Recovery Reinforcement Matrix
 * TADE RC81: Dynamic Post-Recovery Force Redeployment & Frontline Defense Grid
 * 
 * Enforces the doctrine:
 * "Pasukan yang selesai recovery harus kembali memperkuat garis depan."
 * - When recovery daemons/troops finish emergency tasks, they automatically redeploy
 *   to reinforce frontline garrisons, restore defense buffers, and rebalance node security.
 */

export interface FrontlineGarrison {
  sectorId: string;
  sectorName: string;
  threatLevel: 'MINIMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  assignedTroops: number; // e.g. 120 daemons
  defenseCapacity: number; // Max capacity e.g. 150
  readinessPercentage: number; // 0 - 100%
  status: 'OPTIMAL' | 'REINFORCED' | 'UNDERMANNED';
  lastReinforcedAt: string;
}

export interface RecoveryDaemonUnit {
  id: string;
  unitCode: string;
  specialty: 'STORAGE_SCRUBBER' | 'WAL_REPLAY_ENGINEER' | 'NETWORK_ISOLATOR' | 'RBAC_SENTINEL' | 'CFS_LOAD_BALANCER';
  state: 'ON_MISSION' | 'POST_MISSION_COOLDOWN' | 'FRONT_REDEPLOYED';
  completedMissionsCount: number;
  assignedGarrisonSector: string;
  redeploymentTimestamp: string;
}

export class RecoveryReinforcementMatrix {
  private static instance: RecoveryReinforcementMatrix | null = null;
  private garrisons: FrontlineGarrison[] = [];
  private units: RecoveryDaemonUnit[] = [];
  private listeners: (() => void)[] = [];

  private constructor() {
    this.seedMatrix();
  }

  public static getInstance(): RecoveryReinforcementMatrix {
    if (!RecoveryReinforcementMatrix.instance) {
      RecoveryReinforcementMatrix.instance = new RecoveryReinforcementMatrix();
    }
    return RecoveryReinforcementMatrix.instance;
  }

  private seedMatrix() {
    this.garrisons = [
      {
        sectorId: 'SEC-RING0-KERNEL',
        sectorName: 'Ring-0 Kernel Core & Process Table',
        threatLevel: 'MINIMAL',
        assignedTroops: 64,
        defenseCapacity: 80,
        readinessPercentage: 98,
        status: 'REINFORCED',
        lastReinforcedAt: '2026-08-18T10:00:00Z'
      },
      {
        sectorId: 'SEC-RBAC-FORTRESS',
        sectorName: 'RBAC Boundary & Session Fortress',
        threatLevel: 'ELEVATED',
        assignedTroops: 52,
        defenseCapacity: 60,
        readinessPercentage: 95,
        status: 'REINFORCED',
        lastReinforcedAt: '2026-08-18T10:00:00Z'
      },
      {
        sectorId: 'SEC-VFS-WAL',
        sectorName: 'VFS Storage & Immutable WAL Stream',
        threatLevel: 'MINIMAL',
        assignedTroops: 48,
        defenseCapacity: 50,
        readinessPercentage: 100,
        status: 'OPTIMAL',
        lastReinforcedAt: '2026-08-18T10:00:00Z'
      },
      {
        sectorId: 'SEC-CIVIL-HIGHWAY',
        sectorName: 'Civil Service 10-Ministries Highway',
        threatLevel: 'MINIMAL',
        assignedTroops: 36,
        defenseCapacity: 40,
        readinessPercentage: 96,
        status: 'OPTIMAL',
        lastReinforcedAt: '2026-08-18T10:00:00Z'
      }
    ];

    this.units = [
      { id: 'DAEMON-01', unitCode: 'SWARM-ALPHA-1', specialty: 'STORAGE_SCRUBBER', state: 'FRONT_REDEPLOYED', completedMissionsCount: 14, assignedGarrisonSector: 'SEC-VFS-WAL', redeploymentTimestamp: '2026-08-18T09:45:00Z' },
      { id: 'DAEMON-02', unitCode: 'SWARM-ALPHA-2', specialty: 'WAL_REPLAY_ENGINEER', state: 'FRONT_REDEPLOYED', completedMissionsCount: 19, assignedGarrisonSector: 'SEC-VFS-WAL', redeploymentTimestamp: '2026-08-18T09:48:00Z' },
      { id: 'DAEMON-03', unitCode: 'SWARM-BETA-1', specialty: 'NETWORK_ISOLATOR', state: 'FRONT_REDEPLOYED', completedMissionsCount: 8, assignedGarrisonSector: 'SEC-RBAC-FORTRESS', redeploymentTimestamp: '2026-08-18T09:50:00Z' },
      { id: 'DAEMON-04', unitCode: 'SWARM-BETA-2', specialty: 'RBAC_SENTINEL', state: 'FRONT_REDEPLOYED', completedMissionsCount: 22, assignedGarrisonSector: 'SEC-RBAC-FORTRESS', redeploymentTimestamp: '2026-08-18T09:52:00Z' },
      { id: 'DAEMON-05', unitCode: 'SWARM-GAMMA-1', specialty: 'CFS_LOAD_BALANCER', state: 'FRONT_REDEPLOYED', completedMissionsCount: 31, assignedGarrisonSector: 'SEC-RING0-KERNEL', redeploymentTimestamp: '2026-08-18T09:55:00Z' }
    ];
  }

  public completeRecoveryAndRedeploy(unitId: string, targetSectorId: string) {
    const unit = this.units.find(u => u.id === unitId);
    if (!unit) return;

    unit.state = 'FRONT_REDEPLOYED';
    unit.completedMissionsCount += 1;
    unit.assignedGarrisonSector = targetSectorId;
    unit.redeploymentTimestamp = new Date().toISOString();

    const garrison = this.garrisons.find(g => g.sectorId === targetSectorId);
    if (garrison) {
      garrison.assignedTroops = Math.min(garrison.defenseCapacity, garrison.assignedTroops + 2);
      garrison.readinessPercentage = Math.min(100, garrison.readinessPercentage + 1);
      garrison.lastReinforcedAt = new Date().toISOString();
      garrison.status = 'REINFORCED';
    }

    this.notifyListeners();
  }

  public getGarrisons(): FrontlineGarrison[] {
    return [...this.garrisons];
  }

  public getUnits(): RecoveryDaemonUnit[] {
    return [...this.units];
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }
}

export const recoveryReinforcementMatrix = RecoveryReinforcementMatrix.getInstance();
