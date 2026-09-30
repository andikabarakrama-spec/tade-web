import React, { useState } from 'react';
import { 
  Home, Heart, Users, BookOpen, Camera, Sparkles, Award, ShieldCheck, 
  Calendar, Layers, Feather, QrCode, CreditCard, Bell, FileText, PiggyBank, 
  Sun, Moon, Smile, ArrowRight, CheckCircle2, Star, Compass, RefreshCw, 
  Sliders, Send, MapPin, TreePine, GraduationCap, Image as ImageIcon, Flame
} from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';

export const MasterDigitalHomeEcosystem: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<'public_gate' | 'family_area' | 'admin_cms' | 'digital_heritage'>('public_gate');

  // Family Area State Mock
  const [selectedChild, setSelectedChild] = useState({
    name: 'Muhammad Hafizh Al-Fatih',
    class: 'Kelompok B - Bunga Kamboja',
    nisn: '3192038192',
    attendanceToday: 'Hadir (07:15 WIB)',
    surahHafalan: 'An-Naba (Ayat 1-15)',
    savingsBalance: 'Rp 450.000',
    tuitionStatus: 'Lunas Bulan Ini (BBM QRIS)'
  });

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Master Ecosystem Header Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400/70 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-emerald-800/80 pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 fill-slate-950" /> WR-MASTER ECOSYSTEM
              </span>
              <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 font-extrabold text-xs px-3 py-1 rounded-full">
                Rumah Digital TK Asy Syifa Tanggul
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-amber-100 tracking-tight leading-snug">
              Satu Ekosistem Digital Berkelanjutan
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
              Mewujudkan kehangatan suasana desa Tanggul: Gerbang Publik, Ruang Keluarga Orang Tua (Family Area), Control Room CMS Admin, dan Jejak Digital Heritage Anak.
            </p>
          </div>

          {/* AI Asy Master Companion Badge */}
          <div className="p-4 bg-emerald-900/90 rounded-2xl border-2 border-amber-300/50 shadow-xl flex items-center gap-4 shrink-0 w-full lg:w-auto">
            <div className="w-12 h-14 shrink-0">
              <AIAsyCharacterRenderer state="happy" scale={0.8} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                AI ASY SAHABAT KECIL
              </span>
              <p className="text-xs text-white font-bold italic leading-snug">
                "Selamat datang di Rumah Digital TK Asy Syifa!"
              </p>
            </div>
          </div>
        </div>

        {/* Master Ecosystem Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 relative z-10">
          {[
            { id: 'public_gate', label: '1. Gerbang Publik Website', desc: 'Beranda, Outbound, PPDB & Blog', icon: '🌳' },
            { id: 'family_area', label: '2. Family Area (Portal)', desc: 'Absensi, Karya, QRIS & Tabungan', icon: '🏡' },
            { id: 'admin_cms', label: '3. Admin CMS Control', desc: 'Living Engine & Theme Switcher', icon: '⚙️' },
            { id: 'digital_heritage', label: '4. Digital Heritage Anak', desc: 'Buku Perjalanan & Wisuda', icon: '🎓' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEcosystemTab(tab.id as any)}
              className={`p-4 rounded-2xl text-left transition cursor-pointer border flex flex-col justify-between h-28 ${
                activeEcosystemTab === tab.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xl scale-102 font-black ring-2 ring-amber-300'
                  : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800 border-emerald-700/60 font-bold'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{tab.icon}</span>
                {activeEcosystemTab === tab.id && (
                  <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md font-black">
                    AKTIF
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs block font-black leading-tight">{tab.label}</span>
                <span className="text-[10px] opacity-80 block truncate mt-0.5">{tab.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ECOSYSTEM TAB 1: PUBLIC GATE & COMMUNITY AGENDA */}
      {activeEcosystemTab === 'public_gate' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                1. Gerbang Publik & Agenda Sekolah
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Halaman Utama Rumah Digital & Kegiatan Mendatang
              </h2>
            </div>

            {onTabChange && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onTabChange('w4PPDB')}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4" /> PPDB Online
                </button>
                <button
                  onClick={() => onTabChange('w3Informasi')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" /> Galeri & Berita
                </button>
              </div>
            )}
          </div>

          {/* Featured School Programs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Outbound Alam Tanggul', tag: 'Aktivitas Outdoor', desc: 'Anak-anak menjelajah kebun edukasi dan sawah hijau Tanggul.', icon: '🌿' },
              { title: 'Manasik Haji Cilik', tag: 'Pendidikan Karakter', desc: 'Latihan thawaf dan sa\'i cilik di halaman sekolah bersuasana ka\'bah.', icon: '🕌' },
              { title: 'Pentas Seni & Kreasi', tag: 'Pengembangan Bakat', desc: 'Menampilkan tarian Islami, hafalan surah, dan puisi kasih ibu.', icon: '🎨' },
              { title: 'Wisata Edukasi Pedesaan', tag: 'Pengenalan Lingkungan', desc: 'Kunjungan edukatif mengenal profesi petani dan pembuat tempe.', icon: '🚜' },
            ].map((prog, idx) => (
              <div key={idx} className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2 hover:shadow-md transition">
                <span className="text-2xl block">{prog.icon}</span>
                <span className="text-[10px] font-black bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-md">
                  {prog.tag}
                </span>
                <h3 className="text-sm font-black text-slate-900 leading-snug">{prog.title}</h3>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ECOSYSTEM TAB 2: FAMILY AREA (PORTAL ORANG TUA) */}
      {activeEcosystemTab === 'family_area' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                2. Family Area • Ruang Keluarga Orang Tua
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Portal Informasi Realtime Ananda
              </h2>
            </div>

            <div className="bg-emerald-900 text-amber-300 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2">
              <Smile className="w-4 h-4 text-amber-300" />
              <span>Ananda: {selectedChild.name} ({selectedChild.class})</span>
            </div>
          </div>

          {/* Family Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-500 block">Absensi Realtime:</span>
              <span className="text-sm font-black text-emerald-800 block">{selectedChild.attendanceToday}</span>
              <span className="text-[11px] text-stone-600 font-bold block">Guru Menyambut: Bu Guru Ani</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-500 block">Capaian Tahfidz:</span>
              <span className="text-sm font-black text-amber-800 block">{selectedChild.surahHafalan}</span>
              <span className="text-[11px] text-emerald-800 font-bold block">✓ Makhraj Sangat Fasih</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-500 block">Status SPP / BBM:</span>
              <span className="text-sm font-black text-emerald-800 block">{selectedChild.tuitionStatus}</span>
              <span className="text-[11px] text-stone-600 font-bold flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-emerald-700" /> QRIS Instant Approved
              </span>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-500 block">Tabungan Cilik Anak:</span>
              <span className="text-sm font-black text-teal-800 block">{selectedChild.savingsBalance}</span>
              <span className="text-[11px] text-stone-600 font-bold block">Tercatat di Kasir Sekolah</span>
            </div>
          </div>
        </div>
      )}

      {/* ECOSYSTEM TAB 3: ADMIN CMS CONTROL ROOM */}
      {activeEcosystemTab === 'admin_cms' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              3. Admin CMS Control Room
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Pengelolaan Seluruh Tampilan & Konten Tanpa Coding
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xs font-black text-slate-900 block">Living School Engine</span>
              <span className="text-xs text-stone-600 block">Misi Harian, Photo AI, Story AI, dan Freshness Score.</span>
              <span className="text-[10px] font-black bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-md inline-block">Aktif</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xs font-black text-slate-900 block">Season & Theme Switcher</span>
              <span className="text-xs text-stone-600 block">Ubah tema Ramadan, Idul Fitri, 17 Agustus, atau Hari Guru.</span>
              <span className="text-[10px] font-black bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-md inline-block">Aktif</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xs font-black text-slate-900 block">AI Asy Persona Settings</span>
              <span className="text-xs text-stone-600 block">Mengatur pesan sambutan hangat AI Asy untuk pengunjung.</span>
              <span className="text-[10px] font-black bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-md inline-block">Aktif</span>
            </div>
          </div>
        </div>
      )}

      {/* ECOSYSTEM TAB 4: DIGITAL HERITAGE & GROWTH ARCHIVE */}
      {activeEcosystemTab === 'digital_heritage' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              4. Digital Heritage & Warisan Perjalanan Anak
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Arsip Abadi Pertumbuhan dari Hari Pertama sampai Wisuda
            </h2>
          </div>

          <div className="p-6 bg-gradient-to-r from-amber-900 via-emerald-950 to-teal-950 text-white rounded-2xl border-2 border-amber-400/60 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-lg font-black text-amber-200">
                  Buku Kenangan Digital Mahakarya Ananda
                </h3>
                <p className="text-xs text-emerald-100 font-medium">
                  Seluruh karya lukis, rekaman hafalan juz 30, foto outbound, dan ijazah digital tersimpan aman dalam portofolio abadi keluarga.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
