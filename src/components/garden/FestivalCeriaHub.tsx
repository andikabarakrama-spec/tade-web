import React, { useState, useEffect } from 'react';
import { 
  PartyPopper, Sparkles, Flag, Mic, Play, 
  ShoppingBag, Camera, Gift, Heart, Star, Layers, Calendar
} from 'lucide-react';
import { festivalCeriaService } from '../../services/festivalCeriaService';
import { SchoolEventType } from '../../services/livingEventEngine';
import { GerbangFestivalLayer } from './GerbangFestivalLayer';
import { PanggungCeriaModal } from './PanggungCeriaModal';
import { KarnavalKampungLayer } from './KarnavalKampungLayer';
import { BalonHarapanModal } from './BalonHarapanModal';
import { StanCeriaModal } from './StanCeriaModal';
import { FotoBersamaFestival } from './FotoBersamaFestival';
import { PenutupFestivalModal } from './PenutupFestivalModal';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

export const FestivalCeriaHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GERBANG' | 'PANGGUNG' | 'KARNAVAL' | 'BALON' | 'STAN' | 'FOTO'>('GERBANG');
  const [currentTheme, setCurrentTheme] = useState(festivalCeriaService.getCurrentTheme());
  const [isFestivalOpen, setIsFestivalOpen] = useState<boolean>(festivalCeriaService.isFestivalOpen());
  
  // Modals state
  const [showPanggungModal, setShowPanggungModal] = useState<boolean>(false);
  const [showBalonModal, setShowBalonModal] = useState<boolean>(false);
  const [showStanModal, setShowStanModal] = useState<boolean>(false);
  const [showClosingModal, setShowClosingModal] = useState<boolean>(false);

  useEffect(() => {
    const unsub = festivalCeriaService.subscribe(() => {
      setCurrentTheme(festivalCeriaService.getCurrentTheme());
      setIsFestivalOpen(festivalCeriaService.isFestivalOpen());
    });
    return () => unsub();
  }, []);

  const handleSimulateEvent = (eventType: SchoolEventType) => {
    festivalCeriaService.toggleFestivalStatus(true, eventType);
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
  };

  const handleTriggerClosing = () => {
    setShowClosingModal(true);
    festivalCeriaService.triggerClosingCeremony();
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn" id="festival-ceria-hub-root">
      {/* Top Banner & School Event Controller */}
      <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-amber-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black uppercase tracking-wider mb-3">
              <PartyPopper className="w-3.5 h-3.5" />
              TADE Sprint G18 — Festival Ceria Asy & Syifa
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
              Festival Ceria Asy & Syifa
              <span className="text-3xl">🎪</span>
            </h2>
            <p className="text-amber-100 text-sm sm:text-base mt-1 max-w-xl">
              Saat ada perayaan sekolah, seluruh Kampung Ceria bersolek dan bergembira bersama santri, guru, dan para sahabat cilik!
            </p>
          </div>

          {/* Quick Festival Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                festivalCeriaService.startCarnival();
                setActiveTab('KARNAVAL');
              }}
              className="px-5 py-3 rounded-2xl bg-white text-orange-600 font-black text-xs sm:text-sm shadow-xl hover:bg-amber-50 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-orange-600" />
              Karnaval 20s
            </button>
            <button
              onClick={handleTriggerClosing}
              className="px-5 py-3 rounded-2xl bg-rose-700/80 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              Upacara Penutup
            </button>
          </div>
        </div>

        {/* School Event Simulator Selector (Living Events Integration) */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Tema Acara Sekolah Aktif (Living Event):
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
              {currentTheme.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'MILAD_TK', label: 'Milad TK Asy Syifa', icon: '🎂' },
              { id: 'WISUDA', label: 'Wisuda Santri', icon: '🎓' },
              { id: 'PPDB', label: 'Gelombang PPDB Emas', icon: '🌟' },
              { id: 'RAMADHAN', label: 'Bulan Ramadhan', icon: '🌙' },
              { id: 'KEMERDEKAAN', label: '17 Agustus Merdeka', icon: '🇮🇩' },
              { id: 'HARI_SANTRI', label: 'Hari Santri Nasional', icon: '🕌' },
              { id: 'HARI_GURU', label: 'Hari Guru & Asatidz', icon: '💐' }
            ].map(ev => {
              const isCurrent = currentTheme.eventId === ev.id;
              return (
                <button
                  key={ev.id}
                  onClick={() => handleSimulateEvent(ev.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-orange-600 shadow-md scale-105'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  <span>{ev.icon}</span>
                  {ev.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-2 border-t border-white/20 scrollbar-none">
          {[
            { id: 'GERBANG', label: 'Gerbang Festival (P1)', icon: '🚪' },
            { id: 'PANGGUNG', label: 'Panggung Ceria (P2)', icon: '🎭' },
            { id: 'KARNAVAL', label: 'Karnaval 20s (P3)', icon: '🎺' },
            { id: 'BALON', label: 'Balon Harapan (P4)', icon: '🎈' },
            { id: 'STAN', label: 'Stan Ceria (P5)', icon: '🏪' },
            { id: 'FOTO', label: 'Foto Bersama (P6)', icon: '📸' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                tadeSoundEngine.playFx('TV_CLICK');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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
        {activeTab === 'GERBANG' && (
          <GerbangFestivalLayer onEnterFestival={() => setActiveTab('PANGGUNG')} />
        )}

        {activeTab === 'PANGGUNG' && (
          <div className="space-y-4">
            <PanggungCeriaModal onClose={() => setActiveTab('GERBANG')} />
          </div>
        )}

        {activeTab === 'KARNAVAL' && (
          <div className="space-y-4">
            <KarnavalKampungLayer onClose={() => setActiveTab('GERBANG')} />
          </div>
        )}

        {activeTab === 'BALON' && (
          <div className="space-y-4">
            <BalonHarapanModal onClose={() => setActiveTab('GERBANG')} />
          </div>
        )}

        {activeTab === 'STAN' && (
          <div className="space-y-4">
            <StanCeriaModal onClose={() => setActiveTab('GERBANG')} />
          </div>
        )}

        {activeTab === 'FOTO' && (
          <div className="space-y-4">
            <FotoBersamaFestival />
          </div>
        )}
      </div>

      {/* Closing Ceremony Modal */}
      {showClosingModal && (
        <PenutupFestivalModal onClose={() => setShowClosingModal(false)} />
      )}
    </div>
  );
};
