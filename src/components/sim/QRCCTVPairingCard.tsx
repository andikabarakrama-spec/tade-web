import React, { useState } from 'react';
import {
  QrCode,
  Printer,
  Download,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Building,
  HardDrive,
  Calendar,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface CameraCardData {
  cameraId: string;
  name: string;
  location: string;
  vendorModel: string;
  ipAddress: string;
  installationDate: string;
  technicianName: string;
  internalTadeLink: string;
  opticalSpecs: string;
}

export const QRCCTVPairingCard: React.FC = () => {
  const [cameras] = useState<CameraCardData[]>([
    {
      cameraId: 'CAM-01-GERBANG',
      name: 'Kamera Gerbang Utama',
      location: 'Tiang Utama Gerbang Timur (Tinggi 3.8m, Sudut 45°)',
      vendorModel: 'Hikvision DS-2CD2047G2-LU ColorVu',
      ipAddress: '192.168.10.101',
      installationDate: '12 Januari 2026',
      technicianName: 'Rian Hidayat, S.Kom. (Teknisi SIM)',
      internalTadeLink: 'https://sim.asy-syifa.sch.id/cctv/cam-01',
      opticalSpecs: '4MP @ 30 FPS, Lensa 2.8mm Wide Angle, F1.0 Starlight'
    },
    {
      cameraId: 'CAM-02-JEMPUT',
      name: 'Kamera Area Penjemputan',
      location: 'Kanopi Depan Gedung TK A (Tinggi 3.2m)',
      vendorModel: 'Dahua WizSense 4MP',
      ipAddress: '192.168.10.102',
      installationDate: '12 Januari 2026',
      technicianName: 'Rian Hidayat, S.Kom. (Teknisi SIM)',
      internalTadeLink: 'https://sim.asy-syifa.sch.id/cctv/cam-02',
      opticalSpecs: '4MP @ 30 FPS, Lensa 3.6mm, Smart IR 30m'
    },
    {
      cameraId: 'CAM-06-GUDANG',
      name: 'Kamera Gudang Arsip & Server',
      location: 'Pojok Plafon Ruang Server (Tinggi 2.8m)',
      vendorModel: 'Imou Bullet Pro 4MP',
      ipAddress: '192.168.10.106',
      installationDate: '15 Januari 2026',
      technicianName: 'Rian Hidayat, S.Kom. (Teknisi SIM)',
      internalTadeLink: 'https://sim.asy-syifa.sch.id/cctv/cam-06',
      opticalSpecs: '2MP @ 25 FPS, PIR Motion Sensor, H.265'
    }
  ]);

  const [selectedCam, setSelectedCam] = useState<CameraCardData>(cameras[0]);

  const handlePrintCard = () => {
    blackBoxRecorder.record({
      moduleCode: 'R390-QRCARD',
      role: 'ADMIN_SIM',
      eventType: 'ACTION',
      details: `Printed QR CCTV Pairing Card for ${selectedCam.cameraId}.`,
      severity: 'INFO'
    });
    window.print();
  };

  return (
    <div id="qr-cctv-pairing-card-root" className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
              R390 &bull; QR CCTV PAIRING CARD
            </span>
            <span className="text-xs text-slate-400 font-mono">Physical Hardware Tagging &bull; Zero Password In QR</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <QrCode className="w-7 h-7 text-purple-400" />
            Kartu Fisik Pairing &amp; Pemeliharaan CCTV QR
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Label fisik resmi untuk ditempel pada tiang kamera dan rak NVR. Memuat identitas kamera, spesifikasi lensa, dan link internal tanpa mengekspos kata sandi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintCard}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 font-mono shadow-md"
          >
            <Printer className="w-4 h-4" /> Cetak Kartu Label Fisik
          </button>
        </div>
      </div>

      {/* Camera Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto print:hidden font-mono text-xs">
        {cameras.map(c => (
          <button
            key={c.cameraId}
            onClick={() => setSelectedCam(c)}
            className={`px-3.5 py-2 rounded-2xl transition-all ${
              selectedCam.cameraId === c.cameraId
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {c.cameraId}
          </button>
        ))}
      </div>

      {/* Printable Physical Hardware Card */}
      <div className="bg-white text-slate-900 p-8 rounded-3xl border-2 border-slate-900 shadow-xl max-w-2xl mx-auto space-y-6 font-mono">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 block">
              TADE SECURITY &bull; HARDWARE TAG
            </span>
            <h2 className="text-xl font-bold text-slate-900">{selectedCam.name}</h2>
            <span className="text-xs text-slate-500">{selectedCam.cameraId}</span>
          </div>

          <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
            ONLINE &bull; VERIFIED
          </div>
        </div>

        {/* Card Body Grid */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-2 space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Lokasi Pemasangan:</span>
              <strong className="text-slate-900">{selectedCam.location}</strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Merk / Model:</span>
              <span>{selectedCam.vendorModel}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">IP Address:</span>
              <strong className="text-purple-700">{selectedCam.ipAddress}</strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Spesifikasi Optik:</span>
              <span className="text-[11px]">{selectedCam.opticalSpecs}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px]">
              <div>
                <span className="text-slate-400 block">Tgl Pasang:</span>
                <strong>{selectedCam.installationDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Teknisi:</span>
                <strong>{selectedCam.technicianName}</strong>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center p-3 border-2 border-slate-900 rounded-2xl bg-slate-50 text-center">
            <QrCode className="w-24 h-24 text-slate-900" />
            <span className="text-[8px] font-bold text-slate-600 mt-1 uppercase">
              SCAN UNTUK KONTROL
            </span>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-[10px] text-slate-600 flex items-center justify-between">
          <span>🔒 Standar Konstitusi TADE: QR Bebas Kata Sandi</span>
          <span>Yayasan Asy-Syifa Tanggul</span>
        </div>
      </div>
    </div>
  );
};
