import React, { useState } from 'react';
import { LicenseDashboard } from '../license/LicenseDashboard';
import { SuperAdminLicenseCenter } from '../license/SuperAdminLicenseCenter';
import { SafeModeNotice } from '../license/SafeModeNotice';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, ShieldCheck, Sparkles } from 'lucide-react';

export const R56EnterpriseLicenseManager: React.FC = () => {
  const { userProfile } = useAuth();
  const isSuperAdmin = userProfile?.role === 'SUPER_ADMIN';
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SUPER_ADMIN_CENTER'>('DASHBOARD');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
              MODUL R56 • FX-9
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">LTS v1.0.5</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <KeyRound className="w-7 h-7 text-amber-500" />
            <span>Enterprise License, Trial, Rental & Subscription Engine</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pusat manajemen lisensi resmi TK Islam Asy-Syifatan (Trial, Rental, Subscription, Lifetime & Enterprise) dengan Safe Mode Protection.
          </p>
        </div>

        {/* View Switcher for Super Admin */}
        {isSuperAdmin && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'DASHBOARD'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Dashboard Lisensi</span>
            </button>
            <button
              onClick={() => setActiveTab('SUPER_ADMIN_CENTER')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'SUPER_ADMIN_CENTER'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Super Admin Center</span>
            </button>
          </div>
        )}
      </div>

      {/* Safe Mode Notice Banner */}
      <SafeModeNotice onOpenLicenseCenter={() => setActiveTab('SUPER_ADMIN_CENTER')} />

      {/* Render Main Selected View */}
      {activeTab === 'SUPER_ADMIN_CENTER' && isSuperAdmin ? (
        <SuperAdminLicenseCenter />
      ) : (
        <LicenseDashboard onOpenSuperAdminCenter={() => setActiveTab('SUPER_ADMIN_CENTER')} />
      )}
    </div>
  );
};
