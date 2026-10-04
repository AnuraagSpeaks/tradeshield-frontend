export interface User {
  id: string;
  email: string;
  password?: string;
  full_name?: string;
  business_name: string;
  contact_person?: string;
  designation?: string;
  gst: string;
  pan?: string;
  mobile: string;
  city: string;
  state?: string;
  category?: string;
  role: "buyer" | "supplier" | "admin";
  plan_tier?: "buyer_free" | "growth" | "business" | "enterprise";
  pass_id?: string;
  verified: boolean;
  token?: string;
}

export interface Milestone {
  id: string;
  contract_id: string;
  sequence: number;
  title: string;
  description: string;
  percentage: number;
  amount: number;
  status: "PENDING_FUND" | "FUNDED" | "IN_INSPECTION" | "RELEASED" | "DISPUTED";
  deliverable_proof_url?: string;
  inspection_notes?: string;
  submitted_at?: string;
  approved_at?: string;
  released_at?: string;
  due_date?: string;
}

export interface Contract {
  id: string;
  title: string;
  contract_number: string;
  buyer_org_id: string;
  buyer_org_name: string;
  supplier_org_id: string;
  supplier_org_name: string;
  total_amount: number;
  currency: string;
  platform_fee_percent: number;
  platform_fee_amount: number;
  escrow_virtual_account: string;
  status: "DRAFT" | "AWAITING_FUNDS" | "FUNDED" | "IN_PROGRESS" | "COMPLETED" | "DISPUTED";
  description: string;
  delivery_terms: string;
  inspection_period_days: number;
  created_at: string;
  updated_at: string;
  milestones: Milestone[];
}

export interface Proposal {
  id: string;
  order_id: string;
  buyer_id: string;
  buyer_name?: string;
  supplier_id: string;
  supplier_name?: string;
  amount: number;
  currency: string;
  terms: "full" | "partial" | "advance";
  delivery_timeline: string;
  notes: string;
  status: "Draft" | "Approved by Supplier" | "Approved by Buyer" | "Confirmed" | "Modification Requested" | "Disputed";
  payment_status: "Unpaid" | "Payment Held in Escrow" | "Shipped" | "Delivered" | "Payment Released" | "Dispute Raised";
  buyer_approved?: boolean;
  supplier_approved?: boolean;
  lr_number?: string;
  transporter_name?: string;
  proof_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Dispute {
  id: string;
  proposal_id?: string;
  order_id?: string;
  contract_id?: string;
  milestone_id?: string;
  initiator_org_id?: string;
  respondent_org_id?: string;
  raised_by?: string;
  reason: string;
  claim_amount: number;
  status: "Under Review" | "Evidence Requested" | "Resolved (Refund)" | "Resolved (Released to Supplier)" | "RAISED" | "EVIDENCE_REQUESTED" | "SETTLED_REFUND" | "SETTLED_RELEASE";
  evidence_urls?: string[];
  buyer_refund_share?: number;
  seller_release_share?: number;
  created_at: string;
}

export interface Connection {
  id: string;
  buyer_id: string;
  buyer_name?: string;
  supplier_id: string;
  supplier_name?: string;
  timestamp: string;
}

export interface ConnectionRequest {
  id: string;
  from_id: string;
  from_name?: string;
  to_id: string;
  to_name?: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  status: "open" | "resolved";
  created_at: string;
}

export interface EscrowSummary {
  total_locked_inr: number;
  total_released_inr: number;
  total_disputed_inr: number;
  platform_fee_inr: number;
  active_deals_count: number;
}

export interface KYCDocument {
  type: string;
  document_no: string;
  url: string;
  status: "Approved" | "Pending" | "Rejected";
  uploaded_at: string;
  verified_at?: string;
}

export interface RefundRecord {
  refund_id: string;
  transaction_id: string;
  amount: number;
  reason: string;
  status: string;
  utr_number?: string;
  created_at: string;
}

export interface SettlementDetails {
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  account_holder: string;
  is_penny_dropped: boolean;
  penny_drop_status: string;
  settlement_cycle: string;
}

export interface BuyerRecord {
  buyer_id: string;
  name: string;
  company_name: string;
  mobile: string;
  email: string;
  gstin: string;
  pan: string;
  kyc_status: "Approved" | "Pending" | "Rejected";
  completed_transactions: number;
  disputes: number;
  total_transaction_value: number;
  refund_history: RefundRecord[];
  account_status: "Active" | "Suspended" | "Under Review";
  created_at: string;
}

export interface SupplierRecord {
  supplier_id: string;
  company_name: string;
  contact_person: string;
  mobile: string;
  email: string;
  gstin: string;
  pan: string;
  kyc_documents: KYCDocument[];
  verification_status: "Approved" | "Pending" | "Rejected";
  supplier_plan: string;
  plan_expiry: string;
  total_proposals: number;
  accepted_proposals: number;
  rejected_proposals: number;
  pending_proposals: number;
  completed_transactions: number;
  disputes: number;
  refunds: number;
  settlement_info: SettlementDetails;
  account_status: "Active" | "Suspended" | "Under Review";
  created_at: string;
}

export interface SettlementItem {
  settlement_id: string;
  supplier_id: string;
  supplier_name: string;
  bank_name: string;
  account_no: string;
  ifsc_code: string;
  amount: number;
  deal_ref: string;
  status: "PENDING" | "PROCESSING" | "SETTLED";
  utr_number?: string;
  created_at: string;
}

export interface AdminBusinessHealthStats {
  total_buyers: number;
  total_suppliers: number;
  active_users: number;
  new_registrations_today: number;
  new_registrations_week: number;
  new_registrations_month: number;
  kyc_pending: number;
  kyc_approved: number;
  kyc_rejected: number;
  total_payment_proposals: number;
  pending_proposals: number;
  approved_proposals: number;
  disputed_transactions: number;
  failed_transactions: number;
  platform_revenue: number;
  membership_revenue: number;
  refund_amount: number;
  pending_settlements: number;
  today_collection: number;
  monthly_revenue: number;
}

export interface AdminFinanceStats {
  membership_revenue: number;
  membership_growth: number;
  membership_business: number;
  membership_enterprise: number;
  growth_count?: number;
  business_count?: number;
  enterprise_count?: number;
  other_revenue: number;
  total_revenue: number;
  escrow_nodal_balance: number;
  pending_settlement_amount: number;
  refunds_total: number;
  today_collection: number;
  monthly_revenue: number;
  pending_settlements: SettlementItem[];
}
