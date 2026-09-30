import React, { useState } from 'react';
import {
  Heart,
  Clock,
  CreditCard,
  Bell,
  Camera,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Sparkles,
  Download,
  Filter,
  UserCheck
} from 'lucide-react';

export const SmartParentTimeline: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const timelineItems = [
    {
      id: 'TL-01',
      category: 'PRESENSI',
      title: 'Ananda Muhammad Fatih Tiba di Sekolah',
      timestamp: 'Hari Ini, 07:15 WIB',
      desc: 'Disambut oleh Ustadzah Rahma di Gerbang Utama. Suhu tubuh 36.4°C, kondisi ceria.',
      meta: 'Presensi Scan RFID #TK-A-04',
      badgeColor: 'emerald',
      icon: UserCheck
    },
    {
      id: 'TL-02',
      category: 'DOKUMENTASI',
      title: 'Foto Kegiatan: Eksplorasi Sains Membuat Pelangi Air',
      timestamp: 'Hari Ini, 09:30 WIB',
      desc: 'Ananda sangat aktif bertanya dan berkolaborasi mencampurkan warna primer dalam tabung percobaan.',
      meta: 'Sentra Bahan Alam & Sains',
      hasImage: true,
      badgeColor: 'purple',
      icon: Camera
    },
    {
      id: 'TL-03',
      category: 'PEMBAYARAN',
      title: 'Konfirmasi Pembayaran SPP Bulan Agustus 2026',
      timestamp: 'Kemarin, 14:20 WIB',
      desc: 'Pembayaran sebesar Rp 450.000 via BSI Virtual Account telah diverifikasi otomatis oleh sistem.',
      meta: 'No. Kuitansi: INV-202608-0429',
      badgeColor: 'indigo',
      icon: CreditCard
    },
    {
      id: 'TL-04',
      category: 'PENGUMUMAN',
      title: 'Pekan Parenting & Lomba Memasak Bersama Ayah',
      timestamp: '13 Agt 2026, 10:00 WIB',
      desc: 'Undangan resmi kegiatan peringatan Hari Kemerdekaan & Family Day hari Sabtu, 22 Agustus 2026.',
      meta: 'Lampiran: Surat_Undangan_Family_Day.pdf',
      badgeColor: 'amber',
      icon: Bell
    },
    {
      id: 'TL-05',
      category: 'INTERAKSI',
      title: 'Catatan Guru Kelas: Perkembangan Motorik Halus',
      timestamp: '11 Agt 2026, 16:00 WIB',
      desc: 'Kemampuan menggunting pola lurus dan melipat origami burung sudah berkembang sangat pesat!',
      meta: 'Feedback Mingguan • Ustadzah Rahma',
      badgeColor: 'blue',
      icon: MessageCircle
    }
  ];

  const filteredItems = filterType === 'ALL'
    ? timelineItems
    : timelineItems.filter(item => item.category === filterType);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl border border-pink-100">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Smart Parent Timeline</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold">
                Santri: Muhammad Fatih (TK-A)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Linimasa cerdas aktivitas santri: kehadiran langsung, bukti pembayaran, dokumentasi kegiatan belajar, dan catatan wali kelas.
            </p>
          </div>
        </div>

        {/* Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'PRESENSI', 'DOKUMENTASI', 'PEMBAYARAN', 'PENGUMUMAN', 'INTERAKSI'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === type
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timeline Stream */}
      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-6 pl-6 py-2">
        {filteredItems.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative group">
              {/* Dot Icon on line */}
              <div className="absolute -left-[37px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-pink-500 flex items-center justify-center text-pink-600 shadow-sm">
                <Icon className="w-4 h-4" />
              </div>

              {/* Card Content */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>

                {item.hasImage && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Camera className="w-4 h-4 text-purple-600" />
                      <span>1 Foto Dokumentasi Resolusi Penuh Siap Unduh</span>
                    </div>
                    <button className="px-2.5 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-bold transition flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      Lihat Foto
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">{item.meta}</span>
                  <span className="text-pink-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Terverifikasi SIM Asy-Syukriyyah
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
