/**
 * TADE RC100 — R827
 * Mesin Karakter Hidup (Living Mascot Behavioral Engine & Bank Tingkah)
 * 
 * Karakter Asy/Syifa hidup dengan Bank Tingkah ekspresif:
 * - ngintip (peeking)
 * - mengejar_kupu_kupu (chasing butterflies)
 * - duduk_di_kartu (sitting on card)
 * - menggoyang_kaki (swinging legs)
 * - merapikan_peci (adjusting peci cap)
 * - memegang_ujung_hijab (holding hijab corner)
 * - memeluk_boneka_kecil (hugging mini teddy)
 * - membaca_iqra (reading iqra book)
 * - melambaikan_tangan (waving)
 */

export type MascotBehaviorType = 
  | 'NGINTIP'
  | 'MENGEJAR_KUPU_KUPU'
  | 'DUDUK_DI_KARTU'
  | 'MENGGOYANG_KAKI'
  | 'MERAPIKAN_PECI'
  | 'MEMEGANG_UJUNG_HIJAB'
  | 'MEMELUK_BONEKA_KECIL'
  | 'MEMBACA_IQRA'
  | 'MELAMBAIKAN_TANGAN'
  | 'IDLE_BREATHING';

export interface MascotBehaviorDefinition {
  id: MascotBehaviorType;
  title: string;
  category: 'PLAYFUL' | 'ISLAMIC_HABIT' | 'RESTING' | 'INTERACTIVE';
  description: string;
  dialogueSnippet: string;
  svgPoseKey: string;
  energyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  cpuImpact: '<0.1% CPU';
  durationSeconds: number;
}

export const MASCOT_BEHAVIOR_BANK: MascotBehaviorDefinition[] = [
  {
    id: 'NGINTIP',
    title: 'Ngintip dari Sudut Layar',
    category: 'PLAYFUL',
    description: 'Asy muncul separuh badan dari tepi kanan/bawah layar dengan mata berbinar penasaran.',
    dialogueSnippet: 'Cilukba! Sedang asyik input nilai santri ya, Ustadzah?',
    svgPoseKey: 'peek_corner',
    energyLevel: 'LOW',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 4
  },
  {
    id: 'MENGEJAR_KUPU_KUPU',
    title: 'Mengejar Kupu-Kupu Taman',
    category: 'PLAYFUL',
    description: 'Asy melompat kecil dengan riang mengikuti kupu-kupu warna zamrud yang melintas.',
    dialogueSnippet: 'Wah ada kupu-kupu cantik di halaman TK Asy Syifa!',
    svgPoseKey: 'chase_butterfly',
    energyLevel: 'HIGH',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 5
  },
  {
    id: 'DUDUK_DI_KARTU',
    title: 'Duduk Santai di Atas Kartu',
    category: 'RESTING',
    description: 'Asy duduk manis di atas garis pembatas kartu data dengan kaki menjuntai.',
    dialogueSnippet: 'Asy temani di sini ya, biar belajarnya makin semangat!',
    svgPoseKey: 'sit_edge',
    energyLevel: 'LOW',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 8
  },
  {
    id: 'MENGGOYANG_KAKI',
    title: 'Menggoyang Kaki Bahagia',
    category: 'PLAYFUL',
    description: 'Sambil duduk santai, Asy mengayun-ayunkan kedua kakinya dengan irama ceria.',
    dialogueSnippet: 'Alhamdulillah, hari ini santri-santri sholeh dan sholehah semua!',
    svgPoseKey: 'swing_legs',
    energyLevel: 'LOW',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 6
  },
  {
    id: 'MERAPIKAN_PECI',
    title: 'Merapikan Peci Zamrud',
    category: 'ISLAMIC_HABIT',
    description: 'Asy mengangkat kedua tangan kecilnya untuk membetulkan letak peci hitam zamrudnya agar rapi.',
    dialogueSnippet: 'Peci rapi, senyum manis, siap menyambut ustadz dan ustadzah!',
    svgPoseKey: 'adjust_peci',
    energyLevel: 'MEDIUM',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 4
  },
  {
    id: 'MEMEGANG_UJUNG_HIJAB',
    title: 'Memegang Ujung Hijab Cantik (Syifa)',
    category: 'ISLAMIC_HABIT',
    description: 'Syifa tersenyum malu-malu sambil memegang ujung jilbab pastelnya dengan anggun.',
    dialogueSnippet: 'Menutup aurat dengan rapi membuat hati tenang dan sejuk.',
    svgPoseKey: 'hold_hijab',
    energyLevel: 'LOW',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 5
  },
  {
    id: 'MEMELUK_BONEKA_KECIL',
    title: 'Memeluk Boneka Beruang Kecil',
    category: 'PLAYFUL',
    description: 'Asy memeluk erat boneka beruang mininya sambil tersenyum nyaman.',
    dialogueSnippet: 'Menyayangi sesama dan merawat barang mainan itu perbuatan terpuji.',
    svgPoseKey: 'hug_teddy',
    energyLevel: 'LOW',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 6
  },
  {
    id: 'MEMBACA_IQRA',
    title: 'Membaca Buku Iqro / Juz Amma',
    category: 'ISLAMIC_HABIT',
    description: 'Asy duduk bersila memegang buku Iqro kecil sambil menggerakkan bibir melafalkan huruf hijaiyah.',
    dialogueSnippet: 'Alif, Ba, Ta, Tsa... Ayo kita rajin mengaji setiap hari!',
    svgPoseKey: 'read_iqra',
    energyLevel: 'MEDIUM',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 7
  },
  {
    id: 'MELAMBAIKAN_TANGAN',
    title: 'Melambaikan Tangan Ceria',
    category: 'INTERACTIVE',
    description: 'Asy melambaikan tangan ceria ke arah layar menyapa pengguna.',
    dialogueSnippet: 'Ahlan wa Sahlan di SIM TK Asy Syifa!',
    svgPoseKey: 'wave_hand',
    energyLevel: 'MEDIUM',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 3
  },
  {
    id: 'IDLE_BREATHING',
    title: 'Nafas Tenang & Kedipan Mata',
    category: 'RESTING',
    description: 'Gerakan dasar halus bernafas alami dan berkedip sesekali tanpa menguras baterai.',
    dialogueSnippet: 'Asy selalu siaga mendampingi aktivitas sekolah.',
    svgPoseKey: 'idle_natural',
    energyLevel: 'LOW',
    cpuImpact: '<0.1% CPU',
    durationSeconds: 10
  }
];

export class LivingCharacterEngine {
  private static instance: LivingCharacterEngine;
  private currentBehavior: MascotBehaviorDefinition;
  private isAutoCycleEnabled: boolean = true;
  private listeners: Array<(behavior: MascotBehaviorDefinition) => void> = [];

  private constructor() {
    this.currentBehavior = MASCOT_BEHAVIOR_BANK[0];
  }

  public static getInstance(): LivingCharacterEngine {
    if (!LivingCharacterEngine.instance) {
      LivingCharacterEngine.instance = new LivingCharacterEngine();
    }
    return LivingCharacterEngine.instance;
  }

  public getCurrentBehavior(): MascotBehaviorDefinition {
    return this.currentBehavior;
  }

  public triggerBehavior(id: MascotBehaviorType): MascotBehaviorDefinition {
    const found = MASCOT_BEHAVIOR_BANK.find(b => b.id === id) || MASCOT_BEHAVIOR_BANK[0];
    this.currentBehavior = found;
    this.notify();
    return found;
  }

  public triggerRandomBehavior(): MascotBehaviorDefinition {
    const pool = MASCOT_BEHAVIOR_BANK.filter(b => b.id !== this.currentBehavior.id);
    const selected = pool[Math.floor(Math.random() * pool.length)];
    this.currentBehavior = selected;
    this.notify();
    return selected;
  }

  public toggleAutoCycle(): boolean {
    this.isAutoCycleEnabled = !this.isAutoCycleEnabled;
    return this.isAutoCycleEnabled;
  }

  public isAutoCycling(): boolean {
    return this.isAutoCycleEnabled;
  }

  public getAllBehaviors(): MascotBehaviorDefinition[] {
    return [...MASCOT_BEHAVIOR_BANK];
  }

  public subscribe(listener: (behavior: MascotBehaviorDefinition) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.currentBehavior));
  }
}
