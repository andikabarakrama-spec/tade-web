import React, { useState } from 'react';
import { 
  Building2, 
  Eye, 
  Video, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Layers, 
  Compass, 
  Activity, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  Maximize2,
  RefreshCw,
  Search,
  Thermometer,
  Zap,
  Volume2
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export interface CampusRoom {
  id: string;
  name: string;
  category: 'SENTRA' | 'ADMIN' | 'PUBLIC' | 'SERVICE';
  code: string;
  teacherInCharge: string;
  studentsCount: number;
  maxCapacity: number;
  cctvChannel: string;
  readinessScore: number;
  status: 'ACTIVE' | 'READY' | 'CLEANING' | 'IDLE';
  temperature: string;
  lastActivity: string;
  coordinates: { x: number; y: number; width: number; height: number };
  assetsCount: number;
  cleanliness: 'PRISTINE' | 'GOOD' | 'NEEDS_ATTENTION';
  color: string;
}

export const CAMPUS_ROOMS: CampusRoom[] = [
  {
    id: 'ROOM_GERBANG',
    name: 'Gerbang Utama & Pos Keamanan',
    category: 'PUBLIC',
    code: 'SEC-01',
    teacherInCharge: 'Pak Satpam Ahmad',
    studentsCount: 0,
    maxCapacity: 50,
    cctvChannel: 'CAM-01 (Gate HD)',
    readinessScore: 100,
    status: 'ACTIVE',
    temperature: '28°C',
    lastActivity: 'Pemeriksaan QR Wali Murid',
    coordinates: { x: 5, y: 75, width: 25, height: 20 },
    assetsCount: 6,
    cleanliness: 'PRISTINE',
    color: 'emerald'
  },
  {
    id: 'ROOM_PARKIR',
    name: 'Area Drop-off & Parkir Santri',
    category: 'PUBLIC',
    code: 'PKG-01',
    teacherInCharge: 'Pak Mamat (Koord. Lapangan)',
    studentsCount: 0,
    maxCapacity: 40,
    cctvChannel: 'CAM-02 (Parking 360)',
    readinessScore: 98,
    status: 'ACTIVE',
    temperature: '29°C',
    lastActivity: 'Lalu Lintas Penjemputan Tertib',
    coordinates: { x: 35, y: 75, width: 30, height: 20 },
    assetsCount: 4,
    cleanliness: 'GOOD',
    color: 'cyan'
  },
  {
    id: 'ROOM_KANTOR',
    name: 'Kantor Tata Usaha & Kepala Sekolah',
    category: 'ADMIN',
    code: 'ADM-01',
    teacherInCharge: 'Ibu Hj. Siti Rahma, S.Pd (Kepsek)',
    studentsCount: 0,
    maxCapacity: 15,
    cctvChannel: 'CAM-03 (Admin Office)',
    readinessScore: 100,
    status: 'ACTIVE',
    temperature: '24°C',
    lastActivity: 'Penerbitan Surat Keputusan Digital',
    coordinates: { x: 5, y: 40, width: 25, height: 30 },
    assetsCount: 18,
    cleanliness: 'PRISTINE',
    color: 'purple'
  },
  {
    id: 'ROOM_AULA',
    name: 'Aula Serbaguna & Sholat Dhuha',
    category: 'PUBLIC',
    code: 'AUL-01',
    teacherInCharge: 'Ustadz Farid (Kesiswaan)',
    studentsCount: 48,
    maxCapacity: 100,
    cctvChannel: 'CAM-04 (Main Hall PTZ)',
    readinessScore: 100,
    status: 'ACTIVE',
    temperature: '25°C',
    lastActivity: 'Hafalan Surat Pendek & Doa Pagi',
    coordinates: { x: 35, y: 35, width: 30, height: 35 },
    assetsCount: 12,
    cleanliness: 'PRISTINE',
    color: 'amber'
  },
  {
    id: 'ROOM_BALOK',
    name: 'Sentra Balok & Konstruksi Kreatif',
    category: 'SENTRA',
    code: 'SNT-01',
    teacherInCharge: 'Ibu Nisa, S.Pd',
    studentsCount: 15,
    maxCapacity: 20,
    cctvChannel: 'CAM-05 (Balok Area)',
    readinessScore: 100,
    status: 'ACTIVE',
    temperature: '24°C',
    lastActivity: 'Membangun Replika Masjid Nabawi',
    coordinates: { x: 70, y: 5, width: 25, height: 28 },
    assetsCount: 35,
    cleanliness: 'PRISTINE',
    color: 'blue'
  },
  {
    id: 'ROOM_PERSIAPAN',
    name: 'Sentra Persiapan & Literasi Calistung',
    category: 'SENTRA',
    code: 'SNT-02',
    teacherInCharge: 'Ibu Fatimah, S.Pd.I',
    studentsCount: 16,
    maxCapacity: 20,
    cctvChannel: 'CAM-06 (Persiapan)',
    readinessScore: 100,
    status: 'ACTIVE',
    temperature: '24°C',
    lastActivity: 'Pengenalan Huruf Hijaiyah & Angka',
    coordinates: { x: 70, y: 37, width: 25, height: 28 },
    assetsCount: 28,
    cleanliness: 'PRISTINE',
    color: 'indigo'
  },
  {
    id: 'ROOM_SENI',
    name: 'Sentra Seni, Musik & Kreativitas',
    category: 'SENTRA',
    code: 'SNT-03',
    teacherInCharge: 'Ibu Zahra, S.Sn',
    studentsCount: 14,
    maxCapacity: 20,
    cctvChannel: 'CAM-07 (Art Studio)',
    readinessScore: 98,
    status: 'ACTIVE',
    temperature: '25°C',
    lastActivity: 'Mewarnai Kaligrafi & Kolase Daun',
    coordinates: { x: 70, y: 69, width: 25, height: 26 },
    assetsCount: 22,
    cleanliness: 'GOOD',
    color: 'rose'
  },
  {
    id: 'ROOM_MAIN_PERAN',
    name: 'Sentra Main Peran Makro & Mikro',
    category: 'SENTRA',
    code: 'SNT-04',
    teacherInCharge: 'Ibu Diana, S.Pd',
    studentsCount: 15,
    maxCapacity: 20,
    cctvChannel: 'CAM-08 (Roleplay Area)',
    readinessScore: 100,
    status: 'ACTIVE',
    temperature: '24°C',
    lastActivity: 'Simulasi Dokter Cilik & Apotek',
    coordinates: { x: 35, y: 5, width: 30, height: 26 },
    assetsCount: 30,
    cleanliness: 'PRISTINE',
    color: 'emerald'
  },
  {
    id: 'ROOM_BAHAN_ALAM',
    name: 'Sentra Bahan Alam & Sains Eksplorasi',
    category: 'SENTRA',
    code: 'SNT-05',
    teacherInCharge: 'Ibu Dewi, M.Pd',
    studentsCount: 12,
    maxCapacity: 20,
    cctvChannel: 'CAM-09 (Nature Lab)',
    readinessScore: 96,
    status: 'ACTIVE',
    temperature: '26°C',
    lastActivity: 'Eksperimen Mencampur Warna Air',
    coordinates: { x: 5, y: 5, width: 25, height: 31 },
    assetsCount: 19,
    cleanliness: 'GOOD',
    color: 'teal'
  },
  {
    id: 'ROOM_TOILET',
    name: 'Toilet Ramah Anak & Tempat Wudhu',
    category: 'SERVICE',
    code: 'SVC-01',
    teacherInCharge: 'Ibu Maryam (Staff Kebersihan)',
    studentsCount: 2,
    maxCapacity: 10,
    cctvChannel: 'CAM-10 (Corridor Access)',
    readinessScore: 100,
    status: 'READY',
    temperature: '26°C',
    lastActivity: 'Sanitasi & Sterilisasi Terjadwal',
    coordinates: { x: 70, y: 97, width: 12, height: 1 }, // Virtual footer block
    assetsCount: 8,
    cleanliness: 'PRISTINE',
    color: 'sky'
  },
  {
    id: 'ROOM_GUDANG',
    name: 'Gudang Sarpras & Bank Inventaris',
    category: 'SERVICE',
    code: 'SVC-02',
    teacherInCharge: 'Pak Bambang (Sarpras)',
    studentsCount: 0,
    maxCapacity: 5,
    cctvChannel: 'CAM-11 (Storage Security)',
    readinessScore: 100,
    status: 'IDLE',
    temperature: '26°C',
    lastActivity: 'Pemeriksaan Stok Kertas & ATK',
    coordinates: { x: 83, y: 97, width: 12, height: 1 },
    assetsCount: 45,
    cleanliness: 'PRISTINE',
    color: 'slate'
  }
];

export const DigitalTwinCampusCenter: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<CampusRoom>(CAMPUS_ROOMS[0]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'2D_MAP' | 'BENTO_GRID'>('2D_MAP');
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);

  const handleSelectRoom = (room: CampusRoom) => {
    setSelectedRoom(room);
    blackBoxRecorder.record({
      moduleCode: 'R475',
      eventType: 'ACTION',
      severity: 'INFO',
      details: `Digital Twin inspected room: ${room.name} (${room.code})`
    });
  };

  const filteredRooms = filterCategory === 'ALL'
    ? CAMPUS_ROOMS
    : CAMPUS_ROOMS.filter(r => r.category === filterCategory);

  const totalStudentsInCampus = CAMPUS_ROOMS.reduce((acc, curr) => acc + curr.studentsCount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Building2 className="w-56 h-56 text-cyan-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R475 &bull; DIGITAL TWIN CAMPUS CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">Living Operations Command &bull; TK Asy Syifa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-cyan-400" />
              Peta Hidup Digital Twin Kampus
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Visualisasi kembar digital real-time seluruh gedung dan sentra belajar TK Asy Syifa. Terhubung secara dua arah dengan CCTV, presensi santri, status AC/suhu, kesiapan sarpras, dan asisten navigasi Asy AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setViewMode(viewMode === '2D_MAP' ? 'BENTO_GRID' : '2D_MAP')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center gap-2 border border-slate-700 cursor-pointer transition-colors"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              {viewMode === '2D_MAP' ? 'Tampilan Grid Bento' : 'Tampilan Peta 2D'}
            </button>
            <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 text-center">
              <span className="text-[10px] font-mono text-cyan-300 block">SISWA DI KAMPUS</span>
              <strong className="text-sm font-bold text-white font-mono flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-emerald-400" /> {totalStudentsInCampus} Siswa
              </strong>
            </div>
          </div>
        </div>

        {/* Quick Global Metrics */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL RUANGAN &amp; SENTRA</span>
            <span className="text-xl font-bold text-white font-mono">11 Area</span>
            <span className="text-[9px] text-cyan-400 block">100% Terpetakan</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">CCTV INTEGRATED</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">11 Feeds Live</span>
            <span className="text-[9px] text-emerald-500 block">30 FPS WebRTC</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">KESIAPAN KELAS RATA-RATA</span>
            <span className="text-xl font-bold text-purple-400 font-mono">99.4%</span>
            <span className="text-[9px] text-purple-400 block">Standar Akreditasi A</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">DIGITAL TWIN STATUS</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">LIVING SYNC</span>
            <span className="text-[9px] text-emerald-400 block">Latensi 12ms</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {[
          { id: 'ALL', label: 'Semua Ruangan (11)' },
          { id: 'SENTRA', label: 'Sentra Belajar (5)' },
          { id: 'ADMIN', label: 'Kantor & Manajemen (1)' },
          { id: 'PUBLIC', label: 'Area Publik & Aula (3)' },
          { id: 'SERVICE', label: 'Sarpras & Fasilitas (2)' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === cat.id
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 2D Campus Map / Floorplan View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  MASTER FLOORPLAN LAYOUT (DENAH KAMPUS HIDUP)
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                ● LIVE TELEMETRY
              </span>
            </div>

            {viewMode === '2D_MAP' ? (
              /* Interactive SVG/Grid Denah Kampus */
              <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-3 select-none">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none" />

                {/* Campus Zones */}
                <div className="relative w-full h-full">
                  {CAMPUS_ROOMS.map(room => {
                    const isSelected = selectedRoom.id === room.id;
                    const coords = room.coordinates;

                    return (
                      <div
                        key={room.id}
                        onClick={() => handleSelectRoom(room)}
                        style={{
                          left: `${coords.x}%`,
                          top: `${coords.y}%`,
                          width: `${coords.width}%`,
                          height: `${coords.height}%`
                        }}
                        className={`absolute rounded-xl p-2.5 transition-all cursor-pointer flex flex-col justify-between border ${
                          isSelected
                            ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/30 z-20 scale-[1.02]'
                            : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/80 hover:border-slate-500 z-10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {room.code}
                          </span>
                          {room.studentsCount > 0 && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {room.studentsCount} 👦
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-[11px] font-bold text-white line-clamp-1 leading-tight">
                            {room.name.replace('Sentra ', 'S. ')}
                          </h4>
                          <span className="text-[9px] text-slate-400 line-clamp-1 font-mono">
                            {room.teacherInCharge.split(' ')[0]} {room.teacherInCharge.split(' ')[1] || ''}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                          <span className="flex items-center gap-0.5 text-cyan-300">
                            <Video className="w-2.5 h-2.5" /> Live
                          </span>
                          <span>{room.temperature}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Bento Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredRooms.map(room => {
                  const isSelected = selectedRoom.id === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => handleSelectRoom(room)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {room.code} &bull; {room.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {room.readinessScore}% Siap
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        {room.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        Penanggung Jawab: {room.teacherInCharge}
                      </p>
                      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        <span>👥 {room.studentsCount} / {room.maxCapacity} Siswa</span>
                        <span>🌡️ {room.temperature}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>*Klik salah satu ruangan pada denah untuk membuka Living Room Intelligence.</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">11 Ruangan Aktif Terhubung</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Room Living Details Card */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 block">
                  LIVING ROOM TELEMETRY
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedRoom.name}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {selectedRoom.code}
              </span>
            </div>

            {/* Room Live Stream Preview Simulation */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-rose-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE FEED &bull; {selectedRoom.cctvChannel}
              </div>
              <div className="absolute bottom-2 right-2 text-white/80 font-mono text-[9px] bg-black/60 px-2 py-0.5 rounded">
                60 FPS &bull; {selectedRoom.temperature}
              </div>
              <div className="text-center p-4">
                <Video className="w-10 h-10 text-slate-600 mx-auto mb-1 animate-pulse" />
                <span className="text-xs text-slate-400 font-mono block">WebRTC Live Stream Secure</span>
                <span className="text-[10px] text-slate-500 font-serif italic">"{selectedRoom.lastActivity}"</span>
              </div>
            </div>

            {/* Detail Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">GURU BERTUGAS</span>
                <strong className="text-slate-900 dark:text-white text-[11px] block truncate">
                  {selectedRoom.teacherInCharge}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">POPULASI SANTRI</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-[11px] block">
                  {selectedRoom.studentsCount} / {selectedRoom.maxCapacity} Anak
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">TOTAL ASET TERCATAT</span>
                <strong className="text-purple-600 dark:text-purple-400 text-[11px] block">
                  {selectedRoom.assetsCount} Perangkat Terlacak
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">STATUS KEBERSIHAN</span>
                <strong className="text-cyan-600 dark:text-cyan-400 text-[11px] block">
                  {selectedRoom.cleanliness} (100%)
                </strong>
              </div>
            </div>

            {/* Asy Mascot Room Guide Callout */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-purple-900 dark:text-purple-300 font-bold text-xs font-mono">
                <Bot className="w-4 h-4 text-purple-500" />
                Catatan Asisten Cerdas Asy:
              </div>
              <p className="text-xs text-purple-950 dark:text-purple-100 italic leading-snug font-serif">
                “Ruangan {selectedRoom.name} beroperasi optimal. Seluruh santri antusias mengikuti kegiatan {selectedRoom.lastActivity}. Suhu ruangan terjaga sejuk di {selectedRoom.temperature}.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
