import React, { useState } from 'react';
import {
  Activity,
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  TrendingUp,
  ListChecks,
  ChevronRight
} from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  leadTeacher: string;
  totalStudents: number;
  presentStudents: number;
  activeSentra: string;
  sentraProgress: number;
  routineDone: boolean;
  notes: string;
}

export const DigitalClassroomPulse: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([
    {
      id: 'CLS-A1',
      name: 'Kelas TK A1 (Abu Bakar)',
      leadTeacher: 'Ustadzah Fatimah, S.Pd',
      totalStudents: 15,
      presentStudents: 15,
      activeSentra: 'Sentra Bahan Alam & Sains',
      sentraProgress: 85,
      routineDone: true,
      notes: 'Siswa antusias bereksplorasi dengan media air dan tekstur daun herbal.'
    },
    {
      id: 'CLS-A2',
      name: 'Kelas TK A2 (Umar bin Khattab)',
      leadTeacher: 'Ustadzah Aisyah, S.Pd.I',
      totalStudents: 15,
      presentStudents: 14,
      activeSentra: 'Sentra Balok & Konstruksi',
      sentraProgress: 75,
      routineDone: true,
      notes: '1 siswa izin sakit (demam). Eksplorasi geometri bangunan masjid.'
    },
    {
      id: 'CLS-B1',
      name: 'Kelas TK B1 (Utsman bin Affan)',
      leadTeacher: 'Ustadzah Maryam, M.Pd',
      totalStudents: 16,
      presentStudents: 16,
      activeSentra: 'Sentra Persiapan & Literasi Al-Qur’an',
      sentraProgress: 90,
      routineDone: true,
      notes: 'Pengenalan huruf hijaiyah berharakat dan murojaah Surat Al-Insyirah.'
    },
    {
      id: 'CLS-B2',
      name: 'Kelas TK B2 (Ali bin Abi Thalib)',
      leadTeacher: 'Ustadz Salman, S.Pd',
      totalStudents: 16,
      presentStudents: 15,
      activeSentra: 'Sentra Main Peran & Adab Islami',
      sentraProgress: 80,
      routineDone: true,
      notes: 'Simulasi adab bertamu dan berbagi makanan halal bersama teman.'
    }
  ]);

  const [selectedClassId, setSelectedClassId] = useState<string>('CLS-A1');
  const activeClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const toggleChecklist = (id: string) => {
    setClasses(classes.map(c => (c.id === id ? { ...c, routineDone: !c.routineDone } : c)));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Digital Classroom Pulse</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                Real-time Sentra Monitor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemantauan aktivitas kelas sentra secara digital: rasio kehadiran per kelas, progres pembelajaran sentra, dan catatan harian ustadz/ustadzah.
            </p>
          </div>
        </div>
      </div>

      {/* Classroom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          const attendancePercent = Math.round((cls.presentStudents / cls.totalStudents) * 100);

          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                isSelected
                  ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-200'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  {cls.id}
                </span>
                <span className="text-[11px] font-bold text-slate-600">
                  {cls.presentStudents}/{cls.totalStudents} Siswa ({attendancePercent}%)
                </span>
              </div>

              <div>
                <h2 className="font-bold text-slate-800 text-sm">{cls.name}</h2>
                <p className="text-[11px] text-slate-500">{cls.leadTeacher}</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Progres Sentra</span>
                  <span className="font-bold text-indigo-700">{cls.sentraProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${cls.sentraProgress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Focus Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Detail Pembelajaran: {activeClass.name}
            </h2>
            <p className="text-xs text-slate-500">
              Guru Penanggung Jawab: {activeClass.leadTeacher} • Sentra Aktif: {activeClass.activeSentra}
            </p>
          </div>

          <button
            onClick={() => toggleChecklist(activeClass.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeClass.routineDone
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {activeClass.routineDone ? 'Rutinitas Terverifikasi Selesai' : 'Verifikasi Rutinitas'}
          </button>
        </div>

        {/* 3 Columns: Attendance, Focus Target, Journal Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Rasio Kehadiran Kelas</span>
            <div className="text-2xl font-black text-slate-800">
              {activeClass.presentStudents} / {activeClass.totalStudents} Siswa
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              Kehadiran prima untuk kegiatan sentra hari ini.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Sentra & Capaian</span>
            <div className="text-base font-extrabold text-indigo-700">{activeClass.activeSentra}</div>
            <p className="text-[11px] text-slate-500 font-medium">
              Capaian modul: {activeClass.sentraProgress}% target pembelajaran tercapai.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Catatan Harian Pendidik</span>
            <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
              "{activeClass.notes}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
