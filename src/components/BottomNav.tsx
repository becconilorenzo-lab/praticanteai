import { LayoutDashboard, Dumbbell, GraduationCap, Library } from 'lucide-react';
import type { Section } from '../types';

interface BottomNavProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'palestra', label: 'Palestra', icon: Dumbbell },
  { id: 'praticante', label: 'Simulatore', icon: GraduationCap },
  { id: 'biblioteca', label: 'Biblioteca', icon: Library },
];

export function BottomNav({ activeSection, onSectionChange }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-inset-bottom">
      <div className="flex">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 relative"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50' : ''}`}>
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              </div>
              <span className={`text-[11px] font-semibold transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {label}
              </span>
              {isActive && <div className="absolute bottom-0 w-12 h-0.5 bg-indigo-600 rounded-t-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
