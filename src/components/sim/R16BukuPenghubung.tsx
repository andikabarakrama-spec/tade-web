import React, { useState } from 'react';
import { MessageSquare, Send, Heart, Smile } from 'lucide-react';

export const R16BukuPenghubung: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Guru (Siti Maimunah)', text: 'Alhamdulillah hari ini Ananda Rayyan semangat sekali menghafal Surah An-Nas dan aktif dalam kegiatan mewarnai.', time: '08:30', isTeacher: true },
    { id: '2', sender: 'Wali Murid (Ibu Rayyan)', text: 'Terima kasih Bu Siti, dirumah Rayyan juga sering mengulang bacaannya.', time: '09:15', isTeacher: false }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;
    setMessages([
      ...messages,
      { id: Date.now().toString(), sender: 'Anda (Guru)', text: inputText, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), isTeacher: true }
    ]);
    setInputText('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Module R16 - Buku Penghubung Digital
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Buku Penghubung Guru & Wali Murid
        </h1>
        <p className="text-stone-500 text-xs">
          Komunikasi dua arah harian seputar perkembangan, kondisi fisik, dan kebiasaan anak.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 max-w-3xl mx-auto">
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 h-80 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-2xl max-w-md text-xs space-y-1 ${
                m.isTeacher
                  ? 'bg-emerald-800 text-white ml-auto rounded-br-none'
                  : 'bg-white border border-stone-200 text-slate-900 mr-auto rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-80 border-b border-white/20 pb-1">
                <span className="font-bold">{m.sender}</span>
                <span>{m.time}</span>
              </div>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder="Tulis pesan catatan untuk wali murid..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl text-xs"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Kirim
          </button>
        </form>
      </div>
    </div>
  );
};
