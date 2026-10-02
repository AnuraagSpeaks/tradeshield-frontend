import React, { useState } from 'react';
import { Check, X, Calculator } from 'lucide-react';
import { PlanCheckoutModal, PlanDetails } from './PlanCheckoutModal';

interface PricingProps {
  onOpenRole: (role: 'buyer' | 'supplier') => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onOpenRole }) => {
  const [turnover, setTurnover] = useState<number>(500000);
  const [selectedPlanFee, setSelectedPlanFee] = useState<number>(1499);
  
  // Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string>('business');

  const effectivePercent = ((selectedPlanFee / turnover) * 100).toFixed(2);

  const handleOpenCheckout = (planId: string) => {
    setActivePlanId(planId);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = (plan: PlanDetails) => {
    onOpenRole(plan.category === 'Buyer Plan' ? 'buyer' : 'supplier');
  };

  return (
    <section id='pricing' className='py-24 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16'>
        
        <div className='text-center max-w-3xl mx-auto space-y-4'>
          <span className='text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20'>
            Simple Tariffs
          </span>
          <h2 className='text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Transparent Pricing Plans
          </h2>
          <p className='text-slate-600 dark:text-slate-400 text-base sm:text-lg'>
            No hidden charges. Simple, fixed monthly pricing for suppliers and a flat free pass for buyers. No discounts, no fine print.
          </p>
        </div>

        {/* 1. Buyer Pass Section */}
        <div className='max-w-md mx-auto'>
          <div className='text-center mb-4'>
            <span className='text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase'>B2B Buyer Protection Plan</span>
          </div>
          <div className='p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-blue-300 dark:border-blue-500/40 shadow-xl dark:shadow-2xl relative space-y-6 text-center'>
            <span className='absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'>
              Free Forever
            </span>
            <div>
              <h3 className='text-2xl font-extrabold text-slate-900 dark:text-white'>Secure Buyer Pass</h3>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>Perfect protection for importers, traders, and SME procurement buyers.</p>
              <div className='mt-4'>
                <span className='text-4xl font-extrabold text-slate-900 dark:text-white font-mono'>₹0</span>
                <span className='text-xs text-slate-500 dark:text-slate-400 ml-1'>/ month</span>
              </div>
            </div>

            <ul className='space-y-3 text-xs text-slate-700 dark:text-slate-300 text-left pt-4 border-t border-slate-100 dark:border-slate-800'>
              <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Unlimited dispute resolutions</li>
              <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Standard 100% refund window</li>
              <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Lock payments in secure escrow</li>
              <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> GST invoice validation</li>
            </ul>

            <button
              onClick={() => handleOpenCheckout('buyer_free')}
              className='w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-blue-600/20'
            >
              Start for Free (Buyer)
            </button>
          </div>
        </div>

        {/* 2. Supplier Plans Section (Growth, Business, Enterprise) */}
        <div>
          <div className='text-center mb-8'>
            <span className='text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase'>B2B Supplier Protection Plans</span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Growth Plan */}
            <div className='p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all'>
              <div>
                <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Growth Plan</h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>For small wholesalers & local manufacturers looking to build trust.</p>
                <div className='mt-5'>
                  <span className='text-3xl font-extrabold text-slate-900 dark:text-white font-mono'>₹599</span>
                  <span className='text-xs text-slate-500 dark:text-slate-400'> / month</span>
                </div>

                <ul className='space-y-3 text-xs text-slate-700 dark:text-slate-300 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800'>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Up to 20 transactions / month</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> <strong>₹2,00,000</strong> max monthly transaction value</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Verified Supplier Trust Badge</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Dual approval system access</li>
                  <li className='flex items-center gap-2 text-slate-400 dark:text-slate-500 line-through'><X className='w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0' /> Dedicated arbitration support</li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenCheckout('growth')}
                className='w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-all cursor-pointer'
              >
                Get Growth Plan
              </button>
            </div>

            {/* Business Plan (Recommended) */}
            <div className='p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-2 border-emerald-500/70 shadow-xl dark:shadow-2xl relative space-y-6 flex flex-col justify-between ring-2 ring-emerald-500/20'>
              <span className='absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-md'>
                Recommended
              </span>

              <div>
                <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Business Plan</h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>For active exporters, distributors, and established traders.</p>
                <div className='mt-5'>
                  <span className='text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono'>₹1,499</span>
                  <span className='text-xs text-slate-500 dark:text-slate-400'> / month</span>
                </div>

                <ul className='space-y-3 text-xs text-slate-700 dark:text-slate-300 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800'>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Up to 50 transactions / month</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> <strong>₹5,00,000</strong> max monthly transaction value</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Verified Supplier Trust Badge</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Dual approval system access</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Dedicated arbitration support</li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenCheckout('business')}
                className='w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 hover:from-emerald-500 hover:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 text-white dark:text-slate-950 font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20'
              >
                Get Business Plan
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className='p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all'>
              <div>
                <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Enterprise Plan</h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>For high-volume manufacturers and export houses in India.</p>
                <div className='mt-5'>
                  <span className='text-3xl font-extrabold text-slate-900 dark:text-white font-mono'>₹2,499</span>
                  <span className='text-xs text-slate-500 dark:text-slate-400'> / month</span>
                </div>

                <ul className='space-y-3 text-xs text-slate-700 dark:text-slate-300 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800'>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Up to 100 transactions / month</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> <strong>₹10,00,000</strong> max monthly transaction value</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Verified Supplier Trust Badge</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> Custom API Integrations</li>
                  <li className='flex items-center gap-2'><Check className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' /> 24/7 dedicated legal arbiters</li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenCheckout('enterprise')}
                className='w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-all cursor-pointer'
              >
                Get Enterprise Plan
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Plan Checkout & Feature Breakdown Modal */}
      <PlanCheckoutModal
        isOpen={checkoutModalOpen}
        initialPlanId={activePlanId}
        onClose={() => setCheckoutModalOpen(false)}
        onSuccessProceed={handleCheckoutSuccess}
      />
    </section>
  );
};
