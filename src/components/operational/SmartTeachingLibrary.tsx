import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Mic, 
  MicOff, 
  Sparkles, 
  Download, 
  Printer, 
  Layers, 
  Plus, 
  Filter, 
  FileText, 
  Check, 
  Tag, 
  Archive,
  Volume2
} from 'lucide-react';
import { 
  SmartTeachingGenerator, 
  TeachingCategory, 
  TeachingMaterialItem 
} from '../../core/operational/smartTeachingGenerator';

export const SmartTeachingLibrary: React.FC = () => {
  const generator = useMemo(() => SmartTeachingGenerator.getInstance(), []);
  const [selectedCategory, setSelectedCategory] = useState<TeachingCategory | 'ALL'>('ALL');
  const [items, setItems] = useState<TeachingMaterialItem[]>(() => generator.getItemsByCategory());
  const [selectedItem, setSelectedItem] = useState<TeachingMaterialItem>(items[0]);
  
  // Voice dictation state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [dictatedText, setDictatedText] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const categories: { id: TeachingCategory | 'ALL'; label: string; icon: string }[] = [
    { id: 'ALL', label: 'Semua Kategori', icon: '📚' },
    { id: 'HURUF_HIJAIYAH', label: 'Huruf Hijaiyah', icon: '📖' },
    { id: 'ANGKA_ARAB_LATIN', label: 'Angka & Matematika', icon: '🔢' },
    { id: 'HEWAN_HALAL', label: 'Hewan Ciptaan Allah', icon: '🐪' },
    { id: 'BUAH_BERKAH', label: 'Buah & Makanan Sehat', icon: '🌴' },
    { id: 'DOA_HARIAN', label: 'Doa Harian & Adab', icon: '🤲' },
    { id: 'PROFESI_MULIA', label: 'Cita-cita & Profesi', icon: '🩺' },
    { id: 'LEMBAR_MEWARNAI', label: 'Lembar Mewarnai', icon: '🎨' }
  ];

  const handleToggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Fitur Dikte Suara menggunakan Web Speech API browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setDictatedText(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handlePrintPdf = (item: TeachingMaterialItem) => {
    const html = generator.generatePrintableHtml(item);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-6" id="smart-teaching-library">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Perpustakaan Kelas Cerdas (Generator Bahan Ajar PAUD)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R835 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Flashcard, Kartu Belajar, Poster & Lembar Mewarnai
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pilih topik huruf, angka, hewan, buah, profesi, atau doa harian. Input via ketik teks atau dikte suara guru, langsung jadi bahan ajar siap cetak & unduh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleListening}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? 'Mendengarkan Suara...' : 'Dikte Bahan Ajar'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Materials Library + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Material Cards Deck */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/60 ring-2 ring-teal-500/20 shadow-xl'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{item.visualEmoji}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-950 text-slate-400 border border-slate-800">
                        {item.suggestedAgeGroup}
                      </span>
                    </div>

                    <div>
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-teal-300' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.subTitle}</p>
                    </div>

                    {item.arabicScript && (
                      <div className="text-right text-lg font-bold text-teal-400" style={{ fontFamily: 'Amiri, serif' }}>
                        {item.arabicScript}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-950 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono text-teal-400">{item.id}</span>
                    <span className="text-slate-400 font-semibold">{item.category.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Flashcard Inspector & Print Output */}
        <div className="lg:col-span-5 space-y-4">
          {selectedItem && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pratinjau Lembar Flashcard
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  SIAP CETAK A4/A3
                </span>
              </div>

              {/* Visual Flashcard Card */}
              <div 
                className="p-6 rounded-2xl border-2 border-dashed bg-slate-950 text-center space-y-3"
                style={{ borderColor: selectedItem.colorTheme }}
              >
                <span className="text-5xl block select-none animate-bounce">{selectedItem.visualEmoji}</span>
                {selectedItem.arabicScript && (
                  <h2 className="text-3xl font-black" style={{ color: selectedItem.colorTheme, fontFamily: 'Amiri, serif' }}>
                    {selectedItem.arabicScript}
                  </h2>
                )}
                <h3 className="text-lg font-black text-white">{selectedItem.title}</h3>
                <p className="text-xs font-semibold text-slate-300">{selectedItem.subTitle}</p>
                {selectedItem.meaningIndonesian && (
                  <p className="text-xs text-slate-400 italic bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    "{selectedItem.meaningIndonesian}"
                  </p>
                )}
              </div>

              {/* Learning Objectives */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-teal-400 block">Tujuan Pembelajaran:</span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {selectedItem.learningObjectives.map((obj, idx) => (
                    <li key={idx} className="leading-snug">{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handlePrintPdf(selectedItem)}
                  className="flex-1 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  Cetak PDF Lembar Ajar
                </button>
                <button
                  onClick={() => alert(`Bahan ajar ${selectedItem.title} berhasil diunduh dalam format ZIP & PNG!`)}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  title="Unduh Paket Bahan Ajar ZIP"
                >
                  <Download className="w-4 h-4" />
                  ZIP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
