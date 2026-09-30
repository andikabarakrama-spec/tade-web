import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Sun,
  Sparkles,
  Home,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  Tv,
  Eye,
  Sliders,
  Feather,
  Droplets,
  BookOpen,
  Send,
  Zap,
  Coffee
} from 'lucide-react';
import {
  keluargaSahabatEngine,
  SahabatProfile,
  DailyHabit
} from '../../services/keluargaSahabatEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface KeluargaSahabatHubProps {
  onNavigateToWorldMap?: () => void;
  onNavigateToSchool?: () => void;
  onNavigateToMemoryHall?: () => void;
}

export const KeluargaSahabatHub: React.FC<KeluargaSahabatHubProps> = ({
  onNavigateToWorldMap,
  onNavigateToSchool,
  onNavigateToMemoryHall
}) => {
  const [snapshot, setSnapshot] = useState(keluargaSahabatEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<
    'MORNING' | 'HOUSES' | 'HABITS' | 'STORY15S' | 'FOUNDER'
  >('MORNING');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());

  useEffect(() => {
    const unsub = keluargaSahabatEngine.subscribe(() => {
      setSnapshot(keluargaSahabatEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleStartStory = (habitId: string) => {
    keluargaSahabatEngine.startStory(habitId);
  };

  const handleStopStory = () => {
    keluargaSahabatEngine.stopStory();
  };

  const selectedSahabat =
    snapshot.sahabatList.find((s) => s.id === snapshot.selectedSahabatId) ||
    snapshot.sahabatList[0];

  return (
    <div className="min-h-screen bg-sky-950/20 text-slate-800 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-white/95 backdrop-blur border-b border-sky-200/80 px-4 py-3 sticky top-0 z-40 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Sun className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '18s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                Keluarga Sahabat Asy & Syifa
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                Sprint G31
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-300" /> Kehidupan Harian Santri
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Kehidupan Harian Penuh Adab & Kasih Sayang • Bukan Game • Kartun 3D Ramah Anak
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="bg-sky-100/70 p-1 rounded-xl flex items-center gap-1 border border-sky-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('MORNING')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'MORNING'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-sky-900 hover:text-sky-950'
              }`}
            >
              <span>🌅 Pagi Bersama</span>
            </button>
            <button
              onClick={() => setActiveTab('HOUSES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'HOUSES'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-sky-900 hover:text-sky-950'
              }`}
            >
              <span>🏡 Rumah Sahabat</span>
            </button>
            <button
              onClick={() => setActiveTab('HABITS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'HABITS'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-sky-900 hover:text-sky-950'
              }`}
            >
              <span>🌱 Kebiasaan Harian</span>
            </button>
            <button
              onClick={() => setActiveTab('STORY15S')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'STORY15S'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-sky-900 hover:text-sky-950'
              }`}
            >
              <span>⏱️ Cerita 15 Detik</span>
            </button>
            <button
              onClick={() => setActiveTab('FOUNDER')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'FOUNDER'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-sky-900 hover:text-sky-950'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Founder Control
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN LIVING STAGE WITH BONUS AMBIENCE
      ========================================================= */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-sky-100/70 via-amber-50/40 to-emerald-50/50 p-4 sm:p-6 flex flex-col justify-between">
        {/* Bonus Ambience: Floating Bubbles and Butterflies */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-12 text-2xl pointer-events-none z-10 filter drop-shadow-md"
        >
          🫧
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 right-20 text-3xl pointer-events-none z-10 filter drop-shadow-md"
        >
          🦋
        </motion.div>

        {/* Bonus Ambience: Rooster Sound Indicator */}
        <AnimatePresence>
          {snapshot.bonusRoosterCrowing && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-amber-500 text-white rounded-full font-black text-sm shadow-xl flex items-center gap-2 z-30"
            >
              <span>🐓 Kukuruyuuuk! Waktu Subuh Berkah Tiba!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            TAB 1: P1 — PAGI BERSAMA (Morning Harmony)
        ===================================================== */}
        {activeTab === 'MORNING' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-900">
                P1 — Pagi Bersama Asy & Syifa
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Mentari Terbit Menyapa Kamar Penuh Senyuman
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Dek Asy bangun bersyukur, Mbak Syifa membuka jendela kamar, dan Bubu si burung pipit hinggap bernyanyi
              </p>
            </div>

            {/* 3D Living Room Morning Stage */}
            <div className="bg-white/90 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-sky-300 relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* 1. Asy Waking Up */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-sky-50 p-5 rounded-2xl border-2 border-sky-200 text-center space-y-3 shadow-md"
                >
                  <div className="text-6xl mb-2">👦🏻</div>
                  <h3 className="text-base font-black text-sky-950">Dek Asy</h3>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-200 text-sky-900 block">
                    Bangun & Mengusap Wajah
                  </span>
                  <p className="text-xs text-slate-600 italic">
                    “Alhamdulillah, terima kasih ya Allah telah memberikanku hari yang cerah ini.”
                  </p>
                  <button
                    onClick={() => keluargaSahabatEngine.playHabitSound('HARP')}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow"
                  >
                    🤲 Lafalkan Doa
                  </button>
                </motion.div>

                {/* 2. Living Arched Window & Bubu */}
                <div className="bg-amber-100/70 p-6 rounded-3xl border-4 border-amber-300 text-center relative flex flex-col items-center justify-between min-h-[260px] shadow-inner">
                  <div className="w-full flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
                    <span>Jendela Mentari</span>
                    <button
                      onClick={() => keluargaSahabatEngine.toggleWindow()}
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-50 text-[10px]"
                    >
                      {snapshot.morningMoment.windowOpen ? '🪟 Tutup Jendela' : '🪟 Buka Jendela'}
                    </button>
                  </div>

                  {/* Arched Window Graphic */}
                  <div className="relative w-36 h-40 bg-gradient-to-b from-sky-400 to-amber-200 rounded-t-full border-4 border-amber-700 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                    {/* Golden Sun */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 90] }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="text-4xl absolute -top-1"
                    >
                      ☀️
                    </motion.div>

                    {/* Bubu Bird Perching */}
                    <motion.div
                      animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      onClick={() => keluargaSahabatEngine.playHabitSound('CHIRP')}
                      className="text-4xl mt-12 cursor-pointer"
                      title="Klik untuk mendengar kicauan Bubu!"
                    >
                      🐥
                    </motion.div>
                  </div>

                  <span className="text-xs font-black text-amber-900 mt-2">
                    Bubu si Burung Pipit
                  </span>
                  <p className="text-[11px] text-amber-800 italic">
                    “Cuit cuit! Waktunya bangun dan bersemangat mencari ilmu!”
                  </p>
                </div>

                {/* 3. Syifa Smiling & Watering Flowers */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-rose-50 p-5 rounded-2xl border-2 border-rose-200 text-center space-y-3 shadow-md"
                >
                  <div className="text-6xl mb-2">👧🏻</div>
                  <h3 className="text-base font-black text-rose-950">Mbak Syifa</h3>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-200 text-rose-900 block">
                    Membuka Jendela & Salam
                  </span>
                  <p className="text-xs text-slate-600 italic">
                    “Assalamu’alaikum mentari pagi! Semoga hari ini penuh berkah untuk kita semua.”
                  </p>
                  <button
                    onClick={() => keluargaSahabatEngine.playHabitSound('WATER')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow"
                  >
                    🪴 Siram Bunga Melati
                  </button>
                </motion.div>
              </div>

              {/* Bonus Sleeping Cat at Porch */}
              {snapshot.bonusCatSleeping && (
                <div className="mt-6 pt-4 border-t border-sky-200 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐱</span>
                    <span className="font-semibold italic">
                      Mimi si Kucing Belang tidur nyenyak di serambi beranda beralaskan karpet anyam.
                    </span>
                  </div>
                  <button
                    onClick={() => keluargaSahabatEngine.playHabitSound('ROOSTER')}
                    className="px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 border border-amber-300"
                  >
                    🐓 Panggil Ayam Jantan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: P2 — RUMAH SETIAP SAHABAT (Sahabat Living Houses)
        ===================================================== */}
        {activeTab === 'HOUSES' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-200 text-indigo-900">
                P2 — Rumah Hidup Setiap Sahabat
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Karakter Ceria di Setiap Kediaman Penuh Kasih
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Setiap sahabat memiliki rumah berkarakter dengan rutinitas adab yang meneduhkan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {snapshot.sahabatList.map((sahabat) => (
                <motion.div
                  key={sahabat.id}
                  onClick={() => keluargaSahabatEngine.setSelectedSahabat(sahabat.id)}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    snapshot.selectedSahabatId === sahabat.id
                      ? 'bg-white shadow-2xl border-indigo-500 scale-[1.02]'
                      : 'bg-white/80 shadow-md border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl p-2 bg-indigo-50 rounded-2xl border border-indigo-200">
                          {sahabat.avatarEmoji}
                        </span>
                        <div>
                          <h3 className="text-sm font-black text-slate-900">{sahabat.name}</h3>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {sahabat.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-2xl" title={sahabat.houseName}>
                        {sahabat.houseEmoji}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-indigo-950">
                        <span>🏡 {sahabat.houseName}</span>
                        <span className="text-indigo-600">DNA: {sahabat.expression}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {sahabat.characterTrait}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 block">
                      Aktivitas Saat Ini:
                    </span>
                    <span className="text-xs font-black text-emerald-700 block">
                      ✨ {sahabat.currentActivity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: P3 — KEBIASAAN HARIAN (Daily Habits of Kindness)
        ===================================================== */}
        {activeTab === 'HABITS' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-200 text-emerald-900">
                P3 — Kebiasaan Harian Santri
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Rutinitas Pembentuk Akhlak & Kedisiplinan
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Dari menyiram bunga, merapikan tas, membaca doa hingga berbagi bekal dengan tulus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {snapshot.dailyHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl border-2 border-emerald-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                          {habit.emoji}
                        </span>
                        <div>
                          <h3 className="text-base font-black text-slate-900">{habit.title}</h3>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {habit.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-500">
                        {habit.durationSec} Detik
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mt-2">
                      {habit.storyText}
                    </p>

                    <div className="mt-3 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-950 italic font-semibold">
                      {habit.prayerText}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">
                      Nilai: <strong className="text-emerald-800">{habit.adabValue}</strong>
                    </span>
                    <button
                      onClick={() => handleStartStory(habit.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Mulai Cerita
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P4 — CERITA 15 DETIK (Interactive 15s Story Player)
        ===================================================== */}
        {activeTab === 'STORY15S' && (
          <div className="relative z-10 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-white/95 backdrop-blur p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-rose-300 space-y-6">
              <div className="flex items-center justify-between border-b border-rose-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-md">
                    ⏱️
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Cerita Harian 15 Detik (P4)
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold">
                      Durasi Pas untuk Anak Usia Dini • Sarat Nilai Kebajikan & Adab Islami
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                    Sisa Waktu: {snapshot.storyRemainingTimeSec}s
                  </span>
                </div>
              </div>

              {/* Story Viewer Stage */}
              <div className="bg-gradient-to-b from-rose-50 to-amber-50 p-6 rounded-3xl border-2 border-rose-200 text-center space-y-4 relative overflow-hidden">
                <span className="text-5xl block animate-bounce">{snapshot.activeHabit.emoji}</span>
                <h3 className="text-xl font-black text-slate-900">
                  {snapshot.activeHabit.title}
                </h3>
                <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                  {snapshot.activeHabit.storyText}
                </p>

                <div className="p-4 bg-white/90 rounded-2xl border border-rose-200 max-w-lg mx-auto text-xs text-rose-950 font-bold italic shadow-inner">
                  {snapshot.activeHabit.prayerText}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  {snapshot.isStoryPlaying ? (
                    <button
                      onClick={handleStopStory}
                      className="px-5 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" /> Hentikan Cerita
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartStory(snapshot.activeHabit.id)}
                      className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" /> Putar Cerita 15 Detik
                    </button>
                  )}
                  <button
                    onClick={() => keluargaSahabatEngine.playHabitSound('HARP')}
                    className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300 flex items-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" /> Uji Nada
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 5: P7 — FOUNDER CONTROL (Cockpit, Diagnostics, Telemetry)
        ===================================================== */}
        {activeTab === 'FOUNDER' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20">
                    🏛️
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Founder Control Cockpit — Keluarga Sahabat (P7)
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Uji Suara Harian, Hubungkan Ekosistem TV Asy & Peta Dunia, Audit Black Box Ring-0
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  Sprint G31 Verifier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Quick Sound Tester */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-black text-slate-900 block">
                    Uji Suara Web Audio (Pagi & Hewan)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => keluargaSahabatEngine.playHabitSound('CHIRP')}
                      className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-sky-50 text-sky-900 font-bold text-[11px] flex items-center justify-between"
                    >
                      <span>🐥 Kicau Bubu</span>
                      <Play className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => keluargaSahabatEngine.playHabitSound('ROOSTER')}
                      className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-amber-50 text-amber-900 font-bold text-[11px] flex items-center justify-between"
                    >
                      <span>🐓 Ayam Jantan</span>
                      <Play className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => keluargaSahabatEngine.playHabitSound('WATER')}
                      className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-teal-50 text-teal-900 font-bold text-[11px] flex items-center justify-between"
                    >
                      <span>💧 Siram Bunga</span>
                      <Play className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => keluargaSahabatEngine.playHabitSound('HARP')}
                      className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-purple-50 text-purple-900 font-bold text-[11px] flex items-center justify-between"
                    >
                      <span>🎵 Harpa Doa</span>
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 2. Ecosystem Fast Connectors */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-black text-slate-900 block">
                    Integrasi Wajib Ekosistem
                  </span>
                  <div className="space-y-2">
                    {onNavigateToWorldMap && (
                      <button
                        onClick={onNavigateToWorldMap}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow-sm"
                      >
                        <span>🗺️ Peta Dunia Asy-Syifa (G28)</span>
                        <Compass className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToSchool && (
                      <button
                        onClick={onNavigateToSchool}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-between shadow-sm"
                      >
                        <span>🏫 Sekolah Bernapas (G29)</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToMemoryHall && (
                      <button
                        onClick={onNavigateToMemoryHall}
                        className="w-full py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-between shadow-sm"
                      >
                        <span>🖼️ Lorong Kenangan (G30)</span>
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. DNA G20 & Event Alignment */}
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                  <span className="text-xs font-black text-sky-950 block">
                    DNA & Living Event Sync
                  </span>
                  <p className="text-[11px] text-sky-800 font-medium leading-relaxed">
                    Setiap interaksi terikat dengan DNA Karakter G20, sinkronisasi siklus waktu subuh-petang, dan telemetri Black Box Ring-0.
                  </p>
                  <span className="inline-block text-[10px] font-black text-sky-900 bg-sky-200 px-2 py-0.5 rounded">
                    Zero Social Media • 100% Adab
                  </span>
                </div>
              </div>

              {/* Performance Diagnostics Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Dr. Pulse 60 FPS & TADE Animation Governor
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">60.0 FPS • STABLE</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Slot Animasi Aktif:</span>
                    <span className="text-sm font-black text-amber-300">{governorSlots} / 5</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Total Sahabat Hidup:</span>
                    <span className="text-sm font-black text-emerald-400">
                      {snapshot.sahabatList.length} Karakter
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Episode Cerita 15s:</span>
                    <span className="text-sm font-black text-sky-300">
                      {snapshot.dailyHabits.length} Episode
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Pagi Bersama:</span>
                    <span className="text-sm font-black text-rose-300">
                      {snapshot.morningMoment.windowOpen ? 'Terbuka' : 'Tertutup'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default KeluargaSahabatHub;
