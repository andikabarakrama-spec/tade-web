import React, { useEffect, useState } from 'react';
import { WebsiteProductionLock } from '../../types';
import { DataService } from '../../services/db';
import { Lock, Unlock, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ProductionLockManager: React.FC = () => {
  const [lock, setLock] = useState<WebsiteProductionLock | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    DataService.getProductionLock().then(setLock);
  }, []);

  if (!lock) return null;

  const handleToggleLock = async () => {
    if (lock.isLocked) {
      // Trying to unlock requires password confirmation
      if (password !== 'TADE2026') {
        setErrorMsg('Kata kunci pengaman Super Admin salah! (Gunakan: TADE2026)');
        return;
      }
    }

    setIsUpdating(true);
    setErrorMsg('');

    const newLockState: WebsiteProductionLock = {
      ...lock,
      isLocked: !lock.isLocked,
      updatedBy: 'Admin Utama (SIM TADE)',
      updatedAt: new Date().toLocaleDateString('id-ID')
    };

    await DataService.saveProductionLock(newLockState);
    setLock(newLockState);
    setIsUpdating(false);
    setShowConfirm(false);
    setPassword('');
  };

  return (
    <div className={`p-6 rounded-3xl border transition shadow-md ${
      lock.isLocked ? 'bg-slate-900 border-emerald-500/40 text-white' : 'bg-amber-950 border-amber-500/50 text-white'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl font-black shadow-md ${
            lock.isLocked ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
          }`}>
            {lock.isLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-black flex items-center gap-2">
              Website Production Lock
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                lock.isLocked ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
              }`}>
                {lock.isLocked ? 'PROTECTED (AKTIF)' : 'UNLOCKED (DANGER)'}
              </span>
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              {lock.isLocked
                ? 'Seluruh komponen utama website (Hero, Program, Guru, Footer) dilindungi dari penghapusan tidak disengaja.'
                : 'Mode pengaman mati! Komponen inti dapat diubah atau dihapus secara bebas.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirm(!showConfirm)}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-sm ${
            lock.isLocked
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {lock.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {lock.isLocked ? 'Buka Kunci Produksi' : 'Aktifkan Kunci Produksi'}
        </button>
      </div>

      {showConfirm && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 bg-white/5 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            Konfirmasi Perubahan Production Lock
          </div>

          {lock.isLocked && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-stone-300">
                Masukkan Kode Otorisasi Super Admin
              </label>
              <input
                type="password"
                placeholder="Kode Keamanan (TADE2026)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          )}

          {errorMsg && <p className="text-xs text-rose-400 font-bold">{errorMsg}</p>}

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLock}
              disabled={isUpdating}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs hover:bg-emerald-400 cursor-pointer"
            >
              {isUpdating ? 'Memproses...' : 'Ya, Ubah Status Production Lock'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-stone-700 text-white font-bold rounded-xl text-xs hover:bg-stone-600 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
