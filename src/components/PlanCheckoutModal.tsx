import React, { useState, useEffect } from "react";
import { 
  X, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  QrCode, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Sparkles,
  Zap,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { verifyGSTIN } from "../api/client";

export interface PlanDetails {
  id: "buyer_free" | "growth" | "business" | "enterprise";
  name: string;
  category: "Buyer Plan" | "Supplier Plan";
  priceMonthly: number;
  priceAnnual: number;
  period: string;
  badge?: string;
  tagline: string;
  transactionsLimit: string;
  features: string[];
  arbitrationLevel: string;
  apiAccess: string;
  supportLevel: string;
}

export const PLANS_DATA: Record<string, PlanDetails> = {
  buyer_free: {
    id: "buyer_free",
    name: "Secure Buyer Pass",
    category: "Buyer Plan",
    priceMonthly: 0,
    priceAnnual: 0,
    period: "Free Forever",
    badge: "Zero Cost",
    tagline: "Essential payment escrow protection for procurement buyers, importers, and MSME traders.",
    transactionsLimit: "Unlimited Transactions",
    features: [
      "100% Fund protection in RBI Nodal Escrow Accounts",
      "Standard 7-day inspection and refund window",
      "Dual-approval digital proposal contract lock",
      "GST invoice and e-way bill verification",
      "Neutral evidence-based arbitration access",
    ],
    arbitrationLevel: "Standard Panel (7-day resolution)",
    apiAccess: "Web Dashboard Portal",
    supportLevel: "Standard Email Support Desk",
  },
  growth: {
    id: "growth",
    name: "Supplier Growth Plan",
    category: "Supplier Plan",
    priceMonthly: 599,
    priceAnnual: 5990,
    period: "per month",
    badge: "Starter",
    tagline: "For small wholesalers, distributors, and local manufacturers seeking buyer trust.",
    transactionsLimit: "Up to 20 transactions / month",
    features: [
      "Up to 20 escrow transactions per month",
      "Verified Supplier Silver Trust Badge on directory",
      "Dual-approval proposal builder with instant locks",
      "Direct bank settlement via IMPS / RTGS within 3 hours of QC",
      "Transporter LR & dispatch proof upload pipeline",
    ],
    arbitrationLevel: "Standard Legal Review",
    apiAccess: "Dashboard & Webhooks",
    supportLevel: "Email & Chat Support (24hr SLA)",
  },
  business: {
    id: "business",
    name: "Supplier Business Plan",
    category: "Supplier Plan",
    priceMonthly: 1499,
    priceAnnual: 14990,
    period: "per month",
    badge: "Recommended",
    tagline: "For active exporters, industrial suppliers, and established multi-state traders.",
    transactionsLimit: "Up to 50 transactions / month",
    features: [
      "Up to 50 escrow transactions per month",
      "Verified Supplier Gold Trust Badge with top ranking",
      "Dedicated arbitration officer assigned to all disputes",
      "Multi-tranche milestone contracts (Advance, Dispatch, QC)",
      "Instant Penny-Drop bank beneficiary validation",
      "Export & interstate e-Way bill compliance check",
    ],
    arbitrationLevel: "Dedicated Arbitrator (72hr SLA)",
    apiAccess: "REST API & Webhooks",
    supportLevel: "Priority WhatsApp & Phone Desk (2hr SLA)",
  },
  enterprise: {
    id: "enterprise",
    name: "Supplier Enterprise Plan",
    category: "Supplier Plan",
    priceMonthly: 2499,
    priceAnnual: 24990,
    period: "per month",
    badge: "High Volume",
    tagline: "For high-volume export houses, large manufacturers, and procurement consortiums.",
    transactionsLimit: "Up to 100 transactions / month",
    features: [
      "Up to 100 transactions per month (Custom volume available)",
      "Platinum Verified Supplier Enterprise Badge",
      "Custom ERP & B2B portal API integration support",
      "24/7 dedicated legal arbiters and custom contract templates",
      "Sub-accounts for multi-city branch managers",
      "Comprehensive monthly double-entry ledger audit reports",
    ],
    arbitrationLevel: "Executive Arbitration Panel (24hr SLA)",
    apiAccess: "Full REST API, SDKs & Webhooks",
    supportLevel: "Dedicated Key Account Manager + 24/7 Hotline",
  },
};

interface PlanCheckoutModalProps {
  isOpen: boolean;
  initialPlanId: string;
  onClose: () => void;
  onSuccessProceed: (plan: PlanDetails) => void;
}

export const PlanCheckoutModal: React.FC<PlanCheckoutModalProps> = ({
  isOpen,
  initialPlanId,
  onClose,
  onSuccessProceed,
}) => {
  const { user, register, updateUser } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || "business");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [step, setStep] = useState<"details" | "payment" | "success">("details");

  // Form State
  const [companyName, setCompanyName] = useState(user?.business_name || "");
  const [contactPerson, setContactPerson] = useState(user?.contact_person || "");
  const [designation, setDesignation] = useState(user?.designation || "Director");
  const [gstin, setGstin] = useState(user?.gst || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.mobile || "");
  const [city, setCity] = useState(user?.city || "Mumbai");
  const [subId, setSubId] = useState("");
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  useEffect(() => {
    if (user) {
      if (user.business_name) setCompanyName(user.business_name);
      if (user.contact_person) setContactPerson(user.contact_person);
      if (user.gst) setGstin(user.gst);
      if (user.email) setEmail(user.email);
      if (user.mobile) setPhone(user.mobile);
      if (user.city) setCity(user.city);
    }
  }, [user]);

  if (!isOpen) return null;

  const currentPlan = PLANS_DATA[selectedPlanId] || PLANS_DATA["business"];
  const basePrice = billingCycle === "monthly" ? currentPlan.priceMonthly : currentPlan.priceAnnual;
  const gstAmount = basePrice > 0 ? Math.round(basePrice * 0.18) : 0;
  const totalPrice = basePrice + gstAmount;

  const handleVerifyGst = async () => {
    if (!gstin || gstin.trim().length < 10) {
      setErrorMsg("Please enter a valid 15-character GSTIN or PAN");
      return;
    }
    setIsVerifyingGst(true);
    setErrorMsg("");
    try {
      const res = await verifyGSTIN(gstin.trim().toUpperCase());
      if (res.valid && res.legal_name) {
        setCompanyName(res.legal_name);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsVerifyingGst(false);
    }
  };

  const handleFillDemo = () => {
    if (currentPlan.category === "Buyer Plan") {
      setCompanyName("Rawat Handlooms & Textiles Ltd");
      setContactPerson("Amit Rawat");
      setDesignation("Head of Procurement");
      setGstin("07AAAAA1111A1ZA");
      setEmail("procurement@rawathandlooms.in");
      setPhone("9876543210");
      setCity("New Delhi");
    } else {
      setCompanyName("Bharat Precision Castings Ltd");
      setContactPerson("Rajesh Singhania");
      setDesignation("Managing Director");
      setGstin("24AABCB5678B1Z2");
      setEmail("sales@bharatcastings.com");
      setPhone("9898123456");
      setCity("Vadodara");
    }
    setErrorMsg("");
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Please provide all required business identity details (Firm Name, Email, and Phone).");
      return;
    }

    const role = currentPlan.category === "Buyer Plan" ? "buyer" : "supplier";
    const generatedSubId = "PSX-SUB-" + Math.floor(100000 + Math.random() * 900000);
    setSubId(generatedSubId);

    // Register / save auth state
    await register({
      business_name: companyName,
      contact_person: contactPerson || "Authorized Signatory",
      designation: designation,
      email: email,
      mobile: phone,
      gst: gstin || "27AAAAA1111A1ZA",
      city: city,
      role: role,
      plan_tier: currentPlan.id,
      pass_id: generatedSubId,
    });

    if (currentPlan.priceMonthly === 0) {
      setStep("success");
    } else {
      setStep("payment");
    }
  };

  const handleSimulatePayment = () => {
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {step === "success" ? "Subscription & Escrow Pass Activated!" : "Choose Your Protection Plan & Business Onboarding"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RBI Nodal Escrow Integrated • 100% Tax Deductible B2B Invoice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          
          {step === "details" && (
            <div className="space-y-6">
              
              {/* Plan Switcher Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                  Select Tariff Tier:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.values(PLANS_DATA).map((p) => {
                    const isSelected = selectedPlanId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlanId(p.id)}
                        className={"p-3 rounded-2xl border text-left transition-all cursor-pointer relative " + (
                          isSelected
                            ? "bg-blue-50 dark:bg-slate-800/90 border-blue-600 dark:border-blue-500 shadow-md ring-1 ring-blue-500/20"
                            : "bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        )}
                      >
                        {p.badge && (
                          <span className="block text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 font-mono">
                            {p.badge}
                          </span>
                        )}
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">{p.name}</h4>
                        <p className="font-extrabold font-mono text-xs sm:text-sm text-slate-900 dark:text-emerald-400 mt-1">
                          {p.priceMonthly === 0 ? "Free" : `₹${p.priceMonthly}/mo`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Billing Cycle Switcher (for paid plans) */}
              {currentPlan.priceMonthly > 0 && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">Billing Frequency</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Save 2 months fee on Annual Subscriptions</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer " + (
                        billingCycle === "monthly"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("annual")}
                      className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 " + (
                        billingCycle === "annual"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      <span>Annual</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded font-black">-17%</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Plan Feature Overview Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      {currentPlan.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{currentPlan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentPlan.tagline}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {basePrice === 0 ? "₹0 Free" : `₹${basePrice.toLocaleString("en-IN")}`}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {billingCycle === "monthly" ? "+ 18% GST / month" : "+ 18% GST / year"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {currentPlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  <span><strong>Limits:</strong> {currentPlan.transactionsLimit}</span>
                  <span><strong>Arbitration:</strong> {currentPlan.arbitrationLevel}</span>
                  <span><strong>Support:</strong> {currentPlan.supportLevel}</span>
                </div>
              </div>

              {/* Company & GST Verification Form */}
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Business Details for KYC & Tax Invoice
                  </h4>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-fill Sample Data
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Registered Firm / Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="E.g., Rawat Handlooms Ltd"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">GSTIN (for 18% Input Tax Credit)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="E.g., 07AAAAA1111A1ZA"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyGst}
                        disabled={isVerifyingGst || !gstin}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingGst ? "..." : "Verify"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Person Name</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="E.g., Amit Rawat"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Official Business Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E.g., accounts@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile (For Alerts) *</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="E.g., 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Base Membership Tariff:</span>
                    <span className="font-mono font-bold">₹{basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>GST (18% CGST + SGST):</span>
                    <span className="font-mono font-bold">₹{gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Amount Payable:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <span>{currentPlan.priceMonthly === 0 ? "Complete Verification & Activate Free Buyer Pass" : "Proceed to Secure Payment Gateway"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold">
                  256-Bit SSL Escrow Gateway
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                  Pay ₹{totalPrice.toLocaleString("en-IN")} via Escrow Gate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Plan: <strong>{currentPlan.name}</strong> • Bill to: <strong>{companyName}</strong>
                </p>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={"p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer " + (
                    paymentMethod === "upi"
                      ? "bg-blue-50 dark:bg-slate-800 border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={"p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer " + (
                    paymentMethod === "card"
                      ? "bg-blue-50 dark:bg-slate-800 border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={"p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer " + (
                    paymentMethod === "netbanking"
                      ? "bg-blue-50 dark:bg-slate-800 border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs">NetBanking</span>
                </button>
              </div>

              {/* Payment Box Simulation */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                {paymentMethod === "upi" && (
                  <div className="space-y-3">
                    <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-inner">
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                      Scan via GPay, PhonePe, Paytm or BHIM
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      UPI VPA: <code className="text-blue-600 dark:text-blue-400">payshieldx.nodal@icici</code>
                    </p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        defaultValue="4111 2222 3333 4444"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Expiry MM/YY</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          defaultValue="12/28"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">CVV</label>
                        <input
                          type="password"
                          placeholder="888"
                          defaultValue="888"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="space-y-3 text-left">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Select Corporate / Retail Bank</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <option>HDFC Bank Corporate</option>
                      <option>ICICI Bank Direct</option>
                      <option>State Bank of India</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize ₹{totalPrice.toLocaleString("en-IN")} via Escrow Gate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                >
                  &larr; Back to plan selection
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6 space-y-6 max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
                  PASS ACTIVATED & VERIFIED
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Welcome to {currentPlan.name}!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your business account for <strong>{companyName}</strong> (GSTIN: {gstin || "Verified"}) is now active with full escrow protection.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subscription Ref:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{subId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Protection Quota:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentPlan.transactionsLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST Invoice:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 cursor-pointer">
                    <Download className="w-3 h-3" /> Download Tax Invoice
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSuccessProceed(currentPlan);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Enter Protected Escrow Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
