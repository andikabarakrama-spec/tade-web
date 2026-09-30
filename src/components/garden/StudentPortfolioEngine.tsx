import React, { useState } from 'react';
import { 
  Award, Heart, Star, CheckCircle2, User, Calendar, BookOpen, 
  Sparkles, Smile, ArrowRight, ShieldCheck, Feather
} from 'lucide-react';

export interface StudentMilestone {
  id: string;
  studentName: string;
  group: 'Kelompok A (Usia 4-5)' | 'Kelompok B (Usia 5-6)';
  period: string;
  photoUrl: string;
  artworkTitle: string;
  teacherNote: string;
  motorScore: number;
  quranScore: number;
  socialScore: number;
  achievements: string[];
}

export const StudentPortfolioEngine: React.FC = () => {
  const students: StudentMilestone[] = [
    {
      id: 'st-1',
      studentName: 'Ananda Muhammad Rayhan',
      group: 'Kelompok B (Usia 5-6)',
      period: 'Semester Ganjil 2026/2027',
      photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
      artworkTitle: 'Latihan Cap Daun Kamboja & Miniatur Masjid Balok',
      teacherNote: 'MasyAllah, Rayhan menunjukkan perkembangan kemandirian dan daya konsentrasi yang luar biasa. Sangat santun dengan teman dan cepat menghafal Surah An-Naba!',
      motorScore: 95,
      quranScore: 98,
      socialScore: 92,
      achievements: ['Lancar Hafal Juz 30 Surah An-Naba', 'Juara 1 Lomba Meronce Manik', 'Piket Kebun Ceria']
    },
    {
      id: 'st-2',
      studentName: 'Ananda Aisyah Humaira',
      group: 'Kelompok A (Usia 4-5)',
      period: 'Semester Ganjil 2026/2027',
      photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      artworkTitle: 'Finger Painting Bunga Pelangi & Menghitung Biji Kacang',
      teacherNote: 'Aisyah sangat ceria, rajin menyiram tanaman di kebun sekolah setiap pagi, dan pandai berbagi makanan saat jam istirahat dengan teman-teman.',
      motorScore: 92,
      quranScore: 94,
      socialScore: 96,
      achievements: ['Bintang Keberanian Apel Pagi', 'Lancar Doa Makan & Wudhu', 'Seni Lukis Kolase Daun']
    }
  ];

  const [activeStudentId, setActiveStudentId] = useState<string>('st-1');

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="bg-gradient-to-b from-amber-950 via-amber-900 to-emerald-950 text-amber-100 rounded-3xl p-6 sm:p-10 border-4 border-amber-400 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/40 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
              <Award className="w-3.5 h-3.5 text-slate-950" /> STUDENT PORTFOLIO ENGINE v3.0
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight">
              Portofolio Digital & Ream Jurnal Ananda
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Jurnal tumbuh kembang unik setiap anak di TK Asy Syifa: Hasil Karya, Hafalan Qur'an, & Catatan Kasih Sayang Guru.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {students.map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStudentId(st.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer border ${
                  activeStudentId === st.id
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-300'
                    : 'bg-emerald-900/80 text-emerald-100 border-emerald-700/60 hover:bg-emerald-800'
                }`}
              >
                {st.studentName}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Scrapbook Board Card */}
        <div className="bg-amber-50 text-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl space-y-6 animate-fade-in relative">
          
          {/* Top Brass Pin Sticker */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-300/80 border border-amber-400 px-6 py-1 rounded-full text-[10px] font-black uppercase text-amber-950 tracking-widest shadow-xs">
            📌 ALBUM KENANGAN & GROWTH JOURNAL ANANDA
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-center">
            
            {/* Student Image Photo Frame */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border-4 border-amber-300 shadow-xl h-64 sm:h-80">
              <img 
                src={activeStudent.photoUrl} 
                alt={activeStudent.studentName}
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                {activeStudent.group}
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 text-amber-200 backdrop-blur-xs p-3 rounded-xl text-xs font-bold border border-amber-400/50">
                🎨 {activeStudent.artworkTitle}
              </div>
            </div>

            {/* Student Scores & Teacher Notes */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  {activeStudent.period}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {activeStudent.studentName}
                </h3>
              </div>

              {/* Development Score Progress Bars */}
              <div className="grid grid-cols-3 gap-3 bg-stone-100 p-4 rounded-2xl border border-stone-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-stone-600 block">🧠 Motorik & Seni</span>
                  <div className="text-base font-black text-emerald-800">{activeStudent.motorScore}%</div>
                  <div className="w-full bg-stone-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${activeStudent.motorScore}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-stone-600 block">🕌 Tahfidz & Ibadah</span>
                  <div className="text-base font-black text-emerald-800">{activeStudent.quranScore}%</div>
                  <div className="w-full bg-stone-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activeStudent.quranScore}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-stone-600 block">🤝 Sosial Emosional</span>
                  <div className="text-base font-black text-emerald-800">{activeStudent.socialScore}%</div>
                  <div className="w-full bg-stone-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${activeStudent.socialScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Achievements Badges */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-stone-800 tracking-wider block">
                  🌟 Bintang Apresiasi & Capaian Ananda:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStudent.achievements.map((ach, idx) => (
                    <span key={idx} className="bg-amber-300 text-slate-950 font-black text-xs px-3 py-1 rounded-xl shadow-xs border border-amber-400 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
                      <span>{ach}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Teacher Loving Note */}
              <div className="p-4 bg-emerald-50 rounded-2xl border-l-4 border-emerald-700 space-y-1">
                <span className="text-xs font-black text-emerald-900 block flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" /> Catatan Kasih Sayang Ustadzah:
                </span>
                <p className="text-xs font-serif italic text-stone-800 leading-relaxed">
                  "{activeStudent.teacherNote}"
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
