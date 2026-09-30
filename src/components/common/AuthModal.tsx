import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import { LogIn, UserPlus, Lock, Mail, Phone, User, Shield, AlertCircle, CheckCircle, X, CheckSquare, Square } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onTabChange?: (tab: string) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, defaultMode = 'login', onTabChange }) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNomorHP, setRegNomorHP] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createdRegNo, setCreatedRegNo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const t0 = performance.now();
    console.log(`[LOGIN-01] [${t0.toFixed(2)}ms] handleLogin START`);
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setCreatedRegNo(null);

    try {
      const res = await loginWithEmail(loginEmail, loginPassword);
      setLoading(false);

      if (res.success) {
        const t1 = performance.now();
        console.log(`[LOGIN-10] [${t1.toFixed(2)}ms] AuthModal received SUCCESS`);
        console.log(`[LOGIN-11] [${performance.now().toFixed(2)}ms] onClose`);
        onClose();
        if (onTabChange) {
          console.log(`[LOGIN-12] [${performance.now().toFixed(2)}ms] onTabChange r1`);
          onTabChange('r1');
        }
      } else if (res.isPending) {
        setErrorMessage(res.error || 'Akun sedang menunggu proses verifikasi Administrator.');
      } else {
        setErrorMessage(res.error || 'Login gagal. Periksa email dan password Anda.');
      }
    } catch (err: any) {
      console.error('[LOGIN-ERR] handleLogin catch:', err);
      setLoading(false);
      setErrorMessage(err?.message || 'Terjadi kesalahan pada proses login.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNama || !regEmail || !regNomorHP || !regPassword || !regConfirmPassword) {
      setErrorMessage('Mohon lengkapi semua kolom pendaftaran.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    if (!agreePrivacy) {
      setErrorMessage('Anda harus menyetujui kebijakan privasi.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Public Registration strictly assigns role 'CALON_WALI_MURID'
    const res = await registerWithEmail({
      nama: regNama,
      email: regEmail,
      password: regPassword,
      nomorHP: regNomorHP,
      role: 'CALON_WALI_MURID'
    });

    setLoading(false);

    if (res.success) {
      const generatedNo = `PPDB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setCreatedRegNo(generatedNo);

      // Save record to DB for PPDB verification tracking
      await DataService.savePPDBRecord({
        id: `ppdb-${Date.now()}`,
        registrationNo: generatedNo,
        studentName: regNama,
        nickname: regNama.split(' ')[0],
        nik: regNomorHP.substring(0, 16) || '3509123456780001',
        birthPlace: 'Jember',
        birthDate: '2021-01-01',
        gender: 'Laki-laki',
        religion: 'Islam',
        address: 'Tanggul, Jember',
        distanceKm: 1.0,
        groupChoice: 'Kelompok A',
        fatherName: regNama,
        fatherJob: '-',
        motherName: '-',
        motherJob: '-',
        phone: regNomorHP,
        status: 'Menunggu',
        registeredAt: new Date().toISOString().split('T')[0],
        wave: 'Gelombang 1',
        isPaidFee: false,
        notes: 'Pendaftaran PPDB Online via Website Portal'
      });
    } else {
      setErrorMessage(res.error || 'Gagal mendaftar PPDB. Silakan coba lagi.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      onClose();
      if (onTabChange) {
        onTabChange('r1');
      }
    } else if (res.isPending) {
      setErrorMessage(res.error || 'Akun sedang menunggu proses verifikasi Administrator.');
    } else {
      setErrorMessage(res.error || 'Login Google gagal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-xs font-bold transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                {mode === 'register' ? '🌸 PPDB Online TK Asy Syifa Tanggul' : 'Masuk Portal SIM TADE'}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug font-medium">
                {mode === 'register'
                  ? 'Selamat datang Ayah & Bunda. Silakan isi data berikut untuk memulai pendaftaran putra-putri tercinta.'
                  : 'Sistem Informasi Manajemen TK Asy Syifa Tanggul'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        {!createdRegNo && (
          <div className="flex bg-stone-100 p-1 rounded-2xl font-semibold text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
                setCreatedRegNo(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-emerald-950 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Masuk Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
                setSuccessMessage('');
                setCreatedRegNo(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Daftar PPDB
            </button>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && !createdRegNo && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{successMessage}</p>
            </div>
          </div>
        )}

        {/* SUCCESS REGISTRATION SCREEN */}
        {createdRegNo ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto border-2 border-amber-300 shadow-xs">
              🌸
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900">
                Alhamdulillah.
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-semibold max-w-sm mx-auto">
                Data Ayah & Bunda telah berhasil dikirim. Silakan menunggu proses verifikasi dari Admin TK Asy Syifa.
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl space-y-1 text-center">
              <span className="text-[10px] uppercase font-black text-amber-900 tracking-wider">
                Nomor Registrasi
              </span>
              <div className="text-2xl font-black text-emerald-900 tracking-wider font-mono">
                {createdRegNo}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onTabChange) onTabChange('w4');
                }}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                Lihat Status PPDB
              </button>

              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin%20TK%20Asy%20Syifa,%20saya%20ingin%20menanyakan%20status%20PPDB%20dengan%20Nomor%20Registrasi%20${createdRegNo}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                Hubungi Admin
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onTabChange) onTabChange('w1');
                }}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold rounded-xl transition text-xs cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-stone-400" /> Email Resmi
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-stone-400" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Memproses...' : 'Masuk Akun'}
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
                  <span className="relative bg-white px-3 text-[11px] text-stone-400 font-semibold">atau</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-300 text-slate-700 font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Masuk dengan Google
                </button>
              </form>
            )}

            {/* REGISTER PPDB FORM (NO ROLE DROPDOWN, AUTOMATIC CALON_WALI_MURID) */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" /> Nama Lengkap (Ayah / Bunda)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sesuai KTP / KK"
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-stone-400" /> Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" /> Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={regNomorHP}
                    onChange={(e) => setRegNomorHP(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-stone-400" /> Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min. 6 Karakter"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-stone-400" /> Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Ulangi Password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Privacy Policy Checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Saya menyetujui kebijakan privasi.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  {loading ? 'Mengirim Data...' : 'DAFTAR PPDB'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
