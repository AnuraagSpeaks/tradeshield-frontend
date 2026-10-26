import React from "react";
import { ShieldCheck, Briefcase, Building2, LogOut, ArrowRight, Scale } from "lucide-react";
import { LegalDocType } from "./LegalModal";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  currentView: "landing" | "dashboard";
  onNavigate: (view: "landing" | "dashboard", hash?: string, path?: string) => void;
  onOpenRole?: (role: "buyer" | "supplier") => void;
  onOpenLegal?: (doc: LegalDocType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenRole }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleRoleClick = (role: "buyer" | "supplier") => {
    if (onOpenRole) {
      onOpenRole(role);
    } else {
      onNavigate("dashboard", undefined, "/dashboard");
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    onNavigate("landing", hash);
  };

  const handleLogout = () => {
    logout();
    onNavigate("landing", "#home", "/");
  };

  const handleGoToDashboard = () => {
    onNavigate("dashboard", undefined, user?.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Contextual Workspace Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            className="flex items-center gap-2 cursor-pointer group transition-transform active:scale-95"
            onClick={() => onNavigate("landing", "#home", "/")}
            title="PayShieldX Homepage"
          >
            <img src="/logo.svg" alt="PayShieldX Logo" className="h-9 w-auto" />
          </div>

          {/* In Dashboard: Display Sleek Application Context Badge */}
          {currentView === "dashboard" && user && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono flex items-center gap-1.5 border shadow-xs ${
                user.role === "admin"
                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/50"
                  : user.role === "supplier"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"
              }`}>
                {user.role === "admin" ? (
                  <Scale className="w-3.5 h-3.5" />
                ) : user.role === "supplier" ? (
                  <Building2 className="w-3.5 h-3.5" />
                ) : (
                  <Briefcase className="w-3.5 h-3.5" />
                )}
                <span>
                  {user.role === "admin"
                    ? "Arbitration & Executive Desk"
                    : user.role === "supplier"
                    ? "Supplier Portal"
                    : "Buyer Portal"}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links (Visible on Marketing Landing Page Only) */}
        {currentView === "landing" && (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Home</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, "#how-it-works")} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#features" onClick={(e) => handleNavClick(e, "#features")} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#pricing" onClick={(e) => handleNavClick(e, "#pricing")} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#knowledge" onClick={(e) => handleNavClick(e, "#knowledge")} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Knowledge Hub</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Contact</a>
          </nav>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {/* Authenticated User Status Pill (Direct Dashboard Trigger) */}
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 text-xs transition-all cursor-pointer group shadow-2xs hover:border-blue-400 dark:hover:border-emerald-500/50"
                title={currentView === "landing" ? "Click to open your dashboard" : "Active verified session"}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                <div className="text-left">
                  <div className="font-extrabold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[170px]">
                    {user.business_name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {user.role === "admin" ? "⚖️ Neutral Arbiter" : user.role === "supplier" ? "Verified Supplier" : "Buyer Pass"}
                  </div>
                </div>

                {currentView === "landing" && (
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
                )}
              </button>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out of Session"
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 dark:bg-slate-900 dark:hover:bg-rose-950/40 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            currentView === "landing" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleClick("buyer")}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Buyer Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleClick("supplier")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-emerald-500 dark:to-teal-500 hover:from-blue-500 hover:to-indigo-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 text-white dark:text-slate-950 text-xs font-extrabold shadow-md shadow-blue-500/20 dark:shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Supplier Portal</span>
                </button>
              </div>
            )
          )}
        </div>

      </div>
    </header>
  );
};
