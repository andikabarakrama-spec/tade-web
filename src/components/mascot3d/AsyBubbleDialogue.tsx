import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { SpeechBubbleItem } from '../../core/mascot3d/bubbleDialogueSystem';

interface AsyBubbleDialogueProps {
  bubble: SpeechBubbleItem | null;
  onDismiss: () => void;
  positionCorner?: 'BOTTOM_RIGHT' | 'BOTTOM_LEFT' | 'TOP_RIGHT' | 'CUSTOM';
}

export const AsyBubbleDialogue: React.FC<AsyBubbleDialogueProps> = ({
  bubble,
  onDismiss,
  positionCorner = 'BOTTOM_RIGHT'
}) => {
  if (!bubble) return null;

  const isLeft = positionCorner === 'BOTTOM_LEFT';

  return (
    <div 
      className={`absolute bottom-full mb-3 z-50 transition-all duration-300 transform scale-100 ${
        isLeft ? 'left-0' : 'right-0'
      }`}
      style={{ minWidth: 220, maxWidth: 300 }}
      role="tooltip"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-emerald-500/40 relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-600 flex items-center justify-center cursor-pointer shadow-xs transition"
          aria-label="Tutup pesan Asy"
        >
          <X className="w-3 h-3" />
        </button>

        <div className="flex items-start gap-2">
          <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <p className="text-xs text-slate-100 leading-relaxed font-medium">
              {bubble.message}
            </p>
            {bubble.actionButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  bubble.actionButton?.onClick();
                  onDismiss();
                }}
                className="mt-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
              >
                {bubble.actionButton.label}
              </button>
            )}
          </div>
        </div>

        {/* Speech Bubble Arrow Indicator */}
        <div 
          className={`absolute -bottom-2 w-3 h-3 bg-slate-900 border-r border-b border-emerald-500/40 transform rotate-45 ${
            isLeft ? 'left-8' : 'right-8'
          }`}
        />
      </div>
    </div>
  );
};
