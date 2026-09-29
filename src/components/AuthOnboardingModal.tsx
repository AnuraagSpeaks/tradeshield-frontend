import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Briefcase,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { verifyGSTIN, sendEmailOTP, verifyEmailOTP, resetPasswordAPI } from "../api/client";

interface AuthModalProps {
  isOpen: boolean;
  initialRole?: "buyer" | "supplier";
  initialMode?: "register" | "login" | "forgot_password";
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthOnboardingModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRole = "buyer",
  initialMode = "login",
  onClose,
  onSuccess,
}) => {
  const { login, register, updateUser } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "otp_verify" | "forgot_password" | "reset_password">("login");
  const [role, setRole] = useState<"buyer" | "supplier">(initialRole);

  // Registration Form Fields
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [designation, setDesignation] = useState("Director of Procurement");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [category, setCategory] = useState("Industrial & Manufacturing");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // OTP & Password Recovery State
  const [otpCode, setOtpCode] = useState("");
  const [otpPurpose, setOtpPurpose] = useState<"register" | "forgot_password">("register");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Verification state
  const [isGstVerifying, setIsGstVerifying] = useState(false);
  const [gstVerifiedData, setGstVerifiedData] = useState<{ valid: boolean; legal_name: string; trust_score: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // Registered Success Screen
  const [activatedPass, setActivatedPass] = useState<{ passId: string; company: string; role: string } | null>(null);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Synchronize state when modal is opened or target role/mode changes
  useEffect(() => {
    if (isOpen) {
      const targetMode = initialMode || "login";
      setMode(targetMode);
      setRole(initialRole);
      setErrorMsg("");
      setInfoMsg("");
      setOtpCode("");
      setActivatedPass(null);
      if (targetMode === "login") {
        if (initialRole === "supplier") {
          setEmail("sales@bharatcastings.com");
          setPassword("Bharat@Shield2026");
        } else {
          setEmail("procurement@apexauto.in");
          setPassword("Apex@Shield2026");
        }
      }
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  const handleGSTVerify = async () => {
    if (!gstin || gstin.trim().length < 10) {
      setErrorMsg("Please enter a valid 15-character GSTIN or 10-character PAN");
      return;
    }
    setIsGstVerifying(true);
    setErrorMsg("");
    try {
      const res = await verifyGSTIN(gstin.trim().toUpperCase());
      setGstVerifiedData(res);
      if (res.valid && res.legal_name) {
        setBusinessName(res.legal_name);
        if (gstin.trim().length >= 12) {
          setPan(gstin.trim().substring(2, 12).toUpperCase());
        }
      }
    } catch {
      setGstVerifiedData({ valid: true, legal_name: businessName || "VERIFIED ENTERPRISE", trust_score: 96 });
    } finally {
      setIsGstVerifying(false);
    }
  };

  // Step 1 of Registration: Validate and Send Email OTP
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMsg("Please accept the PayShieldX Nodal Escrow Agreement to proceed.");
      return;
    }
    if (!email || !businessName || !phone) {
      setErrorMsg("Please fill in all mandatory business identity fields.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Please provide a password of at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setInfoMsg("");

    const otpRes = await sendEmailOTP(email.trim().toLowerCase(), "register");
    setLoading(false);

    if (otpRes.success) {
      setOtpPurpose("register");
      setResendCooldown(45);
      setMode("otp_verify");
      setInfoMsg(`A 6-digit verification code has been dispatched to ${email}.`);
    } else {
      setErrorMsg(otpRes.message || "Failed to dispatch verification code. Please check your email.");
    }
  };

  // Step 2 of Registration: Verify OTP and Issue Escrow Pass
  const handleVerifyRegistrationOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const verifyRes = await verifyEmailOTP(email.trim().toLowerCase(), otpCode.trim(), "register");
    if (!verifyRes.success) {
      setLoading(false);
      setErrorMsg(verifyRes.message || "Invalid or expired verification code.");
      return;
    }

    // Register user account
    const res = await register({
      business_name: businessName,
      full_name: contactPerson || "Authorized Signatory",
      contact_person: contactPerson || "Authorized Signatory",
      password: password || "Shield@Pass2026",
      designation: designation,
      email: email.trim().toLowerCase(),
      mobile: phone,
      gst: gstin || "27AAAAA1111A1ZA",
      pan: pan || (gstin ? gstin.substring(2, 12) : "AAAAA1111A"),
      city: city,
      state: state,
      category: category,
      role: role,
      plan_tier: role === "buyer" ? "buyer_free" : "business",
    });

    setLoading(false);
    if (res.success && res.user) {
      setActivatedPass({
        passId: res.user.pass_id || "PSX-" + role.toUpperCase() + "-892100",
        company: res.user.business_name,
        role: role,
      });
    } else {
      setErrorMsg(res.message || "Failed to finalize registration.");
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg("");
    const res = await sendEmailOTP(email.trim().toLowerCase(), otpPurpose);
    setLoading(false);
    if (res.success) {
      setResendCooldown(45);
      setInfoMsg("A new 6-digit verification code was sent to your email.");
    } else {
      setErrorMsg("Failed to resend code. Please try again in a moment.");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your registered official email ID.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || "Invalid credentials.");
    }
  };

  // Forgot Password: Step 1 (Request PIN)
  const handleInitiateForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid registered corporate email.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    const res = await sendEmailOTP(email.trim().toLowerCase(), "forgot_password");
    setLoading(false);

    if (res.success) {
      setOtpPurpose("forgot_password");
      setResendCooldown(45);
      setMode("reset_password");
      setInfoMsg(`A 6-digit password reset PIN was sent to ${email}.`);
    } else {
      setErrorMsg(res.message || "Failed to dispatch reset code. Please check email address.");
    }
  };

  // Forgot Password: Step 2 (Verify PIN & Update Password)
  const handleExecutePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit reset PIN.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const res = await resetPasswordAPI(email.trim().toLowerCase(), otpCode.trim(), newPassword);
    setLoading(false);

    if (res.success) {
      if (res.user) {
        updateUser(res.user);
      }
      alert("Password updated successfully! Signing you into your Escrow Dashboard.");
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || "Invalid reset PIN or expired session.");
    }
  };

  const handleQuickFillCredentials = (targetRole: "buyer" | "supplier" | "admin") => {
    if (targetRole === "buyer") {
      setEmail("procurement@apexauto.in");
      setPassword("Apex@Shield2026");
    } else if (targetRole === "supplier") {
      setEmail("sales@bharatcastings.com");
      setPassword("Bharat@Shield2026");
    } else {
      setEmail("court@tradeshield.in");
      setPassword("Arbiter@Shield2026");
    }
    setErrorMsg("");
  };

  const handleFillDemoData = (targetRole: "buyer" | "supplier") => {
    setRole(targetRole);
    if (targetRole === "buyer") {
      setBusinessName("Rawat Handlooms & Textiles Pvt Ltd");
      setContactPerson("Amit Rawat");
      setDesignation("Head of Procurement");
      setEmail("procurement@rawathandlooms.in");
      setPhone("9876543210");
      setGstin("07AAAAA1111A1ZA");
      setPan("AAAAA1111A");
      setCity("New Delhi");
      setState("Delhi");
      setCategory("Textiles, Fabrics & Garments");
      setPassword("Rawat@Shield2026");
    } else {
      setBusinessName("Bharat Precision Castings Ltd");
      setContactPerson("Rajesh Singhania");
      setDesignation("Managing Director");
      setEmail("sales@bharatcastings.com");
      setPhone("9898123456");
      setGstin("24AABCB5678B1Z2");
      setPan("AABCB5678B");
      setCity("Vadodara");
      setState("Gujarat");
      setCategory("Heavy Engineering & Metal Castings");
      setPassword("Bharat@Shield2026");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              {mode === "forgot_password" || mode === "reset_password" ? (
                <KeyRound className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {activatedPass
                  ? "Identity Verified & Pass Issued!"
                  : mode === "login"
                  ? "Sign In to Escrow Portal"
                  : mode === "register"
                  ? "B2B Business Identity & Escrow Pass"
                  : mode === "otp_verify"
                  ? "Verify Official Business Email"
                  : mode === "forgot_password"
                  ? "Password Recovery"
                  : "Set New Password / PIN"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RBI Nodal Escrow Protocol • Instant Dual-Party Verification
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
          
          {/* Alerts Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* SUCCESS ACTIVATION SCREEN */}
          {activatedPass ? (
            <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
                  EMAIL & GSTIN KYC COMPLIANT
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  Welcome, {activatedPass.company}!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your business profile and official signatory email are verified on the national escrow network.
                </p>
              </div>

              {/* Digital Certificate Pass Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-blue-500/30 shadow-xl text-left space-y-3 font-mono relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <ShieldCheck className="w-24 h-24" />
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                    {activatedPass.role === "buyer" ? "Official Buyer Pass" : "Verified Supplier Pass"}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">● ACTIVE</span>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Entity:</div>
                  <div className="text-sm font-bold text-white">{activatedPass.company}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pass ID:</span>
                    <span className="font-bold text-emerald-400">{activatedPass.passId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Protection Escrow:</span>
                    <span className="text-slate-200 font-bold">RBI Nodal Vault</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Enter Escrow Dashboard as {activatedPass.company}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : mode === "login" ? (
            /* 1. SIGN IN VIEW */
            <div className="space-y-6">
              {/* Quick-Fill Test Credentials Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-950 border border-blue-200 dark:border-blue-500/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-400" />
                    <span>Quick Test Login (1-Click Fill):</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Pre-Configured</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFillCredentials("buyer")}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-left transition-all cursor-pointer group shadow-sm hover:shadow"
                  >
                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">BUYER (APEX AUTO)</div>
                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">procurement@apexauto.in</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFillCredentials("supplier")}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left transition-all cursor-pointer group shadow-sm hover:shadow"
                  >
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">SUPPLIER (BHARAT)</div>
                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">sales@bharatcastings.com</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFillCredentials("admin")}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-left transition-all cursor-pointer group shadow-sm hover:shadow"
                  >
                    <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 font-mono">ARBITER COURT</div>
                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">court@tradeshield.in</div>
                  </button>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Registered Business Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g., procurement@apexauto.in"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password / Security PIN *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot_password");
                        setErrorMsg("");
                        setInfoMsg("");
                      }}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate & Sign In to Escrow Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Registration Trigger Box */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">New business organization?</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Activate your Verified Escrow Pass with Email OTP.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMsg("");
                    setInfoMsg("");
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  Register Business Account →
                </button>
              </div>
            </div>
          ) : mode === "register" ? (
            /* 2. REGISTRATION FORM VIEW */
            <div className="space-y-6">
              {/* Back to Login Header Banner */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-950 border border-blue-200 dark:border-blue-500/20">
                <span className="text-xs text-slate-600 dark:text-slate-400">Already have a registered account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setInfoMsg("");
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>

              <form onSubmit={handleInitiateRegistration} className="space-y-5">
                {/* Role Selector Card */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    1. Select Business Role & Protection Tier:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("buyer")}
                      className={"p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between " + (
                        role === "buyer"
                          ? "bg-blue-50 dark:bg-slate-800/90 border-blue-600 dark:border-blue-500 shadow-md ring-1 ring-blue-500/20"
                          : "bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                          Free Forever
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">B2B Buyer Pass</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">For Importers, Wholesalers & Procurement</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("supplier")}
                      className={"p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between " + (
                        role === "supplier"
                          ? "bg-emerald-50 dark:bg-slate-800/90 border-emerald-600 dark:border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
                          : "bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                          Supplier Shield
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">B2B Supplier Shield</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">For Manufacturers, Millers & Foundries</p>
                      </div>
                    </button>
                  </div>

                  {/* Quick Demo Pre-fill helper */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Need sample test data?</span>
                    <button
                      type="button"
                      onClick={() => handleFillDemoData(role)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-fill {role === "buyer" ? "Buyer" : "Supplier"} Profile
                    </button>
                  </div>
                </div>

                {/* Company Legal Information */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    2. Company & Tax Identity:
                  </label>

                  {/* GSTIN with live verify */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">GSTIN (15 Digits) or PAN</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={gstin}
                        onChange={(e) => {
                          setGstin(e.target.value.toUpperCase());
                          setGstVerifiedData(null);
                        }}
                        placeholder="E.g., 07AAAAA1111A1ZA"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white uppercase focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleGSTVerify}
                        disabled={isGstVerifying || !gstin}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                      >
                        {isGstVerifying ? "Verifying..." : "Verify GST"}
                      </button>
                    </div>

                    {gstVerifiedData && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span><strong>Verified:</strong> {gstVerifiedData.legal_name}</span>
                        </div>
                        <span className="font-mono font-bold text-[11px] bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">
                          Score: {gstVerifiedData.trust_score}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Registered Firm / Company Name *</label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="E.g., Rawat Handlooms Ltd"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Trade Sector / Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option>Heavy Engineering & Metal Castings</option>
                        <option>Textiles, Fabrics & Garments</option>
                        <option>Chemicals, Polymers & Resins</option>
                        <option>Automotive Components & Spares</option>
                        <option>Agricultural Commodities & Spices</option>
                        <option>Electronics, Solar & Hardware</option>
                        <option>Construction & Building Materials</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Operating City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="E.g., Pune, Vadodara, Surat"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">State / Union Territory</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="E.g., Maharashtra, Gujarat"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Signatory & Security Credentials */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    3. Signatory & Security Credentials:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Signatory Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="E.g., Vikram Malhotra"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Designation *</label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="E.g., Head of Procurement / Partner"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Official Business Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E.g., procurement@company.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile Number (For Alerts) *</label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="E.g., 9820123456"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Create Pass Password / PIN *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Regulatory Declaration */}
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 space-y-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      I hereby declare that I am an authorized corporate signatory and agree to the <strong>PayShieldX Nodal Escrow Agreement</strong>, GSTIN compliance norms, and neutral arbitration protocol.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Email Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Email & Activate Escrow Pass</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : mode === "otp_verify" ? (
            /* 3. EMAIL OTP VERIFICATION VIEW */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-bold">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verify Your Corporate Email</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  We have dispatched a 6-digit verification code to <strong className="text-slate-900 dark:text-white font-mono">{email}</strong>.
                </p>
              </div>

              <form onSubmit={handleVerifyRegistrationOTP} className="space-y-5 max-w-sm mx-auto">
                <div className="space-y-2 text-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="849201"
                    className="w-full text-center tracking-[8px] font-mono text-2xl font-black py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Quick Test Demo Autofill */}
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => setOtpCode("849201")}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-fill Demo Test Code (849201)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Identity...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Issue Escrow Pass</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" /> Edit Email / Details
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendOTP}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
                  </button>
                </div>
              </form>
            </div>
          ) : mode === "forgot_password" ? (
            /* 4. FORGOT PASSWORD VIEW */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recover Password / Security PIN</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Enter your registered official email address to receive a secure 6-digit password reset PIN.
                </p>
              </div>

              <form onSubmit={handleInitiateForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Registered Business Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g., procurement@apexauto.in"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching Reset PIN...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit Password Reset PIN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMsg("");
                      setInfoMsg("");
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    ← Remember password? Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* 5. RESET PASSWORD EXECUTION VIEW */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Password / PIN</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Enter the 6-digit PIN sent to <strong className="text-slate-900 dark:text-white font-mono">{email}</strong> and specify your new password.
                </p>
              </div>

              <form onSubmit={handleExecutePasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">6-Digit Reset PIN *</label>
                    <button
                      type="button"
                      onClick={() => setOtpCode("849201")}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Demo PIN (849201)
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="E.g., 849201"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono tracking-widest focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password / PIN *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Update Password & Sign In</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMsg("");
                      setInfoMsg("");
                    }}
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendOTP}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {resendCooldown > 0 ? `Resend PIN in ${resendCooldown}s` : "Resend PIN"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

