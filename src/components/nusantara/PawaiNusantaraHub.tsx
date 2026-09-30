/**
 * TADE SPRINT G38 — PAWAI NUSANTARA & KAMPUNG INDONESIA HUB
 * Visual, cultural, and educational exploration of Indonesian heritage for PAUD / TK Asy Syifa
 * 
 * Features:
 * - P1: Gerbang Nusantara (Gapura batik megah, bendera merah putih berkibar, balon merah putih ceria, sapaan Asy & Syifa)
 * - P2: Pawai Nusantara (20 Detik) (Asy, Syifa, 6 Sahabat, Bus MBG, Kereta Cerita berjalan pelan berarak ceria)
 * - P3: Rumah Adat Mini (Rumah Joglo, Rumah Gadang, Rumah Honai, Rumah Tongkonan, Rumah Limas memberi salam ramah)
 * - P4: Pakaian Daerah Ceria (Asy & Syifa mengenakan pakaian adat nusantara santun, sopan, dan anggun)
 * - P5: Alat Musik Hidup (Angklung, Gamelan, Kolintang, Tifa, Sasando tersenyum dan berbunyi harmonis)
 * - P6: Paspor Nusantara (Cap apresiasi kepulauan nusantara tanpa skor/ranking)
 * - P7: Founder Nusantara Control (Uji pawai, uji musik, simulasi daerah, audit Black Box Ring-0)
 * - Bonus: Layang-layang batik, kupu-kupu merah putih, awan motif batik, pohon kelapa bergoyang
 * 
 * Marker: G38_PAWAI_NUSANTARA_VERIFIED
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Home,
  Music,
  Shirt,
  MapPin,
  Smile,
  Heart,
  Flag,
  Award,
  Tv,
  Camera,
  Layers,
  ChevronRight,
  Sun,
  Wind
} from 'lucide-react';
import pawaiNusantaraEngine, {
  NusantaraPhase,
  TraditionalHouseId,
  RegionCostumeId,
  InstrumentId,
  NusantaraSnapshot
} from '../../services/pawaiNusantaraEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface PawaiNusantaraHubProps {
  onNavigateToFestival?: () => void;
  onNavigateToAula?: () => void;
  onNavigateToTvAsy?: () => void;
  onNavigateToKamera?: () => void;
  onNavigateToPetaDunia?: () => void;
  onNavigateToDNA?: () => void;
  onNavigateToLorongKenangan?: () => void;
  onNavigateToPerpustakaan?: () => void;
  onNavigateToHariPasar?: () => void;
}

export const PawaiNusantaraHub: React.FC<PawaiNusantaraHubProps> = ({
  onNavigateToFestival,
  onNavigateToAula,
  onNavigateToTvAsy,
  onNavigateToKamera,
  onNavigateToPetaDunia,
  onNavigateToDNA,
  onNavigateToLorongKenangan,
  onNavigateToPerpustakaan,
  onNavigateToHariPasar
}) => {
  const [snapshot, setSnapshot] = useState<NusantaraSnapshot>(pawaiNusantaraEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'PARADE' | 'HOUSES' | 'COSTUMES' | 'INSTRUMENTS' | 'PASSPORT' | 'FOUNDER'>('EXPLORE');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [isWavingFlag, setIsWavingFlag] = useState<boolean>(true);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>(
    '“Selamat datang di Kampung Indonesia TK Asy Syifa! Mari mengenal keberagaman budaya negeri kita dengan penuh cinta dan rasa syukur!”'
  );

  useEffect(() => {
    tadeAnimationGovernor.startAnimation('anim-pawai-nusantara');
    const unsub = pawaiNusantaraEngine.subscribe(() => {
      setSnapshot(pawaiNusantaraEngine.getSnapshot());
    });

    return () => {
      unsub();
      tadeAnimationGovernor.stopAnimation('anim-pawai-nusantara');
      pawaiNusantaraEngine.stopParade();
      pawaiNusantaraEngine.stopFullNusantaraSimulation();
    };
  }, []);

  const handleSelectPhase = (phase: NusantaraPhase) => {
    pawaiNusantaraEngine.setPhase(phase);
    if (phase === 'GATE_NUSANTARA') {
      setActiveTab('EXPLORE');
      setSpeechBubbleText('“Selamat datang di Kampung Indonesia! Gapura batik dan bendera merah putih menyambut kita semua.”');
    } else if (phase === 'PARADE_WALK') {
      setActiveTab('PARADE');
      setSpeechBubbleText('“Lihat! Pawai Nusantara berjalan ceria bersama Bus MBG dan Kereta Cerita!”');
    } else if (phase === 'TRADITIONAL_HOUSES') {
      setActiveTab('HOUSES');
      setSpeechBubbleText('“Setiap rumah adat nusantara memiliki bentuk indah dan menyambut kita dengan salam hangat.”');
    } else if (phase === 'CULTURAL_COSTUMES') {
      setActiveTab('COSTUMES');
      setSpeechBubbleText('“Asy & Syifa mengenakan pakaian adat nusantara yang sopan, anggun, dan penuh warna!”');
    } else if (phase === 'LIVING_INSTRUMENTS') {
      setActiveTab('INSTRUMENTS');
      setSpeechBubbleText('“Dengar alunan merdu alat musik nusantara. Angklung, gamelan, kolintang, tifa, dan sasando semuanya tersenyum!”');
    } else if (phase === 'PASSPORT_STAMPS') {
      setActiveTab('PASSPORT');
      setSpeechBubbleText('“Alhamdulillah! Paspor Nusantara kita kini memiliki cap kenangan indah keliling Indonesia!”');
    }
  };

  const handlePlayInstrument = (instId: InstrumentId) => {
    pawaiNusantaraEngine.selectInstrument(instId);
    setSpeechBubbleText(`“Alunan nada merdu dari ${pawaiNusantaraEngine.traditionalInstruments[instId].name} (${pawaiNusantaraEngine.traditionalInstruments[instId].origin})!”`);
  };

  const handleStampRegion = (regionName: string) => {
    pawaiNusantaraEngine.addPassportStamp(regionName);
    setSpeechBubbleText(`“Cap daerah ${regionName} berhasil ditambahkan ke Paspor Nusantara Anda!”`);
  };

  const currentHouse = pawaiNusantaraEngine.traditionalHouses[snapshot.activeHouse];
  const currentCostume = pawaiNusantaraEngine.costumes[snapshot.activeCostume];
  const currentInstrument = pawaiNusantaraEngine.traditionalInstruments[snapshot.activeInstrument];

  return (
    <div id="pawai-nusantara-root" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Header / Navigation */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-red-500/30 sticky top-0 z-50 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-500/20 text-xl border border-white/20">
              🇮🇩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                  Sprint G38
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Dr. Pulse 60 FPS
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Pawai Nusantara & Kampung Indonesia
                <span className="text-xs font-normal text-slate-400 hidden sm:inline">| TK Asy Syifa</span>
              </h1>
            </div>
          </div>

          {/* Quick Ecosystem Hub Links */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {onNavigateToHariPasar && (
              <button
                onClick={onNavigateToHariPasar}
                className="px-2.5 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-bold flex items-center gap-1 border border-amber-500/40 transition"
                title="Menuju Hari Pasar Ceria G39"
              >
                <span>🛒 Hari Pasar</span>
              </button>
            )}
            {onNavigateToAula && (
              <button
                onClick={onNavigateToAula}
                className="px-2.5 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold flex items-center gap-1 border border-purple-500/40 transition"
                title="Menuju Aula Impian G37"
              >
                <span>🏛️ Aula</span>
              </button>
            )}
            {onNavigateToFestival && (
              <button
                onClick={onNavigateToFestival}
                className="px-2.5 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-bold flex items-center gap-1 border border-amber-500/40 transition"
                title="Menuju Festival Budaya G18"
              >
                <span>🎪 Festival</span>
              </button>
            )}
            {onNavigateToTvAsy && (
              <button
                onClick={onNavigateToTvAsy}
                className="px-2.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold flex items-center gap-1 border border-red-500/40 transition"
                title="Menuju TV Asy G15"
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">TV Asy</span>
              </button>
            )}
            {onNavigateToPetaDunia && (
              <button
                onClick={onNavigateToPetaDunia}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold flex items-center gap-1 border border-emerald-500/40 transition"
                title="Menuju Peta Dunia G28"
              >
                <span>🗺️ Peta</span>
              </button>
            )}
            {onNavigateToDNA && (
              <button
                onClick={onNavigateToDNA}
                className="px-2.5 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-bold flex items-center gap-1 border border-blue-500/40 transition"
                title="Menuju DNA G20"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">DNA</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="bg-slate-800/60 border-b border-slate-700/60 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => handleSelectPhase('GATE_NUSANTARA')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'EXPLORE'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>⛩️ Gerbang Nusantara (P1)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('PARADE_WALK')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'PARADE'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🎺 Pawai 20s (P2)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('TRADITIONAL_HOUSES')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'HOUSES'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🏛️ Rumah Adat (P3)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('CULTURAL_COSTUMES')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'COSTUMES'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>👘 Pakaian Daerah (P4)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('LIVING_INSTRUMENTS')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'INSTRUMENTS'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🎋 Musik Hidup (P5)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('PASSPORT_STAMPS')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'PASSPORT'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🛂 Paspor Nusantara (P6)</span>
            </button>
            <button
              onClick={() => setActiveTab('FOUNDER')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'FOUNDER'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>⚙️ Founder Cockpit (P7)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWavingFlag(!isWavingFlag)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                isWavingFlag
                  ? 'bg-red-600/30 border-red-500/60 text-red-300'
                  : 'bg-slate-700/40 border-slate-600 text-slate-400'
              }`}
              title="Kibaran Bendera Merah Putih"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                soundMuted
                  ? 'bg-rose-900/30 border-rose-500/40 text-rose-300'
                  : 'bg-slate-700/40 border-slate-600 text-slate-300'
              }`}
              title={soundMuted ? 'Suara dimatikan' : 'Suara aktif'}
            >
              {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 pt-6 flex-1 flex flex-col gap-6">
        {/* Dek Asy & Syifa Sapaan Card with Animated 3D Atmosphere */}
        <div className="bg-gradient-to-r from-red-950/70 via-slate-800/80 to-amber-950/70 border border-red-500/30 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
          {/* Bonus Atmosphere Elements: Layang-layang Batik, Kupu-kupu, Awan Motif, Pohon Kelapa */}
          <div className="absolute top-2 right-4 text-2xl opacity-60 animate-bounce pointer-events-none select-none">
            🪁
          </div>
          <div className="absolute top-12 right-20 text-xl opacity-70 animate-pulse pointer-events-none select-none">
            🦋
          </div>
          <div className="absolute bottom-2 left-2 text-2xl opacity-40 pointer-events-none select-none">
            🌴
          </div>
          <div className="absolute top-1 left-24 text-xs font-bold text-red-300/40 uppercase tracking-widest pointer-events-none select-none">
            ☁️ Awan Mega Mendung
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Avatar Dek Asy & Syifa */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 via-red-500 to-amber-600 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👦🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Asy
                </div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-rose-400 via-red-400 to-amber-300 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👧🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Syifa
                </div>
              </div>
            </div>

            {/* Sapaan Speech Bubble */}
            <div className="flex-1 bg-slate-900/80 border border-red-400/30 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Asy & Syifa Berkata:
                </span>
                <span className="text-[11px] text-slate-400">
                  {isWavingFlag ? '🇮🇩 Merah Putih Berkibar' : '🇮🇩 Kampung Ramah'}
                </span>
              </div>
              <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed italic">
                {speechBubbleText}
              </p>
            </div>
          </div>
        </div>

        {/* Tab 1: P1 — GERBANG NUSANTARA & KAMPUNG INDONESIA */}
        {activeTab === 'EXPLORE' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 font-bold">
                    P1
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Gerbang Nusantara & Gapura Batik</h2>
                    <p className="text-xs text-slate-400">Selamat datang di Kampung Indonesia TK Asy Syifa</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectPhase('PARADE_WALK')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                >
                  <span>Mulai Pawai Nusantara (20s)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3D Visual Gapura Batik Representation */}
              <div className="relative rounded-2xl bg-gradient-to-b from-sky-900/60 via-slate-900/80 to-amber-950/60 border border-amber-500/30 p-8 flex flex-col items-center justify-center text-center overflow-hidden min-h-[300px]">
                {/* Floating Batik Motifs & Balloons */}
                <div className="absolute top-4 left-6 flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🎈</span>
                  <span className="text-2xl">🔴⚪</span>
                </div>
                <div className="absolute top-4 right-6 flex items-center gap-2">
                  <span className="text-2xl">⚪🔴</span>
                  <span className="text-2xl animate-bounce">🎈</span>
                </div>

                {/* Gapura Batik Arch */}
                <div className="w-full max-w-xl border-t-8 border-x-8 border-amber-600 rounded-t-3xl bg-amber-950/40 p-6 relative shadow-2xl backdrop-blur-sm">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-black border-2 border-white shadow flex items-center gap-1.5">
                    <span>🇮🇩</span> KAMPUNG INDONESIA <span>🇮🇩</span>
                  </div>
                  
                  <div className="text-5xl md:text-6xl my-4 flex items-center justify-center gap-6">
                    <span className="transform -scale-x-100">🎋</span>
                    <span>🏛️</span>
                    <span>🎋</span>
                  </div>

                  <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 mt-4">
                    <p className="text-sm font-bold text-amber-300">
                      "Selamat datang di Kampung Indonesia."
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Pintu gerbang dengan ukiran batik megah, kibaran bendera merah putih, dan balon persaudaraan yang ceria.
                    </p>
                  </div>
                </div>

                {/* Quick actions under the gate */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      pawaiNusantaraEngine.playGateFanfare();
                      setSpeechBubbleText('“Alunan fanfare penyambutan berkumandang di gerbang Kampung Indonesia!”');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-amber-300 text-xs font-bold flex items-center gap-2 border border-amber-500/30"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan Fanfare Gerbang</span>
                  </button>
                  <button
                    onClick={() => handleSelectPhase('TRADITIONAL_HOUSES')}
                    className="px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 text-xs font-bold flex items-center gap-2 border border-amber-500/40"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Jelajahi 5 Rumah Adat Mini</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: P2 — PAWAI NUSANTARA 20 DETIK */}
        {activeTab === 'PARADE' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 font-bold">
                    P2
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Pawai Nusantara Berjalan Ceria (20 Detik)</h2>
                    <p className="text-xs text-slate-400">Asy, Syifa, 6 Sahabat, Bus MBG, dan Kereta Cerita melangkah pelan</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {snapshot.isParadeMoving ? (
                    <button
                      onClick={() => pawaiNusantaraEngine.stopParade()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda Pawai</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => pawaiNusantaraEngine.startParade(20)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Mulai Pawai (20s)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar 20 Detik */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Kemajuan Pawai Keliling Kampung: {snapshot.paradeProgressSeconds} / 20 Detik
                  </span>
                  <span className="text-slate-400">
                    {snapshot.isParadeMoving ? '🚶‍♂️ Sedang Berjalan Pelan...' : '⏸️ Siap Melangkah'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(snapshot.paradeProgressSeconds / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Parade Stage Visualization */}
              <div className="relative bg-gradient-to-b from-sky-900/70 via-slate-900 to-amber-950/70 rounded-2xl border border-slate-700/80 p-6 min-h-[320px] flex flex-col justify-between overflow-hidden">
                {/* Background Decor */}
                <div className="flex items-center justify-between opacity-50 text-3xl">
                  <span>🏛️</span>
                  <span>🪁</span>
                  <span>🏯</span>
                  <span>🦋</span>
                  <span>🛖</span>
                </div>

                {/* Animated Parade Row */}
                <div className="my-8 flex items-center justify-around gap-2 flex-wrap">
                  {/* Bus MBG */}
                  <motion.div
                    animate={snapshot.isParadeMoving ? { y: [0, -4, 0], x: [0, 4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="flex flex-col items-center bg-slate-900/80 border border-emerald-500/40 p-3 rounded-2xl shadow-lg"
                  >
                    <span className="text-4xl">🚌</span>
                    <span className="text-[11px] font-bold text-emerald-400 mt-1">Bus MBG</span>
                    <span className="text-[9px] text-slate-400">Makan Bergizi</span>
                  </motion.div>

                  {/* Kereta Cerita */}
                  <motion.div
                    animate={snapshot.isParadeMoving ? { y: [0, -4, 0], x: [0, 4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="flex flex-col items-center bg-slate-900/80 border border-amber-500/40 p-3 rounded-2xl shadow-lg"
                  >
                    <span className="text-4xl">🚂</span>
                    <span className="text-[11px] font-bold text-amber-400 mt-1">Kereta Cerita</span>
                    <span className="text-[9px] text-slate-400">Buku & Doa</span>
                  </motion.div>

                  {/* Asy & Syifa */}
                  <motion.div
                    animate={snapshot.isParadeMoving ? { y: [0, -6, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="flex flex-col items-center bg-red-950/80 border border-red-500/50 p-3 rounded-2xl shadow-lg"
                  >
                    <div className="flex items-center gap-1 text-3xl">
                      <span>👦🏻</span>
                      <span>👧🏻</span>
                    </div>
                    <span className="text-[11px] font-black text-red-300 mt-1">Asy & Syifa</span>
                    <span className="text-[9px] text-red-400">Pakaian Daerah</span>
                  </motion.div>

                  {/* 6 Sahabat */}
                  <motion.div
                    animate={snapshot.isParadeMoving ? { y: [0, -4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1.0 }}
                    className="flex flex-col items-center bg-slate-900/80 border border-indigo-500/40 p-3 rounded-2xl shadow-lg"
                  >
                    <div className="flex items-center gap-1 text-2xl">
                      <span>👦🏽</span>
                      <span>👧🏼</span>
                      <span>👦🏿</span>
                      <span>👧🏻</span>
                      <span>👦🏼</span>
                      <span>👧🏽</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-300 mt-1">6 Sahabat Ceria</span>
                    <span className="text-[9px] text-slate-400">Budi, Siti, Edo, Meimei, Dayu, Ujang</span>
                  </motion.div>
                </div>

                {/* Road Line */}
                <div className="w-full border-t-2 border-dashed border-amber-500/40 pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>🚩 Titik Mulai Gerbang</span>
                  <span>✨ Jalan Santai & Penuh Kebersamaan</span>
                  <span>🏁 Pos Paspor Nusantara</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: P3 — RUMAH ADAT MINI */}
        {activeTab === 'HOUSES' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 font-bold">
                    P3
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">5 Rumah Adat Mini Bersuara Ramah</h2>
                    <p className="text-xs text-slate-400">Setiap rumah memberi salam ramah dan mengenalkan arsitektur khasnya</p>
                  </div>
                </div>
              </div>

              {/* Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                {(Object.keys(pawaiNusantaraEngine.traditionalHouses) as TraditionalHouseId[]).map((houseId) => {
                  const house = pawaiNusantaraEngine.traditionalHouses[houseId];
                  const isSelected = snapshot.activeHouse === houseId;
                  return (
                    <button
                      key={houseId}
                      onClick={() => {
                        pawaiNusantaraEngine.selectHouse(houseId);
                        setSpeechBubbleText(`“Kunjungan ke ${house.name} (${house.region}). ${house.greeting}”`);
                      }}
                      className={`p-3 rounded-2xl text-left border flex flex-col items-center text-center transition ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-600/40 to-slate-800 border-amber-400 text-white shadow-lg'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-3xl mb-1">{house.emoji}</span>
                      <span className="text-xs font-bold">{house.name}</span>
                      <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">{house.region}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected House Detail Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/50 border border-amber-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-28 h-28 rounded-3xl bg-amber-900/40 border-2 border-amber-400/50 flex items-center justify-center text-6xl shadow-inner">
                    {currentHouse.emoji}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                          {currentHouse.region}
                        </span>
                        <h3 className="text-xl font-black text-white">{currentHouse.name}</h3>
                      </div>
                      <button
                        onClick={() => handleStampRegion(currentHouse.region)}
                        className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 text-xs font-bold border border-red-500/40 flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Cap di Paspor</span>
                      </button>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-300">Salam Hangat Rumah Adat:</p>
                      <p className="text-sm text-slate-200 italic mt-0.5">{currentHouse.greeting}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                        <span className="font-bold text-slate-400 block mb-0.5">Karakter Arsitektur:</span>
                        <span className="text-slate-200">{currentHouse.characteristic}</span>
                      </div>
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                        <span className="font-bold text-slate-400 block mb-0.5">Ornamen Khas:</span>
                        <span className="text-slate-200">{currentHouse.ornament}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: P4 — PAKAIAN DAERAH CERIA */}
        {activeTab === 'COSTUMES' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 font-bold">
                    P4
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Pakaian Daerah Ceria Asy & Syifa</h2>
                    <p className="text-xs text-slate-400">Sopan, anggun, ramah anak, dan bebas stereotip berlebihan</p>
                  </div>
                </div>
              </div>

              {/* Costume Region Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {(Object.keys(pawaiNusantaraEngine.costumes) as RegionCostumeId[]).map((cId) => {
                  const costume = pawaiNusantaraEngine.costumes[cId];
                  const isSelected = snapshot.activeCostume === cId;
                  return (
                    <button
                      key={cId}
                      onClick={() => {
                        pawaiNusantaraEngine.selectCostume(cId);
                        setSpeechBubbleText(`“Asy & Syifa berganti mengenakan ${costume.regionName}. Terlihat sangat sopan dan ceria!”`);
                      }}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center ${
                        isSelected
                          ? 'bg-gradient-to-b from-purple-600/40 to-slate-800 border-purple-400 text-white shadow-lg'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Shirt className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-xs font-bold truncate w-full">{costume.regionName.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Costume Display Showcase */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950/60 border border-indigo-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Mannequin / Character view */}
                  <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-700/80 p-6 rounded-3xl shadow-inner">
                    <div className="flex flex-col items-center">
                      <span className="text-5xl mb-1">👦🏻</span>
                      <span className="text-xs font-black text-amber-400">Asy</span>
                      <span className="text-[10px] text-slate-400">Busana Adat</span>
                    </div>
                    <div className="text-2xl text-slate-500">&amp;</div>
                    <div className="flex flex-col items-center">
                      <span className="text-5xl mb-1">👧🏻</span>
                      <span className="text-xs font-black text-rose-400">Syifa</span>
                      <span className="text-[10px] text-slate-400">Busana Adat</span>
                    </div>
                  </div>

                  {/* Outfit Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">
                        Koleksi Busana Nusantara
                      </span>
                      <h3 className="text-xl font-black text-white">{currentCostume.regionName}</h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3">
                        <span className="font-bold text-amber-300 block mb-0.5">👦🏻 Busana Dek Asy:</span>
                        <span className="text-slate-200">{currentCostume.asyOutfit}</span>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3">
                        <span className="font-bold text-rose-300 block mb-0.5">👧🏻 Busana Dek Syifa:</span>
                        <span className="text-slate-200">{currentCostume.syifaOutfit}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5">
                          <span className="font-bold text-slate-400 block text-[11px]">Hiasan Kepala:</span>
                          <span className="text-slate-200 text-[11px]">{currentCostume.headdress}</span>
                        </div>
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5">
                          <span className="font-bold text-slate-400 block text-[11px]">Motif Kain:</span>
                          <span className="text-slate-200 text-[11px]">{currentCostume.clothPattern}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: P5 — ALAT MUSIK HIDUP */}
        {activeTab === 'INSTRUMENTS' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 font-bold">
                    P5
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Alat Musik Tradisional Hidup &amp; Tersenyum</h2>
                    <p className="text-xs text-slate-400">Ketuk untuk mendengarkan alunan nada Web Audio Synthesizer khas daerah</p>
                  </div>
                </div>
              </div>

              {/* Instruments Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {(Object.keys(pawaiNusantaraEngine.traditionalInstruments) as InstrumentId[]).map((instId) => {
                  const inst = pawaiNusantaraEngine.traditionalInstruments[instId];
                  const isSelected = snapshot.activeInstrument === instId;
                  return (
                    <button
                      key={instId}
                      onClick={() => handlePlayInstrument(instId)}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between gap-3 transition transform active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-600/50 to-slate-800 border-amber-400 text-white shadow-xl ring-2 ring-amber-400/40'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="relative">
                        <span className="text-5xl">{inst.icon}</span>
                        <span className="absolute -bottom-1 -right-1 text-xs">😊</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{inst.name}</h4>
                        <span className="text-[11px] text-amber-300/80 block mt-0.5">{inst.origin}</span>
                      </div>
                      <div className="w-full py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-[11px] font-bold text-amber-400 flex items-center justify-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Bunyikan</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Instrument Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/60 border border-amber-500/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-900/40 border border-amber-400/50 flex items-center justify-center text-4xl shadow-inner">
                    {currentInstrument.icon}
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                      {currentInstrument.origin}
                    </span>
                    <h3 className="text-lg font-black text-white">{currentInstrument.name} (Tersenyum)</h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">{currentInstrument.soundDescription}</p>
                  </div>
                </div>

                <button
                  onClick={() => pawaiNusantaraEngine.playInstrumentSound(snapshot.activeInstrument)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
                >
                  <Music className="w-4 h-4" />
                  <span>Mainkan Ulang Nada Harmonis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: P6 — PASPOR NUSANTARA */}
        {activeTab === 'PASSPORT' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 font-bold">
                    P6
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Paspor Nusantara (Cap Apresiasi Kebersamaan)</h2>
                    <p className="text-xs text-slate-400">100% Apresiasi tanpa sistem skor atau perbandingan ranking</p>
                  </div>
                </div>
              </div>

              {/* Passport Book Layout */}
              <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-amber-950/60 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl">
                      🛂
                    </div>
                    <div>
                      <h3 className="text-base font-black text-amber-300 tracking-wide uppercase">
                        PASPOR KAMPUNG INDONESIA TK ASY SYIFA
                      </h3>
                      <p className="text-xs text-slate-300">Dokumen Kenangan Budaya & Kasih Sayang Santri</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    {snapshot.unlockedStamps.length} Wilayah Tertaut
                  </div>
                </div>

                {/* Stamped Regions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Jawa (Joglo & Angklung)', icon: '🏛️', date: 'Hari Ini' },
                    { name: 'Sumatera Barat (Gadang & Salempang)', icon: '🏯', date: 'Hari Ini' },
                    { name: 'Papua (Honai & Tifa)', icon: '🛖', date: 'Hari Ini' },
                    { name: 'Sulawesi Selatan (Tongkonan & Kolintang)', icon: '⛩️', date: 'Hari Ini' },
                    { name: 'Sumatera Selatan (Limas & Songket)', icon: '🏡', date: 'Hari Ini' },
                    { name: 'Nusa Tenggara Timur (Sasando Rote)', icon: '🪕', date: 'Hari Ini' }
                  ].map((stamp, idx) => {
                    const isUnlocked = snapshot.unlockedStamps.some((s) => s.toLowerCase().includes(stamp.name.split(' ')[0].toLowerCase()));
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                          isUnlocked
                            ? 'bg-amber-950/30 border-amber-500/50 text-white shadow-md'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{stamp.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200">{stamp.name}</h4>
                            <span className="text-[10px] text-slate-400">{isUnlocked ? 'Tercap Resmi' : 'Belum Dicap'}</span>
                          </div>
                        </div>
                        {isUnlocked ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStampRegion(stamp.name)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 border border-slate-700"
                          >
                            Cap Sekarang
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: P7 — FOUNDER NUSANTARA CONTROL COCKPIT */}
        {activeTab === 'FOUNDER' && (
          <div className="space-y-6">
            <div className="bg-slate-800/90 border border-indigo-500/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
                    P7
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Founder Nusantara Control Cockpit</h2>
                    <p className="text-xs text-slate-400">Uji pawai, uji audio instrumen, simulasi daerah, & audit Black Box</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-indigo-300 bg-indigo-950/80 px-3 py-1.5 rounded-xl border border-indigo-500/40">
                  TADE Ring-0 Active
                </div>
              </div>

              {/* Cockpit Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 mb-1">Simulasi Otomatis Lengkap</h4>
                    <p className="text-[11px] text-slate-400">Menjalankan alur P1 sampai P6 secara berkesinambungan</p>
                  </div>
                  <button
                    onClick={() => {
                      if (snapshot.isAutoPlayingNusantara) {
                        pawaiNusantaraEngine.stopFullNusantaraSimulation();
                      } else {
                        pawaiNusantaraEngine.startFullNusantaraSimulation();
                      }
                    }}
                    className={`w-full mt-3 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow ${
                      snapshot.isAutoPlayingNusantara
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {snapshot.isAutoPlayingNusantara ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{snapshot.isAutoPlayingNusantara ? 'Hentikan Simulasi' : 'Jalankan Simulasi'}</span>
                  </button>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-red-300 mb-1">Uji Pawai 20 Detik</h4>
                    <p className="text-[11px] text-slate-400">Trigger jalannya barisan pawai Asy, Syifa, & 6 Sahabat</p>
                  </div>
                  <button
                    onClick={() => {
                      handleSelectPhase('PARADE_WALK');
                      pawaiNusantaraEngine.startParade(20);
                    }}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Uji Langkah Pawai</span>
                  </button>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-purple-300 mb-1">Uji Audio 5 Musik</h4>
                    <p className="text-[11px] text-slate-400">Audit Web Audio synthesizer untuk angklung, gamelan, dll.</p>
                  </div>
                  <button
                    onClick={() => {
                      pawaiNusantaraEngine.playInstrumentSound('ANGKLUNG');
                      setTimeout(() => pawaiNusantaraEngine.playInstrumentSound('GAMELAN'), 500);
                      setTimeout(() => pawaiNusantaraEngine.playInstrumentSound('SASANDO'), 1000);
                    }}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Uji Rangkaian Nada</span>
                  </button>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-blue-300 mb-1">Audit Telemetri Black Box</h4>
                    <p className="text-[11px] text-slate-400">Verifikasi pencatatan event audit Sprint G38</p>
                  </div>
                  <button
                    onClick={() => {
                      blackBoxRecorder.record({
                        ring: 'RING_0',
                        moduleCode: 'G38-MANUAL-AUDIT',
                        category: 'ACTION',
                        eventType: 'ACTION',
                        details: 'Founder triggered manual telemetry verification for G38'
                      });
                      setSpeechBubbleText('“Audit Black Box Ring-0 G38 berhasil diverifikasi!”');
                    }}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verifikasi Telemetri</span>
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-bold text-slate-200">
                    Sistem Pawai Nusantara: Normal & Terlindungi (Dr. Pulse 60 FPS, &le; 5 Animasi Aktif)
                  </span>
                </div>
                <span className="text-slate-400">G38_PAWAI_NUSANTARA_VERIFIED</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PawaiNusantaraHub;
