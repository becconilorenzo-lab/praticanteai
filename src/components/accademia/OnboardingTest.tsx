import { useState } from 'react';
import {
  GraduationCap, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Sparkles, Trophy, ArrowRight, X, AlertCircle,
} from 'lucide-react';
import { DIAGNOSTIC_QUESTIONS } from '../../data/accademiaData';
import type { DiagnosticLevel } from '../../types';

interface OnboardingTestProps {
  onClose: (level: DiagnosticLevel) => void;
}

type Phase = 'intro' | 'quiz' | 'result';

export function OnboardingTest({ onClose }: OnboardingTestProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const total = DIAGNOSTIC_QUESTIONS.length;
  const question = DIAGNOSTIC_QUESTIONS[step];
  const correctCount = answers.filter(
    (a, i) => a === DIAGNOSTIC_QUESTIONS[i].correctIndex
  ).length;
  const allCorrect = correctCount === total;
  const level: DiagnosticLevel = allCorrect ? 'esperto' : 'base';

  const confirmAnswer = () => {
    if (selected === null) return;
    const next = [...answers, selected];
    setAnswers(next);
    setRevealed(true);
  };

  const goNext = () => {
    if (step + 1 >= total) {
      setPhase('result');
      return;
    }
    setStep(s => s + 1);
    setSelected(null);
    setRevealed(false);
  };

  const restart = () => {
    setPhase('intro');
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose(level)}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-5 text-white">
          <button
            onClick={() => onClose(level)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Valuta il tuo livello</h2>
              <p className="text-indigo-200 text-xs">Fast-Track Onboarding · 3 domande</p>
            </div>
          </div>
          {phase === 'quiz' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-200 mb-1.5">
                <span>Domanda {step + 1} di {total}</span>
                <span>{Math.round(((step) / total) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 bg-white rounded-full transition-all duration-500"
                  style={{ width: `${(step / total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {phase === 'intro' && (
            <div className="text-center space-y-5">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-60" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Trophy className="w-11 h-11 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Pronto a scoprire il tuo livello?</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-2">
                  Tre domande a risposta chiusa sulla partita doppia. Se rispondi
                  correttamente a tutte sblocchi subito il livello
                  <span className="font-semibold text-indigo-700"> Praticante Esperto</span>.
                  Altrimenti partiremo dal livello <span className="font-semibold text-slate-700">Base</span>.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  3 domande
                </div>
                <div className="w-px h-3 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  2 minuti
                </div>
              </div>
              <button
                onClick={() => setPhase('quiz')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
              >
                Inizia il test
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {phase === 'quiz' && question && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                  Contabilità &middot; Partita Doppia
                </span>
                <h3 className="font-bold text-slate-800 text-base mt-1.5 leading-snug">
                  {question.prompt}
                </h3>
              </div>
              <div className="space-y-2.5">
                {question.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === question.correctIndex;
                  const showCorrect = revealed && isCorrect;
                  const showWrong = revealed && isSelected && !isCorrect;
                  return (
                    <button
                      key={i}
                      disabled={revealed}
                      onClick={() => setSelected(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all flex items-start gap-3 ${
                        showCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : showWrong
                          ? 'border-rose-400 bg-rose-50 text-rose-900'
                          : isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40'
                      }`}
                    >
                      <span className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${
                        showCorrect
                          ? 'bg-emerald-500 text-white'
                          : showWrong
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="pt-0.5 leading-snug">{opt}</span>
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto mt-1" />}
                      {showWrong && <XCircle className="w-4 h-4 text-rose-500 ml-auto mt-1" />}
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    {selected === question.correctIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">
                        {selected === question.correctIndex ? 'Esatto. ' : 'Non proprio. '}
                      </span>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === 'result' && (
            <div className="space-y-5">
              <div
                className={`rounded-2xl p-5 text-center border-2 ${
                  allCorrect
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                    allCorrect
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-200'
                      : 'bg-amber-500 shadow-lg shadow-amber-200'
                  }`}
                >
                  {allCorrect
                    ? <Trophy className="w-8 h-8 text-white" />
                    : <GraduationCap className="w-8 h-8 text-white" />}
                </div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {allCorrect ? 'Test superato!' : 'Buon punto di partenza'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Hai risposto correttamente a <span className="font-bold">{correctCount}</span>
                  {' '}su {total} domande.
                </p>
                <div
                  className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    allCorrect
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Livello sbloccato: {allCorrect ? 'Praticante Esperto' : 'Base'}
                </div>
              </div>

              {allCorrect ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3 animate-fade-in">
                  <Trophy className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    <span className="font-bold">Hai saltato la rampa di partenza.</span>{' '}
                    Ti sblocchiamo subito gli esercizi avanzati e la dashboard con le
                    sfide ad alta difficoltà.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-900 leading-relaxed">
                    <span className="font-bold">Nessun problema.</span>{' '}
                    Inizierai dal livello Base con un percorso guidato. Potrai
                    sempre sbloccare il livello Esperto completando la Palestra.
                  </p>
                </div>
              )}

              <div className="flex gap-2.5">
                <button
                  onClick={restart}
                  className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Ripeti il test
                </button>
                <button
                  onClick={() => onClose(level)}
                  className={`flex-1 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                    allCorrect
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                  }`}
                >
                  Vai alla dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer (quiz only) */}
        {phase === 'quiz' && (
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0 || revealed}
              className="flex items-center gap-1 text-sm font-semibold text-slate-500 disabled:opacity-30 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Indietro
            </button>
            {!revealed ? (
              <button
                onClick={confirmAnswer}
                disabled={selected === null}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Conferma risposta
              </button>
            ) : (
              <button
                onClick={goNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                {step + 1 >= total ? 'Vedi risultato' : 'Prossima'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
