import React, { useState } from 'react';
import {
  ListTree,
  Bell,
  Lightbulb,
  FileText,
  Briefcase,
  ShieldCheck,
  Filter,
  Plus,
  Clock,
  CheckCircle
} from 'lucide-react';
import { interactionTimelineEngine } from '../../core/companion/interactionTimeline';
import { InteractionTimelineItem, CompanionRole } from '../../core/companion/companionTypes';

export const InteractionTimelineViewer: React.FC = () => {
  const [items, setItems] = useState<InteractionTimelineItem[]>(
    interactionTimelineEngine.getAllItems()
  );
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'REMINDER' | 'INSIGHT' | 'NOTIFICATION' | 'EXECUTIVE_BRIEFING'>('NOTIFICATION');
  const [newRole, setNewRole] = useState<CompanionRole>('UNIVERSAL');

  const refreshList = () => {
    setItems(interactionTimelineEngine.getAllItems());
  };

  const handleAppendItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    interactionTimelineEngine.appendItem({
      type: newType,
      role: newRole,
      title: newTitle.trim(),
      description: newDesc.trim(),
      priority: 'MEDIUM'
    });

    setNewTitle('');
    setNewDesc('');
    refreshList();
  };

  const handleMarkRead = (id: string) => {
    interactionTimelineEngine.markAsRead(id);
    refreshList();
  };

  const filtered = items.filter(item => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (roleFilter !== 'ALL' && item.role !== roleFilter && item.role !== 'UNIVERSAL') return false;
    return true;
  });

  return (
    <div className="space-y-6" id="interaction-timeline-view">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R758 Append-Only Interaction Stream
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Audit Trail Verified
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <ListTree className="w-7 h-7 text-blue-400" />
              Interaction Timeline
            </h1>
            <p className="text-sm text-blue-200/80 mt-1 max-w-2xl">
              Alur kronologis interaksi terpadu: menyatukan seluruh pengingat cerdas, kartu rekomendasi, notifikasi sistem, dan executive briefing dalam satu jejak waktu append-only.
            </p>
          </div>

          <div className="flex gap-2">
            {['ALL', 'EXECUTIVE_BRIEFING', 'REMINDER', 'INSIGHT', 'NOTIFICATION'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                  typeFilter === type
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Append New Event Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-slate-100 text-base mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-400" /> Tambah Entri Timeline (Append-Only)
        </h3>
        <form onSubmit={handleAppendItem} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Judul Entri..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Deskripsi detail..."
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newType}
              onChange={e => setNewType(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="NOTIFICATION">NOTIFICATION</option>
              <option value="REMINDER">REMINDER</option>
              <option value="INSIGHT">INSIGHT</option>
              <option value="EXECUTIVE_BRIEFING">BRIEFING</option>
            </select>
            <select
              value={newRole}
              onChange={e => setNewRole(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="UNIVERSAL">UNIVERSAL</option>
              <option value="PARENT">PARENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="EXECUTIVE">EXECUTIVE</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
          >
            <Plus className="w-4 h-4" /> Append Entri
          </button>
        </form>
      </div>

      {/* Timeline Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Alur Interaksi Terkini ({filtered.length} Aktivitas)
        </h3>

        <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
          {filtered.map(item => (
            <div key={item.itemId} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  item.type === 'EXECUTIVE_BRIEFING'
                    ? 'bg-purple-400 ring-4 ring-purple-500/20'
                    : item.type === 'REMINDER'
                    ? 'bg-amber-400 ring-4 ring-amber-500/20'
                    : item.type === 'INSIGHT'
                    ? 'bg-teal-400 ring-4 ring-teal-500/20'
                    : 'bg-blue-400 ring-4 ring-blue-500/20'
                }`}
              />

              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{item.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-blue-300">
                      {item.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {item.timestamp.split('T')[0]} {item.timestamp.split('T')[1]?.substring(0, 5)} WIB
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">ID: {item.itemId}</span>
                  {!item.isRead ? (
                    <button
                      onClick={() => handleMarkRead(item.itemId)}
                      className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Tandai Dibaca
                    </button>
                  ) : (
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Dibaca
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
