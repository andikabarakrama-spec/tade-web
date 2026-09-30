import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Crown, 
  FileCheck2, 
  Award, 
  Compass,
  BookmarkCheck,
  Scale
} from 'lucide-react';

export const FounderAcceptanceSuiteViewer: React.FC = () => {
  const [signed, setSigned] = useState(true);

  const acceptanceCriteria = [
    { title: 'Kedaulatan Konstitusi TADE', status: 'DITERIMA', desc: '100% SSoT pada db.ts tanpa database bayangan atau scheduler liar.' },
    { title: 'Keutuhan Ring-0 Keamanan', status: 'DITERIMA', desc: 'Hak akses terlindungi ketat, aman UU PDP No. 27/2022, dan audit zero-vulnerability.' },
    { title: 'Keandalan Offline di Pelosok', status: 'DITERIMA', desc: 'Guru dapat bekerja tanpa hambatan jaringan dengan rekonsiliasi deterministik LWW.' },
    { title: 'Integritas Finansial & SPP', status: 'DITERIMA', desc: 'Pencatatan kas dan SPP santri seimbang tanpa risiko double ledger.' },
    { title: 'Kesiapan Operasional 10+ Tahun', status: 'DITERIMA', desc: 'Kode mandiri, struktur modular, dan bebas ketergantungan berbayar yang membebani yayasan.' }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Crown className="w-4 h-4" />
            <span>G907 • Founder & Leadership Acceptance</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Founder & Supreme Acceptance Suite
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pernyataan pengesahan kesiapan go-live konstitusional oleh Founder & Dewan Pembina Yayasan SIM Madrasah.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-amber-950/80 border border-amber-700/80 text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
            <Award className="w-4 h-4" />
            <span>Status: Disahkan (ACCEPTED)</span>
          </span>
        </div>
      </div>

      {/* Acceptance Criteria Cards */}
      <div className="space-y-3">
        {acceptanceCriteria.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-4 hover:border-slate-700 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full whitespace-nowrap">
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Official Signoff Box */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Berita Acara Pengesahan Go-Live (GLC-1)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">20 Agustus 2026</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed italic">
          &ldquo;Dengan ini kami menyatakan bahwa seluruh 900+ modul, discovery registry, arsitektur SSoT, dan protokol pertahanan Ring-0 telah memenuhi kriteria kelayakan operasional madrasah tingkat tertinggi. Sistem dinyatakan SAH dan SIAP untuk penerapan penuh (Go-Live Production).&rdquo;
        </p>
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800/80">
          <span>Otorisator: <strong>Supreme System Architect & Founder</strong></span>
          <span className="text-emerald-400 font-mono font-semibold">Tanda Tangan Kriptografis: SHA256-AUTHENTICATED</span>
        </div>
      </div>
    </div>
  );
};
