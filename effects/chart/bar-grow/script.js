// 画面に入ったら .is-in をつけて棒を伸ばし、数字も 0 → --v まで数える
(() => {
  // 画面に入ったら1回だけ動かす
  const onVisible = (el, fn) => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { fn(); io.disconnect(); }
    }, { threshold: .4 });
    io.observe(el);
  };

  document.querySelectorAll('[data-fx="bar-grow"]').forEach((chart) => {
    const cols = [...chart.querySelectorAll('.fx-bars__col')];
    cols.forEach((c, i) => c.style.setProperty('--i', i));
    onVisible(chart, () => {
      chart.classList.add('is-in');
      cols.forEach((c, i) => {
        const to = parseFloat(getComputedStyle(c).getPropertyValue('--v'));
        const b = c.querySelector('b');
        const start = performance.now() + i * 120;
        const tick = (now) => {
          const t = Math.min(1, Math.max(0, (now - start) / 1200));
          b.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))) + '%';
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    });
  });
})();
