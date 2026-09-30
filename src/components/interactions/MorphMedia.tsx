import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, Check } from 'lucide-react';

interface MorphMediaProps {
  compactTitle: string;
  compactSubtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  expandedTitle: string;
  expandedDescription: string;
  image?: string;
  details?: { label: string; value: string }[];
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const MorphMedia: React.FC<MorphMediaProps> = ({
  compactTitle,
  compactSubtitle,
  badge,
  icon,
  expandedTitle,
  expandedDescription,
  image,
  details = [],
  ctaText,
  onCtaClick,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isExpanded ? (
        /* Compact Initial State */
        <div
          onClick={() => setIsExpanded(true)}
          className="group cursor-pointer p-4 bg-white/90 hover:bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl group-hover:scale-110 transition">
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition">
                  {compactTitle}
                </h4>
                {badge && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              {compactSubtitle && (
                <p className="text-xs text-stone-500 font-medium line-clamp-1">
                  {compactSubtitle}
                </p>
              )}
            </div>
          </div>
          <div className="p-2 bg-stone-100 text-stone-600 group-hover:bg-emerald-700 group-hover:text-white rounded-xl transition">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      ) : (
        /* Expanded Morphed State */
        <div className="p-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase rounded-full border border-emerald-400/30">
                <Sparkles className="w-3 h-3 text-amber-400" /> Morph Media Detail
              </span>
              <h3 className="text-lg font-black text-white leading-tight">
                {expandedTitle}
              </h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 bg-slate-950/60 hover:bg-red-600 text-white rounded-xl transition cursor-pointer border border-stone-700"
              title="Tutup Detail"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {image && (
            <div className="h-44 w-full overflow-hidden rounded-2xl bg-slate-950">
              <img
                src={image}
                alt={expandedTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-xs text-emerald-100 leading-relaxed font-normal">
            {expandedDescription}
          </p>

          {details.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/80">
              {details.map((d, i) => (
                <div key={i} className="p-2 bg-slate-950/40 rounded-xl border border-emerald-500/20">
                  <span className="block text-[10px] text-emerald-300 font-extrabold uppercase">{d.label}</span>
                  <span className="text-xs font-bold text-white">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-stone-200 text-xs font-extrabold rounded-xl transition cursor-pointer"
            >
              Kembali
            </button>

            {ctaText && (
              <button
                onClick={() => {
                  if (onCtaClick) onCtaClick();
                  setIsExpanded(false);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> {ctaText}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
