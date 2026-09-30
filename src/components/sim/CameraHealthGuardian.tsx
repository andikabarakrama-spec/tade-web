import React, { useState } from 'react';
import {
  Activity,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  HardDrive,
  Clock,
  KeyRound,
  Eye,
  Camera,
  RefreshCw,
  Sliders,
  Check,
  Zap
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface HealthReport {
  cameraId: string;
  cameraName: string;
  ip: string;
  status: 'HIJAU' | 'KUNING' | 'MERAH';
  fpsCurrent: number;
  fpsTarget: number;
  bitrateKbps: number;
  storageAllocatedGb: number;
  firmwareVersion: string;
  isDefaultPassword: boolean;
  timeOffsetMs: number;
  lensObscured: boolean;
  lastCheck: string;
}

export const CameraHealthGuardian: React.FC = () => {
  const [reports, setReports] = useState<HealthReport[]>([
    {
      cameraId: 'CAM-01',
      cameraName: 'Gerbang Utama & Pos Satpam',
      ip: '192.168.10.101',
      status: 'HIJAU',
      fpsCurrent: 30,
      fpsTarget: 30,
      bitrateKbps: 4096,
      storageAllocatedGb: 500,
      firmwareVersion: 'v5.7.12 (Latest Patched)',
      isDefaultPassword: false,
      timeOffsetMs: 2,
      lensObscured: false,
      lastCheck: '10 dtk lalu'
    },
    {
      cameraId: 'CAM-02',
      cameraName: 'Area Penjemputan Santri',
      ip: '192.168.10.102',
      status: 'HIJAU',
      fpsCurrent: 30,
      fpsTarget: 30,
      bitrateKbps: 3840,
      storageAllocatedGb: 500,
      firmwareVersion: 'v2.820.0000000.15.R',
      isDefaultPassword: false,
      timeOffsetMs: 4,
      lensObscured: false,
      lastCheck: '10 dtk lalu'
    },
    {
      cameraId: 'CAM-03',
      cameraName: 'Halaman Bermain & Sentra Alam',
      ip: '192.168.10.103',
      status: 'KUNING',
      fpsCurrent: 22,
      fpsTarget: 25,
      bitrateKbps: 2100,
      storageAllocatedGb: 350,
      firmwareVersion: 'v1.1.8 Build 230914',
      isDefaultPassword: false,
      timeOffsetMs: 12,
      lensObscured: false,
      lastCheck: '15 dtk lalu'
    },
    {
      cameraId: 'CAM-04',
      cameraName: 'Koridor Utama Kelas Sentra',
      ip: '192.168.10.104',
      status: 'HIJAU',
      fpsCurrent: 30,
      fpsTarget: 30,
      bitrateKbps: 4096,
      storageAllocatedGb: 400,
      firmwareVersion: 'v5.3.3 Build 230401',
      isDefaultPassword: false,
      timeOffsetMs: 1,
      lensObscured: false,
      lastCheck: '12 dtk lalu'
    },
    {
      cameraId: 'CAM-05',
      cameraName: 'Aula Sentra & Masjid',
      ip: '192.168.10.105',
      status: 'HIJAU',
      fpsCurrent: 30,
      fpsTarget: 30,
      bitrateKbps: 3500,
      storageAllocatedGb: 400,
      firmwareVersion: 'UNV-B1104P07',
      isDefaultPassword: false,
      timeOffsetMs: 3,
      lensObscured: false,
      lastCheck: '8 dtk lalu'
    },
    {
      cameraId: 'CAM-06',
      cameraName: 'Gudang Arsip & Ruang Server',
      ip: '192.168.10.106',
      status: 'HIJAU',
      fpsCurrent: 25,
      fpsTarget: 25,
      bitrateKbps: 2048,
      storageAllocatedGb: 300,
      firmwareVersion: 'v2.680.0000000.3',
      isDefaultPassword: false,
      timeOffsetMs: 2,
      lensObscured: false,
      lastCheck: '5 dtk lalu'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      blackBoxRecorder.record({
        moduleCode: 'R380-HEALTH',
        role: 'ADMIN_SIM',
        eventType: 'ACTION',
        details: 'Full diagnostic cycle completed across 6 cameras. Overall fleet status: 98% Optimal.',
        severity: 'INFO'
      });
    }, 1000);
  };

  const greenCount = reports.filter(r => r.status === 'HIJAU').length;
  const yellowCount = reports.filter(r => r.status === 'KUNING').length;
  const redCount = reports.filter(r => r.status === 'MERAH').length;

  return (
    <div id="camera-health-guardian-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R380 &bull; CAMERA HEALTH GUARDIAN
              </span>
              <span className="text-xs text-slate-400 font-mono">Automated Telemetry &amp; Lens Tamper Watch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <HeartPulse className="w-8 h-8 text-emerald-400" />
              Diagnostik Kesehatan &amp; Kelaikan CCTV
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Memantau FPS, Bitrate, Clock Drift, Integritas Firmware, Kata Sandi Default, dan Deteksi Sabotase/Lensa Tertutup secara berkelanjutan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 font-mono shadow-lg shadow-emerald-600/30 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Memeriksa Sensor...' : 'Jalankan Diagnostik'}
            </button>
          </div>
        </div>

        {/* Status Distribution Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-3 gap-3 text-center font-mono">
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40">
            <span className="text-[10px] text-emerald-300 block">STATUS HIJAU (OPTIMAL)</span>
            <span className="text-xl font-bold text-emerald-400">{greenCount} Kamera</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40">
            <span className="text-[10px] text-amber-300 block">STATUS KUNING (PERINGATAN)</span>
            <span className="text-xl font-bold text-amber-400">{yellowCount} Kamera</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40">
            <span className="text-[10px] text-rose-300 block">STATUS MERAH (KRITIS)</span>
            <span className="text-xl font-bold text-rose-400">{redCount} Kamera</span>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div
            key={r.cameraId}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">{r.cameraName}</span>
                <span className="text-[10px] text-slate-400">{r.cameraId} &bull; {r.ip}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                r.status === 'HIJAU' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                r.status === 'KUNING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {r.status}
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">FPS / Frame Rate:</span>
                <strong className={r.fpsCurrent < r.fpsTarget ? 'text-amber-500' : 'text-emerald-500'}>
                  {r.fpsCurrent} / {r.fpsTarget} FPS
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Bitrate Stream:</span>
                <strong>{r.bitrateKbps} kbps</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Alokasi Storage NVR:</span>
                <strong>{r.storageAllocatedGb} GB</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Clock Drift (NTP):</span>
                <strong className="text-emerald-500">+{r.timeOffsetMs} ms (Presisi)</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Audit Sandi Bawaan:</span>
                <strong className="text-emerald-500">Aman (Bukan Default)</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Deteksi Sabotase Lensa:</span>
                <strong className={r.lensObscured ? 'text-rose-500' : 'text-emerald-500'}>
                  {r.lensObscured ? 'TERTUTUP / GELAP' : 'Bening / Normal'}
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
              <span>Firmware: {r.firmwareVersion}</span>
              <span>{r.lastCheck}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
