import React, { useState } from 'react';
import { 
  X, Sparkles, Flag, Volume2, Heart, Award, 
  Send, CheckCircle2, RotateCcw, Share2, Trees 
} from 'lucide-react';
import { SchoolEventTheme, livingEventEngine } from '../../services/livingEventEngine';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';

interface EventBonusParadeModalProps {
  eventTheme: SchoolEventTheme;
  isOpen: boolean;
  onClose: () => void;
}

export const EventBonusParadeModal: React.FC<EventBonusParadeModalProps> = ({
  eventTheme,
  isOpen,
  onClose
}) => {
  // Bonus minigame state
  const [marchStep, setMarchStep] = useState<number>(0);
  const [lanternsLit, setLanternsLit] = useState<number[]>([0]);
  const [rainbowArcs, setRainbowArcs] = useState<number[]>([0, 1]);
  const [prayerText, setPrayerText] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [submittedPrayers, setSubmittedPrayers] = useState<Array<{ id: string; name: string; text: string; time: string }>>([
    { id: '1', name: 'Dek Asy', text: 'Semoga santri TK Asy Syifa selalu ceria, cerdas, dan sholih sholihah!', time: 'Baru saja' },
    { id: '2', name: 'Ustadzah Fatimah', text: 'Barakallah fikum, berkah selalu langkah pendidikan qurani ini.', time: '5 mnt lalu' }
  ]);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const bonus = eventTheme.bonusFeature;

  // Handlers for specific bonus mini-activities
  const handleFlagMarchStep = () => {
    setMarchStep(prev => prev + 1);
    asySyifaDnaEngine.playSignatureSound('TEPUK_TANGAN_KECIL');
    if ((marchStep + 1) % 5 === 0) {
      livingEventEngine.playEventChime('MARS_TK');
      setFeedback('Luar biasa! Barisan pawai bergerak semakin semangat!');
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const toggleLantern = (index: number) => {
    if (lanternsLit.includes(index)) {
      setLanternsLit(lanternsLit.filter(i => i !== index));
    } else {
      setLanternsLit([...lanternsLit, index]);
      asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
    }
  };

  const toggleRainbowArc = (index: number) => {
    if (!rainbowArcs.includes(index)) {
      setRainbowArcs([...rainbowArcs, index]);
      asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
    }
  };

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerText.trim()) return;

    const newPrayer = {
      id: Date.now().toString(),
      name: senderName.trim() || 'Santri Cilik',
      text: prayerText.trim(),
      time: 'Baru saja'
    };

    setSubmittedPrayers([newPrayer, ...submittedPrayers]);
    setPrayerText('');
    asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
    setFeedback('Alhamdulillah! Doa indahmu telah disematkan di Pohon Harapan.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const rainbowColors = [
    { label: 'Tauhid & Keimanan', color: 'bg-red-500', text: 'Menanamkan cinta kepada Allah dan Rasul sejak dini.' },
    { label: 'Akhlakul Karimah', color: 'bg-orange-500', text: 'Adab santun, senyum, salam, dan saling menghormati.' },
    { label: 'Cinta Al-Quran', color: 'bg-yellow-500', text: 'Gemar membaca, menghafal juz 30, dan mengamalkannya.' },
    { label: 'Kemandirian Ceria', color: 'bg-emerald-500', text: 'Berani mencoba, kreatif, dan mandiri dalam kebaikan.' },
    { label: 'Peduli Lingkungan', color: 'bg-teal-500', text: 'Menjaga kebersihan, mencintai flora dan fauna ciptaan Allah.' },
    { label: 'Semangat Berbagi', color: 'bg-blue-500', text: 'Dermawan, suka menolong sesama teman yang membutuhkan.' },
    { label: 'Prestasi Qurani', color: 'bg-purple-500', text: 'Mengembangkan bakat dan cita-cita luhur demi umat.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg">
            {bonus.icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold tracking-wider uppercase border border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              <span>Fitur Spesial Hari Besar (G25)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {bonus.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6">
          {bonus.description}
        </p>

        {feedback && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        {/* 1. Pawai Bendera Ceria (17 Agustus) */}
        {eventTheme.eventId === 'KEMERDEKAAN' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-5 text-center relative overflow-hidden">
              <div className="flex justify-center items-center gap-6 my-4">
                <div className={`transition-transform duration-300 ${marchStep % 2 === 0 ? '-translate-y-2 rotate-3' : 'translate-y-0 -rotate-3'}`}>
                  <CartoonCharacterSvg type="ASY" size={84} expression="SENYUM" movement="LANGKAH_KECIL" />
                  <span className="text-[11px] font-black text-rose-400">Dek Asy 🇮🇩</span>
                </div>
                <div className={`transition-transform duration-300 ${marchStep % 2 === 1 ? '-translate-y-2 rotate-3' : 'translate-y-0 -rotate-3'}`}>
                  <CartoonCharacterSvg type="SYIFA" size={84} expression="SENYUM" movement="LANGKAH_KECIL" />
                  <span className="text-[11px] font-black text-rose-400">Mbak Syifa 🇮🇩</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 mb-4">
                <Flag className="w-4 h-4 text-rose-400" />
                <span>Langkah Pawai: {marchStep} Langkah Merdeka</span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleFlagMarchStep}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm tracking-wide shadow-xl active:scale-95 transition-all cursor-pointer"
                >
                  🇮🇩 Kibarkan Bendera & Melangkah! ({marchStep})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Parade Lentera Ramadhan */}
        {eventTheme.eventId === 'RAMADHAN' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                🏮 Sentuh Lentera Fanous untuk Menerangi Hati:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { title: 'Tadarus Al-Quran', icon: '📖', verse: 'Pahala 1 huruf = 10 kebaikan' },
                  { title: 'Sedekah Subuh', icon: '🤲', verse: 'Didoakan malaikat setiap pagi' },
                  { title: 'Latihan Puasa', icon: '🌙', verse: 'Pintu Ar-Rayyan menanti' },
                  { title: 'Senyum & Adab', icon: '😊', verse: 'Senyummu adalah sedekah' }
                ].map((item, idx) => {
                  const isLit = lanternsLit.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleLantern(idx)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${isLit ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/30'}`}
                    >
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="text-xs font-bold">{item.title}</p>
                      <p className="text-[10px] mt-1 text-amber-300/80">{item.verse}</p>
                      <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-md ${isLit ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-white/60'}`}>
                        {isLit ? '✨ BERSINAR' : 'SENTUH'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Pelangi Milad TK Asy Syifa */}
        {eventTheme.eventId === 'MILAD_TK' && (
          <div className="space-y-4">
            <div className="bg-slate-800/80 border border-purple-500/30 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">
                🌈 7 Nilai Keberkahan TK Asy Syifa (Sentuh Busur):
              </h4>

              <div className="space-y-2">
                {rainbowColors.map((arc, i) => {
                  const isUnlocked = rainbowArcs.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleRainbowArc(i)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${isUnlocked ? 'bg-purple-900/30 border-purple-400 text-white' : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-3.5 h-3.5 rounded-full ${arc.color} shadow`} />
                        <div>
                          <p className="text-xs font-bold text-white">{arc.label}</p>
                          {isUnlocked && <p className="text-[11px] text-purple-200 mt-0.5">{arc.text}</p>}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isUnlocked ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/50'}`}>
                        {isUnlocked ? 'TERBUKA' : 'KLIK'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. Pohon Doa & Harapan Event (Universal for other events or Wish Tree) */}
        {(eventTheme.eventId !== 'KEMERDEKAAN' && eventTheme.eventId !== 'RAMADHAN' && eventTheme.eventId !== 'MILAD_TK') && (
          <div className="space-y-4">
            <form onSubmit={handleAddPrayer} className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Trees className="w-4 h-4" />
                <span>Sematkan Doa di Pohon Harapan {eventTheme.badge}</span>
              </h4>

              <div>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nama Ananda / Wali Murid / Guru..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  value={prayerText}
                  onChange={(e) => setPrayerText(e.target.value)}
                  placeholder="Tuliskan doa & harapan kebaikan..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gantungkan Doa di Pohon</span>
              </button>
            </form>

            {/* List of recent prayers */}
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {submittedPrayers.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-800/60 border border-white/10 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-emerald-300">{p.name}</span>
                    <span>{p.time}</span>
                  </div>
                  <p className="text-slate-200">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tersinkronisasi Otomatis dengan Ekosistem TADE</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
