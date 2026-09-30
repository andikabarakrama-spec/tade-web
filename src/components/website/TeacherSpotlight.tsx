import React, { useState } from 'react';
import { Award, Heart, Sparkles, Smile, BookOpen, Star, UserCheck, Flame, Flower2, Bookmark, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DepthCard } from '../interactions/DepthCard';
import { LivingSlideCarousel } from '../common/LivingSlideCarousel';

interface Teacher {
  id: string;
  name: string;
  role: string;
  category: 'GURU_KELAS' | 'TAHFIDZ' | 'SENI_EKSTRA';
  photo: string;
  experience: string;
  expertise: string[];
  hobby: string;
  quote: string;
  bgGradient: string;
  borderColor: string;
  sticker: string;
  plantIcon: string;
  education: string;
  certification: string;
  classGroup: string;
}

export const TeacherSpotlight: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('SEMUA');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const teachers: Teacher[] = [
    {
      id: 't1',
      name: 'Ibu Hj. Syarifah, S.Pd.AUD',
      role: 'Kepala Sekolah & Pembina Kurikulum PAUD',
      category: 'GURU_KELAS',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      experience: '16 Tahun Mengabdi',
      expertise: ['Manajemen PAUD', 'Psikologi Anak', 'Inovasi Sentra'],
      hobby: 'Membaca & Berkebun 🌸',
      quote: '“Mendidik dengan hati, menuntun dengan keteladanan, mencetak generasi yang dicintai Allah.”',
      bgGradient: 'from-amber-50 via-orange-50 to-amber-100/60',
      borderColor: 'border-amber-300',
      sticker: '👑 Ibu Guru Teladan',
      plantIcon: '🌻',
      education: 'S1 Pendidikan Anak Usia Dini (Universitas Jember)',
      certification: 'Sertifikasi Pendidik Professional Kemendikbud',
      classGroup: 'Penanggung Jawab Kurikulum Merdeka PAUD'
    },
    {
      id: 't2',
      name: 'Ustadzah Fatimah Azzahra, S.Ag',
      role: 'Guru Wali Kelompok A & Pembimbing Tahfidz',
      category: 'TAHFIDZ',
      photo: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=600',
      experience: '8 Tahun Mengabdi',
      expertise: ['Tahfidz Juz 30', 'Metode Ummi / Ibroh', 'Kisah Nabi'],
      hobby: 'Mendongeng Islami 📖',
      quote: '“Menghafal Al-Qur’an di usia dini ibarat mengukir di atas batu, abadi meresap dalam jiwa.”',
      bgGradient: 'from-emerald-50 via-teal-50 to-emerald-100/60',
      borderColor: 'border-emerald-300',
      sticker: '🌙 Ustadzah Hafidzah',
      plantIcon: '🌿',
      education: 'S1 Pendidikan Agama Islam',
      certification: 'Sertifikasi Syahadah Tahfidz Juz 30 & Metode Ummi',
      classGroup: 'Wali Kelas Kelompok A (3–4 Tahun)'
    },
    {
      id: 't3',
      name: 'Ibu Nabila Rahmawati, S.Pd',
      role: 'Guru Wali B1 & PJ Sentra Seni',
      category: 'GURU_KELAS',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      experience: '6 Tahun Mengabdi',
      expertise: ['Seni Rupa Anak', 'Eksplorasi STEAM', 'Kerajinan Tangan'],
      hobby: 'Melukis & Origami 🎨',
      quote: '“Setiap goresan warna karya anak adalah bentuk imajinasi indah yang patut diapresiasi.”',
      bgGradient: 'from-sky-50 via-indigo-50 to-blue-100/60',
      borderColor: 'border-sky-300',
      sticker: '🎨 Seniman Ceria',
      plantIcon: '🌷',
      education: 'S1 Pendidikan Seni & PAUD',
      certification: 'Sertifikat Instruktur Kerajinan Tangan Anak',
      classGroup: 'Wali Kelas Kelompok B1 (5–6 Tahun)'
    },
    {
      id: 't4',
      name: 'Ibu Nurul Aini, S.Pd',
      role: 'Guru Wali B2 & Instruktur Drumband',
      category: 'SENI_EKSTRA',
      photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600',
      experience: '7 Tahun Mengabdi',
      expertise: ['Musik & Ritme Anak', 'Tari Tradisional', 'Senam Ceria'],
      hobby: 'Bermain Alat Musik & Olahraga 🥁',
      quote: '“Gerak dan irama musik melatih fokus, rasa percaya diri, dan kerja sama tim anak.”',
      bgGradient: 'from-rose-50 via-pink-50 to-rose-100/60',
      borderColor: 'border-pink-300',
      sticker: '🥁 Pelatih Drumband',
      plantIcon: '🌺',
      education: 'S1 Pendidikan Jasmani & Seni',
      certification: 'Sertifikat Pelatih Drumband Ceria PAUD',
      classGroup: 'Wali Kelas Kelompok B2 (5–6 Tahun)'
    },
  ];

  const filtered = activeCategory === 'SEMUA'
    ? teachers
    : teachers.filter((t) => t.category === activeCategory);

  return (
    <section className="bg-gradient-to-br from-amber-50/70 via-emerald-50/50 to-sky-50/70 rounded-3xl p-6 sm:p-10 border-2 border-amber-200/80 shadow-md space-y-8 relative overflow-hidden">
      {/* Decorative Floating Elements */}
      <div className="absolute top-3 left-4 text-2xl animate-bounce">🦋</div>
      <div className="absolute top-4 right-6 text-2xl animate-pulse">🐝</div>

      {/* Title Scrapbook Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-200/80 text-amber-950 font-black text-xs shadow-xs border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          <span>Profil Guru & Pendidik Berdedikasi • TK Asy Syifa Tanggul</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pendidik Penuh Kasih & Keteladanan
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-semibold">
          Dewan guru tersertifikasi, ramah anak, serta berdedikasi membimbing ananda dengan pendekatan keislaman & keibuan.
        </p>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'SEMUA', label: 'Semua Ustadzah' },
          { id: 'GURU_KELAS', label: 'Guru Kelas / Sentra' },
          { id: 'TAHFIDZ', label: 'Pembimbing Tahfidz' },
          { id: 'SENI_EKSTRA', label: 'Seni & Ekstrakurikuler' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer shadow-xs ${
              activeCategory === cat.id
                ? 'bg-emerald-800 text-white border-2 border-emerald-600'
                : 'bg-white text-stone-700 hover:bg-amber-100 border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Interactive Living Slide Carousel for Teacher Spotlight */}
      <LivingSlideCarousel
        items={filtered}
        keyExtractor={(teacher) => teacher.id}
        autoPlay={true}
        autoPlayInterval={5000}
        itemsPerPageDesktop={4}
        itemsPerPageTablet={2}
        itemsPerPageMobile={1}
        badge="Ustadzah Pilihan"
        title="Dewan Pendidik Kampus Hijau"
        subtitle="Klik kartu guru untuk membuka detail kualifikasi & sertifikasi resmi"
        renderItem={(teacher) => (
          <DepthCard depth={12} className="h-full">
            <div
              onClick={() => setSelectedTeacher(teacher)}
              className={`p-5 rounded-3xl bg-gradient-to-b ${teacher.bgGradient} border-2 ${teacher.borderColor} shadow-xs space-y-4 flex flex-col justify-between h-full cursor-pointer hover:scale-[1.02] transition duration-300 group`}
            >
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-48 border-2 border-white/80 shadow-md">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-2 right-2 px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full shadow-md border border-amber-300">
                    {teacher.sticker}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-emerald-800 transition">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-stone-600 font-bold">{teacher.role}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-white/80 text-emerald-800 text-[10px] font-black rounded-md border border-emerald-200">
                    {teacher.experience}
                  </span>
                </div>

                <p className="text-xs text-stone-700 italic bg-white/70 p-3 rounded-2xl border border-stone-200/80 line-clamp-3">
                  {teacher.quote}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-extrabold text-stone-700">
                <span>{teacher.plantIcon} {teacher.hobby}</span>
                <span className="text-emerald-800 font-black group-hover:underline flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Buka Profil
                </span>
              </div>
            </div>
          </DepthCard>
        )}
      />

      {/* Teacher Full Profile Modal (Portrait Expansion) */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-[160] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative border-4 border-amber-400 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-rose-100 text-stone-800 hover:text-rose-800 rounded-full font-bold transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header & Photo */}
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-stone-200 pb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl shrink-0">
                <img
                  src={selectedTeacher.photo}
                  alt={selectedTeacher.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <span className="px-3 py-1 bg-amber-200 text-amber-950 font-black text-xs rounded-full">
                  {selectedTeacher.sticker}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {selectedTeacher.name}
                </h3>
                <p className="text-xs font-bold text-emerald-800">
                  {selectedTeacher.role}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md border border-emerald-300">
                    {selectedTeacher.experience}
                  </span>
                  <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-300">
                    {selectedTeacher.classGroup}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Qualifications */}
            <div className="space-y-3 text-xs">
              <h4 className="font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Kualifikasi & Sertifikasi Resmi
              </h4>

              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200 font-medium">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Pendidikan Terakhir:</strong>
                    {selectedTeacher.education}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Sertifikasi & Lisensi:</strong>
                    {selectedTeacher.certification}
                  </div>
                </div>
              </div>

              {/* Expertise Tags */}
              <div>
                <strong className="block font-bold text-slate-900 mb-1">Spesialisasi Bimbingan:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTeacher.expertise.map((exp, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-extrabold text-[11px] rounded-lg border border-emerald-200">
                      • {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-r from-amber-50 to-emerald-50 p-4 rounded-2xl border border-amber-200 italic font-semibold text-stone-800 leading-relaxed">
                {selectedTeacher.quote}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
