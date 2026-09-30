import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Square, 
  Layout, 
  Sliders, 
  Download, 
  Layers, 
  Check, 
  Type, 
  Palette, 
  Share2, 
  Eye, 
  Zap, 
  HeartHandshake, 
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { 
  StoryStudioEngine, 
  StoryProject, 
  StoryAspectRatio, 
  StoryMode 
} from '../../core/creator/storyStudioEngine';
import { AsyCentralIntelligenceCore } from '../../core/creator/asyCentralIntelligenceCore';
import { CreatorDownloadCenter } from '../../core/creator/creatorDownloadCenter';

interface StoryStudioExpressProps {
  initialPhotoUrl?: string;
  onNavigateToDownloadCenter?: () => void;
}

export const StoryStudioExpress: React.FC<StoryStudioExpressProps> = ({
  initialPhotoUrl,
  onNavigateToDownloadCenter
}) => {
  const storyEngine = useMemo(() => StoryStudioEngine.getInstance(), []);
  const centralIntel = useMemo(() => AsyCentralIntelligenceCore.getInstance(), []);
  const downloadCenter = useMemo(() => CreatorDownloadCenter.getInstance(), []);

  const [project, setProject] = useState<StoryProject>(() => 
    storyEngine.createDefaultProject(initialPhotoUrl)
  );

  const [activeTab, setActiveTab] = useState<'TEXT' | 'FRAMES' | 'EXPORT'>('TEXT');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastExportedJobId, setLastExportedJobId] = useState<string | null>(null);

  const selectedFrame = useMemo(() => {
    return StoryStudioEngine.FRAME_STYLES.find(f => f.id === project.frameStyleId) || StoryStudioEngine.FRAME_STYLES[0];
  }, [project.frameStyleId]);

  const resolutionInfo = useMemo(() => {
    return storyEngine.getResolutionDimensions(project.aspectRatio, project.resolutionPreset);
  }, [storyEngine, project.aspectRatio, project.resolutionPreset]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // smooth render simulation
      const job = downloadCenter.createExportJob(
        project.title,
        'STORY_STUDIO',
        project.resolutionPreset === 'ULTRA_4K_READY' ? 'ULTRA_4K' : project.resolutionPreset === 'FULL_HD_2K' ? 'FULL_HD_2K' : 'HD_1080',
        'WEBP',
        resolutionInfo.width,
        resolutionInfo.height,
        project.photoUrl
      );

      setLastExportedJobId(job.id);
      centralIntel.recordEvent(
        'Story Studio',
        'SUCCESS',
        `Story "${project.title}" (${project.aspectRatio}) berhasil di-render dalam resolusi ${resolutionInfo.label}.`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6" id="story-studio-express">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Story Studio Express
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R815 &bull; RC99
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Editor Kreatif Cepat & Mobile-First
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Rancang Story Instagram 9:16, Reels, Banner Website 16:9, dan Feed 1:1 dalam hitungan detik dengan sentuhan bingkai Islami dan stempel Asy Chibi.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1.5 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setProject(p => ({ ...p, mode: 'EXPRESS' }))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                project.mode === 'EXPRESS'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Mode Express (1-Klik)
            </button>
            <button
              onClick={() => setProject(p => ({ ...p, mode: 'CREATIVE' }))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                project.mode === 'CREATIVE'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Mode Creative
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Realtime Interactive Canvas View */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-4">
          {/* Aspect Ratio Selector Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            {[
              { id: '9:16', label: 'Story 9:16', icon: Smartphone },
              { id: '16:9', label: 'Banner 16:9', icon: Monitor },
              { id: '1:1', label: 'Feed 1:1', icon: Square },
              { id: '4:3', label: 'Klasik 4:3', icon: Layout }
            ].map(r => {
              const Icon = r.icon;
              const active = project.aspectRatio === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setProject(p => ({ ...p, aspectRatio: r.id as StoryAspectRatio }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Interactive Live Canvas Frame */}
          <div className="w-full flex justify-center py-2">
            <div
              className={`relative overflow-hidden rounded-3xl border-2 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
                selectedFrame.borderClass
              } ${
                project.aspectRatio === '9:16'
                  ? 'w-[280px] sm:w-[320px] aspect-9/16'
                  : project.aspectRatio === '16:9'
                  ? 'w-full max-w-[500px] aspect-video'
                  : project.aspectRatio === '1:1'
                  ? 'w-[320px] sm:w-[360px] aspect-square'
                  : 'w-[340px] sm:w-[400px] aspect-4/3'
              }`}
            >
              {/* Background Photo */}
              <img
                src={project.photoUrl}
                alt="Story Canvas Background"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Dynamic Gradient Frame Overlay */}
              <div className={`absolute inset-0 bg-linear-to-b ${selectedFrame.gradientClass}`} />

              {/* Top Header Strip inside Canvas */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                {project.showSchoolLogo && (
                  <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-black text-slate-950">
                      T
                    </div>
                    <span className="text-[10px] font-bold text-white tracking-wide">
                      TK ASY SYIFA
                    </span>
                  </div>
                )}

                {project.badgeText && (
                  <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider ${selectedFrame.badgeBg}`}>
                    {project.badgeText}
                  </span>
                )}
              </div>

              {/* Bottom Captions & Asy Mascot Stamp inside Canvas */}
              <div className="relative z-10 p-5 space-y-2 text-white">
                <span className="text-[10px] font-semibold text-emerald-300/90 tracking-wide block">
                  {project.dateText}
                </span>

                <h2 className="text-lg sm:text-xl font-black leading-tight drop-shadow-md">
                  {project.title}
                </h2>

                <p className="text-xs text-slate-200/90 leading-snug drop-shadow-xs">
                  {project.subtitle}
                </p>

                {/* Asy Chibi Watermark / Badge */}
                {project.showMascotStamp && (
                  <div className="pt-2 flex items-center justify-between border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-400 border border-white flex items-center justify-center text-[10px] font-black text-slate-950 shadow-md">
                        💚
                      </div>
                      <span className="text-[10px] font-bold tracking-wider text-emerald-200">
                        Official Story by Asy
                      </span>
                    </div>
                    <span className="text-[9px] text-white/70">#GenerasiQurani</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Dimensi Output: <strong className="text-emerald-400">{resolutionInfo.label}</strong>
          </span>
        </div>

        {/* Right: Studio Controls Panel */}
        <div className="lg:col-span-6 space-y-4">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            {[
              { id: 'TEXT', label: 'Teks & Informasi', icon: Type },
              { id: 'FRAMES', label: 'Tema & Bingkai', icon: Palette },
              { id: 'EXPORT', label: 'Resolusi & Ekspor', icon: Download }
            ].map(sub => {
              const Icon = sub.icon;
              const active = activeTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {sub.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Text & Content */}
          {activeTab === 'TEXT' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4 shadow-xl">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Utama Story</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  placeholder="Misal: Pentas Seni Santri Ceria 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Sub-judul / Pesan Inspiratif</label>
                <textarea
                  rows={2}
                  value={project.subtitle}
                  onChange={(e) => setProject({ ...project, subtitle: e.target.value })}
                  placeholder="Ceritakan pesan singkat di story..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Teks Badge / Tag</label>
                  <input
                    type="text"
                    value={project.badgeText}
                    onChange={(e) => setProject({ ...project, badgeText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tanggal Kegiatan</label>
                  <input
                    type="text"
                    value={project.dateText}
                    onChange={(e) => setProject({ ...project, dateText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL Foto Latar</label>
                <input
                  type="text"
                  value={project.photoUrl}
                  onChange={(e) => setProject({ ...project, photoUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-xs font-bold text-white">Stempel Asy Chibi</span>
                  <input
                    type="checkbox"
                    checked={project.showMascotStamp}
                    onChange={(e) => setProject({ ...project, showMascotStamp: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-xs font-bold text-white">Logo Sekolah</span>
                  <input
                    type="checkbox"
                    checked={project.showSchoolLogo}
                    onChange={(e) => setProject({ ...project, showSchoolLogo: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Tab 2: Frames & Themes */}
          {activeTab === 'FRAMES' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white">Pilih Tema & Bingkai Original TADE</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {StoryStudioEngine.FRAME_STYLES.map(style => {
                  const isSelected = project.frameStyleId === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => setProject({ ...project, frameStyleId: style.id })}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500/60 shadow-md'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{style.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>

                      <div className={`h-8 rounded-xl bg-linear-to-r ${style.gradientClass} border ${style.borderClass} flex items-center px-3`}>
                        <span className="text-[10px] font-bold text-white">Preview Palet</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Resolution & Export */}
          {activeTab === 'EXPORT' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white">Pilihan Resolusi Ekspor Siap Masa Depan</h3>

              <div className="space-y-2.5">
                {[
                  { id: 'HD_1080', label: 'Standar HD 1080p', desc: 'Optimal untuk Instagram & WhatsApp Status', tag: 'Direkomendasikan' },
                  { id: 'FULL_HD_2K', label: 'High-Res 2K Master', desc: 'Detail sangat jernih untuk banner website & TV', tag: 'Super Jernih' },
                  { id: 'ULTRA_4K_READY', label: 'Ultra 4K Archival Ready', desc: 'Format masa depan untuk arsip akreditasi sekolah', tag: 'Future-Ready' },
                  { id: 'PREVIEW', label: 'Preview Ringan SD', desc: 'Hemat kuota, instan dibagikan', tag: 'Fast' }
                ].map(res => {
                  const isSelected = project.resolutionPreset === res.id;
                  return (
                    <div
                      key={res.id}
                      onClick={() => setProject({ ...project, resolutionPreset: res.id as any })}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{res.label}</span>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                            {res.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{res.desc}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full py-3.5 rounded-2xl bg-linear-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
                  {isExporting ? 'Merender Desain Story...' : 'Render & Simpan ke Download Center'}
                </button>

                {lastExportedJobId && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Story siap diunduh!
                    </span>
                    {onNavigateToDownloadCenter && (
                      <button
                        onClick={onNavigateToDownloadCenter}
                        className="font-bold underline hover:text-white cursor-pointer"
                      >
                        Buka Download Center &rarr;
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
