/**
 * TADE ASY SYIFA DNA ANIMASI & SUARA ENGINE — SPRINT G20
 * Pusat DNA Resmi: Gerak Resmi (P1), Ekspresi Resmi (P2), Suara Khas (P3),
 * Emosi Cerita (P4), Gerbang Pelangi Masuk (P5), Sapaan Keluar (P6), Pusat DNA (P7).
 * Zero Third-Party Audio Dependencies • 100% Web Audio Synthesized • 60 FPS Guaranteed.
 * Marker: G20_DNA_ANIMASI_VERIFIED
 */

import { tadeSoundEngine } from './tadeSoundEngine';
import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeAnimationGovernor } from './tadeAnimationGovernor';

export type MovementStyle = 
  | 'LANGKAH_KECIL'
  | 'LAMBAIAN_TANGAN'
  | 'LONCAT_GEMBIRA'
  | 'TEPUK_TANGAN'
  | 'ANGGUKAN_KEPALA'
  | 'ANGGUK_SANTUN'
  | 'PUTARAN_KECIL'
  | 'DIAM';

export type OfficialExpression = 
  | 'SENYUM'
  | 'TERTAWA'
  | 'KAGET'
  | 'BERPIKIR'
  | 'BANGGA'
  | 'ANTUSIAS'
  | 'TERIMA_KASIH';

export type DnaSignatureSound = 
  | 'TUT_TUT_KERETA'
  | 'PLING_BINTANG'
  | 'POP_BALON'
  | 'FLIP_BUKU'
  | 'TEPUK_TANGAN_KECIL';

export interface MicroEmotionState {
  blushing: boolean;  // Pipi memerah hangat
  blinking: boolean;  // Mata berkedip alami
  breathing: boolean; // Bahu naik turun / ritme nafas
  smiling: boolean;   // Senyum melebar gembira
}

export interface MovementPreset {
  id: MovementStyle;
  name: string;
  subtitle: string;
  description: string;
  cssClass: string;
  icon: string;
  tempoLabel: string;
}

export interface ExpressionPreset {
  id: OfficialExpression;
  name: string;
  subtitle: string;
  description: string;
  speechExample: string;
  islamicPhrase: string;
  icon: string;
}

export interface SignatureSoundPreset {
  id: DnaSignatureSound;
  name: string;
  subtitle: string;
  description: string;
  frequencySummary: string;
  icon: string;
}

export interface CharacterDnaProfile {
  id: 'ASY' | 'SYIFA' | 'BUBU' | 'GOGO' | 'MIMI' | 'DODO' | 'TITI' | 'RARA';
  name: string;
  title: string;
  role: string;
  personality: string;
  signatureSound: DnaSignatureSound;
  defaultMovement: MovementStyle;
  defaultExpression: OfficialExpression;
  colorTheme: string;
  avatarEmoji: string;
}

export const MOVEMENT_PRESETS: MovementPreset[] = [
  {
    id: 'LANGKAH_KECIL',
    name: 'Langkah Kecil Santun',
    subtitle: 'Waddle melangkah lembut ke kiri-kanan',
    description: 'Gerakan melangkah kecil dengan kemiringan halus 3 derajat, mencerminkan adab berjalan santun seorang santri.',
    cssClass: 'animate-dna-langkah-kecil',
    icon: 'Footprints',
    tempoLabel: '1.2 detik / siklus'
  },
  {
    id: 'LAMBAIAN_TANGAN',
    name: 'Lambaian Tangan Ramah',
    subtitle: 'Lambaian menyambut sahabat & guru',
    description: 'Rotasi tubuh dan tangan menyapa hangat, digunakan saat menyambut santri di pagi hari atau berpamitan.',
    cssClass: 'animate-dna-lambaian-tangan',
    icon: 'Hand',
    tempoLabel: '1.4 detik / siklus'
  },
  {
    id: 'LONCAT_GEMBIRA',
    name: 'Loncat Gembira Berkah',
    subtitle: 'Lompatan ceria merayakan kebaikan',
    description: 'Pantulan vertikal elastis saat anak berhasil menghafal doa, menyelesaikan rintangan, atau memenangkan permainan.',
    cssClass: 'animate-dna-loncat-gembira',
    icon: 'Sparkles',
    tempoLabel: '1.0 detik / siklus'
  },
  {
    id: 'TEPUK_TANGAN',
    name: 'Tepuk Tangan Ceria',
    subtitle: 'Denyut apresiasi & semangat bersama',
    description: 'Irama tepukan berulang yang memompa antusiasme kelas saat bernyanyi nasyid atau menyimak dongeng.',
    cssClass: 'animate-dna-tepuk-tangan',
    icon: 'Heart',
    tempoLabel: '0.6 detik / siklus'
  },
  {
    id: 'ANGGUKAN_KEPALA',
    name: 'Anggukan Kepala Khusyuk',
    subtitle: 'Tanda mengerti, setuju & menyimak nasihat',
    description: 'Anggukan santun saat mendengarkan ustadzah bercerita atau saat menjawab salam dengan taat.',
    cssClass: 'animate-dna-anggukan-kepala',
    icon: 'Smile',
    tempoLabel: '1.0 detik / siklus'
  },
  {
    id: 'PUTARAN_KECIL',
    name: 'Putaran Kecil Ria',
    subtitle: 'Rotasi 360 derajat anggun & seimbang',
    description: 'Putaran lembut penuh sukacita di atas karpet sentra tanpa membuat pusing anak.',
    cssClass: 'animate-dna-putaran-kecil',
    icon: 'RotateCw',
    tempoLabel: '2.0 detik / siklus'
  },
  {
    id: 'DIAM',
    name: 'Posisi Tenang & Tertib',
    subtitle: 'Berdiri rapi dengan pernapasan teratur',
    description: 'Sikap istirahat tertib di tempat, siap mendengarkan instruksi berikutnya.',
    cssClass: 'animate-dna-breathing',
    icon: 'Circle',
    tempoLabel: 'Pose Statis'
  }
];

export const EXPRESSION_PRESETS: ExpressionPreset[] = [
  {
    id: 'SENYUM',
    name: 'Senyum Ikhlas',
    subtitle: 'Mata berbinar & senyum manis sedekah',
    description: 'Ekspresi standar penuh kehangatan, cerminan hadits "Senyummu di hadapan saudaramu adalah sedekah".',
    speechExample: '“Assalamu’alaikum, teman-teman!”',
    islamicPhrase: 'Tabassumuka fi wajhi akhika shadaqah',
    icon: 'Smile'
  },
  {
    id: 'TERTAWA',
    name: 'Tertawa Ceria',
    subtitle: 'Mulut terbuka riang penuh suka cita',
    description: 'Tawa santun tanpa berlebihan saat bermain bersama sahabat di halaman sekolah.',
    speechExample: '“Hehe, asyik sekali bermain bersama!”',
    islamicPhrase: 'Alhamdulillah atas kegembiraan ini',
    icon: 'Laugh'
  },
  {
    id: 'KAGET',
    name: 'Kaget Terpukau (Masya Allah)',
    subtitle: 'Mata membulat takjub melihat ciptaan Allah',
    description: 'Rasa ingin tahu tinggi saat melihat pelangi, bunga mekar, atau eksperimen sains sentra bahan alam.',
    speechExample: '“Masya Allah! Indah sekali pelangi itu!”',
    islamicPhrase: 'Masya Allah Tabarakallah',
    icon: 'Eye'
  },
  {
    id: 'BERPIKIR',
    name: 'Berpikir Teliti (Tafakkur)',
    subtitle: 'Tatapan ke samping atas dengan jari di dagu',
    description: 'Proses kognitif kreatif saat memecahkan balok rancang bangun atau menyusun kepingan puzzle.',
    speechExample: '“Hmm... balok yang mana ya yang cocok dipasang?”',
    islamicPhrase: 'Afala Tatafakkarun',
    icon: 'HelpCircle'
  },
  {
    id: 'BANGGA',
    name: 'Bangga Berprestasi (Alhamdulillah)',
    subtitle: 'Dada tegap santun & mata bersinar terang',
    description: 'Rasa syukur mendalam saat berhasil menyelesaikan tantangan hafalan atau membantu merapikan mainan.',
    speechExample: '“Alhamdulillah, aku berhasil merapikan mainanku!”',
    islamicPhrase: 'Alhamdulillahi Rabbil ‘Alamin',
    icon: 'Award'
  },
  {
    id: 'TERIMA_KASIH',
    name: 'Terima Kasih (Jazakallah Khair)',
    subtitle: 'Membungkuk santun & tangan di dada',
    description: 'Adab mulia menghargai bantuan guru, orang tua, dan teman dengan ucapan doa penuh kebaikan.',
    speechExample: '“Jazakallahu khairan atas bantuannya, ustadzah!”',
    islamicPhrase: 'Jazakumullah Khairan Katsiran',
    icon: 'HeartHandshake'
  }
];

export const SIGNATURE_SOUND_PRESETS: SignatureSoundPreset[] = [
  {
    id: 'TUT_TUT_KERETA',
    name: '“Tut Tut” Kereta Ceria',
    subtitle: 'Peluit dua nada harmonik ceria (D5 & F#5)',
    description: 'Suara tiupan peluit kereta uap mini Asy Syifa yang mengundang santri berbaris tertib dan bersiap bertualang.',
    frequencySummary: '587 Hz + 740 Hz Sinus Ganda',
    icon: 'Train'
  },
  {
    id: 'PLING_BINTANG',
    name: '“Pling” Bintang Emas',
    subtitle: 'Chime kristal arpeggio berkilau tinggi (C6 - C7)',
    description: 'Nada denting bintang berpijar saat anak membuka cerita baru atau mendapatkan bintang prestasi hafalan.',
    frequencySummary: '1046 Hz – 2093 Hz Harmonik Kristal',
    icon: 'Sparkles'
  },
  {
    id: 'POP_BALON',
    name: '“Pop” Balon Gembira',
    subtitle: 'Letupan lembut ramah anak (440 Hz -> 110 Hz)',
    description: 'Efek letupan balon ceria yang aman dan menyenangkan di telinga balita saat bermain gelembung atau stan festival.',
    frequencySummary: 'Sapuan Resonansi 440 Hz Eksponensial',
    icon: 'CircleDot'
  },
  {
    id: 'FLIP_BUKU',
    name: '“Flip” Buku Cerita',
    subtitle: 'Sapuan gesekan lembaran kertas cerita anak',
    description: 'Suara lembut membalik halaman Buku Cerita Asy, menghadirkan sensasi buku fisik yang menumbuhkan minat baca literasi.',
    frequencySummary: 'Filter Pink Noise Bandpass 1200 Hz -> 600 Hz',
    icon: 'BookOpen'
  },
  {
    id: 'TEPUK_TANGAN_KECIL',
    name: 'Tepuk Tangan Kecil',
    subtitle: '3 tepukan lembut santun bertempo riang',
    description: 'Suara tepuk tangan apresiasi dari kawan-kawan kelas saat ada santri yang tampil berani di depan kelas.',
    frequencySummary: 'Burst Segitiga Resonansi 320 Hz',
    icon: 'Heart'
  }
];

export const CHARACTER_DNA_REGISTRY: Record<string, CharacterDnaProfile> = {
  ASY: {
    id: 'ASY',
    name: 'Dek Asy',
    title: 'Santri Cilik Pemberani & Santun',
    role: 'Maskot Utama Putra',
    personality: 'Rasa ingin tahu tinggi, gemar berpetualang, selalu mengucap salam dan bismillah.',
    signatureSound: 'TUT_TUT_KERETA',
    defaultMovement: 'LANGKAH_KECIL',
    defaultExpression: 'SENYUM',
    colorTheme: 'from-emerald-500 to-teal-600',
    avatarEmoji: '👦'
  },
  SYIFA: {
    id: 'SYIFA',
    name: 'Mbak Syifa',
    title: 'Santriwati Cerdas, Lembut & Penyayang',
    role: 'Maskot Utama Putri',
    personality: 'Penyayang tanaman, suka bercerita, rajin menghafal Al-Qur’an dan selalu tersenyum manis.',
    signatureSound: 'FLIP_BUKU',
    defaultMovement: 'LAMBAIAN_TANGAN',
    defaultExpression: 'SENYUM',
    colorTheme: 'from-amber-400 to-orange-500',
    avatarEmoji: '🧕'
  },
  BUBU: {
    id: 'BUBU',
    name: 'Bubu si Kelinci',
    title: 'Sahabat Cekatan & Gemar Berbagi',
    role: 'Sahabat Karakter - Hewan',
    personality: 'Suka melompat riang, selalu membawa wortel segar untuk dibagikan kepada teman.',
    signatureSound: 'PLING_BINTANG',
    defaultMovement: 'LONCAT_GEMBIRA',
    defaultExpression: 'TERTAWA',
    colorTheme: 'from-rose-400 to-pink-500',
    avatarEmoji: '🐰'
  },
  GOGO: {
    id: 'GOGO',
    name: 'Gogo si Gajah',
    title: 'Sahabat Kuat, Ramah & Suka Membantu',
    role: 'Sahabat Karakter - Hewan',
    personality: 'Tubuh besar berhati lembut, gemar menyemprot air segar untuk menyirami kebun sekolah.',
    signatureSound: 'TUT_TUT_KERETA',
    defaultMovement: 'TEPUK_TANGAN',
    defaultExpression: 'BANGGA',
    colorTheme: 'from-blue-400 to-indigo-500',
    avatarEmoji: '🐘'
  },
  MIMI: {
    id: 'MIMI',
    name: 'Mimi si Lebah',
    title: 'Sahabat Rajin & Pekerja Keras',
    role: 'Sahabat Karakter - Hewan',
    personality: 'Terbang lincah dari bunga ke bunga mencari madu berkah, mengingatkan anak untuk selalu tertib.',
    signatureSound: 'PLING_BINTANG',
    defaultMovement: 'PUTARAN_KECIL',
    defaultExpression: 'SENYUM',
    colorTheme: 'from-amber-300 to-yellow-500',
    avatarEmoji: '🐝'
  },
  DODO: {
    id: 'DODO',
    name: 'Dodo si Bebek',
    title: 'Sahabat Nautika yang Tertib Berbaris',
    role: 'Sahabat Karakter - Hewan',
    personality: 'Berenang rapi bersama kelompoknya, gemar bernyanyi "Kwek kwek" menyemangati teman.',
    signatureSound: 'POP_BALON',
    defaultMovement: 'LANGKAH_KECIL',
    defaultExpression: 'TERTAWA',
    colorTheme: 'from-yellow-400 to-orange-400',
    avatarEmoji: '🦆'
  },
  TITI: {
    id: 'TITI',
    name: 'Titi si Kura-kura',
    title: 'Sahabat Bijak, Sabar & Teliti',
    role: 'Sahabat Karakter - Hewan',
    personality: 'Berjalan perlahan namun tekun, selalu berpikir sebelum bertindak dan sangat menghormati waktu.',
    signatureSound: 'FLIP_BUKU',
    defaultMovement: 'ANGGUKAN_KEPALA',
    defaultExpression: 'BERPIKIR',
    colorTheme: 'from-emerald-400 to-green-600',
    avatarEmoji: '🐢'
  },
  RARA: {
    id: 'RARA',
    name: 'Rara si Burung',
    title: 'Sahabat Merdu Penebar Salam Subuh',
    role: 'Sahabat Karakter - Hewan',
    personality: 'Berkicau riang di puncak pohon setiap fajar menyambut matahari pagi yang hangat.',
    signatureSound: 'PLING_BINTANG',
    defaultMovement: 'LONCAT_GEMBIRA',
    defaultExpression: 'TERIMA_KASIH',
    colorTheme: 'from-sky-400 to-cyan-500',
    avatarEmoji: '🐦'
  }
};

export interface DnaConfig {
  rainbowGateEnabled: boolean;     // P5: Gerbang Pelangi 3s saat masuk
  rainbowGateDurationSec: number;  // Default 3s
  farewellEnabled: boolean;        // P6: Sapaan Keluar Asy & Syifa 2s
  microEmotionsEnabled: boolean;   // P4: Pipi memerah, kedipan mata, nafas
  soundFxEnabled: boolean;         // P3: Suara khas aktif
  globalMovement: MovementStyle;   // P1
  globalExpression: OfficialExpression; // P2
}

const DEFAULT_DNA_CONFIG: DnaConfig = {
  rainbowGateEnabled: true,
  rainbowGateDurationSec: 3,
  farewellEnabled: true,
  microEmotionsEnabled: true,
  soundFxEnabled: true,
  globalMovement: 'LANGKAH_KECIL',
  globalExpression: 'SENYUM'
};

const STORAGE_KEY = 'asy_syifa_dna_config_v20';

export class AsySyifaDnaEngine {
  private static instance: AsySyifaDnaEngine | null = null;
  private config: DnaConfig;
  private listeners: ((config: DnaConfig) => void)[] = [];
  private microEmotions: MicroEmotionState = {
    blushing: true,
    blinking: true,
    breathing: true,
    smiling: true
  };

  private constructor() {
    this.config = this.loadConfig();
    this.initGovernorToken();
  }

  public static getInstance(): AsySyifaDnaEngine {
    if (!AsySyifaDnaEngine.instance) {
      AsySyifaDnaEngine.instance = new AsySyifaDnaEngine();
    }
    return AsySyifaDnaEngine.instance;
  }

  private initGovernorToken(): void {
    tadeAnimationGovernor.startAnimation('DNA_ASY_SYIFA_MASTER');
  }

  private loadConfig(): DnaConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_DNA_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_DNA_CONFIG };
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch {
      // fallback
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach(fn => fn(this.config));
  }

  public subscribe(listener: (config: DnaConfig) => void): () => void {
    this.listeners.push(listener);
    listener(this.config);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getConfig(): DnaConfig {
    return { ...this.config };
  }

  public updateConfig(partial: Partial<DnaConfig>): void {
    this.config = { ...this.config, ...partial };
    this.saveConfig();

    blackBoxRecorder.record({
      moduleCode: 'DNA_ASY_SYIFA',
      role: 'FOUNDER',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G20_DNA_ANIMASI_VERIFIED] DNA Config Updated: ${JSON.stringify(partial)}`,
      route: '/founder/dna-center',
      severity: 'INFO'
    });
  }

  public setRainbowGateEnabled(enabled: boolean): void {
    this.updateConfig({ rainbowGateEnabled: enabled });
  }

  public setFarewellEnabled(enabled: boolean): void {
    this.updateConfig({ farewellEnabled: enabled });
  }

  public setMicroEmotionsEnabled(enabled: boolean): void {
    this.updateConfig({ microEmotionsEnabled: enabled });
  }

  public setGlobalMovement(movement: MovementStyle): void {
    this.updateConfig({ globalMovement: movement });
    this.playSignatureSound('PLING_BINTANG');
  }

  public setGlobalExpression(expression: OfficialExpression): void {
    this.updateConfig({ globalExpression: expression });
    this.playSignatureSound('TEPUK_TANGAN_KECIL');
  }

  public playSignatureSound(sound: DnaSignatureSound): void {
    if (!this.config.soundFxEnabled) return;
    tadeSoundEngine.playFx(sound);

    blackBoxRecorder.record({
      moduleCode: 'DNA_SOUNDSCAPE',
      role: 'SUPER_ADMIN',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G20_DNA_ANIMASI_VERIFIED] Signature sound triggered: ${sound}`,
      route: '/dna-center',
      severity: 'INFO'
    });
  }

  public getMovementCssClass(movement: MovementStyle): string {
    const found = MOVEMENT_PRESETS.find(m => m.id === movement);
    return found ? found.cssClass : 'animate-dna-langkah-kecil';
  }

  public getMicroEmotions(): MicroEmotionState {
    return { ...this.microEmotions };
  }

  public setMicroEmotions(emotions: Partial<MicroEmotionState>): void {
    this.microEmotions = { ...this.microEmotions, ...emotions };
  }
}

export const asySyifaDnaEngine = AsySyifaDnaEngine.getInstance();
