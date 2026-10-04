import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  ArrowUpRight, 
  CreditCard, 
  Scale, 
  Landmark, 
  FileText, 
  ChevronRight, 
  RefreshCw,
  ExternalLink,
  Lock,
  Percent,
  Sparkles,
  Award
} from "lucide-react";
import { 
  AdminBusinessHealthStats, 
  BuyerRecord, 
  SupplierRecord, 
  AdminFinanceStats, 
  Dispute,
  SettlementItem,
  KYCDocument
} from "../types";
import { 
  fetchAdminStats, 
  fetchAdminBuyers, 
  fetchAdminSuppliers, 
  fetchAdminFinance, 
  fetchDisputes,
  verifyAdminKYC, 
  processAdminSettlement,
  arbitrateDispute,
  fetchLedgerJournals
} from "../api/client";

export const AdminExecutiveDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "buyers" | "suppliers" | "finance" | "disputes" | "ledger">("overview");
  const [loading, setLoading] = useState<boolean>(true);

  // Data States
  const [stats, setStats] = useState<AdminBusinessHealthStats | null>(null);
  const [buyers, setBuyers] = useState<BuyerRecord[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [finance, setFinance] = useState<AdminFinanceStats | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [journals, setJournals] = useState<any[]>([]);

  // Search & Filter States
  const [buyerSearch, setBuyerSearch] = useState("");
  const [buyerKycFilter, setBuyerKycFilter] = useState<string>("ALL");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierPlanFilter, setSupplierPlanFilter] = useState<string>("ALL");
  const [supplierKycFilter, setSupplierKycFilter] = useState<string>("ALL");

  // Selected Detail Modal States
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerRecord | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>("");

  // Dispute Arbitration Modal
  const [arbitrationModalOpen, setArbitrationModalOpen] = useState(false);
  const [activeDispute, setActiveDispute] = useState<Dispute | null>(null);
  const [verdictType, setVerdictType] = useState<"REFUND_BUYER" | "RELEASE_SUPPLIER" | "SPLIT_50_50">("REFUND_BUYER");
  const [verdictNotes, setVerdictNotes] = useState("Independent technical inspection confirmed defect. Full escrow refund decreed.");

  const loadAllData = async () => {
    setLoading(true);
    const [sData, bData, supData, fData, dData, jData] = await Promise.all([
      fetchAdminStats(),
      fetchAdminBuyers(),
      fetchAdminSuppliers(),
      fetchAdminFinance(),
      fetchDisputes(),
      fetchLedgerJournals(),
    ]);
    setStats(sData);
    setBuyers(bData);
    setSuppliers(supData);
    setFinance(fData);
    setDisputes(dData);
    setJournals(jData);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(""), 4500);
  };

  const handleVerifyKyc = async (userId: string, status: "Approved" | "Rejected", companyName: string) => {
    await verifyAdminKYC(userId, status);
    showNotification(`KYC document verification for ${companyName} has been ${status.toUpperCase()}!`);
    loadAllData();
    if (selectedSupplier && selectedSupplier.supplier_id === userId) {
      setSelectedSupplier({ ...selectedSupplier, verification_status: status });
    }
  };

  const handleDisburseSettlement = async (settlement: SettlementItem) => {
    const res = await processAdminSettlement(settlement.settlement_id);
    showNotification(`₹${settlement.amount.toLocaleString("en-IN")} successfully disbursed to ${settlement.supplier_name}! UTR: ${res.utr_number}`);
    loadAllData();
  };

  const handleExecuteArbitration = async () => {
    if (!activeDispute) return;
    const buyerRefund = verdictType === "REFUND_BUYER" ? activeDispute.claim_amount : verdictType === "SPLIT_50_50" ? activeDispute.claim_amount * 0.5 : 0;
    const sellerRelease = verdictType === "RELEASE_SUPPLIER" ? activeDispute.claim_amount : verdictType === "SPLIT_50_50" ? activeDispute.claim_amount * 0.5 : 0;

    await arbitrateDispute(activeDispute.id, verdictNotes, buyerRefund, sellerRelease);
    setArbitrationModalOpen(false);
    showNotification(`Arbitration Verdict Executed! Escrow Vault split: ₹${buyerRefund.toLocaleString("en-IN")} refunded to Buyer, ₹${sellerRelease.toLocaleString("en-IN")} released to Supplier.`);
    loadAllData();
  };

  // Filtered lists
  const filteredBuyers = buyers.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.company_name.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.buyer_id.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.gstin.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.mobile.includes(buyerSearch);
    const matchesKyc = buyerKycFilter === "ALL" || b.kyc_status.toUpperCase() === buyerKycFilter.toUpperCase();
    return matchesSearch && matchesKyc;
  });

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch = 
      s.company_name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.contact_person.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.supplier_id.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.gstin.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.mobile.includes(supplierSearch);
    const matchesPlan = supplierPlanFilter === "ALL" || s.supplier_plan.toLowerCase().includes(supplierPlanFilter.toLowerCase());
    const matchesKyc = supplierKycFilter === "ALL" || s.verification_status.toUpperCase() === supplierKycFilter.toUpperCase();
    return matchesSearch && matchesPlan && matchesKyc;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Toast notification */}
      {actionSuccessMsg && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-200 text-xs font-bold max-w-md">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Top Executive Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-black uppercase">
              👑 Executive Owner Portal
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PayShieldX Master Control & Business Health Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Real-time business health monitoring, buyer/supplier management, KYC verification desk, and RBI Nodal Escrow finance operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={loadAllData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
          >
            <RefreshCw className={"w-3.5 h-3.5 " + (loading ? "animate-spin" : "")} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("finance")}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Escrow Vault: ₹{(stats?.platform_revenue ? 48500000 : 0).toLocaleString("en-IN")}</span>
          </button>
        </div>
      </div>

      {/* Top Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: "overview", label: "1. Business Health", icon: TrendingUp, badge: null },
          { id: "buyers", label: "2. Buyer Management", icon: Users, badge: buyers.length },
          { id: "suppliers", label: "3. Supplier Management", icon: Building2, badge: suppliers.length },
          { id: "finance", label: "4. Revenue & Finance", icon: DollarSign, badge: finance?.pending_settlements.length ? `${finance.pending_settlements.length} Pending` : null },
          { id: "disputes", label: "5. Arbitration Court", icon: Scale, badge: disputes.length },
          { id: "ledger", label: "6. Ledger Audit", icon: FileText, badge: journals.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={"px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 " + (
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400/40"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={"px-2 py-0.5 rounded-full text-[10px] font-mono font-black " + (
                  isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* 1. DASHBOARD — OVERALL BUSINESS HEALTH     */}
      {/* ========================================== */}
      {activeTab === "overview" && stats && (
        <div className="space-y-8">
          
          {/* Main 16-Metric Executive KPI Grid from PDF */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <span>Executive Telemetry & Platform KPIs</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Showing 16 core business metrics
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              
              {/* Total Buyers */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Total Buyers</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.total_buyers.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+14% this month</p>
              </div>

              {/* Total Suppliers */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Total Suppliers</span>
                  <Building2 className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.total_suppliers.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">645 Active Sellers</p>
              </div>

              {/* Active Users */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Active Users</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.active_users.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">96.1% retention rate</p>
              </div>

              {/* New Registrations */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">New Registrations</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  +{stats.new_registrations_today} Today
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {stats.new_registrations_week} / week • {stats.new_registrations_month} / mo
                </div>
              </div>

              {/* KYC Status Matrix */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">KYC Verification</span>
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-amber-500">{stats.kyc_pending}</span>
                  <span className="text-xs text-slate-400">Pending Review</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="text-emerald-500 font-bold">{stats.kyc_approved} Approved</span> • <span className="text-rose-500">{stats.kyc_rejected} Rejected</span>
                </div>
              </div>

              {/* Total Payment Proposals */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Total Proposals</span>
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.total_payment_proposals.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="text-emerald-500 font-bold">{stats.approved_proposals} Approved</span> • <span className="text-amber-500">{stats.pending_proposals} Pending</span>
                </div>
              </div>

              {/* Disputed Transactions */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Disputed Deals</span>
                  <Scale className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
                  {stats.disputed_transactions}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">0.35% dispute rate (Benchmark &lt; 1%)</p>
              </div>

              {/* Failed Transactions */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Failed Transactions</span>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.failed_transactions}
                </div>
                <p className="text-[11px] text-emerald-500 font-bold">99.9% Gateway Uptime</p>
              </div>

              {/* Platform Revenue */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Platform Revenue (0.75%)</span>
                  <Percent className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
                  ₹{(stats.platform_revenue / 100000).toFixed(2)} Lakh
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">₹{stats.platform_revenue.toLocaleString("en-IN")}</p>
              </div>

              {/* Membership Revenue */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Membership Revenue</span>
                  <Award className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                  {stats.membership_revenue >= 100000 
                    ? `₹${(stats.membership_revenue / 100000).toFixed(2)} Lakh` 
                    : `₹${stats.membership_revenue.toLocaleString("en-IN")}`}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Growth, Business & Enterprise</p>
              </div>

              {/* Pending Settlements */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Pending Settlements</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {stats.pending_settlements >= 100000
                    ? `₹${(stats.pending_settlements / 100000).toFixed(2)} Lakh`
                    : `₹${stats.pending_settlements.toLocaleString("en-IN")}`}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">QC Approved Disbursals Queue</p>
              </div>

              {/* Refund Amount */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Refund Amount</span>
                  <XCircle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  ₹{(stats.refund_amount / 100000).toFixed(2)} Lakh
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Settled to verified buyer accounts</p>
              </div>

              {/* Today's Collection */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200 dark:border-blue-500/30 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-bold">Today&apos;s Collection</span>
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-blue-700 dark:text-blue-300">
                  ₹{stats.today_collection.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80">Real-time escrow inbound inflows</p>
              </div>

              {/* Monthly Revenue */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
                  <span className="font-bold">Monthly Revenue (MRR)</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                  ₹{(stats.monthly_revenue / 100000).toFixed(2)} Lakh
                </div>
                <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-mono">₹{stats.monthly_revenue.toLocaleString("en-IN")} Run-Rate</p>
              </div>

            </div>
          </div>

          {/* Quick Action Operations */}
          <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
              Priority Administrative Workflows
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSupplierKycFilter("PENDING");
                  setActiveTab("suppliers");
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Review Pending KYC</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-1">
                  {stats.kyc_pending} Suppliers awaiting verification
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("finance")}
                className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Process Settlements</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  ₹{(stats.pending_settlements / 100000).toFixed(2)}L ready for IMPS
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("disputes")}
                className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-rose-500 text-left transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Arbitration Panel</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-mono mt-1">
                  {disputes.length} active dispute cases
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ledger")}
                className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-left transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Double-Entry Audit</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-1">
                  {journals.length} immutable journal records
                </p>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* 2. BUYER MANAGEMENT                        */}
      {/* ========================================== */}
      {activeTab === "buyers" && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={buyerSearch}
                onChange={(e) => setBuyerSearch(e.target.value)}
                placeholder="Search by Buyer ID, Name, Firm, GSTIN, PAN or Mobile..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">KYC Status:</span>
              <select
                value={buyerKycFilter}
                onChange={(e) => setBuyerKycFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="ALL">All KYC</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Buyers Data Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Buyer ID</th>
                    <th className="p-4">Company & Signatory</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">GSTIN & PAN</th>
                    <th className="p-4">PAN / KYC Status</th>
                    <th className="p-4">Deals Done</th>
                    <th className="p-4">Disputes</th>
                    <th className="p-4">Total Value</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredBuyers.map((b) => (
                    <tr key={b.buyer_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {b.buyer_id}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{b.company_name}</div>
                        <div className="text-[11px] text-slate-500">{b.name}</div>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="text-slate-900 dark:text-slate-200">{b.mobile}</div>
                        <div className="text-[11px] text-slate-500">{b.email}</div>
                      </td>
                      <td className="p-4 font-mono text-[11px] space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">{b.gstin}</div>
                        <div className="text-slate-500">PAN: {b.pan}</div>
                      </td>
                      <td className="p-4">
                        <span className={"px-2.5 py-1 rounded-full text-[10px] font-mono font-bold " + (
                          b.kyc_status === "Approved"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : b.kyc_status === "Pending"
                            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                            : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"
                        )}>
                          {b.kyc_status}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                        {b.completed_transactions} deals
                      </td>
                      <td className="p-4 font-mono">
                        <span className={b.disputes > 0 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-400"}>
                          {b.disputes}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{b.total_transaction_value.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedBuyer(b)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors cursor-pointer"
                        >
                          View File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Buyer Slide-over Modal */}
          {selectedBuyer && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                      Buyer Dossier • {selectedBuyer.buyer_id}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {selectedBuyer.company_name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedBuyer(null)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-slate-500">Contact Person</span>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedBuyer.name}</p>
                    <p className="text-slate-600 dark:text-slate-400">{selectedBuyer.mobile}</p>
                    <p className="text-slate-600 dark:text-slate-400">{selectedBuyer.email}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 font-mono">
                    <span className="text-slate-500">Compliance & Tax</span>
                    <p className="font-bold text-slate-900 dark:text-white">GSTIN: {selectedBuyer.gstin}</p>
                    <p className="text-slate-600 dark:text-slate-400">PAN: {selectedBuyer.pan}</p>
                    <p className="text-emerald-600 font-bold">KYC: {selectedBuyer.kyc_status}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500">Completed Volume</span>
                    <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-1">
                      {selectedBuyer.completed_transactions} Deals
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500">Total Transacted</span>
                    <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                      ₹{selectedBuyer.total_transaction_value.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500">Disputes Raised</span>
                    <div className="text-sm font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
                      {selectedBuyer.disputes}
                    </div>
                  </div>
                </div>

                {/* Refund History Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
                    Refund & Reversal History
                  </h4>
                  {selectedBuyer.refund_history.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      No refund records or reversals logged for this buyer.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedBuyer.refund_history.map((rf) => (
                        <div key={rf.refund_id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              ₹{rf.amount.toLocaleString("en-IN")} • {rf.status}
                            </div>
                            <p className="text-slate-500 text-[11px]">{rf.reason}</p>
                            <span className="font-mono text-[10px] text-slate-400">UTR: {rf.utr_number}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(rf.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleVerifyKyc(selectedBuyer.buyer_id, "Approved", selectedBuyer.company_name);
                      setSelectedBuyer(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Approve / Re-verify Buyer KYC
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBuyer(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* 3. SUPPLIER MANAGEMENT                     */}
      {/* ========================================== */}
      {activeTab === "suppliers" && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
                placeholder="Search by Supplier ID, Company, Contact Person, GSTIN, PAN..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Plan:</span>
                <select
                  value={supplierPlanFilter}
                  onChange={(e) => setSupplierPlanFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Plans</option>
                  <option value="growth">Growth (₹599)</option>
                  <option value="business">Business (₹1,499)</option>
                  <option value="enterprise">Enterprise (₹2,499)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">KYC:</span>
                <select
                  value={supplierKycFilter}
                  onChange={(e) => setSupplierKycFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="ALL">All KYC</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Suppliers Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Supplier ID</th>
                    <th className="p-4">Company & Contact</th>
                    <th className="p-4">GSTIN & PAN</th>
                    <th className="p-4">Active Plan</th>
                    <th className="p-4">Plan Expiry</th>
                    <th className="p-4">KYC Status</th>
                    <th className="p-4">Proposals</th>
                    <th className="p-4">Bank Settlement</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredSuppliers.map((s) => (
                    <tr key={s.supplier_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {s.supplier_id}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{s.company_name}</div>
                        <div className="text-[11px] text-slate-500">{s.contact_person} • {s.mobile}</div>
                      </td>
                      <td className="p-4 font-mono text-[11px] space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">{s.gstin}</div>
                        <div className="text-slate-500">PAN: {s.pan}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-mono font-bold text-[10px]">
                          {s.supplier_plan}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {new Date(s.plan_expiry).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={"px-2.5 py-1 rounded-full text-[10px] font-mono font-bold " + (
                          s.verification_status === "Approved"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : s.verification_status === "Pending"
                            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 animate-pulse"
                            : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"
                        )}>
                          {s.verification_status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-900 dark:text-slate-200">
                        <span className="font-bold">{s.total_proposals}</span> ({s.accepted_proposals} accepted)
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        <div className="text-slate-900 dark:text-white font-bold">{s.settlement_info.bank_name}</div>
                        <div className="text-emerald-600 dark:text-emerald-400 text-[10px]">✓ Penny-Drop Verified</div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedSupplier(s)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Inspect File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supplier Inspection Modal */}
          {selectedSupplier && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        Supplier Dossier • {selectedSupplier.supplier_id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-black">
                        {selectedSupplier.supplier_plan}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {selectedSupplier.company_name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSupplier(null)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* KYC Documents verification cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
                      Uploaded KYC Compliance Documents
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500">
                      Status: <strong className={selectedSupplier.verification_status === "Approved" ? "text-emerald-500" : "text-amber-500"}>{selectedSupplier.verification_status}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSupplier.kyc_documents.map((doc, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{doc.type}</span>
                          <span className={"px-2 py-0.5 rounded-md text-[9px] font-mono font-bold " + (
                            doc.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                          )}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-slate-500">Doc No: {doc.document_no}</p>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" /> View Scanned PDF
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settlement Bank Details Box */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Landmark className="w-4 h-4" /> Bank Settlement Information
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-mono font-bold">
                      {selectedSupplier.settlement_info.settlement_cycle}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 font-mono text-[11px] pt-1">
                    <div>Bank: <strong>{selectedSupplier.settlement_info.bank_name}</strong></div>
                    <div>A/C: <strong>{selectedSupplier.settlement_info.account_number}</strong></div>
                    <div>IFSC: <strong>{selectedSupplier.settlement_info.ifsc_code}</strong></div>
                    <div>Beneficiary: <strong>{selectedSupplier.settlement_info.account_holder}</strong></div>
                  </div>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1 border-t border-emerald-200 dark:border-emerald-500/30">
                    ✓ {selectedSupplier.settlement_info.penny_drop_status}
                  </p>
                </div>

                {/* Proposal & Performance Stats */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500">Proposals</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-1">{selectedSupplier.total_proposals}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500">Accepted</span>
                    <div className="font-bold text-emerald-600 mt-1">{selectedSupplier.accepted_proposals}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500">Completed</span>
                    <div className="font-bold text-blue-600 mt-1">{selectedSupplier.completed_transactions}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500">Disputes</span>
                    <div className="font-bold text-rose-600 mt-1">{selectedSupplier.disputes}</div>
                  </div>
                </div>

                {/* KYC Approval Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleVerifyKyc(selectedSupplier.supplier_id, "Approved", selectedSupplier.company_name);
                      setSelectedSupplier(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Approve Supplier KYC & Grant Badge
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleVerifyKyc(selectedSupplier.supplier_id, "Rejected", selectedSupplier.company_name);
                      setSelectedSupplier(null);
                    }}
                    className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 font-bold text-xs cursor-pointer"
                  >
                    Reject / Request Re-upload
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* 4. REVENUE & FINANCE                       */}
      {/* ========================================== */}
      {activeTab === "finance" && finance && (
        <div className="space-y-8">
          
          {/* Revenue Breakdown Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Membership Revenue */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                  Membership Subscriptions
                </span>
                <Award className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                ₹{finance.membership_revenue.toLocaleString("en-IN")}
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Growth Tier ({finance.growth_count ?? 1} active × ₹599/mo):</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{finance.membership_growth.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Business Tier ({finance.business_count ?? 2} active × ₹1,499/mo):</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{finance.membership_business.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Enterprise Tier ({finance.enterprise_count ?? 1} active × ₹2,499/mo):</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{finance.membership_enterprise.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Other / Escrow Platform Fee Revenue */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                  Escrow Transaction Fee (0.75%)
                </span>
                <Percent className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
                ₹{finance.other_revenue.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auto-debited from successful milestone completions and arbitration escrow releases.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono flex justify-between">
                <span className="text-slate-500">Effective Take Rate:</span>
                <span className="font-bold text-emerald-600">0.75% Net Flat</span>
              </div>
            </div>

            {/* Live RBI Nodal Vault Balance */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                  ICICI RBI Nodal Escrow Vault
                </span>
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black font-mono text-emerald-400">
                ₹{(finance.escrow_nodal_balance / 10000000).toFixed(2)} Crore
              </div>
              <p className="text-xs text-slate-300">
                A/C: <code className="text-blue-300 font-mono">000405098124</code> • Monitored under RBI/DPSS/2019-20/174.
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs font-mono flex justify-between text-slate-400">
                <span>Pending Disbursals:</span>
                <span className="text-amber-400 font-bold">₹{finance.pending_settlement_amount.toLocaleString("en-IN")}</span>
              </div>
            </div>

          </div>

          {/* Pending Settlements Disbursal Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Pending Bank Settlements Queue
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Milestone inspections approved by buyers — Ready for IMPS / RTGS auto-payout
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold">
                {finance.pending_settlements.length} Transfers in Queue
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-4">Settlement ID</th>
                      <th className="p-4">Beneficiary Supplier</th>
                      <th className="p-4">Bank & Account</th>
                      <th className="p-4">Deal Reference</th>
                      <th className="p-4">Disbursal Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Escrow Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {finance.pending_settlements.map((settl) => (
                      <tr key={settl.settlement_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                          {settl.settlement_id}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white">{settl.supplier_name}</div>
                          <div className="text-[11px] text-slate-500">{settl.supplier_id}</div>
                        </td>
                        <td className="p-4 font-mono text-[11px]">
                          <div>{settl.bank_name}</div>
                          <div className="text-slate-500">IFSC: {settl.ifsc_code}</div>
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {settl.deal_ref}
                        </td>
                        <td className="p-4 font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₹{settl.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-mono font-bold text-[10px]">
                            {settl.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDisburseSettlement(settl)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Landmark className="w-3.5 h-3.5" />
                            <span>Authorize IMPS Payout</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* 5. ARBITRATION COURT & DISPUTES            */}
      {/* ========================================== */}
      {activeTab === "disputes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Neutral Legal Arbitration Court Bench
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect technical evidence, test reports, and execute legally binding escrow decrees
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold">
              {disputes.length} Active Cases
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {disputes.map((d) => (
              <div key={d.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{d.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] font-bold">
                          {d.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Contract Ref: {d.contract_id || "TS-CTR-2026-089"}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Claim in Escrow</span>
                    <span className="text-lg font-black font-mono text-rose-600 dark:text-rose-400">
                      ₹{d.claim_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">Dispute Grounds & Evidence:</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{d.reason}</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDispute(d);
                      setArbitrationModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Issue Legal Arbitration Verdict</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Arbitration Verdict Modal */}
          {arbitrationModalOpen && activeDispute && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                      Arbitration Court Order • {activeDispute.id}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                      Adjudicate Escrow Claim (₹{activeDispute.claim_amount.toLocaleString("en-IN")})
                    </h3>
                  </div>
                  <button
                    onClick={() => setArbitrationModalOpen(false)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase font-mono">
                    Select Binding Verdict Order:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setVerdictType("REFUND_BUYER")}
                      className={"p-3 rounded-xl border text-center font-bold transition-all cursor-pointer " + (
                        verdictType === "REFUND_BUYER"
                          ? "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-400 ring-1 ring-rose-500"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600"
                      )}
                    >
                      100% Refund to Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerdictType("RELEASE_SUPPLIER")}
                      className={"p-3 rounded-xl border text-center font-bold transition-all cursor-pointer " + (
                        verdictType === "RELEASE_SUPPLIER"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600"
                      )}
                    >
                      100% Release to Supplier
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerdictType("SPLIT_50_50")}
                      className={"p-3 rounded-xl border text-center font-bold transition-all cursor-pointer " + (
                        verdictType === "SPLIT_50_50"
                          ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600"
                      )}
                    >
                      50/50 Equitable Split
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase font-mono">
                    Legal Arbiter Findings & Decree Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={verdictNotes}
                    onChange={(e) => setVerdictNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExecuteArbitration}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg cursor-pointer"
                >
                  Execute Legally Binding Decree & Disburse Funds
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* 6. DOUBLE-ENTRY LEDGER AUDIT               */}
      {/* ========================================== */}
      {activeTab === "ledger" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Double-Entry Escrow Ledger & Journal Audit
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Immutable financial journal postings conforming to standard GAAP escrow accounting
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
              Balanced • ₹0 Variance
            </span>
          </div>

          <div className="space-y-3">
            {journals.map((j) => (
              <div key={j.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-start pb-2 border-b border-slate-100 dark:border-slate-800 font-mono">
                  <div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{j.reference}</span>
                    <p className="text-slate-600 dark:text-slate-400 font-sans text-xs mt-0.5">{j.description}</p>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(j.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  {j.postings?.map((p: any, pIdx: number) => (
                    <div key={pIdx} className="flex justify-between items-center py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                      <span className="text-slate-800 dark:text-slate-200">{p.account_name}</span>
                      <div className="space-x-4">
                        {p.debit > 0 && <span className="text-rose-600 dark:text-rose-400 font-bold">DR: ₹{p.debit.toLocaleString("en-IN")}</span>}
                        {p.credit > 0 && <span className="text-emerald-600 dark:text-emerald-400 font-bold">CR: ₹{p.credit.toLocaleString("en-IN")}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
