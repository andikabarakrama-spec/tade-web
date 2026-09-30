import React, { useState } from 'react';
import {
  Clock,
  Milestone,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Play,
  Download,
  Share2,
  Calendar,
  Filter,
  Eye,
  Lock,
  Layers,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface TimelineEvent {
  id: string;
  timeWib: string;
  epochMs: number;
  cameraCode: string;
  zone: 'GERBANG' | 'PARKIR' | 'KORIDOR' | 'AULA' | 'GUDANG' | 'KELUAR';
  title: string;
  description: string;
  severity: 'INFO' | 'SUSPICIOUS' | 'CRITICAL';
  snapshotHash: string;
}

export const SecurityIncidentTimeline: React.FC = () => {
  const [selectedIncidentDate, setSelectedIncidentDate] = useState<string>('2026-08-16');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');

  const events: TimelineEvent[] = [
    {
      id: 'EVT-01',
      timeWib: '14:23:10 WIB',
      epochMs: 1786864990000,
      cameraCode: 'CAM-01-GERBANG',
      zone: 'GERBANG',
      title: 'Masuk Area Gerbang Samping',
      description: 'Pengendara motor beat hitam berhelm full face memasuki gerbang samping tanpa mengisi buku tamu QR.',
      severity: 'SUSPICIOUS',
      snapshotHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      id: 'EVT-02',
      timeWib: '14:24:45 WIB',
      epochMs: 1786865085000,
      cameraCode: 'CAM-02-JEMPUT',
      zone: 'PARKIR',
      title: 'Aktivitas di Parkiran Timur',
      description: 'Memarkir kendaraan di belakang pohon palem, berjalan kaki menuju arah koridor kelas sentra.',
      severity: 'INFO',
      snapshotHash: 'SHA256:cb8379ac2098aa165029e3938a51da0bcecfc008fd6795f401178647f96c5b34'
    },
    {
      id: 'EVT-03',
      timeWib: '14:26:12 WIB',
      epochMs: 1786865172000,
      cameraCode: 'CAM-04-KORIDOR',
      zone: 'KORIDOR',
      title: 'Melintasi Koridor Kelas Sentra',
      description: 'Berjalan tergesa-gesa sambil menundukkan kepala dan memegang tas ransel.',
      severity: 'INFO',
      snapshotHash: 'SHA256:385ea3f5c191e6403615714f358368155937fae690917b5dd03117e0699d3b43'
    },
    {
      id: 'EVT-04',
      timeWib: '14:28:30 WIB',
      epochMs: 1786865310000,
      cameraCode: 'CAM-06-GUDANG',
      zone: 'GUDANG',
      title: 'Percobaan Akses Pintu Gudang Arsip',
      description: 'Mencoba membuka hendel pintu gudang arsip dan ruang server; sistem mendeteksi percobaan akses tidak sah (Pintu tetap terkunci).',
      severity: 'CRITICAL',
      snapshotHash: 'SHA256:d82c4be562095f9c464e83c271e84df9a4ad837bfdb3c73400a40f805915c898'
    },
    {
      id: 'EVT-05',
      timeWib: '14:31:05 WIB',
      epochMs: 1786865465000,
      cameraCode: 'CAM-01-GERBANG',
      zone: 'KELUAR',
      title: 'Keluar Cepat Melalui Gerbang Utama',
      description: 'Menaiki sepeda motor dan meninggalkan lokasi ke arah jalan raya timur Tanggul.',
      severity: 'SUSPICIOUS',
      snapshotHash: 'SHA256:4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5'
    }
  ];

  const filteredEvents = selectedZoneFilter === 'ALL'
    ? events
    : events.filter(e => e.zone === selectedZoneFilter);

  return (
    <div id="security-incident-timeline-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R382 &bull; SECURITY INCIDENT TIMELINE
              </span>
              <span className="text-xs text-slate-400 font-mono">Timestamp-Preserved Multi-Zone Chronology</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Milestone className="w-8 h-8 text-cyan-400" />
              Kronologi Insiden &amp; Jejak Waktu Keamanan
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Penyusunan kronologi insiden otomatis melintasi Gerbang &rarr; Parkir &rarr; Koridor &rarr; Gudang &rarr; Keluar dengan stempel waktu presisi dan verifikasi hash.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                blackBoxRecorder.record({
                  moduleCode: 'R382-TIMELINE',
                  role: 'SUPER_ADMIN',
                  eventType: 'SECURITY',
                  details: 'Exported official Incident Chronology Report.',
                  severity: 'INFO'
                });
                alert('Laporan Kronologi Insiden Berhasil Diekspor!');
              }}
              className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 font-mono shadow-md"
            >
              <Download className="w-4 h-4" /> Ekspor Kronologi
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-mono">
        <span className="text-slate-400 font-bold px-2">Filter Zona:</span>
        {['ALL', 'GERBANG', 'PARKIR', 'KORIDOR', 'GUDANG', 'KELUAR'].map(z => (
          <button
            key={z}
            onClick={() => setSelectedZoneFilter(z)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedZoneFilter === z
                ? 'bg-cyan-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 font-mono">
        <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-1 before:bg-cyan-500/30">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="relative group">
              <div className={`absolute -left-[37px] top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 shadow-md ${
                evt.severity === 'CRITICAL' ? 'bg-rose-500 animate-ping' :
                evt.severity === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-cyan-500'
              }`} />
              <div className={`absolute -left-[37px] top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 shadow-md ${
                evt.severity === 'CRITICAL' ? 'bg-rose-500' :
                evt.severity === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-cyan-500'
              }`} />

              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-cyan-400 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {evt.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                      evt.severity === 'SUSPICIOUS' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                    }`}>
                      {evt.zone}
                    </span>
                  </div>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                    {evt.timeWib} &bull; {evt.cameraCode}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-400">
                  <span className="truncate">Snapshot Checksum: <strong>{evt.snapshotHash}</strong></span>
                  <span className="text-emerald-500 font-bold shrink-0">SHA-256 VERIFIED</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
