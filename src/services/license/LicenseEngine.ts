import { LicensePolicyConfig, LICENSE_POLICIES, LicenseState, LicenseType, PolicyType } from './LicensePolicy';
import { LicenseAuditEngine } from './LicenseAuditEngine';
import { LicenseNotificationEngine, LicenseReminderNotification } from './LicenseNotificationEngine';
import { LicenseIntegrityEngine } from './LicenseIntegrityEngine';

export interface EnterpriseLicense {
  licenseId: string;
  schoolId: string;
  schoolName: string;
  foundationName: string;
  activationDate: string; // ISO String
  expirationDate: string; // ISO String
  gracePeriodDays: number;
  policyType: PolicyType;
  licenseType: LicenseType;
  status: LicenseState;
  issuedBy: string;
  signature: string;
  checksum: string;
  maxUsers: number;
  watermarkEnabled: boolean;
  lastUpdated: string;
}

export type SafeModeOperation =
  | 'LOGIN'
  | 'VIEW'
  | 'SEARCH'
  | 'BACKUP'
  | 'EXPORT'
  | 'ACTIVATE_LICENSE'
  | 'CREATE'
  | 'EDIT'
  | 'DELETE'
  | 'SYSTEM_SETTINGS'
  | 'APPROVAL'
  | 'PUBLISH_DOC';

const STORAGE_KEY_LICENSE = 'TADE_ENTERPRISE_LICENSE_CONFIG';

class LicenseEngineClass {
  private currentLicenseCache: EnterpriseLicense | null = null;

  /**
   * Helper to create default official license for TK ASY SYIFA
   */
  private getDefaultLicense(): EnterpriseLicense {
    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(now.getFullYear() + 1); // 1 year default

    return {
      licenseId: 'TADE-LIC-2026-ASY-SYIFA-ENTERPRISE',
      schoolId: 'SCH-ASY-001',
      schoolName: 'TK ASY SYIFA',
      foundationName: 'Yayasan Asy Syifa',
      activationDate: now.toISOString(),
      expirationDate: expiry.toISOString(),
      gracePeriodDays: 30,
      policyType: 'ENTERPRISE_LICENSE',
      licenseType: 'ENTERPRISE',
      status: 'ACTIVE',
      issuedBy: 'Super Admin Pusat AI Studio TADE',
      signature: 'SIG-TADE-V105-ASY-998877665544332211',
      checksum: 'CHK-SHA256-ASY-SYIFATAN-SECURE-998877',
      maxUsers: 500,
      watermarkEnabled: false,
      lastUpdated: now.toISOString()
    };
  }

  /**
   * Fetch current license with real-time status calculation
   */
  public getLicense(): EnterpriseLicense {
    if (!this.currentLicenseCache) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_LICENSE);
        if (raw) {
          this.currentLicenseCache = JSON.parse(raw);
        } else {
          this.currentLicenseCache = this.getDefaultLicense();
          this.saveLicense(this.currentLicenseCache);
        }
      } catch (e) {
        console.error('Failed to load license from storage', e);
        this.currentLicenseCache = this.getDefaultLicense();
      }
    }

    // Re-evaluate live status based on current timestamp
    if (this.currentLicenseCache) {
      const calculatedStatus = this.calculateStatus(this.currentLicenseCache);
      if (calculatedStatus !== this.currentLicenseCache.status) {
        const prev = this.currentLicenseCache.status;
        this.currentLicenseCache.status = calculatedStatus;
        this.currentLicenseCache.lastUpdated = new Date().toISOString();
        this.saveLicense(this.currentLicenseCache);

        LicenseAuditEngine.addLog({
          operator: 'SYSTEM_LICENSE_MONITOR',
          action: calculatedStatus === 'READ_ONLY' ? 'EXPIRED' : 'GRACE_ENTERED',
          previousStatus: prev,
          newStatus: calculatedStatus,
          policyType: this.currentLicenseCache.policyType,
          details: `Perubahan otomatis status lisensi menjadi ${calculatedStatus}.`
        });
      }
    }

    return this.currentLicenseCache!;
  }

  /**
   * Save license to persistent storage
   */
  private saveLicense(license: EnterpriseLicense): void {
    this.currentLicenseCache = license;
    try {
      localStorage.setItem(STORAGE_KEY_LICENSE, JSON.stringify(license));
    } catch (e) {
      console.error('Failed to save license to localStorage', e);
    }
  }

  /**
   * Calculate exact days remaining until expiration
   */
  public calculateDaysRemaining(license?: EnterpriseLicense): number {
    const lic = license || this.getLicense();
    const expiry = new Date(lic.expirationDate).getTime();
    const now = new Date().getTime();
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Compute live status based on dates & manual flags
   */
  public calculateStatus(license: EnterpriseLicense): LicenseState {
    if (license.status === 'SUSPENDED') {
      return 'SUSPENDED';
    }

    const days = this.calculateDaysRemaining(license);

    if (days > 0) {
      return license.licenseType === 'TRIAL' ? 'TRIAL' : 'ACTIVE';
    }

    // In Grace Period if within gracePeriodDays past expiry
    const pastDays = Math.abs(days);
    if (pastDays <= license.gracePeriodDays) {
      return 'GRACE_PERIOD';
    }

    // Past Grace Period -> Read Only Safe Mode
    return 'READ_ONLY';
  }

  /**
   * Safe Mode & Fail Safe Operation Checker:
   * Expired licenses & tampered states must NEVER delete data!
   * Block creation/edits/deletions, but ALLOW logins, views, search, backup & exports.
   */
  public isOperationAllowed(operation: SafeModeOperation): boolean {
    const lic = this.getLicense();
    const status = lic.status;

    // Check security report for tamper or integrity violation
    const secReport = LicenseIntegrityEngine.evaluateSecurityReport(lic);
    if (!secReport.integrityValid) {
      // FAIL SAFE MODE: Strictly allow non-mutating view/search/backup/export operations
      const failSafeAllowed: SafeModeOperation[] = [
        'LOGIN',
        'VIEW',
        'SEARCH',
        'BACKUP',
        'EXPORT',
        'ACTIVATE_LICENSE'
      ];
      return failSafeAllowed.includes(operation);
    }

    // Normal active or trial licenses allow all operations
    if (status === 'ACTIVE' || status === 'TRIAL') {
      return true;
    }

    // Grace Period allows operations with warning banners
    if (status === 'GRACE_PERIOD') {
      return true;
    }

    // SAFE MODE (READ_ONLY or EXPIRED or SUSPENDED)
    const safeAllowed: SafeModeOperation[] = [
      'LOGIN',
      'VIEW',
      'SEARCH',
      'BACKUP',
      'EXPORT',
      'ACTIVATE_LICENSE'
    ];

    return safeAllowed.includes(operation);
  }

  /**
   * Generate encrypted-style Enterprise License Key payload string
   */
  public generateLicenseKey(
    policyType: PolicyType,
    schoolName: string = 'TK ASY SYIFA',
    foundationName: string = 'Yayasan Asy Syifa'
  ): string {
    const policy = LICENSE_POLICIES[policyType];
    const timestamp = Date.now();
    const rawPayload = {
      p: policyType,
      s: schoolName,
      f: foundationName,
      d: policy.durationDays,
      g: policy.gracePeriodDays,
      u: policy.maxSchoolsAllowed * 50,
      t: timestamp,
      sig: `SIG-TADE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };

    return btoa(JSON.stringify(rawPayload));
  }

  /**
   * Activate / Redeem a generated Enterprise License Key
   */
  public activateLicenseKey(
    keyString: string,
    operator: string = 'SUPER_ADMIN'
  ): { success: boolean; message: string } {
    try {
      const decoded = JSON.parse(atob(keyString.trim()));
      if (!decoded.p || !LICENSE_POLICIES[decoded.p as PolicyType]) {
        return { success: false, message: 'Format Kunci Lisensi Enterprise Tidak Valid!' };
      }

      const policy: LicensePolicyConfig = LICENSE_POLICIES[decoded.p as PolicyType];
      const now = new Date();
      const expiry = new Date();
      expiry.setDate(now.getDate() + policy.durationDays);

      const current = this.getLicense();
      const prevStatus = current.status;

      const updatedLicense: EnterpriseLicense = {
        ...current,
        licenseId: `TADE-LIC-${now.getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        schoolName: decoded.s || current.schoolName,
        foundationName: decoded.f || current.foundationName,
        activationDate: now.toISOString(),
        expirationDate: expiry.toISOString(),
        gracePeriodDays: policy.gracePeriodDays,
        policyType: policy.id,
        licenseType: policy.licenseType,
        status: policy.licenseType === 'TRIAL' ? 'TRIAL' : 'ACTIVE',
        issuedBy: `Super Admin (${operator})`,
        signature: 'SIG-TADE-V105-TEMP',
        checksum: 'CHK-SHA256-ASY-TEMP',
        maxUsers: decoded.u || 500,
        watermarkEnabled: policy.licenseType === 'TRIAL',
        lastUpdated: now.toISOString()
      };

      updatedLicense.checksum = LicenseIntegrityEngine.computeChecksum(updatedLicense);
      updatedLicense.signature = LicenseIntegrityEngine.computeSignature(updatedLicense);

      this.saveLicense(updatedLicense);

      LicenseAuditEngine.addLog({
        operator,
        action: 'ACTIVATED',
        previousStatus: prevStatus,
        newStatus: updatedLicense.status,
        policyType: policy.id,
        details: `Lisensi ${policy.label} berhasil diaktifkan hingga ${expiry.toLocaleDateString('id-ID')}.`
      });

      return {
        success: true,
        message: `Lisensi ${policy.label} Berhasil Diaktifkan! Berlaku hingga ${expiry.toLocaleDateString('id-ID')}.`
      };
    } catch (e) {
      return { success: false, message: 'Gagal menguraikan kunci lisensi. Pastikan kode unik yang dimasukkan benar.' };
    }
  }

  /**
   * Direct Renewal / Extension of active license by days
   */
  public renewLicense(extensionDays: number = 365, operator: string = 'SUPER_ADMIN'): void {
    const lic = this.getLicense();
    const currentExpiry = new Date(lic.expirationDate);
    const now = new Date();

    // If already expired, calculate from today. Otherwise extend existing expiry date.
    const baseDate = currentExpiry > now ? currentExpiry : now;
    baseDate.setDate(baseDate.getDate() + extensionDays);

    const prevStatus = lic.status;
    const updated: EnterpriseLicense = {
      ...lic,
      expirationDate: baseDate.toISOString(),
      status: lic.licenseType === 'TRIAL' ? 'TRIAL' : 'ACTIVE',
      lastUpdated: now.toISOString()
    };

    this.saveLicense(updated);

    LicenseAuditEngine.addLog({
      operator,
      action: 'RENEWED',
      previousStatus: prevStatus,
      newStatus: updated.status,
      policyType: updated.policyType,
      details: `Perpanjangan lisensi sebanyak ${extensionDays} hari. Tanggal kadaluarsa baru: ${baseDate.toLocaleDateString('id-ID')}.`
    });
  }

  /**
   * Suspend License (Super Admin capability)
   */
  public suspendLicense(operator: string = 'SUPER_ADMIN', reason: string = 'Penangguhan Lisensi oleh Pengurus'): void {
    const lic = this.getLicense();
    const prevStatus = lic.status;

    const updated: EnterpriseLicense = {
      ...lic,
      status: 'SUSPENDED',
      lastUpdated: new Date().toISOString()
    };

    this.saveLicense(updated);

    LicenseAuditEngine.addLog({
      operator,
      action: 'SUSPENDED',
      previousStatus: prevStatus,
      newStatus: 'SUSPENDED',
      policyType: lic.policyType,
      details: `Lisensi ditangguhkan. Alasan: ${reason}`
    });
  }

  /**
   * Reactivate Suspended License
   */
  public reactivateLicense(operator: string = 'SUPER_ADMIN'): void {
    const lic = this.getLicense();
    const prevStatus = lic.status;
    const computed = this.calculateStatus({ ...lic, status: 'ACTIVE' });

    const updated: EnterpriseLicense = {
      ...lic,
      status: computed,
      lastUpdated: new Date().toISOString()
    };

    this.saveLicense(updated);

    LicenseAuditEngine.addLog({
      operator,
      action: 'ACTIVATED',
      previousStatus: prevStatus,
      newStatus: computed,
      policyType: lic.policyType,
      details: 'Pemulihan lisensi dari status penangguhan (Suspended).'
    });
  }

  /**
   * Get Notification evaluation
   */
  public getNotification(): LicenseReminderNotification {
    const lic = this.getLicense();
    const days = this.calculateDaysRemaining(lic);
    return LicenseNotificationEngine.evaluateNotification(days, lic.status, lic.schoolName);
  }

  /**
   * Toggle or set watermark flag manually (Super Admin)
   */
  public setWatermarkEnabled(enabled: boolean): void {
    const lic = this.getLicense();
    const updated = { ...lic, watermarkEnabled: enabled };
    this.saveLicense(updated);
  }
}

export const LicenseEngine = new LicenseEngineClass();
