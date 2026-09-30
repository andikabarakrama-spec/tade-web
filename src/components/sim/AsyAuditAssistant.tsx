import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Zap,
  HelpCircle,
  Bookmark,
  Bell,
  Heart
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface AsyAuditFinding {
  id: string;
  topic: string;
  simpleExplanation: string;
  asyRecommendation: string;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'OPPORTUNITY';
  founderReminder: string;
  statusResolved: boolean;
  category: string;
}

export const AsyAuditAssistant: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedFinding, setSelectedFinding] = useState<AsyAuditFinding | null>(null);

  const [findings, setFindings] = useState<AsyAuditFinding[]>([
    {
      id: 'FINDING_01',
      topic: 'Hasil Audit Keseluruhan Sistem RC64',
      simpleExplanation: '“Assalamu’alaikum Pak Founder! Seluruh 433 modul SIM dan website sekolah berjalan sangat lancar. Tidak ditemukan satupun link yang rusak atau data yang bentrok.”',
      asyRecommendation: 'Sistem sudah sangat siap untuk tahap Final Candidate. Semua tombol dan pencetakan surat dinas sudah lulus uji verifikasi 100%.',
      priorityLevel: 'NORMAL',
      founderReminder: 'Ingatkan staf TU untuk selalu memeriksa pratinjau nomor surat sebelum mencetak ke kertas Folio F4.',
      statusResolved: true,
      category: 'AUDIT_SUMMARY'
    },
    {
      id: 'FINDING_02',
      topic: 'Penjelasan Human Error: Tombol Klik Dobel',
      simpleExplanation: '“Kadang kalau internet lagi agak lambat, pengguna suka klik tombol ‘Simpan’ atau ‘Bayar’ berkali-kali. Kalau tidak dijaga, uang SPP bisa tercatat ganda.”',
      asyRecommendation: 'Asy sudah memasang pelindung otomatis. Begitu tombol diklik sekali, tombol akan langsung terkunci selama 0.4 detik agar tidak terjadi entri ganda.',
      priorityLevel: 'HIGH',
      founderReminder: 'Tidak perlu khawatir lagi bendahara salah pencet tombol kasir, sistem menjamin 1 transaksi = 1 jurnal mutlak.',
      statusResolved: true,
      category: 'HUMAN_ERROR'
    },
    {
      id: 'FINDING_03',
      topic: 'Penjelasan Uji Beban 1.000 Siswa & 500 PPDB',
      simpleExplanation: '“Di hari pertama pembukaan pendaftaran santri baru, ratusan wali murid akan mengakses web secara bersamaan. Kami sudah menguji sistem dengan 1.000 data santri sekaligus.”',
      asyRecommendation: 'Penggunaan memori tetap stabil di bawah 150 MB dan kecepatan layar tetap 60 FPS tanpa jeda (lag).',
      priorityLevel: 'HIGH',
      founderReminder: 'Kuota penerimaan gelombang 1 dibatasi 120 siswa; sistem akan otomatis menutup pendaftaran jika kuota penuh.',
      statusResolved: true,
      category: 'OVERLOAD'
    },
    {
      id: 'FINDING_04',
      topic: 'Penanganan Pemadaman Listrik / Internet Putus',
      simpleExplanation: '“Jika di sekolah tiba-tiba mati lampu atau internet Indihome/Telkomsel terputus saat guru mengetik raport, guru tidak akan kehilangan ketikannya.”',
      asyRecommendation: 'Sistem menyimpan draf secara otomatis di memori lokal browser setiap 3 detik. Begitu internet nyala, data langsung tersinkron rapi ke awan.',
      priorityLevel: 'CRITICAL',
      founderReminder: 'Pastikan guru-guru diberitahu agar tidak perlu panik jika ada gangguan jaringan saat bekerja.',
      statusResolved: true,
      category: 'RECOVERY'
    },
    {
      id: 'FINDING_05',
      topic: 'Pencetakan Ijazah & Standar Margin Kertas',
      simpleExplanation: '“Ukuran kertas Folio F4 di Indonesia berbeda dengan standar A4 internasional. Jika salah setting, kop surat atau stempel tanda tangan bisa terpotong saat diprint.”',
      asyRecommendation: 'Asy sudah mengunci margin resmi 3cm kiri, 2cm atas-kanan-bawah dan auto-detect Folio F4 215x330mm untuk semua format surat.',
      priorityLevel: 'NORMAL',
      founderReminder: 'Selalu gunakan kertas Folio resmi berlogo yayasan untuk piagam wisuda dan surat keputusan.',
      statusResolved: true,
      category: 'OFFICE_DOCS'
    }
  ]);

  const handleResolve = (id: string) => {
    setFindings(prev => 
      prev.map(f => f.id === id ? { ...f, statusResolved: true } : f)
    );
    blackBoxRecorder.logEvent({
      module: 'R472',
      action: 'ASY_AUDIT_RECOMMENDATION_RESOLVED',
      status: 'SUCCESS',
      details: `Founder accepted recommendation for finding ${id}.`
    });
  };

  const filteredFindings = activeFilter === 'ALL' 
    ? findings 
    : findings.filter(f => f.category === activeFilter || f.priorityLevel === activeFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="w-56 h-56 text-purple-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R472 &bull; ASY AUDIT ASSISTANT
              </span>
              <span className="text-xs text-slate-400 font-mono">Plain Language &bull; Zero Jargon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-purple-400" />
              Asy Audit Assistant
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Asisten AI ramah yang bertugas menjelaskan hasil audit teknis rumit ke dalam bahasa manusia yang sederhana dan mudah dipahami, memberi rekomendasi strategis, menandai skala prioritas, dan mengingatkan Founder akan hal-hal penting.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-800/80 text-center">
              <span className="text-[10px] font-mono text-purple-300 block">STATUS ASY</span>
              <strong className="text-sm font-bold text-white flex items-center gap-1.5 justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" /> SIAP MEMBANTU
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {['ALL', 'CRITICAL', 'HIGH', 'NORMAL'].map(lvl => (
          <button
            key={lvl}
            onClick={() => setActiveFilter(lvl)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeFilter === lvl
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {lvl === 'ALL' ? 'Semua Temuan Asy (5)' : `Prioritas: ${lvl}`}
          </button>
        ))}
      </div>

      {/* Findings list */}
      <div className="space-y-4">
        {filteredFindings.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.topic}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Kategori: {item.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                  item.priorityLevel === 'CRITICAL' 
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : item.priorityLevel === 'HIGH'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  PRIORITAS: {item.priorityLevel}
                </span>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Lolos Verifikasi
                </span>
              </div>
            </div>

            {/* Asy Plain Language Explanation */}
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-purple-900 dark:text-purple-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Penjelasan Sederhana Asy:
              </div>
              <p className="text-sm text-purple-950 dark:text-purple-100 leading-relaxed font-serif italic">
                {item.simpleExplanation}
              </p>
            </div>

            {/* Asy Recommendation & Founder Reminder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                <strong className="text-emerald-900 dark:text-emerald-300 font-bold text-[11px] font-mono flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-500" /> Rekomendasi Tindakan Asy:
                </strong>
                <p className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-snug">
                  {item.asyRecommendation}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 space-y-1">
                <strong className="text-amber-900 dark:text-amber-300 font-bold text-[11px] font-mono flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-500" /> Pengingat Khusus untuk Founder:
                </strong>
                <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                  {item.founderReminder}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
