import React from 'react';
import { AIAsyCharacterState, AI_ASY_ASSET_REGISTRY } from './AIAsyCharacterAssetRegistry';
import { MasterMascotRenderer } from './MasterMascotRenderer';

export interface AIAsyCharacterRendererProps {
  state: AIAsyCharacterState;
  genderVariant?: 'ASY' | 'ASYAH';
  scale?: number;
  className?: string;
  onClick?: () => void;
  gazeX?: number; // -1 to 1 offset for mouse tracking
  gazeY?: number; // -1 to 1 offset for mouse tracking
  groundType?: 'grass' | 'garden_stone' | 'wooden_floor';
  weather?: 'morning' | 'afternoon' | 'sunset' | 'night' | 'rain';
  season?: 'none' | 'ramadhan' | 'independence' | 'anniversary';
  speechBubbleText?: string | null;
  emotion?: 'happy' | 'curious' | 'proud' | 'friendly' | 'calm' | 'excited' | 'sleepy' | string;
  expression?: 'blink' | 'smile' | 'big_smile' | 'gentle_laugh' | 'curious_eyes' | 'closed_eye_smile' | 'soft_eyebrow' | 'yawn';
  pointDirection?: 'lanjut_berjalan' | 'ppdb' | 'login' | 'tour' | 'checkpoint' | 'none';
  smileLevel?: 1 | 2 | 3 | 4 | 5;
  isTalking?: boolean;
}

export const AIAsyCharacterRenderer: React.FC<AIAsyCharacterRendererProps> = ({
  state = 'idle',
  genderVariant = 'ASY',
  scale = 1.0,
  className = '',
  onClick,
  gazeX = 0,
  gazeY = 0,
  speechBubbleText = null,
}) => {
  const character = genderVariant === 'ASYAH' ? 'SYIFA' : 'ASY';

  return (
    <MasterMascotRenderer
      character={character}
      state={state}
      scale={scale}
      className={className}
      onClick={onClick}
      gazeX={gazeX}
      gazeY={gazeY}
      speechBubbleText={speechBubbleText}
    />
  );
};
