import React, { useState } from 'react';
import { 
  Video, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Camera, 
  Maximize2, 
  Flame, 
  Radio, 
  Zap, 
  CheckCircle2, 
  RefreshCw,
  Eye,
  Sliders,
  BellRing
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface CCTVChannel {
  id: string;
  name: string;
  location: string;
  roomCode: string;
  ipAddress: string;
  fps: number;
  resolution: string;
  status: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
  incidentLevel: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  healthScore: number;
  lastPing: string;
}

const CCTV_CHANNELS: CCTVChannel[] = [
  { id: 'CAM-01', name: 'Gate Main Entrance HD', location: 'Gerbang Utama & Pos Satpam', roomCode: 'SEC-01', ipAddress: '192.168.1.101', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 100, lastPing: '2 ms' },
  { id: 'CAM-02', name: 'Drop-off & Parking 360', location: 'Area Parkir & Penjemputan', roomCode: 'PKG-01', ipAddress: '192.168.1.102', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 99, lastPing: '3 ms' },
  { id: 'CAM-03', name: 'Admin & Principal Office', location: 'Kantor Tata Usaha & Kepsek', roomCode: 'ADM-01', ipAddress: '192.168.1.103', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 100, lastPing: '1 ms' },
  { id: 'CAM-04', name: 'Main Hall PTZ High Range', location: 'Aula Serbaguna', roomCode: 'AUL-01', ipAddress: '192.168.1.104', fps: 30, resolution: '4K Ultra', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 100, lastPing: '2 ms' },
  { id: 'CAM-05', name: 'Sentra Balok Area Cam', location: 'Sentra Balok', roomCode: 'SNT-01', ipAddress: '192.168.1.105', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 98, lastPing: '3 ms' },
  { id: 'CAM-06', name: 'Sentra Persiapan Wide', location: 'Sentra Persiapan', roomCode: 'SNT-02', ipAddress: '192.168.1.106', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 100, lastPing: '2 ms' },
  { id: 'CAM-07', name: 'Sentra Seni & Musik Cam', location: 'Sentra Seni', roomCode: 'SNT-03', ipAddress: '192.168.1.107', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 100, lastPing: '2 ms' },
  { id: 'CAM-08', name: 'Roleplay Corner Cam', location: 'Sentra Main Peran', roomCode: 'SNT-04', ipAddress: '192.168.1.108', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 99, lastPing: '3 ms' },
  { id: 'CAM-09', name: 'Nature Science Lab Cam', location: 'Sentra Bahan Alam', roomCode: 'SNT-05', ipAddress: '192.168.1.109', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 97, lastPing: '4 ms' },
  { id: 'CAM-10', name: 'Corridor & Lavatory Access', location: 'Koridor Utama Toilet', roomCode: 'SVC-01', ipAddress: '192.168.1.110', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 100, lastPing: '2 ms' },
  { id: 'CAM-11', name: 'Storage Vault Security', location: 'Gudang Sarpras', roomCode: 'SVC-02', ipAddress: '192.168.1.111', fps: 30, resolution: '1080p FHD', status: 'ONLINE', incidentLevel: 'NORMAL', healthScore: 100, lastPing: '1 ms' }
];

export const LiveCCTVBridge: React.FC = () => {
  const [selectedCam, setSelectedCam] = useState<CCTVChannel>(CCTV_CHANNELS[0]);
  const [incidentMode, setIncidentMode] = useState<boolean>(false);
  const [ptzZoom, setPtzZoom] = useState<number>(1);

  const handleTriggerIncident = () => {
    const nextState = !incidentMode;
    setIncidentMode(nextState);
    blackBoxRecorder.record({
      moduleCode: 'R479',
      eventType: 'SECURITY',
      severity: nextState ? 'WARN' : 'INFO',
      details: nextState ? 'Incident Protocol triggered from Live CCTV Bridge.' : 'Incident Protocol deactivated.'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R479 &bull; LIVE CCTV BRIDGE
          </span>
          <span className="text-xs text-slate-400 font-mono">Guardian Security &amp; Video Mesh Protocol</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Video className="w-8 h-8 text-cyan-400" />
              Live CCTV Bridge &bull; Jembatan Pengawasan Kampus
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Integrasi langsung Digital Twin dengan Guardian Security, pemantauan CCTV Health, log timeline insiden, dan eskalasi darurat terpadu ke seluruh pos pengawasan TK Asy Syifa.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerIncident}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                incidentMode
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              {incidentMode ? '🚨 INCIDENT MODE AKTIF' : 'Simulasi Eskalasi Insiden'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Bridge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Video Feed & PTZ Control */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {selectedCam.name} ({selectedCam.id})
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                {selectedCam.resolution} &bull; {selectedCam.fps} FPS
              </span>
            </div>

            {/* Video Player Display Container */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 text-white">
              {/* OSD Watermark Header */}
              <div className="flex items-center justify-between z-10">
                <div className="bg-black/70 px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-2">
                  <span className="text-rose-500 font-bold">● REC LIVE</span>
                  <span className="text-slate-300">{selectedCam.location}</span>
                </div>
                <div className="bg-black/70 px-2 py-1 rounded text-[10px] font-mono text-emerald-400">
                  PING: {selectedCam.lastPing} &bull; HEALTH: {selectedCam.healthScore}%
                </div>
              </div>

              {/* Central Video Graphic */}
              <div className="text-center my-auto">
                <Camera className="w-12 h-12 text-cyan-400/80 mx-auto mb-2 animate-pulse" />
                <span className="text-sm font-bold text-slate-100 block font-mono">
                  ENCRYPTED GUARDIAN STREAM
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  IP: {selectedCam.ipAddress} &bull; WebRTC Direct Peer-to-Peer
                </span>
              </div>

              {/* OSD Bottom Telemetry */}
              <div className="flex items-center justify-between bg-black/70 p-2 rounded text-[10px] font-mono text-slate-300 z-10">
                <span>ZOOM: {ptzZoom}x DIGITAL PTZ</span>
                <span>PROTECTION: AES-256 GCM SECURE</span>
              </div>
            </div>

            {/* PTZ Quick Controls */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                <Sliders className="w-4 h-4 text-cyan-500" />
                Kontrol Digital PTZ &amp; Zoom:
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 4].map(zoom => (
                  <button
                    key={zoom}
                    onClick={() => setPtzZoom(zoom)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      ptzZoom === zoom
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {zoom}x Zoom
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Channel Switcher List */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500" />
                DAFTAR SALURAN CCTV
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-500">11 Feeds Online</span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {CCTV_CHANNELS.map(cam => {
                const isSelected = selectedCam.id === cam.id;
                return (
                  <button
                    key={cam.id}
                    onClick={() => {
                      setSelectedCam(cam);
                      blackBoxRecorder.record({
                        moduleCode: 'R479',
                        eventType: 'ACTION',
                        severity: 'INFO',
                        details: `Switched Live CCTV feed to ${cam.id}`
                      });
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate">
                          {cam.id} &bull; {cam.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block truncate mt-0.5">
                        {cam.location}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 shrink-0">
                      {cam.resolution}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
