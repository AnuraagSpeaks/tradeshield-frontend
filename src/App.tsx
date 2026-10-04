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

  // Unified Navigation & URL state sync
  const navigateTo = (view: "landing" | "dashboard", hash?: string, path?: string) => {
    if (view === "landing") {
      setCurrentView("landing");
      const targetUrl = hash && hash !== "#home" && hash !== "#" ? `/${hash}` : "/";
      window.history.pushState({}, "", targetUrl);
      if (hash && hash !== "#home" && hash !== "#") {
        const id = hash.replace("#", "");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (path === "/admin" && (!user || user.role !== "admin")) {
        demoLogin("admin");
      }
      setCurrentView("dashboard");
      const targetPath = path || (user?.role === "admin" ? "/admin" : "/dashboard");
      window.history.pushState({}, "", targetPath);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Direct /admin, /dashboard, and URL popstate routing
  React.useEffect(() => {
    const handleUrlRouting = () => {
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
      } else if (path.startsWith("/dashboard") || path.startsWith("/portal")) {
        setCurrentView("dashboard");
      } else {
        setCurrentView("landing");
        if (hash) {
          const id = hash.replace("#", "");
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener("popstate", handleUrlRouting);
    return () => window.removeEventListener("popstate", handleUrlRouting);
  }, []);

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
      navigateTo("dashboard");
    } else {
      setAuthRole(role);
      setAuthMode("login");
      setAuthModalOpen(true);
    }
  };

  const handleOpenDashboardDirect = () => {
    if (isAuthenticated && user) {
      navigateTo("dashboard");
    } else {
      setAuthRole("buyer");
      setAuthMode("login");
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    navigateTo("dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-blue-500 selection:text-white dark:selection:bg-emerald-500 dark:selection:text-slate-950">
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
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
        onNavigate={navigateTo}
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
