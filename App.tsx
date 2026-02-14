import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GeneratorForm from './components/GeneratorForm';
import CurriculumView from './components/CurriculumView';
import InfoModal from './components/InfoModal';
import ChatBot from './components/ChatBot';
import AuthScreen from './components/AuthScreen';
import { generateCurriculum } from './services/groqService';
import { authService } from './services/authService';
import { Curriculum, GenerationParams, ViewState, User } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('landing');
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setAppInitialized(true);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('landing');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurriculum(null);
    setView('landing');
  };

  const handleStart = () => {
    setView('create');
  };

  const handleGenerate = async (params: GenerationParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCurriculum(params);
      setCurriculum(result);
      setView('result');
    } catch (err: any) {
      setError(err.message || "Failed to generate curriculum. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurriculum(null);
    setView('create');
    setError(null);
  };

  if (!appInitialized) {
    return null; // Or a loading spinner
  }

  // If user is not logged in, show Auth Screen
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <Header 
        onLogoClick={() => setView('landing')} 
        onMissionClick={() => setIsModalOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        {view === 'landing' && <Hero onStart={handleStart} />}
        
        {view === 'create' && (
          <div className="animate-fade-in-up">
            <div className="text-center pt-12 pb-4">
              <h1 className="text-3xl font-bold text-slate-900">Forge Your Curriculum</h1>
              <p className="text-slate-600 mt-2">Enter the details below to generate a comprehensive course structure.</p>
            </div>
            {error && (
              <div className="max-w-2xl mx-auto mt-6 px-4">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="font-semibold text-sm">Generation Error</h3>
                    <p className="text-sm mt-1 opacity-90">{error}</p>
                    <p className="text-xs mt-2 opacity-75">Tip: Check your API Key configuration if this persists.</p>
                  </div>
                </div>
              </div>
            )}
            <GeneratorForm onSubmit={handleGenerate} isLoading={loading} />
          </div>
        )}

        {view === 'result' && curriculum && (
          <div className="animate-fade-in">
            <CurriculumView curriculum={curriculum} onReset={handleReset} />
          </div>
        )}
      </main>

      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* AI Chat Assistant */}
      <ChatBot curriculum={curriculum} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} CurricuForge. Powered by Groq.</p>
      </footer>
    </div>
  );
};

export default App;
