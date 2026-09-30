/**
 * R722 — Compatibility Validator
 * TK ASY SYIFA DIGITAL ECOSYSTEM (TADE) — RC90
 * 
 * Report-only diagnostic engine to validate engine contract version compatibility,
 * missing dependencies, version mismatches, and circular dependencies.
 */

import { EngineContractRegistry, EngineContractMetadata } from './EngineContractRegistry';

export interface CompatibilityCheckFinding {
  checkId: string;
  checkType: 'DEPENDENCY_MISMATCH' | 'CONTRACT_MISMATCH' | 'MISSING_DEPENDENCY' | 'CIRCULAR_DEPENDENCY' | 'VERSION_ALIGNMENT';
  severity: 'PASS' | 'INFO' | 'WARNING' | 'CRITICAL';
  sourceEngineId: string;
  targetEngineId?: string;
  description: string;
  recommendation: string;
  isCompliant: boolean;
}

export interface CompatibilityReport {
  timestamp: string;
  totalChecks: number;
  passCount: number;
  warningCount: number;
  criticalCount: number;
  overallCompatibilityScore: number;
  hasCircularDependency: boolean;
  findings: CompatibilityCheckFinding[];
}

export class CompatibilityValidator {
  private static instance: CompatibilityValidator;
  private registry = EngineContractRegistry.getInstance();

  public static getInstance(): CompatibilityValidator {
    if (!CompatibilityValidator.instance) {
      CompatibilityValidator.instance = new CompatibilityValidator();
    }
    return CompatibilityValidator.instance;
  }

  public validateCompatibility(): CompatibilityReport {
    const contracts = this.registry.getAllContracts();
    const contractMap = new Map<string, EngineContractMetadata>();
    contracts.forEach(c => contractMap.set(c.engineId, c));

    const findings: CompatibilityCheckFinding[] = [];

    // 1. Check Missing Dependencies & Version Mismatches
    contracts.forEach(engine => {
      engine.dependencies.forEach(dep => {
        const targetEngine = contractMap.get(dep.engineId);
        
        if (!targetEngine) {
          findings.push({
            checkId: `CHK-MISSING-${engine.engineId}-${dep.engineId}`,
            checkType: 'MISSING_DEPENDENCY',
            severity: dep.optional ? 'WARNING' : 'CRITICAL',
            sourceEngineId: engine.engineId,
            targetEngineId: dep.engineId,
            description: `Engine ${engine.engineName} membutuhkan dependensi '${dep.engineId}' yang tidak terdaftar di contract registry.`,
            recommendation: `Daftarkan ${dep.engineId} ke EngineContractRegistry atau hapus dependensi jika tidak terpakai.`,
            isCompliant: false
          });
        } else {
          // Version comparison (contractVersion >= minContractVersion)
          const targetContractNum = parseFloat(targetEngine.contractVersion.replace(/[^0-9.]/g, '')) || 1.0;
          const minContractNum = parseFloat(dep.minContractVersion.replace(/[^0-9.]/g, '')) || 1.0;

          if (targetContractNum < minContractNum) {
            findings.push({
              checkId: `CHK-VER-MISMATCH-${engine.engineId}-${dep.engineId}`,
              checkType: 'CONTRACT_MISMATCH',
              severity: 'CRITICAL',
              sourceEngineId: engine.engineId,
              targetEngineId: dep.engineId,
              description: `Versi kontrak '${targetEngine.engineName}' (${targetEngine.contractVersion}) di bawah kebutuhan minimum '${engine.engineName}' (${dep.minContractVersion}).`,
              recommendation: `Upgrade kontrak ${targetEngine.engineId} atau sesuaikan minContractVersion di ${engine.engineId}.`,
              isCompliant: false
            });
          } else {
            findings.push({
              checkId: `CHK-DEP-OK-${engine.engineId}-${dep.engineId}`,
              checkType: 'VERSION_ALIGNMENT',
              severity: 'PASS',
              sourceEngineId: engine.engineId,
              targetEngineId: dep.engineId,
              description: `Kontrak dependensi '${targetEngine.engineName}' (${targetEngine.contractVersion}) memenuhi syarat minimum (${dep.minContractVersion}) dari '${engine.engineName}'.`,
              recommendation: 'Pertahankan keselarasan kontrak.',
              isCompliant: true
            });
          }
        }
      });
    });

    // 2. Check Circular Dependencies using DFS
    const circularFindings = this.detectCircularDependencies(contracts);
    findings.push(...circularFindings);

    // 3. Rollback Safety & Backward Compatibility Invariant Check
    contracts.forEach(engine => {
      if (!engine.isRollbackSafe) {
        findings.push({
          checkId: `CHK-ROLLBACK-${engine.engineId}`,
          checkType: 'VERSION_ALIGNMENT',
          severity: 'WARNING',
          sourceEngineId: engine.engineId,
          description: `Engine '${engine.engineName}' belum memiliki jaminan rollback safety eksplisit.`,
          recommendation: 'Tambahkan strategi migrasi skema dua arah (forward/backward).',
          isCompliant: false
        });
      } else {
        findings.push({
          checkId: `CHK-ROLLBACK-OK-${engine.engineId}`,
          checkType: 'VERSION_ALIGNMENT',
          severity: 'PASS',
          sourceEngineId: engine.engineId,
          description: `Engine '${engine.engineName}' terverifikasi memiliki kemampuan rollback safety penuh.`,
          recommendation: 'Pertahankan status rollback safe.',
          isCompliant: true
        });
      }
    });

    const totalChecks = findings.length;
    const passCount = findings.filter(f => f.severity === 'PASS').length;
    const warningCount = findings.filter(f => f.severity === 'WARNING').length;
    const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
    const score = totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : 100;
    const hasCircularDependency = circularFindings.some(f => f.checkType === 'CIRCULAR_DEPENDENCY' && !f.isCompliant);

    return {
      timestamp: new Date().toISOString(),
      totalChecks,
      passCount,
      warningCount,
      criticalCount,
      overallCompatibilityScore: score,
      hasCircularDependency,
      findings
    };
  }

  private detectCircularDependencies(contracts: EngineContractMetadata[]): CompatibilityCheckFinding[] {
    const adj = new Map<string, string[]>();
    contracts.forEach(c => {
      adj.set(c.engineId, c.dependencies.map(d => d.engineId));
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const circularPaths: string[][] = [];

    const dfs = (node: string, path: string[]) => {
      visited.add(node);
      recStack.add(node);

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path, neighbor]);
        } else if (recStack.has(neighbor)) {
          circularPaths.push([...path, neighbor]);
        }
      }

      recStack.delete(node);
    };

    contracts.forEach(c => {
      if (!visited.has(c.engineId)) {
        dfs(c.engineId, [c.engineId]);
      }
    });

    if (circularPaths.length === 0) {
      return [{
        checkId: 'CHK-NO-CIRCULAR-DEP',
        checkType: 'CIRCULAR_DEPENDENCY',
        severity: 'PASS',
        sourceEngineId: 'SYSTEM_GRAPH',
        description: 'Pemeriksaan struktur Directed Acyclic Graph (DAG) membuktikan 0 circular dependency pada seluruh engine.',
        recommendation: 'Topologi dependensi teratur dan aman dari siklus buntu.',
        isCompliant: true
      }];
    }

    return circularPaths.map((p, idx) => ({
      checkId: `CHK-CIRCULAR-${idx + 1}`,
      checkType: 'CIRCULAR_DEPENDENCY',
      severity: 'CRITICAL',
      sourceEngineId: p[0],
      targetEngineId: p[p.length - 1],
      description: `Terdeteksi ketergantungan melingkar (circular dependency): ${p.join(' -> ')}`,
      recommendation: 'Refaktor interface untuk memutus siklus dependensi menggunakan event bus atau interface inversion.',
      isCompliant: false
    }));
  }
}
