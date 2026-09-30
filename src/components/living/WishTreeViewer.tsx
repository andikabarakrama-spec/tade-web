import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Send,
  CheckCircle2,
  Filter,
  Plus,
  Crown,
  BookOpen,
  Calendar,
  Users,
  ShieldCheck
} from 'lucide-react';
import {
  wishTreeService,
  WishTreeLeaf,
  WishTreeSummary
} from '../../services/wishTreeService';
import { livingEventEngine } from '../../services/livingEventEngine';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const WishTreeViewer: React.FC = () => {
  const activeEvent = livingEventEngine.getActiveEvent();
  const [summary, setSummary] = useState<WishTreeSummary>(() =>
    wishTreeService.getSummary(activeEvent.title)
  );

  // Form states
  const [senderName, setSenderName] = useState('');
  const [senderRole, setSenderRole] = useState<WishTreeLeaf['senderRole']>('WALI_MURID');
  const [targetStudentOrSchool, setTargetStudentOrSchool] = useState('');
  const [wishText, setWishText] = useState('');
  const [category, setCategory] = useState<WishTreeLeaf['prayerCategory']>('AKHLAK');
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !wishText.trim()) return;

    wishTreeService.addWish(
      senderName,
      senderRole,
      targetStudentOrSchool || 'Keluarga Besar TK Asy Syifa',
      wishText,
      category,
      activeEvent.title
    );

    setSummary(wishTreeService.getSummary(activeEvent.title));
    setSenderName('');
    setTargetStudentOrSchool('');
    setWishText('');
    setShowForm(false);

    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Wish Tree Engine',
      `Daun doa baru disematkan oleh ${senderName} (${senderRole})`
    );

    setFeedback('🌿 Doa & Harapan berhasil disematkan pada Pohon Harapan Digital!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleBless = (id: string) => {
    wishTreeService.blessLeaf(id);
    setSummary(wishTreeService.getSummary(activeEvent.title));
    setFeedback('🤲 Aamiin! Doa keberkahan ditambahkan.');
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              WISH TREE FOUNDATION (P5)
            </span>
            <span className="text-xs text-stone-500">Pohon Harapan & Doa Digital Sekolah</span>
          </div>
          <h2 className="text-xl font-black text-stone-900">
            Pohon Harapan: {activeEvent.title}
          </h2>
          <p className="text-xs text-stone-500">
            Kumpulan munajat, doa tulus wali murid, dan harapan guru yang menghidupkan ekosistem TK Asy Syifa.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Tutup Formulir' : 'Sematkan Doa Baru'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Form modal/accordion */}
      {showForm && (
        <form onSubmit={handleAddWish} className="p-5 bg-stone-50 rounded-2xl border border-stone-300 space-y-4 animate-scale-up">
          <div className="font-bold text-xs text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tuliskan Doa atau Harapan untuk Ananda / Sekolah</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-700">Nama Pengirim</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Contoh: Bunda Fatimah"
                className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Peran Pengirim</label>
              <select
                value={senderRole}
                onChange={(e) => setSenderRole(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
              >
                <option value="WALI_MURID">Wali Murid</option>
                <option value="GURU">Ustadz / Ustadzah</option>
                <option value="YAYASAN">Pengurus Yayasan</option>
                <option value="FOUNDER">Founder Andika</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Kategori Doa</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
              >
                <option value="AKHLAK">Akhlak Mulia & Adab</option>
                <option value="TAHFIDZ">Hafalan Quran & Doa</option>
                <option value="KESEHATAN">Kesehatan & Keceriaan</option>
                <option value="CITA_CITA">Cita-Cita & Keberhasilan</option>
                <option value="EVENT_KHUSUS">Event & Milad Khusus</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-700">Ditujukan Kepada</label>
            <input
              type="text"
              value={targetStudentOrSchool}
              onChange={(e) => setTargetStudentOrSchool(e.target.value)}
              placeholder="Contoh: Ananda Rayhan / Seluruh Santri Kelompok B"
              className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-700">Teks Doa / Harapan</label>
            <textarea
              required
              rows={3}
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Tuliskan doa terbaik untuk buah hati..."
              className="w-full mt-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gantungkan Doa di Pohon</span>
            </button>
          </div>
        </form>
      )}

      {/* Leaves Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summary.leaves.map((leaf) => (
          <div
            key={leaf.id}
            className={`p-4 rounded-2xl border shadow-sm space-y-3 flex flex-col justify-between transition hover:-translate-y-1 ${leaf.leafColor}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 text-stone-800 border border-stone-200">
                  {leaf.senderRole}
                </span>
                {leaf.isPinned && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-300 text-slate-950 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-800" />
                    Sovereign Note
                  </span>
                )}
              </div>

              <div>
                <div className="font-black text-xs text-stone-900">{leaf.senderName}</div>
                <div className="text-[10px] text-stone-600">Untuk: {leaf.targetStudentOrSchool}</div>
              </div>

              <p className="text-xs italic leading-relaxed text-stone-800">
                "{leaf.wishText}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-300/60 text-[10px]">
              <span className="text-stone-600 font-mono">{leaf.eventName || 'Harian Aktif'}</span>
              <button
                onClick={() => handleBless(leaf.id)}
                className="px-2.5 py-1 bg-white/90 hover:bg-white rounded-lg text-emerald-900 font-bold flex items-center gap-1 shadow-xs cursor-pointer transition"
              >
                <span>🤲 Aamiin ({leaf.blessingCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
