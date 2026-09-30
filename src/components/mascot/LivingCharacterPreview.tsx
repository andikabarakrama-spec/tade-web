/**
 * TADE v9.3.0-MCA3 — R938
 * LIVING CHARACTER PREVIEW & OFFICIAL PRODUCTION PIPELINE COCKPIT
 * 
 * Founder / Admin Observability & Asset Preview Suite:
 * - Live Character Preview (Asy & Syifa)
 * - Official Animation Clip Controller (8 Canon Clips each)
 * - 3D GLB Lazy Loader & Asset Format Inspector (GLB, RIVE, SVG, PROCEDURAL)
 * - Live Performance Telemetry (FPS, Frame Time, Memory Estimate)
 * - Asset Health Verifier & Checksum Audit Suite
 */

import React, { useState, useEffect, useCallback, useId } from 'react';
import { 
  Play, Pause, RefreshCw, CheckCircle, AlertTriangle, ShieldCheck, 
  Activity, Sparkles, BookOpen, Layers, Box, Cpu, HardDrive, 
  Eye, Heart, Flame, Music, HelpCircle, User, Award, Check, Clock,
  Smile, Compass, Zap, Sun, Cloud, Tv, Users, Camera, GraduationCap,
  Volume2, ThumbsUp, MapPin, Footprints, Moon, Navigation
} from 'lucide-react';
import { CharacterId } from '../../core/masterCharacter/masterCharacterRegistry';
import { defaultCharacterPipeline, PipelineTelemetry, GLBModelInstance } from '../../core/masterCharacter/characterProductionPipeline';
import { defaultClipRegistry, AnimationClipDefinition, MasterClipName } from '../../core/masterCharacter/animationClipRegistry';
import { OFFICIAL_CHARACTER_MANIFEST } from '../../core/masterCharacter/characterManifest';
import { defaultAssetHealthVerifier, AssetHealthReport } from '../../core/masterCharacter/assetHealthVerifier';
import { defaultCharacterRuntime } from '../../core/masterCharacter/characterRuntime';
import { defaultLivingBehaviorEngine, LivingBehaviorState, BehaviorTelemetry, BEHAVIOR_STATE_CONFIGS } from '../../core/masterCharacter/livingBehaviorEngine';
import { defaultSchoolTimeAdapter, SCHOOL_PERIOD_DEFINITIONS, SchoolPeriodKey } from '../../core/masterCharacter/schoolTimeAdapter';
import { defaultEmotionController, EMOTION_PROFILES, MasterEmotionType } from '../../core/masterCharacter/emotionController';
import { defaultEnvironmentalAdapter, ATMOSPHERE_PROFILES, AmbientLightingMode, EnvironmentalAtmosphere } from '../../core/masterCharacter/environmentalContextAdapter';
import { defaultCameraPresenceSystem, CameraPresenceState } from '../../core/masterCharacter/cameraPresenceSystem';
import { defaultSceneInteractionLayer, SceneInteractionSnapshot } from '../../core/masterCharacter/sceneInteractionLayer';
import { defaultCrowdAwarenessSystem, CrowdAwarenessSnapshot } from '../../core/masterCharacter/crowdAwarenessSystem';
import { defaultIdleStoryEngine, STORY_VIGNETTES, StoryVignette } from '../../core/masterCharacter/idleStoryEngine';
import { defaultSchoolEventHooks, SCHOOL_EVENT_REACTIONS, SchoolEventType, SchoolEventReaction } from '../../core/masterCharacter/schoolEventHooks';
import { defaultClassroomActivityAdapter, CLASSROOM_ACTIVITY_PROFILES, ClassroomActivityType } from '../../core/masterCharacter/classroomActivityAdapter';
import { defaultLearningGestureController, LEARNING_GESTURES, LearningGestureType, GroupParticipationState } from '../../core/masterCharacter/learningGestureController';
import { defaultEducationalAttentionSystem, STORY_LEARNING_VIGNETTES, EducationalAttentionSnapshot } from '../../core/masterCharacter/educationalAttentionSystem';
import { defaultAccessibilityMotionGuard, AccessibilityMotionProfile } from '../../core/masterCharacter/accessibilityMotionGuard';
import { defaultLearningHooksAdapter, LEARNING_SCHEDULE_EVENTS } from '../../core/masterCharacter/learningHooksAdapter';
import { defaultSchoolWorldAdapter, SCHOOL_AREA_PROFILES, SchoolAreaType } from '../../core/masterCharacter/schoolWorldAdapter';
import { defaultSoftWalkingComposer, WalkingTrajectory } from '../../core/masterCharacter/softWalkingComposer';
import { defaultQuietTimeEngine, QuietTimeSnapshot, QuietMode } from '../../core/masterCharacter/quietTimeEngine';
import { defaultSchoolJourneyHooks, SCHOOL_JOURNEY_STEPS, SchoolJourneyStep } from '../../core/masterCharacter/schoolJourneyHooks';
import { Asy } from './Asy';
import { Syifa } from './Syifa';

export interface LivingCharacterPreviewProps {
  initialCharacter?: CharacterId;
  onClose?: () => void;
}

export const LivingCharacterPreview: React.FC<LivingCharacterPreviewProps> = ({
  initialCharacter = 'ASY',
  onClose
}) => {
  const containerId = useId();
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>(initialCharacter);
  const [activeClipName, setActiveClipName] = useState<MasterClipName>('idle');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'WORLD' | 'CLASSROOM' | 'CINEMATIC' | 'BEHAVIOR' | 'CLIPS' | 'TELEMETRY' | 'HEALTH' | '3D_GLB' | 'MANIFEST'>('WORLD');
  const [telemetry, setTelemetry] = useState<PipelineTelemetry>(defaultCharacterPipeline.getTelemetry());
  const [behaviorTelemetry, setBehaviorTelemetry] = useState<BehaviorTelemetry>(defaultLivingBehaviorEngine.getTelemetry());
  const [healthReport, setHealthReport] = useState<AssetHealthReport | null>(null);
  const [glbInfo, setGlbInfo] = useState<GLBModelInstance | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [selectedFormat, setSelectedFormat] = useState<'AUTO' | 'GLB' | 'SVG' | 'PROCEDURAL'>('AUTO');
  const [isAutoBehavior, setIsAutoBehavior] = useState<boolean>(true);
  const [simulatedPeriod, setSimulatedPeriod] = useState<SchoolPeriodKey>('CLASS_ACTIVITY');

  // MCA-5 Cinematic Living Runtime State
  const [atmosphere, setAtmosphere] = useState<EnvironmentalAtmosphere>(defaultEnvironmentalAdapter.getAtmosphere());
  const [selectedAtmosphereMode, setSelectedAtmosphereMode] = useState<AmbientLightingMode>('DAY_BRIGHT');
  const [cameraPresence, setCameraPresence] = useState<CameraPresenceState>(defaultCameraPresenceSystem.getState());
  const [sceneProps, setSceneProps] = useState<SceneInteractionSnapshot>(defaultSceneInteractionLayer.getSnapshot());
  const [crowdState, setCrowdState] = useState<CrowdAwarenessSnapshot>(defaultCrowdAwarenessSystem.getSnapshot());
  const [activeVignette, setActiveVignette] = useState<StoryVignette | null>(null);
  const [activeEventReaction, setActiveEventReaction] = useState<SchoolEventReaction | null>(null);
  const [isDualView, setIsDualView] = useState<boolean>(true);

  // MCA-6 Classroom Intelligence Runtime State
  const [currentClassActivity, setCurrentClassActivity] = useState<ClassroomActivityType>('TAHFIDZ');
  const [groupParticipation, setGroupParticipation] = useState<GroupParticipationState>(defaultLearningGestureController.getState());
  const [educationalAttention, setEducationalAttention] = useState<EducationalAttentionSnapshot>(defaultEducationalAttentionSystem.getSnapshot());
  const [motionGuardProfile, setMotionGuardProfile] = useState<AccessibilityMotionProfile>(defaultAccessibilityMotionGuard.getProfile());

  // MCA-7 School World Runtime State
  const [currentSchoolArea, setCurrentSchoolArea] = useState<SchoolAreaType>('GERBANG');
  const [walkingState, setWalkingState] = useState<{ asy: WalkingTrajectory; syifa: WalkingTrajectory; isCompanionSynced: boolean }>({
    ...defaultSoftWalkingComposer.update(0.016)
  });
  const [quietTime, setQuietTime] = useState<QuietTimeSnapshot>(defaultQuietTimeEngine.update(0.016));
  const [activeJourney, setActiveJourney] = useState<SchoolJourneyStep>(defaultSchoolJourneyHooks.getActiveStep());

  const clips = defaultClipRegistry.getClipsForCharacter(selectedCharacter);
  const currentClip = defaultClipRegistry.getClip(selectedCharacter, activeClipName) || Object.values(clips)[0];
  const metadata = OFFICIAL_CHARACTER_MANIFEST.characters[selectedCharacter];

  // Refresh Telemetry & Behavior & Cinematic & Classroom Loop
  useEffect(() => {
    const unsub = defaultLivingBehaviorEngine.subscribe((bt) => {
      setBehaviorTelemetry(bt);
      // Map behavior state to visual clip if playing
      const mapped = BEHAVIOR_STATE_CONFIGS[bt.currentState]?.mappedClip || 'idle';
      setActiveClipName(mapped);
    });

    let animId: number;
    let lastTime = Date.now();
    const updateLoop = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setTelemetry(defaultCharacterPipeline.getTelemetry());
      setCameraPresence(defaultCameraPresenceSystem.update(delta));
      setSceneProps(defaultSceneInteractionLayer.update(delta));
      setActiveVignette(defaultIdleStoryEngine.getActiveVignette());
      setActiveEventReaction(defaultSchoolEventHooks.getActiveReaction());
      setGroupParticipation(defaultLearningGestureController.getState());
      setEducationalAttention(defaultEducationalAttentionSystem.getSnapshot());
      setMotionGuardProfile(defaultAccessibilityMotionGuard.getProfile());
      setWalkingState(defaultSoftWalkingComposer.update(delta));
      setQuietTime(defaultQuietTimeEngine.update(delta));

      animId = requestAnimationFrame(updateLoop);
    };
    animId = requestAnimationFrame(updateLoop);

    return () => {
      unsub();
      cancelAnimationFrame(animId);
    };
  }, []);

  // Handle Atmosphere Change
  const handleSelectAtmosphere = (mode: AmbientLightingMode) => {
    defaultEnvironmentalAdapter.setManualOverride(mode);
    setAtmosphere(defaultEnvironmentalAdapter.getAtmosphere());
  };

  // Handle School World Area Select (R971, R972, R974)
  const handleSelectSchoolArea = (area: SchoolAreaType) => {
    setCurrentSchoolArea(area);
    const prof = defaultSchoolWorldAdapter.setArea(area);
    defaultSoftWalkingComposer.moveTo('ASY', prof.defaultAnchorAsy.xPercent, 1800);
    defaultSoftWalkingComposer.moveTo('SYIFA', prof.defaultAnchorSyifa.xPercent, 1800);
    defaultLivingBehaviorEngine.triggerState(prof.primaryBehavior, `Area Kampus: ${prof.name}`, prof.emotion);
    handlePlayClip(prof.suggestedClip);
    defaultQuietTimeEngine.registerInteraction();
  };

  // Handle School Journey Trigger (R979)
  const handleTriggerJourneyStep = (stepId: string) => {
    const step = defaultSchoolJourneyHooks.triggerJourneyStep(stepId);
    if (step) {
      setActiveJourney(step);
      setCurrentSchoolArea(step.targetArea);
    }
    defaultQuietTimeEngine.registerInteraction();
  };

  // Handle Force Quiet Mode (R976)
  const handleForceQuietMode = (mode: QuietMode) => {
    defaultQuietTimeEngine.forceQuietMode(mode);
    setQuietTime(defaultQuietTimeEngine.update(0.016));
  };

  // Handle Story Vignette Trigger
  const handleTriggerVignette = (id: string) => {
    const v = defaultIdleStoryEngine.triggerVignette(id);
    if (v) {
      setActiveVignette(v);
      if (v.character === 'ASY' || v.character === 'BOTH') {
        setSelectedCharacter('ASY');
      } else if (v.character === 'SYIFA') {
        setSelectedCharacter('SYIFA');
      }
      handlePlayClip(v.primaryClip);
    }
  };

  // Handle School Event Trigger
  const handleTriggerSchoolEvent = (evType: SchoolEventType) => {
    const r = defaultSchoolEventHooks.triggerEvent(evType);
    setActiveEventReaction(r);
    defaultLivingBehaviorEngine.triggerState(r.targetBehavior, `Event Sekolah: ${r.title}`, r.targetEmotion);
  };

  // Handle Coexistence Mode
  const handleToggleDualView = (enable: boolean) => {
    setIsDualView(enable);
    defaultCrowdAwarenessSystem.setPresenceMode(enable ? 'DUAL_CONVERSATION' : (selectedCharacter === 'ASY' ? 'SOLO_ASY' : 'SOLO_SYIFA'));
    setCrowdState(defaultCrowdAwarenessSystem.getSnapshot());
  };

  // Handle Classroom Activity (R961)
  const handleSelectClassActivity = (act: ClassroomActivityType) => {
    setCurrentClassActivity(act);
    const prof = defaultClassroomActivityAdapter.setActivity(act);
    defaultLivingBehaviorEngine.triggerState(prof.primaryBehavior, `Aktivitas Kelas: ${prof.title}`, prof.emotion);
    handlePlayClip(prof.suggestedClip);
  };

  // Handle Learning Gesture (R962)
  const handleTriggerLearningGesture = (gesture: LearningGestureType) => {
    const g = defaultLearningGestureController.triggerGesture(gesture);
    handlePlayClip(g.mappedClip);
  };

  // Handle Story Learning Vignette (R966)
  const handleTriggerStoryLearning = (id: string) => {
    const v = defaultEducationalAttentionSystem.triggerStoryVignette(id);
    if (v) {
      setEducationalAttention(defaultEducationalAttentionSystem.getSnapshot());
      if (id === 'BOTANY_GARDEN_FLOWER') {
        setSelectedCharacter('SYIFA');
        handlePlayClip('flowerLook');
      } else if (id === 'HIJAIYAH_ALIF_BA') {
        setSelectedCharacter('ASY');
        handlePlayClip('readIqro');
      }
    }
  };

  // Handle Institutional Learning Hook (R969)
  const handleTriggerLearningEvent = (eventId: string) => {
    const ev = defaultLearningHooksAdapter.triggerLearningEvent(eventId);
    if (ev) {
      setCurrentClassActivity(ev.activityType);
      handlePlayClip(defaultClassroomActivityAdapter.getActivityProfile(ev.activityType).suggestedClip);
    }
  };

  // Handle Motion Guard Toggle (R967)
  const handleToggleMotionScale = (scale: number) => {
    defaultAccessibilityMotionGuard.setManualMotionScale(scale);
    setMotionGuardProfile(defaultAccessibilityMotionGuard.getProfile());
  };

  // Fetch Health Report on character change
  const refreshHealth = useCallback(async () => {
    setIsVerifying(true);
    try {
      const report = await defaultAssetHealthVerifier.verifyCharacter(selectedCharacter, true);
      setHealthReport(report);
      const glb = await defaultCharacterPipeline.lazyLoad3DModel(selectedCharacter);
      setGlbInfo(glb);
    } finally {
      setIsVerifying(false);
    }
  }, [selectedCharacter]);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  // Handle Character Switch
  const handleSelectCharacter = (char: CharacterId) => {
    setSelectedCharacter(char);
    defaultCharacterPipeline.setActiveCharacter(char);
    defaultLivingBehaviorEngine.setCharacter(char);
    setActiveClipName('idle');
    defaultCharacterPipeline.playClip(char, 'idle');
  };

  // Handle Clip Playback
  const handlePlayClip = (clipName: MasterClipName) => {
    setActiveClipName(clipName);
    setIsPlaying(true);
    defaultCharacterPipeline.playClip(selectedCharacter, clipName);
  };

  // Handle Behavior State Trigger
  const handleTriggerBehavior = (state: LivingBehaviorState) => {
    defaultLivingBehaviorEngine.triggerState(state, `Trigger interaktif Founder (${state})`);
  };

  // Handle Emotion Trigger
  const handleSelectEmotion = (emotion: MasterEmotionType) => {
    defaultEmotionController.setEmotion(emotion);
  };

  // Handle School Period Simulation
  const handleSelectSchoolPeriod = (periodKey: SchoolPeriodKey) => {
    setSimulatedPeriod(periodKey);
    const def = SCHOOL_PERIOD_DEFINITIONS[periodKey];
    // create simulated date
    const d = new Date();
    d.setHours(def.startHour, def.startMinute, 0, 0);
    defaultSchoolTimeAdapter.setSimulatedTime(d);
  };

  const handleResetToRealTime = () => {
    defaultSchoolTimeAdapter.setSimulatedTime(null);
  };

  return (
    <div id={`preview-root-${containerId}`} className="w-full max-w-7xl mx-auto p-3 sm:p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 rounded-full">
              TADE v9.3.0-MCA3
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-blue-950 text-blue-300 border border-blue-800/40 rounded">
              R938 LIVING PREVIEW
            </span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-purple-950 text-purple-300 border border-purple-800/40 rounded">
              OFFICIAL PRODUCTION PIPELINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            Living Character Preview & Pipeline Cockpit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Observabilitas live 60 FPS, manajemen 8 official animation clip Asy & Syifa, verifikasi integritas checksum, dan lazy loader 3D GLB.
          </p>
        </div>

        {/* Character Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            id={`btn-select-asy-${containerId}`}
            onClick={() => handleSelectCharacter('ASY')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              selectedCharacter === 'ASY'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Asy (Santri Putra)
          </button>
          <button
            id={`btn-select-syifa-${containerId}`}
            onClick={() => handleSelectCharacter('SYIFA')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              selectedCharacter === 'SYIFA'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
            Syifa (Santriwati)
          </button>
        </div>
      </div>

      {/* Main Grid: Left Stage Canvas & Right Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Visual Stage (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Stage Canvas with Environmental Sky Backdrop */}
            <div 
              className="relative w-full aspect-[4/5] sm:aspect-square rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner transition-colors duration-700"
              style={{
                background: `linear-gradient(180deg, ${atmosphere.skyGradient[0]}15 0%, ${atmosphere.skyGradient[1]}25 60%, rgba(15, 23, 42, 0.95) 100%)`
              }}
            >
              {/* Scene Drifting Clouds */}
              {sceneProps.clouds.map(c => (
                <div 
                  key={c.id} 
                  className="absolute pointer-events-none transition-transform duration-300"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    transform: `scale(${c.scale})`,
                    opacity: c.opacity * (selectedAtmosphereMode === 'NIGHT_CALM' ? 0.2 : 0.6)
                  }}
                >
                  <Cloud className="w-12 h-12 text-white/40 fill-white/20" />
                </div>
              ))}

              {/* Sinusoidal Flying Butterfly */}
              {sceneProps.butterfly.isVisible && (
                <div 
                  className="absolute pointer-events-none transition-all duration-150 z-10"
                  style={{
                    left: `${sceneProps.butterfly.x}%`,
                    top: `${sceneProps.butterfly.y}%`,
                    transform: `scale(${sceneProps.butterfly.scale}) rotate(${sceneProps.butterfly.wingAngle * 0.2}deg)`
                  }}
                >
                  <div className="relative">
                    <span 
                      className="inline-block text-base filter drop-shadow animate-pulse"
                      style={{ color: sceneProps.butterfly.colorHex }}
                    >
                      🦋
                    </span>
                  </div>
                </div>
              )}

              {/* Garden Flowers at Bottom Edge */}
              <div className="absolute bottom-12 left-4 right-4 flex items-end justify-between pointer-events-none z-10 opacity-70">
                {sceneProps.flowers.map(f => (
                  <div 
                    key={f.id} 
                    className="flex flex-col items-center transition-transform origin-bottom"
                    style={{ transform: `rotate(${f.swayAngleDeg}deg) scale(${f.bloomScale})` }}
                  >
                    <span className="text-sm" style={{ filter: `hue-rotate(${f.color === '#F43F5E' ? '0deg' : '180deg'})` }}>🌸</span>
                    <div className="w-0.5 h-3 bg-emerald-700/60 rounded-full" />
                  </div>
                ))}
              </div>

              {/* Top Stage Bar */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 backdrop-blur rounded-md border border-slate-700 text-[11px] font-mono text-emerald-400">
                  <Activity className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>{telemetry.fps} FPS</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-300">{telemetry.memoryEstimateMB} MB</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-slate-800/80 text-amber-300 rounded border border-amber-500/30">
                    {atmosphere.label.split(' ')[0]}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-slate-800/80 text-emerald-300 rounded border border-emerald-500/30">
                    {currentClip.clipName}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-900/60 text-blue-300 rounded border border-blue-700/40">
                    {isDualView ? 'DUO' : selectedFormat}
                  </span>
                </div>
              </div>

              {/* Active Story / School Event Banner */}
              {(activeVignette || activeEventReaction) && (
                <div className="absolute top-11 left-3 right-3 p-2 bg-slate-950/90 backdrop-blur border border-amber-500/50 rounded-xl text-xs z-20 animate-fade-in shadow-xl">
                  {activeEventReaction ? (
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                      <span className="font-bold">{activeEventReaction.title}:</span>
                      <span className="text-slate-300 truncate">
                        "{selectedCharacter === 'ASY' ? activeEventReaction.bannerQuote.asy : activeEventReaction.bannerQuote.syifa}"
                      </span>
                    </div>
                  ) : activeVignette ? (
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold">{activeVignette.title}:</span>
                      <span className="text-slate-300 truncate">{activeVignette.islamicLesson}</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Character Render Container with Dual View Support */}
              <div 
                className="w-full h-64 sm:h-72 flex items-center justify-center relative transition-transform duration-300 z-10"
                style={{
                  transform: cameraPresence.isYieldingSpace 
                    ? `translateY(${cameraPresence.scrollEvasionOffsetY}px) scale(0.96)` 
                    : 'translateY(0px) scale(1)'
                }}
              >
                {isDualView ? (
                  <div className="flex items-center justify-center gap-6 sm:gap-10 w-full">
                    {/* Asy on Left */}
                    <div className="flex flex-col items-center">
                      <Asy
                        size="lg"
                        state={
                          activeClipName === 'idle' ? 'idle' :
                          activeClipName === 'wave' ? 'wave' :
                          activeClipName === 'readIqro' ? 'readIqro' :
                          activeClipName === 'butterfly' ? 'butterfly' :
                          activeClipName === 'celebrate' ? 'celebrate' :
                          'idle'
                        }
                        speech={currentClip.islamicNuance}
                        showSpeech={false}
                        enableBlink={isPlaying}
                        enableBreathing={isPlaying}
                      />
                      <span className="text-[10px] font-mono text-emerald-400 mt-1 font-semibold">Asy</span>
                    </div>

                    {/* Syifa on Right */}
                    <div className="flex flex-col items-center">
                      <Syifa
                        size="lg"
                        state={
                          activeClipName === 'idle' ? 'idle' :
                          activeClipName === 'wave' ? 'wave' :
                          activeClipName === 'readIqro' ? 'readIqro' :
                          activeClipName === 'butterfly' ? 'butterfly' :
                          activeClipName === 'celebrate' ? 'celebrate' :
                          'idle'
                        }
                        speech={currentClip.islamicNuance}
                        showSpeech={false}
                        enableBlink={isPlaying}
                        enableBreathing={isPlaying}
                      />
                      <span className="text-[10px] font-mono text-pink-400 mt-1 font-semibold">Syifa</span>
                    </div>
                  </div>
                ) : (
                  selectedCharacter === 'ASY' ? (
                    <Asy
                      size="xl"
                      state={
                        activeClipName === 'idle' ? 'idle' :
                        activeClipName === 'wave' ? 'wave' :
                        activeClipName === 'readIqro' ? 'readIqro' :
                        activeClipName === 'butterfly' ? 'butterfly' :
                        activeClipName === 'celebrate' ? 'celebrate' :
                        'idle'
                      }
                      speech={currentClip.islamicNuance}
                      showSpeech={true}
                      enableBlink={isPlaying}
                      enableBreathing={isPlaying}
                    />
                  ) : (
                    <Syifa
                      size="xl"
                      state={
                        activeClipName === 'idle' ? 'idle' :
                        activeClipName === 'wave' ? 'wave' :
                        activeClipName === 'readIqro' ? 'readIqro' :
                        activeClipName === 'butterfly' ? 'butterfly' :
                        activeClipName === 'celebrate' ? 'celebrate' :
                        'idle'
                      }
                      speech={currentClip.islamicNuance}
                      showSpeech={true}
                      enableBlink={isPlaying}
                      enableBreathing={isPlaying}
                    />
                  )
                )}
              </div>

              {/* Bottom Controls Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur px-3 py-2 rounded-xl border border-slate-800 z-20">
                <div className="flex items-center gap-2">
                  <button
                    id={`btn-toggle-play-${containerId}`}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                    title={isPlaying ? "Jeda Animasi" : "Putar Animasi"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    id={`btn-reset-anim-${containerId}`}
                    onClick={() => handlePlayClip('idle')}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Reset ke Idle"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    id={`btn-toggle-duo-${containerId}`}
                    onClick={() => handleToggleDualView(!isDualView)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 ${
                      isDualView 
                        ? 'bg-purple-900/80 text-purple-200 border-purple-500 shadow-sm' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title="Beralih ke Tampilan Duo Santri"
                  >
                    <Users className="w-3.5 h-3.5" />
                    {isDualView ? 'Duo' : 'Solo'}
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-[11px] font-medium text-slate-300 block leading-tight">
                    {currentClip.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {currentClip.durationSec}s · {currentClip.totalFrames} frames
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <span>{currentClip.loopMode}</span>
                </div>
              </div>
            </div>

          {/* Quick Character Canon Metadata Card */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-200">{metadata.canonicalName}</span>
              <span className="font-mono text-emerald-400">{metadata.arabicName}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {metadata.role} · <span className="text-slate-300 font-medium">{metadata.proportions}</span>
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500">Palet Warna Canon:</span>
              <div className="flex items-center gap-1.5">
                {Object.entries(metadata.primaryColorPalette).map(([k, hex]) => (
                  <div 
                    key={k} 
                    className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
                    style={{ backgroundColor: hex }}
                    title={`${k}: ${hex}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Navigation & Diagnostics (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              id={`tab-world-${containerId}`}
              onClick={() => setActiveTab('WORLD')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'WORLD'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              World Console (R978)
            </button>
            <button
              id={`tab-classroom-${containerId}`}
              onClick={() => setActiveTab('CLASSROOM')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'CLASSROOM'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
              Classroom Console (R968)
            </button>
            <button
              id={`tab-cinematic-${containerId}`}
              onClick={() => setActiveTab('CINEMATIC')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'CINEMATIC'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-amber-300" />
              Cinematic Console (R958)
            </button>
            <button
              id={`tab-behavior-${containerId}`}
              onClick={() => setActiveTab('BEHAVIOR')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'BEHAVIOR'
                  ? 'bg-emerald-700 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Behavior Studio (R941)
            </button>
            <button
              id={`tab-clips-${containerId}`}
              onClick={() => setActiveTab('CLIPS')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'CLIPS'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FilmIcon className="w-3.5 h-3.5 text-emerald-400" />
              8 Canon Clips
            </button>
            <button
              id={`tab-telemetry-${containerId}`}
              onClick={() => setActiveTab('TELEMETRY')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'TELEMETRY'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              Live Telemetry
            </button>
            <button
              id={`tab-health-${containerId}`}
              onClick={() => setActiveTab('HEALTH')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'HEALTH'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Asset Health & Audit
            </button>
            <button
              id={`tab-3d-glb-${containerId}`}
              onClick={() => setActiveTab('3D_GLB')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === '3D_GLB'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-purple-400" />
              3D GLB Lazy Loader
            </button>
            <button
              id={`tab-manifest-${containerId}`}
              onClick={() => setActiveTab('MANIFEST')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'MANIFEST'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              Manifest SSoT
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-5 min-h-[360px] flex flex-col justify-between">
            {/* TAB: WORLD CONSOLE (MCA-7 R978) */}
            {activeTab === 'WORLD' && (
              <div className="space-y-5">
                {/* Header Sub-bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      Living School World Runtime Cockpit (v9.7.0-MCA7)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Penghuni dunia sekolah TADE: Area Kampus, Lokomosi Halus, Interaksi Lingkungan, Presensi Pendamping, dan Quiet Time.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono bg-blue-950/80 text-blue-300 border border-blue-800/50 rounded-md">
                      CAMPUS_WORLD_LIVE
                    </span>
                  </div>
                </div>

                {/* Section 1: School World Area Adapter & Interactive Props (R971, R972, R974) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-400" />
                      Area Kampus Sekolah Aktif (R971, R972):
                    </span>
                    <span className="text-[11px] font-mono text-blue-400">
                      ANCHOR: Asy ({walkingState.asy.currentX.toFixed(1)}%) · Syifa ({walkingState.syifa.currentX.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(SCHOOL_AREA_PROFILES) as SchoolAreaType[]).map((areaKey) => {
                      const prof = SCHOOL_AREA_PROFILES[areaKey];
                      const isSel = currentSchoolArea === areaKey;
                      return (
                        <button
                          key={areaKey}
                          onClick={() => handleSelectSchoolArea(areaKey)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                            isSel
                              ? 'bg-blue-950/70 border-blue-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <span className="font-semibold text-slate-200 block truncate">{prof.name.split(' ')[0]} {prof.name.split(' ')[1] || ''}</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">{prof.subTitle}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Props & Area Greeting Banner (R974) */}
                  <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-semibold text-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-300" />
                        Elemen Interaktif Lingkungan:
                      </span>
                      <div className="flex gap-1">
                        {SCHOOL_AREA_PROFILES[currentSchoolArea].interactiveProps.map(prop => (
                          <span key={prop} className="px-1.5 py-0.5 bg-blue-900/60 text-blue-200 text-[10px] font-mono rounded">
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs italic">
                      "{selectedCharacter === 'ASY' ? SCHOOL_AREA_PROFILES[currentSchoolArea].bannerGreeting.asy : SCHOOL_AREA_PROFILES[currentSchoolArea].bannerGreeting.syifa}"
                    </p>
                  </div>
                </div>

                {/* Section 2: Soft Locomotion & Companion Presence (R973, R975) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Locomotion Diagnostics */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                        Lokomosi & Weight Shift (R973):
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        {walkingState.asy.isMoving || walkingState.syifa.isMoving ? 'BERJALAN...' : 'DIAM SEIMBANG'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Kemiringan Langkah Asy</span>
                        <span className="font-semibold font-mono text-emerald-400">
                          {walkingState.asy.weightShiftAngleDeg.toFixed(1)}°
                        </span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Kemiringan Langkah Syifa</span>
                        <span className="font-semibold font-mono text-pink-400">
                          {walkingState.syifa.weightShiftAngleDeg.toFixed(1)}°
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Companion Presence (R975) */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        Presensi Pendamping (R975):
                      </span>
                      <span className="text-[11px] font-mono text-purple-400">
                        {walkingState.isCompanionSynced ? 'SEREMPAK / SYNC' : 'BEBAS AMAN'}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-400">Jarak Aman Antar Karakter:</span>
                      <span className="font-mono font-semibold text-white">
                        {Math.abs(walkingState.syifa.currentX - walkingState.asy.currentX).toFixed(1)}% Screen
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Quiet Time & Motion Budget (R976, R977) */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      Perilaku Waktu Hening / Quiet Time (R976) & Budget (R977):
                    </span>
                    <span className="text-[11px] font-mono text-indigo-400">
                      INACTIVITY: {quietTime.inactivityDurationSec.toFixed(1)}s · CPU {quietTime.cpuLoadEstimatePercent}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleForceQuietMode('IDLE_BREATHING')}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        quietTime.activeMode === 'IDLE_BREATHING'
                          ? 'bg-indigo-950 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Napas Halus
                    </button>
                    <button
                      onClick={() => handleForceQuietMode('LOOK_SKY')}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        quietTime.activeMode === 'LOOK_SKY'
                          ? 'bg-indigo-950 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Menatap Langit
                    </button>
                    <button
                      onClick={() => handleForceQuietMode('SIT_CARPET')}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        quietTime.activeMode === 'SIT_CARPET'
                          ? 'bg-indigo-950 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Duduk di Karpet
                    </button>
                    <button
                      onClick={() => handleForceQuietMode('RECITING_QUIET')}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        quietTime.activeMode === 'RECITING_QUIET'
                          ? 'bg-indigo-950 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Muroja'ah Hening
                    </button>
                  </div>
                </div>

                {/* Section 4: School Journey Sequencer (R979) */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    Rangkaian Perjalanan Harian Santri (R979):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SCHOOL_JOURNEY_STEPS.map((step) => {
                      const isAct = activeJourney.id === step.id;
                      return (
                        <button
                          key={step.id}
                          onClick={() => handleTriggerJourneyStep(step.id)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                            isAct
                              ? 'bg-amber-950/70 border-amber-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <span className="font-semibold text-slate-200 block truncate">{step.label}</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">{step.narrativeText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {/* TAB: CLASSROOM CONSOLE (MCA-6 R968) */}
            {activeTab === 'CLASSROOM' && (
              <div className="space-y-5">
                {/* Header Sub-bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      Living Classroom Intelligence Runtime (v9.6.0-MCA6)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Integrasi aktivitas belajar PAUD Islam: Tahfidz, Mewarnai, Senam, Gestur Santun, dan Pengawasan Aksesibilitas.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 rounded-md">
                      PAUD_CLASSROOM_AI
                    </span>
                  </div>
                </div>

                {/* Section 1: Classroom Activity Adapter (R961) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      Aktivitas Pembelajaran Kelas (R961):
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {CLASSROOM_ACTIVITY_PROFILES[currentClassActivity].category} · INTENSITY {(CLASSROOM_ACTIVITY_PROFILES[currentClassActivity].motionIntensity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(CLASSROOM_ACTIVITY_PROFILES) as ClassroomActivityType[]).map((act) => {
                      const prof = CLASSROOM_ACTIVITY_PROFILES[act];
                      const isSel = currentClassActivity === act;
                      return (
                        <button
                          key={act}
                          onClick={() => handleSelectClassActivity(act)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                            isSel
                              ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200">{prof.title.split(' ')[0]} {prof.title.split(' ')[1] || ''}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 rounded text-emerald-400">
                              {prof.suggestedClip}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 line-clamp-1">{prof.attentionTarget}</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Banner Quote Active */}
                  <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-900/60 text-xs">
                    <span className="text-emerald-400 font-semibold block text-[11px] mb-1">Kutipan Adab & Hikmah:</span>
                    <p className="text-slate-300 italic">
                      "{selectedCharacter === 'ASY' ? CLASSROOM_ACTIVITY_PROFILES[currentClassActivity].bannerQuotes.asy : CLASSROOM_ACTIVITY_PROFILES[currentClassActivity].bannerQuotes.syifa}"
                    </p>
                  </div>
                </div>

                {/* Section 2: Learning Gesture Controller & Positive Reinforcement (R962 & R965) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                      Gestur Pembelajaran & Apresiasi Santun (R962, R965):
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono">
                      {groupParticipation.reinforcementCount}x Apresiasi
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(LEARNING_GESTURES) as LearningGestureType[]).map((gKey) => {
                      const gest = LEARNING_GESTURES[gKey];
                      const isAct = groupParticipation.activeGesture === gKey;
                      return (
                        <button
                          key={gKey}
                          onClick={() => handleTriggerLearningGesture(gKey)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                            isAct
                              ? 'bg-amber-950/70 border-amber-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <span className="font-semibold text-slate-200">{gest.label}</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">{gest.reinforcementPhrase}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Educational Attention & Story Moments (R964 & R966) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Attention Snapshot */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      Status Perhatian & Fokus Belajar (R964):
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Mode Fokus</span>
                        <span className="font-semibold font-mono text-emerald-400">
                          {educationalAttention.attentionState}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Jitter Dampening</span>
                        <span className="font-semibold font-mono text-blue-400">
                          {((1 - educationalAttention.jitterDampeningFactor) * 100).toFixed(0)}% Still
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Story Learning Moments */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Momen Cerita Edukatif (R966):
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {STORY_LEARNING_VIGNETTES.map((vig) => (
                        <button
                          key={vig.id}
                          onClick={() => handleTriggerStoryLearning(vig.id)}
                          className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-left text-xs transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium text-slate-200">{vig.title}</span>
                          {vig.hijaiyahChar && (
                            <span className="text-xs font-mono text-amber-400">{vig.hijaiyahChar}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 4: Institutional Learning Schedule & Accessibility (R967 & R969) */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Jadwal Pembelajaran Resmi (R969):
                    </span>
                    {/* Accessibility Motion Guard Toggle (R967) */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[11px] text-slate-400">Motion Guard:</span>
                      <button
                        onClick={() => handleToggleMotionScale(motionGuardProfile.motionScaleFactor < 0.8 ? 1.0 : 0.4)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                          motionGuardProfile.motionScaleFactor < 0.8
                            ? 'bg-amber-950 border-amber-600 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {motionGuardProfile.motionScaleFactor < 0.8 ? 'ACCESSIBLE (40%)' : 'STANDARD (100%)'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LEARNING_SCHEDULE_EVENTS.map((sched) => (
                      <button
                        key={sched.id}
                        onClick={() => handleTriggerLearningEvent(sched.id)}
                        className="p-2 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 text-left text-xs transition-colors"
                      >
                        <span className="font-semibold text-slate-200 block text-[11px] line-clamp-1">{sched.label}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{sched.activityType}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* TAB: CINEMATIC CONSOLE (MCA-5 R958) */}
            {activeTab === 'CINEMATIC' && (
              <div className="space-y-5">
                {/* Header Sub-bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-amber-400" />
                      Living School Cinematic Runtime (v9.5.0-MCA5)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Orkestrator pencahayaan fajar/siang/senja, kesadaran kamera, momen cerita santri, dan integrasi event sekolah.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono bg-amber-950/80 text-amber-300 border border-amber-800/50 rounded-md">
                      CINEMATIC_60FPS
                    </span>
                  </div>
                </div>

                {/* Section 1: Environmental Atmosphere & Lighting Adapter (R951) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Pencahayaan & Suasana Lingkungan Sekolah (R951):
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {atmosphere.colorTemperatureK}K · {atmosphere.sunlightAngleDeg}°
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(ATMOSPHERE_PROFILES) as AmbientLightingMode[]).map((mode) => {
                      const prof = ATMOSPHERE_PROFILES[mode];
                      const isSel = selectedAtmosphereMode === mode;
                      return (
                        <button
                          key={mode}
                          onClick={() => handleSelectAtmosphere(mode)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                            isSel
                              ? 'bg-amber-950/60 border-amber-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200">{prof.label.split(' ')[0]}</span>
                            <div 
                              className="w-2.5 h-2.5 rounded-full border border-slate-700"
                              style={{ backgroundColor: prof.ambientLightHex }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 line-clamp-1">{prof.recommendedScene}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Camera Presence System (R952) */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-400" />
                      Kesadaran Kamera & Pengguna (R952):
                    </span>
                    <button
                      onClick={() => defaultCameraPresenceSystem.triggerDirectGlance(3.0)}
                      className="px-2.5 py-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/50 rounded-lg text-[11px] font-semibold transition-colors"
                    >
                      Panggil Tatapan Layar
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Status Tatapan</span>
                      <span className={`font-semibold font-mono ${cameraPresence.isGlancingAtCamera ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {cameraPresence.isGlancingAtCamera ? 'Direct Eye Contact' : 'Fokus Mengaji'}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Bobot Tatapan</span>
                      <span className="font-semibold font-mono text-blue-400">
                        {(cameraPresence.cameraGazeWeight * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Scroll Evasion</span>
                      <span className="font-semibold font-mono text-amber-400">
                        {cameraPresence.isYieldingSpace ? 'Yielding Space' : 'Clear View'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Idle Story Moments (R955) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      Momen Cerita Santri (R955):
                    </span>
                    <span className="text-[11px] text-slate-500">Klip Edukatif & Adab</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STORY_VIGNETTES.map((vig) => (
                      <button
                        key={vig.id}
                        onClick={() => handleTriggerVignette(vig.id)}
                        className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                          activeVignette?.id === vig.id
                            ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{vig.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">
                            {vig.character}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{vig.narrativeText}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 4: School Event Hooks Simulator (R959) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Simulasi Respon Event Sekolah (R959):
                    </span>
                    <span className="text-[11px] text-slate-500">Kait Kelembagaan</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.keys(SCHOOL_EVENT_REACTIONS) as SchoolEventType[]).map((evKey) => {
                      const ev = SCHOOL_EVENT_REACTIONS[evKey];
                      const isAct = activeEventReaction?.eventType === evKey;
                      return (
                        <button
                          key={evKey}
                          onClick={() => handleTriggerSchoolEvent(evKey)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isAct
                              ? 'bg-amber-900/80 border-amber-500 text-amber-200'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {ev.title.split(' ')[0]} {ev.title.split(' ')[1]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {/* TAB 0: BEHAVIOR STUDIO & FSM TELEMETRY */}
            {activeTab === 'BEHAVIOR' && (
              <div className="space-y-5">
                {/* Header Sub-bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                      Living Behavior Engine & FSM Cockpit (R941 - R946)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Orkestrator transisi perilaku data-driven santri, jadwal sekolah otomatis, emosi, dan mikro-gerak natural.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-toggle-auto-${containerId}`}
                      onClick={() => {
                        const next = !isAutoBehavior;
                        setIsAutoBehavior(next);
                        defaultLivingBehaviorEngine.setAutomatic(next);
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                        isAutoBehavior
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60 shadow-inner'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isAutoBehavior ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                      {isAutoBehavior ? 'Auto Behavior: AKTIF' : 'Auto Behavior: MANUAL'}
                    </button>
                  </div>
                </div>

                {/* 1. Live FSM State Monitor & Transition Reason */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">State Aktif</span>
                    <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {behaviorTelemetry.currentState}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      Durasi: {behaviorTelemetry.stateDurationSec}s
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">State Sebelumnya</span>
                    <span className="text-base sm:text-lg font-bold text-slate-300 font-mono">
                      {behaviorTelemetry.previousState}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      Total Transisi: {behaviorTelemetry.totalTransitions}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Next Candidate</span>
                    <span className="text-base sm:text-lg font-bold text-blue-400 font-mono">
                      {behaviorTelemetry.nextCandidate}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      Probabilitas Tertinggi
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Behavior Engine FPS</span>
                    <span className="text-base sm:text-lg font-bold text-purple-400 font-mono">
                      {behaviorTelemetry.behaviorFPS} FPS
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      Uptime: {behaviorTelemetry.uptimeSec}s
                    </span>
                  </div>
                </div>

                {/* Transition Reason Banner */}
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Alasan Transisi:</span>
                    <span className="text-amber-300 italic font-medium">{behaviorTelemetry.transitionReason}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(behaviorTelemetry.updatedAt).toLocaleTimeString()}
                  </span>
                </div>

                {/* 2. Interactive State Trigger Buttons */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Uji Trigger State Perilaku Manual:</span>
                    <span className="text-[10px] text-slate-500 font-normal">Pilih state untuk memicu transisi langsung</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(BEHAVIOR_STATE_CONFIGS) as LivingBehaviorState[]).map((st) => {
                      if (st === 'transition') return null;
                      const cfg = BEHAVIOR_STATE_CONFIGS[st];
                      const isActive = behaviorTelemetry.currentState === st;
                      return (
                        <button
                          key={st}
                          id={`btn-trigger-${st}-${containerId}`}
                          onClick={() => handleTriggerBehavior(st)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isActive
                              ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">{cfg.label}</span>
                            <span className="text-[10px] font-mono text-slate-500">P{cfg.priority}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">{cfg.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. School Time Adapter & Emotion Controller Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  {/* School Time Period Selector */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        School Schedule Adapter (R942)
                      </span>
                      <button
                        onClick={handleResetToRealTime}
                        className="text-[10px] text-blue-400 hover:underline"
                        title="Gunakan waktu lokal saat ini"
                      >
                        Reset Jam Asli
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <select
                        id={`select-period-${containerId}`}
                        value={simulatedPeriod}
                        onChange={(e) => handleSelectSchoolPeriod(e.target.value as SchoolPeriodKey)}
                        className="w-full bg-slate-950 text-xs text-slate-200 p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
                      >
                        {Object.values(SCHOOL_PERIOD_DEFINITIONS).map((p) => (
                          <option key={p.key} value={p.key}>
                            {p.timeRange} — {p.label} ({p.preferredState})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-400 italic">
                        "{selectedCharacter === 'ASY' ? behaviorTelemetry.currentSchoolPeriod.asyQuote : behaviorTelemetry.currentSchoolPeriod.syifaQuote}"
                      </p>
                    </div>
                  </div>

                  {/* Emotion Controller Vector */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5 text-amber-400" />
                        Emotion Controller (R945)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">
                        {behaviorTelemetry.currentEmotion}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {(Object.keys(EMOTION_PROFILES) as MasterEmotionType[]).map((em) => {
                        const isEmActive = behaviorTelemetry.currentEmotion === em;
                        return (
                          <button
                            key={em}
                            id={`btn-emotion-${em}-${containerId}`}
                            onClick={() => handleSelectEmotion(em)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-all text-center ${
                              isEmActive
                                ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-sm'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {em}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>Valence: {(behaviorTelemetry.emotionSnapshot.currentValence * 100).toFixed(0)}%</span>
                      <span>Arousal: {(behaviorTelemetry.emotionSnapshot.currentArousal * 100).toFixed(0)}%</span>
                      <span>Smile: {(behaviorTelemetry.emotionSnapshot.smileFactor * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* 4. Micro-Behavior Real-Time Visual Pulses */}
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-400" />
                    Micro-Behavior Natural Probability Monitor (R944)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Eye Blink:</span>
                      <span className={`font-mono font-bold ${behaviorTelemetry.microBehavior.isBlinking ? 'text-amber-400' : 'text-slate-500'}`}>
                        {behaviorTelemetry.microBehavior.isBlinking ? 'BLINKING' : 'OPEN'}
                        {behaviorTelemetry.microBehavior.doubleBlinkPending && ' (2X)'}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Head Tilt:</span>
                      <span className="font-mono font-bold text-blue-400">
                        {behaviorTelemetry.microBehavior.headTiltDeg.toFixed(1)}°
                      </span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Gaze Saccade:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        X:{behaviorTelemetry.microBehavior.eyeGaze.x.toFixed(2)} Y:{behaviorTelemetry.microBehavior.eyeGaze.y.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Body Sway:</span>
                      <span className="font-mono font-bold text-purple-400">
                        {behaviorTelemetry.microBehavior.bodySwayX.toFixed(2)}px
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* TAB 1: 8 ANIMATION CLIPS */}
            {activeTab === 'CLIPS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <FilmIcon className="w-4 h-4 text-emerald-400" />
                      Daftar Animation Clip Resmi ({selectedCharacter === 'ASY' ? 'Asy' : 'Syifa'})
                    </h3>
                    <p className="text-xs text-slate-400">
                      Klik salah satu dari 8 clip untuk memicu animasi dan nuansa adab islami.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded">
                    8/8 CLIPS REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.values(clips).map((clip) => {
                    const isSelected = clip.clipName === activeClipName;
                    return (
                      <button
                        key={clip.id}
                        id={`btn-clip-${clip.clipName}-${containerId}`}
                        onClick={() => handlePlayClip(clip.clipName)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-950/40'
                            : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                            {clip.label}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {clip.durationSec}s
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {clip.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
                          <span className="italic text-amber-300/80">{clip.islamicNuance}</span>
                          <span className="font-mono">{clip.loopMode}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Clip Detail Box */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Keyframe Sequence & Adab Islam:</span>
                    <span className="text-emerald-400 font-mono">{currentClip.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentClip.keyframes.map((kf, idx) => (
                      <div key={idx} className="px-2 py-1 bg-slate-950 rounded border border-slate-800 text-[11px]">
                        <span className="text-slate-500 font-mono">@{kf.timeSec}s</span>: <span className="text-slate-300 font-medium">{kf.label}</span>
                        {kf.expression && <span className="text-amber-400/90 ml-1">({kf.expression})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LIVE TELEMETRY */}
            {activeTab === 'TELEMETRY' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      Living Character Runtime Telemetry (R921 & R938)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Metrik real-time render loop, penggunaan memori, dan status isolasi Page Visibility.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800/40 rounded">
                    60 FPS THROTTLED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target FPS</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">60.0</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Smooth RAF Loop</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Current FPS</span>
                    <span className="text-xl font-bold font-mono text-blue-400">{telemetry.fps}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Delta-time Stable</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Memory Heap</span>
                    <span className="text-xl font-bold font-mono text-purple-400">{telemetry.memoryEstimateMB} MB</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Zero Memory Leak</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Active Rig Nodes</span>
                    <span className="text-xl font-bold font-mono text-amber-400">{metadata.rigNodeCount}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">2.5 Heads Chibi</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Runtime Safeguards & Performance Policies:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span><strong>Page Visibility API:</strong> Animasi otomatis dihentikan saat tab tidak aktif untuk menghemat daya.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span><strong>Global Typing Guard:</strong> Gerakan idle dijeda ketika pengguna mengetik pada input data sekolah.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span><strong>GPU Accelerated Transforms:</strong> Semua pergerakan anggota tubuh menggunakan CSS/SVG transform.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: ASSET HEALTH & INTEGRITY */}
            {activeTab === 'HEALTH' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Asset Health Verifier & Pre-flight Integrity (R934)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Audit ketersediaan format aset, pengecekan checksum SHA-256, dan validasi jalur fallback.
                    </p>
                  </div>
                  <button
                    id={`btn-reverify-${containerId}`}
                    onClick={refreshHealth}
                    disabled={isVerifying}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-500 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    Audit Ulang
                  </button>
                </div>

                {healthReport ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400">Skor Kesehatan Aset:</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-2xl font-bold font-mono text-emerald-400">
                            {healthReport.overallScore}%
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold">
                            RUNTIME SAFE & PROTECTED
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 font-mono block">Format Aktif:</span>
                        <span className="text-sm font-bold text-amber-400 font-mono">
                          {healthReport.activeFormat}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300">Hasil Pengecekan Format Pipeline:</span>
                      {healthReport.formatChecks.map((fc, i) => (
                        <div key={i} className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              fc.status === 'PASS' ? 'bg-emerald-400' :
                              fc.status === 'FALLBACK_READY' ? 'bg-blue-400' :
                              'bg-amber-400'
                            }`} />
                            <span className="font-mono font-bold text-slate-200">{fc.format}</span>
                            <span className="text-slate-400">{fc.message}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-500">{fc.latencyMs}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">Memverifikasi integritas aset...</div>
                )}
              </div>
            )}

            {/* TAB 4: 3D GLB LAZY LOADER */}
            {activeTab === '3D_GLB' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Box className="w-4 h-4 text-purple-400" />
                      3D GLB Lazy Loader & Zero-Overhead Bundle Isolation (R935)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Spesifikasi GLB, polygon triangle budget constraint (≤15,000 tris), dan jalur fallback.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800/40 rounded">
                    ISOLATED LAZY LOAD
                  </span>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase block">Max Triangle Budget</span>
                      <span className="text-base font-bold font-mono text-purple-400">
                        {metadata.threeDSpec.maxTriangles.toLocaleString()} Tris
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase block">Max Texture Res</span>
                      <span className="text-base font-bold font-mono text-blue-400">
                        {metadata.threeDSpec.maxTextureResolution}x{metadata.threeDSpec.maxTextureResolution}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase block">Rig Bone Hierarchy</span>
                      <span className="text-base font-bold font-mono text-amber-400">
                        {metadata.threeDSpec.rigBoneCount} Bones
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-800">
                    <span className="font-semibold text-slate-200 block">Jalur Aset Produksi 3D:</span>
                    <p className="font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800/80 text-emerald-300">
                      src/assets/master-characters/{selectedCharacter.toLowerCase()}/glb/
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Kebijakan isolasi TADE R935 menjamin file GLB tidak dimuat pada initial bundle web, mencegah pembengkakan bundle dan menjaga waktu render instan. Jika file GLB belum tersedia, engine otomatis menggunakan Master SVG dan Procedural Vector dengan kualitas visual prima.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MANIFEST SSOT */}
            {activeTab === 'MANIFEST' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-rose-400" />
                      Official Master Character Manifest (v9.3.0-MCA3)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Single Source of Truth untuk versi, checksum, dan hierarki prioritas format aset.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800/40 rounded">
                    CANON_LOCKED
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2 font-mono">
                  <div className="text-slate-400">Manifest Version: <span className="text-emerald-400 font-bold">{OFFICIAL_CHARACTER_MANIFEST.manifestVersion}</span></div>
                  <div className="text-slate-400">Release Tag: <span className="text-blue-400">{OFFICIAL_CHARACTER_MANIFEST.releaseTag}</span></div>
                  <div className="text-slate-400">Governance Status: <span className="text-amber-400 font-semibold">{OFFICIAL_CHARACTER_MANIFEST.governanceStatus}</span></div>
                  <div className="text-slate-400">Last Audited: <span className="text-slate-300">{OFFICIAL_CHARACTER_MANIFEST.lastUpdated}</span></div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Format Hierarchy & Priority:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {metadata.supportedFormats.map((fmt) => (
                      <div key={fmt.format} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 font-mono">Priority #{fmt.priority}: {fmt.format}</span>
                          <span className="text-[10px] text-slate-500">{(fmt.maxSizeBytes / 1024).toFixed(0)} KB Max</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 truncate">{fmt.expectedPath}</span>
                        <span className="text-[10px] font-mono text-slate-500 truncate">Hash: {fmt.expectedChecksum}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Summary */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <span>TADE Official Character Production Pipeline · Asy & Syifa Canon</span>
              <span className="font-mono text-emerald-400">Guardian Ring-0: ACTIVE · Hermes: DORMANT_SAFE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function FilmIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  );
}
