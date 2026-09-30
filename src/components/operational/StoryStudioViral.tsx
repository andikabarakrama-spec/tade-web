import React, { useState } from 'react';
import { 
  Film, 
  Play, 
  Sparkles, 
  Download, 
  Smartphone, 
  Zap, 
  Layers, 
  Check, 
  Clock, 
  Music, 
  Crown, 
  SlidersHorizontal 
} from 'lucide-react';

export const StoryStudioViral: React.FC = () => {
  const [studioMode, setStudioMode] = useState<'EXPRESS' | 'KREATIF'>('EXPRESS');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('senam');
  const [selectedResolution, setSelectedResolution] = useState<'HD_720P' | 'FHD_1080P' | '2K_QHD' | '4K_UHD'>('FHD_1080P');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  const templates = [
    { id: 'senam', title: 'Senam Ceria Pagi', category: 'Olahraga & Motorik', duration: '15 detik', music: 'Nasyid Ceria Tepuk Semangat', icon: '🏃' },
    { id: 'tahfidz', title: 'Muroja\'ah Tahfidz Juz 30', category: 'Keagamaan', duration: '30 detik', music: 'Murattal Merdu Suara Anak', icon: '📖' },
    { id: 'ramadhan', title: 'Pawai Tarhib Ramadhan Berkah', category: 'Spesial Momen', duration: '30 detik', music: 'Marhaban Ya Ramadhan Akustik', icon: '🌙' },
    { id: 'wisuda', title: 'Haflah Akhirussanah & Wisuda', category: 'Pelepasan', duration: '60 detik', music: 'Hymne Guru & Doa Syukur', icon: '🎓' },
    { id: 'hari_guru', title: 'Apresiasi & Kasih Sayang Guru', category: 'Karakter', duration: '20 detik', music: 'Terima Kasih Guruku Lembut', icon: '🌸' },
    { id: 'manasik', title: 'Perjalanan Manasik Haji Cilik', category: 'Ibadah Praktik', duration: '45 detik', music: 'Labbaikallahumma Labbaik', icon: '🕋' },
    { id: 'harian', title: 'Keseruan Belajar Sentra Harian', category: 'Aktivitas Kelas', duration: '15 detik', music: 'Melodi Ceria Anak Sholeh', icon: '🎨' }
  ];

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(10);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const currentTemplateObj = templates.find(t => t.id === selectedTemplate) || templates[0];

  return (
    <div className="space-y-6" id="story-studio-viral">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Story Studio Express & Reels Viral
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R834 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pembuat Video Story Otomatis 9:16 Siap Ekspor
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Ciptakan video reels & status WhatsApp kegiatan sekolah dalam hitungan detik dengan musik nasyid ceria dan resolusi hingga 4K Ready.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setStudioMode('EXPRESS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                studioMode === 'EXPRESS'
                  ? 'bg-violet-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mode Express (1-Klik)
            </button>
            <button
              onClick={() => setStudioMode('KREATIF')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                studioMode === 'KREATIF'
                  ? 'bg-violet-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mode Kreatif
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Story Preview Player & Template Chooser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: 9:16 Vertical Smartphone Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-between w-full pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-violet-400" />
                Layar Format 9:16
              </span>
              <span className="text-[10px] font-mono text-emerald-400">BEAT-SYNC AKTIF</span>
            </div>

            {/* Simulated Phone Frame */}
            <div className="relative w-64 h-96 rounded-3xl overflow-hidden border-4 border-slate-800 bg-slate-950 shadow-2xl flex flex-col justify-between p-4 group">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80"
                alt="Story Canvas"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

              {/* Story Top Progress Bar */}
              <div className="relative z-10 flex gap-1 w-full">
                <div className="h-1 bg-white rounded-full flex-1" />
                <div className="h-1 bg-white/40 rounded-full flex-1" />
                <div className="h-1 bg-white/40 rounded-full flex-1" />
              </div>

              {/* Center Play Indicator */}
              <div className="relative z-10 self-center w-12 h-12 rounded-full bg-violet-500/90 text-slate-950 flex items-center justify-center shadow-lg cursor-pointer group-hover:scale-110 transition">
                <Play className="w-6 h-6 ml-0.5 fill-current" />
              </div>

              {/* Bottom Caption Overlay */}
              <div className="relative z-10 space-y-1">
                <span className="px-2 py-0.5 rounded bg-violet-500 text-slate-950 text-[10px] font-black uppercase">
                  {currentTemplateObj.title}
                </span>
                <h4 className="text-xs font-bold text-white">Semangat Santri TK Islam Asy Syifa!</h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-300">
                  <Music className="w-3 h-3 text-violet-400" />
                  <span className="truncate">{currentTemplateObj.music}</span>
                </div>
              </div>
            </div>

            {/* Resolution Selector & Export Trigger */}
            <div className="w-full space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Resolusi Ekspor:</span>
                <div className="flex gap-1">
                  {[
                    { id: 'HD_720P', label: '720p' },
                    { id: 'FHD_1080P', label: '1080p' },
                    { id: '2K_QHD', label: '2K' },
                    { id: '4K_UHD', label: '4K' }
                  ].map((res) => (
                    <button
                      key={res.id}
                      onClick={() => setSelectedResolution(res.id as any)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        selectedResolution === res.id
                          ? 'bg-violet-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartExport}
                disabled={isExporting}
                className="w-full py-3 rounded-2xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? `Mengekspor Video (${exportProgress}%)...` : `Render & Unduh Video (${selectedResolution.replace('_', ' ')})`}
              </button>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Template Selection Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-400" />
              Pilihan Template Video Resmi ({templates.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">SIAP PAKAI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-violet-500/10 border-violet-500/60 ring-2 ring-violet-500/20 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{tpl.icon}</span>
                      <div>
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-violet-300' : 'text-white'}`}>
                          {tpl.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">{tpl.category}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-violet-500 text-slate-950 shrink-0">
                        AKTIF
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-950 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-violet-400" />
                      {tpl.duration}
                    </span>
                    <span className="truncate max-w-[140px] italic">"{tpl.music.slice(0, 18)}..."</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
