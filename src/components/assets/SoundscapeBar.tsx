import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Sparkles,
  Radio,
  Sliders,
  CheckCircle2,
  Trees,
  Wind,
  Bird,
  Droplets,
  Bell
} from 'lucide-react';
import {
  tadeSoundEngine,
  TadeSoundType,
  TADE_SOUND_PRESETS,
  SoundPreset
} from '../../services/tadeSoundEngine';
import { tadeAssetCenterService } from '../../services/tadeAssetCenterService';

export const SoundscapeBar: React.FC = () => {
  const [activeSound, setActiveSound] = useState<TadeSoundType | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedTimer, setSelectedTimer] = useState<number>(0); // 0 = endless

  useEffect(() => {
    const unsub = tadeSoundEngine.subscribe((sound, playing, vol) => {
      setActiveSound(sound);
      setIsPlaying(playing);
      setVolume(vol);
    });
    return () => unsub();
  }, []);

  const handlePlayToggle = (type: TadeSoundType) => {
    tadeSoundEngine.play(type);
    tadeAssetCenterService.recordAssetUsage(`sound-${type.toLowerCase()}`, 'Soundscape Ambient');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    tadeSoundEngine.setVolume(val);
  };

  const handleMuteToggle = () => {
    const muted = tadeSoundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleSleepTimer = (minutes: number) => {
    setSelectedTimer(minutes);
    tadeSoundEngine.setSleepTimer(minutes);
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bird':
        return <Bird className="w-6 h-6" />;
      case 'Wind':
        return <Wind className="w-6 h-6" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6" />;
      case 'Bell':
        return <Bell className="w-6 h-6" />;
      case 'Trees':
      default:
        return <Trees className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sound Player Control Center */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Pusat Suara Alami Asy-Syifa (Web Audio Engine)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  100% Sintetis Offline • Damai & Khusyuk
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Suasana alami menyejukkan hati untuk mengiringi fokus sentra, tilawah Al-Qur'an, dan transisi belajar.
              </p>
            </div>
          </div>

          {/* Quick Player Bar */}
          {isPlaying && activeSound && (
            <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-teal-500/40">
              {/* Waveform Visualizer */}
              <div className="flex items-center gap-1 h-5">
                {[40, 80, 60, 100, 50, 90, 70, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-teal-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>

              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">Sedang Diputar:</span>
                <span className="font-bold text-teal-300">
                  {TADE_SOUND_PRESETS.find(p => p.id === activeSound)?.title}
                </span>
              </div>

              <button
                onClick={() => tadeSoundEngine.stop()}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40 transition-colors"
              >
                Hentikan
              </button>
            </div>
          )}
        </div>

        {/* Sliders & Sleep Timer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-700/60 text-xs">
          {/* Volume Control */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <span className="text-slate-400 font-mono text-[11px] w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Sleep Timer Options */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              Timer Otomatis:
            </span>
            {[
              { min: 0, label: 'Loop Terus' },
              { min: 5, label: '5 Mnt' },
              { min: 15, label: '15 Mnt' },
              { min: 30, label: '30 Mnt' }
            ].map(t => (
              <button
                key={t.min}
                onClick={() => handleSleepTimer(t.min)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  selectedTimer === t.min
                    ? 'border-teal-400 bg-teal-500/20 text-teal-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TADE_SOUND_PRESETS.map(preset => {
          const isThisPlaying = activeSound === preset.id && isPlaying;
          return (
            <div
              key={preset.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isThisPlaying
                  ? 'bg-teal-950/40 border-teal-500/70 shadow-lg shadow-teal-950/40 ring-1 ring-teal-400/40'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    isThisPlaying
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300'
                  }`}>
                    {getPresetIcon(preset.iconName)}
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600">
                    {preset.durationLabel}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-0.5">
                  {preset.title}
                </h4>
                <p className="text-xs text-teal-300 font-medium mb-2">
                  {preset.subtitle}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {preset.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {preset.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handlePlayToggle(preset.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                  isThisPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/30'
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/30'
                }`}
              >
                {isThisPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Jeda Suara
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Putar Suara
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
