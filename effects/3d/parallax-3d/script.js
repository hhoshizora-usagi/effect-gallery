// マウスの位置に応じて、層ごとに違う量ずらす
(() => {
  document.querySelectorAll('[data-fx="parallax3d"]').forEach((host) => {
    const layers = host.querySelectorAll('[data-depth]');
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth) || 0.5;
        l.style.transform = `translate(${-x * d * 60}px, ${-y * d * 60}px)`;
      });
    });
    host.addEventListener('pointerleave', () => {
      layers.forEach((l) => { l.style.transform = ''; });
    });
  });
})();
