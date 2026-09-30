import React, { useState, useEffect } from 'react';
import {
  Building2,
  Copy,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Download,
  Palette,
  Layers,
  Database,
  Lock,
  Plus,
  ArrowRight,
  RefreshCw,
  Crown
} from 'lucide-react';
import {
  schoolCloneService,
  SchoolCloneManifest,
  PRESET_BRAND_PALETTES
} from '../../services/schoolCloneService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const SchoolCloneKitWizard: React.FC = () => {
  const [schools, setSchools] = useState<SchoolCloneManifest[]>(() => schoolCloneService.getSchools());
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [npsn, setNpsn] = useState('');
  const [yayasanName, setYayasanName] = useState('Yayasan Pendidikan Islam Mandiri');
  const [level, setLevel] = useState<SchoolCloneManifest['level']>('TK');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(1);
  const [tagline, setTagline] = useState('Mendidik Karakter Unggul & Berakhlakul Karimah');

  const [modules, setModules] = useState({
    simAkademik: true,
    livingUniverse: true,
    parentCommunity: true,
    eRaporSentra: true,
    financeLedger: true,
    livingMessenger: true,
    cctvBridge: false,
    creativeStudio: true
  });

  useEffect(() => {
    const unsub = schoolCloneService.subscribe(() => {
      setSchools(schoolCloneService.getSchools());
    });
    return unsub;
  }, []);

  const handleFinishClone = () => {
    const palette = PRESET_BRAND_PALETTES[selectedPaletteIndex];
    const created = schoolCloneService.createClone({
      npsn: npsn || '69900000',
      name: schoolName,
      shortName: schoolName.replace('TK Islam ', '').replace('TK ', ''),
      yayasanName,
      level,
      tagline,
      city: city || 'Indonesia',
      address: address || 'Alamat Kampus Baru',
      brandDna: {
        primaryColor: palette.primary,
        primaryLight: palette.primaryLight,
        accentGold: palette.accentGold,
        darkBase: palette.darkBase,
        emblemIcon: palette.icon,
        fontFamily: 'Plus Jakarta Sans'
      },
      enabledModules: modules,
      databaseIsolation: {
        schemaNamespace: `tenant_${schoolName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        storageBucketPrefix: `storage_${schoolName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        initialStudentsCount: 0,
        initialTeachersCount: 0,
        isIsolated: true,
        seedCleanTemplate: true
      }
    });

    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'School Clone Kit',
      `Berhasil membuat kloning institusi sekolah baru [${created.name}] dengan isolasi tenant murni`
    );

    showFeedback(`Kampus baru [${created.name}] berhasil di-scaffold & siap digunakan!`);
    setIsCreating(false);
    setCurrentStep(1);
    resetForm();
  };

  const resetForm = () => {
    setSchoolName('');
    setNpsn('');
    setCity('');
    setAddress('');
  };

  const handleDownloadManifest = (schoolId: string) => {
    const json = schoolCloneService.exportManifestJSON(schoolId);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tade-${schoolId}-manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Manifest konfigurasi institusi berhasil diunduh');
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/40">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Sovereign School Clone Kit</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
                Sprint G7 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Wizard replikasi sistem institusi mandiri: Brand DNA baru, isolasi tenant bersih, dan zero data leak.
            </p>
          </div>
        </div>

        <button
          onClick={() => { setIsCreating(true); setCurrentStep(1); }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Buat Sekolah Baru
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-indigo-950/80 border border-indigo-500/60 rounded-xl text-indigo-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          {feedback}
        </div>
      )}

      {/* CLONE WIZARD MODAL */}
      {isCreating && (
        <div className="bg-slate-900 p-6 rounded-3xl border-2 border-indigo-500/50 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Wizard Kloning Sekolah (Langkah {currentStep} dari 5)
              </h3>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Tutup
            </button>
          </div>

          {/* STEP 1: IDENTITY */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-indigo-300">1. Identitas Institusi Baru</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400">Nama Resmi Sekolah</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    placeholder="Contoh: TK Islam Al-Azhar 42 Jember"
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">NPSN</label>
                  <input
                    type="text"
                    value={npsn}
                    onChange={e => setNpsn(e.target.value)}
                    placeholder="Contoh: 69981234"
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Yayasan Pengelola</label>
                  <input
                    type="text"
                    value={yayasanName}
                    onChange={e => setYayasanName(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Jenjang</label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="TK">Taman Kanak-Kanak (TK)</option>
                    <option value="PAUD">Pendidikan Anak Usia Dini (PAUD)</option>
                    <option value="KB">Kelompok Bermain (KB)</option>
                    <option value="RA">Raudhatul Athfal (RA)</option>
                    <option value="SD">Sekolah Dasar (SD)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400">Kota / Kabupaten & Alamat</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Contoh: Jember, Jawa Timur"
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => schoolName.trim() ? setCurrentStep(2) : showFeedback('Mohon isi nama sekolah!')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  Lanjut ke Brand DNA <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BRAND DNA */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-indigo-300">2. Preset Warna & Visual Brand DNA</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_BRAND_PALETTES.map((pal, idx) => (
                  <button
                    key={pal.name}
                    onClick={() => setSelectedPaletteIndex(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedPaletteIndex === idx
                        ? 'bg-slate-800 border-indigo-400 ring-2 ring-indigo-400/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pal.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{pal.name}</div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span style={{ backgroundColor: pal.primary }} className="w-4 h-4 rounded-full border border-white/20" />
                          <span style={{ backgroundColor: pal.primaryLight }} className="w-4 h-4 rounded-full border border-white/20" />
                          <span style={{ backgroundColor: pal.accentGold }} className="w-4 h-4 rounded-full border border-white/20" />
                        </div>
                      </div>
                    </div>
                    {selectedPaletteIndex === idx && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Motto / Tagline Institusi</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  Lanjut ke Isolasi Data <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DATA ISOLATION */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-indigo-300">3. Jaminan Isolasi Data & Kedaulatan Murni</h4>
              <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-5 h-5" /> Air-Gapped Tenant Schema Protection
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Database TK Asy Syifa Induk <span className="text-rose-400 font-bold">TIDAK AKAN</span> disalin ke kampus baru ini. Sistem akan men-generate schema kosong yang bersih dengan struktur 8 Standar Nasional PAUD siap pakai.
                </p>
                <div className="text-xs font-mono bg-slate-900 p-2.5 rounded-xl text-indigo-300">
                  Target Tenant: tenant_{schoolName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'kampus_baru'}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  Lanjut ke Pemilihan Modul <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: MODULE SELECTION */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-indigo-300">4. Pilih Modul yang Diaktifkan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(modules).map(([modKey, isEn]) => (
                  <div
                    key={modKey}
                    onClick={() => setModules({ ...modules, [modKey]: !isEn })}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isEn
                        ? 'bg-slate-800 border-indigo-500/60 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-xs font-bold capitalize">
                      {modKey.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <input
                      type="checkbox"
                      checked={isEn}
                      onChange={() => {}}
                      className="rounded text-indigo-600 pointer-events-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  Tinjau & Eksekusi <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL CONFIRMATION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-indigo-300">5. Konfirmasi Peluncuran Kampus Mandiri</h4>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Nama Sekolah:</span> <span className="font-bold text-white">{schoolName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Jenjang & NPSN:</span> <span className="font-bold text-white">{level} • {npsn || 'Draft'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Yayasan:</span> <span className="font-bold text-white">{yayasanName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Brand DNA:</span> <span className="font-bold text-indigo-300">{PRESET_BRAND_PALETTES[selectedPaletteIndex].name}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Isolasi Database:</span> <span className="font-bold text-emerald-400">100% Bersih & Terisolasi</span></div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold"
                >
                  Kembali
                </button>
                <button
                  onClick={handleFinishClone}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xl flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" /> Terbitkan & Inisialisasi Kampus Baru
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CLONED SCHOOLS LIST */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Daftar Kampus Sekolah Terdaftar ({schools.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schools.map(sch => (
            <div
              key={sch.schoolId}
              className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: sch.brandDna.primaryColor }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-white shadow-md border border-white/20"
                  >
                    {sch.brandDna.emblemIcon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{sch.name}</h4>
                    <p className="text-xs text-slate-400">NPSN: {sch.npsn} • {sch.city}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-[10px] font-mono font-bold">
                  ACTIVE TENANT
                </span>
              </div>

              <p className="text-xs text-slate-400 italic">"{sch.tagline}"</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Schema: {sch.databaseIsolation.schemaNamespace}
                </span>
                <button
                  onClick={() => handleDownloadManifest(sch.schoolId)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Manifest JSON
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
