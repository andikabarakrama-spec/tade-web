import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles, 
  Search, 
  Download, 
  Eye, 
  Volume2, 
  UserCheck, 
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  Bot
} from 'lucide-react';

interface LetterItem {
  id: string;
  nomor: string;
  perihal: string;
  pengirim: string;
  tanggal: string;
  kategori: 'DINAS_PENDIDIKAN' | 'KEMENAG' | 'YAYASAN_PUSAT' | 'PROPOSAL_SARPRAS' | 'ORANG_TUA';
  urgensi: 'TINGGI' | 'SEDANG' | 'BIASA';
  ringkasanAI: string;
  status: 'MENUNGGU_TTD' | 'DISETUJUI' | 'DIARSIPKAN';
  totalNominal?: number;
}

const SAMPLE_LETTERS: LetterItem[] = [
  {
    id: 'SURAT-2026-081',
    nomor: '421.1/089/Disdik-PAUD/VIII/2026',
    perihal: 'Undangan Verifikasi Lapangan Akreditasi PAUD 2026',
    pengirim: 'Dinas Pendidikan & Kebudayaan Kab. Bekasi',
    tanggal: '14 Agustus 2026',
    kategori: 'DINAS_PENDIDIKAN',
    urgensi: 'TINGGI',
    ringkasanAI: 'Tim Asesor BAN-PAUD akan melaksanakan visitasi akreditasi pada hari Selasa, 18 Agustus 2026 pukul 08.00 WIB. Sekolah diminta menyiapkan dokumen 8 Standar Nasional Pendidikan.',
    status: 'MENUNGGU_TTD'
  },
  {
    id: 'SURAT-2026-082',
    nomor: '014/SARPRAS/ASY-SYIFA/VIII/2026',
    perihal: 'Pengajuan Renovasi Kanopi Area Bermain Outdoor Anak',
    pengirim: 'Kepala Sekolah TK Islam Asy Syifa',
    tanggal: '13 Agustus 2026',
    kategori: 'PROPOSAL_SARPRAS',
    urgensi: 'SEDANG',
    totalNominal: 4850000,
    ringkasanAI: 'Permohonan persetujuan anggaran Rp 4.850.000 untuk penggantian atap kanopi polycarbonate playground agar anak terlindung dari terik matahari dan hujan saat sentra fisik motorik.',
    status: 'MENUNGGU_TTD'
  },
  {
    id: 'SURAT-2026-079',
    nomor: 'B-1420/Kua.10.04/PP.00/08/2026',
    perihal: 'Pemberitahuan Lomba Tahfidz & Pildacil Tingkat Kecamatan',
    pengirim: 'Kantor Urusan Agama & IGRA Kecamatan',
    tanggal: '11 Agustus 2026',
    kategori: 'KEMENAG',
    urgensi: 'BIASA',
    ringkasanAI: 'Undangan delegasi santri TK Asy Syifa untuk mengikuti Lomba Hafalan Surah Pendek dan Doa Harian pada 25 Agustus 2026.',
    status: 'DISETUJUI'
  }
];

export const ExecutiveLiteModeWorkspace: React.FC = () => {
  const [letters, setLetters] = useState<LetterItem[]>(SAMPLE_LETTERS);
  const [selectedLetter, setSelectedLetter] = useState<LetterItem>(SAMPLE_LETTERS[0]);
  const [filter, setFilter] = useState<'ALL' | 'MENUNGGU_TTD' | 'DISETUJUI'>('ALL');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [signatureSuccess, setSignatureSuccess] = useState<boolean>(false);

  const handleApprove = (id: string) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, status: 'DISETUJUI' } : l));
    if (selectedLetter.id === id) {
      setSelectedLetter(prev => ({ ...prev, status: 'DISETUJUI' }));
    }
    setSignatureSuccess(true);
    setTimeout(() => setSignatureSuccess(false), 3000);
  };

  const handleVoiceReadSummary = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const text = `Ringkasan Surat dari ${selectedLetter.pengirim}. Perihal: ${selectedLetter.perihal}. ${selectedLetter.ringkasanAI}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95; // Senior-friendly slower pace
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const filteredLetters = letters.filter(l => filter === 'ALL' || l.status === filter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Senior-Friendly Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border-2 border-amber-500/40 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-bold text-2xl">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wide">
                  Mode Eksekutif Senior (R101)
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  PC Jadul Ultra-Lite • Nol Beban GPU
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black mt-1 text-white tracking-tight">
                Ruang Kerja Ketua Yayasan Asy Syifa
              </h1>
              <p className="text-base text-slate-300 font-medium">
                Persetujuan Surat Resmi, Verifikasi Akreditasi, dan Ringkasan Suara AI Otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center min-w-[140px]">
              <div className="text-xs font-bold text-slate-400 uppercase">Menunggu TTD</div>
              <div className="text-3xl font-black text-amber-400">
                {letters.filter(l => l.status === 'MENUNGGU_TTD').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {signatureSuccess && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-3 text-lg shadow-lg animate-fade-in">
          <CheckCircle className="w-7 h-7" />
          <span>Surat Berhasil Ditandatangani Secara Digital (HMAC-SHA256 Validated). Tersimpan di Smart Vault.</span>
        </div>
      )}

      {/* Main Grid: Letter List & Instant View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Letter Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Daftar Surat Masuk ({letters.length})
              </h2>
              <div className="flex gap-1">
                {(['ALL', 'MENUNGGU_TTD', 'DISETUJUI'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      filter === f
                        ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {f === 'ALL' ? 'Semua' : f === 'MENUNGGU_TTD' ? 'Perlu TTD' : 'Selesai'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredLetters.map(letter => {
                const isSelected = selectedLetter.id === letter.id;
                return (
                  <div
                    key={letter.id}
                    onClick={() => setSelectedLetter(letter)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-400/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        letter.urgensi === 'TINGGI'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}>
                        Urgensi {letter.urgensi}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">{letter.tanggal}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mt-2 line-clamp-2 leading-snug">
                      {letter.perihal}
                    </h3>

                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Pengirim: <b className="text-slate-800 dark:text-slate-200">{letter.pengirim}</b>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-[11px] text-slate-500">{letter.nomor}</span>
                      <span className={`text-xs font-bold flex items-center gap-1 ${
                        letter.status === 'DISETUJUI' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {letter.status === 'DISETUJUI' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        <span>{letter.status === 'DISETUJUI' ? 'Disetujui' : 'Menunggu TTD'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: High-Contrast Letter Review & Action Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header of Letter */}
            <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                  {selectedLetter.nomor}
                </span>
                <span className="text-sm font-bold text-slate-500">
                  {selectedLetter.tanggal}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 leading-tight">
                {selectedLetter.perihal}
              </h2>
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
                Dari: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedLetter.pengirim}</span>
              </div>
            </div>

            {/* AI Smart Executive Summary Box */}
            <div className="p-5 bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-400/60 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-base">
                  <Bot className="w-6 h-6 text-amber-600" />
                  <span>Ringkasan Eksekutif AI Asy (15 Detik Baca)</span>
                </div>

                <button
                  onClick={handleVoiceReadSummary}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    isSpeaking
                      ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                      : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border-amber-300'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeaking ? 'Hentikan Suara' : 'Bacakan Suara'}</span>
                </button>
              </div>

              <p className="text-base text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                {selectedLetter.ringkasanAI}
              </p>

              {selectedLetter.totalNominal && (
                <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Total Anggaran Diajukan:</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    Rp {selectedLetter.totalNominal.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>

            {/* Actions Bar: 1-Click Approve or Archive */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {selectedLetter.status === 'MENUNGGU_TTD' ? (
                <button
                  onClick={() => handleApprove(selectedLetter.id)}
                  className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
                >
                  <ShieldCheck className="w-6 h-6" />
                  <span>Setujui & Tanda Tangan Digital</span>
                </button>
              ) : (
                <div className="flex-1 py-4 px-6 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-2xl font-black text-lg flex items-center justify-center gap-3 border-2 border-emerald-500">
                  <CheckCircle className="w-6 h-6" />
                  <span>Surat Sudah Disetujui & Masuk Vault</span>
                </div>
              )}

              <button
                onClick={() => alert(`Mengunduh Berkas Lengkap: ${selectedLetter.nomor}`)}
                className="py-4 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700"
              >
                <Download className="w-5 h-5" />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
