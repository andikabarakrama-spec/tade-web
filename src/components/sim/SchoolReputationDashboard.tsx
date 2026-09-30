import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Star,
  Image as ImageIcon,
  Share2,
  Newspaper,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  category: 'SANTRI' | 'GURU' | 'LEMBAGA';
  level: string;
  winner: string;
  date: string;
  badgeColor: string;
}

export const SchoolReputationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'gallery' | 'press' | 'stats'>('achievements');

  const achievements: Achievement[] = [
    {
      id: 'ACH-01',
      title: 'Juara 1 Lomba Tahfidz Al-Qur\'an Juz 30 Cilik',
      category: 'SANTRI',
      level: 'Tingkat Kabupaten',
      winner: 'Muhammad Farhan Al-Fatih (TK B1)',
      date: 'Agustus 2026',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'ACH-02',
      title: 'Predikat Sekolah Penggerak PAUD Inovatif Berbasis Sentra',
      category: 'LEMBAGA',
      level: 'Tingkat Provinsi',
      winner: 'KB-TK Islam Asy-Syaamil',
      date: 'Juli 2026',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'ACH-03',
      title: 'Juara 2 Lomba Mendongeng Adab Kisah Teladan Nabawi Guru PAUD',
      category: 'GURU',
      level: 'Tingkat Kota',
      winner: 'Ustadzah Nur Aini, S.Pd',
      date: 'Juni 2026',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  const galleryImages = [
    {
      title: 'Puncak Tema Sentra Alam & Kemandirian Santri',
      date: 'Agustus 2026',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Praktik Manasik Haji Cilik Asy-Syaamil',
      date: 'Juli 2026',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Kajian Sinergi Parenting & Edukasi Karakter',
      date: 'Juni 2026',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">School Reputation Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                Akreditasi A Unggul
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dashboard reputasi & prestasi madrasah: rekam jejak capaian santri, galeri dokumentasi kegiatan, dan metrik kepercayaan publik.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['achievements', 'gallery', 'press', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'achievements' && 'Prestasi'}
              {tab === 'gallery' && 'Galeri Dokumentasi'}
              {tab === 'press' && 'Publikasi'}
              {tab === 'stats' && 'Statistik'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Indeks Kepuasan Wali</span>
          <div className="text-2xl font-black text-slate-800">98.4%</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Sangat Memuaskan (NPS: +86)
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Total Prestasi Juara</span>
          <div className="text-2xl font-black text-slate-800">28 Trofi</div>
          <span className="text-[10px] text-slate-500 font-medium">Tahun Ajaran 2025 - 2026</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Status Akreditasi</span>
          <div className="text-2xl font-black text-amber-600">Grade A</div>
          <span className="text-[10px] text-slate-500 font-medium">BAN PDM (Skor: 96/100)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Keterisian Kuota PPDB</span>
          <div className="text-2xl font-black text-emerald-600">100% Full</div>
          <span className="text-[10px] text-slate-500 font-medium">Waiting List: 14 Calon Santri</span>
        </div>
      </div>

      {/* Tab: Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-slate-800">{ach.title}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono ${ach.badgeColor}`}>
                      {ach.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Penerima: {ach.winner}</p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-slate-400 font-bold self-end sm:self-auto">
                {ach.date}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Gallery */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-3 pb-4">
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-44 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="px-4 space-y-1">
                <h2 className="text-xs font-bold text-slate-800">{img.title}</h2>
                <p className="text-[10px] text-slate-400 font-mono">{img.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Press & Publications */}
      {activeTab === 'press' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-amber-600" />
            Siaran Pers & Berita Edukasi Resmi
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">Inovasi Model Sentra Alam PAUD Islam Asy-Syaamil Jadi Rujukan Studi Banding</div>
              <p className="text-slate-600 text-[11px]">Kunjungan kerja pengawas dan 12 kepala sekolah PAUD se-kecamatan dalam rangka adopsi Kurikulum Merdeka beradab.</p>
              <span className="text-[10px] font-mono text-slate-400 block pt-1">Dipublikasikan pada: 12 Agustus 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Stats */}
      {activeTab === 'stats' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            Statistik Pertumbuhan & Evaluasi Reputasi Tahunan
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed text-slate-700">
            Tingkat retensi pendaftaran mencapai 100% dengan tingkat kelulusan alumni yang berhasil diterima di SD Islam Favorit mencapai 98.7%. Evaluasi reputasi publik menempatkan KB-TK Islam Asy-Syaamil pada peringkat 1 di wilayah binaan.
          </div>
        </div>
      )}
    </div>
  );
};
