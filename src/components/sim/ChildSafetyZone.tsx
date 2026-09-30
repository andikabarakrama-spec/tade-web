import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Eye,
  Camera,
  Activity,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface SafetyZone {
  id: string;
  name: string;
  category: 'STUDENT_SAFE' | 'RESTRICTED' | 'PERIMETER';
  operationalHours: string;
  activeCameras: string[];
  currentOccupancy: string;
  status: 'SAFE' | 'ALERT_OFF_HOURS' | 'BREACH';
  alertDescription?: string;
}

export const ChildSafetyZone: React.FC = () => {
  const [zones, setZones] = useState<SafetyZone[]>([
    {
      id: 'ZONE-01',
      name: 'Zona Gerbang Utama & Pos Satpam',
      category: 'PERIMETER',
      operationalHours: '06:30 – 17:00 WIB',
      activeCameras: ['CAM-01'],
      currentOccupancy: '1 Petugas Satpam',
      status: 'SAFE'
    },
    {
      id: 'ZONE-02',
      name: 'Zona Penjemputan Santri',
      category: 'STUDENT_SAFE',
      operationalHours: '07:00 – 16:30 WIB',
      activeCameras: ['CAM-02'],
      currentOccupancy: 'Steril / Kosong',
      status: 'SAFE'
    },
    {
      id: 'ZONE-03',
      name: 'Halaman Bermain Sentra Balok & Bahan Alam',
      category: 'STUDENT_SAFE',
      operationalHours: '07:30 – 15:00 WIB',
      activeCameras: ['CAM-03'],
      currentOccupancy: 'Steril / Kosong',
      status: 'SAFE'
    },
    {
      id: 'ZONE-04',
      name: 'Koridor Sentra & Ruang Kelas',
      category: 'STUDENT_SAFE',
      operationalHours: '07:00 – 16:00 WIB',
      activeCameras: ['CAM-04'],
      currentOccupancy: 'Steril / Kosong',
      status: 'SAFE'
    },
    {
      id: 'ZONE-05',
      name: 'Aula Sentra & Masjid Asy-Syifa',
      category: 'STUDENT_SAFE',
      operationalHours: '04:00 – 21:00 WIB',
      activeCameras: ['CAM-05'],
      currentOccupancy: 'Steril / Kosong',
      status: 'SAFE'
    },
    {
      id: 'ZONE-06',
      name: 'Gudang Arsip, Server & Genset (Zona Terlarang)',
      category: 'RESTRICTED',
      operationalHours: 'Akses Khusus / Terkunci 24/7',
      activeCameras: ['CAM-06'],
      currentOccupancy: 'Terkunci Digital WORM',
      status: 'SAFE'
    }
  ]);

  return (
    <div id="child-safety-zone-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R388 &bull; CHILD SAFETY ZONE
              </span>
              <span className="text-xs text-slate-400 font-mono">Geo-Spatial &amp; Camera-Fence Perimeter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              Zonasi Keselamatan Siswa &amp; Perimeter Kampus
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Memetakan zona ramah anak, perimeter penjemputan, dan area terbatas (Gudang Arsip/Server). Aktivitas di luar jam operasional otomatis memicu notifikasi siaga.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              6 ZONA TERLINDUNGI
            </span>
          </div>
        </div>
      </div>

      {/* Zone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-[10px] text-slate-400">{zone.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                zone.category === 'RESTRICTED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                zone.category === 'PERIMETER' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {zone.category}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {zone.name}
            </h3>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Jam Operasional:</span>
                <strong className="text-slate-700 dark:text-slate-300">{zone.operationalHours}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Kamera Pengawas:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{zone.activeCameras.join(', ')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Status Keberadaan:</span>
                <span>{zone.currentOccupancy}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-emerald-500 font-bold">
              <span>Status Keamanan:</span>
              <span>{zone.status} (NORMAL)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
