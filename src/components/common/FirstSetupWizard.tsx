import React, { useState } from 'react';
import { DataService } from '../../services/db';
import { FirstSetupData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Building2, ShieldCheck, CheckCircle2, Sparkles, School, MapPin, Mail, Phone, CreditCard, Clock, UserCheck } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const FirstSetupWizard: React.FC<Props> = ({ onComplete }) => {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState<FirstSetupData>({
    namaSekolah: 'TK ASY SYIFA TANGGUL',
    yayasan: 'Yayasan Asy Syifa Tanggul',
    npsn: '20541234',
    jenjang: 'TK / PAUD',
    kepalaSekolah: 'Sri Mulyani, S.Pd.',
    tahunAjaran: '2026/2027',
    alamat: 'Jl. Raya Tanggul No. 45, Kecamatan Tanggul, Kabupaten Jember',
    email: 'tk.asysyifa.tanggul@gmail.com',
    nomorWA: '081234567890',
    logo: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=200',
    rekening: 'BSI 7123456789 a.n. TK Asy Syifa Tanggul',
    timezone: 'Asia/Jakarta (WIB)'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || userProfile?.role !== 'SUPER_ADMIN') {
      setErrorMsg('Hanya Super Admin yang diizinkan menyelesaikan First Setup Produksi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await DataService.completeFirstSetup(formData, currentUser.uid);
      await DataService.createAuditLog({
        uid: currentUser.uid,
        userName: userProfile.nama || userProfile.name || 'Super Admin',
        role: 'SUPER_ADMIN',
        action: 'First Setup',
        targetModule: 'System Setup'
      });
      setLoading(false);
      onComplete();
    } catch (err: any) {
      console.error('First Setup error:', err);
      setErrorMsg('Gagal menyimpan konfigurasi First Setup. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-stone-200 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wide">
                First Setup Required
              </span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Only
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Inisialisasi Sistem Produksi (First Setup)
            </h2>
            <p className="text-xs text-stone-500">
              Lengkapi informasi sekolah di bawah ini untuk memulai operasional TADE SIM TK Asy Syifa v15.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-emerald-600" /> Nama Sekolah *
              </label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Nama Yayasan *
              </label>
              <input
                type="text"
                required
                value={formData.yayasan}
                onChange={(e) => setFormData({ ...formData, yayasan: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">NPSN *</label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Jenjang *</label>
              <input
                type="text"
                required
                value={formData.jenjang}
                onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Tahun Ajaran *</label>
              <input
                type="text"
                required
                value={formData.tahunAjaran}
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Kepala Sekolah *
              </label>
              <input
                type="text"
                required
                value={formData.kepalaSekolah}
                onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Zona Waktu / Timezone *
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold"
              >
                <option value="Asia/Jakarta (WIB)">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar (WITA)">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura (WIT)">Asia/Jayapura (WIT)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Alamat Lengkap *
            </label>
            <input
              type="text"
              required
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-600" /> Email Resmi Sekolah *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Nomor WhatsApp Resmi *
              </label>
              <input
                type="tel"
                required
                value={formData.nomorWA}
                onChange={(e) => setFormData({ ...formData, nomorWA: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> URL Logo Sekolah *
              </label>
              <input
                type="text"
                required
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Informasi Rekening Bank *
              </label>
              <input
                type="text"
                required
                value={formData.rekening}
                onChange={(e) => setFormData({ ...formData, rekening: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <p className="text-[11px] text-stone-500 font-medium">
              Data First Setup akan disimpan secara permanen di Firestore (<code className="bg-stone-100 px-1 py-0.5 rounded text-emerald-800">tade_settings/main</code> & <code className="bg-stone-100 px-1 py-0.5 rounded text-emerald-800">school_profile/main</code>).
            </p>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? 'Menyimpan First Setup...' : 'Simpan & Aktifkan Sistem'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
