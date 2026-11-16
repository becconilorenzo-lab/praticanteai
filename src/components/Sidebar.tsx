import {
  LayoutDashboard, Dumbbell, BookOpen, GraduationCap, Library, TrendingUp,
} from 'lucide-react';
import type { Section } from '../types';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'palestra', label: 'Palestra', icon: Dumbbell },
  { id: 'accademia', label: 'Accademia', icon: BookOpen },
  { id: 'praticante', label: 'Simulatore d\'Esame', icon: GraduationCap },
  { id: 'biblioteca', label: 'Biblioteca Interattiva', icon: Library },
];

const SECTION_LABELS: Record<Section, string> = {
  dashboard: 'Dashboard',
  palestra: 'Palestra',
  accademia: 'Accademia',
  praticante: 'Simulatore d\'Esame',
  biblioteca: 'Biblioteca Interattiva',
};

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight">Praticante.ai</h1>
            <p className="text-xs text-slate-400 font-medium">Il Simulatore d'Esame per Dottore Commercialista</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 mb-2 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
          Moduli
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`w-full flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-xl text-left transition-all duration-200 relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-300" />
              )}
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="font-semibold text-sm">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Current section indicator */}
      <div className="px-4 pb-5">
        <p className="text-center text-[11px] text-slate-500">
          Sei in: <span className="text-slate-300 font-semibold">{SECTION_LABELS[activeSection]}</span>
        </p>
      </div>
    </aside>
  );
}
