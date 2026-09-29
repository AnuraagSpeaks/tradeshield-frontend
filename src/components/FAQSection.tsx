import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is PayShieldX an RBI approved entity?",
    answer:
      "Yes, all funds processed through PayShieldX are locked and routed via Nodal escrow bank accounts monitored under Reserve Bank of India (RBI) guidelines. PayShieldX never directly accesses or keeps interest on your transaction money.",
  },
  {
    question: "What happens if the buyer refuses to release payments after delivery?",
    answer:
      "If the supplier uploads proof of delivery (e.g., Lorry Receipt, Bill of Lading, Geotagged goods handover) and the buyer goes unresponsive or refuses to release funds without valid cause, the supplier can raise a formal dispute. Our legal arbiters review the records and can execute an admin override to release funds within 7 days.",
  },
  {
    question: "Can we request edits to a proposal after it has been confirmed?",
    answer:
      "No. Once both parties click Approve and the proposal reaches Confirmed status, the proposal parameters lock automatically. This is to protect the integrity of the deal during the payment cycle. If changes are strictly required, the current proposal must be rejected or cancelled by mutual consent and a new one created.",
  },
  {
    question: "What are the refund terms for B2B transactions?",
    answer:
      "If a supplier fails to ship within the agreed delivery timeline, the buyer can request a refund. If the supplier does not object or upload a valid shipment proof within 48 hours, the funds are automatically refunded back to the buyer's source payment bank account.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 relative transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ Help
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to know about transactional safety, refunds, and B2B dispute overrides.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={'w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-200 ' + (
                      isOpen
                        ? 'rotate-180 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
