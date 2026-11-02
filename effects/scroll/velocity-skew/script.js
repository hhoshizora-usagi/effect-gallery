// 1フレームあたりのスクロール量（速さ）を傾きの角度に変える
(() => {
  const els = document.querySelectorAll('[data-fx="velocity-skew"]');
  let lastY = scrollY, skew = 0;
  (function loop() {
    const v = scrollY - lastY;            // スクロールの速さ
    lastY = scrollY;
    const target = Math.max(-12, Math.min(12, v * .6));
    skew += (target - skew) * .12;        // なめらかに追いかける
    els.forEach((el) => el.style.setProperty('--skew', `${skew.toFixed(2)}deg`));
    requestAnimationFrame(loop);
  })();
})();
