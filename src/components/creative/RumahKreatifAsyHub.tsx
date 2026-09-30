import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, Sparkles, BookOpen, Layers, Award, 
  RotateCcw, Save, CheckCircle2, ChevronRight,
  Heart, Star, Smile, Sun, Check, ArrowRight, 
  Download, Eye, Share2, Compass, ShieldCheck,
  FolderHeart, Trees, Clapperboard, Filter, RefreshCw,
  ToggleLeft, ToggleRight, Sparkle, Film
} from 'lucide-react';
import { 
  rumahKreatifEngine, ColoringTemplate, ColoringCharacterId, 
  ArtworkRecord, CrayonItem, StickerDefinition, PlacedSticker, 
  StickerType, ClassCabinetId, PassportStamp, PublicationStatus,
  INSPIRATION_LEAF_MESSAGES, OFFICIAL_COLORING_TEMPLATES
} from '../../services/rumahKreatifEngine';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';
import { useAuth } from '../../context/AuthContext';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { livingEventEngine } from '../../services/livingEventEngine';

type ActiveTab = 'MEJA_MEWARNAI' | 'GALERI_BERJALAN' | 'POHON_INSPIRASI' | 'LEMARI_KELAS' | 'PASPOR_PETUALANG' | 'GURU_FOUNDER';

interface Props {
  onSelectModule?: (moduleId: string) => void;
}

export const RumahKreatifAsyHub: React.FC<Props> = ({ onSelectModule }) => {
  const { activeRole, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('MEJA_MEWARNAI');
  const [selectedTemplateId, setSelectedTemplateId] = useState<ColoringCharacterId>('ASY');
  
  // Coloring state
  const [zoneColors, setZoneColors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  const [activeCrayon, setActiveCrayon] = useState<CrayonItem | null>(null);
  const [activeStickerType, setActiveStickerType] = useState<StickerType | null>(null);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [childName, setChildName] = useState<string>('Ananda Sholih/Sholihah');
  const [selectedClass, setSelectedClass] = useState<ClassCabinetId>('A1');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Gallery & Tree state
  const [artworks, setArtworks] = useState<ArtworkRecord[]>([]);
  const [galleryFilterClass, setGalleryFilterClass] = useState<string>('ALL');
  const [selectedArtworkForModal, setSelectedArtworkForModal] = useState<ArtworkRecord | null>(null);
  const [selectedLeafMessage, setSelectedLeafMessage] = useState<{ title: string; text: string } | null>(null);
  const [passportStamps, setPassportStamps] = useState<PassportStamp[]>([]);
  const [dailyPrompt, setDailyPrompt] = useState(rumahKreatifEngine.getTodayInspiration());
  const [isDailyEnabled, setIsDailyEnabled] = useState(rumahKreatifEngine.isDailyEnabled());
  const [livingTheme, setLivingTheme] = useState(livingEventEngine.getActiveEvent());

  // Living desk animations
  const [deskStarPops, setDeskStarPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const [confettiActive, setConfettiActive] = useState(false);

  const smartCrayons = rumahKreatifEngine.getSmartCrayons();
  const stickers = rumahKreatifEngine.getStickers();
  const currentTemplate = rumahKreatifEngine.getTemplateById(selectedTemplateId);

  // Initialize initial colors from template
  useEffect(() => {
    const initial: Record<string, string> = {};
    currentTemplate.zones.forEach(z => {
      initial[z.id] = z.defaultColor;
    });
    setZoneColors(initial);
    setHistory([initial]);
    setPlacedStickers([]);
    if (!activeCrayon && smartCrayons.length > 0) {
      setActiveCrayon(smartCrayons[0]);
    }
  }, [selectedTemplateId]);

  // Load artworks and stamps
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setArtworks(rumahKreatifEngine.getArtworks());
    setPassportStamps(rumahKreatifEngine.getPassportStamps());
    setIsDailyEnabled(rumahKreatifEngine.isDailyEnabled());
    setLivingTheme(livingEventEngine.getActiveEvent());
  };

  // Ambient desk star generator (Safe lightweight interval)
  useEffect(() => {
    const starInterval = setInterval(() => {
      if (activeTab === 'MEJA_MEWARNAI') {
        const newStar = {
          id: Date.now(),
          x: Math.floor(Math.random() * 80) + 10,
          y: Math.floor(Math.random() * 80) + 10
        };
        setDeskStarPops(prev => [...prev.slice(-3), newStar]);
      }
    }, 4500);
    return () => clearInterval(starInterval);
  }, [activeTab]);

  // Handlers for Coloring
  const handleZoneClick = (zoneId: string) => {
    if (!activeCrayon) return;
    
    // Play DNA Sound
    asySyifaDnaEngine.playSignatureSound('POP_BALON');

    const nextState = { ...zoneColors, [zoneId]: activeCrayon.colorHex };
    setZoneColors(nextState);
    setHistory(prev => [...prev.slice(-15), nextState]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
      const newHistory = [...history];
      newHistory.pop();
      const previousState = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setZoneColors(previousState);
    }
  };

  const handleCanvasClickForSticker = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!activeStickerType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 400);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 400);

    const newStk: PlacedSticker = {
      id: `stk-${Date.now()}`,
      type: activeStickerType,
      x: Math.min(Math.max(x, 40), 360),
      y: Math.min(Math.max(y, 40), 360),
      scale: 1,
      rotation: Math.floor(Math.random() * 20) - 10
    };

    asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
    setPlacedStickers(prev => [...prev, newStk]);
    setActiveStickerType(null); // Return to crayon mode after placing
  };

  const handleRemoveSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    asySyifaDnaEngine.playSignatureSound('POP_BALON');
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveArtwork = () => {
    asySyifaDnaEngine.playSignatureSound('TEPUK_TANGAN_KECIL');
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);

    const record = rumahKreatifEngine.saveArtwork({
      templateId: selectedTemplateId,
      childName: childName.trim() || 'Santri Cilik',
      classId: selectedClass,
      zoneColors,
      stickers: placedStickers
    });

    refreshData();
    setSaveSuccessMsg(`🎨 Karya ${record.title} tersimpan & masuk ke Galeri Keluarga, Buku Cerita, dan Pohon Inspirasi!`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  const handleApplyDailyInspiration = () => {
    setSelectedTemplateId(dailyPrompt.recommendedTemplate);
    asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
    setActiveTab('MEJA_MEWARNAI');
  };

  const handleExportToSutradara = (artwork: ArtworkRecord) => {
    rumahKreatifEngine.exportArtworkToSutradara(artwork);
    setSaveSuccessMsg(`🎬 Kisah ${artwork.title} berhasil di-render ke TV Asy & Sutradara Ajaib!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const isTeacherOrAdmin = ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'].includes(activeRole || '');

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-800 pb-16 font-sans">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  G24 • SATU DUNIA BANYAK PINTU
                </span>
                <span className="bg-amber-300 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-full">
                  Tk Asy Syifa Tanggul
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
                🎨 Rumah Kreatif Asy & Syifa
              </h1>
              <p className="text-emerald-50 text-sm max-w-2xl mt-0.5">
                Ruang ekspresi seni dan kreativitas ceria santri. Mewarnai tanpa beban, menumbuhkan percaya diri, dan memuji karya bersama Asy & Syifa.
              </p>
            </div>

            {/* Quick living event indicator */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-xl shadow-xs">
                ✨
              </div>
              <div>
                <p className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider">
                  Tema Living Event: {livingTheme.badge}
                </p>
                <p className="text-xs font-bold text-white">
                  {livingTheme.title}
                </p>
              </div>
            </div>
          </div>

          {/* NAVIGATION TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pt-5 pb-1 scrollbar-none">
            {[
              { id: 'MEJA_MEWARNAI', label: 'Meja Mewarnai Ceria', icon: Palette, badge: 'P1-P5' },
              { id: 'GALERI_BERJALAN', label: 'Galeri Berjalan Lorong', icon: Sparkles, badge: 'P8' },
              { id: 'POHON_INSPIRASI', label: 'Pohon Inspirasi Berdaun', icon: Trees, badge: `${artworks.length} Daun` },
              { id: 'LEMARI_KELAS', label: 'Lemari Karya Kelas', icon: FolderHeart, badge: 'A1-B2' },
              { id: 'PASPOR_PETUALANG', label: 'Paspor Petualang Asy', icon: Compass, badge: '7 Cap' },
              { id: 'GURU_FOUNDER', label: 'Ruang Guru & Inspirasi', icon: ShieldCheck, badge: 'P6-P7' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                    setActiveTab(tab.id as ActiveTab);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 shadow-xs ${
                    isActive 
                      ? 'bg-white text-emerald-900 font-bold shadow-md transform -translate-y-0.5' 
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-white'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-white/20 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TOAST SUCCESS ALERT */}
      {saveSuccessMsg && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-dna-breathing border border-emerald-400">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
              <p className="text-sm font-medium">{saveSuccessMsg}</p>
            </div>
            <button 
              onClick={() => setSaveSuccessMsg(null)}
              className="text-emerald-100 hover:text-white text-xs font-bold bg-white/20 px-3 py-1 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ============================================================
            TAB 1: MEJA MEWARNAI CERIA (P1, P2, P3, P4, P5, P12)
        ============================================================ */}
        {activeTab === 'MEJA_MEWARNAI' && (
          <div className="space-y-6">
            
            {/* DAILY INSPIRATION BANNER (P7) */}
            {isDailyEnabled && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-xs shrink-0">
                    💡
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                        Inspirasi Ceria Hari Ini
                      </span>
                      <span className="text-xs text-amber-700">Adab & Doa</span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      {dailyPrompt.title}
                    </h3>
                    <p className="text-xs text-stone-600">
                      {dailyPrompt.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleApplyDailyInspiration}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 whitespace-nowrap transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Warnai Tema Ini</span>
                </button>
              </div>
            )}

            {/* TEMPLATE PICKER (11 KARAKTER RESMI TADE) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Pilih Sketsa Karakter Resmi Asy Syifa</span>
                </h3>
                <span className="text-xs text-stone-500">11 Karakter Resmi TADE</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5">
                {OFFICIAL_COLORING_TEMPLATES.map(tmpl => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                        setSelectedTemplateId(tmpl.id);
                      }}
                      className={`p-2.5 rounded-2xl flex flex-col items-center text-center transition-all duration-200 border text-xs ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-md scale-105 ring-2 ring-emerald-400' 
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-2xs mb-1 border border-stone-100">
                        {tmpl.id === 'ASY' ? '👦' :
                         tmpl.id === 'SYIFA' ? '🧕' :
                         tmpl.id === 'BUBU' ? '🐱' :
                         tmpl.id === 'GOGO' ? '🐦' :
                         tmpl.id === 'MIMI' ? '🐰' :
                         tmpl.id === 'DODO' ? '🦆' :
                         tmpl.id === 'TITI' ? '🐿️' :
                         tmpl.id === 'RARA' ? '🦋' :
                         tmpl.id === 'KERETA' ? '🚂' :
                         tmpl.id === 'BUS' ? '🚌' : '🕌'}
                      </div>
                      <span className="truncate w-full font-medium">{tmpl.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WORKSPACE: MEJA KREASI BERNAPAS (P4) + CANVAS (P1) + KOTAK KRAYON HIDUP (P2/P12) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: MEJA KREASI & CANVAS */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* LIVING DESK FRAME (P4: Meja Bernapas, Pensil Berguling, Penghapus Berkedip, Lem Tersenyum) */}
                <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 rounded-3xl p-5 sm:p-7 shadow-md border-4 border-amber-200 relative overflow-hidden">
                  
                  {/* AMBIENT LIVING PROPS (P4) */}
                  <div className="absolute top-3 left-4 flex items-center gap-3 text-xs bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-200/60 shadow-2xs pointer-events-none">
                    <span className="animate-spin text-amber-500">✏️</span>
                    <span className="text-[11px] font-semibold text-stone-600">Meja Kreasi Hidup • Pensil Santri</span>
                  </div>

                  <div className="absolute top-3 right-4 flex items-center gap-2 text-xs bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-200/60 shadow-2xs pointer-events-none">
                    <span className="animate-pulse">🧴</span>
                    <span className="text-[11px] font-semibold text-emerald-700">Lem & Penghapus Ramah</span>
                  </div>

                  {/* FLOATING STARS POPPING (P4) */}
                  {deskStarPops.map(s => (
                    <div 
                      key={s.id} 
                      style={{ top: `${s.y}%`, left: `${s.x}%` }}
                      className="absolute pointer-events-none text-amber-400 text-sm animate-ping duration-1000"
                    >
                      ✨
                    </div>
                  ))}

                  {/* CONTROLS HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <span>{currentTemplate.title}</span>
                      </h2>
                      <p className="text-xs text-stone-600">{currentTemplate.storySnippet}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleUndo}
                        disabled={history.length <= 1}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          history.length > 1 
                            ? 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300' 
                            : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        }`}
                        title="Urungkan pewarnaan terakhir"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Undo ({history.length - 1})</span>
                      </button>

                      <button
                        onClick={handleSaveArtwork}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
                      >
                        <Save className="w-3.5 h-3.5 text-amber-200" />
                        <span>Simpan Karya</span>
                      </button>
                    </div>
                  </div>

                  {/* INTERACTIVE VECTOR CANVAS (P1) */}
                  <div className="bg-white rounded-2xl p-4 shadow-inner border-2 border-amber-200 flex items-center justify-center relative min-h-[380px] sm:min-h-[420px]">
                    <svg
                      viewBox={currentTemplate.viewBox}
                      onClick={handleCanvasClickForSticker}
                      className="w-full max-w-[420px] max-h-[420px] cursor-pointer drop-shadow-sm select-none transition-transform"
                    >
                      {/* 1. Interactive Fill Zones */}
                      {currentTemplate.zones.map(zone => {
                        const currentColor = zoneColors[zone.id] || zone.defaultColor;
                        return (
                          <path
                            key={zone.id}
                            d={zone.d}
                            fill={currentColor}
                            stroke="#334155"
                            strokeWidth="3.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleZoneClick(zone.id);
                            }}
                            className="transition-colors duration-200 hover:opacity-90 hover:stroke-emerald-600 hover:stroke-[4px]"
                          >
                            <title>{zone.name} (Klik untuk mewarnai)</title>
                          </path>
                        );
                      })}

                      {/* 2. Detail Outline Paths */}
                      {currentTemplate.outlinePaths.map((d, i) => (
                        <path
                          key={i}
                          d={d}
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}

                      {/* 3. Placed Stickers (P3) */}
                      {placedStickers.map(stk => {
                        const stkDef = stickers.find(s => s.type === stk.type);
                        return (
                          <g 
                            key={stk.id} 
                            transform={`translate(${stk.x}, ${stk.y}) rotate(${stk.rotation}) scale(${stk.scale})`}
                            onClick={(e) => handleRemoveSticker(stk.id, e)}
                            className="cursor-pointer group"
                          >
                            <circle r="22" fill="white" opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
                            <text 
                              textAnchor="middle" 
                              dy="8" 
                              fontSize="24"
                              className="select-none"
                            >
                              {stkDef?.iconSvg || '⭐'}
                            </text>
                            <circle r="6" cx="14" cy="-14" fill="#ef4444" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            <text x="14" y="-11" textAnchor="middle" fontSize="9" fill="white" className="opacity-0 group-hover:opacity-100 font-bold select-none">×</text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Active Sticker Placement Hint */}
                    {activeStickerType && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white flex items-center gap-2 animate-bounce pointer-events-none">
                        <span>Klik di mana saja pada gambar untuk menempelkan stiker!</span>
                      </div>
                    )}
                  </div>

                  {/* CHILD NAME & CLASS INPUTS (Auto metadata) */}
                  <div className="mt-4 bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Smile className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-stone-700 whitespace-nowrap">Nama Santri:</span>
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="bg-white border border-stone-300 rounded-xl px-3 py-1 text-xs font-semibold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-full sm:w-48"
                        placeholder="Nama Ananda..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-700 whitespace-nowrap">Lemari Kelas:</span>
                      <div className="flex gap-1">
                        {(['A1', 'A2', 'B1', 'B2'] as ClassCabinetId[]).map(cls => (
                          <button
                            key={cls}
                            onClick={() => {
                              asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                              setSelectedClass(cls);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              selectedClass === cls 
                                ? 'bg-emerald-600 text-white shadow-2xs' 
                                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                            }`}
                          >
                            Kelas {cls}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: KOTAK KRAYON HIDUP (P2/P12) & STIKER AJAIB (P3) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 1. KOTAK KRAYON HIDUP (P2, P12) */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-500" />
                      <span>Kotak Krayon Hidup Asy</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Pintar & Ceria
                    </span>
                  </div>

                  {/* ACTIVE CRAYON SPEECH */}
                  {activeCrayon && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-xs shrink-0 flex items-center justify-center font-bold text-white text-xs"
                        style={{ backgroundColor: activeCrayon.colorHex }}
                      >
                        ✓
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-stone-900">{activeCrayon.name}</p>
                          {activeCrayon.eventBadge && (
                            <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 rounded-sm">
                              {activeCrayon.eventBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-900 italic truncate">
                          "{activeCrayon.saying}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CRAYONS GRID */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {smartCrayons.map(crayon => {
                      const isSelected = activeCrayon?.id === crayon.id;
                      
                      // Character micro-motion CSS class (P2)
                      let motionAnim = '';
                      if (crayon.characterMood === 'melompat') motionAnim = 'animate-bounce';
                      else if (crayon.characterMood === 'berkedip') motionAnim = 'animate-pulse';
                      else if (crayon.characterMood === 'mengangguk') motionAnim = 'animate-dna-breathing';

                      return (
                        <button
                          key={crayon.id}
                          onClick={() => {
                            asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                            setActiveCrayon(crayon);
                            setActiveStickerType(null);
                          }}
                          className={`p-2 rounded-2xl flex flex-col items-center justify-center border transition-all duration-200 relative ${
                            isSelected 
                              ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400 transform -translate-y-1' 
                              : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                          }`}
                        >
                          {/* Event special star icon */}
                          {crayon.isEventSpecial && (
                            <span className="absolute -top-1 -right-1 text-[10px]">⭐</span>
                          )}

                          {/* Crayon Stick Graphic */}
                          <div 
                            className={`w-5 h-12 rounded-t-md rounded-b-xs shadow-xs relative border border-black/10 ${isSelected ? motionAnim : ''}`}
                            style={{ backgroundColor: crayon.colorHex }}
                          >
                            {/* Crayon eyes */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
                              <div className="w-1 h-1 bg-black rounded-full" />
                              <div className="w-1 h-1 bg-black rounded-full" />
                            </div>
                            {/* Crayon smile */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-1 border-b-2 border-black rounded-b-full" />
                          </div>

                          <span className="text-[10px] font-semibold text-stone-700 mt-1.5 truncate max-w-full text-center">
                            {crayon.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. STIKER AJAIB TADE (P3) */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Stiker Ajaib TADE</span>
                    </h3>
                    <span className="text-[11px] text-stone-500">8 Stiker Resmi</span>
                  </div>

                  <p className="text-xs text-stone-600 mb-3">
                    Pilih stiker lalu sentuh area gambar untuk menghias karya seni ananda:
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {stickers.map(stk => {
                      const isSelected = activeStickerType === stk.type;
                      return (
                        <button
                          key={stk.type}
                          onClick={() => {
                            asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                            setActiveStickerType(stk.type);
                          }}
                          className={`p-2 rounded-2xl flex flex-col items-center border transition-all ${
                            isSelected 
                              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 font-bold scale-105 shadow-sm' 
                              : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                          }`}
                        >
                          <span className="text-2xl mb-0.5">{stk.iconSvg}</span>
                          <span className="text-[10px] text-stone-700 font-medium truncate w-full text-center">
                            {stk.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ASY & SYIFA LIVE COMPANION REMINDER */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-4 flex items-center gap-3">
                  <CartoonCharacterSvg type="ASY" size={56} expression="SENYUM" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-950">Dek Asy Memuji:</p>
                    <p className="text-emerald-800 italic mt-0.5">
                      "Masya Allah! Setiap warna yang kita pilih membuat gambar semakin hidup dan berkah!"
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================
            TAB 2: GALERI BERJALAN LORONG SEKOLAH (P6, P8)
        ============================================================ */}
        {activeTab === 'GALERI_BERJALAN' && (
          <div className="space-y-6">
            
            {/* LORONG SEKOLAH VIRTUAL BANNER */}
            <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="max-w-3xl">
                <span className="bg-amber-400 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Lorong Karya Asy Syifa
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                  🖼️ Galeri Berjalan: Apresiasi Tanpa Juara & Tanpa Skor
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  Semua karya santri memiliki tempat mulia di lorong sekolah. Setiap lukisan adalah cerminan fitrah dan imajinasi indah ananda.
                </p>
              </div>

              {/* FILTER KELAS */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-emerald-200">Filter Lemari:</span>
                {['ALL', 'A1', 'A2', 'B1', 'B2'].map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                      setGalleryFilterClass(f);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      galleryFilterClass === f 
                        ? 'bg-amber-400 text-stone-950 shadow-md' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    {f === 'ALL' ? '🌟 Semua Lemari' : `Kelas ${f}`}
                  </button>
                ))}
              </div>
            </div>

            {/* ARTWORK GALLERY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks
                .filter(a => galleryFilterClass === 'ALL' || a.classId === galleryFilterClass)
                .map(art => {
                  const tmpl = rumahKreatifEngine.getTemplateById(art.templateId);
                  return (
                    <div 
                      key={art.id}
                      className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 hover:shadow-md transition-shadow flex flex-col justify-between group"
                    >
                      <div>
                        {/* WOODEN PICTURE FRAME GRAPHIC (P8) */}
                        <div className="bg-stone-100 rounded-2xl p-3 border-4 border-amber-200 shadow-inner flex items-center justify-center relative overflow-hidden aspect-square">
                          <svg viewBox={tmpl.viewBox} className="w-full h-full max-h-[220px]">
                            {tmpl.zones.map(zone => (
                              <path
                                key={zone.id}
                                d={zone.d}
                                fill={art.zoneColors[zone.id] || zone.defaultColor}
                                stroke="#334155"
                                strokeWidth="3"
                              />
                            ))}
                            {tmpl.outlinePaths.map((d, i) => (
                              <path key={i} d={d} fill="none" stroke="#1e293b" strokeWidth="2.5" />
                            ))}
                            {art.stickers.map(stk => {
                              const stkDef = stickers.find(s => s.type === stk.type);
                              return (
                                <g key={stk.id} transform={`translate(${stk.x}, ${stk.y}) rotate(${stk.rotation}) scale(${stk.scale})`}>
                                  <circle r="18" fill="white" opacity="0.9" />
                                  <text textAnchor="middle" dy="6" fontSize="20">{stkDef?.iconSvg || '⭐'}</text>
                                </g>
                              );
                            })}
                          </svg>

                          <span className="absolute top-2 left-2 bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            {art.code}
                          </span>

                          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            Kelas {art.classId}
                          </span>
                        </div>

                        {/* METADATA */}
                        <div className="mt-4">
                          <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                            {art.title}
                          </h3>
                          <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                            Oleh Ananda: {art.childName} • {art.createdAt}
                          </p>

                          {/* PRAISES FROM ASY & SYIFA (P8) */}
                          <div className="mt-3 space-y-1.5 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50 text-xs">
                            <p className="text-stone-800">
                              <span className="font-bold text-amber-800">👦 Dek Asy:</span> "{art.praiseAsy}"
                            </p>
                            <p className="text-stone-800">
                              <span className="font-bold text-teal-800">🧕 Mbak Syifa:</span> "{art.praiseSyifa}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                            setSelectedArtworkForModal(art);
                          }}
                          className="text-xs font-bold text-stone-700 hover:text-emerald-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail Karya</span>
                        </button>

                        <button
                          onClick={() => handleExportToSutradara(art)}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                          title="Export ke Sutradara Ajaib & TV Asy"
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>Kirim ke TV Asy</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 3: POHON INSPIRASI BERDAUN (P9)
        ============================================================ */}
        {activeTab === 'POHON_INSPIRASI' && (
          <div className="space-y-6">
            
            {/* INSPIRATION TREE HEADER */}
            <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="bg-amber-300 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Pohon Kebaikan Seni
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                  🌳 Pohon Inspirasi Asy Syifa
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  Setiap karya santri menumbuhkan sehelai daun berhias pita warna-warni. Sentuh daun pada pohon untuk membaca pesan semangat dan doa penyejuk hati!
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold">
                    🍃 {artworks.length} Daun Karya Mekar
                  </div>
                  <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold">
                    Ribbon Berkah Aktif
                  </div>
                </div>
              </div>

              <CartoonCharacterSvg type="SYIFA" size={130} expression="SENYUM" />
            </div>

            {/* INTERACTIVE TREE CANVAS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
              <div className="text-center mb-6">
                <h3 className="text-base font-bold text-stone-900">
                  Dedaunan Karya yang Semakin Rindang
                </h3>
                <p className="text-xs text-stone-500">Klik salah satu daun di bawah untuk membuka nasehat kebaikan</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {artworks.map((art, idx) => {
                  const msg = INSPIRATION_LEAF_MESSAGES[idx % INSPIRATION_LEAF_MESSAGES.length];
                  return (
                    <button
                      key={art.id}
                      onClick={() => {
                        asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                        setSelectedLeafMessage(msg);
                      }}
                      className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex flex-col items-center text-center group active:scale-95"
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-xs mb-2 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${art.leafRibbonColor}25`, color: art.leafRibbonColor }}
                      >
                        🍃
                      </div>
                      <span className="text-xs font-bold text-stone-800 truncate w-full">
                        {art.childName}
                      </span>
                      <span className="text-[10px] text-stone-500 mt-0.5">
                        {art.code}
                      </span>
                      <span 
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 text-white"
                        style={{ backgroundColor: art.leafRibbonColor }}
                      >
                        Pita Berkah
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LEAF MESSAGE MODAL */}
            {selectedLeafMessage && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-emerald-400 animate-dna-breathing text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto mb-3">
                    🍃
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    Pesan Semangat Pohon Inspirasi
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-2">
                    {selectedLeafMessage.title}
                  </h3>
                  <p className="text-sm text-stone-700 mt-3 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200 italic">
                    "{selectedLeafMessage.text}"
                  </p>
                  <button
                    onClick={() => setSelectedLeafMessage(null)}
                    className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition-colors"
                  >
                    Alhamdulillah, Terima Kasih!
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ============================================================
            TAB 4: LEMARI KARYA KELAS (P10)
        ============================================================ */}
        {activeTab === 'LEMARI_KELAS' && (
          <div className="space-y-6">
            
            {/* CABINET EXPLANATION */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="bg-amber-300 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  RBAC & Penyimpanan Berkas Kelas
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                  🗄️ Lemari Karya Kelas (A1, A2, B1, B2)
                </h2>
                <p className="text-amber-100 text-sm mt-1">
                  Guru dapat mengorganisir dan memindahkan karya santri ke lemari kelas masing-masing. Wali murid dapat melihat arsip kreativitas ananda dengan tenang.
                </p>
              </div>
              <div className="bg-white/15 px-4 py-3 rounded-2xl backdrop-blur-xs border border-white/20 text-xs text-amber-100">
                <p className="font-bold text-white">Hak Akses:</p>
                <p>{isTeacherOrAdmin ? '✓ Mode Guru (Penuh)' : '✓ Mode Wali Murid'}</p>
              </div>
            </div>

            {/* 4 CLASS CABINET SHELVES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'A1', name: 'Kelas A1 (Bintang Cilik)', color: 'border-emerald-300 bg-emerald-50/40' },
                { id: 'A2', name: 'Kelas A2 (Bulan Sabit)', color: 'border-sky-300 bg-sky-50/40' },
                { id: 'B1', name: 'Kelas B1 (Mentari Pagi)', color: 'border-amber-300 bg-amber-50/40' },
                { id: 'B2', name: 'Kelas B2 (Pelangi Ceria)', color: 'border-purple-300 bg-purple-50/40' }
              ].map(cls => {
                const classWorks = artworks.filter(a => a.classId === cls.id);
                return (
                  <div 
                    key={cls.id}
                    className={`rounded-3xl p-5 border-2 shadow-xs flex flex-col justify-between ${cls.color}`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
                        <h3 className="text-sm font-bold text-stone-900 truncate">
                          {cls.name}
                        </h3>
                        <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-stone-200">
                          {classWorks.length}
                        </span>
                      </div>

                      {/* WORK LIST ON SHELF */}
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {classWorks.length === 0 ? (
                          <p className="text-xs text-stone-500 italic py-6 text-center">Belum ada karya di lemari ini.</p>
                        ) : (
                          classWorks.map(w => (
                            <div 
                              key={w.id}
                              className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-900 truncate max-w-[120px]">{w.childName}</span>
                                <span className="text-[10px] text-stone-500">{w.code}</span>
                              </div>
                              <p className="text-[11px] text-stone-600 truncate mt-0.5">{w.title}</p>
                              
                              {/* Teacher Move Tool */}
                              {isTeacherOrAdmin && (
                                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                                  <span className="text-[10px] text-stone-500">Pindah:</span>
                                  <div className="flex gap-1">
                                    {(['A1', 'A2', 'B1', 'B2'] as ClassCabinetId[]).filter(c => c !== cls.id).map(target => (
                                      <button
                                        key={target}
                                        onClick={() => {
                                          asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                                          rumahKreatifEngine.moveArtworkToClass(w.id, target);
                                          refreshData();
                                        }}
                                        className="text-[9px] font-bold bg-stone-100 hover:bg-stone-200 px-1.5 py-0.5 rounded-sm"
                                      >
                                        {target}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/60 text-center">
                      <span className="text-[11px] font-semibold text-stone-600">
                        Arsip Resmi TK Asy Syifa
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 5: PASPOR PETUALANG ASY (P11)
        ============================================================ */}
        {activeTab === 'PASPOR_PETUALANG' && (
          <div className="space-y-6">
            
            {/* PASSPORT HERO */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="bg-amber-300 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Kenangan Petualangan Santri
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                  🛂 Paspor Petualang Asy & Syifa
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Kumpulkan cap kenangan dari seluruh destinasi petualangan Asy Syifa. Tanpa ranking, tanpa skor — murni kenangan indah proses bertumbuh ananda!
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
                <div className="text-3xl font-extrabold text-amber-300">
                  {passportStamps.filter(s => s.earnedAt).length} / 7
                </div>
                <div className="text-xs text-white/90 font-medium mt-1">
                  Cap Petualangan Aktif
                </div>
              </div>
            </div>

            {/* PASSPORT BOOKLET STAMP GRID */}
            <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-inner">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-stone-900">
                  Halaman Cap Kenangan Resmi
                </h3>
                <p className="text-xs text-stone-500">Petualangan Belajar & Berkreasi di Dunia Asy Syifa</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {passportStamps.map(stamp => {
                  const isUnlocked = !!stamp.earnedAt;
                  return (
                    <div
                      key={stamp.id}
                      className={`p-5 rounded-3xl border-2 transition-all text-center flex flex-col items-center justify-between ${
                        isUnlocked 
                          ? 'bg-white border-amber-400 shadow-md transform hover:-translate-y-1' 
                          : 'bg-stone-100 border-dashed border-stone-300 opacity-60'
                      }`}
                    >
                      <div>
                        {/* STAMP CIRCLE BADGE */}
                        <div 
                          className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-3xl shadow-sm mb-3"
                          style={{ borderColor: stamp.color, backgroundColor: `${stamp.color}15` }}
                        >
                          {stamp.iconSymbol}
                        </div>

                        <h4 className="text-sm font-bold text-stone-900">{stamp.title}</h4>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{stamp.locationName}</p>
                        <p className="text-[11px] text-stone-600 mt-2 italic">"{stamp.motto}"</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 w-full">
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                            ✓ Cap Terverifikasi
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-stone-500 bg-stone-200 px-3 py-1 rounded-full">
                            Belum Dikunjungi
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 6: RUANG GURU & INSPIRASI (P6, P7)
        ============================================================ */}
        {activeTab === 'GURU_FOUNDER' && (
          <div className="space-y-6">
            
            {/* TEACHER COCKPIT BANNER */}
            <div className="bg-gradient-to-r from-stone-900 via-teal-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="bg-emerald-400 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Pusat Pengendali Publikasi & Inspirasi
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                    🛡️ Ruang Guru & Founder Asy Syifa
                  </h2>
                  <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
                    Guru memegang kendali penuh atas moderasi publikasi karya ke Galeri Keluarga, Buku Cerita, dan Pusat Aset.
                  </p>
                </div>

                {/* FOUNDER TOGGLE FOR DAILY INSPIRATION (P7) */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shrink-0">
                  <div>
                    <p className="text-xs font-bold text-white">Kreasi Harian Otomatis</p>
                    <p className="text-[11px] text-emerald-200">Tombol Founder ON/OFF</p>
                  </div>
                  <button
                    onClick={() => {
                      const next = rumahKreatifEngine.toggleDailyInspiration();
                      setIsDailyEnabled(next);
                      asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                    }}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isDailyEnabled ? 'bg-emerald-500 text-white' : 'bg-stone-700 text-stone-300'
                    }`}
                  >
                    {isDailyEnabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    <span>{isDailyEnabled ? 'AKTIF' : 'NONAKTIF'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ARTWORK MODERATION TABLE (P6) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Daftar Karya Santri & Status Publikasi
                  </h3>
                  <p className="text-xs text-stone-500">Sinkronisasi otomatis ke Buku Cerita, Pusat Aset, dan Galeri</p>
                </div>
                <button
                  onClick={refreshData}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Data</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Kode</th>
                      <th className="p-3">Judul Karya</th>
                      <th className="p-3">Nama Santri</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">Status Galeri</th>
                      <th className="p-3">Sinkronisasi</th>
                      <th className="p-3 rounded-r-xl">Aksi Guru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {artworks.map(art => (
                      <tr key={art.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3 font-bold text-stone-900">{art.code}</td>
                        <td className="p-3 font-medium text-stone-800">{art.title}</td>
                        <td className="p-3">{art.childName}</td>
                        <td className="p-3 font-bold text-emerald-700">Kelas {art.classId}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            art.publicationStatus === 'DITERBITKAN_DI_GALERI'
                              ? 'bg-emerald-100 text-emerald-800'
                              : art.publicationStatus === 'MENUNGGU_PERSETUJUAN_GURU'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}>
                            {art.publicationStatus === 'DITERBITKAN_DI_GALERI' ? '✓ Diterbitkan' : 'Draf'}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-stone-500">
                          Buku Cerita ✓ • Pusat Aset ✓
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
                              const nextStatus: PublicationStatus = 
                                art.publicationStatus === 'DITERBITKAN_DI_GALERI'
                                  ? 'DRAFT'
                                  : 'DITERBITKAN_DI_GALERI';
                              rumahKreatifEngine.updatePublicationStatus(art.id, nextStatus);
                              refreshData();
                            }}
                            className="bg-stone-100 hover:bg-emerald-100 text-stone-800 hover:text-emerald-900 font-bold px-2.5 py-1 rounded-lg text-[11px] transition-colors"
                          >
                            Toggle Publikasi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ARTWORK DETAIL PREVIEW MODAL */}
      {selectedArtworkForModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">{selectedArtworkForModal.title}</h3>
                <p className="text-xs text-stone-500">Karya Ananda: {selectedArtworkForModal.childName} (Kelas {selectedArtworkForModal.classId})</p>
              </div>
              <button
                onClick={() => setSelectedArtworkForModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* ART PREVIEW */}
            <div className="my-4 bg-stone-100 rounded-2xl p-4 border-2 border-amber-200 flex items-center justify-center">
              {(() => {
                const tmpl = rumahKreatifEngine.getTemplateById(selectedArtworkForModal.templateId);
                return (
                  <svg viewBox={tmpl.viewBox} className="w-full max-h-[260px]">
                    {tmpl.zones.map(zone => (
                      <path
                        key={zone.id}
                        d={zone.d}
                        fill={selectedArtworkForModal.zoneColors[zone.id] || zone.defaultColor}
                        stroke="#334155"
                        strokeWidth="3"
                      />
                    ))}
                    {tmpl.outlinePaths.map((d, i) => (
                      <path key={i} d={d} fill="none" stroke="#1e293b" strokeWidth="2.5" />
                    ))}
                    {selectedArtworkForModal.stickers.map(stk => {
                      const stkDef = stickers.find(s => s.type === stk.type);
                      return (
                        <g key={stk.id} transform={`translate(${stk.x}, ${stk.y}) rotate(${stk.rotation}) scale(${stk.scale})`}>
                          <circle r="18" fill="white" opacity="0.9" />
                          <text textAnchor="middle" dy="6" fontSize="20">{stkDef?.iconSvg || '⭐'}</text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            <div className="space-y-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <p className="text-stone-800">
                <span className="font-bold text-amber-800">👦 Dek Asy:</span> "{selectedArtworkForModal.praiseAsy}"
              </p>
              <p className="text-stone-800">
                <span className="font-bold text-teal-800">🧕 Mbak Syifa:</span> "{selectedArtworkForModal.praiseSyifa}"
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => handleExportToSutradara(selectedArtworkForModal)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Film className="w-4 h-4" />
                <span>Kirim ke TV Asy</span>
              </button>
              <button
                onClick={() => setSelectedArtworkForModal(null)}
                className="px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
