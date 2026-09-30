import React, { useState } from 'react';
import { 
  Laptop, 
  Printer, 
  Tv, 
  Wifi, 
  Wind, 
  Radio, 
  Camera, 
  ToyBrick, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Tag,
  Filter,
  Layers,
  Sparkles,
  QrCode
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export interface SchoolAsset {
  id: string;
  name: string;
  category: 'PRINTER' | 'PROYEKTOR' | 'LAPTOP' | 'AC' | 'MAINAN' | 'SPEAKER' | 'KAMERA' | 'ROUTER';
  assetCode: string;
  currentRoom: string;
  roomCode: string;
  personInCharge: string;
  condition: 'PRIMA' | 'BAIK' | 'PERLU_SERVIS';
  lastMoved: string;
  purchaseYear: number;
  qrHash: string;
}

const SCHOOL_ASSETS: SchoolAsset[] = [
  { id: 'AST-01', name: 'Printer Dokumen Ijazah Epson L3210', category: 'PRINTER', assetCode: 'PRN-ADM-01', currentRoom: 'Kantor Tata Usaha & Kepsek', roomCode: 'ADM-01', personInCharge: 'Ibu Siti Rahma', condition: 'PRIMA', lastMoved: '10 Agt 2026', purchaseYear: 2024, qrHash: 'SHA-AST-PRN-01' },
  { id: 'AST-02', name: 'Proyektor Mini Edukasi Epson EB-E500', category: 'PROYEKTOR', assetCode: 'PRJ-AUL-01', currentRoom: 'Aula Serbaguna', roomCode: 'AUL-01', personInCharge: 'Ustadz Farid', condition: 'PRIMA', lastMoved: '12 Agt 2026', purchaseYear: 2024, qrHash: 'SHA-AST-PRJ-01' },
  { id: 'AST-03', name: 'Laptop Asus ExpertBook SIM Admin', category: 'LAPTOP', assetCode: 'LPT-ADM-01', currentRoom: 'Kantor Tata Usaha & Kepsek', roomCode: 'ADM-01', personInCharge: 'Operator SIM', condition: 'PRIMA', lastMoved: '14 Agt 2026', purchaseYear: 2025, qrHash: 'SHA-AST-LPT-01' },
  { id: 'AST-04', name: 'Laptop Guru Sentra Lenovo ThinkPad', category: 'LAPTOP', assetCode: 'LPT-SNT-01', currentRoom: 'Sentra Persiapan', roomCode: 'SNT-02', personInCharge: 'Ibu Fatimah', condition: 'PRIMA', lastMoved: '15 Agt 2026', purchaseYear: 2025, qrHash: 'SHA-AST-LPT-02' },
  { id: 'AST-05', name: 'AC Daikin Inverter 1.5 PK Sentra Balok', category: 'AC', assetCode: 'AC-SNT-01', currentRoom: 'Sentra Balok', roomCode: 'SNT-01', personInCharge: 'Pak Bambang', condition: 'PRIMA', lastMoved: 'Permanen', purchaseYear: 2024, qrHash: 'SHA-AST-AC-01' },
  { id: 'AST-06', name: 'Set Balok Konstruksi Kayu Jati 200 Pcs', category: 'MAINAN', assetCode: 'APE-BLK-01', currentRoom: 'Sentra Balok', roomCode: 'SNT-01', personInCharge: 'Ibu Nisa', condition: 'PRIMA', lastMoved: '01 Agt 2026', purchaseYear: 2024, qrHash: 'SHA-AST-APE-01' },
  { id: 'AST-07', name: 'Alat Musik Rebana & Angklung Edukasi', category: 'MAINAN', assetCode: 'APE-MSK-01', currentRoom: 'Sentra Seni & Musik', roomCode: 'SNT-03', personInCharge: 'Ibu Zahra', condition: 'BAIK', lastMoved: '05 Agt 2026', purchaseYear: 2023, qrHash: 'SHA-AST-APE-02' },
  { id: 'AST-08', name: 'Portable Wireless Speaker PA System', category: 'SPEAKER', assetCode: 'SPK-AUL-01', currentRoom: 'Aula Serbaguna', roomCode: 'AUL-01', personInCharge: 'Ustadz Farid', condition: 'PRIMA', lastMoved: '14 Agt 2026', purchaseYear: 2025, qrHash: 'SHA-AST-SPK-01' },
  { id: 'AST-09', name: 'Kamera CCTV IP Dome Gate HD', category: 'KAMERA', assetCode: 'CAM-SEC-01', currentRoom: 'Gerbang Utama', roomCode: 'SEC-01', personInCharge: 'Pak Satpam Ahmad', condition: 'PRIMA', lastMoved: 'Permanen', purchaseYear: 2024, qrHash: 'SHA-AST-CAM-01' },
  { id: 'AST-10', name: 'Router Wi-Fi 6 Mesh Enterprise TP-Link', category: 'ROUTER', assetCode: 'NET-RTR-01', currentRoom: 'Kantor Tata Usaha & Kepsek', roomCode: 'ADM-01', personInCharge: 'Admin Jaringan', condition: 'PRIMA', lastMoved: 'Permanen', purchaseYear: 2025, qrHash: 'SHA-AST-RTR-01' }
];

export const SmartAssetLocator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<SchoolAsset>(SCHOOL_ASSETS[0]);

  const filteredAssets = SCHOOL_ASSETS.filter(asset => {
    const matchSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.currentRoom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || asset.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const getCategoryIcon = (category: SchoolAsset['category']) => {
    switch (category) {
      case 'PRINTER': return <Printer className="w-4 h-4 text-cyan-500" />;
      case 'PROYEKTOR': return <Tv className="w-4 h-4 text-purple-500" />;
      case 'LAPTOP': return <Laptop className="w-4 h-4 text-blue-500" />;
      case 'AC': return <Wind className="w-4 h-4 text-teal-500" />;
      case 'MAINAN': return <ToyBrick className="w-4 h-4 text-amber-500" />;
      case 'SPEAKER': return <Radio className="w-4 h-4 text-rose-500" />;
      case 'KAMERA': return <Camera className="w-4 h-4 text-emerald-500" />;
      case 'ROUTER': return <Wifi className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R480 &bull; SMART ASSET LOCATOR
          </span>
          <span className="text-xs text-slate-400 font-mono">Real-time Campus Inventory &amp; Location Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <MapPin className="w-8 h-8 text-cyan-400" />
          Smart Asset Locator &bull; Pelacak Aset Digital Kampus
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Lacak lokasi presisi seluruh inventaris elektronik, sarana APE, perlengkapan IT, pendingin ruangan (AC), proyektor, hingga sound system di seluruh ruangan TK Asy Syifa dengan pemindaian QR digital.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama aset, kode, atau lokasi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs font-mono">
          {['ALL', 'LAPTOP', 'PRINTER', 'PROYEKTOR', 'AC', 'MAINAN', 'SPEAKER', 'KAMERA', 'ROUTER'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Asset Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Asset Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAssets.map(asset => {
            const isSelected = selectedAsset.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => {
                  setSelectedAsset(asset);
                  blackBoxRecorder.record({
                    moduleCode: 'R480',
                    eventType: 'ACTION',
                    severity: 'INFO',
                    details: `Inspected asset: ${asset.name} (${asset.assetCode})`
                  });
                }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-md'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {getCategoryIcon(asset.category)}
                    {asset.assetCode}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {asset.condition}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{asset.currentRoom}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span>PJ: {asset.personInCharge}</span>
                  <span>Tahun: {asset.purchaseYear}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Selected Asset Detail */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                DETAIL LOKASI &amp; IDENTITAS ASET
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                {selectedAsset.assetCode}
              </span>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <QrCode className="w-28 h-28 text-cyan-600 dark:text-cyan-400 mx-auto mb-2" />
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                {selectedAsset.qrHash}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Terverifikasi Digital Registry TK Asy Syifa
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 block">NAMA PERANGKAT</span>
                <strong className="text-slate-900 dark:text-white text-xs">{selectedAsset.name}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 block">LOKASI TERAKHIR</span>
                <strong className="text-cyan-600 dark:text-cyan-400 text-xs">{selectedAsset.currentRoom} ({selectedAsset.roomCode})</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 block">PENANGGUNG JAWAB</span>
                <strong className="text-slate-900 dark:text-white text-xs">{selectedAsset.personInCharge}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
