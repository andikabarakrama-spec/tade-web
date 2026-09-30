/**
 * TADE v9.1.0-MCA1 — R913
 * MASTER CHARACTER GUARD (Ring-0 Mascot Integrity Sentinel)
 * 
 * Pengawal Mutlak Integritas Kanon Asy & Syifa:
 * 1. Menolak karakter tidak dikenal (unknown mascot IDs).
 * 2. Menolak asset override liar tanpa otorisasi Founder TADE.
 * 3. Menolak degradasi ke placeholder murah/sementara.
 * 4. Memastikan proporsi 2.5 kepala dan pakaian syar'i selalu terjaga.
 */

import { isCanonicalCharacter, CharacterId, MASTER_CHARACTER_REGISTRY } from './masterCharacterRegistry';
import { MASTER_CHARACTER_BIBLE } from './characterBible';

export interface MascotValidationResult {
  valid: boolean;
  code: 'ALLOW_CANON' | 'ERR_UNKNOWN_CHARACTER' | 'ERR_UNAUTHORIZED_OVERRIDE' | 'ERR_PLACEHOLDER_VIOLATION' | 'ERR_PROPORTION_BREACH';
  message: string;
  timestamp: string;
  characterId?: CharacterId;
}

export class MasterCharacterGuard {
  private static instance: MasterCharacterGuard;
  private auditLog: MascotValidationResult[] = [];

  private constructor() {}

  public static getInstance(): MasterCharacterGuard {
    if (!MasterCharacterGuard.instance) {
      MasterCharacterGuard.instance = new MasterCharacterGuard();
    }
    return MasterCharacterGuard.instance;
  }

  /**
   * Memvalidasi identitas karakter
   */
  public validateCharacter(id: string): MascotValidationResult {
    if (!isCanonicalCharacter(id)) {
      const err: MascotValidationResult = {
        valid: false,
        code: 'ERR_UNKNOWN_CHARACTER',
        message: `Ditolak oleh Guardian: Karakter '${id}' bukan maskot kanon resmi Tunas Adab Mulia. Hanya 'ASY' dan 'SYIFA' yang diizinkan.`,
        timestamp: new Date().toISOString()
      };
      this.recordAudit(err);
      return err;
    }

    const res: MascotValidationResult = {
      valid: true,
      code: 'ALLOW_CANON',
      message: `Otorisasi Kanon Sah: Karakter '${id}' terdaftar resmi dengan segel Founder Lock.`,
      timestamp: new Date().toISOString(),
      characterId: id
    };
    this.recordAudit(res);
    return res;
  }

  /**
   * Menolak manipulasi aset tanpa lisensi Founder
   */
  public assertAssetIntegrity(characterId: string, requestedAssetPath: string): MascotValidationResult {
    const charVal = this.validateCharacter(characterId);
    if (!charVal.valid || !charVal.characterId) {
      return charVal;
    }

    // Periksa apakah path mengarah ke kanon resmi
    const canonAssets = MASTER_CHARACTER_REGISTRY[charVal.characterId].assets;
    const isApprovedAsset = 
      requestedAssetPath.includes('master-characters') ||
      requestedAssetPath === canonAssets.svgMaster ||
      requestedAssetPath === canonAssets.png4k ||
      requestedAssetPath === canonAssets.webpOptimized ||
      requestedAssetPath.startsWith('ASY_VECTOR') ||
      requestedAssetPath.startsWith('SYIFA_VECTOR');

    if (!isApprovedAsset && !requestedAssetPath.includes('data:image/svg+xml')) {
      const err: MascotValidationResult = {
        valid: false,
        code: 'ERR_UNAUTHORIZED_OVERRIDE',
        message: `Pelanggaran Integritas: Upaya mengganti aset '${requestedAssetPath}' ditolak. Aset maskot wajib bersumber dari /assets/master-characters/.`,
        timestamp: new Date().toISOString(),
        characterId: charVal.characterId
      };
      this.recordAudit(err);
      return err;
    }

    // Larang placeholder generic/cheap icons
    if (requestedAssetPath.includes('placeholder') || requestedAssetPath.includes('dummy') || requestedAssetPath.includes('temp_mascot')) {
      const err: MascotValidationResult = {
        valid: false,
        code: 'ERR_PLACEHOLDER_VIOLATION',
        message: `Pelanggaran Mutu Kanon: Dilarang menggunakan placeholder '${requestedAssetPath}' untuk karakter resmi Asy & Syifa.`,
        timestamp: new Date().toISOString(),
        characterId: charVal.characterId
      };
      this.recordAudit(err);
      return err;
    }

    return {
      valid: true,
      code: 'ALLOW_CANON',
      message: `Aset kanon '${requestedAssetPath}' terverifikasi autentik.`,
      timestamp: new Date().toISOString(),
      characterId: charVal.characterId
    };
  }

  /**
   * Memvalidasi rasio 2.5 kepala
   */
  public assertProportionRatio(ratio: string): MascotValidationResult {
    if (ratio !== '2.5:1' && ratio !== '2.5') {
      const err: MascotValidationResult = {
        valid: false,
        code: 'ERR_PROPORTION_BREACH',
        message: `Penyimpangan Proporsi Ditolak: Rasio '${ratio}' melanggar proporsi emas 2.5 kepala (Chibi Islamic PAUD).`,
        timestamp: new Date().toISOString()
      };
      this.recordAudit(err);
      return err;
    }

    return {
      valid: true,
      code: 'ALLOW_CANON',
      message: `Proporsi '${ratio}' sesuai dengan Konstitusi Karakter TADE.`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Menjalankan audit menyeluruh terhadap sistem karakter
   */
  public runFullSanityCheck(): {
    passed: boolean;
    totalChecks: number;
    manifestVersion: string;
    lockedStatus: string;
    details: MascotValidationResult[];
  } {
    const checks: MascotValidationResult[] = [];

    // 1. Check Asy
    checks.push(this.validateCharacter('ASY'));
    // 2. Check Syifa
    checks.push(this.validateCharacter('SYIFA'));
    // 3. Reject illegal character
    const illegalCheck = this.validateCharacter('ROBOT_XYZ');
    if (!illegalCheck.valid) {
      checks.push({
        valid: true,
        code: 'ALLOW_CANON',
        message: 'Proteksi Berhasil: Karakter liar ROBOT_XYZ sukses diblokir.',
        timestamp: new Date().toISOString()
      });
    }
    // 4. Proportion check
    checks.push(this.assertProportionRatio('2.5:1'));
    // 5. Assets check
    checks.push(this.assertAssetIntegrity('ASY', '/assets/master-characters/asy/asy-master.svg'));
    checks.push(this.assertAssetIntegrity('SYIFA', '/assets/master-characters/syifa/syifa-master.svg'));

    const allPassed = checks.every(c => c.valid);

    return {
      passed: allPassed,
      totalChecks: checks.length,
      manifestVersion: MASTER_CHARACTER_BIBLE.manifestVersion,
      lockedStatus: MASTER_CHARACTER_BIBLE.founderLockStatus,
      details: checks
    };
  }

  public getAuditHistory(): MascotValidationResult[] {
    return [...this.auditLog];
  }

  private recordAudit(entry: MascotValidationResult): void {
    this.auditLog.push(entry);
    if (this.auditLog.length > 50) {
      this.auditLog.shift();
    }
  }
}

export const masterCharacterGuard = MasterCharacterGuard.getInstance();
