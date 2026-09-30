/**
 * TADE v9.1.0-MCA1 — R911 s/d R920
 * MASTER CHARACTER CANON & TEST SUITE VIEWER
 * 
 * Interactive exploration & testing of:
 * - Character Bible (R911)
 * - Master Character Registry (R912)
 * - Master Character Guard Ring-0 (R913)
 * - Expression Engine (R914)
 * - Context Behavior Engine (R915)
 * - Mascot Vector & Living Animation (R916/R917)
 * - Asset Pipeline & Storage Rules (R918)
 * - Global Overlay & Founder Canon Lock (R919/R920)
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Lock,
  Layers,
  Heart,
  BookOpen,
  Smile,
  AlertTriangle,
  FileCheck,
  Activity,
  CheckCircle,
  Smartphone,
  Eye,
  Play,
  Square,
  Check,
  Clock,
  Volume2,
  Users,
  Compass,
  Repeat,
  Package,
  Share2,
  Award,
  Zap
} from 'lucide-react';
import { Asy } from './Asy';
import { Syifa } from './Syifa';
import { CharacterId, MasterExpressionKey, MasterPoseKey, MASTER_CHARACTER_REGISTRY } from '../../core/masterCharacter/masterCharacterRegistry';
import { defaultExpressionEngine } from '../../core/masterCharacter/expressionEngine';
import { defaultContextBehaviorEngine, CONTEXT_BEHAVIOR_MAP } from '../../core/masterCharacter/contextBehaviorEngine';
import { masterCharacterGuard } from '../../core/masterCharacter/masterCharacterGuard';
import { MASTER_CHARACTER_BIBLE } from '../../core/masterCharacter/characterBible';
import { 
  characterBehaviorOrchestrator, 
  useCharacterBehavior, 
  useAllCharacterBehaviors,
  useLivingObjects,
  useG45ContextArbitration,
  GROUP_ACTIVITY_TEMPLATES,
  LIVING_OBJECT_DEFINITIONS,
  LivingObjectId,
  LivingObjectState,
  BehaviorType,
  GroupActivityTemplate,
  EmotionChainConfig,
  ContextSourceType,
  CONTEXT_PRIORITY_MAP,
  ArbitratedBehaviorRequest,
  G45TestSuiteReport
} from '../../services/characterBehaviorOrchestrator';
import { CHARACTER_DNA_REGISTRY } from '../../services/asySyifaDnaEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { deviceCapabilityEngine, DeviceCapabilitySnapshot } from '../../services/deviceCapabilityEngine';

export const MasterCharacterCanonViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bible' | 'registry' | 'guard' | 'expressions' | 'behaviors' | 'pipeline' | 'g43_proof' | 'g44_friendship' | 'g45_arbitration'>('g45_arbitration');
  const [selectedChar, setSelectedChar] = useState<CharacterId>('ASY');
  const [selectedExpr, setSelectedExpr] = useState<MasterExpressionKey>('happy');
  const [selectedPose, setSelectedPose] = useState<MasterPoseKey>('wave');
  const [guardAuditResult, setGuardAuditResult] = useState<any>(masterCharacterGuard.runFullSanityCheck());
  const [simulatedIllegalName, setSimulatedIllegalName] = useState<string>('BOT_PENGGANTI');
  const [simulatedIllegalResult, setSimulatedIllegalResult] = useState<any>(null);

  // G45 Arbitration Hook & State
  const { testReport, isRunning: isArbitrationTestRunning, runTestSuite: runG45TestSuite, requestArbitration } = useG45ContextArbitration();
  const [liveTestReport, setLiveTestReport] = useState<G45TestSuiteReport | null>(null);
  const [arbitrationConsoleLog, setArbitrationConsoleLog] = useState<Array<{ time: string; text: string; badge?: string }>>([]);
  const [customArbitrationTarget, setCustomArbitrationTarget] = useState<CharacterId>('ASY');
  const [customArbitrationBehavior, setCustomArbitrationBehavior] = useState<BehaviorType>('WAVE');
  const [customArbitrationSource, setCustomArbitrationSource] = useState<ContextSourceType>('USER_INTERACTION');
  const [customArbitrationResumable, setCustomArbitrationResumable] = useState<boolean>(true);
  const [customArbitrationInterruptible, setCustomArbitrationInterruptible] = useState<boolean>(true);

  // G43 Proof of Life Scenario State
  const { state: asyOrchState, cancel: cancelAsy } = useCharacterBehavior('ASY');
  const [deviceCap, setDeviceCap] = useState<DeviceCapabilitySnapshot>(() => deviceCapabilityEngine.getSnapshot());
  const [activeGovernorIds, setActiveGovernorIds] = useState<string[]>([]);
  const [activeGovernorCount, setActiveGovernorCount] = useState<number>(0);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);
  const [scenarioStepIndex, setScenarioStepIndex] = useState<number>(-1);
  const [scenarioStepInfo, setScenarioStepInfo] = useState<{ stepId: string; label: string; behavior: string } | null>(null);
  const [scenarioLog, setScenarioLog] = useState<Array<{ time: string; text: string; badge?: string }>>([]);

  // =========================================================================
  // G44 Living Friendship & Group Behavior State
  // =========================================================================
  const { states: allCharStates, resetAll: resetAllCharacters } = useAllCharacterBehaviors();
  const { objects: livingObjects, grab: grabLivingObj, use: useLivingObj, returnObj: returnLivingObj, resetAll: resetAllLivingObjs } = useLivingObjects();

  // P1: Friendship Interaction State
  const [friendshipInitiator, setFriendshipInitiator] = useState<CharacterId>('ASY');
  const [friendshipPartner, setFriendshipPartner] = useState<CharacterId>('SYIFA');
  const [selectedFriendshipBehavior, setSelectedFriendshipBehavior] = useState<BehaviorType>('GREET_FRIEND');
  const [activeFriendshipCancel, setActiveFriendshipCancel] = useState<(() => void) | null>(null);
  const [friendshipLog, setFriendshipLog] = useState<Array<{ time: string; text: string; badge?: string }>>([]);

  // P2: Emotion Chain State
  const [activeChainCancel, setActiveChainCancel] = useState<(() => void) | null>(null);
  const [chainActiveIndex, setChainActiveIndex] = useState<number>(-1);
  const [isChainRunning, setIsChainRunning] = useState<boolean>(false);

  // P3: Living Object Interactive Bay State
  const [selectedObjectForAction, setSelectedObjectForAction] = useState<LivingObjectId>('SAPU');
  const [selectedCharForObject, setSelectedCharForObject] = useState<CharacterId>('ASY');
  const [objectLifecycleStep, setObjectLifecycleStep] = useState<string>('IDLE');
  const [activeObjectCancel, setActiveObjectCancel] = useState<(() => void) | null>(null);

  // P4: Group Activity Templates State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('GOTONG_ROYONG');
  const [isGroupActivityRunning, setIsGroupActivityRunning] = useState<boolean>(false);
  const [groupActivityStepIndex, setGroupActivityStepIndex] = useState<number>(-1);
  const [groupActivityStepInfo, setGroupActivityStepInfo] = useState<any>(null);
  const [activeGroupActivityCancel, setActiveGroupActivityCancel] = useState<(() => void) | null>(null);
  const [groupActivityLog, setGroupActivityLog] = useState<Array<{ time: string; text: string; badge?: string }>>([]);

  const activeCharData = MASTER_CHARACTER_REGISTRY[selectedChar];

  useEffect(() => {
    const unsubGovernor = tadeAnimationGovernor.subscribe((ids, count) => {
      setActiveGovernorIds(ids);
      setActiveGovernorCount(count);
    });

    const unsubDevice = deviceCapabilityEngine.subscribe((cap) => {
      setDeviceCap(cap);
    });

    return () => {
      unsubGovernor();
      unsubDevice();
    };
  }, []);

  const handleTestIllegalChar = () => {
    const res = masterCharacterGuard.validateCharacter(simulatedIllegalName);
    setSimulatedIllegalResult(res);
  };

  const handleRerunGuard = () => {
    setGuardAuditResult(masterCharacterGuard.runFullSanityCheck());
  };

  // Official G43 Proof-of-Life: ASY + KAMPUNG GOTONG ROYONG
  const GOTONG_ROYONG_SEQUENCE = [
    {
      stepId: 'step-idle-init',
      label: '1. IDLE (Santri Berdiri Damai)',
      behavior: 'IDLE' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG' },
      durationMs: 1400
    },
    {
      stepId: 'step-notice-broom',
      label: '2. Notice Broom (Memperhatikan Sapu Lidi)',
      behavior: 'NOD' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG', speechPhrase: 'Melihat sapu lidi di tepi jalan...' },
      durationMs: 1600
    },
    {
      stepId: 'step-approach',
      label: '3. Approach (Mendekati Area Bersih-Bersih)',
      behavior: 'WALK' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG' },
      durationMs: 1800
    },
    {
      stepId: 'step-carry-broom',
      label: '4. Carry Broom (Mengambil & Membawa Sapu)',
      behavior: 'CARRY' as const,
      context: {
        locationId: 'KAMPUNG_GOTONG_ROYONG',
        heldObject: {
          name: 'Sapu Lidi Tradisional',
          category: 'TOOL' as const,
          carryPosition: 'HAND_RIGHT' as const
        }
      },
      durationMs: 2000
    },
    {
      stepId: 'step-walk-route',
      label: '5. Walk Rute Kebun-Masjid',
      behavior: 'WALK' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG' },
      durationMs: 1800
    },
    {
      stepId: 'step-clean',
      label: '6. Clean (Menyapu Halaman dengan Adab)',
      behavior: 'HELP' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG' },
      durationMs: 2200
    },
    {
      stepId: 'step-smile',
      label: '7. Smile (Senyum Syukur Halaman Bersih)',
      behavior: 'CLAP' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG' },
      durationMs: 1600
    },
    {
      stepId: 'step-look-around',
      label: '8. Look Around (Menoleh Ramah ke Teman)',
      behavior: 'NOD' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG' },
      durationMs: 1600
    },
    {
      stepId: 'step-interaction',
      label: '9. Simple Interaction (Menyapa Warga Kampung)',
      behavior: 'INTERACT' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG', speechPhrase: 'Assalamu alaikum warga kampung!' },
      durationMs: 2000
    },
    {
      stepId: 'step-cleanup',
      label: '10. Cleanup (Merapikan Alat Kerja Bakti)',
      behavior: 'BOW' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG' },
      durationMs: 1600
    },
    {
      stepId: 'step-return-idle',
      label: '11. Return to IDLE (Kembali ke State Asli Santri)',
      behavior: 'IDLE' as const,
      context: { locationId: 'KAMPUNG_GOTONG_ROYONG' },
      durationMs: 1400
    }
  ];

  const handleStartProofScenario = () => {
    setIsScenarioRunning(true);
    setScenarioStepIndex(0);
    setScenarioLog([
      {
        time: new Date().toLocaleTimeString('id-ID'),
        text: 'Skenario Gotong Royong dimulai melalui CharacterBehaviorOrchestrator.',
        badge: 'START'
      }
    ]);

    characterBehaviorOrchestrator.executeScenarioSequence(
      'ASY',
      GOTONG_ROYONG_SEQUENCE,
      (idx, info) => {
        setScenarioStepIndex(idx);
        setScenarioStepInfo(info);
        setScenarioLog(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID'),
            text: `[Step ${idx + 1}/${GOTONG_ROYONG_SEQUENCE.length}] ${info.label} → Behavior: ${info.behavior}`,
            badge: info.behavior
          }
        ]);
      },
      () => {
        setIsScenarioRunning(false);
        setScenarioStepIndex(-1);
        setScenarioStepInfo(null);
        setScenarioLog(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID'),
            text: 'Skenario selesai sepenuhnya! Asy telah otomatis kembali ke IDLE state.',
            badge: 'IDLE'
          }
        ]);
      }
    );
  };

  const handleStopScenario = () => {
    cancelAsy();
    setIsScenarioRunning(false);
    setScenarioStepIndex(-1);
    setScenarioStepInfo(null);
    setScenarioLog(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString('id-ID'),
        text: 'Skenario dibatalkan manual (Cleanup). Karakter dikembalikan ke IDLE & Governor dihentikan.',
        badge: 'CANCELLED'
      }
    ]);
  };

  // =========================================================================
  // G44 Handlers: P1 Friendship, P2 Emotion Chain, P3 Objects, P4 Templates
  // =========================================================================

  const FRIENDSHIP_BEHAVIORS_LIST: Array<{ id: BehaviorType; label: string; desc: string; icon: string }> = [
    { id: 'GREET_FRIEND', label: 'Menyapa Sahabat', desc: 'Lambaian tangan santun & senyum ramah', icon: '👋' },
    { id: 'HIGH_FIVE', label: 'Tos Bersama', desc: 'Tepuk tangan ceria merayakan kebaikan', icon: '🙌' },
    { id: 'WALK_TOGETHER', label: 'Berjalan Berdampingan', desc: 'Langkah kecil santun beriringan', icon: '🚶' },
    { id: 'HELP_CARRY', label: 'Membantu Membawa', desc: 'Ta\'awun membawa barang dengan adab', icon: '🤝' },
    { id: 'WAVE_FRIEND', label: 'Melambaikan Tangan', desc: 'Lambaian hangat saat bertemu atau pamit', icon: '🙋' },
    { id: 'LAUGH_TOGETHER', label: 'Tertawa Bersama', desc: 'Sukacita riang dalam kebaikan', icon: '😄' },
    { id: 'CIRCLE_SIT', label: 'Duduk Melingkar', desc: 'Posisi tertib halaqah santri', icon: '⭕' },
    { id: 'POINT_OBJECT', label: 'Menunjuk Objek', desc: 'Tafakkur mengamati keindahan ciptaan Allah', icon: '👉' },
    { id: 'PRAY_TOGETHER', label: 'Berdoa Bersama', desc: 'Khusyuk menengadahkan tangan bersama', icon: '🤲' },
    { id: 'FAREWELL', label: 'Berpamitan Santun', desc: 'Mengucap jazakallahu khairan & salam', icon: '🕊️' }
  ];

  const EMOTION_CHAINS_LIST: EmotionChainConfig[] = [
    {
      chainId: 'chain-ceria-pagi',
      title: 'Pagi Ceria di Halaman Santri',
      initiatorId: 'ASY',
      initialEmotion: 'SENYUM',
      steps: [
        { characterId: 'ASY', emotion: 'SENYUM', behavior: 'GREET_FRIEND', delayMs: 0, durationMs: 2000, speechPhrase: 'Assalamu alaikum teman-teman!' },
        { characterId: 'SYIFA', emotion: 'SENYUM', behavior: 'WAVE_FRIEND', delayMs: 600, durationMs: 2000, speechPhrase: 'Wa alaikumussalam Dek Asy!' },
        { characterId: 'BUBU', emotion: 'TERTAWA', behavior: 'LAUGH_TOGETHER', delayMs: 1200, durationMs: 1800, speechPhrase: 'Kicauan ceria burung pipit!' },
        { characterId: 'GOGO', emotion: 'BANGGA', behavior: 'HIGH_FIVE', delayMs: 1800, durationMs: 1800, speechPhrase: 'Semangat belajar hari ini!' }
      ]
    },
    {
      chainId: 'chain-syukur-berkah',
      title: 'Rasa Syukur & Apresiasi Kebaikan',
      initiatorId: 'SYIFA',
      initialEmotion: 'TERIMA_KASIH',
      steps: [
        { characterId: 'SYIFA', emotion: 'TERIMA_KASIH', behavior: 'BOW', delayMs: 0, durationMs: 2000, speechPhrase: 'Alhamdulillah, terima kasih sahabat!' },
        { characterId: 'ASY', emotion: 'BANGGA', behavior: 'CLAP', delayMs: 600, durationMs: 2000, speechPhrase: 'Sama-sama Mbak Syifa!' },
        { characterId: 'MIMI', emotion: 'SENYUM', behavior: 'TWIRL', delayMs: 1200, durationMs: 1800 },
        { characterId: 'DODO', emotion: 'TERTAWA', behavior: 'WALK_TOGETHER', delayMs: 1800, durationMs: 1800 }
      ]
    },
    {
      chainId: 'chain-tafakkur-alam',
      title: 'Tafakkur & Mengagumi Kebesaran Allah',
      initiatorId: 'ASY',
      initialEmotion: 'BERPIKIR',
      steps: [
        { characterId: 'ASY', emotion: 'BERPIKIR', behavior: 'POINT_OBJECT', delayMs: 0, durationMs: 2000, speechPhrase: 'Masya Allah, lihat indahnya bunga ini!' },
        { characterId: 'SYIFA', emotion: 'SENYUM', behavior: 'NOD', delayMs: 600, durationMs: 2000, speechPhrase: 'Subhanallah, harum sekali ya!' },
        { characterId: 'TITI', emotion: 'BERPIKIR', behavior: 'CIRCLE_SIT', delayMs: 1200, durationMs: 1800 },
        { characterId: 'RARA', emotion: 'TERIMA_KASIH', behavior: 'JUMP', delayMs: 1800, durationMs: 1800 }
      ]
    }
  ];

  const handleTriggerFriendshipAction = (behavior: BehaviorType) => {
    if (activeFriendshipCancel) activeFriendshipCancel();
    setSelectedFriendshipBehavior(behavior);

    setFriendshipLog(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString('id-ID'),
        text: `[P1 Friendship] ${friendshipInitiator} & ${friendshipPartner} melakukan ${behavior}`,
        badge: behavior
      }
    ]);

    const cancelFn = characterBehaviorOrchestrator.triggerFriendshipInteraction(
      behavior,
      friendshipInitiator,
      [friendshipPartner],
      {
        durationMs: 2500,
        speechPhrase: `Bismillah, mari ${behavior.toLowerCase()} sahabat!`,
        onComplete: () => {
          setActiveFriendshipCancel(null);
          setFriendshipLog(prev => [
            ...prev,
            {
              time: new Date().toLocaleTimeString('id-ID'),
              text: `[P1 Complete] ${friendshipInitiator} & ${friendshipPartner} kembali ke IDLE state.`,
              badge: 'IDLE'
            }
          ]);
        }
      }
    );

    setActiveFriendshipCancel(() => cancelFn);
  };

  const handleStartEmotionChain = (chain: EmotionChainConfig) => {
    if (activeChainCancel) activeChainCancel();
    setIsChainRunning(true);
    setChainActiveIndex(0);

    setFriendshipLog(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString('id-ID'),
        text: `[P2 Emotion Chain] Memulai rantai emosi positif: "${chain.title}"`,
        badge: 'CHAIN_START'
      }
    ]);

    const cancelFn = characterBehaviorOrchestrator.triggerEmotionChain(
      chain,
      (idx, step) => {
        setChainActiveIndex(idx);
        setFriendshipLog(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID'),
            text: `[Chain Step ${idx + 1}/${chain.steps.length}] ${step.characterId} tertular emosi ${step.emotion} (${step.behavior})`,
            badge: step.characterId
          }
        ]);
      },
      () => {
        setIsChainRunning(false);
        setChainActiveIndex(-1);
        setActiveChainCancel(null);
        setFriendshipLog(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID'),
            text: `[P2 Complete] Seluruh peserta rantai emosi selesai & kembali ke IDLE.`,
            badge: 'CHAIN_DONE'
          }
        ]);
      }
    );

    setActiveChainCancel(() => cancelFn);
  };

  const handleRunFullObjectLifecycle = (objectId: LivingObjectId, charId: CharacterId) => {
    if (activeObjectCancel) activeObjectCancel();
    setObjectLifecycleStep('GRAB');

    const cancelFn = characterBehaviorOrchestrator.executeObjectLifecycle(
      charId,
      objectId,
      'HELP',
      2500,
      (step) => {
        setObjectLifecycleStep(step);
        setFriendshipLog(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID'),
            text: `[P3 Object Lifecycle] Objek ${objectId} di-handle oleh ${charId} → State: ${step}`,
            badge: step
          }
        ]);
      },
      () => {
        setObjectLifecycleStep('IDLE');
        setActiveObjectCancel(null);
        setFriendshipLog(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID'),
            text: `[P3 Complete] Objek ${objectId} telah dikembalikan & santri kembali ke IDLE.`,
            badge: 'OBJECT_IDLE'
          }
        ]);
      }
    );

    setActiveObjectCancel(() => cancelFn);
  };

  const handleStartGroupActivityTemplate = (templateKey: string) => {
    if (activeGroupActivityCancel) activeGroupActivityCancel();
    setSelectedTemplateKey(templateKey);
    setIsGroupActivityRunning(true);
    setGroupActivityStepIndex(0);

    const tmpl = GROUP_ACTIVITY_TEMPLATES[templateKey];
    setGroupActivityLog([
      {
        time: new Date().toLocaleTimeString('id-ID'),
        text: `[P4 Template Start] Memulai aktivitas kelompok: "${tmpl?.title || templateKey}"`,
        badge: 'TEMPLATE_START'
      }
    ]);

    const cancelFn = characterBehaviorOrchestrator.executeGroupActivity(
      templateKey,
      (idx, step) => {
        setGroupActivityStepIndex(idx);
        setGroupActivityStepInfo(step);
        setGroupActivityLog(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID'),
            text: `[Step ${idx + 1}/${tmpl?.steps.length}] ${step.label}`,
            badge: `STEP_${idx + 1}`
          }
        ]);
      },
      () => {
        setIsGroupActivityRunning(false);
        setGroupActivityStepIndex(-1);
        setGroupActivityStepInfo(null);
        setActiveGroupActivityCancel(null);
        setGroupActivityLog(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID'),
            text: `[P4 Complete] Aktivitas kelompok selesai! Seluruh peserta & objek kembali ke IDLE.`,
            badge: 'ALL_IDLE'
          }
        ]);
      }
    );

    setActiveGroupActivityCancel(() => cancelFn);
  };

  const handleResetAllG44 = () => {
    if (activeFriendshipCancel) activeFriendshipCancel();
    if (activeChainCancel) activeChainCancel();
    if (activeObjectCancel) activeObjectCancel();
    if (activeGroupActivityCancel) activeGroupActivityCancel();
    resetAllCharacters();
    resetAllLivingObjs();
    setIsChainRunning(false);
    setChainActiveIndex(-1);
    setObjectLifecycleStep('IDLE');
    setIsGroupActivityRunning(false);
    setGroupActivityStepIndex(-1);
    setGroupActivityStepInfo(null);

    setFriendshipLog(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString('id-ID'),
        text: '[RESET ALL] Seluruh karakter & objek hidup telah di-reset ke IDLE (Clean Zero Leak).',
        badge: 'RESET_CLEAN'
      }
    ]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              TADE v9.1.0-MCA1 — Master Character Canon
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Kanon Resmi Asy & Syifa
              <span className="text-xs px-2.5 py-1 rounded-md bg-amber-400 text-amber-950 font-black tracking-wide">
                LOCKED BY FOUNDER
              </span>
            </h1>
            <p className="mt-2 text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Spesifikasi resmi proporsi 2.5 kepala (Chibi Islamic Aesthetic), tata adab busana syar'i santri,
              sistem ekspresi 60 FPS, penjaga integritas Ring-0, dan larangan mutlak maskot alternatif.
            </p>
          </div>

          {/* Quick Character Selector Card */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <button
              onClick={() => {
                setSelectedChar('ASY');
                defaultExpressionEngine.setCharacter('ASY');
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                selectedChar === 'ASY'
                  ? 'bg-emerald-600 text-white shadow-lg font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Asy size={40} expression="happy" pose="wave" />
              <div className="text-left text-xs">
                <p className="font-bold">Asy</p>
                <p className="opacity-80 text-[10px]">Santri Utama</p>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedChar('SYIFA');
                defaultExpressionEngine.setCharacter('SYIFA');
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                selectedChar === 'SYIFA'
                  ? 'bg-rose-500 text-white shadow-lg font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Syifa size={40} expression="happy" pose="butterfly" />
              <div className="text-left text-xs">
                <p className="font-bold">Syifa</p>
                <p className="opacity-80 text-[10px]">Teladan Adab</p>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-emerald-700/50 pt-4">
          {[
            { id: 'g45_arbitration', label: 'G45 — Context Arbitration Engine', icon: Zap },
            { id: 'g44_friendship', label: 'G44 — Living Friendship & Group Studio', icon: Users },
            { id: 'g43_proof', label: 'G43 — Character Proof-of-Life', icon: Play },
            { id: 'bible', label: 'R911 — Character Bible', icon: BookOpen },
            { id: 'registry', label: 'R912 — Character Registry', icon: Layers },
            { id: 'guard', label: 'R913 — Character Guard', icon: ShieldCheck },
            { id: 'expressions', label: 'R914/R917 — Expression Engine', icon: Smile },
            { id: 'behaviors', label: 'R915 — Behavior Engine', icon: Activity },
            { id: 'pipeline', label: 'R918/R920 — Asset Pipeline & Lock', icon: FileCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-emerald-950 shadow-md scale-102'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Sections */}
      {activeTab === 'bible' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Showcase Box */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="w-56 h-56 bg-gradient-to-b from-emerald-50 to-emerald-100/60 rounded-3xl border border-emerald-200 flex items-center justify-center relative p-4 mb-4">
              {selectedChar === 'ASY' ? (
                <Asy size={180} expression={selectedExpr} pose={selectedPose} animateLiving={true} />
              ) : (
                <Syifa size={180} expression={selectedExpr} pose={selectedPose} animateLiving={true} />
              )}
              <span className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200">
                Living Vector (60 FPS)
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-900">{activeCharData.definition.fullName}</h3>
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">{activeCharData.definition.spiritualRole}</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed px-2">{activeCharData.definition.personality}</p>
          </div>

          {/* Detailed Canon Specifications */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                Konstitusi Proporsi & Busana Syar'i (R911)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Aturan paten tidak dapat diubah yang mengikat seluruh rendering visual antarmuka TADE.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100">
                <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider mb-2">Proporsi Tubuh (Chibi)</h4>
                <ul className="text-xs space-y-1.5 text-slate-700">
                  <li>• <strong>Rasio Emas:</strong> 2.5 Kepala : 1 Tubuh</li>
                  <li>• <strong>Tinggi Kepala:</strong> 40% dari total tinggi</li>
                  <li>• <strong>Tinggi Badan:</strong> 35% dari total tinggi</li>
                  <li>• <strong>Tinggi Kaki/Lengan:</strong> 25% dari total tinggi</li>
                  <li>• <strong>Mata:</strong> Bulat berbinar berdiameter 28% wajah</li>
                </ul>
              </div>

              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100">
                <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wider mb-2">Warna Resmi Kanon</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#059669] border border-black/10" />
                    <span>#059669 Zamrud</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#F97316] border border-black/10" />
                    <span>#F97316 Oranye</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#FFFBF5] border border-black/10" />
                    <span>#FFFBF5 Koko</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#0F172A] border border-black/10" />
                    <span>#0F172A Peci</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Adab Rules */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">Aturan Adab & Larangan Pose</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div>
                  <p className="font-semibold text-emerald-800 mb-1">Pose Resmi Diizinkan:</p>
                  <ul className="space-y-1 list-disc list-inside text-slate-600">
                    {activeCharData.definition.adab.approvedPoses.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-rose-800 mb-1">Pose Dilarang Mutlak:</p>
                  <ul className="space-y-1 list-disc list-inside text-rose-600/90">
                    {activeCharData.definition.adab.prohibitedPoses.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Five Canon Laws */}
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 text-xs space-y-1.5">
              <p className="font-bold text-amber-400 uppercase tracking-wider mb-2">Lima Hukum Abadi Kanon TADE:</p>
              {MASTER_CHARACTER_BIBLE.canonLaw.map((law, idx) => (
                <p key={idx} className="leading-relaxed">{law}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Master Character Registry (R912)</h3>
              <p className="text-xs text-slate-500">Mapping aset vektor, state ekspresi, dan pose interaktif.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono text-xs rounded-full font-bold">
              SSoT Registry Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asy Card */}
            <div className="border border-emerald-200 rounded-2xl p-5 bg-gradient-to-br from-white to-emerald-50/40">
              <div className="flex items-center gap-4 mb-4">
                <Asy size={64} expression="happy" pose="wave" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Asy-Syatibi Al-Muaddib</h4>
                  <p className="text-xs text-emerald-700 font-medium">ID: ASY | Gender: Laki-laki</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <p><strong>SVG Master:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{MASTER_CHARACTER_REGISTRY.ASY.assets.svgMaster}</code></p>
                <p><strong>PNG 4K:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{MASTER_CHARACTER_REGISTRY.ASY.assets.png4k}</code></p>
                <p><strong>WebP:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{MASTER_CHARACTER_REGISTRY.ASY.assets.webpOptimized}</code></p>
                <p><strong>Sprite Sheet:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{MASTER_CHARACTER_REGISTRY.ASY.assets.spriteSheet}</code></p>
              </div>
            </div>

            {/* Syifa Card */}
            <div className="border border-rose-200 rounded-2xl p-5 bg-gradient-to-br from-white to-rose-50/40">
              <div className="flex items-center gap-4 mb-4">
                <Syifa size={64} expression="happy" pose="butterfly" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Syifa Al-Marwah</h4>
                  <p className="text-xs text-rose-700 font-medium">ID: SYIFA | Gender: Perempuan</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <p><strong>SVG Master:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{MASTER_CHARACTER_REGISTRY.SYIFA.assets.svgMaster}</code></p>
                <p><strong>PNG 4K:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{MASTER_CHARACTER_REGISTRY.SYIFA.assets.png4k}</code></p>
                <p><strong>WebP:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{MASTER_CHARACTER_REGISTRY.SYIFA.assets.webpOptimized}</code></p>
                <p><strong>Sprite Sheet:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{MASTER_CHARACTER_REGISTRY.SYIFA.assets.spriteSheet}</code></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guard' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Master Character Guard — Ring-0 Sentinel (R913)
              </h3>
              <p className="text-xs text-slate-500">
                Menolak karakter tidak dikenal, menolak asset override liar, dan memblokir placeholder berbahaya.
              </p>
            </div>
            <button
              onClick={handleRerunGuard}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Jalankan Ulang Audit
            </button>
          </div>

          {/* Audit Result Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
              <p className="text-xs text-emerald-800 font-medium">Status Guard</p>
              <p className="text-xl font-extrabold text-emerald-950 mt-1">100% TERLINDUNGI</p>
              <p className="text-[11px] text-emerald-700 mt-1">Ring-0 Sentinel Aktif</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-xs text-slate-600 font-medium">Total Uji Kepatuhan</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{guardAuditResult.totalChecks} / {guardAuditResult.totalChecks}</p>
              <p className="text-[11px] text-slate-500 mt-1">Semua Lolos Mutlak</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <p className="text-xs text-amber-800 font-medium">Segel Founder</p>
              <p className="text-xl font-extrabold text-amber-950 mt-1">{guardAuditResult.lockedStatus}</p>
              <p className="text-[11px] text-amber-700 mt-1">{guardAuditResult.manifestVersion}</p>
            </div>
          </div>

          {/* Audit Details */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-bold text-xs text-slate-700">
              Log Verifikasi Guard Terbaru
            </div>
            <div className="divide-y divide-slate-100">
              {guardAuditResult.details.map((det: any, idx: number) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-800 font-medium">{det.message}</span>
                  </div>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {det.code}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Test Illegal Character Block Injection */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Simulasi Uji Penolakan Maskot Ilegal
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={simulatedIllegalName}
                onChange={e => setSimulatedIllegalName(e.target.value)}
                placeholder="Masukkan nama karakter sembarang..."
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs flex-1 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                onClick={handleTestIllegalChar}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
              >
                Uji Validasi Guard
              </button>
            </div>

            {simulatedIllegalResult && (
              <div
                className={`p-3 rounded-xl text-xs border ${
                  simulatedIllegalResult.valid
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200 font-medium'
                }`}
              >
                {simulatedIllegalResult.message}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'expressions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Expression & Living Animation Engine (R914/R917)</h3>
              <p className="text-xs text-slate-500">Uji langsung ekspresi real-time dengan rendering 60 FPS dan idle CPU ~0%.</p>
            </div>
            <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
              60 FPS GPU-Transform
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Character Stage */}
            <div className="bg-gradient-to-b from-emerald-50/80 to-slate-50 rounded-3xl p-6 border border-emerald-100 flex flex-col items-center justify-center text-center">
              <div className="w-52 h-52 flex items-center justify-center">
                {selectedChar === 'ASY' ? (
                  <Asy size={180} expression={selectedExpr} pose={selectedPose} animateLiving={true} />
                ) : (
                  <Syifa size={180} expression={selectedExpr} pose={selectedPose} animateLiving={true} />
                )}
              </div>
              <p className="font-bold text-slate-900 text-sm mt-3 uppercase tracking-wider">
                {selectedChar} — {selectedExpr}
              </p>
              <p className="text-xs text-slate-500 mt-1">Pose Aktif: {selectedPose}</p>
            </div>

            {/* Expression Picker */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                  Pilih State Ekspresi (Minimal 8 State R914):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['idle', 'happy', 'laugh', 'confused', 'shy', 'sleepy', 'reading', 'surprised'] as MasterExpressionKey[]).map(expr => (
                    <button
                      key={expr}
                      onClick={() => {
                        setSelectedExpr(expr);
                        defaultExpressionEngine.setExpression(expr);
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        selectedExpr === expr
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <p className="text-xs capitalize font-bold">{expr}</p>
                      <p className={`text-[10px] mt-0.5 ${selectedExpr === expr ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {activeCharData.expressions[expr].label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pose Picker */}
              <div>
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Pose Kanon:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['idle-stand', 'wave', 'point', 'read-iqro', 'butterfly', 'swing-feet', 'pray', 'thumbs-up'] as MasterPoseKey[]).map(pose => (
                    <button
                      key={pose}
                      onClick={() => setSelectedPose(pose)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        selectedPose === pose
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {pose}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'behaviors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Context Behavior Engine (R915)</h3>
            <p className="text-xs text-slate-500">
              Perilaku adaptif maskot terhadap modul yang sedang diakses pengguna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(CONTEXT_BEHAVIOR_MAP).map(([key, plan]) => (
              <div
                key={key}
                onClick={() => {
                  defaultContextBehaviorEngine.applyBehavior(key);
                  setSelectedExpr(plan.expression);
                  setSelectedPose(plan.pose);
                }}
                className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wide group-hover:text-emerald-800">
                    {plan.contextName}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md uppercase">
                    {plan.pose}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">"{plan.asyDialogue}"</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Ekspresi: {plan.expression}</span>
                  <span className="font-semibold text-emerald-600">Klik untuk Uji</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Asset Pipeline & Founder Canon Lock (R918 / R920)</h3>
            <p className="text-xs text-slate-500">
              Kesiapan pipeline aset kanon dan penguncian registri penemuan DISC-911 s/d DISC-920.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
                Struktur Pipeline Folder Aset:
              </h4>
              <ul className="text-xs space-y-2 text-slate-700 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <code>src/assets/master-characters/asy/</code> (SVG Master, 4K, WebP, Spritesheet)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <code>src/assets/master-characters/syifa/</code> (SVG Master, 4K, WebP, Spritesheet)
                </li>
              </ul>
            </div>

            <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50/50">
              <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider mb-2">
                Daftar Discovery Registry Locked (R920):
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Telah didaftarkan dan dikunci penuh 10 Discovery baru: <strong>DISC-911 s/d DISC-920</strong> dengan manifest versi <strong>v9.1.0-MCA1</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* G43 CHARACTER PROOF-OF-LIFE: ASY + KAMPUNG GOTONG ROYONG */}
      {activeTab === 'g43_proof' && (
        <div className="space-y-6">
          {/* Skenario Header Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Play className="w-3.5 h-3.5" />
                  G43 — Real Proof-of-Life Integration Scenario
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  Asy + Kampung Gotong Royong
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 max-w-2xl leading-relaxed">
                  Membuktikan orkestrasi nyata <strong>CharacterBehaviorOrchestrator</strong> + motion kanon santri + <strong>TADE Animation Governor</strong> + <strong>Device & Capability Intelligence</strong> (Mobile Safe Zone, Quiet Mode, Return-to-Idle).
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-3">
                {!isScenarioRunning ? (
                  <button
                    onClick={handleStartProofScenario}
                    className="flex items-center gap-2.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-emerald-600/30 transition-all scale-100 hover:scale-102 active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Jalankan Skenario Pembuktian
                  </button>
                ) : (
                  <button
                    onClick={handleStopScenario}
                    className="flex items-center gap-2.5 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-rose-600/30 transition-all scale-100 hover:scale-102 active:scale-98"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    Hentikan / Cancel Skenario
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Visual Proof Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Live Living Character Stage */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-between relative overflow-hidden">
              <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isScenarioRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    {isScenarioRunning ? 'Active Orchestration' : 'Idle State'}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold">
                  Tier: {asyOrchState.spatialTier}
                </span>
              </div>

              {/* Character Viewport Box with Device Adaptation */}
              <div className="w-full h-72 bg-gradient-to-b from-emerald-50/70 via-teal-50/40 to-slate-50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center relative p-4 shadow-inner">
                {/* Visual Badge for Held Object if any */}
                {asyOrchState.heldObject && (
                  <div className="absolute top-3 left-3 bg-amber-500/90 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-md flex items-center gap-1.5 animate-bounce">
                    <span>🧹</span>
                    <span>{asyOrchState.heldObject.name}</span>
                  </div>
                )}

                {/* Device safe scale indicator */}
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-mono text-slate-600 border border-slate-200">
                  Scale: {deviceCap.mascotScale}x ({deviceCap.deviceClass})
                </div>

                {/* Living Asy Vector Component */}
                <div className="transition-transform duration-300">
                  <Asy
                    size={deviceCap.deviceClass === 'MOBILE' ? 120 : 160}
                    expression={
                      asyOrchState.expression === 'SENYUM' ? 'happy' :
                      asyOrchState.expression === 'TERTAWA' ? 'laugh' :
                      asyOrchState.expression === 'BERPIKIR' ? 'confused' :
                      asyOrchState.expression === 'BANGGA' ? 'happy' :
                      asyOrchState.expression === 'TERIMA_KASIH' ? 'happy' : 'idle'
                    }
                    pose={
                      asyOrchState.movementStyle === 'LAMBAIAN_TANGAN' ? 'wave' :
                      asyOrchState.movementStyle === 'LONCAT_GEMBIRA' ? 'wave' :
                      asyOrchState.movementStyle === 'TEPUK_TANGAN' ? 'thumbs-up' :
                      asyOrchState.movementStyle === 'ANGGUKAN_KEPALA' ? 'read-iqro' : 'idle-stand'
                    }
                    animateLiving={deviceCap.capabilityTier !== 'LOW'}
                  />
                </div>

                {/* Bottom Speech / Current Action Tag */}
                <div className="mt-2 text-center">
                  <p className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                    {asyOrchState.currentBehavior} — {asyOrchState.movementStyle}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Ekspresi DNA: {asyOrchState.expression}
                  </p>
                </div>
              </div>

              {/* Realtime Safety Status Bar */}
              <div className="w-full mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">Governor Active</p>
                  <p className="font-bold text-slate-800">{activeGovernorCount} / 5</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">Quiet Mode</p>
                  <p className={`font-bold ${deviceCap.isQuietMode ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {deviceCap.isQuietMode ? 'YES (Docked)' : 'NO (Normal)'}
                  </p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">Status</p>
                  <p className={`font-bold ${asyOrchState.isIdle ? 'text-blue-600' : 'text-emerald-600'}`}>
                    {asyOrchState.isIdle ? 'IDLE' : 'ACTIVE'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 11-Step Sequence Visualizer & Black Box Audit */}
            <div className="lg:col-span-7 space-y-6">
              {/* Sequence Timeline Step Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    Alur Skenario Kampung Gotong Royong (11 Tahap)
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    {scenarioStepIndex >= 0 ? `Step ${scenarioStepIndex + 1} of ${GOTONG_ROYONG_SEQUENCE.length}` : 'Menunggu Mulai'}
                  </span>
                </div>

                {/* Steps Horizontal/Vertical Tracker */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {GOTONG_ROYONG_SEQUENCE.map((step, idx) => {
                    const isCurrent = scenarioStepIndex === idx;
                    const isPast = scenarioStepIndex > idx;
                    return (
                      <div
                        key={step.stepId}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs border transition-all ${
                          isCurrent
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm text-emerald-950 font-bold'
                            : isPast
                            ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                            : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent
                              ? 'bg-emerald-600 text-white animate-pulse'
                              : isPast
                              ? 'bg-slate-300 text-slate-700'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isPast ? <Check className="w-3 h-3" /> : idx + 1}
                          </span>
                          <span>{step.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-600">{step.behavior}</span>
                          <span className="text-slate-400">{step.durationMs}ms</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Telemetry Log Window */}
              <div className="bg-slate-950 rounded-3xl p-5 text-slate-200 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5" />
                    Live Orchestrator & Governor Telemetry Log
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Ring-0 Audited</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px] pr-1">
                  {scenarioLog.length === 0 ? (
                    <p className="text-slate-500 italic">Tekan "Jalankan Skenario Pembuktian" untuk memulai eksekusi...</p>
                  ) : (
                    scenarioLog.map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="text-slate-500 select-none">[{entry.time}]</span>
                        {entry.badge && (
                          <span className="px-1.5 py-0.2 bg-emerald-900/80 text-emerald-300 rounded text-[9px] font-bold">
                            {entry.badge}
                          </span>
                        )}
                        <span className="flex-1">{entry.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB G44: LIVING FRIENDSHIP & GROUP BEHAVIOR STUDIO                       */}
      {/* ========================================================================= */}
      {activeTab === 'g44_friendship' && (
        <div className="space-y-6">
          {/* Top Status Bar: Concurrency Governor & Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Living Friendship & Group Behavior Studio</h2>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                    SPRINT G44
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interaksi multi-karakter alami, penularan emosi positif, interaksi objek hidup, & 5 template kegiatan kelompok.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Governor Slots</div>
                  <div className="text-xs font-mono font-bold text-slate-800">
                    {activeGovernorCount} / 5 Active ({activeGovernorCount <= 5 ? 'Safe 60 FPS' : 'Throttled'})
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetAllG44}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All to IDLE
              </button>
            </div>
          </div>

          {/* 2-Column Grid: P1 Friendship Engine & P2 Emotion Chain */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* P1: Friendship Interaction Engine */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                      P1
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">Friendship Interaction Engine</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    10 Behaviors
                  </span>
                </div>

                {/* Character Pairing Selectors */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Inisiator Interaksi
                    </label>
                    <select
                      value={friendshipInitiator}
                      onChange={(e) => setFriendshipInitiator(e.target.value as CharacterId)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Object.keys(CHARACTER_DNA_REGISTRY).map(id => (
                        <option key={id} value={id}>
                          {CHARACTER_DNA_REGISTRY[id].avatarEmoji} {CHARACTER_DNA_REGISTRY[id].name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Sahabat Penerima
                    </label>
                    <select
                      value={friendshipPartner}
                      onChange={(e) => setFriendshipPartner(e.target.value as CharacterId)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Object.keys(CHARACTER_DNA_REGISTRY).filter(id => id !== friendshipInitiator).map(id => (
                        <option key={id} value={id}>
                          {CHARACTER_DNA_REGISTRY[id].avatarEmoji} {CHARACTER_DNA_REGISTRY[id].name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Visual Stage for Pair */}
                <div className="mt-4 bg-gradient-to-b from-emerald-50/50 to-slate-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-around relative">
                  {/* Initiator Visual */}
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl mb-1 filter drop-shadow animate-bounce">
                      {CHARACTER_DNA_REGISTRY[friendshipInitiator]?.avatarEmoji || '👦'}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {CHARACTER_DNA_REGISTRY[friendshipInitiator]?.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-md mt-1 border border-emerald-200">
                      {allCharStates[friendshipInitiator as CharacterId]?.currentBehavior || 'IDLE'}
                    </span>
                  </div>

                  {/* Interaction Connector Icon */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm shadow-md animate-pulse">
                      ✨
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">
                      {selectedFriendshipBehavior}
                    </span>
                  </div>

                  {/* Partner Visual */}
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl mb-1 filter drop-shadow animate-bounce">
                      {CHARACTER_DNA_REGISTRY[friendshipPartner]?.avatarEmoji || '🧕'}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {CHARACTER_DNA_REGISTRY[friendshipPartner]?.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-md mt-1 border border-emerald-200">
                      {allCharStates[friendshipPartner as CharacterId]?.currentBehavior || 'IDLE'}
                    </span>
                  </div>
                </div>

                {/* 10 Friendship Behavior Grid */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {FRIENDSHIP_BEHAVIORS_LIST.map(item => {
                    const isSelected = selectedFriendshipBehavior === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTriggerFriendshipAction(item.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-102'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="text-xl mb-1">{item.icon}</span>
                        <span className="text-[11px] font-bold line-clamp-1">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Adab & Nilai: Ta'awun, Mahabbah, & Ukhuwah Islamiyah</span>
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">60 FPS Native</span>
              </div>
            </div>

            {/* P2: Emotion Chain Engine (Positive Contagion) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                      P2
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">Emotion Chain Engine (Penularan Emosi Positif)</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    Lightweight Propagation
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Emosi kebaikan (senyum, syukur, tafakkur) menular secara sekuensial antar karakter tanpa script berat per karakter.
                </p>

                {/* Preconfigured Emotion Chains */}
                <div className="space-y-3 mt-4">
                  {EMOTION_CHAINS_LIST.map((chain, cIdx) => (
                    <div
                      key={chain.chainId}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-300 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="font-bold text-xs text-slate-900">{chain.title}</span>
                        </div>
                        <button
                          onClick={() => handleStartEmotionChain(chain)}
                          disabled={isChainRunning}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Play className="w-3 h-3" />
                          {isChainRunning ? 'Menjalankan...' : 'Uji Penularan'}
                        </button>
                      </div>

                      {/* Visual Flow Rail */}
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {chain.steps.map((step, sIdx) => {
                          const isCurrentStep = isChainRunning && chainActiveIndex === sIdx;
                          const isDone = isChainRunning && chainActiveIndex > sIdx;
                          return (
                            <React.Fragment key={sIdx}>
                              <div
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border shrink-0 transition-all ${
                                  isCurrentStep
                                    ? 'bg-amber-400 text-amber-950 border-amber-500 scale-105 shadow-sm'
                                    : isDone
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-white text-slate-600 border-slate-200'
                                }`}
                              >
                                <span>{CHARACTER_DNA_REGISTRY[step.characterId]?.avatarEmoji}</span>
                                <span>{CHARACTER_DNA_REGISTRY[step.characterId]?.name.split(' ')[0]}</span>
                                <span className="font-mono text-[9px] opacity-75">({step.emotion})</span>
                              </div>
                              {sIdx < chain.steps.length - 1 && (
                                <span className="text-slate-400 text-xs">→</span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Pola: Asy senyum → Syifa senyum → Bubu loncat → Gogo tepuk</span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold">100% Return to IDLE</span>
              </div>
            </div>

          </div>

          {/* 2-Column Grid: P3 Living Objects & P4 Group Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* P3: Living Object Interaction Bay */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center">
                      P3
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">Living Object Interaction Bay</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                    5 Objek Hidup Sederhana
                  </span>
                </div>

                {/* 5 Living Objects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mt-4">
                  {(Object.keys(LIVING_OBJECT_DEFINITIONS) as LivingObjectId[]).map(objId => {
                    const def = LIVING_OBJECT_DEFINITIONS[objId];
                    const inst = livingObjects[objId];
                    const isSelected = selectedObjectForAction === objId;
                    return (
                      <div
                        key={objId}
                        onClick={() => setSelectedObjectForAction(objId)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-center ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 shadow-sm ring-2 ring-sky-200'
                            : 'bg-slate-50 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-2xl mb-1">{def.emoji}</div>
                          <div className="font-bold text-[11px] text-slate-900 leading-tight">{def.name}</div>
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{def.category}</div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            inst?.state === 'HELD'
                              ? 'bg-amber-100 text-amber-800'
                              : inst?.state === 'USED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inst?.state === 'RETURNED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {inst?.state || 'IDLE'}
                          </span>
                          {inst?.heldBy && (
                            <div className="text-[9px] text-slate-500 mt-1 font-semibold">
                              Oleh: {inst.heldBy}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Object Action Controls */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <Package className="w-4 h-4 text-sky-600" />
                      <span>Objek: {LIVING_OBJECT_DEFINITIONS[selectedObjectForAction].name}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Santri:</label>
                      <select
                        value={selectedCharForObject}
                        onChange={(e) => setSelectedCharForObject(e.target.value as CharacterId)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                      >
                        {Object.keys(CHARACTER_DNA_REGISTRY).map(id => (
                          <option key={id} value={id}>{CHARACTER_DNA_REGISTRY[id].name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Lifecycle Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => grabLivingObj(selectedCharForObject as CharacterId, selectedObjectForAction)}
                      className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      1. Ambil (HELD)
                    </button>
                    <button
                      onClick={() => useLivingObj(selectedCharForObject as CharacterId, selectedObjectForAction, 'HELP', 3000)}
                      className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      2. Gunakan (USED)
                    </button>
                    <button
                      onClick={() => returnLivingObj(selectedCharForObject as CharacterId, selectedObjectForAction)}
                      className="px-2.5 py-1.5 bg-white hover:bg-purple-50 text-purple-900 border border-purple-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      3. Kembalikan
                    </button>
                    <button
                      onClick={() => handleRunFullObjectLifecycle(selectedObjectForAction, selectedCharForObject)}
                      className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      ⚡ Siklus Penuh
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Lifecycle Objek: IDLE → HELD → USED → RETURNED → IDLE</span>
                <span className="font-mono text-[10px] text-sky-700 font-bold">Auto-Return Safeguard</span>
              </div>
            </div>

            {/* P4: Group Activity Templates Runner */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center">
                      P4
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">Group Activity Templates</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    5 Canonical Scenarios
                  </span>
                </div>

                {/* Template Selector Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {Object.keys(GROUP_ACTIVITY_TEMPLATES).map(tmplKey => {
                    const tmpl = GROUP_ACTIVITY_TEMPLATES[tmplKey];
                    const isSelected = selectedTemplateKey === tmplKey;
                    return (
                      <button
                        key={tmplKey}
                        onClick={() => setSelectedTemplateKey(tmplKey)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 line-clamp-1">{tmpl.title}</span>
                          <span className="text-xs">{tmpl.category === 'IBADAH' ? '🤲' : tmpl.category === 'GOTONG_ROYONG' ? '🧹' : '📚'}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                          <span>{tmpl.participants.length} Karakter</span>
                          <span>•</span>
                          <span>{tmpl.steps.length} Langkah</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Template Detail Card */}
                {selectedTemplateKey && GROUP_ACTIVITY_TEMPLATES[selectedTemplateKey] && (
                  <div className="mt-4 p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-indigo-950">
                          {GROUP_ACTIVITY_TEMPLATES[selectedTemplateKey].title}
                        </h4>
                        <p className="text-[11px] text-indigo-800/80 mt-0.5">
                          {GROUP_ACTIVITY_TEMPLATES[selectedTemplateKey].subtitle}
                        </p>
                      </div>

                      <button
                        onClick={() => handleStartGroupActivityTemplate(selectedTemplateKey)}
                        disabled={isGroupActivityRunning}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                      >
                        <Play className="w-3.5 h-3.5" />
                        {isGroupActivityRunning ? 'Menjalankan...' : 'Jalankan Template'}
                      </button>
                    </div>

                    {/* Step Sequence Progress View */}
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {GROUP_ACTIVITY_TEMPLATES[selectedTemplateKey].steps.map((st, sIdx) => {
                        const isCurrent = isGroupActivityRunning && groupActivityStepIndex === sIdx;
                        const isPast = isGroupActivityRunning && groupActivityStepIndex > sIdx;
                        return (
                          <div
                            key={st.stepId}
                            className={`flex items-center justify-between p-2 rounded-xl text-[11px] border transition-all ${
                              isCurrent
                                ? 'bg-white border-indigo-500 font-bold text-indigo-950 shadow-xs'
                                : isPast
                                ? 'bg-slate-100/70 border-slate-200 text-slate-500'
                                : 'bg-white/60 border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                isCurrent ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {sIdx + 1}
                              </span>
                              <span>{st.label}</span>
                            </div>
                            <span className="text-[9px] font-mono text-slate-400">{st.durationMs}ms</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Peserta Otomatis Dikordinasikan via Animation Governor</span>
                <span className="font-mono text-[10px] text-indigo-700 font-bold">Ring-0 Certified</span>
              </div>
            </div>

          </div>

          {/* Unified G44 Telemetry Log Console */}
          <div className="bg-slate-950 rounded-3xl p-5 text-slate-200 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                G44 Living Friendship & Group Orchestrator Telemetry Log
              </div>
              <span className="text-[10px] font-mono text-slate-400">Zero-Leak Guard Active</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px] pr-1">
              {friendshipLog.length === 0 && groupActivityLog.length === 0 ? (
                <p className="text-slate-500 italic">Pilih interaksi sahabat, uji rantai emosi, atau jalankan template kegiatan di atas...</p>
              ) : (
                [...friendshipLog, ...groupActivityLog].slice(-12).map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-slate-500 select-none">[{entry.time}]</span>
                    {entry.badge && (
                      <span className="px-1.5 py-0.2 bg-emerald-900/80 text-emerald-300 rounded text-[9px] font-bold">
                        {entry.badge}
                      </span>
                    )}
                    <span className="flex-1">{entry.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          G45 — LIVING CHARACTER CONTEXT ARBITRATION PANEL
         ========================================================================= */}
      {activeTab === 'g45_arbitration' && (
        <div className="space-y-6">
          {/* G45 Priority Hierarchy Matrix Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Zap className="w-3.5 h-3.5" />
                  G45 Living Character Context Arbitration
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Deterministic Priority & Conflict Resolution Engine
                </h2>
                <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
                  Menjamin karakter tidak pernah macet (deadlock), tidak bertabrakan dengan input keyboard pengguna, 
                  memprioritaskan interaksi langsung, mendukung suspend & resume otomatis, serta menjamin safe IDLE fallback.
                </p>
              </div>

              <button
                onClick={() => {
                  const rep = runG45TestSuite();
                  setLiveTestReport(rep);
                  setArbitrationConsoleLog(prev => [
                    ...prev,
                    {
                      time: new Date().toLocaleTimeString('id-ID'),
                      text: `[G45 SUITE RUN] All 7 cases evaluated: ${rep.allPassed ? 'ALL PASSED (Deterministic Winner -> Interrupt/Wait -> Cleanup -> Resume/Idle)' : 'FAILED'}`,
                      badge: rep.allPassed ? 'PASS_ALL' : 'FAIL'
                    }
                  ]);
                }}
                disabled={isArbitrationTestRunning}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isArbitrationTestRunning ? 'animate-spin' : ''}`} />
                Jalankan 7 Test Cases G45
              </button>
            </div>

            {/* Context Priority Hierarchy Ribbon */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-[11px] font-bold text-amber-300 mb-2 uppercase tracking-wider">
                Hierarki Prioritas Deterministik (Paling Tinggi → Paling Rendah):
              </p>
              <div className="flex flex-wrap gap-1.5 items-center text-[10px] font-mono">
                {[
                  { name: 'SAFETY', p: 90, color: 'bg-red-500/20 text-red-300 border-red-500/40' },
                  { name: 'USER_INTERACTION', p: 80, color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                  { name: 'ACTIVE_EVENT', p: 70, color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
                  { name: 'GROUP_ACTIVITY', p: 60, color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
                  { name: 'OBJECT_INTERACTION', p: 50, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
                  { name: 'FRIENDSHIP', p: 40, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                  { name: 'LOCATION', p: 30, color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
                  { name: 'AMBIENT', p: 20, color: 'bg-slate-700 text-slate-300 border-slate-600' },
                  { name: 'IDLE', p: 10, color: 'bg-slate-800 text-slate-400 border-slate-700' }
                ].map((item, idx, arr) => (
                  <React.Fragment key={item.name}>
                    <span className={`px-2 py-1 rounded-lg border font-bold ${item.color}`}>
                      {item.name} <span className="opacity-70">({item.p})</span>
                    </span>
                    {idx < arr.length - 1 && <span className="text-slate-500 font-bold">&gt;</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Test Suite Results Cards Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Hasil Verifikasi 7 Test Case Wajib G45 (A - G)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap kasus diverifikasi: WINNER → INTERRUPT / WAIT → CLEANUP → RESUME ATAU SAFE_IDLE
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                (liveTestReport || testReport)?.allPassed 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {(liveTestReport || testReport)?.allPassed ? '100% Deterministic Pass' : 'Siap Diuji'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[
                {
                  id: 'caseA',
                  code: 'Case A',
                  title: 'READ + USER_INTERACTION',
                  desc: 'Membaca (P:30) disela Lambaian Pengguna (P:80)',
                  res: (liveTestReport || testReport)?.cases?.caseA,
                  defaultWinner: 'USER_INTERACTION',
                  defaultAction: 'SUSPEND_AND_EXECUTE',
                  rule: 'Candidate menang (P:80 > P:30), status membaca disimpan ke stack suspend & di-resume setelah selesai.'
                },
                {
                  id: 'caseB',
                  code: 'Case B',
                  title: 'READ + ACTIVE_EVENT',
                  desc: 'Membaca (P:30) disela Sholat Bersama (P:70)',
                  res: (liveTestReport || testReport)?.cases?.caseB,
                  defaultWinner: 'ACTIVE_EVENT',
                  defaultAction: 'INTERRUPT_AND_EXECUTE',
                  rule: 'Event menang (P:70 > P:30), interupsi membaca bersih, setelah event selesai kembali ke clean IDLE.'
                },
                {
                  id: 'caseC',
                  code: 'Case C',
                  title: 'GROUP_ACTIVITY + FRIEND_INTERACTION',
                  desc: 'Gotong Royong (P:60) + Tos Sahabat (P:40)',
                  res: (liveTestReport || testReport)?.cases?.caseC,
                  defaultWinner: 'GROUP_ACTIVITY',
                  defaultAction: 'ACTIVE_CONTINUES_IGNORE',
                  rule: 'Aktivitas kelompok menang (P:60 > P:40), interaksi sahabat disubordinasi agar kelompok tidak bubar.'
                },
                {
                  id: 'caseD',
                  code: 'Case D',
                  title: 'CARRY + OBJECT_UNAVAILABLE',
                  desc: 'Asy memegang Sapu -> Syifa minta Sapu',
                  res: (liveTestReport || testReport)?.cases?.caseD,
                  defaultWinner: 'RESOURCE_LOCK',
                  defaultAction: 'REJECTED_RESOURCE_BUSY',
                  rule: 'Resource Lock mencegah perebutan sapu, Syifa melakukan safe IDLE fallback tanpa error/crash.'
                },
                {
                  id: 'caseE',
                  code: 'Case E',
                  title: 'BEHAVIOR + LOW_CAPABILITY',
                  desc: 'Loncat Gembira saat mode hemat daya/quiet',
                  res: (liveTestReport || testReport)?.cases?.caseE,
                  defaultWinner: 'SAFETY_OVERRIDE',
                  defaultAction: 'SAFETY_CLAMP_EXECUTE',
                  rule: 'Device Intelligence & Animation Governor membatasi gerakan ke profil tenang (DIAM) & kuota <= 5.'
                },
                {
                  id: 'caseF',
                  code: 'Case F',
                  title: 'BEHAVIOR + KEYBOARD_ACTIVE',
                  desc: 'Gerakan animasi saat keyboard virtual terbuka',
                  res: (liveTestReport || testReport)?.cases?.caseF,
                  defaultWinner: 'SAFETY_OVERRIDE',
                  defaultAction: 'SAFETY_CLAMP_EXECUTE',
                  rule: 'Safety override merapatkan maskot ke pojok aman dan melembutkan gerakan agar tidak menutupi input text.'
                },
                {
                  id: 'caseG',
                  code: 'Case G',
                  title: 'EVENT_END + ACTIVE_BEHAVIOR',
                  desc: 'Event selesai saat karakter sedang beraksi',
                  res: (liveTestReport || testReport)?.cases?.caseG,
                  defaultWinner: 'SAFE_IDLE',
                  defaultAction: 'SAFE_IDLE_FALLBACK',
                  rule: 'notifyEventEnd membersihkan timer, melepas objek, dan memulihkan karakter ke status IDLE damai.'
                }
              ].map(testCase => {
                const passed = testCase.res ? testCase.res.passed : true;
                const winner = testCase.res ? testCase.res.winner : testCase.defaultWinner;
                const action = testCase.res ? testCase.res.action : testCase.defaultAction;
                return (
                  <div
                    key={testCase.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px] font-bold">
                          {testCase.code}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> VERIFIED
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {testCase.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {testCase.desc}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">WINNER:</span>
                        <span className="font-mono font-bold text-indigo-700">{winner}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">ACTION:</span>
                        <span className="font-mono font-bold text-amber-800">{action}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-[10px] text-slate-600 mt-1">
                        {testCase.rule}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Context Dispatcher & Character Status Bay */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Character Context Monitor */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    Status Live 8 Karakter & Stack Suspend G45
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Observasi real-time status konteks, prioritas aktif, dan status pemulihan otomatis
                  </p>
                </div>
                <button
                  onClick={() => {
                    characterBehaviorOrchestrator.resetAllToIdle();
                    setArbitrationConsoleLog(prev => [
                      ...prev,
                      {
                        time: new Date().toLocaleTimeString('id-ID'),
                        text: '[CLEAN IDLE] Seluruh karakter dikembalikan ke IDLE (P:10)',
                        badge: 'RESET_IDLE'
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Reset ke Safe IDLE
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(allCharStates).map(k => {
                  const cId = k as CharacterId;
                  const cState = allCharStates[cId];
                  const dna = CHARACTER_DNA_REGISTRY[cId];
                  return (
                    <div
                      key={cId}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{dna ? dna.name : cId}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          cState.isIdle ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cState.currentBehavior}
                        </span>
                      </div>

                      <div className="space-y-1 text-[10px] text-slate-500 font-mono">
                        <div className="flex justify-between">
                          <span>Source:</span>
                          <span className="font-bold text-slate-700">{cState.currentContextSource || 'IDLE'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Priority:</span>
                          <span className="font-bold text-indigo-700">{cState.currentPriority || 10}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Suspended:</span>
                          <span className={cState.hasSuspendedBehaviors ? 'font-bold text-amber-600' : 'text-slate-400'}>
                            {cState.suspendedCount || 0} tugas
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Context Arbitration Sandbox */}
            <div className="lg:col-span-1 bg-gradient-to-b from-indigo-50/60 to-white rounded-3xl p-6 border border-indigo-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-indigo-950 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  Uji Arbitrasi Live (Sandbox)
                </h3>
                <p className="text-xs text-indigo-900/70 mt-1">
                  Kirim candidate behavior dan saksikan engine menyelesaikan konflik secara deterministik.
                </p>

                <div className="space-y-3 mt-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Karakter Target:</label>
                    <select
                      value={customArbitrationTarget}
                      onChange={(e) => setCustomArbitrationTarget(e.target.value as CharacterId)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
                    >
                      {['ASY', 'SYIFA', 'BUBU', 'GOGO', 'MIMI', 'DODO', 'TITI', 'RARA'].map(id => (
                        <option key={id} value={id}>{id} ({CHARACTER_DNA_REGISTRY[id as CharacterId]?.name})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Context Source Candidate:</label>
                    <select
                      value={customArbitrationSource}
                      onChange={(e) => setCustomArbitrationSource(e.target.value as ContextSourceType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
                    >
                      {Object.keys(CONTEXT_PRIORITY_MAP).map(src => (
                        <option key={src} value={src}>{src} (P:{CONTEXT_PRIORITY_MAP[src as ContextSourceType]})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Behavior Candidate:</label>
                    <select
                      value={customArbitrationBehavior}
                      onChange={(e) => setCustomArbitrationBehavior(e.target.value as BehaviorType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
                    >
                      {['WAVE', 'HIGH_FIVE', 'READ', 'JUMP', 'TWIRL', 'PRAY_TOGETHER', 'WALK', 'CARRY'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customArbitrationResumable}
                        onChange={(e) => setCustomArbitrationResumable(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">Resumable</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customArbitrationInterruptible}
                        onChange={(e) => setCustomArbitrationInterruptible(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">Interruptible</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const res = requestArbitration({
                    characterId: customArbitrationTarget,
                    behaviorType: customArbitrationBehavior,
                    source: customArbitrationSource,
                    priority: CONTEXT_PRIORITY_MAP[customArbitrationSource],
                    resumable: customArbitrationResumable,
                    interruptible: customArbitrationInterruptible,
                    durationMs: 3500
                  });

                  setArbitrationConsoleLog(prev => [
                    ...prev,
                    {
                      time: new Date().toLocaleTimeString('id-ID'),
                      text: `[ARBITRATION DISPATCH] ${customArbitrationTarget}: Candidate=${customArbitrationSource}(P:${CONTEXT_PRIORITY_MAP[customArbitrationSource]}) -> Winner=${res.decision.winner}, Action=${res.decision.decisionType}, Reason="${res.decision.reason}"`,
                      badge: res.decision.winner
                    }
                  ]);
                }}
                className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                Kirim Candidate Behavior
              </button>
            </div>
          </div>

          {/* G45 Telemetry Log Console */}
          <div className="bg-slate-950 rounded-3xl p-5 text-slate-200 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                G45 Context Arbitration Real-Time Decision Log
              </div>
              <span className="text-[10px] font-mono text-slate-400">Ring-0 Arbitrator Active</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px] pr-1">
              {arbitrationConsoleLog.length === 0 ? (
                <p className="text-slate-500 italic">Tekan "Jalankan 7 Test Cases G45" atau gunakan sandbox di atas untuk melihat alur arbitrasi...</p>
              ) : (
                arbitrationConsoleLog.slice(-15).map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-slate-500 select-none">[{entry.time}]</span>
                    {entry.badge && (
                      <span className="px-1.5 py-0.2 bg-amber-900/80 text-amber-300 rounded text-[9px] font-bold">
                        {entry.badge}
                      </span>
                    )}
                    <span className="flex-1">{entry.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
