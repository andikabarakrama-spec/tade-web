import React, { useState, useEffect } from 'react';
import { 
  Tv, Sparkles, BookOpen, Play, Calendar, Star, Heart,
  ShieldCheck, Award, ChevronRight, RotateCcw, Clock,
  Smile, PartyPopper, Users, Layers, Activity
} from 'lucide-react';
import { 
  interactiveEpisodeService, InteractiveEpisode, StoryCardRecord,
  DAILY_INTERACTIVE_EPISODES, SPECIAL_EVENT_EPISODES, COMPANION_DATA 
} from '../../services/interactiveEpisodeService';
import { livingEventEngine, SchoolEventType } from '../../services/livingEventEngine';
import { EpisodeInteraktifPlayer } from './EpisodeInteraktifPlayer';
import { BukuCeritaAsyModal } from './BukuCeritaAsyModal';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

export const EpisodeInteraktifHub: React.FC = () => {
  const [activeEpisode, setActiveEpisode] = useState<InteractiveEpisode>(() => interactiveEpisodeService.getActiveEpisode());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isStorybookOpen, setIsStorybookOpen] = useState<boolean>(false);
  const [cardsCount, setCardsCount] = useState<number>(() => interactiveEpisodeService.getStoryCards().length);
  const [selectedEventFilter, setSelectedEventFilter] = useState<SchoolEventType | 'DEFAULT'>('DEFAULT');

  useEffect(() => {
    const unsub = interactiveEpisodeService.subscribe(() => {
      setActiveEpisode(interactiveEpisodeService.getActiveEpisode());
      setCardsCount(interactiveEpisodeService.getStoryCards().length);
    });
    return unsub;
  }, []);

  const handleLaunchEpisode = (ep?: InteractiveEpisode) => {
    if (ep) {
      setActiveEpisode(ep);
    }
    setIsPlaying(true);
    tadeSoundEngine.playFx('TV_CLICK');
  };

  const handleSelectEventOverride = (eventType: SchoolEventType | 'DEFAULT') => {
    setSelectedEventFilter(eventType);
    if (eventType === 'DEFAULT') {
      interactiveEpisodeService.setEventOverride(null);
    } else {
      interactiveEpisodeService.setEventOverride(eventType);
    }
    setActiveEpisode(interactiveEpisodeService.getActiveEpisode());
    tadeSoundEngine.playFx('POP_WAGON');
  };

  const companion = COMPANION_DATA[activeEpisode.featuredCompanion];

  return (
    <div id="episode-interaktif-hub" className="space-y-8 animate-fade-in font-sans text-slate-100">
      
      {/* Top Banner Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 border-4 border-amber-300/40 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-black uppercase tracking-widest border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>Sprint G19 • Episode Interaktif Asy & Syifa</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Satu Hari, Satu Cerita Penuh Makna
            </h1>
            <p className="text-sm text-amber-100 leading-relaxed font-medium">
              Cerita pendek 15–30 detik setiap pagi. Anak diajak berpartisipasi memilih kelanjutan kisah.
              Semua pilihan berakhir dengan kebaikan, doa, dan senyuman hangat!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              id="btn-main-play-today"
              onClick={() => handleLaunchEpisode(activeEpisode)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-900 font-extrabold text-sm shadow-xl shadow-black/20 flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current text-amber-600" />
              <span>Putar Episode Hari Ini</span>
            </button>

            <button
              id="btn-hub-open-storybook"
              onClick={() => setIsStorybookOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-900/40 hover:bg-amber-900/60 text-amber-100 font-bold text-sm border border-amber-300/40 flex items-center justify-center space-x-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Buku Cerita Asy ({cardsCount})</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none text-9xl">
          📖
        </div>
      </div>

      {/* Main Active Episode Card (P1 & P2 Showcase) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Featured Today Episode (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900 border-2 border-amber-400/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
                  {activeEpisode.dayName}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Durasi: {activeEpisode.targetDurationSec} detik</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pilihan Bebas & Aman</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">{activeEpisode.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{activeEpisode.subtitle}</p>

            {/* Quick Scene Synopsis */}
            <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{activeEpisode.introScene.propEmoji}</span>
                <div className="text-xs text-slate-200">
                  <span className="font-bold text-amber-300">Pengantar: </span>
                  {activeEpisode.introScene.narration}
                </div>
              </div>

              {/* 2 Choice Previews */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeEpisode.choices.map((c, i) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center space-x-2">
                    <span className="text-lg">{c.emoji}</span>
                    <div className="text-xs">
                      <div className="font-bold text-slate-200">{c.label}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{c.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span>Sahabat: <strong className="text-white">{companion.name} {companion.emoji}</strong></span>
              <span>•</span>
              <span>Benda Hidup: <strong className="text-white">{activeEpisode.livingObject.name} {activeEpisode.livingObject.emoji}</strong></span>
            </div>

            <button
              onClick={() => handleLaunchEpisode(activeEpisode)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Buka Pemutar Interaktif</span>
            </button>
          </div>
        </div>

        {/* Right Column: P6 Special Event Simulator & Storybook Stats */}
        <div className="space-y-6">
          
          {/* P6 School Event Integration Selector */}
          <div className="rounded-3xl bg-slate-900 border-2 border-white/10 p-5 shadow-xl">
            <div className="flex items-center space-x-2 mb-3 text-xs font-bold text-amber-400">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>P6 • Simulator Acara Sekolah</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Uji bagaimana episode interaktif otomatis beradaptasi saat ada agenda khusus sekolah:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelectEventOverride('DEFAULT')}
                className={`p-2 rounded-xl text-left text-xs font-bold transition-colors ${selectedEventFilter === 'DEFAULT' ? 'bg-amber-500 text-slate-900' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                ☀️ Hari Reguler
              </button>
              <button
                onClick={() => handleSelectEventOverride('MILAD_TK')}
                className={`p-2 rounded-xl text-left text-xs font-bold transition-colors ${selectedEventFilter === 'MILAD_TK' ? 'bg-amber-500 text-slate-900' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                🎂 Milad TK
              </button>
              <button
                onClick={() => handleSelectEventOverride('WISUDA')}
                className={`p-2 rounded-xl text-left text-xs font-bold transition-colors ${selectedEventFilter === 'WISUDA' ? 'bg-amber-500 text-slate-900' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                🎓 Wisuda Santri
              </button>
              <button
                onClick={() => handleSelectEventOverride('RAMADHAN')}
                className={`p-2 rounded-xl text-left text-xs font-bold transition-colors ${selectedEventFilter === 'RAMADHAN' ? 'bg-amber-500 text-slate-900' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                🌙 Ramadhan
              </button>
              <button
                onClick={() => handleSelectEventOverride('KEMERDEKAAN')}
                className={`p-2 rounded-xl text-left text-xs font-bold transition-colors ${selectedEventFilter === 'KEMERDEKAAN' ? 'bg-amber-500 text-slate-900' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                🇮🇩 17 Agustus
              </button>
              <button
                onClick={() => handleSelectEventOverride('PPDB')}
                className={`p-2 rounded-xl text-left text-xs font-bold transition-colors ${selectedEventFilter === 'PPDB' ? 'bg-amber-500 text-slate-900' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
              >
                🌟 PPDB Emas
              </button>
            </div>
          </div>

          {/* Storybook Quick Card */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-2 border-amber-400/30 p-5 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-extrabold text-amber-300 uppercase">P5 • Buku Cerita Asy</div>
              <div className="text-2xl font-black text-white">{cardsCount} Kartu Cerita</div>
              <div className="text-[11px] text-slate-300">Tersimpan dalam album digital anak</div>
            </div>

            <button
              onClick={() => setIsStorybookOpen(true)}
              className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 transition-all shadow-md font-bold"
              title="Buka Buku Cerita"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

      {/* Full Weekly Episode Library Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">Koleksi Serial Episode Harian & Spesial</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Pilih salah satu episode untuk memutar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {DAILY_INTERACTIVE_EPISODES.map(ep => {
            const comp = COMPANION_DATA[ep.featuredCompanion];
            const isCurrent = ep.id === activeEpisode.id;
            return (
              <div
                key={ep.id}
                onClick={() => handleLaunchEpisode(ep)}
                className={`group rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isCurrent 
                    ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900/90 hover:bg-slate-900 border-white/10 hover:border-amber-400/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10">{ep.dayName}</span>
                    <span>{comp.emoji}</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {ep.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {ep.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{ep.targetDurationSec} detik</span>
                  <span className="text-amber-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Mainkan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Player when active */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <EpisodeInteraktifPlayer
              episode={activeEpisode}
              onClose={() => setIsPlaying(false)}
              onOpenStorybook={() => {
                setIsPlaying(false);
                setIsStorybookOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Storybook Modal */}
      <BukuCeritaAsyModal
        isOpen={isStorybookOpen}
        onClose={() => setIsStorybookOpen(false)}
        onReplayEpisode={(ep) => {
          setIsStorybookOpen(false);
          handleLaunchEpisode(ep);
        }}
      />

    </div>
  );
};
