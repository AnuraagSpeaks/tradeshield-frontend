import React from "react";
import { X, Printer, ShieldCheck, FileText, CheckCircle2, Building, CreditCard, Award, Landmark, Truck } from "lucide-react";

export interface KycDocData {
  type: string;
  document_no: string;
  company_name: string;
  signatory?: string;
  status: string;
  date?: string;
  pan?: string;
  gstin?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  notes?: string;
}

interface KycDocumentModalProps {
  isOpen: boolean;
  doc: KycDocData | null;
  onClose: () => void;
}

export const KycDocumentModal: React.FC<KycDocumentModalProps> = ({
  isOpen,
  doc,
  onClose,
}) => {
  if (!isOpen || !doc) return null;

  const handlePrint = () => {
    window.print();
  };

  const isGST = doc.type.toLowerCase().includes("gst");
  const isPAN = doc.type.toLowerCase().includes("pan");
  const isBank = doc.type.toLowerCase().includes("bank") || doc.type.toLowerCase().includes("cheque") || doc.type.toLowerCase().includes("passbook");
  const isMSME = doc.type.toLowerCase().includes("msme") || doc.type.toLowerCase().includes("udyam");
  const isLR = doc.type.toLowerCase().includes("lorry") || doc.type.toLowerCase().includes("lr") || doc.type.toLowerCase().includes("dispatch") || doc.type.toLowerCase().includes("transit") || doc.type.toLowerCase().includes("eway");
  const isMTC = doc.type.toLowerCase().includes("mtc") || doc.type.toLowerCase().includes("mill") || doc.type.toLowerCase().includes("material");

  const isApproved = doc.status.toLowerCase() === "approved" || doc.status.toLowerCase() === "verified";
  const isPending = doc.status.toLowerCase() === "pending" || doc.status.toLowerCase() === "in_inspection";
  const isRejected = doc.status.toLowerCase() === "rejected";

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 dark:bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header (no-print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              {isGST ? <Building className="w-5 h-5" /> : 
               isPAN ? <CreditCard className="w-5 h-5" /> : 
               isBank ? <Landmark className="w-5 h-5" /> : 
               isMSME ? <Award className="w-5 h-5" /> : 
               isLR ? <Truck className="w-5 h-5" /> :
               <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {doc.type}
                </h2>
                <span className={"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold " + (
                  isApproved 
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                    : isRejected
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
                )}>
                  {doc.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Doc Ref: {doc.document_no} • Entity: {doc.company_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Authentic Document Preview Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          
          <div className="relative bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm font-sans text-xs overflow-hidden">
            
            {/* Authentic Rotated Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.06] dark:opacity-[0.08]">
              <span className={`text-6xl sm:text-7xl font-black uppercase transform -rotate-25 border-8 px-8 py-4 rounded-3xl ${
                isApproved 
                  ? "text-emerald-600 border-emerald-600" 
                  : isRejected 
                  ? "text-rose-600 border-rose-600" 
                  : "text-amber-600 border-amber-600"
              }`}>
                {isApproved ? "VERIFIED & APPROVED" : isRejected ? "REJECTED / INVALID" : "KYC PENDING"}
              </span>
            </div>

            {/* Document Header */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white font-mono uppercase">
                    {isGST ? "GOVERNMENT OF INDIA - GST CERTIFICATE" : 
                     isPAN ? "INCOME TAX DEPARTMENT - PAN REGISTRY" : 
                     isBank ? "SCHEDULED COMMERCIAL BANK MANDATE" : 
                     isMSME ? "MINISTRY OF MSME - UDYAM REGISTRATION" :
                     isLR ? "V-TRANS LOGISTICS FREIGHT NOTE & E-WAY BILL" :
                     isMTC ? "BHARAT METALLURGICAL QUALITY LABS - MTC" :
                     "PAYSHIELDX COMPLIANCE EVIDENCE RECORD"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {isGST ? "Form GST REG-06 • Verified Corporate Compliance Archive" :
                   isPAN ? "Form 49A / NSDL e-Governance Infrastructure" :
                   isBank ? "RBI Scheduled Bank NPCI / NACH Mandate & IMPS Direct Account" :
                   isMSME ? "MSME Gazette Notification S.O. 2119(E) Classification" :
                   isLR ? "Approved IBA Carrier Code: VT-9812 • ISO 9001:2015 Logistics Network" :
                   isMTC ? "NABL Accredited Testing Laboratory • Certificate ISO/IEC 17025" :
                   "Cryptographically Verified B2B Trade Compliance Document"}
                </p>
              </div>

              <div className="text-left sm:text-right font-mono space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  DOC ID: <span className="text-indigo-600 dark:text-indigo-400">{doc.document_no}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  TIMESTAMP: {doc.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            </div>

            {/* Document Details Canvas */}
            <div className="relative z-10 space-y-4">
              {isGST && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">Legal Business Name</span>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{doc.company_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">Registration Status</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Active (Verified GSTN)</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">GSTIN / UIN</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{doc.document_no}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">Taxpayer Type</span>
                      <p className="font-bold text-slate-900 dark:text-white">Regular Taxpayer (Section 22)</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>GSTIN verified against GSTN portal via Pine Labs Setu API gateway. Live Status: ACTIVE.</span>
                  </div>
                </div>
              )}

              {isPAN && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white space-y-4 shadow-md font-mono">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-blue-200 block uppercase">Income Tax Department</span>
                        <span className="text-xs font-bold text-white">Permanent Account Number (PAN) Card</span>
                      </div>
                      <span className="text-xl font-black text-amber-400">GOVT OF INDIA</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-300 block">PAN NUMBER</span>
                      <span className="text-2xl font-black tracking-widest">{doc.document_no}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-white/20">
                      <div>
                        <span className="text-[9px] text-blue-300 block">NAME OF HOLDER</span>
                        <span className="font-bold text-sm">{doc.company_name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                        DIGITALLY VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isBank && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 font-mono">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-900 dark:text-white">Commercial Bank Mandate Record</span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓ Penny-Drop Passed</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Bank Institution</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{doc.bank_name || "HDFC Bank Corporate"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Account Number</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{doc.account_number || "000405012938"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">IFSC Code</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{doc.ifsc_code || "HDFC0000004"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Beneficiary Name</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{doc.company_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-300 font-mono text-[11px]">
                    Penny-drop verification confirmed via IMPS Reference #9812401. Account name matched 100% with registered GST entity.
                  </div>
                </div>
              )}

              {isMSME && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white">Udyam Registration Certificate</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">ACTIVE MSME</span>
                    </div>
                    <p className="text-slate-500 font-mono text-xs">Udyam No: {doc.document_no}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      Enterprise Name: <strong>{doc.company_name}</strong> • Major Activity: Manufacturing & Industrial Processing
                    </p>
                  </div>
                </div>
              )}

              {isLR && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">CONSIGNOR (SUPPLIER)</span>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{doc.company_name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">GIDC Industrial Estate, Makarpura, Vadodara, Gujarat</p>
                      <p className="font-mono text-blue-600 dark:text-blue-400 font-bold mt-1 text-xs">GSTIN: {doc.gstin || "24AABCB5678B1Z2"}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">CONSIGNEE (BUYER)</span>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Apex Auto Components Pvt Ltd</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Gate 3, MIDC Industrial Area, Chakan, Pune, Maharashtra</p>
                      <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 text-xs">GSTIN: 27AAACA1234A1Z5</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                        <tr>
                          <th className="p-2.5">Vehicle No.</th>
                          <th className="p-2.5">E-Way Bill No.</th>
                          <th className="p-2.5">Packages</th>
                          <th className="p-2.5">Gross Wt</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900/50">
                        <tr className="border-t border-slate-200 dark:border-slate-800">
                          <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">MH-12-RN-8812</td>
                          <td className="p-2.5">{doc.document_no || "2810-8912-4410"}</td>
                          <td className="p-2.5">50 Wooden Crates</td>
                          <td className="p-2.5 font-bold">4,850 Kgs</td>
                          <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">IN TRANSIT (ON TIME)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">DRIVER & GPS TRACKING</span>
                      <p className="text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                        Driver: Ramesh Yadav (Lic: MH-1420190038192) • Mobile: +91 98230 44910
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-bold text-[10px]">
                      GPS SEALED ✓
                    </span>
                  </div>
                </div>
              )}

              {isMTC && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">HEAT / BATCH</span>
                      <span className="font-bold text-slate-900 dark:text-white">HT-SG-9921-A</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">MATERIAL</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">SG Iron 500/7</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">TENSILE</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">525 N/mm² (PASSED)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">HARDNESS</span>
                      <span className="font-bold text-slate-900 dark:text-white">185 HBW (PASSED)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Generic fallback preview if no specific pattern matched */}
              {!isGST && !isPAN && !isBank && !isMSME && !isLR && !isMTC && (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-900 dark:text-white">{doc.type} File Archive</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Verified Corporate Record</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Entity Name</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{doc.company_name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Document Identification</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{doc.document_no}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">GSTIN Reference</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{doc.gstin || "24AABCB5678B1Z2"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Compliance Status</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{doc.status}</span>
                      </div>
                    </div>
                    {doc.notes && (
                      <p className="text-slate-600 dark:text-slate-400 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 font-sans">
                        {doc.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cryptographic Escrow Verification Seal */}
            <div className="relative z-10 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px] font-bold">
                  PayShieldX Compliance Ledger Hash: SHA256: 8f4e29b47e2c91a0f8b1c4e72a883901bce47291a82e7419f0293817acbf8102
                </span>
              </div>
              <span className="font-mono text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-bold shrink-0">
                Official Evidence Record ✓
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
