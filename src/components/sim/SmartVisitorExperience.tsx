import React, { useState } from 'react';
import {
  UserCheck,
  QrCode,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  UserPlus,
  Printer,
  Search,
  Sparkles
} from 'lucide-react';

export const SmartVisitorExperience: React.FC = () => {
  const [visitors, setVisitors] = useState([
    {
      id: 'VST-2026-081',
      name: 'Bpk. Hendra Gunawan',
      instansi: 'Puskesmas Cipondoh',
      keperluan: 'Pemeriksaan Kesehatan Gigi Berkala Santri',
      tujuan: 'Kepala Sekolah / UKS',
      checkIn: '08:15 WIB',
      checkOut: '-',
      status: 'AKTIF_DI_LOKASI',
      badgeNumber: 'BDG-09',
      approvedBy: 'Satpam / TU'
    },
    {
      id: 'VST-2026-080',
      name: 'Ibu Ratna Dewi',
      instansi: 'Wali Calon Santri',
      keperluan: 'Konsultasi PPDB & Tur Lingkungan Sekolah',
      tujuan: 'Humas & Pendaftaran',
      checkIn: '09:00 WIB',
      checkOut: '-',
      status: 'MENUNGGU_PERSETUJUAN',
      badgeNumber: 'BDG-10',
      approvedBy: 'Pending'
    },
    {
      id: 'VST-2026-079',
      name: 'Bpk. Danang Prasetyo',
      instansi: 'CV Mandiri Edukasi',
      keperluan: 'Pengiriman Alat Peraga Sentra Sains',
      tujuan: 'Tata Usaha / Logistik',
      checkIn: '07:30 WIB',
      checkOut: '08:10 WIB',
      status: 'SELESAI',
      badgeNumber: 'BDG-08',
      approvedBy: 'Staff TU'
    }
  ]);

  const [newVisitor, setNewVisitor] = useState({
    name: '',
    instansi: '',
    keperluan: '',
    tujuan: 'Kepala Sekolah'
  });

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [activeBadge, setActiveBadge] = useState<any>(visitors[0]);

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitor.name.trim()) return;

    const item = {
      id: `VST-2026-${String(visitors.length + 80).padStart(3, '0')}`,
      name: newVisitor.name,
      instansi: newVisitor.instansi || 'Pribadi',
      keperluan: newVisitor.keperluan || 'Kunjungan Kedinasan / Silaturahmi',
      tujuan: newVisitor.tujuan,
      checkIn: 'Baru Saja',
      checkOut: '-',
      status: 'AKTIF_DI_LOKASI',
      badgeNumber: `BDG-${String(visitors.length + 11).padStart(2, '0')}`,
      approvedBy: 'Petugas Resepsionis'
    };

    setVisitors([item, ...visitors]);
    setActiveBadge(item);
    setShowCheckInModal(false);
    setNewVisitor({ name: '', instansi: '', keperluan: '', tujuan: 'Kepala Sekolah' });
  };

  const handleApprove = (id: string) => {
    setVisitors(prev =>
      prev.map(v =>
        v.id === id
          ? { ...v, status: 'AKTIF_DI_LOKASI', approvedBy: 'Pimpinan / TU' }
          : v
      )
    );
  };

  const handleCheckOut = (id: string) => {
    setVisitors(prev =>
      prev.map(v =>
        v.id === id
          ? { ...v, status: 'SELESAI', checkOut: 'Baru Saja' }
          : v
      )
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Smart Visitor Experience</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                Buku Tamu & Badge Digital
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sistem registrasi tamu terpadu: check-in QR mandiri, verifikasi identitas, kartu akses virtual, dan pencatatan riwayat kunjungan.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCheckInModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Registrasi Tamu Baru
        </button>
      </div>

      {/* Grid: Visitor List & Live Digital Badge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Visitor History Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Daftar Kunjungan Tamu Hari Ini
            </h2>
            <span className="text-xs text-slate-400 font-mono">{visitors.length} Kunjungan</span>
          </div>

          <div className="space-y-3">
            {visitors.map(v => (
              <div
                key={v.id}
                onClick={() => setActiveBadge(v)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  activeBadge?.id === v.id
                    ? 'border-amber-400 bg-amber-50/40 shadow-sm'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{v.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-700">
                      {v.instansi}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-snug">{v.keperluan}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Tujuan: <strong>{v.tujuan}</strong></span>
                    <span>•</span>
                    <span>Masuk: {v.checkIn}</span>
                    {v.checkOut !== '-' && <span>• Keluar: {v.checkOut}</span>}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      v.status === 'AKTIF_DI_LOKASI'
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                        : v.status === 'MENUNGGU_PERSETUJUAN'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {v.status}
                  </span>

                  <div className="flex items-center gap-1">
                    {v.status === 'MENUNGGU_PERSETUJUAN' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleApprove(v.id);
                        }}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700"
                      >
                        Setujui
                      </button>
                    )}
                    {v.status === 'AKTIF_DI_LOKASI' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleCheckOut(v.id);
                        }}
                        className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px] font-bold hover:bg-slate-300"
                      >
                        Check-Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Digital Badge Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-600" />
            Badge Digital Tamu Terverifikasi
          </h2>

          {activeBadge ? (
            <div className="bg-gradient-to-b from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-md space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                  TK ISLAM ASY-SYUKRIYYAH
                </div>
                <span className="px-2 py-0.5 rounded bg-white text-amber-800 text-[10px] font-extrabold">
                  {activeBadge.badgeNumber}
                </span>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="text-lg font-extrabold">{activeBadge.name}</div>
                <div className="text-xs opacity-90">{activeBadge.instansi}</div>
              </div>

              <div className="bg-white text-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Tujuan:</div>
                  <div className="font-bold text-slate-800">{activeBadge.tujuan}</div>
                </div>
                <QrCode className="w-8 h-8 text-amber-600" />
              </div>

              <div className="text-[10px] text-center opacity-80 pt-1">
                Disetujui oleh: {activeBadge.approvedBy} • ID: {activeBadge.id}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">Pilih tamu untuk melihat badge.</div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="font-bold text-slate-700">Integrasi Otomatis:</div>
            <p>Data tamu terekam langsung dalam Log Keamanan Guardian dan tercatat di timeline audit platform.</p>
          </div>
        </div>
      </div>

      {/* Modal: Check-In Tamu Baru */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Formulir Registrasi Tamu</h3>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Lengkap Tamu:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang Wijaya"
                  value={newVisitor.name}
                  onChange={e => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Instansi / Asal Lembaga:</label>
                <input
                  type="text"
                  placeholder="Contoh: Dinas Pendidikan / Pribadi"
                  value={newVisitor.instansi}
                  onChange={e => setNewVisitor({ ...newVisitor, instansi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Keperluan Kunjungan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Silaturahmi & Penawaran Kerjasama"
                  value={newVisitor.keperluan}
                  onChange={e => setNewVisitor({ ...newVisitor, keperluan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tujuan / Pihak yang Dituju:</label>
                <select
                  value={newVisitor.tujuan}
                  onChange={e => setNewVisitor({ ...newVisitor, tujuan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                  <option value="Tata Usaha & Keuangan">Tata Usaha & Keuangan</option>
                  <option value="Humas & PPDB">Humas & PPDB</option>
                  <option value="Wali Kelas B2">Wali Kelas</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                >
                  Simpan & Terbitkan Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
