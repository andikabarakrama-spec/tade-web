/**
 * TADE SPRINT G27 — KAPAL AWAN & PULAU PETUALANGAN HUB
 * Zero Breaking Changes • 100% Web Audio Synthesizer • Dr. Pulse 60 FPS
 * 
 * Features:
 * P1 — Kapal Awan empuk bersenyum ramah & panggilan kapal
 * P2 — Pelabuhan Pelangi, bendera berkibar, balon melayang & peluit
 * P3 — 5 Pulau Cerita (~20 detik per pulau, narasi adab & aktivitas santun)
 * P4 — Sahabat ikut berlayar (Asy, Syifa, Bubu, Gogo, Mimi, Dodo, Titi, Rara - DNA G20)
 * P5 — Cuaca Pelayaran (Cerah, Berawan, Pelangi, Malam Berbintang)
 * P6 — Paspor Petualang (Cap stempel berkah tanpa skor/ranking)
 * P7 — Founder Control Cockpit (Uji suara, simulasi, preview)
 * Bonus — Lumba-lumba, Ikan melompat, Burung camar, Ombak lembut
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Ship,
  Compass,
  Sparkles,
  Sun,
  Cloud,
  Moon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Heart,
  Award,
  Layers,
  ChevronRight,
  ChevronLeft,
  Navigation,
  Wind,
  Shield,
  Activity,
  Sliders,
  Send,
  HelpCircle,
  Smile,
  Music,
  Tv,
  Film,
  Building2,
  Palette
} from 'lucide-react';
import {
  kapalAwanEngine,
  ADVENTURE_ISLANDS_CATALOG,
  SHIP_COMPANIONS_ROSTER,
  AdventureIslandId,
  AdventureIslandInfo,
  AdventurePassportEntry,
  INITIAL_SEA_CREATURES,
  SeaCreature
} from '../../services/kapalAwanEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { CheerfulWeather } from '../../services/livingWorldEngine';

export const KapalAwanHub: React.FC = () => {
  const [snapshot, setSnapshot] = useState(kapalAwanEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'VOYAGE' | 'ISLANDS' | 'COMPANIONS' | 'PASSPORT' | 'FOUNDER_COCKPIT'>('VOYAGE');
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>('ASY');
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [creatures, setCreatures] = useState<SeaCreature[]>(INITIAL_SEA_CREATURES);
  const [interactiveWaveCount, setInteractiveWaveCount] = useState<number>(3);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  useEffect(() => {
    const unsub = kapalAwanEngine.subscribe(() => {
      setSnapshot(kapalAwanEngine.getSnapshot());
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSummonShip = () => {
    kapalAwanEngine.summonShip();
    showToast('⚓ Kapal Awan tersenyum dan mendekat ke dermaga Pelabuhan Pelangi!');
  };

  const handleToggleVoyage = () => {
    if (snapshot.isVoyagePlaying) {
      kapalAwanEngine.stopVoyage();
      showToast('⏸️ Pelayaran Kapal Awan dijeda.');
    } else {
      if (!snapshot.isShipSummoned) {
        kapalAwanEngine.summonShip();
      }
      kapalAwanEngine.startVoyage();
      showToast(`⛵ Berlayar menuju ${snapshot.currentIsland.name}!`);
    }
  };

  const handleSelectIsland = (islandId: AdventureIslandId) => {
    kapalAwanEngine.selectIsland(islandId);
    showToast(`📍 Tujuan diubah ke: ${ADVENTURE_ISLANDS_CATALOG[islandId].name}`);
  };

  const handleCreatureClick = (creature: SeaCreature) => {
    if (creature.type === 'DOLPHIN') {
      kapalAwanEngine.playDolphinSound();
    } else if (creature.type === 'SEAGULL') {
      kapalAwanEngine.playSeagullCall();
    } else {
      kapalAwanEngine.playGentleWaves();
    }
    showToast(`${creature.emoji} ${creature.name}: ${creature.phrase}`);
  };

  const activeIsland = snapshot.currentIsland;

  // Weather styling
  const weatherBg = useMemo(() => {
    switch (snapshot.activeWeather) {
      case 'PELANGI':
        return 'from-sky-900 via-indigo-950 to-purple-950 border-pink-500/30';
      case 'BERAWAN':
        return 'from-slate-900 via-sky-950 to-indigo-950 border-sky-400/30';
      case 'GERIMIS':
      case 'HUJAN_PELAN':
        return 'from-blue-950 via-slate-950 to-indigo-950 border-cyan-400/30';
      case 'CERAH':
      default:
        return 'from-sky-950 via-indigo-950 to-slate-950 border-amber-400/30';
    }
  }, [snapshot.activeWeather]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 pb-24 font-sans selection:bg-sky-500 selection:text-white">
      {/* TOAST ALERT NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-sky-900/90 text-white px-5 py-3 rounded-2xl shadow-2xl border border-sky-400/50 backdrop-blur-md flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-4 ring-sky-400/20">
                <Ship className="w-8 h-8 text-white animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-black text-slate-900 items-center justify-center">27</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Kapal Awan & Pulau Petualangan
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  SPRINT G27
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Dr. Pulse 60 FPS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Pelayaran Kartun 3D Edukatif, Santun & Penuh Hikmah • TK Islam Asy-Syifa
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setIsPassportOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm"
              title="Buka Paspor Petualang"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Paspor Petualang</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/40 text-[10px] font-bold text-white">
                {snapshot.totalStampsCollected}/5
              </span>
            </button>

            <button
              onClick={() => {
                kapalAwanEngine.playShipWhistle('DOUBLE');
                showToast('🎺 Peluit Kapal berbunyi merdu: Tooooot! Tooooot!');
              }}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 text-sky-300 hover:bg-slate-700 transition-all text-xs flex items-center gap-1.5"
              title="Bunyikan Peluit Kapal"
            >
              <Music className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Peluit</span>
            </button>

            <button
              onClick={() => kapalAwanEngine.toggleEcoMode()}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                snapshot.ecoModeActive
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Mode Hemat Daya"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Eco Mode:</span> {snapshot.ecoModeActive ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('VOYAGE')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'VOYAGE'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>P1-P2 Samudra & Kapal Awan</span>
          </button>

          <button
            onClick={() => setActiveTab('ISLANDS')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'ISLANDS'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>P3 5 Pulau Cerita (20s)</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPANIONS')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'COMPANIONS'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>P4 Sahabat Berlayar (DNA G20)</span>
          </button>

          <button
            onClick={() => setActiveTab('PASSPORT')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'PASSPORT'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>P6 Paspor Petualang</span>
          </button>

          <button
            onClick={() => setActiveTab('FOUNDER_COCKPIT')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'FOUNDER_COCKPIT'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>P7 Founder Cockpit</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ==================================================== */}
        {/* TAB 1: VOYAGE & 3D CARTOON CLOUD STAGE               */}
        {/* ==================================================== */}
        {activeTab === 'VOYAGE' && (
          <div className="space-y-6">
            {/* CARTOON CLOUD SEA STAGE */}
            <div className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b ${weatherBg} border shadow-2xl transition-all duration-700 min-h-[460px] p-6 flex flex-col justify-between`}>
              
              {/* Sky Background Elements (P5 Cuaca Pelayaran) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Sun or Stars */}
                {snapshot.activeWeather === 'CERAH' && (
                  <div className="absolute top-8 right-12 text-6xl animate-pulse drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                    ☀️
                  </div>
                )}
                {snapshot.activeWeather === 'PELANGI' && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 text-7xl opacity-80 filter blur-[0.5px]">
                    🌈
                  </div>
                )}
                {snapshot.activeWeather === 'BERAWAN' && (
                  <div className="absolute top-6 right-20 flex gap-4 text-5xl opacity-75">
                    <span className="animate-pulse">☁️</span>
                    <span>☁️</span>
                  </div>
                )}

                {/* Floating Clouds */}
                <div className="absolute top-16 left-8 text-4xl opacity-50 animate-bounce duration-1000">☁️</div>
                <div className="absolute top-28 right-1/4 text-3xl opacity-40">☁️</div>
                <div className="absolute top-12 left-1/3 text-2xl opacity-60">✨</div>
                <div className="absolute top-20 right-12 text-2xl opacity-70 animate-ping duration-1000">⭐</div>
              </div>

              {/* Top Stage Bar: Port Info & Progress */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-xl shadow-md">
                    🎡
                  </div>
                  <div>
                    <div className="text-xs text-sky-300 font-semibold uppercase tracking-wider">
                      Pelabuhan Keberangkatan
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      Pelabuhan Pelangi Asy-Syifa 🚩
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">Tujuan Pelayaran:</div>
                    <div className="text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-end gap-1">
                      <span>{activeIsland.iconEmoji}</span>
                      <span>{activeIsland.name}</span>
                    </div>
                  </div>

                  {/* Progress Ring / Bar */}
                  <div className="w-28 sm:w-36 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${snapshot.voyageProgressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-sky-300 min-w-[36px]">
                    {snapshot.voyageProgressPercent}%
                  </span>
                </div>
              </div>

              {/* MIDDLE HERO: KAPAL AWAN 3D CARTOON & ISLAND LANDSCAPE */}
              <div className="relative z-10 my-6 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left: Kapal Awan (P1) */}
                <div className="flex-1 flex flex-col items-center text-center">
                  {snapshot.isShipSummoned ? (
                    <div className="relative group cursor-pointer" onClick={() => kapalAwanEngine.playShipWhistle('DOUBLE')}>
                      {/* Steam from Chimney */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-90">
                        <span className="text-lg animate-bounce duration-700">☁️</span>
                        <span className="text-sm animate-ping">💖</span>
                      </div>

                      {/* Cloud Ship Body */}
                      <div className="relative w-64 h-44 sm:w-80 sm:h-52 bg-gradient-to-b from-white via-sky-50 to-sky-100 rounded-[50px] shadow-[0_20px_50px_rgba(56,189,248,0.35)] border-4 border-sky-200 flex flex-col items-center justify-between p-4 transition-transform hover:scale-105">
                        {/* Upper Deck & Peaked Roof */}
                        <div className="w-32 h-14 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-2xl border-2 border-white flex items-center justify-center gap-2 shadow-inner">
                          <span className="text-2xl">👦</span>
                          <span className="text-2xl">👧</span>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">ASY-SYIFA</span>
                        </div>

                        {/* Cheerful Friendly Face (P1) */}
                        <div className="flex items-center justify-center gap-6 my-1">
                          {/* Left Eye with gentle blink */}
                          <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full translate-x-0.5 -translate-y-0.5" />
                          </div>

                          {/* Rosy Cheeks & Smile */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-4 border-b-4 border-rose-500 rounded-full" />
                            <div className="text-[10px] font-bold text-rose-500 mt-1">😊 Ramah</div>
                          </div>

                          {/* Right Eye */}
                          <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full translate-x-0.5 -translate-y-0.5" />
                          </div>
                        </div>

                        {/* Bottom Waves Trim */}
                        <div className="w-full flex justify-around text-xl opacity-90">
                          <span>🌊</span>
                          <span>☁️</span>
                          <span>🌊</span>
                          <span>☁️</span>
                          <span>🌊</span>
                        </div>

                        {/* Friendly Voice Tag */}
                        <div className="absolute -bottom-4 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-sky-300">
                          “Ayo berlayar bersama!”
                        </div>
                      </div>

                      {/* Characters standing on deck */}
                      <div className="flex items-center justify-center gap-2 mt-4">
                        {SHIP_COMPANIONS_ROSTER.slice(0, 4).map(c => (
                          <div
                            key={c.id}
                            className="bg-slate-900/80 px-2 py-1 rounded-xl border border-white/20 text-xs flex items-center gap-1 shadow"
                          >
                            <span>{c.avatarEmoji}</span>
                            <span className="font-semibold text-slate-200">{c.name.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-3xl border border-sky-500/30 max-w-sm flex flex-col items-center">
                      <div className="text-5xl mb-3 animate-pulse">☁️</div>
                      <h3 className="text-lg font-bold text-white mb-1">Kapal Awan Sedang Berlabuh</h3>
                      <p className="text-xs text-slate-300 mb-4">
                        Panggil Kapal Awan bersenyum ramah untuk memulai petualangan menuju pulau-pulau berkah.
                      </p>
                      <button
                        onClick={handleSummonShip}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2"
                      >
                        <Ship className="w-5 h-5" />
                        <span>Panggil Kapal Awan</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Target Island Landscape Card */}
                <div className="flex-1 w-full max-w-md bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                        <span>{activeIsland.iconEmoji}</span>
                        <span>Pulau ke-{activeIsland.order} dari 5</span>
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" /> 20 Detik Kisah
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{activeIsland.name}</h3>
                    <p className="text-xs text-slate-300 mb-3">{activeIsland.subtitle}</p>

                    {/* Story Scene Narration */}
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-3">
                      <div className="text-[11px] text-sky-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Adegan {snapshot.currentSceneIndex + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                        "{activeIsland.storyNarrative[snapshot.currentSceneIndex] || activeIsland.storyNarrative[0]}"
                      </p>
                    </div>

                    {/* Asy & Syifa Voice Lines */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-sky-950/60 border border-sky-800/50">
                        <span className="font-bold text-sky-300">👦 Dek Asy:</span>
                        <p className="text-slate-300 text-[11px] mt-0.5">{activeIsland.asyVoiceLine}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-pink-950/60 border border-pink-800/50">
                        <span className="font-bold text-pink-300">👧 Mbak Syifa:</span>
                        <p className="text-slate-300 text-[11px] mt-0.5">{activeIsland.syifaVoiceLine}</p>
                      </div>
                    </div>
                  </div>

                  {/* Island Navigation Controls */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={handleToggleVoyage}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                        snapshot.isVoyagePlaying
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                      }`}
                    >
                      {snapshot.isVoyagePlaying ? (
                        <>
                          <Pause className="w-4 h-4" /> Jeda Berlayar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Mulai Pelayaran (20s)
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        kapalAwanEngine.unlockIslandStamp(activeIsland.id);
                        kapalAwanEngine.playPassportStampSound();
                        showToast(`🌟 Stempel ${activeIsland.stampTitle} berhasil dicap di Paspor!`);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                      title="Cap Langsung Stempel Pulau Ini"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Cap Paspor</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* BOTTOM SEA: WAVES & INTERACTIVE SEA CREATURES (Bonus) */}
              <div className="relative z-10 mt-auto pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Sea creatures (Bonus) */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-400 font-medium">Sahabat Samudra:</span>
                  {creatures.map(cr => (
                    <button
                      key={cr.id}
                      onClick={() => handleCreatureClick(cr)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-sky-400 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shadow hover:scale-105"
                      title={`Klik untuk menyapa ${cr.name}`}
                    >
                      <span className="text-base">{cr.emoji}</span>
                      <span>{cr.name}</span>
                    </button>
                  ))}
                </div>

                {/* Weather switcher */}
                <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 px-2">Cuaca:</span>
                  {(['CERAH', 'BERAWAN', 'PELANGI'] as CheerfulWeather[]).map(w => (
                    <button
                      key={w}
                      onClick={() => {
                        kapalAwanEngine.setWeather(w);
                        showToast(`🌤️ Cuaca diubah ke: ${w}`);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                        snapshot.activeWeather === w
                          ? 'bg-sky-500 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {w === 'CERAH' ? '☀️ Cerah' : w === 'BERAWAN' ? '☁️ Awan' : '🌈 Pelangi'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: 5 PULAU CERITA (P3)                           */}
        {/* ==================================================== */}
        {activeTab === 'ISLANDS' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-400" />
                    5 Pulau Cerita & Karakter Islami
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Setiap pulau berdurasi ~20 detik dengan nilai adab, aktivitas kebaikan, dan stempel paspor berkah.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Non-Kompetitif
                </span>
              </div>

              {/* 5 Islands Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(ADVENTURE_ISLANDS_CATALOG).map(island => {
                  const isCurrent = snapshot.currentIslandId === island.id;
                  const isUnlocked = snapshot.isIslandUnlocked(island.id);

                  return (
                    <div
                      key={island.id}
                      className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-gradient-to-b from-slate-900 via-sky-950/50 to-slate-900 border-sky-400 shadow-xl shadow-sky-500/10 ring-2 ring-sky-400/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{island.iconEmoji}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isUnlocked
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isUnlocked ? '🌟 Dicap di Paspor' : '⏳ Belum Singgah'}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">
                          {island.order}. {island.name}
                        </h3>
                        <p className="text-xs text-sky-300 mb-2">{island.subtitle}</p>

                        <div className="p-2.5 rounded-xl bg-slate-800/60 text-xs text-slate-300 mb-3 border border-slate-700/50">
                          <span className="font-semibold text-amber-300">Nilai Adab:</span> {island.adabValue}
                        </div>

                        {/* Island Elements Preview */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {island.decorElements.map((el, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1"
                            >
                              <span>{el.emoji}</span>
                              <span>{el.label}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => handleSelectIsland(island.id)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-sky-500 text-white shadow-md'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          {isCurrent ? '⚓ Pulau Terpilih' : 'Arahkan Kapal'}
                        </button>

                        <button
                          onClick={() => {
                            handleSelectIsland(island.id);
                            kapalAwanEngine.startVoyage();
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1"
                          title="Langsung Berlayar 20 Detik"
                        >
                          <Play className="w-3.5 h-3.5" /> Berlayar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: SAHABAT IKUT BERLAYAR (P4)                    */}
        {/* ==================================================== */}
        {activeTab === 'COMPANIONS' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Smile className="w-5 h-5 text-purple-400" />
                    Sahabat Asy-Syifa di Atas Kapal Awan (DNA G20)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Setiap sahabat memiliki tugas mulia dan gerakan santun sesuai DNA resmi Asy-Syifa.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  8 Sahabat Roster
                </span>
              </div>

              {/* Roster Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SHIP_COMPANIONS_ROSTER.map(comp => {
                  const isSelected = selectedCompanionId === comp.id;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => {
                        setSelectedCompanionId(comp.id);
                        kapalAwanEngine.playShipWhistle('HIGH');
                      }}
                      className={`cursor-pointer rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500/20 to-sky-500/20 border border-purple-400/30 flex items-center justify-center text-3xl shadow-inner mb-3">
                          {comp.avatarEmoji}
                        </div>

                        <div className="flex items-center justify-center gap-1 text-xs text-amber-300 font-semibold mb-1">
                          <span>{comp.hatEmoji}</span>
                          <span>{comp.roleTitle}</span>
                        </div>

                        <h3 className="text-base font-bold text-white mb-2">{comp.name}</h3>

                        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 italic mb-3">
                          {comp.bubbleText}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>DNA: {comp.motionPreset}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: PASPOR PETUALANG (P6)                         */}
        {/* ==================================================== */}
        {activeTab === 'PASSPORT' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl text-slate-950 shadow-xl shadow-amber-500/20">
                    📖
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Paspor Petualang Asy-Syifa
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-300">
                      Buku Catatan Kenangan & Koleksi Cap Stempel 5 Pulau Kebaikan
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-amber-500/30 text-right">
                  <div className="text-[11px] text-slate-400">Total Cap Terkumpul:</div>
                  <div className="text-lg font-bold text-amber-300">
                    {snapshot.totalStampsCollected} / 5 Cap Berkah
                  </div>
                </div>
              </div>

              {/* Passport Stamps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                {Object.values(ADVENTURE_ISLANDS_CATALOG).map(island => {
                  const entry = snapshot.passportEntries.find(p => p.islandId === island.id);
                  const isCollected = Boolean(entry);

                  return (
                    <div
                      key={island.id}
                      className={`relative rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                        isCollected
                          ? 'bg-gradient-to-b from-amber-900/20 to-slate-900 border-amber-500/50 shadow-xl shadow-amber-500/10'
                          : 'bg-slate-900/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div>
                        {/* Stamp Icon */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner border-2 ${
                            isCollected
                              ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                              : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}>
                            {island.stampEmoji}
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isCollected
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isCollected ? `Dikunjungi ${entry?.visitedCount || 1}x` : 'Belum Dicap'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white mb-1">{island.stampTitle}</h3>
                        <div className="text-xs text-sky-300 mb-2">{island.name}</div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          {island.stampDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{isCollected ? '✅ Sah & Tercatat' : '⚓ Singgahi pulau ini'}</span>
                        {entry && (
                          <span className="text-amber-400/80">
                            {new Date(entry.unlockedAt).toLocaleDateString('id-ID')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* No Ranking / Non-Competitive Notice */}
              <div className="mt-8 p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex items-center gap-3 text-xs text-slate-300">
                <Heart className="w-5 h-5 text-rose-400 shrink-0" />
                <span>
                  <strong>Prinsip Paspor Petualang:</strong> Tidak ada skor dan tidak ada ranking. Semua santri dihargai atas ketulusan berdoa, belajar huruf hijaiyah, berhitung kurma sedekah, merawat alam, dan memupuk ukhuwah islamiyah.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: FOUNDER CONTROL COCKPIT (P7)                  */}
        {/* ==================================================== */}
        {activeTab === 'FOUNDER_COCKPIT' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-rose-500/30 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-rose-400" />
                    Founder Control Cockpit (G27 Master Simulator)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Instrumen pengujian suara murni Web Audio, simulasi pelayaran, preview 5 pulau, dan telemetri Black Box Ring-0.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  G27_KAPAL_AWAN_VERIFIED
                </span>
              </div>

              {/* Audio Synthesizer Audition Panel */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Music className="w-4 h-4" /> Uji Suara Web Audio (Pure Synthesizer)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={() => {
                      kapalAwanEngine.playShipWhistle('DOUBLE');
                      showToast('🎺 Peluit Kapal: Tooot! Tooot!');
                    }}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-all hover:scale-105"
                  >
                    <div className="text-xl mb-1">🎺</div>
                    <div className="font-bold text-white">Peluit Ganda</div>
                    <div className="text-[10px] text-slate-400">Tooot... Tooot!</div>
                  </button>

                  <button
                    onClick={() => {
                      kapalAwanEngine.playShipWhistle('HIGH');
                      showToast('🎺 Peluit Kapal: Nada Tinggi');
                    }}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-all hover:scale-105"
                  >
                    <div className="text-xl mb-1">📢</div>
                    <div className="font-bold text-white">Peluit Tinggi</div>
                    <div className="text-[10px] text-slate-400">Keberangkatan</div>
                  </button>

                  <button
                    onClick={() => {
                      kapalAwanEngine.playGentleWaves();
                      showToast('🌊 Deburan Ombak Lembut dimainkan');
                    }}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-all hover:scale-105"
                  >
                    <div className="text-xl mb-1">🌊</div>
                    <div className="font-bold text-white">Ombak Lembut</div>
                    <div className="text-[10px] text-slate-400">Brown Noise Sweep</div>
                  </button>

                  <button
                    onClick={() => {
                      kapalAwanEngine.playSeagullCall();
                      showToast('🕊️ Celoteh Burung Camar');
                    }}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-all hover:scale-105"
                  >
                    <div className="text-xl mb-1">🕊️</div>
                    <div className="font-bold text-white">Burung Camar</div>
                    <div className="text-[10px] text-slate-400">Kweeek... Kweeek!</div>
                  </button>

                  <button
                    onClick={() => {
                      kapalAwanEngine.playDolphinSound();
                      showToast('🐬 Celoteh Lumba-Lumba Ceria');
                    }}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-all hover:scale-105"
                  >
                    <div className="text-xl mb-1">🐬</div>
                    <div className="font-bold text-white">Lumba-Lumba</div>
                    <div className="text-[10px] text-slate-400">FM Chirp & Click</div>
                  </button>

                  <button
                    onClick={() => {
                      kapalAwanEngine.playPassportStampSound();
                      showToast('🌟 Stempel Paspor Berkah dicap');
                    }}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs text-slate-200 transition-all hover:scale-105"
                  >
                    <div className="text-xl mb-1">🌟</div>
                    <div className="font-bold text-white">Stempel Paspor</div>
                    <div className="text-[10px] text-slate-400">Thud + Sparkles</div>
                  </button>
                </div>
              </div>

              {/* Simulation Quick Jump */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Navigation className="w-4 h-4" /> Simulasi Cepat 5 Pulau Cerita
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {Object.values(ADVENTURE_ISLANDS_CATALOG).map(island => (
                    <button
                      key={island.id}
                      onClick={() => {
                        handleSelectIsland(island.id);
                        kapalAwanEngine.startVoyage();
                        setActiveTab('VOYAGE');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-all hover:border-emerald-400"
                    >
                      <div className="text-2xl mb-1">{island.iconEmoji}</div>
                      <div className="font-bold text-white">{island.name}</div>
                      <div className="text-[11px] text-emerald-400 mt-0.5">Mulai Pelayaran 20s →</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Integrations Overview */}
              <div>
                <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Integrasi Ekosistem TADE Asy-Syifa
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
                    <div className="font-bold text-sky-300 mb-0.5">📺 TV Asy (G15)</div>
                    <p className="text-slate-400 text-[11px]">Kisah pulau tersinkron dengan jadwal siaran edukatif.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
                    <div className="font-bold text-purple-300 mb-0.5">🌌 Bioskop Langit (G26)</div>
                    <p className="text-slate-400 text-[11px]">Layar malam menceritakan pelayaran Kapal Awan.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
                    <div className="font-bold text-amber-300 mb-0.5">🎬 Sutradara G22</div>
                    <p className="text-slate-400 text-[11px]">Adegan pementasan dapat menggunakan aset kapal.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
                    <div className="font-bold text-emerald-300 mb-0.5">🌦️ Weather Engine</div>
                    <p className="text-slate-400 text-[11px]">Siklus cuaca ceria otomatis tanpa duplikasi engine.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PASSPORT MODAL (P6) */}
      {isPassportOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsPassportOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📖</span>
              <div>
                <h3 className="text-lg font-bold text-white">Paspor Petualang Santri Asy-Syifa</h3>
                <p className="text-xs text-amber-300">Koleksi Cap Stempel 5 Pulau Kebaikan</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {Object.values(ADVENTURE_ISLANDS_CATALOG).map(isl => {
                const entry = snapshot.passportEntries.find(p => p.islandId === isl.id);
                const isCollected = Boolean(entry);

                return (
                  <div
                    key={isl.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      isCollected
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{isl.stampEmoji}</div>
                      <div>
                        <div className="text-xs font-bold text-white">{isl.stampTitle}</div>
                        <div className="text-[11px] text-slate-300">{isl.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                        isCollected
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isCollected ? '✅ Tercatat' : '⚓ Belum Singgah'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsPassportOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
              >
                Tutup Paspor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KapalAwanHub;

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
