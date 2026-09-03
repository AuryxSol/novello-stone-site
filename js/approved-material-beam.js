/* ===========================================================
   NOVELLO STONE — approved synchronized strip-light beam
   One viewport-level x axis drives every bronze-gold surface.
   Timing matches the approved material proof exactly.
   =========================================================== */

(() => {
  if (window.__novelloApprovedMaterialBeam) return;
  window.__novelloApprovedMaterialBeam = true;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const bronzeColors = new Set([
    'rgb(241, 217, 183)',
    'rgb(210, 179, 140)',
    'rgb(185, 151, 95)',
    'rgb(165, 131, 63)',
    'rgb(140, 100, 55)',
    'rgb(63, 46, 27)'
  ]);

  const textSelectors = [
    '[data-approved-metal-text]',
    '.brand-wordmark',
    '.hero h1 em',
    '.hero-metal-word',
    '.eyebrow',
    '.hero-stats .stat-value',
    '.pillar-link',
    '.process-step .step-mono',
    '.story-process-step .step-mono',
    '.story-welcome-card .step-mono',
    '.material-es-card .mono',
    '.material-care-item .step-mono',
    '.material-link-card .mono',
    '.material-qa-item h4',
    '.contact-detail .mono-label',
    '.contact-person .mono-label',
    '.vcard-link',
    '.story-pricing-item h4',
    '.placeholder-label .tag',
    '.mobile-menu-cta',
    '.value-card .mono',
    '.about-stat .stat-value',
    '.how-we-work-step .step-mono',
    '.scenario-card .mono',
    '.visit-callout strong',
    '.launch-card-eyebrow',
    '.launch-card p strong',
    '.launch-card-cta',
    '.corridor-label'
  ];

  const surfaceSelectors = ['.btn-primary', '.nav-cta'];
  const lineSelectors = ['.hr', '.gold-divider', '.brand-divider .diamond', '.approved-edge-line'];
  const pseudoHostSelectors = [
    '.eyebrow',
    '.brand-divider',
    '.nav-links a.active',
    '.faq-item summary',
    '.pillar-link',
    '.launch-card',
    '.launch-card-cta',
    '.corridor-route',
    '.corridor-route span',
    '.page-rail button'
  ];
  const frameSelectors = [
    '.pillars-grid',
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
    '.footer-social a',
    '.launch-card'
  ];
  const edgeDefinitions = [
    { selector: '.hero-stats', sides: ['top'] },
    { selector: '.pillar-pricing', sides: ['top'] },
    { selector: '.process-step', sides: ['left'] },
    { selector: '.fleet-story', sides: ['left'] },
    { selector: '.faq-item', sides: ['bottom'] },
    { selector: '.about-stats', sides: ['top'] },
    { selector: '.how-we-work-step', sides: ['left'] },
    { selector: '.material-care-item', sides: ['left'] },
    { selector: '.material-qa-item:not(:last-child)', sides: ['bottom'] },
    { selector: '.contact-people', sides: ['top', 'bottom'] },
    { selector: '.contact-person', sides: ['left'] },
    { selector: '.story-name-meaning', sides: ['top', 'bottom'] },
    { selector: '.story-name-stage', sides: ['top'] },
    { selector: '.story-value', sides: ['left'] },
    { selector: '.story-process-step', sides: ['left'] },
    { selector: '.story-fleet-note', sides: ['left'] },
    { selector: '.note-box', sides: ['left'] },
    { selector: '.service-list li', sides: ['bottom'] },
    { selector: '.footer-grid', sides: ['bottom'] }
  ];

  let targets = [];
  let geometry = [];
  let frame = 0;
  let start = performance.now();
  let refreshTimer = 0;
  let geometryDirty = true;

  const hasDirectText = (element) => [...element.childNodes].some((node) =>
    node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()
  );

  const collect = () => {
    const found = new Set();

    const track = (element) => {
      if (!element) return;
      element.setAttribute('data-approved-beam', '');
      found.add(element);
    };

    edgeDefinitions.forEach(({ selector, sides }) => {
      document.querySelectorAll(selector).forEach((host) => {
        host.setAttribute('data-approved-edge-host', '');
        sides.forEach((side) => {
          if (host.querySelector(`:scope > .approved-edge-line[data-approved-edge="${side}"]`)) return;
          const edge = document.createElement('span');
          edge.className = 'approved-edge-line';
          edge.setAttribute('data-approved-edge', side);
          edge.setAttribute('aria-hidden', 'true');
          host.appendChild(edge);
        });
      });
    });

    document.querySelectorAll(textSelectors.join(',')).forEach((element) => {
      if (!element.classList.contains('chrome-button-label')) {
        element.setAttribute('data-approved-metal-text', '');
      }
      track(element);
    });

    document.querySelectorAll(surfaceSelectors.join(',')).forEach((element) => {
      element.setAttribute('data-approved-metal-surface', '');
      track(element);
    });

    document.querySelectorAll(lineSelectors.join(',')).forEach((element) => {
      element.setAttribute('data-approved-metal-line', '');
      track(element);
    });

    document.querySelectorAll(pseudoHostSelectors.join(',')).forEach(track);

    document.querySelectorAll(frameSelectors.join(',')).forEach((element) => {
      element.setAttribute('data-approved-metal-frame', '');
      track(element);
    });

    document.querySelectorAll('.brand-mark-wrap').forEach(track);

    document.body.querySelectorAll('*').forEach((element) => {
      if (element.matches('script, style, svg, path, img, video, .chrome-button-label')) return;
      if (!hasDirectText(element)) return;
      if (!bronzeColors.has(getComputedStyle(element).color)) return;
      element.setAttribute('data-approved-metal-text', '');
      track(element);
    });

    targets = [...found];
    geometry = new Array(targets.length);
    geometryDirty = true;
  };

  const syncGeometry = () => {
    geometry = targets.map((target) => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--approved-beam-left', `${rect.left}px`);
      return { left: rect.left, right: rect.right, width: rect.width };
    });
    geometryDirty = false;
  };

  const clearBeam = () => {
    root.style.setProperty('--approved-beam-x', '-120px');
    targets.forEach((target) => target.style.setProperty('--approved-beam-strength', '0'));
  };

  const draw = (now) => {
    if (geometryDirty) syncGeometry();

    const travelTime = 6200;
    // Keep the approved 6.2-second sweep untouched, then let the page rest
    // before the same synchronized strip light re-enters from the left.
    const restTime = 6500;
    const cycleTime = travelTime + restTime;
    const elapsed = (now - start) % cycleTime;
    const travel = Math.min(elapsed / travelTime, 1);
    const edgeRoom = 120;
    const x = -edgeRoom + travel * (window.innerWidth + edgeRoom * 2);

    root.style.setProperty('--approved-beam-x', `${x.toFixed(2)}px`);

    targets.forEach((target, index) => {
      const rect = geometry[index];
      if (!rect || rect.width === 0) {
        target.style.setProperty('--approved-beam-strength', '0');
        return;
      }
      const distance = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
      const strength = Math.max(0, Math.min(1, 1 - distance / 22));
      target.style.setProperty('--approved-beam-strength', strength.toFixed(3));
    });

    frame = requestAnimationFrame(draw);
  };

  const updateMotion = () => {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) {
      clearBeam();
      return;
    }
    start = performance.now();
    frame = requestAnimationFrame(draw);
  };

  const scheduleCollect = () => {
    clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => {
      collect();
      syncGeometry();
    }, 80);
  };

  collect();
  syncGeometry();
  updateMotion();

  const observer = new MutationObserver(scheduleCollect);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('resize', () => { geometryDirty = true; }, { passive: true });
  window.addEventListener('scroll', () => { geometryDirty = true; }, { passive: true });
  window.addEventListener('load', scheduleCollect, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      clearBeam();
    } else {
      updateMotion();
    }
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleCollect);
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', updateMotion);
  } else {
    reducedMotion.addListener(updateMotion);
  }
})();
