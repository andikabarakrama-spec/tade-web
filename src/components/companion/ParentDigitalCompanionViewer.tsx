import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CreditCard,
  CheckCircle2,
  Bell,
  Sparkles,
  BookOpen,
  Heart,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { companionMemory } from '../../core/companion/companionMemory';
import { conversationContextEngine } from '../../core/companion/conversationContextEngine';
import { smartReminderEngine } from '../../core/companion/smartReminderEngine';

export const ParentDigitalCompanionViewer: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState('S-01 (Fatimah Az-Zahra - TK A)');
  const [queryText, setQueryText] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(
    'Assalamu’alaikum Ayah/Bunda! Perkembangan ananda Fatimah pekan ini sangat membanggakan di Sentra Bahan Alam dan Hafalan Surat Al-Insyiqaq.'
  );

  const reminders = smartReminderEngine.getRemindersForRole('PARENT');

  const handleAskAsy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    const session = conversationContextEngine.createOrGetSession('PARENT', 'parent-01', 'Perkembangan Santri');
    conversationContextEngine.appendQuery(session.sessionId, queryText);

    if (queryText.toLowerCase().includes('bayar') || queryText.toLowerCase().includes('spp')) {
      setAiResponse(
        'Berdasarkan data keuangan SSoT, SPP bulan Agustus 2026 sebesar Rp 450.000 sudah terbit. Batas jatuh tempo tanggal 20 Agustus. Ayah/Bunda dapat melakukan transfer instan via Virtual Account Syariah.'
      );
    } else if (queryText.toLowerCase().includes('hafalan') || queryText.toLowerCase().includes('tahfidz')) {
      setAiResponse(
        'Alhamdulillah, ananda Fatimah telah menuntaskan 8 surat pada Juz 30 dengan predikat Mumtaz (Lancar). Saran pendamping: sering diperdengarkan murattal Surat Al-Buruj saat istirahat malam.'
      );
    } else if (queryText.toLowerCase().includes('absen') || queryText.toLowerCase().includes('kehadiran')) {
      setAiResponse(
        'Tingkat kehadiran ananda bulan ini adalah 100% (14 hari hadir tepat waktu). Terakhir absen masuk hari ini pukul 07:15 WIB diantar Ayah.'
      );
    } else {
      setAiResponse(
        `Jazakumullah Khairan atas pertanyaannya: "${queryText}". Asy AI Assistant mencatat ananda aktif mengikuti seluruh kegiatan sentra hari ini dengan riang dan mandiri.`
      );
    }
    setQueryText('');
  };

  return (
    <div className="space-y-6" id="parent-digital-companion-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R751 Sovereign Read-Only Companion
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                RBAC: ROLE_PARENT
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-emerald-400" />
              Parent Digital Companion
            </h1>
            <p className="text-sm text-emerald-200/80 mt-1 max-w-2xl">
              Portal pendamping wali murid terintegrasi: pantau perkembangan adab, tahfidz, agenda harian, dan pembayaran infaq secara transparan dan aman.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/50 backdrop-blur-sm">
            <div className="text-right">
              <div className="text-xs text-emerald-300 font-medium">Santri Terpilih:</div>
              <div className="text-sm font-bold text-white">{selectedStudent}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Core Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Perkembangan Hafalan */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Tahfidz & Doa
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Juz 30
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">8 Surat</div>
          <div className="text-xs text-slate-400 mt-1">Target: Surat Al-Infitar s.d An-Nas</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Predikat Terakhir:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Mumtaz (95)
            </span>
          </div>
        </div>

        {/* 2. Kehadiran & Absensi */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Presensi Real-Time
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              Hadir Hari Ini
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">100%</div>
          <div className="text-xs text-slate-400 mt-1">14 dari 14 Hari Efektif Belajar</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Waktu Masuk:</span>
            <span className="font-semibold text-blue-300">07:15 WIB (Tepat Waktu)</span>
          </div>
        </div>

        {/* 3. Status Infaq / SPP */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <CreditCard className="w-4 h-4" /> Infaq & SPP
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              Agustus 2026
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">Rp 450.000</div>
          <div className="text-xs text-slate-400 mt-1">Tagihan SPP & Makan Sehat</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Status:</span>
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Menunggu Pembayaran
            </span>
          </div>
        </div>

        {/* 4. Karakter & Adab */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Heart className="w-4 h-4" /> Adab & Kemandirian
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              Sangat Baik
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">BSB</div>
          <div className="text-xs text-slate-400 mt-1">Berkembang Sangat Baik (Sentra Ibadah)</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Catatan Guru:</span>
            <span className="font-semibold text-purple-300">Mandiri merapikan mainan</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: AI Advisory Companion + Agenda & Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Asy Advisory Chat for Parent (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Asy AI Parent Assistant</h3>
                  <p className="text-xs text-slate-400">Advisory non-mutating assistant • Berbasis data SSoT</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Advisory Mode Only
              </span>
            </div>

            {/* AI Greeting / Response Bubble */}
            {aiResponse && (
              <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl p-4 mb-4 text-slate-200 text-sm leading-relaxed flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  Asy
                </div>
                <div className="flex-1">{aiResponse}</div>
              </div>
            )}

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                'Bagaimana hafalan anak saya minggu ini?',
                'Cek rincian tagihan SPP & infaq',
                'Agenda outing class pekan depan',
                'Status kehadiran bulan ini'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryText(chip);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleAskAsy} className="flex gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              value={queryText}
              onChange={e => setQueryText(e.target.value)}
              placeholder="Ketik pertanyaan untuk Asy AI Parent Companion..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <Sparkles className="w-4 h-4" /> Tanya Asy
            </button>
          </form>
        </div>

        {/* Right: Agenda & Pengumuman Sekolah (1 col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-teal-400" />
              Agenda & Kegiatan
            </h3>
            <div className="space-y-3">
              {[
                { date: '21 Agu 2026', event: 'Outing Class Edukatif Taman Satwa', badge: 'Akademik' },
                { date: '25 Agu 2026', event: 'Pemeriksaan Kesehatan Gigi Berkala', badge: 'Kesehatan' },
                { date: '28 Agu 2026', event: 'Pentas Seni Santri & Market Day', badge: 'Kreativitas' }
              ].map((ag, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start gap-3">
                  <div className="text-center px-2 py-1 bg-slate-800 rounded-lg text-slate-300 font-mono text-xs font-bold leading-tight">
                    {ag.date.split(' ')[0]}
                    <br />
                    <span className="text-[10px] font-normal text-slate-400">{ag.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-slate-200">{ag.event}</div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 mt-1">
                      {ag.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-amber-400" />
              Pengingat Penting ({reminders.length})
            </h3>
            <div className="space-y-2">
              {reminders.map((rem) => (
                <div
                  key={rem.reminderId}
                  className="p-3 bg-slate-950/60 border border-amber-500/20 rounded-xl text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-300">{rem.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">
                      {rem.priority}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{rem.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
