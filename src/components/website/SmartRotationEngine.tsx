import React, { useEffect, useState } from 'react';
import { SmartQuote } from '../../types';
import { DataService } from '../../services/db';
import { Quote, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export const SmartRotationEngine: React.FC = () => {
  const [quotes, setQuotes] = useState<SmartQuote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    DataService.getSmartQuotes().then(setQuotes);
  }, []);

  useEffect(() => {
    if (!isPlaying || quotes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6000); // 6 seconds auto rotation
    return () => clearInterval(interval);
  }, [isPlaying, quotes]);

  if (quotes.length === 0) return null;

  const current = quotes[currentIndex];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % quotes.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);

  return (
    <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden my-6">
      <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-emerald-800" />
          <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
            Mutis Mutiara & Inspirasi Islami PAUD • Smart Rotation Engine
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 bg-white border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer text-xs"
            title={isPlaying ? 'Jeda Rotasi Otomatis' : 'Mulai Rotasi'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1.5 bg-white border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 bg-white border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="min-h-[90px] flex flex-col justify-center space-y-2">
        <span className="text-[10px] font-black uppercase bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full w-fit">
          {current.category}
        </span>
        <blockquote className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed italic">
          "{current.text}"
        </blockquote>
        <p className="text-xs font-bold text-emerald-800 text-right">— {current.source}</p>
      </div>

      {/* Pagination indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-3">
        {quotes.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === currentIndex ? 'w-6 bg-emerald-700' : 'w-2 bg-emerald-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
