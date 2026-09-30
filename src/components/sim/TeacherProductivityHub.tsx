import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckSquare,
  FileText,
  TrendingUp,
  Clock,
  Sparkles,
  Plus,
  CheckCircle2,
  Save,
  BookOpen,
  Award
} from 'lucide-react';

export const TeacherProductivityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CHECKLIST' | 'JADWAL' | 'LAPORAN' | 'PROGRESS'>('CHECKLIST');

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Input Presensi Pagi Sentra Kreativitas Kelompok B2', done: true },
    { id: 2, text: 'Verifikasi Setoran Hafalan Surah An-Naba Ayat 1-15', done: true },
    { id: 3, text: 'Unggah Foto Dokumentasi Eksplorasi Sains Hari Ini', done: false },
    { id: 4, text: 'Kirim Catatan Perkembangan Santri ke Wali Murid (2 Santri)', done: false },
    { id: 5, text: 'Siapkan Media Pembelajaran Modul Sensorik Besok Pagi', done: false }
  ]);

  const [dailyReport, setDailyReport] = useState({
    sentra: 'Sentra Bahan Alam & Sains',
    topik: 'Mengenal Sifat-Sifat Air & Pelangi Warna',
    santriHadir: '22 / 24 Santri',
    catatanUmum: 'Anak-anak sangat antusias saat mencampur warna. Evaluasi motorik halus mayoritas santri melampaui target mingguan.',
    kendala: 'Tidak ada kendala berarti. Bahan ajar mencukupi.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleCheck = (id: number) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleSaveReport = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Teacher Productivity Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Ustadzah Rahma, S.Pd (Wali Kelas B2)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ruang kerja harian guru: daftar tugas otomatis, manajemen jadwal sentra, penyusunan jurnal harian, dan pantauan kurikulum.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'CHECKLIST', label: 'Checklist Harian', icon: CheckSquare },
            { id: 'JADWAL', label: 'Jadwal Mengajar', icon: Calendar },
            { id: 'LAPORAN', label: 'Laporan Jurnal', icon: FileText },
            { id: 'PROGRESS', label: 'Progress Belajar', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab: CHECKLIST */}
      {activeTab === 'CHECKLIST' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Checklist Rutinitas Harian</h2>
                <p className="text-xs text-slate-400">
                  {checklist.filter(c => c.done).length} dari {checklist.length} tugas selesai hari ini
                </p>
              </div>
              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(checklist.filter(c => c.done).length / checklist.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    item.done
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                      item.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-medium ${item.done ? 'line-through' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Saran AI Asy Assistant
            </h2>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-slate-600 leading-relaxed space-y-2">
              <p className="font-semibold text-emerald-800">Tips Pembelajaran Hari Ini:</p>
              <p>
                Santri kelompok B2 menunjukkan minat tinggi pada observasi tanaman. Anda dapat mengintegrasikan hafalan nama-nama ciptaan Allah dalam kegiatan sentra bahan alam siang nanti.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: JADWAL */}
      {activeTab === 'JADWAL' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Jadwal Mengajar Pekan Ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { hari: 'Senin', jam: '08:00 - 10:30', kelas: 'TK-B2', materi: 'Sentra Ibadah & Doa Harian', ruang: 'Ruang Shalahuddin' },
              { hari: 'Selasa', jam: '08:00 - 10:30', kelas: 'TK-B2', materi: 'Sentra Bahan Alam & Sains', ruang: 'Lab Mini Sains' },
              { hari: 'Rabu', jam: '08:00 - 10:30', kelas: 'TK-B2', materi: 'Sentra Balok & Konstruksi', ruang: 'Ruang Al-Khawarizmi' },
              { hari: 'Kamis', jam: '08:00 - 10:30', kelas: 'TK-B2', materi: 'Sentra Seni & Kreativitas', ruang: 'Studio Seni Cilik' }
            ].map((j, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700">{j.hari}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{j.jam}</span>
                </div>
                <div className="font-bold text-slate-800">{j.materi}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {j.kelas} • {j.ruang}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: LAPORAN */}
      {activeTab === 'LAPORAN' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Form Jurnal Harian Pengajaran</h2>
              <p className="text-xs text-slate-400">Tersinkronisasi otomatis ke buku penghubung digital wali murid</p>
            </div>
            {savedSuccess && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tersimpan & Terbit
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sentra / Area:</label>
              <input
                type="text"
                value={dailyReport.sentra}
                onChange={e => setDailyReport({ ...dailyReport, sentra: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Topik Pembelajaran:</label>
              <input
                type="text"
                value={dailyReport.topik}
                onChange={e => setDailyReport({ ...dailyReport, topik: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Catatan Ringkasan Aktivitas:</label>
              <textarea
                rows={3}
                value={dailyReport.catatanUmum}
                onChange={e => setDailyReport({ ...dailyReport, catatanUmum: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveReport}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Simpan & Terbitkan Jurnal
            </button>
          </div>
        </div>
      )}

      {/* Tab: PROGRESS */}
      {activeTab === 'PROGRESS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Progress Capaian Kurikulum Kelompok B2</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { domain: 'Nilai Agama & Moral', capaian: 92, status: 'Sesuai Target' },
              { domain: 'Fisik Motorik & Sensorik', capaian: 95, status: 'Melampaui Target' },
              { domain: 'Kognitif & Bahasa', capaian: 88, status: 'Sesuai Target' }
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{p.domain}</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-600">{p.capaian}%</div>
                <div className="text-[11px] text-slate-500">{p.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
