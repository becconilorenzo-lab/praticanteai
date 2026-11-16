import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useToastStore } from '../../store/useToastStore';
import { Search, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface ErrorRow {
  id: string;
  conto: string;
  dare: string;
  avere: string;
  isError: boolean;
  explanation?: string;
}

const ROWS: ErrorRow[] = [
  { id: 'r1', conto: 'IMPOSTE DIFFERITE IRES', dare: '192,00', avere: '', isError: false },
  { id: 'r2', conto: 'FONDO IMPOSTE DIFFERITE', dare: '', avere: '192,00', isError: false },
  { id: 'r3', conto: 'FONDO IMPOSTE DIFFERITE', dare: '48,00', avere: '', isError: false },
  { id: 'r4', conto: 'IMPOSTE DIFFERITE IRES', dare: '', avere: '48,00', isError: true, explanation: 'Errore: lo storno del fondo imposte differite deve essere imputato a IMPOSTE (conto economico), non a IMPOSTE DIFFERITE IRES. La scrittura corretta è: FONDO IMPOSTE DIFFERITE dare 48,00 a IMPOSTE avere 48,00.' },
];

export function TrovaErroreWidget() {
  const recordAttempt = useStore((s) => s.recordAttempt);
  const showToast = useToastStore((s) => s.showToast);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  const handleRowClick = (row: ErrorRow) => {
    if (answered) return;
    setSelectedRow(row.id);
    setAnswered(true);
    if (row.isError) {
      setWasCorrect(true);
      recordAttempt('trova-errore-1', 'medium', true);
      showToast('Errore identificato correttamente!', 'success');
    } else {
      setWasCorrect(false);
      recordAttempt('trova-errore-1', 'medium', false);
      showToast('Riga non errata', 'error');
    }
  };

  const handleReset = () => {
    setSelectedRow(null);
    setAnswered(false);
    setWasCorrect(false);
  };

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
          <Search className="w-4 h-4 text-amber-600" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Trova l'Errore</h4>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">
          Indice di Accuratezza
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        Una di queste scritture di storno contiene un errore. Clicca sulla riga sbagliata per identificarla.
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="px-3 py-2 text-left font-semibold text-slate-600 w-8">#</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">Conto</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-600">Dare</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-600">Avere</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              const isSelected = selectedRow === row.id;
              const showResult = answered && isSelected;
              return (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  className={`border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${
                    showResult
                      ? row.isError
                        ? 'bg-emerald-50'
                        : 'bg-red-50'
                      : answered
                        ? 'opacity-50 cursor-default'
                        : 'hover:bg-indigo-50/50'
                  }`}
                >
                  <td className="px-3 py-2.5 text-slate-400 font-medium">{i + 1}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-700">{row.conto}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{row.dare || '—'}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{row.avere || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {answered && (
        <div className={`mt-3 rounded-lg p-3 flex items-start gap-2.5 ${
          wasCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
        }`}>
          {wasCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${wasCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
              {wasCorrect ? 'Valutazione corretta!' : 'Valutazione errata.'}
            </p>
            {selectedRow && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {ROWS.find(r => r.id === selectedRow)?.explanation
                  ?? 'Questa riga è corretta. La scrittura di storno è regolare.'}
              </p>
            )}
            <button
              onClick={handleReset}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Riprova
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
