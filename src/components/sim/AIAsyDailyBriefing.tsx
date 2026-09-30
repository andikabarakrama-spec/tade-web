import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

export const AIAsyDailyBriefing: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'GURU' | 'KEPALA_SEKOLAH' | 'WALI_MURID'>('GURU');

  const briefingData = {
    date: 'Sabtu, 15 Agustus 2026',
    hijriDate: '2 Safar 1448 H',
    weather: 'Cerah Berawan (29°C) • Kualitas Udara Bersih',
    GURU: {
      greeting: 'Assalamu’alaikum Warahmatullahi Wabarakatuh, Ustadz & Ustadzah.',
      overview: 'Hari ini adalah hari pelaksanaan Sentra Eksplorasi Alam dan evaluasi hafalan pekanan. Seluruh sentra siap dengan logistik bahan ajar yang lengkap.',
      priorities: [
        'Pastikan media air dan pasir di Sentra Bahan Alam steril sebelum jam 09:00 WIB.',
        'Input capaian murojaah Juz 30 santri ke Buku Penghubung Digital sebelum jam kepulangan (13:00 WIB).',
        'Ikuti evaluasi singkat kurikulum merdeka bersama Kepala Sekolah pukul 13:30 WIB.'
      ],
      reminders: [
        'Ada 2 santri kelas TK A2 dengan catatan alergi kacang (Muhammad & Sarah).',
        'Persiapan perlengkapan gladi bersih Manasik Haji dijadwalkan hari Senin.'
      ]
    },
    KEPALA_SEKOLAH: {
      greeting: 'Assalamu’alaikum Warahmatullahi Wabarakatuh, Ustadz Kepala Sekolah.',
      overview: 'Ekosistem sekolah berjalan stabil dengan tingkat presensi santri 97.2% dan seluruh 18 dewan guru hadir tepat waktu.',
      priorities: [
        'Tinjau permohonan persetujuan izin kunjungan studi banding dari Yayasan Bina Insan pukul 10:00 WIB.',
        'Pimpin rapat evaluasi capaian kurikulum sentra pekan ke-3 di ruang guru pukul 13:30 WIB.',
        'Verifikasi ringkasan penerimaan SPP harian bersama tim Keuangan.'
      ],
      reminders: [
        'Laporan bulanan untuk Pengawas Dinas Pendidikan telah siap di Intelligent Resource Center.',
        'Semua server dan sensor presensi offline-first beroperasi 100% tanpa error.'
      ]
    },
    WALI_MURID: {
      greeting: 'Assalamu’alaikum Warahmatullahi Wabarakatuh, Ayah dan Bunda.',
      overview: 'Alhamdulillah, ananda sedang menikmati pembelajaran sentra aktif hari ini dengan suasana kelas yang ceria dan kondusif.',
      priorities: [
        'Mohon membawa botol minum ekstra karena ada kegiatan motorik kasar di halaman luar.',
        'Penjemputan santri dimulai tepat pukul 13:00 WIB di gerbang penjemputan utama.',
        'Konfirmasi kehadiran agenda Kajian Parenting & Manasik Haji pekan depan via menu komunikasi.'
      ],
      reminders: [
        'Menu snack sehat hari ini: Puding buah segar & susu kurma alami.',
        'Foto dan video dokumentasi ananda hari ini dapat dilihat di linimasa Smart Parent Timeline.'
      ]
    }
  };

  const currentBriefing = briefingData[selectedRole];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl border border-violet-100">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">AI Asy Daily Briefing</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Air-Gapped Local Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Asisten ringkasan harian berbasis bahasa alami: prioritas tugas, pengingat operasional, dan arahan kegiatan harian tanpa kebocoran data.
            </p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['GURU', 'KEPALA_SEKOLAH', 'WALI_MURID'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === r
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'GURU' ? 'Guru' : r === 'KEPALA_SEKOLAH' ? 'Kepala Sekolah' : 'Wali Murid'}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Greeting Card */}
      <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-violet-200">
          <div className="flex items-center gap-2 font-mono">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span>{briefingData.date} • {briefingData.hijriDate}</span>
          </div>
          <span className="bg-violet-800/60 px-3 py-1 rounded-full font-medium border border-violet-700">
            {briefingData.weather}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-black text-amber-300">
            {currentBriefing.greeting}
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed max-w-4xl">
            {currentBriefing.overview}
          </p>
        </div>
      </div>

      {/* Grid: Priorities & Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priorities */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Fokus & Prioritas Utama Hari Ini
          </h2>

          <div className="space-y-3">
            {currentBriefing.priorities.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {idx + 1}
                </span>
                <span className="text-slate-700 leading-relaxed font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders & Notes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Catatan Khusus & Pengingat Penting
          </h2>

          <div className="space-y-3">
            {currentBriefing.reminders.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/60 flex items-start gap-3 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-amber-900 leading-relaxed font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            <span>AI Asy Engine berjalan sepenuhnya lokal pada cache peramban (Zero Cloud Leakage).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
