(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll([
    '.proof-logo',
    '.metal-display',
    '.metal-text',
    '.metal-heading',
    '.metal-meta',
    '.metal-line',
    '.divider-proof > span',
    '.divider-proof > i',
    '.proof-button'
  ].join(','))];

  let frame = 0;
  let start = performance.now();

  const syncGeometry = () => {
    targets.forEach((target) => {
      target.style.setProperty('--beam-left', `${target.getBoundingClientRect().left}px`);
    });
  };

  const draw = (now) => {
    const travelTime = 6200;
    const restTime = 1500;
    const cycleTime = travelTime + restTime;
    const elapsed = (now - start) % cycleTime;
    const travel = Math.min(elapsed / travelTime, 1);
    const edgeRoom = 120;
    const x = -edgeRoom + travel * (window.innerWidth + edgeRoom * 2);

    root.style.setProperty('--beam-x', `${x.toFixed(2)}px`);
    frame = requestAnimationFrame(draw);
  };

  const updateMotion = () => {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) {
      root.style.setProperty('--beam-x', '-120px');
      return;
    }
    start = performance.now();
    frame = requestAnimationFrame(draw);
  };

  syncGeometry();
  updateMotion();

  window.addEventListener('resize', syncGeometry, { passive: true });
  window.addEventListener('scroll', syncGeometry, { passive: true });
  reducedMotion.addEventListener('change', updateMotion);
})();

