import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Star, 
  Layers, 
  ArrowRight, 
  Activity, 
  BookOpen, 
  Palette, 
  Building, 
  GraduationCap, 
  Moon, 
  Heart,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { 
  TemplateIntelligenceHub as TemplateHubService, 
  CreativeTemplateItem 
} from '../../core/creator/templateIntelligenceHub';

interface TemplateIntelligenceHubProps {
  onSelectTemplate?: (template: CreativeTemplateItem) => void;
}

export const TemplateIntelligenceHub: React.FC<TemplateIntelligenceHubProps> = ({
  onSelectTemplate
}) => {
  const templateHub = useMemo(() => TemplateHubService.getInstance(), []);
  const [templates] = useState<CreativeTemplateItem[]>(() => templateHub.getTemplates());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTemplates = useMemo(() => {
    return templates.filter(tmpl => {
      if (selectedCategory !== 'ALL' && tmpl.category !== selectedCategory) return false;
      if (selectedTag !== 'ALL' && tmpl.statusTag !== selectedTag) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tmpl.name.toLowerCase().includes(q) ||
          tmpl.defaultTitle.toLowerCase().includes(q) ||
          tmpl.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [templates, selectedCategory, selectedTag, searchQuery]);

  const categories = [
    { id: 'ALL', label: 'Semua Kategori' },
    { id: 'SENAM', label: 'Senam & Olahraga', icon: Activity },
    { id: 'TAHFIDZ', label: 'Tahfidz Juz 30', icon: BookOpen },
    { id: 'MEWARNAI', label: 'Mewarnai & Seni', icon: Palette },
    { id: 'MANASIK', label: 'Manasik Haji', icon: Building },
    { id: 'WISUDA', label: 'Wisuda Santri', icon: GraduationCap },
    { id: 'RAMADHAN', label: 'Semarak Ramadhan', icon: Moon },
    { id: 'HARI_GURU', label: 'Hari Guru', icon: Heart }
  ];

  return (
    <div className="space-y-6" id="template-intelligence-hub">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Template Intelligence Hub
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R816 &bull; RC99
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pustaka Template Original TADE
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Koleksi template desain orisinal untuk kegiatan TK Islami: Senam, Tahfidz, Mewarnai, Manasik, Wisuda, Ramadhan, dan Hari Guru.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-x-auto">
          {categories.map(c => {
            const active = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Tag Switcher & Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 transition"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {['ALL', 'VIRAL', 'REKOMENDASI', 'BARU'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  selectedTag === t
                    ? 'bg-slate-800 text-amber-400 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'Semua Status' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(tmpl => {
          return (
            <div
              key={tmpl.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition duration-300 flex flex-col justify-between shadow-xl group"
            >
              {/* Top Banner Card with Dynamic Gradient */}
              <div className={`p-6 bg-linear-to-br ${tmpl.previewGradient} relative overflow-hidden flex flex-col justify-between h-48`}>
                <div className="flex items-center justify-between relative z-10">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                    tmpl.statusTag === 'VIRAL'
                      ? 'bg-rose-500 text-white'
                      : tmpl.statusTag === 'REKOMENDASI'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-sky-400 text-slate-950'
                  }`}>
                    {tmpl.statusTag === 'VIRAL' && <Flame className="w-3 h-3" />}
                    {tmpl.statusTag === 'REKOMENDASI' && <Star className="w-3 h-3 fill-current" />}
                    {tmpl.statusTag}
                  </span>

                  <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-amber-300 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {tmpl.ratingScore}
                  </div>
                </div>

                <div className="relative z-10 space-y-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider inline-block">
                    {tmpl.badgeLabel}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight drop-shadow-md">
                    {tmpl.name}
                  </h3>
                </div>

                {/* Subtle Decorative Circle */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* Template Body Info */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{tmpl.defaultTitle}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Digunakan: <strong className="text-white font-semibold">{tmpl.usesCount}x</strong>
                  </span>

                  {onSelectTemplate && (
                    <button
                      onClick={() => onSelectTemplate(tmpl)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Gunakan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
