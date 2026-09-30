import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Users,
  ShieldCheck,
  Filter,
  Layers,
  Volume2
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface MatrixRule {
  id: string;
  role: string;
  roleTitle: string;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'DIGEST';
  channels: string[];
  antiSpamThrottle: string;
  sampleEvent: string;
}

export const GuardianNotificationMatrix: React.FC = () => {
  const [rules, setRules] = useState<MatrixRule[]>([
    {
      id: 'MAT-01',
      role: 'SUPER_ADMIN',
      roleTitle: 'Super Admin Sovereign',
      priorityLevel: 'CRITICAL',
      channels: ['In-App Pop', 'Email Alert', 'WORM Log'],
      antiSpamThrottle: 'Instant for P0, 5 min throttle for P1',
      sampleEvent: 'System Crash Recovery, Security Breach, Storage Exhaustion'
    },
    {
      id: 'MAT-02',
      role: 'KETUA_YAYASAN',
      roleTitle: 'Ketua Yayasan Asy-Syifa',
      priorityLevel: 'HIGH',
      channels: ['Executive Briefing', 'WhatsApp Digest', 'In-App'],
      antiSpamThrottle: 'Daily Morning Digest + Emergency Real-time',
      sampleEvent: 'Laporan Keuangan Bulanan, Otorisasi SK, Insiden Kampus'
    },
    {
      id: 'MAT-03',
      role: 'KEPALA_SEKOLAH',
      roleTitle: 'Kepala Sekolah KB-TK',
      priorityLevel: 'HIGH',
      channels: ['In-App Alert', 'Push Notification'],
      antiSpamThrottle: '10 min grouping for non-urgent tasks',
      sampleEvent: 'Draft Surat Butuh Pengesahan, Kesiapan Kelas, Absensi Guru'
    },
    {
      id: 'MAT-04',
      role: 'ADMIN',
      roleTitle: 'Administrator SIM',
      priorityLevel: 'NORMAL',
      channels: ['In-App Dashboard', 'System Badge'],
      antiSpamThrottle: 'Debounced batch notification',
      sampleEvent: 'Sinkronisasi Backup Berhasil, Pendaftaran PPDB Masuk'
    },
    {
      id: 'MAT-05',
      role: 'GURU',
      roleTitle: 'Guru & Ustadzah Sentra',
      priorityLevel: 'NORMAL',
      channels: ['In-App Notification', 'Audio Chime'],
      antiSpamThrottle: 'Quiet Hours during teaching hours (08:00-11:00)',
      sampleEvent: 'Pengingat Input Raport, Jadwal Sentra, Penjemputan Santri'
    },
    {
      id: 'MAT-06',
      role: 'KEUANGAN',
      roleTitle: 'Bendahara Sekolah',
      priorityLevel: 'HIGH',
      channels: ['In-App Cash Ledger', 'Daily Summary'],
      antiSpamThrottle: 'Real-time payment receipt only',
      sampleEvent: 'Pembayaran SPP Lunas, Selisih Kas, Rekonsiliasi Bank'
    },
    {
      id: 'MAT-07',
      role: 'WALI_MURID',
      roleTitle: 'Wali Santri / Orang Tua',
      priorityLevel: 'NORMAL',
      channels: ['Portal Wali Santri', 'WhatsApp Gateway'],
      antiSpamThrottle: 'Anti-Spam Filter (Maks 2 pesan per hari)',
      sampleEvent: 'Santri Tiba di Sekolah, Penjemputan Sukses, Raport Terbit'
    }
  ]);

  const [testNotificationSent, setTestNotificationSent] = useState<boolean>(false);

  const handleSendTestMatrix = () => {
    setTestNotificationSent(true);
    blackBoxRecorder.record({
      moduleCode: 'R418-NOTIF-MATRIX',
      role: 'SUPER_ADMIN',
      eventType: 'ACTION',
      details: 'Guardian Notification Matrix smart dispatch executed across 7 role tiers with anti-spam throttle.',
      severity: 'INFO'
    });
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  return (
    <div id="guardian-notification-matrix-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R418 &bull; GUARDIAN NOTIFICATION MATRIX
              </span>
              <span className="text-xs text-slate-400 font-mono">Role-Tiered Intelligent Dispatcher &amp; Anti-Spam</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Bell className="w-8 h-8 text-purple-400" />
              Matriks Notifikasi Pintar Berbasis Peran &amp; Anti-Spam
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Pengiriman notifikasi presisi untuk Super Admin, Yayasan, Kepala Sekolah, Admin, Guru, Keuangan, dan Wali Santri dengan prioritas cerdas dan filter anti-spam.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSendTestMatrix}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Uji Kirim Matriks
            </button>
          </div>
        </div>
      </div>

      {testNotificationSent && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>Matriks notifikasi tersalurkan ke 7 tier peran dengan anti-spam throttle aktif.</span>
        </div>
      )}

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-[10px] text-slate-400">{rule.id} &bull; {rule.role}</span>
              <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                rule.priorityLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                rule.priorityLevel === 'HIGH' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              }`}>
                {rule.priorityLevel}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-xs">
              {rule.roleTitle}
            </h3>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Kanal Pengiriman:</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {rule.channels.map((c, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Anti-Spam Throttle:</span>
                <p className="text-slate-600 dark:text-slate-300 text-[10px]">{rule.antiSpamThrottle}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Contoh Kejadian:</span>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] italic">{rule.sampleEvent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
