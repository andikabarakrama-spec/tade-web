import React, { useState } from 'react';
import {
  Layers,
  Activity,
  Users,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Server,
  Zap,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export const SchoolOperatingDashboard: React.FC<{ onSelectModule?: (code: string) => void }> = ({ onSelectModule }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'NORMAL'>('ALL');

  const todaySummary = {
    totalStudents: 246,
    presentStudents: 239,
    attendanceRate: '97.2%',
    teacherCount: 18,
    presentTeachers: 18,
    activeClasses: 8,
    systemHealth: '100% Optimal',
    latency: '16ms'
  };

  const activities = [
    { time: '07:15 WIB', title: 'Penyambutan Santri di Gerbang & Pemeriksaan Suhu', status: 'COMPLETED', type: 'ROUTINE' },
    { time: '08:00 WIB', title: 'Shalat Dhuha Berjamaah & Murojaah Juz 30', status: 'COMPLETED', type: 'IBADAH' },
    { time: '09:00 WIB', title: 'Sentra Persiapan & Sentra Bahan Alam Berlangsung', status: 'IN_PROGRESS', type: 'ACADEMIC' },
    { time: '11:00 WIB', title: 'Makan Siang Sehat & Toilet Training Mandiri', status: 'UPCOMING', type: 'HEALTH' },
    { time: '13:00 WIB', title: 'Penjemputan Santri & Laporan Buku Penghubung', status: 'UPCOMING', type: 'LOGISTICS' }
  ];

  const microserviceStatus = [
    { service: 'Core Database & Firestore Sync', status: 'ONLINE', latency: '12ms', icon: Server },
    { service: 'WhatsApp Gateway Dispatcher', status: 'ONLINE', latency: '45ms', icon: Zap },
    { service: 'Biometric & RFID Ingress Reader', status: 'ONLINE', latency: '8ms', icon: Activity },
    { service: 'Automated Accounting Ledger POS', status: 'ONLINE', latency: '15ms', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">School Operating Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                OS Kernel Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat orkestrasi operasional sekolah: pantauan ekosistem harian, status kehadiran terpadu, linimasa sentra, dan kesehatan microservice.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
            Latensi: {todaySummary.latency}
          </span>
        </div>
      </div>

      {/* Top 4 Operational Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Presensi Santri Hari Ini:</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{todaySummary.attendanceRate}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {todaySummary.presentStudents} / {todaySummary.totalStudents} Santri Hadir
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kesiapan Guru & Pendidik:</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">100%</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {todaySummary.presentTeachers} Guru Bertugas di {todaySummary.activeClasses} Sentra
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Agenda Pembelajaran:</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">5 Sesi</div>
          <div className="text-[11px] text-slate-500 font-medium">
            2 Selesai • 1 Aktif • 2 Mendatang
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Infrastruktur & Layanan:</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-600">{todaySummary.systemHealth}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            Semua Microservice Beroperasi Normal
          </div>
        </div>
      </div>

      {/* Grid: Activities Timeline & Service Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Activities Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Linimasa Operasional & Aktivitas Kampus Hari Ini
            </h2>
            <span className="text-xs text-slate-400 font-mono">Sinkron Real-time</span>
          </div>

          <div className="space-y-3">
            {activities.map((act, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-700 bg-slate-200/80 px-2 py-1 rounded text-[11px]">
                    {act.time}
                  </span>
                  <div>
                    <div className="font-bold text-slate-800">{act.title}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{act.type}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    act.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : act.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800 animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Service Diagnostics */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            Status Microservice Inti
          </h2>

          <div className="space-y-3">
            {microserviceStatus.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Icon className="w-3.5 h-3.5 text-blue-600" />
                      <span>{srv.service}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      {srv.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Response Time: {srv.latency}</div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sovereign Guard Engine</span>
            <span className="text-emerald-600 font-bold">100% Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
