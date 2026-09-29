import React from 'react';
import { Star, Building2, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We used to face massive payment collection delays from out-of-state buyers. By routing orders through PayShieldX proposals, we guarantee our payment locks before shipping. Absolute game changer for exporters.",
    author: "Amit Rawat",
    role: "Owner",
    location: "Rawat Handlooms (Panipat)",
    initials: "AR",
  },
  {
    quote:
      "Sourcing machine parts from unfamiliar vendors in Gujarat was always risky. With this Payment Protection Plan, we pay the amount, it stays in escrow, and only releases once the custom testing reports are uploaded.",
    author: "Vikas Mishra",
    role: "Procurement Head",
    location: "Mishra Tech (Indore)",
    initials: "VM",
  },
  {
    quote:
      "The dual-approval feature in the proposals is highly secure. Once we agree on details like partial advances and shipping dates, the contract becomes unchangeable. Prevents verbal disputes completely.",
    author: "Karan Gupta",
    role: "MD",
    location: "Gupta Agro Traders (Delhi)",
    initials: "KG",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" /> Case Studies
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by Indian Businesses
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            See how manufacturers, wholesalers, and SMEs secure their supply chain using PayShieldX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-200 dark:text-slate-800 group-hover:text-emerald-500/20 transition-colors" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-900">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white dark:text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md shadow-emerald-500/10">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.author}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role}, <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t.location}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
