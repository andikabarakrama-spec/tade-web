import React, { useState } from 'react';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertOctagon,
  ArrowRight,
  Plus,
  Filter,
  Sparkles,
  Tag,
  ShieldCheck,
  Award
} from 'lucide-react';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export interface FounderMission {
  id: string;
  title: string;
  category: 'CRITICAL' | 'STRATEGIC' | 'OPERATIONAL';
  targetModule: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

const INITIAL_MISSIONS: FounderMission[] = [
  {
    id: 'mis-1',
    title: 'Audit Final Adopsi PWA & Kanal Notifikasi Wali Murid',
    category: 'CRITICAL',
    targetModule: 'r941',
    description: 'Pastikan rasio instalasi homescreen mencapai 90% dan izin notifikasi aktif tanpa kendala di iOS & Android.',
    completed: true,
    dueDate: 'Hari Ini'
  },
  {
    id: 'mis-2',
    title: 'Verifikasi Mutabaah 15 Doa Harian & Kartu Tahfidz',
    category: 'STRATEGIC',
    targetModule: 'r17',
    description: 'Sinkronisasi capaian hafalan anak langsung ke ringkasan harian orang tua.',
    completed: true,
    dueDate: '23 Agustus 2026'
  },
  {
    id: 'mis-3',
    title: 'Aktivasi Smart Upload Commander & Arsip Media Terpadu',
    category: 'STRATEGIC',
    targetModule: 'r_media_commander',
    description: 'Pengesahan format penamaan otomatis TK-ASY dan watermark konstitusi 3 level.',
    completed: false,
    dueDate: '25 Agustus 2026'
  },
  {
    id: 'mis-4',
    title: 'Uji Coba 7 Laboratorium Teknologi Inovasi TIB (Sandbox)',
    category: 'OPERATIONAL',
    targetModule: 'r_tib_labs',
    description: 'Uji GPU Quality Switch dan live test bed rendering foto.',
    completed: false,
    dueDate: '27 Agustus 2026'
  },
  {
    id: 'mis-5',
    title: 'Review Resolusi Yayasan untuk Alokasi Sarpras Sentra',
    category: 'OPERATIONAL',
    targetModule: 'r_cabinet_tracker',
    description: 'Pengecekan progres resolusi sanitasi, timbangan digital UKS, dan alat peraga edukatif.',
    completed: false,
    dueDate: '28 Agustus 2026'
  }
];

interface Props {
  onNavigateTab?: (tabId: string) => void;
}

export const FounderMissionQueue: React.FC<Props> = ({ onNavigateTab }) => {
  const [missions, setMissions] = useState<FounderMission[]>(INITIAL_MISSIONS);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'STRATEGIC' | 'OPERATIONAL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'CRITICAL' | 'STRATEGIC' | 'OPERATIONAL'>('STRATEGIC');
  const [newModule, setNewModule] = useState('r1');
  const [newDesc, setNewDesc] = useState('');

  const handleToggle = (id: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextState = !m.completed;
          founderCommandRecorder.recordCommand(
            'DIRECTIVE',
            m.targetModule,
            `Founder merubah status Misi: "${m.title}" -> ${nextState ? 'SELESAI' : 'AKTIF'}`
          );
          return { ...m, completed: nextState };
        }
        return m;
      })
    );
  };

  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMis: FounderMission = {
      id: `mis-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetModule: newModule,
      description: newDesc.trim() || 'Misi strategis Founder TK Islam Asy Syifa.',
      completed: false,
      dueDate: 'Pekan Ini'
    };

    setMissions([newMis, ...missions]);
    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      newModule,
      `Founder menambahkan Misi Baru: "${newTitle}"`
    );

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const filteredMissions = filter === 'ALL'
    ? missions
    : missions.filter(m => m.category === filter);

  const completedCount = missions.filter(m => m.completed).length;
  const progressPct = Math.round((completedCount / (missions.length || 1)) * 100);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900">
              <ListTodo className="w-4 h-4" />
            </span>
            <h3 className="text-base font-extrabold text-stone-900">
              Founder Mission Queue
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
              {completedCount}/{missions.length} Selesai ({progressPct}%)
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Daftar misi prioritas Founder untuk akselerasi tata kelola & mutu sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-[11px] font-bold">
            {(['ALL', 'CRITICAL', 'STRATEGIC', 'OPERATIONAL'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === f
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {f === 'ALL' ? 'Semua' : f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Misi
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Mission List */}
      <div className="space-y-2.5">
        {filteredMissions.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
              m.completed
                ? 'bg-stone-50/70 border-stone-200 opacity-75'
                : 'bg-white border-stone-200 hover:border-emerald-500 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => handleToggle(m.id)}
                className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                  m.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-stone-300 hover:border-emerald-600 bg-white'
                }`}
              >
                {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold ${m.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                    {m.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.category === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : m.category === 'STRATEGIC'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {m.category}
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {m.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Target: {m.dueDate}
                  </span>
                  <span>•</span>
                  <span>Modul: {m.targetModule}</span>
                </div>
              </div>
            </div>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab(m.targetModule)}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                Buka
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add Mission */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900">Tambah Misi Founder Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMission} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Judul Misi</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Verifikasi SOP Sentra Balok"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="STRATEGIC">STRATEGIC</option>
                    <option value="OPERATIONAL">OPERATIONAL</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Modul</label>
                  <input
                    type="text"
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    placeholder="r1 / r17 / r_media_commander"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Deskripsi Ringkas</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Instruksi dan capaian yang diharapkan..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Simpan Misi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
