import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Search, 
  CheckCircle2, 
  Download, 
  Bookmark, 
  GraduationCap, 
  ShieldCheck, 
  LifeBuoy,
  Bot,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const SchoolKnowledgeVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const articles = [
    { id: 'KB1', title: 'SOP Pelaksanaan Pembelajaran Kurikulum Merdeka PAUD', category: 'SOP', role: 'GURU', reads: '124x', lastUpdated: '2026-08-01', excerpt: 'Pedoman penyusunan Modul Ajar, asesmen formatif harian, dan portofolio anak didik.' },
    { id: 'KB2', title: 'Panduan Operasional Super Admin & Manajemen Hak Akses RBAC', category: 'PANDUAN', role: 'ADMIN', reads: '88x', lastUpdated: '2026-08-10', excerpt: 'Tata cara pengelolaan 11 peran, rotasi kunci otentikasi, dan audit WORM ledger.' },
    { id: 'KB3', title: 'Panduan Eksekutif Ketua Yayasan: Laporan Keuangan & Audit', category: 'PANDUAN', role: 'YAYASAN', reads: '56x', lastUpdated: '2026-07-28', excerpt: 'Cara memantau arus kas yayasan, verifikasi RAPBS, dan persetujuan pengeluaran darurat.' },
    { id: 'KB4', title: 'SOP Verifikasi Berkas & Penerimaan Siswa Baru (PPDB Online)', category: 'SOP', role: 'OPERATOR', reads: '142x', lastUpdated: '2026-08-05', excerpt: 'Alur kerja validasi akta kelahiran, KK, penomoran induk siswa, dan sinkronisasi Dapodik.' },
    { id: 'KB5', title: 'Pedoman Penanganan Insiden Jaringan & Pemulihan Offline (Recovery)', category: 'RECOVERY', role: 'ADMIN', reads: '65x', lastUpdated: '2026-08-12', excerpt: 'Prosedur pemulihan data saat koneksi internet terputus menggunakan IndexedDB offline queue.' },
    { id: 'KB6', title: 'FAQ & Tanya Jawab Terpopuler Wali Murid & Guru', category: 'FAQ', role: 'UMUM', reads: '210x', lastUpdated: '2026-08-14', excerpt: 'Jawaban atas pertanyaan seputar pembayaran SPP, perizinan siswa, dan jadwal kegiatan ekstrakurikuler.' }
  ];

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || a.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-2xl border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200 font-mono">
                  R522 &bull; KNOWLEDGE VAULT
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 font-mono">
                  ASY INTEGRATED
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                School Knowledge Vault
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pusat repositori pengetahuan institusional sekolah (SOP, Panduan Guru/Admin/Yayasan, Tutorial, FAQ &amp; Recovery).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-pink-50 dark:bg-slate-700/50 p-2.5 rounded-2xl border border-pink-200 dark:border-slate-700 text-pink-700 dark:text-pink-300">
            <Bot className="w-4 h-4 text-pink-500" />
            <span>AI Asy Mengindeks <strong>6/6 SOP &amp; Panduan</strong></span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari SOP, panduan guru, instruksi pemulihan..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto font-mono text-xs">
          {['ALL', 'GURU', 'ADMIN', 'YAYASAN', 'OPERATOR', 'UMUM'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-2 rounded-xl transition-all border ${
                selectedRole === r
                  ? 'bg-cyan-600 text-white border-cyan-600 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filteredArticles.map(art => (
          <div key={art.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200">
                  {art.category} &bull; {art.role}
                </span>
                <span className="text-[10px] text-slate-400">Dibaca {art.reads}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{art.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans line-clamp-2">{art.excerpt}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
              <span>Update: {art.lastUpdated}</span>
              <button 
                onClick={() => {
                  blackBoxRecorder.record({
                    moduleCode: 'R522',
                    eventType: 'STORAGE',
                    severity: 'INFO',
                    details: `Read and downloaded SOP document: ${art.title}`
                  });
                }}
                className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Unduh PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
