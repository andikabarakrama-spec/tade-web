import React, { useState, useEffect } from 'react';
import {
  GitCommit,
  Radio,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import {
  runtimeBusV2,
  RuntimeBusMessage,
  BusMessagePriority,
} from '../../core/kernel/RuntimeBusV2';

export const RuntimeBusV2Viewer: React.FC = () => {
  const [messages, setMessages] = useState<RuntimeBusMessage[]>(runtimeBusV2.getRecentMessages());
  const [queueStats, setQueueStats] = useState(runtimeBusV2.getQueueStats());
  const [totalDispatched, setTotalDispatched] = useState(runtimeBusV2.getTotalDispatched());
  const [totalDropped, setTotalDropped] = useState(runtimeBusV2.getTotalDropped());

  const [topic, setTopic] = useState('founder.decree.broadcast');
  const [priority, setPriority] = useState<BusMessagePriority>('HIGH');
  const [payloadText, setPayloadText] = useState('{"action": "VERIFY_CAPABILITY_MATRIX"}');

  const handleRefresh = () => {
    setMessages(runtimeBusV2.getRecentMessages());
    setQueueStats(runtimeBusV2.getQueueStats());
    setTotalDispatched(runtimeBusV2.getTotalDispatched());
    setTotalDropped(runtimeBusV2.getTotalDropped());
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(payloadText);
      } catch {
        parsed = { text: payloadText };
      }

      runtimeBusV2.publish({
        topic,
        sourceNamespace: 'SYSTEM_KERNEL',
        targetNamespace: 'BROADCAST',
        priority,
        payload: parsed,
      });

      handleRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="runtime-bus-v2-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R629 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Runtime Bus V2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Radio className="w-8 h-8 text-amber-400" />
              Runtime Bus V2 & Priority Queues
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Central nervous system for inter-module event transmission with 4 strict priority queues (CRITICAL, HIGH, NORMAL, LOW) and backpressure handling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              Refresh Bus
            </button>
          </div>
        </div>

        {/* Priority Queues Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {queueStats.map((q) => (
            <div key={q.priority} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
              <span className="text-[10px] font-mono text-slate-400 block">{q.priority} QUEUE</span>
              <span
                className={`text-xl font-bold font-mono ${
                  q.priority === 'CRITICAL'
                    ? 'text-rose-400'
                    : q.priority === 'HIGH'
                    ? 'text-amber-400'
                    : q.priority === 'NORMAL'
                    ? 'text-cyan-400'
                    : 'text-slate-400'
                }`}
              >
                {q.depth} Pending
              </span>
              <span className="text-[9px] text-emerald-500 block">Draining Realtime</span>
            </div>
          ))}
        </div>
      </div>

      {/* Message Publisher Form */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
          <Send className="w-4 h-4 text-amber-500" />
          Publish Virtual Bus Event (Super Admin Dispatch)
        </h2>
        <form onSubmit={handlePublish} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Topic Name</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as BusMessagePriority)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
            >
              <option value="CRITICAL">CRITICAL (Ring-0 & Recovery)</option>
              <option value="HIGH">HIGH (Founder & PM)</option>
              <option value="NORMAL">NORMAL (Civil & Workflows)</option>
              <option value="LOW">LOW (Scrubbers & Telemetry)</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Payload (JSON or Text)</label>
              <input
                type="text"
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 h-9"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch
            </button>
          </div>
        </form>
      </div>

      {/* Message Stream Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
            <Clock className="w-4 h-4 text-amber-500" />
            Runtime Bus Transmission Log ({totalDispatched} Dispatched, {totalDropped} Dropped)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Real-time Spans</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-2.5 rounded-l-lg">Time</th>
                <th className="p-2.5">Topic</th>
                <th className="p-2.5">Source ➔ Target</th>
                <th className="p-2.5">Priority</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 rounded-r-lg">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <td className="p-2.5 text-slate-400">{msg.timestamp.substring(11, 19)}</td>
                  <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">{msg.topic}</td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-300">
                    {msg.sourceNamespace} ➔ {msg.targetNamespace}
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.priority === 'CRITICAL'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : msg.priority === 'HIGH'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {msg.priority}
                    </span>
                  </td>
                  <td className="p-2.5 text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {msg.deliveryStatus}
                  </td>
                  <td className="p-2.5 text-slate-400">{msg.latencyMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
