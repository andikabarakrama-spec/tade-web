import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Smile,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sliders,
  ShieldCheck,
  Zap,
  ChevronRight,
  Sun,
  Moon,
  School,
  Tv,
  Film,
  Compass,
  CheckCircle2,
  Stamp,
  Award,
  Layers,
  Star
} from 'lucide-react';
import {
  perpustakaanAjaibEngine,
  LibraryPhase,
  LibrarySnapshot,
  StoryItem
} from '../../services/perpustakaanAjaibEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface PerpustakaanAjaibHubProps {
  onNavigateToTvAsy?: () => void;
  onNavigateToBioskopLangit?: () => void;
  onNavigateToRumahKreatif?: () => void;
  onNavigateToLorongKenangan?: () => void;
  onNavigateToKelasHidup?: () => void;
  onNavigateToPulangCeria?: () => void;
  onNavigateToAulaImpian?: () => void;
}

export const PerpustakaanAjaibHub: React.FC<PerpustakaanAjaibHubProps> = ({
  onNavigateToTvAsy,
  onNavigateToBioskopLangit,
  onNavigateToRumahKreatif,
  onNavigateToLorongKenangan,
  onNavigateToKelasHidup,
  onNavigateToPulangCeria,
  onNavigateToAulaImpian
}) => {
  const [snapshot, setSnapshot] = useState<LibrarySnapshot>(perpustakaanAjaibEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'STORIES' | 'PASSPORT' | 'FOUNDER'>('EXPLORE');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());
  const allStories = perpustakaanAjaibEngine.getStories();

  useEffect(() => {
    const unsub = perpustakaanAjaibEngine.subscribe(() => {
      setSnapshot(perpustakaanAjaibEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleSelectPhase = (phase: LibraryPhase) => {
    perpustakaanAjaibEngine.setPhase(phase);
  };

  const handleToggleAutoPlay = () => {
    if (snapshot.isAutoPlayingLibrary) {
      perpustakaanAjaibEngine.stopFullLibrarySimulation();
    } else {
      perpustakaanAjaibEngine.startFullLibrarySimulation();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-amber-500/20 px-4 py-3 sticky top-0 z-40 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <BookOpen className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                Perpustakaan Ajaib & Kereta Buku TK Asy Syifa
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sprint G36
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-current" /> Petualangan Membaca 3D
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Pintu Hidup • Kereta Buku Keliling • Rak Hidup • Pojok Dongeng 20s • Buku Doa & Hijaiyah • Paspor Membaca
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('EXPLORE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'EXPLORE'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🚂 Wahana Baca</span>
            </button>
            <button
              onClick={() => setActiveTab('STORIES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'STORIES'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📖 Pojok Dongeng (20s)</span>
            </button>
            <button
              onClick={() => setActiveTab('PASSPORT')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'PASSPORT'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎫 Paspor Kenangan</span>
            </button>
            <button
              onClick={() => setActiveTab('FOUNDER')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'FOUNDER'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Founder Cockpit
            </button>
          </div>

          <button
            onClick={handleToggleAutoPlay}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
              snapshot.isAutoPlayingLibrary
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {snapshot.isAutoPlayingLibrary ? (
              <>
                <Pause className="w-4 h-4" /> Pause Petualangan
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Putar Keliling (P1-P6)
              </>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN LIVING LIBRARY STAGE WITH BONUS AMBIENCE
      ========================================================= */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-950 p-4 sm:p-6 flex flex-col justify-between">
        {/* Bonus Ambience 1: Cute Little Owl (Burung hantu kecil lucu) */}
        <motion.div
          animate={{ y: [-4, 4, -4], rotate: [-4, 4, -4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-12 text-3xl pointer-events-none z-10 filter drop-shadow"
          title="Burung hantu cilik penjaga buku bijak"
        >
          🦉
        </motion.div>

        {/* Bonus Ambience 2: Warm Reading Lamp (Lampu baca berpendar hangat) */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-14 text-3xl pointer-events-none z-10"
          title="Lampu baca hangat berpendar keemasan"
        >
          💡
        </motion.div>

        {/* Bonus Ambience 3: Book Star (Bintang buku bercahaya) */}
        <motion.div
          animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-1/4 text-2xl pointer-events-none z-10"
          title="Bintang inspirasi membaca"
        >
          ⭐
        </motion.div>

        {/* Bonus Ambience 4: Living Bookmark Ribbon (Pembatas buku pita hidup) */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 right-1/3 text-2xl pointer-events-none z-10"
          title="Pembatas buku pita merah muda ramah"
        >
          🔖
        </motion.div>

        {/* =====================================================
            TAB 1: WAHANA BACA & ALUR LENGKAP P1 - P6
        ===================================================== */}
        {activeTab === 'EXPLORE' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            {/* Phase Selector Ribbon */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80">
              {[
                { id: 'MAGIC_DOOR', label: 'P1: Pintu Hidup', emoji: '🚪' },
                { id: 'BOOK_TRAIN', label: 'P2: Kereta Buku', emoji: '🚂' },
                { id: 'LIVING_SHELVES', label: 'P3: Rak Hidup', emoji: '📚' },
                { id: 'STORY_CORNER', label: 'P4: Pojok Dongeng', emoji: '📖' },
                { id: 'PRAYER_BOOKS', label: 'P5: Buku Doa', emoji: '🤲' },
                { id: 'READING_PASSPORT', label: 'P6: Paspor Cap', emoji: '🎫' }
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handleSelectPhase(phase.id as LibraryPhase)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    snapshot.currentPhase === phase.id
                      ? 'bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 text-slate-950 shadow-lg border border-amber-300 scale-105'
                      : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">{phase.emoji}</span>
                  <span className="text-[11px] truncate w-full text-center">{phase.label}</span>
                </button>
              ))}
            </div>

            {/* Living Stage Canvas */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden backdrop-blur">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* =================================================
                  P1: PINTU PERPUSTAKAAN HIDUP
              ================================================= */}
              {snapshot.currentPhase === 'MAGIC_DOOR' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P1 — Pintu Perpustakaan Hidup & Salam Hangat
                    </span>
                    <button
                      onClick={() => perpustakaanAjaibEngine.playPageTurnChime()}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Buka Pintu Ajaib
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4 min-h-[260px] flex flex-col justify-center items-center">
                      <div className="relative flex items-center justify-center">
                        <motion.div
                          animate={{ rotateY: [0, 45, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          className="text-6xl text-amber-300 filter drop-shadow"
                        >
                          🚪
                        </motion.div>
                        <span className="absolute -top-3 -right-8 px-2.5 py-0.5 bg-emerald-400 text-slate-900 font-black text-[10px] rounded-full shadow">
                          Bismillah...
                        </span>
                      </div>

                      <div className="p-3.5 bg-amber-950/40 rounded-2xl border border-amber-500/30 text-xs text-amber-200">
                        <p className="font-bold">Buku Ajaib Tersenyum & Berkata:</p>
                        <p className="italic mt-1 text-sm text-white font-serif">
                          “Selamat datang di Perpustakaan Ajaib TK Asy Syifa! Mari kita membaca dan menjelajah dunia ilmu penuh berkah.”
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 italic">
                        Aroma wangi kertas bersih dan suasana tenang menyejukkan hati menyambut langkah setiap santri.
                      </p>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-2 text-xs">
                        <strong className="text-amber-300 block">Adab Masuk Perpustakaan:</strong>
                        <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                          <li>Membaca Bismillah dan melangkah dengan kaki kanan.</li>
                          <li>Menjaga ketenangan dan berbicara dengan suara lembut.</li>
                          <li>Memastikan tangan bersih sebelum memegang buku.</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('BOOK_TRAIN')}
                        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju Kereta Buku Keliling (P2)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P2: KERETA BUKU KELILING SEKOLAH
              ================================================= */}
              {snapshot.currentPhase === 'BOOK_TRAIN' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      P2 — Kereta Buku Keliling Sekolah
                    </span>
                    <button
                      onClick={() => perpustakaanAjaibEngine.playTrainWhistleSound()}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Bunyikan Klakson Kereta
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                      <div className="relative py-4 flex items-center justify-center overflow-hidden">
                        <motion.div
                          animate={{ x: [-120, 120, -120] }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                          className="flex items-center gap-2 text-4xl"
                        >
                          <span>🚂</span>
                          <span>📚</span>
                          <span>📖</span>
                          <span>📕</span>
                        </motion.div>
                      </div>

                      <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 font-medium">
                        Klakson Kereta Berbunyi: <span className="font-bold text-white">“Tuut... Tuut... Buku bergambar baru telah tiba!”</span>
                        <p className="mt-1 text-slate-300 italic">Kereta kayu mini meluncur santun mengantarkan buku ke setiap sudut kelas dan halaman sekolah.</p>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 text-xs">
                        <strong className="text-emerald-300 block">Jadwal Kereta Buku:</strong>
                        <p className="text-slate-300 leading-relaxed">
                          Kereta buku keliling memudahkan santri meminjam dan membaca buku favorit saat waktu istirahat dan sentra membaca.
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('LIVING_SHELVES')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju Rak Buku Hidup (P3)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P3: RAK BUKU HIDUP
              ================================================= */}
              {snapshot.currentPhase === 'LIVING_SHELVES' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      P3 — Rak Buku Hidup & Halaman Terbuka
                    </span>
                    <span className="text-xs text-indigo-300 font-bold">
                      Buku Tersenyum & Interaktif
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl">
                        📕✨
                      </motion.div>
                      <h4 className="text-xs font-black text-indigo-300">Buku Fabel Satwa Ceria</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Halaman membuka sendiri menampilkan burung Bubu dan kelinci Mimi yang sedang tolong-menolong.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 2.4, repeat: Infinity }} className="text-4xl">
                        📗🌟
                      </motion.div>
                      <h4 className="text-xs font-black text-indigo-300">Buku Sains Alam & Langit</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Ilustrasi awan hujan dan pelangi mini memancarkan pendar cahaya keemasan yang memikat.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="text-4xl">
                        📘🤲
                      </motion.div>
                      <h4 className="text-xs font-black text-indigo-300">Buku Adab Santri Sholeh</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Mengajarkan senyuman, salam, dan tutur kata santun kepada orang tua dan guru.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('STORY_CORNER')}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Pojok Dongeng 20s (P4)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P4: POJOK DONGENG (20 DETIK)
              ================================================= */}
              {snapshot.currentPhase === 'STORY_CORNER' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      P4 — Pojok Dongeng Asy & Syifa (20 Detik)
                    </span>
                    <button
                      onClick={() => perpustakaanAjaibEngine.playPageTurnChime()}
                      className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Narasi Dongeng
                    </button>
                  </div>

                  <div className="bg-slate-900/90 p-6 rounded-3xl border border-rose-500/30 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{snapshot.activeStory.icon}</span>
                      <div>
                        <h3 className="text-sm font-black text-white">{snapshot.activeStory.title}</h3>
                        <p className="text-xs text-rose-300 font-bold">Dikisahkan oleh: {snapshot.activeStory.narrator}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-500/30 text-xs text-rose-100 italic leading-relaxed">
                      {snapshot.activeStory.synopsis}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {allStories.map((story) => (
                        <button
                          key={story.id}
                          onClick={() => perpustakaanAjaibEngine.selectStory(story.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            snapshot.activeStory.id === story.id
                              ? 'bg-rose-500 text-slate-950 font-black shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {story.icon} {story.title.split('&')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('PRAYER_BOOKS')}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Buku Doa & Hijaiyah (P5)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P5: BUKU DOA, HIJAIYAH & KISAH NABI
              ================================================= */}
              {snapshot.currentPhase === 'PRAYER_BOOKS' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      P5 — Buku Doa Harian, Hijaiyah & Kisah Nabi
                    </span>
                    <button
                      onClick={() => perpustakaanAjaibEngine.playPageTurnChime()}
                      className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Buka Halaman Doa
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 space-y-3 text-center">
                      <span className="text-4xl block">🤲</span>
                      <h4 className="text-xs font-black text-teal-300">Doa Harian Santri</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Doa sebelum makan, doa bangun tidur, dan doa kebaikan untuk kedua orang tua.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 space-y-3 text-center">
                      <span className="text-4xl block">🔤</span>
                      <h4 className="text-xs font-black text-teal-300">Huruf Hijaiyah Ceria</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Mengenal Alif, Ba, Ta, Tsa dengan ilustrasi benda di sekitar dan rima yang ceria.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 space-y-3 text-center">
                      <span className="text-4xl block">📜</span>
                      <h4 className="text-xs font-black text-teal-300">Kisah Teladan 25 Nabi</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Meneladani kejujuran, kesabaran, dan kasih sayang para Rasul utusan Allah SWT.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('READING_PASSPORT')}
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Paspor Membaca Ceria (P6)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P6: PASPOR MEMBACA CERIA
              ================================================= */}
              {snapshot.currentPhase === 'READING_PASSPORT' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      P6 — Paspor Membaca: Cap Kenangan Tanpa Skor & Ranking
                    </span>
                    <button
                      onClick={() => perpustakaanAjaibEngine.addReadingStamp('Petualangan Buku Baru')}
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Stamp className="w-3.5 h-3.5" /> Beri Cap Stempel
                    </button>
                  </div>

                  <div className="bg-slate-900/90 p-6 rounded-3xl border border-purple-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-400" />
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          Koleksi Cap Kenangan Membaca Santri ({snapshot.readingStampsCount})
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-500/30">
                        100% Apresiasi Kasih Sayang
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {snapshot.unlockedStamps.map((stamp, idx) => (
                        <div key={idx} className="p-3 bg-purple-950/40 rounded-2xl border border-purple-500/30 text-center space-y-1">
                          <span className="text-2xl block">🏵️</span>
                          <span className="text-xs font-black text-purple-200">{stamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('MAGIC_DOOR')}
                      className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Ulangi Petualangan Baca (P1)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: DETAIL POJOK DONGENG
        ===================================================== */}
        {activeTab === 'STORIES' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                P4 — Katalog Dongeng & Kisah Hikmah
              </span>
              <h2 className="text-xl font-black text-white">
                Kisah Indah Penggugah Budi Pekerti
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => perpustakaanAjaibEngine.selectStory(story.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    snapshot.activeStory.id === story.id
                      ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/40 shadow-xl'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{story.icon}</span>
                    <div>
                      <h3 className="text-sm font-black text-white">{story.title}</h3>
                      <span className="text-xs text-rose-300 font-bold">{story.narrator}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed italic">
                    {story.synopsis}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: DETAIL PASPOR MEMBACA
        ===================================================== */}
        {activeTab === 'PASSPORT' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                P6 — Paspor Membaca Santri TK Asy Syifa
              </span>
              <h2 className="text-xl font-black text-white">
                Setiap Lembar Buku adalah Langkah Kebaikan
              </h2>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Paspor membaca dirancang untuk menumbuhkan kecintaan literasi sejak dini dengan memberikan stempel apresiasi kenangan indah tanpa perbandingan antar anak.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {snapshot.unlockedStamps.map((s, i) => (
                  <div key={i} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 text-center space-y-1">
                    <span className="text-3xl block">⭐</span>
                    <span className="text-xs font-bold text-amber-300">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P7 — FOUNDER LIBRARY CONTROL COCKPIT
        ===================================================== */}
        {activeTab === 'FOUNDER' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20">
                    🏛️
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">
                      Founder Library Control Cockpit (P7)
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Uji Kereta Buku, Uji Suara Instrumen, Simulasi Dongeng, Audit Black Box Ring-0
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Sprint G36 Verifier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Audio Synthesizer Tester */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Uji Audio Sintesis Perpustakaan
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => perpustakaanAjaibEngine.playTrainWhistleSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-emerald-950/40 text-emerald-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🚂 Klakson Kereta Buku</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => perpustakaanAjaibEngine.playPageTurnChime()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-amber-950/40 text-amber-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>📖 Denting Halaman Ajaib</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => perpustakaanAjaibEngine.playStampSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-purple-950/40 text-purple-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🎫 Cap Stempel Paspor</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Ecosystem Connectors */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Integrasi Ekosistem Wajib
                  </span>
                  <div className="space-y-2">
                    {onNavigateToTvAsy && (
                      <button
                        onClick={onNavigateToTvAsy}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>📺 TV Asy & Syifa</span>
                        <Tv className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToBioskopLangit && (
                      <button
                        onClick={onNavigateToBioskopLangit}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🌌 Bioskop Langit</span>
                        <Film className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToPulangCeria && (
                      <button
                        onClick={onNavigateToPulangCeria}
                        className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🌅 Pulang Ceria (G35)</span>
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToAulaImpian && (
                      <button
                        onClick={onNavigateToAulaImpian}
                        className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🏛️ Aula Impian (G37)</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Black Box Telemetry */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                  <span className="text-xs font-black text-slate-200 block">
                    Audit Ring-0 & Library Sync
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Petualangan membaca terintegrasi dengan DNA G20, Kamera G21, dan telemetri Black Box Ring-0.
                  </p>
                  <span className="inline-block text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Marker: G36_PERPUSTAKAAN_AJAIB_VERIFIED
                  </span>
                </div>
              </div>

              {/* Performance Telemetry */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                      Dr. Pulse 60 FPS & Animation Governor
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">60.0 FPS • STABLE</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Slot Animasi Aktif:</span>
                    <span className="text-sm font-black text-emerald-300">{governorSlots} / 5</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Fase Perpustakaan:</span>
                    <span className="text-sm font-black text-amber-400">{snapshot.currentPhase}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Kereta Bergerak:</span>
                    <span className="text-sm font-black text-teal-300">
                      {snapshot.isTrainMoving ? 'BERJALAN' : 'DI STASIUN'}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Auto-Play Membaca:</span>
                    <span className="text-sm font-black text-purple-300">
                      {snapshot.isAutoPlayingLibrary ? 'AKTIF' : 'STANDBY'}
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

export default PerpustakaanAjaibHub;
