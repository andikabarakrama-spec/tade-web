/**
 * TADE RC99 — R816: Template Intelligence Hub
 * Pustaka template original TADE untuk kegiatan TK Islami: Senam, Tahfidz, Mewarnai, Manasik, Wisuda, Ramadhan, Hari Guru.
 * Status: Viral, Baru, Rekomendasi.
 */

export interface CreativeTemplateItem {
  id: string;
  name: string;
  category: 'SENAM' | 'TAHFIDZ' | 'MEWARNAI' | 'MANASIK' | 'WISUDA' | 'RAMADHAN' | 'HARI_GURU';
  statusTag: 'VIRAL' | 'BARU' | 'REKOMENDASI';
  colorTheme: string;
  defaultTitle: string;
  defaultSubtitle: string;
  badgeLabel: string;
  usesCount: number;
  ratingScore: number;
  previewGradient: string;
  accentIconName: string;
  description: string;
}

export class TemplateIntelligenceHub {
  private static instance: TemplateIntelligenceHub | null = null;

  public static readonly TEMPLATES: CreativeTemplateItem[] = [
    {
      id: 'tmpl-senam-ceria',
      name: 'Senam Irama Santri Ceria',
      category: 'SENAM',
      statusTag: 'VIRAL',
      colorTheme: 'from-emerald-600 to-teal-800',
      defaultTitle: 'Sehat & Ceria Bersama Santri TK Asy Syifa',
      defaultSubtitle: 'Senam Pagi Pembiasaan Motorik Kasar & Disiplin',
      badgeLabel: '🏃 OLAHRAGA SEHAT',
      usesCount: 342,
      ratingScore: 4.9,
      previewGradient: 'from-emerald-900 via-teal-900 to-slate-900',
      accentIconName: 'Activity',
      description: 'Framing dinamis ceria dengan aksen ornamen daun zamrud dan ikon kebugaran santri.'
    },
    {
      id: 'tmpl-tahfidz-quran',
      name: 'Mahkota Kemuliaan Tahfidz Juz 30',
      category: 'TAHFIDZ',
      statusTag: 'REKOMENDASI',
      colorTheme: 'from-amber-600 to-emerald-800',
      defaultTitle: 'Mutiara Hafalan Juz 30 Santri Cilik',
      defaultSubtitle: 'Munaqasyah & Menghafal Al-Quran Penuh Tartil',
      badgeLabel: '📖 GENERASI QURANI',
      usesCount: 512,
      ratingScore: 5.0,
      previewGradient: 'from-amber-950 via-emerald-950 to-slate-900',
      accentIconName: 'BookOpen',
      description: 'Elegan islami dengan sentuhan kaligrafi modern, warna emas kemuliaan, dan stempel mahkota.'
    },
    {
      id: 'tmpl-mewarnai-kreatif',
      name: 'Galeri Kanvas Pelangi Cilik',
      category: 'MEWARNAI',
      statusTag: 'BARU',
      colorTheme: 'from-pink-600 to-purple-800',
      defaultTitle: 'Goresan Imajinasi & Warna Santri Hebat',
      defaultSubtitle: 'Lomba & Eksplorasi Motorik Halus Mewarnai Kaligrafi',
      badgeLabel: '🎨 KREASI SENI',
      usesCount: 189,
      ratingScore: 4.8,
      previewGradient: 'from-purple-950 via-pink-950 to-slate-900',
      accentIconName: 'Palette',
      description: 'Frame playful warna pastel cerah dengan motif cipratan kuas cat dan bintang penghargaan.'
    },
    {
      id: 'tmpl-manasik-cilik',
      name: 'Labaikallah Manasik Haji Santri',
      category: 'MANASIK',
      statusTag: 'REKOMENDASI',
      colorTheme: 'from-emerald-700 to-slate-900',
      defaultTitle: 'Latihan Manasik Haji Santri TK Asy Syifa',
      defaultSubtitle: 'Meneladani Rukun Islam & Doa-doa Ibadah Haji',
      badgeLabel: '🕋 MANASIK HAJI',
      usesCount: 420,
      ratingScore: 4.9,
      previewGradient: 'from-emerald-950 via-slate-900 to-black',
      accentIconName: 'Building',
      description: 'Nuansa sakral putih-zamrud dengan siluet Ka\'bah dan teks talbiyah yang syahdu.'
    },
    {
      id: 'tmpl-wisuda-akbar',
      name: 'Wisuda & Haflah Akhirussanah',
      category: 'WISUDA',
      statusTag: 'VIRAL',
      colorTheme: 'from-amber-500 to-yellow-800',
      defaultTitle: 'Wisuda & Pelepasan Santri Kelompok B',
      defaultSubtitle: 'Melangkah Pasti Menuju Jenjang Sekolah Dasar',
      badgeLabel: '🎓 WISUDA KELULUSAN',
      usesCount: 680,
      ratingScore: 5.0,
      previewGradient: 'from-amber-950 via-yellow-950 to-slate-900',
      accentIconName: 'GraduationCap',
      description: 'Format megah penghargaan dengan pita kelulusan, font display kokoh, dan sertifikat digital.'
    },
    {
      id: 'tmpl-semarak-ramadhan',
      name: 'Pesantren Kilat & Gema Ramadhan',
      category: 'RAMADHAN',
      statusTag: 'REKOMENDASI',
      colorTheme: 'from-indigo-600 to-emerald-900',
      defaultTitle: 'Semarak Berkah Ramadhan Cilik',
      defaultSubtitle: 'Belajar Puasa, Zakat Fitrah, dan Berbagi Takjil',
      badgeLabel: '🌙 RAMADHAN BERKAH',
      usesCount: 395,
      ratingScore: 4.9,
      previewGradient: 'from-indigo-950 via-emerald-950 to-slate-900',
      accentIconName: 'Moon',
      description: 'Lentera ramadhan, bulan sabit bercahaya, dan aksen langit malam bertabur bintang.'
    },
    {
      id: 'tmpl-hari-guru',
      name: 'Terima Kasih Guruku Tercinta',
      category: 'HARI_GURU',
      statusTag: 'BARU',
      colorTheme: 'from-rose-600 to-amber-800',
      defaultTitle: 'Apresiasi & Kasih Sayang Bunda Guru',
      defaultSubtitle: 'Pahlawan Tanpa Tanda Jasa Pembentuk Karakter Luhur',
      badgeLabel: '❤️ HARI GURU NASIONAL',
      usesCount: 230,
      ratingScore: 4.9,
      previewGradient: 'from-rose-950 via-amber-950 to-slate-900',
      accentIconName: 'Heart',
      description: 'Hangat penuh rasa syukur dengan ornamen bunga kasih sayang dan kartu ucapan terima kasih.'
    }
  ];

  public static getInstance(): TemplateIntelligenceHub {
    if (!TemplateIntelligenceHub.instance) {
      TemplateIntelligenceHub.instance = new TemplateIntelligenceHub();
    }
    return TemplateIntelligenceHub.instance;
  }

  public getTemplates(): CreativeTemplateItem[] {
    return [...TemplateIntelligenceHub.TEMPLATES];
  }

  public filterByCategory(category: string): CreativeTemplateItem[] {
    if (!category || category === 'ALL') return this.getTemplates();
    return TemplateIntelligenceHub.TEMPLATES.filter(t => t.category === category);
  }

  public filterByTag(tag: string): CreativeTemplateItem[] {
    if (!tag || tag === 'ALL') return this.getTemplates();
    return TemplateIntelligenceHub.TEMPLATES.filter(t => t.statusTag === tag);
  }
}
