export type LicenseType =
  | 'TRIAL'
  | 'RENTAL'
  | 'SUBSCRIPTION'
  | 'LIFETIME'
  | 'DEMO'
  | 'ENTERPRISE';

export type PolicyType =
  | 'TRIAL_30'
  | 'TRIAL_90'
  | 'TRIAL_180'
  | 'ANNUAL_RENTAL'
  | 'MULTI_YEAR_RENTAL'
  | 'LIFETIME'
  | 'FOUNDATION_LICENSE'
  | 'ENTERPRISE_LICENSE';

export type LicenseState =
  | 'NOT_ACTIVATED'
  | 'TRIAL'
  | 'ACTIVE'
  | 'GRACE_PERIOD'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'READ_ONLY';

export interface LicensePolicyConfig {
  id: PolicyType;
  label: string;
  licenseType: LicenseType;
  durationDays: number;
  gracePeriodDays: number;
  maxSchoolsAllowed: number;
  allowCustomBranding: boolean;
  allowMultiTenant: boolean;
  isLifetime: boolean;
  description: string;
}

export const LICENSE_POLICIES: Record<PolicyType, LicensePolicyConfig> = {
  TRIAL_30: {
    id: 'TRIAL_30',
    label: 'Trial 30 Hari (Evaluasi Standar)',
    licenseType: 'TRIAL',
    durationDays: 30,
    gracePeriodDays: 7,
    maxSchoolsAllowed: 1,
    allowCustomBranding: false,
    allowMultiTenant: false,
    isLifetime: false,
    description: 'Lisensi uji coba 30 hari untuk evaluasi fitur dasar SIM TK ASY SYIFA.'
  },
  TRIAL_90: {
    id: 'TRIAL_90',
    label: 'Trial 90 Hari (Evaluasi Semester)',
    licenseType: 'TRIAL',
    durationDays: 90,
    gracePeriodDays: 14,
    maxSchoolsAllowed: 1,
    allowCustomBranding: true,
    allowMultiTenant: false,
    isLifetime: false,
    description: 'Lisensi uji coba 1 semester penuh (90 hari) dengan pendampingan fitur AI Asy.'
  },
  TRIAL_180: {
    id: 'TRIAL_180',
    label: 'Trial 180 Hari (Evaluasi Tahun Ajaran)',
    licenseType: 'TRIAL',
    durationDays: 180,
    gracePeriodDays: 14,
    maxSchoolsAllowed: 1,
    allowCustomBranding: true,
    allowMultiTenant: false,
    isLifetime: false,
    description: 'Lisensi uji coba setengah tahun ajaran untuk pengujian komprehensif.'
  },
  ANNUAL_RENTAL: {
    id: 'ANNUAL_RENTAL',
    label: 'Sewa Tahunan (Annual Rental / Subscription)',
    licenseType: 'RENTAL',
    durationDays: 365,
    gracePeriodDays: 30,
    maxSchoolsAllowed: 1,
    allowCustomBranding: true,
    allowMultiTenant: false,
    isLifetime: false,
    description: 'Lisensi sewa berlangganan 1 tahun ajaran lengkap termasuk seluruh fitur R1-R55 & W1-W26.'
  },
  MULTI_YEAR_RENTAL: {
    id: 'MULTI_YEAR_RENTAL',
    label: 'Sewa Multi-Tahun (3 Tahun Multi-Year)',
    licenseType: 'SUBSCRIPTION',
    durationDays: 1095,
    gracePeriodDays: 30,
    maxSchoolsAllowed: 1,
    allowCustomBranding: true,
    allowMultiTenant: false,
    isLifetime: false,
    description: 'Lisensi sewa 3 tahun ajaran dengan prioritas dukungan teknis & garansi pembaruan TADE.'
  },
  LIFETIME: {
    id: 'LIFETIME',
    label: 'Lisensi Seumur Hidup (Lifetime License)',
    licenseType: 'LIFETIME',
    durationDays: 36500, // 100 years
    gracePeriodDays: 30,
    maxSchoolsAllowed: 1,
    allowCustomBranding: true,
    allowMultiTenant: false,
    isLifetime: true,
    description: 'Hak guna lisensi permanen tanpa batas waktu untuk TK ASY SYIFA.'
  },
  FOUNDATION_LICENSE: {
    id: 'FOUNDATION_LICENSE',
    label: 'Lisensi Yayasan (Multi-School Foundation)',
    licenseType: 'ENTERPRISE',
    durationDays: 365,
    gracePeriodDays: 30,
    maxSchoolsAllowed: 10,
    allowCustomBranding: true,
    allowMultiTenant: true,
    isLifetime: false,
    description: 'Lisensi khusus Yayasan Pengelola Sekolah Islam untuk beberapa unit TK/PAUD.'
  },
  ENTERPRISE_LICENSE: {
    id: 'ENTERPRISE_LICENSE',
    label: 'Lisensi Enterprise Kemenag / Wilayah',
    licenseType: 'ENTERPRISE',
    durationDays: 365,
    gracePeriodDays: 60,
    maxSchoolsAllowed: 100,
    allowCustomBranding: true,
    allowMultiTenant: true,
    isLifetime: false,
    description: 'Lisensi tingkat Enterprise untuk konsorsium sekolah Islam dan dinas terkait.'
  }
};
