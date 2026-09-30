import React, { useState } from 'react';
import {
  HeartHandshake,
  Users,
  Calendar,
  Image,
  Award,
  CheckCircle2,
  Plus,
  Clock,
  Sparkles,
  MapPin,
  Flame
} from 'lucide-react';

interface CommunityActivity {
  id: string;
  title: string;
  category: 'PARENTING' | 'SOSIAL' | 'BAZAR' | 'GOTONG_ROYONG';
  date: string;
  location: string;
  registeredVolunteers: number;
  targetVolunteers: number;
  status: 'UPCOMING' | 'COMPLETED';
  description: string;
}

interface VolunteerMember {
  id: string;
  name: string;
  parentOf: string;
  role: string;
  hoursContributed: number;
  badge: string;
}

export const CommunityEngagementHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activities' | 'volunteers' | 'gallery' | 'stats'>('activities');
  const [isVolunteered, setIsVolunteered] = useState<Record<string, boolean>>({});

  const [activities] = useState<CommunityActivity[]>([
    {
      id: 'ACT-01',
      title: 'Bakti Sosial & Santunan Yatim Dhuafa Berkah Muharram',
      category: 'SOSIAL',
      date: '28 Agustus 2026, 08:30 WIB',
      location: 'Halaman Utama TK Asy Syifa',
      registeredVolunteers: 18,
      targetVolunteers: 20,
      status: 'UPCOMING',
      description: 'Penyaluran paket sembako dan perlengkapan sekolah hasil infaq santri dan wali murid.'
    },
    {
      id: 'ACT-02',
      title: 'Kajian Parenting Akbar: Mendidik Adab Sebelum Ilmu',
      category: 'PARENTING',
      date: '22 Agustus 2026, 09:00 WIB',
      location: 'Aula Al-Hikmah & Live Streaming',
      registeredVolunteers: 12,
      targetVolunteers: 12,
      status: 'UPCOMING',
      description: 'Sesi bimbingan pola asuh islami bersama Ustadz Pembina dan pakar psikologi anak usia dini.'
    },
    {
      id: 'ACT-03',
      title: 'Bazar Santri Mandiri & Gelar Karya Sentra Kreatif',
      category: 'BAZAR',
      date: '10 Juli 2026',
      location: 'Koridor Sentra Seni & Balok',
      registeredVolunteers: 25,
      targetVolunteers: 25,
      status: 'COMPLETED',
      description: 'Pameran hasil karya lukis, kolase, dan olahan makanan sehat buatan santri bersama bunda.'
    }
  ]);

  const [volunteers] = useState<VolunteerMember[]>([
    { id: 'VOL-01', name: 'Bunda Sarah Aulia', parentOf: 'Fatih (TK A1)', role: 'Koordinator Konsumsi & PMT', hoursContributed: 24, badge: 'Relawan Utama' },
    { id: 'VOL-02', name: 'Ayah Hendra Pratama', parentOf: 'Aisyah (TK B2)', role: 'Tim Dokumentasi & Media', hoursContributed: 18, badge: 'Kontributor Aktif' },
    { id: 'VOL-03', name: 'Bunda Rina Wardani', parentOf: 'Zaid (TK A2)', role: 'Koordinator Kebersihan & Logistik', hoursContributed: 30, badge: 'Teladan Berkah' }
  ]);

  const toggleVolunteer = (id: string) => {
    setIsVolunteered(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl border border-pink-100">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Community Engagement Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold font-mono">
                Komite & Paguyuban
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat sinergi komunitas madrasah: kegiatan bakti sosial, kepengurusan relawan komite, galeri gotong royong, dan statistik keterlibatan wali murid.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['activities', 'volunteers', 'gallery', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-pink-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'activities' && 'Agenda Komunitas'}
              {tab === 'volunteers' && 'Daftar Relawan'}
              {tab === 'gallery' && 'Galeri Momen'}
              {tab === 'stats' && 'Statistik Partisipasi'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Total Relawan Terdaftar</span>
          <div className="text-2xl font-black text-pink-600">55 Wali Murid</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Partisipasi Aktif 88%
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Total Jam Kontribusi</span>
          <div className="text-2xl font-black text-slate-800">420 Jam</div>
          <span className="text-[10px] text-slate-500 font-medium">Bakti sosial & parenting</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Agenda Terlaksana</span>
          <div className="text-2xl font-black text-emerald-600">14 Kegiatan</div>
          <span className="text-[10px] text-emerald-600 font-medium">100% Sesuai Rencana</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Indeks Sinergi Sekolah</span>
          <div className="text-2xl font-black text-indigo-600">98.9%</div>
          <span className="text-[10px] text-slate-500 font-medium">Kemitraan Harmonis</span>
        </div>
      </div>

      {/* Tab: Activities */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-700">Agenda Kolaborasi Orang Tua & Komite Sekolah</h2>

          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 font-mono text-[10px] font-bold">
                      {act.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800">{act.title}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      act.status === 'UPCOMING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {act.status === 'UPCOMING' ? 'AKAN DATANG' : 'SELESAI'}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{act.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-600" /> {act.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {act.location}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-700 font-bold">
                      <Users className="w-3.5 h-3.5 text-pink-600" /> {act.registeredVolunteers} / {act.targetVolunteers} Relawan
                    </span>
                  </div>

                  {act.status === 'UPCOMING' && (
                    <button
                      onClick={() => toggleVolunteer(act.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm ${
                        isVolunteered[act.id]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-pink-600 hover:bg-pink-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {isVolunteered[act.id] ? 'Terdaftar Sebagai Relawan' : 'Daftar Jadi Relawan'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Volunteers */}
      {activeTab === 'volunteers' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-600" />
            Daftar Anggota Relawan & Pengurus Paguyuban Kelas
          </h2>

          <div className="space-y-3">
            {volunteers.map((vol) => (
              <div key={vol.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800">{vol.name}</div>
                  <div className="text-slate-500 text-[11px]">Wali dari: {vol.parentOf} • Peran: {vol.role}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-pink-100 text-pink-800 font-mono text-[10px] font-bold">
                    {vol.badge}
                  </span>
                  <span className="font-mono text-slate-700 font-bold text-xs">{vol.hoursContributed} Jam Kontribusi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Gallery */}
      {activeTab === 'gallery' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Image className="w-4 h-4 text-pink-600" />
            Dokumentasi Kehangatan Sinergi Komunitas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
              <div className="h-28 bg-pink-100/50 rounded-lg flex items-center justify-center text-pink-600 font-bold text-xs">
                Dokumentasi Kajian Akbar
              </div>
              <p className="text-[11px] font-bold text-slate-700">Kajian Parenting Bulanan</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
              <div className="h-28 bg-emerald-100/50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-xs">
                Dokumentasi Bakti Sosial
              </div>
              <p className="text-[11px] font-bold text-slate-700">Penyaluran Sembako Santri</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
              <div className="h-28 bg-purple-100/50 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xs">
                Dokumentasi Gelar Sentra
              </div>
              <p className="text-[11px] font-bold text-slate-700">Bazar Mandiri & Karya Seni</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Stats */}
      {activeTab === 'stats' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            Indeks Kepuasan & Sinergi Kemitraan Keluarga
          </h2>
          <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            Keterlibatan orang tua santri pada semester ini mencapai angka partisipasi 88.4%, mencerminkan tingginya kepercayaan dan kerja sama erat antara pihak yayasan, para ustadzah, dan seluruh keluarga besar TK Asy Syifa.
          </p>
        </div>
      )}
    </div>
  );
};
