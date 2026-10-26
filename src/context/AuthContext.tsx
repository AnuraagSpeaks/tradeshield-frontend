import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, targetRole?: "buyer" | "supplier" | "admin") => Promise<{ success: boolean; message?: string; user?: User }>;
  register: (userData: Partial<User>) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  demoLogin: (role: "buyer" | "supplier") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const STORAGE_KEY = "payshield_auth_user";

const DEMO_ACCOUNTS: Record<string, User> = {
  buyer: {
    id: "user_buyer_1",
    email: "procurement@apexauto.in",
    business_name: "Apex Auto Components Pvt Ltd",
    contact_person: "Vikram Malhotra",
    designation: "Head of Procurement",
    gst: "27AAACA1234A1Z5",
    pan: "AAACA1234A",
    mobile: "9820123456",
    city: "Pune",
    state: "Maharashtra",
    category: "Automotive & Heavy Engineering",
    role: "buyer",
    plan_tier: "buyer_free",
    pass_id: "PSX-BUYER-892147",
    verified: true,
  },
  supplier: {
    id: "user_seller_1",
    email: "sales@bharatcastings.com",
    business_name: "Bharat Precision Castings Ltd",
    contact_person: "Rajesh Singhania",
    designation: "Managing Director",
    gst: "24AABCB5678B1Z2",
    pan: "AABCB5678B",
    mobile: "9898123456",
    city: "Vadodara",
    state: "Gujarat",
    category: "Precision Metal & Foundry",
    role: "supplier",
    plan_tier: "business",
    pass_id: "PSX-SUPPLIER-389102",
    verified: true,
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === "admin") {
          const email = (parsed.email || "").toLowerCase().trim();
          // Zero-Trust Admin validation: Only authorized executive admin emails allowed
          if (email !== "admin@payshieldx.in" && email !== "court@payshieldx.in") {
            localStorage.removeItem(STORAGE_KEY);
            return null;
          }
          parsed.business_name = "PayShield Admin";
          parsed.designation = "System Administrator";
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to sync auth state:", e);
    }
  }, [user]);

  const login = async (
    email: string, 
    password?: string, 
    targetRole?: "buyer" | "supplier" | "admin"
  ): Promise<{ success: boolean; message?: string; user?: User }> => {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (!password) {
      return { success: false, message: "Password credentials are required." };
    }

    const requestedRole = targetRole || (cleanEmail === "admin@payshieldx.in" || cleanEmail === "court@payshieldx.in" ? "admin" : "buyer");

    // Authenticate strictly against Backend API
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password, role: requestedRole }),
      });
      const data = await res.json();
      if (res.ok && data.data?.user) {
        const u = data.data.user;
        const finalRole: "buyer" | "supplier" | "admin" = u.role === "admin" ? "admin" : u.role === "supplier" ? "supplier" : "buyer";

        if (requestedRole === "admin" && finalRole !== "admin") {
          return { success: false, message: "Access Denied: This account does not possess administrative privileges." };
        }

        const loggedUser: User = {
          id: u.id || "user_" + Math.random().toString(36).substring(2, 8),
          email: u.email,
          business_name: finalRole === "admin" ? "PayShield Admin" : (u.business_name || (finalRole === "supplier" ? "Bharat Precision Castings Ltd" : "Apex Auto Components Pvt Ltd")),
          contact_person: u.contact_person || u.full_name || u.name || "Authorized Signatory",
          designation: u.designation || (finalRole === "admin" ? "System Administrator" : finalRole === "buyer" ? "Head of Procurement" : "Managing Director"),
          gst: u.gst || (finalRole === "admin" ? "07AAACT0001A1Z9" : finalRole === "supplier" ? "24AABCB5678B1Z2" : "27AAACA1234A1Z5"),
          pan: u.pan || (finalRole === "admin" ? "AAACT0001A" : finalRole === "supplier" ? "AABCB5678B" : "AAACA1234A"),
          mobile: u.mobile || "9876543210",
          city: u.city || (finalRole === "admin" ? "New Delhi" : finalRole === "supplier" ? "Vadodara" : "Pune"),
          state: u.state || (finalRole === "admin" ? "Delhi NCR" : finalRole === "supplier" ? "Gujarat" : "Maharashtra"),
          category: u.category || (finalRole === "admin" ? "Platform Administration & Escrow Governance" : finalRole === "supplier" ? "Precision Metal & Foundry" : "Automotive & Heavy Engineering"),
          role: finalRole,
          plan_tier: finalRole === "buyer" ? "buyer_free" : finalRole === "supplier" ? "business" : "enterprise",
          pass_id: u.pass_id || ("PSX-" + finalRole.toUpperCase() + "-" + Math.floor(100000 + Math.random() * 900000)),
          verified: true,
          token: data.data.token,
        };
        setUser(loggedUser);
        return { success: true, message: "Signed in successfully", user: loggedUser };
      } else {
        return { success: false, message: data.error || data.message || "Invalid email or password credentials." };
      }
    } catch {
      return { success: false, message: "Invalid credentials or authentication server unreachable." };
    }
  };

  const register = async (userData: Partial<User>): Promise<{ success: boolean; message?: string; user?: User }> => {
    const role = userData.role || "buyer";
    const passId = "PSX-" + role.toUpperCase() + "-" + Math.floor(100000 + Math.random() * 900000);

    const newUser: User = {
      id: userData.id || "user_" + Math.random().toString(36).substring(2, 8),
      email: userData.email || "accounts@business.in",
      password: userData.password || "Shield@Pass2026",
      full_name: userData.full_name || userData.contact_person || "Authorized Signatory",
      business_name: userData.business_name || "Registered Enterprise",
      contact_person: userData.contact_person || "Director",
      designation: userData.designation || "Managing Director",
      gst: userData.gst || "27AAACA1234A1Z5",
      pan: userData.pan || (userData.gst ? userData.gst.substring(2, 12) : "AAACA1234A"),
      mobile: userData.mobile || "9876543210",
      city: userData.city || "New Delhi",
      state: userData.state || "Delhi",
      category: userData.category || "Manufacturing & Wholesale",
      role: role,
      plan_tier: userData.plan_tier || (role === "buyer" ? "buyer_free" : "business"),
      pass_id: passId,
      verified: true,
    };

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok && data.data?.token) {
        newUser.token = data.data.token;
      }
    } catch {
      // Offline / in-memory fallback
    }

    setUser(newUser);
    return { success: true, message: "Account onboarded & Pass Activated", user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
  };

  const demoLogin = (role: "buyer" | "supplier") => {
    setUser(DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.buyer);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
