import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  GraduationCap,
  Lightbulb,
  ListChecks,
  RefreshCw,
  ScrollText,
  Sparkles,
  SquarePen,
  Timer,
  UploadCloud,
  FileCheck2,
  X,
  BookOpen,
} from 'lucide-react';
import {
  AREE_TEMATICHE,
  LIVELLI,
  getTraccia,
  type AreaTematica,
  type LivelloDifficolta,
  type TracciaEsame,
} from '../../data/praticanteData';
import { useStore } from '../../store/useStore';

const TEMPO_TOTALE = 180;

type ConsegnaState = 'idle' | 'inviato';

export function PraticanteSection() {
  const incrementSimulation = useStore((s) => s.incrementSimulation);
  const recordSimulationEvaluation = useStore((s) => s.recordSimulationEvaluation);
  const lastShownTracciaByArea = useStore((s) => s.lastShownTracciaByArea);
  const setLastShownTraccia = useStore((s) => s.setLastShownTraccia);

  const [area, setArea] = useState<AreaTematica>('Operazioni Straordinarie');
  const [livello, setLivello] = useState<LivelloDifficolta>('Avanzato');
  const [traccia, setTraccia] = useState<TracciaEsame | null>(null);
  const [generando, setGenerando] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [tempo, setTempo] = useState(TEMPO_TOTALE);
  const [tempoIniziale, setTempoIniziale] = useState(TEMPO_TOTALE);

  const [soluzione, setSoluzione] = useState('');
  const [fileNome, setFileNome] = useState<string | null>(null);
  const [consegnaState, setConsegnaState] = useState<ConsegnaState>('idle');
  const [mostraSoluzione, setMostraSoluzione] = useState(false);
  const [soluzioneLoading, setSoluzioneLoading] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!traccia) return;
    if (tempo <= 0) return;
    const id = setInterval(() => setTempo((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [traccia, tempo]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const genera = () => {
    setGenerando(true);
    setTimeout(() => {
      const areaKey = `${area}-${livello}`;
      const lastForAreaLivello = lastShownTracciaByArea?.[areaKey];
      const lastForArea = lastShownTracciaByArea?.[area];

      const excludes = [
        lastForAreaLivello,
        lastForArea,
        traccia?.titolo,
      ].filter(Boolean) as string[];

      const t = getTraccia(area, livello, excludes);
      setLastShownTraccia(areaKey, t.titolo);
      setLastShownTraccia(area, t.titolo);

      setTraccia(t);
      setChecked({});
      const durata = t.tempoResiduo ?? TEMPO_TOTALE;
      setTempoIniziale(durata);
      setTempo(durata);
      setSoluzione('');
      setFileNome(null);
      setConsegnaState('idle');
      setMostraSoluzione(false);
      setSoluzioneLoading(false);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      setGenerando(false);
      incrementSimulation();
    }, 600);
  };

  const toggleChecklistItem = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (traccia) {
        const totalW = traccia.checklist.reduce((sum, item) => sum + (item.peso ?? 1), 0);
        const checkedW = traccia.checklist
          .filter((item) => next[item.id])
          .reduce((sum, item) => sum + (item.peso ?? 1), 0);
        const pct = totalW > 0 ? Math.round((checkedW / totalW) * 100) : 0;
        const trackId = `${traccia.area}-${traccia.titolo}`;
        recordSimulationEvaluation(trackId, traccia.titolo, pct);
      }
      return next;
    });
  };

  const mostraSoluzioneHandler = () => {
    setSoluzioneLoading(true);
    setConsegnaState('inviato');
    loadingTimerRef.current = setTimeout(() => {
      setSoluzioneLoading(false);
      setMostraSoluzione(true);
      if (traccia) {
        const totalW = traccia.checklist.reduce((sum, item) => sum + (item.peso ?? 1), 0);
        const checkedW = traccia.checklist
          .filter((item) => checked[item.id])
          .reduce((sum, item) => sum + (item.peso ?? 1), 0);
        const pct = totalW > 0 ? Math.round((checkedW / totalW) * 100) : 0;
        const trackId = `${traccia.area}-${traccia.titolo}`;
        recordSimulationEvaluation(trackId, traccia.titolo, pct);
      }
    }, 600);
  };

  const resetConsegna = () => {
    setConsegnaState('idle');
    setMostraSoluzione(false);
    setSoluzioneLoading(false);
    setSoluzione('');
    setFileNome(null);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
  };

  // Punteggio ponderato basato sul peso di ciascuna voce
  const { totalWeight, checkedWeight, scorePercent, checkedCount } = useMemo(() => {
    if (!traccia) return { totalWeight: 0, checkedWeight: 0, scorePercent: 0, checkedCount: 0 };
    const totalW = traccia.checklist.reduce((sum, item) => sum + (item.peso ?? 1), 0);
    const checkedItems = traccia.checklist.filter((item) => checked[item.id]);
    const checkedW = checkedItems.reduce((sum, item) => sum + (item.peso ?? 1), 0);
    const pct = totalW > 0 ? Math.round((checkedW / totalW) * 100) : 0;
    return {
      totalWeight: totalW,
      checkedWeight: checkedW,
      scorePercent: pct,
      checkedCount: checkedItems.length,
    };
  }, [traccia, checked]);

  const minuti = String(Math.floor(tempo / 60)).padStart(2, '0');
  const secondi = String(tempo % 60).padStart(2, '0');
  const tempoPct = Math.round((tempo / tempoIniziale) * 100);

  return (
    <div className="space-y-6 animate-fade-in pb-24 lg:pb-6">
      {/* Header */}
      <header className="rounded-2xl bg-slate-900 text-white overflow-hidden shadow-lg shadow-slate-900/10">
        <div className="px-6 py-7 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Praticante.ai · Modulo di preparazione
              </p>
              <h1 className="mt-1 text-2xl lg:text-3xl font-bold leading-tight">
                Simulatore d'Esame
              </h1>
              <p className="mt-1.5 text-sm text-slate-300 max-w-2xl">
                Il Simulatore d'Esame per Dottore Commercialista. Configura i parametri, genera una traccia realistica,
                consulta le trappole del docente, svolgi il caso e autovalutati con la checklist pesata.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form di configurazione e generazione traccia */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <SquarePen className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Configurazione traccia
          </h2>
        </div>
        <div className="p-5 lg:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Area tematica */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Scegli l'Area Tematica
            </label>
            <div className="relative">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as AreaTematica)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              >
                {AREE_TEMATICHE.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <svg
                className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Livello difficoltà */}
          <div>
            <span className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Livello di Difficoltà
            </span>
            <div className="grid grid-cols-2 gap-3">
              {LIVELLI.map((l) => {
                const active = livello === l;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLivello(l)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 text-left ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          active ? 'border-white' : 'border-slate-400'
                        }`}
                      >
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{l}</span>
                    </div>
                    {l === 'Avanzato' && (
                      <span
                        className={`mt-1 ml-5 text-[11px] font-medium ${
                          active ? 'text-indigo-200' : 'text-slate-500'
                        }`}
                      >
                        Livello Esame
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pulsante di generazione */}
          <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              onClick={genera}
              disabled={generando}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-3 transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              {generando ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generazione in corso…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Genera Traccia Esame
                </>
              )}
            </button>
            <p className="text-xs text-slate-500 sm:ml-2">
              La traccia verrà estratta in base all'area e alla difficoltà selezionate.
            </p>
          </div>
        </div>
      </section>

      {/* Stato vuoto */}
      {!traccia && !generando && (
        <section className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 px-6 py-14 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <ScrollText className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Nessuna traccia generata
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
            Seleziona area tematica e livello di difficoltà, quindi premi
            «Genera Traccia Esame» per iniziare la simulazione del caso pratico.
          </p>
        </section>
      )}

      {/* Stato caricamento */}
      {generando && (
        <section className="rounded-2xl bg-white border border-slate-200 px-6 py-14 text-center animate-fade-in">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">
            Estrazione della traccia in corso…
          </p>
        </section>
      )}

      {/* Traccia generata */}
      {traccia && !generando && (
        <div className="space-y-6 animate-fade-in">
          {/* Barra tempo d'esame */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tempo === 0
                      ? 'bg-rose-50 text-rose-600'
                      : tempo < 30
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Tempo d'Esame
                  </p>
                  <p className="text-lg font-bold text-slate-800 tabular-nums">
                    {minuti}:{secondi}
                  </p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Tempo residuo
                  </span>
                  <span>{tempoPct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${
                      tempo === 0
                        ? 'bg-rose-500'
                        : tempo < 30
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                    }`}
                    style={{ width: `${tempoPct}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 1. Traccia esame */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <ScrollText className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Traccia Esame
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  {traccia.area}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                    traccia.livello === 'Avanzato'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {traccia.livello}
                </span>
              </div>
            </div>
            <div className="p-5 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 leading-snug">
                {traccia.titolo}
              </h3>
              <div className="mt-4 prose prose-slate max-w-none">
                {traccia.testo.split('\n\n').map((par, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-slate-700 whitespace-pre-line mb-3 last:mb-0"
                  >
                    {par}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* 2. NOTA DEL PROFESSORE (Riposizionata subito sotto la Traccia, prima della Consegna) */}
          <section className="rounded-2xl bg-amber-50/60 border border-amber-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-amber-200/70 bg-amber-100/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-200/80 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-800" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wide">
                  Nota del Professore · Trappole tipiche della traccia
                </h2>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded-md">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                Consiglio d'Esame
              </span>
            </div>
            <div className="p-5">
              <p className="text-sm leading-relaxed text-slate-800">
                {traccia.notaProfessore}
              </p>
            </div>
          </section>

          {/* 3. Consegna Elaborato */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Consegna Elaborato
              </h2>
            </div>
            <div className="p-5 lg:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                  Carica Soluzione o Inserisci Scritture
                </label>

                <label
                  htmlFor="upload-elaborato"
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-white transition-colors px-4 py-4 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {fileNome ? fileNome : 'Trascina qui il file della soluzione o clicca per caricare'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Formati supportati: PDF, DOCX, XLSX, JPEG · Max 10 MB
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-600 shrink-0">
                    Sfoglia
                  </span>
                  <input
                    id="upload-elaborato"
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFileNome(f.name);
                    }}
                  />
                </label>

                {fileNome && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                    <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-medium">{fileNome}</span>
                    <button
                      onClick={() => setFileNome(null)}
                      className="ml-1 text-slate-400 hover:text-rose-500"
                      aria-label="Rimuovi file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                  Oppure digita le scritture qui sotto
                </label>
                <textarea
                  value={soluzione}
                  onChange={(e) => setSoluzione(e.target.value)}
                  placeholder="Es. 31/12 — Diversi / a Cassa — Per acquisto materie prime € 10.000 + IVA 22%..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition resize-y"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <button
                  onClick={mostraSoluzioneHandler}
                  disabled={consegnaState === 'inviato' && mostraSoluzione}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-3 transition-all duration-200 shadow-sm active:scale-[0.98]"
                >
                  {soluzioneLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Apertura soluzione in corso…
                    </>
                  ) : mostraSoluzione ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Soluzione e Checklist attive
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Mostra Soluzione
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-500 sm:ml-2">
                  Cliccando si aprono contestualmente la soluzione ufficiale del docente e la checklist di autovalutazione.
                </p>
              </div>
            </div>
          </section>

          {/* 4. SOLUZIONE MODELLO DEL DOCENTE + CHECKLIST CON PUNTEGGIO IN TEMPO REALE */}
          {mostraSoluzione && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Soluzione Modello (Col-span 7) */}
              <section className="lg:col-span-7 rounded-2xl bg-white border border-emerald-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="px-5 py-4 border-b border-emerald-100 bg-emerald-50/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                          Soluzione Modello del Docente
                        </h2>
                        <p className="text-[11px] text-emerald-700">Trattazione corretta, calcoli e scritture</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Ufficiale
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
                      {traccia.correzione || 'Nessuna correzione disponibile per questa traccia.'}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                  <span>Confronta il tuo svolgimento con la soluzione del docente</span>
                  <button
                    onClick={resetConsegna}
                    className="font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2"
                  >
                    Nascondi soluzione
                  </button>
                </div>
              </section>

              {/* Checklist di Autovalutazione con Punteggio Pesato (Col-span 5) */}
              <section className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <ListChecks className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                          Autovalutazione
                        </h2>
                        <p className="text-[11px] text-slate-500">Spunta le voci corrette nel tuo testo</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                        scorePercent >= 80 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : scorePercent >= 60 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {scorePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Barra di avanzamento punteggio in tempo reale */}
                  <div className="px-5 pt-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                      <span>Punteggio conseguito</span>
                      <span className="tabular-nums font-bold text-slate-900">{checkedWeight} / {totalWeight} pt ({scorePercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          scorePercent >= 80 ? 'bg-emerald-500' : scorePercent >= 60 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Elenco voci checklist con pesi */}
                  <ul className="p-5 space-y-2.5">
                    {traccia.checklist.map((item) => {
                      const isChecked = !!checked[item.id];
                      const itemWeight = item.peso ?? 1;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => toggleChecklistItem(item.id)}
                            className={`w-full flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200 ${
                              isChecked
                                ? 'border-emerald-300 bg-emerald-50/70 shadow-sm'
                                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                                isChecked
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'bg-white border-slate-300'
                              }`}
                            >
                              {isChecked && <CheckCircle2 className="w-4 h-4" />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <span className={`text-xs leading-relaxed ${isChecked ? 'text-emerald-950 font-semibold' : 'text-slate-800'}`}>
                                  {item.text}
                                </span>
                                {itemWeight > 1 && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600 shrink-0">
                                    peso {itemWeight}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Box riepilogo finale e feedback */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                    scorePercent >= 80
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : scorePercent >= 60
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white shadow-sm border border-slate-200">
                      <Award className={`w-4 h-4 ${scorePercent >= 80 ? 'text-emerald-600' : scorePercent >= 60 ? 'text-amber-600' : 'text-indigo-600'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold">
                        {scorePercent >= 80
                          ? 'Eccellente! Livello Esame Raggiunto'
                          : scorePercent >= 60
                            ? 'Buono svolgimento, verifica i punti mancanti'
                            : 'Traccia da consolidare con lo studio teorico'}
                      </p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        Hai completato correttamente il <strong>{scorePercent}%</strong> della checklist ({checkedCount} su {traccia.checklist.length} criteri).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Punteggio salvato nello storico e sincronizzato nell'Accuratezza
                    </span>
                    <span className="text-slate-400">Modificabile in tempo reale</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Footer azioni */}
          <section className="rounded-2xl bg-slate-900 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-indigo-300" />
              <p className="text-sm text-slate-300">
                Terminata la simulazione? Genera una nuova traccia per allenarti su un altro caso.
              </p>
            </div>
            <button
              onClick={genera}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              Nuova traccia
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
