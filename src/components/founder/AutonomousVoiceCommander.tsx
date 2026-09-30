/**
 * TADE AUTONOMOUS VOICE COMMANDER — SPRINT G12 (P3)
 * Asy & Syifa Hands-Free Voice Control
 * 
 * Features:
 * 1. Web Speech API with real-time feedback
 * 2. GPU-friendly single-canvas waveform (FPS-governed)
 * 3. 1-Click voice command quick chips
 * 4. Spoken confirmation in Pure Brand Indonesian tone
 * 5. Direct navigation to target modules
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  Activity,
  Radio,
  Cpu,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  founderVoiceEngine,
  VoiceCommandIntent,
  PredefinedVoiceCommand
} from '../../services/founderVoiceEngine';

interface Props {
  onNavigateTab?: (tabId: string) => void;
  onOpenCabinetMeeting?: () => void;
}

export const AutonomousVoiceCommander: React.FC<Props> = ({
  onNavigateTab,
  onOpenCabinetMeeting
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [activeIntent, setActiveIntent] = useState<VoiceCommandIntent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [manualText, setManualText] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);

  const predefinedCommands = founderVoiceEngine.getPredefinedList();

  // GPU-Friendly Waveform Animation
  useEffect(() => {
    if (!isListening) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#10b981';

      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      for (let x = 0; x < width; x += 4) {
        const y = mid + Math.sin(x * 0.05 + phase) * 8 * Math.sin(x * 0.02 + phase * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      phase += 0.1;
      animFrameId = requestAnimationFrame(renderWave);
    };

    animFrameId = requestAnimationFrame(renderWave);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isListening]);

  const handleToggleMic = () => {
    if (isListening) {
      if (stopListeningRef.current) stopListeningRef.current();
      setIsListening(false);
      return;
    }

    setErrorMessage(null);
    setIsListening(true);

    const stop = founderVoiceEngine.startListening(
      (intent) => {
        setIsListening(false);
        setTranscript(intent.rawTranscript);
        setActiveIntent(intent);
        if (intent.targetModuleTab === 'CABINET_MEETING_TRIGGER' && onOpenCabinetMeeting) {
          onOpenCabinetMeeting();
        }
      },
      (err) => {
        setIsListening(false);
        setErrorMessage(err);
      }
    );

    stopListeningRef.current = stop;
  };

  const handleExecuteChip = (cmd: PredefinedVoiceCommand) => {
    const intent = founderVoiceEngine.parseCommand(cmd.phrases[0]);
    setTranscript(cmd.phrases[0]);
    setActiveIntent(intent);

    if (soundEnabled) {
      founderVoiceEngine.speakFeedback(intent.spokenResponse);
    }

    if (intent.targetModuleTab === 'CABINET_MEETING_TRIGGER' && onOpenCabinetMeeting) {
      onOpenCabinetMeeting();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const intent = founderVoiceEngine.parseCommand(manualText.trim());
    setTranscript(manualText.trim());
    setActiveIntent(intent);
    setManualText('');

    if (soundEnabled) {
      founderVoiceEngine.speakFeedback(intent.spokenResponse);
    }

    if (intent.targetModuleTab === 'CABINET_MEETING_TRIGGER' && onOpenCabinetMeeting) {
      onOpenCabinetMeeting();
    }
  };

  const handleNavigate = () => {
    if (!activeIntent) return;
    if (activeIntent.targetModuleTab === 'CABINET_MEETING_TRIGGER') {
      if (onOpenCabinetMeeting) onOpenCabinetMeeting();
    } else if (onNavigateTab) {
      onNavigateTab(activeIntent.targetModuleTab);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              VOICE READY FOUNDATION (P3)
            </span>
            <span className="text-xs text-stone-400 font-medium">Web Speech API</span>
          </div>
          <h3 className="text-lg font-black text-stone-900">
            Autonomous Voice Commander Asy & Syifa
          </h3>
          <p className="text-xs text-stone-500">
            Bicara secara alami atau klik pintasan untuk menginstruksikan dewan kedaulatan sekolah.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto ${
            soundEnabled
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-stone-100 border-stone-200 text-stone-500'
          }`}
          title={soundEnabled ? 'Suara Asy & Syifa Aktif' : 'Suara Dimatikan'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          <span className="text-[11px]">{soundEnabled ? 'Audio Aktif' : 'Mute'}</span>
        </button>
      </div>

      {/* Mic Trigger & Waveform Center */}
      <div className="bg-gradient-to-br from-stone-900 to-slate-950 p-6 rounded-3xl text-white relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4">
        {/* Canvas waveform */}
        <canvas
          ref={canvasRef}
          width={320}
          height={48}
          className="w-full max-w-xs h-12 rounded-xl"
        />

        {/* Big Mic Button */}
        <button
          onClick={handleToggleMic}
          className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-red-500/50 scale-105'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30'
          }`}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <div>
          <span className="text-xs font-bold text-stone-300 block">
            {isListening ? 'Mendengarkan suara Founder... Silakan berbicara' : 'Klik mikrofon untuk berbicara'}
          </span>
          <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
            Contoh: "Buka PPDB", "Cek Guardian", "Jalankan Rapat Kabinet"
          </span>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2 max-w-md">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Active Intent Result Card */}
      {activeIntent && (
        <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900">Perintah Diterima:</span>
              <span className="text-xs font-black text-stone-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                "{transcript}"
              </span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full">
              {activeIntent.targetEngine}
            </span>
          </div>

          <p className="text-xs text-emerald-900 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-200">
            {activeIntent.spokenResponse}
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-stone-500">
              Modul Target: <strong className="text-stone-800">{activeIntent.actionTitle}</strong>
            </span>
            <button
              onClick={handleNavigate}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Buka Modul Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Manual Input Fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Ketik perintah Founder (misal: 'Periksa PPDB', 'Cari error')..."
          className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-stone-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Kirim</span>
        </button>
      </form>

      {/* Quick Voice Chips */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <span className="text-[11px] font-bold text-stone-500 block">
          Pintasan Perintah Cepat Suara & Teks:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {predefinedCommands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleExecuteChip(cmd)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-100 hover:text-emerald-950 text-stone-700 text-[11px] font-bold border border-stone-200 hover:border-emerald-300 transition cursor-pointer"
            >
              🎙️ "{cmd.phrases[0]}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
