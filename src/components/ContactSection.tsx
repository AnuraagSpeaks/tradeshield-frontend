import React, { useState } from "react";
import { Phone, Mail, MessageSquare, Send, CheckCircle2, Headphones } from "lucide-react";

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", company: "", email: "", phone: "", message: "" });
    }, 5000);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello PayShieldX Team, I would like to inquire about B2B escrow and payment protection services.");
    window.open("https://wa.me/918920726073?text=" + text, "_blank");
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-3.5 h-3.5" /> Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Connect with Support Desk
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Have questions about plans, active disputes, or custom API setups? Reach out through our secure channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Info Cards Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Call Support</h4>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">+91 7762990177</p>
                <p className="text-xs text-slate-500">Mon - Sat, 9:00 AM - 7:00 PM IST</p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Direct WhatsApp Desk</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 text-[10px] font-black uppercase">Active</span>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">+91 8920726073</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Get real-time proposal updates and priority response on WhatsApp.</p>
                </div>
              </div>

              <button
                onClick={openWhatsApp}
                className="w-full py-3 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 8920726073)</span>
              </button>
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Email Compliance Desk</h4>
                <p className="text-sm text-teal-600 dark:text-teal-400 font-semibold">support@payshieldx.in</p>
                <p className="text-xs text-slate-500">2-hour response window for verified businesses</p>
              </div>
            </div>
          </div>

          {/* Ticket Submission Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-md dark:shadow-2xl space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Submit a Support Ticket</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Our arbitration and compliance desk investigates every query thoroughly.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Ticket Submitted Successfully!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  We have received your message. Our representative will get back to you via email or phone within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Sanjay Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company / Firm Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Kumar Ceramics Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Official Email</label>
                    <input
                      type="email"
                      required
                      placeholder="E.g., sanjay@kumarceramics.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone (10 digits)</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="E.g., 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message / Inquiry</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our transaction escrow desk assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Secure Message</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
