import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Search, 
  Plus, 
  CheckCircle2, 
  Compass, 
  Lightbulb, 
  ShieldAlert, 
  X, 
  Clock, 
  Tag, 
  Zap,
  Layers
} from 'lucide-react';
import { 
  TrendIntelligenceCenter as TrendService, 
  TrendItem, 
  TrendCategory, 
  TrendStatus 
} from '../../core/creator/trendIntelligenceCenter';
import { AsyCentralIntelligenceCore } from '../../core/creator/asyCentralIntelligenceCore';

export const TrendIntelligenceCenter: React.FC = () => {
  const trendService = useMemo(() => TrendService.getInstance(), []);
  const centralIntel = useMemo(() => AsyCentralIntelligenceCore.getInstance(), []);

  const [trends, setTrends] = useState<TrendItem[]>(() => trendService.getTrends());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Trend Form State
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<TrendCategory>('FORMAT');
  const [newConfidence, setNewConfidence] = useState<number>(90);
  const [newStatus, setNewStatus] = useState<TrendStatus>('RISING');
  const [newRecommendation, setNewRecommendation] = useState<string>('');
  const [newBestUseFor, setNewBestUseFor] = useState<string>('Instagram Reels & Status WA');
  const [newExampleHook, setNewExampleHook] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('TrendSantri, PAUD, Kreatif');

  useEffect(() => {
    const unsub = trendService.subscribe(setTrends);
    return () => unsub();
  }, [trendService]);

  const handleAddTrend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    trendService.addCuratedTrend({
      name: newName,
      category: newCategory,
      confidencePercent: newConfidence,
      status: newStatus,
      recommendation: newRecommendation,
      bestUseFor: newBestUseFor,
      exampleHook: newExampleHook,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    centralIntel.recordEvent(
      'Trend Intelligence',
      'SUCCESS',
      `Kurasi tren baru "${newName}" berhasil didaftarkan (Confidence: ${newConfidence}%).`
    );

    // Reset Form
    setNewName('');
    setNewRecommendation('');
    setNewExampleHook('');
    setShowAddModal(false);
  };

  const filteredTrends = useMemo(() => {
    if (selectedCategory === 'ALL') return trends;
    return trends.filter(t => t.category === selectedCategory);
  }, [trends, selectedCategory]);

  return (
    <div className="space-y-6" id="trend-intelligence-center">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Trend Intelligence Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R817 &bull; RC99
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Radar Intelijen Kreatif PAUD
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Kurasi tren terkurasi untuk ide pembuatan konten, hook story, format video pendek, dan palet warna sekolah tanpa scraping eksternal invasif.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-amber-500 text-slate-950 font-bold hover:from-rose-400 hover:to-amber-400 transition shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 text-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambah Kurasi Tren
          </button>
        </div>

        {/* Security & Integrity Note */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero Inversive Scraping:</strong> Semua data tren diinput dan dikurasi terjadwal oleh tim konten TADE secara aman dan etis.
          </span>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'ALL', label: 'Semua Tren' },
          { id: 'FORMAT', label: 'Format Video / Story' },
          { id: 'COLOR_PALETTE', label: 'Palet Warna' },
          { id: 'AUDIO_THEME', label: 'Tema Audio & Nasyid' },
          { id: 'STORYTELLING', label: 'Storytelling & Narasi' },
          { id: 'TYPOGRAPHY', label: 'Tipografi Dinamis' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrends.map(trend => {
          return (
            <div
              key={trend.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-rose-500/40 transition duration-300 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {trend.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      trend.status === 'PEAK'
                        ? 'bg-amber-400 text-slate-950'
                        : trend.status === 'RISING'
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {trend.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{trend.confidencePercent}% Confidence</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {trend.name}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {trend.recommendation}
                </p>

                {trend.exampleHook && (
                  <div className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1">
                      <Lightbulb className="w-3 h-3" />
                      Contoh Hook / Kalimat Pembuka:
                    </span>
                    <p className="text-slate-200 italic font-medium">&quot;{trend.exampleHook}&quot;</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>Cocok: <strong className="text-slate-200">{trend.bestUseFor}</strong></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {trend.lastCuratedDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Trend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-white shadow-2xl space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Tambah Kurasi Tren Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTrend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Tren</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Misal: Transisi Senam Irama 3-Detik"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-rose-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TrendCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-rose-500 transition cursor-pointer"
                  >
                    <option value="FORMAT">FORMAT</option>
                    <option value="COLOR_PALETTE">COLOR_PALETTE</option>
                    <option value="AUDIO_THEME">AUDIO_THEME</option>
                    <option value="STORYTELLING">STORYTELLING</option>
                    <option value="TYPOGRAPHY">TYPOGRAPHY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TrendStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-rose-500 transition cursor-pointer"
                  >
                    <option value="RISING">RISING</option>
                    <option value="PEAK">PEAK</option>
                    <option value="EVERGREEN">EVERGREEN</option>
                    <option value="COOLING">COOLING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confidence Score: {newConfidence}%</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={newConfidence}
                  onChange={(e) => setNewConfidence(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Rekomendasi Eksekusi</label>
                <textarea
                  rows={2}
                  required
                  value={newRecommendation}
                  onChange={(e) => setNewRecommendation(e.target.value)}
                  placeholder="Jelaskan cara menerapkan tren ini untuk guru/wali murid..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-rose-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contoh Hook / Kalimat</label>
                <input
                  type="text"
                  value={newExampleHook}
                  onChange={(e) => setNewExampleHook(e.target.value)}
                  placeholder='Misal: "Hafalan lancar dalam 1 minggu..."'
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-rose-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-rose-950/40 cursor-pointer"
                >
                  Daftarkan Tren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
