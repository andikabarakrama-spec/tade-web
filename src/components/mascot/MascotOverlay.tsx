/**
 * TADE v9.2.0-MCA2 — R926 & R927
 * MASCOT OVERLAY (Universal Living Character Dock & Companion Layer)
 * 
 * Aturan Ergonomi:
 * - Mobile Viewport: ±64px Compact Dock (Safe on 360px, 390px, 412px, 430px)
 * - Compact & Expandable modes with fluid toggle
 * - Tidak menutup input keyboard (Global Typing Pause integration)
 * - Tidak menutup kode QR, form PPDB, dan tombol aksi simpan
 * - Drag-safe bounds constrained to viewport boundaries
 * - 60 FPS GPU-accelerated transforms
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MessageCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  X,
  ChevronUp,
  Heart,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Minimize2,
  Maximize2,
  Sliders
} from 'lucide-react';
import { Asy } from './Asy';
import { Syifa } from './Syifa';
import { CharacterId, MasterExpressionKey, MasterPoseKey } from '../../core/masterCharacter/masterCharacterRegistry';
import { defaultExpressionEngine, ExpressionStateSnapshot } from '../../core/masterCharacter/expressionEngine';
import { defaultContextBehaviorEngine, ContextBehaviorPlan } from '../../core/masterCharacter/contextBehaviorEngine';
import { defaultStateMachine, CharacterState, StateMachineSnapshot } from '../../core/masterCharacter/stateMachine';
import { defaultIdleController } from '../../core/masterCharacter/idleController';
import { defaultCharacterRuntime } from '../../core/masterCharacter/characterRuntime';
import { defaultInteractionLayer } from '../../core/masterCharacter/interactionLayer';
import { masterCharacterGuard } from '../../core/masterCharacter/masterCharacterGuard';
import { deviceCapabilityEngine, DeviceCapabilitySnapshot } from '../../services/deviceCapabilityEngine';

interface MascotOverlayProps {
  activeTab?: string;
  isSimContext?: boolean;
}

export const MascotOverlay: React.FC<MascotOverlayProps> = ({
  activeTab = 'dashboard',
  isSimContext = false
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterId>('ASY');
  const [snapshot, setSnapshot] = useState<ExpressionStateSnapshot>(defaultExpressionEngine.getSnapshot());
  const [stateSnapshot, setStateSnapshot] = useState<StateMachineSnapshot>(defaultStateMachine.getSnapshot());
  const [behaviorPlan, setBehaviorPlan] = useState<ContextBehaviorPlan>(defaultContextBehaviorEngine.resolveContextFromTab(activeTab));
  const [deviceCap, setDeviceCap] = useState<DeviceCapabilitySnapshot>(() => deviceCapabilityEngine.getSnapshot());
  
  // UI States
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(true);
  const [speechMuted, setSpeechMuted] = useState<boolean>(false);
  const [dialogueText, setDialogueText] = useState<string>('');

  const bubbleTimerRef = useRef<any>(null);

  // Initialize runtime & subscriptions
  useEffect(() => {
    defaultCharacterRuntime.start();
    defaultIdleController.start();

    const unsubExpression = defaultExpressionEngine.subscribe(newSnapshot => {
      setSnapshot(newSnapshot);
    });

    const unsubStateMachine = defaultStateMachine.subscribe(newState => {
      setStateSnapshot(newState);
    });

    const unsubDevice = deviceCapabilityEngine.subscribe(newCap => {
      setDeviceCap(newCap);
      if (newCap.isQuietMode) {
        setShowSpeechBubble(false);
      }
    });

    const unsubTick = defaultCharacterRuntime.onTick((deltaSec) => {
      defaultIdleController.update(deltaSec);
    });

    return () => {
      unsubExpression();
      unsubStateMachine();
      unsubDevice();
      unsubTick();
    };
  }, []);

  // Update context when active tab changes
  useEffect(() => {
    const plan = defaultContextBehaviorEngine.resolveContextFromTab(activeTab);
    setBehaviorPlan(plan);
    defaultStateMachine.transitionTo(plan.state);

    const dialogue = selectedChar === 'ASY' ? plan.asyDialogue : plan.syifaDialogue;
    setDialogueText(dialogue);

    // Show speech bubble on tab change
    setShowSpeechBubble(true);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 6000);

    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, [activeTab, selectedChar]);

  const handleToggleChar = () => {
    const nextChar: CharacterId = selectedChar === 'ASY' ? 'SYIFA' : 'ASY';
    const validation = masterCharacterGuard.validateCharacter(nextChar);
    if (validation.valid) {
      setSelectedChar(nextChar);
      defaultExpressionEngine.setCharacter(nextChar);
      defaultStateMachine.setCharacter(nextChar);
      defaultStateMachine.transitionTo('celebrate');
      defaultExpressionEngine.setExpression('happy', 2500);
      
      const plan = defaultContextBehaviorEngine.getActivePlan(nextChar);
      setDialogueText(plan.dialogue);
      setShowSpeechBubble(true);
    }
  };

  const handleTriggerState = (state: CharacterState) => {
    defaultStateMachine.transitionTo(state);
    const config = defaultStateMachine.getStateConfig(state);
    defaultExpressionEngine.setExpression(config.defaultExpression);
  };

  const handleMascotClick = () => {
    if (isCompact) {
      setIsCompact(false);
      setShowSpeechBubble(true);
      return;
    }

    const tapResult = defaultInteractionLayer.handleTap(selectedChar);
    setDialogueText(tapResult.dialogue);
    setShowSpeechBubble(true);

    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 5000);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    defaultInteractionLayer.handlePointerMove(relX, relY);
  };

  const safeLayout = deviceCapabilityEngine.getMascotSafeLayout();
  const effectiveCompact = isCompact || deviceCap.isQuietMode;
  const mascotBaseSize = deviceCap.deviceClass === 'MOBILE' ? 52 : deviceCap.deviceClass === 'TABLET' ? 62 : 68;

  return (
    <div
      id="tade-mascot-overlay-root"
      className="fixed z-40 pointer-events-none transition-all duration-300"
      style={{
        bottom: `${safeLayout.bottomPx}px`,
        right: `${safeLayout.rightPx}px`,
        opacity: safeLayout.opacity,
        maxWidth: 'calc(100vw - 32px)'
      }}
    >
      {/* Container with drag constraint */}
      <motion.div
        drag={!deviceCap.isQuietMode}
        dragConstraints={{ left: -240, right: 0, top: -420, bottom: 0 }}
        dragElastic={0.08}
        className="pointer-events-auto relative flex flex-col items-end"
      >
        {/* --- SPEECH BUBBLE DIALOGUE --- */}
        <AnimatePresence>
          {showSpeechBubble && !effectiveCompact && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.94 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mb-2 max-w-[270px] sm:max-w-xs bg-white/95 backdrop-blur-md border-2 border-emerald-200 rounded-2xl p-3 shadow-xl text-slate-800 text-xs sm:text-sm leading-relaxed relative"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-700 text-xs tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  {selectedChar === 'ASY' ? 'Asy (Sahabat Santri)' : 'Syifa (Teladan Adab)'}
                </span>
                <button
                  onClick={() => setShowSpeechBubble(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Tutup Balon Bicara"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-medium text-slate-700">{dialogueText || behaviorPlan.asyDialogue}</p>
              {/* Bubble Pointer Arrow */}
              <div className="absolute -bottom-2 right-6 w-3.5 h-3.5 bg-white/95 border-b-2 border-r-2 border-emerald-200 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- EXPANDED CONTROL PANEL MODAL/DRAWER --- */}
        <AnimatePresence>
          {isExpanded && !isCompact && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              className="mb-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-200 p-4 w-72 text-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Living Character Control</h4>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Character Switcher */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => {
                    setSelectedChar('ASY');
                    defaultExpressionEngine.setCharacter('ASY');
                    defaultStateMachine.setCharacter('ASY');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    selectedChar === 'ASY'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-300" />
                  Asy (Santri)
                </button>
                <button
                  onClick={() => {
                    setSelectedChar('SYIFA');
                    defaultExpressionEngine.setCharacter('SYIFA');
                    defaultStateMachine.setCharacter('SYIFA');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    selectedChar === 'SYIFA'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-pink-200" />
                  Syifa (Santriwati)
                </button>
              </div>

              {/* State Machine Live Triggers (R923) */}
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">State Machine (R923):</p>
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {(['idle', 'wave', 'point', 'readIqro', 'butterfly', 'celebrate', 'confused', 'shy', 'sleepy'] as CharacterState[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleTriggerState(st)}
                    className={`text-[10px] capitalize py-1.5 px-1 rounded-lg font-medium transition-all ${
                      stateSnapshot.currentState === st
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Meta details */}
              <div className="bg-emerald-50/80 rounded-xl p-2 text-[10px] text-emerald-900 border border-emerald-100 flex items-center justify-between">
                <span>Living Runtime: 60 FPS</span>
                <span className="font-bold">v9.2.0-MCA2</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- DOCK ROOT CONTAINER --- */}
        <div className="flex items-center gap-2">
          {/* Quick Floating Action Controls */}
          {!isCompact && (
            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleToggleChar}
                title={`Ganti ke ${selectedChar === 'ASY' ? 'Syifa' : 'Asy'}`}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-200 text-emerald-700 shadow-md flex items-center justify-center hover:bg-emerald-50 active:scale-95 transition-all text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                title="Kontrol Animasi & State"
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-200 text-emerald-700 shadow-md flex items-center justify-center hover:bg-emerald-50 active:scale-95 transition-all text-xs"
              >
                <Sliders className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'text-emerald-800 rotate-90' : ''}`} />
              </button>
              <button
                onClick={() => setIsCompact(true)}
                title="Sederhanakan Tampilan (Compact Mode)"
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-200 text-slate-500 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-xs"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Compact Restore Button */}
          {isCompact && (
            <button
              onClick={() => setIsCompact(false)}
              title="Buka Menu Sahabat Santri"
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-200 text-emerald-700 shadow-md flex items-center justify-center hover:bg-emerald-50 active:scale-95 transition-all text-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* --- LIVING MASCOT CHARACTER (Mobile Safe Scaled, Desktop Refined) --- */}
          <div
            id="tade-interactive-mascot"
            onPointerMove={handlePointerMove}
            onPointerEnter={() => defaultInteractionLayer.handleHover(true)}
            onPointerLeave={() => defaultInteractionLayer.handleHover(false)}
            className={`relative bg-gradient-to-br from-white/90 to-emerald-50/90 backdrop-blur-sm rounded-2xl border-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer group ${
              effectiveCompact
                ? 'p-1 border-emerald-400 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center'
                : 'p-1.5 border-emerald-300'
            }`}
          >
            {selectedChar === 'ASY' ? (
              <Asy
                size={effectiveCompact ? 40 : mascotBaseSize}
                expressionSnapshot={snapshot}
                pose={stateSnapshot.pose}
                onClick={handleMascotClick}
                className="transition-transform duration-200 select-none pointer-events-auto"
              />
            ) : (
              <Syifa
                size={effectiveCompact ? 40 : mascotBaseSize}
                expressionSnapshot={snapshot}
                pose={stateSnapshot.pose}
                onClick={handleMascotClick}
                className="transition-transform duration-200 select-none pointer-events-auto"
              />
            )}

            {/* Active Character Mini Tag */}
            <span
              className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase text-white shadow-sm pointer-events-none ${
                selectedChar === 'ASY' ? 'bg-emerald-600' : 'bg-rose-500'
              }`}
            >
              {selectedChar}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
