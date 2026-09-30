import React, { useState } from 'react';
import { 
  Trees, 
  Sparkles, 
  Award, 
  BookOpen, 
  Users, 
  Heart, 
  Calendar, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { LegacyForestCohort } from '../../types/alumni';
import { alumniTransitionEngine } from '../../services/alumniTransitionEngine';

interface Props {
  onSelectCohort?: (cohort: LegacyForestCohort) => void;
}

export const LegacyForestViewer: React.FC<Props> = ({ onSelectCohort }) => {
  const [cohorts] = useState<LegacyForestCohort[]>(() => alumniTransitionEngine.getLegacyForestCohorts());
  const [selectedCohort, setSelectedCohort] = useState<LegacyForestCohort>(cohorts[cohorts.length - 1] || cohorts[0]);
  const [activeCapsuleUnlocked, setActiveCapsuleUnlocked] = useState(false);

  const totalAlumniAllTime = cohorts.reduce((acc, c) => acc + c.totalGraduates, 0);
  const totalJuzAllTime = cohorts.reduce((acc, c) => acc + c.totalJuzMemorized, 0);

  return (
    <div id="legacy-forest-section" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-emerald-950 to-slate-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-amber-500/30 shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> SPRINT G10 — LEGACY FOREST FOUNDATION
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Hutan Abadi & Pohon Angkatan Alumni
          </h2>
          <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed">
            Setiap angkatan wisudawan memiliki sebatang Pohon Warisan yang terus tumbuh, berbuah doa, dan menyimpan Kapsul Waktu Harapan Santri untuk 10 tahun ke depan.
          </p>

          {/* Quick Stats Banner */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-500/20">
              <p className="text-[10px] uppercase font-mono text-slate-400">Total Pohon Angkatan</p>
              <h4 className="text-lg font-black text-amber-300">{cohorts.length} Angkatan Emas</h4>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-500/20">
              <p className="text-[10px] uppercase font-mono text-slate-400">Total Wisudawan</p>
              <h4 className="text-lg font-black text-emerald-300">{totalAlumniAllTime} Santri</h4>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-500/20 col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase font-mono text-slate-400">Total Juz Quran Terpatri</p>
              <h4 className="text-lg font-black text-teal-300">{totalJuzAllTime} Juz Mutqin</h4>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 text-white/5 pointer-events-none">
          <Trees className="w-72 h-72" />
        </div>
      </div>

      {/* Cohort Selector Horizontal Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {cohorts.map((cohort) => {
          const isSelected = selectedCohort.year === cohort.year;
          return (
            <button
              key={cohort.year}
              id={`btn-cohort-${cohort.year}`}
              onClick={() => setSelectedCohort(cohort)}
              className={`p-4 rounded-3xl border-2 transition text-left shrink-0 min-w-[200px] cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 to-emerald-950 border-amber-400 text-white shadow-lg'
                  : 'bg-white border-stone-200 hover:border-stone-300 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-stone-100 text-stone-600'}`}>
                  Lulus {cohort.year}
                </span>
                <span className="text-lg">🌳</span>
              </div>
              <h4 className="font-extrabold text-sm mt-2">{cohort.cohortName}</h4>
              <p className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-emerald-300' : 'text-stone-500'}`}>
                {cohort.totalGraduates} Wisudawan • {cohort.wishesCount} Doa
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Selected Cohort Tree Detail */}
      {selectedCohort && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-mono">
                  Angkatan {selectedCohort.cohortNumber}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold">
                  {selectedCohort.treeGrowthStage === 'MAJESTIC_GOLDEN' ? 'Pohon Emas Abadi' : 'Pohon Rimbun Berbunga'}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">{selectedCohort.cohortName}</h3>
              <p className="text-xs text-stone-600 italic max-w-2xl font-serif">
                "{selectedCohort.motto}"
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCohort.coreValues.map((val, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-300 text-xs font-bold flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" /> {val}
                </span>
              ))}
            </div>
          </div>

          {/* Grid: Photo & Memory Capsule */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cohort Graduation Group Photo */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative rounded-3xl overflow-hidden border-2 border-stone-200 shadow-md group">
                <img
                  src={selectedCohort.groupPhotoUrl}
                  alt={selectedCohort.cohortName}
                  className="w-full h-72 object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5 text-white">
                  <div>
                    <p className="text-[10px] font-mono uppercase text-emerald-300">Foto Bersama Wisuda Akbar</p>
                    <h4 className="font-extrabold text-sm">{selectedCohort.cohortName} di Halaman Utama Asy Syifa</h4>
                  </div>
                </div>
              </div>

              {/* Outstanding Projects */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <h5 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" /> Karya & Rekam Jejak Unggulan Angkatan
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {selectedCohort.featuredProjects.map((proj, pIdx) => (
                    <div key={pIdx} className="bg-white p-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{proj}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time-Locked Memory Capsule */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-emerald-950 text-white rounded-3xl p-6 border-2 border-amber-400/40 shadow-xl flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                    HERITAGE TIME CAPSULE
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    Terkunci s.d {selectedCohort.year + 10}
                  </span>
                </div>

                <h4 className="text-lg font-black text-white">
                  Kapsul Waktu Harapan Santri & Orang Tua
                </h4>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Menyimpan surat cita-cita ananda saat berusia 5-6 tahun, rekaman suara doa pertama, dan foto kenangan sentra. Akan dibuka bersama pada Reuni 10 Tahun (Tahun {selectedCohort.year + 10}).
                </p>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Valedictorian Santri:</span>
                    <strong className="text-amber-300">{selectedCohort.valedictorian}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Surat Cita-Cita Tersimpan:</span>
                    <strong className="text-emerald-300">{selectedCohort.totalGraduates} Lembar Amanah</strong>
                  </div>
                </div>
              </div>

              <div>
                {activeCapsuleUnlocked ? (
                  <div className="bg-emerald-900/50 p-4 rounded-2xl border border-emerald-400 text-xs space-y-2 animate-fade-in">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Kutipan Surat Harapan Ananda:
                    </p>
                    <p className="text-stone-200 italic">
                      "Aku ingin menjadi dokter penghafal Al-Quran yang menyembuhkan banyak orang dan membangun masjid besar untuk Abi dan Umi."
                    </p>
                    <button
                      onClick={() => setActiveCapsuleUnlocked(false)}
                      className="text-[10px] text-slate-400 hover:text-white underline mt-1"
                    >
                      Kunci Kembali Kapsul Waktu
                    </button>
                  </div>
                ) : (
                  <button
                    id="btn-peek-capsule"
                    onClick={() => setActiveCapsuleUnlocked(true)}
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" /> Intip Cuplikan Kapsul Waktu
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
