import React, { useState } from 'react';
import {
  Zap,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Sliders,
  Send,
  Calendar,
  MessageCircle,
  Database,
  ArrowRight,
  Power,
  Search,
  Sparkles,
  History,
  FileText
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  condition: string;
  action: string;
  schedule: string;
  active: boolean;
  runCount: number;
  lastRun: string;
  category: 'BILLING' | 'ACADEMIC' | 'SYSTEM' | 'PARENT_CARE';
}

export const SmartAutomationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'builder' | 'logs' | 'templates'>('workflows');
  const [searchWorkflow, setSearchWorkflow] = useState('');
  
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'AUTO-001',
      name: 'Pengingat Tagihan SPP Bulanan (Tanggal 10)',
      description: 'Mengirimkan pesan WhatsApp rincian tagihan SPP ke wali murid santri yang belum lunas.',
      trigger: 'Jadwal Kalender: Setiap Tanggal 10 Jam 08:00 WIB',
      condition: 'Status Tagihan SPP Bulan Berjalan = BELUM_LUNAS',
      action: 'Kirim WhatsApp Otomatis dengan Link Kwitansi & VA Bank',
      schedule: 'Bulanan (Tgl 10)',
      active: true,
      runCount: 248,
      lastRun: '10 Agt 2026, 08:00 WIB',
      category: 'BILLING'
    },
    {
      id: 'AUTO-002',
      name: 'Notifikasi Kehadiran Pagi Santri Masuk Kelas',
      description: 'Mengirimkan konfirmasi kehadiran santri ke ponsel orang tua saat guru mengabsen via SIM.',
      trigger: 'Event Presensi Kelas: Siswa Dicentang HADIR',
      condition: 'Waktu Input < 08:30 WIB',
      action: 'Kirim Push Notification & Pesan Singkat ke Wali Murid',
      schedule: 'Senin - Jumat (07:30 - 08:30)',
      active: true,
      runCount: 1420,
      lastRun: '15 Agt 2026, 07:45 WIB',
      category: 'PARENT_CARE'
    },
    {
      id: 'AUTO-003',
      name: 'Ucapan Selamat Milad Santri & Doa Berkah',
      description: 'Otomatis mengirimkan kartu ucapan selamat ulang tahun dengan doa kebaikan untuk ananda.',
      trigger: 'Deteksi Tanggal Lahir Siswa = Hari Ini',
      condition: 'Status Siswa = AKTIF',
      action: 'Generate Gambar Kartu Ucapan Asy Creative + WA Wali',
      schedule: 'Harian Jam 07:00 WIB',
      active: true,
      runCount: 84,
      lastRun: '15 Agt 2026, 07:00 WIB',
      category: 'ACADEMIC'
    },
    {
      id: 'AUTO-004',
      name: 'Snapshot Cold Backup Otomatis Jumat Malam',
      description: 'Mengekspor seluruh koleksi data sekolah dan mengenkripsi snapshot ke Cloud Storage.',
      trigger: 'Jadwal Mingguan: Setiap Hari Jumat Jam 23:00 WIB',
      condition: 'Koneksi Server Sehat & Tidak Ada Sesi Kasir Aktif',
      action: 'Jalankan Enkripsi SHA-256 + Upload Backup Coldline',
      schedule: 'Mingguan (Jumat 23:00)',
      active: true,
      runCount: 52,
      lastRun: '08 Agt 2026, 23:00 WIB',
      category: 'SYSTEM'
    }
  ]);

  // Form builder state
  const [newRuleName, setNewRuleName] = useState('');
  const [newTrigger, setNewTrigger] = useState('SCHEDULE');
  const [newCondition, setNewCondition] = useState('ALL');
  const [newAction, setNewAction] = useState('SEND_WA');
  const [builderSuccess, setBuilderSuccess] = useState(false);

  const handleToggleActive = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleSaveNewRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const created: AutomationRule = {
      id: `AUTO-${Date.now().toString().slice(-3)}`,
      name: newRuleName,
      description: 'Alur kerja kustom yang dibuat melalui No-Code Automation Builder.',
      trigger: newTrigger === 'SCHEDULE' ? 'Jadwal Rutin Harian' : 'Perubahan Data Santri/Keuangan',
      condition: 'Kondisi Sesuai Parameter Filter Terpilih',
      action: newAction === 'SEND_WA' ? 'Kirim Pesan WhatsApp Otomatis' : 'Generate Laporan & Backup',
      schedule: 'Aktif Terjadwal',
      active: true,
      runCount: 0,
      lastRun: 'Belum pernah dieksekusi',
      category: 'ACADEMIC'
    };

    setRules([created, ...rules]);
    setBuilderSuccess(true);
    setNewRuleName('');
    setTimeout(() => {
      setBuilderSuccess(false);
      setActiveTab('workflows');
    }, 1200);
  };

  const logs = [
    { time: '15 Agt 2026, 07:45:12 WIB', rule: 'Notifikasi Kehadiran Pagi Santri Masuk Kelas', status: 'SUCCESS', target: '24 Wali Murid Kelompok A1' },
    { time: '15 Agt 2026, 07:00:01 WIB', rule: 'Ucapan Selamat Milad Santri & Doa Berkah', status: 'SUCCESS', target: 'Ananda Rayyan (Kelompok B2)' },
    { time: '14 Agt 2026, 12:00:00 WIB', rule: 'Rekap Presensi Harian Guru ke Kepala Sekolah', status: 'SUCCESS', target: 'Kepala Sekolah (PDF WA)' },
    { time: '10 Agt 2026, 08:00:05 WIB', rule: 'Pengingat Tagihan SPP Bulanan (Tanggal 10)', status: 'SUCCESS', target: '48 Wali Murid Belum Lunas' }
  ];

  const filteredRules = rules.filter(r => 
    r.name.toLowerCase().includes(searchWorkflow.toLowerCase()) || 
    r.description.toLowerCase().includes(searchWorkflow.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Smart Automation Center</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                99.8% Success Rate
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat otomasi cerdas tanpa kode: pemicu tagihan SPP, notifikasi absensi, ucapan milad, dan pemeliharaan data background.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('builder')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Buat Otomasi Baru
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('workflows')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'workflows' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Alur Kerja Aktif ({rules.length})
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'builder' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          No-Code Flow Builder
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          Audit Trail & Log Eksekusi
        </button>
      </div>

      {/* TAB: Workflows */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari alur kerja otomatis..."
                value={searchWorkflow}
                onChange={e => setSearchWorkflow(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {rules.filter(r => r.active).length} Alur Berjalan Otomatis
            </span>
          </div>

          <div className="space-y-3">
            {filteredRules.map(rule => (
              <div
                key={rule.id}
                className={`p-5 rounded-2xl border transition ${
                  rule.active ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {rule.id}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">{rule.name}</h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      rule.category === 'BILLING' ? 'bg-emerald-50 text-emerald-700' :
                      rule.category === 'PARENT_CARE' ? 'bg-indigo-50 text-indigo-700' :
                      rule.category === 'SYSTEM' ? 'bg-cyan-50 text-cyan-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {rule.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      Eksekusi: <strong className="text-slate-700">{rule.runCount}x</strong>
                    </span>
                    <button
                      onClick={() => handleToggleActive(rule.id)}
                      className={`p-1.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
                        rule.active
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {rule.active ? 'Aktif' : 'Non-Aktif'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4">{rule.description}</p>

                {/* Workflow Sequence Block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-500" /> 1. Trigger (Pemicu)
                    </span>
                    <p className="font-medium text-slate-800 text-[11px]">{rule.trigger}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-amber-500" /> 2. Kondisi Filter
                    </span>
                    <p className="font-medium text-slate-800 text-[11px]">{rule.condition}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Send className="w-3 h-3 text-emerald-500" /> 3. Aksi Otomatis
                    </span>
                    <p className="font-medium text-slate-800 text-[11px]">{rule.action}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Jadwal: <strong>{rule.schedule}</strong></span>
                  <span>Terakhir Jalan: {rule.lastRun}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Builder */}
      {activeTab === 'builder' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Visual No-Code Flow Builder
            </h2>
            <p className="text-xs text-slate-500">Susun logika otomasi sekolah dengan merangkai Pemicu (Trigger), Syarat (Condition), dan Aksi (Action).</p>
          </div>

          {builderSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Alur kerja otomasi baru berhasil disimpan dan diaktifkan!
            </div>
          )}

          <form onSubmit={handleSaveNewRule} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Alur Kerja Otomasi</label>
              <input
                type="text"
                placeholder="Contoh: Rekap Harian Absensi Santri ke Kepala Sekolah Jam 14:00"
                value={newRuleName}
                onChange={e => setNewRuleName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Trigger */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-2">
                <label className="block text-xs font-bold text-indigo-950">1. PILIH PEMICU (TRIGGER)</label>
                <select
                  value={newTrigger}
                  onChange={e => setNewTrigger(e.target.value)}
                  className="w-full text-xs bg-white border border-indigo-200 rounded-xl px-3 py-2 font-medium text-slate-700"
                >
                  <option value="SCHEDULE">Jadwal Jam / Waktu Rutin</option>
                  <option value="PRESENSI_DONE">Selesai Presensi Kelas</option>
                  <option value="PAYMENT_RECEIVED">Pembayaran SPP Masuk</option>
                  <option value="STUDENT_BIRTHDAY">Hari Ulang Tahun Santri</option>
                </select>
                <p className="text-[11px] text-slate-500">Kapan proses otomasi harus mulai dievaluasi oleh sistem.</p>
              </div>

              {/* Condition */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2">
                <label className="block text-xs font-bold text-amber-950">2. SYARAT KONDISI (CONDITION)</label>
                <select
                  value={newCondition}
                  onChange={e => setNewCondition(e.target.value)}
                  className="w-full text-xs bg-white border border-amber-200 rounded-xl px-3 py-2 font-medium text-slate-700"
                >
                  <option value="ALL">Tanpa Syarat (Eksekusi Semua)</option>
                  <option value="STATUS_UNPAID">Hanya Santri Belum Lunas SPP</option>
                  <option value="STATUS_ABSENT">Hanya Santri yang Tercatat Izin/Sakit</option>
                  <option value="VIP_STUDENT">Hanya Kelompok A / B Spesifik</option>
                </select>
                <p className="text-[11px] text-slate-500">Filter tambahan untuk memastikan ketepatan sasaran.</p>
              </div>

              {/* Action */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
                <label className="block text-xs font-bold text-emerald-950">3. AKSI OTOMATIS (ACTION)</label>
                <select
                  value={newAction}
                  onChange={e => setNewAction(e.target.value)}
                  className="w-full text-xs bg-white border border-emerald-200 rounded-xl px-3 py-2 font-medium text-slate-700"
                >
                  <option value="SEND_WA">Kirim Pesan WhatsApp Otomatis</option>
                  <option value="SEND_PUSH">Kirim Push Notification Aplikasi</option>
                  <option value="GENERATE_PDF">Generate PDF & Kirim ke Telegram</option>
                  <option value="BACKUP_DATA">Jalankan Snapshot Enkripsi DB</option>
                </select>
                <p className="text-[11px] text-slate-500">Tindakan nyata yang akan dieksekusi mesin TADE.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('workflows')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Simpan & Jalankan Otomasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Audit Trail Riwayat Eksekusi Otomasi</h2>
              <p className="text-xs text-slate-500">Log jejak digital eksekusi workflow secara transparan dan akuntabel.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              100% Audit Valid
            </span>
          </div>

          <div className="space-y-2.5">
            {logs.map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">{log.rule}</span>
                    <div className="text-[11px] text-slate-500">Sasaran: {log.target}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-600 font-bold">{log.status}</span>
                  <div className="text-[10px] text-slate-400">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
