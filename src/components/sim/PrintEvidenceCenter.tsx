import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  Clock, 
  User, 
  CheckCircle2, 
  Search, 
  Filter, 
  Layers, 
  ShieldCheck,
  AlertCircle,
  Copy,
  Hash
} from 'lucide-react';

interface PrintEvidenceRecord {
  id: string;
  documentTitle: string;
  category: 'Raport' | 'Piagam' | 'SK' | 'Tabungan';
  printedBy: string;
  role: string;
  printedAt: string;
  printerDevice: string;
  copyCount: number;
  ipAddress: string;
  watermarkChecksum: string;
  status: 'LOGGED_AND_VERIFIED';
}

export const PrintEvidenceCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [printRecords] = useState<PrintEvidenceRecord[]>([
    {
      id: 'PRT-2026-0815-001',
      documentTitle: 'SK Penetapan Struktur Guru & Kurikulum Sentra 2026',
      category: 'SK',
      printedBy: 'Ustadzah Siti Aminah, S.Pd',
      role: 'ADMIN_SIM',
      printedAt: '15 Agustus 2026, 11:30:12 WIB',
      printerDevice: 'Epson EcoTank L3210 (Ruang Tata Usaha)',
      copyCount: 2,
      ipAddress: '192.168.1.104',
      watermarkChecksum: 'WMK-SHA-e3b0c44298fc',
      status: 'LOGGED_AND_VERIFIED'
    },
    {
      id: 'PRT-2026-0814-042',
      documentTitle: 'Raport Sentra Bahan Alam — Muhammad Fatih (Semester Ganjil)',
      category: 'Raport',
      printedBy: 'Ustadzah Nurul Hidayah, S.Pd',
      role: 'GURU_SENTRA',
      printedAt: '14 Agustus 2026, 16:05:44 WIB',
      printerDevice: 'Canon Pixma G2010 (Ruang Sentra Balok)',
      copyCount: 1,
      ipAddress: '192.168.1.112',
      watermarkChecksum: 'WMK-SHA-5e884898da28',
      status: 'LOGGED_AND_VERIFIED'
    },
    {
      id: 'PRT-2026-0810-019',
      documentTitle: 'Piagam Penghargaan Santri Teladan Tahfidz Juz 30 — Fatimah Az-Zahra',
      category: 'Piagam',
      printedBy: 'Ustadz Ahmad Fauzi, M.Pd',
      role: 'KEPALA_SEKOLAH',
      printedAt: '10 Agustus 2026, 09:12:00 WIB',
      printerDevice: 'HP LaserJet Pro MFP (Ruang Kepala Sekolah)',
      copyCount: 1,
      ipAddress: '192.168.1.100',
      watermarkChecksum: 'WMK-SHA-9f86d081884c',
      status: 'LOGGED_AND_VERIFIED'
    },
    {
      id: 'PRT-2026-0801-088',
      documentTitle: 'Buku Rekening Tabungan & Slip Setoran SPP — Ahmad Dahlan',
      category: 'Tabungan',
      printedBy: 'Ustadzah Halimah',
      role: 'BENDAHARA_SEKOLAH',
      printedAt: '01 Agustus 2026, 09:45:30 WIB',
      printerDevice: 'Epson Passbook PLQ-20 (Loket Keuangan)',
      copyCount: 1,
      ipAddress: '192.168.1.108',
      watermarkChecksum: 'WMK-SHA-4b227777d4dd',
      status: 'LOGGED_AND_VERIFIED'
    }
  ]);

  const filteredRecords = printRecords.filter(rec => {
    const matchesSearch = 
      rec.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.printedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.printerDevice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || rec.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="print-evidence-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Printer className="w-48 h-48 text-amber-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R224 &bull; PHYSICAL PRINT AUDIT
              </span>
              <span className="text-xs text-slate-400">Tamper-Proof Hardcopy Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Printer className="w-8 h-8 text-amber-400" />
              Print Evidence Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pencatatan bukti fisik pencetakan: Siapa mencetak, kapan, perangkat printer, dan jumlah salinan khusus berkas krusial (<strong>Raport, Piagam, SK, dan Tabungan</strong>).
            </p>
          </div>
        </div>

        {/* Print Summary Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Log Cetak</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{printRecords.length} Record</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Kategori Khusus</span>
            <span className="text-xl font-bold text-white font-mono">4 KATEGORI</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Watermark Hash</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100% EMBEDDED</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Pencegahan Penggandaan</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">STRICT CONTROL</span>
          </div>
        </div>
      </div>

      {/* Category Pills and Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Raport', 'Piagam', 'SK', 'Tabungan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, printer, aktor..."
            maxLength={100}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Print Audit Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3.5">ID Log & Kategori</th>
                <th className="px-4 py-3.5">Dokumen Yang Dicetak</th>
                <th className="px-4 py-3.5">Aktor Pencetak (Operator)</th>
                <th className="px-4 py-3.5">Perangkat Printer & Lokasi</th>
                <th className="px-4 py-3.5 text-center">Salinan</th>
                <th className="px-4 py-3.5">Watermark Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-4 align-top">
                    <span className="font-mono font-bold text-slate-900 dark:text-white block">{rec.id}</span>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.category === 'Raport' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                      rec.category === 'Piagam' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                      rec.category === 'SK' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>
                      {rec.category}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1 font-mono">{rec.printedAt}</span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <span className="font-bold text-slate-900 dark:text-white block max-w-xs">{rec.documentTitle}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">IP Client: {rec.ipAddress}</span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{rec.printedBy}</span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block">{rec.role}</span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <Printer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium">{rec.printerDevice}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {rec.copyCount} Copy
                    </span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="bg-slate-900 text-slate-300 font-mono text-[10px] p-2 rounded-lg border border-slate-800">
                      <span className="text-amber-400 font-bold block">Watermark Hash:</span>
                      {rec.watermarkChecksum}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardcopy Integrity Rule */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Audit Cetak Berkas Fisik & Anti-Pemalsuan (Hardcopy Nonce Security)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Setiap dokumen resmi yang dicetak secara otomatis disematkan watermark tak kasat mata berupa Checksum SHA-256 dan Nonce acak unik. Jika dokumen fisik difotokopi secara ilegal tanpa izin, auditor dapat mencocokkan kode log pencetakan untuk memverifikasi keaslian lembaran asli.
          </p>
        </div>
      </div>
    </div>
  );
};
