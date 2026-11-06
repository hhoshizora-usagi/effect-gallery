// マウスの位置を --x / --y に。穴の大きさ --r は、なめらかに広げたり縮めたりする
(() => {
  document.querySelectorAll('[data-fx="color-pop"]').forEach((root) => {
    let r = 0, target = 0;
    root.classList.add('is-idle');
    root.addEventListener('pointermove', (e) => {
      const b = root.getBoundingClientRect();
      root.style.setProperty('--x', `${e.clientX - b.left}px`);
      root.style.setProperty('--y', `${e.clientY - b.top}px`);
      root.classList.remove('is-idle');
      target = 80;
    });
    root.addEventListener('pointerleave', () => { target = 0; root.classList.add('is-idle'); });
    (function loop() {
      r += (target - r) * .15;
      root.style.setProperty('--r', `${r.toFixed(1)}px`);
      requestAnimationFrame(loop);
    })();
  });
})();
