import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  Download, 
  Share2, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  GraduationCap, 
  Copy, 
  Check
} from 'lucide-react';
import { AlumniProfile } from '../../types/alumni';

interface Props {
  alumni: AlumniProfile;
  onClose?: () => void;
  isModal?: boolean;
}

export const AlumniPassportCard: React.FC<Props> = ({ alumni, onClose, isModal = false }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<'CARD' | 'TAHFIDZ' | 'VERIFICATION'>('CARD');

  const handleCopyHash = () => {
    navigator.clipboard.writeText(alumni.certificateQrHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="alumni-passport-container" className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
      {/* Islamic Geometric Aura & Background Ambient */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 text-amber-300 font-bold border border-emerald-400/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                SOVEREIGN HERITAGE PASSPORT
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3" /> Terverifikasi
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Paspor Digital Alumni Asy Syifa
            </h2>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            id="tab-btn-card"
            onClick={() => setActiveTab('CARD')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'CARD'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kartu Paspor
          </button>
          <button
            id="tab-btn-tahfidz"
            onClick={() => setActiveTab('TAHFIDZ')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'TAHFIDZ'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tahfidz Journey
          </button>
          <button
            id="tab-btn-verification"
            onClick={() => setActiveTab('VERIFICATION')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'VERIFICATION'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Verifikasi QR
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="mt-6 relative z-10">
        {activeTab === 'CARD' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Gold/Emerald Identity Card */}
            <div className="lg:col-span-8 bg-gradient-to-br from-slate-950 via-emerald-950/60 to-slate-900 rounded-3xl p-6 md:p-7 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[340px]">
              {/* Islamic Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-400/20 text-xs font-mono">✦ ━━━━ ✦</div>
              <div className="absolute top-2 right-2 text-amber-400/20 text-xs font-mono">✦ ━━━━ ✦</div>
              <div className="absolute bottom-2 left-2 text-amber-400/20 text-xs font-mono">✦ ━━━━ ✦</div>
              <div className="absolute bottom-2 right-2 text-amber-400/20 text-xs font-mono">✦ ━━━━ ✦</div>

              {/* Card Upper Section */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-lg">
                      🌿
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-amber-200 tracking-wide">
                        TK ISLAM ASY-SYIFA TANGGUL
                      </h4>
                      <p className="text-[10px] text-emerald-300/80 font-mono">
                        NPSN: 69987654 • Lembar Identitas Resmi Alumni
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-amber-400/15 text-amber-300 rounded-lg border border-amber-400/30 font-bold">
                      {alumni.cohortName}
                    </span>
                  </div>
                </div>

                {/* Profile Grid */}
                <div className="flex flex-col sm:flex-row gap-5 mt-5 items-center sm:items-start">
                  {/* Photo with Emerald Ring */}
                  <div className="relative shrink-0">
                    <img
                      src={alumni.photoUrl}
                      alt={alumni.studentName}
                      className="w-28 h-36 object-cover rounded-2xl border-2 border-amber-400/60 shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1 rounded-lg border border-emerald-400 text-xs shadow-md">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Nama Lengkap Santri</p>
                      <h3 className="text-lg md:text-xl font-black text-white">{alumni.studentName}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">NIS / NISN:</span>
                        <p className="font-semibold text-slate-200">{alumni.nis} / {alumni.nisn}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">Tahun Wisuda:</span>
                        <p className="font-semibold text-amber-300">{alumni.graduationYear} ({alumni.graduationDate})</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">Sekolah Lanjutan:</span>
                        <p className="font-semibold text-emerald-300 truncate">{alumni.currentSchool || 'SDIT Pilihan'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">Orang Tua / Wali:</span>
                        <p className="font-semibold text-slate-200 truncate">{alumni.parentName}</p>
                      </div>
                    </div>

                    {/* Badges Carousel / List */}
                    <div className="pt-2">
                      <p className="text-[10px] text-slate-400 font-mono mb-1.5">Lencana Karakter & Keberkahan:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {alumni.characterBadges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 flex items-center gap-1"
                          >
                            <Award className="w-3 h-3 text-amber-400" /> {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hash: {alumni.certificateQrHash.slice(0, 24)}...</span>
                </div>
                <div className="text-amber-300/80 font-serif italic text-xs">
                  "Lulus bukan berarti keluar, ukhuwah selamanya."
                </div>
              </div>
            </div>

            {/* Quick Actions & Passport Highlights */}
            <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
              <div className="bg-slate-950/90 rounded-3xl p-5 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Capaian Keberkahan
                </h4>

                <div className="space-y-3">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold">
                        📖
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Tahfidz Quran</p>
                        <p className="text-[10px] text-slate-400">{alumni.lastMemorizedSurah}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      Mutqin
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-900/50 text-amber-400 flex items-center justify-center font-bold">
                        🌳
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Daun Legacy Tree</p>
                        <p className="text-[10px] text-slate-400">Pohon Karakter Asy Syifa</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-300">
                      {alumni.legacyTreeLeavesCount} Daun Emas
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-900/50 text-teal-400 flex items-center justify-center font-bold">
                        🤝
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Referral PPDB</p>
                        <p className="text-[10px] text-slate-400">Keluarga Direkomendasikan</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-teal-300">
                      {alumni.referralsCount} Rekan
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="btn-print-passport"
                  onClick={handlePrint}
                  className="py-3 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Unduh / Cetak
                </button>
                <button
                  id="btn-copy-hash"
                  onClick={handleCopyHash}
                  className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedHash ? 'Tersalin' : 'Salin Hash QR'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TAHFIDZ' && (
          <div className="bg-slate-950/90 rounded-3xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" /> Portofolio Tahfidz & Karakter Santri
                </h3>
                <p className="text-xs text-slate-400">
                  Rekam jejak hafalan Al-Quran dan keteladanan adab selama menempuh masa belajar di TK Asy Syifa.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-600/40 rounded-xl text-xs font-bold">
                Juz 30 Terverifikasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alumni.tahfidzAchievements.map((item, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-sm text-white">{item}</h4>
                  <p className="text-[11px] text-slate-400">
                    Disimak & disahkan langsung oleh Ustadzah Pembimbing Sentra Ibadah.
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-950/30 p-5 rounded-2xl border border-emerald-500/30 text-xs space-y-2">
              <h4 className="font-bold text-emerald-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" /> Pesan Doa Ustadzah untuk Ananda
              </h4>
              <p className="text-slate-300 italic leading-relaxed">
                "Ananda {alumni.studentName} adalah santri yang cerdas, tekun, dan penyayang. Semoga hafalan Al-Quran yang telah terpatri di dada menjadi lentera kehidupan ananda di jenjang Sekolah Dasar dan seterusnya. Teruslah berbakti kepada orang tua dan mencintai majelis ilmu."
              </p>
              <p className="text-right text-[10px] text-slate-400 font-mono mt-1">
                — Tim Ustadzah Pembina TK Islam Asy-Syifa Tanggul
              </p>
            </div>
          </div>
        )}

        {activeTab === 'VERIFICATION' && (
          <div className="bg-slate-950/90 rounded-3xl p-6 border border-slate-800 space-y-6 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">QR Verifikasi Ijazah & Paspor Alumni</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dapat dipindai oleh pihak SD/MI penerima untuk mengonfirmasi keaslian dokumen kelulusan tanpa memerlukan konfirmasi manual.
              </p>
            </div>

            {/* Simulated Cryptographic SVG QR */}
            <div className="bg-white p-6 rounded-3xl inline-block shadow-2xl border-4 border-amber-400/40">
              <div className="w-44 h-44 bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-3 text-white relative">
                {/* SVG QR Visual Pattern */}
                <div className="grid grid-cols-4 gap-1.5 w-full h-full p-2">
                  <div className="bg-emerald-400 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-emerald-400 rounded-sm"></div>
                  <div className="bg-emerald-400 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-amber-400 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-emerald-400 rounded-sm"></div>
                  <div className="bg-emerald-400 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-amber-400 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-emerald-400 rounded-sm"></div>
                  <div className="bg-emerald-400 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-emerald-400 rounded-sm"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-black bg-slate-900/90 text-amber-300 px-2 py-1 rounded border border-amber-400/50 font-mono">
                    ASY-SYIFA
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-left space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase">Cryptographic QR Signature:</span>
              <p className="text-xs font-mono text-emerald-300 break-all">{alumni.certificateQrHash}</p>
            </div>

            <p className="text-[11px] text-slate-400">
              Sistem Heritage Asy Syifa menjamin 100% data tersimpan di server berdaulat lokal tanpa ketergantungan API luar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
