import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  MapPin,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Sunset,
  CloudRain,
  Rainbow,
  Volume2,
  Navigation,
  BookOpen,
  Sliders,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Heart,
  Award,
  Play,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import {
  petaDuniaEngine,
  WorldLocationId,
  WorldLocationInfo,
  WORLD_LOCATIONS_CATALOG
} from '../../services/petaDuniaEngine';
import { TimePhase, CheerfulWeather } from '../../services/livingWorldEngine';
import { SchoolEventType } from '../../services/livingEventEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface PetaDuniaHubProps {
  onNavigateToModule?: (moduleId: string) => void;
}

export const PetaDuniaHub: React.FC<PetaDuniaHubProps> = ({ onNavigateToModule }) => {
  const [snapshot, setSnapshot] = useState(petaDuniaEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'MAP' | 'PASSPORT' | 'VEHICLES' | 'COCKPIT'>('MAP');
  const [inspectLocation, setInspectLocation] = useState<WorldLocationInfo | null>(
    WORLD_LOCATIONS_CATALOG['RUMAH_ASY']
  );
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());
  const [showQuickTips, setShowQuickTips] = useState<boolean>(true);

  useEffect(() => {
    const unsub = petaDuniaEngine.subscribe(() => {
      setSnapshot(petaDuniaEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handleSelectLocation = (locId: WorldLocationId) => {
    const loc = WORLD_LOCATIONS_CATALOG[locId];
    setInspectLocation(loc);
    petaDuniaEngine.selectLocation(locId, 'AWAN_BERGESER');
  };

  const handleLaunchModule = (moduleId: string) => {
    petaDuniaEngine.playTransitionChime();
    if (onNavigateToModule) {
      onNavigateToModule(moduleId);
    } else {
      // Dispatch custom event for App.tsx fallback
      window.dispatchEvent(new CustomEvent('tade_navigate', { detail: { tabId: moduleId } }));
    }
  };

  // Sky gradient based on Living Time
  const getSkyBackground = () => {
    switch (snapshot.timePhase) {
      case 'PAGI':
        return 'from-amber-200 via-sky-200 to-sky-400';
      case 'SIANG':
        return 'from-sky-300 via-sky-200 to-emerald-200';
      case 'SORE':
        return 'from-orange-300 via-rose-300 to-indigo-400';
      case 'MALAM':
        return 'from-indigo-950 via-slate-900 to-sky-950';
      default:
        return 'from-sky-200 via-sky-100 to-emerald-100';
    }
  };

  // Event decoration badge
  const getEventBadge = () => {
    switch (snapshot.activeEvent) {
      case 'RAMADHAN':
        return { label: '🌙 Ramadhan Berkah', color: 'bg-emerald-600 text-white' };
      case 'IDUL_FITRI':
        return { label: '🕌 Idul Fitri Ceria', color: 'bg-amber-600 text-white' };
      case 'WISUDA':
        return { label: '🎓 Haflah & Wisuda Santri', color: 'bg-indigo-600 text-white' };
      case 'KEMERDEKAAN':
        return { label: '🇮🇩 Gebyar Kemerdekaan RI', color: 'bg-rose-600 text-white' };
      case 'HARI_SANTRI':
        return { label: '🌿 Hari Santri Nasional', color: 'bg-teal-700 text-white' };
      case 'PPDB':
        return { label: '🎒 Selamat Datang Santri Baru (PPDB)', color: 'bg-blue-600 text-white' };
      default:
        return { label: '🌟 Hari Belajar Ceria Sepanjang Tahun', color: 'bg-sky-700 text-white' };
    }
  };

  const eventBadge = getEventBadge();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION BAR (World Map Header)
      ========================================================= */}
      <header className="bg-white/95 backdrop-blur border-b border-sky-100 px-4 py-3 sticky top-0 z-40 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                Peta Dunia TADE
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                Sprint G28
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full shadow-sm ${eventBadge.color}`}>
                {eventBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Satu Dunia Utuh TK Islam Asy-Syifa • 9 Lokasi Karakter & Transportasi Ceria
            </p>
          </div>
        </div>

        {/* Tabs & Quick Stats */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('MAP')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'MAP'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Peta Hidup
            </button>
            <button
              onClick={() => setActiveTab('PASSPORT')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'PASSPORT'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Paspor ({snapshot.totalStampsCollected}/9)
            </button>
            <button
              onClick={() => setActiveTab('VEHICLES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'VEHICLES'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              Armada Ceria ({snapshot.vehicles.length})
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
            onClick={() => petaDuniaEngine.toggleEcoMode()}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
              snapshot.ecoModeActive
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Eco Mode mengoptimalkan konsumsi CPU dan daya perangkat"
          >
            <Zap className="w-3.5 h-3.5" />
            {snapshot.ecoModeActive ? 'Eco ON' : 'Eco Mode'}
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN INTERACTIVE CONTAINER
      ========================================================= */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* ==========================================
            VIEW TAB 1: PETA HIDUP (MASTER 3D MAP CANVAS)
        ========================================== */}
        {activeTab === 'MAP' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full relative">
            {/* World Map Interactive Stage */}
            <div className="flex-1 relative min-h-[580px] lg:min-h-[720px] overflow-hidden flex items-center justify-center p-3 sm:p-6 bg-slate-950">
              {/* Dynamic Living Sky Backdrop */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${getSkyBackground()} transition-all duration-1000 opacity-90`}
              />

              {/* Sky Celestial Elements */}
              {snapshot.timePhase === 'MALAM' ? (
                <div className="absolute top-6 left-10 flex items-center gap-2 pointer-events-none">
                  <span className="text-4xl animate-bounce">🌙</span>
                  <div className="text-amber-200 text-xs font-bold drop-shadow">
                    Malam Penuh Bintang & Sholawat
                  </div>
                </div>
              ) : (
                <div className="absolute top-6 left-10 flex items-center gap-2 pointer-events-none">
                  <span className="text-4xl animate-pulse">
                    {snapshot.timePhase === 'PAGI' ? '🌅' : snapshot.timePhase === 'SORE' ? '🌇' : '☀️'}
                  </span>
                  <div className="text-sky-900/80 text-xs font-bold drop-shadow-sm">
                    {snapshot.timePhase === 'PAGI'
                      ? 'Pagi Berkah & Embun Sejuk'
                      : snapshot.timePhase === 'SORE'
                      ? 'Sore Emas Menjelang Maghrib'
                      : 'Siang Ceria Penuh Semangat'}
                  </div>
                </div>
              )}

              {/* Bonus Ambient Floating Elements */}
              {!snapshot.ecoModeActive && (
                <>
                  {/* Floating Hot Air Balloons */}
                  <motion.div
                    animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-12 right-28 pointer-events-none text-3xl filter drop-shadow-md z-10"
                  >
                    🎈
                  </motion.div>
                  {/* Fluttering Butterflies */}
                  <motion.div
                    animate={{ y: [0, -8, 0], x: [0, -12, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-48 left-1/4 pointer-events-none text-2xl filter drop-shadow z-10"
                  >
                    🦋
                  </motion.div>
                  {/* Morning Birds */}
                  <motion.div
                    animate={{ x: [-20, 20, -20], y: [0, -6, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 right-1/3 pointer-events-none text-2xl filter drop-shadow z-10"
                  >
                    🕊️
                  </motion.div>
                  {/* Colorful Kites */}
                  <motion.div
                    animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-36 right-16 pointer-events-none text-2xl filter drop-shadow z-10"
                  >
                    🪁
                  </motion.div>
                </>
              )}

              {/* THE 3D CARTOON WORLD TERRAIN ISLAND (SVG + CSS ISOMETRIC CANVAS) */}
              <div className="relative w-full max-w-5xl aspect-[16/10] bg-emerald-500/90 rounded-[40px] shadow-2xl border-4 border-emerald-300/80 overflow-hidden backdrop-blur-sm z-10">
                {/* Terrain Textures & Hills */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 opacity-90" />

                {/* River Stream from Mountains to Ocean */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 1000 625">
                  <defs>
                    <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                  </defs>
                  {/* Sparkling Blue River */}
                  <path
                    d="M 450,140 Q 420,280 480,340 T 300,550"
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="28"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 450,140 Q 420,280 480,340 T 300,550"
                    fill="none"
                    stroke="#e0f2fe"
                    strokeWidth="6"
                    strokeDasharray="12 12"
                    strokeLinecap="round"
                  />

                  {/* Railway Track for Kereta Sholawat */}
                  <path
                    d="M 180,420 Q 300,430 480,345 T 720,220"
                    fill="none"
                    stroke="url(#trackGrad)"
                    strokeWidth="10"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />

                  {/* Roadway for Bus Kuning & Ambulans */}
                  <path
                    d="M 220,240 Q 350,220 480,345 T 740,425"
                    fill="none"
                    stroke="#fde047"
                    strokeWidth="14"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </svg>

                {/* Ocean & Coastline on the South / East */}
                <div className="absolute bottom-0 right-0 w-2/3 h-1/3 bg-gradient-to-t from-sky-600 via-sky-500 to-transparent rounded-tl-[100px] opacity-70 pointer-events-none flex items-end justify-end p-4">
                  <span className="text-white text-xs font-black tracking-wider opacity-60">
                    🌊 SAMUDRA BERKAH ASY-SYIFA
                  </span>
                </div>

                {/* Event Decorations on Map Terrain */}
                {snapshot.activeEvent === 'RAMADHAN' && (
                  <div className="absolute top-4 right-4 bg-emerald-900/80 text-emerald-200 text-xs px-3 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1.5 shadow-lg">
                    <span>🏮 Lentera & Ketupat Berkah Terpasang</span>
                  </div>
                )}
                {snapshot.activeEvent === 'WISUDA' && (
                  <div className="absolute top-4 right-4 bg-indigo-900/80 text-amber-200 text-xs px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5 shadow-lg">
                    <span>🎓 Gapura Emas Haflah Akhirussanah</span>
                  </div>
                )}

                {/* ====================================================
                    RENDER THE 9 WORLD LOCATIONS (P1 & P2)
                ==================================================== */}
                {Object.values(WORLD_LOCATIONS_CATALOG).map((loc) => {
                  const isSelected = snapshot.selectedLocationId === loc.id;
                  const isVisited = snapshot.isLocationVisited(loc.id);

                  return (
                    <motion.div
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc.id)}
                      whileHover={{ scale: 1.12, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20`}
                      style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                    >
                      {/* Location Outer Landmark Halo */}
                      <div
                        className={`relative p-3 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-white shadow-2xl ring-4 ring-amber-400 scale-110'
                            : 'bg-white/90 hover:bg-white shadow-lg border-2 border-white/80'
                        }`}
                      >
                        {/* 3D Landmark Emoji Icon */}
                        <div className="relative">
                          <span className="text-3xl sm:text-4xl filter drop-shadow-md select-none">
                            {loc.iconEmoji}
                          </span>
                          {/* Visited Passport Check Badge */}
                          {isVisited && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow border border-white">
                              ✓
                            </span>
                          )}
                        </div>

                        {/* Location Name Pill */}
                        <span
                          className={`mt-1 text-[11px] sm:text-xs font-black tracking-tight whitespace-nowrap px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-800 group-hover:bg-sky-600 group-hover:text-white'
                          }`}
                        >
                          {loc.shortLabel}
                        </span>

                        {/* Special Decor Tag */}
                        <span className="text-[9px] text-slate-500 font-semibold mt-0.5">
                          {loc.specialDecor[0]?.emoji} {loc.specialDecor[0]?.label}
                        </span>
                      </div>

                      {/* Gentle pulsating glow under marker */}
                      <div
                        className="absolute inset-0 rounded-full blur-md -z-10 opacity-70 animate-pulse"
                        style={{ backgroundColor: loc.bgGlow }}
                      />
                    </motion.div>
                  );
                })}

                {/* ====================================================
                    RENDER MOVING VEHICLES ON MAP (P3 TRANSPORTASI CERIA)
                ==================================================== */}
                {snapshot.vehicles.map((v) => {
                  // Compute simple coordinates on tracks/roads
                  let vx = 50;
                  let vy = 50;
                  if (v.type === 'KERETA') {
                    vx = 18 + (snapshot.vehicles[0].progressPercent / 100) * 54;
                    vy = 42 - Math.sin((snapshot.vehicles[0].progressPercent / 100) * Math.PI) * 12;
                  } else if (v.type === 'BUS_SEKOLAH') {
                    vx = 22 + (v.progressPercent / 100) * 52;
                    vy = 24 + Math.sin((v.progressPercent / 100) * Math.PI) * 16;
                  } else if (v.type === 'KAPAL_AWAN') {
                    vx = 28 + (v.progressPercent / 100) * 52;
                    vy = 88 - Math.sin((v.progressPercent / 100) * Math.PI) * 15;
                  } else if (v.type === 'AMBULANS') {
                    vx = 48 + Math.cos((v.progressPercent / 100) * Math.PI * 2) * 16;
                    vy = 55 + Math.sin((v.progressPercent / 100) * Math.PI * 2) * 14;
                  } else if (v.type === 'PEMADAM') {
                    vx = 48 + Math.sin((v.progressPercent / 100) * Math.PI * 2) * 20;
                    vy = 55 - Math.cos((v.progressPercent / 100) * Math.PI * 2) * 16;
                  }

                  return (
                    <motion.div
                      key={v.id}
                      onClick={() => v.soundTrigger()}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      title={`${v.name}: ${v.phrase} (Klik untuk bunyikan klakson!)`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-full shadow-md border border-slate-200 transition-transform"
                      style={{ left: `${vx}%`, top: `${vy}%` }}
                    >
                      <span className="text-xl">{v.emoji}</span>
                      <span className="text-[10px] font-black text-slate-800 hidden sm:inline">
                        {v.name.split(' ')[0]}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* ====================================================
                  CINEMATIC TRANSITION OVERLAYS (P2 CAMERA & CLOUDS)
              ==================================================== */}
              <AnimatePresence>
                {snapshot.isTransitioning && (
                  <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
                    {/* Parting Fluffy Clouds */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      exit={{ x: '-100%' }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="absolute top-0 bottom-0 left-0 w-1/2 bg-sky-200/90 backdrop-blur-md flex items-center justify-end pr-8"
                    >
                      <span className="text-6xl">☁️</span>
                    </motion.div>
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: '0%' }}
                      exit={{ x: '100%' }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="absolute top-0 bottom-0 right-0 w-1/2 bg-sky-200/90 backdrop-blur-md flex items-center justify-start pl-8"
                    >
                      <span className="text-6xl">☁️</span>
                    </motion.div>

                    {/* Rainbow Light Sweep */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1.1 }}
                      exit={{ opacity: 0, scale: 1.3 }}
                      transition={{ duration: 0.5 }}
                      className="z-10 flex flex-col items-center bg-white/95 px-6 py-4 rounded-3xl shadow-2xl border-2 border-sky-300"
                    >
                      <span className="text-5xl animate-bounce">🌈</span>
                      <span className="text-sm font-black text-sky-900 mt-2">
                        Menuju {snapshot.selectedLocation?.name}...
                      </span>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* ====================================================
                SIDEBAR INSPECTOR PANEL: LOCATION DETAILS & JUMP
            ==================================================== */}
            <aside className="w-full lg:w-96 bg-white border-l border-slate-200 p-5 flex flex-col justify-between shadow-xl z-30">
              {inspectLocation ? (
                <div className="space-y-4">
                  {/* Top Category & Host */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                      {inspectLocation.category} • {inspectLocation.sprintOrigin}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                      <span>{inspectLocation.hostEmoji}</span>
                      <span>{inspectLocation.characterHost}</span>
                    </div>
                  </div>

                  {/* Location Title & 3D Landmark */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                        {inspectLocation.iconEmoji}
                      </span>
                      <div>
                        <h2 className="text-lg font-black text-slate-900 leading-tight">
                          {inspectLocation.name}
                        </h2>
                        <p className="text-xs text-sky-700 font-semibold mt-0.5">
                          {inspectLocation.landmark3D}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-3">
                      {inspectLocation.description}
                    </p>
                  </div>

                  {/* Character Voice Quote */}
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 italic flex items-start gap-2.5">
                    <span className="text-xl">💬</span>
                    <span>{inspectLocation.welcomeVoiceLine}</span>
                  </div>

                  {/* Landmark Highlights */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Fasilitas & Keistimewaan
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {inspectLocation.specialDecor.map((d, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center"
                        >
                          <span className="text-xl">{d.emoji}</span>
                          <span className="text-[10px] font-bold text-slate-700 mt-1 line-clamp-1">
                            {d.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Passport Stamp Status */}
                  <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm">
                        {inspectLocation.stampEmoji}
                      </div>
                      <div>
                        <div className="text-xs font-black text-emerald-950">
                          {inspectLocation.stampTitle}
                        </div>
                        <div className="text-[10px] text-emerald-700">
                          {snapshot.isLocationVisited(inspectLocation.id)
                            ? '✓ Telah tercatat di Paspor Petualang'
                            : 'Belum dikunjungi • Kunjungi sekarang!'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <Compass className="w-12 h-12 mx-auto mb-3 text-slate-300 animate-spin" />
                  <p className="text-sm font-semibold">
                    Pilih salah satu lokasi di peta untuk melihat detail
                  </p>
                </div>
              )}

              {/* Action Button to Open / Enter Location Module */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                {inspectLocation && (
                  <button
                    onClick={() => handleLaunchModule(inspectLocation.targetModuleId)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-800 text-white font-black text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Masuk ke {inspectLocation.shortLabel}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                <div className="text-center text-[10px] text-slate-400 font-medium">
                  TADE World Engine • Dr. Pulse 60 FPS • {governorSlots}/5 Governor Slots Active
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ==========================================
            VIEW TAB 2: PASPOR PETUALANG (P6)
        ========================================== */}
        {activeTab === 'PASSPORT' && (
          <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-500/20">
                    📖
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Buku Paspor Petualang Dunia TADE
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Catatan Perjalanan & Cap Barakah Santri • Tanpa Skor, Murni Ketulusan Belajar
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-600">
                    {snapshot.totalStampsCollected} / 9
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Cap Terkumpul
                  </p>
                </div>
              </div>

              {/* 9 Stamped Passport Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(WORLD_LOCATIONS_CATALOG).map((loc) => {
                  const entry = snapshot.passportEntries.find((p) => p.locationId === loc.id);
                  const isUnlocked = !!entry;

                  return (
                    <div
                      key={loc.id}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        isUnlocked
                          ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                          : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-amber-200">
                            {isUnlocked ? loc.stampEmoji : '🔒'}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isUnlocked
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isUnlocked ? `Dikunjungi ${entry.visitCount}x` : 'Belum Dikunjungi'}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-slate-900">{loc.stampTitle}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {loc.stampDescription}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">{loc.shortLabel}</span>
                        {isUnlocked ? (
                          <button
                            onClick={() => handleLaunchModule(loc.targetModuleId)}
                            className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1"
                          >
                            Buka <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSelectLocation(loc.id)}
                            className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                          >
                            Kunjungi <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW TAB 3: ARMADA CERIA TRANSPORTASI (P3)
        ========================================== */}
        {activeTab === 'VEHICLES' && (
          <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-500/20">
                    🚚
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Armada Transportasi Ceria TADE
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Semua Kendaraan Bergerak Lembut Menghubungkan 9 Lokasi di Dunia Asy-Syifa
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {snapshot.vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                            {v.emoji}
                          </span>
                          <div>
                            <h3 className="text-sm font-black text-slate-900">{v.name}</h3>
                            <span className="text-xs font-semibold text-emerald-700">
                              {v.routeLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 mb-3">
                        <div className="flex justify-between text-slate-500">
                          <span>Posisi Terkini:</span>
                          <span className="font-bold text-slate-800">{v.currentStop}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Progres Jalur:</span>
                          <span className="font-bold text-emerald-600">
                            {Math.round(v.progressPercent)}%
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 italic">“{v.phrase}”</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => v.soundTrigger()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Bunyikan Klakson / Suara
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW TAB 4: FOUNDER COCKPIT (P7)
        ========================================== */}
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
                      Founder Map Control Cockpit
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Simulasi Waktu, Cuaca, Acara Hari Besar, Transisi Kamera & Black Box Ring-0
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

              {/* Simulation Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Living Time Engine Simulator (P4) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Simulasi Waktu (P4)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Ubah pencahayaan langit dan atmosfer dunia secara instan:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['PAGI', 'SIANG', 'SORE', 'MALAM'] as TimePhase[]).map((tp) => (
                      <button
                        key={tp}
                        onClick={() => petaDuniaEngine.setTimePhase(tp)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          snapshot.timePhase === tp
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tp === 'PAGI' && '🌅 Pagi'}
                        {tp === 'SIANG' && '☀️ Siang'}
                        {tp === 'SORE' && '🌇 Sore'}
                        {tp === 'MALAM' && '🌙 Malam'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Living Event Engine Simulator (P5) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Simulasi Acara (P5)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Dekorasi gerbang, lampion, dan bendera berubah otomatis:
                  </p>
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
                        onClick={() => petaDuniaEngine.setActiveEvent(ev)}
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

                {/* 3. Audio & Transition Tester */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Audio & Transisi Synth</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Uji instan synthesizer murni Web Audio API:
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => petaDuniaEngine.playTransitionChime()}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🌈 Transisi Pelangi Chime</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => petaDuniaEngine.playTrainWhistle()}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🚂 Peluit Kereta Tut-tut</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => petaDuniaEngine.playShipWhistle()}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-between"
                    >
                      <span>☁️ Peluit Uap Kapal Awan</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => petaDuniaEngine.playStampChime()}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🔖 Cap Paspor Petualang</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Governor & Performance Diagnostics */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Dr. Pulse Performance & TADE Governor
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
                    <span className="text-slate-400 text-[10px] block">Status Eco Mode:</span>
                    <span className="text-sm font-black text-emerald-400">
                      {snapshot.ecoModeActive ? 'AKTIF (Low CPU)' : 'NORMAL'}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Armada Berpatroli:</span>
                    <span className="text-sm font-black text-sky-300">
                      {snapshot.vehicles.length} Kendaraan
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Ring-0 Black Box:</span>
                    <span className="text-sm font-black text-indigo-300">RECORDING LIVE</span>
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

export default PetaDuniaHub;
