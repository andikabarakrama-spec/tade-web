/**
 * TRAINING MODE SERVICE — SPRINT G8
 * Interactive Sandbox & Role Training Simulator for New Staff & Foundation Leaders.
 * Fully isolated memory: simulates live actions without mutating production data.
 * Pure Brand: Asy Syifa Sovereign Training Academy.
 */

export type TrainingTrackId = 'GURU_BARU' | 'ADMIN_BARU' | 'PIMPINAN_YAYASAN';

export interface TrainingStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  actionRequired: string;
  completed: boolean;
  hint: string;
}

export interface TrainingTrack {
  id: TrainingTrackId;
  roleTitle: string;
  badge: string;
  durationEst: string;
  description: string;
  steps: TrainingStep[];
}

export class TrainingModeService {
  private static instance: TrainingModeService | null = null;
  private isTrainingActive: boolean = false;
  private currentTrackId: TrainingTrackId = 'GURU_BARU';
  private sandboxData: {
    presensiCount: number;
    anecdoteSaved: number;
    ppdbVerified: number;
    sppApproved: number;
    lettersSigned: number;
  } = {
    presensiCount: 0,
    anecdoteSaved: 0,
    ppdbVerified: 0,
    sppApproved: 0,
    lettersSigned: 0
  };

  private tracks: Record<TrainingTrackId, TrainingTrack> = {
    GURU_BARU: {
      id: 'GURU_BARU',
      roleTitle: 'Pelatihan Guru Baru (Sentra & Tahfidz)',
      badge: 'Ustadzah / Pendidik',
      durationEst: '10 Menit',
      description: 'Panduan praktis mengisi presensi harian sentra, mencatat rekaman anekdot siswa, dan menginput kemajuan hafalan Al-Qur’an.',
      steps: [
        {
          id: 'gb-1',
          stepNumber: 1,
          title: 'Presensi Kehadiran Sentra',
          description: 'Buka modul presensi kelas, pilih kelompok siswa dan tandai status Hadir/Izin/Sakit.',
          actionRequired: 'SIMULATE_PRESENSI',
          completed: false,
          hint: 'Klik tombol "Simulasi Input Presensi Sentra" di bawah.'
        },
        {
          id: 'gb-2',
          stepNumber: 2,
          title: 'Catat Rekaman Anekdot & Perilaku',
          description: 'Catat momen emas siswa saat bermain di sentra ibadah atau sentra alam.',
          actionRequired: 'SIMULATE_ANECDOTE',
          completed: false,
          hint: 'Gunakan tombol "Simulasi Simpan Anekdot Kasih".'
        },
        {
          id: 'gb-3',
          stepNumber: 3,
          title: 'Input Setoran Doa & Surat Pendek',
          description: 'Masukkan capaian hafalan Surat An-Nas dan doa kedua orang tua.',
          actionRequired: 'SIMULATE_TAHFIDZ',
          completed: false,
          hint: 'Klik "Simulasi Input Capaian Tahfidz".'
        }
      ]
    },
    ADMIN_BARU: {
      id: 'ADMIN_BARU',
      roleTitle: 'Pelatihan Administrator SIM Baru',
      badge: 'Staf Tata Usaha',
      durationEst: '12 Menit',
      description: 'Panduan mengelola antrean pendaftaran PPDB, menerbitkan kwitansi SPP, dan menyiarkan maklumat pengumuman.',
      steps: [
        {
          id: 'adm-1',
          stepNumber: 1,
          title: 'Verifikasi Berkas Calon Siswa',
          description: 'Periksa kelengkapan KK, Akta, dan Pas Foto calon siswa baru.',
          actionRequired: 'SIMULATE_PPDB_VERIF',
          completed: false,
          hint: 'Klik "Simulasi Verifikasi Berkas Calon".'
        },
        {
          id: 'adm-2',
          stepNumber: 2,
          title: 'Validasi & Cetak Kwitansi Pembayaran',
          description: 'Periksa bukti transfer dan terbitkan kwitansi resmi ber-QR Code.',
          actionRequired: 'SIMULATE_SPP_RECEIPT',
          completed: false,
          hint: 'Klik "Simulasi Validasi Kwitansi SPP".'
        },
        {
          id: 'adm-3',
          stepNumber: 3,
          title: 'Kirim Maklumat Pengumuman Sekolah',
          description: 'Tulis draf pemberitahuan agenda madrasah dan uji coba simulasi broadcast santun.',
          actionRequired: 'SIMULATE_BROADCAST',
          completed: false,
          hint: 'Klik "Simulasi Broadcast Maklumat".'
        }
      ]
    },
    PIMPINAN_YAYASAN: {
      id: 'PIMPINAN_YAYASAN',
      roleTitle: 'Pelatihan Pimpinan Yayasan & Kepala Sekolah',
      badge: 'Ketua Yayasan & Kepsek',
      durationEst: '8 Menit',
      description: 'Panduan memantau arus kas yayasan, mengaudit log komando eksekutif, dan membubuhkan stempel digital surat dinas.',
      steps: [
        {
          id: 'pim-1',
          stepNumber: 1,
          title: 'Inspeksi Arus Kas & Saldo Madrasah',
          description: 'Pantau laporan penerimaan SPP, infak, dan pengeluaran operasional secara real-time.',
          actionRequired: 'SIMULATE_FINANCE_AUDIT',
          completed: false,
          hint: 'Klik "Simulasi Audit Arus Kas".'
        },
        {
          id: 'pim-2',
          stepNumber: 2,
          title: 'Pengesahan Surat & Izin Digital',
          description: 'Bubuhkan tanda tangan & stempel QR digital pada SK Pengangkatan Guru Baru.',
          actionRequired: 'SIMULATE_SIGN_LETTER',
          completed: false,
          hint: 'Klik "Simulasi Pengesahan Surat Resmi".'
        },
        {
          id: 'pim-3',
          stepNumber: 3,
          title: 'Tinjau Skor Kesiapan Operasional',
          description: 'Periksa kesehatan seluruh pilar kedaulatan sekolah di Cockpit Utama.',
          actionRequired: 'SIMULATE_INSPECT_COCKPIT',
          completed: false,
          hint: 'Klik "Simulasi Tinjau Kesiapan".'
        }
      ]
    }
  };

  public static getInstance(): TrainingModeService {
    if (!TrainingModeService.instance) {
      TrainingModeService.instance = new TrainingModeService();
    }
    return TrainingModeService.instance;
  }

  public isEnabled(): boolean {
    return this.isTrainingActive;
  }

  public setEnabled(active: boolean): void {
    this.isTrainingActive = active;
  }

  public getTrack(trackId: TrainingTrackId): TrainingTrack {
    return this.tracks[trackId];
  }

  public getAllTracks(): TrainingTrack[] {
    return Object.values(this.tracks);
  }

  public executeStepSimulation(trackId: TrainingTrackId, stepId: string): void {
    const track = this.tracks[trackId];
    if (!track) return;
    const step = track.steps.find(s => s.id === stepId);
    if (step) {
      step.completed = true;
      if (step.actionRequired.includes('PRESENSI')) this.sandboxData.presensiCount++;
      if (step.actionRequired.includes('ANECDOTE')) this.sandboxData.anecdoteSaved++;
      if (step.actionRequired.includes('PPDB')) this.sandboxData.ppdbVerified++;
      if (step.actionRequired.includes('SPP')) this.sandboxData.sppApproved++;
      if (step.actionRequired.includes('LETTER')) this.sandboxData.lettersSigned++;
    }
  }

  public resetSandbox(): void {
    Object.values(this.tracks).forEach(track => {
      track.steps.forEach(s => (s.completed = false));
    });
    this.sandboxData = {
      presensiCount: 0,
      anecdoteSaved: 0,
      ppdbVerified: 0,
      sppApproved: 0,
      lettersSigned: 0
    };
  }

  public getSandboxMetrics() {
    return { ...this.sandboxData };
  }
}

export const trainingModeService = TrainingModeService.getInstance();
