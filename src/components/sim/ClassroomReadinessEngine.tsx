import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Thermometer,
  Lightbulb,
  Video,
  Heart,
  Smile,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface ReadinessItem {
  id: string;
  name: string;
  category: string;
  status: boolean;
  notes: string;
}

export const ClassroomReadinessEngine: React.FC = () => {
  const [items, setItems] = useState<ReadinessItem[]>([
    { id: 'CR-01', name: 'Kehadiran Guru / Ustadzah Sentra', category: 'SDM', status: true, notes: 'Ustadzah Syifa & Ustadzah Nurul hadir pukul 06:45 WIB' },
    { id: 'CR-02', name: 'Presensi Santri Masuk Kelas', category: 'SANTRI', status: true, notes: '24/25 Santri telah check-in via QR Guardian Gate' },
    { id: 'CR-03', name: 'Kebersihan & Sanitasi Ruangan', category: 'HYGIENE', status: true, notes: 'Lantai steril, karpet bebas debu, aroma terapi menyala' },
    { id: 'CR-04', name: 'Alat Peraga Edukatif (APE) & Mainan', category: 'SENTRA', status: true, notes: 'Balok kayu, lego alfabet, dan puzzle sentra tersusun aman' },
    { id: 'CR-05', name: 'Kamera CCTV Sentra Aktif', category: 'CCTV', status: true, notes: 'Feed kamera sudut 1080p online, sudut pandang optimal' },
    { id: 'CR-06', name: 'Pendingin Ruangan (AC) 24°C', category: 'IKLIM', status: true, notes: 'Suhu ideal anak usia dini terjaga stabil' },
    { id: 'CR-07', name: 'Proyektor & Sound Edukasi', category: 'MEDIA', status: true, notes: 'Speaker murottal juz 30 & proyektor sentra siap pakai' },
    { id: 'CR-08', name: 'Pencahayaan / Lampu Kelas', category: 'LISTRIK', status: true, notes: 'Lampu LED daylight terang merata tanpa kedipan' },
    { id: 'CR-09', name: 'Kebersihan Toilet Ramah Anak', category: 'TOILET', status: true, notes: 'Air bersih lancar, sabun cuci tangan & tisu tersedia' },
    { id: 'CR-10', name: 'Kotak P3K & Sanitizer Anak', category: 'MEDIS', status: true, notes: 'Obat luka, minyak telon, plester anak, dan termometer siap' }
  ]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, status: !it.status } : it));
  };

  const readyCount = items.filter(it => it.status).length;
  const isAllReady = readyCount === items.length;

  return (
    <div id="classroom-readiness-engine-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R417 &bull; CLASSROOM READINESS ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">10-Point Morning Learning Environment Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-teal-400" />
              Kesiapan Ruang Kelas &amp; Lingkungan Belajar Sentra
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Daftar periksa otomatis kesiapan harian: guru, santri, kebersihan, mainan sentra, CCTV, AC, proyektor, lampu, toilet ramah anak, dan kotak P3K.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-3 rounded-2xl border font-mono text-center ${
              isAllReady ? 'bg-teal-950/80 border-teal-500/50 text-teal-300' : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
            }`}>
              <span className="text-[10px] block">SKOR KESIAPAN</span>
              <span className="text-base font-bold">{readyCount} / {items.length} ({Math.round(readyCount / items.length * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {items.map((it) => (
          <div
            key={it.id}
            onClick={() => toggleItem(it.id)}
            className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-sm flex items-start justify-between gap-3 ${
              it.status
                ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{it.id} &bull; {it.category}</span>
                <span className={`px-2 py-0.2 rounded font-bold text-[9px] ${
                  it.status ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {it.status ? 'READY' : 'BELUM SIAP'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">{it.name}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{it.notes}</p>
            </div>

            <div className={`p-2 rounded-xl mt-1 ${it.status ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50' : 'text-slate-400 bg-slate-100 dark:bg-slate-700'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
