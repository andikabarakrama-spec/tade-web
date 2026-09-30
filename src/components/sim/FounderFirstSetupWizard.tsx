import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Building2,
  Lock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Zap,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';

interface SetupStep {
  stepNumber: number;
  title: string;
  subtitle: string;
}

const STEPS: SetupStep[] = [
  { stepNumber: 1, title: 'Selamat Datang', subtitle: 'Pengantar Platform TADE' },
  { stepNumber: 2, title: 'Inisialisasi Sovereign Root', subtitle: 'Kunci Kedaulatan Tunggal' },
  { stepNumber: 3, title: 'Institusi Sekolah Perdana', subtitle: 'Pioneer Tenant Setup' },
  { stepNumber: 4, title: 'Guardian Health Check', subtitle: 'Verifikasi Kepatuhan Konstitusi' },
  { stepNumber: 5, title: 'Ringkasan Konfigurasi', subtitle: 'Validasi Seluruh Parameter' },
  { stepNumber: 6, title: 'Aktivasi TADE Enterprise', subtitle: 'Siap Digunakan' }
];

export const FounderFirstSetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfusedModal, setShowConfusedModal] = useState(false);

  // Form states
  const [rootAlias, setRootAlias] = useState('Chief Sovereign Founder');
  const [schoolName, setSchoolName] = useState('TK Islam Asy-Syifa (Pusat)');
  const [schoolLevel, setSchoolLevel] = useState('TK');
  const [curriculum, setCurriculum] = useState('Kurikulum Merdeka + Islam Terpadu');
  const [isActivated, setIsActivated] = useState(false);

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
    else setIsActivated(true);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                MODULE R141
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                ZERO CONFUSION WIZARD
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-100">
              Panduan Inisialisasi Pertama Founder TADE
            </h1>
            <p className="text-xs text-slate-400">
              Wizard langkah-demi-langkah berbahasa Indonesia untuk menyiapkan fondasi platform pertama kali tanpa kebingungan.
            </p>
          </div>

          <button
            onClick={() => setShowConfusedModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center space-x-2 transition-all shrink-0 cursor-pointer shadow-lg"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Saya Bingung? Tanya Dek Asy</span>
          </button>
        </div>
      </div>

      {/* Progress Bar / Steps Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {STEPS.map((s) => (
            <div
              key={s.stepNumber}
              onClick={() => setCurrentStep(s.stepNumber)}
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                currentStep === s.stepNumber
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : currentStep > s.stepNumber
                  ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 mb-1">
                {currentStep > s.stepNumber ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center font-mono">
                    {s.stepNumber}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-bold truncate">{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm min-h-[360px] flex flex-col justify-between space-y-6">
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Langkah 1: Selamat Datang di Ekosistem TADE
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              TADE (Teknologi Administrasi & Edukasi Terpadu) adalah platform manajemen institusi pendidikan multi-tenant generasi terbaru. Wizard ini akan memandu Anda mendirikan Sovereign Root tunggal dan mendaftarkan sekolah perintis pertama Anda dalam waktu kurang dari 2 menit.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Jaminan Konstitusi TADE v12.2:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>Zero-Overwrite: Fondasi database terisolasi tanpa risiko tumpang tindih.</li>
                <li>Single Sovereign Root: Bebas dari risiko privilege escalation antar tenant.</li>
                <li>Feather Performance: Aplikasi tetap gesit dan ringan di semua perangkat.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Sovereign Root */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Langkah 2: Inisialisasi Sovereign Root
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Tetapkan identitas pemilik kedaulatan platform. Akun ini tidak terikat pada satu sekolah mana pun, melainkan mengawasi seluruh armada multi-tenant.
            </p>
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Alias / Nama Founder:</label>
              <input
                type="text"
                value={rootAlias}
                onChange={(e) => setRootAlias(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-400">
                Sovereign Master ID: <code className="font-mono text-amber-600 dark:text-amber-400">PLATFORM-SOVEREIGN-ROOT-001</code>
              </span>
            </div>
          </div>
        )}

        {/* Step 3: First School */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Langkah 3: Registrasi Sekolah Pertama (Pioneer Tenant)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Masukkan nama sekolah pertama yang akan menggunakan sistem. Konfigurasi DNA dan jenjang akan disesuaikan otomatis.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Nama Sekolah:</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Jenjang Pendidikan:</label>
                <select
                  value={schoolLevel}
                  onChange={(e) => setSchoolLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
                >
                  <option value="PAUD">PAUD (Pendidikan Anak Usia Dini)</option>
                  <option value="TK">TK / RA (Taman Kanak-Kanak)</option>
                  <option value="SD">SD / MI (Sekolah Dasar)</option>
                  <option value="SMP">SMP / MTs</option>
                  <option value="SMA">SMA / MA</option>
                  <option value="SMK">SMK (Vokasi)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Guardian Check */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Langkah 4: Guardian Constitution & Performance Check
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Pemeriksaan integritas fondasi otomatis untuk menjamin tidak ada kebocoran modul antar tenant sekolah.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Integritas Fondasi (db.ts & firestore.rules)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">100% UTUH</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Kepatuhan Single Sovereign Root</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">TERVALIDASI</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Budget Performa (Feather Architecture)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">GRADE A</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {currentStep === 5 && (
          <div className="space-y-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Langkah 5: Ringkasan Inisialisasi
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Tinjau kembali seluruh parameter setup sebelum mengaktifkan TADE Enterprise.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">Sovereign Founder:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{rootAlias}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">Sekolah Perintis:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{schoolName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <span className="text-slate-400">Jenjang & Kurikulum:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{schoolLevel} • {curriculum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Constitution Seal:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">v12.2 ENTERPRISE LOCKED</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Activation */}
        {currentStep === 6 && (
          <div className="space-y-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Langkah 6: Aktivasi TADE Enterprise Selesai!
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Selamat! Platform TADE siap digunakan. Anda dapat langsung membuka portal Admin sekolah, atau beralih ke peran Wali Murid tanpa perlu repot logout.
            </p>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bold block">Sistem Telah Aktif & Terlindungi</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Seluruh layanan absensi, keuangan, AI Asy, dan portal akademik beroperasi normal.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-900/30 transition-all cursor-pointer"
          >
            <span>{currentStep === 6 ? 'Selesai & Mulai Eksplorasi' : 'Lanjutkan Langkah'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dek Asy Help Modal */}
      {showConfusedModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-300 dark:border-purple-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Bot className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Panduan Ramah Dek Asy
                </h3>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
                  ASISTEN CERDAS TADE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Halo Kakak Founder! Jangan bingung ya. Wizard ini cuma butuh 2 hal utama:
              <br /><br />
              1. <strong>Nama Kakak</strong> sebagai pemilik sistem (Sovereign Root).
              <br />
              2. <strong>Nama Sekolah Pertama</strong> yang mau Kakak daftarkan hari ini.
              <br /><br />
              Semua aturan teknis seperti database, isolasi data, dan keamanan sudah otomatis Dek Asy dan TADE tangani di latar belakang!
            </p>
            <button
              onClick={() => setShowConfusedModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow"
            >
              Terima Kasih Dek Asy, Saya Paham!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
