// レンズの背景に同じ画像を拡大して敷き、マウスの位置に合わせてずらす
(() => {
  document.querySelectorAll('[data-fx="magnifier"]').forEach((root) => {
    const img = root.querySelector('img');
    const lens = root.querySelector('.fx-mag-img__lens');
    const zoom = parseFloat(root.dataset.zoom) || 2.5;
    lens.style.backgroundImage = `url("${img.src}")`;

    root.addEventListener('pointermove', (e) => {
      const r = img.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const half = lens.offsetWidth / 2;
      lens.style.left = `${x - half}px`;
      lens.style.top = `${y - half}px`;
      lens.style.backgroundSize = `${r.width * zoom}px ${r.height * zoom}px`;
      lens.style.backgroundPosition = `${-(x * zoom - half)}px ${-(y * zoom - half)}px`;
      root.classList.add('is-on');
    });
    root.addEventListener('pointerleave', () => root.classList.remove('is-on'));
  });
})();
