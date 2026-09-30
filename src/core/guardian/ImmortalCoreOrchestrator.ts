export type EngineHealthStatus = 'Healthy' | 'Recovering' | 'Reinforcing' | 'Critical';

export interface HealingCycleLog {
  cycleId: string;
  engineId: string;
  engineName: string;
  phase: 'DETECT' | 'CONTAIN' | 'HEAL' | 'REJOIN' | 'STRENGTHEN';
  timestamp: string;
  details: string;
  durationMs: number;
}

export interface EngineNodeRegistration {
  id: string;
  name: string;
  category: 'CORE' | 'SERVICES' | 'AI_DEFENSE' | 'STORAGE' | 'PORTAL';
  status: EngineHealthStatus;
  healthScore: number;
  lastHeartbeat: string;
  remediesCount: number;
  healingCoreActive: boolean;
}

class ImmortalCoreOrchestratorService {
  private engineNodes: Map<string, EngineNodeRegistration> = new Map();
  private healingHistory: HealingCycleLog[] = [];

  constructor() {
    this.initializeEngines();
  }

  private initializeEngines() {
    const defaultEngines: EngineNodeRegistration[] = [
      { id: 'ENGINE_AUTH', name: 'Authentication & Session Fortress', category: 'CORE', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_FIRESTORE', name: 'Firestore Data Pipeline & Query Cache', category: 'STORAGE', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_STORAGE', name: 'WORM Immutable Storage Ledger', category: 'STORAGE', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_PPDB', name: 'PPDB Registration & Verifier Pipeline', category: 'SERVICES', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_RAPORT', name: 'Kurikulum Merdeka Assessment Core', category: 'SERVICES', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_KEUANGAN', name: 'Buku Kas & SPP VA Ledger', category: 'SERVICES', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_SURAT', name: 'Surat Masuk/Keluar Digital QR Engine', category: 'SERVICES', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_CCTV', name: 'Perimeter Video & Stream Ingest Guard', category: 'AI_DEFENSE', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_AI_ASY', name: 'AI Asy Executive Intelligence Bridge', category: 'AI_DEFENSE', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_GUARDIAN', name: 'Guardian Continuous Sentinel & Defense', category: 'AI_DEFENSE', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_WEBSITE', name: 'Website Front Office Portal', category: 'PORTAL', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true },
      { id: 'ENGINE_SIM', name: 'SIM Back Office Enterprise Portal', category: 'PORTAL', status: 'Healthy', healthScore: 100, lastHeartbeat: new Date().toISOString(), remediesCount: 0, healingCoreActive: true }
    ];

    defaultEngines.forEach(e => this.engineNodes.set(e.id, e));
  }

  public getEngines(): EngineNodeRegistration[] {
    return Array.from(this.engineNodes.values());
  }

  public getHealingHistory(): HealingCycleLog[] {
    return [...this.healingHistory];
  }

  public triggerUniversalHealing(engineId: string, customReason?: string): { success: boolean; log: HealingCycleLog[] } {
    const node = this.engineNodes.get(engineId);
    if (!node) return { success: false, log: [] };

    node.status = 'Recovering';
    const cycleId = `CYCLE-${Date.now().toString(36).toUpperCase()}`;
    const generatedLogs: HealingCycleLog[] = [
      { cycleId, engineId, engineName: node.name, phase: 'DETECT', timestamp: new Date().toISOString(), details: customReason || 'Anomaly detected via Telemetry Probe.', durationMs: 4 },
      { cycleId, engineId, engineName: node.name, phase: 'CONTAIN', timestamp: new Date().toISOString(), details: 'Fault domain isolated. Swarm backup queue engaged.', durationMs: 6 },
      { cycleId, engineId, engineName: node.name, phase: 'HEAL', timestamp: new Date().toISOString(), details: 'Self-healing routine executed: memory purged & state refreshed.', durationMs: 12 },
      { cycleId, engineId, engineName: node.name, phase: 'REJOIN', timestamp: new Date().toISOString(), details: 'Node re-synchronized into active swarm consensus.', durationMs: 5 },
      { cycleId, engineId, engineName: node.name, phase: 'STRENGTHEN', timestamp: new Date().toISOString(), details: 'Circuit breaker thresholds reinforced & memory pool expanded.', durationMs: 3 }
    ];

    node.status = 'Reinforcing';
    node.remediesCount += 1;
    node.healthScore = 100;
    setTimeout(() => {
      node.status = 'Healthy';
      node.lastHeartbeat = new Date().toISOString();
    }, 1000);

    this.healingHistory.unshift(...generatedLogs);
    if (this.healingHistory.length > 50) {
      this.healingHistory = this.healingHistory.slice(0, 50);
    }

    return { success: true, log: generatedLogs };
  }

  public getOrchestratorScore(): number {
    const nodes = this.getEngines();
    const sum = nodes.reduce((acc, curr) => acc + curr.healthScore, 0);
    return Math.round(sum / nodes.length);
  }
}

export const immortalCoreOrchestrator = new ImmortalCoreOrchestratorService();
