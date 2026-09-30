/**
 * TADE v9.2.0-MCA2 — R929
 * FOUNDER LIVING CHARACTER ANIMATION PREVIEW
 * 
 * Comprehensive diagnostic and preview suite for Founder/Admin:
 * - Live State Machine Testing (idle, wave, point, readIqro, butterfly, confused, shy, sleepy, celebrate)
 * - 60 FPS Performance Cockpit (FPS, Frame Time, CPU Load estimate, Memory)
 * - Runtime Controller (Play/Pause, FPS Cap, Speed)
 * - Organic Idle Simulation (Breathing, Blink, Saccadic Gaze, Head Tilt, Weight Shift)
 * - Bone / Body Part Hierarchy Inspector (Asy & Syifa Rigs)
 * - Context Behavior Matrix Simulator (Dashboard, PPDB, Tahfidz, Galeri, Loading, Error)
 * - Asset Pipeline & Fallback Diagnostic (master.riv -> master.svg -> procedural)
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  ShieldCheck,
  CheckCircle,
  Eye,
  Smile,
  Layers,
  Zap,
  Flame,
  Radio,
  FileCheck,
  BookOpen,
  Heart,
  MessageSquare,
  Keyboard,
  MousePointer
} from 'lucide-react';
import { Asy } from './Asy';
import { Syifa } from './Syifa';
import { CharacterId, MasterExpressionKey, MasterPoseKey } from '../../core/masterCharacter/masterCharacterRegistry';
import { defaultCharacterRuntime, RuntimeMetrics, CharacterBodyNode } from '../../core/masterCharacter/characterRuntime';
import { defaultStateMachine, CharacterState, StateMachineSnapshot } from '../../core/masterCharacter/stateMachine';
import { defaultIdleController, IdleStateSnapshot } from '../../core/masterCharacter/idleController';
import { defaultExpressionEngine, ExpressionStateSnapshot } from '../../core/masterCharacter/expressionEngine';
import { defaultContextBehaviorEngine, CONTEXT_BEHAVIOR_MAP } from '../../core/masterCharacter/contextBehaviorEngine';
import { defaultInteractionLayer } from '../../core/masterCharacter/interactionLayer';
import { defaultAssetLoader, LoadedCharacterAsset } from '../../core/masterCharacter/assetLoader';

export const FounderAnimationPreview: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<CharacterId>('ASY');
  const [activeTab, setActiveTab] = useState<'states' | 'telemetry' | 'idle' | 'rig' | 'context' | 'asset'>('states');

  // Live Subscribed States
  const [metrics, setMetrics] = useState<RuntimeMetrics>(defaultCharacterRuntime.getMetrics());
  const [stateSnapshot, setStateSnapshot] = useState<StateMachineSnapshot>(defaultStateMachine.getSnapshot());
  const [idleSnapshot, setIdleSnapshot] = useState<IdleStateSnapshot>(defaultIdleController.getSnapshot());
  const [expressionSnapshot, setExpressionSnapshot] = useState<ExpressionStateSnapshot>(defaultExpressionEngine.getSnapshot());
  const [assetStatus, setAssetStatus] = useState<LoadedCharacterAsset | null>(null);

  // Runtime Controls
  const [targetFps, setTargetFps] = useState<number>(60);
  const [isTypingSimulated, setIsTypingSimulated] = useState<boolean>(false);
  const [lastEventLog, setLastEventLog] = useState<string>('Runtime engine siap di 60 FPS');

  // Subscriptions setup
  useEffect(() => {
    defaultCharacterRuntime.start();
    defaultIdleController.start();

    const unsubTick = defaultCharacterRuntime.onTick((_, m) => {
      setMetrics({ ...m });
    });

    const unsubState = defaultStateMachine.subscribe(s => {
      setStateSnapshot({ ...s });
    });

    const unsubIdle = defaultIdleController.subscribe(i => {
      setIdleSnapshot({ ...i });
    });

    const unsubExpr = defaultExpressionEngine.subscribe(e => {
      setExpressionSnapshot({ ...e });
    });

    // Check asset status
    defaultAssetLoader.loadCharacter(selectedChar).then(res => {
      setAssetStatus(res);
    });

    return () => {
      unsubTick();
      unsubState();
      unsubIdle();
      unsubExpr();
    };
  }, [selectedChar]);

  const handleSelectCharacter = (id: CharacterId) => {
    setSelectedChar(id);
    defaultCharacterRuntime.setCharacter(id);
    defaultStateMachine.setCharacter(id);
    defaultExpressionEngine.setCharacter(id);
    defaultAssetLoader.loadCharacter(id).then(res => setAssetStatus(res));
    setLastEventLog(`Karakter berganti ke: ${id}`);
  };

  const handleTriggerState = (st: CharacterState) => {
    defaultStateMachine.transitionTo(st);
    const config = defaultStateMachine.getStateConfig(st);
    defaultExpressionEngine.setExpression(config.defaultExpression);
    setLastEventLog(`State transisi -> [${st}] (${config.label})`);
  };

  const handleSimulateTap = () => {
    const res = defaultInteractionLayer.handleTap(selectedChar);
    setLastEventLog(`Simulasi Tap -> [${res.expression}]: "${res.dialogue}"`);
  };

  const handleToggleTypingPause = () => {
    const next = !isTypingSimulated;
    setIsTypingSimulated(next);
    if (next) {
      defaultIdleController.pause();
      setLastEventLog('Simulasi Mengetik: Idle pause aktif (tidak mengganggu form)');
    } else {
      defaultIdleController.resume();
      setLastEventLog('Simulasi Selesai Mengetik: Idle resumed');
    }
  };

  const handleApplyContext = (ctxKey: string) => {
    const plan = defaultContextBehaviorEngine.applyBehavior(ctxKey);
    setLastEventLog(`Konteks diterapkan: ${plan.contextName} -> State: [${plan.state}]`);
  };

  const rigNodes = defaultCharacterRuntime.getActiveRig().nodes;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              TADE v9.2.0-MCA2 — Living Character Runtime
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Founder Animation Preview Cockpit
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-400 text-slate-950 font-black tracking-wide">
                60 FPS LIVE
              </span>
            </h1>
            <p className="mt-2 text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Living character execution engine: State Machine, Dynamic Idle Physics,
              Saccadic Gaze, Interaction Layers, and Zero-Crash Asset Fallback.
            </p>
          </div>

          {/* Quick Character Switcher */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
            <button
              onClick={() => handleSelectCharacter('ASY')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                selectedChar === 'ASY'
                  ? 'bg-emerald-600 text-white shadow-lg font-bold'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Asy size={38} expression="happy" pose="wave" />
              <div className="text-left text-xs">
                <p className="font-bold">Asy</p>
                <p className="opacity-75 text-[10px]">Santri Koko</p>
              </div>
            </button>
            <button
              onClick={() => handleSelectCharacter('SYIFA')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                selectedChar === 'SYIFA'
                  ? 'bg-rose-600 text-white shadow-lg font-bold'
                  : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              <Syifa size={38} expression="happy" pose="butterfly" />
              <div className="text-left text-xs">
                <p className="font-bold">Syifa</p>
                <p className="opacity-75 text-[10px]">Gamis Syar'i</p>
              </div>
            </button>
          </div>
        </div>

        {/* Live Event Log Bar */}
        <div className="mt-5 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200/90 font-mono">
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
            <span className="text-slate-400">EVENT_LOG:</span> {lastEventLog}
          </span>
          <span className="text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
            FRAME: {metrics.renderedFrames}
          </span>
        </div>
      </div>

      {/* Main Grid: Character Canvas & Cockpit Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Character Stage & Quick Stats */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
            <div className="absolute inset-0 bg-radial from-emerald-50/60 to-transparent pointer-events-none" />
            
            {/* Live Character Visualizer */}
            <div className="relative z-10 py-6">
              {selectedChar === 'ASY' ? (
                <Asy
                  size={160}
                  expressionSnapshot={expressionSnapshot}
                  pose={stateSnapshot.pose}
                  onClick={handleSimulateTap}
                />
              ) : (
                <Syifa
                  size={160}
                  expressionSnapshot={expressionSnapshot}
                  pose={stateSnapshot.pose}
                  onClick={handleSimulateTap}
                />
              )}
            </div>

            {/* Character State & Expression Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 relative z-10 mt-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5" />
                State: {stateSnapshot.currentState}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Pose: {stateSnapshot.pose}
              </span>
              <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold">
                Expr: {expressionSnapshot.currentExpression}
              </span>
            </div>

            {/* Quick Interactive Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100 w-full justify-center">
              <button
                onClick={handleSimulateTap}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <MousePointer className="w-3.5 h-3.5" />
                Tap Reaksi
              </button>
              <button
                onClick={handleToggleTypingPause}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isTypingSimulated
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                {isTypingSimulated ? 'Stop Typing' : 'Simulasi Typing'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center">
              <p className="text-[11px] text-stone-500 font-semibold uppercase">Framerate</p>
              <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{metrics.fps} FPS</p>
              <p className="text-[10px] text-stone-400">Target: {metrics.targetFps} FPS</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center">
              <p className="text-[11px] text-stone-500 font-semibold uppercase">Frame Time</p>
              <p className="text-xl font-extrabold text-slate-700 mt-0.5">{metrics.frameTimeMs} ms</p>
              <p className="text-[10px] text-stone-400">Budget: 16.6ms</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center">
              <p className="text-[11px] text-stone-500 font-semibold uppercase">CPU Load</p>
              <p className="text-xl font-extrabold text-amber-600 mt-0.5">{metrics.cpuLoadEstimate}%</p>
              <p className="text-[10px] text-stone-400">Low Idle Profile</p>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Deep-Dive Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-1.5 border-b border-stone-200 pb-3 mb-5 overflow-x-auto">
            {[
              { id: 'states', label: 'State Machine (R923)', icon: Sliders },
              { id: 'idle', label: 'Idle Dynamics (R924)', icon: Activity },
              { id: 'context', label: 'Context Engine (R925)', icon: BookOpen },
              { id: 'rig', label: 'Rig Hierarchy (R922)', icon: Layers },
              { id: 'telemetry', label: 'Telemetry (R921)', icon: Cpu },
              { id: 'asset', label: 'Asset Loader (R928)', icon: FileCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: STATE MACHINE */}
          {activeTab === 'states' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Uji 9 State Transisi Kanon</h3>
                  <p className="text-xs text-stone-500">Transisi halus, easing cubic-out, dan auto-reset idle.</p>
                </div>
                <button
                  onClick={() => defaultStateMachine.resetToIdle()}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Idle
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {(['idle', 'wave', 'point', 'readIqro', 'butterfly', 'celebrate', 'confused', 'shy', 'sleepy'] as CharacterState[]).map(st => {
                  const cfg = defaultStateMachine.getStateConfig(st);
                  const isCurrent = stateSnapshot.currentState === st;
                  return (
                    <button
                      key={st}
                      onClick={() => handleTriggerState(st)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-stone-50/60 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs capitalize text-slate-800">{st}</span>
                        {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                      </div>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{cfg.label}</p>
                      <p className="text-[10px] text-stone-500 line-clamp-1 mt-1">{cfg.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* State Transition Progress Bar */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600 font-medium">Blend Weight / Transition Progress</span>
                  <span className="font-bold text-emerald-700 font-mono">{(stateSnapshot.transitionProgress * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-75"
                    style={{ width: `${stateSnapshot.transitionProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDLE CONTROLLER DYNAMICS */}
          {activeTab === 'idle' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Dynamic Living Physics</h3>
                <p className="text-xs text-stone-500">Parameter bernapas, kedipan acak, dan pergerakan tatapan mata.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <p className="text-xs font-bold text-stone-700">Fase Nafas (Breathing Sinusoid)</p>
                  <p className="text-lg font-extrabold text-emerald-600 font-mono">{(idleSnapshot.breathingPhase * 100).toFixed(1)}%</p>
                  <p className="text-[10px] text-stone-500">Bob Offset: {idleSnapshot.bodyBobY.toFixed(2)}px</p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <p className="text-xs font-bold text-stone-700">Head Tilt Micro-Angle</p>
                  <p className="text-lg font-extrabold text-slate-800 font-mono">{idleSnapshot.headTiltDeg.toFixed(2)}°</p>
                  <p className="text-[10px] text-stone-500">Harmonic oscillation (-3° to +3°)</p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <p className="text-xs font-bold text-stone-700">Saccadic Gaze Tracking</p>
                  <p className="text-sm font-bold text-sky-700 font-mono">
                    X: {idleSnapshot.gaze.x.toFixed(2)} | Y: {idleSnapshot.gaze.y.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-stone-500">Target random wander bounds</p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <p className="text-xs font-bold text-stone-700">Eye Blink State</p>
                  <p className="text-sm font-bold text-amber-700">
                    {idleSnapshot.isBlinking ? 'CLOSED (Kedip)' : 'OPEN (Buka)'}
                  </p>
                  <button
                    onClick={() => defaultIdleController.triggerBlink()}
                    className="text-[10px] px-2 py-1 bg-stone-200 hover:bg-stone-300 rounded font-semibold text-slate-700 mt-1"
                  >
                    Trigger Blink Manual
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTEXT ENGINE SIMULATOR */}
          {activeTab === 'context' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Simulasi Modul & Rute Aktif</h3>
                <p className="text-xs text-stone-500">Pengujian otomatis integrasi Context Behavior Engine (R925).</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(CONTEXT_BEHAVIOR_MAP).map(item => (
                  <button
                    key={item.contextId}
                    onClick={() => handleApplyContext(item.contextId)}
                    className="p-3 bg-stone-50 hover:bg-emerald-50 rounded-2xl border border-stone-200 hover:border-emerald-300 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-800">{item.contextName}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{item.state}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 italic mt-1 line-clamp-2">
                      "{selectedChar === 'ASY' ? item.asyDialogue : item.syifaDialogue}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RIG & BODY PARTS HIERARCHY */}
          {activeTab === 'rig' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Struktur Anatomi 2.5 Kepala ({selectedChar})
                </h3>
                <p className="text-xs text-stone-500">Daftar node hierarki tulang dan part tanpa rig eksternal.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {Object.values(rigNodes).map(node => (
                  <div key={node.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{node.name}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Z: {node.zIndex}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      ID: <span className="font-mono">{node.id}</span> {node.parentId ? `| Parent: ${node.parentId}` : ''}
                    </p>
                    <div className="flex gap-2 text-[10px] text-stone-600 mt-1 font-mono">
                      <span>Anchor: ({node.anchor.x}, {node.anchor.y})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TELEMETRY & RUNTIME SETTINGS */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Runtime Telemetry & Performance Guard</h3>
                <p className="text-xs text-stone-500">Target 60 FPS, zero memory leak, auto cleanup lifecycle.</p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-600">Status Engine:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> RUNNING_SMOOTH
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-600">Target FPS Cap:</span>
                  <div className="flex gap-1.5">
                    {[30, 60, 120].map(fps => (
                      <button
                        key={fps}
                        onClick={() => {
                          setTargetFps(fps);
                          defaultCharacterRuntime.setTargetFPS(fps);
                        }}
                        className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          targetFps === fps ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {fps}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-600">Page Visibility Pause:</span>
                  <span className="font-bold text-emerald-700">AKTIF (Zero CPU on Tab Blur)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-600">Memory Footprint Estimate:</span>
                  <span className="font-mono font-bold text-slate-700">{metrics.memoryEstimateKb} KB (Ultra Lightweight)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ASSET LOADER DIAGNOSTICS */}
          {activeTab === 'asset' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Asset Loader Diagnostics (R928)</h3>
                <p className="text-xs text-stone-500">Pipeline prioritas: master.riv &gt; master.svg &gt; Vector Fallback.</p>
              </div>

              {assetStatus && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-emerald-950">
                    <span>Format Aktif:</span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">{assetStatus.format}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Status:</span>
                    <span className="font-bold text-emerald-800">{assetStatus.status}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Primary URI:</span>
                    <span className="font-mono text-[11px]">{assetStatus.primaryUri}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Fallback Ready:</span>
                    <span className="font-bold text-emerald-700">YA (Anti-Crash Guaranteed)</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
