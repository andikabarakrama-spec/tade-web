import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import { AIOperatingSystemEngine, RPPMPlan, RPPHPlan, Assessment6Aspects, AIStoryResult, StudentDigitalMemoryTimeline } from '../../services/aiOperatingSystemEngine';
import {
  AIActiveContext,
  AIProposedAction,
  AIExplainedItem,
  AITranslatedError,
  AIRoleRecommendation,
  AISchoolAdvisorReport,
  VoiceCommandInterface
} from '../../types';
import {
  Sparkles,
  Bot,
  Brain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Play,
  RotateCcw,
  Compass,
  Mic,
  Volume2,
  BookOpen,
  Wrench,
  HelpCircle,
  Users,
  Layers,
  Award,
  Zap,
  Eye,
  Sliders,
  Search,
  Heart,
  Calendar,
  Smile,
  BarChart2,
  Activity,
  Check,
  RefreshCw,
  Folder,
  Star
} from 'lucide-react';

export const R36AIOperatingSystem: React.FC<{ activeModuleCode?: string }> = ({ activeModuleCode = 'R36' }) => {
  const { userProfile } = useAuth();

  // Mode States
  const [activeTab, setActiveTab] = useState<
    'TEACHER_AI' | 'ASSESSMENT_AI' | 'STORY_AI' | 'ROLE_HUBS' | 'HEALTH_SCORE' | 'SEARCH_MEMORY' | 'CONTEXT' | 'ACTIONS' | 'ERRORS'
  >('TEACHER_AI');

  const [seniorTeacherMode, setSeniorTeacherMode] = useState<boolean>(false);

  // AI Data States
  const [aiContext, setAiContext] = useState<AIActiveContext | null>(null);
  const [proposedActions, setProposedActions] = useState<AIProposedAction[]>([]);
  const [roleRecs, setRoleRecs] = useState<AIRoleRecommendation[]>([]);
  const [advisorReport, setAdvisorReport] = useState<AISchoolAdvisorReport | null>(null);

  // Sprint P5 Specific States
  // 1. Teacher AI State
  const [rppmTheme, setRppmTheme] = useState('Tanaman Ciptaan Allah');
  const [generatedRppm, setGeneratedRppm] = useState<RPPMPlan | null>(null);
  const [generatedRpph, setGeneratedRpph] = useState<RPPHPlan | null>(null);
  const [iceBreaking, setIceBreaking] = useState<{ title: string; lyrics: string; movements: string } | null>(null);

  // 2. Assessment State
  const [selectedStudentForAssessment, setSelectedStudentForAssessment] = useState('Ananda Rayhan');
  const [generatedAssessment, setGeneratedAssessment] = useState<Assessment6Aspects | null>(null);

  // 3. Story State
  const [photoTopicInput, setPhotoTopicInput] = useState('Latihan Cap Daun Kebun Sekolah');
  const [generatedStory, setGeneratedStory] = useState<AIStoryResult | null>(null);

  // 4. Role Hubs State
  const [activeRoleHub, setActiveRoleHub] = useState<'PARENT' | 'HEADMASTER' | 'FOUNDATION' | 'ADMIN'>('PARENT');

  // 5. Natural Search & Memory
  const [searchQueryInput, setSearchQueryInput] = useState('daun');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [digitalMemory, setDigitalMemory] = useState<StudentDigitalMemoryTimeline | null>(null);

  // Error & Voice States
  const [rawErrorInput, setRawErrorInput] = useState('FirebaseError: [permission-denied] Missing or insufficient permissions.');
  const [translatedError, setTranslatedError] = useState<AITranslatedError | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceCommandInterface>({
    isListening: false,
    transcript: '',
    supportedCommands: ['Buat RPPH Hari Ini', 'Cek Skor Kesehatan Sekolah', 'Cari Foto Sholat', 'Tampilkan Rapor Rayhan'],
    mode: 'IDLE'
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAIOperatingSystemData();
  }, [userProfile, activeModuleCode]);

  const loadAIOperatingSystemData = async () => {
    setLoading(true);
    try {
      const [ctx, recs, adv] = await Promise.all([
        DataService.getAIActiveContext(activeModuleCode, userProfile?.role || 'GURU', userProfile?.nama || 'Pengguna TADE'),
        DataService.getRoleRecommendations(userProfile?.role || 'GURU'),
        DataService.getAISchoolAdvisorReport()
      ]);

      setAiContext(ctx);
      setRoleRecs(recs);
      setAdvisorReport(adv);

      // Pre-seed P5 Generators
      setGeneratedRppm(AIOperatingSystemEngine.generateRPPM('Tanaman Ciptaan Allah'));
      setGeneratedRpph(AIOperatingSystemEngine.generateRPPH('Cap Daun Finger Painting'));
      setIceBreaking(AIOperatingSystemEngine.generateIceBreaking());
      setGeneratedAssessment(AIOperatingSystemEngine.generateAssessment6Aspects('Ananda Rayhan'));
      setGeneratedStory(AIOperatingSystemEngine.generateStoryFromPhoto('Latihan Cap Daun Kebun Sekolah'));
      setSearchResults(AIOperatingSystemEngine.searchNaturalLanguage('daun'));
      setDigitalMemory(AIOperatingSystemEngine.getStudentDigitalMemory('Ananda Rayhan'));

      // Pre-seed sample proposed actions
      setProposedActions([
        {
          id: 'action_01',
          title: 'Generate Laporan RPPM & RPPH Mingguan Otomatis (PDF)',
          actionType: 'GENERATE_REPORT',
          targetModule: 'R30 Portal Guru',
          payload: { theme: 'Tanaman Ciptaan Allah', week: 4 },
          requiresHumanConfirmation: true,
          confirmed: false,
          status: 'PROPOSED',
          createdAt: new Date().toISOString()
        },
        {
          id: 'action_02',
          title: 'Publikasikan Narasi Story AI ke CMS Website (W1)',
          actionType: 'GENERATE_STORY',
          targetModule: 'R22 CMS Website',
          payload: { title: 'Kreativitas Mungil Di Kebun Asy Syifa' },
          requiresHumanConfirmation: true,
          confirmed: false,
          status: 'PROPOSED',
          createdAt: new Date().toISOString()
        }
      ]);

      handleTranslateError(rawErrorInput);
    } catch (e) {
      console.warn('AI OS Data load error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = (actionId: string) => {
    setProposedActions(prev =>
      prev.map(act => (act.id === actionId ? { ...act, confirmed: true, status: 'EXECUTED' } : act))
    );
  };

  const handleTranslateError = (errString: string) => {
    const res = DataService.translateFirebaseError(errString);
    setTranslatedError(res);
  };

  const handleGenerateRppmRpph = () => {
    const rppm = AIOperatingSystemEngine.generateRPPM(rppmTheme);
    const rpph = AIOperatingSystemEngine.generateRPPH(rppmTheme);
    setGeneratedRppm(rppm);
    setGeneratedRpph(rpph);
  };

  const handleGenerateStory = () => {
    const story = AIOperatingSystemEngine.generateStoryFromPhoto(photoTopicInput);
    setGeneratedStory(story);
  };

  const handleRunSearch = () => {
    const res = AIOperatingSystemEngine.searchNaturalLanguage(searchQueryInput);
    setSearchResults(res);
  };

  const handleToggleVoice = () => {
    if (voiceState.isListening) {
      setVoiceState(prev => ({ ...prev, isListening: false, mode: 'IDLE' }));
    } else {
      setVoiceState(prev => ({
        ...prev,
        isListening: true,
        mode: 'STT_READY',
        transcript: 'Mendengarkan perintah suara: "Buat RPPH Hari Ini"'
      }));
    }
  };

  const parentSummary = AIOperatingSystemEngine.getAIParentSummary('Rayhan');
  const headmasterOps = AIOperatingSystemEngine.getAIHeadmasterOps();
  const foundationInsights = AIOperatingSystemEngine.getAIFoundationInsights();
  const adminAudit = AIOperatingSystemEngine.getAIAdminAudit();
  const schoolHealth = AIOperatingSystemEngine.getAISchoolHealthScore();

  return (
    <div className={`space-y-6 ${seniorTeacherMode ? 'text-lg p-2' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-3.5 py-1 rounded-full shadow-md">
              SPRINT P5 • TADE AI OPERATING SYSTEM v5.0
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-200 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/50 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PAUD Intelligence Core Active
            </span>
          </div>
          <h1 className={`${seniorTeacherMode ? 'text-3xl' : 'text-2xl sm:text-3xl'} font-black text-amber-200 mt-2.5 flex items-center gap-2.5 tracking-tight`}>
            <Brain className="w-8 h-8 text-amber-400 animate-pulse" /> Pusat Kecerdasan Buatan Operasional TK Asy Syifa
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1">
            Asisten cerdas terpadu untuk Guru, Kepala Sekolah, Admin, Yayasan, Wali Murid, dan Santri.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSeniorTeacherMode(!seniorTeacherMode)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md ${
              seniorTeacherMode
                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300'
                : 'bg-emerald-900 text-emerald-100 hover:bg-emerald-800 border border-emerald-600'
            }`}
          >
            <Sliders className="w-4 h-4" /> Mode Guru Senior
          </button>

          <button
            onClick={handleToggleVoice}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md ${
              voiceState.isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-500'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{voiceState.isListening ? 'Mendengarkan...' : 'Voice Command AI'}</span>
          </button>
        </div>
      </div>

      {/* Voice Bar Indicator */}
      {voiceState.isListening && (
        <div className="p-4 bg-amber-400 text-slate-950 rounded-2xl font-black text-xs flex items-center justify-between shadow-lg border-2 border-amber-500 animate-pulse">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-slate-950" />
            <span>{voiceState.transcript}</span>
          </div>
          <span className="bg-slate-950 text-amber-300 px-3 py-1 rounded-full text-[10px]">P3 VOICE CORE</span>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('TEACHER_AI')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'TEACHER_AI'
              ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-md ring-2 ring-emerald-600'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> 👩‍ass AI Guru (RPPM & RPPH)
        </button>

        <button
          onClick={() => setActiveTab('ASSESSMENT_AI')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'ASSESSMENT_AI'
              ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-md ring-2 ring-emerald-600'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          <Award className="w-4 h-4" /> 📊 AI Observasi & Rapor 6 Aspek
        </button>

        <button
          onClick={() => setActiveTab('STORY_AI')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'STORY_AI'
              ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-md ring-2 ring-emerald-600'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> 📰 AI Story Generator
        </button>

        <button
          onClick={() => setActiveTab('ROLE_HUBS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'ROLE_HUBS'
              ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-md ring-2 ring-emerald-600'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          <Users className="w-4 h-4" /> 🏫 Portal Peran (Wali/Kepsek/Yayasan/Admin)
        </button>

        <button
          onClick={() => setActiveTab('HEALTH_SCORE')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'HEALTH_SCORE'
              ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-md ring-2 ring-emerald-600'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          <Activity className="w-4 h-4" /> 💚 AI School Health Score
        </button>

        <button
          onClick={() => setActiveTab('SEARCH_MEMORY')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'SEARCH_MEMORY'
              ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-md ring-2 ring-emerald-600'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          <Search className="w-4 h-4" /> 🔍 AI Search & Digital Memory
        </button>

        <button
          onClick={() => setActiveTab('ACTIONS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'ACTIONS'
              ? 'bg-purple-900 text-amber-300 border-purple-950 shadow-md ring-2 ring-purple-600'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
          }`}
        >
          <Zap className="w-4 h-4" /> ⚡ Action confirmation ({proposedActions.filter(a => !a.confirmed).length})
        </button>
      </div>

      {/* TAB 1: TEACHER AI */}
      {activeTab === 'TEACHER_AI' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  AI TEACHER ASSISTANT
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Generator RPPM, RPPH & Ice Breaking PAUD</h3>
              </div>
              <button
                onClick={handleGenerateRppmRpph}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-2xl text-xs transition shadow-md cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Generate Rencana Pembelajaran Barunya
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Tema Pembelajaran Minggu Ini:</label>
                <input
                  type="text"
                  value={rppmTheme}
                  onChange={(e) => setRppmTheme(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-stone-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Target Usia Santri:</label>
                <input
                  type="text"
                  readOnly
                  value="Kelompok B (Usia 5-6 Tahun)"
                  className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-100 text-xs font-bold text-stone-700 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Display Generated RPPM */}
            {generatedRppm && (
              <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="text-sm font-black text-amber-950">📋 RPPM Minggu Ke-{generatedRppm.weekNumber}: {generatedRppm.theme}</span>
                  <span className="text-[10px] bg-amber-300 text-slate-950 px-2.5 py-0.5 rounded-full font-black">
                    Nilai: {generatedRppm.characterValue}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-900 block">🎯 Tujuan Pembelajaran Utama:</span>
                  <ul className="list-disc list-inside text-xs text-stone-700 font-medium space-y-0.5">
                    {generatedRppm.learningGoals.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
                  {generatedRppm.dailyActivities.map((day, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                      <span className="text-[10px] font-black text-emerald-900 uppercase block">{day.day} • {day.focus}</span>
                      <p className="text-xs font-bold text-slate-900">{day.activityTitle}</p>
                      <p className="text-[10px] text-stone-600 line-clamp-2">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display Generated Ice Breaking */}
            {iceBreaking && (
              <div className="bg-emerald-900 text-amber-100 p-5 rounded-2xl border-2 border-emerald-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300">🎉 Ice Breaking & Tepuk Semangat: {iceBreaking.title}</span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold">Lagu Gerak Ceria</span>
                </div>
                <pre className="text-xs font-sans font-bold whitespace-pre-wrap bg-emerald-950 p-3 rounded-xl border border-emerald-800 text-amber-200">
                  {iceBreaking.lyrics}
                </pre>
                <p className="text-[11px] italic text-emerald-200">
                  <span className="font-bold text-amber-300">Gerakan: </span>{iceBreaking.movements}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 2: ASSESSMENT AI */}
      {activeTab === 'ASSESSMENT_AI' && generatedAssessment && (
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                AI ASSESSMENT & RAPOR PAUD
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Evaluasi 6 Aspek Perkembangan & Narasi Rapor</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700">Santri:</span>
              <select
                value={selectedStudentForAssessment}
                onChange={(e) => setSelectedStudentForAssessment(e.target.value)}
                className="p-2 bg-stone-100 rounded-xl text-xs font-black border border-stone-300 text-slate-900"
              >
                <option value="Ananda Rayhan">Ananda Rayhan (Kelompok B)</option>
                <option value="Ananda Aisyah">Ananda Aisyah (Kelompok A)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedAssessment.aspects.map((asp, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-black text-emerald-900">{asp.code} • {asp.name}</span>
                  <span className="text-[10px] font-black bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full">
                    {asp.status}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">{asp.narrative}</p>
              </div>
            ))}
          </div>

          <div className="p-5 bg-emerald-900 text-white rounded-2xl space-y-2 border-2 border-emerald-700">
            <span className="text-xs font-black text-amber-300 block">📝 Ringkasan Narasi Rapor Semester AI:</span>
            <p className="text-xs font-medium text-emerald-100 leading-relaxed">{generatedAssessment.overallSummary}</p>
            <div className="pt-2 border-t border-emerald-800 text-xs font-serif italic text-amber-200">
              💡 {generatedAssessment.stimulationAdvice}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STORY AI */}
      {activeTab === 'STORY_AI' && generatedStory && (
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                AI STORY & CMS GENERATOR
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Otomasi Artikel, Headline & Caption Sosial Media</h3>
            </div>

            <button
              onClick={handleGenerateStory}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-2xl text-xs transition shadow-md cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Generate Artikel & SEO Barunya
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Topik Foto / Aktivitas Dokumentasi:</label>
              <input
                type="text"
                value={photoTopicInput}
                onChange={(e) => setPhotoTopicInput(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-stone-300 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 space-y-3">
              <span className="text-xs font-black text-amber-950 uppercase tracking-wider block">📰 Judul Artikel Otomatis AI:</span>
              <h4 className="text-base font-black text-slate-900">{generatedStory.title}</h4>
              <p className="text-xs text-stone-700 font-serif italic leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-amber-200">
                {generatedStory.fullArticle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-900 text-amber-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-black text-amber-400 block">📱 Instagram Caption Ready:</span>
                <p className="text-xs font-mono">{generatedStory.instagramCaption}</p>
              </div>

              <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl space-y-1 border border-emerald-700">
                <span className="text-[10px] font-black text-emerald-400 block">🔍 SEO Title & Meta Description:</span>
                <p className="text-xs font-bold">{generatedStory.seoTitle}</p>
                <p className="text-[11px] text-emerald-200">{generatedStory.seoDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROLE HUBS */}
      {activeTab === 'ROLE_HUBS' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-lg space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
            <button
              onClick={() => setActiveRoleHub('PARENT')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                activeRoleHub === 'PARENT' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-stone-100 text-stone-700'
              }`}
            >
              👨‍👩‍👧 AI Parent Hub (Wali Murid)
            </button>
            <button
              onClick={() => setActiveRoleHub('HEADMASTER')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                activeRoleHub === 'HEADMASTER' ? 'bg-emerald-800 text-amber-300 shadow-md' : 'bg-stone-100 text-stone-700'
              }`}
            >
              🏫 AI Headmaster Ops (Kepala Sekolah)
            </button>
            <button
              onClick={() => setActiveRoleHub('FOUNDATION')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                activeRoleHub === 'FOUNDATION' ? 'bg-teal-800 text-amber-300 shadow-md' : 'bg-stone-100 text-stone-700'
              }`}
            >
              🏛️ AI Foundation Insights (Yayasan)
            </button>
            <button
              onClick={() => setActiveRoleHub('ADMIN')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                activeRoleHub === 'ADMIN' ? 'bg-indigo-900 text-amber-300 shadow-md' : 'bg-stone-100 text-stone-700'
              }`}
            >
              🛠️ AI Admin Audit
            </button>
          </div>

          {activeRoleHub === 'PARENT' && (
            <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-4">
              <h4 className="text-base font-black text-slate-900">{parentSummary.todayTitle}</h4>
              <p className="text-xs text-stone-700 font-semibold">{parentSummary.todaySummary}</p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-bold text-emerald-900">
                🕌 Doa Hari Ini: {parentSummary.todayDoa}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-900 block">💡 Tips Stimulasi Di Rumah:</span>
                <ul className="list-disc list-inside text-xs text-stone-700 space-y-1">
                  {parentSummary.homeTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeRoleHub === 'HEADMASTER' && (
            <div className="p-5 bg-emerald-950 text-emerald-100 rounded-2xl border-2 border-emerald-700 space-y-4">
              <h4 className="text-base font-black text-amber-300">Ringkasan Ops Kepala Sekolah</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-900 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-300 block">Guru Aktif</span>
                  <span className="text-xl font-black text-white">{headmasterOps.activeTeachers} Orang</span>
                </div>
                <div className="bg-emerald-900 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-300 block">Tingkat Kehadiran</span>
                  <span className="text-xl font-black text-amber-300">{headmasterOps.attendancePercentage}%</span>
                </div>
                <div className="bg-emerald-900 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-300 block">Skor Kesehatan</span>
                  <span className="text-xl font-black text-emerald-200">{headmasterOps.healthScore}/100</span>
                </div>
              </div>
              <p className="text-xs text-emerald-200">{headmasterOps.statusSummary}</p>
            </div>
          )}

          {activeRoleHub === 'FOUNDATION' && (
            <div className="p-5 bg-teal-950 text-teal-100 rounded-2xl border-2 border-teal-700 space-y-4">
              <h4 className="text-base font-black text-amber-300">Laporan Strategis Yayasan</h4>
              <p className="text-xs text-teal-200">{foundationInsights.strategicSummary}</p>
            </div>
          )}

          {activeRoleHub === 'ADMIN' && (
            <div className="p-5 bg-indigo-950 text-amber-200 rounded-2xl border-2 border-indigo-700 space-y-4">
              <h4 className="text-base font-black text-white">Hasil Audit Otomatis AI Admin</h4>
              <p className="text-xs text-indigo-200">{adminAudit.auditMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: HEALTH SCORE */}
      {activeTab === 'HEALTH_SCORE' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                AI SCHOOL HEALTH CHECK
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Skor Kesehatan & Kesiapan Sistem Digital TK</h3>
            </div>
            <div className="bg-emerald-800 text-amber-300 px-4 py-2 rounded-2xl font-black text-lg shadow-md">
              {schoolHealth.overallScore} / 100
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schoolHealth.metrics.map((m, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-black text-stone-500 uppercase">{m.category}</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">{m.score}%</span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {m.status}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-medium">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SEARCH & MEMORY */}
      {activeTab === 'SEARCH_MEMORY' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-lg space-y-6">
          <div className="space-y-3 border-b border-stone-200 pb-4">
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              NATURAL AI SEARCH & DIGITAL MEMORY
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQueryInput}
                onChange={(e) => setSearchQueryInput(e.target.value)}
                placeholder="Contoh: Tampilkan semua kegiatan tema daun, Cari foto sholat..."
                className="flex-1 p-3 rounded-2xl border-2 border-stone-300 text-xs font-bold text-slate-900"
              />
              <button
                onClick={handleRunSearch}
                className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-2xl text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> Cari
              </button>
            </div>
          </div>

          {searchResults && (
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <p className="text-xs font-bold text-emerald-900">{searchResults.aiAnswer}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {searchResults.results.map((res: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                    <span className="text-[10px] font-black text-amber-800 uppercase block">{res.category}</span>
                    <h5 className="text-xs font-black text-slate-900">{res.title}</h5>
                    <p className="text-[10px] text-stone-600">{res.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Timeline Digital Memory */}
          {digitalMemory && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-black text-slate-900">Perjalanan Digital Ananda: {digitalMemory.studentName}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {digitalMemory.milestones.map((m) => (
                  <div key={m.id} className="bg-amber-50 p-3 rounded-2xl border border-amber-300 space-y-1.5">
                    <span className="text-[10px] font-black bg-amber-300 text-slate-950 px-2 py-0.5 rounded-md">
                      {m.date}
                    </span>
                    <h5 className="text-xs font-black text-slate-900">{m.title}</h5>
                    <p className="text-[10px] text-stone-700 leading-tight">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: ACTIONS */}
      {activeTab === 'ACTIONS' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-lg space-y-4">
          <h3 className="text-lg font-black text-slate-900">Daftar Tindakan AI Yang Memerlukan Konfirmasi Manusia</h3>
          <div className="space-y-3">
            {proposedActions.map((act) => (
              <div key={act.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    {act.targetModule}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">{act.title}</h4>
                </div>
                {act.confirmed ? (
                  <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                    ✓ Telah Dikonfirmasi
                  </span>
                ) : (
                  <button
                    onClick={() => handleConfirmAction(act.id)}
                    className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-amber-300 font-black text-xs rounded-xl cursor-pointer shadow-md"
                  >
                    Setujui & Jalankan Eksekusi
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
