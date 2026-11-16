import { useState } from 'react';
import { Search, Sparkles, ChevronRight, Bell, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { Section } from '../types';
import { MiniAccuracyBadge } from './MiniAccuracyBadge';

interface TopHeaderProps {
  activeSection: Section;
  search: string;
  onSearchChange: (value: string) => void;
  user?: User | null;
  onSignOut?: () => void;
}

const SECTION_LABELS: Record<Section, string> = {
  dashboard: 'Dashboard',
  palestra: 'Palestra',
  accademia: 'Accademia',
  praticante: 'Simulatore d\'Esame',
  biblioteca: 'Biblioteca Interattiva',
};

const SECTION_SUBTITLE: Record<Section, string> = {
  dashboard: 'Panoramica generale',
  palestra: 'Workspace esercizi',
  accademia: 'Video & teoria',
  praticante: 'Simulatore esame',
  biblioteca: 'Manuale interattivo',
};

export function TopHeader({ activeSection, search, onSearchChange, user, onSignOut }: TopHeaderProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <header className="hidden lg:flex items-center gap-4 px-6 lg:px-8 h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm shrink-0">
        <span className="text-slate-400 font-medium">Praticante.ai</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-white font-semibold">{SECTION_LABELS[activeSection]}</span>
        <span className="hidden xl:inline text-slate-400 font-medium ml-2 text-xs">
          · {SECTION_SUBTITLE[activeSection]}
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cerca conti, lezioni o esercizi..."
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:bg-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Mini Accuracy Badge */}
      <MiniAccuracyBadge />

      {/* Upgrade button */}
      <button
        onClick={() => setShowUpgrade((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 shadow-sm transition-all active:scale-[0.98]"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span className="hidden xl:inline">Passa a Pro</span>
        <span className="hidden lg:inline xl:hidden">Pro</span>
        <span className="sr-only xl:not-sr-only xl:hidden">/ Sblocca Scritture Avanzate</span>
      </button>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors">
        <Bell className="w-4 h-4" />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-slate-900" />
      </button>

      {/* Profile */}
      <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xs font-bold flex items-center justify-center">
            {user?.email ? user.email.slice(0, 2).toUpperCase() : 'PR'}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
        </div>
        <div className="hidden xl:block text-left leading-tight">
          <p className="text-sm font-semibold text-white max-w-[140px] truncate">
            {user?.email ?? 'Praticante'}
          </p>
          <p className="text-[11px] text-slate-400">Praticante</p>
        </div>
      </button>

      {/* Logout button */}
      {user && onSignOut && (
        <button
          onClick={onSignOut}
          title="Esci"
          className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      )}

      {showUpgrade && (
        <div className="absolute top-14 right-24 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-40 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Praticante.ai Pro</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sblocca scritture avanzate, simulatore d'esame illimitato e integrazioni gestionali native.
          </p>
          <button className="mt-3 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 transition-colors">
            Inizia prova gratuita
          </button>
        </div>
      )}
    </header>
  );
}
