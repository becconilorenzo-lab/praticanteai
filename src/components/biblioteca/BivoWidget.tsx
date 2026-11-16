import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useToastStore } from '../../store/useToastStore';
import { GitBranch, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface BivoOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

interface BivoCase {
  id: string;
  title: string;
  scenario: string;
  options: BivoOption[];
}

const BIVO_CASES: BivoCase[] = [
  {
    id: 'bivo-1',
    title: 'Fiscalità differita su plusvalenze',
    scenario:
      'La società Alfa realizza una plusvalenza patrimoniale di € 1.000 ex art. 86 c.4 TUIR, frazionabile in 5 esercizi. Quale scrittura contabile è corretta per rilevare le imposte differite passive nel primo esercizio?',
    options: [
      {
        id: 'a',
        text: 'Dare IMPOSTE DIFFERITE IRES € 192 — Avere FONDO IMPOSTE DIFFERITE € 192',
        isCorrect: true,
        feedback: 'Corretto. Le imposte differite passive si rilevano a Dare nel conto economico e a Avere nel fondo di stato patrimoniale.',
      },
      {
        id: 'b',
        text: 'Dare FONDO IMPOSTE DIFFERITE € 192 — Avere IMPOSTE DIFFERITE IRES € 192',
        isCorrect: false,
        feedback: 'Sbagliato. Il fondo imposte differite è una passività di stato patrimoniale, non può stare in Dare.',
      },
      {
        id: 'c',
        text: 'Dare IMPOSTE CORRENTI IRES € 240 — Avere ERARIO c/IRES € 240',
        isCorrect: false,
        feedback: 'Sbagliato. Questa è la scrittura delle imposte correnti, non delle differite.',
      },
    ],
  },
  {
    id: 'bivo-2',
    title: 'Spese di manutenzione eccedenti',
    scenario:
      'La società Beta sostiene spese di manutenzione per € 2.000, di cui solo € 1.000 deducibili nell\'esercizio (limite del 5% ex art. 102 TUIR). Come si rilevano le imposte anticipate attive sull\'eccedenza?',
    options: [
      {
        id: 'a',
        text: 'Dare ATTIVITÀ PER IMPOSTE ANTICIPATE € 240 — Avere IMPOSTE ANTICIPATE IRES € 240',
        isCorrect: true,
        feedback: 'Corretto. L\'eccedenza non deducibile genera un\'attività per imposte anticipate attive.',
      },
      {
        id: 'b',
        text: 'Dare IMPOSTE ANTICIPATE IRES € 240 — Avere ATTIVITÀ PER IMPOSTE ANTICIPATE € 240',
        isCorrect: false,
        feedback: 'Sbagliato. Le imposte anticipate attive sono un\'attività, quindi vanno in Avere del conto economico.',
      },
      {
        id: 'c',
        text: 'Dare FONDO IMPOSTE DIFFERITE € 240 — Avere IMPOSTE € 240',
        isCorrect: false,
        feedback: 'Sbagliato. Questo riguarda le imposte differite, non le anticipate attive.',
      },
    ],
  },
];

export function BivoWidget() {
  const recordAttempt = useStore((s) => s.recordAttempt);
  const showToast = useToastStore((s) => s.showToast);
  const [caseIndex, setCaseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const currentCase = BIVO_CASES[caseIndex];

  const handleSelect = (option: BivoOption) => {
    if (answered) return;
    setSelectedOption(option.id);
    setAnswered(true);
    if (option.isCorrect) {
      recordAttempt(`bivo-${caseIndex + 1}`, 'medium', true);
      showToast('Valutazione corretta!', 'success');
    } else {
      recordAttempt(`bivo-${caseIndex + 1}`, 'medium', false);
      showToast('Valutazione errata', 'error');
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setAnswered(false);
  };

  const handleNextCase = () => {
    setCaseIndex((prev) => (prev + 1) % BIVO_CASES.length);
    handleReset();
  };

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-indigo-600" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Caso di Studio a Bivi</h4>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">
          {caseIndex + 1} / {BIVO_CASES.length}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        Analizza lo scenario e scegli la risposta corretta.
      </p>

      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-700 mb-1">{currentCase.title}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{currentCase.scenario}</p>
      </div>

      <div className="space-y-2.5">
        {currentCase.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showResult = answered && isSelected;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                showResult
                  ? option.isCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-rose-300 bg-rose-50 text-rose-800'
                  : answered
                    ? 'border-slate-200 bg-white text-slate-400 opacity-60 cursor-default'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  showResult
                    ? option.isCorrect
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-rose-500 bg-rose-500'
                    : 'border-slate-300'
                }`}>
                  {showResult && option.isCorrect && <CheckCircle2 className="w-3 h-3 text-white" />}
                  {showResult && !option.isCorrect && <XCircle className="w-3 h-3 text-white" />}
                </span>
                <span className="flex-1">{option.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {answered && selectedOption && (
        <div className="mt-3 rounded-lg p-3 flex items-start gap-2.5 animate-fade-in bg-slate-50 border border-slate-200">
          {currentCase.options.find(o => o.id === selectedOption)?.isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 leading-relaxed">
              {currentCase.options.find(o => o.id === selectedOption)?.feedback}
            </p>
            <button
              onClick={handleNextCase}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Prossimo caso
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
