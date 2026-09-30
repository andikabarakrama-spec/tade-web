import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Volume2, ShieldCheck, Heart, PartyPopper } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  ROLE_GREETINGS,
  PAGE_GUIDANCE_MAP,
  PageGuidance
} from './AIAsyContext';
import { useAIAsyResponsive } from './AIAsyResponsive';
import {
  getWalkingVariants,
  getBreathingVariants,
  getBlinkVariants,
  wavingHandVariants
} from './AIAsyMotion';
import { AIAsyBubble } from './AIAsyBubble';
import { detectCurrentEvent, EVENT_CONFIGS, EventConfig, EventType } from './AIAsyEvents';
import { AIAsyCostumes } from './AIAsyCostumes';
import { AIAsyParticles } from './AIAsParticles';
import { AIAsySuperAdminModal } from './AIAsySuperAdminModal';
import { AIAsyOfficeWorkspace } from './AIAsyOfficeWorkspace';
import { AIAsyLivingCompanionModal } from './AIAsyLivingCompanionModal';
import { AIAsyCharacterRenderer } from './AIAsyCharacterRenderer';
import { AIAsyCharacterState } from './AIAsyCharacterAssetRegistry';
import {
  ActivityType,
  CharacterVariant,
  detectCurrentActivity
} from './AIAsyActivity';
import { AIAsyActivityItems } from './AIAsyActivityItems';
import {
  detectEventCategory,
  getDailyRoutine,
  getLivingSchoolSpeech,
  DailyRoutineTime,
  EventCategory
} from './AIAsyLivingSchool';
import {
  EmotionType,
  EMOTION_CONFIGS,
  deriveEmotionFromActivity
} from './AIAsyEmotion';
import { getBehaviorForModule } from './AIAsyBehaviorMirror';
import { AIAsyWorldEngine } from './AIAsyWorldEngine';
import { getAIAsyCMSConfig } from '../../services/aiAsyCMSConfig';

interface AIAsyProps {
  activeTab?: string;
  onSelectTab?: (tabCode: string) => void;
}

export const AIAsy: React.FC<AIAsyProps> = ({ activeTab = 'w1', onSelectTab }) => {
  const { activeRole, currentUser, user } = useAuth();
  const responsive = useAIAsyResponsive();

  // Initial state: bubble is closed (AI Asy only waves gently at first)
  const [isBubbleOpen, setIsBubbleOpen] = useState<boolean>(false);
  const [hasUserDismissed, setHasUserDismissed] = useState<boolean>(false);

  // Character Variant State ('ASY' = Santri Peci, 'ASYAH' = Santriwati Hijab)
  const [characterVariant, setCharacterVariant] = useState<CharacterVariant>('ASY');

  // Activity & Idle Engine State
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isIdle, setIsIdle] = useState<boolean>(false);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Super Admin Secret Access Gesture State
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState<boolean>(false);
  const [isOfficeWorkspaceOpen, setIsOfficeWorkspaceOpen] = useState<boolean>(false);
  const [isLivingCompanionModalOpen, setIsLivingCompanionModalOpen] = useState<boolean>(false);
  const [isWaitingHeadTaps, setIsWaitingHeadTaps] = useState<boolean>(false);
  const [headTapCount, setHeadTapCount] = useState<number>(0);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tapWindowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse Cursor Tracking Gaze & Idle Behavior Engine
  const [mouseGaze, setMouseGaze] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [randomIdleState, setRandomIdleState] = useState<AIAsyCharacterState | null>(null);

  // Environment Integration Engine (Sprint P3D-08)
  const [groundType, setGroundType] = useState<'grass' | 'garden_stone' | 'wooden_floor'>('grass');
  const [overrideWeather, setOverrideWeather] = useState<'morning' | 'afternoon' | 'sunset' | 'night' | 'rain' | null>(null);
  const [overrideSeason, setOverrideSeason] = useState<'none' | 'ramadhan' | 'independence' | 'anniversary' | null>(null);

  // Auto-detect Weather based on current local hour
  const currentHour = new Date().getHours();
  const autoWeather: 'morning' | 'afternoon' | 'sunset' | 'night' =
    currentHour >= 5 && currentHour < 11 ? 'morning' :
    currentHour >= 11 && currentHour < 16 ? 'afternoon' :
    currentHour >= 16 && currentHour < 18 ? 'sunset' : 'night';
  const weather = overrideWeather || autoWeather;

  // Interactive Gestures & Guide Action State (Sprint P3D-09)
  const [gestureState, setGestureState] = useState<AIAsyCharacterState | null>(null);
  const [pointDirection, setPointDirection] = useState<'lanjut_berjalan' | 'ppdb' | 'login' | 'tour' | 'checkpoint' | 'none'>('none');
  const [longHoverGreeting, setLongHoverGreeting] = useState<string | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Night Smart Reaction (Yawn periodically at night - Sprint P3D-09)
  useEffect(() => {
    if (weather !== 'night') return;

    const yawnTimer = setInterval(() => {
      setGestureState('sleepy');
      setLongHoverGreeting('Hoam... Asy sedikit mengantuk tapi tetap siap menemani Ayah & Bunda 🌙');
      setTimeout(() => {
        setGestureState(null);
        setLongHoverGreeting(null);
      }, 3800);
    }, 24000);

    return () => clearInterval(yawnTimer);
  }, [weather]);

  // Morning Smart Reaction (Energetic greeting in the morning - Sprint P3D-09)
  useEffect(() => {
    if (weather === 'morning' && !hasUserDismissed) {
      setLongHoverGreeting('Selamat Pagi! Semangat belajar & bermain di TK Asy Syifa! ☀️✨');
      setGestureState('excited');
      const timer = setTimeout(() => {
        setGestureState(null);
        setLongHoverGreeting(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [weather, hasUserDismissed]);

  // Tour Checkpoint Celebration Listener (Sprint P3D-09)
  useEffect(() => {
    const handleCheckpointReached = () => {
      setGestureState('celebrate');
      setPointDirection('checkpoint');
      setIsParticleActive(true);
      setLongHoverGreeting('Hore! Berhasil mencapai Pos Checkpoint Tur! 🏆✨');
      setTimeout(() => {
        setGestureState(null);
        setPointDirection('none');
        setLongHoverGreeting(null);
      }, 4000);
    };

    window.addEventListener('aiasy-checkpoint-reached', handleCheckpointReached);
    return () => window.removeEventListener('aiasy-checkpoint-reached', handleCheckpointReached);
  }, []);

  // Tour Guide "Lanjut Berjalan" Action Listener (Sprint P3D-10)
  useEffect(() => {
    const handleLanjutBerjalan = () => {
      setGestureState('walking');
      setLongHoverGreeting('Lanjut berjalan ke pos berikutnya... 🐾');

      const timer1 = setTimeout(() => {
        setGestureState('head_turn');
        setLongHoverGreeting('Menoleh & bersiap menunjukkan jalan... 🌿');
      }, 800);

      const timer2 = setTimeout(() => {
        setGestureState('point');
        setPointDirection('lanjut_berjalan');
        setLongHoverGreeting('Mari Asy tunjukkan pos berikutnya di sekolah! 👉✨');
      }, 1500);

      const timer3 = setTimeout(() => {
        setGestureState('smile');
        setPointDirection('none');
        setLongHoverGreeting('Selamat tiba di pos berikutnya! 😊');
      }, 2600);

      const timer4 = setTimeout(() => {
        setGestureState(null);
        setLongHoverGreeting(null);
      }, 4500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    };

    window.addEventListener('aiasy-lanjut-berjalan', handleLanjutBerjalan);
    return () => window.removeEventListener('aiasy-lanjut-berjalan', handleLanjutBerjalan);
  }, []);

  // Mouse cursor tracking listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMouseGaze({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Idle random behavior cycle every 8-15 seconds randomly (Sprint P3D-05)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const triggerNextBehavior = () => {
      const behaviors: AIAsyCharacterState[] = [
        'watching_butterfly', // melihat kupu-kupu
        'watching_bird',      // melihat burung
        'look_right',         // melihat langit
        'look_left',          // melihat bunga
        'wave',               // melambai kecil
        'greeting',           // mengangguk / salam
        'smile',              // senyum manis
        'head_turn',          // menoleh
        'idle'                // kembali santai
      ];
      const chosen = behaviors[Math.floor(Math.random() * behaviors.length)];
      setRandomIdleState(chosen);

      // Random delay between 8000ms and 15000ms
      const nextDelay = 8000 + Math.floor(Math.random() * 7000);
      timer = setTimeout(triggerNextBehavior, nextDelay);
    };

    const initialDelay = 8000 + Math.floor(Math.random() * 4000);
    timer = setTimeout(triggerNextBehavior, initialDelay);

    return () => clearTimeout(timer);
  }, []);
  // Active Event State
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const activeEventConfig: EventConfig = selectedEventType
    ? EVENT_CONFIGS[selectedEventType]
    : detectCurrentEvent(activeTab);

  // Particle Limiter State
  const [isParticleActive, setIsParticleActive] = useState<boolean>(true);
  const [isAnimationDisabled, setIsAnimationDisabled] = useState<boolean>(false);

  // Living School Engine Determinations
  const dailyRoutine: DailyRoutineTime = getDailyRoutine();
  const eventCategory: EventCategory = detectEventCategory(
    activeEventConfig.type,
    activeEventConfig.title,
    activeTab
  );

  // Detect focus and network status
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        setIsInputFocused(true);
      }
    };

    const handleFocusOut = () => {
      setIsInputFocused(false);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Idle engine (30 seconds inactivity detector)
  useEffect(() => {
    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 30000); // 30s Idle threshold
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);

    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, []);

  // Compute Current Activity & Emotion & Behavior Mirror
  const currentActivity: ActivityType = detectCurrentActivity(
    activeTab,
    isInputFocused,
    isOnline,
    isIdle
  );

  const moduleBehavior = getBehaviorForModule(
    activeTab,
    currentActivity,
    dailyRoutine,
    eventCategory
  );

  const worldState = AIAsyWorldEngine.evaluateWorldState({
    activeTabCode: activeTab,
    userActivity: currentActivity,
    isInputFocused,
    isIdle,
    dailyRoutine,
    eventCategory,
    isBubbleOpen
  });

  const currentEmotion: EmotionType = worldState.emotion || deriveEmotionFromActivity(
    currentActivity,
    eventCategory,
    isIdle
  );
  const emotionConfig = EMOTION_CONFIGS[currentEmotion];

  // Trigger celebration smart limiter (12 seconds)
  useEffect(() => {
    setIsParticleActive(true);
    const timer = setTimeout(() => {
      setIsParticleActive(false);
    }, 12000);

    return () => clearTimeout(timer);
  }, [activeTab, selectedEventType]);

  // Gentle storybook greeting timing:
  // 1. On page load / tab change, AI Asy only waves gently.
  // 2. After 3.5 seconds, gentle bubble appears.
  // 3. After 5 seconds, bubble auto-dismisses.
  useEffect(() => {
    setIsBubbleOpen(false);

    const showGreetingTimer = setTimeout(() => {
      if (!hasUserDismissed) {
        setIsBubbleOpen(true);
      }
    }, 3500);

    const autoHideTimer = setTimeout(() => {
      if (!hasUserDismissed) {
        setIsBubbleOpen(false);
      }
    }, 8500);

    return () => {
      clearTimeout(showGreetingTimer);
      clearTimeout(autoHideTimer);
    };
  }, [activeTab, hasUserDismissed]);

  // Auto-detect Season based on active event or calendar
  const autoSeason: 'none' | 'ramadhan' | 'independence' | 'anniversary' =
    activeEventConfig.type === 'RAMADAN' || activeEventConfig.type === 'EID_FITR' ? 'ramadhan' :
    activeEventConfig.type === 'INDEPENDENCE_DAY' ? 'independence' :
    activeEventConfig.type === 'SCHOOL_BIRTHDAY' || activeEventConfig.type === 'FOUNDATION_ANNIVERSARY' ? 'anniversary' : 'none';
  const season = overrideSeason || autoSeason;

  // Interactive Hover & Double Click Handlers (Sprint P3D-08)
  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setLongHoverGreeting(`Assalamu'alaikum! Selamat datang di TK Islam Plus Asy-Syifa! 🌿`);
      setGestureState('greeting');
    }, 1200);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setLongHoverGreeting(null);
    if (gestureState === 'greeting') setGestureState(null);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGestureState('happy');
    setIsParticleActive(true);
    setLongHoverGreeting(`Hehehe! Asy senang sekali bermain denganmu! 😄✨`);
    setTimeout(() => {
      setGestureState(null);
      setLongHoverGreeting(null);
    }, 3500);
  };

  // Reset Super Admin Secret Gesture State
  const resetGestureState = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (tapWindowTimerRef.current) clearTimeout(tapWindowTimerRef.current);
    setIsWaitingHeadTaps(false);
    setHeadTapCount(0);
  };

  // Handle Press Hold (5 Seconds)
  const handlePressStart = () => {
    resetGestureState();

    holdTimerRef.current = setTimeout(() => {
      setIsWaitingHeadTaps(true);
      setHeadTapCount(0);

      tapWindowTimerRef.current = setTimeout(() => {
        resetGestureState();
      }, 5000);
    }, 5000);
  };

  const handlePressEnd = () => {
    if (holdTimerRef.current && !isWaitingHeadTaps) {
      clearTimeout(holdTimerRef.current);
    }
  };

  // Handle Head Tap
  const handleHeadClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isWaitingHeadTaps) {
      const nextCount = headTapCount + 1;
      setHeadTapCount(nextCount);

      if (nextCount >= 3) {
        setIsSuperAdminModalOpen(true);
        resetGestureState();
      }
    } else {
      setIsBubbleOpen((prev) => !prev);
    }
  };

  // Resolve user display name
  const userName =
    (currentUser as any)?.namaLengkap ||
    user?.displayName ||
    currentUser?.displayName ||
    currentUser?.email?.split('@')[0] ||
    activeRole ||
    'Bapak/Ibu';

  // Resolve storybook gentle greeting
  const roleGreeting =
    activeTab.startsWith('w') || !activeRole
      ? `Assalamu'alaikum Ayah & Bunda 👋\nBoleh saya menemani berkeliling?`
      : (ROLE_GREETINGS[activeRole] || `Assalamu'alaikum ${userName}! ${characterVariant === 'ASYAH' ? 'Asyah' : 'Asy'} siap menemani di Taman TK Asy Syifa.`);

  // Resolve page guidance
  const safeTabCode = activeTab.toLowerCase();
  const pageGuidance: PageGuidance = PAGE_GUIDANCE_MAP[safeTabCode] || {
    title: `Modul ${activeTab.toUpperCase()}`,
    summary: `Halaman ini merupakan bagian dari portal SIM TK ASY SYIFA. Asy siap membantu memandu penggunaan modul ini.`,
    tips: ['Gunakan menu untuk navigasi', 'Pastikan data yang diisi sudah sesuai'],
    category: 'Portal'
  };

  // Motion Variants
  const walkingVariants = getWalkingVariants(
    responsive.walkDistancePx,
    isAnimationDisabled ? 'LIGHT' : responsive.performanceMode
  );
  const breathingVariants = getBreathingVariants(
    isAnimationDisabled ? 'LIGHT' : responsive.performanceMode
  );
  const blinkVariants = getBlinkVariants(
    isAnimationDisabled ? 'LIGHT' : responsive.performanceMode
  );

  return (
    <>
      <div
        className="fixed bottom-5 right-4 sm:right-6 z-50 pointer-events-none flex flex-col items-end gap-2 font-sans transition-all duration-300 print:hidden"
      >
        {/* Speech Help Bubble */}
        <AnimatePresence>
          {isBubbleOpen && (
            <div className="pointer-events-auto">
              <AIAsyBubble
                roleGreeting={roleGreeting}
                pageGuidance={pageGuidance}
                activeRole={activeRole || 'WALI_MURID'}
                activeTabCode={activeTab}
                userName={userName}
                performanceMode={responsive.performanceMode}
                bubbleMaxWidth={responsive.bubbleMaxWidth}
                eventConfig={activeEventConfig}
                currentActivity={currentActivity}
                currentEmotion={currentEmotion}
                worldLocationLabel={worldState.locationLabel}
                worldAmbientEmoji={worldState.ambientEmoji}
                characterVariant={characterVariant}
                isParticleActive={isParticleActive}
                isAnimationDisabled={isAnimationDisabled}
                onReplayCelebration={() => setIsParticleActive(true)}
                onSelectEvent={(type) => setSelectedEventType(type)}
                onToggleAnimation={() => setIsAnimationDisabled((prev) => !prev)}
                onToggleCharacterVariant={() =>
                  setCharacterVariant((prev) => (prev === 'ASY' ? 'ASYAH' : 'ASY'))
                }
                onClose={() => {
                  setIsBubbleOpen(false);
                  setHasUserDismissed(true);
                }}
                onNavigateToTab={onSelectTab}
                onOpenOfficeWorkspace={() => setIsOfficeWorkspaceOpen(true)}
                onOpenLivingCompanion={() => setIsLivingCompanionModalOpen(true)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Mascot Avatar Container */}
        <motion.div
          variants={walkingVariants}
          animate="idle"
          className="pointer-events-auto relative cursor-pointer group focus:outline-hidden select-none"
          tabIndex={0}
          role="button"
          aria-label={`${characterVariant === 'ASYAH' ? 'AI Asyah' : 'AI Asy'} Digital School Companion - Klik untuk bantuan`}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
          onClick={() => {
            if (!isWaitingHeadTaps) {
              setIsBubbleOpen((prev) => !prev);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsBubbleOpen((prev) => !prev);
            }
          }}
          style={{ transform: `scale(${responsive.characterScale})`, transformOrigin: 'bottom left' }}
        >
          {/* Particle Decoration Engine */}
          <AIAsyParticles
            eventConfig={activeEventConfig}
            performanceMode={responsive.performanceMode}
            isActive={isParticleActive && !isAnimationDisabled}
          />

          {/* Long Hover / Gesture Speech Greeting Toast */}
          <AnimatePresence>
            {longHoverGreeting && !isBubbleOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                className="absolute -top-14 right-0 z-30 bg-emerald-950/95 text-amber-200 text-xs px-3.5 py-2 rounded-2xl border border-emerald-500/60 shadow-2xl max-w-xs backdrop-blur-md pointer-events-none font-sans font-medium"
              >
                <span>{longHoverGreeting}</span>
                <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-emerald-950/95 border-b border-r border-emerald-500/60 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Living Storybook Garden Mascot Inhabitant Container (Sprint P3D-03 180-220px enlarged height) */}
          <motion.div
            variants={breathingVariants}
            animate="breath"
            className="relative w-36 h-48 sm:w-44 sm:h-52 flex items-center justify-center filter drop-shadow-2xl group"
          >
            {/* Soft Warm Garden Sunlight Glow Aura */}
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl group-hover:bg-amber-300/30 transition duration-500" />

            {/* Official 3D Pixar Character Model Renderer */}
            <div onClick={handleHeadClick} className="w-full h-full relative z-10 cursor-pointer flex items-center justify-center">
              <AIAsyCharacterRenderer
                state={
                  gestureState ||
                  (currentActivity === 'READING' || currentActivity === 'DOCUMENT'
                    ? 'reading'
                    : currentActivity === 'CALENDAR'
                    ? 'thinking'
                    : isBubbleOpen
                    ? 'greeting'
                    : randomIdleState || 'wave')
                }
                genderVariant={characterVariant}
                scale={1.15}
                gazeX={mouseGaze.x}
                gazeY={mouseGaze.y}
                groundType={groundType}
                weather={weather}
                season={season}
                emotion={currentEmotion}
                pointDirection={pointDirection}
                smileLevel={
                  gestureState === 'celebrate' || currentEmotion === 'EXCITED' ? 5 :
                  gestureState === 'happy' || currentEmotion === 'HAPPY' ? 4 :
                  gestureState === 'smile' || gestureState === 'greeting' ? 3 :
                  weather === 'night' || gestureState === 'sleepy' ? 1 :
                  2
                }
                isTalking={isBubbleOpen}
              />
            </div>
          </motion.div>

          {/* Soft Storybook Label when idle */}
          {!isBubbleOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-3 right-0 bg-emerald-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-600/50 shadow-md whitespace-nowrap flex items-center gap-1 font-sans"
            >
              <span>🌿 {characterVariant === 'ASYAH' ? 'Asyah' : 'Asy'}</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Secret Super Admin Control Portal Modal */}
      <AIAsySuperAdminModal
        isOpen={isSuperAdminModalOpen}
        onClose={() => setIsSuperAdminModalOpen(false)}
      />

      {/* AI Asy Office Workspace & Document Intelligence Modal */}
      <AIAsyOfficeWorkspace
        isOpen={isOfficeWorkspaceOpen}
        onClose={() => setIsOfficeWorkspaceOpen(false)}
        activeRole={activeRole || 'WALI_MURID'}
        userName={userName}
        onNavigateToTab={onSelectTab}
      />

      {/* AI Asy Living Companion Modal (FP-5 Directive) */}
      <AIAsyLivingCompanionModal
        isOpen={isLivingCompanionModalOpen}
        onClose={() => setIsLivingCompanionModalOpen(false)}
        activeRole={activeRole || 'WALI_MURID'}
        userName={userName}
        characterVariant={characterVariant}
        onNavigateToTab={onSelectTab}
      />
    </>
  );
};
