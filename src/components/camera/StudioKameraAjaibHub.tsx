import React, { useState, useEffect } from 'react';
import { 
  magicCameraEngine, 
  CameraMotion, 
  SceneEntrance, 
  SceneExit, 
  CameraConfig, 
  StoryPhotoMemory, 
  CAMERA_MOTION_PRESETS, 
  SCENE_ENTRANCE_PRESETS, 
  SCENE_EXIT_PRESETS,
  FESTIVAL_CINEMATIC_PRESETS,
  FestivalCinematicType
} from '../../services/magicCameraEngine';
import { CartoonCharacterSvg, CharacterType } from '../mascot/CartoonCharacterSvg';
import { CameraStageWrapper } from './CameraStageWrapper';
import { StoryMemoryCardModal } from './StoryMemoryCardModal';
import { FestivalCinematicOpener } from './FestivalCinematicOpener';
import { 
  Camera, Sparkles, Film, Play, Image, Layers, Eye, 
  Award, Heart, Sliders, CheckCircle2, Shield, Activity,
  Maximize2, Minimize2, Video, Volume2, RefreshCw, Star,
  PartyPopper, Compass, Calendar
} from 'lucide-react';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';

interface StudioKameraAjaibHubProps {
  onSelectModule?: (modId: string) => void;
}

export const StudioKameraAjaibHub: React.FC<StudioKameraAjaibHubProps> = ({ onSelectModule }) => {
  const [config, setConfig] = useState<CameraConfig>(magicCameraEngine.getConfig());
  const [photos, setPhotos] = useState<StoryPhotoMemory[]>(magicCameraEngine.getPhotos());
  const [activeTab, setActiveTab] = useState<'GERAKAN' | 'MASUK' | 'KELUAR' | 'SOROT' | 'FOTO' | 'FESTIVAL' | 'PENGATURAN'>('GERAKAN');

  // Live Sandbox States
  const [testMotion, setTestMotion] = useState<CameraMotion>(config.defaultMotion);
  const [testEntrance, setTestEntrance] = useState<SceneEntrance>(config.defaultEntrance);
  const [testExit, setTestExit] = useState<SceneExit>(config.defaultExit);
  const [isTestExiting, setIsTestExiting] = useState<boolean>(false);
  const [testSpeaker, setTestSpeaker] = useState<CharacterType | null>('ASY');
  const [testSpeech, setTestSpeech] = useState<string>('Assalamu\'alaikum sahabat Asy Syifa! Selamat datang di Studio Kamera Ajaib.');
  
  const [selectedPhotoForModal, setSelectedPhotoForModal] = useState<StoryPhotoMemory | null>(null);
  const [activeFestivalTest, setActiveFestivalTest] = useState<FestivalCinematicType | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    const unsubCfg = magicCameraEngine.subscribe(setConfig);
    const unsubPhotos = magicCameraEngine.subscribePhotos(setPhotos);
    return () => {
      unsubCfg();
      unsubPhotos();
    };
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const handleCaptureInstantPhoto = () => {
    const newPhoto = magicCameraEngine.captureStoryPhoto({
      title: 'Keseruan di Studio Kamera Ajaib',
      subtitle: `Eksperimen Gaya Kamera ${testMotion}`,
      sourceModule: 'CREATIVE_STUDIO',
      characterRole: (testSpeaker || 'DUO') as any,
      moralLesson: 'Kreativitas yang santun membawa kebahagiaan dan kebaikan untuk semua.',
      duaPhrase: 'Barakallahu fiikum wa jazzakumullahu khairan',
      badgeEmoji: '🎬'
    });
    setSelectedPhotoForModal(newPhoto);
    showToast('Foto Kenangan Otomatis Berhasil Dibuat!');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-6 right-6 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 border border-amber-500 animate-bounce">
          <Camera className="w-4 h-4" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Story Memory Polaroid Modal */}
      {selectedPhotoForModal && (
        <StoryMemoryCardModal
          photo={selectedPhotoForModal}
          onClose={() => setSelectedPhotoForModal(null)}
          onOpenStorybook={() => {
            setSelectedPhotoForModal(null);
            if (onSelectModule) onSelectModule('r970');
          }}
        />
      )}

      {/* Festival Cinematic Opener Modal */}
      {activeFestivalTest && (
        <FestivalCinematicOpener
          festivalType={activeFestivalTest}
          onComplete={() => setActiveFestivalTest(null)}
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-amber-400/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Sprint G21 • Studio Kamera Ajaib Asy & Syifa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Studio Kamera Ajaib Asy Syifa
            </h1>
            <p className="text-sm text-slate-200/90 leading-relaxed">
              Pusat gaya sinematik tunggal untuk menghidupkan seluruh cerita serial kartun Asy & Syifa:
              gerakan kamera ringan (P1), transisi masuk berkarakter (P2), sapaan pamit lembut (P3),
              sorot pembicara cerdas (P4), foto otomatis kenangan (P5), serta sinematik festival (P6).
            </p>
          </div>

          {/* Telemetry & 60 FPS Badge */}
          <div className="flex flex-col gap-2 shrink-0 bg-slate-950/70 p-4 rounded-2xl border border-amber-400/20 min-w-[230px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Viewport Target:
              </span>
              <span className="font-bold text-emerald-300">60 FPS GPU</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Anti-Dizziness:
              </span>
              <span className="font-bold text-amber-300">Aktif (Max 1.08x)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Status Penanda:
              </span>
              <span className="font-bold text-cyan-300 text-[10px]">G21_STUDIO_KAMERA_VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('GERAKAN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'GERAKAN'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>1. Kamera Ceria (P1)</span>
          </button>

          <button
            onClick={() => setActiveTab('MASUK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'MASUK'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>2. Masuk Adegan (P2)</span>
          </button>

          <button
            onClick={() => setActiveTab('KELUAR')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'KELUAR'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>3. Keluar Adegan (P3)</span>
          </button>

          <button
            onClick={() => setActiveTab('SOROT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'SOROT'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>4. Sorot Karakter (P4)</span>
          </button>

          <button
            onClick={() => setActiveTab('FOTO')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'FOTO'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>5. Foto Otomatis Cerita (P5)</span>
          </button>

          <button
            onClick={() => setActiveTab('FESTIVAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'FESTIVAL'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>6. Sinematik Festival (P6)</span>
          </button>

          <button
            onClick={() => setActiveTab('PENGATURAN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'PENGATURAN'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>7. Pusat Kontrol (P7)</span>
          </button>

          {onSelectModule && (
            <button
              onClick={() => onSelectModule('r_director_hub')}
              className="px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-md border border-amber-300 ml-auto"
            >
              <Film className="w-3.5 h-3.5 text-slate-950" />
              <span>Sutradara Ajaib (G22-DIR) ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* LIVE INTERACTIVE STAGE VIEWER (Always Visible Testbed) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-extrabold text-slate-800">
                Panggung Uji Coba Sinematik (Live 60 FPS Viewport)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Gerakan: <strong className="text-emerald-700">{testMotion}</strong> • Masuk: <strong className="text-cyan-700">{testEntrance}</strong> • Keluar: <strong className="text-amber-700">{testExit}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setIsTestExiting(false);
                setTestEntrance(config.defaultEntrance);
                showToast('Mengulang transisi masuk...');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ulangi Adegan</span>
            </button>

            <button
              onClick={handleCaptureInstantPhoto}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Ambil Foto Otomatis (P5)</span>
            </button>
          </div>
        </div>

        {/* Live Camera Stage Wrapper Instance */}
        <CameraStageWrapper
          motion={testMotion}
          entrance={testEntrance}
          exit={testExit}
          isExiting={isTestExiting}
          activeSpeaker={testSpeaker}
          speechText={testSpeech}
          stageName="Studio Kamera Ajaib Live Test"
          className="h-[340px] sm:h-[400px] border-4 border-slate-800 shadow-xl bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100"
        >
          {/* Internal Animated Story World */}
          <div className="relative w-full h-full flex flex-col justify-between p-6">
            
            {/* Background elements */}
            <div className="absolute top-6 left-10 text-4xl animate-bounce">☀️</div>
            <div className="absolute top-12 right-20 text-3xl opacity-80">🕊️</div>
            <div className="absolute bottom-4 left-4 text-3xl opacity-70">🌻 🌿 🍄</div>
            <div className="absolute bottom-4 right-4 text-3xl opacity-70">🏡 🌳 🌸</div>

            {/* Top Stage Header Label */}
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[11px] font-bold text-slate-800 border border-white/60 shadow-sm">
                🎬 Serial Kartun Sahabat Asy Syifa
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-sm">
                Mode: {testMotion}
              </span>
            </div>

            {/* Central Characters on Stage */}
            <div className="flex items-end justify-center -space-x-4 z-10 py-6">
              <div 
                onClick={() => {
                  setTestSpeaker('ASY');
                  setTestSpeech('Ayo kawan, kita selalu membaca basmalah sebelum memulai kebaikan!');
                  setTestMotion('FOKUS_ASY');
                  asySyifaDnaEngine.playSignatureSound('TEPUK_TANGAN_KECIL');
                }}
                className={`cursor-pointer transition-transform p-2 rounded-2xl ${
                  testSpeaker === 'ASY' ? 'ring-4 ring-amber-400 bg-amber-400/20 scale-110' : 'hover:scale-105'
                }`}
              >
                <CartoonCharacterSvg
                  type="ASY"
                  size={120}
                  movement={testSpeaker === 'ASY' ? 'ANGGUKAN_KEPALA' : 'LANGKAH_KECIL'}
                  expression={testSpeaker === 'ASY' ? 'TERTAWA' : 'SENYUM'}
                />
              </div>

              <div 
                onClick={() => {
                  setTestSpeaker('SYIFA');
                  setTestSpeech('Benar sekali Dek Asy! Kebaikan kecil yang ikhlas bernilai pahala besar di sisi Allah.');
                  setTestMotion('FOKUS_SYIFA');
                  asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                }}
                className={`cursor-pointer transition-transform p-2 rounded-2xl ${
                  testSpeaker === 'SYIFA' ? 'ring-4 ring-amber-400 bg-amber-400/20 scale-110' : 'hover:scale-105'
                }`}
              >
                <CartoonCharacterSvg
                  type="SYIFA"
                  size={120}
                  movement={testSpeaker === 'SYIFA' ? 'LAMBAIAN_TANGAN' : 'DIAM'}
                  expression={testSpeaker === 'SYIFA' ? 'BANGGA' : 'SENYUM'}
                />
              </div>
            </div>

            {/* Stage Footer prompt */}
            <div className="flex justify-center z-10">
              <span className="px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold shadow-lg">
                💡 Klik Dek Asy atau Mbak Syifa untuk menguji Sorot Karakter & Balon Dialog Otomatis
              </span>
            </div>

          </div>
        </CameraStageWrapper>
      </div>

      {/* TAB 1: GERAKAN KAMERA CERIA (P1) */}
      {activeTab === 'GERAKAN' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Preset Gerakan Kamera Ringan (P1 — Anti Dizziness & 60 FPS)
            </h3>
            <span className="text-xs text-slate-500">Pilih untuk menguji di panggung atas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAMERA_MOTION_PRESETS.map((preset) => {
              const isActive = testMotion === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`rounded-3xl p-5 border transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{preset.icon}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {preset.subtitle}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{preset.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{preset.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setTestMotion(preset.id);
                        showToast(`Gerakan kamera diubah ke: ${preset.name}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isActive ? 'Aktif di Panggung' : 'Uji Gerakan'}</span>
                    </button>

                    <button
                      onClick={() => {
                        magicCameraEngine.setMotion(preset.id);
                        showToast(`Gaya default disimpan: ${preset.name}`);
                      }}
                      className="text-[11px] text-emerald-700 font-bold hover:underline"
                    >
                      Jadikan Default
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MASUK ADEGAN (P2) */}
      {activeTab === 'MASUK' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Transisi Masuk Adegan Singkat (P2 — 0.8s s.d. 1.3s)
            </h3>
            <span className="text-xs text-slate-500">Transisi pembuka saat cerita atau babak dimulai</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCENE_ENTRANCE_PRESETS.map((ent) => {
              const isActive = testEntrance === ent.id;
              return (
                <div
                  key={ent.id}
                  className={`rounded-3xl p-5 border transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ⏱️ {ent.durationMs}ms
                      </span>
                      <span className="text-xs text-slate-400 font-mono">P2 Resmi</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{ent.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ent.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setTestEntrance(ent.id);
                        setIsTestExiting(false);
                        asySyifaDnaEngine.playSignatureSound(ent.soundFx);
                        showToast(`Menjalankan transisi masuk: ${ent.name}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-300" />
                      <span>Uji Buka</span>
                    </button>

                    <button
                      onClick={() => {
                        magicCameraEngine.setEntrance(ent.id);
                        showToast(`Transisi masuk default disimpan: ${ent.name}`);
                      }}
                      className="text-[11px] text-emerald-700 font-bold hover:underline"
                    >
                      Jadikan Default
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: KELUAR ADEGAN (P3) */}
      {activeTab === 'KELUAR' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Efek Penutup & Pamitan Cerita (P3)
            </h3>
            <span className="text-xs text-slate-500">Muncul saat cerita selesai dengan doa & sapaan hangat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCENE_EXIT_PRESETS.map((ext) => {
              const isActive = testExit === ext.id;
              return (
                <div
                  key={ext.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Star className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{ext.name}</h4>
                    <p className="text-[11px] text-amber-700 font-semibold">{ext.subtitle}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{ext.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => {
                        setTestExit(ext.id);
                        setIsTestExiting(true);
                        asySyifaDnaEngine.playSignatureSound(ext.soundFx);
                        setTimeout(() => setIsTestExiting(false), 3000);
                        showToast(`Menguji efek keluar: ${ext.name}`);
                      }}
                      className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Uji Efek Keluar (3s)</span>
                    </button>

                    <button
                      onClick={() => {
                        magicCameraEngine.setExit(ext.id);
                        showToast(`Efek keluar default disimpan: ${ext.name}`);
                      }}
                      className="w-full text-center text-[11px] text-emerald-700 font-bold hover:underline"
                    >
                      Set Default
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SOROT KARAKTER & BALON DIALOG (P4) */}
      {activeTab === 'SOROT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-800">
                Kontrol Sorot Pembicara (P4)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saat karakter berbicara, kamera secara otomatis memfokuskan sorotan ke arah karakter
                tersebut dan memunculkan balon dialog yang rapi tanpa menutupi wajah.
              </p>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 block">Pilih Pembicara Aktif:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setTestSpeaker('ASY');
                      setTestSpeech('Ayo sahabat, kita rawat taman dan buang sampah pada tempatnya!');
                      setTestMotion('FOKUS_ASY');
                    }}
                    className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                      testSpeaker === 'ASY' ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    👦 Dek Asy
                  </button>

                  <button
                    onClick={() => {
                      setTestSpeaker('SYIFA');
                      setTestSpeech('Kebersihan adalah sebagian dari iman. Senang melihat sahabat saling membantu!');
                      setTestMotion('FOKUS_SYIFA');
                    }}
                    className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                      testSpeaker === 'SYIFA' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    🧕 Mbak Syifa
                  </button>

                  <button
                    onClick={() => {
                      setTestSpeaker(null);
                      setTestMotion('DIAM');
                    }}
                    className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                      testSpeaker === null ? 'bg-slate-200 border-slate-400 text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    ⏹️ Netral / Semua
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 block">Ubah Teks Balon Dialog:</label>
                <input
                  type="text"
                  value={testSpeech}
                  onChange={(e) => setTestSpeech(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  placeholder="Ketik kalimat dialog karakter..."
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-md border border-emerald-500/30 space-y-4">
              <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                Prinsip Desain Sorot Karakter
              </h4>
              <ul className="space-y-3 text-xs text-emerald-100 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Penempatan Bebas Wajah:</strong> Balon dialog diletakkan di sisi atas atau samping pembicara agar mimik wajah kartun tetap terlihat jelas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Vignette Lembut:</strong> Latar belakang di sekeliling pembicara meredup 10% secara optik untuk memberikan kedalaman sinematik.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Transisi Halus:</strong> Gerakan zoom ke pembicara dibatasi pada 1.07x untuk mencegah efek pusing pada anak.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FOTO OTOMATIS CERITA (P5) */}
      {activeTab === 'FOTO' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-800">
                Galeri Foto Otomatis Cerita (Buku Cerita & Kotak Kenangan)
              </h3>
              <p className="text-xs text-slate-500">
                Setiap episode yang selesai ditonton langsung dicetak menjadi kartu kenangan sinematik.
              </p>
            </div>

            <button
              onClick={handleCaptureInstantPhoto}
              className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Simulasi Foto Episode Baru</span>
            </button>
          </div>

          {/* Photo Polaroid Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoForModal(photo)}
                className="cursor-pointer group bg-white rounded-3xl p-4 border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Polaroid Miniature */}
                  <div className="relative h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 flex items-center justify-center p-2 border border-slate-100">
                    <div className="flex -space-x-2">
                      <CartoonCharacterSvg type={photo.characterRole === 'SYIFA' ? 'SYIFA' : 'ASY'} size={64} movement="DIAM" expression="SENYUM" />
                    </div>

                    <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full shadow text-slate-800">
                      {photo.badgeEmoji} {photo.sourceModule.replace('_', ' ')}
                    </span>

                    {photo.goldenStamp && (
                      <span className="absolute bottom-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded shadow">
                        STEMPEL RESMI
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-amber-800 transition">
                      {photo.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">{photo.dateStr}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic">
                      "{photo.moralLesson}"
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-amber-700 font-bold">
                  <span>Lihat Kartu Kenangan</span>
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SINEMATIK FESTIVAL (P6) */}
      {activeTab === 'FESTIVAL' && (
        <div className="space-y-6">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
            <PartyPopper className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Ketentuan Founder P6 (Sinematik Festival):</strong> Acara besar 
              seperti Festival Ceria, Wisuda Akbar, Milad Yayasan, dan Ramadhan memiliki animasi pembuka 
              khusus berdurasi singkat (~3-4 detik) menggunakan aset SVG yang sudah ada tanpa beban video berat.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(FESTIVAL_CINEMATIC_PRESETS) as FestivalCinematicType[]).map((key) => {
              const fest = FESTIVAL_CINEMATIC_PRESETS[key];
              return (
                <div
                  key={key}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-slate-300 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5 text-2xl">
                        {fest.decorations.slice(0, 3).map((d, i) => (
                          <span key={i}>{d}</span>
                        ))}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        P6 Spesial
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{fest.title}</h4>
                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">{fest.subtitle}</p>
                      <p className="text-xs text-slate-600 mt-2 italic">“{fest.greeting}”</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setActiveFestivalTest(key)}
                      className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Play className="w-4 h-4 text-slate-950" />
                      <span>Putar Sinematik Pembuka</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: PUSAT KONTROL & PENGATURAN (P7) */}
      {activeTab === 'PENGATURAN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Central Settings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Konfigurasi Global Studio Kamera (P7)</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Foto Otomatis Cerita (P5)</h4>
                  <p className="text-[11px] text-slate-500">Cetak otomatis foto kenangan setiap episode selesai</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoCapturePhoto}
                  onChange={(e) => magicCameraEngine.updateConfig({ autoCapturePhoto: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Sorot Pembicara Cerdas (P4)</h4>
                  <p className="text-[11px] text-slate-500">Fokus otomatis ke Dek Asy / Mbak Syifa saat bicara</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.spotlightEnabled}
                  onChange={(e) => magicCameraEngine.updateConfig({ spotlightEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Animasi Balon Dialog</h4>
                  <p className="text-[11px] text-slate-500">Balon percakapan muncul tanpa menutupi wajah</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.speechBubbleAnimation}
                  onChange={(e) => magicCameraEngine.updateConfig({ speechBubbleAnimation: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Kecepatan Transisi Kamera</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['LEMBUT', 'STANDAR', 'RINGKAS'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => magicCameraEngine.updateConfig({ cinematicSpeed: spd })}
                      className={`py-1.5 rounded-xl text-xs font-bold transition ${
                        config.cinematicSpeed === spd ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Integration Links & Verification */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
            <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-300" />
              <span>Integrasi Ekosistem Lengkap</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Studio Kamera Ajaib terhubung langsung secara terpusat dengan seluruh modul serial Asy Syifa:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">📺 TV Asy Syifa (G19/G21)</span>
                <span className="text-emerald-400 font-bold">Terhubung</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">🏡 Rumah Asy & Kampung Ceria</span>
                <span className="text-emerald-400 font-bold">Terhubung</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">📖 Buku Cerita Asy & Kotak Kenangan</span>
                <span className="text-emerald-400 font-bold">Terhubung</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">🎪 Festival & Panggung Ceria</span>
                <span className="text-emerald-400 font-bold">Terhubung</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">🧬 DNA Control Center (G20-DNA)</span>
                <span className="text-emerald-400 font-bold">Terhubung</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Sprint G21 Verified</span>
              <span className="text-amber-400 font-mono">G21_STUDIO_KAMERA_VERIFIED</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
