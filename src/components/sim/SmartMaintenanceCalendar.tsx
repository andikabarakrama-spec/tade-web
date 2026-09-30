import React, { useState } from 'react';
import { 
  Calendar, 
  Wrench, 
  Video, 
  Printer, 
  Wind, 
  Tv, 
  Laptop, 
  Wifi, 
  Gamepad2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Bell,
  Sparkles
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const SmartMaintenanceCalendar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const maintenanceItems = [
    { id: 'M1', asset: '8 Titik CCTV Koridor & Gerbang', type: 'CCTV', icon: Video, frequency: 'Bulanan', lastService: '2026-08-01', nextDue: '2026-09-01', status: 'HEALTHY', pj: 'Sarpras Pak Budi' },
    { id: 'M2', asset: 'Printer Epson L3210 Kantor TU', type: 'PRINTER', icon: Printer, frequency: '3 Bulanan', lastService: '2026-07-15', nextDue: '2026-10-15', status: 'HEALTHY', pj: 'Operator Mas Doni' },
    { id: 'M3', asset: '4 Unit AC Split Kelas A & B', type: 'AC', icon: Wind, frequency: '3 Bulanan', lastService: '2026-06-10', nextDue: '2026-09-10', status: 'UPCOMING', pj: 'Vendor Servis AC' },
    { id: 'M4', asset: 'Proyektor Ruang Audio Visual', type: 'PROJEKTOR', icon: Tv, frequency: '6 Bulanan', lastService: '2026-03-20', nextDue: '2026-09-20', status: 'UPCOMING', pj: 'Staff IT' },
    { id: 'M5', asset: '6 Unit Laptop Inventaris Guru', type: 'LAPTOP', icon: Laptop, frequency: 'Bulanan (Update OS)', lastService: '2026-08-10', nextDue: '2026-09-10', status: 'HEALTHY', pj: 'Guru Pendamping' },
    { id: 'M6', asset: 'Router MikroTik & Access Point', type: 'ROUTER', icon: Wifi, frequency: 'Bulanan (Reboot/Config)', lastService: '2026-08-01', nextDue: '2026-09-01', status: 'HEALTHY', pj: 'Staff IT' },
    { id: 'M7', asset: 'Mainan Edukasi (APE Outdoor/Indoor)', type: 'TOYS', icon: Gamepad2, frequency: '2 Mingguan (Sanitasi)', lastService: '2026-08-14', nextDue: '2026-08-28', status: 'HEALTHY', pj: 'Tim Kebersihan' }
  ];

  const filtered = selectedCategory === 'ALL' 
    ? maintenanceItems 
    : maintenanceItems.filter(i => i.type === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 dark:bg-amber-400/10 rounded-2xl border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 font-mono">
                  R520 &bull; ASSET LIFECYCLE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 font-mono">
                  AI ASY REMINDER
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Smart Maintenance Calendar
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Jadwal perawatan preventif sarana &amp; prasarana sekolah (CCTV, Printer, AC, Proyektor, Laptop, Router, APE).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-pink-50 dark:bg-slate-700/50 p-2.5 rounded-2xl border border-pink-200 dark:border-slate-700 text-pink-700 dark:text-pink-300">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>AI Asy: <strong>2 Aset Menjelang Servis</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {['ALL', 'CCTV', 'PRINTER', 'AC', 'PROJEKTOR', 'LAPTOP', 'ROUTER', 'TOYS'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl transition-all border ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asset Maintenance List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-500" />
          Daftar Jadwal Pemeliharaan Sarana &amp; Prasarana ({filtered.length} Aset)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {filtered.map(item => {
            const Icon = item.icon;
            const isUpcoming = item.status === 'UPCOMING';
            return (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.asset}</h4>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
                      <div>Frekuensi: {item.frequency} &bull; PJ: {item.pj}</div>
                      <div>Servis Lalu: {item.lastService}</div>
                      <div className="font-bold text-slate-700 dark:text-slate-200">Jadwal Berikutnya: {item.nextDue}</div>
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  isUpcoming 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200' 
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                }`}>
                  {isUpcoming ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
