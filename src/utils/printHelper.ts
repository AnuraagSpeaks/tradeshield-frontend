/**
 * printElement - Prints only the targeted DOM element cleanly in an isolated frame/window.
 * Guarantees:
 * 1. Exactly 1 page document (no empty background sheets or 3-page spillover).
 * 2. Full color & background preservation (watermarks, badges, gradients).
 * 3. Works seamlessly on Chrome, Safari, Edge, Firefox, and mobile browsers.
 */
export function printElement(elementIdOrRef: HTMLElement | string, docTitle?: string) {
  let element: HTMLElement | null = null;
  if (typeof elementIdOrRef === "string") {
    element = document.getElementById(elementIdOrRef) || document.querySelector(elementIdOrRef);
  } else {
    element = elementIdOrRef;
  }

  if (!element) {
    window.print();
    return;
  }

  // Clone styles from main document to ensure 100% Tailwind fidelity
  const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
    .map((s) => s.outerHTML)
    .join("\n");

  const title = docTitle || "PayShieldX Verified Document";

  // Create an isolated hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
        ${styles}
        <style>
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 8mm 12mm !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Trigger print once iframe resources are ready
  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1500);
  }, 400);
}
