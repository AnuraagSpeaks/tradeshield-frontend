import React from "react";
import { Proposal } from "../types";
import { X, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";

interface ProposalViewerModalProps {
  proposal: Proposal | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (proposalId: string) => void;
  isBuyer?: boolean;
}

export const ProposalViewerModal: React.FC<ProposalViewerModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onApprove,
  isBuyer = false,
}) => {
  if (!isOpen || !proposal) return null;

  const baseAmt = proposal.base_amount || (proposal.amount > 0 ? proposal.amount / 1.18 : 250000);
  const discPct = proposal.discount_percent || 0;
  const discAmt = proposal.discount_amount || (baseAmt * (discPct / 100));
  const dealAmt = baseAmt - discAmt;
  const taxPct = proposal.tax_percent || 18;
  const taxAmt = proposal.tax_amount || (dealAmt * (taxPct / 100));
  const totalPayable = proposal.total_payable_amount || (dealAmt + taxAmt) || proposal.amount;

  const isApproved = proposal.buyer_approved || proposal.status === "APPROVED" || proposal.status === "Confirmed";
  const propDate = proposal.created_at ? new Date(proposal.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "18-Sep-2026";
  const validDate = proposal.valid_till_date ? new Date(proposal.valid_till_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "14 Days from Issue";
  const approvedDate = proposal.approved_at ? new Date(proposal.approved_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : isApproved ? propDate : "Pending Acceptance";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Modal Action Header (Excluded during print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-400">PROPOSAL #{proposal.proposal_number || proposal.id}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isApproved ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}>
              {isApproved ? "APPROVED & ESCROW SECURED" : "AWAITING BUYER ACCEPTANCE"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {isBuyer && !isApproved && onApprove && (
              <button
                onClick={() => onApprove(proposal.id)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Fund Escrow</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Document Body */}
        <div className="p-8 sm:p-12 relative bg-white min-h-[600px] text-slate-900">
          
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

          {/* Itemized Table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-300">
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
                    ₹{baseAmt.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing & Tax Summary with QR Code */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-2">
            
            {/* QR Code Verification Box */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 max-w-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://app.payshieldx.in/proposal/${proposal.proposal_number || proposal.id}`}
                alt="QR Code"
                className="w-20 h-20 rounded-lg bg-white p-1 border border-slate-300"
              />
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-900 block">Scan To Verify / Pay</span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Instant escrow verification & nodal account deposit link.
                </span>
                <span className="text-[9px] font-mono text-blue-600 block">100% Nodal Escrow</span>
              </div>
            </div>

            {/* Calculations Table */}
            <div className="w-full sm:w-80 rounded-xl border border-slate-300 overflow-hidden text-xs">
              <div className="flex justify-between py-2 px-3 border-b border-slate-200">
                <span className="text-slate-600">Total Price</span>
                <span className="font-mono font-bold text-slate-800">₹{baseAmt.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {discPct > 0 && (
                <div className="flex justify-between py-2 px-3 border-b border-slate-200 text-red-600">
                  <span>Discount @ {discPct}%</span>
                  <span className="font-mono font-bold">(-)₹{discAmt.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between py-2 px-3 border-b border-slate-200 font-bold bg-slate-50">
                <span className="text-slate-800">Deal Amount</span>
                <span className="font-mono text-slate-900">₹{dealAmt.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between py-2 px-3 border-b border-slate-200">
                <span className="text-slate-600">IGST / GST @ {taxPct}%</span>
                <span className="font-mono font-bold text-slate-800">₹{taxAmt.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between py-2.5 px-3 bg-slate-900 text-white font-bold text-sm">
                <span>Total Payable Amount</span>
                <span className="font-mono text-emerald-400">₹{totalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Legal Terms & Escrow Clause Footer */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-300 text-[10px] text-slate-500 leading-relaxed space-y-1">
            <p className="font-bold text-slate-700">Terms & Conditions:</p>
            <p>1. <strong>Escrow Protection:</strong> Funds deposited for this trade deal are secured in an RBI-regulated ICICI Bank Escrow Nodal Account under PayShieldX protocol.</p>
            <p>2. <strong>Tranche Releases:</strong> Disbursals are triggered strictly upon verified physical deliverable milestones (QC Mill Certificate, Transporter Lorry Receipt, and Destination Receiving).</p>
            <p>3. <strong>Neutral Arbitration:</strong> Quality discrepancies are adjudicated by PayShield Neutral Arbitration Panel with legally binding settlement under the Arbitration & Conciliation Act, 1996.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
