import { UserRole } from '../../types';

export interface SessionIntelligenceState {
  sessionId: string;
  userUid: string;
  role: UserRole;
  createdAt: string;
  lastActivityAt: string;
  idleDurationSeconds: number;
  idleStatus: 'ACTIVE' | 'IDLE_WARNING' | 'LOCK_PENDING';
  isTabFocused: boolean;
  concurrencyCount: number;
  sessionFingerprint: string;
  roleConsistencyVerified: boolean;
  securityChecksPassed: boolean;
}

export class SovereignSessionIntelligence {
  private static instance: SovereignSessionIntelligence;
  private state: SessionIntelligenceState;
  private warningThresholdSeconds = 900; // 15 minutes
  private lockThresholdSeconds = 1800; // 30 minutes

  private constructor() {
    this.state = this.initSession('USR-SUPERADMIN-01', 'SUPER_ADMIN');
  }

  public static getInstance(): SovereignSessionIntelligence {
    if (!SovereignSessionIntelligence.instance) {
      SovereignSessionIntelligence.instance = new SovereignSessionIntelligence();
    }
    return SovereignSessionIntelligence.instance;
  }

  private generatePrivacySafeFingerprint(uid: string, role: UserRole): string {
    const salt = 'TADE_SOVEREIGN_2026';
    const raw = `${uid}_${role}_${salt}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `SESS_FP_${Math.abs(hash).toString(16).toUpperCase()}`;
  }

  public initSession(uid: string, role: UserRole): SessionIntelligenceState {
    const now = new Date().toISOString();
    this.state = {
      sessionId: `SES-${Date.now().toString(16).toUpperCase()}`,
      userUid: uid,
      role,
      createdAt: now,
      lastActivityAt: now,
      idleDurationSeconds: 0,
      idleStatus: 'ACTIVE',
      isTabFocused: true,
      concurrencyCount: 1,
      sessionFingerprint: this.generatePrivacySafeFingerprint(uid, role),
      roleConsistencyVerified: true,
      securityChecksPassed: true
    };
    return this.state;
  }

  public recordActivity(): void {
    this.state.lastActivityAt = new Date().toISOString();
    this.state.idleDurationSeconds = 0;
    this.state.idleStatus = 'ACTIVE';
  }

  public updateIdleTime(secondsElapsed: number): SessionIntelligenceState {
    this.state.idleDurationSeconds += secondsElapsed;
    if (this.state.idleDurationSeconds >= this.lockThresholdSeconds) {
      this.state.idleStatus = 'LOCK_PENDING';
    } else if (this.state.idleDurationSeconds >= this.warningThresholdSeconds) {
      this.state.idleStatus = 'IDLE_WARNING';
    } else {
      this.state.idleStatus = 'ACTIVE';
    }
    return { ...this.state };
  }

  public setTabFocus(focused: boolean): void {
    this.state.isTabFocused = focused;
  }

  public getState(): SessionIntelligenceState {
    return { ...this.state };
  }

  public verifyRoleConsistency(activeRole: UserRole): boolean {
    const isConsistent = activeRole === this.state.role;
    this.state.roleConsistencyVerified = isConsistent;
    if (!isConsistent) {
      this.state.securityChecksPassed = false;
    }
    return isConsistent;
  }
}
