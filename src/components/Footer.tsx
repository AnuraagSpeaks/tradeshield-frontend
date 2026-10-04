import React from 'react';
import { ShieldCheck, Lock, Building2, Fingerprint, Heart } from 'lucide-react';
import { LegalDocType } from './LegalModal';

interface FooterProps {
  onOpenLegal: (doc: LegalDocType) => void;
  onNavigate: (view: 'landing' | 'dashboard', hash?: string, path?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-black text-white text-lg tracking-tight">PayShieldX</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 font-mono">
                India
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              India&apos;s premium payment protection proposal and escrow platform for B2B traders, MSMEs, and exporters. Holding trust before every shipment.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-bold text-xs">256-bit Bank Grade Security</p>
                <p className="text-[10px] text-slate-500">RBI Nodal Escrow Compliant Channels</p>
              </div>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); onNavigate('landing', '#how-it-works'); }} className="hover:text-emerald-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('landing', '#features'); }} className="hover:text-emerald-400 transition-colors">Core Safeguards</a>
              </li>
              <li>
                <a href="#pricing" onClick={(e) => { e.preventDefault(); onNavigate('landing', '#pricing'); }} className="hover:text-emerald-400 transition-colors">Pricing Plans</a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard', undefined, '/dashboard')}
                  className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Live Escrow Portal
                </button>
              </li>
              <li>
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('dashboard', undefined, '/admin');
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-amber-400/90 font-mono text-[11px]"
                >
                  <span>⚖️ Arbitration & Admin Desk</span>
                </a>
              </li>
              <li>
                <a href="#knowledge" onClick={(e) => { e.preventDefault(); onNavigate('landing', '#knowledge'); }} className="hover:text-emerald-400 transition-colors">Knowledge Hub</a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/company/www-payshieldx-in/about/?viewAsMember=true" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-blue-400"
                >
                  <span>Official LinkedIn</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('refund')}
                  className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('dispute')}
                  className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Dispute Resolution
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('kyc')}
                  className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  KYC & Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('seller')}
                  className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Seller Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('buyer_protection')}
                  className="text-left hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Buyer Protection
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Safety Badges */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Trust & Safety</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Operations mapped under Reserve Bank of India Nodal Account Directives.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL 256-bit Encrypted
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-teal-400" /> RBI Escrow Nodal Node
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <Fingerprint className="w-3.5 h-3.5 text-amber-400" /> ISO 27001 Protocol
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 PayShieldX India. All Rights Reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Safe Indian B2B Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
