import React, { useState, useMemo, useEffect } from 'react';
import { 
  Library, ArrowLeft, ArrowRight, Search, X, Star, CheckCircle2, 
  Circle, Clock, Sparkles, ChevronRight, BookOpen, GraduationCap, 
  Scale, Calculator, Briefcase, FileText, Layers, FolderOpen
} from 'lucide-react';
import { marked } from 'marked';
import { 
  RACCOLTE, 
  getRaccoltaCategories 
} from '../../data/raccolteData';

const STORAGE_FAVS = 'praticante_materiali_favorites';
const STORAGE_STUDIED = 'praticante_materiali_studied';

function isWithin7Days(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff >= 0 && diff < 7 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function renderCollectionIcon(iconName?: string) {
  switch (iconName) {
    case 'GraduationCap':
      return <GraduationCap className="w-6 h-6 text-indigo-600" />;
    case 'Scale':
      return <Scale className="w-6 h-6 text-indigo-600" />;
    case 'Calculator':
      return <Calculator className="w-6 h-6 text-indigo-600" />;
    case 'Briefcase':
      return <Briefcase className="w-6 h-6 text-indigo-600" />;
    case 'FileText':
      return <FileText className="w-6 h-6 text-indigo-600" />;
    case 'Layers':
      return <Layers className="w-6 h-6 text-indigo-600" />;
    case 'BookOpen':
    default:
      return <BookOpen className="w-6 h-6 text-indigo-600" />;
  }
}

export function BibliotecaSection() {
  // Navigation State
  const [selectedRaccoltaId, setSelectedRaccoltaId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Filters within a collection (Level 2)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'to_study' | 'studied'>('all');

  // Persistence (Favorites & Studied sections)
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_FAVS);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [studied, setStudied] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_STUDIED);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVS, JSON.stringify(Array.from(favorites)));
    } catch { /* ignore */ }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STUDIED, JSON.stringify(Array.from(studied)));
    } catch { /* ignore */ }
  }, [studied]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleStudied = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStudied(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Active Raccolta
  const activeRaccolta = useMemo(() => {
    if (!selectedRaccoltaId) return null;
    return RACCOLTE.find(r => r.id === selectedRaccoltaId) || null;
  }, [selectedRaccoltaId]);

  // Categories for the active collection
  const activeCategories = useMemo(() => {
    if (!activeRaccolta) return [];
    return getRaccoltaCategories(activeRaccolta);
  }, [activeRaccolta]);

  // Filtered sections within active collection
  const filteredSections = useMemo(() => {
    if (!activeRaccolta) return [];
    const query = searchQuery.trim().toLowerCase();

    return activeRaccolta.sections.filter(sec => {
      if (selectedCategory !== 'Tutti' && sec.category !== selectedCategory) {
        return false;
      }

      if (filterType === 'favorites' && !favorites.has(sec.id)) return false;
      if (filterType === 'studied' && !studied.has(sec.id)) return false;
      if (filterType === 'to_study' && studied.has(sec.id)) return false;

      if (query) {
        const inTitle = sec.title.toLowerCase().includes(query);
        const inSummary = sec.summary.toLowerCase().includes(query);
        const inContent = sec.content.toLowerCase().includes(query);
        const inPage = sec.page.toString() === query;
        if (!inTitle && !inSummary && !inContent && !inPage) {
          return false;
        }
      }

      return true;
    });
  }, [activeRaccolta, searchQuery, selectedCategory, filterType, favorites, studied]);

  // Active section for reading view (Level 3)
  const currentSection = useMemo(() => {
    if (!activeRaccolta || !selectedSectionId) return null;
    return activeRaccolta.sections.find(s => s.id === selectedSectionId) || null;
  }, [activeRaccolta, selectedSectionId]);

  // Navigation between sections in reading view
  const currentSectionIndex = useMemo(() => {
    if (!activeRaccolta || !currentSection) return -1;
    return activeRaccolta.sections.findIndex(s => s.id === currentSection.id);
  }, [activeRaccolta, currentSection]);

  const prevSection = (activeRaccolta && currentSectionIndex > 0)
    ? activeRaccolta.sections[currentSectionIndex - 1]
    : null;
  const nextSection = (activeRaccolta && currentSectionIndex < activeRaccolta.sections.length - 1)
    ? activeRaccolta.sections[currentSectionIndex + 1]
    : null;

  // Render markdown content safely
  const renderedContentHtml = useMemo(() => {
    if (!currentSection) return '';
    try {
      return marked.parse(currentSection.content) as string;
    } catch {
      return `<p>${currentSection.content}</p>`;
    }
  }, [currentSection]);

  // Helper to open a collection
  const openRaccolta = (raccoltaId: string) => {
    setSelectedRaccoltaId(raccoltaId);
    setSelectedSectionId(null);
    setSearchQuery('');
    setSelectedCategory('Tutti');
    setFilterType('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to close reading view
  const closeReadingView = () => {
    setSelectedSectionId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to go back to collections list
  const backToRaccolte = () => {
    setSelectedRaccoltaId(null);
    setSelectedSectionId(null);
    setSearchQuery('');
    setSelectedCategory('Tutti');
    setFilterType('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // LEVEL 3: READING VIEW (DETTAGLIO SEZIONE)
  // =========================================================================
  if (activeRaccolta && currentSection) {
    const isFav = favorites.has(currentSection.id);
    const isDone = studied.has(currentSection.id);

    return (
      <div className="space-y-6 animate-fade-in pb-24 lg:pb-6">
        {/* Breadcrumb & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-4 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={closeReadingView}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              Torna alla raccolta
            </button>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline line-clamp-1 max-w-[220px]">
              {activeRaccolta.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(currentSection.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isFav 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
              {isFav ? 'Nei Preferiti' : 'Aggiungi a Preferiti'}
            </button>

            <button
              onClick={() => toggleStudied(currentSection.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isDone 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Già Studiato
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-slate-400" />
                  Segna come Studiato
                </>
              )}
            </button>
          </div>
        </div>

        {/* Article Reading Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 lg:px-10 py-8 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-100">
                {currentSection.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Pagina {currentSection.page} della dispensa
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                ~{currentSection.readingMinutes} min lettura
              </span>
              {isWithin7Days(currentSection.updatedAt) && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Nuovo
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {currentSection.title}
            </h1>
            
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Appunti e schemi per l'esame di stato · Dottori Commercialisti ed Esperti Contabili
            </p>
          </div>

          {/* Markdown Content */}
          <div className="px-6 lg:px-12 py-10">
            <div 
              className="prose prose-slate max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-h2:mt-8
                prose-h3:text-lg prose-h3:text-slate-800 prose-h3:mt-6
                prose-p:text-[15px] prose-p:leading-[1.75] prose-p:text-slate-700
                prose-strong:text-slate-900 prose-strong:font-bold
                prose-ul:space-y-1.5 prose-li:text-slate-700 prose-li:text-[15px]
                prose-table:w-full prose-table:text-sm prose-table:border prose-table:border-slate-200 prose-table:my-6
                prose-th:bg-slate-100 prose-th:p-3 prose-th:text-slate-800 prose-th:border prose-th:border-slate-200
                prose-td:p-3 prose-td:border prose-td:border-slate-200 prose-td:text-slate-700
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: renderedContentHtml }}
            />
          </div>

          {/* Bottom Footer Navigation */}
          <div className="px-6 lg:px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {prevSection ? (
                <button
                  onClick={() => {
                    setSelectedSectionId(prevSection.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors group text-left"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
                  <div>
                    <span className="block text-[11px] text-slate-400 uppercase font-medium">Precedente</span>
                    <span className="line-clamp-1">{prevSection.title}</span>
                  </div>
                </button>
              ) : <div />}
            </div>

            <div className="text-center">
              <button
                onClick={() => toggleStudied(currentSection.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all inline-flex items-center gap-2 ${
                  isDone 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isDone ? 'Completato! Clicca per deselezionare' : 'Segna Sezione come Completata'}
              </button>
            </div>

            <div>
              {nextSection ? (
                <button
                  onClick={() => {
                    setSelectedSectionId(nextSection.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors group text-right"
                >
                  <div>
                    <span className="block text-[11px] text-slate-400 uppercase font-medium">Successivo</span>
                    <span className="line-clamp-1">{nextSection.title}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LEVEL 2: CONTENUTO DELLA RACCOLTA
  // =========================================================================
  if (activeRaccolta) {
    const totalCount = activeRaccolta.sections.length;
    const studiedCount = activeRaccolta.sections.filter(s => studied.has(s.id)).length;
    const progressPercent = totalCount > 0 ? Math.round((studiedCount / totalCount) * 100) : 0;
    const favCount = activeRaccolta.sections.filter(s => favorites.has(s.id)).length;

    return (
      <div className="space-y-6 animate-fade-in pb-24 lg:pb-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={backToRaccolte}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            Torna alle raccolte
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            {activeRaccolta.badge}
          </span>
        </div>

        {/* Raccolta Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {activeRaccolta.badge}
              </span>
              <span className="text-xs text-slate-300">{totalCount} sezioni disponibili</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeRaccolta.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeRaccolta.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3.5 min-w-[210px] w-full md:w-auto">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-200">Avanzamento Studio</span>
              <span className="text-emerald-300">{studiedCount} / {totalCount} ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca per titolo, parole chiave, articolo o principio (es. OIC 25, PEX, art. 96, fusione)..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Status Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto shrink-0 overflow-x-auto max-w-full">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tutti ({totalCount})
              </button>
              <button
                onClick={() => setFilterType('favorites')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === 'favorites'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                Preferiti ({favCount})
              </button>
              <button
                onClick={() => setFilterType('to_study')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === 'to_study'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Da studiare ({totalCount - studiedCount})
              </button>
              <button
                onClick={() => setFilterType('studied')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterType === 'studied'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Completati ({studiedCount})
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          {activeCategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
                Categorie:
              </span>
              <button
                onClick={() => setSelectedCategory('Tutti')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                  selectedCategory === 'Tutti'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tutte le categorie
              </button>
              {activeCategories.map(cat => {
                const count = activeRaccolta.sections.filter(s => s.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Counter and Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Mostrando <span className="font-bold text-slate-800">{filteredSections.length}</span> capitoli su {totalCount}
            {selectedCategory !== 'Tutti' && ` nella categoria "${selectedCategory}"`}
            {searchQuery && ` per "${searchQuery}"`}
          </div>

          {(searchQuery || selectedCategory !== 'Tutti' || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tutti');
                setFilterType('all');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
            >
              Azzera filtri
            </button>
          )}
        </div>

        {/* Section Cards Grid */}
        {filteredSections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSections.map(sec => {
              const isFav = favorites.has(sec.id);
              const isDone = studied.has(sec.id);

              return (
                <div
                  key={sec.id}
                  onClick={() => {
                    setSelectedSectionId(sec.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between p-5 relative ${
                    isDone 
                      ? 'border-emerald-200/80 bg-emerald-50/20' 
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {sec.category}
                      </span>
                      
                      <div className="flex items-center gap-1 -mr-1">
                        <button
                          onClick={(e) => toggleFavorite(sec.id, e)}
                          title={isFav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                          className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-50 transition-colors"
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>

                        <button
                          onClick={(e) => toggleStudied(sec.id, e)}
                          title={isDone ? "Segna come da studiare" : "Segna come completato"}
                          className={`p-1 rounded-lg transition-colors ${
                            isDone 
                              ? 'text-emerald-600 hover:text-slate-400' 
                              : 'text-slate-300 hover:text-emerald-600'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 fill-emerald-100 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {sec.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                      {sec.summary || 'Trattazione dottrinale e normativa per la preparazione dell\'esame di abilitazione.'}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <span>Pagina {sec.page}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ~{sec.readingMinutes}m
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-0.5 text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      Leggi <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <FileText className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Nessun appunto trovato</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Nessun capitolo corrisponde ai criteri di ricerca. Prova a modificare i termini o a selezionare un'altra categoria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tutti');
                setFilterType('all');
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Ripristina tutti i materiali
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // LEVEL 1: ELENCO DELLE RACCOLTE
  // =========================================================================
  return (
    <div className="space-y-6 animate-fade-in pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
          <Library className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-xl sm:text-2xl tracking-tight">Biblioteca Interattiva</h1>
          <p className="text-sm text-slate-500">
            Raccolte di appunti, schemi operativi e testi per la preparazione all'Esame di Stato
          </p>
        </div>
      </div>

      {/* Grid of Collections Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RACCOLTE.map(raccolta => {
          const totalSections = raccolta.sections.length;
          const studiedInCollection = raccolta.sections.filter(s => studied.has(s.id)).length;
          const progress = totalSections > 0 ? Math.round((studiedInCollection / totalSections) * 100) : 0;

          return (
            <div
              key={raccolta.id}
              onClick={() => openRaccolta(raccolta.id)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer relative"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <span className="group-hover:scale-110 transition-transform">
                      {renderCollectionIcon(raccolta.iconName)}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {raccolta.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {raccolta.title}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {raccolta.description}
                </p>
              </div>

              {/* Progress and Stats Box */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500 inline-flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                    {totalSections} sezioni
                  </span>
                  <span className={studiedInCollection > 0 ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                    {studiedInCollection} / {totalSections} ({progress}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Action button */}
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>Esplora raccolta</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
