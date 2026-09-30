import React, { useState } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  Bot,
  CheckCircle2,
  Calendar,
  Bell,
  Send,
  UserCheck,
  BookOpen,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DailyOperationCompanion: React.FC = () => {
  const [activeTimeOfDay, setActiveTimeOfDay] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [quickNotes, setQuickNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([
    'Wali murid Ananda Fathir izin terlambat karena ada imunisasi puskesmas.',
    'Pembelian ATK mewarnai untuk Sentra Seni sudah disetujui Kepala Sekolah.'
  ]);

  const toggleAction = (id: string) => {
    setCompletedActions(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNotes.trim()) return;
    setSavedNotes(prev => [quickNotes.trim(), ...prev]);
    setQuickNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border border-teal-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Bot className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  AI ASY COMPANION 2.0
                </span>
                <span className="text-xs text-slate-400">Autonomous Daily Assistant</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Daily School Operational Companion
              </h1>
              <p className="text-sm text-teal-100/80 mt-0.5">
                Mendampingi Ketua Yayasan, Kepala Sekolah, Admin & Guru sepanjang hari mulai dari salam pagi hingga rekap malam.
              </p>
            </div>
          </div>

          {/* Time of Day Switcher */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 gap-1 text-xs">
            <button
              onClick={() => setActiveTimeOfDay('MORNING')}
              className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
                activeTimeOfDay === 'MORNING'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4" />
              Pagi (07:00 - 11:30)
            </button>
            <button
              onClick={() => setActiveTimeOfDay('AFTERNOON')}
              className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
                activeTimeOfDay === 'AFTERNOON'
                  ? 'bg-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sunset className="w-4 h-4" />
              Siang (11:30 - 15:30)
            </button>
            <button
              onClick={() => setActiveTimeOfDay('EVENING')}
              className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
                activeTimeOfDay === 'EVENING'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" />
              Malam (18:00 - 21:00)
            </button>
          </div>
        </div>
      </div>

      {/* Main Routine Grid based on Time */}
      {activeTimeOfDay === 'MORNING' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Morning Briefing & Tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Rutinitas Pagi: Sambut Siswa & Kesiapan Kelas
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Assalamu'alaikum Wr. Wb. Selamat pagi Bapak/Ibu Pendidik. Hari ini cuaca cerah, pembelajaran sentra siap dimulai.
              </p>

              <div className="space-y-2.5">
                {[
                  { id: 'm_act1', title: '1. Verifikasi Presensi & Suhu Anak di Gerbang Utama', desc: 'Scan QR penjemputan atau centang presensi manual di tablet guru piket.' },
                  { id: 'm_act2', title: '2. Pembacaan Asmaul Husna & Tahfidz Juz 30 (Surah An-Naba)', desc: 'Sentra Imtaq kelas A & B dipandu Ustadzah Fatimah.' },
                  { id: 'm_act3', title: '3. Konfirmasi Menu Catering & Alergi Makanan Siang', desc: 'Menu hari ini: Sop Sayur Daging Sapi + Buah Pepaya Manis.' },
                  { id: 'm_act4', title: '4. Cek Proposal & Dokumen Approval Ketua Yayasan', desc: 'Ada 2 dokumen pengajuan sarana playground baru menunggu tanda tangan.' }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleAction(item.id)}
                    className={`p-3 rounded-lg border flex items-start justify-between cursor-pointer transition ${
                      completedActions.includes(item.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border ${
                        completedActions.includes(item.id)
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-400'
                      }`}>
                        {completedActions.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${
                          completedActions.includes(item.id) ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
                        }`}>
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                      {completedActions.includes(item.id) ? 'SELESAI' : 'KERJAKAN'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teaching Schedule highlight */}
            <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <h4 className="font-bold text-sm">Jadwal Sentra Hari Ini (Kelas TK-A & TK-B)</h4>
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono">08:30 - 10:30 WIB</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div className="font-bold text-amber-300">Kelas TK-A: Sentra Balok & Kreativitas</div>
                  <div className="text-slate-300 mt-1">Tema: Arsitektur Masjid & Menara Tinggi</div>
                  <div className="text-slate-400 text-[11px] mt-1">Guru: Ustadzah Nurul & Ustadzah Aisyah</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div className="font-bold text-teal-300">Kelas TK-B: Sentra Sains & Alam Sekitar</div>
                  <div className="text-slate-300 mt-1">Tema: Eksperimen Pencampuran Warna Air & Daun</div>
                  <div className="text-slate-400 text-[11px] mt-1">Guru: Ustadz Rahmat & Ustadzah Dewi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Side Panel Notes & Quick AI Action */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Catatan Cepat Guru Piket
                </h4>
                <span className="text-xs text-slate-500">{savedNotes.length} Catatan</span>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-2 mb-3">
                <textarea
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  placeholder="Ketik catatan kejadian siswa / titipan obat..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Simpan ke Jurnal Harian
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedNotes.map((note, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTimeOfDay === 'AFTERNOON' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sunset className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Rutinitas Siang: Penjemputan, Jurnal & Buku Penghubung
                </h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { id: 'a_act1', title: '1. Verifikasi QR Penjemputan Siswa di Pintu Keluar', desc: 'Pastikan penjemput terdaftar resmi di sistem portal wali murid.' },
                  { id: 'a_act2', title: '2. Pengisian Jurnal Anekdot & Capaian Harian', desc: '14 Siswa Kelas A dan 16 Siswa Kelas B telah tercatat progresnya.' },
                  { id: 'a_act3', title: '3. Kirimkan Notifikasi Buku Penghubung Digital', desc: 'Foto kegiatan sentra hari ini siap di-broadcast ke grup wali murid.' },
                  { id: 'a_act4', title: '4. Rekonsiliasi Kas Harian & SPP Masuk', desc: 'Total penerimaan SPP hari ini: Rp 3.200.000 (Semua Idempotent).' }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleAction(item.id)}
                    className={`p-3 rounded-lg border flex items-start justify-between cursor-pointer transition ${
                      completedActions.includes(item.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border ${
                        completedActions.includes(item.id)
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-400'
                      }`}>
                        {completedActions.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${
                          completedActions.includes(item.id) ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
                        }`}>
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                      {completedActions.includes(item.id) ? 'SELESAI' : 'PROSES'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Status Penjemputan Hari Ini
            </h4>
            <div className="p-3 bg-slate-800 rounded-lg text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Sudah Dijemput:</span>
                <span className="font-bold text-emerald-400">28 Siswa</span>
              </div>
              <div className="flex justify-between">
                <span>Di Ruang Tunggu / Ekskul:</span>
                <span className="font-bold text-amber-400">2 Siswa (Kelas Tahfidz)</span>
              </div>
              <div className="flex justify-between">
                <span>Antar Jemput Mobil:</span>
                <span className="font-bold text-teal-400">Armada 1 (Dalam Perjalanan)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTimeOfDay === 'EVENING' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Rutinitas Malam: Rekap Harian & Persiapan Esok Hari
                </h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { id: 'e_act1', title: '1. AI Asy Automated Nightly Summary & Executive Recap', desc: 'Laporan kesehatan sekolah, kehadiran 98%, kas balance tersusun rapi.' },
                  { id: 'e_act2', title: '2. Sinkronisasi Backup & Cloud Storage Integrity Audit', desc: 'Semua berkas harian terindeks di Smart Governance Vault.' },
                  { id: 'e_act3', title: '3. Preview Jadwal & RPP Pembelajaran Esok Hari', desc: 'Tema besok: Mengenal Huruf Hijaiyah Berharakat di Sentra Bahasa.' }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleAction(item.id)}
                    className={`p-3 rounded-lg border flex items-start justify-between cursor-pointer transition ${
                      completedActions.includes(item.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border ${
                        completedActions.includes(item.id)
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-400'
                      }`}>
                        {completedActions.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${
                          completedActions.includes(item.id) ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
                        }`}>
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                      {completedActions.includes(item.id) ? 'SELESAI' : 'REKAP'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-indigo-400 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Pesan Selamat Istirahat AI Asy
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Alhamdulillah seluruh kegiatan sekolah hari ini berjalan dengan lancar dan berkah. Sistem Guardian akan terus menjaga keamanan database 24 jam. Selamat beristirahat!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
