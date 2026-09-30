import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Download, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Share2, 
  Smile, 
  Award, 
  Bell, 
  Play, 
  ChevronRight,
  Star,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const ParentEngagementDashboard: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState({
    name: 'Muhammad Faris Al-Fatih',
    classGroup: 'TK B - Kelompok Al-Fatihah',
    guardianName: 'Bapak Ahmad & Ibu Nurul',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    attendanceToday: 'HADIR_TEPAT_WAKTU',
    latestTahfidzSurah: 'Surah An-Naba Ayat 1-20',
    tahfidzGrade: 'Mumtaz (Sangat Lancar & Tartil)',
    moodToday: 'Ceria & Aktif Belajar'
  });

  const dailyActivities = [
    {
      time: '07:30 - 08:00',
      title: 'Penyambutan Senyum & Sholat Dhuha',
      desc: 'Ananda Faris datang tersenyum ceria dan sholat dhuha 2 rakaat bersama guru.',
      status: 'Selesai'
    },
    {
      time: '08:00 - 09:30',
      title: 'Sentra Bahan Alam & Mewarnai Daun',
      desc: 'Mencoba teknik usap abur daun pepaya dengan penuh rasa ingin tahu.',
      status: 'Selesai'
    },
    {
      time: '09:30 - 10:00',
      title: 'Makan Bekal Sehat Bersama & Adab Berbagi',
      desc: 'Berdoa sebelum makan dan berbagi buah pisang dengan teman sebangku.',
      status: 'Berlangsung'
    }
  ];

  const recentMoments = [
    {
      id: 'MOM-01',
      title: 'Senam Pagi Lapangan Hijau',
      type: 'FOTO',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
      time: '08:15 WIB'
    },
    {
      id: 'MOM-02',
      title: 'Muroja\'ah Surah An-Naba',
      type: 'VIDEO',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
      time: '09:00 WIB'
    }
  ];

  return (
    <div className="space-y-6" id="parent-engagement-dashboard">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Portal Kasih Sayang & Wali Murid
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R837 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Jurnal Harian & Momen Buah Hati
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pantau foto resolusi asli, video kegiatan, capaian hafalan tahfidz, dan perkembangan karakter ananda setiap hari dengan nyaman di ponsel.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Suasana Hati Ananda</span>
              <span className="text-xs font-bold text-white">{selectedStudent.moodToday}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile & Tahfidz Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Child Profile Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border-2 border-pink-500/40 shrink-0">
            <img 
              src={selectedStudent.photoUrl} 
              alt={selectedStudent.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-pink-500/20 text-pink-300">
              {selectedStudent.classGroup}
            </span>
            <h3 className="text-sm font-bold text-white mt-1">{selectedStudent.name}</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              Hadir Tepat Waktu (07:22 WIB)
            </span>
          </div>
        </div>

        {/* Tahfidz & Quran Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Mutabaah Tahfidz Juz 30
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
              MUMTAZ
            </span>
          </div>
          <div className="text-sm font-bold text-white">{selectedStudent.latestTahfidzSurah}</div>
          <p className="text-[11px] text-slate-400">{selectedStudent.tahfidzGrade}</p>
        </div>

        {/* Announcement Reminder */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-400" />
              Pengumuman Sekolah
            </span>
            <span className="text-[10px] text-amber-400 font-mono">PENTING</span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Jum'at Bersih & Infaq Beras Santri besok pagi. Mohon ananda membawa infaq terbaik.
          </p>
        </div>
      </div>

      {/* Grid: Daily Timeline & Latest Moments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Daily Timeline */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-400" />
            Aktivitas Sentra Hari Ini
          </h3>

          <div className="space-y-3">
            {dailyActivities.map((act, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-1.5 shadow-md flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-pink-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Moments & One-Click Download */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Momen & Foto Asli Hari Ini ({recentMoments.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">RESOLUSI ASLI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentMoments.map((mom) => (
              <div
                key={mom.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-white shadow-md flex flex-col justify-between group"
              >
                <div className="relative h-36 bg-slate-950 overflow-hidden">
                  <img
                    src={mom.url}
                    alt={mom.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-950/80 px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-300 border border-slate-800">
                    {mom.type}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 px-2 py-0.5 rounded-lg text-[9px] text-slate-400">
                    {mom.time}
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <h4 className="text-xs font-bold text-white truncate">{mom.title}</h4>
                  <button
                    onClick={() => alert(`Mengunduh ${mom.title} dalam kualitas resolusi asli!`)}
                    className="w-full py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Foto Asli
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
