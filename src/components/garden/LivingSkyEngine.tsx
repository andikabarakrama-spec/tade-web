import React from 'react';
import { useLivingGarden, TimeOfDay } from '../../context/LivingGardenContext';
import { Sun, Moon, Cloud, Sparkles, Clock, Compass } from 'lucide-react';

interface SkyProps {
  mode?: 'full' | 'banner' | 'card';
  className?: string;
  children?: React.ReactNode;
}

export const LivingSkyEngine: React.FC<SkyProps> = ({ mode = 'full', className = '', children }) => {
  const { timeOfDay, settings, isBatteryLow, isTabActive, getHijriDate, getPrayerTimes } = useLivingGarden();

  const shouldAnimate = settings.skyEngineEnabled && !settings.isQuietMode && isTabActive && !isBatteryLow;

  const getSkyGradient = (time: TimeOfDay) => {
    switch (time) {
      case 'Pagi':
        return 'from-sky-300 via-amber-100/70 to-emerald-50';
      case 'Siang':
        return 'from-sky-400 via-blue-300 to-teal-100';
      case 'Sore':
        return 'from-amber-500 via-orange-400 to-rose-300';
      case 'Malam':
        return 'from-slate-950 via-indigo-950 to-emerald-950';
      default:
        return 'from-sky-300 to-emerald-50';
    }
  };

  const hijri = getHijriDate();
  const prayerTimes = getPrayerTimes();
  const activePrayer = prayerTimes.find((p) => p.active) || prayerTimes[2];

  return (
    <div className={`relative overflow-hidden transition-all duration-1000 ${className}`}>
      {/* Dynamic Sky Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getSkyGradient(timeOfDay)} opacity-90 -z-10 transition-all duration-1000`} />

      {/* Sky Celestial Elements */}
      {timeOfDay === 'Pagi' && (
        <div className="absolute top-4 left-10 text-amber-400 opacity-90 -z-10 pointer-events-none flex items-center gap-2">
          <div className="relative">
            <Sun className={`w-14 h-14 text-amber-400 ${shouldAnimate ? 'animate-spin-slow' : ''}`} />
          </div>
          <div className="hidden sm:block text-[11px] font-bold text-amber-900 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-300">
            Suasana Pagi Ceria
          </div>
        </div>
      )}

      {timeOfDay === 'Siang' && (
        <div className="absolute top-2 right-20 text-yellow-400 opacity-95 -z-10 pointer-events-none flex items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-yellow-300/40 blur-md absolute -inset-1"></div>
          <div className="relative">
            <Sun className="w-16 h-16 text-yellow-400 relative" />
          </div>
        </div>
      )}

      {timeOfDay === 'Sore' && (
        <div className="absolute top-8 left-1/3 text-orange-300 opacity-90 -z-10 pointer-events-none flex items-center gap-2">
          <Sun className="w-16 h-16 text-orange-400" />
          <div className="hidden sm:block text-[10px] font-bold text-orange-950 bg-white/80 px-2.5 py-0.5 rounded-full border border-orange-300">
            Senja Syahdu Tanggul Jember
          </div>
        </div>
      )}

      {timeOfDay === 'Malam' && (
        <div className="absolute top-4 right-12 text-amber-100 opacity-95 -z-10 pointer-events-none flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Moon className="w-12 h-12 text-amber-200 fill-amber-100/30 animate-pulse" />
          </div>
          <div className="flex gap-2 items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Sparkles
                key={s}
                className={`w-3.5 h-3.5 text-amber-200 ${shouldAnimate ? 'animate-twinkle' : ''}`}
                style={{ animationDelay: `${s * 0.4}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Living Sky Animations: Soft Clouds & Particles */}
      {shouldAnimate && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-70">
          {timeOfDay === 'Malam' ? (
            <div className="absolute inset-0 flex justify-around items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping opacity-75" />
              <span className="w-2 h-2 rounded-full bg-yellow-200 animate-ping opacity-90" style={{ animationDelay: '1s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping opacity-75" style={{ animationDelay: '2s' }} />
            </div>
          ) : (
            <>
              <Cloud className="absolute top-3 left-0 w-20 h-20 text-white/80 animate-cloud-drift" style={{ animationDuration: '45s' }} />
              <Cloud className="absolute top-10 left-1/2 w-28 h-28 text-white/70 animate-cloud-drift" style={{ animationDuration: '65s', animationDelay: '10s' }} />
            </>
          )}
        </div>
      )}

      {/* Sky Header Information Bar (Islamic Atmosphere) */}
      <div className="w-full bg-white/40 backdrop-blur-xs py-1.5 px-4 text-xs font-semibold text-slate-800 border-b border-stone-200/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-800 text-white shadow-2xs flex items-center gap-1">
            Suasana {timeOfDay}
          </span>
          <span className="text-[11px] font-bold text-slate-900 bg-white/90 px-2.5 py-0.5 rounded-md border border-stone-200 shadow-2xs">
            Assalamu’alaikum Warahmatullah
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-800 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200">
            <Clock className="w-3 h-3 text-emerald-800" /> {hijri}
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-md font-bold border border-emerald-300">
            <Compass className="w-3 h-3 text-emerald-700" /> Tanggul: {activePrayer.name} {activePrayer.time} WIB
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};
