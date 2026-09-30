import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Sun,
  Moon,
  Volume2,
  Bell,
  Sliders,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Play,
  Heart,
  BookOpen,
  Award,
  ChevronRight,
  RefreshCw,
  Eye,
  Feather,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import {
  sekolahBernapasEngine,
  SchoolBellMode,
  LivingClassroomObject,
  LivingFloraItem,
  LivingAnnouncement
} from '../../services/sekolahBernapasEngine';
import { TimePhase } from '../../services/livingWorldEngine';
import { SchoolEventType } from '../../services/livingEventEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface SekolahBernapasHubProps {
  onNavigateToWorldMap?: () => void;
}

export const SekolahBernapasHub: React.FC<SekolahBernapasHubProps> = ({ onNavigateToWorldMap }) => {
  const [snapshot, setSnapshot] = useState(sekolahBernapasEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'CAMPUS' | 'CLASSROOM' | 'ANNOUNCEMENTS' | 'COCKPIT'>('CAMPUS');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());
  const [asyGreetingVisible, setAsyGreetingVisible] = useState(true);

  useEffect(() => {
    const unsub = sekolahBernapasEngine.subscribe(() => {
      setSnapshot(sekolahBernapasEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleRingBell = (mode: SchoolBellMode) => {
    sekolahBernapasEngine.playSchoolBell(mode);
  };

  const getSkyGrad = () => {
    switch (snapshot.timePhase) {
      case 'PAGI':
        return 'from-amber-200 via-sky-200 to-sky-300';
      case 'SIANG':
        return 'from-sky-300 via-sky-200 to-emerald-100';
      case 'SORE':
        return 'from-orange-300 via-rose-300 to-indigo-900';
      case 'MALAM':
        return 'from-indigo-950 via-slate-900 to-sky-950';
      default:
        return 'from-sky-200 to-emerald-100';
    }
  };

  const getEventDecor = () => {
    switch (snapshot.activeEvent) {
      case 'RAMADHAN':
        return { label: '🌙 Ramadhan Penuh Berkah', banner: 'Marhaban Ya Ramadhan' };
      case 'IDUL_FITRI':
        return { label: '🕌 Idul Fitri Ceria', banner: 'Selamat Hari Raya Idul Fitri' };
      case 'WISUDA':
        return { label: '🎓 Haflah Akhirussanah', banner: 'Wisuda Santri Cilik Asy-Syifa' };
      case 'KEMERDEKAAN':
        return { label: '🇮🇩 Gebyar Kemerdekaan RI', banner: 'Dirgahayu Republik Indonesia' };
      case 'HARI_SANTRI':
        return { label: '🌿 Hari Santri Nasional', banner: 'Santri Berakhlak Mulia' };
      default:
        return { label: '🌟 Hari Belajar Penuh Keceriaan', banner: 'TK Islam Terpadu Asy-Syifa' };
    }
  };

  const eventDecor = getEventDecor();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION BAR
      ========================================================= */}
      <header className="bg-white/95 backdrop-blur border-b border-emerald-100 px-4 py-3 sticky top-0 z-40 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                Sekolah Bernapas
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Sprint G29
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-teal-700 text-white shadow-sm">
                {eventDecor.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Lingkungan Sekolah Hidup & Berakhlak • Gerbang Sahabat, Bel Ceria & Kelas Bernyawa
            </p>
          </div>
        </div>

        {/* Action Tabs & Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('CAMPUS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'CAMPUS'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏫 Halaman & Gerbang</span>
            </button>
            <button
              onClick={() => setActiveTab('CLASSROOM')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'CLASSROOM'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎒 Kelas Bernyawa</span>
            </button>
            <button
              onClick={() => setActiveTab('ANNOUNCEMENTS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ANNOUNCEMENTS'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📌 Papan Pengumuman</span>
            </button>
            <button
              onClick={() => setActiveTab('COCKPIT')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'COCKPIT'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Founder Cockpit
            </button>
          </div>

          <button
            onClick={() => sekolahBernapasEngine.toggleEcoMode()}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
              snapshot.ecoModeActive
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Eco Mode"
          >
            <Zap className="w-3.5 h-3.5" />
            {snapshot.ecoModeActive ? 'Eco ON' : 'Eco Mode'}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN INTERACTIVE ENVIRONMENT STAGE
      ========================================================= */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* =====================================================
            TAB 1: CAMPUS & GERBANG SAHABAT (P1, P2, P4, P5)
        ===================================================== */}
        {activeTab === 'CAMPUS' && (
          <div className="flex-1 relative min-h-[600px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
            {/* Sky Background Sync with Living Time */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${getSkyGrad()} transition-all duration-1000`}
            />

            {/* Ambient Nature Particles (Bonus: Capung, Burung, Daun, Gelembung) */}
            {!snapshot.ecoModeActive && (
              <>
                {/* Floating Dragonfly (Capung) */}
                <motion.div
                  animate={{ x: [0, 40, 10, -20, 0], y: [0, -15, 10, -5, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-28 left-1/4 pointer-events-none text-2xl z-20"
                  title="Capung Sahabat"
                >
                  🛸
                </motion.div>

                {/* Sparrow Chirping (Burung Gereja) */}
                <motion.div
                  onClick={() => sekolahBernapasEngine.playSparrowChirp()}
                  whileHover={{ scale: 1.3 }}
                  animate={{ y: [0, -8, 0], x: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-20 right-1/4 cursor-pointer text-3xl z-20"
                  title="Burung Gereja Ceria (Klik untuk kicau!)"
                >
                  🐦
                </motion.div>

                {/* Floating Soap Bubbles */}
                <motion.div
                  animate={{ y: [40, -100], x: [-10, 20], opacity: [0.8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="absolute bottom-28 left-1/3 pointer-events-none text-2xl z-20"
                >
                  🫧
                </motion.div>

                {/* Falling Leaves (Daun Jatuh) */}
                <motion.div
                  animate={{ y: [-20, 300], x: [0, 30, -20, 10], rotate: [0, 180, 360] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-12 left-1/2 pointer-events-none text-xl z-20"
                >
                  🍃
                </motion.div>
              </>
            )}

            {/* ===================================================
                P2: BEL SEKOLAH CERIA (Top Floating Banner Widget)
            =================================================== */}
            <div className="relative z-30 max-w-xl mx-auto w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border-2 border-amber-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={
                    snapshot.activeBellMode
                      ? { rotate: [-15, 15, -15, 15, 0], scale: [1, 1.2, 1] }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 0.5, repeat: snapshot.activeBellMode ? Infinity : 0 }}
                  className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-500/20"
                >
                  🔔
                </motion.div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Bel Sekolah Ceria (P2)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    {snapshot.activeBellMode
                      ? `Sedang berbunyi: Nada ${snapshot.activeBellMode} 🎶`
                      : 'Pilih nada bel masuk, istirahat, atau pulang'}
                  </p>
                </div>
              </div>

              {/* 3 Bell Mode Buttons */}
              <div className="flex items-center gap-1.5">
                {(['MASUK', 'ISTIRAHAT', 'PULANG'] as SchoolBellMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleRingBell(mode)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                      snapshot.activeBellMode === mode
                        ? 'bg-amber-500 text-white shadow-md scale-105'
                        : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{mode === 'MASUK' ? 'Masuk' : mode === 'ISTIRAHAT' ? 'Istirahat' : 'Pulang'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ===================================================
                P1: GERBANG SAHABAT & HALAMAN (Main 3D Isometric View)
            =================================================== */}
            <div className="relative z-20 flex-1 my-4 flex flex-col items-center justify-center">
              {/* Campus Arc & School Title Header */}
              <div className="bg-emerald-800 text-white px-6 py-2 rounded-full font-black text-sm tracking-wide shadow-lg border-2 border-emerald-400 mb-3 flex items-center gap-2">
                <span>🕌</span>
                <span>{eventDecor.banner}</span>
              </div>

              {/* Physical Gate & Pillar Structure */}
              <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-emerald-300/80 flex flex-col items-center justify-between">
                {/* Gate Lamps & Light status (Lampu Menyala Malam) */}
                <div className="w-full flex justify-between items-center px-4 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-2xl filter drop-shadow ${
                        snapshot.gateLampsOn ? 'text-amber-400 animate-pulse' : 'text-slate-400'
                      }`}
                    >
                      🏮
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">
                      Lampu Gerbang: {snapshot.gateLampsOn ? 'Menyala Terang' : 'Mati'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-600">
                      Status Gerbang: {snapshot.gateState === 'OPEN' ? 'Terbuka Ramah' : 'Tertutup Rapi'}
                    </span>
                    <span
                      className={`text-2xl filter drop-shadow ${
                        snapshot.gateLampsOn ? 'text-amber-400 animate-pulse' : 'text-slate-400'
                      }`}
                    >
                      🏮
                    </span>
                  </div>
                </div>

                {/* Gate Physical Doors (Opens / Closes Smoothly) */}
                <div className="relative w-full h-40 bg-emerald-950/20 rounded-2xl border-2 border-emerald-400/50 overflow-hidden flex items-center justify-center">
                  {/* Left Door */}
                  <motion.div
                    animate={{ x: snapshot.gateState === 'OPEN' ? '-90%' : '0%' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-emerald-600 to-teal-700 border-r-2 border-amber-300 flex items-center justify-center text-white shadow-xl z-10"
                  >
                    <span className="text-3xl font-black opacity-80">🕌</span>
                  </motion.div>

                  {/* Right Door */}
                  <motion.div
                    animate={{ x: snapshot.gateState === 'OPEN' ? '90%' : '0%' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-emerald-600 to-teal-700 border-l-2 border-amber-300 flex items-center justify-center text-white shadow-xl z-10"
                  >
                    <span className="text-3xl font-black opacity-80">📖</span>
                  </motion.div>

                  {/* Behind Gate Courtyard View */}
                  <div className="text-center space-y-1 p-4">
                    <span className="text-4xl">🏫</span>
                    <p className="text-xs font-black text-emerald-950">
                      Halaman Sekolah Penuh Senyum & Doa
                    </p>
                    <p className="text-[10px] text-emerald-800">
                      Tempat bermain santri yang aman, bersih, dan menentramkan.
                    </p>
                  </div>
                </div>

                {/* Interactive Toggle Gate Button */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => sekolahBernapasEngine.toggleGate()}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{snapshot.gateState === 'OPEN' ? 'Tutup Gerbang' : 'Buka Gerbang'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ===================================================
                P1: DEK ASY GREETING & P4/P5 FLORA ROW (Bottom Garden)
            =================================================== */}
            <div className="relative z-30 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
              {/* Dek Asy Greeting Host (P1) */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-emerald-200 flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl p-2 bg-emerald-50 rounded-2xl border border-emerald-200"
                >
                  👦
                </motion.div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Dek Asy Menyapa</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Adab Salam
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-bold mt-1">
                    “Assalamu’alaikum teman-teman tersayang! Selamat datang di sekolah kita!”
                  </p>
                </div>
              </div>

              {/* P5: Pohon Berbisik (Living Wise Tree) */}
              <div
                onClick={() => sekolahBernapasEngine.triggerTreeWhisper()}
                className="bg-emerald-50/95 cursor-pointer backdrop-blur-md rounded-2xl p-4 shadow-lg border-2 border-emerald-300 hover:bg-emerald-100 transition-all flex items-center gap-3 group"
                title="Klik untuk mendengarkan bisikan hikmah pohon!"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">🌳</div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950">Pohon Berbisik (P5)</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Sentuh 🍃</span>
                  </div>
                  <p className="text-xs text-emerald-900 font-medium italic mt-1 line-clamp-2">
                    {snapshot.treeCurrentMessage}
                  </p>
                </div>
              </div>

              {/* P4: Bunga Menyapa (Interactive Garden Flowers) */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-pink-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block mb-1">
                    Bunga Menyapa (P4)
                  </span>
                  <div className="flex items-center gap-2">
                    {snapshot.floraItems.slice(1).map((f) => (
                      <motion.button
                        key={f.id}
                        onClick={() => sekolahBernapasEngine.interactWithFlora(f.id)}
                        whileHover={{ scale: 1.25, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-2xl p-1 bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-200 transition-all"
                        title={`${f.name}: ${f.speech}`}
                      >
                        {f.emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="text-right text-[10px] text-pink-700 font-semibold">
                  <span>🦋 Kupu-kupu & Capung singgah</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: KELAS BERNYAWA (P6)
        ===================================================== */}
        {activeTab === 'CLASSROOM' && (
          <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl shadow-md shadow-sky-500/20">
                    🎒
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Ruang Kelas Bernyawa (P6)
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Benda-Benda Belajar Memiliki Mikro Animasi, Suara Santun & Kepribadian Ramah
                    </p>
                  </div>
                </div>
              </div>

              {/* Classroom Interactive Objects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {snapshot.classroomObjects.map((obj) => (
                  <motion.div
                    key={obj.id}
                    onClick={() => sekolahBernapasEngine.interactWithClassroomObject(obj.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      obj.state === 'HAPPY'
                        ? 'bg-sky-50 border-sky-400 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <motion.span
                            animate={
                              obj.state === 'HAPPY'
                                ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }
                                : { scale: 1 }
                            }
                            className="text-4xl p-2 bg-white rounded-2xl shadow-sm border border-slate-100"
                          >
                            {obj.emoji}
                          </motion.span>
                          <div>
                            <h3 className="text-sm font-black text-slate-900">{obj.name}</h3>
                            <span className="text-xs font-semibold text-sky-700">
                              {obj.microAction}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                          {obj.soundLabel}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                        {obj.dialogue}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">Sentuh untuk berinteraksi</span>
                      <span className="text-sky-700 font-bold flex items-center gap-1">
                        Sapa <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: PAPAN PENGUMUMAN HIDUP (P3)
        ===================================================== */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
            <div className="bg-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-800/30 space-y-6">
              <div className="flex items-center justify-between border-b border-amber-300/40 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-600/20">
                    📌
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-amber-950">
                      Papan Pengumuman Hidup (P3)
                    </h2>
                    <p className="text-xs text-amber-900/80 font-semibold mt-0.5">
                      Kertas Membuka Sendiri • Daun Bergoyang Lembut • Bintang Hikmah Muncul
                    </p>
                  </div>
                </div>
              </div>

              {/* Notice Cards on Corkboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {snapshot.announcements.map((ann) => (
                  <motion.div
                    key={ann.id}
                    onClick={() => sekolahBernapasEngine.toggleAnnouncementFold(ann.id)}
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    className="relative bg-amber-50 p-5 rounded-2xl shadow-lg border-2 border-amber-200 cursor-pointer flex flex-col justify-between min-h-[220px]"
                  >
                    {/* Pin Pin on top */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">
                      📍
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{ann.badgeEmoji}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-900">
                          {ann.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 leading-snug">
                        {ann.title}
                      </h3>
                      <AnimatePresence>
                        {!ann.isFolded && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-slate-600 mt-2 leading-relaxed"
                          >
                            {ann.content}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-800">{ann.dateStr}</span>
                      <span className="text-amber-700 font-bold">
                        {ann.isFolded ? 'Buka Lipatan 📄' : 'Tutup Lipatan 📑'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: FOUNDER COCKPIT (P7)
        ===================================================== */}
        {activeTab === 'COCKPIT' && (
          <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20">
                    🎛️
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Founder Living School Control (P7)
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Uji Gerbang, Bel 3 Mode, Bunga, Pohon, Papan, dan Kelas Bernyawa
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Guardian Ring-0 Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Living Time Simulator */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Living Time (P1 Gerbang)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['PAGI', 'SIANG', 'SORE', 'MALAM'] as TimePhase[]).map((tp) => (
                      <button
                        key={tp}
                        onClick={() => sekolahBernapasEngine.setTimePhase(tp)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          snapshot.timePhase === tp
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tp === 'PAGI' && '🌅 Pagi (Buka)'}
                        {tp === 'SIANG' && '☀️ Siang (Buka)'}
                        {tp === 'SORE' && '🌇 Sore (Lampu)'}
                        {tp === 'MALAM' && '🌙 Malam (Tutup)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Living Event Simulator */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Living Event (P5 Pohon)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        'RAMADHAN',
                        'IDUL_FITRI',
                        'WISUDA',
                        'KEMERDEKAAN',
                        'HARI_SANTRI',
                        'REGULAR_DAY'
                      ] as SchoolEventType[]
                    ).map((ev) => (
                      <button
                        key={ev}
                        onClick={() => sekolahBernapasEngine.setActiveEvent(ev)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                          snapshot.activeEvent === ev
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ev === 'RAMADHAN' && '🌙 Ramadhan'}
                        {ev === 'IDUL_FITRI' && '🕌 Idul Fitri'}
                        {ev === 'WISUDA' && '🎓 Wisuda'}
                        {ev === 'KEMERDEKAAN' && '🇮🇩 17 Agustus'}
                        {ev === 'HARI_SANTRI' && '🌿 Hari Santri'}
                        {ev === 'REGULAR_DAY' && '🌟 Hari Biasa'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Audio & Micro Interactions Tester */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>Audio Synthesizer Tester</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleRingBell('MASUK')}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔔 Bel Masuk (C4-E4-G4-C5)</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRingBell('ISTIRAHAT')}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔔 Bel Istirahat (Arpeggio)</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRingBell('PULANG')}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔔 Bel Pulang (Lullaby)</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => sekolahBernapasEngine.playSparrowChirp()}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🐦 Kicau Burung Gereja</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance & Governor Diagnostics */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Dr. Pulse 60 FPS & TADE Governor
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">60.0 FPS • GUARANTEED</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Slot Animasi Aktif:</span>
                    <span className="text-sm font-black text-amber-300">{governorSlots} / 5</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Mode Hemat Daya:</span>
                    <span className="text-sm font-black text-emerald-400">
                      {snapshot.ecoModeActive ? 'AKTIF (Eco Mode)' : 'NORMAL'}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Pintu Gerbang:</span>
                    <span className="text-sm font-black text-sky-300">{snapshot.gateState}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Living Telemetri:</span>
                    <span className="text-sm font-black text-indigo-300">RING-0 LOGGED</span>
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

export default SekolahBernapasHub;
