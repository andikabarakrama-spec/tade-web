import React, { useState } from 'react';
import { 
  Search, 
  Building2, 
  UserCheck, 
  Laptop, 
  Video, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Command, 
  CheckCircle2, 
  Layers,
  Clock,
  Compass
} from 'lucide-react';
import { CAMPUS_ROOMS } from './DigitalTwinCampusCenter';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface SearchResultItem {
  id: string;
  type: 'ROOM' | 'TEACHER' | 'ASSET' | 'CAMERA' | 'DOCUMENT';
  title: string;
  subtitle: string;
  badge: string;
  destinationModule: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // Rooms
  { id: 'S1', type: 'ROOM', title: 'Sentra Balok & Konstruksi', subtitle: 'Lantai 1, Ruang SNT-01 &bull; 15 Santri', badge: 'Ruangan', destinationModule: 'r475' },
  { id: 'S2', type: 'ROOM', title: 'Sentra Persiapan & Literasi', subtitle: 'Lantai 1, Ruang SNT-02 &bull; 16 Santri', badge: 'Ruangan', destinationModule: 'r475' },
  { id: 'S3', type: 'ROOM', title: 'Sentra Seni, Musik & Tari', subtitle: 'Lantai 1, Ruang SNT-03 &bull; 14 Santri', badge: 'Ruangan', destinationModule: 'r475' },
  { id: 'S4', type: 'ROOM', title: 'Sentra Main Peran', subtitle: 'Lantai 1, Ruang SNT-04 &bull; 15 Santri', badge: 'Ruangan', destinationModule: 'r475' },
  { id: 'S5', type: 'ROOM', title: 'Sentra Bahan Alam & Sains', subtitle: 'Lantai 1, Ruang SNT-05 &bull; 12 Santri', badge: 'Ruangan', destinationModule: 'r475' },
  { id: 'S6', type: 'ROOM', title: 'Aula Serbaguna & Sholat', subtitle: 'Gedung Utama, Ruang AUL-01', badge: 'Ruangan', destinationModule: 'r475' },
  { id: 'S7', type: 'ROOM', title: 'Kantor Tata Usaha & Kepsek', subtitle: 'Gedung Depan, Ruang ADM-01', badge: 'Ruangan', destinationModule: 'r475' },

  // Teachers
  { id: 'T1', type: 'TEACHER', title: 'Ibu Hj. Siti Rahma, S.Pd', subtitle: 'Kepala Sekolah TK Asy Syifa', badge: 'Guru / Kepsek', destinationModule: 'r4' },
  { id: 'T2', type: 'TEACHER', title: 'Ibu Nisa, S.Pd', subtitle: 'Guru Pengampu Sentra Balok', badge: 'Guru Sentra', destinationModule: 'r4' },
  { id: 'T3', type: 'TEACHER', title: 'Ibu Fatimah, S.Pd.I', subtitle: 'Guru Pengampu Sentra Persiapan & Tahfidz', badge: 'Guru Sentra', destinationModule: 'r4' },
  { id: 'T4', type: 'TEACHER', title: 'Ibu Zahra, S.Sn', subtitle: 'Guru Pengampu Sentra Seni & Musik', badge: 'Guru Sentra', destinationModule: 'r4' },
  { id: 'T5', type: 'TEACHER', title: 'Ustadz Farid', subtitle: 'Koordinator Kesiswaan & Ibadah', badge: 'Guru / Ustadz', destinationModule: 'r4' },

  // Assets
  { id: 'A1', type: 'ASSET', title: 'Printer Dokumen Ijazah Epson L3210', subtitle: 'Lokasi: Kantor TU (ADM-01)', badge: 'Aset Elektronik', destinationModule: 'r480' },
  { id: 'A2', type: 'ASSET', title: 'Proyektor Edukasi Epson EB-E500', subtitle: 'Lokasi: Aula Serbaguna (AUL-01)', badge: 'Aset Elektronik', destinationModule: 'r480' },
  { id: 'A3', type: 'ASSET', title: 'Set Balok Kayu Jati 200 Pcs', subtitle: 'Lokasi: Sentra Balok (SNT-01)', badge: 'Media APE', destinationModule: 'r480' },
  { id: 'A4', type: 'ASSET', title: 'AC Daikin Inverter 1.5 PK', subtitle: 'Lokasi: Sentra Balok (SNT-01)', badge: 'Sarpras', destinationModule: 'r480' },

  // Cameras
  { id: 'C1', type: 'CAMERA', title: 'CAM-01: Gate Main Entrance HD', subtitle: 'Pos Satpam & Gerbang Utama', badge: 'CCTV Feed', destinationModule: 'r479' },
  { id: 'C2', type: 'CAMERA', title: 'CAM-04: Main Hall PTZ High Range', subtitle: 'Aula Serbaguna 4K Stream', badge: 'CCTV Feed', destinationModule: 'r479' },
  { id: 'C3', type: 'CAMERA', title: 'CAM-05: Sentra Balok Area Cam', subtitle: 'Pengawasan Belajar Sentra Balok', badge: 'CCTV Feed', destinationModule: 'r479' },

  // Documents
  { id: 'D1', type: 'DOCUMENT', title: 'SK Pengangkatan Guru & Tenaga Kependidikan', subtitle: 'Nomor: 421.1/088/TK-ASY/SK/2026', badge: 'Surat Resmi', destinationModule: 'r432' },
  { id: 'D2', type: 'DOCUMENT', title: 'Kwitansi Digital Pembayaran SPP Agustus 2026', subtitle: 'Verifikasi SHA-256 Tertera QR', badge: 'Keuangan', destinationModule: 'r11' },
  { id: 'D3', type: 'DOCUMENT', title: 'Buku Pedoman Kurikulum Merdeka PAUD', subtitle: 'Dokumen Standar Akreditasi A', badge: 'Akademik', destinationModule: 'r430' }
];

interface Props {
  onNavigate?: (moduleCode: string) => void;
}

export const SmartNavigationEngine: React.FC<Props> = ({ onNavigate }) => {
  const [query, setQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [lastNavigated, setLastNavigated] = useState<string | null>(null);

  const results = SEARCH_DATABASE.filter(item => {
    const matchQuery = item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.badge.toLowerCase().includes(query.toLowerCase());
    const matchType = filterType === 'ALL' || item.type === filterType;
    return matchQuery && matchType;
  });

  const handleSelectResult = (item: SearchResultItem) => {
    setLastNavigated(item.title);
    blackBoxRecorder.record({
      moduleCode: 'R483',
      eventType: 'ACTION',
      severity: 'INFO',
      details: `Smart Navigation jumped to: ${item.title} -> ${item.destinationModule}`
    });
    if (onNavigate) {
      onNavigate(item.destinationModule);
    }
  };

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'ROOM': return <Building2 className="w-4 h-4 text-cyan-500" />;
      case 'TEACHER': return <UserCheck className="w-4 h-4 text-purple-500" />;
      case 'ASSET': return <Laptop className="w-4 h-4 text-emerald-500" />;
      case 'CAMERA': return <Video className="w-4 h-4 text-rose-500" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R483 &bull; SMART NAVIGATION ENGINE
          </span>
          <span className="text-xs text-slate-400 font-mono">Omni-Search &amp; Instant Deep Link Routing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Compass className="w-8 h-8 text-cyan-400" />
          Smart Navigation Engine &bull; Pencarian Instan &amp; Rute Cepat
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Mesin pencarian cepat tanpa reload halaman: temukan ruangan sentra, profil guru, inventaris aset sekolah, kamera CCTV, hingga arsip dokumen resmi dalam hitungan milidetik.
        </p>
      </div>

      {/* Instant Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik apa saja yang ingin dicari (contoh: Sentra Balok, Bu Siti, Printer, CCTV Aula, Surat Keputusan)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            autoFocus
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {[
            { id: 'ALL', label: 'Semua Kategori' },
            { id: 'ROOM', label: 'Ruangan Sentra' },
            { id: 'TEACHER', label: 'Guru & Staf' },
            { id: 'ASSET', label: 'Inventaris Aset' },
            { id: 'CAMERA', label: 'CCTV Live' },
            { id: 'DOCUMENT', label: 'Dokumen & Surat' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            HASIL PENCARIAN TERBARU ({results.length} ITEM DITEMUKAN)
          </span>
          {lastNavigated && (
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              ✓ Terakhir dipilih: {lastNavigated}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {results.map(item => (
            <div
              key={item.id}
              onClick={() => handleSelectResult(item)}
              className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-cyan-400 bg-slate-50/60 dark:bg-slate-700/20 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 shrink-0">
                  {getTypeIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5" dangerouslySetInnerHTML={{ __html: item.subtitle }} />
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <span>Buka Modul</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="text-center py-10 text-slate-400 font-mono text-xs">
              Tidak ditemukan hasil untuk "{query}". Coba kata kunci lain.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
