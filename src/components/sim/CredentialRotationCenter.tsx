import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone, 
  RefreshCw, 
  CreditCard, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Info,
  Lock,
  Terminal,
  Layers
} from 'lucide-react';

interface CredentialItem {
  id: string;
  category: 'PASSWORD' | 'DEVICE_TRUST' | 'RECOVERY_CARD' | 'APP_CHECK' | 'API_CONFIG';
  name: string;
  targetUserOrService: string;
  ageDays: number;
  maxRecommendedAgeDays: number;
  status: 'OPTIMAL' | 'RECOMMENDED_ROTATION' | 'NEEDS_ATTENTION';
  lastRotated: string;
  healthScore: number;
  recommendationNote: string;
}

export const CredentialRotationCenter: React.FC = () => {
  const [credentials] = useState<CredentialItem[]>([
    {
      id: 'CRED-001',
      category: 'PASSWORD',
      name: 'Password Super Admin Yayasan',
      targetUserOrService: 'KH. Dr. Muhammad Zaki (Ketua Yayasan)',
      ageDays: 45,
      maxRecommendedAgeDays: 90,
      status: 'OPTIMAL',
      lastRotated: '01 Juli 2026',
      healthScore: 98,
      recommendationNote: 'Password dalam usia aman (< 90 hari) dengan kompleksitas 16 karakter multi-faktor.'
    },
    {
      id: 'CRED-002',
      category: 'PASSWORD',
      name: 'Password Operator SIM Keuangan',
      targetUserOrService: 'Ustadzah Halimah (Bendahara)',
      ageDays: 82,
      maxRecommendedAgeDays: 90,
      status: 'RECOMMENDED_ROTATION',
      lastRotated: '25 Mei 2026',
      healthScore: 78,
      recommendationNote: 'Mendekati ambang 90 hari. Direkomendasikan melakukan rotasi password berkala minggu depan.'
    },
    {
      id: 'CRED-003',
      category: 'DEVICE_TRUST',
      name: 'Device Trust Token (Admin Laptop)',
      targetUserOrService: 'MacBook Air M2 (Ruang Tata Usaha)',
      ageDays: 14,
      maxRecommendedAgeDays: 30,
      status: 'OPTIMAL',
      lastRotated: '01 Agustus 2026',
      healthScore: 100,
      recommendationNote: 'Fingerprint hardware terverifikasi dan lulus uji biometrik TouchID.'
    },
    {
      id: 'CRED-004',
      category: 'RECOVERY_CARD',
      name: 'Emergency Sovereign Recovery Card',
      targetUserOrService: 'Ketua Yayasan + Kepala Sekolah (2-of-3 Quorum)',
      ageDays: 120,
      maxRecommendedAgeDays: 180,
      status: 'OPTIMAL',
      lastRotated: '15 April 2026',
      healthScore: 95,
      recommendationNote: 'Kunci fisik recovery tersimpan aman di brankas baja tahan api sekolah.'
    },
    {
      id: 'CRED-005',
      category: 'APP_CHECK',
      name: 'Firebase App Check Attestation Token',
      targetUserOrService: 'Cloud Attestation Service',
      ageDays: 7,
      maxRecommendedAgeDays: 30,
      status: 'OPTIMAL',
      lastRotated: '08 Agustus 2026',
      healthScore: 99,
      recommendationNote: 'Replay protection dan token integrity aktif 100% tanpa anomali request.'
    },
    {
      id: 'CRED-006',
      category: 'API_CONFIG',
      name: 'Gemini Sovereign AI Server Key',
      targetUserOrService: 'Server Backend Runtime',
      ageDays: 110,
      maxRecommendedAgeDays: 120,
      status: 'RECOMMENDED_ROTATION',
      lastRotated: '26 April 2026',
      healthScore: 72,
      recommendationNote: 'Rekomendasi Rotasi: Usia konfigurasi API mendekati 120 hari. Buat secret baru di GCP Console dan update .env server (TIDAK DILAKUKAN OTOMATIS OLEH AI).'
    }
  ]);

  return (
    <div id="credential-rotation-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <KeyRound className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R228 &bull; CREDENTIAL ROTATION ADVISORY
              </span>
              <span className="text-xs text-slate-400">Zero Auto-Destructive Key Policy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <KeyRound className="w-8 h-8 text-cyan-400" />
              Credential Rotation Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pemantauan kesehatan kredensial institusi (<strong>Password Age, Device Trust, Recovery Card, App Check, API Config Health</strong>). Sistem <em>TIDAK PERNAH mengganti API Key otomatis</em> guna mencegah *breakage*, melainkan memberikan rekomendasi rotasi terpadu.
            </p>
          </div>
        </div>

        {/* Global Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Kredensial Dipantau</span>
            <span className="text-xl font-bold text-white font-mono">{credentials.length} Kredensial</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Status Rotasi Mandiri</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">ADVISORY ONLY</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Kesehatan Kredensial Rata-rata</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">90.3% HEALTHY</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Kebijakan Otomasi API Key</span>
            <span className="text-xl font-bold text-rose-400 font-mono">NO AUTO-CHANGE</span>
          </div>
        </div>
      </div>

      {/* Safety Policy Notice */}
      <div className="bg-blue-50/70 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200 dark:border-blue-800/50 shadow-xs flex items-start gap-4">
        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-700 dark:text-blue-300 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
            Prinsip Kedaulatan: Panduan Rotasi Kredensial & Non-Otomasi Kunci API
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
            Sesuai Konstitusi TADE v12.2, sistem dilarang keras merekayasa atau mengubah API Key secara sepihak di latar belakang karena berpotensi merusak kelangsungan layanan produksi. Modul ini menyajikan jadwal usia kredensial dan langkah panduan manual bagi Administrator Yayasan.
          </p>
        </div>
      </div>

      {/* Credential Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {credentials.map((cred) => (
          <div
            key={cred.id}
            className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm space-y-4 transition-all ${
              cred.status === 'RECOMMENDED_ROTATION'
                ? 'border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-400/20'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                cred.category === 'PASSWORD' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
                cred.category === 'DEVICE_TRUST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                cred.category === 'RECOVERY_CARD' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' :
                cred.category === 'APP_CHECK' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
              }`}>
                {cred.category.replace('_', ' ')}
              </span>

              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                cred.status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                {cred.status === 'OPTIMAL' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {cred.status === 'OPTIMAL' ? 'SEHAT' : 'SARAN ROTASI'}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cred.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{cred.targetUserOrService}</p>
            </div>

            {/* Age Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Usia Kredensial:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {cred.ageDays} / {cred.maxRecommendedAgeDays} Hari
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    cred.ageDays / cred.maxRecommendedAgeDays > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (cred.ageDays / cred.maxRecommendedAgeDays) * 100)}%` }}
                />
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-0.5 text-[11px]">Catatan Rekomendasi:</strong>
              {cred.recommendationNote}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Rotasi Terakhir: {cred.lastRotated}</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">Skor: {cred.healthScore}/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
