import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Users, 
  Video, 
  Calendar, 
  CheckSquare, 
  Layers, 
  Wrench, 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Thermometer, 
  Volume2, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Download,
  Share2,
  Printer
} from 'lucide-react';
import { CAMPUS_ROOMS, CampusRoom } from './DigitalTwinCampusCenter';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface RoomChecklist {
  id: string;
  item: string;
  category: 'SAFETY' | 'HYGIENE' | 'CURRICULUM' | 'FACILITY';
  status: 'DONE' | 'PENDING';
  checkedBy: string;
  time: string;
}

const DEFAULT_CHECKLIST: RoomChecklist[] = [
  { id: 'CHK-01', item: 'Sterilisasi Meja & Media APE Edukasi', category: 'HYGIENE', status: 'DONE', checkedBy: 'Ibu Maryam', time: '06:45 WIB' },
  { id: 'CHK-02', item: 'Kotak P3K & Obat Darurat Lengkap', category: 'SAFETY', status: 'DONE', checkedBy: 'Uks Guard', time: '07:00 WIB' },
  { id: 'CHK-03', item: 'Pendingin Udara (AC) & Filter HEPA 24°C', category: 'FACILITY', status: 'DONE', checkedBy: 'Pak Bambang', time: '07:05 WIB' },
  { id: 'CHK-04', item: 'Buku Jurnal Presensi & Lembar Observasi Sentra', category: 'CURRICULUM', status: 'DONE', checkedBy: 'Guru Sentra', time: '07:15 WIB' },
  { id: 'CHK-05', item: 'Kamera CCTV & Mikrofon Sensor Aktif', category: 'SAFETY', status: 'DONE', checkedBy: 'Guardian Bot', time: '07:20 WIB' },
  { id: 'CHK-06', item: 'Tempat Sampah Kering & Basah Bersih Terpisah', category: 'HYGIENE', status: 'DONE', checkedBy: 'Ibu Maryam', time: '07:25 WIB' }
];

export const LivingRoomIntelligence: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('ROOM_BALOK');
  const [checklist, setChecklist] = useState<RoomChecklist[]>(DEFAULT_CHECKLIST);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const currentRoom = CAMPUS_ROOMS.find(r => r.id === selectedRoomId) || CAMPUS_ROOMS[0];

  const handleToggleChecklist = (id: string) => {
    setChecklist(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: c.status === 'DONE' ? 'PENDING' : 'DONE',
              time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
            }
          : c
      )
    );
    blackBoxRecorder.record({
      moduleCode: 'R476',
      eventType: 'ACTION',
      severity: 'INFO',
      details: `Checklist ${id} updated for room ${currentRoom.code}`
    });
  };

  const doneCount = checklist.filter(c => c.status === 'DONE').length;
  const readinessPercent = Math.round((doneCount / checklist.length) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R476 &bull; LIVING ROOM INTELLIGENCE
          </span>
          <span className="text-xs text-slate-400 font-mono">360° Comprehensive Room Diagnostics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Building2 className="w-8 h-8 text-cyan-400" />
          Living Room Intelligence &bull; Pusat Diagnostik Ruangan
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Pusat pemantauan 360 derajat kondisi sentra dan ruangan: guru piket, jumlah santri aktif, live feed CCTV, jadwal rotasi sentra, checklist sanitasi &amp; P3K, log inventaris sarpras, hingga verifikasi QR lokasi fisik.
        </p>

        {/* Room Switcher Pills */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {CAMPUS_ROOMS.map(room => (
            <button
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                selectedRoomId === room.id
                  ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {room.code} - {room.name.replace('Sentra ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Core Room Profile & Live Telemetry */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                PROFIL RUANGAN AKTIF
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                {currentRoom.code}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentRoom.name}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Kategori: {currentRoom.category} &bull; TK Asy Syifa
              </span>
            </div>

            {/* Room Live Video CCTV Frame */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-3 text-white">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 bg-rose-600/90 text-white text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {currentRoom.cctvChannel}
                </span>
                <span className="text-[9px] font-mono bg-black/60 px-2 py-0.5 rounded text-emerald-400">
                  ● 30 FPS &bull; LOW LATENCY
                </span>
              </div>
              <div className="text-center py-4">
                <Video className="w-8 h-8 text-cyan-400 mx-auto mb-1 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">Real-Time Sensor Telemetry</span>
                <span className="text-[10px] text-slate-400 block font-serif italic">"{currentRoom.lastActivity}"</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/40 p-1.5 rounded">
                <span>🌡️ Suhu: {currentRoom.temperature}</span>
                <span>🔊 Kebisingan: 42 dB (Tenang)</span>
              </div>
            </div>

            {/* Teacher & Students Metric */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-500" />
                  <span className="text-slate-600 dark:text-slate-300">Guru Bertugas:</span>
                </div>
                <strong className="text-slate-900 dark:text-white font-sans text-xs">
                  {currentRoom.teacherInCharge}
                </strong>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Santri Terdaftar:</span>
                </div>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentRoom.studentsCount} / {currentRoom.maxCapacity} Anak
                </strong>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span className="text-slate-600 dark:text-slate-300">Skor Kebersihan:</span>
                </div>
                <strong className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {currentRoom.cleanliness} (100%)
                </strong>
              </div>
            </div>

            {/* QR Location Trigger */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              Tampilkan QR Presensi &amp; Akses Ruangan
            </button>
          </div>
        </div>

        {/* Column 2: Readiness Checklist & Sanitation */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-500" />
                  CHECKLIST KESIAPAN &amp; SANITASI
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Standar Operasional Prosedur Harian</span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                readinessPercent === 100
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {readinessPercent}% SIAP
              </span>
            </div>

            {/* Checklist Items List */}
            <div className="space-y-2.5">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    item.status === 'DONE'
                      ? 'bg-slate-50/80 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700'
                      : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.status === 'DONE'}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${
                      item.status === 'DONE'
                        ? 'text-slate-700 dark:text-slate-200'
                        : 'text-amber-900 dark:text-amber-200'
                    }`}>
                      {item.item}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>Pemeriksa: {item.checkedBy}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Summary Notice */}
            <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-900 dark:text-cyan-200 font-mono">
              ✓ Seluruh item kesiapan telah diverifikasi otomatis oleh sistem verifikasi sensor IoT &amp; Kepala Sekolah.
            </div>
          </div>
        </div>

        {/* Column 3: Daily Schedule & Asset Tracking */}
        <div className="space-y-6">
          {/* Daily Schedule Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                JADWAL AKTIVITAS SENTRA
              </h3>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                Hari Ini
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { time: '07:30 - 08:00', event: 'Penyambutan Santri & Senam Ceria', active: false },
                { time: '08:00 - 08:30', event: 'Sholat Dhuha & Doa Bersama di Aula', active: false },
                { time: '08:30 - 09:45', event: `Pijakan Main Sentra & Eksplorasi: ${currentRoom.name.replace('Sentra ', '')}`, active: true },
                { time: '09:45 - 10:15', event: 'Recalling, Beres-Beres & Cuci Tangan', active: false },
                { time: '10:15 - 10:45', event: 'Makan Snack Sehat Bersama', active: false },
                { time: '10:45 - 11:00', event: 'Penjemputan & Doa Pulang', active: false }
              ].map((sch, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    sch.active
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-mono">{sch.time}</span>
                  <span className="text-xs truncate">{sch.event}</span>
                  {sch.active && (
                    <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                      SEDANG BERLANGSUNG
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Asset & Maintenance Status */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-500" />
                STATUS ASET &amp; PEMELIHARAAN
              </h3>
              <span className="text-xs font-mono text-emerald-500 font-bold">100% Prima</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">MEDIA APE</span>
                <strong className="text-slate-800 dark:text-slate-200 text-xs">Lengkap (100%)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">AC &amp; SIRKULASI</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-xs">Sejuk 24°C</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">PENERANGAN</span>
                <strong className="text-cyan-600 dark:text-cyan-400 text-xs">LED Terang</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">JADWAL SERVIS</span>
                <strong className="text-purple-600 dark:text-purple-400 text-xs">28 Agt 2026</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Location Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                QR CODE LOKASI RUANGAN
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono font-bold"
              >
                TUTUP ✕
              </button>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <QrCode className="w-36 h-36 text-cyan-600 dark:text-cyan-400 mb-2" />
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                TK-ASY-{currentRoom.code}-2026
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentRoom.name}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
              Pindai QR ini melalui aplikasi SIM Guru untuk validasi kehadiran di ruangan atau verifikasi lokasi santri.
            </p>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-mono text-xs font-bold cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
