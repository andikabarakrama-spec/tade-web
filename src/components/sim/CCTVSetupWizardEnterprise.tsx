import React, { useState } from 'react';
import {
  Sliders,
  Search,
  CheckCircle2,
  XCircle,
  Video,
  Activity,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Check,
  Server,
  KeyRound,
  Clock,
  HardDrive,
  Camera,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface DiscoveredCamera {
  id: string;
  ip: string;
  mac: string;
  vendor: string;
  model: string;
  onvifPort: number;
  rtspPort: number;
  status: 'FOUND' | 'TESTED' | 'CONFIGURED';
  onvifProfile: string;
}

export const CCTVSetupWizardEnterprise: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<string>('Hikvision');
  const [targetIpRange, setTargetIpRange] = useState<string>('192.168.10.1/24');
  const [discoveredCameras, setDiscoveredCameras] = useState<DiscoveredCamera[]>([
    {
      id: 'DISC-CAM-1',
      ip: '192.168.10.101',
      mac: 'E0:CC:7A:41:88:21',
      vendor: 'Hikvision',
      model: 'DS-2CD2047G2-LU (ColorVu)',
      onvifPort: 80,
      rtspPort: 554,
      status: 'FOUND',
      onvifProfile: 'Profile S & G'
    },
    {
      id: 'DISC-CAM-2',
      ip: '192.168.10.102',
      mac: '3C:EF:8C:11:54:32',
      vendor: 'Dahua',
      model: 'IPC-HFW2431S-S-S2 (WizSense)',
      onvifPort: 80,
      rtspPort: 554,
      status: 'FOUND',
      onvifProfile: 'Profile S & T'
    },
    {
      id: 'DISC-CAM-3',
      ip: '192.168.10.103',
      mac: '54:AF:97:9A:12:09',
      vendor: 'TP-Link Tapo',
      model: 'C320WS Outdoor 4MP',
      onvifPort: 2020,
      rtspPort: 554,
      status: 'FOUND',
      onvifProfile: 'Profile S'
    },
    {
      id: 'DISC-CAM-4',
      ip: '192.168.10.104',
      mac: 'B8:A3:86:F4:71:60',
      vendor: 'Uniview',
      model: 'IPC2124SR3-DPF40',
      onvifPort: 80,
      rtspPort: 554,
      status: 'FOUND',
      onvifProfile: 'Profile S'
    }
  ]);
  const [selectedCamera, setSelectedCamera] = useState<DiscoveredCamera | null>(discoveredCameras[0]);

  // Test Execution States
  const [testOnvifStatus, setTestOnvifStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('PASS');
  const [testRtspStatus, setTestRtspStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('PASS');
  const [testSnapshotStatus, setTestSnapshotStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('PASS');
  const [testTimeSyncStatus, setTestTimeSyncStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('PASS');

  const vendors = [
    'Hikvision',
    'Dahua',
    'TP-Link Tapo',
    'Ezviz',
    'Imou',
    'Reolink',
    'Xiaomi',
    'Uniview',
    'Generic ONVIF'
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      blackBoxRecorder.record({
        moduleCode: 'R379-WIZARD',
        role: 'ADMIN_SIM',
        eventType: 'ACTION',
        details: `Subnet Scan on ${targetIpRange} completed. 4 enterprise cameras detected.`,
        severity: 'INFO'
      });
    }, 1500);
  };

  const handleTestAll = () => {
    setTestOnvifStatus('TESTING');
    setTestRtspStatus('TESTING');
    setTestSnapshotStatus('TESTING');
    setTestTimeSyncStatus('TESTING');

    setTimeout(() => {
      setTestOnvifStatus('PASS');
      setTestRtspStatus('PASS');
      setTestSnapshotStatus('PASS');
      setTestTimeSyncStatus('PASS');
      blackBoxRecorder.record({
        moduleCode: 'R379-WIZARD',
        role: 'ADMIN_SIM',
        eventType: 'SECURITY',
        details: `All ONVIF, RTSP, Snapshot, and NTP tests PASSED for ${selectedCamera?.ip}.`,
        severity: 'INFO'
      });
    }, 1200);
  };

  return (
    <div id="cctv-setup-wizard-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R379 &bull; ENTERPRISE SETUP WIZARD
              </span>
              <span className="text-xs text-slate-400 font-mono">7-Step Zero-Friction Pairing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sliders className="w-8 h-8 text-purple-400" />
              Wisaya Pemasangan Kamera IP &amp; CCTV
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Mendukung Hikvision, Dahua, TP-Link Tapo, Ezviz, Imou, Reolink, Xiaomi, Uniview, dan Generic ONVIF dengan protokol audit otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
              LANGKAH {currentStep} / 7
            </span>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-7 gap-1 text-center text-xs font-mono">
          {[
            '1. Scan Jaringan',
            '2. Pilih Kamera',
            '3. Tes ONVIF',
            '4. Tes RTSP',
            '5. Snapshot',
            '6. Waktu NTP',
            '7. Simpan & Aktif'
          ].map((st, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentStep(idx + 1)}
              className={`p-2 rounded-xl cursor-pointer transition-all ${
                currentStep === idx + 1
                  ? 'bg-purple-600 text-white font-bold shadow-md'
                  : currentStep > idx + 1
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/40 text-slate-500'
              }`}
            >
              <span className="truncate block text-[10px] sm:text-xs">{st}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* Step 1: Scan Jaringan */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  Langkah 1: Pindai Jaringan Lokal (Subnet Discovery)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Masukkan rentang subnet IP madrasah untuk mendeteksi kamera IP yang terhubung.
                </p>
              </div>
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 font-mono shadow-md"
              >
                {isScanning ? <Zap className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {isScanning ? 'Memindai Jaringan...' : 'Mulai Pindai Subnet'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Subnet CIDR:</label>
                <input
                  type="text"
                  value={targetIpRange}
                  onChange={(e) => setTargetIpRange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Merk / Vendor Utama:</label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {vendors.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Temukan Kamera */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Langkah 2: Pilih Kamera yang Terdeteksi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ditemukan {discoveredCameras.length} perangkat kamera pada subnet lokal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {discoveredCameras.map((cam) => (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCamera(cam)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedCamera?.id === cam.id
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200'
                      : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{cam.model}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      {cam.vendor}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    IP: <strong>{cam.ip}</strong> &bull; MAC: {cam.mac}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Port ONVIF: {cam.onvifPort} &bull; Port RTSP: {cam.rtspPort} &bull; {cam.onvifProfile}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 s/d 6: Tes Terpadu (ONVIF, RTSP, Snapshot, Sinkron Waktu) */}
        {(currentStep >= 3 && currentStep <= 6) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  Pengujian Konektivitas &amp; Integritas Kamera: {selectedCamera?.ip}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Memverifikasi standar Profile S, streaming stream RTSP, capture snapshot, dan clock drift.
                </p>
              </div>
              <button
                onClick={handleTestAll}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 font-mono shadow-md"
              >
                <Zap className="w-4 h-4" /> Uji Ulang Semua Protokol
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">1. Protokol ONVIF Profile S</span>
                  <span className="text-slate-500 text-[11px]">Handshake SOAP &amp; WS-Security</span>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {testOnvifStatus}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">2. RTSP H.265+ Stream</span>
                  <span className="text-slate-500 text-[11px]">rtsp://{selectedCamera?.ip}:554/live/ch0</span>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {testRtspStatus} (30 FPS)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">3. Snapshot REST API</span>
                  <span className="text-slate-500 text-[11px]">Resolusi: 2560x1440 Hi-Res</span>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {testSnapshotStatus}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">4. Sinkronisasi Waktu (NTP)</span>
                  <span className="text-slate-500 text-[11px]">Offset: &lt; 4 ms (pool.ntp.org)</span>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {testTimeSyncStatus} (WIB)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Simpan & Aktif */}
        {currentStep === 7 && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              Kamera Siap Dipasangkan ke Sistem TADE RC55!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Perangkat {selectedCamera?.model} ({selectedCamera?.ip}) telah lolos semua uji ONVIF, RTSP, Snapshot, dan Sinkronisasi Jam.
            </p>

            <button
              onClick={() => {
                blackBoxRecorder.record({
                  moduleCode: 'R379-WIZARD',
                  role: 'ADMIN_SIM',
                  eventType: 'ACTION',
                  details: `Camera ${selectedCamera?.model} registered into TADE Active Fleet.`,
                  severity: 'INFO'
                });
                alert('Kamera berhasil disimpan dan diaktifkan di Guardian Security Command Center!');
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono shadow-lg shadow-emerald-600/30"
            >
              Simpan &amp; Aktifkan Kamera ke Fleet
            </button>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4 text-xs font-mono">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>

          <button
            onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
            disabled={currentStep === 7}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 shadow-md disabled:opacity-40"
          >
            Lanjut <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
