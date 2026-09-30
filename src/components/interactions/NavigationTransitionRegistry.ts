export type RouteTransitionType =
  | 'GARDEN_ZOOM'
  | 'BOOK_REVEAL'
  | 'CARD_FLOW'
  | 'PORTRAIT_EXPANSION'
  | 'PHOTO_TUNNEL'
  | 'PHOTO_EXPANSION'
  | 'STORY_STACK'
  | 'TROPHY_RISE'
  | 'GATE_OPENING'
  | 'JOURNEY_ZOOM'
  | 'DEFAULT';

export interface TransitionMeta {
  type: RouteTransitionType;
  title: string;
  subtitle: string;
  iconName: string;
  durationMs: number;
}

export class NavigationTransitionRegistry {
  private static transitions: Record<string, RouteTransitionType> = {
    'w1_w2': 'GARDEN_ZOOM',         // BERANDA -> PROFIL
    'w2_w2_program': 'BOOK_REVEAL', // PROFIL -> PROGRAM
    'w2_program_guru': 'CARD_FLOW', // PROGRAM -> GURU
    'guru_profile': 'PORTRAIT_EXPANSION', // GURU -> PROFIL GURU
    'w2_w3': 'PHOTO_TUNNEL',        // PROFIL -> GALERI
    'gallery_detail': 'PHOTO_EXPANSION', // GALERI -> FOTO DETAIL
    'w3_news': 'STORY_STACK',       // BERITA -> ARTIKEL
    'achievement_detail': 'TROPHY_RISE', // PRESTASI -> DETAIL
    'w1_w4': 'GATE_OPENING',        // BERANDA -> PPDB
    'w4_form': 'GATE_OPENING',      // PPDB -> FORM
    'w1_w5': 'JOURNEY_ZOOM',       // BERANDA -> KONTAK
    'w5_map': 'JOURNEY_ZOOM',       // KONTAK -> MAP
  };

  public static resolveTransition(fromTab?: string, toTab?: string): RouteTransitionType {
    if (!fromTab || !toTab) return 'DEFAULT';

    const key = `${fromTab}_${toTab}`;
    if (this.transitions[key]) return this.transitions[key];

    if (toTab === 'w2') return 'BOOK_REVEAL';
    if (toTab === 'w3') return 'PHOTO_TUNNEL';
    if (toTab === 'w4') return 'GATE_OPENING';
    if (toTab === 'w5') return 'JOURNEY_ZOOM';

    return 'GARDEN_ZOOM';
  }

  public static getTransitionMeta(type: RouteTransitionType): TransitionMeta {
    switch (type) {
      case 'GARDEN_ZOOM':
        return {
          type,
          title: 'Memasuki Taman Belajar Asy Syifa',
          subtitle: 'Menjelajahi Lingkungan Asri & Islami',
          iconName: 'Compass',
          durationMs: 600,
        };
      case 'BOOK_REVEAL':
        return {
          type,
          title: 'Membuka Lembaran Visi & Program',
          subtitle: 'Kurikulum Merdeka PAUD 5 Sentra',
          iconName: 'BookOpen',
          durationMs: 650,
        };
      case 'CARD_FLOW':
        return {
          type,
          title: 'Melihat Jajaran Sentra & Pendidik',
          subtitle: 'Bimbingan Penuh Kasih & Keteladanan',
          iconName: 'Layers',
          durationMs: 500,
        };
      case 'PORTRAIT_EXPANSION':
        return {
          type,
          title: 'Profil Ustadzah & Pendidik',
          subtitle: 'Dewan Guru Tersertifikasi & Berdedikasi',
          iconName: 'UserCheck',
          durationMs: 500,
        };
      case 'PHOTO_TUNNEL':
        return {
          type,
          title: 'Lorong Galeri Momen Ceria',
          subtitle: 'Dokumentasi Aktivitas & Prestasi Siswa',
          iconName: 'Camera',
          durationMs: 600,
        };
      case 'PHOTO_EXPANSION':
        return {
          type,
          title: 'Membuka Detail Foto Dokumentasi',
          subtitle: 'Momen Berharga Pembelajaran Anak',
          iconName: 'Maximize2',
          durationMs: 450,
        };
      case 'STORY_STACK':
        return {
          type,
          title: 'Membaca Artikel & Kabar Asy Syifa',
          subtitle: 'Informasi Kegiatan & Pengumuman Sekolah',
          iconName: 'Newspaper',
          durationMs: 550,
        };
      case 'TROPHY_RISE':
        return {
          type,
          title: 'Dinding Kebanggaan & Prestasi',
          subtitle: 'Apresiasi Bakat & Potensi Santri Cilik',
          iconName: 'Trophy',
          durationMs: 600,
        };
      case 'GATE_OPENING':
        return {
          type,
          title: 'Membuka Gerbang Portal PPDB Online',
          subtitle: 'Pendaftaran Santri Baru Tahun Ajaran 2026/2027',
          iconName: 'DoorOpen',
          durationMs: 700,
        };
      case 'JOURNEY_ZOOM':
        return {
          type,
          title: 'Journey Zoom: Kampus Tanggul Wetan',
          subtitle: 'Peta Lokasi & Kontak Sekretariat Asy Syifa',
          iconName: 'MapPin',
          durationMs: 650,
        };
      default:
        return {
          type: 'DEFAULT',
          title: 'Memasuki Dunia Asy Syifa',
          subtitle: 'TK Islam Moderen Tanggul Jember',
          iconName: 'Sparkles',
          durationMs: 500,
        };
    }
  }
}
