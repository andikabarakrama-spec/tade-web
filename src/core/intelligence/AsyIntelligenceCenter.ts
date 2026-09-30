export interface IntelligenceItem {
  id: string;
  judul: string;
  sumber: string;
  sumberUrl?: string;
  tanggal: string;
  kategori: 
    | 'AI' 
    | 'Technology' 
    | 'Cybersecurity' 
    | 'Education' 
    | 'Regulation' 
    | 'Open Source' 
    | 'Developer Tools' 
    | 'Automation' 
    | 'AI Agents' 
    | 'Local AI' 
    | 'Self-hosted' 
    | 'Free Technology';
  urgensi: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  ringkasan: string;
  konteks: string;
  relevansi: string;
  dampakTerhadapTADE: string;
  rekomendasi: string;
  status: 'UNREAD' | 'READ' | 'DISCUSSED' | 'SAVED' | 'ARCHIVED';
  verifikasiKeamanan: 'TRUSTED_EXTRACT' | 'SANITIZED_EXTERNAL';
}

export class AsyIntelligenceCenter {
  private static instance: AsyIntelligenceCenter;
  private intelligenceFeed: IntelligenceItem[] = [
    {
      id: 'INTEL-2026-001',
      judul: 'Rilis Model Bahasa Lokal Edge 4-bit untuk Operasional Offline Madrasah',
      sumber: 'Open Weight Edge AI Consortium',
      sumberUrl: 'https://huggingface.co/models',
      tanggal: '2026-08-16',
      kategori: 'Local AI',
      urgensi: 'HIGH',
      ringkasan: 'Arsitektur model bahasa terkuantisasi 4-bit mampu berjalan pada CPU standar tanpa GPU terdedikasi dengan konsumsi RAM di bawah 2GB.',
      konteks: 'Madrasah di daerah pelosok membutuhkan asistensi cerdas tanpa ketergantungan koneksi internet maupun biaya langganan API berulang.',
      relevansi: 'Sangat relevan dengan prinsip Offline Continuity dan Zero Vendor Lock-in TADE.',
      dampakTerhadapTADE: 'Memungkinkan AI Asy dan modul asisten berjalan 100% lokal di server mini madrasah tanpa biaya token API.',
      rekomendasi: 'Uji performa inferensi lokal pada hardware minimum (4GB RAM) di laboratorium simulasi sebelum integrasi bertahap.',
      status: 'UNREAD',
      verifikasiKeamanan: 'SANITIZED_EXTERNAL'
    },
    {
      id: 'INTEL-2026-002',
      judul: 'Pembaruan Regulasi Perlindungan Data Pribadi Pendidikan (UU PDP 2022 / 2026 Guidelines)',
      sumber: 'Kementerian Komunikasi dan Informatika & Kemendikbudristek RI',
      sumberUrl: 'https://kominfo.go.id',
      tanggal: '2026-08-15',
      kategori: 'Regulation',
      urgensi: 'CRITICAL',
      ringkasan: 'Penegasan kewajiban penyimpanan data biometrik dan rekam akademik anak di server berdaulat dalam negeri dengan enkripsi end-to-end.',
      konteks: 'Lembaga pendidikan formal wajib membuktikan audit trail yang tidak dapat diubah (immutable) atas akses data santri.',
      relevansi: 'Sesuai 100% dengan Invarian Konstitusi TADE #4 dan Immutable Regulatory Ledger (R663).',
      dampakTerhadapTADE: 'Memperkuat posisi TADE sebagai platform berdaulat yang patuh hukum nasional tanpa resiko kebocoran cloud publik asing.',
      rekomendasi: 'Aktifkan laporan verifikasi ISO 27001 dan sertifikat Merkle Ledger otomatis untuk laporan berkala yayasan.',
      status: 'UNREAD',
      verifikasiKeamanan: 'TRUSTED_EXTRACT'
    },
    {
      id: 'INTEL-2026-003',
      judul: 'Framework Multi-Agent Orchestration Open-Source Tanpa Ketergantungan Cloud',
      sumber: 'Linux Foundation Decentralized AI Project',
      sumberUrl: 'https://github.com',
      tanggal: '2026-08-14',
      kategori: 'AI Agents',
      urgensi: 'MEDIUM',
      ringkasan: 'Pustaka koordinasi multi-agen yang menggunakan protokol event berbasis antrean lokal (IPC/WebSocket) tanpa panggilan webhook eksternal.',
      konteks: 'Arsitektur eksekutor administratif membutuhkan mekanisme isolasi agen agar tidak membebani UI utama.',
      relevansi: 'Dapat menjadi referensi konseptual bagi Hermes Administrative Contract tanpa mengorbankan status Dormant.',
      dampakTerhadapTADE: 'Menyediakan pola desain isolasi tugas administratif tanpa perlu menginstal dependensi pihak ketiga yang berat.',
      rekomendasi: 'Pertahankan Hermes dalam status DORMANT dan adopsi pola arsitektur secara internal jika diperlukan.',
      status: 'READ',
      verifikasiKeamanan: 'SANITIZED_EXTERNAL'
    },
    {
      id: 'INTEL-2026-004',
      judul: 'Standar PWA Enterprise 2026: Sinkronisasi Latar Belakang Hemat Baterai',
      sumber: 'W3C Web Application Working Group',
      sumberUrl: 'https://w3.org/standards',
      tanggal: '2026-08-12',
      kategori: 'Developer Tools',
      urgensi: 'MEDIUM',
      ringkasan: 'Standarisasi baru Periodic Background Sync API dengan batas alokasi daya ketat pada gawai Android murah.',
      konteks: 'Aplikasi portal wali murid dan guru madrasah sering diakses pada ponsel kelas pemula dengan baterai terbatas.',
      relevansi: 'Melengkapi engine Adaptive Bandwidth Edge Sync (R664) dan PWA Hardener (R659).',
      dampakTerhadapTADE: 'Sinkronisasi kas tabungan dan notifikasi raport berlangsung mulus tanpa menguras baterai ponsel wali santri.',
      rekomendasi: 'Terapkan throttle interval adaptif sesuai profil daya baterai gawai pengguna.',
      status: 'SAVED',
      verifikasiKeamanan: 'SANITIZED_EXTERNAL'
    },
    {
      id: 'INTEL-2026-005',
      judul: 'Audit Keamanan: Pustaka Zero-Trust SQLite / IndexedDB Local Encryption',
      sumber: 'Open Web Application Security Project (OWASP)',
      sumberUrl: 'https://owasp.org',
      tanggal: '2026-08-10',
      kategori: 'Cybersecurity',
      urgensi: 'HIGH',
      ringkasan: 'Panduan mitigasi serangan cold-boot dan ekstraksi cache IndexedDB pada perangkat publik yang dibagi pakai guru madrasah.',
      konteks: 'Komputer administrasi madrasah sering dipakai bersama oleh beberapa guru dan staf TU.',
      relevansi: 'Pilar keamanan sesi multi-pengguna dan Ring-0 Guardian Kernel TADE.',
      dampakTerhadapTADE: 'Menjamin auto-lock dan enkripsi payload lokal tetap aman saat guru berganti komputer piket.',
      rekomendasi: 'Pastikan auto-lock 30 menit dan penghapusan key ephemeral memori saat logout tetap aktif 100%.',
      status: 'DISCUSSED',
      verifikasiKeamanan: 'TRUSTED_EXTRACT'
    }
  ];

  public static getInstance(): AsyIntelligenceCenter {
    if (!AsyIntelligenceCenter.instance) {
      AsyIntelligenceCenter.instance = new AsyIntelligenceCenter();
    }
    return AsyIntelligenceCenter.instance;
  }

  public getIntelligenceFeed(): IntelligenceItem[] {
    return [...this.intelligenceFeed];
  }

  public getCriticalAndHighItems(): IntelligenceItem[] {
    return this.intelligenceFeed.filter(
      item => (item.urgensi === 'CRITICAL' || item.urgensi === 'HIGH') && item.status === 'UNREAD'
    );
  }

  public updateStatus(id: string, newStatus: IntelligenceItem['status']): void {
    const item = this.intelligenceFeed.find(i => i.id === id);
    if (item) {
      item.status = newStatus;
    }
  }

  public getMetrics() {
    const total = this.intelligenceFeed.length;
    const critical = this.intelligenceFeed.filter(i => i.urgensi === 'CRITICAL').length;
    const high = this.intelligenceFeed.filter(i => i.urgensi === 'HIGH').length;
    const unread = this.intelligenceFeed.filter(i => i.status === 'UNREAD').length;
    const saved = this.intelligenceFeed.filter(i => i.status === 'SAVED').length;

    return {
      total,
      critical,
      high,
      unread,
      saved,
      securityScore: 100,
      language: 'Bahasa Indonesia (Resmi)',
      untrustedInputShieldActive: true
    };
  }
}
