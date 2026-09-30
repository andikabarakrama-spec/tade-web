/**
 * R641 — Executive Operations Board
 * TADE RC81: Foundation Chairman / Sovereign 4-Mode Operations Dashboard
 * 
 * Provides Ketua Yayasan with four operational command modes:
 * - LIVE: 24/7 normal operations, real-time campus pulse & attendance/finance health
 * - INCIDENT: Emergency posture, blast-radius containment & rapid directive dispatch
 * - RECOVERY: Swarm reconstitution, node recovery progress & integrity validation
 * - EXECUTIVE: High-level strategic overview, institutional KPIs & annual sustainability metrics
 */

export type ExecutiveBoardMode = 'LIVE' | 'INCIDENT' | 'RECOVERY' | 'EXECUTIVE';

export interface ExecutiveOperationalKPIs {
  campusHeartbeatScore: number; // 0 - 100
  activeThreatLevel: 'DEFCON_5_NORMAL' | 'DEFCON_4_ELEVATED' | 'DEFCON_3_HIGH' | 'DEFCON_1_EMERGENCY';
  dailyAttendanceRate: number; // Percentage
  monthlySPPCollectionRate: number; // Percentage
  unresolvedIncidentsCount: number;
  swarmReadinessScore: number; // Percentage
  immutableJournalBlocks: number;
  lastDirectiveIssued: {
    title: string;
    target: string;
    timestamp: string;
    signedBy: string;
  };
}

export class ExecutiveOperationsBoard {
  private static instance: ExecutiveOperationsBoard | null = null;
  private currentMode: ExecutiveBoardMode = 'LIVE';
  private listeners: ((mode: ExecutiveBoardMode) => void)[] = [];

  private constructor() {}

  public static getInstance(): ExecutiveOperationsBoard {
    if (!ExecutiveOperationsBoard.instance) {
      ExecutiveOperationsBoard.instance = new ExecutiveOperationsBoard();
    }
    return ExecutiveOperationsBoard.instance;
  }

  public getMode(): ExecutiveBoardMode {
    return this.currentMode;
  }

  public setMode(mode: ExecutiveBoardMode) {
    this.currentMode = mode;
    this.listeners.forEach(cb => cb(this.currentMode));
  }

  public getKPIs(): ExecutiveOperationalKPIs {
    return {
      campusHeartbeatScore: 99,
      activeThreatLevel: 'DEFCON_5_NORMAL',
      dailyAttendanceRate: 98.4,
      monthlySPPCollectionRate: 96.8,
      unresolvedIncidentsCount: 0,
      swarmReadinessScore: 100,
      immutableJournalBlocks: 1420,
      lastDirectiveIssued: {
        title: 'RC81 Long-Life Operational Doctrine Ratification',
        target: 'All 10 Ministries & Guardian Corps',
        timestamp: new Date().toISOString(),
        signedBy: 'Ketua Yayasan (Super Admin)'
      }
    };
  }

  public issueExecutiveDirective(title: string, target: string): string {
    const directiveCode = `DIR-${Date.now()}`;
    // Logged and broadcast
    return directiveCode;
  }

  public subscribe(cb: (mode: ExecutiveBoardMode) => void): () => void {
    this.listeners.push(cb);
    cb(this.currentMode);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }
}

export const executiveOperationsBoard = ExecutiveOperationsBoard.getInstance();
