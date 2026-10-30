/**
 * Utility for official Govt of India GST Taxpayer Verification (GSTN / services.gst.gov.in)
 */

export const OFFICIAL_GST_PORTAL_URL = "https://services.gst.gov.in/services/searchtp";

/**
 * Copies the GSTIN to the user's clipboard and opens the official GST Taxpayer search portal in a new tab.
 */
export function openOfficialGSTPortal(gstin?: string): { success: boolean; message: string; copiedGstin: string } {
  const cleanGst = (gstin || "").trim().toUpperCase();

  if (cleanGst) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cleanGst).catch(() => {
          fallbackCopyText(cleanGst);
        });
      } else {
        fallbackCopyText(cleanGst);
      }
    } catch {
      fallbackCopyText(cleanGst);
    }
  }

  // Open the official Government of India GST Search Taxpayer page
  window.open(OFFICIAL_GST_PORTAL_URL, "_blank", "noopener,noreferrer");

  if (cleanGst) {
    return {
      success: true,
      message: `Copied ${cleanGst} to clipboard! Paste (Ctrl+V / Cmd+V) & enter captcha on the GST portal.`,
      copiedGstin: cleanGst,
    };
  }

  return {
    success: true,
    message: "Opening official GST Taxpayer Search portal...",
    copiedGstin: "",
  };
}

function fallbackCopyText(text: string) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  } catch {
    // Ignore fallback errors
  }
}
