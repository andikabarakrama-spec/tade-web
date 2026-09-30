/**
 * TADE KAMPUNG CERIA SERVICE (SPRINT G17 — KAMPUNG CERIA ASY & SYIFA)
 * 
 * Manages:
 * P1 — Peta Kampung Ceria (12 Interactive Landmark nodes)
 * P2 — Rumah Sahabat (Bubu, Gogo, Mimi, Dodo, Titi, Rara, Asy, Syifa)
 * P3 — Taman Bermain (Ayunan, Perosotan, Jungkat-jungkit, Komidi, Terowongan, Bola Besar)
 * P4 — Pasar Ceria (Toko Buah, Toko Buku, Toko Balon, Toko Bunga)
 * P5 — Masjid Kampung (Doa Harian, Ucapan Jumat, Lentera Ramadhan, Lampu Malam)
 * P6 — Parade Sore (15-second joyful march across village)
 * P7 — Stiker Koleksi (12 Wholesome village badges, non-competitive)
 * 
 * Performance & Telemetry:
 * - Max 5 concurrent active animations (tadeAnimationGovernor)
 * - Dr. Pulse Telemetry compatible (60 FPS)
 * - Black Box Recorder (Ring 2) integrated
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeSoundEngine } from './tadeSoundEngine';

export interface KampungLocation {
  id: string;
  name: string;
  category: 'RUMAH' | 'FASILITAS' | 'TAMAN' | 'PASAR';
  icon: string;
  badgeColor: string;
  x: number; // percentage coordinates on cartoon map 0-100
  y: number; // percentage coordinates on cartoon map 0-100
  description: string;
  residentName?: string;
  houseStyle?: string;
  greeting?: string;
}

export interface SahabatProfile {
  id: string;
  name: string;
  species: string;
  houseType: string;
  houseEmoji: string;
  characterEmoji: string;
  themeColor: string;
  greeting: string;
  blessingWord: string;
  hobbies: string[];
}

export interface PlaygroundRide {
  id: string;
  name: string;
  emoji: string;
  description: string;
  actionWord: string;
  bgGradient: string;
}

export interface MarketStall {
  id: string;
  name: string;
  shopkeeper: string;
  emoji: string;
  themeColor: string;
  goods: { name: string; icon: string; quote: string }[];
  speechQuote: string;
}

export interface KampungSticker {
  id: string;
  name: string;
  emoji: string;
  rarity: 'UMUM' | 'SPESIAL' | 'EMAS_LANGKA';
  description: string;
  howToUnlock: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

const STORAGE_STICKERS_KEY = 'tade_g17_kampung_stickers_v1';
const STORAGE_VISITED_HOUSES_KEY = 'tade_g17_visited_houses_v1';

export class KampungCeriaService {
  private static instance: KampungCeriaService | null = null;

  private isParadeRunning: boolean = false;
  private paradeProgress: number = 0; // 0 to 100%
  private paradeTimer: any = null;
  private activeLocationId: string | null = null;
  private unlockedStickerIds: string[] = [];
  private visitedHouseIds: string[] = [];
  private listeners: (() => void)[] = [];

  public static getInstance(): KampungCeriaService {
    if (!KampungCeriaService.instance) {
      KampungCeriaService.instance = new KampungCeriaService();
    }
    return KampungCeriaService.instance;
  }

  private constructor() {
    this.loadStorage();
  }

  private loadStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const storedStickers = localStorage.getItem(STORAGE_STICKERS_KEY);
      if (storedStickers) {
        this.unlockedStickerIds = JSON.parse(storedStickers);
      } else {
        // Initial welcome stickers
        this.unlockedStickerIds = ['stk_asy', 'stk_masjid'];
      }

      const storedVisited = localStorage.getItem(STORAGE_VISITED_HOUSES_KEY);
      if (storedVisited) {
        this.visitedHouseIds = JSON.parse(storedVisited);
      }
    } catch {
      this.unlockedStickerIds = ['stk_asy', 'stk_masjid'];
    }
  }

  private saveStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_STICKERS_KEY, JSON.stringify(this.unlockedStickerIds));
      localStorage.setItem(STORAGE_VISITED_HOUSES_KEY, JSON.stringify(this.visitedHouseIds));
    } catch {
      // safe fallback
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  // --- P1: PETA KAMPUNG CERIA (LANDMARKS) ---
  public getKampungLocations(): KampungLocation[] {
    return [
      {
        id: 'loc_rumah_asy',
        name: 'Rumah Asy',
        category: 'RUMAH',
        icon: '🏡',
        badgeColor: 'bg-emerald-500 text-white',
        x: 48,
        y: 40,
        description: 'Rumah utama yang hangat, tempat Asy belajar Al-Qur’an dan menyambut sahabat.',
        residentName: 'Asy (Santri Cilik)',
        houseStyle: 'Rumah Tradisional Asri Beratap Hijau',
        greeting: '“Ahlan wa sahlan di Rumah Asy! Mari bersama menuntut ilmu dengan gembira.”'
      },
      {
        id: 'loc_rumah_syifa',
        name: 'Rumah Syifa',
        category: 'RUMAH',
        icon: '🌸',
        badgeColor: 'bg-pink-500 text-white',
        x: 32,
        y: 38,
        description: 'Rumah bernuansa bunga melati dengan taman kupu-kupu yang harum dan rapi.',
        residentName: 'Syifa (Santriwati Cilik)',
        houseStyle: 'Rumah Pastel Melati Beratap Rose',
        greeting: '“Assalamu’alaikum teman-teman! Yuk merawat bunga dan bersyukur atas nikmat Allah.”'
      },
      {
        id: 'loc_rumah_bubu',
        name: 'Rumah Bubu',
        category: 'RUMAH',
        icon: '🥕',
        badgeColor: 'bg-orange-500 text-white',
        x: 18,
        y: 28,
        description: 'Rumah berbentuk wortel oranye raksasa dengan pintu melengkung yang lucu.',
        residentName: 'Bubu si Kelinci Ceria',
        houseStyle: 'Rumah Wortel Bertingkat Dua',
        greeting: '“Hore! Bubu punya wortel segar dan teka-teki sholawat yang seru!”'
      },
      {
        id: 'loc_rumah_gogo',
        name: 'Rumah Gogo',
        category: 'RUMAH',
        icon: '🌳',
        badgeColor: 'bg-amber-700 text-white',
        x: 75,
        y: 25,
        description: 'Rumah panggung kokoh di atas pohon beringin rindang berhias lentera kayu.',
        residentName: 'Gogo si Sahabat Kuat',
        houseStyle: 'Rumah Pohon Beringin Rindang',
        greeting: '“Halo kawan! Dari atas pohon sini, pemandangan seluruh Kampung Ceria sangat indah!”'
      },
      {
        id: 'loc_rumah_mimi',
        name: 'Rumah Mimi',
        category: 'RUMAH',
        icon: '🌺',
        badgeColor: 'bg-yellow-500 text-slate-950',
        x: 82,
        y: 48,
        description: 'Rumah kubah kelopak bunga matahari yang harum dan dipenuhi kendi madu manis.',
        residentName: 'Mimi si Lebah Madu',
        houseStyle: 'Rumah Bunga Matahari Madu',
        greeting: '“Bzz... bzz... Madu kebaikan dan senyuman manis siap dibagikan untuk semua santri!”'
      },
      {
        id: 'loc_rumah_dodo',
        name: 'Rumah Dodo',
        category: 'RUMAH',
        icon: '🦆',
        badgeColor: 'bg-teal-500 text-white',
        x: 22,
        y: 65,
        description: 'Rumah perahu apung di tepi telaga dengan dermaga kayu mini tempat bebek berbaris.',
        residentName: 'Dodo si Bebek Mandiri',
        houseStyle: 'Rumah Tepi Kolam Telaga Bening',
        greeting: '“Kwek-kwek! Air telaga sejuk dan jernih, mari selalu menjaga kebersihan alam!”'
      },
      {
        id: 'loc_rumah_titi',
        name: 'Rumah Titi',
        category: 'RUMAH',
        icon: '🐢',
        badgeColor: 'bg-lime-600 text-white',
        x: 65,
        y: 72,
        description: 'Rumah batu bulat berlumut halus yang kokoh, sejuk, dan penuh buku kisah nabi.',
        residentName: 'Titi si Kura-kura Bijak',
        houseStyle: 'Rumah Batu Bulat Sejuk',
        greeting: '“Pelan tapi pasti, santri yang istiqomah akan menuai kesuksesan dunia dan akhirat.”'
      },
      {
        id: 'loc_rumah_rara',
        name: 'Rumah Rara',
        category: 'RUMAH',
        icon: '🦜',
        badgeColor: 'bg-purple-500 text-white',
        x: 88,
        y: 35,
        description: 'Rumah sangkar emas terbuka yang digantung di dahan pohon flamboyan merah.',
        residentName: 'Rara si Burung Merdu',
        houseStyle: 'Rumah Sangkar Cantik Terbuka',
        greeting: '“Cicit cuit! Kicauan sholawat di pagi hari membuat hati tenang dan damai.”'
      },
      {
        id: 'loc_masjid',
        name: 'Masjid Al-Barakah Mini',
        category: 'FASILITAS',
        icon: '🕌',
        badgeColor: 'bg-emerald-600 text-white',
        x: 52,
        y: 18,
        description: 'Masjid berkubah hijau tosca dengan menara mini dan lentera malam yang hangat.',
        houseStyle: 'Pusat Keberkahan & Doa Kampung Ceria',
        greeting: '“Mari awali setiap aktivitas dengan basmalah dan berdoa kepada Allah Subhanahu wa Ta’ala.”'
      },
      {
        id: 'loc_taman_bermain',
        name: 'Taman Bermain Pelangi',
        category: 'TAMAN',
        icon: '🎠',
        badgeColor: 'bg-amber-400 text-slate-950',
        x: 35,
        y: 52,
        description: 'Pusat wahana ceria santri: ayunan, perosotan, jungkat-jungkit, dan komidi putar.',
        houseStyle: 'Taman Luas Berumput Hijau Empuk',
        greeting: '“Bermain bersama sahabat dengan tertib, rukun, dan saling berbagi giliran!”'
      },
      {
        id: 'loc_kolam_bebek',
        name: 'Kolam Telaga Bening',
        category: 'TAMAN',
        icon: '🌊',
        badgeColor: 'bg-cyan-500 text-white',
        x: 15,
        y: 75,
        description: 'Danau jernih beriak lembut tempat ikan koi berenang dan teratai bermekaran.',
        houseStyle: 'Telaga Asri Berbatu Kerikil Halus',
        greeting: '“Menatap air telaga yang tenang mengajarkan kita untuk selalu berhati teduh.”'
      },
      {
        id: 'loc_stasiun',
        name: 'Stasiun Kereta Cerita',
        category: 'FASILITAS',
        icon: '🚂',
        badgeColor: 'bg-indigo-600 text-white',
        x: 70,
        y: 58,
        description: 'Pemberhentian lokomotif uap warna-warni yang membawa gerbong kisah teladan santri.',
        houseStyle: 'Stasiun Kereta Klasik Berlonceng Kuningan',
        greeting: '“Tuut tuut! Kereta Cerita siap memberangkatkan ananda ke petualangan ilmu!”'
      },
      {
        id: 'loc_pasar_ceria',
        name: 'Pasar Ceria Kampung',
        category: 'PASAR',
        icon: '🏪',
        badgeColor: 'bg-orange-600 text-white',
        x: 45,
        y: 72,
        description: 'Deretan kios kayu warna-warni: toko buah segar, buku cerita, balon dan bunga melati.',
        houseStyle: 'Pojok Ramah Berniaga Penuh Berkah',
        greeting: '“Pasar Ceria penuh warna! Asy dan sahabat suka membeli buah segar dan buku cerita.”'
      }
    ];
  }

  // --- P2: RUMAH SAHABAT PROFILES ---
  public getSahabatList(): SahabatProfile[] {
    return [
      {
        id: 'sahabat_bubu',
        name: 'Bubu',
        species: 'Kelinci Ceria',
        houseType: 'Rumah Wortel',
        houseEmoji: '🥕',
        characterEmoji: '🐰',
        themeColor: 'from-orange-400 to-amber-500',
        greeting: '“Assalamu’alaikum! Bubu baru saja panen wortel manis. Yuk makan sayur agar tubuh kuat!”',
        blessingWord: 'Gemar berbagi makanan sehat & suka membantu.',
        hobbies: ['Menanam sayur', 'Lompat ceria', 'Teka-teki angka']
      },
      {
        id: 'sahabat_gogo',
        name: 'Gogo',
        species: 'Sahabat Perkasa',
        houseType: 'Rumah Pohon Besar',
        houseEmoji: '🌳',
        characterEmoji: '🦍',
        themeColor: 'from-amber-700 to-amber-900',
        greeting: '“Halo sahabat! Gogo suka menjaga adik-adik saat bermain di taman. Hati yang kuat adalah hati yang sabar!”',
        blessingWord: 'Pemberani, santun, dan selalu melindungi sesama.',
        hobbies: ['Membaca buku di dahan', 'Olahraga pagi', 'Menjaga kebersihan']
      },
      {
        id: 'sahabat_mimi',
        name: 'Mimi',
        species: 'Lebah Madu Manis',
        houseType: 'Rumah Bunga Matahari',
        houseEmoji: '🌺',
        characterEmoji: '🐝',
        themeColor: 'from-yellow-400 to-amber-500',
        greeting: '“Bzz... Mimi membawa madu kebaikan! Seperti lebah, kita hanya mengambil yang baik dan memberi manfaat.”',
        blessingWord: 'Rajin bekerja, hemat, dan bertutur kata manis.',
        hobbies: ['Memetik nektar bunga', 'Menghafal doa', 'Menghias kelas']
      },
      {
        id: 'sahabat_dodo',
        name: 'Dodo',
        species: 'Bebek Telaga',
        houseType: 'Rumah Tepi Kolam',
        houseEmoji: '🦆',
        characterEmoji: '🐥',
        themeColor: 'from-teal-400 to-emerald-600',
        greeting: '“Kwek! Dodo selalu berbaris rapi bersama keluarga. Tertib dan antre adalah adab santri terpuji.”',
        blessingWord: 'Disiplin, suka antre tertib, dan cinta air bersih.',
        hobbies: ['Berenang beriringan', 'Merapikan sepatu', 'Senam irama']
      },
      {
        id: 'sahabat_titi',
        name: 'Titi',
        species: 'Kura-kura Bijak',
        houseType: 'Rumah Batu Bulat',
        houseEmoji: '🐢',
        characterEmoji: '🐢',
        themeColor: 'from-emerald-600 to-teal-800',
        greeting: '“Bismillah... Belajar tak perlu tergesa-gesa. Pelan, teliti, dan penuh pemahaman akan membawa barokah.”',
        blessingWord: 'Penyabar, teliti, dan kaya wawasan hikmah.',
        hobbies: ['Menyimak kisah Rasul', 'Menulis kaligrafi', 'Merawat kaktus']
      },
      {
        id: 'sahabat_rara',
        name: 'Rara',
        species: 'Burung Merdu',
        houseType: 'Rumah Sangkar Cantik Terbuka',
        houseEmoji: '🦜',
        characterEmoji: '🕊️',
        themeColor: 'from-purple-400 to-pink-500',
        greeting: '“Cicit cuit! Suara merdu terindah adalah lantunan ayat suci Al-Qur’an di waktu fajar.”',
        blessingWord: 'Pandai bersyair sholawat & berhati riang gembira.',
        hobbies: ['Muraja’ah hafalan', 'Menyanyi qasidah', 'Terbang pagi']
      }
    ];
  }

  public visitHouse(sahabatId: string): SahabatProfile | undefined {
    const list = this.getSahabatList();
    const sahabat = list.find(s => s.id === sahabatId);
    if (sahabat) {
      if (!this.visitedHouseIds.includes(sahabatId)) {
        this.visitedHouseIds.push(sahabatId);
        this.saveStorage();
      }

      // Check sticker unlock for visiting friend
      const stickerId = `stk_${sahabatId.replace('sahabat_', '')}`;
      this.unlockSticker(stickerId);

      tadeSoundEngine.playFx('MAGIC_SPARKLE');

      blackBoxRecorder.record({
        ring: 'RING_2',
        moduleCode: 'G17-RUMAH-SAHABAT',
        role: 'SANTRI',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Santri berkunjung ke ${sahabat.houseType} milik ${sahabat.name} (${sahabat.species})`
      });

      this.notify();
    }
    return sahabat;
  }

  // --- P3: TAMAN BERMAIN RIDES ---
  public getPlaygroundRides(): PlaygroundRide[] {
    return [
      {
        id: 'ride_ayunan',
        name: 'Ayunan Awan Biru',
        emoji: '🎠',
        description: 'Ayunan empuk berkanopi awan yang berayun pelan menenangkan hati.',
        actionWord: 'Berayun santai sambil bertasbih',
        bgGradient: 'from-sky-400 to-blue-500'
      },
      {
        id: 'ride_perosotan',
        name: 'Perosotan Pelangi',
        emoji: '🛝',
        description: 'Luncuran warna-warni 7 warna yang aman dengan bantalan rumput sintetis.',
        actionWord: 'Meluncur riang penuh tawa',
        bgGradient: 'from-amber-400 to-rose-500'
      },
      {
        id: 'ride_jungkat',
        name: 'Jungkat-Jungkit Sahabat',
        emoji: '⚖️',
        description: 'Papan seimbang kayu halus melatih kebersamaan dan kekompakan dua sahabat.',
        actionWord: 'Naik turun kompak bergantian',
        bgGradient: 'from-emerald-400 to-teal-600'
      },
      {
        id: 'ride_komidi',
        name: 'Komidi Kuda Poni Mini',
        emoji: '🎠',
        description: 'Komidi putar kayu berputar lembut diiringi alunan nada sholawat merdu.',
        actionWord: 'Berputar pelan sambil melambai',
        bgGradient: 'from-purple-400 to-pink-500'
      },
      {
        id: 'ride_terowongan',
        name: 'Terowongan Ulat Ceria',
        emoji: '🐛',
        description: 'Terowongan melingkar warna hijau-kuning tempat melatih ketangkasan merangkak.',
        actionWord: 'Menembus terowongan ceria',
        bgGradient: 'from-lime-400 to-green-600'
      },
      {
        id: 'ride_bola',
        name: 'Bola Bintang Raksasa',
        emoji: '⚽',
        description: 'Bola karet empuk bermotif bintang untuk bermain oper bola santun di lapangan.',
        actionWord: 'Menggelindingkan bola bersama',
        bgGradient: 'from-yellow-400 to-amber-500'
      }
    ];
  }

  // --- P4: PASAR CERIA STALLS ---
  public getMarketStalls(): MarketStall[] {
    return [
      {
        id: 'stall_buah',
        name: 'Toko Buah Kebun Berkah',
        shopkeeper: 'Paman Hasan',
        emoji: '🍎',
        themeColor: 'from-red-500 to-rose-600',
        speechQuote: '“Buah apel, pisang, dan semangka segar dari kebun sekolah yang barokah!”',
        goods: [
          { name: 'Apel Manis Berkah', icon: '🍎', quote: 'Kaya vitamin & manis alami' },
          { name: 'Pisang Sunnah Sehat', icon: '🍌', quote: 'Energi untuk belajar tahfidz' },
          { name: 'Jeruk Segar Alami', icon: '🍊', quote: 'Menjaga daya tahan tubuh' }
        ]
      },
      {
        id: 'stall_buku',
        name: 'Toko Buku Sahabat Cilik',
        shopkeeper: 'Ustadzah Nur',
        emoji: '📚',
        themeColor: 'from-indigo-500 to-blue-600',
        speechQuote: '“Hari ini kita membaca kisah Nabi yang penuh teladan kasih sayang!”',
        goods: [
          { name: 'Kisah 25 Nabi Bergambar', icon: '📖', quote: 'Penuh hikmah keteladanan' },
          { name: 'Buku Mewarnai Kaligrafi', icon: '🎨', quote: 'Mengasah kreativitas seni Islam' },
          { name: 'Komik Adab Sehari-Hari', icon: '📕', quote: 'Menjadi anak sholeh dambaan orang tua' }
        ]
      },
      {
        id: 'stall_balon',
        name: 'Gerobak Balon Ceria',
        shopkeeper: 'Kakak Masinis',
        emoji: '🎈',
        themeColor: 'from-amber-400 to-yellow-500',
        speechQuote: '“Balon warna-warni melayang tinggi membawa cita-cita mulia ananda santri!”',
        goods: [
          { name: 'Balon Bintang Merah', icon: '🎈', quote: 'Simbol semangat belajar' },
          { name: 'Balon Pelangi Ceria', icon: '🌈', quote: 'Keceriaan tanpa batas' },
          { name: 'Balon Emas Berkilau', icon: '✨', quote: 'Koleksi istimewa Kampung Ceria' }
        ]
      },
      {
        id: 'stall_bunga',
        name: 'Kios Bunga Melati Harum',
        shopkeeper: 'Bibi Siti',
        emoji: '💐',
        themeColor: 'from-emerald-400 to-teal-500',
        speechQuote: '“Bunga melati dan mawar harum untuk menghias sudut kelas dan rumah tersayang!”',
        goods: [
          { name: 'Kuntum Melati Putih', icon: '🌸', quote: 'Lambang kebersihan hati' },
          { name: 'Mawar Merah Semerbak', icon: '🌹', quote: 'Cinta kasih kepada sesama' },
          { name: 'Bunga Matahari Ceria', icon: '🌻', quote: 'Selalu menatap kebaikan' }
        ]
      }
    ];
  }

  // --- P5: MASJID KAMPUNG DATA ---
  public getMasjidData(): {
    name: string;
    todayDoa: { title: string; arabic: string; latin: string; meaning: string };
    jumatMessage: string;
    ramadhanNotice: string;
  } {
    return {
      name: 'Masjid Al-Barakah Mini Kampung Ceria',
      todayDoa: {
        title: 'Doa Menuntut Ilmu & Kebaikan',
        arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
        latin: 'Robbi zidnii ‘ilman warzuqnii fahman',
        meaning: '“Ya Allah, tambahkanlah kepadaku ilmu dan berikanlah aku pemahaman yang baik.”'
      },
      jumatMessage: '“Jumat Mubarak! Perbanyak sholawat kepada Rasulullah ﷺ dan tersenyumlah kepada saudaramu.”',
      ramadhanNotice: 'Lentera tarawih menyala indah, menyebarkan ketenangan di seluruh lorong kampung.'
    };
  }

  // --- P6: PARADE SORE CONTROLLER ---
  public startParadeSore(): void {
    if (this.isParadeRunning) return;

    this.isParadeRunning = true;
    this.paradeProgress = 0;
    tadeSoundEngine.playFx('PARADE_MARCH');

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G17-PARADE-SORE',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Parade Sore Kampung Ceria dimulai! Asy, Syifa, Bubu, Gogo, Mimi, Dodo, Titi, Rara berpawai bersama.'
    });

    const stepMs = 150; // Total 100 steps * 150ms = 15.0 seconds
    if (this.paradeTimer) clearInterval(this.paradeTimer);

    this.paradeTimer = setInterval(() => {
      this.paradeProgress += 1;
      if (this.paradeProgress >= 100) {
        this.finishParade();
      }
      this.notify();
    }, stepMs);

    this.notify();
  }

  public finishParade(): void {
    if (this.paradeTimer) {
      clearInterval(this.paradeTimer);
      this.paradeTimer = null;
    }
    this.isParadeRunning = false;
    this.paradeProgress = 100;
    tadeSoundEngine.playFx('CELEBRATION');

    this.unlockSticker('stk_parade');

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G17-PARADE-SORE',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Parade Sore Kampung Ceria selesai dengan selamat dan tertib (15 detik).'
    });

    this.notify();
  }

  public isParadeActive(): boolean {
    return this.isParadeRunning;
  }

  public getParadeProgress(): number {
    return this.paradeProgress;
  }

  // --- P7: STIKER KOLEKSI (STICKER BOOK) ---
  public getAllStickers(): KampungSticker[] {
    const rawStickers: Omit<KampungSticker, 'isUnlocked'>[] = [
      {
        id: 'stk_asy',
        name: 'Stiker Asy & Peci Hijau',
        emoji: '👦',
        rarity: 'UMUM',
        description: 'Karakter utama santri cilik yang ramah dan gemar mengaji.',
        howToUnlock: 'Terbuka saat pertama kali berkunjung ke Kampung Ceria.'
      },
      {
        id: 'stk_syifa',
        name: 'Stiker Syifa & Jilbab Pastel',
        emoji: '👧',
        rarity: 'UMUM',
        description: 'Santriwati cilik yang penyayang, santun, dan rapi.',
        howToUnlock: 'Kunjungi Rumah Syifa di Kampung Ceria.'
      },
      {
        id: 'stk_bubu',
        name: 'Stiker Rumah Wortel Bubu',
        emoji: '🥕',
        rarity: 'UMUM',
        description: 'Rumah wortel lucu tempat Bubu kelinci tinggal.',
        howToUnlock: 'Ketuk dan kunjungi Rumah Bubu.'
      },
      {
        id: 'stk_gogo',
        name: 'Stiker Rumah Pohon Gogo',
        emoji: '🌳',
        rarity: 'UMUM',
        description: 'Rumah pohon rindang tempat Gogo membaca buku.',
        howToUnlock: 'Ketuk dan kunjungi Rumah Gogo.'
      },
      {
        id: 'stk_mimi',
        name: 'Stiker Rumah Madu Mimi',
        emoji: '🍯',
        rarity: 'UMUM',
        description: 'Rumah bunga matahari penghasil madu manis.',
        howToUnlock: 'Ketuk dan kunjungi Rumah Mimi.'
      },
      {
        id: 'stk_dodo',
        name: 'Stiker Telaga Bebek Dodo',
        emoji: '🦆',
        rarity: 'UMUM',
        description: 'Rumah terapung di telaga bening tempat bebek berbaris.',
        howToUnlock: 'Ketuk dan kunjungi Rumah Dodo.'
      },
      {
        id: 'stk_titi',
        name: 'Stiker Rumah Batu Titi',
        emoji: '🐢',
        rarity: 'UMUM',
        description: 'Rumah batu sejuk tempat kura-kura bijak bermusyawarah.',
        howToUnlock: 'Ketuk dan kunjungi Rumah Titi.'
      },
      {
        id: 'stk_rara',
        name: 'Stiker Sangkar Burung Rara',
        emoji: '🕊️',
        rarity: 'UMUM',
        description: 'Sangkar cantik terbuka tempat Rara bersholawat.',
        howToUnlock: 'Ketuk dan kunjungi Rumah Rara.'
      },
      {
        id: 'stk_masjid',
        name: 'Stiker Kubah Masjid Barakah',
        emoji: '🕌',
        rarity: 'SPESIAL',
        description: 'Masjid mini pusat doa dan keberkahan kampung.',
        howToUnlock: 'Buka dan baca doa harian di Masjid Kampung.'
      },
      {
        id: 'stk_parade',
        name: 'Stiker Pawai Sahabat Ceria',
        emoji: '🎉',
        rarity: 'SPESIAL',
        description: 'Momen 8 sahabat berparade sore bersama menyusuri jalan kampung.',
        howToUnlock: 'Selesaikan 1 kali Parade Sore bersama sahabat.'
      },
      {
        id: 'stk_pelangi',
        name: 'Stiker Pelangi Kampung Asy',
        emoji: '🌈',
        rarity: 'SPESIAL',
        description: 'Lengkung 7 warna berkilau di atas langit kampung.',
        howToUnlock: 'Pilih cuaca Pelangi atau mainkan Perosotan Pelangi.'
      },
      {
        id: 'stk_emas_mahkota',
        name: 'Stiker Mahkota Emas Berkah',
        emoji: '👑',
        rarity: 'EMAS_LANGKA',
        description: 'Simbol keluhuran budi pekerti dan prestasi santri cilik.',
        howToUnlock: 'Temukan Kejutan Emas di Dunia Hidup.'
      }
    ];

    return rawStickers.map(s => ({
      ...s,
      isUnlocked: this.unlockedStickerIds.includes(s.id)
    }));
  }

  public unlockSticker(stickerId: string): void {
    if (!this.unlockedStickerIds.includes(stickerId)) {
      this.unlockedStickerIds.push(stickerId);
      this.saveStorage();
      tadeSoundEngine.playFx('STICKER_UNLOCK');

      const all = this.getAllStickers();
      const st = all.find(s => s.id === stickerId);

      blackBoxRecorder.record({
        ring: 'RING_2',
        moduleCode: 'G17-STIKER-KOLEKSI',
        role: 'SANTRI',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Stiker Baru Terbuka: "${st?.name || stickerId}" (${this.unlockedStickerIds.length}/12 stiker)`
      });

      this.notify();
    }
  }

  public getUnlockedStickerCount(): number {
    return this.unlockedStickerIds.length;
  }
}

export const kampungCeriaService = KampungCeriaService.getInstance();
