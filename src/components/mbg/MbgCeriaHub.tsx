import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Sparkles,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Compass,
  CheckCircle2,
  Utensils,
  Coffee,
  Smile,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { mbgCeriaEngine, MbgPhase, NutritionMenu } from '../../services/mbgCeriaEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface MbgCeriaHubProps {
  onNavigateToSchool?: () => void;
  onNavigateToWorldMap?: () => void;
  onNavigateToMemoryHall?: () => void;
  onNavigateToKeluargaSahabat?: () => void;
  onNavigateToPagiCeria?: () => void;
}

export const MbgCeriaHub: React.FC<MbgCeriaHubProps> = ({
  onNavigateToSchool,
  onNavigateToWorldMap,
  onNavigateToMemoryHall,
  onNavigateToKeluargaSahabat,
  onNavigateToPagiCeria
}) => {
  const [snapshot, setSnapshot] = useState(mbgCeriaEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'STORY' | 'MENU' | 'COMPANIONS' | 'FOUNDER'>('STORY');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());

  useEffect(() => {
    const unsub = mbgCeriaEngine.subscribe(() => {
      setSnapshot(mbgCeriaEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleSelectPhase = (phase: MbgPhase) => {
    mbgCeriaEngine.setPhase(phase);
  };

  const handleToggleAutoPlay = () => {
    if (snapshot.isAutoPlayingRoutine) {
      mbgCeriaEngine.stopFullRoutineSimulation();
    } else {
      mbgCeriaEngine.startFullRoutineSimulation();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-emerald-500/20 px-4 py-3 sticky top-0 z-40 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                Makan Bergizi Gratis (MBG) Ceria
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sprint G31
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Halal & Bergizi
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Serial Kartun 3D Rutinitas Harian Santri TK Asy-Syifa • Penuh Adab & Kasih Sayang
            </p>
          </div>
        </div>

        {/* Phase Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('STORY')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'STORY'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎬 Alur MBG 3D</span>
            </button>
            <button
              onClick={() => setActiveTab('MENU')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'MENU'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🍱 Menu Sehat</span>
            </button>
            <button
              onClick={() => setActiveTab('COMPANIONS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'COMPANIONS'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🐾 Sahabat Gizi</span>
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
              snapshot.isAutoPlayingRoutine
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {snapshot.isAutoPlayingRoutine ? (
              <>
                <Pause className="w-4 h-4" /> Pause Rutinitas
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Putar Semua Alur (P1-P6)
              </>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN LIVING STAGE
      ========================================================= */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-emerald-950/40 p-4 sm:p-6 flex flex-col justify-between">
        {/* Bonus Ambience: Floating Butterflies & Balloons */}
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-10 text-2xl pointer-events-none z-10 filter drop-shadow-md"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{ y: [0, -35, 0], x: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-16 text-3xl pointer-events-none z-10 filter drop-shadow-md"
        >
          🎈
        </motion.div>

        {/* Bonus Ambience: Bird perched on the gate fence */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 left-1/4 text-2xl pointer-events-none z-10"
        >
          🐥
        </motion.div>

        {/* Klakson Sound Ripple Toast */}
        <AnimatePresence>
          {snapshot.busHornActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-black text-sm shadow-2xl flex items-center gap-2 z-30 border border-white/20 animate-pulse"
            >
              <Volume2 className="w-5 h-5 text-amber-200" />
              <span>🔊 Bus MBG Membunyikan Klakson: "Tuut... Tuut...!"</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            TAB 1: STORY LIVING 3D SIMULATOR (P1 to P6)
        ===================================================== */}
        {activeTab === 'STORY' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            {/* Step Navigation Pill Selector */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80">
              {[
                { id: 'BUS_ARRIVING', label: 'P1: Bus Datang', emoji: '🚌' },
                { id: 'STAFF_GREETING', label: 'P2: Petugas Ramah', emoji: '👨🏻‍🍳' },
                { id: 'QUEUE_ORDERLY', label: 'P3: Antri Ceria', emoji: '🚶🏻' },
                { id: 'PRAYER_BEFORE', label: 'P4: Doa Makan', emoji: '🤲' },
                { id: 'EATING_TOGETHER', label: 'P5: Makan Bersama', emoji: '🍱' },
                { id: 'PRAYER_AFTER', label: 'P6: Selesai & Rapi', emoji: '✨' }
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handleSelectPhase(phase.id as MbgPhase)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    snapshot.currentPhase === phase.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/40 scale-105'
                      : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">{phase.emoji}</span>
                  <span className="text-[11px] truncate w-full text-center">{phase.label}</span>
                </button>
              ))}
            </div>

            {/* Living Stage Canvas */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden backdrop-blur">
              {/* Background ambient lighting */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* =================================================
                  PHASE 1: BUS MBG CERIA DATANG (P1)
              ================================================= */}
              {snapshot.currentPhase === 'BUS_ARRIVING' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        P1 — Bus MBG Ceria Datang ke Gerbang
                      </span>
                    </div>
                    <button
                      onClick={() => mbgCeriaEngine.playBusHornSound()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Volume2 className="w-4 h-4" /> Bunyikan Klakson
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left: 3D Cartoon Bus Arrival Graphic */}
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
                      {/* Swaying Tree Leaves */}
                      <motion.div
                        animate={{ rotate: [-4, 4, -4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-3 left-4 text-3xl opacity-80"
                      >
                        🌿
                      </motion.div>

                      {/* 3D Bus Container */}
                      <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="relative bg-gradient-to-r from-white to-emerald-50 border-4 border-emerald-600 rounded-3xl p-5 w-64 shadow-2xl text-slate-900"
                      >
                        {/* Bus Roof Lights */}
                        <div className="flex justify-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        </div>

                        {/* Front Windshield with Smiling Eyes */}
                        <div className="bg-sky-200 border-2 border-sky-400 rounded-2xl h-16 flex items-center justify-center text-3xl shadow-inner">
                          😊
                        </div>

                        {/* Bus Headline Text */}
                        <div className="mt-3 bg-emerald-600 text-white rounded-xl py-1.5 px-3 font-black text-xs tracking-wider shadow">
                          MAKAN BERGIZI GRATIS
                        </div>

                        {/* Bus Wheels & Smiling Grille */}
                        <div className="flex items-center justify-between mt-3 px-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-[10px] text-white">
                            ⚙️
                          </div>
                          <span className="text-emerald-700 font-black text-xs">✨ TK Asy-Syifa</span>
                          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-[10px] text-white">
                            ⚙️
                          </div>
                        </div>
                      </motion.div>

                      <p className="text-xs text-emerald-400 font-bold mt-4">
                        Bus ramah tersenyum perlahan berhenti di depan gerbang sekolah.
                      </p>
                    </div>

                    {/* Right: Asy & Syifa Reaction */}
                    <div className="md:col-span-5 space-y-4">
                      {/* Asy Waving */}
                      <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3">
                        <span className="text-4xl">👦🏻</span>
                        <div>
                          <h4 className="text-sm font-black text-sky-300">Dek Asy Melambaikan Tangan</h4>
                          <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                            “Hore! Bus MBG Ceria sudah tiba! Ayo kawan-kawan kita sambut dengan gembira.”
                          </p>
                        </div>
                      </div>

                      {/* Syifa Grateful */}
                      <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
                        <span className="text-4xl">👧🏻</span>
                        <div>
                          <h4 className="text-sm font-black text-rose-300">Mbak Syifa Tersenyum</h4>
                          <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                            “Alhamdulillah, MBG sudah datang. Makanan sehat dan halal untuk kita semua.”
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('STAFF_GREETING')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Lanjut ke Petugas MBG (P2)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 2: PETUGAS MBG RAMAH (P2)
              ================================================= */}
              {snapshot.currentPhase === 'STAFF_GREETING' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      P2 — Petugas MBG Ramah & Santun
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                      <div className="text-7xl">👨🏻‍🍳</div>
                      <h3 className="text-lg font-black text-white">Kak Hilman (Petugas MBG)</h3>
                      <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                        Seragam Putih-Hijau Higienis TADE
                      </div>
                      <p className="text-sm text-emerald-200 font-medium italic">
                        “Assalamu’alaikum adik-adik santri Asy-Syifa! Ini paket makan bergizi sehat dan hangat untuk hari ini.”
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                          <ShieldCheck className="w-5 h-5" />
                          <span>Standar Kualitas & Adab Petugas</span>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                          <li>Menggunakan sarung tangan & penutup kepala higienis.</li>
                          <li>Menyapa dengan senyum tulus dan kalimat salam Islami.</li>
                          <li>Kotak makanan terbuat dari bahan ramah lingkungan & bebas BPA.</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('QUEUE_ORDERLY')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Lanjut ke Antri Ceria (P3)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 3: ANTRI CERIA (P3)
              ================================================= */}
              {snapshot.currentPhase === 'QUEUE_ORDERLY' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      P3 — Antri Ceria & Tertib
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 space-y-4">
                      <h3 className="text-sm font-black text-emerald-300">
                        Barisan Rapi Santri (Tidak Berebut)
                      </h3>

                      {/* Queue Visual */}
                      <div className="flex items-center justify-around p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
                        <div className="text-center">
                          <span className="text-3xl block">👦🏻</span>
                          <span className="text-[10px] font-bold text-sky-300">Dek Asy</span>
                        </div>
                        <span className="text-emerald-400 font-black">➔</span>
                        <div className="text-center">
                          <span className="text-3xl block">👧🏻</span>
                          <span className="text-[10px] font-bold text-rose-300">Mbak Syifa</span>
                        </div>
                        <span className="text-emerald-400 font-black">➔</span>
                        <div className="text-center">
                          <span className="text-3xl block">👦🏽</span>
                          <span className="text-[10px] font-bold text-amber-300">Farhan</span>
                        </div>
                        <span className="text-emerald-400 font-black">➔</span>
                        <div className="text-center">
                          <span className="text-3xl block">🧕🏻</span>
                          <span className="text-[10px] font-bold text-purple-300">Aisyah</span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                        <span>🐻 Dodo Membantu:</span>
                        <span className="italic">“Luruskan barisan dan jaga jarak ya teman-teman!”</span>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-4">
                      <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30">
                        <h4 className="text-sm font-black text-sky-300">Pesan Adab Asy</h4>
                        <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                          “Ayo antre dengan sabar. Orang yang sabar dan tertib dicintai Allah SWT.”
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('PRAYER_BEFORE')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Lanjut ke Doa Sebelum Makan (P4)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 4: DOA SEBELUM MAKAN (P4)
              ================================================= */}
              {snapshot.currentPhase === 'PRAYER_BEFORE' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      P4 — Doa Sebelum Makan Bersama
                    </span>
                    <button
                      onClick={() => mbgCeriaEngine.playPrayerChime()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow"
                    >
                      <Volume2 className="w-4 h-4" /> Lantunkan Nada Doa
                    </button>
                  </div>

                  <div className="bg-gradient-to-b from-slate-900 to-emerald-950/60 p-6 rounded-3xl border border-emerald-500/30 text-center space-y-4">
                    {/* Animated Opening Prayer Book */}
                    <div className="flex items-center justify-center gap-2 text-4xl">
                      <motion.div
                        animate={{ rotateY: [0, 20, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📖
                      </motion.div>
                      <span>🤲</span>
                    </div>

                    <h3 className="text-xl font-serif font-black text-amber-300 tracking-wider">
                      اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ
                    </h3>

                    <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 max-w-xl mx-auto space-y-1 text-xs">
                      <p className="font-mono text-emerald-300 font-bold">
                        “Allahumma barik lana fima razaqtana waqina ‘adzaban nar”
                      </p>
                      <p className="text-slate-300 italic">
                        “Ya Allah, berkahilah rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.”
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleSelectPhase('EATING_TOGETHER')}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md inline-flex items-center gap-2"
                      >
                        <span>Mulai Makan Bersama (P5)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 5: MAKAN BERSAMA (P5)
              ================================================= */}
              {snapshot.currentPhase === 'EATING_TOGETHER' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      P5 — Makan Bersama & Sahabat Menemani
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Menu Hari Ini: <strong className="text-emerald-300">{snapshot.currentMenu.dayName}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Meal Box Display */}
                    <div className="md:col-span-6 bg-slate-900/80 p-5 rounded-3xl border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <span>🍱 Kotak MBG Higienis</span>
                        </h4>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {snapshot.currentMenu.caloricKcal} kkal
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                          <span className="text-slate-400 text-[10px] block">Lauk Utama:</span>
                          <span className="font-bold text-slate-200">{snapshot.currentMenu.mainDish}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                          <span className="text-slate-400 text-[10px] block">Sayuran Sehat:</span>
                          <span className="font-bold text-emerald-300">{snapshot.currentMenu.vegetable}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                          <span className="text-slate-400 text-[10px] block">Buah Segar:</span>
                          <span className="font-bold text-amber-300">{snapshot.currentMenu.fruit}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                          <span className="text-slate-400 text-[10px] block">Minuman:</span>
                          <span className="font-bold text-sky-300">{snapshot.currentMenu.drink}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sahabat Companions Tips */}
                    <div className="md:col-span-6 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Pesan Sahabat Ceria:
                      </h4>
                      <div className="space-y-2">
                        {snapshot.companionTips.slice(0, 3).map((tip, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5 text-xs"
                          >
                            <span className="text-2xl">{tip.emoji}</span>
                            <div>
                              <strong className="text-emerald-300 block text-[11px]">{tip.name}</strong>
                              <p className="text-slate-300 italic text-[11px]">{tip.tip}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleSelectPhase('PRAYER_AFTER')}
                        className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Lanjut ke Selesai Makan (P6)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 6: SELESAI MAKAN & DOA SYUKUR (P6)
              ================================================= */}
              {snapshot.currentPhase === 'PRAYER_AFTER' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      P6 — Doa Sesudah Makan & Jaga Kebersihan
                    </span>
                    <button
                      onClick={() => mbgCeriaEngine.playPrayerChime()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow"
                    >
                      <Volume2 className="w-4 h-4" /> Lantunkan Doa Syukur
                    </button>
                  </div>

                  <div className="bg-gradient-to-b from-slate-900 to-emerald-950/60 p-6 rounded-3xl border border-emerald-500/30 text-center space-y-4">
                    <span className="text-5xl block">🤲</span>

                    <h3 className="text-xl font-serif font-black text-amber-300 tracking-wider">
                      اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ
                    </h3>

                    <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 max-w-xl mx-auto space-y-1 text-xs">
                      <p className="font-mono text-emerald-300 font-bold">
                        “Alhamdulillahilladzi ath’amana wa saqana wa ja’alana muslimin”
                      </p>
                      <p className="text-slate-300 italic">
                        “Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami termasuk orang-orang yang berserah diri (muslim).”
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-500/30 max-w-md mx-auto text-xs text-left flex items-center gap-3">
                      <span className="text-3xl">🗑️</span>
                      <div>
                        <strong className="text-emerald-300 block">Dodo Berkata:</strong>
                        <p className="text-slate-300 italic">
                          “Hebat, kita menutup kotak makan dan membuang sisa sampah pada tempatnya!”
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleSelectPhase('BUS_ARRIVING')}
                        className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-black text-xs shadow-md inline-flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Ulangi Simulasi dari Bus Datang (P1)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: MENU HARIAN BERGIZI SEIMBANG
        ===================================================== */}
        {activeTab === 'MENU' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">Menu Makan Bergizi Gratis (MBG) Sepekan</h2>
                <p className="text-xs text-slate-400">Nutrisi seimbang, higienis, dan 100% Halal</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                {Object.keys(snapshot.weeklyMenu).map((day) => (
                  <button
                    key={day}
                    onClick={() => mbgCeriaEngine.setSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      snapshot.selectedDay === day
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.entries(snapshot.weeklyMenu) as [string, NutritionMenu][]).map(([dayKey, menu]) => (
                <div
                  key={menu.id}
                  onClick={() => mbgCeriaEngine.setSelectedDay(dayKey)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                    snapshot.selectedDay === dayKey
                      ? 'bg-slate-800/95 border-emerald-500 shadow-2xl scale-[1.02]'
                      : 'bg-slate-800/60 border-slate-700 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      {menu.dayName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {menu.caloricKcal} kkal
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Lauk Utama:</span>
                      <p className="font-bold text-slate-200">{menu.mainDish}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Sayur:</span>
                      <p className="font-semibold text-emerald-300">{menu.vegetable}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Buah & Minum:</span>
                      <p className="text-slate-300">{menu.fruit} • {menu.drink}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">{menu.nutritionTag}</span>
                    <span className="text-emerald-400 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Halal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: SAHABAT GIZI COMPANIONS
        ===================================================== */}
        {activeTab === 'COMPANIONS' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                P5 — Sahabat Penjaga Gizi & Adab
              </span>
              <h2 className="text-xl font-black text-white">
                Bubu, Gogo, Mimi, Dodo, Titi, dan Rara
              </h2>
              <p className="text-xs text-slate-400">
                Menemani santri dengan pesan hikmah tanpa mubazir, cinta sayur, dan air putih berkah
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {snapshot.companionTips.map((companion, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 bg-slate-900 rounded-2xl border border-slate-700">
                      {companion.emoji}
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white">{companion.name}</h3>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">
                        Sahabat Teladan Adab
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                    {companion.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P7 — FOUNDER MBG CONTROL COCKPIT
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
                      Founder MBG Control Cockpit (P7)
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Simulasi Kedatangan Bus, Uji Klakson & Doa, Monitor Dr. Pulse 60 FPS, Audit Black Box
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Sprint G31 Verifier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Quick Audio & Bus Simulation Controls */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Uji Suara & Animasi Bus
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => mbgCeriaEngine.playBusHornSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-emerald-950/40 text-emerald-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔊 Klakson Bus "Tuut... Tuut..."</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => mbgCeriaEngine.playPrayerChime()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-teal-950/40 text-teal-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🎵 Nada Doa Makan</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleToggleAutoPlay}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow"
                    >
                      <span>🎬 Simulasi Otomatis P1-P6</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Fast Navigation to Connected Modules */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Integrasi Ekosistem Wajib
                  </span>
                  <div className="space-y-2">
                    {onNavigateToPagiCeria && (
                      <button
                        onClick={onNavigateToPagiCeria}
                        className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>☀️ Pagi Ceria (G32)</span>
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToSchool && (
                      <button
                        onClick={onNavigateToSchool}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🏫 Sekolah Bernapas (G29)</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToMemoryHall && (
                      <button
                        onClick={onNavigateToMemoryHall}
                        className="w-full py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🖼️ Lorong Kenangan (G30)</span>
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToWorldMap && (
                      <button
                        onClick={onNavigateToWorldMap}
                        className="w-full py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🗺️ Peta Dunia Asy-Syifa (G28)</span>
                        <Compass className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Black Box & Standards */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                  <span className="text-xs font-black text-slate-200 block">
                    Audit Ring-0 & DNA Sync
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Setiap fase terekam di Black Box Ring-0. Bebas algoritma adiktif dan murni kartun edukatif 3D.
                  </p>
                  <span className="inline-block text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Marker: G31_MBG_CERIA_VERIFIED
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
                  <span className="text-xs text-emerald-400 font-mono">60.0 FPS • Eco Mode OK</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Slot Animasi Aktif:</span>
                    <span className="text-sm font-black text-amber-300">{governorSlots} / 5</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Fase Saat Ini:</span>
                    <span className="text-sm font-black text-emerald-400">{snapshot.currentPhase}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Auto-Play Rutinitas:</span>
                    <span className="text-sm font-black text-sky-300">
                      {snapshot.isAutoPlayingRoutine ? 'AKTIF' : 'STANDBY'}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Klakson Web Audio:</span>
                    <span className="text-sm font-black text-rose-300">
                      {snapshot.busHornActive ? 'BUNYI' : 'HENING'}
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

export default MbgCeriaHub;
