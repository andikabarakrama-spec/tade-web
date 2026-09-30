export interface StepInstruction {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  actionHint?: string;
  seniorFriendlyInstruction: string;
}

export const WORKFLOW_GUIDE_MAP: Record<string, StepInstruction[]> = {
  // PPDB Online (W4 / R13)
  w4: [
    {
      stepNumber: 1,
      totalSteps: 3,
      title: "Isi Formulir Pendaftaran",
      instruction: "Lengkapi data identitas calon peserta didik dan data orang tua murid pada formulir PPDB.",
      actionHint: "Klik tombol 'Formulir PPDB' untuk mulai.",
      seniorFriendlyInstruction: "Isi nama dan data anak pada formulir yang tersedia."
    },
    {
      stepNumber: 2,
      totalSteps: 3,
      title: "Unggah Berkas Persyaratan",
      instruction: "Unggah foto/scan Kartu Keluarga (KK) dan Akta Kelahiran calon murid baru.",
      actionHint: "Gunakan menu unggah dokumen.",
      seniorFriendlyInstruction: "Unggah foto Kartu Keluarga dan Akta Lahir anak."
    },
    {
      stepNumber: 3,
      totalSteps: 3,
      title: "Konfirmasi & Kirim",
      instruction: "Periksa kembali kebenaran data lalu kirim pendaftaran untuk diverifikasi panitia.",
      actionHint: "Klik tombol 'Kirim Pendaftaran'.",
      seniorFriendlyInstruction: "Periksa kembali data lalu tekan tombol Kirim."
    }
  ],

  // Presensi Siswa (R6)
  r6: [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: "Pilih Kelompok Belajar",
      instruction: "Pilih kelas (Kelompok A atau Kelompok B) dan tanggal presensi harian.",
      actionHint: "Gunakan filter kelas di bagian atas.",
      seniorFriendlyInstruction: "Pilih kelas murid yang akan dicatat kehadirannya."
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: "Tandai Kehadiran & Simpan",
      instruction: "Tandai status (Hadir, Sakit, Izin, Alpa) pada tiap murid, lalu simpan presensi.",
      actionHint: "Klik 'Simpan Presensi Harian'.",
      seniorFriendlyInstruction: "Tekan tombol Simpan Presensi setelah selesai menandai."
    }
  ],

  // Pembayaran SPP (R11)
  r11: [
    {
      stepNumber: 1,
      totalSteps: 2,
      title: "Pilih Nama Murid & Bulan Tagihan",
      instruction: "Cari nama santri dan centang bulan SPP yang akan dilunasi.",
      actionHint: "Gunakan pencarian nama siswa.",
      seniorFriendlyInstruction: "Cari nama anak dan pilih bulan SPP yang mau dibayar."
    },
    {
      stepNumber: 2,
      totalSteps: 2,
      title: "Cetak Kwitansi Pembayaran",
      instruction: "Pastikan nominal pembayaran sesuai lalu terbitkan bukti kwitansi sah.",
      actionHint: "Klik 'Cetak Kwitansi Digital'.",
      seniorFriendlyInstruction: "Tekan Cetak Kwitansi untuk mencetak bukti pembayaran."
    }
  ],

  // Backup Data (R25)
  r25: [
    {
      stepNumber: 1,
      totalSteps: 1,
      title: "Unduh Salinan Cadangan",
      instruction: "Sebaiknya lakukan backup data berkala setelah ada perubahan data penting.",
      actionHint: "Klik 'Unduh Backup JSON'.",
      seniorFriendlyInstruction: "Tekan Unduh Cadangan Data untuk menyimpan salinan aman."
    }
  ]
};

export const getWorkflowForTab = (tabCode: string, currentStepIndex = 0): StepInstruction => {
  const code = tabCode.toLowerCase();
  const steps = WORKFLOW_GUIDE_MAP[code];

  if (!steps || steps.length === 0) {
    return {
      stepNumber: 1,
      totalSteps: 1,
      title: "Panduan Halaman",
      instruction: "Periksa data pada halaman ini dan klik Simpan atau Lanjutkan jika ada perubahan.",
      actionHint: "Gunakan menu navigasi.",
      seniorFriendlyInstruction: "Periksa data pada halaman ini, lalu tekan tombol Simpan jika ada perubahan."
    };
  }

  const step = steps[Math.min(currentStepIndex, steps.length - 1)];
  return step;
};
