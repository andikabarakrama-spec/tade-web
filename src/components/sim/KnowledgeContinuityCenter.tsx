import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Bot, 
  Layers, 
  GraduationCap, 
  DollarSign, 
  UserPlus, 
  Archive, 
  HardDrive, 
  ShieldAlert, 
  Building,
  HelpCircle,
  ArrowRight,
  Send
} from 'lucide-react';

interface SOPItem {
  id: string;
  code: string;
  title: string;
  category: 'Akademik' | 'Keuangan' | 'PPDB' | 'Arsip' | 'Backup' | 'Recovery' | 'Pemerintahan';
  summary: string;
  steps: string[];
  lastUpdated: string;
  author: string;
  approvedBy: string;
}

export const KnowledgeContinuityCenter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSopId, setSelectedSopId] = useState<string>('SOP-AKA-001');

  // AI Asy Chat Simulation for reading SOP
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(
    'Assalamu’alaikum! Saya AI Asy, asisten kontinuitas pengetahuan madrasah. Tanyakan SOP apa saja (misal: tata cara backup mingguan, rekonsiliasi SPP, atau pelaporan Ban-PDM).'
  );
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [sops] = useState<SOPItem[]>([
    {
      id: 'SOP-AKA-001',
      code: 'SOP/AKD/001/2026',
      title: 'SOP Penilaian Pembelajaran Sentra & Portofolio Santri',
      category: 'Akademik',
      summary: 'Tata cara observasi harian, pencatatan unjuk kerja, dokumentasi foto sentra, dan penerbitan raport digital.',
      steps: [
        'Guru sentra menyiapkan lembar checklist indikator capaian mingguan.',
        'Mengambil foto karya nyata santri saat bermain di sentra (balok/bahan alam/peran).',
        'Mengunggah catatan unjuk kerja ke modul R23 Penilaian Sentra sebelum hari Jumat pukul 15.00 WIB.',
        'Kepala Sekolah mereview dan menyetujui draft raport.',
        'Raport digital diterbitkan dengan QR Code dan diarsipkan ke Smart Vault.'
      ],
      lastUpdated: '10 Juli 2026',
      author: 'Waka Kurikulum Sentra',
      approvedBy: 'Kepala Sekolah'
    },
    {
      id: 'SOP-KEU-002',
      code: 'SOP/KEU/002/2026',
      title: 'SOP Penerimaan SPP & Rekonsiliasi Kas Tabungan Santri',
      category: 'Keuangan',
      summary: 'Prosedur pembayaran SPP tunai/transfer, pembukuan buku kas, dan cetak slip ber-watermark.',
      steps: [
        'Wali murid melakukan setor tunai di loket atau transfer via Virtual Account.',
        'Bendahara menginput transaksi ke modul R33 SPP & Keuangan.',
        'Mencetak kuitansi resmi bertanda tangan digital dan stempel valid.',
        'Melakukan rekonsiliasi harian antara saldo fisik brankas dengan mutasi sistem pukul 16.00 WIB.'
      ],
      lastUpdated: '01 Agustus 2026',
      author: 'Bendahara Sekolah',
      approvedBy: 'Ketua Yayasan'
    },
    {
      id: 'SOP-PPD-003',
      code: 'SOP/PDB/003/2026',
      title: 'SOP Penerimaan Peserta Didik Baru (PPDB) & Verifikasi Berkas',
      category: 'PPDB',
      summary: 'Alur registrasi calon santri baru, observasi kesiapan belajar, penempatan kelas, dan pengarsipan akta/KK.',
      steps: [
        'Pendaftaran online/offline melalui portal SIM PPDB.',
        'Verifikasi keaslian dokumen NIK, Akta Kelahiran, dan Kartu Keluarga.',
        'Observasi pemetaan minat sentra santri bersama psikolog/guru BK.',
        'Penerbitan Surat Keputusan Penerimaan Santri Baru ber-QR Code.'
      ],
      lastUpdated: '15 Mei 2026',
      author: 'Panitia PPDB',
      approvedBy: 'Kepala Sekolah'
    },
    {
      id: 'SOP-ARS-004',
      code: 'SOP/ARS/004/2026',
      title: 'SOP Pengarsipan Kriptografis & Retensi 10 Tahun Dokumen',
      category: 'Arsip',
      summary: 'Metode penguncian berkas digital ke Smart Vault dengan jaminan integritas SHA-256 dan zero overwrite.',
      steps: [
        'Semua dokumen yang telah disahkan dikonversi ke format PDF/A standar.',
        'Generate pasangan hash SHA-256 dan sertifikat digital.',
        'Simpan ke partisi tahunan Smart Vault.',
        'Kunci status dokumen menjadi IMMUTABLE READ-ONLY.'
      ],
      lastUpdated: '01 Juni 2026',
      author: 'Admin SIM & Arsiparis',
      approvedBy: 'Ketua Yayasan'
    },
    {
      id: 'SOP-BAK-005',
      code: 'SOP/BCK/005/2026',
      title: 'SOP Backup Mandiri Triple-Tier Redundancy (Laptop, SSD, Cloud)',
      category: 'Backup',
      summary: 'Prosedur pencadangan data madrasah setiap Jumat sore tanpa ketergantungan pada vendor luar.',
      steps: [
        'Buka modul R211 Backup Health Monitor.',
        'Klik Export Full Encrypted Snapshot ke penyimpanan lokal laptop admin.',
        'Hubungkan SSD Fisik Khusus Brankas dan salin backup_snapshot.enc.',
        'Verifikasi kecocokan SHA-256 checksum antara laptop dan SSD.',
        'Sinkronisasikan cadangan terenkripsi ke Sovereign Cloud Vault.'
      ],
      lastUpdated: '12 Agustus 2026',
      author: 'Lead Infrastructure Engineer',
      approvedBy: 'Ketua Yayasan'
    },
    {
      id: 'SOP-REC-006',
      code: 'SOP/RCV/006/2026',
      title: 'SOP Pemulihan Darurat Sistem & Bencana Perangkat (Disaster Recovery)',
      category: 'Recovery',
      summary: 'Protokol pemulihan instan saat laptop admin rusak atau harddisk hang dalam tempo < 15 menit.',
      steps: [
        'Siapkan perangkat pengganti dan buka aplikasi FINAL7.',
        'Gunakan Recovery Card 2-of-3 Quorum yayasan.',
        'Impor snapshot cadangan terakhir dari SSD Fisik.',
        'Jalankan verifikasi integritas data dan lanjutkan operasional madrasah.'
      ],
      lastUpdated: '14 Agustus 2026',
      author: 'Disaster Recovery Team',
      approvedBy: 'Dewan Pembina'
    },
    {
      id: 'SOP-PEM-007',
      code: 'SOP/GOV/007/2026',
      title: 'SOP Kepatuhan Akreditasi Ban-PDM & Sinkronisasi EMIS Kemenag',
      category: 'Pemerintahan',
      summary: 'Standar pelaporan data berkala ke instansi pembina, Kemenag, dan badan akreditasi nasional.',
      steps: [
        'Sinkronisasi data santri dan PTK aktif dengan database EMIS 4.0.',
        'Generate rekap instrumen 8 Standar Nasional Pendidikan via R111 Akreditasi Sentinel.',
        'Review berkas bukti fisik dan digital bersama Tim Penjaminan Mutu.',
        'Submit berkas akreditasi resmi sebelum batas akhir semester.'
      ],
      lastUpdated: '15 Agustus 2026',
      author: 'Tim Penjaminan Mutu',
      approvedBy: 'Kepala Sekolah'
    }
  ]);

  const filteredSops = sops.filter(sop => {
    const matchesCategory = selectedCategory === 'ALL' || sop.category === selectedCategory;
    const matchesSearch = 
      sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sop.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeSop = sops.find(s => s.id === selectedSopId) || sops[0];

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);
    const query = aiQuestion.toLowerCase();

    setTimeout(() => {
      if (query.includes('backup') || query.includes('cadangan')) {
        setAiAnswer(
          '📌 **Panduan Backup TADE:** Sesuai SOP/BCK/005/2026, lakukan backup mingguan pada hari Jumat sore. Gunakan skema Triple-Tier: Simpan snapshot di Laptop Admin, SSD Fisik Brankas, dan Sovereign Cloud. Pastikan SHA-256 cocok 100%.'
        );
      } else if (query.includes('spp') || query.includes('uang') || query.includes('tabungan')) {
        setAiAnswer(
          '📌 **Panduan Keuangan SPP:** Sesuai SOP/KEU/002/2026, setiap pembayaran wajib dicatat di modul R33, kuitansi dicetak ber-watermark, dan rekonsiliasi kas dilakukan pukul 16.00 WIB setiap hari kerja.'
        );
      } else if (query.includes('akreditasi') || query.includes('ban-pdm') || query.includes('kemenag')) {
        setAiAnswer(
          '📌 **Panduan Akreditasi Ban-PDM:** Sesuai SOP/GOV/007/2026, seluruh dokumen SK, Raport Sentra, dan Kurikulum yang diarsipkan di Smart Vault siap diaudit langsung dengan scan QR Code HMAC-SHA256.'
        );
      } else {
        setAiAnswer(
          `📌 **Hasil Penelusuran SOP:** Terkait pertanyaan "${aiQuestion}", silakan mengacu pada SOP ${activeSop.code} (${activeSop.title}). Anda dapat menjalankan langkah operasional 1 sampai ${activeSop.steps.length} sebagaimana tertera di panduan sebelah kanan.`
        );
      }
      setIsAiLoading(false);
    }, 600);
  };

  const getCategoryIcon = (category: SOPItem['category']) => {
    switch (category) {
      case 'Akademik': return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'Keuangan': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'PPDB': return <UserPlus className="w-4 h-4 text-cyan-500" />;
      case 'Arsip': return <Archive className="w-4 h-4 text-amber-500" />;
      case 'Backup': return <HardDrive className="w-4 h-4 text-indigo-500" />;
      case 'Recovery': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'Pemerintahan': return <Building className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div id="knowledge-continuity-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-48 h-48 text-purple-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R229 &bull; KNOWLEDGE CONTINUITY
              </span>
              <span className="text-xs text-slate-400">Institutional Wisdom & SOP Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-400" />
              Knowledge Continuity Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Repositori SOP baku lintas generasi (<strong>Akademik, Keuangan, PPDB, Arsip, Backup, Recovery, Pemerintahan</strong>). Dilengkapi <em>Asisten Cerdas AI Asy</em> untuk membantu pejabat baru memahami prosedur operasional dalam hitungan detik.
            </p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total SOP Tersimpan</span>
            <span className="text-xl font-bold text-white font-mono">{sops.length} Prosedur Baku</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Kategori Lengkap</span>
            <span className="text-xl font-bold text-purple-400 font-mono">7 KATEGORI UTAMA</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Asisten Pintar SOP</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">AI ASY READY</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Retensi Pengetahuan</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">100% PRESERVED</span>
          </div>
        </div>
      </div>

      {/* AI Asy Interactive Query Helper Bar */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg space-y-3 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-purple-200">AI Asy &bull; Konsultasi Prosedur & Tanya Jawab SOP</h3>
        </div>

        <form onSubmit={handleAskAi} className="flex gap-2">
          <input
            type="text"
            placeholder="Tanyakan SOP ke AI Asy (misal: bagaimana cara pemulihan darurat jika laptop rusak?)..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isAiLoading}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isAiLoading ? 'Membaca...' : 'Tanyakan'}
          </button>
        </form>

        {aiAnswer && (
          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-purple-500/20 text-xs text-slate-200 leading-relaxed font-sans">
            {aiAnswer}
          </div>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'Akademik', 'Keuangan', 'PPDB', 'Arsip', 'Backup', 'Recovery', 'Pemerintahan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari SOP, kode, kata kunci..."
            maxLength={100}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* 2-Column Layout: SOP List & Full Step Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: SOP Items */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredSops.map((sop) => (
            <div
              key={sop.id}
              onClick={() => setSelectedSopId(sop.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedSopId === sop.id
                  ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {getCategoryIcon(sop.category)}
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{sop.category}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {sop.code}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{sop.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{sop.summary}</p>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>{sop.steps.length} Langkah Prosedur</span>
                <span className="font-mono">{sop.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Active SOP Detail */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                {activeSop.code} &bull; {activeSop.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Revisi Terakhir: {activeSop.lastUpdated}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">{activeSop.title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{activeSop.summary}</p>
          </div>

          {/* Sequential Step List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Langkah Kerja Terstruktur (Sequential Action Plan)
            </h3>

            <div className="space-y-2.5">
              {activeSop.steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Meta */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Penyusun SOP:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{activeSop.author}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Pengesahan Resmi:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">{activeSop.approvedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
