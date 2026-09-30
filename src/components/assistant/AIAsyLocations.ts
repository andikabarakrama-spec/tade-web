export type VirtualLocation =
  | 'SCHOOL_GATE'
  | 'CLASSROOM'
  | 'LIBRARY'
  | 'PLAYGROUND'
  | 'GARDEN'
  | 'ADMIN_OFFICE'
  | 'PRAYER_AREA'
  | 'GALLERY'
  | 'HALL';

export interface LocationInfo {
  name: string;
  indonesianLabel: string;
  description: string;
  ambientEmoji: string;
}

export const VIRTUAL_LOCATIONS: Record<VirtualLocation, LocationInfo> = {
  SCHOOL_GATE: {
    name: 'School Gate',
    indonesianLabel: 'Gerbang Sekolah TK',
    description: 'Tempat penyambutan ceria Ayah, Bunda & Santri Cilik.',
    ambientEmoji: '🏫'
  },
  CLASSROOM: {
    name: 'Classroom',
    indonesianLabel: 'Ruang Kelas Belajar',
    description: 'Tempat sinergi belajar, membaca, dan menggambar.',
    ambientEmoji: '🎨'
  },
  LIBRARY: {
    name: 'Library',
    indonesianLabel: 'Perpustakaan Santri',
    description: 'Ruang membaca buku cerita dan literasi Islam.',
    ambientEmoji: '📚'
  },
  PLAYGROUND: {
    name: 'Playground',
    indonesianLabel: 'Taman Bermain Outdoor',
    description: 'Area olah raga, ayunan, dan kebersamaan santri.',
    ambientEmoji: '🛝'
  },
  GARDEN: {
    name: 'Garden',
    indonesianLabel: 'Taman & Kebun Sekolah',
    description: 'Area hijau bercocok tanam dan merawat alam.',
    ambientEmoji: '🌷'
  },
  ADMIN_OFFICE: {
    name: 'Administration Office',
    indonesianLabel: 'Ruang Tata Usaha & SIM',
    description: 'Pusat layanan administrasi & pengelolaan sistem.',
    ambientEmoji: '💻'
  },
  PRAYER_AREA: {
    name: 'Prayer Area',
    indonesianLabel: 'Musholla Santri',
    description: 'Tempat wudhu, sholat berjamah, dan murajaah hafalan.',
    ambientEmoji: '🕌'
  },
  GALLERY: {
    name: 'Gallery',
    indonesianLabel: 'Galeri Karya & Prestasi',
    description: 'Pameran kreasi seni dan dokumentasi momen indah.',
    ambientEmoji: '🖼️'
  },
  HALL: {
    name: 'Hall',
    indonesianLabel: 'Aula Utama Sekolah',
    description: 'Pusat perayaan, wisuda, dan pertemuan wali murid.',
    ambientEmoji: '🏛️'
  }
};
