/**
 * R728 — Intelligence Confidence Engine
 * TK ASY SYIFA DIGITAL ECOSYSTEM (TADE) — RC90
 * 
 * Deterministic confidence rating engine for all AI Asy advisory outputs.
 * Strict invariant: If confidence < 80%, output is tagged as NEED_REVIEW.
 */

export interface ConfidenceGroundingFactor {
  factorName: string;
  weight: number; // 0-1
  score: number; // 0-100
  notes: string;
}

export interface IntelligenceConfidenceRating {
  confidenceScore: number; // 0-100
  confidenceLevel: 'HIGH_CONFIDENCE' | 'SOLID_CONFIDENCE' | 'NEED_REVIEW';
  groundingFactors: ConfidenceGroundingFactor[];
  reasons: string[];
  internalSources: string[];
  reviewedByFounder: boolean;
  evaluatedAt: string;
}

export class IntelligenceConfidenceEngine {
  private static instance: IntelligenceConfidenceEngine;

  public static getInstance(): IntelligenceConfidenceEngine {
    if (!IntelligenceConfidenceEngine.instance) {
      IntelligenceConfidenceEngine.instance = new IntelligenceConfidenceEngine();
    }
    return IntelligenceConfidenceEngine.instance;
  }

  public evaluateConfidence(params: {
    dataFreshnessMinutes: number;
    hasSSoTGrounding: boolean;
    hasGuardianVerification: boolean;
    hasCrossModuleValidation: boolean;
    sampleSize: number;
    internalSources: string[];
  }): IntelligenceConfidenceRating {
    const factors: ConfidenceGroundingFactor[] = [];

    // Factor 1: Data Freshness (25% weight)
    const freshnessScore = Math.max(0, Math.min(100, 100 - params.dataFreshnessMinutes * 2));
    factors.push({
      factorName: 'Data Freshness & Real-Time Sync',
      weight: 0.25,
      score: freshnessScore,
      notes: `Data berumur ${params.dataFreshnessMinutes} menit dari SSoT.`
    });

    // Factor 2: SSoT Grounding (30% weight)
    const ssotScore = params.hasSSoTGrounding ? 100 : 30;
    factors.push({
      factorName: 'SSoT db.ts Grounding',
      weight: 0.30,
      score: ssotScore,
      notes: params.hasSSoTGrounding ? 'Sepenuhnya bersumber dari DataService resmi.' : 'Peringatan: Minim data faktual SSoT.'
    });

    // Factor 3: Guardian Ring-0 & Ring-1 Verification (25% weight)
    const guardianScore = params.hasGuardianVerification ? 100 : 50;
    factors.push({
      factorName: 'Guardian Integrity Seal',
      weight: 0.25,
      score: guardianScore,
      notes: params.hasGuardianVerification ? 'Struktur diverifikasi bebas dari pelanggaran integritas.' : 'Belum diverifikasi Guardian.'
    });

    // Factor 4: Cross-Module Validation & Sample Completeness (20% weight)
    const sampleScore = params.sampleSize > 0 && params.hasCrossModuleValidation ? 95 : (params.sampleSize > 0 ? 75 : 40);
    factors.push({
      factorName: 'Cross-Module Cross-Referencing',
      weight: 0.20,
      score: sampleScore,
      notes: `Ukuran sampel data: ${params.sampleSize} entitas terkonfirmasi.`
    });

    // Weighted composite score
    const totalWeightedScore = factors.reduce((sum, f) => sum + (f.score * f.weight), 0);
    const confidenceScore = Math.round(totalWeightedScore);

    let confidenceLevel: 'HIGH_CONFIDENCE' | 'SOLID_CONFIDENCE' | 'NEED_REVIEW';
    if (confidenceScore >= 90) {
      confidenceLevel = 'HIGH_CONFIDENCE';
    } else if (confidenceScore >= 80) {
      confidenceLevel = 'SOLID_CONFIDENCE';
    } else {
      confidenceLevel = 'NEED_REVIEW';
    }

    const reasons: string[] = [];
    if (params.hasSSoTGrounding) reasons.push('Data bersumber dari basis data SSoT (db.ts) tanpa manipulasi.');
    if (params.hasGuardianVerification) reasons.push('Integritas skema tervalidasi 100% oleh Guardian Scanner.');
    if (confidenceLevel === 'NEED_REVIEW') {
      reasons.push('PERINGATAN: Skor di bawah 80% memerlukan verifikasi langsung oleh Founder sebelum diputuskan.');
    }

    return {
      confidenceScore,
      confidenceLevel,
      groundingFactors: factors,
      reasons,
      internalSources: params.internalSources,
      reviewedByFounder: false,
      evaluatedAt: new Date().toISOString()
    };
  }
}
