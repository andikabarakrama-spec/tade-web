import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Tv, 
  ChevronLeft, ChevronRight, Users, Award, Star, Heart, CheckCircle2,
  Calendar, Layers, Radio
} from 'lucide-react';
import { 
  tvAsySyifaService, DailyEpisode, StoryScene, ASY_SYIFA_FRIENDS, 
  CharacterProfile, DAILY_EPISODES 
} from '../../services/tvAsySyifaService';
import { CartoonCharacterSvg, CharacterType } from '../mascot/CartoonCharacterSvg';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { magicCameraEngine } from '../../services/magicCameraEngine';

interface TVAsySyifaPlayerProps {
  onStoryFinished?: (episode: DailyEpisode) => void;
  onExploreKereta?: () => void;
}

export const TVAsySyifaPlayer: React.FC<TVAsySyifaPlayerProps> = ({ onStoryFinished, onExploreKereta }) => {
  const [activeEpisode, setActiveEpisode] = useState<DailyEpisode>(() => tvAsySyifaService.getActiveEpisode());
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [showEpisodePicker, setShowEpisodePicker] = useState<boolean>(false);
  const [antennaWiggle, setAntennaWiggle] = useState<boolean>(false);
  
  const timerRef = useRef<number | null>(null);

  const currentScene: StoryScene | undefined = activeEpisode.scenes[currentSceneIdx];

  // Register animation token for Dr. Pulse governor
  useEffect(() => {
    const token = 'TV_ASY_SYIFA_ANIM';
    tadeAnimationGovernor.startAnimation(token);
    return () => {
      tadeAnimationGovernor.stopAnimation(token);
    };
  }, []);

  // Handle scene timing during playback
  useEffect(() => {
    if (!isPlaying || isFinished || !isPowerOn || !currentScene) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Play sound FX for the current scene
    if (currentScene.soundFx && !isMuted) {
      tadeSoundEngine.playFx(currentScene.soundFx);
    }

    timerRef.current = window.setTimeout(() => {
      if (currentSceneIdx < activeEpisode.scenes.length - 1) {
        setCurrentSceneIdx(prev => prev + 1);
      } else {
        // Story completed!
        setIsPlaying(false);
        setIsFinished(true);
        tvAsySyifaService.recordEpisodeWatched(activeEpisode.id);
        
        // P5: Auto-capture story photo memory
        magicCameraEngine.captureStoryPhoto({
          title: activeEpisode.title,
          subtitle: `TV Asy: ${activeEpisode.theme}`,
          sourceModule: 'TV_ASY',
          characterRole: 'DUO',
          moralLesson: activeEpisode.moralLesson,
          duaPhrase: activeEpisode.hadithOrDua,
          badgeEmoji: '📺'
        });

        if (onStoryFinished) {
          onStoryFinished(activeEpisode);
        }
      }
    }, currentScene.durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentSceneIdx, activeEpisode, isFinished, isPowerOn, isMuted, onStoryFinished]);

  const handleStartPlay = () => {
    setIsFinished(false);
    setCurrentSceneIdx(0);
    setIsPlaying(true);
    setAntennaWiggle(true);
    tadeSoundEngine.playFx('TV_CLICK');
    setTimeout(() => setAntennaWiggle(false), 800);
  };

  const handleTogglePlay = () => {
    if (isFinished) {
      handleStartPlay();
      return;
    }
    setIsPlaying(prev => !prev);
    tadeSoundEngine.playFx('TV_CLICK');
  };

  const handleNextScene = () => {
    if (currentSceneIdx < activeEpisode.scenes.length - 1) {
      setCurrentSceneIdx(prev => prev + 1);
      tadeSoundEngine.playFx('TV_CLICK');
    } else {
      setIsPlaying(false);
      setIsFinished(true);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(prev => prev - 1);
      setIsFinished(false);
      tadeSoundEngine.playFx('TV_CLICK');
    }
  };

  const handleSelectEpisode = (ep: DailyEpisode) => {
    tvAsySyifaService.setActiveEpisode(ep.id);
    setActiveEpisode(ep);
    setCurrentSceneIdx(0);
    setIsFinished(false);
    setIsPlaying(true);
    setShowEpisodePicker(false);
  };

  const handleTogglePower = () => {
    setIsPowerOn(prev => !prev);
    setIsPlaying(false);
    tadeSoundEngine.playFx('TV_CLICK');
  };

  const mapCharIdToSvgType = (charId: string): CharacterType => {
    if (charId === 'char_asy') return 'ASY';
    if (charId === 'char_syifa') return 'SYIFA';
    if (charId === 'char_bubu') return 'BUBU';
    if (charId === 'char_gogo') return 'GOGO';
    if (charId === 'char_mimi') return 'MIMI';
    if (charId === 'char_dodo') return 'DODO';
    if (charId === 'char_titi') return 'TITI';
    if (charId === 'char_rara') return 'RARA';
    return 'ASY';
  };

  return (
    <section className="w-full my-6">
      {/* Outer TV Wooden / Emerald Enclosure */}
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 p-4 sm:p-7 rounded-[40px] shadow-2xl border-4 border-amber-300 relative">
        
        {/* Antennas at the top */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-end justify-center pointer-events-none z-10">
          <div className={`w-1 h-14 bg-gradient-to-t from-slate-400 to-amber-300 rounded-full origin-bottom transform -rotate-25 shadow ${antennaWiggle ? 'animate-pulse' : ''}`} />
          <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-md -mx-2 z-10" />
          <div className={`w-1 h-16 bg-gradient-to-t from-slate-400 to-amber-300 rounded-full origin-bottom transform rotate-25 shadow ${antennaWiggle ? 'animate-pulse' : ''}`} />
        </div>

        {/* TV Top Nameplate */}
        <div className="flex items-center justify-between px-3 pb-3 text-white">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-amber-200 drop-shadow">
              📺 TV Asy Syifa • Serial Harian
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-amber-300 border border-emerald-400/50">
              Edisi {activeEpisode.dayName}
            </span>
          </div>
        </div>

        {/* Main TV Frame Inner Layout: Screen (Left) + Physical Controls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* TV Screen Container (9 cols on large screen) */}
          <div className="lg:col-span-9 bg-slate-950 rounded-[32px] p-3 sm:p-4 border-4 border-amber-200/90 shadow-inner relative overflow-hidden flex flex-col justify-between min-h-[340px] sm:min-h-[400px]">
            
            {/* Screen Glass Glare Arc */}
            <div className="absolute top-0 right-0 w-64 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            {!isPowerOn ? (
              /* TV OFF Screen */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-500 text-3xl">
                  <span>💤</span>
                </div>
                <h4 className="text-slate-400 font-bold text-sm">TV Asy Syifa dalam mode Siaga</h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  Tekan tombol daya merah di panel samping untuk menyalakan serial kartun harian!
                </p>
                <button
                  onClick={handleTogglePower}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg transition"
                >
                  Nyalakan TV (Power On)
                </button>
              </div>
            ) : isFinished ? (
              /* Story Finished Celebration Screen */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 bg-gradient-to-b from-teal-950 via-emerald-950 to-slate-950 rounded-2xl animate-fadeIn">
                <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-lg animate-bounce">
                  <span>🌟</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-400 text-slate-950">
                    Alhamdulillah Tamat!
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {activeEpisode.title}
                  </h3>
                </div>

                {/* Moral Value Card */}
                <div className="p-3.5 max-w-md bg-emerald-900/60 rounded-2xl border border-emerald-400/60 text-emerald-100 text-xs font-semibold leading-relaxed space-y-1">
                  <span className="text-[10px] text-amber-300 font-extrabold uppercase flex items-center justify-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    Pesan Kebaikan Hari Ini:
                  </span>
                  <p>{activeEpisode.moralValue}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button
                    onClick={handleStartPlay}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Tonton Ulang
                  </button>

                  <button
                    onClick={() => setShowEpisodePicker(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-black text-xs shadow-md transition"
                  >
                    <Calendar className="w-4 h-4" />
                    Pilih Hari Lain
                  </button>

                  {onExploreKereta && (
                    <button
                      onClick={onExploreKereta}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      Buka Kereta Cerita
                    </button>
                  )}
                </div>
              </div>
            ) : !isPlaying && currentSceneIdx === 0 ? (
              /* TV Standby / Welcome Screen */
              <div className={`flex-1 flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-b ${activeEpisode.coverColor} text-white space-y-4`}>
                <div className="flex items-center justify-center gap-3">
                  <CartoonCharacterSvg type="ASY" size={70} expression="HAPPY" />
                  <div className="text-3xl animate-bounce">🎬</div>
                  <CartoonCharacterSvg type="SYIFA" size={70} expression="HAPPY" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-400 text-slate-950">
                    Serial Kartun Harian ({activeEpisode.dayName})
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow">
                    "{activeEpisode.title}"
                  </h3>
                  <p className="text-xs text-amber-100 max-w-sm font-medium">
                    {activeEpisode.subtitle}
                  </p>
                </div>

                <button
                  onClick={handleStartPlay}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all transform border-2 border-white cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  Putar Cerita Sekarang ({activeEpisode.totalDurationSec}s)
                </button>
              </div>
            ) : currentScene ? (
              /* Active Storyboard Playback Scene */
              <div className={`flex-1 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${currentScene.bgGradient} relative overflow-hidden transition-all duration-700`}>
                
                {/* Scene Header & Progress Bar */}
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between text-slate-900 text-xs font-black">
                    <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-sm border border-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Adegan {currentScene.sceneNumber} dari {activeEpisode.scenes.length}: {currentScene.title}
                    </span>
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-extrabold">
                      {activeEpisode.dayName}
                    </span>
                  </div>

                  {/* Scene Step Progress Indicators */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {activeEpisode.scenes.map((sc, i) => (
                      <div
                        key={sc.sceneNumber}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          i < currentSceneIdx
                            ? 'bg-emerald-600'
                            : i === currentSceneIdx
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-slate-300/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Animated Character Stage & Prop */}
                <div className="my-auto py-3 flex items-center justify-center gap-3 sm:gap-6 relative z-10">
                  {currentScene.activeCharacterIds.map(charId => (
                    <div key={charId} className="flex flex-col items-center transition-transform duration-500 hover:scale-110">
                      <CartoonCharacterSvg
                        type={mapCharIdToSvgType(charId)}
                        size={85}
                        expression="HAPPY"
                        className="filter drop-shadow-md"
                      />
                    </div>
                  ))}
                  {currentScene.propEmoji && (
                    <div className="text-4xl sm:text-5xl animate-bounce filter drop-shadow">
                      {currentScene.propEmoji}
                    </div>
                  )}
                </div>

                {/* Dialogue Balloon & Narration Subtitle */}
                <div className="space-y-2 relative z-10">
                  {currentScene.dialogue && (
                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border-2 border-amber-400 shadow-lg text-slate-900 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-800 uppercase">
                        <Users className="w-3 h-3 text-emerald-600" />
                        <span>{currentScene.dialogue.speaker}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        "{currentScene.dialogue.text}"
                      </p>
                    </div>
                  )}

                  {/* Narration Bar */}
                  <div className="bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl text-amber-200 text-[11px] font-semibold text-center leading-tight">
                    {currentScene.narration}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Bottom Playback Mini Bar */}
            {isPowerOn && (
              <div className="flex items-center justify-between pt-2 px-1 text-slate-300 text-xs border-t border-slate-800 mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
                    title={isPlaying ? 'Jeda Cerita' : 'Lanjutkan Cerita'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handlePrevScene}
                    disabled={currentSceneIdx === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition"
                    title="Adegan Sebelumnya"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextScene}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
                    title="Adegan Selanjutnya"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{activeEpisode.title}</span>
                  <button
                    onClick={() => setIsMuted(prev => !prev)}
                    className="p-1 rounded-md text-slate-400 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Physical TV Panel Controls (3 cols on lg) */}
          <div className="lg:col-span-3 bg-amber-950/80 rounded-[28px] p-3.5 sm:p-4 border-2 border-amber-400/60 flex flex-col justify-between space-y-4 text-white">
            
            {/* Physical Tuning Knob & Dials */}
            <div className="space-y-3">
              <div className="text-center border-b border-amber-800/80 pb-2">
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                  Panel Tombol TV
                </span>
              </div>

              {/* Power Button (Red) */}
              <button
                onClick={handleTogglePower}
                className={`w-full py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border-2 ${
                  isPowerOn 
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-red-900/50' 
                    : 'bg-slate-800 text-slate-400 border-slate-600'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${isPowerOn ? 'bg-emerald-300 animate-ping' : 'bg-red-500'}`} />
                <span>{isPowerOn ? 'POWER (ON)' : 'POWER (STANDBY)'}</span>
              </button>

              {/* Day Episode Selector (Yellow Channel Dial) */}
              <button
                onClick={() => setShowEpisodePicker(true)}
                className="w-full py-2 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-between shadow-md transition border-2 border-white cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-950" />
                  <span>Jadwal Harian</span>
                </div>
                <span className="text-[10px] bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-extrabold">
                  {activeEpisode.dayName}
                </span>
              </button>

              {/* Cast & Friends Roster Button (Blue) */}
              <button
                onClick={() => setShowRosterModal(true)}
                className="w-full py-2 px-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-between shadow-md transition border-2 border-sky-300 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Sahabat Asy (6)</span>
                </div>
                <span className="text-[10px] bg-white text-sky-900 px-1.5 py-0.5 rounded font-extrabold">
                  Profil
                </span>
              </button>
            </div>

            {/* Retro Speaker Grille */}
            <div className="space-y-1.5 py-2 px-2 bg-amber-900/60 rounded-2xl border border-amber-800">
              <div className="h-1 bg-amber-950 rounded-full" />
              <div className="h-1 bg-amber-950 rounded-full" />
              <div className="h-1 bg-amber-950 rounded-full" />
              <div className="h-1 bg-amber-950 rounded-full" />
              <div className="h-1 bg-amber-950 rounded-full" />
            </div>

            {/* Quick Status Tag */}
            <div className="text-[10px] text-amber-200/80 text-center font-semibold">
              TK Asy Syifa Tanggul • 60 FPS Engine
            </div>
          </div>
        </div>
      </div>

      {/* Episode Picker Modal */}
      {showEpisodePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 border-4 border-amber-400 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Pilih Episode Serial Harian
                </h3>
              </div>
              <button
                onClick={() => setShowEpisodePicker(false)}
                className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {DAILY_EPISODES.map(ep => {
                const isActive = ep.id === activeEpisode.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => handleSelectEpisode(ep)}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${ep.coverColor} flex items-center justify-center text-white font-black text-xs shadow shrink-0`}>
                      {ep.dayName}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {ep.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {ep.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          ⏱️ {ep.totalDurationSec}s
                        </span>
                        <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold truncate">
                          {ep.theme}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowEpisodePicker(false)}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Official Friends (Sahabat Tetap Asy & Syifa) Roster Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-3xl p-6 border-4 border-amber-400 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Teman Tetap Resmi Asy & Syifa
                  </h3>
                  <p className="text-xs text-stone-500">Karakter resmi TK Asy Syifa yang selalu hadir bergantian</p>
                </div>
              </div>
              <button
                onClick={() => setShowRosterModal(false)}
                className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ASY_SYIFA_FRIENDS.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border flex items-center justify-center p-1 shadow-sm shrink-0">
                    <CartoonCharacterSvg type={friend.iconType} size={54} expression="HAPPY" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {friend.name}
                      </h4>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {friend.trait}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {friend.nickname}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug line-clamp-2">
                      {friend.bio}
                    </p>
                    <p className="text-[9px] text-stone-400 italic">
                      Favorit: {friend.favoriteFoodOrColor}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRosterModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-black text-xs shadow-md"
            >
              Tutup Daftar Sahabat
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
