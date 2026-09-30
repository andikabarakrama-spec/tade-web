import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Compass, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DocumentationSopViewer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('SOP_GURU');

  const sops = [
    {
      id: 'SOP-01',
      category: 'SOP_GURU',
      title: 'SOP Presensi Harian & Mutabaah Sentra',
      steps: [
        'Buka SIM Madrasah di awal jam KBM (07:00 WIB).',
        'Pilih rombel dan tandai status santri (Hadir, Izin, Sakit, Alpa).',
        'Catat capaian hafalan surat & ayat pada form Mutabaah Tahfidz.',
        'Sistem otomatis menyimpan ke buffer lokal jika offline dan sinkron otomatis saat online.'
      ]
    },
    {
      id: 'SOP-02',
      category: 'SOP_KEUANGAN',
      title: 'SOP Pembayaran SPP & Penutupan Kas Harian',
      steps: [
        'Terima dana dari wali santri (Tunai / Transfer Bank).',
        'Input nomor induk santri dan cetak / bagikan kwitansi digital bertanda tangan kriptografis.',
        'Lakukan rekonsiliasi kas fisik vs catatan sistem pada pukul 15:30 WIB.',
        'Kunci pembukuan harian untuk menjaga integritas neraca SSoT.'
      ]
    },
    {
      id: 'SOP-03',
      category: 'SOP_ADMIN',
      title: 'SOP Disaster Recovery & Restore DORMANT_SAFE',
      steps: [
        'Akses modul Hermes Safe Vault (R854 / G905) menggunakan otentikasi Super Admin.',
        'Pilih snapshot cadangan terverifikasi dengan hash SHA-256 valid.',
        'Jalankan simulasi uji verifikasi sebelum melakukan restore penuh.',
        'Konfirmasi pemulihan (RTO rata-rata &lt; 2 detik, RPO 0 kehilangan data).'
      ]
    },
    {
      id: 'SOP-04',
      category: 'SOP_YAYASAN',
      title: 'SOP Pengawasan Mutu Akademik & Anggaran RKAS',
      steps: [
        'Buka Executive Decision Center (R866 / G907) setiap akhir pekan.',
        'Tinjau tingkat penyerapan anggaran RKAS dan rasio likuiditas kas operasional.',
        'Evaluasi kurva capaian tahfidz seluruh rombel terhadap target semesteran.',
        'Ambil keputusan berbasis data riil tanpa estimasi spekulatif.'
      ]
    }
  ];

  const filteredSops = sops.filter(s => activeCategory === 'ALL' || s.category === activeCategory);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>G908 • Documentation & Operational SOP</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Production Documentation & Standard Operating Procedures
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Panduan operasional baku (SOP), petunjuk teknis KBM, administrasi keuangan, dan tata kelola bencana untuk seluruh pemangku kepentingan.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'SOP_GURU', label: 'SOP Guru & Sentra' },
          { key: 'SOP_KEUANGAN', label: 'SOP Kas & SPP' },
          { key: 'SOP_ADMIN', label: 'SOP Administrator & DR' },
          { key: 'SOP_YAYASAN', label: 'SOP Yayasan & Pimpinan' },
          { key: 'ALL', label: 'Semua SOP' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === tab.key
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SOP Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSops.map((sop) => (
          <div key={sop.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-800 px-2.5 py-0.5 rounded">
                {sop.id}
              </span>
              <span className="text-xs text-slate-400 font-medium">Baku & Tervalidasi</span>
            </div>
            <h3 className="text-base font-bold text-white">{sop.title}</h3>
            <ol className="space-y-2 text-xs text-slate-300">
              {sop.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: step }} />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};
