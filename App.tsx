
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, Language } from './types';
import Dashboard from './views/Dashboard';
import DPRManagement from './views/DPRManagement';
import DPREvaluation from './views/DPREvaluation';
import Analytics from './views/Analytics';
import AdminPanel from './views/AdminPanel';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OfflineBanner from './components/OfflineBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('mdoner_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [lang, setLang] = useState<Language>('EN');
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [selectedDprId, setSelectedDprId] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    try { localStorage.removeItem('mdoner_user'); } catch { }
    setUser(null);
  };

  const navigateToEvaluation = (id: string) => {
    setSelectedDprId(id);
    setCurrentView('evaluation');
  };

  if (!user) {
    return null; // redirect handled above
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gov-background">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        lang={lang}
        role={user.role}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          lang={lang}
          setLang={setLang}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 lg:p-16">
          <OfflineBanner isOnline={isOnline} />

          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentView === 'dashboard' && (
                  <ErrorBoundary key="dashboard-boundary">
                    <Dashboard lang={lang} role={user?.role} onSelectDPR={navigateToEvaluation} />
                  </ErrorBoundary>
                )}
                {currentView === 'dpr-management' && (
                  <ErrorBoundary key="dpr-boundary">
                    <DPRManagement lang={lang} role={user?.role} onEvaluate={navigateToEvaluation} />
                  </ErrorBoundary>
                )}
                {currentView === 'evaluation' && (
                  <ErrorBoundary key="eval-boundary">
                    <DPREvaluation id={selectedDprId} lang={lang} />
                  </ErrorBoundary>
                )}
                {currentView === 'analytics' && (
                  <ErrorBoundary key="analytics-boundary">
                    <Analytics lang={lang} />
                  </ErrorBoundary>
                )}
                {currentView === 'admin' && user?.role === UserRole.ADMIN && (
                  <ErrorBoundary key="admin-boundary">
                    <AdminPanel lang={lang} />
                  </ErrorBoundary>
                )}
                {currentView === 'settings' && (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-gov-surface border border-gov-border flex items-center justify-center mx-auto">
                        <Settings size={32} className="text-gov-text-muted" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Coming Soon</h3>
                      <p className="text-sm text-gov-text-muted">This feature is under development.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default App;
