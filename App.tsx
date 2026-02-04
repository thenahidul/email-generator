
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Generator from './components/Generator';
import Inbox from './components/Inbox';
import BenefitsSection from './components/BenefitsSection';
import { Account } from './types';

const App: React.FC = () => {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Restore session from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem('edugen_session');
    if (saved) {
      try {
        setActiveAccount(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('edugen_session');
      }
    }
  }, []);

  const handleAccountCreated = (acc: Account) => {
    setIsCreating(true);
    // Artificial delay for better UX
    setTimeout(() => {
      setActiveAccount(acc);
      localStorage.setItem('edugen_session', JSON.stringify(acc));
      setIsCreating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const resetSession = () => {
    if (confirm('Are you sure? Your current address and any messages will be lost.')) {
      setActiveAccount(null);
      localStorage.removeItem('edugen_session');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        {!activeAccount && (
          <div className="bg-white pt-16 pb-20 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                Your Instant <span className="text-blue-600">Educational</span> Identity
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                Generate high-quality temporary academic email addresses. Perfect for testing, 
                educational software previews, and protecting your primary university inbox.
              </p>
              <Generator onAccountCreated={handleAccountCreated} isLoading={isCreating} />
            </div>
          </div>
        )}

        {/* Active Session UI */}
        {activeAccount && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Active Workspace</h2>
                <p className="text-gray-500">Managing temporary inbox for student identity</p>
              </div>
              <button
                onClick={resetSession}
                className="px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
              >
                <i className="fas fa-trash-alt"></i>
                Terminate Session
              </button>
            </div>

            <Inbox account={activeAccount} />
          </div>
        )}

        <BenefitsSection />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} EduGen Academic Tools. All rights reserved. 
            Powered by Gemini AI and Mail.tm APIs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
