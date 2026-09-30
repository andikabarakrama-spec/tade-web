export interface WorkflowStepBlueprint {
  name: string;
  description: string;
}

export interface AdministrativeWorkflowBlueprint {
  workflowId: string;
  category: 
    | 'ABSENSI' 
    | 'SPP_PEMBAYARAN' 
    | 'TABUNGAN' 
    | 'PPDB' 
    | 'LAPORAN' 
    | 'PENGUMUMAN' 
    | 'SURAT_DOKUMEN' 
    | 'ARSIP' 
    | 'ADMINISTRASI_GURU' 
    | 'ADMINISTRASI_SISWA';
  title: string;
  description: string;
  targetRole: 'SUPER_ADMIN' | 'KETUA_YAYASAN' | 'KEPALA_SEKOLAH' | 'GURU' | 'ADMIN_TU';
  inputSpec: string[];
  processSteps: WorkflowStepBlueprint[];
  validationRules: string[];
  outputArtifacts: string[];
  auditCategory: string;
  recoveryProcedure: string;
}

export class AdministrativeWorkflowLibrary {
  private static instance: AdministrativeWorkflowLibrary;
  private workflows: AdministrativeWorkflowBlueprint[] = [
    {
      workflowId: 'WF-ABS-01',
      category: 'ABSENSI',
      title: 'Rekapitulasi Presensi Santri Bulanan',
      description: 'Menghitung tingkat kehadiran santri, absensi tanpa keterangan, sakit, dan izin per rombel kelas.',
      targetRole: 'GURU',
      inputSpec: ['ID Kelas / Rombel', 'Periode Bulan & Tahun', 'Toleransi Jam Masuk'],
      processSteps: [
        { name: 'Fetch Attendance Stream', description: 'Ambil log presensi harian dari database db.ts' },
        { name: 'Aggregate Metrics', description: 'Kalkulasi rasio kehadiran, izin, sakit, alpa secara matematis' },
        { name: 'Generate Class Summary', description: 'Susun ringkasan siap cetak untuk wali kelas & wali santri' }
      ],
      validationRules: ['Total hari efektif cocok dengan kalender pendidikan', 'Tidak ada santri ganda'],
      outputArtifacts: ['Rekap Presensi PDF / Data Table', 'Notifikasi Santri Kritis (<80% hadir)'],
      auditCategory: 'AUDIT_ATTENDANCE_PROCESS',
      recoveryProcedure: 'Gunakan snapshot offline IndexedDB jika koneksi database sinkronisasi terputus.'
    },
    {
      workflowId: 'WF-SPP-02',
      category: 'SPP_PEMBAYARAN',
      title: 'Rekapitulasi Pelunasan SPP & Tagihan Bulanan',
      description: 'Memeriksa status pelunasan iuran bulanan santri dan menyusun rekap piutang serta penerimaan kas.',
      targetRole: 'ADMIN_TU',
      inputSpec: ['Bulan Tagihan', 'Data Tarif SPP Santri', 'Buku Kas Penerimaan'],
      processSteps: [
        { name: 'Check Payment Records', description: 'Validasi bukti transfer / kas tunai di SSoT db.ts' },
        { name: 'Compute Outstanding Dues', description: 'Hitung sisa tunggakan per santri' },
        { name: 'Generate Invoice Recap', description: 'Kompilasi laporan keuangan penerimaan kas SPP' }
      ],
      validationRules: ['Anti-Negative Balance Invariant #2', 'Kwitansi memiliki kode hash unik'],
      outputArtifacts: ['Laporan Kas SPP Bulanan', 'Draf Pesan Tagihan Sopan ke Wali Santri'],
      auditCategory: 'AUDIT_SPP_SETTLEMENT',
      recoveryProcedure: 'Rollback transaksi jika ditemukan collision receipt ID dan muat ulang dari Ledger.'
    },
    {
      workflowId: 'WF-TAB-03',
      category: 'TABUNGAN',
      title: 'Rekonsiliasi Kas Tabungan Santri',
      description: 'Audit saldo simpanan tabungan santri dengan mutasi fisik kas bendahara madrasah.',
      targetRole: 'ADMIN_TU',
      inputSpec: ['Nomor Rekening Santri', 'Rentang Tanggal', 'Nilai Saldo Fisik Brankas'],
      processSteps: [
        { name: 'Aggregate Debit & Credit', description: 'Hitung seluruh setoran dan penarikan terverifikasi' },
        { name: 'Verify Ledger Balance', description: 'Bandingkan dengan total kas fisik bendahara' },
        { name: 'Flag Anomalies', description: 'Deteksi penarikan di atas limit atau saldo negatif' }
      ],
      validationRules: ['Invarian Konstitusi #1: Saldo tabungan tidak boleh < Rp 0', 'Multi-Signature approval jika > Rp 1jt'],
      outputArtifacts: ['Buku Tabungan Rekonsiliasi', 'Berita Acara Saldo Kas'],
      auditCategory: 'AUDIT_SAVINGS_RECONCILIATION',
      recoveryProcedure: 'Karantina akun bersaldo anomali dan jalankan Human Handoff ke Kepala Sekolah.'
    },
    {
      workflowId: 'WF-PPDB-04',
      category: 'PPDB',
      title: 'Verifikasi Berkas & Administrasi Calon Santri',
      description: 'Pemeriksaan kelengkapan dokumen pendaftaran calon santri baru (Akta, KK, Ijazah sebelumnya).',
      targetRole: 'ADMIN_TU',
      inputSpec: ['Nomor Registrasi PPDB', 'Unggahan Dokumen', 'Data Wali Santri'],
      processSteps: [
        { name: 'Sanitize Metadata', description: 'Periksa ekstensi dan ukuran berkas santri' },
        { name: 'Verify Mandatory Fields', description: 'Validasi NIK, NISN, dan kelengkapan kontak darurat' },
        { name: 'Assign Test Number', description: 'Terbitkan nomor kartu ujian seleksi santri' }
      ],
      validationRules: ['NIK 16 digit valid', 'Format tanggal lahir sesuai'],
      outputArtifacts: ['Kartu Peserta Ujian PPDB', 'Status Kelayakan Berkas'],
      auditCategory: 'AUDIT_PPDB_ADMISSION',
      recoveryProcedure: 'Kirim notifikasi otomatis ke wali untuk melengkapi berkas yang buram atau kurang.'
    },
    {
      workflowId: 'WF-LAP-05',
      category: 'LAPORAN',
      title: 'Penyusunan Ringkasan Eksekutif Madrasah',
      description: 'Kompilasi performa akademik, ketuntasan kurikulum, absensi, dan neraca kas operasional.',
      targetRole: 'KEPALA_SEKOLAH',
      inputSpec: ['Tahun Ajaran / Semester', 'Data Master db.ts', 'Catatan Pembina'],
      processSteps: [
        { name: 'Fetch Aggregate Data', description: 'Ambil metrik agregat seluruh departemen madrasah' },
        { name: 'Generate Executive Brief', description: 'Susun grafik dan matriks pencapaian target kerja' },
        { name: 'Apply Digital Seal', description: 'Bubuhkan stempel digital kepala sekolah' }
      ],
      validationRules: ['Data terintegrasi 100% dari SSoT db.ts', 'Tidak ada proyeksi fiktif'],
      outputArtifacts: ['Draf Laporan Kinerja Madrasah PDF', 'Ringkasan Rapat Komite'],
      auditCategory: 'AUDIT_EXECUTIVE_REPORT',
      recoveryProcedure: 'Muat ulang data modul yang gagal dari checkpoint terakhir cache Ring-0.'
    },
    {
      workflowId: 'WF-PENG-06',
      category: 'PENGUMUMAN',
      title: 'Penyusunan Draf Surat Edaran & Notifikasi Wali',
      description: 'Format surat edaran resmi libur semester, jadwal ujian, atau kegiatan ekstrakurikuler santri.',
      targetRole: 'ADMIN_TU',
      inputSpec: ['Judul Edaran', 'Isi Pesan', 'Jadwal Efektif', 'Target Penerima'],
      processSteps: [
        { name: 'Apply Official Header', description: 'Gunakan kop resmi yayasan dan nomor surat otomatis' },
        { name: 'Draft Formal Text', description: 'Susun redaksi bahasa Indonesia baku dan santun' },
        { name: 'Queue Distribution', description: 'Siapkan pengiriman ke portal wali murid' }
      ],
      validationRules: ['Nomor surat tidak boleh tabrakan', 'Memerlukan review Kepala Madrasah'],
      outputArtifacts: ['Surat Edaran PDF Resmi', 'Notifikasi Portal Santri'],
      auditCategory: 'AUDIT_CIRCULAR_ANNOUNCEMENT',
      recoveryProcedure: 'Kembalikan nomor surat ke antrean jika draf dibatalkan.'
    },
    {
      workflowId: 'WF-SURAT-07',
      category: 'SURAT_DOKUMEN',
      title: 'Penerbitan Surat Keterangan Aktif Santri',
      description: 'Pembuatan surat keterangan aktif belajar santri untuk keperluan beasiswa atau dinas.',
      targetRole: 'ADMIN_TU',
      inputSpec: ['NISN Santri', 'Nama Lengkap', 'Tujuan Pembuatan Surat'],
      processSteps: [
        { name: 'Verify Student Active Status', description: 'Pastikan santri terdaftar aktif di semester berjalan' },
        { name: 'Generate Serial Number', description: 'Alokasikan nomor surat keterangan resmi' },
        { name: 'Render Verified PDF', description: 'Sertakan QR Code verifikasi keaslian dokumen' }
      ],
      validationRules: ['Santri berstatus AKTIF (bukan mutasi/alumni)', 'QR Code memuat hash verifikasi'],
      outputArtifacts: ['Surat Keterangan Aktif PDF ber-QR'],
      auditCategory: 'AUDIT_OFFICIAL_LETTER',
      recoveryProcedure: 'Batalkan nomor surat jika data santri tidak ditemukan.'
    },
    {
      workflowId: 'WF-ARS-08',
      category: 'ARSIP',
      title: 'Digitalisasi & Pengarsipan Berkas Ijazah/Rapor',
      description: 'Pengindeksan berkas nilai dan sertifikat santri ke dalam Smart Vault terenkripsi.',
      targetRole: 'ADMIN_TU',
      inputSpec: ['Berkas Scan', 'Metadata Tahun Lulus', 'Daftar Nilai Akhir'],
      processSteps: [
        { name: 'Calculate SHA-256 Hash', description: 'Hitung sidik jari digital berkas arsip' },
        { name: 'Index to Smart Vault', description: 'Kategorikan berdasarkan tahun ajaran dan kelas' },
        { name: 'Generate Archive Index', description: 'Buat katalog pencarian cepat arsip' }
      ],
      validationRules: ['Hash integritas tersimpan di Immutable Ledger', 'Enkripsi data pribadi'],
      outputArtifacts: ['Entri Arsip Terverifikasi', 'Log Indeks Smart Vault'],
      auditCategory: 'AUDIT_SMART_ARCHIVE',
      recoveryProcedure: 'Verifikasi hash cadangan offline jika terjadi kegagalan pembacaan storage.'
    },
    {
      workflowId: 'WF-GURU-09',
      category: 'ADMINISTRASI_GURU',
      title: 'Kompilasi Jurnal Mengajar & Modul Ajar Guru',
      description: 'Penyusunan perangkat ajar, agenda harian kelas, dan capaian pembelajaran guru bidang studi.',
      targetRole: 'GURU',
      inputSpec: ['Mata Pelajaran', 'Capaian Pembelajaran (CP)', 'Tanggal Mengajar', 'Jurnal Catatan'],
      processSteps: [
        { name: 'Format Daily Journal', description: 'Strukturkan materi yang diajarkan dan absensi kelas' },
        { name: 'Track Curriculum Progress', description: 'Hitung persentase target capaian kurikulum' },
        { name: 'Generate Teacher Dossier', description: 'Satukan dalam portofolio administrasi guru' }
      ],
      validationRules: ['Guru terikat pada mata pelajaran yang diajar', 'Sesuai format Kemenag / Diknas'],
      outputArtifacts: ['Jurnal Mengajar Terformat', 'Laporan Capaian Kurikulum'],
      auditCategory: 'AUDIT_TEACHER_ADMIN',
      recoveryProcedure: 'Simpan draf lokal di browser jika proses kompilasi terinterupsi.'
    },
    {
      workflowId: 'WF-SIS-10',
      category: 'ADMINISTRASI_SISWA',
      title: 'Pembaruan Data Pokok & Mutasi Santri',
      description: 'Proses perubahan data santri, perpindahan kelas, atau administrasi mutasi keluar/masuk.',
      targetRole: 'ADMIN_TU',
      inputSpec: ['NISN Santri', 'Jenis Perubahan Data', 'Dokumen Pendukung Mutasi'],
      processSteps: [
        { name: 'Audit Existing Profile', description: 'Ambil profil lengkap santri dari db.ts' },
        { name: 'Apply Validated Changes', description: 'Lakukan pembaruan field data yang disetujui' },
        { name: 'Emit State Change Event', description: 'Catat perubahan riwayat mutasi di jurnal abadi' }
      ],
      validationRules: ['Tidak mengubah history nilai terdahulu', 'Perlu persetujuan Kepala Madrasah jika mutasi'],
      outputArtifacts: ['Buku Induk Santri Terkini', 'Surat Keterangan Pindah / Mutasi'],
      auditCategory: 'AUDIT_STUDENT_MUTATION',
      recoveryProcedure: 'Gunakan audit rollback trail jika data mutasi dibatalkan sebelum pengesahan.'
    }
  ];

  public static getInstance(): AdministrativeWorkflowLibrary {
    if (!AdministrativeWorkflowLibrary.instance) {
      AdministrativeWorkflowLibrary.instance = new AdministrativeWorkflowLibrary();
    }
    return AdministrativeWorkflowLibrary.instance;
  }

  public getAllWorkflows(): AdministrativeWorkflowBlueprint[] {
    return [...this.workflows];
  }

  public getWorkflowById(id: string): AdministrativeWorkflowBlueprint | undefined {
    return this.workflows.find(w => w.workflowId === id);
  }

  public getWorkflowsByCategory(category: string): AdministrativeWorkflowBlueprint[] {
    return this.workflows.filter(w => w.category === category);
  }
}
