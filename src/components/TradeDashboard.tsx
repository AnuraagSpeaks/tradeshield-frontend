import React, { useState, useEffect } from "react";
import { Contract, Milestone, Dispute, EscrowSummary } from "../types";
import { 
  fetchContracts, 
  fetchEscrowSummary, 
  createContract, 
  submitMilestoneProof, 
  approveMilestone, 
  raiseDispute, 
  verifyGSTIN 
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
  X
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export const TradeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  // Active Persona / Role
  const [role, setRole] = useState<"BUYER" | "SUPPLIER">(
    user?.role === "supplier" ? "SUPPLIER" : "BUYER"
  );

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [summary, setSummary] = useState<EscrowSummary | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState<"contracts" | "new_deal" | "disputes" | "payouts" | "kyc">("contracts");
  const [loading, setLoading] = useState<boolean>(true);

  // New Deal Form State (Buyer)
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState<number>(1500000);
  const [newBuyerGST, setNewBuyerGST] = useState("27AAACA1234A1Z5");
  const [newSupplierGST, setNewSupplierGST] = useState("24AAACB5678B1Z2");

  // Submit Proof Form State (Supplier)
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofMilestone, setProofMilestone] = useState<Milestone | null>(null);
  const [transporterName, setTransporterName] = useState("V-Trans Express Logistics");
  const [lrNumber, setLrNumber] = useState("LR-VT-2026-98124");
  const [proofUrl, setProofUrl] = useState("https://docs.tradeshield.in/proofs/dispatch_lr_98124.pdf");
  const [dispatchNotes, setDispatchNotes] = useState("Consignment dispatched with 5,000 units inspected and sealed.");

  // Dispute Form State
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeMilestone, setDisputeMilestone] = useState<Milestone | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputesList, setDisputesList] = useState<Dispute[]>([]);

  // KYC Simulator State
  const [kycGstInput, setKycGstInput] = useState("27AAACA1234A1Z5");
  const [kycResult, setKycResult] = useState<{ valid: boolean; legal_name: string; trust_score: number } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [cData, sData] = await Promise.all([fetchContracts(), fetchEscrowSummary()]);
    setContracts(cData);
    setSummary(sData);
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
    alert("Milestone approved! Funds released from Escrow Vault to Supplier bank account.");
    loadData();
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofMilestone) return;
    const fullNotes = transporterName + " (LR #" + lrNumber + "): " + dispatchNotes;
    await submitMilestoneProof(proofMilestone.id, proofUrl, fullNotes);
    setProofModalOpen(false);
    alert("Proof of Dispatch & Lorry Receipt submitted! Buyer notified for inspection sign-off.");
    loadData();
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContract({
      title: newTitle || "Supply of High Grade Steel Components",
      total_amount: newAmount,
      buyer_org_id: "org_buyer_01",
      supplier_org_id: "org_seller_01",
      description: "Smart escrow deal with milestone tranches",
      delivery_terms: "DAP Destination",
      inspection_period_days: 5,
      milestones: [
        {
          id: "m_new_1",
          contract_id: "",
          sequence: 1,
          title: "20% Mobilization Advance",
          description: "Raw material procurement with Mill Test Cert",
          percentage: 20,
          amount: newAmount * 0.2,
          status: "FUNDED",
          due_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        },
        {
          id: "m_new_2",
          contract_id: "",
          sequence: 2,
          title: "40% On Dispatch with LR",
          description: "Consignment dispatched via Transporter",
          percentage: 40,
          amount: newAmount * 0.4,
          status: "FUNDED",
          due_date: new Date(Date.now() + 14 * 86400000).toISOString(),
        },
        {
          id: "m_new_3",
          contract_id: "",
          sequence: 3,
          title: "40% Final QC Acceptance",
          description: "Warehouse receiving and dimensional inspection",
          percentage: 40,
          amount: newAmount * 0.4,
          status: "FUNDED",
          due_date: new Date(Date.now() + 21 * 86400000).toISOString(),
        },
      ],
    });
    alert("Deal created and funded into Escrow Vault successfully!");
    setActiveTab("contracts");
    loadData();
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
    alert("Dispute registered. Transferred to TradeShield Arbitration Court.");
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
            {role === "BUYER" ? "Buyer Procurement Portal" : "Supplier Fulfillment & Payout Portal"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
            {user
              ? `Logged in as ${user.business_name} (${user.city || "India"}) • GSTIN: ${user.gst} • Pass ID: ${user.pass_id || "PSX-ACTIVE"}`
              : role === "BUYER"
              ? "Logged in as Apex Auto Components Pvt Ltd (Pune) • GSTIN: 27AAACA1234A1Z5"
              : "Logged in as Bharat Precision Castings Ltd (Vadodara) • GSTIN: 24AAACB5678B1Z2"}
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-100 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 px-2">SWITCH ROLE:</span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setRole("BUYER");
                setActiveTab("contracts");
              }}
              className={"flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (
                role === "BUYER"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white dark:text-slate-950 shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-transparent"
              )}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Buyer (Buyer 1)</span>
            </button>

            <button
              onClick={() => {
                setRole("SUPPLIER");
                setActiveTab("contracts");
              }}
              className={"flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (
                role === "SUPPLIER"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white dark:text-slate-950 shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-transparent"
              )}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Supplier (Rajesh Exports)</span>
            </button>
          </div>
        </div>
      </div>

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

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
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
        </button>

        {role === "BUYER" && (
          <button
            onClick={() => setActiveTab("new_deal")}
            className={"px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer " + (
              activeTab === "new_deal"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            )}
          >
            <Lock className="w-4 h-4" />
            <span>Create & Fund Escrow Deal</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("disputes")}
          className={"px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer " + (
            activeTab === "disputes"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Dispute Resolution Hub</span>
        </button>

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
                            <a
                              href={m.deliverable_proof_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline font-mono flex items-center gap-1"
                            >
                              <span>View Document</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
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

      {/* New Deal Creation Tab (Buyer) */}
      {activeTab === "new_deal" && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Escrow-Protected Trade Deal</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Terms are locked into a digital proposal with automated 3-stage milestone escrow releases.
            </p>
          </div>

          <form onSubmit={handleCreateDeal} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Deal Title / Goods Description</label>
              <input
                type="text"
                required
                placeholder="E.g., Supply of 10,000 Precision Cast Flanges"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Deal Amount (INR)</label>
                <input
                  type="number"
                  required
                  min={10000}
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Supplier GSTIN</label>
                <input
                  type="text"
                  required
                  value={newSupplierGST}
                  onChange={(e) => setNewSupplierGST(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-300">
                <span>Automated 3-Tranche Milestone Setup:</span>
                <span>100% Escrow Backed</span>
              </div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>• 20% Advance: Released upon Raw Material QC / Mill Certificate</li>
                <li>• 40% Dispatch: Released upon Transporter Lorry Receipt (LR) submission</li>
                <li>• 40% Delivery: Released upon destination warehouse physical inspection</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Lock Deal in Escrow Nodal Account</span>
            </button>
          </form>
        </div>
      )}

      {/* Disputes Resolution Tab */}
      {activeTab === "disputes" && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Arbitration & Dispute Resolution Court</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All disputes are evaluated by trade lawyers based on invoice terms and uploaded evidence.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold font-mono">
              RBI Regulated Arbitration
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
                <div key={d.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-rose-200 dark:border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">DISPUTE #{d.id}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-[10px]">{d.status}</span>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-white font-semibold">{d.reason}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Claim Amount: ₹{d.claim_amount.toLocaleString("en-IN")}</span>
                    <span>Arbitration SLA: Resolution within 72 hours</span>
                  </div>
                </div>
              ))
            )}
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
                  <span className="text-slate-600 dark:text-slate-300">TradeShield Trust Score:</span>
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

      {/* Dispute Modal */}
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

    </div>
  );
};
