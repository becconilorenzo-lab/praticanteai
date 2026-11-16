import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, CheckCircle, XCircle, Lightbulb,
  Star, RefreshCcw, Info, Dumbbell, Bot, X, Plus, GripVertical, Shuffle,
  Receipt, GraduationCap,
} from 'lucide-react';
import { TAccount, type TAccountEntry, type DraggableAccount } from './TAccount';
import { FlashcardEsameOrale } from './FlashcardEsameOrale';
import {
  ALL_EXERCISES_1000,
  TRACK_CONFIG,
  TRACK_ORDER,
  type TrackKey,
} from '../../data/exerciseGenerator1000';
import { useStore } from '../../store/useStore';
import { useToastStore } from '../../store/useToastStore';

type FeedbackState = 'idle' | 'success' | 'error';
type PalestraTab = 'mastrini' | 'flashcards';

interface UserEntry extends TAccountEntry {
  type: 'DARE' | 'AVERE';
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function PalestraSection() {
  const recordAttempt = useStore((s) => s.recordAttempt);
  const completedExerciseIds = useStore((s) => s.completedExerciseIds);
  const palestraTrack = useStore((s) => s.palestraTrack || 'base');
  const palestraTrackIndices = useStore((s) => s.palestraTrackIndices);
  const palestraDraft = useStore((s) => s.palestraDraft);
  const setPalestraTrack = useStore((s) => s.setPalestraTrack);
  const advancePalestraExercise = useStore((s) => s.advancePalestraExercise);
  const prevPalestraExercise = useStore((s) => s.prevPalestraExercise);
  const setPalestraDraft = useStore((s) => s.setPalestraDraft);
  const showToast = useToastStore((s) => s.showToast);

  const [activeTab, setActiveTab] = useState<PalestraTab>('mastrini');
  const activeTrack = palestraTrack;
  const trackPool = useMemo(
    () => ALL_EXERCISES_1000.filter(TRACK_CONFIG[activeTrack].filter),
    [activeTrack],
  );
  const trackIndex = palestraTrackIndices?.[activeTrack] ?? 0;

  const [dareEntries, setDareEntries] = useState<UserEntry[]>(() => {
    if (
      palestraDraft &&
      palestraDraft.track === activeTrack &&
      palestraDraft.exerciseIndex === trackIndex
    ) {
      return palestraDraft.dare;
    }
    return [];
  });
  const [avereEntries, setAvereEntries] = useState<UserEntry[]>(() => {
    if (
      palestraDraft &&
      palestraDraft.track === activeTrack &&
      palestraDraft.exerciseIndex === trackIndex
    ) {
      return palestraDraft.avere;
    }
    return [];
  });
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [shownHint, setShownHint] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [pickerAccountId, setPickerAccountId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [wrongEntryIds, setWrongEntryIds] = useState<Set<string>>(new Set());

  const exercise = trackPool[trackIndex % trackPool.length];

  const usedCodes = new Set([
    ...dareEntries.map(e => e.code),
    ...avereEntries.map(e => e.code),
  ]);

  const reset = useCallback(() => {
    setDareEntries([]);
    setAvereEntries([]);
    setFeedbackState('idle');
    setErrorMessage('');
    setShownHint(null);
    setShowExplanation(false);
    setPickerAccountId(null);
    setWrongEntryIds(new Set());
    setPalestraDraft(null);
  }, [setPalestraDraft]);

  useEffect(() => {
    if (
      palestraDraft &&
      palestraDraft.track === activeTrack &&
      palestraDraft.exerciseIndex === trackIndex
    ) {
      setDareEntries(palestraDraft.dare);
      setAvereEntries(palestraDraft.avere);
    } else {
      setDareEntries([]);
      setAvereEntries([]);
    }
    setFeedbackState('idle');
    setErrorMessage('');
    setShownHint(null);
    setShowExplanation(false);
    setPickerAccountId(null);
    setWrongEntryIds(new Set());
  }, [activeTrack, trackIndex]);

  const updateDraft = useCallback((d: UserEntry[], a: UserEntry[]) => {
    if (d.length === 0 && a.length === 0) {
      setPalestraDraft(null);
    } else {
      setPalestraDraft({
        track: activeTrack,
        exerciseIndex: trackIndex,
        dare: d,
        avere: a,
      });
    }
  }, [activeTrack, trackIndex, setPalestraDraft]);

  const switchTrack = (t: TrackKey) => {
    setPalestraTrack(t);
  };

  const handleGenerateNew = useCallback(() => {
    setGenerating(true);
    setTimeout(() => {
      advancePalestraExercise(activeTrack);
      setGenerating(false);
    }, 200);
  }, [advancePalestraExercise, activeTrack]);

  const addEntry = (side: 'dare' | 'avere', code: string, name: string) => {
    if (usedCodes.has(code)) return;
    const entry: UserEntry = {
      id: generateId(),
      code,
      name,
      amount: 0,
      type: side === 'dare' ? 'DARE' : 'AVERE',
    };
    if (side === 'dare') {
      const nextDare = [...dareEntries, entry];
      setDareEntries(nextDare);
      updateDraft(nextDare, avereEntries);
    } else {
      const nextAvere = [...avereEntries, entry];
      setAvereEntries(nextAvere);
      updateDraft(dareEntries, nextAvere);
    }
    setFeedbackState('idle');
    setErrorMessage('');
    setPickerAccountId(null);
  };

  const handleDropAccount = useCallback((side: 'dare' | 'avere', account: DraggableAccount) => {
    addEntry(side, account.code, account.name);
  }, [dareEntries, avereEntries, usedCodes]);

  const handleRemoveEntry = (side: 'dare' | 'avere', entryId: string) => {
    if (side === 'dare') {
      const nextDare = dareEntries.filter(e => e.id !== entryId);
      setDareEntries(nextDare);
      updateDraft(nextDare, avereEntries);
    } else {
      const nextAvere = avereEntries.filter(e => e.id !== entryId);
      setAvereEntries(nextAvere);
      updateDraft(dareEntries, nextAvere);
    }
    setFeedbackState('idle');
    setErrorMessage('');
  };

  const handleAmountChange = (side: 'dare' | 'avere', entryId: string, amount: number) => {
    const updater = (entries: UserEntry[]) =>
      entries.map(e => e.id === entryId ? { ...e, amount } : e);
    if (side === 'dare') {
      const nextDare = updater(dareEntries);
      setDareEntries(nextDare);
      updateDraft(nextDare, avereEntries);
    } else {
      const nextAvere = updater(avereEntries);
      setAvereEntries(nextAvere);
      updateDraft(dareEntries, nextAvere);
    }
    setFeedbackState('idle');
  };

  const handleVerify = () => {
    const totalDare = dareEntries.reduce((s, e) => s + e.amount, 0);
    const totalAvere = avereEntries.reduce((s, e) => s + e.amount, 0);
    const diff = activeTrack === 'base' ? 'easy' : activeTrack === 'intermedio' ? 'medium' : 'hard';

    if (dareEntries.length === 0 || avereEntries.length === 0) {
      setFeedbackState('error');
      setErrorMessage('Aggiungi almeno un conto nella colonna DARE e uno in AVERE.');
      recordAttempt(exercise.id, diff, false);
      showToast('Scrittura incompleta', 'error');
      return;
    }

    if (totalDare !== totalAvere) {
      setFeedbackState('error');
      setErrorMessage(`I totali non si bilanciano! DARE: €${totalDare.toLocaleString('it-IT')} — AVERE: €${totalAvere.toLocaleString('it-IT')}. Nella Partita Doppia i due lati devono sempre essere uguali.`);
      recordAttempt(exercise.id, diff, false);
      showToast('Scrittura non bilanciata', 'error');
      return;
    }

    const expectedDare = exercise.expectedEntries.filter(e => e.type === 'DARE');
    const expectedAvere = exercise.expectedEntries.filter(e => e.type === 'AVERE');

    const wrong = new Set<string>();

    const checkSide = (entries: UserEntry[], sol: typeof expectedDare) => {
      if (entries.length !== sol.length) {
        entries.forEach(e => wrong.add(e.id));
        return false;
      }
      let allOk = true;
      sol.forEach(s => {
        const match = entries.find(e => e.code === s.code && e.amount === s.amount);
        if (!match) allOk = false;
      });
      entries.forEach(e => {
        const match = sol.find(s => s.code === e.code && s.amount === e.amount);
        if (!match) {
          wrong.add(e.id);
          allOk = false;
        }
      });
      return allOk;
    };

    const dareOk = checkSide(dareEntries, expectedDare);
    const avereOk = checkSide(avereEntries, expectedAvere);

    if (dareOk && avereOk) {
      setFeedbackState('success');
      setShowExplanation(true);
      setWrongEntryIds(new Set());
      recordAttempt(exercise.id, diff, true);
      setPalestraDraft(null);
      showToast('Scrittura corretta!', 'success');
    } else {
      setFeedbackState('error');
      setWrongEntryIds(wrong);
      recordAttempt(exercise.id, diff, false);
      showToast('Scrittura errata', 'error');
      const wrongSide = [
        ...dareEntries.filter(e => expectedAvere.some(s => s.code === e.code)),
        ...avereEntries.filter(e => expectedDare.some(s => s.code === e.code)),
      ];
      if (wrongSide.length > 0) {
        setErrorMessage(`Il conto "${wrongSide[0].name}" (${wrongSide[0].code}) non è nel lato corretto.`);
      } else if (wrong.size > 0) {
        setErrorMessage('Alcuni conti o importi non corrispondono alla soluzione. Controlla le righe evidenziate in rosso.');
      } else {
        setErrorMessage('I conti utilizzati non sono tutti corretti. Ricontrolla gli importi o i conti scelti.');
      }
    }
  };

  const handleHint = () => {
    setShownHint(exercise.hint);
  };

  const handleNextExercise = () => {
    handleGenerateNew();
  };

  const handlePrevExercise = () => {
    if (trackIndex > 0) prevPalestraExercise(activeTrack);
  };

  const handleDragStart = (e: React.DragEvent, code: string, name: string) => {
    e.dataTransfer.setData('text/plain', code);
    e.dataTransfer.setData('application/x-account-name', name);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const diffConfig = TRACK_CONFIG[activeTrack];
  const trackProgress = trackPool.length > 0
    ? ((trackIndex % trackPool.length) + 1) / trackPool.length * 100
    : 0;

  const availableAccounts = useMemo(() => {
    const seen = new Set<string>();
    const accounts: { code: string; name: string }[] = [];
    for (const e of exercise.expectedEntries) {
      if (!seen.has(e.code)) {
        seen.add(e.code);
        accounts.push({ code: e.code, name: e.name });
      }
    }
    return accounts;
  }, [exercise]);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-xl">Palestra</h2>
          <p className="text-sm text-slate-500">
            {activeTab === 'mastrini'
              ? `1.000 esercizi OIC · ${TRACK_CONFIG[activeTrack].count} esercizi in questa traccia`
              : 'Preparazione Prova Orale · Flashcard con autovalutazione'}
          </p>
        </div>
      </div>

      {/* Tab Bar Navigation */}
      <div className="flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/70 shadow-inner">
        <button
          onClick={() => setActiveTab('mastrini')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
            activeTab === 'mastrini'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Scritture & Mastrini (Dare/Avere)
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
            activeTab === 'flashcards'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Flashcard Esame Orale
        </button>
      </div>

      {/* Tab 1: Scritture & Mastrini */}
      {activeTab === 'mastrini' ? (
        <div className="space-y-5 animate-fade-in">
          {/* Difficulty tracks */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">Traccia:</span>
          {TRACK_ORDER.map(t => {
            const cfg = TRACK_CONFIG[t];
            const isActive = activeTrack === t;
            return (
              <button
                key={t}
                onClick={() => switchTrack(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                  isActive ? cfg.activeBg : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cfg.label}
                <span className={`ml-1.5 ${isActive ? 'opacity-80' : 'text-slate-400'}`}>({cfg.count})</span>
              </button>
            );
          })}
        </div>

        {/* Track progress */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>
              Esercizio <span className="text-indigo-600">{(trackIndex % trackPool.length) + 1}</span> / {trackPool.length}
              <span className="ml-2 text-slate-400">· {exercise.difficulty} · {exercise.category}</span>
              {completedExerciseIds.includes(exercise.id) && (
                <span className="ml-2 text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                  ✓ Completato
                </span>
              )}
            </span>
            <span className="text-slate-400">{exercise.id}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${diffConfig.trackColor} transition-all duration-500`}
              style={{ width: `${Math.min(trackProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scenario card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${diffConfig.color}`}>
              {exercise.difficulty}
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              {exercise.category}
            </span>
          </div>
          <button
            onClick={handleHint}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Suggerimento
          </button>
        </div>

        <h3 className="font-bold text-slate-800 text-base mb-2">{exercise.title}</h3>
        <p className="text-slate-700 leading-relaxed text-sm">{exercise.description}</p>
        <p className="text-xs text-slate-400 mt-2 font-mono">Data: {exercise.date}</p>

        {shownHint && (
          <div className="mt-3 flex items-start gap-2 bg-indigo-50 border border-indigo-200 rounded-xl p-3 animate-fade-in">
            <Lightbulb className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-800 flex-1">{shownHint}</p>
            <button onClick={() => setShownHint(null)} className="text-indigo-400 hover:text-indigo-600" aria-label="Chiudi suggerimento">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* T-Account */}
      <TAccount
        dareEntries={dareEntries}
        avereEntries={avereEntries}
        onRemoveEntry={handleRemoveEntry}
        onAmountChange={handleAmountChange}
        onDropAccount={handleDropAccount}
        feedbackState={feedbackState}
        wrongEntryIds={wrongEntryIds}
      />

      {/* Account drawer with drag & drop */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Conti disponibili — trascina nella colonna DARE o AVERE, oppure clicca per scegliere
        </p>
        <div className="flex flex-wrap gap-2">
          {availableAccounts.map(({ code, name }) => {
            const isUsed = usedCodes.has(code);
            const isPickerOpen = pickerAccountId === code;
            return (
              <div key={code} className="relative">
                <button
                  draggable={!isUsed}
                  onDragStart={(e) => handleDragStart(e, code, name)}
                  onClick={() => setPickerAccountId(isPickerOpen ? null : code)}
                  disabled={isUsed}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center gap-1.5 ${
                    isUsed
                      ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed line-through'
                      : isPickerOpen
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 cursor-grab active:cursor-grabbing'
                  }`}
                >
                  {!isUsed && <GripVertical className="w-3.5 h-3.5 text-slate-400 opacity-60" />}
                  {name}
                  <span className="text-xs font-mono text-slate-400 ml-1">{code}</span>
                </button>

                {/* Mini-modal picker */}
                {isPickerOpen && !isUsed && (
                  <div className="absolute z-20 mt-2 left-0 bg-white border border-slate-200 rounded-xl shadow-xl p-2 flex gap-2 animate-fade-in min-w-[200px]">
                    <button
                      onClick={() => addEntry('dare', code, name)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Dare
                    </button>
                    <button
                      onClick={() => addEntry('avere', code, name)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Avere
                    </button>
                    <button
                      onClick={() => setPickerAccountId(null)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      aria-label="Chiudi"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Tutor Feedback Panel */}
      {feedbackState === 'error' && (
        <div className="bg-white border-2 border-rose-200 rounded-2xl p-4 animate-fade-in shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
                Praticante AI Suggestion
              </p>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">{errorMessage}</p>
              <p className="text-xs text-rose-600 mt-2 font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Valutazione registrata nell'Indice di Accuratezza
              </p>
            </div>
          </div>
        </div>
      )}

      {feedbackState === 'success' && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 animate-bounce-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-emerald-800 text-base">Bravissimo! Registrazione corretta!</p>
              <p className="text-xs text-emerald-600">Praticante AI ha verificato la tua scrittura.</p>
            </div>
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          {showExplanation && (
            <div className="mt-2 pl-1">
              <p className="text-xs font-semibold text-emerald-700 mb-1.5">Soluzione:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  {exercise.expectedEntries.filter(e => e.type === 'DARE').map(e => (
                    <div key={e.code} className="text-xs text-emerald-800 bg-emerald-100/50 rounded-lg px-2 py-1">
                      <span className="font-mono">{e.code}</span> {e.name}: €{e.amount.toLocaleString('it-IT')}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {exercise.expectedEntries.filter(e => e.type === 'AVERE').map(e => (
                    <div key={e.code} className="text-xs text-emerald-800 bg-emerald-100/50 rounded-lg px-2 py-1">
                      <span className="font-mono">{e.code}</span> {e.name}: €{e.amount.toLocaleString('it-IT')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pb-24 lg:pb-6 flex-wrap">
        <button
          onClick={handlePrevExercise}
          disabled={trackIndex === 0}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Precedente
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Ricomincia
        </button>

        <button
          onClick={handleGenerateNew}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
        >
          <Shuffle className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generazione…' : 'Salta esercizio'}
        </button>

        {feedbackState === 'success' ? (
          <button
            onClick={handleNextExercise}
            className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95"
          >
            Prossimo esercizio
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleVerify}
            className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95"
          >
            Verifica
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
        </div>
      ) : (
        <FlashcardEsameOrale />
      )}

    </div>
  );
}
