// クリック位置に、少しずつ遅らせた輪を3つ置く
(() => {
  const set = ['#ff3d7f', '#ffd400', '#00c2ff'];
  document.querySelectorAll('[data-fx="shockwave"]').forEach((area) => {
    area.addEventListener('pointerdown', (e) => {
      const r = area.getBoundingClientRect();
      set.forEach((c, i) => {
        const ring = document.createElement('i');
        ring.className = 'fx-shock__ring';
        ring.style.left = `${e.clientX - r.left}px`;
        ring.style.top = `${e.clientY - r.top}px`;
        ring.style.setProperty('--c', c);
        ring.style.setProperty('--delay', `${i * .08}s`);
        area.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());
      });
    });
  });
})();
