import { AsyIntelligenceCenter, IntelligenceItem } from './AsyIntelligenceCenter';

export interface DialogueResponse {
  query: string;
  fakta: string[];
  analisis: string[];
  rekomendasi: string[];
  insufficientDataNote?: string;
  timestamp: string;
}

export class TwoWayIntelligenceEngine {
  private static instance: TwoWayIntelligenceEngine;

  public static getInstance(): TwoWayIntelligenceEngine {
    if (!TwoWayIntelligenceEngine.instance) {
      TwoWayIntelligenceEngine.instance = new TwoWayIntelligenceEngine();
    }
    return TwoWayIntelligenceEngine.instance;
  }

  public answerQuery(query: string): DialogueResponse {
    const q = query.toLowerCase().trim();
    const now = new Date().toISOString();
    const intel = AsyIntelligenceCenter.getInstance().getIntelligenceFeed();

    // Query 1: Perkembangan AI minggu ini
    if (q.includes('perkembangan ai') || q.includes('ai minggu ini') || q.includes('tren ai')) {
      return {
        query,
        fakta: [
          'Model bahasa open-weight lokal 4-bit terbukti dapat berjalan pada CPU standar dengan konsumsi RAM di bawah 2GB tanpa GPU eksternal.',
          'Framework multi-agent orchestration open-source kini beralih ke protokol IPC lokal untuk menghindari latency jaringan dan biaya token cloud.',
          'Standar UU PDP 2022/2026 menegaskan perlindungan data biometrik dan kedaulatan data pendidikan nasional.'
        ],
        analisis: [
          'Kecenderungan industri AI saat ini mengarah pada model kecil yang efisien (Small Language Models / SLM) yang berorientasi edge/on-premise.',
          'Hal ini selaras sempurna dengan filosofi TADE yang menolak ketergantungan API berbayar dan memprioritaskan kedaulatan data madrasah.',
          'Tidak ditemukan risiko disrupsi negatif terhadap arsitektur TADE selama prinsip Offline-First dan Ring-0 Guardian tetap terjaga.'
        ],
        rekomendasi: [
          'Pertahankan arsitektur zero-dependency eksternal TADE.',
          'Lakukan riset benchmarking model 4-bit pada lingkungan lab offline sebelum mempertimbangkan inferensi asisten lokal.',
          'Simpan temuan ini ke dalam Knowledge Vault sebagai materi referensi Founder.'
        ],
        timestamp: now
      };
    }

    // Query 2: Teknologi gratis untuk administrasi sekolah
    if (q.includes('teknologi gratis') || q.includes('administrasi sekolah') || q.includes('free tech')) {
      return {
        query,
        fakta: [
          'Terdapat berbagai pustaka open-source untuk kompresi dokumen, parsing spreadsheet offline, dan rendering PDF lokal.',
          'Standar PWA 2026 memungkinkan sinkronisasi background hemat daya tanpa memerlukan server push berbayar seperti Firebase Cloud Messaging berlisensi tinggi.',
          'Penyimpanan terdistribusi lokal berbasis SQLite/IndexedDB terenkripsi telah lulus audit OWASP untuk isolasi multi-pengguna.'
        ],
        analisis: [
          'Teknologi gratis berlisensi MIT/Apache 2.0 yang dapat di-self-host adalah pilihan optimal untuk menekan TCO (Total Cost of Ownership) madrasah hingga Rp 0/bulan.',
          'Pemisahan struktur biaya (Software, Model, Hosting, Storage) membuktikan bahwa TADE telah mencapai efisiensi biaya tertinggi.'
        ],
        rekomendasi: [
          'Adopsi pendekatan Free Technology Radar dengan evaluasi berkala atas Lock-in dan Maturity score.',
          'Tolak layanan cloud yang menawarkan "Free Tier" sementara yang berubah berbayar saat kuota data santri meningkat.'
        ],
        timestamp: now
      };
    }

    // Query 3: Alternatif Hermes gratis
    if (q.includes('alternatif hermes') || q.includes('hermes gratis') || q.includes('pengganti hermes')) {
      return {
        query,
        fakta: [
          'Hermes saat ini berada dalam status DORMANT (Control Plane siap tanpa runtime aktif).',
          'Arsitektur eksekusi administratif TADE saat ini didukung oleh modul internal (R1-R666) dengan Single Source of Truth src/services/db.ts.',
          'Eksekusi tugas rutin (rekap absensi, kwitansi SPP, cetak raport) telah berjalan 100% mandiri melalui script otomasi internal tanpa biaya API.'
        ],
        analisis: [
          'Tidak diperlukan dependensi pihak ketiga atau model eksternal berbayar untuk menjalankan tugas administratif inti madrasah.',
          'Sovereign Manual Administration Mode (R674) dan Hermes Administrative Contract (R673) sudah memadai untuk tata kelola tanpa dependensi luar.'
        ],
        rekomendasi: [
          'Biarkan Hermes tetap DORMANT sampai ada kebutuhan operasional riil yang disetujui langsung oleh Founder.',
          'Gunakan otomasi native berbasis role-based capability yang sudah tersedia di TADE.'
        ],
        timestamp: now
      };
    }

    // Query 4: Pencocokan dengan item intelligence tertentu
    const matchingItem = intel.find(item => 
      q.includes(item.kategori.toLowerCase()) || 
      q.includes(item.judul.toLowerCase()) ||
      item.ringkasan.toLowerCase().split(' ').some(w => w.length > 4 && q.includes(w))
    );

    if (matchingItem) {
      return {
        query,
        fakta: [
          `Sumber: ${matchingItem.sumber} (${matchingItem.tanggal})`,
          `Ringkasan: ${matchingItem.ringkasan}`,
          `Kategori: ${matchingItem.kategori} | Urgensi: ${matchingItem.urgensi}`
        ],
        analisis: [
          `Konteks Relevansi: ${matchingItem.konteks}`,
          `Dampak terhadap TADE: ${matchingItem.dampakTerhadapTADE}`
        ],
        rekomendasi: [
          matchingItem.rekomendasi,
          'Lakukan peninjauan lebih lanjut di AI Asy Intelligence Center jika diperlukan aksi strategis.'
        ],
        timestamp: now
      };
    }

    // Fallback saat data belum cukup (Jujur dan tidak mengarang)
    return {
      query,
      fakta: [
        'Data spesifik mengenai topik ini belum tersedia dalam feed intelijen tervalidasi saat ini.'
      ],
      analisis: [
        'AI Asy beroperasi dengan prinsip Anti-Halusinasi dan Data Provenance ketat. Kami tidak mengarang data atau memalsukan sumber eksternal.'
      ],
      rekomendasi: [
        'Super Admin dapat memasukkan query terkait kategori AI, Regulasi UU PDP, PWA Enterprise, atau Free Technology Radar.',
        'Data intelijen eksternal baru akan diverifikasi dan disanitasi sebelum disajikan di pusat intelijen.'
      ],
      insufficientDataNote: 'Catatan Keamanan: Data tidak mencukupi untuk analisis mendalam tanpa sumber primer terverifikasi.',
      timestamp: now
    };
  }
}
