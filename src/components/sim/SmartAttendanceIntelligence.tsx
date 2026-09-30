import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Filter,
  Flame,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';

interface ClassAttendanceSummary {
  id: string;
  name: string;
  totalStudents: number;
  presentToday: number;
  lateToday: number;
  sickToday: number;
  absentToday: number;
  attendanceRate: number;
}

interface AttendanceDayHeatmap {
  day: string;
  rate: number;
  presentCount: number;
  lateCount: number;
}

export const SmartAttendanceIntelligence: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'WEEK' | 'MONTH' | 'SEMESTER'>('WEEK');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  const classData: ClassAttendanceSummary[] = [
    { id: 'TKA1', name: 'Sentra Balok - TK A1 (Abu Bakar)', totalStudents: 24, presentToday: 24, lateToday: 0, sickToday: 0, absentToday: 0, attendanceRate: 100 },
    { id: 'TKA2', name: 'Sentra Bahan Alam - TK A2 (Umar)', totalStudents: 25, presentToday: 24, lateToday: 1, sickToday: 1, absentToday: 0, attendanceRate: 96.0 },
    { id: 'TKB1', name: 'Sentra Imtaq - TK B1 (Utsman)', totalStudents: 26, presentToday: 25, lateToday: 1, sickToday: 1, absentToday: 0, attendanceRate: 96.2 },
    { id: 'TKB2', name: 'Sentra Seni - TK B2 (Ali)', totalStudents: 25, presentToday: 25, lateToday: 0, sickToday: 0, absentToday: 0, attendanceRate: 100 },
    { id: 'KB', name: 'Kelompok Bermain (Thalhah)', totalStudents: 22, presentToday: 20, lateToday: 2, sickToday: 2, absentToday: 0, attendanceRate: 90.9 }
  ];

  const weeklyHeatmap: AttendanceDayHeatmap[] = [
    { day: 'Senin', rate: 98.4, presentCount: 120, lateCount: 2 },
    { day: 'Selasa', rate: 99.2, presentCount: 121, lateCount: 1 },
    { day: 'Rabu', rate: 97.5, presentCount: 119, lateCount: 3 },
    { day: 'Kamis', rate: 98.4, presentCount: 120, lateCount: 1 },
    { day: 'Jumat', rate: 96.7, presentCount: 118, lateCount: 4 }
  ];

  const filteredClasses = selectedClass === 'ALL'
    ? classData
    : classData.filter(c => c.id === selectedClass);

  const totalStudentsAll = classData.reduce((acc, c) => acc + c.totalStudents, 0);
  const totalPresentToday = classData.reduce((acc, c) => acc + c.presentToday, 0);
  const totalLateToday = classData.reduce((acc, c) => acc + c.lateToday, 0);
  const totalSickToday = classData.reduce((acc, c) => acc + c.sickToday, 0);
  const overallRate = ((totalPresentToday / totalStudentsAll) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Smart Attendance Intelligence</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                Analytics & Insights
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Analitik presensi cerdas: tren kehadiran mingguan, heatmap disiplin siswa, rincian per kelas sentra, dan deteksi pola keterlambatan otomatis.
            </p>
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {(['WEEK', 'MONTH', 'SEMESTER'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedPeriod === p
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === 'WEEK' && 'Minggu Ini'}
                {p === 'MONTH' && 'Bulan Ini'}
                {p === 'SEMESTER' && 'Semester Gasal'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Tingkat Kehadiran Hari Ini</span>
          <div className="text-2xl font-black text-emerald-600">{overallRate}%</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {totalPresentToday} dari {totalStudentsAll} Siswa Hadir
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Siswa Datang Tepat Waktu</span>
          <div className="text-2xl font-black text-slate-800">{totalPresentToday - totalLateToday} Siswa</div>
          <span className="text-[10px] text-slate-500 font-medium">96.7% Disiplin sebelum 07:30 WIB</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Keterlambatan Hari Ini</span>
          <div className="text-2xl font-black text-amber-600">{totalLateToday} Siswa</div>
          <span className="text-[10px] text-amber-600 font-medium">Rata-rata 8 menit (kondisi jalan)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Izin / Sakit Terverifikasi</span>
          <div className="text-2xl font-black text-indigo-600">{totalSickToday} Siswa</div>
          <span className="text-[10px] text-slate-500 font-medium">Surat dokter & WhatsApp tersinkron</span>
        </div>
      </div>

      {/* Heatmap Presensi Mingguan */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Heatmap Distribusi Kehadiran Mingguan (Senin - Jumat)
            </h2>
            <p className="text-[11px] text-slate-500">
              Visualisasi persentase kehadiran dan rasio ketepatan waktu per hari aktif belajar.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
            Rata-rata Pekan: 98.0%
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3 pt-2">
          {weeklyHeatmap.map((item) => (
            <div key={item.day} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
              <span className="text-xs font-bold text-slate-700">{item.day}</span>
              <div className="text-xl font-black text-emerald-600 font-mono">{item.rate}%</div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${item.rate}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <div>Hadir: {item.presentCount}</div>
                <div className="text-amber-600 font-medium">Telat: {item.lateCount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rincian Presensi Kelas Sentra */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Ringkasan Kehadiran Kelas Sentra & Kelompok Bermain
          </h2>

          <select
            aria-label="Filter Kelas"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Semua Kelas ({classData.length})</option>
            {classData.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-800">{cls.name}</div>
                <div className="text-slate-500 text-[11px] flex items-center gap-3">
                  <span>Kapasitas: {cls.totalStudents} Siswa</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">Hadir: {cls.presentToday}</span>
                  <span>•</span>
                  <span className="text-amber-700 font-medium">Telat: {cls.lateToday}</span>
                  <span>•</span>
                  <span className="text-indigo-700 font-medium">Izin/Sakit: {cls.sickToday}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-600 font-mono">{cls.attendanceRate}%</div>
                  <span className="text-[10px] text-slate-400 font-medium">Capaian Kelas</span>
                </div>
                <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${cls.attendanceRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Generated AI Insight */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-emerald-900">Insight Otomatis Presensi & Disiplin Siswa</div>
          <p className="text-emerald-800 leading-relaxed">
            Tingkat kehadiran siswa konsisten berada di atas target standar institusi (&gt;95%). Keterlambatan tertinggi terjadi pada hari Jumat pagi akibat kepadatan lalu lintas; disarankan broadcast pengingat berangkat 15 menit lebih awal pada hari Kamis petang.
          </p>
        </div>
      </div>
    </div>
  );
};
