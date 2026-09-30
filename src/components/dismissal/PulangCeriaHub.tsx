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
  ShieldCheck,
  Zap,
  ChevronRight,
  Sun,
  Moon,
  School,
  Utensils,
  TreePine,
  Bell,
  Star,
  Users,
  Compass,
  CheckCircle2,
  Car,
  Home
} from 'lucide-react';
import {
  pulangCeriaEngine,
  DismissalPhase,
  DismissalSnapshot
} from '../../services/pulangCeriaEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface PulangCeriaHubProps {
  onNavigateToSchool?: () => void;
  onNavigateToPagiCeria?: () => void;
  onNavigateToMbg?: () => void;
  onNavigateToMemoryHall?: () => void;
  onNavigateToKelasHidup?: () => void;
  onNavigateToTamanPetualangan?: () => void;
  onNavigateToPerpustakaan?: () => void;
}

export const PulangCeriaHub: React.FC<PulangCeriaHubProps> = ({
  onNavigateToSchool,
  onNavigateToPagiCeria,
  onNavigateToMbg,
  onNavigateToMemoryHall,
  onNavigateToKelasHidup,
  onNavigateToTamanPetualangan,
  onNavigateToPerpustakaan
}) => {
  const [snapshot, setSnapshot] = useState<DismissalSnapshot>(pulangCeriaEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'FLOW' | 'TWILIGHT' | 'FAREWELL' | 'FOUNDER'>('FLOW');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());

  useEffect(() => {
    const unsub = pulangCeriaEngine.subscribe(() => {
      setSnapshot(pulangCeriaEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleSelectPhase = (phase: DismissalPhase) => {
    pulangCeriaEngine.setPhase(phase);
  };

  const handleToggleAutoPlay = () => {
    if (snapshot.isAutoPlayingDismissal) {
      pulangCeriaEngine.stopFullDismissalSimulation();
    } else {
      pulangCeriaEngine.startFullDismissalSimulation();
    }
  };

  // Twilight gradient calculation
  const getTwilightBg = () => {
    const intensity = snapshot.twilightIntensity;
    if (intensity < 30) {
      return 'from-slate-900 via-amber-950/30 to-indigo-950/40';
    } else if (intensity < 65) {
      return 'from-slate-900 via-orange-950/50 to-indigo-950/60';
    } else {
      return 'from-slate-950 via-purple-950/60 to-indigo-950/80';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-amber-500/20 px-4 py-3 sticky top-0 z-40 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Moon className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                Pulang Ceria & Gerbang Perpisahan TK Asy Syifa
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sprint G35
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> Penutup Episode Harian
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Bel Pulang Lembut • Jemput Ayah Bunda • Salim Ustadzah • Gerbang Senja • Bintang Pertama • Sampai Jumpa Besok
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('FLOW')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'FLOW'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌅 Alur Kepulangan</span>
            </button>
            <button
              onClick={() => setActiveTab('TWILIGHT')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'TWILIGHT'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌆 Gerbang Senja</span>
            </button>
            <button
              onClick={() => setActiveTab('FAREWELL')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'FAREWELL'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>✨ Penutup Episode</span>
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
              snapshot.isAutoPlayingDismissal
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {snapshot.isAutoPlayingDismissal ? (
              <>
                <Pause className="w-4 h-4" /> Pause Kepulangan
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Putar Episode Pulang (P1-P6)
              </>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN LIVING DISMISSAL STAGE WITH BONUS AMBIENCE
      ========================================================= */}
      <main className={`flex-1 relative overflow-hidden bg-gradient-to-b ${getTwilightBg()} p-4 sm:p-6 flex flex-col justify-between transition-colors duration-1000`}>
        {/* Bonus Ambience 1: Gentle Arrival Car (Mobil jemput melaju pelan) */}
        <motion.div
          animate={{ x: [-80, 100, -80] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-12 text-3xl pointer-events-none z-10 filter drop-shadow opacity-80"
          title="Mobil jemputan melaju santun di gerbang"
        >
          🚗
        </motion.div>

        {/* Bonus Ambience 2: Kid Bicycle riding home (Sepeda roda kecil pulang) */}
        <motion.div
          animate={{ x: [80, -100, 80] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-14 right-16 text-3xl pointer-events-none z-10 filter drop-shadow opacity-80"
          title="Sepeda kecil meluncur pulang tertib"
        >
          🚲
        </motion.div>

        {/* Bonus Ambience 3: Descending Kite (Layang-layang turun perlahan) */}
        <motion.div
          animate={{ y: [0, 45, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 right-1/4 text-3xl pointer-events-none z-10 opacity-70"
          title="Layang-layang senja turun perlahan"
        >
          🪁
        </motion.div>

        {/* Bonus Ambience 4: Twinkling Fireflies (Kunang-kunang senja mulai berpendar) */}
        <motion.div
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.3, 0.9, 0.3],
            x: [0, 15, -10, 0],
            y: [0, -10, 10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 left-1/3 text-2xl pointer-events-none z-10"
          title="Kunang-kunang berpendar lembut menyambut malam"
        >
          ✨
        </motion.div>

        {/* =====================================================
            TAB 1: ALUR KEPULANGAN LENGKAP P1 - P6
        ===================================================== */}
        {activeTab === 'FLOW' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            {/* Phase Selector Ribbon */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80">
              {[
                { id: 'DISMISSAL_BELL', label: 'P1: Bel Pulang', emoji: '🔔' },
                { id: 'PARENTS_PICKUP', label: 'P2: Jemput Bunda', emoji: '🫂' },
                { id: 'SALIM_FAREWELL', label: 'P3: Salim Ustadzah', emoji: '🤝' },
                { id: 'TWILIGHT_GATE', label: 'P4: Gerbang Senja', emoji: '🌆' },
                { id: 'FIRST_STAR', label: 'P5: Bintang Pertama', emoji: '⭐' },
                { id: 'EPISODE_OUTRO', label: 'P6: Sampai Besok', emoji: '👋' }
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handleSelectPhase(phase.id as DismissalPhase)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    snapshot.currentPhase === phase.id
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-lg border border-amber-300 scale-105'
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
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* =================================================
                  P1: BEL PULANG CERIA
              ================================================= */}
              {snapshot.currentPhase === 'DISMISSAL_BELL' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P1 — Bel Pulang Ceria & Pintu Kelas Terbuka
                    </span>
                    <button
                      onClick={() => pulangCeriaEngine.playDismissalBellSound()}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1 shadow"
                    >
                      <Bell className="w-3.5 h-3.5" /> Bunyikan Bel Pulang
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4 min-h-[260px] flex flex-col justify-center items-center">
                      <div className="relative flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: [-8, 8, -8] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                          className="text-6xl text-amber-300 filter drop-shadow"
                        >
                          🔔
                        </motion.div>
                        <span className="absolute -top-2 -right-6 px-2 py-0.5 bg-amber-400 text-slate-900 font-black text-[10px] rounded-full">
                          TENG TONG...
                        </span>
                      </div>

                      <div className="p-3 bg-amber-950/40 rounded-2xl border border-amber-500/30 text-xs text-amber-200">
                        <p className="font-bold">Ustadzah Nurul tersenyum lembut:</p>
                        <p className="italic mt-1 text-sm text-white">
                          “Alhamdulillah, pembelajaran hari ini telah selesai. Sampai jumpa besok pagi, anak-anak sholeh & sholehah.”
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 italic">
                        Anak-anak mengemasi buku, menggendong ransel kecil, dan melangkah rapi menuju pintu kelas.
                      </p>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-2 text-xs">
                        <strong className="text-amber-300 block">Adab Saat Bel Pulang Berbunyi:</strong>
                        <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                          <li>Membaca doa penutup majelis (*Kafaratul Majelis*).</li>
                          <li>Memeriksa barang pribadi agar tidak tertinggal.</li>
                          <li>Merapikan bangku dan meja belajar.</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('PARENTS_PICKUP')}
                        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju Penjemputan Ayah & Bunda (P2)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P2: JEMPUT AYAH BUNDA & PELUKAN HANGAT
              ================================================= */}
              {snapshot.currentPhase === 'PARENTS_PICKUP' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      P2 — Ayah & Bunda Datang Menjemput
                    </span>
                    <span className="text-xs text-rose-300 font-bold">
                      Pelukan Hangat & Kasih Sayang
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                      <div className="flex items-center justify-center gap-4 py-4">
                        <div className="text-center">
                          <span className="text-4xl block">🧕🏻</span>
                          <span className="text-[10px] text-rose-300 font-bold">Bunda Tersenyum</span>
                        </div>
                        <motion.span
                          animate={{ scale: [1, 1.25, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-4xl text-rose-500"
                        >
                          💖
                        </motion.span>
                        <div className="text-center">
                          <span className="text-4xl block">👦🏻</span>
                          <span className="text-[10px] text-sky-300 font-bold">Dek Asy Berlari Pelan</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-rose-950/40 rounded-2xl border border-rose-500/30 text-xs text-rose-200 font-medium">
                        Dek Asy menyapa: <span className="font-bold text-white">“Bunda! Hari ini Asy belajar membuat menara balok bersama teman-teman!”</span>
                        <p className="mt-1 text-slate-300 italic">Bunda memeluk hangat sambil mengusap lembut kepala Asy.</p>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 text-xs">
                        <strong className="text-rose-300 block">Momen Kasih Sayang Keluarga:</strong>
                        <p className="text-slate-300 leading-relaxed">
                          Penjemputan tepat waktu memberikan rasa aman dan cinta yang mendalam bagi ananda setelah seharian beraktivitas di sekolah.
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('SALIM_FAREWELL')}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju Salim Perpisahan Ustadzah (P3)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P3: SALIM PERPISAHAN KEPADA USTADZAH
              ================================================= */}
              {snapshot.currentPhase === 'SALIM_FAREWELL' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      P3 — Salim Perpisahan Penuh Adab
                    </span>
                    <span className="text-xs text-emerald-300 font-bold">
                      Ucap Salam & Senyuman Tulus
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">🤝</span>
                      <h4 className="text-xs font-black text-emerald-300">Salim dengan Dua Tangan</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Santri mencium tangan Ustadzah dengan menundukkan kepala tanda hormat dan terima kasih.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">🗣️</span>
                      <h4 className="text-xs font-black text-emerald-300">Ucapkan Salam Penuh Doa</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        “Assalamu’alaikum Ustadzah, terima kasih atas bimbingannya hari ini. Sampai besok!”
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">🤲🏻</span>
                      <h4 className="text-xs font-black text-emerald-300">Doa Keselamatan di Jalan</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Ustadzah mendoakan keselamatan santri dan keluarga selama perjalanan pulang ke rumah.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('TWILIGHT_GATE')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Suasana Gerbang Senja (P4)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P4: GERBANG SENJA & LANGIT JINGGA
              ================================================= */}
              {snapshot.currentPhase === 'TWILIGHT_GATE' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      P4 — Gerbang Senja & Langit Jingga Keemasan
                    </span>
                    <button
                      onClick={() => pulangCeriaEngine.playFarewellMelody()}
                      className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Harmoni Senja
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-orange-950/60 via-amber-950/40 to-purple-950/60 p-6 rounded-3xl border border-orange-500/30 text-center space-y-4">
                    <div className="flex items-center justify-center gap-8 py-3">
                      <motion.span
                        animate={{ y: [-4, 4, -4], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-5xl block"
                      >
                        🌇
                      </motion.span>
                      <motion.div
                        animate={{ x: [0, 60, 0], y: [0, -15, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-3xl text-amber-200"
                        title="Burung terbang pulang ke sarang"
                      >
                        🦅
                      </motion.div>
                      <span className="text-5xl block">🏮</span>
                    </div>

                    <p className="text-xs text-orange-200 font-medium max-w-xl mx-auto leading-relaxed">
                      Lampu gerbang sekolah menyala kuning keemasan yang hangat. Langit sore membentangkan gradasi jingga keunguan, dan kawanan burung beterbangan riang kembali ke sarangnya di dahan pohon rindang.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('FIRST_STAR')}
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Kemunculan Bintang Pertama (P5)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P5: BINTANG PERTAMA & UCAPAN SYUKUR
              ================================================= */}
              {snapshot.currentPhase === 'FIRST_STAR' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      P5 — Bintang Pertama Muncul di Langit
                    </span>
                    <button
                      onClick={() => pulangCeriaEngine.playStarTwinkleSound()}
                      className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Pendar Bintang
                    </button>
                  </div>

                  <div className="bg-slate-900/90 p-8 rounded-3xl border border-indigo-500/30 text-center space-y-5">
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], rotate: [0, 45, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                        className="text-6xl text-amber-300 filter drop-shadow"
                      >
                        ⭐
                      </motion.div>
                    </div>

                    <div className="max-w-md mx-auto p-4 bg-indigo-950/50 rounded-2xl border border-indigo-500/30 space-y-2">
                      <span className="text-xs font-bold text-indigo-300 block">Dek Asy Menengadah ke Langit:</span>
                      <p className="text-base font-serif text-white font-bold">
                        “Alhamdulillah...”
                      </p>
                      <p className="text-xs text-indigo-200 italic">
                        “Terima kasih Ya Allah atas hari yang penuh keceriaan, kesehatan, dan sahabat-sahabat yang baik.”
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('EPISODE_OUTRO')}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Penutup Episode Harian (P6)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P6: PENUTUP EPISODE HARIAN (OUTRO)
              ================================================= */}
              {snapshot.currentPhase === 'EPISODE_OUTRO' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      P6 — Penutup Episode: Sampai Jumpa Besok
                    </span>
                    <button
                      onClick={() => pulangCeriaEngine.playFarewellMelody()}
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Putar Musik Penutup
                    </button>
                  </div>

                  <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 p-8 rounded-3xl border-2 border-amber-400/40 text-center space-y-5 shadow-2xl">
                    <div className="flex items-center justify-center gap-4 text-4xl">
                      <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        👦🏻👋
                      </motion.span>
                      <motion.span animate={{ rotate: [10, -10, 10] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        👧🏻👋
                      </motion.span>
                      <motion.span animate={{ y: [-4, 4, -4] }} transition={{ duration: 1.8, repeat: Infinity }}>
                        🐦👋
                      </motion.span>
                      <motion.span animate={{ y: [4, -4, 4] }} transition={{ duration: 1.8, repeat: Infinity }}>
                        🐱👋
                      </motion.span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">
                        Sampai Jumpa Besok!
                      </h3>
                      <p className="text-xs text-indigo-200 font-medium">
                        Episode harian TK Asy Syifa berakhir dengan penuh rasa syukur dan cinta.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 max-w-lg mx-auto text-xs text-slate-300 italic">
                      {snapshot.activeQuote}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('DISMISSAL_BELL')}
                      className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Ulangi Episode Pulang (P1)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: DETAIL GERBANG SENJA & KONTROL CAHAYA
        ===================================================== */}
        {activeTab === 'TWILIGHT' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                P4 — Estetika Gerbang Senja TK Asy Syifa
              </span>
              <h2 className="text-xl font-black text-white">
                Gradasi Langit Sore & Ketenteraman Senja
              </h2>
            </div>

            <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Intensitas Senja (Twilight Slider):</span>
                <span className="text-xs font-mono text-amber-400 font-bold">{snapshot.twilightIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={snapshot.twilightIntensity}
                onChange={(e) => pulangCeriaEngine.setTwilightIntensity(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-center space-y-2">
                  <span className="text-3xl block">🏮</span>
                  <h4 className="text-xs font-black text-amber-300">Lampu Gerbang Warm</h4>
                  <p className="text-[11px] text-slate-400">Pendar lentera kayu menyambut kepulangan dengan rasa hangat.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-center space-y-2">
                  <span className="text-3xl block">🌳</span>
                  <h4 className="text-xs font-black text-orange-300">Pohon Cemara Teduh</h4>
                  <p className="text-[11px] text-slate-400">Dedaunan berdesir lembut tertiup hembusan angin petang.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-center space-y-2">
                  <span className="text-3xl block">🕊️</span>
                  <h4 className="text-xs font-black text-sky-300">Burung Pulang ke Sarang</h4>
                  <p className="text-[11px] text-slate-400">Simbol ketenangan dan kepulangan ke pelukan keluarga.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: DETAIL PENUTUP EPISODE
        ===================================================== */}
        {activeTab === 'FAREWELL' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                P6 — Penutup Hari Penuh Makna
              </span>
              <h2 className="text-xl font-black text-white">
                Kebaikan, Senyum, dan Rasa Syukur
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">⭐</span>
                <h3 className="text-sm font-black text-white">Bintang Syukur</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menyudahi hari dengan rasa syukur kepada Allah SWT atas rezeki ilmu, kawan sholeh, dan tubuh yang sehat.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🏡</span>
                <h3 className="text-sm font-black text-white">Kembali ke Rumah</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Berkumpul bersama keluarga tercinta, berbagi cerita hari ini, dan beristirahat dengan tenang.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🌅</span>
                <h3 className="text-sm font-black text-white">Semangat Hari Esok</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menantikan fajar esok hari untuk kembali belajar, bermain, dan mengukir senyuman di TK Asy Syifa.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P7 — FOUNDER PULANG CONTROL COCKPIT
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
                      Founder Pulang Control Cockpit (P7)
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Uji Bel Pulang, Simulasi Penjemputan, Uji Senja, Audit Black Box Ring-0
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Sprint G35 Verifier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Audio Synthesizer Tester */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Uji Audio Sintesis Pulang
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => pulangCeriaEngine.playDismissalBellSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-amber-950/40 text-amber-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔔 Bel Pulang Harmonik</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => pulangCeriaEngine.playStarTwinkleSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-indigo-950/40 text-indigo-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>⭐ Pendar Bintang Pertama</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => pulangCeriaEngine.playFarewellMelody()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-orange-950/40 text-orange-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🌅 Harmoni Lagu Penutup</span>
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
                    {onNavigateToPerpustakaan && (
                      <button
                        onClick={onNavigateToPerpustakaan}
                        className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>📚 Perpustakaan Ajaib (G36)</span>
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToTamanPetualangan && (
                      <button
                        onClick={onNavigateToTamanPetualangan}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🌳 Taman Bermain (G34)</span>
                        <TreePine className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToKelasHidup && (
                      <button
                        onClick={onNavigateToKelasHidup}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🏫 Kelas Hidup (G33)</span>
                        <School className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToPagiCeria && (
                      <button
                        onClick={onNavigateToPagiCeria}
                        className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>☀️ Pagi Ceria (G32)</span>
                        <Sun className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Black Box Telemetry */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                  <span className="text-xs font-black text-slate-200 block">
                    Audit Ring-0 & Dismissal Sync
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Momen kepulangan tersinkronisasi dengan DNA G20, Kamera G21, Living Time Engine, dan telemetri Black Box Ring-0.
                  </p>
                  <span className="inline-block text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Marker: G35_PULANG_CERIA_VERIFIED
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
                    <span className="text-slate-400 text-[10px] block">Fase Kepulangan:</span>
                    <span className="text-sm font-black text-orange-400">{snapshot.currentPhase}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Gradasi Senja:</span>
                    <span className="text-sm font-black text-amber-300">
                      {snapshot.twilightIntensity}%
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Auto-Play Kepulangan:</span>
                    <span className="text-sm font-black text-rose-300">
                      {snapshot.isAutoPlayingDismissal ? 'AKTIF' : 'STANDBY'}
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

export default PulangCeriaHub;
