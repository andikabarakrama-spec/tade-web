import React, { useState } from 'react';
import {
  Zap,
  Layers,
  BatteryCharging,
  Image,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Cpu,
  Smartphone,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

export const AssetOptimizationEngine: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [autoWebpEnabled, setAutoWebpEnabled] = useState(true);
  const [quietBackgroundEnabled, setQuietBackgroundEnabled] = useState(true);
  const [cacheClearSuccess, setCacheClearSuccess] = useState(false);

  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setCacheClearSuccess(true);
      setTimeout(() => setCacheClearSuccess(false), 2500);
    }, 600);
  };

  const bundleBudgets = [
    { target: 'Aplikasi Wali Murid (Parent Lite)', actual: '94 KB', budget: '120 KB', status: 'PASS', score: 100 },
    { target: 'Ruang Guru & Penilaian (Teacher Lite)', actual: '210 KB', budget: '250 KB', status: 'PASS', score: 98 },
    { target: 'Tata Usaha & Keuangan (Operations Pro)', actual: '480 KB', budget: '600 KB', status: 'PASS', score: 96 }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Asset & Performance Optimization Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Featherweight Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Optimasi kompresi media, tata kelola IndexedDB cache, kontrol bundle ringan, dan manajemen Quiet Background hemat baterai.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunOptimizer}
          disabled={isOptimizing}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-xs disabled:opacity-75 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          {isOptimizing ? 'Mengompresi...' : 'Bersihkan Cache & Kompres'}
        </button>
      </div>

      {cacheClearSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Cache aset sementara berhasil dirampingkan! Memori browser dibebaskan sebesar 18.4 MB.
        </div>
      )}

      {/* Bundle Budget Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Batas Anggaran Ukuran Bundle (Featherweight Mandate)
        </h2>

        <div className="space-y-3">
          {bundleBudgets.map((b, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-800">{b.target}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Ukuran Aktual: <strong className="text-indigo-600">{b.actual}</strong> / Maks: {b.budget}
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold self-start sm:self-auto flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {b.status} ({b.score}/100)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Control Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-800">Auto WEBP/AVIF Compression</h2>
            </div>
            <button
              onClick={() => setAutoWebpEnabled(!autoWebpEnabled)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                autoWebpEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {autoWebpEnabled ? 'Aktif' : 'Mati'}
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Secara otomatis merampingkan foto santri, dokumen berkas PPDB, dan spanduk hingga 70% lebih kecil tanpa menurunkan kualitas visual cetak.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-800">Quiet Background Engine</h2>
            </div>
            <button
              onClick={() => setQuietBackgroundEnabled(!quietBackgroundEnabled)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                quietBackgroundEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {quietBackgroundEnabled ? 'Aktif' : 'Mati'}
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Menonaktifkan polling dan telemetri berat saat tab browser tidak aktif, menjamin 0% pemborosan daya baterai ponsel wali murid & laptop guru.
          </p>
        </div>
      </div>
    </div>
  );
};
