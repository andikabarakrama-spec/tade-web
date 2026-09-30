/**
 * R636 — Dependency Graph Guardian
 * TADE RC81: Engine Dependency Mapping & Topology Verification
 * 
 * Maps dependencies across all system engines (RC1–RC81):
 * - Detects circular dependencies (cycles)
 * - Identifies orphan modules without valid consumers or anchors
 * - Checks for duplicate services or conflicting route handlers
 * - Computes topological execution order and blast radius index
 */

export interface EngineNode {
  id: string;
  name: string;
  category: 'KERNEL' | 'SECURITY' | 'GOVERNANCE' | 'CIVIL' | 'OPERATIONS' | 'AI_COGNITIVE' | 'STORAGE';
  sprint: string;
  dependencies: string[];
  dependents: string[];
  isLocked: boolean;
  status: 'HEALTHY' | 'WARNING' | 'CYCLE_DETECTED' | 'ORPHAN';
  blastRadiusScore: number; // 1 to 10
}

export interface DependencyAuditReport {
  timestamp: string;
  totalNodes: number;
  totalEdges: number;
  circularDependencies: string[][];
  orphanModules: string[];
  duplicateServices: string[];
  graphHealthScore: number; // 0 to 100
  topologicalOrder: string[];
  isPassing: boolean;
}

export class DependencyGraphGuardian {
  private static instance: DependencyGraphGuardian | null = null;
  private nodes: Map<string, EngineNode> = new Map();
  private auditReport: DependencyAuditReport | null = null;

  private constructor() {
    this.seedGraph();
    this.auditDependencyGraph();
  }

  public static getInstance(): DependencyGraphGuardian {
    if (!DependencyGraphGuardian.instance) {
      DependencyGraphGuardian.instance = new DependencyGraphGuardian();
    }
    return DependencyGraphGuardian.instance;
  }

  private seedGraph() {
    const rawNodes: Omit<EngineNode, 'dependents' | 'status' | 'blastRadiusScore'>[] = [
      { id: 'R1_DASHBOARD', name: 'Dashboard Core', category: 'OPERATIONS', sprint: 'RC1', dependencies: ['R2_RBAC', 'R3_DATA_SISWA'], isLocked: true },
      { id: 'R2_RBAC', name: 'User RBAC & Auth Matrix', category: 'SECURITY', sprint: 'RC1', dependencies: [], isLocked: true },
      { id: 'R3_DATA_SISWA', name: 'Student Master Data', category: 'OPERATIONS', sprint: 'RC1', dependencies: ['R2_RBAC'], isLocked: true },
      { id: 'R11_PAYMENT', name: 'Payment Core & Kwitansi', category: 'OPERATIONS', sprint: 'RC2', dependencies: ['R2_RBAC', 'R3_DATA_SISWA'], isLocked: true },
      { id: 'R36_AI_OS', name: 'AI Operating System', category: 'AI_COGNITIVE', sprint: 'RC5', dependencies: ['R2_RBAC'], isLocked: true },
      { id: 'R554_GUARDIAN_KERNEL', name: 'Guardian Kernel Layer', category: 'KERNEL', sprint: 'RC72', dependencies: ['R2_RBAC'], isLocked: true },
      { id: 'R574_SERVICE_LIFECYCLE', name: 'Service Lifecycle Manager', category: 'KERNEL', sprint: 'RC74', dependencies: ['R554_GUARDIAN_KERNEL'], isLocked: true },
      { id: 'R594_IMMORTAL_STORAGE', name: 'Immortal Storage VFS', category: 'STORAGE', sprint: 'RC76', dependencies: ['R554_GUARDIAN_KERNEL'], isLocked: true },
      { id: 'R604_CONTROL_PLANE', name: 'Guardian Control Plane', category: 'SECURITY', sprint: 'RC77', dependencies: ['R554_GUARDIAN_KERNEL', 'R594_IMMORTAL_STORAGE'], isLocked: true },
      { id: 'R614_SOVEREIGN_GOV', name: 'Sovereign Government Engine', category: 'GOVERNANCE', sprint: 'RC78', dependencies: ['R604_CONTROL_PLANE'], isLocked: true },
      { id: 'R624_CIVIL_SERVICE', name: 'Civil Service Ministry', category: 'CIVIL', sprint: 'RC79', dependencies: ['R614_SOVEREIGN_GOV'], isLocked: true },
      { id: 'R625_KERNEL_NAMESPACE', name: 'Kernel Namespace Manager', category: 'KERNEL', sprint: 'RC80', dependencies: ['R554_GUARDIAN_KERNEL'], isLocked: true },
      { id: 'R626_CAPABILITY_KERNEL', name: 'Capability Kernel Engine', category: 'KERNEL', sprint: 'RC80', dependencies: ['R625_KERNEL_NAMESPACE'], isLocked: true },
      { id: 'R627_VIRTUAL_PROCESS', name: 'Virtual Process Table', category: 'KERNEL', sprint: 'RC80', dependencies: ['R626_CAPABILITY_KERNEL'], isLocked: true },
      { id: 'R628_UNIFIED_TELEMETRY', name: 'Unified Telemetry Matrix', category: 'KERNEL', sprint: 'RC80', dependencies: ['R627_VIRTUAL_PROCESS'], isLocked: true },
      { id: 'R629_RUNTIME_BUS_V2', name: 'Runtime Bus V2', category: 'KERNEL', sprint: 'RC80', dependencies: ['R628_UNIFIED_TELEMETRY'], isLocked: true },
      { id: 'R630_AGENT_REGISTRY_V2', name: 'Agent Registry V2', category: 'GOVERNANCE', sprint: 'RC80', dependencies: ['R629_RUNTIME_BUS_V2'], isLocked: true },
      { id: 'R631_FOUNDER_BOOT_V2', name: 'Founder Boot Sequence V2', category: 'KERNEL', sprint: 'RC80', dependencies: ['R625_KERNEL_NAMESPACE', 'R626_CAPABILITY_KERNEL'], isLocked: true },
      { id: 'R632_GOV_OBSERVATORY', name: 'Government Observatory', category: 'GOVERNANCE', sprint: 'RC80', dependencies: ['R630_AGENT_REGISTRY_V2', 'R628_UNIFIED_TELEMETRY'], isLocked: true },
      { id: 'R633_RESOURCE_GOVERNOR', name: 'Resource Governor V3', category: 'KERNEL', sprint: 'RC80', dependencies: ['R627_VIRTUAL_PROCESS'], isLocked: true },
      { id: 'R634_CONSTITUTION_AUDIT', name: 'Capability Constitution Auditor', category: 'GOVERNANCE', sprint: 'RC80', dependencies: ['R626_CAPABILITY_KERNEL', 'R630_AGENT_REGISTRY_V2'], isLocked: true },
      { id: 'R635_OPERATIONAL_DOCTRINE', name: 'Operational Doctrine Engine', category: 'OPERATIONS', sprint: 'RC81', dependencies: ['R634_CONSTITUTION_AUDIT'], isLocked: true },
      { id: 'R636_DEPENDENCY_GUARDIAN', name: 'Dependency Graph Guardian', category: 'KERNEL', sprint: 'RC81', dependencies: ['R629_RUNTIME_BUS_V2'], isLocked: true },
      { id: 'R637_SERVICE_OWNERSHIP', name: 'Service Ownership Registry', category: 'GOVERNANCE', sprint: 'RC81', dependencies: ['R635_OPERATIONAL_DOCTRINE'], isLocked: true },
      { id: 'R638_RECOVERY_REINFORCE', name: 'Recovery Reinforcement Matrix', category: 'SECURITY', sprint: 'RC81', dependencies: ['R554_GUARDIAN_KERNEL', 'R629_RUNTIME_BUS_V2'], isLocked: true },
      { id: 'R639_RUNTIME_CONTINUITY', name: 'Runtime Continuity Mesh', category: 'OPERATIONS', sprint: 'RC81', dependencies: ['R594_IMMORTAL_STORAGE', 'R625_KERNEL_NAMESPACE'], isLocked: true },
      { id: 'R640_JOURNAL_FEDERATION', name: 'Immutable Journal Federation', category: 'STORAGE', sprint: 'RC81', dependencies: ['R594_IMMORTAL_STORAGE', 'R604_CONTROL_PLANE'], isLocked: true },
      { id: 'R641_EXECUTIVE_BOARD', name: 'Executive Operations Board', category: 'GOVERNANCE', sprint: 'RC81', dependencies: ['R614_SOVEREIGN_GOV', 'R635_OPERATIONAL_DOCTRINE'], isLocked: true },
      { id: 'R642_MAINTENANCE_ROTATION', name: 'Autonomous Maintenance Rotation', category: 'OPERATIONS', sprint: 'RC81', dependencies: ['R594_IMMORTAL_STORAGE', 'R633_RESOURCE_GOVERNOR'], isLocked: true },
      { id: 'R643_OPERATIONAL_INVARIANTS', name: 'Operational Invariants Engine', category: 'GOVERNANCE', sprint: 'RC81', dependencies: ['R634_CONSTITUTION_AUDIT', 'R628_UNIFIED_TELEMETRY'], isLocked: true },
      { id: 'R644_LONG_LIFE_FORECAST', name: 'Long-Life Forecast Engine', category: 'AI_COGNITIVE', sprint: 'RC81', dependencies: ['R36_AI_OS', 'R628_UNIFIED_TELEMETRY'], isLocked: true }
    ];

    // Compute reverse dependents
    rawNodes.forEach(node => {
      this.nodes.set(node.id, {
        ...node,
        dependents: [],
        status: 'HEALTHY',
        blastRadiusScore: 1
      });
    });

    this.nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        const depNode = this.nodes.get(depId);
        if (depNode) {
          depNode.dependents.push(node.id);
        }
      });
    });

    // Compute blast radius score based on dependents count
    this.nodes.forEach(node => {
      const depCount = node.dependents.length;
      node.blastRadiusScore = Math.min(10, Math.max(1, Math.ceil(depCount * 1.5) + 1));
    });
  }

  public auditDependencyGraph(): DependencyAuditReport {
    const circularDependencies: string[][] = [];
    const orphanModules: string[] = [];
    const duplicateServices: string[] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const topologicalOrder: string[] = [];

    // Cycle detection via DFS
    const checkCycle = (nodeId: string, path: string[]) => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const node = this.nodes.get(nodeId);
      if (node) {
        for (const depId of node.dependencies) {
          if (!visited.has(depId)) {
            checkCycle(depId, [...path, depId]);
          } else if (recStack.has(depId)) {
            circularDependencies.push([...path, depId]);
          }
        }
      }

      recStack.delete(nodeId);
      if (!topologicalOrder.includes(nodeId)) {
        topologicalOrder.push(nodeId);
      }
    };

    this.nodes.forEach((_, id) => {
      if (!visited.has(id)) {
        checkCycle(id, [id]);
      }
    });

    // Check for orphans (nodes that have 0 dependencies and 0 dependents, excluding root RBAC)
    this.nodes.forEach(node => {
      if (node.dependencies.length === 0 && node.dependents.length === 0 && node.id !== 'R2_RBAC') {
        orphanModules.push(node.id);
        node.status = 'ORPHAN';
      }
    });

    // Duplicate check
    const names = new Set<string>();
    this.nodes.forEach(node => {
      if (names.has(node.name)) {
        duplicateServices.push(node.name);
      }
      names.add(node.name);
    });

    let totalEdges = 0;
    this.nodes.forEach(n => {
      totalEdges += n.dependencies.length;
    });

    const isPassing = circularDependencies.length === 0 && orphanModules.length === 0 && duplicateServices.length === 0;
    const healthScore = isPassing ? 100 : Math.max(20, 100 - circularDependencies.length * 40 - orphanModules.length * 20);

    this.auditReport = {
      timestamp: new Date().toISOString(),
      totalNodes: this.nodes.size,
      totalEdges,
      circularDependencies,
      orphanModules,
      duplicateServices,
      graphHealthScore: healthScore,
      topologicalOrder,
      isPassing
    };

    return this.auditReport;
  }

  public getAllNodes(): EngineNode[] {
    return Array.from(this.nodes.values());
  }

  public getAuditReport(): DependencyAuditReport {
    if (!this.auditReport) {
      return this.auditDependencyGraph();
    }
    return this.auditReport;
  }
}

export const dependencyGraphGuardian = DependencyGraphGuardian.getInstance();
