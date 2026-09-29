export interface InvoiceData {
  invoiceNumber: string;
  subscriptionRef: string;
  date: string;
  customerName: string;
  customerGst: string;
  customerEmail: string;
  customerPhone: string;
  customerCity?: string;
  planName: string;
  billingCycle: "monthly" | "annual";
  basePrice: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

export function generateAndDownloadGSTInvoice(data: InvoiceData) {
  const isInterstate = data.customerGst && !data.customerGst.startsWith("07");
  const cgstAmount = isInterstate ? 0 : Math.round(data.basePrice * 0.09);
  const sgstAmount = isInterstate ? 0 : Math.round(data.basePrice * 0.09);
  const igstAmount = isInterstate ? Math.round(data.basePrice * 0.18) : 0;

  const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${data.invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 30px; color: #1e293b; background: #fff; }
    .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
    .brand h1 { margin: 0; color: #1e3a8a; font-size: 24px; font-weight: 800; }
    .brand p { margin: 4px 0 0; color: #64748b; font-size: 12px; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { margin: 0; color: #2563eb; font-size: 20px; font-weight: 800; text-transform: uppercase; }
    .invoice-meta p { margin: 4px 0 0; font-size: 12px; font-family: monospace; color: #334155; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 12px; line-height: 1.5; }
    .box strong { color: #0f172a; display: block; margin-bottom: 6px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 12px; }
    th { background: #1e3a8a; color: #fff; text-align: left; padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .text-right { text-align: right; }
    .totals { width: 320px; margin-left: auto; margin-top: 16px; font-size: 12px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
    .totals-row.grand { font-size: 15px; font-weight: 800; color: #059669; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; padding: 10px 0; margin-top: 6px; }
    .footer { margin-top: 32px; border-top: 1px dashed #cbd5e1; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center; }
    .print-btn { display: block; width: 100%; max-width: 200px; margin: 20px auto 0; padding: 10px 16px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center; }
    @media print { .print-btn { display: none; } body { padding: 0; } .invoice-card { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div class="brand">
        <h1>PAYSHIELDX TECHNOLOGIES PVT LTD</h1>
        <p>RBI Nodal Escrow Infrastructure & Trade Protection Platform</p>
        <p>Connaught Place, New Delhi 110001 • GSTIN: <strong>07AAACP9988A1Z2</strong></p>
        <p>Support: support@payshieldx.in • PAN: AAACP9988A</p>
      </div>
      <div class="invoice-meta">
        <h2>TAX INVOICE</h2>
        <p><strong>Invoice No:</strong> ${data.invoiceNumber}</p>
        <p><strong>Date of Issue:</strong> ${data.date}</p>
        <p><strong>Ref / Sub ID:</strong> ${data.subscriptionRef}</p>
        <p><strong>Place of Supply:</strong> ${data.customerCity || "India"}</p>
      </div>
    </div>

    <div class="grid">
      <div class="box">
        <strong>BILLED TO (CUSTOMER):</strong>
        <div><strong>${data.customerName || "Verified Business Entity"}</strong></div>
        <div>GSTIN: <strong>${data.customerGst || "07AAAAA1111A1ZA"}</strong></div>
        <div>Email: ${data.customerEmail}</div>
        <div>Mobile: ${data.customerPhone}</div>
        <div>City/State: ${data.customerCity || "New Delhi, India"}</div>
      </div>
      <div class="box">
        <strong>PAYMENT & ESCROW PARTICULARS:</strong>
        <div>Payment Status: <strong>PAID / AUTHORIZED</strong></div>
        <div>Payment Mode: <strong>RBI Nodal Escrow / Digital Gate</strong></div>
        <div>Transaction Nature: <strong>B2B Trade Protection Membership</strong></div>
        <div>ITC Eligibility: <strong>YES (100% Tax Deductible)</strong></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Sr.</th>
          <th>Description of Services</th>
          <th>SAC Code</th>
          <th>Frequency</th>
          <th class="text-right">Taxable Value (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>
            <strong>${data.planName}</strong>
            <div style="color:#64748b; font-size:11px; margin-top:2px;">
              Trade Protection Escrow Gateway, Dual-Approval Agreement System, and Neutral Legal Arbitration Access.
            </div>
          </td>
          <td>998439</td>
          <td style="text-transform: capitalize;">${data.billingCycle}</td>
          <td class="text-right">₹${data.basePrice.toLocaleString("en-IN")}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Taxable Amount:</span>
        <span>₹${data.basePrice.toLocaleString("en-IN")}</span>
      </div>
      ${
        isInterstate
          ? `
      <div class="totals-row">
        <span>Integrated GST (IGST @ 18%):</span>
        <span>₹${igstAmount.toLocaleString("en-IN")}</span>
      </div>`
          : `
      <div class="totals-row">
        <span>Central GST (CGST @ 9%):</span>
        <span>₹${cgstAmount.toLocaleString("en-IN")}</span>
      </div>
      <div class="totals-row">
        <span>State GST (SGST @ 9%):</span>
        <span>₹${sgstAmount.toLocaleString("en-IN")}</span>
      </div>`
      }
      <div class="totals-row grand">
        <span>TOTAL INVOICE VALUE:</span>
        <span>₹${data.totalAmount.toLocaleString("en-IN")}</span>
      </div>
    </div>

    <div class="footer">
      <p>This is a computer-generated Tax Invoice issued in accordance with Section 31 of the CGST Act, 2017. No physical signature required.</p>
      <p>PayShieldX Technologies Pvt Ltd • Escrow Nodal Accounts Monitored Under RBI/DPSS/2019-20/174 Guidelines.</p>
    </div>

    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    };
  </script>
</body>
</html>
`;

  const blob = new Blob([invoiceHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");
  if (!printWindow) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${data.invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
