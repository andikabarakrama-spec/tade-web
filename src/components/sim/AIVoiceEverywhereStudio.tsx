import React, { useState } from 'react';
import { 
  Mic, 
  Volume2, 
  Sparkles, 
  Bot, 
  Radio, 
  ShieldCheck, 
  Play, 
  Square, 
  CheckCircle2, 
  Command, 
  Sliders,
  Send,
  MessageSquare
} from 'lucide-react';

interface VoiceCommandPreset {
  id: string;
  phrase: string;
  category: 'NAVIGASI' | 'AKSI' | 'RINGKASAN' | 'SIARAN';
  actionTriggered: string;
  persona: 'AI_ASY_PRIME' | 'DEK_ASY' | 'GUARDIAN_SHIELD';
}

const VOICE_COMMANDS: VoiceCommandPreset[] = [
  {
    id: 'cmd-1',
    phrase: 'Dek Asy, buka laporan keuangan bulan ini',
    category: 'NAVIGASI',
    actionTriggered: 'Navigasi otomatis ke R4 Keuangan SPP',
    persona: 'DEK_ASY'
  },
  {
    id: 'cmd-2',
    phrase: 'AI Asy, rekap presensi santri Sentra Balok hari ini',
    category: 'AKSI',
    actionTriggered: 'Penyusunan rekap absensi & konsumsi katering otomatis',
    persona: 'AI_ASY_PRIME'
  },
  {
    id: 'cmd-3',
    phrase: 'Bacakan ringkasan surat akreditasi dari dinas',
    category: 'RINGKASAN',
    actionTriggered: 'Sintesis audio ringkasan eksekutif surat dinas',
    persona: 'AI_ASY_PRIME'
  },
  {
    id: 'cmd-4',
    phrase: 'Siarkan pengumuman penjemputan santri ke grup wali murid',
    category: 'SIARAN',
    actionTriggered: 'Penyebaran pesan broadcast WhatsApp resmi',
    persona: 'DEK_ASY'
  },
  {
    id: 'cmd-5',
    phrase: 'Guardian, periksa status keamanan database',
    category: 'AKSI',
    actionTriggered: 'Audit integritas koleksi Firestore & status DDoS',
    persona: 'GUARDIAN_SHIELD'
  }
];

export const AIVoiceEverywhereStudio: React.FC<{ onSelectModule?: (mod: string) => void }> = ({ onSelectModule }) => {
  const [selectedPersona, setSelectedPersona] = useState<'AI_ASY_PRIME' | 'DEK_ASY' | 'GUARDIAN_SHIELD'>('DEK_ASY');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('Dek Asy, buka ruang kerja eksekutif ketua yayasan');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const handleTestSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      
      if (selectedPersona === 'DEK_ASY') {
        utterance.pitch = 1.3; // Child friendly high pitch
        utterance.rate = 1.05;
      } else if (selectedPersona === 'GUARDIAN_SHIELD') {
        utterance.pitch = 0.8; // Deep authoritative
        utterance.rate = 1.0;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSimulateListen = () => {
    setIsListening(true);
    setCommandFeedback(null);
    setTimeout(() => {
      setIsListening(false);
      setCommandFeedback('Perintah Suara Dikenali: "Buka Ruang Kerja Eksekutif Ketua Yayasan" -> Melompat ke R101');
      handleTestSpeak('Siap! Dek Asy membuka Ruang Kerja Ketua Yayasan sekarang.');
      if (onSelectModule) {
        setTimeout(() => onSelectModule('r101'), 2000);
      }
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  R108 • AI Voice Everywhere
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Universal Workspace Speech AI
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 text-white">Pusat Interaksi Suara & Navigasi Cerdas AI Asy</h1>
              <p className="text-sm text-slate-300">
                Kendalikan aplikasi dengan perintah suara alami: Navigasi modul, ringkasan surat dinas, setoran tahfidz, dan broadcast wali murid.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Studio Main Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Voice Interaction Console (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Mikrofon Interaktif AI Voice</span>
            </h2>

            {/* Persona Switcher */}
            <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { id: 'DEK_ASY', label: '👦 Dek Asy (Ceria)' },
                { id: 'AI_ASY_PRIME', label: '🤖 AI Prime (Resmi)' },
                { id: 'GUARDIAN_SHIELD', label: '🛡️ Guardian' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id as any)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedPersona === p.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Central Voice Waveform & Trigger Button */}
          <div className="flex flex-col items-center justify-center p-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <button
              onClick={handleSimulateListen}
              disabled={isListening}
              className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-2xl transition-all transform active:scale-95 ${
                isListening
                  ? 'bg-rose-600 animate-pulse ring-8 ring-rose-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/50'
              }`}
            >
              <Mic className={`w-12 h-12 ${isListening ? 'animate-bounce' : ''}`} />
            </button>

            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isListening ? 'Mendengarkan Perintah Suara Anda...' : 'Tekan & Ucapkan Perintah'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Contoh: "Dek Asy, buka ruang kerja eksekutif" atau "Rekap presensi hari ini"
              </div>
            </div>

            {/* Spoken Transcript */}
            <div className="w-full p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-left text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Transkrip Terdeteksi:</span>
              <span>"{spokenTranscript}"</span>
            </div>

            {commandFeedback && (
              <div className="w-full p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{commandFeedback}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleTestSpeak('Assalamu\'alaikum wr wb. Dek Asy siap membantu aktivitas belajar mengajar di TK Islam Asy Syifa.')}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Uji Suara Persona ({selectedPersona})</span>
            </button>
          </div>
        </div>

        {/* Right: Voice Command Directory (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Command className="w-5 h-5 text-indigo-600" />
            <span>Koleksi Perintah Suara Cepat</span>
          </h3>

          <div className="space-y-3">
            {VOICE_COMMANDS.map((cmd) => (
              <div
                key={cmd.id}
                onClick={() => {
                  setSpokenTranscript(cmd.phrase);
                  handleTestSpeak(`Mengeksekusi: ${cmd.actionTriggered}`);
                }}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                    {cmd.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{cmd.persona}</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">
                  "{cmd.phrase}"
                </div>
                <div className="text-[11px] text-slate-500">
                  Aksi: {cmd.actionTriggered}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
