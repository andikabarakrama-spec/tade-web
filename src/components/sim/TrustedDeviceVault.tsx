import React, { useState } from 'react';
import {
  Laptop,
  Smartphone,
  ShieldCheck,
  KeyRound,
  Trash2,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Fingerprint,
  Radio,
  Lock
} from 'lucide-react';

export interface TrustedDevice {
  id: string;
  deviceName: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'HARDWARE_KEY';
  os: string;
  browser: string;
  registeredAt: string;
  lastActive: string;
  status: 'ACTIVE' | 'REVOKED' | 'CHALLENGE_PENDING';
  hardwareEnclave: string;
  isCurrentDevice: boolean;
}

const INITIAL_TRUSTED_DEVICES: TrustedDevice[] = [
  {
    id: 'DEV-ROOT-01',
    deviceName: 'MacBook Pro M3 Max (Command Central)',
    deviceType: 'DESKTOP',
    os: 'macOS Sequoia 15.0',
    browser: 'Safari 18.0 (Secure Enclave Passkey)',
    registeredAt: '2026-01-01 08:00 WIB',
    lastActive: 'Sedang Aktif Sekarang',
    status: 'ACTIVE',
    hardwareEnclave: 'Apple T2/M3 Secure Enclave (HW-PASSKEY-0912)',
    isCurrentDevice: true
  },
  {
    id: 'DEV-ROOT-02',
    deviceName: 'iPhone 16 Pro Max (Mobile Sentinel)',
    deviceType: 'MOBILE',
    os: 'iOS 18.1',
    browser: 'TADE Guardian Mobile Authenticator',
    registeredAt: '2026-02-15 10:20 WIB',
    lastActive: '12 menit lalu',
    status: 'ACTIVE',
    hardwareEnclave: 'iOS Secure Enclave FaceID Level-3',
    isCurrentDevice: false
  },
  {
    id: 'DEV-ROOT-03',
    deviceName: 'YubiKey 5C NFC (Physical Cold Key)',
    deviceType: 'HARDWARE_KEY',
    os: 'FIDO2 / WebAuthn Tier-4',
    browser: 'Hardware Token Slot #1',
    registeredAt: '2026-01-05 14:00 WIB',
    lastActive: '1 hari lalu (Break-Glass Check)',
    status: 'ACTIVE',
    hardwareEnclave: 'Yubico EAL6+ Cryptographic Microcontroller',
    isCurrentDevice: false
  }
];

export const TrustedDeviceVault: React.FC = () => {
  const [devices, setDevices] = useState<TrustedDevice[]>(INITIAL_TRUSTED_DEVICES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'DESKTOP' | 'MOBILE' | 'HARDWARE_KEY'>('HARDWARE_KEY');
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleRevoke = (id: string) => {
    setDevices(prev =>
      prev.map(dev => (dev.id === id ? { ...dev, status: 'REVOKED' as const } : dev))
    );
    setRevokingId(null);
  };

  const handleRegisterNewPasskey = () => {
    if (!newDeviceName.trim()) return;
    const newDev: TrustedDevice = {
      id: `DEV-ROOT-0${devices.length + 1}`,
      deviceName: newDeviceName.trim(),
      deviceType: newDeviceType,
      os: 'FIDO2 / Hardware Security Enclave',
      browser: 'WebAuthn Passkey Biometric',
      registeredAt: new Date().toLocaleString('id-ID'),
      lastActive: 'Baru Didaftarkan',
      status: 'ACTIVE',
      hardwareEnclave: `Secured Hardware Vault #${Math.floor(1000 + Math.random() * 9000)}`,
      isCurrentDevice: false
    };

    setDevices([...devices, newDev]);
    setNewDeviceName('');
    setShowAddModal(false);
  };

  const getDeviceIcon = (type: TrustedDevice['deviceType']) => {
    switch (type) {
      case 'MOBILE':
        return <Smartphone className="w-5 h-5 text-indigo-400" />;
      case 'HARDWARE_KEY':
        return <KeyRound className="w-5 h-5 text-amber-400" />;
      default:
        return <Laptop className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-100">Trusted Device & Hardware Passkey Vault</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  FIDO2 / WEBAUTHN TIER-4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Akses Sovereign Root Super Admin hanya diizinkan melalui perangkat keras terverifikasi dengan Enclave Kriptografis.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-emerald-900/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Daftarkan Kunci FIDO2 / Passkey</span>
          </button>
        </div>
      </div>

      {/* Grid Perangkat Terdaftar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-sm transition-all relative ${
              device.isCurrentDevice
                ? 'border-emerald-500 dark:border-emerald-500/80 ring-1 ring-emerald-500/30'
                : device.status === 'REVOKED'
                ? 'border-slate-200 dark:border-slate-800 opacity-60'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {device.isCurrentDevice && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                PERANGKAT SAAT INI
              </span>
            )}

            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {getDeviceIcon(device.deviceType)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{device.deviceName}</h4>
                <span className="text-[11px] font-mono text-slate-500">{device.id}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">OS / Platform:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{device.os}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enclave Attestation:</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{device.hardwareEnclave}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aktivitas Terakhir:</span>
                <span className="font-medium">{device.lastActive}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Status Otorisasi:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    device.status === 'ACTIVE'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                  }`}
                >
                  {device.status === 'ACTIVE' ? 'TERAUTENTIKASI' : 'DICABUT (REVOKED)'}
                </span>
              </div>
            </div>

            {!device.isCurrentDevice && device.status === 'ACTIVE' && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setRevokingId(device.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cabut Izin (Revoke)</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Tambah Kunci Passkey */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <KeyRound className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="font-bold text-base text-slate-100">Daftarkan Hardware Security Key / Passkey</h4>
                <p className="text-xs text-slate-400">WebAuthn Tier-4 Hardware Attestation</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Label Perangkat</label>
                <input
                  type="text"
                  placeholder="Contoh: YubiKey 5 NFC Backup #2 / iPad Pro Sentinel"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tipe Hardware Enclave</label>
                <select
                  value={newDeviceType}
                  onChange={(e) => setNewDeviceType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="HARDWARE_KEY">Physical Security Key (YubiKey / Nitrokey / Titan)</option>
                  <option value="DESKTOP">Workstation Secure Enclave (Apple Silicon / TPM 2.0)</option>
                  <option value="MOBILE">Mobile Biometric Enclave (iOS FaceID / Android StrongBox)</option>
                </select>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-400 text-[11px]">
                <span className="font-bold text-slate-200 block mb-1">Syarat Keamanan Root:</span>
                Setiap pendaftaran perangkat baru akan memicu tantangan biometrik lokal dan mencatat hash publik ke dalam Sovereign Root Registry.
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleRegisterNewPasskey}
                disabled={!newDeviceName.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Simpan Kunci</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi Revoke */}
      {revokingId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-800 text-slate-100 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertOctagon className="w-6 h-6" />
              <h4 className="font-bold text-base text-slate-100">Cabut Akses Perangkat?</h4>
            </div>
            <p className="text-xs text-slate-300">
              Perangkat <span className="font-mono font-bold text-amber-300">{revokingId}</span> akan langsung diblokir dari seluruh session Root Super Admin.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setRevokingId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => handleRevoke(revokingId)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Cabut Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
