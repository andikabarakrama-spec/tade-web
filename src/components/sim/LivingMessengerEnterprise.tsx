import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Mic, 
  Smile, 
  Users, 
  User, 
  Radio, 
  Search, 
  MoreVertical, 
  Check, 
  CheckCheck, 
  Sparkles, 
  Volume2, 
  Image, 
  FileText, 
  CornerDownRight, 
  Share2, 
  Bot,
  Play,
  Pause
} from 'lucide-react';
import { MessageStatusEngine, MessageStatus } from './MessageStatusEngine';
import { StickerReactionEngine, StickerItem, STICKER_UNIVERSE } from './StickerReactionEngine';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  text?: string;
  sticker?: StickerItem;
  voiceDurationSec?: number;
  timestamp: string;
  status: MessageStatus;
  replyTo?: {
    senderName: string;
    text: string;
  };
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'DIRECT' | 'GROUP' | 'BROADCAST';
  avatar: string;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  membersCount?: number;
  onlineStatus: 'ONLINE' | 'AWAY' | 'OFFLINE';
}

const SAMPLE_CHANNELS: ChatChannel[] = [
  {
    id: 'chan-broadcast-yayasan',
    name: '📢 Pengumuman Resmi Yayasan Asy Syifa',
    type: 'BROADCAST',
    avatar: '🏛️',
    unreadCount: 2,
    lastMessage: 'Surat Keputusan Verifikasi Akreditasi BAN-PAUD telah terbit.',
    lastTime: '10:45',
    membersCount: 142,
    onlineStatus: 'ONLINE'
  },
  {
    id: 'chan-group-dewan-guru',
    name: '🌸 Dewan Guru & Kepala Sekolah TK',
    type: 'GROUP',
    avatar: '👩‍🏫',
    unreadCount: 0,
    lastMessage: 'Ustadzah Sarah: Catatan anekdot Sentra Balok hari ini sudah selesai.',
    lastTime: '11:15',
    membersCount: 18,
    onlineStatus: 'ONLINE'
  },
  {
    id: 'chan-dm-kepsek',
    name: 'Hj. Siti Rahmah, S.Pd (Kepala Sekolah)',
    type: 'DIRECT',
    avatar: '🧕',
    unreadCount: 1,
    lastMessage: 'Mohon persetujuan berkas proposal sarpras kanopi playground pak.',
    lastTime: '09:30',
    onlineStatus: 'ONLINE'
  },
  {
    id: 'chan-dm-dek-asy',
    name: 'Dek Asy AI Companion',
    type: 'DIRECT',
    avatar: '👦✨',
    unreadCount: 0,
    lastMessage: 'Halo Ustadz/Ustadzah! Dek Asy siap bantu siapkan pengumuman kelas!',
    lastTime: '08:00',
    onlineStatus: 'ONLINE'
  }
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'chan-broadcast-yayasan': [
    {
      id: 'm1',
      senderId: 'usr-admin',
      senderName: 'Sekretariat Yayasan',
      senderAvatar: '🏛️',
      senderRole: 'ADMIN',
      text: 'Assalamu\'alaikum wr. wb. Disampaikan kepada seluruh dewan guru dan staf, visitasi akreditasi BAN-PAUD akan berlangsung pada 18 Agustus 2026.',
      timestamp: '10:30',
      status: 'READ'
    },
    {
      id: 'm2',
      senderId: 'usr-admin',
      senderName: 'Sekretariat Yayasan',
      senderAvatar: '🏛️',
      senderRole: 'ADMIN',
      text: 'Mohon seluruh instrumen 8 Standar Nasional Pendidikan telah disinkronkan ke Governance Smart Vault.',
      sticker: STICKER_UNIVERSE[0],
      timestamp: '10:45',
      status: 'READ'
    }
  ],
  'chan-dm-dek-asy': [
    {
      id: 'm-da-1',
      senderId: 'bot-dek-asy',
      senderName: 'Dek Asy AI',
      senderAvatar: '👦✨',
      senderRole: 'AI_COMPANION',
      text: 'Assalamu\'alaikum! Dek Asy hadir untuk membantu komunikasi dan koordinasi harian TK Asy Syifa.',
      sticker: STICKER_UNIVERSE[2],
      timestamp: '08:00',
      status: 'READ'
    }
  ]
};

export const LivingMessengerEnterprise: React.FC = () => {
  const [channels, setChannels] = useState<ChatChannel[]>(SAMPLE_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-broadcast-yayasan');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [showStickerPicker, setShowStickerPicker] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceDuration, setVoiceDuration] = useState<number>(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const currentMessages = messages[activeChannelId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'usr-current',
      senderName: 'Anda (Admin)',
      senderAvatar: '👤',
      senderRole: 'ADMIN',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT'
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
    }));

    setInputText('');

    // Simulate delivered & read
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChannelId]: prev[activeChannelId]?.map(m => m.id === newMsg.id ? { ...m, status: 'READ' } : m) || []
      }));
    }, 1200);
  };

  const handleSendSticker = (sticker: StickerItem) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'usr-current',
      senderName: 'Anda (Admin)',
      senderAvatar: '👤',
      senderRole: 'ADMIN',
      sticker: sticker,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT'
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
    }));

    setShowStickerPicker(false);
  };

  const handleVoiceRecordToggle = () => {
    if (isRecordingVoice) {
      // Finish recording
      setIsRecordingVoice(false);
      const newMsg: ChatMessage = {
        id: `msg-voice-${Date.now()}`,
        senderId: 'usr-current',
        senderName: 'Anda (Admin)',
        senderAvatar: '👤',
        senderRole: 'ADMIN',
        voiceDurationSec: voiceDuration || 4,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SENT'
      };
      setMessages(prev => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
      }));
      setVoiceDuration(0);
    } else {
      setIsRecordingVoice(true);
      setVoiceDuration(1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  R104 • Living Messenger Enterprise
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Sticker Universe 500+ (R105)
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 text-white">Pusat Komunikasi Resmi Sekolah Asy Syifa</h1>
              <p className="text-sm text-slate-300">
                Saluran pesan terenkripsi, grup dewan guru, siaran yayasan, audio voice note, dan stiker resmi Dek Asy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messenger Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[680px]">
        {/* Left: Channels & Chat List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari obrolan atau guru..."
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Channel Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {channels.map((chan) => {
              const isSelected = activeChannelId === chan.id;
              return (
                <div
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  className={`p-4 cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl shadow-inner">
                      {chan.avatar}
                    </div>
                    {chan.onlineStatus === 'ONLINE' && (
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {chan.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{chan.lastTime}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {chan.lastMessage}
                    </p>
                  </div>

                  {chan.unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                      {chan.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900 relative">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-lg">
                {activeChannel.avatar}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {activeChannel.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{activeChannel.membersCount ? `${activeChannel.membersCount} Anggota Terdaftar` : 'Online & Terenkripsi'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert(`Siaran Pengumuman Cepat ke ${activeChannel.name}`)}
                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Broadcast</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
            {currentMessages.map((msg) => {
              const isMine = msg.senderId === 'usr-current';

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm shrink-0 mb-1">
                      {msg.senderAvatar}
                    </div>
                  )}

                  <div className={`max-w-[75%] space-y-1.5 ${isMine ? 'items-end' : 'items-start'}`}>
                    {!isMine && (
                      <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 px-1">
                        {msg.senderName}
                      </div>
                    )}

                    <div className={`p-3.5 rounded-2xl text-sm shadow-sm ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700'
                    }`}>
                      {msg.text && (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {msg.sticker && (
                        <div className="mt-2 p-3 bg-white/10 dark:bg-slate-900/60 rounded-xl flex items-center gap-3 border border-white/20">
                          <span className="text-4xl">{msg.sticker.emoji}</span>
                          <div>
                            <span className="text-xs font-bold block">{msg.sticker.name}</span>
                            <span className="text-[10px] opacity-80">{msg.sticker.badgeText}</span>
                          </div>
                        </div>
                      )}

                      {msg.voiceDurationSec && (
                        <div className="flex items-center gap-3 p-2 bg-white/10 dark:bg-slate-900/40 rounded-xl min-w-[180px]">
                          <button
                            onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                            className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow"
                          >
                            {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div className="flex-1">
                            <div className="h-1.5 bg-white/30 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full bg-white transition-all ${playingAudioId === msg.id ? 'w-full duration-3000' : 'w-1/3'}`} />
                            </div>
                            <span className="text-[10px] opacity-80 mt-1 block">0:0{msg.voiceDurationSec} Voice Note</span>
                          </div>
                        </div>
                      )}

                      <div className={`text-[10px] flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-indigo-200' : 'text-slate-400'}`}>
                        <span>{msg.timestamp}</span>
                        {isMine && <MessageStatusEngine status={msg.status} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Sticker Popup */}
          {showStickerPicker && (
            <div className="absolute bottom-20 left-4">
              <StickerReactionEngine
                onSelectSticker={handleSendSticker}
                onClose={() => setShowStickerPicker(false)}
              />
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <button
              onClick={() => setShowStickerPicker(!showStickerPicker)}
              className={`p-2.5 rounded-xl transition-all ${
                showStickerPicker
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>

            <button 
              onClick={() => alert('Lampirkan berkas PDF akreditasi atau foto sentra.')}
              className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ketik pesan resmi sekolah atau tekan mic untuk voice note..."
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleVoiceRecordToggle}
              className={`p-2.5 rounded-xl transition-all ${
                isRecordingVoice
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-transform active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
