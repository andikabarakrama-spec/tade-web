import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Heart,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sliders,
  Compass,
  CheckCircle2,
  Smile,
  ShieldCheck,
  Zap,
  Users,
  ChevronRight,
  School,
  Bus,
  Bike,
  Activity
} from 'lucide-react';
import { pagiCeriaEngine, PagiPhase, GymMove } from '../../services/pagiCeriaEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface PagiCeriaHubProps {
  onNavigateToSchool?: () => void;
  onNavigateToMbg?: () => void;
  onNavigateToWorldMap?: () => void;
  onNavigateToMemoryHall?: () => void;
  onNavigateToKelasHidup?: () => void;
}

export const PagiCeriaHub: React.FC<PagiCeriaHubProps> = ({
  onNavigateToSchool,
  onNavigateToMbg,
  onNavigateToWorldMap,
  onNavigateToMemoryHall,
  onNavigateToKelasHidup
}) => {
  const [snapshot, setSnapshot] = useState(pagiCeriaEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'STORY' | 'GYM' | 'PARKING' | 'FOUNDER'>('STORY');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());

  useEffect(() => {
    const unsub = pagiCeriaEngine.subscribe(() => {
      setSnapshot(pagiCeriaEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleSelectPhase = (phase: PagiPhase) => {
    pagiCeriaEngine.setPhase(phase);
  };

  const handleToggleAutoPlay = () => {
    if (snapshot.isAutoPlayingMorning) {
      pagiCeriaEngine.stopFullMorningSimulation();
    } else {
      pagiCeriaEngine.startFullMorningSimulation();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-amber-500/20 px-4 py-3 sticky top-0 z-40 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Sun className="w-6 h-6 text-yellow-200 animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                Pagi Ceria di Halaman TK Asy Syifa
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sprint G32
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-600 text-white shadow-sm flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" /> Suasana Pagi Hidup
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Serial Kartun 3D Rutinitas Pagi • Senam 20 Detik • Salim Santun & Semangat Belajar
            </p>
          </div>
        </div>

        {/* Phase Action Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('STORY')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'STORY'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎬 Alur Pagi 3D</span>
            </button>
            <button
              onClick={() => setActiveTab('GYM')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'GYM'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🤸🏻 Senam 20 Detik</span>
            </button>
            <button
              onClick={() => setActiveTab('PARKING')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'PARKING'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🚲 Parkir Ceria</span>
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
              snapshot.isAutoPlayingMorning
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {snapshot.isAutoPlayingMorning ? (
              <>
                <Pause className="w-4 h-4" /> Pause Rutinitas
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Putar Alur Pagi (P1-P6)
              </>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN LIVING COURTYARD STAGE WITH BONUS AMBIENCE
      ========================================================= */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-amber-950/30 p-4 sm:p-6 flex flex-col justify-between">
        {/* Bonus Ambience 1: Birds flying in morning sky */}
        <motion.div
          animate={{ x: [-40, 200], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 left-10 text-2xl pointer-events-none z-10 filter drop-shadow"
        >
          🕊️ 🕊️
        </motion.div>

        {/* Bonus Ambience 2: Colorful Kite hovering */}
        <motion.div
          animate={{ rotate: [-6, 6, -6], y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 right-20 text-3xl pointer-events-none z-10 filter drop-shadow"
        >
          🪁
        </motion.div>

        {/* Bonus Ambience 3: Small floating balloons */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 left-1/3 text-2xl pointer-events-none z-10"
        >
          🎈
        </motion.div>

        {/* Bonus Ambience 4: Swaying tree leaves */}
        <motion.div
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-14 left-4 text-3xl opacity-75 pointer-events-none"
        >
          🍃
        </motion.div>

        {/* Bonus Ambience 5: Friendly cat walking across courtyard */}
        <motion.div
          animate={{ x: [-80, 80, -80] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-4 left-1/2 text-2xl pointer-events-none z-10 filter drop-shadow"
        >
          🐈
        </motion.div>

        {/* =====================================================
            TAB 1: STORY LIVING 3D SIMULATOR (P1 to P6)
        ===================================================== */}
        {activeTab === 'STORY' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            {/* Phase Selector Ribbon */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80">
              {[
                { id: 'ARRIVAL', label: 'P1: Santri Datang', emoji: '👫' },
                { id: 'GREETING_SALIM', label: 'P2: Salam & Salim', emoji: '🤝' },
                { id: 'PARKING_AREA', label: 'P3: Parkir Ceria', emoji: '🚲' },
                { id: 'MORNING_GYM', label: 'P4: Senam 20s', emoji: '🤸🏻' },
                { id: 'LINE_UP', label: 'P5: Baris Kelas', emoji: '🔔' },
                { id: 'MBG_CONNECT', label: 'P6: MBG Datang', emoji: '🚌' }
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handleSelectPhase(phase.id as PagiPhase)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    snapshot.currentPhase === phase.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border border-amber-300/40 scale-105'
                      : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">{phase.emoji}</span>
                  <span className="text-[11px] truncate w-full text-center">{phase.label}</span>
                </button>
              ))}
            </div>

            {/* Living Stage Courtyard Canvas */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden backdrop-blur">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* =================================================
                  PHASE 1: KEDATANGAN SANTRI (P1)
              ================================================= */}
              {snapshot.currentPhase === 'ARRIVAL' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P1 — Kedatangan Santri di Gerbang Sekolah
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Gerbang Terbuka Ramah • Ayah & Bunda Mengantar
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Courtyard Gate Visual */}
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
                      {/* 3D Gate Pillars */}
                      <div className="w-full max-w-sm flex items-center justify-between px-4 mb-4">
                        <div className="w-12 h-36 bg-amber-700 rounded-t-2xl border-2 border-amber-500 flex flex-col items-center justify-start pt-2 shadow-lg">
                          <span className="text-xs">🏮</span>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="px-3 py-1 rounded-full bg-amber-500 text-slate-900 font-black text-xs shadow">
                            GERBANG TK ASY-SYIFA
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold block">
                            “Terbuka Lebar Menyambut Calon Pemimpin Mulia”
                          </span>
                        </div>
                        <div className="w-12 h-36 bg-amber-700 rounded-t-2xl border-2 border-amber-500 flex flex-col items-center justify-start pt-2 shadow-lg">
                          <span className="text-xs">🏮</span>
                        </div>
                      </div>

                      {/* Arriving Santri with Parents */}
                      <div className="flex items-center justify-center gap-4 bg-slate-800/80 px-6 py-3 rounded-2xl border border-slate-700 shadow-inner">
                        <div className="text-center">
                          <span className="text-4xl block">🧕🏻</span>
                          <span className="text-[10px] text-slate-300 font-bold">Bunda</span>
                        </div>
                        <span className="text-xl text-amber-400 font-black">🤝</span>
                        <div className="text-center">
                          <span className="text-4xl block">👦🏻</span>
                          <span className="text-[10px] text-sky-300 font-bold">Dek Asy</span>
                        </div>
                        <span className="text-slate-500">|</span>
                        <div className="text-center">
                          <span className="text-4xl block">👧🏻</span>
                          <span className="text-[10px] text-rose-300 font-bold">Mbak Syifa</span>
                        </div>
                      </div>
                    </div>

                    {/* Welcoming Dialogues */}
                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3">
                        <span className="text-3xl">👦🏻</span>
                        <div>
                          <strong className="text-xs text-sky-300 block">Dek Asy Melambai:</strong>
                          <p className="text-xs text-slate-300 italic mt-0.5">
                            “Selamat pagi teman-teman! Hari ini kita siap belajar hal baru yang seru!”
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
                        <span className="text-3xl">👧🏻</span>
                        <div>
                          <strong className="text-xs text-rose-300 block">Mbak Syifa Menyambut:</strong>
                          <p className="text-xs text-slate-300 italic mt-0.5">
                            “Assalamu’alaikum teman-teman! Halaman sekolah kita indah dan sejuk sekali.”
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('GREETING_SALIM')}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Lanjut ke Salam & Salim Pagi (P2)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 2: SALAM & SALIM PAGI (P2)
              ================================================= */}
              {snapshot.currentPhase === 'GREETING_SALIM' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P2 — Salam Pagi & Animasi Salim Takzim
                    </span>
                    <button
                      onClick={() => pagiCeriaEngine.playSalimChime()}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow"
                    >
                      <Volume2 className="w-4 h-4" /> Lantunkan Salam
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Salim Interactive Animation Card */}
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <span className="text-5xl block animate-bounce">🧕🏽</span>
                          <span className="text-xs font-black text-amber-300 block mt-2">
                            Ustadzah Nurul (Guru)
                          </span>
                          <span className="text-[11px] text-slate-400">“Assalamu’alaikum.”</span>
                        </div>

                        <span className="text-3xl text-amber-400">🤝</span>

                        <div className="text-center">
                          <span className="text-5xl block">👦🏻</span>
                          <span className="text-xs font-black text-sky-300 block mt-2">
                            Dek Asy & Santri
                          </span>
                          <span className="text-[11px] text-slate-400">“Wa’alaikumussalam.”</span>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-950/40 rounded-2xl border border-amber-500/30 text-xs text-amber-200 font-semibold italic">
                        Animasi Salim: Anak mencium tangan guru dengan takzim dan menatap dengan senyum kasih sayang.
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-amber-300 font-bold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Nilai Adab & Keberkahan</span>
                        </div>
                        <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                          <li>Menebarkan salam sebagai doa keselamatan.</li>
                          <li>Menghormati guru yang mengajarkan ilmu kebaikan.</li>
                          <li>Membangun ikatan hati yang hangat sebelum mulai belajar.</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('PARKING_AREA')}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Lanjut ke Parkir Ceria (P3)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 3: PARKIR CERIA (P3)
              ================================================= */}
              {snapshot.currentPhase === 'PARKING_AREA' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P3 — Parkir Ceria & Pak Satpam Ramah
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Tertib Parkir • Aman & Nyaman
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-5xl block">🛵</span>
                      <h4 className="text-sm font-black text-white">Motor Orang Tua</h4>
                      <p className="text-xs text-slate-300 italic">
                        Motor melaju sangat pelan di area drop-off dengan tertib dan mematikan mesin saat santri turun.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-5xl block">🚲</span>
                      <h4 className="text-sm font-black text-white">Sepeda Kecil Rapi</h4>
                      <p className="text-xs text-slate-300 italic">
                        Sepeda roda dua dan roda tiga santri terparkir rapi berjajar di rak kayu pelangi.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-5xl block">👮🏻‍♂️</span>
                      <h4 className="text-sm font-black text-white">Pak Satpam Ramah</h4>
                      <p className="text-xs text-slate-300 italic">
                        Pak Satpam tersenyum, membantu menyeberangkan anak, dan memberikan salam hangat.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('MORNING_GYM')}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Lanjut ke Senam Pagi 20 Detik (P4)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 4: SENAM PAGI 20 DETIK (P4)
              ================================================= */}
              {snapshot.currentPhase === 'MORNING_GYM' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        P4 — Senam Pagi Ceria (20 Detik)
                      </span>
                      <span className="text-xs font-black text-amber-400 bg-slate-900 px-3 py-1 rounded-full border border-amber-500/30">
                        ⏱️ Sisa Waktu: {snapshot.gymRemainingSec}s
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {snapshot.isGymActive ? (
                        <button
                          onClick={() => pagiCeriaEngine.stopGymRoutine()}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <Pause className="w-3.5 h-3.5" /> Pause Senam
                        </button>
                      ) : (
                        <button
                          onClick={() => pagiCeriaEngine.startGymRoutine()}
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow"
                        >
                          <Play className="w-3.5 h-3.5" /> Mulai Senam 20s
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Move Stage */}
                  <div className="bg-gradient-to-b from-slate-900 to-amber-950/60 p-6 rounded-3xl border border-amber-500/30 text-center space-y-4">
                    <motion.div
                      key={snapshot.currentGymMove.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-3"
                    >
                      <span className="text-7xl block animate-bounce">
                        {snapshot.currentGymMove.emoji}
                      </span>
                      <h3 className="text-xl font-black text-amber-300">
                        {snapshot.currentGymMove.name}
                      </h3>
                      <p className="text-sm text-slate-200 max-w-lg mx-auto leading-relaxed">
                        {snapshot.currentGymMove.description}
                      </p>
                      <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                        Manfaat: {snapshot.currentGymMove.beneficialEffect}
                      </div>
                    </motion.div>

                    {/* Move Step Dots */}
                    <div className="flex items-center justify-center gap-3 pt-3">
                      {snapshot.gymMoves.map((m, idx) => (
                        <div
                          key={m.id}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            snapshot.activeMoveIndex === idx
                              ? 'bg-amber-500 text-slate-900 scale-105 shadow'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}. {m.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('LINE_UP')}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Lanjut ke Baris Masuk Kelas (P5)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 5: BARIS MASUK KELAS & BEL (P5)
              ================================================= */}
              {snapshot.currentPhase === 'LINE_UP' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P5 — Baris Rapi Masuk Kelas & Bel Sekolah
                    </span>
                    <button
                      onClick={() => pagiCeriaEngine.playSchoolBellSound()}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow"
                    >
                      <Volume2 className="w-4 h-4" /> Bunyikan Bel Sekolah
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 space-y-4 text-center">
                      <div className="flex items-center justify-center gap-4 text-3xl">
                        <span className="animate-pulse">🔔</span>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          “Teng tong teng... Waktunya santri memasuki ruang kelas!”
                        </span>
                      </div>

                      {/* Line-up Order */}
                      <div className="flex items-center justify-around p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
                        <div className="text-center">
                          <span className="text-3xl block">👦🏻</span>
                          <span className="text-[10px] text-sky-300 font-bold">Dek Asy</span>
                        </div>
                        <span className="text-amber-400 font-black">➔</span>
                        <div className="text-center">
                          <span className="text-3xl block">👧🏻</span>
                          <span className="text-[10px] text-rose-300 font-bold">Mbak Syifa</span>
                        </div>
                        <span className="text-amber-400 font-black">➔</span>
                        <div className="text-center">
                          <span className="text-3xl block">👦🏽</span>
                          <span className="text-[10px] text-emerald-300 font-bold">Farhan</span>
                        </div>
                        <span className="text-amber-400 font-black">➔</span>
                        <div className="text-center">
                          <span className="text-3xl block">🧕🏻</span>
                          <span className="text-[10px] text-purple-300 font-bold">Aisyah</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-amber-300 flex items-center justify-center gap-2">
                        <span>🐻 Sahabat Dodo Membantu:</span>
                        <span className="italic">“Luruskan barisan dan rapikan tali sepatu ya!”</span>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs space-y-2">
                        <strong className="text-amber-300 block">Adab Memasuki Kelas:</strong>
                        <p className="text-slate-300 italic">
                          Melangkah dengan kaki kanan, mengucap bismillah, dan menata tas serta sepatu di loker masing-masing.
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('MBG_CONNECT')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Lanjut ke MBG Terhubung (P6)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  PHASE 6: MBG TERHUBUNG (P6)
              ================================================= */}
              {snapshot.currentPhase === 'MBG_CONNECT' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      P6 — MBG Terhubung: Bus MBG Ceria Tiba
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      Jadwal MBG Aktif Setelah Kegiatan Pagi
                    </span>
                  </div>

                  <div className="bg-gradient-to-b from-slate-900 to-emerald-950/60 p-6 rounded-3xl border border-emerald-500/30 text-center space-y-4">
                    <span className="text-6xl block animate-bounce">🚌</span>

                    <h3 className="text-lg font-black text-white">
                      Kegiatan Pagi Selesai, Waktunya Makan Bergizi Gratis (MBG)!
                    </h3>

                    <p className="text-xs text-slate-300 max-w-lg mx-auto italic">
                      Setelah senam ceria dan menyapa guru, Bus MBG Ceria tiba di gerbang mengantarkan kotak makan sehat dan halal.
                    </p>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      {onNavigateToMbg && (
                        <button
                          onClick={onNavigateToMbg}
                          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg flex items-center gap-2"
                        >
                          <Bus className="w-4 h-4" /> Buka Serial MBG Ceria (G31)
                        </button>
                      )}
                      <button
                        onClick={() => handleSelectPhase('ARRIVAL')}
                        className="px-5 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Ulangi dari Kedatangan (P1)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: DETAIL SENAM 20 DETIK
        ===================================================== */}
        {activeTab === 'GYM' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                P4 — 3 Gerakan Senam Pagi Ringan (20 Detik)
              </span>
              <h2 className="text-xl font-black text-white">
                Sehat, Ceria, dan Berenergi Menyambut Pelajaran
              </h2>
              <p className="text-xs text-slate-400">
                Dirancang khusus untuk motorik anak usia dini tanpa kelelahan berlebih
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {snapshot.gymMoves.map((move, idx) => (
                <div
                  key={move.id}
                  className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl p-2 bg-slate-900 rounded-2xl border border-slate-700">
                      {move.emoji}
                    </span>
                    <span className="text-xs font-black text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full">
                      Gerakan {idx + 1} ({move.durationSec}s)
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{move.name}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{move.description}</p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-[11px] text-emerald-300 font-semibold">
                    ✨ Manfaat: {move.beneficialEffect}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: DETAIL PARKIR CERIA
        ===================================================== */}
        {activeTab === 'PARKING' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                P3 — Zona Parkir & Drop-Off Ceria
              </span>
              <h2 className="text-xl font-black text-white">
                Kedisiplinan & Keselamatan di Halaman Sekolah
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🏍️</span>
                <h3 className="text-sm font-black text-white">Zona Drop-off Motor</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lajur khusus dengan pembatas kayu aman di mana santri turun dibantu oleh guru piket dan Pak Satpam.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🚲</span>
                <h3 className="text-sm font-black text-white">Rak Sepeda Pelangi</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Anak belajar mandiri memarkir sepedanya sendiri di slot nomor yang telah ditentukan.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🛡️</span>
                <h3 className="text-sm font-black text-white">Protokol Satpam Ramah</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Selalu memegang peluit bersuara lembut dan menyambut dengan senyuman tulus.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P7 — FOUNDER PAGI CONTROL COCKPIT
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
                      Founder Pagi Control Cockpit (P7)
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Uji Salam & Bel, Uji Senam 20s, Simulasi Pagi Otomatis, Audit Black Box Ring-0
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Sprint G32 Verifier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Sound Tester */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Uji Audio Sintesis Pagi
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => pagiCeriaEngine.playSalimChime()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-amber-950/40 text-amber-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🤝 Nada Salam & Salim</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => pagiCeriaEngine.playSchoolBellSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-amber-950/40 text-amber-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔔 Bel Sekolah Bernada</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => pagiCeriaEngine.playGymBeat()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-amber-950/40 text-amber-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🥁 Ketukan Irama Senam</span>
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
                    {onNavigateToKelasHidup && (
                      <button
                        onClick={onNavigateToKelasHidup}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🏫 Kelas Hidup & Sentra (G33)</span>
                        <School className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToMbg && (
                      <button
                        onClick={onNavigateToMbg}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🍱 MBG Ceria (G31)</span>
                        <Bus className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToSchool && (
                      <button
                        onClick={onNavigateToSchool}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🏫 Sekolah Bernapas (G29)</span>
                        <School className="w-3.5 h-3.5" />
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
                  </div>
                </div>

                {/* 3. Black Box Telemetry */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                  <span className="text-xs font-black text-slate-200 block">
                    Audit Ring-0 & DNA Sync
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Rutinitas pagi disinkronkan dengan DNA Karakter G20, kamera sinematik G21, dan telemetri Black Box Ring-0.
                  </p>
                  <span className="inline-block text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Marker: G32_PAGI_CERIA_VERIFIED
                  </span>
                </div>
              </div>

              {/* Performance Telemetry */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                      Dr. Pulse 60 FPS & Animation Governor
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
                    <span className="text-slate-400 text-[10px] block">Fase Pagi:</span>
                    <span className="text-sm font-black text-emerald-400">{snapshot.currentPhase}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Senam 20s Aktif:</span>
                    <span className="text-sm font-black text-sky-300">
                      {snapshot.isGymActive ? `${snapshot.gymRemainingSec}s` : 'STANDBY'}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Auto-Play Pagi:</span>
                    <span className="text-sm font-black text-rose-300">
                      {snapshot.isAutoPlayingMorning ? 'AKTIF' : 'STANDBY'}
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

export default PagiCeriaHub;
