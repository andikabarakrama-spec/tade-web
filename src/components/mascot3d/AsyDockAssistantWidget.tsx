import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Settings, EyeOff, Bot, Sparkles, MessageSquare, VolumeX } from 'lucide-react';
import { Asy3DModelCanvas } from './Asy3DModelCanvas';
import { AsyBubbleDialogue } from './AsyBubbleDialogue';
import { AsyControlPanelModal } from './AsyControlPanelModal';
import { AsyDockAssistant, DockStateConfig } from '../../core/mascot3d/asyDockAssistant';
import { LivingAnimationEngine, LivingAnimationState } from '../../core/mascot3d/livingAnimationEngine';
import { BubbleDialogueSystem, SpeechBubbleItem } from '../../core/mascot3d/bubbleDialogueSystem';
import { AsyInteractionEngine } from '../../core/mascot3d/asyInteractionEngine';
import { MascotAccessibilityLayer, AccessibilitySettings } from '../../core/mascot3d/mascotAccessibilityLayer';
import { AsyControlPanelManager, AsyControlSettings } from '../../core/mascot3d/asyControlPanelManager';
import { MascotPerformanceGuard, MascotPerformanceMetrics } from '../../core/mascot3d/mascotPerformanceGuard';
import { EmotionalStateEngine, EmotionState } from '../../core/mascot3d/emotionalStateEngine';
import { ContextMovementEngine, MascotPositionOffset } from '../../core/mascot3d/contextMovementEngine';
import { CelebrationEngine, ActiveCelebration } from '../../core/mascot3d/celebrationEngine';
import { SeasonalEnvironmentSync, SeasonalState } from '../../core/mascot3d/seasonalEnvironmentSync';
import { QuietPresenceMode, QuietModeState } from '../../core/mascot3d/quietPresenceMode';
import { PeekIntelligenceEngine, PeekState } from '../../core/mascot3d/peekIntelligenceEngine';
import { ThumbAwarenessEngine, ThumbZoneConfig } from '../../core/mascot3d/thumbAwarenessEngine';
import { SmartEdgeSittingEngine, EdgeSittingState } from '../../core/mascot3d/smartEdgeSittingEngine';
import { TinyReactionEngine, TinyReactionItem } from '../../core/mascot3d/tinyReactionEngine';
import { GesturePolishEngine, PolishedGestureState } from '../../core/mascot3d/gesturePolishEngine';
import { MobileSafeAreaGuardian, MobileSafeAreaMetrics } from '../../core/mascot3d/mobileSafeAreaGuardian';
import { PerformanceMicroOptimizer, MicroPerformanceMetrics } from '../../core/mascot3d/performanceMicroOptimizer';

export const AsyDockAssistantWidget: React.FC = () => {
  const dockMgr = useMemo(() => AsyDockAssistant.getInstance(), []);
  const animEngine = useMemo(() => LivingAnimationEngine.getInstance(), []);
  const bubbleSys = useMemo(() => BubbleDialogueSystem.getInstance(), []);
  const interactEngine = useMemo(() => AsyInteractionEngine.getInstance(), []);
  const accessLayer = useMemo(() => MascotAccessibilityLayer.getInstance(), []);
  const controlMgr = useMemo(() => AsyControlPanelManager.getInstance(), []);
  const perfGuard = useMemo(() => MascotPerformanceGuard.getInstance(), []);
  const emoEngine = useMemo(() => EmotionalStateEngine.getInstance(), []);
  const moveEngine = useMemo(() => ContextMovementEngine.getInstance(), []);
  const celEngine = useMemo(() => CelebrationEngine.getInstance(), []);
  const seasonalSync = useMemo(() => SeasonalEnvironmentSync.getInstance(), []);
  const quietMode = useMemo(() => QuietPresenceMode.getInstance(), []);
  const peekEngine = useMemo(() => PeekIntelligenceEngine.getInstance(), []);
  const thumbEngine = useMemo(() => ThumbAwarenessEngine.getInstance(), []);
  const edgeEngine = useMemo(() => SmartEdgeSittingEngine.getInstance(), []);
  const reactionEngine = useMemo(() => TinyReactionEngine.getInstance(), []);
  const gestureEngine = useMemo(() => GesturePolishEngine.getInstance(), []);
  const safeAreaGuardian = useMemo(() => MobileSafeAreaGuardian.getInstance(), []);
  const perfOptimizer = useMemo(() => PerformanceMicroOptimizer.getInstance(), []);

  const [dockConfig, setDockConfig] = useState<DockStateConfig>(() => dockMgr.getConfig());
  const [animState, setAnimState] = useState<LivingAnimationState>(() => animEngine.getCurrentState());
  const [bubble, setBubble] = useState<SpeechBubbleItem | null>(() => bubbleSys.getCurrentBubble());
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => accessLayer.getSettings());
  const [controlSettings, setControlSettings] = useState<AsyControlSettings>(() => controlMgr.getSettings());
  const [perfMetrics, setPerfMetrics] = useState<MascotPerformanceMetrics>(() => perfGuard.getMetrics());
  const [emotionState, setEmotionState] = useState<EmotionState>(() => emoEngine.getState());
  const [movementState, setMovementState] = useState<MascotPositionOffset>(() => moveEngine.getMovement());
  const [celebration, setCelebration] = useState<ActiveCelebration | null>(null);
  const [seasonalState, setSeasonalState] = useState<SeasonalState>(() => seasonalSync.getSeasonalState());
  const [quietState, setQuietState] = useState<QuietModeState>(() => quietMode.getState());
  const [peekState, setPeekState] = useState<PeekState>(() => peekEngine.getState());
  const [thumbConfig, setThumbConfig] = useState<ThumbZoneConfig>(() => thumbEngine.getConfig());
  const [edgeState, setEdgeState] = useState<EdgeSittingState>(() => edgeEngine.getState());
  const [reaction, setReaction] = useState<TinyReactionItem | null>(() => reactionEngine.getCurrentReaction());
  const [gestureState, setGestureState] = useState<PolishedGestureState>(() => gestureEngine.getState());
  const [safeMetrics, setSafeMetrics] = useState<MobileSafeAreaMetrics>(() => safeAreaGuardian.getMetrics());
  const [microPerf, setMicroPerf] = useState<MicroPerformanceMetrics>(() => perfOptimizer.getMetrics());
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsubDock = dockMgr.subscribe(setDockConfig);
    const unsubAnim = animEngine.subscribe(setAnimState);
    const unsubBubble = bubbleSys.subscribe(setBubble);
    const unsubAccess = accessLayer.subscribe(setAccessibility);
    const unsubCtrl = controlMgr.subscribe(setControlSettings);
    const unsubPerf = perfGuard.subscribe(setPerfMetrics);
    const unsubEmotion = emoEngine.subscribe(setEmotionState);
    const unsubMove = moveEngine.subscribe(setMovementState);
    const unsubCelebration = celEngine.subscribe(setCelebration);
    const unsubSeasonal = seasonalSync.subscribe(setSeasonalState);
    const unsubQuiet = quietMode.subscribe(setQuietState);
    const unsubPeek = peekEngine.subscribe(setPeekState);
    const unsubThumb = thumbEngine.subscribe(setThumbConfig);
    const unsubEdge = edgeEngine.subscribe(setEdgeState);
    const unsubReact = reactionEngine.subscribe(setReaction);
    const unsubGesture = gestureEngine.subscribe(setGestureState);
    const unsubSafe = safeAreaGuardian.subscribe(setSafeMetrics);
    const unsubMicroPerf = perfOptimizer.subscribe(setMicroPerf);

    return () => {
      unsubDock();
      unsubAnim();
      unsubBubble();
      unsubAccess();
      unsubCtrl();
      unsubPerf();
      unsubEmotion();
      unsubMove();
      unsubCelebration();
      unsubSeasonal();
      unsubQuiet();
      unsubPeek();
      unsubThumb();
      unsubEdge();
      unsubReact();
      unsubGesture();
      unsubSafe();
      unsubMicroPerf();
    };
  }, []);

  // Keyboard shortcut: ESC to dismiss speech bubble
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && bubble) {
        bubbleSys.dismissCurrent();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bubble]);

  if (!controlSettings.isEnabled || dockConfig.displayMode === 'HIDDEN') {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            controlMgr.updateSettings({ isEnabled: true });
            dockMgr.setDisplayMode('COMPACT_DOCK');
          }}
          className="p-2.5 bg-slate-900/90 text-emerald-400 hover:text-emerald-300 rounded-full border border-emerald-500/40 shadow-lg transition cursor-pointer backdrop-blur-xs flex items-center gap-1.5 text-xs font-bold"
          title="Tampilkan Asy Living Mascot"
          aria-label="Tampilkan Maskot Asy"
        >
          <Bot className="w-4 h-4" />
          <span className="text-[10px]">Asy</span>
        </button>
      </div>
    );
  }

  const baseSize = Math.round(dockConfig.baseSizePx * controlSettings.scale * movementState.scaleMultiplier * peekState.scale);

  // Calculate dynamic position from Dock + Movement + Thumb Awareness + Edge Sitting + Safe Area + Peek offsets
  const effectiveBottom = Math.max(
    10, 
    dockConfig.offsetY - movementState.offsetY + thumbConfig.thumbDodgeOffsetY + edgeState.sittingOffsetY + peekState.peekOffsetY
  );
  const effectiveRight = Math.max(
    10, 
    dockConfig.offsetX - movementState.offsetX + thumbConfig.thumbDodgeOffsetX + edgeState.sittingOffsetX + peekState.peekOffsetX
  );
  const effectiveRotation = movementState.rotationDeg + peekState.rotationDeg;

  return (
    <>
      <div
        id="asy-living-dock-assistant"
        className="fixed z-40 transition-all duration-300 ease-out select-none"
        style={{
          bottom: `${effectiveBottom}px`,
          right: `${effectiveRight}px`,
          transform: `rotate(${effectiveRotation}deg)`,
          opacity: peekState.opacity
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          interactEngine.handleHoverStart();
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex flex-col items-center">
          {/* Active Tiny Reaction Floating Badge (R804) */}
          {reaction && (
            <div 
              className="absolute -top-6 mb-1 px-2 py-0.5 rounded-full bg-slate-900/95 border border-emerald-400 text-xs font-bold text-emerald-300 shadow-lg animate-bounce z-50 flex items-center gap-1 backdrop-blur-xs pointer-events-none whitespace-nowrap"
            >
              <span>{reaction.emoji}</span>
              <span className="text-[10px]">{reaction.badgeText}</span>
            </div>
          )}

          {/* Active Celebration Soft Sparkles / Confetti */}
          {celebration && !accessibility.reducedMotion && (
            <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-visible">
              {celebration.particles.map(p => (
                <div
                  key={p.id}
                  className="absolute rounded-full animate-ping"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    transform: `translate(${p.x}px, ${p.y}px)`,
                    opacity: p.alpha
                  }}
                />
              ))}
            </div>
          )}

          {/* Speech / Thought Bubble (Suppressed if in quiet mode unless explicit celebration/help) */}
          {(!quietState.suppressSpontaneousBubbles || bubble?.type === 'CELEBRATION' || bubble?.type === 'HELP') && (
            <AsyBubbleDialogue
              bubble={bubble}
              onDismiss={() => bubbleSys.dismissCurrent()}
              positionCorner={dockConfig.corner}
            />
          )}

          {/* Quick Action Overlay on Hover */}
          {isHovered && (
            <div className="absolute -top-7 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30 text-white shadow-lg animate-fade-in z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettingsModal(true);
                }}
                className="p-1 hover:text-emerald-400 transition cursor-pointer"
                title="Pengaturan Maskot Asy"
                aria-label="Buka Pengaturan Asy"
              >
                <Settings className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  interactEngine.handleClick();
                }}
                className="p-1 hover:text-emerald-400 transition cursor-pointer"
                title="Sapa Asy"
                aria-label="Sapa Asy"
              >
                <MessageSquare className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dockMgr.setDisplayMode('HIDDEN');
                }}
                className="p-1 hover:text-rose-400 transition cursor-pointer"
                title="Sembunyikan Asy"
                aria-label="Sembunyikan Asy"
              >
                <EyeOff className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Living Avatar Interactive Button */}
          <button
            onClick={() => interactEngine.handleClick()}
            onDoubleClick={() => interactEngine.handleDoubleClick()}
            className="focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full cursor-pointer transition transform active:scale-95 group relative"
            aria-label="Asy Digital Living Companion. Tekan Enter untuk berdialog atau spasi untuk nasehat ceria."
            tabIndex={0}
          >
            <Asy3DModelCanvas
              animState={animState}
              size={baseSize}
              reducedMotion={accessibility.reducedMotion}
              highContrast={accessibility.highContrastOutline}
              outfit={controlSettings.genderOutfit}
              emotion={emotionState.currentEmotion}
              hatDecoration={seasonalState.hatDecoration}
              shoulderSway={gestureState.shoulderSwayAngle}
              headFollowAngle={gestureState.headFollowAngle}
              isDoubleBlinking={gestureState.isDoubleBlinking}
            />

            {/* Subtle Aura Halo on Hover / Seasonal Mood */}
            <div className={`absolute inset-0 rounded-full bg-linear-to-r ${seasonalState.auraGradient} group-hover:opacity-100 transition-opacity pointer-events-none`} />

            {/* Quiet Mode Indicator Badge */}
            {quietState.isActive && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-amber-400/80 flex items-center justify-center text-[8px] text-amber-300" title="Mode Hening Produktif">
                <VolumeX className="w-2.5 h-2.5" />
              </div>
            )}
          </button>

          {/* Debug Overlay Badge if enabled */}
          {controlSettings.debugOverlayEnabled && (
            <div className="mt-1 px-1.5 py-0.5 bg-slate-900/90 text-emerald-400 border border-emerald-500/40 rounded-md font-mono text-[9px] flex items-center gap-1 shadow-xs">
              <span>{microPerf.measuredFps} FPS</span>
              <span>•</span>
              <span className="truncate max-w-[50px]">{emotionState.currentEmotion}</span>
              <span>•</span>
              <span>{peekState.stage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Screen Reader Live Region for WCAG */}
      <div 
        aria-live="polite" 
        className="sr-only"
      >
        {accessLayer.getLiveRegionText()}
      </div>

      {/* Settings Modal */}
      <AsyControlPanelModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
};

