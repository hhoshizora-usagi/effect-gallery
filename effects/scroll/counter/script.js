// 画面に入ったら、1.8秒かけて 0 → data-to まで数字を増やす
(() => {
  const ease = (t) => 1 - Math.pow(1 - t, 3);      // 最後にゆっくり止まる
  const run = (el) => {
    const to = parseFloat(el.dataset.to) || 0;
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1800, start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const val = to * ease(t);
      el.textContent = val.toLocaleString('ja-JP', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-fx="counter"]').forEach((el) => io.observe(el));
})();
