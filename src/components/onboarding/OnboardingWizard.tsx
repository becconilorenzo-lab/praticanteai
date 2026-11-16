import { useState, useMemo } from 'react';
import {
  Calendar, Clock, Target, BarChart3, CheckCircle2,
  ChevronRight, ChevronLeft, Sparkles, AlertCircle, X,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { StudyProfile, Goal } from '../../store/useStore';
import { AREE_STUDIO, type ObiettivoStudio } from '../../config/studyPlanConfig';
import {
  generaPiano,
  rigeneraPiano,
  statistichePiano,
  toLocalDateStr,
  fromLocalDateStr,
  addDays,
  round5,
} from '../../utils/planGenerator';

const GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const QUICK_HOURS = [5, 10, 15, 20];

const GOALS: { id: ObiettivoStudio; label: string; desc: string; icon: string }[] = [
  { id: 'Partire da zero', label: 'Partire da zero', desc: 'Non ho mai affrontato queste materie in modo approfondito', icon: '🌱' },
  { id: 'Ripassare', label: 'Ripassare', desc: 'Conosco le basi teoriche, voglio consolidare e ripassare', icon: '🔄' },
  { id: 'Concentrarmi sulle tracce scritte', label: 'Concentrarmi sulle tracce scritte', desc: 'Focus intensivo su simulazioni, esercizi e casi d\'esame', icon: '🎯' },
];

const STEPS = [
  { label: 'Data Esame', icon: Calendar },
  { label: 'Ore Settimana', icon: Clock },
  { label: 'Giorni Studio', icon: Calendar },
  { label: 'Obiettivo', icon: Target },
  { label: 'Livello Aree', icon: BarChart3 },
  { label: 'Riepilogo', icon: CheckCircle2 },
];

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: StudyProfile | null;
}

export function OnboardingWizard({ isOpen, onClose, initialProfile }: OnboardingWizardProps) {
  const setStudyProfileAndPlan = useStore((s) => s.setStudyProfileAndPlan);
  const existingPlan = useStore((s) => s.studyPlan);

  const todayStr = useMemo(() => toLocalDateStr(new Date()), []);
  const minExamDateStr = useMemo(() => toLocalDateStr(addDays(new Date(), 14)), []);

  const [step, setStep] = useState(0);

  // Nessun valore preselezionato per default
  const [examDate, setExamDate] = useState<string>(initialProfile?.dataEsame ?? '');
  const [weeklyHours, setWeeklyHours] = useState<number | null>(initialProfile?.oreSettimana ?? null);
  const [preferredDays, setPreferredDays] = useState<string[]>(initialProfile?.giorniStudio ?? []);
  const [goal, setGoal] = useState<Goal | null>(initialProfile?.obiettivo ?? null);
  const [areaLevels, setAreaLevels] = useState<Record<string, number>>(initialProfile?.livelli ?? {});

  // Calcolo e validazione dailyMin
  const numDays = preferredDays.length;
  const dailyMin = (weeklyHours !== null && numDays > 0)
    ? round5((weeklyHours * 60) / numDays)
    : 0;

  const isDailyMinTooLow = weeklyHours !== null && numDays > 0 && dailyMin < 30;
  const isDailyMinTooHigh = weeklyHours !== null && numDays > 0 && dailyMin > 240;
  const isDailyMinValid = weeklyHours !== null && numDays > 0 && dailyMin >= 30 && dailyMin <= 240;

  // Validazione date esame
  const isExamDateValid = examDate !== '' && examDate >= minExamDateStr;

  // Validazione step per step
  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return isExamDateValid;
      case 1:
        return weeklyHours !== null && weeklyHours >= 2 && weeklyHours <= 40;
      case 2:
        return preferredDays.length >= 2 && isDailyMinValid;
      case 3:
        return goal !== null;
      case 4:
        return AREE_STUDIO.every((a) => areaLevels[a.id] !== undefined && areaLevels[a.id] >= 1);
      default:
        return true;
    }
  }, [step, isExamDateValid, weeklyHours, preferredDays, isDailyMinValid, goal, areaLevels]);

  const toggleDay = (day: string) => {
    setPreferredDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Preview del piano generato per il riepilogo
  const previewData = useMemo(() => {
    if (
      !isExamDateValid ||
      weeklyHours === null ||
      preferredDays.length < 2 ||
      !goal ||
      !canProceed
    ) {
      return null;
    }

    const tempProfile: StudyProfile = {
      dataEsame: examDate,
      oreSettimana: weeklyHours,
      giorniStudio: preferredDays,
      obiettivo: goal,
      livelli: areaLevels,
      dataCreazione: initialProfile?.dataCreazione ?? todayStr,
    };

    const acts = initialProfile && existingPlan
      ? rigeneraPiano(existingPlan, tempProfile, todayStr)
      : generaPiano(tempProfile, todayStr);

    const stats = statistichePiano(acts, todayStr);
    const uniqueDates = new Set(acts.map((a) => a.data));
    const settimane = Math.max(1, Math.ceil(uniqueDates.size / Math.max(1, preferredDays.length)));

    return {
      profile: tempProfile,
      plan: acts,
      stats,
      settimane,
      oreTotali: Math.round(stats.minutiTotali / 60),
      totaleAttivita: acts.length,
    };
  }, [isExamDateValid, weeklyHours, preferredDays, goal, areaLevels, canProceed, initialProfile, existingPlan, todayStr]);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (!previewData) return;
    setStudyProfileAndPlan(previewData.profile, previewData.plan);
    onClose();
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {initialProfile ? 'Modifica Piano di Studio' : 'Crea il tuo Piano di Studio'}
                </h2>
                <p className="text-xs text-slate-500">Passo {step + 1} di {STEPS.length}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* STEP 1: Data esame */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Quando sosterrai l'Esame di Stato?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inserisci la data ufficiale o stimata. La data minima deve essere ad almeno 14 giorni da oggi.
                </p>
              </div>

              <input
                type="date"
                value={examDate}
                min={minExamDateStr}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
              />

              {examDate && !isExamDateValid && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>La data dell'esame deve essere almeno il {minExamDateStr} (minimo 14 giorni da oggi).</span>
                </div>
              )}

              {isExamDateValid && (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Data valida: {Math.max(1, Math.ceil((fromLocalDateStr(examDate).getTime() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000)))} settimane all'esame
                </p>
              )}
            </div>
          )}

          {/* STEP 2: Ore settimanali */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Quante ore puoi dedicare a settimana?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scegli una quota oraria realistica e sostenibile (tra 2 e 40 ore/settimana).
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {QUICK_HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setWeeklyHours(h)}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition ${
                      weeklyHours === h
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Oppure inserisci ore personalizzate:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={2}
                    max={40}
                    value={weeklyHours ?? ''}
                    placeholder="Es. 8"
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      setWeeklyHours(val);
                    }}
                    className="w-28 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <span className="text-sm text-slate-500">ore a settimana</span>
                </div>
              </div>

              {weeklyHours !== null && (weeklyHours < 2 || weeklyHours > 40) && (
                <p className="text-xs text-rose-500">Le ore devono essere comprese tra 2 e 40.</p>
              )}
            </div>
          )}

          {/* STEP 3: Giorni di studio */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">In quali giorni preferisci studiare?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seleziona almeno 2 giorni a settimana.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GIORNI.map((g) => {
                  const isSel = preferredDays.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleDay(g)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition ${
                        isSel
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>

              {preferredDays.length < 2 && (
                <p className="text-xs text-amber-600">Seleziona almeno 2 giorni di studio.</p>
              )}

              {/* Validazione dailyMin */}
              {weeklyHours !== null && preferredDays.length >= 2 && (
                <div className="pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                    <span className="text-slate-600">Tempo medio per sessione:</span>
                    <span className="font-bold text-slate-800 tabular-nums">{dailyMin} min / giorno</span>
                  </div>

                  {isDailyMinTooLow && (
                    <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Aumenta le ore o riduci i giorni (minimo 30 min per sessione).</span>
                    </div>
                  )}

                  {isDailyMinTooHigh && (
                    <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Aggiungi giorni di studio (massimo 240 min per sessione).</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Obiettivo */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Qual è il tuo obiettivo principale?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Questo imposterà il mix tra studio concettuale, esercizi e simulazioni d'esame.
                </p>
              </div>

              <div className="space-y-2.5">
                {GOALS.map((g) => {
                  const isSel = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`w-full p-3.5 rounded-xl border-2 text-left transition ${
                        isSel
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{g.icon}</span>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{g.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{g.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Livello Aree Tematiche */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Autovaluta il tuo livello iniziale per area</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  1 = Principiante, 3 = Intermedio, 5 = Avanzato. Le aree con livello più basso riceveranno più tempo nel piano.
                </p>
              </div>

              <div className="space-y-3">
                {AREE_STUDIO.map((area) => {
                  const currentLv = areaLevels[area.id];
                  return (
                    <div key={area.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">{area.label}</span>
                        <span className="font-bold text-indigo-600">
                          {currentLv ? (currentLv === 1 ? '1 - Principiante' : currentLv === 3 ? '3 - Intermedio' : currentLv === 5 ? '5 - Avanzato' : `Livello ${currentLv}`) : 'Non impostato'}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[1, 2, 3, 4, 5].map((lv) => (
                          <button
                            key={lv}
                            type="button"
                            onClick={() => setAreaLevels((prev) => ({ ...prev, [area.id]: lv }))}
                            className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                              currentLv === lv
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {lv}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Riepilogo finale */}
          {step === 5 && previewData && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Il tuo piano personalizzato è pronto!</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifica i dettagli e premi "Inizia" per salvarlo e avviare la preparazione.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-semibold">Settimane</p>
                  <p className="text-xl font-bold text-indigo-900 mt-0.5">{previewData.settimane}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-semibold">Ore Totali</p>
                  <p className="text-xl font-bold text-emerald-900 mt-0.5">{previewData.oreTotali}h</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <p className="text-xs text-amber-600 font-semibold">Attività</p>
                  <p className="text-xl font-bold text-amber-900 mt-0.5">{previewData.totaleAttivita}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs text-slate-600">
                <p><strong>Esame:</strong> {examDate}</p>
                <p><strong>Ritmo:</strong> {weeklyHours} ore su {preferredDays.join(', ')} ({dailyMin} min/sessione)</p>
                <p><strong>Obiettivo:</strong> {goal}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between gap-3 shrink-0">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Indietro
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!canProceed}
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition flex items-center gap-1"
            >
              Avanti <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!previewData}
              onClick={handleFinish}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Inizia
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
