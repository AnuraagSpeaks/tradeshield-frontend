import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export const EscrowCalculator: React.FC = () => {
  const [dealValue, setDealValue] = useState<number>(2500000);
  const feePercent = 0.75;
  const platformFee = (dealValue * feePercent) / 100;
  const gstOnFee = platformFee * 0.18;
  const totalFee = platformFee + gstOnFee;
  const estimatedRiskSaved = dealValue * 0.10;

  return (
    <section id="calculator" className="py-24 bg-slate-900/30 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Escrow Fee & Risk Savings Calculator
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            No hidden charges. Just 0.75% platform fee with full GST invoicing.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-300">Contract / Deal Value (INR)</label>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ₹{dealValue.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-2">
                <span>₹1 Lakh</span>
                <span>₹1 Crore</span>
                <span>₹5 Crore</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase">Typical 3-Stage Escrow Tranche:</span>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono">20% Mobilization</span>
                  <p className="text-sm font-bold text-white font-mono mt-1">₹{(dealValue * 0.20).toLocaleString("en-IN")}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono">40% On Dispatch</span>
                  <p className="text-sm font-bold text-white font-mono mt-1">₹{(dealValue * 0.40).toLocaleString("en-IN")}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono">40% QC Delivery</span>
                  <p className="text-sm font-bold text-white font-mono mt-1">₹{(dealValue * 0.40).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-slate-400">PayShield Fee (0.75%)</span>
              <span className="text-lg font-bold text-white font-mono">₹{platformFee.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-slate-400">18% GST (Input Credit Available)</span>
              <span className="text-sm font-bold text-slate-300 font-mono">₹{gstOnFee.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-sm font-bold text-white">Total Escrow Protection Cost</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">₹{totalFee.toLocaleString("en-IN")}</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Estimated Bad Debt Exposure Saved:</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-white">
                ₹{estimatedRiskSaved.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-emerald-400/80">Based on industry average 10% unrecovered trade defaults.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};