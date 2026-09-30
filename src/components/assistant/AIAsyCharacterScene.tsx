import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAIAsyCharacter, AIAsyPageKey } from '../../context/AIAsyCharacterContext';
import { AIAsyCharacterRenderer } from './AIAsyCharacterRenderer';
import { AI_ASY_ASSET_REGISTRY } from './AIAsyCharacterAssetRegistry';
import { MessageCircle, Volume2, X, Sparkles, Heart } from 'lucide-react';

export interface AIAsyCharacterSceneProps {
  pageContext: AIAsyPageKey;
  variant?: 'ASY' | 'ASYAH';
  className?: string;
  onActionClick?: () => void;
}

export const AIAsyCharacterScene: React.FC<AIAsyCharacterSceneProps> = ({
  pageContext,
  variant,
  className = '',
  onActionClick,
}) => {
  const { config, setGenderVariant } = useAIAsyCharacter();
  const [isSpeechOpen, setIsSpeechOpen] = useState<boolean>(false);

  if (!config.isEnabled) return null;

  const pageCfg = config.pages[pageContext];
  if (!pageCfg || !pageCfg.isVisible) return null;

  const activeVariant = variant || config.genderVariant || 'ASY';
  const meta = AI_ASY_ASSET_REGISTRY[pageCfg.state] || AI_ASY_ASSET_REGISTRY.idle;

  // Determine Position Alignment
  const getPositionStyle = () => {
    switch (pageCfg.position) {
      case 'LEFT':
        return 'flex-row';
      case 'CENTER':
        return 'flex-col sm:flex-row justify-center';
      case 'RIGHT':
      default:
        return 'flex-row';
    }
  };

  // Determine Animation Motion
  const getAnimationProps = () => {
    switch (pageCfg.animation) {
      case 'FLOAT_SUBTLE':
        return {
          animate: { y: [0, -6, 0] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'CELEBRATE_BOUNCE':
        return {
          animate: { y: [0, -10, 0], scale: [1, 1.03, 1] },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'GENTLE_BREATHING':
      default:
        return {
          animate: { scale: [1, 1.015, 1] },
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
        };
    }
  };

  const animProps = getAnimationProps();

  return (
    <div
      className={`relative my-4 overflow-hidden rounded-3xl border border-emerald-600/30 bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-slate-900/90 p-4 sm:p-5 text-emerald-100 shadow-xl backdrop-blur-md transition-all duration-300 ${className}`}
    >
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 ${getPositionStyle()}`}>
        
        {/* Character Stage & Official Renderer */}
        <div className="flex items-center gap-4 text-center sm:text-left">
          
          {/* Official Mascot Canvas Container */}
          <motion.div
            {...animProps}
            onClick={() => setIsSpeechOpen(!isSpeechOpen)}
            className="relative cursor-pointer group shrink-0"
            title="Ketuk untuk berinteraksi dengan AI Asy"
          >
            {/* Storybook Mound Base */}
            <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-gradient-to-tr from-emerald-900 via-teal-800 to-emerald-700 border-2 border-emerald-300/40 flex items-center justify-center p-1 shadow-inner relative overflow-hidden group-hover:scale-105 transition transform">
              
              {/* Background Sparkles */}
              <span className="absolute top-1 left-1 text-[10px] opacity-75">✨</span>
              <span className="absolute bottom-1 right-1 text-[10px] opacity-75">🌸</span>

              {/* OFFICIAL CHARACTER RENDERER ENGINE */}
              <AIAsyCharacterRenderer
                state={pageCfg.state}
                genderVariant={activeVariant}
                scale={pageCfg.scale}
                className="w-full h-full"
              />
            </div>

            {/* Official State Badge */}
            <div className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md border border-white uppercase tracking-wider">
              {meta.state}
            </div>
          </motion.div>

          {/* Text Content & Official Speech Bubble (Max 2 Lines) */}
          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI {activeVariant === 'ASYAH' ? 'Asyah' : 'Asy'} • Karakter Resmi</span>
              </span>
              <span className="text-[10px] font-bold bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-600/50">
                {meta.label}
              </span>
            </div>

            {/* Speech Bubble (Max 2 Lines) */}
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs sm:text-sm font-medium leading-snug line-clamp-2">
              “{pageCfg.greeting}”
            </div>
          </div>
        </div>

        {/* Gender Variant Switcher & Interactive Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setGenderVariant(activeVariant === 'ASY' ? 'ASYAH' : 'ASY')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition flex items-center gap-1 border border-white/20 cursor-pointer"
            title="Ganti karakter Asy / Asyah"
          >
            <span>{activeVariant === 'ASY' ? '👦 Asy' : '👧 Asyah'}</span>
          </button>

          {onActionClick && (
            <button
              onClick={onActionClick}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-stone-950" />
              <span>Sapa Karakter</span>
            </button>
          )}
        </div>

      </div>

      {/* Expanded Storybook Dialogue Modal Popup */}
      <AnimatePresence>
        {isSpeechOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-3 border-t border-white/20 text-xs space-y-2 relative z-20"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  Pesan Karakter Resmi AI {activeVariant === 'ASYAH' ? 'Asyah' : 'Asy'}:
                </p>
                <p className="leading-relaxed opacity-95">
                  “TK Asy Syifa Tanggul mendidik ananda dengan hati dan ilmu. Mari bersama membimbing generasi sholeh, cerdas, dan mandiri!”
                </p>
              </div>
              <button
                onClick={() => setIsSpeechOpen(false)}
                className="p-1 text-white/60 hover:text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
