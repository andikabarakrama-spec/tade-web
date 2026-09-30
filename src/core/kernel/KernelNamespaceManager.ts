/**
 * R625: Kernel Namespace Manager
 * Virtual Namespace Isolation for TADE Digital State Infrastructure.
 * Prevents cross-namespace memory bleed, enforces strict boundary verification gates.
 */

export type VirtualNamespace =
  | 'WEBSITE'
  | 'SIM'
  | 'SYSTEM_KERNEL'
  | 'AI_ASY'
  | 'GUARDIAN'
  | 'WAR_ROOM'
  | 'CIVIL_SERVICE';

export interface NamespaceBoundaryRule {
  sourceNamespace: VirtualNamespace;
  allowedTargets: VirtualNamespace[];
  isolationLevel: 'AIR_GAPPED' | 'RESTRICTED_BRIDGE' | 'READ_ONLY_SANDBOX' | 'FULL_TRUSTED';
  activeIsolation: boolean;
  isolationViolations: number;
}

export interface NamespaceMemoryContext {
  namespace: VirtualNamespace;
  allocatedBytes: number;
  maxBytes: number;
  variableKeysCount: number;
  readOnly: boolean;
  lastAccessTimestamp: number;
  integrityHash: string;
}

export interface NamespaceAccessEvent {
  id: string;
  timestamp: string;
  source: VirtualNamespace;
  target: VirtualNamespace;
  operation: 'READ' | 'WRITE' | 'EXECUTE' | 'MESSAGE';
  status: 'ALLOWED' | 'DENIED_ISOLATION_VIOLATION' | 'THROTTLED';
  details: string;
}

class KernelNamespaceManager {
  private static instance: KernelNamespaceManager;

  private boundaryRules: Map<VirtualNamespace, NamespaceBoundaryRule> = new Map();
  private memoryContexts: Map<VirtualNamespace, NamespaceMemoryContext> = new Map();
  private accessLog: NamespaceAccessEvent[] = [];
  private totalViolationsPrevented: number = 0;

  private constructor() {
    this.initializeBoundaryRules();
    this.initializeMemoryContexts();
  }

  public static getInstance(): KernelNamespaceManager {
    if (!KernelNamespaceManager.instance) {
      KernelNamespaceManager.instance = new KernelNamespaceManager();
    }
    return KernelNamespaceManager.instance;
  }

  private initializeBoundaryRules(): void {
    // WEBSITE: Strict Read-only isolation sandbox
    this.boundaryRules.set('WEBSITE', {
      sourceNamespace: 'WEBSITE',
      allowedTargets: ['WEBSITE'],
      isolationLevel: 'READ_ONLY_SANDBOX',
      activeIsolation: true,
      isolationViolations: 0,
    });

    // SIM: School administrative operations
    this.boundaryRules.set('SIM', {
      sourceNamespace: 'SIM',
      allowedTargets: ['SIM', 'CIVIL_SERVICE', 'SYSTEM_KERNEL'],
      isolationLevel: 'RESTRICTED_BRIDGE',
      activeIsolation: true,
      isolationViolations: 0,
    });

    // SYSTEM_KERNEL: Ring-0 root supervision
    this.boundaryRules.set('SYSTEM_KERNEL', {
      sourceNamespace: 'SYSTEM_KERNEL',
      allowedTargets: ['SYSTEM_KERNEL', 'GUARDIAN', 'AI_ASY', 'CIVIL_SERVICE', 'SIM', 'WAR_ROOM', 'WEBSITE'],
      isolationLevel: 'FULL_TRUSTED',
      activeIsolation: true,
      isolationViolations: 0,
    });

    // AI_ASY: Prime Minister civil administration
    this.boundaryRules.set('AI_ASY', {
      sourceNamespace: 'AI_ASY',
      allowedTargets: ['AI_ASY', 'CIVIL_SERVICE', 'SIM', 'SYSTEM_KERNEL', 'WAR_ROOM'],
      isolationLevel: 'RESTRICTED_BRIDGE',
      activeIsolation: true,
      isolationViolations: 0,
    });

    // GUARDIAN: Supreme General military and Ring-0 security
    this.boundaryRules.set('GUARDIAN', {
      sourceNamespace: 'GUARDIAN',
      allowedTargets: ['GUARDIAN', 'SYSTEM_KERNEL', 'WAR_ROOM'],
      isolationLevel: 'AIR_GAPPED',
      activeIsolation: true,
      isolationViolations: 0,
    });

    // WAR_ROOM: Multi-dimensional diagnostic sensory grid
    this.boundaryRules.set('WAR_ROOM', {
      sourceNamespace: 'WAR_ROOM',
      allowedTargets: ['WAR_ROOM', 'SYSTEM_KERNEL', 'GUARDIAN', 'AI_ASY', 'CIVIL_SERVICE'],
      isolationLevel: 'RESTRICTED_BRIDGE',
      activeIsolation: true,
      isolationViolations: 0,
    });

    // CIVIL_SERVICE: 10 ministries & digital workforce
    this.boundaryRules.set('CIVIL_SERVICE', {
      sourceNamespace: 'CIVIL_SERVICE',
      allowedTargets: ['CIVIL_SERVICE', 'AI_ASY', 'SIM', 'SYSTEM_KERNEL'],
      isolationLevel: 'RESTRICTED_BRIDGE',
      activeIsolation: true,
      isolationViolations: 0,
    });
  }

  private initializeMemoryContexts(): void {
    const namespaces: VirtualNamespace[] = [
      'WEBSITE',
      'SIM',
      'SYSTEM_KERNEL',
      'AI_ASY',
      'GUARDIAN',
      'WAR_ROOM',
      'CIVIL_SERVICE',
    ];

    const allocations: Record<VirtualNamespace, { alloc: number; max: number; ro: boolean }> = {
      WEBSITE: { alloc: 12 * 1024 * 1024, max: 32 * 1024 * 1024, ro: true },
      SIM: { alloc: 48 * 1024 * 1024, max: 128 * 1024 * 1024, ro: false },
      SYSTEM_KERNEL: { alloc: 64 * 1024 * 1024, max: 256 * 1024 * 1024, ro: false },
      AI_ASY: { alloc: 32 * 1024 * 1024, max: 96 * 1024 * 1024, ro: false },
      GUARDIAN: { alloc: 64 * 1024 * 1024, max: 256 * 1024 * 1024, ro: false },
      WAR_ROOM: { alloc: 24 * 1024 * 1024, max: 64 * 1024 * 1024, ro: true },
      CIVIL_SERVICE: { alloc: 36 * 1024 * 1024, max: 112 * 1024 * 1024, ro: false },
    };

    namespaces.forEach((ns) => {
      this.memoryContexts.set(ns, {
        namespace: ns,
        allocatedBytes: allocations[ns].alloc,
        maxBytes: allocations[ns].max,
        variableKeysCount: Math.floor(allocations[ns].alloc / (1024 * 64)),
        readOnly: allocations[ns].ro,
        lastAccessTimestamp: Date.now(),
        integrityHash: `SHA256:NS-${ns}-${Date.now().toString(16)}`,
      });
    });
  }

  public validateAccess(
    source: VirtualNamespace,
    target: VirtualNamespace,
    operation: 'READ' | 'WRITE' | 'EXECUTE' | 'MESSAGE',
    details: string = 'Standard IPC message call'
  ): { allowed: boolean; reason: string } {
    const rule = this.boundaryRules.get(source);
    if (!rule) {
      this.recordAccess(source, target, operation, 'DENIED_ISOLATION_VIOLATION', 'Unregistered source namespace');
      return { allowed: false, reason: 'Unregistered source namespace' };
    }

    // Check write operation on read-only sandbox
    const targetCtx = this.memoryContexts.get(target);
    if (operation === 'WRITE' && targetCtx?.readOnly && source !== 'SYSTEM_KERNEL') {
      this.totalViolationsPrevented++;
      rule.isolationViolations++;
      this.recordAccess(source, target, operation, 'DENIED_ISOLATION_VIOLATION', `Target namespace ${target} is strictly READ_ONLY`);
      return { allowed: false, reason: `Target namespace ${target} is strictly READ_ONLY` };
    }

    // Check allowed targets
    if (source !== target && !rule.allowedTargets.includes(target)) {
      this.totalViolationsPrevented++;
      rule.isolationViolations++;
      this.recordAccess(
        source,
        target,
        operation,
        'DENIED_ISOLATION_VIOLATION',
        `Access denied from ${source} to ${target} by TADE Isolation Policy`
      );
      return {
        allowed: false,
        reason: `Cross-namespace boundary bleed prevented: ${source} cannot access ${target}`,
      };
    }

    // Access granted
    this.recordAccess(source, target, operation, 'ALLOWED', details);
    if (targetCtx) {
      targetCtx.lastAccessTimestamp = Date.now();
    }
    return { allowed: true, reason: 'Boundary verified & access allowed' };
  }

  private recordAccess(
    source: VirtualNamespace,
    target: VirtualNamespace,
    operation: 'READ' | 'WRITE' | 'EXECUTE' | 'MESSAGE',
    status: 'ALLOWED' | 'DENIED_ISOLATION_VIOLATION' | 'THROTTLED',
    details: string
  ): void {
    const entry: NamespaceAccessEvent = {
      id: `NS-EVT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      source,
      target,
      operation,
      status,
      details,
    };
    this.accessLog.unshift(entry);
    if (this.accessLog.length > 50) {
      this.accessLog.pop();
    }
  }

  public getBoundaryRules(): NamespaceBoundaryRule[] {
    return Array.from(this.boundaryRules.values());
  }

  public getMemoryContexts(): NamespaceMemoryContext[] {
    return Array.from(this.memoryContexts.values());
  }

  public getAccessLog(): NamespaceAccessEvent[] {
    return [...this.accessLog];
  }

  public getTotalViolationsPrevented(): number {
    return this.totalViolationsPrevented;
  }

  public testSimulateCrossBleed(source: VirtualNamespace, target: VirtualNamespace): { blocked: boolean; details: string } {
    const result = this.validateAccess(source, target, 'WRITE', 'Simulated cross-namespace bleed penetration probe');
    return {
      blocked: !result.allowed,
      details: result.reason,
    };
  }
}

export const kernelNamespaceManager = KernelNamespaceManager.getInstance();
