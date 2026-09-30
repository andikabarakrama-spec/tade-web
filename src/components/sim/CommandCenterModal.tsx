import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import { MODULE_TABS, ModuleTabDef } from './SIMLayout';
import {
  Student,
  Teacher,
  PPDBRecord,
  SPPBill,
  ArticleCMS,
  AuditLog,
  KnowledgeIndexItem
} from '../../types';
import {
  Search,
  Command,
  Sparkles,
  ArrowRight,
  GraduationCap,
  UserCheck,
  UserPlus,
  DollarSign,
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  X,
  CornerDownLeft,
  BookOpen,
  LayoutDashboard,
  CalendarCheck,
  Award,
  Database,
  Globe,
  HardDrive,
  BrainCircuit,
  Wrench,
  ChevronRight,
  Bookmark
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: string) => void;
}

export interface SearchResultItem {
  id: string;
  category: 'MODUL' | 'SISWA' | 'GURU' | 'PPDB' | 'SPP' | 'BERITA' | 'AUDIT' | 'KNOWLEDGE';
  categoryLabel: string;
  title: string;
  subtitle: string;
  icon: any;
  moduleId: string;
  allowedRoles: string[];
  metadata?: string;
  action: () => void;
}

export const CommandCenterModal: React.FC<Props> = ({ isOpen, onClose, onSelectModule }) => {
  const { activeRole, userProfile, currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Entities Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [ppdbList, setPpdbList] = useState<PPDBRecord[]>([]);
  const [sppList, setSppList] = useState<SPPBill[]>([]);
  const [articles, setArticles] = useState<ArticleCMS[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeIndexItem[]>([]);

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tade_recent_searches');
      return saved ? JSON.parse(saved) : ['presensi', 'spp', 'ppdb', 'e-rapor', 'backup'];
    } catch {
      return ['presensi', 'spp', 'ppdb', 'e-rapor', 'backup'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setDebouncedQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounce search query to optimize performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch underlying data lazily on first open or query change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchEntities = async () => {
      setLoading(true);
      try {
        const [stData, tcData, ppData, spData, arData, logData] = await Promise.all([
          DataService.getStudents(),
          DataService.getTeachers(),
          DataService.getPPDBRecords(),
          DataService.getSPP(),
          DataService.getArticles(),
          DataService.getAuditLogs()
        ]);

        if (isMounted) {
          setStudents(stData || []);
          setTeachers(tcData || []);
          setPpdbList(ppData || []);
          setSppList(spData || []);
          setArticles(arData || []);
          setAuditLogs(logData || []);
        }
      } catch (err) {
        console.error('Command center data fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEntities();
    return () => { isMounted = false; };
  }, [isOpen]);

  // Fetch Knowledge items when debouncedQuery exists
  useEffect(() => {
    if (!isOpen || !debouncedQuery) {
      setKnowledge([]);
      return;
    }

    let isMounted = true;
    DataService.searchKnowledge(debouncedQuery, activeRole, currentUser?.uid)
      .then(res => {
        if (isMounted) setKnowledge(res || []);
      })
      .catch(e => console.error('Knowledge search error:', e));

    return () => { isMounted = false; };
  }, [debouncedQuery, isOpen, activeRole, currentUser?.uid]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term.trim(), ...recentSearches.filter(s => s.toLowerCase() !== term.trim().toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('tade_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error('Save recent search error:', e);
    }
  };

  // Generate filtered search results with RBAC role enforcement
  const results = useMemo<SearchResultItem[]>(() => {
    const term = debouncedQuery.toLowerCase();
    const list: SearchResultItem[] = [];

    // 1. Modules & Commands
    const allowedModules = MODULE_TABS.filter(m => m.allowedRoles.includes(activeRole));
    allowedModules.forEach(m => {
      const match = !term ||
        m.name.toLowerCase().includes(term) ||
        m.code.toLowerCase().includes(term) ||
        m.category.toLowerCase().includes(term);

      if (match) {
        list.push({
          id: `mod-${m.id}`,
          category: 'MODUL',
          categoryLabel: 'Modul & Pintasan System',
          title: `${m.code}: ${m.name}`,
          subtitle: `Kategori: ${m.category}`,
          icon: m.icon,
          moduleId: m.id,
          allowedRoles: m.allowedRoles,
          action: () => {
            saveRecentSearch(m.name);
            onSelectModule(m.id);
            onClose();
          }
        });
      }
    });

    if (!term) return list; // If search query is empty, only return default module shortcuts

    // 2. Students (R3 / R6 / R8)
    if (['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'].includes(activeRole)) {
      students.forEach(s => {
        if (s.name.toLowerCase().includes(term) || (s.nisn && s.nisn.includes(term)) || (s.classGroup && s.classGroup.toLowerCase().includes(term))) {
          list.push({
            id: `st-${s.id}`,
            category: 'SISWA',
            categoryLabel: 'Data Siswa Master',
            title: s.name,
            subtitle: `NISN: ${s.nisn || '-'} • Rombel: ${s.classGroup || 'Belum diisi'} • Status: ${s.status}`,
            icon: GraduationCap,
            moduleId: 'r3',
            allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'],
            action: () => {
              saveRecentSearch(s.name);
              onSelectModule('r3');
              onClose();
            }
          });
        }
      });
    }

    // 3. Teachers & Staff (R4)
    if (['SUPER_ADMIN', 'KEPALA_SEKOLAH'].includes(activeRole)) {
      teachers.forEach(t => {
        if (t.name.toLowerCase().includes(term) || (t.nip && t.nip.includes(term)) || (t.jabatan && t.jabatan.toLowerCase().includes(term))) {
          list.push({
            id: `tc-${t.id}`,
            category: 'GURU',
            categoryLabel: 'Data Guru & PTK',
            title: t.name,
            subtitle: `NIP: ${t.nip || '-'} • Jabatan: ${t.jabatan || 'Guru'} • Status: ${t.status}`,
            icon: UserCheck,
            moduleId: 'r4',
            allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH'],
            action: () => {
              saveRecentSearch(t.name);
              onSelectModule('r4');
              onClose();
            }
          });
        }
      });
    }

    // 4. PPDB Candidates (R13)
    if (['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN'].includes(activeRole)) {
      ppdbList.forEach(p => {
        if (p.fullName.toLowerCase().includes(term) || p.registrationNo.toLowerCase().includes(term) || p.parentName.toLowerCase().includes(term)) {
          list.push({
            id: `pp-${p.id}`,
            category: 'PPDB',
            categoryLabel: 'Pendaftaran PPDB Online',
            title: `${p.registrationNo} - ${p.fullName}`,
            subtitle: `Orangtua: ${p.parentName} • Status: ${p.status}`,
            icon: UserPlus,
            moduleId: 'r13',
            allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN'],
            action: () => {
              saveRecentSearch(p.fullName);
              onSelectModule('r13');
              onClose();
            }
          });
        }
      });
    }

    // 5. SPP & Financial Bills (R10 / R11)
    if (['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'WALI_MURID'].includes(activeRole)) {
      sppList.forEach(sp => {
        if (sp.studentName.toLowerCase().includes(term) || sp.month.toLowerCase().includes(term) || sp.status.toLowerCase().includes(term)) {
          list.push({
            id: `sp-${sp.id}`,
            category: 'SPP',
            categoryLabel: 'Tagihan SPP & Keuangan',
            title: `SPP ${sp.studentName} (${sp.month})`,
            subtitle: `Nominal: Rp ${sp.amount.toLocaleString('id-ID')} • Status: ${sp.status}`,
            icon: DollarSign,
            moduleId: 'r10',
            allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'WALI_MURID'],
            action: () => {
              saveRecentSearch(sp.studentName);
              onSelectModule('r10');
              onClose();
            }
          });
        }
      });
    }

    // 6. News & CMS Articles (R22)
    if (['SUPER_ADMIN', 'KEPALA_SEKOLAH'].includes(activeRole)) {
      articles.forEach(a => {
        if (a.title.toLowerCase().includes(term) || a.category.toLowerCase().includes(term)) {
          list.push({
            id: `ar-${a.id}`,
            category: 'BERITA',
            categoryLabel: 'CMS Website Public',
            title: a.title,
            subtitle: `Kategori: ${a.category} • Penulis: ${a.author || 'Admin'}`,
            icon: Globe,
            moduleId: 'r22',
            allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH'],
            action: () => {
              saveRecentSearch(a.title);
              onSelectModule('r22');
              onClose();
            }
          });
        }
      });
    }

    // 7. Audit Logs (R24)
    if (activeRole === 'SUPER_ADMIN') {
      auditLogs.forEach(l => {
        if (l.action.toLowerCase().includes(term) || l.module.toLowerCase().includes(term) || l.userName.toLowerCase().includes(term)) {
          list.push({
            id: `lg-${l.id}`,
            category: 'AUDIT',
            categoryLabel: 'Audit Log System',
            title: l.action,
            subtitle: `Modul: ${l.module} • User: ${l.userName} (${l.userRole})`,
            icon: Shield,
            moduleId: 'r24',
            allowedRoles: ['SUPER_ADMIN'],
            action: () => {
              saveRecentSearch(l.action);
              onSelectModule('r24');
              onClose();
            }
          });
        }
      });
    }

    // 8. AI Knowledge Base
    knowledge.forEach(k => {
      list.push({
        id: `kn-${k.id}`,
        category: 'KNOWLEDGE',
        categoryLabel: 'Pusat Pengetahuan & Panduan AI',
        title: k.title,
        subtitle: `${k.description.slice(0, 80)}...`,
        icon: BrainCircuit,
        moduleId: 'r33',
        allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'],
        action: () => {
          saveRecentSearch(k.title);
          onSelectModule('r33');
          onClose();
        }
      });
    });

    return list;
  }, [debouncedQuery, activeRole, students, teachers, ppdbList, sppList, articles, auditLogs, knowledge, onSelectModule, onClose]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  // Handle Keyboard Navigation (ArrowUp, ArrowDown, Enter, ESC)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [results, selectedIndex, onClose]);

  // Auto-scroll selected element into view
  useEffect(() => {
    if (!resultsContainerRef.current) return;
    const selectedElem = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedElem) {
      selectedElem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center p-4 pt-12 sm:pt-20 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Universal Search & Command Center"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Header & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-stone-50/80">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
            <Command className="w-6 h-6" />
          </div>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari modul, siswa, guru, tagihan SPP, PPDB, arsip... (Tekan ESC untuk tutup)"
              className="w-full pl-3 pr-10 py-2.5 text-sm font-semibold text-slate-900 bg-transparent placeholder-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2.5 py-1 rounded-lg shrink-0 border border-slate-300">
            Role: {activeRole}
          </span>
        </div>

        {/* Quick Suggestion Chips if Search is Empty */}
        {!query && (
          <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500 font-extrabold flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" /> Riwayat Pencarian:
            </span>
            {recentSearches.map((term, i) => (
              <button
                key={i}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 font-medium hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition text-[11px]"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Search Results List Container */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[250px] max-h-[500px]"
        >
          {loading && (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <Sparkles className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold">Mencari di seluruh database TADE...</p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="py-12 text-center text-stone-500 space-y-3">
              <Search className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Tidak ada hasil ditemukan untuk "{query}"</p>
              <p className="text-xs text-stone-500">Coba kata kunci lain seperti: <i>presensi, spp, ppdb, siswa, guru, e-rapor, backup</i>.</p>
            </div>
          )}

          {!loading && results.map((item, index) => {
            const Icon = item.icon;
            const isSelected = index === selectedIndex;

            return (
              <div
                key={item.id}
                data-index={index}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-700 shadow-md transform scale-[1.005]'
                    : 'bg-white hover:bg-stone-50 text-slate-900 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isSelected ? 'bg-emerald-900 text-amber-300' : 'bg-stone-100 text-emerald-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {item.categoryLabel}
                      </span>
                    </div>
                    <h3 className={`font-extrabold text-xs mt-1 truncate ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-emerald-100' : 'text-stone-500'
                    }`}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelected && (
                    <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-1 rounded-md flex items-center gap-1">
                      Pilih <CornerDownLeft className="w-3 h-3" />
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] text-stone-600 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-stone-300 font-mono text-[10px]">↑↓</kbd> Navigasi
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-stone-300 font-mono text-[10px]">↵</kbd> Buka Modul
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-stone-300 font-mono text-[10px]">ESC</kbd> Tutup
            </span>
          </div>
          <div className="text-emerald-800 font-bold">
            TADE Command Center v36.0
          </div>
        </div>
      </div>
    </div>
  );
};
