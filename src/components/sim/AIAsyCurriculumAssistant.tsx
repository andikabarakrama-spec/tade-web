import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Bot,
  Lightbulb,
  Copy,
  Check,
  Send,
  ShieldCheck,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';

interface CurriculumIdea {
  id: string;
  topic: string;
  targetAge: string;
  paudAspects: string[];
  learningGoals: string[];
  activitySteps: {
    stage: 'Pijakan Awal' | 'Pijakan Main' | 'Pijakan Akhir';
    description: string;
  }[];
  materials: string[];
  islamicIntegration: string;
}

export const AIAsyCurriculumAssistant: React.FC = () => {
  const { userProfile } = useAuth();
  const [topicInput, setTopicInput] = useState('');
  const [activeVariant, setActiveVariant] = useState<'ASY' | 'SYIFA'>('ASY');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [generatedIdeas, setGeneratedIdeas] = useState<CurriculumIdea[]>([
    {
      id: 'IDEA-01',
      topic: 'Eksplorasi Warna dari Bunga & Daun Alami (Eco-Art)',
      targetAge: 'Usia 4-6 Tahun (TK A & TK B)',
      paudAspects: ['Nilai Agama & Moral', 'Jati Diri', 'Dasar Literasi & STEAM'],
      learningGoals: [
        'Mengenal dan mengagumi ciptaan Allah berupa aneka ragam warna tanaman.',
        'Mengekspresikan imajinasi karya seni menggunakan pigmen warna alami.',
        'Memahami proses sederhana ekstraksi warna (tumbuk, peras, campur air).'
      ],
      activitySteps: [
        { stage: 'Pijakan Awal', description: 'Guru mengajak siswa mengamati kelopak bunga telang, daun pandan, dan kunyit sambil mengucap Masya Allah.' },
        { stage: 'Pijakan Main', description: 'Siswa menumbuk bunga/daun dengan lumpang kayu kecil, menambahkan sedikit air, lalu melukis dengan kuas pelepah pisang.' },
        { stage: 'Pijakan Akhir', description: 'Siswa menceritakan gambar karyanya, berdiskusi warna yang tercipta, lalu mencuci tangan dan merapikan alat.' }
      ],
      materials: ['Bunga telang', 'Kunyit', 'Daun suji/pandan', 'Lumpang kayu mini', 'Kertas gambar tebal', 'Kuas alami'],
      islamicIntegration: 'Mengaitkan dengan QS. Fatir ayat 27 tentang keberagaman warna-warni buah dan tumbuhan ciptaan Allah SWT.'
    }
  ]);

  const handleGenerate = async () => {
    const topic = topicInput.trim();
    if (!topic || isGenerating) return;
    setIsGenerating(true);

    try {
      // Check real knowledge docs for theme context
      const docs = await DataService.searchKnowledge(topic, 'GURU', userProfile?.uid).catch(() => []);

      const newIdea: CurriculumIdea = {
        id: `IDEA-${Date.now().toString().slice(-4)}`,
        topic: topic,
        targetAge: 'Usia 4-6 Tahun (Kelompok A & B)',
        paudAspects: ['Nilai Agama & Budi Pekerti', 'Jati Diri', 'Literasi & STEAM'],
        learningGoals: [
          `Mengenal konsep dasar "${topic}" melalui eksplorasi konkret dan rasa syukur kepada Allah SWT.`,
          'Melatih motorik halus dan keterampilan berkomunikasi saat bekerja sama di sentra kegiatan.',
          'Mampu menceritakan kembali proses bermain dan hasil karya secara terstruktur.'
        ],
        activitySteps: [
          {
            stage: 'Pijakan Awal',
            description: `Pendidik membuka lingkaran dengan salam, doa belajar, dan apersepsi bercerita/membacakan buku bertema "${topic}".`
          },
          {
            stage: 'Pijakan Main',
            description: `Siswa beraktivitas langsung di sentra dengan media konkret dan bahan lepasan (loose parts), mengeksplorasi tema "${topic}" sesuai minat.`
          },
          {
            stage: 'Pijakan Akhir',
            description: `Recalling bersama: siswa menceritakan pengalaman main, merapikan alat belajar (adab mandiri), dan mengucap Alhamdulillah.`
          }
        ],
        materials: ['Bahan lepasan (loose parts)', 'Media konkret alami', 'Kertas gambar & pewarna ramah anak'],
        islamicIntegration: `Menghubungkan tema "${topic}" dengan ayat Al-Qur'an atau hadits tentang tadabbur alam dan adab berakhlak mulia di TK Islam Asy-Syifatan.`
      };

      setGeneratedIdeas([newIdea, ...generatedIdeas]);
      setTopicInput('');
    } catch (err) {
      console.error('Error generating curriculum idea:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl border border-cyan-100 font-extrabold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">
                Penyusun Kurikulum PAUD ({activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'})
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold font-mono">
                Kurikulum Merdeka PAUD
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Penyusunan modul ajar & ide kegiatan sentra berbasis Kurikulum Merdeka PAUD dan nilai-nilai Islami TK Islam Asy-Syifatan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Persona Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveVariant('ASY')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVariant === 'ASY' ? 'bg-white text-cyan-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👦 Dek Asy
            </button>
            <button
              onClick={() => setActiveVariant('SYIFA')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVariant === 'SYIFA' ? 'bg-white text-cyan-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👧 Dek Syifa
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Standar BSKAP PAUD
          </div>
        </div>
      </div>

      {/* Generator Prompt Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          Rancang Modul Ajar Sentra Baru
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Ketik tema kegiatan (contoh: Mengenal Tanaman Obat Keluarga / Bunga Matahari)..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            disabled={isGenerating}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topicInput.trim()}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menyusun Modul...</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4" /> Susun Ide & RPP
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Ideas Cards */}
      <div className="space-y-4">
        {generatedIdeas.map((idea) => (
          <div key={idea.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">{idea.topic}</h2>
                  <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-bold font-mono rounded">
                    {idea.targetAge}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {idea.paudAspects.map((asp, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-medium">
                      {asp}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCopy(idea.id, `${idea.topic}\n\nTujuan:\n${idea.learningGoals.join('\n')}`)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 font-bold flex items-center gap-1.5 self-start sm:self-auto"
              >
                {copiedId === idea.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === idea.id ? 'Tersalin' : 'Salin Template'}
              </button>
            </div>

            {/* Goals & Islamic Integration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-800">Tujuan Pembelajaran:</div>
                <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px]">
                  {idea.learningGoals.map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                <div className="font-bold text-emerald-900">Integrasi Nilai Islami:</div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  {idea.islamicIntegration}
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-800">Langkah-Langkah Kegiatan (Pijakan Sentra):</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {idea.activitySteps.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold font-mono text-cyan-700 uppercase">{step.stage}</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
