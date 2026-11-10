import React, { useRef, useEffect } from "react";
import { Proposal } from "../types";
import { X, Printer, ShieldCheck, CheckCircle2, Building2 } from "lucide-react";
import { printElement } from "../utils/printHelper";

interface ProposalViewerModalProps {
  proposal: Proposal | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (proposalId: string) => void;
  isBuyer?: boolean;
}

const safeNum = (val: any, fallback = 0): number => {
  const n = Number(val);
  return isNaN(n) || !isFinite(n) ? fallback : n;
};

const safeFormatINR = (val: any, decimals = 2): string => {
  const n = safeNum(val);
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const safeFormatDate = (val: any, fallback = "N/A"): string => {
  if (!val) return fallback;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return fallback;
  }
};

export const ProposalViewerModal: React.FC<ProposalViewerModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onApprove,
  isBuyer = false,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !proposal) return null;

  const rawBase = proposal.base_amount || (Number(proposal.amount || 0) > 0 ? Number(proposal.amount) / 1.18 : 250000);
  const baseAmt = safeNum(rawBase, 250000);
  const discPct = safeNum(proposal.discount_percent, 0);
  const discAmt = safeNum(proposal.discount_amount, baseAmt * (discPct / 100));
  const dealAmt = Math.max(0, baseAmt - discAmt);
  const taxPct = safeNum(proposal.tax_percent, 18);
  const taxAmt = safeNum(proposal.tax_amount, dealAmt * (taxPct / 100));
  const totalPayable = safeNum(proposal.total_payable_amount || (dealAmt + taxAmt) || proposal.amount, dealAmt + taxAmt);

  const isApproved = Boolean(proposal.buyer_approved || proposal.status === "APPROVED" || proposal.status === "Confirmed");
  const propDate = safeFormatDate(proposal.created_at, "18-Sep-2026");
  const validDate = safeFormatDate(proposal.valid_till_date, "14 Days from Issue");
  const approvedDate = proposal.approved_at ? safeFormatDate(proposal.approved_at) : isApproved ? propDate : "Pending Acceptance";

  const handlePrint = () => {
    if (printAreaRef.current) {
      printElement(printAreaRef.current, `Proposal #${proposal.proposal_number || proposal.id} - PayShieldX`);
    } else {
      window.print();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-1 sm:p-6 flex justify-center items-start animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-1 sm:my-8">
        
        {/* Sticky Modal Action Header (Always anchored at top of modal) */}
        <div className="sticky top-0 z-30 no-print flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-400">PROPOSAL #{proposal.proposal_number || proposal.id}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isApproved ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}>
              {isApproved ? "APPROVED" : "AWAITING ACCEPTANCE"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            {isBuyer && !isApproved && onApprove && (
              <button
                onClick={() => onApprove(proposal.id)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Fund Escrow</span>
              </button>
            )}

            <button
              onClick={onClose}
              title="Close (Esc)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer text-xs font-bold shadow-sm"
            >
              <X className="w-4 h-4" />
              <span className="font-medium">Close</span>
            </button>
          </div>
        </div>

        {/* Printable Proposal Document Body */}
        <div ref={printAreaRef} className="print-sheet p-3.5 sm:p-8 md:p-12 relative bg-white min-h-[600px] text-slate-900">
          
          {/* Watermark for Approved Proposals */}
          {isApproved && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-10">
              <span className="text-8xl sm:text-9xl font-black text-emerald-600 uppercase transform -rotate-25 border-8 border-emerald-600 px-8 py-4 rounded-3xl">
                APPROVED
              </span>
            </div>
          )}

          {/* Letterhead Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  🛡️ <span className="text-blue-600">Pay</span>ShieldX
                </span>
              </div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1 font-mono">
                Payment Protection Plan
              </span>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 leading-relaxed font-sans">
              <strong className="text-slate-900 text-sm">PayShield Technologies Pvt Ltd.</strong><br />
              6th Floor, Tower 2, Assotech Business Cresterra,<br />
              Plot No. 22, Sec 135, Noida-201305, U.P.<br />
              Call Us: +91 - 8920726073 / 9696969696<br />
              E-mail: support@payshieldx.in | Website: www.payshieldx.in<br />
              <strong className="text-slate-800">GST: 07AAACT0001A1Z9</strong>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center my-6">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Proposal</h1>
          </div>

          {/* Parties & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 text-xs border-b border-slate-200">
            {/* Left: To (Buyer) */}
            <div className="space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">To,</span>
              <p className="font-black text-sm text-slate-900">{proposal.buyer_signatory || "Vikram Malhotra"}</p>
              <p className="font-bold text-slate-800">{proposal.buyer_name || "Apex Auto Components Pvt Ltd"}</p>
              <p className="text-slate-600 leading-relaxed">
                {proposal.buyer_address || "Plot 42, MIDC Bhosari Industrial Area, Pune, Maharashtra 411026"}
              </p>
              <p className="font-bold text-slate-900 pt-1">
                GST : <span className="font-mono text-blue-700">{proposal.buyer_gstin || "27AAACA1234A1Z5"}</span>
              </p>
            </div>

            {/* Right: Proposal Meta */}
            <div className="space-y-1 sm:text-right">
              <div className="flex justify-between sm:justify-end gap-2">
                <span className="text-slate-500 font-semibold">Proposal ID :</span>
                <span className="font-bold font-mono text-slate-900">#{proposal.proposal_number || proposal.id}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-2">
                <span className="text-slate-500 font-semibold">Proposal Date :</span>
                <span className="font-bold text-slate-900">{propDate}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-2">
                <span className="text-slate-500 font-semibold">Valid Till :</span>
                <span className="font-bold text-slate-900">{validDate}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-2">
                <span className="text-slate-500 font-semibold">Approved On :</span>
                <span className={`font-bold ${isApproved ? "text-emerald-700 font-mono" : "text-slate-500"}`}>
                  {approvedDate}
                </span>
              </div>
              <div className="flex justify-between sm:justify-end gap-2">
                <span className="text-slate-500 font-semibold">Status :</span>
                <span className={`font-bold font-mono ${isApproved ? "text-emerald-600" : "text-amber-600"}`}>
                  {proposal.status}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Responsive Card View (sm:hidden) - Zero horizontal clipping or awkward scrolling */}
          <div className="sm:hidden mt-5 rounded-2xl border-2 border-slate-300 bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 flex items-center justify-between border-b border-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md border border-blue-200">
                  Item #1
                </span>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Proposal Terms</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Amount</span>
                <span className="font-mono font-black text-sm text-slate-950">₹{safeFormatINR(baseAmt)}</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="font-extrabold text-sm text-slate-900 leading-snug">
                {proposal.item_description || "Supply of Precision Cast Flanges & Engineering Components"}
              </p>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 text-[11px] block uppercase">Supplier</span>
                  <span className="font-extrabold text-slate-900">{proposal.supplier_name || "Bharat Precision Castings Ltd"}</span>
                  {proposal.supplier_gstin && <span className="ml-1.5 font-mono text-[11px] text-slate-600">({proposal.supplier_gstin})</span>}
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[11px] block uppercase">Milestone Tranches</span>
                  <span className="text-slate-800">{proposal.milestones_summary || "20% Advance (QC Cert) • 40% Dispatch (LR Proof) • 40% Delivery (Warehouse Signoff)"}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 text-[11px] block uppercase">Delivery Timeline</span>
                  <span className="font-semibold text-slate-800">{proposal.delivery_timeline || "21 Business Days"}</span>
                </div>
                {proposal.notes && (
                  <div>
                    <span className="font-bold text-slate-500 text-[11px] block uppercase">Special Terms</span>
                    <span className="text-slate-800">{proposal.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop / Tablet Itemized Table (hidden on mobile, visible on sm and up) */}
          <div className="hidden sm:block mt-6 rounded-xl border border-slate-300 overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider font-mono text-[11px] border-b border-slate-300">
                  <th className="py-3 px-4 w-12 text-center border-r border-slate-300">S.No.</th>
                  <th className="py-3 px-4 border-r border-slate-300">Description & Milestone Terms</th>
                  <th className="py-3 px-4 w-36 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4 text-center font-bold font-mono align-top border-r border-slate-200">1.</td>
                  <td className="py-4 px-4 align-top border-r border-slate-200 space-y-2">
                    <p className="font-black text-sm text-slate-900">
                      {proposal.item_description || "Supply of Precision Cast Flanges & Engineering Components"}
                    </p>
                    <div className="space-y-1 text-slate-600 text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <div>
                        <strong className="text-slate-800">Supplier:</strong> {proposal.supplier_name || "Bharat Precision Castings Ltd"} 
                        {proposal.supplier_gstin && <span className="ml-1 font-mono text-slate-700">({proposal.supplier_gstin})</span>}
                      </div>
                      <div>
                        <strong className="text-slate-800">Milestone Tranches:</strong> {proposal.milestones_summary || "20% Advance (QC Cert) • 40% Dispatch (LR Proof) • 40% Delivery (Warehouse Signoff)"}
                      </div>
                      <div>
                        <strong className="text-slate-800">Delivery Timeline:</strong> {proposal.delivery_timeline || "21 Business Days"}
                      </div>
                      {proposal.notes && (
                        <div>
                          <strong className="text-slate-800">Special Terms:</strong> {proposal.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-black font-mono text-sm align-top text-slate-900">
                    ₹{safeFormatINR(baseAmt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing & Tax Summary with Bank Transfer Details */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-stretch md:items-end gap-6 pt-2">
            
            {/* NEFT / RTGS / IMPS Bank Transfer Details Box (Clean, High-Contrast White Background) */}
            <div className="bg-slate-50 rounded-2xl border-2 border-slate-300 p-4 w-full md:max-w-sm space-y-2.5 text-slate-900 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="font-extrabold text-slate-900 text-xs tracking-wider uppercase font-mono">
                  NEFT / RTGS / IMPS
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PayShieldX Nodal Account Details</span>
              </div>
              <div className="space-y-2 text-xs pt-0.5">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-slate-600 text-xs font-semibold">Account Name :</span>
                  <span className="font-bold text-slate-950 font-mono text-xs">S S ENTERPRISE</span>
                </div>
                <div className="flex justify-between items-baseline gap-2 bg-blue-100/70 px-3 py-2 rounded-xl border border-blue-300">
                  <span className="text-blue-950 text-xs font-bold">Account Number :</span>
                  <span className="font-mono font-black text-sm tracking-widest text-blue-950 select-all">8188376210</span>
                </div>
                <div className="flex justify-between items-baseline gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300">
                  <span className="text-slate-800 text-xs font-semibold">IFSC Code :</span>
                  <span className="font-mono font-black text-xs tracking-wider text-slate-950 select-all">IDIB000M702</span>
                </div>
                <div className="flex justify-between items-baseline gap-2 pt-0.5">
                  <span className="text-slate-600 text-xs font-semibold">Bank Name :</span>
                  <span className="font-bold text-slate-950 text-xs">Indian Bank</span>
                </div>
              </div>
            </div>

            {/* Calculations Table */}
            <div className="w-full md:w-80 rounded-xl border border-slate-300 overflow-hidden text-xs shadow-sm">
              <div className="flex justify-between py-2 px-3 border-b border-slate-200">
                <span className="text-slate-600">Total Price</span>
                <span className="font-mono font-bold text-slate-800">₹{safeFormatINR(baseAmt)}</span>
              </div>

              {discPct > 0 && (
                <div className="flex justify-between py-2 px-3 border-b border-slate-200 text-red-600">
                  <span>Discount @ {discPct}%</span>
                  <span className="font-mono font-bold">(-)₹{safeFormatINR(discAmt)}</span>
                </div>
              )}

              <div className="flex justify-between py-2 px-3 border-b border-slate-200 font-bold bg-slate-50">
                <span className="text-slate-800">Deal Amount</span>
                <span className="font-mono text-slate-900">₹{safeFormatINR(dealAmt)}</span>
              </div>

              <div className="flex justify-between py-2 px-3 border-b border-slate-200">
                <span className="text-slate-600">IGST / GST @ {taxPct}%</span>
                <span className="font-mono font-bold text-slate-800">₹{safeFormatINR(taxAmt)}</span>
              </div>

              <div className="flex justify-between py-2.5 px-3 bg-slate-900 text-white font-bold text-sm">
                <span>Total Payable Amount</span>
                <span className="font-mono text-emerald-400">₹{safeFormatINR(totalPayable)}</span>
              </div>
            </div>
          </div>

          {/* Legal Terms & Escrow Clause Footer */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-300 text-[10px] text-slate-500 leading-relaxed space-y-1">
            <p className="font-bold text-slate-700">Terms & Conditions:</p>
            <p>1. <strong>Escrow Protection:</strong> Funds deposited for this trade deal are secured in an RBI-regulated Indian Bank Escrow Nodal Account under PayShieldX protocol.</p>
            <p>2. <strong>Tranche Releases:</strong> Disbursals are triggered strictly upon verified physical deliverable milestones (QC Mill Certificate, Transporter Lorry Receipt, and Destination Receiving).</p>
            <p>3. <strong>Dispute Resolution:</strong> Quality discrepancies are adjudicated by PayShield Admin with legally binding settlement under the Arbitration & Conciliation Act, 1996.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
