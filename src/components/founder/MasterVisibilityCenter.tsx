import React, { useState, useEffect } from 'react';
import {
  Eye,
  Sliders,
  ShieldCheck,
  Sparkles,
  Users,
  UserCheck,
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  RefreshCw,
  Crown,
  Volume2,
  VolumeX,
  Palette,
  Layers,
  HeartHandshake,
  MessageSquare,
  TreePine,
  CloudRain,
  Sun
} from 'lucide-react';
import {
  masterVisibilityService,
  MasterVisibilityState,
  GlobalVisibilityConfig,
  RoleVisibilityMatrix
} from '../../services/masterVisibilityService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const MasterVisibilityCenter: React.FC = () => {
  const [config, setConfig] = useState<MasterVisibilityState>(() => masterVisibilityService.getState());
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'ROLE_MATRIX' | 'USER_DEFAULTS' | 'JSON_CONFIG'>('GLOBAL');
  const [selectedRole, setSelectedRole] = useState<keyof RoleVisibilityMatrix>('waliMurid');
  const [importJson, setImportJson] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = masterVisibilityService.subscribe(newConfig => {
      setConfig(newConfig);
    });
    return unsub;
  }, []);

  const handleToggleGlobal = (key: keyof GlobalVisibilityConfig) => {
    const currentVal = config.global[key];
    masterVisibilityService.updateGlobal(key, !currentVal, 'Founder Andika');
    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Master Visibility Center',
      `Toggle global feature '${key}' -> ${!currentVal ? 'ACTIVE' : 'INACTIVE'}`
    );
    showFeedback(`Fitur Global '${key}' berhasil diubah`);
  };

  const handleToggleRole = (role: keyof RoleVisibilityMatrix, key: string) => {
    const currentVal = (config.roleMatrix[role] as any)[key];
    masterVisibilityService.updateRole(role, key as any, !currentVal, 'Founder Andika');
    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Master Visibility Center',
      `Toggle role [${role}] feature '${key}' -> ${!currentVal ? 'ALLOWED' : 'RESTRICTED'}`
    );
    showFeedback(`Akses ${role} untuk '${key}' diperbarui`);
  };

  const handleReset = () => {
    masterVisibilityService.resetToDefault();
    founderCommandRecorder.recordCommand(
      'CONFIG_UPDATE',
      'Master Visibility Center',
      'Reset seluruh konfigurasi visibilitas ke Baseline Resmi'
    );
    showFeedback('Konfigurasi berhasil dikembalikan ke standar default');
  };

  const handleExport = () => {
    const json = masterVisibilityService.exportConfigJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tade-master-visibility-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Manifest konfigurasi visibilitas berhasil diunduh');
  };

  const handleImportSubmit = () => {
    if (!importJson.trim()) return;
    const success = masterVisibilityService.importConfigJSON(importJson);
    if (success) {
      showFeedback('Manifest konfigurasi berhasil diimpor dan diterapkan');
      setImportJson('');
    } else {
      showFeedback('Format JSON tidak valid!');
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const GLOBAL_FEATURE_META: Array<{ key: keyof GlobalVisibilityConfig; title: string; desc: string; icon: any }> = [
    { key: 'livingMessenger', title: 'Living Messenger Enterprise', desc: 'Pesan interaktif santun dengan butterfly delivery & islamic emoji', icon: MessageSquare },
    { key: 'magicGarden', title: 'Magic Garden Dynamic Canvas', desc: 'Lapisan partikel daun melayang, kupu-kupu & cahaya berkah', icon: Sparkles },
    { key: 'wishTree', title: 'Wish Tree Munajat & Doa', desc: 'Pohon doa digital interaktif untuk orang tua & ustadzah', icon: HeartHandshake },
    { key: 'growingTree', title: 'Growing Tree Botanical Progress', desc: 'Visual pohon tumbuh capaian Juz 30 & adab santri', icon: TreePine },
    { key: 'livingAvatar', title: 'Living Avatar & Dual Photo Mode', desc: 'Mode foto arsip resmi SIM vs avatar animasi bernapas', icon: Users },
    { key: 'soundEffects', title: 'Islamic Audio Chimes & Sound FX', desc: 'Efek suara adem klik, berkah audio & denting pencapaian', icon: Volume2 },
    { key: 'rainAndRainbow', title: 'Rain & Rainbow Nature Modulator', desc: 'Efek cuaca dinamis sesuai waktu nyata & event sekolah', icon: CloudRain },
    { key: 'festivalMode', title: 'Festival & Milad Celebration Mode', desc: 'Ornamen khusus saat PPDB, Ramadhan, Wisuda & Milad', icon: Sun },
    { key: 'nightFireflies', title: 'Firefly Night Mode Ambient', desc: 'Kunang-kunang bersinar lembut saat akses malam hari', icon: Sparkles },
    { key: 'microInteractions', title: 'Living Micro Interactions (60 FPS)', desc: 'Ripple emerald wave, magnetic pull, dan card lift physics', icon: Layers }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Master Visibility Center</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                Sprint G7 Sovereign
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Kendali visibilitas institusional tanpa hardcode: Global Toggle, Role Matrix, Mode Lite, dan Export Manifest.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 md:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
          <button
            onClick={handleReset}
            className="flex-1 md:flex-none px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Default
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('GLOBAL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'GLOBAL'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Global Master Toggles ({Object.values(config.global).filter(Boolean).length}/10)
        </button>
        <button
          onClick={() => setActiveTab('ROLE_MATRIX')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ROLE_MATRIX'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Role Access Matrix
        </button>
        <button
          onClick={() => setActiveTab('USER_DEFAULTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'USER_DEFAULTS'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> User Defaults & Mode Lite
        </button>
        <button
          onClick={() => setActiveTab('JSON_CONFIG')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'JSON_CONFIG'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crown className="w-3.5 h-3.5" /> Sovereign Manifest
        </button>
      </div>

      {/* TAB CONTENT: GLOBAL */}
      {activeTab === 'GLOBAL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLOBAL_FEATURE_META.map(feat => {
            const isEnabled = config.global[feat.key];
            const Icon = feat.icon;
            return (
              <div
                key={feat.key}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isEnabled
                    ? 'bg-slate-800/90 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{feat.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleGlobal(feat.key)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: ROLE MATRIX */}
      {activeTab === 'ROLE_MATRIX' && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'waliMurid', label: 'Wali Murid' },
              { id: 'guru', label: 'Dewan Guru' },
              { id: 'kepalaSekolah', label: 'Kepala Sekolah' },
              { id: 'ketuaYayasan', label: 'Ketua Yayasan' },
              { id: 'adminSim', label: 'Admin SIM' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRole === r.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
            <h4 className="text-sm font-bold text-emerald-400">
              Matriks Akses untuk Role: <span className="uppercase text-white">{selectedRole}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {Object.entries(config.roleMatrix[selectedRole] || {}).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-700/60"
                >
                  <span className="text-xs font-mono font-medium text-slate-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <button
                    onClick={() => handleToggleRole(selectedRole, key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      val
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                        : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                    }`}
                  >
                    {val ? 'Diizinkan (Active)' : 'Dibatasi (Held)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: USER DEFAULTS */}
      {activeTab === 'USER_DEFAULTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Mode Ringan (Mode Lite)
            </h4>
            <p className="text-xs text-slate-400">
              Secara otomatis menonaktifkan canvas partikel, animasi berat, dan efek suara untuk perangkat berspesifikasi rendah / baterai hemat.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-300">Status Mode Lite Default</span>
              <button
                onClick={() => {
                  masterVisibilityService.updateUserPreference('modeLite', !config.userDefault.modeLite);
                  showFeedback(`Mode Lite default diubah ke ${!config.userDefault.modeLite ? 'ON' : 'OFF'}`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  config.userDefault.modeLite
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {config.userDefault.modeLite ? 'Aktif (Lite)' : 'Nonaktif (Full Experience)'}
              </button>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" /> Preferensi Audio & Gerakan
            </h4>
            <p className="text-xs text-slate-400">
              Konfigurasi default efek suara Islami dan animasi avatar untuk pengguna baru.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Audio Suara Islami</span>
                <input
                  type="checkbox"
                  checked={config.userDefault.soundEnabled}
                  onChange={e => masterVisibilityService.updateUserPreference('soundEnabled', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Animasi Bernapas Avatar</span>
                <input
                  type="checkbox"
                  checked={config.userDefault.avatarAnimation}
                  onChange={e => masterVisibilityService.updateUserPreference('avatarAnimation', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: JSON CONFIG */}
      {activeTab === 'JSON_CONFIG' && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-emerald-400 font-mono">
              Raw Manifest Snapshot ({config.version})
            </h4>
            <span className="text-xs text-slate-400">Terakhir: {config.lastUpdated}</span>
          </div>

          <textarea
            value={importJson || JSON.stringify(config, null, 2)}
            onChange={e => setImportJson(e.target.value)}
            rows={10}
            className="w-full bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-300 border border-slate-800 focus:outline-none focus:border-emerald-500"
            placeholder="Paste JSON manifest untuk restore konfigurasi..."
          />

          {importJson && (
            <button
              onClick={handleImportSubmit}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" /> Terapkan Manifest JSON
            </button>
          )}
        </div>
      )}
    </div>
  );
};
