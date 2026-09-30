import React, { useState } from 'react';
import { 
  Home, Tv, Gift, Sparkles, Compass, Heart, Star, 
  Layers, Volume2, ShieldCheck, ArrowRight, Smile, MapPin, Sun, Feather, Map, PartyPopper
} from 'lucide-react';
import { tvAsySyifaService, DailyEpisode } from '../../services/tvAsySyifaService';
import { TVAsySyifaPlayer } from './TVAsySyifaPlayer';
import { KeretaCeritaStation } from './KeretaCeritaStation';
import { LivingObjectsLayer } from './LivingObjectsLayer';
import { SecretSurprisePopup } from './SecretSurprisePopup';
import { KotakMainanAsyShelf } from '../assets/KotakMainanAsyShelf';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { DuniaAsyLivingEnvironment } from './DuniaAsyLivingEnvironment';
import { KampungCeriaHub } from './KampungCeriaHub';
import { FestivalCeriaHub } from './FestivalCeriaHub';
import { EpisodeInteraktifHub } from './EpisodeInteraktifHub';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

export const RumahAsySyifaHub: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [activeRoom, setActiveRoom] = useState<'EPISODE_INTERAKTIF' | 'FESTIVAL_CERIA' | 'KAMPUNG_CERIA' | 'HALAMAN_HIDUP' | 'RUANG_TAMU' | 'GUDANG_MAINAN' | 'HALAMAN_DEPAN'>('EPISODE_INTERAKTIF');

  const handleRoomChange = (room: 'EPISODE_INTERAKTIF' | 'FESTIVAL_CERIA' | 'KAMPUNG_CERIA' | 'HALAMAN_HIDUP' | 'RUANG_TAMU' | 'GUDANG_MAINAN' | 'HALAMAN_DEPAN') => {
    setActiveRoom(room);
    tadeSoundEngine.playFx('TV_CLICK');
    if (room !== 'HALAMAN_HIDUP' && room !== 'KAMPUNG_CERIA' && room !== 'FESTIVAL_CERIA' && room !== 'EPISODE_INTERAKTIF') {
      tvAsySyifaService.setCurrentRoom(room as any);
    }
  };

  return (
    <section id="rumah-asy-syifa-hub" className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Secret Occasional Surprise Detector */}
      <SecretSurprisePopup />

      {/* Main Storybook House Shell */}
      <div className="bg-gradient-to-b from-teal-900 via-emerald-950 to-green-950 text-white rounded-[36px] p-5 sm:p-9 border-4 border-amber-400/90 shadow-2xl relative overflow-hidden">
        
        {/* House Roof Motif Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800/80 pb-5 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl shadow-xl border-2 border-white">
              <span>🏡</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Sprint G17 • Kampung Ceria Asy & Syifa
                </span>
                <span className="text-xs text-emerald-300 font-bold hidden sm:inline">
                  Peta 3D, Rumah Sahabat, Taman, Pasar, Masjid, Parade Sore & Stiker
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-0.5">
                Rumah & Kampung Ceria Asy & Syifa
              </h2>
            </div>
          </div>

          {/* Room Navigation Tabs (Episode Interaktif, Festival Ceria, Kampung Ceria, Halaman Hidup, Ruang Tamu, Gudang Mainan, Halaman Depan) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-emerald-950/80 p-1.5 rounded-2xl border border-emerald-700/80 backdrop-blur-md">
            <button
              onClick={() => handleRoomChange('EPISODE_INTERAKTIF')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRoom === 'EPISODE_INTERAKTIF'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <span>✨</span>
              <span>Episode Interaktif (G19)</span>
            </button>

            <button
              onClick={() => handleRoomChange('FESTIVAL_CERIA')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRoom === 'FESTIVAL_CERIA'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <span>🎪</span>
              <span>Festival Ceria</span>
            </button>

            <button
              onClick={() => handleRoomChange('KAMPUNG_CERIA')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRoom === 'KAMPUNG_CERIA'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <span>🏘️</span>
              <span>Kampung Ceria</span>
            </button>

            <button
              onClick={() => handleRoomChange('HALAMAN_HIDUP')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRoom === 'HALAMAN_HIDUP'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Dunia Hidup</span>
            </button>

            <button
              onClick={() => handleRoomChange('RUANG_TAMU')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRoom === 'RUANG_TAMU'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Ruang Tamu & TV</span>
            </button>

            <button
              onClick={() => handleRoomChange('GUDANG_MAINAN')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRoom === 'GUDANG_MAINAN'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Gudang Mainan</span>
            </button>

            <button
              onClick={() => handleRoomChange('HALAMAN_DEPAN')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRoom === 'HALAMAN_DEPAN'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <span>🚂</span>
              <span>Stasiun Kereta</span>
            </button>
          </div>
        </div>

        {/* Living Objects Bar for Current Room (if in standard rooms) */}
        {activeRoom !== 'HALAMAN_HIDUP' && activeRoom !== 'KAMPUNG_CERIA' && activeRoom !== 'FESTIVAL_CERIA' && activeRoom !== 'EPISODE_INTERAKTIF' && (
          <div className="relative z-10 mt-4">
            <LivingObjectsLayer room={activeRoom as any} />
          </div>
        )}

        {/* Room View Portals */}
        <div className="relative z-10 mt-4">
          {activeRoom === 'EPISODE_INTERAKTIF' && (
            <div className="space-y-6 animate-fadeIn">
              <EpisodeInteraktifHub />
            </div>
          )}

          {activeRoom === 'FESTIVAL_CERIA' && (
            <div className="space-y-6 animate-fadeIn">
              <FestivalCeriaHub />
            </div>
          )}

          {activeRoom === 'KAMPUNG_CERIA' && (
            <div className="space-y-6 animate-fadeIn">
              <KampungCeriaHub />
            </div>
          )}

          {activeRoom === 'HALAMAN_HIDUP' && (
            <div className="space-y-6 animate-fadeIn">
              <DuniaAsyLivingEnvironment />
            </div>
          )}

          {activeRoom === 'RUANG_TAMU' && (
            <div className="space-y-6 animate-fadeIn">
              {/* The Central Cartoon TV Player */}
              <TVAsySyifaPlayer
                onExploreKereta={() => handleRoomChange('HALAMAN_DEPAN')}
              />

              {/* Welcoming Host Card */}
              <div className="bg-emerald-900/40 rounded-3xl p-4 sm:p-6 border border-emerald-700/60 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="flex gap-2 shrink-0">
                  <CartoonCharacterSvg type="ASY" size={64} expression="HAPPY" />
                  <CartoonCharacterSvg type="SYIFA" size={64} expression="HAPPY" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-300">
                    "Selamat datang di Ruang Tamu Rumah Asy & Syifa!"
                  </h4>
                  <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                    Setiap hari ada episode kartun baru berdurasi 10–30 detik yang sarat dengan doa, akhlak mulia, dan kehangatan persahabatan di TK Asy Syifa Tanggul.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeRoom === 'GUDANG_MAINAN' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-emerald-900/40 rounded-3xl p-4 sm:p-5 border border-emerald-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black">
                    🎁
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Gudang Kotak Mainan Asy (48 Mainan)</h3>
                    <p className="text-xs text-emerald-200">Mainan beranimasi 60 FPS dari 7 rak tematik</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950">
                  Pusat Aset G13
                </span>
              </div>

              {/* Kotak Mainan Asy Shelf Component */}
              <div className="bg-slate-900/60 p-4 rounded-3xl border border-emerald-800">
                <KotakMainanAsyShelf />
              </div>
            </div>
          )}

          {activeRoom === 'HALAMAN_DEPAN' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Kereta Cerita Station Component */}
              <KeretaCeritaStation />
            </div>
          )}
        </div>

        {/* Footer Summary Note */}
        <div className="mt-8 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between text-xs text-emerald-300 gap-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            TADE Sprint G19: Episode Interaktif Asy & Syifa, Cerita Pagi, Pilihan 2 Arah, Sahabat Ceria & Buku Cerita Asy
          </span>
          <span className="text-amber-300 font-bold">
            60 FPS • Max 5 Animasi Aktif (Dr. Pulse Verified)
          </span>
        </div>
      </div>
    </section>
  );
};
