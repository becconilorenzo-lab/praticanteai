import { useToastStore } from '../store/useToastStore';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg border animate-fade-in max-w-sm ${
            toast.type === 'success'
              ? 'bg-white border-emerald-200'
              : 'bg-white border-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold ${
                toast.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {toast.message}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Indice di Accuratezza aggiornato
            </p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
