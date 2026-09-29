import React from "react";
import { X, Printer, ShieldCheck, FileText, Truck, Award } from "lucide-react";
import { Milestone, Contract } from "../types";

interface DocumentViewerModalProps {
  isOpen: boolean;
  milestone: Milestone | null;
  contract: Contract | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  milestone,
  contract,
  onClose,
}) => {
  if (!isOpen || !milestone) return null;

  const isLR = milestone.title.toLowerCase().includes("dispatch") || 
               milestone.title.toLowerCase().includes("lr") || 
               milestone.sequence === 2;

  const isAdvanceMTC = milestone.title.toLowerCase().includes("advance") || 
                       milestone.title.toLowerCase().includes("material") || 
                       milestone.sequence === 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              {isLR ? <Truck className="w-5 h-5" /> : isAdvanceMTC ? <Award className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isLR ? "Official Transporter Lorry Receipt (LR) & E-Way Bill" : isAdvanceMTC ? "Mill Test Certificate (MTC) & Metallurgical Report" : "QC Receiving Inspection & Handover Report"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  VERIFIED PROOF
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Contract: {contract?.contract_number || "TS-CTR-2026-089"} • Milestone #{milestone.sequence}
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
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body - Document Preview Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* Printable Document Container */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm font-sans text-xs">
            
            {/* Header / Watermark Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-emerald-400" />
                  <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white font-mono">
                    {isLR ? "V-TRANS LOGISTICS FREIGHT NOTE" : isAdvanceMTC ? "BHARAT METALLURGICAL QUALITY LABS" : "APEX QUALITY ASSURANCE REPORT"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isLR ? "Approved IBA Carrier Code: VT-9812 • ISO 9001:2015 Logistics Network" : isAdvanceMTC ? "NABL Accredited Testing Laboratory • Certificate ISO/IEC 17025" : "B2B Receiving & Dimensional Tolerances Inspection"}
                </p>
              </div>

              <div className="text-left sm:text-right font-mono space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  DOC NO: <span className="text-blue-600 dark:text-blue-400">{isLR ? "LR-VT-2026-98124" : isAdvanceMTC ? "MTC-2026-BPC-0089" : "QC-APEX-REC-089"}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  DATE: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            </div>

            {/* Document Content Based on Type */}
            {isLR ? (
              /* LORRY RECEIPT / CONSIGNMENT NOTE DETAILS */
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">CONSIGNOR (SUPPLIER)</span>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Bharat Precision Castings Ltd</p>
                    <p className="text-slate-500 dark:text-slate-400">Plot 45, GIDC Industrial Estate, Makarpura, Vadodara, Gujarat</p>
                    <p className="font-mono text-blue-600 dark:text-blue-400 font-bold mt-1">GSTIN: 24AABCB5678B1Z2</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">CONSIGNEE (BUYER)</span>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Apex Auto Components Pvt Ltd</p>
                    <p className="text-slate-500 dark:text-slate-400">Gate 3, MIDC Industrial Area, Chakan, Pune, Maharashtra</p>
                    <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">GSTIN: 27AAACA1234A1Z5</p>
                  </div>
                </div>

                {/* Logistics Consignment Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      <tr>
                        <th className="p-3">Vehicle No.</th>
                        <th className="p-3">E-Way Bill No.</th>
                        <th className="p-3">Packages</th>
                        <th className="p-3">Goods Description</th>
                        <th className="p-3">Gross Wt</th>
                        <th className="p-3">Net Wt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/50 font-mono text-[11px]">
                      <tr>
                        <td className="p-3 font-bold text-blue-600 dark:text-blue-400">MH-12-RN-8812</td>
                        <td className="p-3 text-slate-900 dark:text-white">2810-8912-4410</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">50 Wooden Pallets</td>
                        <td className="p-3 font-sans text-slate-800 dark:text-slate-200">5,000 Pcs Precision Cast Flanges & Valve Housings</td>
                        <td className="p-3 font-bold">4,850 Kgs</td>
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">4,500 Kgs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase font-mono">CARRIER DRIVER & TRACKING:</span>
                    <p className="text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                      Driver: Ramesh Yadav (Lic: MH-1420190038192) • Mobile: +91 98230 44910 • GPS Sealed
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold font-mono text-[10px]">
                    IN TRANSIT (ON TIME)
                  </span>
                </div>
              </div>
            ) : isAdvanceMTC ? (
              /* MILL TEST CERTIFICATE DETAILS */
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">HEAT / BATCH NO</span>
                    <span className="font-bold text-slate-900 dark:text-white">HT-SG-9921-A</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">MATERIAL SPECIFICATION</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">SG Iron 500/7 (ASTM A536)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">TOTAL CAST WEIGHT</span>
                    <span className="font-bold text-slate-900 dark:text-white">5,000 Kg Ingot Batch</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">MICROSTRUCTURE</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">&gt;85% Nodularity (Type I)</span>
                  </div>
                </div>

                {/* Chemical Composition Spectrometer Analysis */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase font-mono text-xs">
                    1. Chemical Composition Spectrographic Analysis (%)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                        <tr>
                          <th className="p-2">Element</th>
                          <th className="p-2">Carbon (C)</th>
                          <th className="p-2">Silicon (Si)</th>
                          <th className="p-2">Manganese (Mn)</th>
                          <th className="p-2">Sulphur (S)</th>
                          <th className="p-2">Phosphorus (P)</th>
                          <th className="p-2">Magnesium (Mg)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900/50">
                        <tr className="border-t border-slate-200 dark:border-slate-800">
                          <td className="p-2 font-bold text-slate-500">Spec Range</td>
                          <td className="p-2">3.50 - 3.80</td>
                          <td className="p-2">2.20 - 2.80</td>
                          <td className="p-2">0.20 - 0.40</td>
                          <td className="p-2">&le; 0.020</td>
                          <td className="p-2">&le; 0.040</td>
                          <td className="p-2">0.035 - 0.060</td>
                        </tr>
                        <tr className="border-t border-slate-200 dark:border-slate-800 font-bold text-emerald-600 dark:text-emerald-400">
                          <td className="p-2">Observed</td>
                          <td className="p-2">3.65%</td>
                          <td className="p-2">2.48%</td>
                          <td className="p-2">0.29%</td>
                          <td className="p-2">0.011%</td>
                          <td className="p-2">0.022%</td>
                          <td className="p-2">0.046%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mechanical Test Results */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase font-mono text-xs">
                    2. Mechanical & Tensile Testing Results
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                      <span className="text-[10px] text-slate-400">TENSILE STRENGTH</span>
                      <p className="text-base font-black text-slate-900 dark:text-white">525 N/mm²</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Min 500 N/mm² req (PASSED)</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                      <span className="text-[10px] text-slate-400">YIELD STRENGTH (0.2%)</span>
                      <p className="text-base font-black text-slate-900 dark:text-white">345 N/mm²</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Min 320 N/mm² req (PASSED)</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                      <span className="text-[10px] text-slate-400">BRINELL HARDNESS (HBW)</span>
                      <p className="text-base font-black text-slate-900 dark:text-white">185 HBW</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">170 - 230 HBW range (PASSED)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* QC INSPECTION REPORT DETAILS */
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Receiving QC Acceptance Certificate</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold font-mono text-[10px]">
                      100% INSPECTED & ACCEPTED
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    Inspected by Apex Auto Quality Control at Chakan Warehouse on CMM (Coordinate Measuring Machine) against Drawing Specification DWG-FLG-9921.
                  </p>
                </div>
              </div>
            )}

            {/* Cryptographic Proof Verification Stamp */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-600 dark:text-slate-400">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>PAYSHIELDX IMMUTABLE ESCROW EVIDENCE HASH</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-md">
                  SHA-256: 8f4e29b47e2c91a0f8b1c4e72a883901bce47291a82e7419f0293817acbf8102
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold font-mono text-[11px]">
                  ✓ Digitally Signed & Sealed
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
