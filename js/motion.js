// ===========================================================
// NOVELLO STONE — Motion layer
// Progressive enhancement only: every effect here degrades to
// "content just shows up" if JS fails, IntersectionObserver is
// missing, or the visitor has prefers-reduced-motion set.
// Runs after layout.js (nav/footer are already mounted).
// ===========================================================
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Every navigation — link click, back button, forward button — should land
  // at the top of the new page. Set as early as possible, before the browser
  // gets a chance to restore a remembered scroll position on back/forward.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.addEventListener('pageshow', function () {
    window.scrollTo(0, 0);
  });

  document.addEventListener('DOMContentLoaded', function () {
    window.scrollTo(0, 0);
    initScrollProgress();
    initNavScroll();
    initStaggerGroups();
    initCascadeText();
    initScrollReveal();
    initHeroParallax();
    initHeroVideo();
    initCounters();
    initTilt('.pillar-card, .value-card, .scenario-card');
    initFaqAnimations();
  });

  // --- Thin progress bar tied to page scroll ---
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', throttleRAF(update), { passive: true });
    update();
  }

  // --- Nav: stays fixed and visible at all times (never hides on scroll);
  // just darkens and gains a shadow once the page has scrolled a little,
  // so it reads clearly against whatever content sits behind it. ---
  function initNavScroll() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    function update() {
      nav.classList.toggle('nav-scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', throttleRAF(update), { passive: true });
    update();
  }

  // --- Assign a --i index to each child of a stagger group ---
  function initStaggerGroups() {
    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (item, i) {
        item.style.setProperty('--i', i);
        item.classList.add('reveal-item');
      });
    });
  }

  // --- Split headings marked data-cascade into per-word spans ---
  function initCascadeText() {
    document.querySelectorAll('[data-cascade]').forEach(function (el) {
      var counter = { n: 0 };
      wrapWords(el, counter);
    });
  }
  function wrapWords(node, counter) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (part.trim() === '') {
            frag.appendChild(document.createTextNode(part));
          } else {
            var span = document.createElement('span');
            span.className = 'cascade-word';
            span.style.setProperty('--i', counter.n++);
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        wrapWords(child, counter);
      }
    });
  }

  // --- IntersectionObserver-driven reveal for [data-reveal] and .reveal-item ---
  function initScrollReveal() {
    var targets = document.querySelectorAll('[data-reveal], .reveal-item, [data-cascade]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // --- Hero background video: pause for reduced-motion visitors ---
  function initHeroVideo() {
    var video = document.querySelector('.hero-video');
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      video.removeAttribute('autoplay');
    }
  }

  // --- Subtle parallax drift on the hero photo layer only ---
  function initHeroParallax() {
    if (reduceMotion) return;
    var layer = document.querySelector('.hero-photo-rotator');
    if (!layer) return;
    function update() {
      var offset = Math.min(window.scrollY * 0.18, 90);
      layer.style.transform = 'translateY(' + offset + 'px)';
    }
    window.addEventListener('scroll', throttleRAF(update), { passive: true });
    update();
  }

  // --- Count-up animation for [data-counter] stat numbers ---
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) return;
    counters.forEach(function (el) {
      el.textContent = '0' + (el.dataset.suffix || '');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }
  function animateCount(el) {
    var target = parseInt(el.dataset.counter, 10) || 0;
    var suffix = el.dataset.suffix || '';
    var duration = 1100;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // --- Gentle pointer tilt + spotlight on card grids (skips touch devices) ---
  function initTilt(selector) {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    var cards = document.querySelectorAll(selector);
    cards.forEach(function (card) {
      card.classList.add('tilt-card');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rx = (0.5 - y) * 5;
        var ry = (x - 0.5) * 7;
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
        card.style.setProperty('--spot-x', (x * 100) + '%');
        card.style.setProperty('--spot-y', (y * 100) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  // --- Smooth open/close for the FAQ <details> accordion ---
  function initFaqAnimations() {
    if (!('animate' in HTMLElement.prototype)) return; // native fallback if unsupported
    document.querySelectorAll('.faq-item').forEach(function (details) {
      var summary = details.querySelector('summary');
      var body = details.querySelector('p');
      if (!summary || !body) return;
      var animation = null;
      var isClosing = false;
      var isExpanding = false;

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        details.style.overflow = 'hidden';
        if (reduceMotion) {
          details.open = !details.open;
          return;
        }
        if (isClosing || !details.open) {
          openFaq();
        } else if (isExpanding || details.open) {
          shrinkFaq();
        }
      });

      function shrinkFaq() {
        isClosing = true;
        var startHeight = details.offsetHeight + 'px';
        var endHeight = summary.offsetHeight + 'px';
        if (animation) animation.cancel();
        animation = details.animate(
          { height: [startHeight, endHeight] },
          { duration: 280, easing: 'cubic-bezier(.16,.84,.44,1)' }
        );
        animation.onfinish = function () { onFinish(false); };
        animation.oncancel = function () { isClosing = false; };
      }

      function openFaq() {
        details.style.height = details.offsetHeight + 'px';
        details.open = true;
        requestAnimationFrame(function () { expandFaq(); });
      }

      function expandFaq() {
        isExpanding = true;
        var startHeight = details.offsetHeight + 'px';
        var endHeight = (summary.offsetHeight + body.offsetHeight) + 'px';
        if (animation) animation.cancel();
        animation = details.animate(
          { height: [startHeight, endHeight] },
          { duration: 280, easing: 'cubic-bezier(.16,.84,.44,1)' }
        );
        animation.onfinish = function () { onFinish(true); };
        animation.oncancel = function () { isExpanding = false; };
      }

      function onFinish(open) {
        details.open = open;
        animation = null;
        isClosing = false;
        isExpanding = false;
        details.style.height = '';
        details.style.overflow = '';
      }
    });
  }

  // --- rAF-throttled scroll handler helper ---
  function throttleRAF(fn) {
    var ticking = false;
    return function () {
      if (!ticking) {
        requestAnimationFrame(function () { fn(); ticking = false; });
        ticking = true;
      }
    };
  }
})();
