import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Heart, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Volume2, 
  Phone, 
  ExternalLink, 
  HelpCircle,
  Lightbulb,
  Building2,
  Check
} from 'lucide-react';
import { 
  SDTransitionChecklistItem, 
  SDTransitionPrayer, 
  SDTransitionParentTip, 
  SDPartnerSchool 
} from '../../types/alumni';
import { alumniTransitionEngine } from '../../services/alumniTransitionEngine';

export const SDTransitionHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'CHECKLIST' | 'PRAYERS' | 'TIPS' | 'SCHOOLS'>('CHECKLIST');
  const [data, setData] = useState(() => alumniTransitionEngine.getSDTransitionHubData());
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const handleToggleItem = (itemId: string) => {
    const updated = alumniTransitionEngine.toggleChecklistItem(itemId);
    setData(prev => ({ ...prev, checklist: updated }));
  };

  const completedCount = data.checklist.filter(c => c.isCompleted).length;
  const totalCount = data.checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handlePlayAudio = (prayerId: string) => {
    if (playingAudioId === prayerId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(prayerId);
      // Simulate audio play duration
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 5000);
    }
  };

  return (
    <div id="sd-transition-hub-section" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-emerald-500/20 shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> SPRINT G10 — SD/MI ISLAMIC TRANSITION HUB
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Panduan Transisi Emas Masuk Sekolah Dasar
          </h2>
          <p className="text-xs md:text-sm text-emerald-200/90 leading-relaxed">
            Menyiapkan kemandirian, kematangan emosi, adab islami, dan ketenangan orang tua dalam mengantar ananda melangkah ke jenjang SD/MI dengan penuh senyuman & keberkahan.
          </p>

          {/* Quick Progress Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5 text-emerald-300">
              <span>Indeks Kesiapan Ananda: {completedCount} dari {totalCount} Indikator</span>
              <span className="font-bold">{progressPercent}% Siap SD</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-emerald-500/30">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 text-white/5 pointer-events-none">
          <GraduationCap className="w-64 h-64" />
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          id="btn-subtab-checklist"
          onClick={() => setActiveSection('CHECKLIST')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSection === 'CHECKLIST'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>Checklist Kesiapan Ananda ({completedCount}/{totalCount})</span>
        </button>

        <button
          id="btn-subtab-prayers"
          onClick={() => setActiveSection('PRAYERS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSection === 'PRAYERS'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Kumpulan Doa Menuntut Ilmu</span>
        </button>

        <button
          id="btn-subtab-tips"
          onClick={() => setActiveSection('TIPS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSection === 'TIPS'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Tips Pendampingan Orang Tua</span>
        </button>

        <button
          id="btn-subtab-schools"
          onClick={() => setActiveSection('SCHOOLS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSection === 'SCHOOLS'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-teal-400" />
          <span>Direktori SD/MI Mitra Pilihan</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div>
        {activeSection === 'CHECKLIST' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Indikator Kesiapan Belajar Mandiri di Sekolah Dasar
                </h3>
                <p className="text-xs text-stone-500">
                  Klik pada lingkaran untuk menandai aspek yang sudah matang dipraktikkan ananda.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold self-start sm:self-auto">
                Bebas Tekanan & Penuh Apresiasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 select-none ${
                    item.isCompleted
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-stone-400" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold ${item.isCompleted ? 'text-emerald-950 font-extrabold' : 'text-slate-800'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200 font-bold shrink-0">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-[10px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/50 mt-2 font-medium">
                      💡 <strong>Saran Ustadzah:</strong> {item.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'PRAYERS' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="pb-4 border-b border-stone-200">
              <h3 className="text-base font-extrabold text-slate-900">
                Kumpulan Doa & Dzikir Menuntut Ilmu untuk Santri & Orang Tua
              </h3>
              <p className="text-xs text-stone-500">
                Lafal doa harian untuk dibaca bersama sebelum melangkah ke sekolah baru.
              </p>
            </div>

            <div className="space-y-5">
              {data.prayers.map((prayer) => {
                const isPlaying = playingAudioId === prayer.id;
                return (
                  <div
                    key={prayer.id}
                    className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-emerald-500/30 space-y-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-300 font-mono tracking-wide uppercase">
                        {prayer.title}
                      </span>
                      <button
                        onClick={() => handlePlayAudio(prayer.id)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-400 text-slate-950 animate-pulse'
                            : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlaying ? 'Memutar Audio...' : 'Dengarkan Tartil'}</span>
                      </button>
                    </div>

                    {/* Arabic Calligraphy Style */}
                    <div className="text-right py-2 px-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                      <p className="text-xl md:text-2xl font-serif text-amber-200 leading-loose">
                        {prayer.arabic}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="font-mono text-emerald-300 italic">
                        "{prayer.latin}"
                      </p>
                      <p className="text-slate-300">
                        <strong>Artinya:</strong> {prayer.meaning}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] text-stone-400 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{prayer.context}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'TIPS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.parentTips.map((tip, idx) => (
              <div
                key={tip.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                    0{idx + 1}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {tip.summary}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {tip.keyPoints.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-[11px] text-stone-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 text-xs italic text-amber-900 bg-amber-50/60 p-3 rounded-2xl">
                  {tip.quote}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'SCHOOLS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.partnerSchools.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono">
                      {sch.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {sch.accreditation}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900">{sch.name}</h4>
                  <p className="text-xs text-stone-500">{sch.address} ({sch.distance})</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {sch.characteristics.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg"
                      >
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600 font-mono">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>{sch.alumniCountEnrolled} Alumni Asy Syifa</span>
                  </div>

                  <a
                    href={`tel:${sch.contactPhone}`}
                    className="py-1.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-amber-400" /> Kontak Info
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
