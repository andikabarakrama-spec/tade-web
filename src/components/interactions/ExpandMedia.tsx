import React, { useState } from 'react';
import { Maximize2, X, Sparkles, ChevronRight, ChevronLeft, Volume2, Share2, BookOpen } from 'lucide-react';

export interface StoryStep {
  title: string;
  description: string;
  date?: string;
  tag?: string;
}

interface ExpandMediaProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  storySteps?: StoryStep[];
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  className?: string;
  children?: React.ReactNode;
}

export const ExpandMedia: React.FC<ExpandMediaProps> = ({
  src,
  alt,
  title,
  subtitle,
  description,
  category,
  storySteps = [],
  aspectRatio = 'auto',
  className = '',
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'w-full h-full'
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
    setActiveStep(0);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Thumbnail Trigger Canvas */}
      <div
        onClick={handleOpen}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl ${className}`}
      >
        {children ? (
          children
        ) : (
          <div className={`relative overflow-hidden bg-stone-200 ${aspectClasses[aspectRatio]}`}>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            {category && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-full backdrop-blur-xs border border-amber-400/30">
                {category}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="text-white space-y-1">
                <p className="font-extrabold text-sm line-clamp-1">{title || alt}</p>
                {subtitle && <p className="text-xs text-amber-300 font-medium line-clamp-1">{subtitle}</p>}
              </div>
              <div className="ml-auto p-2 bg-emerald-600 text-white rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Fullscreen Modal / Interactive Stage */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[120] bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[92vh] animate-in zoom-in-95 duration-300"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-30 p-2.5 bg-slate-950/80 hover:bg-red-600 text-stone-200 hover:text-white rounded-2xl backdrop-blur-md transition cursor-pointer border border-stone-700 shadow-lg"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Canvas Area */}
            <div className="relative flex-1 bg-slate-950 flex items-center justify-center min-h-[280px] lg:min-h-[500px]">
              <img
                src={src}
                alt={alt}
                className="w-full h-full max-h-[75vh] object-contain p-2 rounded-2xl"
              />
              {category && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-800/90 text-emerald-200 text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur-md border border-emerald-500/40">
                  {category}
                </div>
              )}
            </div>

            {/* Story & Context Sidebar */}
            <div className="w-full lg:w-96 p-5 sm:p-6 bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-800 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/20">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Interactive Story Expand
                  </span>
                  <h3 className="text-xl font-black text-white leading-tight">
                    {title || alt}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-amber-300 font-extrabold">{subtitle}</p>
                  )}
                </div>

                {description && (
                  <p className="text-xs text-stone-300 leading-relaxed font-normal">
                    {description}
                  </p>
                )}

                {/* Story Sequence Steps */}
                {storySteps.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-stone-800">
                    <div className="flex items-center justify-between text-xs font-extrabold text-stone-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <BookOpen className="w-3.5 h-3.5" /> Alur Cerita
                      </span>
                      <span>{activeStep + 1} dari {storySteps.length}</span>
                    </div>

                    <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300">
                          {storySteps[activeStep].title}
                        </span>
                        {storySteps[activeStep].date && (
                          <span className="text-[10px] text-stone-400">
                            {storySteps[activeStep].date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-200">
                        {storySteps[activeStep].description}
                      </p>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(prev => prev - 1)}
                        className="px-3 py-1.5 bg-stone-800 disabled:opacity-40 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl flex items-center gap-1 transition cursor-pointer border border-stone-700"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Sblm
                      </button>

                      <div className="flex gap-1">
                        {storySteps.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveStep(idx)}
                            className={`w-2 h-2 rounded-full transition ${
                              idx === activeStep ? 'bg-amber-400 w-5' : 'bg-stone-600'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        disabled={activeStep === storySteps.length - 1}
                        onClick={() => setActiveStep(prev => prev + 1)}
                        className="px-3 py-1.5 bg-emerald-800 disabled:opacity-40 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition cursor-pointer border border-emerald-600"
                      >
                        Lanjut <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between gap-2">
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-2xl transition cursor-pointer shadow-md text-center"
                >
                  Tutup Tampilan Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
