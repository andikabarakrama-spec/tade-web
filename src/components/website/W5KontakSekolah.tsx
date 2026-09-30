import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, Sparkles, Navigation, Heart, ExternalLink, Compass, QrCode, MessageSquare } from 'lucide-react';
import { LivingGardenElements } from '../garden/LivingGardenElements';
import { LivingPageDecorator } from '../garden/LivingPageDecorator';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { ImmersiveWorldLandscape } from '../garden/ImmersiveWorldLandscape';
import { buildWhatsAppUrl, getWhatsAppConfig } from '../../services/guardian/whatsappConfig';

interface Props {
  onTabChange: (tab: string) => void;
}

export const W5KontakSekolah: React.FC<Props> = ({ onTabChange }) => {
  const [msgSent, setMsgSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const waConfig = getWhatsAppConfig();
  const officialAddress = "Jl. Raya Tanggul No. 88, Desa Tanggul Barat, Kec. Tanggul, Kab. Jember, Jawa Timur 68155";
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent('TK Asy Syifa Tanggul Jember')}`;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setMsgSent(true);
  };

  return (
    <ImmersiveWorldLandscape>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
        <LivingPageDecorator pageName="Kontak" />
        <LivingGardenElements type="page-decor" />

        {/* Page Title Scrapbook Banner - Soft Closing Scene Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-8 sm:p-10 border-2 border-amber-400/80 shadow-xl text-center space-y-3 relative overflow-hidden"
        >
          <div className="absolute top-4 left-8 text-2xl animate-float-slow">🌳</div>
          <div className="absolute top-6 right-10 text-2xl animate-pulse">🐦</div>

          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-4 py-1.5 rounded-full shadow-md">
            <MapPin className="w-4 h-4 text-slate-950" />
            LOKASI WORLD: POS SATPAM & SEKRETARIAT SILATURAHMI
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Silaturahmi & Kunjungan Langsung
          </h1>
          <p className="text-stone-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Tim sekretariat & Dek Syifa siap menyambut kunjungan Ayah & Bunda di Kampus Hijau TK Asy Syifa Tanggul.
          </p>

          {/* Dek Syifa Mascot Escort Note */}
          <div className="max-w-md mx-auto bg-emerald-950/80 backdrop-blur-md p-3 rounded-2xl border border-amber-400/50 flex items-center justify-center gap-2 text-amber-200 text-xs italic">
            <span className="text-lg">👶</span>
            <span>“Dek Syifa tunggu kedatangannya di sekolah ya Ayah & Bunda!”</span>
          </div>

          {/* AI Asy Character Mascot Scene */}
          <AIAsyCharacterScene pageContext="w5Kontak" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact Info & Interactive Living Map */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-md space-y-4 text-xs relative">
              {/* Tape Accent */}
              <div className="absolute -top-3 left-8 w-20 h-5 bg-amber-200/90 border border-amber-300 -rotate-2 z-10 rounded-xs pointer-events-none shadow-2xs" />

              <h2 className="text-base font-black text-slate-900 border-b border-stone-200 pb-3 flex items-center justify-between">
                <span>Informasi Alamat & Sekretariat</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h2>

              <div className="space-y-4 text-stone-700">
                <div className="flex items-start gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-extrabold text-xs">Alamat Lengkap Kampus:</strong>
                    {officialAddress}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-extrabold text-xs">Telepon / WhatsApp Layanan PPDB:</strong>
                    (0336) 441-239 / WA: 0812-3456-7890
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-extrabold text-xs">Email Sekretariat Resmi:</strong>
                    info@tkasysyifa-tanggul.sch.id
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-extrabold text-xs">Jam Layanan Kantor Sekretariat:</strong>
                    Senin - Sabtu: 07.00 - 14.00 WIB (Siswa pulang 11.00 WIB)
                  </div>
                </div>
              </div>
            </div>

            {/* Living Map View */}
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-md space-y-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-600 animate-bounce" />
                  Peta Kampus Hijau TK Asy Syifa Tanggul
                </h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Jember ➔ Tanggul
                </span>
              </div>

              {/* Journey Map Hierarchy */}
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
                <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-emerald-700" /> Kab. Jember</span>
                <span>➔</span>
                <span>Kec. Tanggul</span>
                <span>➔</span>
                <span className="text-emerald-900 font-black">TK Asy Syifa</span>
              </div>

              {/* Interactive Iframe Map */}
              <div className="h-64 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden relative shadow-inner">
                <iframe
                  title="Map Lokasi TK Asy Syifa Tanggul Jember"
                  src="https://maps.google.com/maps?q=Tanggul+Jember&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Route Button to Official Maps */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Buka Rute Navigasi Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
            </div>
          </div>

          {/* Right: Feedback Form & Quick Access to SIM */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-md space-y-4 relative">
              <h2 className="text-base font-black text-slate-900 border-b border-stone-200 pb-3 flex items-center justify-between">
                <span>Kirim Pertanyaan / Pesan Singkat</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </h2>

              {msgSent ? (
                <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-300 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-black text-emerald-900">Pesan Berhasil Terkirim!</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Terima kasih Ayah/Bunda! Pesan Anda telah diterima oleh sekretariat. Tim kami akan segera menghubungi nomor WhatsApp Anda.
                  </p>
                  <button
                    onClick={() => setMsgSent(false)}
                    className="mt-2 text-xs font-black text-emerald-800 underline hover:text-emerald-900"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block font-extrabold text-stone-800 mb-1">Nama Ayah / Bunda *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bunda Fatimah"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-stone-800 mb-1">No. WhatsApp / Telepon *</label>
                    <input
                      type="text"
                      required
                      placeholder="081234567890"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-stone-800 mb-1">Pesan / Pertanyaan *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tuliskan pertanyaan seputar pendaftaran, kegiatan harian, atau konsultasi anak..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-2xl shadow-md transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-300" /> Kirim Pesan Ke Sekretariat
                  </button>
                </form>
              )}
            </div>

            {/* WhatsApp Guardian Assistant Direct Contact Upgrade */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 border-2 border-amber-400/80 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  WhatsApp Guardian Assistant
                </div>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                  100% Free Click-to-Chat
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 space-y-2">
                  <h3 className="text-lg font-black text-white">
                    Layanan Fast-Response WhatsApp Sekretariat
                  </h3>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    Sistem WhatsApp Business menyambut pengunjung secara otomatis sebelum admin merespons pada jam kerja.
                  </p>
                  <div className="text-[11px] text-amber-200 font-medium bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-700/60 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Jam Kerja Resepsionis: <strong>{waConfig.operatingHours}</strong></span>
                  </div>
                </div>

                {/* QR Code Placeholder Box */}
                <div className="sm:col-span-4 bg-white text-slate-900 p-3 rounded-2xl border-2 border-amber-400 text-center flex flex-col items-center justify-center space-y-1 shadow-md shrink-0">
                  <div className="w-20 h-20 bg-stone-100 rounded-xl border border-stone-300 p-1 flex items-center justify-center">
                    {/* SVG Stylized QR Code Placeholder */}
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 3h2v3h-2v-3zm0-5h4v2h-4v-2zm-4 0h2v8h-2v-8zm4 6h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-slate-900 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-emerald-600" /> Scan WA Chat
                  </span>
                </div>
              </div>

              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-center cursor-pointer border border-emerald-400/40"
              >
                <Phone className="w-4 h-4 text-amber-300 fill-current" />
                <span>Chat WhatsApp Sekretariat ({waConfig.formattedDisplayNumber})</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
            </div>

            {/* Quick Access to SIM Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 border-2 border-emerald-600/60 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Akses Internal Guru & Wali Murid
              </div>
              <h3 className="text-lg font-black text-white">Portal SIM TK Asy Syifa (R1–R32)</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Khusus untuk Guru, Staf Keuangan, Kepala Sekolah, dan Wali Murid terdaftar untuk melihat e-rapor, presensi, dan tagihan SPP.
              </p>
              <button
                onClick={() => onTabChange('r1')}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl transition shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                Buka Portal SIM R1–R32 Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </ImmersiveWorldLandscape>
  );
};
