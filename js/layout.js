// Shared nav + footer, injected on every page so they stay identical
// without needing a build step. `data-page` on <body> sets active nav link.

document.addEventListener('DOMContentLoaded', () => {
  const activePage = document.body.getAttribute('data-page') || '';

  const navHTML = `
    <nav class="site-nav">
      <div class="container">
        <a href="index.html" class="brand"><img src="img/n-mark-favicon.svg" alt="" class="brand-mark">NOVELLO <span>STONE</span></a>
        <ul class="nav-links">
          <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="services.html" class="${activePage === 'services' ? 'active' : ''}">Services</a></li>
          <li><a href="about.html" class="${activePage === 'about' ? 'active' : ''}">About</a></li>
          <li><a href="contact.html" class="${activePage === 'contact' ? 'active' : ''}">Contact</a></li>
        </ul>
        <a href="contact.html" class="nav-cta">Request a Quote</a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu">
      <a href="index.html">Home</a>
      <a href="services.html">Services</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <a href="contact.html" style="color:#B5472B;">Request a Quote &rarr;</a>
    </div>
  `;

  const footerHTML = `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div>
            <h4>Novello Stone</h4>
            <p style="opacity:0.7; max-width: 320px;">Stone fabrication, tiling, and restoration across the Garden Route corridor &mdash; Mossel Bay to George.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="mailto:studio@novello.co.za">studio@novello.co.za</a>
            <a href="tel:+27834792643">+27 83 479 2643</a>
            <p style="opacity:0.7;">Mossel Bay, Western Cape</p>
          </div>
          <div>
            <h4>Site</h4>
            <a href="services.html">Services</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 Novello Stone (Pty) Ltd. All rights reserved.</span>
          <span>Garden Route &mdash; Hartenbos to George</span>
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
