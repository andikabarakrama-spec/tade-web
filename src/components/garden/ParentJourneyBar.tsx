import React from 'react';
import { Sparkles, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ParentJourneyBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const steps = [
    { id: 'w1', label: '1. Beranda', desc: 'Pengenalan' },
    { id: 'w2', label: '2. Profil & Program', desc: 'Visi & Kurikulum' },
    { id: 'w2-tour', label: '3. Virtual Tour', desc: 'Fasilitas Kelas' },
    { id: 'w2-prestasi', label: '4. Prestasi', desc: 'Galeri Juara' },
    { id: 'w3', label: '5. Berita & Galeri', desc: 'Kegiatan SBY' },
    { id: 'w4', label: '6. PPDB Online', desc: 'Pendaftaran' },
    { id: 'w5', label: '7. Kontak & WA', desc: 'Hubungi Kami' },
    { id: 'w_alumni', label: '8. Taman Alumni', desc: 'Alumni Universe' },
  ];

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white py-3 px-4 shadow-inner border-b border-emerald-700/60 hidden lg:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-extrabold text-xs shadow-xs">
            🗺️
          </span>
          <div>
            <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider block">
              Alur Informasi Orang Tua
            </span>
            <span className="text-xs font-black text-amber-300">Parent Journey Guide</span>
          </div>
        </div>

        {/* Steps Stepper */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {steps.map((step, idx) => {
            const isActive = activeTab === step.id || (step.id === 'w2-tour' && activeTab === 'w2');
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => {
                    if (step.id === 'w2-tour' || step.id === 'w2-prestasi') {
                      onTabChange('w2');
                    } else {
                      onTabChange(step.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-md scale-105 font-black ring-2 ring-amber-300'
                      : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700/80 border border-emerald-600/50'
                  }`}
                >
                  {isActive ? <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" /> : null}
                  <span>{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500/70 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
