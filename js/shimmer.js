/* ===========================================================
   NOVELLO STONE — Bronze-gold shimmer controller
   ===========================================================
   A single global "beam" (an invisible position, never a visible
   layer) travels right-to-left across the viewport on a timer. Every
   frame, every registered bronze-gold element measures its own real
   distance from that beam (via getBoundingClientRect — actual screen
   position, not DOM order) and writes the result as a 0–1
   --shimmer-strength custom property on itself. The CSS in base.css /
   home.css / materials.css / contact.css / launch-banner.css only ever
   *reads* that variable (brightness/saturation/glow) — this file is the
   only place that ever *writes* it, and it writes real position-based
   values, so every element lights up in perfect lockstep as the same
   beam passes its own spot on screen, with no independent per-element
   animations to fall out of sync.

   Nothing here touches layout, text, colours, hover/focus states, or
   button dimensions — it only ever sets one CSS custom property.
   =========================================================== */

(function () {
  'use strict';

  // Every genuinely bronze-gold element the shimmer is allowed to touch.
  // Centralised here as the single source of truth — add a selector to
  // extend the effect, nothing else needs to change.
  var SELECTORS = [
    '.brand',                        // NOVELLO STONE wordmark
    '.brand-mark',                   // N monogram
    '.hero h1 em',                   // hero highlighted word ("stone")
    '.btn-primary',                  // gold "Request a Quote" button (hero)
    '.nav-cta',                      // gold "Request a Quote" button (nav)
    '.eyebrow',                      // eyebrow labels sitewide (+ their ::before line)
    '.nav-links a.active',           // active nav link (only its ::after underline reacts)
    '.hero-stats .stat-value',       // hero "01 / 02 / 03" numbers
    '.pillar-link',                  // "How we work →" links (+ their → arrow)
    '.step-mono',                    // process-step / care-step numbers
    '.brand-divider .diamond',       // footer divider accent
    '.material-es-card .mono',       // material page etch/stain labels
    '.material-link-card .mono',     // material hub link-card labels
    '.contact-detail .mono-label',   // contact page detail labels
    '.contact-person .mono-label',   // contact page team-card labels
    '.vcard-link',                   // contact page vCard link
    '.launch-card',                  // "Coming soon" notice — marked only so its
                                      // ::before accent bar can inherit the value;
                                      // the card body itself has no shimmer rule
    '.launch-card-eyebrow',          // notice "COMING SOON" label
    '.launch-card p strong',         // notice bolded date
    '.launch-card a.launch-card-cta' // notice "GET IN TOUCH →" link
  ];

  var BEAM_RADIUS_VW = 12;     // how wide the soft falloff is, in vw either side of the beam
  var FALLOFF_POWER = 1.6;     // >1 = a softer, more concentrated "spotlight" edge than a plain linear ramp
  var INITIAL_DELAY_MS = 1200;
  var SWEEP_DURATION_MS = 3800;
  var PAUSE_MS = 10500;
  var CYCLE_MS = SWEEP_DURATION_MS + PAUSE_MS;
  var STATIC_REDUCED_MOTION_STRENGTH = '0.22'; // fixed, very subtle glow — no travelling motion

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  var elements = [];
  var rafId = null;
  var cycleStart = null;
  var tabHidden = false;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

    var cyclePos = elapsed % CYCLE_MS;
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var beamRadiusPx = (BEAM_RADIUS_VW / 100) * vw;

    var beamX;
    if (cyclePos <= SWEEP_DURATION_MS) {
      var t = cyclePos / SWEEP_DURATION_MS;
      var eased = easeInOutCubic(t);
      // Travels from (100vw + radius) to (-radius), i.e. fully off-screen
      // right to fully off-screen left, per spec.
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
    recalcTimer = setTimeout(collectElements, 150);
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
