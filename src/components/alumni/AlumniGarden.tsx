import React, { useState, useEffect } from 'react';
import { 
  Trees, 
  GraduationCap, 
  Sparkles, 
  Heart, 
  BookOpen, 
  Users, 
  Calendar, 
  Share2, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  MessageCircle, 
  Compass, 
  ArrowRight,
  Send,
  UserCheck
} from 'lucide-react';
import { 
  AlumniProfile, 
  AlumniWishTreeItem, 
  AlumniReunionEvent,
  WishCategory
} from '../../types/alumni';
import { alumniTransitionEngine } from '../../services/alumniTransitionEngine';
import { AlumniPassportCard } from './AlumniPassportCard';
import { LegacyFamilyTree } from './LegacyFamilyTree';
import { ReferralGarden } from './ReferralGarden';
import { SDTransitionHub } from './SDTransitionHub';
import { LegacyForestViewer } from './LegacyForestViewer';
import { AlumniTransitionModal } from './AlumniTransitionModal';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onNavigateToPPDB?: () => void;
  onNavigateToHome?: () => void;
}

export const AlumniGarden: React.FC<Props> = ({ onNavigateToPPDB, onNavigateToHome }) => {
  const { activeRole, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PASSPORT' | 'LEGACY_TREE' | 'REFERRAL' | 'SD_HUB' | 'FOREST' | 'WISH_REUNION'>('OVERVIEW');
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [wishes, setWishes] = useState<AlumniWishTreeItem[]>([]);
  const [reunionEvents, setReunionEvents] = useState<AlumniReunionEvent[]>([]);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  
  // New Wish Form State
  const [newDoaText, setNewDoaText] = useState('');
  const [newDoaCategory, setNewDoaCategory] = useState<WishCategory>('DOA_ADIK_KELAS');
  const [newDoaAuthor, setNewDoaAuthor] = useState(userProfile?.nama || userProfile?.name || 'Keluarga Alumni Asy Syifa');
  const [wishToast, setWishToast] = useState<string | null>(null);

  const loadEngineData = () => {
    const list = alumniTransitionEngine.getAlumniList();
    const wList = alumniTransitionEngine.getAlumniWishes();
    const evList = alumniTransitionEngine.getReunionEvents();
    setAlumniList(list);
    setWishes(wList);
    setReunionEvents(evList);
    if (list.length > 0 && !selectedAlumni) {
      setSelectedAlumni(list[0]);
    }
  };

  useEffect(() => {
    loadEngineData();
  }, []);

  const handleSendBlessing = (wishId: string) => {
    alumniTransitionEngine.sendBlessingToWish(wishId);
    setWishes(alumniTransitionEngine.getAlumniWishes());
  };

  const handleRsvp = (eventId: string) => {
    const res = alumniTransitionEngine.rsvpReunionEvent(eventId, newDoaAuthor);
    setReunionEvents(alumniTransitionEngine.getReunionEvents());
    setWishToast(`Alhamdulillah! Konfirmasi kehadiran pada '${res.event.title}' berhasil diperbarui.`);
    setTimeout(() => setWishToast(null), 3500);
  };

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoaText.trim()) return;

    alumniTransitionEngine.submitAlumniWish({
      alumniId: selectedAlumni?.id || 'alm-custom',
      alumniName: newDoaAuthor,
      graduationYear: selectedAlumni?.graduationYear || 2024,
      cohortName: selectedAlumni?.cohortName || 'Keluarga Besar Alumni Asy Syifa',
      doaText: newDoaText,
      category: newDoaCategory,
      leafTone: newDoaCategory === 'DOA_ADIK_KELAS' ? 'emerald' : newDoaCategory === 'SYUKUR_GURU' ? 'gold' : 'teal'
    });

    setWishes(alumniTransitionEngine.getAlumniWishes());
    setNewDoaText('');
    setWishToast('MasyaAllah! Doa dan harapan Ananda berhasil disematkan di Wish Tree.');
    setTimeout(() => setWishToast(null), 4000);
  };

  const canManageTransitions = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN', 'GURU'].includes(activeRole);

  return (
    <div id="alumni-garden-root" className="min-h-screen bg-stone-100 text-slate-800 pb-16">
      {/* Living Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white relative overflow-hidden border-b border-emerald-500/30">
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> TAMAN ALUMNI ASY SYIFA • SPRINT G10
                </span>
                <span className="text-xs font-serif italic text-amber-300/90">
                  "Lulus bukan berarti keluar, silaturahmi selamanya."
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Alumni Universe & Taman Kenangan
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                Selamat datang kembali di rumah belajar tercinta! Ruang temu digital untuk mengenang karya masa kecil, memantau kesinambungan silsilah keluarga, berbagi rekomendasi berkah, dan menjaga api kecintaan pada Al-Quran.
              </p>
            </div>

            {/* Quick Action Buttons for Management */}
            <div className="flex flex-wrap items-center gap-3">
              {canManageTransitions && (
                <button
                  id="btn-open-transition-modal"
                  onClick={() => setShowTransitionModal(true)}
                  className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" /> Wisuda Santri (P1 Engine)
                </button>
              )}

              <button
                id="btn-go-ppdb"
                onClick={onNavigateToPPDB}
                className="py-3 px-4 rounded-2xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs border border-emerald-400/40 transition flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> Jalur PPDB Prioritas
              </button>
            </div>
          </div>

          {/* Quick Metrics Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8 pt-6 border-t border-emerald-500/20">
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-emerald-500/20">
              <p className="text-[10px] font-mono uppercase text-slate-400">Total Alumni</p>
              <h4 className="text-xl font-black text-amber-300">255+ Santri</h4>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-emerald-500/20">
              <p className="text-[10px] font-mono uppercase text-slate-400">Pohon Angkatan</p>
              <h4 className="text-xl font-black text-emerald-300">5 Generasi</h4>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-emerald-500/20">
              <p className="text-[10px] font-mono uppercase text-slate-400">Doa Tersemat</p>
              <h4 className="text-xl font-black text-teal-300">{wishes.length + 230} Doa Berkah</h4>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-emerald-500/20">
              <p className="text-[10px] font-mono uppercase text-slate-400">Lanjut SD Unggulan</p>
              <h4 className="text-xl font-black text-amber-400">98.7% Santri</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            <button
              id="tab-nav-overview"
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'OVERVIEW'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              🌿 <span>Taman Alumni</span>
            </button>

            <button
              id="tab-nav-passport"
              onClick={() => setActiveTab('PASSPORT')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'PASSPORT'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              🎓 <span>Paspor Digital (P4)</span>
            </button>

            <button
              id="tab-nav-family-tree"
              onClick={() => setActiveTab('LEGACY_TREE')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'LEGACY_TREE'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              👨‍👩‍👧‍👦 <span>Family Tree (P3)</span>
            </button>

            <button
              id="tab-nav-forest"
              onClick={() => setActiveTab('FOREST')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'FOREST'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              🌳 <span>Legacy Forest (P7)</span>
            </button>

            <button
              id="tab-nav-referral"
              onClick={() => setActiveTab('REFERRAL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'REFERRAL'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              🤝 <span>Referral Garden (P5)</span>
            </button>

            <button
              id="tab-nav-sd-hub"
              onClick={() => setActiveTab('SD_HUB')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SD_HUB'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              🏫 <span>SD Transition Hub (P6)</span>
            </button>

            <button
              id="tab-nav-wish-reunion"
              onClick={() => setActiveTab('WISH_REUNION')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'WISH_REUNION'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              🌟 <span>Wish Tree & Reuni Akbar</span>
            </button>
          </div>
        </div>
      </div>

      {wishToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-md animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{wishToast}</span>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* Welcome Back Card with Mascots Asy & Syifa */}
            <div className="bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/50 rounded-3xl p-6 md:p-8 border-2 border-emerald-200/80 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-mono">
                  🌸 AHMED & FATIMAH WELCOME BACK
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  Kisah Ananda Terukir Abadi di Rumah Belajar Asy Syifa
                </h2>
                <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                  Meskipun ananda kini telah melangkah ke jenjang Sekolah Dasar, rekam jejak hafalan Al-Quran, karya sentra balok, dan doa ustadzah selalu hidup di sini.
                </p>

                <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                  <button
                    onClick={() => setActiveTab('PASSPORT')}
                    className="py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-300" /> Buka Paspor Digital Ananda
                  </button>
                  <button
                    onClick={() => setActiveTab('WISH_REUNION')}
                    className="py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs border border-stone-300 transition flex items-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 text-rose-500" /> Kirim Doa untuk Adik Kelas
                  </button>
                </div>
              </div>

              {/* Decorative Mascot Illustration Badge */}
              <div className="relative shrink-0 text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-200 via-emerald-200 to-teal-200 p-2 shadow-xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-white p-3">
                    <span className="text-3xl md:text-4xl mb-1">🌿✨</span>
                    <span className="text-[10px] font-mono text-amber-300 font-bold">ASY & SYIFA</span>
                    <span className="text-[9px] text-slate-300">Penjaga Ukhuwah</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Pillar Cards (P3, P4, P5, P6, P7) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('PASSPORT')}
                className="bg-white p-6 rounded-3xl border border-stone-200 hover:border-emerald-400 hover:shadow-lg transition cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    🎓
                  </div>
                  <h3 className="font-black text-slate-900 text-base">Alumni Passport (P4)</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Identitas resmi digital santri, capaian tahfidz juz 30 mutqin, lencana karakter, dan QR verifikasi resmi.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <span>Buka Paspor</span> <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('LEGACY_TREE')}
                className="bg-white p-6 rounded-3xl border border-stone-200 hover:border-emerald-400 hover:shadow-lg transition cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    👨‍👩‍👧‍👦
                  </div>
                  <h3 className="font-black text-slate-900 text-base">Legacy Family Tree (P3)</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Pohon silsilah kesinambungan keluarga: Kakak Alumni, Adik Santri Aktif, dan Prioritas PPDB Adik Sepupu.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <span>Lihat Silsilah</span> <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('SD_HUB')}
                className="bg-white p-6 rounded-3xl border border-stone-200 hover:border-emerald-400 hover:shadow-lg transition cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    🏫
                  </div>
                  <h3 className="font-black text-slate-900 text-base">SD Transition Hub (P6)</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Checklist kesiapan belajar mandiri, kumpulan doa menuntut ilmu, tips orang tua, dan direktori SD/MI mitra.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <span>Buka Panduan SD</span> <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Featured Section: Wish Tree Preview & Upcoming Reunions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Wishes Feed */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-7 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" /> Doa Terbaru dari Keluarga Alumni
                    </h3>
                    <p className="text-xs text-stone-500">
                      Pesan cinta dan harapan untuk adik-adik kelas & ustadzah tercinta.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('WISH_REUNION')}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Lihat Semua Doa
                  </button>
                </div>

                <div className="space-y-3">
                  {wishes.slice(0, 3).map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-slate-900">{w.alumniName}</span>
                          <span className="text-[10px] text-stone-500 font-mono ml-2">({w.cohortName})</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {w.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 italic leading-relaxed">
                        "{w.doaText}"
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                        <span>{new Date(w.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <button
                          onClick={() => handleSendBlessing(w.id)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:border-emerald-400 text-emerald-800 font-bold flex items-center gap-1 transition"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" /> {w.blessingCount} Aamiin
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reunion Events Preview */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-7 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" /> Agenda Reuni & Temu Santri
                    </h3>
                    <p className="text-xs text-stone-500">
                      Jadwal temu kangen & sharing session alumni.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {reunionEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white space-y-2 border border-emerald-500/20"
                    >
                      <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 bg-amber-400 text-slate-950 rounded">
                        {ev.category.replace('_', ' ')}
                      </span>
                      <h4 className="font-extrabold text-sm text-white">{ev.title}</h4>
                      <div className="text-xs text-emerald-200 font-mono space-y-0.5">
                        <p>📅 {ev.date} ({ev.time})</p>
                        <p>📍 {ev.location}</p>
                      </div>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-stone-300">{ev.attendeesCount} Keluarga Terdaftar</span>
                        <button
                          onClick={() => handleRsvp(ev.id)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                            ev.userRsvpd
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {ev.userRsvpd ? '✓ Terdaftar (Batal)' : 'RSVP Hadir'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PASSPORT' && (
          <div className="space-y-6">
            {/* Alumni Profile Selector if multiple exist */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-stone-600 uppercase font-mono shrink-0">
                Pilih Profil Santri Alumni:
              </span>
              {alumniList.map((alm) => (
                <button
                  key={alm.id}
                  onClick={() => setSelectedAlumni(alm)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedAlumni?.id === alm.id
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {alm.studentName} ({alm.graduationYear})
                </button>
              ))}
            </div>

            {selectedAlumni ? (
              <AlumniPassportCard alumni={selectedAlumni} />
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
                Belum ada data alumni terpilih.
              </div>
            )}
          </div>
        )}

        {activeTab === 'LEGACY_TREE' && (
          <LegacyFamilyTree
            parentUid={userProfile?.uid || 'usr-parent-01'}
            onOpenPPDB={onNavigateToPPDB}
          />
        )}

        {activeTab === 'FOREST' && (
          <LegacyForestViewer />
        )}

        {activeTab === 'REFERRAL' && (
          <ReferralGarden
            alumniUid={userProfile?.uid || 'usr-parent-01'}
            alumniName={userProfile?.nama || userProfile?.name || 'H. Lukman Hakim'}
          />
        )}

        {activeTab === 'SD_HUB' && (
          <SDTransitionHub />
        )}

        {activeTab === 'WISH_REUNION' && (
          <div className="space-y-8">
            {/* Submit Wish Tree Form */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    🌿
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Sematkan Doa di Digital Wish Tree Alumni
                    </h3>
                    <p className="text-xs text-stone-500">
                      Pesan doa Anda akan menjadi Daun Emas abadi di Pohon Harapan Asy Syifa.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitWish} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nama Pengirim / Keluarga Santri
                    </label>
                    <input
                      type="text"
                      required
                      value={newDoaAuthor}
                      onChange={(e) => setNewDoaAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Kategori Doa
                    </label>
                    <select
                      value={newDoaCategory}
                      onChange={(e) => setNewDoaCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="DOA_ADIK_KELAS">Doa untuk Adik Kelas</option>
                      <option value="SYUKUR_GURU">Ucapan Terima Kasih Ustadzah</option>
                      <option value="CITA_CITA">Cita-Cita & Harapan Masa Depan</option>
                      <option value="HARAPAN_MADRASAH">Doa Kemajuan Madrasah</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Isi Untaian Doa & Pesan Kebaikan
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tuliskan doa tulus untuk adik-adik kelas, ustadzah, atau kenangan terindah ananda..."
                    value={newDoaText}
                    onChange={(e) => setNewDoaText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Sematkan Daun Doa
                  </button>
                </div>
              </form>
            </div>

            {/* List of All Wishes */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Untaian Doa & Harapan Lengkap
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{w.alumniName}</h4>
                          <p className="text-[10px] text-stone-500 font-mono">{w.cohortName}</p>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {w.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 italic leading-relaxed">
                        "{w.doaText}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                      <span>{new Date(w.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <button
                        onClick={() => handleSendBlessing(w.id)}
                        className="px-3 py-1 rounded-xl bg-white border border-stone-300 hover:border-emerald-400 text-emerald-800 font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {w.blessingCount} Aamiin
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Graduation Transition Modal (P1) */}
      <AlumniTransitionModal
        isOpen={showTransitionModal}
        onClose={() => setShowTransitionModal(false)}
        onSuccess={() => {
          loadEngineData();
        }}
        currentRole={activeRole}
        operatorUid={userProfile?.uid || 'usr-admin-01'}
      />
    </div>
  );
};
