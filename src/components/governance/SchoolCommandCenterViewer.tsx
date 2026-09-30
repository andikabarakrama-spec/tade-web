import React, { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, DollarSign, Activity, AlertCircle, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const SchoolCommandCenterViewer: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<'ALL' | 'PAUD_A' | 'PAUD_B' | 'SENTRA'>('ALL');

  return (
    <div id="school-command-center-root" className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
              <LayoutDashboard className="w-4 h-4" /> R853 • Pusat Komando Terpadu
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">School Command Center</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Pusat kendali holistik seluruh unit PAUD/TK: santri, tenaga pendidik, aktivitas sentra, keuangan kas, dan status kedisiplinan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-xl text-center backdrop-blur-sm border border-white/10">
              <div className="text-[11px] text-slate-300">Indeks Kesiapan Sekolah</div>
              <div className="text-2xl font-black text-emerald-400">99.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid 4 Vital Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Santri Hadir</div>
            <div className="text-2xl font-black text-slate-900">142 <span className="text-xs font-normal text-slate-500">/ 145</span></div>
            <div className="text-[11px] text-emerald-600 font-semibold">97.9% Tingkat Kehadiran</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Capaian RPPH</div>
            <div className="text-2xl font-black text-slate-900">100%</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Semua Sentra Siap</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Kas Operasional</div>
            <div className="text-2xl font-black text-slate-900">Rp 48.2M</div>
            <div className="text-[11px] text-blue-600 font-semibold">SSoT Rekonsiliasi Klop</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Status Keamanan</div>
            <div className="text-2xl font-black text-purple-700">RING-0</div>
            <div className="text-[11px] text-purple-600 font-semibold">Zero Incident Reported</div>
          </div>
        </div>
      </div>

      {/* Operational Matrix & Real-time Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Matriks Kesiapan Sentra Pembelajaran
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Semua Sentra Normal
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Sentra Ibadah & Tahfidz', teacher: 'Ustadzah Nurul', progress: 95, target: 'Hafalan An-Nas s/d Al-Falaq' },
              { name: 'Sentra Balok & Rancang Bangun', teacher: 'Ustadz Fajar', progress: 100, target: 'Konstruksi Masjid Mini' },
              { name: 'Sentra Seni & Kreativitas', teacher: 'Ustadzah Dewi', progress: 90, target: 'Kolase Daun Kering' },
              { name: 'Sentra Bahan Alam & Sains', teacher: 'Ustadzah Rahma', progress: 100, target: 'Percobaan Terapung Tenggelam' }
            ].map((sentra, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-800">{sentra.name}</div>
                  <div className="text-[11px] text-slate-500">Pendidik: {sentra.teacher} • Topik: {sentra.target}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sentra.progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-9 text-right">{sentra.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Agenda Penting Hari Ini
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
              <div className="font-bold">08:30 WIB - Mutabaah Pagi Bersama</div>
              <div className="text-blue-700 text-[11px] mt-0.5">Seluruh rombel PAUD A & B di Masjid Sekolah</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
              <div className="font-bold">10:00 WIB - Snack Sehat & Makan Buah</div>
              <div className="text-emerald-700 text-[11px] mt-0.5">Edukasi gizi & adab makan Islami</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-purple-900">
              <div className="font-bold">11:30 WIB - Penjemputan Santri & Story Share</div>
              <div className="text-purple-700 text-[11px] mt-0.5">Sinkronisasi status kepulangan ke wali murid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
