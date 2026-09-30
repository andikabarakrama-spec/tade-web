import { UserRole } from '../../types';

export type TaskPriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface PriorityEvaluationFactor {
  name: string;
  weight: number; // 0 - 100
  score: number;  // 0 - 100
  rationale: string;
}

export interface PriorityEvaluationResult {
  priorityLevel: TaskPriorityLevel;
  compositeScore: number;
  factors: PriorityEvaluationFactor[];
  suggestedSLAHours: number;
  escalationRequired: boolean;
}

export class IntelligentPriorityEngine {
  private static instance: IntelligentPriorityEngine;

  public static getInstance(): IntelligentPriorityEngine {
    if (!IntelligentPriorityEngine.instance) {
      IntelligentPriorityEngine.instance = new IntelligentPriorityEngine();
    }
    return IntelligentPriorityEngine.instance;
  }

  public evaluatePriority(params: {
    deadline?: string;
    impactCategory: 'FINANCIAL' | 'LEGAL_COMPLIANCE' | 'STUDENT_SAFETY' | 'ACADEMIC_REPORT' | 'ROUTINE_ADMIN';
    assignedRole: UserRole;
    isDependencyBlocked: boolean;
    daysOverdue?: number;
  }): PriorityEvaluationResult {
    const factors: PriorityEvaluationFactor[] = [];

    // Factor 1: Operational & Legal Impact
    let impactScore = 30;
    let impactRationale = 'Dampak rutin harian.';
    if (params.impactCategory === 'STUDENT_SAFETY') {
      impactScore = 100;
      impactRationale = 'Keamanan dan keselamatan santri memicu prioritas tertinggi.';
    } else if (params.impactCategory === 'LEGAL_COMPLIANCE') {
      impactScore = 90;
      impactRationale = 'Kepatuhan regulasi Permendikbud & legalitas dokumen formal.';
    } else if (params.impactCategory === 'FINANCIAL') {
      impactScore = 80;
      impactRationale = 'Integritas arus kas, pelunasan SPP, atau rekonsiliasi perbankan.';
    } else if (params.impactCategory === 'ACADEMIC_REPORT') {
      impactScore = 65;
      impactRationale = 'Penerbitan e-rapor & asesmen capaian perkembangan.';
    }
    factors.push({
      name: 'Dampak Operasional & Regulasi',
      weight: 40,
      score: impactScore,
      rationale: impactRationale
    });

    // Factor 2: Deadline Urgency
    let deadlineScore = 40;
    let deadlineRationale = 'Batas waktu masih longgar.';
    const days = params.daysOverdue ?? 0;
    if (days > 0) {
      deadlineScore = 100;
      deadlineRationale = `Telah melampaui deadline (${days} hari terlambat).`;
    } else if (params.deadline) {
      const diffDays = Math.ceil((new Date(params.deadline).getTime() - Date.now()) / (1000 * 3600 * 24));
      if (diffDays <= 1) {
        deadlineScore = 95;
        deadlineRationale = 'Batas waktu kurang dari 24 jam.';
      } else if (diffDays <= 3) {
        deadlineScore = 75;
        deadlineRationale = 'Batas waktu mendekati (1-3 hari).';
      }
    }
    factors.push({
      name: 'Urgensi Batas Waktu',
      weight: 35,
      score: deadlineScore,
      rationale: deadlineRationale
    });

    // Factor 3: Role Hierarchy & Dependency
    let roleScore = 50;
    let roleRationale = 'Penugasan staf standar.';
    if (params.assignedRole === 'SUPER_ADMIN' || params.assignedRole === 'KETUA_YAYASAN') {
      roleScore = 85;
      roleRationale = 'Eselon pimpinan puncak & otorisasi kedaulatan.';
    } else if (params.assignedRole === 'KEPALA_SEKOLAH') {
      roleScore = 70;
      roleRationale = 'Otorisasi manajerial sekolah.';
    }
    if (params.isDependencyBlocked) {
      roleScore -= 20;
      roleRationale += ' (Terblokir ketergantungan antrean lain).';
    }
    factors.push({
      name: 'Hierarki Penugasan & Dependency',
      weight: 25,
      score: Math.max(0, roleScore),
      rationale: roleRationale
    });

    // Composite Calculation
    const compositeScore = Math.round(
      factors.reduce((acc, f) => acc + (f.score * (f.weight / 100)), 0)
    );

    let priorityLevel: TaskPriorityLevel = 'LOW';
    let suggestedSLAHours = 72;
    let escalationRequired = false;

    if (compositeScore >= 85) {
      priorityLevel = 'CRITICAL';
      suggestedSLAHours = 4;
      escalationRequired = true;
    } else if (compositeScore >= 70) {
      priorityLevel = 'HIGH';
      suggestedSLAHours = 12;
      escalationRequired = false;
    } else if (compositeScore >= 45) {
      priorityLevel = 'MEDIUM';
      suggestedSLAHours = 24;
      escalationRequired = false;
    } else {
      priorityLevel = 'LOW';
      suggestedSLAHours = 72;
      escalationRequired = false;
    }

    return {
      priorityLevel,
      compositeScore,
      factors,
      suggestedSLAHours,
      escalationRequired
    };
  }
}
