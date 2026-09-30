import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Smile,
  Sparkles,
  Play,
  Pause,
  Check,
  CheckCheck,
  Users,
  Search,
  MoreVertical,
  Volume2,
  Paperclip,
  Moon,
  Sun,
  Flame,
  CornerDownRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import {
  livingMessengerService,
  LivingChatMessage,
  LivingChatChannel,
  ISLAMIC_EMOJI_PACK,
  ASY_SYIFA_REACTIONS,
  SMART_REPLY_TEMPLATES,
  LivingReaction
} from '../../services/livingMessengerService';
import { masterVisibilityService } from '../../services/masterVisibilityService';
import { livingMicroInteractionEngine } from '../../services/livingMicroInteractions';

export const LivingMessengerV2: React.FC = () => {
  const [channels, setChannels] = useState<LivingChatChannel[]>(() => livingMessengerService.getChannels());
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-paguyuban-tk-b1');
  const [messages, setMessages] = useState<LivingChatMessage[]>(() => livingMessengerService.getMessages('chan-paguyuban-tk-b1'));
  const [inputText, setInputText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showReactionsForMsgId, setShowReactionsForMsgId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [butterflyFly, setButterflyFly] = useState<boolean>(false);
  const [nightMode, setNightMode] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = livingMessengerService.subscribe(() => {
      setChannels(livingMessengerService.getChannels());
      setMessages(livingMessengerService.getMessages(activeChannelId));
    });
    return unsub;
  }, [activeChannelId]);

  useEffect(() => {
    setMessages(livingMessengerService.getMessages(activeChannelId));
  }, [activeChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  const handleSend = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    // Trigger Butterfly animation
    setButterflyFly(true);
    setTimeout(() => setButterflyFly(false), 900);

    livingMessengerService.sendMessage(activeChannelId, {
      text: content,
      senderRole: 'WALI_MURID',
      senderName: 'Bunda Farhan (Wali Murid)'
    });

    if (!textToSend) {
      setInputText('');
    }
  };

  const handleSendVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      setButterflyFly(true);
      setTimeout(() => setButterflyFly(false), 900);

      livingMessengerService.sendMessage(activeChannelId, {
        voiceNote: {
          durationSec: 6,
          waveform: [30, 60, 95, 80, 50, 70, 90, 40, 65, 85, 30]
        },
        text: '🎤 Pesan Suara: Konfirmasi penjemputan ananda sore ini.',
        senderRole: 'WALI_MURID',
        senderName: 'Bunda Farhan'
      });
    } else {
      setIsRecording(true);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string, name: string, avatarType?: 'ASY' | 'SYIFA') => {
    livingMessengerService.addReaction(activeChannelId, messageId, emoji, name, avatarType);
    setShowReactionsForMsgId(null);
  };

  const togglePlayVoice = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      setTimeout(() => setPlayingVoiceId(null), 6000);
    }
  };

  return (
    <div className={`w-full rounded-3xl border shadow-2xl overflow-hidden transition-all ${
      nightMode ? 'bg-slate-950 border-emerald-900/60 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
    }`}>
      {/* Messenger Top Bar */}
      <div className={`p-4 flex items-center justify-between border-b ${
        nightMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {activeChannel.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-sm ${nightMode ? 'text-white' : 'text-slate-900'}`}>
                {activeChannel.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                {activeChannel.type}
              </span>
            </div>
            <p className="text-xs text-slate-500">{activeChannel.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNightMode(!nightMode)}
            className={`p-2 rounded-xl transition-all ${
              nightMode ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Toggle Firefly Night Mode"
          >
            {nightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Channels + Message Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 h-[520px]">
        {/* Left Sidebar: Channels */}
        <div className={`md:col-span-1 border-r overflow-y-auto ${
          nightMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Saluran Silaturahmi ({channels.length})
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {channels.map(c => {
              const isSelected = c.id === activeChannelId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChannelId(c.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-all ${
                    isSelected
                      ? nightMode
                        ? 'bg-slate-800/80 border-l-4 border-emerald-400'
                        : 'bg-emerald-50/80 border-l-4 border-emerald-600'
                      : nightMode
                        ? 'hover:bg-slate-900/80'
                        : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xl p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : nightMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {c.name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {c.lastTimestamp.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {c.lastMessageText}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Message Stream & Input */}
        <div className="md:col-span-2 flex flex-col h-full relative">
          {/* Butterfly Delivery Flying Micro-Animation */}
          {butterflyFly && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-bounce text-3xl">
              🦋✨
            </div>
          )}

          {/* Messages Area */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${
            nightMode ? 'bg-slate-950/90' : 'bg-slate-50/50'
          }`}>
            {messages.map(msg => {
              const isMe = msg.senderRole === 'WALI_MURID';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-500">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Living Bubble */}
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl relative shadow-sm transition-all ${
                      isMe
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                        : nightMode
                          ? 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {/* Voice Note Visualizer */}
                    {msg.voiceNote && (
                      <div className="flex items-center gap-3 p-2 bg-black/10 rounded-xl mb-2">
                        <button
                          onClick={() => togglePlayVoice(msg.id)}
                          className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-md shrink-0"
                        >
                          {playingVoiceId === msg.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1 flex items-end gap-1 h-6">
                          {msg.voiceNote.waveform.map((bar, idx) => (
                            <div
                              key={idx}
                              style={{ height: `${playingVoiceId === msg.id ? (bar * (Math.random() * 0.5 + 0.5)) : bar}%` }}
                              className={`w-1 rounded-full transition-all duration-150 ${
                                isMe ? 'bg-emerald-200' : 'bg-emerald-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono font-bold shrink-0 opacity-80">
                          0:0{msg.voiceNote.durationSec}
                        </span>
                      </div>
                    )}

                    {msg.text && (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Status Check / Read Receipt */}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {msg.status === 'READ' && (
                        <CheckCheck className={`w-3.5 h-3.5 ${isMe ? 'text-emerald-200' : 'text-emerald-500'} animate-pulse`} />
                      )}
                      {msg.status === 'DELIVERED' && (
                        <CheckCheck className="w-3.5 h-3.5 text-slate-300" />
                      )}
                      {msg.status === 'SENT' && (
                        <Check className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </div>

                  {/* Reactions Pill Display */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 px-1">
                      {msg.reactions.map(rx => (
                        <span
                          key={rx.id}
                          className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold shadow-sm flex items-center gap-1"
                        >
                          <span>{rx.emoji}</span>
                          <span className="text-slate-600 dark:text-slate-300">{rx.count}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Reaction Trigger Button */}
                  <button
                    onClick={() => setShowReactionsForMsgId(showReactionsForMsgId === msg.id ? null : msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-400 hover:text-emerald-500 mt-0.5 px-1 flex items-center gap-1"
                  >
                    <Smile className="w-3 h-3" /> Beri Reaksi
                  </button>

                  {/* Floating Reaction Bar */}
                  {showReactionsForMsgId === msg.id && (
                    <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-xl mt-1 z-20">
                      {ASY_SYIFA_REACTIONS.map(rx => (
                        <button
                          key={rx.id}
                          onClick={() => handleAddReaction(msg.id, rx.emoji, rx.name, rx.avatarType)}
                          className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-sm transition-transform hover:scale-125"
                          title={rx.name}
                        >
                          {rx.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Smart Reply Suggestions */}
          <div className={`px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-t ${
            nightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Balas Cepat:
            </span>
            {SMART_REPLY_TEMPLATES.map((tpl, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(tpl)}
                className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 text-[11px] font-medium whitespace-nowrap hover:bg-emerald-100 transition-all shrink-0"
              >
                {tpl}
              </button>
            ))}
          </div>

          {/* Islamic Emoji Pack Picker Modal */}
          {showEmojiPicker && (
            <div className={`p-3 border-t grid grid-cols-5 gap-2 ${
              nightMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {ISLAMIC_EMOJI_PACK.map(emo => (
                <button
                  key={emo.id}
                  onClick={() => {
                    setInputText(prev => prev + ' ' + emo.char);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105 flex items-center justify-center text-lg transition-transform"
                  title={emo.label}
                >
                  {emo.char}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className={`p-3 border-t flex items-center gap-2 ${
            nightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-slate-400 hover:text-emerald-600 rounded-xl"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              onClick={handleSendVoice}
              className={`p-2 rounded-xl transition-all ${
                isRecording ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-emerald-600'
              }`}
              title={isRecording ? 'Selesai & Kirim Suara' : 'Rekam Pesan Suara'}
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? 'Sedang merekam suara kasih sayang...' : 'Tulis pesan santun untuk madrasah...'}
              disabled={isRecording}
              className={`flex-1 px-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                nightMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
            />

            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-transform hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
