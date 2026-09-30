import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Users, 
  Layers, 
  Tag, 
  Send, 
  Plus, 
  Filter,
  Image as ImageIcon,
  Share2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface ActivityDistributionTarget {
  key: string;
  label: string;
  desc: string;
  icon: any;
  enabled: boolean;
}

export const SchoolActivityCenterPro: React.FC = () => {
  const { userProfile } = useAuth();
  const [activities, setActivities] = useState<Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED';
    imageUrl: string;
    authorName: string;
    distributedTo: string[];
    viewsCount: number;
  }>>([
    {
      id: 'ACT-001',
      title: 'Praktik Manasik Haji Cilik Santri TK A & TK B',
      description: 'Santri belajar thawaf mengelilingi miniatur ka\'bah dan sa\'i dengan penuh antusiasme dan tertib.',
      date: '2026-08-19',
      category: 'Keagamaan & Ibadah',
      status: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
      authorName: 'Ustadzah Fatimah, S.Pd',
      distributedTo: ['Galeri Sekolah', 'Feed Aplikasi', 'Timeline Kegiatan', 'Berita Website', 'Portal Wali Murid'],
      viewsCount: 142
    },
    {
      id: 'ACT-002',
      title: 'Senam Ceria Pagi & Minum Susu Bersama',
      description: 'Melatih kebugaran jasmani dan kebersamaan santri di lapangan hijau sekolah.',
      date: '2026-08-18',
      category: 'Motorik & Kesehatan',
      status: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      authorName: 'Ustadzah Nurul, S.Pd',
      distributedTo: ['Galeri Sekolah', 'Feed Aplikasi', 'Portal Wali Murid'],
      viewsCount: 98
    },
    {
      id: 'ACT-003',
      title: 'Muroja\'ah Surah An-Naba & Doa Harian',
      description: 'Hafalan Al-Qur\'an juz 30 kelompok TK B sebelum memulai aktivitas sentra.',
      date: '2026-08-19',
      category: 'Tahfidz & Karakter',
      status: 'PENDING_APPROVAL',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
      authorName: 'Ustadz Ahmad, S.Pd.I',
      distributedTo: ['Feed Aplikasi', 'Timeline Kegiatan', 'Portal Wali Murid'],
      viewsCount: 0
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Keagamaan & Ibadah');
  const [selectedTargets, setSelectedTargets] = useState<Record<string, boolean>>({
    galeri: true,
    feed: true,
    timeline: true,
    website: true,
    wali_murid: true
  });
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PUBLISHED' | 'PENDING_APPROVAL' | 'DRAFT'>('ALL');

  const handleCreateActivity = (status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED') => {
    if (!newTitle.trim()) return;

    const distributed = [
      selectedTargets.galeri ? 'Galeri Sekolah' : null,
      selectedTargets.feed ? 'Feed Aplikasi' : null,
      selectedTargets.timeline ? 'Timeline Kegiatan' : null,
      selectedTargets.website ? 'Berita Website' : null,
      selectedTargets.wali_murid ? 'Portal Wali Murid' : null
    ].filter(Boolean) as string[];

    const newItem = {
      id: `ACT-${String(activities.length + 1).padStart(3, '0')}`,
      title: newTitle,
      description: newDesc || 'Dokumentasi kegiatan santri TK Islam Asy Syifa.',
      date: new Date().toISOString().split('T')[0],
      category: newCategory,
      status: status,
      imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
      authorName: userProfile?.name || 'Guru TK Asy Syifa',
      distributedTo: distributed,
      viewsCount: 0
    };

    setActivities([newItem, ...activities]);
    setNewTitle('');
    setNewDesc('');
    setShowUploadModal(false);
  };

  const filteredActivities = activities.filter(act => {
    if (activeFilter === 'ALL') return true;
    return act.status === activeFilter;
  });

  return (
    <div className="space-y-6" id="school-activity-center-pro">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Pusat Kegiatan Sekolah & Single-Upload Flow
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R832 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Sekali Unggah: Otomatis Masuk Seluruh Kanal
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Guru cukup unggah sekali di sini, dokumentasi otomatis terdistribusi ke Galeri, Feed, Timeline, Berita Website, dan Portal Wali Murid.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" />
            Unggah Kegiatan Baru
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'Semua Status' },
          { id: 'PUBLISHED', label: 'Dipublikasikan' },
          { id: 'PENDING_APPROVAL', label: 'Menunggu Persetujuan' },
          { id: 'DRAFT', label: 'Draf Guru' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeFilter === f.id
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-white flex flex-col justify-between shadow-xl hover:border-slate-700 transition group"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img 
                  src={act.imageUrl} 
                  alt={act.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md ${
                    act.status === 'PUBLISHED'
                      ? 'bg-emerald-500 text-slate-950'
                      : act.status === 'PENDING_APPROVAL'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {act.status === 'PUBLISHED' ? 'DIPUBLIKASIKAN' : act.status === 'PENDING_APPROVAL' ? 'MENUNGGU ACC' : 'DRAF'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded-xl text-[10px] text-slate-300 border border-slate-800">
                  {act.category}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {act.date}
                  </span>
                  <span>{act.authorName}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>

            {/* Distribution Channels Tag */}
            <div className="p-5 pt-0 space-y-2.5">
              <span className="text-[10px] font-mono text-emerald-400 block uppercase">
                Terdistribusi Otomatis ke:
              </span>
              <div className="flex flex-wrap gap-1">
                {act.distributedTo.map((ch, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                  >
                    &bull; {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-lg w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Unggah Dokumentasi Kegiatan Sekolah
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Judul Kegiatan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Praktik Sholat Dhuha Berjamaah"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="Keagamaan & Ibadah">Keagamaan & Ibadah</option>
                  <option value="Tahfidz & Karakter">Tahfidz & Karakter</option>
                  <option value="Motorik & Kesehatan">Motorik & Kesehatan</option>
                  <option value="Sains & Alam">Sains & Alam</option>
                  <option value="Seni & Kreativitas">Seni & Kreativitas</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Deskripsi Kegiatan:</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan hikmah dan keseruan santri dalam kegiatan hari ini..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {/* Automatic Distribution Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="font-bold text-emerald-400 block">Kanal Distribusi Otomatis:</span>
                {[
                  { key: 'galeri', label: 'Galeri Sekolah' },
                  { key: 'feed', label: 'Feed Aplikasi' },
                  { key: 'timeline', label: 'Timeline Kegiatan' },
                  { key: 'website', label: 'Berita Website' },
                  { key: 'wali_murid', label: 'Portal Wali Murid' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTargets[item.key]}
                      onChange={(e) => setSelectedTargets({ ...selectedTargets, [item.key]: e.target.checked })}
                      className="rounded accent-emerald-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleCreateActivity('DRAFT')}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Simpan Draf
              </button>
              <button
                onClick={() => handleCreateActivity('PUBLISHED')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg"
              >
                Publikasikan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
