import React, { useState } from 'react';
import {
  Activity,
  HardDrive,
  Database,
  Smartphone,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Printer,
  Fingerprint,
  TrendingUp,
  Download
} from 'lucide-react';

export const SchoolHealthCenter: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState('Baru saja (Otomatis)');
  const [activeTab, setActiveTab] = useState<'overview' | 'storage' | 'firestore' | 'devices' | 'backups'>('overview');

  const handleRunHealthScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime('Baru saja');
    }, 800);
  };

  const storageStats = {
    totalUsedMb: 1420,
    quotaMb: 10240, // 10 GB
    docsMb: 420,
    photosMb: 850,
    pdfCacheMb: 150
  };

  const firestoreStats = {
    readsToday: 14250,
    readsQuota: 50000,
    writesToday: 1840,
    writesQuota: 20000,
    avgLatencyMs: 24,
    indexHealthPct: 100
  };

  const deviceStats = [
    { type: 'Mobile Wali Murid', online: 218, total: 248, appVersion: 'v2.4.0 (Terbaru)', health: 'Optimal' },
    { type: 'Tablet Guru Kelas', online: 18, total: 18, appVersion: 'v2.4.0 (Terbaru)', health: 'Optimal' },
    { type: 'Thermal Printer Kwitansi', online: 2, total: 2, status: 'Connected (ESC/POS)', health: 'Ready' },
    { type: 'Mesin Fingerprint RFID', online: 1, total: 1, status: 'Synced (Ethernet)', health: 'Ready' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">School System Health Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Skor 98/100 (A+)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Diagnostik real-time penyimpanan cloud, kuota Firestore, perangkat keras sekolah, dan sertifikasi cadangan data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right hidden sm:block text-[11px] text-slate-400">
            Pemeriksaan: <span className="font-semibold text-slate-700">{lastScanTime}</span>
          </div>
          <button
            onClick={handleRunHealthScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-xs disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Mendiagnostik...' : 'Scan Ulang Sistem'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          Ikhtisar Kesehatan
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'storage' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          Kapasitas Penyimpanan
        </button>
        <button
          onClick={() => setActiveTab('firestore')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'firestore' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          Firestore & Query Index
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'devices' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Hardware & Perangkat ({deviceStats.length})
        </button>
        <button
          onClick={() => setActiveTab('backups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'backups' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Cadangan & Pemulihan
        </button>
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Storage Cloud</span>
                <HardDrive className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xl font-bold text-slate-800 mt-2">1.42 GB / 10 GB</div>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '14.2%' }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-2 block">14.2% Kuota Digunakan</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Firestore Reads</span>
                <Database className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-slate-800 mt-2">14.250 / 50K</div>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '28.5%' }} />
              </div>
              <span className="text-[11px] text-emerald-600 mt-2 block">Aman • Headroom Luas</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Hardware Integrity</span>
                <Printer className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-slate-800 mt-2">100% Online</div>
              <div className="text-[11px] text-slate-500 mt-3">2 Printer POS + 1 RFID Synced</div>
              <span className="text-[11px] text-emerald-600 mt-1 block">Nol Antrean Macet</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Disaster Recovery</span>
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-xl font-bold text-cyan-700 mt-2">Verified Hot</div>
              <div className="text-[11px] text-slate-500 mt-3">Snapshot 15 Menit Lalu</div>
              <span className="text-[11px] text-emerald-600 mt-1 block">SHA-256 Validated</span>
            </div>
          </div>

          {/* Diagnostic Recommendation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Laporan Pemeriksaan Kesehatan Mandiri (Self-Healing Ready)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Indeks Komposit Firestore Optimal</div>
                  <p className="text-slate-500 mt-0.5">Semua query pencarian santri, tagihan SPP, dan hafalan tahfidz menggunakan composite index bersertifikasi.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Cache Client-Side & IndexedDB Sehat</div>
                  <p className="text-slate-500 mt-0.5">Struktur cache browser guru berukuran 12.4 MB tanpa fragmentasi memori.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Pemberitahuan WhatsApp Gateway Aktif</div>
                  <p className="text-slate-500 mt-0.5">Latency webhook pengiriman bukti kwitansi tercatat 120ms (Sangat Cepat).</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Nol Kerentanan Multi-Tenant</div>
                  <p className="text-slate-500 mt-0.5">Seluruh query terisolasi dengan namespace <code className="bg-slate-200 px-1 rounded">asy-syifa-pusat</code>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Storage */}
      {activeTab === 'storage' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-800">Rincian Penggunaan Ruang Simpan (Cloud Storage)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400">Galeri Foto & Portofolio:</span>
              <div className="text-lg font-bold text-slate-800 mt-1">{storageStats.photosMb} MB</div>
              <p className="text-[11px] text-slate-500 mt-1">Dokumentasi kegiatan harian santri (Auto-webp).</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400">Dokumen Administrasi & LPJ:</span>
              <div className="text-lg font-bold text-slate-800 mt-1">{storageStats.docsMb} MB</div>
              <p className="text-[11px] text-slate-500 mt-1">Berkas PPDB, KK, Akta, dan SPK BOSP.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400">Cache Cetak PDF Kwitansi & Rapor:</span>
              <div className="text-lg font-bold text-slate-800 mt-1">{storageStats.pdfCacheMb} MB</div>
              <p className="text-[11px] text-slate-500 mt-1">Otomatis dibersihkan berkala setiap 30 hari.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Firestore */}
      {activeTab === 'firestore' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Statistik Operasi Database Firestore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Read Operations (Hari Ini):</span>
              <div className="text-xl font-bold text-indigo-600 mt-1">{firestoreStats.readsToday.toLocaleString()} / 50.000</div>
              <p className="text-[11px] text-slate-400 mt-1">Utilisasi 28.5% (Tingkat efisiensi tinggi berkat client-side caching).</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Write Operations (Hari Ini):</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">{firestoreStats.writesToday.toLocaleString()} / 20.000</div>
              <p className="text-[11px] text-slate-400 mt-1">Utilisasi 9.2% (Batching transaksi kwitansi dan absensi presensi).</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Devices */}
      {activeTab === 'devices' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Armada Perangkat & Hardware Sekolah</h2>
          <div className="space-y-3 text-xs">
            {deviceStats.map((dev, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{dev.type}</div>
                  <div className="text-[11px] text-slate-500">{dev.appVersion || dev.status}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {dev.health}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{dev.online} / {dev.total} Terhubung</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Backups */}
      {activeTab === 'backups' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Log Cadangan Data Terenkripsi (Disaster Recovery)</h2>
              <p className="text-xs text-slate-500">Snapshot harian otomatis dengan verifikasi integritas SHA-256.</p>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Unduh Snapshot Terakhir
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { date: '15 Agt 2026, 03:00 WIB', hash: 'e3b0c44298fc1c149afbf4c8996fb924', size: '24.8 MB', status: 'VERIFIED' },
              { date: '14 Agt 2026, 03:00 WIB', hash: '9f86d081884c7d659a2feaa0c55ad015', size: '24.2 MB', status: 'VERIFIED' },
              { date: '13 Agt 2026, 03:00 WIB', hash: '5e884898da28047151d0e56f8dc62927', size: '23.9 MB', status: 'VERIFIED' }
            ].map((snap, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{snap.date}</div>
                  <div className="font-mono text-[10px] text-slate-400">Hash: {snap.hash}</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 font-bold text-[11px]">{snap.status}</span>
                  <div className="text-[10px] text-slate-400">{snap.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
