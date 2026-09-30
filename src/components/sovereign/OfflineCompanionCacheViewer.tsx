import React, { useState } from 'react';
import { 
  Database, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  Lock, 
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { OfflineCompanionCache, CompanionCachedItem, CacheSanitizationIncident } from '../../core/sovereign/offlineCompanionCache';

export const OfflineCompanionCacheViewer: React.FC = () => {
  const cacheService = OfflineCompanionCache.getInstance();
  const [items, setItems] = useState<CompanionCachedItem[]>(() => cacheService.getAllItems());
  const [incidents, setIncidents] = useState<CacheSanitizationIncident[]>(() => cacheService.getSanitizationIncidents());
  
  const [newKey, setNewKey] = useState('pref_font_size');
  const [newCategory, setNewCategory] = useState<CompanionCachedItem['category']>('PREFERENCE');
  const [newValue, setNewValue] = useState('{"fontSize": "normal", "highContrast": true}');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const refreshData = () => {
    setItems(cacheService.getAllItems());
    setIncidents(cacheService.getSanitizationIncidents());
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedValue: any = newValue;
      try {
        parsedValue = JSON.parse(newValue);
      } catch {
        parsedValue = newValue;
      }

      const res = cacheService.setItem(newKey, newCategory, parsedValue);
      setFeedback(res);
      refreshData();
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setFeedback({ success: false, message: `Error: ${err.message}` });
    }
  };

  const handleTestSensitiveRejection = (sampleKey: string, sampleVal: string) => {
    setNewKey(sampleKey);
    setNewValue(sampleVal);
    const res = cacheService.setItem(sampleKey, 'PREFERENCE', sampleVal);
    setFeedback(res);
    refreshData();
    setTimeout(() => setFeedback(null), 6000);
  };

  const handleRemove = (key: string) => {
    cacheService.removeItem(key);
    refreshData();
  };

  const totalBytes = items.reduce((acc, i) => acc + i.sizeBytes, 0);

  return (
    <div className="space-y-6" id="offline-companion-cache-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Companion Cache
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R765 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Offline Companion Cache & Privacy Filter
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Cache lokal responsif untuk preferensi, filter, layout, dan sapaan Digital Companion dengan proteksi penyaringan blacklist ketat (*Zero Sensitive Data Storage*).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
              Total Ukuran Cache: {(totalBytes / 1024).toFixed(2)} KB
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-lg ${
          feedback.success 
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
            : 'bg-rose-950/80 border-rose-500 text-rose-200'
        }`}>
          {feedback.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Blacklist Test Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Uji Coba Penolakan Blacklist Sensitif Guardian (Zero Leak Invariant)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Penolakan Tercatat: {incidents.length}</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleTestSensitiveRejection('user_password_hash', 'secret123456')}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Uji: &apos;user_password_hash&apos;</span>
          </button>
          <button
            onClick={() => handleTestSensitiveRejection('auth_jwt_token', 'Bearer eyJhbGciOi...')}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Uji: &apos;auth_jwt_token&apos;</span>
          </button>
          <button
            onClick={() => handleTestSensitiveRejection('nik_santri_payload', '3201234567890001')}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Uji: &apos;nik_santri_payload&apos;</span>
          </button>
          <button
            onClick={() => handleTestSensitiveRejection('payroll_guru_nominal', '{"gaji": 4500000}')}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Uji: &apos;payroll_guru_nominal&apos;</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Add Item + Items Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Add Safe Item */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-amber-400" />
            Tambah Safe UX Cache Item
          </h2>

          <form onSubmit={handleAddItem} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Kategori Safe Cache</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="PREFERENCE">PREFERENCE (Tema, Kepadatan UI)</option>
                <option value="FILTER">FILTER (Pilihan Sentra, Urutan Data)</option>
                <option value="LAYOUT">LAYOUT (Posisi Kartu, Panel)</option>
                <option value="GREETING">GREETING (Template Salam Ramah)</option>
                <option value="LAST_SAFE_VIEW">LAST_SAFE_VIEW (Sub-tab Terakhir)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Cache Key Name</label>
              <input
                type="text"
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Cache Value (JSON/String)</label>
              <textarea
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Simpan ke Safe Cache
            </button>
          </form>
        </div>

        {/* Cached Items Display */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              Item Cache Tersimpan ({items.length})
            </h2>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {items.map(item => (
              <div
                key={item.key}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300">{item.key}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.sizeBytes} bytes
                      </span>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-300 mt-1 bg-slate-900/90 p-2 rounded-lg overflow-x-auto">
                      {JSON.stringify(item.value, null, 2)}
                    </pre>
                  </div>

                  <button
                    onClick={() => handleRemove(item.key)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
