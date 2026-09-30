import React, { useState } from 'react';
import { 
  Compass, MapPin, Sparkles, Home, Star, Filter, 
  Smile, Search, Eye, Navigation, Info
} from 'lucide-react';
import { 
  KampungLocation, 
  SahabatProfile, 
  kampungCeriaService 
} from '../../services/kampungCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onSelectLocation: (location: KampungLocation) => void;
}

export const PetaKampungCeria: React.FC<Props> = ({ onSelectLocation }) => {
  const locations = kampungCeriaService.getKampungLocations();
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'RUMAH' | 'FASILITAS' | 'TAMAN' | 'PASAR'>('ALL');
  const [hoveredLocation, setHoveredLocation] = useState<KampungLocation | null>(null);

  const filteredLocations = locations.filter(loc => {
    if (filterCategory === 'ALL') return true;
    return loc.category === filterCategory;
  });

  const handleLocationClick = (loc: KampungLocation) => {
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
    onSelectLocation(loc);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100" id="peta-kampung-ceria">
      {/* Map Header Toolbar */}
      <div className="relative z-10 p-4 sm:p-5 bg-white/80 backdrop-blur-md border-b border-amber-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md">
            🗺️
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg sm:text-xl flex items-center gap-2">
              Peta 3D Kampung Ceria Asy & Syifa
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase">
                Sprint G17
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Ketuk rumah sahabat atau fasilitas kampung untuk berkunjung!</p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Semua (13)', icon: '🌟' },
            { id: 'RUMAH', label: 'Rumah Sahabat', icon: '🏡' },
            { id: 'TAMAN', label: 'Taman & Telaga', icon: '🎠' },
            { id: 'PASAR', label: 'Pasar Ceria', icon: '🏪' },
            { id: 'FASILITAS', label: 'Masjid & Stasiun', icon: '🕌' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterCategory(tab.id as any);
                tadeSoundEngine.playFx('TV_CLICK');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterCategory === tab.id
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'bg-white/90 text-slate-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Cartoon Map Canvas */}
      <div className="relative w-full h-[480px] sm:h-[580px] overflow-hidden select-none p-4">
        {/* Background Visual Map Artwork Layers */}
        {/* Winding Green Hills & Village Roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" preserveAspectRatio="none">
          <path
            d="M 50,220 Q 200,180 350,280 T 650,240 T 950,380"
            fill="none"
            stroke="#e2b866"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M 50,220 Q 200,180 350,280 T 650,240 T 950,380"
            fill="none"
            stroke="#fef3c7"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="8 8"
          />
          {/* North-South River connecting to Duck pond */}
          <path
            d="M 120,500 Q 180,380 220,290 T 260,100"
            fill="none"
            stroke="#67e8f9"
            strokeWidth="24"
            strokeLinecap="round"
          />
        </svg>

        {/* Decorative Cartoon Trees & Bushes */}
        <div className="absolute top-12 left-10 text-3xl opacity-70 animate-pulse pointer-events-none">🌳</div>
        <div className="absolute top-28 right-16 text-3xl opacity-70 pointer-events-none">🌲</div>
        <div className="absolute bottom-20 right-32 text-3xl opacity-70 pointer-events-none">🌳</div>
        <div className="absolute top-44 left-1/3 text-2xl opacity-60 pointer-events-none">🌻</div>
        <div className="absolute bottom-32 left-1/4 text-2xl opacity-60 pointer-events-none">🌷</div>

        {/* Dynamic Location Pins */}
        {filteredLocations.map(loc => {
          const isHovered = hoveredLocation?.id === loc.id;
          return (
            <div
              key={loc.id}
              onClick={() => handleLocationClick(loc)}
              onMouseEnter={() => setHoveredLocation(loc)}
              onMouseLeave={() => setHoveredLocation(null)}
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute z-20 cursor-pointer group transition-all duration-300"
            >
              {/* Pin Base & Avatar Bubble */}
              <div className={`relative flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${
                isHovered
                  ? 'scale-125 z-30 bg-white shadow-2xl ring-4 ring-amber-400 -translate-y-2'
                  : 'bg-white/95 shadow-lg hover:shadow-xl hover:scale-110 border-2 border-amber-300'
              }`}>
                {/* 3D-styled Emoji Token */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl sm:text-3xl bg-amber-50">
                  {loc.icon}
                </div>

                {/* Location Name Label */}
                <span className="mt-1 text-[10px] sm:text-xs font-black text-slate-800 whitespace-nowrap px-1.5 py-0.5 rounded-md bg-amber-100/90 border border-amber-200">
                  {loc.name}
                </span>

                {/* Pulsing indicator dot */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </div>
            </div>
          );
        })}

        {/* Hovered Location Quick Tooltip Card */}
        {hoveredLocation && (
          <div className="absolute bottom-4 left-4 right-4 z-30 sm:max-w-md mx-auto p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-amber-400 shadow-2xl animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-3xl shrink-0">
                {hoveredLocation.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-800 text-sm">{hoveredLocation.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {hoveredLocation.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{hoveredLocation.description}</p>
                {hoveredLocation.residentName && (
                  <p className="text-[11px] font-bold text-amber-800 mt-1">Penghuni: {hoveredLocation.residentName}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Tip */}
      <div className="p-3 bg-amber-50/90 border-t border-amber-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          13 Lokasi Menarik di Kampung Ceria Asy & Syifa
        </span>
        <span className="text-amber-800 font-bold">
          Pawai Sore & Kunjungan Aktif
        </span>
      </div>
    </div>
  );
};
