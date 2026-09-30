import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, Clock, Users, Tag, CheckCircle2, Heart } from 'lucide-react';

interface SchoolEvent {
  id: string;
  title: string;
  category: 'ISLAMI' | 'KREATIVITAS' | 'OUTDOOR' | 'PERAYAAN';
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  highlights: string[];
}

export const LivingEventCalendar: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('SEMUA');
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);

  const events: SchoolEvent[] = [
    {
      id: 'e1',
      title: 'Manasik Haji Cilik Asy Syifa',
      category: 'ISLAMI',
      date: '15 September 2026',
      time: '07.00 - 11.00 WIB',
      location: 'Halaman & Lapangan Utama Sekolah',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      description: 'Latihan manasik haji anak usia dini berpakaian ihram, mengelilingi Ka’bah buatan, sa’i antara Shofa Marwah, dan melempar jumrah.',
      highlights: ['Pakaian Ihram Putih Bersih', 'Bimbingan Doa Tawaf & Sa’i', 'Foto Bersama Keluarga'],
    },
    {
      id: 'e2',
      title: 'Market Day & Kewirausahaan Cilik',
      category: 'KREATIVITAS',
      date: '12 Oktober 2026',
      time: '08.00 - 10.30 WIB',
      location: 'Area Hall Sentra PAUD',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
      description: 'Anak-anak belajar menjadi penjual dan pembeli cilik. Menjual makanan sehat buatan ibu dan aneka hasil karya sederhana.',
      highlights: ['Latihan Bertransaksi Pecahan Sederhana', 'Melatih Percaya Diri', 'Uang Mainan Edukatif'],
    },
    {
      id: 'e3',
      title: 'Outing Class & Panen Sayur Organik',
      category: 'OUTDOOR',
      date: '20 November 2026',
      time: '07.30 - 11.30 WIB',
      location: 'Agrowisata Kebun Edukasi Jember',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      description: 'Kunjungan edukasi luar sekolah memetik buah, memanen sayur kangkung, dan memberi makan kelinci serta ikan koi.',
      highlights: ['Pengalaman Berkebun Nyata', 'Eksplorasi Lingkungan Hijau', 'Bus Wisata Nyaman'],
    },
    {
      id: 'e4',
      title: 'Peringatan Hari Kemerdekaan RI (17 Ags)',
      category: 'PERAYAAN',
      date: '17 Agustus 2026',
      time: '07.00 - 11.00 WIB',
      location: 'Lapangan Utama TK Asy Syifa',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      description: 'Upacara bendera cilik dilanjutkan lomba anak-anak meriah: lari kelereng, membawa kelereng, mewarnai bendera, dan panggung busana adat.',
      highlights: ['Pakaian Adat Nusantara', 'Lomba Anak Berhadiah', 'Semangat Kebangsaan'],
    },
  ];

  const filtered = activeFilter === 'SEMUA'
    ? events
    : events.filter((e) => e.category === activeFilter);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          Agenda & Agenda Kegiatan Sekolah
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Kalender Kegiatan Seru TK Asy Syifa
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Berbagai momen kebersamaan, pembiasaan ibadah, dan eksplorasi bakat ananda sepanjang tahun ajaran.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[
          { id: 'SEMUA', label: 'Semua Agenda' },
          { id: 'ISLAMI', label: 'Ibadah & Islami' },
          { id: 'KREATIVITAS', label: 'Kreativitas & Sentra' },
          { id: 'OUTDOOR', label: 'Outing & Alam' },
          { id: 'PERAYAAN', label: 'Perayaan & Pentas' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              activeFilter === f.id
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="bg-stone-50 rounded-3xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition duration-300 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-48 rounded-2xl overflow-hidden border border-stone-200">
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-emerald-600">
                  {ev.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ev.date}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900">{ev.title}</h3>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600" /> {ev.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {ev.location}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {ev.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ev.highlights.map((h, i) => (
                  <span key={i} className="text-[10px] font-bold bg-white text-emerald-900 px-2.5 py-0.5 rounded-lg border border-stone-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedEvent(ev)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              Lihat Rincian Kegiatan
            </button>
          </div>
        ))}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-emerald-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {selectedEvent.category}
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-44 object-cover rounded-2xl shadow-xs" />

            <div className="space-y-2 text-xs text-stone-700">
              <p><strong>Tanggal:</strong> {selectedEvent.date}</p>
              <p><strong>Waktu:</strong> {selectedEvent.time}</p>
              <p><strong>Lokasi:</strong> {selectedEvent.location}</p>
              <p className="pt-2 leading-relaxed text-stone-600">{selectedEvent.description}</p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
