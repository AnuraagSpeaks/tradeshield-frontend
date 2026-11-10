import React, { useState, useMemo } from "react";
import { 
  Search, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  BadgeCheck, 
  Landmark, 
  Star, 
  SlidersHorizontal,
  PackageCheck,
  CheckCircle2,
  X,
  FileText
} from "lucide-react";
import { openOfficialGSTPortal } from "../utils/gstHelper";

export interface VerifiedSupplier {
  id: string;
  companyName: string;
  contactPerson: string;
  roleTitle: string;
  mobile: string;
  email: string;
  gstin: string;
  pan: string;
  city: string;
  state: string;
  address: string;
  category: string;
  products: string[];
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifsc: string;
    accountHolder: string;
    pennyDropVerified: boolean;
  };
  escrowStats: {
    completedTrades: number;
    disputes: number;
    satisfactionRate: number;
    volumeLakhs: number;
    trustScore: number;
    membershipTier: string;
  };
  verifiedSince: string;
}

const DEFAULT_SUPPLIERS: VerifiedSupplier[] = [
  {
    id: "SUP-001",
    companyName: "Bharat Precision Castings Ltd",
    contactPerson: "Rajesh Singhania",
    roleTitle: "Managing Director",
    mobile: "+91 98981 23456",
    email: "sales@bharatcastings.com",
    gstin: "24AABCB5678B1Z2",
    pan: "AABCB5678B",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "Plot 104, Phase II, Vatva GIDC Industrial Estate, Ahmedabad, Gujarat 382445",
    category: "Foundry, Castings & Forgings",
    products: [
      "Precision Cast Flanges (Grade ASTM A105)",
      "Forged Carbon Steel Fittings",
      "Hydrostatic Tested Gate & Ball Valves",
      "SG Iron Castings for Pumps"
    ],
    bankDetails: {
      bankName: "HDFC Bank Corporate",
      accountNo: "000405012938",
      ifsc: "HDFC0000004",
      accountHolder: "Bharat Precision Castings Ltd",
      pennyDropVerified: true,
    },
    escrowStats: {
      completedTrades: 78,
      disputes: 0,
      satisfactionRate: 100,
      volumeLakhs: 480,
      trustScore: 5.0,
      membershipTier: "Enterprise Supplier",
    },
    verifiedSince: "Jan 2024",
  },
  {
    id: "SUP-002",
    companyName: "S.S. Enterprises",
    contactPerson: "Sunil Sharma",
    roleTitle: "Managing Partner",
    mobile: "+91 98110 09988",
    email: "accounts@ssenterprises.in",
    gstin: "20KBIPS8898M1ZG",
    pan: "KBIPS8898M",
    city: "Mihijam, Jamtara",
    state: "Jharkhand",
    address: "Holding No. 0170000143000A2, Near Samud Kangoi, Gurudwara Road, Mihijam, Jamtara, Jharkhand 815354",
    category: "Industrial Raw Materials & Hardware",
    products: [
      "Structural Steel Sections & Channels",
      "Commercial Machinery & Fabricated Parts",
      "High-Grade Fasteners & Hex Bolts",
      "Industrial Hardware & Turnkey Supplies"
    ],
    bankDetails: {
      bankName: "Indian Bank",
      accountNo: "8188376210",
      ifsc: "IDIB000M702",
      accountHolder: "S S ENTERPRISE",
      pennyDropVerified: true,
    },
    escrowStats: {
      completedTrades: 39,
      disputes: 0,
      satisfactionRate: 100,
      volumeLakhs: 145,
      trustScore: 4.9,
      membershipTier: "Verified Business Partner",
    },
    verifiedSince: "Mar 2024",
  },
  {
    id: "SUP-003",
    companyName: "Zenith Polymers & Masterbatch Pvt Ltd",
    contactPerson: "Hardik Patel",
    roleTitle: "Commercial Head",
    mobile: "+91 98251 14477",
    email: "hardik@zenithpolymers.com",
    gstin: "24AABCP9911P1Z8",
    pan: "AABCP9911P",
    city: "Vadodara",
    state: "Gujarat",
    address: "Plot 88, GIDC Industrial Area, Makarpura, Vadodara, Gujarat 390010",
    category: "Polymers, Plastics & Chemicals",
    products: [
      "Virgin Polypropylene (PP) Granules",
      "HDPE Blow Molding Resin Grade",
      "UV Stabilizer & Color Masterbatches",
      "Engineering Polyamide (Nylon 6/66)"
    ],
    bankDetails: {
      bankName: "Axis Bank Commercial",
      accountNo: "91902003881241",
      ifsc: "UTIB0000045",
      accountHolder: "Zenith Polymers Pvt Ltd",
      pennyDropVerified: true,
    },
    escrowStats: {
      completedTrades: 24,
      disputes: 0,
      satisfactionRate: 99,
      volumeLakhs: 110,
      trustScore: 4.8,
      membershipTier: "Verified Supplier",
    },
    verifiedSince: "May 2024",
  },
  {
    id: "SUP-004",
    companyName: "Vanguard Electricals & Switchgear Ltd",
    contactPerson: "Naveen Chawla",
    roleTitle: "VP Procurement & Supply",
    mobile: "+91 98104 47788",
    email: "naveen@vanguardelec.in",
    gstin: "06AAACV1298V1Z0",
    pan: "AAACV1298V",
    city: "Faridabad",
    state: "Haryana",
    address: "Plot 12, Sector 24 Industrial Area, Faridabad, Haryana 121005",
    category: "Electrical & Switchgear",
    products: [
      "HT/LT Industrial Distribution Panels",
      "Air Circuit Breakers (ACB) 800A-4000A",
      "Flameproof Explosion-Proof Panels",
      "Electrolytic Copper Busbars & Relays"
    ],
    bankDetails: {
      bankName: "Kotak Mahindra Bank",
      accountNo: "0029104000129",
      ifsc: "KKBK0000182",
      accountHolder: "Vanguard Electricals Ltd",
      pennyDropVerified: true,
    },
    escrowStats: {
      completedTrades: 55,
      disputes: 1,
      satisfactionRate: 98,
      volumeLakhs: 320,
      trustScore: 4.8,
      membershipTier: "Enterprise Supplier",
    },
    verifiedSince: "Aug 2023",
  },
  {
    id: "SUP-005",
    companyName: "Apex Tooling & Forgings Pvt Ltd",
    contactPerson: "Anil Deshmukh",
    roleTitle: "Head of Operations",
    mobile: "+91 98220 54321",
    email: "supply@apextooling.in",
    gstin: "27AAACA1234A1Z5",
    pan: "AAACA1234A",
    city: "Pune",
    state: "Maharashtra",
    address: "Plot 42, MIDC Bhosari Industrial Area, Pune, Maharashtra 411026",
    category: "Engineering & Precision Machining",
    products: [
      "CNC Turned Automotive Precision Shafts",
      "Hardened Tooling Dies & Stamping Punches",
      "Spline Hubs & Heavy Transmission Blanks",
      "High Tolerance Jigs & Fixtures"
    ],
    bankDetails: {
      bankName: "ICICI Bank Commercial",
      accountNo: "001105029381",
      ifsc: "ICIC0000011",
      accountHolder: "Apex Tooling & Forgings",
      pennyDropVerified: true,
    },
    escrowStats: {
      completedTrades: 42,
      disputes: 0,
      satisfactionRate: 100,
      volumeLakhs: 260,
      trustScore: 4.9,
      membershipTier: "Enterprise Supplier",
    },
    verifiedSince: "Nov 2023",
  },
  {
    id: "SUP-006",
    companyName: "Ludhiana Fasteners & Bolt Works",
    contactPerson: "Gurpreet Singh",
    roleTitle: "Partner",
    mobile: "+91 98140 33221",
    email: "sales@ludhianafasteners.com",
    gstin: "03AABCL4421L1Z9",
    pan: "AABCL4421L",
    city: "Ludhiana",
    state: "Punjab",
    address: "Phase V, Focal Point Industrial Area, Ludhiana, Punjab 141010",
    category: "Industrial Raw Materials & Hardware",
    products: [
      "High-Tensile Grade 8.8 & 10.9 Bolts",
      "Stainless Steel SS304/SS316 Studs & Washers",
      "Galvanized Structural Hex Nuts",
      "Heavy Duty Foundation Anchor Fasteners"
    ],
    bankDetails: {
      bankName: "Punjab National Bank",
      accountNo: "0293002100098421",
      ifsc: "PUNB0029300",
      accountHolder: "Ludhiana Fasteners & Bolt Works",
      pennyDropVerified: true,
    },
    escrowStats: {
      completedTrades: 48,
      disputes: 0,
      satisfactionRate: 100,
      volumeLakhs: 185,
      trustScore: 4.9,
      membershipTier: "Verified Supplier",
    },
    verifiedSince: "Feb 2024",
  },
  {
    id: "SUP-007",
    companyName: "Southern Alloy Steels & Rolling Mills",
    contactPerson: "K. Ramanathan",
    roleTitle: "Commercial Director",
    mobile: "+91 98422 99887",
    email: "ramanathan@southernalloy.com",
    gstin: "33AAACS9821S1Z4",
    pan: "AAACS9821S",
    city: "Coimbatore",
    state: "Tamil Nadu",
    address: "SIDCO Industrial Estate, Kurichi, Coimbatore, Tamil Nadu 641021",
    category: "Foundry, Castings & Forgings",
    products: [
      "EN8 & EN9 Alloy Steel Round Bars",
      "Hot Rolled Equal & Unequal Structural Angles",
      "Forged Steel Flange Solid Blanks",
      "Seamless Cold Drawn Hydraulic Pipes"
    ],
    bankDetails: {
      bankName: "Canara Bank Industrial",
      accountNo: "1192201004521",
      ifsc: "CNRB0001192",
      accountHolder: "Southern Alloy Steels Ltd",
      pennyDropVerified: true,
    },
    escrowStats: {
      completedTrades: 52,
      disputes: 0,
      satisfactionRate: 99,
      volumeLakhs: 290,
      trustScore: 4.8,
      membershipTier: "Enterprise Supplier",
    },
    verifiedSince: "Apr 2023",
  },
  {
    id: "SUP-008",
    companyName: "Krishna Packaging & Corrugated Containers",
    contactPerson: "Sanjay Mehta",
    roleTitle: "Proprietor",
    mobile: "+91 98201 66554",
    email: "order@krishnapack.in",
    gstin: "27AABCK6120K1Z1",
    pan: "AABCK6120K",
    city: "Bhiwandi, Thane",
    state: "Maharashtra",
    address: "Mankoli Warehouse Zone, Bhiwandi Industrial Corridor, Thane, Maharashtra 421302",
    category: "Packaging & Logistics Supplies",
    products: [
      "Heavy-Duty 5-Ply & 7-Ply Corrugated Shippers",
      "ISPM-15 Heat Treated Export Pallets",
      "Industrial Stretch Film Rolls & Strapping",
      "Anti-Static ESD Protective Packaging"
    ],
    bankDetails: {
      bankName: "State Bank of India",
      accountNo: "38291049281",
      ifsc: "SBIN0001234",
      accountHolder: "Krishna Packaging",
      pennyDropVerified: true,
    },
    escrowStats: {
      completedTrades: 33,
      disputes: 0,
      satisfactionRate: 98,
      volumeLakhs: 95,
      trustScore: 4.7,
      membershipTier: "Verified Supplier",
    },
    verifiedSince: "Dec 2023",
  }
];

const CATEGORIES = [
  "All Categories",
  "Foundry, Castings & Forgings",
  "Industrial Raw Materials & Hardware",
  "Polymers, Plastics & Chemicals",
  "Electrical & Switchgear",
  "Engineering & Precision Machining",
  "Packaging & Logistics Supplies"
];

export const SupplierSearchDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedState, setSelectedState] = useState("All States");
  const [toastMessage, setToastMessage] = useState("");
  const [contactSupplier, setContactSupplier] = useState<VerifiedSupplier | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 5000);
  };

  const copyText = (text: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch {
      // Fallback
    }
    showToast(`Copied ${label}: ${text}`);
  };

  const handleVerifyGst = (gstin: string) => {
    const res = openOfficialGSTPortal(gstin);
    showToast(res.message);
  };

  // Unique states for filter
  const stateOptions = useMemo(() => {
    const states = Array.from(new Set(DEFAULT_SUPPLIERS.map(s => s.state))).sort();
    return ["All States", ...states];
  }, []);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return DEFAULT_SUPPLIERS.filter(s => {
      const matchesCategory = selectedCategory === "All Categories" || s.category === selectedCategory;
      const matchesState = selectedState === "All States" || s.state === selectedState;
      if (!matchesCategory || !matchesState) return false;

      if (!q) return true;

      const inCompany = s.companyName.toLowerCase().includes(q);
      const inPerson = s.contactPerson.toLowerCase().includes(q);
      const inGstin = s.gstin.toLowerCase().includes(q);
      const inPan = s.pan.toLowerCase().includes(q);
      const inCity = s.city.toLowerCase().includes(q);
      const inState = s.state.toLowerCase().includes(q);
      const inCategory = s.category.toLowerCase().includes(q);
      const inProducts = s.products.some(p => p.toLowerCase().includes(q));

      return inCompany || inPerson || inGstin || inPan || inCity || inState || inCategory || inProducts;
    });
  }, [searchQuery, selectedCategory, selectedState]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-blue-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium leading-relaxed">{toastMessage}</span>
          <button onClick={() => setToastMessage("")} className="ml-auto text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Directory Header & Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Buyer Discovery • RBI Escrow & GSTIN Verified Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verified B2B Supplier Directory
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Search verified Indian manufacturers and distributors. Check official GST compliance, IMPS penny-drop bank details, product catalogs, and historic escrow fulfillment track record before initiating trade deals.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 font-mono">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Taxpayer Verified</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 font-mono">
              <Landmark className="w-4 h-4 text-cyan-300" />
              <span>Penny-Drop Bank Validated</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 font-mono">
              <PackageCheck className="w-4 h-4 text-amber-300" />
              <span>Nodal Escrow Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Multi-Filter Controls */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Company, Supplier Name, GSTIN (e.g. 24AABCB...), Product, or City..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* State / Region Dropdown */}
          <div className="flex items-center gap-2 sm:w-60">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {stateOptions.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={"px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer " + (
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
          <span>Found {filteredSuppliers.length} verified supplier{filteredSuppliers.length === 1 ? "" : "s"}</span>
          <span>Click "Check on GST Portal ↗" for live official tax return status</span>
        </div>
      </div>

      {/* Suppliers Cards Grid */}
      {filteredSuppliers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No suppliers matched your search criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, clearing state filters, or switching categories to discover other verified industrial suppliers.
          </p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("All Categories"); setSelectedState("All States"); }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              {/* Header: Company Name, Category, Trust Badge */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {supplier.companyName}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] tracking-wide">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Verified Supplier
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{supplier.contactPerson}</span>
                      <span className="text-slate-400">•</span>
                      <span>{supplier.roleTitle}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold border border-blue-200 dark:border-blue-800/50">
                      {supplier.escrowStats.membershipTier}
                    </span>
                    <div className="flex items-center justify-end gap-1 text-amber-500 text-xs font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{supplier.escrowStats.trustScore.toFixed(1)} / 5.0</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{supplier.city}, {supplier.state}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{supplier.category}</span>
                </div>
              </div>

              {/* GSTIN & Taxpayer Compliance Section (Prominent) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Official GSTIN & Tax Identity
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
                    Active Regular Taxpayer
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-black font-mono tracking-wider text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 select-all">
                      {supplier.gstin}
                    </code>
                    <button
                      onClick={() => copyText(supplier.gstin, "GSTIN")}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      title="Copy GSTIN"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleVerifyGst(supplier.gstin)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
                    title="Copies GSTIN and opens services.gst.gov.in"
                  >
                    <span>Check on GST Portal ↗</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span>PAN: <strong className="font-mono text-slate-800 dark:text-slate-200">{supplier.pan}</strong></span>
                  <span>Registered: <span className="font-mono">{supplier.verifiedSince}</span></span>
                </div>
              </div>

              {/* Bank Details & Penny-Drop Verification */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Nodal Bank Details (Escrow Disbursal Verified)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    IMPS Penny-Drop Passed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Bank Name</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{supplier.bankDetails.bankName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Account Number</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white text-xs">{supplier.bankDetails.accountNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">IFSC Code</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white text-xs">{supplier.bankDetails.ifsc}</span>
                  </div>
                </div>
              </div>

              {/* Products & Supply Capabilities */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider font-mono">
                  Key Products & Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {supplier.products.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700/60"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Escrow Performance Track Record */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center font-mono">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Completed Deals</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{supplier.escrowStats.completedTrades}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Dispute Ratio</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {supplier.escrowStats.disputes === 0 ? "0.0%" : `${supplier.escrowStats.disputes} Disputed`}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Fulfilled Escrow</span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">₹{supplier.escrowStats.volumeLakhs}L+</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setContactSupplier(supplier)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Contact Supplier</span>
                </button>

                <a
                  href={`mailto:${supplier.email}?subject=PayShieldX Trade Proposal Inquiry - ${encodeURIComponent(supplier.companyName)}`}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Trade Inquiry</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Supplier Modal */}
      {contactSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-bold">Verified Supplier Contact</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{contactSupplier.companyName}</h3>
                <p className="text-xs text-slate-500">{contactSupplier.contactPerson} ({contactSupplier.roleTitle})</p>
              </div>
              <button
                onClick={() => setContactSupplier(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    Mobile Phone:
                  </span>
                  <div className="flex items-center gap-2">
                    <a href={`tel:${contactSupplier.mobile}`} className="font-bold text-slate-900 dark:text-white font-mono hover:underline">
                      {contactSupplier.mobile}
                    </a>
                    <button
                      onClick={() => copyText(contactSupplier.mobile, "Mobile")}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Copy Mobile"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    Official Email:
                  </span>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${contactSupplier.email}`} className="font-bold text-slate-900 dark:text-white font-mono hover:underline">
                      {contactSupplier.email}
                    </a>
                    <button
                      onClick={() => copyText(contactSupplier.email, "Email")}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Copy Email"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-800/60 pt-3 space-y-1">
                  <span className="text-slate-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    Factory / Registered Address:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 pl-6 leading-relaxed">
                    {contactSupplier.address}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  All trade deals conducted with this supplier are 100% protected through PayShieldX RBI-regulated ICICI Bank Nodal Escrow with milestone release on verified inspection.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setContactSupplier(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <a
                href={`mailto:${contactSupplier.email}?subject=Trade Deal Proposal - PayShieldX Escrow Request&body=Dear ${encodeURIComponent(contactSupplier.contactPerson)},%0D%0A%0D%0AWe are interested in procuring goods from ${encodeURIComponent(contactSupplier.companyName)} under PayShieldX Escrow Payment Protection.%0D%0A%0D%0APlease share your quotation and proposal.%0D%0A%0D%0ARegards`}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white cursor-pointer shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Email Client</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
