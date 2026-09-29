import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustTicker } from './components/TrustTicker';
import { HowItWorks } from './components/HowItWorks';
import { FeatureGrid } from './components/FeatureGrid';
import { PricingSection } from './components/PricingSection';
import { Testimonials } from './components/Testimonials';
import { FAQSection } from './components/FAQSection';
import { KnowledgeHub } from './components/KnowledgeHub';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TradeDashboard } from './components/TradeDashboard';
import { LegalModal, LegalDocType } from './components/LegalModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('terms');

  const openLegalDoc = (doc: LegalDocType) => {
    setActiveLegalDoc(doc);
    setLegalModalOpen(true);
  };

  const handleRoleSelect = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-blue-500 selection:text-white dark:selection:bg-emerald-500 dark:selection:text-slate-950">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenRole={handleRoleSelect}
        onOpenLegal={openLegalDoc}
      />

      <main className="flex-1">
        {currentView === 'landing' ? (
          <>
            <Hero
              onOpenRole={handleRoleSelect}
              onOpenDashboard={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onScrollToCalc={() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <TrustTicker />
            <HowItWorks />
            <FeatureGrid />
            <PricingSection onOpenRole={handleRoleSelect} />
            <Testimonials />
            <FAQSection />
            <KnowledgeHub />
            <AboutSection />
            <ContactSection />
          </>
        ) : (
          <TradeDashboard />
        )}
      </main>

      <Footer
        onOpenLegal={openLegalDoc}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <LegalModal
        isOpen={legalModalOpen}
        activeDoc={activeLegalDoc}
        onClose={() => setLegalModalOpen(false)}
        onSelectDoc={(doc) => setActiveLegalDoc(doc)}
      />
    </div>
  );
};

export default App;
