/**
 * TADE v9.1.0-MCA1 — R916 / R917
 * SYIFA MASTER CHARACTER COMPONENT (Living Canon Vector Model)
 * 
 * 100% Vector SVG Rendering complying with Character Bible:
 * - Proportion: 2.5 Heads Chibi Islamic Aesthetic
 * - Colors: Hijab Rosy Warm (#FDA4AF), Gamis Santriwati Syar'i (#047857), Aksen Lilac & Sage
 * - Living Animations: Breathing, Hijab Sway, Eye Gaze Wander, Blinking, Foot Swing.
 * - Performance: 60 FPS GPU-accelerated transforms, zero canvas overhead.
 */

import React from 'react';
import { motion } from 'motion/react';
import { MasterExpressionKey, MasterPoseKey } from '../../core/masterCharacter/masterCharacterRegistry';
import { ExpressionStateSnapshot } from '../../core/masterCharacter/expressionEngine';

interface SyifaProps {
  size?: number | string;
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

export const Syifa: React.FC<SyifaProps> = ({
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

  const isWaving = pose === 'wave' || pose === 'melambai';
  const isButterfly = pose === 'butterfly' || pose === 'mengejar-kupu-kupu';
  const isReading = pose === 'read-iqro' || pose === 'membaca-iqro';
  const isSwingingFeet = pose === 'swing-feet' || pose === 'menggoyang-kaki';
  const isHoldingHijab = pose === 'hijab-hold' || pose === 'memegang-ujung-hijab';
  const isPeeking = pose === 'peek' || pose === 'ngintip';
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
          <linearGradient id="syifaSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF4D4" />
            <stop offset="100%" stopColor="#FED7AA" />
          </linearGradient>
          <linearGradient id="syifaHijabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE4E6" />
            <stop offset="50%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
          <linearGradient id="syifaGamisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
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
            duration: 3.4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* --- SHADOW --- */}
          <ellipse
            cx="80"
            cy="192"
            rx={isSwingingFeet ? 32 : 44}
            ry="7"
            fill="#0F172A"
            opacity="0.14"
          />

          {/* --- FEET (Foot Swing Animation) --- */}
          <g id="syifa-feet">
            <motion.g
              animate={
                isSwingingFeet && animateLiving
                  ? { rotate: [-12, 12, -12], originX: '66px', originY: '175px' }
                  : {}
              }
              transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="66" cy="186" rx="12" ry="6.5" fill="#475569" />
              <ellipse cx="64" cy="185" rx="8" ry="4" fill="#FDA4AF" opacity="0.6" />
            </motion.g>

            <motion.g
              animate={
                isSwingingFeet && animateLiving
                  ? { rotate: [12, -12, 12], originX: '94px', originY: '175px' }
                  : {}
              }
              transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="94" cy="186" rx="12" ry="6.5" fill="#475569" />
              <ellipse cx="96" cy="185" rx="8" ry="4" fill="#FDA4AF" opacity="0.6" />
            </motion.g>
          </g>

          {/* --- GAMIS SYAR'I SANTRIWATI (Longgar & Anggun) --- */}
          <g id="syifa-gamis">
            <path
              d="M 46 108 Q 80 102 114 108 L 126 182 Q 80 188 34 182 Z"
              fill="url(#syifaGamisGrad)"
              stroke="#065F46"
              strokeWidth="1.2"
            />
            {/* Gamis Pastel Hem Trim */}
            <path
              d="M 34 180 Q 80 186 126 180"
              stroke="#FDA4AF"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 38 175 Q 80 181 122 175"
              stroke="#FDE047"
              strokeWidth="1.2"
              fill="none"
            />
          </g>

          {/* --- LEFT ARM & HAND --- */}
          <g id="syifa-left-arm">
            <path
              d="M 44 112 Q 30 130 36 148 Q 42 152 48 146 Q 52 130 52 114 Z"
              fill="#059669"
            />
            <circle cx="38" cy="148" r="6" fill="url(#syifaSkinGrad)" />
          </g>

          {/* --- RIGHT ARM & HAND (Pose Reactive & Butterfly / Wave) --- */}
          <g id="syifa-right-arm">
            {isButterfly ? (
              <g>
                <path
                  d="M 116 112 Q 134 100 144 86 Q 148 90 142 98 Q 130 114 116 120 Z"
                  fill="#059669"
                />
                <circle cx="144" cy="86" r="6.5" fill="url(#syifaSkinGrad)" />
                {/* Floating Butterfly */}
                <motion.g
                  animate={
                    animateLiving
                      ? {
                          x: [0, 4, -2, 0],
                          y: [0, -6, 2, 0],
                          rotate: [-5, 8, -5]
                        }
                      : {}
                  }
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '154px 72px' }}
                >
                  <path d="M 152 74 Q 146 64 154 62 Q 158 68 152 74 Z" fill="#F43F5E" />
                  <path d="M 154 74 Q 160 64 156 62 Q 152 68 154 74 Z" fill="#38BDF8" />
                  <circle cx="153" cy="74" r="1.5" fill="#0F172A" />
                </motion.g>
              </g>
            ) : isWaving ? (
              <motion.g
                animate={animateLiving ? { rotate: [-12, 18, -12] } : {}}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '116px 112px' }}
              >
                <path
                  d="M 116 112 Q 132 96 138 80 Q 144 84 138 96 Q 128 114 116 122 Z"
                  fill="#059669"
                />
                <circle cx="140" cy="80" r="6.5" fill="url(#syifaSkinGrad)" />
              </motion.g>
            ) : isHoldingHijab ? (
              <g>
                {/* Arm holding gentle edge of hijab */}
                <path
                  d="M 116 112 Q 106 128 92 134 Q 88 128 98 122 Q 112 118 116 112 Z"
                  fill="#059669"
                />
                <circle cx="92" cy="132" r="5.5" fill="url(#syifaSkinGrad)" />
              </g>
            ) : isThumbsUp ? (
              <g>
                <path
                  d="M 116 112 Q 132 98 140 88 Q 144 92 136 102 Q 124 114 116 120 Z"
                  fill="#059669"
                />
                <circle cx="140" cy="88" r="6.5" fill="url(#syifaSkinGrad)" />
                <rect x="138" y="78" width="5" height="11" rx="2.5" fill="url(#syifaSkinGrad)" />
              </g>
            ) : isPraying ? (
              <g>
                <path
                  d="M 116 112 Q 100 120 88 116 Q 86 110 96 108 Q 108 106 116 110 Z"
                  fill="#059669"
                />
                <circle cx="88" cy="114" r="5.5" fill="url(#syifaSkinGrad)" />
              </g>
            ) : isReading ? (
              <g>
                <path d="M 62 132 L 98 132 L 94 150 L 66 150 Z" fill="#3B82F6" rx="2" />
                <path d="M 66 134 L 94 134 L 92 148 L 68 148 Z" fill="#FEF3C7" />
                <circle cx="60" cy="142" r="5" fill="url(#syifaSkinGrad)" />
                <circle cx="100" cy="142" r="5" fill="url(#syifaSkinGrad)" />
              </g>
            ) : (
              <g>
                <path
                  d="M 116 112 Q 130 130 124 148 Q 118 152 112 146 Q 108 130 108 114 Z"
                  fill="#059669"
                />
                <circle cx="122" cy="148" r="6" fill="url(#syifaSkinGrad)" />
              </g>
            )}
          </g>

          {/* --- HIJAB SYAR'I CHEST COVERAGE (Menutup Dada) --- */}
          <motion.g
            id="syifa-hijab-chest"
            animate={
              animateLiving
                ? {
                    rotate: [-0.8, 0.8, -0.8]
                  }
                : {}
            }
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ transformOrigin: '80px 85px' }}
          >
            <path
              d="M 44 84 Q 80 135 116 84 Q 108 130 80 138 Q 52 130 44 84 Z"
              fill="url(#syifaHijabGrad)"
              stroke="#FB7185"
              strokeWidth="1.2"
            />
            {/* Hijab Rosy Trim */}
            <path
              d="M 52 124 Q 80 134 108 124"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              opacity="0.8"
            />
          </motion.g>

          {/* --- HEAD GROUP WITH HIJAB SWAY --- */}
          <motion.g
            id="syifa-head"
            animate={
              animateLiving
                ? {
                    rotate: [-1.4, 1.4, -1.4]
                  }
                : {}
            }
            transition={{
              duration: 4.4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ transformOrigin: '80px 88px' }}
          >
            {/* Hijab Base Frame (Back) */}
            <path
              d="M 36 60 C 30 20, 130 20, 124 60 C 128 92, 114 112, 80 112 C 46 112, 32 92, 36 60 Z"
              fill="url(#syifaHijabGrad)"
            />

            {/* Inner Face Opening (Oval Chibi Cute) */}
            <ellipse cx="80" cy="65" rx="34" ry="30" fill="url(#syifaSkinGrad)" />

            {/* Inner Hijab Ciput / Bandana */}
            <path
              d="M 49 52 C 60 44, 100 44, 111 52 C 102 46, 58 46, 49 52 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />

            {/* Rosy Warm Cheeks */}
            <ellipse
              cx="57"
              cy="74"
              rx="8.5"
              ry="5"
              fill="#FB7185"
              opacity={blushLevel * 0.55}
            />
            <ellipse
              cx="103"
              cy="74"
              rx="8.5"
              ry="5"
              fill="#FB7185"
              opacity={blushLevel * 0.55}
            />

            {/* Eyebrows */}
            <path
              d={
                currentExpr === 'confused'
                  ? 'M 56 49 Q 64 45 72 50'
                  : currentExpr === 'surprised'
                  ? 'M 56 45 Q 64 41 72 45'
                  : 'M 56 49 Q 64 46 72 49'
              }
              stroke="#475569"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={
                currentExpr === 'confused'
                  ? 'M 88 51 Q 96 47 104 46'
                  : currentExpr === 'surprised'
                  ? 'M 88 45 Q 96 41 104 45'
                  : 'M 88 49 Q 96 46 104 49'
              }
              stroke="#475569"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Eyes & Blinking */}
            {isBlinking || currentExpr === 'sleepy' ? (
              <g>
                <path
                  d="M 56 63 Q 64 68 72 63"
                  stroke="#1E293B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 88 63 Q 96 68 104 63"
                  stroke="#1E293B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : currentExpr === 'laugh' || currentExpr === 'happy' ? (
              <g>
                <path
                  d="M 56 64 Q 64 56 72 64"
                  stroke="#1E293B"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 88 64 Q 96 56 104 64"
                  stroke="#1E293B"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : (
              <g>
                {/* Left Eye */}
                <ellipse cx="64" cy="63" rx="7.5" ry="9" fill="#1E293B" />
                <ellipse
                  cx={64 + gaze.x * 2.5}
                  cy={62 + gaze.y * 2}
                  rx="6"
                  ry="7.5"
                  fill="#0F172A"
                />
                <circle cx={61.5 + gaze.x} cy="59" r="2.6" fill="#FFFFFF" />
                <circle cx={66.5 + gaze.x} cy="65.5" r="1.3" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="96" cy="63" rx="7.5" ry="9" fill="#1E293B" />
                <ellipse
                  cx={96 + gaze.x * 2.5}
                  cy={62 + gaze.y * 2}
                  rx="6"
                  ry="7.5"
                  fill="#0F172A"
                />
                <circle cx={93.5 + gaze.x} cy="59" r="2.6" fill="#FFFFFF" />
                <circle cx={98.5 + gaze.x} cy="65.5" r="1.3" fill="#FFFFFF" />
              </g>
            )}

            {/* Cute Little Nose */}
            <ellipse cx="80" cy="69" rx="1.8" ry="1.2" fill="#F43F5E" opacity="0.5" />

            {/* Mouth */}
            {currentExpr === 'laugh' ? (
              <path
                d="M 73 74 Q 80 86 87 74 Z"
                fill="#E11D48"
                stroke="#1E293B"
                strokeWidth="1.4"
              />
            ) : currentExpr === 'happy' ? (
              <path
                d="M 74 74 Q 80 82 86 74"
                stroke="#1E293B"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            ) : currentExpr === 'surprised' ? (
              <ellipse
                cx="80"
                cy="76"
                rx="3.8"
                ry="4.8"
                fill="#E11D48"
                stroke="#1E293B"
                strokeWidth="1.4"
              />
            ) : (
              <path
                d="M 75 75 Q 80 80 85 75"
                stroke="#1E293B"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Flower Brooch on Hijab */}
            <g transform="translate(108, 48) scale(0.85)">
              <circle cx="0" cy="0" r="4" fill="#FDE047" />
              <circle cx="-3" cy="-3" r="3" fill="#FFFFFF" opacity="0.9" />
              <circle cx="3" cy="-3" r="3" fill="#FFFFFF" opacity="0.9" />
              <circle cx="-3" cy="3" r="3" fill="#FFFFFF" opacity="0.9" />
              <circle cx="3" cy="3" r="3" fill="#FFFFFF" opacity="0.9" />
            </g>
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};
