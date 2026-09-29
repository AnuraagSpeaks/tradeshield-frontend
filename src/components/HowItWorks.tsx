import React from 'react';
import { FileEdit, CheckCheck, Lock, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Create & Agree',
      desc: 'Buyer or Supplier drafts a Payment Confirmation Proposal with specific terms, timelines, and amounts.',
      icon: FileEdit,
      tag: 'Draft Proposal',
    },
    {
      num: '2',
      title: 'Double Approval',
      desc: 'Both parties approve the proposal terms. Once confirmed, payment parameters lock to prevent changes.',
      icon: CheckCheck,
      tag: 'Mutual Lock',
    },
    {
      num: '3',
      title: 'Pay & Lock',
      desc: 'Buyer completes payment. Funds are locked securely in a dedicated RBI-compliant escrow account.',
      icon: Lock,
      tag: 'Escrow Vault',
    },
    {
      num: '4',
      title: 'Deliver & Release',
      desc: 'Supplier ships the goods. Upon buyer verification, funds are instantly released to the supplier.',
      icon: Truck,
      tag: 'Instant Payout',
    },
  ];

  return (
    <section id='how-it-works' className='py-24 bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <span className='text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20'>
            Process Flow
          </span>
          <h2 className='text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            How PayShieldX Protects Your Business
          </h2>
          <p className='text-slate-600 dark:text-slate-400 text-base sm:text-lg'>
            A simple 4-step dual-approval system protecting B2B buyers and suppliers from trade disputes and defaults.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className='p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 transition-all space-y-4 relative shadow-sm hover:shadow-md'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-3xl font-black font-mono text-blue-600/90 dark:text-blue-400/80'>
                    {s.num}
                  </span>
                  <div className='w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                    <Icon className='w-5 h-5' />
                  </div>
                </div>

                <span className='text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 inline-block'>
                  {s.tag}
                </span>

                <h3 className='text-lg font-bold text-slate-900 dark:text-white'>{s.title}</h3>
                <p className='text-xs text-slate-600 dark:text-slate-400 leading-relaxed'>{s.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
