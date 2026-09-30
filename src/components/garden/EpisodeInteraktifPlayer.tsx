import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Sparkles, CheckCircle2, ChevronRight,
  BookOpen, Heart, ArrowLeft, Volume2, VolumeX, X, Star,
  Award, ShieldCheck, Smile, PartyPopper
} from 'lucide-react';
import { 
  InteractiveEpisode, InteractiveChoice, COMPANION_DATA, 
  interactiveEpisodeService, StoryCardRecord 
} from '../../services/interactiveEpisodeService';
import { CartoonCharacterSvg, CharacterType } from '../mascot/CartoonCharacterSvg';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { magicCameraEngine, StoryPhotoMemory } from '../../services/magicCameraEngine';
import { CameraStageWrapper } from '../camera/CameraStageWrapper';
import { StoryMemoryCardModal } from '../camera/StoryMemoryCardModal';

interface EpisodeInteraktifPlayerProps {
  episode?: InteractiveEpisode;
  onClose?: () => void;
  onFinish?: (card: StoryCardRecord) => void;
  onOpenStorybook?: () => void;
}

type Stage = 'INTRO' | 'CHOICE' | 'OUTCOME' | 'FAREWELL';

export const EpisodeInteraktifPlayer: React.FC<EpisodeInteraktifPlayerProps> = ({
  episode: propEpisode,
  onClose,
  onFinish,
  onOpenStorybook
}) => {
  const [episode, setEpisode] = useState<InteractiveEpisode>(() => propEpisode || interactiveEpisodeService.getActiveEpisode());
  const [stage, setStage] = useState<Stage>('INTRO');
  const [selectedChoice, setSelectedChoice] = useState<InteractiveChoice | null>(null);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [savedCard, setSavedCard] = useState<StoryCardRecord | null>(null);
  const [livingObjectWiggle, setLivingObjectWiggle] = useState<boolean>(true);
  const [capturedPhoto, setCapturedPhoto] = useState<StoryPhotoMemory | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  const companion = COMPANION_DATA[episode.featuredCompanion];
  const timerRef = useRef<number | null>(null);

  // Register animation token for Dr. Pulse governor
  useEffect(() => {
    const token = 'EPISODE_INTERAKTIF_ANIM';
    tadeAnimationGovernor.startAnimation(token);
    return () => {
      tadeAnimationGovernor.stopAnimation(token);
    };
  }, []);

  // Update episode if prop changes
  useEffect(() => {
    if (propEpisode) {
      setEpisode(propEpisode);
      handleReset();
    }
  }, [propEpisode]);

  // Stage 1 Intro Timer progression (approx 6-8s before Choice stage)
  useEffect(() => {
    if (stage === 'INTRO') {
      const stepMs = 200;
      const targetIntroSec = 6;
      timerRef.current = window.setInterval(() => {
        setProgressSec(prev => {
          if (prev >= targetIntroSec) {
            clearInterval(timerRef.current!);
            setStage('CHOICE');
            tadeSoundEngine.playFx('POP_WAGON');
            return targetIntroSec;
          }
          return prev + stepMs / 1000;
        });
      }, stepMs);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [stage]);

  // Living object gentle pulse timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLivingObjectWiggle(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectChoice = (choice: InteractiveChoice) => {
    setSelectedChoice(choice);
    setStage('OUTCOME');
    tadeSoundEngine.playFx(choice.outcomeScene.soundFx);

    // Record to service & storybook
    const card = interactiveEpisodeService.recordEpisodeCompleted(episode, choice);
    setSavedCard(card);

    // P5: Auto-capture story photo memory
    const photo = magicCameraEngine.captureStoryPhoto({
      title: episode.title,
      subtitle: `Pilihan: ${choice.label}`,
      sourceModule: 'EPISODE_INTERAKTIF',
      characterRole: choice.outcomeScene.dialogue.role === 'SYIFA' ? 'SYIFA' : choice.outcomeScene.dialogue.role === 'ASY' ? 'ASY' : 'DUO',
      moralLesson: choice.outcomeScene.moralValue,
      duaPhrase: choice.outcomeScene.duaOrHadith,
      badgeEmoji: choice.emoji
    });
    setCapturedPhoto(photo);

    if (onFinish) {
      onFinish(card);
    }
  };

  const handleGoToFarewell = () => {
    setStage('FAREWELL');
    tadeSoundEngine.playFx('CELEBRATION');
  };

  const handleReset = () => {
    setStage('INTRO');
    setSelectedChoice(null);
    setProgressSec(0);
    setSavedCard(null);
    tadeSoundEngine.playFx('TV_CLICK');
  };

  return (
    <div id="episode-interaktif-container" className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border-4 border-amber-300/40 shadow-2xl text-slate-100 transition-all duration-300 font-sans">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                {episode.dayName} • {episode.category === 'EVENT_SPESIAL' ? 'Episode Spesial Acara' : 'Episode Harian Pagi'}
              </span>
              <span className="text-xs text-slate-300">⏱️ {episode.targetDurationSec}s</span>
            </div>
            <h3 className="text-base font-extrabold text-white line-clamp-1">{episode.title}</h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenStorybook && (
            <button
              id="btn-open-storybook-header"
              onClick={onOpenStorybook}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-amber-400/30"
              title="Buka Buku Cerita Asy"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buku Cerita Asy</span>
            </button>
          )}

          <button
            onClick={() => setIsMuted(prev => !prev)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            title={isMuted ? "Aktifkan Suara" : "Bisukan"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 hover:text-rose-300 text-slate-300 transition-colors"
              title="Tutup Pemutar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Story Canvas / Stage */}
      <div className={`relative min-h-[380px] sm:min-h-[420px] p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b ${episode.coverBg} text-slate-900 select-none overflow-hidden`}>
        
        {/* Living Object in Canvas (P4: Benda Cerita hidup & bergerak halus) */}
        <div 
          className={`absolute top-6 right-6 z-10 px-4 py-2 rounded-2xl bg-white/85 backdrop-blur-md shadow-lg border-2 border-white/60 flex items-center space-x-2.5 transition-transform duration-500 ${livingObjectWiggle ? 'scale-105 rotate-2' : 'scale-100 -rotate-1'}`}
        >
          <span className="text-2xl animate-bounce">{episode.livingObject.emoji}</span>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{episode.livingObject.name}</div>
            <div className="text-xs font-semibold text-slate-800 max-w-[180px] truncate">{episode.livingObject.dialogueOrSound}</div>
          </div>
        </div>

        {/* STAGE 1: INTRO */}
        {stage === 'INTRO' && (
          <div className="flex-1 flex flex-col justify-between z-10 animate-fade-in">
            {/* Top Narration Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/80 max-w-xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-100">Cerita Dimulai</span>
                <span>{episode.introScene.title}</span>
              </div>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                {episode.introScene.narration}
              </p>
            </div>

            {/* Character Dialogue & Illustration */}
            <div className="flex items-end justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 transform hover:scale-105 transition-transform">
                  <CartoonCharacterSvg type={episode.introScene.dialogue.role === 'SYIFA' ? 'SYIFA' : 'ASY'} className="w-full h-full drop-shadow-md" />
                </div>
                
                {/* Speech Bubble */}
                <div className="relative bg-white rounded-2xl p-4 shadow-xl border-2 border-amber-300 max-w-xs sm:max-w-md">
                  <div className="text-xs font-bold text-emerald-700 mb-0.5">{episode.introScene.dialogue.speaker} berkata:</div>
                  <div className="text-slate-900 font-bold text-sm sm:text-base leading-snug">
                    {episode.introScene.dialogue.text}
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute -left-2.5 bottom-6 w-3 h-3 bg-white border-l-2 border-b-2 border-amber-300 transform rotate-45" />
                </div>
              </div>

              {/* Companion */}
              <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-white/80 shadow-md">
                <span className="text-3xl">{companion.emoji}</span>
                <span className="text-[11px] font-bold text-slate-700 mt-1">{companion.name}</span>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                <span>Memutar Episode ({Math.round(progressSec)}s)</span>
                <button
                  onClick={() => setStage('CHOICE')}
                  className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold flex items-center space-x-1 transition-all"
                >
                  <span>Langsung Memilih</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(100, (progressSec / 6) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: CHOICE (P2: 2 Pilihan Cerita Sederhana) */}
        {stage === 'CHOICE' && (
          <div className="flex-1 flex flex-col justify-between z-10 animate-scale-up">
            {/* Climax Prompt */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border-2 border-amber-400 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
                <Smile className="w-3.5 h-3.5" />
                <span>Saatnya Anak Ceria Memilih!</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-slate-900">{episode.climaxPrompt.question}</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 italic">
                {episode.climaxPrompt.companionTip}
              </p>
            </div>

            {/* 2 Big Wholesome Choice Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {episode.choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  id={`btn-choice-${idx}`}
                  onClick={() => handleSelectChoice(choice)}
                  className="group relative p-5 rounded-3xl bg-white/90 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl border-3 border-amber-300 hover:border-amber-500 text-left flex items-start space-x-4 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-3xl shadow-inner transition-colors shrink-0">
                    {choice.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-0.5">Pilihan #{idx + 1}</div>
                    <div className="text-base font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                      {choice.label}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {choice.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Friendly reassurance */}
            <div className="text-center text-xs font-bold text-slate-800 bg-white/70 backdrop-blur-sm py-2 px-4 rounded-full max-w-md mx-auto">
              🌟 Semua pilihan berakhir bahagia & penuh kebaikan!
            </div>
          </div>
        )}

        {/* STAGE 3: OUTCOME (Cerita Selesai Berdasarkan Pilihan) */}
        {stage === 'OUTCOME' && selectedChoice && (
          <div className="flex-1 flex flex-col justify-between z-10 animate-fade-in">
            {/* Outcome Narration */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border-2 border-emerald-400 max-w-2xl mx-auto w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pilihanmu: {selectedChoice.label}</span>
                </span>
                <span className="text-2xl">{selectedChoice.emoji}</span>
              </div>

              <h3 className="text-lg font-black text-slate-900">{selectedChoice.outcomeScene.title}</h3>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                {selectedChoice.outcomeScene.narration}
              </p>

              {/* Dialogue in Outcome */}
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-900 shrink-0">
                  {selectedChoice.outcomeScene.dialogue.speaker[0]}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 italic">
                  {selectedChoice.outcomeScene.dialogue.speaker}: {selectedChoice.outcomeScene.dialogue.text}
                </div>
              </div>

              {/* Doa / Moral Lesson */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Hikmah & Doa Hari Ini:</div>
                <div className="text-xs font-bold text-emerald-800 mt-0.5">
                  {selectedChoice.outcomeScene.duaOrHadith}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              <button
                id="btn-goto-farewell"
                onClick={handleGoToFarewell}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Selesai & Sapa Teman-teman</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Pilihan Lain</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: FAREWELL (P7: Penutup Cerita "Sampai Jumpa Besok") */}
        {stage === 'FAREWELL' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center z-10 animate-scale-up py-4">
            
            {/* Big Farewell Mascot Greeting Banner */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 max-w-xl w-full">
              
              {/* Group of Characters waving */}
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-20 h-20 transform hover:-rotate-6 transition-transform">
                  <CartoonCharacterSvg type="ASY" className="w-full h-full" />
                </div>
                <div className="w-20 h-20 transform hover:rotate-6 transition-transform">
                  <CartoonCharacterSvg type="SYIFA" className="w-full h-full" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl animate-bounce">{companion.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600 mt-1">{companion.name}</span>
                </div>
              </div>

              <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Alhamdulillah! Cerita Hari Ini Selesai</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                “Sampai Jumpa Besok, Sahabat Ceria!”
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                Cerita ini sudah tersimpan rapi di <strong className="text-amber-700 font-bold">Buku Cerita Asy</strong>. Besok ada kisah seru yang baru!
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                {capturedPhoto && (
                  <button
                    id="btn-farewell-view-photo"
                    onClick={() => setShowPhotoModal(true)}
                    className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Foto Kenangan (G21)</span>
                  </button>
                )}

                {onOpenStorybook && (
                  <button
                    id="btn-farewell-open-storybook"
                    onClick={onOpenStorybook}
                    className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>Buku Cerita Asy</span>
                  </button>
                )}

                <button
                  id="btn-farewell-close"
                  onClick={onClose}
                  className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Selesai & Tutup</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Story Photo Memory Modal */}
      {showPhotoModal && capturedPhoto && (
        <StoryMemoryCardModal
          photo={capturedPhoto}
          onClose={() => setShowPhotoModal(false)}
          onOpenStorybook={onOpenStorybook}
        />
      )}

      {/* Bottom Footer Info */}
      <div className="px-6 py-3 bg-slate-950 flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sprint G19 • Episode Interaktif Asy & Syifa (60 FPS Verified)</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span>Sahabat: {companion.name} {companion.emoji}</span>
          <span>•</span>
          <span>Benda: {episode.livingObject.name} {episode.livingObject.emoji}</span>
        </div>
      </div>

    </div>
  );
};
