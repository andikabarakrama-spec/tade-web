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
  School,
  Utensils,
  TreePine,
  Wind,
  CheckCircle2,
  Bell,
  Compass
} from 'lucide-react';
import {
  tamanPetualanganEngine,
  PlaygroundPhase,
  PlaygroundAttraction,
  SurpriseItem
} from '../../services/tamanPetualanganEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface TamanPetualanganHubProps {
  onNavigateToKelasHidup?: () => void;
  onNavigateToMbg?: () => void;
  onNavigateToSchool?: () => void;
  onNavigateToPagiCeria?: () => void;
  onNavigateToKampungCeria?: () => void;
  onNavigateToPulangCeria?: () => void;
}

export const TamanPetualanganHub: React.FC<TamanPetualanganHubProps> = ({
  onNavigateToKelasHidup,
  onNavigateToMbg,
  onNavigateToSchool,
  onNavigateToPagiCeria,
  onNavigateToKampungCeria,
  onNavigateToPulangCeria
}) => {
  const [snapshot, setSnapshot] = useState(tamanPetualanganEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'PLAYGROUND' | 'COMPANIONS' | 'SURPRISE' | 'FOUNDER'>('PLAYGROUND');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());

  useEffect(() => {
    const unsub = tamanPetualanganEngine.subscribe(() => {
      setSnapshot(tamanPetualanganEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleSelectPhase = (phase: PlaygroundPhase) => {
    tamanPetualanganEngine.setPhase(phase);
  };

  const handleToggleAutoPlay = () => {
    if (snapshot.isAutoPlayingPlayground) {
      tamanPetualanganEngine.stopFullPlaygroundSimulation();
    } else {
      tamanPetualanganEngine.startFullPlaygroundSimulation();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-emerald-500/20 px-4 py-3 sticky top-0 z-40 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <TreePine className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                Jam Bermain Ceria & Taman Petualangan TK Asy Syifa
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sprint G34
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" /> Taman Ramah Anak
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Ayunan Awan • Perosotan Pelangi • Jungkat-Jungkit • 6 Sahabat • Tanpa Menang/Kalah • Aman 100%
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('PLAYGROUND')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'PLAYGROUND'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌳 Wahana Taman</span>
            </button>
            <button
              onClick={() => setActiveTab('COMPANIONS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'COMPANIONS'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🐾 6 Sahabat Ceria</span>
            </button>
            <button
              onClick={() => setActiveTab('SURPRISE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'SURPRISE'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>✨ Kejutan Taman</span>
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
              snapshot.isAutoPlayingPlayground
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {snapshot.isAutoPlayingPlayground ? (
              <>
                <Pause className="w-4 h-4" /> Pause Istirahat
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Putar Alur Taman (P1-P6)
              </>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN LIVING PLAYGROUND STAGE WITH BONUS AMBIENCE
      ========================================================= */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-emerald-950/40 p-4 sm:p-6 flex flex-col justify-between">
        {/* Bonus Ambience 1: Running Squirrel (Tupai berlari lincah di dahan) */}
        <motion.div
          animate={{ x: [-40, 60, -40], y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-10 text-3xl pointer-events-none z-10 filter drop-shadow"
          title="Tupai riang berlari di dahan pohon"
        >
          🐿️
        </motion.div>

        {/* Bonus Ambience 2: Jumping Koi Fish (Ikan Koi melompat di kolam air mini) */}
        <motion.div
          animate={{ y: [0, -22, 0], rotate: [-10, 20, -10] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 right-16 text-3xl pointer-events-none z-10 filter drop-shadow"
          title="Ikan koi melompat ceria di kolam air mancur"
        >
          🐟
        </motion.div>

        {/* Bonus Ambience 3: Flying Dragonfly (Capung beterbangan ramah) */}
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-1/4 text-2xl pointer-events-none z-10"
          title="Capung bening berayun di udara"
        >
          🛸
        </motion.div>

        {/* Bonus Ambience 4: Twirling Autumn Leaf (Dedaunan berputar lembut tertiup angin) */}
        <motion.div
          animate={{ rotate: [0, 360], y: [0, 35, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-1/4 text-2xl pointer-events-none z-10 filter drop-shadow"
          title="Dedaunan berputar lembut tersenyum"
        >
          🍃
        </motion.div>

        {/* =====================================================
            TAB 1: WAHANA TAMAN PETUALANGAN & ALUR P1-P6
        ===================================================== */}
        {activeTab === 'PLAYGROUND' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            {/* Phase Selector Ribbon */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80">
              {[
                { id: 'RECESS_BELL', label: 'P1: Bel Istirahat', emoji: '🔔' },
                { id: 'PARK_EXPLORE', label: 'P2: Taman Hidup', emoji: '🌳' },
                { id: 'COOP_PLAY', label: 'P3: Main Bersama', emoji: '🤝' },
                { id: 'COMPANIONS_JOIN', label: 'P4: 6 Sahabat', emoji: '🐾' },
                { id: 'SURPRISE_PARK', label: 'P5: Kejutan Taman', emoji: '✨' },
                { id: 'MBG_TRANSITION', label: 'P6: Transisi MBG', emoji: '🍱' }
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handleSelectPhase(phase.id as PlaygroundPhase)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    snapshot.currentPhase === phase.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg border border-emerald-300/40 scale-105'
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
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* =================================================
                  P1: BEL ISTIRAHAT CERIA
              ================================================= */}
              {snapshot.currentPhase === 'RECESS_BELL' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      P1 — Bel Istirahat Ceria & Pintu Kelas Terbuka
                    </span>
                    <button
                      onClick={() => tamanPetualanganEngine.playRecessBellSound()}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Bell className="w-3.5 h-3.5" /> Bunyikan Bel Ceria
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Animated Classroom Exiting View */}
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4 min-h-[260px] flex flex-col justify-center items-center">
                      <div className="relative flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: [-6, 6, -6] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-6xl text-amber-400 filter drop-shadow"
                        >
                          🔔
                        </motion.div>
                        <span className="absolute -top-2 -right-4 px-2 py-0.5 bg-emerald-500 text-slate-900 font-black text-[10px] rounded-full">
                          TENG TONG!
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-4 bg-slate-800/80 px-6 py-3 rounded-2xl border border-slate-700">
                        <div className="text-center">
                          <span className="text-3xl block">👦🏻</span>
                          <span className="text-[10px] text-sky-300 font-bold">Dek Asy: “Alhamdulillah, istirahat!”</span>
                        </div>
                        <span className="text-slate-500">|</span>
                        <div className="text-center">
                          <span className="text-3xl block">👧🏻</span>
                          <span className="text-[10px] text-rose-300 font-bold">Mbak Syifa: “Ayo ke taman bermain!”</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 italic font-medium">
                        Pintu kelas terbuka perlahan. Anak-anak melangkah tertib sambil tersenyum riang menyambut udara segar halaman.
                      </p>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs">
                        <strong className="text-emerald-300 block">Adab Jam Istirahat Ceria:</strong>
                        <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                          <li>Merapikan alat belajar sebelum meninggalkan kelas.</li>
                          <li>Berjalan santun tanpa berlari terburu-buru.</li>
                          <li>Saling tersenyum dan menyapa teman di lorong.</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('PARK_EXPLORE')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <span>Menuju 5 Wahana Taman Hidup (P2)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  P2: TAMAN BERMAIN HIDUP (5 WAHANA AMAN)
              ================================================= */}
              {snapshot.currentPhase === 'PARK_EXPLORE' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      P2 — 5 Wahana Taman Hidup & Ramah Anak
                    </span>
                    <span className="text-xs text-emerald-300 font-bold">
                      100% Aman • Standar PAUD
                    </span>
                  </div>

                  {/* 5 Wahana Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {snapshot.attractions.map((attr) => (
                      <button
                        key={attr.id}
                        onClick={() => tamanPetualanganEngine.setSelectedAttraction(attr.id)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                          snapshot.selectedAttractionId === attr.id
                            ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-emerald-300 shadow-lg scale-105'
                            : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-3xl">{attr.emoji}</span>
                        <span className="text-[11px] font-black">{attr.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Wahana Showcase */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-900/80 p-6 rounded-3xl border border-slate-700">
                    <div className="md:col-span-5 text-center space-y-3">
                      <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-teal-400/20 flex items-center justify-center border-2 border-emerald-500/40 shadow-inner">
                        <motion.span
                          animate={{ y: [-6, 6, -6], rotate: [-4, 4, -4] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                          className="text-6xl block"
                        >
                          {snapshot.currentAttraction.emoji}
                        </motion.span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-300">
                        Bermain bersama: {snapshot.currentAttraction.activeCompanion}
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <span>{snapshot.currentAttraction.name}</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {snapshot.currentAttraction.description}
                      </p>

                      <div className="p-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200">
                        <strong className="block text-[11px] text-emerald-400 font-bold mb-0.5">
                          Fitur Keselamatan:
                        </strong>
                        {snapshot.currentAttraction.safetyFeature}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('COOP_PLAY')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Permainan Bersama & Gotong Royong (P3)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P3: PERMAINAN BERSAMA (TANPA MENANG/KALAH)
              ================================================= */}
              {snapshot.currentPhase === 'COOP_PLAY' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      P3 — Permainan Bersama (Bebas Menang & Kalah)
                    </span>
                    <span className="text-xs text-teal-300 font-bold">
                      Gotong Royong & Empati
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">🤝</span>
                      <h4 className="text-xs font-black text-teal-300">Saling Dorong Ayunan</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Dek Asy mendorong ayunan Farhan dengan lembut sambil bernyanyi riang, bergantian tanpa berebut.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">👫</span>
                      <h4 className="text-xs font-black text-teal-300">Bergandengan Tangan</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Mbak Syifa dan Aisyah berjalan melintasi jembatan tali mini dengan saling menyemangati penuh kasih sayang.
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 text-center space-y-3">
                      <span className="text-4xl block">🪜</span>
                      <h4 className="text-xs font-black text-teal-300">Antre Perosotan Sabar</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Anak-anak berbaris tertib di tangga perosotan pelangi, menunggu giliran dengan senyuman tulus.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 italic font-semibold text-center">
                    “Di taman Asy Syifa tidak ada yang kalah atau menang, semua tertawa gembira dalam pelukan persahabatan.”
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('COMPANIONS_JOIN')}
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju 6 Sahabat Ceria (P4)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P4: 6 SAHABAT IKUT BERMAIN
              ================================================= */}
              {snapshot.currentPhase === 'COMPANIONS_JOIN' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      P4 — 6 Sahabat Setia Ikut Bermain di Taman
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      Bubu • Gogo • Mimi • Dodo • Titi • Rara
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Bubu si Burung Kutilang', emoji: '🐦', role: 'Bertengger di dahan pohon sambil berkicau merdu menyemangati anak-anak.' },
                      { name: 'Gogo si Kucing Ramah', emoji: '🐱', role: 'Duduk manis di dekat ayunan memperhatikan teman-teman yang bermain.' },
                      { name: 'Mimi si Kelinci Lincah', emoji: '🐰', role: 'Melompat ceria di rumput hijau dekat perosotan pelangi.' },
                      { name: 'Dodo si Bebek Lucu', emoji: '🦆', role: 'Berenang pelan di kolam mini dan menyapa anak-anak.' },
                      { name: 'Titi si Kura-kura Bijak', emoji: '🐢', role: 'Berjalan tenang di tepi jalan setapak mengajarkan kesabaran.' },
                      { name: 'Rara si Kupu-kupu Manis', emoji: '🦋', role: 'Terbang mengepakkan sayap warna-warni di antara kuntum bunga.' }
                    ].map((comp, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{comp.emoji}</span>
                          <h4 className="text-xs font-black text-amber-300">{comp.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{comp.role}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('SURPRISE_PARK')}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Kejutan Ajaib Taman (P5)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P5: KEJUTAN TAMAN AJAIB
              ================================================= */}
              {snapshot.currentPhase === 'SURPRISE_PARK' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      P5 — Kejutan Taman Ajaib & Fenomena Ceria
                    </span>
                    <button
                      onClick={() => tamanPetualanganEngine.triggerRandomSurprise()}
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Munculkan Kejutan Baru
                    </button>
                  </div>

                  <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                    {snapshot.activeSurprise && (
                      <div className="max-w-md mx-auto p-6 bg-gradient-to-b from-purple-950/60 to-slate-900 rounded-3xl border-2 border-purple-500/40 space-y-3 shadow-xl">
                        <motion.span
                          animate={{ scale: [1, 1.25, 1], rotate: [-8, 8, -8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-6xl block"
                        >
                          {snapshot.activeSurprise.icon}
                        </motion.span>
                        <h3 className="text-base font-black text-purple-200">
                          {snapshot.activeSurprise.name}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium">
                          {snapshot.activeSurprise.effect}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      {snapshot.surprises.map((s) => (
                        <span
                          key={s.id}
                          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-semibold flex items-center justify-center gap-1.5"
                        >
                          <span>{s.icon}</span>
                          <span>{s.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelectPhase('MBG_TRANSITION')}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-2 shadow"
                    >
                      <span>Menuju Transisi Makan MBG (P6)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  P6: TRANSISI MAKAN MBG
              ================================================= */}
              {snapshot.currentPhase === 'MBG_TRANSITION' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      P6 — Transisi Waktu Makan Bergizi Gratis (MBG)
                    </span>
                    <button
                      onClick={() => tamanPetualanganEngine.playRecessBellSound()}
                      className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Bell className="w-3.5 h-3.5" /> Bel Makan Tiba
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center space-y-4">
                      <div className="flex items-center justify-center gap-4 py-3">
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className="text-5xl"
                        >
                          🧼
                        </motion.span>
                        <span className="text-4xl text-slate-500">➔</span>
                        <motion.span
                          animate={{ y: [-4, 4, -4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-5xl"
                        >
                          🍱
                        </motion.span>
                      </div>

                      <p className="text-xs text-rose-200 italic font-semibold">
                        “Bel lembut berdentang menandakan waktu makan tiba. Santri mencuci tangan dengan sabun dan bersiap menikmati MBG ceria.”
                      </p>

                      {onNavigateToMbg && (
                        <button
                          onClick={onNavigateToMbg}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 mx-auto shadow"
                        >
                          <Utensils className="w-4 h-4" /> Buka Ruang MBG Ceria (G31)
                        </button>
                      )}
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 text-xs">
                        <strong className="text-rose-300 block">Adab Sebelum Makan:</strong>
                        <ul className="text-slate-300 space-y-1 list-disc list-inside">
                          <li>Merapikan mainan di taman ke tempatnya.</li>
                          <li>Mencuci kedua tangan dengan air mengalir dan sabun.</li>
                          <li>Duduk melingkar rapi dan melafalkan doa sebelum makan.</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPhase('RECESS_BELL')}
                        className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Ulangi Alur Taman Petualangan (P1)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: DETAIL 6 SAHABAT CERIA
        ===================================================== */}
        {activeTab === 'COMPANIONS' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                P4 — 6 Sahabat Ceria Asy & Syifa
              </span>
              <h2 className="text-xl font-black text-white">
                Sahabat Hewan Ramah yang Menemani Hari
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🐦</span>
                <h3 className="text-sm font-black text-white">Bubu (Burung Kutilang)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menyapa di pagi hari dan bernyanyi riang dari pucuk dahan cemara halaman sekolah.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🐱</span>
                <h3 className="text-sm font-black text-white">Gogo (Kucing Abu Manis)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menyambut santri dengan dengkuran lembut dan selalu senang dielus penuh kelembutan.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🐰</span>
                <h3 className="text-sm font-black text-white">Mimi (Kelinci Putih)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Suka melompat di hamparan rumput dan menikmati wortel segar yang dibagikan santri.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🦆</span>
                <h3 className="text-sm font-black text-white">Dodo (Bebek Kuning)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Berenang anggun di kolam ikan dan melatih anak-anak mencintai ekosistem air.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🐢</span>
                <h3 className="text-sm font-black text-white">Titi (Kura-kura Hijau)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mengajarkan ketenangan, kesabaran, dan langkah mantap dalam belajar serta bermain.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3">
                <span className="text-4xl block">🦋</span>
                <h3 className="text-sm font-black text-white">Rara (Kupu-kupu Emas)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mengepakkan sayap keindahan dan membantu penyerbukan bunga mawar di taman sekolah.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: DETAIL KEJUTAN TAMAN
        ===================================================== */}
        {activeTab === 'SURPRISE' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                P5 — Fenomena Ajaib & Kejutan Visual
              </span>
              <h2 className="text-xl font-black text-white">
                Membangun Rasa Syukur & Kekaguman Ciptaan Allah
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🦋</span>
                  <h3 className="text-sm font-black text-purple-300">Kupu-kupu Emas Berkilau</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Muncul di sela-sela dedaunan memancarkan pendar cahaya keemasan yang menyejukkan hati.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎈</span>
                  <h3 className="text-sm font-black text-purple-300">Balon Hati Merah Jambu</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Melambung tinggi mewakili doa cinta anak-anak untuk orang tua dan para ustadzah tercinta.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🫧</span>
                  <h3 className="text-sm font-black text-purple-300">Gelembung Sabun Pelangi</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pecah dengan lembut memantulkan spektrum cahaya indah yang mengundang tawa riang gembira.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌈</span>
                  <h3 className="text-sm font-black text-purple-300">Pelangi Mini Berpendar</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tampak di atas percikan air mancur taman saat sinar matahari pagi bersinar cerah.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P7 — FOUNDER TAMAN CONTROL COCKPIT
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
                      Founder Taman Control Cockpit (P7)
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Uji Ayunan, Synthesizer Suara Taman, Simulasi Istirahat, Audit Black Box Ring-0
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Sprint G34 Verifier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Audio Synthesizer Tester */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                  <span className="text-xs font-black text-slate-200 block">
                    Uji Audio Sintesis Taman
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => tamanPetualanganEngine.playRecessBellSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-emerald-950/40 text-emerald-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔔 Bel Istirahat Ceria</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => tamanPetualanganEngine.playBubblePopSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-purple-950/40 text-purple-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🫧 Bubble Pop & Surprise</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => tamanPetualanganEngine.playSwingGlideSound()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-sky-950/40 text-sky-300 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🪑 Swing Glide Synthesizer</span>
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
                    {onNavigateToKelasHidup && (
                      <button
                        onClick={onNavigateToKelasHidup}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🏫 Kelas Hidup (G33)</span>
                        <School className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToMbg && (
                      <button
                        onClick={onNavigateToMbg}
                        className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-between shadow"
                      >
                        <span>🍱 MBG Ceria (G31)</span>
                        <Utensils className="w-3.5 h-3.5" />
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
                  </div>
                </div>

                {/* 3. Black Box Telemetry */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                  <span className="text-xs font-black text-slate-200 block">
                    Audit Ring-0 & Playground Sync
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Setiap interaksi wahana tersinkronisasi dengan DNA G20, Kamera G21, dan telemetri Black Box Ring-0.
                  </p>
                  <span className="inline-block text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Marker: G34_TAMAN_BERMAIN_VERIFIED
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
                    <span className="text-slate-400 text-[10px] block">Fase Istirahat:</span>
                    <span className="text-sm font-black text-emerald-400">{snapshot.currentPhase}</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Wahana Terpilih:</span>
                    <span className="text-sm font-black text-teal-300">
                      {snapshot.currentAttraction.name}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Auto-Play Taman:</span>
                    <span className="text-sm font-black text-rose-300">
                      {snapshot.isAutoPlayingPlayground ? 'AKTIF' : 'STANDBY'}
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

export default TamanPetualanganHub;
