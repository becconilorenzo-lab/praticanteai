import { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import {
  toLocalDateStr,
  fromLocalDateStr,
  addDays,
  IT_DAYS,
  type PlanActivity,
} from '../../utils/planGenerator';

interface WeeklyViewProps {
  onBack: () => void;
}

const TIPO_COLORS: Record<string, string> = {
  biblioteca: 'bg-rose-50 text-rose-700 border-rose-200',
  palestra: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  simulazione: 'bg-amber-50 text-amber-700 border-amber-200',
};

const FASE_LABELS: Record<string, string> = {
  apprendimento: 'Fase 1: Apprendimento',
  pratica: 'Fase 2: Pratica',
  simulazione: 'Fase 3: Simulazione',
  ripasso: 'Fase 4: Ripasso Finale',
};

export function WeeklyView({ onBack }: WeeklyViewProps) {
  const studyPlan = useStore((s) => s.studyPlan);
  const toggleActivity = useStore((s) => s.toggleActivityCompletion);

  const todayStr = useMemo(() => toLocalDateStr(new Date()), []);

  // Raggruppa tutte le attività per settimana di calendario (da lunedì a domenica)
  const weeks = useMemo(() => {
    if (!studyPlan || studyPlan.length === 0) return [];

    const weekMap = new Map<string, { weekNumber: number; mondayStr: string; sundayStr: string; faseId: string; activities: PlanActivity[] }>();

    for (const act of studyPlan) {
      if (act.saltata) continue;
      const d = fromLocalDateStr(act.data);
      const day = d.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const mon = addDays(d, diffToMonday);
      const sun = addDays(mon, 6);
      const monStr = toLocalDateStr(mon);
      const sunStr = toLocalDateStr(sun);

      if (!weekMap.has(monStr)) {
        weekMap.set(monStr, {
          weekNumber: 0,
          mondayStr: monStr,
          sundayStr: sunStr,
          faseId: act.faseId,
          activities: [],
        });
      }
      weekMap.get(monStr)!.activities.push(act);
    }

    const sortedWeeks = [...weekMap.values()].sort((a, b) => a.mondayStr.localeCompare(b.mondayStr));
    sortedWeeks.forEach((w, idx) => {
      w.weekNumber = idx + 1;
    });

    return sortedWeeks;
  }, [studyPlan]);

  const [currentWeekIdx, setCurrentWeekIdx] = useState(() => {
    if (weeks.length === 0) return 0;
    const currentIdx = weeks.findIndex((w) => todayStr >= w.mondayStr && todayStr <= w.sundayStr);
    return currentIdx >= 0 ? currentIdx : 0;
  });

  const week = weeks[currentWeekIdx];

  // Raggruppa per data dentro la settimana
  const activitiesByDay = useMemo(() => {
    if (!week) return new Map<string, PlanActivity[]>();
    const map = new Map<string, PlanActivity[]>();
    for (const act of week.activities) {
      if (!map.has(act.data)) map.set(act.data, []);
      map.get(act.data)!.push(act);
    }
    return map;
  }, [week]);

  if (!week) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-slate-500">Nessuna settimana programmata nel piano.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          Torna alla Dashboard
        </button>
      </div>
    );
  }

  const weekTotalMin = week.activities.reduce((s, a) => s + a.durataMin, 0);
  const weekDoneMin = week.activities.filter((a) => a.completata).reduce((s, a) => s + a.durataMin, 0);
  const weekProgressPercent = weekTotalMin > 0 ? Math.round((weekDoneMin / weekTotalMin) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-800">Piano Settimanale</h2>
          <p className="text-xs text-slate-500">
            {weeks.length} settimane totali di preparazione
          </p>
        </div>
      </div>

      {/* Navigazione Settimana & Chip Fase */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <button
          type="button"
          onClick={() => setCurrentWeekIdx((i) => Math.max(0, i - 1))}
          disabled={currentWeekIdx === 0}
          className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>

        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-slate-800">Settimana {week.weekNumber}</p>
          <p className="text-xs text-slate-500">
            {week.mondayStr} – {week.sundayStr}
          </p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {FASE_LABELS[week.faseId] ?? week.faseId}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setCurrentWeekIdx((i) => Math.min(weeks.length - 1, i + 1))}
          disabled={currentWeekIdx === weeks.length - 1}
          className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Progressi in minuti della settimana */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-600">Avanzamento settimana</span>
          <span className="font-bold text-indigo-600 tabular-nums">
            {Math.round(weekDoneMin / 60)}h {weekDoneMin % 60}m / {Math.round(weekTotalMin / 60)}h {weekTotalMin % 60}m ({weekProgressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${weekProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Attività raggruppate per giorno */}
      <div className="space-y-4">
        {[...activitiesByDay.entries()].map(([dateStr, activities]) => {
          const dObj = fromLocalDateStr(dateStr);
          const dayName = IT_DAYS[dObj.getDay()];
          const isToday = dateStr === todayStr;

          return (
            <div key={dateStr} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">
                  {dayName} {dateStr}
                </span>
                {isToday && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Oggi
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {activities.map((act) => {
                  const colorClass = TIPO_COLORS[act.tipo] ?? 'bg-slate-50 text-slate-700 border-slate-200';
                  return (
                    <div
                      key={act.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 bg-white transition ${
                        act.completata ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleActivity(act.id)}
                          className="shrink-0 text-slate-400 hover:text-indigo-600 transition"
                        >
                          {act.completata ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${act.completata ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {act.titolo}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${colorClass}`}>
                              {act.tipo}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" /> {act.durataMin} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
