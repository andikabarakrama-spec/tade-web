import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MASTER_MASCOT_REGISTRY, AIAsyCharacterState } from './AIAsyCharacterAssetRegistry';

export interface MasterMascotRendererProps {
  character: 'ASY' | 'SYIFA';
  state?: AIAsyCharacterState;
  scale?: number;
  className?: string;
  onClick?: () => void;
  gazeX?: number; // -1 to 1 for subtle parallax
  gazeY?: number; // -1 to 1 for subtle parallax
  speechBubbleText?: string | null;
  interactive?: boolean;
}

// Module-level cache for processed transparent data URLs
const TRANSPARENT_ASSET_CACHE: Record<string, string> = {};

/**
 * Presentation Layer White Background Removal Engine
 * Uses edge-based flood fill to convert outer white background and studio floor highlights
 * into clean transparent PNG data URLs, while keeping character uniform, face & details 100% intact.
 */
function processMascotBackground(src: string): Promise<string> {
  if (TRANSPARENT_ASSET_CACHE[src]) {
    return Promise.resolve(TRANSPARENT_ASSET_CACHE[src]);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        const visited = new Uint8Array(w * h);
        const queue: number[] = [];

        // Color difference helper from pure white (255,255,255)
        const isLightPixel = (idx: number) => {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          // Light background criteria (near-white studio backdrop)
          return r > 230 && g > 230 && b > 230;
        };

        // Seedqueue from all 4 image border edges
        for (let x = 0; x < w; x++) {
          let idx = (0 * w + x) * 4;
          if (isLightPixel(idx)) { queue.push(x, 0); visited[0 * w + x] = 1; }
          idx = ((h - 1) * w + x) * 4;
          if (isLightPixel(idx)) { queue.push(x, h - 1); visited[(h - 1) * w + x] = 1; }
        }
        for (let y = 0; y < h; y++) {
          let idx = (y * w + 0) * 4;
          if (!visited[y * w + 0] && isLightPixel(idx)) { queue.push(0, y); visited[y * w + 0] = 1; }
          idx = (y * w + (w - 1)) * 4;
          if (!visited[(h - 1) * w + (w - 1)] && isLightPixel(idx)) { queue.push(w - 1, y); visited[(h - 1) * w + (w - 1)] = 1; }
        }

        // BFS flood fill outwards from image edges
        let head = 0;
        while (head < queue.length) {
          const cx = queue[head++];
          const cy = queue[head++];
          const cIdx = (cy * w + cx) * 4;

          const r = data[cIdx];
          const g = data[cIdx + 1];
          const b = data[cIdx + 2];

          // Check if studio floor shadow vs pure white backdrop
          if (r > 248 && g > 248 && b > 248) {
            data[cIdx + 3] = 0; // Pure background -> 100% transparent
          } else if (r > 210 && g > 210 && b > 210) {
            // Soft studio shadow blending
            const brightness = Math.max(r, g, b);
            const alpha = Math.round((255 - brightness) * 2.8);
            data[cIdx] = 15;
            data[cIdx + 1] = 25;
            data[cIdx + 2] = 20;
            data[cIdx + 3] = Math.min(160, Math.max(0, alpha));
          } else {
            data[cIdx + 3] = 0;
          }

          // 4-neighbor expansion
          const neighbors = [
            [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
          ];

          for (let i = 0; i < neighbors.length; i++) {
            const nx = neighbors[i][0];
            const ny = neighbors[i][1];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const vIdx = ny * w + nx;
              if (!visited[vIdx]) {
                visited[vIdx] = 1;
                const nIdx = vIdx * 4;
                const nr = data[nIdx];
                const ng = data[nIdx + 1];
                const nb = data[nIdx + 2];
                if (nr > 220 && ng > 220 && nb > 220) {
                  queue.push(nx, ny);
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        TRANSPARENT_ASSET_CACHE[src] = dataUrl;
        resolve(dataUrl);
      } catch (err) {
        console.warn("Mascot background removal fallback triggered:", err);
        resolve(src);
      }
    };

    img.onerror = () => {
      resolve(src);
    };
  });
}

export const MasterMascotRenderer: React.FC<MasterMascotRendererProps> = ({
  character = 'ASY',
  state = 'idle',
  scale = 1.0,
  className = '',
  onClick,
  gazeX = 0,
  gazeY = 0,
  speechBubbleText,
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const key = character === 'ASY' ? 'ASY' : 'SYIFA';
  const mascotDef = MASTER_MASCOT_REGISTRY[key];

  // Primary image asset path from registry
  const masterAssetPath = key === 'ASY'
    ? '/assets/mascot/asy/ASY_MASTER.png'
    : '/assets/mascot/syifa/SYIFA_MASTER.png';

  // Fallback SVG asset if needed
  const fallbackSvgPath = key === 'ASY'
    ? '/assets/mascot/asy/ASY_MASTER.svg'
    : '/assets/mascot/syifa/SYIFA_MASTER.svg';

  const [imgSrc, setImgSrc] = useState(masterAssetPath);
  const [isMascotReady, setIsMascotReady] = useState(false);

  // Apply presentation layer transparent background processing
  useEffect(() => {
    let isMounted = true;
    setIsMascotReady(false);
    processMascotBackground(masterAssetPath).then((processedUrl) => {
      if (isMounted) {
        setImgSrc(processedUrl);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [masterAssetPath]);

  // Parallax calculations - subtle & smooth
  const parallaxX = gazeX * 6;
  const parallaxY = gazeY * 4;

  // Reaction dynamics based on state
  const isCelebrating = state === 'celebrate';

  // Eye blinking state logic
  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4200);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ transform: `scale(${scale})` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : -1}
      aria-label={mascotDef.accessibilitySettings.ariaLabel}
    >
      {/* Speech Bubble Overlay */}
      {speechBubbleText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`absolute -top-16 z-40 px-4 py-2.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-black border-2 backdrop-blur-md max-w-[240px] text-center pointer-events-none ${
            character === 'ASY'
              ? 'bg-amber-400/95 text-slate-900 border-amber-200 shadow-amber-500/20'
              : 'bg-pink-400/95 text-slate-900 border-pink-200 shadow-pink-500/20'
          }`}
        >
          {speechBubbleText}
          {/* Bubble Tail */}
          <div
            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 rotate-45 ${
              character === 'ASY'
                ? 'bg-amber-400 border-r-2 border-b-2 border-amber-200'
                : 'bg-pink-400 border-r-2 border-b-2 border-pink-200'
            }`}
          />
        </motion.div>
      )}

      {/* Main 3D Master Character Canvas & Parallax Wrapper */}
      <motion.div
        className="relative flex flex-col items-center"
        animate={{
          x: parallaxX,
          y: isCelebrating
            ? [0, -18, 0]
            : character === 'ASY'
            ? [0, -6, 0]
            : [0, -4, 0],
          rotate: isCelebrating
            ? [0, 4, -4, 0]
            : character === 'ASY'
            ? [0, 1.5, -1.5, 0]
            : [0, 1, -1, 0],
        }}
        transition={{
          y: {
            duration: isCelebrating ? 0.6 : character === 'ASY' ? 3.0 : 3.8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          rotate: {
            duration: isCelebrating ? 0.8 : character === 'ASY' ? 3.5 : 4.2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
      >
        {/* Soft Ambient Character Glow */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-50 scale-110' : 'opacity-20 scale-95'
          } ${character === 'ASY' ? 'bg-amber-300' : 'bg-pink-300'}`}
        />

        {/* The Official Master 3D Image Asset */}
        <div className="relative">
          <motion.img
            src={imgSrc}
            onLoad={() => setIsMascotReady(true)}
            onError={() => {
              setImgSrc(fallbackSvgPath);
              setIsMascotReady(true);
            }}
            alt={mascotDef.accessibilitySettings.ariaLabel}
            className={`relative z-10 max-h-[380px] w-auto object-contain transition-all duration-300 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] ${
              isHovered ? 'brightness-105 scale-[1.03]' : ''
            }`}
            style={{
              transform: isBlinking ? 'scaleY(0.97)' : 'none',
              opacity: isMascotReady ? 1 : 0,
            }}
            draggable={false}
          />
        </div>

        {/* Natural Ground Contact Shadow on the Garden Floor */}
        <div className="w-2/3 h-5 mt-[-16px] bg-emerald-950/40 rounded-full blur-md transform scale-y-50 z-0 transition-all duration-300" />
      </motion.div>
    </div>
  );
};

