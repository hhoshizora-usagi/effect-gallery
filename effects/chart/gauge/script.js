// ばねの動き（行きすぎて戻る）で --p を 0 → 目標値まで動かす。針とゲージは --p で連動
(() => {
  // 画面に入ったら1回だけ動かす
  const onVisible = (el, fn) => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { fn(); io.disconnect(); }
    }, { threshold: .4 });
    io.observe(el);
  };

  document.querySelectorAll('[data-fx="gauge"]').forEach((g) => {
    const target = Math.min(100, +g.dataset.value || 0);
    const num = g.querySelector('.fx-gauge__num');
    onVisible(g, () => {
      let p = 0, v = 0;
      (function step() {
        v += (target - p) * .02;        // 目標へ引っぱる力
        v *= .88;                       // 空気抵抗
        p += v;
        g.style.setProperty('--p', Math.max(0, Math.min(100, p)).toFixed(2));
        num.textContent = Math.round(Math.max(0, p));
        if (Math.abs(v) > .01 || Math.abs(target - p) > .1) requestAnimationFrame(step);
        else { g.style.setProperty('--p', target); num.textContent = target; }
      })();
    });
  });
})();
