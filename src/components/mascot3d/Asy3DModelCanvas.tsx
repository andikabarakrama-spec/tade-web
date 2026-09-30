import React, { useMemo } from 'react';
import { LivingAnimationState } from '../../core/mascot3d/livingAnimationEngine';
import { AsyEmotionType } from '../../core/mascot3d/emotionalStateEngine';

interface Asy3DModelCanvasProps {
  animState: LivingAnimationState;
  size?: number;
  reducedMotion?: boolean;
  highContrast?: boolean;
  outfit?: 'ASY_KOKO_EMERALD' | 'ASYAH_HIJAB_EMERALD' | 'BATIK_PAUD';
  emotion?: AsyEmotionType;
  hatDecoration?: string;
  shoulderSway?: number;
  headFollowAngle?: { x: number; y: number };
  isDoubleBlinking?: boolean;
}

export const Asy3DModelCanvas: React.FC<Asy3DModelCanvasProps> = ({
  animState,
  size = 80,
  reducedMotion = false,
  highContrast = false,
  outfit = 'ASY_KOKO_EMERALD',
  emotion = 'HAPPY',
  hatDecoration = 'Bintang Emas',
  shoulderSway = 0,
  headFollowAngle = { x: 0, y: 0 },
  isDoubleBlinking = false
}) => {
  // Breathing & dynamic motion transforms
  const scaleY = reducedMotion ? 1.0 : animState.breathingScale;
  const headTilt = reducedMotion ? 0 : animState.headTiltAngle + headFollowAngle.x;
  const footSwing = reducedMotion ? 0 : animState.footSwingAngle;
  const lookX = reducedMotion ? 0 : (animState.lookDirection.x * 3.5) + (headFollowAngle.x * 0.4);
  const lookY = reducedMotion ? 0 : (animState.lookDirection.y * 2.5) + (headFollowAngle.y * 0.4);
  const effectiveShoulderSway = reducedMotion ? 0 : shoulderSway;

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md transition-transform duration-150"
        style={{
          transform: `scaleY(${scaleY})`,
          transformOrigin: 'bottom center',
          filter: highContrast ? 'contrast(1.2) drop-shadow(0 0 2px #047857)' : undefined
        }}
      >
        <defs>
          {/* Emerald Gradient */}
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Soft Shadow */}
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Gold Trim */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* 1. Ground Shadow */}
        <ellipse cx="50" cy="94" rx="28" ry="4.5" fill="url(#shadowGrad)" />

        {/* 2. Feet with gentle swing */}
        <g style={{ transform: `rotate(${footSwing}deg)`, transformOrigin: '50px 88px' }}>
          {/* Left Foot */}
          <ellipse cx="42" cy="89" rx="5.5" ry="3" fill="#1E293B" />
          {/* Right Foot */}
          <ellipse cx="58" cy="89" rx="5.5" ry="3" fill="#1E293B" />
        </g>

        {/* 3. Body & Koko Emerald */}
        <g style={{ transform: `rotate(${effectiveShoulderSway}deg)`, transformOrigin: '50px 70px' }}>
          {/* Koko Robe / Emerald Shirt */}
          <path
            d="M 33 60 C 33 52, 67 52, 67 60 L 72 84 C 72 87, 28 87, 28 84 Z"
            fill="url(#emeraldGrad)"
          />
          {/* Gold Collar Trim */}
          <path
            d="M 45 55 L 50 63 L 55 55 Z"
            fill="url(#goldGrad)"
          />
          {/* Koko Buttons */}
          <circle cx="50" cy="67" r="1" fill="#FEF3C7" />
          <circle cx="50" cy="73" r="1" fill="#FEF3C7" />
          <circle cx="50" cy="79" r="1" fill="#FEF3C7" />

          {/* Hands / Arms */}
          {emotion === 'PRAYING' ? (
            /* Praying / Menadahkan tangan */
            <g>
              <ellipse cx="44" cy="64" rx="3.5" ry="4.5" fill="#FFE4C4" />
              <ellipse cx="56" cy="64" rx="3.5" ry="4.5" fill="#FFE4C4" />
            </g>
          ) : animState.currentPose === 'WAVE' ? (
            <>
              {/* Left hand relaxed */}
              <ellipse cx="28" cy="70" rx="3.5" ry="5" fill="#FFE4C4" />
              {/* Right hand waving */}
              <g style={{ transform: 'rotate(-25deg)', transformOrigin: '70px 62px' }}>
                <path d="M 68 62 L 76 50 C 78 48, 82 52, 80 55 L 72 66 Z" fill="url(#emeraldGrad)" />
                <circle cx="78" cy="50" r="3.5" fill="#FFE4C4" />
              </g>
            </>
          ) : animState.currentPose === 'CELEBRATE' || animState.currentPose === 'SMALL_JUMP' || emotion === 'PROUD' ? (
            <>
              {/* Both hands up in joy */}
              <g style={{ transform: 'rotate(25deg)', transformOrigin: '30px 62px' }}>
                <path d="M 32 62 L 24 50 C 22 48, 18 52, 20 55 L 28 66 Z" fill="url(#emeraldGrad)" />
                <circle cx="22" cy="50" r="3.5" fill="#FFE4C4" />
              </g>
              <g style={{ transform: 'rotate(-25deg)', transformOrigin: '70px 62px' }}>
                <path d="M 68 62 L 76 50 C 78 48, 82 52, 80 55 L 72 66 Z" fill="url(#emeraldGrad)" />
                <circle cx="78" cy="50" r="3.5" fill="#FFE4C4" />
              </g>
            </>
          ) : (
            <>
              {/* Regular relaxed hands */}
              <ellipse cx="27" cy="70" rx="3.5" ry="5" fill="#FFE4C4" />
              <ellipse cx="73" cy="70" rx="3.5" ry="5" fill="#FFE4C4" />
            </>
          )}
        </g>

        {/* 4. Head Group (Tilts with curiosity / look around) */}
        <g style={{ transform: `rotate(${headTilt}deg)`, transformOrigin: '50px 42px' }}>
          {/* Head Base */}
          <circle cx="50" cy="38" r="22" fill="#FFE4C4" />

          {/* Rosy Cheeks (blush increases when shy or celebrating) */}
          <circle cx="36" cy="42" r={emotion === 'SHY' ? 4.5 : 3.5} fill="#FDA4AF" opacity={emotion === 'SHY' ? 0.9 : 0.65} />
          <circle cx="64" cy="42" r={emotion === 'SHY' ? 4.5 : 3.5} fill="#FDA4AF" opacity={emotion === 'SHY' ? 0.9 : 0.65} />

          {/* Ears */}
          <circle cx="28" cy="38" r="3.5" fill="#FCD34D" opacity="0.5" />
          <circle cx="72" cy="38" r="3.5" fill="#FCD34D" opacity="0.5" />

          {/* Peci Hitam (Songkok) / Hijab */}
          {outfit === 'ASYAH_HIJAB_EMERALD' ? (
            <path
              d="M 28 36 C 28 16, 72 16, 72 36 C 72 46, 74 54, 70 58 C 65 62, 35 62, 30 58 C 26 54, 28 46, 28 36 Z"
              fill="url(#emeraldGrad)"
            />
          ) : (
            <g>
              {/* Peci Hitam */}
              <path
                d="M 30 25 C 30 14, 70 14, 70 25 L 71 29 C 71 30, 29 30, 29 29 Z"
                fill="#1E293B"
              />
              {/* Peci Gold Badge */}
              <circle cx="50" cy="22" r="2.2" fill="#FBBF24" />
            </g>
          )}

          {/* Eyes (Blinking + Emotion variations) */}
          <g style={{ transform: `translate(${lookX}px, ${lookY}px)` }}>
            {animState.isBlinking || emotion === 'PRAYING' || emotion === 'PROUD' ? (
              <>
                {/* Closed happy / praying eyes */}
                <path d="M 38 38 Q 42 41 46 38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 54 38 Q 58 41 62 38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : emotion === 'SLEEPY' ? (
              <>
                {/* Half closed sleepy eyes */}
                <path d="M 38 36 Q 42 39 46 36" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 54 36 Q 58 39 62 36" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                {/* Big Chibi Eyes */}
                <ellipse cx="42" cy="37" rx="3.8" ry="4.8" fill="#0F172A" />
                <ellipse cx="58" cy="37" rx="3.8" ry="4.8" fill="#0F172A" />
                {/* Eye Sparkles */}
                <circle cx="43.5" cy="35" r="1.5" fill="#FFFFFF" />
                <circle cx="59.5" cy="35" r="1.5" fill="#FFFFFF" />
                <circle cx="40.5" cy="38.5" r="0.7" fill="#FFFFFF" />
                <circle cx="56.5" cy="38.5" r="0.7" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* Cheerful Smile / Expression */}
          <path
            d={animState.currentPose === 'CELEBRATE' || animState.currentPose === 'SMALL_JUMP' || emotion === 'HAPPY' || emotion === 'PROUD'
              ? "M 44 43 Q 50 49 56 43 Z" 
              : "M 45 44 Q 50 47.5 55 44"}
            stroke="#991B1B"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill={animState.currentPose === 'CELEBRATE' || animState.currentPose === 'SMALL_JUMP' || emotion === 'HAPPY' || emotion === 'PROUD' ? "#EF4444" : "none"}
          />
        </g>
      </svg>
    </div>
  );
};
