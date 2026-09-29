import React from 'react';
import { Vault, UserCheck, Scale, CircleCheck, RotateCcw, GitMerge } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Vault,
      title: 'Escrow Payment System',
      desc: 'Secure banking integrations hold buyer funds safely, ensuring suppliers only start production when money is verified.',
    },
    {
      icon: UserCheck,
      title: 'Fraud Protection',
      desc: 'Shields wholesalers and exporters from fly-by-night operators. Transactions require verified business registrations.',
    },
    {
      icon: Scale,
      title: 'Dispute Resolution',
      desc: 'In-built dispute system handles delivery lags or quality disputes via neutral mediators with legal binding.',
    },
    {
      icon: CircleCheck,
      title: 'Verified Suppliers',
      desc: 'Access a network of GST-verified, rating-approved manufacturers, exporters, and traders in India.',
    },
    {
      icon: RotateCcw,
      title: 'Easy Refunds',
      desc: 'If terms are violated or delivery fails, clear contract clauses ensure buyers get standard refunds smoothly.',
    },
    {
      icon: GitMerge,
      title: 'Integration Ready',
      desc: 'Developer-friendly APIs. Integrate escrow triggers directly into custom B2B portals or standard payment webhooks.',
    },
  ];

  return (
    <section id='features' className='py-24 relative bg-slate-50 dark:bg-transparent transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <span className='text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20'>
            Core Safeguards
          </span>
          <h2 className='text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Fintech Features Engineered for Trust
          </h2>
          <p className='text-slate-600 dark:text-slate-400 text-base sm:text-lg'>
            Maximize cash flow security, eliminate bad debts, and source safely across India with our B2B escrow plan.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className='p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all space-y-4 group shadow-sm hover:shadow-md'
              >
                <div className='w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-slate-950 transition-all'>
                  <Icon className='w-6 h-6' />
                </div>
                <h3 className='text-lg font-bold text-slate-900 dark:text-white'>{f.title}</h3>
                <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>{f.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
