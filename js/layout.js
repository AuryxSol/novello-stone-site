// Shared nav + footer, injected on every page so they stay identical
// without needing a build step. `data-page` on <body> sets active nav link.

// Load the approved chrome-beam rendering layer and controller once on
// every page. Keeping both in shared layout avoids page-by-page drift.
if (!document.querySelector('link[href="css/chrome-beam.css"]')) {
  const chromeBeamStyles = document.createElement('link');
  chromeBeamStyles.rel = 'stylesheet';
  chromeBeamStyles.href = 'css/chrome-beam.css';
  document.head.appendChild(chromeBeamStyles);
}

if (!document.querySelector('script[src="js/shimmer.js"]')) {
  const shimmerScript = document.createElement('script');
  shimmerScript.src = 'js/shimmer.js';
  document.head.appendChild(shimmerScript);
}

document.addEventListener('DOMContentLoaded', () => {
  const activePage = document.body.getAttribute('data-page') || '';
  const materialPages = ['history-of-stone', 'marble', 'engineered-stone', 'porcelain', 'quartzite'];
  const materialsActive = materialPages.includes(activePage);

  const navHTML = `
    <nav class="site-nav">
      <div class="container">
        <a href="index.html" class="brand"><span class="brand-mark-wrap"><img src="img/novello-n-monogram.png" alt="" class="brand-mark"><span class="brand-mark-reflection" aria-hidden="true"></span></span>NOVELLO <span>STONE</span></a>
        <ul class="nav-links">
          <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
          <li class="nav-dropdown">
            <a href="history-of-stone.html" class="${materialsActive ? 'active' : ''}">Materials</a>
            <div class="nav-dropdown-menu">
              <a href="history-of-stone.html" class="${activePage === 'history-of-stone' ? 'active' : ''}">History of Stone</a>
              <a href="marble.html" class="${activePage === 'marble' ? 'active' : ''}">Marble</a>
              <a href="engineered-stone.html" class="${activePage === 'engineered-stone' ? 'active' : ''}">Engineered Stone</a>
              <a href="porcelain.html" class="${activePage === 'porcelain' ? 'active' : ''}">Large-Format Porcelain</a>
              <a href="quartzite.html" class="${activePage === 'quartzite' ? 'active' : ''}">Quartzite</a>
            </div>
          </li>
          <li><a href="our-story.html" class="${activePage === 'our-story' ? 'active' : ''}">Our Story</a></li>
          <li><a href="contact.html" class="${activePage === 'contact' ? 'active' : ''}">Contact</a></li>
        </ul>
        <a href="contact.html" class="nav-cta"><span class="chrome-button-label">Request a Quote</span></a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu">
      <a href="index.html">Home</a>
      <a href="history-of-stone.html">History of Stone</a>
      <a href="marble.html">Marble</a>
      <a href="engineered-stone.html">Engineered Stone</a>
      <a href="porcelain.html">Large-Format Porcelain</a>
      <a href="quartzite.html">Quartzite</a>
      <a href="our-story.html">Our Story</a>
      <a href="contact.html">Contact</a>
      <a href="contact.html" class="mobile-menu-cta">Request a Quote &rarr;</a>
    </div>
  `;

  const footerHTML = `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div>
            <h4>Novello Stone</h4>
            <div class="brand-divider"><span class="diamond"></span></div>
            <p style="opacity:0.7; max-width: 320px;">Stone fabrication, tiling, and restoration across the Garden Route corridor &mdash; Mossel Bay to Plettenberg Bay.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="mailto:studio@novello.co.za">studio@novello.co.za</a>
            <a href="tel:+27834792643">+27 83 479 2643</a>
            <a href="mailto:clynton@novello.co.za" style="font-size:0.85rem; opacity:0.75;">Clynton: clynton@novello.co.za</a>
            <a href="mailto:yolande@novello.co.za" style="font-size:0.85rem; opacity:0.75;">Yolande: yolande@novello.co.za</a>
            <p style="opacity:0.7;">Mossel Bay, Western Cape</p>
            <div class="footer-social">
              <a href="https://www.facebook.com/profile.php?id=61593128592987" target="_blank" rel="noopener noreferrer" aria-label="Novello Stone on Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/novello-stone/" target="_blank" rel="noopener noreferrer" aria-label="Novello Stone on LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4>Site</h4>
            <a href="history-of-stone.html">History of Stone</a>
            <a href="marble.html">Marble</a>
            <a href="engineered-stone.html">Engineered Stone</a>
            <a href="porcelain.html">Large-Format Porcelain</a>
            <a href="quartzite.html">Quartzite</a>
            <a href="our-story.html">Our Story</a>
            <a href="contact.html">Contact</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 Novello Stone (Pty) Ltd. Reg. No. 2026/586662/07. All rights reserved.</span>
          <span>Garden Route &mdash; Mossel Bay to Plettenberg Bay</span>
        </div>
      </div>
    </footer>
  `;

  const navMount = document.getElementById('nav-mount');
  const footerMount = document.getElementById('footer-mount');
  if (navMount) navMount.outerHTML = navHTML;
  if (footerMount) footerMount.outerHTML = footerHTML;

  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
});
