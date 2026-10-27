// ===========================================================
// NOVELLO STONE — Pre-launch announcement card
// TEMPORARY: delete this file, launch-banner.css, and the two
// tags referencing them from every page once trading has begun.
// Shows once per browser session (sessionStorage), dismissible,
// never blocks the page — no overlay, no scroll lock.
// ===========================================================
(function () {
  var DISMISS_KEY = 'novello-launch-card-dismissed';

  document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return;

    var card = document.createElement('div');
    card.className = 'launch-card';
    card.setAttribute('role', 'note');
    card.setAttribute('aria-label', 'Launch announcement');
    card.innerHTML =
      '<button type="button" class="launch-card-close" aria-label="Dismiss" style="z-index: 2">&times;</button>' +
      '<span class="launch-card-eyebrow">Enquiries open now</span>' +
      '<p>Soft launch from <strong>2 November 2026</strong>, with our full launch planned for ' +
      '<strong>January&ndash;February 2027</strong>. Contact us to discuss your project and confirm availability.</p>' +
      '<a href="contact.html" class="launch-card-cta">Get in touch</a>';

    var openingPanel = document.querySelector('.hero, .page-header, .material-hero, .contact-section, .about-intro');
    if (openingPanel) openingPanel.insertAdjacentElement('afterend', card);
    else document.body.appendChild(card);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { card.classList.add('is-visible'); });
    });

    card.querySelector('.launch-card-close').addEventListener('click', function () {
      card.classList.remove('is-visible');
      sessionStorage.setItem(DISMISS_KEY, '1');
      setTimeout(function () { card.remove(); }, 500);
    });
  });
})();

