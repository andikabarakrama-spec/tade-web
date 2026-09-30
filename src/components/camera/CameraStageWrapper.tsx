import React, { useState, useEffect } from 'react';
import { 
  magicCameraEngine, 
  CameraMotion, 
  SceneEntrance, 
  SceneExit 
} from '../../services/magicCameraEngine';
import { CartoonCharacterSvg, CharacterType } from '../mascot/CartoonCharacterSvg';
import { Sparkles, Heart, Star, PartyPopper } from 'lucide-react';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface CameraStageWrapperProps {
  children: React.ReactNode;
  motion?: CameraMotion;
  entrance?: SceneEntrance;
  exit?: SceneExit;
  isExiting?: boolean;
  activeSpeaker?: CharacterType | null;
  activeSpeakerRole?: CharacterType | null | string;
  speechText?: string;
  stageName?: string;
  className?: string;
  onEntranceComplete?: () => void;
  onExitComplete?: () => void;
}

export const CameraStageWrapper: React.FC<CameraStageWrapperProps> = ({
  children,
  motion: propMotion,
  entrance: propEntrance,
  exit: propExit,
  isExiting = false,
  activeSpeaker = null,
  speechText,
  stageName = 'Panggung Cerita',
  className = '',
  onEntranceComplete,
  onExitComplete
}) => {
  const [cfg, setCfg] = useState(magicCameraEngine.getConfig());
  const [isEntranceActive, setIsEntranceActive] = useState<boolean>(true);
  const [entranceProgress, setEntranceProgress] = useState<number>(0);

  const activeMotion: CameraMotion = propMotion || (activeSpeaker ? (activeSpeaker === 'ASY' ? 'FOKUS_ASY' : activeSpeaker === 'SYIFA' ? 'FOKUS_SYIFA' : 'FOKUS_TENGAH') : cfg.defaultMotion);
  const activeEntrance: SceneEntrance = propEntrance || cfg.defaultEntrance;
  const activeExit: SceneExit = propExit || cfg.defaultExit;

  // Subscribe to central camera settings
  useEffect(() => {
    return magicCameraEngine.subscribe(setCfg);
  }, []);

  // Handle Entrance Transition on Mount / Scene start
  useEffect(() => {
    setIsEntranceActive(true);
    setEntranceProgress(0);

    magicCameraEngine.recordSceneStarted(stageName, 'CAMERA_WRAPPER', activeMotion, activeEntrance);

    const startTime = Date.now();
    const duration = 1200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setEntranceProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        setIsEntranceActive(false);
        if (onEntranceComplete) onEntranceComplete();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [activeEntrance, stageName]);

  // Handle Exit Transition
  useEffect(() => {
    if (isExiting) {
      magicCameraEngine.recordSceneCompleted(stageName, 'CAMERA_WRAPPER', activeExit);
      const timer = setTimeout(() => {
        if (onExitComplete) onExitComplete();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isExiting, activeExit, stageName, onExitComplete]);

  // Derive CSS Transform style based on motion
  const getCameraTransformClass = (): string => {
    switch (activeMotion) {
      case 'MENDEKAT':
        return 'scale-[1.05] translate-y-[-1%]';
      case 'MENJAUH':
        return 'scale-[0.98] translate-y-[1%]';
      case 'GESER_PELAN':
        return 'scale-[1.03] -translate-x-[2.5%]';
      case 'NAIK_TURUN':
        return 'scale-[1.02] -translate-y-[2%]';
      case 'FOKUS_ASY':
        return 'scale-[1.07] -translate-x-[3%] -translate-y-[2%]';
      case 'FOKUS_SYIFA':
        return 'scale-[1.07] translate-x-[3%] -translate-y-[2%]';
      case 'FOKUS_TENGAH':
        return 'scale-[1.06] -translate-y-[1.5%]';
      case 'DIAM':
      default:
        return 'scale-100 translate-x-0 translate-y-0';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl select-none ${className}`}>
      
      {/* 60 FPS GPU-Accelerated Camera Viewport Layer */}
      <div 
        className={`w-full h-full transform transition-all ease-out ${getCameraTransformClass()}`}
        style={{
          transitionDuration: cfg.cinematicSpeed === 'LEMBUT' ? '2800ms' : cfg.cinematicSpeed === 'RINGKAS' ? '1200ms' : '2000ms',
          willChange: 'transform'
        }}
      >
        {children}
      </div>

      {/* P4: Dynamic Character Spotlight Overlay when Speaker is Active */}
      {cfg.spotlightEnabled && activeSpeaker && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-end justify-between p-6">
          {/* Subtle Ambient Vignette focusing on Speaker */}
          <div className={`absolute inset-0 transition-opacity duration-700 bg-radial from-transparent via-slate-900/10 to-slate-950/40 pointer-events-none`} />

          {/* Active Speaker Speech Bubble */}
          {speechText && cfg.speechBubbleAnimation && (
            <div className={`relative z-30 max-w-sm sm:max-w-md p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-amber-400 animate-bounce duration-500 mb-4 ${
              activeSpeaker === 'ASY' ? 'self-start ml-4' : 'self-end mr-4'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{activeSpeaker === 'ASY' ? 'Dek Asy Berkata:' : activeSpeaker === 'SYIFA' ? 'Mbak Syifa Berkata:' : 'Sahabat Ceria:'}</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 leading-snug font-serif">
                "{speechText}"
              </p>
              {/* Bubble Tail */}
              <div className={`absolute -bottom-2.5 w-4 h-4 bg-white border-b-2 border-r-2 border-amber-400 transform rotate-45 ${
                activeSpeaker === 'ASY' ? 'left-6' : 'right-6'
              }`} />
            </div>
          )}
        </div>
      )}

      {/* P2: ENTRANCE TRANSITIONS (Daun Membuka, Awan Bergeser, Tirai, Pelangi) */}
      {isEntranceActive && (
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          
          {/* 1. DAUN MEMBUKA */}
          {activeEntrance === 'DAUN_MEMBUKA' && (
            <div className="relative w-full h-full flex">
              <div 
                className="w-1/2 h-full bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600 transition-transform duration-1000 ease-out flex items-center justify-end pr-4"
                style={{ transform: `translateX(-${entranceProgress * 100}%)` }}
              >
                <span className="text-5xl opacity-80 animate-pulse">🌿</span>
              </div>
              <div 
                className="w-1/2 h-full bg-gradient-to-l from-emerald-800 via-teal-700 to-emerald-600 transition-transform duration-1000 ease-out flex items-center justify-start pl-4"
                style={{ transform: `translateX(${entranceProgress * 100}%)` }}
              >
                <span className="text-5xl opacity-80 animate-pulse">🍃</span>
              </div>
            </div>
          )}

          {/* 2. AWAN BERGESER */}
          {activeEntrance === 'AWAN_BERGESER' && (
            <div className="relative w-full h-full flex items-center">
              <div 
                className="w-1/2 h-full bg-gradient-to-r from-sky-400 via-sky-200 to-white transition-transform duration-1000 ease-out flex items-center justify-end pr-6 shadow-2xl"
                style={{ transform: `translateX(-${entranceProgress * 100}%)` }}
              >
                <span className="text-6xl filter drop-shadow-md">☁️</span>
              </div>
              <div 
                className="w-1/2 h-full bg-gradient-to-l from-sky-400 via-sky-200 to-white transition-transform duration-1000 ease-out flex items-center justify-start pl-6 shadow-2xl"
                style={{ transform: `translateX(${entranceProgress * 100}%)` }}
              >
                <span className="text-6xl filter drop-shadow-md">🌤️</span>
              </div>
            </div>
          )}

          {/* 3. TIRAI TERBUKA */}
          {activeEntrance === 'TIRAI_TERBUKA' && (
            <div className="relative w-full h-full flex">
              <div 
                className="w-1/2 h-full bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-500 border-r-4 border-amber-300 transition-transform duration-1000 ease-out shadow-2xl flex items-center justify-end pr-8"
                style={{ transform: `translateX(-${entranceProgress * 100}%)` }}
              >
                <div className="text-amber-200 font-serif font-black text-xl tracking-widest uppercase rotate-90">ASY</div>
              </div>
              <div 
                className="w-1/2 h-full bg-gradient-to-l from-amber-700 via-amber-600 to-yellow-500 border-l-4 border-amber-300 transition-transform duration-1000 ease-out shadow-2xl flex items-center justify-start pl-8"
                style={{ transform: `translateX(${entranceProgress * 100}%)` }}
              >
                <div className="text-amber-200 font-serif font-black text-xl tracking-widest uppercase -rotate-90">SYIFA</div>
              </div>
            </div>
          )}

          {/* 4. PELANGI MUNCUL */}
          {activeEntrance === 'PELANGI_MUNCUL' && (
            <div 
              className="w-full h-full bg-gradient-to-b from-sky-500/20 via-transparent to-emerald-500/20 flex flex-col items-center justify-center transition-opacity duration-1000"
              style={{ opacity: 1 - entranceProgress }}
            >
              <div 
                className="w-64 h-32 rounded-t-full border-t-8 border-r-8 border-l-8 border-amber-400 bg-gradient-to-b from-rose-400/40 via-yellow-300/40 to-emerald-400/40 transform transition-transform duration-1000 shadow-2xl flex items-center justify-center"
                style={{ transform: `scale(${1 + entranceProgress * 0.8})` }}
              >
                <span className="text-3xl animate-bounce">🌈</span>
              </div>
            </div>
          )}

          {/* 5. FADE LEMBUT */}
          {activeEntrance === 'FADE_LEMBUT' && (
            <div 
              className="w-full h-full bg-slate-900 transition-opacity duration-800"
              style={{ opacity: 1 - entranceProgress }}
            />
          )}

        </div>
      )}

      {/* P3: EXIT TRANSITIONS (Bintang Kecil, Confetti Lembut, Lambaian Asy & Syifa) */}
      {isExiting && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 animate-fade-in">
          
          {activeExit === 'BINTANG_KECIL' && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-3 text-4xl animate-bounce">
                <span className="text-amber-400">✨</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-amber-300">🌟</span>
                <span className="text-cyan-300">✨</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-amber-300">Alhamdulillah!</h3>
              <p className="text-xs text-slate-300">Kisah hari ini berkilau penuh kebaikan.</p>
            </div>
          )}

          {activeExit === 'CONFETTI_LEMBUT' && (
            <div className="flex flex-col items-center gap-3">
              <PartyPopper className="w-12 h-12 text-amber-400 animate-pulse" />
              <div className="flex gap-2 text-2xl">
                <span>🎊</span>
                <span>🎉</span>
                <span>🎈</span>
                <span>🌸</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-white">Hebat & Barakallah!</h3>
              <p className="text-xs text-slate-300">Semoga menjadi bekal ilmu yang berkah.</p>
            </div>
          )}

          {activeExit === 'LAMBAIAN_ASY_SYIFA' && (
            <div className="flex flex-col items-center gap-4 bg-emerald-950/80 p-6 rounded-3xl border-2 border-amber-400 shadow-2xl">
              <div className="flex -space-x-3">
                <CartoonCharacterSvg type="ASY" size={64} movement="LAMBAIAN_TANGAN" expression="TERIMA_KASIH" />
                <CartoonCharacterSvg type="SYIFA" size={64} movement="LAMBAIAN_TANGAN" expression="SENYUM" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black text-amber-300 font-serif">“Sampai Jumpa di Kisah Berikutnya!”</h3>
                <p className="text-xs text-emerald-100 mt-1">Dek Asy & Mbak Syifa berpamitan dengan riang.</p>
              </div>
            </div>
          )}

          {activeExit === 'LINGKARAN_FADE' && (
            <div className="w-48 h-48 rounded-full border-4 border-amber-400 flex items-center justify-center bg-emerald-900 shadow-2xl animate-pulse">
              <div className="text-center">
                <span className="text-4xl">🌟</span>
                <p className="text-xs font-bold text-amber-300 mt-2">SELESAI</p>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
