/* ===========================================================
   NOVELLO STONE — Bronze-gold specular reflection controller
   ===========================================================
   A single global "beam" (an invisible position, never a visible
   layer) travels right-to-left across the viewport on a timer —
   same 8s desktop / 7s mobile sweep, 1.5s initial delay, 8.5s rest,
   sine easing as before. Every frame, every registered bronze-gold
   element measures its own real distance from that beam (via
   getBoundingClientRect — actual screen position, not DOM order)
   and writes TWO custom properties on itself:

     --shimmer-x         the beam's position *inside that element's
                          own box*, as a percentage of its own width
                          (can go negative or past 100% while the beam
                          is still approaching/leaving) — this is what
                          lets each element's CSS gradient know exactly
                          where, along that specific element, to paint
                          a thin reflection line.
     --shimmer-strength   a narrow entry/exit fade (0–1): 1 while the
                          beam is anywhere inside the element's own
                          box, ramping smoothly to 0 over a small fixed
                          pixel buffer just outside the box on either
                          side, so the reflection never pops in or out.

   The CSS in base.css / home.css / materials.css / contact.css /
   story.css / launch-banner.css only ever *reads* these two variables
   — via a clipped/masked gradient (background-clip: text, a layered
   background-image, or a mask-image on the N monogram) — never a
   whole-element brightness/saturation filter or an expanding shadow.
   This file is the only place that ever *writes* them, and it writes
   real position-based values, so every element lights up in perfect
   lockstep as the same beam passes its own spot on screen: right-side
   elements first, centre next, left-side last.

   Nothing here touches layout, text, colours, hover/focus states, or
   button dimensions — it only ever sets two CSS custom properties.
   =========================================================== */

(function () {
  'use strict';

  // Every genuinely bronze-gold element the shimmer is allowed to touch.
  // Centralised here as the single source of truth — add a selector to
  // extend the effect, nothing else needs to change. Elements that are
  // gold only in a hover/active state are included here too (so
  // --shimmer-x/--shimmer-strength keep updating on them continuously);
  // the CSS rules then decide whether that value is actually *read* at
  // rest or only inside :hover/.active — the resting appearance of
  // those elements is never touched.
  var SELECTORS = [
    '.brand',                        // NOVELLO STONE wordmark
    '.brand-mark-wrap',              // N monogram (wrapper — see markup note below)
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

  // --- Timing: unchanged from the previous (glow-based) version ---
  var MOBILE_BREAKPOINT = 860; // matches the site's existing nav breakpoint
  var DESKTOP_SWEEP_MS = 8000;
  var MOBILE_SWEEP_MS = 7000;
  var INITIAL_DELAY_MS = 1500;
  var PAUSE_MS = 8500;

  // Small fixed buffer (px): both the off-screen travel padding for the
  // beam's start/end position, AND each element's own entry/exit fade
  // zone (how far outside its box the beam can be while the reflection
  // is still ramping in/out). This replaced the old wide (220–320px)
  // "spotlight" radius — that concept doesn't apply to a specular line
  // clipped to each element's own shape, only this narrow easing buffer
  // does.
  var EDGE_FADE_PX = 50;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  var elements = [];
  var rafId = null;
  var cycleStart = null;
  var tabHidden = false;
  var sweepDurationMs = DESKTOP_SWEEP_MS;
  var cycleMs = sweepDurationMs + PAUSE_MS;

  function refreshBreakpointConfig() {
    var isMobile = (window.innerWidth || document.documentElement.clientWidth) <= MOBILE_BREAKPOINT;
    sweepDurationMs = isMobile ? MOBILE_SWEEP_MS : DESKTOP_SWEEP_MS;
    cycleMs = sweepDurationMs + PAUSE_MS;
  }

  // Gentle sine ease — smooth, cinematic acceleration/deceleration with no
  // sharp onset or sudden speed change at either end of the sweep, and no
  // visible pop at the cycle boundary.
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

  function setAllStatic(x, strength) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.setProperty('--shimmer-x', x);
      elements[i].style.setProperty('--shimmer-strength', strength);
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
      // Travels from (100vw + edge) to (-edge), i.e. fully off-screen
      // right to fully off-screen left — the beam always fully clears
      // the viewport before the pause begins.
      beamX = (vw + EDGE_FADE_PX) - eased * (vw + EDGE_FADE_PX * 2);
    } else {
      beamX = -EDGE_FADE_PX * 100; // parked far off-screen during the pause
    }

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue; // not rendered (e.g. nav-cta hidden on mobile)

      var localX = beamX - rect.left; // px, relative to this element's own box
      var xPercent = rect.width > 0 ? (localX / rect.width) * 100 : 50;

      var outsideDist = 0;
      if (localX < 0) outsideDist = -localX;
      else if (localX > rect.width) outsideDist = localX - rect.width;

      var strength = outsideDist <= 0 ? 1 : Math.max(0, 1 - outsideDist / EDGE_FADE_PX);

      el.style.setProperty('--shimmer-x', xPercent.toFixed(2) + '%');
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
      // No travelling reflection at all — every element simply renders
      // its normal resting bronze appearance (per the "retain only
      // normal metallic styling" reduced-motion requirement).
      stop();
      setAllStatic('-999%', '0');
    } else {
      setAllStatic('-999%', '0');
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
