import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  Share2, 
  Globe, 
  Archive, 
  Calendar, 
  MapPin, 
  User, 
  Image as ImageIcon, 
  Video, 
  CheckCircle2, 
  ChevronRight,
  SlidersHorizontal,
  X,
  Layers,
  Sparkle
} from 'lucide-react';
import { 
  LivingActivityCenterService, 
  ActivityRecord, 
  ActivityCategory 
} from '../../core/creator/livingActivityCenterService';
import { AsyCentralIntelligenceCore } from '../../core/creator/asyCentralIntelligenceCore';

interface LivingActivityCenterProps {
  onOpenPhotoLab?: (photoUrl?: string) => void;
  onOpenStoryStudio?: (photoUrl?: string) => void;
}

export const LivingActivityCenter: React.FC<LivingActivityCenterProps> = ({
  onOpenPhotoLab,
  onOpenStoryStudio
}) => {
  const activityService = useMemo(() => LivingActivityCenterService.getInstance(), []);
  const centralIntel = useMemo(() => AsyCentralIntelligenceCore.getInstance(), []);

  const [activities, setActivities] = useState<ActivityRecord[]>(() => activityService.getActivities());
  const [activeTab, setActiveTab] = useState<'FEED' | 'TIMELINE' | 'GALLERY' | 'ARCHIVE'>('FEED');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Single Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('SENAM');
  const [newLocation, setNewLocation] = useState<string>('Halaman TK Asy Syifa');
  const [newClassGroup, setNewClassGroup] = useState<string>('Kelompok B1');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80');
  const [autoEnhance, setAutoEnhance] = useState<boolean>(true);
  const [publishWebsite, setPublishWebsite] = useState<boolean>(true);
  const [selectedDetailAct, setSelectedDetailAct] = useState<ActivityRecord | null>(null);

  useEffect(() => {
    const unsub = activityService.subscribe(setActivities);
    return () => unsub();
  }, [activityService]);

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      if (activeTab === 'ARCHIVE' && !act.isArchived) return false;
      if (activeTab !== 'ARCHIVE' && act.isArchived) return false;

      if (selectedCategory !== 'ALL' && act.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = act.title.toLowerCase().includes(q);
        const matchDesc = act.description.toLowerCase().includes(q);
        const matchTag = act.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }

      return true;
    });
  }, [activities, activeTab, selectedCategory, searchQuery]);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = activityService.createActivity({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      location: newLocation,
      uploaderName: 'Ustadzah Nurul',
      uploaderRole: 'GURU',
      classGroup: newClassGroup,
      coverMediaId: 'm-new-1',
      mediaList: [
        {
          id: 'm-new-1',
          url: newPhotoUrl,
          caption: newTitle,
          isCover: true,
          qualityScore: autoEnhance ? 96 : 88,
          enhanced: autoEnhance
        }
      ],
      publishedToWebsite: publishWebsite,
      isArchived: false,
      tags: [newCategory, 'KegiatanSantri', 'AsySyifa'],
      smartCoverScore: 96
    });

    centralIntel.recordEvent(
      'Living Activity',
      'SUCCESS',
      `Kegiatan "${created.title}" berhasil diunggah dan ${publishWebsite ? 'dipublikasikan ke website' : 'disimpan sebagai draft'}.`
    );

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setShowUploadModal(false);
  };

  const categoriesList: ActivityCategory[] = [
    'SENAM',
    'TAHFIDZ',
    'MEWARNAI',
    'MANASIK',
    'WISUDA',
    'RAMADHAN',
    'HARI_GURU',
    'OUTBOUND',
    'PENTAS_SENI'
  ];

  return (
    <div className="space-y-6" id="living-activity-center">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Living Activity Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R812 &bull; RC99
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pusat Kegiatan Santri Ceria
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Alur terpadu dokumentasi kegiatan santri TK Asy Syifa: guru cukup upload sekali, otomatis tersinkronisasi ke feed, timeline, galeri, dan website publik.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-500 transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 text-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Upload Kegiatan Baru
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <span className="text-xs text-slate-400 font-medium">Total Kegiatan</span>
            <p className="text-xl font-bold text-white mt-0.5">{activities.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <span className="text-xs text-slate-400 font-medium">Tayang di Website</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">
              {activities.filter(a => a.publishedToWebsite && !a.isArchived).length}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <span className="text-xs text-slate-400 font-medium">Total Apresiasi / Like</span>
            <p className="text-xl font-bold text-rose-400 mt-0.5">
              {activities.reduce((acc, a) => acc + a.likesCount, 0)}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <span className="text-xs text-slate-400 font-medium">Asy AI Enhanced</span>
            <p className="text-xl font-bold text-sky-400 mt-0.5">100%</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-x-auto">
          {[
            { id: 'FEED', label: 'Feed Kegiatan', icon: Layers },
            { id: 'TIMELINE', label: 'Timeline', icon: Calendar },
            { id: 'GALLERY', label: 'Galeri Foto', icon: ImageIcon },
            { id: 'ARCHIVE', label: 'Arsip Sekolah', icon: Archive }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan, santri, tag..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Rendering based on Tab */}
      {filteredActivities.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
          <h3 className="text-base font-bold text-white">Tidak Ada Kegiatan Ditemukan</h3>
          <p className="text-xs max-w-md mx-auto">
            Coba ganti filter kategori atau klik tombol &quot;Upload Kegiatan Baru&quot; untuk menambahkan dokumentasi perdana.
          </p>
        </div>
      ) : activeTab === 'GALLERY' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredActivities.flatMap(act => act.mediaList.map(media => ({ ...media, activityTitle: act.title, actId: act.id }))).map((m, idx) => (
            <div
              key={`${m.actId}-${m.id}-${idx}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-square cursor-pointer shadow-md"
              onClick={() => {
                const act = activities.find(a => a.id === m.actId);
                if (act) setSelectedDetailAct(act);
              }}
            >
              <img
                src={m.url}
                alt={m.caption || 'Foto kegiatan'}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end">
                <span className="text-xs font-bold text-white truncate">{m.caption || m.activityTitle}</span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <Sparkle className="w-3 h-3" /> Score {m.qualityScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'TIMELINE' ? (
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 md:before:left-8 before:w-0.5 before:bg-slate-800">
          {filteredActivities.map((act) => (
            <div key={act.id} className="relative flex items-start gap-4 md:gap-6 pl-12 md:pl-16">
              <div className="absolute left-4 md:left-6 -translate-x-1/2 top-1.5 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-900 shadow-md" />
              
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-emerald-500/40 transition space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {act.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {act.date}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {act.location}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white hover:text-emerald-400 transition cursor-pointer" onClick={() => setSelectedDetailAct(act)}>
                  {act.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {act.description}
                </p>

                {/* Media Preview Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {act.mediaList.map((m) => (
                    <img
                      key={m.id}
                      src={m.url}
                      alt="Thumbnail"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Feed View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredActivities.map((act) => {
            const coverMedia = act.mediaList.find(m => m.id === act.coverMediaId) || act.mediaList[0];
            return (
              <div
                key={act.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/40 transition duration-300 flex flex-col shadow-lg group"
              >
                {/* Cover Image with Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setSelectedDetailAct(act)}>
                  <img
                    src={coverMedia?.url}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Category & Status Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                      {act.category}
                    </span>
                    {act.publishedToWebsite && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-slate-950 flex items-center gap-1 shadow-xs">
                        <Globe className="w-3 h-3" /> Website
                      </span>
                    )}
                  </div>

                  {/* Smart Cover Score Badge */}
                  {act.smartCoverScore && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Smart Cover {act.smartCoverScore}
                    </div>
                  )}

                  {/* Title Overlay in Cover */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-base font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition">
                      {act.title}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        {act.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-emerald-400" />
                        {act.classGroup}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {act.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {act.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700/50">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => activityService.toggleLike(act.id)}
                        className="flex items-center gap-1 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>{act.likesCount}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span>{act.viewsCount}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenStoryStudio && (
                        <button
                          onClick={() => onOpenStoryStudio(coverMedia?.url)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px] transition flex items-center gap-1 cursor-pointer"
                          title="Buat Story 9:16 dari kegiatan ini"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          Story Studio
                        </button>
                      )}
                      {onOpenPhotoLab && (
                        <button
                          onClick={() => onOpenPhotoLab(coverMedia?.url)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30 transition flex items-center gap-1 cursor-pointer"
                          title="Buka di Photo Lab"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                          Photo Lab
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 text-white shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload Kegiatan Santri Cepat</h3>
                  <p className="text-xs text-slate-400">Guru cukup upload sekali untuk arsip, feed, dan website publik.</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Senam Irama Ceria & Pembiasaan Doa Pagi"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kategori Kegiatan</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ActivityCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kelas / Kelompok</label>
                  <input
                    type="text"
                    value={newClassGroup}
                    onChange={(e) => setNewClassGroup(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ceritakan keseruan dan capaian santri dalam kegiatan ini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL Foto Utama / Dokumentasi</label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Mendukung foto resolusi tinggi, WebP, dan JPEG aman.
                </p>
              </div>

              {/* Automation Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Auto-Enhance Photo Lab</span>
                      <span className="text-[10px] text-slate-400">Perbaiki pencahayaan & ketajaman otomatis</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoEnhance}
                    onChange={(e) => setAutoEnhance(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-sky-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Tayangkan di Website Publik</span>
                      <span className="text-[10px] text-slate-400">Sinkronisasi otomatis ke portal berita sekolah</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={publishWebsite}
                    onChange={(e) => setPublishWebsite(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-950/40 cursor-pointer"
                >
                  Simpan & Terbitkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedDetailAct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 text-white shadow-2xl space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {selectedDetailAct.category}
              </span>
              <button
                onClick={() => setSelectedDetailAct(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white">{selectedDetailAct.title}</h2>
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={selectedDetailAct.mediaList[0]?.url}
                alt={selectedDetailAct.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedDetailAct.description}</p>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div>
                <span className="font-semibold text-slate-300 block">Tanggal & Lokasi</span>
                <span>{selectedDetailAct.date} &bull; {selectedDetailAct.location}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-300 block">Pengunggah</span>
                <span>{selectedDetailAct.uploaderName} ({selectedDetailAct.classGroup})</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => activityService.togglePublish(selectedDetailAct.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedDetailAct.publishedToWebsite
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {selectedDetailAct.publishedToWebsite ? 'Tayang di Website' : 'Draft Internal'}
                </button>
                <button
                  onClick={() => activityService.toggleArchive(selectedDetailAct.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  {selectedDetailAct.isArchived ? 'Batal Arsipkan' : 'Arsipkan'}
                </button>
              </div>

              <button
                onClick={() => setSelectedDetailAct(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
