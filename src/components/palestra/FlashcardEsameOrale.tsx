import { useState, useMemo, useCallback } from 'react';
import {
  GraduationCap, RotateCw, CheckCircle2, AlertCircle, HelpCircle,
  ChevronLeft, ChevronRight, Shuffle, BookOpen, Scale, Calculator,
  TrendingDown, Sparkles, RefreshCcw, Eye, Lightbulb,
} from 'lucide-react';
import {
  FLASHCARDS_DATA,
  FLASHCARD_CATEGORIES,
  type FlashcardCategory,
  type FlashcardRating,
} from '../../data/flashcardsData';
import { useStore } from '../../store/useStore';

type FilterCategory = 'Tutte' | FlashcardCategory;

const CATEGORY_ICONS: Record<FlashcardCategory, React.ElementType> = {
  'Diritto Tributario': Scale,
  'Diritto Commerciale': BookOpen,
  'Ragioneria': Calculator,
  'Crisi d\'Impresa': TrendingDown,
};

const CATEGORY_COLORS: Record<FlashcardCategory, { bg: string; text: string; border: string }> = {
  'Diritto Tributario': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Diritto Commerciale': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Ragioneria': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Crisi d\'Impresa': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export function FlashcardEsameOrale() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('Tutte');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const ratings = useStore((s) => s.flashcardRatings) || {};
  const recordFlashcardRating = useStore((s) => s.recordFlashcardRating);
  const resetFlashcardRatings = useStore((s) => s.resetFlashcardRatings);

  // Filter cards by selected category
  const filteredCards = useMemo(() => {
    if (selectedCategory === 'Tutte') return FLASHCARDS_DATA;
    return FLASHCARDS_DATA.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  // Keep index within bounds
  const currentCard = filteredCards[currentIndex % (filteredCards.length || 1)];

  // Statistics
  const stats = useMemo(() => {
    let padroneggiato = 0;
    let dubbio = 0;
    let daRivedere = 0;
    filteredCards.forEach((c) => {
      const r = ratings[c.id];
      if (r === 'padroneggiato') padroneggiato++;
      else if (r === 'dubbio') dubbio++;
      else if (r === 'da_rivedere') daRivedere++;
    });
    return {
      total: filteredCards.length,
      padroneggiato,
      dubbio,
      daRivedere,
      completate: padroneggiato + dubbio + daRivedere,
    };
  }, [filteredCards, ratings]);

  const handleCategoryChange = (cat: FilterCategory) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  }, [filteredCards.length]);

  const handleShuffle = useCallback(() => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentIndex(randomIndex);
  }, [filteredCards.length]);

  const handleRate = useCallback(
    (rating: FlashcardRating) => {
      if (!currentCard) return;
      recordFlashcardRating(currentCard.id, rating);
    },
    [currentCard, recordFlashcardRating],
  );

  const handleResetProgress = () => {
    resetFlashcardRatings();
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  if (!currentCard) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Nessuna flashcard disponibile per questa categoria.</p>
      </div>
    );
  }

  const currentRating = ratings[currentCard.id];
  const IconComponent = CATEGORY_ICONS[currentCard.category] || BookOpen;
  const colors = CATEGORY_COLORS[currentCard.category] || {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Filtra per Materia d'Esame:
          </span>
          <button
            onClick={handleResetProgress}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCcw className="w-3 h-3" />
            Resetta autovalutazioni
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleCategoryChange('Tutte')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
              selectedCategory === 'Tutte'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            Tutte le Materie ({FLASHCARDS_DATA.length})
          </button>

          {FLASHCARD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = FLASHCARDS_DATA.filter((c) => c.category === cat).length;
            const CatIcon = CATEGORY_ICONS[cat];
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 flex items-center gap-1.5 transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <CatIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                {cat}
                <span className={`text-[11px] ml-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress & stats bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">
              Carta <span className="text-indigo-600 font-bold">{currentIndex + 1}</span> di {filteredCards.length}
            </span>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {stats.padroneggiato} Padroneggiati
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
                <HelpCircle className="w-3 h-3 text-amber-600" /> {stats.dubbio} Dubbi
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-semibold">
                <AlertCircle className="w-3 h-3 text-rose-600" /> {stats.daRivedere} Da rivedere
              </span>
            </div>
          </div>

          <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stats.completate / (stats.total || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="perspective-1000">
        <div
          className={`relative bg-white rounded-3xl border-2 transition-all duration-300 shadow-md ${
            isFlipped
              ? 'border-indigo-300 shadow-indigo-100/50'
              : 'border-slate-200/90 shadow-slate-100'
          }`}
          style={{ minHeight: '360px' }}
        >
          {/* Card Header with Badges */}
          <div className="p-5 lg:p-6 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${colors.bg} ${colors.text} ${colors.border}`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {currentCard.category}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {currentCard.topic}
              </span>
              {currentCard.normativa && (
                <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                  {currentCard.normativa}
                </span>
              )}
            </div>

            {/* Current rating badge if already evaluated */}
            {currentRating && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in ${
                  currentRating === 'padroneggiato'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentRating === 'dubbio'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {currentRating === 'padroneggiato' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {currentRating === 'dubbio' && <HelpCircle className="w-3.5 h-3.5" />}
                {currentRating === 'da_rivedere' && <AlertCircle className="w-3.5 h-3.5" />}
                {currentRating === 'padroneggiato'
                  ? 'Padroneggiato'
                  : currentRating === 'dubbio'
                  ? 'Dubbio'
                  : 'Da rivedere'}
              </span>
            )}
          </div>

          {/* Card Body: FRONTE vs RETRO */}
          <div className="p-6 lg:p-8">
            {!isFlipped ? (
              /* ── FRONTE (DOMANDA) ── */
              <div className="space-y-6 flex flex-col justify-between" style={{ minHeight: '220px' }}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Domanda Commissione d'Esame Orale
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-snug">
                    "{currentCard.question}"
                  </h3>
                  <p className="text-xs text-slate-400 italic">
                    💡 Formula mentalmente la tua risposta prima di girare la carta per visualizzare la scaletta della commissione.
                  </p>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleFlip}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all active:scale-95 group"
                  >
                    <Eye className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
                    Mostra Risposta
                    <RotateCw className="w-4 h-4 text-indigo-300 ml-1" />
                  </button>
                </div>
              </div>
            ) : (
              /* ── RETRO (SCALETTA RISPOSTA) ── */
              <div className="space-y-5 animate-fade-in" style={{ minHeight: '220px' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Scaletta Risposta della Commissione
                  </div>
                  <button
                    onClick={handleFlip}
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Mostra Domanda
                  </button>
                </div>

                {/* Bullet points outline */}
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <ul className="space-y-3">
                    {currentCard.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 leading-relaxed">
                        <span className="shrink-0 w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="flex-1 font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Autoevaluation Footer - always accessible or prominently shown when flipped */}
          <div className="p-4 lg:p-5 bg-slate-50/70 border-t border-slate-100 rounded-b-3xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Autovalutazione:
              </span>

              {/* 3 Autoevaluation Buttons */}
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                {/* 🔴 Da Rivedere */}
                <button
                  onClick={() => handleRate('da_rivedere')}
                  className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all active:scale-95 ${
                    currentRating === 'da_rivedere'
                      ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-200'
                      : 'bg-white border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Da rivedere</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${currentRating === 'da_rivedere' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-700'}`}>
                    -0.10%
                  </span>
                </button>

                {/* 🟡 Dubbio */}
                <button
                  onClick={() => handleRate('dubbio')}
                  className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all active:scale-95 ${
                    currentRating === 'dubbio'
                      ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200'
                      : 'bg-white border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Dubbio</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${currentRating === 'dubbio' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700'}`}>
                    +0.02%
                  </span>
                </button>

                {/* 🟢 Padroneggiato */}
                <button
                  onClick={() => handleRate('padroneggiato')}
                  className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all active:scale-95 ${
                    currentRating === 'padroneggiato'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200'
                      : 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Padroneggiato</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${currentRating === 'padroneggiato' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                    +0.10%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          disabled={filteredCards.length <= 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Precedente
        </button>

        <button
          onClick={handleShuffle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          title="Pesca una carta casuale"
        >
          <Shuffle className="w-4 h-4" />
          Casuale
        </button>

        <button
          onClick={handleNext}
          disabled={filteredCards.length <= 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-40"
        >
          Successiva
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
