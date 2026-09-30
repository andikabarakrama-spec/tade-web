import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, BookOpen, Clock, Tag } from 'lucide-react';

export interface StoryCardItem {
  id: string;
  title: string;
  category?: string;
  date?: string;
  summary: string;
  content: string;
  image: string;
  tags?: string[];
}

interface StoryStackProps {
  stories: StoryCardItem[];
  className?: string;
  onReadMore?: (story: StoryCardItem) => void;
}

export const StoryStack: React.FC<StoryStackProps> = ({
  stories,
  className = '',
  onReadMore
}) => {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  if (!stories || stories.length === 0) return null;

  const current = stories[activeStoryIdx];

  return (
    <div className={`p-6 bg-gradient-to-br from-stone-900 via-slate-900 to-emerald-950 text-white rounded-3xl border border-stone-700 shadow-2xl space-y-6 ${className}`}>
      {/* Header & Counter */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Rangkaian Cerita & Kabar TK Asy Syifa</h3>
            <p className="text-xs text-amber-300 font-semibold">Alur Dokumentasi & Wawasan Berharga</p>
          </div>
        </div>

        <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-stone-300 border border-stone-700">
          {activeStoryIdx + 1} / {stories.length}
        </div>
      </div>

      {/* Main Active Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Story Image Canvas */}
        <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner group">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {current.category && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-emerald-800/90 text-white text-[10px] font-black uppercase tracking-wider rounded-full backdrop-blur-md border border-emerald-400/30">
              {current.category}
            </span>
          )}
        </div>

        {/* Story Content Sequential Reveal */}
        <div className="space-y-4">
          <div className="space-y-2">
            {current.date && (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                <Clock className="w-3.5 h-3.5" /> {current.date}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {current.title}
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed font-normal">
              {current.summary}
            </p>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed bg-slate-950/40 p-3.5 rounded-2xl border border-emerald-500/20">
            {current.content}
          </p>

          {current.tags && current.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {current.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-[10px] font-extrabold text-stone-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-stone-700">
                  <Tag className="w-2.5 h-2.5 text-emerald-400" /> {tag}
                </span>
              ))}
            </div>
          )}

          {onReadMore && (
            <button
              onClick={() => onReadMore(current)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Baca Selengkapnya
            </button>
          )}
        </div>
      </div>

      {/* Story Stack Footer Controls */}
      <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
        <button
          disabled={activeStoryIdx === 0}
          onClick={() => setActiveStoryIdx(prev => prev - 1)}
          className="px-4 py-2 bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer border border-stone-700"
        >
          <ChevronLeft className="w-4 h-4" /> Cerita Sebelumnya
        </button>

        <div className="flex items-center gap-1.5">
          {stories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStoryIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeStoryIdx ? 'w-6 bg-amber-400' : 'w-2 bg-stone-700'
              }`}
            />
          ))}
        </div>

        <button
          disabled={activeStoryIdx === stories.length - 1}
          onClick={() => setActiveStoryIdx(prev => prev + 1)}
          className="px-4 py-2 bg-emerald-800 disabled:opacity-40 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer border border-emerald-600"
        >
          Cerita Selanjutnya <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
