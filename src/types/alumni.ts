/**
 * TADE ALUMNI UNIVERSE TYPES — SPRINT G10
 * Strict RBAC Compliant • Sovereign Asy Syifa Heritage Architecture
 */

export interface AlumniProfile {
  id: string;
  studentId: string;
  studentName: string;
  nis: string;
  nisn: string;
  gender: 'L' | 'P';
  graduationYear: number;
  cohortName: string;
  photoUrl: string;
  parentUid: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  currentSchool?: string;
  currentGrade?: string;
  tahfidzAchievements: string[];
  lastMemorizedSurah: string;
  characterBadges: string[];
  graduationDate: string;
  certificateQrHash: string;
  wishesSubmittedCount: number;
  referralsCount: number;
  activeStatus: 'ACTIVE_ALUMNI' | 'HONORARY';
  legacyTreeLeavesCount: number;
}

export type WishCategory = 'DOA_ADIK_KELAS' | 'SYUKUR_GURU' | 'CITA_CITA' | 'HARAPAN_MADRASAH';

export interface AlumniWishTreeItem {
  id: string;
  alumniId: string;
  alumniName: string;
  graduationYear: number;
  cohortName: string;
  doaText: string;
  category: WishCategory;
  createdAt: string;
  blessingCount: number;
  leafTone: 'gold' | 'emerald' | 'amber' | 'teal';
  isPinned?: boolean;
}

export interface AlumniReunionEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'REUNI_AKBAR' | 'SILATURAHMI_GURU' | 'SHARING_SD' | 'KARYA_BAKTI';
  bannerUrl: string;
  attendeesCount: number;
  isRsvpOpen: boolean;
  userRsvpd?: boolean;
}

export interface FamilyRelationMember {
  id: string;
  name: string;
  roleType: 'ALUMNI_KAKAK' | 'MURID_AKTIF' | 'CALON_PPDB_SEPUPU';
  relationLabel: string;
  classOrYear: string;
  avatar?: string;
  gender: 'L' | 'P';
  statusBadge: string;
  nisnOrRegNo?: string;
  currentMilestone?: string;
}

export interface FamilyTreeData {
  id: string;
  familyName: string;
  parentUid: string;
  parentName: string;
  parentPhone: string;
  address: string;
  totalChildrenInAsySyifa: number;
  members: FamilyRelationMember[];
}

export interface AlumniReferralRecord {
  id: string;
  alumniUid: string;
  alumniName: string;
  referralCode: string;
  applicantName: string;
  applicantPhone: string;
  applicantGender: 'L' | 'P';
  programInterest: 'TK A' | 'TK B' | 'PAUD TPA';
  status: 'TERDAFTAR' | 'TERVERIFIKASI' | 'DITERIMA';
  rewardBadgeGranted: string;
  submittedAt: string;
  verifiedAt?: string;
}

export interface ReferralRewardSummary {
  totalShared: number;
  totalRegistered: number;
  totalAccepted: number;
  goldenLeavesEarned: number;
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
    level: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  }[];
}

export interface SDTransitionChecklistItem {
  id: string;
  title: string;
  category: 'KEMANDIRIAN' | 'ADAB_IBADAH' | 'CALISTUNG_QURANI' | 'SOSIALISASI';
  description: string;
  recommendation: string;
  isCompleted: boolean;
}

export interface SDTransitionPrayer {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  meaning: string;
  context: string;
}

export interface SDTransitionParentTip {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  quote: string;
}

export interface SDPartnerSchool {
  id: string;
  name: string;
  type: 'SDIT' | 'MI' | 'SDN_FAVORIT';
  address: string;
  distance: string;
  accreditation: string;
  characteristics: string[];
  contactPhone: string;
  websiteUrl?: string;
  alumniCountEnrolled: number;
}

export interface LegacyForestCohort {
  year: number;
  cohortNumber: number;
  cohortName: string;
  motto: string;
  totalGraduates: number;
  totalJuzMemorized: number;
  treeGrowthStage: 'SEED' | 'SAPLING' | 'BLOOMING' | 'MAJESTIC_GOLDEN';
  featuredProjects: string[];
  coreValues: string[];
  groupPhotoUrl: string;
  valedictorian: string;
  wishesCount: number;
}
