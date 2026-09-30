import { discoveryRegistry } from '../discoveryRegistry';
import { DiscoveryEntry } from '../discoveryTypes';

export interface DiscoveryScanReport {
  scanId: string;
  totalEntries: number;
  duplicateIdsFound: string[];
  missingSprintRanges: string[];
  orphanModuleCodes: string[];
  categoryDistribution: Record<string, number>;
  sprintCoverage: Record<string, number>;
  integrityScore: number; // 0 - 100
  verdict: 'REGISTRY_CLEAN' | 'ANOMALY_DETECTED';
  scannedAt: string;
}

export class DiscoveryIntegrityScanner {
  private static instance: DiscoveryIntegrityScanner;

  private constructor() {}

  public static getInstance(): DiscoveryIntegrityScanner {
    if (!DiscoveryIntegrityScanner.instance) {
      DiscoveryIntegrityScanner.instance = new DiscoveryIntegrityScanner();
    }
    return DiscoveryIntegrityScanner.instance;
  }

  public runScan(): DiscoveryScanReport {
    const entries = discoveryRegistry;
    const totalEntries = entries.length;

    // Check Duplicates
    const idSet = new Set<string>();
    const duplicateIds: string[] = [];

    const categoryDistribution: Record<string, number> = {};
    const sprintCoverage: Record<string, number> = {};

    entries.forEach(entry => {
      if (idSet.has(entry.id)) {
        duplicateIds.push(entry.id);
      } else {
        idSet.add(entry.id);
      }

      categoryDistribution[entry.category] = (categoryDistribution[entry.category] || 0) + 1;
      sprintCoverage[entry.sprintOrigin] = (sprintCoverage[entry.sprintOrigin] || 0) + 1;
    });

    // Check specific critical ranges
    const expectedRanges = [
      { prefix: 'DISC-69', min: 691, max: 700, sprint: 'RC87' },
      { prefix: 'DISC-75', min: 751, max: 760, sprint: 'RC93' },
      { prefix: 'DISC-76', min: 761, max: 770, sprint: 'RC94' },
      { prefix: 'DISC-77', min: 771, max: 780, sprint: 'RC95' },
      { prefix: 'DISC-78', min: 781, max: 790, sprint: 'RC96A' }
    ];

    const missingRanges: string[] = [];
    expectedRanges.forEach(r => {
      for (let i = r.min; i <= r.max; i++) {
        const id = `DISC-${i}`;
        if (!idSet.has(id)) {
          missingRanges.push(id);
        }
      }
    });

    const orphanCodes: string[] = [];
    const hasDuplicates = duplicateIds.length > 0;
    const integrityScore = hasDuplicates ? 85 : 100;

    return {
      scanId: `DISC-SCAN-${Date.now().toString(16).toUpperCase()}`,
      totalEntries,
      duplicateIdsFound: duplicateIds,
      missingSprintRanges: missingRanges,
      orphanModuleCodes: orphanCodes,
      categoryDistribution,
      sprintCoverage,
      integrityScore,
      verdict: hasDuplicates ? 'ANOMALY_DETECTED' : 'REGISTRY_CLEAN',
      scannedAt: new Date().toISOString()
    };
  }
}
