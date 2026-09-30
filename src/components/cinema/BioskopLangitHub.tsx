import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Armchair,
  BookOpen,
  Volume2,
  Film,
  Activity,
  Sliders,
  CheckCircle,
  HelpCircle,
  Tv,
  Clapperboard,
  Building2,
  Palette,
  Calendar,
  Layers
} from 'lucide-react';
import {
  bioskopLangitEngine,
  CINEMA_SEATS_CATALOG,
  CINEMA_STORIES_CATALOG,
  CinemaSeatType
} from '../../services/bioskopLangitEngine';
import { StarProjectorBeam } from './StarProjectorBeam';
import { CloudSeatSelector } from './CloudSeatSelector';
import { PopcornCeriaWidget } from './PopcornCeriaWidget';
import { CelestialOutroModal } from './CelestialOutroModal';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';

export const BioskopLangitHub: React.FC = () => {
  // Engine State Sync
  const [, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'BIOSKOP' | 'KATALOG' | 'KURSI' | 'COCKPIT'>('BIOSKOP');
  const [isCloudCurtainOpen, setIsCloudCurtainOpen] = useState<boolean>(true);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  useEffect(() => {
    const unsub = bioskopLangitEngine.subscribe(() => {
      setTick(prev => prev + 1);
    });
    return () => unsub();
  }, []);

  const activeSeat = bioskopLangitEngine.getActiveSeat();
  const activeSeatInfo = bioskopLangitEngine.getActiveSeatInfo();
  const activeStory = bioskopLangitEngine.getActiveStory();
  const currentScene = bioskopLangitEngine.getCurrentScene();
  const currentSceneIndex = bioskopLangitEngine.getCurrentSceneIndex();
  const isPlaying = bioskopLangitEngine.getIsPlaying();
  const isNightMode = bioskopLangitEngine.getIsNightMode();
  const isProjectorOn = bioskopLangitEngine.getIsProjectorOn();
  const popcornCount = bioskopLangitEngine.getPopcornCount();
  const isOutroActive = bioskopLangitEngine.getIsOutroActive();
  const isEcoMode = bioskopLangitEngine.getIsEcoMode();

  // Handlers
  const handleTogglePlay = () => {
    if (isPlaying) {
      bioskopLangitEngine.pausePlayback();
    } else {
      bioskopLangitEngine.startPlayback();
    }
  };

  const handleNextScene = () => {
    bioskopLangitEngine.nextScene();
  };

  const handlePrevScene = () => {
    bioskopLangitEngine.prevScene();
  };

  const handleSelectStory = (storyId: string) => {
    bioskopLangitEngine.selectStory(storyId);
    setActiveTab('BIOSKOP');
  };

  const handleSelectSeat = (seat: CinemaSeatType) => {
    bioskopLangitEngine.selectSeat(seat);
  };

  const handlePopcorn = () => {
    // Engine handles audio and state increment
  };

  const handleReplayStory = () => {
    bioskopLangitEngine.dismissOutro();
    bioskopLangitEngine.selectStory(activeStory.id);
    bioskopLangitEngine.startPlayback();
  };

  const handleTestSound = (soundType: 'POPCORN' | 'PROJECTOR' | 'STAR_BELL' | 'TRANSITION' | 'SEAT' | 'OUTRO') => {
    switch (soundType) {
      case 'POPCORN': bioskopLangitEngine.playPopcornPopSound(); break;
      case 'PROJECTOR': bioskopLangitEngine.playProjectorClick(); break;
      case 'STAR_BELL': bioskopLangitEngine.playStarBell(); break;
      case 'TRANSITION': bioskopLangitEngine.playSceneTransitionChime(); break;
      case 'SEAT': bioskopLangitEngine.playSeatWhoosh(); break;
      case 'OUTRO': bioskopLangitEngine.playOutroCelebration(); break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Banner & Title Bar */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-indigo-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(251,191,36,0.4)] border border-amber-300/60 shrink-0">
              🌙
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-400/40">
                  SPRINT G26 • DNA & MASKOT
                </span>
                <span className="bg-sky-500/20 text-sky-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-sky-400/30">
                  60 FPS Governor
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Bioskop Langit Asy & Syifa
              </h1>
              <p className="text-xs text-slate-300">
                Tempat keluarga menikmati cerita malam penuh adab & kebaikan di bawah bintang Tanggul
              </p>
            </div>
          </div>

          {/* Quick Control Pills & Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Day / Night Toggle */}
            <button
              onClick={() => bioskopLangitEngine.toggleNightMode()}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                isNightMode
                  ? 'bg-indigo-900/80 text-amber-300 border-amber-400/40 shadow-inner'
                  : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
              }`}
              title="Ganti Mode Langit"
            >
              {isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isNightMode ? 'Malam Bintang' : 'Senja Emas'}</span>
            </button>

            {/* Cloud Curtain Open/Close Toggle */}
            <button
              onClick={() => setIsCloudCurtainOpen(prev => !prev)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span>☁️</span>
              <span>{isCloudCurtainOpen ? 'Tirai Awan Terbuka' : 'Tirai Awan Tertutup'}</span>
            </button>

            {/* Help Button */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Panduan Bioskop Langit"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4 pt-3 border-t border-indigo-500/20 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('BIOSKOP')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'BIOSKOP'
                ? 'bg-amber-400 text-indigo-950 shadow-md ring-2 ring-amber-300/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Layar Bioskop Langit
          </button>
          <button
            onClick={() => setActiveTab('KATALOG')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'KATALOG'
                ? 'bg-amber-400 text-indigo-950 shadow-md ring-2 ring-amber-300/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Katalog Cerita Malam ({CINEMA_STORIES_CATALOG.length})
          </button>
          <button
            onClick={() => setActiveTab('KURSI')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'KURSI'
                ? 'bg-amber-400 text-indigo-950 shadow-md ring-2 ring-amber-300/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Armchair className="w-3.5 h-3.5" /> Kursi Awan ({activeSeatInfo.name})
          </button>
          <button
            onClick={() => setActiveTab('COCKPIT')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'COCKPIT'
                ? 'bg-amber-400 text-indigo-950 shadow-md ring-2 ring-amber-300/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Pusat Cockpit Founder
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* ========================================================
            TAB 1: LAYAR BIOSKOP LANGIT UTAMA (P1, P2, P3, P4, P5)
           ======================================================== */}
        {activeTab === 'BIOSKOP' && (
          <div className="space-y-6">
            {/* CELESTIAL SCREEN (P1 — LANGIT MENJADI LAYAR) */}
            <div className="relative w-full rounded-3xl border-2 border-indigo-500/40 overflow-hidden shadow-2xl bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 min-h-[420px] sm:min-h-[500px] flex flex-col justify-between p-4 sm:p-6">
              {/* Background Stars & Aurora */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-3 left-10 text-xl animate-pulse">✨</div>
                <div className="absolute top-12 right-20 text-2xl animate-pulse" style={{ animationDelay: '1.2s' }}>⭐</div>
                <div className="absolute top-24 left-1/4 text-xs animate-ping" style={{ animationDuration: '4s' }}>✨</div>
                <div className="absolute top-8 right-1/3 text-lg animate-pulse" style={{ animationDelay: '0.6s' }}>🌟</div>
                <div className="absolute bottom-20 left-12 text-sm animate-bounce" style={{ animationDuration: '5s' }}>✨</div>

                {/* Soft Aurora Glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-b from-teal-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl" />
              </div>

              {/* Cloud Curtains (P1: Awan Membuka Perlahan) */}
              <div
                className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-slate-900/95 via-sky-950/80 to-transparent transition-transform duration-1000 ease-in-out z-20 pointer-events-none flex items-center justify-start pl-4 ${
                  isCloudCurtainOpen ? '-translate-x-full' : 'translate-x-0'
                }`}
              >
                <div className="text-4xl sm:text-6xl opacity-70">☁️</div>
              </div>
              <div
                className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-slate-900/95 via-sky-950/80 to-transparent transition-transform duration-1000 ease-in-out z-20 pointer-events-none flex items-center justify-end pr-4 ${
                  isCloudCurtainOpen ? 'translate-x-full' : 'translate-x-0'
                }`}
              >
                <div className="text-4xl sm:text-6xl opacity-70">☁️</div>
              </div>

              {/* Top Sky Bar: Moon, Episode Info, Current Seat Tag */}
              <div className="relative z-10 flex items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
                {/* Smiling Moon (P1) */}
                <div className="flex items-center gap-2.5 bg-slate-900/70 border border-amber-400/30 rounded-2xl px-3 py-1.5 shadow">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                    🌙
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-300 block">Bulan Tersenyum</span>
                    <span className="text-[10px] text-slate-300">Langit Cerah Berkah</span>
                  </div>
                </div>

                {/* Story Title Banner */}
                <div className="text-center hidden sm:block">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                    {activeStory.sourceLabel}
                  </span>
                  <h2 className="text-base font-bold text-white tracking-wide mt-0.5">{activeStory.title}</h2>
                </div>

                {/* Active Cloud Seat Pill (P3) */}
                <button
                  onClick={() => setActiveTab('KURSI')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-bold shadow transition hover:scale-105 ${activeSeatInfo.borderGlow} bg-slate-900/80`}
                >
                  <span className="text-base">{activeSeatInfo.iconEmoji}</span>
                  <span className="text-slate-200">{activeSeatInfo.name}</span>
                </button>
              </div>

              {/* CENTER STAGE: SCENE ANIMATION & VISUAL STORY TELLER (P4) */}
              <div className="relative z-10 my-4 flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">
                {/* Visual Stage Container (G21 Camera Transition feel) */}
                <div
                  className={`w-full rounded-2xl p-6 sm:p-8 border border-amber-400/20 bg-gradient-to-b ${currentScene.visualStage.bgGradient} shadow-xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700`}
                >
                  {/* Floating Props & Ambient Decor */}
                  <div className="absolute top-3 left-4 flex gap-2 text-xl opacity-80">
                    {currentScene.visualStage.ambientDecor.map((d, i) => (
                      <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.3}s` }}>{d}</span>
                    ))}
                  </div>

                  {/* Center Visual Stage Prop Emoji & Character Aura */}
                  <div className="relative my-2">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950/40 border-2 border-amber-300/40 flex items-center justify-center text-5xl sm:text-6xl shadow-[0_0_30px_rgba(251,191,36,0.25)]">
                      {currentScene.visualStage.propEmoji}
                    </div>

                    {/* Character Action Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-indigo-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      {currentScene.visualStage.characterAction}
                    </div>
                  </div>

                  {/* Scene Title & Narration */}
                  <div className="mt-4">
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Adegan {currentScene.sceneNumber} dari {activeStory.scenes.length} • {currentScene.title}
                    </span>
                    <p className="text-sm sm:text-base text-slate-100 font-medium mt-2 leading-relaxed max-w-xl">
                      {currentScene.narration}
                    </p>
                  </div>

                  {/* Dialogue Bubble (Dek Asy / Mbak Syifa / Sahabat) */}
                  {currentScene.dialogue && (
                    <div className="mt-4 p-3 rounded-2xl bg-indigo-950/85 border border-sky-400/40 shadow-md max-w-md w-full flex items-start gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-base shrink-0 shadow">
                        {currentScene.dialogue.role === 'ASY' ? '👦' : currentScene.dialogue.role === 'SYIFA' ? '👧' : '🐿️'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">{currentScene.dialogue.speaker}</span>
                          <span className="text-[9px] text-slate-400 italic">{currentScene.dialogue.action}</span>
                        </div>
                        <p className="text-xs text-slate-100 font-semibold mt-0.5">{currentScene.dialogue.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Moral Hikmah Pill */}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hikmah: {currentScene.moralHikmah}</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM CINEMA CONTROLLER (Play, Pause, Stepper, Progress) */}
              <div className="relative z-10 pt-3 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Scene Indicator Dots */}
                <div className="flex items-center gap-1.5">
                  {activeStory.scenes.map((sc, idx) => (
                    <div
                      key={sc.id}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentSceneIndex
                          ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                          : idx < currentSceneIndex
                          ? 'w-2.5 bg-sky-400'
                          : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-slate-300 font-medium ml-2">
                    {currentSceneIndex + 1} / {activeStory.scenes.length}
                  </span>
                </div>

                {/* Center Playback Steppers */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevScene}
                    disabled={currentSceneIndex === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:hover:bg-slate-800 transition"
                    title="Adegan Sebelumnya"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-indigo-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Jeda Cerita' : 'Mulai Putar Cerita'}</span>
                  </button>

                  <button
                    onClick={handleNextScene}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    title="Adegan Selanjutnya / Selesai"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Outro Trigger Button */}
                <button
                  onClick={() => bioskopLangitEngine.nextScene()}
                  className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold underline underline-offset-4"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Selesaikan & Lihat Penutup (P6)
                </button>
              </div>
            </div>

            {/* LOWER INTERACTION ROW: STAR PROJECTOR (P2) & POPCORN CERIA (P5) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Star Projector Column (P2) */}
              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Proyektor Bintang (P2)
                  </h3>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Transisi G21
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  Lampu proyektor kartun memancarkan berkas cahaya lembut ke langit tanpa file video berat.
                </p>

                <div className="py-2 flex justify-center">
                  <StarProjectorBeam
                    isOn={isProjectorOn}
                    isPlaying={isPlaying}
                    onTogglePower={() => bioskopLangitEngine.toggleProjector()}
                    isEcoMode={isEcoMode}
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs text-slate-400">
                  <span>Status: <strong className={isProjectorOn ? 'text-amber-300' : 'text-slate-400'}>{isProjectorOn ? 'Memancarkan Cahaya' : 'Padam'}</strong></span>
                  <button
                    onClick={() => handleTestSound('PROJECTOR')}
                    className="text-sky-300 hover:text-sky-200 flex items-center gap-1 text-[11px]"
                  >
                    <Volume2 className="w-3 h-3" /> Uji Suara Roda
                  </button>
                </div>
              </div>

              {/* Cloud Seat Quick Selection (P3) */}
              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sky-300 text-sm flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-sky-400" />
                    Kursi Awan Pilihan (P3)
                  </h3>
                  <button
                    onClick={() => setActiveTab('KURSI')}
                    className="text-[11px] text-amber-300 hover:underline"
                  >
                    Ganti Kursi &rarr;
                  </button>
                </div>

                <div className={`p-4 rounded-xl border-2 ${activeSeatInfo.borderGlow} bg-gradient-to-b ${activeSeatInfo.bgGradient} my-2`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeSeatInfo.iconEmoji}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{activeSeatInfo.name}</h4>
                      <p className="text-xs text-slate-300">{activeSeatInfo.fluffiness}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 italic mt-2.5 pt-2 border-t border-indigo-500/20">
                    {activeSeatInfo.asyVoiceLine}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {Object.values(CINEMA_SEATS_CATALOG).map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSeat(s.id)}
                      className={`p-2 rounded-lg text-center border text-xs transition ${
                        activeSeat === s.id
                          ? 'bg-amber-400 text-indigo-950 font-bold border-amber-300'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <span className="block text-base">{s.iconEmoji}</span>
                      <span className="text-[10px] line-clamp-1">{s.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popcorn Ceria Column (P5) */}
              <div>
                <PopcornCeriaWidget
                  popcornCount={popcornCount}
                  onPop={handlePopcorn}
                  isEcoMode={isEcoMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: KATALOG CERITA MALAM (P4)
           ======================================================== */}
        {activeTab === 'KATALOG' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-md text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-500/20">
                <div>
                  <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    Katalog Cerita Malam Terpadu (P4)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Kumpulan kisah adab, sains islami, seni kreatif, dan gotong royong dari ekosistem TADE (TV Asy, Sutradara G22, Kota Mini G23, Rumah Kreatif G24, Hari Besar G25).
                  </p>
                </div>
                <span className="text-xs bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/40 font-bold">
                  {CINEMA_STORIES_CATALOG.length} Judul Tersedia
                </span>
              </div>

              {/* Stories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CINEMA_STORIES_CATALOG.map((story) => {
                  const isSelected = activeStory.id === story.id;
                  return (
                    <div
                      key={story.id}
                      className={`rounded-2xl border-2 p-4 transition-all duration-300 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 border-amber-400 shadow-lg ring-2 ring-amber-400/30'
                          : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-500'
                      }`}
                    >
                      <div>
                        {/* Source Tag & Duration */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500/30">
                            {story.sourceLabel}
                          </span>
                          <span className="text-[10px] text-amber-300 font-semibold">
                            {story.scenes.length} Adegan • {story.totalDurationSec}s
                          </span>
                        </div>

                        {/* Title & Emoji */}
                        <div className="flex items-start gap-3 my-2">
                          <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-amber-400/30 flex items-center justify-center text-2xl shrink-0 shadow">
                            {story.coverEmoji}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white leading-snug">{story.title}</h4>
                            <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{story.subtitle}</p>
                          </div>
                        </div>

                        {/* Moral Tag & Cast */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            ⭐ {story.moralTag}
                          </span>
                          <span className="text-[10px] bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/30">
                            👥 {story.featuredCharacters.join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <button
                        onClick={() => handleSelectStory(story.id)}
                        className={`mt-4 w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                          isSelected
                            ? 'bg-amber-400 hover:bg-amber-300 text-indigo-950 shadow-md'
                            : 'bg-indigo-700 hover:bg-indigo-600 text-white'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        {isSelected ? 'Sedang Diputar di Layar' : 'Putar Cerita Ini'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: PILIHAN KURSI AWAN (P3)
           ======================================================== */}
        {activeTab === 'KURSI' && (
          <div className="space-y-6">
            <CloudSeatSelector
              activeSeat={activeSeat}
              onSelectSeat={handleSelectSeat}
              isEcoMode={isEcoMode}
            />
          </div>
        )}

        {/* ========================================================
            TAB 4: PUSAT COCKPIT FOUNDER (P7)
           ======================================================== */}
        {activeTab === 'COCKPIT' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-md text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-500/20">
                <div>
                  <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    Pusat Bioskop & Cockpit Master Founder (P7)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Kontrol simulasi malam, uji synthesizer Web Audio, pantau Dr. Pulse 60 FPS, dan audit telemetri Black Box Ring-0.
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/40 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  G26_BIOSKOP_LANGIT_VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Simulator Malam & Tirai */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <h4 className="font-bold text-sm text-sky-300 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-sky-400" />
                    Simulasi Waktu & Tirai Langit
                  </h4>
                  <p className="text-xs text-slate-300">
                    Uji tampilan suasana malam dan gerakan tirai awan kartun.
                  </p>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => bioskopLangitEngine.toggleNightMode()}
                      className="w-full py-2 px-3 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-between transition"
                    >
                      <span>Mode Langit ({isNightMode ? 'Malam Bintang' : 'Senja Emas'})</span>
                      <Moon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsCloudCurtainOpen(prev => !prev)}
                      className="w-full py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-between transition"
                    >
                      <span>Tirai Awan ({isCloudCurtainOpen ? 'Terbuka' : 'Tertutup'})</span>
                      <span>☁️</span>
                    </button>

                    <button
                      onClick={() => bioskopLangitEngine.toggleProjector()}
                      className="w-full py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-between transition"
                    >
                      <span>Lampu Proyektor ({isProjectorOn ? 'ON' : 'OFF'})</span>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </div>

                {/* Uji Audio Synthesizer Murni */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    Audisi Synthesizer Web Audio (P2/P5/P6)
                  </h4>
                  <p className="text-xs text-slate-300">
                    100% sintesis gelombang audio murni tanpa ketergantungan file eksternal berlisensi.
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => handleTestSound('POPCORN')}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>🍿 Popcorn Pop</span>
                    </button>
                    <button
                      onClick={() => handleTestSound('PROJECTOR')}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>🎞️ Roda Proyektor</span>
                    </button>
                    <button
                      onClick={() => handleTestSound('STAR_BELL')}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>⭐ Lonceng Bintang</span>
                    </button>
                    <button
                      onClick={() => handleTestSound('TRANSITION')}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>✨ Transisi Scene</span>
                    </button>
                    <button
                      onClick={() => handleTestSound('SEAT')}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>☁️ Kursi Awan</span>
                    </button>
                    <button
                      onClick={() => handleTestSound('OUTRO')}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>🌙 Melodi Penutup</span>
                    </button>
                  </div>
                </div>

                {/* Governor & Eco Mode */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Governor & Efisiensi Performa
                  </h4>
                  <p className="text-xs text-slate-300">
                    Menjaga kelancaran 60 FPS dengan batas maksimal 5 animasi simultan.
                  </p>

                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-700">
                      <span className="text-slate-300">Target Framerate:</span>
                      <strong className="text-emerald-400">60 FPS Stable</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-700">
                      <span className="text-slate-300">Animasi Aktif:</span>
                      <strong className="text-sky-400">&le; 5 Slot (TADE Governor)</strong>
                    </div>
                    <button
                      onClick={() => bioskopLangitEngine.toggleEcoMode()}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between transition ${
                        isEcoMode
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span>Mode Hemat Baterai (Eco Mode):</span>
                      <strong>{isEcoMode ? 'AKTIF' : 'NON-AKTIF'}</strong>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* P6: CELESTIAL OUTRO MODAL (TERIMA KASIH STARRY SIGN & ASY-SYIFA WAVE) */}
      <CelestialOutroModal
        isOpen={isOutroActive}
        onClose={() => bioskopLangitEngine.dismissOutro()}
        onReplay={handleReplayStory}
        isEcoMode={isEcoMode}
      />

      {/* HELP & PANDUAN MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-amber-300 mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Panduan Bioskop Langit Asy & Syifa (G26)
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Bioskop Langit dirancang agar santri dan keluarga dapat menikmati cerita malam yang tenang, mendidik, dan penuh hikmah tanpa beban video berat.
            </p>

            <ul className="text-xs text-slate-200 space-y-2 list-disc list-inside mb-4">
              <li><strong>P1 — Langit Menjadi Layar:</strong> Tirai awan membuka dan bulan tersenyum saat cerita diputar.</li>
              <li><strong>P2 — Proyektor Bintang:</strong> Lampu lembut mengarah ke langit dengan transisi kartun G21.</li>
              <li><strong>P3 — Kursi Awan:</strong> Pilih tempat duduk favorit: Awan Putih, Bintang Kejora, Pelangi, atau Bulan Sabit.</li>
              <li><strong>P4 — Cerita Malam:</strong> Kumpulan kisah terpadu dari TV Asy, Sutradara G22, Kota Mini, Rumah Kreatif, dan Hari Besar.</li>
              <li><strong>P5 — Popcorn Ceria:</strong> Sentuh popcorn kartun untuk letupan suara renyah dan tambahan XP Berkah.</li>
              <li><strong>P6 — Penutup Malam:</strong> Rasi bintang membentuk pesan "Terima Kasih" dan doa tidur bersama Asy & Syifa.</li>
            </ul>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-xs transition"
            >
              Saya Mengerti & Siap Menikmati Cerita
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
