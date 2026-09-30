export type FailureCategory = 
  | 'VALIDATION' 
  | 'PERMISSION' 
  | 'TIMEOUT' 
  | 'DEPENDENCY' 
  | 'DUPLICATE' 
  | 'MANUAL_INTERRUPTION';

export interface FailurePatternCluster {
  clusterId: string;
  category: FailureCategory;
  title: string;
  description: string;
  frequencyCount: number;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  exampleIncidentTaskId: string;
  rootCauseAnalysis: string;
  mitigationStrategy: string;
  preventativeInvariantRef: string;
  lastDetectedAt: string;
}

export class FailurePatternIntelligence {
  private static instance: FailurePatternIntelligence;
  private clusters: FailurePatternCluster[] = [];

  private constructor() {
    this.seedFailureClusters();
  }

  public static getInstance(): FailurePatternIntelligence {
    if (!FailurePatternIntelligence.instance) {
      FailurePatternIntelligence.instance = new FailurePatternIntelligence();
    }
    return FailurePatternIntelligence.instance;
  }

  private seedFailureClusters(): void {
    this.clusters = [
      {
        clusterId: 'PAT-VAL-01',
        category: 'VALIDATION',
        title: 'Anti-Negative Balance Invariant Check Trigger',
        description: 'Deteksi upaya penarikan saldo tabungan yang melebihi saldo aktual santri.',
        frequencyCount: 3,
        impactLevel: 'HIGH',
        exampleIncidentTaskId: 'TASK-2026-0804',
        rootCauseAnalysis: 'Staf TU menginput nominal penarikan sebelum melakukan sinkronisasi buku kas mutasi.',
        mitigationStrategy: 'Terapkan validasi form client-side maxLimit = currentSantriBalance sebelum pembuatan payload task.',
        preventativeInvariantRef: 'Invarian Konstitusi #1 (Anti-Defisit & Saldo Tabungan Non-Negatif)',
        lastDetectedAt: '2026-08-17T08:45:00Z'
      },
      {
        clusterId: 'PAT-PERM-02',
        category: 'PERMISSION',
        title: 'RBAC Boundary Violation (Ring-0 Gate Interception)',
        description: 'Upaya pemanggilan kemampuan konfigurasi sistem oleh peran di luar Super Admin.',
        frequencyCount: 2,
        impactLevel: 'CRITICAL',
        exampleIncidentTaskId: 'SIM-SCENARIO-3',
        rootCauseAnalysis: 'Akun Guru atau TU mencoba mengakses mutasi parameter jaringan/konstitusi.',
        mitigationStrategy: 'Intersepsi total di Ring-0 Safety Gate & transisi langsung ke status BLOCKED tanpa retry.',
        preventativeInvariantRef: 'Invarian Keamanan Ring-0: Privilege Escalation Zero Tolerance',
        lastDetectedAt: '2026-08-17T09:00:00Z'
      },
      {
        clusterId: 'PAT-DEP-03',
        category: 'DEPENDENCY',
        title: 'Unseeded Master Reference Data',
        description: 'Tugas rekapitulasi memanggil ID rombel yang belum terindeks di db.ts.',
        frequencyCount: 1,
        impactLevel: 'MEDIUM',
        exampleIncidentTaskId: 'TASK-2026-0803',
        rootCauseAnalysis: 'Tahun ajaran baru belum diaktifkan saat pembuatan draf laporan kesiapan kurikulum.',
        mitigationStrategy: 'Pemeriksaan pra-kondisi ketersediaan master data sebelum memulai tahapan EXECUTING.',
        preventativeInvariantRef: 'Invarian SSoT: Single Source of Truth Dependency Integrity',
        lastDetectedAt: '2026-08-17T08:30:00Z'
      },
      {
        clusterId: 'PAT-DUP-04',
        category: 'DUPLICATE',
        title: 'Replay Attempt on Completed Task',
        description: 'Percobaan submit ulang tugas yang sudah diselesaikan pada periode yang sama.',
        frequencyCount: 0, // Intercepted: 0% leakage
        impactLevel: 'HIGH',
        exampleIncidentTaskId: 'SIM-SCENARIO-7',
        rootCauseAnalysis: 'User menekan tombol eksekusi ganda atau resume dari jeda.',
        mitigationStrategy: 'Penyematan ExecutionFingerprint & Checksum Deduplication Signature mencegah eksekusi ulang 100%.',
        preventativeInvariantRef: 'Invarian Kontinuitas: Zero Duplicate Execution on Resume',
        lastDetectedAt: '2026-08-17T09:15:00Z'
      },
      {
        clusterId: 'PAT-MAN-05',
        category: 'MANUAL_INTERRUPTION',
        title: 'Founder Sovereign Pause Engagement',
        description: 'Super Admin menjeda operasional task secara manual untuk audit mendadak.',
        frequencyCount: 4,
        impactLevel: 'LOW',
        exampleIncidentTaskId: 'TASK-2026-0801',
        rootCauseAnalysis: 'Intervensi terencana oleh Founder/Super Admin melalui Sovereign Manual Administration.',
        mitigationStrategy: 'Pembekuan state di AdaptiveWorkflowMemory & preservasi checkpoint langkah.',
        preventativeInvariantRef: 'Invarian Kedaulatan: Super Admin Veto & Sovereign Pause Authority',
        lastDetectedAt: '2026-08-17T09:20:00Z'
      },
      {
        clusterId: 'PAT-TIME-06',
        category: 'TIMEOUT',
        title: 'IndexedDB Lock Latency on Large Batch',
        description: 'Keterlambatan pembacaan penyimpanan lokal saat batch export > 1000 entri.',
        frequencyCount: 1,
        impactLevel: 'LOW',
        exampleIncidentTaskId: 'TASK-2026-0802',
        rootCauseAnalysis: 'Penyimpanan lokal browser sedang melakukan auto-compaction.',
        mitigationStrategy: 'TaskSelfRecoveryEngine menerapkan exponential backoff 50ms - 200ms.',
        preventativeInvariantRef: 'Invarian Ketahanan: Bounded Auto-Recovery Retry Limit (Max 3)',
        lastDetectedAt: '2026-08-17T08:15:00Z'
      }
    ];
  }

  public getAllClusters(): FailurePatternCluster[] {
    return [...this.clusters];
  }

  public getClustersByCategory(category: FailureCategory): FailurePatternCluster[] {
    return this.clusters.filter(c => c.category === category);
  }

  public logFailureIncident(
    category: FailureCategory,
    taskId: string,
    errorReason: string
  ): void {
    const cluster = this.clusters.find(c => c.category === category);
    if (cluster) {
      cluster.frequencyCount += 1;
      cluster.exampleIncidentTaskId = taskId;
      cluster.lastDetectedAt = new Date().toISOString();
    }
  }
}
