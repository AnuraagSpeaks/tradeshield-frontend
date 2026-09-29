import React, { useState } from "react";
import { BookOpen, Calendar, User, ArrowRight, X, ShieldAlert, Vault, Scale } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  icon: any;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Avoiding B2B Trade Fraud: A Guide for Exporters",
    date: "June 4, 2026",
    author: "Trade Legal Desk",
    excerpt:
      "Exporters in India lose crores annually due to payment defaults. Discover key strategies to secure international and interstate shipments.",
    icon: ShieldAlert,
    content: [
      "Exporters and suppliers in India face significant risk when dealing with buyers across state lines. Common frauds involve fake credentials, false cargo claims, and stalling payments indefinitely after goods reach destination ports.",
      "Key Safeguards for Exporters:",
      "• Verify GST & DIN: Always run a check on the buyer's GST registry and Director Identification Number before signing large contracts.",
      "• Use Digital Locked Escrows: Instead of relying on traditional post-dated cheques (which often bounce), secure a Payment Confirmation Proposal in escrow prior to dispatch.",
      "• Detailed Delivery Timelines: Clearly document transport nodes (transporter name, dispatch dates, intermediate check gates) in the proposal terms to leave no room for manufactured quality disputes.",
      "By routing the transaction details through PayShieldX, you lock the buyer's bank commitment. The payment is held in a neutral Nodal Account, securing the payout upon shipping verification.",
    ],
  },
  {
    id: "blog-2",
    title: "How Escrow Accounts Standardize Business Payments",
    date: "May 28, 2026",
    author: "FinSec Technical Team",
    excerpt:
      "Escrow is no longer just for real estate. Learn how tech integrations are using nodal escrow to make micro-purchases secure for SMEs.",
    icon: Vault,
    content: [
      "Traditionally, escrow accounts were limited to large mergers, acquisitions, or multi-crore real estate deals due to high bank set-up costs and complex paperwork.",
      "The Nodal Escrow Revolution:",
      "Recent technological advancements integrated with Reserve Bank of India Nodal banking directives permit automated escrow setups for micro, small, and medium enterprises (MSMEs).",
      "• Virtual Accounts: Tech portals create a dynamic, single-use escrow account (linked to major banks like ICICI or Axis Bank) for each B2B invoice.",
      "• Dual Control API: Smart API hooks trigger payouts automatically when both supplier delivery receipts and buyer acceptance criteria match.",
      "• Instant Settlement: Reduces transaction cycle times from weeks to under 3 hours once verification terms are satisfied.",
      "This allows small traders to operate with the security of a multinational, protecting cash flow reserves and expanding trade operations safely.",
    ],
  },
  {
    id: "blog-3",
    title: "Resolving Quality Disputes Without Going to Court",
    date: "May 15, 2026",
    author: "SME Legal Advisor",
    excerpt:
      "Disputes regarding product specifications are common in wholesale manufacturing. Learn how to draft bulletproof dual-approval proposals.",
    icon: Scale,
    content: [
      "Quality discrepancy is the number one reason cited by buyers when delaying payments to suppliers. Resolving this via civil courts takes years, completely freezing business capital.",
      "Arbitration Over Litigation:",
      "Having a structured, pre-approved proposal is the best defense against quality disputes. A Payment Protection Proposal must include explicit notes detailing what constitutes acceptable quality.",
      "• Sample Lock: Reference pre-agreed sample codes in the notes.",
      "• Third-Party Inspection: Agree on a certified inspection agency (e.g., SGS, Bureau Veritas) to verify goods before cargo loading.",
      "• Neutral Arbitration: Ensure your payment protection provider has legally binding arbitration terms where independent trade experts resolve disputes within days, not years.",
      "Using PayShieldX's built-in Disputes Panel, both parties can upload cargo reports, packing logs, and sample photos. Arbiters review this data objectively to release or refund funds based on merit.",
    ],
  },
];

export const KnowledgeHub: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="knowledge" className="py-24 bg-white dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> B2B Education
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Latest from the PayShieldX Knowledge Hub
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Insights, guides, and compliance articles to protect your business transactions in India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => {
            const Icon = post.icon;
            return (
              <div
                key={post.id}
                className="flex flex-col justify-between rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden group"
              >
                <div className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {post.author}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="p-8 pt-0">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {selectedPost.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedPost.date} • By {selectedPost.author}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedPost.title}</h2>
              {selectedPost.content.map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className={paragraph.startsWith('•') || paragraph.startsWith('Key') || paragraph.startsWith('The Nodal') || paragraph.startsWith('Arbitration')
                    ? 'font-semibold text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-700 dark:text-slate-300'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
