import React, { useState } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  ArrowLeftRight, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  Video, 
  Database, 
  Sparkles,
  MessageSquare,
  Lock
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface AICoordinationEvent {
  id: string;
  triggerSource: 'GUARDIAN' | 'ASY';
  title: string;
  guardianAction: string;
  asyResponse: string;
  status: 'SYNCED' | 'ACTIVE';
  timestamp: string;
}

const INITIAL_COORDINATION_EVENTS: AICoordinationEvent[] = [
  {
    id: 'SYNC-01',
    triggerSource: 'GUARDIAN',
    title: 'Surat Dinas Selesai Dicetak & Diterbitkan',
    guardianAction: 'Guardian mengunci dokumen ke WORM Storage & memverifikasi hash SHA-256.',
    asyResponse: 'Asy mengirimkan notifikasi resmi kepada Kepala Sekolah dan menyiapkan arsip digital.',
    status: 'SYNCED',
    timestamp: '07:42 WIB'
  },
  {
    id: 'SYNC-02',
    triggerSource: 'GUARDIAN',
    title: 'Simulasi CCTV Fluktuasi Jaringan di Sentra Seni',
    guardianAction: 'Guardian mendeteksi packet loss 2% dan mengalihkan ke buffer sekunder terenkripsi.',
    asyResponse: 'Asy memberikan penjelasan diagnostik bersahabat pada matriks kesiapan KBM sentra.',
    status: 'SYNCED',
    timestamp: '08:15 WIB'
  },
  {
    id: 'SYNC-03',
    triggerSource: 'ASY',
    title: 'Pendaftaran Santri Baru PPDB Dikonfirmasi Kasir',
    guardianAction: 'Guardian memvalidasi bukti transfer BSI, menghasilkan QR Kwitansi & audit log.',
    asyResponse: 'Asy menambahkan data calon santri ke Buku Induk & menyusun Surat Tanda Penerimaan.',
    status: 'SYNCED',
    timestamp: '08:30 WIB'
  },
  {
    id: 'SYNC-04',
    triggerSource: 'GUARDIAN',
    title: 'Pemeriksaan Snapshot Cadangan Cloud Harian',
    guardianAction: 'Guardian menyelesaikan enkripsi snapshot 4.2 MB ke brankas data terisolasi.',
    asyResponse: 'Asy mencatat status hijau pada Taklimat Pagi untuk Ketua Yayasan.',
    status: 'SYNCED',
    timestamp: '08:45 WIB'
  }
];

export const DualAICoordinationEngine: React.FC = () => {
  const [events, setEvents] = useState<AICoordinationEvent[]>(INITIAL_COORDINATION_EVENTS);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleTriggerSync = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const newEvent: AICoordinationEvent = {
        id: `SYNC-0${events.length + 1}`,
        triggerSource: 'GUARDIAN',
        title: 'Verifikasi Integritas Telemetri Kampus Real-Time',
        guardianAction: 'Guardian memvalidasi zero tamper pada seluruh 11 ruangan sentra & pos satpam.',
        asyResponse: 'Asy menyegarkan ringkasan eksekutif Founder Command Map dengan status 100% HIJAU.',
        status: 'SYNCED',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
      setEvents([newEvent, ...events]);
      blackBoxRecorder.record({
        moduleCode: 'R497',
        eventType: 'ACTION',
        severity: 'INFO',
        details: 'Dual AI Coordination handshake executed between AI Asy and Guardian Core.'
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R497 &bull; DUAL AI COORDINATION ENGINE
          </span>
          <span className="text-xs text-slate-400 font-mono">Sinergi Tangan Kanan &amp; Tangan Kiri Super Admin</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ArrowLeftRight className="w-8 h-8 text-cyan-400" />
              Dual AI Coordination Engine &bull; Jembatan Sinergi Asy &amp; Guardian
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Protokol sinkronisasi dua arah otomatis: Guardian mendeteksi anomali/keamanan dan memvalidasi integritas data kriptografis, sementara AI Asy menerjemahkan ke dalam tindakan operasional ramah pengguna dan penjelasan eksekutif.
            </p>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSimulating}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Sinkronisasi...' : 'Sinkronkan Asy & Guardian'}
          </button>
        </div>
      </div>

      {/* Dual AI Topology Schematic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: AI Asy Persona Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-cyan-200 dark:border-cyan-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                AI ASY &bull; TANGAN KANAN
              </h3>
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">Living Intelligence &amp; Operasional</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Mengurus Taklimat Pagi, pengingat tugas guru, draf dokumen resmi, koordinasi PPDB, dan komunikasi bersahabat dengan wali murid.
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
            Latency Respon: &lt; 8ms &bull; Zero Fatigue
          </div>
        </div>

        {/* Center: Realtime Interlock Protocol */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white text-center space-y-2 border border-slate-800">
          <Zap className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">
            ASYNC DUAL-SOCKET INTERLOCK
          </h4>
          <span className="text-[10px] font-mono text-emerald-400 block font-bold">
            ● 100% MUTUAL HANDSHAKE ACTIVE
          </span>
          <p className="text-[11px] text-slate-400 font-serif">
            “Guardian menjamin keamanan mutlak, Asy menggerakkan operasional harian.”
          </p>
        </div>

        {/* Right: Guardian Persona Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-purple-200 dark:border-purple-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                GUARDIAN &bull; TANGAN KIRI
              </h3>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">Keamanan, Audit &amp; Recovery</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Memvalidasi integritas RBAC, snapshot WORM terisolasi, enkripsi stream CCTV 11 saluran, dan respon insiden otomatis.
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
            Enkripsi: SHA-256 + AES-256 GCM
          </div>
        </div>
      </div>

      {/* Synchronized Event Stream */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            LOG KOORDINASI &amp; PERTUKARAN STATUS AKTIF
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {events.length} Event Terkoordinasi
          </span>
        </div>

        <div className="space-y-3">
          {events.map(ev => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-700 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    ev.triggerSource === 'GUARDIAN'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                  }`}>
                    {ev.triggerSource} TRIGGER
                  </span>
                  <strong className="text-xs text-slate-900 dark:text-white">{ev.title}</strong>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{ev.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/40">
                  <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 block mb-0.5">
                    🛡️ AKSI GUARDIAN (KEAMANAN):
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{ev.guardianAction}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-cyan-100 dark:border-cyan-900/40">
                  <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 block mb-0.5">
                    🤖 RESPON AI ASY (OPERASIONAL):
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{ev.asyResponse}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
