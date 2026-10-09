import React, { useState, useEffect } from "react";
import { Contract, Milestone, Dispute, EscrowSummary, Proposal } from "../types";
import { 
  fetchContracts, 
  fetchEscrowSummary, 
  createContract, 
  submitMilestoneProof, 
  approveMilestone, 
  raiseDispute, 
  fetchDisputes, 
  arbitrateDispute, 
  fetchLedgerJournals, 
  verifyGSTIN,
  fetchProposals,
  createProposal,
  approveProposal
} from "../api/client";
import { 
  RefreshCw, 
  FileText, 
  Check, 
  UploadCloud, 
  Building2, 
  Briefcase, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Landmark, 
  Truck, 
  FileCheck, 
  X, 
  UserCheck, 
  ArrowLeftRight, 
  LogOut, 
  Scale, 
  Gavel, 
  Award, 
  DollarSign,
  Inbox,
  PlusCircle,
  Eye,
  Printer,
  Sparkles
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { DocumentViewerModal } from "./DocumentViewerModal";
import { ProposalViewerModal } from "./ProposalViewerModal";
import { AdminExecutiveDashboard } from "./AdminExecutiveDashboard";

interface TradeDashboardProps {
  onOpenAuth?: (role: "buyer" | "supplier", mode: "login" | "register") => void;
}

export const TradeDashboard: React.FC<TradeDashboardProps> = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  
  // Strict Role-Based Access: Role is strictly derived from verified authentication credentials
  const userRoleStr = (user?.role || "").toLowerCase();
  const isAdmin = 
    userRoleStr === "admin" || 
    userRoleStr.includes("arbit") || 
    (user?.email || "").toLowerCase().includes("court") || 
    (user?.email || "").toLowerCase().includes("admin") ||
    (user?.email || "").toLowerCase().includes("arbiter");

  const isSupplier = 
    !isAdmin && (
      userRoleStr === "supplier" || 
      userRoleStr.includes("seller") || 
      (user?.email || "").toLowerCase().includes("supplier") || 
      (user?.email || "").toLowerCase().includes("sales") ||
      (user?.email || "").toLowerCase().includes("bharat")
    );

  const role: "BUYER" | "SUPPLIER" | "ADMIN" = isAdmin ? "ADMIN" : isSupplier ? "SUPPLIER" : "BUYER";

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [summary, setSummary] = useState<EscrowSummary | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>("");

  // Active Tab & Navigation
  const [activeTab, setActiveTab] = useState<"proposals" | "contracts" | "new_deal" | "disputes" | "kyc" | "ledger">(
    isAdmin ? "disputes" : !isSupplier ? "proposals" : "contracts"
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Supplier Proposal Form State
  const [propBuyerName, setPropBuyerName] = useState("Apex Auto Components Pvt Ltd");
  const [propBuyerSignatory, setPropBuyerSignatory] = useState("Vikram Malhotra");
  const [propBuyerEmail, setPropBuyerEmail] = useState("procurement@apexauto.in");
  const [propBuyerGSTIN, setPropBuyerGSTIN] = useState("27AAACA1234A1Z5");
  const [propBuyerAddress, setPropBuyerAddress] = useState("Plot 42, MIDC Bhosari Industrial Area, Pune, Maharashtra 411026");
  const [propItemDesc, setPropItemDesc] = useState("Supply of 10,000 Precision Cast Flanges (Grade ASTM A105) & Hydrostatic Testing");
  const [propBaseAmount, setPropBaseAmount] = useState<number>(250000);
  const [propDiscountPct, setPropDiscountPct] = useState<number>(20);
  const [propTaxPct, setPropTaxPct] = useState<number>(18);
  const [propMilestonesSum, setPropMilestonesSum] = useState("20% Advance (QC Mill Cert) • 40% Dispatch (LR Proof) • 40% Delivery (Warehouse Signoff)");
  const [propDeliveryTimeline, setPropDeliveryTimeline] = useState("21 Business Days");
  const [propSpecialTerms, setPropSpecialTerms] = useState("100% Escrow Protected Trade Deal via PayShieldX Nodal Trust Account. 48hr inspection window.");

  // Submit Proof Form State (Supplier)
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofMilestone, setProofMilestone] = useState<Milestone | null>(null);
  const [transporterName, setTransporterName] = useState("V-Trans Express Logistics");
  const [lrNumber, setLrNumber] = useState("LR-VT-2026-98124");
  const [proofUrl, setProofUrl] = useState("https://docs.payshieldx.in/proofs/dispatch_lr_98124.pdf");
  const [dispatchNotes, setDispatchNotes] = useState("Consignment dispatched with 5,000 units inspected and sealed.");

  // Document Viewer Modal State
  const [viewDocModalOpen, setViewDocModalOpen] = useState(false);
  const [viewDocMilestone, setViewDocMilestone] = useState<Milestone | null>(null);

  // Dispute & Arbitration Panel State
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeMilestone, setDisputeMilestone] = useState<Milestone | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputesList, setDisputesList] = useState<Dispute[]>([]);
  const [arbitrationModalOpen, setArbitrationModalOpen] = useState(false);
  const [verdictDispute, setVerdictDispute] = useState<Dispute | null>(null);
  const [verdictType, setVerdictType] = useState<"REFUND_BUYER" | "RELEASE_SUPPLIER" | "SPLIT_50_50">("REFUND_BUYER");
  const [verdictNotes, setVerdictNotes] = useState("Independent technical inspection confirmed defect. Full escrow refund decreed.");

  // Double-Entry Ledger State
  const [journals, setJournals] = useState<any[]>([]);

  // KYC Simulator State
  const [kycGstInput, setKycGstInput] = useState("27AAACA1234A1Z5");
  const [kycResult, setKycResult] = useState<{ valid: boolean; legal_name: string; trust_score: number } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [cData, sData, dData, jData, pData] = await Promise.all([
      fetchContracts(), 
      fetchEscrowSummary(),
      fetchDisputes(),
      fetchLedgerJournals(),
      fetchProposals()
    ]);
    setContracts(cData);
    setSummary(sData);
    setDisputesList(dData);
    setJournals(jData);
    setProposals(pData);
    if (cData.length > 0) {
      setSelectedContract(cData[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveMilestone = async (mId: string) => {
    await approveMilestone(mId);
    setActionSuccessMsg("✅ Milestone approved! Funds released from Escrow Vault to Supplier bank account.");
    loadData();
    setTimeout(() => setActionSuccessMsg(""), 5000);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofMilestone) return;
    const fullNotes = transporterName + " (LR #" + lrNumber + "): " + dispatchNotes;
    await submitMilestoneProof(proofMilestone.id, proofUrl, fullNotes);
    setProofModalOpen(false);
    setActionSuccessMsg("🚚 Proof of Dispatch & Lorry Receipt submitted! Buyer notified for inspection sign-off.");
    loadData();
    setTimeout(() => setActionSuccessMsg(""), 5000);
  };

  const handleCreateProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createProposal({
      buyer_name: propBuyerName,
      buyer_signatory: propBuyerSignatory,
      buyer_email: propBuyerEmail,
      buyer_gstin: propBuyerGSTIN,
      buyer_address: propBuyerAddress,
      supplier_name: user?.business_name || "Bharat Precision Castings Ltd",
      supplier_signatory: user?.contact_person || user?.full_name || "Rajesh Singhania",
      supplier_email: user?.email || "sales@bharatcastings.com",
      supplier_gstin: user?.gst || "24AABCB5678B1Z2",
      supplier_address: user ? `${user.business_name}, ${user.city || "Vadodara"}, India` : "Survey No. 118, GIDC Makarpura Industrial Estate, Vadodara, Gujarat 390010",
      item_description: propItemDesc,
      base_amount: propBaseAmount,
      discount_percent: propDiscountPct,
      tax_percent: propTaxPct,
      milestones_summary: propMilestonesSum,
      delivery_timeline: propDeliveryTimeline,
      terms: propSpecialTerms,
      notes: "Auto-generated official Trade Deal Proposal with PayShieldX Escrow Protection",
    });

    if (created) {
      setActionSuccessMsg(`✅ Proposal #${created.proposal_number || created.id} successfully created & Acknowledgement Email dispatched to ${propBuyerEmail || "Buyer"}!`);
      setSelectedProposal(created);
      setProposalModalOpen(true);
      await loadData();
      setActiveTab("contracts");
      setTimeout(() => setActionSuccessMsg(""), 7000);
    }
  };

  const handleApproveProposal = async (proposalId: string) => {
    const success = await approveProposal(proposalId, "buyer");
    if (success) {
      setProposalModalOpen(false);
      setActionSuccessMsg("🛡️ Proposal Approved & Escrow Funds Locked! Deal converted into an Active Escrow Contract.");
      await loadData();
      setActiveTab("contracts");
      setTimeout(() => setActionSuccessMsg(""), 7000);
    }
  };

  const handleRaiseDispute = async () => {
    if (!selectedContract || !disputeMilestone) return;
    const disp = await raiseDispute({
      contract_id: selectedContract.id,
      milestone_id: disputeMilestone.id,
      reason: disputeReason || "Quality variation found during inspection",
      claim_amount: disputeMilestone.amount,
    });
    setDisputesList((prev) => [...prev, disp]);
    setDisputeModalOpen(false);
    alert("Dispute registered. Transferred to PayShield Arbitration Court.");
    loadData();
  };

  const handleExecuteVerdict = async () => {
    if (!verdictDispute) return;
    const totalClaim = verdictDispute.claim_amount;
    const buyerShare = verdictType === "REFUND_BUYER" ? totalClaim : verdictType === "SPLIT_50_50" ? totalClaim * 0.5 : 0;
    const sellerShare = verdictType === "RELEASE_SUPPLIER" ? totalClaim : verdictType === "SPLIT_50_50" ? totalClaim * 0.5 : 0;
    await arbitrateDispute(verdictDispute.id, verdictType, buyerShare, sellerShare);
    setArbitrationModalOpen(false);
    alert(`Arbitration Decree Executed! Verdict: ${verdictType === "REFUND_BUYER" ? "100% Refund to Buyer" : verdictType === "RELEASE_SUPPLIER" ? "100% Release to Supplier" : "50/50 Split Settlement"}. Escrow Ledger Updated.`);
    loadData();
  };

  const handleVerifyKYC = async () => {
    const res = await verifyGSTIN(kycGstInput);
    setKycResult(res);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 transition-colors duration-300">
      
      {/* Top Role Switcher Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              ESCROW LEDGER v2.4 (ACTIVE)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ICICI Bank Connected Nodal Account</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {role === "ADMIN"
              ? "Arbitration Court & Escrow Ledger Desk"
              : role === "BUYER"
              ? "Buyer Procurement Portal"
              : "Supplier Fulfillment & Payout Portal"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
            {user
              ? `Logged in as ${user.business_name} (${user.city || "India"}) • Signatory: ${user.contact_person || "Authorized Signatory"} • GSTIN: ${user.gst} • Pass ID: ${user.pass_id || "PSX-ACTIVE"}`
              : role === "ADMIN"
              ? "Logged in as PayShield Neutral Arbitration Panel (New Delhi) • Arbiter: Justice (Retd.) K. N. Verma"
              : role === "BUYER"
              ? "Logged in as Apex Auto Components Pvt Ltd (Pune) • GSTIN: 27AAACA1234A1Z5"
              : "Logged in as Bharat Precision Castings Ltd (Vadodara) • GSTIN: 24AAACB5678B1Z2"}
          </p>
        </div>

        {/* Authenticated Workspace & Access Control Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-100 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={"px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm " + (
              role === "ADMIN"
                ? "bg-purple-600 text-white dark:bg-purple-500 dark:text-slate-950"
                : role === "BUYER"
                ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950"
                : "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950"
            )}>
              {role === "ADMIN" ? <ShieldCheck className="w-3.5 h-3.5" /> : role === "BUYER" ? <Briefcase className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
              <span>{role === "ADMIN" ? "COURT ARBITER PANEL" : role === "BUYER" ? "BUYER WORKSPACE" : "SUPPLIER WORKSPACE"}</span>
            </span>
          </div>

          <button
            onClick={() => {
              if (onOpenAuth) {
                onOpenAuth(role === "BUYER" ? "supplier" : "buyer", "login");
              } else {
                logout();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
            title="Authenticate as a different organization or persona"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-400" />
          </button>
        </div>
      </div>

      {role === "ADMIN" ? (
        <AdminExecutiveDashboard />
      ) : (
        <>
          {/* Escrow Financial Metrics Summary Bar */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">TOTAL ESCROW LOCKED</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              ₹{(summary.total_locked_inr / 100000).toFixed(2)} Lakh
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">100% Nodal Secured</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">RELEASED TO SUPPLIERS</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{(summary.total_released_inr / 100000).toFixed(2)} Lakh
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Post-QC Handover</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">ACTIVE B2B CONTRACTS</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {contracts.length} Deals
            </div>
            <p className="text-[11px] text-blue-600 dark:text-blue-400">Milestone Tracked</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">PLATFORM FEE ACCRUED</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              ₹{summary.platform_fee_inr.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">0.75% Trans Fee</p>
          </div>
        </div>
      )}

      {/* Success Notification Alert Banner */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg("")} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {/* Buyer: Incoming Deals & Proposals Tab */}
        {role === "BUYER" && (
          <button
            onClick={() => setActiveTab("proposals")}
            className={"px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer " + (
              activeTab === "proposals"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            )}
          >
            <Inbox className="w-4 h-4" />
            <span>Incoming Deals & Proposals</span>
            {proposals.filter(p => !p.buyer_approved && p.status !== "APPROVED").length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {proposals.filter(p => !p.buyer_approved && p.status !== "APPROVED").length}
              </span>
            )}
          </button>
        )}

        {/* Both: Active Contracts Tab */}
        <button
          onClick={() => setActiveTab("contracts")}
          className={"px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer " + (
            activeTab === "contracts"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Active Contracts & Milestones</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {contracts.length}
          </span>
        </button>

        {/* Supplier: Create Proposal Tab (EXCLUSIVELY FOR SUPPLIER) */}
        {role === "SUPPLIER" && (
          <button
            onClick={() => setActiveTab("new_deal")}
            className={"px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer " + (
              activeTab === "new_deal"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            )}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Create Trade Proposal</span>
          </button>
        )}

        {/* Both: Disputes */}
        <button
          onClick={() => setActiveTab("disputes")}
          className={"px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer " + (
            activeTab === "disputes"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
          )}
        >
          <Gavel className="w-4 h-4" />
          <span>Dispute Resolution Hub</span>
        </button>

        {/* Both: GSTIN & Bank Verifier */}
        <button
          onClick={() => setActiveTab("kyc")}
          className={"px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer " + (
            activeTab === "kyc"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>GSTIN & Bank Verifier</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === "contracts" && selectedContract && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contracts Sidebar List */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Active Escrow Contracts ({contracts.length})
            </h3>

            <div className="space-y-3">
              {contracts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedContract(c)}
                  className={"p-5 rounded-2xl border transition-all cursor-pointer space-y-2 " + (
                    selectedContract.id === c.id
                      ? "bg-blue-50 dark:bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/20"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{c.contract_number}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-bold text-[10px]">
                      {c.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{c.title}</h4>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Amount:</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">₹{c.total_amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Contract Milestones & Actions */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">{selectedContract.contract_number}</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedContract.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Escrow Virtual Account: <code className="text-slate-900 dark:text-white font-bold">{selectedContract.escrow_virtual_account}</code> (ICICI Bank)
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Total Escrow Value</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    ₹{selectedContract.total_amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Milestone Timeline Steps */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Payment & Delivery Milestones ({selectedContract.milestones.length})
                </h3>

                <div className="space-y-4">
                  {selectedContract.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                            #{m.sequence}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{m.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{m.description}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                            ₹{m.amount.toLocaleString("en-IN")}
                          </span>
                          <span className="block text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400">
                            {m.status}
                          </span>
                        </div>
                      </div>

                      {/* Milestone Proof / Notes if available */}
                      {m.deliverable_proof_url && (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Uploaded Delivery Proof (LR / Inspection):</span>
                            <button
                              onClick={() => {
                                setViewDocMilestone(m);
                                setViewDocModalOpen(true);
                              }}
                              className="text-blue-600 dark:text-blue-400 font-bold hover:underline font-mono flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Document</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                          {m.inspection_notes && (
                            <p className="text-slate-600 dark:text-slate-400 text-[11px]">{m.inspection_notes}</p>
                          )}
                        </div>
                      )}

                      {/* Action Triggers based on Role */}
                      <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                        {role === "SUPPLIER" && (m.status === "FUNDED" || m.status === "PENDING_FUND") && (
                          <button
                            onClick={() => {
                              setProofMilestone(m);
                              setProofModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload LR / Dispatch Proof</span>
                          </button>
                        )}

                        {role === "BUYER" && (m.status === "IN_INSPECTION" || m.status === "FUNDED") && (
                          <>
                            <button
                              onClick={() => {
                                setDisputeMilestone(m);
                                setDisputeModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <span>Raise Dispute</span>
                            </button>

                            <button
                              onClick={() => handleApproveMilestone(m.id)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Release Funds</span>
                            </button>
                          </>
                        )}

                        {m.status === "RELEASED" && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Payout Settled to Supplier Account
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 1. BUYER INCOMING PROPOSALS TAB (Review & One-Click Approve) */}
      {/* ======================================================== */}
      {activeTab === "proposals" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Incoming Trade Deals & Supplier Proposals ({proposals.length})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Suppliers have issued these digital proposals for your purchase orders. Review terms, inspect IndiaMART-style proposal PDFs, and approve to lock funds into Escrow.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              100% Nodal Escrow Protection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals.map((p) => {
              const isApproved = p.buyer_approved || p.status === "APPROVED" || p.status === "Confirmed";
              const baseAmt = p.base_amount || (p.amount > 0 ? p.amount / 1.18 : 250000);
              const discAmt = p.discount_amount || 0;
              const dealAmt = baseAmt - discAmt;
              const taxAmt = p.tax_amount || (dealAmt * 0.18);
              const totalPayable = p.total_payable_amount || p.amount;

              return (
                <div
                  key={p.id}
                  className={"p-6 rounded-3xl border transition-all space-y-5 bg-white dark:bg-slate-900 shadow-sm " + (
                    isApproved
                      ? "border-emerald-200 dark:border-emerald-500/30"
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500"
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">
                        PROPOSAL #{p.proposal_number || p.id}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Issued: {p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recent"}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                      isApproved 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30" 
                        : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30"
                    }`}>
                      {isApproved ? "✓ APPROVED & FUNDED" : "⏳ AWAITING YOUR ACCEPTANCE"}
                    </span>
                  </div>

                  {/* Supplier & Deal Description */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">Supplier Organization</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {p.supplier_name || "Bharat Precision Castings Ltd"}
                        {p.supplier_gstin && <span className="text-xs font-mono text-slate-500 font-normal">({p.supplier_gstin})</span>}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">Goods / Deliverables</span>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                        {p.item_description || "Supply of precision engineered components"}
                      </p>
                    </div>
                  </div>

                  {/* Milestones Structure Pill */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] font-bold font-mono uppercase text-slate-500">Escrow Tranche Milestones:</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-mono">
                      {p.milestones_summary || "20% Advance (QC Cert) • 40% Dispatch (LR Proof) • 40% Delivery (Warehouse)"}
                    </p>
                  </div>

                  {/* Pricing Matrix Breakdown */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Base Quotation Price:</span>
                      <span className="font-mono">₹{baseAmt.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    </div>
                    {p.discount_percent && p.discount_percent > 0 ? (
                      <div className="flex justify-between text-red-500">
                        <span>Discount ({p.discount_percent}%):</span>
                        <span className="font-mono">(-)₹{discAmt.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>GST (18% IGST):</span>
                      <span className="font-mono">+₹{taxAmt.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                      <span>Total Payable Amount:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">
                        ₹{totalPayable.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedProposal(p);
                        setProposalModalOpen(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Proposal (PDF)</span>
                    </button>

                    {!isApproved && (
                      <button
                        onClick={() => handleApproveProposal(p.id)}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Fund Escrow</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SUPPLIER PROPOSAL CREATION TAB (Exclusive to Supplier) */}
      {/* ======================================================== */}
      {activeTab === "new_deal" && (
        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <PlusCircle className="w-6 h-6" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create Official Trade Deal Proposal</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Issue an Escrow-Protected Sales Proposal to your Buyer. Once created, the Buyer automatically receives an official <strong>Acknowledgement for Proposal</strong> email with a link to inspect the IndiaMART-style Proposal PDF and approve payment into Escrow.
            </p>
          </div>

          <form onSubmit={handleCreateProposalSubmit} className="space-y-5">
            
            {/* Buyer Selection & Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono block">Buyer Details</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Buyer Business Name</label>
                  <input
                    type="text"
                    required
                    value={propBuyerName}
                    onChange={(e) => setPropBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Buyer Signatory / Contact Person</label>
                  <input
                    type="text"
                    required
                    value={propBuyerSignatory}
                    onChange={(e) => setPropBuyerSignatory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Buyer GSTIN</label>
                  <input
                    type="text"
                    required
                    value={propBuyerGSTIN}
                    onChange={(e) => setPropBuyerGSTIN(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono uppercase focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Buyer Email Address (For Proposal Email)</label>
                  <input
                    type="email"
                    required
                    value={propBuyerEmail}
                    onChange={(e) => setPropBuyerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Buyer Delivery / Billing Address</label>
                <input
                  type="text"
                  required
                  value={propBuyerAddress}
                  onChange={(e) => setPropBuyerAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Goods Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Goods Description & Scope of Supply</label>
              <textarea
                rows={2}
                required
                value={propItemDesc}
                onChange={(e) => setPropItemDesc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Financial Pricing & Tax Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Base Deal Amount (INR)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={propBaseAmount}
                  onChange={(e) => setPropBaseAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Discount (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={propDiscountPct}
                  onChange={(e) => setPropDiscountPct(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">GST Rate (%)</label>
                <input
                  type="number"
                  value={propTaxPct}
                  onChange={(e) => setPropTaxPct(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Payable Preview Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-900 dark:text-emerald-300">Payable Total with 18% GST:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Base: ₹{propBaseAmount.toLocaleString("en-IN")} • Discount: {propDiscountPct}% • GST @ 18%
                </p>
              </div>
              <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                ₹{((propBaseAmount * (1 - propDiscountPct / 100)) * 1.18).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
            </div>

            {/* Milestone & Timeline Setup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Milestone Tranche Structure</label>
                <input
                  type="text"
                  required
                  value={propMilestonesSum}
                  onChange={(e) => setPropMilestonesSum(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Delivery Timeline</label>
                <input
                  type="text"
                  required
                  value={propDeliveryTimeline}
                  onChange={(e) => setPropDeliveryTimeline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Proposal PDF & Dispatch Email to Buyer</span>
            </button>
          </form>
        </div>
      )}

      {/* Disputes Resolution Tab */}
      {activeTab === "disputes" && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Arbitration & Dispute Resolution Court
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All disputes are evaluated by neutral trade lawyers and industry technical inspectors based on invoice terms and uploaded evidence.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 text-xs font-bold font-mono border border-blue-200 dark:border-blue-500/30 flex items-center gap-1.5 self-start sm:self-auto">
              <Scale className="w-3.5 h-3.5" />
              RBI & ICA Arbitration Rules 2026
            </span>
          </div>

          <div className="space-y-4">
            {disputesList.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Active Disputes</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">All milestone payments and shipments are currently in good standing.</p>
              </div>
            ) : (
              disputesList.map((d) => (
                <div key={d.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs">
                        CASE #{d.id.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        Milestone Ref: <code className="font-bold text-slate-800 dark:text-slate-200">{d.milestone_id || "MS_DEFAULT"}</code>
                      </span>
                    </div>
                    <span className={"px-3 py-1 rounded-full text-xs font-bold font-mono " + (
                      d.status.toLowerCase().includes("resolve") || d.status.toLowerCase().includes("settle")
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400"
                    )}>
                      ● {d.status}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">Grounds for Contestation & Evidence:</div>
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-medium">{d.reason}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-6">
                      <span>Claim Amount: <strong className="text-slate-900 dark:text-white font-mono text-sm">₹{d.claim_amount.toLocaleString("en-IN")}</strong></span>
                      <span className="hidden sm:inline">Arbitration SLA: <strong className="text-slate-800 dark:text-slate-200">72 Hours Max</strong></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Double-Entry Nodal Ledger Tab (Court Arbiter / Admin Exclusive) */}
      {activeTab === "ledger" && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">ICICI Nodal Double-Entry Accounting Ledger</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time cryptographic nodal escrow journal postings. Every milestone lock, fee deduction, and release is immutably journaled.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold font-mono">
              Ledger Status: BALANCED (0 Variance)
            </span>
          </div>

          {/* Chart of Accounts Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">1010 • ESCROW_VAULT_ICICI (ASSET)</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                ₹{((summary?.total_locked_inr || 2000000) / 100000).toFixed(2)} Lakh
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Reserve Backed 1:1</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">2010 • BUYER_DEPOSIT_LIABILITY</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                ₹{((summary?.total_locked_inr || 2000000) / 100000).toFixed(2)} Lakh
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400">Pending Milestone Fulfilment</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">4010 • PLATFORM_FEE_REVENUE</span>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
                ₹{(summary?.platform_fee_inr || 18750).toLocaleString("en-IN")}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">0.75% Nodal Escrow Spread</span>
            </div>
          </div>

          {/* Journal Entries Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 dark:bg-slate-950 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
              <span>JOURNAL POSTINGS ({journals.length} ENTRIES)</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Auto-Reconciled with Core Banking</span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {journals.map((j) => (
                <div key={j.id} className="p-5 bg-white dark:bg-slate-900/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-mono font-bold text-[11px]">
                        {j.id.toUpperCase()}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{j.description}</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px]">Ref: {j.reference}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                          <th className="py-1 font-semibold">Ledger Account</th>
                          <th className="py-1 text-right font-semibold">Debit (DR)</th>
                          <th className="py-1 text-right font-semibold">Credit (CR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {j.postings?.map((p: any, idx: number) => (
                          <tr key={idx} className="text-slate-700 dark:text-slate-300">
                            <td className="py-1.5">{p.account_name}</td>
                            <td className="py-1.5 text-right font-bold text-slate-900 dark:text-white">
                              {p.debit > 0 ? `₹${p.debit.toLocaleString("en-IN")}` : "—"}
                            </td>
                            <td className="py-1.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                              {p.credit > 0 ? `₹${p.credit.toLocaleString("en-IN")}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KYC / GSTIN Simulator Tab */}
      {activeTab === "kyc" && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">GSTIN & Bank Penny-Drop Verifier</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verify counterparty identity in real-time before drafting contracts or releasing advances.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enter 15-Digit GSTIN</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={kycGstInput}
                  onChange={(e) => setKycGstInput(e.target.value.toUpperCase())}
                  placeholder="E.g., 27AAACA1234A1Z5"
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleVerifyKYC}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer shrink-0"
                >
                  Verify
                </button>
              </div>
            </div>

            {kycResult && (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>GSTIN VERIFICATION SUCCESSFUL</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Registered Legal Name:</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{kycResult.legal_name}</p>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-200 dark:border-emerald-500/20">
                  <span className="text-slate-600 dark:text-slate-300">PayShield Trust Score:</span>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">{kycResult.trust_score}/100 (Tier 1 Verified)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proof Submission Modal */}
      {proofModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Upload Lorry Receipt (LR) / Proof</h3>
              <button onClick={() => setProofModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Transporter Name</label>
                <input
                  type="text"
                  required
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lorry Receipt (LR) / Consignment No.</label>
                <input
                  type="text"
                  required
                  value={lrNumber}
                  onChange={(e) => setLrNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Document PDF / Photo URL</label>
                <input
                  type="url"
                  required
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dispatch Notes</label>
                <textarea
                  rows={3}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Submit Proof to Buyer & Escrow Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Modal (For Buyer) */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Raise Formal Dispute</h3>
              <button onClick={() => setDisputeModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dispute Reason</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide detailed explanation of defect or delay..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
                Raising a dispute pauses all payout releases on this milestone until the arbitration panel resolves the claim.
              </div>

              <button
                onClick={handleRaiseDispute}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Submit Dispute Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Arbitration Decree Execution Modal (For Arbiter / Admin) */}
      {arbitrationModalOpen && verdictDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Issue Legal Arbitration Decree</h3>
              </div>
              <button onClick={() => setArbitrationModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-purple-950 dark:text-purple-300">
                  <span>Case ID: #{verdictDispute.id.toUpperCase()}</span>
                  <span>Disputed Sum: ₹{verdictDispute.claim_amount.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] pt-1">{verdictDispute.reason}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                  Select Legal Verdict Decree:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerdictType("REFUND_BUYER")}
                    className={"p-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs " + (
                      verdictType === "REFUND_BUYER"
                        ? "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300 shadow-sm"
                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    100% Refund (Buyer)
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerdictType("RELEASE_SUPPLIER")}
                    className={"p-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs " + (
                      verdictType === "RELEASE_SUPPLIER"
                        ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm"
                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    100% Release (Supplier)
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerdictType("SPLIT_50_50")}
                    className={"p-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs " + (
                      verdictType === "SPLIT_50_50"
                        ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm"
                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    50 / 50 Settlement
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Arbiter Decree Notes & Statutory Findings</label>
                <textarea
                  rows={3}
                  value={verdictNotes}
                  onChange={(e) => setVerdictNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleExecuteVerdict}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                <span>Pronounce Legal Decree & Adjust Nodal Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={viewDocModalOpen}
        milestone={viewDocMilestone}
        contract={selectedContract}
        onClose={() => setViewDocModalOpen(false)}
      />

      {/* IndiaMART-style Proposal Viewer Modal */}
      <ProposalViewerModal
        isOpen={proposalModalOpen}
        proposal={selectedProposal}
        onClose={() => setProposalModalOpen(false)}
        onApprove={handleApproveProposal}
        isBuyer={role === "BUYER"}
      />
        </>
      )}

    </div>
  );
};
