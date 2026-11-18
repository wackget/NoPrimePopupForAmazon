// ==UserScript==
// @name         No Prime Popup for Amazon
// @namespace    https://kodba.eu/no-prime-popup
// @version      1.1.0
// @description  Hides the Amazon Prime signup popup on Amazon storefronts.
// @author       Ingo Kodba (userscript port)
// @license      MIT
// @homepageURL  https://github.com/<user>/<repo>
// @updateURL    https://raw.githubusercontent.com/<user>/<repo>/main/no-prime-popup.user.js
// @downloadURL  https://raw.githubusercontent.com/<user>/<repo>/main/no-prime-popup.user.js
// @run-at       document-start
// @noframes
// @grant        none
// @match        *://*.amazon.com/*
// @match        *://amazon.com/*
// @match        *://*.amazon.ca/*
// @match        *://amazon.ca/*
// @match        *://*.amazon.com.mx/*
// @match        *://amazon.com.mx/*
// @match        *://*.amazon.com.br/*
// @match        *://amazon.com.br/*
// @match        *://*.amazon.co.uk/*
// @match        *://amazon.co.uk/*
// @match        *://*.amazon.de/*
// @match        *://amazon.de/*
// @match        *://*.amazon.fr/*
// @match        *://amazon.fr/*
// @match        *://*.amazon.it/*
// @match        *://amazon.it/*
// @match        *://*.amazon.es/*
// @match        *://amazon.es/*
// @match        *://*.amazon.nl/*
// @match        *://amazon.nl/*
// @match        *://*.amazon.se/*
// @match        *://amazon.se/*
// @match        *://*.amazon.pl/*
// @match        *://amazon.pl/*
// @match        *://*.amazon.com.be/*
// @match        *://amazon.com.be/*
// @match        *://*.amazon.com.tr/*
// @match        *://amazon.com.tr/*
// @match        *://*.amazon.ie/*
// @match        *://amazon.ie/*
// @match        *://*.amazon.ae/*
// @match        *://amazon.ae/*
// @match        *://*.amazon.sa/*
// @match        *://amazon.sa/*
// @match        *://*.amazon.eg/*
// @match        *://amazon.eg/*
// @match        *://*.amazon.in/*
// @match        *://amazon.in/*
// @match        *://*.amazon.co.jp/*
// @match        *://amazon.co.jp/*
// @match        *://*.amazon.sg/*
// @match        *://amazon.sg/*
// @match        *://*.amazon.com.au/*
// @match        *://amazon.com.au/*
// ==/UserScript==

(() => {
  const SELECTOR = '[aria-label="Prime Signup Dialog"]';

  const BLOCK_CSS = `
/* The Prime signup dialog and the scroller that wraps it */
.a-popover-modal[aria-label="Prime Signup Dialog"],
.a-modal-scroller:has(#WLPAssemblerTarget),
.a-modal-scroller:has([aria-label="Prime Signup Dialog"]) {
  display: none !important;
}

/* The dimmed backdrop, only while the Prime dialog is in the page */
body:has([aria-label="Prime Signup Dialog"]) .a-popover-lgtbox {
  display: none !important;
}

/* Undo the scroll lock the modal puts on the page */
html:has([aria-label="Prime Signup Dialog"]),
body:has([aria-label="Prime Signup Dialog"]) {
  overflow: auto !important;
}
`;

  // The CSS already hides the dialog; this closes it properly through Amazon's own
  // close button so the page's modal state (focus trap, scroll lock) is released.
  function closeDialog() {
    const dialog = document.querySelector(SELECTOR);
    if (!dialog || dialog.getAttribute("aria-hidden") === "true") return;
    const closeBtn = dialog.querySelector('[data-action="a-popover-close"]');
    if (closeBtn) closeBtn.click();
  }

  const observer = new MutationObserver(closeDialog);
  const start = () => {
    const style = document.createElement("style");
    style.textContent = BLOCK_CSS;
    document.documentElement.appendChild(style);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    closeDialog();
  };
  if (document.documentElement) start();
  else document.addEventListener("readystatechange", start, { once: true });

  // The page's click handlers may attach after the dialog appears; retry for a while.
  let tries = 0;
  const timer = setInterval(() => {
    closeDialog();
    if (++tries > 30) clearInterval(timer);
  }, 500);
})();
