/**
 * TADE SPRINT G28 — PETA DUNIA TADE ENGINE
 * Master Unified 3D Cartoon World Map Engine for TK Islam Asy-Syifa.
 * 
 * Integrates:
 * - P1: 9 Canonical World Locations (Rumah Asy, Kampung Ceria, Kota Mini G23, Rumah Kreatif G24, Festival G14, TV Asy G15, Bioskop Langit G26, Pelabuhan Pelangi G27, Pulau Petualangan G27)
 * - P2: Camera G21 Smooth Transitions (Zoom, Awan Bergeser, Pelangi Melintas)
 * - P3: Cheerful Transport Fleet (Kereta, Bus Sekolah, Kapal Awan, Ambulans, Pemadam)
 * - P4: Living Time Synchronization (Pagi, Siang, Sore, Malam)
 * - P5: Living Event Synchronization (Ramadhan, Idul Fitri, Wisuda, PPDB, Hari Santri, Kemerdekaan)
 * - P6: Paspor Petualang Dunia (Cap stempel tanpa skor/ranking)
 * - P7: Founder Map Cockpit & Audio Synthesizer
 * 
 * Complies with:
 * - 60 FPS Guarantee (Max 5 active animations via TADE Animation Governor)
 * - Zero Breaking Changes (G1-G27 intact)
 * - Guardian Ring-0 & Hermes Recovery Telemetry
 * 
 * Marker: G28_PETA_DUNIA_TADE_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { livingEventEngine, SchoolEventType } from './livingEventEngine';
import { TimePhase, CheerfulWeather } from './livingWorldEngine';

export type WorldLocationId = 
  | 'RUMAH_ASY'
  | 'KAMPUNG_CERIA'
  | 'KOTA_MINI'
  | 'RUMAH_KREATIF'
  | 'FESTIVAL_CERIA'
  | 'TV_ASY'
  | 'BIOSKOP_LANGIT'
  | 'PELABUHAN_PELANGI'
  | 'PULAU_PETUALANGAN'
  | 'MASJID_AL_BARAKAH'
  | 'KAMPUNG_GOTONG_ROYONG';

export interface WorldLocationInfo {
  id: WorldLocationId;
  name: string;
  shortLabel: string;
  category: 'KEDIAMAN' | 'KOMUNITAS' | 'PROFESI' | 'KREATIF' | 'HIBURAN' | 'PETUALANGAN';
  coords: { x: number; y: number }; // Percentage on map canvas
  iconEmoji: string;
  landmark3D: string;
  description: string;
  targetModuleId: string;
  sprintOrigin: string;
  characterHost: string;
  hostEmoji: string;
  welcomeVoiceLine: string;
  stampTitle: string;
  stampEmoji: string;
  stampDescription: string;
  themeColor: string;
  bgGlow: string;
  specialDecor: {
    emoji: string;
    label: string;
  }[];
}

export interface MapVehicle {
  id: string;
  name: string;
  type: 'KERETA' | 'BUS_SEKOLAH' | 'KAPAL_AWAN' | 'AMBULANS' | 'PEMADAM';
  emoji: string;
  routeLabel: string;
  currentStop: string;
  progressPercent: number; // 0 to 100 on its loop
  speed: number;
  soundTrigger: () => void;
  phrase: string;
}

export interface WorldPassportEntry {
  locationId: WorldLocationId;
  unlockedAt: string;
  stampTitle: string;
  stampEmoji: string;
  blessingNote: string;
  visitCount: number;
}

export const WORLD_LOCATIONS_CATALOG: Record<WorldLocationId, WorldLocationInfo> = {
  RUMAH_ASY: {
    id: 'RUMAH_ASY',
    name: 'Rumah Asy & Syifa',
    shortLabel: 'Rumah Asy',
    category: 'KEDIAMAN',
    coords: { x: 22, y: 38 },
    iconEmoji: '🏡',
    landmark3D: 'Pondok Atap Biru & Taman Bunga Melati',
    description: 'Tempat tinggal Dek Asy & Mbak Syifa yang sejuk, ramah, dan penuh dengan adab santun keluarga muslim.',
    targetModuleId: 'r_rumah_asy',
    sprintOrigin: 'G1-G10',
    characterHost: 'Dek Asy & Mbak Syifa',
    hostEmoji: '👦👧',
    welcomeVoiceLine: '“Assalamu’alaikum! Selamat datang di rumah kami yang asri dan penuh berkah!”',
    stampTitle: 'Cap Adab Keluarga',
    stampEmoji: '🏡',
    stampDescription: 'Santri menjunjung tinggi adab berbakti kepada orang tua dan menyapa dengan senyum tulus.',
    themeColor: 'sky',
    bgGlow: 'rgba(56,189,248,0.3)',
    specialDecor: [
      { emoji: '🪴', label: 'Taman Melati' },
      { emoji: '🪑', label: 'Teras Santun' },
      { emoji: '📖', label: 'Pojok Dzikir' }
    ]
  },
  KAMPUNG_CERIA: {
    id: 'KAMPUNG_CERIA',
    name: 'Kampung Ceria Sahabat',
    shortLabel: 'Kampung Ceria',
    category: 'KOMUNITAS',
    coords: { x: 18, y: 68 },
    iconEmoji: '🏘️',
    landmark3D: 'Kompleks Rumah Sahabat (Bubu, Gogo, Mimi, Dodo, Titi, Rara)',
    description: 'Perkampungan ramah satwa sahabat Asy-Syifa yang hidup rukun, gotong royong, dan suka berbagi bekal.',
    targetModuleId: 'r_kampung_ceria',
    sprintOrigin: 'G12',
    characterHost: 'Bubu, Gogo & Mimi',
    hostEmoji: '🐿️🐻🐱',
    welcomeVoiceLine: '“Hai teman-teman! Di Kampung Ceria, kita semua saling tolong-menolong dalam kebaikan!”',
    stampTitle: 'Cap Sahabat Rukun',
    stampEmoji: '🏘️',
    stampDescription: 'Santri hidup rukun dengan sesama tetangga dan saling tolong-menolong.',
    themeColor: 'amber',
    bgGlow: 'rgba(245,158,11,0.3)',
    specialDecor: [
      { emoji: '🌳', label: 'Pohon Persahabatan' },
      { emoji: '🥖', label: 'Dapur Kue Kurma' },
      { emoji: '⛲', label: 'Air Pancur Ceria' }
    ]
  },
  KOTA_MINI: {
    id: 'KOTA_MINI',
    name: 'Kota Mini Profesi Asy',
    shortLabel: 'Kota Mini',
    category: 'PROFESI',
    coords: { x: 48, y: 55 },
    iconEmoji: '🏙️',
    landmark3D: 'Sentra Profesi Cilik & Menara Sains Berkah',
    description: 'Pusat pembelajaran cita-cita mulia: Dokter cilik, arsitek masjid, kantor pos berkah, polisi sahabat, dan pemadam ceria.',
    targetModuleId: 'r_city_hub',
    sprintOrigin: 'G23',
    characterHost: 'Tim Profesi Asy',
    hostEmoji: '👨‍⚕️👷‍♂️👮‍♂️',
    welcomeVoiceLine: '“Raih cita-citamu setinggi bintang dengan niat ikhlas beribadah kepada Allah!”',
    stampTitle: 'Cap Cita-Cita Mulia',
    stampEmoji: '🏙️',
    stampDescription: 'Santri berniat mengabdi untuk umat melalui profesi yang halal dan bermanfaat.',
    themeColor: 'blue',
    bgGlow: 'rgba(59,130,246,0.3)',
    specialDecor: [
      { emoji: '🏥', label: 'Klinik Santun' },
      { emoji: '📮', label: 'Kantor Pos Berkah' },
      { emoji: '🚒', label: 'Pos Pemadam Cilik' }
    ]
  },
  RUMAH_KREATIF: {
    id: 'RUMAH_KREATIF',
    name: 'Rumah Kreatif Asy & Syifa',
    shortLabel: 'Rumah Kreatif',
    category: 'KREATIF',
    coords: { x: 45, y: 22 },
    iconEmoji: '🎨',
    landmark3D: 'Kubah Pelangi, Studio Gambar & Galeri Seni',
    description: 'Laboratorium imajinasi santri: Menggambar kaligrafi ceria, melipat origami burung perdamaian, dan memahat patung tanah liat.',
    targetModuleId: 'r_creative_house',
    sprintOrigin: 'G24',
    characterHost: 'Mbak Syifa & Rara',
    hostEmoji: '🎨🦌',
    welcomeVoiceLine: '“Setiap goresan warna dan lipatan kertas adalah ungkapan rasa syukur atas indahnya ciptaan Allah!”',
    stampTitle: 'Cap Seniman Berakhlak',
    stampEmoji: '🎨',
    stampDescription: 'Santri menghasilkan karya seni yang santun, indah, dan menggugah kebaikan.',
    themeColor: 'pink',
    bgGlow: 'rgba(236,72,153,0.3)',
    specialDecor: [
      { emoji: '🖌️', label: 'Kuas Ajaib' },
      { emoji: '📄', label: 'Origami Pelangi' },
      { emoji: '🏺', label: 'Tembikar Berkah' }
    ]
  },
  FESTIVAL_CERIA: {
    id: 'FESTIVAL_CERIA',
    name: 'Lapangan Festival Ceria',
    shortLabel: 'Festival Ceria',
    category: 'HIBURAN',
    coords: { x: 72, y: 35 },
    iconEmoji: '🎪',
    landmark3D: 'Tenda Sirkus Warna-Warni & Panggung Musik Nasyid',
    description: 'Pusat kemeriahan tahunan: Parade lampion, karnaval hari santri, pameran karya PPDB, dan panggung dongeng anak shaleh.',
    targetModuleId: 'r_festival',
    sprintOrigin: 'G14',
    characterHost: 'Dodo & Titi',
    hostEmoji: '🕊️🐰',
    welcomeVoiceLine: '“Sambut hari penuh suka cita dengan senyuman dan lantunan sholawat yang merdu!”',
    stampTitle: 'Cap Gembira Bersyukur',
    stampEmoji: '🎪',
    stampDescription: 'Santri merayakan kegembiraan dalam koridor syariat dan penuh kesantunan.',
    themeColor: 'purple',
    bgGlow: 'rgba(168,85,247,0.3)',
    specialDecor: [
      { emoji: '🎈', label: 'Balon Karnaval' },
      { emoji: '🥁', label: 'Bedug Festival' },
      { emoji: '🎠', label: 'Komedi Putar Angin' }
    ]
  },
  TV_ASY: {
    id: 'TV_ASY',
    name: 'TV Asy-Syifa & Studio Siaran',
    shortLabel: 'TV Asy',
    category: 'HIBURAN',
    coords: { x: 74, y: 68 },
    iconEmoji: '📺',
    landmark3D: 'Menara Siaran Bintang & Studio Kamera Sutradara',
    description: 'Stasiun penyiaran dakwah cilik Asy-Syifa: Menayangkan dongeng teladan nabi, adab harian, dan petualangan edukatif santri.',
    targetModuleId: 'r_tvasy',
    sprintOrigin: 'G15',
    characterHost: 'Dek Asy & Sutradara G22',
    hostEmoji: '👦🎬',
    welcomeVoiceLine: '“Kamera siap, mikrofon menyala! Waktunya menyebarkan pesan kebaikan ke seluruh dunia!”',
    stampTitle: 'Cap Penyiar Dakwah',
    stampEmoji: '📺',
    stampDescription: 'Santri menyampaikan perkataan yang benar, santun, dan bermanfaat.',
    themeColor: 'teal',
    bgGlow: 'rgba(20,184,166,0.3)',
    specialDecor: [
      { emoji: '📡', label: 'Antena Bintang' },
      { emoji: '🎥', label: 'Kamera Siaran' },
      { emoji: '🎙️', label: 'Mikrofon Emas' }
    ]
  },
  BIOSKOP_LANGIT: {
    id: 'BIOSKOP_LANGIT',
    name: 'Bioskop Langit Asy & Syifa',
    shortLabel: 'Bioskop Langit',
    category: 'HIBURAN',
    coords: { x: 86, y: 20 },
    iconEmoji: '🌙',
    landmark3D: 'Layar Tirai Awan, Proyektor Bintang & Kursi Kapas',
    description: 'Bioskop terbuka di bawah langit bertabur bintang: Menikmati kisah malam teladan sambil menikmati popcorn madu yang renyah.',
    targetModuleId: 'r_bioskop_langit',
    sprintOrigin: 'G26',
    characterHost: 'Mbak Syifa & Asy',
    hostEmoji: '👧👦',
    welcomeVoiceLine: '“Silakan duduk di atas kursi awan empuk, proyektor bintang siap memutar kisah teladan malam ini!”',
    stampTitle: 'Cap Penonton Santun',
    stampEmoji: '🌙',
    stampDescription: 'Santri tertib menyimak kisah penuh hikmah sebelum beristirahat malam.',
    themeColor: 'indigo',
    bgGlow: 'rgba(99,102,241,0.3)',
    specialDecor: [
      { emoji: '🍿', label: 'Popcorn Madu' },
      { emoji: '📽️', label: 'Proyektor Bintang' },
      { emoji: '☁️', label: 'Kursi Awan' }
    ]
  },
  PELABUHAN_PELANGI: {
    id: 'PELABUHAN_PELANGI',
    name: 'Pelabuhan Pelangi Asy-Syifa',
    shortLabel: 'Pelabuhan Pelangi',
    category: 'PETUALANGAN',
    coords: { x: 28, y: 88 },
    iconEmoji: '🚩',
    landmark3D: 'Dermaga Kayu Pelangi, Tiang Bendera & Menara Suar',
    description: 'Gerbang utama pelayaran samudra berkah: Tempat Kapal Awan bersandar menyambut santri dan sahabat untuk berpetualang.',
    targetModuleId: 'r_kapal_awan',
    sprintOrigin: 'G27',
    characterHost: 'Gogo si Beruang',
    hostEmoji: '🐻⚓',
    welcomeVoiceLine: '“Tooooot! Kapal Awan telah merapat di Dermaga Pelangi, semua penumpang dipersilakan naik!”',
    stampTitle: 'Cap Nakhoda Ceria',
    stampEmoji: '🚩',
    stampDescription: 'Santri berani menjelajah kebaikan dengan niat lillahi ta\'ala.',
    themeColor: 'emerald',
    bgGlow: 'rgba(16,185,129,0.3)',
    specialDecor: [
      { emoji: '🌈', label: 'Lengkung Pelangi' },
      { emoji: '⚓', label: 'Jangkar Emas' },
      { emoji: '🎺', label: 'Peluit Dermaga' }
    ]
  },
  PULAU_PETUALANGAN: {
    id: 'PULAU_PETUALANGAN',
    name: 'Gugusan 5 Pulau Petualangan',
    shortLabel: 'Pulau Petualangan',
    category: 'PETUALANGAN',
    coords: { x: 80, y: 90 },
    iconEmoji: '🏝️',
    landmark3D: 'Pulau Doa, Huruf, Angka, Alam & Persahabatan',
    description: 'Destinasi pelayaran Kapal Awan: 5 pulau tematik penuh hikmah Al-Qur\'an, literasi hijaiyah, sedekah kurma, dan ukhuwah.',
    targetModuleId: 'r_kapal_awan',
    sprintOrigin: 'G27',
    characterHost: 'Bubu & Seluruh Sahabat',
    hostEmoji: '🐿️🌟',
    welcomeVoiceLine: '“Alhamdulillah kita telah tiba di Pulau Petualangan, mari kumpulkan cap berkah di paspor kita!”',
    stampTitle: 'Cap Petualang Berkah',
    stampEmoji: '🏝️',
    stampDescription: 'Santri mengamalkan 5 pilar karakter: Doa, Ilmu, Amal, Kasih, dan Persaudaraan.',
    themeColor: 'amber',
    bgGlow: 'rgba(245,158,11,0.3)',
    specialDecor: [
      { emoji: '🕌', label: 'Menara Doa' },
      { emoji: '🔤', label: 'Balon Hijaiyah' },
      { emoji: '🌴', label: 'Pohon Kurma Sedekah' }
    ]
  },
  MASJID_AL_BARAKAH: {
    id: 'MASJID_AL_BARAKAH',
    name: 'Masjid Al-Barakah & Kampung Shalih',
    shortLabel: 'Masjid Barakah',
    category: 'KOMUNITAS',
    coords: { x: 50, y: 22 },
    iconEmoji: '🕌',
    landmark3D: 'Kubah Emas Berkilau, Menara Cahaya & Halaman Bernapas',
    description: 'Landmark utama spiritual TADE: Pusat ibadah ceria, air wudhu ramah, shaf kecil berseri, parade Jumat 20s, dan transit MBG bergizi.',
    targetModuleId: 'r_masjid_barakah',
    sprintOrigin: 'G41',
    characterHost: 'Dek Asy & Mbak Syifa',
    hostEmoji: '👦🏻👧🏻',
    welcomeVoiceLine: '“Assalamu’alaikum warahmatullah! Mari melangkah ke Masjid Al-Barakah, tempat belajar kebaikan dan ukhuwah!”',
    stampTitle: 'Cap Shalih Al-Barakah',
    stampEmoji: '🕌',
    stampDescription: 'Santri istiqomah memakmurkan masjid, gemar berwudhu dengan tertib, dan mencintai sesama sahabat.',
    themeColor: 'amber',
    bgGlow: 'rgba(245,158,11,0.4)',
    specialDecor: [
      { emoji: '🌙', label: 'Bulan Sabit Tersenyum' },
      { emoji: '🏮', label: 'Lentera Malam' },
      { emoji: '🚋', label: 'Trem Mini Barakah' },
      { emoji: '🌴', label: 'Pohon Doa & Kurma' }
    ]
  },
  KAMPUNG_GOTONG_ROYONG: {
    id: 'KAMPUNG_GOTONG_ROYONG',
    name: 'Kampung Gotong Royong & Hari Bakti Ceria',
    shortLabel: 'Gotong Royong',
    category: 'KOMUNITAS',
    coords: { x: 58, y: 38 },
    iconEmoji: '🤝',
    landmark3D: 'Pohon Gotong Royong, Kereta Kerja Sama & Meja Berbagi',
    description: 'Pusat kerja bakti ceria, bersih-bersih lingkungan sekolah, pikul hasil panen bersama, dan pohon persatuan hidup.',
    targetModuleId: 'r_gotong_royong',
    sprintOrigin: 'G42',
    characterHost: 'Dek Asy & Sahabat',
    hostEmoji: '👦🏻👧🏻🐻🐰🐢',
    welcomeVoiceLine: '“Assalamu’alaikum, mari bekerja sama menjaga kebersihan dan berbagi kebahagiaan!”',
    stampTitle: 'Cap Sahabat Gotong Royong',
    stampEmoji: '🤝',
    stampDescription: 'Teladan kerja sama tulus, gemar menolong sesama, menjaga kebersihan lingkungan, dan beradab mulia.',
    themeColor: 'emerald',
    bgGlow: 'rgba(16,185,129,0.4)',
    specialDecor: [
      { emoji: '🌳', label: 'Pohon Gotong Royong' },
      { emoji: '🚂', label: 'Kereta Kerja Sama' },
      { emoji: '🧺', label: 'Keranjang Panen Bersama' },
      { emoji: '💖', label: 'Langit Bintang Hati' }
    ]
  }
};

const WORLD_PASSPORT_STORAGE_KEY = 'tade_g28_world_passport_v1';

class PetaDuniaEngine {
  private audioCtx: AudioContext | null = null;
  private selectedLocationId: WorldLocationId | null = 'RUMAH_ASY';
  private timePhase: TimePhase = 'SIANG';
  private weather: CheerfulWeather = 'CERAH';
  private activeEvent: SchoolEventType = 'REGULAR_DAY';
  private isTransitioning: boolean = false;
  private transitionEffect: 'AWAN_BERGESER' | 'PELANGI_MELINTAS' | 'ZOOM_LEMBUT' = 'AWAN_BERGESER';
  private ecoModeActive: boolean = false;
  private passportEntries: WorldPassportEntry[] = [];
  private listeners: Set<() => void> = new Set();
  private vehicleTicker: NodeJS.Timeout | null = null;

  // Vehicles on Map (P3 Transportasi Ceria)
  private vehicles: MapVehicle[] = [
    {
      id: 'veh-kereta',
      name: 'Kereta Ceria Sholawat',
      type: 'KERETA',
      emoji: '🚂',
      routeLabel: 'Kampung Ceria ↔ Kota Mini',
      currentStop: 'Stasiun Madani Kota Mini',
      progressPercent: 35,
      speed: 1.2,
      soundTrigger: () => this.playTrainWhistle(),
      phrase: 'Tut-tut-gujeees! Membawa santri ceria belajar profesi!'
    },
    {
      id: 'veh-bus',
      name: 'Bus Sekolah Kuning Asy',
      type: 'BUS_SEKOLAH',
      emoji: '🚌',
      routeLabel: 'Rumah Asy ↔ TK Asy-Syifa',
      currentStop: 'Halte Bunga Melati',
      progressPercent: 62,
      speed: 0.9,
      soundTrigger: () => this.playBusHorn(),
      phrase: 'Tin-tiiin! Bus sekolah siap mengantar santri tersayang!'
    },
    {
      id: 'veh-kapal',
      name: 'Kapal Awan Petualangan',
      type: 'KAPAL_AWAN',
      emoji: '☁️',
      routeLabel: 'Pelabuhan Pelangi ↔ Pulau Petualangan',
      currentStop: 'Selat Doa Berkah',
      progressPercent: 48,
      speed: 0.7,
      soundTrigger: () => this.playShipWhistle(),
      phrase: 'Tooooot! Kapal awan empuk berlayar membawa kedamaian!'
    },
    {
      id: 'veh-ambulans',
      name: 'Ambulans Sahabat Santun',
      type: 'AMBULANS',
      emoji: '🚑',
      routeLabel: 'Kota Mini ↔ Kampung Ceria',
      currentStop: 'Klinik Ramah Cilik',
      progressPercent: 80,
      speed: 1.0,
      soundTrigger: () => this.playAmbulanceChime(),
      phrase: 'Ninu-ninu lembut! Siap membantu sahabat yang butuh obat!'
    },
    {
      id: 'veh-pemadam',
      name: 'Pemadam Cilik Pemberani',
      type: 'PEMADAM',
      emoji: '🚒',
      routeLabel: 'Sentra Profesi ↔ Taman Festival',
      currentStop: 'Pos Siaga Berkah',
      progressPercent: 15,
      speed: 0.8,
      soundTrigger: () => this.playFireTruckBell(),
      phrase: 'Kring-kring! Selalu siap menyiram tanaman dan menjaga ketertiban!'
    }
  ];

  constructor() {
    this.loadPassportFromStorage();
    this.initLivingTimeAndEvent();
    this.startVehicleMovement();
  }

  private initLivingTimeAndEvent() {
    try {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 11) {
        this.timePhase = 'PAGI';
      } else if (hour >= 11 && hour < 15) {
        this.timePhase = 'SIANG';
      } else if (hour >= 15 && hour < 18) {
        this.timePhase = 'SORE';
      } else {
        this.timePhase = 'MALAM';
      }

      // Sync with Living Event Engine
      this.activeEvent = livingEventEngine.getActiveEvent().eventId;
    } catch {
      this.timePhase = 'SIANG';
      this.activeEvent = 'REGULAR_DAY';
    }
  }

  private loadPassportFromStorage() {
    try {
      const raw = localStorage.getItem(WORLD_PASSPORT_STORAGE_KEY);
      if (raw) {
        this.passportEntries = JSON.parse(raw);
      } else {
        // Initial stamped home arrival
        this.passportEntries = [
          {
            locationId: 'RUMAH_ASY',
            unlockedAt: new Date().toISOString(),
            stampTitle: 'Cap Sambutan Rumah Asy',
            stampEmoji: '🏡',
            blessingNote: 'Selamat datang di Dunia Asy-Syifa yang damai dan ceria!',
            visitCount: 1
          }
        ];
        this.savePassportToStorage();
      }
    } catch {
      this.passportEntries = [];
    }
  }

  private savePassportToStorage() {
    try {
      localStorage.setItem(WORLD_PASSPORT_STORAGE_KEY, JSON.stringify(this.passportEntries));
    } catch {
      // Ignore
    }
  }

  private startVehicleMovement() {
    if (this.vehicleTicker) clearInterval(this.vehicleTicker);

    this.vehicleTicker = setInterval(() => {
      if (this.ecoModeActive) return; // Save frames when eco mode is on

      this.vehicles = this.vehicles.map(v => {
        let nextPercent = v.progressPercent + v.speed;
        if (nextPercent >= 100) nextPercent = 0;
        return {
          ...v,
          progressPercent: nextPercent
        };
      });

      this.notify();
    }, 400);
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Error in PetaDuniaEngine subscriber', err);
      }
    });
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // ==========================================
  // PURE WEB AUDIO SYNTHESIZERS FOR MAP
  // ==========================================

  public playTransitionChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Bright cheerful harp sweep)

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.5);
      });
    } catch {
      // Failsafe
    }
  }

  public playTrainWhistle() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const playChug = (start: number, freq: number, dur: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(freq, start);
        osc2.frequency.setValueAtTime(freq * 1.5, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + dur);
        osc2.stop(start + dur);
      };

      playChug(now, 330, 0.45);
      playChug(now + 0.4, 330, 0.7);
    } catch {
      // Failsafe
    }
  }

  public playBusHorn() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const playBeep = (start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(293.66, start); // D4 friendly beep

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.22, start + 0.03);
        gain.gain.linearRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      };

      playBeep(now, 0.2);
      playBeep(now + 0.25, 0.28);
    } catch {
      // Failsafe
    }
  }

  public playShipWhistle() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(261.63, now); // C4 warm steam whistle

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch {
      // Failsafe
    }
  }

  public playAmbulanceChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const playTone = (start: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.04);
        gain.gain.linearRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      };

      playTone(now, 440); // A4
      playTone(now + 0.35, 349.23); // F4
    } catch {
      // Failsafe
    }
  }

  public playFireTruckBell() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Failsafe
    }
  }

  public playStampChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Solid thud + sparkle
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = 'triangle';
      thud.frequency.setValueAtTime(160, now);
      thud.frequency.exponentialRampToValueAtTime(40, now + 0.12);

      thudGain.gain.setValueAtTime(0.3, now);
      thudGain.gain.linearRampToValueAtTime(0.001, now + 0.12);

      thud.connect(thudGain);
      thudGain.connect(ctx.destination);
      thud.start(now);
      thud.stop(now + 0.12);

      const sparkleNotes = [659.25, 880, 1174.66, 1318.51];
      sparkleNotes.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + 0.08 + idx * 0.07);

        g.gain.setValueAtTime(0.001, now + 0.08 + idx * 0.07);
        g.gain.linearRampToValueAtTime(0.18, now + 0.08 + idx * 0.07 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + idx * 0.07 + 0.4);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + 0.08 + idx * 0.07);
        osc.stop(now + 0.08 + idx * 0.07 + 0.4);
      });
    } catch {
      // Failsafe
    }
  }

  // ==========================================
  // CONTROLS & TRANSITIONS
  // ==========================================

  public selectLocation(locId: WorldLocationId, effect: 'AWAN_BERGESER' | 'PELANGI_MELINTAS' | 'ZOOM_LEMBUT' = 'AWAN_BERGESER') {
    this.isTransitioning = true;
    this.transitionEffect = effect;
    this.selectedLocationId = locId;
    this.playTransitionChime();
    this.notify();

    // Automatically record stamp on visit
    this.unlockLocationStamp(locId);

    blackBoxRecorder.record({
      ring: 'RING_1',
      moduleCode: 'G28-PETA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `World Map location selected: ${locId} with effect ${effect}`
    });

    // Reset transition flag after 800ms
    setTimeout(() => {
      this.isTransitioning = false;
      this.notify();
    }, 850);
  }

  public clearSelectedLocation() {
    this.selectedLocationId = null;
    this.notify();
  }

  public unlockLocationStamp(locId: WorldLocationId) {
    const loc = WORLD_LOCATIONS_CATALOG[locId];
    if (!loc) return;

    const existing = this.passportEntries.find(p => p.locationId === locId);
    if (existing) {
      existing.visitCount += 1;
      existing.unlockedAt = new Date().toISOString();
    } else {
      this.passportEntries.push({
        locationId: locId,
        unlockedAt: new Date().toISOString(),
        stampTitle: loc.stampTitle,
        stampEmoji: loc.stampEmoji,
        blessingNote: loc.stampDescription,
        visitCount: 1
      });
    }

    this.savePassportToStorage();
    this.notify();
  }

  public setTimePhase(phase: TimePhase) {
    this.timePhase = phase;
    this.notify();
  }

  public setWeather(weather: CheerfulWeather) {
    this.weather = weather;
    this.notify();
  }

  public setActiveEvent(event: SchoolEventType) {
    this.activeEvent = event;
    this.notify();
  }

  public toggleEcoMode() {
    this.ecoModeActive = !this.ecoModeActive;
    this.notify();
  }

  // ==========================================
  // GETTERS FOR UI
  // ==========================================

  public getSnapshot() {
    return {
      selectedLocationId: this.selectedLocationId,
      selectedLocation: this.selectedLocationId ? WORLD_LOCATIONS_CATALOG[this.selectedLocationId] : null,
      timePhase: this.timePhase,
      weather: this.weather,
      activeEvent: this.activeEvent,
      isTransitioning: this.isTransitioning,
      transitionEffect: this.transitionEffect,
      ecoModeActive: this.ecoModeActive,
      vehicles: [...this.vehicles],
      passportEntries: [...this.passportEntries],
      isLocationVisited: (id: WorldLocationId) => this.passportEntries.some(p => p.locationId === id),
      totalStampsCollected: this.passportEntries.length
    };
  }
}

export const petaDuniaEngine = new PetaDuniaEngine();
export default petaDuniaEngine;
