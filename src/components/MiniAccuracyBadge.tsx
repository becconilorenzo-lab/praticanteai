import { useStore } from '../store/useStore';

export function MiniAccuracyBadge() {
  const accuracy = useStore((s) => s.accuracyIndex);

  const hasData = accuracy !== null;
  const pct = hasData ? accuracy : 0;

  const ringColor = !hasData
    ? 'text-slate-600'
    : accuracy > 80
      ? 'text-emerald-400'
      : accuracy >= 60
        ? 'text-amber-400'
        : 'text-rose-400';

  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="3.5"
            className="text-slate-700"
            stroke="currentColor"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="3.5"
            className={ringColor}
            stroke="currentColor"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={hasData ? offset : circumference}
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </svg>
        <span
          className={`absolute text-[10px] font-bold tabular-nums ${
            hasData ? 'text-white' : 'text-slate-500'
          }`}
        >
          {hasData ? `${Math.round(pct)}%` : 'N/D'}
        </span>
      </div>
      <span className="text-xs font-medium text-slate-400 hidden sm:inline">
        Accuratezza
      </span>
    </div>
  );
}
