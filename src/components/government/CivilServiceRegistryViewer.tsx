import React, { useState } from 'react';
import { civilServiceRegistry, DigitalEmployee, EmployeeStatus } from '../../core/government/CivilServiceRegistry';
import { Users, CheckCircle, Clock, AlertTriangle, Shield, RefreshCw, Filter, Sparkles } from 'lucide-react';

export const CivilServiceRegistryViewer: React.FC = () => {
  const [employees, setEmployees] = useState<DigitalEmployee[]>(() => civilServiceRegistry.getEmployees());
  const [selectedMinistry, setSelectedMinistry] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handlePulse = () => {
    civilServiceRegistry.pulseAllEmployees();
    setEmployees([...civilServiceRegistry.getEmployees()]);
  };

  const handleStatusChange = (nip: string, status: EmployeeStatus) => {
    civilServiceRegistry.setEmployeeStatus(nip, status);
    setEmployees([...civilServiceRegistry.getEmployees()]);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchMin = selectedMinistry === 'ALL' || emp.ministryCode === selectedMinistry;
    const matchStatus = statusFilter === 'ALL' || emp.status === statusFilter;
    const matchQuery = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       emp.nip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMin && matchStatus && matchQuery;
  });

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3 h-3" /> Aktif Bekerja</span>;
      case 'IDLE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"><Clock className="w-3 h-3" /> Standby (Idle)</span>;
      case 'ASSISTING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"><Sparkles className="w-3 h-3" /> Membantu Lintas Min</span>;
      case 'RECOVERING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"><RefreshCw className="w-3 h-3" /> Sinkronisasi / Recovery</span>;
      case 'SUSPENDED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"><AlertTriangle className="w-3 h-3" /> Dinonaktifkan</span>;
    }
  };

  return (
    <div id="r615-civil-service-registry" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Sovereign Civil Service Registry & Workforce
                </h1>
                <span className="text-xs px-2 py-0.5 font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20">
                  R615 – R616
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Database Korps Pegawai Digital Sipil TADE yang beroperasi otonom di bawah 10 Kementerian Sektoral.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePulse}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Pulse Korps Digital
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Pegawai Digital</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{employees.length} Pegawai</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">100% Siap Otonom</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status Aktif Bekerja</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {employees.filter(e => e.status === 'ACTIVE').length} Unit
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">0 Overload</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tugas Diselesaikan Hari Ini</span>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {employees.reduce((acc, curr) => acc + curr.completedTasksToday, 0).toLocaleString()}
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">Efisiensi 99.9%</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pengawasan Konstitusi</span>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">Ring-0 Protected</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Jalur Sipil Terisolasi</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 w-full md:w-auto items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl">
          <Filter className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIP, nama pegawai digital, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Kementerian</option>
            <option value="MIN_PENDIDIKAN">Kementerian Pendidikan</option>
            <option value="MIN_KEUANGAN">Kementerian Keuangan</option>
            <option value="MIN_ADMINISTRASI">Kementerian Administrasi</option>
            <option value="MIN_PPDB">Kementerian PPDB</option>
            <option value="MIN_KOMUNIKASI">Kementerian Komunikasi</option>
            <option value="MIN_BANKING_OFFICE">Kementerian Banking Office</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Active</option>
            <option value="IDLE">Idle</option>
            <option value="ASSISTING">Assisting</option>
            <option value="RECOVERING">Recovering</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Grid of Digital Employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.nip}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {emp.nip}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                    Jenjang {emp.rank}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {emp.name}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {emp.jobTitle}
                </p>
              </div>
              {getStatusBadge(emp.status)}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {emp.jobDescription}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Atasan Langsung:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{emp.parentAssistantName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Kementerian:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{emp.ministryName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Beban Kerja:</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${emp.workloadScore}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{emp.workloadScore}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>{emp.completedTasksToday} task diproses</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(emp.nip, emp.status === 'ACTIVE' ? 'IDLE' : 'ACTIVE')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {emp.status === 'ACTIVE' ? 'Set Idle' : 'Set Active'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
