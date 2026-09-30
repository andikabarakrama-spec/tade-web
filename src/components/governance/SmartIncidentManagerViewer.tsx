import React, { useState, useEffect } from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert, Plus, Zap, Check, Search } from 'lucide-react';
import { GuardianPolicyEngine, SmartIncident } from '../../core/governance/guardianPolicyEngine';

export const SmartIncidentManagerViewer: React.FC = () => {
  const [incidents, setIncidents] = useState<SmartIncident[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCause, setNewCause] = useState('');
  const [newSeverity, setNewSeverity] = useState<SmartIncident['severity']>('P3_MEDIUM');

  useEffect(() => {
    const engine = GuardianPolicyEngine.getInstance();
    setIncidents(engine.getIncidents());
    return engine.subscribe(() => {
      setIncidents(engine.getIncidents());
    });
  }, []);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    GuardianPolicyEngine.getInstance().reportIncident(newTitle, newSeverity, newCause || 'Anomali terdeteksi oleh pengawas');
    setNewTitle('');
    setNewCause('');
    setShowReportModal(false);
  };

  return (
    <div id="smart-incident-manager-root" className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4" /> R855 • Manajemen Insiden Tanggap Cepat
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Smart Incident Manager</h1>
            <p className="text-slate-300 text-sm mt-1">
              Pusat deteksi, isolasi, mitigasi otomatis, dan resolusi anomali operasional sekolah dengan SLA 10 Menit Emas.
            </p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Laporkan Anomali / Insiden
          </button>
        </div>
      </div>

      {/* Incident Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Insiden Terbuka</div>
          <div className="text-2xl font-black text-rose-600">0</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Semua sistem terkendali</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Auto-Mitigated</div>
          <div className="text-2xl font-black text-blue-600">100%</div>
          <div className="text-[11px] text-blue-600 font-semibold">Mitigasi otomatis aktif</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Rata-rata Resolusi</div>
          <div className="text-2xl font-black text-emerald-600">1.2 Menit</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Di bawah batas 10 menit</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Tingkat Ketahanan</div>
          <div className="text-2xl font-black text-purple-700">100%</div>
          <div className="text-[11px] text-purple-600 font-semibold">Guardian Ring-0 Verified</div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Daftar Rekam Insiden & Mitigasi</h3>
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {inc.id}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    inc.severity === 'P1_CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : inc.severity === 'P2_HIGH'
                      ? 'bg-orange-100 text-orange-800'
                      : inc.severity === 'P3_MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {inc.severity}
                </span>
                <span className="text-xs text-slate-400">Terdeteksi: {inc.detectedAt}</span>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5" /> {inc.status}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900">{inc.title}</h4>
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Akar Masalah:</span> {inc.rootCause}
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Tindakan Mitigasi yang Diterapkan:
              </div>
              {inc.mitigationSteps.map((step, sIdx) => (
                <div key={sIdx} className="text-xs text-slate-600 flex items-center gap-2">
                  <Check className="w-3 h-3 text-emerald-600" /> {step}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Report Incident */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Laporkan Anomali / Insiden</h3>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Judul Insiden</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Gangguan pembacaan barcode presensi santri"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tingkat Keparahan</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as SmartIncident['severity'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="P4_LOW">P4 - Low (Gangguan minor tanpa henti layanan)</option>
                  <option value="P3_MEDIUM">P3 - Medium (Pengurangan kenyamanan sebagian fitur)</option>
                  <option value="P2_HIGH">P2 - High (Fitur utama terhambat sementara)</option>
                  <option value="P1_CRITICAL">P1 - Critical (Kritis seluruh sekolah)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dugaan Penyebab</label>
                <textarea
                  placeholder="Jelaskan detail anomali atau pesan error yang muncul..."
                  value={newCause}
                  onChange={(e) => setNewCause(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
