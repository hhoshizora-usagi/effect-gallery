// 帯が画面の中を通るあいだ、スクロール量に合わせて横へずらす
(() => {
  const rows = [...document.querySelectorAll('[data-fx="scroll-marquee"]')];
  const update = () => {
    rows.forEach((row) => {
      const r = row.getBoundingClientRect();
      const progress = innerHeight - r.top;          // 画面に入ってから進んだ量
      const speed = parseFloat(row.dataset.speed) || .5;
      const start = speed > 0 ? 0 : -row.scrollWidth * .3;   // 右へ流す帯は左に余白を持たせる
      row.style.transform = `translate3d(${start + progress * -speed}px, 0, 0)`;
    });
  };
  addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', update);
  update();
})();
