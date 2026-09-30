import React from 'react';
import { Compass, Footprints, MapPin, Sparkles, Navigation } from 'lucide-react';

interface ConnectorProps {
  fromSection: string;
  toSection: string;
  pathLabel: string;
  icon?: string;
  theme?: 'emerald' | 'amber' | 'teal' | 'sky' | 'rose' | 'purple';
}

export const StorybookPathConnector: React.FC<ConnectorProps> = ({
  fromSection,
  toSection,
  pathLabel,
  icon = '🐾',
  theme = 'emerald',
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'amber':
        return {
          bg: 'bg-gradient-to-r from-amber-100/90 via-yellow-50 to-amber-100/90',
          border: 'border-amber-300',
          badge: 'bg-amber-200 text-amber-950 border-amber-400',
          text: 'text-amber-900',
          stone: 'bg-amber-200 border-amber-400',
        };
      case 'teal':
        return {
          bg: 'bg-gradient-to-r from-teal-100/90 via-emerald-50 to-teal-100/90',
          border: 'border-teal-300',
          badge: 'bg-teal-200 text-teal-950 border-teal-400',
          text: 'text-teal-900',
          stone: 'bg-teal-200 border-teal-400',
        };
      case 'sky':
        return {
          bg: 'bg-gradient-to-r from-sky-100/90 via-blue-50 to-sky-100/90',
          border: 'border-sky-300',
          badge: 'bg-sky-200 text-sky-950 border-sky-400',
          text: 'text-sky-900',
          stone: 'bg-sky-200 border-sky-400',
        };
      case 'rose':
        return {
          bg: 'bg-gradient-to-r from-rose-100/90 via-pink-50 to-rose-100/90',
          border: 'border-rose-300',
          badge: 'bg-rose-200 text-rose-950 border-rose-400',
          text: 'text-rose-900',
          stone: 'bg-rose-200 border-rose-400',
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-r from-purple-100/90 via-indigo-50 to-purple-100/90',
          border: 'border-purple-300',
          badge: 'bg-purple-200 text-purple-950 border-purple-400',
          text: 'text-purple-900',
          stone: 'bg-purple-200 border-purple-400',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-emerald-100/90 via-teal-50 to-emerald-100/90',
          border: 'border-emerald-300',
          badge: 'bg-emerald-200 text-emerald-950 border-emerald-400',
          text: 'text-emerald-900',
          stone: 'bg-emerald-200 border-emerald-400',
        };
    }
  };

  const style = getThemeStyles();

  return (
    <div className="relative w-full max-w-7xl mx-auto my-6 px-4 sm:px-8 pointer-events-auto">
      {/* Garden Path Wavy Container */}
      <div className={`${style.bg} border-4 ${style.border} rounded-3xl p-4 sm:p-5 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4`}>
        {/* Decorative Garden Elements */}
        <div className="absolute top-1 left-4 text-xs">🌸</div>
        <div className="absolute bottom-1 right-6 text-xs">🌼</div>
        <div className="absolute top-2 right-12 text-xs animate-bounce">🦋</div>
        <div className="absolute bottom-2 left-16 text-xs">🌱</div>

        {/* Section From / To Breadcrumb */}
        <div className="flex items-center gap-2 z-10">
          <span className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-black text-xs shadow-sm border border-amber-300">
            {icon}
          </span>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-stone-600">
              <span>{fromSection}</span>
              <span>&rarr;</span>
              <span className={style.text}>{toSection}</span>
            </div>
            <p className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>Jalan Setapak Taman:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs border ${style.badge}`}>
                {pathLabel}
              </span>
            </p>
          </div>
        </div>

        {/* Footprint Stepping Stones Path Visual */}
        <div className="flex items-center gap-2 sm:gap-3 z-10 bg-white/80 px-4 py-2 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider hidden md:inline">
            Jejak Langkah Ceria 🐾
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${style.stone} border shadow-2xs flex items-center justify-center text-xs font-black transition transform hover:scale-125 cursor-pointer`}
                title={`Batu Pijakan Ke-${step}`}
              >
                {step % 2 === 0 ? '🐾' : '🌸'}
              </div>
            ))}
          </div>
          <span className="text-xs animate-pulse">↗️</span>
        </div>
      </div>
    </div>
  );
};
