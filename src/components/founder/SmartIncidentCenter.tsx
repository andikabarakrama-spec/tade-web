import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  PlusCircle,
  Clock,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import {
  smartIncidentService,
  SmartIncident,
  IncidentCategory,
  IncidentSeverity
} from '../../services/smartIncidentService';

export const SmartIncidentCenter: React.FC = () => {
  const [incidents, setIncidents] = useState<SmartIncident[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = smartIncidentService.subscribe(updated => {
      setIncidents(updated);
    });
    return () => unsub();
  }, []);

  const handleResolve = (id: string) => {
    smartIncidentService.resolveIncident(id);
    setFeedback(`Insiden ${id} berhasil dinetralkan via Protokol Hermes.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAutoHealingAll = () => {
    const res = smartIncidentService.triggerAutoHealingAll();
    setFeedback(res.report);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSimulateIncident = () => {
    const newInc = smartIncidentService.reportIncident({
      category: 'UPLOAD_FAILURE',
      title: 'Peringatan Buffer Upload Media: Foto Sentra Terpotong',
      description: 'Koneksi seluler terputus saat pengunggahan dokumentasi proyek saintek kelompok B.',
      severity: 'MEDIUM',
      moduleCode: 'MEDIA-UPLOAD',
      affectedRole: 'GURU_SENTRA'
    });
    setFeedback(`Simulasi insiden baru (${newInc.id}) berhasil dibuat dan dicatat ke Black Box.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const activeIncidents = incidents.filter(i => i.status === 'DETECTED');
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED');

  const filteredActive = activeIncidents.filter(i =>
    filterSeverity === 'ALL' ? true : i.severity === filterSeverity
  );

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'HIGH':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'LOW':
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 border border-slate-800 p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 border border-rose-700 px-3 py-1 rounded-full">
              P4 • Smart Incident Center
            </span>
            <span className="text-xs bg-amber-950 text-amber-300 border border-amber-700 px-2.5 py-0.5 rounded-full font-bold">
              {activeIncidents.length} Insiden Aktif
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            Radar & Pemulihan Insiden Mandiri (Self-Healing)
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Deteksi otomatis kegagalan upload, macet notifikasi, konflik hak akses, atau keterbatasan kapasitas storage dengan integrasi Guardian ID, Black Box, Hermes Recovery, dan Dr. Pulse.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAutoHealingAll}
            disabled={activeIncidents.length === 0}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer ${
              activeIncidents.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Eksekusi Auto-Healing Massal</span>
          </button>
          <button
            onClick={handleSimulateIncident}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulasi Insiden</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active Incidents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Daftar Insiden Aktif yang Membutuhkan Pemulihan
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-semibold">Tingkat:</span>
            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-stone-300 text-xs bg-white font-medium"
            >
              <option value="ALL">Semua</option>
              <option value="CRITICAL">Kritis</option>
              <option value="HIGH">Tinggi</option>
              <option value="MEDIUM">Sedang</option>
              <option value="LOW">Rendah</option>
            </select>
          </div>
        </div>

        {filteredActive.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredActive.map(inc => (
              <div
                key={inc.id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${getSeverityBadge(inc.severity)}`}>
                      {inc.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">{inc.id}</span>
                    <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                      {inc.moduleCode}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">
                    Terdeteksi: {new Date(inc.detectedEpoch).toLocaleTimeString('id-ID')} WIB
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{inc.title}</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{inc.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                      Jalur Pemulihan Hermes (Recovery Path)
                    </div>
                    <p className="text-indigo-800 text-[11px] leading-relaxed">
                      {inc.hermesRecoveryPath}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      Resep Terapis Dr. Pulse
                    </div>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      {inc.drPulsePrescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="text-[11px] text-stone-500 font-mono">
                    Guardian Signature: <span className="font-bold text-slate-700">{inc.guardianThreatSignature}</span>
                  </div>
                  <button
                    onClick={() => handleResolve(inc.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Terapkan Pemulihan 1-Click</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-extrabold text-emerald-900">
              Radar Bersih • Nol Insiden Aktif
            </h4>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              Seluruh subsistem (Hermes, Dr. Pulse, Guardian, Black Box) beroperasi normal tanpa anomali terdeteksi.
            </p>
          </div>
        )}
      </div>

      {/* Resolved Incidents History */}
      {resolvedIncidents.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Riwayat Insiden yang Berhasil Dipulihkan ({resolvedIncidents.length})
          </h3>

          <div className="space-y-2 text-xs">
            {resolvedIncidents.map(res => (
              <div
                key={res.id}
                className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-3 text-stone-600"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-800">{res.id}</span>
                  <span className="font-bold text-slate-900">{res.title}</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  {res.resolutionNote || 'Dipulihkan'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
