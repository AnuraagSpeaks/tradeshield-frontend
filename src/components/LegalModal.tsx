import React from 'react';
import { X, ShieldCheck, FileText, Lock, RefreshCw, Scale, UserCheck, AlertCircle, Phone, Mail, MessageSquare } from 'lucide-react';

export type LegalDocType = 
  | 'terms' 
  | 'privacy' 
  | 'refund' 
  | 'dispute' 
  | 'kyc' 
  | 'seller' 
  | 'buyer_protection' 
  | 'contact';

interface LegalModalProps {
  isOpen: boolean;
  activeDoc: LegalDocType;
  onClose: () => void;
  onSelectDoc: (doc: LegalDocType) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeDoc,
  onClose,
  onSelectDoc,
}) => {
  if (!isOpen) return null;

  const tabs: { id: LegalDocType; label: string; icon: any }[] = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'refund', label: 'Refund Policy', icon: RefreshCw },
    { id: 'dispute', label: 'Dispute Resolution', icon: Scale },
    { id: 'kyc', label: 'KYC Policy', icon: UserCheck },
    { id: 'seller', label: 'Seller Guidelines', icon: ShieldCheck },
    { id: 'buyer_protection', label: 'Buyer Protection', icon: AlertCircle },
    { id: 'contact', label: 'Contact & Support', icon: Phone },
  ];

  return (
    <div className='fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-colors'>
      <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden'>
        
        {/* Modal Header */}
        <div className='p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold'>
              <ShieldCheck className='w-6 h-6' />
            </div>
            <div>
              <h2 className='text-xl font-extrabold text-slate-900 dark:text-white'>PayShieldX Compliance & Legal Center</h2>
              <p className='text-xs text-slate-500 dark:text-slate-400'>Official policies governing PayShieldX.in payment protection platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className='flex items-center gap-2 overflow-x-auto p-3 bg-slate-100/70 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 no-scrollbar'>
          {tabs.map((t) => {
            const Icon = t.icon;
            const isSelected = activeDoc === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectDoc(t.id)}
                className={'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ' + (
                  isSelected
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-transparent'
                )}
              >
                <Icon className='w-3.5 h-3.5' />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className='p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed'>
          {activeDoc === 'terms' && (
            <div className='space-y-5'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>1. Terms & Conditions</h3>
              
              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>1.1 Acceptance of Terms</h4>
                <p>Welcome to <strong>PayShieldX.in</strong>. By creating an account or using our platform, you agree to these Terms & Conditions. If you do not agree, please do not use our services.</p>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>1.2 About PayShieldX</h4>
                <p>PayShieldX is a <strong>Buyer-Supplier Payment Protection Platform</strong>. We help buyers and suppliers complete secure business transactions. We are not the buyer, seller, manufacturer, or logistics company.</p>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>1.3 User Eligibility</h4>
                <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
                  <li>You must provide correct business information.</li>
                  <li>You must use the platform for lawful business purposes only.</li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>1.4 Digital Agreement</h4>
                <p>The <strong>Payment Confirmation Proposal</strong> becomes a legally binding digital agreement after both buyer and supplier approve it. After approval:</p>
                <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
                  <li>No edits are allowed.</li>
                  <li>A new proposal is required for any changes.</li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>1.5 Membership & Subscription</h4>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2'>
                  <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>Buyer Membership</span>
                    <p className='text-base font-bold text-slate-900 dark:text-white'>₹0 / month</p>
                  </div>
                  <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>Growth Plan</span>
                    <p className='text-base font-bold text-emerald-600 dark:text-emerald-400'>₹599 / month</p>
                  </div>
                  <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>Business Plan</span>
                    <p className='text-base font-bold text-emerald-600 dark:text-emerald-400'>₹1499 / month</p>
                  </div>
                  <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>Enterprise Plan</span>
                    <p className='text-base font-bold text-emerald-600 dark:text-emerald-400'>₹2499 / month</p>
                  </div>
                </div>
                <p className='text-xs text-slate-500 italic mt-1'>Membership fees are non-refundable after activation.</p>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>1.6 Suspension</h4>
                <p>PayShieldX may suspend any account involved in fraud, fake transactions, identity misuse, or policy violations.</p>
              </div>
            </div>
          )}

          {activeDoc === 'privacy' && (
            <div className='space-y-5'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>2. Privacy Policy</h3>
              
              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>2.1 Information We Collect</h4>
                <p>We collect:</p>
                <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
                  <li>Name, Mobile Number, Email</li>
                  <li>GST Number, PAN, Business Name</li>
                  <li>Bank details (where required)</li>
                  <li>Transaction and proposal history</li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>2.2 Why We Collect It</h4>
                <p>We use your information to verify your business, process escrow payments, prevent trade fraud, resolve disputes, and improve platform reliability.</p>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>2.3 Data Protection</h4>
                <p>Your information is stored securely. We never sell your personal data. We share data only with authorized payment partners and where legally required.</p>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>2.4 User Rights</h4>
                <p>You may update your profile, request correction of information, or request deletion of your account (subject to legal record requirements under RBI directives).</p>
              </div>
            </div>
          )}

          {activeDoc === 'refund' && (
            <div className='space-y-5'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>3. Refund Policy</h3>
              
              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>3.1 When Refund Is Allowed</h4>
                <p>A refund request may be made if:</p>
                <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
                  <li>Product is not delivered within agreed timeline.</li>
                  <li>Wrong or defective product is delivered.</li>
                  <li>Seller fails to fulfil the agreed proposal parameters.</li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>3.2 Refund Timeline</h4>
                <div className='p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1'>
                  <p><strong className='text-slate-900 dark:text-white'>Refund Request Window:</strong> Within 7 days of scheduled delivery</p>
                  <p><strong className='text-slate-900 dark:text-white'>Compliance Review:</strong> 7-15 business days</p>
                  <p><strong className='text-slate-900 dark:text-white'>Approved Refund:</strong> Processed automatically back to source payment gateway / bank</p>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>3.3 Non-Refundable Items</h4>
                <p>Membership fees (₹599 / ₹1499 / ₹2499) are non-refundable once activated.</p>
              </div>
            </div>
          )}

          {activeDoc === 'dispute' && (
            <div className='space-y-5'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>4. Dispute Resolution Policy</h3>
              
              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>4.1 Raise a Dispute</h4>
                <p>The buyer must raise a dispute <strong>within 7 days of delivery</strong> if goods do not match specifications.</p>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>4.2 Required Evidence</h4>
                <p>Both parties must upload supporting documentation:</p>
                <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
                  <li>Official Tax Invoice</li>
                  <li>High-resolution Product photos & unboxing videos</li>
                  <li>Lorry Receipt (LR) / Delivery Challan / Proof of Delivery</li>
                  <li>Written chat or email communications</li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>4.3 Review Process & Decisions</h4>
                <p>1. Dispute submitted ➔ 2. Supplier notified ➔ 3. Evidence uploaded ➔ 4. Arbitrators review ➔ 5. Final decision issued.</p>
                <p className='text-xs text-emerald-600 dark:text-emerald-400'>Possible decisions: Full refund to Buyer, Partial refund split, Payment released to Supplier, or Mutual settlement.</p>
              </div>
            </div>
          )}

          {activeDoc === 'kyc' && (
            <div className='space-y-5'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>5. KYC Policy</h3>
              
              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>5.1 Buyer & Supplier Verification</h4>
                <p>To ensure trust across India, all entities must undergo identity verification:</p>
                <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
                  <li><strong>Buyers:</strong> Business details, PAN, Aadhaar, GST (if available).</li>
                  <li><strong>Suppliers:</strong> GST Certificate, Business PAN, Incorporation Certificate, Bank Account Details (IMPS Penny Drop verified).</li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>5.2 Verification Badges</h4>
                <div className='flex flex-wrap gap-3 pt-2'>
                  <span className='px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/30'>
                    🟢 Verified Account
                  </span>
                  <span className='px-3 py-1.5 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-500/30'>
                    ⏳ Pending Verification
                  </span>
                  <span className='px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-500/30'>
                    ❌ Restricted Access
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'seller' && (
            <div className='space-y-5'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>6. Seller Guidelines</h3>
              
              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>6.1 Supplier Must:</h4>
                <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
                  <li>Upload correct product and technical specifications.</li>
                  <li>Deliver within the mutually agreed timeline.</li>
                  <li>Upload valid tax invoice and Lorry Receipt (LR) before shipment.</li>
                  <li>Use accurate GST and registered business credentials.</li>
                  <li>Respond to dispute queries transparently.</li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-rose-600 dark:text-rose-400'>6.2 Supplier Must NOT:</h4>
                <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
                  <li>Upload fake products or misleading samples.</li>
                  <li>Accept payment outside PayShieldX after confirming the proposal.</li>
                  <li>Use another company's GSTIN or credentials.</li>
                  <li>Misrepresent product quality or weight measurements.</li>
                </ul>
                <p className='text-xs text-rose-600 dark:text-rose-400 italic'>Repeated violations result in permanent blacklisting and legal reporting.</p>
              </div>
            </div>
          )}

          {activeDoc === 'buyer_protection' && (
            <div className='space-y-5'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>7. Buyer Protection Policy</h3>
              
              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>7.1 What Is Protected?</h4>
                <p>PayShieldX protects every transaction by recording agreed commercial terms in an unchangeable digital proposal and locking funds in RBI-regulated escrow accounts until delivery verification.</p>
              </div>

              <div className='space-y-2'>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>7.2 Trust Promise</h4>
                <div className='grid grid-cols-2 gap-3 pt-2'>
                  <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'>
                    <p className='text-xs font-bold text-slate-900 dark:text-white'>✓ Verified Business Identity</p>
                  </div>
                  <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'>
                    <p className='text-xs font-bold text-slate-900 dark:text-white'>✓ Dual Approval Agreement</p>
                  </div>
                  <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'>
                    <p className='text-xs font-bold text-slate-900 dark:text-white'>✓ Escrow Lock Record</p>
                  </div>
                  <div className='p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'>
                    <p className='text-xs font-bold text-slate-900 dark:text-white'>✓ Evidence-Based Dispute Process</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'contact' && (
            <div className='space-y-5'>
              <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>8. Official Support Channels</h3>
              
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2'>
                <div className='p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1'>
                  <div className='flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold'>
                    <Phone className='w-4 h-4' /> Phone Desk
                  </div>
                  <p className='text-sm font-bold text-slate-900 dark:text-white'>+91-7762990177</p>
                  <p className='text-[11px] text-slate-500'>Mon-Sat, 9AM - 7PM</p>
                </div>

                <div className='p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/40 space-y-1'>
                  <div className='flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold'>
                    <MessageSquare className='w-4 h-4' /> WhatsApp Support
                  </div>
                  <p className='text-sm font-bold text-slate-900 dark:text-white'>+91-8920726073</p>
                  <p className='text-[11px] text-emerald-600 dark:text-emerald-400 font-medium'>Instant proposal alerts</p>
                </div>

                <div className='p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1'>
                  <div className='flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold'>
                    <Mail className='w-4 h-4' /> Email Desk
                  </div>
                  <p className='text-sm font-bold text-slate-900 dark:text-white'>support@payshieldx.in</p>
                  <p className='text-[11px] text-slate-500'>2-hour response window</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className='p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500'>
          <span>PayShieldX India • B2B Payment Protection Platform</span>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold transition-all cursor-pointer'
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
};
