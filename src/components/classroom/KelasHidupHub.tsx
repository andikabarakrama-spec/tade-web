import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Palette,
  Layers,
  Trees,
  Users,
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
  School,
  Sun,
  Bus,
  Home,
  CheckCircle2
} from 'lucide-react';
import { kelasHidupEngine, SentraPhase, PeranZone } from '../../services/kelasHidupEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface KelasHidupHubProps {
  onNavigateToSchool?: () => void;
  onNavigateToPagiCeria?: () => void;
  onNavigateToMbg?: () => void;
  onNavigateToKotaMini?: () => void;
  onNavigateToRumahKreatif?: () => void;
  onNavigateToTamanPetualangan?: () => void;
  onNavigateToPulangCeria?: () => void;
}

export const KelasHidupHub: React.FC<KelasHidupHubProps> = ({
  onNavigateToSchool,
  onNavigateToPagiCeria,
  onNavigateToMbg,
  onNavigateToKotaMini,
  onNavigateToRumahKreatif,
  onNavigateToTamanPetualangan,
  onNavigateToPulangCeria
}) => {
  const [snapshot, setSnapshot] = useState(kelasHidupEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'SENTRA' | 'CIRCLE' | 'PERAN' | 'FOUNDER'>('SENTRA');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());

  useEffect(() => {
    const unsub = kelasHidupEngine.subscribe(() => {
      setSnapshot(kelasHidupEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleSelectPhase = (phase: SentraPhase) => {
    kelasHidupEngine.setPhase(phase);
  };

  const handleToggleAutoPlay = () => {
    if (snapshot.isAutoPlayingClass) {
      kelasHidupEngine.stopFullSentraSimulation();
    } else {
      kelasHidupEngine.startFullSentraSimulation();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-indigo-500/20 px-4 py-3 sticky top-0 z-40 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <School className="w-6 h-6 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                Kelas Hidup & Sentra Ceria TK Asy Syifa
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sprint G33
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" /> Pembelajaran Sentra PAUD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Sentra Balok • Sentra Seni • Bahan Alam • Bermain Peran • Lingkaran Pagi & Doa Belajar
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('SENTRA')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'SENTRA'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🏫 5 Sentra Belajar</span>
            </button>
            <button
              onClick={() => setActiveTab('CIRCLE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'CIRCLE'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⭕ Lingkaran Pagi</span>
            </button>
            <button
              onClick={() => setActiveTab('PERAN')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'PERAN'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎭 Main Peran</span>
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
              snapshot.isAutoPlayingClass
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {snapshot.isAutoPlayingClass ? (
              <>
                <Pause className="w-4 h-4" /> Pause Kelas
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Putar Alur Sentra (P1-P6)
              </>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN LIVING CLASSROOM STAGE WITH BONUS AMBIENCE
      ========================================================= */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-indigo-950/40 p-4 sm:p-6 flex flex-col justify-between">
        {/* Bonus Ambience 1: Jumping pencil */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-12 text-3xl pointer-events-none z-10 filter drop-shadow"
        >
          ✏️
        </motion.div>

        {/* Bonus Ambience 2: Smiling Book reading */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [-3, 3, -3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 right-16 text-3xl pointer-events-none z-10 filter drop-shadow"
        >
          📖
        </motion.div>

        {/* Bonus Ambience 3: Gentle swaying wooden block */}
        <motion.div
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-12 left-8 text-3xl pointer-events-none z-10"
        >
          🧱
        </motion.div>

        {/* Bonus Ambience 4: Butterfly entering from open classroom window */}
        <motion.div
          animate={{ x: [-30, 90, -30], y: [0, -25, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 right-1/4 text-2xl pointer-events-none z-10 filter drop-shadow"
        >
          🦋
        </motion.div>

        {/* =====================================================
            TAB 1: SENTRA CERIA 3D INTERACTIVE EXPLORER
        ===================================================== */}
        {activeTab === 'SENTRA' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            {/* Sentra Selector Ribbon */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80">
              {[
                { id: 'ENTRANCE', label: 'P1: Pintu Kelas', emoji: '🚪' },
                { id: 'BALOK', label: 'P2: Sentra Balok', emoji: '🧱' },
                { id: 'SENI', label: 'P3: Sentra Seni', emoji: '🎨' },
                { id: 'BAHAN_ALAM', label: 'P4: Bahan Alam', emoji: '🌿' },
                { id: 'MAIN_PERAN', label: 'P5: Main Peran', emoji: '🎭' },
                { id: 'CIRCLE_TIME', label: 'P6: Lingkaran Pagi', emoji: '⭕' }
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handleSelectPhase(phase.id as SentraPhase)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    snapshot.currentPhase === phase.id
                      ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg border border-sky-300/40 scale-105'
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
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* =================================================
                  P1: MASUK KELAS CERIA
              ================================================= */}
              {snapshot.currentPhase === 'ENTRANCE' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      P1 — Pintu Kelas Terbuka Pelan & Adab Masuk
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Ucap Bismillah • Senyum & Langkah Kaki Kanan
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Animated Classroom Door View */}
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4 min-h-[260px] flex flex-col justify-center items-center">
                      <div className="w-48 h-48 bg-amber-900/40 border-4 border-amber-600/80 rounded-2xl relative flex items-center justify-center shadow-2xl">
                        <span className="text-6xl animate-pulse">🚪</span>
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-slate-900 rounded font-black text-[9px]">
                          KELAS ASY-SYIFA
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4 bg-slate-800/80 px-6 py-2.5 rounded-2xl border border-slate-700">
                        <div className="text-center">
                          <span className="text-3xl block">👦🏻</span>
                          <span className="text-[10px] text-sky-300 font-bold">Dek Asy: “Bismillah...”</span>
                        </div>
                        <span className="text-slate-500">|</span>
                        <div className="text-center">
                          <span className="text-3xl block">👧🏻</span>
                          <span className="text-[10px] text-rose-300 font-bold">Mbak Syifa: “Selamat Datang!”</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 text-xs">
                        <strong className="text-indigo-300 block">Nilai Karakter Masuk Kelas:</strong>
                        <ul className="text-slate-300 space-y-1 list-disc list-inside">
                          <li>Membuka pintu perlahan dengan santun.</li>
                          <li>Melafalkan nama Allah (Bismillah).</li>
                          <li>Menaruh sepatu dan ransel di loker pribadi.</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('BALOK')}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju Sentra Balok Hidup (P2)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P2: SENTRA BALOK HIDUP
              ================================================= */}
              {snapshot.currentPhase === 'BALOK' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P2 — Sentra Balok & Konstruksi
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      Dipandu oleh: Farhan & Dek Asy
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                      {/* Animated Wooden House Built */}
                      <div className="flex flex-col items-center justify-center py-4 space-y-1">
                        <span className="text-4xl">🔺</span>
                        <div className="flex gap-1 text-4xl">
                          <span>🧱</span>
                          <span>🧱</span>
                          <span>🧱</span>
                        </div>
                        <div className="flex gap-1 text-4xl">
                          <span>🟫</span>
                          <span>🟫</span>
                          <span>🟫</span>
                          <span>🟫</span>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-950/40 rounded-2xl border border-amber-500/30 text-xs text-amber-200 italic font-semibold">
                        “Balok kayu tersenyum ramah saat Farhan dan Dek Asy menyusun atap rumah mungil yang kokoh.”
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 text-xs">
                        <strong className="text-amber-300 block">Eksplorasi Sentra Balok:</strong>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                          <span className="bg-slate-800 p-2 rounded-lg">📐 Bentuk Geometri</span>
                          <span className="bg-slate-800 p-2 rounded-lg">⚖️ Keseimbangan</span>
                          <span className="bg-slate-800 p-2 rounded-lg">🤝 Kerjasama Tim</span>
                          <span className="bg-slate-800 p-2 rounded-lg">🏗️ Arsitek Cilik</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('SENI')}
                        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju Sentra Seni Hidup (P3)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P3: SENTRA SENI HIDUP
              ================================================= */}
              {snapshot.currentPhase === 'SENI' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      P3 — Sentra Seni & Kreativitas
                    </span>
                    <span className="text-xs text-rose-300 font-bold">
                      Dipandu oleh: Mbak Syifa & Aisyah
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                      <div className="flex items-center justify-center gap-5 py-4">
                        <motion.span
                          animate={{ rotate: [-10, 10, -10] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-5xl block"
                        >
                          🖍️
                        </motion.span>
                        <motion.span
                          animate={{ y: [-5, 5, -5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-5xl block"
                        >
                          🎨
                        </motion.span>
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2.2, repeat: Infinity }}
                          className="text-5xl block"
                        >
                          📜
                        </motion.span>
                      </div>

                      <div className="p-3 bg-rose-950/40 rounded-2xl border border-rose-500/30 text-xs text-rose-200 italic font-semibold">
                        “Krayon menari lembut di atas kertas gambar, melukis pemandangan pelangi dan bunga sekolah.”
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 text-xs">
                        <strong className="text-rose-300 block">Karya Sentra Seni:</strong>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                          <span className="bg-slate-800 p-2 rounded-lg">🖌️ Lukisan Cat Air</span>
                          <span className="bg-slate-800 p-2 rounded-lg">✂️ Kolase Kertas</span>
                          <span className="bg-slate-800 p-2 rounded-lg">🌈 Harmoni Warna</span>
                          <span className="bg-slate-800 p-2 rounded-lg">🖐️ Finger Painting</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('BAHAN_ALAM')}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju Sentra Bahan Alam (P4)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P4: SENTRA BAHAN ALAM
              ================================================= */}
              {snapshot.currentPhase === 'BAHAN_ALAM' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      P4 — Sentra Bahan Alam & Eksplorasi Sains
                    </span>
                    <span className="text-xs text-emerald-300 font-bold">
                      Dipandu oleh: Dek Asy & Sahabat Dodo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-2">
                      <span className="text-4xl block">🍃</span>
                      <h4 className="text-xs font-black text-emerald-300">Aneka Daun</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Mengenal tekstur halus, kasar, urat daun menyirip, dan aroma dedaunan segar.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-2">
                      <span className="text-4xl block">🪨</span>
                      <h4 className="text-xs font-black text-emerald-300">Batu Kerikil Halus</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Menimbang berat, menghitung jumlah, dan menyusun pola garis estetik.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-2">
                      <span className="text-4xl block">🌸</span>
                      <h4 className="text-xs font-black text-emerald-300">Kelopak Bunga</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Mencium keharuman alami bunga melati, kamboja, dan mengamati pigmen warna.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-2">
                      <span className="text-4xl block">🌾</span>
                      <h4 className="text-xs font-black text-emerald-300">Biji-bijian</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Menanam biji kacang hijau di kapas basah dan memilah biji jagung.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('MAIN_PERAN')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Sentra Bermain Peran (P5)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P5: SENTRA BERMAIN PERAN
              ================================================= */}
              {snapshot.currentPhase === 'MAIN_PERAN' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      P5 — Sentra Bermain Peran Makro & Mikro
                    </span>
                    <span className="text-xs text-purple-300 font-bold">
                      Simulasi Kehidupan Nyata Penuh Adab
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'KLINIK', name: '🏥 Klinik Cilik', desc: 'Merawat boneka & belajar rasa empati' },
                      { id: 'PASAR', name: '🛒 Pasar Mini', desc: 'Belajar jual beli jujur & mata uang' },
                      { id: 'MASJID', name: '🕌 Masjid Mini', desc: 'Adab sholat berjamaah & berwudhu' },
                      { id: 'KANTOR_POS', name: '📮 Kantor Pos', desc: 'Kirim surat persahabatan & doa' }
                    ].map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => kelasHidupEngine.setPeranZone(zone.id as PeranZone)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          snapshot.activePeranZone === zone.id
                            ? 'bg-purple-900/60 border-purple-400 text-white shadow-lg scale-105'
                            : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <h4 className="text-xs font-black text-purple-200">{zone.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">{zone.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 italic font-semibold text-center">
                    “Anak-anak belajar nilai sosial, kesabaran, kejujuran, dan komunikasi yang santun.”
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('CIRCLE_TIME')}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Lingkaran Pagi & Doa (P6)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P6: LINGKARAN PAGI (CIRCLE TIME)
              ================================================= */}
              {snapshot.currentPhase === 'CIRCLE_TIME' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      P6 — Lingkaran Pagi, Doa Belajar & Tepuk Semangat
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => kelasHidupEngine.playDoaBelajarChime()}
                        className="px-3 py-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Doa Belajar
                      </button>
                      <button
                        onClick={() => kelasHidupEngine.playTepukSemangatSound()}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs flex items-center gap-1 shadow"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Tepuk Semangat
                      </button>
                    </div>
                  </div>

                  {/* Circle Time Visual Display */}
                  <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                    <div className="max-w-md mx-auto p-4 bg-sky-950/40 rounded-2xl border border-sky-500/30 space-y-2">
                      <span className="text-xs font-bold text-sky-300 block">Lafal Doa Belajar:</span>
                      <p className="text-base font-serif text-white leading-relaxed">
                        رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا
                      </p>
                      <p className="text-xs text-sky-200 italic">
                        “Ya Allah, tambahkanlah ilmuku dan karuniakanlah kepadaku pemahaman yang baik.”
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold">
                        📖 Hafalan: Surah Al-Ikhlas
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold">
                        👏 Tepuk: Se-Ma-Ngat!
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold">
                        🌟 Ikrar Santri Ceria
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('ENTRANCE')}
                      className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Ulangi Alur Sentra (P1)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: DETAIL CIRCLE TIME
        ===================================================== */}
        {activeTab === 'CIRCLE' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/30">
                P6 — Lingkaran Pagi (Circle Time)
              </span>
              <h2 className="text-xl font-black text-white">
                Membangun Jiwa, Doa & Fokus Bersama Guru
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🤲🏻</span>
                <h3 className="text-sm font-black text-white">Doa Sebelum Belajar</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menengadahkan kedua tangan dengan khusyuk memohon tambahan ilmu yang bermanfaat dan rezeki kepahaman.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">📜</span>
                <h3 className="text-sm font-black text-white">Muroja’ah Surat Pendek</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Melantunkan ayat suci Al-Qur’an secara tartil bersama-sama dengan irama yang merdu dan tenang.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">👏</span>
                <h3 className="text-sm font-black text-white">Tepuk Semangat & Yel-yel</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Irama tepuk tangan kompak membangkitkan kegembiraan dan antusiasme belajar sepanjang hari.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: DETAIL MAIN PERAN
        ===================================================== */}
        {activeTab === 'PERAN' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                P5 — 4 Zona Bermain Peran
              </span>
              <h2 className="text-xl font-black text-white">
                Mengenal Peran Sosial & Adab Islami
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏥</span>
                  <h3 className="text-sm font-black text-purple-300">Klinik Cilik Ramah</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dek Asy menjadi dokter cilik yang memeriksa kesehatan boneka dengan sabar, mencontohkan sifat kasih sayang.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🛒</span>
                  <h3 className="text-sm font-black text-purple-300">Pasar Mini Kejujuran</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mbak Syifa belajar menimbang buah, menghitung uang koin mainan, dan mengucap terima kasih dengan tulus.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🕌</span>
                  <h3 className="text-sm font-black text-purple-300">Masjid Mini Khusyuk</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Farhan mengumandangkan adzan lembut dan santri meluruskan shaf sholat dengan tenang.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📮</span>
                  <h3 className="text-sm font-black text-purple-300">Kantor Pos Persahabatan</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mengirim kartu ucapan terima kasih untuk orang tua dan guru yang dimasukkan ke kotak pos merah.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P7 — FOUNDER SENTRA CONTROL COCKPIT
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
                      Founder Sentra Control Cockpit (P7)
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Preview Semua Sentra PAUD, Uji Audio Synthesizer, Simulasi Terpadu, Audit Black Box Ring-0
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Sprint G33 Verifier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Audio Synthesizer Tester */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Uji Audio Sintesis Sentra
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => kelasHidupEngine.playDoaBelajarChime()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-indigo-950/40 text-indigo-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🤲🏻 Doa Belajar Harmonik</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => kelasHidupEngine.playTepukSemangatSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-amber-950/40 text-amber-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>👏 Tepuk Semangat Ritmis</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => kelasHidupEngine.playSentraChime()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-sky-950/40 text-sky-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔔 Sentra Transition Chime</span>
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
                    {onNavigateToPulangCeria && (
                      <button
                        onClick={onNavigateToPulangCeria}
                        className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🌅 Pulang Ceria & Senja (G35)</span>
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToTamanPetualangan && (
                      <button
                        onClick={onNavigateToTamanPetualangan}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🌳 Taman Petualangan (G34)</span>
                        <Smile className="w-3.5 h-3.5" />
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
                    {onNavigateToSchool && (
                      <button
                        onClick={onNavigateToSchool}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🏫 Sekolah Bernapas (G29)</span>
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
                  </div>
                </div>

                {/* 3. Black Box Telemetry */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                  <span className="text-xs font-black text-slate-200 block">
                    Audit Ring-0 & PAUD Sentra Sync
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Setiap aktivitas sentra tersinkronisasi dengan DNA G20, Kamera G21, dan telemetri Black Box Ring-0.
                  </p>
                  <span className="inline-block text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Marker: G33_KELAS_HIDUP_VERIFIED
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
                    <span className="text-slate-400 text-[10px] block">Fase Sentra:</span>
                    <span className="text-sm font-black text-indigo-400">{snapshot.currentPhase}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Zona Main Peran:</span>
                    <span className="text-sm font-black text-purple-300">{snapshot.activePeranZone}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Auto-Play Sentra:</span>
                    <span className="text-sm font-black text-rose-300">
                      {snapshot.isAutoPlayingClass ? 'AKTIF' : 'STANDBY'}
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

export default KelasHidupHub;
