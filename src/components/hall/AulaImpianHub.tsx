import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Smile,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sliders,
  Camera,
  Film,
  Tv,
  Star,
  Layers,
  Award,
  ChevronRight,
  Sun,
  PartyPopper,
  Zap,
  Music,
  BookOpen
} from 'lucide-react';
import {
  aulaImpianEngine,
  HallPhase,
  StageTheme,
  HallSnapshot
} from '../../services/aulaImpianEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface AulaImpianHubProps {
  onNavigateToTvAsy?: () => void;
  onNavigateToFestival?: () => void;
  onNavigateToSutradara?: () => void;
  onNavigateToKamera?: () => void;
  onNavigateToLorongKenangan?: () => void;
  onNavigateToPerpustakaan?: () => void;
  onNavigateToPawaiNusantara?: () => void;
}

export const AulaImpianHub: React.FC<AulaImpianHubProps> = ({
  onNavigateToTvAsy,
  onNavigateToFestival,
  onNavigateToSutradara,
  onNavigateToKamera,
  onNavigateToLorongKenangan,
  onNavigateToPerpustakaan,
  onNavigateToPawaiNusantara
}) => {
  const [snapshot, setSnapshot] = useState<HallSnapshot>(aulaImpianEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'THEMES' | 'GALLERY' | 'FOUNDER'>('EXPLORE');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());

  useEffect(() => {
    const unsub = aulaImpianEngine.subscribe(() => {
      setSnapshot(aulaImpianEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const currentThemeConfig = aulaImpianEngine.stageThemes[snapshot.activeTheme];

  const handleSelectPhase = (phase: HallPhase) => {
    aulaImpianEngine.setPhase(phase);
  };

  const handleSelectTheme = (theme: StageTheme) => {
    aulaImpianEngine.setTheme(theme);
  };

  const handleToggleAutoPlay = () => {
    if (snapshot.isAutoPlayingHall) {
      aulaImpianEngine.stopFullHallSimulation();
    } else {
      aulaImpianEngine.startFullHallSimulation();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-indigo-500/20 px-4 py-3 sticky top-0 z-40 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-indigo-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                Aula Impian & Panggung Serbaguna TK Asy Syifa
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sprint G37
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-black shadow-sm flex items-center gap-1">
                <PartyPopper className="w-3.5 h-3.5 fill-current" /> Panggung Serbaguna 3D
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Pintu Aula • Panggung 6 Tema • Kursi Ceria • Tirai Pelangi • Latihan Pentas • Foto Kenangan
            </p>
          </div>
        </div>

        {/* Action Tabs & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('EXPLORE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'EXPLORE'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🏛️ Wahana Aula</span>
            </button>
            <button
              onClick={() => setActiveTab('THEMES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'THEMES'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎭 6 Tema Panggung</span>
            </button>
            <button
              onClick={() => setActiveTab('GALLERY')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'GALLERY'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📸 Foto Kenangan</span>
            </button>
            <button
              onClick={() => setActiveTab('FOUNDER')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'FOUNDER'
                  ? 'bg-emerald-600 text-white shadow'
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
              snapshot.isAutoPlayingHall
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {snapshot.isAutoPlayingHall ? (
              <>
                <Pause className="w-4 h-4" /> Pause Acara
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Putar Alur (P1-P6)
              </>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN LIVING HALL STAGE WITH BONUS AMBIENCE
      ========================================================= */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-950 p-4 sm:p-6 flex flex-col justify-between">
        {/* Bonus Ambience 1: Lampu Bintang di Langit-Langit */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-16 text-2xl pointer-events-none z-10"
          title="Lampu bintang panggung"
        >
          ✨
        </motion.div>

        {/* Bonus Ambience 2: Balon Ceria Mengapung */}
        <motion.div
          animate={{ y: [-6, 6, -6], rotate: [-5, 5, -5] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 right-16 text-3xl pointer-events-none z-10"
          title="Balon warna-warni aula"
        >
          🎈
        </motion.div>

        {/* Bonus Ambience 3: Confetti Lembut Melayang */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-24 left-1/4 text-2xl pointer-events-none z-10"
          title="Confetti lembut penuh sukacita"
        >
          🎉
        </motion.div>

        {/* Bonus Ambience 4: Gelembung Cahaya Hangat */}
        <motion.div
          animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 right-1/4 text-2xl pointer-events-none z-10"
          title="Gelembung cahaya panggung hangat"
        >
          🫧
        </motion.div>

        {/* =====================================================
            TAB 1: WAHANA AULA (P1 - P6 ALUR LENGKAP)
        ===================================================== */}
        {activeTab === 'EXPLORE' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            {/* Phase Selector Ribbon */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80">
              {[
                { id: 'DOOR_OPEN', label: 'P1: Pintu Aula', emoji: '🚪' },
                { id: 'STAGE_THEME', label: 'P2: Panggung Hidup', emoji: '🎭' },
                { id: 'CHAIR_CHEER', label: 'P3: Kursi Ceria', emoji: '🪑' },
                { id: 'CURTAIN_LIGHT', label: 'P4: Tirai & Lampu', emoji: '🌈' },
                { id: 'REHEARSAL', label: 'P5: Latihan Pentas', emoji: '🌟' },
                { id: 'PHOTO_MEMORY', label: 'P6: Foto Kelas', emoji: '📸' }
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handleSelectPhase(phase.id as HallPhase)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    snapshot.currentPhase === phase.id
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-slate-950 shadow-lg border border-indigo-300 scale-105'
                      : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">{phase.emoji}</span>
                  <span className="text-[11px] truncate w-full text-center">{phase.label}</span>
                </button>
              ))}
            </div>

            {/* Living Stage Canvas */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/30 shadow-2xl relative overflow-hidden backdrop-blur">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* =================================================
                  P1: PINTU AULA TERBUKA & KARPET MERAH
              ================================================= */}
              {snapshot.currentPhase === 'DOOR_OPEN' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      P1 — Pintu Aula Terbuka & Karpet Merah
                    </span>
                    <button
                      onClick={() => aulaImpianEngine.playDoorOpeningFanfare()}
                      className="px-3 py-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-black text-xs flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Buka Pintu & Fanfare
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4 min-h-[260px] flex flex-col justify-center items-center relative overflow-hidden">
                      {/* Red Carpet Visual */}
                      <div className="w-24 h-48 bg-gradient-to-t from-rose-700 via-rose-600 to-rose-500 rounded-t-xl border-x-4 border-amber-400/80 shadow-2xl shadow-rose-900/60 relative flex flex-col justify-end items-center pb-3">
                        <span className="text-xs font-black text-amber-200 uppercase tracking-widest text-[9px] mb-2">
                          Karpet Merah
                        </span>
                        <motion.div
                          animate={{ y: [-3, 3, -3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-3xl"
                        >
                          👦✨
                        </motion.div>
                      </div>

                      <div className="p-3.5 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 text-xs text-indigo-200">
                        <p className="font-bold text-white">Dek Asy Tersenyum Hangat & Berkata:</p>
                        <p className="italic mt-1 text-sm text-indigo-100 font-serif">
                          “Selamat datang di Aula Impian TK Asy Syifa! Tempat kita bersyukur, berkarya, dan berbahagia bersama.”
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2 text-xs">
                        <strong className="text-indigo-300 block">Adab Memasuki Aula:</strong>
                        <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                          <li>Mengucapkan salam dengan ramah dan santun.</li>
                          <li>Melangkah di atas karpet merah dengan tertib.</li>
                          <li>Duduk rapi di kursi yang telah disiapkan.</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('STAGE_THEME')}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju Panggung Hidup (P2)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P2: PANGGUNG HIDUP (6 TEMA ACARA)
              ================================================= */}
              {snapshot.currentPhase === 'STAGE_THEME' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      P2 — Panggung Hidup: Transformasi Otomatis 6 Tema
                    </span>
                    <span className="text-xs text-purple-300 font-bold">
                      Tema Aktif: {currentThemeConfig.title}
                    </span>
                  </div>

                  {/* Stage Display Area */}
                  <div className={`p-6 rounded-3xl bg-gradient-to-b ${currentThemeConfig.backdropColor} border border-purple-500/30 space-y-4 shadow-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{currentThemeConfig.icon}</span>
                        <div>
                          <h3 className="text-base font-black text-white">{currentThemeConfig.title}</h3>
                          <p className="text-xs text-purple-200 font-medium">{currentThemeConfig.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 text-2xl">
                        {currentThemeConfig.propEmoji.map((emoji, idx) => (
                          <motion.span
                            key={idx}
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 1.5 + idx * 0.3, repeat: Infinity }}
                          >
                            {emoji}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-white/10 text-xs text-slate-200 italic">
                      {currentThemeConfig.highlightText}
                    </div>

                    {/* Theme Switcher Quick Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
                      {(Object.keys(aulaImpianEngine.stageThemes) as StageTheme[]).map((themeKey) => {
                        const item = aulaImpianEngine.stageThemes[themeKey];
                        const isSelected = snapshot.activeTheme === themeKey;
                        return (
                          <button
                            key={themeKey}
                            onClick={() => handleSelectTheme(themeKey)}
                            className={`p-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                              isSelected
                                ? 'bg-white text-slate-950 font-black shadow-lg scale-105'
                                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900 border border-slate-700'
                            }`}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-[10px] truncate w-full text-center">{item.title.split(' ')[1] || item.title.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('CHAIR_CHEER')}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Kursi Ceria (P3)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P3: KURSI CERIA
              ================================================= */}
              {snapshot.currentPhase === 'CHAIR_CHEER' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P3 — Kursi Ceria: Tertata Rapi & Mengangguk Ramah
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      Suasana Santun & Hangat
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Baris Depan: Santri Cilik', emoji: '🪑👶', note: 'Duduk tegak, siap menyimak panggung' },
                      { label: 'Baris Tengah: Ayah Bunda', emoji: '🪑👨‍👩‍👧', note: 'Tersenyum bangga menyaksikan ananda' },
                      { label: 'Baris Samping: Ustadzah', emoji: '🪑🧕', note: 'Mendampingi dengan penuh keteladanan' },
                      { label: 'Baris Belakang: Tamu Kehormatan', emoji: '🪑🤝', note: 'Menikmati acara dalam suasana khusyuk' }
                    ].map((seat, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [-4, 0, -4], rotate: [-1, 1, -1] }}
                        transition={{ duration: 2.2 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="p-4 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-center space-y-2 shadow"
                      >
                        <span className="text-3xl block">{seat.emoji}</span>
                        <h4 className="text-xs font-black text-amber-200">{seat.label}</h4>
                        <p className="text-[10px] text-slate-400 italic leading-tight">{seat.note}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-500/20 text-xs text-amber-200">
                    <p className="leading-relaxed">
                      Kursi-kursi kayu berbalut bantal lembut tersusun rapi dengan simetri teratur. Sesekali mengangguk ramah memberikan suasana hangat bagi seluruh hadirin.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('CURTAIN_LIGHT')}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Tirai Pelangi & Tata Lampu (P4)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P4: TIRAI PELANGI & TATA LAMPU PANGGUNG
              ================================================= */}
              {snapshot.currentPhase === 'CURTAIN_LIGHT' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      P4 — Tirai Pelangi & Tata Lampu Panggung
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => aulaImpianEngine.toggleCurtain()}
                        className="px-3 py-1 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow"
                      >
                        {snapshot.isCurtainOpen ? 'Tutup Tirai' : 'Buka Tirai Pelangi'}
                      </button>
                      <button
                        onClick={() => aulaImpianEngine.toggleStageLight()}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow"
                      >
                        {snapshot.isStageLightOn ? 'Lampu Redup' : 'Nyalakan Spotlight'}
                      </button>
                    </div>
                  </div>

                  {/* Stage Lighting & Curtain Visualizer */}
                  <div className="relative h-64 bg-slate-950 rounded-3xl border border-slate-700 overflow-hidden flex items-center justify-center">
                    {/* Spotlight Cone */}
                    {snapshot.isStageLightOn && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-b from-amber-400/30 via-amber-200/10 to-transparent pointer-events-none"
                      />
                    )}

                    {/* Rainbow Curtains Left & Right */}
                    <motion.div
                      animate={{ x: snapshot.isCurtainOpen ? -140 : 0 }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-red-600 via-yellow-500 via-green-500 via-blue-500 to-purple-600 opacity-90 shadow-2xl z-20 flex items-center justify-start pl-4"
                    >
                      <span className="text-xs font-black text-white/80 uppercase rotate-90">Tirai Kiri</span>
                    </motion.div>

                    <motion.div
                      animate={{ x: snapshot.isCurtainOpen ? 140 : 0 }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-red-600 via-yellow-500 via-green-500 via-blue-500 to-purple-600 opacity-90 shadow-2xl z-20 flex items-center justify-end pr-4"
                    >
                      <span className="text-xs font-black text-white/80 uppercase -rotate-90">Tirai Kanan</span>
                    </motion.div>

                    {/* Stage Center Stars & Actors */}
                    <div className="text-center space-y-2 z-10">
                      <div className="text-5xl flex items-center justify-center gap-3">
                        <span>⭐</span>
                        <span>🎭</span>
                        <span>🌟</span>
                      </div>
                      <p className="text-xs font-black text-amber-200">
                        {snapshot.isCurtainOpen ? 'Tirai Terbuka Lebar — Panggung Siap!' : 'Tirai Menutup Rapi — Menanti Pembukaan'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('REHEARSAL')}
                      className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Latihan Pentas (P5)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P5: LATIHAN PENTAS PENUH APRESIASI
              ================================================= */}
              {snapshot.currentPhase === 'REHEARSAL' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      P5 — Latihan Pentas Santri: 100% Apresiasi Kasih Sayang
                    </span>
                    <span className="text-xs text-emerald-300 font-bold">
                      Bebas Skor & Ranking
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">🎤</span>
                      <h4 className="text-xs font-black text-emerald-300">Keberanian Melangkah</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Santri belajar percaya diri tampil di depan teman-teman dan guru tanpa rasa takut salah.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">🤝</span>
                      <h4 className="text-xs font-black text-emerald-300">Kekompakan Sahabat</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Saling tolong-menolong mengingat bait nasyid dan doa hafalan bersama sahabat.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">👏</span>
                      <h4 className="text-xs font-black text-emerald-300">Tepuk Tangan Kasih</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Setiap penampilan diapresiasi dengan senyuman tulus, tepuk tangan santun, dan doa barakah.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('PHOTO_MEMORY')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Foto Kelas Otomatis (P6)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P6: FOTO KELAS OTOMATIS & LORONG KENANGAN
              ================================================= */}
              {snapshot.currentPhase === 'PHOTO_MEMORY' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      P6 — Foto Kelas Otomatis: Terhubung ke Lorong Kenangan (G30)
                    </span>
                    <button
                      onClick={() => aulaImpianEngine.captureClassPhoto()}
                      className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Camera className="w-3.5 h-3.5" /> Ambil Foto Bersama
                    </button>
                  </div>

                  <div className="bg-slate-900/90 p-6 rounded-3xl border border-teal-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-teal-400" />
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          Koleksi Foto Kenangan Pentas ({snapshot.savedPhotosCount})
                        </span>
                      </div>
                      <span className="text-[10px] text-teal-300 bg-teal-950 px-2 py-0.5 rounded-full border border-teal-500/30">
                        Sinkronisasi G30 Ring-0
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {snapshot.recentPhotos.map((photo, idx) => (
                        <div key={idx} className="p-3.5 bg-teal-950/40 rounded-2xl border border-teal-500/30 space-y-1.5">
                          <span className="text-2xl block">📸</span>
                          <h4 className="text-xs font-black text-teal-200">{photo.title}</h4>
                          <span className="text-[10px] text-slate-400 block">{photo.date} • {photo.theme}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('DOOR_OPEN')}
                      className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Ulangi Alur Aula (P1)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: 6 TEMA PANGGUNG LENGKAP
        ===================================================== */}
        {activeTab === 'THEMES' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                P2 — 6 Transformasi Panggung Serbaguna
              </span>
              <h2 className="text-xl font-black text-white">
                Satu Panggung untuk Segala Momen Bersejarah
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(aulaImpianEngine.stageThemes) as StageTheme[]).map((themeKey) => {
                const item = aulaImpianEngine.stageThemes[themeKey];
                const isSelected = snapshot.activeTheme === themeKey;
                return (
                  <div
                    key={themeKey}
                    onClick={() => handleSelectTheme(themeKey)}
                    className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/40 shadow-xl scale-[1.02]'
                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <h3 className="text-sm font-black text-white">{item.title}</h3>
                        <span className="text-[11px] text-purple-300 font-bold">{item.id}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-300 leading-relaxed italic">
                      {item.subtitle}
                    </p>
                    <div className="mt-3 flex gap-1 text-lg">
                      {item.propEmoji.map((p, idx) => (
                        <span key={idx}>{p}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: ALBUM FOTO KENANGAN (P6)
        ===================================================== */}
        {activeTab === 'GALLERY' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-pink-500/20 text-pink-300 border border-pink-500/30">
                P6 — Dokumentasi & Album Kenangan Santri
              </span>
              <h2 className="text-xl font-black text-white">
                Setiap Senyuman Terabadikan Indah
              </h2>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Foto pentas otomatis disimpan dan dihubungkan ke Lorong Kenangan (G30) untuk menjadi kenangan berharga bagi ananda dan keluarga.
                </p>
                <button
                  onClick={() => aulaImpianEngine.captureClassPhoto()}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                >
                  <Camera className="w-3.5 h-3.5" /> Ambil Foto Baru
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {snapshot.recentPhotos.map((photo, i) => (
                  <div key={i} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 text-center space-y-2">
                    <span className="text-4xl block">🖼️</span>
                    <h4 className="text-xs font-bold text-amber-300">{photo.title}</h4>
                    <span className="text-[10px] text-slate-400 block">{photo.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P7 — FOUNDER AULA CONTROL COCKPIT
        ===================================================== */}
        {activeTab === 'FOUNDER' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-600/20">
                    🎛️
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">
                      Founder Aula Control Cockpit (P7)
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Uji Lampu, Uji Tirai Pelangi, Simulasi Acara Lengkap, Audit Black Box Ring-0
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sprint G37 Verifier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Hardware & Audio Tester */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Uji Lampu & Audio Sintesis Aula
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => aulaImpianEngine.playDoorOpeningFanfare()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-indigo-950/40 text-indigo-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🚪 Fanfare Pintu Terbuka</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => aulaImpianEngine.playCurtainAndLightSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-pink-950/40 text-pink-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🌈 Denting Tirai & Lampu</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => aulaImpianEngine.playCameraShutterSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-teal-950/40 text-teal-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>📸 Shutter Kamera P6</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Mandatory Ecosystem Connectors */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Integrasi Ekosistem Wajib
                  </span>
                  <div className="space-y-2">
                    {onNavigateToFestival && (
                      <button
                        onClick={onNavigateToFestival}
                        className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🎪 Festival Budaya (G18)</span>
                        <PartyPopper className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToTvAsy && (
                      <button
                        onClick={onNavigateToTvAsy}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>📺 TV Asy & Syifa (G15)</span>
                        <Tv className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToLorongKenangan && (
                      <button
                        onClick={onNavigateToLorongKenangan}
                        className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🖼️ Lorong Kenangan (G30)</span>
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToPerpustakaan && (
                      <button
                        onClick={onNavigateToPerpustakaan}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>📚 Perpustakaan Ajaib (G36)</span>
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToPawaiNusantara && (
                      <button
                        onClick={onNavigateToPawaiNusantara}
                        className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🇮🇩 Pawai Nusantara (G38)</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Black Box Telemetry */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                  <span className="text-xs font-black text-slate-200 block">
                    Audit Ring-0 & Hall Sync
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Panggung Serbaguna terhubung dengan DNA G20, Kamera G21, Sutradara G22, dan telemetri Black Box Ring-0.
                  </p>
                  <span className="inline-block text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Marker: G37_AULA_IMPIAN_VERIFIED
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
                    <span className="text-slate-400 text-[10px] block">Fase Aula:</span>
                    <span className="text-sm font-black text-indigo-400">{snapshot.currentPhase}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Tirai Pelangi:</span>
                    <span className="text-sm font-black text-pink-300">
                      {snapshot.isCurtainOpen ? 'TERBUKA' : 'TERTUTUP'}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Spotlight Panggung:</span>
                    <span className="text-sm font-black text-amber-300">
                      {snapshot.isStageLightOn ? 'MENYALA' : 'REDUP'}
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

export default AulaImpianHub;
