import React, { useState } from 'react';
import { CryptographicEventBus, CryptographicEventEnvelope } from '../../core/orchestration/CryptographicEventBus';
import { Radio, ShieldCheck, Lock, Activity, CheckCircle2, RefreshCw, Send } from 'lucide-react';

export const CryptographicEventBusViewer: React.FC = () => {
  const bus = CryptographicEventBus.getInstance();
  const [events, setEvents] = useState<CryptographicEventEnvelope[]>(bus.getEventHistory());
  const [telemetry, setTelemetry] = useState(bus.getTelemetry());
  const [testTopic, setTestTopic] = useState<CryptographicEventEnvelope['topic']>('FINANCIAL');
  const [customMsg, setCustomMsg] = useState('');
  const [signedStatus, setSignedStatus] = useState<string | null>(null);

  const handlePublishTestEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = customMsg.trim() ? { note: customMsg } : { action: 'TELEMETRY_HEARTBEAT', status: 'OK' };
    const env = bus.publishSignedEvent(testTopic, 'OperatorAdminConsole::WarRoomAR', payload);
    setEvents(bus.getEventHistory());
    setTelemetry(bus.getTelemetry());
    setSignedStatus(`Event ${env.eventId} berhasil diterbitkan dengan tanda tangan ${env.signature.slice(0, 20)}...`);
    setCustomMsg('');
    setTimeout(() => setSignedStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Publisher */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                R662 &bull; ZERO-TRUST EVENT RELAY
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Zero-Trust Multi-Node Event Bus &amp; Cryptographic Telemetry
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
            SHA-256 HMAC SECURED
          </span>
        </div>

        {/* Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Total Events</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{telemetry.totalEventsProcessed.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% Provenance
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Tamper Rejections</span>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{telemetry.tamperedEventsRejected}</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Blocked &amp; Quarantined</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Throughput</span>
            <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">{telemetry.busThroughputPerSec}/s</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Latency ~{telemetry.averageRelayLatencyMs}ms</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Active Topics</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{telemetry.activeTopicSubscriptions}</div>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">Multi-Channel Broadcast</span>
          </div>
        </div>

        {/* Live Publisher Form */}
        <form onSubmit={handlePublishTestEvent} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-3">
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
            Uji Coba Penerbitan Event Bertanda Tangan Kriptografis
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={testTopic}
              onChange={(e) => setTestTopic(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
            >
              <option value="FINANCIAL">FINANCIAL</option>
              <option value="ATTENDANCE">ATTENDANCE</option>
              <option value="ACADEMIC">ACADEMIC</option>
              <option value="GOVERNANCE">GOVERNANCE</option>
              <option value="SECURITY">SECURITY</option>
            </select>
            <input
              type="text"
              placeholder="Catatan payload simulasi (opsional)..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-mono text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish &amp; Sign</span>
            </button>
          </div>

          {signedStatus && (
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 text-[11px] text-teal-800 dark:text-teal-200 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>{signedStatus}</span>
            </div>
          )}
        </form>
      </div>

      {/* Events Stream Log */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cryptographic Signed Envelopes Ledger</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">{events.length} Envelopes</span>
        </div>

        <div className="space-y-3">
          {events.map((evt) => (
            <div key={evt.eventId} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                    {evt.eventId}
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    {evt.topic}
                  </span>
                  <span className="text-[10px] text-slate-400">{evt.sourceNodeId}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
                <pre className="whitespace-pre-wrap">{JSON.stringify(evt.payload, null, 2)}</pre>
              </div>
              <div className="text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                <span><strong>Signature:</strong> {evt.signature}</span>
                <span><strong>Nonce:</strong> {evt.nonce}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
