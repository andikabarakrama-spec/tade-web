import { UserRole } from '../../types';

export type PerformanceMode = 'LIGHT' | 'NORMAL' | 'FULL';

export interface PageGuidance {
  title: string;
  summary: string;
  tips: string[];
  category: 'Website' | 'Akademik' | 'Keuangan' | 'Pengelolaan' | 'Sistem' | 'Portal' | 'Komunikasi';
}

export const ROLE_GREETINGS: Record<UserRole, string> = {
  SUPER_ADMIN: "Halo Kakak Super Admin! Asy siap temani kontrol penuh sistem TK ASY SYIFA ya!",
  ADMIN: "Halo Kakak Admin Tata Usaha! Asy siap bantu kelola data & dokumen sekolah hari ini!",
  KEPALA_SEKOLAH: "Assalamu'alaikum Ibu/Bapak Kepala Sekolah! Asy siap tampilkan ringkasan laporan & persetujuan sekolah.",
  KETUA_YAYASAN: "Assalamu'alaikum Bapak/Ibu Ketua Yayasan! Asy siap sajikan ikhtisar perkembangan & keuangan yayasan.",
  GURU: "Halo Ibu/Bapak Guru yang hebat! Asy bantu dampingi presensi, e-Rapor, & kegiatan murid-murid ya!",
  KEUANGAN: "Halo Kakak Bendahara! Asy bantu cek catatan pembayaran SPP & kwitansi sekolah ya!",
  WALI_MURID: "Assalamu'alaikum Ayah & Bunda! Asy seneng banget ketemu Ayah Bunda di portal wali murid!",
  CALON_WALI_MURID: "Assalamu'alaikum Ayah & Bunda Calon Murid Baru! Selamat datang di TK ASY SYIFA!",
  ALUMNI_FAMILY: "Assalamu'alaikum Ayah & Bunda Keluarga Besar Alumni Asy-Syifa! Selamat datang kembali di Taman Kenangan!"
};

export const PAGE_GUIDANCE_MAP: Record<string, PageGuidance> = {
  // Website Pages W1 - W5
  w1: {
    title: "Beranda Utama Website",
    summary: "Selamat datang di Website Resmi TK ASY SYIFA! Di sini Ayah Bunda bisa melihat profil singkat, keunggulan, & fasilitas sekolah.",
    tips: ["Lihat video profil sekolah", "Cek pendaftaran murid baru PPDB", "Jelajahi program unggulan Islami"],
    category: "Website"
  },
  w2: {
    title: "Profil & Program Sekolah",
    summary: "Halaman ini memuat visi, misi, kurikulum merdeka, serta program pembentukan karakter santri cilik.",
    tips: ["Pelajari kurikulum Tahfidz & Doa", "Lihat profil tenaga pendidik berkualifikasi"],
    category: "Website"
  },
  w3: {
    title: "Berita & Informasi Sekolah",
    summary: "Dapatkan kabar terbaru kegiatan anak-anak, pengumuman libur, dan artikel parenting islami.",
    tips: ["Filter berita berdasarkan kategori", "Baca artikel inspirasi parenting"],
    category: "Website"
  },
  w4: {
    title: "Portal Pendaftaran PPDB Online",
    summary: "Pendaftaran calon siswa baru secara online cepat & mudah untuk tahun ajaran 2026/2027.",
    tips: ["Isi formulir data calon siswa", "Unggah berkas KK & Akta Lahir", "Cek status seleksi pendaftaran"],
    category: "Website"
  },
  w5: {
    title: "Kontak & Lokasi Sekolah",
    summary: "Hubungi sekretariat pendaftaran atau kunjungi alamat lokasi TK ASY SYIFA.",
    tips: ["Kirim pesan WhatsApp langsung", "Lihat peta petunjuk lokasi sekolah"],
    category: "Website"
  },

  // SIM Modules R1 - R55
  r1: {
    title: "Dashboard Utama SIM Sekolah",
    summary: "Pusat statistik utama! Di sini terlihat total siswa, guru, kehadiran hari ini, dan ikhtisar keuangan sekolah.",
    tips: ["Pantau grafik kehadiran real-time", "Cek pengumuman internal terbaru", "Akses pintasan modul utama"],
    category: "Portal"
  },
  r2: {
    title: "Manajemen Pengguna & RBAC",
    summary: "Modul pengatur hak akses pengguna. Mengunci otorisasi role sesuai prinsip TADE Master Constitution.",
    tips: ["Kelola akun pengguna", "Tetapkan peran akses aman", "Verifikasi status verifikasi kredensial"],
    category: "Sistem"
  },
  r3: {
    title: "Database Peserta Didik (Siswa)",
    summary: "Direktori lengkap data siswa, biodata orang tua, rombel kelompok belajar, dan nomor induk NISN.",
    tips: ["Cari siswa berdasarkan nama/kelas", "Ekspor data ke format Excel/PDF", "Tambah data siswa baru"],
    category: "Akademik"
  },
  r4: {
    title: "Database Pendidik & Tendik",
    summary: "Data direktori guru, kualifikasi pendidikan, sertifikasi pendidik, dan penugasan mengajar.",
    tips: ["Cek status keaktifan guru", "Kelola riwayat mengajar & pelatihan"],
    category: "Akademik"
  },
  r5: {
    title: "Kelompok Belajar & Rombel",
    summary: "Pembagian kelas (Kelompok A, Kelompok B) serta penataan wali kelas pendamping.",
    tips: ["Tetapkan wali kelas rombel", "Atur distribusi ruang kelas"],
    category: "Akademik"
  },
  r6: {
    title: "Presensi & Kehadiran Siswa",
    summary: "Pencatatan presensi harian siswa (Hadir, Izin, Sakit, Alpa) dengan grafik kalkulasi bulanan.",
    tips: ["Rekam kehadiran harian cepat", "Kirim notifikasi presensi ke wali murid", "Cek rekap kehadiran bulanan"],
    category: "Akademik"
  },
  r7: {
    title: "Presensi & Kehadiran Pendidik",
    summary: "Absensi harian ustadz & ustadzah beserta rekap ketepatan waktu.",
    tips: ["Catat jam datang & pulang guru", "Rekam surat izin/sakit pendidik"],
    category: "Akademik"
  },
  r8: {
    title: "e-Rapor & Evaluasi Perkembangan",
    summary: "Penyusunan capaian pembelajaran anak usia dini sesuai Capaian Kurikulum Merdeka Paud.",
    tips: ["Isi narasi perkembangan nilai anak", "Cetak draf e-Rapor PDF bermaterai digital", "Kirim e-Rapor ke portal wali murid"],
    category: "Akademik"
  },
  r9: {
    title: "Catatan Anekdot & Perilaku",
    summary: "Dokumentasi observasi harian perilaku anak, perkembangan sosial emosional, dan momen unik santri.",
    tips: ["Tambah catatan kejadian khusus", "Lampirkan foto kegiatan siswa"],
    category: "Akademik"
  },
  r10: {
    title: "Manajemen Tagihan SPP & Biaya",
    summary: "Pengelolaan struktur tagihan bulanan SPP, uang pangkal, & kegiatan ekstra kurikuler.",
    tips: ["Buat invoice tagihan SPP massal", "Cek siswa belum lunas SPP"],
    category: "Keuangan"
  },
  r11: {
    title: "Pembayaran & Kwitansi Digital",
    summary: "Pencatatan transaksi penerimaan pembayaran SPP dan penerbitan bukti kwitansi sah.",
    tips: ["Input pembayaran masuk", "Cetak kwitansi pembayaran berseri", "Kirim bukti bayar via WA/Email"],
    category: "Keuangan"
  },
  r12: {
    title: "Laporan Keuangan & Kas Sekolah",
    summary: "Ringkasan arus kas (cash flow), pemasukan SPP, pengeluaran operasional, dan saldo akhir.",
    tips: ["Filter laporan per bulan/tahun", "Ekspor neraca kas ke format PDF"],
    category: "Keuangan"
  },
  r13: {
    title: "Verifikasi Pendaftaran PPDB",
    summary: "Verifikasi berkas persyaratan calon siswa, jadwal wawancara, dan penetapan kelulusan.",
    tips: ["Cek kelengkapan berkas calon siswa", "Ubah status pendaftaran ke Diterima"],
    category: "Pengelolaan"
  },
  r14: {
    title: "Arsip Digital Smart Archive",
    summary: "Penyimpanan dokumen resmi sekolah (Ijazah, SK, Akreditasi) dengan pencarian otomatis.",
    tips: ["Unggah dokumen berkas penting", "Cari berkas dengan kata kunci"],
    category: "Pengelolaan"
  },
  r15: {
    title: "Pengumuman & Pengirim Notifikasi",
    summary: "Kirim pesan broadcast dan edaran resmi ke guru, pengurus, atau seluruh orang tua murid.",
    tips: ["Buat pengumuman baru", "Targetkan penerima spesifik"],
    category: "Pengelolaan"
  },
  r16: {
    title: "Pusat Dokumen Smart Document",
    summary: "Pusat pembuatan dokumen dinamis seperti Surat Keterangan, Surat Izin, dan SK Kepala Sekolah.",
    tips: ["Gunakan template dokumen siap cetak", "Isi parameter variabel dokumen"],
    category: "Pengelolaan"
  },
  r17: {
    title: "Setoran Tahfidz & Hafalan Doa",
    summary: "Catatan kemajuan hafalan Surat Pendek Al-Qur'an, Doa Harian, dan Hadits Pilihan anak.",
    tips: ["Input capaian ayat hafalan anak", "Beri bintang apresiasi hafalan"],
    category: "Akademik"
  },
  r18: {
    title: "Inventaris Sarana & Prasarana",
    summary: "Pencatatan barang aset sekolah, kondisi perlengkapan kelas, dan pemeliharaan alat.",
    tips: ["Rekam barang masuk baru", "Cek status kondisi baik/rusak"],
    category: "Pengelolaan"
  },
  r19: {
    title: "Perpustakaan & Alat Perahu APE",
    summary: "Peminjaman buku cerita anak dan alat peraga edukatif (APE) untuk pembelajaran interaktif.",
    tips: ["Catat peminjaman buku anak", "Cek ketersediaan APE kelas"],
    category: "Akademik"
  },
  r20: {
    title: "Layanan Kesehatan KMS Anak",
    summary: "Kartu Menuju Sehat (KMS) digital: catatan tinggi badan, berat badan, dan pemeriksaan berkala.",
    tips: ["Input data antropometri anak", "Lihat grafik pertumbuhan sehat"],
    category: "Akademik"
  },
  r21: {
    title: "Kegiatan Ekstrakurikuler",
    summary: "Pilihan kegiatan pengembangan bakat anak (Mewarnai, Tari Islami, Drum Band, English Club).",
    tips: ["Daftarkan anak ke kegiatan ekstra", "Cek pembimbing ekstra"],
    category: "Akademik"
  },
  r22: {
    title: "CMS Pengelola Konten Website",
    summary: "Pengaturan isi halaman beranda, pengunggah banner slider, berita, dan galeri foto.",
    tips: ["Sunting teks halaman depan", "Unggah foto berita terbaru"],
    category: "Sistem"
  },
  r23: {
    title: "Pengaturan Informasi Website",
    summary: "Konfigurasi nama sekolah, kontak WhatsApp resmi, logo, dan alamat media sosial.",
    tips: ["Perbarui nomor WA panitia", "Sesuaikan jam operasional sekolah"],
    category: "Sistem"
  },
  r24: {
    title: "Audit Log & Jejak Aktivitas",
    summary: "Catatan rekam jejak aktivitas pengguna untuk menjamin keamanan & transparansi.",
    tips: ["Pantau riwayat login pengguna", "Filter aktivitas berdasarkan tanggal"],
    category: "Sistem"
  },
  r25: {
    title: "Cadangan Data (Backup & Export)",
    summary: "Fasilitas pengunduhan salinan cadangan data sekolah dalam bentuk JSON/Excel aman.",
    tips: ["Jalankan backup data berkala", "Unduh berkas cadangan aman"],
    category: "Sistem"
  },
  r26: {
    title: "Peta Zonasi Tempat Tinggal",
    summary: "Peta sebaran domisili tempat tinggal peserta didik untuk analisis pemetaan area layanan.",
    tips: ["Lihat sebaran titik lokasi siswa", "Analisis jarak rumah ke sekolah"],
    category: "Pengelolaan"
  },
  r27: {
    title: "Menu Catering & Gizi Sehat",
    summary: "Jadwal menu makanan sehat harian anak untuk program pemberian makanan tambahan (PMT).",
    tips: ["Cek menu makan siang mingguan", "Lihat catatan alergi makanan anak"],
    category: "Akademik"
  },
  r28: {
    title: "Layanan Antar-Jemput Sekolah",
    summary: "Pengaturan armada jemputan anak, rute rute antar, dan konfirmasi keamanan pengemudi.",
    tips: ["Cek rute antar jemput anak", "Konfirmasi kehadiran anak di armada"],
    category: "Pengelolaan"
  },
  r29: {
    title: "Portal Khusus Wali Murid",
    summary: "Pintu masuk khusus Ayah Bunda untuk melihat perkembangan anak, tagihan SPP, & pengumuman.",
    tips: ["Lihat catatan harian ananda", "Cek status pembayaran SPP", "Unduh e-Rapor semester"],
    category: "Portal"
  },
  r30: {
    title: "Portal Khusus Guru & Pendidik",
    summary: "Ruang kerja khusus Ustadz & Ustadzah untuk mengelola jurnal harian, absensi, & e-Rapor.",
    tips: ["Isi jurnal mengajar kelas", "Input nilai capaian anak"],
    category: "Portal"
  },
  r31: {
    title: "Portal Kepala Sekolah & Pengawas",
    summary: "Ringkasan eksekutif untuk Kepala Sekolah dalam menyetujui dokumen & mengevaluasi kualitas.",
    tips: ["Tinjau pengajuan persetujuan", "Pantau statistik kehadiran guru & siswa"],
    category: "Portal"
  },
  r32: {
    title: "Status Pemeliharaan Sistem",
    summary: "Halaman pengujian performa server, keutuhan jaringan, dan kesiapan operasional.",
    tips: ["Cek latency koneksi server", "Verifikasi integritas modul"],
    category: "Sistem"
  },
  r33: {
    title: "Pusat Pengetahuan & Pencarian AI",
    summary: "Mesin pencarian cerdas untuk menemukan dokumen, aturan sekolah, dan FAQ pendataan.",
    tips: ["Ketik kata kunci pencarian", "Temukan panduan prosedur cepat"],
    category: "Sistem"
  },
  r34: {
    title: "Pemeriksaan Kesehatan Mandiri",
    summary: "Modul verifikasi ketahanan & performa internal aplikasi TADE.",
    tips: ["Jalankan diagnostik otomatis", "Pastikan status hijau sempurna"],
    category: "Sistem"
  },
  r35: {
    title: "Pusat Pemulihan Data Bencana (DRP)",
    summary: "Sistem pemulihan darurat untuk mengembalikan data jika terjadi kendala tak terduga.",
    tips: ["Verifikasi titik pemulihan data", "Jalankan simulasi restore data"],
    category: "Sistem"
  },
  r36: {
    title: "AI Operating System Gateway",
    summary: "Gerbang otomatisasi tugas rutin administrasi sekolah.",
    tips: ["Jalankan tugas analisis otomatis", "Tinjau ringkasan cerdas mingguan"],
    category: "Sistem"
  },
  r37: {
    title: "Tata Kelola Pembaruan Enterprise",
    summary: "Pengawasan pembaruan kode dan garansi LTS (Long Term Support) TADE v1.0.5.",
    tips: ["Cek versi TADE terpasang", "Pastikan zero breaking changes"],
    category: "Sistem"
  },
  r38: {
    title: "Enterprise Observability Dashboard",
    summary: "Monitoring aktivitas transaksi, latensi query, dan keandalan sistem.",
    tips: ["Pantau grafik kesehatan aplikasi", "Cek penggunaan memori heap"],
    category: "Sistem"
  },
  r39: {
    title: "Enterprise Self-Diagnostic Center",
    summary: "Pemeriksaan mandiri skema Firestore, otorisasi RBAC, dan integritas file.",
    tips: ["Verifikasi kunci keamanan RBAC", "Uji sinkronisasi lokal ke cloud"],
    category: "Sistem"
  },
  r40: {
    title: "Validasi Pemulihan Enterprise",
    summary: "Pengujian integritas cadangan data secara otomatis.",
    tips: ["Pastikan backup dapat dipulihkan 100%"],
    category: "Sistem"
  },
  r41: {
    title: "Tata Kelola Konfigurasi Enterprise",
    summary: "Manajemen aturan bisnis, jam sekolah, dan kalender akademik terpadu.",
    tips: ["Tetapkan kalender akademik", "Atur batas waktu bayar SPP"],
    category: "Sistem"
  },
  r42: {
    title: "Pusat Dokumen Enterprise",
    summary: "Repositori terpusat untuk semua berkas dan surat edaran resmi.",
    tips: ["Kelola kategori dokumen", "Cetak surat berstempel digital"],
    category: "Pengelolaan"
  },
  r43: {
    title: "Mesin Siklus Hidup Dokumen",
    summary: "Pengaturan alur draf, revisi, pengesahan, hingga penataan arsip dokumen.",
    tips: ["Pantau dokumen dalam proses pengesahan"],
    category: "Pengelolaan"
  },
  r44: {
    title: "Perpustakaan Template Surat",
    summary: "Kumpulan format baku surat sekolah (Surat Keterangan Lulus, Pindah, Undangan).",
    tips: ["Pilih template surat standar", "Pratinjau sebelum dicetak"],
    category: "Pengelolaan"
  },
  r45: {
    title: "Mesin Pembuat Dokumen Otomatis",
    summary: "Generasi massal dokumen surat dengan variabel otomatis dari data siswa/guru.",
    tips: ["Proses penerbitan surat massal"],
    category: "Pengelolaan"
  },
  r46: {
    title: "Identitas Digital & Kartu Pelajar",
    summary: "Penerbitan Kartu Tanda Murid (KTM) & Kartu Pegawai ber-QR Code validasi.",
    tips: ["Cetak Kartu Siswa ber-QR Code", "Verifikasi keaslian kartu"],
    category: "Pengelolaan"
  },
  r47: {
    title: "Sinkronisasi Master Data",
    summary: "Mesin penyelarasan data lokal dengan Firestore tanpa mengganggu pengguna.",
    tips: ["Cek status sinkronisasi offline-online"],
    category: "Sistem"
  },
  r48: {
    title: "Registri Berkas Attachment",
    summary: "Pengelolaan berkas lampiran (IJAZAH, KK, AKTA, KTP, SURAT_SEHAT) aman.",
    tips: ["Cek berkas lampiran siswa", "Verifikasi validitas dokumen"],
    category: "Pengelolaan"
  },
  r49: {
    title: "Graf Pengetahuan Terpadu",
    summary: "Visualisasi keterkaitan antar data siswa, wali murid, pembayaran, dan guru.",
    tips: ["Jelajahi simpul hubungan antar entitas sekolah"],
    category: "Sistem"
  },
  r50: {
    title: "Enterprise PDF & Print Composer",
    summary: "Mesin pencetak PDF resolusi tinggi dengan stempel & tanda tangan digital.",
    tips: ["Cetak dokumen standar penerbitan resmi"],
    category: "Sistem"
  },
  r51: {
    title: "Digital Signature & Approval Engine",
    summary: "Mesin persetujuan berjenjang dengan tanda tangan digital tersertifikasi.",
    tips: ["Beri persetujuan dokumen resmi", "Cek riwayat pengesahan"],
    category: "Sistem"
  },
  r52: {
    title: "Gerbang QR Code Authenticity",
    summary: "Pemindaian & validasi keaslian dokumen resmi berbasis QR Code sah.",
    tips: ["Pindai QR Code untuk cek keaslian surat/kartu"],
    category: "Sistem"
  },
  r53: {
    title: "Smart Document Intake & OCR Prep",
    summary: "Pemrosesan otomatis dokumen yang diunggah untuk konversi data otomatis.",
    tips: ["Unggah dokumen scan untuk ekstraksi data"],
    category: "Sistem"
  },
  r54: {
    title: "Pusat Pengiriman Pesan & Komunikasi",
    summary: "Hub pengiriman notifikasi internal, email-prep, dan pengumuman sekolah.",
    tips: ["Kirim pesan notifikasi penting", "Cek status terkirim"],
    category: "Komunikasi"
  },
  r55: {
    title: "Go-Live Readiness & System Diagnostic",
    summary: "Pusat verifikasi 20 parameter kesiapan produksi TADE v1.0.5 LTS.",
    tips: ["Jalankan audit ulang 20 parameter", "Cetak sertifikat Go-Live"],
    category: "Sistem"
  }
};
