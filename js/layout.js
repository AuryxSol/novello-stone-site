// Shared nav + footer, injected on every page so they stay identical
// without needing a build step. `data-page` on <body> sets active nav link.

// The approved bronze-gold material system is loaded once here so every public
// page shares the exact same swatch, bevel, button finish and light source.
const APPROVED_MATERIAL_VERSION = '20260903-approved-material-v7-22deg';

if (!document.querySelector('link[data-approved-material]')) {
  const materialStyles = document.createElement('link');
  materialStyles.rel = 'stylesheet';
  materialStyles.href = `css/approved-material.css?v=${APPROVED_MATERIAL_VERSION}`;
  materialStyles.setAttribute('data-approved-material', '');
  document.head.appendChild(materialStyles);
}

document.addEventListener('DOMContentLoaded', () => {
  const activePage = document.body.getAttribute('data-page') || '';
  const originPages = ['history-of-stone', 'marble', 'engineered-stone', 'porcelain', 'quartzite'];
  const originActive = originPages.includes(activePage);

  const navHTML = `
    <nav class="site-nav" aria-label="Primary navigation">
      <div class="container">
        <a href="index.html" class="brand" aria-label="Novello Stone"><span class="brand-mark-wrap" aria-hidden="true"><img src="img/novello-n-monogram-official-brand-gold-web-v4.png" alt="" class="brand-mark" fetchpriority="high"></span><span class="brand-wordmark" aria-hidden="true">Novello Stone</span></a>
        <ul class="nav-links">
          <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
          <li class="nav-dropdown">
            <a href="history-of-stone.html" class="${originActive ? 'active' : ''}">Origin of Materials</a>
            <div class="nav-dropdown-menu">
              <a href="history-of-stone.html#marble" class="${activePage === 'marble' ? 'active' : ''}">Marble</a>
              <a href="history-of-stone.html#granite">Granite</a>
              <a href="history-of-stone.html#quartzite" class="${activePage === 'quartzite' ? 'active' : ''}">Quartzite</a>
              <a href="history-of-stone.html#onyx">Onyx</a>
              <a href="history-of-stone.html#limestone">Limestone</a>
              <a href="history-of-stone.html#travertine">Travertine</a>
              <a href="history-of-stone.html#engineered" class="${activePage === 'engineered-stone' ? 'active' : ''}">Engineered Stone</a>
              <a href="history-of-stone.html#porcelain" class="${activePage === 'porcelain' ? 'active' : ''}">Large-Format Porcelain</a>
              <a href="history-of-stone.html#terrazzo">Terrazzo</a>
            </div>
          </li>
          <li><a href="explore-materials.html" class="${activePage === 'explore-materials' ? 'active' : ''}">Explore Materials</a></li>
          <li><a href="services.html" class="${activePage === 'services' || activePage === 'maintenance' ? 'active' : ''}">Services</a></li>
          <li><a href="our-story.html" class="${activePage === 'our-story' ? 'active' : ''}">Our Story</a></li>
          <li><a href="contact.html" class="${activePage === 'contact' ? 'active' : ''}">Contact</a></li>
        </ul>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      <a href="index.html">Home</a>
      <a href="history-of-stone.html">Origin of Materials</a>
      <a href="explore-materials.html">Explore Materials</a>
      <a href="history-of-stone.html#marble" class="mobile-material-link">Marble</a>
      <a href="history-of-stone.html#granite" class="mobile-material-link">Granite</a>
      <a href="history-of-stone.html#quartzite" class="mobile-material-link">Quartzite</a>
      <a href="history-of-stone.html#onyx" class="mobile-material-link">Onyx</a>
      <a href="history-of-stone.html#limestone" class="mobile-material-link">Limestone</a>
      <a href="history-of-stone.html#travertine" class="mobile-material-link">Travertine</a>
      <a href="history-of-stone.html#engineered" class="mobile-material-link">Engineered Stone</a>
      <a href="history-of-stone.html#porcelain" class="mobile-material-link">Large-Format Porcelain</a>
      <a href="history-of-stone.html#terrazzo" class="mobile-material-link">Terrazzo</a>
      <a href="services.html">Services</a>
      <a href="maintenance.html">Maintenance</a>
      <a href="our-story.html">Our Story</a>
      <a href="contact.html">Contact</a>
      <a href="contact.html" class="mobile-menu-cta">Request a Quote &rarr;</a>
    </div>
    <div class="site-scroll-cue" aria-hidden="true">
      <span class="site-scroll-cue__label" data-approved-metal-text>Scroll to explore</span>
      <span class="site-scroll-cue__stem" data-approved-metal-line>
        <span class="site-scroll-cue__diamond" data-approved-metal-line></span>
      </span>
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
            <div class="footer-site-links">
              <a href="history-of-stone.html">Origin of Materials</a>
              <a href="explore-materials.html">Explore Materials</a>
              <a href="services.html">Services</a>
              <a href="maintenance.html">Maintenance</a>
              <a href="our-story.html">Our Story</a>
              <a href="contact.html">Contact</a>
            </div>
            <span class="footer-links-label">Materials</span>
            <div class="footer-material-links">
              <a href="history-of-stone.html#marble">Marble</a>
              <a href="history-of-stone.html#granite">Granite</a>
              <a href="history-of-stone.html#quartzite">Quartzite</a>
              <a href="history-of-stone.html#onyx">Onyx</a>
              <a href="history-of-stone.html#limestone">Limestone</a>
              <a href="history-of-stone.html#travertine">Travertine</a>
              <a href="history-of-stone.html#engineered">Engineered</a>
              <a href="history-of-stone.html#porcelain">Porcelain</a>
              <a href="history-of-stone.html#terrazzo">Terrazzo</a>
            </div>
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

  const scrollCue = document.querySelector('.site-scroll-cue');
  if (scrollCue) {
    let cueDismissed = window.scrollY > 8 || Boolean(window.location.hash);

    const syncScrollCue = () => {
      const pageCanScroll = document.documentElement.scrollHeight > window.innerHeight + 80;
      scrollCue.classList.toggle('is-visible', pageCanScroll && !cueDismissed);
    };

    const dismissScrollCue = () => {
      if (cueDismissed) return;
      cueDismissed = true;
      scrollCue.classList.remove('is-visible');
      window.removeEventListener('scroll', dismissScrollCue);
    };

    window.addEventListener('scroll', dismissScrollCue, { passive: true });
    window.addEventListener('resize', syncScrollCue, { passive: true });
    window.addEventListener('load', syncScrollCue, { once: true });
    requestAnimationFrame(syncScrollCue);
  }

  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    const setMenuState = (isOpen) => {
      mobileMenu.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => {
      setMenuState(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      setMenuState(false);
    }));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
        setMenuState(false);
        toggle.focus();
      }
    });

    const desktopNavigation = window.matchMedia('(min-width: 961px)');
    const closeMenuAtDesktop = event => {
      if (event.matches) setMenuState(false);
    };
    if (desktopNavigation.addEventListener) {
      desktopNavigation.addEventListener('change', closeMenuAtDesktop);
    } else {
      desktopNavigation.addListener(closeMenuAtDesktop);
    }
  }

  if (!document.querySelector('script[data-approved-material-beam]')) {
    const materialBeam = document.createElement('script');
    materialBeam.src = `js/approved-material-beam.js?v=${APPROVED_MATERIAL_VERSION}`;
    materialBeam.setAttribute('data-approved-material-beam', '');
    document.body.appendChild(materialBeam);
  }
});
