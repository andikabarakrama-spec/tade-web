import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  BookOpen,
  Award,
  Heart,
  Brain,
  Smile,
  Palette,
  Activity,
  CheckCircle2,
  Calendar,
  Search,
  Filter
} from 'lucide-react';

interface StudentProfile {
  id: string;
  name: string;
  nis: string;
  className: string;
  avatar: string;
  semester: string;
  aspectScores: {
    aspect: string;
    label: string;
    icon: any;
    score: number; // 1 to 100
    category: 'BSB' | 'BSH' | 'MB' | 'BB'; // BSB: Berkembang Sangat Baik, BSH: Berkembang Sesuai Harapan
    notes: string;
  }[];
  teacherSummary: string;
  automatedInsight: string;
}

export const StudentGrowthIntelligence: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('STU-001');

  const students: StudentProfile[] = [
    {
      id: 'STU-001',
      name: 'Muhammad Farhan Al-Fatih',
      nis: '2026-08-0101',
      className: 'TK B1 (Utsman bin Affan)',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=60',
      semester: 'Semester Ganjil 2026/2027',
      aspectScores: [
        { aspect: 'NAM', label: 'Nilai Agama & Moral', icon: Heart, score: 94, category: 'BSB', notes: 'Hafal Surat Al-Insyirah, tertib berdoa sebelum dan sesudah makan, serta rutin shalat dhuha.' },
        { aspect: 'FM', label: 'Fisik Motorik', icon: Activity, score: 90, category: 'BSB', notes: 'Koordinasi tangan dan mata sangat lincah, aktif mengikuti rintangan motorik kasar di sentra bermain.' },
        { aspect: 'KOG', label: 'Kognitif & Logika', icon: Brain, score: 88, category: 'BSH', notes: 'Mampu menyusun pola geometri balok dan memahami konsep hitung angka dasar 1-20.' },
        { aspect: 'BHS', label: 'Bahasa & Komunikasi', icon: BookOpen, score: 92, category: 'BSB', notes: 'Mampu bercerita kembali isi kisah nabi dan mengekspresikan pendapat secara santun.' },
        { aspect: 'SOSEM', label: 'Sosial Emosional', icon: Smile, score: 86, category: 'BSH', notes: 'Suka berbagi mainan sentra bersama teman, mulai sabar menunggu giliran mencuci tangan.' },
        { aspect: 'SENI', label: 'Seni & Kreativitas', icon: Palette, score: 95, category: 'BSB', notes: 'Sangat kreatif dalam eksplorasi warna cat air alami dan melipat kertas origami bentuk perahu.' }
      ],
      teacherSummary: 'Ananda Farhan menunjukkan perkembangan holistik yang sangat mengesankan di seluruh 6 aspek PAUD, terutama dalam kepemimpinan adab islami dan kreativitas seni.',
      automatedInsight: 'Prediksi kesiapan masuk jenjang Sekolah Dasar (SD) mencapai 96%. Disarankan penguatan stimulasi pemecahan masalah (Problem Solving) mandiri pada kegiatan sentra balok.'
    },
    {
      id: 'STU-002',
      name: 'Aisyah Humaira Azzahra',
      nis: '2026-08-0102',
      className: 'TK B1 (Utsman bin Affan)',
      avatar: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&auto=format&fit=crop&q=60',
      semester: 'Semester Ganjil 2026/2027',
      aspectScores: [
        { aspect: 'NAM', label: 'Nilai Agama & Moral', icon: Heart, score: 96, category: 'BSB', notes: 'Fasih membaca jilid Tilawati dan memiliki empati tinggi terhadap teman yang sedang sedih.' },
        { aspect: 'FM', label: 'Fisik Motorik', icon: Activity, score: 88, category: 'BSH', notes: 'Keterampilan motorik halus menggunting dan meronce manik-manik sangat rapi dan presisi.' },
        { aspect: 'KOG', label: 'Kognitif & Logika', icon: Brain, score: 92, category: 'BSB', notes: 'Cepat mengenali perbedaan ukuran, bentuk, dan klasifikasi jenis tanaman obat keluarga.' },
        { aspect: 'BHS', label: 'Bahasa & Komunikasi', icon: BookOpen, score: 95, category: 'BSB', notes: 'Kosakata kaya, percaya diri saat maju memimpin doa harian di hadapan teman kelas.' },
        { aspect: 'SOSEM', label: 'Sosial Emosional', icon: Smile, score: 90, category: 'BSB', notes: 'Mandiri merapikan perlengkapan belajar sendiri setelah selesai bermain di sentra.' },
        { aspect: 'SENI', label: 'Seni & Kreativitas', icon: Palette, score: 91, category: 'BSB', notes: 'Harmonisasi warna saat menggambar tema keluarga bahagia sangat cerah dan berkarakter.' }
      ],
      teacherSummary: 'Ananda Aisyah adalah santriwati berprestasi dengan kecerdasan linguistik dan moral yang matang melampaui rata-rata usianya.',
      automatedInsight: 'Potensi unggul dalam literasi dan kepemimpinan islami. Rekomendasi: Sertakan dalam delegasi lomba tahfidz surat pendek cilik tingkat kecamatan.'
    }
  ];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis.includes(searchQuery)
  );

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Student Growth Intelligence</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold font-mono">
                6 Aspek PAUD Holistik
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Matriks perkembangan peserta didik: grafik 6 capaian kurikulum merdeka PAUD, catatan semester guru, dan insight prediksi kesiapan sekolah.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
            Data Historis: Terkunci (Read-Only)
          </span>
        </div>
      </div>

      {/* Student Selector / Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama santri atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredStudents.map((stu) => (
              <div
                key={stu.id}
                onClick={() => setSelectedStudentId(stu.id)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  stu.id === activeStudent.id
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <img
                  src={stu.avatar}
                  alt={stu.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-800 truncate">{stu.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{stu.nis}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Student Header Summary */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={activeStudent.avatar}
                alt={activeStudent.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-base font-bold text-slate-800">{activeStudent.name}</h2>
                <p className="text-xs text-slate-500">{activeStudent.className} • NIS: {activeStudent.nis}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                  {activeStudent.semester}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block font-mono">Status Capaian</span>
              <span className="text-sm font-extrabold text-emerald-600 flex items-center sm:justify-end gap-1">
                <CheckCircle2 className="w-4 h-4" /> Berkembang Sangat Baik (BSB)
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Automated Cognitive & Adab Insight
            </div>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              {activeStudent.automatedInsight}
            </p>
          </div>
        </div>
      </div>

      {/* 6 PAUD Aspects Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeStudent.aspectScores.map((aspect, idx) => {
          const Icon = aspect.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs">{aspect.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-extrabold">
                  {aspect.category} ({aspect.score}%)
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${aspect.score}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{aspect.notes}"
              </p>
            </div>
          );
        })}
      </div>

      {/* Teacher Semester Notes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          Catatan & Refleksi Pendidik (Wali Kelas)
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
          {activeStudent.teacherSummary}
        </p>
      </div>
    </div>
  );
};
