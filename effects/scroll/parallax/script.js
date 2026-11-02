// data-speed の値 × スクロール量 だけ、上下にずらす（マイナスなら逆向き）
(() => {
  const els = [...document.querySelectorAll('[data-fx="parallax"]')];
  let ticking = false;
  const update = () => {
    els.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0;
      el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();
