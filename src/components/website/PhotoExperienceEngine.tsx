import React, { useState } from 'react';
import { Sparkles, Maximize2 } from 'lucide-react';

interface PhotoExperienceEngineProps {
  src: string;
  alt: string;
  caption?: string;
  category?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  paperFrameStyle?: 'tape' | 'polaroid' | 'scrapbook' | 'simple';
}

export const PhotoExperienceEngine: React.FC<PhotoExperienceEngineProps> = ({
  src,
  alt,
  caption,
  category,
  className = '',
  aspectRatio = 'auto',
  paperFrameStyle = 'tape'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'h-full w-full'
  };

  return (
    <>
      <div
        className={`relative group bg-amber-50/50 p-2 sm:p-2.5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition duration-300 ${className}`}
      >
        {/* Scrapbook Tape Accent */}
        {paperFrameStyle === 'tape' && (
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/80 rounded-xs rotate-[-2deg] border border-amber-300/60 z-10 shadow-xs pointer-events-none" />
        )}

        {paperFrameStyle === 'polaroid' && (
          <div className="absolute -top-3 left-4 w-12 h-6 bg-pink-200/70 rounded-xs rotate-[3deg] border border-pink-300/60 z-10 shadow-xs pointer-events-none" />
        )}

        {/* Photo Canvas Container */}
        <div className={`relative overflow-hidden rounded-xl bg-stone-200 ${aspectClasses[aspectRatio]}`}>
          {/* Blur Placeholder loader */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-stone-300 animate-pulse flex items-center justify-center text-stone-400 text-xs font-bold">
              <Sparkles className="w-4 h-4 animate-spin mr-1" /> Memuat Foto Ceria...
            </div>
          )}

          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
          />

          {/* Category Badge */}
          {category && (
            <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-300 px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
              {category}
            </span>
          )}

          {/* Zoom Overlay Trigger */}
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="absolute bottom-2 right-2 p-2 bg-white/90 text-slate-900 rounded-xl opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white cursor-pointer"
            title="Perbesar Foto"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Caption Label */}
        {caption && (
          <div className="mt-2 text-center px-1">
            <p className="text-stone-800 text-xs font-extrabold truncate">{caption}</p>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="max-w-4xl max-h-[90vh] bg-white p-3 rounded-3xl shadow-2xl relative space-y-2">
            <img src={src} alt={alt} className="max-h-[80vh] w-auto object-contain rounded-2xl mx-auto" />
            {caption && <p className="text-center font-bold text-slate-900 text-sm">{caption}</p>}
          </div>
        </div>
      )}
    </>
  );
};
