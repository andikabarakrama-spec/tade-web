import React, { useState, useEffect, useMemo } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  User, 
  Smile, 
  Sliders, 
  Radio, 
  Mic, 
  Save, 
  Flame 
} from 'lucide-react';
import { 
  AsyVoiceIdentityStudio, 
  VoiceCharacter, 
  VoiceAgeGroup, 
  VoiceStyle, 
  VoiceIdentityConfig 
} from '../../core/living/asyVoiceIdentityStudio';
import { useAuth } from '../../context/AuthContext';

export const AsyVoiceStudioViewer: React.FC = () => {
  const { userProfile } = useAuth();
  const isSuperAdmin = userProfile?.role === 'SUPER_ADMIN';

  const studio = useMemo(() => AsyVoiceIdentityStudio.getInstance(), []);
  const [config, setConfig] = useState<VoiceIdentityConfig>(() => studio.getConfig());
  
  const [selectedCharacter, setSelectedCharacter] = useState<VoiceCharacter>(config.character);
  const [selectedAge, setSelectedAge] = useState<VoiceAgeGroup>(config.age);
  const [selectedStyle, setSelectedStyle] = useState<VoiceStyle>(config.style);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    const unsub = studio.subscribe((updated) => {
      setConfig(updated);
      setSelectedCharacter(updated.character);
      setSelectedAge(updated.age);
      setSelectedStyle(updated.style);
    });
    return () => unsub();
  }, [studio]);

  const handlePlaySample = async (idx: number = 0) => {
    setIsPlaying(true);
    await studio.previewVoice(idx);
    setIsPlaying(false);
  };

  const handleSaveGlobalIdentity = () => {
    if (!isSuperAdmin) return;
    studio.updateGlobalIdentity(selectedCharacter, selectedAge, selectedStyle, userProfile?.name || 'SUPER_ADMIN');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const characters: { id: VoiceCharacter; name: string; desc: string; icon: string }[] = [
    { id: 'ASY', name: 'Asy (Laki-laki)', desc: 'Mascot santri ceria dengan peci hitam zamrud dan baju koko.', icon: '👦' },
    { id: 'SYIFA', name: 'Syifa (Perempuan)', desc: 'Mascot santri putri lembut dengan jilbab anggun pastel.', icon: '👧' }
  ];

  const ageGroups: { id: VoiceAgeGroup; label: string; tone: string }[] = [
    { id: '4_TAHUN', label: '4 Tahun', tone: 'Sangat imut, pitch tinggi, cadel menggemaskan' },
    { id: '6_TAHUN', label: '6 Tahun', tone: 'Usia TK B, ceria, artikulatif, semangat' },
    { id: '8_TAHUN', label: '8 Tahun', tone: 'Usia SD awal, percaya diri, jelas' },
    { id: '10_TAHUN', label: '10 Tahun', tone: 'Kakak pembina, santun, teratur' },
    { id: '12_TAHUN', label: '12 Tahun', tone: 'Pendamping remaja cilik, tenang' }
  ];

  const styles: { id: VoiceStyle; label: string; desc: string }[] = [
    { id: 'IMUT', label: 'Imut', desc: 'Menggemaskan, penuh ekspresi ceria anak-anak' },
    { id: 'CERIA', label: 'Ceria', desc: 'Penuh semangat, riang gembira mengajak belajar' },
    { id: 'MANJA', label: 'Manja', desc: 'Hangat, akrab, bersahabat dekat' },
    { id: 'LEMBUT', label: 'Lembut', desc: 'Menyejukkan hati, santun, tutur kata halus' },
    { id: 'PENDAMPING', label: 'Pendamping', desc: 'Fokus memandu langkah dan nasehat adab' }
  ];

  return (
    <div className="space-y-6" id="asy-voice-studio-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Studio Suara Asy Global
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R826 &bull; RC100
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SUPER ADMIN SOVEREIGN
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Identitas Vokal & Karakter Suara Seluruh TADE
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Tentukan karakter maskot, rentang usia vokal, dan gaya bicara. Satu konfigurasi di sini mengikat identitas suara Asy & Syifa di seluruh modul aplikasi.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Identitas Aktif</span>
            <span className="text-sm font-bold text-rose-400">
              {config.character} &bull; {config.age.replace('_', ' ')} &bull; {config.style}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Controls */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Pilih Karakter */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-rose-400" />
              1. Pilih Karakter Maskot
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {characters.map((c) => {
                const isSelected = selectedCharacter === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCharacter(c.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500/60 ring-2 ring-rose-500/20'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl">{c.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Pilih Umur Suara */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              2. Pilih Umur Suara
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ageGroups.map((a) => {
                const isSelected = selectedAge === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAge(a.id)}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500 text-slate-950 font-black border-rose-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 font-semibold'
                    }`}
                  >
                    <span className="text-xs block">{a.label}</span>
                    <span className={`text-[9px] block mt-1 line-clamp-2 ${isSelected ? 'text-slate-900 font-normal' : 'text-slate-500'}`}>
                      {a.tone}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Pilih Gaya Suara */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Smile className="w-4 h-4 text-rose-400" />
              3. Pilih Gaya Suara (Voice Style)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {styles.map((s) => {
                const isSelected = selectedStyle === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500/60 ring-2 ring-rose-500/20'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-rose-400' : 'text-white'}`}>
                      {s.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Audio Preview & Save */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-rose-400" />
                Uji Coba Vokal
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">SPEECH SYNTH</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">Pilih Contoh Kalimat:</span>
              <div className="space-y-2">
                {config.samplePhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    onClick={() => handlePlaySample(idx)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-xs text-slate-300 transition cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <span className="truncate group-hover:text-white">"{phrase}"</span>
                    <Play className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePlaySample(0)}
              disabled={isPlaying}
              className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              {isPlaying ? 'Memutar Suara Asy...' : 'Dengarkan Vokal Sekarang'}
            </button>

            {/* Save Button for Super Admin */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              {isSuperAdmin ? (
                <button
                  onClick={handleSaveGlobalIdentity}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <Save className="w-4 h-4" />
                  Terapkan Identitas Global TADE
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center">
                  Hanya Super Admin yang berwenang mengubah identitas vokal global.
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Identitas suara berhasil disimpan dan berlaku global!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
