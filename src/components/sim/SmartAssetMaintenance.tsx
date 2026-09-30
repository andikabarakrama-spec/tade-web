import React, { useState } from 'react';
import {
  Wrench,
  Printer,
  Video,
  Laptop,
  Wind,
  Projector,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  Plus,
  RefreshCw
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface CampusAsset {
  id: string;
  name: string;
  category: 'CCTV' | 'PRINTER' | 'SCANNER' | 'LAPTOP' | 'AC' | 'PROYEKTOR' | 'MAINAN' | 'SANITASI';
  location: string;
  status: 'OPTIMAL' | 'SERVICE_DUE' | 'IN_REPAIR';
  lastServiceDate: string;
  nextServiceDate: string;
  serviceCycleDays: number;
  assignedTechnician: string;
}

export const SmartAssetMaintenance: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [assets] = useState<CampusAsset[]>([
    {
      id: 'AST-CCTV-01',
      name: 'Kamera Gerbang Hikvision ColorVu 4MP',
      category: 'CCTV',
      location: 'Tiang Utama Gerbang Timur',
      status: 'OPTIMAL',
      lastServiceDate: '10 Juli 2026',
      nextServiceDate: '10 Oktober 2026',
      serviceCycleDays: 90,
      assignedTechnician: 'Rian Hidayat, S.Kom.'
    },
    {
      id: 'AST-PRINT-01',
      name: 'Printer Epson L3210 (Cetak Raport & Surat)',
      category: 'PRINTER',
      location: 'Ruang Tata Usaha (TU)',
      status: 'OPTIMAL',
      lastServiceDate: '01 Agustus 2026',
      nextServiceDate: '01 September 2026',
      serviceCycleDays: 30,
      assignedTechnician: 'Staf TU'
    },
    {
      id: 'AST-SCAN-01',
      name: 'Scanner Flatbed Canon CanoScan LiDE 300',
      category: 'SCANNER',
      location: 'Ruang Arsip & Akreditasi',
      status: 'OPTIMAL',
      lastServiceDate: '15 Juni 2026',
      nextServiceDate: '15 September 2026',
      serviceCycleDays: 90,
      assignedTechnician: 'Staf TU'
    },
    {
      id: 'AST-LAPTOP-01',
      name: 'Laptop Asus Core i5 Server Mini SIM',
      category: 'LAPTOP',
      location: 'Ruang Operator SIM',
      status: 'OPTIMAL',
      lastServiceDate: '01 Juli 2026',
      nextServiceDate: '01 Oktober 2026',
      serviceCycleDays: 90,
      assignedTechnician: 'Rian Hidayat, S.Kom.'
    },
    {
      id: 'AST-AC-01',
      name: 'AC Daikin Inverter 1.5 PK',
      category: 'AC',
      location: 'Aula Sentra Balok & Imtaq',
      status: 'SERVICE_DUE',
      lastServiceDate: '15 Mei 2026',
      nextServiceDate: '15 Agustus 2026',
      serviceCycleDays: 90,
      assignedTechnician: 'Teknisi AC Berlangganan'
    },
    {
      id: 'AST-PROJ-01',
      name: 'Proyektor Epson EB-E500',
      category: 'PROYEKTOR',
      location: 'Aula Utama Pertemuan Wali',
      status: 'OPTIMAL',
      lastServiceDate: '20 Juni 2026',
      nextServiceDate: '20 September 2026',
      serviceCycleDays: 90,
      assignedTechnician: 'Rian Hidayat, S.Kom.'
    },
    {
      id: 'AST-TOY-01',
      name: 'Set Balok Kayu Sentra Bahan Alam (120 Pcs)',
      category: 'MAINAN',
      location: 'Ruang Sentra Bahan Alam',
      status: 'OPTIMAL',
      lastServiceDate: '05 Agustus 2026',
      nextServiceDate: '05 September 2026',
      serviceCycleDays: 30,
      assignedTechnician: 'Guru Sentra'
    },
    {
      id: 'AST-SAN-01',
      name: 'Instalasi Kran Wudhu & Toilet Santri',
      category: 'SANITASI',
      location: 'Area Wudhu Sentra Ibadah',
      status: 'OPTIMAL',
      lastServiceDate: '01 Agustus 2026',
      nextServiceDate: '15 Agustus 2026',
      serviceCycleDays: 14,
      assignedTechnician: 'Petugas Kebersihan'
    }
  ]);

  const filteredAssets = selectedCategory === 'ALL'
    ? assets
    : assets.filter(a => a.category === selectedCategory);

  return (
    <div id="smart-asset-maintenance-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R397 &bull; SMART ASSET MAINTENANCE CONSTITUTION
              </span>
              <span className="text-xs text-slate-400 font-mono">Automated Preventive Care &amp; Service Watch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Wrench className="w-8 h-8 text-cyan-400" />
              Pemeliharaan Pintar Seluruh Aset Kampus
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Memantau kelaikan 8 kategori aset sekolah (CCTV, Printer, Scanner, Laptop, AC, Proyektor, Mainan Sentra, dan Sanitasi) dengan jadwal servis berkala otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              {assets.length} ASET TERPANTAU
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs pb-1">
        {['ALL', 'CCTV', 'PRINTER', 'SCANNER', 'LAPTOP', 'AC', 'PROYEKTOR', 'MAINAN', 'SANITASI'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-[10px] text-slate-400">{asset.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                asset.status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {asset.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2">
              {asset.name}
            </h3>

            <div className="space-y-1 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Lokasi Penempatan:</span>
                <span className="text-slate-700 dark:text-slate-300">{asset.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Servis Terakhir:</span>
                <span>{asset.lastServiceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Servis Berikutnya:</span>
                <strong className="text-cyan-600 dark:text-cyan-400">{asset.nextServiceDate}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
              <span>PJ: {asset.assignedTechnician}</span>
              <span>Siklus: {asset.serviceCycleDays} Hari</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
