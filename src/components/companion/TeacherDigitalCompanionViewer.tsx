import React, { useState } from 'react';
import {
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  Clock,
  Sparkles,
  BookMarked,
  CheckCircle,
  AlertTriangle,
  FileText,
  Smile,
  ShieldCheck
} from 'lucide-react';
import { smartReminderEngine } from '../../core/companion/smartReminderEngine';
import { conversationContextEngine } from '../../core/companion/conversationContextEngine';

export const TeacherDigitalCompanionViewer: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('TK A - Sentra Iman & Taqwa');
  const [teacherPrompt, setTeacherPrompt] = useState('');
  const [aiGuidance, setAiGuidance] = useState<string | null>(
    'Assalamu’alaikum Ustadzah! Hari ini fokus pembelajaran sentra adalah adab berwudhu dan motorik kasar melompat rintangan busa. RPP harian telah siap.'
  );

  const teacherReminders = smartReminderEngine.getRemindersForRole('TEACHER');

  const handleAskTeacherAsy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherPrompt.trim()) return;

    const session = conversationContextEngine.createOrGetSession('TEACHER', 'teacher-01', 'Perencanaan RPP');
    conversationContextEngine.appendQuery(session.sessionId, teacherPrompt);

    if (teacherPrompt.toLowerCase().includes('rpp') || teacherPrompt.toLowerCase().includes('ide')) {
      setAiGuidance(
        'Rekomendasi RPP Sentra Pekan Depan (Tema: Ciptaan Allah - Alam Semesta): 1) Sentra Balok: Membangun miniatur tata surya dengan balok kayu. 2) Sentra Bahan Alam: Eksplorasi tekstur batu, pasir, dan air. 3) Sentra Seni: Melukis bintang dan bulan dengan teknik usap abur.'
      );
    } else if (teacherPrompt.toLowerCase().includes('observasi') || teacherPrompt.toLowerCase().includes('nilai')) {
      setAiGuidance(
        'Format observasi 6 aspek perkembangan telah disesuaikan dengan Kurikulum Merdeka PAUD & Nilai Agama Moral Asy Syifa. Data dapat diisi langsung secara offline-safe.'
      );
    } else {
      setAiGuidance(
        `Pertanyaan Ustadzah: "${teacherPrompt}". Asy AI merekomendasikan pendekatan pembelajaran kontekstual berbasis sentra dengan penguatan adab Islami.`
      );
    }
    setTeacherPrompt('');
  };

  return (
    <div className="space-y-6" id="teacher-digital-companion-view">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R752 Teacher Digital Companion
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                RBAC: ROLE_TEACHER
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-blue-400" />
              Teacher Digital Companion
            </h1>
            <p className="text-sm text-blue-200/80 mt-1 max-w-2xl">
              Asisten pendamping harian pendidik: ringkasan jadwal mengajar sentra, status kelengkapan administrasi ajar, dan panduan pedagogis berbasis kurikulum terpadu.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-blue-950/60 p-3 rounded-xl border border-blue-800/50 backdrop-blur-sm">
            <div className="text-right">
              <div className="text-xs text-blue-300 font-medium">Kelas Binaan:</div>
              <div className="text-sm font-bold text-white">{selectedClass}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase">
              <Clock className="w-4 h-4" /> Jadwal Sentra Hari Ini
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              07:30 - 11:30
            </span>
          </div>
          <div className="text-xl font-bold text-slate-100">Sentra Iman & Taqwa</div>
          <div className="text-xs text-slate-400 mt-1">16 Santri • Pendamping: Ustdz. Sarah</div>
        </div>

        {/* Tile 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <ClipboardList className="w-4 h-4" /> Observasi Pending
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              3 Anak
            </span>
          </div>
          <div className="text-xl font-bold text-slate-100">81% Selesai</div>
          <div className="text-xs text-slate-400 mt-1">13 dari 16 santri telah dinilai</div>
        </div>

        {/* Tile 3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <FileText className="w-4 h-4" /> Status RPP Pekanan
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Disetujui
            </span>
          </div>
          <div className="text-xl font-bold text-emerald-400">Pekan ke-3 Valid</div>
          <div className="text-xs text-slate-400 mt-1">Tema: Air, Api, dan Udara</div>
        </div>

        {/* Tile 4 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase">
              <Smile className="w-4 h-4" /> Suasana Kelas
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              Sangat Ceria
            </span>
          </div>
          <div className="text-xl font-bold text-purple-300">Antusiasme 96%</div>
          <div className="text-xs text-slate-400 mt-1">Tingkat fokus sentra optimal</div>
        </div>
      </div>

      {/* Main Layout: AI Lesson Copilot + Administration Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Pedagogical Advisory Assistant */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Asy AI Teacher Copilot</h3>
                  <p className="text-xs text-slate-400">Konsultasi RPP, metode sentra PAUD, dan diferensiasi ajar</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Non-Destructive Advisory
              </span>
            </div>

            {/* AI Guidance Box */}
            {aiGuidance && (
              <div className="bg-slate-950/70 border border-blue-500/20 rounded-xl p-4 mb-4 text-slate-200 text-sm leading-relaxed flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-blue-400 text-xs font-bold">
                  Asy
                </div>
                <div className="flex-1">{aiGuidance}</div>
              </div>
            )}

            {/* Suggested Teacher Prompts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                'Berikan 3 ide kegiatan sentra bahan alam tema tanaman obat',
                'Bagaimana stimulasi motorik santri yang belum terbiasa memegang gunting?',
                'Susun kalimat asesmen narasi capaian pembelajaran kemandirian',
                'Ide ice breaking bernuansa Islami untuk pembukaan sentra'
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setTeacherPrompt(p)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAskTeacherAsy} className="flex gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              value={teacherPrompt}
              onChange={e => setTeacherPrompt(e.target.value)}
              placeholder="Tanyakan ide ajar, asesmen santri, atau kurikulum..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/30"
            >
              <Sparkles className="w-4 h-4" /> Konsultasi
            </button>
          </form>
        </div>

        {/* Right 1 Col: Pending Admin & Reminders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2 mb-3">
              <CalendarCheck className="w-5 h-5 text-indigo-400" />
              Tugas & Administrasi Hari Ini
            </h3>
            <div className="space-y-2.5">
              {[
                { task: 'Input presensi masuk santri sentra', status: 'COMPLETED', time: '07:45 WIB' },
                { task: 'Pengamatan harian 3 santri pending', status: 'PENDING', time: 'Sebelum 13:00 WIB' },
                { task: 'Upload foto kegiatan ajar untuk portal ortu', status: 'PENDING', time: 'Sebelum 14:00 WIB' },
                { task: 'Briefing evaluasi ajar mingguan', status: 'UPCOMING', time: '14:30 WIB' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-slate-200">{item.task}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.time}</div>
                  </div>
                  {item.status === 'COMPLETED' ? (
                    <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="text-amber-400 text-xs flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2 mb-3">
              <BookMarked className="w-5 h-5 text-blue-400" />
              Pengingat Pendidik ({teacherReminders.length})
            </h3>
            <div className="space-y-2">
              {teacherReminders.map(r => (
                <div key={r.reminderId} className="p-3 bg-slate-950/60 border border-blue-500/20 rounded-xl text-xs">
                  <div className="font-semibold text-blue-300">{r.title}</div>
                  <div className="text-slate-400 text-[11px] mt-1 leading-relaxed">{r.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
