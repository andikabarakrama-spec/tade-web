/**
 * TADE v9.1.0-MCA1 — R916 / R917
 * ASY MASTER CHARACTER COMPONENT (Living Canon Vector Model)
 * 
 * 100% Vector SVG Rendering complying with Character Bible:
 * - Proportion: 2.5 Heads Chibi Islamic Aesthetic
 * - Colors: Peci Onyx (#0F172A), Lis Zamrud (#059669), Koko Krem (#FFFBF5), Aksen Oranye (#F97316)
 * - Living Animations: Breathing, Eye Gaze Wander, Blinking, Foot Swing, Peci Adjust.
 * - Performance: 60 FPS GPU-accelerated transforms, zero canvas overhead.
 */

import React from 'react';
import { motion } from 'motion/react';
import { MasterExpressionKey, MasterPoseKey } from '../../core/masterCharacter/masterCharacterRegistry';
import { ExpressionStateSnapshot } from '../../core/masterCharacter/expressionEngine';

interface AsyProps {
  size?: number | string; // default 64px on mobile, expandable
  expressionSnapshot?: ExpressionStateSnapshot;
  expression?: MasterExpressionKey;
  pose?: MasterPoseKey;
  animateLiving?: boolean;
  className?: string;
  onClick?: () => void;
  state?: string;
  speech?: string;
  showSpeech?: boolean;
  enableBlink?: boolean;
  enableBreathing?: boolean;
}

export const Asy: React.FC<AsyProps> = ({
  size = 64,
  expressionSnapshot,
  expression = 'idle',
  pose = 'idle-stand',
  animateLiving = true,
  className = '',
  onClick
}) => {
  const currentExpr = expressionSnapshot?.currentExpression || expression;
  const isBlinking = expressionSnapshot?.isBlinking || false;
  const gaze = expressionSnapshot?.eyeGaze || { x: 0, y: 0 };
  const blushLevel = expressionSnapshot?.blushIntensity ?? 0.5;

  // Determine pose variations
  const isWaving = pose === 'wave' || pose === 'melambai';
  const isPointing = pose === 'point';
  const isReading = pose === 'read-iqro' || pose === 'membaca-iqro';
  const isSwingingFeet = pose === 'swing-feet' || pose === 'menggoyang-kaki';
  const isPeeking = pose === 'peek' || pose === 'ngintip';
  const isAdjustingPeci = pose === 'peci-adjust' || pose === 'merapikan-peci';
  const isSitting = pose === 'sit' || pose === 'duduk';
  const isPraying = pose === 'pray';
  const isThumbsUp = pose === 'thumbs-up';

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
    >
      <svg
        viewBox="0 0 160 200"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="asySkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF1BE" />
            <stop offset="100%" stopColor="#FED786" />
          </linearGradient>
          <linearGradient id="asyPeciGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="asyKokoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
          <filter id="asyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#059669" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* --- LIVING BREATHING ROOT WRAPPER --- */}
        <motion.g
          animate={
            animateLiving
              ? {
                  y: [0, -2, 0],
                  scaleY: [1, 1.015, 1]
                }
              : {}
          }
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* --- SHADOW ON GROUND --- */}
          <ellipse
            cx="80"
            cy="192"
            rx={isSwingingFeet ? 32 : 42}
            ry="7"
            fill="#0F172A"
            opacity="0.15"
          />

          {/* --- LOWER BODY & FEET (Foot Swing Animation) --- */}
          <g id="asy-feet">
            {/* Left Foot */}
            <motion.g
              animate={
                isSwingingFeet && animateLiving
                  ? { rotate: [-14, 14, -14], originX: '65px', originY: '170px' }
                  : {}
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="65" cy="184" rx="13" ry="7" fill="#064E3B" />
              <ellipse cx="63" cy="183" rx="10" ry="5" fill="#334155" />
            </motion.g>

            {/* Right Foot */}
            <motion.g
              animate={
                isSwingingFeet && animateLiving
                  ? { rotate: [14, -14, 14], originX: '95px', originY: '170px' }
                  : {}
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="95" cy="184" rx="13" ry="7" fill="#064E3B" />
              <ellipse cx="97" cy="183" rx="10" ry="5" fill="#334155" />
            </motion.g>
          </g>

          {/* --- PANTS / CELANA SANTRI --- */}
          <path
            d="M 52 145 L 62 178 L 76 178 L 80 155 L 84 178 L 98 178 L 108 145 Z"
            fill="#064E3B"
          />

          {/* --- KOKO SHIRT & BODY --- */}
          <g id="asy-torso">
            {/* Main Koko */}
            <path
              d="M 46 100 Q 80 94 114 100 L 110 152 Q 80 158 50 152 Z"
              fill="url(#asyKokoGrad)"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            {/* Orange Center Placket */}
            <rect x="76" y="98" width="8" height="50" rx="4" fill="#F97316" />
            {/* Zamrud Buttons */}
            <circle cx="80" cy="110" r="2" fill="#059669" />
            <circle cx="80" cy="122" r="2" fill="#059669" />
            <circle cx="80" cy="134" r="2" fill="#059669" />
            {/* Emerald Trim Border */}
            <path
              d="M 50 150 Q 80 156 110 150"
              stroke="#059669"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* --- LEFT ARM & HAND --- */}
          <g id="asy-left-arm">
            <path
              d="M 48 104 Q 32 125 36 142 Q 40 148 48 142 Q 54 125 56 108 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <circle cx="38" cy="144" r="6.5" fill="url(#asySkinGrad)" />
          </g>

          {/* --- RIGHT ARM & HAND (Pose Reactive & Waving) --- */}
          <g id="asy-right-arm">
            {isWaving ? (
              <motion.g
                animate={animateLiving ? { rotate: [-10, 20, -10] } : {}}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '112px 105px' }}
              >
                <path
                  d="M 112 105 Q 128 92 136 76 Q 142 80 136 92 Q 126 110 114 116 Z"
                  fill="#FFFFFF"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                {/* Waving Palm */}
                <circle cx="138" cy="74" r="7.5" fill="url(#asySkinGrad)" />
                <path d="M 136 68 Q 140 66 144 72" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
              </motion.g>
            ) : isPointing ? (
              <g>
                <path
                  d="M 112 105 Q 134 100 148 94 Q 152 98 144 106 Q 126 116 114 116 Z"
                  fill="#FFFFFF"
                />
                <circle cx="152" cy="94" r="7" fill="url(#asySkinGrad)" />
                {/* Pointing Index Finger */}
                <rect x="150" y="90" width="10" height="4" rx="2" fill="url(#asySkinGrad)" />
              </g>
            ) : isAdjustingPeci ? (
              <g>
                {/* Arm reaching up to touch peci */}
                <path
                  d="M 112 105 Q 128 78 116 52 Q 110 50 108 58 Q 116 80 114 116 Z"
                  fill="#FFFFFF"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <circle cx="114" cy="50" r="6" fill="url(#asySkinGrad)" />
              </g>
            ) : isThumbsUp ? (
              <g>
                <path
                  d="M 112 105 Q 130 96 140 88 Q 144 92 136 102 Q 124 114 114 116 Z"
                  fill="#FFFFFF"
                />
                <circle cx="140" cy="88" r="6.5" fill="url(#asySkinGrad)" />
                {/* Thumbs up finger */}
                <rect x="138" y="78" width="5" height="11" rx="2.5" fill="url(#asySkinGrad)" />
              </g>
            ) : isPraying ? (
              <g>
                <path
                  d="M 112 105 Q 98 116 86 112 Q 84 106 94 104 Q 106 102 114 106 Z"
                  fill="#FFFFFF"
                />
                <circle cx="86" cy="110" r="5.5" fill="url(#asySkinGrad)" />
              </g>
            ) : isReading ? (
              <g>
                {/* Holding Iqro Book */}
                <path d="M 60 128 L 100 128 L 96 146 L 64 146 Z" fill="#10B981" rx="2" />
                <path d="M 64 130 L 96 130 L 94 144 L 66 144 Z" fill="#FEF3C7" />
                <path d="M 80 130 L 80 144" stroke="#059669" strokeWidth="1" />
                <circle cx="58" cy="138" r="5" fill="url(#asySkinGrad)" />
                <circle cx="102" cy="138" r="5" fill="url(#asySkinGrad)" />
              </g>
            ) : (
              <g>
                <path
                  d="M 112 104 Q 128 125 124 142 Q 120 148 112 142 Q 106 125 104 108 Z"
                  fill="#FFFFFF"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <circle cx="122" cy="144" r="6.5" fill="url(#asySkinGrad)" />
              </g>
            )}
          </g>

          {/* --- NECK --- */}
          <rect x="74" y="88" width="12" height="12" rx="4" fill="url(#asySkinGrad)" />

          {/* --- HEAD GROUP (Chibi Islamic 2.5 Head Ratio) --- */}
          <motion.g
            id="asy-head"
            animate={
              animateLiving
                ? {
                    rotate: [-1.2, 1.2, -1.2]
                  }
                : {}
            }
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ transformOrigin: '80px 92px' }}
          >
            {/* Head Contour (Chubby Cute Preschool Cheeks) */}
            <path
              d="M 44 64 C 40 38, 120 38, 116 64 C 118 86, 102 98, 80 98 C 58 98, 42 86, 44 64 Z"
              fill="url(#asySkinGrad)"
            />

            {/* Left Ear */}
            <circle cx="42" cy="65" r="7" fill="url(#asySkinGrad)" />
            <circle cx="43" cy="65" r="3.5" fill="#FBBF24" opacity="0.5" />

            {/* Right Ear */}
            <circle cx="118" cy="65" r="7" fill="url(#asySkinGrad)" />
            <circle cx="117" cy="65" r="3.5" fill="#FBBF24" opacity="0.5" />

            {/* Rosy Warm Cheeks (Blush) */}
            <ellipse
              cx="55"
              cy="74"
              rx="9"
              ry="5.5"
              fill="#F43F5E"
              opacity={blushLevel * 0.45}
            />
            <ellipse
              cx="105"
              cy="74"
              rx="9"
              ry="5.5"
              fill="#F43F5E"
              opacity={blushLevel * 0.45}
            />

            {/* --- EYES & EYEBROWS (Gaze, Blinking & Expression Reactive) --- */}
            {/* Left Eyebrow */}
            <path
              d={
                currentExpr === 'confused'
                  ? 'M 54 48 Q 62 44 70 49'
                  : currentExpr === 'surprised'
                  ? 'M 54 44 Q 62 40 70 44'
                  : 'M 54 48 Q 62 45 70 48'
              }
              stroke="#0F172A"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Right Eyebrow */}
            <path
              d={
                currentExpr === 'confused'
                  ? 'M 90 50 Q 98 46 106 45'
                  : currentExpr === 'surprised'
                  ? 'M 90 44 Q 98 40 106 44'
                  : 'M 90 48 Q 98 45 106 48'
              }
              stroke="#0F172A"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Eyes Container */}
            {isBlinking || currentExpr === 'sleepy' ? (
              // Closed/Blinking Eyes
              <g>
                <path
                  d="M 54 62 Q 62 67 70 62"
                  stroke="#0F172A"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 90 62 Q 98 67 106 62"
                  stroke="#0F172A"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : currentExpr === 'laugh' || currentExpr === 'happy' ? (
              // Cheerful Arc Eyes (^ ^)
              <g>
                <path
                  d="M 54 64 Q 62 55 70 64"
                  stroke="#0F172A"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 90 64 Q 98 55 106 64"
                  stroke="#0F172A"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : (
              // Sparkling Big Chibi Eyes
              <g>
                {/* Left Eye Sclera & Iris */}
                <ellipse cx="62" cy="62" rx="7.5" ry="9" fill="#0F172A" />
                {/* Left Gaze Tracking Pupil */}
                <ellipse
                  cx={62 + gaze.x * 2.5}
                  cy={61 + gaze.y * 2}
                  rx="6"
                  ry="7.5"
                  fill="#020617"
                />
                {/* Left Catchlights (Sparkles) */}
                <circle cx={59.5 + gaze.x} cy="58" r="2.6" fill="#FFFFFF" />
                <circle cx={64.5 + gaze.x} cy="64.5" r="1.3" fill="#FFFFFF" />

                {/* Right Eye Sclera & Iris */}
                <ellipse cx="98" cy="62" rx="7.5" ry="9" fill="#0F172A" />
                {/* Right Gaze Tracking Pupil */}
                <ellipse
                  cx={98 + gaze.x * 2.5}
                  cy={61 + gaze.y * 2}
                  rx="6"
                  ry="7.5"
                  fill="#020617"
                />
                {/* Right Catchlights (Sparkles) */}
                <circle cx={95.5 + gaze.x} cy="58" r="2.6" fill="#FFFFFF" />
                <circle cx={100.5 + gaze.x} cy="64.5" r="1.3" fill="#FFFFFF" />
              </g>
            )}

            {/* Cute Little Nose */}
            <ellipse cx="80" cy="68" rx="2" ry="1.4" fill="#F59E0B" opacity="0.7" />

            {/* --- MOUTH EXPRESSION --- */}
            {currentExpr === 'laugh' ? (
              // Open Laughing Mouth
              <path
                d="M 72 74 Q 80 88 88 74 Z"
                fill="#DC2626"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
            ) : currentExpr === 'happy' ? (
              // Cheerful Wide Smile
              <path
                d="M 72 74 Q 80 83 88 74"
                stroke="#0F172A"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            ) : currentExpr === 'surprised' ? (
              // Surprised 'O' Mouth
              <ellipse
                cx="80"
                cy="76"
                rx="4"
                ry="5"
                fill="#DC2626"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
            ) : currentExpr === 'confused' ? (
              // Confused Wobbly Mouth
              <path
                d="M 74 76 Q 78 74 82 77 Q 86 75 88 74"
                stroke="#0F172A"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Gentle Warm Smile (Default)
              <path
                d="M 74 74 Q 80 80 86 74"
                stroke="#0F172A"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* --- PECI HITAM ZAMRUD (Headwear with Peci Adjust Animation) --- */}
            <motion.g
              id="asy-peci"
              animate={
                animateLiving
                  ? {
                      rotate: [-0.5, 0.8, -0.5],
                      y: [0, -0.5, 0]
                    }
                  : {}
              }
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{ transformOrigin: '80px 40px' }}
            >
              {/* Peci Silhouette */}
              <path
                d="M 44 48 C 42 22, 118 22, 116 48 L 114 50 C 100 46, 60 46, 46 50 Z"
                fill="url(#asyPeciGrad)"
                stroke="#020617"
                strokeWidth="1.2"
              />
              {/* Gold Emerald Lis/Trim */}
              <path
                d="M 46 48 C 60 44, 100 44, 114 48"
                stroke="#10B981"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 48 47 C 62 43.5, 98 43.5, 112 47"
                stroke="#FBBF24"
                strokeWidth="1"
                fill="none"
              />
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};
