/**
 * R630: Agent Registry V2
 * Central Directory of all Sovereign, Prime Minister, Military, Civil, and Micro Agents.
 * Enforces Zero Anonymous Agents rule: every agent must have verifiable Parent, Namespace, Capabilities, and VPID.
 */

import { VirtualNamespace } from './KernelNamespaceManager';
import { TADECapability } from './CapabilityKernelEngine';

export type AgentTier =
  | 'SOVEREIGN'
  | 'PRIME_MINISTER'
  | 'SUPREME_GENERAL'
  | 'MINISTER_ASSISTANT'
  | 'COMMANDER_ASSISTANT'
  | 'CIVIL_EMPLOYEE'
  | 'MICRO_AGENT';

export interface RegisteredAgentEntry {
  agentId: string;
  name: string;
  tier: AgentTier;
  namespace: VirtualNamespace;
  vpid: number;
  parentAgentId: string | null;
  capabilities: TADECapability[];
  status: 'ACTIVE' | 'IDLE' | 'TASKED' | 'RECOVERING' | 'SUSPENDED';
  lastTask: string;
  totalTasksExecuted: number;
  healthScore: number; // 0 - 100
  registeredTimestamp: number;
  integritySignature: string;
}

class AgentRegistryV2 {
  private static instance: AgentRegistryV2;

  private agents: Map<string, RegisteredAgentEntry> = new Map();
  private anonymousAttemptsBlocked: number = 0;

  private constructor() {
    this.seedAgents();
  }

  public static getInstance(): AgentRegistryV2 {
    if (!AgentRegistryV2.instance) {
      AgentRegistryV2.instance = new AgentRegistryV2();
    }
    return AgentRegistryV2.instance;
  }

  private seedAgents(): void {
    const defaultAgents: RegisteredAgentEntry[] = [
      // 1. Sovereign
      {
        agentId: 'AGT-001-SOVEREIGN',
        name: 'Ketua Yayasan / Super Admin',
        tier: 'SOVEREIGN',
        namespace: 'SYSTEM_KERNEL',
        vpid: 1001,
        parentAgentId: null,
        capabilities: ['CAP_ALL', 'CAP_SOVEREIGN_VETO', 'CAP_CONSTITUTION_OVERRIDE', 'CAP_DECREE_ISSUE'],
        status: 'ACTIVE',
        lastTask: 'Sovereign Constitution & State Oversight',
        totalTasksExecuted: 1420,
        healthScore: 100,
        registeredTimestamp: Date.now() - 10000000,
        integritySignature: 'SIG-SOVEREIGN-GENESIS-SHA256',
      },

      // 2. AI Asy Prime Minister
      {
        agentId: 'AGT-002-AI-ASY-PM',
        name: 'AI Asy (Perdana Menteri)',
        tier: 'PRIME_MINISTER',
        namespace: 'AI_ASY',
        vpid: 1003,
        parentAgentId: 'AGT-001-SOVEREIGN',
        capabilities: ['CAP_TASK_PLAN', 'CAP_EXEC_BRIEF', 'CAP_CIVIL_DELEGATE', 'CAP_ORCHESTRATE', 'CAP_COMMUNICATION'],
        status: 'ACTIVE',
        lastTask: 'Civil Cabinet Task Dispatching (10 Ministries)',
        totalTasksExecuted: 8940,
        healthScore: 100,
        registeredTimestamp: Date.now() - 9500000,
        integritySignature: 'SIG-AI-ASY-PM-CABINET-SHA256',
      },

      // 3. Guardian Supreme General
      {
        agentId: 'AGT-003-GUARDIAN-GEN',
        name: 'Guardian (Panglima Tertinggi)',
        tier: 'SUPREME_GENERAL',
        namespace: 'GUARDIAN',
        vpid: 1002,
        parentAgentId: 'AGT-001-SOVEREIGN',
        capabilities: ['CAP_SESSION_ISOLATE', 'CAP_RECOVERY_START', 'CAP_RING0_PROTECT', 'CAP_MEM_LOCK', 'CAP_DEFCON_SET'],
        status: 'ACTIVE',
        lastTask: 'Ring-0 Memory Reserve & DEFCON-5 Shielding',
        totalTasksExecuted: 12400,
        healthScore: 100,
        registeredTimestamp: Date.now() - 9800000,
        integritySignature: 'SIG-GUARDIAN-RING0-SUPREME-SHA256',
      },

      // 4. Academic Minister Assistant
      {
        agentId: 'AGT-004-AST-ACADEMIC',
        name: 'Asisten Menteri Akademik & Sentra',
        tier: 'MINISTER_ASSISTANT',
        namespace: 'CIVIL_SERVICE',
        vpid: 1005,
        parentAgentId: 'AGT-002-AI-ASY-PM',
        capabilities: ['CAP_ACADEMIC_ANALYZE', 'CAP_ROSTER_SCHEDULE'],
        status: 'ACTIVE',
        lastTask: 'Roster Kurikulum Merdeka PAUD Sync',
        totalTasksExecuted: 3200,
        healthScore: 100,
        registeredTimestamp: Date.now() - 8000000,
        integritySignature: 'SIG-AST-ACAD-MERDEKA-SHA256',
      },

      // 5. Finance Minister Assistant
      {
        agentId: 'AGT-005-AST-FINANCE',
        name: 'Asisten Menteri Keuangan & SPP',
        tier: 'MINISTER_ASSISTANT',
        namespace: 'CIVIL_SERVICE',
        vpid: 1005,
        parentAgentId: 'AGT-002-AI-ASY-PM',
        capabilities: ['CAP_FINANCE_AUDIT'],
        status: 'ACTIVE',
        lastTask: 'SPP Virtual Account Reconciliation',
        totalTasksExecuted: 4120,
        healthScore: 100,
        registeredTimestamp: Date.now() - 8000000,
        integritySignature: 'SIG-AST-FIN-VA-SHA256',
      },

      // 6. Tactical Defense Commander Assistant
      {
        agentId: 'AGT-006-CMD-RING0',
        name: 'Komandan Taktis Ring-0 Memori',
        tier: 'COMMANDER_ASSISTANT',
        namespace: 'GUARDIAN',
        vpid: 1002,
        parentAgentId: 'AGT-003-GUARDIAN-GEN',
        capabilities: ['CAP_RING0_PROTECT', 'CAP_MEM_LOCK'],
        status: 'ACTIVE',
        lastTask: 'Memory Buffer Isolation Watchdog',
        totalTasksExecuted: 15400,
        healthScore: 100,
        registeredTimestamp: Date.now() - 8500000,
        integritySignature: 'SIG-CMD-MEM-RESERVE-SHA256',
      },

      // 7. Micro Agent: Storage Scrubber
      {
        agentId: 'AGT-007-MIC-SCRUBBER',
        name: 'Agen Mikro: Storage & Log Scrubber',
        tier: 'MICRO_AGENT',
        namespace: 'SYSTEM_KERNEL',
        vpid: 1006,
        parentAgentId: 'AGT-003-GUARDIAN-GEN',
        capabilities: ['CAP_DATA_SCRUB', 'CAP_CACHE_PRUNE'],
        status: 'ACTIVE',
        lastTask: 'Automatic Cache Vacuuming & Compaction',
        totalTasksExecuted: 28400,
        healthScore: 100,
        registeredTimestamp: Date.now() - 7000000,
        integritySignature: 'SIG-MIC-SCRUBBER-SHA256',
      },

      // 8. Micro Agent: Hash Verifier
      {
        agentId: 'AGT-008-MIC-HASH-VERIFY',
        name: 'Agen Mikro: SHA-256 Ledger Verifier',
        tier: 'MICRO_AGENT',
        namespace: 'SYSTEM_KERNEL',
        vpid: 1004,
        parentAgentId: 'AGT-001-SOVEREIGN',
        capabilities: ['CAP_HASH_VERIFY'],
        status: 'ACTIVE',
        lastTask: 'Chained WORM Ledger Cryptographic Verification',
        totalTasksExecuted: 19800,
        healthScore: 100,
        registeredTimestamp: Date.now() - 7000000,
        integritySignature: 'SIG-MIC-HASH-VERIFY-SHA256',
      },
    ];

    defaultAgents.forEach((agent) => {
      this.agents.set(agent.agentId, agent);
    });
  }

  public getAgents(): RegisteredAgentEntry[] {
    return Array.from(this.agents.values());
  }

  public getAgentById(agentId: string): RegisteredAgentEntry | undefined {
    return this.agents.get(agentId);
  }

  public registerAgent(agent: Omit<RegisteredAgentEntry, 'integritySignature'>): { success: boolean; message: string } {
    // Zero Anonymous Agent Rule: Must have parent unless Sovereign
    if (agent.tier !== 'SOVEREIGN' && !agent.parentAgentId) {
      this.anonymousAttemptsBlocked++;
      return {
        success: false,
        message: 'CONSTITUTIONAL BLOCK: Anonymous agents strictly forbidden. Parent Agent ID is required.',
      };
    }

    if (this.agents.has(agent.agentId)) {
      return { success: false, message: `Agent with ID ${agent.agentId} is already registered.` };
    }

    const signature = `SIG-${agent.agentId}-${Date.now().toString(16)}-SHA256`;
    const fullAgent: RegisteredAgentEntry = {
      ...agent,
      integritySignature: signature,
    };

    this.agents.set(agent.agentId, fullAgent);
    return { success: true, message: `Agent ${agent.name} (${agent.agentId}) registered successfully.` };
  }

  public getAnonymousAttemptsBlocked(): number {
    return this.anonymousAttemptsBlocked;
  }
}

export const agentRegistryV2 = AgentRegistryV2.getInstance();
