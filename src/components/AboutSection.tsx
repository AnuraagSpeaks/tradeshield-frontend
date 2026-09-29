import React from 'react';
import { Target, Eye, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Story & Mission */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" /> Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Building Trust in India&apos;s <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  B2B Trade Ecosystem
                </span>
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                At PayShieldX, our goal is simple: to make B2B transactions completely secure and transparent. We recognize that trust deficits slow down economic expansion for MSMEs, suppliers, and distributors.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                By leveraging state-of-the-art fintech integrations and RBI-regulated nodal banking channels, we ensure that buyers do not lose money on bad deliveries, and suppliers are guaranteed timely collections on successful handovers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Our Mission</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Eradicate trade credit risk and payment delays for 10 Lakh MSMEs and SME wholesalers in India.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Our Vision</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Become the standard payment confirmation layer powering B2B marketplaces across South Asia.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Security DNA Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md p-10 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-xl dark:shadow-2xl relative text-center space-y-6">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-emerald-500/20 blur-2xl"></div>
              
              <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Security is Our DNA</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every PayShieldX node operates on PCI-DSS compliant infrastructure, secured using 256-bit military-grade encryption and RBI-regulated nodal escrow pipelines.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-left">
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>256-bit SSL & TLS 1.3 Encryption</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>RBI Nodal Bank Integrated Settlement</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>GSTIN & Penny-Drop Bank Verified</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
