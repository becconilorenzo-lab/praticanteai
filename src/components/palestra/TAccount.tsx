import { useState } from 'react';
import { X, ArrowLeftRight, Inbox, Scale } from 'lucide-react';

export interface TAccountEntry {
  id: string;
  code: string;
  name: string;
  amount: number;
}

export interface DraggableAccount {
  code: string;
  name: string;
}

interface TAccountProps {
  dareEntries: TAccountEntry[];
  avereEntries: TAccountEntry[];
  onRemoveEntry: (side: 'dare' | 'avere', entryId: string) => void;
  onAmountChange: (side: 'dare' | 'avere', entryId: string, amount: number) => void;
  onDropAccount: (side: 'dare' | 'avere', account: DraggableAccount) => void;
  feedbackState: 'idle' | 'success' | 'error';
  wrongEntryIds?: Set<string>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 0 }).format(value);
}

function EntryRow({
  entry,
  onRemove,
  onAmountChange,
  feedbackState,
  isWrong,
}: {
  entry: TAccountEntry;
  onRemove: () => void;
  onAmountChange: (amount: number) => void;
  feedbackState: 'idle' | 'success' | 'error';
  isWrong: boolean;
}) {
  const showError = feedbackState === 'error' && isWrong;
  const showSuccess = feedbackState === 'success';

  return (
    <div className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-300 ${
      showError
        ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-200'
        : showSuccess
        ? 'bg-emerald-50 border-emerald-200'
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${showError ? 'text-rose-700' : 'text-slate-700'}`}>{entry.name}</p>
        <p className={`text-xs font-mono ${showError ? 'text-rose-500' : 'text-slate-500'}`}>{entry.code}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 text-sm font-medium">€</span>
        <input
          type="number"
          value={entry.amount || ''}
          onChange={e => onAmountChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          min="0"
          className={`w-24 text-right text-sm font-bold bg-white border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
            showError
              ? 'text-rose-700 border-rose-300 focus:ring-rose-400'
              : 'text-slate-800 border-slate-200 focus:ring-indigo-400'
          }`}
        />
      </div>
      <button
        onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
        aria-label="Rimuovi voce"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function TAccount({
  dareEntries,
  avereEntries,
  onRemoveEntry,
  onAmountChange,
  onDropAccount,
  feedbackState,
  wrongEntryIds,
}: TAccountProps) {
  const totalDare = dareEntries.reduce((s, e) => s + e.amount, 0);
  const totalAvere = avereEntries.reduce((s, e) => s + e.amount, 0);
  const balanced = totalDare > 0 && totalDare === totalAvere;
  const squadratura = Math.abs(totalDare - totalAvere);

  const [dragOverDare, setDragOverDare] = useState(false);
  const [dragOverAvere, setDragOverAvere] = useState(false);

  const handleDrop = (side: 'dare' | 'avere', e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDare(false);
    setDragOverAvere(false);
    const code = e.dataTransfer.getData('text/plain');
    const name = e.dataTransfer.getData('application/x-account-name');
    if (code && name) {
      onDropAccount(side, { code, name });
    }
  };

  const handleBilancia = (side: 'dare' | 'avere') => {
    if (side === 'dare') {
      const diff = totalAvere - totalDare;
      if (dareEntries.length === 0 || diff === 0) return;
      const lastEntry = dareEntries[dareEntries.length - 1];
      onAmountChange('dare', lastEntry.id, r2(lastEntry.amount + diff));
    } else {
      const diff = totalDare - totalAvere;
      if (avereEntries.length === 0 || diff === 0) return;
      const lastEntry = avereEntries[avereEntries.length - 1];
      onAmountChange('avere', lastEntry.id, r2(lastEntry.amount + diff));
    }
  };

  const wrongSet = wrongEntryIds ?? new Set<string>();

  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-md transition-all duration-300 ${
      feedbackState === 'success'
        ? 'border-emerald-400 shadow-emerald-100'
        : feedbackState === 'error'
        ? 'border-rose-300 shadow-rose-100'
        : 'border-slate-200'
    }`}>
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-center gap-2">
        <ArrowLeftRight className="w-4 h-4 text-slate-400" />
        <h3 className="font-bold text-white text-sm tracking-wide uppercase">Scrittura Contabile</h3>
        <ArrowLeftRight className="w-4 h-4 text-slate-400" />
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-200 bg-white">
        {/* DARE column */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverDare(true); }}
          onDragLeave={() => setDragOverDare(false)}
          onDrop={(e) => handleDrop('dare', e)}
          className={`p-3 space-y-2 transition-colors duration-200 ${
            dragOverDare ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-300' : 'bg-slate-50/50'
          }`}
        >
          <div className="w-full py-3 text-center font-bold text-sm tracking-wide uppercase rounded-xl border-2 border-indigo-200 bg-indigo-50 text-indigo-600">
            Dare
          </div>
          <div className="space-y-2 min-h-[80px]">
            {dareEntries.map(entry => (
              <EntryRow
                key={entry.id}
                entry={entry}
                onRemove={() => onRemoveEntry('dare', entry.id)}
                onAmountChange={amount => onAmountChange('dare', entry.id, amount)}
                feedbackState={feedbackState}
                isWrong={wrongSet.has(entry.id)}
              />
            ))}
            {dareEntries.length === 0 && (
              <div className="text-xs text-center py-4 italic rounded-lg border-2 border-dashed border-slate-200 text-slate-400">
                <Inbox className="w-4 h-4 mx-auto mb-1 opacity-60" />
                Trascina o aggiungi un conto in Dare
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex-1 flex justify-between items-center pt-2 border-t-2 font-bold text-sm ${
              balanced ? 'border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-700'
            }`}>
              <span>Totale</span>
              <span>€ {formatCurrency(totalDare)}</span>
            </div>
            <button
              onClick={() => handleBilancia('dare')}
              disabled={dareEntries.length === 0 || balanced}
              title="Bilancia automaticamente la colonna Dare"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Scale className="w-3.5 h-3.5" />
              Bilancia
            </button>
          </div>
        </div>

        {/* AVERE column */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverAvere(true); }}
          onDragLeave={() => setDragOverAvere(false)}
          onDrop={(e) => handleDrop('avere', e)}
          className={`p-3 space-y-2 transition-colors duration-200 ${
            dragOverAvere ? 'bg-slate-200/70 ring-2 ring-inset ring-slate-400' : 'bg-slate-50/30'
          }`}
        >
          <div className="w-full py-3 text-center font-bold text-sm tracking-wide uppercase rounded-xl border-2 border-slate-300 bg-slate-100 text-slate-600">
            Avere
          </div>
          <div className="space-y-2 min-h-[80px]">
            {avereEntries.map(entry => (
              <EntryRow
                key={entry.id}
                entry={entry}
                onRemove={() => onRemoveEntry('avere', entry.id)}
                onAmountChange={amount => onAmountChange('avere', entry.id, amount)}
                feedbackState={feedbackState}
                isWrong={wrongSet.has(entry.id)}
              />
            ))}
            {avereEntries.length === 0 && (
              <div className="text-xs text-center py-4 italic rounded-lg border-2 border-dashed border-slate-200 text-slate-400">
                <Inbox className="w-4 h-4 mx-auto mb-1 opacity-60" />
                Trascina o aggiungi un conto in Avere
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex-1 flex justify-between items-center pt-2 border-t-2 font-bold text-sm ${
              balanced ? 'border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-700'
            }`}>
              <span>Totale</span>
              <span>€ {formatCurrency(totalAvere)}</span>
            </div>
            <button
              onClick={() => handleBilancia('avere')}
              disabled={avereEntries.length === 0 || balanced}
              title="Bilancia automaticamente la colonna Avere"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Scale className="w-3.5 h-3.5" />
              Bilancia
            </button>
          </div>
        </div>
      </div>

      {(totalDare > 0 || totalAvere > 0) && (
        <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 border-t transition-colors ${
          balanced ? 'text-emerald-700 bg-emerald-50 border-emerald-300' : 'text-slate-600 bg-slate-50 border-slate-200'
        }`}>
          {balanced ? 'Partita doppia bilanciata' : `Sbilancio: € ${formatCurrency(squadratura)}`}
        </div>
      )}
    </div>
  );
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
