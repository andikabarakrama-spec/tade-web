import React, { useState } from 'react';
import { 
  Activity, 
  Flame, 
  ShieldCheck, 
  Video, 
  Bell, 
  Users, 
  EyeOff, 
  Lock, 
  TrendingUp, 
  Layers, 
  Clock, 
  Sparkles,
  Info,
  Building2,
  Filter
} from 'lucide-react';
import { CAMPUS_ROOMS, CampusRoom } from './DigitalTwinCampusCenter';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface HeatMapZone {
  roomId: string;
  roomName: string;
  roomCode: string;
  activityLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'REST';
  densityScore: number; // 0 - 100
  occupancyCount: number;
  noiseDb: number;
  activeCameras: number;
  anomalyFlag: boolean;
  statusText: string;
}

const HEATMAP_DATA: HeatMapZone[] = [
  { roomId: 'ROOM_AULA', roomName: 'Aula Serbaguna', roomCode: 'AUL-01', activityLevel: 'HIGH', densityScore: 92, occupancyCount: 48, noiseDb: 64, activeCameras: 2, anomalyFlag: false, statusText: 'Kegiatan Sholat Dhuha & Doa Bersama' },
  { roomId: 'ROOM_BALOK', roomName: 'Sentra Balok', roomCode: 'SNT-01', activityLevel: 'HIGH', densityScore: 85, occupancyCount: 15, noiseDb: 58, activeCameras: 1, anomalyFlag: false, statusText: 'Konstruksi & Kolaborasi Balok Kayu' },
  { roomId: 'ROOM_PERSIAPAN', roomName: 'Sentra Persiapan', roomCode: 'SNT-02', activityLevel: 'MEDIUM', densityScore: 74, occupancyCount: 16, noiseDb: 46, activeCameras: 1, anomalyFlag: false, statusText: 'Literasi Menulis & Membaca Kartu Huruf' },
  { roomId: 'ROOM_MAIN_PERAN', roomName: 'Sentra Main Peran', roomCode: 'SNT-04', activityLevel: 'MEDIUM', densityScore: 70, occupancyCount: 15, noiseDb: 52, activeCameras: 1, anomalyFlag: false, statusText: 'Simulasi Bermain Peran Sosial' },
  { roomId: 'ROOM_SENI', roomName: 'Sentra Seni & Musik', roomCode: 'SNT-03', activityLevel: 'MEDIUM', densityScore: 68, occupancyCount: 14, noiseDb: 55, activeCameras: 1, anomalyFlag: false, statusText: 'Prakarya Melukis & Mewarnai' },
  { roomId: 'ROOM_BAHAN_ALAM', roomName: 'Sentra Bahan Alam', roomCode: 'SNT-05', activityLevel: 'LOW', densityScore: 45, occupancyCount: 12, noiseDb: 40, activeCameras: 1, anomalyFlag: false, statusText: 'Eksplorasi Tekstur Biji-bijian & Air' },
  { roomId: 'ROOM_KANTOR', roomName: 'Kantor Tata Usaha', roomCode: 'ADM-01', activityLevel: 'LOW', densityScore: 30, occupancyCount: 4, noiseDb: 35, activeCameras: 1, anomalyFlag: false, statusText: 'Administrasi & Layanan Yayasan' },
  { roomId: 'ROOM_PARKIR', roomName: 'Area Parkir & Drop-off', roomCode: 'PKG-01', activityLevel: 'LOW', densityScore: 22, occupancyCount: 3, noiseDb: 45, activeCameras: 2, anomalyFlag: false, statusText: 'Arus Lalu Lintas Penjemputan Tenang' },
  { roomId: 'ROOM_GERBANG', roomName: 'Gerbang Utama', roomCode: 'SEC-01', activityLevel: 'LOW', densityScore: 18, occupancyCount: 2, noiseDb: 42, activeCameras: 1, anomalyFlag: false, statusText: 'Penjagaan Pos Satpam Aktif' },
  { roomId: 'ROOM_TOILET', roomName: 'Toilet & Wudhu', roomCode: 'SVC-01', activityLevel: 'REST', densityScore: 10, occupancyCount: 2, noiseDb: 30, activeCameras: 0, anomalyFlag: false, statusText: 'Sanitasi & Kebersihan Terjaga' },
  { roomId: 'ROOM_GUDANG', roomName: 'Gudang Sarpras', roomCode: 'SVC-02', activityLevel: 'REST', densityScore: 5, occupancyCount: 0, noiseDb: 25, activeCameras: 1, anomalyFlag: false, statusText: 'Penyimpanan Tertutup Aman' }
];

export const CampusHeatMap: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'BUSY' | 'CALM'>('ALL');
  const [heatData, setHeatData] = useState<HeatMapZone[]>(HEATMAP_DATA);

  const filteredData = heatData.filter(zone => {
    if (selectedFilter === 'BUSY') return zone.activityLevel === 'HIGH' || zone.activityLevel === 'MEDIUM';
    if (selectedFilter === 'CALM') return zone.activityLevel === 'LOW' || zone.activityLevel === 'REST';
    return true;
  });

  const getHeatColor = (density: number) => {
    if (density >= 80) return 'from-rose-500/80 to-amber-500/80 border-rose-500 text-rose-500';
    if (density >= 60) return 'from-amber-500/80 to-yellow-500/80 border-amber-500 text-amber-500';
    if (density >= 30) return 'from-cyan-500/80 to-blue-500/80 border-cyan-500 text-cyan-500';
    return 'from-emerald-500/80 to-teal-500/80 border-emerald-500 text-emerald-500';
  };

  const getDensityBadge = (level: HeatMapZone['activityLevel']) => {
    switch (level) {
      case 'HIGH':
        return <span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold">🔥 AREA SIBUK TINGGI</span>;
      case 'MEDIUM':
        return <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold">⚡ AKTIVITAS SEDANG</span>;
      case 'LOW':
        return <span className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold">🌊 AREA TENANG</span>;
      case 'REST':
        return <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold">💤 STANDBY / ISTIRAHAT</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R478 &bull; CAMPUS HEAT MAP
          </span>
          <span className="text-xs text-slate-400 font-mono">Privacy-Preserving Activity &amp; Density Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Flame className="w-8 h-8 text-rose-400 animate-pulse" />
          Peta Kepadatan &amp; Heat Map Aktivitas Kampus
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Visualisasi cerdas tingkat keramaian, persebaran santri, level kebisingan desibel, dan status kamera aktif di seluruh gedung TK Asy Syifa. Dirancang dengan prinsip ketat pelindung privasi data anak (Zero Face Identification, Agregasi Numerik Terenkripsi).
        </p>

        {/* Privacy Guarantee Pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>GARANSI PRIVASI 100%: Tanpa Perekaman Wajah Individual &bull; Hanya Agregasi Sensor Otomatis</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-cyan-600 font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Semua Area ({heatData.length})
          </button>
          <button
            onClick={() => setSelectedFilter('BUSY')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === 'BUSY'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Area Sibuk &amp; Ramai ({heatData.filter(z => z.activityLevel === 'HIGH' || z.activityLevel === 'MEDIUM').length})
          </button>
          <button
            onClick={() => setSelectedFilter('CALM')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === 'CALM'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Area Tenang ({heatData.filter(z => z.activityLevel === 'LOW' || z.activityLevel === 'REST').length})
          </button>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Update Otomatis: Setiap 5 Detik</span>
        </div>
      </div>

      {/* Heat Map Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map(zone => (
          <div
            key={zone.roomId}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {zone.roomCode}
              </span>
              {getDensityBadge(zone.activityLevel)}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {zone.roomName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
                "{zone.statusText}"
              </p>
            </div>

            {/* Density Progress Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Skor Kepadatan Aktivitas</span>
                <span className="font-bold text-slate-900 dark:text-white">{zone.densityScore}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    zone.densityScore >= 80
                      ? 'from-amber-500 to-rose-500'
                      : zone.densityScore >= 50
                      ? 'from-cyan-500 to-amber-500'
                      : 'from-emerald-400 to-cyan-500'
                  }`}
                  style={{ width: `${zone.densityScore}%` }}
                />
              </div>
            </div>

            {/* Sensor Telemetry Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 block">SANTRI</span>
                <strong className="text-slate-900 dark:text-white font-bold">{zone.occupancyCount} Anak</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 block">SUARA</span>
                <strong className="text-purple-600 dark:text-purple-400 font-bold">{zone.noiseDb} dB</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 block">CCTV FEED</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{zone.activeCameras} Live</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
