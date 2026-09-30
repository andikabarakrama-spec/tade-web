import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Video,
  Eye,
  AlertTriangle,
  Lock,
  HardDrive,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  Maximize2,
  Radio,
  Sliders,
  Filter,
  Users,
  DoorClosed,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  RefreshCw,
  FileCheck2,
  Bell
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface CameraFeed {
  id: string;
  code: string;
  name: string;
  zone: string;
  vendor: string;
  ip: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  fps: number;
  bitrateKbps: number;
  resolution: string;
  lastMotion: string;
  isIncidentLocked: boolean;
  tamperAlert: boolean;
}

export const GuardianSecurityCommandCenter: React.FC = () => {
  const [incidentMode, setIncidentMode] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [activeCameraId, setActiveCameraId] = useState<string>('CAM-01');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [storageUsedGb] = useState<number>(1840);
  const [storageTotalGb] = useState<number>(4000);
  const [asyNotification, setAsyNotification] = useState<string>(
    'Assalamu’alaikum! Asy siap mengamankan seluruh area KB-TK-TPA Sentra Asy-Syifa Tanggul 24/7!'
  );

  const cameras: CameraFeed[] = [
    {
      id: 'CAM-01',
      code: 'CAM-01-GERBANG',
      name: 'Gerbang Utama & Pos Satpam',
      zone: 'GERBANG',
      vendor: 'Hikvision ColorVu 4MP',
      ip: '192.168.10.101',
      status: 'ONLINE',
      fps: 30,
      bitrateKbps: 4096,
      resolution: '2560x1440',
      lastMotion: 'Baru saja (12 dtk lalu)',
      isIncidentLocked: false,
      tamperAlert: false
    },
    {
      id: 'CAM-02',
      code: 'CAM-02-JEMPUT',
      name: 'Area Penjemputan & Parkir Santri',
      zone: 'PENJEMPUTAN',
      vendor: 'Dahua WizSense 4MP',
      ip: '192.168.10.102',
      status: 'ONLINE',
      fps: 30,
      bitrateKbps: 3840,
      resolution: '2560x1440',
      lastMotion: '3 menit lalu',
      isIncidentLocked: false,
      tamperAlert: false
    },
    {
      id: 'CAM-03',
      code: 'CAM-03-BERMAIN',
      name: 'Halaman Bermain & Sentra Alam',
      zone: 'BERMAIN',
      vendor: 'TP-Link Tapo Enterprise',
      ip: '192.168.10.103',
      status: 'ONLINE',
      fps: 25,
      bitrateKbps: 2560,
      resolution: '1920x1080',
      lastMotion: '8 menit lalu',
      isIncidentLocked: false,
      tamperAlert: false
    },
    {
      id: 'CAM-04',
      code: 'CAM-04-KORIDOR',
      name: 'Koridor Utama Kelas Sentra',
      zone: 'KORIDOR',
      vendor: 'Ezviz Smart AI 4MP',
      ip: '192.168.10.104',
      status: 'ONLINE',
      fps: 30,
      bitrateKbps: 4096,
      resolution: '2560x1440',
      lastMotion: '15 menit lalu',
      isIncidentLocked: false,
      tamperAlert: false
    },
    {
      id: 'CAM-05',
      code: 'CAM-05-AULA',
      name: 'Aula Sentra & Masjid Asy-Syifa',
      zone: 'AULA',
      vendor: 'Uniview Starlight 4MP',
      ip: '192.168.10.105',
      status: 'ONLINE',
      fps: 30,
      bitrateKbps: 3500,
      resolution: '2560x1440',
      lastMotion: '32 menit lalu',
      isIncidentLocked: false,
      tamperAlert: false
    },
    {
      id: 'CAM-06',
      code: 'CAM-06-GUDANG',
      name: 'Gudang Arsip & Ruang Server',
      zone: 'ARSIP_SERVER',
      vendor: 'Imou Bullet Pro 4MP',
      ip: '192.168.10.106',
      status: 'ONLINE',
      fps: 25,
      bitrateKbps: 2048,
      resolution: '1920x1080',
      lastMotion: 'Tidak ada aktivitas',
      isIncidentLocked: true,
      tamperAlert: false
    }
  ];

  const filteredCameras = selectedZone === 'ALL' 
    ? cameras 
    : cameras.filter(c => c.zone === selectedZone);

  const activeCamera = cameras.find(c => c.id === activeCameraId) || cameras[0];

  const handleToggleIncident = () => {
    const nextState = !incidentMode;
    setIncidentMode(nextState);
    if (nextState) {
      setAsyNotification('PERINGATAN: Mode Insiden Aktif! Semua feed kamera 10 menit terakhir telah dikunci (Incident Lock) dan di-hash SHA-256!');
      blackBoxRecorder.record({
        moduleCode: 'R378-COMMAND',
        role: 'SECURITY_COMMANDER',
        eventType: 'SECURITY',
        details: 'Incident Mode Activated. All active CCTV buffers locked into Evidence Vault.',
        severity: 'CRITICAL'
      });
    } else {
      setAsyNotification('Mode Insiden dimatikan. Sistem kembali ke pemantauan normal.');
      blackBoxRecorder.record({
        moduleCode: 'R378-COMMAND',
        role: 'SECURITY_COMMANDER',
        eventType: 'ACTION',
        details: 'Incident Mode Deactivated. Returning to standard operational monitoring.',
        severity: 'INFO'
      });
    }
  };

  return (
    <div id="guardian-security-command-center" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Asy Security Commander Notification Bar */}
      <div className={`p-4 rounded-3xl border transition-all shadow-md flex items-center gap-4 ${
        incidentMode 
          ? 'bg-rose-950/80 border-rose-500 text-rose-100 animate-pulse' 
          : 'bg-emerald-900/40 dark:bg-emerald-950/60 border-emerald-500/40 text-emerald-100'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shrink-0 shadow-inner">
          🛡️
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
              ASY SECURITY COMMANDER
            </span>
            <span className="text-xs opacity-75 font-mono">Real-Time Campus Guard</span>
          </div>
          <p className="text-xs sm:text-sm font-medium mt-0.5">
            {asyNotification}
          </p>
        </div>
        <button
          onClick={handleToggleIncident}
          className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-lg ${
            incidentMode
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
          }`}
        >
          <Flame className="w-4 h-4" />
          {incidentMode ? 'Matikan Incident Mode' : 'AKTIFKAN INCIDENT MODE'}
        </button>
      </div>

      {/* Main Header & Metric Summary */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R378 &bull; GUARDIAN SECURITY COMMAND CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">TADE v12.2 Enterprise Security</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Video className="w-8 h-8 text-cyan-400" />
              Pusat Komando CCTV &amp; Keamanan Kampus
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Integrasi multi-brand kamera IP, pemantauan status gerbang santri, timeline gerak otomatis, dan brankas bukti digital berintegritas tinggi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[100px]">
              <span className="text-[10px] font-mono text-slate-400 block">STATUS KAMERA</span>
              <span className="text-base font-bold text-emerald-400 font-mono">6/6 ONLINE</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[100px]">
              <span className="text-[10px] font-mono text-slate-400 block">NVR STORAGE</span>
              <span className="text-base font-bold text-cyan-400 font-mono">46% DIGUNAKAN</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[100px]">
              <span className="text-[10px] font-mono text-slate-400 block">STATUS GERBANG</span>
              <span className="text-base font-bold text-amber-400 font-mono">TERKUNCI AMAN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stream Spotlight & Multi-View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Big Spotlight Feed */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
                  {activeCamera.name}
                  {activeCamera.isIncidentLocked && (
                    <span className="px-2 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      VAULT LOCKED
                    </span>
                  )}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeCamera.code} &bull; {activeCamera.ip} &bull; {activeCamera.vendor}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                {activeCamera.fps} FPS &bull; {activeCamera.resolution}
              </span>
            </div>
          </div>

          {/* Simulated High-Def Live Video Canvas */}
          <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden group">
            {/* Background Grid Pattern simulating camera view */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            
            {/* Live Camera Watermark & HUD */}
            <div className="absolute top-4 left-4 font-mono text-xs text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>LIVE &bull; {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>

            <div className="absolute top-4 right-4 font-mono text-xs text-cyan-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/30">
              BITRATE: {activeCamera.bitrateKbps} kbps &bull; H.265+
            </div>

            {/* Central Visual Focus */}
            <div className="text-center p-6 z-10">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
                <Video className="w-10 h-10 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-white font-mono">{activeCamera.name}</p>
              <p className="text-xs text-slate-400 font-mono mt-1">RTSP Stream Live Handshake Established</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> ONVIF Profile S Verified
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  <Activity className="w-3 h-3" /> Motion Detection Active
                </span>
              </div>
            </div>

            {/* Bottom Stream Controls */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">Deteksi Gerak Terakhir:</span>
                <span>{activeCamera.lastMotion}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Latensi: <strong>24 ms</strong></span>
                <span>Drop Frame: <strong>0%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Selector & Zone List */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-500" />
                Filter Zona Kamera
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{filteredCameras.length} Kamera</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: 'ALL', label: 'Semua Zona' },
                { id: 'GERBANG', label: 'Gerbang & Pos' },
                { id: 'PENJEMPUTAN', label: 'Penjemputan' },
                { id: 'BERMAIN', label: 'Taman Bermain' },
                { id: 'KORIDOR', label: 'Koridor Sentra' },
                { id: 'ARSIP_SERVER', label: 'Arsip & Server' }
              ].map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`p-2 rounded-xl text-left transition-all ${
                    selectedZone === zone.id
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Grid Miniatures */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 max-h-96 overflow-y-auto pr-1">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
              Daftar Feed Kamera Aktif
            </h4>
            {filteredCameras.map((cam) => (
              <div
                key={cam.id}
                onClick={() => setActiveCameraId(cam.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeCameraId === cam.id
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-900 dark:text-cyan-200'
                    : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-cyan-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${cam.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <h5 className="font-bold text-xs font-mono">{cam.name}</h5>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {cam.code} &bull; {cam.resolution}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
