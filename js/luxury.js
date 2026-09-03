// Novello's editorial layer: curated surface sequencing, an accessible
// section navigator, and small structural refinements shared by every page.
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;
    var page = body.getAttribute('data-page') || 'page';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('body > header, body > section')
    );

    if (!sections.length) return;

    addSkipLink(sections[0]);
    sequenceSurfaces(sections, page);
    addSectionKickers(sections);
    if (!reduceMotion) addPageRail(sections);
    body.classList.add('luxe-ready');
  });

  function addSkipLink(firstSection) {
    if (!firstSection.id) firstSection.id = 'main-content';
    var skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#' + firstSection.id;
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  function sequenceSurfaces(sections, page) {
    var seeds = {
      home: 0,
      services: 2,
      maintenance: 3,
      about: 1,
      'our-story': 4,
      contact: 5,
      'history-of-stone': 0,
      'explore-materials': 5,
      marble: 1,
      'engineered-stone': 3,
      porcelain: 4,
      quartzite: 2
    };
    var seed = seeds[page] || 0;

    sections.forEach(function (section, index) {
      if (section.classList.contains('hero')) return;
      var surface = ((seed + index) % 6) + 1;
      section.classList.add('luxe-surface');
      section.setAttribute('data-luxe-surface', String(surface));
    });
  }

  function addSectionKickers(sections) {
    sections.forEach(function (section, index) {
      if (section.classList.contains('hero')) return;
      var label = sectionLabel(section, index);
      var kicker = document.createElement('span');
      kicker.className = 'luxe-section-kicker';
      kicker.setAttribute('aria-hidden', 'true');
      kicker.textContent = pad(index + 1) + ' / ' + label;
      section.appendChild(kicker);
    });
  }

  function addPageRail(sections) {
    if (sections.length < 3) return;

    var rail = document.createElement('nav');
    rail.className = 'page-rail';
    rail.setAttribute('aria-label', 'On this page');

    var buttons = sections.map(function (section, index) {
      if (!section.id) section.id = 'section-' + (index + 1);
      var label = sectionLabel(section, index);
      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Go to ' + label);
      button.innerHTML = '<span class="page-rail-label">' + escapeHtml(label) + '</span>';
      button.addEventListener('click', function () {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      rail.appendChild(button);
      return button;
    });

    document.body.appendChild(rail);

    if (!('IntersectionObserver' in window)) {
      buttons[0].classList.add('is-active');
      buttons[0].setAttribute('aria-current', 'true');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (!visible.length) return;
      var activeIndex = sections.indexOf(visible[0].target);
      buttons.forEach(function (button, index) {
        var active = index === activeIndex;
        button.classList.toggle('is-active', active);
        if (active) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
    }, { rootMargin: '-24% 0px -48% 0px', threshold: [0, 0.15, 0.4, 0.7] });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function sectionLabel(section, index) {
    var source = section.querySelector('.eyebrow, h1, h2, h3');
    var text = source ? source.textContent.trim() : 'Section ' + (index + 1);
    text = text.replace(/\s+/g, ' ');
    return text.length > 42 ? text.slice(0, 39) + '…' : text;
  }

  function pad(number) {
    return number < 10 ? '0' + number : String(number);
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
