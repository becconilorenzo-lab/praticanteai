import { Database, Lock, ArrowRight, Calendar, ShieldCheck, Layers } from 'lucide-react';

interface Gestionale {
  id: string;
  nome: string;
  iniziali: string;
  colore: string;
  descrizione: string;
  features: string[];
}

const GESTIONALI: Gestionale[] = [
  {
    id: 'zucchetti',
    nome: 'Zucchetti',
    iniziali: 'Z',
    colore: 'from-indigo-500 to-indigo-700',
    descrizione:
      'Modulo di integrazione nativa per sincronizzazione prima nota. Disponibile in Q4 2026.',
    features: ['Sincronizzazione prima nota', 'Import scritture contabili', 'Mappatura conti automatica'],
  },
  {
    id: 'teamsystem',
    nome: 'TeamSystem',
    iniziali: 'T',
    colore: 'from-slate-500 to-slate-700',
    descrizione:
      'Modulo di integrazione nativa per sincronizzazione prima nota. Disponibile in Q4 2026.',
    features: ['Sincronizzazione prima nota', 'Bilancio CEE in uscita', 'F24 precompilati'],
  },
  {
    id: 'sistemi',
    nome: 'Sistemi (Profis)',
    iniziali: 'S',
    colore: 'from-red-500 to-red-700',
    descrizione:
      'Modulo di integrazione nativa per sincronizzazione prima nota. Disponibile in Q4 2026.',
    features: ['Sincronizzazione prima nota', 'Studio unico integrato', 'Cespiti e fatturazione'],
  },
];

export function IntegrazioniSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <header className="rounded-2xl bg-slate-900 text-white overflow-hidden shadow-lg shadow-slate-900/10">
        <div className="px-6 py-7 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/30 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Praticante.ai · Roadmap integrazioni
              </p>
              <h1 className="mt-1 text-2xl lg:text-3xl font-bold leading-tight">
                Integrazioni Gestionali
              </h1>
              <p className="mt-1.5 text-sm text-slate-300 max-w-2xl">
                Connetti Praticante.ai ai principali gestionali di contabilità professionale.
                Sincronizzazione nativa della prima nota, senza esportazioni manuali.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Roadmap banner */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">
            Roadmap Q4 2026 · Integrazioni native in sviluppo
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            I moduli saranno rilasciati progressivamente, con programma di early access per i professionisti iscritti.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 shrink-0">
          <Lock className="w-3 h-3" />
          In Fase di Sviluppo
        </span>
      </section>

      {/* Grid di card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-24 lg:pb-6">
        {GESTIONALI.map((g) => (
          <article
            key={g.id}
            className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Logo placeholder */}
            <div className="relative aspect-[4/2] bg-slate-50 flex items-center justify-center overflow-hidden">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${g.colore} flex items-center justify-center shadow-lg ring-1 ring-black/5`}
              >
                <span className="text-2xl font-bold text-white">{g.iniziali}</span>
              </div>
              <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                <Lock className="w-3 h-3" />
                In Fase di Sviluppo
              </span>
            </div>

            {/* Contenuto */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{g.nome}</h3>
              <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">{g.descrizione}</p>

              <ul className="mt-4 space-y-2">
                {g.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Conforme AGID
                </div>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-semibold text-xs px-3 py-2 cursor-not-allowed"
                  title="Modulo non ancora disponibile"
                >
                  Richiedi early access
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer informativo */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800">
              Approccio progettuale di Praticante.ai
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Le integrazioni native vengono sviluppate secondo standard AGID e linee guida
              del MEF per la fatturazione elettronica e la tenuta della contabilità digitale.
              Ogni modulo è sottoposto a test di sicurezza e conformità prima del rilascio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
