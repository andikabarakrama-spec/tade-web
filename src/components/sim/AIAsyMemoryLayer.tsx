import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Lock,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Database,
  Users,
  Building,
  Info,
  Calendar
} from 'lucide-react';

interface MemoryItem {
  id: string;
  category: 'SCHOOL_PROFILE' | 'ONBOARDING' | 'CURRICULUM' | 'CUSTOM_RULE';
  key: string;
  value: string;
  updatedAt: string;
  isProtected: boolean;
}

export const AIAsyMemoryLayer: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: 'MEM-01',
      category: 'SCHOOL_PROFILE',
      key: 'Nama Institusi & Visi',
      value: 'TK Islam Asy-Syifa (Pusat) — "Membina Generasi Qurani, Cerdas, dan Berakhlaqul Karimah"',
      updatedAt: '15 Agt 2026',
      isProtected: true
    },
    {
      id: 'MEM-02',
      category: 'SCHOOL_PROFILE',
      key: 'Pimpinan & Narahubung',
      value: 'Kepala Sekolah: Ustadzah Hj. Maryam, S.Pd.I | Ketua Yayasan: H. Rahmat Hidayat, M.M',
      updatedAt: '15 Agt 2026',
      isProtected: true
    },
    {
      id: 'MEM-03',
      category: 'CURRICULUM',
      key: 'Fokus Kurikulum Aktif',
      value: 'Kurikulum Merdeka PAUD Plus Metode Tahfidz An-Naba & Doa Harian Santri Usia Dini',
      updatedAt: '14 Agt 2026',
      isProtected: false
    },
    {
      id: 'MEM-04',
      category: 'ONBOARDING',
      key: 'Status Go-Live Sekolah',
      value: 'Tahap 6/6 Selesai (Data Santri 248, Rekening VA Aktif, WhatsApp Terkoneksi)',
      updatedAt: '12 Agt 2026',
      isProtected: false
    },
    {
      id: 'MEM-05',
      category: 'CUSTOM_RULE',
      key: 'Gaya Komunikasi Otomatis',
      value: 'Gunakan sapaan hangat islami "Ayah/Bunda yang dirahmati Allah", akhiri dengan salam dan doa.',
      updatedAt: '10 Agt 2026',
      isProtected: false
    }
  ]);

  const [activeTab, setActiveTab] = useState<'memories' | 'quarantine' | 'add'>('memories');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<'SCHOOL_PROFILE' | 'CURRICULUM' | 'CUSTOM_RULE'>('CUSTOM_RULE');
  const [addSuccess, setAddSuccess] = useState(false);

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;

    const newItem: MemoryItem = {
      id: `MEM-${Date.now().toString().slice(-2)}`,
      category: newCategory,
      key: newKey,
      value: newValue,
      updatedAt: 'Baru saja',
      isProtected: false
    };

    setMemories([...memories, newItem]);
    setAddSuccess(true);
    setNewKey('');
    setNewValue('');
    setTimeout(() => {
      setAddSuccess(false);
      setActiveTab('memories');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">AI Asy Persistent Memory Layer</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Air-Gapped Safe
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Penyimpanan konteks lokal sekolah, preferensi komunikasi wali murid, dan riwayat bimbingan cerdas Dek Asy.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('add')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-xs self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Tambah Konteks Lokal
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('memories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'memories' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          Konteks Sekolah ({memories.length})
        </button>
        <button
          onClick={() => setActiveTab('quarantine')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'quarantine' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          Sovereign Quarantine Wall
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'add' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Formulir Konteks Baru
        </button>
      </div>

      {/* TAB: Memories */}
      {activeTab === 'memories' && (
        <div className="space-y-3">
          {memories.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h2 className="text-xs font-bold text-slate-800">{item.key}</h2>
                </div>

                {!item.isProtected && (
                  <button
                    onClick={() => handleDeleteMemory(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                    title="Lupakan Memori Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {item.value}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Diperbarui: {item.updatedAt}</span>
                {item.isProtected && (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Dilindungi Konstitusi
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Quarantine Wall */}
      {activeTab === 'quarantine' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Sovereign Quarantine Wall & Privacy Sandbox</h2>
              <p className="text-xs text-slate-500">Mekanisme isolasi memori AI yang menjamin privasi absolut antar sekolah.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900">Zero Founder Secret Policy:</strong>
                <p className="text-emerald-800 mt-0.5">Kunci root, recovery envelope, dan rahasia Founder tidak pernah disimpan dalam memory layer AI.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900">Zero Tenant Leak Guarantee:</strong>
                <p className="text-emerald-800 mt-0.5">Data kontekstual TK Asy-Syifa Pusat tidak akan pernah tercampur atau disarankan kepada tenant sekolah lain.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Add */}
      {activeTab === 'add' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Tambah Konteks Lokal AI Asy</h2>
          
          {addSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Konteks baru berhasil dipelajari dan disimpan dalam memori lokal AI Asy!
            </div>
          )}

          <form onSubmit={handleAddMemory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Memori</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-700 focus:outline-none"
              >
                <option value="CUSTOM_RULE">Aturan & Preferensi Komunikasi</option>
                <option value="CURRICULUM">Konteks Kurikulum & Pembelajaran</option>
                <option value="SCHOOL_PROFILE">Profil Lembaga / Narahubung</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topik / Judul Konteks</label>
              <input
                type="text"
                placeholder="Contoh: Kebijakan Seragam Hari Jumat"
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Isi Fakta / Instruksi</label>
              <textarea
                rows={3}
                placeholder="Contoh: Hari Jumat seluruh santri putra memakai busana koko putih dan santri putri memakai gamis putih..."
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('memories')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
              >
                Simpan Memori
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
