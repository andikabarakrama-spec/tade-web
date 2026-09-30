import React, { useState, useEffect } from 'react';
import { 
  MovementStyle, OfficialExpression, asySyifaDnaEngine, 
  MOVEMENT_PRESETS 
} from '../../services/asySyifaDnaEngine';

export type CharacterType = 'ASY' | 'SYIFA' | 'BUBU' | 'GOGO' | 'MIMI' | 'DODO' | 'TITI' | 'RARA';

export type MascotExpression = 
  | OfficialExpression 
  | 'HAPPY' 
  | 'WINK' 
  | 'TALKING' 
  | 'WAVING' 
  | 'SURPRISED';

interface CartoonCharacterSvgProps {
  type?: CharacterType;
  character?: CharacterType | string;
  size?: number;
  className?: string;
  isAnimated?: boolean;
  movement?: MovementStyle;
  movementStyle?: MovementStyle | string;
  expression?: MascotExpression;
  enableMicroEmotions?: boolean;
}

export const CartoonCharacterSvg: React.FC<CartoonCharacterSvgProps> = ({
  type,
  character,
  size = 120,
  className = '',
  isAnimated = true,
  movement,
  movementStyle,
  expression = 'SENYUM',
  enableMicroEmotions = true
}) => {
  const resolvedType = (type || character || 'ASY') as CharacterType;
  const resolvedMovement = (movement || movementStyle) as MovementStyle | undefined;
  const [isBlinking, setIsBlinking] = useState(false);

  // Micro-emotion: Natural eye blinking cycle (~4-5s)
  useEffect(() => {
    if (!enableMicroEmotions) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4500);
    return () => clearInterval(interval);
  }, [enableMicroEmotions]);

  // Determine movement class
  let motionClass = '';
  if (resolvedMovement && (resolvedMovement as any) !== 'DIAM') {
    const found = MOVEMENT_PRESETS.find(m => m.id === resolvedMovement);
    motionClass = found ? found.cssClass : 'animate-dna-langkah-kecil';
  } else if (isAnimated) {
    motionClass = 'transition-transform duration-300 hover:scale-105 animate-dna-breathing';
  }

  // Normalize expression to standard
  const exp: OfficialExpression = 
    expression === 'HAPPY' ? 'SENYUM' :
    expression === 'SURPRISED' ? 'KAGET' :
    expression === 'WINK' ? 'SENYUM' :
    expression === 'TALKING' ? 'TERTAWA' :
    expression === 'WAVING' ? 'SENYUM' :
    (expression as OfficialExpression);

  // Helper for rendering eye with blinking & expression
  const renderEyes = (cx1: number, cy1: number, cx2: number, cy2: number, r: number = 3.5) => {
    if (isBlinking) {
      return (
        <>
          <path d={`M${cx1 - r} ${cy1} Q${cx1} ${cy1 + 2} ${cx1 + r} ${cy1}`} stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
          <path d={`M${cx2 - r} ${cy2} Q${cx2} ${cy2 + 2} ${cx2 + r} ${cy2}`} stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    }

    if (exp === 'KAGET') {
      return (
        <>
          <circle cx={cx1} cy={cy1} r={r * 1.3} fill="#0F172A" />
          <circle cx={cx1 + 1} cy={cy1 - 1} r={r * 0.5} fill="#FFFFFF" />
          <circle cx={cx2} cy={cy2} r={r * 1.3} fill="#0F172A" />
          <circle cx={cx2 + 1} cy={cy2 - 1} r={r * 0.5} fill="#FFFFFF" />
        </>
      );
    }

    if (exp === 'BERPIKIR') {
      return (
        <>
          {/* Eyes looking up-right */}
          <circle cx={cx1} cy={cy1} r={r} fill="#0F172A" />
          <circle cx={cx1 + 1.2} cy={cy1 - 1.5} r={r * 0.4} fill="#FFFFFF" />
          <circle cx={cx2} cy={cy2} r={r} fill="#0F172A" />
          <circle cx={cx2 + 1.2} cy={cy2 - 1.5} r={r * 0.4} fill="#FFFFFF" />
        </>
      );
    }

    if (exp === 'BANGGA' || expression === 'WINK') {
      return (
        <>
          <path d={`M${cx1 - r} ${cy1} Q${cx1} ${cy1 - 3} ${cx1 + r} ${cy1}`} stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={cx2} cy={cy2} r={r} fill="#0F172A" />
          <circle cx={cx2 + 1.2} cy={cy2 - 1.2} r={r * 0.4} fill="#FFFFFF" />
        </>
      );
    }

    if (exp === 'TERIMA_KASIH') {
      return (
        <>
          {/* Peaceful closed curved eyes */}
          <path d={`M${cx1 - r} ${cy1} Q${cx1} ${cy1 - 3} ${cx1 + r} ${cy1}`} stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d={`M${cx2 - r} ${cy2} Q${cx2} ${cy2 - 3} ${cx2 + r} ${cy2}`} stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }

    // Default: SENYUM / TERTAWA
    return (
      <>
        <circle cx={cx1} cy={cy1} r={r} fill="#0F172A" />
        <circle cx={cx1 + 1.2} cy={cy1 - 1.2} r={r * 0.4} fill="#FFFFFF" />
        <circle cx={cx2} cy={cy2} r={r} fill="#0F172A" />
        <circle cx={cx2 + 1.2} cy={cy2 - 1.2} r={r * 0.4} fill="#FFFFFF" />
      </>
    );
  };

  // Helper for mouth expression
  const renderMouth = (cx: number, cy: number, width: number = 12) => {
    const hw = width / 2;
    if (exp === 'TERTAWA') {
      return (
        <path
          d={`M${cx - hw} ${cy} Q${cx} ${cy + 9} ${cx + hw} ${cy} Z`}
          fill="#EF4444"
          stroke="#B91C1C"
          strokeWidth="1.8"
        />
      );
    }

    if (exp === 'KAGET') {
      return (
        <ellipse cx={cx} cy={cy + 3} rx={hw * 0.5} ry={4} fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
      );
    }

    if (exp === 'BERPIKIR') {
      return (
        <path d={`M${cx - hw * 0.6} ${cy + 1} Q${cx} ${cy - 1} ${cx + hw * 0.8} ${cy + 2}`} stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
      );
    }

    if (exp === 'BANGGA' || exp === 'TERIMA_KASIH') {
      return (
        <path d={`M${cx - hw} ${cy} Q${cx} ${cy + 6} ${cx + hw} ${cy}`} stroke="#B91C1C" strokeWidth="2.2" strokeLinecap="round" fill="#FCA5A5" />
      );
    }

    // Standard SENYUM
    return (
      <path d={`M${cx - hw} ${cy} Q${cx} ${cy + 7} ${cx + hw} ${cy}`} stroke="#B91C1C" strokeWidth="2.2" strokeLinecap="round" fill="#EF4444" />
    );
  };

  const blushOpacity = enableMicroEmotions ? 0.65 : 0.45;

  switch (resolvedType) {
    case 'ASY':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${motionClass} ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="30" ry="6" fill="#000000" fillOpacity="0.12" />
          
          {/* Body / Baju Koko Hijau Zamrud */}
          <path d="M30 65 L24 88 C24 88 50 90 76 88 L70 65 Z" fill="#059669" />
          <path d="M47 65 L47 86" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="72" r="1.5" fill="#FEF08A" />
          <circle cx="50" cy="78" r="1.5" fill="#FEF08A" />
          
          {/* Hands */}
          {exp === 'TERIMA_KASIH' ? (
            <>
              {/* Hand over heart */}
              <circle cx="50" cy="70" r="5" fill="#FED7AA" />
              <circle cx="23" cy="74" r="5" fill="#FED7AA" />
            </>
          ) : (
            <>
              <circle cx="23" cy="74" r="5" fill="#FED7AA" />
              <circle cx="77" cy="74" r="5" fill="#FED7AA" />
            </>
          )}

          {/* Head & Neck */}
          <rect x="44" y="58" width="12" height="10" rx="3" fill="#FDBA74" />
          <ellipse cx="50" cy="46" rx="24" ry="22" fill="#FED7AA" />

          {/* Ears */}
          <circle cx="26" cy="46" r="4.5" fill="#FDBA74" />
          <circle cx="74" cy="46" r="4.5" fill="#FDBA74" />

          {/* Hair fringe */}
          <path d="M34 32 Q50 36 66 32 Q60 38 50 37 Q40 38 34 32 Z" fill="#1E293B" />

          {/* Peci Hijau Emas Asy */}
          <path d="M29 32 C29 20 71 20 71 32 Z" fill="#047857" />
          <path d="M28 32 C28 30 72 30 72 32 C72 34 28 34 28 32 Z" fill="#F59E0B" />
          <circle cx="50" cy="22" r="2" fill="#FDE047" />

          {/* Eyes */}
          {renderEyes(42, 45, 58, 45, 3.5)}

          {/* Eyebrows */}
          {exp === 'KAGET' ? (
            <>
              <path d="M38 36 Q42 33 46 36" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M54 36 Q58 33 62 36" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : exp === 'BERPIKIR' ? (
            <>
              <path d="M38 38 Q42 38 46 36" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M54 36 Q58 38 62 38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M38 39 Q42 37 46 39" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M54 39 Q58 37 62 39" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {/* Cheeks (Micro-emotion blushing) */}
          <ellipse cx="36" cy="51" rx="4" ry="2.5" fill="#F87171" fillOpacity={blushOpacity} />
          <ellipse cx="64" cy="51" rx="4" ry="2.5" fill="#F87171" fillOpacity={blushOpacity} />

          {/* Mouth */}
          {renderMouth(50, 53, 12)}
        </svg>
      );

    case 'SYIFA':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${motionClass} ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="28" ry="6" fill="#000000" fillOpacity="0.12" />

          {/* Dress Kuning Emas Syifa */}
          <path d="M26 66 L20 89 C20 89 50 91 80 89 L74 66 Z" fill="#F59E0B" />
          <path d="M30 84 C40 86 60 86 70 84" stroke="#FEF08A" strokeWidth="2" />

          {/* Hijab Kuning Lembut */}
          <path d="M25 45 C25 20 75 20 75 45 C75 66 68 76 50 76 C32 76 25 66 25 45 Z" fill="#FBBF24" />
          <path d="M25 45 C25 65 35 78 50 78 C65 78 75 65 75 45" stroke="#D97706" strokeWidth="2" />

          {/* Inner Face Aperture */}
          <ellipse cx="50" cy="46" rx="16" ry="18" fill="#FED7AA" />

          {/* Hijab Floral Pin */}
          <circle cx="34" cy="32" r="4" fill="#EC4899" />
          <circle cx="34" cy="32" r="1.5" fill="#FEF08A" />

          {/* Eyes */}
          {renderEyes(43, 45, 57, 45, 3.5)}

          {/* Cheeks */}
          <ellipse cx="38" cy="51" rx="4" ry="2.5" fill="#FB7185" fillOpacity={blushOpacity} />
          <ellipse cx="62" cy="51" rx="4" ry="2.5" fill="#FB7185" fillOpacity={blushOpacity} />

          {/* Mouth */}
          {renderMouth(50, 53, 11)}
        </svg>
      );

    case 'BUBU':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${motionClass} ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="26" ry="5" fill="#000000" fillOpacity="0.12" />

          {/* Ears */}
          <path d="M38 40 C34 15 44 8 46 40 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M40 36 C37 18 43 14 44 36 Z" fill="#FCA5A5" />
          
          <path d="M62 40 C66 15 56 8 54 40 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M60 36 C63 18 57 14 56 36 Z" fill="#FCA5A5" />

          {/* Body */}
          <ellipse cx="50" cy="74" rx="22" ry="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <ellipse cx="50" cy="76" rx="14" ry="12" fill="#F8FAFC" />

          {/* Head */}
          <circle cx="50" cy="50" r="22" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

          {/* Eyes */}
          {renderEyes(42, 48, 58, 48, 3.5)}

          {/* Nose & Mouth */}
          <path d="M47 54 L53 54 L50 57 Z" fill="#F43F5E" />
          <path d="M50 57 L50 60 Q46 62 44 60" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M50 60 Q54 62 56 60" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="30" y1="52" x2="38" y2="53" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="57" x2="38" y2="56" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="52" x2="62" y2="53" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="57" x2="62" y2="56" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

          {/* Cheeks */}
          <circle cx="36" cy="54" r="3.5" fill="#FDA4AF" fillOpacity={blushOpacity} />
          <circle cx="64" cy="54" r="3.5" fill="#FDA4AF" fillOpacity={blushOpacity} />

          {/* Holding Carrot */}
          <path d="M46 72 L62 82 L65 78 Z" fill="#F97316" />
          <path d="M43 70 Q41 68 45 68" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'GOGO':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${motionClass} ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="32" ry="6" fill="#000000" fillOpacity="0.12" />

          {/* Big Friendly Ears */}
          <ellipse cx="26" cy="46" rx="16" ry="20" fill="#93C5FD" stroke="#60A5FA" strokeWidth="2" />
          <ellipse cx="26" cy="46" rx="10" ry="14" fill="#DBEAFE" />
          <ellipse cx="74" cy="46" rx="16" ry="20" fill="#93C5FD" stroke="#60A5FA" strokeWidth="2" />
          <ellipse cx="74" cy="46" rx="10" ry="14" fill="#DBEAFE" />

          {/* Body */}
          <ellipse cx="50" cy="74" rx="26" ry="18" fill="#93C5FD" stroke="#60A5FA" strokeWidth="2" />
          <ellipse cx="50" cy="76" rx="16" ry="12" fill="#BFDBFE" />

          {/* Head */}
          <circle cx="50" cy="46" r="22" fill="#93C5FD" stroke="#60A5FA" strokeWidth="2" />

          {/* Cute Little Hat */}
          <path d="M42 26 L58 26 L50 18 Z" fill="#F59E0B" />
          <circle cx="50" cy="17" r="2" fill="#EF4444" />

          {/* Eyes */}
          {renderEyes(42, 42, 58, 42, 3.5)}

          {/* Cheeks */}
          <circle cx="36" cy="48" r="3.5" fill="#F472B6" fillOpacity={blushOpacity} />
          <circle cx="64" cy="48" r="3.5" fill="#F472B6" fillOpacity={blushOpacity} />

          {/* Elephant Trunk with gentle curve */}
          <path d="M48 48 C48 64 56 68 62 60" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" />
          <path d="M48 48 C48 64 56 68 62 60" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />

          {/* Water droplets from trunk */}
          <circle cx="67" cy="54" r="2" fill="#38BDF8" />
          <circle cx="72" cy="49" r="1.5" fill="#38BDF8" />
        </svg>
      );

    case 'MIMI':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${motionClass} ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="90" rx="20" ry="4" fill="#000000" fillOpacity="0.12" />

          {/* Wings */}
          <ellipse cx="36" cy="38" rx="14" ry="9" fill="#E0F2FE" fillOpacity="0.85" stroke="#7DD3FC" strokeWidth="1.5" transform="rotate(-20 36 38)" />
          <ellipse cx="64" cy="38" rx="14" ry="9" fill="#E0F2FE" fillOpacity="0.85" stroke="#7DD3FC" strokeWidth="1.5" transform="rotate(20 64 38)" />

          {/* Antennae */}
          <path d="M45 36 Q40 24 36 26" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="35" cy="26" r="2.5" fill="#F59E0B" />
          <path d="M55 36 Q60 24 64 26" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="65" cy="26" r="2.5" fill="#F59E0B" />

          {/* Bee Body */}
          <ellipse cx="50" cy="56" rx="22" ry="20" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          
          {/* Stripes */}
          <path d="M32 50 C44 54 56 54 68 50" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M34 60 C44 64 56 64 66 60" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />

          {/* Stinger */}
          <path d="M48 76 L52 76 L50 82 Z" fill="#1E293B" />

          {/* Eyes */}
          {renderEyes(43, 44, 57, 44, 3.5)}

          {/* Cheeks */}
          <circle cx="37" cy="48" r="3" fill="#FB7185" fillOpacity={blushOpacity} />
          <circle cx="63" cy="48" r="3" fill="#FB7185" fillOpacity={blushOpacity} />

          {/* Smile */}
          {renderMouth(50, 49, 9)}
        </svg>
      );

    case 'DODO':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${motionClass} ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="25" ry="5" fill="#000000" fillOpacity="0.12" />

          {/* Duck Body */}
          <ellipse cx="50" cy="68" rx="24" ry="18" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <path d="M28 66 Q20 60 26 54 Q32 60 30 68 Z" fill="#FACC15" />

          {/* Head */}
          <circle cx="54" cy="42" r="18" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />

          {/* Eyes */}
          {renderEyes(49, 38, 62, 38, 3.5)}

          {/* Cute Orange Beak */}
          <path d="M50 44 Q56 42 66 44 Q56 50 50 44 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />

          {/* Cheeks */}
          <circle cx="44" cy="44" r="3" fill="#F87171" fillOpacity={blushOpacity} />
          <circle cx="66" cy="44" r="3" fill="#F87171" fillOpacity={blushOpacity} />

          {/* Small Sailor Cap */}
          <ellipse cx="54" cy="25" rx="8" ry="3" fill="#38BDF8" />
          <path d="M50 25 C50 18 58 18 58 25 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
        </svg>
      );

    case 'TITI':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${motionClass} ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="28" ry="5" fill="#000000" fillOpacity="0.12" />

          {/* Turtle Shell */}
          <ellipse cx="50" cy="62" rx="26" ry="20" fill="#16A34A" stroke="#15803D" strokeWidth="2.5" />
          <ellipse cx="50" cy="60" rx="20" ry="14" fill="#22C55E" />
          
          {/* Shell Geometric Patterns */}
          <polygon points="50,50 42,58 45,68 55,68 58,58" fill="#15803D" />
          <polygon points="50,52 44,58 47,66 53,66 56,58" fill="#4ADE80" />

          {/* Legs & Tail */}
          <circle cx="28" cy="74" r="6" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.5" />
          <circle cx="72" cy="74" r="6" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.5" />
          <path d="M22 62 L16 62 L20 66 Z" fill="#86EFAC" />

          {/* Head */}
          <circle cx="74" cy="48" r="11" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />

          {/* Eyes */}
          {renderEyes(74, 46, 78, 46, 2.5)}

          {/* Cheeks & Smile */}
          <circle cx="72" cy="50" r="2" fill="#F472B6" fillOpacity={blushOpacity} />
          {renderMouth(76, 52, 6)}
        </svg>
      );

    case 'RARA':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${motionClass} ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="20" ry="4" fill="#000000" fillOpacity="0.12" />

          {/* Bird Body */}
          <ellipse cx="50" cy="62" rx="20" ry="18" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <ellipse cx="50" cy="66" rx="12" ry="10" fill="#BAE6FD" />

          {/* Wing */}
          <path d="M34 58 Q42 54 48 64 Q38 72 34 58 Z" fill="#0284C7" />

          {/* Head & Crest */}
          <circle cx="56" cy="40" r="16" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <path d="M58 24 Q62 18 64 24" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

          {/* Beak */}
          <path d="M68 40 L78 43 L68 46 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />

          {/* Eye */}
          {renderEyes(56, 38, 62, 38, 3.2)}

          {/* Cheeks */}
          <circle cx="52" cy="44" r="2.5" fill="#FB7185" fillOpacity={blushOpacity} />

          {/* Music Note Icon */}
          <path d="M26 30 L32 26 L32 38 M26 30 L26 42" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="42" r="2.5" fill="#F59E0B" />
          <circle cx="30" cy="38" r="2.5" fill="#F59E0B" />
        </svg>
      );

    default:
      return null;
  }
};
