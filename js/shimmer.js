/* ===========================================================
   NOVELLO STONE — Single bronze-gold chrome beam
   ===========================================================
   One invisible 15-degree light axis moves left-to-right through the
   whole document. Its top edge leads and its lower edge arrives later,
   so bronze details do not all illuminate at once. CSS clips the beam
   to approved bronze-gold glyphs, masks, fills and strokes only.
   =========================================================== */

(function () {
  'use strict';

  if (window.__novelloChromeBeamInitialized) return;
  window.__novelloChromeBeamInitialized = true;

  var SELECTORS = [
    '.brand',
    '.brand-mark-wrap',
    '.hero h1 em',
    '.btn-primary',
    '.btn-primary .chrome-button-label',
    '.btn-ghost-dark',
    '.btn-ghost',
    '.nav-cta',
    '.nav-cta .chrome-button-label',
    '.eyebrow',
    '.nav-links a',
    '.nav-dropdown-menu a',
    '.mobile-menu-cta',
    '.hero-stats .stat-value',
    '.pillar-link',
    '.step-mono',
    '.brand-divider',
    '.brand-divider .diamond',
    '.gold-divider',
    '.faq-item summary',
    '.material-es-card .mono',
    '.material-link-card .mono',
    '.contact-detail .mono-label',
    '.contact-detail a',
    '.contact-person .mono-label',
    '.contact-person a',
    '.vcard-link',
    '.footer-grid a',
    '.footer-social a',
    '.launch-card',
    '.launch-card-eyebrow',
    '.launch-card p strong',
    '.launch-card a.launch-card-cta'
  ];

  var MOBILE_BREAKPOINT = 860;
  var VIEWPORT_CROSS_MS = 1500;
  var ANGLE_FROM_VERTICAL_DEG = 15;
  var VERTICAL_LAG_PER_PX = Math.tan(ANGLE_FROM_VERTICAL_DEG * Math.PI / 180);
  var DESKTOP_TRAVEL_PADDING_PX = 170;
  var MOBILE_TRAVEL_PADDING_PX = 110;
  var EDGE_FADE_PX = 15;
  var INITIAL_DELAY_MS = 750;
  var PAUSE_MS = 6500;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var elements = [];
  var frameState = [];
  var rafId = null;
  var cycleStart = null;
  var tabHidden = document.hidden;
  var travelPaddingPx = DESKTOP_TRAVEL_PADDING_PX;
  var sweepDurationMs = VIEWPORT_CROSS_MS;
  var cycleMs = sweepDurationMs + PAUSE_MS;
  var travelDistancePx = 0;
  var refreshTimer = null;

  function viewportWidth() {
    return document.documentElement.clientWidth || window.innerWidth;
  }

  function documentHeight() {
    return Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    );
  }

  function refreshGeometry() {
    var width = viewportWidth();
    var height = documentHeight();
    travelPaddingPx = width <= MOBILE_BREAKPOINT
      ? MOBILE_TRAVEL_PADDING_PX
      : DESKTOP_TRAVEL_PADDING_PX;

    var pixelsPerSecond = width / (VIEWPORT_CROSS_MS / 1000);
    travelDistancePx = width + travelPaddingPx * 2 + height * VERTICAL_LAG_PER_PX;
    sweepDurationMs = (travelDistancePx / pixelsPerSecond) * 1000;
    cycleMs = sweepDurationMs + PAUSE_MS;
  }

  function collectElements() {
    var found = [];
    var seen = new Set();

    for (var i = 0; i < SELECTORS.length; i++) {
      var matches = document.querySelectorAll(SELECTORS[i]);
      for (var j = 0; j < matches.length; j++) {
        if (seen.has(matches[j])) continue;
        seen.add(matches[j]);
        matches[j].setAttribute('data-bronze-shimmer', '');
        found.push(matches[j]);
      }
    }

    elements = found;
    frameState = new Array(elements.length);
    refreshGeometry();
  }

  function setAllStatic() {
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.setProperty('--shimmer-x', '-999px');
      elements[i].style.setProperty('--shimmer-strength', '0');
    }
  }

  function frame(now) {
    if (tabHidden || reduceMotionQuery.matches) {
      rafId = null;
      return;
    }

    if (cycleStart === null) cycleStart = now + INITIAL_DELAY_MS;
    var elapsed = now - cycleStart;

    if (elapsed < 0) {
      rafId = requestAnimationFrame(frame);
      return;
    }

    var cyclePosition = elapsed % cycleMs;
    var beamTopX = viewportWidth() + travelPaddingPx * 10;
    var active = cyclePosition <= sweepDurationMs;

    if (active) {
      var progress = cyclePosition / sweepDurationMs;
      beamTopX = -travelPaddingPx + progress * travelDistancePx;
    }

    var scrollY = window.scrollY || window.pageYOffset || 0;

    /* Read every layout value first, then perform all style writes. */
    for (var i = 0; i < elements.length; i++) {
      var rect = elements[i].getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        frameState[i] = null;
        continue;
      }

      var targetPageY = rect.top + scrollY + rect.height / 2;
      var beamAtTargetY = beamTopX - targetPageY * VERTICAL_LAG_PER_PX;
      var localX = beamAtTargetY - rect.left;
      var outsideDistance = 0;

      if (localX < 0) outsideDistance = -localX;
      else if (localX > rect.width) outsideDistance = localX - rect.width;

      frameState[i] = {
        x: localX.toFixed(2) + 'px',
        strength: active
          ? Math.max(0, Math.min(1, 1 - outsideDistance / EDGE_FADE_PX)).toFixed(3)
          : '0'
      };
    }

    for (var k = 0; k < elements.length; k++) {
      if (!frameState[k]) continue;
      elements[k].style.setProperty('--shimmer-x', frameState[k].x);
      elements[k].style.setProperty('--shimmer-strength', frameState[k].strength);
    }

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId !== null || tabHidden || reduceMotionQuery.matches) return;
    cycleStart = null;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function restart() {
    stop();
    setAllStatic();
    refreshGeometry();
    start();
  }

  function applyMotionPreference() {
    setAllStatic();
    if (reduceMotionQuery.matches) stop();
    else restart();
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      collectElements();
      restart();
    }, 150);
  }

  function init() {
    collectElements();
    setAllStatic();
    applyMotionPreference();

    var observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('visibilitychange', function () {
    tabHidden = document.hidden;
    if (tabHidden) {
      stop();
      setAllStatic();
    } else {
      restart();
    }
  });

  window.addEventListener('resize', scheduleRefresh, { passive: true });
  window.addEventListener('orientationchange', scheduleRefresh, { passive: true });
  window.addEventListener('load', scheduleRefresh, { once: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleRefresh);
  }

  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', applyMotionPreference);
  } else if (typeof reduceMotionQuery.addListener === 'function') {
    reduceMotionQuery.addListener(applyMotionPreference);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
