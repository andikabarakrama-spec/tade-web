import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  UserCheck, 
  Users, 
  Sparkles, 
  HeartPulse, 
  ToyBrick, 
  Video, 
  Wind, 
  Sun, 
  RefreshCw, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface ClassroomReadinessItem {
  id: string;
  name: string;
  code: string;
  teacherPresent: boolean;
  studentsCount: number;
  expectedStudents: number;
  cleanliness: 'GREEN' | 'YELLOW' | 'RED';
  firstAidKit: 'GREEN' | 'YELLOW' | 'RED';
  toysMedia: 'GREEN' | 'YELLOW' | 'RED';
  cctvFeed: 'GREEN' | 'YELLOW' | 'RED';
  acStatus: 'GREEN' | 'YELLOW' | 'RED';
  lighting: 'GREEN' | 'YELLOW' | 'RED';
  overallScore: number;
}

const READINESS_DATA: ClassroomReadinessItem[] = [
  { id: 'R1', name: 'Sentra Balok', code: 'SNT-01', teacherPresent: true, studentsCount: 15, expectedStudents: 15, cleanliness: 'GREEN', firstAidKit: 'GREEN', toysMedia: 'GREEN', cctvFeed: 'GREEN', acStatus: 'GREEN', lighting: 'GREEN', overallScore: 100 },
  { id: 'R2', name: 'Sentra Persiapan', code: 'SNT-02', teacherPresent: true, studentsCount: 16, expectedStudents: 16, cleanliness: 'GREEN', firstAidKit: 'GREEN', toysMedia: 'GREEN', cctvFeed: 'GREEN', acStatus: 'GREEN', lighting: 'GREEN', overallScore: 100 },
  { id: 'R3', name: 'Sentra Seni & Musik', code: 'SNT-03', teacherPresent: true, studentsCount: 14, expectedStudents: 15, cleanliness: 'GREEN', firstAidKit: 'GREEN', toysMedia: 'GREEN', cctvFeed: 'GREEN', acStatus: 'YELLOW', lighting: 'GREEN', overallScore: 96 },
  { id: 'R4', name: 'Sentra Main Peran', code: 'SNT-04', teacherPresent: true, studentsCount: 15, expectedStudents: 15, cleanliness: 'GREEN', firstAidKit: 'GREEN', toysMedia: 'GREEN', cctvFeed: 'GREEN', acStatus: 'GREEN', lighting: 'GREEN', overallScore: 100 },
  { id: 'R5', name: 'Sentra Bahan Alam', code: 'SNT-05', teacherPresent: true, studentsCount: 12, expectedStudents: 12, cleanliness: 'GREEN', firstAidKit: 'GREEN', toysMedia: 'GREEN', cctvFeed: 'GREEN', acStatus: 'GREEN', lighting: 'GREEN', overallScore: 100 },
  { id: 'R6', name: 'Aula Serbaguna', code: 'AUL-01', teacherPresent: true, studentsCount: 48, expectedStudents: 50, cleanliness: 'GREEN', firstAidKit: 'GREEN', toysMedia: 'GREEN', cctvFeed: 'GREEN', acStatus: 'GREEN', lighting: 'GREEN', overallScore: 99 },
  { id: 'R7', name: 'Kantor Tata Usaha', code: 'ADM-01', teacherPresent: true, studentsCount: 0, expectedStudents: 0, cleanliness: 'GREEN', firstAidKit: 'GREEN', toysMedia: 'GREEN', cctvFeed: 'GREEN', acStatus: 'GREEN', lighting: 'GREEN', overallScore: 100 }
];

export const ClassroomReadinessLive: React.FC = () => {
  const [data, setData] = useState<ClassroomReadinessItem[]>(READINESS_DATA);

  const getStatusBadge = (status: 'GREEN' | 'YELLOW' | 'RED') => {
    switch (status) {
      case 'GREEN':
        return <span className="w-4 h-4 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/40" title="Siap Optimal (Hijau)" />;
      case 'YELLOW':
        return <span className="w-4 h-4 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/40" title="Perlu Perhatian (Kuning)" />;
      case 'RED':
        return <span className="w-4 h-4 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/40" title="Kritis / Belum Siap (Merah)" />;
    }
  };

  const averageScore = Math.round(data.reduce((acc, c) => acc + c.overallScore, 0) / data.length);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R481 &bull; CLASSROOM READINESS LIVE
          </span>
          <span className="text-xs text-slate-400 font-mono">8-Pillar Classroom Readiness Scoreboard</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
              Kesiapan Kelas &amp; Sentra Live Scoreboard
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Matriks pemantauan 8 pilar vital kesiapan setiap sentra belajar sebelum dan selama kegiatan KBM berlangsung: kehadiran guru, kehadiran santri, kebersihan, kelengkapan P3K, media APE, CCTV, AC, dan pencahayaan lampu.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 text-center shrink-0">
            <span className="text-[10px] font-mono text-cyan-300 block">RATA-RATA KESIAPAN KAMPUS</span>
            <span className="text-2xl font-bold text-white font-mono">{averageScore}%</span>
            <span className="text-[10px] text-emerald-400 block font-bold">STATUS: PRIMA (HIJAU)</span>
          </div>
        </div>
      </div>

      {/* Main Readiness Table Matrix */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              MATRIKS 8 PILAR KESIAPAN SENTRA &amp; KELAS
            </h3>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Siap (Hijau)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Waspada (Kuning)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> Kendala (Merah)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30">
                <th className="p-3">RUANGAN / SENTRA</th>
                <th className="p-3 text-center">GURU</th>
                <th className="p-3 text-center">SANTRI</th>
                <th className="p-3 text-center">BERSIH</th>
                <th className="p-3 text-center">P3K</th>
                <th className="p-3 text-center">APE</th>
                <th className="p-3 text-center">CCTV</th>
                <th className="p-3 text-center">AC</th>
                <th className="p-3 text-center">LAMPU</th>
                <th className="p-3 text-right">SKOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="p-3">
                    <strong className="text-slate-900 dark:text-white block">{item.name}</strong>
                    <span className="text-[10px] text-slate-400 font-bold">{item.code}</span>
                  </td>
                  <td className="p-3 text-center">
                    {item.teacherPresent ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Hadir</span>
                    ) : (
                      <span className="text-rose-500 font-bold">Absen</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {item.studentsCount} / {item.expectedStudents}
                    </span>
                  </td>
                  <td className="p-3 text-center">{getStatusBadge(item.cleanliness)}</td>
                  <td className="p-3 text-center">{getStatusBadge(item.firstAidKit)}</td>
                  <td className="p-3 text-center">{getStatusBadge(item.toysMedia)}</td>
                  <td className="p-3 text-center">{getStatusBadge(item.cctvFeed)}</td>
                  <td className="p-3 text-center">{getStatusBadge(item.acStatus)}</td>
                  <td className="p-3 text-center">{getStatusBadge(item.lighting)}</td>
                  <td className="p-3 text-right">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {item.overallScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
