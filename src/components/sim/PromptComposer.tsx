import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Wand2,
  Image as ImageIcon,
  Copy,
  Check,
  Send,
  Layers,
  Palette,
  Layout,
  FileCheck
} from 'lucide-react';

export type CreativeFormat = 'BANNER_3D' | 'POSTER' | 'SERTIFIKAT' | 'BROSUR' | 'FEED_IG' | 'STORY_IG';

interface PromptComposerProps {
  onGenerate: (format: CreativeFormat, prompt: string, title: string) => void;
  isGenerating?: boolean;
}

export const PromptComposer: React.FC<PromptComposerProps> = ({ onGenerate, isGenerating }) => {
  const [format, setFormat] = useState<CreativeFormat>('BANNER_3D');
  const [theme, setTheme] = useState('Penerimaan Santri Baru (PPDB) 2026/2027 Islami Modern');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'AUTO_PARTNER' | 'CHATGPT' | 'GEMINI' | 'CLAUDE'>('AUTO_PARTNER');

  const FORMAT_TEMPLATES: Record<CreativeFormat, { name: string; icon: any; defaultPrompt: string }> = {
    BANNER_3D: {
      name: 'Banner 3D Panggung',
      icon: Layout,
      defaultPrompt: 'Spanduk panggung 3D megah bernuansa islami modern, latar belakang hijau zamrud dan emas, kaligrafi elegan, ilustrasi gedung sekolah ramah anak dan masjid berkubah indah.'
    },
    POSTER: {
      name: 'Poster Kegiatan',
      icon: ImageIcon,
      defaultPrompt: 'Poster vertikal ceria untuk Gebyar Muharram dan Lomba Tahfidz Cilik, warna pastel cerah, tipografi tebal ramah anak.'
    },
    SERTIFIKAT: {
      name: 'Sertifikat Kelulusan',
      icon: FileCheck,
      defaultPrompt: 'Sertifikat kelulusan formal dan mewah dengan border ornamen geometris islami emas, logo TK Asy-Syifa di tengah atas, dan ruang tanda tangan Kepala Sekolah.'
    },
    BROSUR: {
      name: 'Brosur PPDB Lipat',
      icon: Layout,
      defaultPrompt: 'Brosur informasi pendaftaran santri baru lengkap dengan tabel biaya, program unggulan tahfidz, robotik cilik, dan fasilitas sekolah.'
    },
    FEED_IG: {
      name: 'Instagram Feed (1:1)',
      icon: Palette,
      defaultPrompt: 'Desain feed Instagram persegi bertema Tips Mendidik Anak Usia Dini dengan sentuhan visual minimalis, foto anak tersenyum, dan quote inspiratif.'
    },
    STORY_IG: {
      name: 'Instagram Story (9:16)',
      icon: Palette,
      defaultPrompt: 'Story Instagram vertikal dengan countdown hari pembukaan pendaftaran santri baru, stiker swipe up, dan animasi dinamis.'
    }
  };

  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();
    const activePrompt = customPrompt.trim() || FORMAT_TEMPLATES[format].defaultPrompt;
    onGenerate(format, activePrompt, theme);
  };

  return (
    <form onSubmit={handleGenerateClick} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Asy Creative Prompt Composer (R145)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tulis ide atau gunakan template pintar untuk menghasilkan materi visual sekolah dalam hitungan detik.
          </p>
        </div>

        {/* Multi-Provider Selection (Provider Agnostic R149) */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">AI Partner:</span>
          <select
            value={selectedProvider}
            onChange={(e: any) => setSelectedProvider(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
          >
            <option value="AUTO_PARTNER">AI Asy Hybrid (Auto)</option>
            <option value="CHATGPT">ChatGPT Creative Partner</option>
            <option value="GEMINI">Google Gemini Pro Vision</option>
            <option value="CLAUDE">Anthropic Claude Sonnet</option>
          </select>
        </div>
      </div>

      {/* Format Selector Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Pilih Format Materi Visual:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(FORMAT_TEMPLATES) as CreativeFormat[]).map((fmtKey) => {
            const fmt = FORMAT_TEMPLATES[fmtKey];
            const isSelected = format === fmtKey;
            return (
              <button
                type="button"
                key={fmtKey}
                onClick={() => {
                  setFormat(fmtKey);
                  setCustomPrompt(fmt.defaultPrompt);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm ring-1 ring-purple-500/30'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <fmt.icon className="w-4 h-4" />
                <span className="text-[11px] text-center leading-tight">{fmt.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Title */}
      <div className="space-y-1.5 text-xs">
        <label className="font-bold text-slate-700 dark:text-slate-300">
          Judul / Tema Acara Sekolah:
        </label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Contoh: Gebyar Muharram 1448 H / Wisuda Santri"
          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Prompt Textarea */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Deskripsi Prompt Kreatif:
          </label>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
            Didukung AI Asy Multi-Provider
          </span>
        </div>
        <textarea
          rows={3}
          value={customPrompt || FORMAT_TEMPLATES[format].defaultPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Tulis arahan gaya visual, warna, teks spanduk..."
          className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 leading-relaxed"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-400">
          Generator ringan • Diproses instan on-demand
        </span>
        <button
          type="submit"
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
        >
          <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Menghasilkan Desain...' : 'Hasilkan Desain Sekarang'}</span>
        </button>
      </div>
    </form>
  );
};
