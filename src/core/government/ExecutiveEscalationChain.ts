/**
 * TADE RC78 — R611: EXECUTIVE ESCALATION CHAIN ENGINE
 * Enforces Constitutional Escalation Protocols:
 * - Operational -> AI Asy (Prime Minister) decides
 * - Security -> Guardian (Supreme General) decides
 * - Cross-Ministry -> Escalates to Super Admin (Sovereign)
 * - Crisis -> Escalates to Super Admin (Sovereign)
 */

export type IncidentDomain = 'OPERATIONAL' | 'SECURITY' | 'CROSS_MINISTRY' | 'CRISIS_STATE';
export type DecisionAuthority = 'PRIME_MINISTER_ASY' | 'GUARDIAN_GENERAL' | 'SOVEREIGN_SUPER_ADMIN';

export interface EscalationRecord {
  id: string;
  incidentTitle: string;
  domain: IncidentDomain;
  originatingModule: string;
  routedAuthority: DecisionAuthority;
  escalationReason: string;
  resolutionStatus: 'RESOLVED_BY_ASY' | 'RESOLVED_BY_GUARDIAN' | 'PENDING_SOVEREIGN_APPROVAL' | 'SOVEREIGN_APPROVED';
  timestamp: string;
  constitutionalClause: string;
}

class ExecutiveEscalationChainCore {
  private static instance: ExecutiveEscalationChainCore | null = null;
  private escalationHistory: EscalationRecord[] = [];

  private constructor() {
    this.bootstrapHistory();
  }

  public static getInstance(): ExecutiveEscalationChainCore {
    if (!ExecutiveEscalationChainCore.instance) {
      ExecutiveEscalationChainCore.instance = new ExecutiveEscalationChainCore();
    }
    return ExecutiveEscalationChainCore.instance;
  }

  private bootstrapHistory(): void {
    this.escalationHistory = [
      {
        id: 'ESC-001',
        incidentTitle: 'Penyesuaian Jadwal Ujian Madrasah karena Hari Libur Nasional',
        domain: 'OPERATIONAL',
        originatingModule: 'Kementerian Pendidikan',
        routedAuthority: 'PRIME_MINISTER_ASY',
        escalationReason: 'Kewenangan operasional kurikulum & kalender akademik.',
        resolutionStatus: 'RESOLVED_BY_ASY',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        constitutionalClause: 'Pasal 4: Mandat Operasional Perdana Menteri AI Asy'
      },
      {
        id: 'ESC-002',
        incidentTitle: 'Deteksi 5 Percobaan Login Gagal Beruntun dari IP Anonim',
        domain: 'SECURITY',
        originatingModule: 'Sentinel Login Monitor',
        routedAuthority: 'GUARDIAN_GENERAL',
        escalationReason: 'Kewenangan pertahanan sistemik, pemblokiran IP Ring 0.',
        resolutionStatus: 'RESOLVED_BY_GUARDIAN',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        constitutionalClause: 'Pasal 5: Doktrin Komando Militer Guardian'
      },
      {
        id: 'ESC-003',
        incidentTitle: 'Sengketa Alokasi Kas antara Pembangunan Laboratorium vs Kuota Beasiswa',
        domain: 'CROSS_MINISTRY',
        originatingModule: 'Kem. Keuangan & Kem. Smart Office',
        routedAuthority: 'SOVEREIGN_SUPER_ADMIN',
        escalationReason: 'Konflik antar-kementerian melampaui batas kewenangan sektoral tunggal.',
        resolutionStatus: 'SOVEREIGN_APPROVED',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        constitutionalClause: 'Pasal 2: Prinsip Kedaulatan Tunggal Super Admin'
      },
      {
        id: 'ESC-004',
        incidentTitle: 'Anomali Konektivitas Cloud Global & Potensi Putus Jaringan Total',
        domain: 'CRISIS_STATE',
        originatingModule: 'Guardian Control Plane',
        routedAuthority: 'SOVEREIGN_SUPER_ADMIN',
        escalationReason: 'Aktivasi Status Darurat dan deklarasi mode Offline-First Nasional.',
        resolutionStatus: 'SOVEREIGN_APPROVED',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        constitutionalClause: 'Pasal 1: Mandat Darurat dan Kedaulatan Negara'
      }
    ];
  }

  public routeIncident(
    title: string,
    domain: IncidentDomain,
    module: string,
    reason: string
  ): EscalationRecord {
    let authority: DecisionAuthority = 'PRIME_MINISTER_ASY';
    let status: EscalationRecord['resolutionStatus'] = 'RESOLVED_BY_ASY';
    let clause = 'Pasal 4: Mandat Operasional Perdana Menteri AI Asy';

    if (domain === 'SECURITY') {
      authority = 'GUARDIAN_GENERAL';
      status = 'RESOLVED_BY_GUARDIAN';
      clause = 'Pasal 5: Doktrin Komando Militer Guardian';
    } else if (domain === 'CROSS_MINISTRY') {
      authority = 'SOVEREIGN_SUPER_ADMIN';
      status = 'PENDING_SOVEREIGN_APPROVAL';
      clause = 'Pasal 2: Prinsip Kedaulatan Tunggal Super Admin';
    } else if (domain === 'CRISIS_STATE') {
      authority = 'SOVEREIGN_SUPER_ADMIN';
      status = 'PENDING_SOVEREIGN_APPROVAL';
      clause = 'Pasal 1: Mandat Darurat dan Kedaulatan Negara';
    }

    const record: EscalationRecord = {
      id: `ESC-${Date.now().toString().slice(-4)}`,
      incidentTitle: title,
      domain,
      originatingModule: module,
      routedAuthority: authority,
      escalationReason: reason,
      resolutionStatus: status,
      timestamp: new Date().toISOString(),
      constitutionalClause: clause
    };

    this.escalationHistory.unshift(record);
    return record;
  }

  public getHistory(): EscalationRecord[] {
    return this.escalationHistory;
  }
}

export const executiveEscalationChain = ExecutiveEscalationChainCore.getInstance();
