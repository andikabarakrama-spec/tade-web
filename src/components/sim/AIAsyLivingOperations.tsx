import React, { useState } from 'react';
import { 
  Bot, 
  Sun, 
  Calendar, 
  CheckSquare, 
  Bell, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  FileText, 
  HeartHandshake,
  TrendingUp
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const AIAsyLivingOperations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MORNING' | 'DAILY' | 'WEEKLY' | 'TASKS' | 'GUIDANCE'>('MORNING');
  const [briefGenerated, setBriefGenerated] = useState<boolean>(true);

  const pendingTasks = [
    { id: 'T1', title: 'Verifikasi 8 Berkas Pendaftaran PPDB Baru', priority: 'HIGH', due: 'Hari ini 14:00', role: 'Operator' },
    { id: 'T2', title: 'Rekonsiliasi Kas Pembayaran SPP Bulan Agustus', priority: 'MEDIUM', due: 'Besok 10:00', role: 'Bendahara' },
    { id: 'T3', title: 'Pemeriksaan Rutin Lensa CCTV Koridor & Kelas', priority: 'LOW', due: 'Jumat 16:00', role: 'Staff Sarpras' },
    { id: 'T4', title: 'Penandatanganan Digital SK Pengangkatan Guru', priority: 'HIGH', due: 'Hari ini 16:30', role: 'Kepala Sekolah' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 dark:bg-pink-400/10 rounded-2xl border border-pink-500/20 text-pink-600 dark:text-pink-400">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200 font-mono">
                  R518 &bull; LIVING OPERATIONS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 font-mono">
                  TANGAN KANAN SUPER ADMIN
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                AI Asy Living Operations
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Asisten kecerdasan buatan aktif mendampingi operasional sekolah, menyusun taklimat harian, dan mengawal efisiensi kerja.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBriefGenerated(true);
                blackBoxRecorder.record({
                  moduleCode: 'R518',
                  eventType: 'ACTION',
                  severity: 'INFO',
                  details: 'Generated fresh morning executive brief with AI Asy Living Operations engine.'
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Perbarui Taklimat Asy
            </button>
          </div>
        </div>
      </div>

      {/* Operation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {[
          { id: 'MORNING', label: 'Taklimat Pagi (Morning Brief)', icon: Sun },
          { id: 'DAILY', label: 'Ringkasan Harian', icon: FileText },
          { id: 'WEEKLY', label: 'Ringkasan Mingguan', icon: TrendingUp },
          { id: 'TASKS', label: 'Tugas & Pengingat (4 Pending)', icon: CheckSquare },
          { id: 'GUIDANCE', label: 'Panduan Ramah Tamah', icon: HeartHandshake }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition-all border ${
                isActive 
                  ? 'bg-pink-600 text-white border-pink-600 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'MORNING' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Taklimat Eksekutif Pagi Hari &bull; {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">DISUSUN OTOMATIS OLEH ASY (06:00 WIB)</span>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-800/50 border border-pink-100 dark:border-slate-700 space-y-3">
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              <strong>Assalamu’alaikum Warahmatullahi Wabarakatuh, Bapak/Ibu Pimpinan Sekolah.</strong>
              <br />
              Berikut adalah ikhtisar operasional harian TK Aisyiyah 1 Bustanul Athfal per pagi ini:
            </p>

            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-mono list-disc pl-5">
              <li><strong>Kehadiran Siswa &amp; Guru:</strong> 96.4% santri dan 100% ustadzah tercatat hadir tepat waktu.</li>
              <li><strong>PPDB Gelombang 1:</strong> Terdapat 8 berkas baru masuk yang memerlukan verifikasi berkas daring.</li>
              <li><strong>Kesehatan Finansial:</strong> Arus kas operasional stabil, 88% SPP Agustus telah terekonsiliasi via auto-VA.</li>
              <li><strong>Integritas CCTV &amp; Perimeter:</strong> Seluruh 8 titik kamera koridor &amp; gerbang utama berstatus aktif 100%.</li>
              <li><strong>Agenda Yayasan:</strong> Rapat evaluasi kurikulum diagendakan besok siang pukul 13:30 WIB di Ruang Rapat.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'DAILY' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Ringkasan Operasional Harian</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">TRANSAKSI KAS HARI INI</span>
              <div className="text-lg font-bold text-emerald-600 mt-1">Rp 4.850.000 (18 Transaksi)</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">SURAT KELUAR RESMI</span>
              <div className="text-lg font-bold text-indigo-600 mt-1">3 Surat Ber-QR Sah</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">INCIDENT &amp; ANOMALI</span>
              <div className="text-lg font-bold text-teal-600 mt-1">0 Incident (Clean)</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'WEEKLY' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Proyeksi &amp; Tren Mingguan</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Performa mingguan menunjukkan kenaikan retensi pendaftar PPDB sebesar +12% dibanding pekan lalu. Semua sarpras beroperasi optimal.
          </p>
        </div>
      )}

      {activeTab === 'TASKS' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Daftar Tugas Tertunda &amp; Pengingat Cerdas</h3>
          <div className="space-y-3 font-mono">
            {pendingTasks.map(task => (
              <div key={task.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{task.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Tenggat: {task.due} &bull; PJ: {task.role}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  task.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'GUIDANCE' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Panduan Ramah Tamah AI Asy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            AI Asy dirancang ramah, empatik, dan menjunjung nilai adab Islami Kemuhammadiyahan. Asy siap membantu ustadzah menyusun modul ajar, membantu bendahara membuat kuitansi, serta mendampingi wali murid saat konsultasi PPDB.
          </p>
        </div>
      )}
    </div>
  );
};
