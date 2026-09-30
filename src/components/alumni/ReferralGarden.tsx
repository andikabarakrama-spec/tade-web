import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Award, 
  Sparkles, 
  Heart, 
  Download, 
  ExternalLink, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MessageCircle,
  FileText
} from 'lucide-react';
import { AlumniReferralRecord, ReferralRewardSummary } from '../../types/alumni';
import { alumniTransitionEngine } from '../../services/alumniTransitionEngine';

interface Props {
  alumniUid?: string;
  alumniName?: string;
}

export const ReferralGarden: React.FC<Props> = ({ 
  alumniUid = 'usr-parent-01', 
  alumniName = 'H. Lukman Hakim (Wali Zaidan)' 
}) => {
  const [referrals, setReferrals] = useState<AlumniReferralRecord[]>([]);
  const [summary, setSummary] = useState<ReferralRewardSummary | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantGender, setApplicantGender] = useState<'L' | 'P'>('L');
  const [programInterest, setProgramInterest] = useState<'TK A' | 'TK B' | 'PAUD TPA'>('TK A');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const referralCode = `ASY-REF-${alumniName.split(' ')[0].toUpperCase()}-2026`;
  const shareUrl = `https://tk-asysyifa.sch.id/ppdb?ref=${referralCode}`;

  const loadData = () => {
    const list = alumniTransitionEngine.getReferralRecords(alumniUid);
    const sum = alumniTransitionEngine.getReferralRewardSummary(alumniUid);
    setReferrals(list);
    setSummary(sum);
  };

  useEffect(() => {
    loadData();
  }, [alumniUid]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nBagi Ayah/Bunda yang sedang mencari sekolah terbaik untuk ananda usia PAUD/TK, kami sekeluarga sangat merekomendasikan *TK Islam Asy-Syifa Tanggul*.\n\nKurikulum Sentra Terpadu, Tahfidz Juz 30 Mutqin, dan Pembinaan Akhlak Karimah sejak dini.\n\nDaftar via tautan rekomendasi keluarga kami untuk prioritas pendaftaran:\n${shareUrl}\n\nJazakumullah Khairan Katsiran.`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) return;

    alumniTransitionEngine.recordReferralShare({
      alumniUid,
      alumniName,
      applicantName,
      applicantPhone,
      applicantGender,
      programInterest
    });

    setSuccessToast(`Alhamdulillah! Rekomendasi untuk ${applicantName} berhasil dicatat.`);
    setTimeout(() => setSuccessToast(null), 4000);
    setShowAddModal(false);
    setApplicantName('');
    setApplicantPhone('');
    loadData();
  };

  return (
    <div id="referral-garden-section" className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-teal-500/30 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> REFERRAL GARDEN — PENEBAR KEBAIKAN
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Taman Rekomendasi & Silaturahmi Berkah
          </h2>
          <p className="text-xs md:text-sm text-teal-100/90 leading-relaxed">
            Ajak kerabat, tetangga, dan sahabat merasakan indahnya pendidikan Al-Quran di TK Islam Asy-Syifa. Dapatkan apresiasi kehormatan & Daun Keberkahan di Growing Tree sekolah.
          </p>

          {/* Quick Share Box */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-teal-500/40 flex items-center justify-between gap-3 flex-1 font-mono text-xs text-teal-200">
              <span className="truncate">{shareUrl}</span>
              <button
                id="btn-copy-referral-link"
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white transition shrink-0 cursor-pointer"
                title="Salin Tautan"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              id="btn-share-wa"
              onClick={handleShareWhatsApp}
              className="py-2.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <MessageCircle className="w-4 h-4" /> Bagikan ke WhatsApp
            </button>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 text-white/5 pointer-events-none">
          <Heart className="w-72 h-72" />
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Stats and Reward Summary */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
              🌱
            </div>
            <div>
              <p className="text-[11px] font-mono text-stone-500 font-bold uppercase">Total Rekomendasi</p>
              <h3 className="text-2xl font-black text-slate-900">{summary.totalRegistered} Keluarga</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl">
              🎓
            </div>
            <div>
              <p className="text-[11px] font-mono text-stone-500 font-bold uppercase">Santri Diterima</p>
              <h3 className="text-2xl font-black text-slate-900">{summary.totalAccepted} Santri Baru</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              🌳
            </div>
            <div>
              <p className="text-[11px] font-mono text-stone-500 font-bold uppercase">Daun Emas Keberkahan</p>
              <h3 className="text-2xl font-black text-amber-600">{summary.goldenLeavesEarned} Daun</h3>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Referrals List & Promotional Kit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Referral Tracking Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" /> Riwayat Rekomendasi Santri
              </h3>
              <p className="text-xs text-stone-500">
                Status verifikasi pendaftaran calon santri yang direkomendasikan.
              </p>
            </div>

            <button
              id="btn-add-referral-manual"
              onClick={() => setShowAddModal(true)}
              className="py-2 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Tambah Manual
            </button>
          </div>

          {referrals.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs">
              Belum ada rekomendasi yang dicatat. Bagikan tautan di atas untuk memulai!
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{item.applicantName}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                        {item.programInterest}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono">
                      No. Kontak: {item.applicantPhone} • Kode: {item.referralCode}
                    </p>
                    <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> {item.rewardBadgeGranted}
                    </p>
                  </div>

                  <div className="self-start sm:self-center">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        item.status === 'DITERIMA'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : item.status === 'TERVERIFIKASI'
                          ? 'bg-teal-100 text-teal-800 border-teal-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {item.status === 'DITERIMA' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Promotional Kit & Badges */}
        <div className="lg:col-span-4 space-y-4">
          {/* Promotional Kit Downloads */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" /> Kit Promosi & Poster PPDB
            </h4>
            <p className="text-xs text-stone-500">
              Materi resmi dari Creative Studio Asy Syifa untuk diunggah ke status WhatsApp atau media sosial keluarga.
            </p>

            <div className="space-y-2 pt-1">
              <a
                href="#poster-ppdb"
                onClick={(e) => { e.preventDefault(); alert('Poster PPDB Resmi Asy Syifa 2026 berhasil diunduh!'); }}
                className="w-full p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 flex items-center justify-between text-xs font-bold text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Poster Brosur PPDB 2026 (HD)</span>
                </div>
                <Download className="w-3.5 h-3.5 text-stone-400" />
              </a>

              <a
                href="#video-teaser"
                onClick={(e) => { e.preventDefault(); alert('Tautan video profil sentra disalin ke clipboard!'); }}
                className="w-full p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 flex items-center justify-between text-xs font-bold text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Video Profil Sentra & Tahfidz</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </a>
            </div>
          </div>

          {/* Badges of Honor */}
          {summary && (
            <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-5 border border-amber-200/80 space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-amber-900 tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" /> Lencana Kehormatan Dakwah
              </h4>

              <div className="space-y-2">
                {summary.badges.map((b) => (
                  <div key={b.id} className="bg-white/90 p-3 rounded-2xl border border-amber-200/60 flex items-center gap-3">
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{b.title}</h5>
                      <p className="text-[10px] text-stone-600 leading-tight">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Referral Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 border border-stone-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  🤝
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Rekomendasikan Calon Santri
                  </h3>
                  <p className="text-xs text-stone-500">
                    Tim Panitia PPDB akan membantu menghubungi keluarga dengan ramah.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Calon Santri / Orang Tua
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ananda Rayhan / Bapak Faisal"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nomor WhatsApp Orang Tua
                </label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={applicantGender}
                    onChange={(e) => setApplicantGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Minat Program
                  </label>
                  <select
                    value={programInterest}
                    onChange={(e) => setProgramInterest(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="TK A">TK A (4-5 Th)</option>
                    <option value="TK B">TK B (5-6 Th)</option>
                    <option value="PAUD TPA">PAUD TPA</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition"
                >
                  Simpan Rekomendasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
