export type ActivityType =
  | 'IDLE'
  | 'SEARCHING'
  | 'READING'
  | 'TYPING'
  | 'UPLOADING'
  | 'DOWNLOADING'
  | 'PRINTING'
  | 'SAVING'
  | 'LOADING'
  | 'BACKUP'
  | 'RESTORE'
  | 'APPROVAL'
  | 'DOCUMENT'
  | 'QR'
  | 'GALLERY'
  | 'DASHBOARD'
  | 'CALENDAR'
  | 'NOTIFICATION'
  | 'SUCCESS'
  | 'ERROR'
  | 'OFFLINE';

export type CharacterVariant = 'ASY' | 'ASYAH';

export const SPEECH_VARIATIONS: Record<ActivityType, string[]> = {
  IDLE: [
    'Ada yang bisa Asy bantu, Ayah/Bunda?',
    'Asy siap mendampingi kapan saja ya.',
    'Tetap semangat dan jaga kesehatan selalu!',
    'Asy membaca buku sambil menunggu ya.'
  ],
  SEARCHING: [
    'Asy bantu carikan datanya ya...',
    'Sedang mencari data yang sesuai...',
    'Tunggu sebentar, Asy periksa catatannya.'
  ],
  READING: [
    'Selamat membaca dan mencermati informasi ini.',
    'Informasi di halaman ini sudah lengkap ya.',
    'Asy juga sedang ikut membaca bersama.'
  ],
  TYPING: [
    'Asy catat rapi di buku catatan ya...',
    'Pastikan ejaan data sudah benar ya.',
    'Semangat menginput datanya!'
  ],
  UPLOADING: [
    'Sedang mengunggah berkas ke penyimpanan aman...',
    'Mohon tunggu, berkas sedang dikirim.',
    'Hampir selesai mengunggah.'
  ],
  DOWNLOADING: [
    'Sedang mengunduh dokumen...',
    'Dokumen siap disimpan di perangkatmu.'
  ],
  PRINTING: [
    'Menyiapkan dokumen siap cetak...',
    'Kwitansi & laporan siap dicetak rapi.'
  ],
  SAVING: [
    'Sedang menyimpan perubahan data...',
    'Data tersimpan dengan aman!',
    'Alhamdulillah, penyimpanan berhasil.'
  ],
  LOADING: [
    'Sedang memuat data...',
    'Tunggu sebentar ya, Asy jalan cepat nih!',
    'Hampir selesai memuat.'
  ],
  BACKUP: [
    'Sedang menyiapkan kotak arsip cadangan...',
    'Data aman tersimpan di cadangan eksternal.'
  ],
  RESTORE: [
    'Membuka folder arsip pemulihan...',
    'Memulihkan data secara seksama.'
  ],
  APPROVAL: [
    'Menyiapkan stempel pengesahan sah...',
    'Persetujuan siap diproses.'
  ],
  DOCUMENT: [
    'Menulis dokumen resmi sekolah...',
    'Format dokumen sudah sesuai standar TK ASY SYIFA.'
  ],
  QR: [
    'Menyiapkan kartu verifikasi QR...',
    'Pindai kode QR untuk validasi cepat.'
  ],
  GALLERY: [
    'Menampilkan bingkai foto kenangan siswa...',
    'Dokumentasi kegiatan ceria.'
  ],
  DASHBOARD: [
    'Memantau grafik statistik sekolah...',
    'Ringkasan data hari ini sangat baik!'
  ],
  CALENDAR: [
    'Mengecek agenda & kalender akademik...',
    'Jangan lupa jadwal kegiatan sekolah ya.'
  ],
  NOTIFICATION: [
    'Ting-ting! Ada pemberitahuan baru!',
    'Periksa pesan pemberitahuan penting.'
  ],
  SUCCESS: [
    'Alhamdulillah! Berhasil dilakukan!',
    'Hebat! Pekerjaanmu selesai sempurna!',
    'Luar biasa! Semua data sudah pas.'
  ],
  ERROR: [
    'Aduh, sepertinya ada yang keliru...',
    'Asy bingung nih, coba periksa kembali ya.',
    'Jangan khawatir, yuk coba sekali lagi.'
  ],
  OFFLINE: [
    'Sedang dalam Mode Offline...',
    'Tanpa koneksi internet, data disimpan lokal dulu ya.'
  ]
};

export const getRandomSpeech = (type: ActivityType): string => {
  const list = SPEECH_VARIATIONS[type] || SPEECH_VARIATIONS.IDLE;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
};

/**
 * Automatically detect user activity from DOM state & tab code
 */
export const detectCurrentActivity = (
  activeTabCode: string,
  isInputFocused: boolean,
  isOnline: boolean,
  isIdle: boolean
): ActivityType => {
  if (!isOnline) return 'OFFLINE';
  if (isIdle) return 'IDLE';

  const tab = activeTabCode.toLowerCase();

  if (isInputFocused) return 'TYPING';
  if (tab === 'r1' || tab === 'w1' || tab === 'dashboard') return 'DASHBOARD';
  if (tab === 'r25') return 'BACKUP';
  if (tab === 'r8' || tab === 'r11' || tab === 'r12') return 'PRINTING';
  if (tab === 'w2' || tab === 'r7') return 'CALENDAR';
  if (tab === 'w5' || tab === 'r18') return 'GALLERY';
  if (tab === 'r14') return 'APPROVAL';
  if (tab === 'w4' || tab === 'r13') return 'DOCUMENT';

  return 'READING';
};
