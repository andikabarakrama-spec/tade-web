import React, { useState } from 'react';
import { 
  Heart, Sun, Moon, Sparkles, BookOpen, Calendar, Award, CheckCircle2, 
  MessageCircle, Flame, Star, Send, ShieldCheck, RefreshCw, Layers, 
  ArrowRight, Feather, Clock, Smile, AlertTriangle, Lightbulb, Image as ImageIcon
} from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';

export interface TodaySpecialRecord {
  id: string;
  timeOfDay: 'pagi' | 'sore';
  categories: string[];
  teacherNote: string;
  aiStoryTitle: string;
  aiStoryContent: string;
  timestamp: string;
  mediaCount: number;
}

export const TodayIsSpecialHeart: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  // Morning Routine Selected Categories
  const [selectedMorningCategories, setSelectedMorningCategories] = useState<string[]>([
    'Penyambutan', 'Tahfidz', 'Bermain'
  ]);

  // Afternoon Happy Moment Input
  const [afternoonNote, setAfternoonNote] = useState<string>(
    'Hari ini ananda Hafizh gembira sekali bisa melantunkan Surah An-Naba ayat 1-10 secara lancar di musholla dan berbagi kue dengan kawan-kawannya.'
  );

  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'today' | 'memory' | 'alert_check' | 'cms'>('today');

  // Memory Records
  const [records, setRecords] = useState<TodaySpecialRecord[]>([
    {
      id: 'rec-1',
      timeOfDay: 'pagi',
      categories: ['Penyambutan', 'Tahfidz', 'Kebersamaan'],
      teacherNote: 'Anak-anak menyambut ustadzah di gerbang dengan senyum dan wudhu mandiri.',
      aiStoryTitle: 'Senyum Pagi di Gerbang Hijau & Lantunan Surah An-Naba',
      aiStoryContent: 'Sinar matahari pagi menyinari jalan desa Tanggul saat anak-anak melangkah dengan tas ransel ciliknya. Hari ini dipenuhi rasa syukur dan hafalan Qur\'an yang merdu.',
      timestamp: 'Hari Ini, 08.15 WIB',
      mediaCount: 3
    },
    {
      id: 'rec-2',
      timeOfDay: 'sore',
      categories: ['Karya Anak', 'Belajar'],
      teacherNote: 'Membuat miniatur masjid dari balok kayu dan melukis bunga kamboja.',
      aiStoryTitle: 'Kreativitas Cilik: Masjid Balok Kayu & Lukisan Kamboja',
      aiStoryContent: 'Dengan teliti, jari-jari mungil ananda menyusun balok demi balok hingga membentuk menara masjid yang indah di Sentra Balok.',
      timestamp: 'Kemarin, 14.00 WIB',
      mediaCount: 5
    }
  ]);

  // Alert State for 30-Day Freshness
  const daysSinceLastUpdate = 2; // Simulate recent update
  const is30DaysInactive = daysSinceLastUpdate >= 30;

  // Morning Category Options
  const categoryOptions = [
    { id: 'Penyambutan', label: '🌸 Penyambutan' },
    { id: 'Belajar', label: '📚 Belajar' },
    { id: 'Bermain', label: '🛝 Bermain' },
    { id: 'Tahfidz', label: '🕌 Tahfidz' },
    { id: 'Karya Anak', label: '🎨 Karya Anak' },
    { id: 'Doa', label: '🤲 Doa' },
    { id: 'Kebersamaan', label: '🤝 Kebersamaan' },
    { id: 'Lainnya', label: '🌿 Lainnya' },
  ];

  const toggleCategory = (catId: string) => {
    if (selectedMorningCategories.includes(catId)) {
      setSelectedMorningCategories(selectedMorningCategories.filter(c => c !== catId));
    } else {
      setSelectedMorningCategories([...selectedMorningCategories, catId]);
    }
  };

  const handleGenerateAndSave = () => {
    setIsGeneratingStory(true);
    setTimeout(() => {
      setIsGeneratingStory(false);
      const newRec: TodaySpecialRecord = {
        id: `rec-${Date.now()}`,
        timeOfDay: 'sore',
        categories: selectedMorningCategories,
        teacherNote: afternoonNote,
        aiStoryTitle: `Momen Bahagia Hari Ini: ${selectedMorningCategories.join(' & ')}`,
        aiStoryContent: `Alhamdulillah, catatan kasih sayang Bu Guru hari ini: "${afternoonNote}". Momen indah ini menjadi jejak pertumbuhan ananda yang berharga di TK Asy Syifa Tanggul.`,
        timestamp: 'Baru saja',
        mediaCount: 2
      };
      setRecords([newRec, ...records]);
    }, 1000);
  };

  return (
    <section className="bg-gradient-to-br from-amber-50/90 via-emerald-50/80 to-teal-50 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-2xl space-y-8 my-8 relative overflow-hidden">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-amber-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/60 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-slate-950" /> TODAY IS SPECIAL • SPRINT WR-20
              </span>
              <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 font-extrabold text-xs px-3 py-1 rounded-full">
                Jantung Digital TK Asy Syifa
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight leading-snug">
              Rumah Digital & Catatan Kenangan Kehangatan Ananda
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
              Setiap hari memiliki kebaikan tersendiri. Bu Guru mencatat momen kecil di pagi dan sore hari, AI Asy merangkainya menjadi buku kenangan hidup untuk Ayah & Bunda.
            </p>
          </div>

          {/* AI Asy Companion Mini Dialog */}
          <div className="p-4 bg-emerald-900/90 rounded-2xl border border-amber-300/40 flex items-center gap-3 shrink-0 max-w-xs">
            <div className="w-10 h-12 shrink-0">
              <AIAsyCharacterRenderer state="wave" scale={0.7} />
            </div>
            <p className="text-xs text-amber-200 italic font-medium leading-snug">
              "Hari ini apa yang ingin dikenang, Bu Guru? Asy siap membantu menyusun ceritanya!"
            </p>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-amber-500/30 no-scrollbar">
          {[
            { id: 'today', label: '1. Today is Special (Pagi & Sore)', icon: '☀️' },
            { id: 'memory', label: '2. AI Memori (Buku Kelas & Tahunan)', icon: '📚' },
            { id: 'alert_check', label: '3. Status Updates & AI Recommendations', icon: '🔔' },
            { id: 'cms', label: '4. CMS Control Living Experience', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-md border border-amber-300'
                  : 'bg-emerald-900/70 text-emerald-200 hover:bg-emerald-800 border border-emerald-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: TODAY IS SPECIAL (Pagi & Sore Routine) */}
      {activeSubTab === 'today' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-8">
          {/* Morning Routine Box */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-950 border-b border-stone-200 pb-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black tracking-tight">
                PAGI: "Hari ini apa yang ingin dikenang?"
              </h3>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              Bu Guru cukup mengetuk pilihan momen yang paling menonjol pada pagi hari ini:
            </p>

            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => {
                const isSelected = selectedMorningCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-800 text-amber-300 border-emerald-600 shadow-md ring-2 ring-emerald-500'
                        : 'bg-stone-50 text-stone-700 hover:bg-emerald-50 border-stone-200'
                    }`}
                  >
                    {cat.label} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Afternoon Routine Box */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-2 text-emerald-950 border-b border-stone-200 pb-3">
              <Moon className="w-5 h-5 text-teal-700" />
              <h3 className="text-lg font-black tracking-tight">
                SORE: "Hari ini apa momen paling membahagiakan?"
              </h3>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              Tuliskan satu kalimat bermakna dari sudut pandang pengasuhan dan pembelajaran hangat Bu Guru:
            </p>

            <textarea
              value={afternoonNote}
              onChange={(e) => setAfternoonNote(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-2xl border border-stone-300 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              placeholder="Tuliskan satu kalimat kebahagiaan anak hari ini..."
            />

            <div className="flex justify-end">
              <button
                onClick={handleGenerateAndSave}
                disabled={isGeneratingStory}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-2 border border-amber-300"
              >
                {isGeneratingStory ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>AI Asy Merangkai Cerita...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Rangkai Cerita & Simpan ke Timeline Sekolah</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Recent Feed Output */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-500">
              Momen Pilihan Terbaru Hari Ini:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {records.map((rec) => (
                <div key={rec.id} className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-md">
                      {rec.timeOfDay === 'pagi' ? '☀️ Catatan Pagi' : '🌙 Catatan Pulang'}
                    </span>
                    <span className="text-[10px] text-stone-500 font-bold">{rec.timestamp}</span>
                  </div>

                  <h5 className="text-xs font-black text-slate-900">{rec.aiStoryTitle}</h5>
                  <p className="text-xs text-stone-700 italic font-medium leading-relaxed">
                    "{rec.aiStoryContent}"
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    {rec.categories.map((c, i) => (
                      <span key={i} className="text-[9px] bg-white text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md font-bold">
                        #{c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AI MEMORI (Buku Perjalanan Kelas & Tahunan) */}
      {activeSubTab === 'memory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Modul AI Memori • Ringkasan Otomatis
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              Buku Perjalanan Kelas (Semester) & Perjalanan Sekolah (Tahunan)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly Highlight */}
            <div className="p-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl border border-emerald-600 shadow-md space-y-3">
              <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md">
                RINGKASAN BULAN INI
              </span>
              <h4 className="text-sm font-black text-amber-200">
                "Selama Bulan Ini di TK Asy Syifa..."
              </h4>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                Telah diabadikan 48 momen hangat, 14 karya anak di Sentra Seni, dan 100% ananda Kelompok A & B lancar mempraktikkan wudhu serta sholat Dhuha berjamaah.
              </p>
            </div>

            {/* Semester Class Journey Book */}
            <div className="p-5 bg-gradient-to-br from-amber-900 to-emerald-950 text-white rounded-2xl border border-amber-400/50 shadow-md space-y-3">
              <span className="text-[10px] font-black bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-md">
                SEMESTER JOURNEY BOOK
              </span>
              <h4 className="text-sm font-black text-amber-200">
                Buku Perjalanan Kelas Kelompok A & B
              </h4>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                Kumpulan halaman digital bergambar yang mendokumentasikan senyuman, karya tangan, dan hafalan juz 30 ananda selama satu semester.
              </p>
            </div>

            {/* Annual School Journey */}
            <div className="p-5 bg-gradient-to-br from-teal-900 to-emerald-950 text-white rounded-2xl border border-teal-400/50 shadow-md space-y-3">
              <span className="text-[10px] font-black bg-teal-300 text-slate-950 px-2.5 py-0.5 rounded-md">
                ANNUAL SCHOOL JOURNEY
              </span>
              <h4 className="text-sm font-black text-amber-200">
                Arsip Perjalanan Tahunan Sekolah
              </h4>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                Jejak pertumbuhan sekolah asri Tanggul, kolaborasi wali murid, dan kehangatan keluarga besar TK Asy Syifa Jember.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STATUS UPDATES & AI 30-DAY FRESHNESS RECOMMENDATIONS */}
      {activeSubTab === 'alert_check' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Validasi Website Freshness & AI Prompt Recommendations
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              Pengawas Kehidupan Website & Rekomendasi Konten AI
            </h3>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" /> Hari Tanpa Cerita Baru:
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-full border border-emerald-300">
                {daysSinceLastUpdate} Hari Lalu (Website Sangat Aktif)
              </span>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Rekomendasi Konten AI Asy Jika Website Tidak Diperbarui &gt; 7 Hari:
              </div>
              <ul className="text-xs text-stone-700 font-medium space-y-1.5 list-disc list-inside pl-2">
                <li>Abadikan senyum ananda menyiram Bunga Kamboja di taman depan.</li>
                <li>Dokumentasikan keceriaan Sentra Bahan Alam atau Sentra Balok.</li>
                <li>Unggah video singkat kekhusyukan sholat Dhuha dan murojaah bersama.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CMS CONTROL LIVING EXPERIENCE */}
      {activeSubTab === 'cms' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              CMS Control Living Experience
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              Kendali Tanpa Coding untuk Seluruh Fitur Living Website
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-stone-800">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <span>Auto Prompt Today is Special (Pagi/Sore)</span>
              <span className="bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">Aktif</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <span>Buku Perjalanan Kelas AI (Semester)</span>
              <span className="bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">Aktif</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <span>Notifikasi AI Asy Freshness Alert (&gt;30 Hari)</span>
              <span className="bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">Aktif</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <span>Integrasi Homepage Live Feed</span>
              <span className="bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">Aktif</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
