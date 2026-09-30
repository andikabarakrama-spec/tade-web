import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Heart,
  Volume2,
  Smile,
  Hand,
  Award,
  BookOpen,
  Sun,
  Shield,
  Layers,
  RotateCcw,
  Zap,
  Activity,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { MascotStateMachine, MascotState, MascotEmotion, MascotCostume } from './DekAsyStateMachine';
import { computeFacialGeometry } from './DekAsyEmotionEngine';
import { useDekAsyBehavior } from './DekAsyBehaviorController';

interface Props {
  initialGender?: 'boy' | 'girl';
  initialState?: MascotState;
  initialEmotion?: MascotEmotion;
  interactive?: boolean;
  scale?: number;
  showControls?: boolean;
  onStateChange?: (state: MascotState) => void;
}

export const DekAsyLivingRuntime: React.FC<Props> = ({
  initialGender = 'boy',
  initialState = 'IDLE' as MascotState,
  initialEmotion = 'CERIA' as MascotEmotion,
  interactive = true,
  scale = 1,
  showControls = true,
  onStateChange
}) => {
  const stateMachineRef = useRef<MascotStateMachine | null>(null);
  if (!stateMachineRef.current) {
    stateMachineRef.current = new MascotStateMachine(initialState, initialEmotion);
  }
  const sm = stateMachineRef.current;

  const [gender, setGender] = useState<'boy' | 'girl'>(initialGender);
  const [currentState, setCurrentState] = useState<MascotState>(sm.getState());
  const [currentEmotion, setCurrentEmotion] = useState<MascotEmotion>(sm.getEmotion());
  const [currentCostume, setCurrentCostume] = useState<MascotCostume>(sm.getCostume());
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [fps, setFps] = useState<number>(60);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const {
    timeContext,
    currentGreeting,
    setCurrentGreeting,
    triggerGesture,
    triggerPrayer,
    triggerApplause,
    triggerPointing
  } = useDekAsyBehavior({ stateMachine: sm });

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const [tick, setTick] = useState<number>(0);

  // Subscribe to State Machine changes
  useEffect(() => {
    sm.setGender(gender);
    const unsubscribe = sm.subscribe((st, em) => {
      setCurrentState(st);
      setCurrentEmotion(em);
      setCurrentCostume(sm.getCostume());
      if (onStateChange) onStateChange(st);
    });
    return () => unsubscribe();
  }, [gender, sm, onStateChange]);

  // 60 FPS Render Loop
  useEffect(() => {
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      frameCount++;
      if (now - lastFpsUpdate >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      setTick(now);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Mouse move tracker for eye pupil tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const relX = (e.clientX - centerX) / (rect.width / 2);
    const relY = (e.clientY - centerY) / (rect.height / 3);
    setMousePos({ x: relX, y: relY });
  };

  const handleGenderToggle = (newGender: 'boy' | 'girl') => {
    setGender(newGender);
    sm.setGender(newGender);
  };

  const handleCostumeSelect = (costume: MascotCostume) => {
    sm.setCostume(costume);
    setCurrentCostume(costume);
  };

  const handleVoiceSpeak = (text: string) => {
    setCurrentGreeting(text);
    setIsSpeaking(true);
    sm.transitionTo('GREETING', 'VOICE_SPEAK', 'CERIA');
    setTimeout(() => {
      setIsSpeaking(false);
    }, 4000);
  };

  // Compute live geometry
  const geom = computeFacialGeometry(currentEmotion, currentState, tick, mousePos);

  const mascotName = gender === 'boy' ? 'Dek Asy' : 'Dek Asyah';
  const mascotRole = gender === 'boy' ? 'Sahabat Cilik Asy-Syifatan' : 'Sahabat Shalihah Asy-Syifatan';

  // Costumes definitions
  const costumesList: { id: MascotCostume; label: string; bg: string; color: string }[] = [
    { id: 'SERAGAM_BATIK_SENTRA', label: 'Batik Sentra', bg: 'bg-teal-600', color: 'text-teal-100' },
    { id: 'BAJU_KOKO_IMTAQ', label: 'Koko Putih Imtaq', bg: 'bg-emerald-700', color: 'text-emerald-100' },
    { id: 'GAMIS_SYARI', label: 'Gamis Syari Pink', bg: 'bg-rose-600', color: 'text-rose-100' },
    { id: 'KOSTUM_WISUDA_HAFLAH', label: 'Toga Wisuda Haflah', bg: 'bg-amber-600', color: 'text-amber-100' },
    { id: 'SERAGAM_OLAHRAGA', label: 'Kaos Olahraga Ceria', bg: 'bg-sky-600', color: 'text-sky-100' },
    { id: 'JAS_EKSEKUTIF_CILIK', label: 'Jas Duta Sekolah', bg: 'bg-indigo-700', color: 'text-indigo-100' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xl">
            {gender === 'boy' ? '👦' : '👧'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                OFFICIAL MASCOT RUNTIME
              </span>
              <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                {fps} FPS (Smooth 60Hz)
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {mascotName} — Living Emotional Mascot & Companion
            </h2>
          </div>
        </div>

        {/* Gender Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => handleGenderToggle('boy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              gender === 'boy'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>👦 Dek Asy (Putra)</span>
          </button>
          <button
            onClick={() => handleGenderToggle('girl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              gender === 'girl'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>👧 Dek Asyah (Putri)</span>
          </button>
        </div>
      </div>

      {/* Mascot Stage & Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Mascot Canvas Area */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="lg:col-span-6 relative bg-gradient-to-b from-teal-50/60 via-slate-50 to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/40 border border-teal-200/60 dark:border-slate-800 rounded-2xl p-6 min-h-[380px] flex flex-col items-center justify-center overflow-hidden shadow-inner group"
        >
          {/* Animated Background Atmosphere (Soft sparkles & circles) */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div
              className="absolute w-32 h-32 bg-teal-300/30 rounded-full blur-2xl top-10 left-10 animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <div
              className="absolute w-40 h-40 bg-amber-300/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"
              style={{ animationDuration: '6s' }}
            />
          </div>

          {/* Speech Bubble */}
          <div className="relative z-10 max-w-sm mb-4 bg-white dark:bg-slate-800 border-2 border-teal-400 dark:border-teal-600 rounded-2xl p-3.5 shadow-lg text-center transform transition-all duration-300">
            <div className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{mascotName} Berkata:</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
              "{currentGreeting}"
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-teal-400 dark:border-teal-600 transform rotate-45" />
          </div>

          {/* Vector CGI Stylized 2.5D Animated Mascot SVG */}
          <div
            className="relative z-10 w-52 h-64 flex items-center justify-center transition-transform duration-200"
            style={{
              transform: `scaleY(${geom.breathingScaleY}) rotate(${geom.headTilt}deg)`,
              transformOrigin: 'bottom center'
            }}
          >
            <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl select-none">
              {/* Defs for gradients */}
              <defs>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffeedd" />
                  <stop offset="100%" stopColor="#f5d0b0" />
                </linearGradient>
                <linearGradient id="uniformGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#042f2e" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="peciGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="jilbabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fda4af" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Body & Clothing */}
              <g id="body">
                {/* Torso / Uniform */}
                <path
                  d="M60 140 Q100 130 140 140 L155 220 Q100 230 45 220 Z"
                  fill="url(#uniformGrad)"
                  stroke="#0f766e"
                  strokeWidth="2"
                />
                {/* Collar */}
                <path d="M80 140 L100 165 L120 140 Z" fill="#ffffff" />
                {/* School Emblem on Chest */}
                <circle cx="80" cy="175" r="7" fill="url(#goldGrad)" />
                <path d="M78 172 L82 178 M82 172 L78 178" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* Left & Right Arms with Gestures */}
              <g id="arms">
                {/* Left Arm */}
                {currentState === 'GREETING' ? (
                  /* Waving Left Hand */
                  <g style={{ transform: `rotate(${Math.sin(tick / 150) * 15}deg)`, transformOrigin: '55px 145px' }}>
                    <path d="M55 145 Q30 120 25 90 Q35 85 45 95 L65 145 Z" fill="#0f766e" />
                    <circle cx="25" cy="85" r="10" fill="url(#skinGrad)" />
                  </g>
                ) : currentState === 'POINTING' ? (
                  /* Pointing Left Hand */
                  <g>
                    <path d="M55 145 Q25 140 15 130 Q18 120 30 125 L65 145 Z" fill="#0f766e" />
                    <rect x="5" y="122" width="18" height="8" rx="4" fill="url(#skinGrad)" />
                  </g>
                ) : currentState === 'PRAYING' ? (
                  /* Cupped Prayer Hand Left */
                  <g>
                    <path d="M55 145 Q75 160 90 155 Q85 145 70 140 Z" fill="#0f766e" />
                    <circle cx="92" cy="152" r="9" fill="url(#skinGrad)" />
                  </g>
                ) : currentState === 'APPLAUDING' ? (
                  /* Clapping Left Hand */
                  <g style={{ transform: `rotate(${Math.sin(tick / 100) * 10}deg)`, transformOrigin: '55px 145px' }}>
                    <path d="M55 145 Q80 150 95 145 Q90 135 70 135 Z" fill="#0f766e" />
                    <circle cx="95" cy="142" r="9" fill="url(#skinGrad)" />
                  </g>
                ) : (
                  /* Idle Left Arm */
                  <path d="M55 145 Q40 175 45 200 Q55 205 65 195 L65 145 Z" fill="#0f766e" />
                )}

                {/* Right Arm */}
                {currentState === 'PRAYING' ? (
                  /* Cupped Prayer Hand Right */
                  <g>
                    <path d="M145 145 Q125 160 110 155 Q115 145 130 140 Z" fill="#0f766e" />
                    <circle cx="108" cy="152" r="9" fill="url(#skinGrad)" />
                  </g>
                ) : currentState === 'APPLAUDING' ? (
                  /* Clapping Right Hand */
                  <g style={{ transform: `rotate(${-Math.sin(tick / 100) * 10}deg)`, transformOrigin: '145px 145px' }}>
                    <path d="M145 145 Q120 150 105 145 Q110 135 130 135 Z" fill="#0f766e" />
                    <circle cx="105" cy="142" r="9" fill="url(#skinGrad)" />
                  </g>
                ) : (
                  /* Idle Right Arm */
                  <path d="M145 145 Q160 175 155 200 Q145 205 135 195 L135 145 Z" fill="#0f766e" />
                )}
              </g>

              {/* Head Base */}
              <g id="head">
                {/* Jilbab for Dek Asyah */}
                {gender === 'girl' && (
                  <path
                    d="M40 70 Q100 20 160 70 Q175 140 150 175 Q100 185 50 175 Q25 140 40 70 Z"
                    fill="url(#jilbabGrad)"
                    stroke="#be123c"
                    strokeWidth="1.5"
                  />
                )}

                {/* Face Oval */}
                <ellipse cx="100" cy="95" rx="46" ry="48" fill="url(#skinGrad)" />

                {/* Peci for Dek Asy */}
                {gender === 'boy' && (
                  <g>
                    <path
                      d="M56 68 Q100 45 144 68 L142 42 Q100 25 58 42 Z"
                      fill="url(#peciGrad)"
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                    <path d="M58 42 Q100 25 142 42" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" />
                  </g>
                )}

                {/* Rosy Cheeks (Blush) */}
                <ellipse
                  cx="68"
                  cy="108"
                  rx="9"
                  ry="5"
                  fill="#f43f5e"
                  opacity={geom.blushOpacity}
                />
                <ellipse
                  cx="132"
                  cy="108"
                  rx="9"
                  ry="5"
                  fill="#f43f5e"
                  opacity={geom.blushOpacity}
                />

                {/* Eyes */}
                {/* Left Eye */}
                <g id="leftEye">
                  <ellipse cx="76" cy="90" rx="10" ry={12 * geom.eyeLidHeight} fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  {geom.eyeLidHeight > 0.2 && (
                    <>
                      <circle
                        cx={76 + geom.pupilOffsetX * 3}
                        cy={90 + geom.pupilOffsetY * 2}
                        r="6"
                        fill="#1e293b"
                      />
                      <circle
                        cx={74 + geom.pupilOffsetX * 3}
                        cy={88 + geom.pupilOffsetY * 2}
                        r="2.5"
                        fill="#ffffff"
                      />
                    </>
                  )}
                  {/* Eyebrow Left */}
                  <path
                    d={`M66 ${78 - geom.eyebrowAngle * 0.3} Q76 74 86 ${78 + geom.eyebrowAngle * 0.3}`}
                    stroke="#475569"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* Right Eye */}
                <g id="rightEye">
                  <ellipse cx="124" cy="90" rx="10" ry={12 * geom.eyeLidHeight} fill="#ffffff" stroke="#334155" strokeWidth="1" />
                  {geom.eyeLidHeight > 0.2 && (
                    <>
                      <circle
                        cx={124 + geom.pupilOffsetX * 3}
                        cy={90 + geom.pupilOffsetY * 2}
                        r="6"
                        fill="#1e293b"
                      />
                      <circle
                        cx={122 + geom.pupilOffsetX * 3}
                        cy={88 + geom.pupilOffsetY * 2}
                        r="2.5"
                        fill="#ffffff"
                      />
                    </>
                  )}
                  {/* Eyebrow Right */}
                  <path
                    d={`M114 ${78 + geom.eyebrowAngle * 0.3} Q124 74 134 ${78 - geom.eyebrowAngle * 0.3}`}
                    stroke="#475569"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* Cute Nose */}
                <ellipse cx="100" cy="98" rx="2.5" ry="2" fill="#e2a882" />

                {/* Dynamic Smiling Mouth */}
                <path
                  d={`M85 112 Q100 ${112 + geom.mouthCurve * 14} 115 112 ${
                    geom.mouthOpen > 0.1 ? `Q100 ${112 + geom.mouthOpen * 25} 85 112` : ''
                  }`}
                  fill={geom.mouthOpen > 0.1 ? '#be123c' : 'none'}
                  stroke="#881337"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          {/* Quick Voice Bar */}
          <div className="relative z-10 w-full mt-4 flex items-center justify-between gap-2 bg-white/90 dark:bg-slate-900/90 p-2.5 rounded-xl border border-teal-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Suara Alami:</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleVoiceSpeak("Assalamu'alaikum! Selamat datang di TK ASY SYIFA.")}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 hover:bg-teal-200"
              >
                Salam
              </button>
              <button
                onClick={() => handleVoiceSpeak("Ayo semangat hafalan Surah An-Naba hari ini!")}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200"
              >
                Tahfidz
              </button>
              <button
                onClick={() => handleVoiceSpeak("Alhamdulillah, semua tugas sekolah terlaksana dengan rapi.")}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 hover:bg-amber-200"
              >
                Pujian
              </button>
            </div>
          </div>
        </div>

        {/* Right: Controller & Poses Station */}
        <div className="lg:col-span-6 space-y-4">
          {/* 8 Mandatory Gesture Matrix */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                8 Gesture & Animasi Wajib (60 FPS)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                STATE: {currentState}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { state: 'IDLE', label: '1. Napas Halus', icon: Sun },
                { state: 'GREETING', label: '2. Melambai', icon: Hand },
                { state: 'POINTING', label: '3. Menunjuk', icon: Zap },
                { state: 'APPLAUDING', label: '4. Tepuk Tangan', icon: Award },
                { state: 'NODDING', label: '5. Mengangguk', icon: CheckCircle2 },
                { state: 'PRAYING', label: '6. Berdoa', icon: BookOpen },
                { state: 'CELEBRATING', label: '7. Senyum Ceria', icon: Smile },
                { state: 'STUDYING', label: '8. Fokus Belajar', icon: Shield },
              ].map((item) => (
                <button
                  key={item.state}
                  onClick={() => triggerGesture(item.state as MascotState)}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition ${
                    currentState === item.state
                      ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                  }`}
                >
                  <item.icon className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seasonal Costumes Palette */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-600" />
              Kostum Musiman Resmi (Official Costumes)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {costumesList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCostumeSelect(c.id)}
                  className={`p-2 rounded-lg text-left border text-xs font-semibold transition flex items-center gap-2 ${
                    currentCostume === c.id
                      ? `${c.bg} text-white border-transparent shadow-sm`
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${c.bg}`} />
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emotional State Engine */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Ekspresi Emosi Aktif</span>
              <span className="text-teal-600 font-bold">{currentEmotion}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(['CERIA', 'ANTUSIAS', 'KHUSYUK', 'BANGGA', 'PEDULI', 'HORMAT', 'FOKUS'] as MascotEmotion[]).map((em) => (
                <button
                  key={em}
                  onClick={() => sm.transitionTo(currentState, 'EMOTION_SELECT', em)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    currentEmotion === em
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
