import React, { useState } from 'react';
import {
  Crosshair,
  UserX,
  Scan,
  ShieldAlert,
  Compass,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  AlertTriangle,
  Play,
  Share2,
  FileText,
  Filter,
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface TrackedSignature {
  id: string;
  headgear: 'HELM_FULL_FACE' | 'HELM_HALF_FACE' | 'HOODIE' | 'TOPI' | 'NONE';
  faceCover: 'MASKER_MEDIS' | 'BUFF_HITAM' | 'MASKER_KAIN' | 'NONE';
  clothingColor: string;
  accessories: string;
  estimatedHeightCm: string;
  gaitPattern: string;
  vehicle: string;
  confidenceScore: number;
  initialTime: string;
  movementPath: {
    camera: string;
    zone: string;
    timestamp: string;
    action: string;
  }[];
}

export const SmartIntruderTracking: React.FC = () => {
  const [activeTrackingId, setActiveTrackingId] = useState<string>('TRACK-2026-001');
  const [selectedAttributeFilter, setSelectedAttributeFilter] = useState<string>('ALL');

  const trackedSubjects: TrackedSignature[] = [
    {
      id: 'TRACK-2026-001',
      headgear: 'HELM_FULL_FACE',
      faceCover: 'MASKER_MEDIS',
      clothingColor: 'Jaket Hitam Polos & Celana Jeans Gelap',
      accessories: 'Tas Ransel Abu-abu Bergaris Merah',
      estimatedHeightCm: '170 – 174 cm',
      gaitPattern: 'Langkah Cepat, Menghindari Sorot Kamera Langsung',
      vehicle: 'Motor Matic Hitam (Plat Depan Tidak Terpasang)',
      confidenceScore: 94.8,
      initialTime: '14:23:10 WIB',
      movementPath: [
        {
          camera: 'CAM-01',
          zone: 'Gerbang Utama & Pos Satpam',
          timestamp: '14:23:10 WIB',
          action: 'Masuk melalui gerbang samping tanpa memindai QR Tamu'
        },
        {
          camera: 'CAM-02',
          zone: 'Area Parkir & Penjemputan Santri',
          timestamp: '14:24:45 WIB',
          action: 'Memarkir kendaraan di balik pohon palem'
        },
        {
          camera: 'CAM-04',
          zone: 'Koridor Utama Kelas Sentra',
          timestamp: '14:26:12 WIB',
          action: 'Berjalan cepat melintasi koridor menuju sayap belakang'
        },
        {
          camera: 'CAM-06',
          zone: 'Gudang Arsip & Ruang Server',
          timestamp: '14:28:30 WIB',
          action: 'Mencoba memutar hendel pintu gudang arsip (Terkunci)'
        },
        {
          camera: 'CAM-01',
          zone: 'Gerbang Utama & Pos Satpam',
          timestamp: '14:31:05 WIB',
          action: 'Keluar terburu-buru dengan motor ke arah jalan raya timur'
        }
      ]
    },
    {
      id: 'TRACK-2026-002',
      headgear: 'HOODIE',
      faceCover: 'BUFF_HITAM',
      clothingColor: 'Hoodie Biru Navy & Celana Training Hitam',
      accessories: 'Tas Selempang Kecil',
      estimatedHeightCm: '165 – 168 cm',
      gaitPattern: 'Berjalan Santai Sambil Mengamati Jendela',
      vehicle: 'Sepeda Motor Bebek Merah (Plat P 4128 XX)',
      confidenceScore: 89.2,
      initialTime: '16:05:40 WIB',
      movementPath: [
        {
          camera: 'CAM-01',
          zone: 'Gerbang Utama',
          timestamp: '16:05:40 WIB',
          action: 'Melewati depan gerbang saat santri TPA pulang'
        },
        {
          camera: 'CAM-03',
          zone: 'Halaman Bermain',
          timestamp: '16:07:20 WIB',
          action: 'Mengambil barang tertinggal di dekat ayunan'
        }
      ]
    }
  ];

  const activeSubject = trackedSubjects.find(s => s.id === activeTrackingId) || trackedSubjects[0];

  return (
    <div id="smart-intruder-tracking-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R381 &bull; SMART INTRUDER TRACKING
              </span>
              <span className="text-xs text-slate-400 font-mono">Zero Facial Guessing &bull; Attribute-Based AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-rose-500" />
              Pelacakan Lintas Kamera Berbasis Atribut Fisik
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Ketika wajah tertutup helm atau masker, sistem melacak subjek mencurigakan berdasarkan helm, pakaian, tas, cara berjalan, dan kendaraan tanpa menebak identitas pribadi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono text-xs font-bold">
              {trackedSubjects.length} SIGNATURE TERDETEKSI
            </span>
          </div>
        </div>
      </div>

      {/* Main Analysis Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Attribute Breakdown */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scan className="w-4 h-4 text-rose-500" />
                Signature Fisik Terkunci
              </h3>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                {activeSubject.confidenceScore}% Match
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[10px]">Pelindung Kepala (Headgear):</span>
                <strong className="text-slate-900 dark:text-white text-xs">{activeSubject.headgear.replace(/_/g, ' ')}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[10px]">Penutup Wajah (Face Mask):</span>
                <strong className="text-slate-900 dark:text-white text-xs">{activeSubject.faceCover.replace(/_/g, ' ')}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[10px]">Warna &amp; Model Busana:</span>
                <strong className="text-slate-900 dark:text-white text-xs">{activeSubject.clothingColor}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[10px]">Aksesoris / Barang Bawaan:</span>
                <strong className="text-slate-900 dark:text-white text-xs">{activeSubject.accessories}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[10px]">Estimasi Tinggi &amp; Pola Gerak:</span>
                <strong className="text-slate-900 dark:text-white text-xs">{activeSubject.estimatedHeightCm} &bull; {activeSubject.gaitPattern}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[10px]">Korelasi Kendaraan:</span>
                <strong className="text-amber-600 dark:text-amber-400 text-xs">{activeSubject.vehicle}</strong>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Prinsip Privasi TADE:</strong> Sistem tidak menebak nama/identitas individu secara sembarangan. Data berbasis rekaman fisik objektif untuk penyelidikan resmi.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Camera Movement Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Kronologi Pergerakan Lintas Kamera ({activeSubject.id})
                </h3>
                <span className="text-[11px] text-slate-400">Total {activeSubject.movementPath.length} Titik Deteksi Rekaman</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                Waktu Awal: {activeSubject.initialTime}
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 text-xs">
              {activeSubject.movementPath.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800 shadow" />
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-rose-500" />
                        {step.camera}: {step.zone}
                      </span>
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">{step.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
