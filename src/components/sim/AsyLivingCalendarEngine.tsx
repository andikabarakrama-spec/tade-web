import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Sun, 
  Moon, 
  CloudRain, 
  Flag, 
  BookOpen, 
  GraduationCap, 
  Heart, 
  Star, 
  Clock, 
  Compass, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Shirt,
  MapPin,
  CalendarCheck
} from 'lucide-react';

export type EventPriorityLevel = 'EVENT_SEKOLAH' | 'HARI_BESAR_NASIONAL' | 'HARI_BESAR_ISLAM' | 'KALENDER_PENDIDIKAN' | 'TEMA_HARIAN';

export interface CalendarResolvedState {
  dateString: string;
  dayOfWeek: string;
  hijriDate: string;
  activeEventName: string;
  priorityLevel: EventPriorityLevel;
  recommendedCostumeId: string;
  recommendedCostumeName: string;
  culturalGreeting: string;
  animationAtmosphere?: string;
  animation?: string;
  colorScheme: {
    primary: string;
    accent: string;
    bgBadge: string;
  };
}

export const AsyLivingCalendarEngine: React.FC = () => {
  // Simulator Date (Default to today in 2026)
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-17'); // Default testing 17 Agustus 2026

  // Pre-configured Calendar Rules Database
  const calendarRules = useMemo(() => [
    // 1. EVENT SEKOLAH (Prioritas 1)
    {
      id: 'EV-01',
      matchType: 'EXACT_DATE',
      date: '2026-06-25',
      name: 'Haflah Akhirussanah & Wisuda Santri Angkatan VII',
      priority: 'EVENT_SEKOLAH' as EventPriorityLevel,
      costumeId: 'COSTUME-WISUDA',
      costumeName: 'Toga & Jubah Wisuda Cilik',
      greeting: 'Barakallah santri sholeh/sholehah, selamat atas wisuda & kelulusanmu!',
      animation: 'Konfeti Emas & Topi Toga Melayang',
      colorScheme: { primary: '#854d0e', accent: '#ca8a04', bgBadge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200' }
    },
    {
      id: 'EV-02',
      matchType: 'EXACT_DATE',
      date: '2026-07-15',
      name: 'MPLS & Ta\'aruf Santri Baru Sentra',
      priority: 'EVENT_SEKOLAH' as EventPriorityLevel,
      costumeId: 'COSTUME-TK-SENTRA',
      costumeName: 'Seragam Kotak-Kotak Hijau Sentra',
      greeting: 'Ahlan wa Sahlan di KB-TK-TPA Sentra Asy-Syifa!',
      animation: 'Balon Warna-Warni Sentra & Bintang Sambutan',
      colorScheme: { primary: '#047857', accent: '#10b981', bgBadge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' }
    },

    // 2. HARI BESAR NASIONAL (Prioritas 2)
    {
      id: 'NAT-01',
      matchType: 'EXACT_DATE',
      date: '2026-08-17',
      name: 'HUT Kemerdekaan Republik Indonesia Ke-81',
      priority: 'HARI_BESAR_NASIONAL' as EventPriorityLevel,
      costumeId: 'COSTUME-MERDEKA',
      costumeName: 'Pakaian Pejuang Kemerdekaan Merah Putih',
      greeting: 'Dirgahayu Republik Indonesia! Merdeka dalam belajar dan berakhlak mulia!',
      animation: 'Kibaran Bendera Merah Putih & Konfeti Semangat Patriotik',
      colorScheme: { primary: '#b91c1c', accent: '#ef4444', bgBadge: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200' }
    },
    {
      id: 'NAT-02',
      matchType: 'EXACT_DATE',
      date: '2026-11-25',
      name: 'Hari Guru Nasional & PGRI',
      priority: 'HARI_BESAR_NASIONAL' as EventPriorityLevel,
      costumeId: 'COSTUME-BATIK-GURU',
      costumeName: 'Batik PGRI & Busana Pendidik',
      greeting: 'Terima kasih Ustadz & Ustadzah tercinta atas ilmu dan kasih sayangnya!',
      animation: 'Buku Ajaib Terbuka, Bintang Penghargaan & Pensil Berterbangan',
      colorScheme: { primary: '#4338ca', accent: '#6366f1', bgBadge: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200' }
    },
    {
      id: 'NAT-03',
      matchType: 'EXACT_DATE',
      date: '2026-04-21',
      name: 'Hari Kartini & Kebangkitan Perempuan',
      priority: 'HARI_BESAR_NASIONAL' as EventPriorityLevel,
      costumeId: 'COSTUME-ADAT-NUSANTARA',
      costumeName: 'Kebaya & Busana Adat Nusantara',
      greeting: 'Habis Gelap Terbitlah Terang! Semangat Kartini cilik yang cerdas & santun.',
      animation: 'Bunga Melati & Selendang Tradisional Cantik',
      colorScheme: { primary: '#be185d', accent: '#ec4899', bgBadge: 'bg-pink-100 text-pink-900 dark:bg-pink-900/40 dark:text-pink-200' }
    },
    {
      id: 'NAT-04',
      matchType: 'EXACT_DATE',
      date: '2026-10-22',
      name: 'Hari Santri Nasional',
      priority: 'HARI_BESAR_NASIONAL' as EventPriorityLevel,
      costumeId: 'COSTUME-SANTRI-SARUNG',
      costumeName: 'Koko Santri, Peci Hitam & Sarung Songket',
      greeting: 'Jihad Santri Jayakan Negeri! Santri cerdas, mandiri, dan berakhlakul karimah.',
      animation: 'Cahaya Obor Ilmu, Kitab & Bintang Emas',
      colorScheme: { primary: '#15803d', accent: '#22c55e', bgBadge: 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200' }
    },

    // 3. HARI BESAR ISLAM (Prioritas 3)
    {
      id: 'ISL-01',
      matchType: 'DATE_RANGE',
      startDate: '2026-02-18',
      endDate: '2026-03-20',
      name: 'Bulan Suci Ramadan 1447 H',
      priority: 'HARI_BESAR_ISLAM' as EventPriorityLevel,
      costumeId: 'COSTUME-RAMADAN-IKHLAS',
      costumeName: 'Gamis Putih Bersih & Sorban Hijau Lembut',
      greeting: 'Marhaban ya Ramadan! Mari berpuasa dengan riang dan perbanyak sedekah.',
      animation: 'Bulan Sabit Emas Bercahaya, Lentera Fanous & Rasi Bintang',
      colorScheme: { primary: '#0f766e', accent: '#14b8a6', bgBadge: 'bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-200' }
    },
    {
      id: 'ISL-02',
      matchType: 'EXACT_DATE',
      date: '2026-03-21',
      name: 'Hari Raya Idul Fitri 1 Syawal 1447 H',
      priority: 'HARI_BESAR_ISLAM' as EventPriorityLevel,
      costumeId: 'COSTUME-IDUL-FITRI',
      costumeName: 'Busana Hari Raya Khas Nusantara',
      greeting: 'Taqabbalallahu minna wa minkum, Minal Aidin wal Faizin!',
      animation: 'Bedug Berirama, Ketupat Hijau & Kilauan Kebahagiaan',
      colorScheme: { primary: '#166534', accent: '#4ade80', bgBadge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200' }
    },

    // 4. KALENDER PENDIDIKAN (Prioritas 4)
    {
      id: 'EDU-01',
      matchType: 'DATE_RANGE',
      startDate: '2026-06-01',
      endDate: '2026-06-12',
      name: 'Pekan Penilaian Capaian & Asesmen Sentra Akhir Tahun',
      priority: 'KALENDER_PENDIDIKAN' as EventPriorityLevel,
      costumeId: 'COSTUME-SENTRA-PENELITI',
      costumeName: 'Rompi Peneliti Cilik Sentra Bahan Alam & Sains',
      greeting: 'Semangat belajar dan bereksplorasi! Tunjukkan karya kreatif terbaikmu.',
      animation: 'Kaca Pembesar, Balok Rancang Bangun & Gelembung Ceria',
      colorScheme: { primary: '#0369a1', accent: '#38bdf8', bgBadge: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200' }
    },
    {
      id: 'EDU-02',
      matchType: 'DATE_RANGE',
      startDate: '2026-06-26',
      endDate: '2026-07-12',
      name: 'Libur Akhir Semester & Libur Kenaikan Kelas',
      priority: 'KALENDER_PENDIDIKAN' as EventPriorityLevel,
      costumeId: 'COSTUME-LIBURAN-CERIA',
      costumeName: 'Kaos Petualang Santri & Topi Rimba',
      greeting: 'Selamat berlibur bersama keluarga tercinta! Jangan lupa sholat 5 waktu ya.',
      animation: 'Matahari Tersenyum, Burung Berkicau & Bunga Mekar',
      colorScheme: { primary: '#c2410c', accent: '#fb923c', bgBadge: 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200' }
    }
  ], []);

  // Compute resolved event for the selected date
  const resolvedState = useMemo<CalendarResolvedState>(() => {
    const d = new Date(selectedDate);
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayOfWeek = dayNames[d.getDay()];

    // Simple Hijri approximation for demonstration
    const hijriDate = '1 Safar 1448 H';

    // Prioritized Search:
    // 1. EVENT_SEKOLAH
    // 2. HARI_BESAR_NASIONAL
    // 3. HARI_BESAR_ISLAM
    // 4. KALENDER_PENDIDIKAN
    // 5. Default Harian (Jumat Berkah, Pramuka, Batik, dsb)

    const sortedRules = [...calendarRules].sort((a, b) => {
      const priorityOrder: Record<EventPriorityLevel, number> = {
        'EVENT_SEKOLAH': 1,
        'HARI_BESAR_NASIONAL': 2,
        'HARI_BESAR_ISLAM': 3,
        'KALENDER_PENDIDIKAN': 4,
        'TEMA_HARIAN': 5
      };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const rule of sortedRules) {
      if (rule.matchType === 'EXACT_DATE' && rule.date === selectedDate) {
        return {
          dateString: selectedDate,
          dayOfWeek,
          hijriDate,
          activeEventName: rule.name,
          priorityLevel: rule.priority,
          recommendedCostumeId: rule.costumeId,
          recommendedCostumeName: rule.costumeName,
          culturalGreeting: rule.greeting,
          animationAtmosphere: rule.animation,
          colorScheme: rule.colorScheme
        };
      }
      if (rule.matchType === 'DATE_RANGE' && rule.startDate && rule.endDate) {
        if (selectedDate >= rule.startDate && selectedDate <= rule.endDate) {
          return {
            dateString: selectedDate,
            dayOfWeek,
            hijriDate,
            activeEventName: rule.name,
            priorityLevel: rule.priority,
            recommendedCostumeId: rule.costumeId,
            recommendedCostumeName: rule.costumeName,
            culturalGreeting: rule.greeting,
            animationAtmosphere: rule.animation,
            colorScheme: rule.colorScheme
          };
        }
      }
    }

    // Default Fallback by Day of Week:
    if (dayOfWeek === 'Jumat') {
      return {
        dateString: selectedDate,
        dayOfWeek,
        hijriDate,
        activeEventName: 'Jumat Berkah & Pembiasaan Sholat Dhuha',
        priorityLevel: 'TEMA_HARIAN',
        recommendedCostumeId: 'COSTUME-BUSANA-MUSLIM-JUMAT',
        recommendedCostumeName: 'Busana Muslim Putih & Peci',
        culturalGreeting: 'Jumat Berkah! Mari bersholawat dan membaca Surah Al-Kahfi.',
        animation: 'Pendaran Cahaya Tenang & Butiran Doa',
        colorScheme: { primary: '#059669', accent: '#34d399', bgBadge: 'bg-emerald-100 text-emerald-800' }
      };
    }

    if (dayOfWeek === 'Rabu') {
      return {
        dateString: selectedDate,
        dayOfWeek,
        hijriDate,
        activeEventName: 'Hari Pramuka Siaga Sentra',
        priorityLevel: 'TEMA_HARIAN',
        recommendedCostumeId: 'COSTUME-PRAMUKA-SIAGA',
        recommendedCostumeName: 'Seragam Pramuka Siaga & Kacu Merah Putih',
        culturalGreeting: 'Salam Pramuka! Siaga berani, mandiri, dan berbakti kepada orang tua.',
        animation: 'Tunas Kelapa Ceria & Riang Gembira',
        colorScheme: { primary: '#92400e', accent: '#d97706', bgBadge: 'bg-amber-100 text-amber-800' }
      };
    }

    if (dayOfWeek === 'Kamis') {
      return {
        dateString: selectedDate,
        dayOfWeek,
        hijriDate,
        activeEventName: 'Kamis Batik Budaya Nusantara',
        priorityLevel: 'TEMA_HARIAN',
        recommendedCostumeId: 'COSTUME-BATIK-NUSANTARA',
        recommendedCostumeName: 'Kemeja Batik Asy-Syifa Cilik',
        culturalGreeting: 'Aku cinta budaya Indonesia! Belajar ragam corak batik nusantara.',
        animation: 'Motif Mega Mendung & Corak Batik Halus',
        colorScheme: { primary: '#7c2d12', accent: '#ea580c', bgBadge: 'bg-orange-100 text-orange-800' }
      };
    }

    // Standard School Day (Senin / Selasa / Sabtu)
    return {
      dateString: selectedDate,
      dayOfWeek,
      hijriDate,
      activeEventName: `Hari Pembelajaran Sentra Aktif (${dayOfWeek})`,
      priorityLevel: 'TEMA_HARIAN',
      recommendedCostumeId: 'COSTUME-TK-SENTRA',
      recommendedCostumeName: 'Seragam Utama Sentra Asy-Syifa',
      culturalGreeting: 'Bismillah, semangat belajar dan bermain di sentra hari ini!',
      animation: 'Pita Bintang & Ceria Pagi Sentra',
      colorScheme: { primary: '#4338ca', accent: '#6366f1', bgBadge: 'bg-indigo-100 text-indigo-800' }
    };
  }, [selectedDate, calendarRules]);

  return (
    <div id="living-calendar-engine-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <CalendarIcon className="w-48 h-48 text-amber-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R236 &bull; LIVING CALENDAR ENGINE
              </span>
              <span className="text-xs text-slate-400">Context-Aware Mascot Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-amber-400" />
              Asy Living Calendar Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Engine penentu busana dan ekspresi Maskot Asy secara otomatis berdasarkan hierarki prioritas: <strong>Event Sekolah &gt; Hari Besar Nasional &gt; Hari Besar Islam &gt; Kalender Pendidikan &gt; Tema Harian</strong>. Asy tidak pernah berpakaian secara acak.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <CalendarCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <label className="text-[10px] text-slate-400 font-mono block">Uji Tanggal Simulasi:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 text-white text-xs font-mono px-2 py-1 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Priority Hierarchy Indicator */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className={`p-2 rounded-lg border ${resolvedState.priorityLevel === 'EVENT_SEKOLAH' ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold' : 'bg-slate-800/40 text-slate-400 border-slate-700/50'}`}>
            1. Event Sekolah
          </div>
          <div className={`p-2 rounded-lg border ${resolvedState.priorityLevel === 'HARI_BESAR_NASIONAL' ? 'bg-red-500/20 text-red-300 border-red-500 font-bold' : 'bg-slate-800/40 text-slate-400 border-slate-700/50'}`}>
            2. Nasional ID
          </div>
          <div className={`p-2 rounded-lg border ${resolvedState.priorityLevel === 'HARI_BESAR_ISLAM' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold' : 'bg-slate-800/40 text-slate-400 border-slate-700/50'}`}>
            3. Kalender Islam
          </div>
          <div className={`p-2 rounded-lg border ${resolvedState.priorityLevel === 'KALENDER_PENDIDIKAN' ? 'bg-sky-500/20 text-sky-300 border-sky-500 font-bold' : 'bg-slate-800/40 text-slate-400 border-slate-700/50'}`}>
            4. Pendidikan
          </div>
          <div className={`p-2 rounded-lg border ${resolvedState.priorityLevel === 'TEMA_HARIAN' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500 font-bold' : 'bg-slate-800/40 text-slate-400 border-slate-700/50'}`}>
            5. Tema Harian
          </div>
        </div>
      </div>

      {/* Quick Jump Date Presets */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mr-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Uji Preset Kalender:
        </span>
        <button
          onClick={() => setSelectedDate('2026-08-17')}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-200 transition-all"
        >
          17 Ags (HUT RI)
        </button>
        <button
          onClick={() => setSelectedDate('2026-06-25')}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-200 transition-all"
        >
          25 Jun (Wisuda Santri)
        </button>
        <button
          onClick={() => setSelectedDate('2026-03-21')}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 transition-all"
        >
          21 Mar (Idul Fitri)
        </button>
        <button
          onClick={() => setSelectedDate('2026-11-25')}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 hover:bg-indigo-200 transition-all"
        >
          25 Nov (Hari Guru)
        </button>
        <button
          onClick={() => setSelectedDate('2026-04-21')}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-800 dark:text-pink-300 border border-pink-300 dark:border-pink-800 hover:bg-pink-200 transition-all"
        >
          21 Apr (Hari Kartini)
        </button>
        <button
          onClick={() => setSelectedDate('2026-10-22')}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800 hover:bg-green-200 transition-all"
        >
          22 Okt (Hari Santri)
        </button>
      </div>

      {/* Live Asy State Resolution Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mascot Preview Simulation Box */}
        <div className="lg:col-span-1 bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex justify-between items-center text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span>{resolvedState.dayOfWeek}, {resolvedState.dateString}</span>
            <span className="text-amber-400">{resolvedState.hijriDate}</span>
          </div>

          {/* Living Mascot Visual Representation */}
          <div className="my-6 relative flex flex-col items-center">
            {/* Mascot Avatar Simulation */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1.5 shadow-2xl flex items-center justify-center relative">
              <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-4xl">🐱</span>
                <span className="text-[10px] font-bold text-amber-400 font-mono tracking-widest mt-1">ASY MASCOT</span>
              </div>

              {/* Floating Badge for Costume */}
              <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-slate-900 border border-amber-400/80 text-[10px] font-bold text-white shadow-lg flex items-center gap-1 font-mono">
                <Shirt className="w-3 h-3 text-amber-400" />
                {resolvedState.recommendedCostumeId}
              </div>
            </div>

            <div className="mt-5 space-y-1">
              <h3 className="text-base font-bold text-white">
                {resolvedState.recommendedCostumeName}
              </h3>
              <p className="text-xs text-amber-400 font-mono">
                Atmosfer: {resolvedState.animationAtmosphere}
              </p>
            </div>
          </div>

          {/* Cultural Greeting Bubble */}
          <div className="w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 text-left relative">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              Sapaan Budaya Asy:
            </div>
            &ldquo;{resolvedState.culturalGreeting}&rdquo;
          </div>
        </div>

        {/* Right: Detailed Context Matrix & Rules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 block">Konteks Kalender Terpilih:</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {resolvedState.activeEventName}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${resolvedState.colorScheme.bgBadge}`}>
                Tingkat: {resolvedState.priorityLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-mono">Kostum Terpilih (Zero Random):</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-amber-500" />
                  {resolvedState.recommendedCostumeName}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Ditentukan 100% deterministik berdasarkan aturan kalender aktif.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-mono">Animasi Kultural Aktif:</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  {resolvedState.animationAtmosphere}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Efek GPU-Friendly dengan dukungan Battery Saver otomatis.
                </span>
              </div>
            </div>

            {/* Rules Matrix Table */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 font-mono">
                Aturan &amp; Event Terdaftar dalam Living Calendar:
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {calendarRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      rule.name === resolvedState.activeEventName
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                        : 'bg-slate-50 dark:bg-slate-700/20 border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                        {rule.priority}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{rule.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 shrink-0">
                      {rule.date || `${rule.startDate} s/d ${rule.endDate}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
