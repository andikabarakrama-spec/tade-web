import React, { useState } from 'react';
import {
  HardDrive,
  ShieldCheck,
  Plus,
  Trash2,
  Lock,
  Eye,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { companionMemory } from '../../core/companion/companionMemory';
import { CompanionMemoryPreference, CompanionRole } from '../../core/companion/companionTypes';

export const CompanionMemoryViewer: React.FC = () => {
  const [preferences, setPreferences] = useState<CompanionMemoryPreference[]>(
    companionMemory.getAllPreferences()
  );
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [targetRole, setTargetRole] = useState<CompanionRole>('UNIVERSAL');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const refreshList = () => {
    setPreferences(companionMemory.getAllPreferences());
  };

  const handleAddPreference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    const success = companionMemory.setPreference(newKey.trim(), targetRole, newValue.trim());
    if (success) {
      setStatusMsg(`Preference "${newKey}" successfully saved to local companion memory.`);
      setNewKey('');
      setNewValue('');
      refreshList();
    } else {
      setStatusMsg(`BLOCKED: Key "${newKey}" violates Zero-Sensitive-PII policy!`);
    }

    setTimeout(() => setStatusMsg(null), 4000);
  };

  const filtered = selectedRole === 'ALL'
    ? preferences
    : preferences.filter(p => p.role === selectedRole);

  return (
    <div className="space-y-6" id="companion-memory-view">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl border border-teal-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R754 Local Preference Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Zero Sensitive Cache
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <HardDrive className="w-7 h-7 text-teal-400" />
              Companion Memory Manager
            </h1>
            <p className="text-sm text-teal-200/80 mt-1 max-w-2xl">
              Penyimpanan preferensi tampilan & UX lokal: menyimpan gaya sapaan dan filter aktif tanpa mengekspos data sensitif atau kredensial di luar SSoT.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshList}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Cache
            </button>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
            statusMsg.includes('BLOCKED')
              ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {statusMsg.includes('BLOCKED') ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <div>{statusMsg}</div>
        </div>
      )}

      {/* Form: Add Safe Preference */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-slate-100 text-base mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-400" /> Tambah Preferensi Baru (Sanitized)
        </h3>
        <form onSubmit={handleAddPreference} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Key (e.g. parent_theme_compact)"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <input
            type="text"
            placeholder="Value (e.g. true / ISLAMIC_WARM)"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value as CompanionRole)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="UNIVERSAL">Target: UNIVERSAL</option>
            <option value="PARENT">Target: PARENT</option>
            <option value="TEACHER">Target: TEACHER</option>
            <option value="EXECUTIVE">Target: EXECUTIVE</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30"
          >
            <Plus className="w-4 h-4" /> Simpan Memory
          </button>
        </form>
      </div>

      {/* Preferences Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            Preferensi Aktif ({filtered.length})
          </h3>
          <div className="flex gap-2">
            {['ALL', 'PARENT', 'TEACHER', 'EXECUTIVE', 'UNIVERSAL'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  selectedRole === role
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Memory Key</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Safety Status</th>
                <th className="py-3 px-4">Terakhir Diperbarui</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((pref, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-200">{pref.key}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {pref.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400">{JSON.stringify(pref.preferenceValue)}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max text-[11px] font-semibold">
                      <CheckCircle className="w-3 h-3" /> Safe / Non-PII
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{pref.updatedAt.split('T')[0]} {pref.updatedAt.split('T')[1]?.substring(0, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
