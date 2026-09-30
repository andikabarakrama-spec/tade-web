import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  Radio,
  Zap,
  Filter,
  Eye,
  Layers,
  Crown,
  Search
} from 'lucide-react';

export interface TimelineEntry {
  id: string;
  time: string;
  relativeTime: string;
  actor: string;
  actorType: 'MONITORING' | 'AI_CABINET' | 'DDOS_GUARDIAN' | 'PAYMENT_CORE' | 'RECOVERY' | 'ROYAL_GUARD' | 'VOICE_SHIELD';
  action: string;
  status: 'SUCCESS' | 'INFO' | 'SHIELDED' | 'VERIFIED';
  details: string;
  impact: string;
}

export const GuardianCoordinationTimeline: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const entries: TimelineEntry[] = [
    {
      id: 'time-01',
      time: '08:04:12 WIB',
      relativeTime: '1 menit lalu',
      actor: 'Guardian Royal Guard',
      actorType: 'ROYAL_GUARD',
      action: 'Verifikasi Kriptografis Brankas Presidensial (Presidential Vault Integrity)',
      status: 'VERIFIED',
      details: 'Pemeriksaan SHA-256 berkala terhadap konfigurasi sistem, invariant FIND-08 sampai FIND-10 menghasilkan status 100% klop tanpa deviasi.',
      impact: 'Zero Drift pada 7 Invariant Konstitusi TADE v3.2.'
    },
    {
      id: 'time-02',
      time: '08:03:40 WIB',
      relativeTime: '2 menit lalu',
      actor: 'Guardian Recovery Engine',
      actorType: 'RECOVERY',
      action: 'Konfirmasi Integritas Snapshot Cold Backup & Sync Cache',
      status: 'SUCCESS',
      details: 'Audit checkpoint IndexedDB lokal dan sinkronisasi snapshot Firestore menunjukkan konsistensi data riwayat pembayaran dan mutabaah.',
      impact: 'RPO 0 detik, RTO < 3 detik tercapai.'
    },
    {
      id: 'time-03',
      time: '08:02:55 WIB',
      relativeTime: '3 menit lalu',
      actor: 'Guardian Payment Core (FIND-08-R4)',
      actorType: 'PAYMENT_CORE',
      action: 'Payment Isolation Guard Tetap Stabil Selama Lonjakan Trafik',
      status: 'SHIELDED',
      details: 'Meskipun traffic portal mengalami kenaikan 14%, lock idempotency H0-01 dan penomoran kwitansi kasir tetap berjalan terisolasi tanpa interupsi.',
      impact: '0 kwitansi ganda, 0 transaksi tertunda.'
    },
    {
      id: 'time-04',
      time: '08:02:10 WIB',
      relativeTime: '4 menit lalu',
      actor: 'Guardian DDoS & Honey Shield',
      actorType: 'DDOS_GUARDIAN',
      action: 'Penyesuaian Ambang Batas Ingress & Honey Shield IP Trapping',
      status: 'SUCCESS',
      details: 'Rate limiter otomatis menyesuaikan kuota 100 req/mnt/IP secara adaptif untuk mencegah false positive pada koneksi Wi-Fi guru madrasah.',
      impact: 'Akses dewan guru 100% lancar, anomali bot diisolasi.'
    },
    {
      id: 'time-05',
      time: '08:01:45 WIB',
      relativeTime: '5 menit lalu',
      actor: 'AI Asy Intelligence Minister',
      actorType: 'AI_CABINET',
      action: 'Kompilasi Laporan Prediktif Beban Server Pagi Hari',
      status: 'INFO',
      details: 'AI Asy menganalisis pola presensi pagi dan lonjakan unduh e-Rapor santri, meneruskan rekomendasi alokasi cache ke Guardian Monitoring.',
      impact: 'Rekomendasi non-destruktif dikirim ke kabinet.'
    },
    {
      id: 'time-06',
      time: '08:01:00 WIB',
      relativeTime: '6 menit lalu',
      actor: 'Guardian Observability Watchtower',
      actorType: 'MONITORING',
      action: 'Deteksi Lonjakan Trafik Presensi Santri Pukul 08:00 WIB',
      status: 'INFO',
      details: 'Terjadi peningkatan 45 koneksi aktif bersamaan saat kedatangan santri TK-A dan TK-B. Latensi tetap berada di 18ms.',
      impact: 'Seluruh subsistem dialihkan ke Mode Koordinasi Aktif.'
    }
  ];

  const filteredEntries = entries.filter((e) => {
    if (filterType === 'ALL') return true;
    return e.actorType === filterType;
  });

  const getActorBadge = (type: TimelineEntry['actorType']) => {
    switch (type) {
      case 'ROYAL_GUARD':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">Royal Guard</span>;
      case 'RECOVERY':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Recovery</span>;
      case 'PAYMENT_CORE':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">Payment Core</span>;
      case 'DDOS_GUARDIAN':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">DDoS Shield</span>;
      case 'AI_CABINET':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/10 text-teal-600 border border-teal-500/20">AI Asy Cabinet</span>;
      case 'MONITORING':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-600 border border-slate-500/20">Watchtower</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-600">Guardian</span>;
    }
  };

  return (
    <div id="guardian-coordination-timeline" className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Kronologi Koordinasi Antar-Guardian</h3>
            <p className="text-xs text-stone-500">
              Rekam jejak orkestrasi real-time aksi pertahanan dan komunikasi lintas sektor
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'ALL', label: 'Semua Aktor' },
            { key: 'ROYAL_GUARD', label: 'Royal Guard' },
            { key: 'PAYMENT_CORE', label: 'Payment Core' },
            { key: 'DDOS_GUARDIAN', label: 'DDoS Shield' },
            { key: 'AI_CABINET', label: 'AI Cabinet' },
            { key: 'RECOVERY', label: 'Recovery' }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === f.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
        {filteredEntries.map((item, index) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot Indicator */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-slate-900 group-hover:scale-125 transition-transform" />

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-slate-400 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.time}
                  </span>
                  <span className="text-[11px] text-stone-400">({item.relativeTime})</span>
                  {getActorBadge(item.actorType)}
                </div>
                <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terkoordinasi
                </span>
              </div>

              <h4 className="text-sm font-bold text-stone-900 mt-1">{item.action}</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                {item.details}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                <div className="text-stone-500">
                  <span className="font-semibold text-stone-700">Dampak: </span>
                  {item.impact}
                </div>
                <span className="font-mono text-[10px] text-stone-400">Actor: {item.actor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
