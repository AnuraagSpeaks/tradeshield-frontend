import React from 'react';
import { Shield, Lock, Handshake, CheckCircle2, ArrowRight, Truck, CircleDot } from 'lucide-react';

export interface HeroProps {
  onOpenRole?: (role: 'buyer' | 'supplier') => void;
  onOpenDashboard?: () => void;
  onScrollToCalc?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRole, onOpenDashboard }) => {
  const handleBuyerClick = () => {
    if (onOpenRole) onOpenRole('buyer');
    else if (onOpenDashboard) onOpenDashboard();
  };

  const handleSupplierClick = () => {
    if (onOpenRole) onOpenRole('supplier');
    else if (onOpenDashboard) onOpenDashboard();
  };

  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-20 md:pt-18 md:pb-28 transition-colors duration-300">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Directly Integrated with RBI-regulated Escrow Nodes</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Secure Your Business Payments with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-emerald-300 dark:to-teal-400">
                100% Protection
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              PayShieldX acts as a secure, neutral gateway between B2B buyers and suppliers in India. We hold payments in trusted escrow accounts, resolving disputes and ensuring money only moves when goods are delivered.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleBuyerClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Start Secure Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSupplierClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700/90 font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
              >
                <Handshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Join as Supplier</span>
              </button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Suppliers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Escrow Protection</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Escrow Tracker Mockup (#ORD-90214) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-colors duration-300">
              
              {/* Mockup Window Header */}
              <div className="px-5 py-3.5 bg-slate-100/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 ml-2">payshieldx.in/dashboard/escrow-tracker</span>
              </div>

              {/* Mockup Window Body */}
              <div className="p-6 space-y-5">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-3.5 transition-colors">
                  
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400">Order Reference:</span>
                    <span className="text-slate-900 dark:text-white font-bold">#ORD-90214</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Total Amount:</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">₹4,50,000 INR</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Supplier Status:</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Shipped (V-Trans)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Escrow Status:</span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30">
                      Locked & Secured
                    </span>
                  </div>

                  {/* Dual Step Progress Bar */}
                  <div className="pt-3 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-center space-y-1 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 mx-auto flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Payment Locked</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-500/30 text-center space-y-1 shadow-sm ring-1 ring-blue-500/20">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 mx-auto flex items-center justify-center text-xs font-bold animate-pulse">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300">Buyer QC Review</span>
                    </div>
                  </div>

                </div>

                <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <CircleDot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Double-approval state locks invoice parameters.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
