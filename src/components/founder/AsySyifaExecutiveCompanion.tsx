import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Activity,
  Radio,
  Cpu,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  Zap,
  RotateCcw,
  Compass,
  Crown,
  Volume2,
  Mic,
  ArrowRight,
  ListOrdered,
  Bot,
  AlertTriangle,
  Flame,
  CheckSquare,
  HeartPulse,
  Clock
} from 'lucide-react';
import {
  executiveCompanionRuntime,
  CoordinatedAgentStatus,
  PriorityAlertItem
} from '../../services/executiveCompanionRuntime';

interface Props {
  onNavigateTab?: (tabId: string) => void;
}

export const AsySyifaExecutiveCompanion: React.FC<Props> = ({ onNavigateTab }) => {
  const [runtimeState, setRuntimeState] = useState(executiveCompanionRuntime.getState());
  const [selectedAgent, setSelectedAgent] = useState<string>('agent-guardian');
  const [customCommand, setCustomCommand] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'info'; text: string } | null>(null);
  
  // Phase-2 / G5: Intelligent Command Dispatch state
  const [activeDispatchResult, setActiveDispatchResult] = useState<{
    interpretedIntent: string;
    targetAgents: string[];
    stepsExecuted: string[];
    synthesis: string;
    suggestedModuleTab?: string;
  } | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const handleQuickDispatch = (agentId: string, cmdTitle: string) => {
    const res = executiveCompanionRuntime.dispatchDirective(agentId, cmdTitle);
    setRuntimeState(executiveCompanionRuntime.getState());
    setFeedbackMsg({
      type: 'success',
      text: res.message
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleIntelligentSubmit = (queryText: string) => {
    if (!queryText.trim()) return;

    setIsProcessingVoice(true);
    setTimeout(() => {
      const result = executiveCompanionRuntime.executeIntelligentCommand(queryText.trim());
      setActiveDispatchResult(result);
      setRuntimeState(executiveCompanionRuntime.getState());
      setIsProcessingVoice(false);
      setCustomCommand('');
    }, 450);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleIntelligentSubmit(customCommand);
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'agent-guardian': return ShieldCheck;
      case 'agent-drpulse': return Activity;
      case 'agent-hermes': return Radio;
      case 'agent-tib': return Cpu;
      case 'agent-atlas': return BookOpen;
      default: return Sparkles;
    }
  };

  const autoBrief = runtimeState.autoBriefing;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Companion Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              LIVING ASSISTANT RUNTIME v10.2
            </span>
            <span className="text-xs text-stone-300">
              Sprint G5 Autonomous Living Intelligence
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            Asy & Syifa Living Assistant
          </h3>
          <p className="text-xs text-teal-100/80 max-w-2xl">
            Asisten cerdas pendamping Founder. Otomatis menyusun Daily Brief, membuka antrean misi, memeriksa paspor kesehatan, dan memonitor peringatan prioritas saat Anda login.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-teal-500/30 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-black text-sm">
            ASY
          </div>
          <div className="text-stone-400 font-bold text-xs">+</div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-sm">
            SYIFA
          </div>
          <div className="ml-2 pr-2 border-l border-stone-700 pl-3">
            <div className="text-[10px] text-stone-400 font-bold uppercase">Kesiapan</div>
            <div className="text-xs font-black text-emerald-400">{autoBrief.readinessScore}% READY</div>
          </div>
        </div>
      </div>

      {/* AUTOMATIC LOGIN BRIEFING SUITE (G5 Feature) */}
      <div className="p-5 bg-stone-50 border border-stone-200 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              AUTONOMOUS MORNING SITREP • {autoBrief.loginTime}
            </span>
            <h4 className="text-sm font-extrabold text-stone-900">
              {autoBrief.greeting}
            </h4>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
            Health: {autoBrief.healthPassport.overallScore}% (Hijau)
          </span>
        </div>

        <p className="text-xs text-stone-600 italic bg-white p-3 rounded-2xl border border-stone-200">
          "{autoBrief.summaryQuote}"
        </p>

        {/* 3-Column Living Suite: Mission Queue, Health Passport, Priority Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* 1. Mission Queue Quick Glance */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                Antrean Misi Prioritas
              </span>
              <span className="text-[10px] font-bold text-stone-400">{autoBrief.topMissions.length} Misi</span>
            </div>
            <div className="space-y-1.5">
              {autoBrief.topMissions.map((m) => (
                <div key={m.id} className="p-2 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between gap-1 text-[11px]">
                  <span className="truncate font-semibold text-stone-800">{m.title}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    m.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {m.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Health Passport Quick Glance */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                Paspor Kesehatan Sistem
              </span>
              <span className="text-[10px] font-bold text-emerald-700">8/8 Hijau</span>
            </div>
            <div className="space-y-1 text-[11px] text-stone-600">
              <div className="flex justify-between">
                <span>Guardian Ring-0:</span>
                <span className="font-bold text-emerald-700">Terkunci</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Terpakai:</span>
                <span className="font-bold text-stone-800">16.8% (Sangat Longgar)</span>
              </div>
              <div className="flex justify-between">
                <span>Performa Frame Rate:</span>
                <span className="font-bold text-emerald-700">60 FPS Stabil</span>
              </div>
              <div className="flex justify-between">
                <span>Integritas SSoT:</span>
                <span className="font-bold text-emerald-700">100% Valid</span>
              </div>
            </div>
          </div>

          {/* 3. Priority Alerts */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Peringatan Prioritas
              </span>
              <span className="text-[10px] font-bold text-amber-700">{autoBrief.priorityAlerts.length} Notifikasi</span>
            </div>
            <div className="space-y-1.5">
              {autoBrief.priorityAlerts.map((alt) => (
                <div key={alt.id} className="p-2 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-0.5 text-[11px]">
                  <div className="flex justify-between font-bold text-amber-900">
                    <span>{alt.title}</span>
                    <span className="text-[9px] font-mono text-amber-700">{alt.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-stone-600">{alt.actionRequired}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 5 Coordinated Agents Matrix */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          Matriks 5 Pilar Koordinasi
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {runtimeState.agents.map((agent) => {
            const Icon = getAgentIcon(agent.id);
            const isSelected = selectedAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/30'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {agent.healthScore}%
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-stone-900 leading-tight">
                    {agent.name}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    {agent.codename}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/60 text-[10px] text-stone-600 line-clamp-2">
                  {agent.lastAction}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intelligent Multi-Agent Command Dispatcher */}
      <div className="p-5 bg-gradient-to-br from-stone-900 via-slate-900 to-teal-950 border border-stone-800 rounded-3xl text-white space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-teal-300">
              Living Command Dispatcher & Sovereign Runtime
            </span>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            Autonomous Dispatch Active
          </span>
        </div>

        {/* Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          {[
            'Perbaiki sistem upload & media',
            'Audit keamanan Ring-0 & isolasi RBAC',
            'Cek memori heap & cache PWA',
            'Sertifikasi broadcast WhatsApp wali',
            'Buka Creative Studio poster & banner'
          ].map((promptText) => (
            <button
              key={promptText}
              onClick={() => handleIntelligentSubmit(promptText)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-teal-900/60 border border-stone-700 hover:border-teal-500 text-stone-200 text-xs font-medium transition cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Command Form */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
              placeholder="Berikan arahan langsung ke Asy & Syifa..."
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-teal-400"
            />
            {isProcessingVoice && (
              <div className="absolute right-3 top-2.5 flex items-center gap-1">
                <span className="w-1.5 h-3 bg-teal-400 animate-bounce rounded-full" />
                <span className="w-1.5 h-4 bg-teal-400 animate-bounce [animation-delay:0.1s] rounded-full" />
                <span className="w-1.5 h-2 bg-teal-400 animate-bounce [animation-delay:0.2s] rounded-full" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isProcessingVoice}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Jalankan
          </button>
        </form>

        {/* Dispatch Resolution Card */}
        {activeDispatchResult && (
          <div className="mt-4 p-4 bg-slate-950/80 border border-teal-500/40 rounded-2xl space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-black text-teal-300">
                  {activeDispatchResult.interpretedIntent}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {activeDispatchResult.targetAgents.map(ag => (
                  <span key={ag} className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] text-amber-300 font-mono">
                    {ag.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* Execution Steps */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                <ListOrdered className="w-3.5 h-3.5 text-teal-400" />
                Langkah Koordinasi Multi-Pilar:
              </div>
              {activeDispatchResult.stepsExecuted.map((step, idx) => (
                <div key={idx} className="text-xs text-stone-300 flex items-start gap-2 pl-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Synthesis Response */}
            <div className="p-3 bg-teal-950/40 border border-teal-500/30 rounded-xl text-xs text-teal-100 font-medium">
              {activeDispatchResult.synthesis}
            </div>

            {/* Direct Navigation Button */}
            {activeDispatchResult.suggestedModuleTab && onNavigateTab && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onNavigateTab(activeDispatchResult.suggestedModuleTab!)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Buka Modul Terkait</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
