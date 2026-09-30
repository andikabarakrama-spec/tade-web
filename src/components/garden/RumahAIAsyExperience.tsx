import React, { useState } from 'react';
import { 
  Home, Sparkles, MessageCircle, Heart, Volume2, ShieldCheck, 
  ArrowRight, RefreshCw, Smile, Sun, Moon, Feather, BookOpen, Star, HelpCircle
} from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';

export const RumahAIAsyExperience: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [isDoorOpen, setIsDoorOpen] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  const topics = [
    {
      id: 'kegiatan_hari_ini',
      label: '🌸 Kegiatan Hari Ini di Sekolah',
      response: 'Hari ini di TK Asy Syifa, anak-anak diajak menyiram Bunga Kamboja di taman, murojaah Surah An-Naba, dan bermain miniatur balok kayu di Sentra Balok. Suasana hangat dan gembira sekali!'
    },
    {
      id: 'info_ppdb',
      label: '🏫 Pendaftaran PPDB 2026/2027',
      response: 'Pendaftaran PPDB TK Asy Syifa Gelombang 1 sedang berlangsung! Kuota terbatas untuk Kelompok A & B. Pendaftaran bisa dilakukan secara online atau langsung di gerbang sekolah.'
    },
    {
      id: 'cerita_ananda',
      label: '📖 Dongeng & Cerita Islami Ananda',
      response: 'Asy punya banyak cerita kebaikan tentang kasih sayang Rasulullah, indahnya bersedekah, dan keberanian para nabi. Cocok dibacakan Ayah & Bunda sebelum tidur!'
    },
    {
      id: 'murojaah_surah',
      label: '🕌 Murojaah Surah An-Naba Cilik',
      response: 'MasyAllah, hafalan ananda di TK Asy Syifa semakin lancar. Asy dengan senang hati menyimak bacaan hafalan juz 30 ananda kapan saja!'
    }
  ];

  const handleOpenDoor = () => {
    setIsDoorOpen(true);
    setSelectedTopic(null);
  };

  const handleCloseDoor = () => {
    setIsDoorOpen(false);
    setSelectedTopic(null);
  };

  const handleSelectTopic = (topicId: string) => {
    setIsAnswering(true);
    setSelectedTopic(topicId);
    setTimeout(() => {
      setIsAnswering(false);
    }, 600);
  };

  const activeTopicObj = topics.find(t => t.id === selectedTopic);

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Storybook Garden Environment Container */}
      <div className="bg-gradient-to-b from-teal-900 via-emerald-950 to-green-950 text-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400/80 shadow-2xl relative overflow-hidden">
        
        {/* Background Nature Elements (Trees, Sky, Butterflies) */}
        <div className="absolute top-2 left-6 text-2xl animate-bounce">🦋</div>
        <div className="absolute top-4 right-10 text-xl animate-pulse">🌸</div>
        <div className="absolute bottom-2 left-10 text-2xl opacity-60">🌾</div>
        <div className="absolute bottom-2 right-12 text-2xl opacity-60">🌿</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-emerald-700/60 pb-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
              <Home className="w-3.5 h-3.5 fill-slate-950" /> WR-24 WORLD REBUILD • LOKASI RUMAH AI ASY
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
              Rumah Kecil AI Asy di Taman Asri TK Asy Syifa
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-xl">
              AI Asy bukan sekadar widget, melainkan penghuni asli taman sekolah. Ketuk pintu rumah kayu untuk menyapa AI Asy!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isDoorOpen ? (
              <button
                onClick={handleOpenDoor}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs transition shadow-xl cursor-pointer flex items-center gap-2 border-2 border-amber-300 transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Ketuk Pintu & Panggil AI Asy</span>
              </button>
            ) : (
              <button
                onClick={handleCloseDoor}
                className="px-5 py-2.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 border border-emerald-500 font-black rounded-2xl text-xs transition cursor-pointer flex items-center gap-2"
              >
                <span>Masuk Rumah / Tutup Pintu</span>
              </button>
            )}
          </div>
        </div>

        {/* Little House Visual Representation */}
        <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* House Graphic Frame */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-64 sm:w-72 h-80 bg-gradient-to-b from-amber-950 to-emerald-950 rounded-t-full border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-end p-4 overflow-hidden">
              
              {/* Roof & Chimney Accent */}
              <div className="absolute top-0 inset-x-0 h-10 bg-amber-800/80 border-b-2 border-amber-400 flex items-center justify-center text-xs font-black text-amber-200 uppercase tracking-widest">
                🏡 RUMAH AI ASY
              </div>

              {/* Garden Flowers in Front of House */}
              <div className="absolute bottom-2 inset-x-4 flex justify-between text-lg pointer-events-none z-20">
                <span>🌸</span>
                <span>🌼</span>
                <span>🌺</span>
                <span>🌸</span>
              </div>

              {/* Wooden Door Frame */}
              <div className="relative w-36 h-52 bg-amber-900 border-4 border-amber-300 rounded-t-full flex flex-col items-center justify-center overflow-hidden shadow-inner">
                
                {/* When Door is Closed */}
                {!isDoorOpen ? (
                  <button
                    onClick={handleOpenDoor}
                    className="w-full h-full bg-gradient-to-b from-amber-900 to-amber-950 flex flex-col items-center justify-center gap-3 p-3 transition hover:brightness-110 cursor-pointer group"
                  >
                    <div className="w-4 h-4 rounded-full bg-amber-300 border border-amber-500 shadow-md group-hover:scale-125 transition" />
                    <span className="text-[10px] font-black text-amber-200 text-center leading-tight bg-amber-950/80 px-2 py-1 rounded-md border border-amber-400/50">
                      🚪 Ketuk Pintu
                    </span>
                  </button>
                ) : (
                  /* When Door is Open: AI Asy Steps Out onto Porch! */
                  <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-end p-2 animate-fade-in relative">
                    <div className="w-24 h-32 mb-1">
                      <AIAsyCharacterRenderer state="wave" scale={1.05} />
                    </div>
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md shadow-lg border border-amber-300">
                      AI Asy Keluar 👋
                    </span>
                  </div>
                )}
              </div>
            </div>
            <span className="text-[11px] text-emerald-200 font-bold mt-2">
              Jalan Batu & Taman Bunga Kamboja TK Asy Syifa
            </span>
          </div>

          {/* Interactive Dialogue Frame when AI Asy is Outside */}
          <div className="lg:col-span-7 space-y-4">
            {!isDoorOpen ? (
              <div className="p-6 bg-emerald-900/60 rounded-3xl border-2 border-emerald-600/50 space-y-3 text-center lg:text-left">
                <span className="text-3xl block">🌙</span>
                <h3 className="text-lg font-black text-amber-200">
                  Pintu Rumah AI Asy Sedang Tertutup
                </h3>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  Silakan ketuk pintu rumah kayu di samping untuk memanggil AI Asy keluar dan berbincang-bincang hangat.
                </p>
              </div>
            ) : (
              <div className="p-6 bg-white text-slate-900 rounded-3xl border-4 border-amber-400 shadow-2xl space-y-5 animate-fade-in">
                {/* Greeting Bubble */}
                <div className="flex items-start gap-3 border-b border-stone-200 pb-4">
                  <div className="w-14 h-16 shrink-0 flex items-center justify-center">
                    <AIAsyCharacterRenderer state="happy" scale={0.9} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-md">
                      AI Asy Menyapa
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-stone-800 italic leading-snug">
                      "Assalamu'alaikum Ayah & Bunda! 🌸 Selamat datang di Rumah Kecil Asy. Silakan pilih topik yang ingin kita perbincangkan:"
                    </p>
                  </div>
                </div>

                {/* Topic Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {topics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTopic(t.id)}
                      className={`p-3 rounded-2xl text-xs font-black text-left transition cursor-pointer border ${
                        selectedTopic === t.id
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                          : 'bg-stone-50 hover:bg-emerald-50 text-stone-800 border-stone-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Selected Topic Answer */}
                {selectedTopic && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Jawaban Ramah AI Asy:
                      </span>
                      {isAnswering && <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />}
                    </div>

                    <p className="text-xs text-stone-800 font-medium leading-relaxed italic">
                      "{activeTopicObj?.response}"
                    </p>

                    {selectedTopic === 'info_ppdb' && onTabChange && (
                      <div className="pt-2">
                        <button
                          onClick={() => onTabChange('w4PPDB')}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Buka Gerbang Pendaftaran PPDB</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
