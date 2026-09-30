import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronLeft, ChevronRight, X, Sparkles, 
  Calendar, Award, Star, Heart, RotateCcw, Play,
  CheckCircle2, Share2, Filter, BookmarkCheck
} from 'lucide-react';
import { 
  interactiveEpisodeService, StoryCardRecord, 
  InteractiveEpisode, DAILY_INTERACTIVE_EPISODES 
} from '../../services/interactiveEpisodeService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface BukuCeritaAsyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayEpisode?: (episode: InteractiveEpisode) => void;
}

export const BukuCeritaAsyModal: React.FC<BukuCeritaAsyModalProps> = ({
  isOpen,
  onClose,
  onReplayEpisode
}) => {
  const [cards, setCards] = useState<StoryCardRecord[]>(() => interactiveEpisodeService.getStoryCards());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RECENT'>('ALL');

  useEffect(() => {
    const unsub = interactiveEpisodeService.subscribe(() => {
      setCards(interactiveEpisodeService.getStoryCards());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const currentCard: StoryCardRecord | undefined = cards[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      tadeSoundEngine.playFx('TV_CLICK');
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      tadeSoundEngine.playFx('TV_CLICK');
    }
  };

  const handleReplayCurrent = () => {
    if (!currentCard || !onReplayEpisode) return;
    const episodes = interactiveEpisodeService.getAvailableEpisodes();
    const ep = episodes.find(e => e.id === currentCard.episodeId) || DAILY_INTERACTIVE_EPISODES[0];
    onReplayEpisode(ep);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl bg-slate-900 border-4 border-amber-400/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
              📖
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-900/40 px-2.5 py-0.5 rounded-full border border-amber-300/40 text-amber-200">
                  Sprint G19 • P5 Album
                </span>
                <span className="text-xs text-amber-100 font-bold">{cards.length} Cerita Tersimpan</span>
              </div>
              <h2 className="text-lg font-black text-white">Buku Cerita Asy & Syifa</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Tutup Buku Cerita"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-900 text-slate-100 flex flex-col justify-between">
          {cards.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📚</div>
              <h3 className="text-lg font-bold text-slate-200">Belum Ada Cerita Tersimpan</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Mainkan Episode Interaktif harian untuk membuka lembaran kartu cerita barumu!
              </p>
            </div>
          ) : currentCard ? (
            <div className="flex flex-col items-center">
              
              {/* Picture Book Frame */}
              <div className="relative w-full max-w-xl bg-gradient-to-br from-amber-50 to-orange-50 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300">
                
                {/* Top Badge & Date */}
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-3 border-b border-amber-200 pb-2">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentCard.timestamp}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-[11px] font-black">
                    Kartu {currentIndex + 1} dari {cards.length}
                  </span>
                </div>

                {/* Title & Emojis */}
                <div className="text-center my-3">
                  <div className="text-4xl mb-2 flex items-center justify-center space-x-2">
                    <span>{currentCard.chosenOptionEmoji}</span>
                    <span className="text-2xl">✨</span>
                    <span>{currentCard.companionEmoji}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">{currentCard.title}</h3>
                  <div className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
                    Pilihan: {currentCard.chosenOptionLabel}
                  </div>
                </div>

                {/* Moral Value & Doa */}
                <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-amber-200 shadow-sm space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nilai Kebaikan & Akhlak:</span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">{currentCard.moralValue}</p>
                  </div>
                  <div className="pt-2 border-t border-amber-100">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Doa / Hadits:</span>
                    <p className="text-xs font-bold text-emerald-900 italic mt-0.5">{currentCard.duaOrHadith}</p>
                  </div>
                </div>

                {/* Companions & Objects */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-700 bg-amber-100/60 px-3 py-2 rounded-xl">
                  <span className="font-semibold">Teman: {currentCard.companionName} {currentCard.companionEmoji}</span>
                  <span className="font-semibold">Benda: {currentCard.livingObjectName} {currentCard.livingObjectEmoji}</span>
                </div>

              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between w-full max-w-xl mt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                    currentIndex === 0 
                      ? 'bg-white/5 text-slate-600 cursor-not-allowed' 
                      : 'bg-white/10 hover:bg-white/20 text-white shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Lembar Sebelumnya</span>
                </button>

                {onReplayEpisode && (
                  <button
                    onClick={handleReplayCurrent}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-md"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Putar Ulang Episode</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={currentIndex === cards.length - 1}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                    currentIndex === cards.length - 1
                      ? 'bg-white/5 text-slate-600 cursor-not-allowed' 
                      : 'bg-white/10 hover:bg-white/20 text-white shadow-md'
                  }`}
                >
                  <span>Lembar Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 text-slate-400 text-xs flex items-center justify-between border-t border-white/5">
          <span>Semua cerita tersimpan aman di profil anak • Tanpa batas waktu</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
