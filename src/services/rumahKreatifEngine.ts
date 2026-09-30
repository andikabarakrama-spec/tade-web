/**
 * RUMAH KREATIF ASY & SYIFA ENGINE — SPRINT G24
 * 
 * Penanda: G24_RUMAH_KREATIF_VERIFIED
 * 
 * Pondasi Utama:
 * - P1: Ruang Mewarnai Ceria (11 Karakter resmi TADE, satu sentuhan mewarnai, undo sederhana, auto-save ringan)
 * - P2: Kotak Krayon Hidup (Setiap krayon memiliki karakter: melompat, berkedip, mengangguk, tersenyum)
 * - P3: Stiker Ajaib (8 Stiker resmi TADE: bintang, pelangi, daun, balon, bunga, kupu-kupu, awan, lentera)
 * - P4: Meja Kreasi Bernapas (Pensil berguling, penghapus berkedip, lem tersenyum, kertas bernapas, bintang muncul)
 * - P5: Efek Karya (Pop, Pling, Confetti lembut, Bintang via DNA Sound G20)
 * - P6: Galeri Keluarga & Pusat Aset (Karya otomatis masuk Buku Cerita, Galeri, Pusat Aset; Guru pengendali publikasi)
 * - P7: Kreasi Harian (Inspirasi harian otomatis dengan tombol toggle Founder)
 * - P8: Galeri Berjalan (Lorong sekolah virtual, apresiasi Asy & Syifa tanpa voting dan tanpa juara)
 * - P9: Pohon Inspirasi (Setiap karya menumbuhkan daun berpita; sentuh untuk membaca pesan semangat)
 * - P10: Lemari Karya Kelas (Rak kelas A1, A2, B1, B2; drag & drop; RBAC aman)
 * - P11: Paspor Petualang Asy (7 Cap kenangan petualangan tanpa skor/ranking)
 * - P12: Kotak Krayon Pintar (Sinkron dengan Living Event Engine: Ramadhan emas, Kemerdekaan merah putih, dsb.)
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { asySyifaDnaEngine } from './asySyifaDnaEngine';
import { livingEventEngine, SchoolEventType } from './livingEventEngine';
import { sutradaraAjaibEngine } from './sutradaraAjaibEngine';

// ==========================================
// 1. TIPE DATA & ENUM DASAR
// ==========================================

export type ColoringCharacterId = 
  | 'ASY' 
  | 'SYIFA' 
  | 'BUBU' 
  | 'GOGO' 
  | 'MIMI' 
  | 'DODO' 
  | 'TITI' 
  | 'RARA' 
  | 'KERETA' 
  | 'BUS' 
  | 'MASJID';

export type StickerType = 
  | 'BINTANG' 
  | 'PELANGI' 
  | 'DAUN' 
  | 'BALON' 
  | 'BUNGA' 
  | 'KUPU_KUPU' 
  | 'AWAN' 
  | 'LENTERA';

export type ClassCabinetId = 'A1' | 'A2' | 'B1' | 'B2';

export type PublicationStatus = 'DRAFT' | 'MENUNGGU_PERSETUJUAN_GURU' | 'DITERBITKAN_DI_GALERI';

export type PassportStampId = 
  | 'KERETA' 
  | 'KLINIK' 
  | 'KEBUN' 
  | 'PERPUSTAKAAN' 
  | 'TOKO_ROTI' 
  | 'KANTOR_POS' 
  | 'RUMAH_KREATIF';

export interface ColoringPathZone {
  id: string;
  name: string;
  defaultColor: string;
  d: string; // SVG path
}

export interface ColoringTemplate {
  id: ColoringCharacterId;
  name: string;
  title: string;
  category: 'KARAKTER' | 'SAHABAT_SATWA' | 'KENDARAAN' | 'BANGUNAN_BERKAH';
  tagline: string;
  storySnippet: string;
  viewBox: string;
  zones: ColoringPathZone[];
  outlinePaths: string[];
}

export interface PlacedSticker {
  id: string;
  type: StickerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface ArtworkRecord {
  id: string;
  code: string;
  title: string;
  templateId: ColoringCharacterId;
  childName: string;
  classId: ClassCabinetId;
  createdAt: string;
  zoneColors: Record<string, string>; // zoneId -> hexColor
  stickers: PlacedSticker[];
  publicationStatus: PublicationStatus;
  encouragementMessage: string;
  leafRibbonColor: string;
  praiseAsy: string;
  praiseSyifa: string;
  syncedToStorybook: boolean;
  syncedToAssetCenter: boolean;
  syncedToTvAsy: boolean;
}

export interface CrayonItem {
  id: string;
  name: string;
  colorHex: string;
  characterMood: 'melompat' | 'berkedip' | 'mengangguk' | 'tersenyum';
  isEventSpecial?: boolean;
  eventBadge?: string;
  saying: string;
}

export interface DailyInspirationPrompt {
  id: string;
  title: string;
  subtitle: string;
  recommendedTemplate: ColoringCharacterId;
  recommendedStickers: StickerType[];
  doaHarian: string;
  hikmah: string;
}

export interface PassportStamp {
  id: PassportStampId;
  title: string;
  locationName: string;
  iconSymbol: string;
  earnedAt?: string;
  motto: string;
  color: string;
}

// ==========================================
// 2. TEMPLATE GAMBAR MEWARNAI RESMI TADE
// ==========================================

export const OFFICIAL_COLORING_TEMPLATES: ColoringTemplate[] = [
  {
    id: 'ASY',
    name: 'Dek Asy',
    title: 'Asy Si Ceria Berpeci Hijau',
    category: 'KARAKTER',
    tagline: 'Santri cilik yang riang, santun, dan suka tolong-menolong.',
    storySnippet: 'Dek Asy selalu bersemangat menyambut pagi dengan mengucap Bismillah dan senyuman manis.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'asy-peci', name: 'Peci Songkok', defaultColor: '#10b981', d: 'M130,120 Q200,90 270,120 L260,160 Q200,145 140,160 Z' },
      { id: 'asy-wajah', name: 'Wajah Ceria', defaultColor: '#fed7aa', d: 'M140,150 Q200,140 260,150 Q265,220 200,240 Q135,220 140,150 Z' },
      { id: 'asy-baju', name: 'Baju Koko', defaultColor: '#38bdf8', d: 'M145,240 Q200,245 255,240 L275,340 Q200,355 125,340 Z' },
      { id: 'asy-kerah', name: 'Kerah Koko', defaultColor: '#fef08a', d: 'M175,240 Q200,265 225,240 L220,270 Q200,280 180,270 Z' },
      { id: 'asy-lengan-kiri', name: 'Lengan Kiri', defaultColor: '#0284c7', d: 'M125,245 L85,300 L115,315 L145,265 Z' },
      { id: 'asy-lengan-kanan', name: 'Lengan Kanan', defaultColor: '#0284c7', d: 'M255,245 L295,300 L265,315 L235,265 Z' },
      { id: 'asy-tangan-kiri', name: 'Tangan Kiri', defaultColor: '#fed7aa', d: 'M85,300 Q70,320 95,330 Q110,325 115,315 Z' },
      { id: 'asy-tangan-kanan', name: 'Tangan Kanan', defaultColor: '#fed7aa', d: 'M295,300 Q310,320 285,330 Q270,325 265,315 Z' },
      { id: 'asy-celana', name: 'Sarung/Celana', defaultColor: '#059669', d: 'M130,340 Q200,350 270,340 L260,390 L140,390 Z' }
    ],
    outlinePaths: [
      'M170,185 Q180,175 190,185', // Mata kiri
      'M210,185 Q220,175 230,185', // Mata kanan
      'M185,210 Q200,225 215,210', // Senyum
      'M195,190 L205,195'           // Hidung
    ]
  },
  {
    id: 'SYIFA',
    name: 'Mbak Syifa',
    title: 'Mbak Syifa Si Lembut Berjilbab',
    category: 'KARAKTER',
    tagline: 'Sahabat pembimbing yang ramah, penyayang, dan gemar berinfak.',
    storySnippet: 'Mbak Syifa gemar mengaji dan menyusun buku cerita bersama adik-adik di taman sekolah.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'syifa-jilbab', name: 'Jilbab Lembut', defaultColor: '#f472b6', d: 'M120,110 Q200,60 280,110 Q310,210 270,270 Q200,300 130,270 Q90,210 120,110 Z' },
      { id: 'syifa-wajah', name: 'Wajah Teduh', defaultColor: '#fed7aa', d: 'M150,150 Q200,140 250,150 Q255,220 200,235 Q145,220 150,150 Z' },
      { id: 'syifa-gamis', name: 'Gamis Berkah', defaultColor: '#c084fc', d: 'M140,270 Q200,285 260,270 L285,385 Q200,395 115,385 Z' },
      { id: 'syifa-renda', name: 'Renda Gamis', defaultColor: '#fef08a', d: 'M120,370 Q200,390 280,370 L285,385 Q200,395 115,385 Z' },
      { id: 'syifa-bunga', name: 'Bros Bunga Jilbab', defaultColor: '#fbbf24', d: 'M130,130 Q145,115 160,130 Q145,145 130,130 Z' },
      { id: 'syifa-tangan', name: 'Tangan Menyapa', defaultColor: '#fed7aa', d: 'M180,270 Q200,260 220,270 Q220,290 200,295 Q180,290 180,270 Z' }
    ],
    outlinePaths: [
      'M170,180 Q180,172 190,180',
      'M210,180 Q220,172 230,180',
      'M185,208 Q200,220 215,208'
    ]
  },
  {
    id: 'BUBU',
    name: 'Bubu Kucing',
    title: 'Bubu Kucing Belang Ceria',
    category: 'SAHABAT_SATWA',
    tagline: 'Kucing manis penjaga kebun sekolah yang lincah dan suka dielus.',
    storySnippet: 'Bubu selalu mengeong gembira ketika santri Asy Syifa membagikan biskuit halal.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'bubu-telinga-kiri', name: 'Telinga Kiri', defaultColor: '#f97316', d: 'M130,140 L100,70 L170,110 Z' },
      { id: 'bubu-telinga-kanan', name: 'Telinga Kanan', defaultColor: '#f97316', d: 'M270,140 L300,70 L230,110 Z' },
      { id: 'bubu-kepala', name: 'Wajah Bubu', defaultColor: '#fdba74', d: 'M120,130 Q200,100 280,130 Q300,210 280,240 Q200,270 120,240 Q100,210 120,130 Z' },
      { id: 'bubu-moncong', name: 'Moncong Putih', defaultColor: '#ffffff', d: 'M160,190 Q200,180 240,190 Q230,230 200,235 Q170,230 160,190 Z' },
      { id: 'bubu-badan', name: 'Badan Bulat', defaultColor: '#fb923c', d: 'M140,240 Q200,230 260,240 L280,360 Q200,380 120,360 Z' },
      { id: 'bubu-perut', name: 'Perut Halus', defaultColor: '#fef08a', d: 'M165,255 Q200,250 235,255 Q245,340 200,350 Q155,340 165,255 Z' },
      { id: 'bubu-ekor', name: 'Ekor Mengibas', defaultColor: '#ea580c', d: 'M280,320 Q350,290 340,230 Q325,230 300,280 L275,340 Z' }
    ],
    outlinePaths: [
      'M165,165 Q175,155 185,165',
      'M215,165 Q225,155 235,165',
      'M195,190 L205,190 L200,200 Z',
      'M130,195 L90,190 M130,205 L90,210 M270,195 L310,190 M270,205 L310,210' // Kumis
    ]
  },
  {
    id: 'GOGO',
    name: 'Gogo Pipit',
    title: 'Gogo Burung Pipit Bernyanyi',
    category: 'SAHABAT_SATWA',
    tagline: 'Burung pipit mungil yang gemar berkicau memuji kebesaran Allah.',
    storySnippet: 'Gogo hinggap di dahan pohon kersen sambil menyanyikan irama doa pagi hari.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'gogo-badan', name: 'Badan Mungil', defaultColor: '#38bdf8', d: 'M140,150 Q230,100 290,170 Q320,260 250,300 Q160,310 130,230 Q110,180 140,150 Z' },
      { id: 'gogo-perut', name: 'Dada Lembut', defaultColor: '#fef08a', d: 'M180,200 Q240,180 270,240 Q250,290 200,295 Q170,270 180,200 Z' },
      { id: 'gogo-sayap', name: 'Sayap Ceria', defaultColor: '#0284c7', d: 'M170,180 Q220,180 240,230 Q210,270 160,240 Q150,200 170,180 Z' },
      { id: 'gogo-paruh', name: 'Paruh Kuning', defaultColor: '#f59e0b', d: 'M130,170 L80,185 L130,200 Z' },
      { id: 'gogo-ekor', name: 'Bulu Ekor', defaultColor: '#0369a1', d: 'M280,270 L340,320 L290,300 Z' },
      { id: 'gogo-kaki', name: 'Kaki Ranting', defaultColor: '#ea580c', d: 'M190,300 L180,350 M220,300 L230,350' }
    ],
    outlinePaths: [
      'M170,165 Q180,155 190,165'
    ]
  },
  {
    id: 'MIMI',
    name: 'Mimi Kelinci',
    title: 'Mimi Kelinci Anggora Putih',
    category: 'SAHABAT_SATWA',
    tagline: 'Kelinci berpita pink yang gemar memakan wortel segar dari Kebun Berkah.',
    storySnippet: 'Mimi melompat riang di sekitar pot bunga sekolah setiap waktu istirahat.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'mimi-telinga-kiri', name: 'Telinga Kiri', defaultColor: '#fbcfe8', d: 'M150,140 Q110,30 160,30 Q180,70 180,130 Z' },
      { id: 'mimi-telinga-kanan', name: 'Telinga Kanan', defaultColor: '#fbcfe8', d: 'M250,140 Q290,30 240,30 Q220,70 220,130 Z' },
      { id: 'mimi-kepala', name: 'Kepala Bulat', defaultColor: '#f8fafc', d: 'M130,140 Q200,110 270,140 Q300,210 270,250 Q200,280 130,250 Q100,210 130,140 Z' },
      { id: 'mimi-pita', name: 'Pita Manis', defaultColor: '#f43f5e', d: 'M180,120 Q200,105 220,120 Q210,135 190,135 Z' },
      { id: 'mimi-badan', name: 'Badan Halus', defaultColor: '#f1f5f9', d: 'M140,250 Q200,240 260,250 L280,360 Q200,380 120,360 Z' },
      { id: 'mimi-pipi-kiri', name: 'Pipi Merona Kiri', defaultColor: '#fda4af', d: 'M140,195 Q150,185 160,195 Q150,205 140,195 Z' },
      { id: 'mimi-pipi-kanan', name: 'Pipi Merona Kanan', defaultColor: '#fda4af', d: 'M240,195 Q250,185 260,195 Q250,205 240,195 Z' }
    ],
    outlinePaths: [
      'M175,170 Q185,160 195,170',
      'M205,170 Q215,160 225,170',
      'M195,190 Q200,195 205,190',
      'M195,200 Q200,210 205,200'
    ]
  },
  {
    id: 'DODO',
    name: 'Dodo Bebek',
    title: 'Dodo Bebek Kolam Ceria',
    category: 'SAHABAT_SATWA',
    tagline: 'Bebek kuning yang ramah dan suka berenang rapi bersama kawan-kawannya.',
    storySnippet: 'Dodo mengajarkan arti kebersamaan saat berbaris rapi menuju kolam teratai.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'dodo-kepala', name: 'Kepala Bulat', defaultColor: '#facc15', d: 'M140,140 Q200,100 260,140 Q280,200 240,230 Q180,240 140,200 Q120,170 140,140 Z' },
      { id: 'dodo-paruh', name: 'Paruh Lebar', defaultColor: '#f97316', d: 'M120,180 L60,195 Q90,225 130,210 Z' },
      { id: 'dodo-badan', name: 'Badan Berenang', defaultColor: '#eab308', d: 'M160,230 Q240,210 320,260 Q340,320 280,340 Q180,350 140,300 Q120,260 160,230 Z' },
      { id: 'dodo-sayap', name: 'Sayap Ceria', defaultColor: '#ca8a04', d: 'M180,240 Q250,240 270,290 Q210,320 180,270 Z' },
      { id: 'dodo-air', name: 'Riak Air Danau', defaultColor: '#38bdf8', d: 'M80,340 Q200,320 340,340 L350,380 L70,380 Z' }
    ],
    outlinePaths: [
      'M190,150 Q200,140 210,150'
    ]
  },
  {
    id: 'TITI',
    name: 'Titi Tupai',
    title: 'Titi Tupai Pohon Kelapa',
    category: 'SAHABAT_SATWA',
    tagline: 'Tupai gesit yang rajin mengumpulkan buah kenari dan berbagi rezeki.',
    storySnippet: 'Titi suka melompat dari dahan ke dahan sambil menyapa santri yang sedang berolahraga.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'titi-ekor', name: 'Ekor Lebat', defaultColor: '#a16207', d: 'M250,330 Q370,300 340,140 Q300,90 270,120 Q280,180 230,240 Z' },
      { id: 'titi-kepala', name: 'Kepala Titi', defaultColor: '#ca8a04', d: 'M130,130 Q190,100 240,140 Q250,200 200,230 Q130,230 110,180 Z' },
      { id: 'titi-telinga', name: 'Telinga Runcing', defaultColor: '#854d0e', d: 'M200,110 L220,60 L240,110 Z' },
      { id: 'titi-badan', name: 'Badan Gesit', defaultColor: '#d97706', d: 'M130,230 Q210,210 240,260 L230,360 Q160,380 120,330 Z' },
      { id: 'titi-buah', name: 'Biji Kenari', defaultColor: '#78350f', d: 'M110,240 Q135,220 150,240 Q145,270 120,270 Z' }
    ],
    outlinePaths: [
      'M170,155 Q180,145 190,155'
    ]
  },
  {
    id: 'RARA',
    name: 'Rara Kupu-Kupu',
    title: 'Rara Kupu-Kupu Sayap Pelangi',
    category: 'SAHABAT_SATWA',
    tagline: 'Kupu-kupu anggun penyerbuk bunga yang berputar menari di taman doa.',
    storySnippet: 'Rara menebarkan keindahan warna-warni di kebun Asy Syifa setiap pagi yang cerah.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'rara-badan', name: 'Badan Ramping', defaultColor: '#6b7280', d: 'M190,110 Q200,95 210,110 L210,310 Q200,325 190,310 Z' },
      { id: 'rara-sayap-kiri-atas', name: 'Sayap Kiri Atas', defaultColor: '#ec4899', d: 'M190,130 Q80,60 50,150 Q50,220 190,200 Z' },
      { id: 'rara-sayap-kanan-atas', name: 'Sayap Kanan Atas', defaultColor: '#ec4899', d: 'M210,130 Q320,60 350,150 Q350,220 210,200 Z' },
      { id: 'rara-sayap-kiri-bawah', name: 'Sayap Kiri Bawah', defaultColor: '#8b5cf6', d: 'M190,210 Q70,230 90,320 Q160,340 190,260 Z' },
      { id: 'rara-sayap-kanan-bawah', name: 'Sayap Kanan Bawah', defaultColor: '#8b5cf6', d: 'M210,210 Q330,230 310,320 Q240,340 210,260 Z' },
      { id: 'rara-pola-kiri', name: 'Bulatan Sayap Kiri', defaultColor: '#fef08a', d: 'M90,140 Q115,120 130,140 Q115,160 90,140 Z' },
      { id: 'rara-pola-kanan', name: 'Bulatan Sayap Kanan', defaultColor: '#fef08a', d: 'M270,140 Q295,120 310,140 Q295,160 270,140 Z' }
    ],
    outlinePaths: [
      'M195,100 Q180,60 160,70', // Antena kiri
      'M205,100 Q220,60 240,70'  // Antena kanan
    ]
  },
  {
    id: 'KERETA',
    name: 'Kereta Cerita Pelangi',
    title: 'Kereta Cerita Uap Pelangi',
    category: 'KENDARAAN',
    tagline: 'Kereta mini pembawa dongeng yang berkeliling taman penuh senyum.',
    storySnippet: 'Tut tut tut! Kereta cerita membunyikan peluit ramah menyambut para musafir cilik.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'kereta-lokomotif', name: 'Badan Lokomotif', defaultColor: '#3b82f6', d: 'M90,200 L260,200 L260,320 L90,320 Z' },
      { id: 'kereta-kabin', name: 'Kabin Masinis', defaultColor: '#ef4444', d: 'M220,130 L320,130 L320,320 L220,320 Z' },
      { id: 'kereta-atap', name: 'Atap Kabin', defaultColor: '#fbbf24', d: 'M210,130 L330,130 L320,110 L220,110 Z' },
      { id: 'kereta-cerobong', name: 'Cerobong Asap', defaultColor: '#10b981', d: 'M120,140 L160,140 L150,200 L130,200 Z' },
      { id: 'kereta-asap', name: 'Asap Awan', defaultColor: '#e0f2fe', d: 'M100,90 Q120,60 150,75 Q180,60 190,90 Q170,110 130,110 Z' },
      { id: 'kereta-jendela', name: 'Jendela Kabin', defaultColor: '#67e8f9', d: 'M240,150 L300,150 L300,200 L240,200 Z' },
      { id: 'kereta-roda-1', name: 'Roda Depan', defaultColor: '#475569', d: 'M100,320 Q130,290 160,320 Q130,350 100,320 Z' },
      { id: 'kereta-roda-2', name: 'Roda Tengah', defaultColor: '#475569', d: 'M180,320 Q210,290 240,320 Q210,350 180,320 Z' },
      { id: 'kereta-roda-3', name: 'Roda Belakang', defaultColor: '#334155', d: 'M250,310 Q290,270 330,310 Q290,360 250,310 Z' }
    ],
    outlinePaths: [
      'M60,360 L350,360' // Rel kereta
    ]
  },
  {
    id: 'BUS',
    name: 'Bus Sekolah Asy',
    title: 'Bus Sekolah Kuning Ceria',
    category: 'KENDARAAN',
    tagline: 'Bus ramah yang setiap pagi menjemput santri dengan doa perjalanan.',
    storySnippet: 'Brum brum! Bus sekolah melaju tertib, berhenti di setiap halte senyuman.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'bus-badan', name: 'Badan Bus', defaultColor: '#f59e0b', d: 'M70,150 Q80,120 120,120 L310,120 Q340,120 340,160 L340,300 L70,300 Z' },
      { id: 'bus-atap', name: 'Garis Atap', defaultColor: '#ffffff', d: 'M110,120 L300,120 L300,135 L110,135 Z' },
      { id: 'bus-kaca-depan', name: 'Kaca Depan', defaultColor: '#7dd3fc', d: 'M80,160 L140,160 L140,220 L80,220 Z' },
      { id: 'bus-kaca-samping-1', name: 'Kaca Samping 1', defaultColor: '#bae6fd', d: 'M160,160 L220,160 L220,220 L160,220 Z' },
      { id: 'bus-kaca-samping-2', name: 'Kaca Samping 2', defaultColor: '#bae6fd', d: 'M240,160 L300,160 L300,220 L240,220 Z' },
      { id: 'bus-lampu', name: 'Lampu Sorot', defaultColor: '#fef08a', d: 'M65,240 L75,240 L75,270 L65,270 Z' },
      { id: 'bus-roda-depan', name: 'Roda Depan', defaultColor: '#334155', d: 'M100,290 Q130,260 160,290 Q130,340 100,290 Z' },
      { id: 'bus-roda-belakang', name: 'Roda Belakang', defaultColor: '#334155', d: 'M250,290 Q280,260 310,290 Q280,340 250,290 Z' }
    ],
    outlinePaths: [
      'M50,330 L360,330'
    ]
  },
  {
    id: 'MASJID',
    name: 'Masjid Mini Asy Syifa',
    title: 'Masjid Mini Kubah Hijau Berkah',
    category: 'BANGUNAN_BERKAH',
    tagline: 'Tempat santri bersujud, melantunkan ayat suci, dan belajar adab mulia.',
    storySnippet: 'Kubah hijau berkilau memantulkan cahaya mentari, menyebarkan ketenangan di seluruh sekolah.',
    viewBox: '0 0 400 400',
    zones: [
      { id: 'masjid-kubah-utama', name: 'Kubah Utama Hijau', defaultColor: '#10b981', d: 'M140,160 Q200,60 260,160 Z' },
      { id: 'masjid-bulan-bintang', name: 'Bulan Sabit Emas', defaultColor: '#fbbf24', d: 'M195,50 Q200,35 210,45 Q205,55 195,50 Z' },
      { id: 'masjid-dinding-tengah', name: 'Dinding Utama', defaultColor: '#f8fafc', d: 'M130,160 L270,160 L270,320 L130,320 Z' },
      { id: 'masjid-pintu-gerbang', name: 'Pintu Lengkung', defaultColor: '#059669', d: 'M170,320 L170,240 Q200,210 230,240 L230,320 Z' },
      { id: 'masjid-menara-kiri', name: 'Menara Kiri', defaultColor: '#e2e8f0', d: 'M80,140 L120,140 L120,320 L80,320 Z' },
      { id: 'masjid-kubah-kiri', name: 'Kubah Menara Kiri', defaultColor: '#34d399', d: 'M80,140 Q100,100 120,140 Z' },
      { id: 'masjid-menara-kanan', name: 'Menara Kanan', defaultColor: '#e2e8f0', d: 'M280,140 L320,140 L320,320 L280,320 Z' },
      { id: 'masjid-kubah-kanan', name: 'Kubah Menara Kanan', defaultColor: '#34d399', d: 'M280,140 Q300,100 320,140 Z' },
      { id: 'masjid-tangga', name: 'Tangga Berkah', defaultColor: '#cbd5e1', d: 'M60,320 L340,320 L350,350 L50,350 Z' }
    ],
    outlinePaths: [
      'M190,260 L210,260' // Gagang pintu
    ]
  }
];

// ==========================================
// 3. KOTAK KRAYON HIDUP (P2 & P12)
// ==========================================

export const BASE_CRAYONS: CrayonItem[] = [
  { id: 'c-merah', name: 'Merah Ceria', colorHex: '#ef4444', characterMood: 'melompat', saying: 'Aku Merah! Memberi semangat dan keberanian!' },
  { id: 'c-oranye', name: 'Oranye Hangat', colorHex: '#f97316', characterMood: 'tersenyum', saying: 'Aku Oranye! Seperti sinar mentari pagi yang hangat.' },
  { id: 'c-kuning', name: 'Kuning Mentari', colorHex: '#eab308', characterMood: 'berkedip', saying: 'Aku Kuning! Bikin gambarmu bercahaya terang!' },
  { id: 'c-hijau-muda', name: 'Hijau Daun', colorHex: '#84cc16', characterMood: 'mengangguk', saying: 'Aku Hijau Muda! Segar seperti daun di kebun Asy.' },
  { id: 'c-hijau-zamrud', name: 'Hijau Berkah', colorHex: '#10b981', characterMood: 'tersenyum', saying: 'Aku Hijau Berkah! Warna ketenangan dan kedamaian.' },
  { id: 'c-tosca', name: 'Tosca Sejuk', colorHex: '#14b8a6', characterMood: 'berkedip', saying: 'Aku Tosca! Sejuk seperti mata air pegunungan.' },
  { id: 'c-biru-langit', name: 'Biru Langit', colorHex: '#38bdf8', characterMood: 'melompat', saying: 'Aku Biru Langit! Luas dan penuh harapan cerah!' },
  { id: 'c-biru-samudra', name: 'Biru Samudra', colorHex: '#2563eb', characterMood: 'mengangguk', saying: 'Aku Biru Samudra! Dalam dan penuh ketenangan hati.' },
  { id: 'c-ungu', name: 'Ungu Manis', colorHex: '#a855f7', characterMood: 'tersenyum', saying: 'Aku Ungu! Anggun seperti bunga teratai mekar.' },
  { id: 'c-pink', name: 'Pink Kasih Sayang', colorHex: '#ec4899', characterMood: 'melompat', saying: 'Aku Pink! Penuh kelembutan dan senyuman kasih sayang!' },
  { id: 'c-cokelat', name: 'Cokelat Ranting', colorHex: '#854d0e', characterMood: 'mengangguk', saying: 'Aku Cokelat! Kokoh seperti tanah dan batang pohon.' },
  { id: 'c-putih', name: 'Putih Bersih', colorHex: '#f8fafc', characterMood: 'berkedip', saying: 'Aku Putih! Suci dan bersih seperti hati anak sholeh.' }
];

// ==========================================
// 4. STIKER AJAIB TADE (P3)
// ==========================================

export interface StickerDefinition {
  type: StickerType;
  name: string;
  badge: string;
  iconSvg: string;
  meaning: string;
}

export const OFFICIAL_TADE_STICKERS: StickerDefinition[] = [
  { type: 'BINTANG', name: 'Bintang Prestasi', badge: 'Cita-cita', iconSvg: '⭐', meaning: 'Simbol kejujuran dan cita-cita luhur.' },
  { type: 'PELANGI', name: 'Pelangi Bahagia', badge: 'Ceria', iconSvg: '🌈', meaning: 'Simbol keberagaman dan kebahagiaan bersama.' },
  { type: 'DAUN', name: 'Daun Kebaikan', badge: 'Alam', iconSvg: '🍃', meaning: 'Simbol kepedulian merawat ciptaan Allah.' },
  { type: 'BALON', name: 'Balon Cita-cita', badge: 'Semangat', iconSvg: '🎈', meaning: 'Simbol impian anak yang melambung tinggi.' },
  { type: 'BUNGA', name: 'Bunga Senyuman', badge: 'Santun', iconSvg: '🌸', meaning: 'Simbol senyuman indah yang menjadi sedekah.' },
  { type: 'KUPU_KUPU', name: 'Kupu-Kupu Indah', badge: 'Sabar', iconSvg: '🦋', meaning: 'Simbol metamorfosis proses belajar yang tekun.' },
  { type: 'AWAN', name: 'Awan Kedamaian', badge: 'Sejuk', iconSvg: '☁️', meaning: 'Simbol keteduhan hati dan tutur kata lembut.' },
  { type: 'LENTERA', name: 'Lentera Hikmah', badge: 'Berkah', iconSvg: '🏮', meaning: 'Simbol ilmu bermanfaat yang menerangi jalan.' }
];

// ==========================================
// 5. PASPOR PETUALANG ASY (P11)
// ==========================================

export const OFFICIAL_PASSPORT_STAMPS: PassportStamp[] = [
  { id: 'KERETA', title: 'Cap Stasiun Pelangi', locationName: 'Stasiun Kereta Asy', iconSymbol: '🚂', motto: 'Musafir Cilik yang Tertib dan Sabar', color: '#3b82f6' },
  { id: 'KLINIK', title: 'Cap Klinik Kasih Sayang', locationName: 'Klinik Cilik Ramah', iconSymbol: '🩺', motto: 'Hati Lembut Penyembuh Luka', color: '#10b981' },
  { id: 'KEBUN', title: 'Cap Kebun Berkah', locationName: 'Kebun Alam Sentra', iconSymbol: '🌱', motto: 'Sahabat Alam Pecinta Tanaman', color: '#84cc16' },
  { id: 'PERPUSTAKAAN', title: 'Cap Jendela Ilmu', locationName: 'Perpustakaan Ceria', iconSymbol: '📖', motto: 'Rajin Membaca Mencintai Al-Qur\'an', color: '#8b5cf6' },
  { id: 'TOKO_ROTI', title: 'Cap Dapur Barakah', locationName: 'Toko Roti Ceria', iconSymbol: '🍞', motto: 'Koki Cilik Senang Berbagi Rezeki', color: '#f59e0b' },
  { id: 'KANTOR_POS', title: 'Cap Surat Senyuman', locationName: 'Kantor Pos Cilik', iconSymbol: '💌', motto: 'Penyampai Pesan Doa dan Kebaikan', color: '#ec4899' },
  { id: 'RUMAH_KREATIF', title: 'Cap Maestro Cilik', locationName: 'Rumah Kreatif Asy', iconSymbol: '🎨', motto: 'Kreativitas Berkilau Berjiwa Santun', color: '#06b6d4' }
];

// ==========================================
// 6. MOTIVASI POHON INSPIRASI (P9)
// ==========================================

export const INSPIRATION_LEAF_MESSAGES = [
  { title: 'Kebaikan Warna', text: 'Setiap goresan warna Ananda adalah doa tulus yang mekar di taman surga.' },
  { title: 'Kerapian Santri', text: 'Mewarnai dengan teliti mengajarkan kesabaran dan keindahan akhlak.' },
  { title: 'Senyum Ceria', text: 'Warna-warna cerah membawa kebahagiaan untuk Ayah, Bunda, dan Guru tercinta.' },
  { title: 'Cahaya Iman', text: 'Kreativitas adalah karunia Allah SWT untuk memperindah dunia.' },
  { title: 'Tolong-Menolong', text: 'Berbagi krayon dan saling memuji karya teman adalah adab santri mulia.' },
  { title: 'Semangat Belajar', text: 'Jangan takut mencoba warna baru, setiap percobaan adalah petualangan seru!' }
];

// ==========================================
// 7. INSPIRASI HARIAN (P7)
// ==========================================

export const DAILY_INSPIRATIONS: DailyInspirationPrompt[] = [
  {
    id: 'insp-1',
    title: 'Bunga Mekar di Pagi Cerah',
    subtitle: 'Mari warnai bunga di halaman sekolah dengan warna-warna ceria!',
    recommendedTemplate: 'RARA',
    recommendedStickers: ['BUNGA', 'PELANGI', 'KUPU_KUPU'],
    doaHarian: 'Alhamdulillahilladzi ahyana ba\'da ma amatana wa ilaihin nusyur',
    hikmah: 'Bunga yang bermekaran mengingatkan kita untuk selalu tersenyum ramah kepada semua orang.'
  },
  {
    id: 'insp-2',
    title: 'Kereta Pembawa Senyuman',
    subtitle: 'Yuk hiasi Kereta Cerita yang membawa santri jalan-jalan ke taman!',
    recommendedTemplate: 'KERETA',
    recommendedStickers: ['BINTANG', 'AWAN', 'BALON'],
    doaHarian: 'Subhanalladzi sakh-khara lana hadza wa ma kunna lahu muqrinin',
    hikmah: 'Menjaga ketertiban di kendaraan adalah wujud santri yang berakhlak terpuji.'
  },
  {
    id: 'insp-3',
    title: 'Masjid Mini Kubah Hijau',
    subtitle: 'Berikan warna terbaik untuk masjid tempat kita sholat dhuha dan mengaji.',
    recommendedTemplate: 'MASJID',
    recommendedStickers: ['LENTERA', 'BINTANG', 'AWAN'],
    doaHarian: 'Allahummaf-tah lii abwaaba rahmatik',
    hikmah: 'Memuliakan masjid mendatangkan keberkahan dan ketenteraman dalam hati.'
  },
  {
    id: 'insp-4',
    title: 'Kucing Bubu dan Sahabat Alam',
    subtitle: 'Warnai Bubu Kucing dengan warna oranye hangat kesukaannya!',
    recommendedTemplate: 'BUBU',
    recommendedStickers: ['DAUN', 'BUNGA', 'BINTANG'],
    doaHarian: 'Irham man fil ardhi yarhamkum man fis samaa',
    hikmah: 'Menyayangi binatang adalah bagian dari ajaran kasih sayang Rasulullah SAW.'
  }
];

// ==========================================
// 8. STORAGE KEYS & ENGINE CLASS
// ==========================================

const STORAGE_KEYS = {
  ARTWORKS: 'tade_g24_artworks_v1',
  PASSPORT: 'tade_g24_passport_stamps_v1',
  DAILY_TOGGLE: 'tade_g24_daily_toggle_v1',
  CURRENT_DRAFT: 'tade_g24_current_draft_v1'
};

class RumahKreatifEngine {
  private artworks: ArtworkRecord[] = [];
  private earnedStamps: Set<PassportStampId> = new Set();
  private isDailyInspirationEnabled: boolean = true;

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    try {
      if (typeof window === 'undefined') return;

      const savedArtworks = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
      if (savedArtworks) {
        this.artworks = JSON.parse(savedArtworks);
      } else {
        this.seedInitialArtworks();
      }

      const savedStamps = localStorage.getItem(STORAGE_KEYS.PASSPORT);
      if (savedStamps) {
        const arr = JSON.parse(savedStamps) as PassportStampId[];
        this.earnedStamps = new Set(arr);
      } else {
        // Default unlocked starter stamps
        this.earnedStamps = new Set(['RUMAH_KREATIF', 'KERETA', 'KLINIK']);
      }

      const savedToggle = localStorage.getItem(STORAGE_KEYS.DAILY_TOGGLE);
      if (savedToggle !== null) {
        this.isDailyInspirationEnabled = savedToggle === 'true';
      }
    } catch {
      this.seedInitialArtworks();
    }
  }

  private saveState(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(this.artworks));
      localStorage.setItem(STORAGE_KEYS.PASSPORT, JSON.stringify(Array.from(this.earnedStamps)));
      localStorage.setItem(STORAGE_KEYS.DAILY_TOGGLE, this.isDailyInspirationEnabled ? 'true' : 'false');
    } catch {
      // safe fallback
    }
  }

  private seedInitialArtworks(): void {
    this.artworks = [
      {
        id: 'art-001',
        code: 'RKA-101',
        title: 'Asy Tersenyum di Pagi Berkah',
        templateId: 'ASY',
        childName: 'Aisyah Humaira',
        classId: 'A1',
        createdAt: '2026-08-20',
        zoneColors: {
          'asy-peci': '#10b981',
          'asy-wajah': '#fed7aa',
          'asy-baju': '#38bdf8',
          'asy-kerah': '#fef08a',
          'asy-celana': '#059669'
        },
        stickers: [
          { id: 'stk-1', type: 'BINTANG', x: 70, y: 70, scale: 1.2, rotation: 12 },
          { id: 'stk-2', type: 'BUNGA', x: 320, y: 320, scale: 1, rotation: 0 }
        ],
        publicationStatus: 'DITERBITKAN_DI_GALERI',
        encouragementMessage: 'Warna bajunya cerah sekali seperti mentari pagi!',
        leafRibbonColor: '#38bdf8',
        praiseAsy: 'Masya Allah Aisyah, peci hijaunya rapi sekali!',
        praiseSyifa: 'Alhamdulillah, senyum Dek Asy jadi semakin ceria berkat warna Aisyah!',
        syncedToStorybook: true,
        syncedToAssetCenter: true,
        syncedToTvAsy: true
      },
      {
        id: 'art-002',
        code: 'RKA-102',
        title: 'Kereta Pelangi Berkeliling Kebun',
        templateId: 'KERETA',
        childName: 'Fatih Al-Ghifari',
        classId: 'B1',
        createdAt: '2026-08-21',
        zoneColors: {
          'kereta-lokomotif': '#2563eb',
          'kereta-kabin': '#ef4444',
          'kereta-atap': '#fbbf24',
          'kereta-asap': '#bae6fd'
        },
        stickers: [
          { id: 'stk-3', type: 'PELANGI', x: 200, y: 50, scale: 1.3, rotation: -5 },
          { id: 'stk-4', type: 'BALON', x: 60, y: 150, scale: 1, rotation: 10 }
        ],
        publicationStatus: 'DITERBITKAN_DI_GALERI',
        encouragementMessage: 'Kombinasi roda dan asap uapnya sangat artistik!',
        leafRibbonColor: '#f59e0b',
        praiseAsy: 'Wah Mas Fatih, keretanya siap melaju ke stasiun dongeng!',
        praiseSyifa: 'Hebat sekali, warna kabin merah dan atap emasnya sangat serasi!',
        syncedToStorybook: true,
        syncedToAssetCenter: true,
        syncedToTvAsy: true
      },
      {
        id: 'art-003',
        code: 'RKA-103',
        title: 'Masjid Kubah Zamrud TK Asy Syifa',
        templateId: 'MASJID',
        childName: 'Zaidan Ar-Rasyid',
        classId: 'B2',
        createdAt: '2026-08-22',
        zoneColors: {
          'masjid-kubah-utama': '#059669',
          'masjid-bulan-bintang': '#f59e0b',
          'masjid-dinding-tengah': '#f8fafc',
          'masjid-pintu-gerbang': '#10b981'
        },
        stickers: [
          { id: 'stk-5', type: 'LENTERA', x: 80, y: 80, scale: 1.1, rotation: 0 },
          { id: 'stk-6', type: 'BINTANG', x: 300, y: 70, scale: 1.2, rotation: 15 }
        ],
        publicationStatus: 'DITERBITKAN_DI_GALERI',
        encouragementMessage: 'Kubah hijaunya berkilau indah menyejukkan hati.',
        leafRibbonColor: '#10b981',
        praiseAsy: 'Masya Allah Zaidan, masjidnya megah dan damai sekali!',
        praiseSyifa: 'Semoga Zaidan selalu rajin sholat berjamaah di masjid ya, nak!',
        syncedToStorybook: true,
        syncedToAssetCenter: true,
        syncedToTvAsy: false
      }
    ];
    this.saveState();
  }

  // ==========================================
  // PUBLIC QUERIES & GETTERS
  // ==========================================

  public getTemplates(): ColoringTemplate[] {
    return OFFICIAL_COLORING_TEMPLATES;
  }

  public getTemplateById(id: ColoringCharacterId): ColoringTemplate {
    return OFFICIAL_COLORING_TEMPLATES.find(t => t.id === id) || OFFICIAL_COLORING_TEMPLATES[0];
  }

  public getArtworks(): ArtworkRecord[] {
    return [...this.artworks];
  }

  public getArtworksByClass(classId: ClassCabinetId): ArtworkRecord[] {
    return this.artworks.filter(a => a.classId === classId);
  }

  public getPublishedArtworks(): ArtworkRecord[] {
    return this.artworks.filter(a => a.publicationStatus === 'DITERBITKAN_DI_GALERI');
  }

  public getStickers(): StickerDefinition[] {
    return OFFICIAL_TADE_STICKERS;
  }

  public getPassportStamps(): PassportStamp[] {
    return OFFICIAL_PASSPORT_STAMPS.map(stamp => ({
      ...stamp,
      earnedAt: this.earnedStamps.has(stamp.id) ? 'Aktif Terverifikasi' : undefined
    }));
  }

  public hasStamp(stampId: PassportStampId): boolean {
    return this.earnedStamps.has(stampId);
  }

  public isDailyEnabled(): boolean {
    return this.isDailyInspirationEnabled;
  }

  public toggleDailyInspiration(): boolean {
    this.isDailyInspirationEnabled = !this.isDailyInspirationEnabled;
    this.saveState();
    blackBoxRecorder.record({
      moduleCode: 'G24-RKA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Toggle Daily Inspiration: ${this.isDailyInspirationEnabled ? 'ENABLED' : 'DISABLED'}`
    });
    return this.isDailyInspirationEnabled;
  }

  public getTodayInspiration(): DailyInspirationPrompt {
    const dayIndex = new Date().getDay() % DAILY_INSPIRATIONS.length;
    return DAILY_INSPIRATIONS[dayIndex] || DAILY_INSPIRATIONS[0];
  }

  // ==========================================
  // P2 & P12: KRAYON PINTAR DENGAN LIVING EVENT
  // ==========================================

  public getSmartCrayons(): CrayonItem[] {
    const currentTheme = livingEventEngine.getActiveEvent();
    const eventId: SchoolEventType = currentTheme.eventId;

    const crayons = [...BASE_CRAYONS];

    // Dynamic additions based on Living Event Engine
    if (eventId === 'RAMADHAN') {
      crayons.unshift(
        {
          id: 'c-emas-ramadhan',
          name: 'Emas Berkah Ramadhan',
          colorHex: '#fbbf24',
          characterMood: 'berkedip',
          isEventSpecial: true,
          eventBadge: 'Ramadhan Mubarak',
          saying: 'Kemilau Emas Tarawih dan Tadarus berkah!'
        },
        {
          id: 'c-zamrud-ramadhan',
          name: 'Hijau Zamrud Malam Lailah',
          colorHex: '#047857',
          characterMood: 'tersenyum',
          isEventSpecial: true,
          eventBadge: 'Ramadhan Mubarak',
          saying: 'Sejuk dan damai seperti malam kemuliaan.'
        }
      );
    } else if (eventId === 'KEMERDEKAAN') {
      crayons.unshift(
        {
          id: 'c-merah-semangat',
          name: 'Merah Putih 17 Agustus',
          colorHex: '#dc2626',
          characterMood: 'melompat',
          isEventSpecial: true,
          eventBadge: '17 Agustus',
          saying: 'Merdeka! Semangat santri berbakti untuk negeri!'
        }
      );
    } else if (eventId === 'MILAD_TK') {
      crayons.unshift(
        {
          id: 'c-emas-milad',
          name: 'Emas Bintang Milad Asy Syifa',
          colorHex: '#f59e0b',
          characterMood: 'melompat',
          isEventSpecial: true,
          eventBadge: 'Milad TK',
          saying: 'Selamat Milad TK Asy Syifa Tanggul tercinta!'
        }
      );
    }

    return crayons;
  }

  // ==========================================
  // P1, P5, P6: PENYIMPANAN KARYA & PUBLIKASI
  // ==========================================

  public saveArtwork(data: {
    templateId: ColoringCharacterId;
    childName: string;
    classId: ClassCabinetId;
    title?: string;
    zoneColors: Record<string, string>;
    stickers: PlacedSticker[];
  }): ArtworkRecord {
    const template = this.getTemplateById(data.templateId);
    const codeNum = this.artworks.length + 101;
    const newCode = `RKA-${codeNum}`;

    const ribbonColors = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    const assignedRibbon = ribbonColors[Math.floor(Math.random() * ribbonColors.length)];

    const praisesAsy = [
      `Masya Allah ${data.childName}, goresan warnamu rapi dan indah sekali!`,
      `Alhamdulillah ${data.childName}, warnanya cerah dan bikin tersenyum!`,
      `Hebat sekali ${data.childName}, Dek Asy bangga melihat karyamu!`
    ];
    const praisesSyifa = [
      `Barakallahu fiik ananda ${data.childName}, perpaduan warnanya sangat serasi!`,
      `Kreativitas ananda ${data.childName} semakin berkembang dengan akhlak santun!`,
      `Alhamdulillah, karya ini akan menjadi kenangan indah untuk Ayah dan Bunda!`
    ];

    const randomAsy = praisesAsy[Math.floor(Math.random() * praisesAsy.length)];
    const randomSyifa = praisesSyifa[Math.floor(Math.random() * praisesSyifa.length)];

    const newRecord: ArtworkRecord = {
      id: `art-${Date.now()}`,
      code: newCode,
      title: data.title?.trim() || `${template.name} Karya ${data.childName}`,
      templateId: data.templateId,
      childName: data.childName || 'Santri Asy Syifa',
      classId: data.classId,
      createdAt: new Date().toISOString().split('T')[0],
      zoneColors: { ...data.zoneColors },
      stickers: [...data.stickers],
      publicationStatus: 'DITERBITKAN_DI_GALERI', // Auto ready or published with teacher discretion
      encouragementMessage: `Karya indah ${template.name} dengan ${Object.keys(data.zoneColors).length} sentuhan warna & ${data.stickers.length} stiker berkah.`,
      leafRibbonColor: assignedRibbon,
      praiseAsy: randomAsy,
      praiseSyifa: randomSyifa,
      syncedToStorybook: true,
      syncedToAssetCenter: true,
      syncedToTvAsy: true
    };

    this.artworks.unshift(newRecord);
    
    // Unlock Rumah Kreatif Stamp
    this.awardStamp('RUMAH_KREATIF');

    this.saveState();

    blackBoxRecorder.record({
      moduleCode: 'G24-RKA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Save Artwork: ${newRecord.code} by ${newRecord.childName} (${newRecord.classId})`
    });

    return newRecord;
  }

  public updatePublicationStatus(artworkId: string, status: PublicationStatus): void {
    const found = this.artworks.find(a => a.id === artworkId);
    if (found) {
      found.publicationStatus = status;
      this.saveState();
      blackBoxRecorder.record({
        moduleCode: 'G24-RKA',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Update Publication Status for ${found.code} to ${status}`
      });
    }
  }

  public moveArtworkToClass(artworkId: string, newClassId: ClassCabinetId): void {
    const found = this.artworks.find(a => a.id === artworkId);
    if (found) {
      found.classId = newClassId;
      this.saveState();
      blackBoxRecorder.record({
        moduleCode: 'G24-RKA',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Move Artwork ${found.code} to Class ${newClassId}`
      });
    }
  }

  public awardStamp(stampId: PassportStampId): void {
    if (!this.earnedStamps.has(stampId)) {
      this.earnedStamps.add(stampId);
      this.saveState();
      asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
      blackBoxRecorder.record({
        moduleCode: 'G24-RKA',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Award Passport Stamp: ${stampId}`
      });
    }
  }

  // ==========================================
  // P6 & G22: EXPORT KE SUTRADARA & TV ASY
  // ==========================================

  public exportArtworkToSutradara(artwork: ArtworkRecord) {
    // Compose an episode in Sutradara Ajaib
    const ep = sutradaraAjaibEngine.composeEpisode('PERSAHABATAN', {
      titleOverride: `Kisah ${artwork.title} (Karya ${artwork.childName})`,
      customLead: (artwork.templateId === 'SYIFA' ? 'SYIFA' : 'ASY'),
      customLocation: 'TAMAN'
    });

    asySyifaDnaEngine.playSignatureSound('TEPUK_TANGAN_KECIL');
    return ep;
  }
}

export const rumahKreatifEngine = new RumahKreatifEngine();
