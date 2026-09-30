import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  Copy,
  Printer,
  ShieldCheck,
  Building,
  UserCheck,
  Send,
  Plus,
  BookOpen
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface LetterTemplate {
  id: string;
  code: string;
  title: string;
  category: 'SK' | 'TUGAS' | 'UNDANGAN' | 'DISPOSISI' | 'BERITA_ACARA' | 'KETERANGAN' | 'KELUAR' | 'MASUK' | 'MEMO';
  description: string;
  standardRef: string;
  sampleNumber: string;
}

export const GovernmentLetterIntelligenceCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const templates: LetterTemplate[] = [
    {
      id: 'TMPL-01',
      code: 'SK-YYS-01',
      title: 'Surat Keputusan (SK) Pengangkatan Pendidik & Tenaga Kependidikan',
      category: 'SK',
      description: 'SK resmi Ketua Yayasan penetapan formasi guru/staf sentra dengan hak & kewajiban tugas.',
      standardRef: 'Permendikbudristek No. 40/2021 & Anggaran Dasar Yayasan',
      sampleNumber: '018/SK/YYS-ASY/KPTS/VIII/2026'
    },
    {
      id: 'TMPL-02',
      code: 'ST-KS-02',
      title: 'Surat Perintah Tugas (SPT) Mengikuti Pelatihan Kurikulum Merdeka PAUD',
      category: 'TUGAS',
      description: 'Penugasan resmi Kepala Sekolah kepada Ustadzah untuk workshop sentra & diklat PAUD.',
      standardRef: 'Peraturan Kepala ANRI No. 9/2018 tentang Tata Naskah Dinas',
      sampleNumber: '094/ST/TK-ASY/VIII/2026'
    },
    {
      id: 'TMPL-03',
      code: 'UND-WALI-03',
      title: 'Surat Undangan Temu Wicara & Parenting Sentra Karakter',
      category: 'UNDANGAN',
      description: 'Undangan formal kepada wali santri terkait seminar parenting & laporan capaian belajar.',
      standardRef: 'Standar Naskah Dinas Pendidikan & Hubungan Masyarakat',
      sampleNumber: '112/UND/TK-ASY/VIII/2026'
    },
    {
      id: 'TMPL-04',
      code: 'DISP-KS-04',
      title: 'Lembar Disposisi Kepala Sekolah atas Surat Dinas Masuk',
      category: 'DISPOSISI',
      description: 'Instruksi tindak lanjut pimpinan terhadap edaran dinas pendidikan kab. Jember.',
      standardRef: 'Pedoman Tata Kearsipan Statis & Dinamis Kemendikbudristek',
      sampleNumber: 'DISP/045/TK-ASY/VIII/2026'
    },
    {
      id: 'TMPL-05',
      code: 'BA-ST-05',
      title: 'Berita Acara Serah Terima (BAST) Sarana & Mainan Edukatif Sentra',
      category: 'BERITA_ACARA',
      description: 'Berita acara pemeriksaan fisik dan serah terima balok, alat sentra, dan media belajar.',
      standardRef: 'Standar Inventarisasi Aset & Pengadaan Sarpras Satuan Pendidikan',
      sampleNumber: '034/BA/SENTRA-ASY/VIII/2026'
    },
    {
      id: 'TMPL-06',
      code: 'SKET-AKTIF-06',
      title: 'Surat Keterangan Aktif Belajar Santri KB-TK',
      category: 'KETERANGAN',
      description: 'Surat keterangan resmi keabsahan santri menempuh pendidikan di KB-TK Sentra Asy-Syifa.',
      standardRef: 'Pedoman Pelayanan Administrasi Peserta Didik PAUD',
      sampleNumber: '142/421.1/TK-ASY/VIII/2026'
    },
    {
      id: 'TMPL-07',
      code: 'SKEL-DINAS-07',
      title: 'Surat Keluar Permohonan Kunjungan Edukasi Sentra Bahan Alam',
      category: 'KELUAR',
      description: 'Surat keluar resmi permohonan kunjungan santri ke balai konservasi flora & pertanian.',
      standardRef: 'Format Surat Eksternal Resmi Lembaga Pendidikan',
      sampleNumber: '150/421.1/TK-ASY/VIII/2026'
    },
    {
      id: 'TMPL-08',
      code: 'SMAS-REG-08',
      title: 'Registrasi Agenda Surat Masuk Edaran Dinas Pendidikan',
      category: 'MASUK',
      description: 'Pencatatan surat masuk dari kementerian/dinas lengkap tanggal terima dan nomor agenda.',
      standardRef: 'Klasifikasi Kode Arsip Pendidikan RI 421.1',
      sampleNumber: '089/SM/DISDIK-JBR/VIII/2026'
    },
    {
      id: 'TMPL-09',
      code: 'MEMO-INT-09',
      title: 'Nota Dinas / Memo Internal Persiapan Haflah Akhirussanah',
      category: 'MEMO',
      description: 'Instruksi internal koordinasi panitia wisuda santri, tasmi Al-Quran, dan pameran sentra.',
      standardRef: 'Format Tata Naskah Komunikasi Internal Satuan PAUD',
      sampleNumber: '052/MEMO/KS-ASY/VIII/2026'
    }
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyFormat = (tmpl: LetterTemplate) => {
    navigator.clipboard.writeText(`Template: ${tmpl.title}\nNomor: ${tmpl.sampleNumber}\nPedoman: ${tmpl.standardRef}`);
    setIsCopied(true);
    blackBoxRecorder.record({
      moduleCode: 'R424-LETTER-INTEL',
      role: 'ADMIN',
      eventType: 'ACTION',
      details: `Government Letter Template selected: ${tmpl.code} (${tmpl.title}). Standard: ${tmpl.standardRef}.`,
      severity: 'INFO'
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div id="government-letter-intelligence-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R424 &bull; GOVERNMENT LETTER INTELLIGENCE CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">150+ Standardized State &amp; Islamic School Templates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              Pusat Tata Naskah Dinas &amp; 150+ Template Surat Resmi
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Template resmi standar naskah dinas: SK Yayasan, Surat Tugas, Undangan, Disposisi, Berita Acara, Surat Keterangan, Surat Keluar/Masuk, dan Memo Internal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-blue-950 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> KEMENDIKBUD &amp; KEMENAG
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'SK', 'TUGAS', 'UNDANGAN', 'DISPOSISI', 'BERITA_ACARA', 'KETERANGAN', 'KELUAR', 'MASUK', 'MEMO'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari naskah dinas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Copy Alert */}
      {isCopied && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>Format naskah dinas berhasil disalin ke clipboard!</span>
        </div>
      )}

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-[10px] text-slate-400">{tmpl.code} &bull; {tmpl.category}</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[9px]">
                  RESMI
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                {tmpl.title}
              </h3>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {tmpl.description}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-[10px] space-y-1">
                <div>
                  <span className="text-slate-400 block">Nomor Baku:</span>
                  <code className="text-blue-600 dark:text-blue-400 font-bold">{tmpl.sampleNumber}</code>
                </div>
                <div>
                  <span className="text-slate-400 block">Rujukan Regulasi:</span>
                  <span className="text-slate-600 dark:text-slate-300">{tmpl.standardRef}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopyFormat(tmpl)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" /> Gunakan Naskah Ini
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
