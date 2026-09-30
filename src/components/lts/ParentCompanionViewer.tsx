import React, { useState } from 'react';
import { 
  Users, 
  Smartphone, 
  Bell, 
  CheckCircle2, 
  ShieldAlert, 
  Settings, 
  Send,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  parentCompanionFoundation, 
  ParentDevice, 
  ParentCompanionNotification 
} from '../../core/lts/ParentCompanionFoundation';

export const ParentCompanionViewer: React.FC = () => {
  const [state, setState] = useState(() => parentCompanionFoundation.getState());
  const [selectedParentId, setSelectedParentId] = useState<string>('PAR-8821');
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifMsg, setNewNotifMsg] = useState('');
  const [newNotifCategory, setNewNotifCategory] = useState<ParentCompanionNotification['category']>('ACADEMIC');
  const [newParentName, setNewParentName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');

  const currentPref = state.preferences[selectedParentId] || {
    parentId: selectedParentId,
    academicAlerts: true,
    attendanceArrivalAlerts: true,
    financialReceipts: true,
    boardingHealthAlerts: true,
    announcements: true,
    deliveryMode: 'REALTIME',
    quietHoursEnabled: true,
    quietHoursStart: '21:00',
    quietHoursEnd: '05:00'
  };

  const handleTogglePref = (key: keyof typeof currentPref) => {
    if (typeof currentPref[key] === 'boolean') {
      const updated = parentCompanionFoundation.updatePreferences(selectedParentId, {
        [key]: !currentPref[key]
      });
      setState({ ...parentCompanionFoundation.getState() });
    }
  };

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentName.trim() || !newStudentName.trim()) return;

    parentCompanionFoundation.registerDevice({
      parentId: `PAR-${Math.floor(1000 + Math.random() * 9000)}`,
      parentName: newParentName,
      studentId: `SAN-${Math.floor(100 + Math.random() * 900)}`,
      studentName: newStudentName,
      deviceType: 'MOBILE_ANDROID',
      browser: 'Chrome Mobile 128',
      os: 'Android 14',
      pwaInstalled: true,
      trustedStatus: 'TRUSTED'
    });

    setNewParentName('');
    setNewStudentName('');
    setState({ ...parentCompanionFoundation.getState() });
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim() || !newNotifMsg.trim()) return;

    parentCompanionFoundation.dispatchNotification(
      selectedParentId,
      state.devices.find(d => d.parentId === selectedParentId)?.studentName || 'Santri Binaan',
      newNotifCategory,
      newNotifTitle,
      newNotifMsg,
      'HIGH'
    );

    setNewNotifTitle('');
    setNewNotifMsg('');
    setState({ ...parentCompanionFoundation.getState() });
  };

  return (
    <div id="parent-companion-foundation-panel" className="space-y-6">
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="metric-companion-parents" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Wali Terdaftar</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{state.devices.length}</p>
          <span className="text-xs text-emerald-400 font-medium">100% No-WhatsApp Native</span>
        </div>

        <div id="metric-companion-devices" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">PWA Install Rate</span>
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{state.pwaInstallRatePercent}%</p>
          <span className="text-xs text-indigo-400 font-medium">Home-Screen Installed</span>
        </div>

        <div id="metric-companion-readiness" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Hub Readiness</span>
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{state.hubReadinessStatus}</p>
          <span className="text-xs text-amber-400 font-medium">Zero Vendor Lock-in</span>
        </div>

        <div id="metric-companion-notifications" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Notification Stream</span>
            <Bell className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{state.notifications.length} Msg</p>
          <span className="text-xs text-cyan-400 font-medium">Durable in Firestore SSoT</span>
        </div>
      </div>

      {/* Main Grid: Device Registry & Preference Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Registry (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-slate-100">Parent Device Registry (R655)</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                {state.devices.length} Active Devices
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                    <th className="py-2.5 px-3">Device ID / Wali</th>
                    <th className="py-2.5 px-3">Santri Binaan</th>
                    <th className="py-2.5 px-3">Perangkat & OS</th>
                    <th className="py-2.5 px-3">PWA Status</th>
                    <th className="py-2.5 px-3">Kesehatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {state.devices.map((device) => (
                    <tr 
                      key={device.deviceId} 
                      onClick={() => setSelectedParentId(device.parentId)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${selectedParentId === device.parentId ? 'bg-indigo-950/30' : ''}`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">{device.parentName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{device.deviceId} • {device.parentId}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-medium">{device.studentName}</td>
                      <td className="py-3 px-3 text-slate-400">{device.os} ({device.browser})</td>
                      <td className="py-3 px-3">
                        {device.pwaInstalled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Installed
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">Browser Only</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {device.deviceHealthRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Registration Form */}
            <form onSubmit={handleRegisterDevice} className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nama Wali Santri..."
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Nama Santri Binaan..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                id="btn-register-parent-device"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Daftarkan Wali PWA
              </button>
            </form>
          </div>

          {/* Notification Dispatch Simulation */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-slate-100">Companion Notification Hub</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Target: {selectedParentId}</span>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Judul Pemberitahuan..."
                  value={newNotifTitle}
                  onChange={(e) => setNewNotifTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <select
                  value={newNotifCategory}
                  onChange={(e) => setNewNotifCategory(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ACADEMIC">Akademik / Tahfidz</option>
                  <option value="ATTENDANCE">Presensi & Kehadiran</option>
                  <option value="FINANCIAL">Keuangan / Syahriah</option>
                  <option value="HEALTH">Kesehatan & Asrama</option>
                  <option value="BULLETIN">Pengumuman Pondok</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pesan notifikasi resmi untuk wali santri..."
                  value={newNotifMsg}
                  onChange={(e) => setNewNotifMsg(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  id="btn-send-companion-notif"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Hub
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {state.notifications.map((n) => (
                <div key={n.notificationId} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {n.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                    </div>
                    <p className="text-xs text-slate-400">{n.message}</p>
                    <div className="text-[10px] text-slate-500 font-mono">Untuk: {n.studentName} ({n.parentId})</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Preferences (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-slate-100">Preferensi Notifikasi</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">{selectedParentId}</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">Pemberitahuan Akademik & Tahfidz</span>
                <input
                  type="checkbox"
                  checked={currentPref.academicAlerts}
                  onChange={() => handleTogglePref('academicAlerts')}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">Pemberitahuan Kehadiran Sholat/Kelas</span>
                <input
                  type="checkbox"
                  checked={currentPref.attendanceArrivalAlerts}
                  onChange={() => handleTogglePref('attendanceArrivalAlerts')}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">Kuitansi Pembayaran Syahriah</span>
                <input
                  type="checkbox"
                  checked={currentPref.financialReceipts}
                  onChange={() => handleTogglePref('financialReceipts')}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">Pemberitahuan Kesehatan & Asrama</span>
                <input
                  type="checkbox"
                  checked={currentPref.boardingHealthAlerts}
                  onChange={() => handleTogglePref('boardingHealthAlerts')}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">Pengumuman & Buletin Pondok</span>
                <input
                  type="checkbox"
                  checked={currentPref.announcements}
                  onChange={() => handleTogglePref('announcements')}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Mode Hening Malam
                </span>
                <input
                  type="checkbox"
                  checked={currentPref.quietHoursEnabled}
                  onChange={() => handleTogglePref('quietHoursEnabled')}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
                />
              </div>
              {currentPref.quietHoursEnabled && (
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 font-mono">
                  {currentPref.quietHoursStart} s.d {currentPref.quietHoursEnd} WIB (Hanya notifikasi darurat lolos)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
