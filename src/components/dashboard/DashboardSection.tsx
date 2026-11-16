import { useState } from 'react';
import { AccuracyWidget } from '../AccuracyWidget';
import { useStore } from '../../store/useStore';
import { OnboardingWizard } from '../onboarding/OnboardingWizard';
import { TodayView } from '../today/TodayView';
import { WeeklyView } from '../weekly/WeeklyView';
import {
  Dumbbell, BookOpen, GraduationCap, Library,
  ArrowRight, Target, TrendingUp, BookText, Sparkles,
} from 'lucide-react';
import type { Section } from '../../types';

interface DashboardSectionProps {
  onNavigate: (section: Section) => void;
}

const MODULES: { id: Section; label: string; description: string; icon: React.ElementType; color: string }[] = [
  { id: 'palestra', label: 'Palestra', description: 'Esercizi guidati di partita doppia', icon: Dumbbell, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { id: 'accademia', label: 'Accademia', description: 'Lezioni video e test di livello', icon: BookOpen, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'praticante', label: 'Simulatore d\'Esame', description: 'Tracce realistiche d\'esame di Stato', icon: GraduationCap, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'biblioteca', label: 'Biblioteca', description: 'Dispense e casi di studio interattivi', icon: Library, color: 'bg-rose-50 text-rose-600 border-rose-200' },
];

export function DashboardSection({ onNavigate }: DashboardSectionProps) {
  const attemptCount = useStore((s) => s.attemptCount);
  const simulationHistory = useStore((s) => s.simulationHistory);
  // Conta le simulazioni effettivamente completate dall'utente nello storico
  const completedSimulationsCount = simulationHistory?.length ?? 0;

  const studyProfile = useStore((s) => s.studyProfile);
  const studyPlan = useStore((s) => s.studyPlan);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);

  // Vista settimanale a tutto schermo se richiesta
  if (showWeekly && studyPlan) {
    return <WeeklyView onBack={() => setShowWeekly(false)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <header className="rounded-2xl bg-slate-900 text-white overflow-hidden shadow-lg shadow-slate-900/10">
        <div className="px-6 py-7 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Dashboard
              </p>
              <h1 className="mt-1 text-2xl lg:text-3xl font-bold leading-tight">
                Benvenuto nel tuo spazio di preparazione
              </h1>
              <p className="mt-1.5 text-sm text-slate-300 max-w-2xl">
                Monitora il tuo Indice di Accuratezza, accedi ai moduli di studio e allenati con esercizi pratici di partita doppia.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Piano di Studio: se esiste mostra il blocco "Oggi", altrimenti card "Crea il tuo piano" */}
      {studyProfile && studyPlan && studyPlan.length > 0 ? (
        <TodayView
          onNavigate={onNavigate}
          onShowWeekly={() => setShowWeekly(true)}
          onEditPlan={() => setShowOnboarding(true)}
        />
      ) : (
        <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white p-5 lg:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-800 text-base lg:text-lg leading-tight">
                Crea il tuo piano di studio
              </h2>
              <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                Personalizza il tuo ritmo in base alla data dell'esame, alle ore settimanali e alle materie da potenziare.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
            >
              Inizia
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>
      )}

      {/* Statistiche & Moduli */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accuracy Widget */}
        <div className="lg:col-span-1">
          <AccuracyWidget />
        </div>

        {/* Stats summary + modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tentativi</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 tabular-nums">{attemptCount}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Simulazioni</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600 tabular-nums">{completedSimulationsCount}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <BookText className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Moduli</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 tabular-nums">{MODULES.length}</p>
            </div>
          </div>

          {/* Module cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map(({ id, label, description, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-left transition-all duration-200 hover:shadow-md hover:border-slate-300 active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800">{label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Onboarding Wizard modal */}
      {showOnboarding && (
        <OnboardingWizard
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          initialProfile={studyProfile}
        />
      )}
    </div>
  );
}
