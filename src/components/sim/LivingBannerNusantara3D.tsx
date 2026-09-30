import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Download,
  Printer,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  Layers,
  Wand2,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  QrCode
} from 'lucide-react';

interface BannerTemplate {
  id: string;
  title: string;
  category: 'HAFLAH' | 'PPDB' | 'MANASIK' | 'HARI_BESAR' | 'PENTAS_SENI';
  dimensions: string;
  themeStyle: string;
  headline: string;
  subheadline: string;
  themeColors: string[];
  features: string[];
  bannerUrlPreview?: string;
}

const INITIAL_TEMPLATES: BannerTemplate[] = [
  {
    id: 'ban_haflah_01',
    title: 'Haflah & Wisuda Tahfidz Angkatan VIII',
    category: 'HAFLAH',
    dimensions: 'Spanduk Panggung 4x2 Meter',
    themeStyle: 'Nusantara Islamic Gold & Emerald 3D',
    headline: 'HAFLAH AKHIRUSSANAH & WISUDA TAHFIDZ VIII',
    subheadline: 'Mencetak Generasi Qur’ani, Berakhlak Mulia, Cerdas, dan Berbudaya Nusantara',
    themeColors: ['#0f766e', '#134e4a', '#d97706', '#fef3c7'],
    features: ['Dek Asy 3D Toga Wisuda', 'Kubah Emas Arabesque', 'Kupu-kupu & Balon Emas', 'QR Verifikasi']
  },
  {
    id: 'ban_ppdb_01',
    title: 'PPDB 2026/2027 — Gelombang Utama Ceria',
    category: 'PPDB',
    dimensions: 'Spanduk Gerbang Depan 3x1 Meter',
    themeStyle: 'CGI Ceria Sentra Nusantara',
    headline: 'PENERIMAAN PESERTA DIDIK BARU (PPDB) 2026/2027',
    subheadline: 'Kurikulum Merdeka Plus Pembelajaran Sentra & Tahfidz Juz 30 Bersanad',
    themeColors: ['#0284c7', '#0369a1', '#f59e0b', '#ec4899'],
    features: ['Dek Asy & Dek Asyah Ceria', 'Pelangi 3D & Balon Udara', 'Daftar Online QR', 'Diskon Gelombang 1']
  },
  {
    id: 'ban_manasik_01',
    title: 'Peragaan Manasik Haji Cilik Asy-Syifatan',
    category: 'MANASIK',
    dimensions: 'Backdrop Arena 5x2.5 Meter',
    themeStyle: 'Ka’bah Al-Mukarramah Sky Blue 3D',
    headline: 'PERAGAAN MANASIK HAJI CILIK 1447 H',
    subheadline: 'Labbaikallahumma Labbaik — Menanamkan Kerinduan Baitullah Sejak Usia Dini',
    themeColors: ['#1e293b', '#0f172a', '#eab308', '#38bdf8'],
    features: ['Miniatur Ka’bah 3D', 'Dek Asy Berpakaian Ihram', 'Awan & Merpati Putih', 'Jadwal Regu']
  },
  {
    id: 'ban_ramadhan_01',
    title: 'Semarak Ramadhan & Pawai Tarhib',
    category: 'HARI_BESAR',
    dimensions: 'Spanduk Jalan 4x1 Meter',
    themeStyle: 'Twilight Violet & Gold Lantern 3D',
    headline: 'SEMARAK RAMADHAN 1447 H — BULAN PENUH BERKAH',
    subheadline: 'Mari Sambut Bulan Suci dengan Gembira, Tingkatkan Infak dan Hafalan Al-Qur’an',
    themeColors: ['#4c1d95', '#5b21b6', '#fbbf24', '#34d399'],
    features: ['Lentera Fanous Emas 3D', 'Bulan Sabit & Bintang', 'Dek Asy & Dek Asyah Koko', 'QR Donasi']
  },
  {
    id: 'ban_pentas_01',
    title: 'Pentas Seni & Gelar Karya Sentra Kreatif',
    category: 'PENTAS_SENI',
    dimensions: 'Roll Banner 60x160 cm',
    themeStyle: 'Rainbow Pastel Studio 3D',
    headline: 'GELAR KARYA & PENTAS SENI SENTRA 2026',
    subheadline: 'Menumbuhkan Kreativitas, Keberanian, dan Daya Cipta Ananda Usia Dini',
    themeColors: ['#f43f5e', '#8b5cf6', '#10b981', '#f59e0b'],
    features: ['Balon Warna-Warni 3D', 'Peralatan Balok & Musik', 'Kupu-kupu Terbang', 'Jadwal Acara']
  }
];

export const LivingBannerNusantara3D: React.FC = () => {
  const [templates, setTemplates] = useState<BannerTemplate[]>(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplate>(INITIAL_TEMPLATES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wizardPrompt, setWizardPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Editable fields in preview
  const [editHeadline, setEditHeadline] = useState<string>(selectedTemplate.headline);
  const [editSubheadline, setEditSubheadline] = useState<string>(selectedTemplate.subheadline);
  const [editSchoolName, setEditSchoolName] = useState<string>('TK ISLAM ASY-SYIFATAN');
  const [editDateLocation, setEditDateLocation] = useState<string>('Sabtu, 20 Juni 2026 • Gedung Pertemuan Asy-Syifatan');

  const handleSelectTemplate = (tpl: BannerTemplate) => {
    setSelectedTemplate(tpl);
    setEditHeadline(tpl.headline);
    setEditSubheadline(tpl.subheadline);
  };

  const handleRunWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newBanner: BannerTemplate = {
        id: `ban_custom_${Date.now()}`,
        title: `Banner AI: ${wizardPrompt.slice(0, 35)}...`,
        category: 'HAFLAH',
        dimensions: 'Spanduk 4x2 Meter HD',
        themeStyle: 'Nusantara 3D CGI Ultra HD',
        headline: wizardPrompt.toUpperCase(),
        subheadline: 'TK ASY SYIFA — Membentuk Generasi Qur’ani dan Berkarakter Unggul',
        themeColors: ['#0f766e', '#0d9488', '#f59e0b', '#ffffff'],
        features: ['Dek Asy 3D Penuh Semangat', 'Pelangi & Balon Emas', 'Kubah Emas Nusantara', 'Universal QR']
      };

      setTemplates(prev => [newBanner, ...prev]);
      setSelectedTemplate(newBanner);
      setEditHeadline(newBanner.headline);
      setEditSubheadline(newBanner.subheadline);
      setIsGenerating(false);
      setWizardPrompt('');
    }, 1500);
  };

  const handleExportPrint = () => {
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const filteredTemplates = templates.filter(t => {
    const matchCategory = filterCategory === 'ALL' || t.category === filterCategory;
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.headline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Palette className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  LIVING BANNER NUSANTARA 3D
                </span>
                <span className="text-xs text-slate-400">1000+ Banner Studio Engine</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Studio Banner & Spanduk Nusantara 3D (CGI Ultra-HD)
              </h1>
              <p className="text-sm text-emerald-100/80 mt-0.5">
                Desain spanduk panggung, backdrop haflah, poster PPDB, dan banner perayaan 100% Bahasa Indonesia dengan maskot Dek Asy 3D, pelangi, balon, dan ornamen Islami.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-center">
            <div className="text-xs text-slate-400">Katalog Banner Siap Pakai</div>
            <div className="text-xl font-black text-amber-400">1.000+ Variasi</div>
          </div>
        </div>
      </div>

      {/* AI Banner Wizard Input Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            AI Banner Wizard — Cukup Ketik Acara, Desain Siap Seketika
          </h3>
        </div>

        <form onSubmit={handleRunWizard} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={wizardPrompt}
            onChange={(e) => setWizardPrompt(e.target.value)}
            placeholder="Contoh: Buat Banner Haflah Akhirussanah Angkatan VIII Tema Generasi Qurani Berbudaya..."
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isGenerating || !wizardPrompt.trim()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Merender Desain 3D...' : 'Generate Banner 3D'}
          </button>
        </form>
      </div>

      {/* Main Grid: Template Catalogue & Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 Cols): Template Catalogue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Katalog Banner Pilihan</h3>
              <span className="text-[10px] text-slate-500 font-mono">{filteredTemplates.length} Tersedia</span>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              {[
                { key: 'ALL', label: 'Semua' },
                { key: 'HAFLAH', label: 'Haflah & Wisuda' },
                { key: 'PPDB', label: 'PPDB Ceria' },
                { key: 'MANASIK', label: 'Manasik Haji' },
                { key: 'HARI_BESAR', label: 'Hari Besar' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setFilterCategory(cat.key)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                    filterCategory === cat.key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredTemplates.map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedTemplate.id === tpl.id
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{tpl.title}</span>
                    {selectedTemplate.id === tpl.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{tpl.dimensions} • {tpl.themeStyle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): High-Impact 3D Visual Stage */}
        <div className="lg:col-span-8 space-y-4">
          {/* Banner Live Canvas Renderer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Pratinjau Spanduk 3D CGI (Live Canvas Preview)
                </span>
                <p className="text-[11px] text-slate-500">{selectedTemplate.dimensions} • Siap Cetak Hi-Res Vector</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPrint}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Printer className="w-3.5 h-3.5" />}
                  {copiedSuccess ? 'Diteruskan ke Print Center!' : 'Kirim ke Print Center (R86)'}
                </button>
              </div>
            </div>

            {/* 3D CGI Stylized Banner Canvas Viewport */}
            <div className="relative rounded-2xl overflow-hidden border-4 border-amber-400/80 shadow-2xl bg-gradient-to-r from-teal-900 via-emerald-800 to-teal-950 p-6 md:p-8 text-white min-h-[260px] flex flex-col justify-between select-none">
              {/* Islamic Arabesque & Cloud Ornaments background */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300 via-emerald-500 to-transparent" />

              {/* Top Banner Header: Logo & School Identity */}
              <div className="relative z-10 flex justify-between items-center border-b border-amber-400/30 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-lg shadow">
                    🕌
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-widest text-amber-300">
                      YAYASAN ASY-SYIFATAN INDONESIA
                    </div>
                    <div className="text-xs md:text-sm font-extrabold text-white">
                      {editSchoolName}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-amber-400/40 px-3 py-1 rounded-lg text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <span>Akreditasi A BAN-PAUD</span>
                </div>
              </div>

              {/* Middle: 3D CGI Elements + Main Typography */}
              <div className="relative z-10 my-4 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left: Dek Asy 3D Mascot Avatar */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-teal-400 to-emerald-300 p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl md:text-4xl">
                      👦
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 mt-1">Dek Asy 3D</span>
                </div>

                {/* Center Headline */}
                <div className="text-center flex-1 space-y-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-amber-300 drop-shadow-md uppercase">
                    {editHeadline}
                  </h2>
                  <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-lg mx-auto leading-relaxed">
                    "{editSubheadline}"
                  </p>
                </div>

                {/* Right: Official Universal QR */}
                <div className="bg-white p-2 rounded-xl text-slate-900 flex flex-col items-center shadow-lg shrink-0">
                  <QrCode className="w-12 h-12 text-teal-800" />
                  <span className="text-[8px] font-mono font-bold text-teal-900 mt-0.5">SCAN INFO RESMI</span>
                </div>
              </div>

              {/* Bottom: Date, Location & 3D Elements (Butterflies & Rainbow) */}
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t border-amber-400/30 text-xs font-semibold text-teal-100">
                <div className="flex items-center gap-2">
                  <span>📍 {editDateLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-amber-300">
                  <span>🦋 Kupu-kupu Ceria</span>
                  <span>•</span>
                  <span>🎈 Balon Harapan</span>
                  <span>•</span>
                  <span>🌈 Pelangi Cita-Cita</span>
                </div>
              </div>
            </div>

            {/* Customizer Dock */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Edit Teks Banner Secara Langsung:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Judul Utama (Headline)</label>
                  <input
                    type="text"
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Subjudul / Tema Acara</label>
                  <input
                    type="text"
                    value={editSubheadline}
                    onChange={(e) => setEditSubheadline(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Nama Sekolah</label>
                  <input
                    type="text"
                    value={editSchoolName}
                    onChange={(e) => setEditSchoolName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Waktu & Tempat Pelaksanaan</label>
                  <input
                    type="text"
                    value={editDateLocation}
                    onChange={(e) => setEditDateLocation(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
