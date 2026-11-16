import { useMemo } from 'react';
import {
  CheckCircle2, Circle, Clock, ChevronRight,
  Flame, CalendarDays, Play, Sparkles, Check,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import {
  statistichePiano,
  toLocalDateStr,
  fromLocalDateStr,
  IT_DAYS,
} from '../../utils/planGenerator';
import type { Section } from '../../types';

interface TodayViewProps {
  onNavigate: (section: Section) => void;
  onShowWeekly: () => void;
  onEditPlan: () => void;
}

const TIPO_CONFIG = {
  biblioteca: {
    label: 'Biblioteca',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    module: 'biblioteca' as Section,
  },
  palestra: {
    label: 'Palestra',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    module: 'palestra' as Section,
  },
  simulazione: {
    label: 'Simulatore',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    module: 'praticante' as Section,
  },
};

export function TodayView({ onNavigate, onShowWeekly, onEditPlan }: TodayViewProps) {
  const studyProfile = useStore((s) => s.studyProfile);
  const studyPlan = useStore((s) => s.studyPlan);
  const toggleActivity = useStore((s) => s.toggleActivityCompletion);

  const todayStr = useMemo(() => toLocalDateStr(new Date()), []);
  const stats = useMemo(() => statistichePiano(studyPlan, todayStr), [studyPlan, todayStr]);

  // Attività programmate per la data odierna
  const todayActivities = useMemo(() => {
    if (!studyPlan) return [];
    return studyPlan.filter((a) => a.data === todayStr && !a.saltata);
  }, [studyPlan, todayStr]);

  const allTodayCompleted = todayActivities.length > 0 && todayActivities.every((a) => a.completata);

  // Verifica se piano concluso o esame passato
  const isExamPassed = studyProfile && studyProfile.dataEsame <= todayStr;
  const isPlanFinished = stats.minutiTotali > 0 && stats.minutiCompletati >= stats.minutiTotali;

  if (!studyProfile || !studyPlan || studyPlan.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Banner di riepilogo & conto alla rovescia */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-5 lg:p-6 shadow-md shadow-indigo-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Il Tuo Percorso d'Esame
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold tabular-nums">{stats.giorniAllEsame}</span>
              <span className="text-sm font-medium text-slate-300">giorni all'esame ({studyProfile.dataEsame})</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-300">Avanzamento ore</span>
              <p className="text-xl font-bold tabular-nums">
                {Math.round(stats.minutiCompletati / 60)}h / {stats.oreTotali}h ({stats.percentuale}%)
              </p>
            </div>
            <div className="w-12 h-12 relative shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.percentuale * 1.256} 125.6`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Barra di progresso orizzontale in % minuti */}
        <div className="mt-3.5 bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-sky-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.percentuale}%` }}
          />
        </div>
      </div>

      {/* Sezione Attività di Oggi */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-bold text-slate-800">Attività di Oggi</h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {/* Se l'esame è passato o il piano è completato */}
        {(isExamPassed || isPlanFinished) ? (
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center space-y-2">
            <Sparkles className="w-6 h-6 text-indigo-600 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Piano concluso o data d'esame raggiunta!</p>
            <p className="text-xs text-slate-500">Hai completato il percorso previsto. Puoi aggiornare la data o creare un nuovo piano.</p>
            <button
              onClick={onEditPlan}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
            >
              Configura nuovo piano
            </button>
          </div>
        ) : todayActivities.length === 0 ? (
          /* Oggi non è giorno di studio */
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <p className="text-xs text-slate-500 font-medium">Oggi non è tra i tuoi giorni di studio programmati.</p>
            {stats.prossimaAttivita ? (
              <p className="text-xs font-semibold text-indigo-700">
                Prossima sessione: {IT_DAYS[fromLocalDateStr(stats.prossimaAttivita.data).getDay()]} {stats.prossimaAttivita.data} · {stats.prossimaAttivita.titolo} ({stats.prossimaAttivita.durataMin}m)
              </p>
            ) : (
              <p className="text-xs text-slate-400">Nessuna attività in programma.</p>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {allTodayCompleted && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                Ottimo lavoro! Hai completato tutte le attività previste per oggi.
              </div>
            )}

            {todayActivities.map((act) => {
              const cfg = TIPO_CONFIG[act.tipo] ?? TIPO_CONFIG.palestra;
              return (
                <div
                  key={act.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    act.completata
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleActivity(act.id)}
                      className="shrink-0 text-slate-400 hover:text-indigo-600 transition"
                      title={act.completata ? 'Segna come non completata' : 'Segna come completata'}
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
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {act.durataMin} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate(cfg.module)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1 group"
                  >
                    <span>Inizia</span>
                    <Play className="w-3 h-3 fill-indigo-700 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Link rapidi a vista settimanale e modifica piano */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={onShowWeekly}
            className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Piano settimanale</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onEditPlan}
            className="font-semibold text-slate-500 hover:text-slate-700 transition"
          >
            Modifica piano
          </button>
        </div>
      </div>
    </div>
  );
}
