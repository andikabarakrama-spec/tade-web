/**
 * TADE RC101 — R831
 * Master Character Registry (Spesifikasi Resmi Founder Karakter Asy & Syifa)
 * 
 * KONSTITUSI MASTER CHARACTER LOCK:
 * - Seragam: Krem-Putih dengan Aksen Oranye & Lis Hijau Zamrud
 * - Peci: Hitam Zamrud (Asy)
 * - Hijab: Pastel Anggun Menutup Dada (Syifa)
 * - Wajah: Mata bulat berbinar, pipi merona hangat (blush), proporsi Chibi 2.5 kepala
 * - Warna Kulit: Kuning langsat cerah khas anak Indonesia
 * - Sifat: Dilarang mengubah proporsi atau membuat ulang wajah tanpa otorisasi Founder
 */

export interface MasterCharacterSpec {
  id: 'ASY_MALE' | 'SYIFA_FEMALE';
  canonicalName: string;
  gender: 'LAKI_LAKI' | 'PEREMPUAN';
  roleTitle: string;
  headToBodyRatio: string; // '2.5 heads (Chibi preschool aesthetic)'
  uniform: {
    baseColor: string; // '#FFF8EE' (Krem-Putih Santri)
    accentColor: string; // '#F97316' (Oranye Ceria Asy)
    trimColor: string; // '#059669' (Hijau Zamrud Islami)
    bottomsColor: string; // '#064E3B' (Celana/Rok Hijau Tua)
  };
  headwear: {
    type: 'PECI_HITAM_ZAMRUD' | 'HIJAB_PASTEL';
    color: string;
    details: string;
  };
  facialFeatures: {
    eyeShape: 'ROUND_SPARKLING';
    eyeColor: '#1E293B';
    eyebrowStyle: 'FRIENDLY_CURVED';
    cheeks: 'ROSY_BLUSH_WARM' | '#F43F5E33';
    smileExpression: 'CHEERFUL_WARM';
  };
  signaturePoses: string[];
  svgIconDataUri: string;
  isLockedByFounder: boolean;
  version: string;
}

export const MASTER_CHARACTERS: Record<'ASY' | 'SYIFA', MasterCharacterSpec> = {
  ASY: {
    id: 'ASY_MALE',
    canonicalName: 'Asy (Mascot Santri Utama)',
    gender: 'LAKI_LAKI',
    roleTitle: 'Sahabat Belajar & Pemandu Santri',
    headToBodyRatio: '2.5:1 (Chibi Proporsi Emas PAUD)',
    uniform: {
      baseColor: '#FFFBF5', // Krem Putih
      accentColor: '#F97316', // Oranye Ceria
      trimColor: '#059669', // Hijau Zamrud
      bottomsColor: '#064E3B' // Celana Hijau Tua
    },
    headwear: {
      type: 'PECI_HITAM_ZAMRUD',
      color: '#0F172A',
      details: 'Peci hitam klasik dengan lis zamrud keemasan'
    },
    facialFeatures: {
      eyeShape: 'ROUND_SPARKLING',
      eyeColor: '#1E293B',
      eyebrowStyle: 'FRIENDLY_CURVED',
      cheeks: 'ROSY_BLUSH_WARM',
      smileExpression: 'CHEERFUL_WARM'
    },
    signaturePoses: [
      'Ngintip dari sudut kartu',
      'Merapikan peci zamrud',
      'Membaca Iqro di karpet kelas',
      'Mengejar kupu-kupu taman',
      'Duduk santai sambil menggoyang kaki',
      'Melambaikan tangan ceria'
    ],
    svgIconDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FFFBF5" stroke="%23F97316" stroke-width="4"/><circle cx="50" cy="48" r="32" fill="%23FFE4D6"/><rect x="26" y="20" width="48" height="18" rx="6" fill="%230F172A"/><circle cx="40" cy="46" r="4" fill="%231E293B"/><circle cx="60" cy="46" r="4" fill="%231E293B"/><circle cx="34" cy="54" r="5" fill="%23F43F5E" fill-opacity="0.3"/><circle cx="66" cy="54" r="5" fill="%23F43F5E" fill-opacity="0.3"/><path d="M44 56 Q50 62 56 56" stroke="%23B91C1C" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
    isLockedByFounder: true,
    version: 'v8.1.0-RC101'
  },
  SYIFA: {
    id: 'SYIFA_FEMALE',
    canonicalName: 'Syifa (Mascot Santri Putri)',
    gender: 'PEREMPUAN',
    roleTitle: 'Sahabat Hati & Teladan Akhlak',
    headToBodyRatio: '2.5:1 (Chibi Proporsi Emas PAUD)',
    uniform: {
      baseColor: '#FFFBF5', // Krem Putih
      accentColor: '#F97316', // Oranye Ceria
      trimColor: '#059669', // Hijau Zamrud
      bottomsColor: '#064E3B' // Rok Hijau Tua
    },
    headwear: {
      type: 'HIJAB_PASTEL',
      color: '#FDE68A', // Kuning Pastel Lembut
      details: 'Jilbab menutup dada dengan bros bunga melati zamrud'
    },
    facialFeatures: {
      eyeShape: 'ROUND_SPARKLING',
      eyeColor: '#1E293B',
      eyebrowStyle: 'FRIENDLY_CURVED',
      cheeks: 'ROSY_BLUSH_WARM',
      smileExpression: 'CHEERFUL_WARM'
    },
    signaturePoses: [
      'Memegang ujung hijab santun',
      'Membaca Juz Amma',
      'Memeluk boneka beruang mini',
      'Tersenyum ramah menyapa wali murid',
      'Menata buku cerita perpustakaan'
    ],
    svgIconDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FFFBF5" stroke="%23F97316" stroke-width="4"/><circle cx="50" cy="48" r="32" fill="%23FFE4D6"/><path d="M22 28 Q50 12 78 28 Q84 76 50 82 Q16 76 22 28 Z" fill="%23FDE68A"/><circle cx="50" cy="48" r="22" fill="%23FFE4D6"/><circle cx="42" cy="46" r="3.5" fill="%231E293B"/><circle cx="58" cy="46" r="3.5" fill="%231E293B"/><circle cx="36" cy="53" r="4" fill="%23F43F5E" fill-opacity="0.35"/><circle cx="64" cy="53" r="4" fill="%23F43F5E" fill-opacity="0.35"/><path d="M45 55 Q50 60 55 55" stroke="%23B91C1C" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    isLockedByFounder: true,
    version: 'v8.1.0-RC101'
  }
};

export class MasterCharacterRegistry {
  private static instance: MasterCharacterRegistry;

  private constructor() {}

  public static getInstance(): MasterCharacterRegistry {
    if (!MasterCharacterRegistry.instance) {
      MasterCharacterRegistry.instance = new MasterCharacterRegistry();
    }
    return MasterCharacterRegistry.instance;
  }

  public getCharacter(type: 'ASY' | 'SYIFA'): MasterCharacterSpec {
    return MASTER_CHARACTERS[type];
  }

  public getAllCharacters(): MasterCharacterSpec[] {
    return [MASTER_CHARACTERS.ASY, MASTER_CHARACTERS.SYIFA];
  }

  public isLocked(): boolean {
    return true;
  }
}
