// 見本では 0 → 100% を3秒で進める。本番では進み具合（0〜1）を setProgress に渡す
(() => {
  document.querySelectorAll('[data-fx="progress-ring"]').forEach((ring) => {
    const num = ring.querySelector('.fx-ring__num');
    const setProgress = (p) => {
      ring.style.setProperty('--p', p);
      num.textContent = p >= 1 ? 'DONE!' : `${Math.round(p * 100)}%`;
      ring.setAttribute('aria-valuenow', Math.round(p * 100));
      ring.classList.toggle('is-done', p >= 1);
    };
    const start = performance.now(), dur = 3000;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      setProgress(t < 1 ? t * (2 - t) : 1);              // 最後ゆっくり
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
})();
