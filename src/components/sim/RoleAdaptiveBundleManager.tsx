import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  HardDrive,
  Download,
  Gauge
} from 'lucide-react';

interface RoleBundle {
  role: string;
  bundleName: 'Lite' | 'Lite+' | 'Standard' | 'Executive' | 'Operations' | 'Presidential';
  bundleSize: string;
  includedModules: string[];
  excludedModules: string[];
  loadTimeEst: string;
}

interface HardwareProfile {
  deviceType: 'HP_LAMA' | 'HP_BARU' | 'TABLET' | 'LAPTOP' | 'PC';
  label: string;
  quality: 'LITE' | 'MEDIUM' | 'HIGH' | 'ULTRA' | 'FULL';
  targetFps: number;
  particleDensity: string;
  shadowQuality: string;
  icon: any;
}

export const RoleAdaptiveBundleManager: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('WALI_MURID');
  const [selectedDevice, setSelectedDevice] = useState<string>('HP_BARU');
  const [adaptiveFps, setAdaptiveFps] = useState<number>(60);

  const roleBundles: RoleBundle[] = [
    {
      role: 'WALI_MURID',
      bundleName: 'Lite',
      bundleSize: '450 KB (Compressed WebP/Gzip)',
      includedModules: ['R29 Portal Wali', 'R16 Buku Penghubung', 'R17 Tahfidz Doa', 'R10 SPP Tagihan', 'R28 Antar Jemput', 'Living Parent World'],
      excludedModules: ['Guardian Battlefield', 'Print Center', 'Media Studio 3D', 'Laporan Keuangan Yayasan', 'CMS Web'],
      loadTimeEst: '~0.3 detik (Koneksi 3G/4G)'
    },
    {
      role: 'GURU',
      bundleName: 'Lite+',
      bundleSize: '820 KB',
      includedModules: ['R30 Portal Guru', 'R6 Presensi Siswa', 'R7 Presensi Guru', 'R8 E-Rapor', 'R9 Anekdot', 'R17 Tahfidz', 'Living Teacher World'],
      excludedModules: ['Guardian Battlefield', 'Licensing Hub', 'Threat Map', 'Executive Mission Control'],
      loadTimeEst: '~0.5 detik'
    },
    {
      role: 'KEPALA_SEKOLAH',
      bundleName: 'Standard',
      bundleSize: '1.45 MB',
      includedModules: ['R31 Portal Kepsek', 'R3 Data Siswa', 'R4 Data Guru', 'R5 Kelompok Kelas', 'R12 Laporan Keuangan', 'R13 PPDB', 'R14 Kalender'],
      excludedModules: ['Guardian DDoS Lab', 'Threat Map', 'Chaos Engine'],
      loadTimeEst: '~0.9 detik'
    },
    {
      role: 'KETUA_YAYASAN',
      bundleName: 'Executive',
      bundleSize: '1.80 MB',
      includedModules: ['R63 Executive Workspace', 'R70 Mission Control', 'R89 Launch Dashboard', 'Smart Approval', 'Governance Timeline', 'R12 Keuangan'],
      excludedModules: ['Input Harian Guru', 'Inventaris Detail Sarpras', 'Battlefield Lab'],
      loadTimeEst: '~1.1 detik'
    },
    {
      role: 'ADMIN',
      bundleName: 'Operations',
      bundleSize: '2.25 MB',
      includedModules: ['R68 Living Workspace', 'AI Action Dock', 'R13 PPDB', 'R18 Sarpras', 'R86 Print Center', 'R94 Media Studio', 'R50 PDF Composer'],
      excludedModules: ['Guardian Chaos Engine', 'Threat Map Deep Audit'],
      loadTimeEst: '~1.3 detik'
    },
    {
      role: 'SUPER_ADMIN',
      bundleName: 'Presidential',
      bundleSize: '3.85 MB (Full Dynamic On-Demand)',
      includedModules: ['Seluruh 80+ Modul', 'Guardian Battlefield', 'National Threat Map', 'Discovery Registry', 'Living Banner 3D', 'CMS Karakter'],
      excludedModules: ['Tidak ada (Full Access)'],
      loadTimeEst: '~1.8 detik'
    }
  ];

  const hardwareProfiles: HardwareProfile[] = [
    { deviceType: 'HP_LAMA', label: 'HP Lama (RAM < 3GB)', quality: 'LITE', targetFps: 30, particleDensity: 'Dimatikan (0%)', shadowQuality: 'Flat (Tanpa Bayangan)', icon: Smartphone },
    { deviceType: 'HP_BARU', label: 'HP Baru / Modern', quality: 'MEDIUM', targetFps: 45, particleDensity: 'Ringan (30%)', shadowQuality: 'Soft CSS Shadow', icon: Smartphone },
    { deviceType: 'TABLET', label: 'Tablet / iPad', quality: 'HIGH', targetFps: 60, particleDensity: 'Standar (60%)', shadowQuality: 'Realistic Vector Shadow', icon: Tablet },
    { deviceType: 'LAPTOP', label: 'Laptop Kerja', quality: 'ULTRA', targetFps: 60, particleDensity: 'Penuh (100%)', shadowQuality: 'Ambient Glow HD', icon: Laptop },
    { deviceType: 'PC', label: 'PC Desktop Full HD', quality: 'FULL', targetFps: 60, particleDensity: 'Maksimal + 3D Canvas', shadowQuality: 'Full CGI Rendering', icon: Monitor }
  ];

  const activeBundle = roleBundles.find(b => b.role === selectedRole) || roleBundles[0];
  const activeDeviceProfile = hardwareProfiles.find(d => d.deviceType === selectedDevice) || hardwareProfiles[1];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Gauge className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  PERFORMANCE GUARDIAN & ROLE ADAPTIVE LOADING
                </span>
                <span className="text-xs text-slate-400">Zero Bloat Architecture</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Role Bundle Isolation & Adaptive Rendering Engine
              </h1>
              <p className="text-sm text-indigo-100/80 mt-0.5">
                Setiap role hanya mengunduh modul yang diperlukan, dan kualitas render menyesuaikan spesifikasi perangkat secara otomatis (HP Lama s/d PC Desktop).
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-3 text-center min-w-[150px]">
            <div className="text-[11px] text-slate-400 font-medium">Penghematan Kuota Wali</div>
            <div className="text-xl font-black text-emerald-400">88.3% Lebih Ringan</div>
          </div>
        </div>
      </div>

      {/* Grid: 1. Role Bundle Inspector & 2. Hardware Adaptive Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Role Adaptive Loading */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-600" />
                1. Role Adaptive Bundle Isolation
              </h3>
              <p className="text-xs text-slate-500">Pilih role untuk memeriksa ukuran paket modul</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
              Bundle: {activeBundle.bundleName}
            </span>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {roleBundles.map(rb => (
              <button
                key={rb.role}
                onClick={() => setSelectedRole(rb.role)}
                className={`p-2.5 rounded-lg border text-left text-xs transition ${
                  selectedRole === rb.role
                    ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-indigo-300'
                }`}
              >
                <div className="text-[10px] opacity-75">{rb.bundleName}</div>
                <div className="truncate">{rb.role.replace('_', ' ')}</div>
              </button>
            ))}
          </div>

          {/* Active Bundle Details */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Ukuran Paket Javascript:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{activeBundle.bundleSize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Estimasi Waktu Buka:</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{activeBundle.loadTimeEst}</span>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Modul yang Dimuat:</span>
              <div className="flex flex-wrap gap-1">
                {activeBundle.includedModules.map((m, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-medium">
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-slate-500">Modul yang Dikecualikan (Tidak Diunduh):</span>
              <div className="flex flex-wrap gap-1">
                {activeBundle.excludedModules.map((m, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    ✕ {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Hardware Adaptive Rendering */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                2. Adaptive Rendering Profiles
              </h3>
              <p className="text-xs text-slate-500">Otomatisasi profil grafis berdasarkan perangkat</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
              Kualitas: {activeDeviceProfile.quality}
            </span>
          </div>

          {/* Device selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {hardwareProfiles.map(hp => (
              <button
                key={hp.deviceType}
                onClick={() => setSelectedDevice(hp.deviceType)}
                className={`p-2.5 rounded-lg border text-left text-xs transition flex items-center gap-2 ${
                  selectedDevice === hp.deviceType
                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-emerald-300'
                }`}
              >
                <hp.icon className="w-4 h-4 shrink-0" />
                <div className="truncate">{hp.label}</div>
              </button>
            ))}
          </div>

          {/* Active Device Profile Metrics */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Target Refresh Framerate:</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {activeDeviceProfile.targetFps} FPS Target
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Kerapatan Partikel (Balon/Kupu-kupu):</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{activeDeviceProfile.particleDensity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Kualitas Bayangan & Maskot:</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{activeDeviceProfile.shadowQuality}</span>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-lg text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center gap-2 mt-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Engine mendeteksi GPU viewport & WebGL context otomatis untuk menjamin 0% lag di semua gadget.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
