import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  HelpCircle,
  BookOpen,
  UserCheck,
  Zap,
  CheckCircle2,
  Minimize2,
  PartyPopper,
  EyeOff,
  Eye,
  Calendar,
  Layers,
  HeartHandshake,
  User,
  Activity,
  Heart,
  Smile,
  FileText,
  Bot
} from 'lucide-react';
import { PageGuidance, PerformanceMode } from './AIAsyContext';
import { getBubbleVariants } from './AIAsyMotion';
import { EventConfig, EVENT_CONFIGS, EventType } from './AIAsyEvents';
import { getWorkflowForTab } from './AIAsyWorkflow';
import { ActivityType, CharacterVariant, getRandomSpeech } from './AIAsyActivity';
import { EmotionType, ASY_STORIES } from './AIAsyEmotion';

interface AIAsyBubbleProps {
  roleGreeting: string;
  pageGuidance: PageGuidance;
  activeRole: string;
  activeTabCode: string;
  userName?: string;
  performanceMode: PerformanceMode;
  bubbleMaxWidth: number;
  eventConfig: EventConfig;
  currentActivity: ActivityType;
  currentEmotion?: EmotionType;
  worldLocationLabel?: string;
  worldAmbientEmoji?: string;
  characterVariant: CharacterVariant;
  isParticleActive: boolean;
  isAnimationDisabled: boolean;
  onReplayCelebration: () => void;
  onSelectEvent: (type: EventType) => void;
  onToggleAnimation: () => void;
  onToggleCharacterVariant: () => void;
  onClose: () => void;
  onNavigateToTab?: (tabCode: string) => void;
  onOpenOfficeWorkspace?: () => void;
  onOpenLivingCompanion?: () => void;
}

export const AIAsyBubble: React.FC<AIAsyBubbleProps> = ({
  roleGreeting,
  pageGuidance,
  activeRole,
  activeTabCode,
  userName,
  performanceMode,
  bubbleMaxWidth,
  eventConfig,
  currentActivity,
  currentEmotion = 'HAPPY',
  worldLocationLabel = 'Gerbang Sekolah TK',
  worldAmbientEmoji = '🏫',
  characterVariant,
  isParticleActive,
  isAnimationDisabled,
  onReplayCelebration,
  onSelectEvent,
  onToggleAnimation,
  onToggleCharacterVariant,
  onClose,
  onNavigateToTab,
  onOpenOfficeWorkspace,
  onOpenLivingCompanion
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIVITY' | 'EVENT' | 'GUIDE' | 'WORKFLOW' | 'GREETING' | 'STORY'>('ACTIVITY');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showEventPicker, setShowEventPicker] = useState<boolean>(false);
  const [isSeniorFriendly, setIsSeniorFriendly] = useState<boolean>(false);
  const [workflowStepIndex, setWorkflowStepIndex] = useState<number>(0);
  const [activitySpeech, setActivitySpeech] = useState<string>(getRandomSpeech(currentActivity));
  const [storyIndex, setStoryIndex] = useState<number>(0);

  const currentWorkflowStep = getWorkflowForTab(activeTabCode, workflowStepIndex);

  // Refresh Speech Variation
  const handleRefreshSpeech = () => {
    setActivitySpeech(getRandomSpeech(currentActivity));
  };

  // Text-to-Speech synthesis in simple polite Indonesian if supported
  const handleToggleSpeech = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID';
    utterance.rate = isSeniorFriendly ? 0.82 : 0.95; // Slower rate for senior mode
    utterance.pitch = characterVariant === 'ASYAH' ? 1.25 : 1.1; // Slightly higher pitch for Asyah

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const bubbleVariants = getBubbleVariants(performanceMode);

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ maxWidth: isSeniorFriendly ? `${Math.max(bubbleMaxWidth, 360)}px` : `${bubbleMaxWidth}px` }}
      className={`relative z-50 bg-slate-900 text-white rounded-3xl ${
        isSeniorFriendly ? 'p-5 sm:p-6 border-4 border-amber-400' : 'p-4 sm:p-5 border-2 border-emerald-500/80'
      } shadow-2xl space-y-3 font-sans`}
      role="region"
      aria-label="Petunjuk AI Asy Digital Companion"
    >
      {/* Speech Bubble Pointer Arrow Tail pointing down-left toward Asy */}
      <div className={`absolute -bottom-2.5 left-7 w-5 h-5 bg-slate-900 border-r-2 border-b-2 ${
        isSeniorFriendly ? 'border-amber-400' : 'border-emerald-500/80'
      } rotate-45`} />

      {/* Active Event Banner Strip */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 p-2.5 rounded-t-3xl border-b border-emerald-800/60 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span className="font-bold text-amber-300 truncate">{eventConfig.badge}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Location Badge */}
          <span className="text-[10px] font-bold text-sky-300 bg-sky-950/90 px-2 py-0.5 rounded-md border border-sky-700/60 flex items-center gap-1">
            <span>{worldAmbientEmoji}</span>
            <span className="hidden sm:inline">{worldLocationLabel}</span>
          </span>

          {/* Emotion Badge */}
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-md border border-emerald-700/60 flex items-center gap-1">
            <Smile className="w-3 h-3 text-amber-300" />
            <span>{currentEmotion}</span>
          </span>

          <button
            onClick={onReplayCelebration}
            className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] transition cursor-pointer shrink-0 flex items-center gap-1"
            title="Rayakan Ulang Tahun / Event Lagi"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Rayakan!</span>
          </button>
        </div>
      </div>

      {/* Bubble Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          </span>
          <div>
            <h4 className={`font-black text-white flex items-center gap-1.5 ${isSeniorFriendly ? 'text-sm' : 'text-xs'}`}>
              {characterVariant === 'ASYAH' ? 'AI Asyah' : 'AI Asy'}{' '}
              <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800">
                Teman Belajar
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Role: <strong className="text-slate-200">{activeRole}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* AI Living Companion Modal Trigger Button */}
          {onOpenLivingCompanion && (
            <button
              onClick={onOpenLivingCompanion}
              title="Buka AI Asy Living Companion (Quran, Belajar, & Kisah)"
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white border border-purple-400/50 text-[10px] font-mono font-bold cursor-pointer transition shadow-sm flex items-center gap-1"
            >
              <Heart className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Companion</span>
            </button>
          )}

          {/* AI Office Workspace Trigger Button */}
          {onOpenOfficeWorkspace && (
            <button
              onClick={onOpenOfficeWorkspace}
              title="Buka AI Office Workspace & Analisis Dokumen"
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 text-[10px] font-mono font-bold cursor-pointer transition shadow-sm flex items-center gap-1"
            >
              <Bot className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">AI Office</span>
            </button>
          )}

          {/* Character Variant Switcher (Asy vs Asyah) */}
          <button
            onClick={onToggleCharacterVariant}
            title={characterVariant === 'ASY' ? 'Ganti ke AI Asyah (Santriwati Hijab)' : 'Ganti ke AI Asy (Santri Peci)'}
            className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold cursor-pointer transition flex items-center gap-1"
          >
            <User className="w-3 h-3 text-emerald-400" />
            <span>{characterVariant}</span>
          </button>

          {/* Senior Friendly Toggle Button */}
          <button
            onClick={() => setIsSeniorFriendly((prev) => !prev)}
            title={isSeniorFriendly ? 'Matikan Mode Lansia (Teks Standar)' : 'Mode Lansia Guru 50+ (Teks Besar & Jelas)'}
            className={`p-1.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-1 font-mono font-bold ${
              isSeniorFriendly
                ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">{isSeniorFriendly ? 'Lansia' : '50+'}</span>
          </button>

          {/* Accessibility Motion Toggle */}
          <button
            onClick={onToggleAnimation}
            title={isAnimationDisabled ? 'Aktifkan Animasi' : 'Matikan Animasi (Aksesibilitas)'}
            className={`p-1.5 rounded-xl transition cursor-pointer text-xs ${
              isAnimationDisabled
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            aria-label="Toggle Animasi Asy"
          >
            {isAnimationDisabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          {/* Speech Audio Toggle */}
          {'speechSynthesis' in window && (
            <button
              onClick={() =>
                handleToggleSpeech(
                  activeTab === 'ACTIVITY'
                    ? activitySpeech
                    : activeTab === 'EVENT'
                    ? eventConfig.speechText
                    : activeTab === 'WORKFLOW'
                    ? isSeniorFriendly
                      ? currentWorkflowStep.seniorFriendlyInstruction
                      : currentWorkflowStep.instruction
                    : activeTab === 'GUIDE'
                    ? pageGuidance.summary
                    : activeTab === 'STORY'
                    ? ASY_STORIES.DAILY_STORIES[storyIndex % ASY_STORIES.DAILY_STORIES.length]
                    : roleGreeting
                )
              }
              title={isSpeaking ? 'Hentikan Suara' : 'Dengarkan Bicara'}
              className={`p-1.5 rounded-xl transition cursor-pointer text-xs ${
                isSpeaking
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              aria-label="Toggle baca suara"
            >
              {isSpeaking ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Close/Minimize Bubble */}
          <button
            onClick={onClose}
            title="Tutup Balon Petunjuk"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
            aria-label="Tutup petunjuk AI Asy"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Content Switcher Tabs */}
      <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 font-mono text-[10px]">
        <button
          onClick={() => setActiveTab('ACTIVITY')}
          className={`flex-1 py-1 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'ACTIVITY'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3 h-3 text-emerald-300" /> Aksi
        </button>

        <button
          onClick={() => setActiveTab('EVENT')}
          className={`flex-1 py-1 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'EVENT'
              ? 'bg-amber-600 text-amber-100 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PartyPopper className="w-3 h-3 text-amber-300" /> Event
        </button>

        <button
          onClick={() => setActiveTab('STORY')}
          className={`flex-1 py-1 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'STORY'
              ? 'bg-purple-700 text-purple-100 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-3 h-3 text-purple-300" /> Kisah
        </button>

        <button
          onClick={() => setActiveTab('WORKFLOW')}
          className={`flex-1 py-1 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'WORKFLOW'
              ? 'bg-emerald-800 text-emerald-200 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3 h-3 text-emerald-400" /> Alur
        </button>

        <button
          onClick={() => setActiveTab('GUIDE')}
          className={`flex-1 py-1 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'GUIDE'
              ? 'bg-emerald-800 text-emerald-200 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3 h-3" /> Info
        </button>

        <button
          onClick={() => setActiveTab('GREETING')}
          className={`flex-1 py-1 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'GREETING'
              ? 'bg-emerald-800 text-emerald-200 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3 h-3" /> Sapa
        </button>
      </div>

      {/* Main Tab Content */}
      <div className={`space-y-2 ${isSeniorFriendly ? 'text-sm' : 'text-xs'}`}>
        {/* ACTIVITY ENGINE TAB */}
        {activeTab === 'ACTIVITY' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                STATUS AKSI: <strong className="text-white uppercase">{currentActivity}</strong>
              </span>

              <button
                onClick={handleRefreshSpeech}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline font-normal cursor-pointer"
              >
                Putar Ucapan
              </button>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-emerald-500/30 space-y-1.5">
              <p className={`text-emerald-100 leading-relaxed font-medium italic ${isSeniorFriendly ? 'text-base font-bold text-amber-200' : 'text-xs'}`}>
                "{activitySpeech}"
              </p>
              <p className="text-[10px] text-slate-400 font-mono text-right">
                Karakter: <strong className="text-emerald-400">{characterVariant === 'ASYAH' ? 'AI Asyah' : 'AI Asy'}</strong>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'EVENT' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 font-mono">
              <span>{eventConfig.title}</span>
              <button
                onClick={() => setShowEventPicker((p) => !p)}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-normal cursor-pointer flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" /> {showEventPicker ? 'Tutup Pilih' : 'Pilih Event'}
              </button>
            </div>

            {/* Event Selector List */}
            {showEventPicker ? (
              <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono text-[10px]">
                {Object.values(EVENT_CONFIGS).map((cfg) => (
                  <button
                    key={cfg.type}
                    onClick={() => {
                      onSelectEvent(cfg.type);
                      setShowEventPicker(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded-lg transition flex items-center justify-between cursor-pointer ${
                      eventConfig.type === cfg.type
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{cfg.title}</span>
                    <span className="text-[9px] text-slate-500">{cfg.badge.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-amber-500/30 space-y-2">
                <p className={`text-amber-100 leading-relaxed font-medium italic ${isSeniorFriendly ? 'text-base font-bold' : 'text-xs'}`}>
                  "{eventConfig.speechText}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-1.5">
                  <span>Aksesoris: <strong className="text-emerald-400">{eventConfig.accessoryName}</strong></span>
                  {isParticleActive && (
                    <span className="text-amber-400 font-bold animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Perayaan Aktif
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STORY & KISAH TAB */}
        {activeTab === 'STORY' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 font-mono">
              <span className="uppercase tracking-wider">Kisah & Kenangan Santri</span>
              <button
                onClick={() => setStoryIndex((prev) => prev + 1)}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline font-normal cursor-pointer"
              >
                Cerita Lainnya
              </button>
            </div>

            <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-500/30 space-y-2">
              <p className={`text-purple-100 leading-relaxed font-medium italic ${isSeniorFriendly ? 'text-base font-bold' : 'text-xs'}`}>
                "{ASY_STORIES.DAILY_STORIES[storyIndex % ASY_STORIES.DAILY_STORIES.length]}"
              </p>

              <div className="pt-2 border-t border-purple-800/40 space-y-1">
                <span className="text-[10px] text-amber-300 font-mono font-bold block">Adab Santri Cilik:</span>
                <p className="text-[11px] text-slate-300 italic">
                  "{ASY_STORIES.KINDERGARTEN_MANNERS[storyIndex % ASY_STORIES.KINDERGARTEN_MANNERS.length]}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW GUIDE TAB */}
        {activeTab === 'WORKFLOW' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400 font-bold">
              <span>LANGKAH {currentWorkflowStep.stepNumber} DARI {currentWorkflowStep.totalSteps}</span>
              <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-800">
                {currentWorkflowStep.title}
              </span>
            </div>

            <div className={`p-3 bg-slate-950 rounded-2xl border ${isSeniorFriendly ? 'border-amber-400 bg-amber-950/30' : 'border-slate-800'} space-y-2`}>
              <p className={`text-slate-100 leading-relaxed font-semibold ${isSeniorFriendly ? 'text-base text-amber-200' : 'text-xs'}`}>
                {isSeniorFriendly
                  ? currentWorkflowStep.seniorFriendlyInstruction
                  : currentWorkflowStep.instruction}
              </p>

              {currentWorkflowStep.actionHint && (
                <p className="text-[10px] text-emerald-400 font-mono italic flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {currentWorkflowStep.actionHint}
                </p>
              )}
            </div>

            {currentWorkflowStep.totalSteps > 1 && (
              <div className="flex items-center justify-between pt-1">
                <button
                  disabled={workflowStepIndex === 0}
                  onClick={() => setWorkflowStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 text-xs font-mono cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={() =>
                    setWorkflowStepIndex((prev) => (prev + 1) % currentWorkflowStep.totalSteps)
                  }
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono cursor-pointer flex items-center gap-1"
                >
                  <span>Langkah Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'GUIDE' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span className="uppercase tracking-wider font-mono">{pageGuidance.title}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[9px] font-mono">
                {pageGuidance.category}
              </span>
            </div>

            <p className={`text-slate-200 leading-relaxed font-medium ${isSeniorFriendly ? 'text-base font-semibold' : 'text-xs'}`}>
              "{pageGuidance.summary}"
            </p>
          </div>
        )}

        {activeTab === 'GREETING' && (
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest block">
              Sapaan Asy Untuk {userName || activeRole}
            </span>
            <p className={`text-emerald-100 leading-relaxed italic font-medium ${isSeniorFriendly ? 'text-base font-semibold' : 'text-xs'}`}>
              "{roleGreeting}"
            </p>
          </div>
        )}
      </div>

      {/* Speech Audio Active Indicator */}
      {isSpeaking && (
        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 pt-1 border-t border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{characterVariant === 'ASYAH' ? 'Asyah' : 'Asy'} sedang menjelaskan...</span>
        </div>
      )}

      {/* Interactive Guide Action Chips Bar (Sprint P3D-09) */}
      <div className="pt-2 border-t border-slate-800/80 space-y-1">
        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
          Aksi Panduan AI Asy:
        </span>
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          <button
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab('w1');
              window.dispatchEvent(new CustomEvent('aiasy-lanjut-berjalan'));
            }}
            className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <span>👉 Lanjut Berjalan</span>
          </button>
          <button
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab('w4');
            }}
            className="px-2 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <span>📝 Petunjuk PPDB</span>
          </button>
          <button
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab('r1');
            }}
            className="px-2 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-500/40 text-sky-300 font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <span>🔑 Masuk Login</span>
          </button>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('aiasy-checkpoint-reached'));
            }}
            className="px-2 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <span>🎉 Selebrasi</span>
          </button>
        </div>
      </div>

      {/* Quick Action Dock Inside AI Asy Panel */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <a
          href="https://wa.me/6281234567890?text=Assalamu%27alaikum%20Admin%20TK%20Asy%20Syifa%2C%20saya%20ingin%20bertanya%20informasi%20PPDB"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>💬 Konsultasi WA PPDB</span>
        </a>

        {onNavigateToTab && (
          <button
            onClick={() => {
              onNavigateToTab('w4');
              onClose();
            }}
            className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs shadow-md transition cursor-pointer"
          >
            Form PPDB ↗
          </button>
        )}
      </div>
    </motion.div>
  );
};

