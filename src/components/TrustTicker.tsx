import React from "react";
import { TrendingUp, Users, ShieldAlert, Award } from "lucide-react";

export const TrustTicker: React.FC = () => {
  const metrics = [
    { label: "Total Escrow Protected", value: "₹240+ Cr", icon: TrendingUp, detail: "Across 4,800+ B2B contracts" },
    { label: "Payment Default Rate", value: "0.00%", icon: ShieldAlert, detail: "Zero bad debt for sellers" },
    { label: "Verified GSTIN Suppliers", value: "2,150+", icon: Users, detail: "PAN & Penny-drop verified" },
    { label: "Dispute Resolution Time", value: "< 72 hrs", icon: Award, detail: "Fast-track arbitration panel" },
  ];

  return (
    <section className="py-12 border-y border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-900/40 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                  {m.value}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
