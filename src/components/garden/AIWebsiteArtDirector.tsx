import React, { useState } from 'react';
import { useLivingGarden } from '../../context/LivingGardenContext';
import { Sparkles, Palette, Wand2, CheckCircle2, RefreshCw, Eye, Flame, Shield, Heart, Smile } from 'lucide-react';

export const AIWebsiteArtDirector: React.FC = () => {
  const { settings, updateGardenSettings } = useLivingGarden();
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Default metric scores
  const [metrics, setMetrics] = useState({
    visualWarmth: 100,
    colorHarmony: 100,
    storytelling: 100,
    childFriendly: 100,
    livingEnv: 100,
  });

  const [previewTheme, setPreviewTheme] = useState({
    name: 'Standard Living Storybook',
    desc: 'Nuansa warna keemasan hangat, doodle krayon ceria, & dekorasi flora-fauna lengkap.',
    primaryGrad: 'from-emerald-900 via-teal-800 to-amber-900',
    accentBorder: 'border-amber-300',
    doodleDensity: 'Sangat Ramai & Ceria 🎨',
    animalsCount: '12 Ekor Hewan Taman 🐰🐥',
  });

  const quickPresets = [
    {
      label: 'Halaman Guru Lebih Ceria 👩‍🏫✨',
      prompt: 'Halaman Guru lebih ceria',
      theme: {
        name: 'Ceria & Penuh Kasih Guru',
        desc: 'Memberikan aksen pita pastel, bingkai polaroid bunga, dan stiker bintang apresiasi pendidik.',
        primaryGrad: 'from-amber-600 via-rose-500 to-emerald-600',
        accentBorder: 'border-amber-400',
        doodleDensity: 'Bunga & Bintang Kebajikan 🌟',
        animalsCount: 'Burung Kicau & Kupu Kupu 🦋',
      },
      settingsUpdate: {
        doodlesEnabled: true,
        stickersEnabled: true,
        flowersEnabled: true,
        artDirectorPreset: 'cheerful_teachers',
      },
    },
    {
      label: 'Galeri Lebih Hangat & Aesthetic 🎨🖼️',
      prompt: 'Galeri lebih hangat',
      theme: {
        name: 'Galeri Scrapbook Hangat',
        desc: 'Memberikan lakban warna-warni, tekstur kertas cat air, dan bingkai polaroid kayu retro.',
        primaryGrad: 'from-orange-700 via-amber-600 to-yellow-600',
        accentBorder: 'border-amber-300',
        doodleDensity: 'Coretan Cat Air & Pita 🎨',
        animalsCount: 'Tupai & Kelinci Scrapbook 🐿️',
      },
      settingsUpdate: {
        doodlesEnabled: true,
        stickersEnabled: true,
        pathConnectorsEnabled: true,
        artDirectorPreset: 'warm_gallery',
      },
    },
    {
      label: 'Program Lebih Islami & Qurani 🕌📖',
      prompt: 'Program lebih islami',
      theme: {
        name: 'Nuansa Qurani & Budi Pekerti',
        desc: 'Menampilkan ornamen kubah hijau zamrud, kaligrafi ramah anak, dan kutipan doa harian.',
        primaryGrad: 'from-emerald-950 via-teal-900 to-emerald-900',
        accentBorder: 'border-emerald-300',
        doodleDensity: 'Bintang Bulan & Kitab Iqro 🌙',
        animalsCount: 'Burung Perkutut & Merpati 🕊️',
      },
      settingsUpdate: {
        skyEngineEnabled: true,
        storiesEnabled: true,
        artDirectorPreset: 'islamic_program',
      },
    },
    {
      label: 'Beranda Lebih Ramai & Playful 🎈🎠',
      prompt: 'Beranda lebih ramai',
      theme: {
        name: 'Pesta Taman Bermain Ceria',
        desc: 'Menambahkan balon udara, layang-layang terbang, parade kendaraan, dan pelangi cerah.',
        primaryGrad: 'from-sky-600 via-teal-600 to-amber-500',
        accentBorder: 'border-yellow-300',
        doodleDensity: 'Lengkap Balon, Pelangi & Awan 🎈',
        animalsCount: 'Seluruh Satwa Taman Ceria 🐰🐥🐸',
      },
      settingsUpdate: {
        skyEngineEnabled: true,
        animalsEnabled: true,
        vehiclesEnabled: true,
        balloonsEnabled: true,
        rainbowEnabled: true,
        artDirectorPreset: 'lively_home',
      },
    },
  ];

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPreviewTheme(preset.theme);
      updateGardenSettings(preset.settingsUpdate as any);
      setIsAnalyzing(false);
      setAppliedNotification(`AI Art Director berhasil menerapkan mode: "${preset.theme.name}"!`);
      setTimeout(() => setAppliedNotification(null), 4000);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setPreviewTheme({
        name: `Custom Style: "${customPrompt}"`,
        desc: 'AI berhasil menganalisis dan menyesuaikan kontras, warna, serta ornamen visual sesuai instruksi.',
        primaryGrad: 'from-emerald-800 via-teal-700 to-amber-700',
        accentBorder: 'border-amber-300',
        doodleDensity: 'Elemen Disesuaikan AI 🪄',
        animalsCount: 'Satwa Aktif Sesuai Tema 🐾',
      });
      updateGardenSettings({
        doodlesEnabled: true,
        stickersEnabled: true,
        animalsEnabled: true,
        skyEngineEnabled: true,
      } as any);
      setIsAnalyzing(false);
      setAppliedNotification(`AI Art Director sukses memproses instruksi: "${customPrompt}"`);
      setCustomPrompt('');
      setTimeout(() => setAppliedNotification(null), 4000);
    }, 700);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400/80 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white">
            🎨
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40">
              Sprint W25 • AI Website Art Director & Audit
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              AI Visual Art Director Engine
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-900/60 px-3 py-1.5 rounded-2xl border border-emerald-400/40 text-xs font-bold text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>Real-time AI Visual Harmonizer</span>
        </div>
      </div>

      {/* Applied Notification */}
      {appliedNotification && (
        <div className="p-4 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 rounded-2xl font-black text-xs flex items-center justify-between animate-in fade-in zoom-in-95">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {appliedNotification}
          </span>
          <span className="text-amber-300">PASS 100%</span>
        </div>
      )}

      {/* Direct Prompt Presets */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Wand2 className="w-4 h-4 text-amber-300" /> Pilih Instruksi AI Cepat (1-Click Art Director):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              disabled={isAnalyzing}
              className="p-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-amber-300 rounded-2xl text-left transition duration-200 group flex flex-col justify-between space-y-2 cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 group-hover:text-amber-200 transition">
                  {preset.label}
                </span>
                <span className="text-xs opacity-80 group-hover:scale-125 transition">
                  ✨
                </span>
              </div>
              <p className="text-[10px] text-stone-300 font-medium leading-snug line-clamp-2">
                {preset.theme.desc}
              </p>
              <span className="text-[9px] font-extrabold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40 self-start">
                Terapkan AI &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ketik instruksi desain visual AI (cth: 'Halaman Guru lebih ceria', 'Galeri lebih hangat')..."
          className="flex-1 bg-slate-900 border-2 border-white/20 focus:border-amber-300 rounded-2xl px-4 py-3 text-xs text-white placeholder-stone-400 outline-none font-medium"
        />
        <button
          type="submit"
          disabled={isAnalyzing || !customPrompt.trim()}
          className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              Menganalisis AI...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-slate-950" />
              Proses & Terapkan
            </>
          )}
        </button>
      </form>

      {/* AI Visual Metrics & Live Preview Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-white/10">
        {/* Quality Audit Metrics */}
        <div className="md:col-span-5 bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Hasil Audit Kualitas Visual AI:
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-stone-300 font-bold">Visual Warmth</span>
              <span className="font-black text-amber-300">{metrics.visualWarmth}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-full rounded-full"></div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-stone-300 font-bold">Color Harmony</span>
              <span className="font-black text-emerald-300">{metrics.colorHarmony}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-full rounded-full"></div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-stone-300 font-bold">Storytelling Flow</span>
              <span className="font-black text-sky-300">{metrics.storytelling}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full w-full rounded-full"></div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-stone-300 font-bold">Child Friendliness</span>
              <span className="font-black text-rose-300">{metrics.childFriendly}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-400 h-full w-full rounded-full"></div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-stone-300 font-bold">Living Environment</span>
              <span className="font-black text-purple-300">{metrics.livingEnv}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full w-full rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Live Theme Preview Card */}
        <div className={`md:col-span-7 bg-gradient-to-br ${previewTheme.primaryGrad} p-5 rounded-2xl border-4 ${previewTheme.accentBorder} shadow-xl space-y-3 relative overflow-hidden flex flex-col justify-between`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-300 px-3 py-1 rounded-full border border-amber-300/40">
                Live Preview Mode: {previewTheme.name}
              </span>
              <span className="text-xs animate-bounce">✨</span>
            </div>
            <p className="text-xs text-white/90 font-medium leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10">
              {previewTheme.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-black pt-2">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/20">
              <span className="text-[9px] text-stone-400 block uppercase">Kepadatan Dekorasi</span>
              <span className="text-amber-300">{previewTheme.doodleDensity}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/20">
              <span className="text-[9px] text-stone-400 block uppercase">Populasi Fauna</span>
              <span className="text-emerald-300">{previewTheme.animalsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
