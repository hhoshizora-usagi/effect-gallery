// 見本では2秒で 0→100%。本番では画像の読み込み数などに合わせて p を進める
(() => {
  document.querySelectorAll('[data-fx="loader"]').forEach((el) => {
    const num = el.querySelector('.fx-loader__num');
    const dur = 2000, start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const p = Math.round((1 - Math.pow(1 - t, 2)) * 100);
      num.textContent = `${p}%`;
      el.style.setProperty('--p', `${p}%`);
      if (t < 1) return requestAnimationFrame(tick);
      setTimeout(() => el.classList.add('is-done'), 250);
      setTimeout(() => el.classList.add('is-gone'), 1200);
    };
    requestAnimationFrame(tick);
  });
})();
