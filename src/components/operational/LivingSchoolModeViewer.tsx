import React, { useState, useMemo } from 'react';
import { 
  Smile, 
  Sparkles, 
  Eye, 
  Heart, 
  Play, 
  BookOpen, 
  ShieldCheck, 
  Crown, 
  Activity,
  Layers,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { MasterCharacterRegistry } from '../../core/character/masterCharacterRegistry';
import { MasterCharacterGuard } from '../../core/character/masterCharacterGuard';

export const LivingSchoolModeViewer: React.FC = () => {
  const registry = useMemo(() => MasterCharacterRegistry.getInstance(), []);
  const guard = useMemo(() => MasterCharacterGuard.getInstance(), []);
  const characters = useMemo(() => registry.getAllCharacters(), [registry]);

  const [activeCharacter, setActiveCharacter] = useState<'ASY' | 'SYIFA'>('ASY');
  const [activePose, setActivePose] = useState<string>('reading_iqro');

  const livingBehaviors = [
    {
      id: 'peeking_corner',
      title: 'Ngintip Ceria dari Sudut',
      desc: 'Asy menyembulkan wajah ramah dari sudut layar saat santri membuka aplikasi.',
      contextTrigger: 'Buka Aplikasi / Dashboard Guru',
      icon: '👀',
      dialogue: 'Assalamu\'alaikum sahabat kecil! Siap belajar hari ini?'
    },
    {
      id: 'sitting_card',
      title: 'Duduk Santai di Kartu',
      desc: 'Duduk santai di atas kartu kegiatan sambil menggoyang-goyangkan kaki kecilnya.',
      contextTrigger: 'Membaca Laporan / Timeline Santri',
      icon: '🪑',
      dialogue: 'Wah, hasil mewarnai ananda hari ini rapi sekali ya!'
    },
    {
      id: 'reading_iqro',
      title: 'Membaca Iqro di Karpet Sentra',
      desc: 'Asy memegang jilid Iqro mini sambil mengeja huruf hijaiyah dengan tartil.',
      contextTrigger: 'Modul Tahfidz & Muroja\'ah',
      icon: '📖',
      dialogue: 'Alif, Ba, Ta... Belajar Al-Qur\'an sungguh membawa berkah!'
    },
    {
      id: 'chasing_butterfly',
      title: 'Mengejar Kupu-Kupu Taman',
      desc: 'Berlari kecil ceria di taman bunga sekolah saat jeda istirahat.',
      contextTrigger: 'Jam Istirahat & Senam Pagi',
      icon: '🦋',
      dialogue: 'Subhanallah, indahnya ciptaan Allah di halaman sekolah kita!'
    },
    {
      id: 'straighten_peci',
      title: 'Merapikan Peci Hitam Zamrud',
      desc: 'Tangan kecilnya membetulkan posisi peci sebelum menyambut adzan dhuha.',
      contextTrigger: 'Waktu Sholat & Adab Santri',
      icon: '✨',
      dialogue: 'Mari kita rapikan pakaian dan berwudhu untuk sholat dhuha.'
    },
    {
      id: 'holding_hijab',
      title: 'Memegang Hijab Santun (Syifa)',
      desc: 'Syifa merapikan jilbab pastelnya sambil tersenyum menatap wali murid.',
      contextTrigger: 'Portal Wali Murid & Menyapa Bunda',
      icon: '🌸',
      dialogue: 'Senyum itu sedekah, mari saling mendoakan kebaikan selalu.'
    }
  ];

  const currentBehavior = livingBehaviors.find(b => b.id === activePose) || livingBehaviors[0];
  const charSpec = registry.getCharacter(activeCharacter);

  return (
    <div className="space-y-6" id="living-school-mode-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5" />
                Mode Sekolah Hidup & Bank Tingkah Asy/Syifa
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R838 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Mascot Hidup Berkarakter: Ngintip, Duduk & Baca Iqro
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Asy & Syifa bereaksi secara alamiah sesuai konteks waktu belajar, tahfidz, dan senam tanpa pernah melanggar Master Character Lock resmi Founder.
            </p>
          </div>

          {/* Character Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveCharacter('ASY')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeCharacter === 'ASY'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Asy (Santri)
            </button>
            <button
              onClick={() => setActiveCharacter('SYIFA')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeCharacter === 'SYIFA'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Syifa (Putri)
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Character Stage & Living Behaviors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Live Living Mascot Stage */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col items-center justify-between min-h-[420px] text-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                {charSpec.canonicalName}
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                ZERO LAG &bull; &lt;0.1% CPU
              </span>
            </div>

            {/* Mascot Center Animated Stage */}
            <div className="my-6 relative flex flex-col items-center">
              <div className="w-36 h-36 rounded-3xl bg-slate-950 border-2 border-amber-500/40 p-3 shadow-2xl flex items-center justify-center animate-bounce">
                <img
                  src={charSpec.svgIconDataUri}
                  alt={charSpec.canonicalName}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="mt-3 text-2xl select-none">{currentBehavior.icon}</span>
            </div>

            {/* Bubble Dialogue */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 w-full space-y-1 shadow-md">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Respon Alamiah Maskot ({currentBehavior.title}):
              </div>
              <p className="text-xs text-white italic font-medium leading-relaxed">
                "{currentBehavior.dialogue}"
              </p>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Bank Tingkah Selector */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Koleksi Bank Tingkah Interaktif ({livingBehaviors.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">KONTEKSTUAL</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {livingBehaviors.map((b) => {
              const isSelected = activePose === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setActivePose(b.id)}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/20 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{b.icon}</span>
                      <div>
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                          {b.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">{b.contextTrigger}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950 shrink-0">
                        AKTIF
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
