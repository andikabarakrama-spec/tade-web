import React, { useState } from 'react';
import {
  DoorClosed,
  QrCode,
  Video,
  Car,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Check,
  ShieldCheck,
  Sparkles,
  Camera
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface GateEntryRecord {
  id: string;
  visitorName: string;
  purpose: string;
  qrVerified: boolean;
  vehiclePlate: string;
  vehicleType: 'MOTOR' | 'MOBIL' | 'JALAN_KAKI';
  timeIn: string;
  timeOut: string | null;
  gateCameraSnapshot: string;
  status: 'AUTHORIZED' | 'UNAUTHORIZED_ENTRY' | 'ACTIVE_INSIDE';
}

export const GateGuardianProtocol: React.FC = () => {
  const [entries, setEntries] = useState<GateEntryRecord[]>([
    {
      id: 'GATE-2026-0816-01',
      visitorName: 'H. Bambang Irawan (Tamu Yayasan)',
      purpose: 'Silaturahmi & Rapat Donatur Gedung TPA',
      qrVerified: true,
      vehiclePlate: 'P 1928 AB',
      vehicleType: 'MOBIL',
      timeIn: '09:15 WIB',
      timeOut: '11:30 WIB',
      gateCameraSnapshot: 'CAM-01-GERBANG #10291',
      status: 'AUTHORIZED'
    },
    {
      id: 'GATE-2026-0816-02',
      visitorName: 'Ibu Ratna Kumala (Wali Murid Santri TK A)',
      purpose: 'Konsultasi Perkembangan Sentra Balok',
      qrVerified: true,
      vehiclePlate: 'P 3481 YZ',
      vehicleType: 'MOTOR',
      timeIn: '10:00 WIB',
      timeOut: '10:45 WIB',
      gateCameraSnapshot: 'CAM-01-GERBANG #10452',
      status: 'AUTHORIZED'
    },
    {
      id: 'GATE-2026-0816-03',
      visitorName: 'Subjek Tidak Dikenal (Helm Full Face)',
      purpose: 'Tidak Mengisi Buku Tamu / Tidak Scan QR',
      qrVerified: false,
      vehiclePlate: 'Tanpa Plat Depan',
      vehicleType: 'MOTOR',
      timeIn: '14:23 WIB',
      timeOut: '14:31 WIB',
      gateCameraSnapshot: 'CAM-01-GERBANG #11204',
      status: 'UNAUTHORIZED_ENTRY'
    }
  ]);

  return (
    <div id="gate-guardian-protocol-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R387 &bull; GATE GUARDIAN PROTOCOL
              </span>
              <span className="text-xs text-slate-400 font-mono">CCTV &amp; Digital Guest Book Synchronization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <DoorClosed className="w-8 h-8 text-cyan-400" />
              Protokol Perlindungan Gerbang &amp; Buku Tamu QR
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Sinkronisasi otomatis antara kamera pengawas gerbang utama, pelat nomor kendaraan, dan verifikasi QR Buku Tamu Digital untuk mencegah akses tanpa izin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              GERBANG AKTIF &bull; TERINTEGRASI
            </span>
          </div>
        </div>
      </div>

      {/* Entry Records Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
              entry.status === 'UNAUTHORIZED_ENTRY'
                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400 dark:border-rose-800'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="font-bold text-slate-900 dark:text-white text-xs">{entry.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                entry.status === 'UNAUTHORIZED_ENTRY'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {entry.status}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Nama Tamu:</span>
                <strong className="text-slate-900 dark:text-white text-xs">{entry.visitorName}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Keperluan / Tujuan:</span>
                <span className="text-slate-600 dark:text-slate-300">{entry.purpose}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Verifikasi QR:</span>
                <strong className={entry.qrVerified ? 'text-emerald-500' : 'text-rose-500'}>
                  {entry.qrVerified ? 'TERVERIFIKASI' : 'TIDAK TERDAFTAR'}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Kendaraan:</span>
                <span>{entry.vehiclePlate} ({entry.vehicleType})</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Waktu Masuk / Keluar:</span>
                <span>{entry.timeIn} - {entry.timeOut || 'Di Lokasi'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
              <span>Snapshot: {entry.gateCameraSnapshot}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
