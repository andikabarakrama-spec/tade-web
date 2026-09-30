import React, { useState, useEffect } from 'react';
import { 
  asySyifaDnaEngine, 
  MOVEMENT_PRESETS, 
  EXPRESSION_PRESETS, 
  SIGNATURE_SOUND_PRESETS, 
  CHARACTER_DNA_REGISTRY,
  MovementStyle,
  OfficialExpression,
  DnaSignatureSound,
  CharacterDnaProfile,
  DnaConfig
} from '../../services/asySyifaDnaEngine';
import { CartoonCharacterSvg, CharacterType } from '../mascot/CartoonCharacterSvg';
import { RainbowGateModal } from './RainbowGateModal';
import { FarewellToastModal } from './FarewellToastModal';
import { 
  Sparkles, Play, Volume2, Footprints, Smile, Heart, Eye, RotateCw, 
  Hand, HelpCircle, Award, HeartHandshake, CheckCircle2, Shield, Activity,
  Layers, Settings, Sliders, Music, Zap, Flame, Info, Film
} from 'lucide-react';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface PusatDnaAsySyifaHubProps {
  onSelectModule?: (modId: string) => void;
}

export const PusatDnaAsySyifaHub: React.FC<PusatDnaAsySyifaHubProps> = ({ onSelectModule }) => {
  const [config, setConfig] = useState<DnaConfig>(asySyifaDnaEngine.getConfig());
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('ASY');
  const [currentMovement, setCurrentMovement] = useState<MovementStyle>('LANGKAH_KECIL');
  const [currentExpression, setCurrentExpression] = useState<OfficialExpression>('SENYUM');
  const [activeTab, setActiveTab] = useState<'KARAKTER' | 'GERAK' | 'EKSPRESI' | 'SUARA' | 'TRANSISI'>('KARAKTER');

  const [showRainbowTest, setShowRainbowTest] = useState(false);
  const [showFarewellTest, setShowFarewellTest] = useState(false);
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  // Micro-emotions state
  const [microEmotions, setMicroEmotions] = useState(asySyifaDnaEngine.getMicroEmotions());

  useEffect(() => {
    const unsub = asySyifaDnaEngine.subscribe((newCfg) => {
      setConfig(newCfg);
    });
    return unsub;
  }, []);

  const handlePlaySound = (sound: DnaSignatureSound, label: string) => {
    asySyifaDnaEngine.playSignatureSound(sound);
    setSoundFeedback(`Memutar: ${label}`);
    setTimeout(() => setSoundFeedback(null), 2500);
  };

  const handleSetMovement = (m: MovementStyle) => {
    setCurrentMovement(m);
    asySyifaDnaEngine.setGlobalMovement(m);
  };

  const handleSetExpression = (e: OfficialExpression) => {
    setCurrentExpression(e);
    asySyifaDnaEngine.setGlobalExpression(e);
  };

  const currentCharData: CharacterDnaProfile = CHARACTER_DNA_REGISTRY[selectedCharacter];

  return (
    <div className="space-y-6">
      {/* Test Transitions */}
      {showRainbowTest && (
        <RainbowGateModal
          onComplete={() => setShowRainbowTest(false)}
          title="Uji Coba Gerbang Pelangi 3s"
          subtitle="Transisi resmi Asy Syifa: Ceria, Ramah & Penuh Keberkahan"
        />
      )}

      {showFarewellTest && (
        <FarewellToastModal
          onComplete={() => setShowFarewellTest(false)}
          message="Sampai jumpa, sahabat Asy Syifa! Barakallahu fiikum."
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sprint G20 • Pusat DNA Animasi & Suara Asy Syifa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Pusat DNA Resmi Asy Syifa
            </h1>
            <p className="text-sm text-emerald-100/85 leading-relaxed">
              Pusat kendali tunggal untuk menyatukan gaya gerak santun, ekspresi kartun berkarakter Islami, 
              suara Web Audio khas, mikro-emosi cerita, serta gerbang sambutan dan pamitan yang konsisten di seluruh aplikasi.
            </p>
          </div>

          {/* Dr. Pulse Governor & 60 FPS Guarantee */}
          <div className="flex flex-col gap-2 shrink-0 bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/20 min-w-[220px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Target Frame Rate:
              </span>
              <span className="font-bold text-emerald-300">60 FPS</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Batas Animasi Aktif:
              </span>
              <span className="font-bold text-amber-300">Maks. 5 Elemen</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Mode Ringan:
              </span>
              <span className="font-bold text-cyan-300">Otomatis Aktif</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-emerald-800/40">
          <button
            onClick={() => setActiveTab('KARAKTER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'KARAKTER'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-100 hover:bg-emerald-800/60'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>1. Karakter & Emosi (8 Maskot)</span>
          </button>

          <button
            onClick={() => setActiveTab('GERAK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'GERAK'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-100 hover:bg-emerald-800/60'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>2. Gerak Resmi (P1 - 6 Gaya)</span>
          </button>

          <button
            onClick={() => setActiveTab('EKSPRESI')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'EKSPRESI'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-100 hover:bg-emerald-800/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>3. Ekspresi Resmi (P2 - 6 Tipe)</span>
          </button>

          <button
            onClick={() => setActiveTab('SUARA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'SUARA'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-100 hover:bg-emerald-800/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>4. Suara Khas (P3 - Web Audio)</span>
          </button>

          <button
            onClick={() => setActiveTab('TRANSISI')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'TRANSISI'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-100 hover:bg-emerald-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>5. Transisi Masuk & Keluar (P5 & P6)</span>
          </button>

          {onSelectModule && (
            <button
              onClick={() => onSelectModule('r_camera_studio')}
              className="px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-md border border-amber-300 ml-auto"
            >
              <Film className="w-3.5 h-3.5 text-slate-950" />
              <span>Studio Kamera Ajaib (G21-CAM) ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* Audio playback notification toast */}
      {soundFeedback && (
        <div className="fixed top-6 right-6 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 border border-amber-500 animate-bounce">
          <Volume2 className="w-4 h-4" />
          <span>{soundFeedback}</span>
        </div>
      )}

      {/* TAB 1: KARAKTER & EMOSI */}
      {activeTab === 'KARAKTER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Character Selector Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daftar Maskot & Sahabat Asy Syifa</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
              {(Object.keys(CHARACTER_DNA_REGISTRY) as CharacterType[]).map((key) => {
                const char = CHARACTER_DNA_REGISTRY[key];
                const isSelected = selectedCharacter === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCharacter(key);
                      setCurrentMovement(char.defaultMovement);
                      setCurrentExpression(char.defaultExpression);
                      asySyifaDnaEngine.playSignatureSound(char.signatureSound);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden p-1">
                      <CartoonCharacterSvg
                        type={key}
                        size={40}
                        movement="DIAM"
                        expression={isSelected ? currentExpression : 'SENYUM'}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{char.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{char.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Character Showcase Stage */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              {/* Background Islamic Pattern Accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-full pointer-events-none opacity-60" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                {/* Character SVG Stage */}
                <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-emerald-50/50 rounded-3xl border border-slate-200/80 shadow-inner w-56 h-56 shrink-0">
                  <CartoonCharacterSvg
                    type={selectedCharacter}
                    size={150}
                    movement={currentMovement}
                    expression={currentExpression}
                    enableMicroEmotions={config.microEmotionsEnabled}
                  />
                  <div className="absolute bottom-2 px-3 py-0.5 rounded-full bg-white/90 shadow text-[10px] font-bold text-emerald-800 border border-emerald-100">
                    {currentCharData.name} ({currentMovement})
                  </div>
                </div>

                {/* Character Details & Controls */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
                      <span>{currentCharData.role}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-serif">
                      {currentCharData.name}
                    </h2>
                    <p className="text-xs text-amber-700 font-semibold">{currentCharData.title}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {currentCharData.personality}
                    </p>
                  </div>

                  {/* Micro-Emotions (P4) Toggles */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Emosi Cerita & Reaksi Halus (P4):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg font-medium">
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Pipi Memerah Hangat
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-lg font-medium">
                        <Eye className="w-3 h-3 text-sky-500" /> Mata Berkedip (~4.5s)
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
                        <Activity className="w-3 h-3 text-emerald-500" /> Bahu Nafas Ritmik
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg font-medium">
                        <Smile className="w-3 h-3 text-amber-500" /> Senyum Melebar
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => handlePlaySound(currentCharData.signatureSound, currentCharData.name)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Putar Suara Khas</span>
                    </button>
                    <button
                      onClick={() => handleSetMovement('LONCAT_GEMBIRA')}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Uji Loncat Gembira</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Live Preview Matrix of all 8 Characters */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Harmoni 8 Karakter Resmi (Gerakan Serempak: {currentMovement})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Semua karakter tunduk pada gaya gerak yang sama, teratur & tidak patah.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  G20_DNA_ANIMASI_VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center">
                {(Object.keys(CHARACTER_DNA_REGISTRY) as CharacterType[]).map((type) => (
                  <div 
                    key={type}
                    onClick={() => setSelectedCharacter(type)}
                    className="cursor-pointer group p-2 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-100 transition"
                  >
                    <div className="h-16 flex items-center justify-center">
                      <CartoonCharacterSvg
                        type={type}
                        size={56}
                        movement={currentMovement}
                        expression={currentExpression}
                      />
                    </div>
                    <span className="block mt-1 text-[11px] font-bold text-slate-700 group-hover:text-emerald-800 truncate">
                      {CHARACTER_DNA_REGISTRY[type].name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GERAK RESMI (P1) */}
      {activeTab === 'GERAK' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong className="font-bold">Ketentuan Founder P1 (Gaya Gerak Resmi):</strong> Semua karakter 
              memakai gerakan yang sama secara seragam: langkah kecil, lambaian tangan, loncat gembira, 
              tepuk tangan, anggukan kepala, putaran kecil. Gerakan lembut, tidak patah.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOVEMENT_PRESETS.map((m) => {
              const isActive = currentMovement === m.id;
              return (
                <div
                  key={m.id}
                  className={`rounded-3xl p-5 border transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-inner flex items-center justify-center p-1">
                        <CartoonCharacterSvg
                          type={selectedCharacter}
                          size={52}
                          movement={m.id}
                          expression="SENYUM"
                        />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {m.tempoLabel}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{m.name}</h4>
                      <p className="text-[11px] font-medium text-emerald-700 mt-0.5">{m.subtitle}</p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <code className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                      .{m.cssClass}
                    </code>
                    <button
                      onClick={() => handleSetMovement(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        isActive
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isActive ? 'Aktif' : 'Terapkan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: EKSPRESI RESMI (P2) */}
      {activeTab === 'EKSPRESI' && (
        <div className="space-y-6">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Ketentuan Founder P2 (Ekspresi Resmi):</strong> Setiap karakter punya minimal 
              senyum, tertawa, kaget, berpikir, bangga, mengucapkan terima kasih. Semua memakai gaya kartun khas Asy Syifa.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXPRESSION_PRESETS.map((e) => {
              const isActive = currentExpression === e.id;
              return (
                <div
                  key={e.id}
                  className={`rounded-3xl p-5 border transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-inner flex items-center justify-center p-1">
                        <CartoonCharacterSvg
                          type={selectedCharacter}
                          size={52}
                          movement="DIAM"
                          expression={e.id}
                        />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        P2 Resmi
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{e.name}</h4>
                      <p className="text-[11px] font-medium text-amber-700 mt-0.5">{e.subtitle}</p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{e.description}</p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                      <p className="text-slate-700 italic font-serif">{e.speechExample}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">{e.islamicPhrase}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{e.id}</span>
                    <button
                      onClick={() => handleSetExpression(e.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        isActive
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isActive ? 'Aktif' : 'Pilih'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SUARA KHAS WEB AUDIO (P3) */}
      {activeTab === 'SUARA' && (
        <div className="space-y-6">
          <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
            <div className="text-xs text-cyan-900 leading-relaxed">
              <strong className="font-bold">Ketentuan Founder P3 (Suara Khas Web Audio):</strong> Suara ringan: 
              "Tut tut" kereta, "Pling" bintang, "Pop" balon, "Flip" buku, tepuk tangan kecil. 
              100% bebas lisensi, murni disintesis melalui Web Audio API bawaan browser.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SIGNATURE_SOUND_PRESETS.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                      <Music className="w-6 h-6" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Web Audio
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{s.name}</h4>
                    <p className="text-[11px] font-medium text-cyan-700 mt-0.5">{s.subtitle}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.description}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-mono">
                    {s.frequencySummary}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handlePlaySound(s.id, s.name)}
                    className="w-full py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Volume2 className="w-4 h-4 text-amber-300" />
                    <span>Uji Dengarkan Suara</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TRANSISI MASUK & KELUAR (P5 & P6) */}
      {activeTab === 'TRANSISI' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* P5: Gerbang Pelangi */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>P5 — Masuk Halaman (Gerbang Pelangi)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.rainbowGateEnabled}
                  onChange={(e) => {
                    const val = e.target.checked;
                    asySyifaDnaEngine.setRainbowGateEnabled(val);
                    setConfig({ ...config, rainbowGateEnabled: val });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <h3 className="text-base font-black text-slate-800">
              Gerbang Pelangi 3 Detik
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saat membuka Dunia Asy, Gerbang Pelangi muncul sekitar 3 detik lalu otomatis hilang 
              dengan sapaan hangat Dek Asy & Mbak Syifa. Dapat dimatikan oleh Founder.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Status Saat Ini:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                config.rainbowGateEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {config.rainbowGateEnabled ? 'Aktif (3s Auto-dismiss)' : 'Dinonaktifkan oleh Founder'}
              </span>
            </div>

            <button
              onClick={() => setShowRainbowTest(true)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>Simulasi Gerbang Pelangi Masuk</span>
            </button>
          </div>

          {/* P6: Sapaan Keluar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Heart className="w-3.5 h-3.5" />
                <span>P6 — Keluar Halaman (Sapaan Pamit)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.farewellEnabled}
                  onChange={(e) => {
                    const val = e.target.checked;
                    asySyifaDnaEngine.setFarewellEnabled(val);
                    setConfig({ ...config, farewellEnabled: val });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <h3 className="text-base font-black text-slate-800">
              Sapaan Pamit Asy & Syifa ("Sampai Jumpa")
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saat keluar atau berganti halaman, Asy berkata "Sampai jumpa" dan Syifa melambaikan tangan 
              dalam durasi singkat (~2 detik).
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Status Saat Ini:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                config.farewellEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {config.farewellEnabled ? 'Aktif (2s Auto-toast)' : 'Dinonaktifkan oleh Founder'}
              </span>
            </div>

            <button
              onClick={() => setShowFarewellTest(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Play className="w-4 h-4 text-amber-300" />
              <span>Simulasi Sapaan Pamit Keluar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
