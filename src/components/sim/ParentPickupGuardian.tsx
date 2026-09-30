import React, { useState } from 'react';
import {
  Users,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ShieldCheck,
  Clock,
  UserCheck,
  UserX,
  Search,
  Check,
  Sparkles,
  PhoneCall,
  Bell
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface PickupRecord {
  id: string;
  studentName: string;
  studentClass: string;
  legalGuardians: string[];
  currentPickerName: string;
  relationship: string;
  qrVerified: boolean;
  isAuthorizedGuardian: boolean;
  pickupTime: string;
  gateCameraSnapshot: string;
  status: 'VERIFIED_RELEASED' | 'UNAUTHORIZED_BLOCKED' | 'WAITING_VERIFICATION';
}

export const ParentPickupGuardian: React.FC = () => {
  const [records, setRecords] = useState<PickupRecord[]>([
    {
      id: 'PKP-2026-0816-01',
      studentName: 'Ahmad Rayyan Al-Farizi',
      studentClass: 'Sentra Balok & Bahan Alam (TK-A)',
      legalGuardians: ['Bapak Hendra (Ayah)', 'Ibu Siti (Ibu)'],
      currentPickerName: 'Bapak Hendra (Ayah Kandung)',
      relationship: 'Ayah Kandung',
      qrVerified: true,
      isAuthorizedGuardian: true,
      pickupTime: '11:30 WIB',
      gateCameraSnapshot: 'CAM-01-GERBANG #10842',
      status: 'VERIFIED_RELEASED'
    },
    {
      id: 'PKP-2026-0816-02',
      studentName: 'Aisyah Putri Azzahra',
      studentClass: 'Sentra Persiapan & Imtaq (TK-B)',
      legalGuardians: ['Ibu Nurul (Ibu)', 'Ustadz Danang (Paman)'],
      currentPickerName: 'Ustadz Danang (Paman)',
      relationship: 'Paman Terdaftar',
      qrVerified: true,
      isAuthorizedGuardian: true,
      pickupTime: '11:35 WIB',
      gateCameraSnapshot: 'CAM-01-GERBANG #10850',
      status: 'VERIFIED_RELEASED'
    },
    {
      id: 'PKP-2026-0816-03',
      studentName: 'Fathir Muhammad',
      studentClass: 'Sentra Seni & Kreativitas (TK-A)',
      legalGuardians: ['Bapak Rudi (Ayah)', 'Ibu Rina (Ibu)'],
      currentPickerName: 'Orang Tidak Dikenal (Ojek Online / Tanpa QR)',
      relationship: 'Tidak Terdaftar Dalam Sistem',
      qrVerified: false,
      isAuthorizedGuardian: false,
      pickupTime: '11:40 WIB',
      gateCameraSnapshot: 'CAM-01-GERBANG #10865',
      status: 'UNAUTHORIZED_BLOCKED'
    }
  ]);

  return (
    <div id="parent-pickup-guardian-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R398 &bull; PARENT PICKUP GUARDIAN CONSTITUTION
              </span>
              <span className="text-xs text-slate-400 font-mono">Zero Kidnapping &bull; Child Handover Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-purple-400" />
              Sistem Penjemputan Siswa &amp; Verifikasi Wali Sah
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Integrasi QR Token Penjemput, database wali sah siswa, stempel waktu, dan snapshot kamera gerbang. Peringatan merah otomatis jika penjemput tidak terdaftar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
              100% AMAN &amp; TERVERIFIKASI
            </span>
          </div>
        </div>
      </div>

      {/* Pickup Cards Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {records.map((rec) => (
          <div
            key={rec.id}
            className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
              rec.status === 'UNAUTHORIZED_BLOCKED'
                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400 dark:border-rose-800'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="font-bold text-slate-900 dark:text-white text-xs">{rec.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                rec.status === 'UNAUTHORIZED_BLOCKED'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {rec.status === 'UNAUTHORIZED_BLOCKED' ? 'DITOLAK & DITAHAN' : 'DIIZINKAN PULANG'}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Nama Siswa:</span>
                <strong className="text-slate-900 dark:text-white text-xs">{rec.studentName}</strong>
                <span className="text-[10px] text-slate-500 block">{rec.studentClass}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Daftar Wali Sah:</span>
                <span className="text-slate-600 dark:text-slate-300">{rec.legalGuardians.join(', ')}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Penjemput Saat Ini:</span>
                <strong className={rec.isAuthorizedGuardian ? 'text-slate-900 dark:text-white' : 'text-rose-600'}>
                  {rec.currentPickerName}
                </strong>
              </div>

              <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                <span className="text-slate-400">Verifikasi Token QR:</span>
                <strong className={rec.qrVerified ? 'text-emerald-500' : 'text-rose-500'}>
                  {rec.qrVerified ? 'COCOK (VALID)' : 'TIDAK VALID / NIHIL'}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Waktu &amp; Snapshot:</span>
                <span>{rec.pickupTime} &bull; {rec.gateCameraSnapshot}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
