/* ===========================================================
   NOVELLO STONE — Single bronze-gold chrome beam
   ===========================================================
   One invisible 15-degree light axis moves left-to-right through the
   whole document. Its top edge leads and its lower edge arrives later,
   so bronze details do not all illuminate at once. CSS clips the beam
   to bronze glyphs, masks, fills and strokes only.
   =========================================================== */

(function () {
  'use strict';

  if (window.__novelloChromeBeamInitialized) return;
  window.__novelloChromeBeamInitialized = true;

  /* Structural bronze surfaces and the signature identity treatments. */
  var SELECTORS = [
    '.brand-mark-wrap',
    '.brand .metal-letter',
    '.hero h1 em .metal-letter',
    '.nav-links > li > a.active',
    '.btn-primary',
    '.btn-primary .chrome-button-label',
    '.nav-cta',
    '.nav-cta .chrome-button-label',
    '.launch-card',
    '.launch-card-eyebrow',
    '.launch-card p strong',
    '.launch-card a.launch-card-cta'
    ,'.brand-divider'
    ,'.gold-divider'
    ,'.hr'
    ,'.corridor-route'
  ];

  /* Full bronze frames receive a border-clipped version of the same beam.
     Keep this list to true four-sided frames so left-rule editorial accents
     retain their intentional geometry. */
  var FRAME_SELECTORS = [
    '.pillar-grid',
    '.pillar-card',
    '.value-card',
    '.scenario-card',
    '.material-es-card',
    '.material-link-card',
    '.story-welcome-grid',
    '.corridor-journey',
    '.form-card',
    '.vcard-save',
    '.note-box',
    '.coverage-towns li',
    '.footer-social a'
  ];

  /* Text already rendered with a metallic gradient has a transparent
     computed colour, so list those semantic accents explicitly. */
  var METALLIC_TEXT_SELECTORS = [
    '.eyebrow',
    '.hero-stats .stat-value',
    '.pillar-link',
    '.process-step .step-mono',
    '.story-process-step .step-mono',
    '.material-es-card .mono',
    '.material-care-item .step-mono',
    '.material-link-card .mono',
    '.material-qa-item h4',
    '.contact-detail .mono-label',
    '.contact-person .mono-label',
    '.vcard-link',
    '.story-pricing-item h4',
    '.placeholder-label .tag',
    '.mobile-menu a.mobile-menu-cta',
    '.value-card .mono',
    '.about-stat .stat-value',
    '.how-we-work-step .step-mono',
    '.scenario-card .mono',
    '.visit-callout strong'
  ];

  /* Resolved CSS colours from the official supplied six-swatch scale. This
     catches page-specific bronze copy without recolouring limestone headings
     or body text. */
  var BRONZE_COMPUTED_COLORS = new Set([
    'rgb(241, 217, 183)',
    'rgb(210, 179, 140)',
    'rgb(185, 151, 95)',
    'rgb(165, 131, 63)',
    'rgb(140, 100, 55)',
    'rgb(63, 46, 27)'
  ]);

  var MOBILE_BREAKPOINT = 860;
  /* Let the polished strip dwell long enough to describe the bevel of every
     independent brand letter while remaining one shared document-wide beam. */
  var COMPACT_VIEWPORT_CROSS_MS = 4800;
  var WIDE_VIEWPORT_CROSS_MS = 6200;
  var WIDE_VIEWPORT_REFERENCE_PX = 1920;
  var ANGLE_FROM_VERTICAL_DEG = 15;
  var VERTICAL_LAG_PER_PX = Math.tan(ANGLE_FROM_VERTICAL_DEG * Math.PI / 180);
  var DESKTOP_TRAVEL_PADDING_PX = 170;
  var MOBILE_TRAVEL_PADDING_PX = 110;
  var EDGE_FADE_PX = 22;
  /* Give the header, fonts and hero media time to settle before the first
     pass so the N -> wordmark -> hero sequence is visible on initial load. */
  var INITIAL_DELAY_MS = 1500;
  var PAUSE_MS = 5200;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var elements = [];
  var frameState = [];
  var rafId = null;
  var cycleStart = null;
  var tabHidden = document.hidden;
  var travelPaddingPx = DESKTOP_TRAVEL_PADDING_PX;
  var sweepDurationMs = COMPACT_VIEWPORT_CROSS_MS;
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

  function viewportCrossDuration(width) {
    if (width <= MOBILE_BREAKPOINT) return COMPACT_VIEWPORT_CROSS_MS;

    var responsiveRange = WIDE_VIEWPORT_REFERENCE_PX - MOBILE_BREAKPOINT;
    var widthProgress = Math.max(0, Math.min(
      1,
      (width - MOBILE_BREAKPOINT) / responsiveRange
    ));

    return COMPACT_VIEWPORT_CROSS_MS
      + (WIDE_VIEWPORT_CROSS_MS - COMPACT_VIEWPORT_CROSS_MS) * widthProgress;
  }

  function refreshGeometry() {
    var width = viewportWidth();
    var height = documentHeight();
    travelPaddingPx = width <= MOBILE_BREAKPOINT
      ? MOBILE_TRAVEL_PADDING_PX
      : DESKTOP_TRAVEL_PADDING_PX;

    var viewportCrossMs = viewportCrossDuration(width);
    var pixelsPerSecond = width / (viewportCrossMs / 1000);
    travelDistancePx = width + travelPaddingPx * 2 + height * VERTICAL_LAG_PER_PX;
    sweepDurationMs = (travelDistancePx / pixelsPerSecond) * 1000;
    cycleMs = sweepDurationMs + PAUSE_MS;
  }

  function collectElements() {
    var found = [];
    var seen = new Set();

    function record(element, isBronzeText) {
      element.setAttribute('data-bronze-shimmer', '');
      if (isBronzeText) element.setAttribute('data-bronze-text-shimmer', '');
      if (seen.has(element)) return;
      seen.add(element);
      found.push(element);
    }

    for (var i = 0; i < SELECTORS.length; i++) {
      var matches = document.querySelectorAll(SELECTORS[i]);
      for (var j = 0; j < matches.length; j++) {
        record(matches[j], false);
      }
    }

    for (var f = 0; f < FRAME_SELECTORS.length; f++) {
      var frameMatches = document.querySelectorAll(FRAME_SELECTORS[f]);
      for (var q = 0; q < frameMatches.length; q++) {
        frameMatches[q].setAttribute('data-bronze-frame-shimmer', '');
        record(frameMatches[q], false);
      }
    }

    for (var m = 0; m < METALLIC_TEXT_SELECTORS.length; m++) {
      var metallicMatches = document.querySelectorAll(METALLIC_TEXT_SELECTORS[m]);
      for (var n = 0; n < metallicMatches.length; n++) {
        record(metallicMatches[n], true);
      }
    }

    /* Catch every remaining intentional bronze text node by its resolved
       colour. Requiring direct text avoids painting parent containers twice. */
    var textCandidates = document.body.querySelectorAll('*');
    for (var t = 0; t < textCandidates.length; t++) {
      var candidate = textCandidates[t];
      var tag = candidate.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' ||
          tag === 'PATH' || tag === 'IMG' || tag === 'VIDEO') continue;

      var hasDirectText = false;
      for (var c = 0; c < candidate.childNodes.length; c++) {
        if (candidate.childNodes[c].nodeType === 3 &&
            candidate.childNodes[c].nodeValue.trim()) {
          hasDirectText = true;
          break;
        }
      }
      if (!hasDirectText) continue;

      if (BRONZE_COMPUTED_COLORS.has(getComputedStyle(candidate).color)) {
        record(candidate, true);
      }
    }

    /* The N uses the same global beam, but needs its own local geometry.
       Recording the wrapper here keeps the strip continuous across the
       identity while giving the narrow monogram mask a correctly measured
       --shimmer-x and strength instead of relying on the wider wordmark. */
    var brandMarks = document.querySelectorAll('.brand .brand-mark-wrap');
    for (var k = 0; k < brandMarks.length; k++) {
      record(brandMarks[k], false);
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
