import React from 'react';
import { Calendar, CheckCircle2, Clock, Users, BookOpen, DollarSign } from 'lucide-react';

export const SchoolOperationsTimelineViewer: React.FC = () => {
  const timelineEvents = [
    {
      time: '06:45 - 07:15',
      title: 'Penyambutan Santri & Presensi Masuk (Morning Drop-Off)',
      category: 'PRESENSI',
      icon: Users,
      color: 'blue',
      status: 'SELESAI',
      details: 'Presensi digital 145 santri tercatat di SSoT db.ts dengan stempel waktu terverifikasi.'
    },
    {
      time: '07:30 - 08:30',
      title: 'Sholat Dhuha, Ikrar & Circle Time Sentra Utama',
      category: 'IBADAH_SENTRA',
      icon: BookOpen,
      color: 'emerald',
      status: 'SELESAI',
      details: 'Aktivitas pembiasaan adab dan mutabaah hafalan surat pendek juz 30.'
    },
    {
      time: '08:30 - 10:15',
      title: 'Aktivitas Pembelajaran Sentra Bahan Alam, Main Peran & Balok',
      category: 'AKADEMIK',
      icon: BookOpen,
      color: 'indigo',
      status: 'BERJALAN',
      details: 'Pengisian RPPH harian dan dokumentasi foto portofolio anak didik secara offline-first.'
    },
    {
      time: '10:15 - 10:45',
      title: 'Makan Bersama, Istirahat & Edukasi Higienitas Gizi',
      category: 'PENGASUHAN',
      icon: Clock,
      color: 'amber',
      status: 'TERJADWAL',
      details: 'Pencatatan asupan makanan sehat dan monitoring alergi santri.'
    },
    {
      time: '11:00 - 11:30',
      title: 'Rekapitulasi Mutabaah & Penjemputan Santri (Afternoon Pick-Up)',
      category: 'OPERASIONAL',
      icon: CheckCircle2,
      color: 'purple',
      status: 'TERJADWAL',
      details: 'Verifikasi identitas penjemput resmi (wali santri) & sinkronisasi jurnal harian.'
    },
    {
      time: '13:00 - 14:00',
      title: 'Closing Kas Harian & Laporan Keuangan Sentra',
      category: 'KEUANGAN',
      icon: DollarSign,
      color: 'teal',
      status: 'TERJADWAL',
      details: 'Penutupan kas kasir harian, verifikasi kwitansi SPP, dan pencatatan kas SSoT.'
    }
  ];

  return (
    <div id="r865-school-operations-timeline" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">R865</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded">RC104</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">Live Timeline</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-1">School Operations Timeline</h2>
              <p className="text-sm text-slate-500">
                Garis waktu operasional harian sekolah terintegrasi: dari kedatangan santri hingga penutupan kas &amp; evaluasi harian.
              </p>
            </div>
          </div>

          <div className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200">
            Jadwal Operasional Aktif: Kamis, 20 Agustus 2026
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timelineEvents.map((event, idx) => {
            const Icon = event.icon;
            const isDone = event.status === 'SELESAI';
            const isOngoing = event.status === 'BERJALAN';

            return (
              <div key={idx} className="relative group">
                <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                  isDone ? 'border-emerald-500 text-emerald-600' :
                  isOngoing ? 'border-blue-500 text-blue-600 ring-4 ring-blue-100' :
                  'border-slate-300 text-slate-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-500' : isOngoing ? 'bg-blue-500' : 'bg-slate-300'}`} />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {event.time}
                      </span>
                      <h3 className="font-semibold text-slate-800 text-sm">{event.title}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                      isDone ? 'bg-emerald-100 text-emerald-800' :
                      isOngoing ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{event.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
