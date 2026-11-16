import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { TopHeader } from './components/TopHeader';
import { PalestraSection } from './components/palestra/PalestraSection';
import { AccademiaSection } from './components/accademia/AccademiaSection';
import { PraticanteSection } from './components/praticante/PraticanteSection';
import { BibliotecaSection } from './components/biblioteca/BibliotecaSection';
import { DashboardSection } from './components/dashboard/DashboardSection';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './hooks/useAuth';
import { useStore } from './store/useStore';
import { setSyncUserId } from './store/useStore';
import { loadProgress } from './lib/progressSync';
import type { Section } from './types';
import { TrendingUp } from 'lucide-react';

function AppContent() {
  const [activeSection, setActiveSection] = useState<Section>(() => {
    try {
      const saved = localStorage.getItem('praticante-active-section');
      if (saved && ['dashboard', 'palestra', 'accademia', 'praticante', 'biblioteca'].includes(saved)) {
        return saved as Section;
      }
    } catch {}
    return 'dashboard';
  });
  const [globalSearch, setGlobalSearch] = useState('');
  const { user, loading: authLoading, signOut } = useAuth();
  const loadFromCloud = useStore((s) => s.loadFromCloud);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    try {
      localStorage.setItem('praticante-active-section', section);
    } catch {}
  };

  // Sync userId for fire-and-forget writes; load cloud state on login
  useEffect(() => {
    setSyncUserId(user?.id ?? null);
    if (user) {
      loadProgress(user.id).then((cloudState) => {
        if (cloudState) loadFromCloud(cloudState as any);
      });
    }
  }, [user?.id]);

  // Safeguard: redirect obsolete 'oggi' route to dashboard
  const currentSection = (activeSection as string) === 'oggi' ? 'dashboard' : activeSection;

  // Full-page spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Auth gate: show modal if not logged in */}
      <AuthModal isOpen={!user} />

      <Sidebar activeSection={currentSection} onSectionChange={handleSectionChange} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          activeSection={currentSection}
          search={globalSearch}
          onSearchChange={setGlobalSearch}
          user={user}
          onSignOut={signOut}
        />

        {/* Mobile header */}
        <header className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3.5 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Praticante.ai</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-6xl w-full mx-auto">
          {currentSection === 'dashboard' && <DashboardSection onNavigate={handleSectionChange} />}
          {currentSection === 'palestra' && <PalestraSection />}
          {currentSection === 'accademia' && <AccademiaSection />}
          {currentSection === 'praticante' && <PraticanteSection />}
          {currentSection === 'biblioteca' && <BibliotecaSection />}
        </main>
      </div>

      <BottomNav activeSection={currentSection} onSectionChange={handleSectionChange} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
