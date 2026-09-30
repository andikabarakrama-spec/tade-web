import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Sun, 
  CheckSquare, 
  UserPlus, 
  FileText, 
  DollarSign, 
  GraduationCap, 
  Bell, 
  Users, 
  UserCheck, 
  Star, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const AIAsyCommandCenter: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'OVERVIEW' | 'TASKS' | 'STUDENTS' | 'OFFICE'>('OVERVIEW');
  const [completedTasks, setCompletedTasks] = useState<string[]>(['T1', 'T3']);

  const toggleTask = (id: string, title: string) => {
    if (completedTasks.includes(id)) {
      setCompletedTasks(completedTasks.filter(t => t !== id));
    } else {
      setCompletedTasks([...completedTasks, id]);
      blackBoxRecorder.record({
        moduleCode: 'R495',
        eventType: 'ACTION',
        severity: 'INFO',
        details: `AI Asy completed task: ${title}`
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R495 &bull; AI ASY COMMAND CENTER
          </span>
          <span className="text-xs text-slate-400 font-mono">Tangan Kanan Super Admin &bull; Living Intelligence</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-cyan-400" />
              AI Asy Command Center &bull; Pusat Komando Asisten Cerdas
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Asisten proaktif operasional kampus TK Asy Syifa: mengotomatisasi Taklimat Pagi (Morning Brief), koordinasi PPDB, draf surat dinas, pemantauan KBM sentra, rekonsiliasi kasir SPP, hingga pengingat prioritas Ketua Yayasan.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 text-center shrink-0">
            <span className="text-[10px] font-mono text-cyan-300 block">STATUS ASISTEN PROAKTIF</span>
            <span className="text-lg font-bold text-white font-mono flex items-center justify-center gap-1.5 mt-0.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" /> ASY ACTIVE 24/7
            </span>
            <span className="text-[10px] text-emerald-400 block font-bold">100% SINKRON TADE</span>
          </div>
        </div>

        {/* 4 Key Vital Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TAKLIMAT PAGI (MORNING BRIEF)</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">SIAP &bull; 06:30 WIB</span>
            <span className="text-[9px] text-emerald-500 block">5 Sentra Normal</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">PROGRES PPDB 2026/2027</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">42 / 45 Siswa (93%)</span>
            <span className="text-[9px] text-cyan-500 block">3 Kuota Tersisa</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">REKONSILIASI KASIR SPP</span>
            <span className="text-lg font-bold text-purple-400 font-mono">Rp 48.500.000</span>
            <span className="text-[9px] text-purple-400 block">97.8% Terverifikasi QR</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">DRAF SURAT DINAS RESMI</span>
            <span className="text-lg font-bold text-amber-400 font-mono">142 Dokumen</span>
            <span className="text-[9px] text-amber-500 block">Zero Typo WORM Hash</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Asy Proactive Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Morning Brief & Automated Task Orchestrator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asy Morning Brief Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  ASY MORNING BRIEF &bull; TAKLIMAT EKSEKUTIF HARI INI
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Update Otomatis
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                <strong>Assalamu’alaikum Warahmatullahi Wabarakatuh.</strong><br />
                Berikut ringkasan harian operasional kampus TK Asy Syifa:
              </p>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4 font-sans">
                <li><strong>Kehadiran Guru:</strong> 100% guru pengampu sentra hadir tepat waktu sebelum pukul 07:15 WIB.</li>
                <li><strong>Kesiapan Kelas:</strong> Kelima sentra (Balok, Persiapan, Seni, Main Peran, Bahan Alam) berstatus <strong>PRIMA (Hijau)</strong>.</li>
                <li><strong>PPDB 2026/2027:</strong> Terdapat 2 formulir baru diverifikasi pagi ini, sisa kuota tinggal 3 santri.</li>
                <li><strong>Keuangan:</strong> Setoran SPP harian Rp 4.250.000 telah masuk rekonsiliasi kasir tanpa selisih.</li>
                <li><strong>Agenda Penting:</strong> Kunjungan supervisi kurikulum terjadwal pukul 10:00 WIB di Aula Serbaguna.</li>
              </ul>
            </div>
          </div>

          {/* Automated Task Checklist */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  DAFTAR TUGAS OTOMATIS ASY HARI INI
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {completedTasks.length}/5 Selesai
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'T1', title: 'Sinkronisasi Presensi Siswa & Guru Pagi', desc: 'Presensi 72 siswa & 8 guru otomatis terhitung di Buku Induk Digital.', tag: 'Akademik' },
                { id: 'T2', title: 'Penerbitan Nomor Surat Undangan Rapat Yayasan', desc: 'Format nomor resmi 421.1/089/TK-ASY/UND/2026 siap cetak F4.', tag: 'Persuratan' },
                { id: 'T3', title: 'Rekonsiliasi Kwitansi SPP Bank BSI & Tunai', desc: 'Verifikasi SHA-256 dan stempel QR digital pada seluruh transaksi kasir.', tag: 'Keuangan' },
                { id: 'T4', title: 'Verifikasi Dokumen Kelayakan Raport Semester', desc: 'Pengecekan formula capaian Kurikulum Merdeka & narasi deskriptif.', tag: 'Raport' },
                { id: 'T5', title: 'Pengiriman Notifikasi WhatsApp Gateway ke Wali Murid', desc: 'Laporan harian aktivitas sentra dan menu makan siang siswa.', tag: 'Wali Murid' }
              ].map(task => {
                const isDone = completedTasks.includes(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id, task.title)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    <button
                      className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isDone ? 'bg-emerald-600 text-white' : 'border border-slate-400 dark:border-slate-500'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold ${isDone ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                          {task.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {task.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Asy Action Hub & Founder Priorities */}
        <div className="space-y-6">
          {/* Founder Priorities Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                PRIORITAS KETUA YAYASAN
              </h3>
              <span className="text-xs font-mono font-bold text-amber-500">Tinggi</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block">1. TARGET PENUTUPAN PPDB</span>
                <p className="text-slate-700 dark:text-slate-300 font-sans text-xs">
                  Sisa 3 santri ditargetkan terpenuhi sebelum tanggal 25 Agustus 2026.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">2. DOKUMEN AKREDITASI A</span>
                <p className="text-slate-700 dark:text-slate-300 font-sans text-xs">
                  Kesiapan 8 Standar Nasional Pendidikan (SNP) telah mencapai 100%.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">3. KAS YAYASAN DI BSI</span>
                <p className="text-slate-700 dark:text-slate-300 font-sans text-xs">
                  Seluruh penerimaan SPP dan infak tersimpan di rekening Bank Syariah Indonesia.
                </p>
              </div>
            </div>
          </div>

          {/* Activity Stream */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                LOG AKTIVITAS ASY REAL-TIME
              </h3>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">LIVE</span>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">07:30 &bull; Morning brief dikirim ke Founder</span>
                <span className="text-emerald-500 font-bold">✓ Sent</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">07:45 &bull; Sinkronisasi 11 saluran CCTV</span>
                <span className="text-emerald-500 font-bold">✓ 100%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">08:00 &bull; Auto-backup database cloud</span>
                <span className="text-emerald-500 font-bold">✓ 4.2 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
