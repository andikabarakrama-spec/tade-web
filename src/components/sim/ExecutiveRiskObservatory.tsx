import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  Activity,
  Layers,
  Filter,
  Info
} from 'lucide-react';

interface StrategicRisk {
  id: string;
  category: 'OPERASIONAL' | 'SARPRAS' | 'KEUANGAN' | 'REPUTASI';
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'MITIGATED' | 'IN_PROGRESS' | 'MONITORING';
  mitigationStrategy: string;
  pic: string;
  reviewDate: string;
}

export const ExecutiveRiskObservatory: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const [risks] = useState<StrategicRisk[]>([
    {
      id: 'RSK-01',
      category: 'OPERASIONAL',
      title: 'Fluktuasi Cuaca Hujan Deras pada Jam Masuk Santri',
      description: 'Potensi penumpukan kendaraan di drop-zone dan keterlambatan pembukaan sentra pagi.',
      severity: 'MEDIUM',
      likelihood: 'MEDIUM',
      status: 'MITIGATED',
      mitigationStrategy: 'Penyediaan payung besar di 3 titik drop-zone dan kanopi lobi diperpanjang.',
      pic: 'Kepala Sekolah & Koordinator Sarpras',
      reviewDate: '15 Agustus 2026'
    },
    {
      id: 'RSK-02',
      category: 'KEUANGAN',
      title: 'Keterlambatan Pembayaran SPP Bulanan Wali Murid',
      description: 'Potensi deviasi arus kas operasional jika tagihan tidak dipantau secara berkala.',
      severity: 'LOW',
      likelihood: 'LOW',
      status: 'MITIGATED',
      mitigationStrategy: 'Otomasi WhatsApp reminder santun tanggal 10 dan opsi cicilan infaq terencana.',
      pic: 'Bendahara Yayasan',
      reviewDate: '10 Agustus 2026'
    },
    {
      id: 'RSK-03',
      category: 'SARPRAS',
      title: 'Pemadaman Listrik Bergilir dari Jaringan Pusat',
      description: 'Gangguan pendingin udara dan sistem absensi scan QR saat santri beraktivitas.',
      severity: 'MEDIUM',
      likelihood: 'LOW',
      status: 'IN_PROGRESS',
      mitigationStrategy: 'Sistem Dual-Power UPS untuk router internet dan genset otomatis 10kVA.',
      pic: 'Divisi Sarpras & IT',
      reviewDate: '20 Agustus 2026'
    },
    {
      id: 'RSK-04',
      category: 'REPUTASI',
      title: 'Keluhan Wali Murid Terkait Perkembangan Ananda di Luar Sekolah',
      description: 'Ketidakselarasan pembiasaan adab di rumah dan di madrasah tanpa komunikasi intensif.',
      severity: 'LOW',
      likelihood: 'LOW',
      status: 'MONITORING',
      mitigationStrategy: 'Pelaksanaan Parenting bulanan, Buku Penghubung digital, dan konsultasi privat.',
      pic: 'Tim Konseling & Wali Kelas',
      reviewDate: '12 Agustus 2026'
    }
  ]);

  const filteredRisks = selectedSeverity === 'ALL'
    ? risks
    : risks.filter(r => r.severity === selectedSeverity);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Executive Risk Observatory</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold font-mono">
                Strategic Governance
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Observatorium risiko strategis institusi: pemetaan dampak operasional, mitigasi aktif, timeline evaluasi pimpinan, dan pengawasan berbasis read-only.
            </p>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Filter Tingkat Risiko"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Semua Tingkat Risiko ({risks.length})</option>
            <option value="HIGH">Tinggi (High)</option>
            <option value="MEDIUM">Sedang (Medium)</option>
            <option value="LOW">Rendah (Low)</option>
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Total Risiko Terpetakan</span>
          <div className="text-2xl font-black text-slate-800">{risks.length} Faktor</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Memiliki Mitigasi Aktif
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Status Mitigasi Selesai</span>
          <div className="text-2xl font-black text-emerald-600">50% Tuntas</div>
          <span className="text-[10px] text-slate-500 font-medium">2 Mitigasi Selesai, 1 On-Going</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Risiko Kritis (High)</span>
          <div className="text-2xl font-black text-emerald-600">0 Kasus</div>
          <span className="text-[10px] text-emerald-600 font-medium">Operasional aman terkendali</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Indeks Resiliensi</span>
          <div className="text-2xl font-black text-indigo-600">98.4 / 100</div>
          <span className="text-[10px] text-slate-500 font-medium">Sangat Tangguh & Adaptif</span>
        </div>
      </div>

      {/* Risk Registry Matrix */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-700">Matriks Mitigasi Risiko Strategis & Operasional</h2>

        <div className="space-y-3">
          {filteredRisks.map((risk) => (
            <div key={risk.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono text-[10px] font-bold">
                    {risk.category}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800">{risk.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      risk.severity === 'HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : risk.severity === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Dampak: {risk.severity}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      risk.status === 'MITIGATED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {risk.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Rencana Mitigasi Aktif:
                </div>
                <p className="text-slate-600 text-[11px] pl-5">{risk.mitigationStrategy}</p>
                <div className="flex justify-between items-center pt-2 pl-5 text-[10px] text-slate-400 font-mono">
                  <span>PIC: {risk.pic}</span>
                  <span>Review Terakhir: {risk.reviewDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Read-Only Governance Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Modul ini beroperasi murni dalam mode Read-Only Governance untuk menjaga objektivitas penilaian dan isolasi data yayasan.
        </span>
      </div>
    </div>
  );
};
