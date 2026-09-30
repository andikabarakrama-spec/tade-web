import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Layers,
  Search,
  QrCode,
  Building,
  Sparkles,
  Info,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

export const DigitalCampusMap: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>('ALL');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const locations = [
    {
      id: 'LOC-01',
      name: 'Ruang Kelas TK-A (Al-Fatih)',
      zone: 'KELAS',
      floor: 'Lantai 1',
      qrCode: 'QR-LOC-TKA-01',
      desc: 'Ruang pembelajaran sentra persiapan & ibadah santri usia 4-5 tahun.',
      facilities: ['AC', 'Smart TV', 'CCTV 24 Jam', 'Pojok Baca'],
      coords: { x: 25, y: 35 }
    },
    {
      id: 'LOC-02',
      name: 'Ruang Kelas TK-B (Shalahuddin)',
      zone: 'KELAS',
      floor: 'Lantai 1',
      qrCode: 'QR-LOC-TKB-02',
      desc: 'Ruang kelas pembelajaran kelompok usia 5-6 tahun sentra sains.',
      facilities: ['AC', 'Smart Display', 'CCTV 24 Jam', 'Wastafel Cuci Tangan'],
      coords: { x: 45, y: 35 }
    },
    {
      id: 'LOC-03',
      name: 'Kantor Tata Usaha & Kepala Sekolah',
      zone: 'KANTOR',
      floor: 'Lantai 1',
      qrCode: 'QR-LOC-ADM-01',
      desc: 'Pusat layanan administrasi sekolah, verifikasi SPP, dan ruang pimpinan.',
      facilities: ['Resepsionis', 'Ruang Tamu', 'Kasir POS', 'Workstation Guru'],
      coords: { x: 75, y: 30 }
    },
    {
      id: 'LOC-04',
      name: 'Mushola Utama Asy-Syukriyyah',
      zone: 'MUSHOLA',
      floor: 'Lantai 1',
      qrCode: 'QR-LOC-MSH-01',
      desc: 'Tempat ibadah shalat dhuha bersama, praktik wudhu, dan hafalan Al-Quran.',
      facilities: ['Tempat Wudhu Anak', 'Karpet Empuk', 'Sound System', 'Rak Al-Quran'],
      coords: { x: 20, y: 70 }
    },
    {
      id: 'LOC-05',
      name: 'Toilet Santri & Fasilitas Ramah Anak',
      zone: 'TOILET',
      floor: 'Lantai 1 & 2',
      qrCode: 'QR-LOC-TLT-01',
      desc: 'Toilet higienis bersanitasi ramah anak dengan pegangan keselamatan.',
      facilities: ['Kloset Anak', 'Kran Sensor', 'Sabun Antiseptik', 'Lantai Anti-Slip'],
      coords: { x: 60, y: 70 }
    },
    {
      id: 'LOC-06',
      name: 'Gerbang Utama & Pos Titik Presensi QR',
      zone: 'QR_POINT',
      floor: 'Lantai 1 (Pintu Masuk)',
      qrCode: 'QR-LOC-GATE-01',
      desc: 'Titik check-in presensi RFID dan scan barcode kedatangan santri/tamu.',
      facilities: ['Scanner Barcode', 'CCTV Wajah', 'Pos Satpam', 'Thermal Scanner'],
      coords: { x: 85, y: 80 }
    }
  ];

  const filteredLocations = activeZone === 'ALL'
    ? locations
    : locations.filter(loc => loc.zone === activeZone);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl border border-cyan-100">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Digital Campus Map</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
                Peta Kampus Interaktif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Navigasi digital area sekolah: direktori ruang kelas, kantor tata usaha, mushola, toilet ramah anak, dan titik scan QR.
            </p>
          </div>
        </div>

        {/* Zone Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'Semua Area' },
            { id: 'KELAS', label: 'Ruang Kelas' },
            { id: 'KANTOR', label: 'Kantor & TU' },
            { id: 'MUSHOLA', label: 'Mushola' },
            { id: 'TOILET', label: 'Toilet' },
            { id: 'QR_POINT', label: 'Titik QR' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveZone(filter.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeZone === filter.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map View & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Floor Plan Canvas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-600" />
              Denah Layout Kampus Terpadu (Lantai 1)
            </h2>
            <span className="text-xs text-slate-400 font-mono">Klik titik untuk detail</span>
          </div>

          {/* Simulated Interactive Blueprint Canvas */}
          <div className="relative w-full h-80 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-center p-4">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Building Zones Outline */}
            <div className="absolute inset-8 border-2 border-dashed border-cyan-500/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Gedung Utama Asy-Syukriyyah
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-right">
                Pintu Masuk Selatan
              </div>
            </div>

            {/* Render Location Pins */}
            {filteredLocations.map(loc => {
              const isSelected = selectedPoint?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedPoint(loc)}
                  style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 z-10 ${
                    isSelected
                      ? 'bg-cyan-500 text-white ring-4 ring-cyan-400/40 scale-110 shadow-lg'
                      : 'bg-slate-800/90 text-cyan-400 border border-cyan-500/50 hover:scale-105 hover:bg-cyan-900/60'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold whitespace-nowrap">{loc.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Dukungan Lazy Loading & Offline Map Tiles</span>
            <span className="font-mono">Resolusi Vektor Adaptif</span>
          </div>
        </div>

        {/* Location Detail Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-600" />
            Detail Titik Lokasi
          </h2>

          {selectedPoint ? (
            <div className="space-y-4 text-xs animate-fadeIn">
              <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl space-y-1">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-200 text-cyan-800">
                  {selectedPoint.zone}
                </span>
                <h3 className="font-bold text-slate-800 text-sm">{selectedPoint.name}</h3>
                <p className="text-slate-500 text-[11px] font-mono">{selectedPoint.floor}</p>
              </div>

              <p className="text-slate-600 leading-relaxed">{selectedPoint.desc}</p>

              <div className="space-y-2">
                <span className="font-bold text-slate-700">Fasilitas Tersedia:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPoint.facilities.map((fac: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Kode QR Lokasi</div>
                  <div className="font-mono font-bold text-slate-800">{selectedPoint.qrCode}</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-cyan-600">
                  <QrCode className="w-5 h-5" />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Pilih salah satu titik lokasi pada denah kampus untuk melihat informasi lengkap dan kode QR.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
