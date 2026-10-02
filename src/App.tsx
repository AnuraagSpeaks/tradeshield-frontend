import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustTicker } from "./components/TrustTicker";
import { HowItWorks } from "./components/HowItWorks";
import { FeatureGrid } from "./components/FeatureGrid";
import { PricingSection } from "./components/PricingSection";
import { Testimonials } from "./components/Testimonials";
import { FAQSection } from "./components/FAQSection";
import { KnowledgeHub } from "./components/KnowledgeHub";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { TradeDashboard } from "./components/TradeDashboard";
import { LegalModal, LegalDocType } from "./components/LegalModal";
import { AuthOnboardingModal } from "./components/AuthOnboardingModal";

const AppContent: React.FC = () => {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");
  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>("terms");

  // Auth & Onboarding Modal
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authRole, setAuthRole] = useState<"buyer" | "supplier">("buyer");
  const [authMode, setAuthMode] = useState<"register" | "login">("login");

  // Direct /admin and /arbiter URL routing
  React.useEffect(() => {
    const checkAdminPath = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path.startsWith("/admin") || 
        path.startsWith("/arbiter") || 
        path.startsWith("/court") || 
        hash.includes("admin") || 
        hash.includes("arbiter")
      ) {
        if (!user || user.role !== "admin") {
          demoLogin("admin");
        }
        setCurrentView("dashboard");
      }
    };

    checkAdminPath();
    window.addEventListener("popstate", checkAdminPath);
    return () => window.removeEventListener("popstate", checkAdminPath);
  }, [user]);

  const openLegalDoc = (doc: LegalDocType) => {
    setActiveLegalDoc(doc);
    setLegalModalOpen(true);
  };

  const handleRoleSelect = (role: "buyer" | "supplier" = "buyer") => {
    if (isAuthenticated && user) {
      if (user.role !== role) {
        setAuthRole(role);
        setAuthMode("login");
        setAuthModalOpen(true);
        return;
      }
      setCurrentView("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setAuthRole(role);
      setAuthMode("login");
      setAuthModalOpen(true);
    }
  };

  const handleOpenDashboardDirect = () => {
    if (isAuthenticated && user) {
      setCurrentView("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setAuthRole("buyer");
      setAuthMode("login");
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setCurrentView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        {currentView === "landing" ? (
          <>
            <Hero
              onOpenRole={handleRoleSelect}
              onOpenDashboard={handleOpenDashboardDirect}
              onScrollToCalc={() => {
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
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
          <TradeDashboard
            onOpenAuth={(role, mode) => {
              setAuthRole(role);
              setAuthMode(mode);
              setAuthModalOpen(true);
            }}
          />
        )}
      </main>

      <Footer
        onOpenLegal={openLegalDoc}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <LegalModal
        isOpen={legalModalOpen}
        activeDoc={activeLegalDoc}
        onClose={() => setLegalModalOpen(false)}
        onSelectDoc={(doc) => setActiveLegalDoc(doc)}
      />

      <AuthOnboardingModal
        isOpen={authModalOpen}
        initialRole={authRole}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
