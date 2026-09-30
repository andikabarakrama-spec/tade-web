export interface WhatsAppQuickReply {
  command: string;
  title: string;
  category: string;
  templateMessage: string;
}

export const WHATSAPP_QUICK_REPLIES: WhatsAppQuickReply[] = [
  {
    command: '/ppdb',
    title: 'Pendaftaran Murid Baru (PPDB)',
    category: 'Pendaftaran',
    templateMessage: `Assalamu'alaikum Ayah/Bunda! 🌼

Terima kasih telah menghubungi Sekretariat PPDB TK Asy Syifa Tanggul.
Pendaftaran Murid Baru Tahun Ajaran Ajaran Baru telah DIBUKA.

📋 Syarat Pendaftaran:
1. Fotokopi Akta Kelahiran & Kartu Keluarga
2. Pasfoto Ananda 3x4 (2 lembar)
3. Mengisi Formulir Pendaftaran (Online/Offline)

🌐 Link Pendaftaran Online SIM:
https://tkasysyifa-tanggul.sch.id/#ppdb

Apabila Ayah/Bunda ingin melakukan Kunjungan Kampus atau Konsultasi Program, silakan balas pesan ini. Terima kasih! 🙏`,
  },
  {
    command: '/biaya',
    title: 'Informasi Biaya SPP & Pendaftaran',
    category: 'Keuangan',
    templateMessage: `Assalamu'alaikum Ayah/Bunda! 💳

Berikut informasi ringkas komponen biaya di TK Asy Syifa Tanggul:

💰 Rincian Biaya:
1. Formulir & Pendaftaran: Rp 150.000
2. SPP Bulanan: Rp 250.000 / bulan (termasuk kegiatan ekstrakurikuler dasar)
3. Uang Pangkal & Sarpras: (Silakan konsultasi langsung untuk skema keringanan/gelombang)

Sistem pembayaran mendukung Transfer Bank, QRIS Resmi, dan Kwitansi Digital SIM TK Asy Syifa.
Ada yang ingin ditanyakan terkait skema pembayaran, Ayah/Bunda?`,
  },
  {
    command: '/jadwal',
    title: 'Jadwal Sekolah & Jam Belajar',
    category: 'Akademik',
    templateMessage: `Assalamu'alaikum Ayah/Bunda! ⏰

Berikut jam operasional & kegiatan belajar mengajar di TK Asy Syifa:

🗓️ Hari Belajar: Senin - Sabtu
• Kelompok A & B: 07.00 - 11.00 WIB
• Penjemputan / Kantor Sekretariat: 07.00 - 14.00 WIB

Siswa mendapatkan pembelajaran Tahfidz Doa Harian, Karakter Islami, serta Ekstrakurikuler Seni & Olahraga. 🎨⚽`,
  },
  {
    command: '/lokasi',
    title: 'Lokasi & Petunjuk Arah',
    category: 'Informasi Umum',
    templateMessage: `Assalamu'alaikum Ayah/Bunda! 📍

Kampus Hijau TK Asy Syifa berlokasi di:
Jl. Raya Tanggul No. 88, Desa Tanggul Barat, Kec. Tanggul, Kab. Jember, Jawa Timur 68155.

🗺️ Petunjuk Google Maps:
https://maps.google.com/?q=TK+Asy+Syifa+Tanggul+Jember

Parkir luas, aman, dan lingkungan asri ramah anak. Kami tunggu kedatangan Ayah/Bunda! 🌿`,
  },
  {
    command: '/seragam',
    title: 'Informasi Seragam Sekolah',
    category: 'Fasilitas',
    templateMessage: `Assalamu'alaikum Ayah/Bunda! 👕

TK Asy Syifa menyediakan 4 stel seragam sekolah:
1. Seragam Seragam Batik khas Asy Syifa (Senin)
2. Seragam Olahraga & Karakter (Selasa)
3. Seragam Busana Muslim/Muslimah (Rabu - Kamis)
4. Seragam Pramuka / Bebas Rapi (Jumat - Sabtu)

Pengukuran ukuran baju dilakukan saat verifikasi berkas fisik di sekolah. 📏`,
  },
  {
    command: '/kontak',
    title: 'Kontak Resepsionis & Sekretariat',
    category: 'Kontak',
    templateMessage: `Assalamu'alaikum Ayah/Bunda! 📞

Sekretariat TK Asy Syifa Tanggul dapat dihubungi melalui:
• WhatsApp Chat: +62 812-3456-7890
• Telepon Kantor: (0336) 441-239
• Email Sekretariat: info@tkasysyifa-tanggul.sch.id
• Alamat Web: https://tkasysyifa-tanggul.sch.id

Petugas sekretariat bertugas pada hari Senin–Sabtu pkl 07.00–14.00 WIB.`,
  },
  {
    command: '/guru',
    title: 'Profil Pengajar & Pendidik',
    category: 'Akademik',
    templateMessage: `Assalamu'alaikum Ayah/Bunda! 👩‍🏫

Seluruh Pendidik di TK Asy Syifa merupakan lulusan S1 PAUD/Pendidikan berdedikasi tinggi, tersertifikasi, dan penuh kasih sayang dalam mendampingi tumbuh kembang Ananda.

Setiap kelas didampingi oleh Guru Utama dan Guru Pendamping untuk memastikan perhatian optimal. 🌸`,
  },
  {
    command: '/fasilitas',
    title: 'Sarana & Fasilitas Sekolah',
    category: 'Fasilitas',
    templateMessage: `Assalamu'alaikum Ayah/Bunda! 🏫

Fasilitas Unggulan Kampus TK Asy Syifa:
• Ruang Kelas Ber-AC & Multimedia
• Taman Bermain Outbound & APE Asri
• Pojok Baca Perpustakaan Mini
• Area Garden Edukasi Tanaman
• CCTV Keamanan 24 Jam & Sistem SIM Digital

Silakan hubungi kami untuk menjadwalkan Tur Sekolah bersama Ananda! 🎉`,
  },
];

export function getQuickReplyByCommand(cmd: string): WhatsAppQuickReply | undefined {
  const cleanCmd = cmd.trim().toLowerCase();
  return WHATSAPP_QUICK_REPLIES.find(q => q.command.toLowerCase() === cleanCmd);
}
