/**
 * TADE RC101 — R835
 * Smart Teaching Library Generator (Bahan Ajar Cerdas Guru PAUD)
 * 
 * Fitur:
 * - Kategori: Huruf, Angka, Hewan, Buah, Profesi, Doa Harian, Mewarnai
 * - Input: Teks & Dikte Suara (Speech Recognition)
 * - Output: Flashcard, Poster A3/A4, Lembar Mewarnai, PDF siap cetak & ZIP
 * - 100% Bahasa Indonesia & Nilai Islami Santun
 */

export type TeachingCategory = 
  | 'HURUF_HIJAIYAH' 
  | 'ANGKA_ARAB_LATIN' 
  | 'HEWAN_HALAL' 
  | 'BUAH_BERKAH' 
  | 'PROFESI_MULIA' 
  | 'DOA_HARIAN' 
  | 'LEMBAR_MEWARNAI';

export interface TeachingMaterialItem {
  id: string;
  category: TeachingCategory;
  title: string;
  subTitle: string;
  arabicScript?: string;
  transliteration?: string;
  meaningIndonesian?: string;
  visualEmoji: string;
  colorTheme: string;
  learningObjectives: string[];
  suggestedAgeGroup: 'KB (3-4 Tahun)' | 'TK A (4-5 Tahun)' | 'TK B (5-6 Tahun)';
  tags: string[];
}

export const PRELOADED_TEACHING_ITEMS: TeachingMaterialItem[] = [
  {
    id: 'MAT-001',
    category: 'HURUF_HIJAIYAH',
    title: 'Huruf Alif (ا)',
    subTitle: 'Awal dari Segala Kebaikan',
    arabicScript: 'أَلِفٌ',
    transliteration: 'Alif',
    meaningIndonesian: 'Huruf pertama dalam Kitab Suci Al-Qur\'an',
    visualEmoji: '📖',
    colorTheme: '#059669',
    learningObjectives: ['Mengenal bentuk huruf Alif berdiri tegak', 'Mengeja bunyi fatah A-I-U', 'Meniru tulisan garis lurus'],
    suggestedAgeGroup: 'TK A (4-5 Tahun)',
    tags: ['Hijaiyah', 'Iqro', 'Tahfidz']
  },
  {
    id: 'MAT-002',
    category: 'HURUF_HIJAIYAH',
    title: 'Huruf Ba (ب)',
    subTitle: 'Satu Titik di Bawah Seperti Perahu',
    arabicScript: 'بَاءٌ',
    transliteration: 'Baa',
    meaningIndonesian: 'Bismillah & Berbakti pada Orang Tua',
    visualEmoji: '⛵',
    colorTheme: '#0284C7',
    learningObjectives: ['Mengenal lengkungan perahu', 'Menempatkan 1 titik di bawah', 'Mengeja Ba-Bi-Bu'],
    suggestedAgeGroup: 'TK A (4-5 Tahun)',
    tags: ['Hijaiyah', 'Iqro']
  },
  {
    id: 'MAT-003',
    category: 'ANGKA_ARAB_LATIN',
    title: 'Angka 1 (Wahidun - ١)',
    subTitle: 'Allah Maha Esa',
    arabicScript: 'وَاحِدٌ (١)',
    transliteration: 'Wahidun (Satu)',
    meaningIndonesian: 'Tiada Tuhan Selain Allah Yang Maha Esa',
    visualEmoji: '☝️',
    colorTheme: '#D97706',
    learningObjectives: ['Menghitung benda jumlah 1', 'Mengenal simbol angka Arab ١', 'Menanamkan tauhid sejak dini'],
    suggestedAgeGroup: 'KB (3-4 Tahun)',
    tags: ['Angka', 'Tauhid', 'Matematika PAUD']
  },
  {
    id: 'MAT-004',
    category: 'HEWAN_HALAL',
    title: 'Unta yang Sabar (جَمَلٌ)',
    subTitle: 'Hewan Ciptaan Allah Penjelajah Gurun',
    arabicScript: 'جَمَلٌ',
    transliteration: 'Jamalun (Unta)',
    meaningIndonesian: 'Unta mampu bertahan di padang pasir karena punuk penyimpan cadangan makanan.',
    visualEmoji: '🐪',
    colorTheme: '#B45309',
    learningObjectives: ['Mengenal ciptaan Allah', 'Belajar sifat sabar & tangguh', 'Mewarnai unta di gurun'],
    suggestedAgeGroup: 'TK B (5-6 Tahun)',
    tags: ['Sains Islami', 'Fauna', 'Mewarnai']
  },
  {
    id: 'MAT-005',
    category: 'BUAH_BERKAH',
    title: 'Buah Kurma (تَمْرٌ)',
    subTitle: 'Makanan Manis Sunnah Rasulullah',
    arabicScript: 'تَمْرٌ',
    transliteration: 'Tamrun (Kurma)',
    meaningIndonesian: 'Buah kaya serat dan energi, disunnahkan dimakan saat berbuka puasa.',
    visualEmoji: '🌴',
    colorTheme: '#78350F',
    learningObjectives: ['Mengenal buah kesukaan Nabi', 'Membiasakan makan makanan sehat', 'Mewarnai pohon kurma'],
    suggestedAgeGroup: 'TK A (4-5 Tahun)',
    tags: ['Adab Makan', 'Sunnah', 'Gizi Anak']
  },
  {
    id: 'MAT-006',
    category: 'DOA_HARIAN',
    title: 'Doa Sebelum Makan',
    subTitle: 'Memohon Berkah Rezeki',
    arabicScript: 'اَللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa \'adzaaban-naar',
    meaningIndonesian: 'Ya Allah, berkahilah rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.',
    visualEmoji: '🥣',
    colorTheme: '#10B981',
    learningObjectives: ['Membaca doa sebelum makan dengan tangan kanan', 'Menghafal kalimat doa dengan tartil', 'Adab makan santri'],
    suggestedAgeGroup: 'KB (3-4 Tahun)',
    tags: ['Doa Harian', 'Adab Makan', 'Karakter Santri']
  },
  {
    id: 'MAT-007',
    category: 'PROFESI_MULIA',
    title: 'Dokter Santri Penyembuh',
    subTitle: 'Membantu Orang Sakit dengan Izin Allah',
    arabicScript: 'طَبِيبٌ',
    transliteration: 'Thobiibun (Dokter)',
    meaningIndonesian: 'Merawat sesama dengan kasih sayang dan keikhlasan.',
    visualEmoji: '🩺',
    colorTheme: '#2563EB',
    learningObjectives: ['Mengenal cita-cita mulia', 'Menumbuhkan empati tolong-menolong', 'Menjaga kesehatan tubuh'],
    suggestedAgeGroup: 'TK B (5-6 Tahun)',
    tags: ['Cita-cita', 'Profesi', 'Akhlak']
  },
  {
    id: 'MAT-008',
    category: 'LEMBAR_MEWARNAI',
    title: 'Mewarnai Masjid & Kubah Zamrud',
    subTitle: 'Rumah Ibadah Suci Umat Islam',
    arabicScript: 'مَسْجِدٌ',
    transliteration: 'Masjidun',
    meaningIndonesian: 'Tempat santri sholat berjamaah dan belajar Al-Qur\'an.',
    visualEmoji: '🕌',
    colorTheme: '#047857',
    learningObjectives: ['Melatih motorik halus memegang krayon', 'Mengenal arsitektur kubah & menara', 'Mencintai masjid'],
    suggestedAgeGroup: 'TK A (4-5 Tahun)',
    tags: ['Mewarnai', 'Motorik Halus', 'Masjid']
  }
];

export class SmartTeachingGenerator {
  private static instance: SmartTeachingGenerator;
  private items: TeachingMaterialItem[] = [...PRELOADED_TEACHING_ITEMS];

  private constructor() {}

  public static getInstance(): SmartTeachingGenerator {
    if (!SmartTeachingGenerator.instance) {
      SmartTeachingGenerator.instance = new SmartTeachingGenerator();
    }
    return SmartTeachingGenerator.instance;
  }

  public getItemsByCategory(category?: TeachingCategory): TeachingMaterialItem[] {
    if (!category) return this.items;
    return this.items.filter(item => item.category === category);
  }

  public addItem(item: Omit<TeachingMaterialItem, 'id'>): TeachingMaterialItem {
    const newItem: TeachingMaterialItem = {
      ...item,
      id: `MAT-${String(this.items.length + 1).padStart(3, '0')}`
    };
    this.items = [newItem, ...this.items];
    return newItem;
  }

  public generatePrintableHtml(item: TeachingMaterialItem): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${item.title} - Bahan Ajar TK Asy Syifa</title>
          <style>
            body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding: 30px; text-align: center; color: #1e293b; }
            .card { border: 4px dashed ${item.colorTheme}; border-radius: 24px; padding: 40px; max-width: 600px; margin: auto; }
            .badge { background: ${item.colorTheme}; color: white; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; }
            .emoji { font-size: 80px; margin: 20px 0; }
            .arabic { font-family: 'Amiri', serif; font-size: 48px; color: ${item.colorTheme}; direction: rtl; margin: 15px 0; }
            .title { font-size: 28px; font-weight: 900; margin-bottom: 8px; }
            .meaning { font-size: 16px; color: #64748b; line-height: 1.5; margin: 15px 0; }
            .objectives { text-align: left; background: #f8fafc; padding: 20px; border-radius: 16px; margin-top: 25px; }
            .footer { margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">${item.suggestedAgeGroup} &bull; ${item.category}</span>
            <div class="emoji">${item.visualEmoji}</div>
            ${item.arabicScript ? `<div class="arabic">${item.arabicScript}</div>` : ''}
            <div class="title">${item.title}</div>
            <div style="font-weight: bold; color: ${item.colorTheme}">${item.subTitle}</div>
            ${item.meaningIndonesian ? `<div class="meaning">${item.meaningIndonesian}</div>` : ''}
            <div class="objectives">
              <strong>Tujuan Pembelajaran Santri:</strong>
              <ul>
                ${item.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
              </ul>
            </div>
            <div class="footer">
              TK Islam Moderen & Berkarakter Asy Syifa Tanggul, Jember &bull; Dokumen Resmi Bahan Ajar PAUD
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
