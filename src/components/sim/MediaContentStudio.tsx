import React, { useState } from 'react';
import {
  Palette,
  Image,
  Download,
  Share2,
  Printer,
  Sparkles,
  QrCode,
  Layers,
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  Copy
} from 'lucide-react';

interface MediaTemplate {
  id: string;
  title: string;
  category: 'POSTER' | 'BANNER' | 'CERTIFICATE' | 'SOCIAL_MEDIA' | 'EVENT_GRAPHICS';
  dimensions: string;
  theme: string;
  previewColor: string;
  qrAttached: boolean;
}

const TEMPLATES: MediaTemplate[] = [
  { id: 't1', title: 'Poster Resmi PPDB 2026/2027 (Sentra Islami)', category: 'POSTER', dimensions: 'A3 (29.7 x 42 cm)', theme: 'Emerald Gold Islami', previewColor: 'from-emerald-800 to-teal-950', qrAttached: true },
  { id: 't2', title: 'Spanduk Banner Manasik Haji Cilik 2026', category: 'BANNER', dimensions: '3 x 1 Meter', theme: 'Desert Sand & White Kaaba', previewColor: 'from-amber-700 to-stone-900', qrAttached: true },
  { id: 't3', title: 'Sertifikat Tahfidz Juz 30 & Doa Harian', category: 'CERTIFICATE', dimensions: 'A4 Landscape', theme: 'Royal Islamic Geometric Green', previewColor: 'from-teal-900 to-emerald-950', qrAttached: true },
  { id: 't4', title: 'Instagram Feed: Kegiatan Sentra Balok & Alam', category: 'SOCIAL_MEDIA', dimensions: '1080 x 1080 px (1:1)', theme: 'Cheerful Playful PAUD', previewColor: 'from-blue-600 to-indigo-900', qrAttached: false },
  { id: 't5', title: 'Brosur Lipat 3 Profil Sekolah & Keunggulan', category: 'EVENT_GRAPHICS', dimensions: 'A4 Tri-Fold', theme: 'Clean Modern Education', previewColor: 'from-purple-900 to-slate-950', qrAttached: true }
];

export const MediaContentStudio: React.FC = () => {
  const [templates, setTemplates] = useState<MediaTemplate[]>(TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<MediaTemplate>(TEMPLATES[0]);
  const [customTitle, setCustomTitle] = useState(selectedTemplate.title);
  const [includeQR, setIncludeQR] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const handleSelect = (tmpl: MediaTemplate) => {
    setSelectedTemplate(tmpl);
    setCustomTitle(tmpl.title);
    setIncludeQR(tmpl.qrAttached);
    setGeneratedSuccess(false);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-purple-950 border border-pink-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
              <Palette className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-400/30">
                  R94 MEDIA & CONTENT STUDIO
                </span>
                <span className="text-xs text-slate-400">Integrated with Universal QR Studio</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Media & Content Studio (R94)
              </h1>
              <p className="text-sm text-pink-100/80 mt-0.5">
                Pusat pembuatan otomatis poster resmi, spanduk, sertifikat tahfidz, materi sosmed, dan brosur ber-QR code resmi TK Islam Asy-Syifatan.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-pink-500/30 rounded-xl p-3 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>AI Graphic Auto-Composer Ready</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Template Catalog */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Katalog Template Resmi</h3>
            <p className="text-xs text-slate-500 mb-3">Pilih format grafis untuk disesuaikan dan dicetak</p>

            <div className="space-y-2">
              {templates.map(tmpl => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelect(tmpl)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedTemplate.id === tmpl.id
                      ? 'bg-pink-50/60 dark:bg-pink-950/40 border-pink-400 dark:border-pink-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{tmpl.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                      {tmpl.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{tmpl.dimensions}</span>
                    <span>•</span>
                    <span>{tmpl.theme}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Canvas Preview & Customizer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Canvas Live Preview & Pengaturan</h3>
                <p className="text-xs text-slate-500">{selectedTemplate.dimensions} • {selectedTemplate.theme}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeQR}
                    onChange={(e) => setIncludeQR(e.target.checked)}
                    className="rounded text-pink-600 focus:ring-pink-500"
                  />
                  <span>Sisipkan Universal QR Resmi</span>
                </label>
              </div>
            </div>

            {/* Simulated Graphical Canvas */}
            <div className={`w-full h-72 rounded-2xl bg-gradient-to-br ${selectedTemplate.previewColor} p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden border border-white/10`}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-widest text-pink-300 font-bold">
                    TK ISLAM ASY-SYIFATAN
                  </div>
                  <div className="text-xl md:text-2xl font-black max-w-md leading-tight">
                    {customTitle}
                  </div>
                  <div className="text-xs text-white/80">
                    Tahun Ajaran 2026/2027 • Sentra Kurikulum Merdeka Islami
                  </div>
                </div>

                {includeQR && (
                  <div className="bg-white p-2 rounded-xl text-slate-950 flex flex-col items-center shadow-md">
                    <QrCode className="w-14 h-14" />
                    <span className="text-[8px] font-bold mt-0.5">SCAN ME</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end text-xs text-white/80 pt-4 border-t border-white/20">
                <div>
                  <div className="font-semibold">Pendaftaran & Info Resmi:</div>
                  <div className="text-[11px] opacity-75">https://asy-syifatan.sch.id</div>
                </div>
                <div className="text-right text-[10px] opacity-75">
                  TADE Design Engine Certified • Stempel Yayasan
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Materi Grafis
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? 'Menyusun Grafis...' : 'Render Resolusi Tinggi (PDF/PNG)'}
                </button>
              </div>
            </div>

            {generatedSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Berkas Siap Dicetak & Diteruskan ke Print Center!
                </span>
                <button
                  onClick={() => alert('Meneruskan file ke Guardian Print Center')}
                  className="px-3 py-1 bg-emerald-600 text-white rounded font-bold text-[11px]"
                >
                  Buka di Print Center
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
