import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  BookOpen,
  Layers,
  CheckSquare,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface RPPPlan {
  id: string;
  theme: string;
  subTheme: string;
  week: number;
  sentra: string;
  goals: string[];
  activities: string[];
  materials: string[];
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE';
}

export const TeacherPlanningStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rpp' | 'sentra' | 'checklist' | 'calendar'>('rpp');

  const [plans, setPlans] = useState<RPPPlan[]>([
    {
      id: 'RPP-01',
      theme: 'Aku Hamba Allah',
      subTheme: 'Tubuhku Ciptaan Allah yang Sempurna',
      week: 4,
      sentra: 'Sentra Bahan Alam & Sains',
      goals: [
        'Mengenal anggota tubuh sebagai anugerah Allah SWT (Nilai Agama)',
        'Melatih motorik halus dengan mencap telapak tangan memakai pewarna kunyit (Fisik Motorik & Seni)',
        'Membilang jumlah jari tangan dan kaki (Kognitif)'
      ],
      activities: [
        'Pijakan Awal: Berdoa dan membaca Surat Al-Alaq 1-5',
        'Pijakan Main: Eksperimen mencap telapak tangan dan meraba aneka tekstur (halus, kasar)',
        'Pijakan Akhir: Recalling dan membereskan alat main'
      ],
      materials: ['Kunyit alami', 'Kertas gambar A3', 'Biji-bijian lokal', 'Air dan lap basah'],
      status: 'ACTIVE'
    },
    {
      id: 'RPP-02',
      theme: 'Lingkunganku Bersih',
      subTheme: 'Masjidku Pusat Ibadah dan Kebersihan',
      week: 5,
      sentra: 'Sentra Balok & Konstruksi',
      goals: [
        'Mengenal fungsi masjid dan adab masuk masjid',
        'Membangun miniatur kubah dan menara masjid dari balok kayu',
        'Bekerjasama dalam kelompok merancang halaman masjid'
      ],
      activities: [
        'Pijakan Awal: Diskusi tentang bentuk arsitektur masjid',
        'Pijakan Main: Membangun maket masjid dengan 40 balok geometri',
        'Pijakan Akhir: Menghitung jumlah balok yang digunakan'
      ],
      materials: ['Balok unit kayu jati belanda', 'Aksesoris miniatur pohon', 'Alas bermain karpet'],
      status: 'APPROVED'
    }
  ]);

  const [checklists, setChecklists] = useState([
    { id: 'chk-1', task: 'Menyiapkan modul ajar RPP pekan ke-4', done: true, time: '06:45 WIB' },
    { id: 'chk-2', task: 'Mengecek ketersediaan bahan alam (kunyit, daun pandan)', done: true, time: '07:00 WIB' },
    { id: 'chk-3', task: 'Mengisi lembar observasi anekdot perkembangan santri', done: false, time: '11:30 WIB' },
    { id: 'chk-4', task: 'Mengunggah dokumentasi foto kegiatan sentra ke portal wali', done: false, time: '12:30 WIB' }
  ]);

  const toggleCheck = (id: string) => {
    setChecklists(prev =>
      prev.map(item => item.id === id ? { ...item, done: !item.done } : item)
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl border border-violet-100">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Teacher Planning Studio</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-xs font-bold font-mono">
                Kurikulum Merdeka PAUD
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Studio perencanaan pembelajaran: modul RPP terintegrasi 6 aspek, pengelolaan sentra, checklist persiapan mengajar, dan kalender tematik.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['rpp', 'sentra', 'checklist', 'calendar'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'rpp' && 'Modul RPP'}
              {tab === 'sentra' && 'Tata Sentra'}
              {tab === 'checklist' && 'Checklist Harian'}
              {tab === 'calendar' && 'Kalender Mengajar'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: RPP */}
      {activeTab === 'rpp' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-slate-700">Daftar Modul RPP Semester Berjalan</div>
            <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Buat RPP Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-700 font-mono text-[10px] font-bold">
                      Pekan {p.week} • {p.sentra}
                    </span>
                    <h2 className="text-sm font-bold text-slate-800 mt-1">{p.theme}</h2>
                    <p className="text-xs text-slate-500 font-medium">{p.subTheme}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono ${
                    p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-700">Tujuan Pembelajaran:</div>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px]">
                    {p.goals.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">Alat/Bahan: {p.materials.length} item</span>
                  <button className="text-violet-600 font-bold hover:underline flex items-center gap-1 text-[11px]">
                    Lihat Rincian <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Sentra */}
      {activeTab === 'sentra' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Sentra Balok', 'Sentra Bahan Alam', 'Sentra Seni & Kreativitas', 'Sentra Imtaq & Ibadah', 'Sentra Main Peran'].map((sentraName, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-slate-800">{sentraName}</h2>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Kapasitas maksimal: 12 santri/sesi. Rotasi sentra berlangsung 60 menit per siklus belajar.
              </p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] font-mono text-slate-500">
                <span>Status: Siap Pakai</span>
                <span className="text-emerald-600 font-bold">100% Bersih</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-violet-600" />
              Checklist Persiapan & Refleksi Mengajar Harian
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Selesai: {checklists.filter(c => c.done).length}/{checklists.length}
            </span>
          </div>

          <div className="space-y-2">
            {checklists.map((chk) => (
              <div
                key={chk.id}
                onClick={() => toggleCheck(chk.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  chk.done ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    chk.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {chk.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-medium ${chk.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {chk.task}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{chk.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Calendar */}
      {activeTab === 'calendar' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-violet-600" />
            Kalender Pembelajaran Tematik Pekan Ini
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold text-slate-800">{day}</div>
                <div className="text-[10px] text-violet-600 font-medium">Sentra Pekanan</div>
                <div className="text-[9px] text-slate-400">07:30 - 11:00 WIB</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
