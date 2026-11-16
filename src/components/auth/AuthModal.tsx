import { useState } from 'react';
import { X, LogIn, UserPlus, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
}

export function AuthModal({ isOpen }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (tab === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(errorLabel(error));
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(errorLabel(error));
      } else {
        setInfo('Registrazione completata! Controlla la tua email per confermare l\'account, poi accedi.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-8 text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center mb-3">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Praticante.ai</h1>
          <p className="text-indigo-200 text-sm mt-1">Simulatore Esame di Stato – Dottore Commercialista</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => { setTab('login'); setError(null); setInfo(null); }}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
              tab === 'login'
                ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Accedi
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); setInfo(null); }}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
              tab === 'register'
                ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Registrati
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.com"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === 'register' ? 'Minimo 6 caratteri' : '••••••••'}
                className="w-full px-4 py-3 pr-11 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          {info && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
              <p className="text-xs text-emerald-300 leading-relaxed">{info}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-sm"
          >
            {loading
              ? 'Attendere...'
              : tab === 'login'
                ? 'Accedi al tuo account'
                : 'Crea account gratuito'}
          </button>

          {tab === 'login' && (
            <p className="text-center text-xs text-slate-500">
              Non hai un account?{' '}
              <button
                type="button"
                onClick={() => { setTab('register'); setError(null); setInfo(null); }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Registrati gratis
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function errorLabel(msg: string): string {
  if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
    return 'Email o password non corretti. Riprova.';
  }
  if (msg.includes('Email not confirmed')) {
    return 'Devi confermare la tua email prima di accedere. Controlla la casella di posta.';
  }
  if (msg.includes('User already registered')) {
    return 'Questo indirizzo email è già registrato. Accedi o usa un\'altra email.';
  }
  if (msg.includes('Password should be at least')) {
    return 'La password deve essere di almeno 6 caratteri.';
  }
  return msg;
}
