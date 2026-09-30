import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Camera,
  Crown,
  Trees as TreeIcon,
  Heart,
  UserCheck,
  Layers,
  Zap,
  ShieldCheck,
  Eye,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { livingEventEngine, SchoolEventType } from '../../services/livingEventEngine';
import { LivingAvatarStudio } from './LivingAvatarStudio';
import { GrowingTreeViewer } from './GrowingTreeViewer';
import { WishTreeViewer } from './WishTreeViewer';
import { LivingProfileEntrance } from './LivingProfileEntrance';
import { FounderPresenceSequence } from '../founder/FounderPresenceSequence';
import { MagicGardenLayer } from '../garden/MagicGardenLayer';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

type UniverseTab = 'EVENT_ENGINE' | 'AVATAR_STUDIO' | 'FOUNDER_PRESENCE' | 'GROWING_TREE' | 'WISH_TREE' | 'GARDEN_LAYER';

export const LivingSchoolUniverseHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UniverseTab>('EVENT_ENGINE');
  const [activeEvent, setActiveEvent] = useState(() => livingEventEngine.getActiveEvent());
  const [showPresenceModal, setShowPresenceModal] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const allEvents = livingEventEngine.getAllEvents();
  const academicCalendar = livingEventEngine.getAcademicCalendar();

  const handleSelectEventOverride = (type: SchoolEventType | null) => {
    livingEventEngine.setManualOverride(type);
    const updated = livingEventEngine.getActiveEvent();
    setActiveEvent(updated);

    founderCommandRecorder.recordCommand(
      'CONFIG_UPDATE',
      'Living Event Engine',
      `Event Sekolah aktif diubah menjadi: ${updated.title}`
    );

    setFeedback(`Event aktif diperbarui: ${updated.title}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6" id="living-school-universe-hub">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-stone-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                SPRINT G6 • LIVING SCHOOL UNIVERSE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                7 PILLARS ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              TADE Living School Universe Console
            </h1>
            <p className="text-stone-300 text-sm max-w-2xl">
              Pondasi ekosistem hidup sekolah: Living Event Engine, Dual Photo Avatar Studio, Founder Presence, Growing Tree, Wish Tree, dan Magic Garden Layer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPresenceModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>Tes Urutan Founder Presence</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Navigation Pills for 7 Pillars */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
        <button
          onClick={() => setActiveTab('EVENT_ENGINE')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'EVENT_ENGINE'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>P1 — Living Event Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('AVATAR_STUDIO')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'AVATAR_STUDIO'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>P2 — Living Avatar Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('GROWING_TREE')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'GROWING_TREE'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <TreeIcon className="w-4 h-4" />
          <span>P4 — Growing Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('WISH_TREE')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'WISH_TREE'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>P5 — Wish Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('GARDEN_LAYER')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'GARDEN_LAYER'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>P6 & P7 — Profile & Magic Garden</span>
        </button>
      </div>

      {/* Tab 1: P1 — Living Event Engine */}
      {activeTab === 'EVENT_ENGINE' && (
        <div className="space-y-6">
          {/* Active Event Showcase Card */}
          <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl bg-gradient-to-r ${activeEvent.themeColor} border border-stone-800 space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                {activeEvent.badge}
              </span>
              <span className="text-xs text-stone-300 font-mono">
                Rentang Waktu: {activeEvent.dateRangeLabel}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black">{activeEvent.title}</h3>
              <p className="text-stone-300 text-xs mt-1">
                Respons seragam: Kostum Maskot, Template Studio Kreatif, Nutrisi Pohon, dan Kategori Wish Tree otomatis beradaptasi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950/60 rounded-2xl border border-stone-800 space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Sapaan Asy:</div>
                <p className="text-xs text-stone-200">"{activeEvent.mascotGreetingAsy}"</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-2xl border border-stone-800 space-y-1">
                <div className="text-[10px] text-teal-400 font-bold uppercase">Sapaan Syifa:</div>
                <p className="text-xs text-stone-200">"{activeEvent.mascotGreetingSyifa}"</p>
              </div>
            </div>
          </div>

          {/* Event Selector Deck */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Pilih Simulasi Event Sekolah (Manual Switcher)
              </h3>
              <button
                onClick={() => handleSelectEventOverride(null)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
              >
                Gunakan Waktu Riil
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {allEvents.map((evt) => (
                <button
                  key={evt.eventId}
                  onClick={() => handleSelectEventOverride(evt.eventId)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                    activeEvent.eventId === evt.eventId
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xs font-black">{evt.badge}</div>
                  <p className="text-[10px] text-stone-500 font-normal">{evt.dateRangeLabel}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Academic Calendar Timeline */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Kalender Akademik Terintegrasi (School Time Engine)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {academicCalendar.map((item) => (
                <div key={item.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.eventType}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">{item.startDate}</span>
                  </div>
                  <div className="text-xs font-black text-stone-900">{item.title}</div>
                  <p className="text-[11px] text-stone-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: P2 — Living Avatar Studio */}
      {activeTab === 'AVATAR_STUDIO' && <LivingAvatarStudio />}

      {/* Tab 3: P4 — Growing Tree */}
      {activeTab === 'GROWING_TREE' && <GrowingTreeViewer />}

      {/* Tab 4: P5 — Wish Tree */}
      {activeTab === 'WISH_TREE' && <WishTreeViewer />}

      {/* Tab 5: P6 & P7 — Living Profile & Magic Garden */}
      {activeTab === 'GARDEN_LAYER' && (
        <div className="space-y-6">
          {/* Living Profile Card Showcase */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                LIVING PROFILE ENTRANCE (P6)
              </span>
              <h3 className="text-base font-black text-stone-900">
                Pondasi Kartu Profil Hidup (Santri, Guru, & Founder)
              </h3>
              <p className="text-xs text-stone-500">
                Micro-bounce entrance, 3D soft elevation shadow, living emerald border, dan ambient kupu-kupu dekoratif.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <LivingProfileEntrance
                name="Bapak Andika"
                roleTitle="Founder & Direktur Utama"
                isFounder={true}
                avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
              >
                <div className="text-[11px] text-stone-600">
                  Aura kedaulatan Ring-0 & Kunci Memory Lock v10.3.
                </div>
              </LivingProfileEntrance>

              <LivingProfileEntrance
                name="Ustadzah Fatimah, S.Pd."
                roleTitle="Kepala Sentra Balok"
                isFounder={false}
                avatarUrl="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400"
              >
                <div className="text-[11px] text-stone-600">
                  Penilaian harian & catatan perkembangan santri.
                </div>
              </LivingProfileEntrance>

              <LivingProfileEntrance
                name="Ananda Aisyah Putri"
                roleTitle="Santri Kelompok B1"
                isFounder={false}
                avatarUrl="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"
              >
                <div className="text-[11px] text-stone-600">
                  Hafalan Juz 30: Surah An-Nasr • Level 3 Batang Karakter.
                </div>
              </LivingProfileEntrance>
            </div>
          </div>

          {/* Magic Garden Ambient Settings */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl border border-stone-800 p-6 text-white space-y-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MAGIC GARDEN AMBIENT LAYER (P7)
              </span>
              <h3 className="text-base font-black text-white">
                Lapisan Partikel Cahaya, Daun Melayang, & Kupu-Kupu
              </h3>
              <p className="text-xs text-stone-300">
                Beroperasi menggunakan Canvas requestAnimationFrame tanpa membebani browser. Menyesuaikan status GPU Quality Switch.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-stone-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-300">Status Lapisan Hidup:</div>
                <div className="text-sm font-black text-white mt-0.5">Aktif (Particle Sync: High Quality)</div>
              </div>
              <div className="text-xs font-mono text-stone-400">
                FPS: 60 • GPU Load: &lt; 1%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Founder Presence Sequence Modal */}
      {showPresenceModal && (
        <FounderPresenceSequence
          onComplete={() => setShowPresenceModal(false)}
          autoDismissMs={3500}
        />
      )}

      {/* Magic Garden Ambient Layer */}
      <MagicGardenLayer enabled={true} timeOfDay="Pagi" />
    </div>
  );
};
