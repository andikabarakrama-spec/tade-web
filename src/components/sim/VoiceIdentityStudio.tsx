import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  Play,
  Pause,
  Sparkles,
  Bot,
  ShieldCheck,
  Heart,
  Sliders,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface VoiceProfile {
  id: string;
  name: string;
  character: string;
  role: string;
  tone: string;
  sampleQuote: string;
  speed: string;
  pitch: string;
  accent: string;
  status: 'PREVIEW_ACTIVE' | 'STANDBY';
}

const VOICES: VoiceProfile[] = [
  {
    id: 'voice_asy_prime',
    name: 'AI Asy Prime (Executive Companion)',
    character: 'Penasihat Eksekutif & Asisten Ketua Yayasan',
    role: 'R63 Workspace, Governance, R70 Mission Control',
    tone: 'Wibawa, tenang, sopan, bernuansa Islami profesional',
    sampleQuote: 'Assalamu’alaikum Warahmatullahi Wabarakatuh. Bapak Ketua Yayasan, seluruh agenda operasional dan persetujuan hari ini siap ditinjau.',
    speed: '1.0x (Normal)',
    pitch: 'Medium-Warm Baritone',
    accent: 'Bahasa Indonesia Baku & Santun',
    status: 'PREVIEW_ACTIVE'
  },
  {
    id: 'voice_dek_syifa',
    name: 'Dek Syifa (Playful Kindergarten Friend)',
    character: 'Sahabat Cilik Dek Syifa & Pemandu Siswa/Wali',
    role: 'Lobby Receptionist, R29 Portal Wali Murid, School TV',
    tone: 'Ceria, lembut, penuh kasih sayang, ramah anak PAUD',
    sampleQuote: 'Hai teman-teman Asy-Syifatan! Yuk kita mulai belajar sentra hari ini dengan baca Basmalah bersama-sama!',
    speed: '1.05x (Ceria)',
    pitch: 'Cheerful High-Warm Soprano',
    accent: 'Bahasa Indonesia Ramah Anak',
    status: 'STANDBY'
  },
  {
    id: 'voice_guardian',
    name: 'Guardian Tactical Watchtower Voice',
    character: 'Komandan Keamanan Sistem & Database',
    role: 'Super Admin, R58 Guardian, Threat Map, Self Health',
    tone: 'Tegas, presisi, analitis, fokus pada keandalan sistem',
    sampleQuote: 'Guardian Sentinel online. Seluruh 10 repositori terenkripsi, zero-downtime watchtower aktif 24 jam.',
    speed: '1.1x (Cepat & Taktis)',
    pitch: 'Deep Resonant Synth',
    accent: 'Bahasa Indonesia Taktis Komando',
    status: 'STANDBY'
  }
];

export const VoiceIdentityStudio: React.FC = () => {
  const [voices, setVoices] = useState<VoiceProfile[]>(VOICES);
  const [activeVoiceId, setActiveVoiceId] = useState<string>('voice_asy_prime');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([40, 60, 30, 80, 95, 70, 50, 85, 60, 45, 90, 75, 40]);

  const activeVoice = voices.find(v => v.id === activeVoiceId) || voices[0];

  const handlePlayVoice = (id: string) => {
    setActiveVoiceId(id);
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 border border-indigo-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  VOICE IDENTITY STUDIO
                </span>
                <span className="text-xs text-slate-400">Multi-Persona Audio Architecture</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                AI Asy Voice Identity & Persona Studio
              </h1>
              <p className="text-sm text-indigo-100/80 mt-0.5">
                Infrastruktur karakter suara multi-persona: AI Asy Prime, Dek Syifa, dan Guardian Sentinel untuk pengalaman interaksi suara alami.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-3 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Fluid Natural Indonesian TTS Ready</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Voice Profiles & Audition Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Voice Selection */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pilih Persona Suara</h3>

            {voices.map(voice => (
              <div
                key={voice.id}
                onClick={() => setActiveVoiceId(voice.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  activeVoiceId === voice.id
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{voice.name}</span>
                  {activeVoiceId === voice.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">{voice.character}</div>
                <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                  Target: {voice.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Audition & Acoustic Parameters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{activeVoice.name}</h3>
                <p className="text-xs text-slate-500">{activeVoice.tone}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {activeVoice.accent}
              </span>
            </div>

            {/* Simulated Audio Player & Waveform Visualizer */}
            <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-5">
              <div className="text-xs text-slate-400 font-mono">Sample Audio Narration:</div>
              <div className="text-sm md:text-base font-serif italic text-slate-200 bg-slate-900/90 p-4 rounded-xl border border-slate-800 leading-relaxed">
                "{activeVoice.sampleQuote}"
              </div>

              {/* Animated Waveform */}
              <div className="h-16 flex items-center justify-center gap-1.5 px-4 bg-slate-900/60 rounded-xl">
                {waveformBars.map((height, idx) => (
                  <div
                    key={idx}
                    className={`w-2 rounded-full transition-all duration-200 ${
                      isPlaying ? 'bg-gradient-to-t from-teal-400 to-indigo-400 animate-pulse' : 'bg-slate-700'
                    }`}
                    style={{ height: isPlaying ? `${Math.max(15, (height * (Math.random() + 0.5)) % 60)}px` : '8px' }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handlePlayVoice(activeVoice.id)}
                  disabled={isPlaying}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Sedang Memutar Suara...' : 'Audisi Suara Karakter'}
                </button>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>Output: Web Audio Synthesizer HD</span>
                </div>
              </div>
            </div>

            {/* Acoustic Profile Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 font-semibold">Kecepatan Bicara</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{activeVoice.speed}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 font-semibold">Pitch & Timbre</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{activeVoice.pitch}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 font-semibold">Bahasa & Dialek</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{activeVoice.accent}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
