import React, { useState } from 'react';
import { useAIAsyCharacter, AIAsyPageKey, AIAsyPosition, AIAsyAnimationType } from '../../context/AIAsyCharacterContext';
import { AIAsyCharacterState, AI_ASY_ASSET_REGISTRY } from '../assistant/AIAsyCharacterAssetRegistry';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';
import { Save, CheckCircle2, Sliders, Eye, RefreshCw, User, Sparkles, Layers } from 'lucide-react';

export const AIAsyCharacterCMS: React.FC = () => {
  const { config, updateMasterConfig, updatePageConfig, resetToDefault, setGenderVariant } = useAIAsyCharacter();
  const [activeTab, setActiveTab] = useState<AIAsyPageKey>('w1Hero');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const pagesList: { key: AIAsyPageKey; label: string }[] = [
    { key: 'w1Hero', label: 'W1 Beranda Hero' },
    { key: 'w2Program', label: 'W2 Program Sentra' },
    { key: 'w3Galeri', label: 'W3 Galeri & Berita' },
    { key: 'w4PPDB', label: 'W4 PPDB Online' },
    { key: 'w5Kontak', label: 'W5 Kontak Sekolah' },
    { key: 'footer', label: 'Footer Salam' },
    { key: 'dashboardGuru', label: 'Dashboard Guru' },
    { key: 'dashboardAdmin', label: 'Dashboard Admin' },
    { key: 'dashboardKepsek', label: 'Dashboard Kepsek' },
    { key: 'dashboardYayasan', label: 'Dashboard Yayasan' },
    { key: 'dashboardParent', label: 'Dashboard Wali Murid' },
  ];

  const stateOptions: { state: AIAsyCharacterState; label: string }[] = Object.values(AI_ASY_ASSET_REGISTRY).map((item) => ({
    state: item.state,
    label: item.label,
  }));

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentPageCfg = config.pages[activeTab];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl shadow-md">
            👧
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>CMS Karakter Resmi AI Asy & Asyah</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Master Foundation CMS
              </span>
            </h3>
            <p className="text-stone-500 text-xs">
              Atur Karakter State, Posisi, Visibilitas, Skala Ukuran, Sapaan, dan Animasi per Halaman.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefault}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition border border-stone-300"
            title="Reset ke pengaturan default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Konfigurasi</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          Konfigurasi Master Karakter AI Asy Berhasil Diperbarui di Seluruh Website & Web App!
        </div>
      )}

      {/* Global Character Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
        <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 cursor-pointer">
          <input
            type="checkbox"
            checked={config.isEnabled}
            onChange={(e) => updateMasterConfig({ isEnabled: e.target.checked })}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <div>
            <span className="font-bold block text-slate-900">Master Karakter Aktif</span>
            <span className="text-[10px] text-stone-500">Tampilkan AI Asy di seluruh ekosistem</span>
          </div>
        </label>

        <div>
          <label className="block font-bold text-slate-800 mb-1">Varian Karakter Resmi</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGenderVariant('ASY')}
              className={`flex-1 p-2 rounded-xl font-bold border transition ${
                config.genderVariant === 'ASY'
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-white text-stone-700 border-stone-200'
              }`}
            >
              👦 AI Asy
            </button>
            <button
              onClick={() => setGenderVariant('ASYAH')}
              className={`flex-1 p-2 rounded-xl font-bold border transition ${
                config.genderVariant === 'ASYAH'
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-white text-stone-700 border-stone-200'
              }`}
            >
              👧 AI Asyah
            </button>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1">Skala Ukuran Global</label>
          <input
            type="range"
            min="0.8"
            max="1.3"
            step="0.05"
            value={config.globalScale}
            onChange={(e) => updateMasterConfig({ globalScale: parseFloat(e.target.value) })}
            className="w-full accent-emerald-600"
          />
          <div className="text-[10px] text-stone-500 font-bold text-right">{config.globalScale}x</div>
        </div>
      </div>

      {/* Per-Page Configuration Navigation Tabs */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-xs">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Pengaturan Karakter Per Halaman (State, Position, Scale, Greeting, Animation)</span>
        </h4>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {pagesList.map((p) => (
            <button
              key={p.key}
              onClick={() => setActiveTab(p.key)}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === p.key
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Active Page Editor Panel */}
        {currentPageCfg && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-4">
            
            {/* Live Character State Preview Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-emerald-900 rounded-xl border border-emerald-400/40 p-1 flex items-center justify-center shrink-0">
                  <AIAsyCharacterRenderer
                    state={currentPageCfg.state}
                    genderVariant={config.genderVariant}
                    scale={currentPageCfg.scale}
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Live Preview State</span>
                  <h5 className="font-extrabold text-slate-900 text-sm">
                    {AI_ASY_ASSET_REGISTRY[currentPageCfg.state]?.label || currentPageCfg.state}
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    {AI_ASY_ASSET_REGISTRY[currentPageCfg.state]?.description}
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl border border-emerald-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPageCfg.isVisible}
                  onChange={(e) => updatePageConfig(activeTab, { isVisible: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="font-bold text-emerald-900">Tampilkan di Halaman Ini</span>
              </label>
            </div>

            {/* Grid Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Character State */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Character State</label>
                <select
                  value={currentPageCfg.state}
                  onChange={(e) => updatePageConfig(activeTab, { state: e.target.value as AIAsyCharacterState })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-bold text-slate-800"
                >
                  {stateOptions.map((st) => (
                    <option key={st.state} value={st.state}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Character Position */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Character Position</label>
                <select
                  value={currentPageCfg.position}
                  onChange={(e) => updatePageConfig(activeTab, { position: e.target.value as AIAsyPosition })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="LEFT">Kiri (LEFT)</option>
                  <option value="CENTER">Tengah (CENTER)</option>
                  <option value="RIGHT">Kanan (RIGHT)</option>
                </select>
              </div>

              {/* Character Animation */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Character Animation</label>
                <select
                  value={currentPageCfg.animation}
                  onChange={(e) => updatePageConfig(activeTab, { animation: e.target.value as AIAsyAnimationType })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="GENTLE_BREATHING">Gentle Breathing</option>
                  <option value="FLOAT_SUBTLE">Float Subtle</option>
                  <option value="CELEBRATE_BOUNCE">Celebrate Bounce</option>
                  <option value="NONE">Statis (None)</option>
                </select>
              </div>

              {/* Character Scale */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Scale: {currentPageCfg.scale}x</label>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={currentPageCfg.scale}
                  onChange={(e) => updatePageConfig(activeTab, { scale: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 mt-2"
                />
              </div>

            </div>

            {/* Custom Greeting (Speech Bubble - Max 2 Lines) */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Sapaan Karakter (Speech Bubble - Maksimal 2 Baris)
              </label>
              <textarea
                rows={2}
                value={currentPageCfg.greeting}
                onChange={(e) => updatePageConfig(activeTab, { greeting: e.target.value })}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-slate-800"
                placeholder="Masukkan kata sapaan hangat..."
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
