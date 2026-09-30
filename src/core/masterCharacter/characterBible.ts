/**
 * TADE v9.1.0-MCA1 — R911
 * MASTER CHARACTER CANON BIBLE (Asy & Syifa)
 * 
 * Konstitusi Kanon Karakter Resmi Perguruan Islam Tunas Adab Mulia:
 * 1. Proporsi Anatomi Emas: 2.5 Kepala (Chibi Islamic Aesthetic PAUD/TK).
 * 2. Warna Resmi Identitas:
 *    - Base Seragam: Krem-Putih Santri (#FFFBF5)
 *    - Aksen Utama: Oranye Ceria (#F97316)
 *    - Lis Zamrud Islami: Hijau Zamrud (#059669)
 *    - Bawahan Santri: Hijau Hutan Khidmat (#064E3B)
 *    - Peci Asy: Hitam Onyx (#0F172A) dengan ornamen lis emas zamrud
 *    - Hijab Syifa: Pastel Rosy Warm (#FDA4AF) & Sage Green (#6EE7B7) syar'i menutup dada
 * 3. Aturan Busana Syar'i:
 *    - Asy: Baju koko santri rapi, celana/sarung panjang sopan di atas mata kaki, peci hitam terpasang tegak.
 *    - Syifa: Gamis santriwati anggun longgar, hijab syar'i menutup dada tanpa lekuk, tanpa perhiasan berlebihan.
 * 4. Aturan Ekspresi & Adab:
 *    - Selalu menampilkan wajah berbinar (sparkling eyes), pipi merona hangat (rosy blush), senyum ramah meneduhkan.
 *    - Dilarang berekspresi kasar, marah, licik, atau tidak mencerminkan akhlakul karimah.
 * 5. Larangan Mutlak (Zero Alternate Mascot Policy):
 *    - Dilarang membuat karakter maskot pengganti atau maskot pihak ketiga.
 *    - Dilarang mendistorsi proporsi 2.5 kepala menjadi realistik dewasa atau kartun non-islami.
 */

export interface CharacterProportionSpec {
  ratio: '2.5:1' | string;
  headHeightPercent: number; // 40% of total height
  bodyHeightPercent: number; // 35% of total height
  limbsHeightPercent: number; // 25% of total height
  eyeToFaceRatio: number; // 0.28 (mata bulat besar berbinar)
  blushIntensity: number; // 0.65
  description: string;
}

export interface CharacterColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  backgroundTonal: string;
  skinTone: string;
  skinShadow: string;
  eyeColor: string;
  blushColor: string;
  headwearColor: string;
  headwearAccent: string;
  bottomsColor: string;
  shoeColor: string;
}

export interface CharacterAdabRules {
  clothingStandard: string;
  headwearRule: string;
  gazeStandard: string;
  prohibitedPoses: string[];
  approvedPoses: string[];
}

export interface CanonicalCharacterDefinition {
  id: 'ASY' | 'SYIFA';
  fullName: string;
  callName: string;
  gender: 'LAKI_LAKI' | 'PEREMPUAN';
  personality: string;
  spiritualRole: string;
  proportion: CharacterProportionSpec;
  palette: CharacterColorPalette;
  adab: CharacterAdabRules;
  lockedByFounder: boolean;
  version: string;
}

export const CANON_PROPORTION: CharacterProportionSpec = {
  ratio: '2.5:1',
  headHeightPercent: 40,
  bodyHeightPercent: 35,
  limbsHeightPercent: 25,
  eyeToFaceRatio: 0.28,
  blushIntensity: 0.65,
  description: 'Golden Chibi Ratio (2.5 Kepala) — Menghadirkan kesan ramah, bersahabat, fitrah anak usia dini, dan penuh keceriaan santri cilik.'
};

export const ASY_PALETTE: CharacterColorPalette = {
  primary: '#059669', // Emerald Green Zamrud
  secondary: '#F97316', // Orange Ceria
  accent: '#FBBF24', // Gold Keemasan
  backgroundTonal: '#ECFDF5',
  skinTone: '#FDE047', // Kuning Langsat Hangat Cerah (#FEF08A / #FDE047 blended)
  skinShadow: '#FBBF24',
  eyeColor: '#0F172A', // Mata Hitam Pekat Berbinar
  blushColor: '#F43F5E33', // Merona Lembut
  headwearColor: '#0F172A', // Peci Hitam Onyx
  headwearAccent: '#10B981', // Lis Zamrud
  bottomsColor: '#064E3B', // Celana Hijau Tua Santri
  shoeColor: '#334155'
};

export const SYIFA_PALETTE: CharacterColorPalette = {
  primary: '#EC4899', // Rose Pastel Anggun
  secondary: '#10B981', // Emerald Halus
  accent: '#A855F7', // Lilac Ungu Lembut
  backgroundTonal: '#FDF2F8',
  skinTone: '#FEF08A', // Kuning Langsat Cerah
  skinShadow: '#FDE047',
  eyeColor: '#1E293B',
  blushColor: '#FB718544',
  headwearColor: '#FDA4AF', // Hijab Pastel Menutup Dada
  headwearAccent: '#F43F5E',
  bottomsColor: '#047857', // Gamis Syar'i Lembut
  shoeColor: '#475569'
};

export const ASY_CANON: CanonicalCharacterDefinition = {
  id: 'ASY',
  fullName: 'Asy-Syatibi Al-Muaddib (Asy)',
  callName: 'Asy',
  gender: 'LAKI_LAKI',
  personality: 'Cerdas, periang, rajin menghafal Al-Qur\'an, antusias memandu teman-teman belajar sains & adab islami.',
  spiritualRole: 'Sahabat Belajar Santri Cilik & Duta Keceriaan Tunas Adab',
  proportion: CANON_PROPORTION,
  palette: ASY_PALETTE,
  adab: {
    clothingStandard: 'Baju Koko Santri Krem (#FFFBF5) berlis zamrud, celana panjang sopan hijau tua di atas mata kaki.',
    headwearRule: 'Peci hitam songkok santri terpasang rapi dengan lis zamrud keemasan, melambangkan adab penuntut ilmu.',
    gazeStandard: 'Mata berbinar kontak hangat dengan pengguna, senyum ceria tanpa congkak.',
    prohibitedPoses: [
      'Pose congkak / angkuh / menjulurkan lidah liar',
      'Pose tanpa peci resmi',
      'Pose bertelanjang dada / celana pendek di atas lutut',
      'Pose agresif atau menakut-nakuti santri'
    ],
    approvedPoses: [
      'wave (melambaikan tangan ramah menyapa)',
      'point (menunjuk menu belajar dengan antusias)',
      'read-iqro (memegang mushaf/buku iqro)',
      'pray-hands (posisi berdoa khusyuk)',
      'thumbs-up (memberi apresiasi santri berprestasi)',
      'swing-feet (duduk santai mengayunkan kaki saat jeda)'
    ]
  },
  lockedByFounder: true,
  version: 'v9.1.0-MCA1'
};

export const SYIFA_CANON: CanonicalCharacterDefinition = {
  id: 'SYIFA',
  fullName: 'Syifa Al-Marwah (Syifa)',
  callName: 'Syifa',
  gender: 'PEREMPUAN',
  personality: 'Lembut, teliti, gemar membaca kisah para nabi, penyayang alam, dan penuh ketenangan budi pekerti.',
  spiritualRole: 'Sahabat Teladan Adab, Hafizhah Cilik & Pandu Galeri Kreativitas',
  proportion: CANON_PROPORTION,
  palette: SYIFA_PALETTE,
  adab: {
    clothingStandard: 'Gamis santriwati anggun longgar warna krem-hijau pastel tanpa potongan ketat.',
    headwearRule: 'Hijab pastel syar\'i menutup dada rapi, tanpa helai rambut terurai keluar.',
    gazeStandard: 'Mata ramah meneduhkan dengan senyum tulus santun.',
    prohibitedPoses: [
      'Pose tanpa hijab syar\'i resmi',
      'Pakaian ketat atau transparan',
      'Pose berjoget berlebihan / tabarruj',
      'Pose membelakangi pengguna dengan tidak sopan'
    ],
    approvedPoses: [
      'wave (melambaikan tangan anggun)',
      'butterfly (bermain dengan kupu-kupu galeri seni)',
      'read-mushaf (tadarus qur\'an tartil)',
      'smile-shy (tersenyum ramah sopan)',
      'curtsy-adab (hormat santun kepada guru & orang tua)',
      'explain-gentle (menjelaskan panduan dengan tenang)'
    ]
  },
  lockedByFounder: true,
  version: 'v9.1.0-MCA1'
};

export const MASTER_CHARACTER_BIBLE = {
  manifestVersion: 'v9.1.0-MCA1',
  founderLockStatus: 'MUTLAK_TERKUNCI',
  characters: {
    ASY: ASY_CANON,
    SYIFA: SYIFA_CANON
  },
  canonLaw: [
    'Hukum I: Karakter resmi Tunas Adab hanya Asy dan Syifa.',
    'Hukum II: Proporsi anatomi tidak boleh menyimpang dari 2.5 kepala.',
    'Hukum III: Busana wajib memenuhi syariat Islam dan adab kesantrian.',
    'Hukum IV: Seluruh ekspresi dan gerakan wajib memancarkan optimisme dan keceriaan anak saleh/salehah.',
    'Hukum V: Segala bentuk maskot alternatif dilarang keras dan ditolak oleh MasterCharacterGuard.'
  ]
};
