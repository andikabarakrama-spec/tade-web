import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Layers
} from 'lucide-react';

export const CampusCommandCenter: React.FC<{ onSelectModule?: (code: string) => void }> = ({ onSelectModule }) => {
  const [refreshing, setRefreshing] = useState(false);

  const activities = [
    { time: '07:30 WIB', label: 'Penyambutan Santri Pagi & Doa Bersama', category: 'AKADEMIK', status: 'SELESAI' },
    { time: '08:15 WIB', label: 'Setoran Hafalan Surah An-Naba Kelompok B2', category: 'TAHFIDZ', status: 'BERJALAN' },
    { time: '09:00 WIB', label: 'Snack Sehat Sentra Bermain Kreatif', category: 'KEGIATAN', status: 'AKAN_DATANG' },
    { time: '10:30 WIB', label: 'Pemeriksaan Kesehatan Gigi Berkala Puskesmas', category: 'KESEHATAN', status: 'AKAN_DATANG' }
  ];

  const priorityAlerts = [
    { id: 'ALT-01', title: '3 Permohonan Izin Sakit Santri Menunggu Validasi', level: 'HIGH', time: '10m lalu' },
    { id: 'ALT-02', title: 'Stok Kertas Thermal Kasir Resepsionis Menipis (<2 Roll)', level: 'MEDIUM', time: '25m lalu' },
    { id: 'ALT-03', title: 'Snapshot Backup Otomatis Terverifikasi SHA-256', level: 'INFO', time: '1j lalu' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Campus Command Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Hub Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat kendali operasional harian: pantauan kehadiran real-time, transaksi SPP kasir, aktivitas sentra, dan peringatan prioritas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Sabtu, 15 Agustus 2026</span>
        </div>
      </div>

      {/* Real-time KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kehadiran Santri:</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">96.8%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            238 dari 246 Hadir Tepat Waktu
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Penerimaan SPP Hari Ini:</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">Rp 8.450.000</div>
          <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            17 Transaksi (14 VA, 3 Kasir POS)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kehadiran Guru & Staf:</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">100%</div>
          <div className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
            18/18 Guru Standby di Kelas
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Status Sistem & Hardware:</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">A+ Optimal</div>
          <div className="text-[11px] text-slate-500 font-medium">
            Latensi 19ms • Offline Ready
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Agenda & Aktivitas Hari Ini */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Linimasa Agenda Sentra & Pembelajaran Hari Ini
            </h2>
            <span className="text-xs text-slate-400 font-mono">Real-time Stream</span>
          </div>

          <div className="space-y-3">
            {activities.map((act, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-700 bg-slate-200/70 px-2 py-1 rounded text-[11px]">
                    {act.time}
                  </span>
                  <div>
                    <div className="font-bold text-slate-800">{act.label}</div>
                    <span className="text-[10px] text-slate-400 font-semibold">{act.category}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    act.status === 'SELESAI'
                      ? 'bg-emerald-100 text-emerald-800'
                      : act.status === 'BERJALAN'
                      ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Notifikasi Prioritas */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              Peringatan Prioritas
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
              {priorityAlerts.length} Item
            </span>
          </div>

          <div className="space-y-3">
            {priorityAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      alert.level === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : alert.level === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alert.level}
                  </span>
                  <span className="text-[10px] text-slate-400">{alert.time}</span>
                </div>
                <p className="font-semibold text-slate-800 leading-snug">{alert.title}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectModule && onSelectModule('r152')}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
          >
            Buka Notification Hub <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
