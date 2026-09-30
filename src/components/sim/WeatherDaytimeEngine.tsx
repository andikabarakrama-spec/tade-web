import React, { useState } from 'react';
import { 
  Sun, 
  CloudSun, 
  Sunset, 
  Moon, 
  Cloud, 
  CloudRain, 
  Sparkles, 
  Clock, 
  Compass, 
  VolumeX, 
  Volume2, 
  BatteryCharging, 
  Layers, 
  CheckCircle2, 
  Thermometer, 
  Wind,
  Umbrella,
  Eye
} from 'lucide-react';

export type DaytimePeriod = 'PAGI' | 'SIANG' | 'SORE' | 'MALAM';
export type WeatherCondition = 'CERAH' | 'MENDUNG' | 'HUJAN';

export const WeatherDaytimeEngine: React.FC = () => {
  const [selectedDaytime, setSelectedDaytime] = useState<DaytimePeriod>('PAGI');
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition>('CERAH');
  const [isQuietMode, setIsQuietMode] = useState<boolean>(true); // Default to quiet mode
  const [isBatterySaver, setIsBatterySaver] = useState<boolean>(false);

  // Dynamic daytime profiles
  const daytimeProfiles = {
    PAGI: {
      label: 'Pagi Hari (05:00 - 10:59)',
      sapaan: 'Shobahul Khair! Semangat menjemput rezeki ilmu di pagi hari yang berkah.',
      suasana: 'Sejuk & Segar dengan pancaran sinar matahari pagi.',
      warnaBg: 'from-amber-500/20 via-sky-500/10 to-slate-900',
      icon: Sun,
      color: 'text-amber-400',
      aksesoriAsy: 'Topi Sentra Pagi & Tas Sekolah'
    },
    SIANG: {
      label: 'Siang Hari (11:00 - 14:59)',
      sapaan: 'Waktunya istirahat, makan siang bergizi, dan persiapan sholat Dzuhur berjamaah.',
      suasana: 'Hangat & Terang benderang.',
      warnaBg: 'from-orange-500/20 via-amber-500/10 to-slate-900',
      icon: CloudSun,
      color: 'text-orange-400',
      aksesoriAsy: 'Botol Minum Asy & Rompi Santai'
    },
    SORE: {
      label: 'Sore Hari (15:00 - 17:59)',
      sapaan: 'Masaul Khair! Pembelajaran TPA Al-Qur\'an dan murojaah hafalan sebelum petang.',
      suasana: 'Senja teduh & tenang menjelang Maghrib.',
      warnaBg: 'from-rose-500/20 via-indigo-500/10 to-slate-900',
      icon: Sunset,
      color: 'text-rose-400',
      aksesoriAsy: 'Peci & Buku Iqro/Al-Qur\'an'
    },
    MALAM: {
      label: 'Malam Hari (18:00 - 04:59)',
      sapaan: 'Selamat beristirahat santri cilik! Jangan lupa membaca doa tidur dan berwudhu.',
      suasana: 'Hening, damai, bertabur bintang malam.',
      warnaBg: 'from-indigo-950 via-slate-900 to-slate-950',
      icon: Moon,
      color: 'text-indigo-400',
      aksesoriAsy: 'Piyama Santun Bintang & Buku Doa'
    }
  };

  // Dynamic weather profiles
  const weatherProfiles = {
    CERAH: {
      label: 'Cerah Berawan',
      animasi: 'Kilauan Cahaya Mentari Lembut',
      reaksi: 'Asy tersenyum cerah dan penuh energi.',
      icon: Sun,
      badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
      suhu: '28°C - 31°C'
    },
    MENDUNG: {
      label: 'Mendung Sejuk',
      animasi: 'Awan Berarak Halus',
      reaksi: 'Asy memakai jaket tipis agar tetap hangat.',
      icon: Cloud,
      badgeColor: 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-300',
      suhu: '24°C - 26°C'
    },
    HUJAN: {
      label: 'Hujan Rahmat',
      animasi: 'Rintik Hujan Halus & Tetesan Berkah',
      reaksi: 'Asy membawa payung mungil dan membaca doa turun hujan.',
      icon: CloudRain,
      badgeColor: 'bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-300',
      suhu: '22°C - 24°C'
    }
  };

  const currentDaytime = daytimeProfiles[selectedDaytime];
  const currentWeather = weatherProfiles[selectedWeather];

  return (
    <div id="weather-daytime-engine-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sun className="w-48 h-48 text-sky-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
              R240 &bull; WEATHER &amp; DAYTIME ENGINE
            </span>
            <span className="text-xs text-slate-400">Environmental Adaptation &amp; Quiet Mode Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Sun className="w-8 h-8 text-sky-400" />
            Weather &amp; Daytime Engine
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Sistem penyesuaian lingkungan real-time untuk Maskot Asy. Menyesuaikan ekspresi, sapaan waktu (<strong>Pagi &bull; Siang &bull; Sore &bull; Malam</strong>), dan kondisi cuaca (<strong>Cerah &bull; Mendung &bull; Hujan</strong>) dengan beban animasi ultra-ringan.
          </p>
        </div>
      </div>

      {/* Simulator Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            Simulator Parameter Lingkungan
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuietMode(!isQuietMode)}
              className={`px-3 py-1 text-xs font-mono rounded-xl flex items-center gap-1.5 transition-all ${
                isQuietMode 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 font-bold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isQuietMode ? <VolumeX className="w-3.5 h-3.5 text-indigo-600" /> : <Volume2 className="w-3.5 h-3.5" />}
              Quiet Mode: {isQuietMode ? 'Aktif' : 'Non-Aktif'}
            </button>

            <button
              onClick={() => setIsBatterySaver(!isBatterySaver)}
              className={`px-3 py-1 text-xs font-mono rounded-xl flex items-center gap-1.5 transition-all ${
                isBatterySaver 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5 text-amber-600" />
              Saver: {isBatterySaver ? 'Aktif' : 'Non-Aktif'}
            </button>
          </div>
        </div>

        {/* Daytime Selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">Pilih Periode Waktu:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['PAGI', 'SIANG', 'SORE', 'MALAM'] as DaytimePeriod[]).map((time) => {
              const profile = daytimeProfiles[time];
              const Icon = profile.icon;
              const isSelected = selectedDaytime === time;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedDaytime(time)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-200 ring-1 ring-sky-400'
                      : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className={`w-4 h-4 ${profile.color}`} />
                    <span className="text-[10px] font-mono font-bold uppercase">{time}</span>
                  </div>
                  <div className="text-xs font-bold truncate">{profile.label.split(' ')[0]}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weather Selector */}
        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">Pilih Kondisi Cuaca:</span>
          <div className="grid grid-cols-3 gap-2">
            {(['CERAH', 'MENDUNG', 'HUJAN'] as WeatherCondition[]).map((weather) => {
              const profile = weatherProfiles[weather];
              const Icon = profile.icon;
              const isSelected = selectedWeather === weather;
              return (
                <button
                  key={weather}
                  onClick={() => setSelectedWeather(weather)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-200 ring-1 ring-sky-400'
                      : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="w-4 h-4 text-sky-500" />
                    <span className="text-[10px] font-mono">{profile.suhu}</span>
                  </div>
                  <div className="text-xs font-bold truncate">{profile.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Living Mascot Adaptation Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mascot Showcase in Environment */}
        <div className="lg:col-span-1 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden text-center">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-sky-400 font-bold">{currentDaytime.label.split(' ')[0]}</span>
              <span className="text-slate-400">{currentWeather.label}</span>
            </div>

            <div className="my-6 flex flex-col items-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-amber-500 p-1.5 shadow-2xl flex items-center justify-center relative">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border border-slate-700">
                  <span className="text-4xl">
                    {selectedWeather === 'HUJAN' ? '🐱☔' : selectedDaytime === 'MALAM' ? '🐱🌙' : '🐱✨'}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-sky-300 mt-1">ASY ENVIRONMENT</span>
                </div>
              </div>

              <h4 className="text-base font-bold text-white mt-4">
                Adaptasi: {currentDaytime.aksesoriAsy}
              </h4>
              <p className="text-xs text-sky-300 font-mono mt-0.5">
                {currentWeather.reaksi}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-left text-xs text-slate-200">
            <span className="font-bold text-sky-400 block mb-1 font-mono">Sapaan Lingkungan:</span>
            &ldquo;{currentDaytime.sapaan}&rdquo;
          </div>
        </div>

        {/* Right: Environmental Specs & Quiet Mode Assurance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500" />
              Matriks Adaptasi Cuaca &amp; Waktu Terintegrasi:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Suasana Waktu:</span>
                <span className="font-bold text-slate-900 dark:text-white block">{currentDaytime.suasana}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Pencahayaan UI otomatis menyesuaikan palet warna lembut.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">Efek Visual Cuaca:</span>
                <span className="font-bold text-slate-900 dark:text-white block">{currentWeather.animasi}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Perkiraan Suhu Mikro: {currentWeather.suhu}
                </span>
              </div>
            </div>

            {/* Quiet Mode & Performance Card */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 space-y-2 text-xs text-indigo-950 dark:text-indigo-200">
              <div className="flex items-center gap-2 font-bold font-mono">
                <VolumeX className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Standar Quiet Mode &amp; Kenyamanan Santri:
              </div>
              <p className="leading-relaxed">
                Perubahan cuaca dan waktu pada Asy tidak memutar suara otomatis yang mengganggu (Audio Muted by Default). Maskot hanya menyapa secara visual tanpa pop-up intrusif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
