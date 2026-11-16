import { useStore } from '../store/useStore';
import { Target, RotateCcw } from 'lucide-react';

export function AccuracyWidget() {
  const accuracy = useStore((s) => s.accuracyIndex);
  const total = useStore((s) => s.completedExerciseIds.length);
  const resetAccuracy = useStore((s) => s.resetAccuracy);

  const hasData = accuracy !== null;

  const color = !hasData
    ? { ring: 'text-slate-300', track: 'text-slate-100', label: 'text-slate-400', bg: 'bg-slate-100', border: 'border-slate-200' }
    : accuracy > 80
      ? { ring: 'text-emerald-500', track: 'text-slate-100', label: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
      : accuracy >= 60
        ? { ring: 'text-amber-500', track: 'text-slate-100', label: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
        : { ring: 'text-rose-500', track: 'text-slate-100', label: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };

  const circumference = 2 * Math.PI * 52;
  const offset = hasData ? circumference - (accuracy / 100) * circumference : circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between gap-2.5 mb-5">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl ${color.bg} ${color.border} border flex items-center justify-center`}>
            <Target className={`w-5 h-5 ${color.label}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Indice di Accuratezza Contabile</h3>
            <p className="text-xs text-slate-500">Precisione sulle scritture contabili e normativa</p>
          </div>
        </div>

        {hasData && (
          <button
            onClick={resetAccuracy}
            title="Azzera indice di accuratezza"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              className={color.track}
              stroke="currentColor"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              className={color.ring}
              stroke="currentColor"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {hasData ? (
              <>
                <span className={`text-4xl font-bold ${color.label} tabular-nums`}>{Math.round(accuracy)}%</span>
                <span className="text-xs font-medium text-slate-400 mt-1">
                  {total} esercizi completati
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-slate-400 tabular-nums">N/D</span>
            )}
          </div>
        </div>

        {hasData ? (
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${accuracy > 80 ? 'bg-emerald-500' : accuracy >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} />
            <span className="text-xs font-semibold text-slate-600">
              {accuracy > 80 ? 'Livello ottimale' : accuracy >= 60 ? 'Da consolidare' : 'Richiede attenzione'}
            </span>
          </div>
        ) : (
          <p className="mt-4 text-xs text-slate-400 text-center max-w-[200px] leading-relaxed">
            Inizia la tua prima esercitazione per calcolare l'indice
          </p>
        )}
      </div>
    </div>
  );
}
