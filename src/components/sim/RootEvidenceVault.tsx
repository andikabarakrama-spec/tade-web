import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Terminal,
  Clock,
  Laptop,
  Fingerprint,
  RefreshCw
} from 'lucide-react';

export interface RootAuditEvent {
  id: string;
  timestamp: string;
  eventType: 'SUSPICIOUS_LOGIN' | 'NEW_DEVICE' | 'PASSWORD_CHANGE' | 'EMAIL_CHANGE' | 'RBAC_BYPASS_ATTEMPT' | 'INVALID_TOKEN' | 'ROOT_PROTECT_TRIGGER';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  actor: string;
  ipAddress: string;
  location: string;
  deviceInfo: string;
  fingerprintHash: string;
  actionTaken: string;
  status: 'BLOCKED' | 'RESOLVED' | 'UNDER_REVIEW';
  evidencePayload: string;
}

const INITIAL_EVIDENCE_LOGS: RootAuditEvent[] = [
  {
    id: 'EVD-2026-0814-001',
    timestamp: '2026-08-14 15:42:10 WIB',
    eventType: 'RBAC_BYPASS_ATTEMPT',
    severity: 'CRITICAL',
    actor: 'admin-melati-02 (Attempted Privilege Escalation)',
    ipAddress: '103.111.45.19',
    location: 'Surabaya, ID',
    deviceInfo: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    fingerprintHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    actionTaken: 'Auto-Blocked by Guardian Core: Direct mutation to /system/roles rejected. Account token revoked.',
    status: 'BLOCKED',
    evidencePayload: '{"mutation":"UPDATE users SET role=\'SUPER_ADMIN\' WHERE id=\'usr_981\'","guardTriggered":"SOVEREIGN_ROOT_PROTECTION_V11"}'
  },
  {
    id: 'EVD-2026-0814-002',
    timestamp: '2026-08-14 14:15:33 WIB',
    eventType: 'INVALID_TOKEN',
    severity: 'HIGH',
    actor: 'unknown-client',
    ipAddress: '185.220.101.5',
    location: 'Frankfurt, DE (Tor Exit Node)',
    deviceInfo: 'Python-requests/2.31.0',
    fingerprintHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    actionTaken: 'Signature Mismatch on Sovereign Root Key: Ingress dropped with 403 Forbidden.',
    status: 'BLOCKED',
    evidencePayload: '{"header":"Bearer eyJhbGciOiJub25lIn0...","reason":"Unsigned root claiming token rejected"}'
  },
  {
    id: 'EVD-2026-0814-003',
    timestamp: '2026-08-14 11:02:40 WIB',
    eventType: 'NEW_DEVICE',
    severity: 'MEDIUM',
    actor: 'superadmin@tade.id',
    ipAddress: '114.122.39.88',
    location: 'Jakarta, ID (Telkomsel Enterprise)',
    deviceInfo: 'MacBook Pro M3 Max / macOS 15.0 / Safari 18.0',
    fingerprintHash: 'sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    actionTaken: 'Hardware 2FA Biometric Challenge via WebAuthn/Passkey: Successfully Verified.',
    status: 'RESOLVED',
    evidencePayload: '{"webAuthnAttestation":"VALID_PASSKEY","rootEnclaveId":"ENCLAVE_ROOT_01"}'
  },
  {
    id: 'EVD-2026-0813-094',
    timestamp: '2026-08-13 22:50:11 WIB',
    eventType: 'SUSPICIOUS_LOGIN',
    severity: 'CRITICAL',
    actor: 'superadmin-alias-probe',
    ipAddress: '45.154.255.89',
    location: 'Vilnius, LT',
    deviceInfo: 'Go-http-client/1.1 (Automated Brute Probe)',
    fingerprintHash: 'sha256:18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4',
    actionTaken: 'Rate-Limit Lockdown: IP blacklisted for 72 hours across all tenant gateways.',
    status: 'BLOCKED',
    evidencePayload: '{"attempts":25,"targetEndpoint":"/api/auth/sovereign-root","defense":"RATE_LIMIT_FIREWALL"}'
  },
  {
    id: 'EVD-2026-0813-050',
    timestamp: '2026-08-13 09:12:00 WIB',
    eventType: 'ROOT_PROTECT_TRIGGER',
    severity: 'HIGH',
    actor: 'backup-restore-agent',
    ipAddress: 'Internal System Worker (Worker #3)',
    location: 'Cloud Ingress Internal',
    deviceInfo: 'TADE Recovery Worker v8.3',
    fingerprintHash: 'sha256:d82c4d7f0f48f20ec78b3b79e300add812edab13fa240b6631502f80a3451409',
    actionTaken: 'Root Immutability Enforced: Sovereign Root user record bypassed from database snapshot restore.',
    status: 'RESOLVED',
    evidencePayload: '{"action":"RESTORE_SNAPSHOT","omittedRecords":["usr_sovereign_root_master"],"reason":"CONSTITUTION_RULE_NO_OVERWRITE_ROOT"}'
  }
];

export const RootEvidenceVault: React.FC = () => {
  const [logs, setLogs] = useState<RootAuditEvent[]>(INITIAL_EVIDENCE_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<RootAuditEvent | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionTaken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: RootAuditEvent['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-stone-500/20 text-stone-400 border-stone-500/40';
    }
  };

  const getStatusBadge = (status: RootAuditEvent['status']) => {
    switch (status) {
      case 'BLOCKED':
        return 'bg-red-950/60 text-red-300 border-red-800';
      case 'RESOLVED':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
      default:
        return 'bg-amber-950/60 text-amber-300 border-amber-800';
    }
  };

  const exportEvidenceAuditChain = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TADE_SOVEREIGN_ROOT_EVIDENCE_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-100">Root Evidence & Tamper-Proof Audit Vault</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                  IMMUTABLE MERKLE TREE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Setiap event keamanan Sovereign Root tercatat secara permanen dengan cryptographic checksum sha256.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportEvidenceAuditChain}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Export Audit Trail (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID, IP, actor, payload..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Event ID & Timestamp</th>
                <th className="py-3 px-4">Tipe Insiden</th>
                <th className="py-3 px-4">Actor & Lokasi IP</th>
                <th className="py-3 px-4">Aksi Guardian Core</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{log.id}</div>
                    <div className="flex items-center text-[11px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3 mr-1" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSeverityBadge(log.severity)}`}>
                        {log.severity}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                        {log.eventType}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{log.actor}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Terminal className="w-3 h-3 text-slate-500" />
                      <span>{log.ipAddress} ({log.location})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate" title={log.actionTaken}>
                      {log.actionTaken}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedEvent(log)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                    >
                      Buka Bukti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Event */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Fingerprint className="w-5 h-5 text-red-400" />
                <h4 className="font-bold text-base text-slate-100">Cryptographic Evidence Artifact</h4>
              </div>
              <span className="font-mono text-xs text-red-400 bg-red-950/60 px-2.5 py-1 rounded border border-red-800">
                {selectedEvent.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-semibold block">Incident Type</span>
                <span className="font-bold text-slate-200 text-sm mt-0.5 block">{selectedEvent.eventType}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-semibold block">Timestamp & Origin</span>
                <span className="text-slate-200 mt-0.5 block">{selectedEvent.timestamp}</span>
                <span className="text-slate-400 text-[11px] block">{selectedEvent.ipAddress} ({selectedEvent.location})</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 col-span-2">
                <span className="text-slate-500 font-semibold block">Target Device Fingerprint</span>
                <span className="font-mono text-[11px] text-slate-300 break-all block mt-1">
                  {selectedEvent.fingerprintHash}
                </span>
                <span className="text-slate-400 text-[11px] block mt-1">{selectedEvent.deviceInfo}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Raw Evidence Payload</span>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                {selectedEvent.evidencePayload}
              </pre>
            </div>

            <div className="bg-red-950/30 border border-red-900/60 p-3 rounded-lg text-xs text-red-200">
              <span className="font-bold block mb-0.5">Guardian Core Enforcement:</span>
              {selectedEvent.actionTaken}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Tutup Bukti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
