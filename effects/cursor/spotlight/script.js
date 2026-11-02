// マウスの位置を CSS 変数 --x / --y に入れて、明るい丸を動かす
(() => {
  document.querySelectorAll('[data-fx="spotlight"]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--x', `${e.clientX - r.left}px`);
      el.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--x', '50%');
      el.style.setProperty('--y', '50%');
    });
  });
})();
