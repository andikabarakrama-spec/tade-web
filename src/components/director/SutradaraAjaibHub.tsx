import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Clapperboard, Play, Pause, RotateCcw, Volume2, 
  Film, Camera, BookOpen, Tv, CheckCircle2, ChevronRight,
  Settings, RefreshCw, Send, Plus, Trash2, Sliders, 
  Smile, ShieldCheck, HeartHandshake, Eye, Sun, Calendar,
  Share2, Award, Zap, Layers, MapPin, Compass, AlertCircle
} from 'lucide-react';
import { 
  sutradaraAjaibEngine, 
  DirectedEpisode, 
  DirectorTheme, 
  DirectorLocation, 
  THEME_METADATA, 
  LOCATION_METADATA,
  DirectorSceneFrame,
  DirectorConfig
} from '../../services/sutradaraAjaibEngine';
import { CartoonCharacterSvg, CharacterType } from '../mascot/CartoonCharacterSvg';
import { CameraStageWrapper } from '../camera/CameraStageWrapper';
import { magicCameraEngine } from '../../services/magicCameraEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';

interface SutradaraAjaibHubProps {
  onSelectModule?: (modId: string) => void;
}

export const SutradaraAjaibHub: React.FC<SutradaraAjaibHubProps> = ({ onSelectModule }) => {
  const [episodes, setEpisodes] = useState<DirectedEpisode[]>(sutradaraAjaibEngine.getEpisodes());
  const [config, setConfig] = useState<DirectorConfig>(sutradaraAjaibEngine.getConfig());
  const [activeEpisode, setActiveEpisode] = useState<DirectedEpisode | null>(episodes[0] || null);
  const [selectedTheme, setSelectedTheme] = useState<DirectorTheme>('TRANSPORTASI');
  const [selectedLocation, setSelectedLocation] = useState<DirectorLocation>('STASIUN');
  const [customTitle, setCustomTitle] = useState<string>('');

  // Active scene player state
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'STUDIO' | 'LIBRARY' | 'DAILY_DIRECTOR' | 'EXPORT_CENTER'>('STUDIO');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubEps = sutradaraAjaibEngine.subscribe((newEps) => {
      setEpisodes(newEps);
      if (!activeEpisode && newEps.length > 0) {
        setActiveEpisode(newEps[0]);
      }
    });

    const unsubCfg = sutradaraAjaibEngine.subscribeConfig((newCfg) => {
      setConfig(newCfg);
    });

    return () => {
      unsubEps();
      unsubCfg();
    };
  }, [activeEpisode]);

  // Frame player timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && activeEpisode && activeEpisode.frames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (prev >= activeEpisode.frames.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          const nextIdx = prev + 1;
          const nextFrame = activeEpisode.frames[nextIdx];
          if (nextFrame) {
            sutradaraAjaibEngine.playFrameSound(nextFrame);
          }
          return nextIdx;
        });
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeEpisode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleComposeNew = () => {
    const newEp = sutradaraAjaibEngine.composeEpisode(selectedTheme, {
      titleOverride: customTitle.trim() || undefined,
      customLocation: selectedLocation
    });
    setActiveEpisode(newEp);
    setCurrentFrameIndex(0);
    setIsPlaying(true);
    sutradaraAjaibEngine.playFrameSound(newEp.frames[0]);
    showToast(`🎬 Episode "${newEp.title}" berhasil disusun otomatis oleh Sutradara Ajaib!`);
  };

  const handlePublishTo = (target: 'TV_ASY' | 'BUKU_CERITA' | 'FESTIVAL' | 'PUSAT_ASET') => {
    if (!activeEpisode) return;
    const currentTargets = activeEpisode.exportedTargets || [];
    if (!currentTargets.includes(target)) {
      const updated: DirectedEpisode = {
        ...activeEpisode,
        exportedTargets: [...currentTargets, target]
      };
      sutradaraAjaibEngine.saveEpisode(updated);
      setActiveEpisode(updated);
    }

    blackBoxRecorder.record({
      moduleCode: 'SUTRADARA_PUBLISH',
      role: 'GURU',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G22_SUTRADARA_AJAIB_VERIFIED] Episode "${activeEpisode.title}" disinkronkan ke target: ${target}`,
      route: '/director/publish',
      severity: 'INFO'
    });

    showToast(`✅ Berhasil disinkronkan ke ${target.replace('_', ' ')}!`);
  };

  const currentFrame: DirectorSceneFrame | undefined = activeEpisode?.frames[currentFrameIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Top Header Banner */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Clapperboard className="w-3.5 h-3.5" />
                Sprint G22 • Sutradara Ajaib
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                Otomatis • 100% Offline TADE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Sutradara Ajaib Asy & Syifa</span>
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Guru cukup memilih tema edukasi islam. Sistem menyusun alur cerita, karakter, lokasi, gerak kamera (G21), dan efek suara (G20) secara instan tanpa biaya AI.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('STUDIO')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'STUDIO'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Clapperboard className="w-4 h-4" />
              <span>Studio Penyusun</span>
            </button>
            <button
              onClick={() => setActiveTab('LIBRARY')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'LIBRARY'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Koleksi Episode ({episodes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('DAILY_DIRECTOR')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'DAILY_DIRECTOR'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Sutradara Harian</span>
            </button>
            {onSelectModule && (
              <button
                onClick={() => onSelectModule('r_camera_studio')}
                className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/20 transition-all flex items-center gap-1.5"
                title="Buka Studio Kamera Ajaib G21"
              >
                <Camera className="w-4 h-4" />
                <span>Kamera (G21)</span>
              </button>
            )}
          </div>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-between border border-emerald-400/30">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)} className="text-xs text-emerald-200 hover:text-white underline">
              Tutup
            </button>
          </div>
        )}

        {/* MAIN STUDIO VIEW */}
        {activeTab === 'STUDIO' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Theme & Parameter Selector (P1, P2, P3) */}
            <div className="lg:col-span-5 space-y-6">
              {/* P1: Theme Picker */}
              <div className="bg-slate-900/90 rounded-3xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
                    <span>Pilih Tema Cerita (P1)</span>
                  </h2>
                  <span className="text-xs text-amber-400 font-bold">10 Tema Resmi</span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {(Object.keys(THEME_METADATA) as DirectorTheme[]).map((thm) => {
                    const tMeta = THEME_METADATA[thm];
                    const isSelected = selectedTheme === thm;
                    return (
                      <button
                        key={thm}
                        onClick={() => {
                          setSelectedTheme(thm);
                          setSelectedLocation(tMeta.defaultLocation);
                        }}
                        className={`p-3 rounded-2xl text-left transition-all border ${
                          isSelected
                            ? 'bg-gradient-to-br from-indigo-900/80 to-slate-900 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                            : 'bg-slate-950/60 border-white/5 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{tMeta.icon}</span>
                          <span className="font-extrabold text-xs text-white leading-tight">{thm}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{tMeta.name}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Theme Details Banner */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-white/5 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{THEME_METADATA[selectedTheme].badge}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {THEME_METADATA[selectedTheme].description}
                  </p>
                </div>
              </div>

              {/* P2 & P3: Location & Characters Selector */}
              <div className="bg-slate-900/90 rounded-3xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-400 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
                    <span>Tempat & Tokoh Otomatis (P2 & P3)</span>
                  </h2>
                  <span className="text-xs text-sky-400 font-bold">Auto-Matched</span>
                </div>

                {/* Location Picker */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>Latar Tempat:</span>
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value as DirectorLocation)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-400"
                  >
                    {(Object.keys(LOCATION_METADATA) as DirectorLocation[]).map((locKey) => (
                      <option key={locKey} value={locKey}>
                        {LOCATION_METADATA[locKey].name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Title Option */}
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">
                    Judul Episode (Opsional):
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={`Contoh: Kisah Ceria ${THEME_METADATA[selectedTheme].name}`}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Action Trigger Compose */}
                <button
                  id="btn-compose-episode"
                  onClick={handleComposeNew}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Clapperboard className="w-5 h-5 text-slate-950" />
                  <span>Susun Episode Sekarang ➔</span>
                </button>
              </div>
            </div>

            {/* Right Column: Dynamic Stage & Previewer (P4, P5, P6) */}
            <div className="lg:col-span-7 space-y-6">
              {activeEpisode ? (
                <div className="bg-slate-900/90 rounded-3xl p-6 border border-white/5 space-y-5">
                  {/* Episode Title & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase">
                          {activeEpisode.code}
                        </span>
                        <span className="text-xs text-amber-400 font-bold">
                          {activeEpisode.subtitle}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-white">
                        {activeEpisode.title}
                      </h3>
                    </div>

                    {/* Frame Step Indicator */}
                    <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
                      <span className="text-slate-400 font-bold">Adegan:</span>
                      {activeEpisode.frames.map((_, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => {
                            setCurrentFrameIndex(fIdx);
                            setIsPlaying(false);
                            const frm = activeEpisode.frames[fIdx];
                            if (frm) sutradaraAjaibEngine.playFrameSound(frm);
                          }}
                          className={`w-6 h-6 rounded-lg text-xs font-black transition-all ${
                            currentFrameIndex === fIdx
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {fIdx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Cartoon Stage (Camera G21 & Character Movement G20) */}
                  {currentFrame && (
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 flex flex-col justify-between p-6">
                      <CameraStageWrapper
                        motion={currentFrame.cameraMotion}
                        entrance={currentFrame.entranceEffect}
                        exit={currentFrame.exitEffect}
                        activeSpeakerRole={currentFrame.leadCharacter === 'ASY' ? 'ASY' : 'SYIFA'}
                        className="w-full h-full flex flex-col justify-between"
                      >
                        {/* Top Ambient Badges */}
                        <div className="flex items-center justify-between relative z-10">
                          <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-2 border border-white/10">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>{currentFrame.locationLabel}</span>
                          </div>

                          <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-amber-300 border border-white/10">
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>G20: {currentFrame.soundCueLabel}</span>
                          </div>
                        </div>

                        {/* Middle Cartoon Characters Stage */}
                        <div className="flex items-end justify-around my-auto px-8 relative z-10">
                          {/* Lead Character */}
                          <div className="flex flex-col items-center group">
                            <div className="w-36 h-48 sm:w-44 sm:h-56 filter drop-shadow-xl transition-transform hover:scale-105">
                              <CartoonCharacterSvg
                                type={currentFrame.leadCharacter}
                                movement={currentFrame.leadMovement}
                                expression={currentFrame.leadExpression}
                              />
                            </div>
                            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-950/70 text-white text-[11px] font-extrabold shadow">
                              {currentFrame.leadCharacter === 'ASY' ? 'Dek Asy' : 'Mbak Syifa'} (Utama)
                            </span>
                          </div>

                          {/* Companion Characters */}
                          {currentFrame.companionCharacters.map((comp, cIdx) => (
                            <div key={cIdx} className="flex flex-col items-center">
                              <div className="w-28 h-40 sm:w-36 sm:h-48 filter drop-shadow-lg opacity-95">
                                <CartoonCharacterSvg
                                  type={comp.type}
                                  movement={comp.movement}
                                  expression={comp.expression}
                                />
                              </div>
                              <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-950/70 text-slate-300 text-[10px] font-bold">
                                {comp.type === 'ASY' ? 'Dek Asy' : 'Mbak Syifa'}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Dialogue Balloon */}
                        <div className="relative z-10 bg-slate-950/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white space-y-1 shadow-lg">
                          <div className="flex items-center justify-between text-xs text-amber-400 font-black">
                            <span>💬 {currentFrame.dialogueSpeaker} Berkata:</span>
                            <span className="text-[10px] text-slate-400">Kamera: {currentFrame.cameraMotion}</span>
                          </div>
                          <p className="text-sm font-bold text-white italic">
                            {currentFrame.dialogueText}
                          </p>
                        </div>
                      </CameraStageWrapper>
                    </div>
                  )}

                  {/* Player Controls Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const willPlay = !isPlaying;
                          setIsPlaying(willPlay);
                          if (willPlay && currentFrame) {
                            sutradaraAjaibEngine.playFrameSound(currentFrame);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                          isPlaying
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        <span>{isPlaying ? 'Jeda Adegan' : 'Putar Cerita'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentFrameIndex(0);
                          setIsPlaying(false);
                          if (activeEpisode.frames[0]) {
                            sutradaraAjaibEngine.playFrameSound(activeEpisode.frames[0]);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                        title="Ulangi dari Awal"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (currentFrame) sutradaraAjaibEngine.playFrameSound(currentFrame);
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Bunyi Suara (G20)</span>
                      </button>
                    </div>

                    {/* Export Target Sync Buttons (P6) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePublishTo('TV_ASY')}
                        className="px-3 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Tv className="w-3.5 h-3.5 text-indigo-300" />
                        <span>TV Asy</span>
                      </button>
                      <button
                        onClick={() => handlePublishTo('BUKU_CERITA')}
                        className="px-3 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Buku Cerita</span>
                      </button>
                      <button
                        onClick={() => handlePublishTo('FESTIVAL')}
                        className="px-3 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>Festival</span>
                      </button>
                    </div>
                  </div>

                  {/* Moral & Doa Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-white/5 text-xs">
                    <div className="space-y-1">
                      <span className="text-amber-400 font-extrabold flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        Pesan Moral & Nilai Akhlak:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {activeEpisode.fullMoralValue}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Doa / Hadits Shahih Pilihan:
                      </span>
                      <p className="text-slate-300 leading-relaxed font-arabic">
                        {activeEpisode.featuredDua}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-3xl p-12 text-center border border-white/5 space-y-4">
                  <Clapperboard className="w-16 h-16 text-slate-700 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Belum Ada Episode yang Dipilih</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Pilih tema di kolom kiri, lalu klik tombol "Susun Episode Sekarang" untuk memulai sutradara ajaib.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LIBRARY VIEW */}
        {activeTab === 'LIBRARY' && (
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <span>Koleksi Episode Tersusun ({episodes.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Daftar seluruh episode yang telah disusun oleh Sutradara Ajaib dan siap diputar di kelas atau disinkronkan.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('STUDIO')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Susun Episode Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((ep) => (
                <div
                  key={ep.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    activeEpisode?.id === ep.id
                      ? 'bg-slate-800/80 border-amber-400 shadow-lg'
                      : 'bg-slate-950/60 border-white/5 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-black">
                      {ep.code}
                    </span>
                    <span className="text-xs">{ep.badgeEmoji}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-white">{ep.title}</h4>
                    <p className="text-xs text-slate-400">{ep.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      📍 {LOCATION_METADATA[ep.location]?.name || ep.location}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      🎬 {ep.frames.length} Adegan
                    </span>
                    {ep.isDailyAutoGenerated && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        🌟 Harian
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        setActiveEpisode(ep);
                        setCurrentFrameIndex(0);
                        setActiveTab('STUDIO');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Buka & Putar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus episode "${ep.title}"?`)) {
                          sutradaraAjaibEngine.deleteEpisode(ep.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
                      title="Hapus Episode"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAILY DIRECTOR (P7) */}
        {activeTab === 'DAILY_DIRECTOR' && (
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>Sutradara Harian Otomatis (P7)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Sistem secara otomatis menyusun 1 episode cerita setiap hari mengikuti kalender sekolah dan nilai tematik pekanan.
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-slate-300">Status Otomatis:</span>
                <button
                  onClick={() => {
                    sutradaraAjaibEngine.updateConfig({
                      dailyAutoDirectorEnabled: !config.dailyAutoDirectorEnabled
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-black transition ${
                    config.dailyAutoDirectorEnabled
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {config.dailyAutoDirectorEnabled ? 'AKTIF (ON)' : 'NON-AKTIF (OFF)'}
                </button>
              </div>
            </div>

            {/* Daily Schedule Rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                  <Sun className="w-4 h-4" />
                  Jadwal Otomatisasi
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Episode harian dibuat setiap pagi pukul 06.00 WIB secara deterministik di memori lokal TADE tanpa internet.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                <span className="text-sky-400 font-bold text-xs flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  Rotasi 7 Hari Ceria
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Senin (PPDB/Sekolah), Selasa (Transportasi), Rabu (Persahabatan), Kamis (Alam), Jumat (Adab & Doa), Sabtu (Hewan), Ahad (Ramadhan/Keluarga).
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Kendali Founder
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Founder dan Guru sewaktu-waktu dapat mematikan sutradara harian atau menyusun episode manual sesuai kebutuhan kurikulum.
                </p>
              </div>
            </div>

            {/* Manual Run Now Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sutradaraAjaibEngine.checkDailyAutoGeneration();
                  showToast('🌟 Sutradara harian telah dieksekusi untuk hari ini!');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Jalankan Sutradara Harian Sekarang (Paksa Buat)</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Technical & Governance Status */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-slate-300">TADE Governor:</span>
            <span>Maksimal 5 Animasi • Target 60 FPS • Mode Ringan Otomatis</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Sutradara: <b className="text-slate-300">G22-DIR</b></span>
            <span>Kamera: <b className="text-slate-300">G21-CAM</b></span>
            <span>Suara: <b className="text-slate-300">G20-DNA</b></span>
            <span className="text-amber-400 font-bold">G22_SUTRADARA_AJAIB_VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
