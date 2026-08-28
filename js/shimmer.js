/* ===========================================================
   NOVELLO STONE — Bronze-gold shimmer controller
   ===========================================================
   A single global "beam" (an invisible position, never a visible
   layer) travels right-to-left across the viewport on a timer. Every
   frame, every registered bronze-gold element measures its own real
   distance from that beam (via getBoundingClientRect — actual screen
   position, not DOM order) and writes the result as a 0–1
   --shimmer-strength custom property on itself. The CSS in base.css /
   home.css / materials.css / contact.css / story.css / launch-banner.css
   only ever *reads* that variable (brightness/saturation/glow) — this
   file is the only place that ever *writes* it, and it writes real
   position-based values, so every element lights up in perfect
   lockstep as the same beam passes its own spot on screen: right-side
   elements first, centre next, left-side last — with no independent
   per-element animations to fall out of sync.

   Nothing here touches layout, text, colours, hover/focus states, or
   button dimensions — it only ever sets one CSS custom property.
   =========================================================== */

(function () {
  'use strict';

  // Every genuinely bronze-gold element the shimmer is allowed to touch.
  // Centralised here as the single source of truth — add a selector to
  // extend the effect, nothing else needs to change. Elements that are
  // gold only in a hover/active state are included here too (so
  // --shimmer-strength keeps updating on them continuously); the base.css
  // rules then decide whether that value is actually *read* at rest or
  // only inside :hover/.active — the resting appearance of those
  // elements is never touched.
  var SELECTORS = [
    '.brand',                        // NOVELLO STONE wordmark
    '.brand-mark',                   // N monogram
    '.hero h1 em',                   // hero highlighted word ("stone")
    '.btn-primary',                  // gold "Request a Quote" button (hero)
    '.btn-ghost-dark',                // ghost button — gold only on hover
    '.btn-ghost',                     // ghost button — gold only on hover
    '.nav-cta',                      // gold "Request a Quote" button (nav)
    '.eyebrow',                      // eyebrow labels sitewide (+ their ::before line)
    '.nav-links a',                   // nav links — gold only on hover/.active underline
    '.nav-dropdown-menu a',           // materials dropdown links — gold on hover/.active
    '.mobile-menu-cta',               // mobile menu "Request a Quote" link
    '.hero-stats .stat-value',       // hero "01 / 02 / 03" numbers
    '.pillar-link',                  // "How we work →" links (+ their → arrow)
    '.step-mono',                    // process-step / care-step numbers
    '.brand-divider',                 // footer divider — parent, for its flanking lines
    '.brand-divider .diamond',       // footer divider accent
    '.gold-divider',                  // premium horizontal divider
    '.faq-item summary',              // FAQ row — parent, for its +/- icon
    '.material-es-card .mono',       // material page etch/stain labels
    '.material-link-card .mono',     // material hub link-card labels
    '.contact-detail .mono-label',   // contact page detail labels
    '.contact-detail a',              // contact page detail links — gold only on hover
    '.contact-person .mono-label',   // contact page team-card labels
    '.contact-person a',              // contact page team links — gold only on hover
    '.vcard-link',                   // contact page vCard link
    '.footer-grid a',                 // footer links — gold only on hover
    '.footer-social a',               // footer social icons — gold only on hover
    '.launch-card',                  // "Coming soon" notice — marked only so its
                                      // ::before accent bar can inherit the value;
                                      // the card body itself has no shimmer rule
    '.launch-card-eyebrow',          // notice "COMING SOON" label
    '.launch-card p strong',         // notice bolded date
    '.launch-card a.launch-card-cta' // notice "GET IN TOUCH →" link
  ];

  // --- Timing & geometry: explicit, breakpoint-aware, in real pixels ---
  // (never viewport-relative — a narrow phone and a wide desktop each
  // get a beam sized and timed for that class of screen).
  var MOBILE_BREAKPOINT = 860; // matches the site's existing nav breakpoint

  var DESKTOP_BEAM_RADIUS_PX = 260; // within the 220–320px spec range
  var MOBILE_BEAM_RADIUS_PX = 150;  // within the 120–180px spec range

  var DESKTOP_SWEEP_MS = 8000; // within the 7500–8500ms spec range
  var MOBILE_SWEEP_MS = 7000;  // within the 6500–7500ms spec range

  var INITIAL_DELAY_MS = 1500; // first sweep begins ~1.5s after load
  var PAUSE_MS = 8500;         // rest between sweeps, within the 7–10s spec range

  var FALLOFF_POWER = 1.45;    // soft, feathered spotlight edge on both sides
  var STATIC_REDUCED_MOTION_STRENGTH = '0.22'; // fixed, very subtle glow — no travelling motion

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  var elements = [];
  var rafId = null;
  var cycleStart = null;
  var tabHidden = false;

  // Cached per-breakpoint config, refreshed on resize/orientation change
  // rather than read every animation frame.
  var beamRadiusPx = DESKTOP_BEAM_RADIUS_PX;
  var sweepDurationMs = DESKTOP_SWEEP_MS;
  var cycleMs = sweepDurationMs + PAUSE_MS;

  function refreshBreakpointConfig() {
    var isMobile = (window.innerWidth || document.documentElement.clientWidth) <= MOBILE_BREAKPOINT;
    beamRadiusPx = isMobile ? MOBILE_BEAM_RADIUS_PX : DESKTOP_BEAM_RADIUS_PX;
    sweepDurationMs = isMobile ? MOBILE_SWEEP_MS : DESKTOP_SWEEP_MS;
    cycleMs = sweepDurationMs + PAUSE_MS;
  }

  // Gentle sine ease — smooth, cinematic acceleration/deceleration with no
  // sharp onset or sudden speed change at either end of the sweep, and no
  // visible pop at the cycle boundary (the beam is already fully off-screen,
  // and every element's strength has already decayed to 0, well before the
  // sweep phase ends).
  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function collectElements() {
    var found = [];
    var seen = new Set();
    for (var i = 0; i < SELECTORS.length; i++) {
      var matches = document.querySelectorAll(SELECTORS[i]);
      for (var j = 0; j < matches.length; j++) {
        if (!seen.has(matches[j])) {
          seen.add(matches[j]);
          found.push(matches[j]);
          matches[j].setAttribute('data-bronze-shimmer', '');
        }
      }
    }
    elements = found;
  }

  function setAllStrength(value) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.setProperty('--shimmer-strength', value);
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

    var cyclePos = elapsed % cycleMs;
    var vw = document.documentElement.clientWidth || window.innerWidth;

    var beamX;
    if (cyclePos <= sweepDurationMs) {
      var t = cyclePos / sweepDurationMs;
      var eased = easeInOutSine(t);
      // Travels from (100vw + radius) to (-radius), i.e. fully off-screen
      // right to fully off-screen left, per spec — the beam always fully
      // clears the viewport before the pause begins.
      beamX = (vw + beamRadiusPx) - eased * (vw + beamRadiusPx * 2);
    } else {
      beamX = -beamRadiusPx * 100; // parked far off-screen during the pause
    }

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue; // not rendered (e.g. nav-cta hidden on mobile)
      var centerX = rect.left + rect.width / 2;
      var raw = 1 - Math.abs(centerX - beamX) / beamRadiusPx;
      var strength = raw > 0 ? Math.pow(raw, FALLOFF_POWER) : 0;
      el.style.setProperty('--shimmer-strength', strength.toFixed(3));
    }

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId !== null) return; // never run two loops at once
    cycleStart = null;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function applyReducedMotionState() {
    if (reduceMotionQuery.matches) {
      stop();
      setAllStrength(STATIC_REDUCED_MOTION_STRENGTH);
    } else {
      setAllStrength('0');
      start();
    }
  }

  function init() {
    refreshBreakpointConfig();
    collectElements();
    applyReducedMotionState();
  }

  document.addEventListener('visibilitychange', function () {
    tabHidden = document.hidden;
    if (!tabHidden && !reduceMotionQuery.matches) {
      cycleStart = null; // resync cleanly rather than jumping ahead by the hidden duration
      start();
    }
  });

  var recalcTimer = null;
  function scheduleRecollect() {
    clearTimeout(recalcTimer);
    recalcTimer = setTimeout(function () {
      refreshBreakpointConfig();
      collectElements();
    }, 150);
  }
  window.addEventListener('resize', scheduleRecollect);
  window.addEventListener('orientationchange', scheduleRecollect);
  window.addEventListener('load', collectElements);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(collectElements);
  }

  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', applyReducedMotionState);
  } else if (typeof reduceMotionQuery.addListener === 'function') {
    reduceMotionQuery.addListener(applyReducedMotionState); // older Safari
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
