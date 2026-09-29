import React from 'react';
import { ShieldCheck, Layers, Briefcase, Building2 } from 'lucide-react';
import { LegalDocType } from './LegalModal';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentView: 'landing' | 'dashboard';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onOpenRole?: (role: 'buyer' | 'supplier') => void;
  onOpenLegal?: (doc: LegalDocType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenRole }) => {
  const handleRoleClick = (role: 'buyer' | 'supplier') => {
    if (onOpenRole) {
      onOpenRole(role);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          onClick={() => onNavigate('landing')}
        >
          <img src="/logo.svg" alt="PayShieldX Logo" className="h-9 w-auto" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#home" onClick={() => onNavigate('landing')} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Home</a>
          <a href="#how-it-works" onClick={() => onNavigate('landing')} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
          <a href="#features" onClick={() => onNavigate('landing')} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Features</a>
          <a href="#pricing" onClick={() => onNavigate('landing')} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Pricing</a>
          <a href="#knowledge" onClick={() => onNavigate('landing')} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Knowledge Hub</a>
          <a href="#contact" onClick={() => onNavigate('landing')} className="hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">Contact</a>
        </nav>

        {/* Action Buttons: Theme Toggle, Buyer & Supplier Portals */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {currentView === 'landing' ? (
            <>
              <button
                onClick={() => handleRoleClick('buyer')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Buyer Portal</span>
              </button>

              <button
                onClick={() => handleRoleClick('supplier')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-emerald-500 dark:to-teal-500 hover:from-blue-500 hover:to-indigo-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 text-white dark:text-slate-950 text-xs font-extrabold shadow-md shadow-blue-500/20 dark:shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Supplier Portal</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-600 dark:text-emerald-400" />
              <span>Back to Overview</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
