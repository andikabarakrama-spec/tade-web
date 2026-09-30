import React, { useState, useEffect } from 'react';
import { 
  Home, Compass, Sparkles, Heart, Star, Gift, 
  Tv, Music, ShoppingBag, BookOpen, Smile, Award, Play, PartyPopper
} from 'lucide-react';
import { 
  KampungLocation, 
  SahabatProfile, 
  kampungCeriaService 
} from '../../services/kampungCeriaService';
import { PetaKampungCeria } from './PetaKampungCeria';
import { RumahSahabatModal } from './RumahSahabatModal';
import { TamanBermainModal } from './TamanBermainModal';
import { PasarCeriaModal } from './PasarCeriaModal';
import { MasjidKampungModal } from './MasjidKampungModal';
import { ParadeSoreLayer } from './ParadeSoreLayer';
import { BukuStikerKampung } from './BukuStikerKampung';
import { FestivalCeriaHub } from './FestivalCeriaHub';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

export const KampungCeriaHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FESTIVAL' | 'PETA' | 'SAHABAT' | 'TAMAN' | 'PASAR' | 'MASJID' | 'PARADE' | 'STIKER'>('FESTIVAL');
  
  // Modals state
  const [selectedSahabat, setSelectedSahabat] = useState<SahabatProfile | null>(null);
  const [showTamanModal, setShowTamanModal] = useState<boolean>(false);
  const [showPasarModal, setShowPasarModal] = useState<boolean>(false);
  const [showMasjidModal, setShowMasjidModal] = useState<boolean>(false);

  const sahabatList = kampungCeriaService.getSahabatList();

  const handleLocationSelect = (loc: KampungLocation) => {
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
    if (loc.id === 'loc_taman_bermain' || loc.id === 'loc_kolam_bebek') {
      setShowTamanModal(true);
    } else if (loc.id === 'loc_pasar_ceria') {
      setShowPasarModal(true);
    } else if (loc.id === 'loc_masjid') {
      setShowMasjidModal(true);
    } else if (loc.id.startsWith('loc_rumah_')) {
      const charId = loc.id.replace('loc_rumah_', '');
      if (charId === 'asy' || charId === 'syifa') {
        const profile: SahabatProfile = {
          id: `sahabat_${charId}`,
          name: charId === 'asy' ? 'Asy' : 'Syifa',
          species: charId === 'asy' ? 'Santri Cilik' : 'Santriwati Cilik',
          houseType: charId === 'asy' ? 'Rumah Utama Asri' : 'Rumah Melati Pastel',
          houseEmoji: charId === 'asy' ? '🏡' : '🌸',
          characterEmoji: charId === 'asy' ? '👦' : '👧',
          themeColor: charId === 'asy' ? 'from-emerald-400 to-teal-600' : 'from-pink-400 to-rose-500',
          greeting: charId === 'asy' 
            ? '“Ahlan wa sahlan! Asy sangat senang teman-teman berkunjung ke Kampung Ceria.”' 
            : '“Assalamu’alaikum! Mari bersama menjaga keindahan dan kebersihan kampung kita.”',
          blessingWord: 'Santun, rajin beribadah, dan ramah kepada semua sahabat.',
          hobbies: ['Membaca Al-Qur’an', 'Bermain di taman', 'Menolong teman']
        };
        setSelectedSahabat(profile);
      } else {
        const found = kampungCeriaService.visitHouse(`sahabat_${charId}`);
        if (found) setSelectedSahabat(found);
      }
    }
  };

  const handleStartParade = () => {
    kampungCeriaService.startParadeSore();
    setActiveTab('PARADE');
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn" id="kampung-ceria-hub-root">
      {/* Top Banner Navigation */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-amber-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              TADE Sprint G17 — Kampung Ceria Asy & Syifa
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
              Kampung Ceria Asy & Syifa
              <span className="text-3xl">🏘️</span>
            </h2>
            <p className="text-amber-50 text-sm sm:text-base mt-1 max-w-xl">
              Dunia kartun 3D yang hangat di mana setiap sahabat memiliki rumah, taman bermain aktif, pasar ceria penuh hikmah, dan masjid penuh doa berkah.
            </p>
          </div>

          {/* Quick Parade Sore Action */}
          <button
            onClick={handleStartParade}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-white text-orange-600 font-black text-sm shadow-xl hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-orange-600" />
            Mulai Parade Sore 15 Detik!
          </button>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-2 border-t border-white/20 scrollbar-none">
          {[
            { id: 'FESTIVAL', label: 'Festival Ceria (G18)', icon: '🎪' },
            { id: 'PETA', label: 'Peta Kampung (P1)', icon: '🗺️' },
            { id: 'SAHABAT', label: 'Rumah Sahabat (P2)', icon: '🏡' },
            { id: 'TAMAN', label: 'Taman Bermain (P3)', icon: '🎠' },
            { id: 'PASAR', label: 'Pasar Ceria (P4)', icon: '🏪' },
            { id: 'MASJID', label: 'Masjid Kampung (P5)', icon: '🕌' },
            { id: 'PARADE', label: 'Parade Sore (P6)', icon: '🎉' },
            { id: 'STIKER', label: 'Buku Stiker (P7)', icon: '🌟' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                tadeSoundEngine.playFx('TV_CLICK');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-orange-600 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="transition-all">
        {activeTab === 'FESTIVAL' && (
          <FestivalCeriaHub />
        )}

        {activeTab === 'PETA' && (
          <PetaKampungCeria onSelectLocation={handleLocationSelect} />
        )}

        {activeTab === 'SAHABAT' && (
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
                  Rumah Sahabat Kampung Ceria
                  <span>🏡</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Ketuk kartu sahabat untuk berkunjung ke rumah mereka dan mendengarkan sapaan hangatnya!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sahabatList.map(s => (
                <div
                  key={s.id}
                  onClick={() => {
                    const visited = kampungCeriaService.visitHouse(s.id);
                    if (visited) setSelectedSahabat(visited);
                  }}
                  className="p-5 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.themeColor} flex items-center justify-center text-3xl shadow ring-2 ring-white`}>
                        {s.characterEmoji}
                      </div>
                      <span className="text-2xl">{s.houseEmoji}</span>
                    </div>

                    <h4 className="font-black text-slate-800 text-lg group-hover:text-amber-600 transition-colors">
                      {s.name}
                    </h4>
                    <p className="text-xs font-bold text-amber-800">{s.houseType}</p>
                    <p className="text-xs text-slate-500 mt-2 italic line-clamp-2">{s.greeting}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {s.species}
                    </span>
                    <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                      Kunjungi →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'TAMAN' && (
          <div className="space-y-4">
            <TamanBermainModal onClose={() => setActiveTab('PETA')} />
          </div>
        )}

        {activeTab === 'PASAR' && (
          <div className="space-y-4">
            <PasarCeriaModal onClose={() => setActiveTab('PETA')} />
          </div>
        )}

        {activeTab === 'MASJID' && (
          <div className="space-y-4">
            <MasjidKampungModal onClose={() => setActiveTab('PETA')} />
          </div>
        )}

        {activeTab === 'PARADE' && (
          <div className="space-y-6">
            <ParadeSoreLayer onClose={() => setActiveTab('PETA')} />
            <PetaKampungCeria onSelectLocation={handleLocationSelect} />
          </div>
        )}

        {activeTab === 'STIKER' && (
          <BukuStikerKampung />
        )}
      </div>

      {/* Global Modals for interactive map clicks */}
      {selectedSahabat && (
        <RumahSahabatModal 
          sahabat={selectedSahabat} 
          onClose={() => setSelectedSahabat(null)} 
        />
      )}

      {showTamanModal && (
        <TamanBermainModal onClose={() => setShowTamanModal(false)} />
      )}

      {showPasarModal && (
        <PasarCeriaModal onClose={() => setShowPasarModal(false)} />
      )}

      {showMasjidModal && (
        <MasjidKampungModal onClose={() => setShowMasjidModal(false)} />
      )}
    </div>
  );
};
