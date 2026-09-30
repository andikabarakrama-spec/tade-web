import { ActivityType } from './AIAsyActivity';
import { EmotionType } from './AIAsyEmotion';
import { DailyRoutineTime, EventCategory } from './AIAsyLivingSchool';

export type BackpackItem =
  | 'MAGNIFYING_GLASS'
  | 'STORYBOOK'
  | 'NOTEBOOK'
  | 'CRAYONS'
  | 'PAINT_BRUSH'
  | 'SOCCER_BALL'
  | 'CLIPBOARD'
  | 'LETTER'
  | 'FOLDER'
  | 'ARCHIVE_BOX'
  | 'FLOWER'
  | 'CAKE'
  | 'BALLOON'
  | 'QR_CARD'
  | 'CAMERA'
  | 'WATER_BOTTLE'
  | 'STAMP'
  | 'SCHOOL_FLAG'
  | 'TROPHY'
  | 'TOY_COINS';

export interface ModuleBehavior {
  moduleTitle: string;
  activity: ActivityType;
  primaryProp: BackpackItem;
  defaultEmotion: EmotionType;
  microAction: string;
  mirrorSpeech: string[];
}

/**
 * Module Behavior Mapping Library for R1-R55 & W1-W26
 */
export const MODULE_BEHAVIOR_LIBRARY: Record<string, ModuleBehavior> = {
  // DASHBOARD & OVERVIEW (W1, R1)
  w1: {
    moduleTitle: 'Beranda Utama',
    activity: 'DASHBOARD',
    primaryProp: 'STORYBOOK',
    defaultEmotion: 'HAPPY',
    microAction: 'Melihat grafik statistik dengan antusias.',
    mirrorSpeech: [
      'Selamat datang di Portal Utama TK ASY SYIFA!',
      'Asy siap membantu mendampingi eksplorasi informasi hari ini.',
      'Semua ringkasan data terlihat rapi dan lengkap!'
    ]
  },
  r1: {
    moduleTitle: 'Dashboard Admin',
    activity: 'DASHBOARD',
    primaryProp: 'CLIPBOARD',
    defaultEmotion: 'PROUD',
    microAction: 'Memeriksa ringkasan statistik sekolah.',
    mirrorSpeech: [
      'Dashboard manajemen sekolah terpantau aktif!',
      'Asy bantu pantau data harian sekolah ya.'
    ]
  },

  // SCHOOL PROFILE (W3, R2)
  w3: {
    moduleTitle: 'Profil Sekolah',
    activity: 'READING',
    primaryProp: 'SCHOOL_FLAG',
    defaultEmotion: 'PROUD',
    microAction: 'Menunjuk bendera & logo TK ASY SYIFA.',
    mirrorSpeech: [
      'TK ASY SYIFA sekolah pencetak generasi Rabbani!',
      'Visi dan misi sekolah kita sangat mulia.'
    ]
  },
  r2: {
    moduleTitle: 'Manajemen Profil',
    activity: 'TYPING',
    primaryProp: 'NOTEBOOK',
    defaultEmotion: 'FOCUSED',
    microAction: 'Mencatat pembaruan profil sekolah.',
    mirrorSpeech: [
      'Pembaruan data identitas sekolah siap disesuaikan.',
      'Pastikan informasi sekolah tersaji akurat.'
    ]
  },

  // PPDB & REGISTRATION (W6, R4, R5)
  w6: {
    moduleTitle: 'PPDB Online',
    activity: 'DOCUMENT',
    primaryProp: 'LETTER',
    defaultEmotion: 'EXCITED',
    microAction: 'Menyambut calon siswa baru dengan senyum.',
    mirrorSpeech: [
      'Selamat datang Calon Siswa TK ASY SYIFA!',
      'Formulir pendaftaran PPDB siap diisi dengan mudah.'
    ]
  },
  r4: {
    moduleTitle: 'Data Pendaftaran PPDB',
    activity: 'APPROVAL',
    primaryProp: 'STAMP',
    defaultEmotion: 'FOCUSED',
    microAction: 'Memeriksa berkas pendaftaran santri baru.',
    mirrorSpeech: [
      'Asy bantu verifikasi kelengkapan berkas calon santri ya.',
      'Data PPDB tersimpan aman di database.'
    ]
  },

  // TEACHER & STAFF (W7, R6)
  w7: {
    moduleTitle: 'Direktori Guru',
    activity: 'READING',
    primaryProp: 'FLOWER',
    defaultEmotion: 'THANKFUL',
    microAction: 'Memberi hormat santun kepada Bapak/Ibu Guru.',
    mirrorSpeech: [
      'Hormat dan salam takzim untuk Ustadz dan Ustadzah tersayang!',
      'Guru-guru kita sangat sabar dan penyayang.'
    ]
  },
  r6: {
    moduleTitle: 'Manajemen PTK',
    activity: 'DOCUMENT',
    primaryProp: 'CLIPBOARD',
    defaultEmotion: 'FOCUSED',
    microAction: 'Mencatat data pendidik & tenaga kependidikan.',
    mirrorSpeech: [
      'Data pendidik dan staf terarsip dengan rapi.',
      'Asy periksa kelengkapan SK dan sertifikasi.'
    ]
  },

  // STUDENTS & ACADEMICS (R7, R8, R9)
  r7: {
    moduleTitle: 'Data Siswa',
    activity: 'READING',
    primaryProp: 'STORYBOOK',
    defaultEmotion: 'HAPPY',
    microAction: 'Merapikan daftar nama siswa.',
    mirrorSpeech: [
      'Siswa-siswi TK ASY SYIFA anak-anak yang sholeh dan cerdas!',
      'Data rombel dan induk siswa tersusun lengkap.'
    ]
  },
  r8: {
    moduleTitle: 'Presensi & Kehadiran',
    activity: 'QR',
    primaryProp: 'QR_CARD',
    defaultEmotion: 'FOCUSED',
    microAction: 'Memegang kartu verifikasi presensi QR.',
    mirrorSpeech: [
      'Pindai QR presensi untuk pencatatan kehadiran instan!',
      'Kedisiplinan siswa terjaga dengan baik.'
    ]
  },

  // FINANCE & SPP (R11, R12)
  r11: {
    moduleTitle: 'Keuangan & SPP',
    activity: 'SAVING',
    primaryProp: 'TOY_COINS',
    defaultEmotion: 'FOCUSED',
    microAction: 'Menghitung koin kuitansi pembayaran.',
    mirrorSpeech: [
      'Pencatatan pembayaran SPP & infaq transparan.',
      'Kuitansi resmi siap diterbitkan dan dicetak.'
    ]
  },

  // ARCHIVE & BACKUP (R25, R26)
  r25: {
    moduleTitle: 'Penyimpanan & Cadangan',
    activity: 'BACKUP',
    primaryProp: 'ARCHIVE_BOX',
    defaultEmotion: 'THINKING',
    microAction: 'Merawat kotak arsip cadangan eksternal.',
    mirrorSpeech: [
      'Cadangan data aman dalam sistem terenkripsi.',
      'Asy siap bantu proses pemulihan data jika diperlukan.'
    ]
  },

  // GALLERY & MEDIA (W5, R18)
  w5: {
    moduleTitle: 'Galeri Foto Kegiatan',
    activity: 'GALLERY',
    primaryProp: 'CAMERA',
    defaultEmotion: 'PLAYFUL',
    microAction: 'Memegang kamera untuk mendokumentasikan senyum siswa.',
    mirrorSpeech: [
      'Cekrek! Dokumentasi momen ceria di TK ASY SYIFA.',
      'Foto-foto kegiatan siswa sangat menggemaskan!'
    ]
  }
};

/**
 * Get dynamic behavior for any tab/module
 */
export const getBehaviorForModule = (
  activeTabCode: string,
  userActivity: ActivityType,
  routine: DailyRoutineTime,
  eventCategory: EventCategory
): ModuleBehavior => {
  const code = activeTabCode.toLowerCase();

  if (MODULE_BEHAVIOR_LIBRARY[code]) {
    return MODULE_BEHAVIOR_LIBRARY[code];
  }

  // Fallback module behavior generator
  return {
    moduleTitle: `Modul ${activeTabCode.toUpperCase()}`,
    activity: userActivity,
    primaryProp: 'STORYBOOK',
    defaultEmotion: 'HAPPY',
    microAction: 'Pendampingan santun di modul sekolah.',
    mirrorSpeech: [
      `Asy siap mendampingi pengerjaan pada Modul ${activeTabCode.toUpperCase()}!`,
      'Semoga seluruh pengisian data berjalan lancar dan berkah.'
    ]
  };
};
